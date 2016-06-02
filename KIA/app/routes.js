'use strict';

angular.module('uvo')

.run(
  ['$rootScope', '$state', '$stateParams', '$modalStack',
    function ($rootScope,   $state,   $stateParams, $modalStack) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class='{ active: $state.includes('contacts.list') }'> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
          $modalStack.dismissAll();
          $rootScope.$state = $state;
        });

    }
  ]
)

.config(function($stateProvider, $urlRouterProvider, $locationProvider){

  $locationProvider.html5Mode(true).hashPrefix('!');

      // For any unmatched url, send to home
      $urlRouterProvider.otherwise('/vehicles');

      // Common resolve function. Used for fetching initial data when state is loaded.
      var resolveData = function(funcs, q) {
        var deferred = q.defer();
        var promises = [];
        for (var i in funcs) {
          if (funcs[i]) {
            promises.push(funcs[i]());
          }
        }

        q.all(promises).then(function(data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      };

      $stateProvider
        //layouts
        .state('default', { templateUrl: 'views/default-layout.html' })
        .state('jf', {
         templateUrl: 'views/jf-layout.html',
         controller:'CommonServiceController',
         controllerAs:'com'
        })
        .state('kh', {
         templateUrl: 'views/kh-layout.html',
         controller:'CommonServiceController',
         controllerAs:'com'
        })
        .state('commandlog',{
          templateUrl: 'views/commandlog-layout.html',
        })
        .state('gen1', { 
         templateUrl: 'views/gen1-layout.html',
         controller:'CommonServiceController',
         controllerAs:'com'
        })
        .state('gen1plus', { 
         templateUrl: 'views/gen1plus-layout.html',
         controller:'CommonServiceController',
         controllerAs:'com'
        })
        .state('psev', { templateUrl: 'views/psev-layout.html',controller:'CommonServiceController',controllerAs:'com'})
        .state('settings', { templateUrl: 'views/settings-layout.html',controller:'CommonServiceController',controllerAs:'com'})

        //component layouts
        .state('default.awards', {
          url:'/awards',
          templateUrl: 'views/components/awards/awards-view.html',
          controller:'AwardsController',
          controllerAs:'vm',
          data: {
            title: ' - Awards',
            mobileTitle: 'AWARDS'
          }
        })

        // driving activity    
        .state('gen1plus.drivingActivity', {
          url:'/gen1plus/drivingActivity',
          templateUrl: 'views/components/drivingactivity/driving-activity-gen1plus-view.html',
          controller:'DrivingActivityController',
          controllerAs:'vm',
          data: {
            title: ' - Driving Activity',
            mobileTitle: 'DRIVING ACTIVITY'
          }
        })
        .state('kh.drivingActivity', {
          url:'/kh/drivingActivity',
          templateUrl: 'views/components/drivingactivity/driving-activity-view.html',
          controller:'DrivingActivityController',
          controllerAs:'vm',
          data: {
            title: ' - Driving Activity',
            mobileTitle: 'DRIVING ACTIVITY'
          }
        })
        .state('jf.drivingActivity', {
          url:'/jf/drivingActivity',
          templateUrl: 'views/components/drivingactivity/driving-activity-view.html',
          controller:'DrivingActivityController',
          controllerAs:'vm',
          data: {
            title: ' - Driving Activity',
            mobileTitle: 'DRIVING ACTIVITY'
          }
        })

        .state('jf.battery', { //This JF battery also link to psev battery
          url: '/jf/battery',
          templateUrl: 'views/components/battery/battery-view.html',
          controller:'batteryController',
          controllerAs:'vm',
          data: {
            title: ' - Battery'
          }
        })
        .state('jf.chargingStations', { //This JF chargingStations also link to psev chargingStations
          url: '/jf/chargingStations',
          templateUrl: 'views/components/chargingstations/chargingStations-view.html',
          controller:'chargingStationController',
          controllerAs:'vm',
          data: { title: ' - station' }
        })

        // overview
        .state('jf.overview', {
          url: '/jf/overview',
          templateUrl: 'views/components/overview/overview-jf-view.html',
          controller:'OverviewController',
          controllerAs:'vm',
          data: {
            title: ' - Overview'
          }
        })
        .state('kh.overview', {
          url: '/kh/overview',
          templateUrl: 'views/components/overview/overview-v3-view.html',
          controller:'OverviewController',
          controllerAs:'vm',
          data: {
            title: ' - Overview'
          }
        })
        .state('gen1.overview', {
          url: '/gen1/overview',
          templateUrl: 'views/components/overview/overview-gen1-view.html',
          controller:'OverviewController',
          controllerAs:'vm',
          data: {
            title: ' - Overview'
          }
        })

        .state('gen1plus.overview', {
          url: '/gen1plus/overview',
          templateUrl: 'views/components/overview/overview-gen1plus-view.html',
          controller:'OverviewController',
          controllerAs:'vm',
          data: {
            title: ' - Overview'
          }
        })

        // maintenance
        .state('jf.maintenance', {
          url: '/jf/maintenance',
          templateUrl: 'views/components/maintenance/maintenance-view.html',
          controller:'MaintenanceController',
          controllerAs:'vm',
          data: { title: ' - Maintenance',
          mobileTitle: 'MAINTENANCE' }
        })
        .state('kh.maintenance', {
          url: '/kh/maintenance',
          templateUrl: 'views/components/maintenance/maintenance-view.html',
          controller:'MaintenanceController',
          controllerAs:'vm',
          data: { title: ' - Maintenance',
          mobileTitle: 'MAINTENANCE' }
        })
        .state('gen1.maintenance', {
          url: '/gen1/maintenance',
          templateUrl: 'views/components/maintenance/maintenance-view.html',
          controller:'MaintenanceController',
          controllerAs:'vm',
          data: { title: ' - Maintenance',
          mobileTitle: 'MAINTENANCE' }
        })
        .state('gen1plus.maintenance', {
          url: '/gen1plus/maintenance',
          templateUrl: 'views/components/maintenance/maintenance-view.html',
          controller:'MaintenanceController',
          controllerAs:'vm',
          data: { title: ' - Maintenance',
          mobileTitle: 'MAINTENANCE'  }
        })

        // poi
        .state('gen1plus.poi', {
          url: '/gen1plus/poi',
          templateUrl: 'views/components/poi/poi-view.html',
          controller:'PoiController',
          controllerAs:'vm',
          data: { title: ' - My POIs',
          mobileTitle: 'MY POIs'  }
        })
        .state('gen1.poi', {
          url: '/gen1/poi',
          templateUrl: 'views/components/poi/poi-view.html',
          controller:'PoiController',
          controllerAs:'vm',
          data: { title: ' - My POIs',
          mobileTitle: 'MY POIs' }
        })
        .state('kh.poi', {
          url: '/kh/poi',
          templateUrl: 'views/components/poi/poi-view.html',
          controller:'PoiController',
          controllerAs:'vm',
          data: { title: ' - My POIs',
          mobileTitle: 'MY POIs' }
        })
        .state('jf.poi', {
          url: '/jf/poi',
          templateUrl: 'views/components/poi/poi-view.html',
          controller:'PoiController',
          controllerAs:'vm',
          data: { title: ' - My POIs',
          mobileTitle: 'MY POIs' }
        })
        .state('commandlog.history', {
          url: '/kh/commandLog',
          templateUrl: 'views/components/settings/commandlog/command-log-view.html',
          controller:'commandLogController',
          controllerAs:'vm',
          data: { title: ' - Command Log' }
        })



        // trip info
        .state('jf.trips', {
          url: '/jf/tripInfo',
          templateUrl: 'views/components/tripinfo/trip-info-view.html',
          controller:'TripInfo',
          controllerAs:'vm',
          data: { title: ' - Trip Info', 
          mobileTitle: 'TRIP INFO'}
        })
        .state('kh.trips', {
          url: '/kh/tripInfo',
          templateUrl: 'views/components/tripinfo/trip-info-view.html',
          controller:'TripInfo',
          controllerAs:'vm',
          data: { title: ' - Trip Info', 
          mobileTitle: 'TRIP INFO'}
        })
        .state('gen1plus.trips', {
          url: '/gen1plus/tripInfo',
          templateUrl: 'views/components/tripinfo/trip-info-cp-view.html',
          controller:'TripInfo',
          controllerAs:'vm',
          data: { title: ' - Trip Info', 
          mobileTitle: 'TRIP INFO'}
        })        

        // psev
        .state('psev.connect', {
          url: '/psev/connect',
          templateUrl: 'views/components/connect/connect-view.html',
          controller:'ConnectController',
          controllerAs:'vm',
          data: { title: ' - My Connect POIs' }
        })

        .state('psev.battery', {
          url: '/psev/battery',
          templateUrl: 'views/components/battery/battery-view.html',
          controller:'batteryController',
          controllerAs:'vm',
          data: { title: ' - Battery' }
        })
        .state('psev.chargingStations', {
          url: '/psev/chargingStations',
          templateUrl: 'views/components/chargingstations/chargingStations-view.html',
          controller:'chargingStationController',
          controllerAs:'vm',
          data: { title: ' - station' }
        })

        .state('psev.climate', {
          url: '/psev/climate',
          templateUrl: 'views/components/climate/climateControl-view.html',
          controller:'climateEvController',
          controllerAs:'vm',
          data: { title: ' - climate' }
        })
        .state('psev.doorStatus', {
          url: '/psev/doorStatus',
          templateUrl: 'views/components/doorStatus/doorStatus-view.html',
          controller:'doorStatusController',
          controllerAs:'vm',
          data: { title: ' - doorStatus' }
        })
        .state('psev.findMyCar', {
          url: '/psev/findMyCar',
          templateUrl: 'views/components/findMyCar/evFindMyCar-view.html',
          controller:'evFindMyCarController',
          controllerAs:'vm',
          data: { title: ' - findMyCar' }

        })
        .state('psev.appointments', {
          url: '/psev/appointment',
          controller:'appointmentController',
          controllerAs:'vm',
          data: { title: ' - appointment' }

        })
        .state('kh.findMyCar', {
          url: '/kh/findMyCar',
          templateUrl: 'views/components/remote/findmycar/kh-findMyCar-view.html',
          controller:'findMyCarController',
          controllerAs:'vm',
          data: { title: ' - findMyCar' }

        })
        .state('jf.findMyCar', {
          url: '/jf/findMyCar',
          templateUrl: 'views/components/remote/findmycar/kh-findMyCar-view.html',
          controller:'findMyCarController',
          controllerAs:'vm',
          data: { title: ' - findMyCar' }

        })
        .state('kh.lock', {
          url: '/kh/lock',
          templateUrl: 'views/components/remote/lock/lock-view.html',
          controller:'lockController',
          controllerAs:'vm',
          data: { title: ' - Lock/Unlock' }

        })
        .state('jf.lock', {
          url: '/jf/lock',
          templateUrl: 'views/components/remote/lock/lock-view.html',
          controller:'lockController',
          controllerAs:'vm',
          data: { title: ' - Lock/Unlock' }

        })
        .state('kh.remote', {
          url: '/kh/climate',
          templateUrl: 'views/components/remote/climate/kh-climate-view.html',
          controller:'climateController',
          controllerAs:'vm',
          data: { title: ' - Climate' }
        })
        .state('jf.remote', {
          url: '/jf/climate',
          templateUrl: 'views/components/remote/climate/kh-climate-view.html',
          controller:'climateController',
          controllerAs:'vm',
          data: { title: ' - Climate' }
        })
        // my car zone
        .state('jf.mcz', {
          url: '/jf/mycarzone/curfewalerts',
          templateUrl: 'views/components/mycarzone/curfewalerts/curfew-view.html',
          controller:'CurfewController',
          controllerAs:'vm',
          resolve:{
            message:function(){
              return 'jf';
            }
          },
          data: { title: ' - Curfew',
          mobileTitle: 'MY CAR ZONE' }
        })
        .state('kh.mcz', {
          url: '/kh/mycarzone/curfewalerts',
          templateUrl: 'views/components/mycarzone/curfewalerts/curfew-view.html',
          controller:'CurfewController',
          controllerAs:'vm',
          resolve:{
            message:function(){
              return 'kh';
            }
          },
          data: { title: ' - Curfew',
          mobileTitle: 'MY CAR ZONE' }
        })
        .state('gen1plus.mcz', {
          url: '/gen1plus/mycarzone/curfewalerts',
          templateUrl: 'views/components/mycarzone/curfewalerts/curfew-view-gen1plus.html',
          controller:'CurfewController',
          controllerAs:'vm',
          data: { title: ' - Curfew',
          mobileTitle: 'MY CAR ZONE' }
        })
        .state('gen1plus.speedalerts', {
          url: '/gen1plus/mycarzone/speedalerts',
          templateUrl: 'views/components/mycarzone/speedalerts/speed-view.html',
          controller:'SpeedViewController',
          controllerAs:'vm',
          resolve: {
            message: function(){
              return 'gen';
            }
          },
          data: { title: ' - Speed',
          mobileTitle: 'MY CAR ZONE' }
        })
        .state('jf.speedalerts', {
          url: '/jf/mycarzone/speedalerts',
          templateUrl: 'views/components/mycarzone/speedalerts/kh-speed-view.html',
          controller:'SpeedViewController',
          controllerAs:'vm',
          resolve: {
            message: function() {
              return 'jf';
            }
          },
          data: { title: ' - Speed',
          mobileTitle: 'MY CAR ZONE' }
        })
        .state('kh.speedalerts', {
          url: '/kh/mycarzone/speedalerts',
          templateUrl: 'views/components/mycarzone/speedalerts/kh-speed-view.html',
          controller:'SpeedViewController',
          controllerAs:'vm',
          resolve: {
            message: function() {
              return 'kh';
            }
          },
          data: { title: ' - Speed',
          mobileTitle: 'MY CAR ZONE' }
        })
        .state('jf.geofence', {
          url: '/jf/mycarzone/geofence',
          templateUrl: 'views/components/mycarzone/geofencealerts/geofence-view.html',
          controller:'GeofenceController',
          controllerAs:'vm',
          resolve: {
            message: function() {
              return 'jf';
            }
          },
          data: { title: ' - Geo Fence',
          mobileTitle: 'MY CAR ZONE' }
        })
        .state('kh.geofence', {
          url: '/kh/mycarzone/geofence',
          templateUrl: 'views/components/mycarzone/geofencealerts/geofence-view.html',
          controller:'GeofenceController',
          controllerAs:'vm',
          resolve: {
            message: function() {
              return 'kh';
            }
          },
          data: { title: ' - Geo Fence',
          mobileTitle: 'MY CAR ZONE' }
        })
        .state('gen1plus.geofence', {
          url: '/gen1plus/mycarzone/geofence',
          templateUrl: 'views/components/mycarzone/geofencealerts/gen1plus-geofence-view.html',
          controller:'GeofenceController',
          controllerAs:'vm',
          resolve: {
            message: function(){
              return 'gen';
            }
          },
          data: { title: ' - Geo Fence' }
        })
        .state('kh.curfew-settings', {
          url: '/kh/mycarzone/settings/curfew',
          templateUrl: 'views/components/mycarzone/settings/curfew/curfew-settings-view.html',
          controller:'CurfewSettingsController',
          controllerAs:'vm' ,
          data: {
            mobileTitle: 'MY CAR ZONE'
          }       
        })
        .state('jf.curfew-settings', {
          url: '/jf/mycarzone/settings/curfew',
          templateUrl: 'views/components/mycarzone/settings/curfew/curfew-settings-view.html',
          controller:'CurfewSettingsController',
          controllerAs:'vm' ,
          data: {
            mobileTitle: 'MY CAR ZONE'
          }       
        })
        .state('kh.speed-settings', {
          url: '/kh/mycarzone/settings/speed',
          templateUrl: 'views/components/mycarzone/settings/speed/speed-settings-view.html',
          controller:'speedSettingsController',
          controllerAs:'vm'        
        })
        .state('jf.speed-settings', {
          url: '/jf/mycarzone/settings/speed',
          templateUrl: 'views/components/mycarzone/settings/speed/speed-settings-view.html',
          controller:'speedSettingsController',
          controllerAs:'vm'        
        })

        .state('kh.geofence-settings', {
          url: '/kh/mycarzone/settings/geofence',
          templateUrl: 'views/components/mycarzone/settings/geofence/geofence-settings-view.html',
          controller:'GeofenceSettingsController',
          controllerAs:'vm'        
        })
        .state('jf.geofence-settings', {
          url: '/jf/mycarzone/settings/geofence',
          templateUrl: 'views/components/mycarzone/settings/geofence/geofence-settings-view.html',
          controller:'GeofenceSettingsController',
          controllerAs:'vm'        
        })        

        // settings
        .state('settings.alertsSettings', {
          url: '/alertsSettings',
          templateUrl: 'views/components/settings/alerts/alerts-settings-view.html',
          controller:'AlertsSettingsController',
          controllerAs:'vm',
          data: {
            title: ' - Alert Settings',
            mobileTitle: 'ALERTS SETTINGS'
          }
        })
        .state('settings.personalSettings', {
          url: '/personalSettings',
          templateUrl: 'views/components/settings/personal/personal-view.html',
          controller:'PersonalSettingsController',
          controllerAs:'vm',
          data: {
            title: ' - Personal Settings',
            mobileTitle: 'PERSONAL SETTINGS'
          }
        })
        .state('settings.securitySettings', {
          url: '/securitySettings',
          templateUrl: 'views/components/settings/security/security-view.html',
          controller:'SecuritySettingsController',
          controllerAs:'vm',
          data: {
            title: ' - Security Settings',
            mobileTitle: 'SECURITY SETTINGS'
          }
        })

        // my vehicles page
        .state('default.vehicles', {
          url: '/vehicles',
          templateUrl : 'views/components/vehicles/vehicles-view.html',
          controller:'VehiclesController',
          controllerAs:'vm',
          data: {
            title: ' - My Vehicles',
            mobileTitle: 'MY VEHICLES'
          }
        })
        ;
      });
