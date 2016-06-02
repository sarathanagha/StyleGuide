'use strict';

module.exports = /*@ngInject*/ function() {
  return {
    restrict : 'EA',
    replace : true,
    scope : {
      vehicle : '='
    },
		templateUrl: 'views/components/appointment/templates/dealer-popup.html'
  };
};
