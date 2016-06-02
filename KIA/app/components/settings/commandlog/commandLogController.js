'use strict';


module.exports = /*@ngInject*/ function($scope, $filter, commandLogService) {
	var vm = this;
	vm.mappedVehicles = {};
	vm.limit=5;
    vm.hide_loadmore = false;


	commandLogService.getCommandLog().then(function(data) {        
       vm.commandLogData =data.serviceResponse; 
       if(vm.commandLogData.length <= 5 ){
         vm.limit = vm.commandLogData.length;
         vm.hide_loadmore = true;
       }   
       angular.forEach(vm.commandLogData,function(val){    	
        val.date=new Date(val.modifiedDate);    	
       });   
  });

commandLogService.getVehicles().then(function(data1) {
   vm.khData =data1.vehicles;

    for (var i = 0; i < data1.vehicles.length; i++) {
        vm.mappedVehicles[data1.vehicles[i].vin] = data1.vehicles[i].vehNick;
    }

  });


    vm.loadmore=function(){
        vm.limit=vm.commandLogData.length; 
        vm.hide_loadmore = true;
    };
};
