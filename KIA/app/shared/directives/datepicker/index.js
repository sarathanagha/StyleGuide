'use strict';

angular.module('uvo')
	.directive('datePicker', function() {
		return {
			restrict:'A',
			link: function(scope, element, attribute) {
				$(element).datepicker();
			}
		};
	});