/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./JsonViewer.html"/>
/// <amd-dependency path="css!./JsonViewer.css"/>

import AppContext = require("../../scripts/AppContext");
import Framework = require("../../_generated/Framework");
import Log = Framework.Log;
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import Encodable = require("../../scripts/Framework/Model/Contracts/Encodable");
import ModuleConfig = require("../../scripts/Config/DataFactoryConfig");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");

/* tslint:disable:no-var-requires */
export let template: string = require("text!./JsonViewer.html");
/* tslint:disable:no-var-requires */
const indentationSpacesCount = 4;

const className: string = "JsonViewer";

let logger = Log.getLogger({
    loggerName: className
});

export class JsonViewer extends Framework.Disposable.RootDisposable {
    public static className = className;
    public selectionHandlerSubscription: MessageHandler.ISelectionSubscription;
    public scriptText: KnockoutObservable<string> = null;
    public displayText: KnockoutObservable<string> = null;
    public loading: KnockoutObservable<Framework.Loader.LoadingState> = null;

    private _appContext: AppContext.AppContext = null;
    private _pipelineEntityView: Framework.DataCache.DataCacheView<MdpExtension.DataModels.BatchPipeline, ArmService.IPipelineResourceBaseUrlParams, void> = null;
    private _datasetEntityView: Framework.DataCache.DataCacheView<MdpExtension.DataModels.DataArtifact, ArmService.IDatasetResourceBaseUrlParams, void> = null;
    private _refreshId: number = 0;

    constructor(param: ModuleConfig.ITabViewModelParam) {
        super();

        this._appContext = AppContext.AppContext.getInstance();
        this.loading = ko.observable(Framework.Loader.LoadingState.Ready);
        this.displayText = ko.observable(ClientResources.jsonViewerNoSelectionText);
        this.scriptText = ko.observable<string>(null);
        this._pipelineEntityView = this._appContext.armDataFactoryCache.pipelineCacheObject.createView(false);
        this._datasetEntityView = this._appContext.armDataFactoryCache.tableCacheObject.createView(false);

        this.selectionHandlerSubscription = {
            name: JsonViewer.className,
            callback: (selectedEntities) => {
                if (!param.componentConfig.isOpen()) {
                    // The tab isn't open, hence don't do anything.
                    return;
                }

                let numberOfSelectedEncodables = 0;
                let selectedEncodable: Encodable.Encodable = null;
                if (selectedEntities) {
                    let splitFactoryId = this._appContext.splitFactoryId();
                    for (let entity of selectedEntities) {
                        if (entity.type === Encodable.EncodableType.LINKED_SERVICE ||
                            entity.type === Encodable.EncodableType.TABLE ||
                            entity.type === Encodable.EncodableType.PIPELINE ||
                            entity.type === Encodable.EncodableType.ACTIVITY) {

                            numberOfSelectedEncodables++;
                            if (numberOfSelectedEncodables === 1) {
                                selectedEncodable = entity;
                            } else {
                                selectedEncodable = null;
                                break;
                            }
                        }
                    }

                    if (!selectedEncodable) {
                        this.scriptText(null);
                        this.displayText(ClientResources.jsonViewerNoSelectionText);
                        return;
                    }

                    this.loading(Framework.Loader.LoadingState.Loading);
                    let promise: Q.Promise<void> = null;
                    let currentRefreshId = ++this._refreshId;
                    switch (selectedEncodable.type) {

                        case Encodable.EncodableType.LINKED_SERVICE:
                            promise = this._loadLinkedService(splitFactoryId, <Encodable.LinkedServiceEncodable>selectedEncodable, currentRefreshId);
                            break;

                        case Encodable.EncodableType.TABLE:
                            promise = this._loadDataset(splitFactoryId, <Encodable.TableEncodable>selectedEncodable, currentRefreshId);
                            break;

                        case Encodable.EncodableType.PIPELINE:
                            promise = this._loadPipeline(splitFactoryId, <Encodable.PipelineEncodable>selectedEncodable, currentRefreshId);
                            break;

                        case Encodable.EncodableType.ACTIVITY:
                            promise = this._loadActivityScript(splitFactoryId, <Encodable.ActivityEncodable>selectedEncodable, currentRefreshId);
                            break;

                        default:
                            // All other encodables should have followed the code path of no selection.
                            logger.logError("Unexpected encodable {0} for viewing script".format(JSON.stringify(selectedEncodable)));
                            break;
                    }

                    promise.finally(() => {
                        if (currentRefreshId === this._refreshId) {
                            this.loading(Framework.Loader.LoadingState.Ready);
                        }
                    });
                }
            }
        };
        this.selectionHandlerSubscription.callback(this._appContext.selectionHandler.getState());
        this._appContext.selectionHandler.register(this.selectionHandlerSubscription);
        this._lifetimeManager.registerForDispose(Framework.Util.subscribeAndCall(param.componentConfig.isOpen, (isOpen) => {
            if (isOpen) {
                this.selectionHandlerSubscription.callback(this._appContext.selectionHandler.getState());
            }
        }));

        logger.logInfo("Finished loading view: " + JsonViewer.className);
    }

