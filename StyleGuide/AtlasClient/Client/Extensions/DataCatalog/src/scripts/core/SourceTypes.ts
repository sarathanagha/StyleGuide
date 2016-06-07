module Microsoft.DataStudio.DataCatalog.Core {
    var logger = Microsoft.DataStudio.DataCatalog.LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC SourceTypes" });
    
    export class SourceTypes {

        // Fields.
        static serverField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.server", label: Resx.objecttype_server, placeHolder: "", validatePattern: /.+/ } };
        static databaseField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.database", label: Resx.database, placeHolder: "", validatePattern: /.+/ } };
        static schemaField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.schema", label: Resx.schemaName, placeHolder: "", validatePattern: /.+/ } };
        static objectField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.object", label: Resx.objecttype_object, placeHolder: "", validatePattern: /.+/ } };
        static objectTypeField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.objectType", label: Resx.objectType, placeHolder: "", validatePattern: /.+/ } };
        static modelField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.model", label: Resx.model, placeHolder: "", validatePattern: /.+/ } };
        static pathField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.path", label: Resx.path, placeHolder: "", validatePattern: /.+/ } };
        static versionField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.version", label: Resx.version, placeHolder: "", validatePattern: /.+/ } };
        static domainField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.domain", label: Resx.domain, placeHolder: "", validatePattern: /.+/ } };
        static accountField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.account", label: Resx.account, placeHolder: "", validatePattern: /.+/ } };
        static containerField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.container", label: Resx.container, placeHolder: "", validatePattern: /.+/ } };
        static nameField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.name", label: Resx.name, placeHolder: "", validatePattern: /.+/ } };
        static urlField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.url", label: Resx.url, placeHolder: "", validatePattern: /.+/ } };
        static portField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.port", label: Resx.port, placeHolder: "", validatePattern: /.+/ } };
        static viewField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.view", label: Resx.view, placeHolder: "", validatePattern: /.+/ } };
        static resourceField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.resource", label: Resx.resource, placeHolder: "", validatePattern: /.+/ } };
        static loginServerField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.loginServer", label: Resx.loginServer, placeHolder: "", validatePattern: /.+/ } };
        static classField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.class", label: Resx.class_label, placeHolder: "", validatePattern: /.+/ } };
        static itemNameField: Interfaces.IFieldType = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.itemName", label: Resx.itemName, placeHolder: "", validatePatter: /.+/ } };

        // Source types.
        private static sources: { [key: string]: Interfaces.ISourceType; } = {
            "sql server": {
                sourceType: "SQL Server",
                label: Resx.sourcetype_sqlserver,
                editLabel: Resx.sourcetype_sqlserver,
                protocol: "tds",
                formatType: "structured",
                authentication: [{ name: "sql", label: Resx.authentication_sql }, { name: "windows", label: Resx.authentication_windows }],
                connectionStrings: [
                    {
                        driver: "ADO.NET",
                        label: Resx.connectionString_ado_net,
                        baseString: "Server={dsl.address.server};Database={dsl.address.database};User Id={userName};Password={passwordHintText};"
                    },
                    {
                        driver: "ODBC",
                        label: Resx.connectionString_odbc,
                        baseString: "Driver={{SQL Server}};Server={dsl.address.server};Database={dsl.address.database};Uid={userName};Pwd={passwordHintText};Trusted_Connection=no;"
                    },
                    {
                        driver: "OLEDB",
                        label: Resx.connectionString_oledb,
                        baseString: "Provider=SQLOLEDB;Data Source={dsl.address.server};Initial Catalog={dsl.address.database};UserId={userName};Password={passwordHintText};"
                    },
                    {
                        driver: "JDBC",
                        label: Resx.connectionString_jdbc,
                        baseString: "jdbc:sqlserver:{dsl.address.server};database={dsl.address.database};user={userName};password={passwordHintText};"
                    }
                ],
                objectTypes: {
                    "table": {
                        objectType: "Table",
                        label: Resx.sqlserver_table,
                        rootType: "tables",
                        editLabel: Resx.objecttype_table,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "view": {
                        objectType: "View",
                        label: Resx.sqlserver_view,
                        rootType: "tables",
                        editLabel: Resx.objecttype_view,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "database": {
                        objectType: "Database",
                        label: Resx.database,
                        rootType: "containers",
                        editLabel: Resx.database,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                    }
                }
            },

            "sql data warehouse": {
                sourceType: "SQL Data Warehouse",
                label: Resx.sourcetype_verbose_sqldatawarehouse,
                editLabel: Resx.sourcetype_verbose_sqldatawarehouse,
                protocol: "tds",
                formatType: "structured",
                authentication: [{ name: "sql", label: Resx.authentication_sql }],
                objectTypes: {
                    "table": {
                        objectType: "Table",
                        label: Resx.sqldatawarehouse_table,
                        rootType: "tables",
                        editLabel: Resx.sqldatawarehouse_table,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "view": {
                        objectType: "View",
                        label: Resx.sqldatawarehouse_view,
                        rootType: "tables",
                        editLabel: Resx.sqldatawarehouse_view,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "database": {
                        objectType: "Database",
                        label: Resx.sqldatawarehouse_database,
                        rootType: "containers",
                        editLabel: Resx.sqldatawarehouse_database,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                    }
                }
            },

            "oracle database": {
                sourceType: "Oracle Database",
                label: Resx.sourcetype_oracledatabase,
                editLabel: Resx.sourcetype_oracledatabase,
                protocol: "oracle",
                formatType: "structured",
                authentication: [{ name: "protocol", label: Resx.authentication_protocol }, { name: "windows", label: Resx.authentication_windows }],
                connectionStrings: [
                    {
                        driver: "ODBC",
                        label: Resx.connectionString_odbc,
                        baseString: "Driver={{Microsoft ODBC for Oracle}};Server={dsl.address.server};Uid={userName};Pwd={passwordHintText};"
                    },
                    {
                        driver: "OLEDB",
                        label: Resx.connectionString_oledb,
                        baseString: "Provider=MSDAORA;Data Source={dsl.address.database};User Id={userName};Password={passwordHintText};"
                    }
                ],
                objectTypes: {
                    "table": {
                        objectType: "Table",
                        label: Resx.oracledatabase_table,
                        rootType: "tables",
                        editLabel: Resx.objecttype_table,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "view": {
                        objectType: "View",
                        label: Resx.oracledatabase_view,
                        rootType: "tables",
                        editLabel: Resx.objecttype_view,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "database": {
                        objectType: "Database",
                        label: Resx.sourcetype_oracledatabase,
                        rootType: "containers",
                        editLabel: Resx.database,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                    }
                }
            },

            "mysql": {
                sourceType: "MySQL",
                label: Resx.sourcetype_mysql,
                editLabel: Resx.sourcetype_mysql,
                protocol: "mysql",
                formatType: "structured",
                authentication: [{ name: "basic", label: Resx.authentication_basic }],
                objectTypes: {
                    "table": {
                        objectType: "Table",
                        label: Resx.mysql_table,
                        rootType: "tables",
                        editLabel: Resx.objecttype_table,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "view": {
                        objectType: "View",
                        label: Resx.mysql_view,
                        rootType: "tables",
                        editLabel: Resx.objecttype_view,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "database": {
                        objectType: "Database",
                        label: Resx.mysql_database,
                        rootType: "containers",
                        editLabel: Resx.database,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                    }
                }
            },

            "sql server analysis services tabular": {
                sourceType: "SQL Server Analysis Services Tabular",
                label: Resx.sourcetype_sqlserveranalysisservices_editlabel,
                editLabel: Resx.sourcetype_sqlserveranalysisservices_editlabel,
                protocol: "analysis-services",
                formatType: "structured",
                authentication: [{ name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "table": {
                        objectType: "Table",
                        label: Resx.sqlserveranalysisservices_table,
                        rootType: "tables",
                        editLabel: Resx.objecttype_table,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField, SourceTypes.objectField, SourceTypes.objectTypeField]
                    },
                    "model": {
                        objectType: "Model",
                        label: Resx.model,
                        rootType: "containers",
                        editLabel: Resx.model,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField]
                    }
                }
            },

            "sql server analysis services multidimensional": {
                sourceType: "SQL Server Analysis Services Multidimensional",
                label: Resx.sourcetype_sqlserveranalysisservicesmultidimensional_editlabel,
                editLabel: Resx.sourcetype_sqlserveranalysisservicesmultidimensional_editlabel,
                protocol: "analysis-services",
                formatType: "structured",
                authentication: [{ name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "dimension": {
                        objectType: "Dimension",
                        label: Resx.sqlserveranalysisservices_dimension,
                        rootType: "tables",
                        editLabel: Resx.objecttype_dimension,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField, SourceTypes.objectField, SourceTypes.objectTypeField]
                    },
                    "measure": {
                        objectType: "Measure",
                        label: Resx.sqlserveranalysisservicesmultidimensional_measure,
                        rootType: "measures",
                        editLabel: Resx.objecttype_measure,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField, SourceTypes.objectField, SourceTypes.objectTypeField]
                    },
                    "kpi": {
                        objectType: "KPI",
                        label: Resx.sqlserveranalysisservicesmultidimensional_kpi,
                        rootType: "kpis",
                        editLabel: Resx.objecttype_kpi,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField, SourceTypes.objectField, SourceTypes.objectTypeField]
                    },
                    "model": {
                        objectType: "Model",
                        label: Resx.model,
                        rootType: "containers",
                        editLabel: Resx.model,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField]
                    }
                }
            },

            "sql server reporting services": {
                sourceType: "SQL Server Reporting Services",
                label: Resx.sourcetype_sqlserverreportingservices,
                editLabel: Resx.sourcetype_sqlserverreportingservices,
                protocol: "reporting-services",
                formatType: "structured",
                authentication: [{ name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "report": {
                        objectType: "Report",
                        label: Resx.sqlserverreportingservices_report,
                        rootType: "reports",
                        editLabel: Resx.objecttype_report,
                        editFields: [SourceTypes.serverField, SourceTypes.pathField, SourceTypes.versionField]
                    },
                    "server": {
                        objectType: "Server",
                        label: Resx.objecttype_server,
                        rootType: "containers",
                        editLabel: Resx.objecttype_server,
                        editFields: [SourceTypes.serverField, SourceTypes.versionField]
                    }
                }
            },

            "azure storage": {
                sourceType: "Azure Storage",
                label: Resx.sourcetype_azurestorage,
                editLabel: Resx.sourcetype_azurestorage,
                protocol: "azure-blobs",
                formatType: "unstructured",
                authentication: [{ name: "Azure-Access-Key", label: Resx.authentication_azure }],
                objectTypes: {
                    "blob": {
                        objectType: "Blob",
                        label: Resx.azurestorage_blob,
                        rootType: "tables",
                        editLabel: Resx.azurestorage_blob,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.domainField, SourceTypes.accountField, SourceTypes.containerField, SourceTypes.nameField]
                    },
                    "directory": {
                        objectType: "Directory",
                        label: Resx.azurestorage_directory,
                        rootType: "tables",
                        editLabel: Resx.azurestorage_directory,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.domainField, SourceTypes.accountField, SourceTypes.containerField, SourceTypes.nameField]
                    },
                    "container": {
                        objectType: "Container",
                        label: Resx.container,
                        rootType: "containers",
                        editLabel: Resx.container,
                        editFields: [SourceTypes.domainField, SourceTypes.accountField, SourceTypes.containerField]
                    },
                    "azure storage": {
                        objectType: "Azure Storage",
                        label: Resx.azurestorage_azurestorage,
                        rootType: "containers",
                        editLabel: Resx.azurestorage_azurestorage,
                        protocol: "azure-tables",
                        editFields: [SourceTypes.domainField, SourceTypes.accountField]
                    },
                    "table": {
                        objectType: "Table",
                        label: Resx.azurestorage_table,
                        rootType: "tables",
                        editLabel: Resx.azurestorage_table,
                        protocol: "azure-tables",
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.domainField, SourceTypes.accountField, SourceTypes.nameField]
                    }
                }
            },

            "hadoop distributed file system": {
                sourceType: "Hadoop Distributed File System",
                label: Resx.sourcetype_hadoopdistributedfilesystem,
                editLabel: Resx.sourcetype_hadoopdistributedfilesystem,
                protocol: "webhdfs",
                formatType: "unstructured",
                authentication: [{ name: "basic", label: Resx.authentication_basic }, { name: "oauth", label: Resx.authentication_oauth }],
                objectTypes: {
                    "file": {
                        objectType: "File",
                        label: Resx.hadoopdistributedfilesystem_file,
                        rootType: "tables",
                        editLabel: Resx.hadoopdistributedfilesystem_file,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.urlField]
                    },
                    "directory": {
                        objectType: "Directory",
                        label: Resx.hadoopdistributedfilesystem_directory,
                        rootType: "tables",
                        editLabel: Resx.hadoopdistributedfilesystem_directory,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.urlField]
                    },
                    "cluster": {
                        objectType: "Cluster",
                        label: Resx.cluster,
                        rootType: "containers",
                        editLabel: Resx.cluster,
                        editFields: [SourceTypes.urlField]
                    }
                }
            },

            "azure data lake store": {
                sourceType: "Azure Data Lake Store",
                label: Resx.sourcetype_azuredatalakestore,
                editLabel: Resx.sourcetype_azuredatalakestore,
                protocol: "webhdfs",
                formatType: "unstructured",
                authentication: [{ name: "basic", label: Resx.authentication_basic }, { name: "oauth", label: Resx.authentication_oauth }],
                objectTypes: {
                    "file": {
                        objectType: "File",
                        label: Resx.azuredatalakestore_file,
                        rootType: "tables",
                        editLabel: Resx.azuredatalakestore_file,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.urlField]
                    },
                    "directory": {
                        objectType: "Directory",
                        label: Resx.azuredatalakestore_directory,
                        rootType: "tables",
                        editLabel: Resx.azuredatalakestore_directory,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.urlField]
                    },
                    "data lake": {
                        objectType: "Data Lake",
                        label: Resx.cluster,
                        rootType: "containers",
                        editLabel: Resx.cluster,
                        editFields: [SourceTypes.urlField]
                    }
                }
            },

            "teradata": {
                sourceType: "Teradata",
                label: Resx.sourcetype_teradata,
                editLabel: Resx.sourcetype_teradata,
                protocol: "teradata",
                formatType: "structured",
                authentication: [{ name: "protocol", label: Resx.authentication_protocol }, { name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "view": {
                        objectType: "View",
                        label: Resx.teradata_view,
                        rootType: "tables",
                        editLabel: Resx.objecttype_view,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.objectField]
                    },
                    "table": {
                        objectType: "Table",
                        label: Resx.teradata_table,
                        rootType: "tables",
                        editLabel: Resx.objecttype_table,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.objectField]
                    },
                    "database": {
                        objectType: "Database",
                        label: Resx.teradata_database,
                        rootType: "containers",
                        editLabel: Resx.database,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                    }
                }
            },

            "hive": {
                sourceType: "Hive",
                label: Resx.sourcetype_hive,
                editLabel: Resx.sourcetype_hive,
                protocol: "hive",
                formatType: "structured",
                authentication: [{ name: "hdinsight", label: Resx.authentication_hdinsight }, { name: "basic", label: Resx.authentication_basic }, { name: "username", label: Resx.authentication_username }, { name: "none", label: Resx.authentication_none }],
                objectTypes: {
                    "view": {
                        objectType: "View",
                        label: Resx.hive_view,
                        rootType: "tables",
                        editLabel: Resx.objecttype_view,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.portField, SourceTypes.databaseField, SourceTypes.objectField]
                    },
                    "table": {
                        objectType: "Table",
                        label: Resx.hive_table,
                        rootType: "tables",
                        editLabel: Resx.objecttype_table,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.portField, SourceTypes.databaseField, SourceTypes.objectField]
                    },
                    "database": {
                        objectType: "Database",
                        label: Resx.database,
                        rootType: "containers",
                        editLabel: Resx.database,
                        editFields: [SourceTypes.serverField, SourceTypes.portField, SourceTypes.databaseField]
                    }
                }
            },

            "sap hana": {
                sourceType: "SAP Hana",
                label: Resx.sourcetype_saphana,
                editLabel: Resx.sourcetype_saphana,
                protocol: "sap-hana-sql",
                formatType: "structured",
                authentication: [{ name: "protocol", label: Resx.authentication_protocol }, { name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "view": {
                        objectType: "View",
                        label: Resx.saphana_view,
                        rootType: "tables",
                        editLabel: Resx.objecttype_view,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "server": {
                        objectType: "Server",
                        label: Resx.saphana_server,
                        rootType: "containers",
                        editLabel: Resx.objecttype_server,
                        editFields: [SourceTypes.serverField]
                    }
                }
            },

            "odata": {
                sourceType: "Odata",
                label: Resx.sourcetype_odata,
                editLabel: Resx.sourcetype_odata,
                protocol: "odata",
                formatType: "structured",
                authentication: [{ name: "none", label: Resx.authentication_none }, { name: "basic", label: Resx.authentication_basic }, { name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "function": {
                        objectType: "Function",
                        label: Resx.odata_function,
                        rootType: "tables",
                        editLabel: Resx.objecttype_function,
                        editFields: [SourceTypes.urlField, SourceTypes.resourceField]
                    },
                    "entity set": {
                        objectType: "Entity Set",
                        label: Resx.odata_entityset,
                        rootType: "tables",
                        editLabel: Resx.objecttype_entityset,
                        editFields: [SourceTypes.urlField, SourceTypes.resourceField]
                    },
                    "entity container": {
                        objectType: "Entity Container",
                        label: Resx.odata_entitycontainer,
                        rootType: "containers",
                        editLabel: Resx.objecttype_entitycontainer,
                        editFields: [SourceTypes.urlField, SourceTypes.resourceField]
                    }
                }
            },

            "http": {
                sourceType: "Http",
                label: Resx.sourcetype_http,
                editLabel: Resx.sourcetype_http,
                protocol: "http",
                formatType: "unstructured",
                authentication: [{ name: "none", label: Resx.authentication_none }, { name: "basic", label: Resx.authentication_basic }, { name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "file": {
                        objectType: "File",
                        label: Resx.objecttype_file,
                        rootType: "tables",
                        editLabel: Resx.http_file, 
                        editFields: [SourceTypes.urlField]
                    },
                    "end point": {
                        objectType: "End Point",
                        label: Resx.objecttype_endpoint,
                        rootType: "tables",
                        editLabel: Resx.http_endpoint,
                        editFields: [SourceTypes.urlField]
                    },
                    "report": {
                        objectType: "Report",
                        label: Resx.objecttype_report,
                        rootType: "reports",
                        editLabel: Resx.http_report,
                        editFields: [SourceTypes.urlField]
                    },
                    "site": {
                        objectType: "Site",
                        label: Resx.objecttype_site,
                        rootType: "containers",
                        editLabel: Resx.http_site,
                        editFields: [SourceTypes.urlField]
                    }
                }
            },

            "file system": {
                sourceType: "File System",
                label: Resx.sourcetype_filesystem,
                editLabel: Resx.sourcetype_filesystem,
                protocol: "file",
                formatType: "unstructure",
                authentication: [{ name: "none", label: Resx.authentication_none }, { name: "basic", label: Resx.authentication_basic }, { name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "file": {
                        objectType: "File",
                        label: Resx.objecttype_file,
                        rootType: "tables",
                        editLabel: Resx.filesystem_file,
                        editFields: [SourceTypes.pathField]
                    }
                }
            },

            "sharepoint": {
                sourceType: "Sharepoint",
                label: Resx.sourcetype_sharepoint,
                editLabel: Resx.sourcetype_sharepoint,
                protocol: "sharepoint-list",
                formatType: "unstructured",
                authentication: [{ name: "basic", label: Resx.authentication_basic }, { name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "list": {
                        objectType: "List",
                        label: Resx.objecttype_list,
                        rootType: "tables",
                        editLabel: Resx.sharepoint_list,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.urlField]
                    }
                }
            },

            "ftp": {
                sourceType: "FTP",
                label: Resx.sourcetype_ftp,
                editLabel: Resx.sourcetype_ftp,
                protocol: "ftp",
                formatType: "unstructured",
                authentication: [{ name: "none", label: Resx.authentication_none }, { name: "basic", label: Resx.authentication_basic }, { name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "file": {
                        objectType: "File", 
                        label: Resx.objecttype_file,
                        rootType: "tables",
                        editLabel: Resx.ftp_file,
                        editFields: [SourceTypes.urlField]
                    },
                    "directory": {
                        objectType: "Directory",
                        label: Resx.objecttype_directory,
                        rootType: "tables",
                        editLabel: Resx.ftp_directory,
                        editFields: [SourceTypes.urlField]
                    }
                }
            },

            "salesforce": {
                sourceType: "Salesforce",
                label: Resx.sourcetype_salesforce,
                editLabel: Resx.sourcetype_salesforce,
                protocol: "salesforce-com",
                formatType: "unstructured",
                authentication: [{ name: "basic", label: Resx.authentication_basic }, { name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "object": {
                        objectType: "Object",
                        label: Resx.objecttype_object,
                        rootType: "tables",
                        editLabel: Resx.salesforce_object,
                        editFields: [SourceTypes.loginServerField, SourceTypes.classField, SourceTypes.itemNameField]
                    }
                }
            },

            "db2": {
                sourceType: "Db2",
                label: Resx.sourcetype_db2,
                editLabel: Resx.sourcetype_db2,
                protocol: "db2",
                formatType: "structured",
                authentication: [{ name: "basic", label: Resx.authentication_basic }, { name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "table": {
                        objectType: "Table",
                        label: Resx.objecttype_table,
                        rootType: "tables",
                        editLabel: Resx.db2_table,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "view": {
                        objectType: "View",
                        label: Resx.objecttype_view,
                        rootType: "tables",
                        editLabel: Resx.db2_view,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "database": {
                        objectType: "Database",
                        label: Resx.objecttype_database,
                        rootType: "containers",
                        editLabel: Resx.db2_database,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                    }
                }
            },

            "postgresql": {
                sourceType: "Postgresql",
                label: Resx.sourcetype_postgresql,
                editLabel: Resx.sourcetype_postgresql,
                protocol: "postgresql",
                formatType: "structured",
                authentication: [{ name: "basic", label: Resx.authentication_basic }, { name: "windows", label: Resx.authentication_windows }],
                objectTypes: {
                    "table": {
                        objectType: "Table",
                        label: Resx.objecttype_table,
                        rootType: "tables",
                        editLabel: Resx.postgresql_table,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    },
                    "view": {
                        objectType: "View",
                        label: Resx.objecttype_view,
                        rootType: "tables",
                        editLabel: Resx.postgresql_view,
                        defaults: {
                            schemas: []
                        },
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                    }, 
                    "database": {
                        objectType: "Database",
                        label: Resx.objecttype_database,
                        rootType: "containers",
                        editLabel: Resx.postgresql_database,
                        editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                    }
                }
            },

            "other": {
                sourceType: "Other",
                label: Resx.sourcetype_other,
                editLabel: Resx.sourcetype_other,
                protocol: "generic-asset",
                formatType: "unstructured",
                authentication: [{ name: "none", label: Resx.authentication_none }],
                objectTypes: {
                    "other": {
                        objectType: "Other",
                        label: Resx.objecttype_other,
                        rootType: "tables",
                        editLabel: Resx.objecttype_other,
                        defaults: {
                            schemas: []
                        },
                        editFields: [
                            { editForm: "shell-textfield", editFormParams: { bindingPath: "dsl.address.assetId", label: Resx.sourcetype_id, placeHolder: Resx.other_connectionPlaceholderText } }
                        ]
                    }
                }
            }
        };

        public static getSourceTypes(): string[] {
            var types: string[] = [];
            for (var key in SourceTypes.sources) {
                types.push(SourceTypes.sources[key].sourceType);
            };
            return types.sort();
        }

        public static getSourceTypesArray(): Interfaces.ISourceType[] {
            var types: Interfaces.ISourceType[] = [];
            Object.keys(this.sources).forEach(key => {
                types.push(this.sources[key]);
            });
            
            return types;
        }

        public static getObjectTypes(sourceName:string): string[] {
            var types: string[] = [];
            var source: Interfaces.ISourceType = SourceTypes.sources[sourceName.toLowerCase()];
            if (source) {
                for (var key in source.objectTypes) {
                    types.push(source.objectTypes[key].objectType);
                }
            }
            return types.sort();
        }

        public static getObjectTypesArray(sourceName: string): Interfaces.IObjectType[] {
            var types: Interfaces.IObjectType[] = [];

            var source: Interfaces.ISourceType = this.sources[sourceName.toLowerCase()];
            if (source) {
                for (var key in source.objectTypes) {
                    types.push(source.objectTypes[key]);
                }
            }

            return types;
        }

        public static getSourceType(sourceName: string): Interfaces.ISourceType {
            return SourceTypes.sources[sourceName.toLowerCase()];
        }

        public static getObjectType(sourceName: string, objectName: string): Interfaces.IObjectType {
            return SourceTypes.sources[sourceName.toLowerCase()].objectTypes[objectName.toLowerCase()];
        }

        public static getEditFields(sourceName: string, objectName: string): Interfaces.IFieldType[]{
            var fields: Interfaces.IFieldType[] = [];
            if (SourceTypes.sources[sourceName.toLowerCase()] && SourceTypes.sources[sourceName.toLowerCase()].objectTypes[objectName.toLowerCase()]) {
                fields = SourceTypes.sources[sourceName.toLowerCase()].objectTypes[objectName.toLowerCase()].editFields;
            }
            return fields;
        }

        public static supportsSchema(sourceName: string, objectName: string): boolean {
            var hasSchema = false;
            var name = sourceName.toLowerCase();
            var obj = objectName.toLowerCase();
            if (SourceTypes.sources[name] && SourceTypes.sources[name].objectTypes[obj]) {
                var defaults = SourceTypes.sources[name].objectTypes[obj].defaults;
                if (defaults) {
                    hasSchema = (<Object>defaults).hasOwnProperty("schemas");
                }
            }
            return hasSchema;
        }

        public static hasConnectionsString(sourceName: string): boolean {
            var sourceType = SourceTypes.getSourceType(sourceName);
            var hasString = false;
            if (sourceType) {
                hasString = (<Object>sourceType).hasOwnProperty("connectionStrings");
            }
            return hasString;
        }

        public static getConnectionStrings(sourceName: string): Interfaces.IConnectionString[]{
            var sourceType = SourceTypes.getSourceType(sourceName);
            var connectionStrings = [];
            if (sourceType) {
                connectionStrings = sourceType.connectionStrings || [];
            }
            else {
                logger.logInfo("Attempted to return connection strings for an undefined source type", { data: { sourceType: sourceName } });
            }
            return connectionStrings;
        }
    }
}