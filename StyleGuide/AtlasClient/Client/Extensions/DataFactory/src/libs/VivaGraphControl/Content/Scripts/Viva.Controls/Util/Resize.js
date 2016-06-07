/// <reference path="../../Definitions/jquery.d.ts" />
define(["require", "exports", "./Detection", "../Base/Base.TriggerableLifetimeManager"], function (require, exports, Detection, BaseTriggerableLifetimeManager) {
    var Main;
    (function (Main) {
        "use strict";
        var global = window, $ = jQuery;
        /**
         * Hooks up cross browser resize detection event (ie, webkit, moz).
         *
         * @param element The element to monitor size changes.
         * @param handler The resize event handler.
         * @return The method to dispose the event.
         */
        function track(element, handler) {
            var width, height, elem, resizeHandler, resizeElement, overflowEvent, underflowEvent, overflowHandler, underflowHandler, reset, position, overflowElement, underflowElement, overflowContentElement, underflowContentElement;
            // Don't allow multiple uses
            if (element.children(".azc-resize").length || element.children(".azc-overflow").length || element.children(".azc-underflow").length) {
                throw new Error("Resize tracker may only be attached once to an element.");
            }
            // Save the initial state
            width = element.width();
            height = element.height();
            // Handles geting the current sizes and calling the provided handler.
            resizeHandler = function () {
                var currentWidth = element.width(), currentHeight = element.height();
                if (currentHeight !== height || currentWidth !== width) {
                    width = currentWidth;
                    height = currentHeight;
                    handler(width, height);
                }
            };
            var lifetime = new BaseTriggerableLifetimeManager.TriggerableLifetimeManager();
            Detection.Detection.Features.Events.complete().then(function () {
                if (Detection.Detection.Features.Events.divResize) {
                    var attachmentTarget = element[0];
                    // IE 10- only supports onresize with attachEvent
                    attachmentTarget.attachEvent("onresize", resizeHandler);
                    // Register the detach for disposal
                    lifetime.registerForDispose({
                        dispose: function () {
                            attachmentTarget.detachEvent("onresize", resizeHandler);
                        }
                    });
                    return lifetime;
                }
                else if (Detection.Detection.Features.Events.svgResize) {
                    // IE 11 supports onresize on svg if there is an onresize attribute
                    element.append("<svg class='azc-resize' onresize='' style='position:absolute; left: 0; top:0; width:100%; height:100%; z-index:-1'></svg>");
                    resizeElement = element.children(".azc-resize");
                    resizeElement[0].onresize = resizeHandler;
                    // If the element is not positioned make it relative
                    // so that the detection svg can use absolute positioning
                    position = element.css("position");
                    if (position === "static") {
                        element.css("position", "relative");
                    }
                    // Register the detector for disposal
                    lifetime.registerForDispose({
                        dispose: function () {
                            resizeElement.remove();
                            // Restore original position
                            if (position === "static") {
                                element.css("position", position);
                            }
                        }
                    });
                    return lifetime;
                }
                else if (Detection.Detection.Features.Events.overflowchanged) {
                    // Webkit supports overflowchanged event with event parameters to distinguish overflow/underflow.
                    overflowEvent = "overflowchanged";
                    underflowEvent = "overflowchanged";
                    overflowHandler = function (evt) {
                        if (evt.originalEvent && (evt.originalEvent.horizontalOverflow === true || evt.originalEvent.verticalOverflow === true)) {
                            resizeHandler();
                            reset();
                        }
                    };
                    underflowHandler = function (evt) {
                        if (evt.originalEvent && (evt.originalEvent.horizontalOverflow === false || evt.originalEvent.verticalOverflow === false)) {
                            resizeHandler();
                            reset();
                        }
                    };
                }
                else if (Detection.Detection.Features.Events.overflow && Detection.Detection.Features.Events.underflow) {
                    // Mozilla supports overflow/underflow events
                    overflowEvent = "overflow";
                    underflowEvent = "underflow";
                    overflowHandler = function (evt) {
                        resizeHandler();
                        reset();
                    };
                    underflowHandler = function (evt) {
                        resizeHandler();
                        reset();
                    };
                }
                else if (Detection.Detection.Features.Events.objResize) {
                    // If the element is not positioned make it relative
                    // so that the detection svg can use absolute positioning
                    position = element.css("position");
                    if (position === "static") {
                        element.css("position", "relative");
                    }
                    // Use resize event of object tag
                    element.append("<object class='azc-resize' type='text/html' style='position:absolute; left: 0; top:0; width:100%; height:100%; z-index:-1'></object>");
                    resizeElement = element.children(".azc-resize");
                    var obj = resizeElement[0];
                    resizeElement.on("load", function () {
                        obj.contentDocument.defaultView.addEventListener("resize", resizeHandler);
                    });
                    // Cause a load
                    obj.data = "about:blank";
                    // Register the detector for disposal
                    lifetime.registerForDispose({
                        dispose: function () {
                            resizeElement.remove();
                            // Restore original position
                            if (position === "static") {
                                element.css("position", position);
                            }
                        }
                    });
                    return lifetime;
                }
                else {
                    // Unable to detect element resize changes in current browser.
                    // Instead we will do it on window changes
                    // This is imperfect but should always be present
                    window.addEventListener("resize", resizeHandler);
                    // Register the removal for disposal
                    lifetime.registerForDispose({
                        dispose: function () {
                            window.removeEventListener("resize", resizeHandler);
                        }
                    });
                    return lifetime;
                }
                // Resets the overflow and underflow detection element sizes.
                reset = function () {
                    // Put the overflowElement in an underflow state such that an increase of 1px will cause an overflow.
                    overflowContentElement.width(width);
                    overflowContentElement.height(height);
                    // Puts the underflowElement in an overflow state such that a decrease of 1px will cause an underflow.
                    underflowContentElement.width(width + 1);
                    underflowContentElement.height(height + 1);
                };
                // If the element is not positioned make it relative
                // so that the detection elements can use absolute positioning
                position = element.css("position");
                if (position === "static") {
                    element.css("position", "relative");
                }
                // Append the overflow/underflow detection elements
                element.append("<div class='azc-underflow' style='position:absolute; left: 0; top:0; width:100%; height:100%; overflow:hidden; z-index:-1'>" + "<div class='azc-underflow-content'></div>" + "</div>" + "<div class='azc-overflow' style='position:absolute; left:0; top:0; width:100%; height:100%; overflow:hidden; z-index:-1'>" + "<div class='azc-overflow-content'></div>" + "</div>");
                // Save the overflow/underflow detection elements
                overflowElement = element.children(".azc-overflow");
                underflowElement = element.children(".azc-underflow");
                overflowContentElement = overflowElement.children(".azc-overflow-content");
                underflowContentElement = underflowElement.children(".azc-underflow-content");
                // Initialize the overflow/underflow detection elements
                reset();
                // Hook up the overflow/underflow events
                overflowElement.on(overflowEvent, overflowHandler);
                underflowElement.on(underflowEvent, underflowHandler);
                // Register the detector for disposal
                lifetime.registerForDispose({
                    dispose: function () {
                        // Unhook the overflow/underflow events
                        overflowElement.off(overflowEvent, overflowHandler);
                        underflowElement.off(underflowEvent, underflowHandler);
                        // Remove the overflow/underflow detection elements
                        overflowElement.remove();
                        underflowElement.remove();
                        // Restore original position
                        if (position === "static") {
                            element.css("position", position);
                        }
                    }
                });
                return lifetime;
            });
            return lifetime;
        }
        Main.track = track;
    })(Main || (Main = {}));
    return Main;
});
