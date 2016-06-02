'use strict';

module.exports = /*@ngInject*/ function($compile, $log) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, elem, attrs, ctrl) {
			attrs.$set('ngTrim', 'false');
            var maxlength = parseInt(attrs.textAreaMaxlength, 10);
            ctrl.$parsers.push(function (value) {               
                if (value.length > maxlength)
                {
                    value = value.substr(0, maxlength);
                    ctrl.$setViewValue(value);
                    ctrl.$render();
                }
                return value;
            });
		}
	};
};