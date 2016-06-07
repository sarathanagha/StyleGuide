import FormRender = require("./FormRender");
import Configuration = require("./Configuration");
import FactoryEntities = require("./FactoryEntities");
import Net = require("./Net");
import Logger = require("./Logger");
import Util = require("../../scripts/Framework/Util/Util");

interface IClickonceResponse {
    clickonceLink: string;
    requestId;
}

interface ICredentialResponse {
    authType: number;
    credential: string;
    isCredentialSet: boolean;
}

export class CredentialEncryptionViewModel {
    private requestTemplate: Configuration.ICredentialEncryptionRequest;
    private formFields: FormRender.IFormField[];
    private encryptLinkVisible = ko.observable(false);
    private clickonceLink = ko.observable("");
    private requestId: string;
    private polling = ko.observable(false);
    private credentialSet = ko.observable(false);

    private pollForCredential() {
        if (this.polling()) {
            Net.sendMessage(`/api/ClickOnceHelper/GetEncryptedCredential?RequestId=${this.requestId}`, "GET").then((credResponse: ICredentialResponse) => {
                if (credResponse.isCredentialSet) {
                    this.polling(false);
                    FormRender.getFieldByName(this.formFields, "encryptedcredential").box.value(credResponse.credential);
                    FormRender.getFieldByName(this.formFields, "encryptedcredentialauthentication").box.value(credResponse.authType.toString());
                    this.credentialSet(true);
                }
            }).fail(reason => {
                Logger.logger.logError("Failed to poll for credential encryption request status: " + Util.getAzureError(reason).message);
            }).finally(() => {
                setTimeout(this.pollForCredential.bind(this), 1000);
            });
        }
    }
    /* tslint:disable:no-unused-variable */
    private sendRequest() {
        /* tslint:enable:no-unused-variable */
        let request: Configuration.ICredentialEncryptionRequest = FormRender.fillObjectTemplate(this.requestTemplate, this.formFields);
        request.GatewayLocation = FactoryEntities.factoryLocation;
        request.ScopeId = FactoryEntities.subscriptionId;
        let emptyProperties = [];
        for (var key in request) {
            if (!request[key] || request[key] === "undefined") {
                emptyProperties.push(key);
            }
        }
        if (emptyProperties.length > 0) {
            alert("Some of the required properties for credential encryption have not been set: " + emptyProperties.join(", "));
        } else {
            Net.sendMessage("/api/ClickOnceHelper/CreateEncryptCredentialsRequest", "POST", null, request).then((clickOnceResponse: IClickonceResponse) => {
                this.clickonceLink(clickOnceResponse.clickonceLink);
                this.polling(true);
                this.requestId = clickOnceResponse.requestId;
                setTimeout(this.pollForCredential.bind(this), 5000);
            }).fail(reason => {
                Logger.logger.logError("Failed to create credential encryption request: " + Util.getAzureError(reason).message);
            });
        }
    }

    constructor(requestTemplate: Configuration.ICredentialEncryptionRequest, formFields: FormRender.IFormField[]) {
        this.requestTemplate = requestTemplate;
        this.formFields = formFields;
        FormRender.getFieldByName(this.formFields, "encrypt").box.value.subscribe(encryptValue => {
            if (encryptValue === "true") {
                this.encryptLinkVisible(true);
            } else {
                this.encryptLinkVisible(false);
            }
        });
    }
}
