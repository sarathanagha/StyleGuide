'use strict';

angular.module('uvo.connect',[])
  .factory('ConnectInfoService',require('./connectInfoService'))
  .controller('ConnectController', require('./ConnectController'));