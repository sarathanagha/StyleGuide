'use strict';

/* Form directive for checking if input only has alpha-numeric and korean characters.
   		Includes punctuation.
*/
module.exports = /*@ngInject*/ function() {
return {
	    require: 'ngModel',
	    restrict : 'A',
	    link: function(scope, elm, attrs, ctrl) {
	      var regex = /[^ a-zA-Z0-9&:!()\s\/\'\-\.\,\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]/;
	      var regexNospace = /[^a-zA-Z0-9:\/\'\-\.\,\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]/;

	      ctrl.$validators.alphaNumeric = function(modelValue, viewValue) {
		      	// consider empty models to be valid
			    if (ctrl.$isEmpty(modelValue)) { return true; }

			    if (regex.test(viewValue)) {
			    	return false; // invalid character present
			    } else {
			    	return true;
			    }
	      };
	    }
	};
};