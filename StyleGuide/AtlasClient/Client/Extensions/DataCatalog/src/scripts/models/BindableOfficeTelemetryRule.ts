module Microsoft.DataStudio.DataCatalog.Models {
    export class BindableOfficeTelemetryRule implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableOfficeTelemetryRule {

        __id: string;
        __type: string;

        apps = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IAttributeInfo>([]);
        platforms = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IAttributeInfo>([]);
        builds = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IAttributeInfo>([]);
        flights = ko.observableArray<Microsoft.DataStudio.DataCatalog.Interfaces.IAttributeInfo>([]);

        ruleReference = ko.observable<string>(null);
        ruleHealthReportDogfood = ko.observable<string>(null);
        ruleHealthReportProduction = ko.observable<string>(null);
        splunkLink = ko.observable<string>(null);

        constructor(params: Microsoft.DataStudio.DataCatalog.Interfaces.IOfficeTelemetryRule) {
            this.__id = params.__id;
            this.__type = params.__type;

            this.apps((params.apps || []).map(a => { return { name: a, readOnly: true }; }));
            this.platforms((params.platforms || []).map(p => { return { name: p, readOnly: true }; }));
            this.builds((params.builds || []).map(b => { return { name: b, readOnly: true }; }));
            this.flights((params.flights || []).map(f => { return { name: f, readOnly: true }; }));

            this.ruleReference(params.ruleReference || null);
            this.ruleHealthReportDogfood(params.ruleHealthReportDogfood || null);
            this.ruleHealthReportProduction(params.ruleHealthReportProduction || null);
            this.splunkLink(params.splunkLink || null);
        }
    }
}