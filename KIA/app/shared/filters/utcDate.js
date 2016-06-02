
'use strict';

module.exports = /*@ngInject*/ function($filter) {
	return function (input, format) {        
        return moment.utc(input).format(format);
    };	
};


