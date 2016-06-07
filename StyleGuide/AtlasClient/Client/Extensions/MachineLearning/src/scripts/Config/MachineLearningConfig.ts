module Microsoft.DataStudio.MachineLearning {
    export class ConfigData {

        /*
        private static sidePanelTop: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
            {
                icon: "fa fa-plus fa-2x",
                text: "New Blueprint",
                componentName: "blueprint-sidepanel-newblueprintbutton"
            },
            {
                icon: "fa fa-home fa-2x",
                text: "Home",
                componentName: "uxshell-labelButton"
            },
            {
                icon: "fa fa-flask fa-2x",
                text: "Experiments",
                componentName: "uxshell-labelButton"
            },
            {
                icon: "fa fa-globe fa-2x",
                text: "Web services",
                componentName: "uxshell-labelButton"
            },
            {
                icon: "fa fa-puzzle-piece fa-2x",
                text: "Components",
                componentName: "uxshell-labelButton"
            }
        ];

        private static sidePanelBottom: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
            {
                icon: "fa fa-bars fa-2x",
                text: "Settings",
                componentName: "uxshell-labelButton"
            }
        ];
        */

        private static leftPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
            {
                icon: "fa fa-flask fa-15x",
                text: "Experiments",
                componentName: "machinelearning-sidepanel-experiments"
            },
            {
                icon: "fa fa-globe fa-15x",
                text: "Web services",
                componentName: "machinelearning-sidepanel-webservices"
            },
            {
                icon: "fa fa-cubes fa-15x",
                text: "Datasets",
                componentName: "machinelearning-sidepanel-datasets"
            },
            {
                icon: "fa fa-cube fa-15x",
                text: "Trained Models",
                componentName: "machinelearning-sidepanel-trainedmodels"
            }
            
        ];

        /*

        private static sidePanelConfig: Microsoft.DataStudio.Model.Config.SidePanel = {
            top: ConfigData.sidePanelTop,
            bottom: ConfigData.sidePanelBottom,
            cssClass: "ml"
        };
        */

        public static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig = {
            name: "machinelearning",
            text: "Machine Learning Studio",
            symbol: "\ue607",
            url: "machinelearning",
            defaultViewName: "edit",
            // sidePanel: null,
            drawer: null,
            views: [
                {
                    name: "edit",
                    leftPanel: ConfigData.leftPanel,
                    componentName: "machinelearning-editor"
                }
            ]
        };
    }
}

