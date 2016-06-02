(function (uvo) {
    if (!uvo) {
        throw new Error("Make sure you include libraries after uvo, not before!");
    }

    uvo.drawSafetyScore = function drawSafetyScore($el, good, bad) {
        var series = [
            {
                name : '',
                data : [
                    {y : bad, color : '#E1E1E1'},
                    {y : good, color : '#448CCB'}
                ]

            }
        ];

        $el.highcharts({
            chart  : {
                type    : 'pie',
                spacing : [0, 0, 0, 0],
                height  : 230,
                width   : 230,
                style   : {"top" : "-10px", "left" : "-10px" }
            },
            labels : {
                items : [
                    {
                        html  : "<div>" + good + "</div>",
                        style : {
                            "font-size" : "103px",
                            "color"     : "#000000",
                            "left"      : "53px",
                            "top"       : "142px"
                        }
                    },
                    {
                        html  : "/100",
                        style : {
                            "top"       : "168px",
                            "left"      : "95px",
                            color       : "#CCCCCC",
                            "font-size" : "13px"
                        }
                    }
                ],
                style : {
                    "font-family" : "'designk-light', 'Helvetica Neue', Helvetica, Arial, sans-serif"
                }
            },
            title  : {floating : true, enabled : false, style : {"display" : "none"}},

            plotOptions : {
                pie    : {
                    shadow      : false,
                    dataLabels  : {enabled : false},
                    borderWidth : 0,
                    size        : 218,
                    innerSize   : 193,
                    startAngle  : 15
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
    
    var com = uvo.common, uTypes = uvo.dataTypes;

    var module = {};

    function drawSafetyScore(period) {
        uvo.drawSafetyScore($('#doughnut'), period.efficientScore, period.inefficientScore);
    }

    function milestoneClick(period) {
        $(this).addClass("active");
        $(".milestone-container .milestone").not($(this)).removeClass("active");
        drawSafetyScore(period);
    }

    function activateMilestone(period, index) {
        var $milestone = $(".milestone-container .milestone").eq(index);
        $milestone.removeClass("hide");
        $milestone.children(".miles").text(period.efficientScore);
        $milestone.children(".date").text(period.moment.format("MMM").toUpperCase());
        
        if (index == 0){
        	$milestone.addClass("active");
        }else {
        	$milestone.removeClass("active");
        }
        $milestone.click(milestoneClick.bind($milestone, period));
    }

    module.init = function () {

        /*
        var fakePeriods = [];
        var fp, score, carMiles = 0;
        for (var i = 15; i > 0; i--) {
            score = Math.round(60 * Math.random() + 39);
            fp = new uTypes.StatPeriod({
                year             : 2013 + Math.floor((i + 2) / 12),
                month            : i > 9 ? (i % 9) : i + 3,
                hrsIdle          : i * Math.random(),
                efficientScore   : score,
                inefficientScore : 100 - score,
                aveSpeed         : Math.round(40 + 40 * Math.random()),
                awardCount       : 1,
                aveAccel         : Math.round(50 * Math.random()),
                hrsDrivenDisp    : Math.round(Math.random() * 24 * 28).toString(),
                milesDriven      : Math.round(500 * Math.random() + 400),
                aveMph           : Math.round(40 + 40 * Math.random()),
                dayCount         : Math.round(28 * Math.random())
            });
            fakePeriods[15 - i] = fp;
            carMiles += fp.milesDriven;
        }

        $.when({
            monthlyStat    : fakePeriods,
            currentMileage : carMiles
        }).done(function (data) {
        // */

        ///*
        uvo.dataRequest("drivingActivity").done(function (driveStats) {
            //*/
            $("body").show();
            var mileage = driveStats.currentMileage,
                $mileageByYear = $("#mileage-by-year"),
                $yearsList = $("ul.years-container"),
                $year = $yearsList.children(".active").removeClass("active").remove(),
                periods = driveStats.monthlyStat,
                highMiles = 0, totalIdle = 0, years = {}, sixMonthAverages = [];            	

            if(!periods.length) {
                periods[0] = new uTypes.StatPeriod();
                
            }
            awardCount = periods[periods.length-1].awardCount;
            var sixMonthsBack = moment().subtract("months", 6);

            function addYearLink(year) {
                var $link = $year.clone();

                $link.children().text(year);
                $link.click(function () {
                    $yearsList.find(".active").removeClass("active");
                    $link.addClass("active").children().addClass("active");
                    doMileageByYear(year);
                    return false;
                });

                $yearsList.prepend($link);
            }

            var Year = function (val) {
                this.value = val;
                this.totalMiles = 0;
                this.monthsIncluded = 0;
                this.highMiles = 0;
                this.milesByMonth = com.arrayFill(0, 12);
            };

            Year.prototype.valueOf = function valueOf() {
                return this.value;
            };

            years.OVERALL = new Year('OVERALL');
            addYearLink('OVERALL');

            $.each(periods, function (index, period) {
                if (!years[period.year]) {
                    years[period.year] = new Year(period.year);
                    addYearLink(period.year);
                }
                var year = years[period.year];

                if (period.moment.isAfter(sixMonthsBack)) {
                    sixMonthAverages.push(period.aveSpeed);
                }

                if (index > 1) {
                    activateMilestone(period, (5-index));
                }

                if (years.OVERALL.milesByMonth[period.month - 1] === 0) {
                    years.OVERALL.monthsIncluded++;
                }

                years.OVERALL.milesByMonth[period.month - 1] += period.milesDriven;
                years.OVERALL.totalMiles += period.milesDriven;

                year.milesByMonth[period.month - 1] = period.milesDriven;
                year.totalMiles += period.milesDriven;
                year.monthsIncluded++;
                year.highMiles = Math.max(year.highMiles, period.milesDriven);
                highMiles = Math.max(highMiles, year.highMiles);
                totalIdle += period.hrsIdle;
                
            });
            $yearsList.children().not(".hide").last().addClass("active").children().addClass("active");

            drawSafetyScore(periods[periods.length-1]);

            var oldest = periods[0];
            $(".idle-time .w-footer strong").text(oldest.moment.format("M/YYYY"));
            $(".idle-time .amount.day").prepend(Math.round(totalIdle));

            var sumSixMonthSpeed = 0;
            sixMonthAverages.map(function (cVal) {
                sumSixMonthSpeed += cVal;
            });
            $(".average-speed .amount").text(Math.round(sumSixMonthSpeed / (sixMonthAverages.length || 1)) || "--");
            $(".awards .amount, .awards .w-footer strong").text(awardCount);

            $(".mileage .amount").text(mileage.toLocaleString().replace(/\.\d\d$/, ""));

            function doMileageByYear(year) {

                var avg = years[year].totalMiles / years[year].monthsIncluded;
                var months = years[year].milesByMonth.slice();

                for (var i = 0; i < 12; i++) {
                    if (months[i] > avg) {
                        months[i] = {y : months[i], color : "#448CCB"};
                    }
                }

                uvo.lazyChart($mileageByYear, {
                    chart       : {
                        type    : 'column',
                        spacing : [20, 20, 20, 30]
                    },
                    plotOptions : {
                        column : {
                            pointWidth : 10
                        }
                    },
                    xAxis       : {
                        categories : ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', ' '],
                        tickLength : 0,

                        label : {
                            style : {
                                color       : "#e1e1e1",
                                "font-size" : "11px"
                            }
                        }
                    },
                    yAxis       : {
                        title             : {floating : true, style : {display : 'none'}},
                        max               : highMiles,
                        tickInterval      : Math.pow(10, highMiles.toString().length - 1) * 4,
                        threshold         : avg,
                        gridLineDashStyle : 'shortdash',

                        plotLines : [
                            {
                                value     : avg,
                                width     : 1,
                                color     : "#676666",
                                dashStyle : 'dash',
                                zIndex    : 3,
                                label     : {
                                    text  : 'AVG',
                                    align : "right",
                                    x     : -2,
                                    style : {
                                        color : "#676666"
                                    }
                                }
                            }
                        ]
                    },
                    series      : [
                        {
                            data  : months.concat(0),
                            color : "#7bb609"
                        }
                    ]
                });
            }

            $yearsList.children(".active").click();

            var $leftArrow = $(".date-link .left-arrow").click(function () {
                hoursDriving(!$(this).hasClass("deactivated"));
                return false;
            });

            var $rightArrow = $(".date-link .right-arrow").click(function () {
                hoursDriving(-1 * !$(this).hasClass("deactivated"));
                return false;
            });

            var hoursDrivingPeriod = 0;

            function hoursDriving(shift) {
            	
                hoursDrivingPeriod += shift;
                $rightArrow.removeClass("deactivated");
                $leftArrow.removeClass("deactivated");
                if (hoursDrivingPeriod === 0) {
                    $rightArrow.addClass("deactivated");
                }
                if (hoursDrivingPeriod === periods.length - 1) {
                    $leftArrow.addClass("deactivated");
                }
                if (!periods.length) {
                    $leftArrow.off('click');
                    $rightArrow.off('click');
                }

                var period = periods[hoursDrivingPeriod];
                var pMoment = moment(period.month + "/" + period.year, "M/YYYY");
                $(".date-link span").html(pMoment.format("[<strong>]MMM[</strong>] YYYY").toUpperCase());
                $(".hours-driving .amount").text(Math.round(period.hrsDriven));

            }

            hoursDriving(5);

        }).fail(uvo.genericErrorHandler);

        if($("#peak-hours").size()){
            uvo.dataRequest("getPeakHours").done(function (data) {
                var hourList = data[0];

                var byHour = [];

                var hr;
                var hrMax = 0;
                
                for (hr = 0; hr < 24; hr++) {
					// we want to display in order of 6am -> 5am
					var h = (hr >= 6) ? (hr - 6) : (hr + 18);

					byHour[hr] = hourList["hr" + h + "SECOND"];
					hrMax = Math.max(hrMax, byHour[hr]);
				}

                console.log('byHour',byHour);

                uvo.lazyChart($("#peak-hours"), {
                    chart       : {
                        type : 'spline',
                        spacing: [20, 5, 15, 5]
                    },
                    xAxis       : {
                        tickPositions : [0, 11, 23],
                        tickColor : "#FFFFFF",

                        labels        : {
                            //overflow: false,
                            x: 0,
                            style : {
                                "font-size": "10px",
                                "letter-spacing": "1px"
                            },
                            formatter : function () {    
                            	var hr = (this.value > 17) ? (this.value - 18) : (this.value + 6);     
                                return moment(hr, "H").format("[<strong>]h[</strong>]a");
                            }
                        }
                    },
                    plotOptions : {
                        spline : {
                            marker : {
                                enabled : false
                            },
                            color  : "#c4172c"
                        }
                    },
                    yAxis       : {
                        min          : 0,
                        max : (hrMax >= 4) ? null : 4,
                        tickInterval : (hrMax >= 4) ? hrMax / 4 : 1,                        
                        endOnTick    : false,
                        labels       : {
                            enabled: false,
                            floating : true,
                            style    : {display : 'none'}
                        }
                    },
                    series      : [
                        {
                            data      : byHour,
                            lineWidth : 5
                        }
                    ]
                });


            });
        }

    };

    uvo.setModuleReady("drivingActivity", module);
}(window.uvo));