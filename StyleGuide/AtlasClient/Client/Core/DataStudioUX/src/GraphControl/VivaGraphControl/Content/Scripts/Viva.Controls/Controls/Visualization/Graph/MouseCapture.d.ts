export = Main;
declare module Main {
    /**
     * A wrapper for registering and unregistering events.
     */
    class EventListenerSubscription {
        private _handler;
        private _useCapture;
        private _eventType;
        private _element;
        /**
         * Constructs a wrapper for event listeners that can remove them on dispose.
         *
         * @param element The element on which to attach the listener.
         * @param eventType The type of event to register (e.g. mousedown, focus, etc.).
         * @param handler The callback to fire when the event occurs.
         * @param useCapture False uses bubble semantics. True uses capture semantics.
         */
        constructor(element: EventTarget, eventType: string, handler: (e: Event) => void, useCapture?: boolean);
        /**
         * Remove the registered event listeners.
         */
        dispose(): void;
    }
    /**
     * A class for handling and tracking drags. Works if the user drags anywhere on the screen, even outside the browser window.
     * Works with multiple mouse buttons and retains the drag until all buttons are released.
     */
    class MouseCapture {
        private _buttonsDown;
        private _mouseMoveHandler;
        private _mouseUpHandler;
        private _beginCapture;
        private _endCapture;
        private _mouseDownOrigin;
        private _mouseUpSubscription;
        private _mouseMoveSubscription;
        private _endCaptureSubscription;
        private _countMouseDownsSubscription;
        private _beginCaptureSubscription;
        /**
         * Create a mouse capture class that tracks mouse drags.
         *
         * @param mouseDownOrigin The element on which a mouse down begins tracking a drag.
         * @param mouseMoveHandler What to do when the user drags the mouse with a button down.
         * @param mouseUpHandler What to do when the user releases a mouse button in the drag.
         */
        constructor(mouseDownOrigin: Element, mouseMoveHandler: (e: MouseEvent) => void, mouseUpHandler: (e: MouseEvent) => void);
        /**
         * Disposes of the mouse capture class.
         */
        dispose(): void;
    }
}
