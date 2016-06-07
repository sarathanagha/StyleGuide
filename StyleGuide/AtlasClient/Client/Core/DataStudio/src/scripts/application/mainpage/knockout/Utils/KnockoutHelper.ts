module Microsoft.DataStudio.Application.Knockout.Utils { 
    export class KnockoutHelper {
        public static CreateComponentNode(config: Microsoft.DataStudio.Model.Config.ShellElementConfigProxy): HTMLDivElement {
            console.debug("Rendering " + ko.utils.unwrapObservable(config.componentName));

            var div: HTMLDivElement = document.createElement("div");
            var params = { componentConfig: config };

            ko.applyBindingsToNode(div, { component: { name: config.componentName, params: params }});
            return div;
        }
    }
}
