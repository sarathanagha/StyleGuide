/// <amd-dependency path="text!./templates/HierarchicalFileSettingsTemplate.html" name="hierarchicalFileSettingsTemplate" />
/// <amd-dependency path="text!./templates/HierarchicalAdvancedSettingsTemplate.html" name="hierarchicalAdvancedSettingsTemplate" />

import FormFields = require("../../bootstrapper/FormFields");
import Common = require("./Common");
import Constants = require("./Constants");
import {Util} from "../../_generated/Framework";

let columnDelimiter = "Column delimiter";
let rowDelimiter = "Row delimiter";
let compressionType = "Compression type";
let compressionLevel = "Compression level";
let hierarchicalFileSettingsTemplate: string;
let hierarchicalAdvancedSettingsTemplate: string;

export class FileFormatViewModel {
    public hierarchicalFileSettingsTemplate = hierarchicalFileSettingsTemplate;
    public hierarchicalAdvancedSettingsTemplate = hierarchicalAdvancedSettingsTemplate;

    /* tslint:disable:member-ordering */
    private standardColumnDelimiter = new FormFields.ValidatedSelectBoxViewModel<string>(ko.observableArray(Common.columnDelimiterOptions), {
        label: columnDelimiter,
        infoBalloon: columnDelimiter
    });

    private customColumnDelimiter = new FormFields.ValidatedBoxViewModel<string>({
        label: columnDelimiter,
        infoBalloon: columnDelimiter
    });

    private useCustomColumnDelimiter = ko.observable(false);

    private standardRowDelimiter = new FormFields.ValidatedSelectBoxViewModel<string>(ko.observableArray(Common.rowDelimiterOptions), {
        label: rowDelimiter,
        infoBalloon: rowDelimiter
    });

    private customRowDelimiter = new FormFields.ValidatedBoxViewModel<string>({
        label: rowDelimiter,
        infoBalloon: rowDelimiter
    });

    private useCustomRowDelimiter = ko.observable(false);

    private advancedSettingsVisible = ko.observable(false);

    public toggleAdvancedSettingsVisible() {
        this.advancedSettingsVisible(!this.advancedSettingsVisible());
    }

    public columnDelimiter = ko.computed(() => {
        if (this.useCustomColumnDelimiter()) {
            return this.customColumnDelimiter.value();
        } else {
            return this.standardColumnDelimiter.value();
        }
    });

    public rowDelimiter = ko.computed(() => {
        if (this.useCustomRowDelimiter()) {
            return this.customRowDelimiter.value();
        } else {
            return this.standardRowDelimiter.value();
        }
    });

    public escapeChar = new FormFields.ValidatedBoxViewModel<string>({
        label: "Escape character",
        infoBalloon: "The character used to escape any special character in the file content. This property is optional. No default value."
    });

    public quoteChar = new FormFields.ValidatedBoxViewModel<string>({
        label: "Quote character",
        infoBalloon: "The character used for quoting. This property is optional. No default value."
    });

    public nullValue = new FormFields.ValidatedBoxViewModel<string>({
        label: "Null value",
        infoBalloon: "The character used to represent null value in the file content. This property is optional. The default value is “N”",
        defaultValue: "N"
    });

    public encodingName = new FormFields.ValidatedBoxViewModel<string>({
        label: "Encoding name",
        infoBalloon: "Name of the preferred encoding"
    });

    public compressionType = new FormFields.ValidatedSelectBoxViewModel<string>(ko.observableArray(Common.compressionOptions),
        {
            label: compressionType,
            infoBalloon: compressionType
        });

    public compressionLevel = new FormFields.ValidatedSelectBoxViewModel<string>(ko.observableArray(Common.compressionLevelOptions),
        {
            label: compressionLevel,
            infoBalloon: compressionLevel
        });

    private compressionLevelRelevant = ko.computed(() => {
        return this.compressionType.value();
    });

    public format = new FormFields.ValidatedSelectBoxViewModel<string>(ko.observableArray(Common.formatOptions),
        {
            label: "File format",
            infoBalloon: "Format of the file. Supported formats are: Text (csv) and Avro"
        });

    public blobWriterAddHeader = ko.observable(false);

    public skipHeaderLineCount = new FormFields.ValidatedSelectBoxViewModel<number>(ko.observableArray(Common.formatOptions),
        {
            label: "Skip header line count",
            infoBalloon: "Number of header lines to be skipped from each file"
        });

    private isSource: boolean;
    public getProperties(): Common.IFileFormat {
        let retObj: Common.IFileFormat = {
            format: this.format.value(),
            columnDelimiter: this.columnDelimiter(),
            rowDelimiter: this.rowDelimiter(),
            escapeChar: this.escapeChar.value(),
            quoteChar: this.quoteChar.value(),
            nullValue: this.nullValue.value(),
            encodingName: this.encodingName.value(),
            compressionType: this.compressionType.value(),
            compressionLevel: this.compressionLevelRelevant() ? this.compressionLevel.value() : "",
            blobWriterAddHeader: this.blobWriterAddHeader(),
            skipHeaderLineCount: this.skipHeaderLineCount.value()
        };

        if (this.format.value() === Constants.avroFormat) {
            retObj.columnDelimiter = "";
            retObj.rowDelimiter = "";
            retObj.escapeChar = "";
            retObj.nullValue = "";
            retObj.encodingName = "";
        }
        return retObj;
    }
    /* tslint:enable:member-ordering */
    constructor(isSource) {
        this.isSource = isSource;
        this.format.value(Common.formatOptions[0].value);
        this.standardColumnDelimiter.value(Common.columnDelimiterOptions[0].value);
        this.standardRowDelimiter.value(Common.rowDelimiterOptions[0].value);
        this.compressionType.value(Common.compressionOptions[0].value);
    }

    // This takes a model and populates the viewModel.
    public setProperties(model: Common.IFileFormatOptions) {
        if (Util.propertyHasValue(model.format)) {
            this.format.value(model.format);
        } else {
            this.format.value(Common.formatOptions[0].value);
        }
        if (Util.propertyHasValue(model.columnDelimiter)) {
            this.useCustomColumnDelimiter(true);
            this.customColumnDelimiter.value(model.columnDelimiter);
        } else {
            this.useCustomColumnDelimiter(false);
            this.standardColumnDelimiter.value(Common.columnDelimiterOptions[0].value);
        }
        if (Util.propertyHasValue(model.rowDelimiter)) {
            this.useCustomRowDelimiter(true);
            this.customRowDelimiter.value(model.rowDelimiter);
        } else {
            this.useCustomRowDelimiter(false);
            this.standardRowDelimiter.value(Common.rowDelimiterOptions[0].value);
        }
        // TODO paverma Assign default values for following.
        if (Util.propertyHasValue(model.escapeChar)) {
            this.escapeChar.value(model.escapeChar);
        }
        if (Util.propertyHasValue(model.quoteChar)) {
            this.quoteChar.value(model.quoteChar);
        }
        if (Util.propertyHasValue(model.nullValue)) {
            this.nullValue.value(model.nullValue);
        }
        if (Util.propertyHasValue(model.encodingName)) {
            this.encodingName.value(model.encodingName);
        }
        if (Util.propertyHasValue(model.compressionType)) {
            this.compressionType.value(model.compressionType);
        }
        if (Util.propertyHasValue(model.blobWriterAddHeader)) {
            this.blobWriterAddHeader(model.blobWriterAddHeader);
        }
        if (Util.propertyHasValue(model.skipHeaderLineCount)) {
            this.skipHeaderLineCount.value(model.skipHeaderLineCount);
        }
    }
}
