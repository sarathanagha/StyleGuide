'use strict';

module.exports = /*@ngInject*/ function(VehicleSwitcherService, CarInfoService, $document, $state) {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            vehicles: '=vehicles',
            selectedVehicle: '=selectedVehicle'
        },
        templateUrl: 'views/shared/modules/vehicleSwitcher/vehicle-switcher-directive.html',
        link: function(scope, element, attrs, vm) {
            function Makeit(vehicle) {

            }
            scope.vehicleenablecar = [];

            scope.getActive = function(vehicle) {



                var enabled = true;
                if (vehicle.fuelType === '4') {
                    enabled = vehicle.enrVin === 'A';
                } else if (vehicle.mdlNm === 'K900' && vehicle.khVehicle === 'K900') {
                    enabled = vehicle.enrVinKh === '4';
                } else {
                    if (vehicle.actVin === 'Y') {
                        enabled = false;
                    }
                }
                return enabled;
            };
            CarInfoService.getCarInfo().then(function(data) {
                scope.vehicles = data.vehicles;
                scope.selectedVehicle = data.selectedVehicle;
                angular.forEach(scope.vehicles, function(val, key) {
                    scope.vehicleenablecar[key] = scope.getActive(val);
                    if (scope.vehicleenablecar.length - 1 == key) {
                        if (scope.vehicleenablecar.indexOf(false) == -1)
                            angular.forEach(scope.vehicleenablecar, function(v, k) {
                                scope.vehicleenablecar[k] = true;
                            });
                    }
                    // val.enablecar=scope.getActive(val);
                });
            });
            //  scope.vehicles = carInfo.vehicles;
            //   scope.selectedVehicle = carInfo.selectedVehicle;
            //var arrowElem = element.find('.arrow');
            var arrowElem = element.find('.Switchwrap');
            var switcherElem = element.find('#vehicle-switcher');
            var checkElem = element.find('.check');

            // this includes arrow and switcher element
            var isSwitcherClicked = false;

            // hide switcher if user clicks anywhere besides arrow or switcher element
            $document.bind('click', function(event) {
                event.stopPropagation();
                if (isSwitcherClicked) {
                    isSwitcherClicked = false;
                } else {
                    switcherElem.addClass('hide');
                }
            });

            // arrow click event
            arrowElem.bind('click', function() {
                switcherElem.toggleClass('hide');
                isSwitcherClicked = true;
            });

            // switcher click event
            switcherElem.bind('click', function() {
                isSwitcherClicked = true;
            });

            scope.switchVehicle = function(type, vin) {
                switcherElem.addClass('hide');
                VehicleSwitcherService.switchVehicle(type, vin);
            };

            scope.goToVehiclesPage = function() {
                $state.go('default.vehicles');
            };
        }
    };
};