'use strict';

module.exports = /*@ngInject*/ function(HttpService, VehiclesService, $q) {
var vehicles = null;
  var awardsList = [
    {
      'key':'safetyDriver',
      'name':'Efficient Driver',
      'description':'Earn the Efficient Driver Award by having a Drive Score in the top 10% of UVO drivers',
      'imageURL':'images/kh/img/awards/a-safe-driver.png'
    },
    {
      'key':'scheduler',
      'name':'Scheduler',
      'description':'Earn the Scheduler Award by scheduling a service appointment',
      'imageURL':'images/kh/img/awards/a-scheduler.png'
    },
    {
      'key':'safetyFirst',
      'name':'Efficiency Leader',      
      'description':'Earn the Efficiency Leader Award by earning the Efficient Driver award 3 months in a row',
      'imageURL':'images/kh/img/awards/a-safety-first.png'
    },
    {
      'key':'gettingInterested',
      'name':'Getting Interested',
      'description':'Earn the Getting Interested Award by adding a POI to MyUVO',
      'imageURL':'images/kh/img/awards/a-getting-interested.png'
    },
    {
      'key':'safetyKing',
      'name':'Efficiency King',
      'description':'Earn the Efficiency King Award by earning the Efficient Driver award 6 months in a row',
      'imageURL':'images/kh/img/awards/a-safety-king.png'
    },
    {
      'key':'growingGarage',
      'name':'Growing Garage',
      'description':'Earn the Growing Your Garage award by adding a second UVO vehicle to your MyUVO Account',
      'imageURL':'images/kh/img/awards/a-growing-garage.png'
    },
    {
      'key':'traveler',
      'name':'Traveler',
      'description':'Earn the Traveler Award by adding 10 POIs to MyUVO',
      'imageURL':'images/kh/img/awards/a-traveler.png'
    },
    {
      'key':'powerUser',
      'name':'Power User',
      'description':'Earn the Power User award by logging in to MyUVO 10 times in a single month.',
      'imageURL':'images/kh/img/awards/power-user.png'
    }
  ], acctType ='', vehicles;

  function getVehicleList(){
    var deferred = $q.defer();
    vehicles = VehiclesService.getVehicleData();
    if(vehicles){      
      deferred.resolve(vehicles);
    }else{
      VehiclesService.getVehicles().then(function(data){ 
        vehicles = data;
        deferred.resolve(vehicles);        
      });
    }
    return deferred.promise;
  }

  function processAwards(data) {
    var awards = data.awardsvo;
    var i;
    for (i = 0; i < awardsList.length; i++) {
      if (awardsList[i]) {
        var key = awardsList[i].key;
        awardsList[i].display = true;
        if (awards[key]) {
          /* jshint undef:false */ // clears jshint moment is undefined
          if(key.indexOf("safety") == 0){ 
            acctType = 'gen1Plus';           
            awardsList[i].message = 'Last time you won this award <span>' + moment(awards[key + 'Date']).fromNow() +'</span>';
          }else if(key.indexOf("safety") == -1){
            if(acctType === 'psevOnly' && (key === 'traveler' || key === 'gettingInterested')){
              acctType = 'gen1Only';
            }
            awardsList[i].message = 'You won this award <span>' + moment(awards[key + 'Date']).fromNow() +'</span>';
          }
        }
        if(acctType === 'psevOnly' && (key === 'traveler' || key === 'gettingInterested')){
            awardsList[i].display = false;
        }
        if(key.indexOf("safety") == 0 && (acctType === 'gen1Only' || acctType === 'psevOnly')){
          awardsList[i].display = false;
        }
      }
    }
    return awardsList;
  }

  function getLatestAward(data) {
    // default
    var latestAward = {
      imageURL : 'images/kh/img/overview/awards.png',
      name : 'Award',
      count : 0
    };

    if (data) {
      var awards = data.awardsvo;
      var latestDate = 0;    
      var awardCount = 0;

      var i;
      for (i in awardsList) {
        if(awardsList[i]) {
          var key = awardsList[i].key;
          var date = awards[key + 'Date'];

          // increment awardcount date exist
          if (date > 0) { awardCount++; }

          // compare and try to get latest date
          if (date > latestDate) {
            latestDate = date;
            latestAward.name = awardsList[i].name;
            latestAward.imageURL = awardsList[i].imageURL;
          }
        }
      }
      latestAward.count = awardCount;
    }
    
    return latestAward;
  }

  return { 
    getVehicleList : getVehicleList,   
    getAwards : function(accountType) {
      acctType  = accountType;         
      var deferred = $q.defer();
      HttpService.get('/ccw/kh/getAwards.do').success(function(data) {
        deferred.resolve(processAwards(data.result));
      });
      return deferred.promise;
    },
    clearAwawrds: function() {
      return   HttpService.get('/ccw/cp/getAwards.do');
    },
    getLatestAward : function() {
    
      var deferred = $q.defer();
      HttpService.get('/ccw/kh/getAwards.do').success(function(data) {
        deferred.resolve(getLatestAward(data.result));
      });
      return deferred.promise;
    },getLatestAward1: function() {
     
      var deferred = $q.defer();
      HttpService.get('/ccw/cp/getAwards.do').success(function(data) {
        deferred.resolve(getLatestAward(data.result));
      });
      return deferred.promise;
    }
  };
};
