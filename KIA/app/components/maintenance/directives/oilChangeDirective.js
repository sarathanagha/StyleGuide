'use strict';

module.exports = /*@ngInject*/ function() {
	return {
		restrict:'A',
		templateUrl: function(elem,attrs) {
			var filename = (attrs.mobile) ? 'oil-change-mobile.html' : 'oil-change.html';
			return 'views/components/maintenance/templates/' + filename;
		}
	};
};