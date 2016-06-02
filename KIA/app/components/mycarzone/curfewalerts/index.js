'use strict';

angular.module('uvo.curfew',[])
  .factory('CurfewInfoService',require('./CurfewInfoService'))
      .factory('showMapService', require('./showMapService'))
.controller('alertCont', require('./alertCont'))
  .controller('CurfewController', require('./CurfewController'))
  .filter('dayFilter',require('./DayFilter'));
