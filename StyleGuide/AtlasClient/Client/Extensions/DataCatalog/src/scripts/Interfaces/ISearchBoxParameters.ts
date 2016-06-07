module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface ISearchBoxParameters {
        placeholderText?: string;
        text: KnockoutObservable<string>;
        onChange?: () => void;
        onClear?: () => void;
        onSavedSearchApplied?: () => void;
        focusId?: string;
    }
}