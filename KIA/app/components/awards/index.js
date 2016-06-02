'use strict';

angular.module('uvo.awards',[])
  .factory('AwardsService', require('./awardsService'))
  .controller('AwardsController', require('./awardsController'))
  .controller('AwardsModalController', require('./awardsModalController'))
;
