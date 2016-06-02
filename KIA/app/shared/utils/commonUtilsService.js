'use strict';

module.exports = /*@ngInject*/ function($window) {

  this.upperCaseFirst = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
  };

  this.isSmallScreen = function () {
    return ($window.innerWidth <= 768);
  };

  this.getOffsetValue = function() {
  	 var jan = new Date(new Date().getFullYear(), 0, 1);
     var jul = new Date(new Date().getFullYear(), 6, 1);
     var offset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset()) / -60;

     moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');
     var timeZone = 'America/Los_Angeles';
     var dt = moment().tz(timeZone).format('YYYY-M-D hh:mm:ss');
     var dstTest = moment.tz(dt,timeZone).isDST();

     if(offset === (new Date().getTimezoneOffset()/ -60)){
     	if(dstTest)
     		{offset = offset-1;}
     }
     return offset;
  };

  this.copyDataToModel = function(data, Type) {
    var model = new Type();
    var prop;
    for (prop in model) {
      if (model.hasOwnProperty(prop)) {
        model[prop] = data[prop];
      }
    }
    return model;
  };

  this.formatPhoneNumber= function(input) {
    if(input && input !== "undefined"){   
        if (!input || !input.length) { 
          return; 
        }
        var formatInput = input.replace(/[()\-+ ]/g,'');
        var formatted = '';
        var phoneParts = (formatInput || '').match(/(1)?(\d{3})(\d{3})(\d{4})/);
        if (phoneParts !== null) {
            phoneParts[2] = '(' + phoneParts[2] + ')';
            if (phoneParts[1] === '1') {
                formatted = phoneParts[1]+' '+phoneParts[2]+' '+phoneParts[3]+'-'+phoneParts[4];
            } else {
                formatted = '1 '+phoneParts[2]+' '+phoneParts[3]+'-'+phoneParts[4];
            }
        }
        return formatted || input;
     }
  };
};
