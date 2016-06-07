/// <reference path="../References.d.ts" />
/// <reference path="../module.d.ts" />

/// <amd-dependency path="./Module" />

export module Startup {
    
    var moduleInstance = new Microsoft.DataStudio.StreamAnalytics.StreamAnalyticsModule();
    ModuleCatalog.registerModule(moduleInstance);
}