'use strict';

module.exports = /*@ngInject*/ function($scope, $timeout, $state, $rootScope, HttpService, speedSettingsService, StatusBarService, CurfewSettingsService, $cookies, $interval, $modal, INTERVAL_LIST, AlertModalService, SpringUtilsService) {

    var vm = this;
    vm.disableButton = false;
    $scope.successCall = false;
    $scope.unsuccessCall = false;
    $scope.showStatusMessage = false;
    $scope.statusMessage = '';
    vm.hasError = false;
    vm.curfewGroups = [];
    vm.currentIndex = -1;
    vm.pendingList = [];
    vm.currentInterval = 0;
    vm.intervals = INTERVAL_LIST;
    vm.isOn;
    vm.disableAll = false;
    $scope.disabled = true;
    $scope.submitDisable = false;
    var alertSetting = {};
    $scope.submitClicked = false;
    var onOffCount = 0;
    $scope.loading = false;
    $scope.requestError = false;
    var backupCurfews = [];
    $scope.count = 0;
    vm.FinalSubmit = true;
    vm.isOnOffValueChanged = false;

    speedSettingsService.getVehicles().then(function(vehicle) {
        $scope.vehicleVin = vehicle.selectedVin;
    });
    vm.showMobileDayList = function(index) {
        var curfews = vm.curfewGroups[index].curfews;
        var day = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        var dayOutput = [];
        for (var i = 0; i < curfews.length; i++) {
            if (curfews[i].enabled) {
                dayOutput.push(day[i]);
            }
        }
        return dayOutput.join(',');
    };

    vm.curfewFilter = function(group) {
        return group.header.action !== 'delete';
    };

    vm.selectIndex = function(index) {
        vm.currentIndex = vm.currentIndex === index ? -1 : index;
    };

    $scope.$watch(function() {
            return vm.curfewGroups
        },
        function(newvalue, oldvalue) {
            var curfewflag = 0;
            var deleteFlag = 0;
            var del = true;
            if (oldvalue) {
                if (oldvalue.length !== 0) {
                    angular.forEach(vm.curfewGroups, function(val, key) {
                        if (val.header.switchFlag == true) {
                            deleteFlag = deleteFlag + 1;
                        }

                    });
                    if (deleteFlag == 0) {

                        $scope.ActiveOn = true;
                        $scope.stop = true;
                    } else {

                        $scope.ActiveOn = false;
                        $scope.stop = false;
                    }
                    vm.updateCurfew = newvalue;
                    angular.forEach(newvalue, function(value, i) {
                        if (backupCurfews) {
                            if (i < backupCurfews.length) {
                                var localcurfewflag = 0;
                                for (var key in value.header) {
                                    if (value.header[key] === backupCurfews[i].header[key]) {

                                    } else {

                                        if (value.header.action == 'delete') {
                                            del = false;
                                            vm.curfewChange = false;

                                        } else {
                                            del = true;
                                            localcurfewflag = localcurfewflag + 1;
                                        }
                                    }
                                }
                                if (value.header.action !== "delete") {
                                    angular.forEach(value.curfews, function(val, j) {
                                        if (val.enabled == backupCurfews[i].curfews[j].enabled) {} else {
                                            localcurfewflag = localcurfewflag + 1;
                                        }
                                    });
                                }

                                if (localcurfewflag > 0) {
                                    curfewflag = curfewflag + 1;
                                }
                            } //end
                        }

                    });

                    //} else {
                    if (backupCurfews) {
                        if (newvalue.length != backupCurfews.length) {
                            vm.addedcurfew = true;
                            $scope.submitDisable = false;
                        }
                    }
                    if (curfewflag > 0) {
                        vm.curfewChange = true;
                        $scope.submitDisable = false;
                    } else {
                        vm.curfewChange = false;
                        if (del == false) {
                            $scope.submitDisable = false;
                        }
                    }
                }
            }
            $scope.countPending();

        }, true
    );

    vm.openDeleteModal = function(index) {
        var deleteIt = false;
        var deleteFlag = 0;
        if (vm.curfewGroups[index].header.switchFlag == true) {
            angular.forEach(vm.curfewGroups, function(val, key) {
                if (val.header.switchFlag == true) {
                    deleteFlag = deleteFlag + 1;
                }

            });
            if (deleteFlag > 1) {
                deleteIt = true;
                $scope.ActiveOn = false;
            } else {
                deleteIt = false;
                $scope.ActiveOn = true;
            }
        } else {
            deleteIt = true;
            $scope.ActiveOn = false;
        }
        if (deleteIt) {
            var modalInstance = AlertModalService.openModal('mcz-curfew-delete.html');
            modalInstance.result.then(function() {
                vm.deletecurfew = true;
                var source = vm.curfewGroups[index].source;
                if (source === 'user') {
                    vm.curfewGroups.splice(index, 1);
                } else {

                    vm.curfewGroups[index].header.action = 'delete';
                }
                $scope.Backup.splice(index, 1);
            });
        }

    };
    vm.showAdd = function() {
        var limit = 0;
        if (vm.curfewGroups) {
            if (vm.curfewGroups.length != 0) {
                for (var i = 0; i < vm.curfewGroups.length; i++) {
                    if (vm.curfewGroups[i].header.action !== 'delete') {
                        limit++;
                    }
                }
            }
        }

        return limit < 3;
    };

    $scope.countPending = function() {
        $scope.count = 0;


        if (vm.alertsChange == true || vm.isOnOffValueChanged == true) {
            $scope.count++;
        }
        if (vm.curfewChange == true && vm.alertsChange !== true) {
            $scope.count++;
        }

        if (vm.intervalChange == true && vm.alertsChange !== true) {
            $scope.count++;
        }
        if (vm.addedcurfew == true && vm.alertsChange !== true) {
            $scope.count++;
        }
        if (vm.deletecurfew == true && vm.alertsChange !== true) {
            $scope.count++;
        }

    }
    vm.pendingModal = function() {
        if ($scope.count > 0) {
            $scope.modelInstance = $modal.open({
                templateUrl: 'views/components/mycarzone/settings/curfew/includes/pendingDisplayModal.html',
                scope: $scope
            });
        }
    };


    vm.addCurfew = function() {
        vm.addedcurfew = true;
        $scope.submitDisable = false;
        var curfew = CurfewSettingsService.createCurfew(vm.curfewGroups);
        if (!vm.curfewGroups) {
            vm.curfewGroups = [];
            $scope.Backup = [];
        }
        if (curfew) {
            vm.curfewGroups.push(curfew);
            $scope.Backup.push(curfew);
            $scope.countPending();
        }
    };

    function loadData() {

        //  $scope.submitDisable = false;

        $rootScope.$watch('inprogress', function(val) {
            if (!$scope.submitclickedDone) {
                if (val == true) {
                    StatusBarService.showLoadingStatus();
                    $scope.loading = true;
                } else {
                    $scope.loading = false;
                }
            }

        });

        CurfewSettingsService.getCurfewSettings().then(function(response) {

            $scope.loadinginit = true;
            if(response.CurfewAlertList.length!= 0){
                vm.pending = response.TmuStatus === 'P' || response.CurfewAlertList[0].status == 'S'; // individual pending will be checked in each curfew alert later
                vm.hasErrors = response.TmuStatus == 'I' || response.LatestConfig == false;
            }
            if (vm.pending) {
                StatusBarService.showLoadingStatus();
                $scope.loading = true;
                $scope.submitDisable = true;
                vm.curfewGroups = response.CurfewGroups;
                $scope.Backup = angular.copy(vm.curfewGroups);
                $scope.clearLoad = $timeout(function() {
                        loadData();
                    }, 30000)
            }else if(vm.hasErrors) {
                $scope.submitDisable = false;
                $scope.requestError = true;
                $scope.loading = false;
                StatusBarService.clearStatus();
                if ($scope.submitclickedDone) {

                    $scope.submitclickedDone = undefined;
                    $timeout(function() {
                        $state.reload();
                    }, 200);
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                vm.disableButton = false;
            } else {
                if ($scope.submitclickedDone) {
                    StatusBarService.showSuccessStatus();
                    $scope.requestError = false;
                    $scope.loading = false;
                    $scope.successCall = true;
                    vm.disableButton = true;
                    $scope.loadinginit = false;
                    vm.curfewChange = false;
                    vm.deletecurfew = false;
                    vm.addedcurfew = false;
                    vm.intervalChange = false;
                    vm.alertsChange = true;
                    $timeout(function() {
                        $state.reload();

                    }, 4000);
                    $scope.submitclickedDone = undefined;
                }
            }
            //vm.disableButton = false;
            backupCurfews = angular.copy(response.CurfewGroups);
            vm.curfewGroups = response.CurfewGroups;
            $scope.Backup = angular.copy(vm.curfewGroups);
            vm.Intervalshow = response.Active == 'A' ? true : false;
            angular.forEach(vm.curfewGroups, function(value, i) {
                if (value.header.active == 'A') {
                    value.header.switchFlag = true;
                    backupCurfews[i].header.switchFlag = true;
                } else {
                    value.header.switchFlag = false;
                    backupCurfews[i].header.switchFlag = false;
                }
            })
            vm.currentInterval = response.interval;
            vm.bckpInterval = response.interval;
            if (response.Active == 'I') {
                vm.isOn = false;
                vm.firstUsing = false;
            } else {
                vm.isOn = true;
                vm.firstUsing = true;
            }
            vm.deleteswitch
            vm.createTime = function(hour, min, am) {
                var timeString;
                if (am == 'am') {
                    if (hour < 10) {
                        hour = 0 + hour;
                    }
                } else {
                    if (hour < 12) {
                        hour = 12 + parseInt(hour);
                    }
                }

                timeString = hour + min;

                return timeString;
            }
            $scope.submitProgress = true;
            $scope.vm.submit = function(submitDisable) {
                
                $scope.submitclickedDone = true;
                vm.FinalSubmit = false;
                vm.currentIndex = -1;
                vm.selectedCurfews = [];
                vm.globalFlag = 0;
if(vm.updateCurfew.length==0){
    vm.updateCurfew=vm.curfewGroups;
}
                angular.forEach(vm.updateCurfew, function(value) {
                    var validateflag = 0;
                    if (value.header.switchFlag == true) {
                        value.header.active = 'A';
                    } else {
                        value.header.active = 'D';
                    }
                    angular.forEach(value.curfews, function(val, i) {

                        var startTime = vm.createTime(value.header.startHour, value.header.startMinute, value.header.startAmpm);
                        var endTime = vm.createTime(value.header.endHour, value.header.endMinute, value.header.endAmpm);

                        var curfewObj = {
                            "parentId": value.header.parentId.toString(),
                            "curfewName": value.header.curfewName,
                            "curfewConfigId": null,
                            "vin": $scope.vehicleVin,
                            "curfewId": null,
                            "active": value.header.active,
                            "startTime": startTime.toString(),
                            "endTime": endTime.toString(),
                            "startDay": 0,
                            "endDay": 0,
                            "createdUser": null,
                            "createdDate": null,
                            "modifiedUser": null,
                            "modifiedDate": null,
                            "status": "C",
                            "curfewTime": vm.intervals[vm.currentInterval].value,
                            "curfewTimeUom": "1",
                            "action": value.header.action
                        };
                        if (val.enabled == true) {
                            var adjustedIndex = i + 1 < 7 ? i + 1 : 0;
                            curfewObj.startDay = adjustedIndex;
                            curfewObj.endDay = curfewObj.startTime > curfewObj.endTime ? adjustedIndex + 1 : adjustedIndex;
                            if (curfewObj.endDay > 6) {
                                curfewObj.endDay = 0;
                            }

                            curfewObj.curfewId = ((value.header.parentId - 1) * 7) + adjustedIndex + 1;
                            vm.selectedCurfews.push(curfewObj);
                        } else {
                            validateflag = validateflag + 1;
                        }
                    });
                    if (validateflag == value.curfews.length) {
                        vm.globalFlag = vm.globalFlag + 1;
                    }
                });
                alertSetting.vin = $scope.vehicleVin;
                alertSetting.alertTypeCode = 0;
                alertSetting.active = vm.isOn ? "A" : "I"
                if (vm.isOnOffValueChanged == false) {
                    if (vm.globalFlag == 0) {
                        $scope.loadinginit = false;
                        $scope.submitProgress = false;
                        StatusBarService.showLoadingStatus();
                        StatusBarService.Inprogress();
                        $scope.submitFirstClicked = true;
                        $scope.loading = true;
                        vm.disableAll = true;
                        vm.requestCall = true;
                        vm.showvalidation = false;
                        //$scope.requestError = true;
                        var dt = SpringUtilsService.encodeParams({
                            'curfewAlertPayload': JSON.stringify(vm.selectedCurfews)
                        });
                        var headers = {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        };
                        HttpService.post('/ccw/kh/curfewAlertSettings.do', dt, headers)

                        .then(function(data) {
                            if (data.data.success == true) {
                                $scope.loading = true;
                                vm.disableButton = true;
                                $timeout(function() {
                                    loadData();
                                }, 30000);
                            } else {
                                $timeout(function() {
                                    StatusBarService.showErrorStatus('500: The service is currently not available');
                                    $scope.unsuccessCall = true;
                                    vm.disableButton = true;
                                    $scope.loading = false;
                                    vm.hasError = true;
                                    $scope.showStatusMessage = true;
                                    $scope.statusMessage = 'The service is currently not available';
                                    vm.FinalSubmit = undefined;
                                }, 4000);
                            }

                        }).catch(function(response) {
                            StatusBarService.showErrorStatus('500: The service is currently not available');
                            $scope.unsuccessCall = true;
                            vm.disableButton = true;
                            $scope.loading = false;
                            vm.hasError = true;
                            $scope.showStatusMessage = true;
                            vm.FinalSubmit = undefined;
                        });

                    } else {
                        vm.showvalidation = true;
                        vm.selectIndex(vm.curfewGroups.length - 1);
                        $scope.loading = false;
                    }
                } else {
$scope.loadinginit = false;
                    StatusBarService.showLoadingStatus();
                    StatusBarService.Inprogress();
                    var dt1 = SpringUtilsService.encodeParams({
                        'onOffAlertPayload': JSON.stringify(alertSetting)
                    });
                    var headers1 = {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                    HttpService.post('/ccw/kh/onOffAlert.do', dt1, headers1)

                    .then(function(data) {
                        if (data.data.success == true) {
                            $scope.loading = true;
                            vm.disableButton = true;
                            $timeout(function() {
                                loadData();
                            }, 30000);
                            // vm.curfewChange = false;
                            // vm.deletecurfew = false;
                            // vm.addedcurfew = false;
                            // vm.intervalChange = false;
                            // vm.alertsChange = true;
                        } else {
                            $timeout(function() {
                                $scope.loading = false;
                                vm.hasError = true;
                                StatusBarService.showErrorStatus('500: The service is currently not available');
                                $scope.unsuccessCall = true;
                                $scope.showStatusMessage = true;
                                $scope.statusMessage = 'The service is currently not available';
                            }, 4000);
                        }
                    }).catch(function(response) {
                        StatusBarService.showErrorStatus('500: The service is currently not available');
                        $scope.unsuccessCall = true;
                        vm.disableButton = true;
                        $scope.loading = false;
                        vm.hasError = true;
                        $scope.showStatusMessage = true;
                        vm.FinalSubmit = undefined;
                    });
                }
            };

        });
    }

    loadData();
    vm.inVal = 0;
    $scope.closePending = function() {
        $scope.pendingDisplayModal = false;
        $scope.modelInstance.dismiss('cancel');
    };

    $scope.cancelPending = function() {
        loadData();
        $scope.pendingDisplayModal = false;
        $scope.modelInstance.dismiss('cancel');
        vm.addedcurfew = false;
        vm.deletecurfew = false;
    };

    $scope.$watch('vm.currentInterval', function(newVal, old) {
        vm.updateCurfew = vm.curfewGroups;
        if (vm.inVal !== 0) {
            vm.intervalChange = true;
            $scope.submitDisable = false;
            if (vm.bckpInterval == newVal) {
                vm.intervalChange = false;
                if (vm.curfewChange == true || vm.deletecurfew == true || vm.addedcurfew == true) {
                    $scope.submitDisable = false;
                } else {
                    $scope.submitDisable = true;

                }
            }
            $scope.countPending();
        }
        vm.inVal++;
    }, true);
    vm.cerfewListBckp = [];
    $scope.$watch("vm.isOn", function(val) {
        if (vm.firstUsing !== vm.isOn) {
            vm.isOnOffValueChanged = true;

        } else {
            vm.isOnOffValueChanged = false;

        }
        if (val == true) {
            vm.pendingList = vm.cerfewListBckp;

            vm.alertsChange = false;
            $scope.countPending();
        } else {
            vm.cerfewListBckp = vm.pendingList;
            vm.pendingList = [];
            vm.alertsChange = true;
            $scope.countPending();
        }
        $scope.countPending();
        if (!$scope.submitClicked) {
            if (vm.intervalChange == true || vm.curfewChange == true || vm.deletecurfew == true || vm.addedcurfew == true) {
                $scope.submitDisable = false;
            } else {
                $scope.submitDisable = true;
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        } else {
            $scope.submitDisable = false;

        }
        if (!$scope.submitFirstClicked) {
            if (onOffCount == 0) {
                onOffCount = 1;
                $scope.submitDisable = false;
            } else if (onOffCount == 1) {
                if (val) {

                }
                onOffCount = 0;
                if (vm.intervalChange == true || vm.curfewChange == true || vm.deletecurfew == true || vm.addedcurfew == true) {
                    $scope.submitDisable = false;
                } else {
                    $scope.submitDisable = true;
                }
            }
        }
    });
};