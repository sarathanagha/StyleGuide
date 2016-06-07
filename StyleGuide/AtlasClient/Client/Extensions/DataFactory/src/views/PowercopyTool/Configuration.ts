import Constants = require("./Constants");
import DataTypeConstants = require("./DataTypeConstants");
import Common = require("./Common");
import FormFields = require("../../bootstrapper/FormFields");

export enum DataSourceType {
    TableList,
    Hierarchical
}

export interface IFormFieldConfig {
    name: string;
    displayText: string;
    type: string;
    options?: FormFields.IOption[];
    infoBalloonText?: string;
    fill?: Object;
    validation?: Object;
    placeholder?: string;
    variant?: boolean;
    condition?: string;
}

export interface IDatasourceReference {
    protocol: string;
    address: Object;
}

export interface IDatasourceCredential {
    UserName?: string;
    Password: string;
    AuthenticationType?: string;
}

export interface IConnectionPayload {
    datasourceReference: string;
    datasourceCredential: string;
    resourceId: string;
    gatewayName: string;
    region: string;
    linkedServiceName: string;
    protocol: string;
}

export interface IUserQuery {
    query: string;
    runtimeVariables: Common.IRuntimeVariables;
    // needed for Azure tables
    tableName?: string;
}

export interface IRequestPayload {
    connectionPayload: IConnectionPayload;
    fileProperties?: Common.IFileFormat;
    userQuery?: IUserQuery;
}

export interface ICredentialEncryptionRequest {
    DataStoreName: string;
    ScopeId: string;
    DataStoreType: string;
    GatewayLocation: string;
    Gateway: string;
//    [additionalProperty: string]: string;
}

export interface IConfigEntry {
    displayText: string;
    newConnectionText: string;
    connectionSummaryTemplate: string;
    locationName: string;
    tableType: string;
    sourceType: string;
    sinkType: string;
    dataSourceType: DataSourceType;
    onPremises: boolean;
    createSupported: boolean;
    storedProcEgress: boolean;
    datasourceReference: IDatasourceReference;
    datasourceCredential: IDatasourceCredential;
    linkedServiceTemplate: Object;
    standardQueryTemplate?: string;
    timedQueryTemplate?: string;
    credentialEncryptionRequest?: ICredentialEncryptionRequest;
    tableColumnNameQuoteCharaters?: string[];
    formFields: IFormFieldConfig[];
}

export let apiVersion = "2015-09-01";

export const copyConfig: { [name: string]: IConfigEntry } = {};
copyConfig[DataTypeConstants.blobStorage] = {
    displayText: "Azure Blob Storage",
    newConnectionText: "Specify the Azure Blob storage account",
    connectionSummaryTemplate: "Account: $$IF({'<selectionmethod>'==='azure'},{<accountdropdown-getLastSegment>},{<accounttextfield>})",
    locationName: "Blob path",
    tableType: "AzureBlob",
    sourceType: "BlobSource",
    sinkType: "BlobSink",
    onPremises: false,
    dataSourceType: DataSourceType.Hierarchical,
    createSupported: false,
    storedProcEgress: false,

    datasourceReference: {
        protocol: "azure-blobs",
        address: {
            "account": "$$IF({'<selectionmethod>'==='azure'},{<accountdropdown-getLastSegment>},{<accounttextfield>})"
        }
    },
    datasourceCredential: {
        Password: "$$IF({'<selectionmethod>'==='azure'},{<fetchedkey>},{<keytextfield>})",
        AuthenticationType: "4"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "AzureStorage",
            "typeProperties": {
                "connectionString": "DefaultEndpointsProtocol=https;AccountName=$$IF({'<selectionmethod>'==='azure'},{<accountdropdown-getLastSegment>},{<accounttextfield>});" +
                "AccountKey=$$IF({'<selectionmethod>'==='azure'},{<fetchedkey>},{<keytextfield>})"
            }
        }
    },
    formFields: [
        {
            name: "selectionmethod",
            type: "dropdown",
            displayText: "Account selection method",
            infoBalloonText:
            "You can select a storage account from the list of available accounts in your Azure "
            +
            "subscriptions, in which case you don’t need to enter account key (or) enter account name and " +
            "account key in free form text fields.",
            options: [
                { value: "azure", displayText: "From Azure subscriptions" },
                { value: "manual", displayText: "Enter manually" }
            ],
            variant: true
        },
        {
            name: "accountdropdown",
            displayText: "Storage account name",
            type: "dropdown",
            fill: {
                "azureResource": ["Microsoft.ClassicStorage/storageAccounts", "Microsoft.Storage/storageAccounts"]
            },
            condition: "'<selectionmethod>'==='azure'"
        },
        {
            name: "fetchedkey",
            displayText: "Storage account key",
            type: "computed",
            condition: "'<selectionmethod>'==='azure'"
        },
        {
            name: "accounttextfield",
            displayText: "Storage account name",
            type: "text",
            condition: "'<selectionmethod>'==='manual'"
        },
        {
            name: "keytextfield",
            displayText: "Storage account key",
            type: "password",
            validation: {
                testConnection: true
            },
            condition: "'<selectionmethod>'==='manual'"
        }
    ]

};

