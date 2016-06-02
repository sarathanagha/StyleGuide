'use strict';

angular.module('uvo.settings.commandlog',[])
  .controller('commandLogController', require('./commandLogController'))
  .factory('commandLogService', require('./commandLogService'))
  .filter('date2',require('./CommandLogDateFilter'))
;
