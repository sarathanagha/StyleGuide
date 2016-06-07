"use strict";

import ActivityWindowCache = require("../ActivityWindowCache");

export enum DiagramMode {
    Factory,
    OpenPipeline
}

export interface IPipelineDiagramModeParameter {
    pipelineId: string;
}

export interface IDiagramContext {
    diagramMode: DiagramMode;
    diagramModeParameters: IPipelineDiagramModeParameter;
}

export interface ITableStatusQueryProperties {
    queryFilter: string;
    scheduler: MdpExtension.DataModels.ActivityScheduler;
    recentActivityWindows: KnockoutObservableArray<ActivityWindowCache.IActivityWindowObservable>;
}
