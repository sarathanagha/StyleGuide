window.console = window.console || (function(){
    var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
    return c;
})();    

function closeout() {
    $('#uiBlock').remove();
};

// Get browser navigator coordinate as a backup first
lat = 36.1314; 
lng = -95.9372;

var mapOptions = {
        zoom: 4,

        mapTypeControl: false,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},

        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        
        zoomControl: true,
        zoomControlOptions: {
            style:google.maps.ZoomControlStyle.DEFAULT,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        
        streetViewControl: false,
        center: new google.maps.LatLng( lat, lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
};   
csmap = new google.maps.Map( $("#map-canvas").get(0), mapOptions);

$('body').append("<div id='uiBlock'><div style='position:fixed; z-index:9998; top:0px; left:0px; width:100%; height:100%; background-color:grey; opacity:0.5 '></div>" +
        "<div style='border:1px grey solid; width:500px; height:100px; padding:20px;  background-color:white; margin: auto; position: fixed ;z-index:9999; top: 0; left: 0; bottom: 0; right: 0;'>" +
        "<img src='../img/kia-loading.gif' alt='' style='float:left; margin-right:20px;'><div id='errorMessage' style='position:relative; top:40px;'>"+ " Locating your vehicle..."+"</div></div>");

//if(navigator.geolocation){
    //navigator.geolocation.getCurrentPosition(function success(position){
        
        // Get browser navigator coordinatge as a backup first
        
    	/*
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        console.log('position1',lat);
        console.log('position2',lng);
        var mapOptions = {
                zoom: 12,

                mapTypeControl: false,
                mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},

                panControl: true,
                panControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
        
                zoomControl: true,
                zoomControlOptions: {
                    style:google.maps.ZoomControlStyle.DEFAULT,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                
                streetViewControl: false,
                center: new google.maps.LatLng( lat, lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        csmap = new google.maps.Map( $("#map-canvas").get(0), mapOptions);
		*/ 
    	
        $.ajax({
            cache: false,
            type: 'get',
            dataType: 'json',
            url: '/ccw/ev/myCarLocation.do' 
        }).success(function(data){
            if(data.success == false){
            	$('#uiBlock').html("<div style='position:fixed; z-index:9998; top:0px; left:0px; width:100%; height:100%; background-color:grey; opacity:0.5 '></div>" +
                        "<div style='border:1px grey solid; width:500px; height:100px; padding:20px;  background-color:white; margin: auto; position: fixed ;z-index:9999; top: 0; left: 0; bottom: 0; right: 0;'>" +
                        "<img src='../img/kia-loading.gif' alt='' style='float:left; margin-right:20px;'><div id='errorMessage' style='position:relative; top:10px;'>"+ 
                        "<a href='#' id='dismissButtonId' style='display:block; color:blue;' onclick='closeout();'>Dismiss</a>" + data.error + "</div>");
                
                $("#findxmycar").text("Service is temporarily unavailable.");
            }
            else{
            	lat = data.coord.lat;
            	lng = data.coord.lon;
            	
            	var panoramaOptions = {
                        addressControlOptions : { position : google.maps.ControlPosition.BOTTOM_LEFT },
                        zoomControlOptions : { position : google.maps.ControlPosition.BOTTOM_LEFT},
                        panControlOptions : { position : google.maps.ControlPosition.BOTTOM_LEFT},
                        enableCloseButton : true,
                        visible: false //set to false so streetview is not triggered on the initial map load
                    };
                var panorama = new  google.maps.StreetViewPanorama($("#map-canvas").get(0), panoramaOptions);
            	
        var mapOptions = {
                zoom: 12,

                mapTypeControl: false,
                mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},

                panControl: true,
                panControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                
                zoomControl: true,
                zoomControlOptions: {
                    style:google.maps.ZoomControlStyle.DEFAULT,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                
                        streetViewControl: true,
                        streetView: panorama,

                center: new google.maps.LatLng( lat, lng),
                mapTypeId: google.maps.MapTypeId.ROADMAP
                };
        csmap = new google.maps.Map( $("#map-canvas").get(0), mapOptions);
      
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    map: this.map,
                    icon: '/images/find/car-pin.png'
	             });
	             marker.setMap(csmap);
            	
	            var endAddr = (lat + "," + lng);
                var startAddr;
                
                if(navigator.geolocation){
                	navigator.geolocation.getCurrentPosition(function success(position){
                		startAddr = (position.coords.latitude + "," + position.coords.longitude);
                		$(".boxGetDirection a").attr("href", 'https://maps.google.com/maps?f=d&saddr=' + startAddr + '&daddr=' + endAddr + '&dirflg=h');
                	});
                } else {
                	startAddr = "";
                	$(".boxGetDirection a").attr("href", 'https://maps.google.com/maps?f=d&saddr=' + startAddr + '&daddr=' + endAddr + '&dirflg=h');
                }
            	
            	$('#findxmycar').html(data.address);
            	$('#getDirection').show();
                $("#uiBlock").remove();
            }
        }).fail(function(){
        $('#uiBlock').remove(); 
        
        message ='<a href="#" id="dismissButtonIdId" style="display:block; color:blue;">Dismiss></a>'; 
        $('body').append("<div id='uiBlock'><div style='position:fixed; z-index:9998; top:0px; left:0px; width:100%; height:100%; background-color:grey; opacity:0.5 '></div>" +
                "<div style='border:1px grey solid; width:500px; height:100px; padding:20px;  background-color:white; margin: auto; position: fixed ;z-index:9999; top: 0; left: 0; bottom: 0; right: 0;'>" +
                "<img src='../img/kia-loading.gif' alt='' style='float:left; margin-right:20px;'><div id='errorMessage' style='position:relative; top:40px;'>"+ 
                "<a href='#' id='dismissButtonId' style='display:block; color:blue;' onclick='closeout();'>Dismiss></a>" +
                " Locating your vehicle... "+  
        "</div></div>");
        }),{
        	maximumAge:60000, 
            timeout:5000, 
            enableHighAccuracy:true
        };
        
    //},
    /*function error(error){
        
        $('#uiBlock').remove(); 
        
        message ='<a href="#" id="dismissButtonIdId" style="display:block; color:blue;">Dismiss></a>'; 
        $('body').append("<div id='uiBlock'><div style='position:fixed; z-index:9998; top:0px; left:0px; width:100%; height:100%; background-color:grey; opacity:0.5 '></div>" +
                "<div style='border:1px grey solid; width:500px; height:100px; padding:20px;  background-color:white; margin: auto; position: fixed ;z-index:9999; top: 0; left: 0; bottom: 0; right: 0;'>" +
                "<img src='../img/kia-loading.gif' alt='' style='float:left; margin-right:20px;'><div id='errorMessage' style='position:relative; top:40px;'>"+ 
                "<a href='#' id='dismissButtonId' style='display:block; color:blue;' onclick='closeout();'>Dismiss></a>" +
                " Locating your vehicle... "+  
        "</div></div>");*/
        
        //alert('Google Geo Service is temporarily down.  Please try again.');
       // Position acquisition timed out
       // permission denied = 1
        
      // default to Irvine 
      // lat = '33.714403';
      // lng = '-117.783110';
    /*}, {
        maximumAge:60000, 
        timeout:5000, 
        enableHighAccuracy:true
    });*/
    
  // }; // end of geolocator
   
