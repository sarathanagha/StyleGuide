'use strict';

module.exports = /*@ngInject*/ function($timeout, $state, $modal, $scope,
    speedViewService, PoiService, message, uiGmapIsReady, MapService, StatusBarService) {
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
    vm.toggleObject = {
        item: -1
    };
    // vm.Manageit=function(){

    //            vm.mapshow=true;
    StatusBarService.showLoadingStatus();

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
                //vm.map.window.show = true;                                                                                                              
            }
        }
    };


    vm.selectCurrentPoi = function(id, status, model, model1, isGen1Plus) {
        if (model) {
            vm.map.window.showid = id;
            vm.map.window.getit = true;
            //vm.map.window.show=true;
            vm.map.window.model = model;
            vm.map.window.model.id = id;

            if (id == 0) {
                vm.template = 'views/components/mycarzone/speedalerts/windowtemp2.html';
            } else if (id == 1) {
                vm.template = 'views/components/mycarzone/speedalerts/windowtemp1.html';
            } else {
                vm.template = 'views/components/mycarzone/speedalerts/windowtemp.html';
            }

            $timeout(function() {
                vm.map.window.model = vm.map.window.model;
            }, 0);

            var lat = model.latitude;
            var lng = model.longitude;
            var latlng = new google.maps.LatLng(lat, lng);
            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'latLng': latlng
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    vm.map.window.model.address = results[0].formatted_address;
                    $timeout(function() {
                        vm.map.window.model = vm.map.window.model;
                    }, 0);
                }
            });
        }
    };

    vm.getIcon = function(index, isGen1Plus) {
        if (isGen1Plus) {
            if (index == 0) {
                return "images/MyCarZone/marker_red_max_speed.png";
            } else if (index == 1) {
                return "images/MyCarZone/marker_blue_alert_end.png";
            } else {
                return "images/MyCarZone/marker_green_alert_start.png";
            }
        } else {
            if (index == 0) {
                return "images/MyCarZone/marker_green_alert_start.png";
            } else if (index == 1) {
                return "images/MyCarZone/marker_blue_alert_end.png";
            } else {
                return "images/MyCarZone/marker_red_max_speed.png";
            }
        }


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
    vm.showMap = function(ind, pos, item) {
        /*           vm.poiList=[
                        {lae:vm.speedlimit[ind].latitude,loc:vm.speedlimit[ind].longitude,image:'images/MyCarZone/marker_red_alert.png'},
                        {lae:vm.speedlimit[ind].stpLat,loc:vm.speedlimit[ind].stpLong,image:'images/MyCarZone/marker_blue_alert_end.png'},
                        {lae:vm.speedlimit[ind].strtLat,loc:vm.speedlimit[ind].strtLong,image:'images/MyCarZone/marker_green_alert_start.png'}
                        ];*/
        //vm.map.window.closeClick(); 
        console.log('pos::', pos);
        /*           if(vm.itemIndex != ind && pos){
                                        vm.itemIndex = ind;
                        }else{
                                        vm.itemIndex = -1;
                        }*/


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
        //console.log('vm.poiList::',vm.poiList);
        if (_gMap) {

            initMaps();
        } else {

            MapService.getGMap().then(function(maps) {
                _gMap = maps; // google map library instance
                //            vm.map.window.showid= -1;                                                                     
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
                vm.map.zoom = 14;
                if (vm.speedlimit[ind].latitude && vm.speedlimit[ind].strtLat && vm.speedlimit[ind].stpLat) {
                    vm.avglat = (vm.speedlimit[ind].latitude + vm.speedlimit[ind].strtLat + vm.speedlimit[ind].stpLat) / 3;
                    vm.avglan = (vm.speedlimit[ind].longitude + vm.speedlimit[ind].strtLong + vm.speedlimit[ind].stpLong) / 3;
                    vm.map.center = {
                        latitude: vm.avglat,
                        longitude: vm.avglan
                    };
                } else {
                    vm.map.center = {
                        latitude: vm.speedlimit[ind].latitude.toFixed(4),
                        longitude: (vm.speedlimit[ind].longitude.toFixed(4))
                    };
                }
                vm.map.window.options = MapService.createInfoBoxOptionsMCZ(0);
                vm.map.window.show = [];
                vm.map.window.show = [false, false, false];
                initMaps();
            });
        }

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
        console.log('247::', vm.selectDelete);
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
        //console.log("im in",vm.filtered);
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
        //console.log("In filter watch",newVal, oldVal);
        vm.pageload = 5;
        loading(5);
        // now we will pickup changes to newVal and oldVal
    }, true);
    vm.pageload = 5;
    vm.loadmore = function() {
        vm.pageload = vm.pageload + 5;
        //console.log(vm.filtered,"filtered");
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
        speedViewService.deleteSpeedAlerts(new_data).then(function(resp) {

            if (message == 'kh') {
                endpoint = speedViewService.getTempInfo();
            } else {
                endpoint = speedViewService.getTempInfoCp();
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

    vm.getSelect = function(index, item) {
        item.checked = !item.checked;
        var selectedItems = getSelectedAlertItems();
        vm.selectDelete = selectedItems;
        if (selectedItems.length > 0) {
            vm.selectsome = false;
        }
        if (selectedItems.length <= 0) {
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
    vm.noGeoFence = {};
    
    vm.noGeoFence.ssDvcType = "AVN"

    vm.firstresult = [];
    if (message == 'kh') {
        endpoint = speedViewService.getTempInfo();
    } else {
        endpoint = speedViewService.getTempInfoCp();
    }
    endpoint.then(function(data) {

        if (data.hasOwnProperty('errorMessage')) {
            vm.errorfound = true;
        } else {
            vm.errorfound = false;
        }
        vm.firstresult = data.serviceResponse;
        vm.speedlimit = data.serviceResponse;


        //checkes if navigations is available on the vehicle
        vm.noGeoFence = data;
        console.log(vm.noGeoFence.ssDvcType, 'noGeoFences');
        //console.log(vm.noGeoFence[0].ssDvcType,'noGeoFence');
        angular.forEach(vm.speedlimit, function(val, k) {
            vm.toggleObject["selected" + k] = false;
            vm.speedlimit[k].show = false;
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