'use strict';

module.exports = /*@ngInject*/ function($modal, AwardsService) {

  var vm = this;
  vm.moduleLoaded = false;
  vm.vehicles;
  var acctType;
AwardsService.getVehicleList().then(function(resp){ 
  vm.vehicles  = resp;  
  AwardsService.getAwards(findVehicleTypeOfAccount(vm.vehicles)).then(function(data) {
    vm.awards = data;
    vm.moduleLoaded = true;
  });
});

  function findVehicleTypeOfAccount(){
     var genType = '', isGen1plus= false, isKh= false, isGen1= false, isPsev = false;      
     angular.forEach(vm.vehicles, function(val, key){
        genType = val.gen;
        if(genType === 'gen1plus'){ 
           isGen1plus = true;
        }else if(genType === 'kh'){
          isKh = true;
        }else if(genType === 'gen1'){
          isGen1 = true;
        }else if(genType === 'psev'){
          isPsev = true;
        }
      });
      if( !isGen1plus && !isKh){
        if(isGen1 && !isPsev){
          return 'gen1Only';
        }else if(isPsev && !isGen1){
          return 'psevOnly';       
        }else if(isGen1 && isPsev){
          return 'gen1Only';       
        }
      }else{
        if(isGen1plus){
          return 'gen1Plus';       
        }else if(isKh){
          return 'kh';       
        }
      }
  }

  vm.open = function() {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'AwardsModalController',
      controllerAs: 'vm',
      size: 'lg',
      windowClass:'awards-modal',
      resolve: {
        data: function() { return vm.awards; }
      }
    });
  };
};
