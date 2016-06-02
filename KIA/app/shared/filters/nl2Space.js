'use strict';

module.exports = /*ngInject*/ ['$sce',function($sce) {
  return function (text) {
    return text ? text.replace(/\\n/g, " ") : '';
  };
}];
