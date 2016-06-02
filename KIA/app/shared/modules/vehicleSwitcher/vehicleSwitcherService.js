'use strict';

module.exports = /*@ngInject*/ function($state, $cookies, HttpService) {
  return {
    switchVehicle : function(type,vin) {
      var url = '/ccw/com/setCurrentVehicleTop.do?vin='+vin;
      //var _genType = $cookies['gen'];

      HttpService.post(url,{}).success(function(data) {
        if (data.success) {
          //CommonService.genType(type);
          //CommonService.vin(vin);
          $cookies['gen'] = type;
          $cookies['vin'] = vin;

          var state = type === 'psev' ? type + '.connect' : type + '.overview';
          if ($state.is(state)) { $state.reload(); }
          else { $state.go(state); }
      
        }
      });
    },

    switchVehicleToMaintenance: function(type,vin) {
      var url = '/ccw/com/setCurrentVehicleTop.do?vin='+vin;
      HttpService.post(url,{}).success(function(data) {
        if (data.success) {          
          $cookies['gen'] = type;
          $cookies['vin'] = vin;
          var state = type === 'psev' ? type + '.battery' : type + '.maintenance';
          if ($state.is(state)) { $state.reload(); }
          else { $state.go(state); }      
        }
      });      
    }
  };
};
