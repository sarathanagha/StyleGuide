'use strict';

module.exports = /*@ngInject*/ function($rootScope) {

	return{
		restrict:'A',
		link:function(scope,elem,attr){
			
			$rootScope.progress={};
			scope.$watch('$parent.progress',function(value){

				var styles="";

				angular.forEach(value,function(prop,val){
	
					styles+=val+":"+prop+";";
				});
				angular.element(elem)[0].style.cssText=styles;
			});
		}
	}
};