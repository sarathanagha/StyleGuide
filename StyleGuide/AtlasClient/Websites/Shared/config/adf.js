({
    packages: [{
        name: 'datastudio',
        location: 'node_modules/@ms-atlas/datastudio',
        main: 'datastudio.bootstrapper.js'
    }, {
        "name": "datastudio-datafactory",
        "location": "node_modules/@ms-atlas-module/datastudio-datafactory",
        "main": "bootstrapper/startup.js"
    }, {
        name: "datastudio.controls",
        location: "node_modules/@ms-atlas/datastudio-controls",
        main: "datastudio.ux.js"
    }],
    paths: {
        "srcMap": "node_modules/@ms-atlas/datastudio/scripts/application/sourceMapper",
        "datastudio.resx": "node_modules/@ms-atlas/datastudio/datastudio.resx",
        "datastudio.application": "node_modules/@ms-atlas/datastudio/datastudio.application",
        "datastudio.diagnostics": "node_modules/@ms-atlas/datastudio/../datastudio-diagnostics/lib/datastudio.diagnostics",
        "crossroads": "node_modules/@ms-atlas/datastudio/ExternalLibraries/crossroads.min",
        "history": "node_modules/@ms-atlas/datastudio/ExternalLibraries/jquery.history",
        "hammer": "node_modules/@ms-atlas/datastudio/ExternalLibraries/hammer",
        "es6-promise": "node_modules/@ms-atlas/datastudio/ExternalLibraries/es6-promise.min",
        /* This is empty because we're having issues with the time picker */
        "jquery": "empty:",
        "jquery.jstree": "node_modules/@ms-atlas/datastudio/ExternalLibraries/",
        "Q": "node_modules/@ms-atlas/datastudio/ExternalLibraries/q",
        "signals": "node_modules/@ms-atlas/datastudio/ExternalLibraries/signals.min",
        "moment": "node_modules/@ms-atlas/datastudio/ExternalLibraries/moment",
        "jqueryModal": "node_modules/@ms-atlas/datastudio/ExternalLibraries/jquery.modal",
        "WinJS": "node_modules/@ms-atlas/datastudio/ExternalLibraries/WinJS.min",
        "jquery.mockjax": "node_modules/@ms-atlas/datastudio/ExternalLibraries/jquery.mockjax.min",
        "d3": "node_modules/@ms-atlas/datastudio/ExternalLibraries/d3.min",
        "jquery.ui": "node_modules/@ms-atlas/datastudio/ExternalLibraries/jquery-ui",
        "jquery-ui-timepicker": "node_modules/@ms-atlas/datastudio/ExternalLibraries/jquery-ui-timepicker-addon.min",
        "Hulljs": "node_modules/@ms-atlas/datastudio/ExternalLibraries/hull",
        "node-uuid": "node_modules/@ms-atlas/datastudio/ExternalLibraries/uuid",
        "knockout": "node_modules/@ms-atlas/datastudio/ExternalLibraries/knockout-latest.debug",
        "knockout-mapping": "node_modules/@ms-atlas/datastudio/ExternalLibraries/knockout.mapping.min",
        "text": "node_modules/@ms-atlas/datastudio/ExternalLibraries/text",
        "css": "node_modules/@ms-atlas/datastudio/ExternalLibraries/text",
        "datastudio.graphControl": "node_modules/@ms-atlas/datastudio-controls/GraphControl",
        "VivaGraphControl": "node_modules/@ms-atlas/datastudio-controls/GraphControl/VivaGraphControl",
        "Viva.Controls": "node_modules/@ms-atlas-module/datastudio-datafactory/libs/VivaGraphControl/Content/Scripts/Viva.Controls",
        "i18n": "node_modules/@ms-atlas/datastudio/ExternalLibraries/i18n.min",
        "twitterbootstrap": "node_modules/@ms-atlas/datastudio/ExternalLibraries/bootstrap.min",
        "kendo": "node_modules/@ms-atlas/datastudio/ExternalLibraries/kendo.all.min",
    },
    shim: {
        "knockout": {
            exports: "ko"
        },
        "datastudio.controls": {
            deps: [
                "jquery",
                "knockout"
            ]
        },
        "datastudio": {
            deps: [
                "knockout",
                "knockout-mapping",
                "datastudio.controls"
            ]
        },
        "datastudio.resx": {
            deps: ["i18n!node_modules/@ms-atlas/datastudio/nls/resx"]
        },
        "datastudio.application": {
            deps: [
                "srcMap",
                "crossroads",
                "jquery",
                "Q",
                "moment",
                "WinJS",
                "datastudio.diagnostics",
                "d3",
                "datastudio.resx"
            ]
        },
        "jquery.jstree/jstree": {
            deps: [
                "jquery",
                "css!" + "node_modules/@ms-atlas/datastudio/ExternalLibraries/jstree.style.css"
            ]
        },
        "jquery.mockjax": {
            deps: ["jquery"]
        },
        "crossroads": {
            exports: "crossroads"
        },
        "history": {
            exports: "Historyjs",
            deps: ["jquery"]
        },
        "jquery": {
            exports: "$"
        },
        "Q": {
            exports: "Q"
        },
        "jqueryModal": {
            exports: "jqueryModal"
        },
        "moment": {
            exports: "moment"
        },
        "WinJS": {
            deps: ["css!" + "node_modules/@ms-atlas/datastudio/ExternalLibraries/ui-light.css"],
            exports: "WinJS"
        },
        "jquery.ui": {
            deps: [
                "jquery",
                "css!" + "node_modules/@ms-atlas/datastudio/ExternalLibraries/jquery-ui.min.css"
            ]
        },
        "jquery-ui-timepicker": {
            deps: [
                "jquery",
                "jquery.ui",
                "css!" + "node_modules/@ms-atlas/datastudio/ExternalLibraries/jquery-ui-timepicker-addon.min.css"
            ]
        },
        "Viva.Controls/Controls/Visualization/Graph/GraphWidget": {
            "deps": [
                "css!VivaGraphControl/Content/CSS/LightTheme.css",
                "css!VivaGraphControl/Content/CSS/Graph.css"
            ]
        }
    },
    map: {
        "*": {
            "css": "node_modules/@ms-atlas/datastudio/ExternalLibraries/css"
        }
    },
    baseUrl: "./",
    appDir: "../bin/adf",
    dir: "../dist/adf",
    modules: [{
        name: "datastudio.graphControl/Bindings/graphControlBinding"
    }, {
        name: "datastudio"
    }, {
       name: "datastudio.controls" 
    }, {
        name: "datastudio-datafactory"
    }, {
        name: "datastudio-datafactory/views/ActivityRunDetails/ActivityRunDetails"
    }, {
        name: "datastudio-datafactory/views/AlertExplorer/AlertExplorer"
    }, {
        name: "datastudio-datafactory/views/Edit/Edit"
    }, {
        name: "datastudio-datafactory/views/Home/Home"
    }, {
        name: "datastudio-datafactory/views/MonitoringViews/MonitoringViews"
    }, {
        name: "datastudio-datafactory/views/PowercopyTool/PowercopyTool"
    }, {
        name: "datastudio-datafactory/views/Properties/Properties"
    }, {
        name: "datastudio-datafactory/views/ResourceExplorer/ResourceExplorer"
    }, {
        name: "datastudio-datafactory/views/Editor/Editor"
    }, {
        name: "datastudio-datafactory/views/AuthoringProperties/AuthoringProperties"
    }, {
        name: "datastudio-datafactory/views/Toolbox/Toolbox"
    }],
    // verbose
    logLevel: 0,
    // exclude every data-studio module but datafactory, controls, and diagnostics
    // also exclude .ts and map files
    fileExclusionRegExp:/(^datastudio-(?!(datafactory|controls|diagnostics)))|(\.(ts|map)$)/,
    // we need the lines for IE
    optimizeCss: "standard.keepLines" 
})