'use strict';

module.exports = /*@ngInject*/ function() {
	return {
		restrict:'A',
		templateUrl: function(elem,attrs) {
			var filename = (attrs.mobile) ? 'diagnostics-mobile.html' : 'diagnostics.html';
			return 'views/components/maintenance/templates/' + filename;
		}
	};
};
