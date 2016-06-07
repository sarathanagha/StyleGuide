import FormFields = require("../../bootstrapper/FormFields");

export interface IAzureStorageLinkedServiceTypeProperties {
    connectionString: string;
}

export interface IAzureSqlLinkedServiceTypeProperties {
    connectionString: string;
}

export interface IAzureDataLakeLinkedServiceTypeProperties {
    dataLakeStoreUri: string;
}

export interface ISqlServerLinkedServiceTypeProperties {
    connectionString: string;
    username: string;
    gatewayName: string;
}

export interface IOracleLinkedServiceTypeProperties {
    connectionString: string;
    gatewayName: string;
}

export interface IRelationDbLinkedServiceTypeProperties {
    server: string;
    database: string;
    username: string;
    authenticationType: string;
    gatewayName: string;
}

export interface IHdfsLinkedServiceTypeProperties {
    url: string;
    authenticationType: string;
    gatewayName: string;
}

export interface IFileServerLinkedServiceTypeProperties {
    host: string;
    gatewayName: string;
}

export interface IAzureMLLinkedServiceTypeProperties {
    mlEndpoint: string;
    apiKey: string;
}

export let name = "Name";
export let linkedServiceType = "Type";
export let status = "Status";
export let connectionString = "Connection String";
export let dataLakeStoreUri = "DataLakeStore Uri";
export let userName = "User Name";
export let server = "Server";
export let database = "Database";
export let gatewayName = "Gateway Name";
export let authenticationType = "Authentication Type";
export let url = "Url";
export let host = "Host";
export let mlEndpoint = "AzureML Endpoint";
export let apiKey = "API Key";

export function addAzureStorageTypeProperties(propertyBag: FormFields.IOption[], typeProperties: IAzureStorageLinkedServiceTypeProperties) {
    propertyBag.push({ displayText: connectionString, value: typeProperties.connectionString });
}

export function addAzureSqlTypeProperties(propertyBag: FormFields.IOption[], typeProperties: IAzureSqlLinkedServiceTypeProperties) {
    propertyBag.push({ displayText: connectionString, value: typeProperties.connectionString });
}

export function addAzureDataLakeTypeProperties(propertyBag: FormFields.IOption[], typeProperties: IAzureDataLakeLinkedServiceTypeProperties) {
    propertyBag.push({ displayText: dataLakeStoreUri, value: typeProperties.dataLakeStoreUri });
}

export function addSqlServerTypeProperties(propertyBag: FormFields.IOption[], typeProperties: ISqlServerLinkedServiceTypeProperties) {
    propertyBag.push({ displayText: connectionString, value: typeProperties.connectionString });
    propertyBag.push({ displayText: userName, value: typeProperties.username });
    propertyBag.push({ displayText: gatewayName, value: typeProperties.gatewayName });
}

export function addOracleTypeProperties(propertyBag: FormFields.IOption[], typeProperties: IOracleLinkedServiceTypeProperties) {
    propertyBag.push({ displayText: connectionString, value: typeProperties.connectionString });
    propertyBag.push({ displayText: gatewayName, value: typeProperties.gatewayName });
}

export function addRelationalDbTypeProperties(propertyBag: FormFields.IOption[], typeProperties: IRelationDbLinkedServiceTypeProperties) {
    propertyBag.push({ displayText: server, value: typeProperties.server });
    propertyBag.push({ displayText: database, value: typeProperties.database });
    propertyBag.push({ displayText: userName, value: typeProperties.username });
    propertyBag.push({ displayText: authenticationType, value: typeProperties.authenticationType });
    propertyBag.push({ displayText: gatewayName, value: typeProperties.gatewayName });
}

export function addHdfsTypeProperties(propertyBag: FormFields.IOption[], typeProperties: IHdfsLinkedServiceTypeProperties) {
    propertyBag.push({ displayText: url, value: typeProperties.url });
    propertyBag.push({ displayText: authenticationType, value: typeProperties.authenticationType });
    propertyBag.push({ displayText: gatewayName, value: typeProperties.gatewayName });
}

export function addFileTypeProperties(propertyBag: FormFields.IOption[], typeProperties: IFileServerLinkedServiceTypeProperties) {
    propertyBag.push({ displayText: host, value: typeProperties.host });
    propertyBag.push({ displayText: gatewayName, value: typeProperties.gatewayName });
}

export function addAzureMLTypeProperties(propertyBag: FormFields.IOption[], typeProperties: IAzureMLLinkedServiceTypeProperties) {
    propertyBag.push({ displayText: mlEndpoint, value: typeProperties.mlEndpoint });
    propertyBag.push({ displayText: apiKey, value: typeProperties.apiKey });
}
