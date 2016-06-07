/// <reference path="../References.ts" />
module Microsoft.DataStudio.Managers {

    //import Logging = Microsoft.DataStudio.Diagnostics.Logging;
    import AuthModels = Microsoft.DataStudio.Model;
    import TypeInfo = Microsoft.DataStudio.Diagnostics.TypeInfo;
    import Resx = Microsoft.DataStudio.Application.Resx;

    class ServerAuthenticationManagerImpl implements Microsoft.DataStudio.Managers.IAuthenticationManager {
        private static _instance: IAuthenticationManager = new ServerAuthenticationManagerImpl();
        private currentUser: AuthModels.IUser = { name: "Guest", email: null, puid: null, token: null, sessionId: null, subscriptions: null };
        private token: AuthModels.IMergedToken;
        private authLogger: Logging.Logger;
        private _isSessionTimedout: boolean = false;
        constructor() {

            if (ServerAuthenticationManagerImpl._instance) {
                throw new Error("Error: Instantiation failed: USE [Microsoft.DataStudio.Managers.AuthenticationManager.instance] instead of new.");
            }
            else {
                ServerAuthenticationManagerImpl._instance = this;
            }
            this.authLogger = Application.LoggerFactory.getLogger({ loggerName: "ServerAuthenticationManager" });
            /// The token gets expired every 60 min in the server. We keep the heartbeat at 8 min as with this number we achieve minimal heartbeats to keep the endpoint alive and
            /// also to reach 56 which is before 60 min. The server refreshes the token before 5 min to expiry.
            /// Why 56 ???
            /// 60 will be in border
            /// 59 PRIME number
            /// 58 = 29 * 2 29 mins will be too high
            /// 57 PRIME number

            setInterval((function (self) {
                return function () {
                    self.TokenHeartBeatHandler();
                }
            })(this), 8 * 60 * 1000);
        }

        ShowSessionTimeoutNotification = function () {
            var notificationContainer = $('<div class="session-timeout-container"></div>');
            var fadeBox = $('<div class="fade-box"></div>');
            var notificationBar = $('<div class="notification-bar"></div>');
            var notificationMessage = $('<div class="notification-bar-message">Your session has timed out. Please click the OK button to login again.</div>')
                .text(Resx.yourSessionHasTimedOut);
            var okBtn = $('<input type="button" value="OK" class="btn btn-primary">');
            notificationMessage.append(okBtn);
            notificationBar.append(notificationMessage);
            notificationContainer.append(fadeBox);
            notificationContainer.append(notificationBar);

            okBtn.click(function (eventHandler) {
                window.location.reload();
            });

            $("body").append(notificationContainer);
        }

        TokenHeartBeatHandler = function () {
            if (this.token != null) {
                var idtoken = jwt.decode(this.token.idTokenRawValue);
                this.authLogger.logInfo("initiating heartbeat", { username: idtoken.given_name, puid: this.currentUser.puid, timestamp2: new Date(Date.now()) });
                var tokenPromise = this.getTokenAsync();
                tokenPromise.done((bearerToken: AuthModels.IMergedToken) => {
                    this.token = bearerToken;
                });
                tokenPromise.fail((error: any) => {
                });
            }
        };

        public static get instance(): Microsoft.DataStudio.Managers.IAuthenticationManager {
            return ServerAuthenticationManagerImpl._instance;
        }

