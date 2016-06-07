/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./barChart.html" />
/// <amd-dependency path="css!./barChart.css" />

export var template: string = require("text!./barChart.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');
var d3 = (<any>window).d3;

export class viewModel {
    public rdxContext: Models.RdxContext;
    public heatmap: Models.Heatmap;
    private data: Array<any> = [];
    private mouseIsDown = false;
    private multiselectGhostStart = { left: 0, top: 0 };
    private lastMousePosition = { left: 0, top: 0 };
    private rowsInChart = [];
    private allColors = [];
    public visible: KnockoutObservable<boolean> = ko.observable(true);
    public legendVisible: KnockoutObservable<boolean>;
    public exploreMenu: any;
    public singleDimensionExploreMenu: any;
    public currentDimensionName: any;
    public justSingleDimensionExplored: boolean = false;
    public maximumNumberOfDimensions: number = 20;
    public tooltip: any;

    constructor(params: any) {
        this.heatmap = params.rdxContext.heatmap;
        this.rdxContext = params.rdxContext;
        this.legendVisible = params.rdxContext.legendVisible;

        // handles bar chart rerender
        this.heatmap.rerenderTrigger.subscribe(() => {
            if (this.heatmap.selectedVisualization() == 'bar') {
                if (this.heatmap.rows.length && this.heatmap.columns.length) {
                    this.heatmap.filterRows(this.heatmap.filter());
                    $("#crystalBarChart").finish(); $(".crystalBarChartLegend").finish();
                    this.rerender();
                    $("#crystalBarChart").animate({ opacity: 1 });
                    $(".crystalBarChartLegend").animate({ opacity: 1 });
                    $('.chartTypeToggle').animate({ opacity: 1 });
                    this.justSingleDimensionExplored = false;
                } else {
                    $("#crystalBarChart").animate({ opacity: 0 }, () => {
                        $("#crystalBarChart").html("");
                    })
                    $(".crystalBarChartLegend").animate({ opacity: 0 }, () => {
                        $(".crystalBarChartLegend").html("");
                    });
                    $('.chartTypeToggle').animate({ opacity: 0 });
                }
                this.heatmap.unselectAllCells();
                return true;
            }
        });
    }

    public rerender = () => {
        var filteredRows = this.heatmap.rows.filter(function (row) { return row.isInFilter && row.hasActiveHits(); });
        var cappedRowsChartTitlePrefix = '';
        if (filteredRows.length > this.maximumNumberOfDimensions) {
            cappedRowsChartTitlePrefix = 'Showing first ' + this.maximumNumberOfDimensions + ' series of ' + this.heatmap.rows.length + '.';
            this.rowsInChart = filteredRows.slice(0, this.maximumNumberOfDimensions);
        }
        else {
            cappedRowsChartTitlePrefix = 'Showing all ' + this.heatmap.rows.length + ' series.';
            this.rowsInChart = filteredRows;
        }
        var rowsInChart = this.rowsInChart;
        var chartTitle = this.rdxContext.aggregatePropertyName() + ', grouped by ' + this.heatmap.dimension + '. ' + cappedRowsChartTitlePrefix;
        $(".crystalBarChart").html('<div class="multiselectGhost"></div><span class="crystalBarChartTitle">' + chartTitle + '</span>');

        var margin = { top: 40, right: 20, bottom: 80, left: 70 },
            width = Math.max(this.heatmap.columns.length * 16 - margin.left - margin.right + 140, $('.resultsPanel').innerWidth() - 140) - (this.legendVisible() ? 480 : 260),
            height = $('.crystalBarChart').height() - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .rangeRound([height, 0]);

        var line = d3.svg.line()
            .x(function (d) { return x(d.label) + .5 * x.rangeBand(); })
            .y(function (d) { return y(d.y1 - d.y0); });

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".3s"))
            .innerTickSize(-width)
            .outerTickSize(0)
            .tickPadding(4)
            .ticks(6);

        var svg = d3.select(".crystalBarChart").append("svg")
            .attr('class', 'crosshair')
            .attr("id", "crystalBarChartSvg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        this.data = []; // creates all stacked bars as data objects
        var dimensionToColorMapping = {};
        var colorToDimensionMapping = {};
        this.allColors = [];
        rowsInChart.forEach((row, rowIdx) => {
            var barColor = this.stringToColour(row.eventSourceName, rowIdx);
            dimensionToColorMapping[row.eventSourceName] = barColor;
            colorToDimensionMapping[barColor] = row.eventSourceName;
            this.allColors.push(barColor);
        });

        this.heatmap.columns.forEach((col, colIdx) => {
            var barChartObject = {};
            barChartObject['label'] = col.prettyPrintedBarChartTime();
            var bars = {};

            // creates a single stacked bar
            rowsInChart.forEach(row => {
                var cell = row.cells[colIdx];
                var barColor = dimensionToColorMapping[row.eventSourceName];
                if (!bars.hasOwnProperty(barColor)) {
                    bars[barColor] = {};
                    bars[barColor].total = 0;
                    bars[barColor].dimension = row.eventSourceName;
                }
                bars[barColor].total += cell.hit ? cell.hit.measure : 0;
            });

            // maps created bars to proper object layout for data
            var total = 0;
            barChartObject['colors'] = [];
            Object.keys(bars).sort().forEach((color, colorIdx) => {
                barChartObject['colors'].push({
                    color: color,
                    selectedColor: d3.rgb(color).darker(2),
                    y0: total,
                    y1: total += +bars[color].total,
                    colIdx: colIdx,
                    id: "crystalBar_" + colIdx + "_" + colorIdx,
                    opacity: col.percentCompleted / 100,
                    selected: false,
                    label: barChartObject['label'],
                    dimension: bars[color].dimension
                });
            });
            barChartObject['total'] = total;
            barChartObject['maxSingleBar'] = d3.max(barChartObject['colors'], function (c) { return c.y1 - c.y0; });
            barChartObject['minSingleBar'] = d3.min(barChartObject['colors'], function (c) { return c.y1 - c.y0; });
            this.data.push(barChartObject);
        });

        x.domain(this.data.map(function (d) { return d.label; }));
        var domain = [0, d3.max(this.data, function (d) { return d.total; })];
        domain[1] = domain[1] != 0 ? domain[1] : 1;
        domain[1] += domain[1] * .08;
        y.domain(domain);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-65)";
            });

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -80)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-size", "12px")
            .text(() => { return this.rdxContext.aggregatePropertyName(); });

        this.tooltip = d3.select(".crystalBarChart")
            .append("div")
            .style("display", "none")
            .attr("class", "rdxTooltip")
            .attr("id", "crystalBarChartTooltip");

        this.singleDimensionExploreMenu = d3.select(".crystalBarChart")
            .append("div")
            .style("display", "none")
            .attr("id", "crystalBarChartSingleDimensionExploreMenu")
            .attr("class", "rdxContextMenu")
            .html("<div id='barChartSingleDimensionExplore' onmouseup='ko.dataFor(this).exploreDimension(); ko.dataFor(this).justSingleDimensionExplored = false; ko.dataFor(this).singleDimensionExploreMenu.style(\"display\", \"none\"); event.stopPropagation(); return false;' onmousedown='event.stopPropagation()'>Explore this dimension</div><div onmouseup='ko.dataFor(this).filterByDimension(); ko.dataFor(this).singleDimensionExploreMenu.style(\"display\", \"none\"); event.stopPropagation(); ko.dataFor(this).justSingleDimensionExplored = false; return false;' onmousedown='event.stopPropagation()'>Show only this dimension</div><div onmouseup='ko.dataFor(this).closeFromContextMenu(); ko.dataFor(this).justSingleDimensionExplored = false; event.stopPropagation();' onmousedown='event.stopPropagation()'>Close</div>");

        this.exploreMenu = d3.select(".crystalBarChart")
            .append("div")
            .style("display", "none")
            .attr("id", "crystalBarChartZoomExploreMenu")
            .attr("class", "rdxContextMenu")
            .html("<div onmousedown='event.stopPropagation()' onmouseup='ko.dataFor(this).rdxContext.streamEventsFromChart(); ko.dataFor(this).exploreMenu.style(\"display\", \"none\"); event.stopPropagation();'>Explore</div><div onmouseup='ko.dataFor(this).rdxContext.zoomFromChart(); ko.dataFor(this).exploreMenu.style(\"display\", \"none\"); event.stopPropagation();' onmousedown='event.stopPropagation()'>Zoom</div><div onmouseup='ko.dataFor(this).closeFromContextMenu(); event.stopPropagation();' onmousedown='event.stopPropagation()'>Close</div>");

        var allBars = svg.selectAll(".crystalBarWrapper")
            .data(this.data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) { return "translate(" + x(d.label) + ",-1)"; });

        allBars.selectAll("rect")
            .data(function (d) { return d.colors; })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("id", function (d) { return d.id; })
            .style("fill-opacity", function (d) { return d.opacity; })
            .style('cursor', 'crosshair')
            .attr("y", function (d) { return y(d.y1) + (y(d.y0) - y(d.y1) != 0 ? 1 : 0); })
            .attr("height", function (d) { return d.y0 != d.y1 ? Math.max(1, y(d.y0) - y(d.y1)) : 0; })
            .attr("fill", function (d) { return d.color; })
            .attr("id", function (d) { return d.id; })
            .attr("class", function (d) { return 'rect' + d.color.substring(1); })
            .on('mouseup', this.singleDimensionExplore)
            .on('mouseover', d => {
                this.handleChartMouseover(d.dimension, d.color);
            })
            .on("mousemove", (d) => { this.placeTooltip(d.dimension, d.y1 - d.y0, d.label) })
            .on("mouseout", d => {
                this.handleChartMouseout(d.dimension, d.color);
                this.tooltip.style("display", "none");
            });
       

        // create legend
        var legendHtml = '<ul>';
        this.allColors.forEach(function (color) {
            var dimension = colorToDimensionMapping[color];
            legendHtml += '<li onmouseout="ko.dataFor(this).handleChartMouseout(\'' + dimension + '\', \'' + color + '\')" onmouseover="ko.dataFor(this).handleChartMouseover(\'' + dimension.replace(/"/g, "&quot;") + '\', \'' + color + '\')"><div class="colorSquare" style="background:' + color + '">&nbsp;</div>' + dimension + '</li>';
        });
        legendHtml += '</ul>';
        $('.crystalBarChartLegend').html(legendHtml);
    }

    public placeTooltip = (dimension, value = null, timestamp = null) => {
        if (!this.mouseIsDown && !(this.singleDimensionExploreMenu.style('display') == 'block')) {
            var x = (<any>event).clientX;
            var leftOffset = 0; // so it doesnt run off the page
            var rowLabelWidth = this.heatmap.rowLabelWidth();
            if ($(window).width() < (x + rowLabelWidth + 50))
                leftOffset = $('#crystalBarChartTooltip').width() + 50;
            this.tooltip.style("top", (d3.mouse(d3.select('.resultsPanel').node())[1] + 20 + $('.resultsPanel').scrollTop()) + "px");
            this.tooltip.style("left", (d3.mouse(d3.select('.resultsPanel').node())[0] + 20) - leftOffset + "px");

            // if it is 1 dimension member, then we should just show its name
            var dimensionName = dimension;
            var dimensionCount = 1;
            try {
                dimensionCount = JSON.parse(dimension).keys.length;
                if (dimension == 1)
                    dimensionName = JSON.parse(dimension).keys[0];
            }
            catch (e) { }

            var dimensionTitle = dimensionCount > 1 ? dimensionCount + ' members <br/>' + dimensionName : dimensionName;
            var tooltipHTML = dimensionTitle + '<br/>' + (timestamp ? '<br/>' + timestamp + '&nbsp;' : '<br/>') + '<b>' + (value ? value.toString() : '') + '</b></div>';
            this.tooltip.html(tooltipHTML);
            this.tooltip.style("display", "block");
        }
    }

    public handleChartMouseout = (dimension, color) => {
        if (!(this.singleDimensionExploreMenu.style('display') == 'block')) {
            this.allColors.forEach(color => {
                $(".rect" + color.substring(1)).css('opacity', 1);
                $(".rect" + color.substring(1)).attr('fill', color);
            });

            // set selected colors
            this.data.forEach(function (bar) {
                bar.colors.forEach(function (color) {
                    if (color.selected) {
                        var barSelector = $("#" + color.id);
                        barSelector.attr('fill', color.selectedColor);
                    }
                });
            });
        }
    }

    public handleChartMouseover = (dimension, color) => {
        if (!this.mouseIsDown && !(this.singleDimensionExploreMenu.style('display') == 'block')) {
            this.allColors.forEach(color => {
                $(".rect" + color.substring(1)).css('opacity', .25);
            });
            $(".rect" + color.substring(1)).css('opacity', 1);
        }
    }

    public singleDimensionExplore = d => {
        if (this.justSingleDimensionExplored) {
            this.closeFromContextMenu();
            this.justSingleDimensionExplored = false;
        }
        else if (!this.heatmap.eventsSelected()) {
            this.currentDimensionName = d.dimension;
            this.showSingleDimensionExploreMenu(event);
            this.handleChartMouseover(d.dimension, d.color);
            this.justSingleDimensionExplored = true;
        }
    }

    public exploreDimension = function () {
        event.stopPropagation();
        this.closeFromContextMenu();
        var rowIndex = 0;
        this.heatmap.rows.forEach(function (row, rowIdx) {
            if (row.eventSourceName == this.currentDimensionName)
                rowIndex = rowIdx;
        });
        this.heatmap.handleRowClick(rowIndex, event);
        this.rdxContext.streamEventsFromHeatmap();
    }

    public handleMousedown = () => {
        this.closeFromContextMenu();
        if (this.exploreMenu) {
            this.exploreMenu.style("display", "none");
            $('.multiselectGhost').hide();
            $('.multiselectGhost').width(0);
            $('.multiselectGhost').height(0);
        
            // set position properties of data for multiselect perf
            this.data.forEach(function (bar) {
                bar.colors.forEach(function (color) {
                    var barSelector = $("#" + color.id);
                    color.offset = barSelector.offset();
                    color.offset.right = color.offset.left + Number(barSelector.attr('width'));
                    color.offset.bottom = color.offset.top + Number(barSelector.attr('height'));
                });
            });

            this.mouseIsDown = true;
            this.multiselectGhostStart.left = (<any>event).pageX;
            this.lastMousePosition.left = (<any>event).pageX;
            this.deselectAll();
            this.heatmap.setBarChartEventsSelectedCount();
        }
    }

    public handleMouseup = () => {
        this.mouseIsDown = false;
        this.heatmap.setBarChartEventsSelectedCount();
        if (this.heatmap.eventsSelected()) {
            var event2: any;
            event2 = event;
            this.showExploreMenu(event2);
        }
    }

    public filterByDimension = () => {
        if (this.rdxContext.shouldClusterEventSourceHits()) {
            var dimemsionAsObject = JSON.parse(this.currentDimensionName);
            var keys = dimemsionAsObject.keys.join(' ');
            this.rdxContext.predicate.predicateText(this.rdxContext.predicate.predicateText() + ' AND ' + '*.' + this.rdxContext.dimension() + ' LIKE_ANY ' + keys);
        }
        else
            this.rdxContext.predicate.predicateText(this.rdxContext.predicate.predicateText() + ' AND ' + '*.' + this.rdxContext.dimension() + ' = ' + this.currentDimensionName);
        this.rdxContext.streamEventSourceHits();
        this.closeFromContextMenu();
    }

    private showSingleDimensionExploreMenu = (evt) => {
        var x = evt.clientX;
        var leftOffset = 0; // so it doesnt run off the page
        var exploreMenuWidth = $('#crystalBarChartSingleDimensionExploreMenu').width();
        if ($(window).width() < (x + exploreMenuWidth + 50))
            leftOffset = exploreMenuWidth + 50;
        this.singleDimensionExploreMenu.style("top", (evt.pageY - 20 - $('.rdxTopPanel').height() + $('.resultsPanel').scrollTop()) + "px");
        this.singleDimensionExploreMenu.style("left", (evt.pageX) - 20 - leftOffset + "px");
        this.singleDimensionExploreMenu.style("display", "block");
        this.tooltip.style("display", "none");
    }

    public showExploreMenu = (evt) => {
        var x = evt.clientX;
        var leftOffset = 0; // so it doesnt run off the page
        var exploreMenuWidth = $('#crystalBarChartZoomExploreMenu').width();
        if ($(window).width() < (x + exploreMenuWidth + 50))
            leftOffset = exploreMenuWidth + 50;
        this.exploreMenu.style("top", (evt.pageY - 20 - $('.rdxTopPanel').height() + $('.resultsPanel').scrollTop()) + "px");
        this.exploreMenu.style("left", (evt.pageX) - 20 - leftOffset + "px");
        this.exploreMenu.style("display", "block");
    }

    public handleMouseleave = () => {
        if (this.mouseIsDown) {
            this.mouseIsDown = false;
            this.heatmap.setBarChartEventsSelectedCount();
            if (this.heatmap.eventsSelected()) {
                var event2: any;
                event2 = event;
                this.showExploreMenu(event2);
            }
            else {
                $('.multiselectGhost').hide();
                $('.multiselectGhost').width(0);
                $('.multiselectGhost').height(0);
                this.exploreMenu.style("display", "none");
            }
        }
    }

    public handleMouseover = function () {
        if (this.mouseIsDown) {
            var x = (<any>event).pageX;
            var y = (<any>event).pageY;
            var ghost = (<any>$('.multiselectGhost'));
            ghost.offset({ left: this.multiselectGhostStart.left });
            if (x < this.multiselectGhostStart.left) {
                var ghost = (<any>$('.multiselectGhost'));
                ghost.offset({ left: x });
            }
            var ghostWidth = Math.abs(x - this.multiselectGhostStart.left);
            if (ghostWidth > 5) {
                this.justSingleDimensionExplored = false;
                $('.multiselectGhost').show();
                $('.multiselectGhost').width(ghostWidth);
                $('.multiselectGhost').height('397px'); // TODO: parametrize for resizability

                // select bars, deselect those exiting
                var xMin = Math.min(x, this.multiselectGhostStart.left);
                var xMax = Math.max(x, this.multiselectGhostStart.left);
                var yMin = Math.min(0, this.multiselectGhostStart.top);
                var yMax = Math.max(1000, this.multiselectGhostStart.top);

                // exiting bars
                var exitXMin = Math.min(x, this.lastMousePosition.left);
                var exitXMax = Math.max(x, this.lastMousePosition.left);
                var absXMin = Math.min(xMin, exitXMin);
                var absXMax = Math.max(xMax, exitXMax);

                this.data.forEach(bar => {
                    bar.colors.forEach(color => {
                        // only consider bars in absolute range
                        if (color.offset.right > absXMin && color.offset.left < absXMax) {
                            var barSelector = $("#" + color.id);
                            if (((color.offset.left > xMin && color.offset.left < xMax) || (color.offset.right > xMin && color.offset.right < xMax) || (color.offset.left < xMin && color.offset.right > xMax)) && // x range is proper
                                ((yMin > color.offset.top && yMin < color.offset.bottom) || // top of ghost between bar
                                    (yMax > color.offset.top && yMax < color.offset.bottom) || // bottom of ghost between bar
                                    (color.offset.top > yMin && color.offset.bottom < yMax)) // bar surrounded by ghost
                                ) {
                                barSelector.attr('fill', color.selectedColor);
                                color.selected = true;
                            } else {
                                barSelector.attr('fill', color.color);
                                color.selected = false;
                            }
                        }
                    });
                });
                this.lastMousePosition.left = x;
                this.setHeatmapSelectedCells();
                this.heatmap.setEventsSelectedCount();
            }
            else {
                $('.multiselectGhost').hide();
                this.deselectAll();
            }
        }
    }

    public setHeatmapSelectedCells(): void {
        var columnsSelected = {};
        this.heatmap.selectedCells = [];
        this.data.forEach(function (bar) {
            bar.colors.forEach(function (color) {
                if (color.selected)
                    columnsSelected[color.colIdx] = true;
            });
        });

        var eventSourceNames = this.rowsInChart.reduce(function (prev, curr) {
            prev.push(curr.eventSourceName);
            return prev;
        }, []);

        var that = this;
        this.heatmap.rows.forEach(function (row) {
            if (eventSourceNames.indexOf(row.eventSourceName) != -1) {
                row.cells.forEach(function (cell) {
                    if (columnsSelected.hasOwnProperty(<any>cell.colIdx)) {
                        that.heatmap.selectedCells.push(cell);
                    }
                });
            }
        });
    }

    public closeFromContextMenu = () => {
        $('.multiselectGhost').hide();
        $('.multiselectGhost').width(0);
        $('.multiselectGhost').height(0);
        this.exploreMenu.style("display", "none");
        this.singleDimensionExploreMenu.style("display", "none");
        this.deselectAll();
    }

    public deselectAll = function () {
        this.data.forEach(function (bar) {
            bar.colors.forEach(function (color) {
                var barSelector = $("#" + color.id);
                barSelector.attr('fill', color.color);
                color.selected = false;
            });
        });
        this.heatmap.unselectAllCells();
    }

    private stringToColour = (str, idx) => {
        // swagggg http://tools.medialab.sciences-po.fr/iwanthue/
        var colors = ["#008272", "#61BC11", "#C545DD", "#67FA19", "#B77CF5", "#BC9D00", "#034B8C", "#FA9FA6", "#21A34E", "#85185F", "#F8F6A2", "#CEAAF7", "#803C00", "#25F0BB", "#CDF650", "#335B5E", "#D00556", "#FC60B3", "#6058D1", "#FEAB5F", "#2F4E00", "#42A285", "#6AC1F5", "#580724", "#2E1C48", "#5697F6", "#AFFD9F", "#F86E6A", "#60B601", "#96151D", "#7D6805", "#6E3D96", "#DFFADC", "#FD6A26", "#FEBD94", "#F3A7D6", "#CADBF9", "#0F1C23", "#F26EE0", "#627C05", "#B8C20B", "#49A9BF", "#9A27A3", "#367D4C", "#CC1678", "#6EED79", "#2A8AC9", "#EED66B", "#AE85F7", "#9663FA", "#35130D", "#B74B0F", "#114D26", "#B3FF75", "#3AD034", "#D830A9", "#16314B", "#8B0178", "#36C1C1", "#674604", "#FDF4C2", "#2F9621", "#FF4765", "#601012", "#E9E353", "#3A3C04", "#D2F789", "#E97E5C", "#3754B6", "#87A403", "#468D86", "#F7C6B3", "#DF2ACC", "#FF8DE4", "#81F64B", "#F66EA3", "#5F2405", "#28C259", "#301F21", "#15312B", "#4B1D5A", "#F7848A", "#AE5D03", "#34680C", "#142802", "#DCFCA9", "#D6C0FA", "#DAF0FA", "#76F4C2", "#6D183E", "#AF075E", "#488A0E", "#F15D6F", "#DE4E00", "#BB0041", "#F99A49", "#B4CF1A", "#15BE65", "#EC77EA", "#D1F540"];

        return colors[idx];
    }
}