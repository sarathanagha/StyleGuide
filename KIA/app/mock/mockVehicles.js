'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {


    $httpBackend.whenGET(/\/ccw\/com\/validateVin\.do/).respond(function(method, url, data) {
      var returnData = {'success':true,'data':{'versionType':'UVO','soul2014':true}};

      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/\/ccw\/com\/validateVin\.do/).respond(function(method, url, data) {
      console.log("mock",method, url, data);
      var returnData = {'success':true,'data':{'versionType':'UVO','soul2014':true}};

      return [200, returnData, {}];
    });
    // My Vehicles
    $httpBackend.whenGET(/\/ccw\/com\/vehiclesInfo\.do/).respond(function(method, url, data) {

      var returnData;

      var khData = { 'listMyCarInfo' : [
        { 'vin' : 'KNALU4D33F6023403', // valid kh car
          'mdlNm' : 'K900', 'mdlYr' : '2016',
          'acumTrvgDistMile' : 1548, 'acumTrvgDist' : 200000,
          'nextServiceMile' : 5952, 'tempVin' : 'KNALW4D45F6016794',
          'vehicleCd' : 'NA', 'xrclCd' : '3M',
          'realImgFileNm' : 'failSafe.PNG',
          'cgdsCnt' : '19', 'uvoCnt' : '0',
          'unreadCnt' : '0', 'dtcCnt' : '0',
          'violCnt' : '0', 'poi' : '16',
          'apptCnt' : '0', 'securityPin' : 'Not Available',
          'dtcKh' : 0, 'vehicleStatus' : 'notexists',
          'vehNick' : 'K900', 'odoUpdate' : 'Jan 20, 2014 08:58 PM',
          'endDate' : 1704096000000, 'endMile' : 100000,
          'fuelType' : '0', 'actVin' : 'Y',
          'enrVin' : 'C', 'launchType' : '0',
          'khVehicle' : 'K900', 'enrVinKh' : '4',
          'odometer' : '001548', 'wrrtEndMile' : false },

        { 'vin' : 'KNALU4D33F6023411', // expired car
          'mdlNm' : 'K900', 'mdlYr' : '2016',
          'acumTrvgDistMile' : 1548, 'acumTrvgDist' : 200000,
          'nextServiceMile' : 5952, 'tempVin' : 'KNALW4D45F6016794',
          'vehicleCd' : 'NA', 'xrclCd' : '3M',
          'realImgFileNm' : 'failSafe.PNG',
          'cgdsCnt' : '19', 'uvoCnt' : '0',
          'unreadCnt' : '0', 'dtcCnt' : '0',
          'violCnt' : '0', 'poi' : '16',
          'apptCnt' : '0', 'securityPin' : 'Not Available',
          'dtcKh' : 0, 'vehicleStatus' : 'notexists',
          'vehNick' : 'K900', 'odoUpdate' : 'Jan 20, 2014 08:58 PM',
          'endDate' : 1000000, 'endMile' : 100000,
          'fuelType' : '0', 'actVin' : 'Y',
          'enrVin' : 'C', 'launchType' : '0',
          'khVehicle' : 'K900', 'enrVinKh' : '4',
          'odometer' : '001548', 'wrrtEndMile' : false },

        { 'vin':'KNDJX3AE3E7000200', // PSEV
          'mdlNm':'SOUL','mdlYr':'2014',
          'acumTrvgDistMile':1056,'acumTrvgDist':1700,
          'nextServiceMile':0,'tempVin':'KNDJX3AE3E7000200',
          'vehicleCd':'PS','xrclCd':'KU9',
          'originImgFileNm':'Soul14_FathomBlue.png','realImgFileNm':'Soul14_FathomBlue.png',
          'cgdsCnt':'0','uvoCnt':'0',
          'unreadCnt':'0','dtcCnt':'0',
          'violCnt':'0','poi':'2',
          'apptCnt':'0','securityPin':'Not Available',
          'dtcKh':0,'scheduledInfoTimeStamp':1424165346393,
          'vehicleStatusTimeStamp':1400879916612,'vehicleStatus':'{\"airCtrlOn\":\"false\",\"engine\":\"false\",\"doorLock\":\"false\",\"doorOpen\":{\"frontLeft\":\"0\",\"frontRight\":\"0\",\"backLeft\":\"0\",\"backRight\":\"0\"},\"trunkOpen\":\"false\",\"airTemp\":{\"unit\":1,\"value\":{\"hexValue\":\"01\"}},\"defrost\":\"false\",\"acc\":\"false\",\"eVStatus\":{\"batteryCharge\":false,\"drvDistance\":[{\"type\":2,\"distanceType\":{\"value\":103.0,\"unit\":3}}],\"batteryStatus\":90,\"batteryPlugin\":2,\"remainTime\":[{\"value\":0,\"unit\":1}]}}',
          'vehNick':'PSEV200','odoUpdate':'May 23, 2014 11:55 AM',
          'endDate':1704096000000,'endMile':160935,
          'checkNameNull':'PSEV200','fuelType':'4',
          'actVin':'Y','enrVin':'A',
          'launchType':'0','freeServiceStartDate':1388563200000,
          'freeServiceEndDate':1546243200000,'registrationDate':1400537306000,
          'khVehicle':'0','enrVinKh':'0',
          'odometer':'001056','wrrtEndMile':false},

          {'vin':'KNALW4D44F6018861', // K900 Gen1
           'mdlNm':'K900','mdlYr':'2015',
           'acumTrvgDistMile':0,'acumTrvgDist':0,
           'nextServiceMile':7500,'tempVin':'KNALW4D45F6016794',
           'vehicleCd':'KH','xrclCd':'SWP',
           'realImgFileNm':'failSafe.PNG','cgdsCnt':'0',
           'uvoCnt':'0','unreadCnt':'0', 'dtcCnt':'0',
           'violCnt':'0','poi':'1',
           'apptCnt':'0','securityPin':'Not Available',
           'dtcKh':0,'vehicleStatus':'notexists',
           'vehNick':'Test','odoUpdate':'Nov 18, 2014 05:30 PM',
           'endDate':1731916800000,'endMile':100000,
           'checkNameNull':'Test','fuelType':'0',
           'actVin':'N','enrVin':'C',
           'launchType':'0','khVehicle':'0',
           'enrVinKh':'0','odometer':'000000','wrrtEndMile':false},

           {'vin':'KNALW4D48F6018040', // k900 not enrolled
            'mdlNm':'K900','mdlYr':'2015',
            'acumTrvgDistMile':0,'acumTrvgDist':0,
            'nextServiceMile':7500,'tempVin':'KNALW4D45F6016794',
            'vehicleCd':'KH','xrclCd':'BLA',
            'realImgFileNm':'failSafe.PNG',
            'cgdsCnt':'0','uvoCnt':'0',
            'unreadCnt':'0','dtcCnt':'0',
            'violCnt':'0','poi':'1',
            'apptCnt':'0','securityPin':'Not Available',
            'dtcKh':0,'vehicleStatus':'notexists',
            'vehNick':'KNALW4D48F6018040','odoUpdate':'Nov 18, 2014 05:30 PM',
            'endDate':1731916800000,'endMile':100000,
            'checkNameNull':'KNALW4D48F6018040','fuelType':'0',
            'actVin':'Y','enrVin':'C',
            'launchType':'0','khVehicle':'0',
            'enrVinKh':'0','odometer':'000000','wrrtEndMile':false},

            {'vin':'5XYKU4A72EG387880', // Gen 1 plus
             'mdlNm':'SORENTO','mdlYr':'2014',
             'acumTrvgDistMile':2810,'acumTrvgDist':4523,
             'nextServiceMile':4690,'tempVin':'5XYKU4A72EG387880',
             'vehicleCd':'XM','xrclCd':'STM',
             'originImgFileNm':'Sorento_2014_SatinMetal.PNG',
             'realImgFileNm':'Sorento_2014_SatinMetal.PNG','cgdsCnt':'0',
             'uvoCnt':'0','unreadCnt':'0',
             'dtcCnt':'0','violCnt':'0',
             'poi':'21','apptCnt':'0','securityPin':'6666',
             'dtcKh':0,'vehicleStatus':'notexists',
             'vehNick':'Tom Teriffic','odoUpdate':'Oct 03, 2013 09:30 PM',
             'endDate':1669795200000,'endMile':100000,
             'checkNameNull':'Tom Teriffic','fuelType':'0',
             'actVin':'N','enrVin':'C',
             'launchType':'1','khVehicle':'0',
             'enrVinKh':'0','odometer':'002810','wrrtEndMile':false}

          ],

          'listMyCarUpdates' : { 'KNALU4D33F6023403' : false } };

      returnData = khData;

      // returnData = {'listMyCarInfo':[]}; No vehicles

          return [200, returnData, {}];
      });

    $httpBackend.whenGET(/\/ccw\/kh\/activeDtcCnt\.do/).respond(function(method, url, data) {
      var returnData;

      var khData = {'serviceResponse':[{'vin':'KNALU4D33F6023403','dtcKhCnt':6}],'statuscode':'200','success':true};

      returnData = khData;

      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/\/ccw\/set\/editVehicle\.do/).respond(function(method, url, data) {
      var returnData;

      var khData = { 'status': 'Success', 'statusCode': '200' };

      returnData = khData;

      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/\/ccw\/set\/deleteVehicle\.do/).respond(function(method, url, data) {
      var returnData;

      var khData = { 'status': 'Success', 'statusCode': '200' };

      returnData = khData;

      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/\/ccw\/com\/setCurrentVehicleTop\.do/).respond(function(method, url, data) {
      var returnData;

      var khData = {'success':true};

      returnData = khData;

      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/\/ccw\/set\/addVehicle\.do/).respond(function(method, url, data) {
      var returnData;

      var khData = { 'status': 'Success', 'statusCode': '200' };

      returnData = khData;

      return [ 200, returnData, {}];
    });


});
