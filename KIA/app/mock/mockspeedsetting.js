'use strict';

/*@ngInject*/
angular.module('uvo')
.run(function($httpBackend) {

    $httpBackend.whenGET(/\/ccw\/kh\/speedLimitAlertSettings\.do/).respond(function(method,url,data) {
        var responseData; 
       var speedalertsettinginfo= {
    "serviceResponse": {
        "Active": "A",
        "MCZStatus": {
            "GEOONOFF": 0,
            "GEOCONFIG": 0,
            "CURFEWONOFF": 0,
            "CURFEWCONFIG": 0
        },
        "SpeedAlertList": [
            {
                "speedConfigId": 1374,
                "vin": "KNALW4D46F6023401",
                "csmrId": "MUV0000000000000000089185",
                "active": "A",
                "speed": "60",
                "speedUom": "1",
                "speedTime": 10,
                "speedTimeUom": "1",
                "createdUser": "WGPCCWUSR",
                "createdDate": 1437675442000,
                "modifiedUser": "UVODS",
                "modifiedDate": 1437675493000,
                "status": "C",
                "action": null
            }
        ],
        "TmuStatus": "I",
        "LatestConfig": true
    },
    "statuscode": "200",
    "success": true
},
responseData = speedalertsettinginfo;
        return [200, responseData, {}];
    });


$httpBackend.whenGET(/\/ccw\/cp\/speedLimitAlertSettings\.do/).respond(function(method,url,data) {
        var responseData; 
       var speedalertsettinginfo= {
    "serviceResponse": {
        "Active": "A",
        "MCZStatus": {
            "GEOONOFF": 0,
            "GEOCONFIG": 0,
            "CURFEWONOFF": 0,
            "CURFEWCONFIG": 0
        },
        "SpeedAlertList": [
            {
                "speedConfigId": 1374,
                "vin": "KNALW4D46F6023401",
                "csmrId": "MUV0000000000000000089185",
                "active": "A",
                "speed": "60",
                "speedUom": "1",
                "speedTime": 10,
                "speedTimeUom": "1",
                "createdUser": "WGPCCWUSR",
                "createdDate": 1437675442000,
                "modifiedUser": "UVODS",
                "modifiedDate": 1437675493000,
                "status": "C",
                "action": null
            }
        ],
        "TmuStatus": "I",
        "LatestConfig": true
    },
    "statuscode": "200",
    "success": true
}
    });
});
