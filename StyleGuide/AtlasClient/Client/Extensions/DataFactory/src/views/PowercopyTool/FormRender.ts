/* tslint:disable:no-unused-variable */
import Constants = require("./Constants");
import DataTypeConstants = require("./DataTypeConstants");
import Common = require("./Common");
import Validation = require("../../bootstrapper/Validation");
import ValidationFields = require("../../bootstrapper/FormFields");
import ValidatedSelectBoxViewModel = ValidationFields.ValidatedSelectBoxViewModel;
import Configuration = require("./Configuration");
import Net = require("./Net");
import SubscriptionData = require("./SubscriptionData");
import ISubscription = SubscriptionData.ISubscription;
import FactoryEntities = require("./FactoryEntities");
import Util = require("../../scripts/Framework/Util/Util");
import ArmService = require("../../scripts/Services/AzureResourceManagerService");
// import CredentialEncryption = require("./CredentialEncryption");
/* tslint:enable:no-unused-variable */

let parameterRegex = /<([^>]+)>/g;
let accessToken = "";

export interface IValue {
    value: KnockoutObservable<string>;
}

export interface IFormField {
    name: string;
    displayName: string;
    type: string;
    hasTestConnection: boolean;
    box: ValidationFields.ValidatedBoxViewModel<string>;
}

export interface IResource {
    name: string;
    id: string;
    location: string;
}

export interface IDatabaseProperties {
    edition: string;
}

export interface IDatabaseResource extends IResource {
    properties: IDatabaseProperties;
}

export interface IResourceObject {
    value: IResource[];
}

export interface IConnectionTestResult {
    isValid: boolean;
    errorMessage: string;
}

export interface IFormRenderingResult {
    formFields: IFormField[];
    validateable: KnockoutObservable<Validation.IValidatable>;
    region: KnockoutObservable<string>;
    // encryptor: CredentialEncryption.CredentialEncryptionViewModel;
}

export interface IGatewayProperties {
    status: string;
}

export interface IGatewayResponse {
    name: string;
    properties: IGatewayProperties;
}

export interface IGatewayResponseWrapper {
    value: IGatewayResponse[];
}

export interface IConnectible {
    formFields: IFormField[];
    dataType: string;
    region: string;
    variant?: string;
    linkedServiceName: string;
}

export function loadResources(subscriptions: ISubscription[], resourceTypes: string[]): Q.Promise<IResource[]> {
    let promises: Q.Promise<IResourceObject>[] = [];
    subscriptions.forEach(s => {
        resourceTypes.forEach(rt => {
            let promise = Net.sendMessage<IResourceObject>("/api/Resource", "GET", { subscriptionId: s.subscriptionId, resourceType: rt });
            promises.push(promise);
            promise.fail(reason => {
                // TODO: log failure
            });
        });
    });
    return Q.allSettled(promises).then((promiseStates: Q.PromiseState<IResourceObject>[]) => {
        let resourceList: IResource[] = [];

        for (let i = 0; i < promiseStates.length; i++) {
            if (promiseStates[i].state === "fulfilled") {
                resourceList = resourceList.concat(promiseStates[i].value.value);
            }
        }

        resourceList.sort((a, b) => {
            // resource names are unique so we don't handle that case here
            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
        });
        return resourceList;
    });
}

export function populateOptions(resources: IResource[], optionsToPopulate: KnockoutObservableArray<ValidationFields.IOption>) {
    let options: ValidationFields.IOption[] = [];
    resources.forEach(r => {
        options.push({ displayText: r.name, value: r.id });
    });
    optionsToPopulate(options);
}

function processAzureResourceFillConfig(box: ValidationFields.ValidatedSelectBoxViewModel<string>, resourceTypes: string[], region: KnockoutObservable<string>) {
    let resources: IResource[];
    SubscriptionData.loaded.promise.then(() => {
        loadResources(SubscriptionData.subscriptions, resourceTypes).then(resourceResponse => {
            resources = resourceResponse;
            populateOptions(resourceResponse, box.optionList);
            ko.computed(() => {
                if (!box.options.visible()) {
                    region(undefined);
                } else if (box.value()) {
                    let targetResource = resources.filter(rc => rc.id === box.value())[0];
                    region(targetResource.location);
                }
            });
        });
    });
}

