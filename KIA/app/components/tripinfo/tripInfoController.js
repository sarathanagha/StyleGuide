'use strict';

module.exports = /*@ngInject*/ function($scope, $timeout, $q, $modal, MapService, TripInfoService) {
    var vm = this;
    var monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var _gMap;
    var _currentOptionSelect = -1;
    var _currentOptionSelectEnd = -1;
    var _selectedMonth = 1;
    var _selectedYear = 1970;
    var deleteTagAction = false;

    vm.maps = [];
    vm.map = {
        markerEvents: {
            click: function(marker, eventName, model, args) {
                vm.map.window.closeClick();
                vm.map.window.model = model;
                vm.map.window.show = true;
            }
        },
        mapEvents: {
            tilesloaded: function(map) {
                $scope.$apply(function() {
                    var center = map.getCenter();
                    _gMap.event.trigger(map, 'resize');
                    map.setCenter(center);
                });

            }
        }
    };

    vm.tripInfo = [];
    vm.showTripDetail = -1;
    vm.showMap = false;
    vm.originalTripInfo = [];
    vm.arrayTags = [];

    vm.monthName = function(monthNum) {
        return monthNames[monthNum - 1];
    };

    vm.tripCategory = function(tripCategory) {
        return (tripCategory === 0 ? 'Personal Trip' : 'Business Trip');
    };
    vm.hoursOrMinutes = function(value, unit) {
        if (unit === 'hrs') {
            return (value === 1 ? 'hour' : 'hours');
        } else {
            return (value === 1 ? 'minute' : 'minutes');
        }
    };

    vm.tripPersonal = function(tripCategory) {
        return (tripCategory === 0 ? true : false);
    };

    vm.tripBusiness = function(tripCategory) {
        return (tripCategory === 1 ? true : false);
    };

    vm.toggleButtons = function() {
        vm.displayButtons = !vm.displayButtons;
        vm.showOptionMerge = !vm.showOptionMerge;
        $('.tripinfo-container-xs .trip-detail img').toggle();
        if (vm.showOptionMerge) {
            $('.col-xs-9').css('width', '69%');
        } else {
            $('.col-xs-9').css('width', '78%');
        }
    };

    // vm.openAddTag = function() {
    // 	vm.showPoiDetail = true;
    // 	vm.showAddTag = true;
    // 	vm.showPoiDisplayOption = true;
    // };

    vm.searchTag = function(event) {
        if (!vm.tagSearch) {
            return;
        }
        if (event && event.keyCode !== 13) {
            return;
        }

        vm.noTagFound = true;
        vm.closeButton = true;

        TripInfoService.searchTag(vm.tagSearch).then(function(data) {
            if (data.length > 0) {
                vm.noTagFound = false;
                $scope.hideManage = {
                    'visibility': 'visible'
                };
                processTripData(data);
            }
        });
    };

    vm.escapeTagResult = function() {
        loadData();
        vm.noTagFound = false;

        vm.closeButton = false;
        vm.tagSearch = '';
        $scope.hideManage = {
            'visibility': 'visible'
        };
    };

    vm.openPoiMap = function() {
        vm.showPoiDetail = true;
        vm.showAddTag = false;
    };

    vm.closePoiMap = function() {
        vm.showPoiDetail = false;
        vm.showAddTag = false;
    };

    vm.tripDisplayed = function() {
        var countDisplayedTrip = 0;
        if (vm.tripInfo) {
            for (var i = 0; i < vm.tripInfo.length; i++) {
                if (_selectedYear === vm.tripInfo[i].year &&
                    (monthNames.indexOf(vm.initialMonth) + 1) === vm.tripInfo[i].month) {
                    countDisplayedTrip++;
            }
        }
    }
    return countDisplayedTrip;
};

vm.yearClick = function(year) {
    if (_selectedYear !== year) {
        _currentOptionSelect = -1;
        _currentOptionSelectEnd = -1;
    }
    _selectedYear = year;
    vm.initialYear = _selectedYear;

    for (var i = 0; i < vm.tripInfo.length; i++) {
        if (vm.tripInfo[i].year === vm.initialYear) {
            vm.monthClick(vm.tripInfo[i].month);
            return;
        }
    }
};

$scope.$watch('vm.initialYear', function() {
    if (vm.tripInfo) {
        vm.yearClick(vm.initialYear);
    }
});

vm.selectedMonth = function() {
    return monthNames.indexOf(vm.selectedMonthName()) + 1;
};

vm.selectedMonthName = function() {
    return vm.initialMonth;
};

vm.monthClick = function(month) {

    vm.showTripDetail = -1;

    if (_selectedMonth !== month) {
        _currentOptionSelect = -1;
        _currentOptionSelectEnd = -1;
    }
    _selectedMonth = month;
    vm.initialMonth = angular.uppercase(vm.monthName(_selectedMonth));
    _currentOptionSelect = -1;
    _currentOptionSelectEnd = -1;
};

vm.newestMonth = function() {
    return vm.tripInfo[0].month;
};

vm.displaySelectedMonth = function(month) {
    return angular.equals(month, (monthNames.indexOf(vm.initialMonth) + 1));
};

vm.displaySelectedYear = function(year) {
    return angular.equals(year, _selectedYear);
};

vm.displaySelectedMonthAndYear = function(month, year) {
    return angular.equals(month, (monthNames.indexOf(vm.initialMonth) + 1)) && angular.equals(year, _selectedYear);
};

    //Loop through vm.tripInfo to get the list of distinct unique months (in number) of each unique years.
    vm.tripMonthOfYear = function() {
        var month = [];
        var uniqueMonth = [];

        angular.forEach(vm.tripInfo, function(value, key) {
            if (angular.equals(_selectedYear, value.year)) {
                this.push(value.month);
            }
        }, month);

        $.each(month, function(i, el) {
            if ($.inArray(el, uniqueMonth) === -1) {
                uniqueMonth.push(el);
            }
        });

        return uniqueMonth;
    };

    //Convert list of distinct unique months (in number) to month name (JAN, FEB...)
    vm.tripMonthNameOfYear = function() {
        var uniqueMonthName = [];
        angular.forEach(vm.tripMonthOfYear(), function(value, key) {
            this.push(angular.uppercase(vm.monthName(value)));
        }, uniqueMonthName);

        return uniqueMonthName;
    };

    //Loop through vm.tripInfo to get the list of distinct unique years.
    vm.uniqueYear = function() {
        var year = [];
        var uniqueYear = [];

        angular.forEach(vm.tripInfo, function(value, key) {
            this.push(value.year);
        }, year);

        $.each(year, function(i, el) {
            if ($.inArray(el, uniqueYear) === -1) {
                uniqueYear.push(el);
            }
        });

        return uniqueYear;
    };

    // Below are verified functions

    vm.toggleMobilePanel = function(type, index) {
        if (type === 'tags') {
            vm.showMap = false;
            vm.showAddTag = true;
            vm.newTag = '';
        } else if (type === 'stats') {
            vm.showMap = false;
            vm.showAddTag = false;
        } else if (type === 'map') {
            vm.showMap = true;
            vm.showAddTag = false;

            var bounds = new google.maps.LatLngBounds();
            var markerPosition = [];

            for (var i = 0; i < vm.maps[index].markers.length; i++) {
                markerPosition[i] = new google.maps.LatLng(vm.maps[index].markers[i].latitude, vm.maps[index].markers[i].longitude);
                bounds.extend(markerPosition[i]);
            }

            $timeout(function() {
                var center = vm.maps[index].center;
                vm.maps[index].control.refresh(center);
                vm.maps[index].control.getGMap().fitBounds(bounds);
                //vm.maps[index].zoom=8;
            }, 100);
        }
    };

    // Used for error validation
    vm.hasDuplicateTags = function(form, tags, index) {
        var hasDupe = false;
        form.newTag.$setValidity('duplicate', true);
        if (vm.tripInfo[index].tags.indexOf(vm.newTag) !== -1) {
            form.newTag.$setValidity('duplicate', false);
            hasDupe = true;
        }
        return hasDupe;
    };

    vm.disableInput = function() {
        var disable = false;
        if (vm.tagsInput && vm.tagsInput.length >= 5) {
            disable = true;
        }
        return disable;
    };

    vm.hasTags = function(index) {
        return vm.tripInfo[index].tags.length > 0;
    };

    vm.deleteTag = function(index, currentArray) {
        vm.tagsInput.splice(index, 1);
        deleteTagAction = true;
    };

    vm.closeAddTag = function(form, index) {

        function closeTagPanel() {
            vm.showPoiDetail = false;
            vm.showAddTag = false;
            vm.showPoiDisplayOption = false;
            form.newTag.$setValidity('duplicate', true);
            form.newTag.$setValidity('pattern', true);
        }

        //form.$setSubmitted(true);
        if (!form.$invalid || deleteTagAction) {
            if ((vm.newTag || vm.tagsInput.length !== vm.tripInfo[index].tags.length)) {
                if (vm.newTag && vm.tripInfo[index].tags.indexOf(vm.newTag) == -1) {
                    vm.tagsInput.push(vm.newTag);
                }
                var tripsString = vm.tagsInput.join(',');
                TripInfoService.updateTripTag(vm.tripInfo[index].drivingDetailId, tripsString).then(function() {
                    vm.tripInfo[index].tags = angular.copy(vm.tagsInput);
                    closeTagPanel();
                });
                deleteTagAction = false;
            }
        }
        if (!form.newTag.$error.duplicate && !form.newTag.$error.pattern) {
            closeTagPanel();
        }
    };

    vm.updateTripCategory = function(index, catId) {
        var category = vm.tripInfo[index].tripCategory;
        if (category !== catId) {
            var id = vm.tripInfo[index].drivingDetailId;
            TripInfoService.updateTripCategory(id).then(function() {
                vm.tripInfo[index].tripCategory = category === 1 ? 0 : 1;
            });
        }
    };

    vm.toggleTripDetail = function(index) {
        if (vm.showTripDetail === index) {
            vm.showTripDetail = -1;
        } else {
            // initialize vars for trip details
            vm.showTripDetail = index;
            vm.tagsInput = angular.copy(vm.tripInfo[index].tags);
            vm.showMap = false;
            vm.showAddTag = false;
            vm.newTag = '';
        }
    };

    vm.isOptionSelected = function(index) {

        return index >= _currentOptionSelect && index <= _currentOptionSelectEnd;
    };

    vm.mergeButtonActive = function() {
        return _currentOptionSelect !== _currentOptionSelectEnd;
    };

    vm.unMergeButtonActive = function() {
        if (!vm.tripInfo[_currentOptionSelect]) {
            return false;
        }
        return vm.tripInfo[_currentOptionSelect].journeyId > 0;
    };

    
    vm.selectMerge = function(index) {
        //console.log("ssss::",_currentOptionSelectEnd-_currentOptionSelect+index-_currentOptionSelectEnd);
        var SelectedItems=_currentOptionSelectEnd-_currentOptionSelect+index-_currentOptionSelectEnd;
        if(SelectedItems>=5){
            vm.selectMergeModal = $modal.open({
                templateUrl: 'LimitSelection',
                scope: $scope,
                windowClass: 'limit'
            });
            return false;
        }
        
        


        if (_currentOptionSelect === -1 ||
            (vm.tripInfo[_currentOptionSelect] && vm.tripInfo[_currentOptionSelect].journeyId - vm.tripInfo[index].journeyId !== 0)
            ) {

            _currentOptionSelect = index;
        _currentOptionSelectEnd = index;
    } else {
            // Unselect if index equals current selection
            if (index === _currentOptionSelect && index === _currentOptionSelectEnd) {
                _currentOptionSelect = -1;
                _currentOptionSelectEnd = -1;
                // Starting point moves right
            } else if (index === _currentOptionSelect) {
                _currentOptionSelect++;
                // Ending point moves left
            } else if (index === _currentOptionSelectEnd) {
                _currentOptionSelectEnd--;
                // If no merge is in between, adjust points
            } else {
                var tempStart = index < _currentOptionSelect ? index : _currentOptionSelect;
                var tempEnd = index > _currentOptionSelectEnd ? index : _currentOptionSelectEnd;
                var i, adjustIndex = true;
                for (i = tempStart + 1; i < tempEnd; i++) {
                    if (vm.tripInfo[i].journeyId !== 0) {
                        adjustIndex = false;
                        break;
                    }
                }
                if (adjustIndex) {
                    _currentOptionSelect = tempStart;
                    _currentOptionSelectEnd = tempEnd;
                }
            }
        }
        




};
    // close select merge modal
    vm.closeSelectMerge = function() {
        vm.selectMergeModal.close();
    }

    vm.mergeTrips = function() {

        function merge(trips) {

            TripInfoService.mergeTrips(trips).then(function() {
                vm.toggleButtons();
                loadData();
                _currentOptionSelect = -1;
                _currentOptionSelectEnd = -1;
            });
        }

        if (vm.mergeButtonActive()) {
            var trips = [],
            i;
            var numPersonal = 0,
            numBusiness = 0;


            for (i = _currentOptionSelect; i <= _currentOptionSelectEnd; i++) {
                if (vm.tripInfo[i].tripCategory === 0) {
                    numPersonal++;
                } else {
                    numBusiness++;
                }
                trips.push(vm.tripInfo[i]);
            }

            if (numPersonal > 0 && numBusiness > 0) {
                // show prompt
                var modalInstance = $modal.open({
                    templateUrl: 'views/components/tripinfo/trip-merge-modal.html',
                    size: 'sm'
                });

                modalInstance.result.then(function(category) {
                    for (var j = 0; j < trips.length; j++) {
                        trips[j].tripCategory = category;
                    }

                    merge(trips);
                });
            } else {
                merge(trips);
            }


        }

    };

    vm.unMergeTrips = function() {
        if (vm.unMergeButtonActive()) {
            TripInfoService.unMergeTrips(vm.tripInfo[_currentOptionSelect].journeyId).then(function() {
                vm.toggleButtons();
                loadData();
                _currentOptionSelect = -1;
                _currentOptionSelectEnd = -1;
            });
        }
    };
    
    // this should be done in service
    function processTripData(data) {
        vm.tripInfo = data;
        
        //vm.originalTripInfo = vm.tripInfo;
        vm.initialYear = vm.uniqueYear()[0];
        vm.initialMonth = angular.uppercase(vm.monthName(vm.newestMonth()));

        function loadMaps() {
            var i;

            for (i = 0; i < vm.tripInfo.length; i++) {
                var mapOptions = {
                    mapIndex: i,
                    markerEvents: {
                        click: function(marker, eventName, model, args) {
                            var mapIndex = model.mapIndex;
                            var field = model.id === 0 ? 'geocodeStart' : 'geocodeEnd';

                            function checkGeocode(index) {
                                var deferred = $q.defer();
                                if (vm.tripInfo[index][field]) {
                                    deferred.resolve();
                                } else {
                                    MapService.makeReverseGeocodeRequest(model.latitude, model.longitude).then(function(data) {
                                        var addressComponents = data[0]['formatted_address'] ?
                                        MapService.getAddressComponents(data[0]['formatted_address']) : {
                                            'street': 'Unable to find address'
                                        };
                                        var dateField = model.id === 0 ? 'startDisplayDate' : 'endDisplayDate';

                                        vm.tripInfo[index][field] = addressComponents;
                                        vm.tripInfo[index][field].date = vm.tripInfo[index][dateField];
                                        deferred.resolve();
                                    });
                                }
                                return deferred.promise;
                            }

                            checkGeocode(mapIndex).then(function() {
                                vm.tripInfo[mapIndex].geocode = model.id === 0 ?
                                vm.tripInfo[mapIndex].geocodeStart : vm.tripInfo[mapIndex].geocodeEnd;
                                vm.maps[mapIndex].window.closeClick();
                                vm.maps[mapIndex].window.model = model;
                                vm.maps[mapIndex].window.show = true;
                            });
                        }
                    },
                    mapEvents: {
                        tilesloaded: function(map) {
                            $scope.$apply(function() {
                                var center = map.getCenter();
                                _gMap.event.trigger(map, 'resize');
                                map.setCenter(center);
                            });
                        }
                    }
                };

                mapOptions = angular.extend(mapOptions, MapService.createMapOptions());
                mapOptions.window.options = MapService.createInfoBoxOptions(i, false, {
                    pixelOffset: new _gMap.Size(-114, -57)
                });

                var startMarker = MapService.createMarker(0, vm.tripInfo[i].startLat, vm.tripInfo[i].startLong);
                var endMarker = MapService.createMarker(1, vm.tripInfo[i].endLat, vm.tripInfo[i].endLong);
                startMarker.icon = 'images/MyCarZone/marker_green_driving_start.png';
                startMarker.mapIndex = i;
                startMarker.date = vm.tripInfo[i].startDisplayDate;
                endMarker.icon = 'images/MyCarZone/marker_blue_end.png';
                endMarker.mapIndex = i;
                endMarker.date = vm.tripInfo[i].endDisplayDate;

                mapOptions.markers.push(endMarker);
                mapOptions.markers.push(startMarker);
                vm.maps.push(mapOptions);
            }
        }

        if (_gMap) {
            loadMaps();
        } else {
            MapService.getGMap().then(function(map) {
                _gMap = map;
                loadMaps();
            });
        }
    }

    function loadData() {
        TripInfoService.getTripInfo().then(function(data) {
            vm.originalTripInfo = data;
            processTripData(data);
        });
    }

    loadData();

};