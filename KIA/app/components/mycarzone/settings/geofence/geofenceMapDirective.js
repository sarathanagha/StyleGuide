//'use strict';

module.exports = /*@ngInject*/ function(MapService, $timeout, $rootScope) {

    function link(scope, element, attr) {
        var Load_radius = scope.circle.radius;
        var Load_center = angular.copy(scope.circle.center);
        $rootScope.$broadcast('unchange');
        var global = {};
        var events = {
            places_changed: function(searchBox) {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }
                // For each place, get the icon, place name, and location.
                var newMarkers = [];
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0, place; place = places[i]; i++) {
                    // Create a marker for each place.
                    var marker = {
                        id: i,
                        place_id: place.place_id,
                        name: place.name,
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        options: {
                            visible: false
                        },
                        templateurl: 'window.tpl.html',
                        templateparameter: place
                    };

                    global = {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    };

                    newMarkers.push(marker);

                    bounds.extend(place.geometry.location);
                }

                scope.map.bounds = {
                    northeast: {
                        latitude: bounds.getNorthEast().lat(),
                        longitude: bounds.getNorthEast().lng()
                    },
                    southwest: {
                        latitude: bounds.getSouthWest().lat(),
                        longitude: bounds.getSouthWest().lng()
                    }
                };
                scope.mobileMap.bounds = {
                    northeast: {
                        latitude: bounds.getNorthEast().lat(),
                        longitude: bounds.getNorthEast().lng()
                    },
                    southwest: {
                        latitude: bounds.getSouthWest().lat(),
                        longitude: bounds.getSouthWest().lng()
                    }
                };

                var obj = {
                    latitude: bounds.getCenter().lat(),
                    longitude: bounds.getCenter().lng()
                }
                var circleObj = {}
                $timeout(function() {
                    scope.map.center = obj;
                    scope.mobileMap.center = obj;
                    scope.circle.center = global;
                    scope.map.zoom = 12;
                    scope.circle.radius = 5000;
                    scope.mobileMap.zoom = 12;
                    var oCircle = new _gMap.Circle();
                    oCircle.setCenter(new _gMap.LatLng(scope.circle.center.latitude, scope.circle.center.longitude));
                    oCircle.setRadius(parseInt(scope.circle.radius));

                    scope.rectangle.bounds = oCircle.getBounds();
                    if (scope.circle.hasOwnProperty('added') == false) {
                        $rootScope.$broadcast('change');
                    }

                }, 1000);

            }
        }
        scope.$watch("circle.radius", function(value, oldvalue) {

            if (Load_radius != value && scope.circle.hasOwnProperty('added') == false) {
                $rootScope.$broadcast('change');
            }
        }, true);
        scope.$watch("circle.center", function(value, oldvalue) {
            if (scope.circle.hasOwnProperty('added') == false && (Number(Load_center.latitude) != Number(value.latitude) || Number(Load_center.longitude) != Number(value.longitude))) {
                $rootScope.$broadcast('change');
            }
        }, true);

        scope.changeDimention = function(param, value) {

            var new_bounds = {};
            var c = Math.cos(scope.rectangle.bounds.getNorthEast().lat() * Math.PI / 180);
            var r = 0.01;

            if (param == 'h') {
                if (value == '-') {
                    new_bounds = {
                        northeast: {
                            latitude: scope.rectangle.bounds.getNorthEast().lat(),
                            longitude: scope.rectangle.bounds.getNorthEast().lng()
                        },
                        southwest: {
                            latitude: scope.rectangle.bounds.getSouthWest().lat() + c * r / 2,
                            longitude: scope.rectangle.bounds.getSouthWest().lng()
                        }
                    };
                } else {
                    new_bounds = {
                        northeast: {
                            latitude: scope.rectangle.bounds.getNorthEast().lat(),
                            longitude: scope.rectangle.bounds.getNorthEast().lng()
                        },
                        southwest: {
                            latitude: scope.rectangle.bounds.getSouthWest().lat() - c * r / 2,
                            longitude: scope.rectangle.bounds.getSouthWest().lng()
                        }
                    };
                }
            } else {
                if (value == '-') {
                    new_bounds = {
                        northeast: {
                            latitude: scope.rectangle.bounds.getNorthEast().lat(),
                            longitude: scope.rectangle.bounds.getNorthEast().lng() + c * r / 2
                        },
                        southwest: {
                            latitude: scope.rectangle.bounds.getSouthWest().lat(),
                            longitude: scope.rectangle.bounds.getSouthWest().lng()
                        }
                    };
                } else {
                    new_bounds = {
                        northeast: {
                            latitude: scope.rectangle.bounds.getNorthEast().lat(),
                            longitude: scope.rectangle.bounds.getNorthEast().lng() - c * r / 2
                        },
                        southwest: {
                            latitude: scope.rectangle.bounds.getSouthWest().lat(),
                            longitude: scope.rectangle.bounds.getSouthWest().lng()
                        }
                    };
                }
            }
            var rectBounds = new _gMap.LatLngBounds(
                new _gMap.LatLng(new_bounds.southwest.latitude, new_bounds.southwest.longitude),
                new _gMap.LatLng(new_bounds.northeast.latitude, new_bounds.northeast.longitude)
            );

            scope.rectangle.bounds = rectBounds;


        }
       
        scope.searchbox = {
            template: 'searchbox.tpl.html',
            events: events
        };
        var _gMap;
        var _tilesLoadedOnce = false;

        scope.showMap = false;
        var flag = true;
        var shapeChange = scope.shapeType;
        $rootScope.flag = true;
        scope.toggleShape = function(type) {
            if (scope.edit == true) {

                if (shapeChange == type) {
                    $rootScope.$broadcast('unchange');
                    $rootScope.flag = true;
                } else if (scope.circle.hasOwnProperty('added') == false) {
                    $rootScope.$broadcast('change');
                    $rootScope.flag = false;
                }
                if (type !== scope.shapeType) {
                    scope.shapeType = type;

                    if (type === 1) {
                        var oCircle = new _gMap.Circle();
                        oCircle.setCenter(new _gMap.LatLng(scope.circle.center.latitude, scope.circle.center.longitude));
                        oCircle.setRadius(parseInt(scope.circle.radius));
                        
                
                 
             scope.rectangle.bounds = oCircle.getBounds();
        
                        scope.rectangle.visible = true;
                        scope.circle.visible = false;
                    } else {
                        var center = scope.rectangle.bounds.getCenter();
                        var northWest = new _gMap.LatLng(scope.rectangle.bounds.getSouthWest().lat(), scope.rectangle.bounds.getNorthEast().lng());
                        var radius = _gMap.geometry.spherical.computeDistanceBetween(northWest, scope.rectangle.bounds.getNorthEast()) / 2.0;
                        if (scope.circle.hasOwnProperty('added') == true) {
                            scope.circle.center = {};
                        }
                        scope.circle.center.latitude = center.lat();
                        scope.circle.center.longitude = center.lng();

                        scope.circle.radius = radius;

                        scope.rectangle.visible = false;
                        scope.circle.visible = true;
                    }
                }
            }
        };
        scope.map = {
            events: {
                tilesloaded: function(map) {

                    if (!_tilesLoadedOnce) {
                        _tilesLoadedOnce = true;

                        var bounds = scope.map.bounds;

                        map.fitBounds(bounds);


                    }
                }
            },
            markerEvents: {
                click: function(marker, eventName, model, args) {}
            },
            circleEvents: {
                radius_changed: function() {

                }
            }
        };
        scope.mobileMap = {
            events: {
                tilesloaded: function(map) {

                    //map.setZoom(12)
                    if (!_tilesLoadedOnce) {

                        _tilesLoadedOnce = true;

                        var bounds = scope.mobileMap.bounds;
                        map.fitBounds(bounds);


                    }
                }
            },
            markerEvents: {
                click: function(marker, eventName, model, args) {}
            }
        };

        // watch show attribute to trigger ng-if and show/hide map 

        attr.$observe('show', function(val) {
            $timeout(function() {
                scope.showMap = val === 'true';
            });
        });


        // initialize google maps

        MapService.getGMap().then(function(gMap) {
            _gMap = gMap;

            scope.map = angular.extend(scope.map, MapService.createMapOptions());
            scope.mobileMap = angular.extend(scope.mobileMap, MapService.createMapOptions());
            scope.mobileMap.options.panControl = false;
            scope.mobileMap.options.zoomControl = false;

            if (scope.shapeType === 1) {
                scope.circle.visible = false;
                scope.rectangle.visible = true;
                var rectangle = scope.rectangle;
                var rectBounds = new _gMap.LatLngBounds(
                    new _gMap.LatLng(rectangle.bounds.southwest.latitude, rectangle.bounds.southwest.longitude),
                    new _gMap.LatLng(rectangle.bounds.northeast.latitude, rectangle.bounds.northeast.longitude)
                );

                scope.rectangle.bounds = rectBounds;

                scope.map.bounds = rectBounds;
                scope.mobileMap.bounds = rectBounds;

            } else {
                scope.rectangle.visible = false;
                scope.circle.visible = true;
                var circle = scope.circle;
                var center = {
                    latitude: circle.center.latitude,
                    longitude: circle.center.longitude
                };

                scope.map.center = {
                    latitude: circle.center.latitude,
                    longitude: circle.center.longitude
                };
                scope.mobileMap.center = {
                    latitude: circle.center.latitude,
                    longitude: circle.center.longitude
                };

                var oCircle = new _gMap.Circle();
                oCircle.setCenter(new _gMap.LatLng(circle.center.latitude, circle.center.longitude));
                oCircle.setRadius(parseInt(circle.radius));

                scope.circle.bounds = oCircle.getBounds();
                scope.map.bounds = oCircle.getBounds();
                scope.mobileMap.bounds = oCircle.getBounds();

            }
            scope.map.zoom = 13;

            if (scope.circle.hasOwnProperty('fail') == true) {
                scope.map.zoom = 5;
                scope.mobileMap.zoom = 5;
                scope.circle.radius = 500000;
            } else {
                if (scope.circle.radius == 0) {
                    scope.map.zoom = 13;
                    scope.mobileMap.zoom = 13;
                } else if (scope.circle.radius <= 150) {
                    scope.map.zoom = 17;
                    scope.mobileMap.zoom = 17;
                } else if (scope.circle.radius > 150 && scope.circle.radius <= 400) {
                    scope.map.zoom = 16;
                    scope.mobileMap.zoom = 15;
                } else if (scope.circle.radius > 400 && scope.circle.radius <= 1868) {
                    scope.map.zoom = 14;
                    scope.mobileMap.zoom = 14;
                } else if (scope.circle.radius > 1868 && scope.circle.radius <= 3758) {
                    scope.map.zoom = 13;
                    scope.mobileMap.zoom = 13;
                } else if (scope.circle.radius > 3758 && scope.circle.radius <= 7728) {
                    scope.map.zoom = 12;
                    scope.mobileMap.zoom = 11;
                } else if (scope.circle.radius > 7728 && scope.circle.radius <= 29169) {
                    scope.map.zoom = 10;
                    scope.mobileMap.zoom = 9;
                } else if (scope.circle.radius > 29169 && scope.circle.radius <= 121479) {
                    scope.map.zoom = 8;
                    scope.mobileMap.zoom = 7;
                } else if (scope.circle.radius > 121479 && scope.circle.radius <= 485007) {
                    scope.map.zoom = 6;
                    scope.mobileMap.zoom = 5;
                } else if (scope.circle.radius > 485007 && scope.circle.radius <= 1881318) {
                    scope.map.zoom = 4;
                    scope.mobileMap.zoom = 3;
                } else {
                    scope.map.zoom = 3;
                    scope.mobileMap.zoom = 2;
                }
            }
        });
        scope.changeRadius = function(sign) {

            if (sign == '+') {

                scope.circle.radius = scope.circle.radius + 1000;
            } else {
                if (scope.circle.radius >= 1000) {
                    scope.circle.radius = scope.circle.radius - 1000;
                } else {
                    scope.circle.radius = 100;
                }

            }
            scope.$watch('edit', function(newv, oldv) {}, true);
        }

    }

    return {
        restrict: 'A',
        templateUrl: 'views/components/mycarzone/settings/geofence/includes/geofence-map.html',
        scope: {
            circle: '=circleData',
            rectangle: '=rectangleData',
            shapeType: '=',
            edit: "="
        },
        link: link
    };
};