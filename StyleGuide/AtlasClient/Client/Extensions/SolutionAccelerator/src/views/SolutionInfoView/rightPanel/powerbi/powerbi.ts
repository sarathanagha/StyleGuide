/// <reference path="../../../../References.d.ts" />
/// <amd-dependency path="text!./powerbi.html" />
/// <amd-dependency path="css!./powerbi.css" />

export var template: string = require("text!./powerbi.html");

import Managers = Microsoft.DataStudio.SolutionAccelerator.Managers;
import GraphNodeStatus = Microsoft.DataStudio.SolutionAccelerator.Model.Graph.GraphNodeStatus;
import NodeExtension = require("../../NodeExtension");
import LoggerFactory = Microsoft.DataStudio.SolutionAccelerator.LoggerFactory;
import Logging = Microsoft.DataStudio.Diagnostics.Logging;
var logger = LoggerFactory.getLogger({ loggerName: "RightPanel_PowerBI", category: "ViewModel" });

// This is a temporary work around to customize the powerBI content in the left panel
export class viewModel
{
    /* Static view properties */
    public details: string;

    /* Observables */
    public status: KnockoutObservable<string>;

    /* Computed Observables */
    public resourceUrl: KnockoutComputed<string>;
    public name: KnockoutComputed<string>;
    public urlAvailable: KnockoutComputed<boolean>;

    constructor(params: NodeExtension.NodeExtensionViewModel)
    {
        var self = this;
        self.details = params.staticData.details;
        self.status = params.status;

        self.resourceUrl = ko.pureComputed(() => (params.resource() && params.resource().ResourceUrl) ? params.resource().ResourceUrl : '');

        self.name = ko.computed(() => {
            if (params.resource && params.resource() && params.resource().ResourceName) {
                return params.resource().ResourceName;
            } else if (params.staticData.name) {
                return params.staticData.name;
            } else {
                return 'Unknown';
            }
        });

        self.urlAvailable = ko.computed(() => !!self.resourceUrl && !!self.resourceUrl());
        logger.logUsage(Logging.UsageEventType.Custom, "RightPanel_PowerBI_Launch", { panelName: self.name() });
    }
}