module Microsoft.DataStudioUX.Interfaces {
    export interface IModalActions {
        remove: () => void;
        getId: () => string;
    };

    export interface IModalButton {
        label: string;
        action: (helper: IModalActions, event: JQueryEventObject) => any;
        isPrimary?: boolean;
    };

    export interface IModalBindingParams {
        isVisible: KnockoutObservable<boolean>;
        modalContainerClass?: string;
        disableFadeClose?: boolean;
        useSmallModal?: string;
        template?: string; // TODO (stpryor): Remove this temporary parameter
    };

    export interface IModalManagerParams {
        content?: string;
        header?: string;
        message?: string;
        buttons?: IModalButton[];
        modalContainerClass?: string;
        disableFadeClose?: boolean;
        viewModel?: any;
        closeModalText?: string;
        closeCallback?: () => any;
        useSmallModal?: string;
    };
}