export function getLastSegment(input: string): string {
    let match = input.match("[^/]+$");
    if (match && match.length > 0) {
        return match[0];
    } else {
        return "";
    }
}

function getSegment(input: string, segmentIndex: number): string {
    let inputSplit = input.split("/");
    if (!inputSplit[0]) {
        inputSplit.shift();
    }
    return inputSplit[segmentIndex];
}

export function getFieldByName(formFields: IFormField[], name: string, throwWhenNotFound = true): IFormField {
    let matchingFields = formFields.filter(ff => ff.name === name);
    if (matchingFields.length > 0) {
        return matchingFields[0];
    }
    if (throwWhenNotFound) {
        throw "Field" + name + " not found";
    }
    return undefined;
}

interface IKeys {
    primaryKey?: string;
    secondaryKey?: string;
    key1?: string;
    key2?: string;
}
let getKeyPromises: { [accountId: string]: Q.Promise<IKeys> } = {};

function fillTemplate(template: string, formFields: IFormField[]): string {
    if (typeof template !== "string") {
        template = JSON.stringify(template);
    }
    template = template.replace(Constants.tokenTemplateTag, accessToken);
    let toReplace = template.match(parameterRegex) || [];
    toReplace.forEach(fieldName => {
        let nameAndProcess = getFieldNameAndProcessingMethod(fieldName);
        let field = getFieldByName(formFields, nameAndProcess.name);
        let fieldValue = field.box.options.visible() ? field.box.value() : "";
        if (nameAndProcess.processMethod && fieldValue) {
            if (nameAndProcess.processMethod[0] === "/") {
                let regex: RegExp = new RegExp(nameAndProcess.processMethod.substring(1), "i");
                let matches = fieldValue.match(regex);
                fieldValue = matches[matches.length - 1];
            } else if (nameAndProcess.processMethod === "getLastSegment") {
                fieldValue = getLastSegment(fieldValue);
            } else if (nameAndProcess.processMethod === "getSubscription") {
                fieldValue = getSegment(fieldValue, 1);
            } else if (nameAndProcess.processMethod === "getResourceGroup") {
                fieldValue = getSegment(fieldValue, 3);
            } else {
                throw "Unknown process method: " + nameAndProcess.processMethod;
            }
        }
        template = template.replace(fieldName, fieldValue);
    });
    return template;
}

function resolveIfStatement(ifStatement: string, formFields: IFormField[]): string {
    let parameters = ifStatement.match(/\$\$IF\({(.+)},{(.*)},{(.*)}\)/);
    if (parameters.length !== 4) {
        throw "incorrect if statement";
    }
    let resolvedCondition = fillTemplate(parameters[1], formFields);
    let isTrue = smartEval(resolvedCondition);
    return isTrue ? fillTemplate(parameters[2], formFields) : fillTemplate(parameters[3], formFields);
}

export function fillStringTemplate(input, formFields: IFormField[]) {
    let ifMatches = input.match(/\$\$IF\({[^}]+},{[^}]*},{[^}]*}\)/g) || [];

    ifMatches.forEach(match => {
        input = input.replace(match, resolveIfStatement(match, formFields));
    });
    return fillTemplate(input, formFields);
}

export function fillObjectTemplate(originalTemplate: Object, formFields: IFormField[]) {
    let template = $.extend(true, {}, originalTemplate);
    for (var key in template) {
        if (typeof template[key] === "string") {
            template[key] = fillStringTemplate(template[key], formFields);
        } else if (template[key] instanceof Object) {
            template[key] = fillObjectTemplate(template[key], formFields);
        }
    }
    return template;
}

