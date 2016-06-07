/// <reference path="../../../references.d.ts" />
/// <reference path="./LoggerFactory.ts" />

import ShellContext = Microsoft.DataStudio.Application.ShellContext;
import Router = Microsoft.DataStudio.Application.Router;
import Logging = Microsoft.DataStudio.Diagnostics.Logging;
// TODO paverma This approach has a limitation that baseurl https://zzz/ should be as light as possible, since adal.js will create multiple redirects to it.
// Consider loading the authentication part separately from the app so as have minimal load.

interface IStringMap<T> { [key: string]: T };
interface ITenantObject {
    tenantId: string;
    tenant: string
};

module Microsoft.DataStudio.Managers {
    class AuthenticationManagerImpl implements Microsoft.DataStudio.Managers.IAuthenticationManager {
        private static _instance: AuthenticationManagerImpl = new AuthenticationManagerImpl();
        private static tenantsListStorageKey: string = "tenantsList";
        private static subscriptionsDictionaryStorageKey: string = "subscriptionsDictionary";
        private static azureResourceManagerUrl: string = Microsoft.DataStudio.Application.ResourceConstants.AZURE_RESOURCE_URL;
        private static azureResourceManagerApiVersion: string = "2015-11-01";
        private static accessTokenRedirectUrl: string = window.location.origin + "/accessToken.html";

        private currentUser: Microsoft.DataStudio.Model.IUser = null;
        // TODO (paverma): Create an interface file for adal, or at least for the constructs that are being used by us.
        private authContext: any;
        private defaultTenant: string;
        private tenantListDeferred: Q.Deferred<ITenantObject[]>;
        private subscriptionToTenantMapDeferred: Q.Deferred<IStringMap<{ tenantId: string; displayName: string }>>;
        private isAuthRelatedCallback: boolean;
        private accessTokenDeferred: Q.Deferred<string> = Q.defer<string>();

        public waitingToRenewToken: boolean = false;
        private authLogger: Logging.Logger;
        constructor() {
            if (AuthenticationManagerImpl._instance) {
                throw new Error("Error: Instantiation failed: USE [Microsoft.DataStudio.Managers.AuthenticationManager.instance] instead of new.");
            }
            else {
                AuthenticationManagerImpl._instance = this;
            }

            this.authLogger = Application.LoggerFactory.getLogger({ loggerName: "AuthenticationManager" });
        }

        // Handle auth related callbacks, create user if valid.
        private processUserContext(): void {
            let self = this;
            if (self.currentUser) {
                return; // The user context has been processed already.
            }
            self.isAuthRelatedCallback = self.authContext.isCallback(window.location.hash);
            if (self.isAuthRelatedCallback) {
                // This modifies the url, hence we need to save the info of whether it was an auth related callback ir not.
                self.authContext.handleWindowCallback();
            }

            let loginError = self.authContext.getLoginError();
            if (loginError) {
                this.authLogger.logError("Login Error", { error: loginError });
            } else {
                let user: any = self.authContext.getCachedUser();
                if (user !== null) {
                    self.currentUser = {
                        email: user.userName,
                        name: user.profile.given_name,
                        puid: AuthHelpers.extractPuid(self.authContext._getItem(self.authContext.CONSTANTS.STORAGE.IDTOKEN)),
                        token: null, //unused?
                        sessionId: self.authContext._getItem(self.authContext.CONSTANTS.STORAGE.STATE_LOGIN),
                        subscriptions: null // Filled in the getUserSubscriptions() call below
                    };
                }
                //Deleted Router.navigate(Microsoft.DataStudio.Application.AuthConstants.AUTH_FAILURE_POSTLOGIN_PAGE) for the url is empty
            }
        }

        public static get instance(): Microsoft.DataStudio.Managers.IAuthenticationManager {
            return AuthenticationManagerImpl._instance;
        }

