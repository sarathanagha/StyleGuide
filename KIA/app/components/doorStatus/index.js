'use strict';

angular.module('uvo.doorstatus',[])
  .factory('doorstatusService',require('./doorstatusService'))
  .controller('doorStatusController', require('./doorStatusController'))
;