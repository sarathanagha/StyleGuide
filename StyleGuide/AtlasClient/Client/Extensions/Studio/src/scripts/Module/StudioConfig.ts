/// <reference path="./references.d.ts" />
module Microsoft.DataStudio.Studio {
    export class ConfigData {
        private static leftPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
            {
                icon: "",
                iconResource: "<img src='/Images/resource_explorer.svg'>",
                text: "toolbox",
                componentName: "studio-toolbox"
            }];

        private static rightPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
            {
                icon: "",
                iconResource: "<img src='/Images/resource_explorer.svg'>",
                text: "Properties",
                componentName: "studio-Properties"
            }
        ];


        public static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig = {
            name: "studio",
            text: "Explorer",
            defaultViewName: "landingPage",
            views: [
                {
                    name: "build_and_deploy",
                    componentName: "studio-buildDeploy"
                },
                {
                    name: "landingPage",
                    componentName: "studio-landingPage"
                },
                {
                    name: "editor",
                    leftPanel: ConfigData.leftPanel,
                    rightPanel: ConfigData.rightPanel,
                    componentName: "studio-editor"
                }
            ]
        };
    }
}