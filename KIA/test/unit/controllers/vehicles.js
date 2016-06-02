'use strict';

describe('Controller: VehiclesController', function () {

  // load the controller's module
  beforeEach(module('kiacpoApp'));

  var VehiclesController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VehiclesController = $controller('VehiclesController', {
      $scope: scope,
    });
  }));

});
