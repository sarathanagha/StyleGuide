import TypeDeclarations = require("../Shared/TypeDeclarations");
import Log = require("../Util/Log");
import Command = require("./Command");
import Svg = require("../../../_generated/Svg");

let logger = Log.getLogger({
    loggerName: "BreadCrumbs"
});

// Breadcrumbs setup for the diagram control.
export interface IBreadcrumbNode {
    displayText: string;
    nodeClickedCallback: () => TypeDeclarations.Promise;
}

/**
 * Breadcrumbs are a navigation scheme that helps user in keeping track of his/her location on the UI.
 * In this case, it lets user keep track of the diagram view they are in.
 */
export class Breadcrumbs {
    public backArrow: Command.ObservableCommand;

    constructor() {
        this.backArrow = new Command.ObservableCommand({
            icon: Svg.back_arrow,
            tooltip: ClientResources.breadcrumbBackTooltip
        });
    }

    /**
     * All the breadcrumb nodes except the last one, that should appear as link and be clickable.
     */
    public itemList: KnockoutObservableArray<IBreadcrumbNode> = ko.observableArray<IBreadcrumbNode>([]);

    /**
     * The last node which should appear as (non-actionable) normal text as it represents the active diagram mode.
     */
    public activeItem: KnockoutObservable<IBreadcrumbNode> = ko.observable<IBreadcrumbNode>();

    /**
     * Insert node at level'th positions, removing items after the level'th level.
     * level has 0-based indexing.
     * Invariant: If the activeItem is not present the list will be empty.
     * Invariant: The breadcrumbs can be empty only at the time of creation. Once an item is added, the breadcrumbs can never be empty.
     */
    public addBreadcrumb(node: IBreadcrumbNode, level: number) {
        if (level < 0) {
            logger.logError("BreadcrumbNode can only be inserted at levels 0 or more. Currently inserting at: " + level);
        }

        let itemListLength = this.itemList().length;
        if (!this.activeItem()) {
            if (this.itemList().length !== 0) {
                logger.logError("The list should have been empty as the activeItem is not set.");
            } else if (level !== 0) {
                logger.logError("The first node can only be inserted at level 0 in breadcrumbs.");
            }
            this.activeItem(node);
        } else if (level < itemListLength) {
            let newArray = this.itemList().slice(0, level);
            this.itemList(newArray);
            this.activeItem(node);
        } else if (level === itemListLength) {
            this.activeItem(node);
        } else if (level === itemListLength + 1) {
            this.itemList.push(this.activeItem());
            this.activeItem(node);
        } else {
            logger.logError("BreadcrumbNode can only be inserted at levels 0 to number of nodes at the time of insertion. Currently inserting at: " +
                level + " with list size being: " + this.itemList().length);
        }

        // update the backArrow
        if(this.itemList().length) {
            this.backArrow.onclick(this.itemList()[0].nodeClickedCallback);
        }
    }

    // Remove min of (requested number of nodes, current number of nodes - 1)
    public removeNodes(numberOfNodesToRemove: number): void {
        let itemListLength = this.itemList().length;
        if (numberOfNodesToRemove > itemListLength) {
            numberOfNodesToRemove = itemListLength;
        }
        if (itemListLength > 0) {
            this.activeItem(this.itemList()[itemListLength - numberOfNodesToRemove]);
        }
        this.itemList.splice(itemListLength - numberOfNodesToRemove);
    }

    get length(): number {
        return this.itemList().length + (this.activeItem() ? 1 : 0);
    }
}
