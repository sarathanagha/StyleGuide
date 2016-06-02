'use strict';

require('./datepicker');
require('./input');
require('./iscroll');
require('./knob');
require('./validation');

angular.module('uvo')
	.directive('switchButton', require('./switchButtonDirective'))
	.directive('progressStatus', require('./progressstatus'))
	.directive('uvoDropdown', require('./uvoDropdownDirective'))
	.directive('timeSelector', require('./timeSelectorDirective'))
	.directive('dayPicker', require('./dayPickerDirective'))
	.directive('submitButtonPendingList', require('./submitButtonPendingListDirective'));
  
