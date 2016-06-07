import TypeDeclarations = require("../../Shared/TypeDeclarations");
import Common = require("./Common");
import IconResources = require("../../Shared/IconResources");
import BaseEncodable = require("./BaseEncodable");

"use strict";

export interface ISchedule {
    scheduleType: number;
    scheduleTrigger: number;
    identifier: Common.IIdentifier;
}

export interface IAvailabilityPolicy {
    timeToWarn: string;
}

export interface IDataArtifact {
    Id: string;
    Availability: Object;
    Name: string;
    Location: Object;
}

/* tslint:disable:no-internal-module */
export module TableType {
    /* tslint:enable:no-internal-module */
    /* tslint:disable:variable-name */
    export const AzureBlobLocation = "AzureBlob";
    export const AzureSqlDwTableLocation = "AzureSqlDWTable";
    export const AzureSqlTableLocation = "AzureSqlTable";
    export const AzureTableLocation = "AzureTable";
    export const CustomLocation = "CustomDataset";
    export const OnPremisesSqlServerTableLocation = "SqlServerTable";
    export const AzureDataLakeStore = "AzureDataLakeStore";
    export const OracleTable = "OracleTable";
    export const RelationalTable = "RelationalTable";
    /* tslint:enable:variable-name */
}

// TODO [4339629]: Remove when extensibilty supports registration of custom types
export module CustomTableType {
    export const OnPremHDFS = "OnpremisesHDFS";
}

export const tableTypeToResourceMap: { [s: string]: string } = {};

tableTypeToResourceMap[TableType.AzureBlobLocation] = ClientResources.linkedServiceAzureBlobLocation;
tableTypeToResourceMap[TableType.AzureSqlDwTableLocation] = ClientResources.linkedServiceAzureSqlDwTableLocation;
tableTypeToResourceMap[TableType.AzureSqlTableLocation] = ClientResources.linkedServiceAzureSqlTableLocation;
tableTypeToResourceMap[TableType.AzureTableLocation] = ClientResources.linkedServiceAzureTableLocation;
tableTypeToResourceMap[TableType.CustomLocation] = ClientResources.linkedServiceCustomLocation;
tableTypeToResourceMap[TableType.OnPremisesSqlServerTableLocation] = ClientResources.linkedServiceOnPremisesSqlServerTableLocation;
tableTypeToResourceMap[TableType.AzureDataLakeStore] = ClientResources.linkedServiceAzureDataLakeStore;

export const tableTypeToSvgMap: { [s: string]: TypeDeclarations.Image } = {};

tableTypeToSvgMap[TableType.AzureBlobLocation] = IconResources.Icons.blobTable;
tableTypeToSvgMap[TableType.AzureSqlDwTableLocation] = IconResources.Icons.sqlDwTable;
tableTypeToSvgMap[TableType.AzureSqlTableLocation] = IconResources.Icons.sqlTable;
tableTypeToSvgMap[TableType.AzureTableLocation] = IconResources.Icons.azureDbTable;
tableTypeToSvgMap[TableType.CustomLocation] = IconResources.Icons.tableIcon;
tableTypeToSvgMap[TableType.OnPremisesSqlServerTableLocation] = IconResources.Icons.sqlTable;
tableTypeToSvgMap[TableType.AzureDataLakeStore] = IconResources.Icons.adlStore;

export function getTableKey(tableName: string): string {
    // Ideally the toUpperCase here would match CLR's String.ToUpperInvariant()
    // which is in line with string.Equals(other, StringComparison.OrdinalIgnoreCase)
    // used for data factory identifiers. However, it is up to browser implementation,
    // but this is the best we have.
    return "T" + tableName.toUpperCase();
}

export class Encodable extends BaseEncodable.BaseEncodable {
    public name: string;

    constructor(name: string) {
        super(BaseEncodable.EncodableType.TABLE, name.toUpperCase());
        this.name = name;
    }

    public getLegacyKey(): string {
        return getTableKey(this.name);
    }
}

/* tslint:disable:no-internal-module */
export module Availability {
    /* tslint:enable:no-internal-module */
    /* tslint:disable:variable-name */
    export const Frequency = {
    /* tslint:enable:variable-name */
        Minute: "Minute",
        Hour: "Hour",
        Day: "Day",
        Week: "Week",
        Month: "Month",
        Year: "Year"
    };
}

/* tslint:disable:variable-name */
export const Default = {
    /* tslint:enable:variable-name */
    properties: {
        type: TableType.AzureBlobLocation
    }
};
