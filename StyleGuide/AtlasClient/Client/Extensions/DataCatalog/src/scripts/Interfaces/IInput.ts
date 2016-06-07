module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IInput {
        value: KnockoutObservable<string>;
        isValid: KnockoutObservable<boolean>;
        validate: () => boolean;
    }
}