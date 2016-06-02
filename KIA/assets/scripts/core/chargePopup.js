    var chargePopup = new function() {
        var popMap;
        var popPlaces;
        var popInfoWindow;
        var popStations = [];
        var stationList = [];
            
        this.initialize = function(mapContainer) {
            popMap = new google.maps.Map(mapContainer, {
                mapTypeControl: false,
                mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DEFAULT},
                navigationControl: true,
                streetViewControl: false,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            popPlaces = new google.maps.places.PlacesService(popMap);
            popInfoWindow = new google.maps.InfoWindow();
        };
        
        this.setChargingStations = function(items) {
            //clear previous items
            for (var i in popStations) popStations[i].marker.setMap(null);
            popStations = [];
            popInfoWindow.close();
            
            //create new items
            if (!items || !items.length) return;
            for (var i in items) {
                
                // TODO: check chnum, chtype for 240v vs 120V ports
                var iconImg = '/ccw/images/psev/marker_charge_240v.png';
                if ( i == 1 || i == 5 ){
                
                    iconImg = '/ccw/images/psev/marker_charge_120v.png';
                }
                
                //create map marker
                var marker = new google.maps.Marker({
                    map: popMap,
                   // icon:  new google.maps.MarkerImage("../../images/psev/marker_charge_240v.png", new google.maps.Size(20, 34), new google.maps.Point(0, 34*(i%mPageSize))),
                    icon:   { url: iconImg, size: new google.maps.Size(20, 34)},
                    position: new google.maps.LatLng(items[i].lat, items[i].lon),
                    address: items[i].address + "  " + items[i].city + ", " + items[i].state,
                    phone: items[i].phone,
                    title: items[i].name
                });
           
                marker.setVisible(true);
                marker.setMap(popMap);
             
                
                addMarkerClickListener2(marker, i);
                
                popStations.push({
                    data: items[i],
                    marker: marker
                });
            }
        };
         
        this.zoomToFavorites = function() {
            var bounds = new google.maps.LatLngBounds();
            for (var i in popStations) if (popStations[i].data.isFavorite) bounds.extend(new google.maps.LatLng(popStations[i].data.lat, popStations[i].data.lng));

                if(navigator.geolocation) {
                  browserSupportFlag = true;
                  navigator.geolocation.getCurrentPosition(function(position) {
                    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    popMap.setZoom(14);
                    popMap.setCenter(initialLocation);
                   
                  }, function() {
                    handleNoGeolocation(browserSupportFlag);
                  });
                }
                // no geolocation
                else {
                  browserSupportFlag = false;
                  handleNoGeolocation(browserSupportFlag);
                }
                
                function handleNoGeolocation(errorFlag) {
                  if (errorFlag == true) {
                    alert("geo-location not available");
                    initialLocation = newyork;
                  } else {
                    alert("no geo-location feature ");
                    initialLocation = newyork;
                  }
                  popMap.setCenter(initialLocation);
                }
                
             popMap.fitBounds(bounds);
        };
        
        this.chosenChargingStation = function(index) {
            
            var reformattedAddr = popStations[index].data.address + " <br> " + popStations[index].data.city + ", " + popStations[index].data.state;
            
            var chargingStationData = popStations[index].data;
            var infoWindowContent =  "<p id= 'hook'>" +
                                     "<b>" + popStations[index].data.name+ "</b><br/>" +
                                     "<a href='javascript:chargePopup.editChargingStation(" + index + ")'>Add this location</a><br/>" +
                                     "<b>" + reformattedAddr + "</b><br/>" +
                                     "</p>";
            
            if ( index == 1 || index == 5 ){
                var infoWindowContent =  "<p id= 'hook'>" +
                "<b>" + popStations[index].data.name+ "</b><br/>" +
                "<a href='javascript:chargePopup.editChargingStation(" + index + ")'>Add this location</a><br/>" +
                "<b>" + reformattedAddr + "</b><br/>" +
                "<b>" + "240V available     " + "</b>" +
                "<b>" + "Quick Charge unavailable" + "</b><br/>" +
                "</p>";
               
            } else{
           
                var infoWindowContent =  "<p id= 'hook'>" +
                "<b>" + popStations[index].data.name+ "</b><br/>" +
                "<a href='javascript:chargePopup.editChargingStation(" + index + ")'>Add this location</a><br/>" +
                "<b>" + reformattedAddr + "</b><br/>" +
                "<b>" + "120V available     " + "</b>" +
                "<b>" + "Quick Charge unavailable" + "</b><br/>" +
                "</p>";
            }

            popInfoWindow.setContent(infoWindowContent);
                        
           popInfoWindow.setPosition(popStations[index].marker.getPosition());
           popInfoWindow.open(popMap);       
        }
        
        this.searchChargingStations = function() {
            $(".resultList  .chargeStationResult ul").empty();
            $('#textLimit').css("visibility","hidden");
          
            // var evAPI = "http://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=a9f3d25dc81f63e31028c5aaaa0aee275116e9e2&location=irvine&ev_network=all&fuel_type=ELEC";
            var evAPI = "/ccw/ev/evStationsSearchByAjax.do";
            
            $.ajax(
                    {
                        url: evAPI,
                        dataType: "json",
                        async: false,
                        cache: false,
                        error :  function (event, jqXHR, ajaxSettings, thrownError) {
                            alert('[event:' + event + '], [jqXHR:' + jqXHR + '], [ajaxSettings:' + ajaxSettings + '], [thrownError:' + thrownError + '])');
                        },
                        success: function(data)
                        {
                           // $.each(data.fuel_stations, function(i, item) {
                           // });
                            
                           var resultList = $("#addChargingStationPopup .resultList ul").empty();
                           chargePopup.setChargingStations(data);
                           
                           var bounds = new google.maps.LatLngBounds();
                           for (var i in popStations){ 
                                      
                               bounds.extend( new google.maps.LatLng(popStations[i].data.lat, popStations[i].data.lon));
                               
                               var reformattedAddr = popStations[i].data.address;
                               
                               if ( i == 1 || i == 5 ){
                                   
                                   var listItem = $("<li  class='iconev120'  style='width:220px; height:20px'></li>").toggle(false).appendTo(resultList);
                                   // $("<span class='iconev' > ").appendTo(listItem);
                                   $("<div></div>").addClass("pointTit").html("<a href='javascript:chargePopup.chosenChargingStation(" + i + ");'>" + popStations[i].data.name + "</a>").appendTo(listItem);
                                   $("<div></div>").addClass("pointAddr").html(reformattedAddr + "</span>").appendTo(listItem);
                              
                               } else{
                                   
                                   var listItem =  $("<li  class='iconev'  style='width:220px; height:20px'></li>").toggle(false).appendTo(resultList);
                                   // $("<span class='iconev' > ").appendTo(listItem);
                                   $("<div></div>").addClass("pointTit").html("<a href='javascript:chargePopup.chosenChargingStation(" + i + ");'>" + popStations[i].data.name + "</a>").appendTo(listItem);
                                   $("<div></div>").addClass("pointAddr").html(reformattedAddr + "</span>").appendTo(listItem);
                                 
                               }
                              
                             //  popStations[i].marker.setMap(popMap);
                             //  popStations[i].marker.setVisible(true);
                               
                               listItem.toggle(true);
                           }
                           
                               
                             //  popMap.setCenter();
                               popMap.setZoom(12);
                               
                               popMap.fitBounds(bounds);
                               
                               //popMap.fitBounds(bounds);
                               scrollPopupMap();
                         
                    
                               $(".point_searchResult").toggle(true);
                           
                            
                        }
                    });
        };
            
        this.searchChargingStationsREST = function() {
           
         var evAPI = "http://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=a9f3d25dc81f63e31028c5aaaa0aee275116e9e2&location=irvine&ev_network=all&fuel_type=ELEC";
      
         $.ajax(
                 {
                     url: evAPI,
                     dataType: "json",
                     async: false,
                     success: function(data)
                     {
                         $.each(data.fuel_stations, function(i, item) {
                         
                                 alert(i);
                                 alert(item.name);
                                 alert(item.phone);
                         });
                     }
                 });
     
       };
            
        this.openSearch = function() {
            alert('mapBounds: ' + "popup opens...");
            
            mEditMode = false;
            mDirty = false;
          //  document.forms.poiSearch.searchPoi.value='';
            
            $("#addChargingStationPopup").toggle(true);
            
            $("#addChargingStationPopup .popH1").text("Add a new Charging Station");
            $("#addChargingStationPopup .popSearch_interest").toggle(true);
            
            //$("#addChargingStationPopup .addChargingStationForm .butBack").toggle(true);
            //$("#addChargingStationPopup .confirmChargingStationForm .butBack").toggle(true);
            //$("#addChargingStationPopup .confirmChargingStationForm .confirmation").text("has been added to your Points of Interest");
          
            //$("#addChargingStationPopup .confirmChargingStationForm").toggle(false);
            
            $("#addChargingStationPopup .chargingStationSearchResult").toggle(true);
            $("#addChargingStationPopup .addCharingStationForm").toggle(false);
            
           
         
                
                chargePopup.initialize($(".mapArea2").get(0));
                chargePopup.zoomToFavorites();
         
        };
        
        this.close = function() {
            $("#addChargingStationPopup").toggle(false);
            
            alert("closing ... popup window");
          //  if (mCloseListener) mCloseListener(mDirty);
        };
        
        
        
        function getMarkerIcon2(size) {
            var url = "<c:url value='/images/ev/marker_green.png'/>"; //isFavorite ? "<c:url value='/images/ev/marker_blue.png'/>" : "<c:url value='/images/ev/marker_gray.png'/>";
           // var url = "<c:url value='/images/ev/greenCharge.png'/>"; 
            if (size == "large_size") return new google.maps.MarkerImage(url, null, null, null, new google.maps.Size(60, 40));
            alert("getMarkerIcon2: " + url);
            return url;
        }
        
        function addMarkerClickListener2(marker, index) {
            google.maps.event.addListener(marker, "click", function() {
               // selectChargingStation(index, false);
               alert("calling chosenChargingStation(index): " + index);
               chargePopup.chosenChargingStation(index);
            });
        }
        
        function scrollPopupMap(){
            $("#addChargingStationPopup").animate({scrollTop: $("#popWrap").offset().top}, 'fast');
        }
        
        function selectChargingStation(index, zoomIn) {
            alert("select charging station index: " + index);
            
            var chargingStationData = popStations[index].data;
            var displayedAddress;
            var openEdit = "<br/><a href='javascript:fn_editChargingStation(" + index + ")'><b>Edit</b></a>";
        //    if (charingStationData.street) displayedAddress = poiData.street + prependCond(formatAddress("", poiData.city, poiData.state, poiData.zip), "<br/>");
        //    else
            displayedAddress = popStations[index].data.address;
            
            popMap.setCenter(popStations[index].marker.getPosition());
            if (zoomIn) popMap.setZoom(14);
            popInfoWindow.setPosition(popStations[index].marker.getPosition());
            popInfoWindow.setContent("<b>" + charingStationData.name + "</b>" + prependCond(displayedAddress, "<br/>") + openEdit);
            popInfoWindow.open(popMap); 
        }
        
        
        this.hoverInPoi = function(index) {
            popStations[index].marker.setIcon(getMarkerIcon(popStations[index].data.isFavorite, "large_size"));
            popStations[index].marker.setZIndex(google.maps.Marker.MAX_ZINDEX+1);
        };
        
        this.hoverOutPoi = function(index) {
            popStations[index].marker.setIcon(getMarkerIcon(popStations[index].data.isFavorite, "normal_size"));
            popStations[index].marker.setZIndex(google.maps.Marker.MAX_ZINDEX);
        };
        
        this.updateFavorite = function(index, isFavorite) {
            popStations[index].data.isFavorite = isFavorite;
            popStations[index].marker.setIcon("https://maps.google.com/mapfiles/" + (isFavorite ? "marker.png" : "marker_yellow.png"));
        };
        
        this.selectChargingStation = selectChargingStation;
        
        this.getBounds = function() {
            return popMap.getBounds();
        };
        
        this.editChargingStation = function(index) {
          
            mCurrentChargingStation = popStations[index];
          
            $("#addChargingStationPopup .chargingStationSearchResult").toggle(false);
            $("#addChargingStationPopup .addCharingStationForm").toggle(true);
            
         //   $("#addChargingStationPopup .confirmChargingStationForm").toggle(false);
            
            var chargingStationData = popStations[index].data;
            var reformattedAddr = popStations[index].data.address + " <br> " + popStations[index].data.city + ", " + popStations[index].data.state;
                    
            $("#evName").val(chargingStationData.station_name);
            $("#addChargingStationPopup .addChargingStationForm input[name='phone']").val("");
            $("#evAddr").text( reformattedAddr);
            $("#addChargingStationPopup .addChargingStationForm textarea[name='notes']").val(" ");
       
        };

        
        this.cancelEditChargingStation = function() {
      
            $("#addChargingStationPopup .chargingStationSearchResult").toggle(true);
            $("#addChargingStationPopup .addCharingStationForm").toggle(false);
           
        };
        
    };

 