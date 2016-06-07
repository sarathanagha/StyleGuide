/// <reference path="../../References.d.ts" />

import Framework = require("../../_generated/Framework");
import AppContext = require("../../scripts/AppContext");
import JQueryUIBindingHandlers = require("../../bootstrapper/JQueryUIBindings");
import Command = Framework.Command;

export class StartEndTimePickerViewModel extends Framework.Disposable.ChildDisposable {
    public startDate: TextBoxViewModel = null;
    public endDate: TextBoxViewModel = null;
    public datetimeRangeValue: JQueryUIBindingHandlers.IDatetimeRangeBindingValueAccessor = null;
    public updateButtonOptions: Command.ICommand = null;

    private _element: HTMLElement = null;

    constructor(lifetimeManager: Framework.TypeDeclarations.DisposableLifetimeManager, element: HTMLElement) {
        super(lifetimeManager);
        this._element = element;
        let appContext = AppContext.AppContext.getInstance();

        this.startDate = new TextBoxViewModel(lifetimeManager, ClientResources.startTimeUTCLabel,
            null, null);
        this.endDate = new TextBoxViewModel(lifetimeManager, ClientResources.endTimeUTCLabel,
            null, null);

        this.updateButtonOptions = {
            onclick: () => {
                this.startDate.saveCurrentValue();
                this.endDate.saveCurrentValue();
                appContext.dateRange(this.datetimeRangeValue.currentValue());
            },
            name: "update",
            label: ClientResources.applyText,
            tooltip: ClientResources.startEndPickerText
        };

        this._lifetimeManager.registerForDispose(appContext.dateRange.subscribe((value) => {
            this.datetimeRangeValue.currentValue(value);
        }));

        this.datetimeRangeValue = JQueryUIBindingHandlers.DatetimeRangeBindingHandler.getInitialValueAccessor();
        this.datetimeRangeValue.currentValue(appContext.dateRange());

        // Subscribe to first change as it means picker has initialized.
        let tempDatetimeRangeUpdateSubscription = this.datetimeRangeValue.isReady.subscribe(() => {
            tempDatetimeRangeUpdateSubscription.dispose();
            this.startDate.saveCurrentValue();
            this.endDate.saveCurrentValue();
        });
    }

    public static isValidDate(value: string): boolean {
        let date = new Date(value);
        return !isNaN(date.getTime());
    }
}

export class TextBoxViewModel extends Framework.Disposable.ChildDisposable {
    public textBox: KnockoutObservable<string> = ko.observable<string>();
    public isDirty: KnockoutObservable<boolean> = ko.observable(false);
    public isValid: KnockoutObservable<boolean> = ko.observable(true);
    public lastSavedValue: KnockoutObservable<string> = ko.observable<string>();
    public label: string = "";

    constructor(
      lifetimeManager: Framework.Disposable.IDisposableLifetimeManager,
      label: string,
      initialValue?: string,
      isValidValue?: (value: string) => boolean) {
        super(lifetimeManager);
        if (initialValue) {
            this.textBox(initialValue);
            this.lastSavedValue(initialValue);
        }
        this.label = label;

        this._lifetimeManager.registerForDispose(this.textBox.extend({
            rateLimit: { method: "notifyWhenChangesStop", timeout: 400 }
        }).subscribe((value: string) => {
            this.isDirty(this.lastSavedValue() !== this.textBox());
            if (isValidValue) {
                this.isValid(isValidValue(this.textBox()));
            }
        }));
    }

    public saveCurrentValue(): boolean {
        if (this.isValid()) {
            this.lastSavedValue(this.textBox());
            this.isDirty(false);
            return true;
        }
        return false;
    }
}
