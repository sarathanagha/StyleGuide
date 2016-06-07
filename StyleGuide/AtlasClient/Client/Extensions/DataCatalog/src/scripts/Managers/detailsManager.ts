// <reference path="../../../References.d.ts" />

module Microsoft.DataStudio.DataCatalog.Managers {
    export class DetailsManager {
        
        static activeComponent = ko.observable<string>();

        static showSchema() {
            this.activeComponent("datacatalog-browse-schema");
        }

        static showEditSchema() {
            this.activeComponent("datacatalog-browse-editschema");
        }

        static isShowingSchema = ko.pureComputed(() => {
            return DetailsManager.activeComponent() === "datacatalog-browse-schema" || DetailsManager.activeComponent() === "datacatalog-browse-editschema";
        });

        static showPreview() {
            this.activeComponent("datacatalog-browse-preview");
        }

        static isShowingPreview = ko.pureComputed(() => {
            return DetailsManager.activeComponent() === "datacatalog-browse-preview";
        });

        static showDocs() {
            this.activeComponent("datacatalog-browse-documentation");
        }

        static isShowingDocs = ko.pureComputed(() => {
            return DetailsManager.activeComponent() === "datacatalog-browse-documentation";
        });

        static showDataProfile() {
            this.activeComponent("datacatalog-browse-dataprofile");
        }

        static isShowingDataProfile = ko.pureComputed(() => {
            return DetailsManager.activeComponent() === "datacatalog-browse-dataprofile";
        });

        static isEmpty = ko.pureComputed(() => {
            return !DetailsManager.activeComponent();
        });
    } 
}