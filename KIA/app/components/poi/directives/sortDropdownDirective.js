'use strict';

module.exports = /*ngInject*/ function() {
	return {
		restrict:'A',
		link:function(scope,element,attribute) {
			$('body').on('click', function() {
				scope.vm.showSort = false;	
				scope.$apply();			
			});

			element.on('click', function(e) {
				scope.vm.showSort = !scope.vm.showSort;	
				scope.$apply();
				e.stopPropagation();
			});

			$('.dropdown-sort-menu li').on('click', function(e) {
				scope.vm.showSort = false;;	
				scope.$apply();
				e.stopPropagation();
			});

			$('.dropdown-sort-menu').on('click', function(e) {
				e.stopPropagation();
			});
		}
	};
};
