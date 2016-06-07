module Microsoft.DataStudioUX.Interfaces {
    export type MenuBindingGenericOption = string | IMenuBindingOption;
    export type MenuBindingOptions = KnockoutObservableArray<MenuBindingGenericOption> | MenuBindingGenericOption[];
   
    export interface IMenuBindingOption {
       // action?: () => any;
        description?: KnockoutObservable<string> | string;
        iconPath?: string;
        isDisabled?: KnockoutObservable<boolean> | boolean;
        label: KnockoutObservable<string> | string;
        options?: MenuBindingOptions; 
        value?: any;
    }

    export interface IMenuBindingParams {
        options: MenuBindingOptions;
        level?: number;
        isMultiselect?: KnockoutObservable<boolean> | boolean;
        selected?: KnockoutObservableArray<IMenuBindingOption>;
        leftOffset?: number;
        topOffset?: number;
        scrollClass?: string
    }
}