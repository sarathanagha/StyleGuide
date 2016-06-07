module Microsoft.DataStudio.DataCatalog.Bindings {
    export class LayoutPanelBindingHander {
        update(element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var position = allBindings.get("position") || "left";
            var duration = parseInt(allBindings.get("duration") || "400", 10);
            var animationPromise = $.Deferred().resolve().promise();

            // The first time here, set the initial state with no duration
            var hasBeenInitialized = $(element).data("init");
            var animationDuration = hasBeenInitialized ? duration : 0;

            if (position === "left" || position === "right") {
                var panelWidth = $(element).width();
                var togglerWidth = $(".toggler", element).width();
                var hSlideDistance = panelWidth - togglerWidth;
                var centerPanel = $(element).siblings(".center-panel");

                if (value) {
                    $(element).addClass("expanded");

                    var panelVisible = {};
                    panelVisible[position] = 0;
                    $(element).animate(panelVisible, animationDuration);

                    var centerWithPanelVisible = {};
                    centerWithPanelVisible[position] = panelWidth;
                    animationPromise = centerPanel.animate(centerWithPanelVisible, animationDuration).promise();
                } else {

                    var panelHidden = {};
                    panelHidden[position] = -hSlideDistance;
                    $(element).animate(panelHidden, animationDuration, "swing", () => {
                        $(element).removeClass("expanded");
                    });

                    var centerWithPanelHidden = {};
                    centerWithPanelHidden[position] = togglerWidth;
                    animationPromise = centerPanel.animate(centerWithPanelHidden, animationDuration).promise();
                }
            } else if (position === "bottom") {
                var panelHeight = $(element).height();
                var togglerHeight = $(".toggler", element).height();
                var vSlideDistance = panelHeight - togglerHeight;
                var centerPanelContent = $(element).siblings(".center-panel-content");

                if (value) {
                    $(element).addClass("expanded");
                    $(element).animate({ bottom: 0 }, animationDuration);
                    animationPromise = centerPanelContent.animate({ bottom: panelHeight }, animationDuration).promise();
                } else {
                    $(element).animate({ bottom: -vSlideDistance }, animationDuration, "swing", () => {
                        $(element).removeClass("expanded");
                    });
                    animationPromise = centerPanelContent.animate({ bottom: togglerHeight }, animationDuration).promise();
                }
            } else {
                throw new Error("unsupported position set to layout binding");
            }

            animationPromise.done(() => {
                Managers.LayoutManager.adjustAsset();
            });

            $(element).data("init", true);
        }
    }

    export class LayoutResizeableBindingHander {
        update(element, valueAccessor, allBindings) {
            var position = ko.unwrap(valueAccessor());
            var container = $(element).parents(".layout-container");
            var leftPanel = $(".left-panel", container);
            var centerPanel = $(".center-panel", container);
            var centerPanelContent = $(".center-panel-content", container);
            var bottomPanel = $(".bottom-panel", container);
            var rightPanel = $(".right-panel", container);

            $(element).mousedown((e) => {
                var isExpanded = $(element).parent().is(".expanded");
                if (isExpanded) {
                    var t = container.offset().top;
                    var l = container.offset().left;
                    var r = container.width() + l;

                    var mouseMove = (e) => {
                        var left = e.clientX - l;
                        var height = e.clientY - t;
                        var right = r - e.clientX;

                        if (position === "left") {
                            var lw = leftPanel.width() + centerPanel.width();

                            left = Math.min(left, lw - 350);
                            left = Math.max(left, 200);

                            leftPanel.css({ width: left + "px" });
                            centerPanel.css({ left: left });
                            $("body").css("cursor", "ew-resize");
                        }
                        if (position === "right") {
                            var rw = centerPanel.width() + rightPanel.width();

                            right = Math.min(right, rw - 350);
                            right = Math.max(right, 200);

                            rightPanel.css({ width: right + "px" });
                            centerPanel.css({ right: right });
                            $("body").css("cursor", "ew-resize");
                        }
                        if (position === "bottom") {
                            var centerPanelHeight = centerPanel.height();
                            var bottom = centerPanelHeight - height;

                            // Constrain resizeable to allow for some top and bottom remaining
                            bottom = Math.min(bottom, centerPanelHeight - 80);
                            bottom = Math.max(bottom, 100);

                            centerPanelContent.css({ bottom: bottom });
                            bottomPanel.css({ bottom: 0, height: bottom + "px" });
                            $("body").css("cursor", "ns-resize");
                        }
                    };

                    var mouseUp = (e: Event) => {
                        $("body").css("cursor", "");
                        $("body").unbind("mousemove", mouseMove).unbind("mouseup", mouseUp);
                    };

                    $("body").mousemove(mouseMove).mouseup(mouseUp);
                    e.preventDefault();
                }
            });
        }
    }
}
ko.bindingHandlers["layoutPanel"] = new Microsoft.DataStudio.DataCatalog.Bindings.LayoutPanelBindingHander();
ko.bindingHandlers["layoutResizeable"] = new Microsoft.DataStudio.DataCatalog.Bindings.LayoutResizeableBindingHander();