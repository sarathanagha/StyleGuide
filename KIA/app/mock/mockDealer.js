'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {
    $httpBackend.whenPOST(/\/ccw\/dlr\/dealerSave\.do/).respond(function(method,url,data) {
      var returnData = {
        'success': true
      };
      return [200, returnData, {}];
    });

    $httpBackend.whenGET(/\/ccw\/com\/getPreferredDealer\.do/).respond(function(method,url,data) {
      var returnData = {
        'success': true,
        'reason': 200,
        'result': '{\"totCnt\":0,\"distance\":null,\"name\":\"Kia Of Irvine\",\"address\":\"45 Oldfield\",\"phoneNumber\":\"(949)777-2300\",\"dealerCode\":\"CA273\",\"city\":\"Irvine\",\"state\":\"CA\",\"zipCode\":\"92618\",\"website\":\"http:\/\/WWW.KIAOFIRVINE.COM\",\"latitude\":\"33.6355267\",\"longitude\":\"-117.7215253\",\"optimaHybridCertified\":\"true\",\"enllId\":null,\"csmrId\":null,\"dealerStatus\":\"ACTIVE\",\"dealerFeatures\":{\"dealerFeatures\":[{\"name\":\"Authorized K900 Dealer\"},{\"name\":\"Authorized Soul EV Dealer\"},{\"name\":\"Kia Dealer Excellence Program+\"},{\"name\":\"Authorized Optima Hybrid Dealer\"}]}}'
      };

      // uncomment to test no-dealer
      //returnData.success = false;

      return [200, returnData, {}];
    });

    $httpBackend.whenGET(/\/ccw\/kh\/maintenanceInfo\.do/).respond(function(method,url,data) {
      var returnData =
      {
        'serviceResponse':
        {
          'currentMileage':30000,
          'maintIntervals':[82500,75000,67500,60000,52500,45000,37500,30000,22500,15000,7500],
          'preferredDealer':
          {
            'dlrCd':'CA273',
            'dlrNm':'Kia Of Irvine',
            'dlrTn':'(949)777-2300',
            'zip':'92618',
            'dlrAdr':'45 Oldfield',
            'dlrAdrCity':'Irvine',
            'dlrAdrSt':'CA',
            'dlrLocLae':'33.6355267',
            'dlrLocLoe':'-117.7215253',
            'dlrWebsite':'http:\/\/WWW.KIAOFIRVINE.COM',
            'k900Dealer':false,
            'formatedDlrTn':'(949)777-2300'
          },
          'diagnosticIssuesList':[]
          },'success':true};

      return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/\/ccw\/dlr\/listDealer\.do/).respond(function(method,url,data) {
      var returnData = [
        {'name':'Kia Of Irvine','address':'45 Oldfield','city':'Irvine',
        'state':'CA','zip':'92618','website':'http:\/\/WWW.KIAOFIRVINE.COM',
        'lat':'33.6355267','lon':'-117.7215253','phone':'(949)777-2300','dlrcd':'CA273'},
        {'name':'Car Pros Kia Huntington Beach','address':'18835 Beach Blvd.',
        'city':'Huntington Beach','state':'CA','zip':'92648',
        'website':'HTTP:\/\/WWW.ORANGECOUNTYKIA.COM\/','lat':'33.6887074',
        'lon':'-117.9893005','phone':'(714)756-2013','dlrcd':'CA246'},
        {'name':'Imperio Kia Of San Juan Capistrano',
        'address':'33611 Camino Capistrano','city':'San Juan Capistrano',
        'state':'CA','zip':'92675','website':'HTTP:\/\/WWW.IMPERIOKIA.COM',
        'lat':'33.4772299','lon':'-117.6741024','phone':'(866)521-0698','dlrcd':'CA286'},
        {'name':'Kia Of Cerritos','address':'18201 Studebaker Road',
        'city':'Cerritos','state':'CA','zip':'90703',
        'website':'http:\/\/WWW.KIACERRITOS.COM','lat':'33.8672285',
        'lon':'-118.1008555','phone':'(562)860-2424','dlrcd':'CA243'},
        {'name':'Covina Valley Kia','address':'626 South Citrus Avenue',
        'city':'Covina','state':'CA','zip':'91723',
        'website':'HTTP:\/\/WWW.COVINAKIA.COM\/','lat':'34.0783226',
        'lon':'-117.8892414','phone':'(888)514-4195','dlrcd':'CA266'},
        {'dlrInRadius':true}];

      return [200, returnData, {}];
    });
});
