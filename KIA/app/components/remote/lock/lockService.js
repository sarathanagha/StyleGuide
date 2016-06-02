'use strict';
 module.exports = /*@ngInject*/ function(HttpService, $q , $timeout) {
	return{
		getvehiclestatusInfo : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/kh/vehicleStatusRemote.do').success(function(data) {	      		
	        	deferred.resolve(data);
	        	
	        });
	       	return deferred.promise;
    	},
    	refreshVehicleInfo : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/kh/latestVehicleStatus.do').success(function(data) {	      		
	        	deferred.resolve(data);
	        	
	        });
	       	return deferred.promise;
    	}
	};

};


