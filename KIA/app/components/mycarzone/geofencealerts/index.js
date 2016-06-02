'use strict';

angular.module('uvo.geofence',[])
  .controller('GeofenceController', require('./GeofenceController'))
  .controller('geofenceAlertCont', require('./geofenceAlertCont'))
  .factory('geofenceService', require('./geofenceService'))
  .factory('PoiService', require('./poiService'))
  .filter('dropdownFilter', require('./dropdownFilter'));
