'use strict';
module.exports = /*@ngInject*/ function($timeout, $state, $modal, $scope,
    message, geofenceService, PoiService, uiGmapIsReady, MapService, StatusBarService) {
    var vm = this,
        dtcDone = false,
        vehiclesDone = false;
    vm.selectAll = true;
    vm.selectsome = true;
    vm.limit = 5;
    var poiSeqList;
    var _gMap;
    var _map;
    var _iscroll;
    var _isTilesLoaded;
    vm.Manage = true;
    vm.noGeoFence = {};
    vm.toggleObject = {
        item: -1
    };
    StatusBarService.showLoadingStatus();
    vm.noGeoFence.ssDvcType = "AVN";
    /*vm.bounds = {
    sw: {
    latitude: 33.753606781053136,
    longitude: -117.84867714264533
    },
    ne: {
    latitude: 33.663793218946864,
    longitude: -117.74071125735463
    }
    };*/
    vm.Manageit = function() {
        vm.mapshow = true;
        vm.Manage = false;
        angular.forEach(vm.speedlimit, function(val, key) {
            vm.speedlimit[key].show = false;
        });
    };
    vm.poiStatus = {
        poiStatus: 'Z'
    };
    vm.map = {
        mapEvents: {
            tilesloaded: function(map) {
                if (!_isTilesLoaded) {
                    $scope.$apply(function() {
                        _map = map;
                        _isTilesLoaded = true;
                    });
                }
            }
        },
        markerEvents: {
            click: function(marker, eventName, model, args) {
                vm.map.window.closeClick();
                vm.map.window.model = model;
                vm.map.window.show = true;
                vm.map.window.showthis = false;
            }
        }
    };
    vm.selectCurrentPoi = function(id, status, model, model1) {
        vm.map.window.getit = true;
        vm.map.window.show = true;
        vm.map.window.showId = id;
        vm.map.window.model = model;
        vm.map.window.model.id = id;
        if (id == 0) {
            vm.template = 'views/components/mycarzone/geofencealerts/windowtemp2.html';
        } else if (id == 1) {
            vm.template = 'views/components/mycarzone/geofencealerts/windowtemp1.html';
        } else {
            vm.template = 'views/components/mycarzone/geofencealerts/windowtemp.html';
        }
        $timeout(function() {
            vm.map.window.model = vm.map.window.model;
        }, 0);
        /*if(model){
        vm.map.window.show=true;
        vm.map.window.model = model;
        if(index==0){
        vm.template='windowtemp.html';
        }else if(index==2){
        vm.template='windowtemp1.html';
        //alert("end");
        }else{
        vm.template='windowtemp2.html';
        //alert("alert");
        }*/
        var lat = model.latitude;
        var lng = model.longitude;
        var latlng = new google.maps.LatLng(lat, lng);
        var geocoder = geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'latLng': latlng
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                /* var str = (results &&  results[0].formatted_address) ? (results[0].formatted_address.split('USA')[0]).trim():"";
                vm.map.window.model.address=str.substring(0,str.length-1);*/
               
                vm.map.window.model.address = results[0]?results[0]['formatted_address']:'';
                $timeout(function() {
                    vm.map.window.model = vm.map.window.model;
                }, 0);
            }
        });
    };
    //};
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
    vm.showMap = function(ind, pos, item) {
        /*if(message=='kh'){
        vm.poiList=[
        {lae:vm.speedlimit[ind].latitude,loc:vm.speedlimit[ind].longitude,image:'images/MyCarZone/marker_red_alert.png'}];
        }
        else{*/
        _gMap = undefined;
        vm.poiList = [{
            lae: vm.speedlimit[ind].latitude,
            loc: vm.speedlimit[ind].longitude,
            image: 'images/MyCarZone/marker_red_alert.png'
        }, {
            lae: vm.speedlimit[ind].stpLat,
            loc: vm.speedlimit[ind].stpLong,
            image: 'images/MyCarZone/marker_blue_driving_end.png'
        }, {
            lae: vm.speedlimit[ind].strtLat,
            loc: vm.speedlimit[ind].strtLong,
            image: 'images/MyCarZone/marker_green_driving_start.png'
        }];
        //}
        /*if (_gMap) {
        initMaps();
        if(vm.speedlimit[ind].circleFenceType=='0'){
        vm.map.zoom=11;
        }
        } else {*/
        vm.itemIndex = ind;
        MapService.getGMap().then(function(maps) {
            _gMap = maps; // google map library instance
            vm.map = angular.extend(vm.map, MapService.createMapOptions());
            $scope.$watch(function() {
                return window.innerWidth;
            }, function(value) {
                if (value > 1000) {
                    vm.map.options.panControl = true;
                    vm.map.options.zoomControl = true;
                } else {
                    vm.map.options.panControl = false;
                    vm.map.options.zoomControl = false;
                }
            });
            var rectBounds = new _gMap.LatLngBounds(
                new _gMap.LatLng(vm.speedlimit[ind].rectLeftLat, vm.speedlimit[ind].rectLeftLon),
                new _gMap.LatLng(vm.speedlimit[ind].rectRightLat, vm.speedlimit[ind].rectRightLon)
            );
            vm.bounds = rectBounds;
            vm.stroke = {
                color: '#DE0014',
                opacity: 0
            };
            vm.fill = {
                color: '#DE0014',
                opacity: 0.2
            };
            //If Kh Vehicle, then populate geofence entry and exit boundries 
            if (message == 'kh') {
                // if (vm.speedlimit[ind].circleCenterType == '1') {
                //     //vm.map.zoom = 11;
                //     switch (parseInt(vm.speedlimit[ind].radiusUom)) {
                //         case 0: // ft
                //             vm.speedlimit[ind].radius = parseFloat(vm.speedlimit[ind].radius) * 0.3048;
                //             break;
                //         case 1: // km
                //             vm.speedlimit[ind].radius = parseFloat(vm.speedlimit[ind].radius) * 1000;
                //             break;
                //         case 2: // m
                //             vm.speedlimit[ind].radius = parseFloat(vm.speedlimit[ind].radius);
                //             break;
                //         case 3: // mi
                //             vm.speedlimit[ind].radius = parseFloat(vm.speedlimit[ind].radius) * 1609.34;
                //             break;
                //     }
                // } else {
                //      vm.map.zoom = 5;
                //     }
                ///Geofence On-Entry
                if (vm.speedlimit[ind].circleFenceType == 2) {
                    if (vm.speedlimit[ind].radius == 0) {
                        vm.map.zoom = 13;
                        //scope.mobileMap.zoom = 13;
                    } else if (vm.speedlimit[ind].radius <= 150) {
                        vm.map.zoom = 17;
                        //scope.mobileMap.zoom = 17;
                    } else if (vm.speedlimit[ind].radius > 150 && vm.speedlimit[ind].radius <= 400) {
                        vm.map.zoom = 16;
                        //scope.mobileMap.zoom = 15;
                    } else if (vm.speedlimit[ind].radius > 400 && vm.speedlimit[ind].radius <= 1868) {
                        vm.map.zoom = 14;
                        //scope.mobileMap.zoom = 13;
                    } else if (vm.speedlimit[ind].radius > 1868 && vm.speedlimit[ind].radius <= 3758) {
                        vm.map.zoom = 13;
                        //scope.mobileMap.zoom = 12;
                    } else if (vm.speedlimit[ind].radius > 3758 && vm.speedlimit[ind].radius <= 7728) {
                        vm.map.zoom = 12;
                        // scope.mobileMap.zoom = 11;
                    } else if (vm.speedlimit[ind].radius > 7728 && vm.speedlimit[ind].radius <= 29169) {
                        vm.map.zoom = 10;
                        //scope.mobileMap.zoom = 9;
                    } else if (vm.speedlimit[ind].radius > 29169 && vm.speedlimit[ind].radius <= 121479) {
                        vm.map.zoom = 8;
                        //scope.mobileMap.zoom = 7;
                    } else if (vm.speedlimit[ind].radius > 121479 && vm.speedlimit[ind].radius <= 485007) {
                        vm.map.zoom = 6;
                        //scope.mobileMap.zoom = 5;
                    } else if (vm.speedlimit[ind].radius > 485007 && vm.speedlimit[ind].radius <= 1881318) {
                        vm.map.zoom = 5;
                        //scope.mobileMap.zoom = 3;
                    } else {
                        vm.map.zoom = 3;
                        //scope.mobileMap.zoom = 2;                
                    }
                    vm.map.center = {
                        latitude: vm.speedlimit[ind].circleCenterLat,
                        longitude: vm.speedlimit[ind].circleCenterLon
                    };
                } //Geofence On-Entry End//
                //on exit
                if (vm.speedlimit[ind].circleFenceType == 1) {
                    if (vm.speedlimit[ind].radius == 0) {
                        vm.map.zoom = 13;
                        //scope.mobileMap.zoom = 13;
                    } else if (vm.speedlimit[ind].radius <= 150) {
                        vm.map.zoom = 17;
                        //scope.mobileMap.zoom = 17;
                    } else if (vm.speedlimit[ind].radius > 150 && vm.speedlimit[ind].radius <= 400) {
                        vm.map.zoom = 16;
                        //scope.mobileMap.zoom = 15;
                    } else if (vm.speedlimit[ind].radius > 400 && vm.speedlimit[ind].radius <= 1868) {
                        vm.map.zoom = 14;
                        //scope.mobileMap.zoom = 13;
                    } else if (vm.speedlimit[ind].radius > 1868 && vm.speedlimit[ind].radius <= 3758) {
                        vm.map.zoom = 13;
                        //scope.mobileMap.zoom = 12;
                    } else if (vm.speedlimit[ind].radius > 3758 && vm.speedlimit[ind].radius <= 7728) {
                        vm.map.zoom = 11;
                        // scope.mobileMap.zoom = 11;
                    } else if (vm.speedlimit[ind].radius > 7728 && vm.speedlimit[ind].radius <= 29169) {
                        vm.map.zoom = 10;
                        //scope.mobileMap.zoom = 9;
                    } else if (vm.speedlimit[ind].radius > 29169 && vm.speedlimit[ind].radius <= 121479) {
                        vm.map.zoom = 8;
                        //scope.mobileMap.zoom = 7;
                    } else if (vm.speedlimit[ind].radius > 121479 && vm.speedlimit[ind].radius <= 485007) {
                        vm.map.zoom = 6;
                        //scope.mobileMap.zoom = 5;
                    } else if (vm.speedlimit[ind].radius > 485007 && vm.speedlimit[ind].radius <= 1881318) {
                        vm.map.zoom = 5;
                        //scope.mobileMap.zoom = 3;
                    } else {
                        vm.map.zoom = 3;
                        //scope.mobileMap.zoom = 2;                
                    }
                    vm.map.center = {
                        latitude: vm.speedlimit[ind].circleCenterLat,
                        longitude: vm.speedlimit[ind].circleCenterLon
                    };
                } /////on exit End
            } else {
                vm.map.zoom = 11;
                vm.map.center = {
                    latitude: vm.speedlimit[ind].latitude.toFixed(4),
                    longitude: (vm.speedlimit[ind].longitude.toFixed(4))
                }; //default map center if there is no geofence boundries
            }  //If Kh Vehicle, then populate geofence entry and exit boundries 
              
            vm.map.window.options = MapService.createInfoBoxOptionsMCZ(0);
            initMaps();
        });
        angular.forEach(vm.speedlimit, function(val, key) {
            if (ind == key) {
                val.show = pos;
            } else {
                val.show = false;
            }
        });
        vm.toggleObject.item = ind;
        angular.forEach(vm.speedlimit, function(val, key) {
            if (ind == key) {
                vm.toggleObject["selected" + key] = !vm.toggleObject["selected" + key];
                if (!vm.toggleObject["selected" + key]) {
                    vm.toggleObject.item = -1;
                }
            } else {
                vm.toggleObject["selected" + key] = false;
            }
        });
    };
    var newData = [];
    var selecteddelete = "";
    var deleteData = [];
    vm.openConfirmDelete = function(resp) {
        /*selecteddelete=resp;
        if(vm.selectDelete.length==0&&resp=='selected'){
        return false;
        }*/
        var newdata = [];
        deleteData = [];
        vm.deleteStatus = resp;
        if (vm.deleteStatus === "selected") {
            deleteData = vm.selectDelete;
        } else if (vm.deleteStatus === "all") {
            deleteData = vm.speedlimit;
        }
        vm.selectDeleteItems = deleteData;
        if (deleteData.length > 0) {
            $scope.modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                scope: $scope,
                size: 'sm'
            });
        }
    };
    vm.hide_loadmore = true;
    vm.filtering = [];

    function loading(index) {
        if (vm.filtered) {
            angular.forEach(vm.filtered, function(val, key) {
                if (key > index) {
                    vm.filtering[key] = false;
                } else {
                    vm.filtering[key] = true;
                }
            });
        } else {
            var mock = [1, 2, 3, 4, 5];
            angular.forEach(mock, function(val, key) {
                if (key > index) {
                    vm.filtering[key] = false;
                } else {
                    vm.filtering[key] = true;
                }
            });
        }
    }
    loading(5);
    $scope.$watch(angular.bind(vm, function() {
        return vm.sortOptionValue; // `this` IS the `this` above!!
    }), function(newVal, oldVal) {
        vm.pageload = 5;
        loading(5);
    }, true);
    vm.pageload = 5;
    vm.loadmore = function() {
        vm.pageload = vm.pageload + 5;
        angular.forEach(vm.filtered, function(val, key) {
            if (key > vm.pageload) {
                vm.filtering[key] = false;
            } else {
                vm.filtering[key] = true;
            }
        });
    };
    vm.confirm = function() {
        var new_data = [];
        angular.forEach(vm.firstresult, function(value, key) {
            angular.forEach(deleteData, function(v, k) {
                if (value.headerTid == v.headerTid) {
                    delete value['selected'];
                    delete value['time'];
                    delete value['shift'];
                    delete value['first'];
                    delete value['end'];
                    delete value['$$hashKey'];
                    delete value['show'];
                    delete value['checked'];
                    new_data.push(value);
                }
            });
        });
        geofenceService.deleteGeofenceAlerts(new_data).then(function(resp) {
            if (message == 'kh') {
                endpoint = geofenceService.getTempInfo();
            } else {
                endpoint = geofenceService.getTempInfoCp();
            }
            endpoint.then(function(data) {
                vm.speedlimit = data.serviceResponse;
                vm.selectsome = true;
                deleteData = [];
            });
        });
        if (selecteddelete == 'all') {
            vm.speedlimit = [];
            $scope.modalInstance.dismiss();
        } else {
            $scope.modalInstance.dismiss();
            newData = [];
            var count = 0;
            angular.forEach(vm.speedlimit, function(val, key) {
                if (vm.selectedItems[key] == true) {
                    count++;
                } else {
                    newData.push(vm.speedlimit[key]);
                }
            });
            $scope.total = count;
            vm.speedlimit = newData;
            angular.forEach(vm.selectedItems, function(val, key) {
                vm.selectedItems[key] = false;
            });
        }
    };
    vm.cancel = function() {
        $scope.modalInstance.dismiss();
    };

    function getInfoBoxes(index) {
        var poi = vm.poiList[index];
        var gWin = poi.mobileInfoBoxOptions.control.getGWindows();
        var _infoBox, _mInfoBox, i;
        // get infobox for desktop and mobile views
        for (i = 0; i < gWin.length; i++) {
            if (gWin[i].boxClass_.indexOf('m-ib' + index) !== -1) {
                _mInfoBox = gWin[i];
                if (_infoBox) {
                    break;
                }
            }
            if (gWin[i].boxClass_.indexOf('ib' + index) !== -1) {
                _infoBox = gWin[i];
                if (_mInfoBox) {
                    break;
                }
            }
        }
        return {
            infoBox: _infoBox,
            mInfoBox: _mInfoBox
        };
    }

    function initMaps() {
            // populate map options and pre-opened infoboxes for mobile maps
            var i, markers = [];
            for (i = 0; i < vm.poiList.length; i++) {
                var poi = vm.poiList[i];
                // populate markers for desktop map
                var marker = MapService.createMarker(i, poi.lae, poi.loc, poi.zoom, poi.label);
                marker["image"] = poi.image;
                markers.push(marker);
                // process map options for mobile
                vm.poiList[i].map = MapService.createMapOptions();
                vm.poiList[i].mobileInfoBoxOptions =
                    MapService.createInfoBoxOptionsMCZ(i, vm.poiList[i].lae, vm.poiList[i].loc, true);
                vm.poiList[i].infoBoxOptions =
                    MapService.createInfoBoxOptionsMCZ(i, vm.poiList[i].lae, vm.poiList[i].loc);
                vm.poiList[i].mobileMapId = 'm' + i;
            }
            vm.map.markers = markers;
        }
        //loadData();
    vm.sortReverse = true;
    vm.selectedItems = [];
    vm.selectDelete = [];
    var i = 0;
    vm.getSelect = function(index, item) {
        item.checked = !item.checked;
        var selectedItems = getSelectedAlertItems();
        vm.selectDelete = selectedItems;
        if (selectedItems.length > 0) {
            vm.selectsome = false;
        } else if (selectedItems.length <= 0) {
            vm.selectsome = true;
        }
        vm.selectAll = vm.selectsome;
    };

    function getSelectedAlertItems() {
        var _seletedAlerts = vm.speedlimit.filter(function(item) {
            return item.checked;
        });
        return _seletedAlerts;
    }
    var endpoint;
    vm.firstresult = [];
    if (message == 'kh') {
        endpoint = geofenceService.getTempInfo();
    } else {
        endpoint = geofenceService.getTempInfoCp();
    }
    endpoint.then(function(data) {
        if (data.hasOwnProperty('errorMessage')) {
            vm.errorfound = true;
            vm.speedlimit = [];
        } else {
            vm.errorfound = false;
            vm.speedlimit = data.serviceResponse;
        }
        vm.firstresult = data.serviceResponse;
        //vm.speedlimit=data.serviceResponse;
        angular.forEach(vm.speedlimit, function(val, k) {
            vm.toggleObject["selected" + k] = false;
            vm.speedlimit[k].show = false;
            if (vm.speedlimit[k].circleFenceType == '0') {
                vm.speedlimit[k].circleCenterLat = Number(vm.speedlimit[k].circleCenterLat);
                vm.speedlimit[k].circleCenterLon = Number(vm.speedlimit[k].circleCenterLon);
            }
            vm.selectedItems[k] = false;
            var date = new Date(val.driveStartTime);
            val.driveStartTime = date;
            val.selected = false;
            var hours = date.getHours();
            // minutes part from the timestamp
            var minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            // seconds part from the timestamp
            var seconds = date.getSeconds();
            val.time = hours % 12 + ":" + minutes;
            if (hours > 12) {
                val.shift = "PM";
            } else {
                val.shift = "AM";
            }
            val.first = getTimeFormate(val.startTime);
            val.end = getTimeFormate(val.endTime);
        });

        function getTimeFormate(min) {
            var final;
            var hours = Math.floor(min / 60);
            var minutes = min % 60;
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (hours < 12) {
                final = hours + ":" + minutes + " AM";
            } else if (hours > 12 || hours < 24) {
                final = (hours - 24) + ":" + minutes + " PM";
            } else {
                final = (hours - 24) + ":" + minutes + " PM";
            }
            return final;
        }
        StatusBarService.clearStatus();
    });
    vm.sortOptionValue = 'LAST 30 DAYS';
    vm.sortPoi = function(option) {
        switch (option) {
            case 0:
                {
                    vm.sortOption = 'poiSeq';
                    vm.sortReverse = true;
                    vm.sortOptionValue = 'LAST 30 DAYS';
                    break;
                }
            case 1:
                {
                    vm.sortOption = 'endTime';
                    vm.sortReverse = false;
                    vm.sortOptionValue = 'LAST 7 DAYS';
                    break;
                }
            case 2:
                {
                    vm.sortOption = 'cityNm';
                    vm.sortReverse = false;
                    vm.sortOptionValue = 'LAST 5 DAYS';
                    break;
                }
            case 3:
                {
                    vm.sortOption = 'stNm';
                    vm.sortReverse = false;
                    vm.sortOptionValue = 'LAST 3 DAYS';
                    break;
                }
            case 4:
                {
                    vm.sortOption = 'poiNm';
                    vm.sortReverse = false;
                    vm.sortOptionValue = 'TODAY';
                    break;
                }
        }
    };
    vm.toggleManageMenu = function() {
        vm.showManageMenu = !vm.showManageMenu;
        vm.Manage = true;
        vm.selectsome = true;
        angular.forEach(vm.speedlimit, function(val, key) {
            if (val.checked) {
                val.checked = false;
            }
        });
    };
    var i = 0;
    vm.radionBtn = false;
    vm.enableDeleteButton = function() {
        $scope.$watch('vm.poiList', function(n, o) {
            trues = $filter('filter')(n, {
                poiSelected: true
            });
            $scope.selectedPois = trues;
            $scope.resolve = trues.length;
        }, true);
    };
};