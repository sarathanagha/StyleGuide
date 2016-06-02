'use strict';

module.exports = /*@ngInject*/ function($anchorScroll, $timeout, $state, $modal, $scope,
	uiGmapIsReady, MapService,evFindMyCarService,$rootScope,StatusBarService, $location, $window) {

	var vm = this,
	dtcDone = false,
	vehiclesDone = false;
	vm.selectAll=true;
	vm.selectsome=true;
	vm.limit=5;
	var poiSeqList;
	var _gMap;
	var _map;
	var _iscroll;
	var _isTilesLoaded;
	vm.getcar=true;
	$rootScope.inClimateControl=true;
	vm.map = {
		
		mapEvents:{
			tilesloaded: function(map) {
				if(!_isTilesLoaded) {
					$scope.$apply(function () {
						_map = map;
						_isTilesLoaded = true;
					});
				}
			}
		},
		markerEvents:{
			click: function(marker, eventName, model, args) {
				vm.map.window.closeClick();
				vm.map.window.model = model;
				vm.map.window.show = true;	
				vm.map.window.showthis = false;			 				
			}
		}
	};

	MapService.getGMap().then(function(maps) {

					_gMap = maps; // google map library instance

					
					
					vm.map = angular.extend(vm.map, MapService.createMapOptions());
				
					vm.map.zoom=4;
					
					
					vm.map.center={latitude:39.833333,longitude:-98.583333};
					vm.map.window.options = MapService.createInfoBoxOptions(0);	
					vm.map.window.model
					//initMaps();
				});	

	function getAddress(latlng,flag){

		var x;
		var geocoder=new google.maps.Geocoder();
		geocoder.geocode({'latLng': latlng }, function (results, status) {



			if(results!=null||results!=undefined){
				x=results[0]['formatted_address'];


			}

		});

		$timeout(function(){
			if(x){	

				vm.map.window.model.location=x;
			}


		},2000);

	}
 $scope.$on('$destroy', function() {
   $rootScope.progress={};
   $rootScope.progressstatus="";
  });

 $scope.$on('$stateChangeStart', function(event, newUrl, oldUrl) {
        if(vm.pending==true){
        if (!$window.confirm('Are you sure you want to navigate away from this page')){
          event.preventDefault();
        }//vm.pending = false;
        }
    });

	vm.pending=false;
	
	vm.ShowcarLocation=function(){
		StatusBarService.showLoadingStatus();
		vm.map.window.show=true;
		vm.getcar=false;
		vm.pending=true;
		$rootScope.progress={background: ""};
		evFindMyCarService.getcarLocation().then(function(resp){
			
			vm.item = resp;
			if(resp.success==true){
				StatusBarService.showSuccessStatus();
					vm.showcar=true;
					vm.pending=false;
					vm.hasMessege = true;
					vm.successCall = true;
					vm.messegeStatus = 'Vehicle successfully located!';
				$timeout(function(){
					vm.hasMessege = false;
			        vm.messegeStatus = '';
			        vm.successCall = false;
					
				},5000);
					
			$scope.location=resp.coord;
			vm.map.window.model=$scope.location;
			var lat = vm.map.window.model.lat;
			var lng = vm.map.window.model.lon;
			var latlng = new google.maps.LatLng(lat, lng);
			getAddress(latlng);


			vm.map.zoom=16;
					
					
			vm.map.center={latitude:lat,longitude:lng};

			


				// populate map options and pre-opened infoboxes for mobile maps
				var i, markers=[];
				vm.poiList=[$scope.location];
				for (i=0;i<vm.poiList.length;i++) {
					var poi = vm.poiList[i];

					// populate markers for desktop map
					var marker = MapService.createMarker(i, poi.lat, poi.lon,15);
					
					

					markers.push(marker);

					// process map options for mobile
					vm.poiList[i].map = MapService.createMapOptions();	
					vm.poiList[i].mobileInfoBoxOptions = 
					MapService.createInfoBoxOptions(i,vm.poiList[i].lat, vm.poiList[i].lon, true);
					vm.poiList[i].infoBoxOptions = 
					MapService.createInfoBoxOptions(i,vm.poiList[i].lat, vm.poiList[i].lon);
					vm.poiList[i].mobileMapId = 'm'+ i;		
				}

				vm.map.markers = markers;	
			}
			else{
			 vm.pending=false;
             vm.error=true;	
             vm.hasMessege = true;
			 vm.unsuccessCall = true;
			 vm.messegeStatus = 'Unable to communicate with your vehicle. Please try later';
			 StatusBarService.showErrorStatus();
			 	$timeout(function() {
			          vm.hasMessege = false;
			          vm.messegeStatus = '';
			          vm.unsuccessCall = false;
			        }, 5000);
             
			}
			
			});
		
	};
		
	$anchorScroll(0);
};
