/// <reference path="../../references.d.ts" />
/// <amd-dependency path="css!./splitterControl.css" />

require(["css!datastudio.controls/Bindings/SplitterControl/splitterControl.css"])

module Microsoft.DataStudio.Application.Knockout.Bindings {

    export class SizeTracker {
        private diffX: number = 0;
        private diffY: number = 0;
        private width: number = null;
        private height: number = null;

        public isGrowingX = () => {
            return this.diffX > 0;
        };

        public isGrowingY = () => {
            return this.diffY > 0;
        };

        public isShrinkingX = () => {
            return this.diffX < 0;
        };

        public isShrinkingY = () => {
            return this.diffY < 0;
        };

        public updateWidth = (newWidth: number) => {
            if (this.width !== null) {
                this.diffX = this.width - newWidth;
            }
            
            this.width = newWidth;
        };
        
        public updateHeight = (newHeight: number) => {
            if (this.height !== null) {
                this.diffY = this.height - newHeight;
            }
            
            this.height = newHeight;
        };
    }

    export class SplitterStatic {
        public static PANEL_MIN_WIDTH: number = 200;
        public static PANEL_COLLAPSED_WIDTH: number = 48;
        public static PANEL_AUTO_OPEN_WIDTH: number = 50;
        public static PANEL_AUTO_COLLAPSE_WIDTH: number = 150;
        public static PANEL_ANIMATION_DURATION: number = 50;
        public static COLLAPSED_CLASS: string = "collapsed";
        public static RESIZABLE_SELECTOR: string = "[class |= ui-resizable-]";
        public static RESIZABLE_CLASS_PREFIX: string = "ui-resizable-";
        public static HELPER_CLASS_PREFIX: string = "ui-resizable-helper-";
        public static COLLAPSE_EVENT: string = "collapse";
        public static RESIZE_EVENT: string = "splitter.resized";
        public static IS_AW_EXPANDED: string = "isawexpanded";
        public static IS_SPLITTER_BUTTON_ENABLED = "issplitterbuttonenabled";
        public static SPLITTER_DIV = "splitterDiv";
        public static SPLITTER_BUTTON = "splitterButton";
        public static SPLITTER_ICON = "splitterIcon";
        public static SPLITTER_BUTTON_ICON = "splitterButtonIcon";
        public static SPLITTER_BUTTON_ICON_UP = "splitterButtonIconUp";
        public static SPLITTER_BUTTON_ICON_DOWN = "splitterButtonIconDown";

        public static createSplitter(resizable: JQuery, options: any) {
            // remove existing splitter (if it exists)
            if (resizable.is(SplitterStatic.RESIZABLE_SELECTOR)) {
                (<any>resizable).resizable("destroy");
            }

            resizable.addClass(SplitterStatic.RESIZABLE_CLASS_PREFIX + options.location);

            // add new splitter
            (<any>resizable).resizable(options);
        }
        
        // convert the location into its cardinal direction
        public static getHandle(location: string) {
            switch (location) {
                case "top":
                    return "n";
                case "left":
                    return "w";
                case "bottom":
                    return "s";
                case "right":
                    return "e";
                default:
                    return "s";
            }
        }
        
        // toggles the collapsed class if the width is small enough
        public static toggleCollapsed(panel: JQuery, width: number) {
            if (width <= SplitterStatic.PANEL_COLLAPSED_WIDTH) {
                panel.addClass(SplitterStatic.COLLAPSED_CLASS);
            } else {
                panel.removeClass(SplitterStatic.COLLAPSED_CLASS);
            }

            panel.trigger(SplitterStatic.COLLAPSE_EVENT, panel.hasClass(SplitterStatic.COLLAPSED_CLASS));
        }

        public static getDim(location: string) {
            return (location === "top" || location === "bottom") ? "height" : "width";
        }

        public static restoreSplitter = (resizable: JQuery, splitterKey: string, dimension: string = "flex-basis", defaultPosition: string = null) => {
            let position = defaultPosition;
            
            // get a position from local storage when applicable
            if (splitterKey && position === null && localStorage.getItem(splitterKey) ) {
                position = localStorage.getItem(splitterKey);
            }
            
            // restore it if we have any value
            if (position) {
                let resetProperties = {};
                resetProperties[dimension] = position;
                resetProperties["flex-grow"] = 0;

                resizable.css(resetProperties);
                resizable.trigger(SplitterStatic.RESIZE_EVENT, position);
            }
        }

        public static saveSplitter = (splitterKey: string, value: string) => {
            localStorage.setItem(splitterKey, value);
        };
        
        // add extra info to the key to specify it holds the collapsed value
        public static collapsedKey(key: string) {
            return key + "." + SplitterStatic.COLLAPSED_CLASS;
        }
        
