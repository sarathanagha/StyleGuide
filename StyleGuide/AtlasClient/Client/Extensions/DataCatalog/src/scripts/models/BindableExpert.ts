module Microsoft.DataStudio.DataCatalog.Models {
    export class BindableExpert implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableExpert {
        __creatorId: string;
        __id = "";
        modifiedTime: KnockoutObservable<string>;
        experts = ko.observableArray<string>([]);

        constructor(expert?: Microsoft.DataStudio.DataCatalog.Interfaces.IExpert) {
            this.__id = (expert && expert.__id) || "";
            this.__creatorId = expert ? expert.__creatorId : $tokyo.user.email;
            this.experts(expert ? (expert.experts || []) : []);
            this.modifiedTime = ko.observable<string>(expert && expert.modifiedTime || (new Date()).toISOString());
        }
    }
}