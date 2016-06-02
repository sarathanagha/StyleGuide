'use strict';

/*@ngInject*/
angular.module('uvo')
.run(function($httpBackend) {

  $httpBackend.whenGET(/\/ccw\/kh\/getAwards\.do/).respond(function(method,url,data) {
    var returnData = {
      'status':'Success','statusCode':'200',
      'result':{
        'awardsvo': {
          'scheduler':false,
          'safetyDriver':false,
          'safetyFirst':false,
          'safetyKing':false,
          'growingGarage':true,
          'gettingInterested':true,
          'traveler':false,
          'yearAnniversary':false,
          'powerUser':true,
          'schedulerDate':0,
          'safetyDriverDate':0,
          'safetyFirstDate':0,
          'safetyKingDate':0,
          'growingGarageDate':1428620296000,
          'gettingInterestedDate':1428620527000,
          'travelerDate':0,
          'yearAnniversaryDate':0,
          'powerUserDate':1429119643000,
          'infoCarCount':1,
          'infoPoiCount':1,
          'infoScheduleCount':0,
          'infoRegisterDate':1429642090654,
          'infoTraveler':null,
          'infoGettingInterested':null,
          'numLogin':386,'lastAwardDate':1429119643000,
          'numLoginsPerMonth':10},
        'timeStamp':1429119643000}};

        var zeroAwards = {
          'status':'Success','statusCode':'200',
          'result':{
            'awardsvo': {
              'scheduler':false,
              'safetyDriver':false,
              'safetyFirst':false,
              'safetyKing':false,
              'growingGarage':false,
              'gettingInterested':false,
              'traveler':false,
              'yearAnniversary':false,
              'powerUser':false,
              'schedulerDate':0,
              'safetyDriverDate':0,
              'safetyFirstDate':0,
              'safetyKingDate':0,
              'growingGarageDate':0,
              'gettingInterestedDate':0,
              'travelerDate':0,
              'yearAnniversaryDate':0,
              'powerUserDate':0,
              'infoCarCount':1,
              'infoPoiCount':1,
              'infoScheduleCount':0,
              'infoRegisterDate':0,
              'infoTraveler':null,
              'infoGettingInterested':null,
              'numLogin':386,'lastAwardDate':0,
              'numLoginsPerMonth':10},
            'timeStamp':0}};

            //returnData = zeroAwards;

      return [200, returnData, {}];
  });
$httpBackend.whenGET(/\/ccw\/gen1plus\/getAwards\.do/).respond(function(method, url, data) {

      var returnData;

      var genawards = {
      'status':'Success','statusCode':'200',
      'result':{
        'awardsvo': {
          'scheduler':false,
          'safetyDriver':false,
          'safetyFirst':false,
          'safetyKing':false,
          'growingGarage':true,
          'gettingInterested':true,
          'traveler':false,
          'yearAnniversary':false,
          'powerUser':true,
          'schedulerDate':0,
          'safetyDriverDate':0,
          'safetyFirstDate':0,
          'safetyKingDate':0,
          'growingGarageDate':1428620296000,
          'gettingInterestedDate':1428620527000,
          'travelerDate':0,
          'yearAnniversaryDate':0,
          'powerUserDate':1429119643000,
          'infoCarCount':1,
          'infoPoiCount':1,
          'infoScheduleCount':0,
          'infoRegisterDate':1429642090654,
          'infoTraveler':null,
          'infoGettingInterested':null,
          'numLogin':386,'lastAwardDate':1429119643000,
          'numLoginsPerMonth':10},
        'timeStamp':1429119643000}};
      returnData = genawards;

          return [200, returnData, {}];
      });
});
