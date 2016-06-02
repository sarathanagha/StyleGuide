(function (uvo) {
    if (!uvo) {
        throw new Error("Make sure you include KH libraries after uvo, not before!");
    }

    var gMaps = (window.google && window.google.maps);
    var khData = uvo.data, com = uvo.common, uTypes = uvo.dataTypes;

    var docReady = $.Deferred();
    $(document).ready(docReady.resolve);

    var initMap = {
        "kh-remote-climate"    : "initRemoteClimate",
        "kh-remote-find"       : "initFindMyCar",
        "kh-remote-lock"       : "initRemoteLock"
    };
    
    uvo.addEarlyInit(uvo.simpleRouteFactory("khVehicleStatusRemote", "/ccw/kh/vehicleStatusRemote.do", /kh\/climate/i));
     
    var module = {
        init : function () {
            docReady.done(function () {
            	tempUnits = 'F'; //or 'C'
            	initSchedule = {"serviceResponse":[{"climateIndex":0,"reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"02"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0600","timeSection":0}}},"schedId": 0},{"climateIndex":1,"reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"02"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0600","timeSection":0}}},"schedId": 0}]};

            	var pageId = $("body").prop("id");
                var fn = module[initMap[pageId]];
                fn();
            });
        },
        tempFromHex	: function(hexTemp){
        	var hexToTemp = {
                    "F" : {"--" : "--", "01" : "--", "02" : 'Low', "03" : 63, "04" : 63, "05" : 64, "06" : 65, "07" : 66, "08" : 67, "09" : 68, "0A" : 69, "0B" : 70, "0C" : 71, "0D" : 72, "0E" : 73, "0F" : 74, "10" : 75, "11" : 76, "12" : 77, "13" : 78, "14" : 79, "15" : 80, "16" : 81, "17" : 82, "18" : 83, "19" : 84, "1A" : 85, "1B" : 86, "1C" : 87, "1D" : 88, "1E" : 89, "1F" : 89, "20" : 'High'},
                    "C" : {"--" : "--", "01" : "--", "02" : 'Low', "03" : 17, "04" : 18, "05" : 18, "06" : 19, "07" : 19, "08" : 20, "09" : 20, "0A" : 21, "0B" : 21, "0C" : 22, "0D" : 22, "0E" : 23, "0F" : 23, "10" : 24, "11" : 24, "12" : 25, "13" : 25, "14" : 26, "15" : 26, "16" : 27, "17" : 27, "18" : 28, "19" : 28, "1A" : 29, "1B" : 29, "1C" : 30, "1D" : 30, "1E" : 31, "1F" : 31, "20" : 'High'}
                };

                if (hexTemp && typeof hexTemp === 'number') {
                    hexTemp = module.toHexString(hexTemp);
                }
                return hexToTemp[tempUnits][(hexTemp.toUpperCase() || "--")];
        },
        toHexString	: function(num){
        	return num > 15 ? num.toString(16) : "0" + num.toString(16);
        },
        initPendingRefresh: function() {
        	var delay = 30000;
        	//console.log('Initializing Pending Refresh...');
        	return setInterval(function(){window.location = window.location.pathname + "?r" ;},delay);
        },
        clearPendingRefresh: function(interval) {
        	if(interval) {
        		//console.log('Clearing Pending Refresh...');
        		clearInterval(interval);
        	}
        },
        initRemoteClimate    : function initRemoteClimate() {
        	$('#tmsRefresh').toggle();
            var pageReady = new $.Deferred(),
            	interval,
            	climateDial = module.climateDialModule.init('.dial'),
            	degreeStr = "<sup>&deg;</sup>",
            	maxTemp = 0x20,
            	minTemp = 0x01,
            	hvacTemp = "--",
            	lastHvacDisplayTemp,
            	$unitButtons = $(".temperature .units .unit"),
            	getInsideTemp,
            	
            	isEngineModified = false, 
            	isClimateModified = false, 
            	isDefrostModified = false, 
            	isDialModified = false,
            	
            	defrosterOn = false,
                engineOn = false,
                climateOn = false,
                
                $defrostButton = $(".box-defrost .switch"),
                $engineButton = $(".engine .power .switch"),
                $climateButton = $(".box-climate .switch"),
                
                $pendingList = $('.pending-list'),
                $retryList = $('.retry-list'),
                
                remoteStartPendingObject,
                gblRemoteStartPendingObject, // used for resend
                isPending = false,
                hasErrors = false;
            
        	// bind tmsRefresh button that will be located underneath the error button
        	$('#tmsRefresh').off('click');
        	$('.vehicle-refresh,#tmsRefresh').click(function() {
        		loadState('pending');
        		module.clearPendingRefresh(interval); // vehicle refresh is on-going
        		$retryList.addClass('hide');
        		uvo.refreshVehicleStatusClick(
        				null,
        				function() { // on fail
        					loadState('error');
        					$('.vehicle-refresh').addClass('hide');
        					$('.kh-button-submit').removeClass('hide');
        					$('.kh-button-error').addClass('hide'); 
        					$retryList.addClass('hide');
        				},
        				null);
        	});
            
            uvo.showLoadingMessage();                          
			climateDial.enable(false);
			climateDial.setOnDragCallback(function(temp) {
				if (engineOn) {
    				if (!climateOn) {
		            	climateOn = !climateOn;
		            	updateClimateButton();
		            }
    				
    				setHvacTemperature(temp);
				}
			});
			climateDial.setOnStopCallback(function() {
				updatePendingList('dial');
			});
			climateDial.setOnClickCallback(function() {
				updatePendingList('dial');
			});
			
			loadState('loading');
			loadRequest();
			
			function loadRequest() {
				uvo.dataRequest("khVehicleStatusRemote").done(function (statusResponse) {
					uvo.clearLoading();
	            	
	            	var vehicleStatusResponse = new uTypes.VehicleStatusReponse(statusResponse[0].serviceResponse);
	                com.vehicleStatus = vehicleStatusResponse.latestVehicleStatus;
	                com.vehicleStatusTimestamp = vehicleStatusResponse.timeStampVO;
	                if (!com.vehicleStatus.airTemp) { com.vehicleStatus.airTemp = {}; com.vehicleStatus.airTemp.value = '01H'; com.vehicleStatus.airTemp.unit = 0; };
	                if (com.vehicleStatus) {
	                	delete com.vehicleStatus['_rawLoaded'];
	                	delete com.vehicleStatus['dateTime'];
	                	delete com.vehicleStatus['moment'];
	                }
	                
	                $('#a_normal span').html('Last updated as of'+' '+ moment(com.vehicleStatusTimestamp.unixTimestamp * 1000).format("MMMM DD, YYYY h:mm a"));
	                $("body").removeClass("updated");
	                $engineButton.removeClass('disabled');	                
	                isPending = (statusResponse[1].remoteStartStatus == 'P' || statusResponse[1].remoteStopStatus == 'P' 
	      		      || statusResponse[1].lockStatus == 'P' || statusResponse[1].unlockStatus == 'P'); 
	                hasErrors = (statusResponse[1].remoteStartStatus == 'E' || statusResponse[1].remoteStopStatus == 'E');
	                gblRemoteStartPendingObject = remoteStartPendingObject = (statusResponse[1].remoteStartPendingObject) ? statusResponse[1].remoteStartPendingObject : null;
	                
	                hvacTemp = (com.vehicleStatus.airTemp) ? parseInt(com.vehicleStatus.airTemp.value.substr(0, 2), 16) : "--";  
	                getInsideTemp = {"insideTemp" : hvacTemp}; //yeah this is just the set temp.    
	                
	                defrosterOn = com.vehicleStatus.defrost === true;
	                engineOn = com.vehicleStatus.engine === true;
	                climateOn = com.vehicleStatus.airCtrlOn === true;   
	                	                
	                if (isPending) { // Check pending state
	                	// If remoteStartPendingObject exists, then we assume a remote start request is failed,
	                	// and we set the global values from the remoteStartPendingObject
						if (statusResponse[1].remoteStartPendingObject) {
							
							var tmpVal = parseInt(statusResponse[1].remoteStartPendingObject.airTemp.value.substr(0, 2), 16);
							climateOn = statusResponse[1].remoteStartPendingObject.airCtrl == '1' ? true : false;
		                	engineOn = true;
		                	setHvacTemperature(tmpVal);
		                	climateDial.tickFromDegree(module.tempFromHex(tmpVal));
		                	defrosterOn = statusResponse[1].remoteStartPendingObject.defrost == '1' ? true : false;
		                	
		                	updateEngineButton();
			            	updateDefrostButton();
			            	updateClimateButton(); 
						}
						
						loadState('pending');
					} else if (hasErrors) {
						uvo.genericErrorHandler(null,null,'Your previous request did not complete. Your settings have been restored.');
						loadState('error');
					} else {
						// If there is an 'r' in the query params (ex: /ccw/climate.do?r), then display green bar.
						var params = window.location.search.replace('?','');
						if (params == 'r') { 
							uvo.clearLoadingConfirm(); 
							$('#a_normal span').text('Your previous request was successful . Your vehicle status has been updated to reflect changes.');
						}
						
						updateEngineButton();
		            	updateDefrostButton();
		            	updateClimateButton();  
					}
	                
	            	updateTemperatureDisplay();
	                climateDial.tickFromDegree(module.tempFromHex(hvacTemp));  
	                
	                module.scheduledClimate();	    			
	                // end of request func
	            });
			}
			
			function loadState(state) {
				
				// left-side buttons
				if (state == 'pending' || state == 'loading') {
					uvo.showLoadingMessage();
					
					climateDial.enable(false);
    				climateDial.enableDrag(false);
    				
    				$defrostButton.addClass('disabled');
    				$climateButton.addClass('disabled');
    				$engineButton.addClass('disabled');
    				
    				$('.climate-img').removeClass('active');
    				$('.defrost-img').removeClass('active');
    				$('.engine-img').removeClass('active');
    				
    				$('.climate .wrapper .minus').addClass("disabled");
                	$('.climate .wrapper .plus').addClass("disabled");
                	$('.climate .wrapper .value').addClass("disabled");  
                	
                	$climateButton.addClass("disabled");
                	$defrostButton.addClass("disabled");
                	$engineButton.addClass('disabled');
                	
                	$pendingList.addClass('hide');
                	
                	$('#a_normal span').text('');
                	
                	if (state == 'pending') {
                		$('.pending-msg').removeClass('hide');
	                	$('.page-header ul li a').addClass('disabled');
	                	interval = module.initPendingRefresh();
                	}
				} else if (state == 'success' || state == 'error'){
					$defrostButton.removeClass('disabled');
    				$climateButton.removeClass('disabled');
    				$engineButton.removeClass('disabled');
    				
    				climateDial.enableDrag(true);
    				
    				$('.climate .wrapper .minus').removeClass("disabled");
                	$('.climate .wrapper .plus').removeClass("disabled");
                	$('.climate .wrapper .value').removeClass("disabled");  
                	
                	$engineButton.removeClass('disabled');
                	
                	// If the db call comes back as success, assign global vars to updated values
                	if (state == 'success') {
	                	com.vehicleStatus.airCtrlOn = climateOn;
	                	com.vehicleStatus.engine = engineOn;
	                	com.vehicleStatus.airTemp.unit = 0;
	                	com.vehicleStatus.airTemp.value = climateDial.getCurrentHex() + "H";
	                	com.vehicleStatus.defrost = defrosterOn;
	                		                	
	                	isEngineModified = false;
	                	isClimateModified = false; 
	                	isDefrostModified = false; 
	                	isDialModified = false; 
                	}
                	
                	updateEngineButton();
                	updateClimateButton();
                	updateDefrostButton();	
                	updatePendingList('dial');
                	$('.page-header ul li a').removeClass('disabled');
				}
				
				//pending refresh
				if (state == 'success') {
					module.clearPendingRefresh(interval);
					uvo.clearLoadingConfirm();
				}
				
				// upper-right buttons
				$('.upper-right .kh-button').addClass('hide');    		
				
				// do pending only stuff or do non-pending stuff
				if (state == 'pending') {
					isPending = true;					
					$('.kh-button-pending').removeClass('hide');
				}
				else  {
					$('.pending-msg').addClass('hide');
					isPending = false;
				}
				
				if (state == 'error') {
					module.clearPendingRefresh(interval);
					$('.kh-button-error,.vehicle-refresh').removeClass('hide');
					$retryList.removeClass('hide');    
					$pendingList.addClass('hide');
					updateRetryList();
				} else {
					$retryList.addClass('hide');
					$('.vehicle-refresh').addClass('hide');
				}
				if (state == 'success') {
					$('.kh-button-success').removeClass('hide');
				}
				if (state == 'loading') {
					$('.kh-button-submit').removeClass('hide');
				}
			}    		
			
            function setHvacTemperature(newTemp) {
                if (newTemp < minTemp) {
                    hvacTemp = minTemp;
                } else if (newTemp > maxTemp) {
                    hvacTemp = maxTemp;
                } else {
                    hvacTemp = newTemp;
                }
                                    
                lastHvacDisplayTemp = module.tempFromHex(hvacTemp);                    
                $(".climate .value").html(lastHvacDisplayTemp + ((isNaN(lastHvacDisplayTemp)) ? "": degreeStr));

            }

            function updateTemperatureDisplay() {

                setHvacTemperature(hvacTemp);

                uvo.dataRequest("outsideTemp").done(function (outsideData) {
                //console.log('outsideData', outsideData)
                	var outsideTemp = parseFloat(outsideData.temp) || 78.6;
                    outsideTemp = tempUnits === 'F' ? outsideTemp : (outsideTemp - 32) * 5 / 9;
                    $(".temperature .outside").html(outsideTemp.toFixed(0) + ((isNaN(outsideTemp.toFixed(0))) ? "" : degreeStr) + "<label>OUTSIDE</label>");
                }).always(function () {
                    pageReady.resolve();
                });

                $.when(getInsideTemp).done(function (insideResults) {
                    //todo: Figure out what this value is.
                	//console.log('insideResults',insideResults)
                    var insideTemp = module.tempFromHex(insideResults.insideTemp) || "--";
                    $(".temperature .inside").html(insideTemp + ((isNaN(insideTemp)) ? "" : degreeStr) + "<label>VEHICLE</label>");
                });
            }

            function updateDefrostButton() {
                $defrostButton.toggleClass("on", defrosterOn).toggleClass("off", !defrosterOn);
                $defrostButton.text(defrosterOn ? "on" : "off");
                $('.defrost-img').addClass(defrosterOn && engineOn ? 'active' : '');
                
                if (!isPending) updatePendingList('defroster');
                
                if (defrosterOn) {
                	climateOn = true;
                	updateClimateButton();
                }
            }

            function updateEngineButton() {
            	
                $engineButton.toggleClass("on", engineOn).toggleClass("off", !engineOn);
                $engineButton.text(engineOn ? "on" : "off");
                $('.engine-img').addClass(engineOn ? 'active' : '');
                
                if(engineOn){
                    $climateButton.removeClass("disabled");
                	$defrostButton.removeClass("disabled");
                }
                
                climateDial.enableDrag(engineOn);
                if (!isPending) updatePendingList('engine');
                
                updateDefrostButton();
                updateClimateButton();
            }
            
            function updateClimateButton() {
                $climateButton.toggleClass("on", climateOn).toggleClass("off", !climateOn);
                $climateButton.text(climateOn ? "on" : "off");
                $('.climate-img').addClass(climateOn && engineOn ? 'active' : '');
                
                if (climateOn && engineOn) {
                	climateDial.enable(true);
                	$('.climate .wrapper').removeClass("disabled");
                	$('.climate .wrapper .switcher').removeClass("disabled");
                	$('.climate .wrapper .minus').removeClass("disabled");
                	$('.climate .wrapper .plus').removeClass("disabled");
                	$('.climate .wrapper .value').removeClass("disabled");  	                
                } else {
                	climateDial.enable(false);
                	$('.climate .wrapper').addClass("disabled");
                	$('.climate .wrapper .switcher').addClass("disabled");
                	$('.climate .wrapper .minus').addClass("disabled");
                	$('.climate .wrapper .plus').addClass("disabled");
                	$('.climate .wrapper .value').addClass("disabled");
                }
                
                // turn off climate also turn off defrost
                if (!climateOn) {
                	defrosterOn = false;
                	updateDefrostButton();
                }
                if (!isPending) {
                	updatePendingList('dial');
                	updatePendingList('climate');
                }
            }

            function updateRetryList() {
            	
            	if (remoteStartPendingObject) {
            		// Dial
                	var tempOrig = module.tempFromHex(parseInt(com.vehicleStatus.airTemp.value.substr(0, 2), 16));
                	var tempNew  = module.tempFromHex(parseInt(remoteStartPendingObject.airTemp.value.substr(0, 2), 16));

            		if (tempOrig == tempNew) { 
            			$('.cart-dial', $retryList).addClass('hide'); 
            		} 
            		else {
            			$('.cart-dial', $retryList).removeClass('hide');
            			$('.cart-dial .val', $retryList).html(tempNew + ((isNaN(tempNew)) ? "": degreeStr));
            		}        
                	
            		// Engine
            		if (com.vehicleStatus.engine == true) {
            			$('.cart-engine', $retryList).addClass('hide');	            	
            		} else {                                                 
            			$('.cart-engine', $retryList).removeClass('hide');
	            		$('.cart-engine .val.on' ,$retryList).removeClass('hide');
        				$('.cart-engine .val.off' ,$retryList).addClass('hide');
            		}
                	// Climate
            		if (com.vehicleStatus.airCtrlOn == remoteStartPendingObject.airCtrl) {
            			$('.cart-climate', $retryList).addClass('hide');
            		} else {                                                   			 
            			$('.cart-climate', $retryList).removeClass('hide');
            			if (remoteStartPendingObject.airCtrl) {
            				$('.cart-climate .val.on' ,$retryList).removeClass('hide');
            				$('.cart-climate .val.off' ,$retryList).addClass('hide');
            			} else {
            				$('.cart-climate .val.on' ,$retryList).addClass('hide');
            				$('.cart-climate .val.off' ,$retryList).removeClass('hide');
            			}
            		}
            		// Defrost
            		if (com.vehicleStatus.defrost == remoteStartPendingObject.defrost) {
            			$('.cart-defrost', $retryList).addClass('hide');
            		} else { 
            			$('.cart-defrost', $retryList).removeClass('hide');
            			if (remoteStartPendingObject.defrost) {
            				$('.cart-defrost .val.on' ,$retryList).removeClass('hide');
            				$('.cart-defrost .val.off' ,$retryList).addClass('hide');
            			} else {
            				$('.cart-defrost .val.on' ,$retryList).addClass('hide');
            				$('.cart-defrost .val.off' ,$retryList).removeClass('hide');
            			}
            		}
            		
            		remoteStartPendingObject = null;
            		
            	} else {
            		// only need to check engine status if remoteStop
            		if (com.vehicleStatus.engine == false) 
            			$('.cart-engine', $retryList).addClass('hide');
            		else {                                          
            			$('.cart-engine', $retryList).removeClass('hide');
                		$('.cart-engine .val.on' ,$retryList).addClass('hide');
        				$('.cart-engine .val.off' ,$retryList).removeClass('hide');
            		}
            	}
            }
            
            function updatePendingList(action) {
            	
            	if (action == 'dial') {
            		var tempVal = module.tempFromHex(hvacTemp);
            		if (tempVal == module.tempFromHex(parseInt(com.vehicleStatus.airTemp.value.substr(0, 2), 16))) {
            			$('.cart-dial', $pendingList).addClass('hide');
            			isDialModified = false;
            		} else {
            			$('.cart-dial', $pendingList).removeClass('hide');
            			//$('.pending-list .cart-dial .val').html(tempVal + ((isNaN(tempVal)) ? "": degreeStr));
            			isDialModified = true;
            		}        
            	}
            	
            	if (action == 'engine') {
            		if (engineOn == com.vehicleStatus.engine) {
            			$('.cart-engine', $pendingList).addClass('hide');
            			isEngineModified = false;
            		} else {
            			$('.cart-engine', $pendingList).removeClass('hide');
            			if (engineOn) {
            				$('.cart-engine .val.on' ,$pendingList).removeClass('hide');
            				$('.cart-engine .val.off' ,$pendingList).addClass('hide');
            			} else {
            				$('.cart-engine .val.on' ,$pendingList).addClass('hide');
            				$('.cart-engine .val.off' ,$pendingList).removeClass('hide');
            			}
            			isEngineModified = true;
            		}     
            	}
            	
            	if (action == 'climate') {
            		if (climateOn == com.vehicleStatus.airCtrlOn || !engineOn) {
            			$('.cart-climate', $pendingList).addClass('hide');
            			isClimateModified = false;
            		} else {
            			$('.cart-climate', $pendingList).removeClass('hide');
            			if (climateOn) {
            				$('.cart-climate .val.on' ,$pendingList).removeClass('hide');
            				$('.cart-climate .val.off' ,$pendingList).addClass('hide');
            			} else {
            				$('.cart-climate .val.on' ,$pendingList).addClass('hide');
            				$('.cart-climate .val.off' ,$pendingList).removeClass('hide');
            			}
            			isClimateModified = true;
            		}     
            		
            		if (!climateOn) {
            			$('.cart-dial', $pendingList).addClass('hide');
            			isDialModified = false;
            		}
            	}
            	
            	if (action == 'defroster') {
            		if (defrosterOn == com.vehicleStatus.defrost || !engineOn) {
            			$('.cart-defrost', $pendingList).addClass('hide');
            			isDefrostModified = false;
            		} else {
            			$('.cart-defrost', $pendingList).removeClass('hide');
            			if (defrosterOn) {
            				$('.cart-defrost .val.on' ,$pendingList).removeClass('hide');
            				$('.cart-defrost .val.off' ,$pendingList).addClass('hide');
            			} else {
            				$('.cart-defrost .val.on' ,$pendingList).addClass('hide');
            				$('.cart-defrost .val.off' ,$pendingList).removeClass('hide');
            			}
            			isDefrostModified = true;
            		}     
            	}                	
            	
            	if (isClimateModified || isDefrostModified || isEngineModified || (isDialModified && engineOn)) {                		
            		if (!isPending) {
            			$('.kh-button-submit').removeClass('disabled');
            			$('.vehicle-refresh').addClass('hide');
            		}
            		$pendingList.removeClass('hide');
            		if (!$('.kh-button-success').hasClass('hide')) {
            			$('.kh-button-success').addClass('hide');
            			$('.kh-button-submit').removeClass('hide');
            		}
            	} else {
            		$('.kh-button-submit').addClass('disabled');
            		$pendingList.addClass('hide');
            	}
            	
            	if (!$('.kh-button-error').hasClass('hide')) {
        			$('.kh-button-error').addClass('hide');
        			$retryList.addClass('hide');
        			$('.kh-button-submit').removeClass('hide');
        		}
            } 
            // updatePendingList end
            
            function sendRemoteCommand(isStart, isRetry) {
                uvo.showLoadingMessage("Sending command");
                loadState('pending');

                var payload = {};
                isStart = isRetry ? (gblRemoteStartPendingObject ? true : false) : isStart; 
                var url = isStart ? "/ccw/kh/remoteStart.do" : "/ccw/kh/remoteStop.do";
                
                if (isStart) {                	                	
                	 var pTemp = isRetry ? gblRemoteStartPendingObject.airTemp.value : module.toHexString(hvacTemp).toUpperCase() + "H";
                	 var pClimate = isRetry ?  (gblRemoteStartPendingObject.airCtrl == 1) : climateOn;
                	 var pDefrost = isRetry ? gblRemoteStartPendingObject.defrost : defrosterOn;
                	 
                	 var remoteControl = {
                         "airCtrl"      : pClimate ? 1 : 0,
                         "defrost"	    : pDefrost,
                         "airTemp"      : { 'value':pTemp, 'unit':0 },
                         igniOnDuration : 10
                     };
                     payload['remoteStartPayload'] = JSON.stringify(remoteControl);
                }
                payload['vehicleStatusPayload'] = JSON.stringify(com.vehicleStatus);

               
                $.ajax({
                    url  : url,
                    type : "POST",
                    data : payload
                }).done(function () {
                	
                }).fail(function(xhr, status, err) {                    	
                	uvo.genericErrorHandler(xhr, status, err);
                	loadState('error');
                });
                
                    /*var $delConfirmModal = $(".modal.notification-pending");
                    $delConfirmModal.addClass("enabled");
                    
                    $(".cancel", $delConfirmModal).on('click', function () {
                        $delConfirmModal.removeClass("enabled");
                    });*/                    
            }

            /* Code for temp unit toggle. Keep here until feature is needed.
            $unitButtons.click(function () {
                var selectedUnit = $(this).hasClass("celsius") ? 'C' : 'F';

                if (tempUnits === selectedUnit) {
                    return true;
                }

                tempUnits = selectedUnit;
                $unitButtons.removeClass("on");
                $(this).addClass("on");

                updateTemperatureDisplay();
                return false;
            });*/
            
        	$(".plus.button").click(function () {
            	
        		if(!engineOn || isPending){
            		return;
                }

            	climateDial.tickUp();
                climateOn = true;
                updateClimateButton();
            	
            	var newTemp = hvacTemp;
                do {
                    newTemp += 1;
                    if (newTemp > maxTemp) {
                        break;
                    }
                } while (module.tempFromHex(newTemp) === lastHvacDisplayTemp);
                if (newTemp <= maxTemp) {
                    setHvacTemperature(newTemp);
                }
                
                updatePendingList('dial');
                
                return false;
            	
            });

            $(".minus.button").click(function () {
            	
        		if(!engineOn || isPending){
            		return;
                }
        		newMinTemp = 2;
            	climateDial.tickDown();
                climateOn = true;
                updateClimateButton();
                
            	var newTemp = hvacTemp;
                do {
                    newTemp -= 1;
                    if (newTemp < newMinTemp) {
                        break;
                    }
                } while (module.tempFromHex(newTemp) === lastHvacDisplayTemp);
                if (newTemp >= newMinTemp) {
                    setHvacTemperature(newTemp);
                }
                
                updatePendingList('dial');
                
                return false;
            	               	
            });
            
            $defrostButton.click(function () {
        		if(!engineOn || isPending){
        		return;
                }
        		
        		if(hvacTemp==1) {
        			hvacTemp =hvacTemp+1;        		
        		setHvacTemperature(hvacTemp);
        		}
            	
            	$('.defrost-img').toggleClass('active');
            	defrosterOn = !defrosterOn;
                updateDefrostButton();                    
            });
            
            $climateButton.click(function () {
        		if(!engineOn || isPending){
            		return;
                }
        		
        		
        		if(hvacTemp==1) {
        			hvacTemp =hvacTemp+1;        		
        		setHvacTemperature(hvacTemp);
        		}
        		       		
            	$('.climate-img').toggleClass('active');
            	climateOn = !climateOn;
                updateClimateButton();
                
                if(climateOn){
                	engineOn = true;
                    updateEngineButton();
                }
                if(!climateOn){
                	setHvacTemperature(1);
                	climateDial.tickFromDegree('Low');
                }
                
                
//                if(!climateOn){
//                	defrosterOn = false;
//                	updateDefrostButton();
//                	$('.defrost-img').removeClass('active');
//                }
            });

            $engineButton.click(function () {
        		if(!isPending) {
                	$('.engine-img').toggleClass('active');
                	engineOn = !engineOn;
                	updateEngineButton();

                	if(!engineOn){
                		climateOn = false;
                    	defrosterOn = false;
                    	setHvacTemperature(1);
                    	climateDial.tickFromDegree('Low');
                    	updateClimateButton();
                    	updateDefrostButton();
                    	
                    	$('.climate-img').removeClass('active');
                    	$('.defrost-img').removeClass('active');
                    	
                    	$climateButton.addClass("disabled");
                    	$defrostButton.addClass("disabled");
                    } else {
                    	if (hvacTemp == '--') setHvacTemperature(1);
                    	$climateButton.removeClass("disabled");
                    	$defrostButton.removeClass("disabled");
                    }
            	}
            });

            $(".kh-button-submit, .kh-button-error").click(function(){
            	if ((!isPending && !$('.kh-button-submit').hasClass('disabled')) || !$('.kh-button-error').hasClass('hide')) {
            		isPending = true;
            		$pendingList.addClass('hide');
            		sendRemoteCommand(engineOn,$(this).hasClass('kh-button-error'));
            	}
        	});         
            
            // disables remote navigation links
            $('.page-header ul li a').click(function() {
            	if (isPending) {
            		return false;
            	}
            });
			
            return pageReady;
        },        
        climateDialModule : {
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
    		    	knob = paper.image('/ccw/img/kh/img/remote/odo-button.png',0,0,68,68),
    		    	knobX = 0,
        		    knobY = 0,
        		    knobA = 0,
    		    	// shim is an invisible boundry for the knob. This is the actual object being dragged, in which its angle determines the
    		    	// knob position.
        		    shimDiv = ($('html').hasClass('lt-ie9')) ? '<div>' : '<div style="background:white; opacity:0">';
    		    	$shim = $(shimDiv).css({position:'absolute', width:68, height:68}).appendTo($(selector)),
    		    	    		    	
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
	    			            onDragFn(parseInt(tempMap[currentPos],16));
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
    					knob = paper.image('/ccw/img/kh/img/remote/odo-button-grey.png',0,0,68,68);
    					moveKnob(knobX,knobY,knobA,rPathString);
    				} else {
    					enabled = true;
    					if (path) path.remove();
    					path = paper.path(Raphael.transformPath("M 30 180 a150,150 0 1,0 150,-150",'r225')).attr( 'stroke-width', 16 )
		                   .attr( 'stroke', 'rgb(68,139,202)' );
    					path.click(function(e) { pathClicked(e); });
    					
    					knob.remove();
    					knob = paper.image('/ccw/img/kh/img/remote/odo-button.png',0,0,68,68);
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
        },
        scheduledClimate : function(){
        	$.ajax({
                cache: false,
                type: 'get',
                url: '/ccw/kh/scheduledInfo.do',
                data: {'offset' : uvo.common.offsetValue()}
            }).success(function(data){
            	if(data.success === true) 								//Vehicle has schedule
            	{
            		if(data.serviceResponse.length == 2) 				//Vehicle has both schedules
            			module.initClimateSchedule(data);
            		else{ 												//Vehicle has only one schedule set
            			if(data.serviceResponse[0].climateIndex == 0)	//Vehicle has Schedule I, not Schedule II
            				data.serviceResponse.push({"climateIndex":1,"reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"02"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0600","timeSection":0}}},"schedId": 0});
            			if(data.serviceResponse[0].climateIndex == 1)	//Vehicle has Schedule II, not Schedule I
            				data.serviceResponse.unshift({"climateIndex":0,"reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"02"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["9"],"time":{"time":"0600","timeSection":0}}},"schedId": 0});
            			
            			module.initClimateSchedule(data);
            		}
            	}
            	else {													//Vehicle has not set schedule yet,
            		module.initClimateSchedule(initSchedule);			// use default schedule initialize in global.
            	}
            }).fail();
        },
        initClimateSchedule	: function(climateScheduledData){
        	var aWeek = 7;
	        var dates = new Array("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN");

	        var $schedule1 = $('.schedule-one');
	        var $schedule2 = $('.schedule-two');
	        var data1 = climateScheduledData.serviceResponse[0];
	        var data2 = climateScheduledData.serviceResponse[1];
	        var dayHvac1 = data1.reservHvacInfoDetail.reservInfo.day;
	        var dayHvac2 = data2.reservHvacInfoDetail.reservInfo.day;
	        var numberHvac1, numberHvac2; // time in minutes
	        
	        // This object will be passed into addHvac function to update variables like data1, dayHvac1
	        // when a send request is successful
    	    var updateValuesHelper = {
	    		$schedule : null,
	    		data         : {},
	    		updateValues : function() {	    			
	    			var data = updateValuesHelper.data;
	    			var timeHvac = data.reservHvacInfoDetail.reservInfo.time.time;
			        var timeSectionHvac = data.reservHvacInfoDetail.reservInfo.time.timeSection;

			        var timeHvacHour = timeHvac.substring(0,2); 
			        var iTimeHvacHour = parseInt(timeHvacHour);
			        iTimeHvacHour = (iTimeHvacHour == 12) ? 0 : iTimeHvacHour;
			        var timeHvacMinute = timeHvac.substring(2);
			        var numberHvac;
			        
			        if (timeSectionHvac == 0)
				            numberHvac = 60*parseInt(iTimeHvacHour) + parseInt(timeHvacMinute);
				        else
				        	numberHvac = 60*(parseInt(iTimeHvacHour)+12) + parseInt(timeHvacMinute);
	    	    	//------------------------------------------------------
	    	    	if (updateValuesHelper.$schedule.hasClass('schedule-one')) {
	    	    		data1 = data;
	    	    		dayHvac1 = data.reservHvacInfoDetail.reservInfo.day;
	    	    		numberHvac1 = numberHvac;    	    		    	    		
	    	    	} else {
	    	    		data2 = data;
	    	    		dayHvac2 = data.reservHvacInfoDetail.reservInfo.day;
	    	    		numberHvac2 = numberHvac;   
	    	    	}
	    		}    	    		    	    		
    	    };    	    	   
	        
	        /*
	         *	Initialize components 
	         */
	        initComponents($schedule1, data1, dayHvac1);
    	    initComponents($schedule2, data2, dayHvac2);
    	    
    	    /*
    	     *  Functions
    	     */
	        function initComponents($schedule, data, dayHvac) {
	        	
	        	var tempValue = module.tempFromHex(data.reservHvacInfoDetail.airTemp.value.hexValue);
	        	var displayValue = "--";
	        	if (tempValue) {
		        	if(tempValue.toString().toLowerCase() == "high"){
		        		displayValue = "High";
		    	    	tempValue = 90;
		        	}else if(tempValue.toString().toLowerCase() == "low"){
		    	    	tempValue = 62;
		    	    	displayValue = "Low";
		    	    }else {
		    	    	displayValue =  tempValue + "°";
		    	    }
	        	}
	        	
	    	    var climateSet = data.reservHvacInfoDetail.climateSet;
		        if (climateSet == "true")
		            $(".hvac-set", $schedule).addClass("on");
		         
		        var defrostSet = data.reservHvacInfoDetail.defrost;
		        if (defrostSet == "true")
		            $(".defrost-set", $schedule).addClass("on");
		        
		        var dayHvac = data.reservHvacInfoDetail.reservInfo.day;
		        var dateHvac = '';
		        
		        var timeHvac = data.reservHvacInfoDetail.reservInfo.time.time;
		        var timeSectionHvac = data.reservHvacInfoDetail.reservInfo.time.timeSection; // 0 - am, 1 - pm

		        var timeHvacHour = timeHvac.substring(0,2); 
		        var iTimeHvacHour = parseInt(timeHvacHour);
		        iTimeHvacHour = (iTimeHvacHour == 12) ? 0 : iTimeHvacHour;
		        var timeHvacMinute = timeHvac.substring(2);

		        if ($schedule.hasClass('schedule-one')) {
			        if (timeSectionHvac == 0)
			            numberHvac1 = 60*parseInt(iTimeHvacHour) + parseInt(timeHvacMinute);
			        else
			        	numberHvac1 = 60*(parseInt(iTimeHvacHour)+12) + parseInt(timeHvacMinute);
		        } else {
		        	if (timeSectionHvac == 0)
			            numberHvac2 = 60*parseInt(iTimeHvacHour) + parseInt(timeHvacMinute);
			        else
			        	numberHvac2 = 60*(parseInt(iTimeHvacHour)+12) + parseInt(timeHvacMinute);
		        }
		        
		        timeHvacHour = (timeHvacHour == '00'? '12': timeHvacHour);
		        var timeHvacSection = (timeSectionHvac == 0? ' AM' : ' PM');
		        var timeHvacSectionUpper = (timeSectionHvac == 0? 'AM' : 'PM');
		        
		        for(i=0; i<aWeek; i++)
		        {    		        	
		        	var dayIndex = dayHvac[i];
		            if ( dayIndex != null && dayIndex >= 0 && dayIndex <= 6 )
		            {
		                if (dayHvac[i] == 9)
		                    dateHvac = "No Reservation Setting in TMU";
		                else
		                    dateHvac += dates[dayHvac[i]] + '. ';
		                
		                $("." + dates[dayHvac[i]].toString().toLowerCase(), $schedule).addClass("selected");
		            }
		        }
		        
		        $(".time-hvac", $schedule).html("<span>" + timeHvacHour + ":" + timeHvacMinute + "</span>" + timeHvacSection);
		        $(".date-hvac", $schedule).html(dateHvac);
		        $(".schedule-temp", $schedule).html(displayValue);
		        
		        $(".time-hvac-hour", $schedule).html(timeHvacHour);
		        $(".time-hvac-minute", $schedule).html(timeHvacMinute);
		        $(".time-hvac-section", $schedule).html(timeHvacSectionUpper);
		        
		        // SCHEDULE CLIMATE EVENTS
		        $('.minute-list li, .hour-list li, .am-pm-list li, .minute-list2 li, .hour-list2 li, .am-pm-list2 li', $schedule).click(function() {
		        	removeSuccessMessage($schedule);
		        });
		        
		        $('.climate-schedule .btnSchedule .myBtn', $schedule).click(function(){
		        	var isScheduleOne = $schedule.hasClass('schedule-one'),
		        		dayHvac = (isScheduleOne) ? dayHvac2 : dayHvac1,
		        		numberHvac = (isScheduleOne) ? numberHvac2 : numberHvac1;
		        	
	            	module.addHvacEvent($schedule, data.schedId, dayHvac, numberHvac, dates, updateValuesHelper);
	            	
	            });
		        
		        $('.date-box', $schedule).click(function(){
	                $(this).toggleClass("selected");
	                $(".valid-date", $schedule).addClass("hide");
	                $(".validSchedule", $schedule).addClass("hide");
                	$(".conflictError", $schedule).addClass("hide");
	                removeSuccessMessage($schedule);
	            });
	    	    
	    	    $('.hvac-set, .defrost-set', $schedule).click(function(){
		            
		            if(!$('.hvac-set', $schedule).hasClass("disabled")){
		            	$(this).toggleClass("on");
		            	removeSuccessMessage($schedule);
		            }
		            
		        });
	    	    
	    	    $('.arrow-btn, .btnCancel', $schedule).click(function(){
			    	$('.arrow-btn',$schedule).toggleClass("up");
			        $('.climate-schedule' , $schedule).toggleClass("show-schedule");
			        if($('.hvac-set', $schedule).hasClass("disabled")){
			        	$('.hvac-set', $schedule).removeClass("disabled");
		            }else{
			        	$('.hvac-set', $schedule).addClass("disabled");
		            }
			        removeSuccessMessage($schedule);
			    });
	    	    
	    	    function removeSuccessMessage($schedule) {
	    	    	if (!$('.btnSuccess', $schedule).hasClass('hide')) {
	    	    		$('.btnSuccess', $schedule).addClass('hide');
	    	    		$('.btnSchedule .myBtn', $schedule).removeClass('hide');
   	            	}
	    	    }  
		        
		        // SLIDER
		        var slider = $('.slider', $schedule).slider({
	   	            value: tempValue,
	   	            min: 62,
	   	            max: 90,
	   	            create: setInputsSlider,
	   	            slide: setInputsSliderDrag,
	   	            change: setInputsSlider,
	   	            stop: setInputsSlider
	   	        });


		        function setInputsSliderDrag(event,ui){
	    	    	var val = (ui.value)<91 ? ui.value : $('.slider',$schedule).slider('value');	    	    
	    	    	if(val== 90)
	    	    		{	    	    		
	    	    		$('.ui-slider-range', $schedule).width(getRangeWidth(val));	    	                       
		   	            var handleToLeftValue = $('.slider a', $schedule).css('left');
	    	    		$(this).parent().find(".slidergrade").hide();
			        	$(this).parent().find(".gradeLowHigh").show().text('High');
				        $('.temp-value', $schedule).text(val);	
			        	return;
	    	    		}
	    	    		else if(val<63){	    	    		
	    	    		$('.ui-slider-range', $schedule).width(getRangeWidth(val));		   	             	           
		   	            var handleToLeftValue = $('.slider a', $schedule).css('left');
	    	    		$(this).parent().find(".slidergrade").hide();
			        	$(this).parent().find(".gradeLowHigh").show().text('Low');
			            $('.temp-value', $schedule).text(val);				   	        	
			            return;
	    	    	}
	    	    		else {		    	    		
	    	    	$('.ui-slider-range', $schedule).width(getRangeWidth(val));
	   	            $('.temp-value', $schedule).text(val);	   	             	          
	   	            var handleToLeftValue = $('.slider a', $schedule).css('left');
			        	$(this).parent().find(".gradeLowHigh").hide().text('');
			        	$(this).parent().find(".slidergrade").show();
	    	    	}
	    	    	
	   	            removeSuccessMessage($schedule);
	    	    }
		        
		        
	    	    		        
		        // SLIDER FUNCS
	    	    function setInputsSlider(event,ui){
	    	    	var val = (ui.value)<89 ? ui.value : $('.slider',$schedule).slider('value');
	    	    	if(($('.slider',$schedule).slider('value'))>89)
	    	    		{
	    	    		$('.ui-slider-range', $schedule).width(getRangeWidth(val));	    	                       
		   	            var handleToLeftValue = $('.slider a', $schedule).css('left');
	    	    		$(this).parent().find(".slidergrade").hide();
			        	$(this).parent().find(".gradeLowHigh").show().text('High');
				        $('.temp-value', $schedule).text(val);
			        	return;
	    	    		}
	    	    	else if(($('.slider',$schedule).slider('value'))<63){
	    	    		$('.ui-slider-range', $schedule).width(getRangeWidth(val));		   	             	           
		   	            var handleToLeftValue = $('.slider a', $schedule).css('left');
	    	    		$(this).parent().find(".slidergrade").hide();
			        	$(this).parent().find(".gradeLowHigh").show().text('Low');
			            $('.temp-value', $schedule).text(val);				   	        	
			            return;
	    	    	}
	    	    	else {	
	    	    	$('.ui-slider-range', $schedule).width(getRangeWidth(val));
	   	            $('.temp-value', $schedule).text(val);	   	             	          
	   	            var handleToLeftValue = $('.slider a', $schedule).css('left');
			        	$(this).parent().find(".gradeLowHigh").hide().text('');
			        	$(this).parent().find(".slidergrade").show();
	    	    	}
	    	    	
	   	            removeSuccessMessage($schedule);
	    	    }
	    	    
	    	    function getRangeWidth(val) {
	    	    	var dx = 28; // max - min
	    	    	var ratio = parseFloat((val - 62)/28.0);
	    	    	return parseInt($('.slider',$schedule).css('width')) * ratio;
	    	    }
	    	    
	    	   /* $('.ui-slider-handle').mousedown(function(){
	    	    	console.log('onmousedown....');
	    	    });*/
	    	    
	    	    // SLIDER EVENTS
		        $('.slider-f .blue-bar .myBtn', $schedule).on('click', function(){ //tempIncrOne()
	   	        	if(tempUnits == "F"){
		   	            var newTempF = parseInt($('.temp-value', $schedule).text()) + 1;
		   	            if (newTempF > 90)
		   	            	{
		   	            	$(this).parent().parent().find(".slidergrade").hide();
				        	$(this).parent().parent().find(".gradeLowHigh").show().text('High');
				        	//console.log(">90",$(".slidergrade"));
				        	slider.slider("value", newTempF);
				            return;
				        	}
				        else{
				        	//console.log("else");
				        	$(this).parent().parent().find(".gradeLowHigh").hide().text('');
				        	$(this).parent().parent().find(".slidergrade").show();
		   	                
		   	            $('.temp-value', $schedule).text(newTempF);
		   	            //$('.slider', $schedule).slider("value", newTempF);
		   	            slider.slider("value", newTempF);
		   	            $('.ui-slider-range', $schedule).width(getRangeWidth(newTempF));
				        }
		   	            ///var newTempC = global.hexConvert(newTempF);
//		   	            var newTempC = module.toHexString(newTempF);
//		   	            $('.temp-value-c', $schedule).text(newTempC);
//		   	            $('.slider-c', $schedule).slider().slider("value", newTempC);
//		   	            $('.ui-sliderC-range', $schedule).width((newTempC-17)*30);
		   	        } else {
		   	            var newTempC = parseFloat($('.temp-value-c', $schedule).text()) + .5;
		   	            if (newTempC > 32)
		   	                return;
		   	            $('.temp-value-c', $schedule).text(newTempC);
		   	            //$('.slider', $schedule).slider("value", newTempC);
		   	            slider.slider("value", newTempC);
		   	            $('.ui-sliderC-range', $schedule).width((newTempC-17)*30);
		   	            
		   	            var newTempF = global.hexConvert(newTempC);
		   	            $('.temp-value', $schedule).text(newTempF);
		   	            $('.slider', $schedule).slider().slider("value", newTempF);
		   	            $('.ui-slider-range', $schedule).width((newTempF-60)*15);
		   	        }
	   	        });
		        
		        $('.slider-f .red-bar .myBtn',$schedule).on('click', function(){ //tempDecrOne()
				    if(tempUnits == "F"){
				        var newTempF = parseInt($('.temp-value',$schedule).text()) - 1;
				        //console.log(newTempF);
				        if (newTempF < 62)				        	
				        	{
				        	$(this).parent().parent().find(".slidergrade").hide();
				        	$(this).parent().parent().find(".gradeLowHigh").show().text('Low');				        	
				            return;
				        	}
				        else{				        	
				        	$(this).parent().parent().find(".gradeLowHigh").hide().text('');
				        	$(this).parent().parent().find(".slidergrade").show();				        	
				        $('.temp-value',$schedule).text(newTempF);
				        //$('.slider', $schedule).slider("value", newTempF);
		   	            slider.slider("value", newTempF);
				        $('.ui-slider-range', $schedule).width(getRangeWidth(newTempF));
				        }
				        ///var newTempC = global.hexConvert(newTempF);
//		   	            var newTempC = module.toHexString(newTempF);
//				        $('.temp-value-c', $schedule).text(newTempC);
//				        $('.slider-c', $schedule).slider().slider("value", newTempC);
//				        $('.ui-sliderC-range', $schedule).width((newTempC-17)*30);
				    } else {
				        var newTempC = parseFloat($('#tempValueOneC').text()) - .5;
				        if (newTempC < 17)
				            return;
				        $('.temp-value-c', $schedule).text(newTempC);
				        //$('.slider', $schedule).slider("value", newTempC);
		   	            slider.slider("value", newTempC);
				        $('.ui-sliderC-range', $schedule).width((newTempC-17)*30);
				        
				        var newTempF = global.hexConvert(newTempC);
				        $('.temp-value',$schedule).text(newTempF);
				        $('.slider', $schedule).slider().slider("value", newTempF);
				        $('.ui-slider-range', $schedule).width((newTempF-60)*15);
				    }
				});
	        }
            /*--End of Schedule Climate--*/
        },
        /*
         * params:
         * $schedule  : the schedule jQ element to work on. Either schedule 1 or 2
         * scheduleId : ID received from DB
         * dayHvac    : Array of days of target schedule
         * numberHvac : Array of days of other schedule
         * dates      : date array (ex. {'MON','TUE'....} )
         * updateValuesCallback : function passed from initComponents to update values of target schedule when schedule is successfully saved
         */
        addHvacEvent         : function($schedule, schedId, dayHvac, numberHvac, dates, updateValuesHelper) {
        	
			var hvacInfos = {"climateIndex": ($schedule.hasClass('schedule-one'))?0:1, "reservHvacInfoDetail" : {"airTemp" : {"unit" : 1, "value" : {"hexValue": "02"}}, "climateSet" : true, "defrost" : true, "reservInfo" : {"day" : [], "time" : {"time" : "", "timeSection" : 0}}},"schedId":0};
        	
			var time = $('.time-hvac-hour',$schedule).text() + $('.time-hvac-minute',$schedule).text();
			var timePeriod = ($('.time-hvac-section',$schedule).text() == 'AM'? 0: 1);
			var dateSelected = false;
			var days = ['MON. ','TUE. ','WED. ','THU. ','FRI. ','SAT. ','SUN. ']; 
			var daysSelected=[];
			var j = 1;
			for(i=0; i<7; i++,j++)
			{
			    if( $("." + dates[i].toString().toLowerCase(), $schedule).hasClass("selected") )
			    {
			        hvacInfos.reservHvacInfoDetail.reservInfo.day.push(i.toString());
			        daysSelected.push(days[i]);
			        
			        dateSelected = true;
			    }
			   
			}
			
			var hourConvert = ($('.time-hvac-hour',$schedule).text() == 12? 0: $('.time-hvac-hour',$schedule).text());
			var newNumberHvac;
            if (timePeriod == 0)
                newNumberHvac = 60*parseInt(hourConvert) + parseInt($('.time-hvac-minute',$schedule).text());
            else
                newNumberHvac = 60*(parseInt(hourConvert)+12) + parseInt($('.time-hvac-minute',$schedule).text());

            var tempHexValue = (parseInt($('.temp-value', $schedule).text()) - 59).toString(16);
            
            if ($('.temp-value', $schedule).text() == 62)
                tempHexValue = "2";
             
            if ($('.temp-value', $schedule).text() == 90)
                tempHexValue = "20";
                
            if(tempHexValue.length  == 1)
                tempHexValue = "0" + tempHexValue;
            
            var mySchedule;

            hvacInfos.reservHvacInfoDetail.airTemp.value.hexValue = tempHexValue;
            hvacInfos.reservHvacInfoDetail.reservInfo.time.time = time;
            hvacInfos.reservHvacInfoDetail.reservInfo.time.timeSection = timePeriod;
            hvacInfos.reservHvacInfoDetail.climateSet = ($('.hvac-set', $schedule).hasClass("on")? true: false);
            hvacInfos.reservHvacInfoDetail.defrost = ($('.defrost-set', $schedule).hasClass("on")? true: false);
            hvacInfos.schedId = schedId;
            mySchedule = JSON.stringify([hvacInfos]);
            //console.log('mySchedule',mySchedule);
            
            if (dateSelected){
            	
                if(module.validScheduleRule(numberHvac, newNumberHvac, dayHvac, hvacInfos.reservHvacInfoDetail.reservInfo.day)){ 
                	if (updateValuesHelper) {
                		updateValuesHelper.$schedule = $schedule;
                		updateValuesHelper.data = hvacInfos;
                		updateValuesHelper.updateValues();
                	}
                	module.postHvac(mySchedule, $schedule);
                	 $(".date-hvac", $schedule).html(daysSelected );
                	 var newTime = [time.slice(0, 2), ":", time.slice(2)].join('');
                	
                	 if(timePeriod == 0) {
                		 $(".time-hvac", $schedule).html(newTime.fontcolor('#444444') + ' AM');
                	 }
                	 else {
                		 $(".time-hvac", $schedule).html(newTime.fontcolor('#444444') + ' PM');
                	 }
                	 
                	var tempValue = module.tempFromHex(hvacInfos.reservHvacInfoDetail.airTemp.value.hexValue);
     	        	var displayValue = "--";
     	        	if (tempValue) {
     		        	if(tempValue.toString().toLowerCase() == "high"){
     		        		displayValue = "High";
     		    	    	tempValue = 90;
     		        	}else if(tempValue.toString().toLowerCase() == "low"){
     		    	    	tempValue = 62;
     		    	    	displayValue = "Low";
     		    	    }else {
     		    	    	displayValue =  tempValue + "°";
     		    	    }
     	        	}
     	        	$(".schedule-temp", $schedule).html(displayValue);
                }
                else {
	                	
                	$(".conflictError", $schedule).removeClass("hide");
                	$(".validSchedule", $schedule).removeClass("hide");
	                /*alert('Not a valid schedule PLEASE.');*/
                }
                	
                	
            }
            else
            	$(".valid-date", $schedule).removeClass("hide");
                /*alert("Please select date(s) to schedule.");*/
            
           
        	
        },
        postHvac : function(scheduleData, $schedule){            
            var obj = {};            
            obj.data = {rsvHvacInfo : scheduleData, offset : uvo.common.offsetValue()};

            $('.btnPending', $schedule).removeClass('hide');
            $('.btnSchedule .myBtn, .btnSuccess, .btnCancel', $schedule).addClass('hide');
          
        	$.ajax({
                cache: false,
                type: "POST",
                url: '/ccw/kh/reserveHVAC.do',
                data: obj.data
            }).success(function(result){
            	//console.log('After Post',result);
            	if(result.success === true) {
            		
            		$('.btnPending', $schedule).addClass('hide');
            		$('.btnSuccess, .btnCancel', $schedule).removeClass('hide');
            		$('.error',$schedule).addClass('hide');
            		
            	}
            	//else
            		//alert('fail');
            });
            
        },
        /*
         * params //*note* 'Other' is the other schedule is comparing with. 'Target' is the schedule to be saved
         * oldTime : aka Other Time 
         * newTime : aka Target Time
         * oldDay  : aka Array of Other days
         * newDay  : aka Array of Target days
         */
        validScheduleRule : function(oldTime, newTime, oldDay, newDay){        	
        	// Determine if schedule climate is on for one or both climates.
        	// If one climate is off, then the other climate can be set to anything. 
        	
        	if ($('.hvac-set.on').length < 2) {
        		return true;
        	}
        	
        	var result = true,
        		days = ['MON, ','TUE, ','WED, ','THU, ','FRI, ','SAT, ','SUN, '],
   	 			conflictDay=[],
   	 			conflictDayFlags= [false,false,false,false,false,false,false];
        	
            for(var i in oldDay){
                for(var j in newDay){
                    //Schedule in the same day
                    if(oldDay[i] == newDay[j] && oldDay[i] != undefined){
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
                    if(newDay[j] - oldDay[i] == 1 || newDay[j] - oldDay[i] == -6){
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
                    if(oldDay[i] - newDay[j] == 1 || oldDay[i] - newDay[j] == -6){
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
        	
        	$(".conflictDay").html(conflictDay);
            
            return result;
        },
        initRemoteLock       : function initRemoteLock() {
        	
        	$('#tmsRefresh').toggle();
        	uvo.showLoadingMessage();
        	var interval,
        		doors,
        		isLocked = false, // gbl var for lock status
        		doorStatusArray,
        		highestDoorStatus = 0,
        		$doors = $(".car-doors"),
        		$vehicleLockWidget = $(".control.locked"),
        		$door, i,
        		remoteStatus,
        		isPending = false,
        		hasErrors = false,
        		isLockRetry = false,  // true: display retry button for lock, false: display retry button for unlock
        		isLoading = true,
        		vehicleStatusPayload = null,
        		isDoorOpen = false; // true: user cannot submit lock request
        		;        	
        	
        	// bind tmsRefresh button that will be located underneath the error button
        	$('#tmsRefresh').off('click');
        	$('.vehicle-refresh,#tmsRefresh').click(function() {
        		$('.control .selector .pending').text('Refreshing Vehicle Status...');
        		loadState('pending');
        		module.clearPendingRefresh(interval); // vehicle refresh is on-going
        		uvo.refreshVehicleStatusClick(
        				null,
        				function() { // on fail
        					loadState('error');
        					$('.button.error').addClass('hide');
        					$('.button.unlock, .button.lock').removeClass('hide');        					
        				},
        				null);
        	});
        	

        	loadState('loading');
        	function loadState(state) {
            	if (state == 'pending') {
            		uvo.showLoadingMessage();
            		isPending = true;
            		$('.button.unlock, .button.lock, .button.error, .vehicle-refresh').addClass('hide');
            		$('.control .selector .pending').removeClass('hide');
            		if (remoteStatus.remoteStopStatus == 'P')       $('.control .selector .pending').text('Engine stopping...');
            		else if (remoteStatus.remoteStartStatus == 'P') $('.control .selector .pending').text('Engine starting...');
            		else if (remoteStatus.lockStatus == 'P')        $('.control .selector .pending').text('Locking vehicle...');
            		else if (remoteStatus.unlockStatus == 'P')      $('.control .selector .pending').text('Unlocking vehicle...');                		
            		
            		$('#a_normal span').text('');
            		
        			$('.page-header ul li a').addClass('disabled'); 
        			interval = module.initPendingRefresh(); 
            		
        			$('.pending-msg').removeClass('hide');
            	} 
            	else if (state == 'error') {                  		
            		module.clearPendingRefresh(interval);
            		$('.selector').addClass('error');
            		$('.button.unlock, .button.lock, .control .selector .pending').addClass('hide');
            		$('.button.error').removeClass('hide');
            		$('.button.error').text((isLockRetry) ? 'Retry lock' : 'Retry unlock');
            		$('.page-header ul li a').removeClass('disabled');
            		$('.pending-msg').addClass('hide');
            		$('.vehicle-refresh').removeClass('hide');
            		
            		var params = window.location.search.replace('?','');
            		if (params == 'r' || $('body').hasClass('show-loading-error')) { 
            			uvo.genericErrorHandler(null,null,'Your previous request did not complete. Your settings have been restored.');
            		}
            	} else if (state == 'loading') {
            		$('.pending-msg').addClass('hide');
            	}
            	
            	// if not pending, set global pending var to false
            	if (state != 'pending') {
            		isPending = false;
            	}
            	
            	// if not error, remove vehicle refresh button
            	if (state != 'error') {
            		$('.selector').removeClass('error');
            		$('.vehicle-referesh').addClass('hide');            		
            	}
            		
            	// disable buttons and remove overlays
            	if (state == 'loading' || state == 'pending') {
            		$vehicleLockWidget.addClass('disabled');
            		$('.base .door',$doors).addClass('disabled');    
            		$('.selector').addClass("processing").removeClass('error');
            	} else {
            		$vehicleLockWidget.removeClass('disabled');
            		$('.base .door',$doors).removeClass('disabled');
            		$('.selector').removeClass("processing").addClass('error');
            	}
            	
            }

            function updateLockStatus() {
                var statusText = "Your Vehicle is " + (isLocked ? "Locked" : "Unlocked");

                $vehicleLockWidget.toggleClass("unlocked", !isLocked);
                $vehicleLockWidget.find('.title').text(statusText);
                $(".unlock.button").toggleClass("active", !isLocked).toggleClass("inactive", isLocked).text(isLocked ? 'Unlock' : 'Unlocked');
                $(".lock.button").toggleClass("active", isLocked).toggleClass("inactive", !isLocked).text(isLocked ? 'Locked' : 'Lock');
            }

            function allDoorsClosed() {
                return (highestDoorStatus < 1);
            }

            function lockUnlockRequest(lockState) {
                var newStateIsLocked = lockState === "lock";

                if (newStateIsLocked === isLocked) {
                    return;
                }

                $vehicleLockWidget.toggleClass("unlocked", isLockRetry);
                $('.control .selector .pending').text((!newStateIsLocked) ? 'Unlocking vehicle...' : 'Locking vehicle...');
                var url = newStateIsLocked ? "/ccw/kh/lockDoor.do" : "/ccw/kh/unlockDoor.do";

                uvo.showLoadingMessage((newStateIsLocked ? "Lock" : "Unlock") + "ing doors");
                
                $('#a_normal span').text('');
                loadState('pending');
                
                $.ajax(
                		{url:url,
                		 method:'POST',
                		 data:{'vehicleStatusPayload':JSON.stringify(com.vehicleStatus)}
                		}).done(function doorlockUnlockCompleted() {
                }).fail(function (xhr, status, err) { 
                	uvo.genericErrorHandler(xhr, status, err);
                	loadState('error');
                });
                
            }

            //click handler for lock button
            $(".lock.button").on('click', function () {
            	if (!isLoading) {
	            	isLockRetry = true;
	                lockUnlockRequest("lock");
            	}
            });

            //click handler for unlock button
            $(".unlock.button").on('click', function () {
               	if (!isLoading) {
	            	isLockRetry = false;
	                lockUnlockRequest("unlock");
               	}
            });
            
            //click handler for error button
            $(".error.button").on('click', function () {
               	if (!isLoading) {
               		lockUnlockRequest((isLockRetry) ? 'lock' : 'unlock');
               	}
            });

        	// disables remote navigation links
            $('.page-header ul li a').click(function() {
            	if (isPending) {
            		return false;
            	}
            });
            
            // Load Data
            uvo.dataRequest("khVehicleStatusRemote").done(function(statusResponse) {
            	isLoading = false;
            	
            	$vehicleLockWidget.removeClass('disabled');
        		$('.base .door',$doors).removeClass('disabled');  
            	
            	var vehicleStatusResponse = new uTypes.VehicleStatusReponse(statusResponse[0].serviceResponse);
                com.vehicleStatus = vehicleStatusResponse.latestVehicleStatus;
                com.vehicleStatusTimestamp = vehicleStatusResponse.timeStampVO;
                if (com.vehicleStatus) { // Delete these extra variables that cause jscript errors
                	delete com.vehicleStatus['_rawLoaded'];
                	delete com.vehicleStatus['dateTime'];
                	delete com.vehicleStatus['moment'];
                }           
                             
                // Check if doorOpen and trunkOpen are undefined
                if (!com.vehicleStatus.doorOpen) com.vehicleStatus.doorOpen = {frontLeft:true,frontRight:true,backLeft:true,backRight:true};
                if (!com.vehicleStatus.trunkOpen) com.vehicleStatus.trunkOpen = false;
                
                isLocked = com.vehicleStatus.doorLock;
                doors = com.vehicleStatus.doorOpen; 
                isDoorOpen = doors.frontLeft === true || doors.frontRight === true || doors.backLeft === true || doors.backRight === true;                
                doorStatusArray = [
                    doors.frontLeft, doors.frontRight, doors.backLeft, doors.backRight, +com.vehicleStatus.trunkOpen
                ];
                                
                remoteStatus = statusResponse[1];
                isPending = (statusResponse[1].remoteStartStatus == 'P' || statusResponse[1].remoteStopStatus == 'P' 
                		      || statusResponse[1].lockStatus == 'P' || statusResponse[1].unlockStatus == 'P');             
                hasErrors = ((statusResponse[1].lockStatus == 'E' && !isLocked) || (statusResponse[1].unlockStatus == 'E' && isLocked));
                isLockRetry = false;
                
                if (isPending) {
                	loadState('pending');                	
                } 
                else if (hasErrors) {
                	uvo.genericErrorHandler(null,null,'Your previous request did not complete. Your settings have been restored.');
                	if (statusResponse[1].lockStatus == 'E' && statusResponse[1].unlockStatus =='E') {
                		if (isLocked) isLockRetry = false;
                		else isLockRetry = true;
                	}
                	else if (statusResponse[1].lockStatus == 'E') isLockRetry = true; 
                	else if (statusResponse[1].unlockStatus == 'E') isLockRetry = false;
                	                	
                	loadState('error');
                } else {
                	// flash green bar when url has 'r' in querystring
                	var params = window.location.search.replace('?','');
					if (params == 'r') { 
						uvo.clearLoadingConfirm(); 
						$('#a_normal span').text('Your previous request was successful . Your vehicle status has been updated to reflect changes.');
					} else {
						uvo.clearLoading();
						$('#a_normal span').html('Last updated as of'+' '+ moment(com.vehicleStatusTimestamp.unixTimestamp * 1000).format("MMMM DD, YYYY h:mm a"));
		                $("body").removeClass("updated");
					}
					
					// if door is open, show message that user cannot submit lock request
					if (isDoorOpen) { $('.selector').addClass('hide'); $('.error-msg').removeClass('hide'); }
					else            { $('.selector').removeClass('hide'); $('.error-msg').addClass('hide'); }
                }
                
                highestDoorStatus = 0;
                for (i = 0; i < doorStatusArray.length; i += 1) {
                    highestDoorStatus = highestDoorStatus | doorStatusArray[i]; //bitwise OR
                    $door = $doors.find(".p" + (i + 1));
                    $door.toggleClass("unlocked", !isLocked);
                    $door.toggleClass("open", doorStatusArray[i] === 1);
                }
                
                updateLockStatus();
            });
        },
        carLocation          : function (defer) {

        },
        initFindMyCar        : function initFindMyCar() {
        	
            if (!gMaps) {
                console.error("Missing Google Maps JS API");
            }
            
            var $baseInfo = $('.info-window').remove(),            
            	resultMap = uvo.drawDefaultMap(),
            	hasZoomed = false,
            	centerMark, browserLocPin, isPending = false;
            
            // send fmc request event
            $('.kh-button-submit','.fmc-modal-widget-prompt').click(function() {   
            	submitRequestOnClick();
            });
            
            $('.kh-button-retry','.fmc-modal-widget-error').click(function() {   
            	submitRequestOnClick();
            });
            
            function submitRequestOnClick() {
            	$('#a_normal span').text('');
            	loadState('pending');
            	uvo.showLoadingMessage();
            	sendRequest();
            }
            
            // disables remote navigation links
            $('.page-header ul li a').click(function() {
            	if (isPending) {
            		return false;
            	}
            });
            
            var haveBrowserLoc = com.getBrowserLocation();
            var infoWindow = new gMaps.InfoWindow({
                pixelOffset : new gMaps.Size(1, -50, "px", "px")
            });

            
            haveBrowserLoc.done(function (loc) {
                if (!resultMap) {
                	var latlng = new gMaps.LatLng(loc.coords.latitude, loc.coords.longitude);
                    var mapOptions = new com.MapOptions({center : latlng});
                    resultMap = new gMaps.Map($("#map-canvas").get(0), mapOptions);
                    browserLocPin = new gMaps.Marker({
                        map      : resultMap,
                        position : latlng,
                        icon     : '/ccw/img/station/address-pin.png'
                    });
                }
            });                    
            
            function loadState(state) {
            	if (state == 'pending') {
            		isPending = true;
            		$('.fmc-modal-widget').addClass('hide');
                	$('.fmc-modal-widget-pending').removeClass('hide');
                	$('.page-header ul li a').addClass('disabled');                	
                	$('#a_normal span').text('');                	
                	uvo.toggleOnBeforeUnload(true);
            	}else if (state == 'error' || state == 'success') {
            		isPending = false;
            		$('.fmc-modal-widget').addClass('hide');
            		$('.page-header ul li a').removeClass('disabled');
            		uvo.toggleOnBeforeUnload(false);            		
            		if (state == 'error') $('.fmc-modal-widget-error').removeClass('hide');
            		if (state == 'success') $('.fmc-modal-background').addClass('hide');
            	}
            }
            
            function drawMapForCar(carLocation) {            	
            	var bounds = new gMaps.LatLngBounds(); 
            	var carlatLng = new gMaps.LatLng(carLocation.coords.lat, carLocation.coords.lon);
            	var addrStr = com.formatGoogleMapsAddress(carLocation.address);
            	 //var directionsUrl = 'https://maps.google.com/maps?f=d&daddr=' + addrStr.replace(/(<([^>]+)>)/ig, ', ') + '&dirflg=h';  
                var directionsUrl = 'https://maps.google.com/maps?f=d&daddr=' + carLocation.coords.lat + ',' + carLocation.coords.lon + '&dirflg=h';
               
                $(".address", $baseInfo).html(addrStr);
                $('.kh-button-submit', $baseInfo).prop("href", directionsUrl);
                //$(".cta", $baseInfo).prop("href", directionsUrl);
                $(".close", $baseInfo).click(function() {infoWindow.close();});
                
                if (!resultMap) {
                    var mapOptions = new com.MapOptions({center : carlatLng});
                    resultMap = new gMaps.Map($("#map-canvas").get(0), mapOptions);
                }
	                
                centerMark = new gMaps.Marker({
                    map      : resultMap,
                    position : carlatLng,
                    icon     : '/ccw/img/kh/img/remote/car-pin.png'
                });
                function togglePin() {
                	if ($('.info-window').length) infoWindow.close();
                	else infoWindow.open(resultMap);
                }
                google.maps.event.addListener(centerMark, 'click', togglePin);
                
                bounds.extend(carlatLng);
                
                infoWindow.setContent($baseInfo[0]);
                infoWindow.setPosition(carlatLng);
                infoWindow.open(resultMap);
                
                resultMap.fitBounds(bounds);
                
                google.maps.event.addListenerOnce(resultMap,'idle', calcZoom);

                haveBrowserLoc.done(function (loc) {
                    var latlng = new gMaps.LatLng(loc.coords.latitude, loc.coords.longitude);
                    browserLocPin = new gMaps.Marker({
                        map      : resultMap,
                        position : latlng,
                        icon     : '/ccw/img/station/address-pin.png'
                    });
                    directionsUrl += "&saddr=" + loc.coords.latitude + "," + loc.coords.longitude;
                    //$(".kh-button-submit", $baseInfo).prop("href", directionsUrl);
                    bounds.extend(latlng);
                    resultMap.fitBounds(bounds);                               
              	
                    google.maps.event.addListenerOnce(resultMap,'idle', calcZoom);
               });
                
               function calcZoom() {
            	   var zoomValue = resultMap.getZoom();
            	   if (zoomValue > 18) zoomValue = 18;
            	   else if (hasZoomed) zoomValue - 1;
            	   
               	   resultMap.setZoom(zoomValue);
               	   if (browserLocPin && centerMark) hasZoomed = true;
               }
            }
            
            function sendRequest() {
            	
            	$.ajax({
            		url:'/ccw/kh/carLocation.do',
            		type: 'GET',
            		cache: false,
            		success: function(response) {
            			loadState('success');
    	            	uvo.clearLoadingConfirm();
    	                var coords = response.coord;
    	                var geocoder = new gMaps.Geocoder();
    	                var geocodeRequestParams = {"location" : new gMaps.LatLng(coords.lat, coords.lon)};
    	                geocoder.geocode(geocodeRequestParams, function processGeocoding(geocodeResult, geocodeStatus) {
    	                    var carLocation = {
    	                        "coords"  : coords,
    	                        "address" : false
    	                    };
    	
    	                    if (geocodeStatus === gMaps.GeocoderStatus.OK && geocodeResult.length) {
    	                        carLocation.address = geocodeResult[0].formatted_address;
    	                        carLocation.address_components = geocodeResult[0].address_components;
    	                    }
    	
    	                    drawMapForCar(carLocation);
    	                });
            		},
            		error: function(xhr, status, err) {
            			loadState('error');
    	            	var errorMsg = (err) ? err : com.errors.genericError;
    	            	errorMsg = errorMsg.replace(/\[\d+?\]/,'');
    	            	$('.fmc-modal-widget-error p').text(errorMsg);
    	            	uvo.genericErrorHandler(xhr, status, err);
            		}
            	});            	
            }
        }
    };

    uvo.setModuleReady("khRemote", module);

    module.init();

}(window.uvo));

$(function(){
    $(".hour-wrap").click(function(e) {
    	e.stopPropagation();
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

    $(".minute-wrap").click(function(e) {
    	e.stopPropagation();
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
    
    $(".am-pm-wrap").click(function(e) {
    	e.stopPropagation();
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
    

    /* close them if clicked outside */
    $(document).click(function() {
            $(".hour-list, .minute-list, .am-pm-list, .hour-arrow, .minute-arrow, .am-arrow").hide();
    });
    
    /* Now do the same as above for the hour 2 stuff */
    
    $(".hour-wrap2").click(function(e) {
    	e.stopPropagation();
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

    $(".minute-wrap2").click(function(e) {
    	e.stopPropagation();
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
    
    $(".am-pm-wrap2").click(function(e) {
    	e.stopPropagation();
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
    /* close them if clicked outside */
    $(document).click(function() {
            $(".hour-list2, .minute-list2, .am-pm-list2, .hour-arrow2, .minute-arrow2, .am-arrow2").hide();
    });
});