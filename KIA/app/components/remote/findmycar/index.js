'use strict';

angular.module('uvo.remote.findmycar',[])
  .directive('resizeIt', require('./resizeDirective'))
  .controller('findMyCarController', require('./findMyCarController'))
  .factory('findMyCarService', require('./findMyCarService'))
  ;
