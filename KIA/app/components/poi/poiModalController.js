'use strict';

module.exports = /*@ngInject*/ function($scope, $modalInstance, $timeout, MapService,
			LocationService, PoiServiceP, CommonUtilsService, data) {

	var vm = this;
	var _gMap; // google map library
	var _map;  // map instance
	var _location;
	var _iscroll;
	var _isTilesLoaded = false;

	vm.type = data.type;
	vm.currentIndex = -1;
	vm.poiList = [];
	vm.poiForm = {};
	vm.map = {
		mapEvents:{
			tilesloaded: function(map) {
				if(!_isTilesLoaded) {
					$timeout(function() {
						$scope.$apply(function () {
											_map = map;
											_isTilesLoaded = true;
											//onTilesLoadedFn();
										});
					}, 1000);
				}
			}
		},
		markerEvents:{
			click: function(marker, eventName, model, args) {
				vm.map.window.closeClick();
				vm.citya = model.city.split(',')[0];
				if(model.city){
					model.city = vm.citya +',';
				}
				
                vm.map.window.model = model;
                vm.map.window.show = true;
            }
		}
	};

$scope.$watch(function(){
return window.innerWidth;
},function(value){
if(value > 1000){
	vm.map.window.show1 = true;
    vm.map.window.show2 = false;
}else{
	vm.map.window.show2 = true;
	vm.map.window.show1 = false;
}

});

	//vm.addValidation = false; 
	navigator.geolocation.getCurrentPosition(showPosition); 	
	function showPosition (position) {
			var currentLocCoordinates={latitude:position.coords.latitude,longitude:position.coords.longitude}
			vm.map.center = currentLocCoordinates;
			vm.map.zoom = 12;
	}



    $scope.$watch('vm.poiForm.tn',function(val){
			if(val == undefined || val == ""){
			 //    vm.addValidation = false;
			}else{
				// vm.addValidation = true;
			}
    });
	vm.openMap = function() {
		if (!vm.showMapMobile) {
			vm.showMapMobile = true;
			$timeout(function() {				
				var center = _map.getCenter();
				vm.map.control.refresh(center);
				_map.setCenter(center);
				var bounds = new _gMap.LatLngBounds();
				for (var i = 0; i < vm.map.markers.length; i++) {
					bounds.extend(new _gMap.LatLng(vm.map.markers[i].latitude,vm.map.markers[i].longitude));
				}
				_map.fitBounds(bounds);
				 vm.map.window.options = MapService.createInfoBoxOptions(0);
    	    vm.map.window.options.minWidth = 230;
			}, 200);
		}
	};

	vm.closeModal = function() {
		if (vm.type === 'edit') {
			$modalInstance.dismiss();
		} else {

			vm.showEditPanel = false;
			angular.element('.poi').removeClass('selected');
			vm.map.window.show = false;
		}
	};

	vm.countNotesCharacters = function(input) {
		if (input) {
			var length = input.length;
			var count = 80 - length;
			return (count < 0) ? 0 : count;
		} else {
			return 80;
		}

	};

	vm.openPoiEditor = function(id) {
		vm.setCurrentIndex(id);
		var poi = vm.poiList[vm.currentIndex];
		MapService.getPlaceDetail(poi['place_id'],_map).then(function(response) {
			vm.poiForm = PoiServiceP.googleDetailToPoiModel(response);
		});
		vm.showEditPanel = true;
	};

	vm.setCurrentIndex = function(id, fromMarker) {
		 vm.map.window.options = MapService.createInfoBoxOptions(0);
		if (vm.type !== 'edit') {
			vm.currentIndex = id;
			if (!fromMarker) {
				_gMap.event.trigger(vm.map.markerControl.getGMarkers()[id],'click');
			}
			_iscroll.scrollToElement('.poi' + id);
		}
	};

	vm.savePoi = function(form) {
		vm.submitted = true;
		if (!form.$invalid) {
			// return with result
			var notesOnly = form.name.$pristine  && form.notes.$dirty; //&& form.phone.$pristine
			var poi = PoiServiceP.createPoiModel();
			var prop;
			for (prop in poi) {
				if (poi.hasOwnProperty(prop)) {
					poi[prop] = vm.poiForm[prop];
				}
			}
			var retData = {
				poi:poi,
				notesOnly:notesOnly
			};
			$modalInstance.close(retData);
		}
	};

	vm.searchPoi = function (event,data) {
		if ((event.keyCode === 13 && vm.searchBox) || data) {
			vm.showEditPanel = false;
			var map = vm.map.control.getGMap();
			var svc = new _gMap.places.PlacesService(map);
			// If map is showing, bounds can be retrieved
			// otherwise, must provide the center and radius
			var request = (vm.showMapMobile) ?
				{ query : vm.searchBox,
				  bounds: map.getBounds()
				} :
				{ query : vm.searchBox,
				  location: map.getCenter(),
				  radius: 25
				};
			svc.textSearch(request, searchCallback);
		}
	};

	function onTilesLoadedFn() {
		if (vm.type === 'edit') {
			var poi = vm.poiForm;
			var marker = MapService.createMarker(0, poi.lae, poi.loc);
			marker.name = poi.poiNm;
			marker.zip = poi.zip;
			marker.street = poi.stetNm;
			marker.city = poi.cityNm;
			marker.state = poi.stNm;
			vm.map.markers.push(marker);
			vm.map.control.refresh(new _gMap.LatLng(poi.lae, poi.loc));

		} else if (vm.type === 'add') {
			var lastLocation = LocationService.getLastKnownLocation();
			_location = !lastLocation ? MapService.getDefaultCenter() : lastLocation;
			vm.map.control.refresh(_location);

			LocationService.getCurrentLocation().then(function(response) {
				_location = response.coords;
				vm.map.control.refresh(_location);
				if (response.success) { _map.setZoom(12); }
			});
		}
	}

	function searchCallback(results, status) {
		if (_gMap.places.PlacesServiceStatus.OK) {
			var i;
			var usAddresses = [];
			var markers = [];
			for (i=0;i<results.length;i++) {
				//if(results[i].formatted_address.indexOf('United States') > -1){
				var location = results[i].geometry.location;
				var address = MapService.getAddressComponents(results[i]['formatted_address']);
				results[i] = angular.extend(results[i],address);

                var marker = MapService.createMarker(i,location.lat(),location.lng());
                marker.name = results[i].name;
                marker.id = i;
                marker = angular.extend(marker,address);
                usAddresses.push(results[i]);
                markers.push(marker);
            // }
			}
			//vm.poiList = results;
			vm.map.markers = markers;
			vm.poiList = usAddresses;
			if (!vm.showPoiList) { vm.showPoiList = true; }
			$scope.$apply();

			if (_iscroll) {
				_iscroll.refresh();
				_iscroll.scrollTo(0);
			} else {
				_iscroll = new IScroll($('.poi-modal .poi-container').get(0), {
		          scrollbars            : 'custom',
		          mouseWheel            : true,
		          interactiveScrollbars : true
		        });
			}

			vm.map.window.show = false;
			vm.currentIndex = -1;
			var center = _map.getCenter();
			vm.map.control.refresh();
			_map.setCenter(center);
		}
	}

	// init ///////////////////////////////////////////////////////////////////////
	if (vm.type === 'edit') {
		vm.poiForm = data.poi;
    vm.poiForm.userNote = vm.poiForm.userNote.replace(/\\n/g, "\n");
		vm.poiForm.addressSecondLine = PoiServiceP.formatAddress(data.poi);
		vm.poiForm.tn = CommonUtilsService.formatPhoneNumber(data.poi.tn)? CommonUtilsService.formatPhoneNumber(data.poi.tn).replace(/\s+/g,''):'';
	}

    MapService.getGMap().then(function(gMap) {
    	_gMap = gMap;
		var markers=[];
    	vm.map = angular.extend(vm.map,MapService.createMapOptions());
    	 vm.showthis=true;
    	if(vm.type === 'edit'){
            var poi = vm.poiForm;
			var marker = MapService.createMarker(0, poi.lae, poi.loc);
			vm.map.window.show=true;
			marker.name = poi.poiNm;
			marker.zip = poi.zip;
			marker.street = poi.stetNm;
			marker.city = poi.cityNm;
			marker.state = poi.stNm;
			marker.tn = poi.tn;
			marker.userNote = poi.userNote;
			markers.push(marker);
			vm.map.markers=markers;
    	   vm.map.window.show=true;
    	    vm.map.window.model=marker;    	    
    	    vm.map.window.options = MapService.createInfoBoxOptions(0);
    	    vm.map.window.options.minWidth = 230;
    	    }
    	    if(vm.type === 'add'){
    	    vm.map.window.show=true;
    	  	 vm.map.zoom = 5;
    	    }
    });
};
