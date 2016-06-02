'use strict';

module.exports = /*@ngInject*/ function(HttpService, CarInfoService, CommonUtilsService, SpringUtilsService, $cookies, $q) {

  //var vin = $cookies['vin'];
  var MileStone = function() {
    return {
      'vin'     : '',
      'crtnMilg': 0,
      'insDt'   : '',
      'insMilg' : null,
      'plOfWk'  : null,
      'notes'   : null,
      'rgstDtm' : null,
      'rgstId'  : null,
      'mdfyDtm' : null,
      'mdfyId'  : null,
      'completed' : false,
      'ignored'   : false,
      'hasNotes' : false
    };
  };

  // helper functions
  function processIntervalDetail(data) {
    var i;
    var retObj = {'inspect':[], 'replace':[]};
    for (i=0;i<data.length;i++) {
      if (data[i].action === 'I') { retObj.inspect.push(data[i]); }
      else {retObj.replace.push(data[i]);}
    }
    return retObj;
  }

  function processCurrentAppointments(data) {
    var i;
    for (i=0;i<data.length;i++) {
      data[i].appnDisplay = moment(data[i].appnTim).format('h:mm A, MMM DD, YYYY');
      data[i].appnDay = moment(data[i].appnTim).format('DD');
      data[i].appnBegin = moment(data[i].appnTim).format('M/D/YYYY h:mm a');
      data[i].appnEnd = moment(data[i].appnTim).add(1,'h').format('M/D/YYYY h:mm a');
    }
    return data;
  }

  // return functions
  function processMilestones(intervals, compIgnore) {
    // sorted intervals
   
    var sorted = intervals.sort(function(a,b) {return a - b;});
    var i, foundNextMileage = false,
      currentMileage = CarInfoService.carInfo().selectedVehicle.acumTrvgDistMile;
    var returnObj = {
        'milestones': [],
        'currentMileage': currentMileage,
        'milesToNextInterval': 0,
        'prevMilestone':'',
        'nextMilestone':0
    };
   
    for (i = 0; i < sorted.length; i++) {
      // make new MileStone object to push to return array
      var newItem = new MileStone();
      newItem['crtnMilg'] = sorted[i];
      //newItem['insMilg'] = compIgnore[sorted[i].toSting]

      // fill in completed/ignored data into MileStone object
      var item = compIgnore[sorted[i].toString()];
      if (item) {
        for (var prop in item) {
          if (item[prop]) { newItem[prop] = item[prop]; }
        }

        // If date is set, milestone is completed, otherwise it is ignored.
        // The milestones not in the compIgnore will be default both the fields to be false.
        if (newItem['insDt'] !== '') {newItem['completed'] = true;}
        else {newItem['ignored'] = true;}
      }

      // add field for miles til next interval
      if (!foundNextMileage && sorted[i] > currentMileage) {
        foundNextMileage = true;
        returnObj.nextMilestone = sorted[i];
        returnObj.prevMilestone = (i > 0) ? sorted[i-1] : '';
        returnObj.milesToNextInterval = sorted[i] - currentMileage;
      }

      // set hasNotes field
      if (newItem['plOfWk'] || newItem['insDt'] || newItem['notes'] || newItem['insMilg']) {
        newItem['hasNotes'] = true;
      }

      returnObj.milestones.push(newItem);
    }

    return returnObj;
  }

  function getCurrentAppointments() {
    var deferred = $q.defer();
    HttpService.get('/ccw/omn/mntn/getCurrentMainAppts.do?vin=').success(function(data) {
      deferred.resolve(processCurrentAppointments(data.result));
    });
    return deferred.promise;
  }

  function getOilChangeDetail() {
    var deferred = $q.defer();
    HttpService.get('/ccw/kh/maintenanceData.do').success(function(data) {
      deferred.resolve(data);
    });
    return deferred.promise;
  }

  function getIntervalDetail(interval) {
    var deferred = $q.defer();
    HttpService.post('/ccw/kh/service/maintenance/intervals.do', {'interval':interval}).success(function(data) {
      deferred.resolve(processIntervalDetail(data.details));
    });
    return deferred.promise;
  }

  function getMileStones() {
    var deferred = $q.defer();
    HttpService.get('/ccw/omn/mntn/getMntnMileStones.do').success(function(data) {
      deferred.resolve(data.result);
    });
    return deferred.promise;    
  }

  function getCompleteIgnoreInfo() {
    var deferred = $q.defer();
    HttpService.get('/ccw/omn/mtn/mntRecordsCompleted.do?vin=').success(function(data) {
      deferred.resolve(data.result);
    });
    return deferred.promise;
  }

  function getDtcDetails() {
    var deferred = $q.defer();
    var url1 = ($cookies['gen'] === 'kh') ? '/ccw/kh/dtcDetails.do' : '/ccw/ovd/csv/dtcDetails.do';
    HttpService.get(url1).success(function(data) {
      if (data.success === 'false') { deferred.reject(); }
      else { deferred.resolve(data); }        
    }).error(function() { deferred.reject(); });
    return deferred.promise;
  }

  function makeAppointment(repairType, dealerCode) {
    var genType = $cookies['gen'];
    var offset = CommonUtilsService.getOffsetValue();

    var url = (genType === 'kh') ? 
      '/ccw/kh/scheduleDealerReservations.do?vehicle='+repairType+'&dealerCode='+dealerCode+'&offset='+offset : 
      '/ccw/dlr/dealerAppt.do?vehicle='+repairType+'&dealerCode='+dealerCode+'&offset='+offset;
    var data = genType === 'kh' ? {} :
    {
      'vehicle':repairType,
      'dealerCode':dealerCode,
      'offset':offset
    };
    return HttpService.post(url,data);
  }

  function updateOilChange(mileageOfLastOilChange, prevOilChangeInterval, oilChangeInterval) {
    var url = '/ccw/kh/oilChangeUpdate.do?';
    var param1 = 'mileageOfLastOilChange=' + mileageOfLastOilChange;
    var param2 = '&prevOilChangeInterval=' + prevOilChangeInterval;
    var param3 = '&oilChangeInterval=' + oilChangeInterval;
    url = url + param1 + param2 + param3;
    return HttpService.post(url,{});
  }

  function updateMilestone(payload) {
    var url = '/ccw/kh/service/maintenance/updateRecord.do';
    var type = $cookies['gen'];
    if (type === 'kh') { url += '?vehType=kh'; }
    return HttpService.post(url,payload);
  }

  function saveNote(payload) {
    var url = '/ccw/mtn/insertMaintRecord.do';
    var type = $cookies['gen'];
    if (type === 'kh') { url += '?vehType=kh'; }

    return HttpService.post(url,payload);
  }

  function updateNote(payload) {
    var url = '/ccw/omn/mtn/updateMaintRecord.do';
    var type = $cookies['gen'];
    if (type === 'kh') { url += '?vehType=kh'; }
    var encodedPayloaded = SpringUtilsService.encodeParams(payload);
    var headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return HttpService.post(url,encodedPayloaded,headers);
  }

  function deleteNote(interval) {
    var url = '/ccw/omn/mtn/deleteMaintenanceRecord.do?crntMileage='+interval;

    return HttpService.post(url,{});
  }

  return {
    processMilestones : processMilestones,
    getCurrentAppointments : getCurrentAppointments,
    getOilChangeDetail : getOilChangeDetail,
    getIntervalDetail : getIntervalDetail,
    getMileStones : getMileStones,
    getCompleteIgnoreInfo : getCompleteIgnoreInfo,
    getDtcDetails : getDtcDetails,
    makeAppointment : makeAppointment,
    updateOilChange : updateOilChange,
    updateMilestone : updateMilestone,
    deleteNote : deleteNote,
    saveNote   : saveNote,
    updateNote : updateNote
  };
};
