'use strict';

module.exports = /*@ngInject*/ function($modal,$document,$timeout) {
  return {
    restrict : 'E',
    replace : true,
    templateUrl: 'views/shared/modules/idle/idle-modal-directive.html',
    link: function (scope,element,attrs) {
      var idleState = false;
      var idleTimer = null;
      var totalIdleTime = 15*60*1000;
      $document.bind('mousemove click mouseup mousedown keydown keypress keyup submit change mouseenter scroll resize dblclick', function () {

       $timeout.cancel(idleTimer);
       idleState = false;
       idleTimer = $timeout(function () {
           $modal.open({
              templateUrl: 'idle-modal',
              controller: 'IdleModalController',
              controllerAs: 'vm',
              windowClass: 'idle-modal',
              keyboard: false,
              backdrop: 'static'
           });
         idleState = true; 
       }, totalIdleTime);
     });
      $document.trigger("mousemove");

    }
  };
};
