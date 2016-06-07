/// <amd-dependency path="text!./ResourceExplorer.html" />
/// <amd-dependency path="css!./ResourceExplorer.css" />

import DataCache = require("../../scripts/Framework/Model/DataCache");
import Encodable = require("../../scripts/Framework/Model/Contracts/Encodable");
import AppContext = require("../../scripts/AppContext");
import Framework = require("../../_generated/Framework");
import RoutingHandler = require("../../scripts/Handlers/RoutingHandler");
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import ResourceIdUtil = require("../../scripts/Framework/Util/ResourceIdUtil");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");
import Router = Microsoft.DataStudio.Application.Router;

/* tslint:disable:no-var-requires */
export const template: string = require("text!./ResourceExplorer.html");
/* tslint:enable:no-var-requires */

let logger = Framework.Log.getLogger({
    loggerName: "ResourceExplorer"
});

export class FactoryNodeViewModel extends Framework.Disposable.ChildDisposable {
    public static tableNodePrefix: string = "leaf-datafactory-edit-dataset-";
    public static pipelineNodePrefix: string = "leaf-datafactory-edit-pipeline-";
    public static linkedSerivcePrefix: string = "leaf-datafactory-edit-linkedservice-";
    public static gatewayPrefix: string = "leaf-datafactory-edit-gateway-";
    public static datafactoryNodePrefix: string = "datafactory_";

    // the actual node
    public node: KnockoutObservable<ITreeElement> = ko.observable(null);

    // the factory's name
    public name: KnockoutObservable<string> = ko.observable(null);

    // encodable for each linkedService
    public _linkedServiceEncodables: StringMap<Encodable.LinkedServiceEncodable> = {};

    // node components
    private _pipelines: Object[] = [];
    private _tables: Object[] = [];
    private _linkedServices: Object[] = [];
    private _gateways: Object[] = [];

    // data model
    private _pipelinesQueryView: DataCache.DataCacheView<MdpExtension.DataModels.BatchPipeline[], ArmService.IDataFactoryResourceBaseUrlParams, void> = null;
    private _tablesQueryView: DataCache.DataCacheView<MdpExtension.DataModels.DataArtifact[], ArmService.IDataFactoryResourceBaseUrlParams, void> = null;

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();

    private _updateLinkedService = (linkedServiceName: string, encodable: Encodable.Encodable) => {
        let linkedServiceEncodable: Encodable.LinkedServiceEncodable = new Encodable.LinkedServiceEncodable(linkedServiceName);

        if (linkedServiceEncodable.id in this._linkedServiceEncodables) {
            linkedServiceEncodable = this._linkedServiceEncodables[linkedServiceEncodable.id];
        } else {
            this._linkedServiceEncodables[linkedServiceEncodable.id] = linkedServiceEncodable;
        }

        linkedServiceEncodable.entities.add(encodable);
    };

    private _clearLinkedServices = (typeToClear: Encodable.EncodableType) => {
        for (let id in this._linkedServiceEncodables) {
            this._linkedServiceEncodables[id].entities.clearByType(typeToClear);
        }
    };

