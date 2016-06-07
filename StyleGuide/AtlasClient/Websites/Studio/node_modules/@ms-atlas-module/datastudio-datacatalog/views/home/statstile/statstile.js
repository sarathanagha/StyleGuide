// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./statstile.html", "css!./statstile.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var homeManager = Microsoft.DataStudio.DataCatalog.Managers.HomeManager;
    exports.template = require("text!./statstile.html");
    var viewModel = (function () {
        function viewModel(params) {
            this.resx = resx;
            this.stats = ko.observableArray([]);
            this.stats = params.items;
            homeManager.statsLabel(resx.didYouKnow);
        }
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=statstile.js.map