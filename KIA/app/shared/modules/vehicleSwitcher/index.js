'use strict';

angular.module('uvo')
  .factory('VehicleSwitcherService', require('./vehicleSwitcherService'))
  .controller('VehicleSwitcherController', require('./vehicleSwitcherController'))
  .directive('vehicleSwitcher', require('./vehicleSwitcherDirective'));
