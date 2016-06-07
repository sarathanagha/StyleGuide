/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./paging.html" />
/// <amd-dependency path="css!./paging.css" />

import $ = require("jquery");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import IPagingParameters = Microsoft.DataStudio.DataCatalog.Interfaces.IPagingParameters;

export var template: string = require("text!./paging.html");

export class viewModel {
    public resx = resx;
    public totalResults: number;
    public currentPage: number;
    public itemsPerPage: number;
    public onPagingChanged: (newPage: number) => void;

    public firstPage: number;
    public lastPage: number;

    // Zero is an invalid page number and also falsey
    public firstBoxNumber = 0;
    public secondBoxNumber = 0;
    public thirdBoxNumber = 0;

    constructor(parameters: IPagingParameters) {
        var self = this;

        self.totalResults = parameters.totalResults;
        self.currentPage = parameters.currentPage;
        self.itemsPerPage = parameters.itemsPerPage;
        self.onPagingChanged = parameters.onPagingChanged;

        self.firstPage = 1;
        self.lastPage = Math.ceil(self.totalResults / self.itemsPerPage);

        var windowSize = 3;
        var roomToMove = Math.min(self.lastPage - self.currentPage, windowSize);
        var offSet = windowSize - roomToMove;
        var startPageWindow = self.currentPage - offSet;
        startPageWindow = Math.max(startPageWindow, 2);

        if (startPageWindow < self.lastPage) {
            self.firstBoxNumber = startPageWindow;
        }

        startPageWindow++;

        if (startPageWindow < self.lastPage) {
            self.secondBoxNumber = startPageWindow;
        }

        startPageWindow++;

        if (startPageWindow < self.lastPage) {
            self.thirdBoxNumber = startPageWindow;
        }
    }

    arrowBack(data, event) {
        var newPage = this.currentPage - 1;
        this.onPagingChanged(newPage);
    }

    arrowNext(data, event) {
        var newPage = this.currentPage + 1;
        this.onPagingChanged(newPage);
    }

    pageClick(data, event) {
        var newPage = parseInt($(event.target).text(), 10);
        this.onPagingChanged(newPage);
    }
}