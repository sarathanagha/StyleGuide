'use strict';

module.exports = /*@ngInject*/ function($anchorScroll, $modal, $location, $scope, $filter, $window, $timeout,
	$q, PoiService, uiGmapIsReady, MapService, StatusBarService, AlertModalService,$state, CommonUtilsService,PoiNewService,$cookies,PoiServiceP) {

	var vm = this;
	var trues;
	var poiSeqList;
	var _gMap;
	var _map;
	var _iscroll;
	var _isTilesLoaded;

	vm.poiList = [];
	vm.poiStatus = {poiStatus:'Z'};
	vm.sortOption = 'poiSeq';
	vm.sortReverse = true;
	vm.currentPoiIndex = -1;
	vm.mobileMaps = [];
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
            }
		}
	};


vm.showPoiList = ($cookies['isShow']==="true")?true:false;
if($cookies['isShow'] === undefined){
    vm.showPoiList = true;
    $cookies['isShow'] = true;
}else{
	vm.showPoiList =  ($cookies['isShow']==="true")?true:false;
}
	
	vm.sortPoi = function(option) {
		vm.showPoiList = true;
		PoiNewService.setIndex(option);
		switch(option) {
			case 0: {
				vm.sortOption = 'poiSeq';
				vm.sortReverse = true;
				vm.sortOptionValue = 'NEWEST';
				break;
			}
			case 1: {
				vm.sortOption = 'poiSeq';
				vm.sortReverse = false;
				vm.sortOptionValue = 'OLDEST';
				break;
			}
			case 2: {
				vm.sortOption = 'cityNm';
				vm.sortReverse = false;
				vm.sortOptionValue = 'CITY';
				break;
			}
			case 3: {
				vm.sortOption = 'stNm';
				vm.sortReverse = false;
				vm.sortOptionValue = 'STATE';
				break;
			}
			case 4: {
				vm.sortOption = 'poiNm';
				vm.sortReverse = false;
				vm.sortOptionValue = 'NAME OF LOCATION';
				break;
			}
		}
	};

	if(PoiNewService.getIndex()){
		var newdropindex=PoiNewService.getIndex();
		  vm.sortPoi(newdropindex);

	}else{
		vm.sortOptionValue = 'NEWEST';
	}

	vm.isPending = function() {
		if (vm.poiStatus.poiStatus === 'P') {
			return true;
		} else {
			return false;
		}
	};

	vm.toggleManageMenu = function() {
		vm.currentPoiIndex = -1;
		if (!vm.isPending()) {
			vm.showManageMenu = !vm.showManageMenu;
		}
	};

	vm.enableDeleteButton = function(){
		$scope.$watch('vm.poiList' , function(n, o){
        	trues = $filter('filter')( n , {poiSelected: true} );
        	$scope.selectedPois = trues;
        	$scope.resolve = trues.length;
    	}, true );
	};

	vm.checkSelected = function() {
		if (vm.poiList) {
			for (var i = 0; i < vm.poiList.length; i++) {
				if (vm.poiList[i].poiSelected) { return true; }
			}
			return false;
		}
	};

	vm.openPoiModal = function(type) {
		if(type === 'edit' || vm.poiList.length != 25){
		if (vm.isPending()) {return;}

		var options = {
			templateUrl: 'views/components/poi/templates/poi-modal.html',
		    size: 'lg',
		    keyboard: false,
		    backdrop: 'static',
		    controller: 'PoiModalController',
		    controllerAs: 'vm',
		    windowClass: 'poi-modal-window',
		    resolve : {
		    	data: function() {
		    		var data = {type:type};
		    		if (type === 'edit') {
		    			var poi = PoiService.createPoiModel();
		    			var prop;
		    			for (prop in vm.poiList[vm.currentPoiIndex]) {
		    				if (vm.poiList[vm.currentPoiIndex].hasOwnProperty(prop)) {
		    					poi[prop] = vm.poiList[vm.currentPoiIndex][prop];
		    				}
		    			}
						data.poi = poi;
					}
					return data;
		    	}
		    }
		};


		var modalInstance = $modal.open(options);


		modalInstance.result.then(function(data) {

			var notesOnly = data.notesOnly;
			var poi = data.poi;

			//vm.modalData = data;
          //  vm.typeReq = type;

          PoiNewService.setModalData({data:data,type:type});
			// if (type === 'edit') {
			// 	var prop;
			// 	for (prop in poi) {
			// 		if (poi.hasOwnProperty(prop)) {
			// 			vm.poiList[vm.currentPoiIndex][prop] = poi[prop];
			// 		}
			// 	}
			// } else if (type === 'add') {
			// 	vm.poiList.push(poi);
			// }

			StatusBarService.showLoadingStatus();
			PoiService.savePois(poi,type,notesOnly).then(function(data) {
				StatusBarService.clearStatus();
				loadData();
				$state.reload();
			});
		});
	}else{
		AlertModalService.openModal('poi-limit.html');
	}
	};

	vm.reSendRequest = function(){
        StatusBarService.showLoadingStatus();
         var data1 =  PoiNewService.getModalData();
         var notesOnly = data1.data.notesOnly;
         var type = data1.type;
			var poi = data1.data.poi;
			PoiService.savePois(poi,type,notesOnly).then(function(data) {
				StatusBarService.clearStatus();
				loadData();
				$state.reload();
			});
	};

	/*
	 params:
	 	type (string) :
	 		'single' : used when clicking trashcan icon,
	 		'selected' : deleting items one-by-one through manage mode,
	 		'all' : deleting all items through manage mode
	*/
	vm.openConfirmDelete = function(type) {
		if (type === 'single' || type === 'all' || (type === 'selected' && vm.checkSelected())) {
			var templateUrl = type === 'selected' || type ==='single' ? 'poi-confirm-delete.html' : 'poi-confirm-delete-all.html';
			var modalInstance = AlertModalService.openModal(templateUrl);

		    modalInstance.result.then(function() {
		    	function getSelectedItems() {
		    		var idList = [];
		    		for (var i = 0; i < vm.poiList.length; i++) {
		    			if (vm.poiList[i].poiSelected || type === 'all') {
		    				idList.push(vm.poiList[i].poiSeq);
		    			}
		    		}
		    		return idList;
		    	}

 				$cookies['isShow'] = vm.showPoiList;
		    	var data = (type === 'single') ? vm.poiList[vm.currentPoiIndex].poiSeq : getSelectedItems();

		    	PoiService.deletePois(data).then(function() {
		    		vm.currentPoiIndex = -1;
		    		vm.showManageMenu = false;
		    		loadData();
		    		$state.reload();
		    		
		    	});
		    });
		}
	};

	vm.openConfirmDeleteAll = function() {
		var modalInstance = AlertModalService.openModal('poi-confirm-delete-all.html');

		modalInstance.result.then(function() {


		});
	};

	// this function expands mobile accordion and reveal popup/info for
	// selected poi

  vm.selectCurrentPoi = function(index,fromMarker,isOpenTitle) {
  	 var poi = vm.poiList[index];
  	 vm.map.window.show = true;
  	if(fromMarker){
  		vm.map.window.isOpen= true;
		vm.map.window.isOpen= (isOpenTitle != poi.markerId);
  	}else{
		
     	vm.map.window.isOpen= !isOpenTitle;
  	}
  	 	
    if (!poi.isMarkersAvaliable) {
      poi.mobileInfoBoxOptions =
        MapService.createInfoBoxOptions(index, true, vm.map);
      poi.infoBoxOptions =
        MapService.createInfoBoxOptions(index, false, vm.map);
      poi.isMarkersAvaliable = true;
    }
    
    toggleMarkers(index, poi, fromMarker);
  };

  function toggleMarkers (index, poi, fromMarker) {
    if (!fromMarker) {
      _gMap.event.trigger(vm.map.markerControl.getGMarkers()[index],'click');
      return;
    }
    if (_.isEmpty(vm.map.control)) {
      return;
    }
    var map = vm.map.control.getGMap();
    var mobileMap = vm.map.control.getGMap();
    var iboxes = getInfoBoxes(index);
    vm.isSmallScreen = CommonUtilsService.isSmallScreen();
    // if currentIndex is the same, deselect poi
    if (index === vm.currentPoiIndex) {
      vm.currentPoiIndex = -1;
      /*iboxes.mInfoBox.close();*/
    } else {
      vm.currentPoiIndex = index;
      $('.poi-list-xs').scrollTop($('poi-anchor-' + index).scrollTop());

      $timeout(function() {
        _gMap.event.trigger(mobileMap, 'resize');

        // tiles are not loaded until it div shows at least once
        if (poi.tilesLoaded) {

           iboxes.mInfoBox?iboxes.mInfoBox.open(mobileMap):'';
          mobileMap.setZoom(12);
        } else {
          /*iboxes.mInfoBox.open(mobileMap);*/
          mobileMap.setZoom(12);
          poi.tilesLoaded = true;
        }

        _gMap.event.trigger(map, 'resize');
        var defaultCenter = MapService.getDefaultCenter();
         map.setCenter(new _gMap.LatLng(defaultCenter.latitude,defaultCenter.longitude));
        map.setCenter(new _gMap.LatLng(poi.lae, poi.loc));
        map.setZoom(12);

        _iscroll.refresh();
      }, 500);
    }
  }

	vm.viewPoiOnMap = function(index){
		vm.currentPoiIndex = -1;
		vm.selectCurrentPoi(index);
	};

	vm.resizeMap = function() {
		$timeout(function() {
			if (vm.map.control) {
				var map = vm.map.control.getGMap();
				var center = map.getCenter();
				_gMap.event.trigger(map, 'resize');
				map.setCenter(center);
			}
		});
	};

	function getInfoBoxes(index) {
		var poi = vm.poiList[index];
    var gWin = poi.mobileInfoBoxOptions.window.control.getGWindows();
		var _infoBox, _mInfoBox,i;

		// get infobox for desktop and mobile views
		for (i=0;i<gWin.length;i++) {
			if (gWin[i].boxClass_.indexOf('m-ib'+index) !== -1) {
				_mInfoBox = gWin[i];
				if (_infoBox) { break; }
			}
			if (gWin[i].boxClass_.indexOf('ib'+index) !== -1) {
				_infoBox = gWin[i];
				if (_mInfoBox) { break; }
			}
		}

		return {infoBox:_infoBox, mInfoBox:_mInfoBox};
	}

	function loadData() {
		StatusBarService.showLoadingStatus();
		PoiServiceP.getPois().then(function(data) {
			if (!data.poiStatus) {
				StatusBarService.clearStatus();
			}
			else if (data.poiStatus && data.poiStatus.poiStatus !== 'P') {
				// if status was pending before, and is now successful, flash green status bar
				if (vm.poiStatus.poiStatus === 'P') {
					StatusBarService.showSuccessStatus();
				// show error status
				} else if (data.poiStatus.poiStatus === 'E') {
					StatusBarService.showErrorStatus();
				// clear status for other cases
				} else {
					StatusBarService.clearStatus();
				}
			} else if (data.poiStatus.poiStatus === 'P') {
				$timeout(function() {

					loadData();
				},30000);
			}
			if (data.poiStatus) { vm.poiStatus = data.poiStatus; }

		    vm.poiList = data.poiList;
		    if(vm.poiList.length == 0){
		    	vm.hideManageMenu = true;
		    	vm.showPoiList = false;
		    }else{
		    	vm.hideManageMenu = false;
		    	vm.showPoiList =   ($cookies['isShow']==="true")?true:false;
		    }

			$timeout (function() {
				if (_iscroll) {
					_iscroll.refresh();
				} else {
					_iscroll = new IScroll($('#my-pois .poi-interface-container.hidden-xs .poi-container').get(0), {
			          scrollbars            : 'custom',
			          mouseWheel            : true,
			          interactiveScrollbars : true
			        });
		        }
			}, 100);

			// if gMap exists, just load the markers. This may happen when data is being reloaded.
			if (_gMap) {
				initMaps();
			} else {
			    MapService.getGMap().then(function(maps) {

					_gMap = maps; // google map library instance
					vm.map = angular.extend(vm.map, MapService.createMapOptions());
					
					$scope.$watch(function(){
					return window.innerWidth;
					},function(value){
					if(value > 1000){
						vm.map.options.panControl = true;
					    vm.map.options.zoomControl = true;
					    vm.isMobile = false;
					}else{
						vm.map.options.panControl = false;
					    vm.map.options.zoomControl = false;	
					    vm.isMobile = true;					
					}

					});

					vm.map.window.options = MapService.createInfoBoxOptions(0);

					initMaps();
				});
			}

			function initMaps() {
				// populate map options and pre-opened infoboxes for mobile maps
				var i, markers=[];
				for (i=0;i<vm.poiList.length;i++) {
					var poi = vm.poiList[i];

					// populate markers for desktop map
					var marker = MapService.createMarker(i, poi.lae, poi.loc);
					marker.name = poi.poiNm;
					marker.zip = poi.zip;
					marker.street = poi.stetNm;
					marker.city = poi.cityNm;
					marker.state = poi.stNm;
					marker.tn = poi.tn;
					marker.userNote = poi.userNote;
					markers.push(marker);
					vm.poiList[i].mobileMapId = 'm'+ i;
				}

				vm.map.markers = markers;
			}
	  	});
	}

	$anchorScroll(0);
	loadData();
};