        // if there's a collpased key, collapse the panel
        public static restoreCollapsed = (panel: JQuery, key: string) => {
            let collapsedKey = SplitterStatic.collapsedKey(key);

            if (localStorage.getItem(collapsedKey)) {
                panel.addClass(SplitterStatic.COLLAPSED_CLASS);
            }
        };
        
        public static updateWidth(jquery: JQuery, width: number){
            jquery.css({"flex-basis":width, height: "", width: ""});
        }
        
        public static createSplitterButton(resizable: JQuery) { 
            if (!resizable.find("." + SplitterStatic.SPLITTER_BUTTON).length) {    
                // Initial creation
                var div = resizable.find("." + SplitterStatic.RESIZABLE_CLASS_PREFIX + "s");
                var button = document.createElement("div");
                let icon = document.createElement("span");
                $(icon).addClass(SplitterStatic.SPLITTER_BUTTON_ICON);
                $(button).addClass(SplitterStatic.SPLITTER_BUTTON);
                div.append(button);
                $(button).append(icon);
                $(button).attr("data-bind", "click: moveSplitter");
            }
            // Toggling icon arrow direction
            let icon = resizable.find("." + SplitterStatic.SPLITTER_BUTTON_ICON);
            $(icon).removeClass((localStorage.getItem(SplitterStatic.IS_AW_EXPANDED) === "true") ? SplitterStatic.SPLITTER_BUTTON_ICON_UP : SplitterStatic.SPLITTER_BUTTON_ICON_DOWN);
            $(icon).addClass((localStorage.getItem(SplitterStatic.IS_AW_EXPANDED) === "true") ? SplitterStatic.SPLITTER_BUTTON_ICON_DOWN : SplitterStatic.SPLITTER_BUTTON_ICON_UP);
        }
        
        public static createSplitterIcon(resizable: JQuery) {
            var div = resizable.find("." + SplitterStatic.SPLITTER_DIV);
            var icon = document.createElement("span");
            $(icon).addClass(SplitterStatic.SPLITTER_ICON);
            div.append(icon);
        }
    }

    export interface ISplitterControlValueAccessor {
        key?: string;
        location?: string;
        close?: KnockoutObservable<boolean>;
        moveSplitter?: KnockoutObservable<boolean>;
        position?: string;
        startSize?: string;
    };
    
    export interface IExtendedSplitterControlOptions extends ISplitterControlValueAccessor {
        stop: any;
    };

    // Generic splitter control binding
    export class SplitterControlBinding implements KnockoutBindingHandler {

        public init(element: HTMLElement, valueAccessor: () => ISplitterControlValueAccessor): void | { controlsDescendantBindings: boolean; } {
            let options = valueAccessor();
            if (options.close) {
                ko.applyBindingsToNode(element, {
                    visible: ko.pureComputed(() => { return !options.close()} ) 
                });
            }
            if (options.startSize && !localStorage.getItem(options.key)) {
                $(element).css({ "flex-basis": options.startSize });
                SplitterStatic.saveSplitter(options.key, options.startSize);
            }
            if (options.moveSplitter) {
                localStorage.setItem(SplitterStatic.IS_SPLITTER_BUTTON_ENABLED, "true");
                options.moveSplitter.subscribe(function(newValue) {
                    localStorage.setItem(SplitterStatic.IS_AW_EXPANDED, localStorage.getItem(SplitterStatic.IS_AW_EXPANDED) === "true" ? "false" : "true");
                });
            } else {
                localStorage.setItem(SplitterStatic.IS_SPLITTER_BUTTON_ENABLED, "false");
            }

            return { controlsDescendantBindings: false };
        }

