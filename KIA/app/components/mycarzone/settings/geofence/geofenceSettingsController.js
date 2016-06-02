//'use strict';
module.exports = /*@ngInject*/ function($timeout, $scope, $http, $state, speedSettingsService, GeofenceSettingsService, INTERVAL_LIST, StatusBarService, $modal, $rootScope) {
    var vm = this;
    $scope.successCall = false;
    $scope.unsuccessCall = false;
    $scope.showStatusMessage = false;
    $scope.statusMessage = '';
    vm.disableButton = false;
    vm.intervals = INTERVAL_LIST;
    vm.showOnEntry = true;
    vm.geofenceList = [];
    vm.currentIndex = -1;
    vm.loading = false;
    vm.flag = 0;
    vm.hasError = false;
    vm.getData = null;
    vm.deleteSelected = vm.geofenceList.length;
    $scope.$watch(function() {
        return vm.isOn;
        countPending();
    }, function(value) {
        if (vm.flag >= 2) {
            vm.disableit = false;
        }
        vm.flag = vm.flag + 1;
    }, true);
    vm.loadit = true;
    var intevalChange = 0;

    $scope.$watch(function() {
        return vm.currentInterval;
        countPending();
    }, function(value) {

        if (intevalChange >= 2) {
            vm.disableit = false;

        }
        intevalChange = intevalChange + 1;

    }, true);

    vm.selectIndex = function(index) {
        vm.currentIndex = vm.currentIndex === index ? -1 : index;
    };

    vm.toggleFenceType = function(type) {
        vm.showOnEntry = type === 'entry';
    };

    vm.geofenceFilter = function(item) {
        if (Object.keys(item).length == 0) {
            return true;
        }
        return item.action !== 'delete' &&
            (item.fenceType === '1' && !vm.showOnEntry || item.fenceType === '2' && vm.showOnEntry);
    };
    var loadOn;
    vm.getInterval = function() {
        if (vm.geofenceList[0].geoFenceTime == vm.intervals[vm.currentInterval].value) {
            return false;
        }
        return true;
    }

    function init() {

        $rootScope.$watch('inprogress', function(val) {
            if (!vm.submitClicked) {
                if (val == true) {
                    StatusBarService.showLoadingStatus();
                    vm.loading = true;
                    vm.hasError = false;
                }

            }

        });
        if (!vm.submitClicked) {
            speedSettingsService.getVehicles().then(function(vehicle) {
                $scope.vehicleVin = vehicle.selectedVin;
            });
        };
        GeofenceSettingsService.getGeofenceSettings().then(function(response) {
            if(response.geofenceList.length!= 0){
                var pending = response.TmuStatus === 'P' || response.geofenceList[0].status == 'S';
                var hasErrors = response.TmuStatus == 'I' || response.LatestConfig == false;
            }
            if (pending) {
                StatusBarService.showLoadingStatus();
                vm.loading = true;
                $timeout(function() {
                    init();
                }, 30000)
            }

            else if (hasErrors) {
                vm.error = true;
                vm.loading = false;
                StatusBarService.clearStatus();
                if (vm.submitClicked) {
                    vm.submitClicked = undefined;
                    $timeout(function() {
                        $state.reload();
                    }, 200);
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                vm.disableButton = false;
            } else {
                if (vm.submitClicked) {
                    StatusBarService.showSuccessStatus();
                    vm.loading = false;
                    $scope.successCall = true;
                    vm.disableButton = true;
                    $timeout(function() {
                        $state.reload();
                    }, 4000);
                    vm.submitClicked = undefined;
                }
            }
            vm.getData = response;
            vm.geofenceList = response.geofenceList;
            if (vm.geofenceList.length == 1) {
                vm.deleteIt = false;
            } else {
                vm.deleteIt = true;
            }
            vm.Backup = angular.copy(vm.geofenceList);
            vm.deleteSelected = vm.geofenceList.length;
            vm.vehicleSelected = $scope.vehicleVin;
            vm.isOn = response.Active == 'A' ? true : false;
            vm.Intervalshow = response.Active == 'A' ? true : false;
            if (vm.geofenceList.length == 0) {
                vm.currentInterval = 0;
            } else {
                angular.forEach(vm.intervals, function(v, k) {
                    if (v.value == vm.geofenceList[0].geoFenceTime) {
                        vm.currentInterval = k;
                    }
                });
            }

            if (vm.geofenceList.length == 0) {
                vm.oldObj = angular.copy([vm.isOn, vm.currentInterval, vm.geofenceList.length]);
            } else {
                vm.oldObj = angular.copy([vm.isOn, vm.geofenceList[0].geoFenceTime, vm.geofenceList.length]);
            }

            loadOn = vm.isOn;
            vm.loadOn = loadOn;
            vm.deleteswitch = [];
            vm.entry = 0;
            vm.out = 0;
            angular.forEach(vm.geofenceList, function(val, key) {
                vm.deleteswitch[key] = response.Active == 'A' ? true : false;
                if (val.active == 'D') {
                    vm.deleteswitch[key] = false;
                } else {
                    vm.deleteswitch[key] = true;
                }

                if (val.fenceType == '2') {
                    vm.entry = vm.entry + 1;
                } else {
                    vm.out = vm.out + 1;
                }
                if (key == vm.geofenceList.length - 1) {
                    vm.backdeleteSwitch = angular.copy(vm.deleteswitch);
                }
            });
            vm.deletedBckp = false;
            vm.disableit = true;
            $scope.$watchGroup(['vm.isOn', 'vm.geofenceList', 'vm.currentInterval'], function(newValues, oldValues, scope) {
                vm.alerton = newValues[0] == vm.oldObj[0] ? false : true;
                vm.alerton1 = newValues[0] == vm.oldObj[0] ? false : true;
                vm.added = newValues[1].length > vm.oldObj[2] ? true : false;
                vm.deleted = newValues[1].length < vm.oldObj[2] ? true : false;
                if (newValues[0] == true && vm.deletedBckp == true) {
                    vm.deleted = true;
                }
                if (vm.geofenceList.length != 0)
                    vm.intervalchange = vm.oldObj[1] == vm.intervals[newValues[2]].value ? false : true;
                countPending();
            }, true);
        });
    }
    init();
    vm.viewPending = function() {
        if (vm.alerton || vm.added || vm.deleted || vm.intervalchange || vm.nameChange) {
            vm.viewPendingClose = $modal.open({
                templateUrl: 'viewpending.html',
                scope: $scope
            });
        }
    }
    vm.updatechange = function(resp) {
        if (resp.hasOwnProperty('added') == false) {
            vm.disableit = false;
            vm.nameChange = true;
            countPending();
        }
    }
    $scope.$on("change", function(evnt, args) {
        vm.nameChange = true;
        vm.disableit = false;
        countPending();
        if (!$scope.$$phase)
            $scope.$apply()
    });
    $scope.$on("unchange", function(evnt, args) {
        vm.nameChange = false;
        if (!$scope.$$phase)
            $scope.$apply()
    });
    vm.addgeofence = function() {

        var new_entry = GeofenceSettingsService.GeofenceEntity();
        new_entry.vin = vm.vehicleSelected;
        new_entry.action = 'insert';
        new_entry.added = true;
        new_entry.active = vm.Intervalshow == true ? 'A' : 'I';
        if (vm.geofenceList != 0)
            new_entry.csmrId = vm.geofenceList[0].csmrId;
        new_entry.status = "C";

        if (vm.showOnEntry == true) {

            new_entry.geoFenceName = 'GEO FENCE ENTRY';
            new_entry.circleFenceType = '2';
            new_entry.rectFenceType = '0';
            vm.entry = vm.entry + 1;
        } else {
            new_entry.geoFenceName = 'GEO FENCE EXIT';
            new_entry.circleFenceType = '1';
            vm.out = vm.out + 1;
        }

        var newData = GeofenceSettingsService.processGeofenceSettings({
            GeoFenceAlertList: [new_entry]
        });

        navigator.geolocation.getCurrentPosition(function success(position) {

            new_entry.location = position.coords;
            newData.then(function(resp) {

                resp.geofenceList[0].circle.center = new_entry.location;
                resp.geofenceList[0].circle.radius = 5000;
                resp.geofenceList[0].hidenadius = true;
                resp.geofenceList[0].radius = 5000;
                resp.geofenceList[0].circleCenterLat = resp.geofenceList[0].circle.center.latitude;
                resp.geofenceList[0].circleCenterLon = resp.geofenceList[0].circle.center.longitude;
                resp.geofenceList[0].circle.added = true;
                vm.geofenceList.push(resp.geofenceList[0]);
                vm.selectIndex(vm.geofenceList.length - 1);
                vm.deleteswitch[vm.geofenceList.length - 1] = true;
                var deleteFlag = 0;
                angular.forEach(vm.geofenceList, function(val, key) {
                    if (val.action != 'delete') {
                        deleteFlag = deleteFlag + 1;
                    }
                });
                if (deleteFlag > 1) {
                    vm.deleteIt = true;
                } else {
                    vm.deleteIt = false;
                }

            });
        }, function(error) {

            newData.then(function(resp) {

                resp.geofenceList[0].circle.center = {
                    latitude: 39.87,
                    longitude: -98.60
                };
                resp.geofenceList[0].circle.radius = 5000;
                resp.geofenceList[0].hidenadius = true;
                resp.geofenceList[0].radius = 5000;
                resp.geofenceList[0].circleCenterLat = resp.geofenceList[0].circle.center.latitude;
                resp.geofenceList[0].circleCenterLon = resp.geofenceList[0].circle.center.longitude;
                resp.geofenceList[0].circle.added = true;
                resp.geofenceList[0].circle.fail = true;
                vm.geofenceList.push(resp.geofenceList[0]);
                vm.selectIndex(vm.geofenceList.length - 1);
                vm.deleteswitch[vm.geofenceList.length - 1] = true;
                var deleteFlag = 0;
                angular.forEach(vm.geofenceList, function(val, key) {
                    if (val.action != 'delete') {
                        deleteFlag = deleteFlag + 1;
                    }
                });
                if (deleteFlag > 1) {
                    vm.deleteIt = true;
                } else {
                    vm.deleteIt = false;
                }

            });
        })

        vm.disableit = false;
        vm.added = true;
        vm.isOn = true;
        countPending();
    }

    vm.openDeleteModal = function(index) {
        var delflag = 0;
        if (vm.deleteswitch[index] == true) {
            angular.forEach(vm.deleteswitch, function(val, key) {
                if (val == true && vm.geofenceList[key].action != 'delete') {
                    delflag = delflag + 1;
                }
            });
            if (delflag > 1) {
                vm.ActiveOn = false;
            } else {
                vm.ActiveOn = true;
            }
        } else {
            vm.ActiveOn = false;
        }

        if (vm.ActiveOn != true) {
            vm.delpos = index;
            vm.modalDelete = $modal.open({
                templateUrl: 'views/components/mycarzone/settings/geofence/includes/confirm-delete.html',
                scope: $scope
            });
        }
    }
    $scope.$watch(function() {
        return vm.deleteswitch;
        countPending();
    }, function(value, oldvalue) {

        var flag = 0;
        var singledeleteFlag = 0;;
        angular.forEach(vm.backdeleteSwitch, function(v, k) {
            if (value[k] == false) {
                singledeleteFlag = singledeleteFlag + 1;
            }
            if (v == value[k]) {

            } else {
                flag++;

            }
            if (vm.geofenceList[k].action != 'delete') {
                if (value[k] == true) {
                    vm.geofenceList[k].action = 'insert';
                } else {
                    vm.geofenceList[k].action = 'disable';
                }
            }
        });

        if (flag != 0) {
            vm.nameChange = true;
            countPending();
        } else {
            vm.nameChange = false;
        }
        if (vm.backdeleteSwitch) {
            if (singledeleteFlag == vm.backdeleteSwitch.length) {
                vm.ActiveOn = true;
            } else {
                vm.ActiveOn = false;
            }
        }
    }, true);
    vm.confirm = function() {

        vm.geofenceList[vm.delpos].action = 'delete';
        vm.modalDelete.close();
        vm.deleted = true;
        vm.deletedBckp = true;
        vm.disableit = false;
        countPending();
        if (vm.geofenceList[vm.delpos].fenceType == '2') {
            vm.entry = vm.entry - 1;
        } else {
            vm.out = vm.out - 1;
        }

        var deleteFlag = 0;
        angular.forEach(vm.geofenceList, function(val, key) {
            if (val.action != 'delete') {
                deleteFlag = deleteFlag + 1;
            }
        });
        if (deleteFlag > 1) {
            vm.deleteIt = true;
        } else {
            vm.deleteIt = false;
        }

    }
    vm.cancel = function() {
        vm.modalDelete.close();
    }
    vm.getStyle = function() {
        if (vm.Intervalshow == false) {
            return {
                'top': '-46px'
            };
        }

    }
    vm.closePending = function() {
        vm.viewPendingClose.close();
    }

    vm.cancelPending = function() {
        vm.viewPendingClose.close();
        init();
        vm.intervalchange = false;
        vm.deleted = false;
        vm.nameChange = false;
        vm.added = false;
        vm.isOn = false
    }

    function countPending() {
        vm.count = 0;
        if (!vm.isOn && vm.alerton) {
            vm.count = 1;
            vm.intervalchange = false;
            vm.deleted = false;
            vm.nameChange = false;
            vm.added = false;
            vm.isOn = false;
        }
        if (vm.intervalchange) {
            vm.count++;
        }
        if (vm.deleted) {
            vm.count++;
        }
        if (vm.nameChange) {
            vm.count++;
        }
        if (vm.added) {
            vm.count++;
        }
        if (vm.isOn && vm.alerton) {
            vm.count++;
        }
    }

    vm.submit = function() {

        vm.submitClicked = true;
        vm.loadit = false;
        StatusBarService.showLoadingStatus();
        StatusBarService.Inprogress();
        var data = {
            vin: vm.vehicleSelected,
            alertTypeCode: 2,
            active: vm.isOn == true ? "A" : "I"
        }
        if (!(vm.alerton || vm.added || vm.deleted || vm.intervalchange || vm.nameChange) == true) {
            return false;
        }
        if (vm.Intervalshow == false || vm.isOn == false) {
            vm.loading = true;
            GeofenceSettingsService.OnOffAlerts(data).then(function(resp) {
                if (resp.data.success == false) {
                    vm.hasError = true;
                    vm.loading = false;
                    vm.error = true;
                    vm.errorMessage = response.errorMessage;
                    StatusBarService.showErrorStatus('The service is currently not available');
                    $scope.unsuccessCall = true;
                    $scope.showStatusMessage = true;
                    $scope.statusMessage = 'The service is currently not available';
                } else {
                    $timeout(function() {
                        init();
                    }, 30000);
                }
            }).catch(function(response) {
                vm.hasError = true;
                vm.loading = false;
                vm.error = true;
                vm.errorMessage = response.errorMessage;
                StatusBarService.showErrorStatus('The service is currently not available');
                $scope.unsuccessCall = true;
                $scope.showStatusMessage = true;
                $scope.statusMessage = 'The service is currently not available';
            });
        } else {

            vm.disableit = false;
            vm.loading = true;
            vm.hasError = false;
            vm.fences = [];

            angular.forEach(vm.geofenceList, function(val, key) {
                processFenceElement(val, key);
            });
            angular.forEach(vm.fences, function(val, key) {
                val.geoFenceTime = vm.intervals[vm.currentInterval].value;
            });
            GeofenceSettingsService.sendCurfews(vm.fences).then(function(response) {

                if (response.data.success == false) {
                    vm.error = true;
                    vm.errorMessage = response.errorMessage;
                    StatusBarService.showErrorStatus('500: The service is currently not available');
                    vm.loading = false;
                    vm.hasError = true;
                    $scope.unsuccessCall = true;
                    $scope.showStatusMessage = true;
                    $scope.statusMessage = 'The service is currently not available';
                } else {
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    $timeout(function() {
                        init();
                    }, 30000);
                }
                vm.disableit = false;
            }).catch(function(response) {
                vm.hasError = true;
                vm.loading = false;
                vm.error = true;
                vm.errorMessage = response.errorMessage;
                StatusBarService.showErrorStatus('The service is currently not available');
                $scope.unsuccessCall = true;
                $scope.showStatusMessage = true;

                $scope.statusMessage = 'The service is currently not available';
            });

            function processFenceElement(val, key) {
                var fence = {
                    "geoFenceConfigId": null,
                    "geoFenceId": key + 1,
                    "active": "Y",
                    "rectLeftLon": "", //Number(val.rectLeftLon),
                    "rectLeftAlt": "", //Number(val.rectLeftAlt),
                    // "action":  "insert",
                    "vin": vm.vehicleSelected,
                    "rectFenceType": "0", //Number(val.rectFenceType),   
                    "rectLeftLat": "", //Number(val.rectLeftLat),
                    "geoFenceTime": vm.intervals[vm.currentInterval].value, //vm.intervals[vm.currentInterval].value,
                    "geoFenceTimeUom": "1", //val.geoFenceTimeUom,
                    "rectLeftType": "", //Number(val.rectLeftType),
                    "rectRightLat": "", //Number(val.rectRightLat),
                    "rectRightLon": "", //Number(val.rectRightLon),
                    "rectRightAlt": "", //Number(val.rectRightAlt),
                    "rectRightType": "", //Number(val.rectRightType),
                    "circleFenceType": "0", //vm.geofenceFilter(val)==true?2:1,
                    "circleCenterLat": "", //Number(val.circleCenterLat),
                    "circleCenterLon": "", //Number(val.circleCenterLon),
                    "circleCenterAlt": "0", //Number(val.circleCenterAlt),
                    "circleCenterType": val.circleCenterType.toString(),
                    "radius": "", //Number(val.radius),
                    "radiusUom": "2",
                    "geoFenceName": val.geoFenceName
                };

                if (val.shapeType == 1) {

                    if (val.rectangle.bounds.hasOwnProperty('northeast')) {
                        var llan = val.rectangle.bounds.northeast.latitude;
                        var llon = val.rectangle.bounds.southwest.longitude;
                        var rlat = val.rectangle.bounds.southwest.latitude;
                        var rlon = val.rectangle.bounds.northeast.longitude;
                    } else {
                        var NE = val.rectangle.bounds.getNorthEast();
                        var SW = val.rectangle.bounds.getSouthWest();
                        var NW = new google.maps.LatLng(NE.lat(), SW.lng());
                        var SE = new google.maps.LatLng(SW.lat(), NE.lng());
                        var llan = NW.lat();
                        var llon = NW.lng();
                        var rlat = SE.lat();
                        var rlon = SE.lng();
                    }
                    fence.circleFenceType = 0;
                    fence.rectLeftLat = Number(llan);
                    fence.rectLeftLon = Number(llon);
                    fence.rectLeftAlt = 0;
                    fence.rectLeftType = 0;
                    fence.rectRightLat = Number(rlat);
                    fence.rectRightLon = Number(rlon);
                    fence.rectRightAlt = 0;
                    fence.rectRightType = 0;
                    fence.rectFenceType = Number(val.fenceType);
                } else {
                    fence.rectFenceType = 0;
                    fence.circleCenterLat = Number(val.circle.center.latitude);
                    fence.circleCenterLon = Number(val.circle.center.longitude);
                    fence.circleFenceType = Number(val.fenceType);
                    fence.radius = Number(val.circle.radius);
                    fence.radiusUom = 2;
                }
                if (val.action != 'delete') {
                    if (vm.deleteswitch[key] == false) {

                        fence.action = "disable";
                    } else {
                        fence.action = 'insert';
                    }
                } else {
                    fence.action = "delete";
                }
                vm.fences.push(fence);
            }
        }
    };
};