    public dispose(): void {
        super.dispose();
        this._appContext.selectionHandler.unregister(this.selectionHandlerSubscription);
    }

    private _loadLinkedService(splitFactoryId: Framework.ResourceIdUtil.IDataFactoryId, linkedServiceEncodable: Encodable.LinkedServiceEncodable, currentRefreshId: number): Q.Promise<void> {
        this.displayText(ClientResources.jsonViewerLinkedServiceTitle.format(linkedServiceEncodable.name));

        return this._appContext.armService.getLinkedService({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName,
            linkedServiceName: linkedServiceEncodable.name
        }).then((linkedServiceJson) => {
            if (currentRefreshId === this._refreshId) {
                this.displayText(ClientResources.jsonViewerLinkedServiceTitle.format(linkedServiceJson.name));
                this.scriptText(JSON.stringify(linkedServiceJson, null, indentationSpacesCount));
            }
        }, (reason) => {
            this._handleError(reason, "Failed to load linked service {0} for factory {1}".format(linkedServiceEncodable.name, JSON.stringify(splitFactoryId)), currentRefreshId);
        });
    }

    private _loadDataset(splitFactoryId: Framework.ResourceIdUtil.IDataFactoryId, datasetEncodable: Encodable.TableEncodable, currentRefreshId: number): Q.Promise<void> {
        this.displayText(ClientResources.jsonViewerDatasetTitle.format(datasetEncodable.name));

        return this._datasetEntityView.fetch({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName,
            tableName: datasetEncodable.name
        }).then((datasetObj) => {
            if (currentRefreshId === this._refreshId) {
                this.displayText(ClientResources.jsonViewerDatasetTitle.format(datasetObj.name()));
                this.scriptText(JSON.stringify(ko.toJS(datasetObj), null, indentationSpacesCount));
            }
        }, (reason) => {
            this._handleError(reason, "Failed to load dataset {0} for factory {1}".format(datasetEncodable.name, JSON.stringify(splitFactoryId)), currentRefreshId);
        });
    }

    private _loadPipeline(splitFactoryId: Framework.ResourceIdUtil.IDataFactoryId, pipelineEncodable: Encodable.PipelineEncodable, currentRefreshId: number): Q.Promise<void> {
        this.displayText(ClientResources.jsonViewerPipelineTitle.format(pipelineEncodable.name));

        return this._pipelineEntityView.fetch({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName,
            pipelineName: pipelineEncodable.name
        }).then((pipelineObj) => {
            if (currentRefreshId === this._refreshId) {
                this.displayText(ClientResources.jsonViewerPipelineTitle.format(pipelineObj.name()));
                this.scriptText(JSON.stringify(ko.toJS(pipelineObj), null, indentationSpacesCount));
            }
        }, (reason) => {
            this._handleError(reason, "Failed to load pipeline {0} for factory {1}".format(pipelineEncodable.name, JSON.stringify(splitFactoryId)), currentRefreshId);
        });
    }

