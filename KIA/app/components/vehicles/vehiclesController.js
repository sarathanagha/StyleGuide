'use strict';

module.exports = /*@ngInject*/ ['$timeout', '$state', '$modal', '$scope', '$cookies',
					'StatusBarService', 'VehiclesService', 'DealerService', 'VehicleSwitcherService',function($timeout, $state, $modal, $scope, $cookies,
					StatusBarService, VehiclesService, DealerService, VehicleSwitcherService) {

	var vm = this,
	    dtcDone = false,
	    vehiclesDone = false;
	vm.selectDealer = false;
	vm.showManage = [];		
	document.cookie = "emailAddress=uvo;domain=.myuvo.com; path=/";
	vm.getImageURL = VehiclesService.getImageURL; // For 0 zero vehicles, need the imageUrl processed
	delete $cookies.gen;// Remove genType cookie when land on myvehicles page.

	getAddVehicleURL();
	function getAddVehicleURL() {
		var hostname = window.location.hostname;
	    if (!hostname.match(/myuvo/ig)) {
	        vm.getAddVehicleURL =  'https://stg.myuvo.com/ccw/';
	    } else {
	    	vm.getAddVehicleURL = '../';
	    }
	}

	vm.gotoOverview = function(vehicle) {
		if (!vehicle.enrolled || vehicle.expired) {return false;}
		StatusBarService.showLoadingStatus();
		// getPreferredDealer will check if dealer is set.
		$cookies['gen'] = vehicle.gen;
		$cookies['vin'] = vehicle.vin;
		DealerService.hasPreferredDealer(vehicle.gen,vehicle.vin).then( function(hasDealer) {
			StatusBarService.clearStatus();
			if (hasDealer) {
				VehicleSwitcherService.switchVehicle(vehicle.gen,vehicle.vin);
			} else {				
				DealerService.openPreferredDealerModal(vehicle.vin);
			}			
		});
	};

	vm.gotoMaintenance = function(vehicle) {
	
		DealerService.hasPreferredDealer(vehicle.gen,vehicle.vin).then( function(hasDealer) {
			StatusBarService.clearStatus();
			if (hasDealer) {
				VehicleSwitcherService.switchVehicleToMaintenance(vehicle.gen,vehicle.vin);
			} else {
				DealerService.openPreferredDealerModal(vehicle.vin);
			}			
		});
	};

	vm.toggleAdd = function() {
	 	vm.showAdd = !vm.showAdd;
	 	vm.addSubmitted = false;
	 	vm.errorInvalidvin = false;
	 	vm.showEndLifeError = false;	 	
	};

	vm.toggleDeleteVehicle = function() {
	 	vm.confirmDelete = !vm.confirmDelete;
	};

	vm.deleteAnyVehicle = function(vin){
		VehiclesService.deleteVehicle(vin).then(function(data) {
			StatusBarService.clearStatus();
			vm.toggleDeleteVehicle();
			if (data.data.statusCode === '200') {
				for (var i = 0; i < vm.showManage.length; i++){
					vm.showManage[i] = false;
				}
				loadVehicleData();
			}			
		});	
	};

	vm.deleteVehicle = function(index,vin) {
		StatusBarService.showLoadingStatus();
		var errorMsg='';
		if(vm.vehicles[index].gen ==='psev' && vm.vehicles[index].enrVin ==='A'){
			VehiclesService.deletePsevVehicle(vin).then(function(data) {			
				if (data.success === false) {
					StatusBarService.clearStatus();
					vm.toggleDeleteVehicle();
					var modalInstance = $modal.open({
						templateUrl: 'views/components/vehicles/templates/psevDelVehicleMsgModal.html',
						windowClass: 'psevDelVehicleMsgModal',
						controller: 'DeleteVehicleController',
						controllerAs: 'vm',
						keyboard: false,
						backdrop: 'static',
						resolve: {
							errorMsg : function() { return data.error; }
						}
					});				
				}else if (data.success === true){
					vm.deleteAnyVehicle(vin);
				}				
			});			
		}else{
			vm.deleteAnyVehicle(vin);
		}
	};

	// this must get called before adding a vin
	// if ev, it will show head unit popups
	vm.validateVin = function(vin,nick) {		
		var isRequestMade = false; // keep track of addVehicle requests		
		vm.addSubmitted=true;
		vm.showEndLifeError = false;
		vm.errorInvalidvin=false;
		nick = angular.isUndefinedOrNull(nick)? '' : nick.trim() ; 
		if(vin && vin.length > 0 ){
			StatusBarService.showLoadingStatus();
			VehiclesService.validateVin(vin).then(function(data) {			
				StatusBarService.clearStatus();
				var version = '';
				var soul2014 = '';
				if (data.data) {
					var responseData = data.data;
					version = (responseData.versionType || '').toUpperCase();
		            soul2014 = responseData.soul2014;
		            vm.addVehiclePopup = false;
		            vm.showEndLifeError = false;	
				}
				
	        	if(data.success === false){		        	
					vm.errorInvalidvin=true;
					vm.addSubmitted=false;
					return;
		        } else {
	            	vm.errorInvalidvin=false;
			 		if(version !== 'UVO'){
						if(data.endLife) {	
	                    	vm.showEndLifeError = true;
	                    	vm.addSubmitted=false;
	                	} else {
	                
	                    //$("#invalidVIN").removeClass("hide");
	                	}
					} else if(soul2014) {
						
						vm.addVehiclePopup = true;
						vm.addmyuvo = function (){
							
							vm.showAdd=false;
							vm.checkboxselected = false;
							VehiclesService.addTemporaryVehicle(vin,nick).then(function(data){
									
								StatusBarService.clearStatus();
								loadVehicleData();
								});
						}
						vm.radiooselected=function(modal){
							
							vm.addVehiclePopup=false;
							

							if(vm.radioCheck==='0'){
								
	                            vm.checkboxselected = true;
								isRequestMade = true;
								vm.showAdd=false;

								
							}
							else{
								VehiclesService.addTemporaryVehicle(vin,nick).then(function(data){
								
								StatusBarService.clearStatus();
								loadVehicleData();
								});
								vm.checkboxselected = false;
								vm.showAdd=false;
								
							}
						};

						// show popup
						StatusBarService.showLoadingStatus();
						isRequestMade = true;
						/*VehiclesService.addVehicle(vin,nick).then(function(data){
							StatusBarService.clearStatus();
							loadVehicleData();
							vm.showAdd = false;
						});*/
					} else {
						// add vehicle
						StatusBarService.showLoadingStatus();
						isRequestMade = true;
						VehiclesService.addVehicle(vin,nick).then(function() {
							StatusBarService.clearStatus();
							loadVehicleData();
							vm.showAdd = false;

							vm.addVin = '';
							vm.addNick = '';
	                        vm.addSubmitted=false;

						});
					}				
				}

				if (!isRequestMade && !vm.showEndLifeError) {
					VehiclesService.addVehicle(vin,nick).then(function(data) {
						StatusBarService.clearStatus();
						loadVehicleData();
						vm.showAdd = false;
						
					});
				}
			});
		}
	};

	$scope.closeModal = function() {
		vm.addVehiclePopup = false;
	};

	vm.editVehicle = function(vin,nick,index) {
			if (nick !== vm.vehicles[index].vehNick) {
				VehiclesService.editVehicle(vin,nick).then(function(data) {
					if (data.data.status === 'Success') {
						vm.vehicles[index].vehNick = nick;
					}
				});
			}
			// To make sure the NickName cannot exceed 17 characters in Android phone.
	$scope.$watch("vm.addNick", function(newValue, oldValue){
		
			if (newValue && newValue.length > 17){
           vm.addNick = oldValue;
      

        }
		
        
    });
	};

	vm.openShowPinModal = function(pin) {
		var modalInstance = $modal.open({
			templateUrl: 'views/components/vehicles/templates/show-pin-modal.html',
			windowClass: 'show-pin-modal',
			controller: 'ShowPinController',
			controllerAs: 'vm',
			keyboard: false,
			backdrop: 'static',
			resolve: {
				pin : function() { return pin; }
			}
		});

		modalInstance.result.then(function() {
			vm.carZonePin = pin;
		});
	};
	function checkIfDataResolved() {
		if (dtcDone && vehiclesDone) {
			StatusBarService.clearStatus();
		}
	}

	// Data requests	
	loadVehicleData();

	function resetShowManage() {
		if (vm.vehicles) {
			vm.showManage = [];
			var i;
			for (i=0;i<vm.vehicles.length;i++) {  vm.showManage.push(false); }
		}
	}

	function loadVehicleData() {
		StatusBarService.showLoadingStatus();
		dtcDone = false; vehiclesDone = false;
		VehiclesService.getDtcCount().then(function(data) {
			if (vm.vehicles) { // if vehicles data already exists

				vm.vehicles = VehiclesService.processDtcVehicleData(vm.vehicles, data.data.serviceResponse);
				
			} else {

				vm.dtcData = data.data.serviceResponse;	
				resetShowManage();		
			}
			dtcDone = true;
			checkIfDataResolved();
		});

		VehiclesService.getVehicles().then(function(data) {
			VehiclesService.setVehicleData(data);
			if (vm.dtcData) { // if dtc count already exists
				
				vm.vehicles = VehiclesService.processDtcVehicleData(data, vm.dtcData);
			} else {
				
				vm.vehicles = data;
				resetShowManage();
			}
			vehiclesDone = true;
			checkIfDataResolved();
		});
	}

	angular.isUndefinedOrNull = function(val) {
    	return angular.isUndefined(val) || val === null;
	};
}];
