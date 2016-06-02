'use strict';

module.exports = /*@ngInject*/ function($http, HttpInterceptor) {
	return {
		get: function(url) {
			// check if received session timeout
			if (!HttpInterceptor.getErrorFlag()) {
				var req = {
				 method: 'GET',
				 url: url,
				 params: { 'ceps': new Date().getTime() }
				};

				return $http(req);
			}
		},
		post: function(url,data,headers) {
			if (!HttpInterceptor.getErrorFlag()) {
				var req = {
					method: 'POST',
					url: url,
					headers: {
				     'Content-Type': 'application/json'
					},
					data: data
				};

				if (headers) {
					var prop;
					for (prop in headers) {
						if (headers.hasOwnProperty(prop)) { req.headers[prop] = headers[prop]; }
					}
				}

				return $http(req);
			}
		}
	};
};
