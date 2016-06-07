/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./environmentsPanel.html" />
/// <amd-dependency path="css!./environmentsPanel.css" />

export var template: string = require("text!./environmentsPanel.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');
var d3 = (<any>window).d3;

export class viewModel {
    public timePicker: Models.TimePicker;
    public rdxContext: Models.RdxContext;
    public buttonsVisible: KnockoutObservable<boolean> = ko.observable(false);
    public noSpanSelected: KnockoutObservable<boolean> = ko.observable(true);
    public title: KnockoutObservable<string> = ko.observable('');
    public noData: KnockoutObservable<boolean> = ko.observable(false);
    public mouseIsDown: boolean = false;
    public x: any;
    public startMillis = 0;
    public endMillis = 0;
    private leftMargin = 60;
    private multiselectGhostStart = { left: 0 };
    private panelMarginLeft = 481;
    private hasEnvironmentName = false;
    public synchronizePickerAndInputs: any;

    constructor(params: any) {
        this.timePicker = params.rdxContext.timePicker;
        this.rdxContext = params.rdxContext;

        // to handle page load when name is empty
        this.rdxContext.environmentName.subscribe(() => {
            if (!this.hasEnvironmentName && Object.keys(this.timePicker.availabilityDistribution).length) {
                this.hasEnvironmentName = true;
                this.title('Number of events per hour in ' + this.rdxContext.environmentName());
            }
        })

        this.timePicker.loadingAvailability.subscribe(loading => {
            this.noData(false);
            if (!loading) {
                if (Object.keys(this.timePicker.availabilityDistribution).length) {
                    this.title('Number of events per hour in ' + this.rdxContext.environmentName());
                    this.hasEnvironmentName = this.rdxContext.environmentName() ? true : false;
                    this.buttonsVisible(true);
                    this.noSpanSelected(true);
                    this.rerender();
                }
                else {
                    if (this.timePicker.availabilityRequestFailed()) {
                        this.buttonsVisible(false);
                        $('.indexAvailabilityMap').html('');
                        this.title('Failed to get an event distribution for this cluster &#128546;');
                    }
                    else {
                        this.buttonsVisible(false);
                        $('.indexAvailabilityMap').html('');
                        this.noData(true);
                        this.title('No data is available for this cluster &#128529;');
                    }
                }
                if (this.buttonsVisible())
                    this.drawGhost();
                else
                    $('.environmentMultiselectGhost').css({ display: 'none' });
                $('.indexAvailabilityMapWrapper').css('opacity', 1);
            }
            else {
                $('.indexAvailabilityMapWrapper').css('opacity', 0);
            }
        });

        d3.select('.environmentMultiselectGhost')
            .on('mousedown', this.mousedown)
            .on("mousemove", this.mousemove)
            .on("mouseup", this.mouseup);

        d3.select('.ghostBlueLine')
            .on('mousedown', this.mousedown)
            .on("mousemove", this.mousemove)
            .on("mouseup", this.mouseup);

        // for timepicker controls
        (<any>$('#rdxStartDate')).datepicker({
            showOtherMonths: true,
            selectOtherMonths: true,
            dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
            onSelect: (selectedDate) => {
                this.synchronizePickerAndInputs(true);
                $('#rdxStartDate').blur();
            }
        });
        (<any>$('#rdxEndDate')).datepicker({
            showOtherMonths: true,
            selectOtherMonths: true,
            dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
            onSelect: (selectedDate) => {
                this.synchronizePickerAndInputs(true);
                $('#rdxEndDate').blur();
            }
        });

        this.timePicker.startDate.subscribe(dateString => {
            this.synchronizePickerAndInputs(false);
        });

        this.timePicker.endDate.subscribe(dateString => {
            this.synchronizePickerAndInputs(false);
        });

        this.synchronizePickerAndInputs = (isFromDatePicker) => {
            var startDate, endDate;
            if (isFromDatePicker) {
                startDate = (<any>$("#rdxStartDate")).datepicker().val();
                endDate = (<any>$("#rdxEndDate")).datepicker().val();
                this.timePicker.startDate(startDate);
                this.timePicker.endDate(endDate);
                this.timePicker.loadingAvailability.valueHasMutated();
            }
            else {
                startDate = this.timePicker.startDate();
                endDate = this.timePicker.endDate();
                var parts = startDate.split("/");
                var dt = new Date(parseInt(parts[2], 10),
                    parseInt(parts[0], 10) - 1,
                    parseInt(parts[1], 10));
                (<any>$("#rdxStartDate")).datepicker('setDate', dt);
                var parts = endDate.split("/");
                var dt = new Date(parseInt(parts[2], 10),
                    parseInt(parts[0], 10) - 1,
                    parseInt(parts[1], 10));
                (<any>$("#rdxEndDate")).datepicker('setDate', dt);
            }
        }
        this.synchronizePickerAndInputs(false);
    }

    public handleTimeEnter = (d, e) => {
        if (e.keyCode == 13) {
            this.rdxContext.streamEventSourceHits();
        }
        return true;
    }

    public rerender() {
        $('.indexAvailabilityMap').html('');
        $('.ghostBlueLine').hide();

        var margin = { top: 28, right: 80, bottom: 60, left: this.leftMargin },
            width = $('.topToggles').width() - 400 - margin.left - margin.right,
            height = $('.indexAvailabilityMap').height() - margin.top - margin.bottom;

        this.x = d3.scale.ordinal()
            .rangePoints([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(this.x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y).ticks(5)
            .orient("left").tickFormat(d3.format('.2s'));

        var line = d3.svg.line()
            .x((d) => { return this.x(d.date); })
            .y(function (d) { return y(d.eventCount); });

        var area = d3.svg.area()
            .x((d) => { return this.x(d.date); })
            .y0((d) => { return y(d.eventCount); })
            .y1((d) => { return y(0); });

        // for crosshair cursor that fits nicely in the line chart area
        d3.select(".indexAvailabilityMap").append("svg")
            .attr("width", width)
            .attr("height", height + 10)
            .style('position', 'absolute')
            .style('margin-left', this.leftMargin + 'px')
            .style('margin-top', margin.top - 10 + 'px')
            .attr('class', 'crosshair')
            .on('mousedown', this.mousedown)
            .on("mousemove", this.mousemove)
            .on("mouseup", this.mouseup)
            .on("mouseleave", this.mouseleave);
        
        var svg = d3.select(".indexAvailabilityMap").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .on("mouseup", this.mouseup)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var data = [];
        Object.keys(this.timePicker.availabilityDistribution).sort().forEach((d) => {
            var dataPoint = { date: new Date(parseInt(d) + 1000*60*60), eventCount: this.timePicker.availabilityDistribution[d] };
            dataPoint['dateMilliseconds'] = dataPoint.date.valueOf();
            data.push(dataPoint);
        });

        data.sort((a, b) => {return a.dateMilliseconds - b.dateMilliseconds; });
        data.forEach(d => {
            var date = d.date.getUTCMonth() + 1 + '/' + d.date.getUTCDate() + ' ';
            var minutes = d.date.getUTCMinutes();
            if (minutes < 10)
                d.date = date + d.date.getUTCHours() + ":0" + minutes;
            else
                d.date = date + d.date.getUTCHours() + ":" + minutes;
        })

        var mod = Math.floor(data.length / 9);
        mod = mod == 0 ? 1 : mod;
        this.x.domain(data.reduce(function (prev, curr, idx) {
            if ((data.length - 1 - idx) % mod == 0 || (idx == (data.length - 1)))
                prev.push(curr.date);
            return prev;
        }, []));
        y.domain(d3.extent(data.concat([{eventCount: 0}]), function (d) { return d.eventCount; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-40)";
            });

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");

        this.x.domain(data.map(d => { return d.date }));
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);

        // change domain to work for milliseconds for zoom
        this.x.domain(data.map(d => { return d.dateMilliseconds }));

        // remove 0 tick
        svg.selectAll(".tick")
            .filter(function (d) { return d === 0; })
            .remove();
    }

    public mousedown = () => {
        this.mouseIsDown = true;
        this.multiselectGhostStart.left = (<any>event).pageX;

        // determine start millis
        var xPos = d3.mouse(d3.select('.indexAvailabilityMap').node())[0] - this.leftMargin;
        var leftEdges = this.x.range();
        var width = this.x.rangeBand();
        for (var j = 0; xPos > (leftEdges[j] + width); j++) { }
        j -= j == 0 ? 0 : 1;
        if (this.x.domain()[j]) {
            this.startMillis = this.x.domain()[j];
        }
        else {
            this.startMillis = this.x.domain()[this.x.domain().length - 1];
        }
    }

    public mouseup = () => {
        this.mouseIsDown = false;
    }

    public drawGhost = (direction = 'both') => {
        var startMillis = this.timePicker.startDateMilliseconds();
        var endMillis = this.timePicker.endDateMilliseconds();
        var ghost = (<any>$('.environmentMultiselectGhost'));

        // round start millis down, end millis up, to nearest hour
        startMillis = Math.floor(startMillis / (1000 * 60 * 60)) * 1000 * 60 * 60;
        endMillis = Math.ceil(endMillis / (1000 * 60 * 60)) * 1000 * 60 * 60;
        if ((startMillis > this.x.domain()[this.x.domain().length - 1]) || (endMillis < this.x.domain()[0]) || this.timePicker.errorMessage()) {
            ghost.css({display: 'none'});
            return;
        }
        ghost.css({display: 'inherit'});
        if (startMillis < this.x.domain()[0])
            startMillis = this.x.domain()[0];
        if (endMillis > this.x.domain()[this.x.domain().length - 1])
            endMillis = this.x.domain()[this.x.domain().length - 1];

        if (direction == 'both') {
            ghost.css({ left: this.x(startMillis) + this.leftMargin });  // hardcoded panel margin left
            ghost.width(this.x(endMillis) - this.x(startMillis));
        }
        if (direction == 'left') {
            var left = this.x(startMillis);
            var width = this.multiselectGhostStart.left - left - this.panelMarginLeft;
            ghost.css({ left: this.x(startMillis) + this.leftMargin });  // hardcoded panel margin left
            ghost.width(width);
        }
        if (direction == 'right') {
            ghost.css({ left: this.multiselectGhostStart.left - this.panelMarginLeft + this.leftMargin });  // hardcoded panel margin left
            var width = this.x(endMillis) - this.multiselectGhostStart.left + this.panelMarginLeft;
            ghost.width(width);
        }
        this.noSpanSelected(false);
    }

    public mousemove = () => {
        var hideGhostBlueLine = false;
        if (this.mouseIsDown) {
            var x = (<any>event).pageX;
            var y = (<any>event).pageY;
            var ghost = (<any>$('.environmentMultiselectGhost'));
            ghost.offset({ left: this.multiselectGhostStart.left });
            var isMovingLeft = false;
            if (x < this.multiselectGhostStart.left) {
                ghost.offset({ left: x });
                isMovingLeft = true;
            }
            this.noSpanSelected(false);

            // determine what value this is on
            var xPos = d3.mouse(d3.select('.indexAvailabilityMap').node())[0] - this.leftMargin;
            var leftEdges = this.x.range();
            var width = this.x.rangeBand();
            for (var j = 0; xPos > (leftEdges[j] + width); j++) { }
            if (this.x.domain()[j]) {
                this.endMillis = this.x.domain()[j];
                if (this.endMillis == this.startMillis) {
                    if (isMovingLeft && j > 0)
                        this.endMillis = this.x.domain()[j - 1];
                    else if (j < this.x.domain().length - 1)
                        this.endMillis = this.x.domain()[j + 1];
                }
            }
            if (j < this.x.domain().length - 1 && j > 0) {
                ghost.width(Math.abs(x - this.multiselectGhostStart.left));
                hideGhostBlueLine = true;
            }
            ghost.css({ display: 'inherit' });
            this.rdxContext.setTimeDimensionFromTimeRange(Math.min(this.startMillis, this.endMillis), Math.max(this.startMillis, this.endMillis));
            this.timePicker.setTimeRange(Math.min(this.startMillis, this.endMillis), Math.max(this.startMillis, this.endMillis));
        }
        var x = (<any>event).pageX;
        (<any>$('.ghostBlueLine')).offset({ left: x });
        hideGhostBlueLine ? $('.ghostBlueLine').hide() : $('.ghostBlueLine').show();
        event.stopPropagation();
    }

    public mouseleave = () => {
        if (this.mouseIsDown) {
            // check if exit left
            var x = (<any>event).pageX;
            if (x <= this.panelMarginLeft) {
                this.endMillis = this.timePicker.earliestAvailableTimeInMilliseconds;
                this.rdxContext.setTimeDimensionFromTimeRange(Math.min(this.startMillis, this.endMillis), Math.max(this.startMillis, this.endMillis));
                this.timePicker.setTimeRange(Math.min(this.startMillis, this.endMillis), Math.max(this.startMillis, this.endMillis));
                this.drawGhost('left');
            }
            // else right exit
            else if ($('body').width() - x <= 80) {
                this.endMillis = this.timePicker.latestAvailableTimeInMilliseconds;
                this.rdxContext.setTimeDimensionFromTimeRange(Math.min(this.startMillis, this.endMillis), Math.max(this.startMillis, this.endMillis));
                this.timePicker.setTimeRange(Math.min(this.startMillis, this.endMillis), Math.max(this.startMillis, this.endMillis));
                this.drawGhost('right');
            }
        }
    }
}