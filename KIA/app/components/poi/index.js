'use strict';

angular.module('uvo.poi',[])
  .factory('PoiServiceP', require('./poiServiceP'))
  .factory('PoiNewService', require('./poiNewService'))
  .controller('PoiController', require('./poiController'))
  .controller('PoiModalController', require('./poiModalController'))
  .directive('sortDropdown', require('./directives/sortDropdownDirective'))
  ; 
