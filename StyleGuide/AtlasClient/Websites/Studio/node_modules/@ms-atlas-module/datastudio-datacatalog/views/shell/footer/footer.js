/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "text!./footer.html", "css!./footer.css"], function (require, exports) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var Logging = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    exports.template = require("text!./footer.html");
    var viewModel = (function () {
        function viewModel() {
            this.resx = resx;
            this.logger = Logging.getLogger({ category: "Shell Components" });
            this.giveFeedbackUri = "mailto:ADCFeedback@microsoft.com?subject=" + encodeURI(resx.giveFeedbackSubject) + "&body=" + encodeURI(resx.giveFeedbackBody);
            this.getADemoUri = "mailto:ADCDemo@microsoft.com?subject=" + encodeURI(resx.getADemoSubject) + "&body=" + encodeURI(resx.getADemoBody);
            this.askAQuestionUri = "mailto:ADCQuestion@microsoft.com?subject=" + encodeURI(resx.askAQuestionSubject) + "&body=" + encodeURI(resx.askAQuestionBody);
        }
        viewModel.prototype.logFooterAction = function (data, event) {
            var target = $(event.target);
            var footerActionName = target.data("action");
            var footerText = target.text();
            this.logger.logInfo("footer action (" + (footerActionName || footerText) + ")");
            return true;
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=footer.js.map