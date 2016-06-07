/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./lineChart.html" />
/// <amd-dependency path="css!./lineChart.css" />

export var template: string = require("text!./lineChart.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');
var d3 = (<any>window).d3;

export class viewModel {
    public rdxContext: Models.RdxContext;
    public heatmap: Models.Heatmap;
    public maximumNumberOfDimensions: number = 50;
    public legendVisible: KnockoutObservable<boolean>;
    public focus: any;
    public x: any;
    public y: any;
    public hoveredLineArea: any;  // hovered properties are for series not in the current chart but being hovered over in the legend
    public hoveredLine: any;
    public hoveredData = [];
    public line: any;
    public area: any;
    public animatingOut = false;
    public singleDimensionExploreMenu: any;
    public multiselectExploreMenu: any;
    public andGroupByMenu: any;
    public currentSelectedDimension: any;
    public focusedDimension: any;
    public voronoiGroup: any;
    public voronoi: any;
    public justSingleDimensionExplored: boolean = false;
    public mouseIsDown = false;
    public leftMargin = 70;
    public dimensionForFilter = ko.observable('');
    public multiselectGhostStart = { left: 0, startLabel: null };
    public colors = ["#008272", "#61BC11", "#C545DD", "#67FA19", "#B77CF5", "#BC9D00", "#034B8C", "#FA9FA6", "#21A34E", "#85185F", "#F8F6A2", "#CEAAF7", "#803C00", "#25F0BB", "#CDF650", "#335B5E", "#D00556", "#FC60B3", "#6058D1", "#FEAB5F", "#2F4E00", "#42A285", "#6AC1F5", "#580724", "#2E1C48", "#5697F6", "#AFFD9F", "#F86E6A", "#60B601", "#96151D", "#7D6805", "#6E3D96", "#DFFADC", "#FD6A26", "#FEBD94", "#F3A7D6", "#CADBF9", "#0F1C23", "#F26EE0", "#627C05", "#B8C20B", "#49A9BF", "#9A27A3", "#367D4C", "#CC1678", "#6EED79", "#2A8AC9", "#EED66B", "#AE85F7", "#9663FA", "#35130D", "#B74B0F", "#114D26", "#B3FF75", "#3AD034", "#D830A9", "#16314B", "#8B0178", "#36C1C1", "#674604", "#FDF4C2", "#2F9621", "#FF4765", "#601012", "#E9E353", "#3A3C04", "#D2F789", "#E97E5C", "#3754B6", "#87A403", "#468D86", "#F7C6B3", "#DF2ACC", "#FF8DE4", "#81F64B", "#F66EA3", "#5F2405", "#28C259", "#301F21", "#15312B", "#4B1D5A", "#F7848A", "#AE5D03", "#34680C", "#142802", "#DCFCA9", "#D6C0FA", "#DAF0FA", "#76F4C2", "#6D183E", "#AF075E", "#488A0E", "#F15D6F", "#DE4E00", "#BB0041", "#F99A49", "#B4CF1A", "#15BE65", "#EC77EA", "#D1F540"];
    public rowsInChart = [];
    public rowsNotInChart = [];
    public data = [];
    private legendElementHeight = 28;

    constructor(params: any) {
        this.rdxContext = params.rdxContext;
        this.heatmap = params.rdxContext.heatmap;
        this.legendVisible = params.rdxContext.legendVisible;

        // handles bar chart rerender
        this.heatmap.rerenderTrigger.subscribe(() => {
            if (this.heatmap.selectedVisualization() == 'line') {
                this.closeAllExploreMenus();
                if (this.heatmap.rows.length && this.heatmap.columns.length) {
                    this.animatingOut = false;
                    this.heatmap.filterRows(this.heatmap.filter());
                    this.focusedDimension = null;
                    this.hoveredData = [];
                    this.rerender();
                    $("#crystalLineChart").css('opacity', 1);
                    $(".crystalLineChartLegend").css('opacity', 1);
                    $('#lineChartTooltip').css('opacity', 1);
                    this.justSingleDimensionExplored = false;
                } else {
                    $('#lineChartTooltip').css('opacity', 0);
                    $("#crystalLineChart").css('opacity', 0);
                    $(".crystalLineChartLegend").css('opacity', 0);
                }
                this.dimensionForFilter(this.heatmap.dimension);
                this.heatmap.unselectAllCells();
                return true;
            }
            else {
                $("#crystalLineChart").html("");
                $('.crystalLineChartLegend').html('');
            }
        });
    }

    public rerender = () => {

        var filteredRows = this.heatmap.rows.filter(function (row) { return row.isInFilter && row.hasActiveHits(); });
        var cappedRowsChartTitlePrefix = '';
        if (filteredRows.length > this.maximumNumberOfDimensions) {
            cappedRowsChartTitlePrefix = 'First ' + this.maximumNumberOfDimensions + ' of ' + this.heatmap.rows.length;
            this.rowsInChart = filteredRows.slice(0, this.maximumNumberOfDimensions);
            this.rowsNotInChart = filteredRows.slice(this.maximumNumberOfDimensions, filteredRows.length);
        }
        else {
            cappedRowsChartTitlePrefix = 'All ' + filteredRows.length;
            this.rowsInChart = filteredRows;
            this.rowsNotInChart = [];
        }
        var rowsInChart = this.rowsInChart;
        var chartTitle = cappedRowsChartTitlePrefix + ' ' + this.heatmap.dimension + ' series';
        $(".crystalLineChart").html('<div class="rdxTooltip" id="lineChartTooltip"></div><div class="multiselectGhost" onmousedown="ko.dataFor(this).ghostMousedown()" onmouseup="ko.dataFor(this).ghostMouseup();"></div><span class="crystalLineChartTitle">' + chartTitle + '</span>');

        var margin = { top: 40, right: 20, bottom: 80, left: this.leftMargin },
            width = Math.max(this.heatmap.columns.length * 16 - margin.left - margin.right + 140, $('.resultsPanel').innerWidth() - 140) - (this.legendVisible() ? 480 : 260),
            height = $('.crystalLineChartWrapper').height() - margin.top - margin.bottom;

        this.x = d3.scale.ordinal().rangePoints([0, width]);

        this.y = d3.scale.linear()
            .range([height, 0]);

        this.voronoi = d3.geom.voronoi()
            .x((d) => { return this.x(d.label); })
            .y((d) => { return this.y(d.value); })
            .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

        this.line = d3.svg.line()
            .x((d) => { return this.x(d.label); })
            .y((d) => { return this.y(d.value); });

        this.area = d3.svg.area()
            .x((d) => { return this.x(d.label); })
            .y0((d) => { return this.y(d.minValue); })
            .y1((d) => { return this.y(d.maxValue); });

        var svg = d3.select(".crystalLineChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        d3.select('.crystalLineChart').on("mousemove", this.mousemove);

        this.singleDimensionExploreMenu = d3.select("#crystalLineChartZoomExploreMenu");
        this.andGroupByMenu = d3.select("#andGroupByMenu");
        this.multiselectExploreMenu = d3.select("#crystalLineChartMultiselectExploreMenu");

        this.data = [];
        var minMeasure = Infinity;
        var maxMeasure = -1 * Infinity;
        this.rowsInChart.forEach((row, idx) => {
            var lineObject = { dimensionName: row.eventSourceName, values: [], color: this.colors[idx] };
            row.cells.forEach((cell, idx) => {
                var valueObject = {};
                if (cell.hit) {
                    valueObject['minValue'] = cell.hit.minMeasure;
                    valueObject['maxValue'] = cell.hit.maxMeasure;
                    valueObject['value'] = cell.hit.measure;
                    valueObject['eventCount'] = cell.hit.eventCount;
                }
                else {
                    valueObject['value'] = 0;
                    valueObject['minValue'] = 0;
                    valueObject['maxValue'] = 0;
                    valueObject['eventCount'] = 0;
                }
                var potentialMin = this.rdxContext.hasMinMaxProperty() ? Math.min(valueObject['minValue'], valueObject['value']) : valueObject['value'];
                var potentialMax = this.rdxContext.hasMinMaxProperty() ? Math.max(valueObject['maxValue'], valueObject['value']) : valueObject['value'];
                if (potentialMin < minMeasure)
                    minMeasure = potentialMin;
                if (potentialMax > maxMeasure)
                    maxMeasure = potentialMax;
                valueObject['label'] = this.heatmap.columns[idx].prettyPrintedBarChartTime();
                valueObject['dimension'] = lineObject;
                lineObject.values.push(valueObject);
            });
            var dimensionCount = 1;
            try { dimensionCount = JSON.parse(lineObject.dimensionName).keys.length }
            catch (e) { }
            lineObject['dimensionMembersCount'] = dimensionCount;
            lineObject['rowIndex'] = row.cells[0].rowIdx;
            this.data.push(lineObject);
        });

        var range = Math.abs(maxMeasure - minMeasure);
        range = range == 0 ? (maxMeasure == 0 ? 1 : maxMeasure) : range;
        this.x.domain(this.heatmap.columns.reduce((prev, curr) => { prev.push(curr.prettyPrintedBarChartTime()); return prev; }, []));
        this.y.domain([minMeasure - .04 * range, maxMeasure + .06 * range]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis()
                .scale(this.x)
                .orient("bottom"))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-65)";
            });

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(this.y)
                .orient("left")
                .tickFormat(d3.format(".3s"))
                .innerTickSize(-width)
                .outerTickSize(0)
                .tickPadding(4)
                .ticks(6))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -80)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-size", "12px")
            .text(() => { return this.heatmap.measure != 'Event Count' ? 'Avg(' + this.heatmap.measure + ')' : this.heatmap.measure; });

        var that = this;
        var dimensionMembersMax = d3.max(this.data.reduce((prev, curr) => { prev.push(curr.dimensionMembersCount); return prev; }, []));

        svg.append("g")
            .selectAll("path")
            .data(this.data)
            .enter().append("path")
            .attr('id', d => { return 'area' + d.dimensionName })
            .attr("d", function (d) { d.area = this; return that.area(d.values); })
            .attr('fill', d => { return d.color });

        svg.append("g")
            .attr("class", "dimensions")
            .selectAll("path")
            .data(this.data)
            .enter().append("path")
            .attr("d", function (d) { d.line = this; return that.line(d.values); })
            .attr('id', d => { return 'line' + d.dimensionName })
            .attr('stroke', d => { return d.color })
            .attr('stroke-width', d => { return d.dimensionMembersCount == 1 ? 2 : Math.max(4, Math.min(6, Math.round(5 * d.dimensionMembersCount / dimensionMembersMax))) + 'px' });

        this.hoveredLineArea = svg.append('path')
            .attr('id', 'rdxLineChartHoveredValuesArea');
        this.hoveredLine = svg.append('path')
            .attr('id', 'rdxLineChartHoveredValuesLine');

        this.focus = svg.append("g")
            .attr("transform", "translate(-10000,-10000)")
            .attr("class", "focus");

        this.focus.append("circle")
            .attr("r", 5).attr('id', 'lineChartFocusCircle');

        this.voronoiGroup = svg.append("g")
            .attr("class", "voronoi");

        this.voronoiGroup.selectAll("path")
            .data(this.voronoi(d3.nest()
                .key((d) => { return this.x(d.label) + "," + this.y(d.value); })
                .rollup(function (v) { return v[0]; })
                .entries(d3.merge(this.data.map(function (d) { return d.values; })))
                .map(function (d) { return d.values; })))
            .enter().append("path")
            .attr("d", function (d) {
                if (d)
                    return "M" + d.join("L") + "Z";
            })
            .datum(function (d) { if (d) return d.point; })
            .on("mouseover", this.mouseover)
            .on('mouseup', d => { this.mouseup(d); });

        // create legend
        var legendHtml = '<ul class="lineChartLegendList">';
        this.data.forEach(function (d) {
            var dimension = d.dimensionName;
            var color = d.color;
            legendHtml += '<li id="legendElement' + d.rowIndex + '" class="legendElement" onmouseup="ko.dataFor(this).mouseup(\'' + d.rowIndex + '\')" onmouseout="ko.dataFor(this).mouseout()" onmouseover="ko.dataFor(this).legendMouseover(\'' + d.rowIndex + '\')"><div class="colorSquare" style="background:' + color + '">&nbsp;</div>' + dimension + '</li>';
        });
        this.rowsNotInChart.forEach(function (r) {
            legendHtml += '<li id="legendElement' + r.cells[0].rowIdx + '" class="legendElement" onmouseup="ko.dataFor(this).mouseup(\'' + r.cells[0].rowIdx + '\')" onmouseout="ko.dataFor(this).mouseout()" onmouseover="ko.dataFor(this).legendMouseoverNotInChart(\'' + r.cells[0].rowIdx + '\')"><div class="colorSquare" style="background:none">&nbsp;</div>' + r.eventSourceName + '</li>';
        });
        legendHtml += '</ul>';
        $('.crystalLineChartLegend').html(legendHtml);
    }

    public exploreDimension = function () {
        var dimensionName = this.currentSelectedDimension.dimension.dimensionName;
        event.stopPropagation();
        this.closeFromContextMenu();
        var rowIndex = 0;
        this.heatmap.rows.forEach(function (row, rowIdx) {
            if (row.eventSourceName == dimensionName)
                rowIndex = rowIdx;
        });
        this.heatmap.handleRowClick(rowIndex, event);
        this.rdxContext.streamEventsFromHeatmap();
        $('.legendElement').removeClass('stickied');
        $('#legendElement' + rowIndex).addClass('stickied');
    }

    public singleDimensionExplore = (d, event) => {
        this.currentSelectedDimension = d;
        this.showSingleDimensionExploreMenu(event);
    }

    public filterByDimension = (dimension = '') => {
        this.animatingOut = true;
        var d = this.currentSelectedDimension.dimension;
        if (this.rdxContext.predicate.predicateText() == '*.*')
            this.rdxContext.predicate.predicateText('');
        var prependedPredicateText = this.rdxContext.predicate.predicateText() ? this.rdxContext.predicate.predicateText() + ' AND ' : '';
        try {
            var dimemsionAsObject = JSON.parse(d.dimensionName);
            var keys = dimemsionAsObject.keys.join(' ');
            this.rdxContext.predicate.predicateText(prependedPredicateText + '*.' + this.heatmap.dimension + ' LIKE_ANY ' + keys);
        }
        catch (e) {
            if (this.heatmap.dimension != 'EventSourceName') {
                this.rdxContext.predicate.predicateText(prependedPredicateText + '*.' + this.heatmap.dimension + ' = ' + this.currentSelectedDimension.dimension.dimensionName);
            }
            else {
                this.rdxContext.predicate.predicateText(prependedPredicateText + this.currentSelectedDimension.dimension.dimensionName + '.*');
            }
        }
        if (dimension)
            this.rdxContext.dimension(dimension);
        if (d.dimensionMembersCount > 1) {
            var zoomVals = [];
            d.values.forEach(val => { zoomVals.push({ label: val.label, minValue: this.y.domain()[0], maxValue: this.y.domain()[1] }); });
            this.data.forEach(function (d) { d3.select(d.line).style('opacity', .3); });
            d3.select(d.area).transition().duration(700).attr('d', this.area(zoomVals));
            d3.select(d.line).transition().duration(700).attr('stroke-width', 30);
        }
        this.rdxContext.streamEventSourceHits();
    }

    public closeFromContextMenu = () => {
        $('.multiselectGhost').hide();
        $('.multiselectGhost').width(0);
        $('.multiselectGhost').height(0);
        this.singleDimensionExploreMenu.style("display", "none");
        this.multiselectExploreMenu.style("display", "none");
        this.andGroupByMenu.style("display", "none");
        this.heatmap.unselectAllCells();
    }

    public showAndGroupByMenu = () => {
        var width = $('#crystalLineChartZoomExploreMenu').width();
        var left = this.singleDimensionExploreMenu.style('left');
        left = parseFloat(left.slice(0, -2)) + width - 4 + 'px';   
        this.andGroupByMenu.style("top", this.singleDimensionExploreMenu.style('top'));
        this.andGroupByMenu.style("left", left);
        this.andGroupByMenu.style("display", "block");
    }

    public hideAndGroupByMenu = () => {
        this.andGroupByMenu.style('display', 'none');
    }

    // Split By option in context menu
    public groupByAndFilter = dimension => {
        this.rdxContext.telemetryClient.logUserAction('splitBy', { selectedVisualization: 'line' });
        this.andGroupByMenu.style("display", "none");
        this.heatmap.filter('');
        this.filterByDimension(dimension);
    }

    private showMultiselectExploreMenu = evt => {
        var x = evt.clientX;
        var leftOffset = 0; // so it doesnt run off the page
        var exploreMenuWidth = $('#crystalLineChartMultiselectExploreMenu').width();
        if ($(window).width() < (x + exploreMenuWidth + 50))
            leftOffset = exploreMenuWidth;
        this.multiselectExploreMenu.style("top", (evt.pageY - 40 - $('.rdxTopPanel').height() + $('.resultsPanel').scrollTop()) + "px");
        this.multiselectExploreMenu.style("left", (evt.pageX) - leftOffset + "px");
        this.multiselectExploreMenu.style("display", "block");
    }

    private showSingleDimensionExploreMenu = (evt) => {
        var x = evt.clientX;
        var leftOffset = 0; // so it doesnt run off the page
        var exploreMenuWidth = $('#crystalLineChartZoomExploreMenu').width();
        if ($(window).width() < (x + exploreMenuWidth + 50))
            leftOffset = exploreMenuWidth;
        this.singleDimensionExploreMenu.style("top", (evt.pageY - 40 - $('.rdxTopPanel').height() + $('.resultsPanel').scrollTop()) + "px");
        this.singleDimensionExploreMenu.style("left", (evt.pageX) - leftOffset + "px");
        this.singleDimensionExploreMenu.style("display", "block");
        $('#lineChartTooltip').css({ left: -100, top: -100 });
    }

    public mouseup = d => {
        event.stopPropagation();
        $('.legendElement').removeClass('stickied');
        this.mouseIsDown = false;
        var isRightMB = this.isRightClick(event);

        // right click case
        if (isRightMB) {
            if (this.hoveredData.length)
                d = this.hoveredData[0];
            else if (typeof d == 'string') {
                // this is from the legend
                var rowIdx = parseInt(d);
                d = this.heatmap.rows.filter(r => { return r.cells[0].rowIdx == rowIdx; })[0].eventSourceName;
                d = this.data.filter(v => { return v.dimensionName == d })[0].values[0];
            }

            this.justSingleDimensionExplored = true;
            this.closeFromContextMenu();
            this.currentSelectedDimension = d;
            this.singleDimensionExplore(d, event);
            this.focusedDimension = d;
        }
        // close case
        else if (this.justSingleDimensionExplored) {
            this.closeFromContextMenu();
            this.justSingleDimensionExplored = false;
            this.hoveredData = [];
            this.hoveredLineArea.style('display', 'none');
            this.hoveredLine.style('display', 'none');
        }
        else {
            if (this.hoveredData.length) {
                d = this.hoveredData[0];
            }
            else if (typeof d == 'string') {
                var rowIdx = parseInt(d);
                d = this.heatmap.rows.filter(r => { return r.cells[0].rowIdx == rowIdx; })[0].eventSourceName;
                // this is from the legend
                var potentialD = this.data.filter(v => { return v.dimensionName == d });
                if (potentialD.length == 0) {
                    this.legendMouseoverNotInChart(rowIndex);
                    d = this.hoveredData[0];
                }
                else
                    d = potentialD[0].values[0];
            }

            this.justSingleDimensionExplored = true;
            this.multiselectGhostStart.startLabel = null;
            event.stopPropagation();
            var rowIndex = this.heatmap.rows.filter(r => { return r.eventSourceName == d.dimension.dimensionName })[0].cells[0].rowIdx;
            $('#legendElement' + rowIndex).addClass('stickied');
            this.currentSelectedDimension = d;
            this.focusedDimension = d;
        }
    }

    public ghostMouseup = () => {
        if (this.isRightClick(event)){
            this.showMultiselectExploreMenu(event);
            event.stopPropagation();
        }
    }

    public ghostMousedown = () => {
        if (this.isRightClick(event)) {
            event.stopPropagation();
        }
    }

    public mousedown = () => {
        this.mouseIsDown = true;
        this.multiselectGhostStart.left = (<any>event).pageX;
        this.heatmap.unselectAllCells();
        $('.multiselectGhost').hide();
        this.closeFromContextMenu();
    }

    public mousemove = d => {
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
                $('.multiselectGhost').width(ghostWidth);
                $('.multiselectGhost').height('397px'); // TODO: parametrize for resizability
                $('.multiselectGhost').show();

                // hide tooltip while dragging
                $('#lineChartTooltip').css({ left: -1000, top: -1000 });
                this.focus.attr("transform", "translate(-10000,-10000)");

                // determine what value this is on
                var xPos = d3.mouse(d3.select('.crystalLineChart > svg').node())[0] - this.leftMargin;
                var leftEdges = this.x.range();
                var width = this.x.rangeBand();
                for (var j = 0; xPos > (leftEdges[j] + width); j++) { }
                if (this.x.domain()[j]) {
                    var endLabel = this.x.domain()[j];
                }

                // set selected cells
                if (!this.multiselectGhostStart.startLabel && endLabel)
                    this.multiselectGhostStart.startLabel = endLabel;
                var startLabel = this.multiselectGhostStart.startLabel;
                if (endLabel) {
                    this.heatmap.unselectAllCells();

                    var startIndex, endIndex;
                    this.heatmap.columns.forEach((col, idx) => {
                        if (col.prettyPrintedBarChartTime() == startLabel)
                            startIndex = idx;
                        if (col.prettyPrintedBarChartTime() == endLabel)
                            endIndex = idx;
                    });

                    this.rowsInChart.forEach(row => {
                        for (var i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                            row.cells[i].selected = true;
                            this.heatmap.selectedCells.push(row.cells[i]);
                        }
                    });
                    this.heatmap.setEventsSelectedCount();
                }
            }
            else {
                $('.multiselectGhost').hide();
                this.heatmap.unselectAllCells();
            }
        }
    }

    public legendMouseoverNotInChart = rowIdx => {
        var firstOrDefault = this.heatmap.rows.filter(r => { return r.cells[0].rowIdx == rowIdx; });
        if (firstOrDefault.length) {
            var row = firstOrDefault[0];
            var dimensionName = row.eventSourceName;
            if (!(this.singleDimensionExploreMenu.style('display') == 'block') && !this.focusedDimension) {
                var values = [];
                row.cells.forEach((cell, idx) => {
                    var valueObject = {};
                    if (cell.hit) {
                        valueObject['minValue'] = cell.hit.minMeasure;
                        valueObject['maxValue'] = cell.hit.maxMeasure;
                        valueObject['value'] = cell.hit.measure;
                        valueObject['eventCount'] = cell.hit.eventCount;
                    }
                    else {
                        valueObject['value'] = 0;
                        valueObject['minValue'] = 0;
                        valueObject['maxValue'] = 0;
                        valueObject['eventCount'] = 0;
                    }
                    valueObject['label'] = this.heatmap.columns[idx].prettyPrintedBarChartTime();
                    valueObject['dimension'] = { color: 'black', dimensionName: dimensionName };
                    values.push(valueObject)
                });
                this.hoveredData = values;
                this.hoveredLineArea.attr('d', this.area(values))
                    .attr('fill', 'black')
                    .style('display', 'block');
                this.hoveredLine.attr('d', this.line(values))
                    .attr('stroke', 'black')
                    .attr('fill', 'none')
                    .attr('stroke-width', '3.5px')
                    .style('display', 'block');
                this.data.forEach(function (d) { d3.select(d.line).classed('not-hover', true); });
                this.data.forEach(function (d) { d3.select(d.area).classed('not-hover', true); });
            }
        }
    }

    public legendMouseover = rowIdx => {
        var dimensionName = this.heatmap.rows.filter(r => { return r.cells[0].rowIdx == rowIdx; })[0].eventSourceName;
        if (!(this.singleDimensionExploreMenu.style('display') == 'block') && !this.focusedDimension) {
            this.hoveredData = [];
            this.data.forEach(function (d) { d3.select(d.line).classed('not-hover', true); });
            this.data.forEach(function (d) { d3.select(d.area).classed('not-hover', true); });
            $(document.getElementById('line' + dimensionName)).attr('class', 'line-hover');
            $(document.getElementById('area' + dimensionName)).attr('class', 'line-hover');
        }
    }

    public mouseover = (d) => {
        if (this.focusedDimension) {
            if (!this.hoveredData.length)
                d = this.focusedDimension.dimension.values.filter(v => { return v.label == d.label })[0];
            else
                d = this.hoveredData.filter(v => { return v.label == d.label })[0];
        }
        if (!(this.singleDimensionExploreMenu.style('display') == 'block') && !(this.multiselectExploreMenu.style('display') == 'block') && !this.mouseIsDown && this.heatmap.rows.length && !this.animatingOut) {
            this.data.forEach(d => { d3.select(d.line).classed('line-hover', false) });
            this.data.forEach(d => { d3.select(d.area).classed('line-hover', false) });
            this.data.forEach(d => { d3.select(d.line).classed('not-hover', true) });
            this.data.forEach(d => { d3.select(d.area).classed('not-hover', true); });
            d3.select(d.dimension.line).classed("line-hover", true);
            d3.select(d.dimension.area).classed("line-hover", true);
            this.focus.attr("transform", "translate(" + this.x(d.label) + "," + this.y(d.value) + ")");
            $('#lineChartFocusCircle').attr('fill', d.dimension.color);

            // if clustering and its a 1 key cluster, we want the single key
            var dimensionName = d.dimension.dimensionName;
            if (d.dimension.dimensionMembersCount == 1) {
                try { dimensionName = JSON.parse(d.dimension.dimensionName).keys[0]; }
                catch (e) { dimensionName = d.dimension.dimensionName; }
            }

            var dimensionTitle = d.dimension.dimensionMembersCount > 1 ? d.dimension.dimensionMembersCount + ' members <br/>' + dimensionName : dimensionName;
            var tooltipHTML = d.eventCount == 0 ? dimensionTitle + '<br/>' + d.label + '<br/><b>No Events</b>' : (this.heatmap.measure != 'Event Count' ? (dimensionTitle + '<br/>' + d.label + '<br/>avg: <b>' + d.value + '</b> <br/>min: ' + d.minValue + '<br/>max: ' + d.maxValue) : (dimensionTitle + '<br/>' + d.label + '<br/>Event Count: <b>' + d.value + '</b>'));
            $('#lineChartTooltip').html(tooltipHTML);
            var left = this.x(d.label) + 100 - $('.crystalLineChart').scrollLeft();
            var top = this.y(d.value) + 50;
            var leftOffset = 0; // so it doesnt run off the page
            var rowLabelWidth = $('#lineChartTooltip').width();
            if ($(window).width() < (left + 500 + rowLabelWidth + 50))
                leftOffset = $('#lineChartTooltip').width() + 70;
            $('#lineChartTooltip').css({ left: left - leftOffset, top: top });

            $('.legendElement').removeClass('hovered');
            var rowIndex = this.heatmap.rows.filter(r => { return r.eventSourceName == d.dimension.dimensionName })[0].cells[0].rowIdx;
            var scrollIntoView = ($('.lineChartLegendList #legendElement' + rowIndex).position().top - 150) < 0 || ($('.lineChartLegendList #legendElement' + rowIndex).position().top - 150) > $('.crystalLineChartLegend').height() - 50;
            if (scrollIntoView && ($('.lineChartLegendList').height() > 380)) {
                $('.crystalLineChartLegend').scrollTop($('.lineChartLegendList #legendElement' + rowIndex).index() * this.legendElementHeight);
            }
            $('#legendElement' + rowIndex).addClass('hovered');
        }
    }

    public mouseout = (d) => {
        if (this.singleDimensionExploreMenu && !(this.singleDimensionExploreMenu.style('display') == 'block') && !this.animatingOut && !this.focusedDimension) {
            this.data.forEach(d => { d3.select(d.line).classed('line-hover', false) });
            this.data.forEach(d => { d3.select(d.line).classed('not-hover', false) });
            this.data.forEach(d => { d3.select(d.area).classed('line-hover', false) });
            this.data.forEach(d => { d3.select(d.area).classed('not-hover', false) });
            if (!this.focusedDimension) {
                this.hoveredData = [];
                this.hoveredLineArea.style('display', 'none');
                this.hoveredLine.style('display', 'none');
            }
        }
        $('.legendElement').removeClass('hovered');
        $('#lineChartTooltip').css({ left: -1000, top: -1000 });
        this.focus.attr("transform", "translate(-10000,-10000)");
    }

    public closeAllExploreMenus = () => {
        if (this.singleDimensionExploreMenu)
            this.singleDimensionExploreMenu.style('display', 'none');
        if (this.andGroupByMenu)
            this.andGroupByMenu.style('display', 'none');
        if (this.multiselectExploreMenu)
            this.multiselectExploreMenu.style('display', 'none');
    }

    public isRightClick = ev => {
        var e = <any>ev;
        var isRightMB;
        this.focusedDimension = null;
        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3;
        else if ("button" in e)  // IE, Opera 
            isRightMB = e.button == 2;
        return isRightMB;
    }
}