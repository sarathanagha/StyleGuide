module Microsoft.DataStudio.Model {


 	export interface IMergedToken {
        idTokenRawValue: string;
        accessTokenRawValue?: string;
        message?: string;
        sessionId: string;
        email: string;
        subscriptions: Subscription[];
    }

	export interface IBearerToken {
        access_token: string;
        token_type: string;
        expires: string;
    }

    export interface IJwtToken {
        given_name: string;
        family_name: string;
        name: string;
        unique_name: string;
        exp:number;
    }


    export interface IUser {
        name: string;
        email: string;
        puid: string;
        sessionId: string;
    	token: IJwtToken; 	
        subscriptions: Array<Subscription> ;
    }

}