'use strict';

module.exports = /*@ngInject*/ function(HttpService, $q, CommonUtilsService) {

  var hrefMap = {
    'awards':'/awards',
    'REMOTE START':'/kh/climate',
    'REMOTE CONTROL STOP':'/kh/climate',
    'REMOTE DOOR LOCK':'/kh/lock',
    'REMOTE DOOR UNLOCK':'/kh/lock',
    'geofence':'/kh/mycarzone/geofence',
    'curfew':'/kh/mycarzone/curfewalerts',
    'speed':'/kh/mycarzone/speedalerts',
    'dtc':'/kh/maintenance'
  };

  // Get total count and assign href
  function processData(data) {
        var sum = 0;
        var returnData = {
          total : 0,
          data : []
        };
        var i;
        for (i in data) {
          if (data[i]) {
            if(i == "remoteCommands"){
              sum = sum + 1;
              returnData.data.push({'name':processRemoteCommand(CommonUtilsService.upperCaseFirst(data[i].scenarioName),data[i].status), 'count':i, 'href':hrefMap[data[i].scenarioName]});
            }else{
              sum = sum + data[i];
              returnData.data.push({'name':CommonUtilsService.upperCaseFirst(i), 'count':data[i], 'href':hrefMap[i]});

            }
          }
        }
        returnData.total = sum;
        return returnData;
  }

  function processRemoteCommand(name,status){
    if(name == "REMOTE START" || name == "REMOTE START (WITH CLIMATE)"){
      if(status =="Z")
        return "YOUR VEHICLE WAS STARTED";
      else
        return "YOUR REMOTE REQUEST FAILED";
    }else if(name == "REMOTE CONTROL STOP"){
      if(status =="Z")
        return "YOUR VEHICLE WAS STOPPED";
      else
        return "YOUR REMOTE REQUEST FAILED";
    }else if(name == "REMOTE DOOR LOCK"){
      if(status =="Z")
        return "YOUR VEHICLE WAS LOCKED";
      else
        return "YOUR REMOTE REQUEST FAILED";
    }else if(name == "REMOTE DOOR UNLOCK"){
      if(status =="Z")
        return "YOUR VEHICLE WAS UNLOCKED";
      else
        return "YOUR REMOTE REQUEST FAILED";
    }

  }

  return {
    getAlertNotifications : function() {
      var deferred = $q.defer();
      HttpService.get('/ccw/com/notificationsJSON.do').success(function(data) {
        deferred.resolve(processData(data));
      });
      return deferred.promise;
    },
    getRemoteSession : function(){
      var deferred = $q.defer();
      HttpService.get('/ccw/remoteSession.do').success(function(data){
        deferred.resolve(data.success);
      });
      return deferred.promise;
    }
  };
};