    private _loadActivityScript(splitFactoryId: Framework.ResourceIdUtil.IDataFactoryId, activityEncodable: Encodable.ActivityEncodable, currentRefreshId: number): Q.Promise<void> {
        this.displayText(this._getActivityDisplayTitle(activityEncodable.pipelineName, activityEncodable.name));
        let deferred = Q.defer<void>();

        this._pipelineEntityView.fetch({
            subscriptionId: splitFactoryId.subscriptionId,
            resourceGroupName: splitFactoryId.resourceGroupName,
            factoryName: splitFactoryId.dataFactoryName,
            pipelineName: activityEncodable.pipelineName
        }).then((pipelineObj) => {
            let selectedActivities: MdpExtension.DataModels.Activity[] = null;
            if (Framework.Util.koPropertyHasValue(pipelineObj.properties().activities)) {
                selectedActivities = pipelineObj.properties().activities().filter((activityObj) => {
                    return activityEncodable.name.toLowerCase() === activityObj.name().toLowerCase();
                });
            }
            if (!selectedActivities) {
                logger.logError("There is no activity {0} in pipeline {1} in factory {2}.".format(activityEncodable.name, activityEncodable.pipelineName,
                    JSON.stringify(splitFactoryId)));
                let message = ClientResources.jsonViewerNoSuchActivityInPipelineText.format(activityEncodable.name, pipelineObj.name());
                this.scriptText(message);
                deferred.reject(message);
                return;
            }

            this.displayText(this._getActivityDisplayTitle(pipelineObj.name(), selectedActivities[0].name()));
            /* tslint:disable:no-any */
            let typeProperties: any = selectedActivities[0].typeProperties();
            /* tslint:enable:no-any */
            if (Framework.Util.koPropertyHasValue(typeProperties.script)) {
                this.scriptText(typeProperties.script());
                deferred.resolve(null);
            } else if (Framework.Util.koPropertyHasValue(typeProperties.scriptLinkedService) &&
                Framework.Util.koPropertyHasValue(typeProperties.scriptPath)) {
                this._appContext.dataFactoryService.getActivityScriptBlob({
                    subscriptionId: splitFactoryId.subscriptionId,
                    resourceGroupName: splitFactoryId.resourceGroupName,
                    factoryName: splitFactoryId.dataFactoryName,
                    name: pipelineObj.name(),
                    activityName: selectedActivities[0].name(),
                    noApiVersion: true
                }).then(([blobInfo]) => {
                    this.scriptText(blobInfo.BlobData);
                    deferred.resolve(null);
                }, (reason) => {
                    deferred.reject(reason);
                });

            } else {
                this.scriptText(ClientResources.noActivityScript);
                deferred.resolve(null);
            }
        }, (reason) => {
            deferred.reject(reason);
        });

        return deferred.promise.fail((reason) => {
            if (typeof reason !== "string") {
                this._handleError(reason, "Failed to load script for activity {0}, in pipeline {1} for factory {2}".format(
                    activityEncodable.name, activityEncodable.pipelineName, JSON.stringify(splitFactoryId)), currentRefreshId);
            }
            throw reason;
        });
    }

    private _handleError(reason: JQueryXHR, message: string, currentRefreshId): void {
        let azureError = Framework.Util.getAzureError(reason);
        let toDisplay: Object = null;
        if (azureError) {
            logger.logInfo("Failed with error: AzureError: {0}".format(JSON.stringify(azureError)));
            toDisplay = azureError;
        } else {
            logger.logError(message + "Reason: " + JSON.stringify(reason));
            toDisplay = reason;
        }
        if (currentRefreshId === this._refreshId) {
            this.scriptText(JSON.stringify(toDisplay, null, indentationSpacesCount));
        }
    }

    private _getActivityDisplayTitle(pipelineName: string, activityName: string): string {
        return ClientResources.jsonViewerPipelineTitle.format(pipelineName) + " " + ClientResources.jsonViewerActivityTitle.format(activityName);
    }
}

export let viewModel = JsonViewer;
