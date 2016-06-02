'use strict';

angular.module('uvo.climate',[])
  .factory('climateEvService',require('./climateEvService'))
  .controller('climateEvController', require('./climateEvController'))
;