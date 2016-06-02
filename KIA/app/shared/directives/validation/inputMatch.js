'use strict';

module.exports = /*@ngInject*/ function() {
return {
	    require: 'ngModel',
	    restrict : 'A',

	    scope: {
	    	otherValue : '=inputMatch'
	    },

	    link: function(scope, elm, attrs, ctrl) {

	     /* ctrl.$validators.inputMatch = function(modelValue, viewValue) {
		      
			    if (ctrl.$isEmpty(modelValue)) { return true; }

				// it is valid
			    if (modelValue === scope.otherValue) { return true; } 

			    // it is invalid
			    return false;
	      };*/
	      ctrl.$validators.inputMatch = function(modelValue) {	      	
                return modelValue == scope.otherValue;
              
            };
 
            scope.$watch("otherValue", function() {
                ctrl.$validate();
            });
	    },

	};
};