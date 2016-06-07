/// <reference path="../../References.d.ts" />
/// <reference path="../../module.d.ts" />
/// <amd-dependency path="text!./heatmapOverview.html" />
/// <amd-dependency path="css!./heatmapOverview.css" />
import ko = require("knockout");
export var template: string = require("text!./heatmapOverview.html");
import Controls = Microsoft.DataStudio.UxShell.Controls;
import Models = Microsoft.DataStudio.Crystal.Models;

export class viewModel {
    public heatmap: Models.Heatmap;
    public rdxContext: Models.RdxContext;
    public filteredRows: Array<Models.HeatmapRow> = [];
    public rowIndexToFilteredRowIndexMapping = {};
    public exploreMenu: any;
    public tooltip: any;
    public tooltipTimer: any;
    public moduloForSmoothSquares = { x: 0, y: 0 };
    public dimensionForFilter = ko.observable('');
    private cellWidth = 1;
    private cellHeight = 1;
    private mouseDownCoordinates: any;
    private lastTooltippedIndices: any = { rowIdx: 0, colIdx: 0 };
    private firstCellDownIndices = { rowIdx: 0, colIdx: 0 };
    private lastHoveredCellIndices = { rowIdx: 0, colIdx: 0 };
    private hoverLightness = '30%';
    private selectedLightness = '20%';
    private targetHeight = 400;
    private targetWidth = 1600;

    constructor(params: any) {
        this.rdxContext = params.rdxContext;
        this.heatmap = params.rdxContext.heatmap;

        // handles heatmap overview rerendering
        this.heatmap.rerenderTrigger.subscribe(() => {
            if (this.heatmap.selectedVisualization() == 'overview') {
                if (this.heatmap.rows.length && this.heatmap.columns.length) {
                    this.lastTooltippedIndices = { rowIdx: 0, colIdx: 0 };
                    this.closeExploreMenu();
                    var canvas = <any>document.getElementById('heatmapOverviewCanvas');
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    this.rerender();
                    $('.heatmapOverviewCanvasWrapper').css('opacity', 1);
                }
                else {
                    $('.heatmapOverviewCanvasWrapper').css('opacity', 0);
                }
                this.dimensionForFilter(this.heatmap.dimension);
                this.heatmap.unselectAllCells();
            }
        });
    }

    public rerender = () => {
        this.targetHeight = $('.heatmapOverviewCanvasWrapper').height();
        this.targetWidth = $('.heatmapOverviewCanvasWrapper').width();
        this.tooltip = d3.select("#heatmapOverviewTooltip");
        this.exploreMenu = d3.select("#heatmapOverviewExploreMenu");
        $('.overviewXAxisLabel').css({ left: Math.max((this.targetWidth / 2 - 200), 360) + 'px' });

        this.rowIndexToFilteredRowIndexMapping = {};
        this.filteredRows = this.heatmap.rows.filter(r => { return r.isInFilter; });
        this.filteredRows.forEach((r, idx) => { this.rowIndexToFilteredRowIndexMapping[r.cells[0].rowIdx] = idx; });

        this.cellWidth = Math.max(Math.floor(this.targetWidth / this.heatmap.columns.length), 1);
        this.cellHeight = Math.min(25, Math.max(Math.floor(this.targetHeight / this.filteredRows.length), 1));
        var width = this.targetWidth;
        var height = this.targetHeight;

        // determine if we need scroll bars or not
        if (this.cellWidth == 1 || this.cellHeight == 1) {
            var width = this.cellWidth == 1 ? this.heatmap.columns.length : this.targetWidth;
            var height = this.targetHeight / this.filteredRows.length >= 1 ? this.targetHeight : this.filteredRows.length;
            if (!(this.targetHeight / this.filteredRows.length >= 1))
                $('.heatmapOverviewCanvasWrapper').css({ 'overflow-y': 'auto' });
        }
        else {
            $('.heatmapOverviewCanvasWrapper').css({ overflow: 'hidden' });
        }

        this.moduloForSmoothSquares = { x: this.cellWidth != 1 ? this.targetWidth - this.cellWidth * this.heatmap.columns.length : 0, y: this.targetHeight / this.filteredRows.length >= 1 ? this.targetHeight - this.cellHeight * this.filteredRows.length : 1 };
        $('#heatmapOverviewCanvas').attr('height', height);
        $('#heatmapOverviewCanvas').attr('width', width);
        var canvas = <any>document.getElementById('heatmapOverviewCanvas');
        var ctx = canvas.getContext('2d');
        this.filteredRows.forEach((row, rowIdx) => {
            row.cells.forEach((cell, cellIdx) => {
                var color = 'white';
                if (cell.hit) {
                    var h = (1.0 - cell.hit.relativeMeasure) * 240
                    var color = "hsla(" + h + ", 100%, " + (cell.selected ? this.selectedLightness : "50%") + ", 1)";
                }
                this.fillRectangle(cellIdx, rowIdx, color);
            });
        });
        this.drawScale();

        canvas.removeEventListener('mousemove', this.handleMousemove);
        canvas.removeEventListener('mousedown', this.handleCellMousedown);
        canvas.addEventListener('mousemove', this.handleMousemove);
        canvas.addEventListener('mousedown', this.handleCellMousedown);
    }

