'use strict';
 module.exports = /*@ngInject*/ function(HttpService, $q, INTERVAL_LIST,$cookies) {
	return{
		getSettingsInfo : function() {      
			var deferred = $q.defer();
			
	      	HttpService.get('/ccw/kh/speedLimitAlertSettings.do').success(function(data) {	  		
	        		deferred.resolve(data);	        	
	        });
	     
	       	return deferred.promise;
    	},
    	getVehicles : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/carInfo.do').success(function(data) {	      		
	        	deferred.resolve(data);
	        });
	       	return deferred.promise;
    	} 
    	
    	
	};
};