        public initializeAsync(): Q.Promise<any> {
            var deferred: Q.Deferred<any> = Q.defer<any>();
            var bearerTokenPromise = this.getTokenAsync();
            bearerTokenPromise.done((bearerToken: AuthModels.IMergedToken) => {
                if (bearerToken.idTokenRawValue != null) {

                    //let subscriptionMap: { [key: string]: AuthModels.Subscription } = {};
                    //bearerToken.subscriptions.forEach((subscription) => {
                    //    subscriptionMap[subscription.subscriptionId] = subscription;
                    //});

                    var idtoken = jwt.decode(bearerToken.idTokenRawValue);
                    this.currentUser = {
                        name: idtoken.given_name,
                        email: bearerToken.email,
                        puid: AuthHelpers.extractPuid(bearerToken.idTokenRawValue),
                        token: idtoken,
                        sessionId: bearerToken.sessionId,
                        subscriptions: <Array<AuthModels.Subscription>>bearerToken.subscriptions
                    };
                    this.authLogger.logInfo("Jwt Token successfully retreived", { username: idtoken.given_name, mergedtoken: bearerToken });
                    deferred.resolve(bearerToken);
                }
                else deferred.reject(new Error("Error retrieved id token."));
            });

            bearerTokenPromise.fail((error: any) => {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        public login(): void {
            // No-Op This implementation assumes that when running ADS user is always logged in (handled by OAuthMiddleware).
        }

        public logout(): void {

            // NO-OP this is handled in Owin controller as signing out using a ajax call will not clear of the cookies.
        }

        public getAccessToken(subscriptionId?: string): Q.Promise<string> {
            if (subscriptionId) {
                subscriptionId = subscriptionId.toLowerCase();
            }
            var deferred: Q.Deferred<string> = Q.defer<string>();
            if (this.token != null) {
                if (this._isSessionTimedout) {
                    deferred.reject("Session timed out. Please reload page.");
                }
                else {
                    if (subscriptionId !== null) {

                        var found = $.grep(this.currentUser.subscriptions, (subscription) => { return subscription.subscriptionid.toLowerCase() == subscriptionId; })
                        if (found.length > 0)
                            deferred.resolve(found[0].access_token);
                        else {
                            deferred.reject("Provided subscription does not belong to current user.");
                        }
                    }
                    else {
                        deferred.reject("Subscription id not provided ");
                    }
                }
            } else {

                var tokenPromise = this.getTokenAsync();
                tokenPromise.done((bearerToken: AuthModels.IMergedToken) => {
                    this.token = <AuthModels.IMergedToken>bearerToken;
                    if (this.token.subscriptions != null) {
                        if (subscriptionId !== null) {
                            var found = $.grep(this.currentUser.subscriptions, (subscription) => { return subscription.subscriptionid.toLowerCase() == subscriptionId; })
                            if (found.length > 0)
                                deferred.resolve(found[0].access_token);
                            else {
                                deferred.reject("Provided subscription does not belong to current user.");
                            }
                        }
                        else {
                            deferred.reject("Subscription id not provided ");
                        }
                    }
                    else {
                        deferred.reject(this.token.message);
                        this.token = null;
                    }
                });
                tokenPromise.fail((error: any) => {
                    if (!this._isSessionTimedout) {
                        this.ShowSessionTimeoutNotification();
                        this._isSessionTimedout = true;
                    }
                    deferred.reject(error);
                });
            }
            return deferred.promise;
        }

        // [TODO] raghum : this is a temporary solution for ADC, to make some 
        // progress in the UI side. This will be removed after we support token with 
        // multiple audience.
        public getAccessTokenADC(subscriptionId?: string): Q.Promise<string> {
            return Q("");
        }

        public getCurrentUser(): Microsoft.DataStudio.Model.IUser {
            return this.currentUser;
        }

        private getTokenAsync(): Q.Promise<AuthModels.IMergedToken> {
            var tokenDeferred: Q.Deferred<AuthModels.IMergedToken> = Q.defer<AuthModels.IMergedToken>();
            var tokenRequest: JQueryXHR = $.ajax(
                "/token",
                <JQueryAjaxSettings>{
                    type: "POST",
                    data: "grant_type=client_credentials"
                });

            tokenRequest.done((value: AuthModels.IBearerToken): void => {
                var bearerToken: AuthModels.IMergedToken = JSON.parse(value.access_token);
                if (bearerToken != null) {
                    if (bearerToken.message == null) {
                        this.token = <AuthModels.IMergedToken>bearerToken;
                        tokenDeferred.resolve(bearerToken);
                    }
                    else
                        tokenDeferred.reject(new Error(bearerToken.message));
                }
                tokenDeferred.reject(new Error("Error retreiving token from server"));
            }).fail((error: any) => {
                if (error.responseJSON != null) {
                    if (error.responseJSON.error == "invalid_client") {
                        if (!this._isSessionTimedout) {
                            this.ShowSessionTimeoutNotification();
                            this._isSessionTimedout = true;
                        }
                    }
                }
                tokenDeferred.reject(error);
            });

            return tokenDeferred.promise;
        }
    }
    // AuthenticationManager = ServerAuthenticationManagerImpl;
}
