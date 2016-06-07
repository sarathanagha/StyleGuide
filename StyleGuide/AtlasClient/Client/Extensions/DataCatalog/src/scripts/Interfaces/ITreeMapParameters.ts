module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface ITreeMapItem {
        name: string;
        value: number;
        normalizedValue?: number;
        css?: string;
    } 

    export interface ITreeMapParameters {
        items: ITreeMapItem[];
        click?: (groupType: string, data: string) => {};
    }
}