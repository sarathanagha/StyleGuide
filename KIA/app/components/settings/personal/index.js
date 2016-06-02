'use strict';

angular.module('uvo.settings.personal',[])
  .controller('PersonalSettingsController', require('./personalController'))
  .factory('PersonalSettingsService', require('./personalService'))
;
