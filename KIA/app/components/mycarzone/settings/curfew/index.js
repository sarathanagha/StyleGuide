'use strict';

angular.module('uvo.mcz.settings.curfew', []) 
	.controller('CurfewSettingsController', require('./curfewSettingsController'))
	.factory('CurfewSettingsService', require('./curfewSettingsService')) 
	; 