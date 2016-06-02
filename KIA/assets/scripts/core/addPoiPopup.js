var addPoiPopup = new function()
{
    var mMap;
    var mPlaces;
    var mPois;
    var mInfoWindow;
    var mCurrentPoi;
    var mDirty;
    var mCloseListener;
    var mEditMode;
    var mCurrentPage;
    var mPageSize = 7;
    var pagination = false;

    function initialize() {
        mMap = new google.maps.Map($("#addPoiPopup .mapArea2").get(0), {
            mapTypeControl: false,
            mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
            navigationControl: true,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        mPlaces = new google.maps.places.PlacesService(mMap);
        mPois = [];
        mInfoWindow = new google.maps.InfoWindow();
    }
    
    this.setCloseListener = function(listener) {
        mCloseListener = listener;
    };

    this.openSearch = function(mapBounds) {
        mEditMode = false;
        mDirty = false;
        document.forms.poiSearch.searchPoi.value='';
        $("#addPoiPopup .popH1").text("Add a new Point of Interest");
        $("#addPoiPopup .popSearch_interest").toggle(true);
        $("#addPoiPopup .addPoiForm .butBack").toggle(true);
        $("#addPoiPopup .confirmPoiForm .butBack").toggle(true);
        $("#addPoiPopup .confirmPoiForm .confirmation").text("has been added to your Points of Interest");
        $("#addPoiPopup .poiSearchResult").toggle(true);
        $("#addPoiPopup .addPoiForm").toggle(false);
        $("#addPoiPopup .confirmPoiForm").toggle(false);
        $("#addPoiPopup").toggle(true);
        if (!mMap) {
            initialize();
            mMap.fitBounds(mapBounds);
        }
        setPois(null);
        setCurrentPage(1);
        $("#searchPoi").focus();
    };
    
    this.openEdit = function(poiData) {
        mEditMode = true;
        mDirty = false;
        $("#addPoiPopup .popH1").text("Edit Point of Interest");
        $("#addPoiPopup .popSearch_interest").toggle(false);
        $("#addPoiPopup .addPoiForm .butBack").toggle(false);
        $("#addPoiPopup .confirmPoiForm .butBack").toggle(false);
        $("#addPoiPopup .confirmPoiForm .confirmation").text("has been saved");
        $("#addPoiPopup .poiSearchResult").toggle(false);
        $("#addPoiPopup .addPoiForm").toggle(true);
        $("#addPoiPopup .confirmPoiForm").toggle(false);
        $("#addPoiPopup").toggle(true);
        if (!mMap) {
            initialize();
        }
        mMap.setCenter(new google.maps.LatLng(poiData.lat, poiData.lng));
        mMap.setZoom(12);
        setPois([poiData]);
        setCurrentPage(1);
        this.selectPoi(0);
        this.editPoi(0);
    };

    this.close = function() {
        $("#addPoiPopup").toggle(false);
        if (mCloseListener) mCloseListener(mDirty);
    };
    
    this.doSearch = function() {
        $("#addPoiPopup .poiSearchResult ul").empty();
        //$("#addPoiPopup .poiSearchResult .popPaging").empty();
        $('#textLimit').css("visibility","hidden");
        mPlaces.textSearch({
            query: $("#addPoiPopup .tiQuery").val(),
            bounds: mMap.getBounds()
        },
        function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                setPois(parseResults(results));
                setCurrentPage(1);
                if (results.length <= mPageSize) {
                    if (results[0].geometry.viewport) mMap.fitBounds(results[0].geometry.viewport);
                    else {
                        mMap.setCenter(results[0].geometry.location);
                        mMap.setZoom(12);
                    }
                    pagination = false;
                }
                else if (results.length > mPageSize) {
                    var bounds = new google.maps.LatLngBounds();
                    for (var i in results) bounds.extend(results[i].geometry.location);
                    mMap.fitBounds(bounds);
                    pagination = true;
                }
            }
            else if (status == "ZERO_RESULTS"){addPoiPopup.addAnotherPoi(); $("<li/>").text("No results found. Please alter your search and try again.").appendTo($("#addPoiPopup .poiSearchResult ul").empty());}
            else alertPopup.open("Search failed (" + status + "), please try again later.", "Error");
        });
        $("#addPoiPopup .poiSearchResult").toggle(true);
        $("#addPoiPopup .addPoiForm").toggle(false);
        $("#addPoiPopup .confirmPoiForm").toggle(false);
    };
    
    function parseResults(results) {
        var pois = [];
        for (var i in results) {
            pois.push({
                name: results[i].name,
                address: results[i].formatted_address,
                lat: results[i].geometry.location.lat(),
                lng: results[i].geometry.location.lng(),
                reference: results[i].reference
            });
        }
        return pois;
    }
    
    this.showPrevPage = function() {
        if (mCurrentPage > 1) setCurrentPage(mCurrentPage-1);
    };
    
    this.showNextPage = function() {
        var numPages = Math.ceil(mPois.length / mPageSize);
        if (mCurrentPage < 3 ){
            if (numPages == 3)
                setCurrentPage(mCurrentPage+1);
            else{ //there are two pages
                if (mCurrentPage == 1)
                    setCurrentPage(mCurrentPage+1);
                else
                    setCurrentPage(mCurrentPage);
            }
                
        }
    };

    
    this.showPage = function(page) {
        setCurrentPage(page);
    };
    
    function setCurrentPage(page) {
        if (!mPois) {
            $("#addPoiPopup .popPaging").toggle(false);
        }
        else if (!mPois.length) {
            $("<li></li>").text("No results found, please try again with different keywords").appendTo(resultList);
            $("#addPoiPopup .popPaging").toggle(false);
        }
        else {
            //hide previous items
            if (mCurrentPage) for (var i=0; i<mPageSize; i++) {
                var index = (mCurrentPage-1)*mPageSize+i;
                if (index < mPois.length) {
                    mPois[index].listItem.toggle(false);
                    mPois[index].marker.setVisible(false);
                }
            }
            mInfoWindow.close();
            mCurrentPage = page;
            //show current items
            for (var i=0; i<mPageSize; i++) {
                var index = (mCurrentPage-1)*mPageSize+i;
                if (index < mPois.length) {
                    mPois[index].listItem.toggle(true);
                    mPois[index].marker.setVisible(true);
                }
            }
            //update pagination
            var numPages = Math.ceil(mPois.length / mPageSize);
            if (numPages > 1) {
                $("#addPoiPopup .popPaging").toggle(true);
                $("#addPoiPopup .popPaging .prevPage").toggleClass("recentPage", mCurrentPage <= 1);
                if (numPages == 2)
                    $("#addPoiPopup .popPaging .nextPage").toggleClass("recentPage", mCurrentPage == 2);
                else
                    $("#addPoiPopup .popPaging .nextPage").toggleClass("recentPage", mCurrentPage >= 3);
                for (var i=1; i<=3; i++) $("#addPoiPopup .popPaging .page"+i).toggle(i <= numPages).toggleClass("recentPage", i == mCurrentPage);
            }
            else {
                $("#addPoiPopup .popPaging").toggle(false);
            }
        }
    }
    
    function setPois(items) {
        for (var i in mPois) mPois[i].marker.setMap(null);
        mPois = [];
        mCurrentPage = null;
        var resultList = $("#addPoiPopup .resultList ul").empty();
        mInfoWindow.close();
        
        if (items == null) {
            mPois = null;
            return;
        }
        for (var i in items) {
            //create map marker
            var marker = new google.maps.Marker({
                map: mMap,
                position: new google.maps.LatLng(items[i].lat, items[i].lng),
                title: items[i].name,
                icon: new google.maps.MarkerImage("../../images/poi/marker_gray.png"),
                visible: false
            });
            addMarkerClickListener(marker, i);
            
            //create list item
            var listItem = $("<li></li>").toggle(false).appendTo(resultList);
            $("<span></span>").addClass("icon").css("background-position", "0px " + -34*(i%mPageSize) + "px").appendTo(listItem);
            $("<div></div>").addClass("pointTit").html("<a href='javascript:addPoiPopup.selectPoi(" + i + ")'>" + items[i].name + "</a>").appendTo(listItem);
            $("<div></div>").addClass("pointAddr").html(items[i].address).appendTo(listItem);
            
            mPois.push({
                data: items[i],
                marker: marker,
                listItem: listItem
            });
        }
    }
    
    function addMarkerClickListener(marker, index) {
        google.maps.event.addListener(marker, "click", function() {
            addPoiPopup.selectPoi(index);
        });
    }
    
    this.selectPoi = function(index) {
        if (mPois[index].data.street) selectPoi(index);
        else
        mPlaces.getDetails({
            reference: mPois[index].data.reference
        },
        function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                $.extend(mPois[index].data, {
                    street: getAddrComp(place, "street_number") + " " + getAddrComp(place, "route"),
                    city: getAddrComp(place, "locality"),
                    state: getAddrComp(place, "administrative_area_level_1"),
                    zip: getAddrComp(place, "postal_code"),
                    phone: place.formatted_phone_number || '',
                    notes: ''
                });
            }
            selectPoi(index);
        });
    };
    
    function selectPoi(index) {
        var poiData = mPois[index].data;
        var infoWindowContent = "<b>" + poiData.name + "</b><br/>";
        if (!mEditMode) infoWindowContent += "<a href='javascript:addPoiPopup.editPoi(" + index + ")'>Add this location</a><br/>" + poiData.address;
        
        mInfoWindow.setPosition(mPois[index].marker.getPosition());
        mInfoWindow.setContent(infoWindowContent);
        mInfoWindow.open(mMap,mPois[index].marker);

        /*$("#addPoiPopup .addPoiForm input[name='name']").val($("<div>").html(poiData.name).text());
        $("#addPoiPopup .addPoiForm input[name='phone']").val(poiData.phone);
        $("#addPoiPopup .addPoiForm div.confirmAddress").text(poiData.address);
        $("#addPoiPopup .addPoiForm textarea[name='notes']").val(poiData.notes);
        $("#count").text(poiData.notes.length);*/
    };
    
    this.editPoi = function(index) {
        $('#poiPagination').hide();
        $(".field-validation-error").show();
        $(".field-validation-error.poi-name").css("visibility","hidden");
        $(".field-validation-error.poi-phone").css("visibility","hidden");
        $('#textLimit').css("visibility","hidden");
        mCurrentPoi = mPois[index];
        $("#addPoiPopup .poiSearchResult").toggle(false);
        $("#addPoiPopup .addPoiForm").toggle(true);
        $("#addPoiPopup .confirmPoiForm").toggle(false);
        
        var poiData = mPois[index].data;
        $("#addPoiPopup .addPoiForm input[name='name']").val($("<div>").html(poiData.name).text());
        $("#addPoiPopup .addPoiForm input[name='phone']").val(poiData.phone);
        $("#addPoiPopup .addPoiForm div.confirmAddress").text(poiData.address);
        $("#addPoiPopup .addPoiForm textarea[name='notes']").val(poiData.notes);
        $("#count").text(poiData.notes.length);
    };

    
    this.cancelEditPoi = function() {
        if (pagination) $('#poiPagination').show();
        $("#addPoiPopup .poiSearchResult").toggle(true);
        $("#addPoiPopup .addPoiForm").toggle(false);
    };
    
    this.savePoi = function() {
        var frm = document.editPoiForm;
        
        if ( $.trim(frm.name.value) && validatePhoneNumber() && $(".field-validation-error:visible").length)
            $(".field-validation-error").hide();
        
        if (!$.trim(frm.name.value)) 
            $(".field-validation-error.poi-name").css("visibility","visible");
        else 
            $(".field-validation-error.poi-name").css("visibility","hidden");
        
        if (!validatePhoneNumber()) 
            $(".field-validation-error.poi-phone").css("visibility","visible");
        else 
            $(".field-validation-error.poi-phone").css("visibility","hidden");
        
        if (!$(".field-validation-error:visible").length)
        {
            if (mEditMode){                
                savePoi();
                }
            else {
                    $.post("selectOldestPoi.do", function(result) {
                        if(result.sessionTimeout){
                            alert("Session has timed out. Please log in and try again.");
                            location.href = "../../com/login.do";
                        }
                       else {
                            if (result.success) {

                                var streetComma = ", ";
                                var cityComma = ", ";
                                var breakLine = "<br/>";
                                
                                if (result.data.stetNm == null)
                                {
                                    result.data.stetNm = '';
                                    streetComma = '';
                                    if (result.data.cityNm == null)
                                    {
                                        result.data.cityNm = '';
                                        cityComma = '';
                                        breakLine = ", ";
                                    }
                                    if(result.data.stNm == null){
                                        breakLine = '';
                                        result.data.stNm = '';
                                    }
                                }else if (result.data.cityNm == null){
                                    result.data.cityNm = '';
                                    cityComma = '';
                                    if(result.data.stNm == null){
                                        result.data.stNm = '';
                                    }
                                }else if (result.data.stNm == null){
                                    cityComma = '';
                                    result.data.stNm = '';
                                }
                                
                                
                                confirmPopup.open("You have reached the 25 POI limit.  Click Confirm to delete the oldest POI before adding a new one:<br/><br/>" + result.data.poiNm + breakLine + result.data.stetNm + streetComma + result.data.cityNm + cityComma + result.data.stNm + "<br/>Added on " + result.data.poiCreDt, "POI Limit Reached").onClose(function(confirmed) {
                            if (confirmed) savePoi();
                        });
                    }
                    else savePoi();
                    }
                    

                });
            }
        }
    };
    
    function savePoi() {
            $.post(mEditMode ? "updatePoi.do" : "addPoi.do", {
                poiSeq: mEditMode ? mCurrentPoi.data.trscId : 0,
                poiNm: $("#addPoiPopup .addPoiForm input[name='name']").val().split("—").join("-"),
                stetNm: mCurrentPoi.data.street,
                cityNm: mCurrentPoi.data.city,
                stNm: mCurrentPoi.data.state,
                zip: mCurrentPoi.data.zip,
                lae: mCurrentPoi.data.lat,
                loc: mCurrentPoi.data.lng,
                tn: $("#addPoiPopup .addPoiForm input[name='phone']").val(),
               // userNote: note
                userNote: $("#addPoiPopup .addPoiForm textarea[name='notes']").val()
            },
            function(result) {
                /*
                if(mCurrentPoi.data.state.length != 2)
                {
                    alert('Not a valid POI');
                    return;
                }
                */
                if(result.sessionTimeout){alert("Session has timed out. Please log in and try again.");
                            location.href = "../../com/login.do";}
                else{
                if (result.success) {
                    mDirty = true;
                    populateAndShowConfirmation();
                }
                else alert("Unable to save POI, please try again later");
            }
            });
    }
    
    function getAddrComp(poiData, comp) {
        if (poiData.address_components) {
            for (var i in poiData.address_components)
                for (var j in poiData.address_components[i].types)
                    if (poiData.address_components[i].types[j] == comp)
                        return poiData.address_components[i].short_name;
        }
        return "";
    }
    
    function populateAndShowConfirmation() {
        $("#addPoiPopup .confirmPoiForm span.name").text($("#addPoiPopup .addPoiForm input[name='name']").val());
        $("#addPoiPopup .confirmPoiForm span.phone").text($("#addPoiPopup .addPoiForm input[name='phone']").val());
        $("#addPoiPopup .confirmPoiForm span.address").text(mCurrentPoi.data.address);
        
        var note = $("#addPoiPopup .addPoiForm textarea[name='notes']").val().replace(/\r\n|\r|\n/g,"<br />");
        $("#addPoiPopup .confirmPoiForm span.notes").html(note);
        $("#addPoiPopup .addPoiForm").toggle(false);
        $("#addPoiPopup .confirmPoiForm").toggle(true);
        
        // omniture save poi confirmation tagging 
        s.linkTrackVars='eVar1,eVar2,eVar16,eVar17,eVar18,eVar19,events';
        s.linkTrackEvents='event4';
        s.events='event4';

        /* conversion variables  */
        s.eVar1="${ssCsmrId}";
        s.eVar2="${myCarInfo.vin}";

        s.eVar16='poi-add-location-complete';
        s.eVar17='add-location';
        s.eVar18='navigation';
        s.eVar19='driving-support';

        s.tl(true, 'o', 'poi add location complete');
    }
    
    this.addAnotherPoi = function() {
        $("#addPoiPopup .tiQuery").val("");
        setPois(null);
        setCurrentPage(1);
        $("#searchPoi").focus();
        $(".field-validation-error").show();
        $("#addPoiPopup .confirmPoiForm").toggle(false);
        $("#addPoiPopup .poiSearchResult").toggle(true);
        
        
        // omniture add another poi tagging
        s.linkTrackVars='eVar1,eVar2,eVar16,eVar17,eVar18,eVar19,events';
        s.linkTrackEvents='event5';
        s.events='event5';

        /* conversion variables  */
        s.eVar1="${ssCsmrId}";
        s.eVar2="${myCarInfo.vin}";

        s.eVar16='poi-add-another';
        s.eVar17='add-location';
        s.eVar18='navigation';
        s.eVar19='driving-support';

        s.tl(true, 'o', 'poi another poi ');
        
    };
    
    function validatePhoneNumber() {
        var phone = document.editPoiForm.phone.value.replace(/\D+/g, '');
        if (phone.length == 10 && phone.charAt(0) != '1') phone = "1" + phone;
        if (phone.length == 0 || phone.match(/^1\d{10}$/)) {
            document.editPoiForm.phone.value = phone;
            return true;
        } 
        return false;
    }
};
