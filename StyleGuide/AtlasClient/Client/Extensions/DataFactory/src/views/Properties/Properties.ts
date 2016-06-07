/// <reference path="../../References.d.ts" />

import Encodable = require("../../scripts/Framework/Model/Contracts/Encodable");
import Framework = require("../../_generated/Framework");
import MessageHandler = require("../../scripts/Handlers/MessageHandler");
import PropertiesViewModel =  require("../../scripts/Framework/Views/Properties/PropertiesViewModel");
import PropertyTypes = PropertiesViewModel.PropertyTypes;
import Gateway = require("../../scripts/Framework/Model/Contracts/Gateway");

let logger = Framework.Log.getLogger({
    loggerName: "Properties"
});

/* tslint:disable:class-name */
export class DataFactoryProperties extends PropertiesViewModel.PropertiesViewModel {
/* tslint:enable:class-name */
   public selectionSubscription: MessageHandler.ISelectionSubscription;

    public _inputs: StringMap<void> = {
        folderPath: null
    };

    // names where the property tokens should be in reverse order
    public _reversalNames: StringMap<void> = {
        "Policy": null
    };

    // names where the token should be ignored
    public _ignoreNames: StringMap<void> = {
        "Properties": null,
        "Type Properties": null
    };

    public _replacementNames: StringMap<string> = {
        "Extended Properties": "Extended Property:",
        "Run Start Pair": "Attempt Start",
        "Run End Pair": "Attempt End"
    };

    private _selectedEncodables: Encodable.Encodable[] = [];

    constructor() {
        super();

        this.selectionSubscription = {
            name: viewModel.viewName,
            callback: this._processSelectionUpdate
        };

        this._appContext.selectionHandler.register(this.selectionSubscription);

        // set the initial state
        this._processEncodables();
    }

    private _processSelectionUpdate = (selectedNodes: Encodable.Encodable[], publisherName: string) => {
        this._selectedEncodables = selectedNodes.slice(0);
        this._processEncodables();
    };

    public dispose(): void {
        super.dispose();
        this._appContext.selectionHandler.unregister(this.selectionSubscription);
    }

    public _refresh(): void {
        this._processEncodables();
    };

