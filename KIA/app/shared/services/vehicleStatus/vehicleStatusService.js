'use strict';

module.exports = /*@ngInject*/ function(HttpService, $q, $cookies) {

  var hexToTemp = {
		F : {'--' : '--',
         '01' : '--', '02' : 'Low',
         '03' : 63, '04' : 63,
         '05' : 64, '06' : 65,
         '07' : 66, '08' : 67,
         '09' : 68, '0A' : 69,
         '0B' : 70, '0C' : 71,
         '0D' : 72, '0E' : 73,
         '0F' : 74, '10' : 75,
         '11' : 76, '12' : 77,
         '13' : 78, '14' : 79,
         '15' : 80, '16' : 81,
         '17' : 82, '18' : 83,
         '19' : 84, '1A' : 85,
         '1B' : 86, '1C' : 87,
         '1D' : 88, '1E' : 89,
         '1F' : 89, '20' : 'High'},
    C : {'--' : '--', '01' : '--',
         '02' : 'Low', '03' : 17,
         '04' : 18, '05' : 18,
         '06' : 19, '07' : 19,
         '08' : 20, '09' : 20,
         '0A' : 21, '0B' : 21,
         '0C' : 22, '0D' : 22,
         '0E' : 23, '0F' : 23,
         '10' : 24, '11' : 24,
         '12' : 25, '13' : 25,
         '14' : 26, '15' : 26,
         '16' : 27, '17' : 27,
         '18' : 28, '19' : 28,
         '1A' : 29, '1B' : 29,
         '1C' : 30, '1D' : 30,
         '1E' : 31, '1F' : 31, '20' : 'High'}
  };

  function processVehicleStatus(data) {
    var status = data.latestVehicleStatus;
    var unit = (status.airTemp.unit === 1) ? 'F' : 'C';
    status.airTemp.displayValue = hexToTemp[unit][status.airTemp.value.replace('H','')];
    data.latestVehicleStatus = status;

    return data;
  }

  return {
    getVehicleStatus : function() {
      var deferred = $q.defer();
       if ($cookies['gen'] === 'kh') {
            HttpService.get('/ccw/kh/vehicleStatus.do').success(function(data) {
              deferred.resolve(processVehicleStatus(data.serviceResponse));
            });
        }else if($cookies['gen'] === 'psev'){
            HttpService.get('/ccw/ev/vehicleStatus.do').success(function(data) {
                deferred.resolve(data);        
            });
        }/*else{
          HttpService.get('/ccw/kh/vehicleStatus.do').success(function(data) {
            deferred.resolve(processVehicleStatus(data.serviceResponse));
          });
        }*/
      return deferred.promise;
    },

    getVehicleStatusMessage: function(statusMessage){
      if(statusMessage === 'Vehicle Status'){
        return 'Requesting vehicle status. Please allow 2-3 minutes.';
      }else if(statusMessage === 'Immediate Charge' || statusMessage === 'Cancel Immediate Charge'){
        return 'Sending charge request. Please allow 2-3 minutes.';
      }else if(statusMessage === 'Remote Reservation Service Inquiry'){
        return 'Requesting charge schedule. Please allow 2-3 minutes.'
      }else if(statusMessage === 'Remote Reservation Charge'){
        return 'Updating charge schedule. Please allow 2-3 minutes.';
      }else if(statusMessage === 'Remote Door Unlock'){
        return 'Unlocking vehicle. Please allow 2-3 minutes.';
      }else if(statusMessage === 'Remote Door Lock'){
        return 'Locking vehicle. Please allow 2-3 minutes.';
      }else if(statusMessage === 'Immediate HVAC'){
        return 'Setting climate control. Please allow 2-3 minutes.';
      }else if(statusMessage === 'Remote Reservation Service Inquiry'){
        return 'Requesting climate schedule. Please allow 2-3 minutes.'
      }else if(statusMessage === 'Remote Reservation HVAC'){
        return 'Updating climate schedule. Please allow 2-3 minutes.';
      }else {
        return statusMessage;
      }
    },
    getLatestVehicleStatus : function() {
      var deferred = $q.defer();
       if ($cookies['gen'] === 'kh') {
            HttpService.get('/ccw/kh/vehicleStatusRemote.do').success(function(data) {
              deferred.resolve(data);
            });
        }
        return deferred.promise;
    },
    latestVehicleStatus : function() {
      var deferred = $q.defer();
       if ($cookies['gen'] === 'kh') {
            HttpService.get('/ccw/kh/latestVehicleStatus.do').success(function(data) {
              deferred.resolve(data);
            });
        }          
      return deferred.promise;
    }
  };
};


