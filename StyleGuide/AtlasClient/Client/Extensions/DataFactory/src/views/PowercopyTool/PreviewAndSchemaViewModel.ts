/// <amd-dependency path="text!./templates/PreviewAndSchemaTemplate.html" name="previewAndSchemaTemplate" />

let previewAndSchemaTemplate: string;

import FormRender = require("./FormRender");
import Common = require("./Common");

export interface IPreviewAndSchemaProperties {
    preview: KnockoutObservable<Common.IPreview>;
    previewMessage: KnockoutComputed<string>;
    schema: KnockoutObservable<Common.IColumn[]>;
    schemaMessage: KnockoutComputed<string>;
}

export class PreviewAndSchemaViewModel {
    public template = previewAndSchemaTemplate;

    // Accessed in html
    public previewSelected = ko.observable(true);
    public preview: KnockoutObservable<FormRender.IPreview>;
    public previewMessage: KnockoutComputed<string>;
    public schema = ko.observable<Common.IColumn[]>();
    public schemaMessage: KnockoutComputed<string>;

    constructor(previewAndSchemaProperties: IPreviewAndSchemaProperties) {
        this.preview = previewAndSchemaProperties.preview;
        this.previewMessage = previewAndSchemaProperties.previewMessage;
        this.schema = previewAndSchemaProperties.schema;
        this.schemaMessage = previewAndSchemaProperties.schemaMessage;
    }

    // Callbacks in html
    public selectPreview = () => {
        this.previewSelected(true);
    };

    public selectSchema = () => {
        this.previewSelected(false);
    };
}
