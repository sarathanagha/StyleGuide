'use strict';

module.exports = /*@ngInject*/ function(VehicleSwitcherService, $scope, $state) {

	var vm = this;
	
	vm.switchVehicle = function(type,vin,vehicle) {
		VehicleSwitcherService.switchVehicle(type,vin);
	};
};