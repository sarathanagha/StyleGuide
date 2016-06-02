'use strict';

/*@ngInject*/
angular.module('uvo')
.run(function($httpBackend) {
  
    $httpBackend.whenGET(/\/ccw\/kh\/outsideTemp\.do/).respond(function(method,url,data) {
      var returnData = {
        "serviceResponse": {
            "tempC": 29.3,
            "weather": "Partly Cloudy",
            "temp": 84.7
        },
        "tid": "c3U_ffLiSpC-qe4UzrVy7A",
        "statuscode": "200",
        "success": true
        }
              return [200, returnData, {}];
        });
     $httpBackend.whenPOST(/\/ccw\/kh\/remoteStart\.do/).respond(function(method,url,data) {
      var returnData = {
        
        }
              return [200, returnData, {}];
        });
$httpBackend.whenGET(/\/ccw\/kh\/vehicleStatusRemote\.do/).respond(function(method,url,data) {
      var returnData = [
    {
        "serviceResponse": {
            "timeStampVO": {
                "year": 0,
                "month": 0,
                "day": 0,
                "hour": 0,
                "minute": 0,
                "seconds": 0,
                "unixTimestamp": 1439865453
            },
            "latestVehicleStatus": {
                "airCtrlOn": false,
                "engine": false,
                "doorLock": false,
                "doorOpen": {
                    "frontLeft": 0,
                    "frontRight": 0,
                    "backLeft": 0,
                    "backRight": 0
                },
                "trunkOpen": false,
                "airTemp": {
                    "value": "01H",
                    "unit": 0
                },
                "defrost": false,
                "lowFuelLight": true,
                "acc": false
            }
        },
        "statuscode": "200",
        "success": true
    },
    {
        "lockStatus": "Z",
        "unlockStatus": "Z",
        "remoteStopStatus": "Z",
        "remoteStartStatus": "Z",
        "remoteStartPendingObject": {
            "airCtrl": 0,
            "defrost": false,
            "airTemp": {
                "value": "02H",
                "unit": 0
            },
            "igniOnDuration": 10
        },
        "remoteStartStatusCreatedTime": 1439866633
    }
]
              return [200, returnData, {}];
        });
    
    $httpBackend.whenGET(/\/ccw\/kh\/scheduledInfo\.do/).respond(function(method,url,data) {
      var returnData = {
        "serviceResponse": [
        {
            "climateIndex": 0,
            "reservHvacInfoDetail": {
                "airTemp": {
                    "unit": 1,
                    "value": {
                        "hexValue": "11"
                    }
                },
                "climateSet": "false",
                "defrost": "false",
                "reservInfo": {
                    "day": [
                        "0",
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6"
                    ],
                    "time": {
                        "time": "1250",
                        "timeSection": 1
                    }
                }
            },
            "schedId": 201
        },
        {
            "climateIndex": 1,
            "reservHvacInfoDetail": {
                "airTemp": {
                    "unit": 1,
                    "value": {
                        "hexValue": "20"
                    }
                },
                "climateSet": "true",
                "defrost": "true",
                "reservInfo": {
                    "day": [
                        "0",
                        "1",
                        "5",
                        "6"
                    ],
                    "time": {
                        "time": "0740",
                        "timeSection": 0
                    }
                }
            },
            "schedId": 231
        }
        ],
        "statuscode": "200",
        "success": true
        }
              return [200, returnData, {}];
        });
$httpBackend.whenGET(/\/ccw\/kh\/reserveHVAC\.do/).respond(function(method,url,data) {
      var returnData = {
        "statuscode": "200",
        "success": true
        }
              return [200, returnData, {}];
        });

});