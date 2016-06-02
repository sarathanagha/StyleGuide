'use strict';

angular.module('uvo')
  .service('DealerService', require('./dealerService'))
  .controller('DealerModalController', require('./dealerModalController'))
  .directive('dealerModal', require('./dealerModalDirective'))
  .directive('isNumber',require('./isNumberDirective'));
  ;
