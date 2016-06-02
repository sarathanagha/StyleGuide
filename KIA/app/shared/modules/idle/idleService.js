'use strict';

module.exports = /*@ngInject*/ function (HttpService) {
  return {
    keepAlive : function() {
      return HttpService.get('/ccw/com/sessionPoll.do');
    },
    logout : function() {
			return HttpService.get('/ccw/com/logOut.do');
		}
  };
};
