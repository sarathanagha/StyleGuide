/// <reference path="../references.ts" />

module Microsoft.DataStudio.Diagnostics.Logging {

    export enum UsageEventType {
        Undefined = 0,

        // Page header
        Header = 1,

        // Page footer
        Footer = 2,

        // Page top navigation bar
        TopNavBar = 3,

        // Action button, Submit, arrows etc.
        ActionButton = 4,

        // Input Box
        InputBox = 5,

        // Search Box
        SearchBox = 6,

        // Menu or other drop down
        DropDown = 7,

        // Most non-navigation interactions
        Interaction = 8,

        // Navigation to other URLs
        Navigation = 9,

        // Launch an installed app
        AppLaunch = 10,

        // Custom
        Custom = 11,

        // Please get it reviewed on atlascr if you want to add more categories
    }
}
