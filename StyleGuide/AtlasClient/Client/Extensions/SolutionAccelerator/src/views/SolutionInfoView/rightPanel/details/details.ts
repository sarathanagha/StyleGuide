/// <reference path="../../../../References.d.ts" />
/// <amd-dependency path="text!./details.html" />
/// <amd-dependency path="css!./details.css" />

export var template: string = require("text!./details.html");
import Managers = Microsoft.DataStudio.SolutionAccelerator.Managers;
import GraphNodeStatus = Microsoft.DataStudio.SolutionAccelerator.Model.Graph.GraphNodeStatus;
import NodeExtension = require("../../NodeExtension");
import LoggerFactory = Microsoft.DataStudio.SolutionAccelerator.LoggerFactory;
import Logging = Microsoft.DataStudio.Diagnostics.Logging;
var logger = LoggerFactory.getLogger({ loggerName: "RightPanel_General", category: "ViewModel" });

export class viewModel
{
    /* Observables - START */
    public status: KnockoutObservable<string>;
    public resourceUrl: KnockoutObservable<string>;
    public statusIconCssClass: KnockoutObservable<string>;
    public showError: KnockoutObservable<boolean>;
    public resourceLinkText: KnockoutObservable<string>;
    /* Observables - END */

    /* Computed Observables - START */
    public name: KnockoutComputed<string>;
    public details: KnockoutComputed<string>;
    public statusClass: KnockoutComputed<string>;
    public statusMessage: KnockoutComputed<string>;
    public showOpenButton: KnockoutComputed<boolean>;
    public showDeploymentStatus: KnockoutComputed<boolean>;
    public errors: KnockoutComputed<any[]>;
    /* Computed Observables - END */

    constructor(params: NodeExtension.NodeExtensionViewModel)
    {
        var self = this;
        self.status = params.status;
        self.resourceUrl = params.resourceUrl;
        self.resourceLinkText = ko.observable((self.resourceUrl() || '').indexOf('.zip') > 0 ? 'Download' : 'Open');

        self.statusIconCssClass = ko.observable('');
        self.showError = ko.observable(false);

        self.showOpenButton = ko.pureComputed(() => !!self.resourceUrl && !!self.resourceUrl());
        self.showDeploymentStatus = ko.pureComputed(() => !params.staticData.isStaticNode);
        self.errors = ko.pureComputed(() => params.resource() ? viewModel.extractErrorMessages(params.resource()) : []);

        self.name = ko.computed(() => {
            if (params.resource && params.resource() && params.resource().ResourceName) {
                return params.resource().ResourceName;
            } else if (params.staticData.name) {
                return params.staticData.name;
            } else {
                return 'Unknown';
            }
        });

        self.details = ko.pureComputed(() => {
            var updatedDetails: string = params.staticData.details;
            // replace the anchor text in PowerBI node with the actual exe download link
            if (self.resourceUrl && self.resourceUrl() && updatedDetails.indexOf("EXELINK") >= 0) {
                updatedDetails = updatedDetails.replace("EXELINK", self.resourceUrl());
            }

            return updatedDetails;
        });

        self.statusMessage = ko.computed(() =>
        {
            switch (self.status().toLowerCase())
            {
                case GraphNodeStatus[GraphNodeStatus.Succeeded].toLowerCase():
                    self.statusIconCssClass('success');
                    self.showError(false);
                    return "Succesfull deployment";
                case GraphNodeStatus[GraphNodeStatus.Failed].toLowerCase():
                    self.statusIconCssClass('failed');
                    self.showError(true);
                    return "Failed deployment";
                case GraphNodeStatus[GraphNodeStatus.Deleting].toLowerCase():
                    self.statusIconCssClass('');
                    self.showError(false);
                    return "Deployment is getting deleted";
                case GraphNodeStatus[GraphNodeStatus.Deleted].toLowerCase():
                    self.statusIconCssClass('');
                    self.showError(false);
                    return "Deployment Deleted";
                case GraphNodeStatus[GraphNodeStatus.WaitForDeploy].toLowerCase():
                    self.statusIconCssClass('');
                    self.showError(false);
                    return "Not deployed";
                case GraphNodeStatus[GraphNodeStatus.Stopped].toLowerCase():
                    self.statusIconCssClass('');
                    self.showError(false);
                    return "Stopped due to errors in other nodes";
                default:
                    self.statusIconCssClass('inprogress');
                    self.showError(false);
                    return "Deployment in progress";
            }
        });

        logger.logUsage(Logging.UsageEventType.Custom, "RightPanel_General_Launch", { panelName: self.name(), statusMessage: self.statusMessage() });
    }

    private static isErrorResource(resource: any): boolean {
        return resource.ProvisioningState.toLowerCase() === GraphNodeStatus[GraphNodeStatus.Failed].toLowerCase();
    }

    private static extractErrorMessages(resource: any): any {
        /* StatusMessage could be either an error object encoded
           as a JSON string or the error message itself. This try catch 
           will handle this case */
        var errorObjects: any[] = [];
        if (resource.StatusMessage) {
            errorObjects.push(viewModel.parseErrorJson(resource));
        } else if (resource.Dependencies && resource.Dependencies.length && resource.Dependencies.length > 0) {
            resource.Dependencies.reduce((accumulator, resource) => {
                if (viewModel.isErrorResource(resource) && resource.StatusMessage) accumulator.push(viewModel.parseErrorJson(resource));
                return accumulator;
            }, errorObjects);
        } else {
            errorObjects.push({ message: "No error message found" });
        }
        return errorObjects;
    }

    private static parseErrorJson(resource: any): any {
        var errorObject: any;
        try {
            errorObject = JSON.parse(resource.StatusMessage);
            errorObject = errorObject.error ? errorObject.error : errorObject;
        } catch (err) {
            errorObject = { message: resource.StatusMessage };
        }
        return errorObject;
    }
}