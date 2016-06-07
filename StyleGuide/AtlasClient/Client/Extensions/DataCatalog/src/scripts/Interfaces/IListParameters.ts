module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IListParameters {
        title: string;
        data: string[];
        click?: (groupType: string, data: string) => {};
        numberInitiallyVisible: number;
        groupType?: string;
    }
}