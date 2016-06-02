'use strict';

module.exports = /*@ngInject*/ function(HttpService,  $q,SpringUtilsService,$cookies,$state) {

	var imageURL = '/kar/images/changeCar/';


	return {		

    	getTempInfoCp : function() {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/cp/speedLimitAlertDetails.do').success(function(data) {	      		
	        	deferred.resolve(data);
			});
	       	return deferred.promise;
    	},
    	getTempInfo : function(alert) {      
			var deferred = $q.defer();
	      	HttpService.get('/ccw/kh/speedAlertDetails.do',alert).success(function(data) {	      		
	        	deferred.resolve(data);
			});
	       	return deferred.promise;
    	},
    	deleteSpeedAlerts : function(alert) { 
    		var genType = $cookies['gen'];             
    	
			var headers = {
     			'Content-Type':'application/x-www-form-urlencoded'
   			};
   			
			var deferred = $q.defer();
			if(genType && (genType == 'gen1plus' || genType == 'gen1')){ 

					var violTrscIdList = [],
	                violTrscSeqList = [],
	                violSeqList = [];
	
	            $.each(alert, function (index, details) {
	                violTrscIdList[index] = details.headerTid;
	                violTrscSeqList[index] = details.trscSeq;
	                violSeqList[index] = details.violSeq;
	            });
	
	            var postData = {
	                violType        : "S",
	                violTrscIdList  : violTrscIdList.join(","),
	                violTrscSeqList : violTrscSeqList.join(","),
	                violSeqList     : violSeqList.join(","),
	                deleteViol      : "deleteSelected"
	            };

		      	HttpService.post('/ccw/cp/deleteTripAlertsDetail.do',$.param(postData), headers).success(function(data) {	      		
		        	deferred.resolve(data);
		        	$state.reload();
		        });
	      }
	      if(genType && genType == 'kh'){
	      	var payload = SpringUtilsService.encodeParams({'speedAlertDetailPayLoad':JSON.stringify(alert)});
			HttpService.post('/ccw/kh/speedAlertDetails.do',payload,headers).success(function(data) {	      		
	        	deferred.resolve(data);
	        });
	      }
	       	return deferred.promise;
    	}
    	 
	};
};
