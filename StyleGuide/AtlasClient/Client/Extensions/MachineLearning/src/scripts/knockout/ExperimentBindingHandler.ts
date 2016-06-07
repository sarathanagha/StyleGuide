/// <reference path="../../libs/mlstudio/typings/datalabclient.d.ts" />
/// <reference path="../../libs/mlstudio/typings/experimenteditor.d.ts" />

module Microsoft.DataStudio.MachineLearning.Knockout {
    export class ExperimentBindingHandler implements KnockoutBindingHandler {
        public currentExperimentId:string;
        public static BindingName:string = "experimenteditor";
        private testDataClient:DataLab.DataContract.IResourceClient;
        private view:DataLabViews.ExperimentView;
        public init( element: HTMLElement, valueAccessor: () => any, allBindingsAccessor?: KnockoutAllBindingsAccessor, viewModel?: any, bindingContext?: KnockoutBindingContext):
        { controlsDescendantBindings: boolean; } {
            this.currentExperimentId = null;
            this.testDataClient = new DataLab.DataContract.TestData.TestDataClient();

            var applicationCache = new DataLab.ApplicationCache(this.testDataClient);
            DataLab.Model.CredentialStore.initialize(this.testDataClient);

            return { controlsDescendantBindings: true};
        }

        public update(element: HTMLElement, valueAccessor: () => any): { controlsDescendantBindings: boolean; } {
            var newExperimentId = ko.unwrap(valueAccessor());
            if(newExperimentId == null) {
                newExperimentId = "ContractTestDataWorkspace.ExperimentWithOldResources";
            }
            if(newExperimentId && this.currentExperimentId != newExperimentId) {
                this.currentExperimentId = newExperimentId;
                // TODO: [parvezp] Remove this hack once the view model issue is fixed
                // Ideally we want to use the element that is passed in the update method. But currently it passing in the jstree element form experiments.html
                var elem = $("#ExperimentEditor")[0];
                this.view = null;
                this.view = new DataLabViews.ExperimentView(elem, this.currentExperimentId, DataLab.DataContract.TestData.workspace);
                this.view.open();

            }
            return { controlsDescendantBindings: true};
        }
    }
}