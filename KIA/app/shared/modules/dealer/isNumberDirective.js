'use strict';

module.exports = /*@ngInject*/ function() {
  return {
		require: 'ngModel',
		restrict: "A",
		scope:{
			zip : '=isNumber'
		},
		link: function (scope) {
			scope.$watch('zip', function(newValue,oldValue) {
                var arr = String(newValue).split("");
                if (arr.length === 0) return; 
                if (isNaN(newValue)) {
                    scope.zip = oldValue;
                }
            });
		}
	};
};
