'use strict';

angular.module('uvo')
	.filter('phoneNumber', require('./phoneNumberFilter'))
	.filter('vehicleSwitcherFilter',require('./vehicleSwitcherFilter'))
	.filter('utcDate',require('./utcDate'))
	.filter('removeUsa',require('./removeusafromtextFilter'))
	.filter('nl2Space',require('./nl2Space'));
