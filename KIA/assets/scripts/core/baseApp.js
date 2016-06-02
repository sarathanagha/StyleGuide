(function (uvo) {
    window.uvo = uvo;

    uvo.dataTypes.InitRoute = (function () {
        function InitRoute(raw) {
            if(raw instanceof InitRoute) {
                return $.extend(this, raw);
            }
            this.dataRequest = raw.name || raw.requestOptions || "";
            this.regex = raw.regex || InitRoute.prototype.regex;
            return this;
        }

        InitRoute.prototype = {
            dataRequest : "",
            regex       : /./i,
            exec        : function exec(pathName) {
                var requestOpts = this.dataRequest;
                if (typeof requestOpts === 'string') {
                    requestOpts = uvo.namedDataRequests[requestOpts];
                    requestOpts.name = requestOpts.name || this.dataRequest;
                }

                if (!requestOpts.name) {
                    console.error("InitRoute Error for:", this);
                    throw new Error("InitRoute failed, dataRequest must be named.");
                }

                if (this.regex.test(pathName)) {
                    console.info("InitRoute matched:", this.dataRequest);
                    uvo.dataRequest(requestOpts);
                }
            }
        };

        return InitRoute;
    }());

    var docReady = uvo.docReady = new $.Deferred();
    $(document).ready(docReady.resolve);

    var gMaps = (window.google && window.google.maps);
    var com = uvo.common, uTypes = uvo.dataTypes;

    docReady.done(function () {
        //TODO: eliminate the need for this.
        $("a[href='#']").addClass("clickable").removeAttr('href');
        
        //This is so that the left hand elements will still be properly
        //selected when you're on other tabs in the same group.
        var navgroups = {
            "/ccw/kh/lock.do"             : "/ccw/kh/climate.do",
            "/ccw/kh/findVehicle.do"      : "/ccw/kh/climate.do",
            "/ccw/kh/speedAlerts.do"      : "/ccw/kh/curfewAlerts.do",
            "/ccw/kh/geofenceAlerts.do"   : "/ccw/kh/curfewAlerts.do",
            "/ccw/kh/geofenceSettings.do" : "/ccw/kh/curfewAlerts.do",
            "/ccw/kh/curfewSettings.do"   : "/ccw/kh/curfewAlerts.do",
            "/ccw/kh/speedSettings.do"    : "/ccw/kh/curfewAlerts.do",
            "/ccw/cp/speedAlerts.do"      : "/ccw/cp/curfewAlerts.do",
            "/ccw/cp/geofenceAlerts.do"   : "/ccw/cp/curfewAlerts.do",
            "/ccw/cp/geofenceSettings.do" : "/ccw/cp/curfewAlerts.do",
            "/ccw/cp/curfewSettings.do"   : "/ccw/cp/curfewAlerts.do",
            "/ccw/cp/speedSettings.do"    : "/ccw/cp/curfewAlerts.do"
        };

        var url = navgroups[window.location.pathname] || window.location.pathname;
        if (url == '/ccw/omn/mtn/updateMaintRecord.do' || url == '/ccw/omn/mtn/insertMaintRecord.do') //If url == updateMaintRecord || insertMaintRecord, set it = mntnNotiList.do so that the left panel MAINTENANCE will be highlight.
        	url = '/ccw/omn/mtn/mntnNotiList.do';

        $("nav.nav-secondary h1 a").filter("[href='" + url + "']").parent().addClass("selected");

        //Top Nav dropdown event
        $("nav.nav-primary li.dropdown > a").on('click', function () {
        	var $this = $(this);

            var alreadyActive = $this.hasClass("active");

            $("nav.nav-primary .active").removeClass("active");
            com.$hide($('nav.nav-primary div.dropdown-detail'));

            if (!alreadyActive) {
                $this.addClass("active").parent().addClass("active");
                com.$show($this.next('div.dropdown-detail'));
            	$('body').on('click.nav', function(){
                    $("nav.nav-primary .active").removeClass("active");
                    com.$hide($('nav.nav-primary div.dropdown-detail'));
                    $('body').off('click.nav');
                    return true;
            	});
            } else {
                $('body').off('click.nav');
            }
            return false;
        });
        
        //Multivehicle Notification Submenu Expansion
        $("#notification-dropdown").find("div.vehicle .name").on('click', function () {
            $(this).parent().toggleClass("open").toggleClass("close");
            $(this).next(".items").toggleClass("hide");
        });
        
        //$("#awards").addClass("actived");

    });

    uvo.common.moduleReady = (function () {
        var ttl = 30, defers = {}, giveUps = {};
        return function (modName) {
            var modDefer = defers[modName] || new $.Deferred();
            defers[modName] = modDefer;
            if (!giveUps.hasOwnProperty(modName)) {
                giveUps[modName] = setTimeout(function () {
                    modDefer.reject("Module '" + modName + "' was not loaded within " + ttl + "s");
                }, ttl * 1000);
            }

            modDefer.done(function () {
                clearTimeout(giveUps[modName]);
            });

            modDefer.always(function () {
                delete giveUps[modName];
            });

            return modDefer;
        };
    }());

    window.uvo = $.extend(uvo, {
        fnMap_inits         : $.extend(uvo.fnMap_inits || {}, {
            "genplus-overview"    : "initGenPlusOverview",
            "poi-overview"        : "initPoiOverview",
            "trips-overview"      : "initTripsOverview",
            "driving-activity"    : "initDrivingActivity",
            "maintenance"         : "initMaintenance",
            "mcz-alerts-curfew"   : "initCurfewAlerts",
            "mcz-alerts-geofence" : "initGeofenceAlerts",
            "mcz-alerts-speed"    : "initSpeedAlerts",
            "my-vehicles"         : "initMyVehicles"
            //Settings pages will need to be added they don't exist yet.
        }),
        mod                 : {
            carZone         : null,
            carZoneSettings : null,
            drivingActivity : null,
            poi             : null,
            khRemote        : null,
            trips           : null
        },
        setModuleReady      : function setModuleReady(modName, module) {
            uvo.mod[modName] = module;
            uvo.common.moduleReady(modName).resolve(module);
        },
        genericErrorHandler : function genericErrorHandler(xhr, status, err) {
            if (typeof err === "string") {
                uvo.showErrorMessage((status ? status + " : " : "") + err);
            } else {
                uvo.showErrorMessage(com.errors.genericError);
            }
        },
        refreshPage         : function refreshPage() {
            window.location.pathname = String(window.location.pathname);
        },
        showLoadingMessage  : function showLoadingMessage(loadingMessage) {
            var msg = loadingMessage || "Please wait, loading...";
            $("body").addClass("proccesing").removeClass("error updated");
            console.info(msg);
        },
        showErrorMessage    : function displayError(errMessage) {
            if (errMessage) {
                $("#a_normal span").text(errMessage);
            }
            $("body").addClass("error").removeClass("proccesing updated");
        },
        clearLoading        : function clearLoading() {
            var $body = $("body").addClass("updated").removeClass("proccesing");
            setTimeout(function () {
                $body.removeClass("updated");
            }, 2500);
                        	
        },
        clearLoadingConfirm : function clearLoadingConfirm() {
        	var $body = $("body").addClass("updated updated-confirm").removeClass("proccesing");        	
    		setTimeout(function () {        			
                $body.removeClass("updated updated-confirm");
            }, 2500);
        },
        clearLoadingError : function clearLoadingError() {
        	var $body = $("body").addClass("error").removeClass("updated proccesing");        	
    		setTimeout(function () {        			
                $body.removeClass("error");
            }, 2500);
        },
        simpleRouteFactory  : function simpleRouteFactory(name, url, regex) {
            return new uTypes.InitRoute({
                requestOptions : new uTypes.DataRequestOptions(name, url),
                regex : regex
            });
        },
        addEarlyInit        : function addEarlyInit(initObj) {
            var pathName = window.location.pathname;
            var nInits;
            if (initObj instanceof Array) {
                nInits = uTypes.collectionOf(uTypes.InitRoute, initObj);
            } else {
                nInits = [new uTypes.InitRoute(initObj)];
            }

            $.each(nInits, function (index, route) {
                route.exec(pathName);
            });
        },
        init                : function init() {
            $.when(docReady).done(function () {
                var pageId = $("body").prop("id");
                /*
                 Please read thoroughly and carefully if you need to modify this function.

                 Summary:
                 look up the id of the body tag, find an array of function names associate with that tag
                 in the fnMap_inits object (should be close to the top of this file)
                 and then invoke each of those functions in order.
                 It places the results of these calls in an array to pass to $.when,
                 in case inits are asynchronous for some reason.
                 Then it shows the body tag.
                 */
                var initFunctions = uvo.fnMap_inits[pageId] || [];
                if (typeof initFunctions === 'string') {
                    initFunctions = [initFunctions];
                }

                var i, initFn, fnName, deferreds = [];
                try {
                    for (i = 0; i < initFunctions.length; i += 1) {
                        fnName = initFunctions[i];
                        if (uvo.hasOwnProperty(fnName)) {
                            initFn = $.proxy(uvo[fnName], uvo);
                            deferreds[i] = initFn();
                        } else {
                            var errtxt = "Bad init function name for page id: '" + pageId + "'";
                            console.error(errtxt + ", function name: '" + fnName + "' not found.");
                        }
                    }
                }
                finally {
                    $("body").show();

                }

                delete uvo.fnMap_inits[pageId];

                /*
                $.when.apply($, deferreds).done(function () {
                    $("body").show();
                });
                //*/
                
                //REQUEST APPOINTMENT for MODAL POPUP for EV and for inside MAINTENANCE page.
                var issueType = $('#other').attr('value');
                
                if($("#issueType").hasClass("maintenance")) {
                	var issueType = $('#veh-repair').attr('value');
                }

                $('#veh-repair, #veh-maint, #other').on('click', function () {
                    console.info('this is : ', $(this).attr('value'));
                    issueType = $(this).attr('value');

                    $('#veh-repair, #veh-maint, #other').attr('class', 'inactive');
                    $(this).attr('class', 'selected');
                });

                $('#request-appt').off('click').on('click', function () {
                	
                    var dealerCode = $('#dealerContact').attr('data');
                    $.post("/ccw/dlr/dealerAppt.do", {
                        vehicle    : issueType,
                        dealerCode : dealerCode,
                        offset     : new Date().getTimezoneOffset() / -60
                    }).done(function () {
                    	$('#dealerAppointment').hide();
                        $('#appointmentModal').show();
                        $('#appointmentClose').on('click', function () {
                            $('#appointmentModal').hide();
                        });
                    }).fail(function (){
                    	$('#dealerAppointment').hide();
                    	$('#errorAppointmentModal').show();
                        $('#errorAppointmentClose').on('click', function () {
                            $('#errorAppointmentModal').hide();
                        });
                    });
                    ;
                    
                });

                $("div.request-appointment a.change-dealer-ev").on('click', function(){
                	$('#dealerAppointment').hide();
                	$(".modal.change-dealer").addClass("enabled");
                	$("#zipcode").focus();
                	$("#selectVehicleType").val("ev").prop("disabled",true);
                });
                

            });
        },
        switchToVehicle     : function switchToVehicle(vInfo, url) {
        	var vin = vInfo.vin;
        	var vehType = vInfo.fuelType == 4 ? vInfo.fuelType : (vInfo.khVehicle == "K900" ? "K900" : "G");
        	$.get("/ccw/com/getPreferredDealer.do", {
            	vehicleType: vehType,
        		vin: vInfo.vin
            },
            function(result){
            	if(result.success == true){
                	if (vInfo.fuelType === 4) {
                		url = url || '/ccw/ev/connect.do';
                    } else if (vehType === 'K900') {
                        url = url || '/ccw/kh/overview.do';
                    } else {
                        url = url || '/ccw/main.do';
                    }

                    var $frm = $('<form method="post"><input type="hidden" name="vin" /></form>');
                    $frm.attr('action', url);
                    $frm.children().val(vInfo.vin);

                    if (simpleStorage.canUse()) {
                        simpleStorage.flush();
                    }

                    $("body").append($frm);
                    $frm.submit();
                }
            }).fail(function(result){
            	$(".modal.change-dealer").addClass("enabled");
            	$("#zipcode").focus();
            	$('#dealerSearchList').css('display','none');
            	$('#noDealerForVin').show();
            	$('#selectVehicleType').css('margin-top','-5px');
            	vehVin = vInfo.vin;
            	carType = vInfo.fuelType;
            	modelName = vInfo.modelName;
            	if (vInfo.fuelType === 4)
            		$("#selectVehicleType").val("ev").prop("disabled",true);
            	else if (vehType == 'K900')
            		$("#selectVehicleType").val("K900").prop("disabled",true);
            	else
            		$("#selectVehicleType").val("all").prop("disabled",false);
            });
        },
        drawDefaultMap      : function drawDefaultMap() {
            var mapOptions = new com.MapOptions({center : new gMaps.LatLng(36.1314, -95.9372), zoom : 4});
            return new gMaps.Map($("#map-canvas").get(0), mapOptions);
        },
        lazyChart           : (function () {
            var lazy = {
                title       : {floating : true, style : {display : 'none'}},
                xAxis       : {gridLineColor : "#E1E1E1", title : {floating : true, style : {display : 'none'}}},
                yAxis       : {gridLineColor : "#E1E1E1", title : {floating : true, style : {display : 'none'}}},
                credits     : {enabled : false},
                legend      : {enabled : false},
                tooltip     : {enabled : false},
                labels      : {
                    style : {
                        "font-family" : "'designk-light', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        "font-size"   : "13px"
                    }
                },
                plotOptions : {
                    series : {
                        states : {
                            hover : {
                                enabled : false
                            }
                        }
                    }
                }
            };

            function lazyChart($jQ, opts) {
                return $jQ.highcharts($.extend(true, {}, lazy, opts));
            }

            return lazyChart;
        }()),
        getVehicles         : (function () {
            var defer = new $.Deferred();
            
            function getVehicles(data) {
            	/* var storedData = false;
                if (simpleStorage.canUse()) {
                    storedData = simpleStorage.get("carInfo");
                    if (storedData && storedData.vehicles && storedData.vehicles.length > 0) {
                        defer.resolve(storedData);
                    } else {
                        storedData = false;
                    }
                }

                var microtime_day = 1000 * 60 * 60 * 24;*/

                //if (!storedData) {
                    $.ajax({
                        url : '/ccw/carInfo.do',
                        cache: false
                        
                    }).done(function (data) {
                    	if (simpleStorage.canUse()) {
                            simpleStorage.set("carInfo", data);
                        }
                        defer.resolve(data);
                    }).fail(defer.reject);
                //}

                return defer;
            }

            return getVehicles;
        }()),
        selectedVehicle       : (function () {
            var haveVehicle;
            return function getSelectedVehicle() {
                if (!haveVehicle) {
                    haveVehicle = new $.Deferred();
                    uvo.getVehicles().done(function (vehiclesData) {
                        var vehiclesResponse = vehiclesData;
                        if (!(vehiclesResponse instanceof uTypes.VehiclesResponse)) {
                            vehiclesResponse = new uTypes.VehiclesResponse(vehiclesData);
                        }

                        var done = false, vin = vehiclesResponse.selectedVin;
                        $.each(vehiclesResponse.vehicles, function (index, vehicle) {
                            if (!done && vehicle.vin === vin) {
                                done = true;
                                haveVehicle.resolve(vehicle);
                            }
                        });
                    });
                }

                return haveVehicle;
            };
        }()),
        sessionIdleTimeout : function(){
        	var idleTimeCount = 0;
        	var idleTimeIncrement = moment.duration(1, 'm').asMilliseconds(); // Every 1 minute, do increment
        	var sessionTimeDuration = 15; // 15 minutes
        	var autoLogoutDuration = 5; // 5 minutes
        	var isAutoLogoutShowing = false;

            var keepAliveURL = '/ccw/com/sessionPoll.do';
            var warningTimer, $uiBlock;

            function buildTimeoutForm(){
                var $block = $(
                    '<div id="uiBlock"><div class="sessionTimerModal"></div> \
                        <div class="sessionTimerWrap"> \
                            <div id="errorMessage">\
                                For security reasons, sessions end after 20 minutes of inactivity.\
                                Your session will time out in 5 minutes, after which you will have to Log in again. \
                                <div class="sessionBtnWrap">\
                                    <div><a class="clickable" id="logMeOut">Log Out</a></div>\
                                    <div><a class="clickable" id="keepAlive" style="font-size:16px">\
                                            Keep me signed in!\
                                    </a></div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>'
                );

                $block.find('#logMeOut').on('click', logout);

                $block.find('#keepAlive').on('click', function(){
	                $.ajax(keepAliveURL).done(function(data){
                         if(!data) return;

                         $uiBlock.detach();
                         idleTimeCount = 0;
                         isAutoLogoutShowing = false;
	                });
	                return false;
	            });

                return $block;
            }

            function checkIfReadyToLogOut(){
                $uiBlock = $uiBlock || buildTimeoutForm();
	            $('body').append($uiBlock);
	            isAutoLogoutShowing = true;	
	            idleTimeCount = 0;
             }

            function logout() {
                //noinspection JSValidateTypes
                document.cookie = "emailAddress=; expires=Thu, 01 Jan 1970 00:00:01 GMT;;domain=.myuvo.com; path=/";
                window.location = "/ccw/com/logOut.do";
            }

            function incrementIdleTime() {
            	if (isAutoLogoutShowing) {
            		if (idleTimeCount < autoLogoutDuration) idleTimeCount++;
            		else if (idleTimeCount == autoLogoutDuration) logout();
            	} else {
            		if (idleTimeCount < sessionTimeDuration) idleTimeCount++;
            		else if (idleTimeCount == sessionTimeDuration) checkIfReadyToLogOut();
            	}
            }
            
            warningTimer = window.setInterval(incrementIdleTime, idleTimeIncrement);
            $(document).mousemove(function (e) { idleTimeCount = 0; });
            $(document).keypress(function (e) { idleTimeCount = 0; });
        }
    });

    window.uvo = $.extend(uvo, {
        initMaintenance     : function initMaintenance() {
            var currentMileage = 56129; //kh.vehicleStatus
            var nextServiceInterval = 60000;
            var milesTilNext = nextServiceInterval - currentMileage;
            var oilChangeIntervalData;

            (function initChangeDealerModal() {
                var DealerInfo;
                (function () {
                    var defaults = {
                        name       : "",
                        address    : "",
                        city       : "",
                        state      : "",
                        zip        : "",
                        phone      : "",
                        website    : "",
                        dealerCode : "",
                        lat        : 0,
                        lng        : 0
                    };

                    DealerInfo = function DealerInfo(raw) {
                        if (raw) {
                            if (raw instanceof DealerInfo) {
                                $.extend(this, raw);
                            } else {
                                this.load(raw);
                            }
                        }
                        return this;
                    };

                    DealerInfo.prototype = $.extend({}, defaults);
                    DealerInfo.prototype.load = function (raw) {
                        if (!raw) {
                            return this;
                        }

                        var field;
                        for (field in defaults) {
                            if (defaults.hasOwnProperty(field) && raw.hasOwnProperty(field)) {
                                this[field] = raw[field] || defaults[field];
                            }
                        }

                        this.dealerCode = raw.dlrcd || defaults.dealerCode;
                        this.lng = raw.lon || defaults.lng;
                    };

                    return DealerInfo;
                }());

                function sendSearch(data) {
                	return $.ajax("/ccw/dlr/listDealer.do", {
                        type : "POST",
                        data : $.extend({
                            zipcode   : "",
                            city      : "",
                            stateCode : ""
                        }, data)
                    });
                }

                var dlrModal = new uvo.common.Modal(".modal.change-dealer");
                dlrModal.hasResults = false;
                dlrModal.pageSize = 50;
                var $dom = dlrModal.$dom;
                var $baseDealerInfo = $("li.inactive", $dom).remove();

                //TODO: populate vehl list with actual vehl list
                var $vehicleList = $("div.selector", $dom);
                var $dropdown = $("div.filter span.current", $dom);
                var $zip = $("#zipcode", $dom);

                dlrModal.$results = $("ul.results", $dom);

                function generateIScroll($el) {
                    if (dlrModal.IScroll) {
                        dlrModal.IScroll.destroy();
                        dlrModal.IScroll = null;
                    }
                    dlrModal.IScroll = new IScroll($("#dealerSearchList").get(0), {
                        scrollbars            : 'custom',
                        mouseWheel            : true,
                        interactiveScrollbars : true,
                        snap                  : 'li'
                    });

                    if ($el) {
                        dlrModal.IScroll.scrollToElement($el.get(0));
                    } else {
                        dlrModal.IScroll.scrollTo(0, 0);
                    }
                }

                function getDealerInfoFromPage() {
                    var rawInfo = {};
                    var $dlrContact = $(".request-appointment .col1");
                    rawInfo.name = $.trim($(".name", $dlrContact).text());
                    var chunks = $("#dealerContact").html().replace(/ (?!\w)|\n/g, "").split("<br>");
                    rawInfo.address = $.trim(chunks[0]);
                    rawInfo.phone = $.trim(chunks[2]) || "";

                    //matches strings like "Garden Grove, CA 92840"
                    var regex = /^([^,]+), *?(\w\w)[^0-9]*?(\d{5,})/;

                    chunks = $.trim(chunks[1]).match(regex).slice(1);
                    rawInfo.city = $.trim(chunks[0]);
                    rawInfo.state = $.trim(chunks[1]);
                    rawInfo.zip = $.trim(chunks[2]);
                    rawInfo.dealerCode = $('#dealerContact').attr('data');
                    var dealer = new DealerInfo(rawInfo);
                    return dealer;
                }

                dlrModal.open = function () {
                    uvo.common.Modal.prototype.open.call(dlrModal);
                    if (!dlrModal.hasResults) {
                        dlrModal.$results.empty();
                        var selectedDealer = getDealerInfoFromPage();
                        var $infoBlock = $baseDealerInfo.clone();
                        $infoBlock.removeClass("inactive").addClass("active");
                        selectedDealer.fillElement($infoBlock).appendTo(dlrModal.$results);
                        $zip.val(selectedDealer.zip);
                        $(".distance", $infoBlock).text("");
                    }
                    dlrModal.toggleVehicleList("off");
                };

                //need a way to identify current dealer, per vehicle.
                //is this currently stored anywhere, do we have this information.

                dlrModal.toggleVehicleList = function toggleVehicleList(forceOff) {
                    var expand = (forceOff !== "off") && !$vehicleList.hasClass("expanded");
                    $vehicleList.toggleClass("expanded", expand);
                    $dropdown.toggleClass("active", expand).toggleClass("inactive", !expand);
                };

                DealerInfo.prototype.fillElement = function fillElement($el) {
                    var dealer = this;
                    var addr = dealer.address + "<br />";
                    addr += dealer.city + ", " + dealer.state + ", " + dealer.zip;
                    addr += "<br />" + dealer.phone;

                    $(".name", $el).text(dealer.name);
                    $(".contact", $el).html(addr);
                    return $el;
                };

                function saveDealer(dealerToSave) {
                    var dealer = dealerToSave;
                    if (!dealer instanceof DealerInfo) {
                        dealer = new DealerInfo(dealer);
                    }
                    
                    if( $('.inactive').hasClass("process") )
                		return;
                    setTimeout(function(){$(".active").addClass("process");}, 500);

                    $.post("/ccw/dlr/dealerSave.do", {
                        dealerCode  : dealer.dealerCode,
                        name        : dealer.name,
                        phoneNumber : dealer.phone,
                        zipCode     : dealer.zip,
                        address     : dealer.address,
                        city        : dealer.city,
                        state       : dealer.state,
                        latitude    : dealer.lat,
                        longitude   : dealer.lng,
                        website     : dealer.website
                    }).done(function (response) {
                        dealer.fillElement($(".request-appointment .col1"));
                        $('#dealerContact').attr('data', dealer.dealerCode);
                        $(".active").removeClass("process");
                        dlrModal.close();
                    });
                }

                function startSearch() {
                    var searchStr = $.trim($zip.val());
                    var isZipCode = searchStr.search(/^[0-9]{5,}/) !== -1;
                    var searchRequest;
                    var vehType = $('#selectVehicleType').val();
                    
                    if (searchStr == ""){
                    	searchResults = [];
                        dlrModal.hasResults = false;
                        $('#dealerSearchList').css({'height':'15px', 'min-height':'15px'});
                        $("#dealerZipError").show();
                        $(".results").empty();
                    	$(".box-1", dlrModal.$dom).text("Zip Code:");
                    	$('#zipcode').focus();
                    	$('.ctas, #noDealerMsg').hide();
                    	return;
                    }

                    if (isZipCode) {
                        searchStr = searchStr.substr(0, 5);
                        if(searchStr == '00000' || searchStr == '99999'){
                        	searchResults = [];
                            dlrModal.hasResults = false;
                            $('#dealerSearchList').css({'height':'15px', 'min-height':'15px'});
                        	$("#dealerZipError").show();
                        	$(".results").empty();
                        	$(".box-1", dlrModal.$dom).text("Zip Code:");
                        	$('.ctas, #noDealerMsg').hide();
                        }
                        else searchRequest = sendSearch({"zipcode" : searchStr, "vehicleType" : vehType});
                    } else {
                        //TODO: city search, at all
                        searchRequest = sendSearch({"city" : searchStr});
                    }

                    var both = $.when(searchRequest, uvo.common.makeGeocodeRequest(searchStr));
                    both.done(function (ajaxResponse, geocodeResults) {
                        var searchResults = ajaxResponse[2].responseJSON;

                        var dealerCode = $('#dealerContact').attr('data');
                        dlrModal.$results.empty();

                        dlrModal.hasResults = true;
                        if(searchResults[0].error){
                            searchResults = [];
                            dlrModal.hasResults = false;
                            $('#dealerSearchList').css({'height':'15px', 'min-height':'15px'});
                        	$("#dealerZipError").show();
                            $(".box-1", dlrModal.$dom).text("Zip Code:");
                            $('.ctas, #noDealerMsg').hide();
                        } else {
                        	$('.ctas').show();
                        	$(".box-1", dlrModal.$dom).text((searchResults.length-1) + " Near:");
                        }
                        var searchLatLng = geocodeResults[0].geometry.location;

                        function distToDealer(dealer) {
                            var searchLat = searchLatLng.lat();
                            var searchLng = searchLatLng.lng();
                            var distKm = uvo.common.calcDistance(dealer.lat, dealer.lng, searchLat, searchLng);
                            var miles = distKm / 1.609;

                            return miles;
                        }

                        //$(".box-1", dlrModal.$dom).text(Math.min(searchResults.length, dlrModal.pageSize) + " Near:");

                        var items = [];

                        $.each(searchResults, function (index, info) {
                            if(info.dlrInRadius == undefined)
                            {	
	                            var dealer = new DealerInfo(info);
	                            var $infoBlock = $baseDealerInfo.clone();
	
	                            dealer.fillElement($infoBlock);
	
	                            if (index < dlrModal.pageSize) {
	                                dlrModal.$results.append($infoBlock);
	                            }
	                            items.push($infoBlock);
	
	                            if (dealer.dealerCode === dealerCode) {
	                                $infoBlock.removeClass("inactive").addClass("active");
	                            }
	
	                            //$(".distance", $infoBlock).text(distToDealer(dealer).toFixed(1) + " MI");
	                            $("#dealerZipError").hide();
	                            $infoBlock.on('click', ".distance", function selectDealer() {
	                                /*
	                            	if (dealer.dealerCode === dealerCode) {
	                                	return true;
	                                }
	                            	*/
	                                saveDealer(dealer);
	                                $("li.active", dlrModal.$results).removeClass("active").addClass("inactive");
	                                $infoBlock.removeClass("inactive").addClass("active");
	                            });
                            } else {
                            	if (info.dlrInRadius == false){
                            		$('#noDealerMsg').show();
                            		$(".box-1", dlrModal.$dom).text((searchResults.length-1) + " Near:");
                            	}
                            	else
                            		$('#noDealerMsg').hide();
                            }
                        });

                        var numToShow = Math.min(dlrModal.pageSize, searchResults.length-1);
                        $("#dealerSearchList").css("height", 145 * numToShow + "px");

                        generateIScroll();

                        if (searchResults.length > dlrModal.pageSize) {
                            var $loadMore = $(".cta.secondary", $dom).removeClass("hide");

                            $loadMore.off('click').on('click', function () {
                                var currItemsCount = dlrModal.$results.children().size();
                                var $nextpage = items.slice(currItemsCount, currItemsCount + dlrModal.pageSize);
                                dlrModal.$results.append($nextpage);

                                generateIScroll();
                                dlrModal.IScroll.goToPage(0, currItemsCount + 1, 400);

                                $(".box-1", dlrModal.$dom).text(dlrModal.$results.children().size() + " Near:");

                                if (dlrModal.$results.children().size() === items.length) {
                                    items = null;
                                    com.$hide($(this));
                                    $(this).off('click');
                                }
                            });
                        }
                    });
                }

                $("button.select", $dom).on('click', startSearch);
                $zip.on('keypress', function (ev) {
                    if (ev.which === 13) {
                        startSearch();
                        return false;
                    }
                    return true;
                });

                $("div.request-appointment a.change-dealer").on('click', dlrModal.open);

            }());
            //=================================================================
            /**appointment logic**/
            //=================================================================
         /*   var issueType = $('#veh-repair').attr('value');

            $('#veh-repair, #veh-maint, #other').on('click', function () {
                console.info('this is : ', $(this).attr('value'));
                issueType = $(this).attr('value');

                $('#veh-repair, #veh-maint, #other').attr('class', 'inactive');
                $(this).attr('class', 'selected');
            });

            $('#request-appt').on('click', function () { //REQUEST APPOINTMENT for inside MAINTENANCE page.
                var dealerCode = $('#dealerContact').attr('data');
                debugger;
                $.post("/ccw/dlr/dealerAppt.do", {
                    vehicle    : issueType,
                    dealerCode : dealerCode,
                    offset     : new Date().getTimezoneOffset() / -60
                }).done(function () {
                    $('#appointmentModal').show();
                    $('#appointmentClose').on('click', function () {
                        $('#appointmentModal').hide();
                    });
                });
            }); */

            //=================================================================
            //oil change logic
            //=================================================================
            /*
             $.ajax({
             url : '/ccw/kh/maintenanceData.do'
             }).success(function (data) {
             console.log('data : ', data);
             oilChangeIntervalData = data;
             setOilChangeData();
             });

             function setOilChangeData() {
             var d = oilChangeIntervalData;
             var i, option;
             $('.miles').html(d.mileageTillNextOilChange);
             var optionsTemplate = $('.option-template').remove();

             for (i = 0; i < d.oilChangeIntervalOptions.length; i++) {
             option = optionsTemplate.clone();

             option.attr('value', d.oilChangeIntervalOptions[i]);
             option.html(d.oilChangeIntervalOptions[i]);
             //cast intentional
             if (d.oilChangeIntervalOptions[i] == d.currentOilChangeInterval) {
             option.attr('selected', 'selected');
             console.log('same');
             }
             console.log('optionsTemplate : ', option);
             $('.oil-change-intervals').append(option);
             }
             }

             $('.restart-btn').on('click', function () {
             var newInterval = $('.oil-change-intervals').val();
             if (oilChangeIntervalData.currentOilChangeInterval != newInterval) {

             KhApp.showLoadingMessage();

             var obj = {
             mileageOfLastOilChange : oilChangeIntervalData.mileageOfLastOilChange,
             prevOilChangeInterval  : oilChangeIntervalData.currentOilChangeInterval,
             oilChangeInterval      : newInterval
             };

             $.ajax({
             type : 'POST',
             data : obj,
             url  : '/ccw/kh/oilChangeUpdate.do'
             }).done(function () {
             KhApp.clearLoading();
             oilChangeIntervalData.currentOilChangeInterval = newInterval;
             oilChangeIntervalData.mileageTillNextOilChange = newInterval;
             $('.miles').html(newInterval);
             }).fail(genericErrHandler);

             } else {
             KhApp.clearLoading();
             }
             });
             // */
        },
        initGenPlusOverview : function initGenPlusOverview() {
            var currMileage = parseInt($(".mileage .amount").text()) || 0;
            var $dateLabel = $(".diagnostic label.date");

            var lastDate = $dateLabel.attr("uvodate");
            if (lastDate != 0 && typeof lastDate !== 'undefined') {
                lastDate = moment(lastDate, "MMM DD, YYYY hh:mm A");
                $dateLabel.text("Last updated as of " + lastDate.format("MMMM DD, YYYY"));
                $(".last-sync .content .month").text(lastDate.format("MMMM"));
                $(".last-sync .content .day").text(lastDate.format("D"));
            } else {
            	$(".last-sync .content .month").text('No data sent');
            	$("#lastSync").show();
            	$(".last-sync .content .day").hide();
            }

            uvo.dataRequest("getMaintenanceIntervals").done(function (data) {
                var intervals = data.intervals || [0];
                var next = intervals[0];
                $.each(intervals, function (index, value) {
                    if (value > currMileage) {
                        next = Math.min(value, next);
                    } else if (next < currMileage) {
                        next = value;
                    }
                });

                $(".next-service .amount").text((next-currMileage).toLocaleString().replace(/\.\d\d$/, ""));
                $(".next-service").removeClass("hide");
                //do the bar thing here if desired;
            }).fail(function () {
                $(".maintenance .content").css({"margin-top" : "5px"});
                $(".next-service .unit").text("Maintenance for this vehicle cannot be displayed since it is not listed in the Kia Maintenance database.");
                $(".next-service").removeClass("hide");
            });

            /*
            var getIssues = uvo.data.getDiagnosticIssues;
            getIssues.done(function(data){
                var dtcDetails = data.dtcDetails || [];
                if(dtcDetails.length) {
                    var $diagImage = $(".diagnostic .content .w-img img");
                    var $label =$(".diagnostic label.message.ok");
                    var src = $diagImage.attr("src");

                    src = src.replace("check_green.png", "warning-icon.png");
                    $diagImage.attr("src", src);

                    var labelTxt = dtcDetails.length + " ISSUE";
                    labelTxt += dtcDetails > 1 ? "S FOUND" : " FOUND";

                    $label.text(labelTxt);
                    $label.removeClass("ok");
                }
            });
            //*/

            /*
        var fakePeriods = [];
        var fp, score, carMiles = 0;
        for (var i = 0; i < 3; i++) {
            score = Math.round(60 * Math.random() + 39);
            fp = new uvo.dataTypes.StatPeriod({
                year             : 2014,
                month            : moment().month() + 1 - i,
                hrsIdle          : i * Math.random(),
                efficientScore   : score,
                inefficientScore : 100 - score,
                aveSpeed         : Math.round(40 + 40 * Math.random()),
                awardCount       : 1,
                aveAccel         : Math.round(50 * Math.random()),
                hrsDrivenDisp    : Math.round(Math.random() * 24 * 28).toString(),
                milesDriven      : Math.round(500 * Math.random() + 400),
                aveMph           : Math.round(40 + 40 * Math.random()),
                dayCount         : Math.round(28 * Math.random())
            });
            fakePeriods[i] = fp;
            carMiles += fp.milesDriven;
        }

        $.when({
            monthlyStat    : fakePeriods,
            currentMileage : carMiles
        }).done(function (data) {
        // */

            ///*
            uvo.dataRequest("drivingActivity").done(function (driveStats) {
                //*/
                var $chartEl = $("#safety-chart");
                var months = [];
                var monthLabels = [];
                var periods = driveStats.monthlyStat;

                var period = periods[0] || new uTypes.StatPeriod();
/*
                uvo.lazyChart($chartEl, {
                    chart       : {
                        type    : 'column',
                        spacing : [20, 20, 20, 30],
                        height  : 100,
                        width   : 190
                    },
                    plotOptions : {
                        column : {
                            pointWidth : 10
                        }
                    },
                    xAxis       : {
                        categories : monthLabels,
                        tickLength : 0,

                        label : {
                            style : {
                                color       : "#e1e1e1",
                                "font-size" : "11px"
                            }
                        }
                    },
                    yAxis       : {
                        title             : {floating : true, style : {display : 'none'}},
                        max               : highMiles,
                        tickInterval      : Math.pow(10, highMiles.toString().length - 1) * 4,
                        gridLineDashStyle : 'shortdash'
                    },
                    series      : [
                        {
                            data  : months,
                            color : "#7bb609"
                        }
                    ]
                });
//*/
                var chartHeight = 100, chartWidth = 100;

                function drawSafetyScore($el, good, bad) {
                    var series = [
                        {
                            name : '',
                            data : [
                                {y : bad, color : '#E1E1E1'},
                                {y : good, color : '#448CCB'}
                            ]

                        }
                    ];

                    $el.highcharts({
                        chart  : {
                            type    : 'pie',
                            spacing : [0, 0, 0, 0],
                            height  : chartHeight,
                            width   : chartWidth
                            //,style   : {"top" : "-10px", "left" : "-10px" }
                        },
                        labels : {
                            items : [
                                {
                                    html  : "<div>" + good + "</div>",
                                    style : {
                                        "font-size" : "42px",
                                        "color"     : "#000000",
                                        "left"      : "25px",
                                        "top"       : "45px"
                                    }
                                },
                                {
                                    html  : "/100",
                                    style : {
                                        "top"       : "63px",
                                        "left"      : "35px",
                                        color       : "#CCCCCC",
                                        "font-size" : "13px"
                                    }
                                }
                            ],
                            style : {
                                "font-family" : "'designk-light', 'Helvetica Neue', Helvetica, Arial, sans-serif"
                            }
                        },
                        title  : {floating : true, enabled : false, style : {"display" : "none"}},

                        plotOptions : {
                            pie    : {
                                shadow      : false,
                                dataLabels  : {enabled : false},
                                borderWidth : 0,
                                size        : chartHeight * 0.95,
                                innerSize   : chartHeight * 0.90,
                                startAngle  : 15
                            },
                            series : {
                                states : {
                                    hover : {
                                        enabled : false
                                    }
                                }
                            }
                        },
                        credits     : {enabled : false},
                        legend      : {enabled : false},
                        tooltip     : {enabled : false},
                        yAxis       : {
                            labels : { enabled : false }

                        },
                        xAxis       : {
                            labels : { enabled : false }

                        },
                        series      : series
                    });
                }

                drawSafetyScore($chartEl, period.efficientScore, period.inefficientScore);

            });

        },
        initCurfewAlerts    : function initCurfewAlerts() {
            $.when(com.moduleReady("carZone")).done(function () {
                uvo.mod.carZone.initCurfewAlerts();
            });
        },
        initGeofenceAlerts  : function initGeofenceAlerts() {
            $.when(com.moduleReady("carZone")).done(function () {
                uvo.mod.carZone.initGeofenceAlerts();
            });
        },
        initSpeedAlerts     : function initSpeedAlerts() {
            $.when(com.moduleReady("carZone")).done(function () {
                uvo.mod.carZone.initSpeedAlerts();
            });
        },
        initTripsOverview   : function initTripsOverview() {
            $.when(com.moduleReady("trips")).done(function () {
                uvo.mod.trips.init();
            });
        },
        initPoiOverview     : function initPoiOverview() {
            console.log("init poi overview");
            $.when(com.moduleReady("poi")).done(function () {
                uvo.mod.poi.init();
            });
        },
        initDrivingActivity : function initDrivingActivity() {
            $.when(com.moduleReady("drivingActivity")).done(function () {
                uvo.mod.drivingActivity.init();
            });
        },
        initMyVehicles : function initMyVehicles() {

            var delModal = new com.Modal("#confirmDelete");
            $("#cancelDelete", delModal.$dom).click(delModal.close.bind(delModal));
            delModal.$confirm = $("#delVeh", delModal.$dom);

            var $baseCard = $(".vehicle-card").remove();
            var $baseManageCard = $(".manage-card").remove();

            var karUrl = "/kar/images/changeCar/";
            if (window.location.hostname.match(/localhost/ig)) {
                karUrl = "https://stg.myuvo.com" + karUrl;
            }

            var $container = $(".content-area > .container");

            var $reg1Card = $("#reg-1");
            var $reg2Card = $("#reg-2").detach();
            var $reg3Card = $("#reg-3").detach();
            var $reg4Card = $("#reg-4").detach();

            var $blade = $(".blade.three-columns-symmetric");

            $reg1Card.click(function () {
                $reg2Card.insertBefore($reg1Card);
                $reg1Card.detach();
            });

            $("#regBtn", $reg2Card).click(function(){
                $(".vehicle-add .warning").addClass("hide");
                var vin = $('#vin').val().trim().toUpperCase();
                var nick = encodeURIComponent($("#nickname").val().trim());

                if (!vin) {
                    $("#emptyVIN").removeClass("hide");
                    return;
                }

                uvo.showLoadingMessage();

                function vehicleAddFailed(xhr, status, response){
                    //console.log(response);
                    //uvo.showErrorMessage(response);
                    $("body").removeClass("proccesing");
                    $("#invalidVIN").removeClass("hide");
                }

                $.ajax('/ccw/com/validateVin.do', {
                    type: "POST",
                    data: { vin: vin }
                }).done(function(response) {
                    var responseData = response.data || {versionType:""};
                    var version = (responseData.versionType || "").toUpperCase();
                    var soul2014 = responseData.soul2014;

                    if (version !== "UVO") {
                        uvo.clearLoading();
                        if(response.endLife) {
                            $("#endLife").removeClass("hide");
                        } else {
                            $("#invalidVIN").removeClass("hide");
                        }
                    } else if(soul2014) {
                    	$(".popupHU").css("display", "block");
                    	$(".popClose").click(function(){
                    		$(".popupHU").css("display", "none");
                    	});
                    	
                    	$('#avnUvoPreNav').click(function(){
                    		$(".popupHU").css("display", "none");
                    		$reg4Card.insertBefore($reg2Card);
                        	$reg2Card.detach();
                        	$('#addSoul14').click(function(){
                        		$.ajax("/ccw/set/temporaryAddVehl.do", {
                                    type: "POST",
                        			data: {
                        				vin: vin,
                        				vehNick: nick
                        			}
                                    
                                }).then(uvo.refreshPage, vehicleAddFailed);
                        	});
                    	});
                    	$('#avnUvo, #avnUvo40').click(function(){
                    		$.ajax("/ccw/set/temporaryAddVehl.do", {
                                type: "POST",
                    			data: {
                    				vin: vin,
                    				vehNick: nick
                    			}
                                
                            }).then(uvo.refreshPage, vehicleAddFailed);
                    	});
                    }
                    else {
                        $.ajax("/ccw/set/addVehl.do", {
                            type: "POST",
                            data: {
                                vin: vin,
                                vehNick: nick
                            }
                        }).then(uvo.refreshPage, vehicleAddFailed);
                    }
                }).fail(vehicleAddFailed);
            });

            $("#reg-back", $reg2Card).click(function(){
            	$("#emptyVIN, #invalidVIN, #endLife").addClass("hide");
            	
            	// $("#nickname").attr('placeholder', 'Nick Name').val("").focus().blur();
            	// $("#vin").attr('placeholder','VIN').val("").focus().blur();
	
            	$reg1Card.insertBefore($reg2Card);
            	$reg2Card.detach();

            	
            });

            function generateManageCard(vehicle) {
                var $mCard = $baseManageCard.clone();

                $(".label strong", $mCard).text(vehicle.vin);
                $(".links .delete", $mCard).click(openDelConfirm.bind(this, vehicle));

                return $mCard;
            }

            function editVehicle(vin, nick){
                return $.ajax("/ccw/set/editVehl.do", {
                    type:"POST",
                    data: {
                        vehNick: nick,
                        vin:vin
                    }
                });
            }

            function showManageCard($vCard, vehicle){
                var $this = $(this);
                $this.insertAfter($vCard);
                $vCard.detach();

                var $nickInput = $("input", $this);
                var showManage = true;

                var vehNick = decodeURIComponent(vehicle.nickname);

                $nickInput.val(vehNick);

                $(".manage-done", $this).off('click').on('click', function () {
                    var nick = $nickInput.val().trim();

                    if(nick !== vehNick) {
                        uvo.showLoadingMessage();
                        editVehicle(vehicle.vin, nick).done(function () {
                        	uvo.clearLoading();
                            vehicle.nickname = nick;
                            $(".nickname", $vCard).text(nick);
                            if(showManage){
                            	$vCard.insertBefore($this);
                                $this.detach();
                                showManage = false;
                            }
                        }).fail(function(xhr, status, response){
                            uvo.showErrorMessage(response);
                            $nickInput.val(vehNick);
                        });
                    } else {
                        $vCard.insertBefore($this);
                        $this.detach();
                    }
                });

            }

            function goToMaintenance(vehicle) {
                if (vehicle.modelName === 'K900') {
                    uvo.switchToVehicle(vehicle, '/ccw/omn/mtn/mntnNotiList.do?vehType=kh');
                } else {
                    uvo.switchToVehicle(vehicle, '/ccw/omn/mtn/mntnNotiList.do');
                }
            }


            var doPsevCancellation = (function(){
                var cancelString = JSON.stringify({
                    "provType": 6,
                    "provision": {
                        "updateList": [
                            {
                                "parameter": "OTASPNum",
                                "value": "**2280",
                                "currentValue": "",
                                "category": "Common"
                             }
                         ],
                         "vinUpdate": {
                                "oldVin": "VIN00000000000001",
                                "vin": "VIN00000000000002"
                         }
                     }
                });

                return function (vin){
                    return $.ajax("/ccw/ev/changeMsg.do?vin=" + vin, {
                        type: "POST",
                        data: {
                            enrollmentMsgString: cancelString
                        }
                    });
                };

            }());

            function deleteVehicle(vehicle) {
            	delModal.close();      
            	window.scrollTo(0,0)
                var vin = vehicle.vin;
                var cancelEv = vehicle.getGen() === 'PSEV' && vehicle.enrVin === 'A';

                uvo.showLoadingMessage();

                var cancellationDone = cancelEv ? doPsevCancellation(vin) : true;

                function deleteFail(xhr, status, response) {
                	delModal.close();      
                	window.scrollTo(0,0)          	
                    uvo.showErrorMessage("Unable to delete vehicle, please try again later.");
                    
                }

                $.when(cancellationDone).done(function(){
                    $.ajax('/ccw/set/delvehl.do', {
                        type:"POST",
                        data: {
                            vin : vin
                        }
                    }).then(uvo.refreshPage, deleteFail);
                }).fail(deleteFail);
            }

            function openDelConfirm(vehicle) {
                delModal.open();
                delModal.$confirm.off('click');
                delModal.$confirm.one('click', deleteVehicle.bind(this, vehicle));
            }

            function displayVehicles(vehiclesData) {
                var carInfo = vehiclesData || {};
                carInfo.listMyCarInfo = carInfo.listMyCarInfo || [];
                var vehicles = uTypes.collectionOf(uTypes.Vehicle, carInfo.listMyCarInfo);
                var $bladeClone = $blade.clone().empty();

                if (vehicles.length > 0){
	                $.each(vehicles, function(index, vehicle) {
	                    var looking = true;
	                    var gen = vehicle.getGen();
	                    var $mCard;
	                    var $card = $baseCard.clone();
	
	                    $(".nickname", $card).text(decodeURIComponent(vehicle.nickname));
	                    $(".year-model-trim", $card).text(vehicle.modelYear + " " + vehicle.modelName);
	
	                    $(".picture img", $card).attr("src", karUrl+ vehicle.imageFileName);
	
	                    if (vehicle.isExpired()) {
	                        looking = false;
	                        if(gen === "PSEV")
	                        	$(".expiredEV", $card).removeClass("hide");
	                        else
	                        	$(".expired", $card).removeClass("hide");
	                        $(".cta a", $card).click(openDelConfirm.bind(this, vehicle));
	                    }
	                    
	                    if (looking && !vehicle.uvoEnabled()) {
	                        looking = false;
	                        if(gen === "PSEV") {
	                            $(".psev.not-enrolled", $card).removeClass("hide");
	                        } else if(gen === "KH") {
	                            $(".k900.not-enrolled", $card).removeClass("hide");
	                        }else {
	                            $(".inactive-vin", $card).removeClass("hide");
	                        }
	                        $(".cta a", $card).click(openDelConfirm.bind(this, vehicle));
	                    }
	                    
	                    if (vehicle.actVin == "N" && vehicle.launchType == "1") //Use same logic in vehlChoice page, but not using sessionScope
	                    	$(".showPin", $card).css('visibility','visible');
	                    
	                    $(".showPin", $card).click(function(){
	                    	showPinPopup.open(vehicle.securityPin);
	                    });
	
	                    if(looking) {
	                        $mCard = generateManageCard(vehicle);
	                        if(gen === "PSEV") {
	                            $(".psev.enrolled", $card).removeClass("hide");
	                            try{
	                                var status = JSON.parse(vehicle.vehicleStatus);
	                                var isUnplugged = status.eVStatus.batteryPlugin  === 0;
	                                var dist = status.eVStatus.drvDistance[0].distanceType.value;
	                                var received = vehicle.scheduledInfoTimeStamp;
	                                var received1 = vehicle.vehicleStatusTimeStamp;
	                                $(".psev.enrolled .plugged", $card)
	                                .toggleClass("plugged", !isUnplugged)
	                                .toggleClass("unplugged", isUnplugged)
	                                .text((isUnplugged ? "Not p" : "P") + "lugged in");
	                                $(".psev.enrolled .battery", $card).text("Driving Range: " + (dist || 0) + " miles");
	                                $(".psev.enrolled .received", $card).text(received1.format("[Date Received at ]MM/DD hh:mm A"));
	                            }
	                            catch(err){
	                                console.error(err);
	                            }
	                        } else {
	                            var maintClick = goToMaintenance.bind(vehicle, vehicle);
	                            $(".active-vin", $card).removeClass("hide");
	                            $(".active-vin > div", $card).click(maintClick);
	                            	
	                            if(vehicle.modelName == "K900"){
	                            	uvo.dataRequest("khActiveDtcCnt").done(function (dtcKh) {
	                            	//console.log('dtcKh :', dtcKh);
	                            	if(dtcKh.length>0){
	                            	var i;
	                            	for(i=0; i<dtcKh.length; i++){
	                            		if(vehicle.vin == dtcKh[i].vin){		                            
		                            		if(dtcKh[i].dtcKhCnt > 0){
		    	                                var $warn = $(".message.warning", $card).removeClass("hide");
		    	                                $warn.text(dtcKh[i].dtcKhCnt + " diagnostic issue(s) found");
		    	                                $(".message.ok", $card).addClass("hide");
		    	                            }
		                            	}
	                            	}
	                            	}
	                            	});
	                            }
	                            else{
	                            	if(vehicle.diagnosticIssues > 0){
    	                                var $warn = $(".message.warning", $card).removeClass("hide");
    	                                $warn.text(vehicle.diagnosticIssues + " diagnostic issue(s) found");
    	                                $(".message.ok", $card).addClass("hide");
    	                            }	
	                            }
	                            
	                            if(vehicle.milesToNextService > 0){
	                                var $warn = $(".message.maintenance", $card);
	                                $warn.text(vehicle.milesToNextService + " mile(s) until next service");
	                            }else{
	                            	$(".message.maintenance", $card).addClass("hide");
	                            }
	                        }
	                        $(".manage-btn", $card).click(showManageCard.bind($mCard,$card, vehicle));
	                        $(".overview", $card).click(uvo.switchToVehicle.bind(uvo, vehicle, ""));
	                        $(".batteryEv-btn",$card).click(uvo.switchToVehicle.bind(uvo, vehicle, "/ccw/ev/battery.do"));
	                    } else {
	                        $(".overview .caret", $card).addClass("hide");
	                        $(".hover-on", $card).removeClass("hover-on");
	                    }
	
	                    $(".widget-box", $card).children("hide").remove();
	
	                    $bladeClone.append($card);
	
	                    if($bladeClone.children().size() === 3) {
	                        $bladeClone.appendTo($container);
	                        $bladeClone = $blade.clone().empty();
	                    }
	                });
                } else {
                    var $card = $baseCard.clone();
                    $(".nickname", $card).html("&nbsp;");
                    $(".year-model-trim", $card).html("&nbsp");
                	$(".caret", $card).addClass("hide");
                    $(".picture img", $card).attr("src", karUrl+ "failSafe.PNG");
                    $(".no-active-vin", $card).removeClass("hide");
                    $bladeClone.append($card);
                    $bladeClone.appendTo($container);
                }

                $bladeClone.append($reg1Card);
                $bladeClone.appendTo($container);
                $blade.remove();
                
                $('.widget-box.border.vehicle-add').removeClass('hide');
                uvo.clearLoading();
            }

            uvo.dataRequest("getMyVehicles").done(displayVehicles);
        }
    });

    //Wires up the vehicle switcher
    (function wireVehicleSwitcher() {

        var pathName = window.location.pathname;
        if (pathName.match(/myVehicles/i)) {
            return;
        }

        function selectVehicle(vInfo) {
            if (this.hasClass("selected")) {
                return false; //if they select the already active vehicle, don't do anything.
            }
            $(".nav-vehicle-switcher .marker .check.selected").removeClass("selected");
            this.addClass("selected");
            uvo.switchToVehicle(vInfo);
        }

        $.when(uvo.getVehicles(), docReady).done(function (vehiclesData) {
            var vehicleResponse = new uTypes.VehiclesResponse(vehiclesData);
            var $switcher = $(".nav-vehicle-switcher");
            var $vehlSelector = $(".nav-vehicle-selector");
            var $vehicleList = $("ul", $switcher);
            var $baseVehicle = $("li", $vehicleList).remove();
            var karUrl = "/kar/images/changeCar/";
            if (window.location.hostname.match(/localhost/ig)) {
                karUrl = "https://stg.myuvo.com" + karUrl;
            }

            var vehicleSwitcherTimeout;
            var myScroll;

            function makeVehicleTile(index, vInfo) {
                var $vehicle = $baseVehicle.clone();
                var src = karUrl + vInfo.imageFileName;
                $(".title", $vehicle).text(vInfo.nickname);
                $(".trim", $vehicle).text(vInfo.modelYear + " " + vInfo.modelName);
                $(".image img", $vehicle).attr("src", src).attr("alt", vInfo.modelName);

                var $check = $(".marker .check", $vehicle);

                if (vehicleResponse.selectedVin === vInfo.vin) {
                    $check.addClass("selected");
                    var nickName = (vInfo.nickname);
                    nickName = nickName.substr(0, 10) + " " + nickName.substr(10);
                    $vehlSelector.children(".title").text(decodeURIComponent(nickName));
                    $vehlSelector.children(".trim").text(vInfo.modelYear + " " + vInfo.modelName);
                    $vehlSelector.children("img").attr("src", src).attr("alt", vInfo.modelName);
                    $("div.user-car img").attr("src", src);
                }

                $(".marker", $vehicle).click(selectVehicle.bind($check, vInfo));
                if (index < 3) {
                	$vehicleList.append($vehicle);
                }
            }
            
            function makeShowAllTile() {
            	var $tile = $('<li>');
            	$tile.addClass('show-all-vehicles');
            	$tile.html('<a href="/ccw/com/vehlChoice.do">VIEW ALL VEHICLES</a>')
            	
                $vehicleList.append($tile);            	
            }

            (function (vehicles) {
                var nonActive = [];
                
                $.each(vehicles, function (index, vInfo) {
                    if (vInfo.uvoEnabled()) {
                        makeVehicleTile(index, vInfo);
                    } else {
                        nonActive.push(vInfo);
                    }
                });
                
                if (vehicles.length > 3) {
                	makeShowAllTile();
                }

                //$.each(nonActive, makeVehicleTile);
            }(vehicleResponse.vehicles));

            $vehlSelector.click(function () {
                $switcher.removeClass("hide");
                /*
                if (vehicleResponse.vehicles.length < 5) {
                    $switcher.css("height", (101 * vehicleResponse.vehicles.length - 1) + "px");
                } else {
                    myScroll = myScroll || new IScroll('#vehicle-switcher', {
                        scrollbars            : 'custom',
                        mouseWheel            : true,
                        interactiveScrollbars : true,
                        snap                  : 'li'
                    });
                }
                */
            });

            $vehlSelector.on('mouseleave', function () {
                vehicleSwitcherTimeout = setTimeout(function () {
                    $(".nav-vehicle-switcher").addClass("hide");
                }, 250);
            });

            $vehlSelector.on('mouseenter', function () {
                clearTimeout(vehicleSwitcherTimeout);
            });
        });
    }());

    (function addGeneralEarlyInits() {
        if ((/main\.do/i).test(window.location.pathname)) {
            uvo.data.getMaintenanceIntervals = $.ajax("/ccw/kh/service/maintenance/intervals.do", {
                type        : "POST",
                data        : JSON.stringify({"vin" : ""}),
                contentType : 'application/json'
            });
        }

        uvo.addEarlyInit([
            uvo.simpleRouteFactory("getMyVehicles", "/ccw/com/vehiclesInfo.do", (/myVehicles/i)),
            uvo.simpleRouteFactory("khActiveDtcCnt", '/ccw/kh/activeDtcCnt.do', (/myVehicles/i)),
            uvo.simpleRouteFactory("getPoiList", "/ccw/cp/poiData.do", (/poiOverview/i)),
            //uvo.simpleRouteFactory("getTripInfo", "/ccw/kh/tripsDetail.do", (/tripsOverview/i)),
            uvo.simpleRouteFactory("getDiagnosticIssues", "/ccw/ovd/csv/dtcDetails.do", (/main\.do/i)),
            uvo.simpleRouteFactory("getMaintenanceIntervals", "/ccw/kh/service/maintenance/intervals.do", (/main\.do/i))
        ]);
    }());

    uvo.init();
    uvo.sessionIdleTimeout();

}(window.uvo || {}));