/// <amd-dependency path="text!./Templates/GraphNodeStatusTemplate.html" />

import AppContext = require("../scripts/AppContext");
import Framework = require("../_generated/Framework");
import Hulljs = require("Hulljs");
import DataConstants = Framework.DataConstants;
import Log = require("../scripts/Framework/Util/Log");
import ActivityWindowCache = require("../scripts/Framework/Model/ActivityWindowCache");
import ActivityWindowModel = require("../scripts/Framework/Model/Contracts/ActivityWindow");

import StatusCalendar = Framework.StatusCalendar;
import LifetimeManager = Framework.Disposable.DisposableLifetimeManager;
import Util = Framework.Util;

let logger = Log.getLogger({
    loggerName: "StatusCalendarFlyoutKnockoutBinding"
});

export enum FlyoutBindingType {
    Activity,
    Table
};

export interface IGraphNodeBindingValueAccessor {
    id: string;
    calendarHeader: string;
    factoryId: string;
    availabilityPromise: Q.Promise<MdpExtension.DataModels.ActivityScheduler>;
    type: FlyoutBindingType;
    table?: MdpExtension.DataModels.DataArtifact;
    activity?: MdpExtension.DataModels.Activity;
    additionalQueryFilter: string;
    recentActivityWindows?: KnockoutObservableArray<ActivityWindowCache.IActivityWindowObservable>;
};

interface IPoint {
    x: number;
    y: number;
};

// Note: The flyout is hidden only if the user moves away from the convex polygon consisting of the element which has the binding and the flyou itself.
// Thus flyout will be hidden, except when mouse is on a direct path from the element to the flyout.

let flyoutClickeaterSelector = ".win-flyoutmenuclickeater";
let actionForShow = "mouseenter";
let calendarId = "graphNodeStatusHover";
let flyoutSelector = ".adfGraphNodeStatusFlyout";   // This matches the calendar container defined in DiagramWidget.

export class GraphNodeStatusBindingHandler implements KnockoutBindingHandler {
    static className: string = DataConstants.GraphNodeStatusBindingHandler;
    public static template = require("text!./Templates/GraphNodeStatusTemplate.html");

