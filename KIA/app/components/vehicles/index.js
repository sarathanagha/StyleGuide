'use strict';

angular.module('uvo.vehicles',[])
  .controller('VehiclesController', require('./vehiclesController'))
  .controller('ShowPinController', require('./ShowPinController'))
  .controller('DeleteVehicleController', require('./deleteVehicleController'))
  .factory('VehiclesService', require('./vehiclesService'))
  .directive('addVehicleModal', require('./directives/addVehicleModalDirective'))
  .directive('deleteVehicleModal', require('./directives/deleteVehicleModalDirective'))  
  .directive('vehicleCard', require('./directives/vehicleCardDirective'))
  ;


