module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface ICheckboxListParameters {
        data: IFilterItem[];
        selected: KnockoutObservableArray<any>;
        numberInitiallyVisible: number;
        onChange: (data: any, event: Event) => {};
        max: number;
    }
}