/// <reference path="../References.d.ts" />


import StudioCache = require("./Framework/Model/StudioCache");
import StudioService = require("./Services/StudioService");
export import Spinner = require("./Framework/UI/Spinner");
import ADF = require("./Framework/ADF");
import AdfModels = require("./Model/AdfModelTypes");

"use strict";

let logger = Microsoft.DataStudio.Studio.LoggerFactory.getLogger({ loggerName: "AppContext" });

export interface IAdfModel {
    linkedServices: AdfModels.ILinkedServiceModelEntity[];
    datasets: AdfModels.IDatasetModelEntity[];
    activities: AdfModels.IActivityModelEntity[];
}

// Instead of implementing singleton pattern everywhere, using this as the method of interaction
// between different viewmodels and objects.
export class AppContext {
    private static _instance: AppContext;

    public studioService: StudioService.StudioService;
    public studioCache: StudioCache.StudioCache;

    public spinner: Spinner.SpinnerViewModel = null;

    public subscriptionId: KnockoutObservable<string> = ko.observable(null);
    public selectedModuleName: KnockoutObservable<string> = ko.observable(null);
    public selectionHandler: ADF.MessageHandler.MessageHandler<Object[]> = new ADF.MessageHandler.MessageHandler<Object[]>();

    public authoringAppModel: IAdfModel = {
        linkedServices: [],
        datasets: [],
        activities: []
    };

    public static getInstance(): AppContext {
        if (!AppContext._instance) {
            AppContext._instance = new AppContext(false);
        }
        return AppContext._instance;
    }

    constructor(testing: boolean) {
        logger.logInfo("Begin loading Studio AppContext.");

        // the services depend on this
        this.spinner = new Spinner.SpinnerViewModel();

        this.studioService = new StudioService.StudioService(this);
        this.studioCache = new StudioCache.StudioCache(this.studioService);

        logger.logInfo("Finished loading Studio AppContext.");
    }
}
