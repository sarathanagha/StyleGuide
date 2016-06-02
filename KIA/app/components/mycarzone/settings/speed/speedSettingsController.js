'use strict';

module.exports = /*@ngInject*/ function($scope, $timeout, StatusBarService, HttpService, speedSettingsService,
    INTERVAL_LIST, $cookies, $interval, $modal, $rootScope, SpringUtilsService, $state) {
    var vm = {};
    $scope.showStatusMessage = false;
    $scope.statusMessage = '';
    $scope.successCall = false;
    $scope.unsuccessCall = false;
    $scope.requestError = false;
    $scope.enable = true;
    $scope.intervals = INTERVAL_LIST;
    vm.speedval = null;
    $scope.submitDisable = true;
    $scope.changeSpeed = false;
    $scope.changeInterval = false;
    $scope.loading = false;
    var currentSetting = {};
    $scope.pendingDisplayModal = false;
    $scope.countViewPending = false;
    $scope.count = 0;
    var alertSetting = {};
    $scope.submitClicked = false;
    var onOffCount = 0;
    $scope.isOn;
    vm.isOnOffValueChanged = false;

    speedSettingsService.getVehicles().then(function(vehicle) {
        $scope.vehicleVin = vehicle.selectedVin;
    });


    $scope.$watchGroup(['submitDisable', 'changeSpeed', 'changeInterval'], function(newVal, oldVal) {
        if ($scope.submitDisable == false) {
        }
    });

    $rootScope.$watch('inprogress', function(val) {

        if (val == true) {
            StatusBarService.showLoadingStatus();
            $scope.loading = true;
            $scope.hasError = false;
        } else {
            $scope.loading = false;
            $scope.hasError = false;
        }
    });

    function init() {
        speedSettingsService.getSettingsInfo().then(function(data) {
            if (data.serviceResponse.SpeedAlertList.length != 0) {
                var pending = data.serviceResponse.TmuStatus === 'P' || data.serviceResponse.SpeedAlertList[0].status == 'S';
                var hasErrors = data.serviceResponse.TmuStatus == 'I' || data.serviceResponse.LatestConfig == false;
            } else {
                var pending = false;
            }

            if (pending) {
                StatusBarService.showLoadingStatus();
                $scope.loading = true;
                $scope.changeSpeed = false;
                $scope.changeInterval = false;
                $scope.submitDisable = true;
                $scope.clearLoad = $timeout(function() {
                    init();
                }, 30000)


            } else if (hasErrors) {
                $scope.Errors = true;
                $scope.loading = false;
                $scope.changeSpeed = false;
                $scope.changeInterval = false;
                $scope.submitDisable = false;
                $timeout.cancel($scope.clearLoad);
                StatusBarService.clearStatus();
                if ($scope.submitFirstClicked) {
                    $state.reload();
                    $scope.submitFirstClicked = undefined;
                }
            } else {
                if ($scope.submitFirstClicked) {
                    $scope.Errors = false;
                    $scope.successCall = true;
                    StatusBarService.showSuccessStatus();
                    $scope.loading = false;
                    $scope.requestError = false;
                    $scope.submitclickedDone = undefined;
                    $timeout(function() {
                        $state.reload();
                    }, 4000)
                }
            }

            if (data.serviceResponse.SpeedAlertList.length != 0) {
                currentSetting.speedConfigId = data.serviceResponse.SpeedAlertList[0].speedConfigId;
                currentSetting.status = data.serviceResponse.SpeedAlertList[0].status;
                vm.speedval = data.serviceResponse.SpeedAlertList[0].speed;
                vm.referSpeed = data.serviceResponse.SpeedAlertList[0].speed;
                $scope.originalSpeed = data.serviceResponse.SpeedAlertList[0].speed;
                var getTimeval = data.serviceResponse.SpeedAlertList[0].speedTime;
            } else {
                vm.speedval = 45;
                vm.referSpeed = 45;
                $scope.originalSpeed = 45;
                var getTimeval = 45;
            }
            $scope.isOn = data.serviceResponse.Active == 'I' ? false : true;
            if (data.serviceResponse.Active == 'I') {

                $scope.Activestatus = false;
                vm.firstUsing = false;
            } else {
                $scope.Activestatus = true;
                vm.firstUsing = true;

            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            angular.forEach($scope.intervals, function(val, ind) {
                if (val.value == getTimeval) {
                    $scope.currentIntervalDefault = ind;
                    $scope.currentInterval = ind;
                    $scope.changeIntervalValue = val.value;
                }
            });
            $scope.$watch("currentInterval", function(nval, oval) {
                $scope.countPending();
                if (nval != oval) {

                    $scope.changeInterval = nval ? nval : 1;

                }
            });

            $('#speed-slider').slider({
                range: 'min',
                min: 45,
                max: 85,
                step: 1,
                value: vm.speedval,
                create: function(event, ui) {
                    $('<div><span>' + vm.speedval + '</span><sub>mph</sub><div>').appendTo('.ui-slider-handle');
                },
                slide: function(event, ui) {
                    $('.ui-slider-handle span').text(ui.value);
                },
                change: function(event, ui) {
                    vm.speedval = ui.value;
                    $('.ui-slider-handle span').text(ui.value);
                    $scope.countPending();
                    if (!$scope.submitFirstClicked) {
                        $scope.submitDisable = false;
                        $scope.changeSpeed = true;

                    } else {
                        $scope.submitDisable = true;
                        $scope.changeSpeed = false;
                    }
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                },
                stop: function(event, ui) {
                }
            });

            $scope.closePending = function() {
                $scope.pendingDisplayModal = false;
            };

            $scope.cancelPending = function() {
                $scope.count = 0;
                $scope.pendingDisplayModal = false;
                $scope.mobileSpeed = false;
                $scope.mobileInterval = false;
                $scope.modelInstance.dismiss('cancel');
                init();
            };

            $scope.viewPending = function() {
                setTimeout(function() {
                    $scope.loading = false;
                    $scope.requestError = false;
                    StatusBarService.clearStatus();
                });

                if ($scope.count > 0) {
                    $scope.modelInstance = $modal.open({
                        templateUrl: 'views/components/mycarzone/settings/speed/includes/pendingDisplayModal.html',
                        scope: $scope
                    });
                }

            };

            $scope.closePending = function() {

                $scope.modelInstance.dismiss('cancel');
            };

            $scope.vm.moveSliderRight = function(btnName) {
                if ($scope.isOn) {

                    var sliderElement = angular.element('#speed-slider'),
                        speedValue = -99;
                    $scope.minval = sliderElement.slider('option', 'min');
                    $scope.maxval = sliderElement.slider('option', 'max');
                    $scope.slideValue = sliderElement.slider('value');
                    $scope.step = sliderElement.slider('option', 'step');

                    if (btnName == "minus") {
                        speedValue = ($scope.slideValue - $scope.step);
                        sliderElement.slider('value', speedValue);
                    } else {
                        speedValue = ($scope.slideValue + $scope.step);
                        sliderElement.slider('value', speedValue);
                    }

                    if (speedValue == vm.speedval) {
                        $scope.submitDisable = true;
                        $scope.changeSpeed = false;
                    } else {
                        $scope.submitDisable = false;
                        $scope.changeSpeed = true;
                    }

                    if (vm.referSpeed == vm.speedval) {
                        $scope.submitDisable = true;
                        $scope.changeSpeed = false;
                    } else {
                        $scope.submitDisable = false;
                        vm.isOnOffValueChanged = false;
                        $scope.changeSpeed = true;
                    }
                    vm.speedval = speedValue;

                    $scope.countPending();
                }

            }
            $scope.requestCall = false;

            $scope.vm.submit = function(submitDisable, changeSpeed, changeInterval) {

                $scope.requestCall = true;
                $scope.submitFirstClicked = true;
                var sliderElement = angular.element('#speed-slider');
                StatusBarService.showLoadingStatus();
                StatusBarService.Inprogress();
                if (!submitDisable || changeSpeed || changeInterval) {
                    $scope.loading = true;
                    $scope.changeInterval = false;
                    $scope.changeSpeed = false;
                    angular.forEach($scope.intervals, function(val, ind) {
                        if (ind == $scope.currentInterval) {
                            $scope.changeIntervalValue = val.value;
                        }
                    });

                    currentSetting.vin = $scope.vehicleVin;
                    currentSetting.speed = vm.speedval;
                    currentSetting.speedTime = $scope.changeIntervalValue;
                    currentSetting.speedTimeUom = 1;
                    currentSetting.speedUom = 1;
                    currentSetting.action = "insert";

                    delete currentSetting.status;
                    //if (vm.isOnOffValueChanged == false ) {

                    if ($scope.Activestatus == true && $scope.isOn == true) {
                        var data = SpringUtilsService.encodeParams({
                            'speedLimitAlertPayload': JSON.stringify(currentSetting)
                        });
                        var headers = {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        };
                        HttpService.post('/ccw/kh/speedLimitAlertSettings.do', data, headers)

                        .then(function(data) {

                            if (data.data.success == true) {
                                $timeout(function() {
                                    init();
                                }, 30000);
                            } else {
                                $timeout(function() {
                                    $scope.requestError = true;
                                    $scope.loading = false;
                                    StatusBarService.showErrorStatus('500: The service is currently not available');
                                    $scope.unsuccessCall = true;
                                    $scope.showStatusMessage = true;
                                    $scope.statusMessage = 'The service is currently not available';
                                }, 5000);
                            }
                        }).catch(function(response) {
                            $scope.requestError = true;
                            $scope.loading = false;
                            StatusBarService.showErrorStatus('500: The service is currently not available');
                            $scope.unsuccessCall = true;
                            $scope.showStatusMessage = true;
                            $scope.statusMessage = 'The service is currently not available';
                        });
                        $scope.timerCall = function() {
                            speedSettingsService.getSettingsInfo().then(function(data) {
                                $scope.Activestatus = data.Active == 'A' ? true : false;
                                if (data.serviceResponse.SpeedAlertList[0].status == 'S') {
                                    $scope.requestError = false;
                                    $scope.loading = true;

                                } else if (data.serviceResponse.SpeedAlertList[0].status == 'E') {
                                    StatusBarService.showErrorStatus();
                                    $scope.unsuccessCall = true;
                                    $scope.requestError = true;
                                    $scope.loading = false;
                                    $scope.showStatusMessage = true;
                                    $scope.statusMessage = 'The service is currently not available';
                                    $interval.cancel($scope.getUpdatedData);

                                } else if (data.serviceResponse.SpeedAlertList[0].status == 'C') {
                                    StatusBarService.showSuccessStatus();
                                    $scope.successCall = true;
                                    $scope.loading = false;
                                    $scope.requestError = false;
                                    $scope.showStatusMessage = true;
                                    $interval.cancel($scope.getUpdatedData);
                                }
                                $scope.requestCall = false;
                            });
                        };
                    } else {
                        alertSetting.vin = $scope.vehicleVin;
                        alertSetting.alertTypeCode = 3;
                        alertSetting.active = $scope.isOn ? "A" : "I";

                        var data = SpringUtilsService.encodeParams({
                            'onOffAlertPayload': JSON.stringify(alertSetting)
                        });
                        var headers = {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        };
                        HttpService.post('/ccw/kh/onOffAlert.do', data, headers)

                        .then(function(data) {


                            if (data.data.success == true) {
                                $timeout(function() {
                                    init();
                                }, 30000);
                            } else {
                                $timeout(function() {
                                    $scope.requestError = true;
                                    $scope.loading = false;
                                    StatusBarService.showErrorStatus('500: The service is currently not available');
                                    $scope.unsuccessCall = true;
                                    $scope.showStatusMessage = true;
                                    $scope.statusMessage = 'The service is currently not available';
                                }, 5000);
                            }
                        }).catch(function(response) {
                            $scope.requestError = true;
                            $scope.loading = false;
                            StatusBarService.showErrorStatus('500: The service is currently not available');
                            $scope.unsuccessCall = true;
                            $scope.showStatusMessage = true;
                            $scope.statusMessage = 'The service is currently not available';
                        });
                    }
                    $scope.enable = false;
                    if ($scope.isOn) {
                        sliderElement.slider('enable');

                        $scope.submitDisable = false;
                        $scope.changeSpeed = $scope.changeSpeedoff;
                        $scope.changeInterval = $scope.changeIntervaloff;
                        $scope.submitClicked = false;
                    } else {
                        $scope.submitClicked = true;
                    }
                    $scope.submitDisable = true;

                    $scope.changeSpeed = false;
                    $scope.changeInterval = false;

                };
                $scope.timerCall = function() {

                    speedSettingsService.getSettingsInfo().then(function(data) {
                        $scope.Activestatus = data.Active == 'A' ? true : false;
                        $scope.isOn = data.serviceResponse.Active == 'I' ? false : true;

                        if (data.serviceResponse.Active == 'I') {
                            $scope.enable = false;
                            $scope.Activestatus = false;
                            vm.firstUsing = false;
                        } else {
                            $scope.enable = true;
                            $scope.Activestatus = true;
                            vm.firstUsing = true;

                        }
                        if ((data.serviceResponse.Active == 'A' && data.serviceResponse.TmuStatus == 'P') || (data.serviceResponse.Active == 'I' && data.serviceResponse.TmuStatus == 'P')) {
                            $scope.requestError = false;
                            $scope.loading = true;

                        } else if ((data.serviceResponse.Active == 'A' && data.serviceResponse.TmuStatus == 'I') || (data.serviceResponse.Active == 'I' && data.serviceResponse.TmuStatus == 'I')) {
                            StatusBarService.showErrorStatus();
                            $scope.unsuccessCall = true;
                            $scope.requestError = true;
                            $scope.loading = false;
                            $scope.showStatusMessage = true;
                            $scope.statusMessage = 'The service is currently not available';
                            $interval.cancel($scope.getUpdatedAlertData);

                        } else if ((data.serviceResponse.Active == 'A' && data.serviceResponse.TmuStatus == 'A') || (data.serviceResponse.Active == 'I' && data.serviceResponse.TmuStatus == 'A')) {
                            StatusBarService.showSuccessStatus();
                            $scope.successCall = true;
                            $scope.loading = false;
                            $scope.requestError = false;
                            $scope.showStatusMessage = true;
                            $interval.cancel($scope.getUpdatedAlertData);
                        }
                        $scope.requestCall = false;
                    });
                };
            }
        });
    };
    init();
    $scope.$watch("isOn", function(val) {

        var sliderElement = angular.element('#speed-slider');
        if (sliderElement) {
            if (vm.firstUsing !== vm.isOn) {
                vm.isOnOffValueChanged = true;
            } else {
                vm.isOnOffValueChanged = false;

            }
            if (val) {

                if (!$scope.submitClicked) {

                    sliderElement.slider('enable');
                    $scope.enable = true;
                    $scope.submitDisable = !$scope.submitDisable;
                    $scope.changeSpeed = $scope.changeSpeedoff;
                    $scope.changeInterval = $scope.changeIntervaloff;
                } else {
                    $scope.submitDisable = !$scope.submitDisable;
                }
            } else {

                sliderElement.slider('disable');
                $scope.enable = false;
                $scope.submitDisable = !$scope.submitDisable;
                $scope.changeSpeedoff = $scope.changeSpeed;
                $scope.changeIntervaloff = $scope.changeInterval;
                $scope.changeSpeed = false;
                $scope.changeInterval = false;
            }

            $scope.countPending();
            if (!$scope.submitFirstClicked) {
                if (onOffCount == 0) {
                    onOffCount = 1;
                    $scope.submitDisable = true;
                } else if (onOffCount == 1) {
                    if (val) {
                        $scope.enable = false;
                        $scope.changeSpeed = false;
                        $scope.changeInterval = false;
                        sliderElement.slider('disable');
                    }
                    onOffCount = 0;
                    $scope.submitDisable = false;
                }
            }

        }
    });

    $scope.countPending = function() {
        $scope.mobileSpeed = false;
        $scope.mobileInterval = false;
        $scope.mobileSwitch = false;
        $scope.count = 0;
        $scope.countViewPending = false;
        if ($scope.isOn === false) {
            $scope.mobileSwitch = true;
            $scope.count = 1;
        } else {

            if ($scope.currentInterval !== $scope.currentIntervalDefault) {
                $scope.mobileInterval = true;
                $scope.count = $scope.count + 1;
            }
            if (vm.speedval != Number($scope.originalSpeed)) {
                $scope.mobileSpeed = true;
                $scope.count = $scope.count + 1;
            }
            if (!$scope.Activestatus && $scope.isOn) {
                $scope.count = 1;
            }

        }
        if ($scope.count > 0) {
            $scope.countViewPending = true;
        }
        if ($scope.count == 0) {
            $scope.hideit = false;
        } else {
            $scope.hideit = true;
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }
};