'use strict';

module.exports = /*ngInject*/ function($window,$rootScope) {

	return {
		restrict:'EA',
		link: function(scope,element,attribute) {

			var w = angular.element($window);
			scope.getWindowDimensions = function () {
				return {
					'h': w.height(),
					'w': w.width()
				};
			};
			scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
				scope.windowHeight = newValue.h;
				scope.windowWidth = newValue.w;

				if(scope.windowWidth<767){
$rootScope.$broadcast('mobile','on');
if(scope.vm.map){
	scope.vm.map.options.panControl=false;
					scope.vm.map.options.zoomControl=false;
}
					
				}
				else{
$rootScope.$broadcast('mobile','off');
					if(scope.vm.map){
						scope.vm.map.options.panControl=true;
						scope.vm.map.options.zoomControl=true;
					}

				}


			}, true);

			w.bind('resize', function () {
				scope.$apply();
			});
		}
	};
};