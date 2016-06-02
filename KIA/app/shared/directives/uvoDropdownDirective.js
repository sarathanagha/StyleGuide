/*

uvoDropdownDirective.js

Used in My Car Zone for selecting intervals

Usage:
<uvo-dropdown enabled={expression} items={array} text-key='string' value-key='string' selected-index={expression}></uvo-dropdown>

Defaults:
textKey = 'text'
secondTextKey = 'text' // used for mobile
valueKey = 'value'
selectedIndex = 0

So if no textKey or valueKey is provided, it will expected an array with the following structure:
[
	{text:'Item 1', value:1 },
	{text:'Item 2', value:2 },
	{text:'Item 3', value:3 },
]

*/

'use strict';

module.exports = /*@ngInject*/ function() {	

	return {
		restrict:'EA',
		template: '<div class="uvo-dropdown" ng-class="{disabled:!enabled}">'+
		             '<div ng-click="toggleCollapse($event)">'+
		             	'<span class="hidden-xs">{{items[selectedIndex][textKey]}}</span>'+
		             	'<span class="visible-xs-inline">{{items[selectedIndex][secondTextKey]}}</span>'+
		             '</div>'+
		             '<ul ng-hide="collapsed">'+
		                '<li ng-repeat="item in items" ng-click="onSelect($index, $event)">'+
		                	'<span class="hidden-xs">{{item[textKey]}}</span>'+
		                	'<span class="visible-xs-inline">{{item[secondTextKey]}}</span>' +
		                '</li>'+
		             '</ul>'+ 
		           '</div>', 
		scope: {
			enabled : '=?',
			items : '=',
			selectedIndex : '=?',
			textKey : '@?',
			secondTextKey : '@?',
			valueKey : '@?'
		},
		link: function(scope,element,attribute) {		
			if (!scope.enabled) { scope.enabled = true; }
			if (!scope.selectedIndex) { scope.selectedIndex = 0; }		
			if (!scope.textKey) { scope.textKey = 'text'; }
			if (!scope.secondTextKey) { scope.secondTextKey = 'text'; }
			if (!scope.valueKey) { scope.valueKey = 'value'; }
			scope.collapsed = true;

			scope.onSelect = function(index, event) {
				scope.selectedIndex = index;
				scope.collapsed = !scope.collapsed;
				event.stopPropagation();
			};

			scope.toggleCollapse = function(event) {
				if (scope.enabled) {			
					scope.collapsed = !scope.collapsed;
					event.stopPropagation();
				}
			};

			// clicking anywhere but element will hide this menu
			$('body').on('click', function() {
				scope.collapsed = true;
				if(!scope.$$phase)
				scope.$apply();
			});			
		}
	};
};