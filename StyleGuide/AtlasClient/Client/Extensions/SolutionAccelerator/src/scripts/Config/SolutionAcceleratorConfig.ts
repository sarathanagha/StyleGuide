/// <reference path="../../References.d.ts" />

import Router = Microsoft.DataStudio.Application.Router;

module Microsoft.DataStudio.SolutionAccelerator {
    export class ConfigData {

        private static imageResourcePath: string = "node_modules/@ms-atlas-module/datastudio-solutionaccelerator/libs/Images/";

        private static leftPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
            {
                icon: "",
                iconResource: "<img src='" + ConfigData.imageResourcePath + "plus.svg'>",
                text: "New Solution",
                componentName: null,
                callback: function () {
                    Microsoft.DataStudio.Application.ShellContext.LeftPanelIsExpanded(false);
                    location.href = Microsoft.DataStudio.Managers.ConfigurationManager.instance.getGalleryEndpointUrl()
                }
            },
            {
                icon: "",
                iconResource: "<img src='" + ConfigData.imageResourcePath + "resource_explorer.svg'>",
                text: "Solutions",
                componentName: "solutionaccelerator-sidepanel-solutions",
                isDefault: true
            }
        ];

        private static rightPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
            {
                icon: "",
                iconResource: "<img src='" + ConfigData.imageResourcePath + "listview.svg'>",
                text: "Deployment Details",
                componentName: "solutionaccelerator-solutionInfoView-rightPanel",
                callback: () => Microsoft.DataStudio.Application.ShellContext.RightPanelIsExpanded(true)
            }
        ];

        public static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig = {
            name: "solutionaccelerator",
            text: "Solution Template",
            symbol: "<img src='" + ConfigData.imageResourcePath + "SA_Icon.svg'>",
            url: "solutionaccelerator",
            defaultViewName: "solutionInfoView",
            sidePanel: null,
            views: [
                {
                    name: "solutionInfoView",
                    leftPanel: ConfigData.leftPanel,
                    rightPanel: ConfigData.rightPanel,
                    componentName: "solutionaccelerator-solutionInfoView"
                },
                {
                    name: "new",
                    leftPanel: null,
                    rightPanel: null,
                    componentName: "solutionaccelerator-new",
                    isFullScreen: true
                }
            ]
        };
    }
}

