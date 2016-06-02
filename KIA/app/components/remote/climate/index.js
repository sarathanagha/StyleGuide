'use strict';

angular.module('uvo.remote.climate',[])
  .factory('climateService', require('./climateService'))
  .controller('climateController', require('./climateController'))
  .directive('uiSlider', require('./slider'))
  .directive('pendingList', require('./pendinglist'))
  .directive('ngDraggable', require('./draggable'));
