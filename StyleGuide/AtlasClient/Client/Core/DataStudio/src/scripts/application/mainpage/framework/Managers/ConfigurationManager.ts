/// <reference path="../References.ts" />
module Microsoft.DataStudio.Managers {

    import Logging = Microsoft.DataStudio.Diagnostics.Logging;
    import AuthModels = Microsoft.DataStudio.Model;
    import TypeInfo = Microsoft.DataStudio.Diagnostics.TypeInfo;

    class ConfigurationManagerImpl implements Microsoft.DataStudio.Managers.IConfigurationManager {

        private static _instance: IConfigurationManager = new ConfigurationManagerImpl();
        private authLogger: Logging.Logger;
        private config: any;

        constructor() {
            if (ConfigurationManagerImpl._instance) {
                throw new Error("Error: Instantiation failed: USE [Microsoft.DataStudio.Managers.AuthenticationManager.instance] instead of new.");
            }
            else {
                ConfigurationManagerImpl._instance = this;
            }
            this.authLogger = Application.LoggerFactory.getLogger({ loggerName: "ConfigurationManager" });
        }

        public static get instance(): Microsoft.DataStudio.Managers.IConfigurationManager {
            return ConfigurationManagerImpl._instance;
        }

        public initializeAsync(config: Microsoft.DataStudio.Model.Config.ShellConfig): Q.Promise<any> {
            var configDeferred: Q.Deferred<any> = Q.defer<any>();
            var configRequest: JQueryXHR = $.ajax(
                Microsoft.DataStudio.Application.Environment.getAPIUrl("config", config.useExternalAPI),
                <JQueryAjaxSettings>{
                    type: "GET"
                });

            configRequest.done((value: any): void => {
                if (!!value) {
                    this.config = value;
                    this.authLogger.logInfo("Successfully got Configuration from the server", { url: this.config.DataServiceEndpoint });
                    configDeferred.resolve(value);
                }
                else {
                    configDeferred.reject(new Error("Configuration is null"));
                }
            }).fail((error: any) => {
                this.authLogger.logError("Failed to get the Configuration from the server");
                configDeferred.reject(error);
            });
            return configDeferred.promise;
        }

        public getApiEndpointUrl(): string {
            return this.config && this.config.DataServiceEndpoint ? this.config.DataServiceEndpoint : '';
        }

        public getGalleryEndpointUrl(): string {
            return this.config && this.config.GalleryEndpoint ? this.config.GalleryEndpoint : '';
        }

        public getADCEndpoint(): string {
            return this.config && this.config.ADCEndpoint ? this.config.ADCEndpoint : '';
        }
    }
    ConfigurationManager = ConfigurationManagerImpl;
}
