module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IModalParameters {
        title: string;
        confirmButtonText?: string;
        component?: string;
        bodyText?: string;
        hideCancelButton?: boolean;
        cancelButtonText?: string;
        buttons?: IModalButton[];
        modalContainerClass?: string;
    }

    export interface IModalButton {
        id: string;
        text: string;
        isDefault: boolean;
    }
}