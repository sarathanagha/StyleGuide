'use strict';

angular.module('uvo')
  .factory('IdleService', require('./idleService'))
  .controller('IdleModalController', require('./idleModalController'))
  .directive('idleModal', require('./idleModalDirective'))
  ;
