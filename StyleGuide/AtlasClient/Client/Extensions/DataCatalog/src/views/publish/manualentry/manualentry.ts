// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./manualentry.html" />
/// <amd-dependency path="css!./manualentry.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import SourceTypes = Microsoft.DataStudio.DataCatalog.Core.SourceTypes;
import catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
import utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./manualentry.html");

export class viewModel {
    private dispose: () => void;
    resx = resx;

    logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });

    sourceName = ko.observable<string>("");
    friendlyName = ko.observable<string>("");
    description = ko.observable<string>("");
    requestAccess = ko.observable<string>("");
    experts = ko.observableArray<string>([]);
    tags = ko.observableArray<string>([]);

    expertAttributes = ko.observableArray<Interfaces.IAttributeInfo>([]);
    tagAttributes = ko.observableArray<Interfaces.IAttributeInfo>([]);


    serverName = ko.observable<string>("");
    databaseName = ko.observable<string>("");
    objectName = ko.observable<string>("");
    modelName = ko.observable<string>("");

    sourceType = ko.observable<string>("");
    objectType = ko.observable<string>("");
    authentication = ko.observable<Interfaces.IAuthenticationType>(null);

    sourceNameError = ko.observable<boolean>(false);
    isInvalid = ko.observable<boolean>(false);

    validateEmail = utilities.validateEmails;

    private createdTime: Date;

    constructor() {
        var subscription = this.sourceType.subscribe((newValue) => {
            if (this.objectTypes().length > 1) {
                this.objectType(this.objectTypes()[0].objectType);
            }
            if (this.authenticationTypes().length > 1) {
                this.authentication(this.authenticationTypes()[0]);
            }
        });

        this.dispose = () => {
            subscription.dispose();
        }
    }

    private updateObjectType(sourceType:string) {
        var types = SourceTypes.getObjectTypes(sourceType);
        if (types.length) {
            this.objectType(types[0]);
        }
    }

    sourceTypesArray = ko.pureComputed<Array<Interfaces.ISourceType>>(() => {
        var sources: Array<Interfaces.ISourceType> = SourceTypes.getSourceTypesArray();
        if (sources.length) {
            this.sourceType(sources[0].sourceType);
        }
        return sources;
    });

    singleObjectType = ko.pureComputed<string>(() => {
        var types = SourceTypes.getObjectTypes(this.sourceType());
        return <string>types[0];
    });

    objectTypes = ko.pureComputed<Array<Interfaces.IObjectType>>(() => {
        var types: Array<Interfaces.IObjectType> = SourceTypes.getObjectTypesArray(this.sourceType());
        return types;
    });

    singleAuthentication = ko.pureComputed<Interfaces.IAuthenticationType>(() => {
        var authentications: Array<Interfaces.IAuthenticationType> = SourceTypes.getSourceType(this.sourceType()).authentication;
        return authentications[0];
    });

    authenticationTypes = ko.pureComputed<Array<Interfaces.IAuthenticationType>>(() => {
        var authentications: Array<Interfaces.IAuthenticationType> = SourceTypes.getSourceType(this.sourceType()).authentication;
        return authentications;
    });

    inputFields = ko.pureComputed<Array<Interfaces.IFieldType>>(() => {
        var fields: Array<Interfaces.IFieldType> = [];
        if (this.objectTypes().length === 1) {
            fields = SourceTypes.getEditFields(this.sourceType(), this.singleObjectType());
        }
        else {
            fields = SourceTypes.getEditFields(this.sourceType(), this.objectType());
        }
        return fields;
    });

    addUserTags(tags: string[]) {
        tags.forEach((tag: string) => {
            if (!this.tags().some(t => t.toUpperCase() === tag.toUpperCase()) && $.trim(tag)) {
                this.tags().unshift(tag);
            }
        });
    }

    removeUserTag(tag: string) {
        this.tags.remove(t => t === tag);
    }

    addExperts(experts: string[]) {
        experts.forEach((expert: string) => {
            if (!this.experts().some(e => e.toUpperCase() === expert.toUpperCase()) && $.trim(expert)) {
                this.experts().unshift(expert);
            }
        });
    }

    removeExpert(expert: string) {
        this.experts.remove(e => e === expert);
    }

    buildSource(): Interfaces.IManualEntry {
        this.createdTime = new Date();
        if (this.objectTypes().length === 1) {
            this.objectType(this.objectTypes()[0].objectType);
        }
        if (this.authenticationTypes().length === 1) {
            this.authentication(this.authenticationTypes()[0]);
        }
        var source: Interfaces.ISourceType = SourceTypes.getSourceType(this.sourceType());
        var obj: Interfaces.IObjectType = SourceTypes.getObjectType(this.sourceType(), this.objectType());
        var protocol = obj.protocol || source.protocol;
        var entryData: Interfaces.IManualEntry = {
            __creatorId: constants.ManualEntryID,
            lastRegisteredBy: {
                upn: $tokyo.user.email,
                firstName: $tokyo.user.email,
                lastName: $tokyo.user.lastName
            },
            modifiedTime: this.createdTime,
            lastRegisteredTime: this.createdTime,
            name: this.sourceName(),
            dataSource: {
                sourceType: source.sourceType,
                objectType: obj.objectType,
                formatType: source.formatType
            },
            descriptions: [{
                __creatorId: $tokyo.user.email,
                modifiedTime: this.createdTime,
                description: this.description(),
                tags: this.tags()
            }],
            experts: [{
                __creatorId: $tokyo.user.email,
                modifiedTime: this.createdTime,
                experts: this.experts()
            }],
            dsl: {
                protocol: protocol,
                address: {}
            }
        };
        if (this.friendlyName().length) {
            entryData.descriptions[0].friendlyName = this.friendlyName();
        }

        if (this.requestAccess().length) {
            entryData.accessInstructions = [{
                __creatorId: $tokyo.user.email,
                modifiedTime: this.createdTime,
                mimeType: "text/html",
                content: this.requestAccess()
            }]
        }

        this.inputFields().forEach((field: Interfaces.IFieldType) => {
            var path: string = (<Interfaces.IBindableInputParameters>field.editFormParams).bindingPath;
            var fieldView = ko.dataFor(document.getElementById(path));
            var value: string = fieldView.value();
            fieldView.value("");
            utilities.addValueToObject(entryData, path, value);
        });

        if (this.authentication()) {
            entryData.dsl.authentication = this.authentication().name;
        }
        return entryData;
    }

    private reset(): void {
        this.logger.logInfo("resetting manual entry");
        this.sourceName("");
        this.friendlyName("");
        this.description("");
        this.isInvalid(false);
        this.sourceNameError(false);
    }

    submitEntry(): JQueryPromise<string> {
        var entryData: Interfaces.IManualEntry = this.buildSource();
        this.logger.logInfo("create manual entry", entryData);
        this.reset();
        return catalogService.createCatalogEntry(SourceTypes.getObjectType(this.sourceType(), this.objectType()).rootType, entryData);
    }

    isValid(): boolean {
        var isValid = true;
        if (this.sourceName().trim() === "") {
            this.sourceNameError(true);
            isValid = false;
        }
        this.inputFields().forEach((field: Interfaces.IFieldType) => {
            var path: string = (<Interfaces.IBindableInputParameters>field.editFormParams).bindingPath;
            var fieldView: Interfaces.IInput = ko.dataFor(document.getElementById(path));
            var value: string = fieldView.value();
            if (!fieldView.validate()) {
                isValid = false;
            }
        });
        if (!isValid) {
            $("#manual-entry .scrollable-content").scrollTop(0);
        }
        this.isInvalid(!isValid);
        return isValid;
    }

    public get assetCreatedTime(): Date {
        return this.createdTime;
    }
}