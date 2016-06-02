window.console = window.console || (function () {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function () {
    };
    return c;
})();


(function () {
    //Polyfill from MDN to fix IE8 Object.create issue.
    if (typeof Object.create !== 'function') {
        (function () {
            var F = function () {};
            Object.create = function (o) {
                if (arguments.length > 1) {
                    throw Error('Second argument not supported');
                }
                if (o === null) {
                    throw Error('Cannot set a null [[Prototype]]');
                }
                if (typeof o != 'object') {
                    throw TypeError('Argument must be an object');
                }
                F.prototype = o;
                return new F();
            };
        }());
    }

    var Maps = google.maps;

    var getBaseMapOptions = (function () {
        var baseMapOptions = {
            zoom : 12,

            mapTypeControl        : false,
            mapTypeControlOptions : {style : Maps.MapTypeControlStyle.DROPDOWN_MENU},

            panControl        : true,
            panControlOptions : {
                position : Maps.ControlPosition.TOP_RIGHT
            },

            zoomControl        : true,
            zoomControlOptions : {
                style    : Maps.ZoomControlStyle.DEFAULT,
                position : Maps.ControlPosition.TOP_RIGHT
            },

            streetViewControl : false,
            //center            : new google.maps.LatLng(lat, lng),
            mapTypeId         : Maps.MapTypeId.ROADMAP
        };

        return function () {
            return Object.create(baseMapOptions);
        };
    }());

    var InfoWindow = new Maps.InfoWindow({maxWidth:393});
    var Geocoder = new Maps.Geocoder();
    var domLocker;



    function makeGeocodeRequest(search) {
        var deferred = new $.Deferred();
        Geocoder.geocode({'address' : search, componentRestrictions : { country : 'us'}}, function (results, status) {
            if (status == Maps.GeocoderStatus.OK) {
                deferred.resolve(results);
            } else {
                deferred.reject(status);
            }
        });
        return deferred;
    }

    function geocodeZip(zip) {
        var deferred = new $.Deferred();
        $.ajax({
            type : 'GET',
            url  : '/ccw/ev/isUSRegion.do?zipcode=' + zip
        }).done(function (response) {
            $.when(makeGeocodeRequest(zip)).done(function (results) {
                deferred.resolve(results);
            }).fail(function (err) {
                deferred.reject(err);
            });
        }).fail(function (err) {
            deferred.reject(err);
        });
        return deferred;
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
    
    function mapStreetView(lat, lon){
    	var fenway = new google.maps.LatLng(lat,lon);
        var mapOptions = {
          center: fenway,
          zoom: 14,
          disableDefaultUI: true
        };
        var map = new google.maps.Map(
            document.getElementById('map-street-view'), mapOptions);
        var panoramaOptions = {
          position: fenway,
          pov: {
            heading: 0,
            pitch: 0
          },
          linksControl: false,
          addressControl:false,
          panControl: false,
          zoomControl:false
        };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
        map.setStreetView(panorama);
    }

    function retrieveChargingStations(lat, lng, search) {
        displayLoading();
        
        var brandChoice, addressString = $.trim(search || '');
        brandChoice = $('input:checkbox[name=allBrands]').is(':checked')?'All':$("input:checkbox[name=brandchoice]:checked").map(function () {return this.value;}).get().join(",");
        var requestParams = {
            'distance' : $("input:radio[name=distancechoice]:checked").val(),
            //'brand'    : $("input:checkbox[name=brandchoice]:checked").val(),
            'brand'    :brandChoice,
            'type'     : $("input:radio[name=voltchoice]:checked").val()
        };

        //checks to see if provided addressString is a zip code, if so, strip it to the first 5 digits
        var isZipCode = ~addressString.search(/^[0-9]{5,}(?=-[0-9]{4,}|$)/);
        addressString = ( isZipCode ? addressString.substr(0, 5) : addressString );

        var getLatLng = {};
        if (isZipCode) {
            requestParams.zipcode = addressString;
            getLatLng = geocodeZip(addressString);
        } else if (addressString) {
            requestParams.city = addressString;
            getLatLng = makeGeocodeRequest(addressString);
        }

        $.when(getLatLng).done(function drawMapForResults(geocodeResult) {
            var mapCenter;
            if (geocodeResult.length) {
                mapCenter = geocodeResult[0].geometry.location;
            } else {
                mapCenter = new Maps.LatLng(lat, lng);
            }

            requestParams.lat = mapCenter.lat();
            requestParams.lng = mapCenter.lng();

            var mapOptions = getBaseMapOptions();
            mapOptions.center = mapCenter;
            var resultMap = new Maps.Map($("#map-canvas").get(0), mapOptions);

            /*var centerMark = new Maps.Marker({
                map      : resultMap,
                position : mapCenter,
                icon     : '/images/station/address-pin.png'
            });
            centerMark.setMap(resultMap);*/

            var chargingStationRequest = $.ajax({
                url      : '/ccw/fcs/fcs01.do?' + $.param(requestParams),
                type     : "GET",
                dataType : "json"
            }).done(function chargingStationsRecieved(chargingStationLocations) {
                var csLocations;
                if (!chargingStationLocations[0].chargingstation || chargingStationLocations[0].chargingstation.id === "") {
                    $("#leftboxredId").addClass("hide");
                    csLocations = [];
                } else {
                    $("#leftboxredId").removeClass("hide");
                    csLocations = chargingStationLocations;
                }
                
                InfoWindow.close(); //Close InfoWindow when start new search in case user didn't close it.

                var $baseListItem = domLocker.find('.chargestation-list-item');
                var $baseInfoWindowContent = domLocker.find('.chargestation-infowindow-content');
                var $listContainer = $("#csresults");

                $listContainer.find("li").off('click');
                $listContainer.empty();

                $.each(csLocations, function (index, stationLocation) {
                    var coords = stationLocation.geometry.coordinates;
                    var markPoint = new Maps.LatLng(coords[0], coords[1]);
                    var chargeStation = stationLocation.chargingstation;

                    var $stationContent = $baseInfoWindowContent.clone();
                    var $listItem = $baseListItem.clone();

                    var descriptionLines = [
                        chargeStation.name, chargeStation.address, chargeStation.city + ", " + chargeStation.state + " " + chargeStation.zip, chargeStation.phone
                    ];
                    $listItem.find(".txtPlace").html(descriptionLines.join("<br />"));
                    $listItem.find('.distance').text(google.maps.geometry.spherical.computeDistanceBetween(mapCenter, markPoint).toFixed(0)/1000 + " MI");
                    $listContainer.append($listItem);

                    var stationMarker = new Maps.Marker({
                        map      : resultMap,
                        position : markPoint,
                        icon     : '/images/station/mark.png'
                    });

                    stationMarker.setMap(resultMap);

                    $stationContent.find(".txtAddress").html(descriptionLines.slice(0, 3).join("<br />"));
                    $stationContent.find(".txtPhone").text(chargeStation.phone);
                    $stationContent.find(".brand-logo").attr('src', "../img/station/" + getBrandLogoString(chargeStation.brand));
                    $stationContent.find('.txtAddressDetail').text(chargeStation.ldesc);

                    var startAddr = addressString || (lat + "," + lng);
                    var endAddr = chargeStation.address + ' ' + chargeStation.city + '  ' + chargeStation.state;
                    $stationContent.find('.boxGetDirection a').attr("href", 'https://maps.google.com/maps?f=d&saddr=' + startAddr + '&daddr=' + endAddr + '&dirflg=h');

                    $stationContent.find('.distance').text(google.maps.geometry.spherical.computeDistanceBetween(mapCenter, markPoint).toFixed(0)/1000 + " miles away");

                    for (var i = 0; i < chargeStation.status.length; i++) {
                        var status = chargeStation.status[i];
                        var chargeType = status.chtype;
                        var avail = +(status.numavail || 0);
                        var off = +(status.numoff || 0);
                        var inuse = +(status.numinuse || 0);
                        var total = avail + off + inuse;
                        var $statusContent = $stationContent.find(".level0" + chargeType);
                        $statusContent.find("span.txtlight:eq(0)").text(avail);
                        $statusContent.find("span.txtlight:eq(1)").text("/ " + total + " available");
                    }

                    var togglePin = function togglePin() {
                        InfoWindow.setContent($stationContent[0]);
                        InfoWindow.setPosition(markPoint);
                        InfoWindow.open(resultMap,stationMarker);
                        if ($listItem.hasClass("selected")) {
                            InfoWindow.close();
                            $listItem.removeClass("selected");
                        } else {
                            $listContainer.find(".selected").removeClass("selected");
                            $listItem.addClass("selected");
                            Maps.event.addListenerOnce(InfoWindow, 'closeclick', function () {
                                $listItem.removeClass("selected");
                                $("#show-arrow").click();
                            });
                            $("#hide-arrow").click();
                            resultMap.setCenter(markPoint);
                        }
                        mapStreetView(chargeStation.lat, chargeStation.lon);
                    };

                    $listItem.on('click', togglePin);
                    Maps.event.addListener(stationMarker, 'click', togglePin);

                });

                $('#totalresults').text(csLocations.length);

                $(".address_section").removeClass("hide");
                //$(".address_section_error").addClass("hide");
                $("input.csZipcodeCity").val(addressString);

                //$("#filterBtn").toggleClass("hide", csLocations.length == 0);
                $('.noresults').toggleClass("hide", csLocations.length != 0);
                if(csLocations.length == 0) 
                	$('.bottom-results, #leftboxredId').hide();
                else
                    $('.bottom-results, #leftboxredId').show();
                	
                hideLoading();
            }).fail(function (errResponse) {
                displayError("Bad response from server.");
                drawDefaultMap();
            });
        }).fail(function (errResponse) {
            if (isZipCode) {
                displayError("Not a valid US zip code.");
            } else {
                displayError("Couldn't find that address or city.");
            }
            drawDefaultMap();
        });
    }

    function resetSearchControls() {
        $("#rightRedBoxId").removeClass("hide");
        $(".address_section").addClass("hide");
        $(".address_section_error").removeClass("hide");
        $("#leftboxredId").removeClass("hide");
        $("#csZipcodeCityId").focus();
    }

    function drawDefaultMap() {
        var mapOptions = getBaseMapOptions();
        mapOptions.center = new Maps.LatLng(36.1314, -95.9372);
        mapOptions.zoom = 4;
        var defaultMap = new google.maps.Map($("#map-canvas").get(0), mapOptions);
    }

    function displayError(errorMsg) {
        var msg = errorMsg || "There was an error.";
        $("#errorMessage").text(msg);
        $("#dismissButton").removeClass("hide");
        $("#uiBlock").removeClass('hide');
    }

    function displayLoading(loadingMsg) {
        var msg = loadingMsg || "Locating charging stations...";
        $("#errorMessage").text(msg);
        $("#dismissButton").addClass("hide");
        $("#uiBlock").removeClass('hide');
    }

    function hideLoading() {
        $("#uiBlock").addClass("hide");
    }

    var getBrandLogoString = (function () {
        var brandSearch = {
            'Blink'      : 'logo-blink.png',  // Blink
            'OpConnect'  : 'logo-op.png',     // OpConnect
            'Shorepower' : 'logo-shore.png',  // Shorepower
            'AeroV'      : 'logo-aero.png',   // AeroVironment Network
            'ChargeP'    : 'logo-charge.jpg', // ChargePoint Network
            'eVgo'       : 'logo-evgo.png',   // eVgo Network
            'SemaC'      : 'logo-sema.png'    // SemaCharge Network
            // Electric Vehicle
            // RechargeAccess
        };

        return function (brand) {
            var logoString = 'logo-charge.jpg';
            brand = (typeof brand != 'string') ? '' : brand;

            for (var search in brandSearch) {
                if (~brand.indexOf(search)) {
                    logoString = brandSearch[search];
                    break;
                }
            }

            return logoString;
        };
    })();

    $(document).ready(function () {
        //The domLocker here is a place to store the original elements that will be cloned for map functionality.
        domLocker = $("#map-objects-storage").remove();
        $("input:checkbox[name='brandchoice']").prop('checked', true);
        var $input = $("#csZipcodeCityId");
        $input.val('');

        $('#rightRedBoxId').on('click', function () {
            if ($.trim($input.val())) {
                retrieveChargingStations(0, 0, $input.val());
            }
        });

        $("#hide-arrow").on('click', function () {
            $('#panel-results').hide('slow');
            $('#show-arrow').show('slow');
        });
        $("#show-arrow").on('click', function () {
            $('#panel-results').show();
            $('#hide-arrow').show();
        });

        $('.alert .vehDataWrap').css("visibility", "hidden");

        $("#dismissButton").on('click', hideLoading);

        $("input.csZipcodeCity").on('click', resetSearchControls);

        var $filterDiv = $('#filterId');

        $("input[name='voltchoice']", $filterDiv).parent().on('click', function () {
            $("input[name='voltchoice']", $filterDiv).prop('checked', false).removeAttr("checked");
            $(this).children("input").prop('checked', 'checked').attr('checked', 'checked');
        });

        $("input[name='distancechoice']", $filterDiv).parent().on('click', function () {
            $("input[name='distancechoice']", $filterDiv).prop('checked', false).removeAttr("checked");
            $(this).children("input").prop('checked', 'checked').attr('checked', 'checked');
        });

/*        $("input[name='brandchoice']", $filterDiv).parent().on('click', function () {
            $("input[name='brandchoice']", $filterDiv).prop('checked', false).removeAttr("checked");
            $(this).children("input").prop('checked', 'checked').attr('checked', 'checked');
        });*/
        
        // add multiple select / deselect functionality for brandchoice
        $("#allBrands").click(function () {        	
              $("input:checkbox[name='brandchoice']").prop('checked', this.checked);
        });
     
        // if all checkbox are selected, check the selectall checkbox
        // and viceversa
        $("input[name='brandchoice']").click(function(){
            if($("input[name='brandchoice']").length == $("input[name='brandchoice']:checked").length) {
                $("#allBrands").prop("checked", true);               
            } else {
                $("#allBrands").prop("checked", false);                
            }
        });

        $("#filterBtn").on('click', function () {
            $filterDiv.show('slow');
            $filterDiv.slideDown('slow');
        });

        $('#doneBtn').on('click', function () {
        	if($("input[name='brandchoice']:checked").length == 0)
        		$('#selectBrand').fadeOut(500).fadeIn(500);
        	else {
        		$filterDiv.slideUp('slow');
                $filterDiv.hide('slow');
                $("#selectBrand").hide();
        	}	
        });

        $('#clearBtn').on('click', function () {
            $("input:radio[name=distancechoice]").prop('checked', false).removeAttr('checked').filter(':last').prop('checked', true).attr("checked", "checked");
            //$("input:checkbox[name=brandchoice]").prop('checked', false).removeAttr('checked').filter(':last').prop('checked', true).attr("checked", "checked");
            $("input:checkbox[name='brandchoice']").prop('checked', false); 
            $("input:checkbox[name='allBrands']").prop('checked', false);
            $("input:radio[name=voltchoice]").prop('checked', false).removeAttr('checked').filter(':last').prop('checked', true).attr("checked", "checked");
        });

        $input.keypress(function (event) {
            var ew = event.which;

            if (ew == 13) {
                $('#rightRedBoxId').click();
            }

            if (ew == 8) return true;
            if (ew == 37) return false;
            if (ew == 32 || ew == 188 || ew == 44) return true;
            if (48 <= ew && ew <= 57) return true;
            if (65 <= ew && ew <= 90) return true;
            if (97 <= ew && ew <= 122) return true;

            return false;
        });

        $("#searchNearById").on("click", function () {
            /* This would retrieve the car location but that doesn't seem to work.
             $.ajax({
             url: '/ccw/ev/myCarLocation.do',
             dataType: 'json',
             async: false,
             timeout: 120000,
             success: function(data) {
             var lat = data.coord.lat;
             var lng = data.coord.lon;
             }
             });
             */

            getBrowserLocation().done(function (position) {
                retrieveChargingStations(position.coords.latitude, position.coords.longitude, '');
            }).fail(drawDefaultMap);
        });

        drawDefaultMap();

        getBrowserLocation().done(function (position) {
            retrieveChargingStations(position.coords.latitude, position.coords.longitude, '');
        }).fail(drawDefaultMap);
    });
})();
