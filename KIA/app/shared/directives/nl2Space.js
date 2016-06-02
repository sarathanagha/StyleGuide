'use strict';

module.exports = /*ngInject*/ function($sce) {
  return function (text) {
    return text ? text.replace(/\\n/g, " ") : '';
  };
};
