/// <reference path="../../References.d.ts" />

import Framework = require("../../_generated/Framework");
import AppContext = require("../AppContext");
import Telemetry = Framework.Telemetry;

export interface ITabConfig extends Microsoft.DataStudio.Model.Config.ElementConfig {
    isOpen: KnockoutObservable<boolean>;
}

export interface ITabViewModelParam {
    componentConfig: ITabConfig;
}

export class ConfigData {
    public static leftPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
        {
            icon: "",
            iconResource: ConfigData.resourceToString(Framework.Svg.resource_explorer),
            text: ClientResources.resourceExplorerTabTitle,
            componentName: "datafactory-ResourceExplorer"
        },
        {
            icon: "",
            iconResource: ConfigData.resourceToString(Framework.Svg.monitor_views),
            text: ClientResources.monitoringViewsTabTitle,
            componentName: "datafactory-MonitoringViews"
        },
        {
            icon: "",
            iconResource: ConfigData.resourceToString(Framework.Svg.alerts),
            text: ClientResources.alertsTabTitle,
            componentName: "datafactory-AlertExplorer"
        }
    ];

    public static authoringRightPanel: ITabConfig[] = [
        {
            icon: "",
            iconResource: ConfigData.resourceToString(Framework.Svg.properties),
            text: ClientResources.propertiesTabTitle,
            componentName: "datafactory-AuthoringProperties",
            isOpen: ko.observable(false)
        }
    ];

    public static authoringLeftPanel: Microsoft.DataStudio.Model.Config.ElementConfig[] = [
        {
            icon: "",
            iconResource: ConfigData.resourceToString(Framework.Svg.toolbox),
            text: ClientResources.toolboxTabTitle,
            componentName: "datafactory-Toolbox"
        }
    ];

    public static rightPanel: ITabConfig[] = [
        {
            icon: "",
            iconResource: ConfigData.resourceToString(Framework.Svg.activity_windows),
            text: ClientResources.activityWindowExplorerTabTitle,
            componentName: "datafactory-ActivityRunDetails",
            isOpen: ko.observable(true),
            isDefault: true
        },
        {
            icon: "",
            iconResource: ConfigData.resourceToString(Framework.Svg.properties),
            text: ClientResources.propertiesTabTitle,
            componentName: "datafactory-Properties",
            isOpen: ko.observable(false)
        },
        {
            iconResource: ConfigData.resourceToString(Framework.Svg.scriptFile),
            text: ClientResources.jsonViewerTabTitle,
            componentName: "datafactory-JsonViewer",
            isOpen: ko.observable(false)
        }
    ];

    public static moduleConfig: Microsoft.DataStudio.Model.Config.ModuleConfig = <Microsoft.DataStudio.Model.Config.ModuleConfig>{
        name: "datafactory",
        text: ClientResources.dataFactoryTitle,
        symbol: "\ue603",
        // TODO [Ranjit]: Remove hard coded deep URL when ADF routing is complete
        url: "datafactory/edit/subscription/34101176-18f0-4bab-8928-25a1d5fe7018/resourceGroup/ADF/dataFactory/SentimentFactory/dataset/TweetSentiment",
        defaultViewName: "landingPage",
        sidePanel: null,
        views: [
            {
                name: "landingPage",
                componentName: "datafactory-landingPage"
            },
            {
                name: "edit",
                leftPanel: ConfigData.leftPanel,
                rightPanel: ConfigData.rightPanel,
                componentName: "datafactory-Edit"
            },
            {
                name: "home",
                leftPanel: ConfigData.leftPanel,
                componentName: "datafactory-Home"
            },
            {
                name: "powercopytool",
                componentName: "datafactory-PowercopyTool"
            },
            {
                name: "authoring",
                leftPanel: ConfigData.authoringLeftPanel,
                rightPanel: ConfigData.authoringRightPanel,
                componentName: "datafactory-Editor"
            }
        ]
    };

    private static resourceToString(svg: string) {
        return Framework.Command.Button.removeCSS($(svg).filter("svg"));
    }
}

// Update the panel config's to set isOpen to true, whenever the tab is opened.
function setupIsOpen(panel: ITabConfig[]): void {
    let lastOpenTab: ITabConfig = null;
    for (let tab of panel) {
        if (tab.isOpen()) {
            lastOpenTab = tab;
            break;
        }
    }

    panel.forEach((tab, index) => {
        tab.callback = () => {
            if (lastOpenTab.componentName !== tab.componentName) {
                lastOpenTab.isOpen(false);
                tab.isOpen(true);
                lastOpenTab = tab;
            }
            let appContext = AppContext.AppContext.getInstance();
            Telemetry.instance.logEvent(new Telemetry.Event(appContext.factoryId(), tab.componentName, Telemetry.Action.open));
        };
    });
}

setupIsOpen(ConfigData.rightPanel);
