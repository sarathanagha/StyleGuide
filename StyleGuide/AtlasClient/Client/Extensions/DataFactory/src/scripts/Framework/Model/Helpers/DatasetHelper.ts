
import DatasetModel = require("../Contracts/DataArtifact");
import Svg = require("../../../../_generated/Svg");

export function getDatasetIcon(datasetType: string): string {
    let tableTypes = DatasetModel.TableType;
    switch (datasetType) {
        case tableTypes.AzureBlobLocation:
            return Svg.azureBlob;
        case tableTypes.AzureDataLakeStore:
            return Svg.azureDataLake;
        case tableTypes.AzureSqlDwTableLocation:
            return Svg.azureSqlDW;
        case tableTypes.AzureSqlTableLocation:
            return Svg.azureSql;
        case tableTypes.OnPremisesSqlServerTableLocation:
            return Svg.sqlOnPrem;
        case tableTypes.RelationalTable:
        case tableTypes.OracleTable:
            return Svg.database;
        default:
            return null;
    }
}