        public initializeAsync(tenantId?: string): Q.Promise<any> {
            let self = this;
            let resultDeferred: Q.Deferred<any> = Q.defer();
            self.defaultTenant = tenantId;

            let postLogoutUrl = window.location.toString();
            let authConfig: Microsoft.DataStudio.Application.IAdalConfigEntry = new Microsoft.DataStudio.Application.AuthConfigImpl(
                Microsoft.DataStudio.Application.AuthConstants.AUTH_INSTANCE_URL, //instance
                Microsoft.DataStudio.Application.AuthConstants.AUTH_CLIENTID, //  client id of the AAD application 
                Microsoft.DataStudio.Application.AuthConstants.AUTH_TENANT, // tenant
                postLogoutUrl,
                postLogoutUrl,
                Microsoft.DataStudio.Application.AuthConstants.AUTH_STORAGE_MODE);
            self.authContext = new AuthenticationContext(authConfig);

            let currentUser: Microsoft.DataStudio.Model.IUser = self.getCurrentUser();
            if (!currentUser) {
                // Clear tenants list and subscription dictionary. this is required so as to be able to load new access changes of the user.
                localStorage.removeItem(AuthenticationManagerImpl.tenantsListStorageKey);
                localStorage.removeItem(AuthenticationManagerImpl.subscriptionsDictionaryStorageKey);
                self.login();
                // Doesn't matter, as the user is about to be redirected for logging in.
                resultDeferred.reject(true);
                return resultDeferred.promise;
            }

            if (self.isAuthRelatedCallback || window.location.href === AuthenticationManagerImpl.accessTokenRedirectUrl) {
                // The token has already been extracted and its of no use to process this path/app any further.
                resultDeferred.reject(true);
                return resultDeferred.promise;
            }

            if (tenantId) {
                return Q(true);
            } else {
                return self.getUserSubscriptions();
            }
        }


        // Signin method
        public login = (): void => {
            this.authLogger.logInfo("Login initiated");
            this.authContext.login();
        }

        // Signout method
        public logout = (): void => {
            this.authLogger.logInfo("Logout initiated");
            this.authContext.logOut();
        }

        // getCurrentUser 
        public getCurrentUser(): Microsoft.DataStudio.Model.IUser {
            this.processUserContext();
            return this.currentUser;
        }

        // A separate promise per auth resource will have to be maintained.
        // TODO (paverma): Assuming that in a fresh application instance, we will be accessing data from the same tenant. Find a way to loosen this assumption.
        public getAccessToken(subscriptionId: string): Q.Promise<string> {
            let self = this;
            if (subscriptionId) {
                subscriptionId = subscriptionId.toLowerCase();
            }

            if (self.accessTokenDeferred.promise.isFulfilled()) {
                self.accessTokenDeferred = Q.defer<string>();
            }

            if (self.defaultTenant) {
                self.updateAccessTokenForTenant(self.defaultTenant);
            } else {
                self.subscriptionToTenantMapDeferred.promise.then((map) => {
                    let tenantId = (map[subscriptionId] && map[subscriptionId].tenantId) ? map[subscriptionId].tenantId : null;
                    if (subscriptionId && !tenantId) {
                        let message: string = "No AD tenant is available for the subscription " + subscriptionId + ". If you recently acquired permissions for this subscription, then please logout and login again.";
                        this.authLogger.logError("Tenant missing for Subscription", { errorDetails: message });
                        self.accessTokenDeferred.reject(message);
                    } else {
                        if (subscriptionId) {
                            self.updateAccessTokenForTenant(tenantId);
                        } else {
                            self.updateAccessTokenForTenant(null);
                        }
                    }
                });
            }
            return self.accessTokenDeferred.promise;
        }

