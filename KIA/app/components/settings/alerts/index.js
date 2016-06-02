'use strict';

angular.module('uvo.settings.alerts',[])
  .controller('AlertsSettingsController', require('./alertsSettingsController'))
  .service('AlertsSettingsService', require('./alertsSettingsService'))
  ;
