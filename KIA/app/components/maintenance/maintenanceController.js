'use strict';

module.exports = /*@ngInject*/ function(MaintenanceService, DealerService, CarInfoService,
				VehicleStatusService, ResolveService, StatusBarService, AlertModalService, $cookies, $modal, $scope, $anchorScroll, $rootScope, CommonService) {
	var vm = this,
		milesStonesDone = false,
		currApptsDone = false,
		oilChangeDone = false,
		dtcDone = false;
	vm.milestones = [];
	vm.currentMilestoneIndex = 0;
	vm.milestonesCount = 0;
	vm.intervalDetail = {inspect:[], replace:[]};
	vm.hasIntervals = true;
	vm.showOilChange = $cookies['gen'] === 'kh';
	vm.milesTillNextInterval = '';
	vm.milestoneBarWidth = '\'0px\'';
	vm.hasKh = $cookies['gen'] === 'kh';
	vm.isSubmitted = false;
	vm.nextMilestone = 0;
	// $scope.close=function(){
	// 	$scope.dismiss('close');
	// 	//$('.modal-backdrop').removeClass('.modal-backdrop');
 //  	}
	$rootScope.preferredDealer = DealerService.preferredDealer();
	var defaultForm = {
	      insDt : null,
	      plOfWk : "",
	      insMilg: ""
    };
	vm.setMilestoneIndex = function(increment) {
		// reset notes submitted
		vm.notesSubmitted = false;

		// Left arrow decreases interval and right arrow increases interval
		var offset = (typeof increment === 'boolean') ? (increment) ? 1 : -1 : increment;

		// Set currentMilestone from milestones array
		vm.currentMilestoneIndex = vm.currentMilestoneIndex + offset;
		vm.currentMilestone = vm.milestones[vm.currentMilestoneIndex];

		if(vm.currentMilestone.insDt == ""){
			vm.currentMilestone.insDt = null;
		}

		// Check if milestones array has interval detail set, if not, get from
		// endpoint before setting interval detail		
		vm.intervalDetail = {inspect:[], replace:[]};
		if (vm.milestones[vm.currentMilestoneIndex].intervalDetail) { 
			vm.intervalDetail = vm.milestones[vm.currentMilestoneIndex].intervalDetail;
		} else {
			getIntervalDetail(vm.currentMilestoneIndex, vm.currentMilestone['crtnMilg']);
		}		
	};

	vm.latestVehicleStatus=function(){
      	StatusBarService.showLoadingStatus();
     	VehicleStatusService.latestVehicleStatus().then(function(data){     
	      	if(data.success == true){
	        	vm.vehicleStatus = data;
	        	vm.vStatus = vm.vehicleStatus.serviceResponse.timeStampVO.unixTimestamp;
	        	StatusBarService.clearStatus();	       
	      	}	      
    	});
   }


	vm.openNotesDetails = function() {
		if(vm.intervalDetail){
			var modalInstance = $modal.open({ 
				templateUrl:'views/components/maintenance/templates/notes-and-details.html',
				keyboard: false,
			    backdrop: 'static',
			    controller: 'NotesDetailsModalController',
			    controllerAs: 'vm',
			    resolve:{
			    	data: function() { 
			    		return {
				    		intervalDetail: vm.intervalDetail,
				    		currentMilestone: vm.currentMilestone,
				    		showNotesDetails: vm.currentMilestone.crtnMilg <= vm.nextMilestone
			    		};
			    	}
			    }
			});
		}
		modalInstance.result.then(function(response) {
			if (response === 'complete') {
				saveNote();
			}else if (response === 'delete') {
				deleteNote();
			}
		});
	};

	vm.openDealerModal = function() {
		DealerService.setHasPreferredDealer(true);		
		DealerService.setIsMaintPage(true);
		DealerService.openPreferredDealerModal();
    };

    vm.downloadICS = function(name,begin,end,rqType) {
    	var cal = ics();
    	cal.addEvent(rqType, 'What is this appointment for?', name, begin, end);
    	cal.download();
    };

    $scope.makeAppointment = function(dealerCode) {
    	//repairType = $rootScope.issueType;

    	if( !vm.isSubmitted){ //To avoid double submission.
    		vm.isSubmitted = true;
	    	MaintenanceService.makeAppointment($rootScope.issueType, dealerCode).then(function(resp) {
		    		if(resp.data.success){
		    			AlertModalService.openModal('maint-request-appt.html');
		    		}else{
		    			AlertModalService.openModal('maint-request-appt-fail.html');
		    		}
		    	}
		    ).finally(
		    	function() {
		    		
		    		vm.isSubmitted = false;
		    });
		}
    };

    vm.makeNewAppointment=function(repairIssue, dealerCode){
			$rootScope.issueType = repairIssue;
		  	$rootScope.request=$modal.open({
		    templateUrl:'views/components/maintenance/templates/confirmGen1-request.html',
		    size:'sm',
		    windowClass:'popupwindowdiv',
		    resolve:{
		      dealer:function(){
		        return $scope.com;
		      }
		    },
		    controller:'MaintenanceController'
		  });
		}

	$scope.close=function(){

                                         $rootScope.request.dismiss('close');
                            }

	$scope.dealerForAppointment=function(){
		DealerService.setIsMaintPage(true);
		DealerService.openDealerSearch(false);
	}

	// $scope.confirmRequest=function(dealerCode){ 
 //   		MaintenanceService.makeAppointment(issueType, dealerCode).then(function(resp) {
 //            if(resp.data.success){
 //              $rootScope.showError = false;
 //            }else{
 //              $rootScope.showError = true;
 //            }
 //          }
 //      	).finally(
 //        function() {
 //          $modal.open({
 //            templateUrl:'views/components/appointment/templates/appointment-request.html',
 //            size:'md',
 //            windowClass:'popupwindowdiv',
 //            resolve:{
 //              dealer:function(){
 //                return $scope.com;
 //              }
 //            },
 //            controller:'MaintenanceController'
 //          });
 //        });
	// }

    vm.updateOilChange = function() {
    	StatusBarService.showLoadingStatus();
    	MaintenanceService.updateOilChange(vm.oilChangeDetail.mileageOfLastOilChange,
    		vm.oilChangeDetail.mileageTillNextOilChange,vm.oilChangeOption).then(function(data) {
    			vm.oilChangeDetail.mileageTillNextOilChange = vm.oilChangeOption;
    		}).finally(function() {
    			StatusBarService.clearStatus();
    		});
    };

    vm.openConfirmComplete = function(completed) {
    	if(!completed && vm.currentMilestone.crtnMilg <= vm.nextMilestone){
    		var modalInstance = AlertModalService.openModal('maintenance-confirm-complete.html');
		    modalInstance.result.then(function() {
    			vm.completeIgnoreMilestone(false);
		    });  
		}
 	}
	vm.openMaintNotes = function(maintNotes){
		if(vm.currentMilestone.crtnMilg <= vm.nextMilestone){
			vm.maintNotes = maintNotes;
		}
	}
    // ignore: if false, mark milestone as complete, otherwise mark as ignore
    vm.completeIgnoreMilestone = function(ignore) {

    	if (!vm.currentMilestone.completed && 
    			(!vm.currentMilestone.ignored || !ignore) && vm.currentMilestone.crtnMilg <= vm.nextMilestone) {
    		StatusBarService.showLoadingStatus();
	    	var payload = ignore ? {
	    		ignore:ignore,
	    		interval: vm.currentMilestone.crtnMilg
	    	} : {
	    		complete:true,
	    		insMilg:vm.currentMilestone.insMilg ? vm.currentMilestone.insMilg : vm.currentMileage,
	    		interval:vm.currentMilestone.crtnMilg
	    	};
	    	MaintenanceService.updateMilestone(payload).then(function() {
	    		vm.currentMilestone.completed = !ignore;
	    		vm.currentMilestone.ignored = ignore;

	    		// Reset notes value, when ignored. User can only enter notes in ignored status.
	    		if (ignore) {
	    			vm.currentMilestone.plOfWk = null;
	    			vm.currentMilestone.insDt = null;
	    			vm.currentMilestone.insMilg = null;
	    			vm.currentMilestone.notes = '';
	    		}
	    		StatusBarService.clearStatus();
    		});
    	}
    };

    vm.saveNote = function(form) {
    	vm.notesSubmitted = vm.currentMilestone.ignored ? false : true;
    	if (!form.$invalid || (vm.currentMilestone.ignored && !form.notes.$invalid)) {
	    	saveNote();
    	}else{             
        	vm.currentMilestone.insMilg = "";
            if (form['insDt'].$invalid) {
            	vm.toggleMesssage = true;
              	vm.currentMilestone.insDt = "";
          	}
            if (form['plOfWk'].$invalid) {
              	vm.toggleMesssage1 = true;
          		vm.currentMilestone.plOfWk = "";
          	}
          	vm.toggleMesssage2 = true;
          	if (form['insMilg'].$error.pattern) {
          		vm.invalidMilage = true;
          	} else {
          		vm.invalidMilage = false;
          	}              
       	}
    };

    vm.deleteNote = function() {
    	deleteNote();
    };

    function saveNote() {
    	vm.submitted=true;
		if(isNaN(vm.currentMilestone.insMilg)){
			vm.error=true;
			vm.currentMilestone.insMilg="";
		}else{
			vm.error=false;
			StatusBarService.showLoadingStatus();
	    	var date = vm.currentMilestone.insDt;
	    	date = date ? (typeof date === 'string') ? date : parseDate() : '';
	    	var payload = {
				insDt: date,
				plOfWk:vm.currentMilestone.plOfWk,
				insMilg:vm.currentMilestone.insMilg,
				notes:vm.currentMilestone.notes,
				crtnMilg:vm.currentMilestone.crtnMilg
			};

			if (vm.currentMilestone.ignored) {
				payload.insMilg = 0;
		    	payload.plOfWk = '';
		    	payload.insDt = '';
			}

			// insert record if milestone is neither ignored nor completed
			payload.tempNotes=payload.notes;
			var promise = !vm.currentMilestone.ignored && !vm.currentMilestone.completed ? 
				MaintenanceService.saveNote(payload) : MaintenanceService.updateNote(payload);

	    	promise.then(function() {
	    		if (!vm.currentMilestone.ignored) { vm.currentMilestone.completed = true; }
	    		vm.currentMilestone.hasNotes = true;
	    		vm.maintNotes = false;
		    	vm.notesSubmitted = false;
		    	StatusBarService.clearStatus();	    	
	    	});
		}
    	function parseDate() {
    		var ret =
    		(vm.currentMilestone.insDt.getMonth()+1)+'/'+
			vm.currentMilestone.insDt.getDate()+'/'+
			vm.currentMilestone.insDt.getFullYear();
			return ret;
    	}    	
    }

    function deleteNote() {
    	StatusBarService.showLoadingStatus();
    	MaintenanceService.deleteNote(vm.currentMilestone.crtnMilg).then(function() {
    		vm.currentMilestone.insDt = '';
    		vm.currentMilestone.plOfWk = '';
    		vm.currentMilestone.insMilg = '';
    		vm.currentMilestone.notes = '';
    		vm.currentMilestone.completed = false;
	    	vm.currentMilestone.ignored = false;
	    	vm.currentMilestone.hasNotes = false;
	    	vm.maintNotes = false;
	    	vm.notesSubmitted = false;
    		StatusBarService.clearStatus();
    	});
    }

	function getIntervalDetail(index, interval) {
		vm.detailAndNotes = true;
		vm.intervalDetail = undefined;
		MaintenanceService.getIntervalDetail(interval).then(function(data) {
			vm.milestones[index].intervalDetail = data;
			vm.intervalDetail = data;
			vm.detailAndNotes = false;
		});
	}

	function checkResolved() {
		if (milesStonesDone && currApptsDone && oilChangeDone && dtcDone) {
			StatusBarService.clearStatus();
		}
	}

	// start loading data
	StatusBarService.showLoadingStatus();

	VehicleStatusService.getLatestVehicleStatus().then(function(data){
  		vm.vehicleStatus = data;
      	vm.vStatus = vm.vehicleStatus[0].serviceResponse.timeStampVO.unixTimestamp;
     });


	ResolveService.resolveMultiple([MaintenanceService.getMileStones, MaintenanceService.getCompleteIgnoreInfo, CarInfoService.getCarInfo])
		.then (function(data) {		
			vm.dtcCnt=data[2].selectedVehicle.dtcCnt;	
			var processedData = MaintenanceService.processMilestones(data[0], data[1],data[2]);	
			
			vm.milestones = processedData.milestones;
			vm.currentMileage = processedData.currentMileage;
			vm.milesToNextInterval = processedData.milesToNextInterval;
			vm.nextMilestone = processedData.nextMilestone;
			vm.prevMilestone = processedData.prevMilestone;

			var arrowWidth = 23,
				currentDelta = (processedData.currentMileage - processedData.prevMilestone),
				nextDelta = (processedData.nextMilestone - processedData.prevMilestone),
				widthMultiplier = (currentDelta / nextDelta);
			
			vm.milestoneBarWidth = widthMultiplier * 631 - arrowWidth;
			vm.milestoneBarWidthMob = widthMultiplier * 250 - arrowWidth;
			//vm.milestoneBarWidth = (vm.currentMileage === 0) ? '0px' : 100.0*(vm.currentMileage/vm.nextMilestone) + '%'; 
			
			if (vm.milestones.length === 0) { vm.hasIntervals = false; }
			else                            { 
				vm.hasIntervals = true;  
				vm.milestonesCount = vm.milestones.length;
				// find current milestone index
				var i;
				var setIndex = 0;
				for (i = 0; i <vm.milestones.length; i++) {
					if (vm.currentMileage < vm.milestones[i]['crtnMilg']) { setIndex = i; break; }
				}
				vm.currentMilestoneIndex = setIndex < 0 ? 0 : setIndex;
				vm.setMilestoneIndex(0); 
			}			
	}).finally(function() {
		milesStonesDone = true;
		checkResolved();
	});

	MaintenanceService.getCurrentAppointments().then(function(data) {		
		vm.currentAppointments = data;
	}).finally(function() {
		currApptsDone = true;
		checkResolved();
	});

	MaintenanceService.getOilChangeDetail().then(function(data) {		
		vm.oilChangeDetail = data;
		vm.oilChangeOption = vm.oilChangeDetail.currentOilChangeInterval.toString();
	}).finally(function() {
		oilChangeDone = true;
		checkResolved();
	});

	MaintenanceService.getDtcDetails().then(function(data) {		
		vm.dtc = data.dtcDetails.length;
		vm.showPowerTrain = false;
		vm.showChassis = false;
		vm.showSafety = false;

		var i;
		for (i=0;i<vm.dtc;i++) {
			if ((data.dtcDetails[i].dtcActive === 'Y') || ($cookies['gen'] !== 'kh')) {
				var name = data.dtcDetails[i].systemName;
				if ( name === 'Powertrain')  { vm.showPowerTrain = true; }
				else if (name === 'Safety')  { vm.showSafety = true; }
				else if (name === 'Chassis') { vm.showChassis = true; }
			}
		}

	}).finally(function() {
		dtcDone = true;
		checkResolved();
	});

	$anchorScroll(0);
};
