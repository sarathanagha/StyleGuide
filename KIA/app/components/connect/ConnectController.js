'use strict';
module.exports = /*@ngInject*/ function($anchorScroll, $scope, VehicleStatusService, CarInfoService, ResolveService, ConnectInfoService,
 $cookies, $timeout, $interval, $state, StatusBarService) {
    var _genType = $cookies['gen'];
    var vm = this;
    defaultStatus();    

    var hexToTemp = {
        "F" : {"--" : "--", "01" : 62, "02" : 62, "03" : 62, "04" : 63, "05" : 64, "06" : 65, "07" : 66, "08" : 67, "09" : 68, "0A" : 69, "0B" : 70, "0C" : 71, "0D" : 72, "0E" : 73, "0F" : 74, "10" : 75, "11" : 76, "12" : 77, "13" : 78, "14" : 79, "15" : 80, "16" : 81, "17" : 82, "18" : 83, "19" : 84, "1A" : 85, "1B" : 86, "1C" : 87, "1D" : 88, "1E" : 89, "1F" : 89, "20" : 90},
        "C" : {"--" : "--", "01" : 17, "02" : 17, "03" : 17.5 , "04" : 18, "05" : 18.5, "06" : 19, "07" : 19.5, "08" : 20, "09" : 20.5, "0A" : 21, "0B" : 21.5, "0C" : 22, "0D" : 22.5, "0E" : 23, "0F" : 23.5, "10" : 24, "11" : 24.5, "12" : 25, "13" : 25.5, "14" : 26, "15" : 26.5, "16" : 27, "17" : 27.5, "18" : 28, "19" : 28.5, "1A" : 29, "1B" : 29.5, "1C" : 30, "1D" : 30.5, "1E" : 31, "1F" : 31.5, "20" : 32}
    };

    var tempToHex = function(temp){
        var hexTemp = (temp - 59).toString(16);
        if(temp == 62) hexTemp = "2";
        if(temp == 90) hexTemp = "20";
        return hexTemp.length == 1? "0" + hexTemp: hexTemp;
    };

    vm.errorState = false;
    vm.mobile = false;
    if($(window).width() < 768){
        vm.mobile = true;
    }

    var serviceCall;
    
    function defaultStatus(){
    	vm.batteryCharge = 0;
        vm.batteryStatus = 10;
        vm.distanceUnitType = "miles";
        //$scope.batteryStatus = '--';
        $scope.vmStatus = '--';
        $scope.knobData = [{
            value: "--",
            options: {
                fgColor: '#BB1628',
                angleOffset: -125,
                angleArc: 250,
                readOnly: true
            }
        }];
    }

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
                else{ //Unblocked or data.blocked == '0'
                    //if errorCode empty or undefined, (mean success) then reload page
                    //else errorCode == 504, (mean failure) then show error & do not reload page.
                    $scope.stopServiceCall(data.errorCode, data.error);
                }  
            });
        }, 10000);
    }

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

    $scope.$on('$destroy', function() {
        $scope.stopServiceCall();    
    });

    vm.updateVehicleStatus = function(){
        if(vm.serviceBlock == true)
            return;

        vm.serviceBlock = true;
        vm.errorState = false;
        StatusBarService.showLoadingStatus();

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
                        vm.serviceBlock = false;
                        vm.errorState = true;  
                    } else {
                        $state.reload();   
                    }
                });
            }   
        });
    }

    ResolveService.resolveMultiple([CarInfoService.getCarInfo])
        .then(function(data) {
            vm.vehicleStatus = data;
            angular.forEach(vm.vehicleStatus[0].vehicles,function(val,key){
                if(val.vehicleStatusTimeStamp){
                   $scope.timeStampStatusBar = moment(val.vehicleStatusTimeStamp).format("MMMM DD, YYYY hh:mm a"); 
                }
            });
        });

    ConnectInfoService.getTripInfo().then(function(data) {
        vm.vehicleStatus = data;
        vm.tempPref = data.userTempPref; //0 is C, 1 is F
        vm.doorLockStatus = data.doorLock;
        if (data.doorLock == "false") {
            vm.doorLockStatus = false; //data.doorLock;
        } else {
            vm.doorLockStatus = true;
        }
        if (data.eVStatus != undefined && data.eVStatus.batteryCharge != undefined) {
            vm.batteryCharge = data.eVStatus.batteryCharge;
            vm.batteryStatus = data.eVStatus.batteryStatus;
            vm.batteryPlugStatus = data.eVStatus.batteryPlugin;
            $scope.vmStatus = vm.batteryStatus;
            //$scope.batteryStatus = data.eVStatus.batteryStatus;
            $scope.knobData = [{
                value: data.eVStatus.drvDistance[0].distanceType.value,
                options: {
                    fgColor: data.eVStatus.drvDistance[0].distanceType.value >= 20 ? '#7bb609' : '#BB1628',
                    angleOffset: -125,
                    angleArc: 250,
                    readOnly: true
                }
            }];

        } else { 
        defaultStatus();
        }

        if (data.eVStatus != undefined) {
            var type, driveDistanceUnit = data.eVStatus.drvDistance[0].distanceType.unit;
            switch (driveDistanceUnit) {
                case 0:
                    type = "feet";
                    break;
                case 1:
                    type = "kilometer";
                    break;
                case 2:
                    type = "meter";
                    break;
                case 3:
                    type = "miles";
                    break;
                default:
                    type = "miles";
                    break;
            }
            vm.distanceUnitType = type;

        }
    });
    ConnectInfoService.getTempInfo().then(function(data) {
        if(data == null)
            vm.temperature == data;
        else{
            if(data != null)
                vm.temperature = Math.ceil(data);
            vm.temperature = (vm.tempPref == 0? hexToTemp['C'][tempToHex(vm.temperature).toUpperCase() || "--"]: vm.temperature);
            vm.temperature = (vm.tempPref == 0? Math.round(vm.temperature): vm.temperature);
        }
    });

    $anchorScroll(0);
};