export let azureTables = "azure-tables";
copyConfig[DataTypeConstants.azureTable] = {
    displayText: "Azure table",
    newConnectionText: "Specify new Azure storage connection",
    connectionSummaryTemplate: "Account: $$IF({'<selectionmethod>'==='azure'},{<accountdropdown-getLastSegment>},{<accounttextfield>})",
    locationName: "Table",
    tableType: "AzureTable",
    sourceType: "AzureTableSource",
    sinkType: "AzureTableSink",
    onPremises: false,
    dataSourceType: DataSourceType.TableList,
    createSupported: true,
    storedProcEgress: false,
    standardQueryTemplate: "",
    timedQueryTemplate: "$$Text.Format('<columnName> gt datetime\\'{0:yyyy-MM-ddTHH:mm:ssZ}\\' and <columnName> le datetime\\'{1:yyyy-MM-ddTHH:mm:ssZ}\\'', WindowStart, WindowEnd)",
    datasourceReference: {
        protocol: azureTables,
        address: {
            "account": "$$IF({'<selectionmethod>'==='azure'},{<accountdropdown-getLastSegment>},{<accounttextfield>})"
        }
    },
    datasourceCredential: {
        Password: "$$IF({'<selectionmethod>'==='azure'},{<fetchedkey>},{<keytextfield>})",
        AuthenticationType: "4"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "AzureStorage",
            "typeProperties": {
                "connectionString": "DefaultEndpointsProtocol=https;AccountName=$$IF({'<selectionmethod>'==='azure'},{<accountdropdown-getLastSegment>},{<accounttextfield>});" +
                "AccountKey=$$IF({'<selectionmethod>'==='azure'},{<fetchedkey>},{<keytextfield>})"
            }
        }
    },
    formFields: [
        {
            name: "selectionmethod",
            type: "dropdown",
            displayText: "Account selection method",
            infoBalloonText:
            "You can select a storage account from the list of available accounts in your Azure "
            +
            "subscriptions, in which case you don’t need to enter account key (or) enter account name and " +
            "account key in free form text fields.",
            options: [
                { value: "azure", displayText: "From Azure subscriptions" },
                { value: "manual", displayText: "Enter manually" }
            ],
            variant: true
        },
        {
            name: "accountdropdown",
            displayText: "Storage account name",
            type: "dropdown",
            fill: {
                "azureResource": ["Microsoft.ClassicStorage/storageAccounts", "Microsoft.Storage/storageAccounts"]
            },
            condition: "'<selectionmethod>'==='azure'"
        },
        {
            name: "fetchedkey",
            displayText: "Storage account key",
            type: "computed",
            condition: "'<selectionmethod>'==='azure'"
        },
        {
            name: "accounttextfield",
            displayText: "Storage account name",
            type: "text",
            condition: "'<selectionmethod>'==='manual'"
        },
        {
            name: "keytextfield",
            displayText: "Storage account key",
            type: "password",
            validation: {
                testConnection: true
            },
            condition: "'<selectionmethod>'==='manual'"
        }
    ]
};

