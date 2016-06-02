'use strict';

module.exports = /*@ngInject*/ function($modal, $scope, $modalInstance) {
	return {
		restrict:'AE',
		templateUrl: 'views/components/appointment/templates/appointment-request.html'
	};
};