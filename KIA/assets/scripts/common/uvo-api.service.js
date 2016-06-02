// module.exports = /*@ngInject*/ (function () {
  // 'use strict';

  // angular.module('uvo').factory('uvoApi', uvoApi);
  // uvoApi.$inject = ['$http', 'appSpinner'];
  // uvoApi.$inject = ['$http'];

  // function uvoApi($http, appSpinner) {

'use strict';

module.exports = /*@ngInject*/ function($http) {

  var service = {
	get: function(url) {
	  var defer = new $.Deferred();
	  var req = {
		method: 'GET',
		url: url,
		params: { 'ceps': new Date().getTime() }
		// headers: {
		//   'Content-Type': 'application/json',
		//   'from':'CC',
		//   'language':0,
		//   'offset':-8,
		//   'to':'CCM',
		//   'clientId':'123456',
		//   'deviceId':'ABCDEF',
		//   'tokenId':$window.sessionStorage.getItem('token')
		// },
		// data: {}
	  };

	  //return processHttpRequest($http(req));	
	  return $http(req);
	},
	post: function(url,data) {
	  //return processHttpRequest($http.post(url,data));
	  return $http.post(url,data);
	},
    addVehicle: addVehicle,
    deleteGame: deleteGame,
    deleteVehicle: deleteVehicle,
    deleteLocation: deleteLocation,
    deleteTeam: deleteTeam,
    getGames: getGames,
    getVehicle: getVehicle,
    getVehicles: getVehicles,
    getLocation: getLocation,
    getLocations: getLocations,
    getTeams: getTeams,
    saveGame: saveGame,
    saveVehicle: saveVehicle,
    saveLocation: saveLocation,
    saveTeam: saveTeam

  };

  // var baseUrl = 'https://uvo-schedule-demo.azure-mobile.net/tables';
  var baseUrl = '';

  var requestConfig = {
    // headers: {
      // 'X-ZUMO-APPLICATION': 'yuAXHlFeOSURBtAAGerftBHlVFuLZT25'
    // }
  };

  return service;

  function addVehicle(vehicle){
    return httpPost('/vehicles', vehicle);
  }

  function deleteGame(id){
    return httpDelete('/games/' + id);
  }

  function deleteVehicle(id){
    return httpDelete('/vehicles/' + id);
  }

  function deleteLocation(id){
    return httpDelete('/locations/' + id);
  }

  function deleteTeam(id){
    return httpDelete('/teams/' + id);
  }

  function getGames(vehicleId){
    var url = getUrlByVehicleId('/games', vehicleId);
    return httpGet(url);
  }

  function getVehicle(vehicleId){
    return httpGet('/vehicles/' + vehicleId);
  }

  function getVehicles() {
    return httpGet('/ccw/com/vehiclesInfo.do');
  }

  function getLocation(locationId) {
    return httpGet('/locations/' + locationId);
  }

  function getLocations() {
    return httpGet('/locations');
  }

  function getTeams(vehicleId) {
    var url = getUrlByVehicleId('/teams', vehicleId);
    return httpGet(url);
  }

  function saveVehicle(vehicle){
    return httpPatch('/vehicles/' + vehicle.id, vehicle);
  }

  function saveLocation(location){
    return saveItem('/locations', location);
  }

  function saveGame(game){
    return saveItem('/games', game);
  }

  function saveTeam(team){
    return saveItem('/teams', team);
  }

  /** Private Methods **/

  function getUrlByVehicleId(url, vehicleId){
    return url + '?$top=100&$filter=' + encodeURIComponent('vehicleId eq \'' + vehicleId + '\'');
  }

  function httpDelete(url){
    return httpExecute(url, 'DELETE');
  }

  function httpExecute(requestUrl, method, data){
    // appSpinner.showSpinner();
    return $http({
      url: baseUrl + requestUrl,
      method: method,
      data: data,
      headers: requestConfig.headers }).then(function(response){

        // appSpinner.hideSpinner();
        console.log('**response from EXECUTE', response);
        return response.data;
      });
  }

  function httpGet(url){
    return httpExecute(url, 'GET');
  }

  function httpPatch(url, data){
    return httpExecute(url, 'PATCH', data);
  }

  function httpPost(url, data){
    return httpExecute(url, 'POST', data);
  }

  function saveItem(url, item){
    if (item.id) {
      return httpPatch(url + '/' + item.id, item);
    } else {
      return httpPost(url, item);
    }
  }
};

// })();
