'use strict';

module.exports = /*@ngInject*/ function($timeout, ResolveService, AlertsSettingsService, 
                          StatusBarService, VehiclesService, AlertModalService) {

  var vm = this;
  vm.moduleLoaded = false;
  vm.save = function() {
    StatusBarService.showLoadingStatus();
      vm.loading = true;
      AlertsSettingsService.setAlerts(vm.maintenance, vm.uvo, vm.ev, vm.kh, vm.carTypes).then(
        function() {
          vm.submitted = false;
          vm.loading = false;
          StatusBarService.clearStatus();
          vm.openModal();
        },
        function() {
          vm.submitted = false;
          vm.loading = false;
          StatusBarService.clearStatus();
          vm.openModal('fail');
        }        
      );
  };

  StatusBarService.showLoadingStatus();
  ResolveService.resolveMultiple([AlertsSettingsService.getAlerts,VehiclesService.getVehicles])
    .then(function(data) {
      StatusBarService.clearStatus();
      vm.alerts = data[0];
      vm.carTypes = VehiclesService.getCarTypes(data[1]);

      vm.maintenance = vm.alerts.maintenanceMap;
      vm.uvo = vm.alerts.uvoMap;
      vm.ev = vm.alerts.evMap;
      vm.kh = vm.alerts.khMap;

      vm.moduleLoaded = true;
  });

  vm.openModal = function(failed) {
    var url = (failed === 'fail') ? 'alertFail.html' : 'alert.html';
    var modalInstance = AlertModalService.openModal(url);
  };

};
