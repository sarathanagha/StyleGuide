angular.module('uvo')
.run(function($httpBackend) {

    $httpBackend.whenGET(/\/ccw\/kh\/vehicleStatus\.do/).respond(function(method,url,data) {
        var responseData; 
       var vehicleStatus= {
    "serviceResponse": {
        "timeStampVO": {
            "year": 0,
            "month": 0,
            "day": 0,
            "hour": 0,
            "minute": 0,
            "seconds": 0,
            "unixTimestamp": 1442610738
        },
        "latestVehicleStatus": {
            "airCtrlOn": false,
            "engine": false,
            "doorLock": true,
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
            "lowFuelLight": false,
            "acc": false
        }
    },
    "statuscode": "200",
    "success": true
}
responseData = vehicleStatus;
        return [200, responseData, {}];
    });

$httpBackend.whenGET(/\/ccw\/kh\/latestVehicleStatus\.do/).respond(function(method,url,data) {
        var responseData; 
       var vehicleStatus= {

        
    "serviceResponse": {
        "timeStampVO": {
            "year": 2015,
            "month": 9,
            "day": 18,
            "hour": 16,
            "minute": 13,
            "seconds": 14,
            "unixTimestamp": 1442617994
        },
        "latestVehicleStatus": {
            "airCtrlOn": false,
            "engine": false,
            "doorLock": true,
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
            "lowFuelLight": false,
            "acc": false
        }
    },
    "tid": "LWPw8NegSCiZA8ISSMVUwQ",
    "statuscode": "200",
    "success": true
}

responseData = vehicleStatus;
        return [200, responseData, {}];
    });
$httpBackend.whenGET(/\/ccw\/kh\/vehicleStatusRemote\.do/).respond(function(method,url,data) {
        var responseData; 
       var vehicleStatus= 
        [
    {
        "serviceResponse": {
            "timeStampVO": {
                "year": 0,
                "month": 0,
                "day": 0,
                "hour": 0,
                "minute": 0,
                "seconds": 0,
                "unixTimestamp": 1442617994
            },
            "latestVehicleStatus": {
                "airCtrlOn": false,
                "engine": false,
                "doorLock": true,
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
                "lowFuelLight": false,
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
        "remoteStartStatus": "Z"
    }
]


responseData = vehicleStatus;
        return [200, responseData, {}];

    });

});