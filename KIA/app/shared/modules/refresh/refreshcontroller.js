'use strict';

module.exports = /*@ngInject*/ function($state,$location,$rootScope,climateService) {

  var vm = this;
 
if($location.path()=='/kh/climate'){
vm.inClimateControl=true;
    }
    
  $rootScope.$on('$stateChangeStart', 
function(event, toState, toParams, fromState, fromParams){  
    if(toState.url=='/kh/climate'){
vm.inClimateControl=true;
    }
    else{
vm.inClimateControl=false
    }
   
})

  climateService.remoteVehicleStatus().then(function(resp){
   	var update=resp[0].serviceResponse.timeStampVO.unixTimestamp;
vm.lastupdated=moment(update * 1000).format("MMMM DD, YYYY h:mm a");

   });
  vm.refreshvehicle = function(e) {
   
   
   climateService.remoteVehicleStatus().then(function(resp){
   	var update=resp[0].serviceResponse.timeStampVO.unixTimestamp;
vm.lastupdated=moment(update * 1000).format("MMMM DD, YYYY h:mm a");
$rootScope.$broadcast('refreshin');
   });


  };
 
};
