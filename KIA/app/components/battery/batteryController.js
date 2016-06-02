'use strict';

module.exports = /*@ngInject*/ function($anchorScroll, $scope, $rootScope, $state, CarInfoService, VehicleStatusService, batteryService, doorstatusService, 
    StatusBarService, ConnectInfoService, $interval, $timeout, $cookies, $window) {
    var vm = this;
    vm.genType = $cookies['gen'];
    vm.weekDate = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    vm.hourList = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    vm.minuteList = ['50','40','30','20','10','00'];
    vm.secList = ['AM','PM'];
    vm.statusMsg = "";
    vm.actualMsg = "";
    vm.errorScheduleI = false;
	vm.errorScheduleII = false;
    vm.errorSchMsg = "";
    defaultStatus();

    angular.element('body').click(function(e){
        if(!$(e.target).closest('.hour-wrap1').length && angular.element('.hour-list1').is(':visible')){          
                    $timeout(function() {  vm.displayHourI = !vm.displayHourI; }, 10);              
        }
         if(!$(e.target).closest('.hour-wrap2').length && angular.element('.hour-list2').is(':visible')){ 
                 $timeout(function() {  vm.displayHourII = !vm.displayHourII; }, 10);   
        }
        if(!$(e.target).closest('.minute-wrap1').length && angular.element('.minute-list1').is(':visible')){
                $timeout(function() { vm.displayMinuteI= !vm.displayMinuteI; }, 10);  
        }
        if(!$(e.target).closest('.minute-wrap2').length && angular.element('.minute-list2').is(':visible')){
                $timeout(function() { vm.displayMinuteII= !vm.displayMinuteII; }, 10);  
        }
        if(!$(e.target).closest('.am-pm-wrap1').length && angular.element('.am-pm-list1').is(':visible')){ 
                $timeout(function() {  vm.displaySectionI= ! vm.displaySectionI; }, 10);  
        }
        if(!$(e.target).closest('.am-pm-wrap2').length && angular.element('.am-pm-list2').is(':visible')){
                $timeout(function() {  vm.displaySectionII= ! vm.displaySectionII; }, 10);
        } 
    });

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
                    vm.actualMsg = ""+data.serviceName;
                    vm.statusMsg = VehicleStatusService.getVehicleStatusMessage(vm.actualMsg);
                }
                else{
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

    $scope.stopServiceCallEvent = function(flag){
        if(angular.isDefined(serviceCallEvent)){
            $interval.cancel(serviceCallEvent);
            serviceCallEvent = undefined;
            if(flag) $window.location.reload(); //$state.reload();
        }
    };

    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $scope.stopServiceCall();
        $scope.stopServiceCallEvent();       
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
                        $scope.stopServiceCallEvent(true);
                    } else {
                        if(vm.mobile)
                            StatusBarService.clearStatus();
                        else
                            StatusBarService.showErrorStatus("typeEV");
                        vm.statusMsg = data.error;
                        vm.errorState = true;
                        vm.serviceBlock = false;
                        $scope.stopServiceCallEvent(false);
                    }  
                }
            });
        }, 10000);
    }

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
                        vm.errorState = true;
                        vm.serviceBlock = false;
                    }
                    else{
                        $window.location.reload(); //$state.reload();
                    }
                });
            }   
        });
    }

    vm.requestSchedule = function() {
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
                batteryService.requestSchedule().then(function(data){
                    if(data.success === "false"){
                        if(vm.mobile)
                            StatusBarService.clearStatus();
                        else
                            StatusBarService.showErrorStatus("typeEV");
                        vm.statusMsg = data.error;
                        vm.errorState = true;
                        vm.serviceBlock = false;
                    }
                    else{
                        $scope.eventCallservBlkChk();
                    }
                });
            }   
        });
    }

    vm.startCharging = function(){
        if(vm.serviceBlock == true)
            return;

        var targetPercentage = (vm.percRadio == true? 80: 100);
        var chargeInfo = {"chargeRatio":targetPercentage};
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
                batteryService.startCharge(chargeInfo).then(function(data){
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
    }

    vm.stopCharging = function(){
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
                batteryService.stopCharge().then(function(data){
                    if(data.success === "false"){
                        if(vm.mobile)
                            StatusBarService.clearStatus();
                        else
                            StatusBarService.showErrorStatus("typeEV");
                        vm.statusMsg = data.error;
                        vm.errorState = true;
                        vm.serviceBlock = false;
                    }
                    else{
                        $scope.eventCallservBlkChk();
                    }
                });
            }
        });
    }

    batteryService.getScheduledTimeStamp().then(function(data) {
        for(var i=0; i<data.listMyCarInfo.length; i++){
            if(data.listMyCarInfo[i].scheduledInfoTimeStamp != null){
                var schedule_time_stamp = new Date(0);
                var vehicle_time_stamp = new Date(0);
                schedule_time_stamp.setUTCSeconds(data.listMyCarInfo[i].scheduledInfoTimeStamp/1000);
                vehicle_time_stamp.setUTCSeconds(data.listMyCarInfo[i].vehicleStatusTimeStamp/1000);
                $scope.timeStamp = moment(schedule_time_stamp).format("MM/DD/YYYY hh:mm A");
                $scope.timeStampStatusBar = moment(vehicle_time_stamp).format("MMMM DD, YYYY hh:mm a");
            }
        }
    });

    function assignValues(data){
        /* Schedule I */
        var timeI = data.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.reservInfo.time.time;
        var timeSectionI = data.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.reservInfo.time.timeSection;
        var reserveChargeSetI = data.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.resvChargeSet;
        var chargeRatioI = data.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.chargeRatio;
        var daysI = data.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.reservInfo.day;
        
        $scope.daysI = data.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.reservInfo.day;

        vm.offI = !reserveChargeSetI;
        vm.percentChargeI = (chargeRatioI == 0? 80: 100);
        
        $scope.preScheHrI = (timeI.substring(0,2) == '00'? '12': timeI.substring(0,2));
        $scope.preScheMinI = timeI.substring(2);

        $scope.hourI = (timeI.substring(0,2) == '00'? '12': timeI.substring(0,2));
        $scope.minuteI = timeI.substring(2);
        $scope.timeSectionI = (timeSectionI == 0? "AM": "PM");
        $scope.timeSectionMiniI = (timeSectionI == 0? "a.m.": "p.m.");
        $scope.datesI = [];

        $scope.numberScheduleI = convertTimeToNumberOfMinutes(timeI,$scope.timeSectionI);

        $scope.selectedDateI = [false, false, false, false, false, false, false];
        vm.noReservI = false;
        for( var i=1; i<=$scope.selectedDateI.length; i++){
            for(var j=0; j<daysI.length; j++){
                if(daysI[j] != null){
                    if(daysI[j] == 9)
                        vm.noReservI = true;
                    else{
                        if(daysI[0] == "0"){
                            $scope.datesI[daysI.length-1] = vm.weekDate[6];
                            $scope.selectedDateI[6] = true;

                            if(daysI[j+1] == i){
                                $scope.datesI[j] = vm.weekDate[i-1];
                                $scope.selectedDateI[i-1] = true;   
                            }
                        }
                        if(daysI[0] != "0"){
                            if(daysI[0] == i){
                                $scope.datesI[0] = vm.weekDate[i-1];
                                $scope.selectedDateI[i-1] = true;
                            }                
                            if(daysI[j+1] == i){
                                $scope.datesI[j+1] = vm.weekDate[i-1];
                                $scope.selectedDateI[i-1] = true;   
                            }
                        }
                    }
                }
            }
        }

        vm.dateSelectedI = function(index){
            return $scope.selectedDateI[index];
        }

        vm.toggleDateSelectI = function(index){
            $scope.selectedDateI[index] = !$scope.selectedDateI[index];
        }
        /* End of Schedule I */

        /* Schedule II */
        var timeII = data.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.reservInfo.time.time;
        var timeSectionII = data.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.reservInfo.time.timeSection;
        var reserveChargeSetII = data.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.resvChargeSet;
        var chargeRatioII = data.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.chargeRatio;
        var daysII = data.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.reservInfo.day;

        $scope.daysII = data.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.reservInfo.day;

        vm.offII = !reserveChargeSetII;
        vm.percentChargeII = (chargeRatioII == 0? 80: 100);

        $scope.preScheHrII = (timeII.substring(0,2) == '00'? '12': timeII.substring(0,2));
        $scope.preScheMinII = timeII.substring(2);
        
        $scope.hourII = (timeII.substring(0,2) == '00'? '12': timeII.substring(0,2));
        $scope.minuteII = timeII.substring(2);
        $scope.timeSectionII = (timeSectionII == 0? "AM": "PM");
        $scope.timeSectionMiniII = (timeSectionII == 0? "a.m.": "p.m.");
        $scope.datesII = [];

        $scope.numberScheduleII = convertTimeToNumberOfMinutes(timeII,$scope.timeSectionII);

        $scope.selectedDateII = [false, false, false, false, false, false, false];
        vm.noReservII = false;
        for( var i=1; i<=$scope.selectedDateII.length; i++){
            for(var j=0; j<daysII.length; j++){
                if(daysII[j] != null){
                    if(daysII[j] == 9)
                        vm.noReservII = true;
                    else{
                        if(daysII[0] == "0"){
                            $scope.datesII[daysII.length-1] = vm.weekDate[6];
                            $scope.selectedDateII[6] = true;

                            if(daysII[j+1] == i){
                                $scope.datesII[j] = vm.weekDate[i-1];
                                $scope.selectedDateII[i-1] = true;   
                            }
                        }
                        if(daysII[0] != "0"){
                            if(daysII[0] == i){
                                $scope.datesII[0] = vm.weekDate[i-1];
                                $scope.selectedDateII[i-1] = true;
                            }                
                            if(daysII[j+1] == i){
                                $scope.datesII[j+1] = vm.weekDate[i-1];
                                $scope.selectedDateII[i-1] = true;   
                            }
                        }
                    }
                }
            }
        }

        vm.dateSelectedII = function(index){
            return $scope.selectedDateII[index];
        }

        vm.toggleDateSelectII = function(index){
            $scope.selectedDateII[index] = !$scope.selectedDateII[index];
        }
        /* End of Schedule II */
    }
    
    function defaultStatus(){
    	    vm.chargeLevel1 = "--";
    	    vm.chargeLevel2 = "--";
    	    $scope.batteryImage = "battery-unplugged.png";
    	    $scope.batteryChargeStatus = "NOT PLUGGED IN";
    	    vm.chargeBtn = 'disable';

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
    batteryService.getScheduledInfo().then(function(data) {
        if(data === null || angular.isUndefined(data) || data.error === "Internal Server Error" || data.error === "Internal Error!"){
          var dataInfo = {"reservInfos":{"reservChargeInfo":[{"chargeIndex":0,"reservChargeInfoDetail":{"chargeRatio":100,"reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}},"reservType":1,"resvChargeSet":false}},{"chargeIndex":1,"reservChargeInfoDetail":{"chargeRatio":80,"reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}},"reservType":1,"resvChargeSet":false}}],"reservHvacInfo":[{"climateIndex":"0","reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"12"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}}}},{"climateIndex":"1","reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"12"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}}}}]}};
          assignValues(dataInfo);
        }
        else
          assignValues(data);    
    });

    ConnectInfoService.getTripInfo().then(function(data) {
        if(angular.isUndefined(data.eVStatus)){
        	defaultStatus();
        } else {
            vm.batteryCharge = data.eVStatus.batteryCharge;
            vm.batteryStatus = data.eVStatus.batteryStatus;
            $scope.vmStatus = data.eVStatus.batteryStatus;
            vm.distanceUnitType = "miles";
            vm.batteryPlugin = data.eVStatus.batteryPlugin;
            vm.drvDistance = data.eVStatus.drvDistance[0].distanceType.value;
            $scope.knobData = [{
                value: vm.drvDistance,
                options: {
                    fgColor: vm.drvDistance >= 20?'#7bb609':'#BB1628',
                    angleOffset: -125,
                    angleArc: 250,
                    readOnly:true
                }
            }];

            if(data.eVStatus.remainTime[0] == null || data.eVStatus.remainTime[0].value == 0)
                vm.chargeLevel1 = "--";
            else
                vm.chargeLevel1 = chargeEstimate(data.eVStatus.remainTime[0].value);

            if(data.eVStatus.remainTime[1] == null || data.eVStatus.remainTime[1].value == 0)
                vm.chargeLevel2 = "--";
            else
                vm.chargeLevel2 = chargeEstimate(data.eVStatus.remainTime[1].value);

            if (vm.batteryCharge == false){
                if(vm.batteryPlugin == 0){
                    $scope.batteryImage = "battery-unplugged.png";
                    $scope.batteryChargeStatus = "NOT PLUGGED IN";
                    vm.chargeBtn = 'disable';
                } else {
                    $scope.batteryImage = "battery-plugged.png";
                    $scope.batteryChargeStatus = "PLUGGED IN";
                    vm.chargeBtn = 'start';
                }
            }

            if (vm.batteryCharge == true){
                $scope.batteryImage = "battery-charging.png";
                $scope.batteryChargeStatus = "CURRENTLY CHARGING";
                vm.chargeBtn = 'stop';
            }
        }
    });

    function chargeEstimate(value){
        return (Math.floor(value/60) + " hr " + value%60 +" mins")
    }

    vm.toggleSchedule = function(schedule){
        if (schedule == "scheduleI"){
            vm.displayScheduleI = !vm.displayScheduleI;
            vm.upI = !vm.upI;
        }

        if (schedule == "scheduleII"){
            vm.displayScheduleII = !vm.displayScheduleII;
            vm.upII = !vm.upII;
        }
    }

    vm.togglePercRadio = function(){
        vm.percRadio = !vm.percRadio;
    }

    /* Schedule I */
    vm.toggleOnOffI = function(){
        if(vm.upI)
            vm.offI = !vm.offI;
    }

    vm.toggleShowHourI = function(){
        vm.displayHourI = !vm.displayHourI;
        if(vm.displayHourI){
            vm.displayMinuteI = false;
            vm.displaySectionI = false;
        }
    }

    vm.toggleShowMinuteI = function(){
        vm.displayMinuteI = !vm.displayMinuteI;
        if(vm.displayMinuteI){
            vm.displayHourI = false;
            vm.displaySectionI = false;
        }
    }

    vm.toggleShowSectionI = function(){
        vm.displaySectionI = !vm.displaySectionI;
        if(vm.displaySectionI){
            vm.displayHourI = false;
            vm.displayMinuteI = false;
        }
    }

    vm.newHourI = function(index){
        $scope.hourI = vm.hourList[index];
        vm.displayHourI = false;
    }

    vm.newMinuteI = function(index){
        $scope.minuteI = vm.minuteList[index];
        vm.displayMinuteI = false;
    }

    vm.newSecI = function(index){
        $scope.timeSectionI = vm.secList[index];
        vm.displaySectionI = false;
    }

    vm.newScheTimeI = function(){
        return $scope.hourI + $scope.minuteI;
    }

    vm.newScheDaysI = function(){
        var newDays = [];
        for(var i = 0; i < $scope.selectedDateI.length; i++){
            if( $scope.selectedDateI[i] ){
                if(i == 6)
                    newDays.unshift(0);
                else
                    newDays.push(i+1);
            }
        }
        return newDays;
    }

    vm.validSchedule = function(oldTime, newTime, oldDay, newDay){
        var result = true,
            days = ['SUN, ','MON, ','TUE, ','WED, ','THU, ','FRI, ','SAT, '],
            conflictDay=[],
            conflictDayFlags= [false,false,false,false,false,false,false];

        for(var i in oldDay){
            for(var j in newDay){
                //Schedule in the same day
                if(parseInt(oldDay[i]) == newDay[j] && oldDay[i] != undefined){
                    if (Math.abs(newTime - oldTime) < 20) {
                        if (!conflictDayFlags[j]) {
                            var c = newDay[j];                          
                            conflictDay.push(days[c]);
                            conflictDayFlags[j] = true;
                        }
                        result = false;
                    }
                }
                
                //New schedule days ahead current scheduled days
                if(newDay[j] - parseInt(oldDay[i]) == 1 || newDay[j] - parseInt(oldDay[i]) == -6){
                    if (newTime < oldTime) {
                        if ((1440 + newTime - oldTime) < 20) {
                            if (!conflictDayFlags[j]) {
                                var c = newDay[j];                          
                                conflictDay.push(days[c]);
                                conflictDayFlags[j] = true;
                            }
                            result = false;
                        } 
                    }
                }
                
                //New schedule days after current scheduled days
                if(parseInt(oldDay[i]) - newDay[j] == 1 || parseInt(oldDay[i]) - newDay[j] == -6){
                    if (oldTime < newTime) {
                        if ((1440 + oldTime - newTime) < 20) {
                            if (!conflictDayFlags[j]) {
                                var c = newDay[j];                          
                                conflictDay.push(days[c]);
                                conflictDayFlags[j] = true;
                            }
                            result = false;
                        }
                    }
                }
            }
        }                           
        
        vm.errorSchMsg = conflictDay.join("") + " currently not available at the selected time. Please allow at least 20 minutes between scheduled requests.";
        
        return result;
    }

    function convertTimeToNumberOfMinutes(time, timeSection){
        var hourConvert = time.substring(0,2) == 12? 0: time.substring(0,2);
        var numOfMin;
        if(timeSection == 'AM')
            numOfMin = 60*parseInt(hourConvert) + parseInt(time.substring(2));
        else
            numOfMin = 60*(parseInt(hourConvert)+12) + parseInt(time.substring(2));
        return numOfMin;
    }

    vm.addScheI = function(){
        if(vm.serviceBlock == true)
            return;
        if(vm.newScheDaysI().length == 0){
            vm.errorScheduleI = true;
            vm.errorSchMsg = "Please select day(s) to schedule.";
            return;
        }
        if(!vm.validSchedule($scope.numberScheduleII, convertTimeToNumberOfMinutes(vm.newScheTimeI(),$scope.timeSectionI), $scope.daysII, vm.newScheDaysI())){
            vm.errorScheduleI = true;
            return;
        }

        vm.errorScheduleI = false;
        vm.errorSchMsg = "";

        var newScheInfo = {"chargeIndex" : 0, "reservChargeInfoDetail" : { "chargeRatio" : vm.percentChargeI, "reservInfo" : { "day" : vm.newScheDaysI(), "time" : { "time" : vm.newScheTimeI(), "timeSection" : ($scope.timeSectionI == 'AM'? 0: 1) }}, "reservType" : 1, "resvChargeSet" : !vm.offI}};
        
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
                batteryService.postSche(newScheInfo).then(function(data){
                    if(data.data.success == "false"){
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
    }
    /* End of Schedule I */

    /* Schedule II */
    vm.toggleOnOffII = function(){
        if(vm.upII)
            vm.offII = !vm.offII;
    }

    vm.toggleShowHourII = function(){
        vm.displayHourII = !vm.displayHourII;
        if(vm.displayHourII){
            vm.displayMinuteII = false;
            vm.displaySectionII = false;
        }
    }

    vm.toggleShowMinuteII = function(){
        vm.displayMinuteII = !vm.displayMinuteII;
        if(vm.displayMinuteII){
            vm.displayHourII = false;
            vm.displaySectionII = false;
        }
    }

    vm.toggleShowSectionII = function(){
        vm.displaySectionII = !vm.displaySectionII;
        if(vm.displaySectionII){
            vm.displayHourII = false;
            vm.displayMinuteII = false;
        }
    }

    vm.newHourII = function(index){
        $scope.hourII = vm.hourList[index];
        vm.displayHourII = false;
    }

    vm.newMinuteII = function(index){
        $scope.minuteII = vm.minuteList[index];
        vm.displayMinuteII = false;
    }

    vm.newSecII = function(index){
        $scope.timeSectionII = vm.secList[index];
        vm.displaySectionII = false;
    }

    vm.newScheTimeII = function(){
        return $scope.hourII + $scope.minuteII;
    }

    vm.newScheDaysII = function(){
        var newDays = [];
        for(var i = 0; i < $scope.selectedDateII.length; i++){
            if( $scope.selectedDateII[i] ){
                if(i == 6)
                    newDays.unshift(0);
                else
                    newDays.push(i+1);
            }
        }
        return newDays;
    }

    vm.addScheII = function(){
        if(vm.serviceBlock == true)
            return;

        if(vm.newScheDaysII().length == 0){
            vm.errorScheduleII = true;
            vm.errorSchMsg = "Please select day(s) to schedule.";
            return;
        }
        if(!vm.validSchedule($scope.numberScheduleI, convertTimeToNumberOfMinutes(vm.newScheTimeII(),$scope.timeSectionII), $scope.daysI, vm.newScheDaysII())){
            vm.errorScheduleII = true;
            return;
        }

        vm.errorScheduleII = false;
        vm.errorSchMsg = "";

        var newScheInfo = {"chargeIndex" : 1, "reservChargeInfoDetail" : { "chargeRatio" : vm.percentChargeII, "reservInfo" : { "day" : vm.newScheDaysII(), "time" : { "time" : vm.newScheTimeII(), "timeSection" : ($scope.timeSectionII == 'AM'? 0: 1) }}, "reservType" : 1, "resvChargeSet" : !vm.offII}};

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
                batteryService.postSche(newScheInfo).then(function(data){
                    if(data.data.success == "false"){
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
    }
    /* End of Schedule II */

    vm.reload = function(){
        $window.location.reload(); //$state.reload();
    }

    $anchorScroll(0);
};
