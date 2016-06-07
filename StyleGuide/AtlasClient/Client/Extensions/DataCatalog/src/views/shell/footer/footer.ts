/// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./footer.html" />
/// <amd-dependency path="css!./footer.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import Application = Microsoft.DataStudio.Application;
import Logging = Microsoft.DataStudio.DataCatalog.LoggerFactory;

export var template: string = require("text!./footer.html");

export class viewModel {
    public resx = resx;

    public giveFeedbackUri: string;
    public getADemoUri: string;
    public askAQuestionUri: string;

    private logger = Logging.getLogger({ category: "Shell Components" });

    constructor() {
        this.giveFeedbackUri = "mailto:ADCFeedback@microsoft.com?subject=" + encodeURI(resx.giveFeedbackSubject) + "&body=" + encodeURI(resx.giveFeedbackBody);
        this.getADemoUri = "mailto:ADCDemo@microsoft.com?subject=" + encodeURI(resx.getADemoSubject) + "&body=" + encodeURI(resx.getADemoBody);
        this.askAQuestionUri = "mailto:ADCQuestion@microsoft.com?subject=" + encodeURI(resx.askAQuestionSubject) + "&body=" + encodeURI(resx.askAQuestionBody);
    }

    logFooterAction(data, event: JQueryEventObject) {
        var target = $(event.target);
        var footerActionName = target.data("action");
        var footerText = target.text();
        this.logger.logInfo("footer action (" + (footerActionName || footerText) + ")");
        return true;
    }
}