/// <reference path="../../References.d.ts" />

import Framework = require("../../_generated/Framework");
import Flyout = Framework.HoverFlyout;

const flyoutContentSelector = ".adf-flyoutContent";
const calloutContentSelector = ".adf-calloutContent";
const dialogContentSelector = ".adf-dialogContent";

// Autohide: hide if mouse moves out of anchor element
export interface IFlyoutRequest {
    anchor: HTMLElement;
    innerHTML: string;
    timeout?: number;
}

/**
 * Propagates selection state to the view models which choose to subscribe.
 */
export class FlyoutHandler {
    protected _template: string = "<div id=\"adf-flyout\"><div class = \"adf-flyoutContent\"></div>";
    protected _flyout: WinJS.UI.Flyout;

    private _requests: IFlyoutRequest[];
    private _requestId: number = 0;
    private _flyoutHost: HTMLElement;
    private _flyoutContent: HTMLElement;
    private _currentRequest: IFlyoutRequest;

    private _onTimeoutMaker = (requestId: number) => {
        return () => {
            if (requestId === this._requestId) {
                this._flyout.hide();
            }
        };
    };

    private _onHide = () => {
        if (this._requests.length === 0) {
            this._currentRequest = null;
            return;
        }

        this._executeRequest(this._requests.shift());
    };

    constructor() {
        this._requests = [];

        this._flyout = null;
    }

    public dispose() {
        // TODO iannight clean up
    }

    public addRequest(request: IFlyoutRequest) {
        this.createFlyoutHelper(flyoutContentSelector);

        // no requests
        if (!this._currentRequest && this._requests.length === 0) {
            this._executeRequest(request);
        } else {
            // add it to the qeueue
            this._requests.push(request);
        }
    }

    protected createFlyoutHelper(contentSelector: string) {
        // TODO iannight: make this always available to our app
        if (!this._flyout) {
            this._flyoutHost = $(this._template).appendTo("body")[0];

            this._flyout = new WinJS.UI.Flyout(this._flyoutHost, {
                placement: "auto"
            });

            this._flyoutContent = <HTMLElement>this._flyoutHost.querySelector(contentSelector);

            this._flyout.addEventListener("afterhide", this._onHide);
        }
    }

    private _executeRequest(request: IFlyoutRequest) {
        this._requestId++;
        this._currentRequest = request;
        this._flyoutContent.innerHTML = request.innerHTML;

        this._flyout.show(request.anchor);

        // if a timeout was specified, make a closure
        if (this._currentRequest.timeout) {
            window.setTimeout(this._onTimeoutMaker(this._requestId), this._currentRequest.timeout);
        }
    }
}

export interface ICalloutRequest extends IFlyoutRequest {
    autohide: boolean;
    placement?: string;
}

/**
 *  Shows a balloon flyout (callout) pointing to an anchor element
 *  Extends the WinJS Flyout to dismiss when user stops hovering over anchor element
 */
export class CalloutHandler extends FlyoutHandler {
    protected _template: string = "<div id=\"adf-callout\"><div id=\"adf-callout-svg\"></div><div class = \"adf-calloutContent\"></div>";

    public addRequest(request: ICalloutRequest) {
        this.createFlyoutHelper(calloutContentSelector);

        if (request.autohide) {
            Flyout.setupFlyoutAutohide(this._flyout, request.anchor);
        }

        if (request.placement) {
            this._flyout.placement = request.placement;
        }

        let afterFlyoutShows: () => void, beforeFlyoutHides: () => void;
        let caretContainer = $("#adf-callout-svg")[0];

        afterFlyoutShows = () => {
            this._flyout.addEventListener("beforehide", beforeFlyoutHides);

            let placement = this.getPlacement(request.anchor, this._flyout.element);
            let caret = "";
            switch (placement) {
                // Caret should be opposite of position
                case "left":
                    caret = Framework.Svg.caret_right;
                    $(caretContainer).removeClass().addClass("right");
                    break;
                case "right":
                    caret = Framework.Svg.caret_left;
                    $(caretContainer).removeClass().addClass("left");
                    break;
                case "top":
                    caret = Framework.Svg.caret_down;
                    $(caretContainer).removeClass().addClass("bottom");
                    break;
                case "bottom":
                    caret = Framework.Svg.caret_up;
                    $(caretContainer).removeClass().addClass("top");
                    break;
                default:
                    // TODO ???
                    break;
            }

            $(caretContainer).html(caret);
        };

        beforeFlyoutHides = () => {
            this._flyout.removeEventListener("aftershow", afterFlyoutShows);
            this._flyout.removeEventListener("beforehide", beforeFlyoutHides);
        };

        // Disabling this for now because the arrow is troublesome. Will enable later.
        // this._flyout.addEventListener("aftershow", afterFlyoutShows);

        super.addRequest(request);
    }

