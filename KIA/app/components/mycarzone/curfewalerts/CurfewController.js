'use strict';

module.exports = /*@ngInject*/ function($timeout, $rootScope, $state, $modal, $scope, $location,
    CurfewInfoService, showMapService, uiGmapIsReady, MapService, StatusBarService, HttpService, SpringUtilsService, $q, $filter,$cookies) {
    var vm = this,
        dtcDone = false,
        vehiclesDone = false;
    vm.toggleObject = {
        item: -1
    };
    vm.limit = 4;
    vm.mapNotAvailable = false;
    var poiSeqList;
    var _gMap;
    var _map;
    var _iscroll;
    var _isTilesLoaded;
    vm.Manage = true;
    //vm.hideme=true;
    vm.totalCurfewAlerts;
    StatusBarService.showLoadingStatus();

    vm.Manageit = function() {

        vm.select = true;
        vm.showManageMenu = true;
        angular.forEach(vm.curfewAlert, function(val, key) {
            vm.curfewAlert[key].show = false;
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
            }
        }
    };
   /* angular.element('.infobox-dark').css({'left':'382.252px'});
    $scope.$watch('vm.map.zoom',function(){

console.log('55::',angular.element(angular.element('.infobox-dark')).offset());

var x = angular.element(angular.element('.infobox-dark')).offset();
//if(x){angular.element('.infobox-dark').css({'left':(x.left-316)});}
if(x){angular.element('.infobox-dark').css({'left':(x.left-316)});}

    });*/
    vm.selectCurrentPoi = function(id, status, model, model1) {
        vm.map.window.getit = true;
        vm.map.window.showId = id;
        vm.map.window.model = model;
        vm.map.window.model.id = id;
        model.info = true;
        if (id == 0) {
            vm.template = 'views/components/mycarzone/curfewalerts/windowtemp.html';

        } else if (id == 1) {
            vm.template = 'views/components/mycarzone/curfewalerts/windowtemp1.html';

        } else {
            vm.template = 'views/components/mycarzone/curfewalerts/windowtemp2.html';
        }
        vm.map.window.show = true;
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

    };
    vm.getIcon = function(index) {

        if (index == 0) {
            return "images/MyCarZone/marker_green_driving_start.png";
        } else if (index == 1) {
            return "images/MyCarZone/marker_blue_driving_end.png";
        } else {
            return "images/MyCarZone/marker_red_alert.png";
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
        vm.poiList = [{
            lae: vm.curfewAlert[ind].strtLat,
            loc: vm.curfewAlert[ind].strtLong
        }, {
            lae: vm.curfewAlert[ind].stpLat,
            loc: vm.curfewAlert[ind].stpLong
        }, {
            lae: vm.curfewAlert[ind].latitude,
            loc: vm.curfewAlert[ind].longitude
        }];
        _gMap = undefined;
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
                    }else{
                        vm.map.options.panControl = false;
                        vm.map.options.zoomControl = false;                     
                    }

                    }); 
                vm.map.zoom = 14;
                vm.map.center = {
                    latitude: vm.curfewAlert[ind].latitude.toFixed(4),
                    longitude: (vm.curfewAlert[ind].longitude.toFixed(4))
                };
                vm.map.window.options = MapService.createInfoBoxOptionsMCZ(0);

                initMaps();
            });
        }
        vm.toggleObject.item = ind;
        angular.forEach(vm.curfewAlert, function(val, key) {

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

    vm.sortReverse = true;
    vm.noGeoFence = {};   
    vm.noGeoFence.ssDvcType = "AVN";
    CurfewInfoService.getCurfewInfo().then(function(data) {

        //checkes if navigations is available on the vehicle
        vm.noGeoFence=data;
        if(vm.noGeoFence.ssDvcType == "AVN"){
            $rootScope.isAVN = true;
         }
        else{
            $rootScope.isAVN = false;
         }

        if (data.hasOwnProperty('errorMessage')) {

            vm.errorfound = true;
            vm.curfewAlert = [];
        } else {
            vm.errorfound = false;

            vm.curfewAlert = data.serviceResponse;
            vm.totalCurfewAlerts = vm.curfewAlert.length;
        }

        angular.forEach(vm.curfewAlert, function(val, k) {
            var date = new Date(val.alertDateTime);
            val.alertDateTime = date;
            vm.toggleObject["selected" + k] = false;
            val.selected = false;
            var hours = date.getHours();

            // minutes part from the timestamp
            var minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            // seconds part from the timestamp
            if (hours === 12) {
                val.time = 12 + ":" + minutes;
            } else {
                val.time = hours % 12 + ":" + minutes;
            }

            if (hours > 11) {

                val.shift = " PM"
            } else {
                val.shift = " AM"
            }


            val.first = getFormattedTime(val.startTime);
            val.end = getFormattedTime(val.endTime);
        });
        function getFormattedTime(fourDigitTime) {
            $scope.parseInt = parseInt;
            var fourDigitTime;
            var hours24 = parseInt(fourDigitTime.toString().slice(0, -2));
            var hours = ((hours24 + 11) % 12) + 1;
            var amPm = hours24 > 11 ? ' pm' : ' am';
            var minutes = fourDigitTime.toString().slice(-2);

            return hours + ':' + minutes + amPm;
        };
        vm.sortOptionValue = 'LAST 30 DAYS';
        //vm.sortOptionCount='0';
       vm.sortPoi = function(option) {
            switch (option) {
                case 0:
                    {
                        vm.sortOption = 'poiSeq';
                        vm.sortReverse = true;
                        vm.sortOptionValue = 'LAST 30 DAYS';
                        //vm.sortOptionCount='0';
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
            angular.forEach(vm.curfewAlert, function(val, key) {
                vm.toggleObject["selected" + key] = false;
                vm.curfewAlert[key].show = false;
                if (val.checked) {
                    val.checked = false;
                }

            });
            vm.radionBtn = false;
            vm.selectAll = false;
            vm.toggleObject.item = -1;
            vm.select = true;

        };
        var i = 0;
        vm.radionBtn = false;
        vm.selectBtn = function (event, item) {
            item.checked = !item.checked;
            var selectedItems = getSelectedAlertItems();
            if(selectedItems.length <= 0) {
                vm.radionBtn = false;
                vm.selectAll = false;
            }else if (selectedItems.length === vm.curfewAlert.length) {
                vm.selectAll = true;
                vm.radionBtn = true;
             }else {
                vm.selectAll = false;
                vm.radionBtn = true;
             }
        };


        function getSelectedAlertItems () {
            var _seletedAlerts = vm.curfewAlert.filter(function (item) {
                return item.checked;
            });
            return _seletedAlerts;
        }


        vm.enableDeleteButton = function() {
            $scope.$watch('vm.poiList', function(n, o) {
                $filter('filter')(n,function(){
                    poiSelected: true
                });
                $scope.selectedPois = trues;
                $scope.resolve = trues.length;
            }, true);
        };
        vm.displayModal = false;
        var deleteData = [];

        vm.openConfirmDelete = function(status) {

            var newdata = [];
            deleteData = [];
            vm.deleteStatus = status;
            if (vm.deleteStatus === "selected") {
                angular.forEach(vm.curfewAlert, function(v, k) {

                    if (v.checked == false) {
                        newdata.push(v);
                        if (k == vm.curfewAlert.length - 1) {
                            //vm.curfewAlert = newdata;
                        }
                    } else if (v.checked == true) {
                        deleteData.push(v);
                    }
                });
            } else if (vm.deleteStatus === "deleteAll") {
                deleteData = vm.curfewAlert;
            }
            vm.deleteItemLength = deleteData.length;
            if (deleteData.length > 0) {
                vm.displayModal = true;
            }
        }

        vm.checkSelected = function() {
            if (vm.poiList) {
                for (var i = 0; i < vm.poiList.length; i++) {
                    if (vm.poiList[i].poiSelected) {
                        return true;
                    }
                }
                return false;
            }
        };
        vm.confirm = function() {
            vm.displayModal = false;

            var payload;
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            var deferred = $q.defer();
            angular.forEach(deleteData, function(val, key) {
                delete val.selected;
                delete val.time;
                delete val.shift;
                delete val.first;
                delete val.end;
                delete val.$$hashKey;
                delete val.checked;
            });
        var postData = [],postData1;
        angular.forEach(deleteData,function(val,key){
            
              val.alertDateTime = new Date(val.alertDateTime).getTime();
              delete(val.show);
               postData1 = {
                    violType        : "C",
                    violTrscIdList  : val.headerTid,
                    violTrscSeqList : val.trscSeq,
                    violSeqList     : val.violSeq,
                    deleteViol      : vm.deleteStatus

                };
                postData.push(postData1);
        });

            payload = SpringUtilsService.encodeParams({
                'curfewAlertDetailPayLoad': JSON.stringify(deleteData)
            });
            var genType = $cookies['gen'];

            // The API for deleting the curfewAlerts is ccw/cp/deleteTripAlertsDetail.do - 
            // you may have to preserve the logs in Browser inspect to notice it in the Network calls.
             if(genType && (genType == 'gen1plus' || genType == 'gen1')){
                 HttpService.post('/ccw/cp/deleteTripAlertsDetail.do', $.param(postData[0]), headers).success(function(data, status, headers) {
                    deferred.resolve(data);
                     $state.reload(); 
                 });
              }
             if(genType && genType == 'kh'){
                 HttpService.post('/ccw/kh/curfewAlertDetails.do', payload, headers).success(function(data, status, headers) {
                    deferred.resolve(data);
                    $state.reload();                
                    });
              }
               
            /*HttpService.post('/ccw/cp/deleteTripAlertsDetail.do', payload, headers).success(function(data, status, headers) {
                deferred.resolve(data);

            });*/

           
            return deferred.promise;
        };
        vm.cancelConfirm = function() {
            vm.displayModal = false;
            deleteData = [];
        };
        $scope.datalists = data // json data
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

        loading(4);

        $scope.$watch(angular.bind(vm, function() {
            return vm.sortOptionValue; // `this` IS the `this` above!!
        }), function(newVal, oldVal) {
            vm.pageload = 5;
            loading(4);
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
          StatusBarService.clearStatus();
    });
};

