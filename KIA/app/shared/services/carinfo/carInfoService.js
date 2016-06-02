'use strict';
module.exports = /*@ngInject*/ function(HttpService, $q) {

  var imageURL = '/kar/images/changeCar/';
  var _carInfo = {data:{}};

  var processCarInfo = function(data) {

    for (var i in data.vehicles) {
      if (data.vehicles[i]) {
        // determine selected vehicle
        data.vehicles[i].selected = data.vehicles[i].vin === data.selectedVin;
        data.selectedVehicle = (data.vehicles[i].selected) ? data.vehicles[i] : data.selectedVehicle;

        // determine vehicle type
        data.vehicles[i].type = getVehicleType(data.vehicles[i]);

        // determine vehicle image
        data.vehicles[i].originImgFileNm = (data.vehicles[i].originImgFileNm) ? data.vehicles[i].originImgFileNm : data.vehicles[i].realImgFileNm;
        data.vehicles[i].originImgFileNm = getImageURL() + data.vehicles[i].originImgFileNm;
      }
    }
    if(data.vehicles){
      data.count = data.vehicles.length;
    }
    return data;
  };

  var getImageURL = function() {
    var hostname = window.location.hostname;
    //if (hostname.match(/localhost/ig)) {
    if (!hostname.match(/myuvo/ig)) {
       return 'https://stg.myuvo.com' + imageURL;
    }

    return imageURL;
  };

  var getVehicleType = function(data) {
    var type = '';
    if (data.fuelType === '4') {
      type = 'psev';
    } else if (data.mdlNm === 'K900' && data.khVehicle === 'K900') {
      type = 'kh';
    } else if (data.genType === '1' || data.launchType === '1') {
      type = 'gen1plus';
    } else {
      type = 'gen1';
    }
    return type;
  };

  return {
    carInfo: function() { return _carInfo; },
    getServiceBlockInfo: function(){
      var deferred = $q.defer();
        HttpService.get('/ccw/ev/isAsyncServiceBlocked.do').success(function(data) {
          deferred.resolve(data);  
        });
        return deferred.promise;
    },
    getCarInfo : function(force) {
      var deferred = $q.defer();
      if (force || _.isEmpty(_carInfo.data)) {
        HttpService.get('/ccw/carInfo.do').success(function(data) {
          var returnData = processCarInfo(data);
          _carInfo = returnData;
          deferred.resolve(returnData);
        });
      } else {
        deferred.resolve(_carInfo);
      }
      return deferred.promise;
    },

    getCarTypes : function(data) {
      var hasEV = false, hasKH = false;
      for (var i in data.vehicles) {
        if (data.vehicles[i]) {
          if (data.vehicles[i].fuelType === 4) { hasEV = true; }
          if (data.vehicles[i].mdlNm === 'K900' && data.vehicles[i].khVehicle === 'K900') { hasKH = true; }
        }
      }
      return {
        'hasEV' : hasEV,
        'hasKH' : hasKH
      };
    }
  };
};
