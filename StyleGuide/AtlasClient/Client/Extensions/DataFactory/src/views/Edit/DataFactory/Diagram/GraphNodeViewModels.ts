/// <amd-dependency path="text!./Templates/ActivityGraphNodeTemplate.html" />
/// <amd-dependency path="text!./Templates/TableGraphNodeTemplate.html" />
/// <amd-dependency path="text!./Templates/BasePipelineGraphNodeTemplate.html" />

import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");
/* tslint:disable:no-unused-variable */
import DiagramModuleDeclarations = require("./DiagramModuleDeclarations");
import Framework = require("../../../../_generated/Framework");
/* tslint:enable:no-unused-variable */

import TableModel = DiagramModuleDeclarations.TableModel;
import ActivityModel = DiagramModuleDeclarations.ActivityModel;
import PipelineModel = DiagramModuleDeclarations.PipelineModel;
import Util = require("../../../../scripts/Framework/Util/Util");
import PipelineNodeCommands = require("./PipelineNodeCommands");
import DatasetNodeCommands = require("./DatasetNodeCommands");
import BasePipelineExtension = require("./BasePipelineExtensionViewModel");
import IconResources = Framework.IconResources;
import Log = require("../../../../scripts/Framework/Util/Log");
import AppContext = require("../../../../scripts/AppContext");
import StatusCalendarFlyoutKnockoutBinding = require("../../../../bootstrapper/StatusCalendarFlyoutKnockoutBinding");
import ActivityWindowModel = require("../../../../scripts/Framework/Model/Contracts/ActivityWindow");
import DiagramContracts = require("../../../../scripts/Framework/Model/Contracts/Diagram");
import ActivityWindowCache = Framework.ActivityWindowCache;
import Encodable = require("../../../../scripts/Framework/Model/Contracts/Encodable");

"use strict";
import Graph = DiagramModuleDeclarations.Controls.Visualization.Graph;
let logger = Log.getLogger({
    loggerName: "GraphNodeViewModel"
});

/* tslint:disable:no-internal-module */
export module Constants {
    // paverma The nodes in Ibiza are of height 50, 130, 100 respectively. But in new Atlas design more content was added to the
    // table node, hence the heights had to be increased. This was required to avoid overlaps in user layouts.
    export const TableGraphNodeHeight = 65;   // 50
    export const TableGraphNodeWidth = 225;
    export const PipelineGraphNodeHeight = 169;   // 130
    export const PipelineGraphNodeWidth = 200;
    export const ActivityGraphNodeHeight = 130;   // 100
    export const ActivityGraphNodeWidth = 225;
    export const GridResolution = 10;
    export const VerticalStretchFactor = 1.3;     // For loading old graphs
};
/* tslint:enable:no-internal-module */

export class HighlightableNode extends Graph.GraphNode {
    public highlighted: KnockoutObservable<boolean> = ko.observable(false);
    public isActivated: KnockoutObservable<boolean> = ko.observable(false);
    public encodable: Encodable.Encodable = null;

    public activated() {
        // if we have an encodable that should be shown in the properties panel
        if (this.encodable) {
            AppContext.AppContext.getInstance().openProperties();
        }
    }
}

/**
 * A graph node representing a data artifact.
 */
export class TableGraphNodeViewModel extends HighlightableNode {
    private static template = require("text!./Templates/TableGraphNodeTemplate.html");
    private _dataArtifact: MdpExtension.DataModels.DataArtifact;
    private _factoryId: string;

    constructor(dataArtifact: MdpExtension.DataModels.DataArtifact, factoryId: string, x: number, y: number, queryProperties: DiagramContracts.ITableStatusQueryProperties) {
        super({
            x: x,
            y: y,
            height: Constants.TableGraphNodeHeight,
            width: Constants.TableGraphNodeWidth
        });

        if (!dataArtifact) {
            logger.logError("dataArtifact is null or undefined.");
        }

        let availabilityDeferred = Q.defer<MdpExtension.DataModels.DataArtifactAvailability>();

        let availability = dataArtifact.properties().availability;
        if (!availability && queryProperties) {
            availability = ko.observable(queryProperties.scheduler);
        }

        let frequencyString = ko.observable<string>();

        if (availability) {
            availabilityDeferred.resolve(availability());
            frequencyString(ClientResources.frequencyAndIntervalLineBreakText.format(availability().frequency(), availability().interval()));
        } else {
            availabilityDeferred.reject(null);
        }

        this.extensionTemplate = TableGraphNodeViewModel.template;
        this.extensionViewModel = {
            artifactName: dataArtifact.name(),
            icon: null,
            typeString: null,
            frequencyString: frequencyString,
            selected: this.selected,
            highlighted: this.highlighted,
            graphNodeStatus: <StatusCalendarFlyoutKnockoutBinding.IGraphNodeBindingValueAccessor>{
                id: TableGraphNodeViewModel._tableKey(dataArtifact.name()),
                factoryId: factoryId,
                calendarHeader: dataArtifact.name(),
                type: StatusCalendarFlyoutKnockoutBinding.FlyoutBindingType.Table,
                availabilityPromise: availabilityDeferred.promise,
                table: dataArtifact,
                additionalQueryFilter: queryProperties ? queryProperties.queryFilter : null,
                recentActivityWindows: queryProperties ? queryProperties.recentActivityWindows : null
            }
        };

        this.extensionViewModel.icon = ko.observable();
        if (Util.koPropertyHasValue(dataArtifact.properties) && Util.koPropertyHasValue(dataArtifact.properties().type)) {
            this.extensionViewModel.icon(TableModel.tableTypeToSvgMap[dataArtifact.properties().type()] || IconResources.Icons.tableIcon);
            this.extensionViewModel.typeString = TableModel.tableTypeToResourceMap[dataArtifact.properties().type()] || dataArtifact.properties().type();
        } else {
            this.extensionViewModel.icon(IconResources.Icons.tableIcon);
            this.extensionViewModel.typeString = "";
        }

        this._dataArtifact = dataArtifact;
        this._factoryId = factoryId;
        this.commandGroup(DatasetNodeCommands.DatasetNodeCommandGroup.className);

        this.encodable = new Encodable.TableEncodable(dataArtifact.name());
    }

