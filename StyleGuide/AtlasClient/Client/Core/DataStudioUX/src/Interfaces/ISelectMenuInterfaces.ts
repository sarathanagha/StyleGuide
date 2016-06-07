module Microsoft.DataStudioUX.Interfaces {
    export interface SelectMenuOption {
        label: string;
        value: any;
        action?: () => any
    };

    export interface SelectMenuParams {
        options: KnockoutObservableArray<SelectMenuOption> | SelectMenuOption[];
        selected: KnockoutObservable<any>;
        leftOffset?: number;
        topOffset?: number;
    };
}

