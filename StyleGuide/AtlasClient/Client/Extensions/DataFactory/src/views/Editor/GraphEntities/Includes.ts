/// <reference path="../../../references.d.ts" />

export import Geometry = require("./Geometry");
export import KnockoutExtensions = require("Viva.Controls/Controls/Base/KnockoutExtensions");
export import GraphContracts = require("../GraphContracts");
export import Framework = require("../../../_generated/Framework");

export interface IStartEnd {
    start: GraphContracts.IPoint;
    end: GraphContracts.IPoint;
}

export class Util {
    // we don't want the anchors to be exactly on the objects
    public static BUFFER_DISTANCE: number = 20;

    public static pointInRect(point: GraphContracts.IPoint, rect: GraphContracts.IRect) {
        return point.x >= rect.x && point.x <= rect.x + rect.width &&
            point.y >= rect.y && point.y <= rect.y + rect.height;
    }

    public static removePx(str: string) {
        return parseInt(str.substr(0, str.length - 2), 10);
    }

    public static getPoint(element: JQuery): GraphContracts.IPoint {
        return { x: Util.removePx(element.css("left")), y: Util.removePx(element.css("top")) };
    }

    public static getComputedCenterPoint(x: KnockoutObservable<number>, y: KnockoutObservable<number>,
                                         width: KnockoutObservable<number>, height: KnockoutObservable<number>): KnockoutComputed<GraphContracts.IPoint> {

        return ko.pureComputed(() => {
            return { x: x() + width() / 2, y: y() + height() / 2 };
        });
    }

    public static getSlope(p1: KnockoutObservable<GraphContracts.IPoint> | GraphContracts.IPoint,
                           p2: KnockoutObservable<GraphContracts.IPoint> | GraphContracts.IPoint): number {

        let v1 = ko.unwrap(p1), v2 = ko.unwrap(p2);

        return (v2.y - v1.y) / (v2.x - v1.x);
    }

    public static getLineStartEndSubscription(point: KnockoutObservable<GraphContracts.IPoint>,
                                              width: KnockoutObservable<number>, height: KnockoutObservable<number>, point2: KnockoutObservable<GraphContracts.IPoint>,
                                              width2: KnockoutObservable<number>, height2: KnockoutObservable<number>,
                                              line: KnockoutObservable<Geometry.Line>): KnockoutSubscription<IStartEnd> {

        let lineStartEnd = Util.getComputedIntersectsFromRectangles(point, width, height, point2, width2, height2);

        let subscription = lineStartEnd.subscribe(() => {
            line().start(lineStartEnd().start);
            line().end(lineStartEnd().end);
        });

        lineStartEnd.notifySubscribers();

        return subscription;
    }

    public static getIntersect(m: number, center: KnockoutObservable<GraphContracts.IPoint>, point: KnockoutObservable<GraphContracts.IPoint>,
                               width: KnockoutObservable<number>, height: KnockoutObservable<number>, center2: KnockoutObservable<GraphContracts.IPoint>): GraphContracts.IPoint {
        let minX = point().x - Util.BUFFER_DISTANCE, maxX = point().x + width() + Util.BUFFER_DISTANCE,
            minY = point().y - Util.BUFFER_DISTANCE, maxY = point().y + height() + Util.BUFFER_DISTANCE;

        // if the other center is on our rectangle, no collision
        if (center2().x >= minX && center2().y >= minY && center2().x <= maxX && center2().y <= maxY) {
            return null;
        }

        let y = m * (minX - center().x) + center().y;
        // we use the final condition to only pick one side of the line goes through two
        if (y >= minY && y <= maxY && center().x > center2().x) {
            return { y: y, x: minX };
        }

        y = m * (maxX - center().x) + center().y;
        if (y >= minY && y <= maxY) {
            return { y: y, x: maxX };
        }

        let x = (minY - center().y) / m + center().x;
        // same as above
        if (x >= minX && x <= maxX && center().y > center2().y) {
            return { x: x, y: minY };
        }

        x = (maxY - center().y) / m + center().x;
        if (x >= minX && x <= maxX) {
            return { x: x, y: maxY };
        }

        // this should be mathematically impossible, implying that the center is not actually inside of its own rectangle
        return null;
    }

    public static getComputedIntersectsFromRectangles(point: KnockoutObservable<GraphContracts.IPoint>,
                                                      width: KnockoutObservable<number>, height: KnockoutObservable<number>, point2: KnockoutObservable<GraphContracts.IPoint>,
                                                      width2: KnockoutObservable<number>, height2: KnockoutObservable<number>): KnockoutComputed<IStartEnd> {
        let center = Util.getComputedCenterPointFromPoint(point, width, height),
            center2 = Util.getComputedCenterPointFromPoint(point2, width2, height2);

        return ko.pureComputed(() => {
            let m = Util.getSlope(center, center2);

            let start = Util.getIntersect(m, center, point, width, height, center2),
                end = Util.getIntersect(m, center2, point2, width2, height2, center);

            if (!start || !end) {
                start = null;
                end = null;
            }

            return { start: start, end: end };
        });
    }

    public static getComputedPoint(x: KnockoutObservable<number>,
                                   y: KnockoutObservable<number>): KnockoutComputed<GraphContracts.IPoint> {
        return ko.pureComputed(() => {
            return { x: x(), y: y() };
        });
    }

    public static getComputedCenterPointFromPoint(point: KnockoutObservable<GraphContracts.IPoint>,
                                                  width: KnockoutObservable<number>, height: KnockoutObservable<number>): KnockoutComputed<GraphContracts.IPoint> {
        return ko.pureComputed(() => {
            return { x: point().x + width() / 2, y: point().y + height() / 2 };
        });
    }
}

export class Constants {
    public static CONTAINER_SELECTOR: string = ".graphContainer";
}

export interface IGraphEntity {
    id: KnockoutObservable<string>;
    selected: KnockoutObservable<boolean>;
    dispose: () => void;
}

export interface INode extends IGraphEntity {
    extensionTemplate: string;
    location: KnockoutObservable<GraphContracts.IPoint>;
    width: KnockoutObservable<number>;
    height: KnockoutObservable<number>;
    zIndex: KnockoutObservable<number>;
    _lifetimeManager: Framework.Disposable.IDisposableLifetimeManager;
}

export type NodeUIEventHandler = (node: INode, event: Event, ui) => void;
export type NodeAcceptHandler = (outputNode: INode) => boolean;
