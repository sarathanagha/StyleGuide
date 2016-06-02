'use strict';

module.exports = /*@ngInject*/ function(CommonUtilsService) {
	return function(input) {
        return CommonUtilsService.formatPhoneNumber(input);
	};
};