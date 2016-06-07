/// <reference path="../References.d.ts" />
/// <reference path="../Module.d.ts" />
/// <reference path="../libs/underscore/underscore.d.ts" />

/*
 * This way we can define AMD dependencies for module.
 * Please note that all AMD-dependency paths are relative to startup.js location.
 */

/// <amd-dependency path="./Module" />
/// <amd-dependency path="./libs/underscore/underscore-min" />
/// <amd-dependency path="./libs/jsviews/jsviews" />

/**
 * This is a bootstrapper for the module.
 * Module's code is executed only after all AMD dependencies are successfully loaded.
 */
export module Startup {

    console.assert(typeof(_)!=="undefined", "Underscore load failed");

    var moduleInstance = new Microsoft.DataStudio.MachineLearning.MachineLearningModule();
    ModuleCatalog.registerModule(moduleInstance);

    Microsoft.DataStudio.MachineLearning.Knockout.BindingHandler.initialize();
}