    public drawScale = () => {
        var scaleHTML = '<div class="heatmapLegendLabel">' + d3.format('.2s')(this.heatmap.maxMeasure) + '</div>';
        for (var i = 0; i < 80; i++) {
            var h = i / 80 * 240;
            var color = "hsla(" + h + ", 100%, 50%, 1)";
            scaleHTML += '<div class="heatmapLegendColorBar" style="background-color:' + color + '"></div>';
        }
        scaleHTML += '<div class="heatmapLegendLabel">' + d3.format('.2s')(this.heatmap.minMeasure) + '</div>';
        $('#heatmapOverviewLegend').html(scaleHTML);
    }

    // returns the indices of the cell the mouse is over based on mouse coordinates
    private getRowAndColIdx = (evt) => {
        var canvas = <any>document.getElementById('heatmapOverviewCanvas');
        var rect = canvas.getBoundingClientRect();
        var mousePosition = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
        var rowIdx = 0;
        var colIdx = 0;
        while (mousePosition.y > this.cellHeight) {
            rowIdx++;
            mousePosition.y -= this.cellHeight + (rowIdx < this.moduloForSmoothSquares.y ? 1 : 0);
        }
        while (mousePosition.x > this.cellWidth) {
            colIdx++;
            mousePosition.x -= this.cellWidth + (colIdx < this.moduloForSmoothSquares.x ? 1 : 0);
        }
        return { rowIdx: rowIdx, colIdx: colIdx };
    }

    // handles tooltipping and multiselect if the mouse is down
    public handleMousemove = (evt) => {
        var canvas = <any>document.getElementById('heatmapOverviewCanvas');
        var ctx = canvas.getContext('2d');
        this.exitCellHover();

        var rowAndColIdx = this.getRowAndColIdx(evt);
        var rowIdx = rowAndColIdx.rowIdx, colIdx = rowAndColIdx.colIdx;
        this.hideTooltip();
        this.heatmap.handleCellMouseover(this.filteredRows[rowIdx].cells[0].rowIdx, colIdx);
        var cell = this.filteredRows[rowIdx].cells[colIdx];
        var hit = this.filteredRows[rowIdx].cells[colIdx].hit;

        // for tooltip
        if (!this.heatmap.mouseIsDown && hit) {
            clearTimeout(this.tooltipTimer);
            var event2: any;
            event2 = event;

            this.tooltipTimer = setTimeout(() => {
                // show tooltip
                var dimensionCount = 1;
                try { dimensionCount = JSON.parse(this.filteredRows[rowIdx].eventSourceName).keys.length }
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
                    leftOffset = $('#heatmapOverviewTooltip').width() + 20;
                }
                this.tooltip.style("left", (event2.pageX - leftOffset + "px"));
                $('#heatmapOverviewTooltip').fadeIn(250);
            }, 350);

            // handle entering hover
            this.lastTooltippedIndices = { rowIdx: rowIdx, colIdx: colIdx };
            var cell = this.filteredRows[this.lastTooltippedIndices.rowIdx].cells[this.lastTooltippedIndices.colIdx];
            var color = 'white';
            if (cell.hit) {
                var h = (1.0 - cell.hit.relativeMeasure) * 240
                color = "hsla(" + h + ", 100%, " + this.hoverLightness + ", 1)";
            }
            this.fillRectangle(colIdx, rowIdx, color);
        }