let serverSelection = "$$IF({'<selectionmethod>'==='azure'},{<serverdropdown-getLastSegment>.database.windows.net},{<servertextfield>})";
let databaseSelection = "$$IF({'<selectionmethod>'==='azure'},{<databasedropdown>},{<databasetextfield>})";
copyConfig[DataTypeConstants.sqlAzure] = {
    displayText: "Azure SQL Database",
    newConnectionText: "Specify the Azure SQL database",
    connectionSummaryTemplate: `Server: ${serverSelection}, database: ${databaseSelection}`,
    locationName: "Table",
    tableType: "AzureSqlTable",
    sourceType: "SqlSource",
    sinkType: "SqlSink",
    dataSourceType: DataSourceType.TableList,
    onPremises: false,
    createSupported: false,
    storedProcEgress: true,
    tableColumnNameQuoteCharaters: ["[","]"],
    datasourceReference: {
        protocol: "tds",
        address: {
            "server": serverSelection,
            "database": databaseSelection
        }
    },
    datasourceCredential: {
        UserName: "<username>",
        Password: "<password>",
        AuthenticationType: "1"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "AzureSqlDatabase",
            "description": "",
            "typeProperties": {
                "connectionString": `Server=${serverSelection};Database=${databaseSelection};User ID=<username>;` +
                "Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
            }
        }
    },
    formFields:
    [
        {
            name: "selectionmethod",
            displayText: "Server / database selection method",
            type: "dropdown",
            infoBalloonText: "Select from a list of available Azure SQL servers and databases in your Azure subscriptions (or) enter server name and database name manually.",
            options: [
                { value: "azure", displayText: "From Azure subscriptions" },
                { value: "manual", displayText: "Enter manually" }
            ],
            variant: true
        },
        {
            name: "serverdropdown",
            displayText: "Server name",
            type: "dropdown",
            fill: {
                "azureResource": ["Microsoft.Sql/servers"]
            },
            condition: "'<selectionmethod>' === 'azure'"
        },
        {
            name: "databasedropdown",
            displayText: "Database name",
            type: "dropdown",
            condition: "'<selectionmethod>' === 'azure'"
        },
        {
            name: "servertextfield",
            displayText: "Fully qualified domain name",
            type: "text",
            placeholder: "e.g., myserver.windows.net",
            condition: "'<selectionmethod>' === 'manual'"
        },
        {
            name: "databasetextfield",
            displayText: "Database name",
            type: "text",
            condition: "'<selectionmethod>' === 'manual'"
        },
        {
            name: "username",
            displayText: "User name",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        }
    ]
};

