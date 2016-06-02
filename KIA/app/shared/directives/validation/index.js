'use strict';

angular.module('uvo')
	.directive('phone', require('./phoneValidation'))
	.directive('inputMatch', require('./inputMatch'))
	.directive('zipCode', require('./zipCode'))
	.directive('textAreaMaxlength', require('./textAreaMaxlength'))
	.directive('alphaNumeric', require('./alphaNumeric'))
	;