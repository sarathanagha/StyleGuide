'use strict';

/**
 * @ngdoc overview
 * @name myUVO
 * @description
 * # myuvo
 *
 * Main module of the application.
 */
angular
  .module('uvo', [
    'ngCookies',
    'ngSanitize',
    'ngMockE2E',
    'uiGmapgoogle-maps',
    'angular.filter',
    'ui.router',
    'ui.bootstrap',
    'uvo.awards',
    'uvo.vehicles',
    'uvo.drivingactivity',
    'uvo.maintenance',
    'uvo.overview',
    'uvo.curfew',
    'uvo.geofence',
    'uvo.poi',
    'uvo.tripinfo',
    'uvo.connect',
    'uvo.battery',
    'uvo.doorstatus',
    'uvo.findmycar',
    'uvo.appointment',
    'uvo.chargingstations',
    'uvo.climate',
    'uvo.speed',
    'uvo.settings.personal',
    'uvo.settings.alerts',
    'uvo.settings.security',
    'uvo.mcz.settings.curfew',
    'uvo.mcz.settings.speed',
    'uvo.mcz.settings.geofence',
    'uvo.remote.findmycar',
    'uvo.settings.commandlog',
    'uvo.remote.lock',
    'uvo.remote.climate',
    'uvo.settings.commandlog',
    'issue-9128-patch'

  ])
  .config(['uiGmapGoogleMapApiProvider', '$httpProvider', function(GoogleMapApiProvider, $httpProvider) {
    GoogleMapApiProvider.configure({
      v: '3.17',
      libraries: 'places,geometry'
    });

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('HttpInterceptor');
  }])
  ;

// for backend-less environment
require('./mock');

// shared modules
require('./shared');

// handles angular routing, specifies default route
require('./routes');

// components
require('./components/awards');
require('./components/drivingactivity');
require('./components/maintenance');
require('./components/overview');
require('./components/poi');
require('./components/mycarzone/speedalerts');
require('./components/vehicles');
require('./components/tripinfo');
require('./components/connect');
require('./components/battery');
require('./components/findmycar');
require('./components/chargingstations');
require('./components/climate');
require('./components/mycarzone/curfewalerts');
require('./components/settings/personal');
require('./components/settings/alerts');
require('./components/settings/security');
require('./components/mycarzone/settings');
require('./components/mycarzone/geofencealerts');
require('./components/remote/findmycar');
require('./components/remote/climate');
require('./components/settings/commandlog');
require('./components/remote/lock');
require('./components/doorstatus');
require('./components/appointment');


