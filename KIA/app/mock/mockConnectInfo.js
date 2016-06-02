'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {

  	/* This mock data was duplicated in mockOverview.js */
    /*$httpBackend.whenGET(/ccw\/ev\/vehicleStatusCached\.do/).respond(function(method, url, data) {
        var returnData;
        var connectInfo = {
		    'serviceResponse': [{
		    "airCtrlOn": "false",
		    "engine": "false",
		    "doorLock": true,
		    "doorOpen": {
		        "frontLeft": "0",
		        "frontRight": "0",
		        "backLeft": "0",
		        "backRight": "0"
		    },
		    "trunkOpen": "false",
		    "airTemp": {
		        "unit": 1,
		        "value": {
		            "hexValue": "01"
		        }
		    },
		    "defrost": "false",
		    "acc": "false",
		    "eVStatus": {
		        "batteryCharge": false,
		        "drvDistance": [
		            {
		                "type": 2,
		                "distanceType": {
		                    "value": 17,
		                    "unit": 3
		                }
		            }
		        ],
		        "batteryStatus": 18,
		        "batteryPlugin": 0,
		        "remainTime": [
		            {
		                "value": 0,
		                "unit": 1
		            },
		            {
		                "value": 0,
		                "unit": 1
		            }
		        ]
		    },
		    "userTempPref": 1
		}],
		    'statuscode': '200',
		    'success': true
		};

        returnData = connectInfo;
        return [200, returnData, {}];
    });*/

	$httpBackend.whenGET(/ccw\/ev\/isAsyncServiceBlocked\.do/).respond(function(method, url, data) {
		var returnData;
        var serviceBlockData = {
		    'blocked': '0',
		    'errorCode': '403',
		    'serviceName': 'Remote Door Unlock',
		    'success': true
		};

        returnData = serviceBlockData;
        return [200, returnData, {}];
	});

 $httpBackend.whenGET(/ccw\/ev\/outsideTemp\.do/).respond(function(method, url, data) {
        var returnData;
        var tempInfo = 71.5;

        returnData = tempInfo;
        return [200, returnData, {}];
    });
});
