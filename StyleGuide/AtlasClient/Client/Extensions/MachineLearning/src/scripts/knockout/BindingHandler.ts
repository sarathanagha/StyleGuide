module Microsoft.DataStudio.MachineLearning.Knockout {
    export class BindingHandler {
        public static initialize() {
            ko.bindingHandlers[ExperimentBindingHandler.BindingName] = new ExperimentBindingHandler();
        }
    }
}