function smartEval(expression: string): boolean {
    try {
        /* tslint:disable:no-eval */
        return eval(expression);
        /* tslint:enable:no-eval */
    } catch (e) {
        throw "Eval failed, expression: '" + expression + "', message:" + e.message;
    }
}

function processVariants(formFields: IFormField[], config: Configuration.IFormFieldConfig[], validateable: KnockoutObservable<Validation.IValidatable>) {
    let basicValidations: Validation.IValidatable[] = [];
    let delayedValidation: Validation.IValidatable;

    if (formFields.length !== config.length) {
        throw `Form fields count: ${formFields.length}, != configurations count: ${config.length}`;
    }
    for (let i = 0; i < formFields.length; i++) {
        if (config[i].variant && !formFields[i].box.value()) {
            return;
        }
    }

    for (let i = 0; i < formFields.length; i++) {
        let condition = config[i].condition;
        let relevant = true;
        if (condition) {
            let conditionWithResolvedParameters = fillTemplate(condition, formFields);
            relevant = smartEval(conditionWithResolvedParameters);
        }
        formFields[i].box.options.visible(relevant);
        if (relevant) {
            if (formFields[i].hasTestConnection) {
                delayedValidation = formFields[i].box;
            } else if (formFields[i].box.hasValidation()) {
                basicValidations.push(formFields[i].box);
            }
        }
    }
    validateable(Common.ValidateableMerge(basicValidations, delayedValidation));
}

