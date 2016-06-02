'use strict';

module.exports = /*@ngInject*/ function() {

	var data =  {
		'hour' : [
			{text:'01',value:1},
			{text:'02',value:2},
			{text:'03',value:3},
			{text:'04',value:4},
			{text:'05',value:5},
			{text:'06',value:6},
			{text:'07',value:7},
			{text:'08',value:8},
			{text:'09',value:9},
			{text:'10',value:10},
			{text:'11',value:11},
			{text:'12',value:12}
		],
		'minute' :[
			{text:'00', value:'00'},
			{text:'10', value:'10'},
			{text:'20', value:'20'},
			{text:'30', value:'30'},
			{text:'40', value:'40'},
			{text:'50', value:'50'}
		],
		'ampm' : [
			{text:'AM', value:'am'}, 
			{text:'PM', value:'pm'}
		]
	};
		

	var directive = {};
	directive.restrict = 'EA';
	directive.template = 	
		'<div class="time-selector time-selector-{{type}}">'+		
			'<div class="time-selector-display" ng-click="toggleOption($event)">{{timeDisplay}}</div>'+
			'<div class="time-selector-options time-selector-{{type}}-options">'+
				'<ul><li ng-repeat="item in list" ng-click="selectValue(item.value, item.text)">{{ item.text }}</li>'+
				'<div class="arrow-down"><img src="images/schedule/small-arrow-down.png"></div>'+
			'</div>'+
		'</div>'
	;
	directive.scope = {
		timeValue:'=' // 2-way-binds actual data value	
	};
	directive.link = function(scope, element, attributes) {

		scope.type = attributes['type'];        // either hour, minute, or ampm
		scope.list = data[scope.type];
		scope.timeDisplay = valueToText(scope.timeValue); // only need to do this once		
		
		scope.selectValue = function(value,text) {
			scope.timeValue = value;
			scope.timeDisplay = text;
			resetFlags();
		};

		scope.toggleOption = function(event) { 

			var isSelected = $('.time-selector-'+scope.type ,element).hasClass('selected');
			resetFlags();
			$('.time-selector',element).toggleClass('selected', !isSelected);

			event.stopPropagation();
		};	

		function resetFlags() {
			$('.time-selector').removeClass('selected');
		}

		function valueToText(value) {
			for (var i = 0; i < scope.list.length; i++) {
				var val = (typeof scope.list[i].value === 'number') ? parseInt(value) : value;
				if (scope.list[i].value === val) { 
					return scope.list[i].text;
				}
			}
		}

		// Hide all time-selectors on body click
		$('body').on('click',function() {
			resetFlags();
			scope.$apply();
		});
	};

	return directive;
};