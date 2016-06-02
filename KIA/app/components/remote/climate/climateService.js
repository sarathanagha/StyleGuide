'use strict';

module.exports = /*@ngInject*/ function(HttpService,  $q , SpringUtilsService,$location,$timeout) {

	return {		

    	getOutsideTemp : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/kh/outsideTemp.do').success(function(data) {	      		
	        	deferred.resolve(data);
			});
	       	return deferred.promise;
    	},
    	scheduledInfo:function(offset){
    		
    	  var deferred = $q.defer();
	      	HttpService.get('/ccw/kh/scheduledInfo.do?offset='+offset).success(function(data) {	      		
	        	deferred.resolve(data);
			});
	       	return deferred.promise;
    	},
    	reserveInfo:function(reserveHVAC, offset){
    		
    		var payload = SpringUtilsService.encodeParams({'rsvHvacInfo':JSON.stringify(reserveHVAC),'offset':+offset});   
			var headers = {
     			'Content-Type':'application/x-www-form-urlencoded'
   			};
    	  var deferred = $q.defer();
	      	HttpService.post('/ccw/kh/reserveHVAC.do',payload, headers).success(function(data) {	      		
	        	deferred.resolve(data);
			});
	       	return deferred.promise;
    	},
    	remoteVehicleStatus:function(){
    		var deferred = $q.defer();
	      	HttpService.get('/ccw/kh/vehicleStatusRemote.do').success(function(data) {
	      	if($location.$$port==9000){
	      			$timeout(function(){      		
	        	deferred.resolve(data);
	        },7000);
	      		}
	      		else{
	      			deferred.resolve(data);
	      		}	      		
	        	
			});
	       	return deferred.promise;
    	},
    	vehiclestart:function(payLoadData,onOffE){
    		var payload = SpringUtilsService.encodeParams(payLoadData);  
    		var url = (onOffE == "on") ?  '/ccw/kh/remoteStart.do' : '/ccw/kh/remoteStop.do'
			var headers = {
     			'Content-Type':'application/x-www-form-urlencoded'
   			};
    		var deferred = $q.defer();
	      	HttpService.post(url,payload,headers).success(function(data) {	      		
	        	deferred.resolve(data);
			});
	       	return deferred.promise;
    	}
	};
};
