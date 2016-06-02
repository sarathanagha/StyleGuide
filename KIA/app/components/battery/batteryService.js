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
    	stopCharge : function(){
    		var deferred = $q.defer();

	      	HttpService.get('/ccw/ev/cancelImmediateCharge.do').success(function(data) {
	        	deferred.resolve(data);
	        });
	      
	      	return deferred.promise;
    	},
    	startCharge : function(chargeInfo){
    		var deferred = $q.defer();
    		var url = '/ccw/ev/immediateCharge.do';
    		var payload = SpringUtilsService.encodeObjParams('chrgInfo',chargeInfo);
    		var headers = {'Content-Type':'application/x-www-form-urlencoded'};

	      	HttpService.post(url, payload, headers).then(function(data) {                
                deferred.resolve(data);
            });
	      
	      	return deferred.promise;
    	},
    	postSche : function(newScheInfo) {
    		var deferred = $q.defer();
    		var url = '/ccw/ev/reserveCharge.do';
    		var payload = SpringUtilsService.encodeObjParams('rsvChargeInfo',newScheInfo);
    		var headers = {'Content-Type':'application/x-www-form-urlencoded'};

    		HttpService.post(url, payload, headers).then(function(data) {               
                deferred.resolve(data);
            });

            return deferred.promise;
    	}	
	};
};