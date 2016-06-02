(function (uvo) {
    if (!uvo) {
        throw new Error("Make sure you include KH libraries after uvo, not before!");
    }

    var $infoContent;
    var delModal;
    var gMaps = (window.google && window.google.maps), com = uvo.common, uTypes = uvo.dataTypes, genericErrHandler = uvo.genericErrorHandler;

    function earlyInit(){
    	var defer = new $.Deferred();
    	uvo.showLoadingMessage();
	    uvo.selectedVehicle().done(function(vehicle) {
	        if(vehicle.modelName === "K900") {
	            uvo.addEarlyInit([
	                uvo.simpleRouteFactory("getGeofenceAlerts", "/ccw/kh/geoFenceAlertDetails.do", (/\/cp\/geofenceAlerts/i)),
	                uvo.simpleRouteFactory("getCurfewAlerts", "/ccw/kh/curfewAlertDetails.do", (/\/cp\/curfewAlerts/i)),
	                uvo.simpleRouteFactory("getSpeedAlerts", "/ccw/kh/speedAlertDetails.do", (/\/cp\/speedAlerts/i))
	            ]);
	            
	        } else {
	            uvo.addEarlyInit([
	                uvo.simpleRouteFactory("getSpeedAlerts", "/ccw/cp/speedLimitAlertDetails.do", (/\/cp\/speedAlerts/i)),
	                uvo.simpleRouteFactory("getGeofenceAlerts", "/ccw/cp/geoFenceAlertDetails.do", (/\/cp\/geofenceAlerts/i)),
	                uvo.simpleRouteFactory("getCurfewAlerts", "/ccw/cp/curfewAlertDetails.do", (/\/cp\/curfewAlerts/i))
	            ]);
	            
	        }
	        uvo.clearLoading();
	        defer.resolve();
	    });
	    return defer;
    }


    var InfoWin = new gMaps.InfoWindow({
        pixelOffset : new gMaps.Size(135, 40, "px", "px")
    });

    function showMarkerMessage(map, position, body) {
    	//debugger;
        InfoWin.close();
        //$("strong", $infoContent).text(heading);
        $("span", $infoContent).html(body);
        InfoWin.setContent($infoContent.get(0));
        InfoWin.setPosition(position);
        InfoWin.open(map);
    }
    
    function formatDate(dateObj)
    {
        var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var curr_date = dateObj.getDate();
        var curr_month = dateObj.getMonth();
        var curr_year = dateObj.getFullYear();
        var curr_min = dateObj.getMinutes();
        var curr_hr= dateObj.getHours();
        var curr_sc= dateObj.getSeconds();
        var curr_am = "AM";
              
        if(curr_date.toString().length == 1)
        curr_date = '0' + curr_date;
        if(curr_hr==0){
            curr_hr = '12';        
        } else if(curr_hr == 12) {
        	curr_am = "PM";
        } else {
        	if(curr_hr > 12){
        	curr_hr = curr_hr - 12;
        	curr_am = "PM";
        	}
        }
        	
        if(curr_hr.toString().length == 1)
        curr_hr = '0' + curr_hr;
        if(curr_min.toString().length == 1)
        curr_min = '0' + curr_min;
        if(curr_sc.toString().length == 1)
        	curr_sc = '0' + curr_sc;
               
            return monthNames[curr_month]+" "+curr_date+" "+curr_year+" "+curr_hr+":"+curr_min+":"+curr_sc+" "+curr_am; 
    }
    
    function drawAlertMap(details, $item, $gmap, alertText) {
    	var $mapBtn = $(".option.map", $item).toggleClass("active");
        $mapBtn.children("span").text("HIDE MAP");

        $(".option.map").not($mapBtn).removeClass("active");
        $(".option.map:not(.active) > span").text("VIEW MAP");

        var $map = $(".img-container", $item).toggleClass("active");
        $(".img-container").not($map).removeClass("active");

        $map.append($gmap);

        var mapOptions = new com.MapOptions({center : details.alertPos});
        var resultMap = new gMaps.Map($gmap.get(0), mapOptions);

        var iconStart = (details.alertTypeCode === "3" ? '/ccw/images/MyCarZone/marker_green_alert_start.png' : '/ccw/images/MyCarZone/marker_green_driving_start.png');
        var iconAlert = (details.alertTypeCode === "3" ? '/ccw/images/MyCarZone/marker_red_max_speed.png' : '/ccw/images/MyCarZone/marker_red_alert.png');
        var iconEnd = (details.alertTypeCode === "3" ? '/ccw/images/MyCarZone/marker_blue_alert_end.png' : '/ccw/images/MyCarZone/marker_blue_driving_end.png');
        var bounds = new gMaps.LatLngBounds();
        var alertMark = new gMaps.Marker({
            map      : resultMap,
            position : details.alertPos,
            icon     : iconAlert,
            zIndex   : 100
        });
        if (details.startPos != "(0, 0)"){
	        var startMark = new gMaps.Marker({
	            map      : resultMap,
	            position : details.startPos,
	            icon     : iconStart,
	            zIndex   : 90
	        });
	        bounds.extend(details.startPos);
        }
        if (details.endPos != "(0, 0)"){
	        var endMark = new gMaps.Marker({
	            map      : resultMap,
	            position : details.endPos,
	            icon     : iconEnd,
	            zIndex   : 80
	
	        });
	        bounds.extend(details.endPos);
        }
        
        bounds.extend(details.alertPos);     

        resultMap.fitBounds(bounds);

        var msgStart = (details.alertTypeCode === "3" ? "[ALERT START ] hh:mma" : "[DRIVING START ] hh:mma");
        var msgEnd = (details.alertTypeCode === "3" ? "[ALERT END ] hh:mma" : "[DRIVING END ] hh:mma");
        bounds.extend(details.alertPos);        
        // don't show start position if it's 0,0        
        if (details.startPos != "(0, 0)"){
	        var startMark = new gMaps.Marker({
	            map      : resultMap,
	            position : details.startPos,
	            icon     : '/ccw/images/MyCarZone/marker_green_driving_start.png',
	            zIndex   : 90
	        });
	        bounds.extend(details.startPos);

       // var startMsg = details.driveStart.format(msgStart);
        $.when(com.makeReverseGeocodeRequest(details.strtLat, details.strtLong)).always(function (results) {
        	debugger;
        	var d = new Date(0);
        	
            d.setUTCSeconds(details._rawLoaded.startDtTime/1000);
            
        	var startBody = results[0].formatted_address ? formatDate(d)+"</br>"+com.formatGoogleMapsAddress(results[0].formatted_address) : formatDate(d)+"</br>"+"Unable to find address";
        	if(isNaN(details._rawLoaded.startDtTime/1000)){
            	var startBody = com.formatGoogleMapsAddress(results[0].formatted_address);
            }
        	
        	gMaps.event.addListener(startMark, 'click', function() {
                showMarkerMessage(resultMap, details.startPos, startBody);
            });
        });
		};
		// don't show end position if it's 0,0
        if (details.endPos != "(0, 0)"){
	        var endMark = new gMaps.Marker({
	            map      : resultMap,
	            position : details.endPos,
	            icon     : '/ccw/images/MyCarZone/marker_blue_driving_end.png',
	            zIndex   : 80
	
	        });
	        bounds.extend(details.endPos);

        //var endMsg = details.driveEnd.format(msgEnd);
        $.when(com.makeReverseGeocodeRequest(details.stpLat, details.stpLong)).always(function (results) {
        	var d = new Date(0);
            d.setUTCSeconds(details._rawLoaded.endDtTime/1000);
            
        	var stopBody = results[0].formatted_address ? formatDate(d) +"</br>"+com.formatGoogleMapsAddress(results[0].formatted_address) : formatDate(d)+"</br>"+"Unable to find address";
        	if(isNaN(details._rawLoaded.endDtTime/1000)){
            	var stopBody =  com.formatGoogleMapsAddress(results[0].formatted_address);
            }
        	gMaps.event.addListener(endMark, 'click', function() {
                showMarkerMessage(resultMap, details.endPos, stopBody);
            });
        });
		};
        $.when(com.makeReverseGeocodeRequest(details.lat, details.lng)).always(function (results) {
        	var alertBody = alertText[1] || "";
        	alertBody +=  results[0].formatted_address ? (alertText[1] ? "<br>" : "") + com.formatGoogleMapsAddress(results[0].formatted_address) : formatDate(d)+"</br>"+"Unable to find address";
            gMaps.event.addListener(alertMark, 'click', function() {
                showMarkerMessage(resultMap, details.alertPos, alertBody);
            });
        });

        return resultMap;
    }

    function updateAlertCountMessage(alertType, total, shown) {
        var alertMsg = "<strong>%S</strong> %T Alerts Total (%N filtered)";
        alertMsg = alertMsg.replace("%T", alertType);
        alertMsg = alertMsg.replace("%S", total);
        alertMsg = alertMsg.replace("%N", total - shown);

        $(".alert-msj").html(alertMsg);
        
      //  alert(total);
        
        if (total == 0) {
        	$(".manage-buttons").hide();
        	$('.no-alerts').removeClass('hide');
        } else {
        	$(".manage-buttons").show();	
        	$('.nom-alerts').addClass('hide');
        }
    }

    function activateManage() {
        var $items = $(".item").addClass("select");
        var $opts = $(".option.select").removeClass("hide");
        $(".option.map").addClass("hide");
        $(".option.map.active").click();

        $(".alert-menu").addClass("hide").removeClass("show");
        $(".manage-buttons .dropdown-menu").hide();
    }

    function selectAlertForDelete(details) {
        var $select = $(".option.select", this).toggleClass("selected");
        details.selectedForDeletion = $select.hasClass("selected");

        $(".delete-selected").toggleClass("inactive", $(".option.select.selected").size() === 0);
    }

    function deactivateManage() {
        var $items = $(".item").removeClass("select");
        var $opts = $(".option.select").addClass("hide").removeClass("selected");
        $(".option.map").removeClass("hide active");
        $(".alert-menu").addClass("show").removeClass("hide");
    }

    function sendDelete(alerts, all) {
    	//console.log(arguments[1]);
    	var payload = [];
        var delAlerts = alerts.filter(function (alert) {
            return alert.selectedForDeletion;
        });
    	if (arguments[1] == 'all'){
    		delAlerts = alerts;
    	}

        if (delAlerts.length === 0) {
            return false;
        }
        
        $.each(delAlerts, function(i, n){
        	payload.push(n._rawLoaded)
        });

        delPrompt("Are you sure you want to<br />delete " + delAlerts.length + " alert"+(delAlerts.length == 1 ? '' : "s")+"?", function () {
        	var delRequest;
        	if (!window.isK900) {
    	
	        	var violTrscIdList = [],
	                violTrscSeqList = [],
	                violSeqList = [];
	
	            $.each(delAlerts, function (index, details) {
	                violTrscIdList[index] = details.headerTid;
	                violTrscSeqList[index] = details.trscSeq;
	                violSeqList[index] = details.violSeq;
	            });
	
	            var postData = {
	                violType        : alerts.length && alerts[0].violType,
	                violTrscIdList  : violTrscIdList.join(","),
	                violTrscSeqList : violTrscSeqList.join(","),
	                violSeqList     : violSeqList.join(","),
	                deleteViol      : "deleteSelected"
	            };
	
	            console.log("deleting:", postData);
	            delRequest = $.ajax("/ccw/cp/deleteTripAlertsDetail.do", {
	                type : "POST",
	                data : $.param(postData) 
	            });
	            
        	} else {

	            data = [];
	            switch($('body').attr('id')) {
	            case 'mcz-alerts-curfew':
	                delRequest = $.ajax('/ccw/kh/curfewAlertDetails.do', {
	                    type : "POST",
	                    data : {curfewAlertDetailPayLoad: JSON.stringify(payload)}
	                });
	            	break;
	            case 'mcz-alerts-geofence':
	                delRequest = $.ajax('/ccw/kh/geoFenceAlertDetails.do', {
	                    type : "POST",
	                    data : {geoFenceAlertDetailPayLoad: JSON.stringify(payload)}
	                });
	            	break;
	            default:
	                 delRequest = $.ajax('/ccw/kh/speedAlertDetails.do', {
	                    type : "POST",
	                    data : {speedAlertDetailPayLoad: JSON.stringify(payload)}
	                });
	            	break;
	            }
            }

            uvo.showLoadingMessage(); 

            delRequest.done(function (d) {
            	uvo.refreshPage();
            });

            delRequest.fail(function(){
            	uvo.genericErrorHandler;
            	delModal.close();
            });

            delRequest.always(function () {
            	uvo.clearLoading();
                
            });
        });
    }

    function delPrompt(msg, fn) {
        delModal.open();
        $(".message", delModal.$dom).html(msg);
        $(".highlighted", delModal.$dom).off('click').on('click', fn);
    }

    function allDelete() {
        delPrompt("Are you sure you want to<br />delete all alerts?", function () {
            var tabName = $(".carzone-menu .active a").text();
            var postData = {
                violType        : tabName.substr(0, 1).toUpperCase(),
                violTrscIdList  : "",
                violTrscSeqList : "",
                violSeqList     : "",
                deleteViol      : "deleteAll"
            };

            var delRequest = $.ajax("/ccw/cp/deleteTripAlertsDetail.do", {
                type : "POST",
                data : $.param(postData)
            });

            delRequest.done(function (d) {
                uvo.clearLoading();
            });

            delRequest.fail(uvo.genericErrorHandler);

            delRequest.always(function () {
                uvo.refreshPage();
            });
        });
    }

    function singleDelete(details) {
        //This is so that if they hit cancel the item isn't included if they do a delete selected later
        var clone = $.extend({}, details);
        clone.selectedForDeletion = true;
        sendDelete([clone]);
    }

    $(document).ready(function () {
        $(".manage-buttons .button:last").click(activateManage);
        $(".delete-buttons .button.active:last").click(deactivateManage);
        $(".delete-buttons .button.delete-all").click(allDelete);
        delModal = new com.Modal(".notification-delete");
        $infoContent = $(".mcz-info-window").removeClass("hide").remove();
        $("a.close", $infoContent).click(function(){
            InfoWin.close();
        });
        $("button.cancel").on('click', function(){
        	delModal.close();
        })
    });

    var module = {
        alertFilterSetup   : function alertFilterSetup(showFiltered) {
            var $filter = $(".dropdown.button");
            var $dropmenu = $filter.next('.dropdown-menu');

            $filter.click(function () {
                $dropmenu.toggle();
            });

            $dropmenu.children().click(function () {
                $filter.text($(this).text());
                $dropmenu.hide();
                doFilter();
            });

            function doFilter() {
                var filterValue = $filter.text().match(/\d+/g);
                if (filterValue) {
                    filterValue = filterValue[0];
                } else {
                    filterValue = 0;
                }
                var filterMoment = moment().subtract('days', filterValue).startOf('day');
                showFiltered(filterMoment);
            }

            doFilter();
        },
        initCurfewAlerts   : function initCurfewAlerts() {
        	earlyInit().done(function(vehicle) {
            var $list = $(".alerts.widget-box");
            var $baseItem = $(".item.curfew").remove();
            var $gmap = $("<div id='gmap'></div>");

            //format string for moment.js
            var timeStampFormat = "[<strong>]hh[</strong><sup>:</sup><strong>]mm[</strong><sub>]A[</sub>]";
            var infoFormat = "[Curfew Alert on] MMM D, YYYY";

            var alerts;
            var initPageLoad = true;

            module.alertFilterSetup(function showFiltered(filterMoment) {
                $list.empty();
                uvo.showLoadingMessage();
                uvo.dataRequest("getCurfewAlerts").done(function (curfewAlerts) {
                	//console.log("curfewAlerts");
                	//console.log(curfewAlerts);
                    alerts = alerts || uTypes.collectionOf(uTypes.CurfewAlertDetail, curfewAlerts);
                    uvo.clearLoading();
                    var filteredAlerts = alerts.filter(function (details) {
                        return details.moment.isAfter(filterMoment);
                    });
                    
                    if (filteredAlerts.length == 0 && initPageLoad){ //Code added to adapt filter to 30 days if there is no alert for Today
                    	initPageLoad = false;
                    	$(".dropdown.button").text('LAST 30 DAYS');
                    	var filterMomentDefault = moment().subtract('days', 30).startOf('day');
                    	filteredAlerts = alerts.filter(function (details) {
                            return details.moment.isAfter(filterMomentDefault);
                        });
                    }

                    $(".delete-buttons .button.delete-selected").off('click').on('click', sendDelete.bind(this, alerts));
                    $(".delete-buttons .button.delete-all").off('click').on('click', sendDelete.bind(this, alerts, 'all'));
                    
                    $.each(filteredAlerts, function (index, details) {
                        //looks like 11pm - 3am or 11:15pm - 3am if there are minutes
                        var setString = "curfew: ";
                        setString += details.startTime.format("h:mma - ");
                        setString += details.endTime.format("h:mma");
                        setString.replace(":00", "");
                       
                        var $item = $baseItem.clone().removeClass('hide');
                        details.moment.minute(details.alertMin);
                        details.moment.hour(details.alertHour);
                        $(".indicator", $item).html(details.moment.format(timeStampFormat));
                        $(".row.info", $item).text(details.moment.format(infoFormat));
                        $(".row.link", $item).text(setString);
                        if (details.lat == 0 && details.lng == 0){
                        	$(".option.map", $item).removeClass("active");
                        	$(".option.map", $item).addClass("hide");
                        	$(".option.error", $item).removeClass("hide");
                        }
                        var messages = [details.moment.format("[Alert occurred at ]hh:mma"), setString];

                        $(".option.map", $item).click(drawAlertMap.bind($item, details, $item, $gmap, messages));
                        $(".option.select", $item).click(selectAlertForDelete.bind($item, details));
                        $(".delete-item", $item).click(singleDelete.bind($item, details));

                        $list.append($item);
                    });

                    updateAlertCountMessage("Curfew", alerts.length, filteredAlerts.length);

                }).fail(function (xhr, status, error) {
                	uvo.clearLoading();
                    updateAlertCountMessage("Curfew", 0, 0);
                    if (status === "904" || status === "903") {
                        com.$hide($(".load-more"));
                    } else {
                        uvo.genericErrorHandler(xhr, status, error);
                    }
                });
            });
        	});
        },
        initGeofenceAlerts : function initGeofenceAlerts() {
        	earlyInit().done(function() {
            var circleColor = "#FF0000";
            var timeStampFormat = "[<strong>]hh[</strong><sup>:</sup><strong>]mm[</strong><sub>]A[</sub>]";
            var infoFormat = "on MMM D, YYYY";
            var $gmap = $("<div id='gmap'></div>");
            var $list = $(".alerts.widget-box");
            var $baseItem = $(".item.geo-fence").remove();
            var totalStr = "<strong>%S</strong> Geofence Alerts Total (%N filtered)";
            var alerts;
            var initPageLoad = true;

            function toggleMap(details, $item, messages) {
                var resultMap = drawAlertMap.call(this, details, $item, $gmap, messages);
                
                if (details._rawLoaded.circleFenceType != '0') {
                	var circleOpts = {
                            map           : resultMap,
                            center        : details.circleCenter,
                            radius        : details.radiusMeters,
                            fillColor     : circleColor,
                            fillOpacity   : 0.2,
                            strokeColor   : circleColor,
                            strokeWeight  : 1,
                            strokeOpacity : 0.2
                        };

                    var circle = new gMaps.Circle(circleOpts);
                } else {
                	var rectOpts = {
        			    strokeColor   : circleColor,
        			    strokeOpacity : 0.2,
        			    strokeWeight  : 1,
        			    fillColor     : circleColor,
        			    fillOpacity   : 0.2,
        			    map           : resultMap,
        			    bounds        : new google.maps.LatLngBounds(
        			         new google.maps.LatLng(details._rawLoaded.rectLeftLat, details._rawLoaded.rectLeftLon),
        			         new google.maps.LatLng(details._rawLoaded.rectRightLat, details._rawLoaded.rectRightLon)
        			      )
                	}
                	var rect = new gMaps.Rectangle(rectOpts);
                }
                
                google.maps.event.addListenerOnce(resultMap, 'idle', function(){if (resultMap.getZoom() > 18) resultMap.setZoom(18);});
                
//                var dot = new gMaps.Circle($.extend(circleOpts, {
//                    radius : 100
//                }));

//                var bounds = resultMap.getBounds();
//                console.log(bounds)
//                bounds.extend(details.circleCenter);
//                resultMap.fitBounds(bounds);
            }

            module.alertFilterSetup(function showFiltered(filterMoment) {
                $list.empty();
                uvo.showLoadingMessage();
                uvo.dataRequest("getGeofenceAlerts").done(function (geofenceAlerts) {
                    alerts = alerts || uTypes.collectionOf(uTypes.GeofenceAlertDetail, geofenceAlerts);
                    uvo.clearLoading();
                    var filteredAlerts = alerts.filter(function (details) {
                        return details.moment.isAfter(filterMoment);
                    });
                    
                    if (filteredAlerts.length == 0 && initPageLoad){ //Code added to adapt filter to 30 days if there is no alert for Today
                    	initPageLoad = false;
                    	$(".dropdown.button").text('LAST 30 DAYS');
                    	var filterMomentDefault = moment().subtract('days', 30).startOf('day');
                    	filteredAlerts = alerts.filter(function (details) {
                            return details.moment.isAfter(filterMomentDefault);
                        });
                    }

                    $(".delete-buttons .button.delete-selected").off('click').on('click', sendDelete.bind(this, alerts));
                    $(".delete-buttons .button.delete-all").off('click').on('click', sendDelete.bind(this, alerts, 'all'));

                    $.each(filteredAlerts, function (index, details) {
                        var $item = $baseItem.clone().removeClass('hide');
                        details.moment.minute(details.alertMin);
                        details.moment.hour(details.alertHour);

                        $(".month", $item).html(details.moment.format("MMM"));
                        $(".day", $item).html(details.moment.format("D"));
                        $(".year", $item).html(details.moment.format("YYYY"));
                        $(".indicator", $item).html(details.moment.format(timeStampFormat));
                        $(".row.link", $item).text(details.moment.format(infoFormat));
                        var fenceType = (details._rawLoaded.circleFenceType != 0) ? details._rawLoaded.circleFenceType :
                        	details._rawLoaded.rectFenceType;
                        $('.row.info', $item).html((fenceType==1) ? "Geo Fence On-Exit Alert" : "Geo Fence On-Entry Alert");
                        //$(".row.link", $item).text("Geo Fence #" + (+details.geoFenceId));
                        if (details.lat == 0 && details.lng == 0){
                        	$(".option.map", $item).removeClass("active");
                        	$(".option.map", $item).addClass("hide");
                        	$(".option.error", $item).removeClass("hide");
                        }
                        var messages = [details.moment.format("[Alert occurred at ]hh:mma"), ""];

                        var $mapBtn = $(".option.map", $item);
                        $mapBtn.click(toggleMap.bind($mapBtn, details, $item, messages));

                        $(".option.select", $item).click(selectAlertForDelete.bind($item, details));
                        $(".delete-item", $item).click(singleDelete.bind($item, details));

                        $list.append($item);
                    });

                    updateAlertCountMessage("Geofence", alerts.length, filteredAlerts.length);

                }).fail(function (xhr, status, error) {
                	uvo.clearLoading();
                    updateAlertCountMessage("Geofence", 0, 0);
                    if (status === "904" || status === "903") {
                        com.$hide($(".load-more"));
                    } else {
                        uvo.genericErrorHandler(xhr, status, error);
                    }
                    
                });
            });
        	});
        },
        initSpeedAlerts    : function initSpeedAlerts() {
        	earlyInit().done(function() {

            var $list = $(".alerts.widget-box");
            var $baseItem = $(".item.speed").remove();
            //format string for moment.js
            var infoFormat = "[<strong>]h:mm a[</strong>] on MMM D, YYYY";
            var $gmap = $("<div id='gmap'></div>");

            var alerts;
            var initPageLoad = true;

            module.alertFilterSetup(function showFiltered(filterMoment) {
                $list.empty();
                uvo.showLoadingMessage();
                uvo.dataRequest("getSpeedAlerts").done(function (speedAlerts) {
                    alerts = alerts || uTypes.collectionOf(uTypes.SpeedAlertDetail, speedAlerts);
                    uvo.clearLoading();
                    var filteredAlerts = alerts.filter(function (details) {
                        return details.moment.isAfter(filterMoment);
                    });

                    if (filteredAlerts.length == 0 && initPageLoad){ //Code added to adapt filter to 30 days if there is no alert for Today
                    	initPageLoad = false;
                    	$(".dropdown.button").text('LAST 30 DAYS');
                    	var filterMomentDefault = moment().subtract('days', 30).startOf('day');
                    	filteredAlerts = alerts.filter(function (details) {
                            return details.moment.isAfter(filterMomentDefault);
                        });
                    }

                    $(".delete-buttons .button.delete-selected").off('click').on('click', sendDelete.bind(this, alerts));
                    $(".delete-buttons .button.delete-all").off('click').on('click', sendDelete.bind(this, alerts, 'all'));

                    $.each(filteredAlerts, function (index, details) {
                        var $item = $baseItem.clone().removeClass('hide');

                        $(".indicator strong", $item).html(details.speed - details.alertSpeed);
                        details.moment.minute(details.alertMin);
                        details.moment.hour(details.alertHour);
                        $(".row.info", $item).html(details.moment.format(infoFormat));
                        if (details.lat == 0 && details.lng == 0){
                        	$(".option.map", $item).removeClass("active");
                        	$(".option.map", $item).addClass("hide");
                        	$(".option.error", $item).removeClass("hide");
                        }
                        var setString = "speed limit: ";
                        setString += details.speed + " mph, max speed ";
                        setString += details.alertSpeed + " mph";
                        $(".row.link", $item).text(setString);

                        var messages = [details.moment.format("[Alert occurred at ]hh:mma"), setString];

                        $(".option.map", $item).click(drawAlertMap.bind($item, details, $item, $gmap, messages));

                        $(".option.select", $item).click(selectAlertForDelete.bind($item, details));
                        $(".delete-item", $item).click(singleDelete.bind($item, details));

                        $list.append($item);
                    });

                    updateAlertCountMessage("Speed", alerts.length, filteredAlerts.length);

                }).fail(function (xhr, status, error) {
                	uvo.clearLoading();
                    updateAlertCountMessage("Speed", 0, 0);
                    if (status === "904" || status === "903") {
                        com.$hide($(".load-more"));
                    } else {
                        uvo.genericErrorHandler(xhr, status, error);
                    }
                });
            });
        	});
        }
    };
        //the below methods are for settings and not ready for use yet, please don't remove them though
        /*
        updateMyCarZoneSettingEnabled : function (which) {
            $.when(uvo.getVehicles()).done(function (vehicleData) {
                var typeCodes = {
                    "curfew"   : 0,
                    "geofence" : 2,
                    "speed"    : 3
                };

                var vin = vehicleData.selectedVin;

                uvo.showLoadingMessage();

                var $button = $('.enabled-switch');

                $.ajax("/ccw/kh/onOffAlert.do", {
                    type : "POST",
                    data : {"onOffAlertPayload" : JSON.stringify({
                        vin           : vin,
                        alertTypeCode : typeCodes[which],
                        active        : $button.hasClass("on") ? "N" : "Y"
                    })}
                }).done(function () {
                    $button.toggleClass("on off");
                    $button.text($button.hasClass("on") ? "ENABLED" : "DISABLED");
                    uvo.clearLoading();
                }).fail(uvo.genericErrorHandler);
            });
        },
        initCurfewSettings            : function initCurfewSettings() {

            function CurfewSetting(raw) {
                this.load(raw);
            }

            (function () {
                var vo = {
                    "curfewConfigId" : "",
                    "vin"            : "",
                    "curfewId"       : 1,
                    "startTime"      : "0000",
                    "endTime"        : "0000",
                    "startDay"       : "0", //0 = Sun to 6 = Sat
                    "endDay"         : "0",
                    "status"         : "update",
                    "curfewTime"     : "5",
                    "curfewTimeUom"  : "1"
                };
                CurfewSetting.prototype.load = loaderFactory(vo);
                CurfewSetting.prototype.startMoment = function () {
                    return moment(com.leadZeroes(this.startTime, 4), "HHmm");
                };
                CurfewSetting.prototype.endMoment = function () {
                    return moment(com.leadZeroes(this.endTime, 4), "HHmm");
                };
            }());

            var $hour1 = $(".hour-wrap");
            var $min1 = $(".minute-wrap");
            var $ampm1 = $(".am-pm-wrap");
            var $hour2 = $(".hour-wrap2");
            var $min2 = $(".minute-wrap2");
            var $ampm2 = $(".am-pm-wrap2");
            var $freq = $(".freq-wrap");

            $.when(uvo.data.getCurfewSettings).done(function (response) {
                var settingsReponse = new uTypes.CurfewSettingsResponse(response);

                var settings = settingsReponse.CurfewAlertList;

                console.log(settingsReponse);

                var enabled = response.Active === "Y";
                var $button = $('.enabled-switch').toggleClass("on", enabled);
                $button.toggleClass("off", !enabled).text(enabled ? "ENABLED" : "DISABLED");

                var loadedSettings = [];
                var i;
                for (i = 0; i < settings.length; i++) {
                    loadedSettings[i] = new CurfewSetting(settings[i]); //don't worry, this works.
                    if (i > 6) {
                        loadedSettings[i].status = "delete";
                    }
                }

                var primeSet = loadedSettings[0] = loadedSettings[0] || new CurfewSetting();
                var start = primeSet.startMoment();
                var end = primeSet.endMoment();

                $hour1.text(start.format("hh"));
                $min1.text(start.format("mm"));
                $ampm1.text(start.format("A"));
                $hour2.text(end.format("hh"));
                $min2.text(end.format("mm"));
                $ampm2.text(end.format("A"));

                $freq.text(primeSet.curfewTime);

                $(".save").click(function () {
                    $.when(uvo.data.getVehicles).done(function (vehiclesData) {
                        var setting;

                        var vin = vehiclesData.selectedVin;

                        var startStr = $([$hour1, $min1, $ampm1]).text();
                        var endStr = $([$hour2, $min2, $ampm2]).text();

                        var startTime = moment(startStr, "hhmmA").format("HHmm");
                        var endTime = moment(endStr, "hhmmA").format("HHmm");

                        var overnight = (parseInt(startTime) > parseInt(endTime));
                        var freq = parseInt($freq.text());

                        for (i = 0; i < 7; i++) {
                            setting = loadedSettings[i] = loadedSettings[i] || new CurfewSetting();
                            setting.startTime = startTime;
                            setting.endTime = endTime;
                            setting.startDay = i;
                            setting.endDay = (i + 1) % 7;
                            setting.curfewTime = freq;
                            setting.curfewTimeUom = 1;

                            if (!setting.curfewConfigId) {
                                setting.status = 'insert';
                                setting.vin = vin;
                            }
                        }

                        uvo.showLoadingMessage();

                        $.ajax("/ccw/kh/curfewAlertSettings.do", {
                            type : "POST",
                            data : {"curfewAlertPayload" : JSON.stringify(loadedSettings)}
                        }).done(function () {
                            uvo.clearLoading();
                        }).fail(uvo.genericErrorHandler);

                    });
                });

            });

            $('.enabled-switch').click(function () {
                module.updateMyCarZoneSettingEnabled("curfew");
            });

        },
        initSpeedSettings             : function initSpeedSettings() {

            function SpeedSetting(raw) {
                this.load(raw || {});
            }

            (function () {
                var vo = {
                    "speedConfigId" : "",
                    "speed"         : 45,
                    "speedUom"      : 1,
                    "speedTime"     : 5,
                    "speedTimeUom"  : 1,
                    "status"        : 'update'
                };
                SpeedSetting.prototype.load = loaderFactory(vo);
            }());

            var currentSetting = new SpeedSetting();

            $.when(uvo.data.getSpeedSettings).done(function (response) {

                var settings = response.SpeedAlertList;
                var enabled = response.Active === "Y";
                var $button = $('.enabled-switch').toggleClass("on", enabled);
                $button.toggleClass("off", !enabled).text(enabled ? "ENABLED" : "DISABLED");

                if (settings.length) {
                    currentSetting.load(settings[0]);
                } else {
                    currentSetting.speedConfigId = null;
                    currentSetting.status = 'insert';
                }

                $("#speed-drop .dropdown").text(currentSetting.speed + "mph");
                $("#freq-drop .dropdown").text(currentSetting.speedTime + " minutes");
            });

            $(".dropdown").click(function () {
                $(".dropdown-menu").not($(this).next(".dropdown-menu").toggle()).hide();
            });

            $(".dropdown-menu li").on('click', function () {
                var $this = $(this);
                $this.parent().hide().prev(".dropdown").text($this.text());
            });

            // close dropdowns if user hits escape
            $(document).keyup(function (e) {
                if (e.which === 27) { // esc keycode
                    $(".dropdown-menu").hide();
                }
            });

            $('.enabled-switch').click(function () {
                module.updateMyCarZoneSettingEnabled("speed");
            });

            $(".save").click(function () {
                doSave();
            });

            function doSave() {
                $.when(uvo.data.getVehicles).done(function (vehiclesData) {

                    var speed = parseInt($("#speed-drop").children(".dropdown").text());
                    var freq = parseInt($("#freq-drop").children(".dropdown").text());

                    currentSetting.vin = vehiclesData.selectedVin;
                    currentSetting.speed = speed;
                    currentSetting.speedTime = freq;
                    currentSetting.speedTimeUom = 1;
                    currentSetting.speedUom = 1;

                    uvo.showLoadingMessage();

                    $.ajax("/ccw/kh/speedLimitAlertSettings.do", {
                        type : "POST",
                        data : {"speedLimitAlertPayload" : JSON.stringify(currentSetting)}
                    }).done(function () {
                        uvo.clearLoading();
                    }).fail(uvo.genericErrorHandler);
                });
            }

        },
        initGeofenceSettings          : function initGeofenceSettings() {
            $(".dropdown").on('click', function () {
                $(".dropdown-menu").not($(this).next(".dropdown-menu").toggle()).hide();
            });

            $(".dropdown-menu li").on('click', function () {
                var $this = $(this);
                $this.parent().hide().prev(".dropdown").text($this.text());
            });

            function GeoFenceAlertSetting(raw) {
                if (raw) {
                    this.load(raw);
                }
            }

            (function () {
                var props = {
                    "geoFenceConfigId" : "",
                    "vin"              : "",
                    "geoFenceId"       : "1",
                    "active"           : "Y",
                    "geoFenceTime"     : 5,
                    "geoFenceTimeUom"  : 1,
                    "rectLeftLat"      : "0",
                    "rectLeftLon"      : "0",
                    "rectLeftAlt"      : "0",
                    "rectLeftType"     : "0",
                    "rectRightLat"     : "0",
                    "rectRightLon"     : "0",
                    "rectRightAlt"     : "0",
                    "rectRightType"    : "0",
                    "rectFenceType"    : "0",
                    "circleCenterLat"  : "0",
                    "circleCenterLon"  : "0",
                    "circleCenterAlt"  : "0",
                    "circleCenterType" : "0",
                    "radius"           : "2",
                    "radiusUom"        : 3,
                    "circleFenceType"  : "",
                    "status"           : ""
                };

                GeoFenceAlertSetting.prototype.load = loaderFactory(props);
            }());

            var currSetting = new GeoFenceAlertSetting();
            var $addrBox = $(".geo-address");
            var haveLocation;
            var locationStale = true;
            var autocompleteTimeout;

            var fenceTypeEnum = {
                "1" : "out of",
                "2" : "in"
            };

            $.when(uvo.data.getGeoFenceSettings).done(function (response) {

                var settings = response.GeoFenceAlertList;
                var enabled = response.Active === "Y";
                var $button = $('.enabled-switch').toggleClass("on", enabled);
                $button.toggleClass("off", !enabled).text(enabled ? "ENABLED" : "DISABLED");

                currSetting.load(settings[0]);
                var lat = currSetting.circleCenterLat;
                var lng = currSetting.circleCenterLon;

                var getAddr = com.makeReverseGeocodeRequest(lat, lng);
                getAddr.done(function (geocodeResult) {
                    $addrBox.val(geocodeResult[0].formatted_address);
                    locate();
                });

                $("#mile-drop").children(".button").text(currSetting.radius + " mile");
                $("#geo-drop").children(".button").text(fenceTypeEnum[currSetting.circleFenceType] || "out of");
                $("#freq-drop").children(".button").text(currSetting.geoFenceTime + " minutes");
            });

            $addrBox.blur(function () {
                autocompleteTimeout = setTimeout(function () {
                    locate();
                }, 2000);
            });

            $addrBox.on('focus change keypress', function () {
                clearTimeout(autocompleteTimeout);
            });

            $addrBox.on('keyup', function (ev) {
                if (ev.which === 13) {
                    locate();
                } else {
                    locationStale = true;
                }
            });

            function locate() {
                clearTimeout(autocompleteTimeout);
                //no need to search if the content of the search box hasn't changed.
                if (!locationStale) {
                    return haveLocation;
                }

                locationStale = false;

                var search = $.trim($addrBox.val());

                haveLocation = new $.Deferred();

                $.when(com.makeGeocodeRequest(search)).done(function (results) {
                    if (results.length === 1) {
                        haveLocation.resolve(results[0]);
                    } else {
                        haveLocation.reject();
                    }
                });

                haveLocation.done(function (result) {
                    $addrBox.val(result.formatted_address);
                });

                return haveLocation;
            }

            $('.enabled-switch').click(function () {
                module.updateMyCarZoneSettingEnabled("geofence");
            });

            $(".save").click(function () {
                $.when(locate()).done(function (result) {
                    $.when(uvo.data.getVehicles).done(function (vehiclesData) {

                        var updSettings = new GeoFenceAlertSetting(currSetting);
                        var fenceType = $("#geo-drop").children(".dropdown").text() === "in" ? 2 : 1;

                        $.extend(updSettings, {
                            "geoFenceTime"     : parseInt($("#freq-drop").children(".dropdown").text()),
                            "geoFenceTimeUom"  : 1,
                            "rectLeftLat"      : "0",
                            "rectLeftLon"      : "0",
                            "rectLeftAlt"      : "0",
                            "rectLeftType"     : "0",
                            "rectRightLat"     : "0",
                            "rectRightLon"     : "0",
                            "rectRightAlt"     : "0",
                            "rectRightType"    : "0",
                            "rectFenceType"    : "0",
                            "circleCenterLat"  : result.geometry.location.lat(),
                            "circleCenterLon"  : result.geometry.location.lng(),
                            "circleCenterAlt"  : "0",
                            "circleCenterType" : 0,
                            "radius"           : parseInt($("#mile-drop").children(".dropdown").text()),
                            "radiusUom"        : 3,
                            "circleFenceType"  : fenceType,
                            "status"           : currSetting.geoFenceConfigId ? "update" : "insert"
                        });

                        updSettings.vin = vehiclesData.selectedVin;

                        uvo.showLoadingMessage();

                        $.ajax("/ccw/kh/geoFenceAlertSettings.do", {
                            type : "POST",
                            data : {"geoFenceAlertPayload" : JSON.stringify([updSettings])}
                        }).done(function () {
                            uvo.clearLoading();
                        }).fail(uvo.genericErrorHandler);
                    });
                });
            });
        }
        */


    uvo.setModuleReady("carZone", module);
}(window.uvo));