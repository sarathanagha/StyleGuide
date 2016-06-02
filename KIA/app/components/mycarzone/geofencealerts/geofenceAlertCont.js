'use strict';

module.exports = /*@ngInject*/ function($scope,$timeout,$cookies){
 var genType = $cookies['gen'];
    if(genType && (genType == 'gen1plus' || genType == 'gen1')){
     $scope.isGen1Plus = true;
  }else{
     $scope.isGen1Plus = false;
  }
    $scope.item=$scope.$parent.parameter;
  /*  $timeout(function(){
      var str =  $scope.item.address ? ($scope.item.address.split('USA')[0]).trim() : '';
      $scope.item.address= str.substring(0,str.length-1);
    },100);*/
      	   if($scope.item){
           var lat = $scope.item.strtLat;
           var lng = $scope.item.strtLong;
           var lat1=$scope.item.stpLat;
           var lng1=$scope.item.stpLong;
            getAddress(new google.maps.LatLng(lat, lng),0);
            getAddress(new google.maps.LatLng(lat1, lng1),1);   
            }        
            var x ;
            function getAddress(latlng,flag){
            	    var geocoder=new google.maps.Geocoder();
            	    geocoder.geocode({'latLng': latlng }, function (results, status) {
           	        $scope.item.hi=true;
             		if(results!=null||results!=undefined){
             		//x[flag]=results[0]['formatted_address'];
                
                x = results[0]?results[0]['formatted_address']:'';
           	  }
           	//$scope.item=$scope.item;
              });
            	
            	$timeout(function(){
            		if(x){	
            		if(flag==0){
                 /*  var str = (x[0].split('USA')[0]).trim();
            		$scope.item.startLocation=str.substring(0,str.length-1);*/
                $scope.item.startLocation = x;
              }
            	else{
               /* var str = (x[1].split('USA')[0]).trim();
            		$scope.item.endLocation=str.substring(0,str.length-1);*/
                $scope.item.endLocation = x;
               
            		}}},100);           	
            }
             		$timeout(function(){
            			$scope.item=$scope.item;
             		},200);
            	

};