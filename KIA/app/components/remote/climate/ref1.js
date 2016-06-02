/*
Object {
remoteStartPayload: "{
"airCtrl":0,
"defrost":false,
"airTemp":{"value":"01H","unit":0},
"igniOnDuration":10
}",
vehicleStatusPayload: "{
"airCtrlOn":false,
"engine":false,
"doorLock":false…,
"defrost":false,
"lowFuelLight":true,
"acc":false
}"
}
*/


 $(".kh-button-submit, .kh-button-error").click(function(){
            	if ((!isPending && !$('.kh-button-submit').hasClass('disabled')) || !$('.kh-button-error').hasClass('hide')) {
            		isPending = true;
            		$pendingList.addClass('hide');
            		sendRemoteCommand(engineOn,$(this).hasClass('kh-button-error'));
            	}
        	});

 function sendRemoteCommand(isStart, isRetry) {
                uvo.showLoadingMessage("Sending command");
                loadState('pending');

                var payload = {};
                isStart = isRetry ? (gblRemoteStartPendingObject ? true : false) : isStart; 
                var url = isStart ? "/ccw/kh/remoteStart.do" : "/ccw/kh/remoteStop.do";
                
                if (isStart) {                	                	
                	 var pTemp = isRetry ? gblRemoteStartPendingObject.airTemp.value : module.toHexString(hvacTemp).toUpperCase() + "H";
                	 var pClimate = isRetry ?  (gblRemoteStartPendingObject.airCtrl == 1) : climateOn;
                	 var pDefrost = isRetry ? gblRemoteStartPendingObject.defrost : defrosterOn;
                	 
                	 var remoteControl = {
                         "airCtrl"      : pClimate ? 1 : 0,
                         "defrost"	    : pDefrost,
                         "airTemp"      : { 'value':pTemp, 'unit':0 },
                         igniOnDuration : 10
                     };
                     payload['remoteStartPayload'] = JSON.stringify(remoteControl);
                }
                payload['vehicleStatusPayload'] = JSON.stringify(com.vehicleStatus);

               
                $.ajax({
                    url  : url,
                    type : "POST",
                    data : payload
                }).done(function () {
                	
                }).fail(function(xhr, status, err) {                    	
                	uvo.genericErrorHandler(xhr, status, err);
                	loadState('error');
                });
                
                    /*var $delConfirmModal = $(".modal.notification-pending");
                    $delConfirmModal.addClass("enabled");
                    
                    $(".cancel", $delConfirmModal).on('click', function () {
                        $delConfirmModal.removeClass("enabled");
                    });*/                    
            }