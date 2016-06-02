'use strict';

module.exports = /*ngInject*/ ['HttpService', 'INTERVAL_LIST', '$q',function(HttpService, INTERVAL_LIST, $q) {

	// models
	function CurfewEntity() {
		this.curfewConfigId = 0;
		this.vin = '';
		this.csmrId = '';
		this.curfewId = 0;
		this.active = '';
		this.startTime = 0;
		this.endTime = 0;
		this.startDay = '';
		this.endDay = '';
		this.status = '';
		this.curfewTime = 0;
		this.curfewTimeUom = '1';
		this.action = '';
		this.parentId = 0;
		this.curfewName = '';
	}	

	// view model

	function CurfewItem() {
		this.enabled = false;
		this.curfewConfigId = 0;
		this.vin = '';
		this.csmrId = '';
		this.curfewId = 0;
	}

	function CurfewVM() {
		this.header = {
			active:true,
			startTime:1200,
			startTimeDisplay:'12:00pm',
			startHour:'12',
			startMinute:'00',
			startAmpm:'pm',
			endTime:1300,
			endTimeDisplay:'1:00pm',
			endHour:'1',
			endMinute:'00',
			endAmpm:'pm',
			parentId:0,
			curfewName:'New Curfew',
			action:'insert',
		};

		// these are list of days that toggle on/off
		this.curfews = [new CurfewItem(), new CurfewItem(),
		                new CurfewItem(), new CurfewItem(),
		                new CurfewItem(), new CurfewItem(),
		                new CurfewItem()];
		this.source = '';
	}

	CurfewVM.prototype.toEntity = function() {
		// TODO - should return array of entities with actions
		var entities = [];
		for (var i = 0; i < this.curfews.length; i++) {			
			if (this.curfews[i].enabled) {
				var entity = new CurfewEntity();
				entity.curfewConfigId = this.curfews[i].curfewConfigId;
				entity.vin = this.curfews[i].vin;
				entity.csmrId = this.curfews[i].csmrId;
				entity.curfewId = this.curfews[i].curfewid;
				entity.active = 'A';
				entity.startTime = this.header.startTime;
				entity.endTime = this.header.endTime;
				entity.startDay = this.header.startDay;
				entity.endDay = this.header.endDay;
				entity.status = '';
				// entity.curfewTime = this.header.curfewTime;
				// entity.curfewTimeUom = this.header.curfewTimeUom;
				entity.action = '';
				entity.parentId = this.header.parentId;
				entity.curfewName = this.header.curfewName;
				// entity.vin = 
			}
		}

	};

	function processCurfewSettings(response) {

		function sortListByParentId(list) {
			list.sort(function(a,b) {
				if (a.parentId < b.parentId) { return -1; }
				else if (a.parentId > b.parentId) { return 1; }
				else {return 0;}
			}); 
		}

		function groupList(list,serviceResponse) {			
			var curfewGroups = [];
			var arrId = -1; // current array cursor
			var pId = 0; // current parentId cursor
			
			for (var i = 0; i < list.length; i++) {
				var item = list[i];
				
				// if parentId is different, add new array item
				if (pId !== item.parentId) {					
					pId = item.parentId;

					var newCurfew = new CurfewVM();
					var startTimeComponents = convertTime(item.startTime.toString());
					var endTimeComponents = convertTime(item.endTime.toString());

					newCurfew.header.active = item.active;
					newCurfew.header.startTime = item.startTime;
					newCurfew.header.startTimeDisplay = startTimeComponents.hour+':'+startTimeComponents.minute+startTimeComponents.ampm;
					newCurfew.header.startHour = startTimeComponents.hour;
					newCurfew.header.startMinute = startTimeComponents.minute;
					newCurfew.header.startAmpm = startTimeComponents.ampm;
					newCurfew.header.endTime = item.endTime;
					newCurfew.header.endHour = endTimeComponents.hour;
					newCurfew.header.endMinute = endTimeComponents.minute;
					newCurfew.header.endAmpm = endTimeComponents.ampm;
					newCurfew.header.endTimeDisplay = endTimeComponents.hour+':'+endTimeComponents.minute+endTimeComponents.ampm;
					newCurfew.header.parentId = item.parentId;
					newCurfew.header.curfewName = item.curfewName;					
					newCurfew.source = 'server';

					curfewGroups.push(newCurfew);
					arrId = curfewGroups.length - 1;
				}

				// display is from M-SUN ( 0 - 6 )
				// data is from SUN - SAT ( 0 - 6 )
				// so display will be index - 1
				var index = parseInt(item.startDay) == 0 ? 6 : item.startDay - 1;
				curfewGroups[arrId].curfews[index].enabled = true;
			}
			
			serviceResponse.CurfewGroups = curfewGroups;
		}

		function findIntervalValue(list, serviceResponse) {
			serviceResponse.interval = 
				_.findIndex(INTERVAL_LIST, function(item) { 
					return item.value === list[0].curfewTime; 
				});
		}

		var curfewList = response.data.serviceResponse.CurfewAlertList;
		var serviceResponse = response.data.serviceResponse;	
		serviceResponse.interval = 0;

		if (curfewList.length > 0) {			
			sortListByParentId(curfewList);
			findIntervalValue(curfewList, serviceResponse);				
			groupList(curfewList, serviceResponse);
		}

		return serviceResponse;
	}

	// converts string like '600' or '1300' to '6:00am' and '1:00pm'
	function convertTime(time) {		
		var hour = time.length === 4 ? time.substring(0,2) : time.substring(0,1);
		var minute = time.length === 4 ? time.substring(2,4) : time.substring(1,3);
		var ampm = hour >= 12 ? 'pm' : 'am';
		if (hour > 12) { hour = hour -12; }
		return {
			hour:hour,
			minute:minute,
			ampm:ampm
		};		
	}

	function getCurfewSettings(){
		var deferred = $q.defer();
	    HttpService.get('/ccw/kh/curfewAlertSettings.do').then(function(response){
	    	deferred.resolve(processCurfewSettings(response));
	    });
	    return deferred.promise;
	}

	function setCurfewSettings(curfewGroups) {
		var requestArray = [];
		for (var i = 0; i < curfewGroups.length; i++) {
			var arr = curfewGroups[i].toEntity();
			for (var j = 0; j < arr.length; j++) {
				requestArray.push(arr[j]);
			}
		}

		return HttpService.post('/ccw/kh/curfewAlertSettings.do', requestArray);
	}

	function createCurfew(groups) {
		if(!groups){
			groups=[];
		}
		var curfew;
if(groups.length==0){
 curfew = new CurfewVM();
 curfew.header.switchFlag=true;
 curfew.header.parentId=1;
}
else{
	// check if curfew limit of 3 non-deleted curfews exists
		var proceed = true;
		var limitCount = 0;
		for (var j = 0; j < groups.length; j++) {
			if (groups[j].header.action !== 'delete') {
				limitCount++;
			}
		}

		
		if (limitCount < 3) {
			// splice parent Ids and curfew Names if exist in group
			// Results in using the very first element of the arrays
			//    to create new curfew
			var pIds = [1,2,3];
			var names = [1,2,3];

			for (var i = 0; i < groups.length; i++) {
				if (groups[i].header.action !== 'delete') {
					var pId = groups[i].header.parentId;
					var name = groups[i].header.curfewName;

					// splice arrays
					pIds.splice(pIds.indexOf(pId),1);
					if (/^Curfew [1-3]$/.test(name)) {
						var curfNum = parseInt(name.replace('Curfew ',''));
						names.splice(names.indexOf(curfNum),1);
					}
				}
			}
			var parentId = pIds[0];
			var curfewName = 'Curfew ' + names[0];
			curfew = new CurfewVM();
			curfew.header.parentId = parentId;

			curfew.header.curfewName = curfewName;
			curfew.header.switchFlag=true;
			curfew.source = 'user';
		}

		
}
return curfew;
		
	}

	return {
		convertTime:convertTime,
		getCurfewSettings:getCurfewSettings,
		setCurfewSettings:setCurfewSettings,
		createCurfew:createCurfew
	};
}];