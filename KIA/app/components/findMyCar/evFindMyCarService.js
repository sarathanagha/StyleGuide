'use strict';

module.exports = /*@ngInject*/ function(HttpService,$q,$timeout,$location) {

	return {		

    	getcarLocation : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/ev/myCarLocation.do').success(function(data) {	
	      		
	      		if($location.$$port==9000){
	      			$timeout(function(){      		
	        	deferred.resolve(data);
	        },5000);
	      		}
	      		else{
	      			deferred.resolve(data);
	      		}
	      	
			});
return deferred.promise;

	       	
    	}
    	 
	};
};
