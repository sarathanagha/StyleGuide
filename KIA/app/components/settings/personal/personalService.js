'use strict';

module.exports = /*@ngInject*/ function($q, HttpService) {

  function Payload() {
  	return {
  		'firstName': '',
	    'lastName': '',
	    'address1': '',
	    'address2': '',
	    'city': '',
	    'state': '',
	    'zipCode': '',
	    'phone': '',
	    'phoneType':3,
	    'password':''
  	};
  }

  function makePayload(data) {
  	var payload = new Payload();
  	for (var i in payload) {
  		if (payload.hasOwnProperty(i)) {
  			if (i !== 'phoneType') {payload[i] = data[i];}
  		}
  	}
  	return payload;
  }

  return {
		getPersonalSettings: function() {
			return HttpService.get('/ccw/set/getPersonalSettings.do');
		},
		setPersonalSettings: function(data) {
			// process payload
			var payload = makePayload(data);

			var deferred = $q.defer();
			HttpService.post('/ccw/set/savePersonalSettings.do', payload).success(function(data) {
				deferred.resolve(data);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		}
	};
};
