'use strict';

module.exports = /*@ngInject*/ function($scope, $cookies, $state, StatusBarService, lockService, $http, $interval, $timeout, $rootScope, VehicleStatusService) {
    $scope.postError = false;
    $scope.pendingunlock = false;
    $scope.pendinglock = false;
    $scope.pendingmsg = false;
    $scope.isPending = '';
    $scope.isLockSection = true;
    $scope.isUnLockSection = true;
    $scope.errorMsgHeader = false;
    $scope.successMsgHeader = false;
    $scope.bodyStyle = '';
    $scope.lockButtonShow = false;
    $scope.unlockButtonShow = false;
    $scope.refreshingstatus = false;
    $rootScope.ClimateControl = true;
    $scope.disableAll = false;
    $rootScope.hasRefresh = true;
    $scope.notificationJSON = function () {
         $rootScope.$broadcast('notificationJSON');
     };

    var isLocked;
    $scope.vehicleStatus = {};

    var vm = this;
    vm.genType = $cookies['gen'];
    vm.doorOpen = false;
    vm.unsuccessCall = false;
    vm.successCall = false;
    vm.hideTimeStamp = true;

VehicleStatusService.getLatestVehicleStatus().then(function(data){
  vm.vehicleStatus = data;
      vm.vStatus = vm.vehicleStatus[0].serviceResponse.timeStampVO.unixTimestamp;
      vm.hideTimeStamp = false;
      if(vm.vehicleStatus[1].lockStatus == 'P'){
            $interval.cancel($scope.getUpdatedLockData);
            $scope.lockScope();
            $scope.getUpdatedLockData = $interval($scope.timerCallLockDoor, 30000)
      }else if(vm.vehicleStatus[1].unlockStatus == 'P'){
            $interval.cancel($scope.getUpdatedData);
            $scope.unLockScope();
            $scope.getUpdatedData = $interval($scope.timerCallUnLockDoor, 30000)
      }else if(vm.vehicleStatus[1].lockStatus == 'E'){
            vm.lockHasError();
      }else if(vm.vehicleStatus[1].unlockStatus == 'E'){
            vm.unlockHasError();
      }      
});


vm.latestVehicleStatus=function(){
      vm.hasMessege = false;
      $scope.disableAll = true;
      StatusBarService.clearStatus();
      //angular.element(".loader").show();
      StatusBarService.showLoadingStatus();
      VehicleStatusService.latestVehicleStatus().then(function(data){
      if(data.success == true){
        /*vm.vehicleStatus = data;
        vm.hasMessege = false;
        vm.vStatus = vm.vehicleStatus.serviceResponse.timeStampVO.unixTimestamp;
        StatusBarService.clearStatus();*/
        $state.reload();
      }
      else{
        $scope.disableAll = false;
        //angular.element(".loader").hide();
        StatusBarService.showErrorStatus();
        vm.vStatus = "504 : We're sorry, we were unable to connect to your vehicle. Try moving the vehicle to an area with better network coverage. If the problem persists, call consumer";
      }

    });

   }



    lockService.getvehiclestatusInfo().then(function(data) {
        $scope.vehicleStatus = data[0].serviceResponse.latestVehicleStatus;
        isLocked = $scope.vehicleStatus.doorLock;

        $scope.doorLock = data[0].serviceResponse.latestVehicleStatus.doorLock;
        /*$scope.hoodOpen = data[0].serviceResponse.latestVehicleStatus.hoodOpen;*/
        $scope.trunkOpen = data[0].serviceResponse.latestVehicleStatus.trunkOpen;
        $scope.frontLeftDoorOpen = data[0].serviceResponse.latestVehicleStatus.doorOpen.frontLeft !== 0? true:false;
        $scope.frontRightDoorOpen = data[0].serviceResponse.latestVehicleStatus.doorOpen.frontRight !== 0? true:false;
        $scope.backLeftDoorOpen = data[0].serviceResponse.latestVehicleStatus.doorOpen.backLeft !== 0? true:false;
        $scope.backRightDoorOpen = data[0].serviceResponse.latestVehicleStatus.doorOpen.backRight !== 0? true:false; 
        vm.doorOpen = ($scope.frontLeftDoorOpen || $scope.frontRightDoorOpen || $scope.backLeftDoorOpen || $scope.backRightDoorOpen)? true: false;
    });
    /*$scope.appliedClass = function(isLocked) {
        if ($scope.vehicleStatus.doorLock == true) {
            return "locked";
        } else {
            return "unlocked";
        }
    }*/
    $scope.unlockVehicle = function(e) {
        vm.successCall = false;
        vm.unsuccessCall = false;
        if(vm.doorOpen){
            $scope.alertMsg = true;
            return;
        }
        e.preventDefault();
        $scope.unLockScope();
        
        $http({
                method: "POST",
                url: '/ccw/kh/unlockDoor.do',
                data: $.param({
                    "vehicleStatusPayload": JSON.stringify($scope.vehicleStatus)
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {
            })
            .error(function() {
                vm.unsuccessCall = true;
                $scope.notificationJSON();
            }).then(function(data) {
                var resp = data.data;
                if(resp.success){
                    StatusBarService.clearStatus();
                //angular.element(".loader").show();
                StatusBarService.showLoadingStatus();
                $scope.disableAll = true;
                $scope.getUpdatedData = $interval($scope.timerCallUnLockDoor, 30000)
            }else{
                vm.unsuccessCall = true;
                //angular.element(".loader").hide();
                    vm.hasMessege=true;
                    StatusBarService.showErrorStatus('Your previous request did not complete. Your settings have been restored.');
                    $scope.postError = true;
                    $scope.isLockSection = false;
                    $scope.isUnLockSection = false;
                    $scope.pendingmsg = false;
                    $scope.pendingunlock = false;
                    $scope.pendinglock = false;
                    $rootScope.loadercontent = false;
                    $rootScope.hasRefresh = true;
                    $scope.disableAll = false;
                    $scope.notificationJSON();

                    $interval.cancel($scope.getUpdatedData);
            }
                
            });
    };

    $scope.unLockScope = function(){
        $scope.pendingunlock = true;
        $scope.pendingmsg = true;
        $scope.isLockSection = false;
        $scope.isUnLockSection = false;
        $rootScope.pageStatus = '';
        $rootScope.pageStatusMessage = '';
        $scope.postError = false;
        $scope.refreshingstatus = false;
        $rootScope.hasRefresh = false;
        $scope.disableAll = true;
    };

    $scope.timerCallUnLockDoor = function() {
            lockService.getvehiclestatusInfo().then(function(data) {
                if ((data[1].lockStatus == 'P') || (data[1].unlockStatus == 'P')) {
                    $scope.postError = false;
                    $scope.pendingunlock = true;
                    $scope.pendingmsg = true;
                            $scope.disableAll = true;

                } else if ((data[1].lockStatus == 'E') || (data[1].unlockStatus == 'E')) {
                    vm.unlockHasError();
                    
                    $scope.notificationJSON();

                    $interval.cancel($scope.getUpdatedData);
                } else if ((data[1].lockStatus == 'Z') && (data[1].unlockStatus == 'Z')) {
                    vm.successCall = true;
                    $scope.vehicleStatus = data[0].serviceResponse.latestVehicleStatus;
                    $scope.pendingmsg = false;
                    $scope.isLockSection = true;
                    $scope.isUnLockSection = true;
                    //angular.element(".loader").hide();
                    $rootScope.loadercontent = false;
                    $rootScope.hasRefresh = true;
                    $scope.disableAll = false;
                    vm.hasMessege=true;
                    $scope.doorLock = data[0].serviceResponse.latestVehicleStatus.doorLock;
                    StatusBarService.showSuccessStatus('Your previous request was successful . Your vehicle status has been updated to reflect changes.');
                    
                    $scope.pendingunlock = false;
                    $scope.pendinglock = false;
                    $timeout(function(){
                      vm.successCall = false;
                    },5000);
                    $interval.cancel($scope.getUpdatedData);
                    $scope.notificationJSON();
                }
            });


        };

        vm.unlockHasError = function(){
            vm.unsuccessCall = true;
                    //angular.element(".loader").hide();
                    vm.hasMessege=true;
                    StatusBarService.showErrorStatus('Your previous request did not complete. Your settings have been restored.');
                    $scope.postError = true;
                    $scope.isLockSection = false;
                    $scope.isUnLockSection = false;
                    $scope.pendingmsg = false;
                    $scope.pendingunlock = false;
                    $scope.pendinglock = false;
                    $rootScope.loadercontent = false;
                    $rootScope.hasRefresh = true;
                    $scope.disableAll = false;
        }

    /*retryUnlockvehicle*/

    $scope.retryunlockVehicle = function(e) {
        if(vm.doorOpen){
            $scope.alertMsg = true;
            return;
        }
        e.preventDefault();
        $scope.unLockScope();

        $http({
                method: "POST",
                url: '/ccw/kh/unlockDoor.do',
                data: $.param({
                    "vehicleStatusPayload": JSON.stringify($scope.vehicleStatus)
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {
            })
            .error(function() {
                $scope.notificationJSON();
            }).then(function(data) {
                StatusBarService.clearStatus();
                StatusBarService.showLoadingStatus();
                //angular.element(".loader").show();
                $scope.disableAll = true;
                $scope.getUpdatedData = $interval($scope.timerCallUnLockDoor, 30000)
            });
    };
    $scope.refreshVehicle = function(e) {

        StatusBarService.clearStatus();
        StatusBarService.showLoadingStatus();
                //angular.element(".loader").show();
                $scope.disableAll = true;
        $scope.refreshingstatus = true;
        $rootScope.pageStatus = '';
        $rootScope.pageStatusMessage = '';
        $scope.isLockSection = false;
        $scope.isUnLockSection = false;
        $scope.postError = false;
        $rootScope.hasRefresh = false;
        $rootScope.loadercontent = false;
                $scope.disableAll = true;

         $http({
                method: "GET",
                url: '/ccw/kh/latestVehicleStatus.do',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {

            })
            .error(function() {

            }).then(function(data) {
                $scope.timerCall();
            });
        $scope.timerCall = function() {
            lockService.getvehiclestatusInfo().then(function(data) {
                $state.reload();
                /*$scope.refreshingstatus = false;
                vm.hasMessege=true;
                StatusBarService.showSuccessStatus('Your previous request was successful . Your vehicle status has been updated to reflect changes.');
                
                $scope.isLockSection = true;
                $scope.isUnLockSection = true;
                $scope.postError = false;
                angular.element(".loader").hide();
                $rootScope.loadercontent = false;
                $rootScope.hasRefresh = true;
                $scope.disableAll = false;

                $interval.cancel($scope.getUpdatedData);*/

            });
        };

    };
    $scope.lockVehicle = function(e) {
        vm.successCall = false;
        vm.unsuccessCall = false;
        if(vm.doorOpen){
            $scope.alertMsg = true;
            return;
        }
        e.preventDefault();
        $scope.lockScope();

        $http({
            method: "POST",
            url: '/ccw/kh/lockDoor.do',
            data: $.param({
                "vehicleStatusPayload": JSON.stringify($scope.vehicleStatus)
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
        }).error(function() {
            vm.unsuccessCall = true;
            $scope.notificationJSON();
        }).then(function(data) {
                var resp = data.data;
            if(resp.success){
                StatusBarService.clearStatus();
                StatusBarService.showLoadingStatus();
            //angular.element(".loader").show();
            //setInterval($scope.timerCall, 30000);
            $scope.getUpdatedLockData = $interval($scope.timerCallLockDoor, 30000)
        }else{
            vm.unsuccessCall = true;
            //angular.element(".loader").hide();
                    vm.hasMessege=true;
                    StatusBarService.showErrorStatus('Your previous request did not complete. Your settings have been restored.');
                    
                    $scope.postError = true;
                    $scope.isLockSection = false;
                    $scope.isUnLockSection = false;
                    $scope.pendingmsg = false;
                    $scope.pendingunlock = false;
                    $scope.pendinglock = false;
                    $scope.postError = true;
                    $rootScope.loadercontent = false;
                    $rootScope.hasRefresh = true;
                            $scope.disableAll = false;
                            $scope.notificationJSON();

                    $interval.cancel($scope.getUpdatedLockData);
        }
            
        })
    };

    $scope.lockScope = function(){
        $scope.pendinglock = true;
        $scope.pendingmsg = true;
        $scope.isLockSection = false;
        $scope.isUnLockSection = false;
        $rootScope.pageStatus = '';
        $rootScope.pageStatusMessage = '';
        $scope.refreshingstatus = false;
        $scope.postError = false;
        $rootScope.hasRefresh = false;
        $rootScope.loadercontent = false;
        $scope.disableAll = true;
    };

    $scope.timerCallLockDoor = function() {
            lockService.getvehiclestatusInfo().then(function(data) {
                if ((data[1].lockStatus == 'P') || (data[1].unlockStatus == 'P')) {
                    $scope.postError = false;
                    $scope.pendingunlock = false;
                    $scope.pendingmsg = true;
                            $scope.disableAll = true;

                    } else if ((data[1].lockStatus == 'E') || (data[1].unlockStatus == 'E')) {
                    vm.lockHasError();
                            $scope.notificationJSON();

                    $interval.cancel($scope.getUpdatedLockData);

                } else if ((data[1].lockStatus == 'Z') && (data[1].unlockStatus == 'Z')) {
                    vm.successCall = true;
                    $scope.vehicleStatus = data[0].serviceResponse.latestVehicleStatus;
                    $scope.pendingmsg = false;
                    $scope.isLockSection = true;
                    $scope.isUnLockSection = true;
                    //angular.element(".loader").hide();
                    vm.hasMessege=true;
                    $scope.doorLock = data[0].serviceResponse.latestVehicleStatus.doorLock;
                    StatusBarService.showSuccessStatus('Your previous request was successful . Your vehicle status has been updated to reflect changes.');
                    
                    $scope.pendingunlock = false;
                    $scope.pendinglock = false;
                    $rootScope.loadercontent = false;
                    $rootScope.hasRefresh = true;
                            $scope.disableAll = false;
                            $scope.notificationJSON();
                    $timeout(function(){
                      vm.successCall = false;
                    },5000);

                   $interval.cancel($scope.getUpdatedLockData);

                }
            });
        };
        vm.lockHasError = function(){
            vm.unsuccessCall = true;
                    //angular.element(".loader").hide();
                    vm.hasMessege=true;
                    StatusBarService.showErrorStatus('Your previous request did not complete. Your settings have been restored.');
                    
                    $scope.postError = true;
                    $scope.isLockSection = false;
                    $scope.isUnLockSection = false;
                    $scope.pendingmsg = false;
                    $scope.pendingunlock = false;
                    $scope.pendinglock = false;
                    $scope.postError = true;
                    $rootScope.loadercontent = false;
                    $rootScope.hasRefresh = true;
                            $scope.disableAll = false;
        }

    /*retrylockvehicle*/
    $scope.retrylockVehicle = function(e) {
        if(vm.doorOpen){
            $scope.alertMsg = true;
            return;
        }
        e.preventDefault();
        $scope.lockScope();

        $http({
            method: "POST",
            url: '/ccw/kh/lockDoor.do',
            data: $.param({
                "vehicleStatusPayload": JSON.stringify($scope.vehicleStatus)
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {

        }).error(function() {
            $scope.notificationJSON();
            $scope.lockButtonShow = true;
            $scope.postError = true;
          }).then(function(data) {
            StatusBarService.clearStatus();
            StatusBarService.showLoadingStatus();
            //angular.element(".loader").show();
            $scope.getUpdatedLockData = $interval($scope.timerCallLockDoor(), 30000)
        })
    };
};