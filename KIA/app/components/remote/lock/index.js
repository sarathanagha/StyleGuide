'use strict';

angular.module('uvo.remote.lock',[])
  .factory('lockService', require('./lockService'))
  .controller('lockController', require('./lockController'))
  ;
