window.uvo = window.uvo || {};

window.console = window.console || (function () {
    var c = {};
    c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = $.noop;
    return c;
}());

(function (uvo) {
    var gMaps = (window.google && window.google.maps);

    //This is to make the "success:true" stuff more transparent and give us generalized error management.
    $.ajaxPrefilter(function (options, originalOptions, xhr) {
        var defer = new $.Deferred();

        xhr.done(function (data, status, xhr){
            var args;
            if (data.success === true && data.serviceResponse) {
                args = [data.serviceResponse, data.statuscode, xhr];
                defer.resolve.apply(defer, args);
            } else if (data.success === false) {
            	if (data.statuscode == "900"){
            		data.error = "Unable to connect to vehicle, try again after moving vehicle to another location.";
            	}
                args = [xhr, data.statuscode, data.error || data.errorMessage || "Unspecified server error"];
                defer.reject.apply(defer, args);
            } else {
                //no success param means it's an old style request, leave it be.
                defer.resolve.apply(defer, arguments);
            }
        });

        xhr.fail(function (xhr, status, err){
            //might change this later to make errors more standardized.
            defer.reject.apply(defer, [xhr, 500, err || "Invalid server response."]);
        });

        //this purposely reroutes any attempts to attach callbacks to the jqXHR
        //to instead attach those callbacks to this internal Deferred.
        $.extend(xhr, defer);


        if (originalOptions.success) {
            delete options.success;
            defer.done(originalOptions.success);
        }

        if (originalOptions.error) {
            delete options.error;
            defer.fail(originalOptions.error);
        }

        if (originalOptions.complete) {
            delete options.complete;
            defer.always(originalOptions.complete);
        }

    });

    function hide($jQ) {
        $jQ.addClass("hide");
    }

    function show($jQ) {
        $jQ.removeClass("hide");
    }

    uvo.common = $.extend(uvo.common, {
        $hide : hide,
        $show : show,
        errors : {
            genericError : "Service unavailable."
        },
        sortByField               : function sortByField(arr, field, asc, compareFn) {
            if (compareFn) {
                return arr.sort(function (a, b) {
                    return compareFn(a[field], b[field]) * asc;
                });
            }

            return arr.sort(function (a, b) {
                var sortVal = 0;
                var aVal = a[field];
                var bVal = b[field];
                if (aVal > bVal) {
                    sortVal = 1;
                } else if (bVal > aVal) {
                    sortVal = -1;
                }
                return sortVal * asc;
            });
        },
        formatPhoneNumber         : function formatPhoneNumber(phoneStr) {
            var formatted = "";
            var phoneParts = (phoneStr || "").match(/(1)?(\d{3})(\d{3})(\d{4})/);
            if (phoneParts !== null) {
                phoneParts[2] = "(" + phoneParts[2] + ")";
                if (phoneParts[1] === "1") {
                    formatted = phoneParts[1]+"-"+phoneParts[2]+" "+phoneParts[3]+"-"+phoneParts[4];
                } else {
                    formatted = phoneParts[2]+" "+phoneParts[3]+"-"+phoneParts[4];
                }
            }
            return formatted || phoneStr;
        },
        formatGoogleMapsAddress   : function formatGoogleMapsAddress(addr) {
            var commaPosition = addr.indexOf(",");
            var addrStr = addr.substr(0, commaPosition) + "<br />";
            addrStr += addr.substr(commaPosition).replace(/,|USA|United States/ig, "");

            return addrStr;
        }
    });

    //20 or greater just return digits.
    uvo.common.numberToWords = (function() {

        var words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
                     'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
                     'eighteen', 'nineteen'];

        return function numberToWords(num){
            return (num < 20) ? words[parseInt(num)] : num;
        };
    }());

    uvo.common.degToRad = function degToRad(deg) {
        return deg * 0.0174532925;
    };

    uvo.common.calcDistance = function calcDistance(lat1, lng1, lat2, lng2) {
        var degToRad = uvo.common.degToRad;
        var R = 6371; // km
        var rad1 = degToRad(lat1);
        var rad2 = degToRad(lat2);
        var deltaRad = degToRad(lat2 - lat1);
        var deltaLambda = degToRad(lng2 - lng1);

        var a = Math.sin(deltaRad / 2) * Math.sin(deltaRad / 2);
        a += Math.cos(rad1) * Math.cos(rad2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = R * c;

        return d;
    };

    uvo.common.leadZeroes = function leadZeroes(num, count) {
        var str = num.toString();
        return Math.pow(10, count - str.length).toString().slice(1) + str;
    };

    uvo.common.strFill = function strFill(char, len) {
        return Math.pow(10, len).toString().slice(1).replace(/0/g, char);
    };

    uvo.common.arrayFill = function arrayFill(obj, len) {
        return Math.pow(10, len).toString().slice(1).split("").map(function () {
            return obj;
        });
    };

    uvo.common.getBrowserLocation = function getBrowserLocation() {
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
    };

    uvo.common = $.extend(uvo.common,  {
        MapOptions                : function (props) {
            gMaps = gMaps || window.google && window.google.maps;
            if (!gMaps) {
                throw new Error("Unable to initialize MapSettings constructor, Google Maps JS API missing.");
            }

            function MapSettings(nonDefaultProps) {
                $.extend(this, nonDefaultProps);
                return this;
            }

            MapSettings.prototype = {
                zoom : 12,

                mapTypeControl        : false,
                mapTypeControlOptions : { style : gMaps.MapTypeControlStyle.DROPDOWN_MENU },

                panControl        : true,
                panControlOptions : {
                    position : gMaps.ControlPosition.TOP_RIGHT
                },

                zoomControl        : true,
                zoomControlOptions : {
                    style    : gMaps.ZoomControlStyle.DEFAULT,
                    position : gMaps.ControlPosition.TOP_RIGHT
                },

                streetViewControl : false,
                //center            : new google.maps.LatLng(lat, lng),
                mapTypeId         : gMaps.MapTypeId.ROADMAP
            };

            uvo.common.MapOptions = MapSettings;

            return new MapSettings(props);
        },
        makeGeocodeRequest        : function (search) {
            var geocoder = new gMaps.Geocoder();

            function makeGeocodeRequest(search) {
                var deferred = new $.Deferred();
                geocoder.geocode({'address' : search}, function (results, status) {
                    if (status === gMaps.GeocoderStatus.OK) {
                        deferred.resolve(results);
                    } else {
                        deferred.reject(status);
                    }
                });
                return deferred;
            }

            uvo.common.makeGeocodeRequest = makeGeocodeRequest;

            return makeGeocodeRequest(search);
        },
        makeReverseGeocodeRequest : function (lat, lng) {
            var geocoder = new gMaps.Geocoder();

            function makeReverseGeocodeRequest(lat, lng) {
                var latlng = new gMaps.LatLng(lat, lng);
                var deferred = new $.Deferred();
                geocoder.geocode({'location' : latlng}, function (results, status) {
                    if (status === gMaps.GeocoderStatus.OK) {
                        deferred.resolve(results);
                    } else {
                        deferred.reject(status);
                    }
                });
                return deferred;
            }

            uvo.common.makeReverseGeocodeRequest = makeReverseGeocodeRequest;

            return makeReverseGeocodeRequest(lat, lng);
        }
    });

    //Generic Modal object for dealing with modal dialogs (not including error and loading message popups.
    //Not sure if this is worth using yet
    (function () {
        function Modal(selector) {
            this.$dom = $(selector);
            $(".close", this.$dom).off('click.modal').on('click.modal', this.close.bind(this));
        }

        Modal.prototype = {
            open  : function () {
                $("body").addClass('modal-enabled');
                this.$dom.addClass("enabled").removeClass("disabled");

            },
            close : function () {
                $("body").removeClass('modal-enabled');
                this.$dom.removeClass("enabled").addClass("disabled");
            }
        };

        uvo.common.Modal = Modal;
    }());



}(window.uvo));