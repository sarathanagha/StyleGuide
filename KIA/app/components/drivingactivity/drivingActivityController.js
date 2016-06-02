'use strict';

module.exports = /*@ngInject*/ function($anchorScroll, $state, $scope, StatusBarService, DrivingActivityService,$location) {


  var vm = this;
  var drivingActivityLoaded = false, peakHoursLoaded = false;

  vm.moduleLoaded = false;

  //cursors
  vm.drivingScoreIndex  = 0;
  vm.hoursDrivenIndex = 0;
  vm.idleTimeIndex = 0;
  vm.averageSpeedIndex = 0;
  vm.mileageIndex = 'overall';

  vm.goToAwards = function() {
    $state.go('default.awards');
  };

  vm.drawMileage = function(index) {
    if (vm.drivingScoreIndex !== index) {
      if (index !== -1) { vm.mileageIndex = index; }

      DrivingActivityService.drawMileage(
        $('.mileage-chart .chart-container'), vm.activity.years[vm.mileageIndex], vm.activity.highMiles);
    }
  };

  vm.drawDrivingScore = function(index) {

    if (vm.drivingScoreIndex !== index) {
      if(vm.activity.monthlyStat[vm.drivingScoreIndex].efficientScore==undefined){
        vm.activity.monthlyStat[vm.drivingScoreIndex].efficientScore=99;
        


      }

      if (index !== -1) {
		  vm.drivingScoreIndex = index; 
       }       
        DrivingActivityService.drawDrivingScore(

          $('.doughnut .chart'), vm.activity.monthlyStat[vm.drivingScoreIndex]);     
      }
  };
  vm.incrementIndex = function(type,val) {
    var lastIndex = vm.activity.monthlyStat.length - 1;
    var index = vm[type] + val;
    if (index > lastIndex) { index = lastIndex; }
    else if (index < 0) { index = 0; }
    vm[type] = index;
  };

  function checkResolved() {
    if (drivingActivityLoaded && peakHoursLoaded) {
      StatusBarService.clearStatus();
    }
  }

  StatusBarService.showLoadingStatus();

  DrivingActivityService.getDrivingActivity().then(function(data) {

    vm.moduleLoaded = true;
    vm.activity = data;
    var avgspd=0;
    var totalidleTIme=0;
    var  latestMonth=0;
     var refrArr = [];
    angular.forEach(data.monthlyStat, function(value,i){
        if(refrArr.length !== 0){
            vm.checkFlag = true;
            for( var j =0; j< refrArr.length; j++){
              if( value.monthDisplay == refrArr[j].monthDisplay){
                vm.checkFlag = false;
              }
            }
            if( vm.checkFlag == true){
              refrArr.push(value);
            }
        }else{
          refrArr.push(value);
        }
    });
    vm.activity.monthlyStat = refrArr;
    angular.forEach(vm.activity.monthlyStat,function(v,k){
     if(v.month>latestMonth){
         latestMonth=v.month;

      }
      avgspd=avgspd+parseInt(v.aveSpeed);
      totalidleTIme=totalidleTIme+parseInt(v.idleTime)
     
    
    });
    
    var average=avgspd/vm.activity.monthlyStat.length
    vm.totalidleTIme=(totalidleTIme/3600);
    vm.totalidleTIme=vm.totalidleTIme.toFixed(1);
    if(isNaN(vm.totalidleTIme)){
vm.totalidleTIme = "0.0";
    }
    vm.latestMonth=latestMonth;
    
    vm.average=Math.ceil(average);
    vm.lastIndex = vm.activity.monthlyStat.length - 1;
    vm.averageSpeedIndex = vm.hoursDrivenIndex = vm.idleTimeIndex = 
      vm.drivingScoreIndex = (data.monthlyStat.length === 0) ? 0 : data.monthlyStat.length - 1;

      vm.drawMileage(-1);
      vm.drawDrivingScore(-1);
        
    drivingActivityLoaded = true;
    checkResolved();
  });

  DrivingActivityService.getDrivingPeakHours().then(function(data) {
    vm.peakHours = data.serviceResponse;

      DrivingActivityService.drawPeakDrivingHours($('.peak-chart'),vm.peakHours);

    peakHoursLoaded = true;
    checkResolved();
  });

  $anchorScroll(0);
};
