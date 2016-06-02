'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {

    $httpBackend.whenGET(/ccw\/kh\/drivingActivity\.do/).respond(function(method, url, data) {
        var returnData;
        var khData = 
        {
		    'monthlyStat': [
		    {
		        'vin': 'KNALW4D46F6023401',
		        'csmrId': 'MUV0000000000000000088992',
		        'year': 2015,
		        'month': 4,
		        'startOdometer': 0,
		        'endOdometer': 0,
		        'idleTime': 282,
		        'efficientScore': 76,
		        'inefficientScore': 24,
		        'aveSpeed': 11,
		        'awardCount': '3', 
		        'aveAccel': 7074,
		        'secsDriven': 3234,
		        'minsDriven': 22.400002,
		        'hrsDriven': 0.01,
		        'hrsDrivenDisp': '0',
		        'milesDriven': 2,
		        'aveMph': 0,
		        'dayCount': 2
		    },
		    {
		        'vin': 'KNALW4D46F6023401',
		        'csmrId': 'MUV0000000000000000088992',
		        'year': 2015,
		        'month': 5,
		        'startOdometer': 0,
		        'endOdometer': 0,
		        'idleTime': 1985,
		        'efficientScore': 0,
		        'inefficientScore': 100,
		        'aveSpeed': 11,
		        'awardCount': '3',
		        'aveAccel': 7074,
		        'secsDriven': 1344,
		        'minsDriven': 22.400002,
		        'hrsDriven': 0.37333333,
		        'hrsDrivenDisp': '0',
		        'milesDriven': 8,
		        'aveMph': 0,
		        'dayCount': 2
		    }],
		    'currentMileage': 1712,
		    'numAwards': 3
		};
		
        returnData = khData;
        return [200, returnData, {}];
    });

    $httpBackend.whenGET(/ccw\/kh\/drivingPeakHours\.do/).respond(function(method, url, data) {
        var returnData;
        var khData = 
        {
		    'serviceResponse': [{
		        'hr0SECOND': 0,
		        'hr1SECOND': 0,
		        'hr2SECOND': 0,
		        'hr3SECOND': 0,
		        'hr4SECOND': 0,
		        'hr5SECOND': 0,
		        'hr6SECOND': 0,
		        'hr7SECOND': 0,
		        'hr8SECOND': 0,
		        'hr9SECOND': 0,
		        'hr10SECOND': 0,
		        'hr11SECOND': 0,
		        'hr12SECOND': 0,
		        'hr13SECOND': 0,
		        'hr14SECOND': 0,
		        'hr15SECOND': 0,
		        'hr16SECOND': 0,
		        'hr17SECOND': 0,
		        'hr18SECOND': 0,
		        'hr19SECOND': 0,
		        'hr20SECOND': 0,
		        'hr21SECOND': 0,
		        'hr22SECOND': 0,
		        'hr23SECOND': 0
		    }],
		    'statuscode': '200',
		    'success': true
		};

		
        returnData = khData;
        return [200, returnData, {}];
    });
});
