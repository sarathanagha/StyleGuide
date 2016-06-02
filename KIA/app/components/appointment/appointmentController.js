'use strict';

module.exports = /*@ngInject*/ function(MaintenanceService,$modal, $cookies,$scope,$rootScope, $modalInstance, dealer, DealerService,CommonService) {
  

  //var vm = this;
  $scope.pageLimit = 3;
  $scope.showLoadMore = false;
  $scope.locatedDealers = [];


var genType = $cookies['gen'];
$scope.com=dealer;
  $scope.close=function(){
    $modalInstance.dismiss('close');
  }
  
  $scope.locateDealer=function(event){
    if (event && event.keyCode !== 13) {
      return;
    }
   DealerService.getDealers(genType,$scope.zipcode).then(function(data) {      

      $scope.locatedDealers=data.dealers;
        if ($scope.pageLimit < $scope.locatedDealers.length){

              $scope.showLoadMore = true;
            }
    });

 }

$scope.loadMore = function() {
  
    $scope.pageLimit += 3;

    if ($scope.pageLimit > $scope.locatedDealers.length) {
    $scope.showLoadMore = false;
    }
    else{
      $scope.showLoadMore = true;
    }
};

$scope.Request=function(){
  
  $scope.close();
  $scope.request=$modal.open({
    templateUrl:'views/components/appointment/templates/confirm-request.html',
    size:'sm',
    windowClass:'popupwindowdiv',
    resolve:{
      dealer:function(){
        return $scope.com;
      }
    },
    controller:'appointmentController'
    
  });
}

$scope.changeDealer=function(){

  //$scope.close();
  DealerService.setHasPreferredDealer(true);
  DealerService.setIsMaintPage(true);
  DealerService.openPreferredDealerModal();
  $modalInstance.dismiss('close');
}

$scope.dealerForAppointment=function(){

  //$scope.close();
  DealerService.setIsMaintPage(true);
  DealerService.openDealerSearch(false);
}

$scope.confirmRequest=function(repairType, dealerCode){ 
  
  $scope.close();
   MaintenanceService.makeAppointment(repairType, dealerCode).then(function(resp) {
            if(resp.data.success){
              $rootScope.showError = false;
            }else{
              $rootScope.showError = true;
            }
          }
      ).finally(
        function() {
          $modal.open({
            templateUrl:'views/components/appointment/templates/appointment-request.html',
            size:'md',
            windowClass:'popupwindowdiv',
            resolve:{
              dealer:function(){
                return $scope.com;
              }
            },
            controller:'appointmentController'
          });
        });
}
     
  



     
    

};
