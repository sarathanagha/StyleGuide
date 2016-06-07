/// <reference path="../../references.d.ts" />

/// <amd-dependency path="text!./landingPage.html" />
/// <amd-dependency path="text!./landingPage.svg" />
/// <amd-dependency path="css!./landingPage.css" />

/* tslint:disable:no-var-requires */
export const template: string = require("text!./landingPage.html");
/* tslint:enable:no-var-requires */

export class LandingPageViewModel {
    public svg: string = require("text!./landingPage.svg");
    public message: string;
    public title: string;

    constructor() {
        this.title = ClientResources.pageNotFound;
        this.message = ClientResources.useOriginalUrlMessage;

        // temporarily fix the DOM because of the deep url problem for ADF module
        $("[data-bind=\"tabControl: leftPanelElementsConfig()\"]").hide();
        $(".col.rightSidePanel").remove();
    }
}

export const viewModel = LandingPageViewModel;
