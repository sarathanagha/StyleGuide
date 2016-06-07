module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IKeyValue<TKey, TValue> {
        key: TKey;
        value: TValue;
    }

    export interface IStringKeyValue extends IKeyValue<string, string> {   
    }
}