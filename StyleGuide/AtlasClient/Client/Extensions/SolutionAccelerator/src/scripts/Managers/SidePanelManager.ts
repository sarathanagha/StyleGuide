module Microsoft.DataStudio.SolutionAccelerator.Managers
{
    export class SidePanelManager implements Application.IDisposableManager {

        public static _className: string = "Microsoft.DataStudio.SolutionAccelerator.Managers.SidePanelManager";

        public static defaultComponentName: string = "solutionaccelerator-solutionInfoView-rightPanel-solutionDetails";
        public static detailComponentName: string = "solutionaccelerator-solutionInfoView-rightPanel-details";
        public static powerbiComponentName: string = "solutionaccelerator-solutionInfoView-rightPanel-powerbi";

        public componentName: KnockoutObservable<string>;
        public params: KnockoutObservable<any>;

        constructor() {   
            this.componentName = ko.observable(SidePanelManager.defaultComponentName);
            this.params = ko.observable({});
        }

        public changeComponent(componentName: string, params: any): void {
            this.params(params);
            this.componentName(componentName);
        }

        public initialize(): void {
            this.changeComponent(SidePanelManager.defaultComponentName, {});
        }

        public clear(): void {
            this.changeComponent(null, {});
        }

        public dispose() {
            this.componentName = null;
            this.params = null;
        }
    }
}
