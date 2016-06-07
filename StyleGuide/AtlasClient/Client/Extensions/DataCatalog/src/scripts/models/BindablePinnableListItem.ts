module Microsoft.DataStudio.DataCatalog.Models {
    export class BindablePinnableListItem {

        label: string;
        friendlyName = ko.observable<string>(null);
        pinned = ko.observable<boolean>(false);
        id: string;
        maxStringSize = 35;

        constructor(params: Interfaces.IPinnableListItem) {
            this.label = params.label;
            this.pinned = params.pinned;
            this.id = params.id;
            if ((<Object>params).hasOwnProperty("friendlyName")) {
                this.friendlyName(params.friendlyName);
            }
        }

        displayLabel = ko.pureComputed<string>(() => {
            var label = Core.Utilities.centerTruncate(this.label, this.maxStringSize);
            if (this.friendlyName()) {
                label = Core.Utilities.centerTruncate(this.friendlyName(), this.maxStringSize);
            }
            return label;
        });

        setFriendlyName(value: string) {
            this.friendlyName(value);
        }

    }
}