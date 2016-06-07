module Microsoft.DataStudio.DataCatalog.Models {
    export class BindableSchema implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchema {
        __id = "";
        __creatorId = "";
        columns = <Microsoft.DataStudio.DataCatalog.Interfaces.IColumn[]>[];
        modifiedTime: string;

        constructor(schema: Microsoft.DataStudio.DataCatalog.Interfaces.ISchema) {
            if (schema) {
                this.__id = schema.__id;
                this.__creatorId = schema.__creatorId;
                this.modifiedTime = schema.modifiedTime;
                this.columns = schema.columns || [];
            }
        }

        static getSchemaForDisplay(schemas: Microsoft.DataStudio.DataCatalog.Interfaces.ISchema[]): Microsoft.DataStudio.DataCatalog.Interfaces.ISchema {
            // Use the most recently updated schema
            var schema = <Microsoft.DataStudio.DataCatalog.Interfaces.ISchema>{};
            if ((schemas || []).length) {
                schema = schemas[0];
                schemas.forEach(s => {
                    var myDate = new Date(s.modifiedTime);
                    if (myDate > new Date(schema.modifiedTime)) {
                        schema = s;
                    }
                });
            }
            return schema;
        }
    }
}