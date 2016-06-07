// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./layout.html" />
/// <amd-dependency path="css!./layout.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import manager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
import focusManager = Microsoft.DataStudio.DataCatalog.Managers.FocusManager;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;

export var template: string = require("text!./layout.html");

export class viewModel {
    resx = resx;

    leftTitle = manager.leftTitle;
    leftComponent = manager.leftComponent;
    leftExpanded = manager.leftExpanded;
    leftWidth = manager.leftWidth;
    leftDuration = manager.leftDuration;

    centerComponent = manager.centerComponent;

    rightTitle = manager.rightTitle;
    rightComponent = manager.rightComponent;
    rightExpanded = manager.rightExpanded;
    rightWidth = manager.rightWidth;
    rightDuration = manager.rightDuration;

    bottomComponent = manager.bottomComponent;
    bottomExpanded = manager.bottomExpanded;
    bottomHeight = manager.bottomHeight;
    bottomDuration = manager.bottomDuration;

    showLeft = manager.showLeft;
    showRight = manager.showRight;
    showCenter = manager.showCenter;
    showBottom = manager.showBottom;

    public leftFocus: KnockoutObservable<string>;
    public rightFocus: KnockoutObservable<string>;
    public centerFocus: KnockoutObservable<string>;
    public bottomFocus: KnockoutObservable<string>;

    public lastSelected = null;
    private blockTabClass = "block-tab";

    constructor(parameters: any) {
        this.leftFocus = manager.leftFocus;
        this.rightFocus = manager.rightFocus;
        this.centerFocus = manager.centerFocus;
        this.bottomFocus = manager.bottomFocus;

        if (parameters.left) {
            this.leftTitle(parameters.left.title);
            this.leftComponent(parameters.left.component);
            !this.leftExpanded() && this.leftExpanded(!!parameters.left.expanded);
            this.leftWidth(parameters.left.width);
            this.leftDuration(parameters.left.duration || 400);
            this.showLeft(true);
        }
        else {
            this.showLeft(false);
        }

        if (parameters.center) {
            !this.centerComponent() && this.centerComponent(parameters.center.component);
            this.showCenter(true);
        }
        else {
            this.showCenter(false);
        }

        if (parameters.right) {
            this.rightTitle(parameters.right.title);
            this.rightComponent(parameters.right.component);
            !this.rightExpanded() && this.rightExpanded(!!parameters.right.expanded);
            this.rightWidth(parameters.right.width);
            this.rightDuration(parameters.right.duration || 400);
            this.showRight(true);
        }
        else {
            this.showRight(false);
        }

        if (parameters.bottom) {
            this.bottomComponent(parameters.bottom.component);
            !this.bottomExpanded() && this.bottomExpanded(!!parameters.bottom.expanded);
            this.bottomHeight(parameters.bottom.height);
            this.bottomDuration(parameters.bottom.duration || 400);
            this.showBottom(true);
        }
        else {
            this.showBottom(false);
        }
    }

    public isMasked = ko.pureComputed(() => {
        return <boolean>manager.isMasked();
    });

    public toggleLeft() {
        if (!manager.isMasked()) {
            this.leftExpanded(!this.leftExpanded());
        }
    }

    public toggleRight() {
        if (!manager.isMasked()) {
            this.rightExpanded(!this.rightExpanded());
        }
    }

    public toggleBottom() {
        if (!manager.isMasked()) {
            this.bottomExpanded(!this.bottomExpanded());
        }
    }

    public leftSelected = ko.pureComputed<boolean>(() => {
        return this.leftFocus() === focusManager.selected();
    });

    public rightSelected = ko.pureComputed<boolean>(() => {
        return this.rightFocus() === focusManager.selected();
    });

    public centerSelected = ko.pureComputed<boolean>(() => {
        return this.centerFocus() === focusManager.selected();
    });

    public bottomSelected = ko.pureComputed<boolean>(() => {
        return this.bottomFocus() === focusManager.selected();
    });

    public selectSection(section: string, event: KeyboardEvent) {
        if (util.isSelectAction(event) && ($("[data-focus-id='layout'] > :focus").length || $("[data-focus-id='bottom']:focus").length)) {
            this.lastSelected = $(":focus");
            focusManager.setContainerInteractive(section);
            var $items = $(this.lastSelected).find("." + this.blockTabClass).attr("tabindex", "0");
            $items.removeClass(this.blockTabClass);
            if ($items.length) {
                $items[0].focus();
            }
        }
        else if ((event.which || event.keyCode) === constants.KeyCodes.ESCAPE) {
            focusManager.resetContianer();
            if (this.lastSelected) {
                $(this.lastSelected).focus();
                if ($(this.lastSelected).attr("data-focus-id") === "center") {
                    $(this.lastSelected).find("[tabindex='0']").not("[data-focus-id='bottom']").addClass(this.blockTabClass).attr("tabindex", "-1");
                }
                else {
                    $(this.lastSelected).find("[tabindex='0']").addClass(this.blockTabClass).attr("tabindex", "-1");
                }
            }
        }
    }

    public onSectionFocus(d, e) {
        e.preventDefault();
        var section: string = $(":focus").attr("data-focus-id");
        if (section === "center") {
            $(":focus").find("[tabindex='0']").not("[data-focus-id='bottom']").addClass(this.blockTabClass).attr("tabindex", "-1");
        }
        else {
            switch (section) {
                case "left":
                    this.leftExpanded(true);
                    break;

                case "right":
                    this.rightExpanded(true);
                    break;

                case "bottom":
                    this.bottomExpanded(true);
                    break;
            }
            $(":focus").find("[tabindex='0']").addClass(this.blockTabClass).attr("tabindex", "-1");
        }
    }
}