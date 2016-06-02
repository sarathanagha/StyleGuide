'use strict';

module.exports = /*@ngInject*/ function() {
  var _genType = '';
  var _vin = '';

  return {
    genType : function(type) {
      if (type) {_genType = type;}
      return _genType;
    },
    vin: function(vin) {
      if (vin) {_vin = vin;}
      return _vin;
    }
  };

};
