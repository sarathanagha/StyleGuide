'use strict';
angular.module('uvo')
	.factory('HttpInterceptor', require('./httpInterceptor'))
	.service('HttpService', require('./httpService'))
	;
