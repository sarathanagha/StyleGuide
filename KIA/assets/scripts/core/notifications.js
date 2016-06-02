(function (uvo) {

    var com = uvo.common, uTypes = uvo.dataTypes;
    var ENDPOINT_URL = "/ccw/cp/notificationMessages.do";
    var msgTypes = {
        AWARDS      : "awards",
        DIAGNOSTICS : "dtc",
        MAINTENANCE : "maintenance",
        OILCHANGE   : "oil",
        CURFEW      : "curfew",
        SPEED       : "speed",
        GEOFENCE    : "geofence"
    };

    //uncomment to enable retrieving notifications
    //uvo.addEarlyInit(uvo.simpleRouteFactory("notifications", ENDPOINT_URL, /./));

    var pagesToNotificationTypes = {};
    pagesToNotificationTypes[msgTypes.AWARDS] = /awards/i;
    pagesToNotificationTypes[msgTypes.DIAGNOSTICS] = /mntnNotiList/i;
    pagesToNotificationTypes[msgTypes.MAINTENANCE] = /mntnNotiList/i;
    pagesToNotificationTypes[msgTypes.OILCHANGE] = /mntnNotiList/i;
    pagesToNotificationTypes[msgTypes.CURFEW] = /curfewAlerts/i;
    pagesToNotificationTypes[msgTypes.SPEED] = /speedAlerts/i;
    pagesToNotificationTypes[msgTypes.GEOFENCE] = /geofenceAlerts/i;

    var typeInfo = {};
    typeInfo[msgTypes.AWARDS] = {
        title       : "Awards",
        description : "You've earned %n awards.",
        singular    : "You've earned an award.",
        link        : "/ccw/cp/awards.do?fromNotif=Y"
    };
    typeInfo[msgTypes.DIAGNOSTICS] = {title : "Diagnostics", link: "/ccw/omn/mtn/mntnNotiList.do?vehType=kh&fromNotif=Y"}; //fill the rest of these out similar to awards
    typeInfo[msgTypes.MAINTENANCE] = {title : "Maintenance", link: "/ccw/omn/mtn/mntnNotiList.do?vehType=kh&fromNotif=Y"};
    typeInfo[msgTypes.OILCHANGE] = {title : "Oil Change", link: "/ccw/omn/mtn/mntnNotiList.do?vehType=kh&fromNotif=Y"};
    typeInfo[msgTypes.CURFEW] = {title : "Curfew", link: "/ccw/cp/curfewAlerts.do?fromNotif=Y"};
    typeInfo[msgTypes.SPEED] = {title : "Speed", link: "/ccw/cp/speedAlerts.do?fromNotif=Y"};
    typeInfo[msgTypes.GEOFENCE] = {title : "Geo Fence", link: "/ccw/cp/geofenceAlerts.do?fromNotif=Y"};

    var mod = {
        markRead : function () {
            var pathName = window.location.pathname;
            var someMatched = true;
            var payload = false;
            $.each(pagesToNotificationTypes, function (msgType, regex) {
                if (regex.test(pathName)) {
                    payload = payload || {};
                    payload[msgType] = 0;
                }
            });

            if (payload) {
                $.ajax(ENDPOINT_URL, {
                    type : "POST",
                    data : payload
                });
            }
        }
    };

    mod.init = function init() {
        //uvo.dataRequest("notifications")
        //$.when({"awards": 1, "dtc": 2})
        //$.when(userNotifications)
        //.done(function (notificationData) {
    	$.get('/ccw/com/notificationsJSON.do', function(notificationData) {
    		console.log(notificationData);
            var notifications = notificationData || {};
            var pathName = window.location.pathname;
            var notiCount = 0;
            var $list = $("#notification-dropdown .dropdown-detail");
            var $baseItem = $list.find(".item").remove().first();

            $.each(pagesToNotificationTypes, function (msgType, regex) {
                /*if (regex.test(pathName)) {
                    notificationData[msgType] = 0;
                }*/

                var num = parseInt(notificationData[msgType]) || 0;
                notiCount += num;

                if (num !== 0) {
                    var $item = $baseItem.clone();
                    var description = typeInfo[msgType].description || "You have %n %t notifications";
                    if (num === 1 && typeInfo[msgType].singular) {
                        description = typeInfo[msgType].singular;
                    }

                    //description = description.replace("%n", com.numberToWords(num));
                    description = description.replace("%n", num);
                    description = description.replace("%t", typeInfo[msgType].title);

                    $(".title", $item).text(typeInfo[msgType].title);
                    $(".info", $item).text(description);
                    if (typeInfo[msgType].link){
                        $item.click(function (){
                            //navigate to correct page
                    		console.log(typeInfo[msgType]);
                    		location.href = typeInfo[msgType].link;
                    	});
                    }

                    $list.append($item);
                }
            });

            var remoteCmndObj = notifications.remoteCommands ? notifications.remoteCommands : false;
            
            if (notiCount !== 0 || remoteCmndObj) {
                $("#notification-dropdown > .notification").removeClass("hide").text(notiCount);
                $("#notification-dropdown > .dropdown-detail .info-notifications").hide();
            }
            if (notiCount == 1 || remoteCmndObj) {
                $("#notification-dropdown > .arrow").text('NOTIFICATION');
            }
            
            if(remoteCmndObj){
            	var scnName = remoteCmndObj.scenarioName;
            	var status = remoteCmndObj.status;
            	if(status == 'Z'){
            		$("#notification-dropdown > .dropdown-detail .successCommand").removeClass("hide");                  			
        		}
        		if(status == 'E'){
        			$("#notification-dropdown > .dropdown-detail .failCommand").removeClass("hide");
        		}
            	
            	if(scnName == "REMOTE START (WITH CLIMATE)" || scnName == "REMOTE START"){
            		if(status == 'Z'){
            			$("#notification-dropdown > .dropdown-detail .start-success").removeClass("hide");                  			
            		}
            		if(status == 'E'){
            			$("#notification-dropdown > .dropdown-detail .start-fail").removeClass("hide");
            		}
            	}
            	if(scnName == "REMOTE CONTROL STOP"){
            		if(status == 'Z'){
            			$("#notification-dropdown > .dropdown-detail .stop-success").removeClass("hide");
            		}
            		if(status == 'E'){
            			$("#notification-dropdown > .dropdown-detail .stop-fail").removeClass("hide");
            		}
            	}
            	if(scnName == "REMOTE DOOR UNLOCK"){
            		if(status == 'Z'){
            			$("#notification-dropdown > .dropdown-detail .unlock-success").removeClass("hide");
            		}
            		if(status == 'E'){
            			$("#notification-dropdown > .dropdown-detail .unlock-fail").removeClass("hide");
            		}
            	}
            	if(scnName == "REMOTE DOOR LOCK"){
            		if(status == 'Z'){
            			$("#notification-dropdown > .dropdown-detail .lock-success").removeClass("hide");
            		}
            		if(status == 'E'){
            			$("#notification-dropdown > .dropdown-detail .lock-fail").removeClass("hide");
            		}
            	}
            }
        });
    };

    //uncomment to enable notifications menu
    $(document).ready(mod.init.bind(mod));

    //uncomment to enable marking as read
    //mod.markRead();

    uvo.setModuleReady("notifications", mod);
}(window.uvo));