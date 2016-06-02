'use strict';

module.exports = /*@ngInject*/ function($modal) {

	function openModal(url, options) {
		var defaultOptions = {
	      templateUrl: url,
	      size: 'sm',
	      keyboard: false,
	      backdrop: 'static',
	      windowClass: 'vertical-middle'
	    };

		var opt = options ? options : defaultOptions;

		var modalInstance = $modal.open(opt);
		return modalInstance;
	}

	return {
		openModal:openModal
	};
};