        public update = (element: HTMLElement, valueAccessor: () => ISplitterControlValueAccessor, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext) => {
            // paverma Confirm why we are or'ing with {}? Do we allow creation of splitters without a key?
            var options: ISplitterControlValueAccessor = valueAccessor() || {};

            // unwrap all observable properties
            for (var prop in options) {
                if (prop !== "close") {
                    options[prop] = ko.unwrap(options[prop]);        
                }
            }

            // set default location if it doesn't exist
            options.location = options.location ? options.location : "bottom";

            let resizable: JQuery = $(element);
      
            // add other default properties
            let extendedOptions: IExtendedSplitterControlOptions = $.extend({
                helper: SplitterStatic.HELPER_CLASS_PREFIX + options.location,
                handles: SplitterStatic.getHandle(options.location),
                stop: $.noop,
                minHeight: 2,
                minWidth: 2
            }, options);
            
            // add our own stop handler which will call theirs
            extendedOptions.stop = this.onStop(extendedOptions.location, extendedOptions.key, extendedOptions.stop);

            // the position is just the initial flex-basis of the element
            var position;
            if(localStorage.getItem(SplitterStatic.IS_AW_EXPANDED) === "true") { 
                position = "8px";
            } else {
                position = extendedOptions.position;
            }
            SplitterStatic.restoreSplitter(resizable, extendedOptions.key, "flex-basis", position);
            SplitterStatic.createSplitter(resizable, extendedOptions);
            var div = resizable.find("." + SplitterStatic.RESIZABLE_CLASS_PREFIX + "handle");
            div.addClass(SplitterStatic.SPLITTER_DIV);
            if (localStorage.getItem(SplitterStatic.IS_SPLITTER_BUTTON_ENABLED) === "true") {
                SplitterStatic.createSplitterButton(resizable);
            } else {
                SplitterStatic.createSplitterIcon(resizable);
            }
        }

        private onStop = (location: string, splitterKey: string, onStop: (event: Object, ui: Object) => {}) => {
            return (event: Event, ui: { element: JQuery, size: { width: number, height: number } }) => {
                // reset splitterButton if the splitter is moved
                localStorage.setItem(SplitterStatic.IS_AW_EXPANDED, "false");
                if (localStorage.getItem(SplitterStatic.IS_SPLITTER_BUTTON_ENABLED) === "true") {
                    var icon = $(ui.element).find("." + SplitterStatic.SPLITTER_BUTTON_ICON);
                    $(icon).removeClass(SplitterStatic.SPLITTER_BUTTON_ICON_DOWN);
                    $(icon).addClass(SplitterStatic.SPLITTER_BUTTON_ICON_UP);
                }
                // update the flex
                let value = ui.size[SplitterStatic.getDim(location)];

                ui.element.css({ "flex-basis": value, width: '', height: '', "flex-grow": 0 });

                if (splitterKey) {
                    SplitterStatic.saveSplitter(splitterKey, value + "px");
                }
                
                // call the user's onstop
                onStop(event, ui);
            };
        }
    }

    // Specifically handles the splitters
    export class PanelSplitterControlBinding implements KnockoutBindingHandler {
        public resizeCover: JQuery = null;
        
        public static leftPanelKey: string = "shell-leftPanelKey";
        public static rightPanelKey: string = "shell-rightPanelKey";
        public static leftPanelSelector: string = ".leftSidePanel";
        public static centerSelector: string = ".centerPanel";
        public static rightPanelSelector: string = ".rightSidePanel";
        
        constructor() {
            this.resizeCover = $("<div class='resizeCover'></div>");
            $("body").append(this.resizeCover);
            this.resizeCover.hide();
        }

        public init(element: HTMLElement, valueAccessor: () => any): void | { controlsDescendantBindings: boolean; } {

            return { controlsDescendantBindings: false };
        }

        public update = (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any,
            viewModel: any, bindingContext: KnockoutBindingContext) => {
            let parent = $(element);
            let leftPanel = parent.find(PanelSplitterControlBinding.leftPanelSelector);
            let centerPanel: JQuery = parent.find(PanelSplitterControlBinding.centerSelector);
            let rightPanel: JQuery = parent.find(PanelSplitterControlBinding.rightPanelSelector);

            this.createSplitter(leftPanel, rightPanel, centerPanel, "right");
            this.createSplitter(rightPanel, leftPanel, centerPanel, "left");

            SplitterStatic.restoreSplitter(leftPanel, PanelSplitterControlBinding.leftPanelKey);
            SplitterStatic.restoreSplitter(rightPanel, PanelSplitterControlBinding.rightPanelKey);

            SplitterStatic.restoreCollapsed(leftPanel, PanelSplitterControlBinding.leftPanelKey);
            SplitterStatic.restoreCollapsed(rightPanel, PanelSplitterControlBinding.rightPanelKey);
            
            // Handle events
            leftPanel.on(SplitterStatic.RESIZE_EVENT, this.onResized(PanelSplitterControlBinding.leftPanelKey));
            rightPanel.on(SplitterStatic.RESIZE_EVENT, this.onResized(PanelSplitterControlBinding.rightPanelKey));
            leftPanel.on(SplitterStatic.COLLAPSE_EVENT, this.onCollapse(PanelSplitterControlBinding.leftPanelKey));
            rightPanel.on(SplitterStatic.COLLAPSE_EVENT, this.onCollapse(PanelSplitterControlBinding.rightPanelKey));
        };