copyConfig[DataTypeConstants.sqlDW] = {
    displayText: "Azure SQL Data Warehouse",
    newConnectionText: "Specify the Azure SQL Data Warehouse",
    connectionSummaryTemplate: `Server: ${serverSelection}, datawarehouse: ${databaseSelection}`,
    locationName: "Table",
    tableType: "AzureSqlDWTable",
    sourceType: "SqlDWSource",
    sinkType: "SqlDWSink",
    dataSourceType: DataSourceType.TableList,
    onPremises: false,
    createSupported: false,
    storedProcEgress: false,
    tableColumnNameQuoteCharaters: ["[", "]"],
    datasourceReference: {
        protocol: "tds",
        address: {
            "server": serverSelection,
            "database": databaseSelection
        }
    },
    datasourceCredential: {
        UserName: "<username>",
        Password: "<password>",
        AuthenticationType: "1"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "AzureSqlDW",
            "description": "",
            "typeProperties": {
                "connectionString": `Server=${serverSelection};Database=${databaseSelection};User ID=<username>;` +
                "Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
            }
        }
    },
    formFields:
    [
        {
            name: "selectionmethod",
            displayText: "Server / database selection method",
            type: "dropdown",
            options: [
                { value: "azure", displayText: "From Azure subscriptions" },
                { value: "manual", displayText: "Enter manually" }
            ],
            infoBalloonText: "Select from a list of available Azure SQL servers and databases in your Azure subscriptions (or) enter server name and database name manually.",
            variant: true
        },
        {
            name: "serverdropdown",
            displayText: "Server name",
            type: "dropdown",
            fill: {
                "azureResource": ["Microsoft.Sql/servers"]
            },
            condition: "'<selectionmethod>' === 'azure'"
        },
        {
            name: "databasedropdown",
            displayText: "Database name",
            type: "dropdown",
            condition: "'<selectionmethod>' === 'azure'"
        },
        {
            name: "servertextfield",
            displayText: "Fully qualified domain name",
            type: "text",
            placeholder: "e.g., myserver.windows.net",
            condition: "'<selectionmethod>' === 'manual'"
        },
        {
            name: "databasetextfield",
            displayText: "Database name",
            type: "text",
            condition: "'<selectionmethod>' === 'manual'"
        },
        {
            name: "username",
            displayText: "User name",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        }
    ]
};

copyConfig[DataTypeConstants.sqlOnPrem] = {
    displayText: "SQL Server",
    newConnectionText: "Specify the on-premises SQL Server database",
    connectionSummaryTemplate: "Server: <server>, database: <database>",
    locationName: "Table",
    tableType: "SqlServerTable",
    sourceType: "SqlSource",
    sinkType: "SqlSink",
    dataSourceType: DataSourceType.TableList,
    onPremises: true,
    createSupported: false,
    storedProcEgress: true,
    tableColumnNameQuoteCharaters: ["[", "]"],
    datasourceReference: {
        protocol: "tds",
        address: {
            "server": "<server>",
            "database": "<database>"
        }
    },
    datasourceCredential: {
        UserName: "<username>",
        Password: "<password>",
        AuthenticationType: "$$IF({'<authentication>'==='sql'},{1},{2})"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "OnPremisesSqlServer",
            "typeProperties": {
                "connectionString": "Server=<server>;Database=<database>;$$IF({'<authentication>'==='sql'},{User ID=<username>;Password=<password>;},{})" +
                "Trusted_Connection=False;Encrypt=False;$$IF({'<authentication>'==='windows'},{Integrated security=True;},{})Connection Timeout=30",
                "username": "$$IF({'<authentication>'==='windows'},{<username>},{null})",
                "password": "$$IF({'<authentication>'==='windows'},{<password>},{null})",
                "gatewayName": "<gateway>"
            }
        }
    },
    formFields: [
        {
            name: "server",
            displayText: "Server name",
            type: "text"
        },
        {
            name: "authentication",
            displayText: "Authentication type",
            type: "dropdown",
            options: [
                {
                    value: "sql",
                    displayText: "SQL Authentication"
                },
                {
                    value: "windows",
                    displayText: "Windows Authentication"
                }
            ]
        },
        {
            name: "database",
            displayText: "Database name",
            type: "text"
        },
        {
            name: "username",
            displayText: "User name",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        },
        {
            name: "gateway",
            displayText: "Gateway",
            type: "dropdown"
        }
    ]
};

