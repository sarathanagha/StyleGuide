module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IItemEditor {
        updateComplete: () => void;
        originalColumnName: string;
        rowSelected: KnockoutObservable<boolean>;
        columnName: KnockoutObservable<string>;
        columnType: KnockoutObservable<string>;
        duplicateErrorMessage: KnockoutObservable<boolean>;
        includeCheckbox: KnockoutObservable<boolean>;
        bindableColumn: KnockoutObservable<IBindableColumn>;
        addedInline: boolean;
    }

    export interface IEditColumnData {
        column: IBindableColumn;
        includeCheckbox: boolean;
        duplicateName: KnockoutObservable<string>;
        updateColumn: (bindableColumn: IBindableColumn, columnName: string, columnType: string, itemEditor: IItemEditor) => void;
        updateDescription: (bindableColumn: IBindableColumn, columnName: string, description: string, itemEditor: IItemEditor) => void;
        checkBoxChanged?: () => void;
    }
}