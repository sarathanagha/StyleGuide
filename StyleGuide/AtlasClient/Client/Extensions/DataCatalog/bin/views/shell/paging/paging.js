/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "jquery", "text!./paging.html", "css!./paging.css"], function (require, exports, $) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    exports.template = require("text!./paging.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            this.resx = resx;
            // Zero is an invalid page number and also falsey
            this.firstBoxNumber = 0;
            this.secondBoxNumber = 0;
            this.thirdBoxNumber = 0;
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
        viewModel.prototype.arrowBack = function (data, event) {
            var newPage = this.currentPage - 1;
            this.onPagingChanged(newPage);
        };
        viewModel.prototype.arrowNext = function (data, event) {
            var newPage = this.currentPage + 1;
            this.onPagingChanged(newPage);
        };
        viewModel.prototype.pageClick = function (data, event) {
            var newPage = parseInt($(event.target).text(), 10);
            this.onPagingChanged(newPage);
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=paging.js.map