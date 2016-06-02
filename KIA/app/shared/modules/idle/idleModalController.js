'use strict';

module.exports = /*@ngInject*/ function($scope,$modalInstance, $cookies, $cookieStore, IdleService,$timeout) {

	var vm = this, timeOutVal = 5*60*1000;

	vm.close = function() {
		$modalInstance.close();
	};
	vm.logout=function(){
	// $cookies or $cookieStore is not working as they don't have efficient cookies handing api in angularjs 1.3.20
    // to provide path and domain for the cookie.
    // so removing 'emailAddress' cookie with basic way as it is set.		
		document.cookie = "emailAddress=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.myuvo.com; path=/";
		IdleService.logout().then(function(data){
			window.location = '/ccw';
		});
		$modalInstance.close();
	}

	var idle=$timeout(function(){
    	vm.logout();
	},timeOutVal);

	vm.keepAlive=function(){
		$timeout.cancel(idle);
		IdleService.keepAlive().then(function(data){

		});
		$modalInstance.close();
	}

};
