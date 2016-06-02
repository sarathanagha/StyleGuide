'use strict';

/**

alertModal directive

Description:
	Given an alert type and message, will put the given html into the templateCache
for use with the angular bootstrap modal

Attibute List:

[alertId] - Name of file for template cache. Will be appended with ".html"
[alertType] - Alert modal type (ex. success/fail)
[alertMessage] - Message displayed

**/
module.exports = /*@ngInject*/ function($templateCache, $compile) {

	var templates =
	{
		createAlert : function(options) {
			var template;

			// if (options.type === 'success' || options.type === 'fail') {
			// 	template = this[options.type](options.message);
			// } else if (options.type === 'confirm') {
			// 	template = this[options.type](options.message, options.confirmCallback, options.cancelCallback);
			// }
			 
			template = this[options.type](options.message,options.header);
			$templateCache.put(options.alertid + '.html', template);			
		},
		success : function(message,header) { 			
			return ''+
				   (header ? '<div class="modal-header"><h4 class="modal-title">'+header+'</h4></div>' : '') +
				   '<div class="modal-body">' +   				   
				   '<p class="success-body">'+message+'</p>' +
			       '<span class="button button-center" ng-click="$close()">OK</span>' +
			       '</div>';
		},
		fail : function(message) { 
			return '<div class="modal-body">' +
				   '<p class="warning-body">'+message+'</p>' +
				   '<span class="button button-center" ng-click="$close()">OK</span>' +
				   '</div>';
		},
		confirm : function(message) {
			return '<div class="modal-body">' +
			       '<p class="success-body">'+message+'</p>' +
			       '<div class="confirm-buttons">' +
			       '<div class="button confirm" ng-click="$close()"><span>CONFIRM</span></div>' +
			       '<div class="button cancel" ng-click="$dismiss()"><span>CANCEL</span></div>' +
			       '</div></div>';
		}
	};

	return {
		restrict: 'A',
		scope: {
			alertType: '@',
			alertId: '@',
		},
		link: function(scope, element, attribute) {
			var options = {
				alertid : (scope.alertId) ? scope.alertId : 'alert',
				message : attribute['alertMessage'],
				header : attribute['alertHeader'],
				type : (scope.alertType) ? scope.alertType : 'success'
			};

			templates.createAlert(options);
		}
	};
};