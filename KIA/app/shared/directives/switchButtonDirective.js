/*

switchButtonDirective.js

Used in My Car Zone/Remote for toggling feature on and off.

Usage:
<switch-button enabled={expression} is-on={expression}></switch>

Defaults:
enabled = true;

*/

'use strict';

module.exports = /*@ngInject*/ function() {

	return {
		restrict:'EA',
		template: '<div class="switch-button" ng-class="{disabled:disabled, off:!isOn, on:isOn}"><span>{{text}}</span></div>',
		scope: {
			disabled : '=',
			isOn : '='
		},
		link: function(scope,element,attribute) {
			scope.displayText = function() {
			
				scope.text = (scope.isOn) ? 'ON' : 'OFF';
			};
             scope.$watch('isOn',function(){
             	scope.displayText();
             });
			scope.onClick = function() {
				if (!scope.disabled) {		
					scope.isOn = !scope.isOn;
					scope.displayText();	
					scope.$apply();
				}
			};

			scope.displayText();
			element.on('click', function() {
				scope.onClick();
			});
		}
	};
};