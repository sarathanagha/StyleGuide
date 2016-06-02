'use strict';
 module.exports = /*@ngInject*/ function(HttpService, $q) {
	return{
		getTripInfo : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/ev/vehicleStatusCached.do').success(function(data) {	      		
	        	deferred.resolve(data);
	        	
	        });
	       	return deferred.promise;
    	},
    	getTempInfo : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/ev/outsideTemp.do').success(function(data) {	      		
	        	deferred.resolve(data);
	        });
	       	return deferred.promise;
    	}
	};

};