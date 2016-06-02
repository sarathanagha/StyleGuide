'use strict';

angular.module('uvo.chargingstations',[])
  .factory('chargingStationService',require('./chargingStationService'))
  .controller('chargingStationController', require('./chargingStationController'))
;