module Microsoft.DataStudio.Managers {

    export var AuthenticationManager: IAuthenticationManagerStatic;
    export var ConfigurationManager: IConfigurationManagerStatic;

    export interface IAuthenticationManager {
        initializeAsync(tenantId?: string): Q.Promise<any>;
        login(): void;
        logout(): void;
        getCurrentUser(): Microsoft.DataStudio.Model.IUser;
        getAccessToken(subscriptionId?: string): Q.Promise<string>;

        // [TODO] raghum : this is a temporary solution for ADC, to make some 
        // progress in the UI side. This will be removed after we support token with 
        // multiple audience.
        getAccessTokenADC(subscriptionId?: string): Q.Promise<string>;
    }

    export interface IAuthenticationManagerStatic {
        instance: IAuthenticationManager;
    }

    export interface IConfigurationManager {
        initializeAsync(config: Microsoft.DataStudio.Model.Config.ShellConfig): Q.Promise<any>;
        getApiEndpointUrl(): string;
        getGalleryEndpointUrl(): string;
        getADCEndpoint(): string;
    }

    export interface IConfigurationManagerStatic {
        instance: IConfigurationManager;
    }
}