copyConfig[DataTypeConstants.dataLakeStore] = {
    displayText: "Data Lake Store",
    newConnectionText: "Specify Data Lake Store connection",
    connectionSummaryTemplate: "Account: <account-getLastSegment>",
    locationName: "Folder path",
    tableType: "AzureDataLakeStore",
    sourceType: "AzureDataLakeStoreSource",
    sinkType: "AzureDataLakeStoreSink",
    dataSourceType: DataSourceType.Hierarchical,
    onPremises: false,
    createSupported: false,
    storedProcEgress: false,
    datasourceReference: {
        protocol: "azure-data-lake",
        address: {
            url: "https://<account-getLastSegment>.azuredatalakestore.net/webhdfs/v1/"
        }
    },
    datasourceCredential: {
        Password: Constants.tokenTemplateTag,
        AuthenticationType: "5"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "AzureDataLakeStoreLinkedService",
        "apiVersion": apiVersion,
        "properties": {
            "type": "AzureDataLakeStore",
            "description": "",
            "typeProperties": {
                "authorization": "",
                "dataLakeStoreUri": "https://<account-getLastSegment>.azuredatalakestore.net/webhdfs/v1",
                "subscriptionId": "<account-getSubscription>",
                "resourceGroupName": "<account-getResourceGroup>",
                "sessionId": ""
            }
        }
    },
    formFields: [
        {
            name: "account",
            displayText: "Data Lake store account name",
            type: "dropdown",
            fill: {
                "azureResource": ["Microsoft.DataLakeStore/accounts"]
            },
            validation: {
                testConnection: true
            }
        }
    ]
};

copyConfig[DataTypeConstants.oracle] = {
    displayText: "Oracle",
    newConnectionText: "Specify Oracle Database connection",
    connectionSummaryTemplate: "Server: <server>",
    locationName: "Table",
    tableType: "OracleTable",
    sourceType: "OracleSource",
    sinkType: undefined,
    dataSourceType: DataSourceType.TableList,
    onPremises: true,
    createSupported: false,
    storedProcEgress: false,

    datasourceReference: {
        protocol: "oracle",
        address: {
            "server": "<server>"
        }
    },
    datasourceCredential: {
        UserName: "<userId>",
        Password: "<password>",
        AuthenticationType: "1"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "OnPremisesOracle",
            "typeProperties": {
                "connectionString": "data source=<server>;user id=<userId>;password=<password>",
                "gatewayName": "<gateway>"
            }
        }
    },
    formFields: [
        {
            name: "server",
            displayText: "Server name",
            type: "text"
        },
        {
            name: "userId",
            displayText: "User ID",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        },
        {
            name: "gateway",
            displayText: "Gateway",
            type: "dropdown"
        }
    ]
};

copyConfig[DataTypeConstants.mySql] = {
    displayText: "MySQL",
    newConnectionText: "Specify MySQL Database connection",
    connectionSummaryTemplate: "Server: <server>, database: <database>",
    locationName: "Table",
    tableType: "RelationalTable",
    sourceType: "RelationalSource",
    sinkType: undefined,
    dataSourceType: DataSourceType.TableList,
    onPremises: true,
    createSupported: false,
    storedProcEgress: false,
    datasourceReference: {
        protocol: "mysql",
        address: {
            "server": "<server>",
            "database": "<database>"
        }
    },
    datasourceCredential: {
        UserName: "<username>",
        Password: "<password>",
        AuthenticationType: "1"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "OnPremisesMySql",
            "typeProperties": {
                "server": "<server>",
                "database": "<database>",
                "authenticationType": "Basic",
                "username": "<username>",
                "password": "<password>",
                "gatewayName": "<gateway>"
            }
        }
    },
    formFields: [
        {
            name: "server",
            displayText: "Server name",
            type: "text"
        },
        {
            name: "database",
            displayText: "Database",
            type: "text"
        },
        {
            name: "username",
            displayText: "User Name",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        },
        {
            name: "gateway",
            displayText: "Gateway",
            type: "dropdown"
        }
    ]
};

