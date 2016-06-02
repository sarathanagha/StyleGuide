'use strict';

module.exports = /*@ngInject*/ function($scope,$timeout){
$scope.item=$scope.$parent.parameter;
	 var lat = $scope.item.strtLat;
     var lng = $scope.item.strtLong;
     var lat1=$scope.item.stpLat;
     var lng1=$scope.item.stpLong;


            getAddress(new google.maps.LatLng(lat, lng),0);
            getAddress(new google.maps.LatLng(lat1, lng1),1)
           // $scope.item.endLocation= getAddress(new google.maps.LatLng(lat1, lng1));

            
           
            
            function getAddress(latlng,flag){
            	
              var x;
            	 var geocoder=new google.maps.Geocoder();
            	geocoder.geocode({'latLng': latlng }, function (results, status) {
           	
           	$scope.item.hi=true;

           		if(results!=null||results!=undefined){
           		x=results[0]['formatted_address'];
                	 

           	}
           	//$scope.item=$scope.item;

           
           	
    	
   });
            	
            	$timeout(function(){
            		if(x){	
            		if(flag==0)
            		$scope.item.startLocation=x;
            	else
            		$scope.item.endLocation=x;
            		}


            	},2000);
            	
            }
           
            	
            		$timeout(function(){
            			$scope.item=$scope.item;
            		},2500);
            	

};