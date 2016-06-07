module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IAttributeInfo {
        name: string;
        readOnly: boolean;
        tooltips?: ITooltipInfo[];
    }

    export interface ITooltipInfo {
        email: string;
    }

    export interface IAttributeParameters {
        attributesOnAll: KnockoutObservableArray<IAttributeInfo>;
        attributesOnSome: KnockoutObservableArray<IAttributeInfo>;
        placeholderText: string;
        groupTypeName?: string;
        onAdd?: (attributes: string[]) => void;
        onRemove?: (attribute: string) => void;
        onRemoved: (attribute: string) => void;
        onValidate?: (attributes: string[]) => JQueryPromise<string[]>;
        hideAddButton?: boolean;
        showTooltip?: boolean;
    }
}