module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IBindableInputParameters {
        label: string;
        placeholderText: string;
        bindingPath: string;
        validatePattern?: RegExp;
        value?: string;
    }

    export interface ITextfieldParameters extends IBindableInputParameters {
    } 

    export interface ITextareaParameters extends IBindableInputParameters {
    }
}