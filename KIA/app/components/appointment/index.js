'use strict';

angular.module('uvo.appointment',[])
	.factory('appointmentService', require('./appointmentService'))
	.controller('appointmentController', require('./appointmentController'))
	.directive('dealerPopup', require('./directives/dealerPopupDirective'))
	.directive('confirmRequest', require('./directives/confirmRequestDirective'))
	//.directive('appointmentRequest', require('./directives/appointmentRequestDirective'))
	;

