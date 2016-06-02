'use strict';

module.exports = /*@ngInject*/ function($scope,$cookies,LogoutService,$cookieStore,HttpInterceptor) {
  $scope.logout = function() {
  
  	//document.cookie = 'emailAddress=; expires=Thu, 01 Jan 1970 00:00:01 GMT;;domain=.myuvo.com; path=/';   
  	if ($cookies['emailAddress']) { $cookies['emailAddress']= ''; }
  	if ($cookies['expires']) { $cookies['expires']= 'Thu, 01 Jan 1970 00:00:01 GMT'; }
  	if ($cookies['domain']) { $cookies['domain']= '.myuvo.com'; }
  	if ($cookies['path']) { $cookies['path']= '/'; }
  	if ($cookies['JSESSIONID']) {$cookies['JSESSIONID']='';}
    if ($cookies['vin']) {$cookies['vin']='';}
    if ($cookies['gen']) {$cookies['gen']='';}
    // $cookies or $cookieStore is not working as they don't have efficient cookies handing api in angularjs 1.3.20
    // to provide path and domain for the cookie.
    // so removing 'emailAddress' cookie with basic way as it is set.
    document.cookie = "emailAddress=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.myuvo.com; path=/";
    angular.forEach($cookies, function (v, k) {  
        $cookieStore.remove(k);
    });
  	LogoutService.logout().then(function(resp) {     
  		window.location = '/ccw';
  	});    
  };
};
