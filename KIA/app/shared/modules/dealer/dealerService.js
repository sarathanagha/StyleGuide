'use strict';

module.exports = /*@ngInject*/ function(HttpService, CommonUtilsService, SpringUtilsService, $cookies, $q, $modal, $rootScope) {

  // Persisted variables
  var _hasPreferredDealer;
  var _preferredDealer = {data:{}};
  var _vin;
  var _isMaintPage = false;
  //var _noDealer;

  function getHasPreferredDealer(){
    return _hasPreferredDealer;
  }

  function setHasPreferredDealer(flag){
    _hasPreferredDealer=flag;
  }

  function setIsMaintPage(flag1){
    _isMaintPage=flag1;
  }

  function getIsMaintPage(){
    return _isMaintPage;
  }

  function DealerModel() {
    return {
      'dealerCode':'',
      'name':'',
      'phoneNumber':'',
      'zipCode':'',
      'address':'',
      'city' : '',
      'state' : '',
      'latitude' : 0.0,
      'longitude' : 0.0,
      'website'  : ''
    };
  }

  function openPreferredDealerModal(vin) {
    if(vin !== undefined){
      $cookies['vin'] = vin;
    }
    $cookies['dealerSave'] = true;
    $modal.open({
        templateUrl: 'dealer-modal',
        controller: 'DealerModalController',
        controllerAs: 'vm',
        windowClass: 'dealer-modal vertical-middle',
        keyboard: false,
        backdrop: 'static'
      }); 
  }

  function openDealerSearch(dealerSave) {
    if(dealerSave !== undefined){
      $cookies['dealerSave'] = dealerSave;
    }else{
      $cookies['dealerSave'] = true;
    }
    $modal.open({
        templateUrl: 'dealer-modal',
        controller: 'DealerModalController',
        controllerAs: 'vm',
        windowClass: 'dealer-modal vertical-middle',
        keyboard: false,
        backdrop: 'static'
      }); 
  }

  /***
    @type   : vehicle type
    @vinNum : vin
    @force  : Force to get from endpoint, and not from persisted variable.
    ***/
  function hasPreferredDealer(type,vin,force) {
    var deferred = $q.defer();
      // base case: vehicle page will not pass type, vin so return false
      if (!type && !vin) { deferred.resolve(false); } 
      if (_hasPreferredDealer && vin === _vin && !force) {
        deferred.resolve(_hasPreferredDealer);
      } else {
        HttpService.get('/ccw/com/getPreferredDealer.do?vehicleType='+type+'&vin='+vin).success(function(data) {
          _hasPreferredDealer = data.success;
          _vin = vin;
          deferred.resolve(_hasPreferredDealer);
        });
      }
      return deferred.promise;
  }

  function preferredDealer() {
    return _preferredDealer;
  }

  function getPreferredDealer(type,vin) {
    var deferred = $q.defer();
      // check if preferredDealer data is set and vin number equal
      if (_preferredDealer.data && (_preferredDealer.data.hasOwnProperty('name') && vin === _vin)) {
        deferred.resolve(_preferredDealer.data);
      } else {
        HttpService.get('/ccw/com/getPreferredDealer.do?vehicleType='+type+'&vin='+vin).success(function(data) {
          _preferredDealer.data = angular.fromJson(data.result);
          if(_preferredDealer.data)
          {
          _preferredDealer.data.preferred = true;
          }
          _vin = vin;
          deferred.resolve(_preferredDealer.data);
        });
      }
      return deferred.promise;
  }

  function getDealers(type,zip) {
    //dlrInRadius
    if(type == 'kh'){
      type = 'K900';  //backend looks for K900 not kh for dealerSearch
    }
    var defer = $q.defer();
    var json = {
        'zipcode': zip,
        'vehicleType': type,
        'city': '',
        'stateCode': '' 
      };

    var headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };

    var header = { };
    var payload = SpringUtilsService.encodeParams(json);
    HttpService.post('/ccw/dlr/listDealer.do', payload, headers      
    ).success(function(data) {

      // format return object
      var i, returnData = {'dealers':[], 'dlrInRadius':false};
      for (i = 0; i < data.length; i++) {
        if (data[i].hasOwnProperty('name') && !data[i].hasOwnProperty('dlrInRadius')) {
          var model = new DealerModel();
          model.dealerCode = data[i].dlrcd;
          model.name = data[i].name;
          model.phoneNumber = data[i].phone;
          model.zipCode = data[i].zip;
          model.address = data[i].address;
          model.city = data[i].city;
          model.state = data[i].state;
          model.latitude = data[i].lat;
          model.longitude = data[i].lon;
          model.website = data[i].website;            
          model.preferred = (_preferredDealer.data.hasOwnProperty('name') && 
            data[i].lon === _preferredDealer.data.longitude &&
            data[i].lat === _preferredDealer.data.latitude );
          model.processing = false; // processing flag to show loading gif
          returnData.dealers.push(model);
        } else if (data[i].hasOwnProperty('dlrInRadius')) {
          returnData.dlrInRadius = data[i].dlrInRadius;
        }
      }
      defer.resolve(returnData);        
    });
    return defer.promise;
  }

  function setPreferredDealer(dealer) {
    var json = CommonUtilsService.copyDataToModel(dealer,DealerModel);
    json.vin = $cookies['vin'];
      // another url /com/updatePreferredDealer.do
      var deferred = $q.defer();
      var payload = SpringUtilsService.encodeParams(json);
      var headers = {
        'Content-Type':'application/x-www-form-urlencoded'
      };
      var dealerSave = $cookies['dealerSave'];
      if(dealerSave == "true"){
        HttpService.post('/ccw/dlr/dealerSave.do', payload, headers).success(function(data) {
        if (data.success) {
          _preferredDealer.data = json;
          deferred.resolve(_preferredDealer.data);
        } else {
          deferred.reject();
        }
      });
      }else{
        _preferredDealer.data = json;
          deferred.resolve(_preferredDealer.data);
      }
      
      return deferred.promise;
  }

  return {
    openPreferredDealerModal : openPreferredDealerModal, 
    openDealerSearch : openDealerSearch,   
    hasPreferredDealer : hasPreferredDealer,
    preferredDealer: preferredDealer,
    getPreferredDealer : getPreferredDealer,
    getDealers : getDealers,
    setPreferredDealer : setPreferredDealer,
    getHasPreferredDealer : getHasPreferredDealer,
    setHasPreferredDealer : setHasPreferredDealer,
    setIsMaintPage : setIsMaintPage,
    getIsMaintPage : getIsMaintPage
  };

};
