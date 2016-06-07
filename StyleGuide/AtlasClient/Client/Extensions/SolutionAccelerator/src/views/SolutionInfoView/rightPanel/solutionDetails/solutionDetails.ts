/// <reference path="../../../../References.d.ts" />
/// <amd-dependency path="text!./solutionDetails.html" />
/// <amd-dependency path="css!./solutionDetails.css" />

export var template: string = require("text!./solutionDetails.html");
import Managers = Microsoft.DataStudio.SolutionAccelerator.Managers;
import Model = Microsoft.DataStudio.SolutionAccelerator.Model;
import GraphNodeStatus = Microsoft.DataStudio.SolutionAccelerator.Model.Graph.GraphNodeStatus;
import IInstanceReference = Microsoft.DataStudio.Application.IInstanceReference;
import ManagerFactory = Microsoft.DataStudio.Application.ManagerFactory;

export class viewModel
{
    public DataManagerReference: IInstanceReference;
    public DataManager: Managers.SolutionAcceleratorDataManager;

    public solutionIsActive: KnockoutObservable<boolean>;
    public templateName: KnockoutObservable<string>;
    public statusMessage: KnockoutObservable<string>;
    public sourceTemplate: KnockoutObservable<string>;
    public callToAction: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public statusIconCssClass: KnockoutObservable<string>;
    public provisionState: KnockoutObservable<string>;
    public showCallToAction: KnockoutComputed<boolean>;

    // Lists of all subscriptions that will need to be disposed of
    private componentSubscriptions: KnockoutSubscription<any>[];

    constructor(params: any)
    {
        var self = this;

        self.DataManagerReference = ManagerFactory.getInstanceOf(Managers.SolutionAcceleratorDataManager._className);
        self.DataManager = <Managers.SolutionAcceleratorDataManager>self.DataManagerReference.instance;

        self.componentSubscriptions = [];

        self.solutionIsActive = ko.observable(false);
        self.templateName = ko.observable('');
        self.statusMessage = ko.observable('');
        self.sourceTemplate = ko.observable('');
        self.callToAction = ko.observable('');
        self.description = ko.observable('');
        self.statusIconCssClass = ko.observable('');
        self.provisionState = ko.observable('');
        self.showCallToAction = ko.computed(() => self.callToAction().length > 0 && (self.provisionState() == GraphNodeStatus[GraphNodeStatus.Succeeded].toLowerCase()));

        var activeSolution: KnockoutObservable<Model.SolutionAccelerator> = self.DataManager.activeSolution();
        if (!!activeSolution && !!activeSolution()) {
            // Initialize
            self.initializeObservables(activeSolution());
            // Listen for changes to the active solution
            self.componentSubscriptions.push(activeSolution.subscribe(self.initializeObservables));
        }
    }

    private initializeObservables = (activeTemplate: Model.SolutionAccelerator): void => {
        var self = this;
        self.solutionIsActive(true);
        self.templateName(activeTemplate.rowKey);

        self.provisionState((activeTemplate.provisionState.provisioningState || '').toLowerCase())
        self.statusMessage(self.getStatusMessage(self.provisionState()));

        var templateMapping = Managers.SolutionAcceleratorDataManager.solutionTypeMetadata[activeTemplate.templateId];
        self.sourceTemplate(templateMapping ? templateMapping.displayName : "Unkown source template");

        // TODO (stpryor): Refactoring needed for "call to action" functionality
        var descriptionFields: Array<string> = activeTemplate.description.split('$');
        if (descriptionFields.length === 1) {
            self.description(descriptionFields[0]);
        } else if (descriptionFields.length > 1) {
            self.callToAction(descriptionFields[0]);
            self.description(descriptionFields[1]);
        }
    }

    private getStatusMessage(status: string): string {
        var self = this;
        switch (status) {
            case GraphNodeStatus[GraphNodeStatus.Succeeded].toLowerCase():
                self.statusIconCssClass('success');
                return "Successful deployment";
            case GraphNodeStatus[GraphNodeStatus.Failed].toLowerCase():
                self.statusIconCssClass('failed');
                return "Failed deployment";
            case GraphNodeStatus[GraphNodeStatus.Deleting].toLowerCase():
                self.statusIconCssClass('');
                return "Deployment is getting deleted";
            case GraphNodeStatus[GraphNodeStatus.Deleted].toLowerCase():
                self.statusIconCssClass('');
                return "Deployment Deleted";
            case GraphNodeStatus[GraphNodeStatus.WaitForDeploy].toLowerCase():
                self.statusIconCssClass('');
                return "Not deployed";
            case GraphNodeStatus[GraphNodeStatus.Stopped].toLowerCase():
                self.statusIconCssClass('');
                return "Stopped due to errors in other nodes";
            default:
                self.statusIconCssClass('inprogress');
                return "Deployment in progress";
        }
    }

    // Method: dispose
    // Component level dispose function, dispose of all subscriptions that shouldn't live beyond the component life time
    public dispose(): void {
        var self = this;
        self.componentSubscriptions.forEach(subscription => subscription.dispose());
        self.DataManager = null;
        self.DataManagerReference.release();
    }
}