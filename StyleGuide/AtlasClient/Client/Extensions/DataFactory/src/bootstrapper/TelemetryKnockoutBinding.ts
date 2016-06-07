import Log = require("../scripts/Framework/Util/Log");
import Framework = require("../_generated/Framework");
import Telemetry = Framework.Telemetry;
import AppContext = require("../scripts/AppContext");

"use strict";

let logger = Log.getLogger({
    loggerName: "TelemetryKnockoutBinding"
});

export interface IEventConfig {
    event: string;
    handleEvent: (data: Object, event: JQueryEventObject, areaId: string) => void;
}

export module EventConfigs {
    export const click: IEventConfig = {
        event: "click",
        handleEvent: (data: Object, event: JQueryEventObject, areaId: string) => {
            Telemetry.instance.logEvent(new Telemetry.Event(AppContext.AppContext.getInstance().factoryId(), areaId, Telemetry.Action.click, Object.create(null)));
        }
    };
};

export interface IValueAccessor {
    areaId: string;                 // This will be used to differentiate between different areas or regions.
    configs: string[];             // One of the defined event configs.
};

export class TelemetryKnockoutBindingHandler implements KnockoutBindingHandler {
    static className: string = "telemetry";
    static processedForADFTelemetry = "processedForADFTelemetry";

    public init(
        element: HTMLElement,
        valueAccessor: () => Object,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        let value = <IValueAccessor>ko.utils.unwrapObservable(valueAccessor());
        if (!value.areaId || !value.configs) {
            logger.logError("Supplying invalid value accessor.");
            return;
        }

        for (let index in value.configs) {
            let config = EventConfigs[value.configs[index]];
            let binding = {};
            binding[config.event] = Framework.Util.curry((config: IEventConfig, data: Object, event: JQueryEventObject) => {
                let flag = TelemetryKnockoutBindingHandler.processedForADFTelemetry;
                if (!event.originalEvent[flag]) {
                    config.handleEvent(data, event, value.areaId);
                    event.originalEvent[flag] = true;
                }
            }, null, config);
            ko.applyBindingsToNode(element, { event: binding });
        }

        return { controlsDescendantBindings: false };
    }
}

