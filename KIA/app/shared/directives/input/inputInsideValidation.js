'use strict';

module.exports = /*ngInject*/ ['$compile',function($compile) {

	return {
		restrict:'A',
		link: function(scope,element,attr) {
			var placeholder = attr.placeholder;
			var message
			attr.$observe('iivMessage', function (value) {
				message = value;
			});
			var error = false;
			var originalColor = element.css('color'); // font color		

			var container = angular.element('<span class="inside-validation" style="position:relative"></span>');
			element.wrap(container);
			$compile(container)(scope);

			element.click(function() {
				if (error) {
					error = false;
					element.val('');
					element.css('color',originalColor);
				}
			});

			scope.$watch(function() { return attr['iivShow']; }, function(val) { 
				if (val === 'true') {
					error = true;
					element.val(message).blur();
					element.css('color','#F00');
				} /*else {
					error = false;
					element.css('color',originalColor);
				}*/
			});
		}
	};
}];