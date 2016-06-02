'use strict';

module.exports = /*@ngInject*/ function() {
return {
	    require: 'ngModel',
	    restrict : 'A',
	    link: function(scope, elm, attrs, ctrl) {
	      var REGEXP = /^\d{5}$/;

	      ctrl.$validators.zipCode = function(modelValue, viewValue) {
		      	// consider empty models to be valid
			    if (ctrl.$isEmpty(modelValue)) { return true; }

				// it is valid
			    if (REGEXP.test(viewValue)) { return true; }

			    // it is invalid
			    return false;
	      };
	    }
	};
};