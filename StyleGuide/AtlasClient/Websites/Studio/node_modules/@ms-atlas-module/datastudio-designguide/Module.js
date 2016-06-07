/// <reference path="../References.d.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DesignGuide;
        (function (DesignGuide) {
            var DesignGuideModule = (function () {
                function DesignGuideModule() {
                    this.name = "datastudio-designguide";
                }
                DesignGuideModule.prototype.initialize = function (moduleContext) {
                    this.moduleContext = moduleContext;
                    var configProxy = ko.mapping.fromJS(Microsoft.DataStudio.DesignGuide.ConfigData.moduleConfig);
                    moduleContext.moduleConfig(configProxy);
                };
                DesignGuideModule.prototype.getNotificationManager = function () {
                    return null;
                };
                return DesignGuideModule;
            })();
            DesignGuide.DesignGuideModule = DesignGuideModule;
        })(DesignGuide = DataStudio.DesignGuide || (DataStudio.DesignGuide = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../References.d.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DesignGuide;
        (function (DesignGuide) {
            var Logging = Microsoft.DataStudio.Diagnostics.Logging;
            var LoggerFactory = (function () {
                function LoggerFactory() {
                }
                LoggerFactory.getLogger = function (data) {
                    return LoggerFactory.loggerFactory.getLogger(data);
                };
                LoggerFactory.loggerFactory = new Logging.LoggerFactory({ moduleName: "DesignGuide" });
                return LoggerFactory;
            })();
            DesignGuide.LoggerFactory = LoggerFactory;
            DesignGuide.ComponentLogger = LoggerFactory.getLogger({ loggerName: "DesignGuide", category: "DesignGuide Components" });
            DesignGuide.BindingLogger = LoggerFactory.getLogger({ loggerName: "DesignGuide", category: "DesignGuide Bindings" });
        })(DesignGuide = DataStudio.DesignGuide || (DataStudio.DesignGuide = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../References.d.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DesignGuide;
        (function (DesignGuide) {
            var ConfigData = (function () {
                function ConfigData() {
                }
                ConfigData.leftPanel = [];
                ConfigData.rightPanel = [];
                ConfigData.moduleConfig = {
                    name: "designguide",
                    text: "Design Guide",
                    symbol: "",
                    url: "designguide",
                    defaultViewName: "home",
                    sidePanel: null,
                    views: [
                        {
                            name: "home",
                            leftPanel: null,
                            rightPanel: null,
                            commandBarComponentName: null,
                            componentName: "designguide-home-home",
                            isFullScreen: true
                        },
                        {
                            name: "navBar",
                            leftPanel: null,
                            rightPanel: null,
                            commandBarComponentName: 'designguide-navbar',
                            componentName: "designguide-home-navbar",
                            isFullScreen: true
                        }
                    ]
                };
                return ConfigData;
            })();
            DesignGuide.ConfigData = ConfigData;
        })(DesignGuide = DataStudio.DesignGuide || (DataStudio.DesignGuide = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DesignGuide;
        (function (DesignGuide) {
            var Knockout;
            (function (Knockout) {
                var BindingHandler = (function () {
                    function BindingHandler() {
                    }
                    BindingHandler.initialize = function () {
                    };
                    return BindingHandler;
                })();
                Knockout.BindingHandler = BindingHandler;
            })(Knockout = DesignGuide.Knockout || (DesignGuide.Knockout = {}));
        })(DesignGuide = DataStudio.DesignGuide || (DataStudio.DesignGuide = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
//# sourceMappingURL=Module.js.map