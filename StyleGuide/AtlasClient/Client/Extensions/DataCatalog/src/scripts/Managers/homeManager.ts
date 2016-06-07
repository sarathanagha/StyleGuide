module Microsoft.DataStudio.DataCatalog.Managers {
    export class HomeManager {
        public static isSearching = ko.observable<boolean>(false);
        public static myAssetsLabel = ko.observable<string>("");
        public static statsLabel = ko.observable<string>("");
    }
}