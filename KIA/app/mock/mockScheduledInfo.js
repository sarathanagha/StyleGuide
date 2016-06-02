'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {

    $httpBackend.whenGET(/ccw\/ev\/scheduledInfoCached\.do/).respond(function(method, url, data) {
        var returnData;
        var scheduledInfo = {"reservInfos":{"reservChargeInfo":[{"chargeIndex":0,"reservChargeInfoDetail":{"chargeRatio":0,"reservInfo":{"day":["0","1","3","5"],"time":{"time":"0440","timeSection":0}},"reservType":1,"resvChargeSet":true}},{"chargeIndex":1,"reservChargeInfoDetail":{"chargeRatio":100,"reservInfo":{"day":["0","1","2","4","6"],"time":{"time":"0220","timeSection":1}},"reservType":1,"resvChargeSet":false}}],"reservHvacInfo":[{"climateIndex":"0","reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"0A"}},"climateSet":"true","defrost":"true","reservInfo":{"day":["0","2","3"],"time":{"time":"1140","timeSection":0}}}},{"climateIndex":"0","reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"0D"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["0","1","4","5"],"time":{"time":"0550","timeSection":0}}}}]}};

        returnData = scheduledInfo;
        return [200, returnData, {}];
    });

    $httpBackend.whenGET(/ccw\/ev\/scheduledInfo\.do/).respond(function(method, url, data) {
        var returnData;
        var scheduledInfo = {"reservInfos":{"reservChargeInfo":[{"chargeIndex":0,"reservChargeInfoDetail":{"chargeRatio":0,"reservInfo":{"day":["0","1","2","3","4"],"time":{"time":"0550","timeSection":0}},"reservType":1,"resvChargeSet":true}},{"chargeIndex":1,"reservChargeInfoDetail":{"chargeRatio":100,"reservInfo":{"day":["1","3","5"],"time":{"time":"0220","timeSection":1}},"reservType":1,"resvChargeSet":false}}],"reservHvacInfo":[{"climateIndex":"0","reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"0A"}},"climateSet":"true","defrost":"true","reservInfo":{"day":["5","6"],"time":{"time":"1140","timeSection":0}}}},{"climateIndex":"0","reservHvacInfoDetail":{"airTemp":{"unit":1,"value":{"hexValue":"0D"}},"climateSet":"false","defrost":"false","reservInfo":{"day":["4","5"],"time":{"time":"0550","timeSection":0}}}}]}};

        returnData = scheduledInfo;
        return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/\/ccw\/ev\/reserveCharge\.do/).respond(function(method, url, data) {
      console.log("mock psev charge: ",method, url, data);
      var returnData = {'success':true};

      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/\/ccw\/ev\/reserveHvac\.do/).respond(function(method, url, data) {
      console.log("mock psev hvac: ",method, url, data);
      var returnData = {'success':true};

      return [200, returnData, {}];
    });

});