copyConfig[DataTypeConstants.db2] = {
    displayText: "DB2",
    newConnectionText: "Specify DB2 Database connection",
    connectionSummaryTemplate: "Server: <server>, database: <database>",
    locationName: "Table",
    tableType: "RelationalTable",
    sourceType: "RelationalSource",
    sinkType: undefined,
    dataSourceType: DataSourceType.TableList,
    onPremises: true,
    createSupported: false,
    storedProcEgress: false,
    tableColumnNameQuoteCharaters: ["\"", "\""],
    datasourceReference: {
        protocol: "db2",
        address: {
            "server": "<server>",
            "database": "<database>"
        }
    },
    datasourceCredential: {
        UserName: "<username>",
        Password: "<password>",
        AuthenticationType: "1"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "OnPremisesDb2",
            "typeProperties": {
                "server": "<server>",
                "database": "<database>",
                "authenticationType": "Basic",
                "username": "<username>",
                "password": "<password>",
                "gatewayName": "<gateway>"
            }
        }
    },
    formFields: [
        {
            name: "server",
            displayText: "Server name",
            type: "text"
        },
        {
            name: "database",
            displayText: "Database",
            type: "text"
        },
        {
            name: "username",
            displayText: "User Name",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        },
        {
            name: "gateway",
            displayText: "Gateway",
            type: "dropdown"
        }
    ]
};

copyConfig[DataTypeConstants.sybase] = {
    displayText: "Sybase",
    newConnectionText: "Specify Sybase Database connection",
    connectionSummaryTemplate: "Server: <server>, database: <database>",
    locationName: "Table",
    tableType: "RelationalTable",
    sourceType: "RelationalSource",
    sinkType: undefined,
    dataSourceType: DataSourceType.TableList,
    onPremises: true,
    createSupported: false,
    storedProcEgress: false,
    datasourceReference: {
        protocol: "sybase",
        address: {
            "server": "<server>",
            "database": "<database>"
        }
    },
    datasourceCredential: {
        UserName: "<username>",
        Password: "<password>",
        AuthenticationType: "1"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "OnPremisesSybase",
            "typeProperties": {
                "server": "<server>",
                "database": "<database>",
                "authenticationType": "Basic",
                "username": "<username>",
                "password": "<password>",
                "gatewayName": "<gateway>"
            }
        }
    },
    formFields: [
        {
            name: "server",
            displayText: "Server name",
            type: "text"
        },
        {
            name: "database",
            displayText: "Database",
            type: "text"
        },
        {
            name: "username",
            displayText: "User Name",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        },
        {
            name: "gateway",
            displayText: "Gateway",
            type: "dropdown"
        }
    ]
};

copyConfig[DataTypeConstants.postgresql] = {
    displayText: "PostgreSQL",
    newConnectionText: "Specify PostgreSQL Database connection",
    connectionSummaryTemplate: "Server: <server>, database: <database>",
    locationName: "Table",
    tableType: "RelationalTable",
    sourceType: "RelationalSource",
    sinkType: undefined,
    dataSourceType: DataSourceType.TableList,
    onPremises: true,
    createSupported: false,
    storedProcEgress: false,
    tableColumnNameQuoteCharaters: ["\"", "\""],

    datasourceReference: {
        protocol: "postgresql",
        address: {
            "server": "<server>",
            "database": "<database>"
        }
    },
    datasourceCredential: {
        UserName: "<username>",
        Password: "<password>",
        AuthenticationType: "1"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "OnPremisesPostgreSql",
            "typeProperties": {
                "server": "<server>",
                "database": "<database>",
                "authenticationType": "Basic",
                "username": "<username>",
                "password": "<password>",
                "gatewayName": "<gateway>"
            }
        }
    },
    formFields: [
        {
            name: "server",
            displayText: "Server name",
            type: "text"
        },
        {
            name: "database",
            displayText: "Database",
            type: "text"
        },
        {
            name: "username",
            displayText: "User Name",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        },
        {
            name: "gateway",
            displayText: "Gateway",
            type: "dropdown"
        }
    ]
};

