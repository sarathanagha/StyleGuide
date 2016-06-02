/*
 Name: kh-app.js
 Description : Application definition file for myUVO.com for KH vehicles
 author pselca
 since Apr 10, 2014
 version 1.0.2
 Modification Information
 since          author          description
 ===========    =============   ===========================
 Apr 10, 2014   pselca          File creation
 Apr 26, 2014   pselca          Added pre-init handling
 Apr 30, 2014   pselca          Module loading functions.
 Jul 25, 2014   pselca          Ripped most stuff out of this file, keeping for reference
 */
window.uvo = window.uvo || {};
(function (uvo) {
    var gMaps = (window.google && window.google.maps);
    var com = uvo.common, uTypes = uvo.dataTypes;
    var docReady = uvo.docReady;
    var genericErrHandler = uvo.genericErrorHandler;
    
    uvo.fnMap_inits = $.extend(uvo.fnMap_inits, {
        "kh-overview"          : "initKhVehicleOverview",
        "kh-command-log"       : "initCommandLog",
        "kh-curfew-settings"   : "initCurfewSettings",
        "kh-speed-settings"    : "initSpeedSettings",
        "kh-geofence-settings" : "initGeofenceSettings",
        "kh-maintenance"	   : "initKhMaintenance" 
    });

    //app methods

    window.uvo = $.extend(uvo, {
        wireGeneralEvents     : function wireGeneralEvents() {
            (function wireTmsRefresh() {
                //tms refresh button
                var processing = 'proccesing';
                var updated = 'updated';
                var error = 'error';
                var currTmsState = 'normal';
                
                $('#tmsRefresh').on('click', function () {
                    if (currTmsState === 'normal') {
                        currTmsState = processing;
                        uvo.showLoadingMessage("Refreshing data");
                        //ajax request latest status
                        $.ajax('/ccw/kh/latestVehicleStatus.do').done(function (data) {
                            console.log('data : ', data);
                            uvo.clearLoadingConfirm();
                            uvo.refreshPage();
                        }).fail(uvo.genericErrorHandler).always(function(){currTmsState = 'normal'});
                    }
                });
            }());
        },
        initKhVehicleOverview : function initKhVehicleOverview() {
            //console.log('overview');
            uvo.showLoadingMessage("Refreshing data");
            $('#tmsRefresh').toggle();
            var infoData;
            uvo.dataRequest("khVehicleStatus").done(function (statusResponse) {
            	var vehicleStatusResponse = new uTypes.VehicleStatusReponse(statusResponse);
                com.vehicleStatus = vehicleStatusResponse.latestVehicleStatus;

                //miles driven per month
                uvo.dataRequest("khOverviewInfo").done(function (data) {
                    //console.log('data : ', data);
                    infoData = data;
                    createCharts();
                    initLayout();
                    uvo.clearLoading();
                }).fail(uvo.genericErrorHandler);

//                uvo.dataRequest("outsideTemp").done(function (data) {
//                    //console.log('data : ', data);
//                    $('#outsideTemp').html(Math.round(data.temp) + '<sup>º</sup><span>OUTSIDE</span>');
//                }).fail(uvo.genericErrorHandler);

                function initLayout() {
                    var text;
                    $('#currMileage').html(numberWithCommas(infoData.currentMileage));
                    $('#milesTillNextMaint').html(numberWithCommas(infoData.milesTillNextMaint));
                    $('#climateDescription').html(infoData.weather);
                    $('#outsideTemp').html(Math.round(infoData.tempF) + '<sup>º</sup><span>OUTSIDE</span>');
                    $('.k900-hero').css('background-image', 'url(/images/kh/img/k900/' + infoData.weatherImage + ')');
                    $('.k900-hero').css('background-size', '100%');
                    $('.k900-hero').css('background-position', 'top');
                    var hvacTemp = "--<sup>&deg;</sup>";
					if (typeof com.vehicleStatus.airTemp !== 'undefined') {
						hvacTemp = uvo.getConvertedHvacTemp(com.vehicleStatus.airTemp.value);
					}
					if (hvacTemp == 'low' || hvacTemp == 'high') $('#insideTemp').addClass('inside-lowhigh');
                    $('#insideTemp').html(hvacTemp + '<span>VEHICLE</span>');
                    //console.log(com.vehicleStatus)
                    if (com.vehicleStatus.doorLock) {
                    	$('#lock').removeClass('hide');
                    	$('#unlock').addClass('hide');
                    }else{
                    	$('#unlock').removeClass('hide');
                    	$('#lock').addClass('hide');
                    }
                    if (com.vehicleStatus.lowFuelLight) {
                        $('#lowFuel').show();
                    } else if (infoData.numOfIssues) {
                        text = infoData.numOfIssues.toString() + ' issues found';
                        $('#diagIssuesFound').html(text);
                        $("#issue").show();
                    } else {
                        $("#noIssue").show();
                    }
                }

                function numberWithCommas(x) {
                    return parseInt(x).toLocaleString().replace(/\.\d\d$/, "");
                }

                function createCharts() {
                    var data = infoData;
                    //create bar chart for mileage
                    console.log('data', data)
                    var i = 0, xAxisCategories = [], barChartData = [];
                    for (i = 0; i < data.monthlyStat.length; i++) {
                        var month = moment(data.monthlyStat[i].month, "M").format('MMM');
                        xAxisCategories[i] = month;
                        barChartData[i] = data.monthlyStat[i].milesDriven;
                    }
                    columnChart(xAxisCategories, barChartData);
                    var current = data.monthlyStat[data.monthlyStat.length - 1];
                    uvo.drawSafetyScore($("#doughnut"), current.efficientScore, current.inefficientScore);
                }

                function columnChart(cats, data) {
                    $('#chart').highcharts({
                        chart   : {
                            type   : 'column',
                            width  : 250,
                            height : 150},
                        title   : {text : ''},
                        xAxis   : {categories : cats },
                        yAxis   : {title : {text : 'Miles'},
                            type         : 'linear',
                            min          : 0
                        },
                        series  : [
                            {data : data}
                        ],
                        credits : {enabled : false},
                        legend  : {enabled : false},
                        tooltip : {enabled : false}});
                }
            });

        },
        initKhMaintenance     : function initKhMaintenance() {
            // window.uvo.initMaintenance();
        	$('#tmsRefresh').toggle();
            var currentMileage = 56129; //kh.vehicleStatus
            var nextServiceInterval = 60000;
            var milesTilNext = nextServiceInterval - currentMileage;
            var oilChangeIntervalData;
            console.info(milesTilNext);

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
                dlrModal.pageSize = 3;
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
                	$("#selectVehicleType").val("K900").prop("disabled",true);
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
	                                /*if (dealer.dealerCode === dealerCode) {
	                                    return true;
	                                }*/
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
            var issueType = $('#veh-repair').attr('value');

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
                    console.log('request done');
                    $('#appointmentModal').show();
                    $('#appointmentClose').on('click', function () {
                        $('#appointmentModal').hide();
                    });
                });
            });

            //=================================================================
            //oil change logic
            //=================================================================
            
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
	             $('.miles').html(numberWithCommas(d.mileageTillNextOilChange));
	             var optionsTemplate = $('.option-template').remove();
	
	             for (i = 0; i < d.oilChangeIntervalOptions.length; i++) {
	             option = optionsTemplate.clone();
	
	             option.attr('value', d.oilChangeIntervalOptions[i]);
	             option.html(numberWithCommas(d.oilChangeIntervalOptions[i]));
	             //cast intentional
	             if (d.oilChangeIntervalOptions[i] == d.currentOilChangeInterval) {
	             option.attr('selected', 'selected');
	             }
//	             console.log('optionsTemplate : ', option);
	             $('.oil-change-intervals').append(option);
	             }
	             function numberWithCommas(x) {
	            	 return parseInt(x).toLocaleString().replace(/\.\d\d$/, "");
	             }
             }

             $('.restart-btn').on('click', function () {
             var newInterval = $('.oil-change-intervals').val();
             if (oilChangeIntervalData.currentOilChangeInterval != newInterval) {

        	 uvo.showLoadingMessage();
         	
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
	            	 uvo.clearLoadingConfirm();
	            	 oilChangeIntervalData.currentOilChangeInterval = newInterval;
	            	 oilChangeIntervalData.mileageTillNextOilChange = newInterval;
	            	 $('.miles').html(newInterval);	            	 
	             }).fail(genericErrHandler);
	
	             } else {
	            	 uvo.clearLoading();
	             }
             });
             
        },
        getConvertedHvacTemp  : function getConvertedHvacTemp() {
            var hvacTemp = parseInt(com.vehicleStatus.airTemp.value.substr(0, 2), 16);
            var degreeStr = "<sup>&deg;</sup>";
            var tempUnits = "F"; //or 'C'
            var hexToTemp = {
            		F : {"--" : "--", "01" : 'Low', "02" : 'Low', "03" : 63, "04" : 63, "05" : 64, "06" : 65, "07" : 66, "08" : 67, "09" : 68, "0A" : 69, "0B" : 70, "0C" : 71, "0D" : 72, "0E" : 73, "0F" : 74, "10" : 75, "11" : 76, "12" : 77, "13" : 78, "14" : 79, "15" : 80, "16" : 81, "17" : 82, "18" : 83, "19" : 84, "1A" : 85, "1B" : 86, "1C" : 87, "1D" : 88, "1E" : 89, "1F" : 89, "20" : 'High'},
                    C : {"--" : "--", "01" : 'Low', "02" : 'Low', "03" : 17, "04" : 18, "05" : 18, "06" : 19, "07" : 19, "08" : 20, "09" : 20, "0A" : 21, "0B" : 21, "0C" : 22, "0D" : 22, "0E" : 23, "0F" : 23, "10" : 24, "11" : 24, "12" : 25, "13" : 25, "14" : 26, "15" : 26, "16" : 27, "17" : 27, "18" : 28, "19" : 28, "1A" : 29, "1B" : 29, "1C" : 30, "1D" : 30, "1E" : 31, "1F" : 31, "20" : 'High'}
            };

            function toHexString(num) {
                if (num > 15) {
                    return num.toString(16);
                } else {
                    return "0" + num.toString(16);
                }
            }

            function tempFromHex(hexTemp) {
                if (hexTemp && typeof hexTemp === 'number') {
                    hexTemp = toHexString(hexTemp);
                }
                return hexToTemp[tempUnits][(hexTemp.toUpperCase() || "--")];
            }

            var retTempVal = tempFromHex(hvacTemp);
            return (isNaN(retTempVal)) ? retTempVal : retTempVal + degreeStr;
        },

        drawSafetyScore       : function drawSafetyScore($el, good, bad) {
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
                    height  : 150,
                    width   : 150,
                    style   : {"top" : "10px", "left" : "10px" }
                },
                labels : {
                    items : [
                        {
                            html  : "<div>" + good + "</div>",
                            style : {
                                "font-size" : "4.5em",
                                "color"     : "#000000",
                                "left"      : "43px",
                                "top"       : "82px"
                            }
                        },
                        {
                            html  : "/100",
                            style : {
                                "top"       : "100px",
                                "left"      : "60px",
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
                        size        : 130,
                        innerSize   : 115,
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
        },
        initKhDrivingActivity : function initKhDrivingActivity() {
            $.when(com.moduleReady("drivingActivity")).done(function () {
                uvo.mod.drivingActivity.init();
            });
        },
        initCurfewSettings    : function initCurfewSettings() {
            com.moduleReady("carZoneSettings").done(function (mod) {
                mod.initCurfewSettings();
            });
        },
        initSpeedSettings     : function initSpeedSettings() {
            com.moduleReady("carZoneSettings").done(function (mod) {
                mod.initSpeedSettings();
            });
        },
        initGeofenceSettings  : function initGeofenceSettings() {
            com.moduleReady("carZoneSettings").done(function (mod) {
                mod.initGeofenceSettings();
            });
        },
        initPendingRefresh: function() {
        	var delay = 30000;
        	console.log('Initializing Pending Refresh...');
        	setTimeout(function(){ return setInterval(function(){window.location.reload();},delay); },delay);
        },
        initCommandLog        : function initCommandLog() {
            var mappedVehicles = {};
            var interval;
            uvo.showLoadingMessage();
            $('.alerts .item').hide();
            $.when(uvo.getVehicles(), uvo.dataRequest("commandsHistory")).done(function (data1, data2) {
                console.log(data1);
                for (var i = 0; i < data1.vehicles.length; i++) {
                    mappedVehicles[data1.vehicles[i].vin] = data1.vehicles[i].vehNick;
                }
                $('.alerts .item').show();
                                
                populateVehicles(data2);
                uvo.clearLoading();
            }).fail(function (xhr, status, error) {
            	$('.alert-msj').addClass("hide");
            	$('.log-alerts').addClass("hide");
            	$('.noAlert-msj').removeClass("hide");
            	$('.noCommands').removeClass("hide");
            	uvo.clearLoading();
	            if (status !== "904" && status !== "903") {
	                uvo.genericErrorHandler(xhr, status, error);
	            }
            });

            function populateVehicles(commands) {
            	
                var successCommand = $('.command-success').remove();
                var failCommand = $('.command-failed').remove();
                var pendingCommand = $('.command-pending').remove();

                //                if (commands.length < 20) {
                //                    $('#loadMoreBtn').hide();
                //                }
                $('.alert-msj strong').html(commands.length);
                for (var i = 0; i < commands.length; i++) {
                    switch (commands[i].status) {
                        case "P":
                        //pending
                        	createRow(pendingCommand.clone(), commands[i]);
                        	break;
                        case "Z":
                            //success
                            createRow(successCommand.clone(), commands[i]);
                            break;
                        case "E":
                            //error
                            createRow(failCommand.clone(), commands[i]);
                            break;
                    }
                }
                if (commands.length == 0) {
                	$('<div>No remote commands have been sent to your vehicle.</div>').insertAfter('.alert-msj');
                }
                
                else if (commands[0].status == "P") {
                	uvo.initPendingRefresh();
            	}

                function createRow(element, data) {
                    var time = moment(data.modifiedDate).format("MMMM Do YYYY, h:mm a");
                    //vehicle nick name
                    element.find('.vehicle span').html(mappedVehicles[data.vin]);
                    //command
                    element.find('.indicator').html(data.scenarioName);
                    //date
                    element.find('.date').html(time);
                    //add it
                    $('#commandsContainer').append(element);
                }
            }
        }

    });

    (function addKhEarlyInits() {
        var routeFactory = uvo.simpleRouteFactory;

        uvo.addEarlyInit([
            //routeFactory("getDiagnosticIssues", "/ccw/ovd/csv/dtcDetails.do", /./i),
            routeFactory("commandsHistory", "/ccw/kh/remoteCommandsLog.do", (/kh\/log/i)),
            routeFactory("getPeakHours", "/ccw/kh/drivingPeakHours.do", (/kh\/driveActivity/i)),
            routeFactory("khOverviewInfo", "/ccw/kh/overviewInfo.do", (/kh\/overview/i)),
             routeFactory("outsideTemp", "/ccw/kh/outsideTemp.do", (/kh\/(climate)/i)),
            routeFactory("khVehicleStatus", '/ccw/kh/vehicleStatus.do', (/kh\/(overview)/i))
        ]);

    }());

    $(document).ready(docReady.resolve);
    docReady.done(function () {

        //This is so that the left hand elements will still be properly
        //selected when you're on other tabs in the same group.
        var navgroups = {
        	"/ccw/kh/climate.do"             : "/ccw/kh/climateMenu.do",
            "/ccw/kh/lock.do"             : "/ccw/kh/climateMenu.do",
            "/ccw/kh/findVehicle.do"      : "/ccw/kh/climateMenu.do",
            "/ccw/cp/speedAlerts.do"      : "/ccw/cp/curfewAlerts.do",
            "/ccw/cp/geofenceAlerts.do"   : "/ccw/cp/curfewAlerts.do",
            "/ccw/kh/geofenceSettings.do" : "/ccw/cp/curfewAlerts.do",
            "/ccw/kh/curfewSettings.do"   : "/ccw/cp/curfewAlerts.do",
            "/ccw/kh/speedSettings.do"    : "/ccw/cp/curfewAlerts.do"
        };
        var url = navgroups[window.location.pathname] || window.location.pathname + window.location.search;

        $("nav.nav-secondary h1 a").filter("[href='" + url + "']").parent().addClass("selected");

        uvo.wireGeneralEvents();
    });

    uvo.init();
}(window.uvo));