    constructor(lifetimeManager: Framework.Disposable.IDisposableLifetimeManager, factoryId: string) {
        super(lifetimeManager);

        // callbacks for when the leaves load
        this._pipelinesQueryView = this._appContext.armDataFactoryCache.pipelineListCacheObject.createView();
        this._tablesQueryView = this._appContext.armDataFactoryCache.tableListCacheObject.createView();

        this._lifetimeManager.registerForDispose(this._tablesQueryView.items.subscribe((artifacts) => {
            this._tables = [];
            this._clearLinkedServices(Encodable.EncodableType.TABLE);

            artifacts.forEach((artifact) => {
                let encodable = new Encodable.TableEncodable(artifact.name());

                this._tables.push({
                    text: artifact.name(),
                    id: FactoryNodeViewModel.tableNodePrefix + encodable.id,
                    encodableType: Encodable.EncodableType.TABLE
                });

                // not all tables have linkedservices
                if (!artifact.properties().linkedServiceName) {
                    return;
                }

                this._updateLinkedService(artifact.properties().linkedServiceName(), encodable);
            });
            this._update();
        }));

        this._lifetimeManager.registerForDispose(this._pipelinesQueryView.items.subscribe(() => {
            let pipelines = this._pipelinesQueryView.items();

            this._pipelines = [];
            this._clearLinkedServices(Encodable.EncodableType.PIPELINE);
            this._clearLinkedServices(Encodable.EncodableType.ACTIVITY);

            pipelines.forEach((pipeline: MdpExtension.DataModels.BatchPipeline) => {
                let encodable = new Encodable.PipelineEncodable(pipeline.name());

                this._pipelines.push({
                    text: pipeline.name(),
                    id: FactoryNodeViewModel.pipelineNodePrefix + encodable.id,
                    encodableType: Encodable.EncodableType.PIPELINE
                });

                // not all tables have linkedservices
                pipeline.properties().activities().forEach((activity) => {
                    if (!activity.linkedServiceName) {
                        return;
                    }

                    this._updateLinkedService(activity.linkedServiceName(), encodable);
                    this._updateLinkedService(activity.linkedServiceName(), new Encodable.ActivityEncodable(pipeline.name(), activity.name()));
                });
            });

            this._update();
        }));

        let splitFactoryId = ResourceIdUtil.splitResourceString(factoryId);

        // TODO iannight: add linked services to the cache
        this._appContext.armService.listLinkedServices({
            factoryName: splitFactoryId.dataFactoryName,
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName
        }).then((services: ArmService.ILinkedService[]) => {
            services.forEach((service) => {
                this._linkedServices.push({
                    text: service.name,
                    id: FactoryNodeViewModel.linkedSerivcePrefix + new Encodable.LinkedServiceEncodable(service.name).id,
                    encodableType: Encodable.EncodableType.LINKED_SERVICE
                });
            });

            this._update();
        });

        this._appContext.armService.listGateways({
            factoryName: splitFactoryId.dataFactoryName,
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName
        }).done((result: {value: {name: string}[]}) => {
            result.value.forEach((gateway) => {
                this._gateways.push({
                    text: gateway.name,
                    id: FactoryNodeViewModel.gatewayPrefix + new Encodable.GatewayEncodable(gateway.name).id,
                    encodableType: Encodable.EncodableType.GATEWAY
                });
            });

            this._update();
        }, this._appContext.errorHandler.makeResourceFailedHandler("gateways in {0} factory".format(splitFactoryId.dataFactoryName)));

        this.name(splitFactoryId.dataFactoryName);

        let fetchPipeline = this._pipelinesQueryView.fetch({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName
        });

        fetchPipeline.fail(this._appContext.errorHandler.makeResourceFailedHandler("pipelines in {0} factory".format(splitFactoryId.dataFactoryName)));

        let fetchTables = this._tablesQueryView.fetch({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName
        });

        fetchTables.fail(this._appContext.errorHandler.makeResourceFailedHandler("tables in {0} factory".format(splitFactoryId.dataFactoryName)));
    }

    // update the node representation
    private _update() {
        this.node({
            id: FactoryNodeViewModel.datafactoryNodePrefix + new Encodable.DataFactoryEncodable(this.name()).id,
            text: this.name(),
            clickable: true,
            state: {
                opened: true
            },

            children: [
                {
                    id: "Pipelines",
                    text: "Pipelines",
                    children: this._pipelines
                },
                {
                    id: "Datasets",
                    text: "Datasets",
                    children: this._tables
                },
                {
                    id: "LinkedServices",
                    text: "Linked Services",
                    children: this._linkedServices
                },
                {
                    id: "Gateways",
                    text: "Gateways",
                    children: this._gateways
                },
            ]
        });

        // force update
        this.node.notifySubscribers();
    }
}

export interface ITreeElement {
    id?: string;
    clickable?: boolean;
    state?: { opened: boolean; selected?: boolean };
    text?: string;
    children?: ITreeElement[];
}

export interface ITreeNode {
    id: string;
    text: string;
    encodableType?: Encodable.EncodableType;
    children: Object[];
    original: { clickable: boolean, encodableType: Encodable.EncodableType };
}

/* tslint:disable:class-name */
export class viewModel extends Framework.Disposable.RootDisposable {
    /* tslint:enable:class-name */
    public static className: string = "ResourceExplorer";

    public static viewName: string = "Resource Explorer";
    public static treeSelector: string = "#resourceExplorerList";
    public static leftPanelSelector: string = ".leftSidePanel";
    // TODO iannight update the css so we don't need this hack
    public static treeOffset: number = 72;

