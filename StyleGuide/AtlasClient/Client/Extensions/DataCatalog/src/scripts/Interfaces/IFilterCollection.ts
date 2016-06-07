module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IFilterCollection {
        groups: IFilterGroup[];
        findGroup(groupType: string): IFilterGroup;
        replaceGroup(group: IFilterGroup);
        createItem(groupType: string, term: string, count?: number): IFilterItem;
        findItem(groupType: string, term: string): IFilterItem;
        totalItems(): number;
    }

    export interface IFilterGroup {
        groupType: string;
        label: string;
        items: IFilterItem[];
        findItem(term: string): IFilterItem;
    }

    export interface IFilterItem {
        groupType: string;
        term: string;
        count: number;
    }
}