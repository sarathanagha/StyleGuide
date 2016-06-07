/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./grid.html" />
/// <amd-dependency path="css!./grid.css" />

export var template: string = require("text!./grid.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');

export class viewModel {
    public grid: Models.Grid;
    public rdxContext: Models.RdxContext;
    public rerenderTrigger: KnockoutComputed<boolean>;
    private currentBottomRow = 0;
    private pageSize = 50;
    public visible: KnockoutObservable<boolean> = ko.observable(true);
    public showingSingleColumnValues: KnockoutObservable<any> = ko.observable(false);
    public columnsInChart: Array<string> = [];

    constructor(params: any) {
        this.grid = params.rdxContext.grid;
        this.rdxContext = params.rdxContext;

        // handles grid rerender
        this.grid.rerenderTrigger.subscribe(() => {
            if (this.grid.rows.length) {
                this.columnsInChart = [];
                
                // default to showing a grid of of all the columns, except time columns
                if (!this.columnsInChart.length) {
                    var columnsCount = 0;
                    for (var columnName in this.grid.columns) {
                        if (columnName != 'EventSourceName' && columnName.indexOf('time') == -1) {
                            this.columnsInChart.push(columnName);
                        }
                    }
                }

                this.rerender();
            } else {
                $(".grid").html("");
                $(".columns").html("");
                $(".gridChart").html("");
            }
        });
    }

    public rerender(): void {
        this.currentBottomRow = 0;

        if (this.columnsInChart.length == 0) {
            // flat view
            var gridHtml = "<table id='gridTable'><tr><th>Timestamp</th><th>EventSourceName</th><th>Values</th></tr>";
            for (var rowIdx = 0; rowIdx < Math.min(this.grid.rows.length, this.pageSize); rowIdx++) {
                gridHtml += '<tr><td>' + this.grid.rows[rowIdx].timestamp + '</td><td>' + this.grid.rows[rowIdx].EventSourceName + '</td><td>';
                for (var propName in this.grid.rows[rowIdx]) {
                    if (propName != 'timestamp' && propName != 'EventSourceName') {
                        gridHtml += '<b>' + propName + '</b>:' + this.grid.rows[rowIdx][propName] + '&nbsp;';
                    }
                }
                gridHtml += '</td></tr>';
            }
            gridHtml += "</table>";
            $(".grid").html(gridHtml);
            this.currentBottomRow = Math.min(this.grid.rows.length, this.pageSize);

            var i = 0;
            var columnHtml = 'All Columns<ul class="columnValues">';
            var columnNames = Object.keys(this.grid.columns).sort();
            for (var colNameIdx in columnNames) {
                var colName = columnNames[colNameIdx];
                if (colName != 'EventSourceName') {
                    var statsId = 'colStats_' + i;
                    columnHtml += '<li onclick="ko.dataFor(this).toggleUniqueColumnValues(\'' + colName + '\', \'' + statsId + '\')">' + colName + '<span class="fa fa-plus right" onclick="ko.dataFor(this).addColumn(\'' + colName + '\')"></span><ul id="' + statsId + '" style="display:none"></ul></li>';
                    i++;
                }
            }
            columnHtml += '</ul>';
            $('.columns').html(columnHtml);
        } else {
            // grid view
            var gridHtml = "<table id='gridTable'><tr><th>Timestamp</th><th>EventSourceName</th>";
            this.columnsInChart.sort().forEach(columnName => {
                gridHtml += "<th>" + columnName + "</th>";
            });
            gridHtml += "</tr>";
            for (var rowIdx = 0; rowIdx < Math.min(this.grid.rows.length, this.pageSize); rowIdx++) {
                gridHtml += '<tr><td>' + this.grid.rows[rowIdx].timestamp + '</td><td>' + this.grid.rows[rowIdx].EventSourceName + '</td>';
                this.columnsInChart.sort().forEach(propName => {
                    if (this.grid.rows[rowIdx].hasOwnProperty(propName)) {
                        gridHtml += '<td>' + this.grid.rows[rowIdx][propName] + '</td>';
                    } else {
                        gridHtml += '<td></td>';
                    }
                });
                gridHtml += '</tr>';
            }
            gridHtml += "</table>";
            $(".grid").html(gridHtml);
            this.currentBottomRow = Math.min(this.grid.rows.length, this.pageSize);

            var i = 0;
            var columnHtml = 'Columns in Grid<ul class="columnValues">';
            this.columnsInChart.sort().forEach(colName => {
                var statsId = 'colStats_' + i;
                columnHtml += '<li><span id="chevron' + statsId + '" class="ib chevron-up" onclick="ko.dataFor(this).toggleUniqueColumnValues(\'' + colName + '\', \'' + statsId + '\')"></span>' + colName + '<span class="fa fa-minus right" onclick="ko.dataFor(this).removeColumn(\'' + colName + '\')"></span><ul id="' + statsId + '" style="display:none"></ul></li>';
                i++;
            });

            columnHtml += '</ul><hr/>Other Columns<ul class="columnValues">';
            var columnNames = Object.keys(this.grid.columns).sort();
            for (var colNameIdx in columnNames) {
                var colName = columnNames[colNameIdx];
                if (this.columnsInChart.indexOf(colName) == -1 && colName != 'EventSourceName') {
                    var statsId = 'colStats_' + i;
                    columnHtml += '<li><span id="chevron' + statsId + '" class="ib chevron-up" onclick="ko.dataFor(this).toggleUniqueColumnValues(\'' + colName + '\', \'' + statsId + '\')"></span>' + colName + '<span class="fa fa-plus right" onclick="ko.dataFor(this).addColumn(\'' + colName + '\')"></span><ul id="' + statsId + '" style="display:none"></ul></li>';
                    i++;
                }
            }
            columnHtml += '</ul>';
            $('.columns').html(columnHtml);
        }

    }

    public addColumn(columnName: string): void {
        event.stopPropagation();
        this.columnsInChart.push(columnName);
        this.rerender();
    }

    public removeColumn(columnName: string): void {
        event.stopPropagation();
        var idx = this.columnsInChart.indexOf(columnName);
        this.columnsInChart.splice(idx, 1);
        this.rerender();
    }

    public infiniteScroll (): void {
        if (!(this.currentBottomRow == this.grid.rows.length)) {
            if (this.columnsInChart.length == 0) {
                // flat view
                var rowsHtml = '';
                for (var rowIdx = this.currentBottomRow; rowIdx < Math.min(this.grid.rows.length, this.pageSize + this.currentBottomRow); rowIdx++) {
                    rowsHtml += '<tr><td>' + this.grid.rows[rowIdx].timestamp + '</td><td>' + this.grid.rows[rowIdx].EventSourceName + '</td><td>';
                    for (var propName in this.grid.rows[rowIdx]) {
                        if (propName != 'timestamp' && propName != 'EventSourceName') {
                            rowsHtml += '<b>' + propName + '</b>:' + this.grid.rows[rowIdx][propName];
                        }
                    }
                    rowsHtml += '</td></tr>';
                }
                $("#gridTable tr:last").after(rowsHtml);
            } else {
                // grid view
                var rowsHtml = '';
                for (var rowIdx = this.currentBottomRow; rowIdx < Math.min(this.grid.rows.length, this.pageSize + this.currentBottomRow); rowIdx++) {
                        rowsHtml += '<tr><td>' + this.grid.rows[rowIdx].timestamp + '</td><td>' + this.grid.rows[rowIdx].EventSourceName + '</td>';
                        this.columnsInChart.sort().forEach(propName => {
                            if (this.grid.rows[rowIdx].hasOwnProperty(propName)) {
                                rowsHtml += '<td>' + this.grid.rows[rowIdx][propName] + '</td>';
                            } else {
                                rowsHtml += '<td></td>';
                            }
                        });
                        rowsHtml += '</tr>';
                    }
                $("#gridTable tr:last").after(rowsHtml);
            }
            this.currentBottomRow = Math.min(this.grid.rows.length, this.pageSize + this.currentBottomRow);
        }
    }

    public toggleUniqueColumnValues(columnName: string, id: string): void {
        if ($('#' + id).is(':visible')) {
            $('#' + id).slideUp();
            $('#chevron' + id).removeClass('chevron-down');
            $('#chevron' + id).addClass('chevron-up');
            return;
        }
        $('#chevron' + id).removeClass('chevron-up');
        $('#chevron' + id).addClass('chevron-down');

        var columnStats = {};
        this.grid.rows.forEach(function(row) {
            if (row.hasOwnProperty(columnName)) {
                if (!columnStats.hasOwnProperty(row[columnName])) {
                    columnStats[row[columnName]] = 0;
                }
                columnStats[row[columnName]]++;
            }
        });

        var columnStatsArray = [];
        for (var columnValue in columnStats) {
            columnStatsArray.push({ value: columnValue, count: columnStats[columnValue] });
        }

        columnStatsArray.sort((a, b) => { return b.count - a.count; });

        var statsHtml = '';
        for (var columnValueIdx in columnStatsArray) {
            var percent = Math.round(100 * columnStatsArray[columnValueIdx].count / columnStatsArray[0].count);
            statsHtml += '<li class="uniqueColumnValue" style="background:linear-gradient(to right, #E6E6E6 ' + percent + '%, transparent ' + percent + '%)"></span><span class="uniqueValue"><b>' + columnStatsArray[columnValueIdx].count + '</b>: ' + columnStatsArray[columnValueIdx].value + '</span><span class="fa fa-search right" onclick="ko.dataFor(this).rdxContext.andValue(\'' + columnStatsArray[columnValueIdx].value.replace(/\\/g, "\\\\") + '\')"></span></li>';
        }

        $('#' + id).html(statsHtml);
        $('#' + id).slideDown();
    }

    // prevents bubbling in case we are at the top of the grid
    public handleMousewheel(className: string) {
        var event2: any;
        event2 = event;
        if ($('.' + className).scrollTop() + 1000 > $('#gridTable').height()) {
            this.infiniteScroll();
        }

        if ($('.' + className).scrollTop() == 0 && event2.wheelDelta > 0) {
            event2.stopPropagation();
            event2.preventDefault();
            event2.returnValue = false;
            return false;
        }
    }
}