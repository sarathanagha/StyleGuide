'use strict';

module.exports = /*@ngInject*/ function($anchorScroll, $scope, $rootScope, $state, $modal, CarInfoService, VehicleStatusService, climateEvService, doorstatusService, StatusBarService, ConnectInfoService, $interval, $timeout, $window) {
  var vm = this;
  vm.wkDate = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  vm.hrList = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  vm.minList = ['50','40','30','20','10','00'];
  vm.secList = ['AM','PM'];
  vm.statusMsg = "";
  vm.errorScheduleI = false;
  vm.errorScheduleII = false;
  vm.errorSchMsg = "";
  vm.defrostStatus = 'disabled';
  vm.colorpicker=[];
  vm.setTemp = 62;
//-----------------------------DIAL KNOB---------------------------
  var climateDialModule = {
      utils:{
        calcArrayPts:function(ticks,ratio) {
            var arrayPts = [];  
            for (var i = 0; i < ticks; i++){
              arrayPts.push(i*(ratio/ticks));
            }
            arrayPts.push(ratio);
            return arrayPts;
        }               
      },
      init:function(selector) {
        $(selector).css('position','relative');  

          // Dial properties
          var paper = Raphael($(selector)[0],360,360),
              enabled = true,
              path = paper.path(Raphael.transformPath("M 30 180 a150,150 0 1,0 150,-150",'r225')).attr( 'stroke-width', 16 ).attr( 'stroke', 'rgb(68,139,202)' ),
              ticks = (vm.tempPref == 1) ? 28 : 30,  // ticks = 28, 

              // length and lengthOffsets
              len = path.getTotalLength(),                    
              startLen = 58,
              endLen = len - startLen,
              totLen = endLen - startLen,
              
              // ratio of offset length to length of original path
              ratio = parseFloat(totLen/len)*0.75,
              ratio100 = ratio*100,
              
              // bounds and mid point
              bb = path.getBBox(),                                
              mid = {x: bb.x+bb.width/2, y: bb.y+bb.width/2},
              
              // coords of current, start, and end positions
              pal = path.getPointAtLength(endLen),
              palStart = path.getPointAtLength(startLen),
              
              rPath, rPathString,
              knob = paper.image('/../images/kh/img/remote/odo-button.png',0,0,68,68),
              knobX = 0,
              knobY = 0,
              knobA = 0,
              // shim is an invisible boundry for the knob. This is the actual object being dragged, in which its angle determines the
              // knob position.
              shimDiv = ($('html').hasClass('lt-ie9')) ? '<div>' : '<div style="background:white; opacity:0">';
              var $shim = $(shimDiv).css({position:'absolute', width:68, height:68}).appendTo($(selector)),

              degreeOffset = Raphael.angle(palStart.x,palStart.y,mid.x,mid.y),
              
              // events
              dragEnabled = true,
              onDragFn = function(val){},
              onStopFn = function(){},
              onClickFn = function(){}
              ;
                  
          // Temp / tick mapping 29 ticks
          var tempFMap = ["20","1E","1D","1C","1B",
                  "1A","19","18","17","16",
                  "15","14","13","12","11",
                  "10","0F","0E","0D","0C",
                  "0B","0A","09","08","07",
                  "06","05","04","02"];
              
          var degFMap = [90,89,88,87,86,
                  85,84,83,82,81,
                  80,79,78,77,76,
                  75,74,73,72,71,
                  70,69,68,67,66,
                  65,64,63,62];

          var tempCMap = ["20","1F","1E","1D","1C","1B",
                  "1A","19","18","17","16",
                  "15","14","13","12","11",
                  "10","0F","0E","0D","0C",
                  "0B","0A","09","08","07",
                  "06","05","04","03","02"];
                   
          var degCMap = [32,31.5,31,30.5,30,29.5,
                         29,28.5,28,27.5,27,
                         26.5,26,25.5,25,24.5,
                         24,23.5,23,22.5,22,
                         21.5,21,20.5,20,19.5,
                         19,18.5,18,17.5,17];
                   
          var tempMap = (vm.tempPref == 1) ? tempFMap : tempCMap,
            degMap = (vm.tempPref == 1) ? degFMap : degCMap;                             
              
          // Calculate percentage of 
          var arrayPts = [];  
          for (var i = 0; i < ticks; i++) {
            arrayPts.push(i*(ratio/ticks));
          }
          arrayPts.push(ratio);

          var currentPos = arrayPts.length - 1;   

          moveKnob(pal.x,pal.y,pal.alpha,path.getSubpath(len-1,len));             
              
          $shim.css({ left: pal.x-34, top: pal.y-34});
          $shim.draggable({
              drag: function ( e, ui ) {
                  var deg = Raphael.angle(ui.position.left+34, ui.position.top+34, mid.x,mid.y  );
                  var t = (deg <=degreeOffset ) ? (degreeOffset - deg) / 360.0 : (360.0 - deg + degreeOffset) / 360;

                  // // Using t, find a point along the path
                  if (t >= 0 && t <=ratio) {
                      var tt = t;
                      for (var i = 0; i < arrayPts.length; i++) {
                        if (arrayPts[i] > t) {
                            if (t > arrayPts[i-1] && t < arrayPts[i-1] + ((ratio/ticks)/2)) { 
                              tt = arrayPts[i-1]; currentPos = i -1; break;
                            } else { 
                                tt = arrayPts[i]; currentPos = i;  break;
                            }
                        }                   
                      }

                      calcKnobPosition(tt);
                      vm.knobvalue=parseInt(tempMap[currentPos],16);
                    
                      $scope.$apply(function(){
                        vm.setTemp=tempFromHex4Dial(vm.knobvalue, vm.tempPref);
                        vm.decimalC = vm.setTemp.toString().length > 2? true: false;
            vm.setTempDecimal = vm.setTemp - .5;
                    });

                      /*onDragFn(parseInt(tempMap[currentPos],16));*/
                  }
            },
            stop : function ( e, ui ) {
                      $shim.css({ left: pal.x-34, top: pal.y-34 });
                        if (enabled) onStopFn();
                      }
            });

    function calcKnobPosition(pointRatio) {
        var l = (((pointRatio*100)/ratio100) * totLen) + startLen;
        pal = path.getPointAtLength(l);

          // Move the knob to the new point
          moveKnob(pal.x,pal.y,pal.alpha,(l==len)? path.getSubpath(len-1,len): path.getSubpath(l,len));
          return pal;
      }

      function moveKnob(x,y,angle,pth) {
        var deg = angle+220; // degree of the face of knob
        if (x > mid.x && y > mid.y) deg = deg + 180;        

        if(rPath) rPath.remove();       
        rPath = paper.path(pth).attr( 'stroke-width', 16 ).attr( 'stroke', (enabled) ? 'rgb(187,22,40)': 'rgb(119,119,119' );
          rPathString = pth;
          rPath.click(function(e){pathClicked(e);});

          knobX = x; knobY = y; knobA = angle;
          knob.transform('t' + [x-34,y-34] + 'r' + deg);  
          knob.toFront();
      }

      function pathClicked(e) {
          if (dragEnabled) {
              var deg = Raphael.angle(e.offsetX, e.offsetY, mid.x,mid.y  );
              var t = (deg <=degreeOffset ) ? (degreeOffset - deg) / 360.0 : (360.0 - deg + degreeOffset) / 360;
              var tHalf = (1.0 - ratio)/2.0;
              var tHalfHalf = tHalf/2.0;
              // Using t, find a point along the path
              var knobPosition = 0;
              if (t >= 0 && t <=ratio) {
                  var tt = t;
                  for (var i = 0; i < arrayPts.length; i++) {
                      if (arrayPts[i] > t) {
                          if (t > arrayPts[i-1] && t < arrayPts[i-1] + ((ratio/ticks)/2)) { tt = arrayPts[i-1]; currentPos = i -1; break; }
                          else { tt = arrayPts[i]; currentPos = i;  break; }
                      }                   
                  }

                  knobPosition = tt;                          
              } else if (t > ratio && t < (tHalf + ratio) ) {
                  if (t <= ratio + tHalfHalf) {
                      knobPosition = ratio;
                      currentPos = arrayPts.length - 1;
                  } else {
                      knobPosition = arrayPts[arrayPts.length - 2];
                      currentPos = arrayPts.length - 2;
                  }
              } else {
                  if (t <= tHalfHalf) {
                      knobPosition = arrayPts[1];
                      currentPos = 1;
                  } else {
                      knobPosition = 0;
                      currentPos = 0;
                  }
              }
                          
              var pt = calcKnobPosition(knobPosition); 
              $shim.css({ left: pt.x-34, top: pt.y-34 });
              //onDragFn(parseInt(tempMap[currentPos],16));
              vm.knobvalue=parseInt(tempMap[currentPos],16);

              $scope.$apply(function(){
                vm.setTemp=tempFromHex4Dial(vm.knobvalue, vm.tempPref);
                vm.decimalC = vm.setTemp.toString().length > 2? true: false;
          vm.setTempDecimal = vm.setTemp - .5;
              });

              onClickFn();
          }
      }

      function enable(toggle) {
          if (!toggle) {
            enabled = false;
            if (path) path.remove();
            path = paper.path(Raphael.transformPath("M 30 180 a150,150 0 1,0 150,-150",'r225')).attr( 'stroke-width', 16 ).attr( 'stroke', 'rgb(119,119,119)' );                       
            path.click(function(e) { pathClicked(e); });
          
            knob.remove();
            knob = paper.image('images/kh/img/remote/odo-button-grey.png',0,0,68,68);
            moveKnob(knobX,knobY,knobA,rPathString);
          } else {
            enabled = true;
            if (path) path.remove();
            path = paper.path(Raphael.transformPath("M 30 180 a150,150 0 1,0 150,-150",'r225')).attr( 'stroke-width', 16 ).attr( 'stroke', 'rgb(68,139,202)' );
            path.click(function(e) { pathClicked(e); });
          
            knob.remove();
            knob = paper.image('images/kh/img/remote/odo-button.png',0,0,68,68);
            moveKnob(knobX,knobY,knobA,rPathString);
          }
      }

      function tickFromDegree(deg) {
          for (var i = 0; i < degMap.length; i++) {
            if (degMap[i] == deg.toString()) {
                currentPos = i;

                var pt = calcKnobPosition(arrayPts[currentPos]);
                $shim.css({ left: pt.x-34, top: pt.y-34 });
            } 
          }
      }

      function tickUp() {
          if (currentPos > 0) {
            currentPos--;

            var pt = calcKnobPosition(arrayPts[currentPos]);
            $shim.css({ left: pt.x-34, top: pt.y-34 });
          }
      }

      function tickDown() {
          if (currentPos < arrayPts.length - 1) {         
            currentPos++;

            var pt = calcKnobPosition(arrayPts[currentPos]);
            $shim.css({ left: pt.x-34, top: pt.y-34 });
          }
      }

      function setOnDragCallback(temp) {
      };

    // public funcs
    return {
        tickFromDegree : function (deg) { tickFromDegree(deg); },
        tickUp : function () { tickUp(); },
        tickDown : function() { tickDown(); },
        enable : function (toggle) { enable(toggle); },
        setOnDragCallback : function(fn) { onDragFn = fn; },
        setOnStopCallback : function(fn) { onStopFn = fn; },
        setOnClickCallback : function(fn) { onClickFn = fn; },
        enableDrag : function(enable) { dragEnabled = enable; },
        getCurrentHex : function() { return tempMap[currentPos]; }
    };
    }
};
  var hexToTemp = {
        "F" : {"--" : "--", "01" : 62, "02" : 62, "03" : 62, "04" : 63, "05" : 64, "06" : 65, "07" : 66, "08" : 67, "09" : 68, "0A" : 69, "0B" : 70, "0C" : 71, "0D" : 72, "0E" : 73, "0F" : 74, "10" : 75, "11" : 76, "12" : 77, "13" : 78, "14" : 79, "15" : 80, "16" : 81, "17" : 82, "18" : 83, "19" : 84, "1A" : 85, "1B" : 86, "1C" : 87, "1D" : 88, "1E" : 89, "1F" : 89, "20" : 90},
        "C" : {"--" : "--", "01" : 17, "02" : 17, "03" : 17.5 , "04" : 18, "05" : 18.5, "06" : 19, "07" : 19.5, "08" : 20, "09" : 20.5, "0A" : 21, "0B" : 21.5, "0C" : 22, "0D" : 22.5, "0E" : 23, "0F" : 23.5, "10" : 24, "11" : 24.5, "12" : 25, "13" : 25.5, "14" : 26, "15" : 26.5, "16" : 27, "17" : 27.5, "18" : 28, "19" : 28.5, "1A" : 29, "1B" : 29.5, "1C" : 30, "1D" : 30.5, "1E" : 31, "1F" : 31.5, "20" : 32}
    };

    function toHexString(num){
      return num > 15 ? num.toString(16) : "0" + num.toString(16);
  }

  function tempFromHex4Dial(hexTemp, tempPref){
      var tempUnits = (tempPref == 1? "F": "C");
      var hexToTemp = {
        "F" : {"--" : "--", "01" : "--", "02" : '62', "03" : 63, "04" : 63, "05" : 64, "06" : 65, "07" : 66, "08" : 67, "09" : 68, "0A" : 69, "0B" : 70, "0C" : 71, "0D" : 72, "0E" : 73, "0F" : 74, "10" : 75, "11" : 76, "12" : 77, "13" : 78, "14" : 79, "15" : 80, "16" : 81, "17" : 82, "18" : 83, "19" : 84, "1A" : 85, "1B" : 86, "1C" : 87, "1D" : 88, "1E" : 89, "1F" : 89, "20" : 90},
        "C" : {"--" : "--", "01" : "--", "02" : 17, "03" : 17.5, "04" : 18, "05" : 18.5, "06" : 19, "07" : 19.5, "08" : 20, "09" : 20.5, "0A" : 21, "0B" : 21.5, "0C" : 22, "0D" : 22.5, "0E" : 23, "0F" : 23.5, "10" : 24, "11" : 24.5, "12" : 25, "13" : 25.5, "14" : 26, "15" : 26.5, "16" : 27, "17" : 27.5, "18" : 28, "19" : 28.5, "1A" : 29, "1B" : 29.5, "1C" : 30, "1D" : 30.5, "1E" : 31, "1F" : 31.5, "20" : 32}
      };

      if (hexTemp && typeof hexTemp === 'number') {
        hexTemp = toHexString(hexTemp);
      }
      return hexToTemp[tempUnits][(hexTemp.toUpperCase() || "--")];
  }

    var tempCtoHex = {"17":"02", "17.5":"03", "18":"04", "18.5":"05", "19":"06", "19.5":"07", "20":"08", "20.5":"09", "21":"0A", "21.5":"0B", "22":"0C", "22.5":"0D", "23":"0E", "23.5":"0F", "24":"10", "24.5":"11", "25":"12", "25.5":"13", "26":"14", "26.5":"15", "27":"16", "27.5":"17", "28":"18", "28.5":"19", "29":"1A", "29.5":"1B", "30":"1C", "30.5":"1D", "31":"1E", "31.5":"1F", "32":"20"};

    vm.errorState = false;
    vm.mobile = false;
    if($(window).width() < 768){
        vm.mobile = true;
    }

    var serviceCall;
    var serviceCallEvent;    
    
    var climateStatus = new climateDialModule.init('.dial');
    climateStatus.enable(true);

    //-----------------------------END DIAL KNOB---------------------------

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

    $scope.eventCallServBlkChk = function(){ //Events call service block check
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
                climateEvService.requestSchedule().then(function(data){
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
                        $scope.eventCallServBlkChk();
                    }
                });
            }   
        }); 
    }

    function convertToBoolean(val){
    if(val == "false") return false;
    if(val == "true") return true;
  }

    //This function just convert temp F to Hex. Need one to convert temp C to Hex.
    var tempToHex = function(temp){
      var hexTemp = (temp - 59).toString(16);
      if(temp == 62) hexTemp = "2";
      if(temp == 90) hexTemp = "20";
      return hexTemp.length == 1? "0" + hexTemp: hexTemp;
  };

    ConnectInfoService.getTripInfo().then(function(data) {
      if(angular.isUndefined(data.eVStatus)){
        vm.tempPref = 1; //0 is C, 1 is F
        vm.airTemp = "--";
        vm.airCtrlOn = convertToBoolean("false");
        vm.defrostStatus = 'disabled';
      } else {
        vm.tempPref = data.userTempPref; //0 is C, 1 is F
        vm.airTemp = data.airTemp.value.hexValue;
        vm.airCtrlOn = convertToBoolean(data.airCtrlOn);

        if(data.eVStatus.batteryPlugin == 0)
          vm.defrostStatus = 'disabled';
        else{
          if(data.defrost == 'false'){
            vm.defrostStatus = 'stopped';
            vm.defrostStatusMobile = 'stopped';
          }
          else{
            vm.defrostStatus = 'started';
            vm.defrostStatusMobile = 'started';
          }
        }
      }  
    });

    ConnectInfoService.getTempInfo().then(function(data) {
      if(data == null)
        vm.outTemp == data;
      else{
        vm.outTemp = Math.ceil(data);
        vm.outTemp = (vm.tempPref == 0? hexToTemp['C'][tempToHex(vm.outTemp).toUpperCase() || "--"]: vm.outTemp);
        vm.outTemp = (vm.tempPref == 0? Math.round(vm.outTemp): vm.outTemp);
      }
    });

  climateEvService.getScheduledTimeStamp().then(function(data) {
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
    var tempI = tempFromHex(data.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.airTemp.value.hexValue, vm.tempPref);
    var timeI = data.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.reservInfo.time.time;
    var timeSectionI = data.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.reservInfo.time.timeSection;
    var climateSetI = convertToBoolean(data.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.climateSet);
    var defrostI = convertToBoolean(data.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.defrost);
    var daysI = data.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.reservInfo.day;

    $scope.daysI = data.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.reservInfo.day;

    vm.offI = !climateSetI;
    
    $scope.preScheHrI = (timeI.substring(0,2) == '00'? '12': timeI.substring(0,2));
    $scope.preScheMinI = timeI.substring(2);

    $scope.hourI = (timeI.substring(0,2) == '00'? '12': timeI.substring(0,2));
    $scope.minuteI = timeI.substring(2);
    $scope.sectionI = (timeSectionI == 0? "AM": "PM");
    $scope.sectionMiniI = (timeSectionI == 0? "a.m.": "p.m.");
    $scope.defrosOffI = !defrostI;
    $scope.datesI = [];

    $scope.numberScheduleI = convertTimeToNumberOfMinutes(timeI,$scope.sectionI);

    $scope.selectedDateI = [false, false, false, false, false, false, false];
    vm.noReservI = false;
    for( var i=1; i<=$scope.selectedDateI.length; i++){
      for(var j=0; j<daysI.length; j++){
        if(daysI[j] != null){
                    if(daysI[j] == 9)
                        vm.noReservI = true;
                    else{
            if(daysI[0] == "0"){
                    $scope.datesI[daysI.length-1] = vm.wkDate[6];
                    $scope.selectedDateI[6] = true;

                    if(daysI[j+1] == i){
                        $scope.datesI[j] = vm.wkDate[i-1];
                        $scope.selectedDateI[i-1] = true;   
                    }
                }
                if(daysI[0] != "0"){
                    if(daysI[0] == i){
                        $scope.datesI[0] = vm.wkDate[i-1];
                        $scope.selectedDateI[i-1] = true;
                    }                
                    if(daysI[j+1] == i){
                        $scope.datesI[j+1] = vm.wkDate[i-1];
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
    var tempII = tempFromHex(data.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.airTemp.value.hexValue, vm.tempPref);
    var timeII = data.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.reservInfo.time.time;
    var timeSectionII = data.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.reservInfo.time.timeSection;
    var climateSetII = convertToBoolean(data.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.climateSet);
    var defrostII = convertToBoolean(data.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.defrost);
    var daysII = data.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.reservInfo.day;

    $scope.daysII = data.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.reservInfo.day;

    vm.offII = !climateSetII;

    $scope.preScheHrII = (timeII.substring(0,2) == '00'? '12': timeII.substring(0,2));
    $scope.preScheMinII = timeII.substring(2);
    
    $scope.hourII = (timeII.substring(0,2) == '00'? '12': timeII.substring(0,2));
    $scope.minuteII = timeII.substring(2);
    $scope.sectionII = (timeSectionII == 0? "AM": "PM");
    $scope.sectionMiniII = (timeSectionII == 0? "a.m.": "p.m.");
    $scope.defrosOffII = !defrostII;
    $scope.datesII = [];

    $scope.numberScheduleII = convertTimeToNumberOfMinutes(timeII,$scope.sectionII);

    $scope.selectedDateII = [false, false, false, false, false, false, false];
    vm.noReservII = false;
    for( var i=1; i<=$scope.selectedDateII.length; i++){
      for(var j=0; j<daysII.length; j++){
        if(daysII[j] != null){
                    if(daysII[j] == 9)
                        vm.noReservII = true;
                    else{
            if(daysII[0] == "0"){
                    $scope.datesII[daysII.length-1] = vm.wkDate[6];
                    $scope.selectedDateII[6] = true;

                    if(daysII[j+1] == i){
                        $scope.datesII[j] = vm.wkDate[i-1];
                        $scope.selectedDateII[i-1] = true;   
                    }
                }
                if(daysII[0] != "0"){
                    if(daysII[0] == i){
                        $scope.datesII[0] = vm.wkDate[i-1];
                        $scope.selectedDateII[i-1] = true;
                    }                
                    if(daysII[j+1] == i){
                        $scope.datesII[j+1] = vm.wkDate[i-1];
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

    function tempFromHex(hexTemp, tempPref){
      var tempUnit = (tempPref == 0? 'C': 'F');

      if(angular.isUndefined(hexTemp))
        hexTemp = "02";

      return hexToTemp[tempUnit][hexTemp.toUpperCase()];
    };

    /* Sliders */
    vm.minVal = vm.tempPref == 1? 62: 17;
    vm.maxVal = vm.tempPref == 1? 90: 32;
    vm.step = vm.tempPref == 1? 1: 0.5;

    vm.colorpicker[1] = {
      red: tempI,
      options: {
        orientation: 'horizontal',
        min: vm.minVal,
        max: vm.maxVal,
        step: vm.step,
        range: 'min'
      }
    };

    vm.colorpicker[2] = {
      red: tempII,
      options: {
        orientation: 'horizontal',
        min: vm.minVal,
        max: vm.maxVal,
        step: vm.step,
        range: 'min'
      }
    };

    vm.setTemp = tempFromHex(vm.airTemp,vm.tempPref);
    
    vm.decimalC = vm.setTemp.toString().length > 2? true: false;
    vm.setTempDecimal = vm.setTemp - .5;

    vm.toggleTemp = function(temp){
      if((vm.tempPref == 1 && temp == 'F') || (vm.tempPref == 0 && temp == 'C')){
        return;
      }
      else{
        if(temp == 'F') vm.tempPref = 1;
        if(temp == 'C') vm.tempPref = 0;

        climateEvService.setTempUnit(vm.tempPref).then(function(data){  
          if(angular.isUndefined(data) || data.success == false){
            var modalInstance = $modal.open({
              templateUrl: 'views/components/climate/templates/update-temp-alert-modal.html',
              windowClass: 'show-pin-modal'
            });

            //Unable to update, reset to previous value.
            if(temp == 'F') vm.tempPref = 0;
            if(temp == 'C') vm.tempPref = 1;
          } else $window.location.reload(); //$state.reload();
        });
      } 
    }
  }

  climateEvService.getScheduledInfo().then(function(data) {
    if(data === null || angular.isUndefined(data) || data.error === "Internal Server Error" || data.error === "Internal Error!"){
      var dataInfo = {"reservInfos":{"reservChargeInfo":[{"chargeIndex":0,"reservChargeInfoDetail":{"chargeRatio":100,"reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}},"reservType":1,"resvChargeSet":false}},{"chargeIndex":1,"reservChargeInfoDetail":{"chargeRatio":80,"reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}},"reservType":1,"resvChargeSet":false}}],"reservHvacInfo":[{"climateIndex":"0","reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"12"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}}}},{"climateIndex":"1","reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"12"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}}}}]}};
      assignValues(dataInfo);
    }
    else
      assignValues(data);  
  });

  vm.decreTemp = function(){
    if (vm.tempPref == 1){
      if(vm.setTemp > 62)
        vm.setTemp--;
    }

    if (vm.tempPref == 0){
      if(vm.setTemp > 17)
        vm.setTemp = vm.setTemp - .5;
    }

    vm.decimalC = vm.setTemp.toString().length > 2? true: false;
    vm.setTempDecimal = vm.setTemp - .5;
    climateStatus.tickDown(); 
  }

  vm.increTemp = function(){
    if (vm.tempPref == 1){
      if(vm.setTemp < 90)
        vm.setTemp++;
    }

    if (vm.tempPref == 0){
      if(vm.setTemp < 32)
        vm.setTemp = vm.setTemp + .5;
    }

    vm.decimalC = vm.setTemp.toString().length > 2? true: false;
    vm.setTempDecimal = vm.setTemp - .5;
    climateStatus.tickUp();
  }

  vm.decreTempI = function(){
    if(vm.tempPref == 1){
      if(vm.colorpicker[1].red > 62)
        vm.colorpicker[1].red--;
    }
    if(vm.tempPref == 0){
      if(vm.colorpicker[1].red > 17)
        vm.colorpicker[1].red = vm.colorpicker[1].red - .5;
    }
  }

  vm.increTempI = function(){
    if(vm.tempPref == 1){
      if(vm.colorpicker[1].red < 90)
        vm.colorpicker[1].red++;
    }
    if(vm.tempPref == 0){
      if(vm.colorpicker[1].red < 32)
        vm.colorpicker[1].red = vm.colorpicker[1].red + .5;
    }
  }

  vm.decreTempII = function(){
    if(vm.tempPref == 1){
      if(vm.colorpicker[2].red > 62)
        vm.colorpicker[2].red--;
    }
    if(vm.tempPref == 0){
      if(vm.colorpicker[2].red > 17)
        vm.colorpicker[2].red = vm.colorpicker[2].red - .5;
    }
  }

  vm.increTempII = function(){
    if(vm.tempPref == 1){
      if(vm.colorpicker[2].red < 90)
        vm.colorpicker[2].red++;
    }
    if(vm.tempPref == 0){
      if(vm.colorpicker[2].red < 32)
        vm.colorpicker[2].red = vm.colorpicker[2].red + .5;
    }
  }

  vm.minTemp = function(){
    if(vm.tempPref == 1) vm.setTemp = 62;
    if(vm.tempPref == 0) vm.setTemp = 17;
    vm.decimalC = false;
    for(var count = 0; count < 30; count++)
      climateStatus.tickDown();
  }

  vm.maxTemp = function(){
    if(vm.tempPref == 1) vm.setTemp = 90;
    if(vm.tempPref == 0) vm.setTemp = 32;
    vm.decimalC = false;
    for(var count = 0; count < 30; count++)
      climateStatus.tickUp();
  }

  climateStatus.tickFromDegree(80);

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


 angular.element('body').click(function(e){
        if(!$(e.target).closest('.hour-wrap1').length && angular.element('.hour-list1').is(':visible')){          
                    $timeout(function() {  vm.hrPickerI = !vm.hrPickerI }, 10);              
        }
         if(!$(e.target).closest('.hour-wrap2').length && angular.element('.hour-list2').is(':visible')){ 
                 $timeout(function() {  vm.hrPickerII = !vm.hrPickerII; }, 10);   
        }
        if(!$(e.target).closest('.minute-wrap1').length && angular.element('.minute-list1').is(':visible')){
                $timeout(function() { vm.minPickerI = !vm.minPickerI; }, 10);  
        }
        if(!$(e.target).closest('.minute-wrap2').length && angular.element('.minute-list2').is(':visible')){
                $timeout(function() { vm.minPickerII= !vm.minPickerII; }, 10);  
        }
        if(!$(e.target).closest('.am-pm-wrap1').length && angular.element('.am-pm-list1').is(':visible')){ 
                $timeout(function() { vm.sectPickerI = !vm.sectPickerI; }, 10);  
        }
        if(!$(e.target).closest('.am-pm-wrap2').length && angular.element('.am-pm-list2').is(':visible')){
                $timeout(function() {  vm.sectPickerII= ! vm.sectPickerII; }, 10);
        }        
    });

  /* Schedule I */
  vm.toggleOnOffI = function(){
    if(vm.upI)
      vm.offI = !vm.offI;
  }

  vm.defrostOnOffI = function(){
    $scope.defrosOffI = !$scope.defrosOffI;
  }

  vm.toggleHrPickerI = function(){
    vm.hrPickerI = !vm.hrPickerI;
    if(vm.hrPickerI){
      vm.minPickerI = false;
      vm.sectPickerI = false;
    }
  }

  vm.toggleMinPickerI = function(){
    vm.minPickerI = !vm.minPickerI;
    if(vm.minPickerI){
      vm.hrPickerI = false;
      vm.sectPickerI = false;
    }
  }

  vm.toggleSectPickerI = function(){
    vm.sectPickerI = !vm.sectPickerI;
    if(vm.sectPickerI){
      vm.hrPickerI = false;
      vm.minPickerI = false;
    }
  }

  vm.newHrI = function(index){
    $scope.hourI = vm.hrList[index];
    vm.hrPickerI = false;
  }

  vm.newMinI = function(index){
    $scope.minuteI = vm.minList[index];
    vm.minPickerI = false;
  }

  vm.newSecI = function(index){
    $scope.sectionI = vm.secList[index];
    vm.sectPickerI = false;
  }

  vm.newHvacTimeI = function(){
        return $scope.hourI + $scope.minuteI;
    }

  vm.newHvacDaysI = function(){
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

  vm.addHvacI = function(){
    if(vm.serviceBlock == true)
      return;
    if(vm.newHvacDaysI().length == 0){
      vm.errorScheduleI = true;
      vm.errorSchMsg = "Please select day(s) to schedule.";
      return;
    }
    if(!vm.validSchedule($scope.numberScheduleII, convertTimeToNumberOfMinutes(vm.newHvacTimeI(),$scope.sectionI), $scope.daysII, vm.newHvacDaysI())){
      vm.errorScheduleI = true;
      return;
    }

    vm.errorScheduleI = false;
    vm.errorSchMsg = "";

    var hexValue = vm.tempPref == 1? tempToHex(vm.colorpicker[1].red): tempCtoHex[vm.colorpicker[1].red];
    var newHvacInfo = {"climateIndex":0, "reservHvacInfoDetail" : {"airTemp" : {"unit" : 1, "value" : {"hexValue": hexValue}}, "climateSet" : !vm.offI, "defrost" : !$scope.defrosOffI, "reservInfo" : {"day" : vm.newHvacDaysI(), "time" : {"time" : vm.newHvacTimeI(), "timeSection" : ($scope.sectionI == 'AM'? 0: 1)}}}};
    
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
                climateEvService.postHvac(newHvacInfo).then(function(data){
                  if(data.data.success === "false"){
                      if(vm.mobile)
                          StatusBarService.clearStatus();
                      else
                          StatusBarService.showErrorStatus("typeEV");
                      vm.statusMsg = data.data.error;
                      vm.errorState = true;
                      vm.serviceBlock = false;
                  } else $scope.eventCallServBlkChk();
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

  vm.defrostOnOffII = function(){
    $scope.defrosOffII = !$scope.defrosOffII;
  }

  vm.toggleHrPickerII = function(){
    vm.hrPickerII = !vm.hrPickerII;
    if(vm.hrPickerII){
      vm.minPickerII = false;
      vm.sectPickerII = false;
    }
  }

  vm.toggleMinPickerII = function(){
    vm.minPickerII = !vm.minPickerII;
    if(vm.minPickerII){
      vm.hrPickerII = false;
      vm.sectPickerII = false;
    }
  }

  vm.toggleSectPickerII = function(){
    vm.sectPickerII = !vm.sectPickerII;
    if(vm.sectPickerII){
      vm.hrPickerII = false;
      vm.minPickerII = false;
    }
  }

  vm.newHrII = function(index){
    $scope.hourII = vm.hrList[index];
    vm.hrPickerII = false;
  }

  vm.newMinII = function(index){
    $scope.minuteII = vm.minList[index];
    vm.minPickerII = false;
  }

  vm.newSecII = function(index){
    $scope.sectionII = vm.secList[index];
    vm.sectPickerII = false;
  }

  vm.newHvacTimeII = function(){
        return $scope.hourII + $scope.minuteII;
    }

    vm.newHvacDaysII = function(){
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

  vm.addHvacII = function(){
    if(vm.serviceBlock == true)
      return;
    if(vm.newHvacDaysII().length == 0){
      vm.errorScheduleII = true;
      vm.errorSchMsg = "Please select day(s) to schedule.";
      return;
    }
    if(!vm.validSchedule($scope.numberScheduleI, convertTimeToNumberOfMinutes(vm.newHvacTimeII(),$scope.sectionII), $scope.daysI, vm.newHvacDaysII())){
      vm.errorScheduleII = true;
      return;
    }

    vm.errorScheduleII = false;
    vm.errorSchMsg = "";

    var hexValue = vm.tempPref == 1? tempToHex(vm.colorpicker[2].red): tempCtoHex[vm.colorpicker[2].red];
    var newHvacInfo = {"climateIndex":1, "reservHvacInfoDetail" : {"airTemp" : {"unit" : 1, "value" : {"hexValue": hexValue}}, "climateSet" : !vm.offII, "defrost" : !$scope.defrosOffII, "reservInfo" : {"day" : vm.newHvacDaysII(), "time" : {"time" : vm.newHvacTimeII(), "timeSection" : ($scope.sectionII == 'AM'? 0: 1)}}}};

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
                climateEvService.postHvac(newHvacInfo).then(function(data){
                  if(data.data.success === "false"){
                      if(vm.mobile)
                          StatusBarService.clearStatus();
                      else
                          StatusBarService.showErrorStatus("typeEV");
                      vm.statusMsg = data.data.error;
                      vm.errorState = true;
                      vm.serviceBlock = false;
                  } else $scope.eventCallServBlkChk();
                });
            }   
        });
  }
  /* End of Schedule II */

  vm.sendClimate = function(){
    if(vm.serviceBlock == true)
      return;

    var hexValue = vm.tempPref == 1? tempToHex(vm.setTemp): tempCtoHex[vm.setTemp];
    var hvcInfo = {"defrost":false,"airTemp":{"unit":1,"value":{"hexValue":hexValue}}};
    var url = '/ccw/ev/immediateHVAC.do';

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
                climateEvService.sendDefrost(url, hvcInfo).then(function(data){
                  if(data.data.success === "false"){
                      if(vm.mobile)
                          StatusBarService.clearStatus();
                      else
                          StatusBarService.showErrorStatus("typeEV");
                      vm.statusMsg = data.data.error;
                      vm.errorState = true;
                      vm.serviceBlock = false;
                  } else $scope.eventCallServBlkChk();
                });
            }   
        });
  }

  vm.sendDefrost = function(){
    if(vm.serviceBlock == true || vm.defrostStatus == 'disabled')
      return;

    var hexValue = vm.tempPref == 1? tempToHex(vm.setTemp): tempCtoHex[vm.setTemp];
    var hvcInfo = {"defrost":true,"airTemp":{"unit":1,"value":{"hexValue":hexValue}}};
    var url = '/ccw/ev/immediateHVAC.do';

    vm.defrostStatusMobile='started';

    $timeout(function(){
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
              climateEvService.sendDefrost(url, hvcInfo).then(function(data){
                if(data.data.success === "false"){
                    if(vm.mobile)
                        StatusBarService.clearStatus();
                    else
                        StatusBarService.showErrorStatus("typeEV");
                    vm.statusMsg = data.data.error;
                    vm.errorState = true;
                    vm.serviceBlock = false;
                } else $scope.eventCallServBlkChk();
              });
          }   
      });
    },1000);
  }

  vm.stopDefrost = function(){
    if(vm.serviceBlock == true || vm.defrostStatus == 'disabled')
      return;

    var hexValue = vm.tempPref == 1? tempToHex(vm.setTemp): tempCtoHex[vm.setTemp];
    var hvcInfo = {"defrost":false,"airTemp":{"unit":1,"value":{"hexValue":hexValue}}};
    var url = '/ccw/ev/cancelImmediateHVAC.do?hvcInfo=';

    vm.defrostStatusMobile='stopped';

    $timeout(function(){
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
            climateEvService.stopDefrost(url, JSON.stringify(hvcInfo)).then(function(data){
              if(data.data.success === "false"){
                  if(vm.mobile)
                      StatusBarService.clearStatus();
                  else
                      StatusBarService.showErrorStatus("typeEV");
                  vm.statusMsg = data.data.error;
                  vm.errorState = true;
                  vm.serviceBlock = false;
              } else $scope.eventCallServBlkChk();
            });
        }   
      });
    },1000);
  }

  vm.offClimate = function(){
    if(vm.serviceBlock == true)
            return;

    var hexValue = vm.tempPref == 1? tempToHex(vm.setTemp): tempCtoHex[vm.setTemp];
    var hvcInfo = {"defrost":false,"airTemp":{"unit":1,"value":{"hexValue":hexValue}}};
    var url = '/ccw/ev/cancelImmediateHVAC.do';

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
                climateEvService.stopDefrost(url, hvcInfo).then(function(data){
                  if(data.data.success === "false"){
                      if(vm.mobile)
                          StatusBarService.clearStatus();
                      else
                          StatusBarService.showErrorStatus("typeEV");
                      vm.statusMsg = data.data.error;
                      vm.errorState = true;
                      vm.serviceBlock = false;
                  } else $scope.eventCallServBlkChk();
                });
            }   
        });
  }

  vm.reload = function(){
    $window.location.reload(); //$state.reload();
  }

  $anchorScroll(0);
};
