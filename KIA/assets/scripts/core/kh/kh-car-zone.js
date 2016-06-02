(function (uvo) {
    if (!uvo) {
        throw new Error("Make sure you include libraries after uvo, not before!");
    }

    var gMaps = (window.google && window.google.maps),
        com = uvo.common,
        uTypes = uvo.dataTypes,
        genericErrHandler = uvo.genericErrorHandler;

    function loaderFactory(vo) {
        return function load(raw) {
            var field;
            for (field in vo) {
                if (vo.hasOwnProperty(field)) {
                    if (raw && raw.hasOwnProperty(field)) {
                        this[field] = raw[field] || vo[field];
                    } else {
                        this[field] = vo[field];
                    }
                }
            }
            return this;
        };
    }

    (function (routeFactory) {
        uvo.addEarlyInit([
            routeFactory("getSpeedSettings", "/ccw/kh/speedLimitAlertSettings.do", (/\/kh\/speedSettings/i)),
            routeFactory("curfewSettings", "/ccw/kh/curfewAlertSettings.do", (/\/kh\/curfewSettings/i)),
            routeFactory("getGeoFenceSettings", "/ccw/kh/geoFenceAlertSettings.do", (/\/kh\/geofenceSettings/i))
        ]);
    }(uvo.simpleRouteFactory));    
    
    var module = {
    	/*
    	 * check pending statuses of other modules
    	 * ex. if user is on curfew settings page, this function will check statuses for speed and geofence
    	 */
    	checkPendingStatus: function(mczStatus) {
    		/*return false;*/
    		var pending = false;   		
    		if (mczStatus) {
    			var mod = $('body').attr('id');
    			var htmlExists = ($('.pending-msg-detail').length > 0);
	    		if (htmlExists) $('.pending-msg-detail').addClass('hide');
	    		
	    		if (mod == 'kh-curfew-settings' || mod == 'kh-geofence-settings') {
	    			if (mczStatus.SPEEDCONFIG > 0) { if (htmlExists) $('.speed-config-message').removeClass('hide'); pending = true; };
	    			if (mczStatus.SPEEDONOFF  > 0) { if (htmlExists) $('.speed-onoff-message').removeClass('hide'); pending = true; };
	    		}
	    		
	    		if (mod == 'kh-curfew-settings' || mod == 'kh-speed-settings') {
	    			if (mczStatus.GEOCONFIG > 0) { if (htmlExists) $('.geofence-config-message').removeClass('hide'); pending = true; };
	    			if (mczStatus.GEOONOFF  > 0) { if (htmlExists) $('.geofence-onoff-message').removeClass('hide'); pending = true; };
	    		}
	    		
	    		if (mod == 'kh-speed-settings' || mod == 'kh-geofence-settings') {
	    			if (mczStatus.CURFEWCONFIG > 0) { if (htmlExists) $('.curfew-config-message').removeClass('hide'); pending = true; };
	    			if (mczStatus.CURFEWONOFF  > 0) { if (htmlExists) $('.curfew-onoff-message').removeClass('hide'); pending = true; };
	    		}
    		}
    		
    		return pending;
    	},
        updateMyCarZoneSettingEnabled : function (which) {
        	var defer = new $.Deferred();
            uvo.selectedVehicle().done(function (vehicle) {
            	var typeCodes = {
                        "curfew"   : 0,
                        "geofence" : 2,
                        "speed"    : 3
                    };

                var vin = vehicle.vin;
                $('#a_normal span').text('');
                
                $.ajax("/ccw/kh/onOffAlert.do", {
                    type : "POST",
                    data : {"onOffAlertPayload" : JSON.stringify({
                        vin           : vin,
                        alertTypeCode : typeCodes[which],
                        active        : $('.enabled-switch').hasClass("on") ? "A" : "I"
                    })}
                }).done(function () {
                    defer.resolve();
                }).fail(function(xhr, status, err){
                	uvo.genericErrorHandler(xhr, status, err);
                	defer.reject();
                }).complete(function(){
                	
                });
            });
            return defer;
        },
        initCurfewSettings            : function initCurfewSettings() {
        		           	
                var settings = [],
                	deletedCurfews = [],
                	curfews = [],                
                	enabled = false,
                	pending = false,
                	hasErrors = false,
                	interval,
                	$pendingModal = $(".modal.notification-pending"),
                	$curfewFragment = $('ul.alert-list > li').remove(),
                	
                	// pending list flags
                	isDeleting = false,
                	isInserting = false,
                	isModifying = false,
                	isMasterSwitch = false,
                	isIntervalChanged = false
                	;
                
                function loadState(state) {
                	if (state == 'pending' || state == 'submit') {
                		uvo.showLoadingMessage();
                		$('.kh-button, .pending-msg, .add-new, .pending-list').addClass('hide');
                		$('.kh-button-pending').removeClass('hide');
                		if (state == 'pending')     $('.pending-msg.pending').removeClass('hide');
                		else if (state == 'submit') $('.pending-msg.submit').removeClass('hide');
                		$('.enabled-switch, .alert-interval').addClass('disabled');
                		$('.alert-list').addClass('off');
                		$('.alert-list > li').addClass('closed').removeClass('open').addClass('inactive');
            			pending = true;	            			
            			if (!interval) interval = module.initPendingRefresh();
                	} else if (state == 'error') {
                		uvo.clearLoading();
                		module.clearPendingRefresh(interval);
                		pending = false;
                		$('.kh-button, .pending-msg').addClass('hide');
                		if ($('body').hasClass('show-error-button')) $('.kh-button-error, .pending-msg.error').removeClass('hide');
                		else 										 $('.kh-button-submit, .pending-msg.error').removeClass('hide');
                		$('.enabled-switch').removeClass('disabled');
                		if ($('.enabled-switch').hasClass('on')) {
                			$('.alert-list').removeClass('off');
                			$('.alert-switch, .alert-interval').removeClass('disabled');
                		}
                		updatePendingList();
                	} else if (state == 'normal') {
                		uvo.clearLoading();
                		pending = false;
                		$('.enabled-switch, .alert-switch, .alert-interval').removeClass('disabled');
                		$('.alert-list').removeClass('off');
                	} else if (state == 'loading') {
                		uvo.showLoadingMessage();
                	} else if (state == 'off') {
                		if(!enabled) {
                			$('.alert-interval').addClass('hide');
                			$('.mcz-off-warning-msg').removeClass('hide');
                		}
                		$('.alert-list').addClass('off');
                		$('.alert-interval').addClass('disabled');
                		$('.add-new').addClass('hide');
                		$('.alert-list > li').addClass('closed').removeClass('open').addClass('inactive').removeClass('active');                		
                	} else if (state == 'on') { // use this when user toggles master switch on, IF vehicle status master is on
                		if(!enabled) {
                			$('.mcz-off-warning-msg').removeClass('hide');
                		} else {
                			$('.add-new').removeClass('hide');
                			$('.alert-list').removeClass('off');
                    		$('.alert-interval').removeClass('disabled');
                    		$('.alert-list > li').each(function() {
                    			if ($('.alert-switch', $(this)).hasClass('on')) { $(this).removeClass('inactive').addClass('active');  }
                    		});
                		}
                	}
                }
                
                loadState('loading');
                loadData();                
                  
                // time-selection events
                $(".alert-list").on('click', ".hour-wrap", function() {
                	var $parent = $(this).parent()[0];
                	var isShowing = ($(".hour-list:visible", $parent).length > 0);
                	
                	$(".minute-list, .minute-arrow").hide();
                    $(".minute-wrap").css("border", "1px solid #2f2f2f");
                    $(".hour-list, .hour-arrow").hide();
                    $(".hour-wrap").css("border", "1px solid #2f2f2f");
                	
                    if(!isShowing) {
	                    $(".hour-list, .hour-arrow", $parent).toggle();
	                    $(".hour-wrap", $parent).css("border", "1px solid #d50010");
                    }
                });
                $(".alert-list").on('click', ".hour-list li", function() {
                	var $parent = $(this).parent().parent().siblings('.hour-wrap');
                    $parent
                        .html($(this).html())
                        .css("border", "1px solid #2f2f2f");
                    $(".hour-list, .hour-arrow").hide();
                    
                    // get <li> to check for pending changes
                    var $parentLi = $parent.parent().parent().parent().parent('li');
                    checkRulesForModifiedData($parentLi);
                    updateTime($parentLi);
                });

                $(".alert-list").on('click', ".minute-wrap", function() {
                	var $parent = $(this).parent()[0];
                	var isShowing = ($(".minute-list:visible", $parent).length > 0);
                	
                	$(".minute-list, .minute-arrow").hide();
                    $(".minute-wrap").css("border", "1px solid #2f2f2f");
                    $(".hour-list, .hour-arrow").hide();
                    $(".hour-wrap").css("border", "1px solid #2f2f2f");
                	
                    if (!isShowing) {
	                    $(".minute-list, .minute-arrow", $parent).toggle();
	                    $(".minute-wrap", $parent).css("border", "1px solid #d50010");
                    }
                });
                $(".alert-list").on('click', ".minute-list li", function() {
                	var $parent = $(this).parent().parent().siblings('.minute-wrap');
                    $parent
                        .html($(this).html())
                        .css("border", "1px solid #2f2f2f");
                    $(".minute-list, .minute-arrow").hide();
                    var $parentLi = $parent.parent().parent().parent().parent('li');
                    checkRulesForModifiedData($parentLi);
                    updateTime($parentLi);
                });
                
                // add new curfew rule
            	$('.add-new span').on('click', function(e){
            		var $frag = $(document.createDocumentFragment());
            		var $item = $curfewFragment.clone(true);
            		var index = $('ul.alert-list > li').length + 1;
            		
            		// hide add new button when there are 3 curfews
            		if (index > 2) $('.add-new').addClass('hide');
            		
            		var list = $('ul.alert-list > li');
            		
            		var hasCur1 = false, hasCur2 = false, hasCur3 = false;
            		var hasIndex1 = false, hasIndex2 = false, hasIndex3 = false;
            		
            		$.each(list,function(e){
            			if (!$(list[e]).hasClass('hide')) {
            				var title = $('.title',list[e]).text();
            				var dIndex = $('.edit',list[e]).attr('data-index');
            				
	            			if (title == 'Curfew 1') hasCur1 = true;
	            			else if (title == 'Curfew 2') hasCur2 = true;
	            			else if (title == 'Curfew 3') hasCur3 = true;
	            			
	            			if (dIndex == '1') hasIndex1 = true;
	            			else if (dIndex == '2') hasIndex2 = true;
	            			else if (dIndex == '3') hasIndex3 = true;
            			}
            		});
            		
            		var curfewNum = 1, dataIndex = 1;
            		
            		if (hasCur1 && !hasCur2) curfewNum = 2;
            		else if (hasCur1 && hasCur2) curfewNum = 3;
            		
            		if (hasIndex1 && !hasIndex2) dataIndex = 2;
            		else if (hasIndex1 && hasIndex2) dataIndex = 3;
            		
            		$('.title', $item).text('Curfew '+curfewNum); 
            		$('.curfew-name', $item).val('Curfew '+curfewNum);
            		$('.edit', $item).attr('data-index', dataIndex);
                	$item.addClass('temp');	                	
            		$item.removeClass('hide').appendTo($frag);
            		$frag.appendTo('ul.alert-list');
            		
            		if ($('.alert-list > li').length < 2) $('.delete', '.alert-list').addClass('hide');
            		else                                 $('.delete', '.alert-list').removeClass('hide');
            		
            		isInserting = true;
            		updatePendingList();
               	});
            	
            	// day select toggle
            	$('.alert-list').on('click', '.body .days span', function(){
            		 var $span = $(this);
            		 var $parent = $span.parent().parent().parent('li');
            		 
            		 $span.toggleClass('on');
            		 checkRulesForModifiedData($parent);
            		 var isOn = $span.hasClass('on');
            		 var $daysHead = $('.head .days span', $parent);
            		 $daysHead.each(function() {
            			 if ($(this).text() == $span.text()) {
            				 if (isOn) $(this).addClass('on');
            				 else      $(this).removeClass('on');      
            				 return false;
            			 } 
            		 });
            	});
            	
            	// ampm toggle
            	$('.alert-list').on('click', '.body .from-ampm span, .body .to-ampm span', function(){
            		var $parent = $(this).parent().parent().parent().parent().parent('li');
            		$(this).parent().find('span').toggleClass('on');
            		checkRulesForModifiedData($parent);
            		updateTime($parent);
            	});
            	
            	// submit request
            	$('.kh-button-submit, .kh-button-error').click( function(e) {
            		if ($(this).hasClass('disabled')) return false;
            		
            		// if master switch is changed, call on/off endpoint. Otherwise, build and send curfews
            		if (isMasterSwitch) {
            			loadState('submit');     
            			$.when(module.updateMyCarZoneSettingEnabled("curfew")).done(function(){
            				loadState('pending');
    	                }).fail(function(){
    	                	$('body').addClass('show-error-button');
    	                	loadState('error');    	                	
    	                });
            		} else {
            			if (!pending && enabled) {
            				var submitCurfews = true;
            				$('.alert-list > li').each(function() {
            					var $parent = $(this);
            					var showValidation = false;
            					
            					$('.validation',$parent).addClass('hide');
                    			
                    			// validate curfew name
                				var curfewNameString = $('.curfew-name', $parent).val();
                    			if (XRegExp('^[^\\s][A-Za-z\\d\\s\\p{L}]+$').test(curfewNameString) == false || $.trim(curfewNameString).length == 0) {
                    				$('.curfew-name-validation', $parent).removeClass('hide');
                    				showValidation = true;
                    			}
                				
        	            		// validate time
                    			var fromHours = $('.from-wrapper .hour-wrap', $parent).text();
        	            		var fromMins = $('.from-wrapper .minute-wrap', $parent).text();
        	            		var toHours = $('.to-wrapper .hour-wrap', $parent).text();
        	            		var toMins = $('.to-wrapper .minute-wrap', $parent).text();
        	            		var fromAmpm = $('.from-ampm .on', $parent).text();
        	            		var toAmpm = $('.to-ampm .on', $parent).text();
        	            		
        	            		function validateTimeRange(fromHr, toHr, fromMin, toMin, fromAP, toAP) {
        	            			if (fromAP == 'AM' && fromHr == 12) fromHr = 0;
        	            			else if (fromAP == 'PM' && fromHr != 12) fromHr = parseInt(fromHr) + 12;
        	            			
        	            			if (toAP == 'AM' && toHr == 12) toHr = 0;
        	            			else if (toAP == 'PM' && toHr != 12) toHr = parseInt(toHr) + 12;
        	            			
        	            			if (fromHr > toHr) return false;
        	            			else if (fromHr == toHr && fromMin >= toMin) return false;
        	            			
        	            			return true;
        	            		}
        	            		
        	            		if (	fromHours > 12 || fromHours < 1 ||
        	            				fromMins  > 59 || fromMins  < 0 ||
        	            				toHours   > 12 || toHours   < 1 ||
        	            				toMins    > 59 || toMins    < 0
        	            			) {
        	            			$('.curfew-time-validation', $parent).removeClass('hide');
        	            			showValidation = true;
        	            		}
        	            		
        	            		// validate time range. range must fall within same day
        	            		else if(!validateTimeRange(fromHours,toHours,fromMins,toMins,fromAmpm,toAmpm)) {
        	            			$('.curfew-time-range-validation', $parent).removeClass('hide');
        	            			showValidation = true;
        	            		}
        	            		
        	            	
        	            			
        	            		// validate days
        	            		if ($('.body .days span.on', $parent).length == 0){
        	            			$('.curfew-days-validation', $parent).removeClass('hide');
        	            			showValidation = true;
        	            		}
        	            		
                    			
                    			if (showValidation) {
                    				if ($parent.hasClass('closed')) $parent.removeClass('closed').addClass('open');
                    				submitCurfews = false;
                    			} 	
            				});
            				
            				if (submitCurfews) {
            					loadState('submit');
    		            		$.when(sendCurfews()).done( function(){
    		            			loadState('pending');
    		            		}).fail(function() {
    		            			$('body').addClass('show-error-button');
    		            			loadState('error');    		            			
    		            		});
            				}
                		}
            		}            		
            	});
            	
            	// alert-switch rule on/off toggle
            	$('.alert-list').on('click', '.alert-switch', function(){
            		if ($('.alert-list').hasClass('off')) return false;
        			var $parent = $(this).parents('li');
        			
                	var isOn =  $(this).hasClass('on');
                	if (isOn) { $(this).removeClass('on').addClass('off').text('OFF'); $parent.addClass('inactive').addClass('closed').removeClass('open'); $('.validation', $parent).addClass('hide');}
                	else      { $(this).removeClass('off').addClass('on').text('ON'); $parent.removeClass('inactive');}	                	
                	checkRulesForModifiedData($(this).parent().parent('li'));
            	});
            	
            	// cancel toggle - collapse
            	$('.alert-list').on('click', '.button.cancel', function(e){
            		var $parent = $(this).parents('li');
        			$parent.removeClass('open').addClass('closed');        			
        			if($('.delete', $parent).hasClass('hide')){
        				$parent.addClass('hide');
        				var index = $('ul.alert-list > li').length;
        				if (index <= 2){
	            			$('.add-new').removeClass('hide');
	            		}
        			}
            	});
            	
            	$('.notification-pending .cancel').on('click', function(){
	        		var $parent = $(this).parents('.notification-pending');
	        		$parent.removeClass('enabled');  
	        	});
            	
            	// alert interval - show interval list
                $(".dropdown", $('.alert-interval')).click(function () {
                	if ($('.alert-interval').hasClass('disabled')) return false;
                	$(".dropdown-menu", $('.alert-interval')).not($(this).next(".dropdown-menu").toggle()).hide();
                });
                
                // select interval
                $(".dropdown-menu li").on('click', function () {
                	if (!pending && enabled) {
	                    var $this = $(this);
	                    $this.parent().hide().prev(".dropdown").text($this.text());
	                    if ($this.parent().parent('.interval-dropdown').attr('data-default') == $this.text()) {
	                    	isIntervalChanged = false;
	                    } else isIntervalChanged = true;
	                    updatePendingList();
            		}
                	else {
                		if(pending)$pendingModal.addClass("enabled");
                	}
                
                });

                // expand/collaspe curfew
            	$('.alert-list').on('click', '.edit', function(){
            		if ($('.alert-list').hasClass('off')) return false;
            		if (!pending && enabled) {
	            		var $parent = $(this).parents('li');
	            		if ( $parent.hasClass('closed') && !$parent.hasClass('inactive')) {
	            			$('ul.alert-list li').removeClass('open').addClass('closed');
	            			$parent.removeClass('closed').addClass('open');	            		
	            		} else {
	            			$parent.removeClass('open').addClass('closed');
	            		}
	            		$('.validation').addClass('hide');
            		} else {
            			if(pending)$pendingModal.addClass("enabled");
            		}
            	});

            	// master switch toggle
                $('.enabled-switch').click(function () {
                	if ($(this).hasClass('disabled')) return false;
                	toggleAlertMasterSwitch();
                });

                // delete curfew 
            	$('.alert-list').on('click', '.delete', function(){
            		var $parent = $(this).parents('li');
            		if ($parent.hasClass('inactive')) return false;
            		
                    var $delConfirmModal = $(".modal.notification-delete");
                    $delConfirmModal.addClass("enabled");
                    
                    
                    
                    $(".cancel", $delConfirmModal).on('click', function () {
                    	$(this).unbind('click');
                        $delConfirmModal.removeClass("enabled");
                    });
                    
                    $(".highlighted.delete", $delConfirmModal).on('click', function (e) {                        
		            		
                       	var $removed = $parent.remove();
                       	$removed.addClass('deleting');
                       	if (!$removed.hasClass('temp')) {
                       		deletedCurfews.push($removed);
                       		isDeleting = true;
                       	} else {
                       		isInserting = ($('.alert-list > li.temp').length > 0);
                       	}
                       	
                       	updatePendingList();
                       	$('.add-new').removeClass('hide');
                    	$delConfirmModal.removeClass("enabled");
                    	if ($('.alert-list > li').length < 2) $('.alert-list .delete').addClass('hide');
                    	$(this).unbind('click');
                     });
            	});      
            	
            	// on text changed - update pending
            	$('.alert-list').on('change','.curfew-name', function() {
            		var $parent = $(this).parent().parent().parent('li');
            		checkRulesForModifiedData($parent);
            		$('.title',$parent).text($(this).val());
            	});
            	
            	function updatePendingList() {
            		if ($('body').hasClass('show-error-button')) $('body').removeClass('show-error-button');            			
            		else { $('.kh-button-error').addClass('hide'); $('.kh-button-submit').removeClass('hide'); }
            		
            		var showPendingList = (isMasterSwitch || isInserting || isModifying || isDeleting || isIntervalChanged);
            		$('.pending-list ul li').addClass('hide');
            		if (isMasterSwitch) {
            			if ($('.enabled-switch').hasClass('on')) {
            				$('.pending-list-master-on').removeClass('hide');
            				$('.pending-list-master-off').addClass('hide');
            			} else {
            				$('.pending-list-master-on').addClass('hide');
            				$('.pending-list-master-off').removeClass('hide');
            			}
            			$('.pending-list').addClass('has-master');
            		}            		
            		else {
	            		if (isInserting) $('.pending-list-add').removeClass('hide');
	            		if (isModifying) $('.pending-list-modify').removeClass('hide'); 
	            		if (isDeleting) $('.pending-list-delete').removeClass('hide');
	            		if (isIntervalChanged) $('.pending-list-interval').removeClass('hide');
	            		$('.pending-list').removeClass('has-master');
            		}
            		
            		// if there are no pending change output, hide list
            		//$('.pending-list div').text(output);
            		if (showPendingList) {$('.pending-list').removeClass('hide'); $('.kh-button-submit').removeClass('disabled');}
            		else               {$('.pending-list').addClass('hide'); $('.kh-button-submit').addClass('disabled');}
            		
            	}
            	
            	function checkRulesForModifiedData($curfew) {
            		var isNew = $curfew.hasClass('temp');
            		// If curfew is newly added and has days selected, mark as Adding for pending list
            	
            		if (!isNew) {
            			var modify = false; 
            			
	        			//check title
	        			if ($('.curfew-name',$curfew).attr('data-default') != $('.curfew-name', $curfew).val()) modify = true;
	        			
	        			//check alert-switch
	        			if ($('.alert-switch', $curfew).attr('data-default') == 'on' && !$('.alert-switch', $curfew).hasClass('on')) modify = true;
	        			if ($('.alert-switch', $curfew).attr('data-default') == 'off' && $('.alert-switch', $curfew).hasClass('on')) modify = true;
	        			
	        			//check time
	        			if ($('.from-wrapper .hour-wrap',$curfew).text() != $('.from-wrapper .hour-wrap',$curfew).attr('data-default')) modify = true;
	        			if ($('.from-wrapper .minute-wrap',$curfew).text() != $('.from-wrapper .minute-wrap',$curfew).attr('data-default')) modify = true;
	        			if (!$('.from-wrapper .from-pm',$curfew).hasClass('on') && $('.from-wrapper .from-pm',$curfew).attr('data-default') == 'on') modify = true;
	        			if (!$('.from-wrapper .from-am',$curfew).hasClass('on') && $('.from-wrapper .from-am',$curfew).attr('data-default') == 'on') modify = true;
	        			
	        			if ($('.to-wrapper .hour-wrap',$curfew).text() != $('.to-wrapper .hour-wrap',$curfew).attr('data-default')) modify = true;
	        			if ($('.to-wrapper .minute-wrap',$curfew).text() != $('.to-wrapper .minute-wrap',$curfew).attr('data-default')) modify = true;
	        			if (!$('.to-wrapper .to-pm',$curfew).hasClass('on') && $('.to-wrapper .to-pm',$curfew).attr('data-default') == 'on') modify = true;
	        			if (!$('.to-wrapper .to-am',$curfew).hasClass('on') && $('.to-wrapper .to-am',$curfew).attr('data-default') == 'on') modify = true;	        				        			
	        			
	        			//check days
	        			var daysBody = $('.body .days span', $curfew);
	        			
	        			var i = 0;
	        			for (var i = 0; i < daysBody.length; i++) {
	        				if (($(daysBody[i]).attr('data-default') && !$(daysBody[i]).hasClass('on')) ||
	        				(!$(daysBody[i]).attr('data-default') && $(daysBody[i]).hasClass('on')) )
	        					modify = true;
	        			}
	        			
	        			if (modify) $curfew.addClass('modified');
	        			else        $curfew.removeClass('modified');
	        			
	        			isModifying = ($('.alert-list li.modified').length > 0);
	            		
	            		updatePendingList();
            		}
            	}
            	
            	function updateTime($parent) {
            		var startHour = parseInt($('.from-wrapper .hour-wrap', $parent).text());
            		var startMin = $('.from-wrapper .minute-wrap', $parent).text();
            		var startAmpm = $('.from-pm', $parent).hasClass('on') ? 'pm' : 'am';
            		
            		var endHour = parseInt($('.to-wrapper .hour-wrap', $parent).text());
            		var endMin = $('.to-wrapper .minute-wrap', $parent).text();
            		var endAmpm = $('.to-pm', $parent).hasClass('on') ? 'pm' : 'am';
            		
            		$('.head .time .start').text(startHour.toString()+":"+startMin+startAmpm);
            		$('.head .time .end').text(endHour.toString()+":"+endMin+endAmpm);
            	}
            	
            	function toggleAlertMasterSwitch() {
            		var isOn = $('.enabled-switch').hasClass('on');
            		if (isOn) {
            			$('.enabled-switch').addClass('off').removeClass('on').text('OFF');
            			loadState('off');
            			if ($('.enabled-switch').attr('data-default') == 'on') isMasterSwitch = true;
            			else                        						   isMasterSwitch = false;
            			updatePendingList();
            		}
            		else {
            			$('.enabled-switch').addClass('on').removeClass('off').text('ON');
            			loadState('on');
            			if ($('.enabled-switch').attr('data-default') == 'off') isMasterSwitch = true;
            			else                        						    isMasterSwitch = false;
            			updatePendingList();
            		}
            	}
            	
            	function loadData(){
            		uvo.dataRequest("curfewSettings").done(function (response) {

            			settings = response.CurfewAlertList;
            			
                        enabled = response.Active === "A";
                        pending = module.checkPendingStatus(response.MCZStatus) || response.TmuStatus === 'P'; // individual pending will be checked in each curfew alert later
                        hasErrors = (response.LatestConfig == false || response.TmuStatus == 'I');
                        var $button = $('.enabled-switch').toggleClass("on", enabled).attr('data-default', (enabled) ? 'on' : 'off');
                        var interval = 5, uom = 1;
                        $button.toggleClass("off", !enabled).text(enabled ? "ON" : "OFF");
                        
                        // push response into curfew array by grouping by parent Id
                        curfews = [];            			
            			$.each(settings, function(index, value) {
	                    	if ($.isArray(curfews[value.parentId])) {
	                    		curfews[value.parentId].push(value);
	                    	} else {
	                    		curfews[value.parentId] = new Array(value);
	                    		interval = value.curfewTime;
	                    		uom = value.curfewTimeUom;
	                    	}
	                    });
            			
            			// calc uom
            			if (curfews.length > 0) {
            				switch (uom) {
            				case 0:
            					interval = interval*60;
            				case 2:
            					interval = interval/60/1000;
            				case 3:
            					interval = interval/60;
            				}
            			}
            			
            			
            			$(".interval-dropdown .dropdown").text(interval + " minutes");
            			$('.interval-dropdown').attr('data-default', interval + " minutes");
            			
            			// build curfew list
            			var $frag = $(document.createDocumentFragment());
            			var i = 1;
	                    $.each(curfews, function(index, value){
	                    	if (typeof value != 'undefined'){
	                    		
	                    		var $item = $curfewFragment.clone(true);
	    	                	$('.edit', $item).attr('data-index', i);
	    	                	$('.title',$item).text(value[0].curfewName);	    	                	
	    	                	$('.curfew-name', $item).val(value[0].curfewName);
	    	                	$('.curfew-name', $item).attr('data-default', value[0].curfewName);

	    	                	var from = value[0].startTime < 1000 ? moment('0'+value[0].startTime, "HHmm") : moment(value[0].startTime, "HHmm");
	    	                	var to = value[0].endTime < 1000 ? moment('0'+value[0].endTime, "HHmm") : moment(value[0].endTime, "HHmm");
	    	                	
	    	                	$('.time .start',  $item).text(from.format("h:mma"));
	    	                	$('.time .end',  $item).text(to.format("h:mma"));
	    	                	var hour = from.format("h");
	    	                	var minute = from.format("mm");
	    	                	if (hour.length == 1) hour = "0" + hour;
	    	                	if (minute.length == 1) minute = "0" + minute;
	    	                	$('.from-wrapper .hour-wrap',  $item).text(hour);
	    	                	$('.from-wrapper .hour-wrap',  $item).attr('data-default',hour);
	    	                	$('.from-wrapper .minute-wrap',  $item).text(minute);
	    	                	$('.from-wrapper .minute-wrap',  $item).attr('data-default',minute);
	    	                	$('.from-am', $item).toggleClass('on', from.format("a") == 'am');
	    	                	if ($('.from-am', $item).hasClass('on')) $('.from-am', $item).attr('data-default', 'on');
	    	                	$('.from-pm', $item).toggleClass('on', from.format("a") == 'pm');
	    	                	if ($('.from-pm', $item).hasClass('on')) $('.from-pm', $item).attr('data-default', 'on');
	    	                	
	    	                	hour = to.format("h");
	    	                	minute = to.format("mm");
	    	                	if (hour.length == 1) hour = "0" + hour;
	    	                	if (minute.length == 1) minute = "0" + minute;
	    	                	$('.to-wrapper .hour-wrap',  $item).text(hour);
	    	                	$('.to-wrapper .hour-wrap',  $item).attr('data-default',hour);
	    	                	$('.to-wrapper .minute-wrap',  $item).text(minute);
	    	                	$('.to-wrapper .minute-wrap',  $item).attr('data-default',minute);
	    	                	$('.to-am', $item).toggleClass('on', to.format("a") == 'am');
	    	                	if ($('.to-am', $item).hasClass('on')) $('.to-am', $item).attr('data-default', 'on');
	    	                	$('.to-pm', $item).toggleClass('on', to.format("a") == 'pm');
	    	                	if ($('.to-pm', $item).hasClass('on')) $('.to-pm', $item).attr('data-default', 'on');
	    	                	
	    	                	$.each(value, function(i, curfew){
	    	                		var adjustedStart = curfew.startDay - 1 < 0 ? 6 : curfew.startDay - 1;
	    	    	                var adjustedEnd = curfew.endDay - 1 < 0 ? 6 : curfew.endDay - 1;
	    	                		$('.head .days span', $item).eq(adjustedStart).addClass('on');
	    	                		$('.body .days span', $item).eq(adjustedStart).addClass('on');
	    	                		$('.body .days span', $item).eq(adjustedStart).attr('data-default','on');
	    	                		if (curfew.endDay != curfew.startDay) {
	    	                			$('.head .days span', $item).eq(adjustedEnd).addClass('end');
	    	                			//$('.body .days span', $item).eq(curfew.endDay).addClass('end');
	    	                		}
	    	                		//curfew.status = 'C';
	    	                		if (curfew.status == 'S') {	    	                		
	    	                			pending = true;
	    	                		}
	    	                	});
	    	                	var $button = $('.alert-switch',  $item);
	    	                	var enabled = value[0].active == 'A';
	    	                	$button.toggleClass("on", enabled).toggleClass("off", !enabled).text(enabled ? "ON" : "OFF").attr('data-default', enabled ? 'on' : 'off');
	    	                	$item.toggleClass('inactive', !enabled);
	    	                	$item.removeClass('hide').appendTo($frag);
	    	                	i++;
	                    	}
	                    });
	                    
	                    // append list fragment to alert-list container
	                	$frag.children().appendTo('ul.alert-list');
	                	
	                	// hide addClass if there are 3 or more curfew groups
	                	if ($('ul.alert-list > li').length > 2) $('.add-new').addClass('hide');
	                	else 								    $('.add-new').removeClass('hide');
	                	
	                	// hide trashcan icon if there are 1 or less curfew groups
	                	if ($('ul.alert-list > li').length < 2) $('.delete','ul.alert-list > li').addClass('hide');
	                    else 									$('.delete','ul.alert-list > li').removeClass('hide');
	                	
	                	
	                	if(pending) loadState('pending'); 
	                	else if (hasErrors) loadState('error');
	                	else loadState('normal');  
	                	if (!enabled) loadState('off'); 
            		});

            	}
            	
            	// targetIndex: data-index of curfew to modify
            	function sendCurfews(){
            		var defer = new $.Deferred();
            		$('#a_normal span').text('');
            		uvo.selectedVehicle().done(function (vehicle) {
            			var inputsValid = true;
            			var payload = buildPayload(vehicle);
                        
                        $.ajax("/ccw/kh/curfewAlertSettings.do", {
                            type : "POST",
                            data : {"curfewAlertPayload" : JSON.stringify(payload)}
                        }).done(function () {
                        	// Continue pending until page refreshes
                            defer.resolve();
                        }).fail(function(xhr, status, err){
                        	uvo.genericErrorHandler(xhr, status, err);
                        	defer.reject();
                        }).complete(function(){
                        	
                        });
            		});
            		return defer;
            	}
            	
            	function buildPayload(vehicle){
            		var payload = [];
            		var id = 1;
            		
            		var $curfews = $('ul.alert-list > li');
            		for (var i = 0; i < deletedCurfews.length; i++) {
            			processCurfewElement($(deletedCurfews[i]));
            		}
            		
            		$curfews.each(function(){           
            			processCurfewElement($(this));
	            	});
            		
            		function processCurfewElement($element) {
            			
            			var $curfew = $element;
            			var parentId = $('.edit', $curfew).attr('data-index');
            			var name, start, end;
            			var action = $('.alert-switch', $curfew).hasClass('on') ? 'insert' : 'disable';
            			var interval = parseInt($(".interval-dropdown").children(".dropdown").text());
            			
        				name = $('.curfew-name',$curfew).val();
            			var hours = $('.from-wrapper .hour-wrap', $curfew).text();
            			var min = $('.from-wrapper .minute-wrap', $curfew).text();
            			start = hours+min+$('.from-ampm .on', $curfew).text();
            			hours = $('.to-wrapper .hour-wrap', $curfew).text();
            			min = $('.to-wrapper .minute-wrap', $curfew).text();
            			end = hours+min+$('.to-ampm .on', $curfew).text();
            			
            			$('.body .days span', $curfew).each(function(index){
            				var adjustedIndex = index + 1 < 7 ? index + 1 : 0;
	            			var rule = {
									"parentId" : parentId,
									"curfewName" : name,
									"curfewConfigId" : null,
									"vin" : vehicle.vin,
									"curfewId" : id,
									"active" : "A",
									"startTime" : moment(start, "hhmmA").format("HHmm"),
									"endTime" : moment(end, "hhmmA").format("HHmm"),
									"startDay" : 0,
									"endDay" : 0,
									"createdUser" : null,
									"createdDate" : null,
									"modifiedUser" : null,
									"modifiedDate" : null,
									"status" : "C",
									"curfewTime" : interval,
									"curfewTimeUom" : "1",
									"action" : action
								};
        					rule.startDay = adjustedIndex;
        					rule.endDay = rule.startTime > rule.endTime ? adjustedIndex + 1 : adjustedIndex;
        					if (rule.endDay > 6){
        						rule.endDay = 0;
        					}
            				if ($(this).hasClass('on')) {
            					if ($(this).parents('li').hasClass('deleting')){
            						rule.action = "delete";
            					}
	            				payload.push(rule);
            					//console.log(payload.length, payload)
            				} else if (!$(this).hasClass('on') && $(this).parents('li').find('.head .days span').eq(index).hasClass('on')) {
            					// compare to previous
            					rule.action = "delete";
	            				payload.push(rule);
            				} else {
            					
            				}
            				//console.log('id', id, 'index', index);
            				id++;
            			});
        			
            		}
            		
            		return payload;
            	}
            	


        },
        initSpeedSettings             : function initSpeedSettings() {
        	
        	var currentSetting,
				enabled = false,
				pending = false,
				$pendingModal = $(".modal.notification-pending"),
				latestConfig = false,
				tmuStatus = 'A',
				hasErrors = false,
				interval,
				$button = $('.enabled-switch'),
				
				// pending list flags
	        	isMasterSwitch = false,
	        	isSpeedChanged = false,
	        	isIntervalChanged = false
				;
        	
        	// init slider
            $('#speed-slider').slider({
            	range:'min',
            	min:45,
            	max:85,
            	step:1,
            	value: 45,
            	create: function( event, ui ) {
            		$('<div><span>'+45+'</span><sub>mph</sub><div>').appendTo('.ui-slider-handle');
            	},
            	slide: function(event, ui){
            		$('.ui-slider-handle span').text(ui.value);
            	},
            	change: function(event, ui){
            		$('.ui-slider-handle span').text(ui.value);
            	},
            	stop: function(event,ui) {
            		isSpeedChanged = ($('#speed-slider').attr('data-default') != ui.value);
            		updatePendingList();
            	}
            });
        	
        	loadState('loading');        	
        	
        	function loadState(state) {
        		if (state == 'pending' || state == 'submit') {
        			pending = true;
        			uvo.showLoadingMessage();
        			$('#speed-slider').slider({disabled:true});
        			$('.pending-msg, .kh-button, .pending-list').addClass('hide');
                	if (state == 'pending') $('.pending-msg.pending').removeClass('hide');
                	else if (state == 'submit') $('.pending-msg.submit').removeClass('hide');
                	$('.kh-button-pending').removeClass('hide');
                	$('.button.minus, .button.plus, .enabled-switch, .alert-label, .button.dropdown, .speed-label').addClass('disabled');
                	interval = module.initPendingRefresh();
        		} else if (state == 'error') {
        			uvo.clearLoading();
        			pending = false;
        			$('.pending-msg, .kh-button').addClass('hide');
        			if ($('body').hasClass('show-error-button')) $('.kh-button-error, .pending-msg.error').removeClass('hide');
            		else 										 $('.kh-button-submit, .pending-msg.error').removeClass('hide');
        			$('.enabled-switch').removeClass('disabled');
            		if ($('.enabled-switch').hasClass('on')) {
            			$('#speed-slider').slider('enable');
            			$('.button.minus, .button.plus, .alert-label, .button.dropdown, .speed-label').removeClass('disabled');
            		}
        			updatePendingList();
        			if (interval) module.clearPendingRefresh(interval);
        		} else if (state == 'normal') {
        			uvo.clearLoading();
        			pending = false;
        			$('.button.minus, .button.plus, .alert-label, .button.dropdown, .speed-label, .enabled-switch').removeClass('disabled');
        		} else if (state == 'loading') {
        			uvo.showLoadingMessage();
        			$('#speed-slider').slider({disabled:true});
        		} else if (state == 'off') {
            		if(!enabled) {
            			$('.mcz-off-warning-msg').removeClass('hide');
            		}
            		$('.button.minus, .button.plus, .alert-label, .button.dropdown, .speed-label').addClass('disabled');
            		$('#speed-slider').slider({disabled:true});
            	} else if (state == 'on') { // use this when user toggles master switch on, IF vehicle status master is on
            		if(!enabled) {
            			$('.mcz-off-warning-msg').removeClass('hide');
            		} else {
	            		$('.button.minus, .button.plus, .enabled-switch,  .alert-interval, .button.dropdown, .speed-label').removeClass('disabled');
	            		$('#speed-slider').slider('enable');
	            		$('.alert-label').removeClass('disabled');
            		}
            	}
        	}
        	
            function SpeedSetting(raw) {
                this.load(raw || {});
            }

            (function () {
                var vo = {
                    "speedConfigId" : "",
                    "speed"         : 45,
                    "speedUom"      : 1,
                    "speedTime"     : 5,
                    "speedTimeUom"  : 1,
                    "status"        : 'C',
                    "action"		: 'insert'
                };
                SpeedSetting.prototype.load = loaderFactory(vo);
            }());
            
            $.when(uvo.data.getSpeedSettings).done(function (response) {
            	currentSetting = new SpeedSetting();
            	
                var settings = response.SpeedAlertList;  
                
                // load response into SpeedSetting object
                if (settings.length) {
                    currentSetting.load(settings[0]);
                } else {
                    currentSetting.speedConfigId = null;
                    currentSetting.action = 'insert';
                }
                
                // set statuses
                enabled = response.Active === "A";
                latestConfig = response.LatestConfig;
                tmuStatus = response.TmuStatus;
                pending = module.checkPendingStatus(response.MCZStatus) || response.TmuStatus === 'P' || currentSetting.status === "S";                
                hasErrors = !response.LatestConfig || response.TmuStatus == 'I';
                
                // set values from response
                $button = $('.enabled-switch').toggleClass("on", enabled);
                $('#speed-slider').slider('value',currentSetting.speed);
                $button.toggleClass("off", !enabled).text(enabled ? "ON" : "OFF").attr('data-default', enabled ? 'on':'off');                
                $("#freq-drop .dropdown").text(currentSetting.speedTime + " minutes").attr('data-default', currentSetting.speedTime + " minutes");
                $('#speed-slider').slider('enable').attr('data-default',currentSetting.speed);                
                
                // load state
                if (pending) loadState('pending');
                else if (hasErrors) loadState('error');
                else loadState('normal');
                if (!enabled) loadState('off');
                
            });
            
            $('.notification-pending .cancel').on('click', function(){
        		var $parent = $(this).parents('.notification-pending');
        		$parent.removeClass('enabled');  
        	});
            
            $('.button').on('click', function(e){
            	if ($(this).hasClass('disabled')) return false;
            	var min = $('#speed-slider').slider( "option", "min" );
            	var max = $('#speed-slider').slider( "option", "max" );
            	var val = $('#speed-slider').slider( "value" );
            	var step = $('#speed-slider').slider( "option", "step" ); 
            	var speedVal = -99;
            	if ($(this).hasClass('minus') && val > min) {
            		speedVal = val - step;
            		$('#speed-slider').slider("value", speedVal);
            	}
            	if ($(this).hasClass('plus') && val < max) {
            		speedVal = val + step;
            		$('#speed-slider').slider( "value", speedVal);
            	}
            	
            	if (speedVal != -99) {
            		isSpeedChanged = ($('#speed-slider').attr('data-default') != speedVal);
            		updatePendingList();	
            	}
            });

            $(".dropdown", $('.alert-info-wrap')).click(function () {
            	if ($(this).hasClass('disabled')) return false;
        		$(".dropdown-menu", $('.alert-info-wrap')).not($(this).next(".dropdown-menu").toggle()).hide();
            });
            
            $(".dropdown-menu li").on('click', function () {
                var $this = $(this);
                $this.parent().hide().prev(".dropdown").text($this.text());
                isIntervalChanged = ($('.button.dropdown').attr('data-default') != $this.text());
                updatePendingList();
            });

            /* close dropdowns if user hits escape */
            $(document).keyup(function (e) {
                if (e.which === 27) { // esc keycode
                    $(".dropdown-menu").hide();
                }
            });

            // master-switch speed
            $('.enabled-switch').click(function () {
            	if ($(this).hasClass('disabled')) return false;
            	toggleAlertMasterSwitch();
            });

            $(".kh-button-submit, .kh-button-error").click(function () {
            	if ($(this).hasClass('disabled')) return false;
        		doSave();
            });                 
            
            function toggleAlertMasterSwitch() {
        		var isOn = $('.enabled-switch').hasClass('on');
        		if (isOn) {
        			$('.enabled-switch').addClass('off').removeClass('on').text('OFF');
        			loadState('off');
        			if ($('.enabled-switch').attr('data-default') == 'on') isMasterSwitch = true;
        			else                        						   isMasterSwitch = false;
        			updatePendingList();
        		}
        		else {
        			$('.enabled-switch').addClass('on').removeClass('off').text('ON');
        			loadState('on');
        			if ($('.enabled-switch').attr('data-default') == 'off') isMasterSwitch = true;
        			else                        						    isMasterSwitch = false;
        			updatePendingList();
        		}
        	}
            
            function updatePendingList() {
            	if ($('body').hasClass('show-error-button')) $('body').removeClass('show-error-button');            			
        		else { $('.kh-button-error').addClass('hide'); $('.kh-button-submit').removeClass('hide'); }
            	
            	var showPendingList = (isMasterSwitch || isSpeedChanged || isIntervalChanged);
            	
            	$('.pending-list ul li').addClass('hide');
            	if (isMasterSwitch) {
            		if ($('.enabled-switch').hasClass('on')) $('.pending-list-master-on').removeClass('hide');
            		else                                     $('.pending-list-master-off').removeClass('hide');
            		$('.pending-list').addClass('has-master');
            	} else {
            		if (isSpeedChanged) $('.pending-list-speed').removeClass('hide');
            		if (isIntervalChanged) $('.pending-list-interval').removeClass('hide');
            		$('.pending-list').removeClass('has-master');
            	}
            	
            	if (showPendingList) {
            		$('.kh-button-submit').removeClass('disabled');
            		$('.pending-list').removeClass('hide');
            	} else {
            		$('.kh-button-submit').addClass('disabled');
            		$(".pending-list").addClass('hide');
            	}
            }
            
            function doSave() {  
                uvo.selectedVehicle().done(function (vehicle) {
                	if (isMasterSwitch) {
            			loadState('submit');            			
            			$.when(module.updateMyCarZoneSettingEnabled("speed")).done(function(){
            				loadState('pending');
    	                }).fail(function(){
    	                	$('body').addClass('show-error-button');
    	                	loadState('error');
    	                });
                	} else {
	                    var speed =  $('#speed-slider').slider( "value" );
	                    var freq = parseInt($("#freq-drop").children(".dropdown").text());
	
	                    currentSetting.vin = vehicle.vin;
	                    currentSetting.speed = speed;
	                    currentSetting.speedTime = freq;
	                    currentSetting.speedTimeUom = 1;
	                    currentSetting.speedUom = 1;
	                    currentSetting.action = "insert";
	                    delete currentSetting.status;

	                    loadState('submit');
	                    $('#a_normal span').text('');
	                    $.ajax("/ccw/kh/speedLimitAlertSettings.do", {
	                        type : "POST",
	                        data : {"speedLimitAlertPayload" : JSON.stringify(currentSetting)}
	                    }).done(function () {
	                    	loadState('pending');
	                    }).fail(function(xhr, status, err){
                        	uvo.genericErrorHandler(xhr, status, err);
	                    	$('body').addClass('show-error-button');
	                    	loadState('error');
	                    }).complete(function(){

                        });
                	}
                });
            }

        },
        initGeofenceSettings          : function initGeofenceSettings() {
        	
        	
        	var $pendingModal = $(".modal.notification-pending"),
        	
        		$gmap = $('<div id="gmap"></div>'), maps = [], circles = [], rectangles = [], bounds = [], settings,
        		enabled = false,
        		pending = false,
        		hasErrors = false,
        		interval,
        		deletedAlerts = [],
        		$alertFragment = $('ul.alert-list > li').remove(),
        		$addrBox = $('.geofence-search input'),
        		
        		isDragging = false,
        		
        		// pending list flags
        		isMasterSwitch = false,
        		isIntervalChanged = false,
        		isInserting = false,
        		isDeleting = false,
        		isModifying = false
        		;
        	 
        	function loadState(state) {
            	if (state == 'pending' || state == 'submit') {
        			$('.button.cancel, .button.add, .geofence-search :input, .geofence-search').addClass('hide');
        			
        			uvo.showLoadingMessage();
            		$('.kh-button, .pending-msg, .add-new, .pending-list').addClass('hide');
            		$('.kh-button-pending').removeClass('hide');
            		if (state == 'pending')     $('.pending-msg.pending').removeClass('hide');
            		else if (state == 'submit') $('.pending-msg.submit').removeClass('hide');
            		$('.enabled-switch, .alert-interval').addClass('disabled');
            		$('.alert-list').addClass('off');
            		$('.alert-list > li').addClass('closed').removeClass('open').addClass('inactive');
            		toggleShape($('.alert-list > li'), false);
        			pending = true;	            			
        			if (!interval) interval = module.initPendingRefresh();
            	} else if (state == 'error') {
            		uvo.clearLoading();
            		module.clearPendingRefresh(interval);
            		pending = false;
            		$('.kh-button, .pending-msg').addClass('hide');
            		if ($('body').hasClass('show-error-button')) $('.kh-button-error, .pending-msg.error').removeClass('hide');
            		else 										 $('.kh-button-submit, .pending-msg.error').removeClass('hide');
            		$('.enabled-switch').removeClass('disabled');
            		if ($('.enabled-switch').hasClass('on')) {
            			$('.alert-list').removeClass('off');
            			$('.alert-switch, .alert-interval').removeClass('disabled');
            		}
            		updatePendingList();
            	} else if (state == 'normal') {
            		uvo.clearLoading();
            		pending = false;
            		$('.enabled-switch, .alert-switch, .alert-interval').removeClass('disabled');
            		$('.alert-list').removeClass('off');
            	} else if (state == 'loading') {
            		uvo.showLoadingMessage();
            	} else if (state == 'off') {
            		if(!enabled) {
            			$('.alert-interval').addClass('hide');
            			$('.mcz-off-warning-msg').removeClass('hide');
            		}
            		$('.alert-list').addClass('off');
            		$('.alert-interval').addClass('disabled');
            		$('.add-new').addClass('hide');
            		$('.alert-list > li').addClass('closed').removeClass('open').addClass('inactive').removeClass('active'); 
            		toggleShape($('.alert-list > li'), false);
            	} else if (state == 'on') {
            		// use this when user toggles master switch on, IF vehicle status master is on
            		if(!enabled) {
            			$('.mcz-off-warning-msg').removeClass('hide');
            		} else {
	            		$('.alert-list').removeClass('off');
	            		$('.alert-interval').removeClass('disabled');
	            		$('.add-new' + ($('.on-entry-switch').hasClass('on') ? '.on-entry' : '.on-exit')).removeClass('hide');                		
	            		$('.alert-list > li').each(function() {
	            			if ($('.alert-switch', $(this)).hasClass('on')) { $(this).removeClass('inactive').addClass('active');  }
	            		});
	            		toggleShapeFromOff($('.alert-list > li'));
            		}
            	}
            }
        	
        	function updatePendingList() {
        		if ($('body').hasClass('show-error-button')) $('body').removeClass('show-error-button');            			
        		else { $('.kh-button-error').addClass('hide'); $('.kh-button-submit').removeClass('hide'); }
        		
        		var showPendingList = (isMasterSwitch || isInserting || isModifying || isDeleting || isIntervalChanged);
        		
        		$('.pending-list ul li').addClass('hide');
        		if (isMasterSwitch) {
        			if ($('.enabled-switch').hasClass('on')) {
        				$('.pending-list-master-on').removeClass('hide');
        				$('.pending-list-master-off').addClass('hide');
        			} else {
        				$('.pending-list-master-on').addClass('hide');
        				$('.pending-list-master-off').removeClass('hide');
        			}
        			$('.pending-list').addClass('has-master');
        		}            		
        		else {
            		if (isInserting) $('.pending-list-add').removeClass('hide');
            		if (isModifying) $('.pending-list-modify').removeClass('hide'); 
            		if (isDeleting) $('.pending-list-delete').removeClass('hide');
            		if (isIntervalChanged) $('.pending-list-interval').removeClass('hide');
            		$('.pending-list').removeClass('has-master');
        		}
        		
        		if (showPendingList) {$('.pending-list').removeClass('hide'); $('.kh-button-submit').removeClass('disabled');}
        		else               {$('.pending-list').addClass('hide'); $('.kh-button-submit').addClass('disabled');}        		
            }
            
            function toggleAlertMasterSwitch() {
        		var isOn = $('.enabled-switch').hasClass('on');
        		if (isOn) {
        			$('.enabled-switch').addClass('off').removeClass('on').text('OFF');
        			loadState('off');
        			if ($('.enabled-switch').attr('data-default') == 'on') isMasterSwitch = true;
        			else                        						   isMasterSwitch = false;
        			updatePendingList();
        		}
        		else {
        			$('.enabled-switch').addClass('on').removeClass('off').text('ON');
        			loadState('on');
        			if ($('.enabled-switch').attr('data-default') == 'off') isMasterSwitch = true;
        			else                        						    isMasterSwitch = false;
        			updatePendingList();
        		}
        	}
            
        	
        	loadState('loading');
        	
            $.when(uvo.data.getGeoFenceSettings).done(function (response) {
            	uvo.clearLoading();            	
        		settings = response.GeoFenceAlertList;
        		pending = module.checkPendingStatus(response.MCZStatus) || response.TmuStatus == 'P';
        		hasErrors = (response.LatestConfig == false || response.TmuStatus == 'I');
        		//console.log(settings)
        		var $frag = $(document.createDocumentFragment());
        		$.each(settings, function(index, value){
        			var $item = $alertFragment.clone(true);
        			var entryfence = value.circleFenceType == 2 || value.rectFenceType == 2;
        			$item.addClass(entryfence ? 'on-entry' : 'on-exit');
                	$('.edit', $item).attr('data-index', index);
                	$('.title', $item).text(value.geoFenceName);                	
                	$('.geofence-name', $item).val(value.geoFenceName);
                	$('.geofence-name', $item).attr('data-index',value.geoFenceName);
                	enabled = value.active == 'A';
                	var $button = $('.alert-switch',  $item);
                	
                	$button.toggleClass("on", enabled).toggleClass("off", !enabled).text(enabled ? "ON" : "OFF").attr('data-default', enabled ? 'on' : 'off');
                	
                	if ($button.hasClass('on')) {
                		$('.geofence-search :input',$item).removeAttr('disabled');
                	}
                	else {
                		$('.geofence-search :input',$item).attr('disabled','disabled');
                		$item.addClass('inactive');
                	}
                	
                    drawMap($item, value);
                    //$('.map-wrap',$item).attr('data-default', (value.circleFenceType == 0) ? JSON.stringify(rectangles[index].getBounds()) : JSON.stringify(circles[index].getBounds()));
                    $.when(getLocation($item, value)).done(function(results){
                    	//console.log('results', results);
                    	$('.address', $item).text(results[1].formatted_address);
                    });
                    $('.details', $item).text(getSize($item));
                    settings[index].action = 'insert';
                	$item.removeClass('hide').appendTo($frag);
                	
                	if (value.status == 'S') pending = true;
               
        		});
        		
        		var interval = 5;
                enabled = response.Active === "A"; 
                var $button = $('.enabled-switch').toggleClass("on", enabled);
                $button.toggleClass("off", !enabled).text(enabled ? "ON" : "OFF").attr('data-default', (enabled) ? 'on' : 'off');
        		$frag.children().appendTo('ul.alert-list');
        		
        		if ($('ul.alert-list li.on-entry').length > 4) $('.add-new.on-entry').addClass('hide');
        		else 										   $('.add-new.on-entry').removeClass('hide'); 
        		
            	// hide trashcan icon if there are 1 or less groups
            	if ($('ul.alert-list > li').length < 2) $('.delete','ul.alert-list > li').addClass('hide');
                else 									$('.delete','ul.alert-list > li').removeClass('hide');
        		
    			if (settings.length > 0) {
    				interval = settings[0].geoFenceTime;
    				switch (settings[0].geoFenceTimeUom) {
    				case 0:
    					interval = interval*60;
    				case 2:
    					interval = interval/60/1000;
    				case 3:
    					interval = interval/60;
    				}
    			}
    			
    			$(".interval-dropdown .dropdown").text(interval + " minutes");
    			$('.interval-dropdown').attr('data-default', interval + " minutes");
	        	
	            if (pending) loadState('pending');  
        		else if (hasErrors) loadState('error');
        		else loadState('normal');
	            if (!enabled) loadState('off');
	            
        	});
            
            // keyup map search event
            $('.alert-list').on('keyup', '.geofence-search input', function (ev) {
            	var $parent = $(this).parents('li');
            	if ($parent.hasClass('inactive')) return false;
            	
            	var index = $('.edit',$parent).attr('data-index');
            	var ruleEnabled = $('.alert-switch', $parent).hasClass('on');
            	if (ruleEnabled) {
	                if (ev.which === 13) {
	                    locate($(this).val());
	                } else {
	                    locationStale = true;
	                }
            	}

                function locate(search) {
                    haveLocation = new $.Deferred();

                    $.when(com.makeGeocodeRequest(search)).done(function (results) {
                    	if (results.length === 0) {
                    		haveLocation.reject();
                    	}
                    	else if (results.length === 1) {
                            haveLocation.resolve(results[0]);
                        } else {
                        	//TODO resolve multiple results
                        	haveLocation.resolve(results[0]);
                            
                        }
                    });

                    haveLocation.done(function (result) {
                        maps[index].setCenter(result.geometry.location);
                        
                        bounds[index] = drawCircle(result.geometry.location, 5000, maps[index], index, true);
                        if (rectangles[index] )rectangles[index].setMap(null);
                        if (circles[index]) circles[index].setMap(null);
                        if ($('.button.rectangle', $parent).hasClass('active')) {
                        	bounds[index] = drawRectangle(bounds[index], maps[index], index, true);
                        	
                        } else {
                        	bounds[index] = drawCircle(result.geometry.location, 5000, maps[index], index, true);
                        }
                        
                        maps[index].fitBounds(bounds[index]);
                        $parent.addClass('searched');
                        checkRulesForModifiedData($parent);
                        
                    }).fail(function(){
                    	alert('Location not found.');
                    });

                    return haveLocation;
                }
            });
            
            // master switch geofence
            $('.enabled-switch').on('click', function () {
            	if ($(this).hasClass('disabled')) return false;
            	toggleAlertMasterSwitch();
            });

        	
        	// add new
        	$('.add-new span').on('click', function(){
        		
        		var $frag = $(document.createDocumentFragment());
        		var $item = $alertFragment.clone(true);
        		var isOnEntry = $(this).parents('div').hasClass('on-entry');
        		if (isOnEntry) $item.addClass('on-entry');
        		else $item.addClass('on-exit');
        		$item.addClass('temp');
        		
        		$('.body').addClass('hide');
        		
        		var index = 0;
        		for (var i = 0; i < 6; i++) {
        			var found = false;
        			$('.alert-list li .edit').each(function() {
        				if ($(this).attr('data-index') == i) found = true;
        			});
        			if (!found) {
        				index = i;
        				break;
        			}
        		}
        		
            	$('.edit', $item).attr('data-index', index);
            	$('.title', $item).text('Geo Fence ' + ((isOnEntry) ? 'Entry' : 'Exit'));
            	$('.geofence-name', $item).val('Geo Fence ' + ((isOnEntry) ? 'Entry' : 'Exit'));

            	var $button = $('.alert-switch',  $item);
            	//var enabled = true;
            	$button.toggleClass("on", enabled).toggleClass("off", !enabled).text(enabled ? "ON" : "OFF");
                
            	$('.alert-list li').addClass('closed').removeClass('open');
            	$item.removeClass('hide').appendTo($frag);
        		$item.addClass('open').removeClass('closed');
        		$('.body', $item).removeClass('hide');
        		var $map = $gmap.clone(true);
        		$('.map-wrap',  $item).prepend($map);
        		//center = getBrowserLocation();
        		$.when(getBrowserLocation()).done(function(center){
        			//console.log('center', center);
        			var mapOptions = new com.MapOptions({center:center});
        			maps[index] = new gMaps.Map($map.get(0), mapOptions);
        			bounds[index] = drawCircle(center, 5000, maps[index], index, true);
        			drawRectangle(bounds[index], maps[index], index, true);
        			rectangles[index].setMap(null);
        			maps[index].fitBounds(bounds[index]);
        			$('.button.circle', $item).addClass('active');
        		}).fail(function(center){
        			center = new google.maps.LatLng(39.87, -98.60);
        			//console.log('center', center)
        			var mapOptions = new com.MapOptions({center:center});
        			maps[index] = new gMaps.Map($map.get(0), mapOptions);
        			maps[index].setZoom(4);
        			bounds[index] = drawCircle(center, 500000, maps[index], index, true);
        			maps[index].fitBounds(bounds[index]);
        			//drawRectangle(bounds[index], maps[index], index);
        			//rectangles[index].setMap(null);
        			//maps[index].fitBounds(bounds[index]);
        			$('.button.circle', $item).addClass('active');
        		});
        		//console.log($frag.children().get(0))
            	$frag.children().appendTo('ul.alert-list');
        		if ($('ul.alert-list li.on-exit').length > 0) {
        			$('.add-new.on-exit').addClass('hide');
        		}
        		if ($('ul.alert-list li.on-entry').length > 4) {
        			$('.add-new.on-entry').addClass('hide');
        		}

        		if ($('.alert-list > li').length < 2) $('.delete', '.alert-list').addClass('hide');
        		else                                 $('.delete', '.alert-list').removeClass('hide');
        		
        		isInserting = true;
        		updatePendingList();
            });

        	// alert-switch on/off 
        	$('.alert-list').on('click', '.alert-switch', function(){
        		if ($('.alert-list').hasClass('off')) return false;
        		var $parent = $(this).parents('li');
        		var index = $('.edit',$parent).attr('data-index');
        		
        		var isOn =  $(this).hasClass('on');
        		if (isOn) { 
        			$(this).removeClass('on').addClass('off').text('OFF'); 
        			$parent.addClass('inactive').removeClass('active'); 
        			$parent.addClass('disabling');
        			toggleShape($parent,false);
        			$('.geofence-search input',$parent).prop('disabled','disabled');
        			$('.validation', $parent).addClass('hide');
        		}
        		else      { 
        			$(this).removeClass('off').addClass('on').text('ON'); 
        			$parent.removeClass('inactive').addClass('active'); 
        			$parent.removeClass('disabling');
        			toggleShape($parent,true);	                                                                      	
        			$('.geofence-search input',$parent).removeProp('disabled');
        		}
        		checkRulesForModifiedData($parent);
        	});
            
            // edit expand/collapse rule
            $('.alert-list').on('click', '.edit', function(){
        		if ($(this).hasClass('disabled')) return false;
        		
        		var index = parseInt($(this).attr('data-index'));
        		var $parent = $(this).parents('li');
        		if ( $parent.hasClass('closed')) {
        			$('.alert-list li').addClass('closed').removeClass('open');
	        		$parent.addClass('open').removeClass('closed');
	        		$('.body').addClass('hide');
	        		
	        		$('.body', $parent).removeClass('hide');
	        		$('.button.add', $parent).text('Done');
	        		
	        		google.maps.event.trigger(maps[index],'resize');
	        		google.maps.event.addListenerOnce(maps[index], 'idle', function() {
	        			maps[index].fitBounds(bounds[index]);
	        		} );
        		} else {
            		$parent.addClass('closed').removeClass('open');
            		$('.body', $parent).addClass('hide');
            		//$('#gmap', $parent).remove();
        		}
        		$('.validation').addClass('hide');
        	});
            
            // alert-toggle on-entry/on-exit list
            $('.alert-toggle span').on('click', function(){
        		if ($('.alert-toggle').hasClass('disabled')) return false;
        		if ($(this).hasClass('on-entry-switch')) {
        			$('.on-exit').addClass('hide');
        			$('.on-entry').removeClass('hide');
        			
        			$('.on-exit-switch').removeClass('on');
        			$('.on-entry-switch').addClass('on');
        			
        			$('ul.alert-list').removeClass('exit-list').addClass('entry-list');
        		} else {
        			$('.on-entry').addClass('hide');
        			$('.on-exit').removeClass('hide');
        			
        			$('.on-exit-switch').addClass('on');
        			$('.on-entry-switch').removeClass('on');
        			
        			$('ul.alert-list').addClass('exit-list').removeClass('entry-list');
        		}
        		//$('.alert-toggle span').toggleClass('on');
        		if (!$('.enabled-switch').hasClass('disabled') && enabled) {
	        		if ($('ul.alert-list li.on-exit').length > 0) {
	        			$('.add-new.on-exit').addClass('hide');
	        		}
	        		if ($('ul.alert-list li.on-entry').length > 4) {
	        			$('.add-new.on-entry').addClass('hide');
	        		}
        		} else {
        			$('.add-new.on-entry, .add-new.on-exit').addClass('hide')
        		}
        	});
            
            // delete geofence
        	$('.alert-list').on('click', '.delete', function(){
        		var $parent = $(this).parents('li');
        		if ($parent.hasClass('inactive')) return false;
        		
                var $delConfirmModal = $(".modal.notification-delete");
                $delConfirmModal.addClass("enabled");
                
                $(".cancel", $delConfirmModal).on('click', function () {
                    $delConfirmModal.removeClass("enabled");
                    $(this).unbind('click');
                });
                
                $(".highlighted.delete", $delConfirmModal).on('click', function () {
                	
            		var $removed = $parent.remove();
            		var isOnEntry = $removed.hasClass('on-entry');
            		
            		$removed.addClass('deleting');
                   	if (!$removed.hasClass('temp')) {
                   		deletedAlerts.push($removed);
                   		isDeleting = true;
                   	} else {
                   		isInserting = ($('.alert-list > li.temp').length > 0);
                   	}
                   	
                   	updatePendingList();
                   	$('.add-new' + ((isOnEntry) ? '.on-entry' : '.on-exit')).removeClass('hide');
                	$delConfirmModal.removeClass("enabled");
                	if ($('.alert-list > li').length < 2) $('.alert-list .delete').addClass('hide');           
                	$(this).unbind('click');
                 });
        	});        
            
        	// info window
        	$('.alert-list').on('click', '.overlay .button', function(){
        		if ($(this).parents('li').hasClass('inactive')) return false;
        		var index = $(this).parents('li').find('.edit').attr('data-index');
        		//$('.overlay .button').removeClass('active');
        		
        		if ($(this).hasClass('circle')) {
        			// switch to circle
        			if (!$(this).hasClass('active')){                			
        				$('.overlay .button').removeClass('active');
        				$(this).addClass('active');
        				var NE = rectangles[index].getBounds().getNorthEast();
            			var SW = rectangles[index].getBounds().getSouthWest();
            			var NW = new google.maps.LatLng(NE.lat(),SW.lng());
            			//console.log(google.maps)
            			radius = google.maps.geometry.spherical.computeDistanceBetween(NW, SW)/2;
            			center = rectangles[index].getBounds().getCenter();
            			rectangles[index].setMap(null);
            			drawCircle(center, radius, maps[index], index, true);
        			}
        			
        		} else {
        			if (!$(this).hasClass('active')){     
            			$('.overlay .button').removeClass('active');
            			$(this).addClass('active');
            			// switch to rectangle
            			bounds[index] = circles[index].getBounds();
            			circles[index].setMap(null);
            			drawRectangle(bounds[index], maps[index], index, true);
        			}
        		}
        	});
        	
        	// ADD geofence click event
        	$('.kh-button-submit, .kh-button-error').on('click', function(){
        		if ($(this).hasClass('disabled')) return false;
        		
        		// if master switch is changed, call on/off endpoint. Otherwise, build and send curfews
        		if (isMasterSwitch) {
        			loadState('submit');
        			$.when(module.updateMyCarZoneSettingEnabled("geofence")).done(function(){
        				loadState('pending');
	                }).fail(function(){
	                	$('body').addClass('show-error-button');
	                	loadState('error');
	                });
        		} else {
        			var $parent = $(this).parents('li');
            			var submitAlerts = true;
            			$('.alert-list li').each(function() {
            				var $parent = $(this);
            				var showValidation = false;
            				
            				$('.validation',$parent).addClass('hide');
            				var geoFenceNameString = $('.geofence-name',$parent).val();
                			if (XRegExp('^[^\\s][A-Za-z\\d\\s\\p{L}]+$').test(geoFenceNameString) == false || $.trim(geoFenceNameString).length == 0) {
                				$('.geofence-name-validation', $parent).removeClass('hide');
                				showValidation = true;
                			}
                				
                			if (showValidation) {
                				if ($parent.hasClass('closed')) $parent.removeClass('closed').addClass('open');
                				submitAlerts = false;
                			} 	
            			});
            			
            			if (submitAlerts) {
        					loadState('submit');
		            		$.when(sendGeoFence()).done( function(){
		            			loadState('pending');
		            		}).fail(function() {
		            			$('body').addClass('show-error-button');
		            			loadState('error');
		            		});
        				}
        		}
        	});
        	
        	// interval drop downs
            $(".dropdown", $('.alert-interval')).on('click', function () {
            	if ($('.alert-interval').hasClass('disabled')) return false;
            	$(".dropdown-menu", $('.alert-interval')).not($(this).next(".dropdown-menu").toggle()).hide();
            });
            
            $(".dropdown-menu li").on('click', function () {
            	var $this = $(this);
                $this.parent().hide().prev(".dropdown").text($this.text());
                if ($this.parent().parent('.interval-dropdown').attr('data-default') == $this.text()) {
                	isIntervalChanged = false;
                } else isIntervalChanged = true;
                updatePendingList();
            });

            // on text changed - update pending
        	$('.alert-list').on('change','.geofence-name', function() {
        		var $parent = $(this).parent().parent().parent('li');
        		checkRulesForModifiedData($parent);
        		$('.title',$parent).text($(this).val());
        	});

            /* close dropdowns if user hits escape */
            $(document).keyup(function (e) {
                if (e.which === 27) { // esc keycode
                    $(".dropdown-menu").hide();
                }
            });       
            
            // when turning master switch from off to on (initially is on);
            function toggleShapeFromOff($li) {
            	$li.each(function() {
            		if ($('.alert-switch', $(this)).hasClass('on')) {
            			toggleShape($(this),true);
            		}
            	});
            }
            
            // toggleMarker - enable/disables shape editting
            function toggleShape($li,editable) {
            	$li.each(function() {
            		var $parent = $(this);
            		var index = $('.edit',$parent).attr('data-index');
            		var isCircle = $('.circle.button',$parent).hasClass('active');
            		
            		if (isCircle) {
            			circles[index].editable = editable;
            			circles[index].draggable = editable;
            			circles[index].setMap(null);
            			circles[index].setMap(maps[index]);
            		} else {
            			rectangles[index].editable = editable;
            			rectangles[index].draggable = editable;
            			rectangles[index].setMap(null);
            			rectangles[index].setMap(maps[index]);
            		};
            	});
            }
            
            function checkRulesForModifiedData($rule) {
            	
            	var addNew = $rule.hasClass('temp');
            	
            	if (!addNew) {
	        		var modify = false;
	        		
	    			//check title
	    			if ($('.title', $rule).text() != $('.geofence-name', $rule).val()) modify = true;
	    			
	    			//check alert-switch
	    			if ($('.alert-switch', $rule).attr('data-default') == 'on' && !$('.alert-switch', $rule).hasClass('on')) modify = true;
	    			if ($('.alert-switch', $rule).attr('data-default') == 'off' && $('.alert-switch', $rule).hasClass('on')) modify = true;
	    			
	    			if (modify) $rule.addClass('modified');
	    			else        $rule.removeClass('modified');
	    			    			
	    			isModifying = ($('.alert-list li.modified').length > 0) || ($('.alert-list li.searched').length > 0);
	        		
	        		updatePendingList();
	            }
        	}
            
        	function sendGeoFence(){
        		        
        		var defer = new $.Deferred();

        		uvo.selectedVehicle().done(function (vehicle) {
            		
        			var $alerts = $('.alert-list li');
        				fences = [];
        			
        			// build delete payload first
        			for (var i in deletedAlerts) {
        				processFenceElement($(deletedAlerts[i]));
        			}
        			
        			// build rest of payload
        			$alerts.each(function() {
        				processFenceElement($(this));
        			});
                    
        			for (var i = 0; i < fences.length; i++) {
            			fences[i].geoFenceTime = parseInt($(".interval-dropdown").children(".dropdown").text());
            		}
        			
        			function processFenceElement($element) {
        				$parent = $element;
        				
        				var index = $('.edit', $parent).attr('data-index');
            			var fence = {  
        				      "geoFenceConfigId":null,
        				      "geoFenceId":parseInt(index) + 1,
        				      "active":"Y",
        				      "rectLeftLon":"",
        				      "rectLeftAlt":"",
        				      "action":"insert",
        				      "vin":vehicle.vin,
        				      "rectFenceType":"0",   
        				      "rectLeftLat":"",
        				      "geoFenceTime":5,
        				      "geoFenceTimeUom":"1",
        				      "rectLeftType":"",
        				      "rectRightLat":"",
        				      "rectRightLon":"",
        				      "rectRightAlt":"",
        				      "rectRightType":"",
        				      "circleFenceType":"0",
        				      "circleCenterLat":"",
        				      "circleCenterLon":"",
        				      "circleCenterAlt":"0",
        				      "circleCenterType":"1",
        				      "radius":"",
        				      "radiusUom":"2",
        				      "geoFenceName":""
        				   };

            			if (!$parent.hasClass('temp') || !$parent.hasClass('disabling')) {
            				fence.geoFenceName = $('.geofence-name',$parent).val();
    	            		if (typeof circles[index] !== 'undefined' && circles[index].getMap() != null){
    	            			fence.rectFenceType = 0;
    	            			fence.circleCenterLat = circles[index].getCenter().lat();
    	            			fence.circleCenterLon = circles[index].getCenter().lng();
    	            			fence.circleFenceType = $parent.hasClass('on-entry') ? 2 : 1;
    	            			fence.radius = circles[index].getRadius();
    	            			fence.radiusUom = 2;
    	            		} else {
    	            			var NE = rectangles[index].getBounds().getNorthEast();
    	            			var SW = rectangles[index].getBounds().getSouthWest();
    	            			var NW = new google.maps.LatLng(NE.lat(),SW.lng());
    	            			var SE = new google.maps.LatLng(SW.lat(),NE.lng());
    	            			fence.circleFenceType = 0;
    	            			fence.rectLeftLat = NW.lat();
    	            			fence.rectLeftLon = NW.lng();
    	            			fence.rectLeftAlt = 0;
    	            			fence.rectLeftType = 0;
    	            			fence.rectRightLat = SE.lat();
    	            			fence.rectRightLon = SE.lng();
    	            			fence.rectRightAlt = 0;
    	            			fence.rectRightType = 0;
    	            			fence.rectFenceType = $parent.hasClass('on-entry') ? 2 : 1;
    	            		}
    	            		
    	            		var action = 'insert';
                			if ($parent.hasClass('deleting')) action = 'delete';  
                			if ($parent.hasClass('disabling')) action = 'disable';
    	            		fence.action = action;
    	            		
    	            		fences.push(fence);
            			}
        			}
        			$('#a_normal span').text('');
        			
                    $.ajax("/ccw/kh/geoFenceAlertSettings.do", {
                        type : "POST",
                        data : {"geoFenceAlertPayload" : JSON.stringify(fences)}
                    }).done(function () {
                        defer.resolve();
                    }).fail(function(xhr, status, err){
                    	uvo.genericErrorHandler(xhr, status, err);
                    	defer.reject();
                    }).complete(function(){

                    });
        		});
        		return defer;
        	}
        	
        	function updateInterval(){
        		loadState('pending');
        		action = typeof action === 'undefined' ? 'insert' : action;
        		var defer = new $.Deferred();

        		uvo.selectedVehicle().done(function (vehicle) {
            		
        			$.each(settings, function(index){
	            		this.geoFenceTime = parseInt($(".interval-dropdown").children(".dropdown").text());
	            		this.geoFenceTimeUom = 1;
	            		this.action = 'insert';
        			});
                    
                    $.ajax("/ccw/kh/geoFenceAlertSettings.do", {
                        type : "POST",
                        data : {"geoFenceAlertPayload" : JSON.stringify(settings)}
                    }).done(function () {
                        defer.resolve();
                    }).fail(function(xhr, status, err){
                    	uvo.genericErrorHandler(xhr, status, err);
                    	$('.connect-msg').removeClass('hide');
                    	loadState('error');
                    	defer.reject();
                    });
                    console.log('/ccw/kh/geoFenceAlertSettings.do'+ geoFenceAlertPayload);
                    
            		
        		});
        		return defer;
        	}
        	
        	function drawMap($parent, value) {
        		var index = $('.edit', $parent).attr('data-index');
        		var ruleEnabled = $('.alert-switch',$parent).hasClass('on');
        		var editable = (!pending && enabled && ruleEnabled);
        		var $map = $gmap.clone(true);
        		$('.map-wrap',  $parent).prepend($map);
        		var mapOptions = new com.MapOptions();
                maps[index] = new gMaps.Map($map.get(0), mapOptions);
                bounds[index] = new gMaps.LatLngBounds();
                drawCircle(new gMaps.LatLng(0,0), 0, maps[index], index, editable);
                
        		drawRectangle(new gMaps.LatLngBounds(new gMaps.LatLng(0,0),new gMaps.LatLng(0,0)), maps[index], index, editable);
                if (value.rectFenceType == 0){
                	var center = new gMaps.LatLng(value.circleCenterLat, value.circleCenterLon);
                	var radius = distanceToMeters(value.radius, value.radiusUom);
            		// it's a circle
                	$('.button.circle', $parent).addClass('active');
                	rectangles[index].setMap(null);
                	bounds[index] = drawCircle(center, radius, maps[index], index, editable);
            	} else {
            		// it's a rectangle
            		bounds[index] = new gMaps.LatLngBounds();
            		var SE =  new gMaps.LatLng(value.rectRightLat, value.rectRightLon);
            		var NW =  new gMaps.LatLng(value.rectLeftLat, value.rectLeftLon);
            		var NE =  new gMaps.LatLng(NW.lat(), SE.lng());
            		var SW =  new gMaps.LatLng(SE.lat(), NW.lng());
            		bounds[index].extend(NE);
            		bounds[index].extend(SW);
            		
                	$('.button.rectangle', $parent).addClass('active');
                	drawRectangle(bounds[index], maps[index], index, editable);
                	circles[index].setMap(null);
            	}
                
                maps[index].fitBounds(bounds[index]);
        		return maps[index];
        	}
        	
        	function getLocation($parent) {
        		var defer = new $.Deferred();
        		var index = $('.edit', $parent).attr('data-index');
        		if (typeof circles[index] !== 'undefined' && circles[index].getMap() != null) {
        			center = circles[index].getCenter();
        		} else {
        			center = rectangles[index].getBounds().getCenter();
        		}
        		$.when(com.makeReverseGeocodeRequest(center.lat(), center.lng())).done(function(results){
        			
        			defer.resolve(results)
        		});
        		return defer;
        	}
        	
        	function getSize($parent) {
        		var index = $('.edit', $parent).attr('data-index');
        		if (typeof circles[index] !== 'undefined' && circles[index].getMap() != null) {
        			returnval = metersToMiles(circles[index].getRadius())+'mi radius';
        		} else {
        			var NE = rectangles[index].getBounds().getNorthEast();
        			var SW = rectangles[index].getBounds().getSouthWest();
        			var NW = new google.maps.LatLng(NE.lat(),SW.lng());
        			
        			returnval = metersToMiles(google.maps.geometry.spherical.computeDistanceBetween(NW, NE))+'mi x ';
        			returnval += metersToMiles(google.maps.geometry.spherical.computeDistanceBetween(NW, SW))+'mi';
        			//returnval = com.calcDistance(NW.lat(), NW.lng(), NE.lat, NE.lng()) + 'km x'
        			//returnval += com.calcDistance(NW.lat(), NW.lng(), SW.lat, SW.lng()) + 'km'
        		}
        		return returnval;
        	}
        	
        	function getParentFromDataIndex(index) {
        		var $parent;
        		$('.alert-list li .edit').each(function() {
        			if ($(this).attr('data-index') == index) $parent = $(this).parents('li'); 
        		});
        		return $parent;
        	}
        	
        	function drawCircle(center, radius, map, index, editable) {
        		
        	    circles[index] = new google.maps.Circle({
        		    center: center,
        		    radius: radius,
        		    editable: editable,
    			    draggable: editable,
        		    strokeColor: '#DE0014',
        		    fillColor: '#DE0014',
        		    fillOpacity: .2
        		});
        	    circles[index].setMap(map);  
        	    google.maps.event.addListener(circles[index], 'dragstart', function() { isDragging = true; });
        	    google.maps.event.addListener(circles[index], 'dragend', function(e) { 
        	    	var $parent = getParentFromDataIndex(index);
        	    	isDragging = false; 
        	    	$parent.addClass('searched'); 
        	    	checkRulesForModifiedData($parent); 
        	    });
        	    google.maps.event.addListener(circles[index], 'radius_changed', function() { 
        	    	var $parent = getParentFromDataIndex(index);
        	    	$parent.addClass('searched'); 
        	    	checkRulesForModifiedData($parent); });
        	    google.maps.event.addListener(circles[index], 'center_changed', function() {
        	    	if (!isDragging) { 
        	    		var $parent = getParentFromDataIndex(index);
        	    		$parent.addClass('searched'); 
        	    		checkRulesForModifiedData($parent); 
        	    	} 
        	    });
        	    return circles[index].getBounds();
        	}
        	
        	function drawRectangle(bounds, map, index, editable){
        		
    		    rectangles[index] = new google.maps.Rectangle({
    			    bounds: bounds,
    			    editable: editable,
    			    draggable: editable,
        		    strokeColor: '#DE0014',
        		    fillColor: '#DE0014',
        		    fillOpacity: .2
    			});
    		    rectangles[index].setMap(map);
    		    google.maps.event.addListener(rectangles[index], 'dragstart', function() { isDragging = true; });
        	    google.maps.event.addListener(rectangles[index], 'dragend', function() { 
        	    	var $parent = getParentFromDataIndex(index);
        	    	isDragging = false; 
        	    	$parent.addClass('searched'); 
        	    	checkRulesForModifiedData($parent); });
        	    google.maps.event.addListener(rectangles[index], 'bounds_changed', function() {
        	    	if (!isDragging) { 
        	    		var $parent = getParentFromDataIndex(index);
        	    		$parent.addClass('searched'); 
        	    		checkRulesForModifiedData($parent); 
        	    	}
        	    });
    		    return bounds;
        	}
        	
        	function getBrowserLocation(){
        		var defer = new $.Deferred();
        		if("geolocation" in navigator){
        		    navigator.geolocation.getCurrentPosition(function success(position){
        		        lat = position.coords.latitude;
        		        lng = position.coords.longitude;
        		        //console.log(lat, lng)
        		        defer.resolve(new google.maps.LatLng( lat, lng));    
        		        
        		    }, function(error){
        		    	//alert(error.code)
        		    	defer.reject(new google.maps.LatLng(39.87, -98.60 ));
        		    });
    		    } else {
    		    	defer.reject(new google.maps.LatLng(33.7159656, -117.79286259999998 ));
    		    }
        		return defer;
        	}
        	
        	function metersToMiles(dist){
        		dist = dist / 1609.34;
        		if (dist < 10) {
        			return Math.round(dist*100)/100;
        		} else if (dist <100){
        			return Math.round(dist*10)/10;
        		} else {
        			return Math.round(dist);
        		}
        	}
        	
        	function distanceToMeters(dist, type) {
        		switch(type){
        		case 0: // ft
        			dist = dist * 0.3048;
        			break;
        		case 1: // km
        			dist = dist * 1000;
        			break;
        		case 3: // mi
        			dist = dist * 1609.34;
        			break;
        		}
        		return parseInt(dist);
        	}
        },
        
        initPendingRefresh: function() {
        	var delay = 30000;
        	console.log('Initializing Pending Refresh...');
        	return setInterval(function(){window.location.reload();},delay);
        },
        
        clearPendingRefresh: function(interval) {
        	if(interval) {
        		console.log('Clearing Pending Refresh...')
        		clearInterval(interval);
        		interval = 0;
        	}
        }
    };

    uvo.setModuleReady("carZoneSettings", module);
}(window.uvo));