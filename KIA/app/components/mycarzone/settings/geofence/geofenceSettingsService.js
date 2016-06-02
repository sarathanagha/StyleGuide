'use strict';

module.exports = /*@ngInject*/ function(HttpService, MapService, $timeout, $q, SpringUtilsService, $rootScope) {

    var _gMap;

    /*----------------------------------------------------
    Models
    -----------------------------------------------------*/
    function GeofenceEntity() {
        var data = {};
        data.geoFenceConfigId = 0;
        data.vin = '';
        data.csmrId = '';
        data.geoFenceId = 0;
        data.active = '';
        data.geoFenceTime = 0;
        data.geoFenceTimeUom = 1;
        data.rectLeftLat = '';
        data.rectLeftLong = '';
        data.rectLeftAlt = '';
        data.rectLeftType = '';
        data.rectRightLat = '';
        data.rectRightLong = '';
        data.rectRightAlt = '';
        data.rectRightType = '';
        data.rectFenceType = ''; // 1 - on exit, 2 - on entry
        data.rectWidth = 0.0;
        data.rectHeight = 0.0;
        data.circleCenterLat = 0.0;
        data.circleCenterLon = 0.0;
        data.circleCenterAlt = 0;
        data.circleCenterType = 1;
        data.radius = 0;
        data.radiusUom = 2;
        data.circleFenceType = 2; // 1 - on exit, 2 - on entry
        data.status = '';
        data.action = '';
        data.geoFenceName = '';

        // added fields
        data.fenceType = 0; // 1 - on exit, 2 - on entry
        data.shapeType = 0; // 1 - rectangle, 2 - circle
        return data;
    }

    function GeofenceVM() {
        this.header = {
            active: true,
            action: 'insert',
        };
        this.geofenceList = [];
        this.source = '';
    }

    // circle object for google map directive
    function Circle() {
        this.center = {
            latitude: 0,
            longitude: 0
        };
        this.radius = 0;
        this.stroke = {
            color: '#DE0014',
            weight: 3,
            opacity: 1.0
        };
        this.fill = {
            color: '#DE0014',
            opacity: 0.2
        };
        this.editable = true;
        this.dragabble = true;
        this.geodesic = true;
        this.visible = true;
        this.events = {
            'center_changed': function(circle, eventName, model, args) {
                var center = circle.getCenter();
                //model.center.latitude = center.lat();
                //model.center.longitude = center.lng();
            },
            'radius_changed': function(circle, eventName, model, args) {
                $timeout(function() {
                    model.radius = circle.getRadius();
                });
            }
        };
        this.control = {};
    }

    function distanceToMeters(dist, type) {
        switch (type) {
            case "0": // ft
                dist = dist * 0.3048;
                break;
            case "1": // km
                dist = dist * 1000;
                break;
            case "3": // mi
                dist = dist * 1609.34;
                break;
        }
        return parseInt(dist);
    }

    function processCircle(data) {
      
        data.circle.center.latitude = data.circleCenterLat;
        data.circle.center.longitude = data.circleCenterLon;
        data.circle.radius = data.radius ? distanceToMeters(data.radius, data.radiusUom) : 0;
        return data.circle;
    }

    // rectangle object for google map directive
    function Rectangle() {
        this.bounds = {};
        this.fill = {
            color: '#DE0014',
            opacity: 0.2
        };
        this.stroke = {
            color: '#DE0014',
            weight: 3,
            opacity: 1.0
        };
        this.editable = true;
        this.dragabble = true;
        this.visible = true;
        this.events = {
            'bounds_changed': function() {
            
            }
        };
        this.control = {};
    }

    function processRectangle(data) {
        data.rectangle.bounds = {
            northeast: {
                latitude: data.rectRightLat,
                longitude: data.rectRightLon
            },
            southwest: {
                latitude: data.rectLeftLat,
                longitude: data.rectLeftLon
            }
        };

    }

    /*----------------------------------------------------
	Distance calculation functions
	-----------------------------------------------------*/

    function metersToMiles(dist) {
        dist = dist / 1609.34;
        if (dist < 10) {
            return Math.round(dist * 100) / 100;
        } else if (dist < 100) {
            return Math.round(dist * 10) / 10;
        } else {
            return Math.round(dist);
        }
    }

    function getSize(item) {

        // 1 = rectangle, 2 = circle
        if (item.shapeType === 2) {
            item.distanceDisplay = metersToMiles(item.circle.radius) + ' mi radius';
        } else {

            var NE = new _gMap.LatLng(item.rectangle.bounds.northeast.latitude, item.rectangle.bounds.northeast.longitude);
            var SW = new _gMap.LatLng(item.rectangle.bounds.southwest.latitude, item.rectangle.bounds.southwest.longitude);
            var NW = new _gMap.LatLng(item.rectangle.bounds.northeast.latitude, item.rectangle.bounds.southwest.longitude);

            item.distanceDisplay = metersToMiles(_gMap.geometry.spherical.computeDistanceBetween(NW, NE)) +
                ' mi x ' +
                metersToMiles(_gMap.geometry.spherical.computeDistanceBetween(NW, SW)) + ' mi';
        }
    }

    /*----------------------------------------------------
    View model processing
    -----------------------------------------------------*/

    function processGeofenceSettings(data) {
        var deferred = $q.defer();


        MapService.getGMap().then(function(map) {
            _gMap = map;

            var geoVm = new GeofenceVM();
            geoVm['Active'] = data.Active;
            geoVm['TmuStatus'] = data.TmuStatus;
            geoVm['LatestConfig'] = data.LatestConfig;
            for (var i = 0; i < data.GeoFenceAlertList.length; i++) {
                var item = data.GeoFenceAlertList[i];
                var center;
                item.circle = new Circle();
                item.rectangle = new Rectangle();

                if (item.circleFenceType === '0') {
                    item.fenceType = item.rectFenceType;
                    item.shapeType = 1;
                    processRectangle(item);
                    var bounds = new _gMap.LatLngBounds(
                        new _gMap.LatLng(item.rectangle.bounds.southwest.latitude, item.rectangle.bounds.southwest.longitude),
                        new _gMap.LatLng(item.rectangle.bounds.northeast.latitude, item.rectangle.bounds.northeast.longitude)
                    );
                    var tempCenter = bounds.getCenter();
                    center = {
                        latitude: tempCenter.lat(),
                        longitude: tempCenter.lng()
                    };
                    item.rectangle.events.bounds_changed = function(a, b, c, d) {

                        if ($rootScope.flag == false) {
                            $rootScope.$broadcast('change');
                        }
                    }
                } else {
                    item.fenceType = item.circleFenceType;
                    item.shapeType = 2;
                    var new_circle = processCircle(item);
                    item.circle.radius = new_circle.radius;
                    item.circle.center.longitude = new_circle.center.longitude;
                    item.circle.center.latitude = new_circle.center.latitude;
                    center = item.circle.center;
               
                    item.circle.events.radius_changed = function(circle, eventName, model, args) {
                        
                        if ($rootScope.flag == false) {
                            $rootScope.$broadcast('change');
                        }

                    }
                    item.circle.events.center_changed = function() {
                       
                        if ($rootScope.flag == false) {
                            $rootScope.$broadcast('change');
                        }
                    }
                }

                getSize(item);

                makeGeoCodeRequest(center, item);

                geoVm.geofenceList.push(item);
            }

            function makeGeoCodeRequest(center, geoItem) {
                MapService.makeReverseGeocodeRequest(center.latitude, center.longitude).then(function(response) {
                    geoItem.formattedAddress = response[1]['formatted_address'];
                });
            }

            deferred.resolve(geoVm);
        });

        return deferred.promise;
    }
    var data;

    function originalData() {
        return data;
    }

    function getGeofenceSettings() {
        var deferred = $q.defer();
        HttpService.get('/ccw/kh/geoFenceAlertSettings.do').then(function(response) {
         
            data = response;

            processGeofenceSettings(response.data.serviceResponse).then(function(data1) {
                deferred.resolve(data1);
            });
        });
        return deferred.promise;
    }

    function sendCurfews(geofence) {
        var deferred = $q.defer();
        var payload = SpringUtilsService.encodeParams({
            'geoFenceAlertPayload': JSON.stringify(geofence)
        });
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        var deferred = $q.defer();
        HttpService.post('/ccw/kh/geoFenceAlertSettings.do', payload, headers).then(function(response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    }

    function OnOffAlerts(onoff) {
        var deferred = $q.defer();
        var payload = SpringUtilsService.encodeParams({
            'onOffAlertPayload': JSON.stringify(onoff)
        });
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        var deferred = $q.defer();
        HttpService.post('/ccw/kh/onOffAlert.do', payload, headers).then(function(response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    }

    return {
        getGeofenceSettings: getGeofenceSettings,
        sendCurfews: sendCurfews,
        OnOffAlerts: OnOffAlerts,
        original: originalData,
        processGeofenceSettings: processGeofenceSettings,
        GeofenceEntity: GeofenceEntity

    };
};