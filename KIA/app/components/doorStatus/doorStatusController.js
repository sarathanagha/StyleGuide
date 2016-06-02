'use strict';

module.exports = /*@ngInject*/ function($scope, $rootScope, $state, StatusBarService,
    doorstatusService, $http, $interval,batteryService,CarInfoService,VehicleStatusService,ResolveService,$timeout, $window) {
    
    var vm = this;

    vm.doorLockStatus=false;
    vm.defaultLockStatus=true;
    vm.statusMsg = "";
    vm.alertMsg = false;
    vm.postError = false;
    vm.pending = false;
    
    vm.doorFrontLeft = '0';
    vm.doorFrontRight = '0';
    vm.doorBackLeft = '0';
    vm.doorBackRight = '0';
    vm.trunk = 'false';
    
    vm.errorState = false;
    vm.mobile = false;
    if($(window).width() < 768){
        vm.mobile = true;
    }

    var serviceCall;
    var serviceCallEvent;

    $scope.pageLoadservBlkChk = function(){ //Initial page load service block check
        if(angular.isDefined(serviceCall)) return;

        serviceCall = $interval(function(){
            CarInfoService.getServiceBlockInfo().then(function(data) {
                if(data.blocked == '1'){
                    StatusBarService.showLoadingStatus();
                    vm.serviceBlock = true;
                    //vm.statusMsg = "Service Blocked: " + data.serviceName;
                    vm.statusMsg = VehicleStatusService.getVehicleStatusMessage(data.serviceName);
                }
                else{
                    $scope.stopServiceCall(data.errorCode, data.error);
                }  
            });
        }, 10000);
    };

    $scope.pageLoadservBlkChk();

    $scope.stopServiceCall = function(errorCode, errorMsg){
        if(angular.isDefined(serviceCall)){
            vm.serviceBlock = false;
            $interval.cancel(serviceCall);
            serviceCall = undefined;
            
            if(angular.isDefined(errorCode) && errorCode !== ""){ //service block returned error code
                if(vm.mobile)
                    StatusBarService.clearStatus();
                else
                    StatusBarService.showErrorStatus("typeEV");
                vm.statusMsg = errorMsg;
                vm.errorState = true;
            } else {
                StatusBarService.clearStatus();
                vm.errorState = false;
                vm.statusMsg = "Last updated as of " + $scope.timeStampStatusBar;
            }
        }
    };

    $scope.stopServiceCallEvent = function(flag){
        if(angular.isDefined(serviceCallEvent)){
            $interval.cancel(serviceCallEvent);
            serviceCallEvent = undefined;
            if(flag) $window.location.reload(); //$state.reload();
        }
    };

    $scope.$on('$destroy', function() {
        $scope.stopServiceCall();
        $scope.stopServiceCallEvent();    
    });

    ResolveService.resolveMultiple([CarInfoService.getCarInfo])
        .then(function(data) {
            vm.vehicleStatus = data;
            angular.forEach(vm.vehicleStatus[0].vehicles,function(val,key){
                if(val.vehicleStatusTimeStamp){
                   $scope.timeStampStatusBar = moment(val.vehicleStatusTimeStamp).format("MMMM DD, YYYY hh:mm a");
                }
            });
    });

    $scope.eventCallservBlkChk = function(){ //Events call service block check
        if(angular.isDefined(serviceCallEvent)) return;

        serviceCallEvent = $interval(function(){
            CarInfoService.getServiceBlockInfo().then(function(data) {
                if(data.blocked == '1'){
                    StatusBarService.showLoadingStatus();
                    vm.serviceBlock = true;
                    //vm.statusMsg = "Service Blocked: " + data.serviceName;
                    vm.statusMsg = VehicleStatusService.getVehicleStatusMessage(data.serviceName);
                }
                else{
                    if(data.success == true && (data.errorCode == "" || data.errorCode == undefined)){
                        //StatusBarService.showSuccessStatus();
                        //vm.statusMsg = "Success...";
                        //$timeout(function(){$scope.stopServiceCallEvent(true);},5000);
                        $scope.stopServiceCallEvent(true);
                    } else {
                        if(vm.mobile)
                            StatusBarService.clearStatus();
                        else
                            StatusBarService.showErrorStatus("typeEV");
                        vm.statusMsg = data.error;
                        vm.errorState = true;
                        vm.postError = true;
                        vm.serviceBlock = false;
                        $scope.stopServiceCallEvent(false);
                        //$timeout(function(){$scope.stopServiceCallEvent();},5000);
                    }  
                }
            });
        }, 10000);
    };

    vm.updateVehicleStatus = function(){
        if(vm.serviceBlock == true)
            return;

        vm.serviceBlock = true;
        vm.errorState = false;
        StatusBarService.showLoadingStatus();
        vm.pending = true;
        vm.pendingStatus = "Refresh vehicle status...";

        CarInfoService.getServiceBlockInfo().then(function(data) {
            if(data.blocked == '1'){
                //vm.statusMsg = "Service Blocked: " + data.serviceName;
                vm.statusMsg = VehicleStatusService.getVehicleStatusMessage(data.serviceName);
                serviceCall = $interval(function(){ //looping until unblocked to enable buttons
                    CarInfoService.getServiceBlockInfo().then(function(data) {
                        if(data.blocked == '0')
                            $scope.stopServiceCall(data.errorCode, data.error);
                    });
                }, 10000);
            }
            else{
                $timeout(function(){vm.statusMsg = "Requesting vehicle status. Please allow 2-3 minutes.";},10000);
                VehicleStatusService.getVehicleStatus().then(function(data){
                    if(data.success === "false"){
                        if(vm.mobile)
                            StatusBarService.clearStatus();
                        else
                            StatusBarService.showErrorStatus("typeEV");
                        vm.statusMsg = data.error;
                        vm.errorState = true;
                        vm.postError = true;
                        vm.serviceBlock = false;
                    }
                    else{
                        $window.location.reload(); //$state.reload();
                    }
                });
            }   
        });
    };

    doorstatusService.getLockInfo().then(function(data) {
    	// if(data!=null && data!=undefined){
    	// if(data.success == "true"){
        if(data.doorOpen&&data.trunkOpen){
            vm.trunk = data.trunkOpen;
            vm.doorFrontLeft = data.doorOpen.frontLeft;
            vm.doorFrontRight = data.doorOpen.frontRight;
            vm.doorBackLeft = data.doorOpen.backLeft;
            vm.doorBackRight = data.doorOpen.backRight;
            if (data.doorLock == "false") {
                vm.doorLockStatus = false; //Door(s) unlocked
                vm.defaultLockStatus=false;

            } if (data.doorLock == "true") {
                 vm.doorLockStatus = true; //All doors locked
                 vm.defaultLockStatus=false;
            }
    	}
    	// }
    });

    vm.unlockVehicle = function() {
        if(vm.serviceBlock == true)
            return;
        if(vm.doorFrontLeft == '1' || vm.doorFrontRight == '1' || vm.doorBackLeft == '1' || vm.doorBackRight == '1' || vm.trunk != 'false'){
            vm.alertMsg = true;
            return;
        }

        vm.serviceBlock = true;
        vm.errorState = false;
        StatusBarService.showLoadingStatus();
        vm.pending = true;
        vm.pendingStatus = "Unlocking vehicle...";

        CarInfoService.getServiceBlockInfo().then(function(data) {
            if(data.blocked == '1'){
                //vm.statusMsg = "Service Blocked: " + data.serviceName;
                vm.statusMsg = VehicleStatusService.getVehicleStatusMessage(data.serviceName);
                serviceCall = $interval(function(){ //looping until unblocked to enable buttons
                    CarInfoService.getServiceBlockInfo().then(function(data) {
                        if(data.blocked == '0')
                            $scope.stopServiceCall(data.errorCode, data.error);
                    });
                }, 10000);
            }
            else{
                $http({method: "GET", url: '/ccw/ev/unlockDoor.do',}).then(function(data){
                    if(data.data.success === "false"){
                        if(vm.mobile)
                            StatusBarService.clearStatus();
                        else
                            StatusBarService.showErrorStatus("typeEV");
                        vm.statusMsg = data.data.error;
                        vm.errorState = true;
                        vm.serviceBlock = false;
                    }
                    else{
                        $scope.eventCallservBlkChk();
                    }
                });
            }   
        });
    };

    vm.lockVehicle = function() {
        if(vm.serviceBlock == true)
            return;
        if(vm.doorFrontLeft == '1' || vm.doorFrontRight == '1' || vm.doorBackLeft == '1' || vm.doorBackRight == '1' || vm.trunk != 'false'){
            vm.alertMsg = true;
            return;
        }

        vm.serviceBlock = true;
        vm.errorState = false;
        StatusBarService.showLoadingStatus();
        vm.pending = true;
        vm.pendingStatus = "Locking vehicle...";       

        CarInfoService.getServiceBlockInfo().then(function(data) {
            if(data.blocked == '1'){
                //vm.statusMsg = "Service Blocked: " + data.serviceName;
                vm.statusMsg = VehicleStatusService.getVehicleStatusMessage(data.serviceName);
                serviceCall = $interval(function(){ //looping until unblocked to enable buttons
                    CarInfoService.getServiceBlockInfo().then(function(data) {
                        if(data.blocked == '0')
                            $scope.stopServiceCall(data.errorCode, data.error);
                    });
                }, 10000);
            }
            else{
                $http({method: "GET", url: '/ccw/ev/lockDoor.do',}).then(function(data){
                    if(data.data.success === "false"){
                        if(vm.mobile)
                            StatusBarService.clearStatus();
                        else
                            StatusBarService.showErrorStatus("typeEV");
                        vm.statusMsg = data.data.error;
                        vm.errorState = true;
                        vm.serviceBlock = false;
                    }
                    else{
                        $scope.eventCallservBlkChk();
                    }
                });
            }   
        });
    };
};