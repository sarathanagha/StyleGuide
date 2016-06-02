'use strict';

angular.module('uvo.mcz.settings.geofence', []) 
	.controller('GeofenceSettingsController', require('./geofenceSettingsController'))
	.factory('GeofenceSettingsService', require('./geofenceSettingsService')) 
	.directive('geofenceMap', require('./geofenceMapDirective'))
	; 