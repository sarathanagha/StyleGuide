declare module Shell {
    export class Promise {
        constructor(initFunction: (complete, error, progress) => void, cancelFunction: any);
    }
    export var extensionIndex: { [index: string]: any; };
}

declare module Shell.UI.Balloon {
    export function getBoundaries(JQuery): { height: number; left: number; top: number; width: number; };
    export function hideBalloons();
}

declare module Shell.UI.Validation {
    export var validators: any;
    export function rangeValidator(value: any, element: Element, params: any): boolean;
    export function addValidator(name: string, params: any, validate?: any, options?: any): any;
    export function validate(element: Element): JQuery;
    export function getValidationData(element: Element): JQuery;
}

declare module Shell.UI.Spinner {
    export function show(): void;
    export function hide(): void;
}

declare module Shell.UI.Icons {
    export var save: any;
    export var publish: any;
    export var copy: any;
    export var sync: any;
    export var undo: any;
    export var play: any;
    export var stop: any;
    export var clock: any;
    export var previous: any;
    export var publishToCommunity: any;
    export var download: any;
    export var edit: any;
    export var browse: any;
    export var dataset: any;
}

declare module Shell.Environment {
    export function getSignOutLink(): string;
}

declare module cdm {
    export function getActiveItem(): any;
    export function setActiveItem(item: any): void;
    export var currentActiveItem: any;
    export var currentExtension: any;
    export function selectCollectionViewRow(propertyNameOrIndex: any, propertyValue: any): void;
    export var currentContext: any;
}

declare module Shell.UI.Navigation {
    export function navigate(extension: any): any;
    /**
     *  Set a message to be displayed in a confirmation message box before the user is about to leave the current AzureFX navigation page either
     *  through clicking a link, a call to navigate(), or by closing the browser window. In the case of the browser window being closed, this
     *  message is set as the return value for AzureFX's callback for window.onbeforeunload.
     *
     *  @param {string} message The message to be displayed when navigating between AzureFX pages and when window.onbeforeunload is called.
     */
    export function setConfirmNavigateAway(message: string): void;
    /**
     *  Remove any message which has previously been set using setConfirmNavigateAway
     */
    export function removeConfirmNavigateAway(): void;
    export function calculateNavigationPath(options: any): string;
}

declare module Shell.UI.Notifications {
    export function Confirmation(title: string, status: string): void;
    export function Notification(title: string, status: string): void;
    export function Progress(title: string, status: string, indeterminate: boolean): void;
    export function add(item: any);
    export function remove(item: any);    
}

declare module Shell.UI.Notifications.Buttons {
    export function yes(callback: () => void): void;
    export function no(callback: () => void ): void;
    export function close(callback?: () => void ): void;
    export function ok(callback?: () => void): void;
    export function details(callback?: () => void): void;
    export function cancel(callback?: () => void): void;
    export function retry(callback?: () => void): void;
}

declare module Shell.UI.Notifications.ButtonSets {
    export function yesNo(callbackYes: () => void, callbackNo?: () => void): any[];
    export function yesNoCancel(callbackYes, callbackNo, callbackCancel): any[];
}

declare module Shell.UI.Commands {
    export function add(item: any);
    export class Command {
        constructor(text: string, icon: any, click: () => void, group: any, disabled: boolean);
        setText(text: string);
        setIcon(icon: any);
        setClick(click: () => void);
        setDisabled(disable: boolean);
    }
    export function clear(group?: any): void;
}

declare module Shell.UI.DialogPresenter {
    export function show(options: IDialogOptions): void;
    export function close(): void;

    export interface IDialogOptions {
        extension?: string;
        template?: any; // JsViewsTemplate or string
        /** Called when the user is attempting to accept the dialog. If true is returned,
            the dialog dismissal is cancelled. */
        ok?: (fields: any) => boolean;
        okOrClose?: () => void;
    }
}

interface IFxUploadOptions {
}

interface JQuery {
    fxBalloon(...parameters: any[]): JQuery;
    fxDataGrid(...parameters: any[]): JQuery;
    fxDialog(...parameters: any[]): JQuery;
    fxRadio(...parameters: any[]): JQuery;
    fxUpload(options?: IFxUploadOptions): JQuery;
    fxTextBox(...parameters: any[]): JQuery;
    fxsAvatarBar(...parameters: any[]): any;
    fxsDialog(...parameters: any[]): any;
    fxsModalPresenter(action: string, dialog: any);
    wazDataGrid(options: any);
    fxsCopyButton(...parameters: any[]): JQuery;
    fxsWizard(...parameters: any[]): JQuery;
    fxUsageBars(...parameters: any[]): JQuery;
}

interface JQueryStatic {
    fxGridFormatter: any;
    fxs: {
        fxsWizard: {
            Wizard(): void;
            WizardStep(): void;
        }
    }
}

declare module Impl.UI.HeaderBar {
    export function addControl(control: JQuery);
}

declare module Shell.Diagnostics.Telemetry {
    export function feedbackInfo(comments: string, data: string): void;
    export function customEvent(eventKey: any, customEventType: any, data?: any): void;
    export function featureUsage(featureId: DataLab.Constants.FeatureId, groupId: DataLab.Constants.FeatureId, workspaceId?: string, experimentId?: string, moduleId?: string, data?: any);
    export function performance(key, time, message, data): void;
}

declare module Shell.UI.Drawer {
    export function open(): void;
    export function close(): void;
}

declare module Shell.Utilities {
    export function htmlEncode(text: string): string;

    export class QueryStringBuilder {
        constructor(queryString: string);
        getValue(key: string): string;
        containsKey(key: string): boolean;
        remove(keys: string[]): void;
        toString(includeLeadingQuestionMark: boolean);
        // Incomplete: fill out as needed.
    }
}

declare module $.fxs.fxsWizard {

    export interface WizardStep {
        constructor();
        id: string;
        title: KnockoutObservable<string>;
        locked: KnockoutObservable<boolean>;
        content: KnockoutObservable<string>;
        url: KnockoutObservable<string>;
        previousLabel: KnockoutObservable<string>;
        nextLabel: KnockoutObservable<string>;
        completeLabel: KnockoutObservable<string>;
        contentTemplateOptions: any;
    }

    export interface Wizard {
        constructor();
        id: string;
        title: KnockoutObservable<string>;
        steps: KnockoutObservableArray<WizardStep>;
        completeButtonEnabled: KnockoutObservable<boolean>;
        lockOrUnlockNextSteps: (shouldLock: boolean, afterStep?: $.fxs.fxsWizard.WizardStep) => void;
        currentStep: KnockoutObservable<WizardStep>;
        currentStepIndex: KnockoutObservable<number>;
        previousStep: KnockoutObservable<WizardStep>;
        nextStep: KnockoutObservable<WizardStep>;
        showProgress: KnockoutObservable<boolean>;
    }
}

declare module Impl.UI.Dialogs.ModalPresenter {
    export function open(content: JQuery);
}


declare module waz.formatters {
    export function bytesFormatter(value: number): string;
}