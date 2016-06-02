'use strict';
 module.exports = /*@ngInject*/ function(HttpService, $q) {
	return{
		getLockInfo : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/ev/vehicleStatusCached.do').success(function(data) {	      		
	        	deferred.resolve(data);
	        	
	        });
	       	return deferred.promise;
    	},
    	getServiceInfo : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/ev/isAsyncServiceBlocked.do').success(function(data) {
	        	deferred.resolve(data);
	        	
	        });
	       	return deferred.promise;
    	}
    	
	};

};