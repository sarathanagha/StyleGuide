'use strict';

angular.module('uvo.battery',[])
  .factory('batteryService',require('./batteryService'))
  .controller('batteryController', require('./batteryController'))
;