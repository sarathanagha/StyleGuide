/// <reference path="../references.ts" />

module Microsoft.DataStudio.Application {
    export var ManagerFactory: IManagerFactoryStatic;

    export interface IManagerFactoryStatic {
        getInstanceOf: (className: string) => IInstanceReference;
    }

    export interface IReferenceDisposeRequest {
        className: string;
        instanceReferenceID: string;
    };

    export interface IInstanceReference {
        instance: IDisposableManager;
        release: () => any;
    };

    export interface IDisposableManager {
        dispose: () => any;
    }
}
