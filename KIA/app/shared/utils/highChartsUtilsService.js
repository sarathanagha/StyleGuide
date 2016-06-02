'use strict';

module.exports = /*@ngInject*/ function() {

  this.columnChart = function($el, cats, data, max) {
      $el.highcharts({
          chart   : {
              type   : 'column',
              height : 150},
          title   : {text : ''},
          xAxis   : {categories : cats },
          yAxis   : {title : {text : 'Miles'},
              type         : 'linear',
              min          : 0,
              max          : (max) ? max : 1
          },
          series  : [
              {data : data}
          ],
          credits : {enabled : false},
          legend  : {enabled : false},
          tooltip : {enabled : false}});
  };

  this.drawSafetyScore = function($el, good, bad) {
    var series = [
        {
            name : '',
            data : [
                {y : good, color : '#448CCB'},
                {y : bad, color : '#E1E1E1'}
                
            ]

        }
    ];
    //  Highcharts to provide counter-clockwise animation for pies
       Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'animate', function (proceed, init) {
        this.startAngleRad=1.798;
        this.startAngleRad += Math.PI;    
        proceed.call(this, init);    
    });
    $el.highcharts({
        chart  : {
            type    : 'pie',
            spacing : [0, 0, 0, 0],
            backgroundColor: 'transparent',
            height  : 100,
            width   : 100,
						//style   : {'top' : '10px', 'left' : '10px' }
        },
        title  : {floating : true, enabled : false, style : {'display' : 'none'}},

        plotOptions : {
						pie    : {
											shadow      : false,
											dataLabels  : {enabled : false},
											borderWidth : 0,
                      size        : 95,
											innerSize   : 90,
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
        credits     : {enabled : false},
        legend      : {enabled : false},
        tooltip     : {enabled : false},
        yAxis       : {
            labels : { enabled : false }

        },
        xAxis       : {
            labels : { enabled : false }

        },
        series      : series
    });
  };

};
