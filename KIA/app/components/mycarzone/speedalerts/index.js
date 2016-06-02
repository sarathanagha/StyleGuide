'use strict';

angular.module('uvo.speed',[])
  .controller('SpeedViewController', require('./speedViewController'))
  .controller('speedAlertCont', require('./speedAlerCont'))
  .factory('speedViewService', require('./speedViewService'))
  .factory('PoiService', require('./poiService'))
  .filter('dropdownFilter', require('./dropdownFilter'));


 