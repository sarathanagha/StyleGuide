'use strict';

module.exports = /*@ngInject*/ function() {
  return {
    restrict : 'EA',
    replace : true,
    scope : {
      vehicle : '='
    },
		templateUrl: 'views/shared/modules/dealer/dealer-modal-directive.html'
  };
};