copyConfig[DataTypeConstants.teradata] = {
    displayText: "Teradata",
    newConnectionText: "Specify Teradata Database connection",
    connectionSummaryTemplate: "Server: <server>",
    locationName: "Table",
    tableType: "RelationalTable",
    sourceType: "RelationalSource",
    sinkType: undefined,
    dataSourceType: DataSourceType.TableList,
    onPremises: true,
    createSupported: false,
    storedProcEgress: false,
    datasourceReference: {
        protocol: "teradata",
        address: {
            "server": "<server>"
        }
    },
    datasourceCredential: {
        UserName: "<username>",
        Password: "<password>",
        AuthenticationType: "1"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "OnPremisesTeradata",
            "typeProperties": {
                "server": "<server>",
                "authenticationType": "Basic",
                "username": "<username>",
                "password": "<password>",
                "gatewayName": "<gateway>"
            }
        }
    },
    formFields: [
        {
            name: "server",
            displayText: "Server name",
            type: "text"
        },
        {
            name: "username",
            displayText: "User Name",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        },
        {
            name: "gateway",
            displayText: "Gateway",
            type: "dropdown"
        }
    ]
};

copyConfig[DataTypeConstants.fileShare] = {
    displayText: "File server share",
    newConnectionText: "Specify File server share connection",
    connectionSummaryTemplate: "File share",
    locationName: "File path",
    tableType: "FileShare",
    sourceType: "FileSystemSource",
    sinkType: "FileSystemSink",
    onPremises: true,
    dataSourceType: DataSourceType.Hierarchical,
    createSupported: false,
    storedProcEgress: false,
    datasourceReference: {
        protocol: "folder",
        address: {
            path: "<path>"
        }
    },
    datasourceCredential: {
        AuthenticationType: "2",
        UserName: "<username>",
        Password: "<password>"
    },
    linkedServiceTemplate:
    {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "OnPremisesFileServer",
            "typeProperties": {
                "host": "<path>",
                "gatewayName": "<gateway>",
                "userId": "<username>",
                "password": "<password>"
            }
        }
    }
    ,
    formFields: [
        {
            name: "path",
            displayText: "Host",
            type: "text",
            placeholder: "e.g., \\\\fileshare"
        },
        {
            name: "username",
            displayText: "User name",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        },
        {
            name: "gateway",
            displayText: "Gateway",
            type: "dropdown"
        }

    ]
};

copyConfig[DataTypeConstants.hdfs] = {
    displayText: "HDFS",
    newConnectionText: "Specify HDFS connection",
    connectionSummaryTemplate: "url: <url>",
    locationName: "HDFS",
    tableType: "FileShare",
    sourceType: "FileSystemSource",
    sinkType: undefined,
    dataSourceType: DataSourceType.Hierarchical,
    onPremises: true,
    createSupported: false,
    storedProcEgress: false,
    datasourceReference: {
        protocol: "webhdfs",
        address: {
            "url": "<url>"
        }
    },
    datasourceCredential: {
        UserName: "<username>",
        Password: "<password>",
        AuthenticationType: "$$IF({'<authentication>'==='windows'},{2},{3})"
    },
    linkedServiceTemplate: {
        "type": "Microsoft.DataFactory/datafactories/linkedservices",
        "name": "",
        "apiVersion": apiVersion,
        "properties": {
            "type": "Hdfs",
            "typeProperties": {
                "url": "<url>",
                "authenticationType": "<authentication>",
                "username": "<username>",
                "password": "<password>",
                "gatewayName": "<gateway>"
            }
        }
    },
    formFields: [
        {
            name: "url",
            displayText: "Service URL",
            type: "text"
        },
        {
            name: "authentication",
            displayText: "Authentication type",
            type: "dropdown",
            options: [
                {
                    value: "windows",
                    displayText: "Windows Authentication"
                },
                {
                    value: "Anonymous",
                    displayText: "Anonymous Authentication"
                }
            ]
        },
        {
            name: "username",
            displayText: "User name",
            type: "text"
        },
        {
            name: "password",
            displayText: "Password",
            type: "password",
            validation: {
                testConnection: true
            }
        },
        {
            name: "gateway",
            displayText: "Gateway",
            type: "dropdown"
        }
    ]
};