    public static _tableKey(tableName: string): string {
        return TableModel.getTableKey(tableName);
    }
}

/**
 * A graph node representing a pipeline.
 */
export class BasePipelineGraphNodeViewModel extends HighlightableNode {
    private static template = require("text!./Templates/BasePipelineGraphNodeTemplate.html");

    private _pipeline: MdpExtension.DataModels.BatchPipeline;
    private _factoryId: string;

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, pipeline: MdpExtension.DataModels.BatchPipeline, factoryId: string, initialRect: Graph.IRect) {
        super(initialRect);

        if (!pipeline) {
            logger.logError("pipeline is null or undefined.");
        }

        this.extensionTemplate = BasePipelineGraphNodeViewModel.template;

        this.extensionViewModel = new BasePipelineExtension.BasePipelineExtensionViewModel(lifetimeManager, pipeline);
        (<BasePipelineExtension.BasePipelineExtensionViewModel>this.extensionViewModel).highlighted = this.highlighted;

        this._pipeline = pipeline;
        this._factoryId = factoryId;
        this.commandGroup(PipelineNodeCommands.PipelineNodeCommandGroup.className);

        this.encodable =  new Encodable.PipelineEncodable(pipeline.name());
    }

    public static _pipelineKey(pipelineName: string): string {
        return PipelineModel.getPipelineKey(pipelineName);
    }
}

/**
 * A graph node representing an activity.
 */
export class ActivityGraphNodeViewModel extends HighlightableNode {
    private static template = require("text!./Templates/ActivityGraphNodeTemplate.html");
    private _activity: MdpExtension.DataModels.Activity;
    private _activityType: string;
    private _factoryId: string;

    constructor(activity: MdpExtension.DataModels.Activity, pipeline: MdpExtension.DataModels.BatchPipeline,
                factoryId: string, x: number, y: number, recentActivityWindows: KnockoutObservableArray<ActivityWindowCache.IActivityWindowObservable>) {
        super({
            x: x,
            y: y,
            height: Constants.ActivityGraphNodeHeight,
            width: Constants.ActivityGraphNodeWidth
        });

        if (!activity) {
            logger.logError("activity is null or undefined.");
        }
        this._activityType = activity.type();
        let colNames = ActivityWindowModel.ServiceColumnNames.ExtendedProperties;

        this.extensionTemplate = ActivityGraphNodeViewModel.template;
        this.extensionViewModel = {
            activityName: activity.name(),
            activityType: this._activityType,
            icon: IconResources.Icons.graphActivityIcon,
            activityIconState: ko.pureComputed(() => {
                if (PipelineModel.getPipelineStatus(pipeline.properties().provisioningState(), pipeline.properties().isPaused()) === PipelineModel.PipelineStatusName.active) {
                    return "adf-activityIcon-active";
                } else {
                    return "";
                }
            }),
            highlighted: this.highlighted,
            graphNodeStatus: <StatusCalendarFlyoutKnockoutBinding.IGraphNodeBindingValueAccessor>{
                id: ActivityGraphNodeViewModel._activityKey(activity.name(), BasePipelineGraphNodeViewModel._pipelineKey(pipeline.name())),
                factoryId: factoryId,
                calendarHeader: activity.name(),
                availabilityPromise: Q(activity.scheduler()),
                type: StatusCalendarFlyoutKnockoutBinding.FlyoutBindingType.Activity,
                activity: activity,
                additionalQueryFilter: "{0} eq '{1}' and {2} eq '{3}'".format(colNames.PipelineId, pipeline.properties().id(),
                    colNames.ActivityName, activity.name()),     // TODO paverma Backend is not returning activity id's, started email thread.
                recentActivityWindows: recentActivityWindows
            }
        };
        this._activity = activity;

        this._factoryId = factoryId;

        this.encodable = new Encodable.ActivityEncodable(pipeline.name(), activity.name());
    }

    public static _activityKey(activityName: string, pipelineId: string): string {
        return ActivityModel.getActivityKey(activityName, pipelineId);
    }
}

/**
 * Standard PipelineGraphNodeViewModel with size restrictions of the pipeline node.
 */
export class FixedSizePipelineGraphNodeViewModel extends BasePipelineGraphNodeViewModel {
    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, pipeline: MdpExtension.DataModels.BatchPipeline, factoryId: string, x: number, y: number) {
        let initialRect: Graph.IRect = {
            x: x,
            y: y,
            height: Constants.PipelineGraphNodeHeight,
            width: Constants.PipelineGraphNodeWidth
        };
        super(lifetimeManager, pipeline, factoryId, initialRect);
    }
}
