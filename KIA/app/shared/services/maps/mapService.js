'use strict';

module.exports = /*@ngInject*/ function(uiGmapGoogleMapApi, $q) {

	var _gMapPromise; // google map promise
	var _gMap; // actuall gmap instance
	
	// get Default Center
	function getDefaultCenter() {
		return { latitude: 40.1451, longitude: -99.6680 };
	}

	// gMap getter/setter 
	function getGMap() { 
		if (!_gMapPromise) {
			_gMapPromise = $q.defer();
			uiGmapGoogleMapApi.then(function(map) {
				_gMapPromise.resolve(map);
				_gMap = map;
			});
		}
		return _gMapPromise.promise;
	}

	function setGMap(gMap) { _gMap = gMap;}

	// default map options
	// add markerEvents and events (map events) in controller
	function createMapOptions() {	

		var MapOptions = function() {
			return {				
				// marker options
				marker:{},
				markers:[],
				markerControl:{},
				// window options
				window:{
					control:{},
					marker:{},
					show:false,
					closeClick: function() { this.show = false; },
					options: {}
				},
				// map options
				control:{},
			    center: getDefaultCenter(),
			    zoom: 4,
			    options: {
			    	mapTypeControl: false,
			    	maxZoom: 17,
			    	minZoom: 3,
			    	panControl : true,
			    	zoomControl: true,
			    	streetViewControl: false,
	                panControlOptions: {
	                    position : _gMap.ControlPosition.TOP_RIGHT
	                },
			    	zoomControlOptions: {
			    		position: _gMap.ControlPosition.TOP_RIGHT
			    	}
			    }
			};	
		};
		return new MapOptions();
	}

	function createInfoBoxOptions(index, isMobile, options) {
		var InfoBoxOptions = function() {
			var opts = {
				control: {},		
				boxClass: 'infobox-dark ' + ((isMobile) ? 'm-ib' : 'ib') + index,
				alignBottom: true,
				pixelOffset: new _gMap.Size(-114,-34),
				closeBoxURL: 'images/kh/img/my-pois/close-popup.png'
			};

			if (options) {
				for (var prop in options) {
					if (options.hasOwnProperty(prop)) {
						opts[prop] = options[prop];
					}
				}
			}
			return opts;
		};
		return new InfoBoxOptions();
	}


		function createInfoBoxOptionsMCZ(index, isMobile, options) {
		var InfoBoxOptions = function() {
			var opts = {
				control: {},		
				boxClass: 'infobox-dark ' + ((isMobile) ? 'm-ib' : 'ib') + index,
				alignBottom: true,
				pixelOffset: new _gMap.Size(15,25),
				closeBoxURL: 'images/kh/img/my-pois/close-popup.png'
			};

			if (options) {
				for (var prop in options) {
					if (options.hasOwnProperty(prop)) {
						opts[prop] = options[prop];
					}
				}
			}
			return opts;
		};
		return new InfoBoxOptions();
	}


	function createChargeStationInfoBoxOptions(index, isMobile, options) {
		var box_style;
		if(isMobile) box_style = {width:'280px'};
		else box_style = {width:'350px'};

		var InfoBoxOptions = function() {
			var opts = {
				control: {},		
				/*boxClass: 'infobox-dark-big ' + ((isMobile) ? 'm-ib' : 'ib') + index,*/
				boxClass: 'infobox-dark-big',
				alignBottom: true,
				pixelOffset: (isMobile)? new _gMap.Size(-140,-45): new _gMap.Size(-175,-45),
				boxStyle: box_style, 
				closeBoxURL: 'images/kh/img/my-pois/close-popup.png'
			};

			if (options) {
				for (var prop in options) {
					if (options.hasOwnProperty(prop)) {
						opts[prop] = options[prop];
					}
				}
			}
			return opts;
		};
		return new InfoBoxOptions();
	}

	function createMarker(id,lat,lng,idKey,label) {
		//console.log("service",label);
		var MarkerOptions = function() {
			var options = {};
			var idkey = (idKey) ? idKey : 'id';
			options[idkey] = id;
			options['latitude'] = lat;
			options['longitude'] = lng;
			if(label){
				 options['label'] = label;
			}
        
			return options;
		};

		return new MarkerOptions();
	}

	// Text Search would return a string of the entire address
	// This function will break down the string into street, state, city, zip
	function getAddressComponents(formattedAddress) {

		var Address = function() {
			return { 
				street:'',
				city:'',
				state:'',
				zip:''
			};
		};

		var addr = new Address();

		var addrSplit = formattedAddress ? formattedAddress.split(',') : ['','',''];
        if(addrSplit.length === 4){
            addr.street = $.trim(addrSplit[0]);
            addr.city = $.trim(addrSplit[1]);
            addr.state = $.trim(addrSplit[2]);
            }
            else if (addrSplit.length === 3){
            	addr.city = $.trim(addrSplit[0]);
            	addr.state  = $.trim(addrSplit[1]);
            }
           
        if (addr.state){
        	var zipSplit = addr.state.split(' ');
        	if (zipSplit.length === 2) {
            	addr.state = zipSplit[0];
            	addr.zip = zipSplit[1];
        	}
        }

        return addr;
	}

	function getPlaceDetail(placeId, map) {
		var deferred = $q.defer();
		var svc = new _gMap.places.PlacesService(map);
		var request = { placeId:placeId };
		svc.getDetails(request, function(place, status) {
	    	if (status === _gMap.places.PlacesServiceStatus.OK) {	    		    	
	    		var retObj = {
	    			name  : place['name'],
	    			phone : place['formatted_phone_number'],
	    			location : place['geometry']['location']
	    		};
	    		retObj = angular.extend(retObj,getAddressComponents(place['formatted_address']));
	    		deferred.resolve(retObj);
	     	}
    	});	
    	return deferred.promise;
	}

	function makeReverseGeocodeRequest(lat, lng) {
		 var geocoder = new _gMap.Geocoder();
		 var latlng = new _gMap.LatLng(lat,lng);
		 var deferred = $q.defer();

		 geocoder.geocode({'location' : latlng}, function (results, status) {
            if (status === _gMap.GeocoderStatus.OK) {
                deferred.resolve(results);
            } else {
                deferred.reject(status);
            }
         });

         return deferred.promise;            
	}

	return {
		getPlaceDetail : getPlaceDetail,
		getDefaultCenter : getDefaultCenter,
		getGMap : getGMap,
		setGMap : setGMap,
		createMapOptions : createMapOptions,
		createMarker: createMarker,
		createInfoBoxOptions : createInfoBoxOptions,
		createInfoBoxOptionsMCZ :createInfoBoxOptionsMCZ,
		createChargeStationInfoBoxOptions : createChargeStationInfoBoxOptions,
		getAddressComponents: getAddressComponents,
		makeReverseGeocodeRequest : makeReverseGeocodeRequest
	};
};