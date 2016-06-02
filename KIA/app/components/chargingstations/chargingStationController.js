'use strict';

module.exports = /*@ngInject*/ function($anchorScroll, $timeout, $state, $modal, $scope,
  uiGmapIsReady, MapService, StatusBarService, chargingStationService,$rootScope) {
  var vm = this;

  var _gMap;
  var _gMapDefault;
  var _map;
  var _iscroll;
  var _isTilesLoaded;

  if($(window).width() < 768){
    $('.panel_results').css('width', $(window).width()-30+'px');
    $('.panel_results .panel_filter').css('width', $(window).width()-30+'px');
  }

  var selectedType = 'All';
  var selectedDistance = 25;
  var selectedBrands = 'All';
  var requestParams = {
    'distance' : selectedDistance,
    'brand'    : selectedBrands,
    'type'     : selectedType
  }
  
  vm.showPanel = true;
  vm.showFilter = false;
  vm.showList = true;
  vm.errorFilter = false;
  vm.noResult = false;

  vm.togglePanel = function(){
    vm.showPanel = !vm.showPanel;
  }
  vm.closeClick = function(){
    vm.map.window.closeClick();
    vm.showPanel = true;
  }

  vm.toggleFilter = function(){
    if ($(window).width() < 768){
      if(vm.showFilter == false)
        $('#header').hide();
      else
        $('#header').show();
    }

    vm.errorFilter = false;
    if(vm.allBrands)
      selectedBrands = 'All';
    else {
      var checkedBrandsArray = [];
      selectedBrands = '';
      angular.forEach(vm.brandListLeft, function(brand){
        if(brand.check)
          checkedBrandsArray.push(brand.name);
      });
      angular.forEach(vm.brandListRight, function(brand){
        if(brand.check)
          checkedBrandsArray.push(brand.name);
      });
      selectedBrands = checkedBrandsArray.join();
      if(checkedBrandsArray.length == 0){
        vm.errorFilter = true;
        return;
      }
    }

    requestParams = {
      'distance' : selectedDistance,
      'brand'    : selectedBrands,
      'type'     : selectedType
    }

    vm.showFilter = !vm.showFilter;
  }

  vm.type1 = true;
  vm.type2 = true;
  vm.typeAll = false;
  vm.chargeType = function(type){
    if(type == 1){
      vm.type1 = false;
      vm.type2 = true;
      vm.typeAll = true;
      selectedType = 1;
    }
    if(type == 2){
      vm.type1 = true;
      vm.type2 = false;
      vm.typeAll = true;
      selectedType = 2;
    }
    if(type == 0){
      vm.type1 = true;
      vm.type2 = true;
      vm.typeAll = false;
      selectedType = 'All';
    }
  }

  vm.location5 = true;
  vm.location10 = true;
  vm.location25 = false;
  vm.location = function(miles){
    if(miles == 5){
      vm.location5 = false;
      vm.location10 = true;
      vm.location25 = true;
      selectedDistance = 5;
    }
    if(miles == 10){
      vm.location5 = true;
      vm.location10 = false;
      vm.location25 = true;
      selectedDistance = 10;
    }
    if(miles == 25){
      vm.location5 = true;
      vm.location10 = true;
      vm.location25 = false;
      selectedDistance = 25;
    }
  }

  vm.brandListLeft = [
    {name:'OpConnect', check:true},
    {name:'AeroVironment Network', check:true},
    {name:'eVgo Network', check:true},
    {name:'Shorepower', check:true},
    {name:'Electric Vehicle', check:true}];

  vm.brandListRight = [
    {name:'Sema Charge Network', check:true},
    {name:'Blink', check:true},
    {name:'Charge Point Network', check:true}];

  var totalBrands = vm.brandListLeft.length + vm.brandListRight.length;
  var countChecked = totalBrands;
  vm.allBrands = true;

  vm.toggleEachBrand = function(brand){
    if(brand.check)
      countChecked++;
    else
      countChecked--;

    if(countChecked === totalBrands)
      vm.allBrands = true;
    else
      vm.allBrands = false;
  }

  vm.clearAllCheck = function(){
    angular.forEach(vm.brandListLeft, function(brand){
      brand.check = false;
    });
    angular.forEach(vm.brandListRight, function(brand){
      brand.check = false;
    });
    vm.allBrands = false;
    countChecked = 0;
  }

  vm.allChecked = function(){
    angular.forEach(vm.brandListLeft, function(brand){
      brand.check = true;
    });
    angular.forEach(vm.brandListRight, function(brand){
      brand.check = true;
    });
    countChecked = totalBrands;
  }

  if(vm.allBrands){
    vm.allChecked();
  }

  vm.toggleAllBrands = function(){
    if(vm.allBrands) vm.allChecked();
    else vm.clearAllCheck();
  }

  vm.viewList = function(){
    vm.showList = true;
    vm.map.window.closeClick();
    if(vm.stationList[0].chargingstation === null || vm.stationList.length == 0)
      vm.noResult = true;
  }

  vm.viewMap = function(){
    vm.showList = false;
    if(vm.stationList.length == 0)
      vm.noResult = false;
  }

  vm.searchByCurrentLocation = function(){
    getBrowserLocation().done(function (position) {
          retrieveChargingStations(position.coords.latitude, position.coords.longitude, '');
      }).fail();
  }
  vm.searchByKeyPress = function(event){
    if (event.which === 13)
      vm.searchByInputValue();
  }
  vm.isNumeric = function(num){
    return !isNaN(parseFloat(num)) && isFinite(num);
  }

  vm.searchByInputValue = function(){
    function startSearch(){
      vm.map.markers=[];
      var geocoder = new google.maps.Geocoder();
  
      geocoder.geocode({'address':vm.searchStr, componentRestrictions : { country : 'us'}},
          function(results_array, status) { 
              var mapCenter = results_array[0].geometry.location;
              requestParams.lat = mapCenter.lat();
              requestParams.lng = mapCenter.lng();
              retrieveChargingStations(mapCenter.lat(), mapCenter.lng(), '');
      });
    }

    if(vm.searchStr){
      StatusBarService.showLoadingStatus();
      vm.statusMsg = "Locating charging stations...";

      var requestParams = {
          'distance' : selectedDistance,
          'brand'    : selectedBrands,
          'type'     : selectedType
        };

        //check if it is correct zipcode format
        var isZipCode = (/(^\d{5}$)|(^\d{5}-\d{4}$)/).test(vm.searchStr);
        var isZipLength = vm.searchStr.length == 0 || (/^\d{5}$/).test(vm.searchStr);

        //check if it's valid zipcode
        if(isZipCode){
          chargingStationService.isUSRegion(vm.searchStr.substring(0,5)).then(function(data){
            if(data.uszipcode === "false"){
              StatusBarService.clearStatus();
              vm.statusMsg = "Not a valid US ZIP Code.";
              drawDefaultMap();
            } else {
              requestParams.zipcode = vm.searchStr;
              startSearch();
            }
          });
        }
        else if (vm.searchStr && !vm.isNumeric(vm.searchStr)){
          requestParams.city = vm.searchStr;
          startSearch();
        }
        else if(!isZipLength){
          StatusBarService.clearStatus();
          vm.statusMsg = "Not a valid US ZIP Code.";
          drawDefaultMap();
        }
    }
  }

  vm.selectChargeStation = function(index){
    if ($(window).width() < 768)
      vm.showList = false;

    _gMap.event.trigger(vm.map.markerControl.getGMarkers()[index],'click');
    return;
  }
vm.olddata={};
  vm.map = {
    mapEvents:{
      tilesloaded: function(map) {
        if(!_isTilesLoaded) {
          $scope.$apply(function () {
            _map = map;
            _isTilesLoaded = true;
          });
        }
      }
    },
    markerEvents:{
      click: function(marker, eventName, model, args) {
                if("id" in vm.olddata){
          if(vm.olddata.id==model.id){
            
             vm.map.window.show=!vm.map.window.show;
          }
          else{
             vm.map.window.show = true;
          }
        }
        else{
           vm.map.window.show = true;
        }

        vm.olddata=model;
        //vm.map.window.closeClick();
        vm.map.window.model = model;
        vm.map.window.model.endAddr = model.latitude + "," + model.longitude;
         
        vm.map.window.showthis = false;
        vm.map.window.model.level1 = vm.map.window.model.level2 = vm.map.window.model.level3 = "--";
        if(model.status.length > 0){
          for(var i = 0; i < model.status.length; i++){
            switch(model.status[i].chtype){
              case "1": vm.map.window.model.level1 = model.status[i].numavail + "/" + model.status[i].tnum + " available"; break;
              case "2": vm.map.window.model.level2 = model.status[i].numavail + "/" + model.status[i].tnum + " available"; break;
              case "3": vm.map.window.model.level3 = model.status[i].numavail + "/" + model.status[i].tnum + " available"; break;
            }
          }
        }

        if ($(window).width() > 768)
          vm.showPanel = false;
        else
          vm.showPanel = true;

        mapStreetView(model.latitude, model.longitude);
      }
    }
  };

  function mapStreetView(lat, lon){
      var map = new google.maps.Map(document.getElementById('map-street-view'), mapOptions);
      var fenway = new google.maps.LatLng(lat,lon);
      var mapOptions = {
          center: fenway,
          zoom: 14,
          
      };
      
      
      var streetViewService = new google.maps.StreetViewService ();
      streetViewService.getPanoramaByLocation(fenway, 500, function (data, status){
        if (status === google.maps.StreetViewStatus.OK) {
          var panoramaOptions = {
              position: data.location.latLng,
              pov: {
                heading: 34,
                pitch: 10
              },
              linksControl: false,
            addressControl:false,
            panControl: false,
            zoomControl:false
          };
          
          setTimeout(function () {
          var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
          
          map.setStreetView(panorama);
          map.getStreetView().setVisible(true);
        }, 100);
        }
        else {
          map.getStreetView().setVisible(false);
        }
      });
      
    }

  function getBrowserLocation() {
      var deferred = new $.Deferred();
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function success(position) {
            deferred.resolve(position);
        }, function failure(error) {
          deferred.reject(error);
        }, {
          maximumAge         : 60000,
          timeout            : 5000,
          enableHighAccuracy : true
        });
      } else {
          deferred.reject();
      }
      return deferred;
  }

  getBrowserLocation().done(function (position) {
    vm.startAddr = position.coords.latitude + "," + position.coords.longitude;
        retrieveChargingStations(position.coords.latitude, position.coords.longitude, '');
    }).fail(drawDefaultMap);

    drawDefaultMap();

    function drawDefaultMap(){
      var isMobile = ($(window).width() > 768)?false:true;
       MapService.getGMap().then(function(maps) {
      _gMap = maps; // google map library instance
            vm.map = angular.extend(vm.map, MapService.createMapOptions());
            vm.map.window.options = MapService.createChargeStationInfoBoxOptions(0,isMobile);
    });
  }

  function retrieveChargingStations(lat, lng, search) {
    StatusBarService.showLoadingStatus();
    vm.statusMsg = "Locating charging stations...";
    var requestParams = {
          'distance' : selectedDistance,
          'brand'    : selectedBrands,
          'type'     : selectedType,
          'lat'    : lat,
          'lng'    : lng
      };

    chargingStationService.retrieveChargingStations(requestParams).then(function(data){
      vm.stationList = data;
      if(vm.stationList[0].chargingstation === null || vm.stationList.length === 0){
        vm.noResult = true;
        MapService.getGMap().then(function(maps) {
          _gMap = maps; // google map library instance
          //var mapOptions = MapService.createMapOptions();
          vm.map.center = { latitude: lat, longitude: lng };
          vm.map.zoom = 12;

          //vm.map = angular.extend(vm.map, mapOptions);
          vm.map.window.options = MapService.createChargeStationInfoBoxOptions(0,isMobile); 
          vm.map.markers = [];
        });
      } else {
        vm.noResult = false;
        if (_gMap) {
          initMaps();
        } else {
            MapService.getGMap().then(function(maps) {
            _gMap = maps; // google map library instance

            vm.map = angular.extend(vm.map, MapService.createMapOptions());
            vm.map.window.options = MapService.createChargeStationInfoBoxOptions(0,isMobile); 

            initMaps();
          });
        }
      }

      var isMobile = ($(window).width() > 768)?false:true;

          function getBrandLogoString(logo){
            var brandLogo;
            switch(logo){
              case 'Blink':
                brandLogo = 'logo-blink.png';
                break;
              case 'OpConnect':
                brandLogo = 'logo-op.png';
                break;
              case 'Shorepower':
                brandLogo = 'logo-shore.png';
                break;
              case 'AeroVironment Network':
                brandLogo = 'logo-aero.png';
                break;
              case 'ChargePoint Network':
                brandLogo = 'logo-charge.jpg';
                break;
              case 'eVgo Network':
                brandLogo = 'logo-evgo.png';
                break;
              case 'SemaCharge Network':
                brandLogo = 'logo-sema.png';
                break;
              default:
                brandLogo = 'logo-charge.jpg';
            }
            return brandLogo;
          }

      function initMaps() {
        // populate map options and pre-opened infoboxes for mobile maps

        var i, markers=[];
        
        for (i=0;i<vm.stationList.length;i++) {
          var station = vm.stationList[i].chargingstation;

          // populate markers for desktop map
          var marker = MapService.createMarker(i, station.lat, station.lon);
          marker.brandLogo = getBrandLogoString(station.brand);
          marker.distance = station.distance;
          marker.name = station.name;
          marker.zip = station.zip;
          marker.street = station.address;
          marker.city = station.city;
          marker.state = station.state;
          marker.phone = station.phone;
          marker.addrDetail = station.ldesc;
          marker.status = station.status;

          markers.push(marker);
        }

        vm.map.markers = markers;
      }

      StatusBarService.clearStatus();
      vm.statusMsg = "";

      vm.stationDistance = function(stationLat, stationLon){
        var mapCenter = new google.maps.LatLng(lat, lng); //LatLng of searched zip or city.
        var markPoint = new google.maps.LatLng(stationLat, stationLon); //LatLng of stations.
        return google.maps.geometry.spherical.computeDistanceBetween(mapCenter, markPoint).toFixed(0)/1000;
      }
    });
  }

  $(window).resize(function(){
    if ($(window).width() < 768){
      vm.showPanel = true;
      $('.panel_results').css('width', $(window).width()-30+'px');
      $('.panel_results .panel_filter').css('width', $(window).width()-30+'px');
    } else {
      $('.panel_results').css('width', '320px');
    }
    if ($(window).width() > 768){
      $('#header').show();
      vm.showList = true;
    }
  });

  $anchorScroll(0);
};


