'use strict';

module.exports = /*@ngInject*/ function(HttpService, $q, SpringUtilsService) {
	return{
		getScheduledTimeStamp : function() {
			var deferred = $q.defer();
	      	HttpService.get('/ccw/com/vehiclesInfo.do').success(function(data) {
	        	deferred.resolve(data);
	        });
	      
	      	return deferred.promise;
		},
		getScheduledInfo : function() {      
	      	var deferred = $q.defer();
	      	HttpService.get('/ccw/ev/scheduledInfoCached.do').success(function(data) {
	        	deferred.resolve(data);
	        });
	      
	      	return deferred.promise;
    	},
        updateVehicleStatus : function() {
            var deferred = $q.defer();

            HttpService.get('/ccw/ev/vehicleStatus.do').success(function(data) {
                deferred.resolve(data);
            });
          
            return deferred.promise;
        },
    	requestSchedule : function() {      
	      	var deferred = $q.defer();
	      	HttpService.get('/ccw/ev/scheduledInfo.do').success(function(data) {
	        	deferred.resolve(data);
	        });
	      
	      	return deferred.promise;
    	},
    	sendDefrost : function(url, hvcInfo) {
    		var deferred = $q.defer();
    		var payload = SpringUtilsService.encodeObjParams('hvcInfo',hvcInfo);
    		var headers = {'Content-Type':'application/x-www-form-urlencoded'};

    		HttpService.post(url, payload, headers).then(function(data) {                
                deferred.resolve(data);
            });
            return deferred.promise;
    	},
        stopDefrost : function(url, hvcInfo) {
            var deferred = $q.defer();

            HttpService.get(url+encodeURIComponent(hvcInfo)).then(function(data) {                
                deferred.resolve(data);
            });

            return deferred.promise;
        },
    	postHvac : function(newHvacInfo) {
    		var deferred = $q.defer();
    		var url = '/ccw/ev/reserveHVAC.do';
    		var payload = SpringUtilsService.encodeObjParams('rsvHvacInfo',newHvacInfo);
    		var headers = {'Content-Type':'application/x-www-form-urlencoded'};

    		HttpService.post(url, payload, headers).then(function(data) {                
                deferred.resolve(data);
            });
            return deferred.promise;
    	},
    	setTempUnit : function(flag) {
            var deferred = $q.defer();
    		HttpService.get('/ccw/ev/updateTempPref.do?flag='+flag).success(function(data){
                deferred.resolve(data);
            });

            return deferred.promise;
    	}
	};
};