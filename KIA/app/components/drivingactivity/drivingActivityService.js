'use strict';

module.exports = /*@ngInject*/ function($q, HttpService, CommonUtilsService,$cookies,$location) {

  function drawMileage(el, data, highMiles) {
    var avg = isNaN(data.totalMiles) ? 0 : data.totalMiles / data.monthsIncluded;
    var months = data.months.slice();

    for (var i = 0; i < 12; i++) {
        if (months[i] > avg) {
            months[i] = {y : months[i], color : '#448CCB'};
        }       
        if(months[i] == undefined || isNaN(months[i])){
          months[i] = 0;
        }
    }

    var options = {
        title       : {floating : true, style : {display : 'none'}},
        credits     : {enabled : false},
        legend      : {enabled : false},
        tooltip     : {enabled : false},
        chart: {
            type: 'column',
            spacing: [20, 20, 20, 30],
            backgroundColor: 'transparent',
            height:150
        },
        plotOptions: {
            column: {
                pointWidth: 10
            }
        },
        xAxis: {
            gridLineColor : '#E1E1E1', title : {floating : true, style : {display : 'none'}},
            categories: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', ' '],
            tickLength: 0,

            label: {
                style: {
                    color: '#e1e1e1',
                    'font-size': '11px'
                }
            }
        },
        yAxis: {
            gridLineColor : '#E1E1E1',
            title: {
                floating: true,
                style: {
                    display: 'none'
                }
            },
            max: isNaN(highMiles) ? 0 : highMiles,
            tickInterval: Math.pow(10, highMiles.toString().length - 1) * 4,
            threshold: avg,
            gridLineDashStyle: 'shortdash',

            plotLines: [{
                value: avg,
                width: 1,
                color: '#676666',
                dashStyle: 'dash',
                zIndex: 3,
                label: {
                    text: 'AVG',
                    align: 'right',
                    x: -2,
                    style: {
                        color: '#676666'
                    }
                }
            }]
        },
        series: [{
            data: months.concat(0),
            color: '#7bb609'
        }]
    };

    el.highcharts(options);
  }



  function drawDrivingScore(el,data) {    
    var good = data.efficientScore;
    var bad = 100 - good;
    var series = [
          {
              name : '',
              data : [
                  {y : good, color : '#448CCB'},
                  {y : bad, color : '#E1E1E1'}
              ]
          }
    ];

    // Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'animate', function (proceed, init) {
    //   this.startAngleRad += Math.PI ;    
    //   proceed.call(this, init);    
    // });

    // draw highcharts
    var pieChart = el.highcharts({
        chart  : {
           type    : 'pie',
           spacing : [0, 0, 0, 0],
           backgroundColor: 'transparent',
           height:250
        },
        title       : '',
        legend      : {enabled : false},
        tooltip     : {enabled : false},
        credits     : {enabled : false},
        plotOptions : {
            pie    : {
                shadow      : false,
                dataLabels  : {enabled : false},
                borderWidth : 0,
                innerSize   : '113%',
                startAngle  : 0
            },
            series : {
                states : {
                    hover : {
                        enabled : false
                    }
                }
            }
        },
        series      : series
     });    
  }
   function drawDrivingScoreOverview(el,data) {    
    var good = data.efficientScore;
    var bad = 100 - good;
    var series = [
          {
              name : '',
              data : [
                  {y : good, color : '#448CCB'},
                  {y : bad, color : '#E1E1E1'}
              ]
          }
    ];

    // Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'animate', function (proceed, init) {
    //   this.startAngleRad += Math.PI ;    
    //   proceed.call(this, init);    
    // });

    // draw highcharts
    var pieChart = el.highcharts({
        chart  : {
           type    : 'pie',
           spacing : [0, 0, 0, 0],
           backgroundColor: 'transparent',
           height:100
        },
        title       : '',
        legend      : {enabled : false},
        tooltip     : {enabled : false},
        credits     : {enabled : false},
        plotOptions : {
            pie    : {
                shadow      : false,
                dataLabels  : {enabled : false},
                borderWidth : 0,
                innerSize   : 85,
                startAngle  : 0
            },
            series : {
                states : {
                    hover : {
                        enabled : false
                    }
                }
            }
        },
        series      : series
     });    
  }

  function drawPeakDrivingHours(el, data) {
    var offset = CommonUtilsService.getOffsetValue();

    var hourList = data[0];

    var byHour = [];
    var offsetHrList = [];

    var hr,h;
    var hrMax = 0;
    
    if(offset && parseInt(offset) !== 0)
    {
      for (hr = 0; hr < 24; hr++) {
          // Removing the offset
          h = hr + parseInt(offset);
          if (h < 0)
              {offsetHrList['hr' + parseInt(24 + parseInt(h)) + 'SECOND'] = hourList['hr' + hr + 'SECOND'];}
          if (h > 23)
              {offsetHrList['hr' + parseInt(parseInt(h) - 24) + 'SECOND'] = hourList['hr' + hr + 'SECOND'];}
          if (h >= 0 && h <= 23)
              {offsetHrList['hr' + parseInt(h) + 'SECOND'] = hourList['hr' + hr + 'SECOND'];}
        }
    }

    if (offset && parseInt(offset) !== 0) {
        for (hr = 0; hr < 24; hr++) {
            // we want to display in order of 6am -> 5am
            h = (hr >= 18) ? (hr - 18) : (hr + 6);
            byHour[hr] = offsetHrList['hr' + h + 'SECOND'];
            hrMax = Math.max(hrMax, byHour[hr]);
        }
    } else {
        for (hr = 0; hr < 24; hr++) {
            // we want to display in order of 6am -> 5am
            h = (hr >= 18) ? (hr - 18) : (hr + 6);
            byHour[hr] = hourList['hr' + h + 'SECOND'];
            hrMax = Math.max(hrMax, byHour[hr]);
        }
    }


    var chartOptions = {
      chart       : {
          type : 'spline',
          spacing: [20, 5, 15, 5],
          backgroundColor : 'transparent'
      },
      xAxis       : {
          gridLineColor : '#E1E1E1', 
          title : {floating : true, style : {display : 'none'}},
          tickPositions : [0, 11, 23],
          tickColor : '#FFFFFF',

          labels        : {
              //overflow: false,
              x: 0,
              style : {
                  'font-size': '10px',
                  'letter-spacing': '1px'
              },
              formatter : function () {    
                var hr = (this.value > 17) ? (this.value - 18) : (this.value + 6);     
                  return moment(hr, 'H').format('[<strong>]h[</strong>]a');
              }
          }
      },
      title       : {floating : true, style : {display : 'none'}},
      plotOptions: {
        series: {
            states: {
                hover: {
                    enabled: false
                }
            }
        },
        spline: {
            marker: {
                enabled: false
            },
            color: '#c4172c'
        }
      },
      credits     : {enabled : false},
      legend      : {enabled : false},
      tooltip     : {enabled : false},
      yAxis       : {
          gridLineColor : '#E1E1E1', title : {floating : true, style : {display : 'none'}},
          min          : 0,
          max : (hrMax >= 4) ? null : 4,
          tickInterval : (hrMax >= 4) ? hrMax / 4 : 1,                        
          endOnTick    : false,
          labels       : {
              enabled: false,
             // floating : true,
              style    : {display : 'none'}
          }
      },
      series      : [
          {
              data      : byHour,
              lineWidth : 5
          }
      ]
    };

    // draw highcharts
    el.highcharts(chartOptions);
  }


  function processMonthlyStats(data) {
    var i;
    var years = {
      'overall' : new Year()
    };
    years.overall.key = 'overall';
    var sixMonthsBack = moment().subtract('months', 6);
    var highMiles = 0;
    var totalIdle = 0.0;
    var monthMap = 
    {
      1 : 'JAN',
      2 : 'FEB',
      3 : 'MAR',
      4 : 'APR',
      5 : 'MAY',
      6 : 'JUN',
      7 : 'JUL',
      8 : 'AUG',
      9 : 'SEP',
      10: 'OCT',
      11: 'NOV',
      12: 'DEC'
    };
   var totalidleTIme=0;

    for (i = 0; i < data.monthlyStat.length; i++) {

      var date = moment(data.month + '/' + data.dayCount + '/' + data.year, 'M/D/YYYY');
      

    data.monthlyStat[i].monthDisplay = monthMap[data.monthlyStat[i].month];
      data.monthlyStat[i].hrsDrivenDisplay = formatHours(data.monthlyStat[i].secsDriven);
     
     
      data.monthlyStat[i].idleTimeDisplay = formatHours(data.monthlyStat[i].idleTime);

     
      if (date.isAfter(sixMonthsBack)) {
        categorizeYears(data.monthlyStat[i]);
      } else {
        delete data.montlyStat[i];
      }

    }
   

    function categorizeYears(data) {

      if (years.overall.months[data.month - 1] === 0) {
          years.overall.monthsIncluded++;
      }

      years.overall.months[data.month - 1] += data.milesDriven;
      years.overall.totalMiles += data.milesDriven;

      if (!years[data.year]) { years[data.year] = new Year(); years[data.year].key = data.year; }
      years[data.year].months[data.month - 1] = data.milesDriven;
      years[data.year].totalMiles += data.milesDriven;
      years[data.year].monthsIncluded++;
      years[data.year].highMiles = Math.max(years[data.year].highMiles, data.milesDriven);
      highMiles = Math.max(highMiles, years[data.year].highMiles);
      totalIdle += data.idleTime/3600.0;
    }

    function Year() {
      return {
        totalMiles : 0,
        months : [0,0,0,0,0,0,0,0,0,0,0,0],
        monthsIncluded : 0,
        highMiles : 0,
        key:''
      };
    }

    // post processing data
    data.years = years;
    data.highMiles = highMiles;

    return data;
  }

  function formatHours(secs) {
    var hours = secs/3600.0;
    var hrsDriven = '0.1';
    if (hours > 999.9) {hrsDriven = '999.9';}
    else if (hours > 0.0) {
      var hrsStr = hours.toString();
      if (hrsStr.indexOf('.') !== -1) {hrsDriven = hrsStr.substring(0,hrsStr.indexOf('.') + 2);}
      else {hrsDriven = hrsStr + '.0';}
    }
    if ((hours > 0 && hours < 0.1) || (hours === 0 && secs > 0))
      {hrsDriven = '0.1';}

    return hrsDriven;
  }

  return {
    getDrivingActivity: function() {
      var deferred = $q.defer();
      if( $location.path().indexOf("kh")>-1){
         var _genType =$cookies['gen'];
     
      }else{
      }
     
       
if (_genType === 'kh') { 
         HttpService.get('/ccw/kh/drivingActivity.do').success(function(data) {
        deferred.resolve(processMonthlyStats(data));
      });
          }
          else 
          {

        HttpService.get('/ccw/cp/drivingActivityInfo.do').success(function(data) {
        data.monthlyStat.reverse();
        deferred.resolve(processMonthlyStats(data));
      });
     }
      return deferred.promise;
    },
    getDrivingPeakHours: function() {
      var deferred = $q.defer();
      HttpService.get('/ccw/kh/drivingPeakHours.do').success(function(data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    },
    drawPeakDrivingHours: function(el, data) {
      drawPeakDrivingHours(el,data);
    },
    drawDrivingScore: function(el,data) {
      drawDrivingScore(el,data);
    },
    drawDrivingScoreOverview: function(el,data) {
      drawDrivingScoreOverview(el,data);
    },
    drawMileage: function(el,data,highMiles) {
      drawMileage(el,data,highMiles);
    }
  };
};
