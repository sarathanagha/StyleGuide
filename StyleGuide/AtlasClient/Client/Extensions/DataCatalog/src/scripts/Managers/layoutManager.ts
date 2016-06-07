module Microsoft.DataStudio.DataCatalog.Managers {
    export class LayoutManager {
        public static leftTitle: KnockoutObservable<string>;
        public static leftComponent: KnockoutObservable<string>;
        public static leftExpanded: KnockoutObservable<boolean>;
        public static leftWidth: KnockoutObservable<string>;
        public static leftDuration: KnockoutObservable<number>;

        public static centerComponent: KnockoutObservable<string>;

        public static rightTitle: KnockoutObservable<string>;
        public static rightComponent: KnockoutObservable<string>;
        public static rightExpanded: KnockoutObservable<boolean>;
        public static rightWidth: KnockoutObservable<string>;
        public static rightDuration: KnockoutObservable<number>;

        public static bottomTitle: KnockoutObservable<string>;
        public static bottomComponent: KnockoutObservable<string>;
        public static bottomExpanded: KnockoutObservable<boolean>;
        public static bottomHeight: KnockoutObservable<string>;
        public static bottomDuration: KnockoutObservable<number>;

        public static showLeft: KnockoutObservable<boolean>;
        public static showRight: KnockoutObservable<boolean>;
        public static showCenter: KnockoutObservable<boolean>;
        public static showBottom: KnockoutObservable<boolean>;

        public static leftFocus: KnockoutObservable<string>;
        public static rightFocus: KnockoutObservable<string>;
        public static centerFocus: KnockoutObservable<string>;
        public static bottomFocus: KnockoutObservable<string>;

        private static adjustmentTimer: number;

        static init() {
            var self = this;

            LayoutManager.leftTitle = ko.observable<string>();
            LayoutManager.leftComponent = ko.observable<string>();
            LayoutManager.leftExpanded = ko.observable<boolean>();
            LayoutManager.leftWidth = ko.observable<string>();
            LayoutManager.leftDuration = ko.observable<number>();

            LayoutManager.centerComponent = ko.observable<string>();

            LayoutManager.rightTitle = ko.observable<string>();
            LayoutManager.rightComponent = ko.observable<string>();
            LayoutManager.rightExpanded = ko.observable<boolean>();
            LayoutManager.rightWidth = ko.observable<string>();
            LayoutManager.rightDuration = ko.observable<number>();

            LayoutManager.bottomTitle = ko.observable<string>();
            LayoutManager.bottomComponent = ko.observable<string>();
            LayoutManager.bottomExpanded = ko.observable<boolean>();
            LayoutManager.bottomHeight = ko.observable<string>();
            LayoutManager.bottomDuration = ko.observable<number>();

            LayoutManager.showLeft = ko.observable<boolean>();
            LayoutManager.showRight = ko.observable<boolean>();
            LayoutManager.showCenter = ko.observable<boolean>();
            LayoutManager.showBottom = ko.observable<boolean>();

            LayoutManager.leftFocus = ko.observable<string>("left-container");
            LayoutManager.rightFocus = ko.observable<string>("right-container");
            LayoutManager.centerFocus = ko.observable<string>("center-container");
            LayoutManager.bottomFocus = ko.observable<string>("bottom-container");

            LayoutManager.unmask();
        }

        static getCenterPanelContent() {
            return $(".center-panel-content");
        }

        static isMasked: KnockoutObservable<boolean> = ko.observable(false);

        static unmask() {
            if (this.isMasked()) {
                $(".layout-container .masked-pane").removeClass("masked-pane");
                $(".layout-container .layout-backdrop").removeClass("mask");
                setTimeout(() => {
                    $(".layout-container .layout-backdrop").removeClass("top");
                }, 150);
                this.isMasked(false);
            }
        }

        static maskRight() {
            $(".right-panel").addClass("masked-pane");
            $(".layout-container .layout-backdrop").addClass("mask top");
            this.isMasked(true);
        }

        static maskBottom() {
            $(".bottom-panel").addClass("masked-pane");
            $(".layout-container .layout-backdrop").addClass("mask top");
            this.isMasked(true);
        }

        static slideCenterToTheLeft(onBeforeAnimate?: () => void) {
            this._slideCenter((a, b) => a - b, (a, b) => a + b, onBeforeAnimate);
        }

        static slideCenterToTheRight(onBeforeAnimate?: () => void) {
            this._slideCenter((a, b) => a + b, (a, b) => a - b, onBeforeAnimate);
        }

        static adjustAsset() {
            if (LayoutManager.adjustmentTimer) {
                clearTimeout(LayoutManager.adjustmentTimer);
            }
            LayoutManager.adjustmentTimer = setTimeout(LayoutManager.adjustScrollIfNecessary, 100);
        }

        private static _slideCenter(leftOperation: (a: number, b: number) => number,
            rightOperation: (a: number, b: number) => number,
            onBeforeAnimate?: () => void) {

            onBeforeAnimate = onBeforeAnimate || (() => { });
            var duration = 500;
            var centerContainer = $(".center-panel-container");

            // Add clone
            var centerClone = centerContainer.clone();
            centerClone.addClass("clone");
            var parent = $(".center-panel-content");
            parent.append(centerClone);

            // Reposition real container
            parent.css("overflow", "hidden");
            var width = centerContainer.width() + 15;
            var originalLeft = parseInt(centerContainer.css("left"), 10);
            var originalRight = parseInt(centerContainer.css("right"), 10);
            centerContainer.css("left", rightOperation(originalLeft, width));
            centerContainer.css("right", leftOperation(originalRight, width));

            onBeforeAnimate();

            // Animate slide
            centerClone.animate({
                left: leftOperation(originalLeft, width),
                right: rightOperation(originalRight, width)
            }, duration, () => {
                    centerClone.remove();
                });

            centerContainer.animate({
                left: originalLeft,
                right: originalRight
            }, duration, () => {
                    centerContainer.css("left", "");
                    centerContainer.css("right", "");
                    parent.css("overflow", "");
                });

        }

        private static adjustScrollIfNecessary() {
            clearTimeout(LayoutManager.adjustmentTimer);
            var selected: JQuery = $(".center-panel .selected");
            if (selected.length === 1) {
                var asset = selected[0];
                var container = $(".center-panel-content")[0];
                var cur = $(container).scrollTop();
                var offset = $(container).offset().top + $(".heading").height(); // Adjust for positioning on the page and the browse heading.
                var diff = $(asset).offset().top - offset;
                $(container).animate({ scrollTop: (diff + cur) }, 250);
            }
        }
    }
}

Microsoft.DataStudio.DataCatalog.Managers.LayoutManager.init();