        private updateAccessTokenForTenant(tenantId: string): void {
            let self = this;
            self.authContext.config.redirectUri = AuthenticationManagerImpl.accessTokenRedirectUrl;
            // Ideally, token if available would be from the same tenant as the config, but there is a possibility for mismatch.
            let availableToken = self.authContext.getCachedToken(Microsoft.DataStudio.Application.AuthConstants.AUTH_RESOURCE_NAME);
            let tenantIdOfTokenWithoutRenewal = availableToken ? jwt.decode(availableToken).tid : self.authContext.config.tenant;

            if (tenantId && tenantIdOfTokenWithoutRenewal !== tenantId) {
                self.waitingToRenewToken = true;
                // The token is not from the correct issuer correctly, hence renew it.
                self.authContext.config.tenant = tenantId;
                self.authContext._renewToken(Microsoft.DataStudio.Application.AuthConstants.AUTH_RESOURCE_NAME, (errorResponse, newToken) => {
                    if (errorResponse) {
                        this.authLogger.logError("Renew Token Failed:", { errorDetails: errorResponse });
                        self.accessTokenDeferred.reject(errorResponse);
                    } else {
                        self.accessTokenDeferred.resolve(newToken);
                    }
                    self.waitingToRenewToken = false;
                });
            } else {
                if (!self.waitingToRenewToken) {
                    self.authContext.acquireToken(Microsoft.DataStudio.Application.AuthConstants.AUTH_RESOURCE_NAME, (error, token) => {
                        if (error) {
                            this.authLogger.logError("Aquire Token Failed:", { errorDetails: error });
                            self.accessTokenDeferred.reject(error);
                        } else {
                            self.accessTokenDeferred.resolve(token);
                        }
                    });
                }
            }
        }

        // [TODO] raghum : this is a temporary solution for ADC, to make some 
        // progress in the UI side. This will be removed after we support token with 
        // multiple audience.
        public getAccessTokenADC(subscriptionId?: string): Q.Promise<string> {
            let self = this;

            if (self.accessTokenDeferred.promise.isFulfilled()) {
                self.accessTokenDeferred = Q.defer<string>();
            }

            self.subscriptionToTenantMapDeferred.promise.then((map) => {
                self.authContext.acquireToken("https://datacatalog.azure.com", (error, token) => {
                    if (error) {
                        this.authLogger.logError("Aquire Token Failed:", { errorDetails: error });
                        self.accessTokenDeferred.reject(error);
                    } else {
                        self.accessTokenDeferred.resolve(token);
                    }
                });
            });
            return self.accessTokenDeferred.promise;
        }

