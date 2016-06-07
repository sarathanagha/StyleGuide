module Microsoft.DataStudio.DataCatalog.Models {
    export class BindableOfficeTelemetry implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOfficeTelemetry {

        __id: string;
        __type: string;
        __creatorId: string;

        categories = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IAttributeInfo>([]);
        scopeQuery = ko.observable<string>(null);

        constructor(params: Microsoft.DataStudio.DataCatalog.Interfaces.IOfficeTelemetry) {
            this.__id = params.__id;
            this.__type = params.__type;
            this.categories((params.categories || []).map(c => { return { name: c, readOnly: true }; }));
            this.scopeQuery(params.scopeQuery || null);
        }

    }
}