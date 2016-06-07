/// <reference path="../../../references.d.ts" />

import {Wizard} from "../../../bootstrapper/WizardBinding";
import {IPivotValueAccessor} from "../../../bootstrapper/PivotKnockoutBinding";
import {IWinJSPivotValueAccessor} from "../../../bootstrapper/WinJSKnockoutBindings";
import {AppContext} from "../../../scripts/AppContext";
import {Button} from "../../../scripts/Framework/UI/Command";
import {close} from "../../../_generated/Svg";

export enum OverlayType {
    WIZARD,
    PIVOT,
    HTML
}

export interface ITemplateAndViewModel {
    template: string;
    viewModel: Object;
}

export abstract class AuthoringOverlay {
    public static className = "ActivityWizard";
    public overlayType: OverlayType;
    public overlayContent: Wizard | IPivotValueAccessor | IWinJSPivotValueAccessor | ITemplateAndViewModel;
    public overlayTitle: string;
    public overlayEnum = OverlayType;

    public closeIcon: string = Button.removeCSS($(close).filter("svg"));

    constructor(overlayType: OverlayType, overlayTitle: string) {
        this.overlayType = overlayType;
        this.overlayTitle = overlayTitle;
    }

    public showOverlay(): void {
        AppContext.getInstance().authoringOverlayHandler.pushState(AuthoringOverlay.className, this);
    }

    public hideOverlay(): void {
        AppContext.getInstance().authoringOverlayHandler.pushState(AuthoringOverlay.className, null);
    }
}
