'use strict';

angular.module('uvo.tripinfo',[])
  .factory('TripInfoService',require('./tripInfoService'))
  .controller('TripInfo', require('./tripInfoController'))
  ;
