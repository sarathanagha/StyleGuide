/// <reference path="../../References.d.ts" />
/// <amd-dependency path="text!./rdxTopPanel.html" />
/// <amd-dependency path="css!./rdxTopPanel.css" />

export var template: string = require("text!./rdxTopPanel.html");
import Models = Microsoft.DataStudio.Crystal.Models;
import ko = require('knockout');

export class viewModel {
    public timePicker: Models.TimePicker;
    public metadataExplorer: Models.MetadataExplorer;
    public rdxContext: Models.RdxContext;
    public metadataExplorerFilter: KnockoutObservable<string> = ko.observable('').extend({ throttle: 250 });
    public timePickerVisible: KnockoutObservable<boolean>;
    public metadataExplorerVisible: KnockoutObservable<boolean>;
    public environmentsVisible: KnockoutObservable<boolean>;
    public synchronizePickerAndInputs: any;

    constructor(params: any) {
        this.timePicker = params.rdxContext.timePicker;
        this.metadataExplorer = params.rdxContext.metadataExplorer;
        this.rdxContext = params.rdxContext;
        this.timePickerVisible = params.rdxContext.timePickerVisible;
        this.metadataExplorerVisible = params.rdxContext.metadataExplorerVisible;
        this.environmentsVisible = params.rdxContext.environmentsVisible;
        
        // filters metadata based on keyword
        this.metadataExplorerFilter.subscribe((filter) => {
            this.metadataExplorer.setMetadataFilteredAttributes(filter);
        });
    }
}