export function renderForm(dataType: string): IFormRenderingResult {
    let formFieldsConfig = Configuration.copyConfig[dataType].formFields;
    let validateable = ko.observable<Validation.IValidatable>();
    let region = ko.observable<string>();

    let formFields: IFormField[] = [];

    formFieldsConfig.forEach(fieldConfig => {
        let type = fieldConfig.type;
        let box: ValidationFields.ValidatedBoxViewModel<string> = null;
        let validations: ((value) => Q.Promise<Validation.IValidationResult>)[] = [];
        let hasTestConnection = false;
        if (fieldConfig.validation) {
            if (fieldConfig.validation["testConnection"]) {
                hasTestConnection = true;
                let connectionTest = () => {
                    let dsr = Configuration.copyConfig[dataType].datasourceReference;
                    let dsc = Configuration.copyConfig[dataType].datasourceCredential;

                    if (!shouldTestConnection(dsr, dsc, formFields)) {
                        return Q({
                            valid: false,
                            message: "Some of the required parameters are not provided"
                        });
                    }
                    let connectible: IConnectible = {
                        dataType: dataType,
                        formFields: formFields,
                        region: region(),
                        linkedServiceName: null
                    };
                    return testConnection(connectible);
                };
                validations.push(connectionTest);
            }
            if (fieldConfig.validation["regex"]) {
                validations.push(Common.regexValidation(fieldConfig.validation["regex"]));
            }
        }

        let formFieldOptions: ValidationFields.IFormFieldOptions<string> = {
            label: fieldConfig.displayText,
            validations: validations,
            visible: ko.observable(false),
            required: true
        };
        if (type === "password" || type === "text") {
            formFieldOptions.placeholder = fieldConfig.placeholder;
            box = new ValidationFields.ValidatedBoxViewModel<string>(formFieldOptions);
        } else if (type === "computed") {
            box = new ValidationFields.ValidatedBoxViewModel<string>(formFieldOptions);
        } else if (type === "dropdown") {
            /* tslint:disable:no-var-keyword */
            var optionsList = ko.observableArray<ValidationFields.IOption>();
            /* tslint:enable:no-var-keyword */
            box = new ValidatedSelectBoxViewModel(optionsList, formFieldOptions);
            optionsList([{ value: "", displayText: "Loading..." }]);
            if (fieldConfig.fill && fieldConfig.fill["azureResource"]) {
                let resourceTypes: string[] = fieldConfig.fill["azureResource"];
                processAzureResourceFillConfig(<ValidatedSelectBoxViewModel<string>>box, resourceTypes, region);
            } else if (fieldConfig.name === "gateway") {
                let gatewayQuery: ArmService.IDataFactoryResourceBaseUrlParams = {
                    subscriptionId: FactoryEntities.subscriptionId,
                    resourceGroupName: FactoryEntities.resourceGroup,
                    factoryName: FactoryEntities.factoryName
                };
                Net.armService.listGateways(gatewayQuery).then((result: IGatewayResponseWrapper) => {
                    let onlineGateways = result.value.filter(r => r.properties.status === "Online");
                    let gatewayOptions: ValidationFields.IOption[] = onlineGateways.map(g => { return { value: g.name, displayText: g.name }; });
                    optionsList(gatewayOptions);
                });
            } else if (fieldConfig.options) {
                optionsList(fieldConfig.options);
            }
        } else {
            throw "Unknown form field type: " + type;
        }

        formFields.push({
            displayName: fieldConfig.displayText,
            type: fieldConfig.type,
            name: fieldConfig.name,
            hasTestConnection: hasTestConnection,
            box: box
        });
    });

    // custom
    if (dataType === DataTypeConstants.blobStorage || dataType === DataTypeConstants.azureTable) {
        let accountField = getFieldByName(formFields, "accountdropdown");
        let keyField = getFieldByName(formFields, "fetchedkey");
        accountField.box.value.subscribe(val => {
            if (val) {
                if (!getKeyPromises[val]) {
                    getKeyPromises[val] = Net.sendMessage("/api/resource/liststorageaccountkeys", "POST", { requestUrl: val + "/listkeys" });
                }
                getKeyPromises[val].then(keys => {
                    if (val === accountField.box.value()) {
                        keyField.box.value(keys.primaryKey || keys.key1);
                    }
                });
            }
        });

        accountField.box.setValidation([account => {
            if (account) {
                return getKeyPromises[account].then(() => {
                    return Q({
                        valid: true,
                        message: ""
                    });
                }, reason => {
                    return Q({
                        valid: false,
                        message: "Couldn't get access key: " + Util.getAzureError(reason).message
                    });
                });
            } else {
                return Q({
                    valid: false,
                    message: "Storage account not selected."
                });
            }
        }]);
        accountField.hasTestConnection = true;
    } else if ((dataType === DataTypeConstants.sqlAzure || dataType === DataTypeConstants.sqlDW) /* && getFieldByName(formFields, "selectionmethod").box.value() === "azure"*/) {
        let serverField = getFieldByName(formFields, "serverdropdown");
        let databaseField = getFieldByName(formFields, "databasedropdown");
        let _optionList = (<ValidatedSelectBoxViewModel<string>>databaseField.box).optionList;
        serverField.box.value.subscribe(serverId => {
            _optionList([{ value: "", displayText: "Loading..." }]);
            if (serverId) {
                Net.sendMessage<IResourceObject>("/api/resource/listdatabases", "GET", { requestUrl: serverId + "/databases" }).then((result) => {
                    if (serverId === serverField.box.value()) {
                        let filterFunc = (resource: IResource): boolean => {
                            let databaseResource = <IDatabaseResource>resource;
                            if (dataType === DataTypeConstants.sqlAzure) {
                                return databaseResource.properties.edition !== Constants.dataWarehouseEdition;
                            } else {
                                return databaseResource.properties.edition === Constants.dataWarehouseEdition;
                            }
                        };
                        let dbArray: IResource[] = (<IResource[]>result.value).filter(db => db.name.toUpperCase() !== "MASTER").filter(filterFunc);
                        dbArray.sort((a, b) => {
                            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
                        });

                        let options: ValidationFields.IOption[] = [];
                        dbArray.forEach(db => {
                            options.push({ displayText: db.name, value: db.name });
                        });
                        if (options.length === 0) {
                            let dbType = "data warehouses";
                            if (dataType === DataTypeConstants.sqlAzure) {
                                dbType = "standard databases";
                            }
                            options.push({ displayText: "Selected server contains no " + dbType, value: "" });
                        }
                        _optionList(options);
                    }
                }, reason => {
                    _optionList([{ value: "", displayText: "Unable to load databases" }]);
                });
            }
        });
    }

    formFieldsConfig.filter(ff => !!ff.variant).forEach(variantField => {
        getFieldByName(formFields, variantField.name).box.value.subscribe(() => {
            processVariants(formFields, formFieldsConfig, validateable);
        });
    });
    processVariants(formFields, formFieldsConfig, validateable);

    // let credentialEncryptor: CredentialEncryption.CredentialEncryptionViewModel = null;
    // let encryptionRequest: Configuration.ICredentialEncryptionRequest = Configuration.copyConfig[dataType].credentialEncryptionRequest;
    // if (encryptionRequest) {
    //     credentialEncryptor = new CredentialEncryption.CredentialEncryptionViewModel(encryptionRequest, formFields);
    // }

    return {
        formFields: formFields,
        validateable: validateable,
        region: region
        // encryptor: credentialEncryptor
    };
}

