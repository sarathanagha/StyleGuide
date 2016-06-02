
'use strict';

module.exports = /*@ngInject*/ function($filter) {
	return function (input) {   
			if(input){
				var str = (input.split('USA')[0]).trim();       
			    return str.substring(0,str.length-1);
			}		
    };	
};


