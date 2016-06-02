'use strict';

module.exports = /*@ngInject*/ function($modalInstance, data) {

  var vm = this;
  vm.awardsHelp = data;

  vm.close = function() {
    $modalInstance.close();
  };

};
