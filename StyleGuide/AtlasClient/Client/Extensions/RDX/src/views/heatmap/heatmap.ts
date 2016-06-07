/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./heatmap.html" />
/// <amd-dependency path="css!./heatmap.css" />

export var template: string = require("text!./heatmap.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');

export class viewModel {
    public heatmap: Models.Heatmap;
    public rdxContext: Models.RdxContext;
    public xAxisHeight = 33;
    public xAxisWidth = 0;
    public yAxisWidth = 0;
    public yAxisHeight = 0;
    public heatmapHeight = 0;
    public cellWidth = 25;
    public scrollBarWidth = 20;
    public currentRow = 0;
    public currentColumn = 0;
    public rowsVisible = 17;
    public columnsVisible = 0;
    public extraLabelPadding = 0;
    public pendingScrollActions = 0;
    public maxPendingScrollActions = 5;
    public redrawTimeout;
    public visible: KnockoutObservable<boolean> = ko.observable(true);
    public exploreMenu: any;
    public tooltip: any;
    public tooltipTimer: any;
    public andGroupByMenu: any;
    public singleDimensionExploreMenu: any;
    public selectedRowIdx: number;
    public dimensionForFilter = ko.observable('');

    constructor(params: any) {
        this.heatmap = params.rdxContext.heatmap;
        this.rdxContext = params.rdxContext;

        // handles heatmap rerendering
        this.heatmap.rerenderTrigger.subscribe(() => {
            if (this.heatmap.selectedVisualization() == 'heatmap') {
                if (this.heatmap.rows.length && this.heatmap.columns.length) {
                    this.currentColumn = 0;
                    this.currentRow = 0;
                    this.heatmap.filterRows(this.heatmap.filter());
                    this.closeExploreMenu();
                    this.closeSingleDimensionExploreMenu();
                    this.rerender();
                    $('.topLeftCornerControlsWrapper').css('opacity', 1);
                    $("#heatmap").css('opacity', 1);
                } else {
                    $("#heatmap").css('opacity', 0);
                    $('.topLeftCornerControlsWrapper').css('opacity', 0);
                    if (this.exploreMenu)
                        this.exploreMenu.style("display", "none");
                }
                this.dimensionForFilter(this.heatmap.dimension);
                this.heatmap.unselectAllCells();
            }
        });
    }

    public rerender(): void {
        this.exploreMenu = d3.select("#heatmapExploreMenu");
        this.tooltip = d3.select("#heatmapTooltip");
        this.singleDimensionExploreMenu = d3.select("#crystalHeatmapZoomExploreMenu");
        this.andGroupByMenu = d3.select("#heatmapAndGroupByMenu");
        var heatmapWidth = $("#heatmap")[0].clientWidth;
        this.columnsVisible = Math.min(Math.floor((heatmapWidth - this.heatmap.rowLabelWidth() - this.scrollBarWidth) / this.cellWidth));
        this.extraLabelPadding = heatmapWidth - this.heatmap.rowLabelWidth() - this.columnsVisible * this.cellWidth - this.scrollBarWidth + 2;

        var heatmapHTML = '<div class="noHighlight labelContainer" onmousewheel="ko.dataFor(this).handleScroll()">';
        heatmapHTML += '<div id="heatmapVerticalVirtualScroll" style="height:100%; width:20px; position: absolute; top: 0; right: 0; overflow-y: scroll; overflow-x: hidden; z-index: 24" onscroll="ko.dataFor(this).handleVirtualScroll()">' +
        '<div style="height: ' + (this.heatmap.rows.length * this.cellWidth + this.xAxisHeight) + 'px;"></div></div>';

        // x axis labels
        heatmapHTML += '<table class="xAxisLabel" id="xAxisLabel" onmouseup="ko.dataFor(this).handleMouseup()">';
        heatmapHTML += '<thead>';
        heatmapHTML += '<tr>';
        heatmapHTML += this.createXAxisLabels();
        heatmapHTML += '</tr></thead></table>';

        // top left corner
        heatmapHTML += '<div class="topLeftCorner" style="top: 0, left: 0"></div>';

        // y axis labels
        heatmapHTML += '<ul class="yAxisLabel" id="yAxisLabel" data-bind="style: { top: 0, left: 0 }" onmouseup="ko.dataFor(this).handleMouseup()">';
        heatmapHTML += this.createYAxisLabels();
        heatmapHTML += '</div>';

        // cells
        heatmapHTML += '<div class="noHighlight cellContainer">';
        heatmapHTML += '<div class="innerCellContainer" onmousewheel="ko.dataFor(this).handleScroll()">';
        heatmapHTML += '<div id="heatmapHorizontalVirtualScroll" style="width:calc(100% - 18px); height:20px; position: absolute; bottom: 0; left: 1px; overflow-x: scroll; overflow-y: hidden" onscroll="ko.dataFor(this).handleHorizontalVirtualScroll()">' +
        '<div style="width: ' + (this.heatmap.columns.length * this.cellWidth + this.heatmap.rowLabelWidth() + this.extraLabelPadding) + 'px; height: 20px"></div></div>';
        heatmapHTML += '<table class="heatmapCells" id="heatmapCells" onmousewheel="ko.dataFor(this).handleScroll()" onmousedown="ko.dataFor(this).handleHeatmapMousedown()" onmouseup="ko.dataFor(this).handleMouseup()"><tbody>';
        heatmapHTML += this.createHeatmapCells();
        heatmapHTML += "</tbody></table></div></div>";

        document.getElementById('heatmap').innerHTML = heatmapHTML;
        this.initializeElementDimensions();
        this.drawScale();
    }

    private initializeElementDimensions(): void {
        this.xAxisWidth = this.cellWidth * this.heatmap.columns.length;
        this.yAxisWidth = this.heatmap.rowLabelWidth() + this.extraLabelPadding;
        this.yAxisHeight = this.rowsVisible * this.cellWidth + this.xAxisHeight;
        this.heatmapHeight = + this.xAxisHeight;

        // set heights for container, top left, axes, etc
        $(".topLeftCorner").height(this.xAxisHeight - 1 + 'px');
        $(".topLeftCorner").width(this.yAxisWidth - 1 + 'px');
        $(".innerCellContainer").height(this.yAxisHeight + this.xAxisHeight + 'px');
        $(".heatmapCells").css({ left: this.yAxisWidth - 1, top: this.xAxisHeight - 1 });
        $('.xAxisLabel').css({ left: this.yAxisWidth - 1, top: 0 });
        $('.yAxisLabel').css({ top: this.xAxisHeight });
        $('.yAxisLabel').css({ width: this.yAxisWidth });
    }

    private createXAxisLabels(): string {
        var colIdx = 0 + this.currentColumn;
        var xAxisLabelsHTML = '';
        for (var j = 0; j < Math.min(this.columnsVisible, this.heatmap.columns.length); j++) {
            var column = this.heatmap.columns[colIdx];
            var percentCompleted = this.heatmap.columns[colIdx].percentCompleted;
            var pixelsCompleted = Math.ceil(percentCompleted / 100 * 30);
            var background = percentCompleted == 100 ? 'white' : 'linear-gradient(0deg, white ' + pixelsCompleted + 'px,  #ddd ' + pixelsCompleted + 'px)';
            xAxisLabelsHTML += '<td title="' + percentCompleted + '% Complete" style="background: ' + background + '" onmousedown="ko.dataFor(this).handleColumnClick(' + colIdx + ')"><div class="rotate timeLabel ' + (column.prettyPrintDate ? 'timeLabelWithDate' : '') + '">' + column.prettyPrintedTime() + '</div></td>';
            colIdx++;
        }
        return xAxisLabelsHTML;
    }

    private createYAxisLabels(): string {
        var rowIdx = this.currentRow;
        var yAxisLabelsHTML = '';
        var i = 0;
        while ((i < Math.min(this.rowsVisible, this.heatmap.rows.length)) && (rowIdx != this.heatmap.rows.length)) {
            // only render if row has active hits in it
            var row = this.heatmap.rows[rowIdx];
            if (this.heatmap.rows[rowIdx].isInFilter && this.heatmap.rows[rowIdx].hasActiveHits()) {
                yAxisLabelsHTML += '<li onmouseup="ko.dataFor(this).handleRowClick(' + rowIdx + ')" class="rowLabel hmRow' + (rowIdx) + '"><span class="tableName">' + row.markedEventSourceName + '</span></li>';
                i++;
            }
            rowIdx++;
        }
        return yAxisLabelsHTML;
    }

    private createHeatmapCells(): string {
        var rowIdx = this.currentRow;
        var colIdx = this.currentColumn;
        var cellsHTML = '';
        var i = 0;
        while ((i < Math.min(this.rowsVisible, this.heatmap.rows.length)) && (rowIdx != this.heatmap.rows.length)) {
            var row = this.heatmap.rows[rowIdx];
            if (row && row.isInFilter && this.heatmap.rows[rowIdx].hasActiveHits()) {
                cellsHTML += '<tr class="hmRow' + (i + this.currentRow) + '">';
                for (var j = 0; j < Math.min(this.columnsVisible, this.heatmap.columns.length); j++) {
                    var cell = row.cells[colIdx];
                    var cellColor = '<ul>';
                    if (cell.hit) {
                        var h = (1.0 - cell.hit.relativeMeasure) * 240
                        var color = "hsla(" + h + ", 100%, 50%, 1)";
                        cellColor = '<li style="height:100%; background-color:' + color + '"></li>';
                    }
                    cellsHTML += '<td class="cell" onmouseover="ko.dataFor(this).handleCellMouseover(' + rowIdx + ',' + colIdx + ')" onmousedown="ko.dataFor(this).handleCellMousedown(' + rowIdx + ',' + colIdx + ')"><div id="' + cell.overlayId() + '"class="selectedOverlay" style="display: ' + (cell.selected ? 'block' : 'none') + '"></div><ul style="opacity: ' + Math.max(.1, (this.heatmap.columns[colIdx].percentCompleted / 100)) + '">';
                    cellsHTML = cellsHTML.concat(cellColor) + '</ul></td>';
                    colIdx++;
                }
                i++;
            }
            rowIdx++;
            colIdx = this.currentColumn;
            cellsHTML += '</tr>';
        }
        return cellsHTML;
    }

    public drawScale = () => {
        var scaleHTML = '<div class="heatmapLegendLabel">' + d3.format('.2s')(this.heatmap.maxMeasure) + '</div>';
        for (var i = 0; i < 80; i++) {
            var h = i / 80 * 240;
            var color = "hsla(" + h + ", 100%, 50%, 1)";
            scaleHTML += '<div class="heatmapLegendColorBar" style="background-color:' + color + '"></div>';
        }
        scaleHTML += '<div class="heatmapLegendLabel">' + d3.format('.2s')(this.heatmap.minMeasure) + '</div>';
        $('#heatmapLegend').html(scaleHTML);
    }

    // Multiselect methods
    public handleCellMousedown = function (rowIdx, colIdx) {
        this.exploreMenu.style("display", "none");
        this.singleDimensionExploreMenu.style("display", "none");
        this.andGroupByMenu.style("display", "none");
        if (!this.heatmap.rows[rowIdx].cells[colIdx].selected || !this.isRightClick(event))
            this.heatmap.handleCellMousedown(rowIdx, colIdx, event);
    }

    public handleCellMouseover = function (rowIdx, colIdx) {
        this.heatmap.handleCellMouseover(rowIdx, colIdx);
        var cell = this.heatmap.rows[rowIdx].cells[colIdx];
        var hit = cell.hit;
        if (!this.heatmap.mouseIsDown && hit && !cell.selected) {
            clearTimeout(this.tooltipTimer);
            var event2: any;
            event2 = event;
            this.tooltipTimer = setTimeout(() => {
                // show tooltip
                var dimensionCount = 1;
                try { dimensionCount = JSON.parse(this.heatmap.rows[rowIdx].eventSourceName).keys.length }
                catch (e) { }
                var dimensionName = this.heatmap.rows[rowIdx].eventSourceName;
                var dimensionTitle = dimensionCount > 1 ? dimensionCount + ' members <br/>' + dimensionName : dimensionName;
                var tooltipHTML = hit.eventCount == 0 ? dimensionTitle + '<br/>' + this.heatmap.columns[colIdx].prettyPrintedBarChartTime() + '<br/><b>No Events</b>' : (this.heatmap.measure != 'Event Count' ? (dimensionTitle + '<br/>' + this.heatmap.columns[colIdx].prettyPrintedTime() + '<br/>avg: <b>' + hit.measure + '</b> <br/>min: ' + hit.minMeasure + '<br/>max: ' + hit.maxMeasure) : (dimensionTitle + '<br/>' + this.heatmap.columns[colIdx].prettyPrintedTime() + '<br/>Event Count: <b>' + hit.measure + '</b>'));
                this.tooltip.html(tooltipHTML);
                this.tooltip.style("top", (event2.pageY - 20 - $('.rdxTopPanel').height() + $('.resultsPanel').scrollTop()) + "px");
                var x = event2.clientX;
                var leftOffset = 0;
                var tooltipWidth = this.heatmap.rowLabelWidth();
                if ($(window).width() < (x + tooltipWidth + 50)) {
                    leftOffset = $('#heatmapTooltip').width() + 20;
                }
                this.tooltip.style("left", (event2.pageX) - leftOffset + "px");
                $('#heatmapTooltip').fadeIn(250);
            }, 350)
        }
        else {
            this.hideTooltip();
        }
    }

    public handleHeatmapMousedown = function () {
        this.heatmap.mouseDown();
    }

    public handleRowClick = function (rowIdx) {
        if (!this.isRightClick(event))
            this.heatmap.handleRowClick(rowIdx, event);
        else {
            this.selectedRowIdx = rowIdx;
            this.showSingleDimensionExploreMenu();
            event.stopPropagation();
        }
    }

    public exploreDimension = () => {
        this.heatmap.unselectAllCells();
        this.andGroupByMenu.style('display', 'none');
        this.heatmap.handleRowClick(this.selectedRowIdx, event);
        this.rdxContext.streamEventsFromHeatmap();
    }

    public filterByDimension = (dimension = '') => {
        var dimensionName = this.heatmap.rows[this.selectedRowIdx].eventSourceName;
        if (this.rdxContext.predicate.predicateText() == '*.*')
            this.rdxContext.predicate.predicateText('');
        var prependedPredicateText = this.rdxContext.predicate.predicateText() ? this.rdxContext.predicate.predicateText() + ' AND ' : '';
        try {
            var dimemsionAsObject = JSON.parse(dimensionName);
            var keys = dimemsionAsObject.keys.join(' ');
            this.rdxContext.predicate.predicateText(prependedPredicateText + '*.' + this.heatmap.dimension + ' LIKE_ANY ' + keys);
        }
        catch (e) {
            if (this.heatmap.dimension != 'EventSourceName') {
                this.rdxContext.predicate.predicateText(prependedPredicateText + '*.' + this.heatmap.dimension + ' = ' + dimensionName);
            }
            else {
                this.rdxContext.predicate.predicateText(prependedPredicateText + dimensionName + '.*');
            }
        }
        if (dimension)
            this.rdxContext.dimension(dimension);
        this.rdxContext.streamEventSourceHits();
    }

    // for split by
    public groupByAndFilter = dimension => {
        this.rdxContext.telemetryClient.logUserAction('splitBy', { visualiztion: 'heatmap' });
        this.singleDimensionExploreMenu.style("display", "none");
        this.andGroupByMenu.style("display", "none");
        this.filterByDimension(dimension);
    }

    public handleColumnClick = function (colIdx) {
        this.heatmap.handleColumnClick(colIdx, event);
    }

    // Scroll methods
    public drawHeatmapForScroll = function (isVertical) {
        this.exploreMenu.style('display', 'none');
        this.hideTooltip();
        if (!isVertical)
            document.getElementById('xAxisLabel').innerHTML = this.createXAxisLabels();
        else
            document.getElementById('yAxisLabel').innerHTML = this.createYAxisLabels();
        document.getElementById('heatmapCells').innerHTML = this.createHeatmapCells();
        this.pendingScrollActions = 0;
    }

    public handleHorizontalVirtualScroll = function () {
        window.clearTimeout(this.redrawTimeout);
        this.pendingScrollActions++;
        this.currentColumn = Math.min(this.heatmap.columns.length - this.columnsVisible, Math.round($("#heatmapHorizontalVirtualScroll").scrollLeft() / this.cellWidth));
        if (this.pendingScrollActions < this.maxPendingScrollActions)
            this.redrawTimeout = window.setTimeout(() => { this.drawHeatmapForScroll(false); }, 30);
        else
            this.drawHeatmapForScroll(false);
    }

    public handleVirtualScroll = function () {
        window.clearTimeout(this.redrawTimeout);
        this.pendingScrollActions++;
        this.currentRow = Math.min(Math.max(this.heatmap.rows.length - this.rowsVisible, 0), Math.round($("#heatmapVerticalVirtualScroll").scrollTop() / this.cellWidth));
        if (this.pendingScrollActions < this.maxPendingScrollActions)
            this.redrawTimeout = window.setTimeout(() => { this.drawHeatmapForScroll(true); }, 30);
        else
            this.drawHeatmapForScroll(true);
    }

    public handleScroll = function () {
        var event2: any;
        event2 = event;
        event2.preventDefault();
        if (event2 && event2.wheelDelta) {
            var rowsScrolled = event2.wheelDelta / 30;
            this.currentRow += -1 * rowsScrolled;
            this.currentRow = Math.max(0, this.currentRow);
            this.currentRow = Math.min(this.heatmap.rows.length - this.rowsVisible, this.currentRow);
            $("#heatmapVerticalVirtualScroll").scrollTop(this.currentRow * this.cellWidth);
        }
    }

    public handleMouseup = () => {
        if (this.isRightClick(event)) {
            var event2: any;
            event2 = event;
            var x = event2.clientX;
            var leftOffset = 0; // so it doesnt run off the page
            var exploreMenuWidth = $('#heatmapExploreMenu').width();
            if ($(window).width() < (x + exploreMenuWidth + 50))
                leftOffset = exploreMenuWidth;
            this.exploreMenu.style("top", (event2.pageY - 40 - $('.rdxTopPanel').height() + $('.resultsPanel').scrollTop()) + "px");
            this.exploreMenu.style("left", (event2.pageX) - leftOffset + "px");
            this.exploreMenu.style("display", "block");
        }
    }

    public showSingleDimensionExploreMenu = () => {
        var evt = <any>event;
        var x = evt.clientX;
        var leftOffset = 0; // so it doesnt run off the page
        var exploreMenuWidth = $('#crystalHeatmapZoomExploreMenu').width();
        if ($(window).width() < (x + exploreMenuWidth + 50))
            leftOffset = exploreMenuWidth;
        this.singleDimensionExploreMenu.style("top", (evt.pageY - 40 - $('.rdxTopPanel').height() + $('.resultsPanel').scrollTop()) + "px");
        this.singleDimensionExploreMenu.style("left", (evt.pageX) - leftOffset + "px");
        this.singleDimensionExploreMenu.style("display", "block");
        this.closeExploreMenu();
        this.andGroupByMenu.style("display", "none");
    }

    public showAndGroupByMenu = () => {
        var width = $('#crystalHeatmapZoomExploreMenu').width();
        var left = this.singleDimensionExploreMenu.style('left');
        left = parseFloat(left.slice(0, -2)) + width - 4 + 'px';
        this.andGroupByMenu.style("top", this.singleDimensionExploreMenu.style('top'));
        this.andGroupByMenu.style("left", left);
        this.andGroupByMenu.style("display", "block");
    }

    public hideAndGroupByMenu = () => {
        this.andGroupByMenu.style("display", "none");
    }

    public closeSingleDimensionExploreMenu = () => {
        if (this.andGroupByMenu)
            this.andGroupByMenu.style("display", "none");
        if (this.singleDimensionExploreMenu)
            this.singleDimensionExploreMenu.style("display", "none");
    }

    public closeExploreMenu = () => {
        this.heatmap.unselectAllCells();
        this.heatmap.setEventsSelectedCount();
        if (this.exploreMenu)
            this.exploreMenu.style("display", "none");
    }

    public hideTooltip = () => {
        clearTimeout(this.tooltipTimer);
        if (this.tooltip)
            this.tooltip.style("display", "none");
    }

    private isRightClick = ev => {
        var isRightMB;
        var e = <any>ev;
        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3;
        else if ("button" in e)  // IE, Opera 
            isRightMB = e.button == 2;
        return isRightMB;
    }
}
