import ResourceIdUtil = require("../Framework/Util/ResourceIdUtil");
import AppContext = require("../AppContext");
import Log = require("../Framework/Util/Log");
import Framework = require("../../_generated/Framework");
import MessageHandler = require("./MessageHandler");

"use strict";
const logger = Log.getLogger({
    loggerName: "RoutingHandler"
});

export let viewName = {
    edit: "edit",
    home: "home"
};

export let urlKeywords = {
    moduleName: {
        order: 0,
        label: "moduleName",
        value: "modulename"
    },
    moduleView: {
        order: 1,
        label: "moduleView",
        value: "moduleview"
    },
    subscription: {
        order: 2,
        label: "subscription",
        value: "subscription"
    },
    resourceGroup: {
        order: 3,
        label: "resourceGroup",
        value: "resourcegroup"
    },
    dataFactory: {
        order: 4,
        label: "dataFactory",
        value: "datafactory"
    },
    linkedService: {
        order: 5,
        label: "linkedService",
        value: "linkedservice"
    },
    dataset: {
        order: 6,
        label: "dataset",
        value: "dataset"
    },
    pipeline: {
        order: 7,
        label: "pipeline",
        value: "pipeline"
    },
    view: {
        order: 8,
        label: "view",
        value: "view"
    }
};

export const moduleName: string = "datafactory";
export type IRoutingHandlerSubscription = MessageHandler.IMessageSubscription<StringMap<string>>;

export class RoutingHandler extends MessageHandler.MessageHandler<StringMap<string>> {
    // The state represents the current url/route.

    private _appContext: AppContext.AppContext;
    private _urlKeywordOrdering: string[] = [];
    private _lifetimeManager: Framework.Disposable.IDisposableLifetimeManager;
    private _publisherName: string = null;
    private _refreshId: number = 0;

    // handles the routeChange event
    private _onRouteChange = (route: Microsoft.DataStudio.Application.IRouteEntry): boolean => {
        logger.logDebug("Route changed to: " + route.url);
        let currentRefreshId = ++this._refreshId;

        // if the publisher was not defined, then the change was requested externally.
        let isExternal = false;
        if (!this._publisherName) {
            // and hence update the state from the url
            isExternal = true;
            this.state = this._parseRoute(Microsoft.DataStudio.Application.ShellContext.CurrentRoute());
        }

        let publisherName = this._publisherName || "DataStudio";
        this._publisherName = null;

        // Only check for required params. Actions on optional url params should be handled by the views themselves.
        if (this.state[urlKeywords.subscription.value] && this.state[urlKeywords.resourceGroup.value] && this.state[urlKeywords.dataFactory.value]) {
            this._appContext.factoryId(ResourceIdUtil.createDataFactoryIdString(this.state[urlKeywords.subscription.value],
                this.state[urlKeywords.resourceGroup.value], this.state[urlKeywords.dataFactory.value]));
        } else {
            this._appContext.dialogHandler.addRequest({
                title: ClientResources.accessDenied,
                innerHTML: ClientResources.noFactoryErrorText,
                dismissalHandler: (result) => {
                    window.location.reload();
                },
                primaryCommandText: ClientResources.ok
            });

            return false;
        }

        // Validate the pipeline name before giving it out to subscribers. Update only if pipelineName was specified externally.
        let pipelineName: string = this.state[urlKeywords.pipeline.value];
        if (isExternal && pipelineName) {
            let pipelineEntityView = this._appContext.armDataFactoryCache.pipelineCacheObject.createView();
            let splitFactoryId = this._appContext.splitFactoryId();
            pipelineEntityView.fetch({
                subscriptionId: splitFactoryId.subscriptionId,
                resourceGroupName: splitFactoryId.resourceGroupName,
                factoryName: splitFactoryId.dataFactoryName,
                pipelineName: pipelineName
            }).then((pipeline) => {
                if (this._refreshId === currentRefreshId) {
                    this.state[urlKeywords.pipeline.value] = pipeline.name();
                    this.notifySubscribers(publisherName, Object.keys(this.subscribers));
                }
            }, (reason: JQueryXHR) => {
                if (this._refreshId === currentRefreshId) {
                    if (reason.status === 404) {
                        this._appContext.dialogHandler.addRequest({
                            title: ClientResources.pipelineNotFound,
                            innerHTML: reason.responseJSON.message,
                            primaryCommandText: ClientResources.ok,
                            dismissalHandler: () => { return; }
                        });
                        this.state[urlKeywords.pipeline.value] = null;
                        Microsoft.DataStudio.Application.Router.navigate(this._buildUrl(this.state));
                        this.notifySubscribers(publisherName, Object.keys(this.subscribers));
                    } else {
                        let errorMessage: string = null;
                        if (reason.responseJSON && reason.responseJSON.message) {
                            errorMessage = reason.responseJSON.message;
                        } else {
                            errorMessage = JSON.stringify(reason);
                        }
                        this._appContext.dialogHandler.addRequest({
                            title: ClientResources.failedToLoadPipelineView,
                            innerHTML: errorMessage,
                            primaryCommandText: ClientResources.ok,
                            dismissalHandler: () => { return; }
                        });
                        logger.logError("Could not get pipeline name {0} for factory {1}. Reason: {2}".format(pipelineName, JSON.stringify(splitFactoryId), JSON.stringify(reason)));
                    }
                }
            });
        } else {
            this.notifySubscribers(publisherName, Object.keys(this.subscribers));
        }
        return true;
    };

