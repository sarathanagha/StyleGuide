'use strict';

module.exports = /*ngInject*/ ['MCZ_DAY_LIST',function(MCZ_DAY_LIST) {

	return {
		restrict:'EA',
		template: '<ul class="day-picker-list">'+
				  	'<li class="noselect" ng-repeat="day in dayList" ng-class="{selected:isSelected($index)}" ng-click="toggleDay($index)">'+
				  		'<span>{{day.text}}</span>'+
				  	'</li>'+
				  '</ul>',
		scope:{
			selectedIndex : '=',
			disabled : '=',
			list : '=',
			readOnly : '@'
		},
		link: function(scope,element,attribute) {
			var readOnly = scope.readOnly === 'true';
			scope.dayList = MCZ_DAY_LIST;
			scope.isSelected = function(index) {
				return scope.list[index].enabled;
			};	
			scope.toggleDay = function(index) {
				if (readOnly) { return; }
				scope.list[index].enabled = !scope.list[index].enabled;
			};		
		}
	};
}];