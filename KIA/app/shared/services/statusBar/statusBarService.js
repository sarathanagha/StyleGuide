'use strict';

module.exports = /*@ngInject*/ function($rootScope, $timeout) {
	
	$rootScope.pageStatus = '';
	$rootScope.pageStatusMessage = '';
	return {
		showLoadingStatus : function() {
			$rootScope.pageStatus = 'processing';
		},
		Inprogress:function(){
        	$rootScope.inprogress=true;
		},
		showSuccessStatus : function(msg) {
			$rootScope.pageStatus = 'success';
			$rootScope.inprogress=false;
			var self = this;
			$timeout(function() {
				self.clearStatus(true);
			}, 5000);
			$rootScope.pageStatusMessage = msg;
		},
		showErrorStatus : function(msg) {
			$rootScope.pageStatus = 'error';
			$rootScope.inprogress=false;
			/*var self = this;
			if(msg !== "typeEV" ){
				$timeout(function() {
					self.clearStatus(true);
				}, 5000);
			}*/
			
			$rootScope.pageStatusMessage = msg;
		},
		clearStatus : function(persistMessage) {
			$rootScope.pageStatus = '';	
			if (!persistMessage) { $rootScope.pageStatusMessage = ''; }
			$rootScope.inprogress=false;
		},
		getStatus : function() {
			return $rootScope.pageStatus;
		}
	};
};