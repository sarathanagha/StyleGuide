'use strict';

angular.module('uvo')
	.directive('alertModal',require('./alertModalDirective'))
	.factory('AlertModalService', require('./alertModalService'))
	;