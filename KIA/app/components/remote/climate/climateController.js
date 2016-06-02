'use strict';

module.exports = /*@ngInject*/ ['climateService','$scope','$rootScope','$state','$modal','$timeout','$location'
  ,'StatusBarService','VehicleStatusService', 'NotificationsService',function(climateService,$scope,$rootScope,$state,$modal,$timeout,$location
  ,StatusBarService, VehicleStatusService, NotificationsService) {

  var vm=this;

  vm.isMessege = true;
  vm.disableRequest=true;
  vm.showClimateStatus = false;
  vm.showDefrostStatus = false;
  vm.hasMessege = false;
  $scope.disableAll = false;
  vm.timeVale1, vm.timeVale2 = 0;
  vm.validSchedule = true;
  vm.invalidScheduleDays = false;
  vm.conflictDay=[];
  vm.unsuccessCall = false;
  vm.successCall = false;
  vm.hideTimeStamp = true;
  //$rootScope.hasRefresh = true;
		// slider ==============
		var climateDialModule =  {
      hexTempMaps: {
        f: {
          ticks: 28,
          tempMap : ["20","1E","1D","1C","1B","1A","19","18","17","16",
          "15","14","13","12","11","10","0F","0E","0D","0C",
          "0B","0A","09","08","07","06","05","04","02"],

          degMap : ["High",89,88,87,86,85,84,83,82,81,80,79,78,77,76,
          75,74,73,72,71,70,69,68,67,66,65,64,63,"Low"]
        },
        c: {
          ticks : 16,
          tempMapC : ["20","1E","1C","1A","18","16","14","12","10","0E","0C","0A","08","06","04","03","02"],
          degMapC : ['High',31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,'Low']
        }
      },
      utils: {
        calcArrayPts:function(ticks,ratio) {
          var arrayPts = [];  
          for (var i = 0; i < ticks; i++) {
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
                path = paper.path(Raphael.transformPath("M 30 180 a150,150 0 1,0 150,-150",'r225')).attr( 'stroke-width', 16 )
                .attr( 'stroke', 'rgb(68,139,202)' ),

                ticks = 28,

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
                    knob = paper.image('../images/climate/slider-btn.png',0,0,68,68),
                    knobX = 0,
                    knobY = 0,
                    knobA = 0,
                    // shim is an invisible boundry for the knob. This is the actual object being dragged, in which its angle determines the
                    // knob position.
                    shimDiv = ($('html').hasClass('lt-ie9')) ? '<div>' : '<div style="background:white; opacity:0">';
                    var $shim = $(shimDiv).css({position:'absolute', width:68, height:68}).appendTo($(selector)),

                    degreeOffset = Raphael.angle(palStart.x,palStart.y,mid.x,mid.y),
                    
                    // events
                    dragEnabled = false,
                    onDragFn = function(val){},
                    onStopFn = function(){},
                    onClickFn = function(){}
                    ;
                    
                // Temp / tick mapping 29 ticks
                var tempMap = ["20","1E","1D","1C","1B",
                "1A","19","18","17","16",
                "15","14","13","12","11",
                "10","0F","0E","0D","0C",
                "0B","0A","09","08","07",
                "06","05","04","02"];
                
                var degMap = ["High",89,88,87,86,
                85,84,83,82,81,
                80,79,78,77,76,
                75,74,73,72,71,
                70,69,68,67,66,
                65,64,63,"Low"];                              
                
                // Calculate percentage of 
                var arrayPts = [];  
                for (var i = 0; i < ticks; i++) {
                  arrayPts.push(i*(ratio/ticks));
                }
                arrayPts.push(ratio);

                var currentPos = arrayPts.length - 1;   

                moveKnob(pal.x,pal.y,pal.alpha,path.getSubpath(len-1,len));             
                
                $('#enable').click(function() {
                  enable(true);
                });
                $('#disable').click(function() {
                  enable(false);
                });
                $shim.css({ left: pal.x-34, top: pal.y-34});
                $shim.draggable({
                 drag: function ( e, ui ) {
                   if (enabled || dragEnabled) {

                    if (!enabled) {
                      enable(true);
                    }

                    var deg = Raphael.angle(ui.position.left+34, ui.position.top+34, mid.x,mid.y  );
                    var t = (deg <=degreeOffset ) ? (degreeOffset - deg) / 360.0 : (360.0 - deg + degreeOffset) / 360;

                            // // Using t, find a point along the path
                            if (t >= 0 && t <=ratio) {
                              var tt = t;
                              for (var i = 0; i < arrayPts.length; i++) {
                                if (arrayPts[i] > t) {
                                  if (t > arrayPts[i-1] && t < arrayPts[i-1] + ((ratio/ticks)/2)) { tt = arrayPts[i-1]; currentPos = i -1; break; }
                                  else { tt = arrayPts[i]; currentPos = i;  break; }
                                }                   
                              }

                              calcKnobPosition(tt); 
                              vm.knobvalue=parseInt(tempMap[currentPos],16);
                              
                              $scope.$apply(function(){
                               vm.knobdata.value=tempFromHex(vm.knobvalue);
                             });

                              /*onDragFn(parseInt(tempMap[currentPos],16));*/
                            }
                          }

                        },
                        stop: function ( e, ui ) {
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
                        // // Using t, find a point along the path
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
                        onDragFn(parseInt(tempMap[currentPos],16));
                        vm.knobvalue=parseInt(tempMap[currentPos],16);

                        
                        $scope.$apply(function(){
                         vm.knobdata.value=tempFromHex(vm.knobvalue)

                       });
                        onClickFn();
                      }
                    }

                    function enable(toggle) {
                      if (!toggle) {
                        enabled = false;
                        if (path) path.remove();
                        path = paper.path(Raphael.transformPath("M 30 180 a150,150 0 1,0 150,-150",'r225')).attr( 'stroke-width', 16 )
                        .attr( 'stroke', 'rgb(119,119,119)' );                       
                        path.click(function(e) { pathClicked(e); });
                        
                        knob.remove();
                        knob = paper.image('images/kh/img/remote/odo-button-grey.png',0,0,68,68);
                        moveKnob(knobX,knobY,knobA,rPathString);
                      } else {
                        enabled = true;
                        if (path) path.remove();
                        path = paper.path(Raphael.transformPath("M 30 180 a150,150 0 1,0 150,-150",'r225')).attr( 'stroke-width', 16 )
                        .attr( 'stroke', 'rgb(68,139,202)' );
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
                      
        //vm.knsetHvacTemperature(temp);
        
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
            }
            var climateStatus=new climateDialModule.init('#wrapdrag');
            
		//   slider =========

    vm.hasMobStatusssssss=true;

    vm.enginestatus=true;
    vm.climate=true;
    vm.defroster=true;
    vm.climatestatus=[];
    vm.defrosterstatus=[];
    vm.colorpicker=[];
    vm.shedule=["",true,true];
    vm.success=["",false,false];
    vm.sending=["",false,false];
    vm.onOffE = 'off';
    vm.onOffC = 'off';
    vm.onOffD = 'off';
    vm.dragOptions = {
      start: function(e) {
     },
     drag: function(e) {
  
     },
     stop: function(e) {
       
     },
     container: 'draggable'
   }
   $rootScope.inClimateControl=true;
   $scope.$on('$destroy', function() {
    $rootScope.progressstatus='';
    $rootScope.inClimateControl=false;
  });
   $rootScope.refreshvehicle=function(){
     climateService.remoteVehicleStatus().then(function(resp){
      var update=resp[0].serviceResponse.timeStampVO.unixTimestamp;
      $rootScope.progressstatus="Last Updated as of "+moment(update * 1000).format("MMMM DD, YYYY h:mm a");


    });
   }

   vm.latestVehicleStatus=function(){
    $scope.disableAll = true;
    StatusBarService.clearStatus();
    StatusBarService.showLoadingStatus();

    vm.hasErrors=true;
    vm.submitted=true;
    vm.proccessing=true;
    VehicleStatusService.latestVehicleStatus().then(function(data){
      if(data.success == true){
        $state.reload();
      }
      else{
        StatusBarService.showErrorStatus('Your previous request did not complete. Your settings have been restored');
        vm.vStatus = 'error';
        $scope.disableAll = false;
        vm.hasMessege=true;
        vm.hasErrors = true;
        vm.proccessing = false;
      }

    });
  }

  vm.mobile=true;
  vm.knobdata ={};
  // vm.knobdata.value= "--";
//(com.vehicleStatus.airTemp) ? parseInt(com.vehicleStatus.airTemp.value.substr(0, 2), 16) : "--";
vm.knobdata1 = {
  value: 'Low',
  options: {

   fgColor: 'rgb(187, 22, 40)',
   bgColor:'rgb(68, 139, 202)',
   angleOffset: 235,
   angleArc: 250,
   displayInput: true,
   thickness:.1,
   width:320,
   height:300,
   min:63,
   max:89

 }
};

vm.viewPendingRequests=function(){

  vm.modalinstance=$modal.open({
    templateUrl:'views/components/remote/climate/pendinglist.html',
    scope:$scope
  });
  vm.cancel=function(){
   vm.modalinstance.dismiss();
 }

 vm.cancelPending=function(){
   loadingRequest(true);
   vm.cancel();
 }

};

$scope.$on('mobile',function(e,data){

  if(data=='on'){
   vm.knobdata.angleArc=360;
   vm.mobile=true;
 }

 else{
  if(vm.modalinstance){
   vm.modalinstance.dismiss();
 }

 vm.knobdata.angleArc=250;
 vm.mobile=false;

}
})
vm.knobchange=function(resp){

  if(resp=='inc'){


    if(vm.knobdata.value=='High'){
      return false;
    }
    climateStatus.tickUp();

    vm.knobvalue=vm.knobvalue+1;

    if(vm.knobdata.value==tempFromHex(vm.knobvalue)){
      vm.knobvalue=vm.knobvalue+1;

    }
    vm.knobdata.value=tempFromHex(vm.knobvalue); 


  } 
  else{

   if(vm.knobdata.value=='Low'){
    return false;
  }
  climateStatus.tickDown();
  vm.knobvalue=vm.knobvalue-1;
  if(vm.knobdata.value==tempFromHex(vm.knobvalue)){
   vm.knobvalue=vm.knobvalue-1;
 }
 vm.knobdata.value=tempFromHex(vm.knobvalue);
} 

      		/*if(vm.climate==true&&vm.enginestatus==false){
      			if(resp=='inc'){
	if(vm.knobdata.value=='Low'){
		vm.knobdata.value=vm.knobdata.options.min;
	}
	else{
		vm.knobdata.value<vm.knobdata.options.max?vm.knobdata.value+=1:vm.knobdata.value='High';
	}
	
	
         	
}
else if(resp=='dec'){
if(vm.knobdata.value=='High'){
		vm.knobdata.value=vm.knobdata.options.max;
	}
	else{
		vm.knobdata.value>vm.knobdata.options.min?vm.knobdata.value-=1:vm.knobdata.value='Low';
	}
	
}
}*/

};
vm.EngineToggle=function(){
  vm.hasErrors=false;
  vm.enginestatus=!vm.enginestatus;
  vm.climate=vm.enginestatus;
  vm.defroster=vm.enginestatus;
  if(!vm.enginestatus){
    vm.onOffE = 'on';

  }
  else{
    vm.onOffE = 'off';
    vm.onOffC = 'off';
    vm.onOffD = 'off';
    vm.climate = false;
    vm.defroster = false;
  }

  if((vm.remotedata.engine && (vm.onOffE == 'on')) || (!vm.remotedata.engine && (vm.onOffE == 'off')) ){
    vm.disableRequest = true;
  }else{
    vm.pendingtotal=1;
    vm.disableRequest = false;
  }

};
vm.climateChangeStatus=function(type){
 if(vm.scheduleone==true && type=='1'){
  vm.climatestatus[1]=!vm.climatestatus[1];
  vm.shedule[type]=true;
  vm.success[type]=false;
}
else if(vm.scheduletwo==true && type=='2'){
  vm.climatestatus[2]=!vm.climatestatus[2];
  vm.shedule[type]=true;
  vm.success[type]=false;
}

}
vm.defrosterStatus=function(type){
 vm.defrosterstatus[type]=!vm.defrosterstatus[type];
 vm.shedule[type]=true;
 vm.success[type]=false;

}
vm.climateBox=function(){
  vm.hasErrors=false;
  if(vm.knobvalue=='--'){
    vm.knobvalue=1;
  }
  if(vm.knobvalue==1){
    vm.knobvalue=vm.knobvalue+1;
    vm.knobdata.value=tempFromHex(vm.knobvalue);
  }
  vm.climate=!vm.climate;
  climateStatus.enable(vm.climate);
  climateStatus.enableDrag(vm.climate);
  
//vm.knobdata.value=tempFromHex();
if(vm.climate && !vm.enginestatus){
  vm.onOffC = 'on';
  vm.pendingtotal=3;
}
else{
  vm.defroster = vm.climate;
  vm.onOffC = 'off';
  vm.onOffD = 'off';
  vm.pendingtotal=1;
}

if((vm.remotedata.airCtrlOn && (vm.onOffC == "on")) || (!vm.remotedata.airCtrlOn && (vm.onOffC == "off"))){
  vm.showClimateStatus = false;
  vm.showDefrostStatus = false;
}else{
  vm.showClimateStatus = true;
}

}
vm.defrosterBox=function(){
  vm.hasErrors=false;
 vm.defroster=!vm.defroster;
 if(vm.defroster && !vm.enginestatus){
   vm.climate = vm.defroster;
   vm.onOffD = 'on';
   vm.onOffC = 'on';
   vm.pendingtotal=4;
 }
 else{
  vm.onOffD = 'off';
  vm.pendingtotal=3;
}

if((vm.remotedata.defrost && (vm.onOffD == "on")) || (!vm.remotedata.defrost && (vm.onOffD == "off"))){
  vm.showDefrostStatus = false;
}else{
  vm.showDefrostStatus = true;
}

}
function hexFromRGB(r, g, b) {
 var hex = [r.toString(16)];
 angular.forEach(hex, function(value, key) {
  if (value.length === 1) hex[key] = "0" + value;
});
 return hex.join('').toUpperCase();
}

function refresh(r, g, b) {
 var color = '#' + hexFromRGB(r, g, b);
 angular.element('#swatch').css('background-color', color);

}
var tempmin=[false,false];
var tempmax=[false,false];
vm.mintemp=[];
vm.lowtemp=[];
vm.hightemp=[];
vm.mintemplist=[];
function tempSettings(coloritem,item){
 if(coloritem === 63 && tempmin[item] == true){
  vm.mintemp[item]=true;
  vm.lowtemp[item]=true;
  vm.hightemp[item]=false;
  vm.mintemplist[parseInt(item)]="Low";

				//vm.colorpicker[parseInt(item)].red='Low';
				tempmin[item]=false;
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
          $scope.$apply();
        }
      }
     else if(coloritem === 89 && tempmax[item] == true){
        vm.mintemp[item]=true;
        vm.lowtemp[item]=false;
        vm.hightemp[item]=true;
        vm.mintemplist[parseInt(item)]="High";
				//vm.colorpicker[parseInt(item)].red='High';
				tempmax[item]=false;
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
         $scope.$apply();				
       }
     }
     else{
      vm.mintemp[item]=false;
      vm.lowtemp[item]=false;
      vm.hightemp[item]=false;
      if(coloritem == 63){					
       tempmin[item]=true;
     }
     if(coloritem == 89){					
       tempmax[item] = true;
     }				
     var red = vm.colorpicker[item].red,
     green = vm.colorpicker[item].green,
     blue = vm.colorpicker[item].blue;
     refresh(red, green, blue);

   }

 }
 function refreshSwatch (ev, ui) {
   vm.mintemp[1]=false;
   tempSettings(vm.colorpicker[1].red,'1');

 }
 function refreshSwatch1 (ev, ui) {
   vm.mintemp[2]=false;
   tempSettings(vm.colorpicker[2].red,'2');
 }
 vm.offsetValue = function () {
   var jan = new Date(new Date().getFullYear(), 0, 1);
   var jul = new Date(new Date().getFullYear(), 6, 1);
   var offset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset()) / -60;           

   moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');
   var timeZone = 'America/Los_Angeles';         
   var dt = moment().tz(timeZone).format('YYYY-M-D hh:mm:ss'); 
   var dstTest = moment.tz(dt,timeZone).isDST();

   if(offset == (new Date().getTimezoneOffset()/ -60)){
    if(dstTest)
     offset=offset-1;
 }
 return offset;
};

vm.days=[];
vm.days[1]=[{day:'MON',active:false},{day:'TUE',active:false},{day:'WED',active:false},{day:'THU',active:false},{day:'FRI',active:false},{day:'SAT',active:false},{day:'SUN',active:false}];
vm.days[2]=[{day:'MON',active:false},{day:'TUE',active:false},{day:'WED',active:false},{day:'THU',active:false},{day:'FRI',active:false},{day:'SAT',active:false},{day:'SUN',active:false}];

vm.daysData=[];
vm.daysData[1]=[];
vm.daysData[2]=[];
vm.daysList1 = [];
vm.daysList2 = [];
vm.selecteddays=[];
vm.climateTime=[];
vm.timesection=[];
vm.Timedisplay=[];
vm.Timedisplay1=[];
vm.tempvalue=[];
vm.hour=[false,false];
vm.minute=[false,false];
vm.gradient=[false,false];
vm.hourborder=[false,false];
vm.minuteborder=[false,false];
vm.gradientborder=[false,false];
vm.hoursData=["01","02","03","04","05","06","07","08","09","10","11","12"];   
vm.minutesData=["50","40","30","20","10","00"];
vm.gradientData=["AM","PM"];
var tempUnits = 'F';
var hexToTemp = {
  "F" : {"--" : "--", "01" : "--", "02" : 'Low', "03" : 63, "04" : 63, "05" : 64, "06" : 65, "07" : 66, "08" : 67, "09" : 68, "0A" : 69, "0B" : 70, "0C" : 71, "0D" : 72, "0E" : 73, "0F" : 74, "10" : 75, "11" : 76, "12" : 77, "13" : 78, "14" : 79, "15" : 80, "16" : 81, "17" : 82, "18" : 83, "19" : 84, "1A" : 85, "1B" : 86, "1C" : 87, "1D" : 88, "1E" : 89, "1F" : 89, "20" : 'High'},
  "C" : {"--" : "--", "01" : "--", "02" : 'Low', "03" : 17, "04" : 18, "05" : 18, "06" : 19, "07" : 19, "08" : 20, "09" : 20, "0A" : 21, "0B" : 21, "0C" : 22, "0D" : 22, "0E" : 23, "0F" : 23, "10" : 24, "11" : 24, "12" : 25, "13" : 25, "14" : 26, "15" : 26, "16" : 27, "17" : 27, "18" : 28, "19" : 28, "1A" : 29, "1B" : 29, "1C" : 30, "1D" : 30, "1E" : 31, "1F" : 31, "20" : 'High'}
};

VehicleStatusService.getLatestVehicleStatus().then(function(data){
  vm.vehicleStatus = data;
  vm.vStatus = vm.vehicleStatus[0].serviceResponse.timeStampVO.unixTimestamp;
  vm.hideTimeStamp = false;

    });



climateService.getOutsideTemp().then(function(resp){
  var data = resp.serviceResponse;
  vm.data=data;

});
$rootScope.refreshvehicle();
climateStatus.enable(false);
vm.knobvalue="--";
vm.knobdata.value=tempFromHex(vm.knobvalue);

/*$scope.$on('$locationChangeStart', function(){
    $timeout.cancel(promise);
});*/

 $scope.$on('$destroy', function() {
    $timeout.cancel($scope.pending);
    $timeout.cancel($scope.submitEngineReq);
});


function loadingRequest(onPageLoad)
{
  $timeout.cancel($scope.pending);
    $timeout.cancel($scope.submitEngineReq);
  if(onPageLoad){ 
    vm.submitted = true;
    //$timeout.cancel($scope.promise);
  }
  climateService.remoteVehicleStatus().then(function(resp){

if(resp[0].success){
   
   var loadestatus=resp[1];
   vm.remotedata=resp[0].serviceResponse.latestVehicleStatus;
   var isLocked = vm.remotedata.doorLock;
   vm.status=(loadestatus.remoteStartStatus == 'P' || loadestatus.remoteStopStatus == 'P' || loadestatus.lockStatus =='P' || loadestatus.unlockStatus == 'P');
   vm.hasErrors = ((loadestatus.remoteStartStatus == 'E')  || (loadestatus.remoteStopStatus == 'E'));

   if(vm.status==true){
   vm.hasErrors = true;
   vm.lockUnlock = (loadestatus.lockStatus =='P' || loadestatus.unlockStatus == 'P');
   if(vm.lockUnlock){
      $location.path("/kh/lock");
   }else{
      $scope.disableAll = true;
      vm.proccessing = true;
    if(loadestatus.remoteStartStatus == 'P'){
        vm.enginestatus = false;
        vm.climate = false;
        vm.defroster = false;
        vm.onOffE = 'on';
    }
    else if(loadestatus.remoteStopStatus == 'P'){
        vm.enginestatus = true;  
        vm.onOffE = 'off';
    }
        //$rootScope.refreshvehicle();
        $scope.pending = $timeout(function(){
        
        loadingRequest(false);
        //$state.reload();
 },30000);
   }
   }
   else if (vm.hasErrors==true) {
    vm.unsuccessCall = true;
    if(vm.submitted==true){
      $scope.disableAll = false;
      vm.hasMessege=true;
      $rootScope.progress={'background-color':'red!important'};
      $rootScope.progressstatus='Your previous request did not complete. Your settings have been restored';
      
     StatusBarService.showErrorStatus('Your previous request did not complete. Your settings have been restored');
     //vm.submitted=false;
     vm.proccessing = false;
     $scope.notificationJSON();
     if(loadestatus.remoteStartStatus == 'E'){
      vm.onOffE = 'on';
     }else if(loadestatus.remoteStopStatus == 'E'){
      vm.onOffE = 'off';
     }
    }

  } 
  else {

    vm.remotevehicle=resp[0].serviceResponse.timeStampVO.unixTimestamp;
   vm.enginestatus = !vm.remotedata.engine;
   vm.climate = vm.remotedata.airCtrlOn;
   vm.defroster = vm.remotedata.defrost;
   vm.onOffE = vm.remotedata.engine ? 'on':'off';
   if(vm.remotedata.engine){
   vm.onOffC = vm.remotedata.airCtrlOn ? 'on':'off';
   if(vm.remotedata.airCtrlOn){
    vm.onOffD = vm.remotedata.defrost ? 'on' : 'off';
   }
   } 
   //vm.enginestatus=!vm.remotedata.engine;
   vm.knobvalue=parseInt(vm.remotedata.airTemp.value.substr(0, 2), 16);
   
   if(vm.knobvalue==1){
     vm.knobvalue=vm.knobvalue+1;
     vm.knobdata.value=tempFromHex(vm.knobvalue);
   }

    if(vm.submitted==true){
      $scope.disableAll = false;
     vm.disableRequest = true;
     if(!onPageLoad){
        vm.hasMessege=true;
        StatusBarService.showSuccessStatus('Your previous request was successful . Your vehicle status has been updated to reflect changes.');
        $rootScope.progress={'background':'green'};
        $rootScope.progressstatus='Your previous request was successful . Your vehicle status has been updated to reflect changes.';
        $scope.notificationJSON();
        $timeout(function(){
          vm.successCall = false;
        },5000);
     }
     vm.submitted=false;
     vm.proccessing=false;
   }



 }
}else{
  if(vm.submitted==true){
      $rootScope.progress={'background-color':'red!important'};
      $rootScope.progressstatus='Your previous request did not complete. Your settings have been restored';
      
     StatusBarService.showErrorStatus('Your previous request did not complete. Your settings have been restored');
     //vm.submitted=false;
     vm.proccessing = false;
     $scope.notificationJSON();
    }
}


});
}
loadingRequest(true);

$scope.notificationJSON = function () {
         $rootScope.$broadcast('notificationJSON');
     };  

vm.submitEngine=function(){
$scope.disableAll = true;
StatusBarService.clearStatus();
StatusBarService.showLoadingStatus();
vm.successCall = false;
vm.unsuccessCall = false;

vm.hasErrors=true;
vm.submitted=true;
vm.proccessing=true;
var payload={};

var x={
  "airCtrl":(!vm.enginestatus&&vm.climate==true)?1:0,
  "defrost":(!vm.enginestatus&&vm.defroster),
  "airTemp":{"value":toHexString(vm.knobvalue).toUpperCase() + "H","unit":0},
  "igniOnDuration":10
};


/*vm.remotedata.airCtrlOn=(!vm.enginestatus&&vm.climate==true)?true:false;
vm.remotedata.engine=!vm.enginestatus;
vm.remotedata.defrost=(!vm.enginestatus&&vm.defroster);*/
delete vm.remotedata['hoodOpen'];
delete vm.remotedata['evStatus'];
delete vm.remotedata['ign3'];
delete vm.remotedata['transCond'];
delete vm.remotedata['dateTime'];
vm.remotedata.airTemp.value=toHexString(vm.knobdata.value).toUpperCase() + "H";
vm.remotedata.airTemp.unit=0;

payload={remoteStartPayload:JSON.stringify(x),vehicleStatusPayload:JSON.stringify(vm.remotedata)};

/*var sample={"airCtrl":0,"defrost":false,"airTemp":{"value":"01H","unit":0},"igniOnDuration":10};
var sample1={"airCtrlOn":false,"engine":false,"doorLock":true,"doorOpen":{"frontLeft":0,"frontRight":0,"backLeft":0,"backRight":0},"trunkOpen":false,"airTemp":{"value":"01H","unit":0},"defrost":false,"lowFuelLight":false,"acc":false};
var payload1={remoteStartPayload:JSON.stringify(sample),vehicleStatusPayload:JSON.stringify(sample1)};*/
vm.showthis=true;
climateService.vehiclestart(payload,vm.onOffE).then(function(resp){
$scope.disableAll = true;
vm.hasMessege=true;
//StatusBarService.showSuccessStatus('Your previous request was successful . Your vehicle status has been updated to reflect changes.');

if (!$scope.$$phase) $scope.$apply();

    if(resp.success){
  $scope.submitEngineReq = $timeout(function(){
      loadingRequest(false);
//       $state.reload();
    },30000);
    }else{
      $scope.disableAll = false;
      StatusBarService.showErrorStatus('Your previous request did not complete. Your settings have been restored');
      vm.unsuccessCall = true;
      vm.hasMessege=true;
      //vm.submitted=false;
      vm.hasErrors=true;
      vm.proccessing = false;
      $scope.notificationJSON();
    }

}).catch(function(response) {
  $scope.disableAll = false;
      StatusBarService.showErrorStatus('Your previous request did not complete. Your settings have been restored');
      vm.unsuccessCall = true;
      vm.hasMessege=true;
      //vm.submitted=false;
      vm.hasErrors=true;
      vm.proccessing = false;

});

};
$scope.$on('refreshin',function(){
  $state.reload();
});
function toHexString(num){
  return num > 15 ? num.toString(16) : "0" + num.toString(16);
}
function tempFromHex(hexTemp){
  var tempUnits="F";
  var hexToTemp = {
    "F" : {"--" : "--", "01" : "--", "02" : 'Low', "03" : 63, "04" : 63, "05" : 64, "06" : 65, "07" : 66, "08" : 67, "09" : 68, "0A" : 69, "0B" : 70, "0C" : 71, "0D" : 72, "0E" : 73, "0F" : 74, "10" : 75, "11" : 76, "12" : 77, "13" : 78, "14" : 79, "15" : 80, "16" : 81, "17" : 82, "18" : 83, "19" : 84, "1A" : 85, "1B" : 86, "1C" : 87, "1D" : 88, "1E" : 89, "1F" : 89, "20" : 'High'},
    "C" : {"--" : "--", "01" : "--", "02" : 'Low', "03" : 17, "04" : 18, "05" : 18, "06" : 19, "07" : 19, "08" : 20, "09" : 20, "0A" : 21, "0B" : 21, "0C" : 22, "0D" : 22, "0E" : 23, "0F" : 23, "10" : 24, "11" : 24, "12" : 25, "13" : 25, "14" : 26, "15" : 26, "16" : 27, "17" : 27, "18" : 28, "19" : 28, "1A" : 29, "1B" : 29, "1C" : 30, "1D" : 30, "1E" : 31, "1F" : 31, "20" : 'High'}
  };

  if (hexTemp && typeof hexTemp === 'number') {
    hexTemp = toHexString(hexTemp);
  }
  return hexToTemp[tempUnits][(hexTemp.toUpperCase() || "--")];
}
		/*var toHexString	= function(num){
        	return num > 15 ? num.toString(16) : "0" + num.toString(16);
		};

		var tempFromHex=function(hexTemp){
                if (hexTemp && typeof hexTemp === 'number') {
                    hexTemp = module.toHexString(hexTemp);
                }
                return hexToTemp[tempUnits][(hexTemp.toUpperCase() || "--")];
              };*/

              var scheduled=function(item,itemNo){
               vm.climatestatus[parseInt(itemNo)]= (item.reservHvacInfoDetail.climateSet === "true") ? true:false;
               vm.defrosterstatus[parseInt(itemNo)]= (item.reservHvacInfoDetail.defrost === "true") ? true:false;
               var tempval=item.reservHvacInfoDetail.airTemp.value.hexValue;
               vm.tempvalue[itemNo]=tempFromHex(tempval);
               vm.selecteddays[itemNo] =item.reservHvacInfoDetail.reservInfo.day;
               for(var i=0;i<vm.selecteddays[itemNo].length;i++){
                angular.forEach(vm.days[itemNo],function(k,val){
                 if(val == vm.selecteddays[itemNo][i]){
                  vm.daysData[itemNo].push(k.day + '.');
                  vm.days[itemNo][val].active=true;
                }
              });
              }
              var Timetext1=item.reservHvacInfoDetail.reservInfo.time.time;
              vm.Timedisplay[itemNo]=Timetext1.substr(0,2);
              vm.Timedisplay1[itemNo]=Timetext1.substr(2,4);
              vm.climateTime[itemNo]= vm.Timedisplay[itemNo].concat(":",vm.Timedisplay1[itemNo]);
              if(item.reservHvacInfoDetail.reservInfo.time.timeSection === 0){
                vm.timesection[itemNo]="AM";
              }
              else{
                vm.timesection[itemNo]="PM";
              }
              var temprange;
              if(vm.tempvalue[itemNo] == "Low" || vm.tempvalue[itemNo] == "High"){
                var temp=vm.tempvalue[itemNo];
                vm.mintemp[itemNo]=true;
                if(temp == "Low"){
                 vm.lowtemp[itemNo]=true;
                 vm.hightemp[itemNo]=false;
                 vm.mintemplist[itemNo]=temp;
                 temprange=63;
               }
               else{
                 vm.lowtemp[itemNo]=false;
                 vm.hightemp[itemNo]=true;
                 vm.mintemplist[itemNo]=temp;
                 temprange=89;
               }

             }else{
              temprange=vm.tempvalue[itemNo];
              vm.mintemp[itemNo]=false;
              vm.lowtemp[itemNo]=false;
              vm.hightemp[itemNo]=false;
            }

            if(itemNo === 1){
//              touchStart();
              vm.colorpicker[itemNo] = {
               red: temprange,
               options: {
                orientation: 'horizontal',
                min: 63,
                max: 89,
                range: 'min',
                change: refreshSwatch,
                slide: refreshSwatch
              }
            };
          }
          else{
            vm.colorpicker[itemNo] = {
             red: temprange,
             options: {
              orientation: 'horizontal',
              min: 63,
              max: 89,
              range: 'min',
              change: refreshSwatch1,
              slide: refreshSwatch1
            }
          };
        }	
      }
      var offsetValue=vm.offsetValue();

      climateService.scheduledInfo(offsetValue).then(function(resp){
    	  var item;
        var defaultResp = {"serviceResponse":[{"climateIndex":0,"reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"02"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0600","timeSection":0}}},"schedId": 0},{"climateIndex":1,"reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"02"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0600","timeSection":0}}},"schedId": 0}]};
      if(resp.errorMessage=='No Climate Schedules found.'){
     	 item = defaultResp.serviceResponse;
     	 vm.item=item;
      }else{	  
        item = resp.serviceResponse;
        vm.item=item;
          if(item.length == 1){
            if(item[0].climateIndex == 0)
              item[1] = defaultResp.serviceResponse[1];
            else if(item[0].climateIndex == 1)
              item[1] = defaultResp.serviceResponse[0];
          }
      }
      for(var i=0;i<item.length;i++){
      if(item[i].climateIndex == 0)
        scheduled(item[i],1);
      else if(item[i].climateIndex == 1)
        scheduled(item[i],2);
      }
     });	

      vm.hourClick=function(id){
       vm.hourborder[id]=!vm.hourborder[id];
       vm.minuteborder[id]=false;
       vm.gradientborder[id]=false;
       vm.hour[id]=!vm.hour[id];
       vm.minute[id]=false;
       vm.gradient[id]=false;

     }

     vm.minuteClick=function(id){
      vm.hourborder[id]=false;
      vm.minuteborder[id]=!vm.minuteborder[id];
      vm.gradientborder[id]=false;
      vm.hour[id]=false; 
      vm.minute[id]=!vm.minute[id];
      vm.gradient[id]=false;
    }

    vm.amClick=function(id){
      vm.hourborder[id]=false;
      vm.minuteborder[id]=false;	
      vm.gradientborder[id]=!vm.gradientborder[id];
      vm.hour[id]=false; 
      vm.minute[id]=false;
      vm.gradient[id]=!vm.gradient[id];
    }

    vm.hourlist=function(id,hourno){
     vm.hourborder[id]=false;
     vm.hour[id]=false;
     vm.Timedisplay[parseInt(id)+1]=hourno;
     vm.shedule[parseInt(id)+1]=true;
     vm.success[parseInt(id)+1]=false;	
   }

   vm.minutelist=function(id,minuteno){
     vm.minuteborder[id]=false;	
     vm.minute[id]=false;	
     vm.Timedisplay1[parseInt(id)+1]=minuteno;
     vm.shedule[parseInt(id)+1]=true;
     vm.success[parseInt(id)+1]=false;	
   }

   vm.gradientlist=function(id,gradientno){
     vm.gradientborder[id]=false;
     vm.timesection[parseInt(id)+1]=gradientno;	
     vm.gradient[id]=false;
     vm.shedule[parseInt(id)+1]=true;
     vm.success[parseInt(id)+1]=false;
   }

   vm.daySelect=function(day,id){
     day.active=!day.active;
     vm.shedule[id]=true;
     vm.success[id]=false;
   }
   vm.decrease=function(no){	
    if(vm.colorpicker[no].red == 63){ 
     vm.mintemp[no]=true;
     vm.mintemplist[no]="Low";
     //vm.colorpicker[no].red =62;
   }
   else if(vm.colorpicker[no].red){
     vm.colorpicker[no].red=vm.colorpicker[no].red - 1;
     vm.mintemp[no]=false;
   }	
 }
 vm.increase=function(no){	
  if(vm.colorpicker[no].red == 89){
   vm.mintemp[no]=true;
   vm.mintemplist[no]="High";
   //vm.colorpicker[no].red =90;
 }
 else if(vm.colorpicker[no].red){
   vm.colorpicker[no].red=vm.colorpicker[no].red + 1;
   vm.mintemp[no]=false;
 }
}

