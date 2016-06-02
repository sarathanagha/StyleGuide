'use strict';

module.exports = /*@ngInject*/ function(HttpService, $q, $cacheFactory, SpringUtilsService) {

	var imageURL = '/kar/images/changeCar/', _vehicles;

	function setVehicleData(vehicles){
		_vehicles = vehicles;
	}
	function getVehicleData(){		
		return _vehicles;
	}	 

	function processVehicleData(vehicles) {
		for (var i in vehicles) {
			if (vehicles[i]) {
				// check for vehicle type and assign to vehicle[i].gen
				// note: expiration date has higher priority than enrollment
				vehicles[i].gen = getVehicleType(vehicles[i]);
				vehicles[i].expired = checkExpiration(vehicles[i]);
				vehicles[i].enrolled = checkEnrollment(vehicles[i]);

				// determine vehicle image
		        vehicles[i].originImgFileNm = (vehicles[i].originImgFileNm) ? vehicles[i].originImgFileNm : vehicles[i].realImgFileNm;
		        vehicles[i].originImgFileNm = getImageURL() + vehicles[i].originImgFileNm;

				// Convert string to JSON object
				if (vehicles[i].gen === 'psev' && vehicles[i].vehicleStatus !== 'notexists') { 
					vehicles[i].vehicleStatus = processEVData(vehicles[i]); 
				}

				// Add dtcKhCnt field
				vehicles[i].dtcKhCnt = 0;
			}
		}
		return vehicles;
	}


	function processEVData(vehicle) {
		var json = angular.fromJson(vehicle.vehicleStatus);
		json.eVStatus['batteryPluginText'] = (json.eVStatus.batteryPlugin !== 0) ? 'Plugged in' : 'Not plugged in';
		return json;
	}

	function getImageURL() {
		var hostname = window.location.hostname;
    //if (hostname.match(/localhost/ig)) {
    if (!hostname.match(/myuvo/ig)) {
       return 'https://stg.myuvo.com' + imageURL;
    }

    return imageURL;
  }

	function getVehicleType(vehicle) {
		var gen = 'gen1';
		if (vehicle.fuelType === '4') {
			gen = 'psev';
		}
		else if(vehicle.mdlNm === 'K900' && vehicle.khVehicle === 'K900'){
			gen = 'kh';
		}
		else if(vehicle.mdlNm === 'OPTIMA' && vehicle.khVehicle === 'OPTIMA'){
			gen = 'jf';
		}
		else if (vehicle.genType === '1' || vehicle.launchType === '1') {
			gen = 'gen1plus';
		}
		return gen;
	}

	function checkEnrollment(vehicle) {
		var enabled = true;
    if (vehicle.fuelType === '4') {
        enabled = vehicle.enrVin === 'A';
    } else if(vehicle.mdlNm === 'K900' && vehicle.khVehicle === 'K900'){
    	enabled = vehicle.enrVinKh === '4';
    }
    else{
        if (vehicle.actVin === 'Y') {
            enabled = false;
        }
    }
    return enabled;
	}

	function checkExpiration(vehicle) {
		var retVal = false;
		var currDate = new Date().getTime();
		if(vehicle.fuelType !== '4'){
			var exp = vehicle.wrrtEndMile;
				exp = exp || (currDate >= vehicle.endDate);
				retVal = exp;
		} else {
			retVal = vehicle.freeServiceEndDate < currDate;
		}
		return retVal;
	}

	return {
		setVehicleData : setVehicleData,
		getVehicleData : getVehicleData,
		addVehicle: function(vin,nick) {
			var payload = SpringUtilsService.encodeParams({'vin':vin, 'vehNick':nick});
			var headers = {
     			'Content-Type':'application/x-www-form-urlencoded'
   			};
			return HttpService.post('/ccw/set/addVehl.do', payload,headers);
		},
		addTemporaryVehicle: function(vin,nick) {
			var payload = SpringUtilsService.encodeParams({'vin':vin, 'vehNick':nick});
			var headers = {
     			'Content-Type':'application/x-www-form-urlencoded'
   			};
			return HttpService.post('/ccw/set/temporaryAddVehl.do', payload,headers);
		},
		deletePsevVehicle: function(vin) {		
			var deferred = $q.defer();		
			HttpService.post('/ccw/ev/changeMsg.do?vin='+vin).success(function(data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		},
		deleteVehicle: function(vin) {
			return HttpService.post('/ccw/set/deleteVehicle.do', {'vin':vin});
		},
		editVehicle: function(vin,nick) {
			return HttpService.post('/ccw/set/editVehicle.do', {'vin':vin, 'vehNick':nick});
		},		
		getCarTypes : function(data) {
	      var hasEV = false, hasKH = false, evVin = '',hasGenOne = false;
	      for (var i in data) {
	        if (data[i]) {
	          if (data[i].fuelType === '4') { hasEV = true; evVin = data[i].vin; }
	          else if (data[i].mdlNm === 'K900' && data[i].khVehicle === 'K900') { hasKH = true; }
	          else{hasGenOne = true}
	        }
	      }
	      return {
	        'hasEV' : hasEV,
	        'hasKH' : hasKH,
	        'evVin' : evVin,
	        'hasGenOne' : hasGenOne
	      };
	    },
		getDtcCount: function() {
			return HttpService.get('/ccw/kh/activeDtcCnt.do');
		},
		getImageURL: function() {
			return getImageURL();
		},
		getVehicles: function() {
			var deferred = $q.defer();
			HttpService.get('/ccw/com/vehiclesInfo.do').success(function(data) {
				deferred.resolve(processVehicleData(data.listMyCarInfo));
			});
			return deferred.promise;
		},
		processDtcVehicleData: function(vehicles, dtc) {
			var i,j;
			for(i in vehicles) {
				if (vehicles[i]) {
					for (j in dtc) {
						if (vehicles[i].vin === dtc[j].vin) {
							vehicles[i].dtcKhCnt = dtc[j].dtcKhCnt;
						}
					}
				}
			}
			return vehicles;
		},
		validateVin: function(vin) {
			var deferred = $q.defer();
			HttpService.post('/ccw/com/validateVin.do', {'vin':vin} ).success(function(data) {
				deferred.resolve(data);
			});
			return deferred.promise;
		}
	};
};
