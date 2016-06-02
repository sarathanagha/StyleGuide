'use strict';

module.exports = /*@ngInject*/ function($modal,$scope,CarInfoService, NotificationsService, $rootScope,
  $cookies, DealerService, ResolveService, $location, $state, $timeout, $document) {
  var com = this;
  com.showMobileNotifications = false;  
  com.preferredDealer = DealerService.preferredDealer();
  com.vehicleType = $cookies.gen;
  $rootScope.$on('mobile',function(ev,arg){
    com.mobile=(arg=='on')?true:false;
  });
  
  if($location.path().indexOf('settings')>-1){
      $rootScope.FromSettings=true;    
  }
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState,fromParams) {
    
    if(toState.url.indexOf('settings')>-1){
      $rootScope.FromSettings=true;
    }
    else{
      $rootScope.FromSettings=false;
    }


    if(fromState.url=='mycarzone'||toState.url.indexOf('sett')>-1||toState.url.indexOf('speed')>-1||toState.url.indexOf('geo')>-1)
     {
      $rootScope.clicked=true;
      
     } 
     else{
      $rootScope.clicked=false;
     
     }
     if(toState.url.indexOf('find')>-1||toState.url.indexOf('lock')>-1)
     {
      $rootScope.parentstat=true;
     } 
     else{
      $rootScope.parentstat=false;
     }

    $rootScope.pageStatusMessage = ''; 
    $rootScope.pageStatus = '';
    com.showMobileNotifications = false;
    if(toState.url=='/psev/appointment'){

      event.preventDefault();
      $modal.open({
        templateUrl:'views/components/appointment/appointment-view.html',
        size:'lg',
        controller:'appointmentController',
        resolve:{
              dealer:function(){
                return com;
              }
        }
      });
    }
    if(toState.url.indexOf('climate')>-1||toState.url.indexOf('lock')>-1||toState.url.indexOf('findMyCar')>-1)
    {
      $rootScope.inClimateControl=true;

    }
    else{
      if(com.mobile==true){
        $rootScope.inClimateControl=false;
      }
      else{
       $rootScope.inClimateControl=true;
     }
   }
 });

  com.notificationsGo = function(path) {
    com.notiRemoteSession();
    $location.path(path);
  };
com.callNoti = false;
com.popUpOpen = false;
  com.notiRemoteSession = function(mobile){
    com.mobile = mobile;
    com.callNoti = !com.callNoti;
    com.showMobileNotifications = !com.showMobileNotifications;
    if(!com.callNoti && com.popUpOpen){
      com.popUpOpen = false;
      com.removeNotifications();
    }else{
      com.popUpOpen = true;
    }
  }

  $document.on("click",function(event){
    if(com.callNoti && !com.mobile){
      com.popUpOpen = false;
      com.callNoti = false;
      com.removeNotifications();
    }
  });

  /*if(!com.callNoti && com.){
    //logiconload
  }*/

 /* window.onclick() {
          if (com.callNoti) {
              com.callNoti = false;
              $scope.$apply();
          }
      }*/

  com.removeNotifications = function(){
    NotificationsService.getRemoteSession().then(function(resp){
        if(resp)
          com.notificationsCall();
      });
  }    

  $scope.$on('notificationJSON', function () {
        com.notificationsCall();
  });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $timeout(function(){
          com.notificationsCall();
         },5000);
  });

  com.notificationsCall = function(){
    NotificationsService.getAlertNotifications().then(function(data){
            com.notifications = data;
        });
  }

  ResolveService.resolveMultiple([CarInfoService.getCarInfo, NotificationsService.getAlertNotifications])
  .then(function(data) {
    com.carInfo = data[0];
    com.notifications = data[1];
  });

  DealerService.getPreferredDealer($cookies['gen'], $cookies['vin']);
  
};

