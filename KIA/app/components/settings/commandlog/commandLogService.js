
'use strict';
 module.exports = /*@ngInject*/ function(HttpService, $q) {
  return{
    getCommandLog : function() {      
      var deferred = $q.defer();
      HttpService.get('/ccw/kh/remoteCommandsLog.do').success(function(data) {
        
         deferred.resolve(data);
       });
     return deferred.promise;
    },
     getVehicles : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/carInfo.do').success(function(data) {	      		
	        	deferred.resolve(data);
	        });
	       	return deferred.promise;
    	} 
  };

};