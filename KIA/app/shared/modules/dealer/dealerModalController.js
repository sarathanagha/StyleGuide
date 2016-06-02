'use strict';

module.exports = /*@ngInject*/ function(DealerService, VehicleSwitcherService, $cookies, $modalInstance, $q, $timeout) {

  var vm = this,
      scroll,
      pageSize = 3,
      wrapper,
      genType = $cookies['gen'],
      vin = $cookies['vin'],
      preferredDealer = {};

  vm.pageLimit = 3; // increases as user hits load more
  vm.showLoadMore = false;  
  vm.dealers = [];
  vm.showFilter = ( genType === 'gen1' || genType === 'gen1plus' || genType == 'kh' || genType == 'psev'); 
  vm.showOilChange = ( genType !== 'kh' );
  vm.disableDropdown = ( genType === 'gen1' || genType === 'gen1plus' || genType == 'kh' || genType == 'psev'); 

  vm.defaultDealerList = ['ALL','SOUL EV','K900'];
  if(genType === 'gen1' || genType === 'gen1plus'){
    vm.selectVehicleType = 'ALL';
  }else if(genType == 'kh'){
    vm.selectVehicleType = 'K900';
  }else vm.selectVehicleType = 'SOUL EV';

  if(genType === 'kh'){
    vm.hideDropdown = true;
  }

  //vm.selectVehicleType = 'K900';
  
  vm.noDealer = DealerService.getHasPreferredDealer();
  vm.isMaintPage = DealerService.getIsMaintPage();

  vm.loadMore = function() {
    vm.pageLimit += 3; 
    scrollToEnd();       
    if (vm.pageLimit >= vm.dealers.length) {
      vm.showLoadMore = false;
    }
  };
vm.flag=true;
  vm.setDealer = function(dealer) {    
    if (!dealer.preferred) {
      if(vm.flag==true){
        vm.flag=false;

      dealer.processing = true;
      DealerService.setPreferredDealer(dealer).then(function(data) { 

        dealer.processing = false;
        var i;
        for (i = 0; i < vm.dealers.length; i++) {
          vm.dealers[i].preferred = false;
        }
        dealer.preferred = true;
        vm.noDealer=true;    
        $modalInstance.close(); 
        if(!vm.isMaintPage){
        VehicleSwitcherService.switchVehicle(genType,vin);}
      });
      }
      
    } else {
       dealer.preferred = true;
    }
  };

  vm.close = function() {
    $modalInstance.dismiss();
  };

  vm.getDealers = function(event) {        
    if (event && event.keyCode !== 13) {
      return;
    }
    vm.noDealer=true;    
    DealerService.getDealers(genType,vm.zip).then(function(data) { 
      vm.dlrInRadius = false; 
      vm.invalidZip =  false;
      vm.hideZip = false;
      if(data.dealers != "") {
        vm.dealers = data.dealers; 
        vm.showSearch = true;
        vm.hideZip = true;
        vm.dlrInRadius = !data.dlrInRadius; 
        //refreshScroll();
      }else{
        vm.dealers = [];
        vm.invalidZip = true;
      }   
        refreshScroll();
    });
  };  

  function getPreferredDealer() {
    DealerService.getPreferredDealer(genType,vin).then(function(data) {
      if (data && (data.length !== 0 || Object.keys(data).length !== 0)) {
        preferredDealer = data;
        vm.zip = data.zipCode;
        vm.dealers.push(data);
        vm.dealers[0].preferred = true;
        refreshScroll();
      }      
    });
  }
  function generateIScroll(selector) {
    var deferred = $q.defer();
     // give window of animation with $timeout
     $timeout(function() {
       wrapper = $(selector);
       scroll = new IScroll(wrapper.get(0), {
          scrollbars            : 'custom',
          mouseWheel            : true,
          interactiveScrollbars : true,
          click                 : true
          //snap                  : 'li'
       }); 
       deferred.resolve();
     },500);
     return deferred.promise;
 }

 function refreshScroll() {
   $timeout(function() {

     // adjust height of scroller
     var resultCount = vm.dealers.length;
     var numToShow = Math.min(pageSize, resultCount);
     wrapper.css('height', 145 * numToShow + 'px');

     if (resultCount > vm.pageLimit) {
       vm.showLoadMore = true;
     } else {
       vm.showLoadMore = false;
     }

     scroll.refresh();
     scroll.scrollTo(0,0);
   });
 }

 function scrollToEnd() {
   $timeout(function() {

     // adjust height of scroller
     var resultCount = vm.dealers.length;
     var numToShow = Math.min(pageSize, resultCount);
     //wrapper.css('height', 145 * numToShow + 'px');
     if (resultCount > vm.pageLimit) {
       vm.showLoadMore = true;
     } else {
       vm.showLoadMore = false;
     }

     scroll.refresh();
     scroll.scrollTo(0, scroll.maxScrollY, 0);
   });
 }
  // initialize
  generateIScroll('#dealerSearchList').then(function() {
    DealerService.hasPreferredDealer($cookies['gen'],$cookies['vin']).then(function(hasDealer) {
      if (hasDealer) {
        getPreferredDealer();
      }
    });
  });
  
};