        // multiselect ghost
        if (this.heatmap.mouseIsDown) {
            var selectedCell = { rowIdx: rowIdx, colIdx: colIdx };
            this.multiselect(selectedCell);
            this.lastHoveredCellIndices = selectedCell;
        }
    }

    // Multiselect methods
    public handleCellMousedown = (evt) => {
        this.heatmap.mouseDown();
        this.exploreMenu.style('display', 'none');
        var rowAndColIdx = this.getRowAndColIdx(evt);
        var rowIdx = rowAndColIdx.rowIdx, colIdx = rowAndColIdx.colIdx;
        if (!this.heatmap.rows[rowIdx].cells[colIdx].selected || !this.isRightClick(event)) {
            this.closeExploreMenu();
            this.heatmap.handleCellMousedown(this.filteredRows[rowIdx].cells[0].rowIdx, colIdx, evt);
            this.firstCellDownIndices = { rowIdx: rowIdx, colIdx: colIdx };
            this.lastHoveredCellIndices = { rowIdx: rowIdx, colIdx: colIdx };
            var selectedCell = { rowIdx: rowIdx, colIdx: colIdx };
            this.multiselect(selectedCell);
        }
    }

    // shows the context menu
    public handleMouseup = () => {
        if (this.isRightClick(event)) {
            var event2: any;
            event2 = event;
            var x = event2.clientX;
            var leftOffset = 0; // so it doesnt run off the page
            var exploreMenuWidth = $('#heatmapOverviewExploreMenu').width();
            if ($(window).width() < (x + exploreMenuWidth + 50))
                leftOffset = exploreMenuWidth;
            this.exploreMenu.style("top", (event2.pageY - 40 - $('.rdxTopPanel').height() + $('.resultsPanel').scrollTop()) + "px");
            this.exploreMenu.style("left", (event2.pageX) - leftOffset + "px");
            this.exploreMenu.style("display", "block");
        }
    }

    public hideTooltip = () => {
        this.exitCellHover();
        clearTimeout(this.tooltipTimer);
        if (this.tooltip)
            this.tooltip.style("display", "none");
    }

    // for the actual 'close' option on the context menu
    public closeExploreMenu = () => {
        this.heatmap.selectedCells.forEach((cell) => {
            var color = 'white';
            if (cell.hit) {
                var h = (1.0 - cell.hit.relativeMeasure) * 240
                var color = "hsla(" + h + ", 100%, 50%, 1)";
            }
            this.fillRectangle(cell.colIdx, this.rowIndexToFilteredRowIndexMapping[cell.rowIdx], color);
        })
        this.heatmap.unselectAllCells();
        if (this.exploreMenu)
            this.exploreMenu.style('display', 'none');
    }

    // same multiselect logic as in the Heatmap model
    private multiselect = (currentSelectedCellIndices) => {
        // deselect span between current selected cell and last hovered cell
        var span = this.getSpanExtent(this.firstCellDownIndices, this.lastHoveredCellIndices);
        for (var i = span.minRow; i < span.maxRow + 1; i++) {
            for (var j = span.minCol; j < span.maxCol + 1; j++) {
                var cell = this.filteredRows[i].cells[j];
                var color = 'white';
                if (cell.hit) {
                    var h = (1.0 - cell.hit.relativeMeasure) * 240
                    var color = "hsla(" + h + ", 100%, 50%, 1)";
                }
                this.fillRectangle(j, i, color);
            }
        }

        // select span between first click
        var span = this.getSpanExtent(this.firstCellDownIndices, currentSelectedCellIndices);
        for (var i = span.minRow; i < span.maxRow + 1; i++) {
            for (var j = span.minCol; j < span.maxCol + 1; j++) {
                var cell = this.filteredRows[i].cells[j];
                var color = 'white';
                if (cell.hit) {
                    var h = (1.0 - cell.hit.relativeMeasure) * 240
                    var color = "hsla(" + h + ", 100%, " + this.selectedLightness + ", 1)";
                }
                this.fillRectangle(j, i, color);
            }
        }
    }

    private getSpanExtent = function (fromCell, toCell) {
        var first = {
            row: fromCell.rowIdx,
            col: fromCell.colIdx
        };

        var last = {
            row: toCell.rowIdx,
            col: toCell.colIdx
        };

        // find selection range border
        return {
            minRow: Math.min(first.row, last.row),
            maxRow: Math.max(first.row, last.row),
            minCol: Math.min(first.col, last.col),
            maxCol: Math.max(first.col, last.col)
        };
    };

    // fills the rectangle of the given colidx and rowidx with this color
    private fillRectangle = (colIdx, rowIdx, color) => {
        var canvas = <any>document.getElementById('heatmapOverviewCanvas');
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        var x = colIdx * this.cellWidth + (colIdx < this.moduloForSmoothSquares.x ? colIdx : this.moduloForSmoothSquares.x);
        var y = rowIdx * this.cellHeight + (rowIdx < this.moduloForSmoothSquares.y ? rowIdx : this.moduloForSmoothSquares.y)
        var cellWidth = this.cellWidth;
        var cellHeight = this.cellHeight;
        if (colIdx < this.moduloForSmoothSquares.x) {
            cellWidth++;
        }
        if (rowIdx < this.moduloForSmoothSquares.y) {
            cellHeight++;
        }
        ctx.fillRect(x, y, cellWidth, cellHeight);
    }

    private exitCellHover = () => {
        if (this.filteredRows.length) {
            var cell = this.filteredRows[this.lastTooltippedIndices.rowIdx].cells[this.lastTooltippedIndices.colIdx];
            var color = 'white';
            if (cell.hit) {
                var h = (1.0 - cell.hit.relativeMeasure) * 240
                color = "hsla(" + h + ", 100%," + (cell.selected ? this.selectedLightness : "50%") + ", 1)";
            }
            this.fillRectangle(this.lastTooltippedIndices.colIdx, this.lastTooltippedIndices.rowIdx, color);
        }
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

    public dispose(): void {
    }
}
