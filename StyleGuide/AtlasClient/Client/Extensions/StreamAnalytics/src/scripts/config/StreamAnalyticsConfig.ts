module Microsoft.DataStudio.StreamAnalytics {
    export class ConfigData {

        /*
        private static sidePanelTop: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
            {
                icon: "fa fa-plus fa-2x",
                text: "New",
                componentName: "blueprint-sidepanel-newblueprintbutton"
            },
            {
                icon: "fa fa-home fa-2x",
                text: "Home",
                componentName: "streamanalytics-sidepanel-myjobs"
            }
        ];

        private static sidePanelConfig: Microsoft.DataStudio.Model.Config.SidePanel = {
            top: ConfigData.sidePanelTop,
            cssClass: "streamAnalyticsSidePanel"
        };
        */

        public static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig = {
            name: "streamanalytics",
            text: "Stream Analytics",
            symbol: "\ue60e",
            url: "streamanalytics",
            defaultViewName: "home",
            // sidePanel: null,
            drawer: null,
            views: [
                {
                    name: "home",
                    componentName: "streamanalytics-home"
                }
            ]
        };
    }
}