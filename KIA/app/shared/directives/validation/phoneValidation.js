'use strict';

module.exports = /*@ngInject*/ function() {
return {
	    require: 'ngModel',
	    restrict : 'A',
	    link: function(scope, elm, attrs, ctrl) {
	      var PHONE_REGEXP = /^1?\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;

	      ctrl.$validators.phone = function(modelValue, viewValue) {
		      	// consider empty models to be valid
			    if (ctrl.$isEmpty(modelValue)) { return true; }

				// it is valid
				var phone = viewValue;

				// not valid if is NOT a digit, space, parenthesis, dash, or plus
				if (/[^ \d\(\)\-\+]/g.test(phone)) { return false; }

				// strip all non-digit chars
				phone = phone.replace(/[^\d]/g, '');				
			    if (PHONE_REGEXP.test(phone)) { return true; }

			    // it is invalid
			    return false;
	      };
	    }
	};
};