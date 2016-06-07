/// <reference path="../../references.d.ts" />
/// <amd-dependency path="text!./NodeExtensionTemplate.html" />
/// <amd-dependency path="css!./NodeExtensionTemplate.css" />

import ko = require("knockout");
import GraphControl = require("srcMap!../../Core/DataStudioUX/src/lib/GraphControl/graphControlExternal");
import Managers = Microsoft.DataStudio.SolutionAccelerator.Managers;
import ShellContext = Microsoft.DataStudio.Application.ShellContext;
import Model = Microsoft.DataStudio.SolutionAccelerator.Model;
import SolutionAcceleratorGraphModel = Microsoft.DataStudio.SolutionAccelerator.Model.Graph;
import Application = Microsoft.DataStudio.Application;
import GraphNodeStatus = Microsoft.DataStudio.SolutionAccelerator.Model.Graph.GraphNodeStatus;
import IInstanceReference = Microsoft.DataStudio.Application.IInstanceReference;
import ManagerFactory = Microsoft.DataStudio.Application.ManagerFactory;

export class NodeExtensionViewModel
{
    /* Static view properties - START */
    private graphNodeStatusInprogress: string = SolutionAcceleratorGraphModel.GraphNodeStatus[SolutionAcceleratorGraphModel.GraphNodeStatus.InProgress].toLowerCase();
    private graphNodeStatusFailed: string = SolutionAcceleratorGraphModel.GraphNodeStatus[SolutionAcceleratorGraphModel.GraphNodeStatus.Failed].toLowerCase();

    public staticData: INodeExtension;
    public id: string;
    public isPowerBI: boolean;
    public PanelManagerReference: IInstanceReference;
    public panelManager: Managers.SidePanelManager;
    /* Static view properties - END */

    /* Observables - START */
    public name: string;
    public image: string;
    public resource: KnockoutObservable<Model.Resource>;
    public status: KnockoutObservable<string>;
    public tooltipIsVisible: KnockoutObservable<boolean>;
    /* Observables - END */

    /* Computed Observables - START */
    public resourceUrl: KnockoutComputed<string>;
    public displayClasses: KnockoutComputed<string>;
    public tooltipAvailable: KnockoutComputed<boolean>;
    /* Computed Observables - END */

    // Method: showDetails
    // Opens the right panel and shows the details for the given node
    public showDetails = (): void =>
    {
        var self = this;
        var componentName: string = self.isPowerBI ? Managers.SidePanelManager.powerbiComponentName : Managers.SidePanelManager.detailComponentName;
        ShellContext.RightPanelIsExpanded(true);
        self.panelManager.changeComponent(componentName, self);
    }

    // Method: openResourceUrl
    // Opens the resource link in a new tab
    public openResourceUrl = (data, event): void =>
    {
        if (this.resourceUrl()) {
            window.open(this.resourceUrl(), '_blank').focus();
        }
    }

    // Methods: showTooltip & hideTooltip
    // Shows and hides the tooltip for the node
    public showTooltip = (data, event): void => this.tooltipIsVisible(true);
    public hideTooltip = (data, event): void => this.tooltipIsVisible(false);

    constructor(nodeId: string, rect: INodeExtension)
    {
        var self = this;
        self.PanelManagerReference = ManagerFactory.getInstanceOf(Managers.SidePanelManager._className);
        self.panelManager = <Managers.SidePanelManager>self.PanelManagerReference.instance;

        self.id = nodeId;
        self.staticData = rect;
        self.isPowerBI = self.id === Model.Graph.GraphNodeType[Model.Graph.GraphNodeType.PowerBI];
        self.image = self.staticData.image ? "/Images/icons/" + self.staticData.image : "";

        self.resource = ko.observable(null);
        self.tooltipIsVisible = ko.observable(false);
        self.status = ko.observable(self.staticData.isStaticNode ? "staticnode" : self.graphNodeStatusInprogress);

        self.tooltipAvailable = ko.pureComputed(() => !!self.staticData.description && !!self.image);
        self.resourceUrl = ko.pureComputed(() => {
            // First check if there is a static string to override the resource url on the node
            if (self.staticData.linkMappings && self.staticData.linkMappings.nodeLinkOverride) {
                return self.staticData.linkMappings.nodeLinkOverride;
            }
            return (self.resource() && self.resource().ResourceUrl) ? self.resource().ResourceUrl : '';
        });
        self.displayClasses = ko.pureComputed(() => { return [self.status(), rect.displayClasses].join(" "); });
    }

    // Method: dispose
    // Component level dispose function, dispose of all subscriptions that shouldn't live beyond the component life time
    public dispose(): void {
        var self = this;
        self.panelManager = null;
        self.PanelManagerReference.release();
    }
}

export interface INodeExtension extends GraphControl.IUpdateRect
{
    description: string;
    details: string;
    displayClasses: string;
    image: string;
    isStaticNode: boolean;
    name: string;
    nodeDisplayName: string;
    typeKey: string;
    linkMappings?: any;
}

export class NodeExtension extends GraphControl.GraphNode
{
    public static DEFAULT_WIDTH = 180;
    public static DEFAULT_HEIGHT = 100;

    public extensionTemplate: string = require("text!./NodeExtensionTemplate.html");

    constructor(nodeId: string, rect: INodeExtension)
    {
        super({
            x: rect.x,
            y: rect.y,
            height: (rect.height ? rect.height : NodeExtension.DEFAULT_HEIGHT),
            width: (rect.width ? rect.width : NodeExtension.DEFAULT_WIDTH)
        });
        this.id(nodeId);
        this.extensionViewModel = new NodeExtensionViewModel(nodeId, rect);
    }

}