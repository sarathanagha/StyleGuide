'use strict';

module.exports = /*@ngInject*/ function($timeout, StatusBarService, AlertModalService, SecuritySettingsService) {

  var vm = this;
  vm.moduleLoaded = false;

  StatusBarService.showLoadingStatus();
  SecuritySettingsService.getSecuritySettings().then(function(data) {
    vm.questions = data.securityQuestions;
    vm.settings = data.securitySettings;

    StatusBarService.clearStatus();
    vm.moduleLoaded = true;
  });

  vm.save = function(form) {
    if (!form.$invalid) {
      StatusBarService.showLoadingStatus();
      vm.loading = true;
      SecuritySettingsService.setSecuritySettings(vm.settings).then(
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
    }
  };

  vm.openModal = function(failed) {
    var url = (failed === 'fail') ? 'alertFail.html' : 'alert.html';
    var modalInstance = AlertModalService.openModal(url);
  };
};