interface IFieldNameAndProcessMethod {
    name: string;
    processMethod: string;
}

function getFieldNameAndProcessingMethod(templateName: string): IFieldNameAndProcessMethod {
    let fieldName = templateName.substring(1, templateName.length - 1);
    let processMethod = undefined;
    let fieldSplit = fieldName.split("-");
    if (fieldSplit.length === 2) {
        fieldName = fieldSplit[0];
        processMethod = fieldSplit[1];
    }
    return {
        name: fieldName,
        processMethod: processMethod
    };
}

function shouldTestConnection(datasourceReference: Configuration.IDatasourceReference, datasourceCredential: Configuration.IDatasourceCredential, formFields: IFormField[]): boolean {
    let parameters = JSON.stringify(datasourceReference).match(parameterRegex) || [];
    parameters = parameters.concat(JSON.stringify(datasourceCredential).match(parameterRegex) || []);
    let shouldTest = true;
    for (let i = 0; i < parameters.length && shouldTest; i++) {
        let field = getFieldByName(formFields, getFieldNameAndProcessingMethod(parameters[i]).name);
        shouldTest = !field.box.options.visible() || !!field.box.value();
        // shouldTest = !!getFieldByName(formFields, getFieldNameAndProcessingMethod(parameters[i]).name).box.value();
    }
    return shouldTest;
}

export function createConnectionPayload(connectible: IConnectible, dsrString?: string): Configuration.IConnectionPayload {
    let protocol = connectible.dataType === DataTypeConstants.azureTable ? Configuration.azureTables : null;
    if (!connectible.linkedServiceName) {
        let gatewayField = getFieldByName(connectible.formFields, "gateway", false);
        let gatewayName = undefined;
        if (gatewayField) {
            gatewayName = gatewayField.box.value();
        }
        let datasourceReference = Configuration.copyConfig[connectible.dataType].datasourceReference;
        let datasourceCredential = Configuration.copyConfig[connectible.dataType].datasourceCredential;
        datasourceReference = $.extend(true, {}, datasourceReference);
        datasourceCredential = $.extend(true, {}, datasourceCredential);
        return {
            datasourceReference: dsrString || JSON.stringify(fillObjectTemplate(datasourceReference, connectible.formFields)),
            datasourceCredential: JSON.stringify(fillObjectTemplate(datasourceCredential, connectible.formFields)),
            gatewayName: gatewayName,
            resourceId: getResourceId(),
            region: connectible.region,
            linkedServiceName: undefined,
            protocol: protocol
        };
    } else {
        return {
            datasourceReference: dsrString,
            datasourceCredential: undefined,
            gatewayName: undefined,
            resourceId: getResourceId(),
            region: undefined,
            linkedServiceName: connectible.linkedServiceName,
            protocol: protocol
        };
    }
}

