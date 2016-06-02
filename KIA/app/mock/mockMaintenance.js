'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {

    $httpBackend.whenPOST(/ccw\/omn\/mtn\/insertMaintRecord\.do/).respond(function(method,url,data) {
      var returnData = {'success':true};
      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/ccw\/omn\/mtn\/deleteMaintRecord\.do/).respond(function(method,url,data) {
      var returnData = {'success':true};
      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/ccw\/kh\/service\/maintenance\/updateRecord\.do/).respond(function(method,url,data) {
      var returnData = {'success':true};
      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/ccw\/kh\/oilChangeUpdate\.do/).respond(function(method,url,data) {
      var returnData = {'success':true};
      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/ccw\/kh\/scheduleDealerReservations\.do/).respond(function(method,url,data) {
      var returnData = {'success':true};
      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/ccw\/dlr\/dealerAppt\.do/).respond(function(method,url,data) {
      var returnData = {'success':true};
      return [200, returnData, {}];
    });

    $httpBackend.whenGET(/ccw\/omn\/mntn\/getCurrentMainAppts\.do/).respond(function(method,url,data) {
        var returnData =
        {
          'status':'Success',
          'statusCode':'200',
          'result':[
            {'appnTim':1431097200000,
            'dlrNm':'Kia Of Irvine',
            'dlrAdr1':'45 Oldfield',
            'dlrAdr2':null,
            'dlrAdrCity':'Irvine',
            'dlrAdrSt':'CA',
            'zip':'92618',
            'dlrTn':'(949)777-2300',
            'dlrUrl':'http://WWW.KIAOFIRVINE.COM',
            'rqType':'Vehicle Repair'}
          ]};

        var multiple = 
        {
          'status' : 'Success',
          'statusCode' : '200',
          'result' : [{
              'appnTim' : 1431107100000,
              'dlrNm' : 'Kia Of Irvine',
              'dlrAdr1' : '45 Oldfield',
              'dlrAdr2' : null,
              'dlrAdrCity' : 'Irvine',
              'dlrAdrSt' : 'CA',
              'zip' : '92618',
              'dlrTn' : '(949)777-2300',
              'dlrUrl' : 'http://WWW.KIAOFIRVINE.COM',
              'rqType' : 'Maintenance'
            }, {
              'appnTim' : 1432764000000,
              'dlrNm' : 'Kia Of Irvine',
              'dlrAdr1' : '45 Oldfield',
              'dlrAdr2' : null,
              'dlrAdrCity' : 'Irvine',
              'dlrAdrSt' : 'CA',
              'zip' : '92618',
              'dlrTn' : '(949)777-2300',
              'dlrUrl' : 'http://WWW.KIAOFIRVINE.COM',
              'rqType' : 'Repair'
            }, {
              'appnTim' : 1433016000000,
              'dlrNm' : 'Kia Of Irvine',
              'dlrAdr1' : '45 Oldfield',
              'dlrAdr2' : null,
              'dlrAdrCity' : 'Irvine',
              'dlrAdrSt' : 'CA',
              'zip' : '92618',
              'dlrTn' : '(949)777-2300',
              'dlrUrl' : 'http://WWW.KIAOFIRVINE.COM',
              'rqType' : 'Vehicle Repair'
            }, {
              'appnTim' : 1433127600000,
              'dlrNm' : 'Kia Of Irvine',
              'dlrAdr1' : '45 Oldfield',
              'dlrAdr2' : null,
              'dlrAdrCity' : 'Irvine',
              'dlrAdrSt' : 'CA',
              'zip' : '92618',
              'dlrTn' : '(949)777-2300',
              'dlrUrl' : 'http://WWW.KIAOFIRVINE.COM',
              'rqType' : 'Vehicle Repair'
            }, {
              'appnTim' : 1433170800000,
              'dlrNm' : 'Kia Of Irvine',
              'dlrAdr1' : '45 Oldfield',
              'dlrAdr2' : null,
              'dlrAdrCity' : 'Irvine',
              'dlrAdrSt' : 'CA',
              'zip' : '92618',
              'dlrTn' : '(949)777-2300',
              'dlrUrl' : 'http://WWW.KIAOFIRVINE.COM',
              'rqType' : 'other'
            }, {
              'appnTim' : 1435762800000,
              'dlrNm' : 'Kia Of Irvine',
              'dlrAdr1' : '45 Oldfield',
              'dlrAdr2' : null,
              'dlrAdrCity' : 'Irvine',
              'dlrAdrSt' : 'CA',
              'zip' : '92618',
              'dlrTn' : '(949)777-2300',
              'dlrUrl' : 'http://WWW.KIAOFIRVINE.COM',
              'rqType' : 'Vehicle Repair'
            }, {
              'appnTim' : 1436987700000,
              'dlrNm' : 'Kia Of Irvine',
              'dlrAdr1' : '45 Oldfield',
              'dlrAdr2' : null,
              'dlrAdrCity' : 'Irvine',
              'dlrAdrSt' : 'CA',
              'zip' : '92618',
              'dlrTn' : '(949)777-2300',
              'dlrUrl' : 'http://WWW.KIAOFIRVINE.COM',
              'rqType' : 'Vehicle Repair'
            }
          ]
        };

        returnData = multiple;

        
        return [200, returnData, {}];
    });

    $httpBackend.whenGET(/ccw\/kh\/maintenanceData\.do/).respond(function(method,url,data) {
        var returnData = {'currentOilChangeInterval':7000,'mileageOfLastOilChange':1915,
        'mileageTillNextOilChange':7000,'oilChangeIntervalOptions':['3000','5000','7000']};

        return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/ccw\/kh\/service\/maintenance\/intervals\.do/).respond(function(method,url,data) {
      var returnData = {
        'details':
        [
          {'totCnt':0,
          'action':'I','name':'Fuel filter',
          'notes':[
            'Fuel filter and Fuel tank air filter are considered to be maintenance free but periodic inspection is recommended for this maintenance schedule depends on fuel quality. If there are some important safety matters like fuel flow restriction, surging, loss of power, hard starting problem etc, replace the fuel filter immediately regardless of maintenance schedule and consult an authorized K900 Kia dealer for details.'
            ]
          },
          {'totCnt':0,'action':'I','name':'Propeller shaft','notes':[]},
          {'totCnt':0,'action':'I','name':'Brake fluid','notes':[]},
          {'totCnt':0,'action':'I','name':'Exhaust pipe and muffler','notes':[]},
          {'totCnt':0,'action':'I','name':'Steering gear, linkage and boots, upper and lower ball joints','notes':[]},
          {'totCnt':0,'action':'I','name':'Brake hoses and lines','notes':[]},
          {'totCnt':0,'action':'I','name':'Front brakes disc\/pads calipers','notes':[]},
          {'totCnt':0,'action':'I','name':'Parking brake','notes':[]},
          {'totCnt':0,'action':'I','name':'Drive shaft and boots','notes':[]},
          {'totCnt':0,'action':'I','name':'Fuel lines, fuel hoses and connections','notes':[]},
          {'totCnt':0,'action':'I','name':'Vacuum Hoses','notes':[]},
          {'totCnt':0,'action':'I','name':'Vapor hose and fuel filler cap, fuel tank','notes':[]},
          {'totCnt':0,'action':'I','name':'Power steering fluid','notes':[]},
          {'totCnt':0,'action':'I','name':'EHPS (Electronic Hydraulic Power Steering) motor pump and hoses','notes':[]},
          {'totCnt':0,'action':'I','name':'Air conditioning refrigerant','notes':[]},
          {'totCnt':0,'action':'I','name':'Rear brake disc\/pads','notes':[]},
          {'totCnt':0,'action':'I','name':'Suspension mounting bolts','notes':[]},
          {'totCnt':0,'action':'R','name':'Air cleaner filter','notes':[]},
          {'totCnt':0,'action':'R','name':'Rotate tires  (including tire pressure and tread wear)','notes':[]},
          {'totCnt':0,'action':'R','name':'Fuel tank air filter (CCV filter)',
           'notes':['Fuel filter and Fuel tank air filter are considered to be maintenance free but periodic inspection is recommended for this maintenance schedule depends on fuel quality. If there are some important safety matters like fuel flow restriction, surging, loss of power, hard starting problem etc, replace the fuel filter immediately regardless of maintenance schedule and consult an authorized K900 Kia dealer for details.']
          },
          {'totCnt':0,'action':'R','name':'Climate control air filter','notes':[]},
          {'totCnt':0,'action':'R','name':'Add fuel additives',
           'notes':['If TOP TIER Detergent Gasoline is not available, one bottle of additive is recommended. Additives are available from your authorized K900 Kia dealer along with information on how to use them. Do not mix other additives.']
           },
          {'totCnt':0,'action':'R','name':'Engine oil and filter','notes':[]}],'success':true};

          return [200, returnData, {}];
    });

    $httpBackend.whenGET(/\/kh\/dtcDetails\.do/).respond(function(method,url,data) {
      var returnData = {'dtcDetails':
      [
        {'tid':null,'vin':'KNALU4D33F6023403','csmrId':null,'systemName':'Powertrain','dtcActive':'Y'},
        {'tid':null,'vin':'KNALU4D33F6023403','csmrId':null,'systemName':'Powertrain','dtcActive':'Y'}
      ]};

      var noData = {'dtcDetails':[]};

      //returnData = noData;

      return [200, returnData, {}];
    });

    $httpBackend.whenGET(/\/omn\/mntn\/getMntnMileStones\.do/).respond(function(method,url,data) {
      var returnData = {'status':'Success','statusCode':'200',
      'result':
      [150000,142500,135000,127500,120000,112500,105000,97500,90000,
        82500,75000,67500,60000,52500,45000,37500,30000,22500,15000,7500]
      };

      var empty = [];

      returnData = empty;
      
      return [200, returnData, {}];
    });

    $httpBackend.whenGET(/\/omn\/mtn\/mntRecordsCompleted\.do/).respond(function(method,url,data) {
      var returnData =
      {
    'status': 'Success',
    'statusCode': '200',
    'result':
            {
                '90000':
                {
                    'vin': '5XXGN4A79EG223436',
                    'crtnMilg': 90000,
                    'insDt': '04/14/2015',
                    'insMilg': 97998,
                    'plOfWk': null,
                    'notes': null,
                    'rgstDtm': null,
                    'rgstId': null,
                    'mdfyDtm': null,
                    'mdfyId': null
                },
                '7500':
                {
                    'vin': '5XXGN4A79EG223436',
                    'crtnMilg': 7500,
                    'insDt': '02/10/2015',
                    'insMilg': 7500,
                    'plOfWk': 'Irvine',
                    'notes': '˜” ¨à 8p',
                    'rgstDtm': null,
                    'rgstId': null,
                    'mdfyDtm': null,
                    'mdfyId': null
                },
                '98000':
                {
                    'vin': '5XXGN4A79EG223436',
                    'crtnMilg': 98000,
                    'insDt': '04/16/2015',
                    'insMilg': 97998,
                    'plOfWk': null,
                    'notes': null,
                    'rgstDtm': null,
                    'rgstId': null,
                    'mdfyDtm': null,
                    'mdfyId': null
                },
                '97500':
                {
                    'vin': '5XXGN4A79EG223436',
                    'crtnMilg': 97500,
                    'insDt': '04/15/2015',
                    'insMilg': 97566,
                    'plOfWk': 'Irvine',
                    'notes': 'Testing....',
                    'rgstDtm': null,
                    'rgstId': null,
                    'mdfyDtm': null,
                    'mdfyId': null
                }
            }
        };

      return [200, returnData, {}];
    });
});
