'use strict';

module.exports = /*@ngInject*/ function(HttpService) {
	return {
		logout : function() {
			return HttpService.get('/ccw/com/logOut.do');
		}
	};
};