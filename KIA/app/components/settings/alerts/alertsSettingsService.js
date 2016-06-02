'use strict';

module.exports = /*@ngInject*/ function(HttpService, $q) {

  // init mapping
  var maintenanceMap = {
    'maint1' : {'name':'maint1','description':'500 miles before maintenance'},
    'maint2' : {'name':'maint2','description':'1000 miles before maintenance'},
    'maint3' : {'name':'maint3','description':'1500 miles before maintenance'},
    'vehicleReport' :{'name':'vehicleReport','description':'When a Vehicle Health Report is available'},
  };

  var uvoMap = {
    'softwareUpdate' : {'name':'softwareUpdate','description':'When there are software updates, new features, and service announcements'}
  };

  var evMap = {
    'chargeClimateRequest' : {'name':'chargeClimateRequest','description':'Charge and Climate Control requests'},
    'lockRequests' :{'name':'lockRequests','description':'Lock/Unlock requests'}
  };

  var khMap = {
    'remoteDoor' : {'name':'remoteDoor','description':'Remote Door Lock/Unlock'},
    'remoteStart' :{'name':'remoteStart','description':'Remote Start/Stop'},
    'curfew' :{'name':'curfew','description':'Curfew Limit Alert'},
    'geofence' : {'name':'geofence','description':'Geo Fence Alert'},
    'speed' : {'name':'speed','description':'Speed Alert'},
    'oilChange' :{'name':'oilChange','description':'Oil Change Interval Reached'}
  };

  function putToMap(object, extendedData) {
    if (object) {
      object = $.extend(object,extendedData);
    }
  }

  // Maintenance and UVO are Email only
  function processUser(data) {
    if(data == null){
        putToMap(maintenanceMap['maint1'], {'email': false} );
    putToMap(maintenanceMap['maint2'], {'email': false} );
    putToMap(maintenanceMap['maint3'], {'email': false} );
    putToMap(maintenanceMap['vehicleReport'], {'email': false} );
    putToMap(uvoMap['softwareUpdate'], {'email': false} );
    }else{
      putToMap(maintenanceMap['maint1'], {'email': data['maint100'] === 'Y'} );
    putToMap(maintenanceMap['maint2'], {'email': data['maint250'] === 'Y'} );
    putToMap(maintenanceMap['maint3'], {'email': data['maint500'] === 'Y'} );
    putToMap(maintenanceMap['vehicleReport'], {'email': data['diagAlert'] === 'Y'} );
    putToMap(uvoMap['softwareUpdate'], {'email': data['uvoNotif'] === 'Y'} );
  }
    
    
    
  }

  // Psev only deals with SMS and Email
  function processPsev(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].alertType === 'door') {
        putToMap(evMap['lockRequests'], {'sms': data[i].smsFlag, 'email': data[i].emailFlag } );
      } else if (data[i].alertType === 'charge') {
        putToMap(evMap['chargeClimateRequest'], {'sms': data[i].smsFlag, 'email': data[i].emailFlag } );
      }
    }        
  }

  // KH has SMS, Push, and Email
  function processKh(data) {
    putToMap(khMap['remoteDoor'], processVars(data['remoteDoorLock']) );
    putToMap(khMap['remoteStart'], processVars(data['remoteStart']) );
    putToMap(khMap['curfew'], processVars(data['curfewPrefSetNotif']) );
    putToMap(khMap['geofence'], processVars(data['geoFencePrefSetNotif']) );
    putToMap(khMap['speed'], processVars(data['speedPrefSetNotif']) );
    putToMap(khMap['oilChange'], processVars(data['oilChange']) );

    // KH Alerts come in a csv of S,P,E
    function processVars(flags) {
      if (flags) {
        return {
          'sms':flags.indexOf('S') !== -1,
          'push':flags.indexOf('P') !== -1,
          'email':flags.indexOf('E') !== -1
        };
      } else {
        return {'sms':false,'push':false,'email':false};
      }
    }
  }

  function processData(data) {
    processUser(data.userAlerts);
    if (data.psevAlerts) {processPsev(data.psevAlerts);}
    if (data.khAlerts) {processKh(data.khAlerts);}

    return {
      'maintenanceMap' : maintenanceMap,
      'uvoMap' : uvoMap,
      'evMap' : evMap,
      'khMap' : khMap
    };
  }

  function processDataToSave(maint,uvo,ev,kh, types) {
    function processKH(data) {
      var arr = [];
      if (data.sms) {
        arr.push('S');
      }
      if (data.email) {
        arr.push('E');
      }
      if (data.push) {
        arr.push('P');
      }
      return arr.join(',');
    }

    var result = {
        'psevVin': null,
        'csmrId': null,
        'userAlerts':
        {
            'maint100': (maint['maint1'].email) ? 'Y' : null,
            'maint250': (maint['maint2'].email) ? 'Y' : null,
            'maint500': (maint['maint3'].email) ? 'Y' : null,
            'diagAlert': (maint['vehicleReport'].email) ? 'Y' : null,
            'uvoNotif': (uvo['softwareUpdate'].email) ? 'Y' : null,
            'csmrId': null
        },
        'psevAlerts':  [
            {
             'alertType': 'door',
             'smsFlag': ev['lockRequests'].sms,
             'emailFlag': ev['lockRequests'].email
            },
            {
             'alertType': 'charge',
             'smsFlag': ev['chargeClimateRequest'].sms,
             'emailFlag': ev['chargeClimateRequest'].email
            }
        ],
        'khAlerts':
        {
            'healthReport': null,
            'maint1': null,
            'maint2': null,
            'maint3': null,
            'softwareUpdate': null,
            'oilChange': processKH(kh['oilChange']),
            'immedEngClimReq': null,
            'scheduleEngClimReq': null,
            'immedChargeReq': null,
            'scheduleChargeReq': null,
            'lockUnlockReq': null,
            'remoteDoorLock': processKH(kh['remoteDoor']),
            'remoteDoorUnlock': processKH(kh['remoteDoor']),
            'remoteHornLight': '',
            'remoteStart': processKH(kh['remoteStart']),
            'remoteStartTerminate': processKH(kh['remoteStart']),
            'remoteControlStop': null,
            'autoDTCNotif': null,
            'alertOnOffSetNotif': null,
            'curfewPrefSetNotif': processKH(kh['curfew']),
            'geoFencePrefSetNotif': processKH(kh['geofence']),
            'speedPrefSetNotif': processKH(kh['speed']),
            'maintenancePrefSetNotif': null,
            'sendPOI': null
        }
    };

    if (!types.hasKH) {
      result.khAlerts = null;
    }

    if (types.hasEV) {
      result.psevVin = types.evVin;
    } else {
      result.psevAlerts = null;
    }

    return result;
  }

  return {
    getAlerts : function () {
      var deferred = $q.defer();
      HttpService.get('/ccw/set/getAlertsSettings.do').success(function(data) {
        deferred.resolve(processData(data.result));
      });
      return deferred.promise;
    },
    setAlerts : function(maint, uvo, ev, kh, types) {
      return HttpService.post('/ccw/set/saveAlertsSettings.do', processDataToSave(maint, uvo, ev, kh, types));
    }
  };
};
