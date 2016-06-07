/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./MonitoringViews.html" />
/// <amd-dependency path="css!./MonitoringViews.css" />

import AppContext = require("../../scripts/AppContext");
import View = require("../../scripts/Framework/Model/MonitoringView");
import RoutingHandler = require("../../scripts/Handlers/RoutingHandler");
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import Framework = require("../../_generated/Framework");

/* tslint:disable:no-var-requires */
export const template: string = require("text!./MonitoringViews.html");
/* tslint:enable:no-var-requires */

import Telemetry = Framework.Telemetry;

export interface ITreeElement {
    state?: { opened: boolean };
    children?: ITreeElement[];
    original?: { clickable: boolean };
    id: string;
}

/* tslint:disable:class-name */
export class viewModel extends Framework.Disposable.RootDisposable {
    /* tslint:enable:class-name */
    public static className: string = "MonitoringViews-JsTree";
    public static treeSelector: string = "#monitoringViewsList";
    public static leftPanelSelector: string = ".leftSidePanel";

    public treeData: KnockoutObservable<Object>;
    public treeConfig: KnockoutObservable<Object>;

    private _appContext: AppContext.AppContext;
    private _monitoringViewSubscription: MessageHandler.IMessageSubscription<string>;
    private monitoringViews: View.MonitoringView[];

    /* tslint:disable:no-unused-variable Used in html tree binding*/
    private onHoverNode = (event: Event, data: { node: { id: string, text: string } }) => {
        /* tslint:enable:no-unused-variable */

        $("#" + data.node.id).prop("title", data.node.text);
    };

    /**
     * Treeview selected node handler.
     * @param sender Event sender.
     * @param args Event args.
     */
    /* tslint:disable:no-unused-variable Used in html tree binding */
    private onSelectNode = (sender: Object, args: { node: ITreeElement; selected: Object[]; event: Event }): void => {
        /* tslint:enable:no-unused-variable */

        // If this wasn't triggered by a click/tap, then ignore
        if (args.event === undefined || args.event.type !== "click") {
            return;
        }

        // If non-leaf node (without clickable override) then return
        if (args.node.children && args.node.children.length > 0 && !args.node.original.clickable) {
            return;
        }

        if (!args.node.id) {
            return;
        }

        this.select(args.node.id);
    };

    // Called when the jstree is fully loaded.
    /* tslint:disable:no-unused-variable Used in html tree binding */
    private loaded = () => {
        /* tslint:enable:no-unused-variable */

        // Update selection according to monitoring view handler.
        this._monitoringViewSubscription.callback(this._appContext.monitoringViewHandler.getState());
    };

    /* Based on the MonitoringViewHandler's selection state,
     * this method visually selects the correct node in the jstree.
     * All other nodes are deselected.
     */
    private updateTreeSelection = (currentView: string) => {
        $(viewModel.treeSelector).jstree("deselect_all");
        $(viewModel.treeSelector).jstree("select_node", currentView);
    };

    constructor(params: Object) {
        super();
        this._appContext = AppContext.AppContext.getInstance();
        let monitoringViewHandler = this._appContext.monitoringViewHandler;
        this.monitoringViews = monitoringViewHandler.listMonitoringViews();

        this._monitoringViewSubscription = {
            name: viewModel.className,
            callback: this.updateTreeSelection
        };
        monitoringViewHandler.register(this._monitoringViewSubscription);

        this.treeConfig = ko.observable({
            "datastudio": {
                "open_all": true
            },
            // don't save / reload any state
            "state": {
                events: "",
                filter: (k) => {
                    delete k.core;
                    return k;
                }
            }
        });

        this.treeData = ko.computed(() => {
            let data = [{
                id: "rootSystemViews",
                text: "System Views",
                state: {
                    opened: true
                },
                children: this.monitoringViews
            }];

            // always open on an update
            this.expandNode(data[0]);

            return data;
        });

        $(viewModel.leftPanelSelector).on("collapse", (event: Event, collapsed: boolean) => {
            // handle a collapse event as a resize if it's not collapsed
            if (!collapsed) {
                $(viewModel.treeSelector).jstree("select_node", monitoringViewHandler.getState());
            }
        });
    }

    public dispose(): void {
        this._appContext.monitoringViewHandler.unregister(this._monitoringViewSubscription);
        super.dispose();
    }

    private select(monitoringViewName: string) {
        Telemetry.instance.logEvent(new Telemetry.Event(this._appContext.factoryId(), "Monitoring-" + monitoringViewName, Telemetry.Action.invoke));
        let newUrlParams: StringMap<string> = {};
        newUrlParams[RoutingHandler.urlKeywords.moduleView.value] = RoutingHandler.viewName.edit;
        newUrlParams[RoutingHandler.urlKeywords.view.value] = monitoringViewName;
        this._appContext.routingHandler.pushState(viewModel.className, newUrlParams);
        this._appContext.monitoringViewHandler.pushState(viewModel.className, monitoringViewName);
    }

    private expandNode(treeElement: ITreeElement): void {
        if (!treeElement.state) {
            treeElement.state = { opened: true };
        } else {
            treeElement.state.opened = true;
        }

        if (treeElement.children) {
            treeElement.children.forEach((el => { this.expandNode(el); }));
        }
    }
}
