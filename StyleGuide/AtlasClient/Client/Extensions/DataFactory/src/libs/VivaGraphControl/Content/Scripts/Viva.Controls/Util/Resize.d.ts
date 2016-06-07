/// <reference path="../../Definitions/jquery.d.ts" />
import Base = require("../Controls/Base/Base");
export = Main;
declare module Main {
    /**
     * Hooks up cross browser resize detection event (ie, webkit, moz).
     *
     * @param element The element to monitor size changes.
     * @param handler The resize event handler.
     * @return The method to dispose the event.
     */
    function track(element: JQuery, handler: (width?: number, height?: number) => void): Base.Disposable;
}
