'use strict';

angular.module('uvo.overview',[])
  .controller('OverviewController', require('./overviewController'))
  .factory('OverviewService', require('./overviewService'))
  ;
