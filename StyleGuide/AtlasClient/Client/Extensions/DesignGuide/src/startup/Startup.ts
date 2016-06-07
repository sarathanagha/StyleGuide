/// <reference path="../References.d.ts" />
/// <reference path="../../bin/Module.d.ts" />


/*
 * This way we can define AMD dependencies for module.
 * Please note that all AMD-dependency paths are relative to startup.js location.
 */

/// <amd-dependency path="./Module" />

/**
 * This is a bootstrapper for the module.
 * Module's code is executed only after all AMD dependencies are successfully loaded.
 */

export module Startup {
   
    var moduleInstance = new Microsoft.DataStudio.DesignGuide.DesignGuideModule();
    ModuleCatalog.registerModule(moduleInstance);

    Microsoft.DataStudio.DesignGuide.Knockout.BindingHandler.initialize();
}