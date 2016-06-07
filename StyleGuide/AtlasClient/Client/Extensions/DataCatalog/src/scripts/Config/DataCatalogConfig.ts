/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.DataCatalog {
    export class ConfigData {

        private static leftPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [];

        private static rightPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [];

        public static datacatalogImagePath: string = "node_modules/@ms-atlas-module/datastudio-datacatalog/images/";

        public static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig = {
            name: "datacatalog",
            text: "Data Catalog",
            symbol: "",
            url: "datacatalog",
            defaultViewName: "home",
            sidePanel: null,
            drawer: null,
            views: [
                {
                    name: "home",
                    leftPanel: null,
                    rightPanel: null,
                    commandBarComponentName: 'datacatalog-home-commandBar',
                    componentName: "datacatalog-home-home",
                    isFullScreen: true
                },
                {
                    name: "browse",
                    leftPanel: null,
                    rightPanel: null,
                    commandBarComponentName: 'datacatalog-browse-search',
                    componentName: "datacatalog-browse-browse",
                    isFullScreen: true
                },
                {
                    name: "admin",
                    leftPanel: null,
                    rightPanel: null,
                    componentName: "datacatalog-admin-admin",
                    isFullScreen: true
                },
                {
                    name: "publish",
                    leftPanel: null,
                    rightPanel: null,
                    componentName: "datacatalog-publish-publish",
                    isFullScreen: true
                },
                {
                    name: "provision",
                    leftPanel: null,
                    rightPanel: null,
                    componentName: "datacatalog-provision-catalog",
                    isFullScreen: true
                }
            ]
        };
    }
}