    public init(
        element: HTMLElement,
        valueAccessor: () => IGraphNodeBindingValueAccessor,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: {},
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {
        if (!viewModel) {
            return;
        }
        let value = valueAccessor();
        element.innerHTML = GraphNodeStatusBindingHandler.template;
        let appContext = AppContext.AppContext.getInstance();

        let nodeStatus = ko.observable<StatusCalendar.IStatusBox[][]>([]);
        let shouldDisplay = ko.observable<boolean>(true);
        ko.applyBindingsToDescendants({
            nodeStatus: nodeStatus,
            shouldDisplay: shouldDisplay
        }, element);

        // If the status cannot be queried, then don't query for it. and don;t add anything to dom too.
        if (value.additionalQueryFilter === null) {
            shouldDisplay(false);
            return { controlsDescendantBindings: true };
        }

        let lifetimeManager = new LifetimeManager();
        let availability: MdpExtension.DataModels.DataArtifactAvailability = null;
        value.availabilityPromise.then((valueAvailability) => {
            availability = valueAvailability;
        });

        // Setup node status row.
        if (value.recentActivityWindows) {
            lifetimeManager.registerForDispose(Util.subscribeAndCall(value.recentActivityWindows, (recentActivityWindows) => {
                value.availabilityPromise.then(() => {
                    nodeStatus(getLastFewStatusBoxes(availability.frequency(), availability.interval(), recentActivityWindows,
                        appContext.dateRange().endDate));
                }, (reason) => {
                    if (reason) {
                        logger.logError("Failed to display graph node status for {0}, reason: {1}".format(value.calendarHeader, reason), reason);
                    }
                });
            }));
        }

        // Setup up status flyouts.
        let flyoutHostDiv: Element = bindingContext.$root.func.element.parent()[0].querySelector(flyoutSelector);
        let flyout: WinJS.UI.Flyout = flyoutHostDiv.winControl;
        let clickEaterElement = $(flyoutClickeaterSelector)[0];
        let statusCalendar = StatusCalendar.StatusCalendar.statusCalendars[calendarId];

        let boundedConvexPolygon: IPoint[] = null;

        let afterFlyoutShows: () => void, beforeFlyoutHides: () => void;
        let clickEaterMouseMoveListener: (mouseevent: MouseEvent) => void;

        afterFlyoutShows = () => {
            flyout.addEventListener("beforehide", beforeFlyoutHides);

            let verticesToCover: IPoint[] = getRectVertices(flyoutHostDiv.getBoundingClientRect());
            verticesToCover = verticesToCover.concat(getRectVertices(element.getBoundingClientRect()));
            boundedConvexPolygon = Hulljs(verticesToCover, Infinity, [".x", ".y"]);

            clickEaterElement.addEventListener("mousemove", clickEaterMouseMoveListener);
        };
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

        let frequency: string = null;
        let interval: number = null;

        let hightlightedDates = ko.pureComputed(() => {
            let hightlighted: number[]= [];
            nodeStatus().forEach((nodeStatusRow) => {
                nodeStatusRow.forEach((nodeStatusField) => {
                    hightlighted.push(nodeStatusField.date.getTime());
                });
            });
            return hightlighted;
        });
        let calendarPageCallback = (dateRange: Framework.Datetime.IDateRange): Q.Promise<StatusCalendar.IStatusBox[]> => {
            let deferred = Q.defer<StatusCalendar.IStatusBox[]>();

            getActivityWindows(value.additionalQueryFilter, dateRange.startDate, dateRange.endDate).then((activityWindows) => {
                // share sample activity window with graph node to keep dates in sync.
                if (activityWindows.length > 0 && value.recentActivityWindows && value.recentActivityWindows().length === 0) {
                    value.recentActivityWindows.push(activityWindows[0]);
                } else if (activityWindows.length === 0 && value.recentActivityWindows && value.recentActivityWindows().length > 0) {
                    activityWindows.push(value.recentActivityWindows()[0]);
                }

                let data: StatusCalendar.IStatusBox[] = activityWindows.map((activityWindow: ActivityWindowCache.IActivityWindowObservable) => {
                    let windowStartTime = new Date(activityWindow().windowStart);
                    let statusBox = <StatusCalendar.IStatusBox>{
                        date: windowStartTime,
                        status: ko.pureComputed(() => { return activityWindow().statusCalendarStatus; }),
                        tooltip: ko.pureComputed(() => {
                            return ClientResources.statusCalendarBoxTooltip.format(activityWindow().displayState, activityWindow().windowStartPair.UTC, activityWindow().windowEndPair.UTC);
                        })
                    };

                    statusBox.clickCallback = (statusBoxArg: StatusCalendar.IStatusBox) => {
                        statusCalendar.updateSelection(statusBoxArg.date);
                        AppContext.AppContext.getInstance().selectionHandler.pushState(
                            GraphNodeStatusBindingHandler.className, [new ActivityWindowCache.Encodable(activityWindow)]);
                    };

                    statusBox.doubleClickCallback = (statusBoxArg: StatusCalendar.IStatusBox) => {
                        statusBox.clickCallback(statusBoxArg);
                        AppContext.AppContext.getInstance().openActivityWindowExplorer();
                    };

                    return statusBox;
                });
                deferred.resolve(data);
            }, (reason: JQueryXHR) => {
                logger.logError("Could not load data: {0}".format(reason.responseText));
                deferred.reject("StatusCalendarFlyoutKnockoutBinding: Could not load data.");
            });

            return deferred.promise;
        };

        let showFlyout = () => {
            setTimeout(() => {
                if ((value.availabilityPromise.isFulfilled() && !value.availabilityPromise.isRejected()) && $(element).is(":hover")) {
                    frequency = availability.frequency();
                    interval = availability.interval();
                    let footer: string[] = [ClientResources.frequencyAndIntervalText.format(frequency, interval), ClientResources.datetimeInUTCLabel];
                    let returnVal = StatusCalendar.findCorrectFrequencyAndInterval(frequency, interval);
                    frequency = <string>returnVal[0];
                    interval = <number>returnVal[1];

                    let curDate: Date = appContext.dateRange().endDate;

                    statusCalendar.update({
                        header: value.calendarHeader,
                        subHeader: ClientResources.activityWindowListTitle,
                        footer: footer,
                        frequency: frequency,
                        interval: interval,
                        pageCallback: calendarPageCallback,
                        baseDate: curDate,
                        dateRange: appContext.dateRange(),
                        highlightedDates: hightlightedDates
                    }).then((updateResult) => {
                        flyout.addEventListener("aftershow", afterFlyoutShows);
                        flyout.show(element);
                    }, (reason: StatusCalendar.IStatusCalendarUpdateResult) => {
                        if (reason.result !== StatusCalendar.StatusCalendarUpdateResultEnum.aborted) {
                            logger.logError("Failed to update hover calendar: " + reason.reason);
                        }
                    });
                }
            }, 200);
        };

        element.addEventListener(actionForShow, showFlyout);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            element.removeEventListener(actionForShow, showFlyout);
            flyout.removeEventListener("aftershow", afterFlyoutShows);
            flyout.removeEventListener("beforehide", beforeFlyoutHides);
            lifetimeManager.dispose();
        });

