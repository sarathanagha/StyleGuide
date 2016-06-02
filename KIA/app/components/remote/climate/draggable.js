 'use strict';

module.exports = /*@ngInject*/ function($document) {
    
 return {
    restrict: 'A',
    scope: {
      dragOptions: '=ngDraggable'
    },
    link: function(scope, elem, attr) {
      
      var prev={};

      elem.draggable({
        
    start:function(e,ui){
      

    },
           drag: function (e, ui) {
           
           
            var r = angular.element('#wrapdrag').width()/2;
            var small_r = $('#draggable').width()/2;
          
            var origin_x = r - small_r;
            var origin_y = r - small_r;
            var x = ui.position.left - origin_x, y = ui.position.top - origin_y;
            var l = Math.sqrt(x*x + y*y);
            var l_in = Math.min(r - small_r, l);
              
              if(ui.position.left>0&&ui.position.left<300&&ui.position.top>0&&ui.position.top<300)
           
           { 
            
            prev=ui.position;
            ui.position = {'left': x/l*l_in + origin_x, 'top': y/l*l_in + origin_y};
            
            }
              else
            {
              
              ui.position = {'left':prev.left, 'top':prev.top};
            }
        
        }
    });
     
     
    }
  }
};