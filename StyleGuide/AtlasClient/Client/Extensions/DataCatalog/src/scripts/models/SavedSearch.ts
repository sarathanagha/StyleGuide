// [TODO] raghum uncomment and fix the issue

//import browseManager = require("components/browse/manager");
module Microsoft.DataStudio.DataCatalog.Models {
    export class SavedSearch implements Interfaces.ISavedSearch {
        version = "1.0.0";

        id: string;
        name: string;
        lastUsedDate: string;
        createdDate: string;

        isDefault: boolean;

        searchTerms: string;
        containerId: string;
        sortKey: string;
        facetFilters: Interfaces.ISavedFacet[];

        constructor(name: string) {
            var now = new Date().toISOString();

            this.id = Core.Utilities.createID();
            this.name = name;
            this.lastUsedDate = now;
            this.createdDate = now;

            this.isDefault = false;

            // [TODO] raghum uncomment and fix the issue

            //this.searchTerms = browseManager.searchText();
            //this.facetFilters = (browseManager.selectedFilters() || []).slice();
            //this.sortKey = browseManager.sortField().value;

            //this.containerId = null;
            //if (browseManager.container()) {
            //    this.containerId = browseManager.container().__id;
            //}
        }
    }
}