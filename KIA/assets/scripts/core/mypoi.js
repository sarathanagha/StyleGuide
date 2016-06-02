(function (uvo) {
    if (!uvo) {
        throw new Error("Make sure you include KH libraries after uvo, not before!");
    }

    var poiModule = {};
    var Maps = (window.google && window.google.maps) || false;
    var khData = uvo.data;
    var poiMap;
    
    var hide = uvo.common.$hide;
    var show = uvo.common.$show;

    var poiModal = {};

    poiModule.Poi = function Poi(rawPoi) {
        this.coords = {
            "lat" : 0,
            "lng" : 0
        };
        if (rawPoi) {
            this.load(rawPoi);
        }
        return this;
    };

    poiModule.Poi.prototype = {
        "poiSeq"       : 0,
        "source"       : "Google",
        "createDate"   : "Jan 01, 2013 00:01 AM",
        "name"         : "",
        "street"       : "",
        "city"         : "",
        "state"        : "",
        "zip"          : "",
        "tn"           : "",
        "userNote"     : "",
        "coords"       : {
            "lat" : 0,
            "lng" : 0
        },
        getAddressHtml : function getAddressHtml() {
            return (this.street + "<br />" + this.city + " " + this.state + " " + (this.zip || ""));
        },
        save           : function poi_save() {

        },
        getLatLng      : function getLatLng() {
            return new Maps.LatLng(this.coords.lat, this.coords.lng);
        },
        hasDetails     : function hasDetails() {
            return (this.zip && this.zip.length > 4);
        },
        isNew          : function isNew() {
            return (this.poiSeq === 0);
        },
        load           : function poi_load(raw) {
            if (raw.hasOwnProperty("formatted_address")) {
                var addrSplit = raw.formatted_address.split(",");
                this.street = $.trim(addrSplit[0]);
                this.city = $.trim(addrSplit[1]);
                this.state = $.trim(addrSplit[2]);
                this.name = $.trim(raw.name);
                this.createDate = new Date(raw.poiCreDt).valueOf();
                this.coords.lat = raw.geometry.location.lat() || 0;
                this.coords.lng = raw.geometry.location.lng() || 0;
                this.reference = raw.reference;
            } else {
                this.poiSeq = raw.poiSeq || 0;
                this.source = raw.poiSrcNm || this.source;
                this.name = $.trim(raw.poiNm) || "";
                this.createDate = new Date(raw.poiCreDt).valueOf() || new Date(this.createDate).valueOf();
                this.street = $.trim(raw.stetNm) || "";
                this.city = $.trim(raw.cityNm) || "";
                this.state = $.trim(raw.stNm) || "";
                this.zip = raw.zip || "";
                this.coords.lat = raw.lae || 0;
                this.coords.lng = raw.loc || 0;
                this.tn = raw.tn || "";
                this.userNote = raw.userNote || "";
            }
        },
        makeMarker     : function makeMarker(map) {
            return new Maps.Marker({
                map      : map,
                position : this.getLatLng(),
                title    : this.name,
                icon     : '/ccw/images/poi/marker_red.png'
            });
        },
        displayDate    : function displayDate() {
            return moment(this.createDate).format("MMM DD, YYYY");
        }
    };

    poiModule.init = function init() {
        uvo.showLoadingMessage();
        var $poiList = $(".poi-list");
        var $baseInfo = $(".poi-info-window").remove();
        var $basePoiListRow = $(".poi-row").remove();
        var $basePoiListInfoRow = $(".poi-more-info").remove();
                      
        $poiList.on('click', 'input.poi-selected', function(event){        	
            var noneSelected = $("input.poi-selected:checked").size() === 0;
            $(".button.delete-selected").toggleClass("inactive", noneSelected);
        });

        var columns = ["createDate", "name", "street", "city", "state"];
        var sortField = "createDate";
        var specialComparisons = {}; //poi field name : function for sorting.
        var asc = 1; //-1 for descending.

        poiMap = uvo.drawDefaultMap();
        var infoWindow = new Maps.InfoWindow({
            pixelOffset : new Maps.Size(-2, -25, "px", "px")
        });
        
        scroll = new IScroll('.poi-list-wrap', {
        	scrollbars: 'custom',
        	interactiveScrollbars: true,
        	mouseWheel: true
        });
        console.dir(scroll.options);
        function updateSortOptions() {
        	if ($filter) {
	            if ($filter.text() == "NEWEST") {
	            	sortField = "createDate";
	            	asc = 1;
	            } else if ($filter.text() == "OLDEST") {
	            	sortField = "createDate";
	            	asc = -1;
	            } else if ($filter.text() == "CITY") {
	            	sortField = "city";
	            	asc = 1;
	            } else if ($filter.text() == "STATE") {
	            	sortField = "state";
	            	asc = 1;
	            } else if ($filter.text() == "NAME OF LOCATION") {
	            	sortField = "name";
	            	asc = 1;
	            }
        	}
        }
        
        function closeInfoWindow() {
            infoWindow.close();
        }

        function createRow(poi, index) {
        	var $newrow = $basePoiListRow.clone();
        	
            $("input.poi-selected", $newrow).attr("id", poi.poiSeq);
            $("label.poi-selected-label", $newrow).attr("for", poi.poiSeq);
            $("input.poi-selected", $newrow).attr("value", poi.poiSeq);
            //$(".poi-name", $newrow).text(poi.name).addClass('row'+index);
            $(".poi-name", $newrow).text(poi.name);
            return $newrow;
        }
        
        function createInfoRow(poi, index) {
        	var $newInforow = $basePoiListInfoRow.clone();
        	var $citystatezip = poi.city + ", " + poi.state + " " + poi.zip;
            $(".poi-name", $newInforow).text(poi.name);
            $(".poi-street", $newInforow).text(poi.street);
            $(".poi-city", $newInforow).text($citystatezip);
            if(poi.tn.charAt(0)=='1') {
            	var newPhone = uvo.common.formatPhoneNumber(poi.tn).slice(2, 20);
            }
            else if(poi.tn.length > 10) {
            	newPhone = poi.tn;
            }
            else {
            	newPhone = uvo.common.formatPhoneNumber(poi.tn);
            }           
            $(".poi-phone", $newInforow).text(newPhone);
            $(".poi-note", $newInforow).html("<p>" + poi.userNote.replace(/\\n/g, "\n") + "</p>");
            
            return $newInforow;
        }
        

        function listPois() {
            uvo.dataRequest("getPoiList").done(function (poiData) {
                var poiArray = poiData || [];
                //console.log(poiData)

                updateSortOptions();
                
                if (poiArray.length >=25 ) {
                	$(".add.button").addClass("disabled");
                } else {
                	$(".add.button").removeClass("disabled");
                }
                
                //see above for structure of poi object
                $.each(poiArray, function (index, poi) {
                    if (!(poi instanceof poiModule.Poi)) {
                        poiData[index] = new poiModule.Poi(poi);
                        poi = poiData[index];
                    }
                });
                
                updateAlertCountMessage(poiArray.length);
                
                asc = sortField === "createDate" ? -asc : asc;
                uvo.common.sortByField(poiArray, sortField, asc, specialComparisons[sortField]);

                //Used to make the map zoom to closest zoom that can fit all the POIs
                var bounds = poiArray.length > 1 ? new Maps.LatLngBounds() : false;

                var $listFragment = $(document.createDocumentFragment());
                var $cntRows = 1;
                
                //Adjust size of map-canvas to fit with list of POIs.
                $('#map-canvas').css("left","250px").css("width","680px");

                $.each(poiArray, function (index, poi) {

                    var $newrow = createRow(poi, index);
                    var $newInforow = createInfoRow(poi, index);
                    var $newHRrow = $('<div class="poi-hr"></div>');
                    
                    $newrow.appendTo($listFragment);                    
                    $newInforow.appendTo($listFragment);                                  
                    
                    if ($cntRows < poiArray.length)
                    {
                    	$newHRrow.appendTo($listFragment);
                    	$cntRows++;
                    }
                    
                    $(".poi-name",$newrow).on('click', toggleActivePoi);
                    $(".poi-name",$newInforow).on('click', toggleActivePoi);
                    
                    function toggleActivePoi() {
                    	var isSamePoi = false;
                    	var oldInfoHeight; 
                    	var newInfoHeight = parseInt($newInforow.css('height').replace('px',''));
                    	var poiListHeight = parseInt($('.poi-list').css('height').replace('px',''));                    	
                    	var listOffset = 46; // when adjusting list height, it will add bottom padding that needs to be removed.
                    	
                    	if( $('.poi-row.active').length ){ 
                    		if ($('.poi-row.active')[0] == $newrow[0]) isSamePoi = true;
                    		oldInfoHeight = parseInt($('.poi-more-info.active').css('height').replace('px',''));
                    		$('.poi-row.active').removeClass("active").toggle();
                    	}
                    	if( $('.poi-more-info.active').length ){                    	
                    		$('.poi-more-info.active').removeClass("active").toggle();
                    	}
                    	
                    	if (!isSamePoi) {
                    		$newrow.toggleClass("active");
                    		$newrow.toggle();
                    		$newInforow.toggleClass("active");
                        	$newInforow.toggle();
                        	
                        	
                        	if (oldInfoHeight) poiListHeight = poiListHeight - oldInfoHeight + listOffset;
                        	$('.poi-list').css('height',(poiListHeight + newInfoHeight - listOffset).toString() + 'px');
                        	scroll.refresh();
                        	
                        	// scroll to element if the new info window will be cutoff
                        	if (650 - $newInforow.position().top < newInfoHeight) {
                        		scroll.scrollToElement('.poi-more-info.active',200,0,0,'');
                        	};
                        	
                        	togglePin();
                        	goToPin();
                    	} else {
                    		if (oldInfoHeight) $('.poi-list').css('height',(poiListHeight - oldInfoHeight + listOffset).toString() + 'px');
                    		scroll.refresh();
                    	}                    	                    	
                    }
                                      
                    var $info = $baseInfo.clone();
                    var moreInfo = poi.getAddressHtml();
                    if(poi.tn.charAt(0)=='1') {
                    	var newPhone = uvo.common.formatPhoneNumber(poi.tn).slice(2, 20);
                    }
                    else if(poi.tn.length > 10) {
                    	newPhone = poi.tn;
                    }
                    else {
                    	newPhone = uvo.common.formatPhoneNumber(poi.tn);
                    }   
                    moreInfo += "<br />" + newPhone + "<br />";
                    moreInfo += poi.userNote;

                    $("strong", $info).text(poi.name);
                    $(".more-info > span", $info).html(moreInfo.replace(/\\n/g, "\n"));

                    var poiPosition = poi.getLatLng();
                    var poiMark = poi.makeMarker(poiMap);

                    function togglePin() {
                        poiModal.showSearchPanel();
                        infoWindow.setContent($info[0]);
                        infoWindow.setPosition(poiPosition);
                        infoWindow.open(poiMap);
                    }

                    function goToPin() {
                        poiMap.setCenter(poiPosition);
                        poiMap.setZoom(12);
                    }
                    
                    Maps.event.addListener(poiMark, 'click', togglePin);
                    $(".poi-buttons .view", $newInforow).on('click', function () {
                    	goToPin();
                        togglePin();
                        //$('.poi-row, .poi-row span.date').removeClass('selectedRow');
                        //$('.row'+index).addClass('selectedRow');
                    });
                    
                    $(".poi-buttons .delete", $newInforow).on('click', function () {
                    	$("input.poi-selected", $newrow).prop('checked', true);
                    	var noneSelected = $("input.poi-selected:checked").size() === 0;
                    	$(".button.delete-selected").toggleClass("inactive", noneSelected);
                    	$(".button.delete-selected").click();
                    });

                    $(".poi-buttons .edit", $newInforow).on('click', function () {
                        poiModal.openForEdit(poi);
                    });

                    $(".close", $info).click(closeInfoWindow);

                    if (bounds) {
                        bounds.extend(poiPosition);
                    } else {
                        goToPin();
                    }
                });

                if (bounds) {
                    poiMap.fitBounds(bounds);
                }

                $(".poi-row").remove();
                $(".poi-more-info").remove();
                $(".poi-hr").remove();
                $listFragment.children().appendTo($poiList);

                scroll.refresh();
                infoWindow.close();
                uvo.clearLoading();
                
                // data request done
            });
        }
        
        poiModule.mapResize = function mapResize() {
        	var center = poiMap.getCenter();
        	google.maps.event.trigger(poiMap, "resize");
        	poiMap.setCenter(center);
        };

        poiModule.dataRefresh = function dataRefresh() {
            $(".button.delete-selected").addClass("inactive");
            poiMap = uvo.drawDefaultMap();
            delete uvo.data.getPoiList;
            uvo.data.getPoiList = false;
            uvo.dataRequest("getPoiList");
            listPois();
        };

        listPois();        
        
        var $filter = $(".dropdown.button");
        var $dropmenu = $filter.next('.dropdown-menu');

        $filter.click(function (e) {
        	e.stopPropagation();
            $dropmenu.toggle();
            $('body').off('click.filter').on('click.filter', function(e){
            	//e.preventDefault();
            	$dropmenu.hide();
            	//alert('click')
            	return false;
            })
        });

        $dropmenu.children().click(function () {
            $filter.text($(this).text());
            $('body').off('click.filter');
            $dropmenu.hide();          
            listPois();
        });        

        initPoiModal(poiMap);

        initDelete();
    };
    
    function updateAlertCountMessage(total) {
        var alertMsg = "<strong>%T</strong> TOTAL POIs &nbsp;&nbsp;";
        alertMsg = alertMsg.replace("%T", total);
        
        $(".alert-msj").html(alertMsg);

        if (total == 0) {
            $(".manage-buttons").hide();
        } else {
            $(".manage-buttons").show();
        }
    }

    function initPoiModal(poiMap) {
        var $popup = $(".modal.my-poi");
        poiModal = new uvo.common.Modal($popup);


        var drawMap = (function () {

            return function drawSearchMap(center) {
                var mapOpts = new uvo.common.MapOptions();
                var addMapEl = $("#add-map").get(0);
                mapOpts.center = center;
                return new Maps.Map(addMapEl, mapOpts);
            };
        }());

        $.extend(poiModal, {
            $dom              : $popup,
            $detailPanel      : $(".poi-dialog", $popup),
            $searchPanel      : $(".poi-container", $popup),
            $searchField      : $(".mypoi-search", $popup),
            $searchResultList : $("#addPoiScroller", $popup),
            $infoWindowDom    : $("#modal-info-base").remove(),
            infoWindow        : new Maps.InfoWindow({
                pixelOffset : new Maps.Size(-2, -25, "px", "px")
            }),
            isEdit            : false,
            map               : null,
            placesService     : null,
            searchIScroll     : null,
            isOpen            : function isOpen() {
                return poiModal.$dom.hasClass("enabled");
            },
            openForEdit       : function openForEdit(poi) {
            	$("#invalidPhone").css('visibility','hidden');
                $("header .title", poiModal.$dom).text("EDIT POI");
                poiModal.isEdit = true;
                hide(poiModal.$searchField);
                poiModal.showDetailPanel();
                uvo.common.Modal.prototype.open.call(poiModal);
                poiModal.map = drawMap(poi.getLatLng());
                poiModal.map.setZoom(12);
                poi.makeMarker(poiModal.map);
                poiModal.showInfoWindow(poi);
                poiModal.displayPoiDetails(poi);
                $(".button.cancel", poiModal.$detailPanel).off('click').on('click', $.proxy(poiModal.close, poiModal));
            },
            openForSearch     : function openForSearch() {
            	$("#invalidPhone").css('visibility','hidden');
                $("header .title", poiModal.$dom).text("ADD POI");
                show(poiModal.$searchField);
                uvo.common.Modal.prototype.open.call(poiModal);
                poiModal.isEdit = false;
                poiModal.$searchField.val("");
                poiModal.$searchResultList.empty();
                hide(poiModal.$searchPanel);
                $(".map", poiModal.$dom).addClass("wide");
                
                // get user region for search. If fails, use selected POI's location.
                if(navigator.geolocation) 
                	navigator.geolocation.getCurrentPosition(
                			function(position) {
                				poiModal.map = drawMap({'lat':position.coords.latitude,'lng':position.coords.longitude});
                			},
                			function() {
                				poiModal.map = drawMap(poiMap.getCenter());
                                poiModal.map.fitBounds(poiMap.getBounds());
                			}
                	);
            },
            resetSearch       : function resetSearch() {
                poiModal.$searchResultList.empty();
                hide(poiModal.$searchPanel);
                $(".map", poiModal.$dom).addClass("wide");
                if (poiModal.searchIScroll) {
                    poiModal.searchIScroll.destroy();
                    poiModal.searchIScroll = null;
                }
                poiModal.$searchField.val("");
                var currentBounds = poiMap.getBounds();
                poiModal.map = drawMap(poiMap.getCenter());
                poiModal.map.fitBounds(currentBounds);
            },
            savePoi           : function savePoi(poiInfo) {
                var $detailPanel = poiModal.$detailPanel;
                var url;
                if (poiInfo.isNew()) {
                    url = "/ccw/ost/sdc/addPoi.do";
                } else {
                    url = "/ccw/ost/sdc/updatePoi.do";
                }
               
                if( !validatePhoneNumber() ){
                	$("#invalidPhone").css('visibility','visible');
                	return;
                } else {
                	$("#invalidPhone").css('visibility','hidden');
                }
                     
                     
                var saveData = {
                    poiSeq   : poiInfo.poiSeq,
                    poiNm    : $.trim($("input.poi-name", $detailPanel).val()),
                    stetNm   : $.trim(poiInfo.street),
                    cityNm   : poiInfo.city,
                    stNm     : poiInfo.state,
                    zip      : poiInfo.zip,
                    lae      : poiInfo.coords.lat,
                    loc      : poiInfo.coords.lng,
                    tn       : poiPhone,
                    userNote : $.trim($("textarea", $detailPanel).val())
                   
                };
               uvo.showLoadingMessage("Adding new POI...");

                
                $.ajax({
                	url: "/ccw/ost/sdc/selectOldestPoi.do",
                	type: "post"
                }).complete(function(result){
                	//console.log(result.responseJSON);
                	if(result.responseJSON.success && !poiModal.isEdit){
                		var streetComma = ", ";
                        var cityComma = ", ";
                        var breakLine = "<br/>";
                        
                        if (result.responseJSON.data.stetNm == null)
                        {
                            result.responseJSON.data.stetNm = '';
                            streetComma = '';
                            if (result.responseJSON.data.cityNm == null)
                            {
                                result.responseJSON.data.cityNm = '';
                                cityComma = '';
                                breakLine = ", ";
                            }
                            if(result.responseJSON.data.stNm == null){
                                breakLine = '';
                                result.responseJSON.data.stNm = '';
                            }
                        }else if (result.responseJSON.data.cityNm == null){
                            result.responseJSON.data.cityNm = '';
                            cityComma = '';
                            if(result.responseJSON.data.stNm == null){
                                result.responseJSON.data.stNm = '';
                            }
                        }else if (result.responseJSON.data.stNm == null){
                            cityComma = '';
                            result.responseJSON.data.stNm = '';
                        }

                        confirmPopup.open("You have reached the 25 POI limit.  Click Confirm to delete the oldest POI before adding a new one:<br/><br/>" + result.responseJSON.data.poiNm + breakLine + result.responseJSON.data.stetNm + streetComma + result.responseJSON.data.cityNm + cityComma + result.responseJSON.data.stNm + "<br/>Added on " + result.responseJSON.data.poiCreDt, "POI Limit Reached").onClose(function(confirmed) {if (confirmed) savePoi(); });
                	} else savePoi();
                });
                
                function validatePhoneNumber() {
                	var phone = ($("input.phone", $detailPanel).val()).replace(/\D+/g, '');
                	if (phone.length == 10 && phone.charAt(0) != '1') phone = "1" + phone;
                	
                	var validAreaCode = true;
                    
                    if ( phone.length != 0 && phone.charAt(1) == phone.charAt(2) && phone.charAt(2) == phone.charAt(3) ){
                        validAreaCode = (phone.charAt(3) == 8)? true: false;
                    }
                    
                	if ( phone.length > 0 && (!phone.match(/^1\d{10}$/) || !validAreaCode) ) {
                        return false;
                    }
                	
                	poiPhone = phone;
                    return true;
                }
                
                function savePoi(){
                	$.ajax({
                    url  : url,
                    type : "POST",
                    data : $.param(saveData)
                }).done(function () {                	
                    poiModule.dataRefresh();
                    uvo.dataRequest("getPoiList").done(function(){
                        poiModal.close();
                    });                    
                    deactivateManage();
                    $(".poi-selected-label").toggleClass("active");
                    uvo.clearLoadingConfirm();
                }).fail(function () {
                    if(poiInfo.isNew()){
                        uvo.showErrorMessage("Unable to add new POI.");
                    } else {
                        uvo.showErrorMessage("Unable to save POI.");
                    }
                    poiModal.close();
                    deactivateManage();
                    $(".poi-selected-label").toggleClass("active");
                });
                }
            },
            sendSearchRequest : function sendSearchRequest(searchText) {
                var searchRequest = new $.Deferred();
                var map = poiModal.map;
                poiModal.placesService = new Maps.places.PlacesService(map);
                //noinspection JSCheckFunctionSignatures
                poiModal.placesService.textSearch({
                    query  : searchText,
                    bounds : map.getBounds()
                }, function (results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        searchRequest.resolve(results);
                    } else {
                        searchRequest.reject([], status);
                    }
                });
                return searchRequest;
            },
            showSearchPanel   : function showSearchPanel() {
                $(".map.wide").removeClass("wide");
                hide(poiModal.$detailPanel);
                show(poiModal.$searchPanel);
            },
            showDetailPanel   : function showDetailPanel() {
                $(".map.wide").removeClass("wide");
                hide(poiModal.$searchPanel);
                show(poiModal.$detailPanel);
            }
        });

        poiModal.infoWindow.setContent(poiModal.$infoWindowDom.get(0));

        $(".button-container .add").on('click', function () {
        	if ($(this).hasClass("disabled")) {
        		var $addpoiConfirmModal = $(".modal.notification-poi-error");
        		$addpoiConfirmModal.addClass("enabled");
        		$(".close", $addpoiConfirmModal).on('click', function () {
                	$addpoiConfirmModal.removeClass("enabled");
                });
        	} else {
        		poiModal.openForSearch();
        	}
        });

        $(".control-wrapper .clear", poiModal.$dom).on('click', poiModal.resetSearch);

        poiModal.$searchField.on('keypress', function (ev) {
            if (ev.which === 13) {
                var searchText = poiModal.$searchField.val();
                poiModal.$searchResultList.empty();

                var searchRequest = poiModal.sendSearchRequest(searchText);
                searchRequest.done(processResults).fail(processResults);
            }
            return true;
        });

        poiModal.highlightPoi = function highlightPoi(poi, $searchResultItem) {
            $(".selected", poiModal.$searchResultList).removeClass("selected");
            $searchResultItem.addClass("selected");

            $("strong", poiModal.$infoWindowDom).text(poi.name);
            $(".more-info > span", poiModal.$infoWindowDom).html(poi.getAddressHtml());

            poiModal.showInfoWindow(poi);
        };

        poiModal.showInfoWindow = function showInfoWindow(poi) {
            poiModal.infoWindow.close();
            var $win = poiModal.$infoWindowDom;
            var position = poi.getLatLng();

            var $infoWindowAddBtn = $(".button.add", poiModal.$infoWindowDom);
            $infoWindowAddBtn.toggleClass("hide", !poi.isNew());

            var moreInfo = poi.getAddressHtml();
            if (poi.tn) {
            	
            	if(poi.tn.charAt(0)=='1') {
                	var newPhone = uvo.common.formatPhoneNumber(poi.tn).slice(2, 20);
                }
                else if(poi.tn.length > 10) {
                	newPhone = poi.tn;
                }
                else {
                	newPhone = uvo.common.formatPhoneNumber(poi.tn);
                }  
            	
                moreInfo += "<br />" + newPhone;
            }
            moreInfo += "<br />" + poi.userNote;

            $("strong", $win).text(poi.name);
            $(".more-info > span", $win).html(moreInfo.replace(/\\n/g, "\n"));
            $(".button.add", $win).off('click').on('click', function () {
                poiModal.displayPoiDetails(poi);
            });

            poiModal.map.setCenter(position);
            //poiModal.map.setZoom(12);
            poiModal.infoWindow.setPosition(position);
            poiModal.infoWindow.open(poiModal.map);
        };

        var processResults = (function () {
            var $baseResult = $(".poi", poiModal.$searchResultList).remove();

            return function processResults(results) {
                var searchPois = results || [];
                var newBounds = searchPois.length > 1 ? new Maps.LatLngBounds() : false;

                poiModal.showSearchPanel();
                poiModal.map = drawMap(poiMap.getCenter());

                $.each(searchPois, function (index, result) {
                    var poi = new poiModule.Poi(result);
                    var $resultItem = $baseResult.clone();
                    var position = poi.getLatLng();

                    $("sub", $resultItem).text(String.fromCharCode(index + 65));
                    $("strong", $resultItem).text(poi.name);
                    $(".more-info > span", $resultItem).html(poi.getAddressHtml());
                    $resultItem.appendTo(poiModal.$searchResultList);

                    if (newBounds) {
                        newBounds.extend(position);
                    } else {
                        poiModal.map.setCenter(position);
                        poiModal.map.setZoom(12);
                    }

                    var marker = poi.makeMarker(poiModal.map);

                    function highlight() {
                        if(poiModal.searchIScroll) {
                            poiModal.searchIScroll.scrollToElement($resultItem.get(0));
                        }
                        poiModal.highlightPoi(poi, $resultItem);
                    }

                    $resultItem.on("click", highlight);
                    Maps.event.addListener(marker, "click", highlight);
                    $(".button.add", $resultItem).on("click", function () {
                        poiModal.displayPoiDetails(poi);
                    });
                });

                if (poiModal.searchIScroll) {
                    poiModal.searchIScroll.scrollTo(0, 0);
                    poiModal.searchIScroll.destroy();
                    poiModal.searchIScroll = null;
                }

                if (newBounds) {
                    poiModal.map.fitBounds(newBounds);
                    poiModal.searchIScroll = new IScroll(poiModal.$searchPanel.get(0), {
                        scrollbars            : 'custom',
                        mouseWheel            : true,
                        interactiveScrollbars : true,
                        snap                  : 'div.poi'
                    });
                } else if (searchPois.length < 1) {
                    poiModal.$searchResultList.html('<div class="no-results">No results found</div>');
                    poiModal.map.fitBounds(poiMap.getBounds());
                }

                $(".button.cancel", poiModal.$detailPanel).off('click').on('click', function () {
                    $(".selected", poiModal.$searchResultList).removeClass("selected");
                    poiModal.showSearchPanel();
                    poiModal.infoWindow.close();
                    if (poiModal.searchIScroll) {
                        poiModal.searchIScroll.scrollTo(0, 0);
                    }

                    if (newBounds) {
                        poiModal.map.fitBounds(newBounds);
                    }
                });
            };
        }());
        
        poiModal.getDetails = (function () {
            function getAddrComponent(poiData, comp) {
                var i, j, component, componentsLength, typesLength;
                if (poiData.address_components) {
                    componentsLength = poiData.address_components.length;
                    for (i = 0; i < componentsLength; i += 1) {
                        component = poiData.address_components[i];
                        typesLength = component.types.length;
                        for (j = 0; j < typesLength; j += 1) {
                            if (component.types[j] === comp) {
                                return component.short_name;
                            }
                        }
                    }
                }
                return "";
            }

            return function getDetails(poi) {
                var defer = $.Deferred();
                if (poi.hasDetails() || !poi.isNew()) {
                    defer.resolve(poi);
                } else {
                    poiModal.placesService.getDetails({
                        reference : poi.reference
                    }, function (place, status) {
                        if (status === Maps.places.PlacesServiceStatus.OK) {
                            $.extend(poi, {
                                city   : getAddrComponent(place, "political"),
                                state  : getAddrComponent(place, "administrative_area_level_1"),
                                zip    : getAddrComponent(place, "postal_code"),
                                tn     : place.formatted_phone_number || ''
                            });
                        }
                        defer.resolve(poi);
                    });
                }
                return defer;
            };
        }());

        (function initDetailsPanel() {
        	$("#invalidPhone").css('visibility','hidden');
            var noteMaxLength = 80;
            poiModal.displayPoiDetails = function displayPoiDetails(poiInfo) {
                $.when(poiModal.getDetails(poiInfo)).done(function () {
                    var $panel = poiModal.$detailPanel;
                    var addr;
                    addr = poiInfo.getAddressHtml();

                    $("p", $panel).first().html(addr);
                    $("input.poi-name", $panel).val(poiInfo.name);
                    if(poiInfo.tn.charAt(0)=='1') {
                    	var newPhone = uvo.common.formatPhoneNumber(poiInfo.tn).slice(2, 20);
                    }
                    else if(poiInfo.tn.length > 10) {
                    	newPhone = poiInfo.tn;
                    }
                    else {
                    	newPhone = uvo.common.formatPhoneNumber(poiInfo.tn);
                    }
                    $(".phone", $panel).val(newPhone);
                    $(".phone").on('keypress',function(){
                    	$("#invalidPhone").css('visibility','hidden');
                    });
                    $("textarea", $panel).val(poiInfo.userNote.replace(/\\n/g, "\n"));
                    $("span.notes sub", $panel).text(noteMaxLength);

                    $(".button.active", $panel).off('click').on('click', function () {
                        poiModal.savePoi(poiInfo);
                    });
                    poiModal.showDetailPanel();
                });
            };

            $("textarea.poi-description", poiModal.$detailPanel).on('keyup', function () {
                var $this = $(this);
                var note = $this.val();
                var len = note.length;
                $("span.notes sub", poiModal.$detailPanel).text(Math.max(noteMaxLength - len, 0));
                $this.val(note.substr(0, noteMaxLength));
            });
        }());
    }

    function initDelete() {
        var $delConfirmModal = $(".modal.notification-delete");
        
        $(".button.delete-selected").on('click', function () {
            if(!$(this).hasClass("inactive")) {
            	$(".modal.notification-delete > .content > .message").html("Are you sure you want to delete the selected POIs?");
                $delConfirmModal.addClass("enabled");
            }
        });

        $(".cancel", $delConfirmModal).on('click', function () {
            $delConfirmModal.removeClass("enabled");
        });
        
        $(".button.delete-all").on('click', function () {
            if(!$(this).hasClass("inactive")) {
            	$(".modal.notification-delete > .content > .message").html("Are you sure you want to delete all POIs?");
            	$(".highlighted.delete", $delConfirmModal).addClass("all");
            	$delConfirmModal.addClass("enabled");
            }
        });

        $(".close", $delConfirmModal).on('click', function () {
        	$delConfirmModal.removeClass("enabled");
        });

        $(".highlighted.delete", $delConfirmModal).on('click', function () {

            uvo.showLoadingMessage("Deleting POIs...");
            if ($(".highlighted.delete.all").length)
            {
            	var poiSeqList = $("input.poi-selected").map(function () {
                    return this.value;
                }).get().join(',');
            } else {
            	//Just makes a comma-separated list of values from the checkboxes.
                var poiSeqList = $("input.poi-selected:checked").map(function () {
                    return this.value;
                }).get().join(',');
            }            

            $.ajax({
                url  : "/ccw/ost/sdc/deletePois.do",
                type : 'POST',
                data : { "poiSeqList" : poiSeqList }
            }).done(function () {
                poiModule.dataRefresh();
                uvo.dataRequest("getPoiList").done(function(){
                    $delConfirmModal.removeClass("enabled");
                    deactivateManage();
                    $(".poi-selected-label").toggleClass("active");
                    $('.poi-list').css('height','auto');
                	scroll.scrollTo(0,0,200);
                	scroll.refresh();
                });
            }).fail(function () {
                uvo.showErrorMessage("Unable to delete selected POIs.");
                $delConfirmModal.removeClass("enabled");
                deactivateManage();
                $(".poi-selected-label").toggleClass("active");
            });
        });               
    }
    
    function activateManage() {
    	$(".alert-menu").addClass("hide").removeClass("show");
        $(".manage-buttons .dropdown-menu").hide();
        $(".poi-selected-label").toggleClass("active");
    }

    function deactivateManage() {      	
        $(".alert-menu").addClass("show").removeClass("hide");
        $(".poi-selected-label").toggleClass("active");
    }
            
    function hideLeftNav() {
    	//$(".widgets-blade").toggle();
    	if ($(".nav-hide-img.show").length > 0)
    	{
    		$('.poi-container').show();
    		$(".button.nav-hide").removeClass("show");
    		$(".nav-hide-img").removeClass("show");    		
    		$('.button.nav-hide span').text('HIDE ');
    		$(".nav-hide-img").attr('src', '../img/kh/img/my-pois/arrow-left.png');
    		$('#map-canvas').css("left","250px").css("width","680px");
    		var center = poiMap.getCenter();
    		google.maps.event.trigger(poiMap, 'resize');
    		poiMap.setCenter(center);
    		
    	} else {
    		$('.poi-container').hide();
    		$(".button.nav-hide").addClass("show");
    		$(".nav-hide-img").addClass("show");
    		$('.button.nav-hide span').text('SHOW ');
    		$(".nav-hide-img").attr('src', '../img/kh/img/my-pois/arrow-right.png');
    		$('#map-canvas').css("left","0").css("width","930px");
    		var center = poiMap.getCenter();
    		google.maps.event.trigger(poiMap, 'resize');
    		poiMap.setCenter(center);
    	}    	   	
    }
    
    $(document).ready(function () {
        $(".manage-buttons .button:first").click(activateManage);
        $(".delete-buttons .button.active:last").click(deactivateManage);
        $(".button.nav-hide").click(hideLeftNav);
        
        $('input.text-input.phone').keypress(
                function(e) {
                    if (e.which == 0 || e.which == 8 || e.which == 9
                            || e.which == 45
                            || (e.which > 47 && e.which < 58))
                        return true;
                    else
                        return false;
                });
    });

    uvo.setModuleReady("poi", poiModule);
}(window.uvo));