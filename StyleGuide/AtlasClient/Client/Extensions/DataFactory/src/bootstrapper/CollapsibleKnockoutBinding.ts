import Framework = require("../_generated/Framework");

let logger = Framework.Log.getLogger({
    loggerName: "CollapsibleKnockoutBinding"
});

export interface ICollapsibleValueAccessor {
    isExpanded: KnockoutObservable<boolean>;
    iconFirst?: boolean;
}

// Expects two div's within the element, one for header and the other for body. It then appends the chevron to
// the header.

export class CollapsibleKnockoutBinding implements KnockoutBindingHandler {
    public static className = "collapsible";

    public init(
        element: HTMLElement,
        valueAccessor: () => ICollapsibleValueAccessor,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {
        let value = valueAccessor();
        let jQueryElement = $(element);
        let children = jQueryElement.children();
        if (children.length !== 2) {
            logger.logError("Expected only header and body elements for the collapsible binding. Element: " + JSON.stringify(element.classList));
            return;
        }
        let [header, body] = <HTMLElement[]>children.toArray();

        let chevronElement = document.createElement("div");
        if (value.iconFirst) {
            header.insertBefore(chevronElement, header.firstChild);
        } else {
            header.appendChild(chevronElement);
        }
        ko.applyBindingsToNode(chevronElement, {
            html: ko.pureComputed(() => {
                return value.isExpanded() ? Framework.Svg.collapseUp : Framework.Svg.collapseDown;
            })
        });

        ko.applyBindingsToNode(header, {
            click: () => {
                value.isExpanded(!value.isExpanded());
            },
            style: {
                cursor: "pointer"
            }
        });

        ko.applyBindingsToNode(body, {
            visible: value.isExpanded
        });

        ko.applyBindingsToNode(element, {
            css: ko.pureComputed(() => {
                return value.isExpanded() ? "expanded" : "closed";
            })
        });

        return { controlsDescendantBindings: false };
    }
}
