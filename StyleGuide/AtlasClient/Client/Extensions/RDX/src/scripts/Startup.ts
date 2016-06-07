/// <reference path="../References.d.ts" />
/// <reference path="../Module.d.ts" />
/// <amd-dependency path="./Module" />

export module Startup {
    var moduleInstance = new Microsoft.DataStudio.Crystal.CrystalModule();
    ModuleCatalog.registerModule(moduleInstance);
    Microsoft.DataStudio.Crystal.Knockout.BindingHandler.initialize();
}