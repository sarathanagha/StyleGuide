// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./layout.html", "css!./layout.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var manager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
    var focusManager = Microsoft.DataStudio.DataCatalog.Managers.FocusManager;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    exports.template = require("text!./layout.html");
    var viewModel = (function () {
        function viewModel(parameters) {
            var _this = this;
            this.resx = resx;
            this.leftTitle = manager.leftTitle;
            this.leftComponent = manager.leftComponent;
            this.leftExpanded = manager.leftExpanded;
            this.leftWidth = manager.leftWidth;
            this.leftDuration = manager.leftDuration;
            this.centerComponent = manager.centerComponent;
            this.rightTitle = manager.rightTitle;
            this.rightComponent = manager.rightComponent;
            this.rightExpanded = manager.rightExpanded;
            this.rightWidth = manager.rightWidth;
            this.rightDuration = manager.rightDuration;
            this.bottomComponent = manager.bottomComponent;
            this.bottomExpanded = manager.bottomExpanded;
            this.bottomHeight = manager.bottomHeight;
            this.bottomDuration = manager.bottomDuration;
            this.showLeft = manager.showLeft;
            this.showRight = manager.showRight;
            this.showCenter = manager.showCenter;
            this.showBottom = manager.showBottom;
            this.lastSelected = null;
            this.blockTabClass = "block-tab";
            this.isMasked = ko.pureComputed(function () {
                return manager.isMasked();
            });
            this.leftSelected = ko.pureComputed(function () {
                return _this.leftFocus() === focusManager.selected();
            });
            this.rightSelected = ko.pureComputed(function () {
                return _this.rightFocus() === focusManager.selected();
            });
            this.centerSelected = ko.pureComputed(function () {
                return _this.centerFocus() === focusManager.selected();
            });
            this.bottomSelected = ko.pureComputed(function () {
                return _this.bottomFocus() === focusManager.selected();
            });
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
        viewModel.prototype.toggleLeft = function () {
            if (!manager.isMasked()) {
                this.leftExpanded(!this.leftExpanded());
            }
        };
        viewModel.prototype.toggleRight = function () {
            if (!manager.isMasked()) {
                this.rightExpanded(!this.rightExpanded());
            }
        };
        viewModel.prototype.toggleBottom = function () {
            if (!manager.isMasked()) {
                this.bottomExpanded(!this.bottomExpanded());
            }
        };
        viewModel.prototype.selectSection = function (section, event) {
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
        };
        viewModel.prototype.onSectionFocus = function (d, e) {
            e.preventDefault();
            var section = $(":focus").attr("data-focus-id");
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
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=layout.js.map