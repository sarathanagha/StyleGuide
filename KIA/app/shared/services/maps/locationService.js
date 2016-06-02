'use strict';

module.exports = /*@ngInject*/ function($q, MapService) {

	var _lastKnownLocation;

	function getLastKnownLocation() { return _lastKnownLocation; }

	function getCurrentLocation() {
		var deferred = $q.defer(); 
		var result = {
			success: false,
			coords: MapService.getDefaultCenter()
		};
		if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function(position) {
	        	result.success = true;
	        	result.coords = {'latitude':position.coords.latitude, 'longitude':position.coords.longitude};	        	
	        	deferred.resolve(result);	
	        });
	    } else {
	    	deferred.resolve(result);
	    }
	    _lastKnownLocation = result.coords;
	    return deferred.promise;
	}

	return {
		getLastKnownLocation : getLastKnownLocation,
		getCurrentLocation : getCurrentLocation
	};

};