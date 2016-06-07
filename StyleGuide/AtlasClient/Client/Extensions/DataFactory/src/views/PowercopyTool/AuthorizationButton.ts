import Constants = require("./Constants");
import Net = require("./Net");
import Common = require("./Common");
import Logger = require("./Logger");
import Util = require("../../scripts/Framework/Util/Util");

interface IOAuthQuery {
    subscriptionId: string;
    resourceGroupName: string;
    factoryName: string;
    linkedServiceType: string;
    redirectUri: string;
}

interface IOauthEndpointResponse {
    sessionId: string;
    endpoint: string;
}

let authWindow;
function watchWindow() {
    if (authWindow.closed) {
        AuthorizationButtonViewModel.authorizationPopupOpened(false);
    } else {
        setTimeout(watchWindow, 1000);
    }
}

export class AuthorizationButtonViewModel {
    public static authorizationPopupOpened = ko.observable(false);

    public authorized = ko.observable(false);
    private linkedServiceTemplate: Common.IEntity;
    private authorizationMessage: string;

    private oauthEndpoint: IOauthEndpointResponse;
    private checkCookieInterval: number;
    private oauthParameters: IOAuthQuery;
    private buttonEnabled = ko.computed(() => !this.authorized() && !AuthorizationButtonViewModel.authorizationPopupOpened());

    public dispose() {
        this.buttonEnabled.dispose();
        window[Constants.oauthbuttonCallback] = undefined;
    }

    private getOAuthCookie() {
        let oauthCookie = document.cookie.match(new RegExp("oAuthToken" + "=(.*?)($|;)"));
        return oauthCookie && oauthCookie[1];
    };

    private deleteOAuthCookie() {
        document.cookie = Constants.oAuthToken + "=; expires=" + new Date(0).toUTCString() + "; path=/";
    };

    private setAuthorized(authorizationUrl: string) {
        this.linkedServiceTemplate.properties.typeProperties[Constants.sessionId] = this.oauthEndpoint.sessionId;
        this.linkedServiceTemplate.properties.typeProperties[Constants.authorization] = authorizationUrl;
        this.authorized(true);
        clearInterval(this.checkCookieInterval);
        AuthorizationButtonViewModel.authorizationPopupOpened(false);
    }

    /* tslint:disable:no-unused-variable */
    private authorize() {
        /* tslint:enable:no-unused-variable */
        let width = screen.width / 2;
        let height = screen.height / 2;
        let left = width / 4;
        let top = height / 4;

        let options = "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes,"
            + `resizable=yes, copyhistory=no, width=${width}, height=${height},top=${top},left=${left}`;

        authWindow = window.open("", "", options);
        watchWindow();
        AuthorizationButtonViewModel.authorizationPopupOpened(true);

        window[Constants.oauthbuttonCallback] = (href) => {
            this.setAuthorized(href);
            authWindow.close();
        };

        this.checkCookieInterval = setInterval(() => {
            let cookie = this.getOAuthCookie();
            if (cookie) {
                this.setAuthorized(cookie);
                this.deleteOAuthCookie();
            }
        }, 1000);

        Net.sendMessage("/api/oauth", "GET", this.oauthParameters).then((result: IOauthEndpointResponse) => {
            this.oauthEndpoint = result;
            authWindow.location.href = this.oauthEndpoint.endpoint;
        }).fail(reason => {
            let error = Util.getAzureError(reason).message;
            alert("Unable to get authorization URL, please close popup window and hit authorize button again, error details: " + error);
            Logger.logger.logError(error);
        });
    }

    constructor(linkedServiceTemplate: Common.IEntity, subscriptionId: string, resourceGroup: string, factoryName: string, linkedServiceName: string) {
        this.linkedServiceTemplate = linkedServiceTemplate;
        this.authorizationMessage = "Linked service " + linkedServiceName + " requires your authorization";

        this.oauthParameters = {
            factoryName: factoryName,
            subscriptionId: subscriptionId,
            resourceGroupName: resourceGroup,
            linkedServiceType: "AzureDataLakeStore",
            redirectUri: `https://${document.domain}/oauthredirect`
        };
    }
}
