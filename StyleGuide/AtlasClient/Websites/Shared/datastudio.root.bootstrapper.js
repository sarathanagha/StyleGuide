var MICROSOFT_DATASTUDIO_CURRENT_ENVIRONMENT = "";
if (window.location.hostname === "localhost") {
    // 'localhost' is allowed as a valid reply url by AAD for PPE environment only
    // So let's stick to DOGFOOD here irrespective of the 'environment' var passed in the URL
    MICROSOFT_DATASTUDIO_CURRENT_ENVIRONMENT = "DOGFOOD";
} else {
    // Update our current environment based on what 'environment' is set to in the URL
    var matches = /\?environment=(.*?)$/.exec(window.location);
    if (matches && matches.length === 2) {
        MICROSOFT_DATASTUDIO_CURRENT_ENVIRONMENT = matches[1].toLocaleUpperCase();
    }
}

//set inAdalIframe  to allow page load the minimun file during both inside iframe and preload before login
var inAdalIframe = false;
if (sessionStorage.getItem("adal.idtoken") == null || self != top) {
    inAdalIframe = true;
}

requirejs.config({
    packages: [
        {
            name: 'datastudio',
            location: 'node_modules/@ms-atlas/datastudio',
            main: 'datastudio.bootstrapper.js'
        }, {
            name: "datastudio.controls",
            location: "node_modules/@ms-atlas/datastudio-controls",
            main: "datastudio.ux.js"
        }
    ],
    paths: {
        "jquery": "node_modules/@ms-atlas/datastudio/ExternalLibraries/jquery.min",
        "knockout": "node_modules/@ms-atlas/datastudio/ExternalLibraries/knockout-latest.debug",
        "knockout-mapping": "node_modules/@ms-atlas/datastudio/ExternalLibraries/knockout.mapping.min",
        "text": "node_modules/@ms-atlas/datastudio/ExternalLibraries/text",
        "css": "node_modules/@ms-atlas/datastudio/ExternalLibraries/text",
        "datastudio.graphControl": "node_modules/@ms-atlas/datastudio-controls/GraphControl",
        "VivaGraphControl": "node_modules/@ms-atlas/datastudio-controls/GraphControl/VivaGraphControl"
    },
    shim: {
        "knockout": { exports: "ko" },
        "datastudio.controls": {
            deps: [
                "jquery",
                "knockout"
            ]
        },
        "datastudio": {
            deps: inAdalIframe ? [] : [
                "knockout",
                "knockout-mapping",
                "datastudio.controls"
            ]
        }
    },
    map: {
        "*": { "css": "node_modules/@ms-atlas/datastudio/ExternalLibraries/css" }
    },
    waitSeconds: 0
});

//load the minimun application file when inside iframe and preload before login
if (inAdalIframe) {
    requirejs.config({
        paths: {
            "datastudio.application.shared": "node_modules/@ms-atlas/datastudio/datastudio.application.shared",
            "datastudio.diagnostics": "node_modules/@ms-atlas/datastudio-diagnostics/lib/datastudio.diagnostics",
            "jquery": "node_modules/@ms-atlas/datastudio/ExternalLibraries/jquery.min",
            "Q": "node_modules/@ms-atlas/datastudio/ExternalLibraries/q"
        },
        shim: {
            "datastudio.application.shared": {
                deps: ["jquery", "Q", "datastudio.diagnostics"]
            },
            "jquery": { exports: "$" },
            "Q": { exports: "Q" }
        },
    });
    requirejs.onResourceLoad = function (context, map, depArray) {
        console.log("The simplified path load", map.name);
    };
    requirejs(["jquery", "Q", "datastudio.diagnostics"], function (promise, $) {
        window.Q = require("Q");
        jwt = { "decode": window.jwt_decode };
        require(["datastudio.application.shared"], function () {
            Microsoft.DataStudio.Managers.AuthenticationManager.instance.initializeAsync();
        });
    });
} else {
    var cssmain = document.createElement("link");
    cssmain.rel = "stylesheet";
    cssmain.href = "node_modules/@ms-atlas/datastudio/stylesheets/main.css";
    document.getElementsByTagName("head")[0].appendChild(cssmain);
    var cssfonts = document.createElement("link");
    cssfonts.rel = "stylesheet";
    cssfonts.href = "node_modules/@ms-atlas/datastudio/fonts.css";
    document.getElementsByTagName("head")[0].appendChild(cssfonts);
    requirejs(["jquery", "knockout", "knockout-mapping"], function () {
        ko = require("knockout");
        require(["datastudio.controls", "datastudio.graphControl/Bindings/graphControlBinding", "datastudio"], function () {
            var defaultModuleName = "DEFAULT_MODULE_NAME";
            var modulesConfig = [/* MODULES_CONFIG */];
            var shellVersion = "Shell_Version";
            var useExternalAPI = USE_EXTERNAL_API;
            Microsoft.DataStudio.Bootstrapper.initializeAsync(
                {
                    defaultModuleName: defaultModuleName,
                    modules: modulesConfig,
                    shellName: shellVersion,
                    useExternalAPI: useExternalAPI
                });
        });
    });
}
