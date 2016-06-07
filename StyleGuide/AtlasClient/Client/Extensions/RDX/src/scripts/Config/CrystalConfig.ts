module Microsoft.DataStudio.Crystal {
    export class ConfigData {
        public static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig = {
            name: "rdx",
            text: "RDX",
            defaultViewName: "home",
            drawer: null,
            views: [
                {
                    name: "home",
                    componentName: "rdx-home"
                }
            ]
        };
    }
}