'use strict';
 module.exports = /*@ngInject*/ function(HttpService, $q) {
	return {
		retrieveChargingStations : function(requestParams) {
			var deferred = $q.defer();
			HttpService.get('/ccw/fcs/fcs01.do?'+$.param(requestParams)).success(function(data) {
	      		deferred.resolve(data);        
	    	});
	    	return deferred.promise;
		},
		isUSRegion : function(zip) {
			var deferred = $q.defer();
			HttpService.get('/ccw/ev/isUSRegion.do?zipcode='+zip).success(function(data) {
	      		deferred.resolve(data);        
	    	});
	    	return deferred.promise;
		}
	};
};