var tempToHex = function(temp){
      var hexTemp = (temp - 59).toString(16);
      if(temp == 62) hexTemp = "2";
      if(temp == 90) hexTemp = "20";
      return hexTemp.length == 1? "0" + hexTemp: hexTemp;
  };
  
  vm.validScheduleDaysRule = function(postitem){
	  var len=0;
	  for(var i in vm.days[postitem]){
		  if(vm.days[postitem][i].active){
			  len++;
		  }
	  }
	  if(len==0){
		  vm.invalidScheduleDays = true;
	  }
  };
  
  vm.timeMins = function(){ 
  if (vm.timesection[1] == "AM")
      vm.timeVale1 = 60*parseInt(vm.Timedisplay[1]) + parseInt(vm.Timedisplay1[1]);
  else
	  vm.timeVale1 = 60*(parseInt(vm.Timedisplay[1])+12) + parseInt(vm.Timedisplay1[1]);
  
  if (vm.timesection[2] == "AM")
      vm.timeVale2 = 60*parseInt(vm.Timedisplay[2]) + parseInt(vm.Timedisplay1[2]);
  else
	  vm.timeVale2 = 60*(parseInt(vm.Timedisplay[2])+12) + parseInt(vm.Timedisplay1[2]);
  };
  
  vm.dayList = function(){
	  vm.daysList1 = [];
	  vm.daysList2 = [];
	  for(var i in vm.days[1]){
		  if(vm.days[1][i].active){
			  vm.daysList1.push(i);
		  }
	  }
	  
	  for(var i in vm.days[2]){
		  if(vm.days[2][i].active){
			  vm.daysList2.push(i);
		  }
	  }
	  
	  };
  
  /*
   * params //*note* 'Other' is the other schedule is comparing with. 'Target' is the schedule to be saved
   * oldTime : aka Other Time 
   * newTime : aka Target Time
   * oldDay  : aka Array of Other days
   * newDay  : aka Array of Target days
   */
  vm.validScheduleRule=function(oldTime, newTime, oldDay, newDay){        	
  	// Determine if schedule climate is on for one or both climates.
  	// If one climate is off, then the other climate can be set to anything. 
	  if(!vm.climatestatus[1] || !vm.climatestatus[2]){
		  return true;  
	  }	
  	var result = true,
  		days = ['MON, ','TUE, ','WED, ','THU, ','FRI, ','SAT, ','SUN, '],  			
  			conflictDayFlags= [false,false,false,false,false,false,false];
  	vm.conflictDay=[];
  	
      for(var i in oldDay){
          for(var j in newDay){
              //Schedule in the same day
              if(oldDay[i] == newDay[j] && oldDay[i] != undefined){
                  if (Math.abs(newTime - oldTime) < 20) {
                  	if (!conflictDayFlags[j]) {
                  		var c = newDay[j];                        	
                  		vm.conflictDay.push(days[c]);
  	 						conflictDayFlags[j] = true;
                  	}
  	 					result = false;
                  }
              }
              
              //New schedule days ahead current scheduled days
              if(newDay[j] - oldDay[i] == 1 || newDay[j] - oldDay[i] == -6){
              	if (newTime < oldTime) {
              		if ((1440 + newTime - oldTime) < 20) {
              			if (!conflictDayFlags[j]) {
                      		var c = newDay[j];                        	
                      		vm.conflictDay.push(days[c]);
     	 						conflictDayFlags[j] = true;
                      	}
              			result = false;
              		} 
              	}
              }
              
              //New schedule days after current scheduled days
              if(oldDay[i] - newDay[j] == 1 || oldDay[i] - newDay[j] == -6){
              	if (oldTime < newTime) {
              		if ((1440 + oldTime - newTime) < 20) {
              			if (!conflictDayFlags[j]) {
                      		var c = newDay[j];                        	
                      		vm.conflictDay.push(days[c]);
     	 						conflictDayFlags[j] = true;
                      	}
              			result = false;
              		}
              	}
              }
          }
      }               	 		
  
      
      return result;
  };

	//schedule function
	vm.scheduled=function(postitem){
   vm.shedule[postitem]=false;
   vm.sending[postitem]=true;
   vm.validSchedule=true;
   vm.invalidScheduleDays=false;

   var daysArray=[];
   angular.forEach(vm.days[postitem],function(val,key){
     if(val.active == true){
      var key1=key.toString();
      daysArray.push(key1);
    }
  });
   var time=vm.Timedisplay[postitem] + vm.Timedisplay1[postitem];
   var timeSection;
   if(vm.timesection[postitem] == "AM"){
     timeSection=0;
   }
   else{
     timeSection=1;
   }
   var postdata=vm.item[postitem - 1];
   var data=[{}];
   data[0].climateIndex=postdata.climateIndex;
   var setClimate = vm.colorpicker[postitem].red;
   data[0].reservHvacInfoDetail={};
   if(vm.mintemp[postitem]){
    if(vm.mintemplist[postitem] == "High")
      setClimate = 90;
    else
      setClimate = 62;
   }

   data[0].reservHvacInfoDetail.airTemp={"unit":postdata.reservHvacInfoDetail.airTemp.unit,
   "value":{"hexValue":tempToHex(setClimate)}};
   data[0].reservHvacInfoDetail.climateSet=vm.climatestatus[postitem];
   data[0].reservHvacInfoDetail.defrost=vm.defrosterstatus[postitem];
   data[0].reservHvacInfoDetail.reservInfo={"day":daysArray,"time":
   {"time":time,
   "timeSection":timeSection
 },

};

data[0].schedId=postdata.schedId;

vm.validScheduleDaysRule(postitem);

if(!vm.invalidScheduleDays){
vm.timeMins();
vm.dayList();
if(postitem == 1){
	vm.validSchedule = vm.validScheduleRule(vm.timeVale2, vm.timeVale1, vm.daysList2, vm.daysList1);
}else{
	vm.validSchedule = vm.validScheduleRule(vm.timeVale1, vm.timeVale2, vm.daysList1, vm.daysList2);	
}


if(vm.validSchedule){
climateService.reserveInfo(data, offsetValue).then(function(resp){
  if(resp.success=true){
    vm.success[postitem]=true;
 vm.sending[postitem]=false;
  }
 
 climateService.scheduledInfo().then(function(resp){
   var item = resp.serviceResponse;
   scheduled(item[postitem - 1],postitem);

 });
 
});	
	}
}
};

}];



