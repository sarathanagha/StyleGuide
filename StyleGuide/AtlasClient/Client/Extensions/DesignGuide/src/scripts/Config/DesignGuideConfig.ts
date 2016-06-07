/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.DesignGuide {
    export class ConfigData {

        private static leftPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [];

        private static rightPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [];

        public static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig = {
            name: "designguide",
            text: "Design Guide",
            symbol: "",
            url: "designguide",
            defaultViewName: "home",
            sidePanel: null,
          
            views: [
                {
                    name: "home",
                    leftPanel: null,
                    rightPanel: null,
                    commandBarComponentName: null,
                    componentName: "designguide-home-home",
                    isFullScreen: true
                },
                {
                    name: "navBar",
                    leftPanel: null,
                    rightPanel: null,
                    commandBarComponentName: 'designguide-navbar',
                    componentName: "designguide-home-navbar",
                    isFullScreen: true
                }
            ]
        };
    }
}

