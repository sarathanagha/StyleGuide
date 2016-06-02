'use strict';

module.exports = /*@ngInject*/ function(HttpService, $cookies, $q,SpringUtilsService) {

	var _monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

	// models

	// for view and kh entity
	function TripInfo() {
		this.vin = '';
		this.journeyId = 0;
		this.milesDriven = 0;
		this.secondsDriven = 0;
		this.minutesDriven = 0;
		this.hoursDriven = 0;
		this.aveSpeed = 0;
		this.tripCategory = 0; // 0 - personal, 1 - business
		this.month = 1;
		this.day = 1;
		this.year = 1970;
		this.tag = '';
		this.startLat = 0.0;
		this.startLong = 0.0;
		this.endLat = 0.0;
		this.endLong = 0.0;
		this.drivingDetailId = 0;
		this.curfewCount = 0;
		this.geoFenceCount = 0;
		this.speedCount = 0;
		this.startOdometer = 0;
		this.endOdometer = 0;
		this.idleTime = 0;
		this.mph = 0;
		this.effScore = 0;
		this.inEffScore = 0.0;
		this.startDtTime = 0;
		this.endDtTime = 0;		
	}

	// cp entity model (use kh model for view)
	function TripInfoCP() {
		this.strtTime = 0; // long milliseconds
		this.strtHr = 1;
		this.strtMin = 0;
		this.strtTimeInSec = 0;
		this.totalDriveTime = 0;
		this.aveSpeed = 0;
		this.strtLat = 0.0;
		this.strtLong = 0.0;
		this.stopLat = 0.0;
		this.stopLong = 0.0;
		this.totalTravelDist = 0;
		this.endTime = 0; // long milliseconds
		this.endHr = 1;
		this.endMin = 17;
	}

	TripInfoCP.prototype.copyData = function(data) {
		for (var prop in this) {
			if (this.hasOwnProperty(prop)) {
				this[prop] = data[prop];
			}
		}
	};

	TripInfoCP.prototype.toViewModel = function() {
		var vm = new TripInfo();
		var momentStartDate = moment(this.strtTime);
		momentStartDate.hour(this.strtHr);
		momentStartDate.minute(this.strtMin);
		var momentEndDate = moment(this.endTime);
		momentEndDate.hour(this.endHr);
		momentEndDate.minute(this.endMin);

		vm.startDtTime = momentStartDate.valueOf();
		vm.secondsDriven = this.totalDriveTime;
		vm.aveSpeed = this.aveSpeed;
		vm.startLat = this.strtLat;
		vm.startLong = this.strtLong;
		vm.endLat = this.stopLat;
		vm.endLong = this.stopLong;
		vm.milesDriven = ((this.totalTravelDist/1000) /1.6).toFixed(0);
		vm.endDtTime = momentEndDate.valueOf();
		vm.year = momentStartDate.year();
		vm.month = momentStartDate.month() + 1;
		vm.day = momentStartDate.date();

		return vm;
	};

	function processTripInfo(data) {
		var trips = [];
		var currentJourneyId = 0;
		var currentTripIndex = 0;	
		var i;
		var isCP = $cookies['gen'] !== 'kh';

		// prefix should be either 'start' or 'end'
		// returns Month, Day, MonthName, and DisplayTime
		function convertUTCToDateComponents(utc, prefix) {	
			var date = new Date(0);
			date.setUTCSeconds(utc/1000);
			var momentObj = {};
			var components = {};
			if(isCP){  // For Gen1+ vehicles we need not consider utc
				momentObj = moment(date);
				components[prefix+'DisplayTime'] = momentObj.format('hh:mm a');
				components[prefix+'DisplayDate'] = momentObj.format('MMM DD YYYY hh:mm a');
			}else{ // For KH vehicles we need to consider utc
				momentObj = moment.utc(date);
				components[prefix+'DisplayTime'] = momentObj.utc().format('hh:mm a');
				components[prefix+'DisplayDate'] = momentObj.utc().format('MMM DD YYYY hh:mm a');
			}			
			components[prefix+'Month'] = momentObj.month();
			components[prefix+'Day'] = momentObj.date();
			components[prefix+'MonthName'] = _monthNames[momentObj.month()];			
			return components;
		}

		// returns hrsDriven and minsDriven
		function convertHoursToTimeComponents(time, units) {
			var mmnt = moment.duration(time, units);
			var components = {};
			components['hrsDriven'] = mmnt.hours();
			components['minsDriven'] = mmnt.minutes();

			return components;
		}

		// Creation of new Trip Object. Will include View Model fields such as 
		// start/end Month, Day, MonthName, and DisplayTime
		// also hrsDriven and minsDriven
		function makeNewTrip(from) {
			var trip;
			if (isCP) {
				var cpEntity = new TripInfoCP();
				cpEntity.copyData(from);
				trip = cpEntity.toViewModel();
			} else {
				trip = new TripInfo();
				var prop;
				for (prop in trip) {
					if (trip.hasOwnProperty(prop)) {
						trip[prop] = from[prop];
					}
				}
			}

			// break down start and end into date compontents
			trip = angular.extend(trip, convertUTCToDateComponents(trip.startDtTime,'start'));
			trip = angular.extend(trip, convertUTCToDateComponents(trip.endDtTime,'end'));
			if (isCP) {
				trip = angular.extend(trip, convertHoursToTimeComponents(trip.secondsDriven + trip.idleTime, 'seconds'));
			}else if(trip.journeyId === 0){
				trip = angular.extend(trip, convertHoursToTimeComponents(trip.hoursDriven, 'hours'));
			}

			// split tags into array
			
			trip.tags = trip.tag ? trip.tag.split(',') : []; 

			// show date range flag
			trip.showDateRange = false;

			trips.push(trip);
			currentTripIndex = trips.length-1;
			currentJourneyId = from.journeyId;
		}

		for (i=0;i<data.length;i++) {

			// if journeyId is 0, or journeys are different, push to array immediately
			if (data[i].journeyId === 0 || currentJourneyId !== data[i].journeyId || isCP) {
				makeNewTrip(data[i]);							
			// else process merge object			
			} else{
					
				// Increment MCZ alerts
				trips[currentTripIndex].curfewCount += data[i].curfewCount;
				trips[currentTripIndex].geoFenceCount += data[i].geoFenceCount;
				trips[currentTripIndex].speedCount += data[i].speedCount;	
				trips[currentTripIndex].startDtTime += data[i].startDtTime;
				trips[currentTripIndex].speedCount += data[i].speedCount;	

				// Increment time and distance
				trips[currentTripIndex].hoursDriven += data[i].hoursDriven;
				trips[currentTripIndex].milesDriven += data[i].milesDriven;	
				
				// extend starting dates and coords
				trips[currentTripIndex].startLat = data[i].startLat;	
				trips[currentTripIndex].startLong = data[i].startLong;	

				var startDate = convertUTCToDateComponents(data[i].startDtTime,'start');
				trips[currentTripIndex].startMonth = startDate.startMonth;
				trips[currentTripIndex].startDay = startDate.startDay;
				trips[currentTripIndex].startMonthName = startDate.startMonthName;
				trips[currentTripIndex].startDisplayTime = startDate.startDisplayTime;

				// extend total driving components
				/*var timeComponents = convertHoursToTimeComponents(trips[currentTripIndex].hoursDriven, 'hours');
				trips[currentTripIndex].hrsDriven += timeComponents.hrsDriven;
				trips[currentTripIndex].minsDriven += timeComponents.minsDriven;*/
				trips[currentTripIndex] = angular.extend(trips[currentTripIndex], convertHoursToTimeComponents(trips[currentTripIndex].hoursDriven, 'hours'));

				// if start and end dates are different, change show date range flag
				trips[currentTripIndex].showDateRange =
					trips[currentTripIndex].endMonth !== startDate.startMonth ||
					trips[currentTripIndex].endDay !== startDate.startDay;
			}
		}

		return trips;
	}

	function getTripInfo() {

		var url = $cookies['gen'] === 'kh' ? '/ccw/kh/tripsDetail.do' : '/ccw/cp/tripInfoDetail.do';

      	var deferred = $q.defer();
      	HttpService.get(url).success(function(data) {
      		if(data && data.serviceResponse){
	        	deferred.resolve(processTripInfo(data.serviceResponse));
	        }
        });
      
      	return deferred.promise;
	}

	function updateTripCategory(id) {
		var payload = {
			'drivingDetailId':id
		};

		return HttpService.post('/ccw/kh/updateTripCategory.do?drivingDetailcategory='+encodeURIComponent(JSON.stringify(payload)), payload);
	}

	// tag: Contains all tags in a comma-delimited list. To delete, remove the
	// item from the list and send.
	function updateTripTag(id, tag) {
		var payload = {	
			'drivingDetailId':id,
			'tag':tag
		};

		return HttpService.post('/ccw/kh/updateTripTag.do?drivingDetailTag='+encodeURIComponent(JSON.stringify(payload)), {});
	}

	// trips: Array of TripInfo objects
	function mergeTrips(trips) {
		var i, payload = [];
		for (i = 0; i < trips.length; i++) {		
			var trip = new TripInfo();
			for (var prop in trip) {
				if (trip.hasOwnProperty(prop)) {
					trip[prop] = trips[i][prop];
				}
			}	
			payload.push(trip);
		}
		var trip_payload = SpringUtilsService.encodeParams({
            'trips': JSON.stringify(payload)
        });
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
		return HttpService.post('/ccw/kh/mergeTrips.do',trip_payload,headers);
	}

	// trips: Array of TripInfo objects
	function unMergeTrips(journeyId) {
		return HttpService.post('/ccw/kh/unMergeTrips.do?trips='+journeyId, {});
	}

	// currently, this filtering is being done on the front end
	function searchTag(tag) {
		var deferred = $q.defer();
		var params = {tag:tag};
      	HttpService.get('/ccw/kh/searchTag.do?searchTag='+encodeURIComponent(JSON.stringify(params))).success(function(data) {
        	deferred.resolve(processTripInfo(data.serviceResponse));
        });
      
      	return deferred.promise;
	}

	return {
		getTripInfo : getTripInfo,
		mergeTrips : mergeTrips,
		searchTag : searchTag,
		unMergeTrips : unMergeTrips,
		updateTripCategory : updateTripCategory,
		updateTripTag : updateTripTag
	};

};
