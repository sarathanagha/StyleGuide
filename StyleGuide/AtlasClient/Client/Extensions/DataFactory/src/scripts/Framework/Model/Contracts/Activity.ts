import BaseEncodable = require("./BaseEncodable");
"use strict";

export class DefaultValues {
    public static retry: number = 3;
    public static concurrency: number = 1;
    public static delay: string = "00:00:00";
    public static timeout: string = "01:00:00";
    public static executionPriorityOrder: string = "NewestFirst";
    public static longRetry: number = 1;
    public static longRetryInterval: string = "Hour";
}

export class ActivityType {
    public static copyActivity = "Copy";
    public static dotNetActivity = "DotNetActivity";
    public static storedProcedureActivity = "SqlServerStoredProcedure";
    public static azureMLBatchScoringActivity = "AzureMLBatchScoring";
    public static hdInsightHiveActivity = "HDInsightHive";
    public static hdInsightPigActivity = "HDInsightPig";
    public static mapReduceActivity = "MapReduceActivity";
}

export const activityTypeToResourceMap: { [s: string]: string } = {};

activityTypeToResourceMap[ActivityType.copyActivity] = ClientResources.copyActivity;
activityTypeToResourceMap[ActivityType.dotNetActivity] = ClientResources.dotNetActivity;
activityTypeToResourceMap[ActivityType.storedProcedureActivity] = ClientResources.storedProcedureActivity;
activityTypeToResourceMap[ActivityType.azureMLBatchScoringActivity] = ClientResources.azureMLActivity;
activityTypeToResourceMap[ActivityType.hdInsightHiveActivity] = ClientResources.hiveActivity;
activityTypeToResourceMap[ActivityType.hdInsightPigActivity] = ClientResources.pigActivity;
activityTypeToResourceMap[ActivityType.mapReduceActivity] = ClientResources.mapReduceActivity;

export const activityTypeToNameInfoResourceMap: { [s: string]: string } = {};

activityTypeToNameInfoResourceMap[ActivityType.copyActivity] = "Name of the copy activity that will copy data from a source data store to a destination data store.";

export function getActivityKey(activityName: string, pipelineId: string): string {
    return new Encodable(pipelineId.substr(1), activityName).getLegacyKey();
}

export class Encodable extends BaseEncodable.BaseEncodable {
    public pipelineName: string;
    public name: string;

    constructor(pipelineName: string, name: string) {
        super(BaseEncodable.EncodableType.ACTIVITY, name.toUpperCase() + " " + pipelineName.toUpperCase());
        // Ideally the toUpperCase here would match CLR's String.ToUpperInvariant()
        // which is in line with string.Equals(other, StringComparison.OrdinalIgnoreCase)
        // used for data factory identifiers. However, it is up to browser implementation,
        // but this is the best we have.
        this.name = name;
        this.pipelineName = pipelineName;
    }

    public getLegacyKey(): string {
        return "A" + this.id;
    }
}
