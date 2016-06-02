'use strict';

module.exports = /*@ngInject*/ function(HttpService, $q, $cookies) {

	function processData(data) {
		data.tempF = Math.round(data.tempF);
		if (typeof data.weatherImage === 'undefined' || data.weatherImage === null || data.weatherImage === '') {
			data.weatherImage = 'partly-cloudy.gif';
		}
		return data;
	}

	return {
		getOverview: function() {
			

			var deferred = $q.defer();
			HttpService.get('/ccw/kh/overviewInfo.do').success(function(data) {		
				try {		
					deferred.resolve(processData(data.serviceResponse));				
				} catch(err) {
					deferred.reject(err);
				}
			});
			return deferred.promise;
		},
		getOverview1: function() {
			var vin = $cookies['vin']
			var deferred = $q.defer();
			//HttpService.get('/ccw/com/vehiclesInfo.do').success(function(data) {
				HttpService.get('/ccw/vehicle/overViewResponsive.do?vin='+vin).success(function(data) {
				try {		
					deferred.resolve(processData(data.result));				
				} catch(err) {
					deferred.reject(err);
				}
			});
			return deferred.promise;
		}
		
	};
	
};
