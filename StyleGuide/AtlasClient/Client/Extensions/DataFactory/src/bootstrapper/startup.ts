/// <reference path="../References.d.ts" />
/// <reference path="../scripts/DataFactoryModule.ts" />

requirejs.config(<RequireConfig>{
    paths: {
        "Viva.Controls": "node_modules/@ms-atlas-module/datastudio-datafactory/libs/VivaGraphControl/Content/Scripts/Viva.Controls"
    },
    shim: {
        "Viva.Controls/Controls/Visualization/Graph/GraphWidget": {
            "deps": [
                "css!VivaGraphControl/Content/CSS/LightTheme.css",
                "css!VivaGraphControl/Content/CSS/Graph.css"
            ]
        }
    }
});

// TODO paverma Currently the ClientResources are being declared ambiently, same as in Ibiza part. Modify.
define(["require", "exports", "./KnockoutBindings", "../scripts/DataFactoryModule", "../_generated/ClientResources", "css!../stylesheets/main.css", "../scripts/ExposureControl"],
    function (require, exports, knockoutBindings, dataFactoryModule) {
        knockoutBindings.Bootstrapper.initialize();

        /**
         * Disable built-in WinJS animations.
         */
        WinJS.UI.disableAnimations();

        /**
         * Register module in ModuleCatalog.
         */
        let moduleInstance = new dataFactoryModule();
        ModuleCatalog.registerModule(moduleInstance);
    });
