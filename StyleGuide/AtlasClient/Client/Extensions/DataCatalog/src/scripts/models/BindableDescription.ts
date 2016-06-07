module Microsoft.DataStudio.DataCatalog.Models {
    export class BindableDescription implements Microsoft.DataStudio.DataCatalog.Interfaces.IBindableDescription {
        private dispose: () => void;
        __id: string;
        __creatorId: string;
        experts: KnockoutComputed<string[]>;
        friendlyName: KnockoutObservable<string>;
        modifiedTime: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        plainDescription: KnockoutObservable<string>;
        tags: KnockoutObservableArray<string>;
        requestAccess: KnockoutObservable<string>;

        constructor(experts: KnockoutComputed<string[]>, desc?: Microsoft.DataStudio.DataCatalog.Interfaces.IDescription) {
            this.experts = experts;
            this.__id = (desc && desc.__id) || "";
            this.__creatorId = desc ? desc.__creatorId : $tokyo.user.email;
            this.friendlyName = ko.observable<string>(desc && desc.friendlyName || "");
            this.description = ko.observable<string>(desc && desc.description || "");

            var safe = Microsoft.DataStudio.DataCatalog.Core.Utilities.removeScriptTags(this.description());
            var stripped = Core.Utilities.removeHtmlTags(safe);
            this.plainDescription = ko.observable(stripped);

            this.tags = ko.observableArray<string>(desc && desc.tags || []);
            this.modifiedTime = ko.observable<string>(desc && desc.modifiedTime || (new Date()).toISOString());

            var descSubscription = this.description.subscribe(newDesc => {
                var safe = Core.Utilities.removeScriptTags(newDesc);
                var stripped = Core.Utilities.removeHtmlTags(safe);
                this.plainDescription(stripped);
            });

            var plainSubscription = this.plainDescription.subscribe(newDesc => {
                this.description(newDesc);
            });

            this.dispose = () => {
                descSubscription.dispose();
                plainSubscription.dispose();
            };
        }

        displayDate = ko.pureComputed((): string => {
            var dateString = "";
            if (this.modifiedTime()) {
                var date = new Date(this.modifiedTime());
                dateString = date.toLocaleDateString();
            }
            return dateString;
        });

        displayCreatedBy() {
            // If __creatorId is not an email address then it must be from extractor
            return this.isUserCreated() ? this.__creatorId : Core.Resx.dataSource;
        }

        isUserCreated() {
            return /@/.test(this.__creatorId);
        }

        isExpertDesc = ko.pureComputed(() => {
            return this.experts().some(e => e === this.__creatorId);
        });

        linkedDescription = ko.pureComputed(() => {
            var desc = this.description() || "";
            var highlightedWords = Core.Utilities.extractHighlightedWords(desc);
            var plainText = Core.Utilities.plainText(desc); 

            // Add links
            plainText = plainText.replace(Core.Constants.HttpRegex, "<a href='{$&}' target='_blank'>$&</a>");
            // Add mailto
            plainText = plainText.replace(Core.Constants.EmailRegex, "<a href='{mailto:$&'}>$&</a>");
            // Add highlights back
            plainText = Core.Utilities.applyHighlighting(highlightedWords, plainText);

            // Clean up links
            plainText = plainText.replace(/(href='{)([^}]*)(})/g, (a, b, c) => {
                return "href='" + Core.Utilities.plainText(c);
            });

            return plainText;
        });
    }
}