        // getUserSubscriptions
        private getUserSubscriptions(): Q.Promise<any> {
            let self = this;
            var done: Q.Deferred<any> = Q.defer<any>();
            // TODO (paverma): This can be parallelized, and should perhaps be moved to server.         
            // Stop the app flow till we get the list of tenants.
            self.tenantListDeferred = Q.defer<ITenantObject[]>();
            // Let the flow continue and parallely try to build the subscription to tenant dictionary. 
            self.subscriptionToTenantMapDeferred = Q.defer<{ [key: string]: { tenantId: string; displayName: string } }>();
            self.subscriptionToTenantMapDeferred.promise.then((subscriptions: any) => {
                self.currentUser.subscriptions = Object.keys(subscriptions).map(subscriptionId => {
                    return {
                        displayName: subscriptions[subscriptionId].displayName,
                        subscriptionid: subscriptionId,
                        access_token: null
                    };
                });
                done.resolve(null);
            });

            let storageTenantsObjs = localStorage.getItem(AuthenticationManagerImpl.tenantsListStorageKey);
            let storageSubscriptionDictionary = localStorage.getItem(AuthenticationManagerImpl.subscriptionsDictionaryStorageKey);
            let loadedSubscriptionMap: boolean = false;
            if (storageTenantsObjs && storageSubscriptionDictionary) {
                // Use the available mapping and avoid the tenant dance.
                try {
                    self.tenantListDeferred.resolve(JSON.parse(storageTenantsObjs));
                    self.subscriptionToTenantMapDeferred.resolve(JSON.parse(storageSubscriptionDictionary));
                    loadedSubscriptionMap = true;
                } catch (ex) {
                    loadedSubscriptionMap = false;
                    this.authLogger.logError("Tenant Mapping Failed:", { error: ex });
                }
            }

            if (!loadedSubscriptionMap) {
                self.authContext.acquireToken(Microsoft.DataStudio.Application.AuthConstants.AUTH_RESOURCE_NAME, (error, token) => {
                    if (error) {
                        this.authLogger.logError("Aquire Token Failed:", { errorDetails: error });
                        return; // Not much to do here. Since we failed to acquire token, no logs can be dispatched.
                    }

                    jQuery.ajax({
                        url: AuthenticationManagerImpl.azureResourceManagerUrl + "/tenants",
                        data: {
                            "api-version": AuthenticationManagerImpl.azureResourceManagerApiVersion
                        },
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    }).then((data: { value: ITenantObject[] }) => {
                        self.tenantListDeferred.resolve(data.value);

                        let tenantObjs = data.value;
                        // Since adal.js has a single context, hence we need to chain "/subscriptions" call one after the other,
                        // so as to not mess up the internal settings.
                        let tenantsDeferred = tenantObjs.map(() => {
                            return Q.defer<void>();
                        });
                        let subscriptionIdToTenantMap: IStringMap<{ tenantId: string; displayName: string }> = {};

                        tenantObjs.forEach((tenantObj, index, array) => {
                            if (index === 0) {
                                self.getSubscriptionsForTenant(tenantObj.tenantId, subscriptionIdToTenantMap, tenantsDeferred[index]);
                            } else {
                                tenantsDeferred[index - 1].promise.then(() => {
                                    // We need to set a timeout of 500 ms, because adal.js internally has a timer where, after it successfully sets the url of the iframe
                                    // it tries check after 500ms if the url was indeed set. If in the meantime, we get the token back from the previous tenant, we will 
                                    // try to get the token for the new tenant, which internally sets the iframe src to be null initially. If the timer for previous tenant
                                    // returned in that period, it will reset the src for previous tenant.
                                    setTimeout(() => {
                                        self.getSubscriptionsForTenant(tenantObj.tenantId, subscriptionIdToTenantMap, tenantsDeferred[index]);
                                    }, 500);
                                });
                            }
                        });

                        Q.all(tenantsDeferred.map((deferred) => {
                            return deferred.promise;
                        })).then(() => {
                            self.subscriptionToTenantMapDeferred.resolve(subscriptionIdToTenantMap);
                            // Save in local storage to avoid doing this again on page refresh.
                            localStorage.setItem(AuthenticationManagerImpl.subscriptionsDictionaryStorageKey, JSON.stringify(subscriptionIdToTenantMap));
                            localStorage.setItem(AuthenticationManagerImpl.tenantsListStorageKey, JSON.stringify(tenantObjs));
                        });

                    }, (reason) => {
                        this.authLogger.logError("Failed to load list of tenants", { errorDetails: reason });
                    });
                });
            }
            return <any>done.promise;
        }

        // getSubscriptionsForTenant
        private getSubscriptionsForTenant(tenantId: string, subscriptionIdToTenantMap: IStringMap<{ tenantId: string; displayName: string; }>, resultDeferred: Q.Deferred<void>): void {
            let self = this;
            if (tenantId) {
                tenantId = tenantId.toLowerCase();
            }
            self.authContext.config.tenant = tenantId;
            self.authContext._renewToken(Microsoft.DataStudio.Application.AuthConstants.AUTH_RESOURCE_NAME, (errorResponse, tempAuthToken) => {
                if (errorResponse) {
                    this.authLogger.logError("Failed to renew token to get subscription for tenant:", { tenantid: tenantId, errorDetails: errorResponse });
                } else {
                    jQuery.ajax({
                        url: AuthenticationManagerImpl.azureResourceManagerUrl + "/subscriptions",
                        data: {
                            "api-version": AuthenticationManagerImpl.azureResourceManagerApiVersion
                        },
                        headers: {
                            "Authorization": "Bearer " + tempAuthToken
                        }
                    }).then((data: { value: { subscriptionId: string, displayName: string, state: string }[] }) => {
                        data.value.forEach((value) => {
                            if (value.state === "Enabled") {
                                subscriptionIdToTenantMap[value.subscriptionId] = { tenantId: tenantId, displayName: value.displayName };
                            }
                        });
                        resultDeferred.resolve(null);
                    }, (reason) => {
                        this.authLogger.logError("Could not get subscriptions for tenant:", { tenant: tenantId });
                        resultDeferred.reject(null);
                    });
                }
            });
        }
    }

    // COMMENT THIS LINE TO SWITCH TO SERVER SIDE OWIN AUTHENTICATION
    AuthenticationManager = AuthenticationManagerImpl;
}