    // data model
    public factories: KnockoutComputed<ITreeElement[]>;

    // subscriptions
    public selectionSubscription: MessageHandler.ISelectionSubscription;
    public selectedNodes: Encodable.Encodable[] = [];

    // for knockout binding
    public treeData: KnockoutObservable<Object>;
    public treeConfig: KnockoutObservable<Object>;

    public factoryNodeViewModel: KnockoutObservable<FactoryNodeViewModel>;

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();

    constructor(params: Object) {
        super();

        this.factoryNodeViewModel = ko.observable(null);

        this.selectionSubscription = {
            name: viewModel.viewName,
            callback: this.processSelectionUpdate
        };

        this._appContext.selectionHandler.register(this.selectionSubscription);

        this.factories = ko.pureComputed(() => {
            // if we have a real node, show it
            // otherwise empty
            return this.factoryNodeViewModel() && this.factoryNodeViewModel().node() ? [this.factoryNodeViewModel().node()] : [];
        });

        this._lifetimeManager.registerForDispose(this.factories);

        // update when we receive a new factoryId
        let handler = (factoryId) => {
            if (!factoryId) {
                return;
            }

            this.factoryNodeViewModel(new FactoryNodeViewModel(this._lifetimeManager, factoryId));
        };

        this._lifetimeManager.registerForDispose(this._appContext.factoryId.subscribe(handler));
        handler(this._appContext.factoryId());

        this.treeConfig = ko.observable({
            "datastudio": {
                "open_all": false
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
            let data: ITreeElement[] = [{
                id: "root",
                text: "Data Factories",
                state: {
                    opened: true
                },
                children: this.factories()
            }];

            // always open on an update
            this.expandNode(data[0]);

            return data;
        });
    }

    private removeHighlights = () => {
        $(viewModel.treeSelector + " ." + Framework.Constants.CSS.highlightedClass).removeClass(Framework.Constants.CSS.highlightedClass);
    };

    private highlightNode = (entity: Encodable.Encodable) => {
        let highlightPrefix: string = null;

        switch (entity.type) {
            case Encodable.EncodableType.PIPELINE:
                highlightPrefix = FactoryNodeViewModel.pipelineNodePrefix;
                break;

            case Encodable.EncodableType.TABLE:
                highlightPrefix = FactoryNodeViewModel.tableNodePrefix;
                break;

            case Encodable.EncodableType.LINKED_SERVICE:
                highlightPrefix = FactoryNodeViewModel.linkedSerivcePrefix;

            default:
                break;
        }

        if (highlightPrefix) {
            $("#" + highlightPrefix + entity.id + "_anchor").siblings(".jstree-wholerow").addClass(Framework.Constants.CSS.highlightedClass);
        }
    };

    private highlightLinkedServices = (encodable: Encodable.Encodable) => {
        // highlight all relevant linked services
        for (let key in this.factoryNodeViewModel()._linkedServiceEncodables) {
            let linkedService = this.factoryNodeViewModel()._linkedServiceEncodables[key];

            if (linkedService.entities.contains(encodable)) {
                this.highlightNode(linkedService);
            }
        }
    };

    private processSelectionUpdate = (selectedEncodables: Encodable.Encodable[]) => {
        // reset selection
        $(viewModel.treeSelector).jstree("deselect_all");

        this.removeHighlights();

        selectedEncodables.forEach((encodable) => {
            // id of node to be selected
            let nodePrefix: string = null;

            switch (encodable.type) {
                case Encodable.EncodableType.PIPELINE:
                    nodePrefix = FactoryNodeViewModel.pipelineNodePrefix;
                    break;

                case Encodable.EncodableType.TABLE:
                    nodePrefix = FactoryNodeViewModel.tableNodePrefix;
                    break;

                case Encodable.EncodableType.ACTIVITY_RUN:
                    (<Encodable.ActivityRunEncodable>encodable).observable().entities.forEach(this.highlightNode);
                    (<Encodable.ActivityRunEncodable>encodable).observable().entities.forEach(this.highlightLinkedServices);
                    break;

                case Encodable.EncodableType.DATAFACTORY:
                    nodePrefix = FactoryNodeViewModel.datafactoryNodePrefix;
                    break;

                case Encodable.EncodableType.ACTIVITY:
                    break;

                default:
                    logger.logError("Unexpected switch statement value: " + encodable.type);
                    break;
            }

            // highlight relevant linked services
            this.highlightLinkedServices(encodable);

            // if we found a related encodable
            if (nodePrefix) {
                $(viewModel.treeSelector).jstree("select_node", nodePrefix + encodable.id);
            }
        });
    };

    // These are just used in ResourceExplorer.html
    /* tslint:disable:no-unused-variable */
    private onHoverNode = (event: Event, data: { node: ITreeNode }) => {
        /* tslint:enable:no-unused-variable */
        $("#" + data.node.id).prop("title", data.node.text);
    };

    /* tslint:disable:no-unused-variable */
    private onTreeViewReady = (): void => {
        /* tslint:enable:no-unused-variable */
        this.processSelectionUpdate(this._appContext.selectionHandler.getState());
    };

    /**
     * Treeview changed node handler.
     * @param sender Event sender.
     * @param args Event args.
     */
    /* tslint:disable:no-unused-variable */
    private onTreeviewChanged = (sender: Object, args: { node: ITreeNode; selected: string[]; event: Event, instance: { get_node: (string) => { original: ITreeNode } } }): void => {
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

        let urlTokens = args.node.id.split("-");

        if (urlTokens.length < 2) {
            // If we select the datafactory node, push an empty selection encodable set which Properties.ts
            // uses to update its properties to be about the default datafactory
            let nodePrefix = args.node.id.substring(0, FactoryNodeViewModel.datafactoryNodePrefix.length);

            if (nodePrefix === FactoryNodeViewModel.datafactoryNodePrefix) {
                this._appContext.selectionHandler.pushState(viewModel.viewName, []);
            }

            return;
        }

        let moduleName: string = urlTokens[1];
        let viewName: string = urlTokens[2];

        this.removeHighlights();

        switch (moduleName) {
            case "dataconnect":
                switch (viewName) {
                    case "connectors":
                        Router.navigate("dataconnect/connectors/" + args.node.text);
                        break;
                    case "gateways":
                        Router.navigate("dataconnect/gateways/" + args.node.text);
                        break;
                    default:
                        break;
                }
                break;
            case "datafactory":
                // wrap this in a closure so it's scoped effectively
                let addEncodable = (encodables: Encodable.Encodable[]) => {
                    return (nodeId: string) => {
                        let node = args.instance.get_node(nodeId).original;

                        // If it's a node that should select something
                        if ("encodableType" in node) {
                            switch (node.encodableType) {
                                case Encodable.EncodableType.PIPELINE:
                                    encodables.push(new Encodable.PipelineEncodable(node.text));
                                    break;
                                case Encodable.EncodableType.TABLE:
                                    encodables.push(new Encodable.TableEncodable(node.text));
                                    break;

                                case Encodable.EncodableType.LINKED_SERVICE:
                                    let linkedServiceEncodable = new Encodable.LinkedServiceEncodable(node.text);

                                    // either push the one we have in the cache or the new one
                                    encodables.push(this.factoryNodeViewModel()._linkedServiceEncodables[linkedServiceEncodable.id] || linkedServiceEncodable);
                                    break;

                                case Encodable.EncodableType.GATEWAY:
                                    encodables.push(new Encodable.GatewayEncodable(node.text));
                                    break;
                                case Encodable.EncodableType.DATAFACTORY:
                                    encodables.push(new Encodable.DataFactoryEncodable(node.text));
                                    break;
                                case Encodable.EncodableType.ACTIVITY:
                                    // noop
                                    break;
                                default:
                                    logger.logError("Unexpected switch statement value: " + node.encodableType);
                                    break;
                            }
                        }
                    };
                };

                // the actual array to be passed in
                let selectedEncodables: Encodable.Encodable[] = [];

                // add the encodables for each selected node
                args.selected.forEach(addEncodable(selectedEncodables));

                // actually update the selction state
                this._appContext.selectionHandler.pushState(this.selectionSubscription.name, selectedEncodables);

                // TODO: fix parsing of ids with routing (e.g. handle datafactory/id)
                let newUrlParams: StringMap<string> = {};
                newUrlParams[RoutingHandler.urlKeywords.moduleView.label] = RoutingHandler.viewName.edit;
                this._appContext.routingHandler.pushState(viewModel.className, newUrlParams);
                break;
            default:
                logger.logError("Unexpected moduleName value: " + moduleName);
                break;
        }
    };

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
