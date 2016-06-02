'use strict';
 module.exports = /*@ngInject*/ function(HttpService, $q, $cookies) {
	return{
		getCurfewInfo : function() {      
			var deferred = $q.defer();
			if ($cookies['gen'] === 'kh') {
	      	HttpService.get('/ccw/kh/curfewAlertDetails.do').success(function(data) {	    		
	        		deferred.resolve(data);	        	
	        });
	      }else{
	      		      	HttpService.get('/ccw/cp/curfewAlertDetails.do').success(function(data) {
	      		      		deferred.resolve(data);	        	
	        			});	

	      }
	       	return deferred.promise;
    	}
    	
    	
	};
};