        return { controlsDescendantBindings: true };
    }
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

function getRectVertices(clientRect: ClientRect): IPoint[] {
    let x1: number = clientRect.left;
    let x2: number = clientRect.left + clientRect.width;
    let y1: number = clientRect.top;
    let y2: number = clientRect.top + clientRect.height;

    return [{ x: x1, y: y1 }, { x: x2, y: y1 }, { x: x2, y: y2 }, { x: x1, y: y2 }];
}

function getActivityWindows(
    filter: string,
    slotStart: Date,
    slotEnd: Date,
    top?: number): Q.Promise<ActivityWindowCache.IActivityWindowObservable[]> {

    let deferred = Q.defer<ActivityWindowCache.IActivityWindowObservable[]>();

    if (!top) {
        top = StatusCalendar.maxNumberOfSlotsInACalendar;
    }
    let colNames = ActivityWindowModel.ServiceColumnNames.ExtendedProperties;
    let finalFilter = "{0} le {1} and {2} lt {3} and ({4})"
        .format(slotStart.toISOString(), colNames.WindowStart, colNames.WindowStart, slotEnd.toISOString(), filter);

    AppContext.AppContext.getInstance().activityWindowCache.fetchTop(finalFilter, "{0} desc".format(colNames.WindowStart), top)
        .then((activityRunPrimaryEvents) => {
            activityRunPrimaryEvents.reverse();
            deferred.resolve(activityRunPrimaryEvents);
        }, (reason: JQueryXHR) => {
            logger.logError("Failed to fetch activity window: {0}".format(reason.responseText));
            deferred.reject(ClientResources.failedToFetchActivityWindowText);
        });

    return deferred.promise;
}

function getLastFewStatusBoxes(
    frequency: string,
    interval: number,
    recentActivityWindows: Framework.ActivityWindowCache.IActivityWindowObservable[],
    baseDate: Date): StatusCalendar.IStatusBox[][] {
    let recentStatus: StatusCalendar.IStatusBox[] = [];
    recentActivityWindows.forEach((activityWindow) => {
        recentStatus.push({
            date: new Date(activityWindow().windowStart),
            status: ko.pureComputed(() => { return activityWindow().statusCalendarStatus; })
        });
    });

    let returnVal = StatusCalendar.findCorrectFrequencyAndInterval(frequency, interval);
    frequency = <string>returnVal[0];
    interval = <number>returnVal[1];

    let hasGenericCalendar = StatusCalendar.hasGenericCalendar(frequency, interval);
    let dateRange = StatusCalendar.getStartEndDateRange(baseDate, frequency, interval, hasGenericCalendar, false);
    let data: StatusCalendar.IStatusBox[][] = StatusCalendar.sanitizeIncomingData(recentStatus, dateRange, frequency, interval, hasGenericCalendar, false);
    return data;
}