        private createSplitter(panel: JQuery, otherPanel: JQuery, center: JQuery, location: string) {
            let sizeTracker: SizeTracker = new SizeTracker();
            
            // wrap the width in an object to pass by reference
            let helperDims = { panelWidth: null, windowWidth:null };

            let onResize = (event: Event, ui: { helper: JQuery, position: {top: number, left: number}, 
                            size: { width: number, height: number } }) => {
                sizeTracker.updateWidth(ui.size.width);
                let helperWidth: number = null;

                // if this panel is less than the min width, adjust accordingly
                if (ui.size.width < SplitterStatic.PANEL_MIN_WIDTH) {
                    if (sizeTracker.isGrowingX()) {
                        helperWidth = ui.size.width > SplitterStatic.PANEL_AUTO_OPEN_WIDTH ? SplitterStatic.PANEL_MIN_WIDTH : SplitterStatic.PANEL_COLLAPSED_WIDTH;
                    } else if (sizeTracker.isShrinkingX()) {
                        helperWidth = ui.size.width < SplitterStatic.PANEL_AUTO_COLLAPSE_WIDTH ? SplitterStatic.PANEL_COLLAPSED_WIDTH : SplitterStatic.PANEL_MIN_WIDTH;
                    }
                };
               
                // if we should update the helper to a new width
                if (helperWidth !== null) {
                    ui.helper.css({ width: helperWidth, left: ui.position.left === 0 ? 0 : helperDims.windowWidth - helperWidth});
                }

                // update the object
                helperDims.panelWidth = helperWidth === null ? ui.size.width : helperWidth;
            };

            let onStop = (event: Event, ui: { element: JQuery, helper: JQuery, size: { width: number, height: number } }) => {
                this.resizeCover.hide();
                
                // update our width to be our helper width
                ui.size.width = helperDims.panelWidth;
                SplitterStatic.updateWidth(panel, Math.max(ui.size.width, SplitterStatic.PANEL_MIN_WIDTH));

                // Collapse ourself if we need to
                SplitterStatic.toggleCollapsed(panel, ui.size.width);
                
                panel.trigger(SplitterStatic.RESIZE_EVENT, ui.size.width);
                
                 // if we no longer have a center, resize the other panel accordingly
                if(center.width() === 0) {
                    let newWidth: number = Math.max(helperDims.windowWidth - ui.size.width, SplitterStatic.PANEL_MIN_WIDTH);
                    
                    SplitterStatic.updateWidth(otherPanel, newWidth);
                    otherPanel.trigger(SplitterStatic.RESIZE_EVENT, newWidth);
                }
            };

            let onStart = (event: Event, ui: { element: JQuery, size: { width: number, height: number } }) => {
                this.resizeCover.show();
                
                // initialize the window width every time
                helperDims.windowWidth = $(window).width();
                
                // Set the max to be the entire window minus the collapsed length (so there's room for the opposite panel)
                (<any>panel).resizable("option", "maxWidth", helperDims.windowWidth - SplitterStatic.PANEL_MIN_WIDTH);

                // height should not be modifiable
                (<any>panel).resizable("option", "maxHeight", ui.size.height);
                (<any>panel).resizable("option", "minHeight", ui.size.height);

                helperDims.panelWidth = ui.size.width;
            };
            
            // add default properties
            let options: any = {
                location: location,
                helper: SplitterStatic.HELPER_CLASS_PREFIX + location,
                handles: SplitterStatic.getHandle(location),
                stop: onStop,
                start: onStart,
                resize: onResize,
                minWidth: SplitterStatic.PANEL_COLLAPSED_WIDTH
            };

            // remove existing splitter (if it exists)
            if (panel.is(SplitterStatic.RESIZABLE_SELECTOR)) {
                (<any>panel).resizable("destroy");
            }

            panel.addClass("noAnimation");
            panel.css("overflow", "hidden");

            SplitterStatic.createSplitter(panel, options);
        }
        
        // Store resize state on each resize event
        private onResized = (key: string) => {
            return (event: Event, value: number) => {            
                // don't save info for collapsed panels
                if (value <= SplitterStatic.PANEL_COLLAPSED_WIDTH) {
                    return;
                }

                SplitterStatic.saveSplitter(key, value + "px");
            }
        }
        
        // Store collapsed state for each collapse
        private onCollapse = (key: string) => {
            return (event: Event, collapsed: boolean) => {
                let collapsedKey = SplitterStatic.collapsedKey(key);

                if (collapsed) {
                    localStorage.setItem(collapsedKey, "1");
                } else {
                    localStorage.removeItem(collapsedKey);
                }
            }
        }
    }

    ko.bindingHandlers["splitter"] = new SplitterControlBinding();
    ko.bindingHandlers["panelSplitter"] = new PanelSplitterControlBinding();
};


