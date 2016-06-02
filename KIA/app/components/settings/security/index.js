'use strict';

angular.module('uvo.settings.security',[])
  .factory('SecuritySettingsService', require('./securityService'))
  .controller('SecuritySettingsController', require('./securityController'))
;
