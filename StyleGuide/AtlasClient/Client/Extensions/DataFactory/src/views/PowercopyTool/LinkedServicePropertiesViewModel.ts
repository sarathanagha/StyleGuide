import DataTypeConstants = require("./DataTypeConstants");
import FormFields = require("../../bootstrapper/FormFields");
import LinkedServicesViewModel = require("./LinkedServicesViewModel");

export class LinkedServicePropertiesViewModel {
    public storageServiceSelection = new FormFields.ValidatedSelectBoxViewModel<string>(ko.observableArray([
        { value: "", displayText: "Azure Blob" }, { value: DataTypeConstants.azureTable, displayText: "Azure Table" }]),
        {
            label: "Azure storage service"
        }
        );
    public enhancedLinkedService: KnockoutObservable<LinkedServicesViewModel.IEnhancedLinkedService> = ko.observable(undefined);
    public isStorageDataType: KnockoutObservable<boolean> = ko.observable(false);

    constructor(dataType: KnockoutObservable<string>, enhancedLinkedService: KnockoutObservable<LinkedServicesViewModel.IEnhancedLinkedService>) {
        this.enhancedLinkedService = enhancedLinkedService;
        this.isStorageDataType = ko.computed(() => dataType() === DataTypeConstants.blobStorage || dataType() === DataTypeConstants.azureTable);
        this.storageServiceSelection.value.subscribe(storageServiceDataType => {
            dataType(storageServiceDataType || DataTypeConstants.blobStorage);
        });
    }
}
