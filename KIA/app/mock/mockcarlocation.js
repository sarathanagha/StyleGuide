'use strict';

/*@ngInject*/
angular.module('uvo')
.run(function($httpBackend) {
  

$httpBackend.whenGET(/\/ccw\/kh\/carLocation\.do/).respond(function(method,url,data) {
  var returnData = {
/*
    "success": false,
    "statuscode": "504",
    "errorMessage": "We're sorry, we were unable to connect to your vehicle. Try moving the vehicle to an area with better network coverage.  If the problem persists, call consumer assistance at 855-4KIA-VIP"
*/
    "serviceResponse": {
        "coord": {
            "lat": 33.668239,
            "lon": -117.876069,
            "alt": 0,
            "type": 0
        },
        "head": 177,
        "speed": {
            "value": 0,
            "unit": 1
        },
        "accuracy": {
            "hdop": 256,
            "pdop": 256
        },
        "time": "20150723120241"
    },
    "tid": "Wwn1Z-E8RtilKP_u5BqbDQ",
    "statuscode": "200",
    "success": true
}
    
          return [200, returnData, {}];
          
    });

});