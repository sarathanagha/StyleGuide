(function (uvo) {
    if (!uvo) {
        throw new Error("Make sure you include KH libraries after uvo, not before!");
    }
    
    // determine data request route for kh/non-kh
    var urlparam = window.location.search.replace('?','').split('=');
    var isK900 = (urlparam[1] == 'kh');
    var tripEndpt = (isK900) ? "/ccw/kh/tripsDetail.do" : "/ccw/cp/tripInfoDetail.do";
    uvo.addEarlyInit([
                      uvo.simpleRouteFactory("getTripInfo", tripEndpt, (/tripsOverview/i)),
                  ]);
    
    
    var gMaps = (window.google && window.google.maps), com = uvo.common, uTypes = uvo.dataTypes, khData = uvo.data, genericErrHandler = uvo.genericErrorHandler;
    var modal;
	var tripArray = [];
    var momentWithFormat = function withFormat(formatStr) {
        var fn = moment;
        if (typeof formatStr === 'string') {
            fn = function (val) {
                return moment(val, formatStr);
            };
        }
        return fn;
    };


    uTypes.TripInfoDetail = (function () {
        var Model = uTypes.Model;
        function TripInfoDetail() {
            Model.apply(this, arguments);
            this.startPos = new gMaps.LatLng(this.strtLat, this.strtLong);
            this.endPos = new gMaps.LatLng(this.stopLat, this.stopLong);
            this.year = this.strtTime.year();
            this.month = this.strtTime.month();
            return this;
        }

        //see uvo-data.js for other examples of model contructors;
        //moment.js is the library used for date-time stuff
        Model.make(TripInfoDetail, {
            /*  propertyName    : {names : ["rwPrptyNm"], type : String}, */

            /*trscId          : {names : ["trscId"], type : String},
            strtTime        : {names : ["strtTime"], type : moment},
            strtTimeInSec   : {names : ["strtTimeInSec"], type : Number},
            totalDriveTime  : {names : ["totalDriveTime"], type : Number},
            aveSpeed        : {names : ["aveSpeed"], type : Number},
            strtLat         : {names : ["strtLat"], type : Number},
            strtLong        : {names : ["strtLong"], type : Number},
            stopLat         : {names : ["stopLat"], type : Number},
            stopLong        : {names : ["stopLong"], type : Number},
            totalTravelDist : {names : ["totalTravelDist"], type : Number},
            strtYr          : {
                names : ["strtTime"],
                type  : momentWithFormat("YYYY")
            },
            strtMnth        : {
                names : ["strtTime"],
                type  : momentWithFormat("MMM")
            }*/
            /**
             * aveSpeed: 0
             curfewCount: 1
             day: 31
             drivingDetailId: 501e
             ndLat: 42.270536e
             ndLong: -83.745369
             geoFenceCount: 2
             journeyId: 0
             milesDriven: 3120
             month: 8
             numAwards: 4
             secondsDriven: 120
             speedCount: 3
             startLat: 42.270536
             startLong: -83.625369
             tag: nulltripCategory: 0
             vin: "KNALW4D44E6014288"
             year: 2014
             *
             */
            trscId          : {names : ["drivingDetailId"], type : String},
            strtTime        : {names : ["strtTime"], type : moment},
            strtTimeInSec   : {names : ["strtTimeInSec"], type : Number},
            totalDriveTime  : {names : ["hoursDriven"], type : Number},
            aveSpeed        : {names : ["aveSpeed"], type : Number},
            strtLat         : {names : ["startLat"], type : Number},
            strtLong        : {names : ["startLong"], type : Number},
            stopLat         : {names : ["endLat"], type : Number},
            stopLong        : {names : ["endLong"], type : Number},
            totalTravelDist : {names : ["milesDriven"], type : Number},
            curfewCount		: {names : ['curfewCount'], type : Number},
            geoFenceCount	: {names : ['geoFenceCount'], type : Number},
            speedCount		: {names : ['speedCount'], type : Number},
            numAwards		: {names : ['numAwards'], type : Number},
            strtYr          : {names : ["year"], type  : Number},
            strtMnth        : {names : ["month"], type  : Number },
            strtYr          : {
                names : ["strtTime"],
                type  : momentWithFormat("YYYY")
            },
            strtMnth        : {
                names : ["strtTime"],
                type  : momentWithFormat("MMM")
            }
        });
        return TripInfoDetail;
    }());


    var $infoContent;
    var InfoWin = new gMaps.InfoWindow({
        pixelOffset : new gMaps.Size(135, 40, "px", "px")
    });
    
    function showMarkerMessage(map, position, body) {
        InfoWin.close();
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

    function drawTripMapNonKh(details, $item, $gmap) {
        
        var maptimeStampFormat = "[START DRIVING ]hh[:]mm[ ]A";
        var $mapBtn = $(".option.map", $item).toggleClass("active");
        $mapBtn.children("span").text("HIDE DETAIL");

        $(".option.map").not($mapBtn).removeClass("active");
        $(".option.map:not(.active) > span").text("VIEW DETAIL");

        var $map = $(".img-container", $item).toggleClass("active");        
        $(".img-container").not($map).removeClass("active");
        
        $('.trip-subject, .widgets-blade .col2, .button.edit-btn', $map).addClass('hide');
        
       /* if (details.mileage==null){
        $(".widget.mileage .title", $item).html("Starting Mileage");                 
        }      */
       
        //$(".widget.mileage .value", $item).html((details.mileage || details.totalTravelDist) + " <sub>mi</sub>");
        $(".widget.mileage .value", $item).html(details.mileage + " <sub>mi</sub>");
        //console.log('time', details.totalDriveTime)
        var mmnt = moment.duration(details.totalDriveTime, 'seconds'); 
        var hrs = mmnt.hours();
        var mins = mmnt.minutes();
        //console.log('hrs', hrs, 'mins', mins)
//        $(".widget.driving .value", $item).html((details.totalDriveTime / 60 / 60).toFixed(2) + " <sub>hrs</sub>");
        $(".widget.driving .value", $item).html(hrs + " <sub>hrs</sub> " + mins + " <sub>mins</sub>");
        $(".widget.speed .value", $item).html(details.aveSpeed + " <sub>mph</sub>");
        $(".map.actions", $item).append($gmap);

        var mapOptions = new com.MapOptions({center : details.startPos});
        var resultMap = new gMaps.Map($gmap.get(0), mapOptions);

        var startMark = new gMaps.Marker({
            map      : resultMap,
            position : details.startPos,
            icon     : '/ccw/images/MyCarZone/marker_blue_start.png',
            zIndex   : 90
        });

        var endMark = new gMaps.Marker({
            map      : resultMap,
            position : details.endPos,
            icon     : '/ccw/images/MyCarZone/marker_blue_end.png',
            zIndex   : 80
        });

        var bounds = new gMaps.LatLngBounds();
        bounds.extend(details.startPos);
        bounds.extend(details.endPos);

        resultMap.fitBounds(bounds);

        $.when(com.makeReverseGeocodeRequest(details.strtLat, details.strtLong)).always(function (results) {
                //console.log("start results", results)
                var startBody = results[0].formatted_address ? com.formatGoogleMapsAddress(results[0].formatted_address) : "Unable to find address";
                gMaps.event.addListener(startMark, 'click', function() {
                showMarkerMessage(resultMap, details.startPos, startBody);
            });
        });


        $.when(com.makeReverseGeocodeRequest(details.stopLat, details.stopLong)).always(function (results) {
                //console.log("end results", results)
                var stopBody = results[0].formatted_address ? com.formatGoogleMapsAddress(results[0].formatted_address) : "Unable to find address";
                gMaps.event.addListener(endMark, 'click', function() {
                showMarkerMessage(resultMap, details.endPos, stopBody);
            });
        });

        return resultMap;
    }
    
    function drawTripMap(details, firstLastTripsObj, $item, $gmap) {
    	//to reset the view 
    	$('.poi-dialog', $item).addClass('hide');
    	$('.poi-container', $item).removeClass('hide');
    	//$('.tagErrorAlphaNumaric').css('visibility','hidden');
    	
    	var maptimeStampFormat = "[START DRIVING ]hh[:]mm[ ]A";
        //var $mapBtn = $(".option.map", $item).toggleClass("active");
    	
        //$mapBtn.children("span").text("HIDE DETAIL");
        
        if(details._rawLoaded.tripCategory !== 0){
            $('.personal', $item).removeClass('active');
            $('.business', $item).addClass('active');
        }
        //$(".option.map").not($mapBtn).removeClass("active");
        //$(".option.map:not(.active) > span").text("VIEW DETAIL");
    	
        $('.time-text', $item).html(details.curfewCount);
        $('.speed-text', $item).html(details.speedCount);
        $('.poi-text', $item).html(details.geoFenceCount);
        $('.awards-value', $item).html(details.numAwards);
        
        
        $('.time').on('mouseover', function(){
        	$('.curfew-alert').css('display','block');
        	$('.sped-alert').css('display','none');
        	$('.gew-fence-alert').css('display','none');
        })
        $('.speed').on('mouseover', function(){
        	$('.sped-alert').css('display','block');
        	$('.curfew-alert').css('display','none');
        	$('.gew-fence-alert').css('display','none');
        })
        $('.geoFence').on('mouseover', function(){
        	$('.gew-fence-alert').css('display','block');
        	$('.curfew-alert').css('display','none');
        	$('.sped-alert').css('display','none');
        })
        $('.col1').on('mouseover', function(){
        	$('.curfew-alert').css('display','none');
        	$('.sped-alert').css('display','none');
        	$('.gew-fence-alert').css('display','none');
        })
        $('.map').on('mouseover', function(){
        	$('.curfew-alert').css('display','none');
        	$('.sped-alert').css('display','none');
        	$('.gew-fence-alert').css('display','none');
        })
                	
        
        var $map = $(".img-container", $item).toggleClass("active");
        $(".img-container").not($map).removeClass("active");
        
        if (details.mileage==null){
        $(".widget.mileage .title", $item).html("MILES"); 	
        }
        
        var start_time = new Date(0);
        start_time.setUTCSeconds(details._rawLoaded.startDtTime/1000);
        
        var end_time = new Date(0);
        end_time.setUTCSeconds(details._rawLoaded.endDtTime/1000);

        $(".widget.mileage .value", $item).html(details.totalTravelDist.toFixed(1) + " <sub>mi</sub>");
        var mmnt = moment.duration(details.totalDriveTime, 'hours');
        var hrs = mmnt.hours();
        var mins = mmnt.minutes();
        var secs = mmnt.seconds();
        //        $(".widget.driving .value", $item).html((details.totalDriveTime / 60 / 60).toFixed(2) + " <sub>hrs</sub>");
        $(".widget.driving .range", $item).html(moment(start_time).format("hh:mm a") + " to " + moment(end_time).format("hh:mm a"));
        $(".widget.driving .value", $item).html(hrs + " <sub>hour</sub>, " + mins + " <sub>minues</sub><sub> and</sub> " + secs + " <sub>seconds</sub>");
        $(".widget.speed .value", $item).html(Math.round(details.totalTravelDist/details.totalDriveTime) + " <sub>mph</sub>");
        $(".map.actions", $item).append($gmap);

        var mapOptions = new com.MapOptions({center : details.startPos});
        var resultMap = new gMaps.Map($gmap.get(0), mapOptions);

        var startMark = new gMaps.Marker({
            map      : resultMap,
            position : details.startPos,
            icon     : '/ccw/images/MyCarZone/marker_green_driving_start.png',
            zIndex   : 90
        });

        var endMark = new gMaps.Marker({
            map      : resultMap,
            position : details.endPos,
            icon     : '/ccw/images/MyCarZone/marker_blue_end.png',
            zIndex   : 80
        });

        var bounds = new gMaps.LatLngBounds();
        bounds.extend(details.startPos);
        bounds.extend(details.endPos);

        resultMap.fitBounds(bounds);
        
        if(details._rawLoaded.journeyId == 0){
        $.when(com.makeReverseGeocodeRequest(details.strtLat, details.strtLong)).always(function (results) {
            var d = new Date(0);
            d.setUTCSeconds(details._rawLoaded.startDtTime/1000);
            var startBody = results[0].formatted_address ? formatDate(d)+"</br>"+com.formatGoogleMapsAddress(results[0].formatted_address) : formatDate(d)+"</br>"+"Unable to find address";
            gMaps.event.addListener(startMark, 'click', function() {
                showMarkerMessage(resultMap, details.startPos, startBody);
            });
        });

        $.when(com.makeReverseGeocodeRequest(details.stopLat, details.stopLong)).always(function (results) {
        	 var d = new Date(0);
             d.setUTCSeconds(details._rawLoaded.endDtTime/1000);
            var stopBody = results[0].formatted_address ? formatDate(d)+"</br>"+com.formatGoogleMapsAddress(results[0].formatted_address) : formatDate(d)+"</br>"+"Unable to find address";
            gMaps.event.addListener(endMark, 'click', function() {
                showMarkerMessage(resultMap, details.endPos, stopBody);
            });
        });
        
        } else {
        	$.each(firstLastTripsObj, function(i, n){
        	if(details._rawLoaded.journeyId == n.tripJourneyId){
        	 $.when(com.makeReverseGeocodeRequest(n.startLat, n.startLong)).always(function (results) {
                 var d = new Date(0);
                 d.setUTCSeconds(n.startTime/1000);
                 var startBody = results[0].formatted_address ? formatDate(d)+"</br>"+com.formatGoogleMapsAddress(results[0].formatted_address) : formatDate(d)+"</br>"+"Unable to find address";
                 gMaps.event.addListener(startMark, 'click', function() {
                     showMarkerMessage(resultMap, details.startPos, startBody);
                 });
             });
        		
             $.when(com.makeReverseGeocodeRequest(n.endLat, n.endLong)).always(function (results) {
             	 var d = new Date(0);
                  d.setUTCSeconds(n.endTime/1000);
                 var stopBody = results[0].formatted_address ? formatDate(d)+"</br>"+com.formatGoogleMapsAddress(results[0].formatted_address) : formatDate(d)+"</br>"+"Unable to find address";
                 gMaps.event.addListener(endMark, 'click', function() {
                     showMarkerMessage(resultMap, details.endPos, stopBody);
                 });
             });
        	
        	}
        	});
        }
        return resultMap;
    }
    
    function parseJourneys(monthTrips) {
    	var journeys = [];
		var idx = 0;
		var endMonth = 1, endDay = 1;
		var parseNum = 0;
    	$.each(monthTrips, function(i, n){
    		var id = n._rawLoaded.journeyId || 0;
    		if (id != 0) {    			
    			if (typeof journeys[idx] == 'undefined' || journeys[idx]._rawLoaded.journeyId != id) {
    				journeys[i-parseNum] = n;
    				journeys[i-parseNum].tags = n._rawLoaded.tag;
    				journeys[i-parseNum].endMonth = endMonth = n._rawLoaded.month;
    				journeys[i-parseNum].endDay = endDay = n._rawLoaded.day;
    				journeys[i-parseNum].startMonth = n._rawLoaded.month;
    				journeys[i-parseNum].startDay = n._rawLoaded.day;
    				idx = i-parseNum;
    			} else {
    				if(parseNum == 0){
    					journeys[idx-parseNum].endMonth = endMonth;
        				journeys[idx-parseNum].endDay = endDay;
        				journeys[idx-parseNum].startMonth = n._rawLoaded.month;
        				journeys[idx-parseNum].startDay = n._rawLoaded.day;
        				journeys[idx-parseNum].stopLat = n.stopLat;
        				journeys[idx-parseNum].stopLong = n.stopLong;
        				journeys[idx-parseNum].totalDriveTime += n._rawLoaded.hoursDriven;
        				journeys[idx-parseNum].totalTravelDist += n.totalTravelDist;
        				journeys[idx-parseNum].curfewCount += n._rawLoaded.curfewCount;
        				journeys[idx-parseNum].geoFenceCount += n._rawLoaded.geoFenceCount;
        				journeys[idx-parseNum].speedCount += n._rawLoaded.speedCount;
        				journeys[idx-parseNum].numAwards += n._rawLoaded.numAwards;
        				if (journeys[idx-parseNum].tags != '') {
        					journeys[idx-parseNum].tags += ','+n._rawLoaded.tag;
        				} else {
        					journeys[idx-parseNum].tags = n._rawLoaded.tag;
        				}
    				} else {
    					journeys[idx].endMonth = endMonth;
        				journeys[idx].endDay = endDay;
        				journeys[idx].startMonth = n._rawLoaded.month;
        				journeys[idx].startDay = n._rawLoaded.day;
        				journeys[idx].stopLat = n.stopLat;
        				journeys[idx].stopLong = n.stopLong;
        				journeys[idx].totalDriveTime += n._rawLoaded.hoursDriven;
        				journeys[idx].totalTravelDist += n.totalTravelDist;
        				journeys[idx].curfewCount += n._rawLoaded.curfewCount;
        				journeys[idx].geoFenceCount += n._rawLoaded.geoFenceCount;
        				journeys[idx].speedCount += n._rawLoaded.speedCount;
        				journeys[idx].numAwards += n._rawLoaded.numAwards;
        				if (journeys[idx].tags != '') {
        					journeys[idx].tags += ','+n._rawLoaded.tag;
        				} else {
        					journeys[idx].tags = n._rawLoaded.tag;
        				}
    				}
    				
    				parseNum++;
    			}
    			
    		} else {
    			// single leg trip
    			journeys.push(n);
    			idx = i;
    		}
    	});
    	return journeys;
    }
    
    
    function firstLastTrips(unqJrnyIds, journeys) {
    	
    	var firstLastTrips = [];
    	$.each(unqJrnyIds, function(i, n){
    		var firstLastTripsObj = {};
    		$.each(journeys, function(j, m){
    			if(typeof m != 'undefined'){
    			if(n == m._rawLoaded.journeyId){
    				firstLastTripsObj.tripJourneyId = m._rawLoaded.journeyId;
    				firstLastTripsObj.firstTripId = firstLastTripsObj.firstTripId ? (m._rawLoaded.drivingDetailId > firstLastTripsObj.firstTripId ? m._rawLoaded.drivingDetailId : firstLastTripsObj.firstTripId) : m._rawLoaded.drivingDetailId ;
    				firstLastTripsObj.lastTripId = firstLastTripsObj.lastTripId ? (m._rawLoaded.drivingDetailId < firstLastTripsObj.lastTripId ? m._rawLoaded.drivingDetailId : firstLastTripsObj.lastTripId) : m._rawLoaded.drivingDetailId ;
    			}
    			if(firstLastTripsObj.lastTripId == m._rawLoaded.drivingDetailId){
    				firstLastTripsObj.startLat = m.stopLat;
    				firstLastTripsObj.startLong = m.stopLong;	
    				firstLastTripsObj.startTime = m._rawLoaded.startDtTime;
    			}
    			if(firstLastTripsObj.firstTripId == m._rawLoaded.drivingDetailId){
    				firstLastTripsObj.endLat = m.strtLat;
    				firstLastTripsObj.endLong = m.strtLong;	
    				firstLastTripsObj.endTime = m._rawLoaded.endDtTime;
    			}
    		}    			
    			});
    		//._rawLoaded.endDtTime._rawLoaded.startDtTime
    		firstLastTrips.push(firstLastTripsObj);
    	});

    	return firstLastTrips;
    }
	
    
    function journeyIds(monthTrips) {
    	var journeys = [];

    	$.each(monthTrips, function(i, n){
    		if (n._rawLoaded.journeyId != 0) {
    			journeys.push(n._rawLoaded.journeyId);
    		} 
    	});
    	return journeys;
    }

    function lengthOfArray(journeys) {
    	var len = 0;
    	$.each(journeys, function(i, n){
    		if(typeof journeys[i] != 'undefined'){    		
    			len++;
    	}
    	});
    	return len;
    }


    function updateTripMsg(total, shown) {
        var tripMsg = "<strong>%S</strong> TOTAL TRIPS / <strong>%N</strong> TRIPS DISPLAYED";

        tripMsg = tripMsg.replace("%S", total);
        tripMsg = tripMsg.replace("%N", shown);

        $(".alert-msj").html(tripMsg);
    }

    function noTripsInfo() {
        var tripMsg = "There are no recorded trips available for this vehicle at this point of time.";
        $(".item.trip-item:not(:first)").remove();
        $(".alert-msg").text(tripMsg).removeClass('hide');
    }
    
    function noSearchTrips(el){
        var tripMsg = "There are no recorded trips available for this vehicle that match your search.";
        $(".item.trip-item:not(:first)").remove();
        $(".alert-msg").text(tripMsg).removeClass('hide');
    }

    function activateManage() {
    	$(".alert-menu").addClass("hide").removeClass("show");
    	$('.option.merge').removeClass('hide');
    	$('.option.map').addClass('hide');
    	$(".merge-buttons .button").addClass('inactive');
    }

    function deactivateManage() {      	
        $(".alert-menu").addClass("show").removeClass("hide");
    	$('.option.map').removeClass('hide');
    	$('.option.merge').addClass('hide');
    	// save results
    }

    function prompt(msg, pers, bus) {
        modal.open();
        $(".message", modal.$dom).html(msg);
        $(".personal", modal.$dom).off('click').on('click', pers);
        $(".business", modal.$dom).off('click').on('click', bus);
    }
    
    
    function mergeTrips() {
    	if ( !$(".merge-buttons .button:first").hasClass('inactive')){
	    	var tripsIdsToMerge = [];
	    	var payload = [];
	    	$('.trip-item:not(:first)').each(function(index){
	    		if ($('.radio', this).hasClass('active')){
	    			tripsIdsToMerge.push(parseInt($('.tripId', this).val()));
	    		}
	    	});

	    	var tags = [];
	    	$.each(tripArray, function(index, value){
	    		if ($.inArray(value.drivingDetailId, tripsIdsToMerge) !== -1) {
	    			delete value.strtTime;
	    			delete value.strtTimeInSec;
	    			//var partialTags = value.tags.split(',');
	    			//$.extend(tags, partialTags);
	    			payload.push(value);
	    		}
	    	});
	    	
	    	var personal = payload.filter(function(val){
	    		return val.tripCategory == 0;
	    	})
	    	var business = payload.filter(function(val){
	    		return val.tripCategory == 1;
	    	})
	    	if (personal.length > 0 && business.length > 0) {
	    		prompt('Select trips are Personal and Business. What type of trip would you like to merge together', function(){
	    			$('.trip-subject-title.business').parents('.trip-item').find('.radio').removeClass('active');
	    			modal.close();
	    		}, function(){
	    			$('.trip-subject-title.personal').parents('.trip-item').find('.radio').removeClass('active');
	    			modal.close();
	    		});
	    	} else {
	        	
	            uvo.showLoadingMessage();
	            $.ajax({
	            	url: '/ccw/kh/mergeTrips.do',
	            	dataType : 'json',
	            	method: 'POST',
	            	data: {'trips' : JSON.stringify(payload)}
	            }).done(function(){
	            	uvo.refreshPage();            	
	            }).fail(function(){
	            	
	            }).always(function(){
	            	uvo.clearLoading();
	            	//uvo.refreshPage();
	            });
	    		
	    	}
    	}
    }
            
    function unMergeTrips() {
    	if ( !$(".merge-buttons .button:eq(1)").hasClass('inactive')){
        
        	var tripsIdsToUnMerge = [];
	    	var payload = [];
	    	$('.trip-item:not(:first)').each(function(index){
	    		if ($('.radio', this).hasClass('active')){
	    			tripsIdsToUnMerge.push(parseInt($('.tripId', this).val()));
	    		}
	    	});
	
	    	$.each(tripArray, function(index, value){
	    		if ($.inArray(value.drivingDetailId, tripsIdsToUnMerge) !== -1) {
	    			payload = value.journeyId;
	    		}
	    	});
	    	
	        uvo.showLoadingMessage();
	        $.ajax({
	        	url: '/ccw/kh/unMergeTrips.do',
	        	dataType : 'json',
	        	method: 'POST',
	        	data: {'trips' : payload}
	        }).done(function(){
	        	uvo.refreshPage();
	        }).fail(function(){
	        	
	        }).always(function(){
	        	uvo.clearLoading();
	        });							
    	}
    }
            
    $(document).ready(function () {
        $infoContent = $(".mcz-info-window").removeClass("hide").remove();
        $("a.close", $infoContent).click(function () {
            InfoWin.close();
        });
        $('#search-tags').on('keyup', function(e){
        	if (e.which === 13) {
        		module.search(this);
        	}
        });
    	$('.close-search').on('click', function(){
    		$('#search-tags').val('');
    		$(this).addClass('hide');
    		module.init();
    	});
        $(".manage-buttons .button:last").click(activateManage);
        $(".manage-buttons .button:last").click(function(){
        	if ($('.radio.active').length > 1) {
				$(".merge-buttons .button:first").removeClass('inactive');
			}
        });
        $(".merge-buttons .button:last").click(deactivateManage);
        $(".merge-buttons .button:first").click(mergeTrips);
        $(".merge-buttons .button:eq(1)").click(unMergeTrips);
        modal = new com.Modal(".notification-delete");
        
    });

    var module = {};
    
    module.search = function test(data) {
    	$('.close-search').removeClass('hide');
    	module.init(data.value);
    };

    module.init = function init(search) {
        var $list = $(".alerts.widget-box");
        var $baseItem = $(".item.trip-item").first().clone();
        $baseItem.removeClass('hide');

        var $gmap = $('<div id="gmap"></div>');
        //format string for moment.js
        var timeStampFormat = "[<sub class='month'>]MMM[</sub>][<strong class='day'>]D[</strong>]";
        var trips;
        
        var $calendar = $(".tripinfo-calendar").empty();
        //var monthBtnFormat = '<li><a></a></li>';
        
        if (!isK900) filterNonKhTripComponents();
        
        function filterNonKhTripComponents() {
        	$('.subject.trip-subject-title, .tags.tags-title-list-container', $baseItem).addClass('hide');
        	$('.manage-buttons.actions').addClass('hide');
        }

        function closeAllMaps() {
            $gmap.remove();
            $(".option.map > span").text("VIEW DETAIL");
            $(".option.map").removeClass("active");
            $(".img-container").removeClass("active");
        }


        function monthClicked($monthList, monthTrips) {
        	deactivateManage();
            closeAllMaps();
            var $this = $(this);
            var $yearBtn = $monthList.prev();
            $(".button", $calendar).not($yearBtn).removeClass("highlighted");
            $yearBtn.addClass("highlighted");
            $(".dropdown-menu", $calendar).not($monthList).addClass("hide");
            $monthList.removeClass("hide");
            $this.addClass("selected");
            $(".selected", $calendar).not($this).removeClass("selected");

            if (isK900) {
	            //$list.empty();
	            $(".item.trip-item:not(:first)").remove();
	            var journeys =  parseJourneys(monthTrips);
	            //For Total Trips
	            var journeyWithIds =  journeyIds(trips);
	            var journeyWithIdsL = journeyWithIds.length;
	            var uniqJrnyIdsL = $.unique(journeyWithIds).length;
	           //For Month Trips
	            var monthJrnyWithIds =  journeyIds(monthTrips);
	            var monthJrnyWithIdsL = monthJrnyWithIds.length;
	            var uniqMonthJrnyIdsL = $.unique(monthJrnyWithIds).length;
	            var firstLastTripsObj = firstLastTrips($.unique(journeyWithIds), monthTrips);

	            $.each(journeys, function (index, details) {
	            	var start_time = new Date(0);
	                start_time.setUTCSeconds(details._rawLoaded.startDtTime/1000);
	                
	                var end_time = new Date(0);
	                end_time.setUTCSeconds(details._rawLoaded.endDtTime/1000);
	                
	                var mmnt = moment.duration(details.totalDriveTime, 'hours');
	                var hrs = mmnt.hours();
	                var mins = mmnt.minutes();
	                var secs = mmnt.seconds();
	            	
	            	if (typeof details !== 'undefined') {
		            	var $item = $baseItem.clone();

		            	$(".content.nonKh, .option.map", $item).addClass('hide');
		                	
		            	if (details._rawLoaded.journeyId != 0) {
		            		$item.addClass('merged');
		            	}
		            	var hangul = new RegExp("^[a-zA-Z0-9\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]*$");
		            	var $tagging =$('.tagging-input', $item);
	                	var validTags = "";
	                	
	                	if(details._rawLoaded.tag != null){
		                	var items = details._rawLoaded.tag.split(",");
		                	$(".tags-title-list-container", $item).empty();
		                	for (it in items) {
		                		var tag = items[it];
		                		
		                		$("<li class='tag-title-heading'>" + tag + "</li>").appendTo($(".tags-title-list-container", $item));
		                		if ((tag.length <= 25) && hangul.test(tag)) {
		                			if (validTags.length !== 0) {
		                				validTags += ",";
		                			}
		                			validTags += tag;
		                		}
		                	}
	                	}
	                	
	                	if (validTags !== "") {
	                		$tagging.val(validTags);
	                	}
		            	if ($(".alert-menu").hasClass('hide')){
		                	$('.option.merge', $item).removeClass('hide');
		                	$('.option.map', $item).addClass('hide');
		            		
		            	}
		                
		            	$(".trip-time", $item).html(moment(start_time).format("hh:mm a") + " to " + moment(end_time).format("hh:mm a") + "<br><span>" + hrs + " hours, " + mins + " minues and " + secs + " seconds</span>");

		            	//if(details._rawLoaded.journeyId == 0){
		            	if((details.startDay == details.endDay) && (details.startMonth == details.endMonth)){
		                	$(".indicator", $item).html(details.strtTime.format(timeStampFormat));
		                }
		                else {
		                	$(".indicator .month", $item).html(moment(details.startMonth).format("MMM"));
		                	$(".indicator .day", $item).html(details.startDay);
		                	$(".indicator .monthEnd", $item).html(moment(details.endMonth).format("MMM"));
		                	$(".indicator .dayEnd", $item).html(details.endDay);
		                }
		                
		                $(".tags", $item).click(drawTripMap.bind($item, details, firstLastTripsObj, $item, $gmap));
		                
		                $('.personal, .business', $item).click(function(e){
		                    var $this = $(this);
		                    if ($this.hasClass('active')) {return;}
		                    
		                    $this.parent().find('.active').removeClass('active');
		                    $this.addClass('active');
		                    
		                    if ($(this).text() == 'BUSINESS') {
		                    	$('.trip-subject-title', $(this).parents('.trip-item')).addClass('business').removeClass('personal').text('Business Trip')
		                    } else {
		                    	$('.trip-subject-title', $(this).parents('.trip-item')).addClass('personal').removeClass('business').text('Personal Trip')
		                    }
		                    
		                    $.ajax({
		                        url      : '/ccw/kh/updateTripCategory.do',
		                        dataType : 'json',
		                        type     : "POST",
		                        data     : {"drivingDetailcategory" : JSON.stringify({"drivingDetailId": Number(details.trscId)}) }
		                    }).done(function (response) {
		                    	 if (details._rawLoaded.tripCategory == 0) {
		                    		 details._rawLoaded.tripCategory = 1;
		 	                    } else {
		 	                    	details._rawLoaded.tripCategory = 0;
		 	                    }
		                    });
		                });
		                
		                $('.mergeLimit .cancel').on('click', function(){
		            		var $parent = $(this).parents('.mergeLimit');
		            		$parent.removeClass('enabled');  
		            	});
		                
		                $('.radio', $item).on('click', function(){
		                	var $mergeLimit = $('.modal.mergeLimit');
		                	var merged_count=0;
		                	var next_merge = $(this).parents(".item.trip-item").next(".item.trip-item");
		                	var prev_merge = $(this).parents(".item.trip-item").prev(".item.trip-item");
		                	var next_radio= $(this).parents(".item.trip-item").next(".item.trip-item").find("span.radio");
		                	var prev_radio= $(this).parents(".item.trip-item").prev(".item.trip-item").find("span.radio");

		                	if($(this).hasClass('active') && !$(this).hasClass('merged')) {
		                		$(".merge-buttons .button:eq(1)").addClass('inactive');
		                	}
	            			//debugger;
		                	if($(this).hasClass('active')) {
		                	 if(!next_radio.hasClass("active") || !prev_radio.hasClass("active")){
		                		$(this).removeClass('active');
		                	 }
		                	}
		                		                	
		                	else {
			                		var idx = $('.option.merge .radio').index(this);
				            		var parent = $(this).parents('.item');
				            		
				            		if (!$(this).hasClass('active') && (!next_merge.hasClass("merged") || !prev_merge.hasClass("merged")) && (!prev_merge.hasClass("hide") || !next_merge.hasClass("merged")) && (next_radio.length > 0 || !prev_merge.hasClass("merged"))) {
				                		if ( !parent.hasClass('merged')) {
					                		$(this).addClass('active');
					                		
					            			var first = $('.radio.active:first').index('.option.merge .radio');
					            			var last = $('.radio.active:last').index('.option.merge .radio');
					            			var limitValue = last - first;
					            			
					            			 if ($('.radio.active').length > 1) {
						                			/* new code */
					            				for (var i=first; i<=last; i++){
					            					
					            					if($(".option.merge").eq(i).parents(".item.trip-item").hasClass("merged")){
					            						merged_count ++;
					            					}
					            				}
					            				/* new code */
					            				if(merged_count > 0){
					            					console.log("already merged");
					            					$(this).removeClass('active');
					            				}
					            				
					            				else if (limitValue > 4) {
						            				$(this).removeClass('active');
						            				$mergeLimit.addClass("enabled");
						            			}
					            				else{
						                			for (var i=first; i<=last; i++){
						                				$('.option.merge .radio').eq(i).addClass('active');
						                				
						                			 if($('.radio.active').length > 5) {
						                					
						                					$(this).addClass('inactive');
						                					
						                					$(this).removeClass('active');
						                					$mergeLimit.addClass("enabled");
						                					break;
						                				}
						                				else{
						                					$(this).removeClass('inactive');	
						                				}
						                			}
						                			//$('.merged .radio').removeClass('active');
					            				}
						                    		$('.merged .radio').removeClass('active');
						                    		//$(this).addClass('active');
						                    		if ($('.radio.active').length == 0) {
						                    			$(this).addClass('active');
						                    		}
						                    		else if ($('.radio.active').length > 1) {
						                				$(".merge-buttons .button:first").removeClass('inactive');
						                			}
						                    		$(".merge-buttons .button:eq(1)").addClass('inactive');
						                		}
					                		
					            		} else {
					            			
					            			$('.radio').removeClass('active');
					            			$(this).addClass('active');
					            			$(".merge-buttons .button:eq(1)").removeClass('inactive');
					                		$(".merge-buttons .button:first").addClass('inactive');
					            		}
				                		
					                	// check for another selected merge either before or after
					                	//mergeTrips.push(details.trscId);
				                	} else if ( parent.hasClass('merged')){
				                		$('.radio').removeClass('active');
				            			
				            			$(this).addClass('active');
				            			
				            			$(".merge-buttons .button:eq(1)").removeClass('inactive');
				                		$(".merge-buttons .button:first").addClass('inactive');
				                		}
				                	else {
				            			var first = $('.radio.active:first').index('.option.merge .radio');
				            			var last = $('.radio.active:last').index('.option.merge .radio');
				            			if (idx > first && idx < last) {
				            				return false;
				            			}
				                		$(this).removeClass('active');
				                		
				                		$(".merge-buttons .button:eq(1)").addClass('inactive');
				                		if ($('.radio.active').length < 2) {
				                			$(".merge-buttons .button:first").addClass('inactive');
				            			}
				                	}
		                	}
		                	
		                	if ($('.radio.active').length > 1) {
	            				$(".merge-buttons .button:first").removeClass('inactive');
	            			} else {
	            				
	            				$(".merge-buttons .button:first").addClass('inactive');
	            			}
		                });
		                var interval = null;
		                function updateDiv(){
	                		var spans=$('.tagsinput span.tag');	                	          	  
	     	          	   $.each(spans,function(key,value){	                	
	     	          		   $('.tagsinput span.tag').removeClass('Autowidth');
	     	          		   if($(value).width()>210)
	     	          			   { 
	     	          			   $(this).css({'width':'210px','word-wrap':'break-word','height':'40px','text-align':'left'});
	     	          			   }   
	     	          	   });	

	     	          	   if(spans != null){
	     	          		clearInterval(interval); 
	     	          	   }
	                	}
		                $('.edit-btn', $item).on('click', function(e){
		                	//debugger;
		                	var spans=$('html').find('tagsinput span.tag');
		                	var noOfTags = 4;
		                	$('.tags-input').removeAttr('disabled');
		                	$('.tagging-input').css('visibility','hidden');
		                	$('.tagErrorAlphaNumaric').addClass('hide');
		                	$('.tagError').addClass('hide');                
		                	$('.poi-dialog, .poi-container', $item).toggleClass('hide');
		                	 
		                /*setTimeout(function(){
		                	var spans=$('.tagsinput span.tag');	                	          	  
		                	          	   $.each(spans,function(key,value){	                	
		                	          		   $('.tagsinput span.tag').removeClass('Autowidth');
		                	          		   if($(value).width()>210)
		                	          			   { 
		                	          			   $(this).css({'width':'210px','word-wrap':'break-word','height':'40px'});
		                	          			   }   
		                	          	   });
		                },1000);*/
		                	
		                	interval = setInterval(updateDiv,10);
		                	
		                	
		                	//var tagArray = details._rawLoaded.tag.split(',');

		                	if(details._rawLoaded.tag !== null) {
		                		var hangul = new RegExp("^[a-zA-Z0-9\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]*$");
		                		var $tagging =$('.tagging-input', $item);
		                		
			                	var items = details._rawLoaded.tag.split(",");
			                	
			                	var validTags = "";
			                	for (it in items) {
			                		
			                		var tag = items[it];
			                		
			                		if ((tag.length <= 25) && hangul.test(tag)) {
			                			if (validTags.length !== 0) {
			                				validTags += ",";
			                			}
			                			validTags += tag;
			                		}
			                	}
			                	
			                	if (validTags !== "") {
			                		details._rawLoaded.tag = validTags;
			                	}
			                	
			             		$tagging.attr('value', details._rawLoaded.tag);
			             		$('.tagsinput').css('display','none');
			             		$tagging.tagsInput({});
			             		
			                	//if(!$tagging.attr('id')){
			//                		//console.log('new tagging instance');
			                		//$tagging.tagsInput({});	
			                	//}
		                	}
		                	$('.tagsinput').find('input').css('visibility','hidden');
		                	
		                	$('.tag a', $item).click(function(e){
		 	            	   $('.tags-input').removeAttr('disabled');
		 	            	  $(this).remove();
		 	               	   interval = setInterval(updateDiv,10);
		 	               });
		                	
		                	if(details._rawLoaded.tag !== null) {
		                		if (items.length > noOfTags) {
			                		$('.tags-input').attr('disabled','disabled');
			                		return;
			                	}
		                	}
		                	
		                	//$('.tags-container', $item).html(tagArray.join(", "));
		                	//console.log('tagArray.join(", ") : '  , tagArray.join(", "))
		                	//console.log("*****",$('.tagsinput').find('input').val());
		                	
		                });
		               
		               $('.done-btn', $item).click(function(e){
		            	   
		            	    //var regex = new RegExp("^[a-zA-Z0-9]+$");
		            	    var hangul = new RegExp("^[a-zA-Z0-9\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]*$");
		            	    var newTag = $('.tags-input', $item).val();  	   
		            	    var $tagging =$('.tagging-input', $item);
		            	    var tags = $tagging.val();
							
		                	if (newTag == '') {
		                		tags = tags.concat(newTag);
		                	}
		                	else {
		                		tags = tags.concat(','+newTag);
		                	}
		                	
		                	var items = tags.split(",");
		                	
		                	var validTags = "";
		                	
		                	$(".tags-title-list-container", $item).empty();
		                	for (it in items) {
		                		var tag = items[it];
		                		
		                		$("<li class='tag-title-heading'>" + tag + "</li>").appendTo($(".tags-title-list-container", $item));
		                		if ((tag.length <= 25) && hangul.test(tag)) {
		                			 $('.tagError').addClass('hide');
		                			 $('.tagErrorAlphaNumaric').addClass('hide');
		                			if (validTags.length !== 0) {
		                				validTags += ",";
		                			}
		                			validTags += tag;
		                		}
		                	}
		                	
		                	if (validTags !== "") {
		                		$tagging.val(validTags);
		                	}
		                	
		                	//debugger;
		                	if(newTag.length > 25) {
		                		$('.tagError').removeClass('hide');
		                		$('.tagErrorAlphaNumaric').addClass('hide');
		                		$('.tags-input', $item).val('');
		                	}
		                	else if (hangul.test(newTag)){
		                		$('.tags-input', $item).val('');
		                		$.ajax({ 
			                        url      : '/ccw/kh/updateTripTag.do',
			                        dataType : 'json',
			                        type     : "POST",
			                        data     : {"drivingDetailTag" : JSON.stringify({"drivingDetailId": Number(details.trscId), "tag": tags.toString()})}
			                    }).done(function (response) {
			                    	$('.poi-dialog, .poi-container', $item).toggleClass('hide');
			                    	createTags(tags.toString(),  $item);
			                    	details._rawLoaded.tag = tags;
			                    });
		                		
		                	}
		                	else {
		                		//if(newTag.match(/["',&]/)){
		                		//debugger;
		                		$('.tags-input', $item).val('');
		                		$('.tagError').addClass('hide');
		                		$('.tagErrorAlphaNumaric').removeClass('hide');
		                	}
		            		                    	
		                });
		                
		                $('.tags-title-list', $item).click(function(e){
		                	$('ul', this).toggle();
		                });
		                
		                if(details._rawLoaded.tripCategory !== 0 && details._rawLoaded.tag !== null){
		                	$('.trip-subject-title', $item).html('Business Trip').removeClass('personal').addClass('business');
		                }
		                
		                if(details._rawLoaded.tripCategory == 0 && details._rawLoaded.tag !== null){
		                	$('.trip-subject-title', $item).html('Personal Trip').removeClass('business').addClass('personal');
		                }
		                
		                //if (typeof details.multi === 'undefined') {
		                //	$('.radio', $item).addClass('active');
		                //}
		                
		                $('.tripId', $item).val(details.trscId);
		                createTags(details._rawLoaded.tag, $item);
		                $list.append($item);
	            	}
	            });
	            updateTripMsg(lengthOfArray(trips) - journeyWithIdsL + uniqJrnyIdsL, lengthOfArray(journeys));
            } else {
            	$list.empty();

                $.each(monthTrips, function (index, details) {
                    var $item = $baseItem.clone();
                    $(".content.k900", $item).addClass('hide');
                    $(".indicator", $item).css('border-right','0px');
                    
                    $(".indicator", $item).html(details.strtTime.format(timeStampFormat));
                    $(".option.map", $item).click(drawTripMapNonKh.bind($item, details, $item, $gmap));

                    $list.append($item);
                });

                updateTripMsg(trips.length, monthTrips.length);
            }
        }
        
        function createTags(details, $item){
        	/*if(details !== null) {
        		var hangul = new RegExp("^[a-zA-Z0-9\u1100-\u11FF|\u3130-\u318F|\uA960-\uA97F|\uAC00-\uD7AF|\uD7B0-\uD7FF]*$");
        		var items = details.split(",");
            	var validTags = "";
            	for (it in items) {
            		var tag = items[it];
            		if ((tag.length <= 24) && hangul.test(tag))  {
            			if (validTags.length !== 0) {
            				validTags += ",";
            			}
            			validTags += tag;
            		}
            	}
            	if (validTags !== "") {
            		details = validTags;
            	}
        	}*/
        	
        	//$('.tag-display-2', $item).html(tagArray[0]); jic i need it
            if(details !== null){
            	//debugger;
            	var tagArray = details.split(','),
            		tagHdr = '',
            		hdrHasEllipsis = false,  // detects if header has been cutoff with ellipsis  
            		hdrCutoffIndex = 0, // starting index to include in tags-title-list 
            		hdrLength = 0,
            		hdrCharLimit = 14,
            		showAll = false,
            		showTagList = (tagArray.length > 1) ? true : false;
            	
            	// calc tags to show in header
            	for (i = 0; i < tagArray.length ; i++) {
            		var length = hdrLength + tagArray[i].length;
            		if (i == 0 && length > hdrCharLimit || i != 0 && (length + i) > hdrCharLimit) {
            			hdrHasEllipsis = (hdrLength + i - 1 <= hdrCharLimit - 5) ? true : false;
            			showTagList = true;
            			hdrCutoffIndex = i;
            			break;
            		}            
            		hdrLength = length;
            		// if all tags fit in header, hide tag-title-list
            		if (i == tagArray.length-1) {
            			showTagList = false;
            			showAll = true;
            			hdrCutoffIndex = i;
            		}
            	}  
            	
            	// build header string
            	var hdrCutoffLength = hdrCutoffIndex + 1;
            	for (i = 0; i < hdrCutoffLength; i++) {
            		if (i < (hdrCutoffLength - 2) || (i == (hdrCutoffLength - 2) && (showAll || hdrHasEllipsis))) {
            			tagHdr = tagHdr + tagArray[i] + ',';
            		} else if (i == (hdrCutoffLength - 2) && !hdrHasEllipsis) {
            			tagHdr = tagHdr + tagArray[i];
            		}
            		
            		if (i == (hdrCutoffLength - 1)) {
            			if (hdrHasEllipsis) {
            				tagHdr = tagHdr + tagArray[i];
            				tagHdr = tagHdr.substring(0,8) + '...';
            			} else if (showAll) {
            				tagHdr = tagHdr + tagArray[i];
            			}
        			}
            	}
            	
            	
            	//$('.tag-title-heading', $item).html(tagHdr);

            	if (showTagList) {
            		$('.tags-title-list', $item).html(createTagTitleHtml(tagArray,hdrCutoffIndex)).removeClass('hide');
            	}else{
            		$('.tags-title-list', $item).addClass('hide');
            	}
            	
            }else{
            	$('.tag-title-heading', $item).html('No trip type assigned.<br>No tags assigned.').css({'background-color':'transparent', 'padding':'0px', 'margin-top':'15px', 'font-size':'0.8em', 'color':'#676666'});
            	$('.tags-title-list', $item).addClass('hide');
            }
        }
        
        function createTagTitleHtml(tags,startIndex){
        	var openEl = '<li>';
        	var closeEl = '</li>';
        	var htmlString = '... <ul>';
        	
        	for(var i = startIndex; i< tags.length; i++){
        		if (i == tags.length - 1)  htmlString += openEl + tags[i] + closeEl;
        		else htmlString += openEl + tags[i] + ',' + closeEl;
        	}
        	htmlString += '</ul>';
        	return htmlString; 
        	
        }


        function yearClicked() {
            $(this).next().find("li").first().click();
        }
        
        function renderCalendar(tripDetails) {
        	
        	var $baseYear = $('<span class="button dropdown">2014</span>');
        	$calendar = $(".tripinfo-calendar").empty();
        	//console.log('tripDetails', tripDetails)
            //massaging this data because are backend devs are lazy
            $.each(tripDetails, function(i, obj){
                //2014-8-31T13:19:11+0000''
                var y = (obj.year >=10)? obj.year.toString() : '0' + obj.year.toString();
                var d= (obj.day >=10)? obj.day.toString() : '0' + obj.day.toString();
                var m= (obj.month >=10)? obj.month.toString() : '0' + obj.month.toString();
                //var s = y + '/' + m + '/' + d + 'Z';//T13:19:11+0000';
                var s = y + '/' + m + '/' + d;
                var d = new Date(s);

                tripDetails[i].strtTime = d.getTime();
                tripDetails[i].strtTimeInSec = d.getTime()/1000;
            });

            trips = uTypes.collectionOf(uTypes.TripInfoDetail, tripDetails || []);
            //console.log('baseyear',$baseYear)
            var tripsByYear = {};

            // merge trips coming from db
            $.each(trips, function (index, details) {
                //is a new year
                if (!tripsByYear[details.year]) {
                    tripsByYear[details.year] = {};
                    var $yearBtn = $baseYear.clone();
                    
                    $yearBtn.text(details.year);
                    $calendar.append($yearBtn);
                    $calendar.append($('<ul class="dropdown-menu hide" />'));
                    $yearBtn.click(yearClicked.bind($yearBtn));
                }

                var year = tripsByYear[details.year];
                var month = year[details.month] = year[details.month] || {};
                
//                if ((index+1) < trips.length) {
//                    details.mileage = details.totalTravelDist - trips[index + 1].totalTravelDist;
//                }
//                else{
//                	
//                	
//                }
            
                //details.mileage = ((details.totalDriveTime/3600) * details.aveSpeed).toFixed(0);
                details.mileage = ((details.totalTravelDist/1000) /1.6).toFixed(0);
                

                //is a new month
                if (!month.trips) {
                    month.trips = [];
                    var $monthList = $(".dropdown-menu", $calendar).last();
                    var $monthBtn = $('<li><a></a></li>');
                    $monthBtn.children("a").text(details.strtTime.format("MMM").toUpperCase());
                    $monthList.append($monthBtn);
                    $monthBtn.click(monthClicked.bind($monthBtn, $monthList, month.trips));
                }

                month.trips.push(details);
            });

            $(".dropdown-menu li", $calendar).first().click();
            
            return tripDetails;
        }

        //take a look at mycarzone.js for reference
        $(".alert-msg").addClass('hide');
        if (typeof search == 'undefined') {
        	uvo.showLoadingMessage();
        	uvo.dataRequest("getTripInfo").done(function (tripDetails) {
        	/*$.ajax({
        		url:'/ccw/scripts/trips.json',
        		dataType: 'json',
        		type: 'GET'
        	}).done( function(tripDetails){*/
        		uvo.clearLoading();
        		if (isK900) {
        			tripArray = renderCalendar(tripDetails);
        		} else {
        			nonKhDataRequestSuccess(tripDetails);
        		}
	        }).fail(function (xhr, status, error) {
	        	if (isK900) {
	        		uvo.clearLoading();
		            updateTripMsg(0, 0);
		            noTripsInfo();
		            if (status !== "904" && status !== "903") {
		                uvo.genericErrorHandler(xhr, status, error);
		            }
	        	} else {
	        		nonKhDataRequestError(xhr,status,error);
	        	}
	        	
	        });
        } else {
        	uvo.selectedVehicle().done(function (vehicle) {
	    		$.ajax({ 
	                url      : '/ccw/kh/searchTag.do',
	                dataType : 'json',
	                type     : "GET",
	                headers  : {'clientId': '123456',
	                	'tokenId': '1e2825f9-a532-41d6-8ad5-85b6de0536dd',
	                	'from': 'CC',
	                	'language': 0,
	                	'offset': -8,
	                	'to': 'CCM',
	                	'deviceId': 'ABCDEF',
	                	'VIN': vehicle.vin
	                },
	                data     : {"searchTag" : JSON.stringify({"tag": search})}
	            }).done(function (response) {
	            	tripDetails = response;
	            	tripArray = renderCalendar(tripDetails);
	            }).fail(function(){
		            updateTripMsg(0, 0);
		            noSearchTrips();
	            });
        	});
        }
        
        // added functions for non-kh data loading
        function nonKhDataRequestSuccess(tripDetails) {
        	trips = uTypes.collectionOf(uTypes.TripInfoDetail, tripDetails || []);

            var tripsByYear = {};
            var $baseYear = $('<span class="button dropdown">2014</span>');
            
            $.each(trips, function (index, details) {
                //is a new year
                if(!tripsByYear[details.year]){
                    tripsByYear[details.year] = {};
                    var $yearBtn = $baseYear.clone();
                    $yearBtn.text(details.year);
                    $calendar.append($yearBtn);
                    $calendar.append($('<ul class="dropdown-menu hide" />'));
                    $yearBtn.click(yearClicked.bind($yearBtn));
                }

                var year = tripsByYear[details.year];
                var month = year[details.month] = year[details.month] || {};
                
//                if ((index+1) < trips.length) {
//                    details.mileage = details.totalTravelDist - trips[index + 1].totalTravelDist;
//                }
//                else{
//                            
//                            
//                }
            
                //details.mileage = ((details.totalDriveTime/3600) * details.aveSpeed).toFixed(0);
                details.mileage = ((details.totalTravelDist/1000) /1.6).toFixed(0);
                

                //is a new month
                if(!month.trips) {
                    month.trips = [];
                    var $monthList = $(".dropdown-menu", $calendar).last();
                    var $monthBtn = $('<li><a></a></li>');
                    $monthBtn.children("a").text(details.strtTime.format("MMM").toUpperCase());
                    $monthList.append($monthBtn);
                    $monthBtn.click(monthClicked.bind($monthBtn, $monthList, month.trips));
                }

                month.trips.push(details);
            });

            $(".dropdown-menu li", $calendar).first().click();
        }
        
        function nonKhDataRequestError(xhr, status, error) {
        	uvo.clearLoading();
        	updateTripMsg(0, 0);
            noTripsInfo();
            if (status !== "904" && status !== "903") {
                uvo.genericErrorHandler(xhr, status, error);
            }
        }
        
        
    };
    


    uvo.setModuleReady("trips", module);
}(window.uvo));