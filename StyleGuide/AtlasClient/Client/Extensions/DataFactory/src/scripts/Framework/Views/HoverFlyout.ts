/// <reference path="../../../References.d.ts" />
import Hulljs = require("Hulljs");
import Log = require("../Util/Log");

"use strict";

let logger = Log.getLogger({
    loggerName: "HoverFlyout"
});

/**
 * Common functions to create a WinJS Flyout that disappears based on hover rather
 * than click
 */

export const ACTION_FOR_SHOW = "mouseenter";
export const FLYOUT_SHOW_DELAY_MS = 200; // in milliseconds

const flyoutClickeaterSelector = ".win-flyoutmenuclickeater";

let afterFlyoutShows: () => void, beforeFlyoutHides: () => void;

// hide if user moves outside of anchor element
export function setupFlyoutAutohide(flyout: WinJS.UI.Flyout, anchor: Element): void {

    let clickEaterMouseMoveListener: (mouseevent: MouseEvent) => void;
    let clickEaterElement = $(flyoutClickeaterSelector)[0];
    let boundedConvexPolygon: IPoint[] = null;

    afterFlyoutShows = () => {
        flyout.addEventListener("beforehide", beforeFlyoutHides);

        let verticesToCover: IPoint[] = getRectVertices(flyout.element.getBoundingClientRect());
        verticesToCover = verticesToCover.concat(getRectVertices(anchor.getBoundingClientRect()));
        boundedConvexPolygon = Hulljs(verticesToCover, Infinity, [".x", ".y"]);

        clickEaterElement.addEventListener("mousemove", clickEaterMouseMoveListener);
    };

    flyout.addEventListener("aftershow", afterFlyoutShows);

    beforeFlyoutHides = () => {
        clickEaterElement.removeEventListener("mousemove", clickEaterMouseMoveListener);
        boundedConvexPolygon = null;
        flyout.removeEventListener("aftershow", afterFlyoutShows);
        flyout.removeEventListener("beforehide", beforeFlyoutHides);
    };

    clickEaterMouseMoveListener = (mouseevent: MouseEvent) => {
        let curPos: IPoint = { x: mouseevent.clientX, y: mouseevent.clientY };
        if (!isPointInsideConvexPolygon(curPos, boundedConvexPolygon)) {
            flyout.hide();
        }
    };
};

/**
 * Removes all flyout event listeners
 */
export function removeListenersForElement(element: HTMLElement) {
    element.removeEventListener("aftershow", afterFlyoutShows);
    element.removeEventListener("beforehide", beforeFlyoutHides);
}

interface IPoint {
    x: number;
    y: number;
};

function getRectVertices(clientRect: ClientRect): IPoint[] {
    let x1: number = clientRect.left;
    let x2: number = clientRect.left + clientRect.width;
    let y1: number = clientRect.top;
    let y2: number = clientRect.top + clientRect.height;

    return [{ x: x1, y: y1 }, { x: x2, y: y1 }, { x: x2, y: y2 }, { x: x1, y: y2 }];
}

// Points on boundary are considered to be inside the polygon.
function isPointInsideConvexPolygon(p: IPoint, polygon: IPoint[]): boolean {
    if (polygon.length < 3) {
        logger.logError("Too few points specified for polygon");
    }
    let centroid: IPoint = { x: 0, y: 0 };
    for (let i = 0; i < polygon.length; i++) {
        centroid.x += polygon[i].x / polygon.length;
        centroid.y += polygon[i].y / polygon.length;
    }

    for (let i = 0; i < polygon.length; i++) {
        let a = polygon[i];
        let b = polygon[(i + 1) % polygon.length];
        if (sideSign(p, a, b) * sideSign(centroid, a, b) < 0) {
            return false;
        }
    }
    return true;
}

/**
 * Consider the line L created by points l1 and l2.
 * Method returns: 0 if a lines on L, a positive/negative number if it lies on the either side of L.
 * We are not concerned about which side would be represented by the positive sign or the magnitude of
 * the return value. All the points lying on one side will return the same sign.
 */
function sideSign(a: IPoint, l1: IPoint, l2: IPoint): number {
    let mf = l1.y - l2.y;
    let mc = l2.y * l1.x - l1.y * l2.x;
    return mf * a.x + mc - a.y * (l1.x - l2.x);
}
