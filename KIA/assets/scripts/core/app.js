var numberScheduleI, numberScheduleII, numberHvacI, numberHvacII;
var daySchedule, dayScheduleTwo, dayHvac, dayHvacTwo;
var aWeek = 7;
var Dates = new Array("SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT");
var dates = new Array("sun", "mon", "tue", "wed", "thu", "fri", "sat");
var initSchedule = {"reservInfos" : {"reservChargeInfo":[{"chargeIndex":0,"reservChargeInfoDetail":{"chargeRatio":100,"reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}},"reservType":1,"resvChargeSet":false}},{"chargeIndex":1,"reservChargeInfoDetail":{"chargeRatio":80,"reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}},"reservType":1,"resvChargeSet":false}}],"reservHvacInfo":[{"climateIndex":"0","reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"12"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}}}},{"climateIndex":"1","reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"12"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0000","timeSection":0}}}}]} };
var tempUnit = "f";

var global = {
    common : {
        _tmsData : null
    },
    init : function(){
        $("body").hide();
        if (serviceBlocked == 1){
            global.blockUI();
            global.pollForFlag(); 
        }
        
        global.initTmsStatus();
    }, 
    initTmsStatus : function(){
         $.ajax({
            cache: false,
            type: 'get',
            dataType: 'json',
            url: '/ccw/ev/vehicleStatusCached.do' 
        }).done(function(data){
            if(data.success == 'false'){
                $('body').attr('class', 'error'); $('#tmsErrorMessage').show();
                stopTimer = setTimeout(function(){
                    $('body').attr('class', '');},3000);
                global.common._tmsData = {airCtrlOn:"false",engine:"false",doorLock:"false",doorOpen:{frontLeft:"0",frontRight:"0",backLeft:"0",backRight:"0"},trunkOpen:"false",airTemp:{unit:0,value:{hexValue:"01"}},defrost:"false",acc:"false",eVStatus:{batteryCharge:false,drvDistance:[{type:2,distanceType:{value:"--",unit:3}}],batteryStatus:10,batteryPlugin:0,remainTime:[{value:0,unit:1},{value:0,unit:1}]}};
            }
            else{
                global.common._tmsData = data;
                tempUnit = (data.userTempPref == 1 ? 'f' : 'c');
            } 
            $('#tmsRefresh').show();
            $.when(uvo.getVehicles()).done(function (vehiclesData) {

                $.each(vehiclesData.vehicles, function (index, data) {                	
                    if (data.vin == vehiclesData.selectedVin) {                        
                         $('.alert span').text("Last updated as of " + moment(data.vehicleStatusTimeStamp).format("MMMM DD, YYYY h:mm a")) ;
                    }
                });

            });
            global.updateView(); 
        }); 
//console.log('uvo', uvo)
         $('#tmsRefresh').on('click', function(){
             url = "/ccw/ev/vehicleStatus.do";
             var obj = {}; 
             obj.url = url; 
             obj.data = null;
             obj.type = 'get';
             global.tmsServer(obj);
         }); 
    },
    updateOutsideTemp: function() {
//        $.ajax({
//            dataType: "json",
//            url: '/ccw/ev/vehicleLocation.do'
//        }).success(function(res) {
//            $("<div>").text("Service 71:").appendTo(".test-service-71");
//            renderObj($(".test-service-71"), collection.attributes);
//            var params = '?lat=-34.397&lon=150.644';
//            var coords = collection.attributes.coord;
//            if (coords) {
//                params = '?lat='+coords.lat+'&lon='+coords.lon;
//            }
//
//            $.ajax({
//                dataType: "json",
//                url: '//api.openweathermap.org/data/2.5/weather' + params + '&units=imperial&callback=?'
//            }).done(function(res) {
//                $('#outside-container').show();
//                global.common._outsideTemp = (res.main.temp).toFixed(0);
//                $('#outside-temp').text(global.common._outsideTemp);
//            });
//        }).fail(function(res) {
//            var params = '?lat=-34.397&lon=150.644';
//            $.ajax({
//                dataType: "json",
//                url: '//api.openweathermap.org/data/2.5/weather' + params + '&units=imperial&callback=?'
//            }).done(function(res) {);
//                $('#outside-container').show();
//                global.common._outsideTemp = (res.main.temp).toFixed(0);
//                $('#outside-temp').text(global.common._outsideTemp);
//            });
//        });
        // Hardcode coords

        var params = '?lat=-34.397&lon=150.644'; 
        $.ajax({
            //dataType: "jsonp",
            cache: false,
            url: '/ccw/ev/outsideTemp.do'
           // dataType: "json",
           // url: '//api.openweathermap.org/data/2.5/weather' + params + '&units=imperial&callback=?'
           // url: '//api.wunderground.com/api/dc31968d96afaaf3/conditions/forecast/alert/q/33.683947300000000000,-117.794694199999980000.json'
            
        }).done(function(parsed_json) {
            if(parsed_json != null){
                global.common._outsideTemp = parseFloat(parsed_json).toFixed();
                global.common._outsideTemp = (tempUnit == 'f'? global.common._outsideTemp : Math.round((global.common._outsideTemp  -  32)  *  5/9));
                $('#outside-temp').text(global.common._outsideTemp);
                $('#outsideTemp').show();
                $('#noOutsideTemp').hide();
                if(tempUnit == 'f'){                	
                	$('#outTempF').show();
                	$('#outTempC').hide();
                } else {                	
                	$('#outTempF').hide();
                	$('#outTempC').show();
                }
            } else {            	
                $('#outsideTemp').hide();
                $('#noOutsideTemp').show();
            }
        }).fail(function() {
            $('#outsideTemp').hide();
            $('#noOutsideTemp').show();
        });
    },
    updateView : function (){
        var body = $('body').attr('id');
        switch(body){
            case 'psev-connect':
                global.initConnectPage(); 
                break; 
            case 'psev-battery':
                global.initBatteryPage(); 
                break;
            case 'psev-lock':
                global.initLockPage(); 
                break;
            case 'psev-climate':
                global.initClimatePage(); 
                break; 
            case 'psev-charging':
                break;
            case 'psev-findCar':
                break;
        }
       $("body").show();  
    },
    initLockPage : function () {
        $('#leftLock').addClass("selected");
        var imgPath = "/images/";
        var iconPath = imgPath + "icons/original/"; 
        var doorPath = imgPath + "lock/doors/"; 
        
        var tmsData = global.common._tmsData; 
        var lockedStatus = tmsData.doorLock; 
        var doorsStatus = tmsData.doorOpen; 
        var trunkStatus = tmsData.trunkOpen;

        $("#c1").hide(); 
        $("#c2").hide(); 
        $("#c3").hide(); 
        $("#c4").hide(); 
        $("#c5").hide(); 


        $('#toggle-unlock').click(function() {
            var url = "/ccw/ev/unlockDoor.do"; 
            
            var obj = {};
            obj.url = url;
            obj.data = null;
            obj.type = 'get';

            global.tmsServer(obj);
        });

        $('#toggle-lock').on('click', function(){
            //if(allDoorsClosedCheck(trunkStatus,  doorsStatus) == true){
                var url = "/ccw/ev/lockDoor.do";
                
                var obj = {};
                obj.url = url;
                obj.data = null;
                obj.type = 'get';

                global.tmsServer(obj);
                
            /*}else{
                global.blockUI('<p style="margin-top:-40px; margin-left:120px">Please make sure all of the doors are closed. After closing the vehicle doors, please update the vehicle status by clicking on the refresh button.</p>');
            }*/
        });
        
        function allDoorsClosedCheck (trunkStatus,  doorsStatus){
            var doorCounter = 0;
            if(trunkStatus == "false"){
                doorCounter ++; 
                if(doorsStatus.frontLeft == "0" ){
                    doorCounter ++; 
                    if(doorsStatus.frontRight == "0"){ 
                        doorCounter ++; 
                        if(doorsStatus.backLeft == "0" ){ 
                            doorCounter ++; 
                            if(doorsStatus.backRight == "0"){                             
                                doorCounter ++; 
           }}}}}
           
            if(doorCounter == 5){
               return true; 
           }else{
               return false; 
           }
        }
        
        
        var lockedStatusImg; 
        var lockedStatusCopy;

        switch(lockedStatus){
            case "true":
                lockedStatusImg = iconPath + "locked.png";
                lockedStatusCopy = "YOUR VEHICLE IS LOCKED";
                break;
            case "false":
                lockedStatusImg = iconPath + "unlocked-on.png";
                lockedStatusCopy = "YOUR VEHICLE IS UNLOCKED";
                break;
        }
        
        
        
        /*function toggleLocks (){

            //todo: make this global function

            $('body').addClass('updating');

            var url; 
            //determine if we are locking or unlocking
            if(lockedStatus == "false"){
                url = "/ccw/ev/lockDoor.do"; 
            }else{
                url = "/ccw/ev/unlockDoor.do"; 
            }
            var obj = {};
            obj.url = url;
            obj.data = null;
            obj.type = 'get';

            global.tmsServer(obj);
            
            
        }*/
        
        //locked indicator
        $('#locked-status').attr('src', lockedStatusImg);
        $('#locked-status-header').html(lockedStatusCopy);

        //doors
        $('#d1').attr('src', doorPath + "01-" + global.returnDoorColor(doorsStatus.frontLeft, lockedStatus) + ".png");
        $('#d2').attr('src', doorPath + "02-" + global.returnDoorColor(doorsStatus.frontRight, lockedStatus) + ".png");
        $('#d3').attr('src', doorPath + "03-" + global.returnDoorColor(doorsStatus.backLeft, lockedStatus) + ".png");
        $('#d4').attr('src', doorPath + "04-" + global.returnDoorColor(doorsStatus.backRight, lockedStatus) + ".png");
        $('#d5').attr('src', doorPath + "05-" + global.returnTrunkColor(lockedStatus, trunkStatus) + ".png");
        
        $('#status-container').append(global.getLockStatusContainerHtml(lockedStatus, doorsStatus , trunkStatus)); 
    },
    initClimatePage : function (){
        /*********************************/
        //schedule functionality [start]  
        /*********************************/
        //global.blockUI();
        $.ajax({
            cache: false,
            type: 'get',
            dataType: 'json',
            url: '/ccw/ev/scheduledInfoCached.do'
        }).done(function(data){
            if(data.success == "false"){ //Two diff cases may happen. One receive default Obj with data from backend, the other receive Obj without data (Internal Server Error)
                $('body').attr('class', 'error'); $('#tmsErrorMessage').show();
                var remoteError = 'Error: ' + data.error; 
                
                $('#errorMessage').html(remoteError + '<a href="#" id="dismissButton" style="display:block; color:blue;">Dismiss></a>');
                
                var msgHeight = $('#errorMessage').height();
                var setMargin = (100 - msgHeight)/2; //100 is the height of parent DIV
                $('#errorMessage').css({top : setMargin+'px'});
                
                stopTimer = setTimeout(function(){
                    $('body').attr('class', '');},3000);
                
                $('#dismissButton').on('click', function(){
                    $('#uiBlock').remove(); 
                });
                
                if(data.error == "Internal Server Error") //Received Obj WITHOUT data from backend, then display default data from frontend.
                {
                    var data = initSchedule;
                    global.initHvacSchedule(data);
                }
                else //Received Obj WITH data from backend
                    global.initHvacSchedule(data);
            }
            else{ //Succesful getting data from scheduledInfoCached.do
                $('#uiBlock').remove();
                global.initHvacSchedule(data); 
            }
            resetTemp();
        });
        
        $('#MON, #TUE, #WED, #THU, #FRI, #SAT, #SUN, #mon, #tue, #wed, #thu, #fri, #sat, #sun').click(function(){
            $(this).toggleClass("selected");
        });
        $('#hvac-set-one, #hvac-set-two, #defrost-set-one, #defrost-set-two').click(function(){
            $(this).toggleClass("on");
        });
        $('#arrow-btn-one').click(function(){
            $(this).toggleClass("up");
            $('#climate-schedule-one').toggleClass("show-schedule");
        });
        $('#arrow-btn-two').click(function(){
            $(this).toggleClass("up");
            $('#climate-schedule-two').toggleClass("show-schedule");
        });
        
        $('#climateHint').mouseenter(function(){
            $('#climateMsg').show();
        }).mouseleave(function(){
            $('#climateMsg').hide();
        });

        /*********************************/
        //schedule functionality [end]
        /*********************************/  
        $('#leftClimate').addClass("selected");
        var currTemp; 
        if(global.common._tmsData.airTemp.value.hexValue == 01){
            vehicleTemp = '--';
            currTemp =  global.hexConvert('02', 'f'); 
        }else{
            var vehicleTemp = global.hexConvert(global.common._tmsData.airTemp.value.hexValue);
            currTemp = global.hexConvert(global.common._tmsData.airTemp.value.hexValue); 
        }

        if(global.common._tmsData.eVStatus.batteryPlugin == 0){ //Vehicle not plugged in
            $('#disableDefrost').show();
            $('#startDefrost, stopDefrost').hide();
        } else { //Vehicle Charger plugged in
            $('#disableDefrost').hide();
            if(global.common._tmsData.defrost == "false"){ //Defrost OFF
                $('#stopDefrost').hide();
                $('#startDefrost').show();
            } else { //Defrost ON
                $('#stopDefrost').show();
                $('#startDefrost').hide();
            }
        }
         
        var airCtrlOn = global.common._tmsData.airCtrlOn;
        
        if(airCtrlOn == "true"){
            $('#climate-onoff .btn').html("TURN CLIMATE OFF");
            $('#climateHint').show();
        }else{
            $('#climate-onoff, #climateHint').hide();
            //$('#climate-onoff .btn').html("TURN CLIMATE ON");
        }
        
        $('#vehicle-temp').html(vehicleTemp + '<sup>&#x2da;</sup>');
        
        $('#minus').on("click", function(){
            if(tempUnit == "f"){
                if(currTemp > global.minTempUnitCheck(tempUnit)){
                    currTemp --;
                    global.setClimateTemp(currTemp, tempUnit);
                }
            } else { //tempUnit == "c"
                if(currTemp > global.minTempUnitCheck(tempUnit)){
                    currTemp = currTemp - .5;
                    global.setClimateTemp(currTemp, tempUnit);
                }
            }
        });
        $('#plus').on("click", function(){
            if(tempUnit == "f"){
                if(currTemp < global.maxTempUnitCheck(tempUnit)){
                    currTemp ++;
                    global.setClimateTemp(currTemp, tempUnit);
                }
            } else { //tempUnit == "c"
                if(currTemp < global.maxTempUnitCheck(tempUnit)){
                    currTemp = currTemp + .5;
                    global.setClimateTemp(currTemp, tempUnit);
                }
            }
        });
        $('#max').on("click", function(){
            currTemp = global.maxTempUnitCheck(tempUnit);
            global.setClimateTemp(currTemp, tempUnit);
        });
        $('#min').on("click", function(){
            currTemp = global.minTempUnitCheck(tempUnit);
            global.setClimateTemp(currTemp, tempUnit);
        });
        
        $('#f').on("click", setTempUnitF);
        $('#c').on("click", setTempUnitC);
        
        if(global.common._tmsData.airTemp.value.hexValue == 01){
            global.common._tmsData.airTemp.value.hexValue = '02'; 
        }
        $('#climate-onoff').on("click", function(){
            var url;
            var hvcInfo = {"defrost":false,"airTemp":{"unit":1,"value":{"hexValue":global.hexConvert(currTemp, 'h')}}};
            var obj = {};
            if(airCtrlOn == "true"){
                url = "cancelImmediateHVAC.do"; 
                obj.type = "get";
                airCtrlOn = false;
                //$('#climate-onoff .btn').text('TURN CLIMATE ON');
            }else{
                url = "immediateHVAC.do";
                obj.type = "post";
                airCtrlOn = true;
                //$('#climate-onoff .btn').text('TURN CLIMATE OFF');
            }
             
            obj.url = url; 
            obj.data = {hvcInfo: JSON.stringify(hvcInfo)};
            
            global.tmsServer(obj);
            
        });
        
        $('#send' ).on('click', sendClimate);
        $('#defroster').on('click', sendDefrost);
        $('#stopDefroster').on('click', stopDefrost);
        
        function sendClimate(){
            var hvcInfo = {"defrost":false,"airTemp":{"unit":1,"value":{"hexValue":global.hexConvert(currTemp, 'h')}}};
            url = "immediateHVAC.do"; 
            var obj = {}; 
            obj.url = url; 
            obj.data = {hvcInfo: JSON.stringify(hvcInfo)};
            global.tmsServer(obj);
        };
        
        
        function sendDefrost(){
            var hvcInfo = {"defrost":true,"airTemp":{"unit":1,"value":{"hexValue":global.hexConvert(currTemp, 'h')}}};
            url = "immediateHVAC.do"; 
            var obj = {}; 
            obj.url = url; 
            obj.data = {hvcInfo: JSON.stringify(hvcInfo)};
            global.tmsServer(obj);
        };
        
        function stopDefrost(){
            var hvcInfo = {"defrost":false,"airTemp":{"unit":1,"value":{"hexValue":global.hexConvert(currTemp, 'h')}}};
            var url = "cancelImmediateHVAC.do"; 
            var obj = {}; 
            obj.url = url;
            obj.type = "get";
            obj.data = {hvcInfo: JSON.stringify(hvcInfo)};
            global.tmsServer(obj);
        };
        
        function setTempUnitF(){
            url = "updateTempPref.do"; 
            var obj = {}; 
            obj.url = url;
            obj.type = 'get';
            obj.data = {flag:1};
            global.tmsServer(obj);
        }
        
		function setTempUnitC(){
			url = "updateTempPref.do"; 
            var obj = {}; 
            obj.url = url;
            obj.type = 'get';
            obj.data = {flag:0};
            global.tmsServer(obj);
		}
        
        function resetTemp(){
            var newTemp;
            if(tempUnit == "f"){
                if(currTemp < 62){
                    $('#f').addClass("active");
                    $('#c').removeClass("active");
                    newTemp = global.hexConvert(currTemp);  //Convert C to F
                    vehicleTemp = global.hexConvert(vehicleTemp); //Convert C to F
                    currTemp = newTemp;
                    $('#max-value').html(90 + "<sup>&#x2da;</sup>"); 
                    $('#min-value').html(62 + "<sup>&#x2da;</sup>"); 
                    
                    global.common._outsideTemp = Math.round(global.common._outsideTemp  *  9/5 + 32);
                }
                $('#sliderC, #sliderIIC').hide();
                $('#sliderF, #sliderIIF').show();
            }else{
                if (currTemp >= 62){
                    $('#c').addClass("active");
                    $('#f').removeClass("active");
                    newTemp = global.hexConvert(currTemp); //Convert F to C
                    vehicleTemp = global.hexConvert(vehicleTemp);  //Convert F to C
                    currTemp = newTemp;
                    $('#max-value').html(32 + "<sup>&#x2da;</sup>"); 
                    $('#min-value').html(17 + "<sup>&#x2da;</sup>");
                    if( global.common._outsideTemp != undefined)
                    global.common._outsideTemp = Math.round((global.common._outsideTemp  -  32)  *  5/9);
                }
                $('#sliderF, #sliderIIF').hide();
                $('#sliderC, #sliderIIC').show();
            }
              
            global.setClimateTemp(currTemp, tempUnit);
            $('#vehicle-temp').html(vehicleTemp + "<sup>&#x2da;</sup>");

            if( global.common._outsideTemp != undefined){            	
            	$('#outside-temp').text(global.common._outsideTemp);            	
            }
        };
        global.setClimateTemp(currTemp, tempUnit);
        global.updateOutsideTemp();
         
      },
      /*
        hexConvert function will do the conversion between Hex number and C & F degree
        a Hex number with parameter unit=c will be converted to C degree, without unit=c will be converted to F degree
        a temperature number (C or F) with parameter unit=h will be converted to Hex number, without unit=h will be converted to the other degree (C to F, or F to C)
       */
      hexConvert : function (num, unit){
          var temp; 
          switch(num){
              case '--': 
                  temp = '--'; 
                  break; 
              // Convert HEX number to Cel or Fer temp
              case '02':
                  temp = (unit == 'c')? 17 : 62;  
                  break; 
              case '03':
                  temp = (unit == 'c')? 17.5 : 62; 
                  break;
              case '04':
                  temp = (unit == 'c')? 18 : 63;
                  break;
              case '05':
                  temp = (unit == 'c')? 18.5 : 64;
                  break;
              case '06':
                  temp = (unit == 'c')? 19 : 65;
                  break;
              case '07':
                  temp = (unit == 'c')? 19.5 : 66;
                  break;
              case '08':
                  temp = (unit == 'c')? 20 : 67;
                  break;
              case '09':
                  temp = (unit == 'c')? 20.5 : 68;
                  break;
              case '0A':
              case '0a':
                  temp = (unit == 'c')? 21 : 69;
                  break;
              case '0B':
              case '0b':
                  temp = (unit == 'c')? 21.5 : 70;
                  break;
              case '0C':
              case '0c':
                  temp = (unit == 'c')? 22 : 71;
                  break;
              case '0D':
              case '0d':
                  temp = (unit == 'c')? 22.5 : 72;
                  break;
              case '0E':
              case '0e':
                  temp = (unit == 'c')? 23 : 73;
                  break;
              case '0F':
              case '0f':
                  temp = (unit == 'c')? 23.5 : 74;
                  break;
              case '10':
                  temp = (unit == 'c')? 24 : 75;
                  break;
              case '11':
                  temp = (unit == 'c')? 24.5 : 76;
                  break;
              case '12':
                  temp = (unit == 'c')? 25 : 77;
                  break;
              case '13':
                  temp = (unit == 'c')? 25.5 : 78;
                  break;
              case '14':
                  temp = (unit == 'c')? 26 : 79;
                  break;
              case '15':
                  temp = (unit == 'c')? 26.5 : 80;
                  break;
              case '16':
                  temp = (unit == 'c')? 27 : 81;
                  break;
              case '17':
                  temp = (unit == 'c')? 27.5 : 82;
                  break;
              case '18':
                  temp = (unit == 'c')? 28 : 83;
                  break;
              case '19':
                  temp = (unit == 'c')? 28.5 : 84;
                  break;
              case '1A':
              case '1a':
                  temp = (unit == 'c')? 29 : 85;
                  break;
              case '1B':
              case '1b':
                  temp = (unit == 'c')? 29.5 : 86;
                  break;
              case '1C':
              case '1c':
                  temp = (unit == 'c')? 30 : 87;
                  break;
              case '1D':
              case '1d':
                  temp = (unit == 'c')? 30.5 : 88;
                  break;
              case '1E':
              case '1e':
                  temp = (unit == 'c')? 31 : 89;
                  break;
              case '1F':
              case '1f':
                  temp = (unit == 'c')? 31.5 : 89;
                  break;
              case '20':
                  temp = (unit == 'c')? 32 : 90;
                  break;
              // Ending convert HEX number
              
              // Convert Cel temp to HEX number or F temp
              case 17:
                  temp = (unit == 'h')? '02' : 62;
                  break;
              case 17.5:
                  temp = (unit == 'h')? '03' : 62;
                  break;
              case 18:
                  temp = (unit == 'h')? '04' : 63;
                  break;
              case 18.5:
                  temp = (unit == 'h')? '05' : 64;
                  break;
              case 19:
                  temp = (unit == 'h')? '06' : 65;
                  break;
              case 19.5:
                  temp = (unit == 'h')? '07' : 66;
                  break;
              case 20:
                  temp = (unit == 'h')? '08' : 67;
                  break;
              case 20.5:
                  temp = (unit == 'h')? '09' : 68;
                  break;
              case 21:
                  temp = (unit == 'h')? '0A' : 69;
                  break;
              case 21.5:
                  temp = (unit == 'h')? '0B' : 70;
                  break;
              case 22:
                  temp = (unit == 'h')? '0C' : 71;
                  break;
              case 22.5:
                  temp = (unit == 'h')? '0D' : 72;
                  break;
              case 23:
                  temp = (unit == 'h')? '0E' : 73;
                  break;
              case 23.5:
                  temp = (unit == 'h')? '0F' : 74;
                  break;
              case 24:
                  temp = (unit == 'h')? '10' : 75;
                  break;
              case 24.5:
                  temp = (unit == 'h')? '11' : 76;
                  break;
              case 25:
                  temp = (unit == 'h')? '12' : 77;
                  break;
              case 25.5:
                  temp = (unit == 'h')? '13' : 78;
                  break;
              case 26:
                  temp = (unit == 'h')? '14' : 79;
                  break;
              case 26.5:
                  temp = (unit == 'h')? '15' : 80;
                  break;
              case 27:
                  temp = (unit == 'h')? '16' : 81;
                  break;
              case 27.5:
                  temp = (unit == 'h')? '17' : 82;
                  break;
              case 28:
                  temp = (unit == 'h')? '18' : 83;
                  break;
              case 28.5:
                  temp = (unit == 'h')? '19' : 84;
                  break;
              case 29:
                  temp = (unit == 'h')? '1A' : 85;
                  break;
              case 29.5:
                  temp = (unit == 'h')? '1B' : 86;
                  break;
              case 30:
                  temp = (unit == 'h')? '1C' : 87;
                  break;
              case 30.5:
                  temp = (unit == 'h')? '1D' : 88;
                  break;
              case 31:
                  temp = (unit == 'h')? '1E' : 89;
                  break;
              case 31.5:
                  temp = (unit == 'h')? '1F' : 89;
                  break;
              case 32:
                  temp = (unit == 'h')? '20' : 90;
                  break;
                  
              // Convert Fer temp to HEX number or Cel temp
              case 62:
                  temp = (unit == 'h')? '02' : 17;
                  break;
              case 63:
                  temp = (unit == 'h')? '04' : 18;
                  break;
              case 64:
                  temp = (unit == 'h')? '05' : 18.5;
                  break;
              case 65:
                  temp = (unit == 'h')? '06' : 19;
                  break;
              case 66:
                  temp = (unit == 'h')? '07' : 19.5;
                  break;
              case 67:
                  temp = (unit == 'h')? '08' : 20;
                  break;
              case 68:
                  temp = (unit == 'h')? '09' : 20.5;
                  break;
              case 69:
                  temp = (unit == 'h')? '0A' : 21;
                  break;
              case 70:
                  temp = (unit == 'h')? '0B' : 21.5;
                  break;
              case 71:
                  temp = (unit == 'h')? '0C' : 22;
                  break;
              case 72:
                  temp = (unit == 'h')? '0D' : 22.5;
                  break;
              case 73:
                  temp = (unit == 'h')? '0E' : 23;
                  break;
              case 74:
                  temp = (unit == 'h')? '0F' : 23.5;
                  break;
              case 75:
                  temp = (unit == 'h')? '10' : 24;
                  break;
              case 76:
                  temp = (unit == 'h')? '11' : 24.5;
                  break;
              case 77:
                  temp = (unit == 'h')? '12' : 25;
                  break;
              case 78:
                  temp = (unit == 'h')? '13' : 25.5;
                  break;
              case 79:
                  temp = (unit == 'h')? '14' : 26;
                  break;
              case 80:
                  temp = (unit == 'h')? '15' : 26.5;
                  break;
              case 81:
                  temp = (unit == 'h')? '16' : 27;
                  break;
              case 82:
                  temp = (unit == 'h')? '17' : 27.5;
                  break;
              case 83:
                  temp = (unit == 'h')? '18' : 28;
                  break;
              case 84:
                  temp = (unit == 'h')? '19' : 28.5;
                  break;
              case 85:
                  temp = (unit == 'h')? '1A' : 29;
                  break;
              case 86:
                  temp = (unit == 'h')? '1B' : 29.5;
                  break;
              case 87:
                  temp = (unit == 'h')? '1C' : 30;
                  break;
              case 88:
                  temp = (unit == 'h')? '1D' : 30.5;
                  break;
              case 89:
                  temp = (unit == 'h')? '1E' : 31;
                  break;
              case 90:
                  temp = (unit == 'h')? '20' : 32;
                  break;
              default:
                  temp = (unit == 'h'? '02' : (unit == 'c'? 17 : 62));
          }
          return temp; 
      },
      maxTempUnitCheck : function (unit){
          var num; 
          if(unit == "f"){
              num = 90; 
          }else{
              num = 32; 
          }
          return num; 
      }, 
      minTempUnitCheck : function (unit){
          var num;
          if(unit == "f"){
              num = 62; 
          }else{
              num = 17; 
          }
          return num; 
      }, 
      setClimateTemp : function (temp, unit){
          var degree = "<sup>&#x2da;</sup>";
          if(unit == 'c'){
              $('#tempCnumber').html(temp.toString().substring(0,2));
              if(temp.toString().length > 2)
                  $('#tempCdecimal').show();
              else
                  $('#tempCdecimal').hide();
              $('#temp').hide();
              $('#tempC').show();
          } else {
              $('#temp').html(temp + degree);
              $('#temp').show();
              $('#tempC').hide();
          }
      },
    initConnectPage : function (){
        $('#rangeCalculate').mouseenter(function(){
            $('#rangeCalMsg').show();
        }).mouseleave(function(){
            $('#rangeCalMsg').hide();
        });
        
        $('#leftConnect').addClass("selected");  
        var data = global.common._tmsData; 
        var evStatus = global.common._tmsData.eVStatus;  
        
        var batteryPlugin = evStatus.batteryPlugin; 
        var batteryCharge = evStatus.batteryCharge;
        var batteryStatus = evStatus.batteryStatus;
        var batteryPlugStatus = evStatus.batteryPlugin;
        
        global.initBatteryGauge(batteryStatus); 
        
        initLockStatus();
        initVehicleTemp(); 
        var batteryIsCharging = evStatus.batteryCharge; 
        var batteryStatus = evStatus.batteryStatus;
        
        global.initBatteryStatus(batteryPlugStatus, batteryIsCharging);
        
        function initLockStatus (){
            var tmsData = global.common._tmsData;
            var lockedStatus = tmsData.doorLock;

            if(lockedStatus =="true"){
                $('#lock-status').html('YOUR VEHICLE IS LOCKED');
                img = '/images/icons/original/locked.png'; 
            }else{
                $('#lock-status').html('YOUR VEHICLE IS UNLOCKED');
                img = '/images/icons/original/unlocked-on.png'; 
            }
            $('#locked-status-image').attr('src', img); 
            
        };
        function initVehicleTemp(){
            var tmsData = global.common._tmsData;
            var tempUnit = tmsData.userTempPref;
            if(global.common._tmsData.airTemp.value.hexValue == 01){
                vehicleTemp = '--'; 
            }else{
                var vehicleTemp = global.hexConvert(global.common._tmsData.airTemp.value.hexValue); 
            }           
            if(tempUnit == "1"){
                tempUnit = "F"; 
            }else{
                tempUnit = "C"; 
            }
            
            
            $('#vehicle-temp').html(vehicleTemp);
            $('#temp-unit').html(tempUnit); 
            
            
        }
        global.updateOutsideTemp();
        
    },
    
    initBatteryPage : function (){
        $('#rangeCalculate').mouseenter(function(){
            $('#rangeCalMsg').show();
        }).mouseleave(function(){
            $('#rangeCalMsg').hide();
        });
        /*********************************/
        //schedule functionality [start] -ANTHONY 
        /*********************************/
        //global.blockUI();
        $.ajax({
            cache: false,
            type: 'get',
            dataType: 'json',
            url: 'scheduledInfoCached.do',
            context: document.body
        }).done(function(data){
            if(data.success == "false"){ //Two diff cases may happen. One receive default Obj with data from backend, the other receive Obj without data (Internal Server Error)
                $('body').attr('class', 'error'); $('#tmsErrorMessage').show();
                var remoteError = 'Error: ' + data.error; 
                
                $('#errorMessage').html(remoteError + '<a href="#" id="dismissButton" style="display:block; color:blue;">Dismiss></a>');
                
                var msgHeight = $('#errorMessage').height();
                var setMargin = (100 - msgHeight)/2; //100 is the height of parent DIV
                $('#errorMessage').css({top : setMargin+'px'});
                
                stopTimer = setTimeout(function(){
                    $('body').attr('class', '');},3000);
                
                $('#dismissButton').on('click', function(){
                    $('#uiBlock').remove(); 
                });
                
                if(data.error == "Internal Server Error") //Received Obj WITHOUT data from backend, then display default data from frontend.
                {
                    var data = initSchedule;
                    global.initChargeSchedule(data);
                }
                else //Received Obj WITH data from backend
                    global.initChargeSchedule(data);
            }
            else{ //Succesful getting data from scheduledInfoCached.do
                $('#uiBlock').remove();
                global.initChargeSchedule(data); 
            }
        }); 
       
        $('#radioOne_eighty').click(function(){
            $(this).addClass("radioBtn_eighty_active");
            $('#radioOne_hundred').removeClass("radioBtn_hundred_active");
        });
        
        $('#radioOne_hundred').click(function(){
            $(this).addClass("radioBtn_hundred_active");
            $('#radioOne_eighty').removeClass("radioBtn_eighty_active");
        });
        
        $('#radioTwo_eighty').click(function(){
            $(this).addClass("radioBtn_eighty_active");
            $('#radioTwo_hundred').removeClass("radioBtn_hundred_active");
        });
        
        $('#radioTwo_hundred').click(function(){
            $(this).addClass("radioBtn_hundred_active");
            $('#radioTwo_eighty').removeClass("radioBtn_eighty_active");
        });
        
        $('#MON, #TUE, #WED, #THU, #FRI, #SAT, #SUN, #mon, #tue, #wed, #thu, #fri, #sat, #sun').click(function(){
            $(this).toggleClass("selected");
        });
        $('#charge-set, #charge-set-drive').click(function(){
            $(this).toggleClass("on");
        });
        $('#arrow-btn-start').click(function(){
            $(this).toggleClass("up");
            $('#chargeScheduleOne').toggleClass("show-schedule");
        });
        $('#arrow-btn-drive').click(function(){
            $(this).toggleClass("up");
            $('#chargeScheduleTwo').toggleClass("show-schedule");
        });
        /*********************************/
        //schedule functionality [end]
        /*********************************/
       
        $('#leftBattery').addClass("selected");
        var evStatus = global.common._tmsData.eVStatus;
        
        var batteryIsCharging = evStatus.batteryCharge; 
        var batteryPercentage = evStatus.batteryCharge;
        var batteryStatus = evStatus.batteryStatus;
        var batteryPlugStatus = evStatus.batteryPlugin; 
        
        var driveDistance = evStatus.drvDistance[0].distanceType.value;
        var driveDistanceUnit = evStatus.drvDistance[0].distanceType.unit;
        var targetPercentage = 100; 
    

        global.initBatteryGauge(batteryStatus); 

        global.initBatteryStatus(batteryPlugStatus, batteryIsCharging);
        
        if(batteryIsCharging == true)
            $('#perc-radio-img-80, #perc-radio-img-100').css('cursor','default');
        
        $('#charge-button').on('click', startCharging); 
        $('.perc-radio').on('click', function(){
            if(batteryIsCharging != true){
                $('#perc-radio-img-100').toggle();
                $('#perc-radio-img-80').toggle();
                if(targetPercentage == 100){
                    targetPercentage = 80;
                }else{
                    targetPercentage = 100;
                }
            }
            return false;
        }); 
        
        
        
        function startCharging(){
            var url; 
            var chrgInfo = '{"chargeRatio":'+targetPercentage+'}'; 
            var obj = {};
            
            /*
            if(batteryIsCharging == true){ //when charging, if clicked -> cancel
                url = "cancelImmediateCharge.do";
                obj.type = 'get';
            } else if( batteryPlugStatus != 0) { // when not charging (plug or unplug, if clicked -> start charge
                url= "immediateCharge.do";
                obj.type = 'post';
            }
            
            obj.url = url;
            obj.data = {chrgInfo: chrgInfo};
            global.tmsServer(obj);
            */
            
                if(batteryIsCharging == true){
                   //display are u sure u want to stop charging
                    url = "cancelImmediateCharge.do";
                    obj.type = 'get';
                 }else {
                     switch(batteryPlugStatus){
                         case 0:
                             global.blockUI('The vehicle must be plugged in before you can start charging'); 
                             
                             //battery is not plugged in error
                             break;
                         case 1: case 2: case 3:
                             //start the charge!
                             url= "immediateCharge.do";
                             obj.type = 'post';
                             break;
                     }
                 }
                if(batteryPlugStatus != 0){
                    obj.url = url;
                    obj.data = {chrgInfo: chrgInfo};
                    global.tmsServer(obj);
                }
                return false;
        };
        
    },
    initBatteryStatus :function(batteryPlugStatus, batteryIsCharging){
        var imagePluggedIn = "/images/battery/battery-plugged.png"; 
        var imageUnplugged = "/images/battery/battery-unplugged.png"; 
        var imageCharging = "/images/battery/battery-charging.png"; 
        var imageCharged =  "/images/battery/battery-charging-green.png";
        
        var img; 
        var batteryStatus;  

        if($('body').attr('id') != "psev-connect"){
            initChargeEstimate();
        }
	    
        if(batteryIsCharging == true ){
           img = imageCharging;
           status = "CURRENTLY CHARGING";
           $('.perc-radio').css('opacity','0.5');
           $('#charge-button').addClass('charging');
           $('#charge-button').html('STOP CHARGING'); 
        }else { 
             
             if(batteryPlugStatus == 0){
              
                 status = "NOT PLUGGED IN"; 
                 img = imageUnplugged; 
                 $('#charge-button').attr('class', 'btn');
                 $('#charge-button').html('START CHARGING');
             }else{
                 
                 status = "PLUGGED IN."; 
                 img = imagePluggedIn; 
                 $('#charge-button').addClass('not-charging');
                 $('#charge-button').html('START CHARGING');
             } 
        }
        function initChargeEstimate(){ 
            //$('#bottom-stations').hide(); 
            $('#bottom-charge-time').show();
            var totalTime;
            var evStatus = global.common._tmsData.eVStatus;  
            var plugStatus = evStatus.batteryPlugin; 
            var remainTime = evStatus.remainTime; 
            
            if(plugStatus != 1){
                //120 [0]
            	if(evStatus.remainTime[0] != null){
                $('#total-time-till-charge').html( evStatus.remainTime[0].value + " " + findTimeInterval()); 
            		$('#charge-type').html('LEVEL 1 (120V)');
            	}
                
                if(evStatus.remainTime[1] != null){
                $('#total-time-till-charge2').html( evStatus.remainTime[1].value + " " + findTimeInterval()); 
                	$('#charge-type2').html('LEVEL 2 (240V)');
                }
                //240 [0]
            }else{
            	/*if(plugStatus == 2){
	                $('#total-time-till-charge').html( evStatus.remainTime[1].value + " " + findTimeInterval());	                 
            	}else if(plugStatus == 3) {
            		$('#total-time-till-charge').html( evStatus.remainTime[0].value + " " + findTimeInterval()); 
            	}*/
            	$('#charge-type').html(findChargeType());
            }
            
            function findChargeType(){
                switch(batteryPlugStatus){
                    case 0:
                        //error
                    case 1: 
                        chargeType = "DC Fast Charge";
                        break; 
                    case 2: 
                        chargeType = "LEVEL 2 (240V)";
                        break; 
                    case 3: 
                        chargeType = " LEVEL 1 (120V)";
                        break;
                }
                return chargeType; 
            }
            
            
            function findTimeInterval(){
                var interval = "";
                switch(evStatus.remainTime[0].unit){
                    case 0:
                        interval = "hrs";
                        break;
                    case 1:
                        interval = "min";
                        break;
                    case 2:
                        interval = "msec";
                        break;
                    case 3:
                        interval = "sec";
                        break;
                }
                return interval; 
            }
            
            
            
          };
        $('#battery-status-img').attr('src', img);
        $('#battery-status-header').html(status);
     },
    initBatteryGauge : function(perc){
        var evStatus = global.common._tmsData.eVStatus;
        var driveDistance = evStatus.drvDistance[0].distanceType.value;
        var driveDistanceUnit = evStatus.drvDistance[0].distanceType.unit;
        
        $(".knobBattery").knob({
            draw : function () {

                // "tron" case
                if(this.$.data('skin') == 'tron') {

                    var a = this.angle(this.cv)  // Angle
                        , sa = this.startAngle          // Previous start angle
                        , sat = this.startAngle         // Start angle
                        , ea                            // Previous end angle
                        , eat = sat + a                 // End angle
                        , r = true;

                    this.g.lineWidth = this.lineWidth;

                    this.o.cursor
                        && (sat = eat - 0.3)
                        && (eat = eat + 0.3);

                    if (this.o.displayPrevious) {
                        ea = this.startAngle + this.angle(this.value);
                        this.o.cursor
                            && (sa = ea - 0.3)
                            && (ea = ea + 0.3);
                        this.g.beginPath();
                        this.g.strokeStyle = this.previousColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                        this.g.stroke();
                    }

                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                    this.g.stroke();

                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();

                    return false;
                }
            }
        });
        
        $("#percent-indicator").attr("class", "meter-value " + "val-"+perc );
        $("#percent-indicator").html(perc + "<span>%</span>");
        
        $(".knobBattery").val(perc).trigger('change');
        if(perc <= 20)
            $(".knobBattery").val(perc).trigger('configure',{"fgColor":"#BB1628"});

        var estRange =(driveDistance != '--') ? Math.round(driveDistance): driveDistance;
        
        
        $('#est-range').html(estRange);
        $('#range-unit').html(calculatRangeType()); 
        
        function calculatRangeType(){
            var type; 
            switch (driveDistanceUnit){
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
            }
            return type; 
        }; 
    },
    initChargeSchedule : function(chargeScheduleData){
        
        // Get values and Display for Schedule I
        var reserveChargeSet = chargeScheduleData.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.resvChargeSet;
        
        if (reserveChargeSet == true)
            $("#charge-set").addClass("on");
        
        var chargeRatio = chargeScheduleData.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.chargeRatio;

        if (chargeRatio == 100){
            $("#radioOne_hundred").addClass("radioBtn_hundred_active");
            $("#radioOne_eighty").removeClass("radioBtn_eighty_active");
        }
        else {
            $("#radioOne_eighty").addClass("radioBtn_eighty_active");
            $("#radioOne_hundred").removeClass("radioBtn_hundred_active");
        }
        
        var timeSchedule = chargeScheduleData.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.reservInfo.time.time;
        var timeSectionSchedule = chargeScheduleData.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.reservInfo.time.timeSection;
        
        daySchedule = chargeScheduleData.reservInfos.reservChargeInfo[0].reservChargeInfoDetail.reservInfo.day;
        var dateScheduled = '';
        
        var timeScheduleHour = timeSchedule.substring(0,2);
        var timeScheduleMinute = timeSchedule.substring(2);
    
        if (timeSectionSchedule == 0)
            numberScheduleI = 60*parseInt(timeScheduleHour) + parseInt(timeScheduleMinute);
        else
            numberScheduleI = 60*(parseInt(timeScheduleHour)+12) + parseInt(timeScheduleMinute);
        
        timeScheduleHour = (timeScheduleHour == '00'? '12': timeScheduleHour);
        var timeScheduleSection = (timeSectionSchedule == 0? ' a.m.' : ' p.m.');
        var timeScheduleSectionUpper = (timeSectionSchedule == 0? 'AM' : 'PM');
        
        for(i=0; i<aWeek; i++)
        {      
            if ( daySchedule[i] != null )
            {
                if (daySchedule[i] == 9)
                    dateScheduled = "No Reservation Setting in TMU";
                else
                    dateScheduled += Dates[daySchedule[i]] + '. ';
                $("#" + Dates[daySchedule[i]]).addClass("selected");
            }
        }
        
        $("#time-schedule").html("<span>" + timeScheduleHour + ":" + timeScheduleMinute + "</span>" + timeScheduleSection);
        $("#date-schedule").html(dateScheduled);
        
        $("#time-scheduleOne-hour").html(timeScheduleHour);
        $("#time-scheduleOne-minute").html(timeScheduleMinute);
        $("#time-scheduleOne-section").html(timeScheduleSectionUpper);

        //  Get values and Display for Schedule II
        var reserveChargeSetTwo = chargeScheduleData.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.resvChargeSet;
        if (reserveChargeSetTwo == true)
            $("#charge-set-drive").addClass("on");
            
        var chargeRatio = chargeScheduleData.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.chargeRatio;
        if (chargeRatio == 100){
            $("#radioTwo_hundred").addClass("radioBtn_hundred_active");
            $("#radioTwo_eighty").removeClass("radioBtn_eighty_active");
        }
        else{
            $("#radioTwo_eighty").addClass("radioBtn_eighty_active");
            $("#radioTwo_hundred").removeClass("radioBtn_hundred_active");
        }
        
        var timeScheduleTwo = chargeScheduleData.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.reservInfo.time.time;
        var timeSectionScheduleTwo = chargeScheduleData.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.reservInfo.time.timeSection;
        
        dayScheduleTwo = chargeScheduleData.reservInfos.reservChargeInfo[1].reservChargeInfoDetail.reservInfo.day;
        var dateScheduledTwo = '';
        
        var timeScheduleHourTwo = timeScheduleTwo.substring(0,2);
        var timeScheduleMinuteTwo = timeScheduleTwo.substring(2);
    
        if (timeSectionScheduleTwo == 0)
            numberScheduleII = 60*parseInt(timeScheduleHourTwo) + parseInt(timeScheduleMinuteTwo);
        else
            numberScheduleII = 60*(parseInt(timeScheduleHourTwo)+12) + parseInt(timeScheduleMinuteTwo);
        
        timeScheduleHourTwo = (timeScheduleHourTwo == '00'? '12': timeScheduleHourTwo);
        var timeScheduleSectionTwo = (timeSectionScheduleTwo == 0? ' a.m.' : ' p.m.');
        var timeScheduleSectionUpperTwo = (timeSectionScheduleTwo == 0? 'AM' : 'PM');
        
        for(i=0; i<aWeek; i++)
        {      
            if ( dayScheduleTwo[i] != null )
            {
                if (dayScheduleTwo[i] == 9)
                    dateScheduledTwo = "No Reservation Setting in TMU";
                else
                    dateScheduledTwo += Dates[dayScheduleTwo[i]] + '. ';
                $("#" + dates[dayScheduleTwo[i]]).addClass("selected");
            }
        }
        
        $("#time-schedule-two").html("<span>" + timeScheduleHourTwo + ":" + timeScheduleMinuteTwo + "</span>" + timeScheduleSectionTwo);
        $("#date-schedule-two").html(dateScheduledTwo);

        $("#time-scheduleTwo-hour").html(timeScheduleHourTwo);
        $("#time-scheduleTwo-minute").html(timeScheduleMinuteTwo);
        $("#time-scheduleTwo-section").html(timeScheduleSectionUpperTwo);
    },
    initHvacSchedule : function(hvacScheduleData){
        //  Get values and Display for Schedule I
        var tempValueOne = global.hexConvert(hvacScheduleData.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.airTemp.value.hexValue);
        var tempValueOneC = global.hexConvert(hvacScheduleData.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.airTemp.value.hexValue, 'c');

        //Create slider in F for schedule I
        $('#sliderOne').slider({
            value: tempValueOne,
            min: 62,
            max: 90,
            create: setInputsSliderOne,
            slide: setInputsSliderOne,
            stop: setInputsSliderOne
        });
        
        function setInputsSliderOne(){
            //values slide for F
            $('.ui-sliderOne-range').width(($('#sliderOne').slider("value")-60)*15);
            $('#tempValueOne').text($('#sliderOne').slider("value"));
            
            //values slide for C
            tempValueOneC = global.hexConvert($('#sliderOne').slider("value"));
            $('#tempValueOneC').text(tempValueOneC);
            
            var handleToLeftValue = $('#sliderOne a').css('left');
            
            $('#sliderOneC a').css('left',handleToLeftValue);
            $('.ui-sliderOneC-range').width((tempValueOneC-17)*30);
        }
        //End of create slider in F for schedule I
        
        //Create slider in C for schedule I
        $('#sliderOneC').slider({
            value: tempValueOneC,
            min: 17,
            max: 32,
            step: .5,
            create: setInputsSliderOneC,
            slide: setInputsSliderOneC,
            stop: setInputsSliderOneC
        });
        
        function setInputsSliderOneC(){
            //values slide for C
            $('.ui-sliderOneC-range').width(($('#sliderOneC').slider("value")-17)*30);
            $('#tempValueOneC').text($('#sliderOneC').slider("value"));
            
            //values slide for F
            tempValueOne = global.hexConvert($('#sliderOneC').slider("value"));
            $('#tempValueOne').text(tempValueOne);
            
            var handleToLeftValue = $('#sliderOneC a').css('left');
            
            $('#sliderOne a').css('left',handleToLeftValue);
            $('.ui-sliderOne-range').width((tempValueOne-60)*15);
        }
        //End of create slider in C for schedule I
        
        
        var climateSet = hvacScheduleData.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.climateSet;
        if (climateSet == "true")
            $("#hvac-set-one").addClass("on");
        
        var defrostSet = hvacScheduleData.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.defrost;
        if (defrostSet == "true")
            $("#defrost-set-one").addClass("on");
    
        var timeHvac = hvacScheduleData.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.reservInfo.time.time;
        var timeSectionHvac = hvacScheduleData.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.reservInfo.time.timeSection;
        
        dayHvac = hvacScheduleData.reservInfos.reservHvacInfo[0].reservHvacInfoDetail.reservInfo.day;
        var dateHvac = '';
        
        var timeHvacHour = timeHvac.substring(0,2); 
        var timeHvacMinute = timeHvac.substring(2);
        
        if (timeSectionHvac == 0)
            numberHvacI = 60*parseInt(timeHvacHour) + parseInt(timeHvacMinute);
        else
            numberHvacI = 60*(parseInt(timeHvacHour)+12) + parseInt(timeHvacMinute);
        
        timeHvacHour = (timeHvacHour == '00'? '12': timeHvacHour);
        var timeHvacSection = (timeSectionHvac == 0? ' a.m.' : ' p.m.');
        var timeHvacSectionUpper = (timeSectionHvac == 0? 'AM' : 'PM');
        
        for(i=0; i<aWeek; i++)
        {    
            if ( dayHvac[i] != null )
            {
                if (dayHvac[i] == 9)
                    dateHvac = "No Reservation Setting in TMU";
                else
                    dateHvac += Dates[dayHvac[i]] + '. ';
                $("#" + Dates[dayHvac[i]]).addClass("selected");
            }
        }
    
        $("#time-hvac").html("<span>" + timeHvacHour + ":" + timeHvacMinute + "</span>" + timeHvacSection);
        $("#date-hvac").html(dateHvac);
        
        $("#time-hvacOne-hour").html(timeHvacHour);
        $("#time-hvacOne-minute").html(timeHvacMinute);
        $("#time-hvacOne-section").html(timeHvacSectionUpper);

        //  Get values and Display for Schedule II
        var tempValueTwo = global.hexConvert(hvacScheduleData.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.airTemp.value.hexValue);
        var tempValueTwoC = global.hexConvert(hvacScheduleData.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.airTemp.value.hexValue, 'c');
        
        //Create slider in F for schedule II
        $('#sliderTwo').slider({
            value: tempValueTwo,
            min: 62,
            max: 90,
            create: setInputsSliderTwo,
            slide: setInputsSliderTwo,
            stop: setInputsSliderTwo
        });
        
        function setInputsSliderTwo(){
            //values slide for F
            $('.ui-sliderTwo-range').width(($('#sliderTwo').slider("value")-60)*15);
            $('#tempValueTwo').text($('#sliderTwo').slider("value"));
            
            //values slide for C
            tempValueTwoC = global.hexConvert($('#sliderTwo').slider("value"));
            $('#tempValueTwoC').text(tempValueTwoC);
            
            var handleToLeftValue = $('#sliderTwo a').css('left');
            
            $('#sliderTwoC a').css('left',handleToLeftValue);
            $('.ui-sliderTwoC-range').width((tempValueTwoC-17)*30);
        }
        //End of create slider in F for schedule II
        
        //Create slider in C for schedule II
        $('#sliderTwoC').slider({
            value: tempValueTwoC,
            min: 17,
            max: 32,
            step: .5,
            create: setInputsSliderTwoC,
            slide: setInputsSliderTwoC,
            stop: setInputsSliderTwoC
        });
        
        function setInputsSliderTwoC(){
            //values slide for C
            $('.ui-sliderTwoC-range').width(($('#sliderTwoC').slider("value")-17)*30);
            $('#tempValueTwoC').text($('#sliderTwoC').slider("value"));
            
            //values slide for F
            tempValueTwo = global.hexConvert($('#sliderTwoC').slider("value"));
            $('#tempValueTwo').text(tempValueTwo);
            
            var handleToLeftValue = $('#sliderTwoC a').css('left');
            
            $('#sliderTwo a').css('left',handleToLeftValue);
            $('.ui-sliderTwo-range').width((tempValueTwo-60)*15);
        }
        //End of create slider in C for schedule II
        
        var climateSetTwo = hvacScheduleData.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.climateSet;
        if (climateSetTwo == "true")
            $("#hvac-set-two").addClass("on");
        
        var defrostSetTwo = hvacScheduleData.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.defrost;
        if (defrostSetTwo == "true")
            $("#defrost-set-two").addClass("on");
        
        var timeHvacTwo = hvacScheduleData.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.reservInfo.time.time;
        var timeSectionHvacTwo = hvacScheduleData.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.reservInfo.time.timeSection;
    
        dayHvacTwo = hvacScheduleData.reservInfos.reservHvacInfo[1].reservHvacInfoDetail.reservInfo.day;
        var dateHvacTwo = '';
        
        var timeHvacHourTwo = timeHvacTwo.substring(0,2);
        var timeHvacMinuteTwo = timeHvacTwo.substring(2);
        
        if (timeSectionHvacTwo == 0)
            numberHvacII = 60*parseInt(timeHvacHourTwo) + parseInt(timeHvacMinuteTwo);
        else
            numberHvacII = 60*(parseInt(timeHvacHourTwo)+12) + parseInt(timeHvacMinuteTwo);
        
        timeHvacHourTwo = (timeHvacHourTwo == '00'? '12': timeHvacHourTwo);
        var timeHvacSectionTwo = (timeSectionHvacTwo == 0? ' a.m.' : ' p.m.');
        var timeHvacSectionUpperTwo = (timeSectionHvacTwo == 0? 'AM' : 'PM');
        
        for(i=0; i<aWeek; i++)
        {    
            if ( dayHvacTwo[i] != null )
            {
                if (dayHvacTwo[i] == 9)
                    dateHvacTwo = "No Reservation Setting in TMU";
                else
                    dateHvacTwo += Dates[dayHvacTwo[i]] + '. ';
                $("#" + dates[dayHvacTwo[i]]).addClass("selected");
            }
        }
        
        $("#time-hvac-two").html("<span>" + timeHvacHourTwo + ":" + timeHvacMinuteTwo + "</span>" + timeHvacSectionTwo);
        $("#date-hvac-two").html(dateHvacTwo);
  
        $("#time-hvacTwo-hour").html(timeHvacHourTwo);
        $("#time-hvacTwo-minute").html(timeHvacMinuteTwo);
        $("#time-hvacTwo-section").html(timeHvacSectionUpperTwo);
    },
    tempIncrOne : function(){
        if(tempUnit == "f"){
            var newTempF = parseInt($('#tempValueOne').text()) + 1;
            if (newTempF > 90)
                return;
            $('#tempValueOne').text(newTempF);
            $('#sliderOne').slider("value", newTempF);
            $('.ui-sliderOne-range').width((newTempF-60)*15);
            
            var newTempC = global.hexConvert(newTempF);
            $('#tempValueOneC').text(newTempC);
            $('#sliderOneC').slider("value", newTempC);
            $('.ui-sliderOneC-range').width((newTempC-17)*30);
        } else {
            var newTempC = parseFloat($('#tempValueOneC').text()) + .5;
            if (newTempC > 32)
                return;
            $('#tempValueOneC').text(newTempC);
            $('#sliderOneC').slider("value", newTempC);
            $('.ui-sliderOneC-range').width((newTempC-17)*30);
            
            var newTempF = global.hexConvert(newTempC);
            $('#tempValueOne').text(newTempF);
            $('#sliderOne').slider("value", newTempF);
            $('.ui-sliderOne-range').width((newTempF-60)*15);
        }
    },
    tempDecrOne : function(){
        if(tempUnit == "f"){
            var newTempF = parseInt($('#tempValueOne').text()) - 1;
            if (newTempF < 62)
                return;
            $('#tempValueOne').text(newTempF);
            $('#sliderOne').slider("value", newTempF);
            $('.ui-sliderOne-range').width((newTempF-60)*15);
            
            var newTempC = global.hexConvert(newTempF);
            $('#tempValueOneC').text(newTempC);
            $('#sliderOneC').slider("value", newTempC);
            $('.ui-sliderOneC-range').width((newTempC-17)*30);
        } else {
            var newTempC = parseFloat($('#tempValueOneC').text()) - .5;
            if (newTempC < 17)
                return;
            $('#tempValueOneC').text(newTempC);
            $('#sliderOneC').slider("value", newTempC);
            $('.ui-sliderOneC-range').width((newTempC-17)*30);
            
            var newTempF = global.hexConvert(newTempC);
            $('#tempValueOne').text(newTempF);
            $('#sliderOne').slider("value", newTempF);
            $('.ui-sliderOne-range').width((newTempF-60)*15);
        }
    },
    tempIncrTwo : function(){
        if(tempUnit == "f"){
            var newTempF = parseInt($('#tempValueTwo').text()) + 1;
            if (newTempF > 90)
                return;
            $('#tempValueTwo').text(newTempF);
            $('#sliderTwo').slider("value", newTempF);
            $('.ui-sliderTwo-range').width((newTempF-60)*15);
            
            var newTempC = global.hexConvert(newTempF);
            $('#tempValueTwoC').text(newTempC);
            $('#sliderTwoC').slider("value", newTempC);
            $('.ui-sliderTwoC-range').width((newTempC-17)*30);
        } else {
            var newTempC = parseFloat($('#tempValueTwoC').text()) + .5;
            if (newTempC > 32)
                return;
            $('#tempValueTwoC').text(newTempC);
            $('#sliderTwoC').slider("value", newTempC);
            $('.ui-sliderTwoC-range').width((newTempC-17)*30);
            
            var newTempF = global.hexConvert(newTempC);
            $('#tempValueTwo').text(newTempF);
            $('#sliderTwo').slider("value", newTempF);
            $('.ui-sliderTwo-range').width((newTempF-60)*15);
        }
        
    },
    tempDecrTwo : function(){
        if(tempUnit == "f"){
            var newTempF = parseInt($('#tempValueTwo').text()) - 1;
            if (newTempF < 62)
                return;
            $('#tempValueTwo').text(newTempF);
            $('#sliderTwo').slider("value", newTempF);
            $('.ui-sliderTwo-range').width((newTempF-60)*15);
            
            var newTempC = global.hexConvert(newTempF);
            $('#tempValueTwoC').text(newTempC);
            $('#sliderTwoC').slider("value", newTempC);
            $('.ui-sliderTwoC-range').width((newTempC-17)*30);
        } else {
            var newTempC = parseFloat($('#tempValueTwoC').text()) - .5;
            if (newTempC < 17)
                return;
            $('#tempValueTwoC').text(newTempC);
            $('#sliderTwoC').slider("value", newTempC);
            $('.ui-sliderTwoC-range').width((newTempC-17)*30);
            
            var newTempF = global.hexConvert(newTempC);
            $('#tempValueTwo').text(newTempF);
            $('#sliderTwo').slider("value", newTempF);
            $('.ui-sliderTwo-range').width((newTempF-60)*15);
        }
        
    },
    addScheduleOneEvent : function (){
        var Dates = new Array("SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT");
        var scheduleInfos = {"chargeIndex" : 0, "reservChargeInfoDetail" : { "chargeRatio" : 80, "reservInfo" : { "day" : [], "time" : { "time" : "", "timeSection" : 0 }}, "reservType" : 1, "resvChargeSet" : true}};

        var time = $('#time-scheduleOne-hour').text() + $('#time-scheduleOne-minute').text();
        
        var timePeriod = ($('#time-scheduleOne-section').text() == 'AM'? 0: 1);
        var dateSelected = false;
        
        for(i=0; i<7; i++)
        {
            if( $("#" + Dates[i]).hasClass("selected") )
            {
                scheduleInfos.reservChargeInfoDetail.reservInfo.day.push(i.toString());
                dateSelected = true;
            }
        }
        
        var hourConvert = ($('#time-scheduleOne-hour').text() == 12? 0: $('#time-scheduleOne-hour').text());
        var newNumberScheduleI;
        if (timePeriod == 0)
            newNumberScheduleI = 60*parseInt(hourConvert) + parseInt($('#time-scheduleOne-minute').text());
        else
            newNumberScheduleI = 60*(parseInt(hourConvert)+12) + parseInt($('#time-scheduleOne-minute').text());
        
        var mySchedule;
        
        scheduleInfos.reservChargeInfoDetail.chargeRatio = ($('#radioOne_eighty').hasClass("radioBtn_eighty_active")? 80: 100);
        scheduleInfos.reservChargeInfoDetail.reservInfo.time.time = time;
        scheduleInfos.reservChargeInfoDetail.reservInfo.time.timeSection = timePeriod;
        scheduleInfos.reservChargeInfoDetail.resvChargeSet = ($('#charge-set').hasClass("on")? true: false);
        scheduleInfos.reservChargeInfoDetail.reservType = 1;
        mySchedule = JSON.stringify(scheduleInfos);
        
        if (dateSelected){
            if(global.validScheduleRule(numberScheduleII, newNumberScheduleI, dayScheduleTwo, scheduleInfos.reservChargeInfoDetail.reservInfo.day))
                global.postSchedule(mySchedule);
            else
                alert('Not a valid schedule.');
        }
        else
            alert("Please select date(s) to schedule.");
        
    },
    addScheduleTwoEvent : function (){
        var Dates = new Array("sun", "mon", "tue", "wed", "thu", "fri", "sat");
        var scheduleInfos = {"chargeIndex" : 1, "reservChargeInfoDetail" : { "chargeRatio" : 80, "reservInfo" : { "day" : [], "time" : { "time" : "", "timeSection" : 0 }}, "reservType" : 1, "resvChargeSet" : true}};

        var time = $('#time-scheduleTwo-hour').text() + $('#time-scheduleTwo-minute').text();
        var timePeriod = ($('#time-scheduleTwo-section').text() == 'AM'? 0: 1);
        var dateSelected = false;
       
        for(i=0; i<7; i++)
        {
            if( $("#" + Dates[i]).hasClass("selected") )
            {
                scheduleInfos.reservChargeInfoDetail.reservInfo.day.push(i.toString());
                dateSelected = true;
            }
        }
        
        var hourConvert = ($('#time-scheduleTwo-hour').text() == 12? 0: $('#time-scheduleTwo-hour').text());
        var newNumberScheduleII;
        if (timePeriod == 0)
            newNumberScheduleII = 60*parseInt(hourConvert) + parseInt($('#time-scheduleTwo-minute').text());
        else
            newNumberScheduleII = 60*(parseInt(hourConvert)+12) + parseInt($('#time-scheduleTwo-minute').text());
   
        var mySchedule;
        
        scheduleInfos.reservChargeInfoDetail.chargeRatio = ($('#radioTwo_eighty').hasClass("radioBtn_eighty_active")? 80: 100);
        scheduleInfos.reservChargeInfoDetail.reservInfo.time.time = time;
        scheduleInfos.reservChargeInfoDetail.reservInfo.time.timeSection = timePeriod;
        scheduleInfos.reservChargeInfoDetail.resvChargeSet = ($('#charge-set-drive').hasClass("on")? true: false);
        scheduleInfos.reservChargeInfoDetail.reservType = 1;
        mySchedule = JSON.stringify(scheduleInfos);

        if (dateSelected){
            if(global.validScheduleRule(numberScheduleI, newNumberScheduleII, daySchedule, scheduleInfos.reservChargeInfoDetail.reservInfo.day))
                global.postSchedule(mySchedule);
            else
                alert('Not a valid schedule.'); 
        }
        else
            alert("Please select date(s) to schedule.");
        
    },
    postSchedule : function(scheduleData){
        var obj = {}; 
        obj.url = '/ccw/ev/reserveCharge.do'; 
        obj.data = {rsvChargeInfo : scheduleData}; 
        
        global.tmsServer(obj);
    },
    requestChargeSchedule : function(){
    	$("body").addClass("proccesing");
        global.blockUI();
        $.ajax({
            cache: false,
            type: 'get',
            dataType: 'json',
            url: 'scheduledInfo.do' 
        }).done(function(data){       
            $('#MON, #TUE, #WED, #THU, #FRI, #SAT, #SUN, #mon, #tue, #wed, #thu, #fri, #sat, #sun').removeClass("selected");
            $('#charge-set, #charge-set-drive').removeClass("on");
            
            if(data.success == "false"){ //Two diff cases may happen. One receive default Obj with data from backend, the other receive Obj without data (Internal Error!)
                $('body').attr('class', 'error'); $('#tmsErrorMessage').show();
                var remoteError = 'Error: ' + data.error; 
                
                $('#errorMessage').html(remoteError + '<a href="#" id="dismissButton" style="display:block; color:blue;">Dismiss></a>');
                
                var msgHeight = $('#errorMessage').height();
                var setMargin = (100 - msgHeight)/2; //100 is the height of parent DIV
                $('#errorMessage').css({top : setMargin+'px'});
                
                stopTimer = setTimeout(function(){
                    $('body').attr('class', '');},3000);
                
                $('#dismissButton').on('click', function(){
                    $('#uiBlock').remove(); 
                });
                
                if(data.error == "Internal Error!") //Received Obj WITHOUT data from backend, then display default data from frontend.
                {
                    var data = initSchedule;
                    global.initChargeSchedule(data);
                }
                else //Received Obj WITH data from backend
                    global.initChargeSchedule(data);
            }else{ 
            	window.location=window.location;
                
                $('body').attr('class', 'updated');
                stopTimer = setTimeout(function(){
                    $('body').attr('class', '');},3000);
            }
            
        });
    },
    addHvacEventOne : function (){
        var Dates = new Array("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN" );
        var hvacInfos = {"climateIndex":0, "reservHvacInfoDetail" : {"airTemp" : {"unit" : 1, "value" : {"hexValue": "0A"}}, "climateSet" : true, "defrost" : true, "reservInfo" : {"day" : [], "time" : {"time" : "", "timeSection" : 0}}}};
        
        var time = $('#time-hvacOne-hour').text() + $('#time-hvacOne-minute').text();
        var timePeriod = ($('#time-hvacOne-section').text() == 'AM'? 0: 1);
        var dateSelected = false;
        
        for(i=0; i<7; i++)
        {
            if( $("#" + Dates[i]).hasClass("selected") )
            {
                hvacInfos.reservHvacInfoDetail.reservInfo.day.push(i.toString());
                dateSelected = true;
            }
        }
        
        var hourConvert = ($('#time-hvacOne-hour').text() == 12? 0: $('#time-hvacOne-hour').text());
        var newNumberHvacI;
        if (timePeriod == 0)
            newNumberHvacI = 60*parseInt(hourConvert) + parseInt($('#time-hvacOne-minute').text());
        else
            newNumberHvacI = 60*(parseInt(hourConvert)+12) + parseInt($('#time-hvacOne-minute').text());

        var tempHexValueOne = (parseInt($('#tempValueOne').text()) - 59).toString(16);

        if ($('#tempValueOne').text() == 62)
            tempHexValueOne = "2";
         
        if ($('#tempValueOne').text() == 90)
            tempHexValueOne = "20";
            
        if(tempHexValueOne.length  == 1)
            tempHexValueOne = "0" + tempHexValueOne;
        
        var mySchedule;

        hvacInfos.reservHvacInfoDetail.airTemp.value.hexValue = tempHexValueOne;
        hvacInfos.reservHvacInfoDetail.reservInfo.time.time = time;
        hvacInfos.reservHvacInfoDetail.reservInfo.time.timeSection = timePeriod;
        hvacInfos.reservHvacInfoDetail.climateSet = ($('#hvac-set-one').hasClass("on")? true: false);
        hvacInfos.reservHvacInfoDetail.defrost = ($('#defrost-set-one').hasClass("on")? true: false);
        mySchedule = JSON.stringify(hvacInfos);
        
        if (dateSelected){
            if(global.validScheduleRule(numberHvacII, newNumberHvacI, dayHvacTwo, hvacInfos.reservHvacInfoDetail.reservInfo.day))
                global.postHvac(mySchedule);
            else
                alert('Not a valid schedule.');
        }
        else
            alert("Please select date(s) to schedule.");
        
    },
    addHvacEventTwo : function (){
        var Dates = new Array("mon", "tue", "wed", "thu", "fri", "sat", "sun");
        var hvacInfos = {"climateIndex":1, "reservHvacInfoDetail" : {"airTemp" : {"unit" : 1, "value" : {"hexValue": "0A"}}, "climateSet" : true, "defrost" : true, "reservInfo" : {"day" : [], "time" : {"time" : "", "timeSection" : 0}}}};
        
        var time = $('#time-hvacTwo-hour').text() + $('#time-hvacTwo-minute').text();
        var timePeriod = ($('#time-hvacTwo-section').text() == 'AM'? 0: 1);
        var dateSelected = false;
        
        for(i=0; i<7; i++)
        {
            if( $("#" + Dates[i]).hasClass("selected") )
            {
                hvacInfos.reservHvacInfoDetail.reservInfo.day.push(i.toString());
                dateSelected = true;
            }
        }
        
        var hourConvert = ($('#time-hvacTwo-hour').text() == 12? 0: $('#time-hvacTwo-hour').text());
        var newNumberHvacII;
        if (timePeriod == 0)
            newNumberHvacII = 60*parseInt(hourConvert) + parseInt($('#time-hvacTwo-minute').text());
        else
            newNumberHvacII = 60*(parseInt(hourConvert)+12) + parseInt($('#time-hvacTwo-minute').text());
   
        var tempHexValueTwo = (parseInt($('#tempValueTwo').text()) - 59).toString(16);
        
        if ($('#tempValueTwo').text() == 62)
            tempHexValueTwo = "2";
         
        if ($('#tempValueTwo').text() == 90)
            tempHexValueTwo = "20";
        
        if(tempHexValueTwo.length  == 1)
            tempHexValueTwo = "0" + tempHexValueTwo;
  
        var mySchedule;
        
        hvacInfos.reservHvacInfoDetail.airTemp.value.hexValue = tempHexValueTwo;
        hvacInfos.reservHvacInfoDetail.reservInfo.time.time = time;
        hvacInfos.reservHvacInfoDetail.reservInfo.time.timeSection = timePeriod;
        hvacInfos.reservHvacInfoDetail.climateSet = ($('#hvac-set-two').hasClass("on")? true: false);
        hvacInfos.reservHvacInfoDetail.defrost = ($('#defrost-set-two').hasClass("on")? true: false);
        mySchedule = JSON.stringify(hvacInfos);

        if (dateSelected){
            if(global.validScheduleRule(numberHvacI, newNumberHvacII, dayHvac, hvacInfos.reservHvacInfoDetail.reservInfo.day))
                global.postHvac(mySchedule);
            else
                alert('Not a valid schedule.');
        }
        else
            alert("Please select date(s) to schedule.");
        
    },
    postHvac : function(scheduleData){
        var obj = {}; 
        obj.url = '/ccw/ev/reserveHVAC.do';
        obj.data = {rsvHvacInfo : scheduleData};
        global.tmsServer(obj);
        
    },
    requestHvacSchedule : function(){
    	$("body").addClass("proccesing");
        global.blockUI();
        $.ajax({
            cache: false,
            type: 'get',
            dataType: 'json',
            url: 'scheduledInfo.do' 
        }).done(function(data){       
            $('#MON, #TUE, #WED, #THU, #FRI, #SAT, #SUN, #mon, #tue, #wed, #thu, #fri, #sat, #sun').removeClass("selected");
            $('#hvac-set-one, #hvac-set-two, #defrost-set-one, #defrost-set-two').removeClass("on");
            
            if(data.success == "false"){ //Two diff cases may happen. One receive default Obj with data from backend, the other receive Obj without data (Internal Error!)
                $('body').attr('class', 'error'); $('#tmsErrorMessage').show();
                var remoteError = 'Error: ' + data.error; 
                
                $('#errorMessage').html(remoteError + '<a href="#" id="dismissButton" style="display:block; color:blue;">Dismiss></a>');
                
                var msgHeight = $('#errorMessage').height();
                var setMargin = (100 - msgHeight)/2; //100 is the height of parent DIV
                $('#errorMessage').css({top : setMargin+'px'});
                
                stopTimer = setTimeout(function(){
                    $('body').attr('class', '');},3000);
                
                $('#dismissButton').on('click', function(){
                    $('#uiBlock').remove(); 
                }); 
                
                if(data.error == "Internal Error!") //Received Obj WITHOUT data from backend, then use default data from frontend.
                {
                    var data = initSchedule; 
                    global.initHvacSchedule(data);
                }
                else //Received Obj WITH data from backend
                    global.initHvacSchedule(data);
            }else{ 
            	window.location=window.location;
                
                $('body').attr('class', 'updated');
                stopTimer = setTimeout(function(){
                    $('body').attr('class', '');},3000);
            }
            
        });
    },
    validScheduleRule : function(oldTime, newTime, oldDay, newDay){
        for(i=0; i<7; i++){
            for(j=0; j<7; j++){
                //Schedule in the same day
                if(oldDay[i] == newDay[j] && oldDay[i] != undefined){
                    if (Math.abs(newTime - oldTime) < 30)
                        return false;
                }
                
                //New schedule days ahead current scheduled days
                if(newDay[j] - oldDay[i] == 1 || newDay[j] - oldDay[i] == -6){
                    if(oldTime > 1400){
                        if(1440 - oldTime + newTime < 30)
                            return false;
                    }
                }
                
              //New schedule days after current scheduled days
                if(oldDay[j] - newDay[i] == 1 || oldDay[j] - newDay[i] == -6){
                    if(oldTime < 30){
                        if(1440 - newTime + oldTime < 30)
                            return false;
                    }
                }
            }
        }
        return true;
    },
    getLockStatusContainerHtml : function (lockedStatus, doorsStatus , trunkStatus) {

        var htmlString;
        var unlockCheck = 0;
        var doorName, value;

        var htmlParts = [
            "<li><div> <span class='circle'>",
            "1",
            "</span><img class='circle_img_especial' src='../img/circle_small.png' alt='circle' /><h2>",
            "DOOR NAME",
            " IS <span>OPEN</span></h2></div></li>"
        ];

        var doorNames = {
            frontLeft : {
                value: 1,
                name: "DRIVERS SIDE DOOR"
            },
            frontRight : {
                value: 2,
                name: "PASSENGER SIDE DOOR"
            },
            backLeft : {
                value: 3,
                name: "BACK DRIVERS SIDE DOOR"
            },
            backRight : {
                value: 4,
                name: "BACK PASSENGER SIDE DOOR"
            }
        };

        if (lockedStatus && lockedStatus.toString() === "true") {
            htmlString = "<h2>ALL DOORS ARE <span>CLOSED</span></h2>"; 
        } else {
            htmlString = "<ul>";

            for (doorName in doorNames) {
                if (doorNames.hasOwnProperty(doorName)) {
                    if (doorsStatus[doorName] == "1") {
                        value = doorNames[doorName].value;
                        htmlParts[1] = value;
                        htmlParts[3] = doorNames[doorName].name;
                        $("#c" + value).show();
                        unlockCheck++;
                        htmlString += htmlParts.join("");
                    }
                }
            }

            if (trunkStatus && trunkStatus.toString() === "true") {
                htmlParts[1] = "3";
                htmlParts[3] = "TRUNK";
                $("#c5").show();
                unlockCheck++;
                htmlString += htmlParts.join("");
            }

            htmlString += "</ul>";

            if(unlockCheck == 0){
                htmlString = "<h2>ALL DOORS ARE <span>CLOSED</span></h2>";
            }
        }
        return htmlString; 
    },
    returnDoorColor : function (door, lockedStatus){
        var color;
        if(lockedStatus == "true"){
          color = "Blue";
          return color; 
        }else{
            switch(door){
                case "0" :
                    //locked
                    color = "Green"; 
                    break; 
                case "1":
                    //unlocked
                    color = "Red";
                    break; 
                case 0 :
                    //locked
                    color = "Green"; 
                    break; 
                case 1:
                    //unlocked
                    color = "Red";
                    break; 
            }
            return color; 
        }
     },
     returnTrunkColor : function (lockedStatus, trunkStatus){
         var color; 
         if(lockedStatus == "true"){
            color = "Blue";
         }else if(trunkStatus == "true"){
             color = "Red"; 
         }else{
             color = "Green";
         }
         return color; 
     },
     pollForFlag : function(){ 
         var timeOut; 
         $.ajax({
             cache: false,
             type: "get",
             url: 'isServiceBlocked.do', 
             context: document.body
         }).done(function(data){ 
               if(data == 1){
                   timeOut = window.setTimeout(global.pollForFlag , 30000);
               }else{
                   window.clearTimeout(timeOut);
                   window.location=window.location;
               }
               }); 
     }, 
     tmsServer : function (obj){
    	 $("body").addClass("proccesing");
         global.blockUI(); 
         
         var url = obj.url; 
         var data = obj.data; 

         $.ajax({
             cache: false,
             type: obj.type == 'get' ? 'get': "POST",
             url: url, 
             context: document.body,
             data: data
         }).done(function(data){
             if(data.success == "false"){
                 $('body').attr('class', 'error'); $('#tmsErrorMessage').show();
                 stopTimer = setTimeout(function(){
                	 $('body').attr('class', '');},3000);
                 
                 var remoteError = 'Error: ' + data.error;
                 
                 $('#errorMessage').html(remoteError + '<a href="#" id="dismissButton" style="display:block; color:blue;">Dismiss></a>');
                 
                 var msgHeight = $('#errorMessage').height();
                 var setMargin = (100 - msgHeight)/2; //100 is the height of parent DIV
                 $('#errorMessage').css({top : setMargin+'px'});
                 
                 stopTimer = setTimeout(function(){
                     $('body').attr('class', '');},3000);
                 
                 $('#dismissButton').on('click', function(){
                     $('#uiBlock').remove(); 
                 }); 

                 $('#MON, #TUE, #WED, #THU, #FRI, #SAT, #SUN, #mon, #tue, #wed, #thu, #fri, #sat, #sun').removeClass("selected");
                 $('#hvac-set-one, #hvac-set-two, #defrost-set-one, #defrost-set-two').removeClass("on");
                 
                 if(data.error == "Internal Server Error") //Received Obj WITHOUT data from backend, then display default data from frontend.
                 {
                     var data = initSchedule;
                     global.initChargeSchedule(data);
                     global.initHvacSchedule(data);
                 }
                 else{ //Received Obj WITH data from backend
                     //global.initChargeSchedule(data);
                     //global.initHvacSchedule(data);
                 } 
                    
             }
             else{
            	 window.location=window.location;
                 $('body').attr('class', 'updated');
                 stopTimer = setTimeout(function(){
                     $('body').attr('class', '');},3000);
             }

         });
         
     }, 
     blockUI : function(message){
         
         if(message ==undefined){
             message = "Please wait...";
         }else{
             message +='<a href="#" id="dismissButton" style="display:block; color:blue;">Dismiss></a>'; 
         }
         
         $('body').append("<div id='uiBlock'><div style='position:fixed; z-index:9998; top:0px; left:0px; width:100%; height:100%; background-color:grey; opacity:0.5 '></div>" +
                 "<div style='border:1px grey solid; width:500px; height:100px; padding:20px;  background-color:white; margin: auto; position: fixed ;z-index:9999; top: 0; left: 0; bottom: 0; right: 0;'>" +
                 "<img src='../img/kia-loading.gif' alt='' style='float:left; margin-right:20px;'><div id='errorMessage' style='position:relative; top:40px; font-size:13pt'>"+message+"</div></div>");
         
         $('#dismissButton').on('click', function(){
             $('#uiBlock').remove(); 
         }); 

     }
};
window.console = window.console || (function(){
    var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
    return c;
})();


$(function(){
    $(".hour-wrap").click(function() {
        $(".hour-list, .hour-arrow").toggle();
        $(".hour-wrap").css("border", "1px solid #d50010");
        $(".minute-list, .minute-arrow, .am-pm-list, .am-arrow").hide();
        $(".minute-wrap, .am-pm-wrap").css("border", "1px solid #ccc");
    });
    $(".hour-list li").click(function() {
        $(".hour-wrap")
            .html($(this).html())
            .css("border", "1px solid #ccc");
        $(".hour-list, .hour-arrow").hide();
    });

    $(".minute-wrap").click(function() {
        $(".minute-list, .minute-arrow").toggle();
        $(".minute-wrap").css("border", "1px solid #d50010");
        $(".hour-list, .hour-arrow, .am-pm-list, .am-arrow").hide();
        $(".hour-wrap, .am-pm-wrap").css("border", "1px solid #ccc");
        
    });
    $(".minute-list li").click(function() {
        $(".minute-wrap")
            .html($(this).html())
            .css("border", "1px solid #ccc");
        $(".minute-list, .minute-arrow").hide();
    });
    
    $(".am-pm-wrap").click(function() {
        $(".am-pm-list, .am-arrow").toggle();
        $(".am-pm-wrap").css("border", "1px solid #d50010");
        $(".hour-list, .hour-arrow, .minute-list, .minute-arrow").hide();
        $(".hour-wrap, .minute-wrap").css("border", "1px solid #ccc");
    });
    $(".am-pm-list li").click(function() {
        $(".am-pm-wrap")
            .html($(this).html())
            .css("border", "1px solid #ccc");
        $(".am-pm-list, .am-arrow").hide();
    });
    
    /* close them if user hits escape */
    $(document).keyup(function(e) { 
        if (e.keyCode == 27) { // esc keycode
            $(".hour-list, .minute-list, .am-pm-list, .hour-arrow, .minute-arrow, .am-arrow").hide();
        }
    });
    
    /* Now do the same as above for the hour 2 stuff */
    
    $(".hour-wrap2").click(function() {
        $(".hour-list2, .hour-arrow2").toggle();
        $(".hour-wrap2").css("border", "1px solid #d50010");
        $(".minute-list2, .minute-arrow2, .am-pm-list2, .am-arrow2").hide();
        $(".minute-wrap2, .am-pm-wrap2").css("border", "1px solid #ccc");
    });
    $(".hour-list2 li").click(function() {
        $(".hour-wrap2")
            .html($(this).html())
            .css("border", "1px solid #ccc");
        $(".hour-list2, .hour-arrow2").hide();
    });

    $(".minute-wrap2").click(function() {
        $(".minute-list2, .minute-arrow2").toggle();
        $(".minute-wrap2").css("border", "1px solid #d50010");
        $(".hour-list2, .hour-arrow2, .am-pm-list2, .am-arrow2").hide();
        $(".hour-wrap2, .am-pm-wrap2").css("border", "1px solid #ccc");
        
    });
    $(".minute-list2 li").click(function() {
        $(".minute-wrap2")
            .html($(this).html())
            .css("border", "1px solid #ccc");
        $(".minute-list2, .minute-arrow2").hide();
    });
    
    $(".am-pm-wrap2").click(function() {
        $(".am-pm-list2, .am-arrow2").toggle();
        $(".am-pm-wrap2").css("border", "1px solid #d50010");
        $(".hour-list2, .hour-arrow2, .minute-list2, .minute-arrow2").hide();
        $(".hour-wrap2, .minute-wrap2").css("border", "1px solid #ccc");
    });
    $(".am-pm-list2 li").click(function() {
        $(".am-pm-wrap2")
            .html($(this).html())
            .css("border", "1px solid #ccc");
        $(".am-pm-list2, .am-arrow2").hide();
    });
    
    /* close them if user hits escape */
    $(document).keyup(function(e) { 
        if (e.keyCode == 27) { // esc keycode
            $(".hour-list2, .minute-list2, .am-pm-list2, .hour-arrow2, .minute-arrow2, .am-arrow2").hide();
        }
    });
});


$(document).ready(function(){
    global.init();
    
});