    /* Individual encodable handlers */
     private _processActivityWindow(encodable: Encodable.ActivityRunEncodable, loadingFinished: Q.Deferred<PropertyTypes.IPropertyGroup>) {
        let properties: PropertyTypes.IProperty[] = [];

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty("Window Start", PropertiesViewModel.PropertiesViewModel._returnTimePair(encodable.observable().windowStartPair)));
        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty("Window End", PropertiesViewModel.PropertiesViewModel._returnTimePair(encodable.observable().windowEndPair)));

        properties = properties.concat(this._addAllProperties(encodable.observable(),
            ["inputTables", "statusCalendarStatus", "outputTables", "reservedId", "stateId",
            "entities", "updateTime", "waiting", "displayStateHtml", "displayState", "runStart",
            "runEnd", "windowStart", "windowEnd", "windowStartPair", "windowEndPair", "windowPair", "copyPairs"]));

        loadingFinished.resolve({
            name: "{0} - {1}".format(encodable.observable().windowStartPair.UTC, encodable.observable().windowEndPair.UTC),
            altName: "{0} - {1}".format(encodable.observable().windowStartPair.UTC, encodable.observable().windowEndPair.UTC),
            type: ClientResources.activityWindowPropertiesTitle,
            properties: properties
        });
     }

     private _processLinkedService(encodable: Encodable.LinkedServiceEncodable, loadingFinished: Q.Deferred<PropertyTypes.IPropertyGroup>) {
         let properties: PropertyTypes.IProperty[] = [];

         let linkedServiceView = this._appContext.armDataFactoryCache.linkedServiceCacheObject.createView();

         linkedServiceView.fetch({
             subscriptionId: this._appContext.splitFactoryId().subscriptionId,
             resourceGroupName: this._appContext.splitFactoryId().resourceGroupName,
             factoryName: this._appContext.splitFactoryId().dataFactoryName,
             linkedServiceName: encodable.name
         }).then((linkedService) => {
             properties = properties.concat(this._addAllProperties(linkedService, { "name": null, "id": null, "connectionString": null }));
             let connectionStringKeyword = "connectionString";
             if (Framework.Util.koPropertyHasValue(linkedService.properties().typeProperties) &&
                 Framework.Util.koPropertyHasValue(linkedService.properties().typeProperties()[connectionStringKeyword])) {
                 properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
                     name: ClientResources.connectionStringProperty,
                     valueAccessor: () => {
                         return <string>linkedService.properties().typeProperties()[connectionStringKeyword]();
                     },
                     input: true, showEmpty: false
                 }));
             }
             loadingFinished.resolve({ name: linkedService.name(), type: ClientResources.linkedServiceAssetText, properties: properties });
         }, (error) => {
             loadingFinished.reject(error);
         });
     }

     private _processActivity(encodable: Encodable.ActivityEncodable, loadingFinished: Q.Deferred<PropertyTypes.IPropertyGroup>) {
        let properties: PropertyTypes.IProperty[] = [];
        let pipelineEntityView = this._appContext.armDataFactoryCache.pipelineCacheObject.createView();

        pipelineEntityView.fetch({
            subscriptionId: this._appContext.splitFactoryId().subscriptionId,
            resourceGroupName: this._appContext.splitFactoryId().resourceGroupName,
            factoryName: this._appContext.splitFactoryId().dataFactoryName,
            pipelineName: encodable.pipelineName
        }).then((pipeline) => {
            let activity: MdpExtension.DataModels.Activity = null;
            pipeline.properties().activities().some((entity) => {
                if (entity.name().toUpperCase() === encodable.name.toUpperCase()) {
                    activity = entity;
                    return true;
                }

                return false;
            });

            if (!activity) {
                loadingFinished.reject("Activity not found");
            }

            properties = properties.concat(this._addAllProperties(activity, { "name": null }));

            loadingFinished.resolve({ name: activity.name(), type: ClientResources.activityAssetText, properties: properties });
        }, (error) => {
            loadingFinished.reject(error);
        });
    }

    private _processFactory(loadingFinished: Q.Deferred<PropertyTypes.IPropertyGroup>) {
        let properties: PropertyTypes.IProperty[] = [];
        let factoryEntityView = this._appContext.armDataFactoryCache.dataFactoryCacheObject.createView();

        factoryEntityView.fetch({
            subscriptionId: this._appContext.splitFactoryId().subscriptionId,
            resourceGroupName: this._appContext.splitFactoryId().resourceGroupName,
            factoryName: this._appContext.splitFactoryId().dataFactoryName
        }).then((dataFactory) => {
            properties = properties.concat(this._addAllProperties(dataFactory, { name: null, id: null, type:null, dataFactoryId: null }));
            properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.SubscriptionId,
                PropertiesViewModel.PropertiesViewModel._returnObject(this._appContext.splitFactoryId().subscriptionId)));
            properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.resourceGroupNameProperty,
                PropertiesViewModel.PropertiesViewModel._returnObject(this._appContext.splitFactoryId().resourceGroupName)));

            loadingFinished.resolve({name: dataFactory.name(), type: ClientResources.factoryPropertiesTitle, properties: properties});
        }, (error) => {
            loadingFinished.reject(error);
        });
    }

    private _processPipeline(encodable: Encodable.PipelineEncodable, loadingFinished: Q.Deferred<PropertyTypes.IPropertyGroup>) {
        let properties: PropertyTypes.IProperty[] = [];
        let pipelineEntityView = this._appContext.armDataFactoryCache.pipelineCacheObject.createView();

        pipelineEntityView.fetch({
            subscriptionId: this._appContext.splitFactoryId().subscriptionId,
            resourceGroupName: this._appContext.splitFactoryId().resourceGroupName,
            factoryName: this._appContext.splitFactoryId().dataFactoryName,
            pipelineName: encodable.name
        }).then((pipeline) => {
            let endPair = Framework.Datetime.getTimePair(pipeline.properties().end());

            let startPair = Framework.Datetime.getTimePair(pipeline.properties().start());
            properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.pipelinePropertiesStartDate, () => { return [startPair.UTC, startPair.UTC]; }));
            properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.pipelinePropertiesEndDate, () => { return [endPair.UTC, endPair.UTC]; }));
            properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.pipelinePropertiesIsPaused,
                () => { return pipeline.properties().isPaused() ? ClientResources.Yes : ClientResources.No; }));
            properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.pipelinePropertiesProvisioningState, pipeline.properties().provisioningState));
            properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.errorMessageTitle, pipeline.properties().errorMessage, true, false));

            loadingFinished.resolve({ name: pipeline.name(), type: ClientResources.pipelineAssetText, properties: properties });
        }, (error) => {
            loadingFinished.reject(error);
        });
    }

    private _processGateway(encodable: Encodable.GatewayEncodable, loadingFinished: Q.Deferred<PropertyTypes.IPropertyGroup>) {
        let properties: PropertyTypes.IProperty[] = [];
        let gatewayEntityView = this._appContext.armDataFactoryCache.gatewayCacheObject.createView();

        let setUpdateInfo = (gateway) => {
            let lastEndUpgradeTime;
            if (Framework.Util.koPropertyHasValue(gateway.properties().lastEndUpgradeTime)) {
                let lastEndUpgradeTimePair = Framework.Datetime.getTimePair(gateway.properties().lastEndUpgradeTime().toString());
                lastEndUpgradeTime = [lastEndUpgradeTimePair.UTC, lastEndUpgradeTimePair.UTC];
            }
            properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.gatewayPropertiesLastEndUpgradeTime, () => { return lastEndUpgradeTime; }));

            if (Framework.Util.koPropertyHasValue(gateway.properties().scheduledUpgradeStartTime)) {
                let scheduledUpgradeStartTimePair = Framework.Datetime.getTimePair(gateway.properties().scheduledUpgradeStartTime().toString());
                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.gatewayPropertiesScheduledUpgradeStartTime, () => {
                     return [scheduledUpgradeStartTimePair.UTC, scheduledUpgradeStartTimePair.UTC];
                }));
            } else {
                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(
                    ClientResources.gatewayPropertiesScheduledUpgradeStartTime, () => { return ClientResources.gatewayPropertiesAutoUpdateOff; }));
            }
        };

        gatewayEntityView.fetch({
            subscriptionId: this._appContext.splitFactoryId().subscriptionId,
            resourceGroupName: this._appContext.splitFactoryId().resourceGroupName,
            factoryName: this._appContext.splitFactoryId().dataFactoryName,
            gatewayName: encodable.name
        }).then((gateway) => {
            let state = "Good";
            let errorMessage;

            switch (Gateway.GatewayDataHelper.parseStatus(gateway.properties().status())) {
                case Gateway.GatewayStatus.Online:
                    if (!Framework.Util.koPropertyHasValue(gateway.properties().versionStatus)) { break; }
                    switch (Gateway.GatewayDataHelper.parseVersionStatus(gateway.properties().versionStatus())) {
                        case Gateway.GatewayVersionStatus.Expiring:
                            state = "Warning";
                            errorMessage = ClientResources.GatewayExpiringMessage;
                            break;
                        case Gateway.GatewayVersionStatus.Expired:
                            state = "Error";
                            errorMessage = ClientResources.GatewayExpiredMessage;
                            break;
                        default:
                            break;
                    }
                    break;
                case Gateway.GatewayStatus.NeedRegistration:
                    state = "Warning";
                    errorMessage = ClientResources.GatewayNeedRegistrationMessage;
                    break;
                case Gateway.GatewayStatus.Offline:
                    state = "Error";
                    errorMessage = ClientResources.GatewayOfflineMessage;
                    break;
                case Gateway.GatewayStatus.Upgrading:
                    state = "Warning";
                    errorMessage = ClientResources.GatewayUpdatingMessage;
                    break;
                default:
                    break;
            }

            properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.gatewayPropertiesStatus, () => { return state; }));
            if (gateway.properties().version && gateway.properties().version()) {
                let versionString = gateway.properties().version();
                if (gateway.properties().versionStatus && Gateway.GatewayDataHelper.needUpdate(gateway)) {
                    versionString += " " + ClientResources.NewVersionAvailable;
                }
                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.gatewayPropertiesVersion, () => { return versionString; }));
            }

            let createPair = Framework.Datetime.getTimePair(gateway.properties().createTime().toString());
            if (state === "Warning" || state === "Error") {
                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.gatewayPropertiesErrorMessage, () => { return errorMessage; }));
                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.gatewayPropertiesDescription, gateway.properties().description));
                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.gatewayPropertiesCreateTime, () => { return [createPair.UTC, createPair.UTC]; }));
                setUpdateInfo(gateway);
                properties = properties.concat(this._addAllProperties(gateway, ["name", "status", "version", "description", "versionStatus", "id", "dataFactoryName", "createTime",
                    "lastUpgradeResult", "lastStartUpgradeTime", "lastEndUpgradeTime", "scheduledUpgradeStartTime", "isAutoUpdateOff"]));
            } else {
                let lastConnectTimePair = Framework.Datetime.getTimePair(gateway.properties().lastConnectTime().toString());
                let registerTimePair = Framework.Datetime.getTimePair(gateway.properties().registerTime().toString());

                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.gatewayPropertiesDescription, gateway.properties().description));
                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.gatewayPropertiesCreateTime, () => { return [createPair.UTC, createPair.UTC]; }));
                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(
                    ClientResources.gatewayPropertiesLastConnectTime, () => { return [lastConnectTimePair.UTC, lastConnectTimePair.UTC]; }));
                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.gatewayPropertiesRegisterTime, () => { return [registerTimePair.UTC, registerTimePair.UTC]; }));
                setUpdateInfo(gateway);
                properties = properties.concat(this._addAllProperties(gateway,
                    ["name", "status", "version", "description", "createTime", "lastConnectTime", "registerTime", "versionStatus", "id", "dataFactoryName",
                        "lastUpgradeResult", "lastStartUpgradeTime", "lastEndUpgradeTime", "scheduledUpgradeStartTime", "isAutoUpdateOff"]));
            }

            loadingFinished.resolve({ name: gateway.name(), type: ClientResources.gatewayAssetText, properties: properties });
        }, (error) => {
            loadingFinished.reject(error);
        });
    }

    private _returnAvailabiltiy(table: MdpExtension.DataModels.DataArtifact) {
        return () => {
            // this should be lower case so we have sentence case
            let frequency = table.properties().availability().frequency().toLowerCase();
            let interval = table.properties().availability().interval();

            if(interval === 1) {
                return "Every " + frequency;
            }

            return "Every {0} {1}s".format(interval, frequency);
        };
    }

    private _returnStructure(table: MdpExtension.DataModels.DataArtifact): () => PropertyTypes.ITablePropertyValue {
        return () => {
            let columns: string[] = [ClientResources.tableSchemaNameGridHeading, ClientResources.tableSchemaTypeGridHeading];
            let rows: KnockoutObservableArray<KnockoutObservable<string>[]> = ko.observableArray([]);

            table.properties().structure().forEach((element) => {
              rows.push([element.name, element.type]);
            });

            return {rows: rows, columns: ko.observable(columns)};
        };
    }

    private _processTable(table: Encodable.TableEncodable, loadingFinished: Q.Deferred<PropertyTypes.IPropertyGroup>) {
        let properties: PropertyTypes.IProperty[] = [];

        let tableEntityView = this._appContext.armDataFactoryCache.tableCacheObject.createView();

        tableEntityView.fetch({
            subscriptionId: this._appContext.splitFactoryId().subscriptionId,
            resourceGroupName: this._appContext.splitFactoryId().resourceGroupName,
            factoryName: this._appContext.splitFactoryId().dataFactoryName,
            tableName: table.name
        }).then((artifact: MdpExtension.DataModels.DataArtifact) => {
            let linkedServiceView = this._appContext.armDataFactoryCache.linkedServiceCacheObject.createView();

            linkedServiceView.fetch({
                subscriptionId: this._appContext.splitFactoryId().subscriptionId,
                resourceGroupName: this._appContext.splitFactoryId().resourceGroupName,
                factoryName: this._appContext.splitFactoryId().dataFactoryName,
                linkedServiceName: artifact.properties().linkedServiceName()
            }).then((linkedService) => {
                let linkedServiceProperties = linkedService.properties();

                properties = properties.concat(this._addAllProperties(artifact, {"structure": null, "availability":null,
                "tableName":null, "format": null, "name": null, "id": null, "linkedServiceName":null, "partitionedBy":null}));

                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.availability, this._returnAvailabiltiy(artifact)));

                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.tableSchema, this._returnStructure(artifact)));

                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.linkedServiceNameProperty, artifact.properties().linkedServiceName));
                properties.push(PropertiesViewModel.PropertiesViewModel._addProperty(ClientResources.linkedServiceType, linkedServiceProperties.type));

                let connectionStringKeyword = "connectionString";
                if (Framework.Util.koPropertyHasValue(linkedServiceProperties.typeProperties) &&
                    Framework.Util.koPropertyHasValue(linkedServiceProperties.typeProperties()[connectionStringKeyword])) {
                    properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
                        name: ClientResources.connectionStringProperty,
                        valueAccessor: () => {
                            return <string>linkedServiceProperties.typeProperties()[connectionStringKeyword]();
                        },
                        input: true
                    }));
                }

                loadingFinished.resolve({ name: artifact.name(), type: ClientResources.tableAssetText, properties: properties });
            }, (error) => {
                loadingFinished.reject(error);
            });
        }, (error) => {
            loadingFinished.reject(error);
        });
    }

    private _processEncodables() {
        let promises: Q.Promise<PropertyTypes.IPropertyGroup>[] = [];

        // by default, just show the factory
        if (this._selectedEncodables.length === 0) {
            let loadingFinished: Q.Deferred<PropertyTypes.IPropertyGroup> = Q.defer<PropertyTypes.IPropertyGroup>();
            this._processFactory(loadingFinished);
            promises.push(loadingFinished.promise);
        } else {
            // we only want to show the loading icon when we're not just reverting to the factory properties
            this.loading(true);

            this._selectedEncodables.forEach((encodable) => {
                let loadingFinished: Q.Deferred<PropertyTypes.IPropertyGroup> = Q.defer<PropertyTypes.IPropertyGroup>();

                switch (encodable.type) {
                    case Encodable.EncodableType.TABLE:
                        this._processTable(<Encodable.TableEncodable>encodable, loadingFinished);
                        break;

                    case Encodable.EncodableType.PIPELINE:
                        this._processPipeline(<Encodable.TableEncodable>encodable, loadingFinished);
                        break;

                    case Encodable.EncodableType.ACTIVITY:
                        this._processActivity(<Encodable.ActivityEncodable>encodable, loadingFinished);
                        break;

                   case Encodable.EncodableType.LINKED_SERVICE:
                        this._processLinkedService(<Encodable.LinkedServiceEncodable>encodable, loadingFinished);
                        break;

                    case Encodable.EncodableType.ACTIVITY_RUN:
                        this._processActivityWindow(<Encodable.ActivityRunEncodable>encodable, loadingFinished);
                        break;

                    case Encodable.EncodableType.GATEWAY:
                        this._processGateway(<Encodable.GatewayEncodable>encodable, loadingFinished);
                        break;

                    case Encodable.EncodableType.DATAFACTORY:
                        this._processFactory(loadingFinished);
                        break;

                    default:
                        logger.logError("Unexpected switch statement value: " + encodable.type);
                        return;
                }

                promises.push(loadingFinished.promise);
            });
        }

        let refreshId = ++this._refreshId;

        Q.all(promises).then((propertyGroups) => {
            // if we've had a more recent id
            if(refreshId !== this._refreshId) {
                return;
            }

            // clear existing properties
            this.propertyGroups.removeAll();

            propertyGroups.sort((a, b) => {
                return ko.unwrap(a.name).localeCompare(ko.unwrap(b.name));
            });

            propertyGroups.forEach((group) => {
                let displayGroup = <PropertiesViewModel.IDisplayPropertyGroup>group;
                displayGroup.expanded = ko.observable(false);
                displayGroup.hideHeader = false;
                if(!displayGroup.altName) {
                    displayGroup.altName = null;
                }

                displayGroup.properties = displayGroup.properties.filter((property)=> {
                    return !!property;
                });

                this.propertyGroups.push(displayGroup);
            });

            this.propertyGroups()[0].expanded(true);

            this.loading(false);
        }, (error: JQueryXHR) => {
            logger.logError("Error: failed to get properties. Original error: " + JSON.stringify(error));
            this.loading(false);
        });
    }
}

/* tslint:disable:class-name */
export class viewModel extends DataFactoryProperties {};
/* tslint:enable:class-name */
export const template = PropertiesViewModel.template;
