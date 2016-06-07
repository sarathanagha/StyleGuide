module Microsoft.DataStudio.DataCatalog.Models {
    export class BindableSchemaDescription implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchemaDescription {
        __id = "";
        __creatorId = "";
        modifiedTime: KnockoutObservable<string>;
        columnDescriptions: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableColumn[] = [];
        experts: KnockoutComputed<string[]>;

        private columnLookup: { [columnName: string]: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableColumn } = {};

        constructor(experts: KnockoutComputed<string[]>, schemaDesc?: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription) {
            this.experts = experts;
            this.__id = schemaDesc ? schemaDesc.__id : "";
            this.__creatorId = schemaDesc ? schemaDesc.__creatorId : $tokyo.user.email;
            this.modifiedTime = ko.observable<string>(schemaDesc && schemaDesc.modifiedTime || (new Date()).toISOString());

            if (schemaDesc) {
                $.each(schemaDesc.columnDescriptions || [], (i, columnDesc: Microsoft.DataStudio.DataCatalog.Interfaces.IColumnDescription) => {
                    var bindableColumn = new BindableColumn(experts, columnDesc);
                    this.columnLookup[bindableColumn.columnName] = bindableColumn;
                    this.columnDescriptions.push(bindableColumn);
                });
            }
        }

        ensureAllColumns(columnNames: Microsoft.DataStudio.DataCatalog.Interfaces.IColumn[]) {
            $.each(columnNames || [], (i, column: Microsoft.DataStudio.DataCatalog.Interfaces.IColumn) => {
                if (!this.columnLookup[column.name]) {
                    var bindableColumn = new BindableColumn(this.experts, { columnName: column.name, tags: [], description: "" });
                    this.columnLookup[bindableColumn.columnName] = bindableColumn;
                    this.columnDescriptions.push(bindableColumn);
                }
            });
        }

        addOtherData(schemaDescriptions: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription[]) {
            $.each(schemaDescriptions || [], (i, schemaDesc: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription) => {
                if (schemaDesc.__creatorId !== $tokyo.user.email) {
                    // This is someone else's schema description
                    $.each(schemaDesc.columnDescriptions || [], (j, columnDesc: Microsoft.DataStudio.DataCatalog.Interfaces.IColumnDescription) => {
                        var myColumnDesc = this.getBindableColumnByName(columnDesc.columnName);
                        myColumnDesc && myColumnDesc.addOtherInfo(schemaDesc.__creatorId, schemaDesc.modifiedTime, columnDesc);
                    });
                }
            });
        }

        getBindableColumnByName(columnName: string): Microsoft.DataStudio.DataCatalog.Interfaces.IBindableColumn {
            return this.columnLookup[columnName];
        }

        removeColumnDescription(columnName: string) {
            this.columnDescriptions = this.columnDescriptions.filter(d => d.columnName !== columnName);
            delete (this.columnLookup[columnName]);
        }

        public static mergeSchemaDescriptions(schemaDescriptions: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription[]): Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription[] {
            // Give priority to the most recent one if there are multiple from the same user
            var creatorBuckets: { [creatorId: string]: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription } = {};
            (schemaDescriptions || []).forEach(sd => {
                if (creatorBuckets[sd.__creatorId]) {
                    var myDate = new Date(sd.modifiedTime);
                    var theirDate = new Date(creatorBuckets[sd.__creatorId].modifiedTime);
                    if (myDate > theirDate) {
                        creatorBuckets[sd.__creatorId] = sd;
                    }
                } else {
                    creatorBuckets[sd.__creatorId] = sd;
                }
            });
            var allSchemaDescriptions = <Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription[]>[];
            Object.keys(creatorBuckets).forEach(cid => {
                allSchemaDescriptions.push(creatorBuckets[cid]);
            });

            return allSchemaDescriptions;
        }

        public static getMyBindableSchemaDescription(schemaDescriptions: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription[],
            columns: Microsoft.DataStudio.DataCatalog.Interfaces.IColumn[],
            experts: KnockoutComputed<string[]>): Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchemaDescription {

            var myBindableSchemaDescription: Microsoft.DataStudio.DataCatalog.Interfaces.IBindableSchemaDescription;
            // Try to find my schema desc
            $.each(schemaDescriptions || [], (i, schemaDesc: Microsoft.DataStudio.DataCatalog.Interfaces.ISchemaDescription) => {
                if (schemaDesc.__creatorId === $tokyo.user.email) {
                    myBindableSchemaDescription = new BindableSchemaDescription(experts, schemaDesc);
                    return false;
                }
            });

            if (!myBindableSchemaDescription) {
                myBindableSchemaDescription = new BindableSchemaDescription(experts);
            }

            myBindableSchemaDescription.ensureAllColumns(columns);
            myBindableSchemaDescription.addOtherData(schemaDescriptions);

            return myBindableSchemaDescription;
        }
    }
}