    // Need to calculate placement after WinJS shows Flyout because it would be automatically
    // set if user didn't provide it
    private getPlacement(anchor: HTMLElement, flyout: HTMLElement): string {
        let cXAnchor = $(anchor).offset().left + $(anchor).width() / 2;
        let cYAnchor = $(anchor).offset().top + $(anchor).height() / 2;
        let cXFlyout = $(flyout).offset().left + $(flyout).width() / 2;
        let cYFlyout = $(flyout).offset().top + $(flyout).height() / 2;

        let xDiff = cXAnchor - cXFlyout;
        // This is opposite of xDiff since yPosition is calculated from top down (inverse of cartesian)
        let yDiff = cYFlyout - cYAnchor;

        if (Math.abs(xDiff) >= Math.abs(yDiff)) {
            // Left or Right
            return xDiff >= 0 ? "left" : "right";
        } else {
            // Top or Bottom
            return yDiff >= 0 ? "bottom" : "top";
        }
    }
}

export class DismissalResult {
    public static none = WinJS.UI.ContentDialog.DismissalResult.none;
    public static primary = WinJS.UI.ContentDialog.DismissalResult.primary;
    public static secondary = WinJS.UI.ContentDialog.DismissalResult.secondary;
}

export interface IDialogRequest {
    title: string;
    innerHTML: string;
    primaryCommandText?: string;
    secondaryCommandText?: string;
    dismissalHandler: (result: DismissalResult) => void;
    uniqueKey?: string;
}

/**
 * Propagates selection state to the view models which choose to subscribe.
 */
export class DialogHandler {
    private _requests: IDialogRequest[];
    private _dialog: WinJS.UI.ContentDialog;
    private _dialogHost: HTMLElement;
    private _dialogContent: HTMLElement;
    private _template = "<div id=\"adf-dialog\"><div class = \"adf-dialogContent\"></div>";
    private _set: StringMap<number>;

    private _currentRequest: IDialogRequest = null;

    private _onHide = (eventInfo) => {
        // Winjs claims that this may not exist sometimes, in which case we just say no result
        if (typeof eventInfo.detail.result === "undefined") {
            eventInfo.detail.result = DismissalResult.none;
        }

        if (this._currentRequest.dismissalHandler) {
            this._currentRequest.dismissalHandler(eventInfo.detail.result);
        }

        if (this._currentRequest.uniqueKey) {
            delete this._set[this._currentRequest.uniqueKey];
        }
        this._currentRequest = null;

        if (this._requests.length === 0) {
            return;
        }

        let request = this._requests.shift();

        this._executeRequest(request);
    };

    constructor() {
        this._requests = [];
        this._set = {};
        this._dialog = null;
    }

    // Request that asks an "ok/cancel" question and only calls callback after an "ok" response
    public okayCancelRequest(title: string, question: string, onSuccess: () => void) {
        let request: IDialogRequest = {
            title: title,
            innerHTML: question,
            primaryCommandText: ClientResources.ok,
            secondaryCommandText: ClientResources.Cancel,
            dismissalHandler: (result) => {
                if (result === DismissalResult.primary) {
                    onSuccess();
                }
            }
        };

        this.addRequest(request);
    }

    public addRequest(request: IDialogRequest, rejectIfInQueue?: boolean): WinJS.UI.ContentDialog {
        if (!this._dialog) {
            this._dialogHost = $(this._template).appendTo("body")[0];
            this._dialogContent = <HTMLElement>this._dialogHost.querySelector(dialogContentSelector);
            this._dialog = new WinJS.UI.ContentDialog(this._dialogHost);
            this._dialog.addEventListener("afterhide", this._onHide);
        }

        if (rejectIfInQueue) {
            if (!request.uniqueKey) {
                request.uniqueKey = Framework.Util.hashCode(request.innerHTML);
            }
            if (this._set[request.uniqueKey]) {
                return this._dialog;
            }
            this._set[request.uniqueKey] = 1;
        }

        // no requests
        if (!this._currentRequest && this._requests.length === 0) {
            this._executeRequest(request);
        } else {
            // add it to the qeueue
            this._requests.push(request);
        }

        return this._dialog;
    }

    public dispose() {
        // TODO iannight clean up
    }

    private _executeRequest(request: IDialogRequest) {
        this._currentRequest = request;

        // put in the defaults
        if (!request.primaryCommandText) {
            request.primaryCommandText = ClientResources.defaultDialogPrimaryCommandText;
        }

        this._dialog.primaryCommandText = request.primaryCommandText;
        this._dialog.secondaryCommandText = request.secondaryCommandText;
        this._dialog.title = request.title;
        this._dialogContent.innerHTML = request.innerHTML;
        this._currentRequest = request;
        this._dialog.show();
    }
}
