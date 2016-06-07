/// <reference path="../../Definitions/jquery.d.ts" />
/// <reference path="../../Definitions/q.d.ts" />
import Promise = require("../Controls/Base/Promise");
export = Main;
declare module Main {
    /**
     * Detection of browsers and features.
     */
    class Detection {
        private static _features;
        private static _browsers;
        /**
         * Feature detection.
         *
         * @return The feature detection.
         */
        static Features: FeatureDetection;
        /**
         * Browser detection.
         * (only unit tests and feature detection should use this)
         *
         * @return The browser detection.
         */
        static Browsers: BrowserDetection;
    }
    /**
     * Browser detection.
     * (only unit tests and feature detection should use this class)
     */
    class BrowserDetection {
        private _firefox;
        private _chrome;
        private _ie;
        private _ie11;
        /**
         * Detects if the browser is Firefox
         * (only unit tests and feature detection should use this method)
         *
         * @return Indicates if the browser is Firefox.
         */
        firefox: boolean;
        /**
         * Detects if the browser is Chrome
         * (only unit tests and feature detection should use this method)
         *
         * @return Indicates if the browser is Chrome.
         */
        chrome: boolean;
        /**
         * Detects if the browser is IE
         * (only unit tests and feature detection should use this method)
         *
         * @return Indicates if the browser is IE.
         */
        ie: boolean;
        /**
         * Detects if the browser is IE11
         * (only unit tests and feature detection should use this method)
         *
         * @return Indicates if the browser is IE11.
         */
        ie11: boolean;
    }
    /**
     * Detects events that are supported in the current environment.
     */
    class EventDetection {
        private _div;
        private _overflowchanged;
        private _overflow;
        private _underflow;
        private _divResize;
        private _svgResize;
        private _objResize;
        private _overflowDeferred;
        private _underflowDeferred;
        private _divResizeDeferred;
        private _svgResizeDeferred;
        private _objResizeDeferred;
        private _detectionComplete;
        /**
         * Constructs and initializes event detection.
         */
        constructor();
        /**
         * Creates a promise that completes when all the async detections are done.
         *
         * @return The completion promise.
         */
        complete(): Promise.Promise;
        /**
         * Indicates if resize is supported on a div.
         *
         * @return True if supported.
         */
        divResize: boolean;
        /**
         * Indicates if resize is supported on an svg.
         *
         * @return True if supported.
         */
        svgResize: boolean;
        /**
         * Indicates if resize is supported on an object.
         *
         * @return True if supported.
         */
        objResize: boolean;
        /**
         * Indicates if overflowchanged method is supported.
         *
         * @return True if supported.
         */
        overflowchanged: boolean;
        /**
         * Indicates if overflow event is supported.
         *
         * @return True if supported.
         */
        overflow: boolean;
        /**
         * Indicates if underflow event is supported.
         *
         * @return True if supported.
         */
        underflow: boolean;
        /**
         * Determines if an element supports an event.
         * Works for most but not all events.
         *
         * @param event The name of the event to check.
         * @param element The element to check (div if not specified).
         * @return Indicates if the event is supported.
         */
        supported(event: string, element?: Element): boolean;
        /**
         * Detects if overflow event is supported.
         */
        private _detectOverflow();
        /**
         * Detects if underflow event is supported.
         */
        private _detectUnderflow();
        /**
         * Detects if div element supports resize event.
         */
        private _detectDivResize();
        /**
         * Detects if svg element supports resize event.
         */
        private _detectSvgResize();
        /**
         * Detects if svg element supports resize event.
         */
        private _detectObjResize();
        /**
         * Handles an event using a promise.
         *
         * @param deferred The deferred object to use.
         * @param window The window to listen on.
         * @param event The event name to listen for.
         * @param timeout The max time to wait for the event callback.
         * @return The promise.
         */
        private _windowEventPromise(deferred, window, event, timeout);
        /**
         * Handles an event using a promise.
         *
         * @param deferred The deferred object to use.
         * @param element The element to listen on.
         * @param event The event name to listen for.
         * @param timeout The max time to wait for the event callback.
         * @return The promise.
         */
        private _eventPromise(deferred, element, event, timeout);
        /**
         * Handles an on event using a promise.
         *
         * @param deferred The deferred object to use.
         * @param element The element to listen on.
         * @param event The event name to listen for.
         * @param timeout The max time to wait for the event callback.
         * @return The promise.
         */
        private _oneventPromise(deferred, element, event, timeout);
        /**
         * Handles an attach event using a promise.
         *
         * @param deferred The deferred object to use.
         * @param element The element to listen on.
         * @param event The event name to listen for.
         * @param timeout The max time to wait for the event callback.
         * @return The promise.
         */
        private _attacheventPromise(deferred, element, event, timeout);
    }
    /**
     * Detects features that are supported in the current environment.
     */
    class FeatureDetection {
        private _events;
        private _maxElementHeight;
        /**
         * Constructs the feature detection.
         */
        constructor();
        /**
         * Detected event support.
         */
        Events: EventDetection;
        /**
         * The maximum element height for the browser.
         *
         * @return Height in pixels.
         */
        maxElementHeight: number;
    }
}
