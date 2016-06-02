'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {

    $httpBackend.whenGET(/ccw\/kh\/remoteCommandsLog\.do/).respond(function(method, url, data) {
        var returnData;        
        var commandLogData = 

    {
    "serviceResponse": [
        {
            "status": "E",
            "vin": "KNALW4D46F6023401",
            "modifiedDate": 1438041793000,
            "serviceId": "RDO-B",
            "scenarioName": "REMOTE DOOR UNLOCK",
            "year": 2015,
            "month": 7,
            "day": 27,
            "hour": 17,
            "minute": 3,
            "seconds": 13
        },
        {
            "status": "E",
            "vin": "KNALW4D46F6023401",
            "modifiedDate": 1438041793000,
            "serviceId": "RDO-B",
            "scenarioName": "REMOTE DOOR UNLOCK",
            "year": 2015,
            "month": 7,
            "day": 27,
            "hour": 17,
            "minute": 3,
            "seconds": 13
        },
        {
            "status": "E",
            "vin": "KNALW4D46F6023401",
            "modifiedDate": 1438041793000,
            "serviceId": "RDO-B",
            "scenarioName": "REMOTE DOOR UNLOCK",
            "year": 2015,
            "month": 7,
            "day": 27,
            "hour": 17,
            "minute": 3,
            "seconds": 13
        },
        {
            "status": "E",
            "vin": "KNALW4D46F6023401",
            "modifiedDate": 1438041793000,
            "serviceId": "RDO-B",
            "scenarioName": "REMOTE DOOR UNLOCK",
            "year": 2015,
            "month": 7,
            "day": 27,
            "hour": 17,
            "minute": 3,
            "seconds": 13
        },
        {
            "status": "E",
            "vin": "KNALW4D46F6023401",
            "modifiedDate": 1438041793000,
            "serviceId": "RDO-B",
            "scenarioName": "REMOTE DOOR UNLOCK",
            "year": 2015,
            "month": 7,
            "day": 27,
            "hour": 17,
            "minute": 3,
            "seconds": 13
        },
        {
            "status": "E",
            "vin": "KNALW4D46F6023401",
            "modifiedDate": 1438041793000,
            "serviceId": "RDO-B",
            "scenarioName": "REMOTE DOOR UNLOCK",
            "year": 2015,
            "month": 7,
            "day": 27,
            "hour": 17,
            "minute": 3,
            "seconds": 13
        },
        {
            "status": "E",
            "vin": "KNALW4D46F6023401",
            "modifiedDate": 1438033692000,
            "serviceId": "RSC-BR",
            "scenarioName": "REMOTE START (WITH CLIMATE)",
            "year": 2015,
            "month": 7,
            "day": 27,
            "hour": 14,
            "minute": 48,
            "seconds": 12
        }
    ],
    "statuscode": "200",
    "success": true
}


        returnData = commandLogData;
        return [200, returnData, {}];
    });
});