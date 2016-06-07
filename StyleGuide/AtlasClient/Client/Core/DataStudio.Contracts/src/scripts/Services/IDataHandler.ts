module Microsoft.DataStudio.Services {

    export var DataHandler: IDataHandlerStatic;

    export interface IDataHandler {
        GetData(query: any): Q.Promise<any>;
    }

    export interface IDataHandlerStatic {
        GetInstance(): IDataHandler;
    }
}