/*  
var FindMyCarModel = Backbone.Model.extend({
    urlRoot: '/ccw/ev/myCarLocation.do'
});
  
    var FindMyCarView = Backbone.View.extend({
        tagName: 'div',
        className: 'findmycarContainer',
        template: _.template( $('#locxTemplate').html(), null, tempSettings ),
        
        initialize: function() {
          
          this.model.on('change', this.render, this);
         
        },

        render: function(){
            
            //alert('address:  ' + this.model.get("address"));
     
           
            this.$el.html(this.template( this.model.toJSON() ));
    
            return this;
        }
    });
    
    var InitFindMyCarMapView = Backbone.View.extend({
        
        template: _.template( $('#mapTemplate').html(), null, tempSettings ),
        
        initialize: function() {
          
          this.model.on('change', this.render, this);
            
          //alert('find my car view');
          //alert('lat:  ' + this.model.get("coord").lat);
          //alert('lon:  ' + this.model.get("coord").lon);
      
        },

        render: function(){
            
            //alert('find my car view - render');
            //alert('lat:  ' + this.model.get("coord").lat);
            //alert('lon:  ' + this.model.get("coord").lon);
            
            this.$el.html(this.template(this));
            //this.$el.html(this.template( this.model.toJSON() ));
            
            var mapOptions = {
                        zoom: 12,
       
                        mapTypeControl: false,
                        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    
                        zoomControl: true,
                        zoomControlOptions: {
                            style:google.maps.ZoomControlStyle.DEFAULT,
                            position: google.maps.ControlPosition.TOP_RIGHT
                        },
                        
                        streetViewControl: false,
                        panControl: true,
                        panControlOptions: {
                            position: google.maps.ControlPosition.TOP_RIGHT
                        },
                       
                        center: new google.maps.LatLng(this.model.get("lat"), this.model.get("lon")),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                  };   
            this.map = new google.maps.Map( $("#map-canvas").get(0), mapOptions);
            
            var marker = new google.maps.Marker({
                   position: new google.maps.LatLng(this.model.get("coord").lat, this.model.get("coord").lon),
                   map: this.map,
                   icon: '/images/find/car-pin.png'
            });
            marker.setMap(this.map);
            
            return this;
        }
    });
    
    var FindMyCarMapView = Backbone.View.extend({
   
        template: _.template( $('#mapTemplate').html(), null, tempSettings ),
        
        initialize: function() {
            this.model.on('change', this.render, this);
        },

        render: function(){
            
            this.$el.html(this.template(this));
                        
            var panoramaOptions = {
                    addressControlOptions : { position : google.maps.ControlPosition.BOTTOM_LEFT },
                    zoomControlOptions : { position : google.maps.ControlPosition.BOTTOM_LEFT},
                    panControlOptions : { position : google.maps.ControlPosition.BOTTOM_LEFT},
                    enableCloseButton : true,
                    visible: false //set to false so streetview is not triggered on the initial map load
                };
            var panorama = new  google.maps.StreetViewPanorama($("#map-canvas").get(0), panoramaOptions);
            var mapOptions = {
                    zoom: 12,
   
                    mapTypeControl: false,
                    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},

                    zoomControl: true,
                    zoomControlOptions: {
                        style:google.maps.ZoomControlStyle.DEFAULT,
                        position: google.maps.ControlPosition.TOP_RIGHT
                    },
                    
                    streetViewControl: true,
                    streetView: panorama,
                    
                    panControl: true,
                    panControlOptions: {
                        position: google.maps.ControlPosition.TOP_RIGHT
                    },
                   
                    center: new google.maps.LatLng(this.model.get("coord").lat || lat, this.model.get("coord").lon || lng),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.map = new google.maps.Map( $("#map-canvas").get(0), mapOptions);
            
            if(this.model.get("coord").lat !== 0) {
                var marker = new google.maps.Marker({
                       position: new google.maps.LatLng(this.model.get("coord").lat, this.model.get("coord").lon),
                       map: this.map,
                       icon: '/images/find/car-pin.png'
                });
                marker.setMap(this.map);
            }
            
            return this;
        }
    });

    // instantiate Find Car Model
    var vhlmodel = new FindMyCarModel();
    
    var req = vhlmodel.fetch();
    var vhlview = new FindMyCarMapView({model: vhlmodel});
    
    
    var Maps = google.maps;
    var Geocoder = new Maps.Geocoder();
    

    function makeReverseGeocodeRequest(lat, lng) {
        var deferred = new $.Deferred();
        Geocoder.geocode({'location' : new Maps.LatLng(lat, lng)}, function (results, status) {
            if (status == Maps.GeocoderStatus.OK) {
                deferred.resolve(results);
            } else {
                deferred.reject(status);
            }
        });
        return deferred;
    }
    
    req.success(function () {  
//console.log('vhlmodel', vhlmodel);
        if (vhlmodel.has("coord") && vhlmodel.get("coord").lat !== 0) {
            var latEnd = vhlmodel.get("coord").lat;
            var lngEnd = vhlmodel.get("coord").lon;
            makeReverseGeocodeRequest(latEnd, lngEnd).done(function(results){
                var addrStr = results[0].formatted_address;
                vhlmodel.set({ "address" : addrStr  || "No street address available for this location."});
                var mapsUrl = "https://maps.google.com/maps?f=d&dirflg=h&daddr=";
                
                if(!addrStr){
                    mapsUrl += latEnd + "," + lngEnd;
                } else {
                    mapsUrl += addrStr;
                }
                
                if(navigator.geolocation){
                    
                    navigator.geolocation.getCurrentPosition(  function success(position){
                        
                        // Get browser navigator coordinatge as a backup first
                        var latstart = position.coords.latitude;
                        var lngstart = position.coords.longitude;
    
                        var latlngstart = latstart+','+lngstart;
    
                        mapsUrl += "&saddr=" + latlngstart;
                        vhlmodel.set({ "mapsUrl" : mapsUrl });
                        var locview = new FindMyCarView({model: vhlmodel});
                        $('#findxmycar').html(locview.render().el);
                        $("#uiBlock").remove();
                    });
                    vhlmodel.set({"mapsUrl": mapsUrl});
                    var locview = new FindMyCarView({model: vhlmodel});
                    $('#findxmycar').html(locview.render().el);
                    $("#uiBlock").remove();
                } else {
                    vhlmodel.set({"mapsUrl": mapsUrl});
                    var locview = new FindMyCarView({model: vhlmodel});
                    $('#findxmycar').html(locview.render().el);
                    $("#uiBlock").remove();
                }
            });
        } else {
            $('#uiBlock').html("<div style='position:fixed; z-index:9998; top:0px; left:0px; width:100%; height:100%; background-color:grey; opacity:0.5 '></div>" +
                    "<div style='border:1px grey solid; width:500px; height:100px; padding:20px;  background-color:white; margin: auto; position: fixed ;z-index:9999; top: 0; left: 0; bottom: 0; right: 0;'>" +
                    "<img src='../img/kia-loading.gif' alt='' style='float:left; margin-right:20px;'><div id='errorMessage' style='position:relative; top:40px;'>"+ 
                    "<a href='#' id='dismissButtonId' style='display:block; color:blue;' onclick='closeout();'>Dismiss></a>" +
                    "Unable to locate your vehicle. "+
            "</div>");
            
            $("#findxmycar").text("Service is temporarily unavailable.");
        }
        
    });
*/
    $(document).ready( function() {
        $('.alert, .vehDataWrap').css("visibility","hidden");
    });
   
