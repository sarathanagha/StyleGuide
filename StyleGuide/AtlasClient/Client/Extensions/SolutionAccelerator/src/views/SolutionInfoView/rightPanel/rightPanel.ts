/// <reference path="../../../References.d.ts" />
/// <amd-dependency path="text!./rightPanel.html" />
/// <amd-dependency path="css!./rightPanel.css" />

export var template: string = require("text!./rightPanel.html");
import Managers = Microsoft.DataStudio.SolutionAccelerator.Managers;
import IInstanceReference = Microsoft.DataStudio.Application.IInstanceReference;
import ManagerFactory = Microsoft.DataStudio.Application.ManagerFactory;

export class viewModel {

    public PanelManagerReference: IInstanceReference;
    public panelManager: Managers.SidePanelManager;

    constructor(params: any) { 
        this.PanelManagerReference = ManagerFactory.getInstanceOf(Managers.SidePanelManager._className);
        this.panelManager = <Managers.SidePanelManager>this.PanelManagerReference.instance;
    }

    // Method: dispose
    // Component level dispose function, dispose of all subscriptions that shouldn't live beyond the component life time
    public dispose(): void {
        var self = this;
        self.panelManager = null;
        self.PanelManagerReference.release();
    }
}