    constructor(appContext: AppContext.AppContext) {
        super();
        this._lifetimeManager = appContext._lifetimeManager.createChildLifetime();
        this._appContext = appContext;

        for (let keyword in urlKeywords) {
            let value = urlKeywords[keyword];
            let lowerCaseKeyword = keyword.toLowerCase();
            if (keyword !== lowerCaseKeyword) {
                urlKeywords[lowerCaseKeyword] = value;
            }
            this._urlKeywordOrdering[value.order] = lowerCaseKeyword;
        }

        // parse factory from URL
        let currentRoute = Microsoft.DataStudio.Application.ShellContext.CurrentRoute();
        this._onRouteChange(currentRoute);
        this._parseExposureControlStrings(currentRoute.query);

        this._lifetimeManager.registerForDispose(
            Microsoft.DataStudio.Application.ShellContext.CurrentRoute.subscribe((value) => {
                this._onRouteChange(Microsoft.DataStudio.Application.ShellContext.CurrentRoute());
            }));
    }

    // Subscribers can provide partial state, which will be merged with the existing state
    public pushState(publisherName: string, newState: StringMap<string>) {
        jQuery.extend(this.state, newState);
        let newUrl = this._buildUrl(this.state);
        this._publisherName = publisherName;
        Microsoft.DataStudio.Application.Router.navigate(newUrl);
    }

    public dispose(): void {
        this._lifetimeManager.dispose();
    }

    private _parseRoute(route: Microsoft.DataStudio.Application.IRouteEntry): StringMap<string> {
        let parsedUrl: StringMap<string> = Object.create(null);
        parsedUrl[urlKeywords.moduleName.value] = route.module;
        parsedUrl[urlKeywords.moduleView.value] = route.view;
        let args = route.arguments.split("/").filter((value) => { return !!value; });
        let length = args.length;
        for (let i = 0; i < length; i += 2) {
            if (i + 1 < length) {
                parsedUrl[args[i].toLowerCase()] = args[i + 1];
            }
        }
        return parsedUrl;
    }

    private _buildUrl(localCaseParsedUrl: StringMap<string>): string {
        let urlString = "";
        this._urlKeywordOrdering.forEach((urlKeyword) => {
            let value = localCaseParsedUrl[urlKeyword];
            if (value) {
                if (urlKeyword === urlKeywords.moduleName.value || urlKeyword === urlKeywords.moduleView.value) {
                    urlString += value + "/";
                } else {
                    urlString += urlKeywords[urlKeyword].value + "/" + value + "/";
                }
            }
        });

        // handle special case for query urls
        if (Microsoft.DataStudio.Application.Router.currentQuery()) {
            urlString += Microsoft.DataStudio.Application.Router.currentQuery();
        }

        return urlString;
    }

    private _parseExposureControlStrings(query: string): void {
        if (!query) {
            return;
        }
        query = query.substring(1);
        query.split("&").forEach((queryOption) => {
            let [key, value] = queryOption.split("=");
            let namespace = key.split(".");
            if (namespace[0] === "EC") {
                let ecObject = EC, length = namespace.length;
                for (let i = 1; i < length; i++) {
                    let newObject = ecObject[namespace[i]];
                    if (Framework.Util.propertyHasValue(newObject)) {
                        if (newObject instanceof Object) {
                            ecObject = newObject;
                        } else if (i === length - 1) {
                            let ecValue = null;
                            switch (value) {
                                case "true":
                                    ecValue = true;
                                    break;
                                case "false":
                                    ecValue = false;
                                    break;
                                default:
                                    let int = parseInt(value, 0);
                                    if (isNaN(int)) {
                                        ecValue = value;
                                    } else {
                                        ecValue = int;
                                    }
                            }
                            ecObject[namespace[i]] = ecValue;
                        }
                    } else {
                        break;
                    }
                }
            }
        });
    }
}
