module Microsoft.DataStudio.DataCatalog.Models {
    export class BindableDocumentation implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDocumentation {
        __creatorId: string;
        __id = "";
        __roles: Microsoft.DataStudio.DataCatalog.Interfaces.IRole[];
        modifiedTime: string;

        mimeType: KnockoutObservable<string>;
        content: KnockoutObservable<string>;

        constructor(documentation?: Microsoft.DataStudio.DataCatalog.Interfaces.IDocumentation) {
            this.__id = (documentation && documentation.__id) || "";
            this.__roles = (documentation && documentation.__roles) || [];
            this.modifiedTime = documentation && documentation.modifiedTime || (new Date()).toISOString();

            this.mimeType = ko.observable<string>(documentation && documentation.mimeType || "text/html");
            this.content = ko.observable<string>(documentation && documentation.content || "");

            if (!this.__id) {
                Core.Utilities.setAssetAsMine(this, true);
            }
        }
    }
}