export interface INavTable {
    name: string;
    datasourceReference: string;
    isLeafNode: boolean;
}

function getResourceId() {
    return `subscriptions/${FactoryEntities.subscriptionId}/resourcegroups/${FactoryEntities.resourceGroup}/providers/Microsoft.DataFactory/dataFactories/${FactoryEntities.factoryName}`;
}

export function getNavTable(connectible: IConnectible, datasourceReference?: string): Q.Promise<INavTable[]> {
    let navTablePayload = createConnectionPayload(connectible, datasourceReference);
    let requestPayload: Configuration.IRequestPayload = {
        connectionPayload: navTablePayload
    };
    return Net.sendMessage<INavTable[]>(Constants.queryUrl + "/navtable", "POST", null, requestPayload);
}

export type IPreview = Common.IPreview;
export type IPreviewAndSchema = Common.IPreviewAndSchema;
let typeConverter: { [s: string]: string } = {
    "byte": "Int16"
};

export function getTableSchema(connectible: IConnectible, datasourceReference?: string, query?: Configuration.IUserQuery): Q.Promise<Common.IColumn[]> {
    let browseSchemaPayload = createConnectionPayload(connectible, datasourceReference);
    let requestPayload: Configuration.IRequestPayload = {
        connectionPayload: browseSchemaPayload,
        userQuery: query
    };
    return Net.sendMessage<Common.IColumn[]>(Constants.queryUrl + "/tableschema", "POST", null, requestPayload).then(schema => {
        schema.forEach(column => {
            let convertedType = typeConverter[column.type.toLowerCase()];
            if (convertedType) {
                column.type = convertedType;
            }
        });
        return schema;
    });
}

export function getPreview(connectible: IConnectible, datasourceReference?: string, query?: Configuration.IUserQuery): Q.Promise<IPreview> {
    let previewPayload = createConnectionPayload(connectible, datasourceReference);
    let requestPayload: Configuration.IRequestPayload = {
        connectionPayload: previewPayload,
        userQuery: query
    };
    return Net.sendMessage<IPreview>(Constants.queryUrl + "/preview", "POST", null, requestPayload);
}

export function getFilePreviewAndSchema(connectible: IConnectible, datasourceReference: string, fileProperties: Common.IFileFormat) {
    let connectionPayload = createConnectionPayload(connectible, datasourceReference);
    let filePreviewPayload: Configuration.IRequestPayload = {
        connectionPayload: connectionPayload,
        fileProperties: fileProperties
    };
    return Net.sendMessage<IPreviewAndSchema>(Constants.queryUrl + "/GetFilePreviewAndSchema", "POST", null, filePreviewPayload);
}

let getToken = () => Microsoft.DataStudio.Managers.AuthenticationManager.instance.getAccessToken().then(token => accessToken = token);

setInterval(() => {
    getToken();
}, 30000);

getToken();

export interface IRegion {
    name: string;
}

export function getLinkedServiceRegion(connectible: IConnectible): Q.Promise<IRegion> {
    let regionPayload = createConnectionPayload(connectible);
    let requestPayload: Configuration.IRequestPayload = {
        connectionPayload: regionPayload
    };
    return Net.sendMessage<IRegion>(Constants.queryUrl + "/linkedserviceregion", "POST", null, requestPayload);
}

export function testConnection(connectible: IConnectible): Q.Promise<Validation.IValidationResult> {
    let connectionTestPayload = createConnectionPayload(connectible);
    return Net.sendMessage(Constants.queryUrl + "/testconnection", "POST", null, { connectionPayload: connectionTestPayload }).then((result: IConnectionTestResult) => {
        if (result.isValid) {
            return Q({
                valid: true,
                message: ""
            });
        } else {
            return Q({
                valid: false,
                message: result.errorMessage
            });
        }
    }, reason => {
        return Q({
            valid: false,
            message: "Connection could not be tested, internal server error occured"
        });
    });
}
