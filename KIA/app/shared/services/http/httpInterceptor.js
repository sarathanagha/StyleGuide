'use strict';

module.exports = /*@ngInject*/ function($cookieStore) {
    var hasErrored = false; // if response returns javascript for session timeout, use this flag to only display it once    
	var responseInterceptor = {
        response: function(response) {
           
            if (typeof response.data === 'string' && 
                response.data.indexOf('logOut.do') === -1 &&
                response.data.indexOf('<SCRIPT LANGUAGE="JavaScript">') !== -1 && 
                !hasErrored) {
                
                $cookieStore.remove('vin');
                $cookieStore.remove('gen');
                document.cookie = "emailAddress=; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.myuvo.com; path=/";
                $cookieStore.remove('emailAddress'); //$cookieStore not removing it as we are using Angularjs old version.
                $cookieStore.remove('JE');
                $cookieStore.put('expires','Thu, 01 Jan 1970 00:00:01 GMT');
                $cookieStore.put('domain','.myuvo.com');
                $cookieStore.put('path','/');
                //document.cookie = 'vin=;gen=;emailAddress' + '=; expires=;' + (';domain=; path=/');
                //var dataString = response.data;                
                //dataString = dataString.replace(/\.\.\//g,'/ccw');

                var dataString = 
                    '<script language="JavaScript">'+
                    'alert("Session expired.");'+
                    'window.location = "/ccw"'+
                    '</script>'
                    ;

                $('body').append(dataString);
                hasErrored = true;            
            } else {
                return response;

            }
        },
        responseError: function(response) {
            
            if (response.status === 440) {
                document.cookie = 'vin=;gen=;emailAddress' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' + (';domain=.myuvo.com; path=/');
            	window.location.href = '/ccw/';
            }
            return response;
        },
        getErrorFlag : function() {
            return hasErrored;
        }
    };
    return responseInterceptor;
};