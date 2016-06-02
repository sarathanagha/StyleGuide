'use strict';

module.exports = /*@ngInject*/ function($scope,$anchorScroll, $cookies, OverviewService, VehicleStatusService, $timeout, $state , 
		AwardsService, HighChartsUtilsService,DrivingActivityService, ClimateService,CarInfoService,ResolveService, MaintenanceService, StatusBarService) {

	var vm = this;
 
  vm.pageLoaded = false;


/*ResolveService.resolveMultiple([CarInfoService.getCarInfo])
    .then(function(data) {
     
     vm.data=data[0].selectedVehicle;
    });*/
// don't need this. It is being set when user selects a vehicle
// if(window.location.href.indexOf('gen1plus')>-1){
//  $cookies['gen'] ='gen1plus';
// }
// else{
// $cookies['gen'] ='kh';
// }
var _genType = $cookies['gen'];
	vm.moduleLoaded =false;

	function createCharts(infoData) {
      var data = infoData;
      //create bar chart for mileage
      var i = 0, xAxisCategories = [], barChartData = [], max = 0;
      for (i = 0; i < data.monthlyStat.length; i++) {
				  /* jshint undef:false */
          var month = moment(data.monthlyStat[i].month, 'M').format('MMM');
          xAxisCategories[i] = month;
          barChartData[i] = data.monthlyStat[i].milesDriven;
          if (barChartData[i] > max) { max = barChartData[i]; }
      }
      setTimeout(function(){
			HighChartsUtilsService.columnChart($('#chart'),xAxisCategories, barChartData, max);
      $scope.chartShow=true;
      $scope.$apply();

       },100);
      
      var current = data.monthlyStat[data.monthlyStat.length - 1];

      if(current.efficientScore ==  null ){
        current.efficientScore = 99;
        current.inefficientScore = 100 - current.efficientScore;
      }
			HighChartsUtilsService.drawSafetyScore($('.activity-metter .chart'), current.efficientScore, current.inefficientScore);
  }

VehicleStatusService.getVehicleStatus().then(function(data) {
      vm.vehicleStatus = data;
     
      var airTemp = vm.vehicleStatus.latestVehicleStatus.airTemp.value;
      //var airTemp = parseInt(vm.vehicleStatus.latestVehicleStatus.airTemp.value.replace('H',''), 16);
      vm.vehicleStatus.latestVehicleStatus.airTemp.displayValue = ClimateService.hexToValue(airTemp);
    });



  	function initKh() {

      StatusBarService.showLoadingStatus();
		OverviewService.getOverview().then(function(data) {
      
     
			vm.data = data;
       vm.month=getMonth(vm.data.monthlyStat[0].month);
			vm.current = data.monthlyStat[data.monthlyStat.length - 1];
      // setTimeout(function(){
       DrivingActivityService.drawDrivingScoreOverview(

          $('.doughnut-score .chart'), vm.current);
      //$scope.overviewShow=true;
     // $scope.$apply();

       //},100);
      
        
			//vm.moduleLoaded = true;

			createCharts(data);
      
		});

		VehicleStatusService.getVehicleStatus().then(function(data) {
      
			vm.vehicleStatus = data;
      
			var airTemp = vm.vehicleStatus.latestVehicleStatus.airTemp.value;
			//var airTemp = parseInt(vm.vehicleStatus.latestVehicleStatus.airTemp.value.replace('H',''), 16);
			vm.vehicleStatus.latestVehicleStatus.airTemp.displayValue = ClimateService.hexToValue(airTemp);
      ////vehicle status onload call
        vm.pageLoaded = true;
        vm.successCall= true;
        $timeout(function() {
          vm.successCall= false;
        }, 5000);
        StatusBarService.showSuccessStatus();
        vm.vehicleStatus = data;
        vm.vStatus = vm.vehicleStatus.timeStampVO.unixTimestamp;
      
      
      //vm.LatesStatus = moment(vm.vStatus).format('MMMM d y ' + ' h:mm a');
		});

		AwardsService.getLatestAward().then(function(data) {
			vm.latestAward = data;
		});
  	}
 ResolveService.resolveMultiple([MaintenanceService.getMileStones, MaintenanceService.getCompleteIgnoreInfo, CarInfoService.getCarInfo])
    .then (function(data) {   
      var processedData = MaintenanceService.processMilestones(data[0], data[1]);

      vm.milesToNextInterval = processedData.milesToNextInterval;
    });



  	function initGen1Plus() {

      OverviewService.getOverview1().then(function(data) {
        vm.data = data;
        vm.month=getMonth(vm.data.lastSyncMonth);
        vm.current = data.monthlyStat[0];
        vm.moduleLoaded = true;
        createCharts(data);
      });

      AwardsService.getLatestAward1().then(function(data) {
        vm.latestAward = data;
      });

      MaintenanceService.getMileStones().then(function(data) {
        vm.hasIntervals = data.length > 0;
      });
    }
function getMonth(index){
 
  var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return months[index];
}
    function initGen1() {
      
      OverviewService.getOverview1().then(function(data) {
        vm.data = data;
        vm.current = data.monthlyStat[data.monthlyStat.length - 1];
        vm.month=getMonth(vm.data.lastSyncMonth);
        vm.moduleLoaded = true;

        createCharts(data);
      });

      MaintenanceService.getMileStones().then(function(data) {
        vm.hasIntervals = data.length > 0;
      });

  	}
    angular.element(document).ready(function () {
      if (_genType === 'kh') {
        initKh();
      } 
      else if (_genType === 'gen1plus') {
        initGen1Plus();
      }
      else if (_genType === 'gen1') {
        initGen1();
      }
    });
  	

    vm.latestVehicleStatus=function(){
      StatusBarService.showLoadingStatus();
     VehicleStatusService.latestVehicleStatus().then(function(data){
      if(data.success == true){
        
        vm.vehicleStatus = data;
        vm.vStatus = vm.vehicleStatus.serviceResponse.timeStampVO.unixTimestamp;
        StatusBarService.clearStatus();
        $state.reload();
      }
      else{

        vm.unsuccessCall = true;
        
      }

    });

   }
  
  $anchorScroll(0);  
};