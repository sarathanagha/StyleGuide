/// <reference path="../References.d.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var DataCatalogModule = (function () {
                function DataCatalogModule() {
                    this.name = "datastudio-datacatalog";
                }
                DataCatalogModule.prototype.initialize = function (moduleContext) {
                    this.moduleContext = moduleContext;
                    var configProxy = ko.mapping.fromJS(Microsoft.DataStudio.DataCatalog.ConfigData.moduleConfig);
                    moduleContext.moduleConfig(configProxy);
                };
                DataCatalogModule.prototype.getNotificationManager = function () {
                    return null;
                };
                return DataCatalogModule;
            })();
            DataCatalog.DataCatalogModule = DataCatalogModule;
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../References.d.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Logging = Microsoft.DataStudio.Diagnostics.Logging;
            var LoggerFactory = (function () {
                function LoggerFactory() {
                }
                LoggerFactory.getLogger = function (data) {
                    return LoggerFactory.loggerFactory.getLogger(data);
                };
                LoggerFactory.loggerFactory = new Logging.LoggerFactory({ moduleName: "DataCatalog" });
                return LoggerFactory;
            })();
            DataCatalog.LoggerFactory = LoggerFactory;
            DataCatalog.ComponentLogger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
            DataCatalog.BindingLogger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Bindings" });
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Managers;
            (function (Managers) {
                var FocusManager = (function () {
                    function FocusManager() {
                    }
                    FocusManager.setContainerInteractive = function (selected) {
                        var focused = $(":focus");
                        FocusManager.selected(selected);
                        focused.find("[tabindex='0']").first().focus();
                    };
                    FocusManager.resetContianer = function () {
                        var focused = $(":focus");
                        FocusManager.selected(null);
                        focused.closest("[tabindex='0']").first().focus();
                    };
                    FocusManager.selected = ko.observable(null);
                    return FocusManager;
                })();
                Managers.FocusManager = FocusManager;
            })(Managers = DataCatalog.Managers || (DataCatalog.Managers = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../References.d.ts" />
// $tokyo needs to be implemented to access server side variabels as in the Views\Shared\_TokyoUser.cshtml file
var $tokyo = {
    user: {
        ipAddress: "@Model.ClientIpAddress",
        upn: "@Model.Upn",
        objectId: "@Model.ObjectId.ToString()",
        email: "@Model.Email",
        firstName: "@Model.FirstName",
        lastName: "@Model.LastName",
        tenantUuid: "@Model.TenantUuid",
        tenantDirectory: "@Model.TenantDirectory",
        locale: "@Model.CultureInfo.Name.ToLowerInvariant()",
        armToken: "@Model.ArmToken",
        tenantFacets: ["@Model.TenantFacets.EmptyIfNull().ToString()"]
    },
    app: {
        version: "@Model.Version",
        sessionUuid: "00000-00000-00000-00000",
        authenticationSessionUuid: "@Model.AuthenticationSessionId",
        catalogApiVersionString: "@Model.CatalogApiVersionString",
        searchApiVersionString: "@Model.SearchApiVersionString"
    },
    logging: {
        level: Number.MAX_VALUE,
        enabled: true
    },
    // TODO (stpryor): Update the publishingLink to use stage based config
    //                 This value taken from F:\Enlistments\ADC\Portal.UI\Web.config
    //                 and is used in F:\Enlistments\ADC\Portal.UI\Services\ConfigurationSettings.cs
    publishingLink: "https://tokyoclickonce.blob.core.windows.net/clickonce-int/RegistrationTool.application",
    isIntEnvironment: true,
    constants: {
        requestVerificationTokenHeaderName: "@HeaderNames.RequestVerificationToken",
        armTokenHeaderName: "@HeaderNames.ArmTokenHeaderName",
        tenantDirectoryHeaderName: "@HeaderNames.TenantDirectory",
        nextPortalActivityId: "@HeaderNames.NextPortalActivityId",
        catalogResponseStatusCodeHeaderName: "@HeaderNames.CatalogResponseStatusCode",
        searchResponseStatusCodeHeaderName: "@HeaderNames.SearchResponseStatusCode",
        catalogApiVersionStringHeaderName: "@HeaderNames.CatalogApiVersionString",
        searchApiVersionStringHeaderName: "@HeaderNames.SearchApiVersionString",
        latestPortalVersionHeaderName: "@HeaderNames.PortalVersion",
        azureStandardActivityIdHeader: "@LoggingHeaderConstants.AzureStandardActivityIdHeader",
        azureStandardResponseActivityIdHeader: "@LoggingHeaderConstants.AzureStandardResponseActivityIdHeader",
        additionalSearchParametersHeaderName: "@HeaderNames.AdditionalSearchParameters"
    },
    applications: [
        {
            applicationId: "cosmos",
            protocols: ["cosmos"]
        },
        {
            applicationId: "excel",
            limit: 1000,
            protocols: ["tds", "oracle", "hive", "teradata", "mysql"]
        },
        {
            applicationId: "excel",
            protocols: ["tds", "analysis-services", "oracle", "hive", "teradata", "mysql"]
        },
        {
            applicationId: "reportingservices",
            protocols: ["reporting-services"]
        },
        {
            applicationId: "browser",
            protocols: ["http", "file"]
        },
        {
            applicationId: "powerbi",
            protocols: [
                "tds",
                "analysis-services",
                "webhdfs",
                "azure-blobs",
                "mysql",
                "oracle",
                "sap-hana-sql"
            ]
        }
    ]
};
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Core;
            (function (Core) {
                var Constants = (function () {
                    function Constants() {
                    }
                    Constants.KeyCodes = {
                        BACKSPACE: 8,
                        TAB: 9,
                        ESCAPE: 27,
                        DELETE: 46,
                        ENTER: 13,
                        SPACEBAR: 32,
                        A: 65,
                        END: 35,
                        LEFT_ARROW: 37,
                        UP_ARROW: 38,
                        RIGHT_ARROW: 39,
                        DOWN_ARROW: 40,
                        ZER0: 48,
                        NINE: 57,
                        NUMPAD_0: 96,
                        NUMPAD_9: 105
                    };
                    Constants.HttpStatusCodes = {
                        OK: 200,
                        CREATED: 201,
                        ACCEPTED: 202,
                        NOCONTENT: 204,
                        BADREQUEST: 400,
                        UNAUTHORIZED: 401,
                        FORBIDDEN: 403,
                        NOTFOUND: 404,
                        CONFLICT: 409,
                        REQUESTENTITYTOOLARGE: 413,
                        INTERNALSERVERERROR: 500,
                        SERVICEUNAVAILABLE: 503
                    };
                    Constants.Highlighting = {
                        OPEN_TAG: "<span class='tokyo-highlight'>",
                        CLOSE_TAG: "</span>"
                    };
                    Constants.Users = {
                        NOBODY: "00000000-0000-0000-0000-000000000403",
                        EVERYONE: "00000000-0000-0000-0000-000000000201"
                    };
                    Constants.HttpRegex = /https?:\S*[a-z?&=#0-9/]/gi;
                    Constants.EmailRegex = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\b/gi;
                    Constants.ManualEntryID = "PortalUI.Manual.Entry";
                    Constants.svgPath = 'datastudio-datacatalog/images/';
                    Constants.svgPaths = {
                        chevronDown: Constants.svgPath + 'chevron-down.svg'
                    };
                    return Constants;
                })();
                Core.Constants = Constants;
            })(Core = DataCatalog.Core || (DataCatalog.Core = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                (function (DataSourceType) {
                    DataSourceType[DataSourceType["Unknown"] = 0] = "Unknown";
                    DataSourceType[DataSourceType["Container"] = 1] = "Container";
                    DataSourceType[DataSourceType["KPI"] = 2] = "KPI";
                    DataSourceType[DataSourceType["Table"] = 3] = "Table";
                    DataSourceType[DataSourceType["Measure"] = 4] = "Measure";
                    DataSourceType[DataSourceType["Report"] = 5] = "Report";
                })(Models.DataSourceType || (Models.DataSourceType = {}));
                var DataSourceType = Models.DataSourceType;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../typings/utilities.d.ts" />
/// <reference path="constants.ts" />
/// <reference path="../models/DataSourceType.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Core;
            (function (Core) {
                var Utilities = (function () {
                    function Utilities() {
                    }
                    Utilities.getCookieValue = function (name) {
                        var ca = (document.cookie || "").split(";");
                        var cookieValue = null;
                        $.each(ca, function (i, cookieStr) {
                            cookieStr = $.trim(cookieStr);
                            if (cookieStr.indexOf(name + "=") === 0) {
                                // We found our cookie!
                                cookieValue = cookieStr.split("=")[1];
                                return false;
                            }
                        });
                        return cookieValue;
                    };
                    // Note: not setting an expiration date will make the cookie delete on session end
                    Utilities.setCookie = function (name, value, expiresInDays) {
                        var now = new Date();
                        var expires = "";
                        if (expiresInDays !== void 0) {
                            now.setTime(now.getTime() + (expiresInDays * 24 * 60 * 60 * 1000));
                            expires = "expires=" + now.toUTCString();
                        }
                        document.cookie = name + "=" + value + "; " + expires;
                    };
                    // Converts a dateTime string to an ISO string
                    // i.e. "4/1/2015 1:23:32 AM" => "2015-04-01T01:23:32.000Z".
                    // This assumes that the dateTime string is in UTC.
                    Utilities.convertDateTimeStringToISOString = function (dateTime) {
                        if (!dateTime) {
                            return "";
                        }
                        // If the dateTime is already ISO 8601 UTC nothing to do
                        if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,7}Z/.test(dateTime)) {
                            return dateTime;
                        }
                        var d = new Date(dateTime);
                        // IE 9 can not parse a dateTime in ISO.
                        if (!d || isNaN(d.getFullYear())) {
                            return dateTime;
                        }
                        var utcDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()));
                        return utcDate.toISOString();
                    };
                    Utilities.plainText = function (value) {
                        var safe = Utilities.removeScriptTags(value);
                        var stripped = Utilities.removeHtmlTags(safe);
                        var escaped = Utilities.escapeHtml(stripped);
                        return escaped;
                    };
                    Utilities.removeHtmlTags = function (value) {
                        return Utilities._span.html(value).text();
                    };
                    Utilities.escapeHtml = function (value) {
                        return Utilities._span.text(value).html();
                    };
                    Utilities.removeScriptTags = function (value) {
                        var html = $("<div>" + value + "</div>");
                        html.find("script").remove();
                        return html.html();
                    };
                    Utilities.extractHighlightedWords = function (value) {
                        var targetString = "";
                        if (typeof value === "object") {
                            targetString = JSON.stringify(value || {});
                        }
                        else {
                            targetString = (value || "").toString();
                        }
                        var highlightedWords = [];
                        var regex = new RegExp(Core.Constants.Highlighting.OPEN_TAG + "([^<]*)" + Core.Constants.Highlighting.CLOSE_TAG, "g");
                        targetString.replace(regex, function (a, b) {
                            highlightedWords.push(b);
                            return a;
                        });
                        return highlightedWords;
                    };
                    Utilities.addValueToObject = function (obj, path, value) {
                        var keys = path.split(".");
                        var data = obj;
                        keys.forEach(function (key, i) {
                            if (i === keys.length - 1) {
                                data[key] = value;
                            }
                            else {
                                data[key] = data[key] || {};
                                data = data[key];
                            }
                        });
                    };
                    Utilities.applyHighlighting = function (words, target, regExpOptions) {
                        if (regExpOptions === void 0) { regExpOptions = "g"; }
                        words = words || [];
                        if (words.length) {
                            target = (target || "").replace(new RegExp(words.join("|"), regExpOptions), Core.Constants.Highlighting.OPEN_TAG + "$&" + Core.Constants.Highlighting.CLOSE_TAG);
                        }
                        return target;
                    };
                    Utilities.reloadWindow = function (path) {
                        if (path === void 0) { path = ""; }
                        window.location = (window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + path);
                    };
                    Utilities.getTypeFromString = function (typeString) {
                        var match = (typeString || "").match(/DataSource\.([^.]+)\./i);
                        if (match && match.length > 1) {
                            var typeName = match[1];
                            return DataCatalog.Models.DataSourceType[typeName] || DataCatalog.Models.DataSourceType.Unknown;
                        }
                        return DataCatalog.Models.DataSourceType.Unknown;
                    };
                    Utilities.setAssetAsMine = function (asset, everyOneIsContributor) {
                        var creatorId = everyOneIsContributor ? null : $tokyo.user.email;
                        var objectId = everyOneIsContributor ? Core.Constants.Users.EVERYONE : $tokyo.user.objectId;
                        asset.__creatorId = creatorId;
                        asset.__roles = asset.__roles || [];
                        var member = { objectId: objectId };
                        var existingContributor = Utilities.arrayFirst(asset.__roles.filter(function (r) { return /Contributor/i.test(r.role); }));
                        if (existingContributor) {
                            existingContributor.members = [member];
                        }
                        else {
                            asset.__roles.push({
                                members: [member],
                                role: "Contributor"
                            });
                        }
                    };
                    Utilities.getMyAsset = function (assets) {
                        var myAsset;
                        (assets || []).forEach(function (a) {
                            (a.__roles || []).forEach(function (r) {
                                if (/Contributor/i.test(r.role) && (r.members || []).length === 1 && r.members[0].objectId === $tokyo.user.objectId) {
                                    myAsset = a;
                                }
                            });
                        });
                        return myAsset;
                    };
                    Utilities.getLatestModifiedAsset = function (assets) {
                        var asset;
                        if (assets && assets.length) {
                            asset = assets[0];
                            assets.forEach(function (a) {
                                var theDate = new Date(asset.modifiedTime);
                                var myDate = new Date(a.modifiedTime);
                                if (myDate > theDate) {
                                    asset = a;
                                }
                            });
                        }
                        return asset;
                    };
                    Utilities.validateEmails = function (emails) {
                        var deferred = $.Deferred();
                        var validEmails = [];
                        Core.Constants.EmailRegex.lastIndex = 0;
                        emails.forEach(function (email) {
                            var valid = Core.Constants.EmailRegex.test(email);
                            if (valid) {
                                validEmails.push(email);
                            }
                            Core.Constants.EmailRegex.lastIndex = 0; // Prevent caching issue that causes the test to randomly fail.
                        });
                        deferred.resolve(validEmails);
                        return deferred.promise();
                    };
                    Utilities.isValidEmail = function (email) {
                        Core.Constants.EmailRegex.lastIndex = 0; // Reset before and after in case the regex is tested elsewhere.
                        var isValid = Core.Constants.EmailRegex.test(email);
                        Core.Constants.EmailRegex.lastIndex = 0;
                        return isValid;
                    };
                    Utilities.createID = function () {
                        return (parseInt(Math.random() * Math.pow(2, 32) + "", 10)).toString(36).toUpperCase();
                    };
                    Utilities.centerTruncate = function (value, max) {
                        var label = value;
                        if (label.length > max) {
                            var endCount = Math.floor(max / 2);
                            var startCount = endCount - 3;
                            var begin = label.substr(0, startCount);
                            var end = label.substr(label.length - endCount);
                            label = begin + "..." + end;
                        }
                        return label;
                    };
                    Utilities.asBindable = function (item) {
                        var bindable = {};
                        Object.keys(item).forEach(function (key) {
                            var value = item[key];
                            if (!$.isArray(value) && !$.isFunction(value)) {
                                bindable[key] = ko.observable(value);
                            }
                            else {
                                bindable[key] = value;
                            }
                        });
                        return bindable;
                    };
                    Utilities.isSelectAction = function (e) {
                        var keyCode = e.which || e.keyCode || -1;
                        return (keyCode === Core.Constants.KeyCodes.ENTER || keyCode === Core.Constants.KeyCodes.SPACEBAR);
                    };
                    Utilities.stringFormat = function (formatStr) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args[_i - 1] = arguments[_i];
                        }
                        return formatStr.replace(/{(\d+)}/g, function (match, number) {
                            return typeof args[number] !== "undefined"
                                ? args[number]
                                : match;
                        });
                    };
                    Utilities.stringCapitalize = function (formatStr) {
                        return formatStr.replace(/(^\w|\s\w)/g, function (a) { return a.toUpperCase(); });
                    };
                    Utilities.arrayChunk = function (arr, chunkSize) {
                        if (chunkSize <= 0) {
                            throw new Error("chunk size must be greater than zero");
                        }
                        var chunks = [];
                        var start = 0;
                        var end = chunkSize;
                        while (start < arr.length) {
                            chunks.push(arr.slice(start, end));
                            start = end;
                            end = (end + chunkSize);
                        }
                        return chunks;
                    };
                    Utilities.arrayFirst = function (arr) { return arr.length ? arr[0] : null; };
                    Utilities.arrayLast = function (arr) { return arr.length ? arr[arr.length - 1] : null; };
                    Utilities.arrayIntersect = function (arr, otherArray, comparator) {
                        return arr.filter(function (a) { return (otherArray || []).some(function (b) { return comparator ? comparator(a, b) : a === b; }); });
                    };
                    Utilities.arrayExcept = function (arr, otherArray, comparator) {
                        return arr.filter(function (a) { return !(otherArray || []).some(function (b) { return comparator ? comparator(a, b) : a === b; }); });
                    };
                    Utilities.arrayRemove = function (arr, predicate) {
                        // Find index
                        var i = 0;
                        for (; i < arr.length; i++) {
                            if (predicate(arr[i])) {
                                break;
                            }
                        }
                        // Remove in-place
                        return Utilities.arrayFirst(arr.splice(i, 1));
                    };
                    Utilities.arrayDistinct = function (arr, hashFn) {
                        var _hash = {};
                        var _distinct = [];
                        $.each(arr, function (i, val) {
                            if (val) {
                                var key = hashFn ? hashFn(val) : val.toString();
                                if (!_hash[key]) {
                                    _hash[key] = true;
                                    _distinct.push(val);
                                }
                            }
                        });
                        return _distinct;
                    };
                    Utilities.regexEscape = function (str) { return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); };
                    Utilities._span = $("<span>");
                    return Utilities;
                })();
                Core.Utilities = Utilities;
            })(Core = DataCatalog.Core || (DataCatalog.Core = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../core/constants.ts" />
/// <reference path="../core/utilities.ts" />
/// <reference path="../LoggerFactory.ts" />
var BootstrapPopover = (function () {
    function BootstrapPopover() {
    }
    BootstrapPopover.prototype.init = function (element, valueAccessor) {
        var $element = $(element);
        var value = ko.unwrap(valueAccessor());
        if (value) {
            $element.popover(valueAccessor);
        }
    };
    BootstrapPopover.prototype.update = function (element, valueAccessor) {
        var $element = $(element);
        var value = ko.unwrap(valueAccessor());
        if (value) {
            $element.popover(valueAccessor);
        }
        else if ($.isFunction($element.popover)) {
            $element.popover("destroy");
        }
    };
    return BootstrapPopover;
})();
var Spinner = (function () {
    function Spinner() {
    }
    Spinner.prototype.init = function (element, valueAccessor) {
        $(element).addClass("tokyo-spinner");
        var imagePath = Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "indicators/green_check.png";
        $(element).append("<div class='dot'></div><div class='dot'></div><div class='dot'></div><img src='" + imagePath + "/>");
    };
    Spinner.prototype.update = function (element, valueAccessor, allBindings) {
        var $element = $(element);
        var value = ko.unwrap(valueAccessor());
        var toggleWorking = function (toggle) {
            if (toggle) {
                $element.addClass("working");
                var animate = function () {
                    $(".curr", $element).removeClass("curr");
                    $($(".dot", $element)[0]).addClass("curr");
                    setTimeout(function () {
                        $(".curr", $element).removeClass("curr");
                        $($(".dot", $element)[1]).addClass("curr");
                    }, 200);
                    setTimeout(function () {
                        $(".curr", $element).removeClass("curr");
                        $($(".dot", $element)[2]).addClass("curr");
                    }, 400);
                };
                animate();
                var interval = setInterval(animate, 1000);
                clearInterval($element.data("interval"));
                $element.data("interval", interval);
            }
            else {
                $element.removeClass("working");
                clearInterval($element.data("interval"));
            }
        };
        if (typeof value === "boolean") {
            toggleWorking(value);
        }
        else if (value !== null && typeof value === "object") {
            if (typeof value.working === "undefined" || typeof value.success === "undefined") {
                throw new Error("when using an object with spinner binding 'working' and 'success' are required");
            }
            var showSpinner = ko.unwrap(value.working);
            toggleWorking(showSpinner);
            var showSuccess = ko.unwrap(value.success);
            if (showSuccess) {
                $element.addClass("success");
                setTimeout(function () {
                    $element.removeClass("success");
                    if (ko.isObservable(value.success)) {
                        value.success(false);
                    }
                }, ko.unwrap(value.showSuccessFor) || 2000);
            }
        }
    };
    return Spinner;
})();
var LoadingIndicator = (function () {
    function LoadingIndicator() {
    }
    LoadingIndicator.prototype.init = function (element, valueAccessor) {
        $(element).hide();
        // Shield your eyes!
        $(element).append("<img src='data:image/gif;base64,R0lGODlh8gAEAIAAAJmZmf///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJAAABACwAAAAA8gAEAAACHYyPqcvtD6OctNqLs968+w+G4kiW5omm6sq27qsVACH5BAkAAAEALAAAAAABAAEAAAICTAEAIfkECQAAAQAsAAAAAAEAAQAAAgJMAQAh+QQJAAABACwAAAAAAQABAAACAkwBACH5BAkAAAEALAAAAAABAAEAAAICTAEAIfkECQAAAQAsAAAAAAEAAQAAAgJMAQAh+QQJAAABACwAAAAABAAEAAACBQxgp5dRACH5BAkAAAEALBMAAAAEAAQAAAIFDGCnl1EAIfkECQAAAQAsJQAAAAQABAAAAgUMYKeXUQAh+QQJAAABACw1AAAABAAEAAACBQxgp5dRACH5BAkAAAEALEMAAAAEAAQAAAIFDGCnl1EAIfkECQAAAQAsTgAAAAQABAAAAgUMYKeXUQAh+QQJAAABACwJAAAAUgAEAAACGgwQqcvtD6OMxxw0s95c3Y914ih+FommWVUAACH5BAkAAAEALBsAAABHAAQAAAIYDBCpy+0PYzzmIImzxrbfDYZZV4nm+VAFACH5BAkAAAEALCsAAAA6AAQAAAIXDBCpy+0P3TEHxYuzqtzqD24VFZbhVAAAIfkECQAAAQAsOAAAAC8ABAAAAhQMEKnL7c+OOQja+6iuuGM9eeKHFAAh+QQJAAABACxEAAAAJQAEAAACEwwQqcvtesxBr1o5590tSw4uUQEAIfkECQAAAQAsAQAAAGoABAAAAiAMEKnL7Q+jfGfOeqrdvNuMeAsIiubJlWipoe7btCtSAAAh+QQJAAABACwSAAAAWwAEAAACHgwQqcvtD+M7EtJDq968YdQZHxaWpvOVaXa2JxtSBQAh+QQJAAABACwhAAAATgAEAAACHQwQqcvtD9uJcJ5Js84X7dR130gaFyli5cp5KFIAACH5BAkAAAEALC8AAABCAAQAAAIcDBCpy+2vDpzyyIlztHrZj3Si840Gd5lqko5SAQAh+QQJAAABACw6AAAAOQAEAAACGgwQqcvteZ6E6MSJm0V57d2FhiVS0VVmaBkVACH5BAkAAAEALEMAAAAyAAQAAAIaDBCpy53n4oIHymsqbrWjHXXgpFmjY55ZUAAAIfkECQAAAQAsBgAAAHEABAAAAiQMEKnL7Q9jPPLR2ui5uPuvbMgngmIJpqq1mS3Zcus8y57dUQUAIfkECQAAAQAsFgAAAGMABAAAAiIMEKnL7Q/fiRLRNs+8vFNtdaBngBqJpqO3iueWxq4askgBACH5BAkAAAEALCMAAABYAAQAAAIiDBCpy+3fDoRyOnmq3Txl1BlZKH4aiS4fuYbrmcZiCnNSAQAh+QQJAAABACwuAAAATwAEAAACIAwQqcvtfJ40aLp4ot03c5VVXxh+ZlKa6ehppyrCLxUUACH5BAkAAAEALD0AAABCAAQAAAIgDBCpy3wNHYr0nUfjnXntLm0Y6F2k8p2GOapJe8LkUwAAIfkECQAAAQAsQQAAAEAABAAAAh8MEKnLeg3Zi/SdSeXN7SK+eB4YbmQynsaGqe35kk8BACH5BAkAAAEALEMAAABAAAQAAAIfDBCpy3oN2Yv0nUnlze0ivngeGG5kMp7Ghqnt+ZJPAQAh+QQJAAABACxFAAAAQAAEAAACHwwQqct6DdmL9J1J5c3tIr54HhhuZDKexoap7fmSTwEAIfkECQAAAQAsRwAAAEAABAAAAh8MEKnLeg3Zi/SdSeXN7SK+eB4YbmQynsaGqe35kk8BACH5BAkAAAEALEkAAABFAAQAAAIgDBCpy3oN2YtUojPrwkhv7FEcFzpgaZzo92SoW8Jr8hQAIfkECQAAAQAsSwAAAFEABAAAAiAMEKnLeg3Zi7TCd6Z1ea+MeKIEdiM4GmZ6dlrLqjH7FAAh+QQJAAABACxNAAAAYQAEAAACIwwQqct6DdmLtNr7zrxJI95p4Egunkeio1q2mLitXzq7NvUUACH5BAkAAAEALE8AAABzAAQAAAImDBCpy3oN2Yu02oslOjNzlBlcSJam+HXYR7LnCzes6oGtHefwUwAAIfkECQAAAQAsUQAAAIkABAAAAicMEKnLeg3Zi7TaizN+Z+aOaKBGlua5gKPYkSsKx7LReqxpz/p+PQUAIfkECQAAAQAsUwAAAJ8ABAAAAioMEKnLeg1jerLai7Pe8XikfdwijuaJps3nbaX5qvJMrw/lgihe9356KAAAIfkECQAAAQAsVQAAADwABAAAAhoMEKnLeg2jXO+8ySzCPGrdOVZIitVWXmWKFAAh+QQJAAABACxXAAAATAAEAAACHQwQqct6DaOc851H10W5+7htn3GN5idio3q2FVIAACH5BAkAAAEALFkAAABgAAQAAAIgDBCpy3oNo5y0wneeTRntD4ZM14GliKZTqZmeCsccUgAAIfkECQAAAQAsWwAAAHUABAAAAiIMEKnLeg2jnLTaa9B5eCMMhuLoeBvokerKlg+Hfu1MX08BACH5BAkAAAEALF0AAACNAAQAAAIjDBCpy53nopy02ospPDAvjnjiSJYVCJapybaulXZq+NZ2DRUAIfkECQAAAQAsXwAAACkABAAAAhQMEKnL7X7MQa9aNjO9/GXZhR5SAAAh+QQJAAABACxhAAAAOQAEAAACFwwQqcvtD9sxB8WLc6rc6g9uFRWW4FQAACH5BAkAAAEALGMAAABNAAQAAAIZDBCpy+0Po2THHDSz3vp6zIUi51njiUpVAQAh+QQJAAABACxlAAAAYwAEAAACHAwQqcvtD6OcNB1zUN28+5iF2keWphNi58qWVwEAIfkECQAAAQAsagAAAHgABAAAAh4MEKnL7Q+jnLTCYw6yvPsPNtq4heaJgmOWtu77YAUAIfkECQAAAQAseAAAAAQABAAAAgUMYKeXUQAh+QQJAAABACyLAAAABAAEAAACBQxgp5dRACH5BAkAAAEALKEAAAAEAAQAAAIFDGCnl1EAIfkECQAAAQAsugAAAAQABAAAAgUMYKeXUQAh+QQJAAABACzUAAAABAAEAAACBQxgp5dRACH5BAkAAAEALO4AAAAEAAQAAAIFDGCnl1EAIfkEBQMAAQAsAAAAAAEAAQAAAgJMAQA7'/>");
    };
    LoadingIndicator.prototype.update = function (element, valueAccessor, allBindings) {
        var $element = $(element);
        var value = ko.unwrap(valueAccessor());
        if (typeof value === "boolean") {
            value ? $element.show() : $element.hide();
        }
    };
    return LoadingIndicator;
})();
// A binding for binding highlighted strings. Many strings are truncated after a specified number of characters, 
// when there are html elements this is problematic b/c
// 1) Not all characters are visible, so we can't just substring the string from 0 - n.
// 2) When we truncate the string we may be orphaning an HTML open tag so any open tags will need to be closed.
var HighlightBinding = (function () {
    function HighlightBinding() {
    }
    HighlightBinding.prototype.init = function (element, valueAccessor) {
        return { controlsDescendantBindings: true };
    };
    HighlightBinding.prototype.update = function (element, valueAccessor, allBindings) {
        var value = ko.unwrap(valueAccessor());
        var fromString = "";
        var limit = Number.MAX_VALUE;
        var ellipsis = "...";
        if (typeof value === "string") {
            fromString = value;
        }
        if (value !== null && typeof value === "object") {
            if (typeof value.html === "undefined") {
                throw new Error("when using an object with highlight binding 'html' is required");
            }
            fromString = value.html;
            limit = value.limit || limit;
        }
        // Remove any script tags
        fromString = $.trim(Microsoft.DataStudio.DataCatalog.Core.Utilities.removeScriptTags(fromString));
        if (fromString.length <= limit) {
            ko.utils.setHtml(element, fromString);
        }
        else {
            var visibleCharCount = 0;
            var currentIndex = 0;
            var toChars = [];
            var openedTagIndexes = [];
            var fromChars = fromString.split("");
            var inTag = false; // Whether or not the current character is "in" a tag, therefore the visible length shouldn't be incremented
            while (currentIndex < fromString.length && visibleCharCount < (limit - ellipsis.length)) {
                // Copy the characters over to the toChars array one by one, keeping track of the number of visible characters seen
                var char = fromChars[currentIndex];
                if (char === "<") {
                    inTag = true;
                    // Peek-ahead
                    var isOpenTag = fromChars[currentIndex + 1] !== "/";
                    if (isOpenTag) {
                        openedTagIndexes.push(currentIndex);
                    }
                    else {
                        openedTagIndexes.pop();
                    }
                }
                if (!inTag) {
                    visibleCharCount++;
                }
                if (char === ">") {
                    inTag = false;
                }
                toChars.push(char);
                currentIndex++;
            }
            var newString = $.trim(toChars.join(""));
            if (visibleCharCount >= (limit - ellipsis.length)) {
                newString += ellipsis;
            }
            newString += new Array(openedTagIndexes.length + 1).join(Microsoft.DataStudio.DataCatalog.Core.Constants.Highlighting.CLOSE_TAG);
            ko.utils.setHtml(element, newString);
        }
    };
    return HighlightBinding;
})();
var NumericBinding = (function () {
    function NumericBinding() {
    }
    NumericBinding.prototype.init = function (element, valueAccessor) {
        var $element = $(element);
        $element.keydown(function (event) {
            var keyCode = event.keyCode;
            var KeyCodes = Microsoft.DataStudio.DataCatalog.Core.Constants.KeyCodes;
            if (keyCode === KeyCodes.BACKSPACE || keyCode === KeyCodes.DELETE || keyCode === KeyCodes.ESCAPE || keyCode === KeyCodes.ENTER ||
                (keyCode === KeyCodes.A && event.ctrlKey) ||
                (keyCode >= KeyCodes.END && keyCode <= KeyCodes.RIGHT_ARROW)) {
                return;
            }
            else if (event.shiftKey || (keyCode < KeyCodes.ZER0 || keyCode > KeyCodes.NINE) && (keyCode < KeyCodes.NUMPAD_0 || keyCode > KeyCodes.NUMPAD_9)) {
                event.preventDefault();
            }
        });
    };
    return NumericBinding;
})();
var DropdownReposition = (function () {
    function DropdownReposition() {
    }
    DropdownReposition.prototype.init = function (element, valueAccessor) {
        var $element = $(element);
        var scrollSelector = ko.unwrap(valueAccessor());
        $element.hover(function (event) {
            var $container = $element.parents(scrollSelector);
            var containerHeight = $container.height();
            var containerTop = $container.offset().top;
            var dropdownTop = $element.offset().top - containerTop;
            var buttonHeight = $element.height();
            var menuHeight = $(".dropdown-menu", $element).outerHeight(true);
            if ((containerHeight - (dropdownTop + buttonHeight)) < menuHeight) {
                $element.addClass("dropup");
            }
            else {
                $element.removeClass("dropup");
            }
        });
    };
    return DropdownReposition;
})();
var KendoEditor = (function () {
    function KendoEditor() {
    }
    KendoEditor.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element = $(element);
        var value = valueAccessor();
        var rawValue = ko.unwrap(value);
        var options = allBindings().kendoOptions || {};
        var initialChange = options.change;
        options.value = rawValue;
        options.change = function () {
            if (ko.isObservable(value)) {
                value(this.value());
            }
            if ($.isFunction(initialChange)) {
                initialChange.apply(this, arguments);
            }
        };
        var initialExecute = options.execute;
        options.execute = function (e) {
            Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("kendo toolbar click id=" + (e && e.name));
            if ($.isFunction(initialExecute)) {
                initialExecute.apply(this, arguments);
            }
        };
        Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("initializing kendo editor", { "document.domain": document.domain, "location.hostname": location.hostname });
        try {
            $element.kendoEditor(options);
        }
        catch (e) {
            Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("failed to initialize kendo editor", { name: e.name, message: e.message, stack: e.stack });
        }
        Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("initialized kendo editor", { "document.domain": document.domain, "location.hostname": location.hostname });
        var editor = $element.data("kendoEditor");
        if (editor) {
            if ($.isFunction(options.onFocus)) {
                $(editor.body).focus(options.onFocus);
            }
            if ($.isFunction(options.onBlur)) {
                $(editor.body).blur(options.onBlur);
            }
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("destroying kendo editor", { "document.domain": document.domain, "location.hostname": location.hostname });
                try {
                    editor.destroy();
                }
                catch (ex) {
                    Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("failed to destroy kendo editor", { name: ex.name, message: ex.message, stack: ex.stack });
                }
            });
        }
    };
    KendoEditor.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element = $(element);
        var editor = $element.data("kendoEditor");
        var value = ko.unwrap(valueAccessor());
        editor.value(value);
    };
    return KendoEditor;
})();
ko.bindingHandlers["adc-popover"] = new BootstrapPopover();
ko.bindingHandlers["adc-spinner"] = new Spinner();
ko.bindingHandlers["adc-loading"] = new LoadingIndicator();
ko.bindingHandlers["adc-highlight"] = new HighlightBinding();
ko.bindingHandlers["adc-numeric"] = new NumericBinding();
ko.bindingHandlers["adc-dropdownautopos"] = new DropdownReposition();
ko.bindingHandlers["adc-kendoEditor"] = new KendoEditor();
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Bindings;
            (function (Bindings) {
                var LayoutPanelBindingHander = (function () {
                    function LayoutPanelBindingHander() {
                    }
                    LayoutPanelBindingHander.prototype.update = function (element, valueAccessor, allBindings) {
                        var value = ko.unwrap(valueAccessor());
                        var position = allBindings.get("position") || "left";
                        var duration = parseInt(allBindings.get("duration") || "400", 10);
                        var animationPromise = $.Deferred().resolve().promise();
                        // The first time here, set the initial state with no duration
                        var hasBeenInitialized = $(element).data("init");
                        var animationDuration = hasBeenInitialized ? duration : 0;
                        if (position === "left" || position === "right") {
                            var panelWidth = $(element).width();
                            var togglerWidth = $(".toggler", element).width();
                            var hSlideDistance = panelWidth - togglerWidth;
                            var centerPanel = $(element).siblings(".center-panel");
                            if (value) {
                                $(element).addClass("expanded");
                                var panelVisible = {};
                                panelVisible[position] = 0;
                                $(element).animate(panelVisible, animationDuration);
                                var centerWithPanelVisible = {};
                                centerWithPanelVisible[position] = panelWidth;
                                animationPromise = centerPanel.animate(centerWithPanelVisible, animationDuration).promise();
                            }
                            else {
                                var panelHidden = {};
                                panelHidden[position] = -hSlideDistance;
                                $(element).animate(panelHidden, animationDuration, "swing", function () {
                                    $(element).removeClass("expanded");
                                });
                                var centerWithPanelHidden = {};
                                centerWithPanelHidden[position] = togglerWidth;
                                animationPromise = centerPanel.animate(centerWithPanelHidden, animationDuration).promise();
                            }
                        }
                        else if (position === "bottom") {
                            var panelHeight = $(element).height();
                            var togglerHeight = $(".toggler", element).height();
                            var vSlideDistance = panelHeight - togglerHeight;
                            var centerPanelContent = $(element).siblings(".center-panel-content");
                            if (value) {
                                $(element).addClass("expanded");
                                $(element).animate({ bottom: 0 }, animationDuration);
                                animationPromise = centerPanelContent.animate({ bottom: panelHeight }, animationDuration).promise();
                            }
                            else {
                                $(element).animate({ bottom: -vSlideDistance }, animationDuration, "swing", function () {
                                    $(element).removeClass("expanded");
                                });
                                animationPromise = centerPanelContent.animate({ bottom: togglerHeight }, animationDuration).promise();
                            }
                        }
                        else {
                            throw new Error("unsupported position set to layout binding");
                        }
                        animationPromise.done(function () {
                            DataCatalog.Managers.LayoutManager.adjustAsset();
                        });
                        $(element).data("init", true);
                    };
                    return LayoutPanelBindingHander;
                })();
                Bindings.LayoutPanelBindingHander = LayoutPanelBindingHander;
                var LayoutResizeableBindingHander = (function () {
                    function LayoutResizeableBindingHander() {
                    }
                    LayoutResizeableBindingHander.prototype.update = function (element, valueAccessor, allBindings) {
                        var position = ko.unwrap(valueAccessor());
                        var container = $(element).parents(".layout-container");
                        var leftPanel = $(".left-panel", container);
                        var centerPanel = $(".center-panel", container);
                        var centerPanelContent = $(".center-panel-content", container);
                        var bottomPanel = $(".bottom-panel", container);
                        var rightPanel = $(".right-panel", container);
                        $(element).mousedown(function (e) {
                            var isExpanded = $(element).parent().is(".expanded");
                            if (isExpanded) {
                                var t = container.offset().top;
                                var l = container.offset().left;
                                var r = container.width() + l;
                                var mouseMove = function (e) {
                                    var left = e.clientX - l;
                                    var height = e.clientY - t;
                                    var right = r - e.clientX;
                                    if (position === "left") {
                                        var lw = leftPanel.width() + centerPanel.width();
                                        left = Math.min(left, lw - 350);
                                        left = Math.max(left, 200);
                                        leftPanel.css({ width: left + "px" });
                                        centerPanel.css({ left: left });
                                        $("body").css("cursor", "ew-resize");
                                    }
                                    if (position === "right") {
                                        var rw = centerPanel.width() + rightPanel.width();
                                        right = Math.min(right, rw - 350);
                                        right = Math.max(right, 200);
                                        rightPanel.css({ width: right + "px" });
                                        centerPanel.css({ right: right });
                                        $("body").css("cursor", "ew-resize");
                                    }
                                    if (position === "bottom") {
                                        var centerPanelHeight = centerPanel.height();
                                        var bottom = centerPanelHeight - height;
                                        // Constrain resizeable to allow for some top and bottom remaining
                                        bottom = Math.min(bottom, centerPanelHeight - 80);
                                        bottom = Math.max(bottom, 100);
                                        centerPanelContent.css({ bottom: bottom });
                                        bottomPanel.css({ bottom: 0, height: bottom + "px" });
                                        $("body").css("cursor", "ns-resize");
                                    }
                                };
                                var mouseUp = function (e) {
                                    $("body").css("cursor", "");
                                    $("body").unbind("mousemove", mouseMove).unbind("mouseup", mouseUp);
                                };
                                $("body").mousemove(mouseMove).mouseup(mouseUp);
                                e.preventDefault();
                            }
                        });
                    };
                    return LayoutResizeableBindingHander;
                })();
                Bindings.LayoutResizeableBindingHander = LayoutResizeableBindingHander;
            })(Bindings = DataCatalog.Bindings || (DataCatalog.Bindings = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
ko.bindingHandlers["layoutPanel"] = new Microsoft.DataStudio.DataCatalog.Bindings.LayoutPanelBindingHander();
ko.bindingHandlers["layoutResizeable"] = new Microsoft.DataStudio.DataCatalog.Bindings.LayoutResizeableBindingHander();
/// <reference path="../../References.d.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var ConfigData = (function () {
                function ConfigData() {
                }
                ConfigData.leftPanel = [];
                ConfigData.rightPanel = [];
                ConfigData.datacatalogImagePath = "node_modules/@ms-atlas-module/datastudio-datacatalog/images/";
                ConfigData.moduleConfig = {
                    name: "datacatalog",
                    text: "Data Catalog",
                    symbol: "",
                    url: "datacatalog",
                    defaultViewName: "home",
                    sidePanel: null,
                    drawer: null,
                    views: [
                        {
                            name: "home",
                            leftPanel: null,
                            rightPanel: null,
                            commandBarComponentName: 'datacatalog-home-commandBar',
                            componentName: "datacatalog-home-home",
                            isFullScreen: true
                        },
                        {
                            name: "browse",
                            leftPanel: null,
                            rightPanel: null,
                            commandBarComponentName: 'datacatalog-browse-search',
                            componentName: "datacatalog-browse-browse",
                            isFullScreen: true
                        },
                        {
                            name: "admin",
                            leftPanel: null,
                            rightPanel: null,
                            componentName: "datacatalog-admin-admin",
                            isFullScreen: true
                        },
                        {
                            name: "publish",
                            leftPanel: null,
                            rightPanel: null,
                            componentName: "datacatalog-publish-publish",
                            isFullScreen: true
                        },
                        {
                            name: "provision",
                            leftPanel: null,
                            rightPanel: null,
                            componentName: "datacatalog-provision-catalog",
                            isFullScreen: true
                        }
                    ]
                };
                return ConfigData;
            })();
            DataCatalog.ConfigData = ConfigData;
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
// <reference path="../../../bin/IResx.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Core;
            (function (Core) {
                Core.Resx = require("i18n!node_modules/@ms-atlas-module/datastudio-datacatalog/nls/resx");
            })(Core = DataCatalog.Core || (DataCatalog.Core = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Core;
            (function (Core) {
                var ConnectionStringUtilities = (function () {
                    function ConnectionStringUtilities() {
                    }
                    ConnectionStringUtilities.getProperty = function (key, entity) {
                        var keys = key.split(".");
                        var value;
                        var entityObject = entity;
                        keys.forEach(function (k) {
                            if (entityObject[k]) {
                                entityObject = entityObject[k];
                            }
                            if (typeof entityObject === "string") {
                                value = entityObject;
                            }
                        });
                        var plainText = Core.Utilities.extractHighlightedWords([value]);
                        value = plainText[0] || value;
                        return value;
                    };
                    ConnectionStringUtilities.getKeyWordValue = function (key) {
                        return ConnectionStringUtilities.keyWords[key] || null;
                    };
                    ConnectionStringUtilities.parse = function (base, entity) {
                        if (!base) {
                            return "";
                        }
                        var openBraces = null;
                        var closeBraces = null;
                        // Find two characters not in the string to use as place holders for double curly braces.
                        // Doulbe curly braces are tempararily removed while single curly braces are processed.
                        for (var i = 0; i < 123; i++) {
                            var emptyCharacter = String.fromCharCode(i);
                            var index;
                            if (!openBraces) {
                                index = base.indexOf(emptyCharacter);
                                if (index === -1) {
                                    openBraces = emptyCharacter;
                                    base = base.replace(/{{/g, emptyCharacter);
                                }
                            }
                            else if (!closeBraces) {
                                index = base.indexOf(emptyCharacter);
                                if (index === -1) {
                                    closeBraces = emptyCharacter;
                                    base = base.replace(/}}/g, emptyCharacter);
                                }
                            }
                        }
                        if (!openBraces || !closeBraces) {
                            throw new Error("Unable to parse connection string. Connection string contains invalid characters.");
                        }
                        base = base.replace(/{.+?}/g, function (match, num) {
                            match = match.substr(1, match.length - 2);
                            var value = match;
                            var keyword = ConnectionStringUtilities.getKeyWordValue(match);
                            if (keyword) {
                                value = keyword;
                                // Escape any braces in the replaced value. These will be added back in after the check for stray braces.
                                value = value.replace(/{/g, openBraces);
                                value = value.replace(/}/g, closeBraces);
                            }
                            else {
                                var property = ConnectionStringUtilities.getProperty(match, entity);
                                if (property) {
                                    value = property;
                                }
                            }
                            return value;
                        });
                        var singleOpenBraceIndex = base.indexOf("{");
                        var singleCloseBraceIndex = base.indexOf("}");
                        if (singleOpenBraceIndex > -1) {
                            throw new Error(Core.Utilities.stringFormat("Unexpected open brace found at position {0}", singleOpenBraceIndex));
                        }
                        if (singleCloseBraceIndex > -1) {
                            throw new Error(Core.Utilities.stringFormat("Unexpected close brace found at position {0}", singleCloseBraceIndex));
                        }
                        // Add escaped braces back into the connection string.
                        var openRegex = new RegExp(openBraces, "g");
                        var closeRegex = new RegExp(closeBraces, "g");
                        base = base.replace(openRegex, "{");
                        base = base.replace(closeRegex, "}");
                        return base;
                    };
                    ConnectionStringUtilities.keyWords = {
                        "currentUser": $tokyo.user.email,
                        "userName": Core.Resx.userNameHere,
                        "passwordHintText": Core.Resx.yourPasswordHere
                    };
                    return ConnectionStringUtilities;
                })();
                Core.ConnectionStringUtilities = ConnectionStringUtilities;
            })(Core = DataCatalog.Core || (DataCatalog.Core = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Core;
            (function (Core) {
                var logger = Microsoft.DataStudio.DataCatalog.LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC SourceTypes" });
                var SourceTypes = (function () {
                    function SourceTypes() {
                    }
                    SourceTypes.getSourceTypes = function () {
                        var types = [];
                        for (var key in SourceTypes.sources) {
                            types.push(SourceTypes.sources[key].sourceType);
                        }
                        ;
                        return types.sort();
                    };
                    SourceTypes.getSourceTypesArray = function () {
                        var _this = this;
                        var types = [];
                        Object.keys(this.sources).forEach(function (key) {
                            types.push(_this.sources[key]);
                        });
                        return types;
                    };
                    SourceTypes.getObjectTypes = function (sourceName) {
                        var types = [];
                        var source = SourceTypes.sources[sourceName.toLowerCase()];
                        if (source) {
                            for (var key in source.objectTypes) {
                                types.push(source.objectTypes[key].objectType);
                            }
                        }
                        return types.sort();
                    };
                    SourceTypes.getObjectTypesArray = function (sourceName) {
                        var types = [];
                        var source = this.sources[sourceName.toLowerCase()];
                        if (source) {
                            for (var key in source.objectTypes) {
                                types.push(source.objectTypes[key]);
                            }
                        }
                        return types;
                    };
                    SourceTypes.getSourceType = function (sourceName) {
                        return SourceTypes.sources[sourceName.toLowerCase()];
                    };
                    SourceTypes.getObjectType = function (sourceName, objectName) {
                        return SourceTypes.sources[sourceName.toLowerCase()].objectTypes[objectName.toLowerCase()];
                    };
                    SourceTypes.getEditFields = function (sourceName, objectName) {
                        var fields = [];
                        if (SourceTypes.sources[sourceName.toLowerCase()] && SourceTypes.sources[sourceName.toLowerCase()].objectTypes[objectName.toLowerCase()]) {
                            fields = SourceTypes.sources[sourceName.toLowerCase()].objectTypes[objectName.toLowerCase()].editFields;
                        }
                        return fields;
                    };
                    SourceTypes.supportsSchema = function (sourceName, objectName) {
                        var hasSchema = false;
                        var name = sourceName.toLowerCase();
                        var obj = objectName.toLowerCase();
                        if (SourceTypes.sources[name] && SourceTypes.sources[name].objectTypes[obj]) {
                            var defaults = SourceTypes.sources[name].objectTypes[obj].defaults;
                            if (defaults) {
                                hasSchema = defaults.hasOwnProperty("schemas");
                            }
                        }
                        return hasSchema;
                    };
                    SourceTypes.hasConnectionsString = function (sourceName) {
                        var sourceType = SourceTypes.getSourceType(sourceName);
                        var hasString = false;
                        if (sourceType) {
                            hasString = sourceType.hasOwnProperty("connectionStrings");
                        }
                        return hasString;
                    };
                    SourceTypes.getConnectionStrings = function (sourceName) {
                        var sourceType = SourceTypes.getSourceType(sourceName);
                        var connectionStrings = [];
                        if (sourceType) {
                            connectionStrings = sourceType.connectionStrings || [];
                        }
                        else {
                            logger.logInfo("Attempted to return connection strings for an undefined source type", { data: { sourceType: sourceName } });
                        }
                        return connectionStrings;
                    };
                    // Fields.
                    SourceTypes.serverField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.server", label: Core.Resx.objecttype_server, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.databaseField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.database", label: Core.Resx.database, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.schemaField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.schema", label: Core.Resx.schemaName, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.objectField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.object", label: Core.Resx.objecttype_object, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.objectTypeField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.objectType", label: Core.Resx.objectType, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.modelField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.model", label: Core.Resx.model, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.pathField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.path", label: Core.Resx.path, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.versionField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.version", label: Core.Resx.version, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.domainField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.domain", label: Core.Resx.domain, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.accountField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.account", label: Core.Resx.account, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.containerField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.container", label: Core.Resx.container, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.nameField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.name", label: Core.Resx.name, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.urlField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.url", label: Core.Resx.url, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.portField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.port", label: Core.Resx.port, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.viewField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.view", label: Core.Resx.view, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.resourceField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.resource", label: Core.Resx.resource, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.loginServerField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.loginServer", label: Core.Resx.loginServer, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.classField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.class", label: Core.Resx.class_label, placeHolder: "", validatePattern: /.+/ } };
                    SourceTypes.itemNameField = { editForm: "datacatalog-shell-textfield", editFormParams: { bindingPath: "dsl.address.itemName", label: Core.Resx.itemName, placeHolder: "", validatePatter: /.+/ } };
                    // Source types.
                    SourceTypes.sources = {
                        "sql server": {
                            sourceType: "SQL Server",
                            label: Core.Resx.sourcetype_sqlserver,
                            editLabel: Core.Resx.sourcetype_sqlserver,
                            protocol: "tds",
                            formatType: "structured",
                            authentication: [{ name: "sql", label: Core.Resx.authentication_sql }, { name: "windows", label: Core.Resx.authentication_windows }],
                            connectionStrings: [
                                {
                                    driver: "ADO.NET",
                                    label: Core.Resx.connectionString_ado_net,
                                    baseString: "Server={dsl.address.server};Database={dsl.address.database};User Id={userName};Password={passwordHintText};"
                                },
                                {
                                    driver: "ODBC",
                                    label: Core.Resx.connectionString_odbc,
                                    baseString: "Driver={{SQL Server}};Server={dsl.address.server};Database={dsl.address.database};Uid={userName};Pwd={passwordHintText};Trusted_Connection=no;"
                                },
                                {
                                    driver: "OLEDB",
                                    label: Core.Resx.connectionString_oledb,
                                    baseString: "Provider=SQLOLEDB;Data Source={dsl.address.server};Initial Catalog={dsl.address.database};UserId={userName};Password={passwordHintText};"
                                },
                                {
                                    driver: "JDBC",
                                    label: Core.Resx.connectionString_jdbc,
                                    baseString: "jdbc:sqlserver:{dsl.address.server};database={dsl.address.database};user={userName};password={passwordHintText};"
                                }
                            ],
                            objectTypes: {
                                "table": {
                                    objectType: "Table",
                                    label: Core.Resx.sqlserver_table,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_table,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "view": {
                                    objectType: "View",
                                    label: Core.Resx.sqlserver_view,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_view,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "database": {
                                    objectType: "Database",
                                    label: Core.Resx.database,
                                    rootType: "containers",
                                    editLabel: Core.Resx.database,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                                }
                            }
                        },
                        "sql data warehouse": {
                            sourceType: "SQL Data Warehouse",
                            label: Core.Resx.sourcetype_verbose_sqldatawarehouse,
                            editLabel: Core.Resx.sourcetype_verbose_sqldatawarehouse,
                            protocol: "tds",
                            formatType: "structured",
                            authentication: [{ name: "sql", label: Core.Resx.authentication_sql }],
                            objectTypes: {
                                "table": {
                                    objectType: "Table",
                                    label: Core.Resx.sqldatawarehouse_table,
                                    rootType: "tables",
                                    editLabel: Core.Resx.sqldatawarehouse_table,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "view": {
                                    objectType: "View",
                                    label: Core.Resx.sqldatawarehouse_view,
                                    rootType: "tables",
                                    editLabel: Core.Resx.sqldatawarehouse_view,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "database": {
                                    objectType: "Database",
                                    label: Core.Resx.sqldatawarehouse_database,
                                    rootType: "containers",
                                    editLabel: Core.Resx.sqldatawarehouse_database,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                                }
                            }
                        },
                        "oracle database": {
                            sourceType: "Oracle Database",
                            label: Core.Resx.sourcetype_oracledatabase,
                            editLabel: Core.Resx.sourcetype_oracledatabase,
                            protocol: "oracle",
                            formatType: "structured",
                            authentication: [{ name: "protocol", label: Core.Resx.authentication_protocol }, { name: "windows", label: Core.Resx.authentication_windows }],
                            connectionStrings: [
                                {
                                    driver: "ODBC",
                                    label: Core.Resx.connectionString_odbc,
                                    baseString: "Driver={{Microsoft ODBC for Oracle}};Server={dsl.address.server};Uid={userName};Pwd={passwordHintText};"
                                },
                                {
                                    driver: "OLEDB",
                                    label: Core.Resx.connectionString_oledb,
                                    baseString: "Provider=MSDAORA;Data Source={dsl.address.database};User Id={userName};Password={passwordHintText};"
                                }
                            ],
                            objectTypes: {
                                "table": {
                                    objectType: "Table",
                                    label: Core.Resx.oracledatabase_table,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_table,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "view": {
                                    objectType: "View",
                                    label: Core.Resx.oracledatabase_view,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_view,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "database": {
                                    objectType: "Database",
                                    label: Core.Resx.sourcetype_oracledatabase,
                                    rootType: "containers",
                                    editLabel: Core.Resx.database,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                                }
                            }
                        },
                        "mysql": {
                            sourceType: "MySQL",
                            label: Core.Resx.sourcetype_mysql,
                            editLabel: Core.Resx.sourcetype_mysql,
                            protocol: "mysql",
                            formatType: "structured",
                            authentication: [{ name: "basic", label: Core.Resx.authentication_basic }],
                            objectTypes: {
                                "table": {
                                    objectType: "Table",
                                    label: Core.Resx.mysql_table,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_table,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "view": {
                                    objectType: "View",
                                    label: Core.Resx.mysql_view,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_view,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "database": {
                                    objectType: "Database",
                                    label: Core.Resx.mysql_database,
                                    rootType: "containers",
                                    editLabel: Core.Resx.database,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                                }
                            }
                        },
                        "sql server analysis services tabular": {
                            sourceType: "SQL Server Analysis Services Tabular",
                            label: Core.Resx.sourcetype_sqlserveranalysisservices_editlabel,
                            editLabel: Core.Resx.sourcetype_sqlserveranalysisservices_editlabel,
                            protocol: "analysis-services",
                            formatType: "structured",
                            authentication: [{ name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "table": {
                                    objectType: "Table",
                                    label: Core.Resx.sqlserveranalysisservices_table,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_table,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField, SourceTypes.objectField, SourceTypes.objectTypeField]
                                },
                                "model": {
                                    objectType: "Model",
                                    label: Core.Resx.model,
                                    rootType: "containers",
                                    editLabel: Core.Resx.model,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField]
                                }
                            }
                        },
                        "sql server analysis services multidimensional": {
                            sourceType: "SQL Server Analysis Services Multidimensional",
                            label: Core.Resx.sourcetype_sqlserveranalysisservicesmultidimensional_editlabel,
                            editLabel: Core.Resx.sourcetype_sqlserveranalysisservicesmultidimensional_editlabel,
                            protocol: "analysis-services",
                            formatType: "structured",
                            authentication: [{ name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "dimension": {
                                    objectType: "Dimension",
                                    label: Core.Resx.sqlserveranalysisservices_dimension,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_dimension,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField, SourceTypes.objectField, SourceTypes.objectTypeField]
                                },
                                "measure": {
                                    objectType: "Measure",
                                    label: Core.Resx.sqlserveranalysisservicesmultidimensional_measure,
                                    rootType: "measures",
                                    editLabel: Core.Resx.objecttype_measure,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField, SourceTypes.objectField, SourceTypes.objectTypeField]
                                },
                                "kpi": {
                                    objectType: "KPI",
                                    label: Core.Resx.sqlserveranalysisservicesmultidimensional_kpi,
                                    rootType: "kpis",
                                    editLabel: Core.Resx.objecttype_kpi,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField, SourceTypes.objectField, SourceTypes.objectTypeField]
                                },
                                "model": {
                                    objectType: "Model",
                                    label: Core.Resx.model,
                                    rootType: "containers",
                                    editLabel: Core.Resx.model,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.modelField]
                                }
                            }
                        },
                        "sql server reporting services": {
                            sourceType: "SQL Server Reporting Services",
                            label: Core.Resx.sourcetype_sqlserverreportingservices,
                            editLabel: Core.Resx.sourcetype_sqlserverreportingservices,
                            protocol: "reporting-services",
                            formatType: "structured",
                            authentication: [{ name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "report": {
                                    objectType: "Report",
                                    label: Core.Resx.sqlserverreportingservices_report,
                                    rootType: "reports",
                                    editLabel: Core.Resx.objecttype_report,
                                    editFields: [SourceTypes.serverField, SourceTypes.pathField, SourceTypes.versionField]
                                },
                                "server": {
                                    objectType: "Server",
                                    label: Core.Resx.objecttype_server,
                                    rootType: "containers",
                                    editLabel: Core.Resx.objecttype_server,
                                    editFields: [SourceTypes.serverField, SourceTypes.versionField]
                                }
                            }
                        },
                        "azure storage": {
                            sourceType: "Azure Storage",
                            label: Core.Resx.sourcetype_azurestorage,
                            editLabel: Core.Resx.sourcetype_azurestorage,
                            protocol: "azure-blobs",
                            formatType: "unstructured",
                            authentication: [{ name: "Azure-Access-Key", label: Core.Resx.authentication_azure }],
                            objectTypes: {
                                "blob": {
                                    objectType: "Blob",
                                    label: Core.Resx.azurestorage_blob,
                                    rootType: "tables",
                                    editLabel: Core.Resx.azurestorage_blob,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.domainField, SourceTypes.accountField, SourceTypes.containerField, SourceTypes.nameField]
                                },
                                "directory": {
                                    objectType: "Directory",
                                    label: Core.Resx.azurestorage_directory,
                                    rootType: "tables",
                                    editLabel: Core.Resx.azurestorage_directory,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.domainField, SourceTypes.accountField, SourceTypes.containerField, SourceTypes.nameField]
                                },
                                "container": {
                                    objectType: "Container",
                                    label: Core.Resx.container,
                                    rootType: "containers",
                                    editLabel: Core.Resx.container,
                                    editFields: [SourceTypes.domainField, SourceTypes.accountField, SourceTypes.containerField]
                                },
                                "azure storage": {
                                    objectType: "Azure Storage",
                                    label: Core.Resx.azurestorage_azurestorage,
                                    rootType: "containers",
                                    editLabel: Core.Resx.azurestorage_azurestorage,
                                    protocol: "azure-tables",
                                    editFields: [SourceTypes.domainField, SourceTypes.accountField]
                                },
                                "table": {
                                    objectType: "Table",
                                    label: Core.Resx.azurestorage_table,
                                    rootType: "tables",
                                    editLabel: Core.Resx.azurestorage_table,
                                    protocol: "azure-tables",
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.domainField, SourceTypes.accountField, SourceTypes.nameField]
                                }
                            }
                        },
                        "hadoop distributed file system": {
                            sourceType: "Hadoop Distributed File System",
                            label: Core.Resx.sourcetype_hadoopdistributedfilesystem,
                            editLabel: Core.Resx.sourcetype_hadoopdistributedfilesystem,
                            protocol: "webhdfs",
                            formatType: "unstructured",
                            authentication: [{ name: "basic", label: Core.Resx.authentication_basic }, { name: "oauth", label: Core.Resx.authentication_oauth }],
                            objectTypes: {
                                "file": {
                                    objectType: "File",
                                    label: Core.Resx.hadoopdistributedfilesystem_file,
                                    rootType: "tables",
                                    editLabel: Core.Resx.hadoopdistributedfilesystem_file,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.urlField]
                                },
                                "directory": {
                                    objectType: "Directory",
                                    label: Core.Resx.hadoopdistributedfilesystem_directory,
                                    rootType: "tables",
                                    editLabel: Core.Resx.hadoopdistributedfilesystem_directory,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.urlField]
                                },
                                "cluster": {
                                    objectType: "Cluster",
                                    label: Core.Resx.cluster,
                                    rootType: "containers",
                                    editLabel: Core.Resx.cluster,
                                    editFields: [SourceTypes.urlField]
                                }
                            }
                        },
                        "azure data lake store": {
                            sourceType: "Azure Data Lake Store",
                            label: Core.Resx.sourcetype_azuredatalakestore,
                            editLabel: Core.Resx.sourcetype_azuredatalakestore,
                            protocol: "webhdfs",
                            formatType: "unstructured",
                            authentication: [{ name: "basic", label: Core.Resx.authentication_basic }, { name: "oauth", label: Core.Resx.authentication_oauth }],
                            objectTypes: {
                                "file": {
                                    objectType: "File",
                                    label: Core.Resx.azuredatalakestore_file,
                                    rootType: "tables",
                                    editLabel: Core.Resx.azuredatalakestore_file,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.urlField]
                                },
                                "directory": {
                                    objectType: "Directory",
                                    label: Core.Resx.azuredatalakestore_directory,
                                    rootType: "tables",
                                    editLabel: Core.Resx.azuredatalakestore_directory,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.urlField]
                                },
                                "data lake": {
                                    objectType: "Data Lake",
                                    label: Core.Resx.cluster,
                                    rootType: "containers",
                                    editLabel: Core.Resx.cluster,
                                    editFields: [SourceTypes.urlField]
                                }
                            }
                        },
                        "teradata": {
                            sourceType: "Teradata",
                            label: Core.Resx.sourcetype_teradata,
                            editLabel: Core.Resx.sourcetype_teradata,
                            protocol: "teradata",
                            formatType: "structured",
                            authentication: [{ name: "protocol", label: Core.Resx.authentication_protocol }, { name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "view": {
                                    objectType: "View",
                                    label: Core.Resx.teradata_view,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_view,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.objectField]
                                },
                                "table": {
                                    objectType: "Table",
                                    label: Core.Resx.teradata_table,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_table,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.objectField]
                                },
                                "database": {
                                    objectType: "Database",
                                    label: Core.Resx.teradata_database,
                                    rootType: "containers",
                                    editLabel: Core.Resx.database,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                                }
                            }
                        },
                        "hive": {
                            sourceType: "Hive",
                            label: Core.Resx.sourcetype_hive,
                            editLabel: Core.Resx.sourcetype_hive,
                            protocol: "hive",
                            formatType: "structured",
                            authentication: [{ name: "hdinsight", label: Core.Resx.authentication_hdinsight }, { name: "basic", label: Core.Resx.authentication_basic }, { name: "username", label: Core.Resx.authentication_username }, { name: "none", label: Core.Resx.authentication_none }],
                            objectTypes: {
                                "view": {
                                    objectType: "View",
                                    label: Core.Resx.hive_view,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_view,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.portField, SourceTypes.databaseField, SourceTypes.objectField]
                                },
                                "table": {
                                    objectType: "Table",
                                    label: Core.Resx.hive_table,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_table,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.portField, SourceTypes.databaseField, SourceTypes.objectField]
                                },
                                "database": {
                                    objectType: "Database",
                                    label: Core.Resx.database,
                                    rootType: "containers",
                                    editLabel: Core.Resx.database,
                                    editFields: [SourceTypes.serverField, SourceTypes.portField, SourceTypes.databaseField]
                                }
                            }
                        },
                        "sap hana": {
                            sourceType: "SAP Hana",
                            label: Core.Resx.sourcetype_saphana,
                            editLabel: Core.Resx.sourcetype_saphana,
                            protocol: "sap-hana-sql",
                            formatType: "structured",
                            authentication: [{ name: "protocol", label: Core.Resx.authentication_protocol }, { name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "view": {
                                    objectType: "View",
                                    label: Core.Resx.saphana_view,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_view,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "server": {
                                    objectType: "Server",
                                    label: Core.Resx.saphana_server,
                                    rootType: "containers",
                                    editLabel: Core.Resx.objecttype_server,
                                    editFields: [SourceTypes.serverField]
                                }
                            }
                        },
                        "odata": {
                            sourceType: "Odata",
                            label: Core.Resx.sourcetype_odata,
                            editLabel: Core.Resx.sourcetype_odata,
                            protocol: "odata",
                            formatType: "structured",
                            authentication: [{ name: "none", label: Core.Resx.authentication_none }, { name: "basic", label: Core.Resx.authentication_basic }, { name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "function": {
                                    objectType: "Function",
                                    label: Core.Resx.odata_function,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_function,
                                    editFields: [SourceTypes.urlField, SourceTypes.resourceField]
                                },
                                "entity set": {
                                    objectType: "Entity Set",
                                    label: Core.Resx.odata_entityset,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_entityset,
                                    editFields: [SourceTypes.urlField, SourceTypes.resourceField]
                                },
                                "entity container": {
                                    objectType: "Entity Container",
                                    label: Core.Resx.odata_entitycontainer,
                                    rootType: "containers",
                                    editLabel: Core.Resx.objecttype_entitycontainer,
                                    editFields: [SourceTypes.urlField, SourceTypes.resourceField]
                                }
                            }
                        },
                        "http": {
                            sourceType: "Http",
                            label: Core.Resx.sourcetype_http,
                            editLabel: Core.Resx.sourcetype_http,
                            protocol: "http",
                            formatType: "unstructured",
                            authentication: [{ name: "none", label: Core.Resx.authentication_none }, { name: "basic", label: Core.Resx.authentication_basic }, { name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "file": {
                                    objectType: "File",
                                    label: Core.Resx.objecttype_file,
                                    rootType: "tables",
                                    editLabel: Core.Resx.http_file,
                                    editFields: [SourceTypes.urlField]
                                },
                                "end point": {
                                    objectType: "End Point",
                                    label: Core.Resx.objecttype_endpoint,
                                    rootType: "tables",
                                    editLabel: Core.Resx.http_endpoint,
                                    editFields: [SourceTypes.urlField]
                                },
                                "report": {
                                    objectType: "Report",
                                    label: Core.Resx.objecttype_report,
                                    rootType: "reports",
                                    editLabel: Core.Resx.http_report,
                                    editFields: [SourceTypes.urlField]
                                },
                                "site": {
                                    objectType: "Site",
                                    label: Core.Resx.objecttype_site,
                                    rootType: "containers",
                                    editLabel: Core.Resx.http_site,
                                    editFields: [SourceTypes.urlField]
                                }
                            }
                        },
                        "file system": {
                            sourceType: "File System",
                            label: Core.Resx.sourcetype_filesystem,
                            editLabel: Core.Resx.sourcetype_filesystem,
                            protocol: "file",
                            formatType: "unstructure",
                            authentication: [{ name: "none", label: Core.Resx.authentication_none }, { name: "basic", label: Core.Resx.authentication_basic }, { name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "file": {
                                    objectType: "File",
                                    label: Core.Resx.objecttype_file,
                                    rootType: "tables",
                                    editLabel: Core.Resx.filesystem_file,
                                    editFields: [SourceTypes.pathField]
                                }
                            }
                        },
                        "sharepoint": {
                            sourceType: "Sharepoint",
                            label: Core.Resx.sourcetype_sharepoint,
                            editLabel: Core.Resx.sourcetype_sharepoint,
                            protocol: "sharepoint-list",
                            formatType: "unstructured",
                            authentication: [{ name: "basic", label: Core.Resx.authentication_basic }, { name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "list": {
                                    objectType: "List",
                                    label: Core.Resx.objecttype_list,
                                    rootType: "tables",
                                    editLabel: Core.Resx.sharepoint_list,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.urlField]
                                }
                            }
                        },
                        "ftp": {
                            sourceType: "FTP",
                            label: Core.Resx.sourcetype_ftp,
                            editLabel: Core.Resx.sourcetype_ftp,
                            protocol: "ftp",
                            formatType: "unstructured",
                            authentication: [{ name: "none", label: Core.Resx.authentication_none }, { name: "basic", label: Core.Resx.authentication_basic }, { name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "file": {
                                    objectType: "File",
                                    label: Core.Resx.objecttype_file,
                                    rootType: "tables",
                                    editLabel: Core.Resx.ftp_file,
                                    editFields: [SourceTypes.urlField]
                                },
                                "directory": {
                                    objectType: "Directory",
                                    label: Core.Resx.objecttype_directory,
                                    rootType: "tables",
                                    editLabel: Core.Resx.ftp_directory,
                                    editFields: [SourceTypes.urlField]
                                }
                            }
                        },
                        "salesforce": {
                            sourceType: "Salesforce",
                            label: Core.Resx.sourcetype_salesforce,
                            editLabel: Core.Resx.sourcetype_salesforce,
                            protocol: "salesforce-com",
                            formatType: "unstructured",
                            authentication: [{ name: "basic", label: Core.Resx.authentication_basic }, { name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "object": {
                                    objectType: "Object",
                                    label: Core.Resx.objecttype_object,
                                    rootType: "tables",
                                    editLabel: Core.Resx.salesforce_object,
                                    editFields: [SourceTypes.loginServerField, SourceTypes.classField, SourceTypes.itemNameField]
                                }
                            }
                        },
                        "db2": {
                            sourceType: "Db2",
                            label: Core.Resx.sourcetype_db2,
                            editLabel: Core.Resx.sourcetype_db2,
                            protocol: "db2",
                            formatType: "structured",
                            authentication: [{ name: "basic", label: Core.Resx.authentication_basic }, { name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "table": {
                                    objectType: "Table",
                                    label: Core.Resx.objecttype_table,
                                    rootType: "tables",
                                    editLabel: Core.Resx.db2_table,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "view": {
                                    objectType: "View",
                                    label: Core.Resx.objecttype_view,
                                    rootType: "tables",
                                    editLabel: Core.Resx.db2_view,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "database": {
                                    objectType: "Database",
                                    label: Core.Resx.objecttype_database,
                                    rootType: "containers",
                                    editLabel: Core.Resx.db2_database,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                                }
                            }
                        },
                        "postgresql": {
                            sourceType: "Postgresql",
                            label: Core.Resx.sourcetype_postgresql,
                            editLabel: Core.Resx.sourcetype_postgresql,
                            protocol: "postgresql",
                            formatType: "structured",
                            authentication: [{ name: "basic", label: Core.Resx.authentication_basic }, { name: "windows", label: Core.Resx.authentication_windows }],
                            objectTypes: {
                                "table": {
                                    objectType: "Table",
                                    label: Core.Resx.objecttype_table,
                                    rootType: "tables",
                                    editLabel: Core.Resx.postgresql_table,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "view": {
                                    objectType: "View",
                                    label: Core.Resx.objecttype_view,
                                    rootType: "tables",
                                    editLabel: Core.Resx.postgresql_view,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField, SourceTypes.schemaField, SourceTypes.objectField]
                                },
                                "database": {
                                    objectType: "Database",
                                    label: Core.Resx.objecttype_database,
                                    rootType: "containers",
                                    editLabel: Core.Resx.postgresql_database,
                                    editFields: [SourceTypes.serverField, SourceTypes.databaseField]
                                }
                            }
                        },
                        "other": {
                            sourceType: "Other",
                            label: Core.Resx.sourcetype_other,
                            editLabel: Core.Resx.sourcetype_other,
                            protocol: "generic-asset",
                            formatType: "unstructured",
                            authentication: [{ name: "none", label: Core.Resx.authentication_none }],
                            objectTypes: {
                                "other": {
                                    objectType: "Other",
                                    label: Core.Resx.objecttype_other,
                                    rootType: "tables",
                                    editLabel: Core.Resx.objecttype_other,
                                    defaults: {
                                        schemas: []
                                    },
                                    editFields: [
                                        { editForm: "shell-textfield", editFormParams: { bindingPath: "dsl.address.assetId", label: Core.Resx.sourcetype_id, placeHolder: Core.Resx.other_connectionPlaceholderText } }
                                    ]
                                }
                            }
                        }
                    };
                    return SourceTypes;
                })();
                Core.SourceTypes = SourceTypes;
            })(Core = DataCatalog.Core || (DataCatalog.Core = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
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
            })(Knockout = DataCatalog.Knockout || (DataCatalog.Knockout = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
// Used by views\shell\app
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Managers;
            (function (Managers) {
                var AppManager = (function () {
                    function AppManager() {
                    }
                    AppManager.setLatestVersion = function (latestVersion) {
                        AppManager._latestVersion(latestVersion);
                    };
                    AppManager.hideUpgradeNotice = function () {
                        AppManager._showUpdgradeOverride(true);
                        setTimeout(function () {
                            AppManager._showUpdgradeOverride(false);
                        }, 1000 * 60 * 60);
                    };
                    AppManager._showUpdgradeOverride = ko.observable(false);
                    AppManager._latestVersion = ko.observable($tokyo.app.version);
                    AppManager.showUpgradeIsAvailable = ko.pureComputed(function () {
                        return AppManager._latestVersion() !== $tokyo.app.version && !AppManager._showUpdgradeOverride();
                    });
                    return AppManager;
                })();
                Managers.AppManager = AppManager;
            })(Managers = DataCatalog.Managers || (DataCatalog.Managers = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Managers;
            (function (Managers) {
                var logger = Microsoft.DataStudio.DataCatalog.LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Managers" });
                var BatchManagementManager = (function () {
                    function BatchManagementManager() {
                    }
                    //#endregion
                    BatchManagementManager.hasChanges = function () {
                        var hasChanges = !!Object.keys(this.getChanges()).length;
                        if (this.snapshotData && !this.isResolvingObjectIds()) {
                            return hasChanges;
                        }
                        return false;
                    };
                    BatchManagementManager.init = function () {
                        var _this = this;
                        this.isResolvingObjectIds(true);
                        this.invalidOwners([]);
                        this.invalidUsers([]);
                        this.failedOwners([]);
                        this.failedUsers([]);
                        this.validatingOwners(false);
                        this.validatingUsers(false);
                        this._objectIdMap[$tokyo.user.objectId] = $tokyo.user.email;
                        this._upnMap[$tokyo.user.email] = $tokyo.user.objectId;
                        this.resolveObjectIds()
                            .then(function (result) {
                            if (result && result.valid && result.valid.length) {
                                result.valid.forEach(function (r) {
                                    _this._objectIdMap[r.objectId] = r.upn;
                                    _this._upnMap[r.upn] = r.objectId;
                                });
                            }
                            _this.isResolvingObjectIds(false);
                            _this.takeSnapshot();
                        });
                    };
                    BatchManagementManager.cancel = function () {
                        BatchManagementManager.init();
                    };
                    BatchManagementManager.getChanges = function () {
                        var _this = this;
                        var changes = {};
                        if (this.snapshot()) {
                            // Determine visibility change
                            var endingVisibility = this.snapshot().visibility();
                            if (endingVisibility !== this.snapshotData.visibility) {
                                changes.visibility = endingVisibility;
                            }
                            // Determine owner deltas
                            var endingOwnersOnAll = this.snapshot().ownersOnAll().map(function (t) { return t.name; });
                            var endingOwnersOnSome = this.snapshot().ownersOnSome().map(function (t) { return t.name; });
                            var ownersToAdd = DataCatalog.Core.Utilities.arrayExcept(endingOwnersOnAll, this.snapshotData.ownersOnAll);
                            var ownersToRemoveFromAll = DataCatalog.Core.Utilities.arrayExcept(this.snapshotData.ownersOnAll, endingOwnersOnAll);
                            var ownersToRemoveFromSome = DataCatalog.Core.Utilities.arrayExcept(this.snapshotData.ownersOnSome, endingOwnersOnSome);
                            ownersToRemoveFromSome = DataCatalog.Core.Utilities.arrayExcept(ownersToRemoveFromSome, ownersToAdd);
                            var ownersToRemove = ownersToRemoveFromAll.concat(ownersToRemoveFromSome);
                            if (ownersToAdd.length) {
                                changes.ownersToAdd = ownersToAdd.map(function (upn) { return { upn: upn, objectId: _this._upnMap[upn] }; });
                            }
                            if (ownersToRemove.length) {
                                changes.ownersToRemove = ownersToRemove.map(function (upn) { return { upn: upn, objectId: _this._upnMap[upn] }; });
                            }
                            // Determine user deltas
                            var endingUsersOnAll = this.snapshot().usersOnAll().map(function (t) { return t.name; });
                            var endingUsersOnSome = this.snapshot().usersOnSome().map(function (t) { return t.name; });
                            var usersToAdd = DataCatalog.Core.Utilities.arrayExcept(endingUsersOnAll, this.snapshotData.usersOnAll);
                            var usersToRemoveFromAll = DataCatalog.Core.Utilities.arrayExcept(this.snapshotData.usersOnAll, endingUsersOnAll);
                            var usersToRemoveFromSome = DataCatalog.Core.Utilities.arrayExcept(this.snapshotData.usersOnSome, endingUsersOnSome);
                            usersToRemoveFromSome = DataCatalog.Core.Utilities.arrayExcept(usersToRemoveFromSome, usersToAdd);
                            var usersToRemove = usersToRemoveFromAll.concat(usersToRemoveFromSome);
                            if (usersToAdd.length) {
                                changes.usersToAdd = usersToAdd.map(function (upn) { return { upn: upn, objectId: _this._upnMap[upn] }; });
                            }
                            if (usersToRemove.length) {
                                changes.usersToRemove = usersToRemove.map(function (upn) { return { upn: upn, objectId: _this._upnMap[upn] }; });
                            }
                        }
                        return changes;
                    };
                    BatchManagementManager.takeSnapshot = function () {
                        this.snapshotData = this.getSnapshot();
                        var copy = $.extend(true, {}, this.snapshotData);
                        var doesOwnAll = !!copy.ownersOnAll.filter(function (o) { return o === $tokyo.user.email; }).length;
                        var isMixedVisibility = copy.visibility === "Mixed";
                        var ownersOnAll = copy.ownersOnAll.map(function (upn) { return { name: upn, readOnly: !doesOwnAll }; }).sort();
                        var ownersOnSome = copy.ownersOnSome.map(function (upn) { return { name: upn, readOnly: !doesOwnAll }; }).sort();
                        var usersOnAll = copy.usersOnAll.map(function (upn) { return { name: upn, readOnly: !doesOwnAll || isMixedVisibility }; }).sort();
                        var usersOnSome = copy.usersOnSome.map(function (upn) { return { name: upn, readOnly: !doesOwnAll || isMixedVisibility }; }).sort();
                        if (isMixedVisibility) {
                            usersOnSome.push({
                                name: DataCatalog.Core.Resx.everyone,
                                readOnly: true
                            });
                        }
                        this.snapshot({
                            visibility: ko.observable(copy.visibility),
                            ownersOnAll: ko.observableArray(ownersOnAll),
                            ownersOnSome: ko.observableArray(ownersOnSome),
                            usersOnAll: ko.observableArray(usersOnAll),
                            usersOnSome: ko.observableArray(usersOnSome)
                        });
                    };
                    BatchManagementManager.getSnapshot = function () {
                        var _this = this;
                        var ownerObjectIdsOnAll = null;
                        var allOwnerObjectIds = [];
                        var userObjectIdsOnAll = null;
                        var allUserObjectIds = [];
                        var numberVisibleToAll = 0;
                        var numberVisibleToSome = 0;
                        (Managers.BrowseManager.multiSelected() || []).forEach(function (a) {
                            var owners = DataCatalog.Core.Utilities.arrayFirst(a.__roles().filter(function (r) { return r.role === "Owner"; }));
                            var assetOwnerObjectIds = [];
                            if (owners && owners.members && owners.members()) {
                                assetOwnerObjectIds = owners.members().map(function (m) { return m.objectId; });
                                allOwnerObjectIds = allOwnerObjectIds.concat(assetOwnerObjectIds);
                            }
                            if (!ownerObjectIdsOnAll) {
                                ownerObjectIdsOnAll = assetOwnerObjectIds;
                            }
                            else {
                                ownerObjectIdsOnAll = DataCatalog.Core.Utilities.arrayIntersect(ownerObjectIdsOnAll, assetOwnerObjectIds);
                            }
                            var assetUserObjectIds = [];
                            var foundReadPermission = false;
                            a.__permissions().forEach(function (p) {
                                var hasReadPermission = p.rights().some(function (r) { return r.right === "Read"; });
                                if (hasReadPermission) {
                                    foundReadPermission = true;
                                    assetUserObjectIds.push(p.principal.objectId);
                                    allUserObjectIds.push(p.principal.objectId);
                                }
                            });
                            if (foundReadPermission) {
                                numberVisibleToSome++;
                            }
                            else {
                                numberVisibleToAll++;
                            }
                            if (!userObjectIdsOnAll) {
                                userObjectIdsOnAll = assetUserObjectIds;
                            }
                            else {
                                userObjectIdsOnAll = DataCatalog.Core.Utilities.arrayIntersect(userObjectIdsOnAll, assetUserObjectIds);
                            }
                        });
                        var visibility = numberVisibleToSome === 0
                            ? "All"
                            : numberVisibleToAll === 0
                                ? "Some"
                                : "Mixed";
                        ownerObjectIdsOnAll = DataCatalog.Core.Utilities.arrayDistinct(ownerObjectIdsOnAll || []);
                        userObjectIdsOnAll = DataCatalog.Core.Utilities.arrayDistinct(userObjectIdsOnAll || []);
                        var nobody = function (objectId) { return objectId !== DataCatalog.Core.Constants.Users.NOBODY; };
                        return {
                            visibility: visibility,
                            ownersOnAll: ownerObjectIdsOnAll.map(function (oid) { return _this._objectIdMap[oid]; }),
                            ownersOnSome: DataCatalog.Core.Utilities.arrayDistinct(DataCatalog.Core.Utilities.arrayExcept(allOwnerObjectIds, ownerObjectIdsOnAll)).map(function (oid) { return _this._objectIdMap[oid]; }),
                            usersOnAll: userObjectIdsOnAll.filter(nobody).map(function (oid) { return _this._objectIdMap[oid]; }),
                            usersOnSome: DataCatalog.Core.Utilities.arrayDistinct(DataCatalog.Core.Utilities.arrayExcept(allUserObjectIds.filter(nobody), userObjectIdsOnAll)).map(function (oid) { return _this._objectIdMap[oid]; })
                        };
                    };
                    BatchManagementManager.resolveObjectIds = function () {
                        var deferred = $.Deferred();
                        var objectIds = [];
                        (Managers.BrowseManager.multiSelected() || []).forEach(function (a) {
                            (a.__roles() || []).forEach(function (r) {
                                objectIds = objectIds.concat(r.members().map(function (m) { return m.objectId; }));
                            });
                            (a.__permissions() || []).forEach(function (p) {
                                objectIds.push(p.principal.objectId);
                            });
                        });
                        objectIds = DataCatalog.Core.Utilities.arrayDistinct(objectIds);
                        if (objectIds.length) {
                            DataCatalog.Services.UserService.resolveObjectIds(objectIds)
                                .done(deferred.resolve)
                                .fail(function (e) {
                                deferred.resolve();
                            });
                        }
                        else {
                            deferred.resolve();
                        }
                        return deferred.promise();
                    };
                    BatchManagementManager.onOwnerRemoved = function () {
                        if (BatchManagementManager.snapshot() && !BatchManagementManager.snapshot().ownersOnAll().length) {
                            BatchManagementManager.snapshot().visibility("All");
                        }
                    };
                    BatchManagementManager.onValidateUpns = function (upns, userType) {
                        var deferred = jQuery.Deferred();
                        var validatingObservable = userType === "users" ? BatchManagementManager.validatingUsers : BatchManagementManager.validatingOwners;
                        validatingObservable(true);
                        DataCatalog.Services.UserService.resolveUpns(upns, "Allow")
                            .then(function (result) {
                            var validUpns = [];
                            (result.valid || []).forEach(function (user) {
                                validUpns.push(user.upn);
                                BatchManagementManager._upnMap[user.upn] = user.objectId;
                            });
                            deferred.resolve(validUpns);
                            if (userType === "users") {
                                BatchManagementManager.invalidUsers(result.invalid || []);
                                BatchManagementManager.failedUsers(result.failed || []);
                                BatchManagementManager.duplicatedUsers(result.duplicated || []);
                            }
                            else if (userType === "owners") {
                                BatchManagementManager.invalidOwners(result.invalid || []);
                                BatchManagementManager.failedOwners(result.failed || []);
                                BatchManagementManager.duplicatedOwners(result.duplicated || []);
                            }
                        })
                            .fail(function (e) {
                            logger.logError("failed to validate upns", e);
                        })
                            .always(function () {
                            validatingObservable(false);
                        });
                        return deferred.promise();
                    };
                    BatchManagementManager._upnMap = {}; // Upn -> ObjectId
                    BatchManagementManager._objectIdMap = {}; // ObjectId -> upn
                    BatchManagementManager.snapshot = ko.observable();
                    BatchManagementManager.invalidOwners = ko.observable([]);
                    BatchManagementManager.invalidUsers = ko.observable([]);
                    BatchManagementManager.failedOwners = ko.observable([]);
                    BatchManagementManager.failedUsers = ko.observable([]);
                    BatchManagementManager.duplicatedOwners = ko.observable([]);
                    BatchManagementManager.duplicatedUsers = ko.observable([]);
                    //#region state flags
                    BatchManagementManager.isResolvingObjectIds = ko.observable(true);
                    BatchManagementManager.validatingOwners = ko.observable(false);
                    BatchManagementManager.validatingUsers = ko.observable(false);
                    BatchManagementManager.canChangeVisibility = ko.pureComputed(function () {
                        var _canChangeVisibility = true;
                        (Managers.BrowseManager.multiSelected() || []).forEach(function (a) {
                            if (!a.hasChangeVisibilityRight()) {
                                _canChangeVisibility = false;
                            }
                        });
                        return _canChangeVisibility;
                    });
                    BatchManagementManager.canTakeOwnership = ko.pureComputed(function () {
                        var _canTakeOwnership = true;
                        (Managers.BrowseManager.multiSelected() || []).forEach(function (a) {
                            if (!a.hasTakeOwnershipRight() && !a.hasChangeOwnershipRight()) {
                                _canTakeOwnership = false;
                            }
                        });
                        // If I own all selected, then I can't take ownership of what I already completely own
                        return _canTakeOwnership && !BatchManagementManager.doesOwnAll();
                    });
                    BatchManagementManager.doesOwnAll = ko.pureComputed(function () {
                        if (!BatchManagementManager.snapshot()) {
                            return false;
                        }
                        return !!BatchManagementManager.snapshot().ownersOnAll().filter(function (o) { return o.name === $tokyo.user.email; }).length;
                    });
                    BatchManagementManager.atLeastOneIsOwned = ko.pureComputed(function () {
                        if (!BatchManagementManager.snapshot()) {
                            return false;
                        }
                        return !!BatchManagementManager.snapshot().ownersOnAll().length || !!BatchManagementManager.snapshot().ownersOnSome().length;
                    });
                    BatchManagementManager.allAreVisibleToEveryone = ko.pureComputed(function () {
                        if (!BatchManagementManager.snapshot()) {
                            return false;
                        }
                        return BatchManagementManager.snapshot().visibility() === "All";
                    });
                    BatchManagementManager.isMixedVisibility = ko.pureComputed(function () {
                        if (!BatchManagementManager.snapshot()) {
                            return true;
                        }
                        return BatchManagementManager.snapshot().visibility() === "Mixed";
                    });
                    BatchManagementManager.someAreOwnedByOthersAndNotMe = ko.pureComputed(function () {
                        var _someAreOwnedByOthersAndNotMe = false;
                        (Managers.BrowseManager.multiSelected() || []).forEach(function (a) {
                            if (!a.hasTakeOwnershipRight() && !a.hasChangeOwnershipRight()) {
                                _someAreOwnedByOthersAndNotMe = true;
                            }
                        });
                        return _someAreOwnedByOthersAndNotMe;
                    });
                    return BatchManagementManager;
                })();
                Managers.BatchManagementManager = BatchManagementManager;
            })(Managers = DataCatalog.Managers || (DataCatalog.Managers = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Managers;
            (function (Managers) {
                var BatchSchemaManager = (function () {
                    function BatchSchemaManager() {
                    }
                    BatchSchemaManager.hasChanges = function () {
                        return BatchSchemaManager.getChanges().length > 0;
                    };
                    BatchSchemaManager.init = function () {
                        BatchSchemaManager.tagCreators = {};
                        BatchSchemaManager.takeSnapshot();
                    };
                    BatchSchemaManager.cancel = function () {
                        BatchSchemaManager.init();
                    };
                    BatchSchemaManager.getChanges = function () {
                        // Define observable dependency for tracking
                        BatchSchemaManager.snapshot();
                        var changes = [];
                        BatchSchemaManager.snapshotData.forEach(function (d) {
                            var columnChanges = { columnName: d.name };
                            var bindableSharedColumn = DataCatalog.Core.Utilities.arrayFirst(BatchSchemaManager.snapshot().filter(function (s) { return s.name === d.name; }));
                            var desc = bindableSharedColumn.description();
                            if (desc !== d.description) {
                                columnChanges.description = desc;
                            }
                            // Determine tag deltas
                            var endingTagsOnAll = bindableSharedColumn.tagsOnAll().map(function (t) { return t.name; });
                            var endingTagsOnSome = bindableSharedColumn.tagsOnSome().map(function (t) { return t.name; });
                            var tagsToAdd = DataCatalog.Core.Utilities.arrayExcept(endingTagsOnAll, d.tagsOnAll);
                            var tagsToRemoveFromAll = DataCatalog.Core.Utilities.arrayExcept(d.tagsOnAll, endingTagsOnAll);
                            var tagsToRemoveFromSome = DataCatalog.Core.Utilities.arrayExcept(d.tagsOnSome, endingTagsOnSome);
                            tagsToRemoveFromSome = DataCatalog.Core.Utilities.arrayExcept(tagsToRemoveFromSome, tagsToAdd);
                            var tagsToRemove = tagsToRemoveFromAll.concat(tagsToRemoveFromSome);
                            if (tagsToAdd.length) {
                                columnChanges.tagsToAdd = tagsToAdd;
                            }
                            if (tagsToRemove.length) {
                                columnChanges.tagsToRemove = tagsToRemove;
                            }
                            if (Object.keys(columnChanges).length > 1) {
                                changes.push(columnChanges);
                            }
                        });
                        return changes;
                    };
                    BatchSchemaManager.takeSnapshot = function () {
                        BatchSchemaManager.snapshotData = this.getSnapshot();
                        var bindableSharedColumns = [];
                        var copy = $.extend(true, {}, { data: BatchSchemaManager.snapshotData }).data;
                        copy.forEach(function (s) {
                            var myTagsOnAllLookup = {};
                            s.myTagsOnAll.forEach(function (t) {
                                myTagsOnAllLookup[t] = true;
                            });
                            var myTagsOnSomeLookup = {};
                            s.myTagsOnSome.forEach(function (e) {
                                myTagsOnSomeLookup[e] = true;
                            });
                            var sorter = function (a, b) {
                                var favorMine = function (a, b) {
                                    if (a.readOnly === b.readOnly) {
                                        return 0;
                                    }
                                    if (!a.readOnly) {
                                        return -1;
                                    }
                                    if (!b.readOnly) {
                                        return 1;
                                    }
                                    return 0;
                                };
                                var compareStrings = function (a, b) {
                                    if (a > b) {
                                        return 1;
                                    }
                                    if (a < b) {
                                        return -1;
                                    }
                                    return 0;
                                };
                                // Sort mine first and then alphabetically
                                return favorMine(a, b) || compareStrings(a.name, b.name);
                            };
                            var tagsOnAll = s.tagsOnAll.map(function (t) { return { name: t, readOnly: !myTagsOnAllLookup[t], tooltips: BatchSchemaManager.tagCreators[t.toUpperCase()] || [] }; }).sort(sorter);
                            var tagsOnSome = s.tagsOnSome.map(function (t) { return { name: t, readOnly: !myTagsOnSomeLookup[t], tooltips: BatchSchemaManager.tagCreators[t.toUpperCase()] || [] }; }).sort(sorter);
                            bindableSharedColumns.push({
                                name: s.name,
                                type: s.type,
                                description: ko.observable(s.description),
                                tagsOnAll: ko.observableArray(tagsOnAll),
                                tagsOnSome: ko.observableArray(tagsOnSome)
                            });
                        });
                        BatchSchemaManager.snapshot(bindableSharedColumns);
                    };
                    BatchSchemaManager.getColumnIntersections = function () {
                        var columnIntersections;
                        (Managers.BrowseManager.multiSelected() || []).map(function (a) { return a.schema.columns; }).forEach(function (c) {
                            if (!columnIntersections) {
                                columnIntersections = c;
                            }
                            else {
                                columnIntersections = DataCatalog.Core.Utilities.arrayIntersect(columnIntersections, c, function (first, second) { return first.name === second.name && first.type === second.type; });
                            }
                        });
                        return columnIntersections || [];
                    };
                    BatchSchemaManager.getSnapshot = function () {
                        var snapshotData = [];
                        var columns = this.getColumnIntersections();
                        columns.forEach(function (c) {
                            var descriptions = [];
                            Managers.BrowseManager.multiSelected().forEach(function (a) {
                                var columnDescription = DataCatalog.Core.Utilities.arrayFirst(a.schemaDescription.columnDescriptions.filter(function (cd) { return cd.columnName === c.name; }));
                                descriptions.push(columnDescription);
                            });
                            var descriptionHash = {};
                            var myTagIntersections;
                            var myDistinctTags;
                            var tagIntersection;
                            var tagUnion;
                            descriptions.forEach(function (d) {
                                var trimmedDesc = $.trim(d.description());
                                descriptionHash[DataCatalog.Core.Utilities.plainText(trimmedDesc)] = true;
                                d.tags().forEach(function (t) {
                                    var identifier = t.toUpperCase();
                                    BatchSchemaManager.tagCreators[identifier] = BatchSchemaManager.tagCreators[identifier] || [];
                                    (d.tagCreators[identifier] || []).forEach(function (tp) {
                                        if (!BatchSchemaManager.tagCreators[identifier].some(function (a) { return a.email === tp.email; })) {
                                            BatchSchemaManager.tagCreators[identifier].push(tp);
                                        }
                                    });
                                });
                                // My tags
                                if (!myTagIntersections) {
                                    myTagIntersections = d.tags();
                                }
                                else {
                                    myTagIntersections = DataCatalog.Core.Utilities.arrayIntersect(myTagIntersections, d.tags());
                                }
                                if (!myDistinctTags) {
                                    myDistinctTags = DataCatalog.Core.Utilities.arrayDistinct(d.tags());
                                }
                                else {
                                    myDistinctTags = DataCatalog.Core.Utilities.arrayDistinct(myDistinctTags.concat(d.tags()));
                                }
                                // All tags
                                var allTags = d.tags();
                                d.otherInfo.forEach(function (oi) {
                                    allTags = allTags.concat(oi.tags);
                                });
                                if (!tagIntersection) {
                                    tagIntersection = allTags;
                                }
                                else {
                                    tagIntersection = DataCatalog.Core.Utilities.arrayIntersect(tagIntersection, allTags);
                                }
                                if (!tagUnion) {
                                    tagUnion = DataCatalog.Core.Utilities.arrayDistinct(allTags);
                                }
                                else {
                                    tagUnion = DataCatalog.Core.Utilities.arrayDistinct(tagUnion.concat(allTags));
                                }
                            });
                            var commonDescription = Object.keys(descriptionHash).length === 1
                                ? Object.keys(descriptionHash)[0]
                                : "";
                            var myTagsOnAll = DataCatalog.Core.Utilities.arrayDistinct((myTagIntersections || []).map($.trim));
                            var myTagsOnSome = DataCatalog.Core.Utilities.arrayDistinct(DataCatalog.Core.Utilities.arrayExcept((myDistinctTags || []).map($.trim), myTagsOnAll));
                            var tagsOnAll = DataCatalog.Core.Utilities.arrayDistinct((tagIntersection || []).map($.trim));
                            var tagsOnSome = DataCatalog.Core.Utilities.arrayDistinct(DataCatalog.Core.Utilities.arrayExcept((tagUnion || []).map($.trim), tagsOnAll));
                            var snapshotDatum = {
                                name: c.name,
                                type: c.type,
                                description: commonDescription,
                                myTagsOnAll: myTagsOnAll,
                                myTagsOnSome: myTagsOnSome,
                                tagsOnAll: tagsOnAll,
                                tagsOnSome: tagsOnSome
                            };
                            snapshotData.push(snapshotDatum);
                        });
                        return snapshotData;
                    };
                    BatchSchemaManager.snapshotData = [];
                    BatchSchemaManager.snapshot = ko.observableArray();
                    return BatchSchemaManager;
                })();
                Managers.BatchSchemaManager = BatchSchemaManager;
            })(Managers = DataCatalog.Managers || (DataCatalog.Managers = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var FilterCollection = (function () {
                    function FilterCollection(facetResponse) {
                        var _this = this;
                        this.groups = [];
                        $.each(facetResponse || [], function (i, group) {
                            var filterGroup = new FilterGroup(group);
                            if (filterGroup.items.length) {
                                _this.groups.push(filterGroup);
                            }
                        });
                    }
                    FilterCollection.prototype.createItem = function (groupType, term, count) {
                        if (count === void 0) { count = 0; }
                        return new FilterItem({ term: term, count: count }, groupType);
                    };
                    FilterCollection.prototype.findItem = function (groupType, term) {
                        var item = null;
                        var group = this.findGroup(groupType);
                        if (group) {
                            item = group.findItem(term);
                        }
                        return item;
                    };
                    FilterCollection.prototype.findGroup = function (groupType) {
                        var match;
                        if (groupType) {
                            $.each(this.groups, function (i, group) {
                                if (group.groupType === groupType) {
                                    match = group;
                                    return false;
                                }
                            });
                        }
                        return match;
                    };
                    FilterCollection.prototype.replaceGroup = function (group) {
                        if (group) {
                            var groupType = group.groupType;
                            var indexOfGroup = -1;
                            for (var i = 0; i < this.groups.length; i++) {
                                if (this.groups[i].groupType === groupType) {
                                    indexOfGroup = i;
                                    break;
                                }
                            }
                            if (indexOfGroup >= 0) {
                                this.groups[indexOfGroup] = group;
                            }
                        }
                    };
                    FilterCollection.prototype.totalItems = function () {
                        var total = 0;
                        $.each(this.groups, function (i, group) {
                            total += (group.items || []).length;
                        });
                        return total;
                    };
                    return FilterCollection;
                })();
                Models.FilterCollection = FilterCollection;
                var FilterGroup = (function () {
                    function FilterGroup(group) {
                        var _this = this;
                        this.items = [];
                        this.groupType = group.displayLabel;
                        this.label = DataCatalog.Core.Resx[group.displayLabel];
                        $.each(group.terms || [], function (i, termObj) {
                            _this.items.push(new FilterItem(termObj, group.displayLabel));
                        });
                    }
                    FilterGroup.prototype.findItem = function (term) {
                        var match;
                        $.each(this.items, function (i, item) {
                            if (item.term === term) {
                                match = item;
                                return false;
                            }
                        });
                        return match;
                    };
                    return FilterGroup;
                })();
                Models.FilterGroup = FilterGroup;
                var FilterItem = (function () {
                    function FilterItem(termObj, groupType) {
                        this.groupType = groupType;
                        this.term = termObj.term;
                        this.count = termObj.count;
                    }
                    return FilterItem;
                })();
                Models.FilterItem = FilterItem;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../models/FilterCollection.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Managers;
            (function (Managers) {
                var logger = DataCatalog.LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC managers" });
                var BrowseManager = (function () {
                    function BrowseManager() {
                    }
                    BrowseManager.doSearch = function (options) {
                        var _this = this;
                        this._searchCounter++;
                        var myCapturedCounter = this._searchCounter;
                        options = options || {};
                        options.resetPage && (this.currentPage = 1);
                        options.resetFilters && (this.selectedFilters([]));
                        options.resetSearchText && (this.searchText(""));
                        options.maxFacetTerms = options.maxFacetTerms || 10;
                        options.resetStart && (options.maxFacetTerms = 100);
                        if (options.resetStart) {
                            this.firstRun = true;
                            this.searchResult(null);
                            Managers.LayoutManager.centerComponent("datacatalog-browse-start");
                        }
                        if (!options.disableQueryStringUpdate) {
                            this.updateQueryStringSearchTerms(this.searchText());
                        }
                        var selectedIds = [];
                        if (!options.resetSelected && this.multiSelected()) {
                            selectedIds = this.multiSelected().map(function (s) { return s.__id; });
                        }
                        var groupToPreserve = this.filterTypes().findGroup(options.preserveGroup);
                        var containerId = null;
                        if (this.container()) {
                            containerId = this.container().__id;
                        }
                        this.isSearching(true);
                        var searchOptions = {
                            searchTerms: this.searchText(),
                            facetFilters: this.selectedFilters(),
                            startPage: this.currentPage,
                            pageSize: this.pageSize(),
                            sortKey: this.sortField().value,
                            containerId: containerId,
                            maxFacetTerms: options.maxFacetTerms,
                            captureSearchTerm: options.captureSearchTerm
                        };
                        var startTime = new Date().getTime();
                        logger.logInfo(DataCatalog.Core.Utilities.stringFormat("executing search request (counter={0})", myCapturedCounter), $.extend({ startTime: startTime }, searchOptions));
                        var promise = DataCatalog.Services.SearchService.search(searchOptions);
                        promise.then(function (result) {
                            var endTime = new Date().getTime();
                            logger.logInfo(DataCatalog.Core.Utilities.stringFormat("receiving search response (counter={0} totalTime={1}sec)", myCapturedCounter, (endTime - startTime) / 1000), $.extend({ startTime: startTime, endTime: endTime }, searchOptions));
                            // If the search counter that was used is the same as when the search was executed - go ahead and bind the results.
                            // However, if the counter doesn't match there is no need to bind the results as a new result response will be returned shortly.
                            if (_this._searchCounter !== myCapturedCounter) {
                                logger.logInfo(DataCatalog.Core.Utilities.stringFormat("not applying search results because a newer search request has taken place (counter={0}, currentCounter={1})", myCapturedCounter, _this._searchCounter), searchOptions);
                                return;
                            }
                            _this.previousSearchText(BrowseManager.searchText());
                            result = $.extend({}, result);
                            var incomingFilterCollection = new DataCatalog.Models.FilterCollection(result.facets);
                            // If we currently have selected items that appear in the filter collection
                            // let's add them in so the user can see the accurate query.
                            incomingFilterCollection.replaceGroup(groupToPreserve);
                            var selectedFilters = _this.selectedFilters();
                            _this.selectedFilters([]);
                            $.each(selectedFilters, function (i, filterItem) {
                                var item = incomingFilterCollection.findItem(filterItem.groupType, filterItem.term);
                                if (item) {
                                    _this.selectedFilters.push(item);
                                }
                                else {
                                    _this.selectedFilters.push(incomingFilterCollection.createItem(filterItem.groupType, filterItem.term));
                                }
                            });
                            _this.filterTypes(incomingFilterCollection);
                            _this.highlightHits(result.results);
                            var bindableResult = new DataCatalog.Models.BindableResult(result);
                            if (!options.resetStart) {
                                _this.firstRun = false;
                                if (Managers.LayoutManager.centerComponent() === "datacatalog-browse-start") {
                                    Managers.LayoutManager.centerComponent(_this.centerComponent());
                                }
                            }
                            _this.searchResult(bindableResult);
                            if (!options.preventSelectedFromUpdating) {
                                _this.multiSelected(bindableResult.results.filter(function (e) { return selectedIds.some(function (s) { return s === e.__id; }); }));
                            }
                            !_this.multiSelected().length && Managers.LayoutManager.rightExpanded(false);
                        })
                            .always(function () {
                            if (_this._searchCounter === myCapturedCounter) {
                                _this.isSearching(false);
                            }
                        });
                        return promise;
                    };
                    BrowseManager.applySavedSearch = function (savedSearch) {
                        var _this = this;
                        logger.logInfo("applying saved search", savedSearch);
                        this.appliedSearch(savedSearch);
                        var _applySavedSearch = function () {
                            _this.searchText(savedSearch.searchTerms);
                            var sortField = DataCatalog.Core.Utilities.arrayFirst(_this.sortFields().filter(function (sf) { return sf.value === savedSearch.sortKey; }));
                            if (sortField) {
                                _this.sortField(sortField);
                            }
                            else {
                                _this.sortField(BrowseManager.sortFields()[0]);
                            }
                            var selectedFilters = [];
                            (savedSearch.facetFilters || []).forEach(function (f) {
                                var filterItem = _this.filterTypes().findItem(f.groupType, f.term);
                                if (filterItem) {
                                    selectedFilters.push(filterItem);
                                }
                                else {
                                    var newItem = _this.filterTypes().createItem(f.groupType, f.term);
                                    selectedFilters.push(newItem);
                                }
                            });
                            _this.selectedFilters(selectedFilters);
                        };
                        if (savedSearch.containerId) {
                            return this.exploreContainer({ containerId: savedSearch.containerId }, _applySavedSearch, {
                                resetPage: true,
                                disableQueryStringUpdate: true,
                                preserveSelected: true,
                                preventSelectedFromUpdating: true,
                                captureSearchTerm: false
                            });
                        }
                        else {
                            _applySavedSearch();
                            this.container(null);
                            return this.doSearch({ resetPage: true, captureSearchTerm: false });
                        }
                    };
                    BrowseManager.highlightHits = function (results) {
                        var excludedProps = {
                            statusExpression: true,
                            trendExpression: true,
                            documentation: true
                        };
                        var sanitize = function (obj) {
                            $.each(obj, function (key, value) {
                                if (excludedProps[key]) {
                                    return;
                                }
                                if (typeof value === "string") {
                                    // Sanitize html in string
                                    if (value.indexOf("<") >= 0) {
                                        obj[key] = DataCatalog.Core.Utilities.escapeHtml(value);
                                    }
                                }
                                if ($.isPlainObject(value)) {
                                    sanitize(value);
                                }
                                if ($.isArray(value)) {
                                    sanitize(value);
                                }
                            });
                        };
                        var applyHighlighting = function () {
                            results.forEach(function (result) {
                                // Filter out matches on excluded properties
                                var hitProperties = (result.hitProperties || []).filter(function (hp) { return !excludedProps[DataCatalog.Core.Utilities.arrayFirst((hp.fieldPath || "").split("."))]; });
                                // Filter out matches on system properties
                                hitProperties = hitProperties.filter(function (hp) { return !/__/.test(hp.fieldPath); });
                                // Filter out matches on containerId
                                hitProperties = hitProperties.filter(function (hp) { return !/^containerId$/.test(hp.fieldPath); });
                                $.each(hitProperties, function (i, hitProperty) {
                                    var prev = [];
                                    var current = [result.content];
                                    var lastPart = "";
                                    (hitProperty.fieldPath || "").split(".").forEach(function (part) {
                                        prev = current;
                                        var newCurrent = [];
                                        current.forEach(function (c) {
                                            c[part] && (newCurrent = newCurrent.concat(c[part]));
                                        });
                                        current = newCurrent;
                                        lastPart = part;
                                    });
                                    var wrapWord = function (str, word) {
                                        var wrappedWord = DataCatalog.Core.Constants.Highlighting.OPEN_TAG + word + DataCatalog.Core.Constants.Highlighting.CLOSE_TAG;
                                        var regExpForAlreadyWrapped = DataCatalog.Core.Utilities.regexEscape(wrappedWord);
                                        return new RegExp(regExpForAlreadyWrapped, "g").test(str)
                                            ? str
                                            : str.replace(new RegExp(word, "g"), wrappedWord);
                                    };
                                    if (current.length) {
                                        prev.forEach(function (p) {
                                            if (typeof p[lastPart] === "string") {
                                                hitProperty.highlightDetail.forEach(function (hd) {
                                                    hd.highlightedWords.forEach(function (hw) {
                                                        p[lastPart] = wrapWord(p[lastPart], hw.word);
                                                    });
                                                });
                                            }
                                            if ($.isArray(p[lastPart]) && p[lastPart].length && typeof p[lastPart][0] === "string") {
                                                for (var a = 0; a < p[lastPart].length; a++) {
                                                    hitProperty.highlightDetail.forEach(function (hd) {
                                                        hd.highlightedWords.forEach(function (hw) {
                                                            p[lastPart][a] = wrapWord(p[lastPart][a], hw.word);
                                                        });
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            });
                        };
                        // We always need to sanitize
                        sanitize(results);
                        // But we will only apply highlights if enabled
                        try {
                            BrowseManager.showHighlight() && applyHighlighting();
                            BrowseManager.getRelevanceInfo(results);
                        }
                        catch (e) {
                            logger.logError("error applying highlighting", e);
                        }
                    };
                    BrowseManager.getRelevanceInfo = function (results) {
                        var tableProperties = ["name", "descriptions", "dsl", "lastRegisteredBy", "experts"];
                        var columnProperties = ["schemas"];
                        // We don't want to count matches on columnName twice
                        var negativeColumnProperties = ["schemas.schemaDescriptions.columnDescriptions.columnName"];
                        results.forEach(function (result) {
                            var tablePropertyCount = 0;
                            var columnPropertyCount = 0;
                            (result.hitProperties || []).forEach(function (hp) {
                                var fieldPath = hp.fieldPath || "";
                                var endsWithNa = /_na$/.test(fieldPath);
                                var hasFUnderscore = /\.f_/.test(fieldPath);
                                var ignoreHitProperty = endsWithNa || hasFUnderscore;
                                if (!ignoreHitProperty) {
                                    tableProperties.forEach(function (tp) {
                                        if (fieldPath.indexOf(tp) === 0) {
                                            tablePropertyCount++;
                                        }
                                    });
                                    columnProperties.forEach(function (tp) {
                                        if (fieldPath.indexOf(tp) === 0) {
                                            columnPropertyCount++;
                                        }
                                    });
                                    negativeColumnProperties.forEach(function (tp) {
                                        if (fieldPath.indexOf(tp) === 0) {
                                            columnPropertyCount--;
                                        }
                                    });
                                }
                            });
                            // Only set the property if there are search matches
                            if (tablePropertyCount || columnPropertyCount) {
                                result.searchRelevanceInfo = { tablePropertyCount: tablePropertyCount, columnPropertyCount: columnPropertyCount };
                            }
                        });
                    };
                    // Add the search term to the URL for shareability
                    BrowseManager.updateQueryStringSearchTerms = function (searchTerms) {
                        var isTestEnv = document && document.origin && document.origin === "null";
                        if (isTestEnv) {
                            return;
                        }
                        // Update searchTerms on URL
                        var newUrl = window.document.URL.replace(/searchTerms=[^&]*/, "") // Remove pre-existing search terms
                            .replace(/\?&/, "?") // Remove an ampersand following a question mark
                            .replace(/[?&]$/, ""); // Remove any trailing ampersand or question mark  
                        var separator = newUrl.indexOf("?") !== -1 ? "&" : "?";
                        newUrl += (separator + "searchTerms=" + encodeURIComponent(searchTerms));
                        if (history && history.pushState) {
                            var hashPart = newUrl.replace(/[^#]+/, "");
                            history.pushState({}, $("title").text(), hashPart);
                        }
                        else {
                            window.location = newUrl;
                        }
                        // Try to assign focus back to the search input
                        setTimeout(function () { $(".search-box input").focus(); }, 100);
                    };
                    // If searchTerms is defined on the URL, set the state appropriately
                    BrowseManager.initialize = function () {
                        var _this = this;
                        // Setup search state
                        if (location.hash.indexOf("searchTerms=") !== -1) {
                            var searchTerm = location.hash.replace(/.*searchTerms=([^&]*)/, "$1");
                            searchTerm = decodeURIComponent(searchTerm);
                            this.searchText(searchTerm);
                        }
                        // Bind delete key press
                        $(window).keyup(function (event) {
                            var focusedElement = $(document.activeElement);
                            if (!focusedElement.is("input") && !focusedElement.is("textarea") && !Managers.LayoutManager.isMasked() && event.which === DataCatalog.Core.Constants.KeyCodes.DELETE) {
                                _this.deleteSelected();
                            }
                        });
                        BrowseManager.showHighlight.subscribe(function () {
                            if (DataCatalog.Services.SearchService.research) {
                                DataCatalog.Services.SearchService.research()
                                    .done(function (result) {
                                    _this.highlightHits(result.results);
                                    var bindableResult = new DataCatalog.Models.BindableResult(result);
                                    _this.searchResult(bindableResult);
                                    var selectedIds = _this.multiSelected().map(function (s) { return s.__id; });
                                    _this.multiSelected(bindableResult.results.filter(function (e) { return selectedIds.some(function (s) { return s === e.__id; }); }));
                                });
                            }
                        });
                    };
                    BrowseManager.deleteSelected = function () {
                        var deletableAssets = this.multiSelected().filter(function (a) { return a.hasDeleteRight(); });
                        if (deletableAssets.length) {
                            var doneCount = 0;
                            var confirmText = deletableAssets.length === 1
                                ? DataCatalog.Core.Utilities.stringFormat(DataCatalog.Core.Resx.confirmSingleDelete, DataCatalog.Core.Utilities.plainText(deletableAssets[0].displayName()))
                                : DataCatalog.Core.Utilities.stringFormat(DataCatalog.Core.Resx.confirmMultipleDelete, deletableAssets.length);
                            // Define the modal buttons
                            var modalBtns = [
                                {
                                    label: DataCatalog.Core.Resx.ok,
                                    isPrimary: false,
                                    action: function (actions) {
                                        var ids = deletableAssets.map(function (s) { return s.__id; });
                                        DataCatalog.Services.CatalogService.deleteAssets(ids)
                                            .progress(function () {
                                            doneCount++;
                                        })
                                            .done(function (failedIds) {
                                            failedIds = failedIds || [];
                                            Managers.LayoutManager.rightExpanded(false);
                                            BrowseManager.multiSelected().filter(function (s) { return !failedIds.some(function (f) { return f === s.__id; }); }).forEach(function (a) {
                                                BrowseManager.deletedItems.push(a.__id + a.lastRegisteredTime);
                                            });
                                            BrowseManager.multiSelected([]);
                                        })
                                            .always(function () {
                                            actions.remove();
                                        });
                                    }
                                },
                                {
                                    label: DataCatalog.Core.Resx.cancel,
                                    isPrimary: true,
                                    action: function (actions) {
                                        actions.remove();
                                    }
                                }
                            ];
                            // Create the modal parameters
                            var modalParams = {
                                header: DataCatalog.Core.Utilities.stringCapitalize(DataCatalog.Core.Resx.confirmDeleteTitle),
                                message: confirmText,
                                buttons: modalBtns
                            };
                            // Create and display the modal
                            Microsoft.DataStudioUX.Managers.ModalManager.show(modalParams);
                        }
                    };
                    BrowseManager.isAssetDeleted = function (dataEntity) {
                        return BrowseManager.deletedItems().some(function (d) { return d === dataEntity.__id + dataEntity.lastRegisteredTime; });
                    };
                    BrowseManager.rebindView = function () {
                        this.selected.notifySubscribers(this.selected());
                    };
                    BrowseManager.exploreContainer = function (dataEntity, onBeforeAnimate, searchOptions) {
                        var _this = this;
                        var deferred = $.Deferred();
                        var enterContainerMode = function (container) {
                            _this.returnFromContainerQuery = DataCatalog.Services.SearchService.research;
                            _this.returnFromContainerFilters = $.extend(true, {}, _this.filterTypes());
                            _this.returnFromContainerSelectedFilters = $.extend(true, [], _this.selectedFilters());
                            _this.returnFromContainerSelectedIds = _this.multiSelected().map(function (a) { return a.__id; });
                            _this.returnFromContainerSearchText = _this.searchText();
                            var slideEffect = _this.firstRun ? function (fn) { fn(); } : Managers.LayoutManager.slideCenterToTheLeft.bind(Managers.LayoutManager);
                            slideEffect(function () {
                                searchOptions = searchOptions || {
                                    resetPage: true,
                                    resetFilters: true,
                                    resetSearchText: true,
                                    disableQueryStringUpdate: true,
                                    preserveSelected: true,
                                    preventSelectedFromUpdating: true
                                };
                                _this.searchResult().totalResults = 1;
                                _this.searchResult().results = [];
                                _this.searchResult.notifySubscribers();
                                _this.multiSelected([container]);
                                _this.container(container);
                                if ($.isFunction(onBeforeAnimate)) {
                                    onBeforeAnimate();
                                }
                                _this.doSearch(searchOptions)
                                    .done(deferred.resolve)
                                    .fail(deferred.reject);
                            });
                        };
                        if (dataEntity.DataSourceType === DataCatalog.Models.DataSourceType.Container) {
                            enterContainerMode(dataEntity);
                        }
                        else if (!!dataEntity.containerId) {
                            var onFailedToGetContainer = function () {
                                DataCatalog.Services.ModalService.show({
                                    title: DataCatalog.Core.Utilities.stringFormat(DataCatalog.Core.Resx.cannotFindContainerTitleFormat, dataEntity.getContainerName()),
                                    bodyText: DataCatalog.Core.Utilities.stringFormat(DataCatalog.Core.Resx.cannotFindContainerBodyFormat, dataEntity.getContainerName()),
                                    hideCancelButton: true
                                })
                                    .done(function (modal) { return modal.close(); });
                            };
                            DataCatalog.Services.SearchService.search({
                                searchFilters: [("__id=" + dataEntity.containerId)],
                                capture: false
                            })
                                .done(function (result) {
                                if (result.totalResults === 1) {
                                    var bindableResult = new DataCatalog.Models.BindableResult(result);
                                    enterContainerMode(bindableResult.results[0]);
                                }
                                else {
                                    onFailedToGetContainer();
                                }
                            })
                                .fail(onFailedToGetContainer);
                        }
                        return deferred.promise();
                    };
                    BrowseManager.returnFromContainer = function () {
                        var _this = this;
                        var returnToDefaultState = this.appliedSearch() && this.appliedSearch().containerId;
                        if (this.returnFromContainerQuery || returnToDefaultState) {
                            Managers.LayoutManager.slideCenterToTheRight(function () {
                                _this.container(null);
                                _this.searchResult().totalResults = 1;
                                _this.searchResult().results = [];
                                _this.searchResult.notifySubscribers();
                                _this.isSearching(true);
                                var backToCatalogAction = returnToDefaultState
                                    ? function () {
                                        _this.appliedSearch(null);
                                        return _this.doSearch({ resetFilters: true, resetSearchText: true, resetPage: true });
                                    }
                                    : _this.returnFromContainerQuery;
                                backToCatalogAction()
                                    .done(function (result) {
                                    _this.isSearching(false);
                                    DataCatalog.Services.SearchService.research = _this.returnFromContainerQuery;
                                    _this.highlightHits(result.results);
                                    var bindableResult = new DataCatalog.Models.BindableResult(result);
                                    var selectedIds = _this.returnFromContainerSelectedIds || [];
                                    // Set page state
                                    if (!returnToDefaultState) {
                                        _this.searchResult(bindableResult);
                                        _this.multiSelected(bindableResult.results.filter(function (e) { return selectedIds.some(function (s) { return s === e.__id; }); }));
                                        _this.filterTypes(_this.returnFromContainerFilters);
                                        _this.selectedFilters(_this.returnFromContainerSelectedFilters);
                                        _this.searchText(_this.returnFromContainerSearchText);
                                        _this.previousSearchText(_this.returnFromContainerSearchText);
                                    }
                                    // Allow GC
                                    _this.returnFromContainerQuery = null;
                                    _this.returnFromContainerFilters = null;
                                    _this.returnFromContainerSelectedFilters = null;
                                    _this.returnFromContainerSelectedIds = null;
                                    _this.returnFromContainerSearchText = null;
                                });
                            });
                        }
                    };
                    BrowseManager.updatePinned = function (id, pinned) {
                        var asset = this.searchResult().batchedResults().filter(function (r) { return r.__id === id; });
                        if (asset.length) {
                            asset[0].pinned(pinned);
                        }
                    };
                    BrowseManager.appliedSearch = ko.observable();
                    BrowseManager.previousSearchText = ko.observable(null);
                    BrowseManager.searchText = ko.observable("");
                    BrowseManager.currentPage = 1;
                    BrowseManager.pageSize = ko.observable(10);
                    BrowseManager.centerComponent = ko.observable("datacatalog-browse-tiles");
                    BrowseManager.searchResult = ko.observable();
                    BrowseManager.firstRun = true;
                    ////http://www.opensearch.org/Community/Proposal/Specifications/OpenSearch/Extensions/SRU/1.0/Draft_1#The_.22sortKeys.22_parameter
                    BrowseManager.sortFields = ko.observableArray([
                        {
                            key: DataCatalog.Core.Resx.relevance,
                            value: null
                        },
                        {
                            key: DataCatalog.Core.Resx.lastRegistered,
                            value: "modifiedTime,,0"
                        },
                        {
                            key: DataCatalog.Core.Resx.name,
                            value: "name,,1"
                        }
                    ]);
                    BrowseManager.sortField = ko.observable(BrowseManager.sortFields()[0]);
                    BrowseManager.filterTypes = ko.observable(new DataCatalog.Models.FilterCollection());
                    BrowseManager.selectedFilters = ko.observableArray();
                    BrowseManager.showHighlight = ko.observable(true);
                    BrowseManager.multiSelected = ko.observableArray([]);
                    BrowseManager.selected = ko.computed(function () {
                        return BrowseManager.multiSelected().length === 1
                            ? DataCatalog.Core.Utilities.arrayFirst(BrowseManager.multiSelected())
                            : null;
                    });
                    BrowseManager.isSearching = ko.observable(false);
                    BrowseManager._searchCounter = 0;
                    BrowseManager.deletedItems = ko.observableArray([]);
                    BrowseManager.container = ko.observable();
                    return BrowseManager;
                })();
                Managers.BrowseManager = BrowseManager;
            })(Managers = DataCatalog.Managers || (DataCatalog.Managers = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
Microsoft.DataStudio.DataCatalog.Managers.BrowseManager.initialize();
// <reference path="../../../References.d.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Managers;
            (function (Managers) {
                var DetailsManager = (function () {
                    function DetailsManager() {
                    }
                    DetailsManager.showSchema = function () {
                        this.activeComponent("datacatalog-browse-schema");
                    };
                    DetailsManager.showEditSchema = function () {
                        this.activeComponent("datacatalog-browse-editschema");
                    };
                    DetailsManager.showPreview = function () {
                        this.activeComponent("datacatalog-browse-preview");
                    };
                    DetailsManager.showDocs = function () {
                        this.activeComponent("datacatalog-browse-documentation");
                    };
                    DetailsManager.showDataProfile = function () {
                        this.activeComponent("datacatalog-browse-dataprofile");
                    };
                    DetailsManager.activeComponent = ko.observable();
                    DetailsManager.isShowingSchema = ko.pureComputed(function () {
                        return DetailsManager.activeComponent() === "datacatalog-browse-schema" || DetailsManager.activeComponent() === "datacatalog-browse-editschema";
                    });
                    DetailsManager.isShowingPreview = ko.pureComputed(function () {
                        return DetailsManager.activeComponent() === "datacatalog-browse-preview";
                    });
                    DetailsManager.isShowingDocs = ko.pureComputed(function () {
                        return DetailsManager.activeComponent() === "datacatalog-browse-documentation";
                    });
                    DetailsManager.isShowingDataProfile = ko.pureComputed(function () {
                        return DetailsManager.activeComponent() === "datacatalog-browse-dataprofile";
                    });
                    DetailsManager.isEmpty = ko.pureComputed(function () {
                        return !DetailsManager.activeComponent();
                    });
                    return DetailsManager;
                })();
                Managers.DetailsManager = DetailsManager;
            })(Managers = DataCatalog.Managers || (DataCatalog.Managers = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Managers;
            (function (Managers) {
                var HomeManager = (function () {
                    function HomeManager() {
                    }
                    HomeManager.isSearching = ko.observable(false);
                    HomeManager.myAssetsLabel = ko.observable("");
                    HomeManager.statsLabel = ko.observable("");
                    return HomeManager;
                })();
                Managers.HomeManager = HomeManager;
            })(Managers = DataCatalog.Managers || (DataCatalog.Managers = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Managers;
            (function (Managers) {
                var LayoutManager = (function () {
                    function LayoutManager() {
                    }
                    LayoutManager.init = function () {
                        var self = this;
                        LayoutManager.leftTitle = ko.observable();
                        LayoutManager.leftComponent = ko.observable();
                        LayoutManager.leftExpanded = ko.observable();
                        LayoutManager.leftWidth = ko.observable();
                        LayoutManager.leftDuration = ko.observable();
                        LayoutManager.centerComponent = ko.observable();
                        LayoutManager.rightTitle = ko.observable();
                        LayoutManager.rightComponent = ko.observable();
                        LayoutManager.rightExpanded = ko.observable();
                        LayoutManager.rightWidth = ko.observable();
                        LayoutManager.rightDuration = ko.observable();
                        LayoutManager.bottomTitle = ko.observable();
                        LayoutManager.bottomComponent = ko.observable();
                        LayoutManager.bottomExpanded = ko.observable();
                        LayoutManager.bottomHeight = ko.observable();
                        LayoutManager.bottomDuration = ko.observable();
                        LayoutManager.showLeft = ko.observable();
                        LayoutManager.showRight = ko.observable();
                        LayoutManager.showCenter = ko.observable();
                        LayoutManager.showBottom = ko.observable();
                        LayoutManager.leftFocus = ko.observable("left-container");
                        LayoutManager.rightFocus = ko.observable("right-container");
                        LayoutManager.centerFocus = ko.observable("center-container");
                        LayoutManager.bottomFocus = ko.observable("bottom-container");
                        LayoutManager.unmask();
                    };
                    LayoutManager.getCenterPanelContent = function () {
                        return $(".center-panel-content");
                    };
                    LayoutManager.unmask = function () {
                        if (this.isMasked()) {
                            $(".layout-container .masked-pane").removeClass("masked-pane");
                            $(".layout-container .layout-backdrop").removeClass("mask");
                            setTimeout(function () {
                                $(".layout-container .layout-backdrop").removeClass("top");
                            }, 150);
                            this.isMasked(false);
                        }
                    };
                    LayoutManager.maskRight = function () {
                        $(".right-panel").addClass("masked-pane");
                        $(".layout-container .layout-backdrop").addClass("mask top");
                        this.isMasked(true);
                    };
                    LayoutManager.maskBottom = function () {
                        $(".bottom-panel").addClass("masked-pane");
                        $(".layout-container .layout-backdrop").addClass("mask top");
                        this.isMasked(true);
                    };
                    LayoutManager.slideCenterToTheLeft = function (onBeforeAnimate) {
                        this._slideCenter(function (a, b) { return a - b; }, function (a, b) { return a + b; }, onBeforeAnimate);
                    };
                    LayoutManager.slideCenterToTheRight = function (onBeforeAnimate) {
                        this._slideCenter(function (a, b) { return a + b; }, function (a, b) { return a - b; }, onBeforeAnimate);
                    };
                    LayoutManager.adjustAsset = function () {
                        if (LayoutManager.adjustmentTimer) {
                            clearTimeout(LayoutManager.adjustmentTimer);
                        }
                        LayoutManager.adjustmentTimer = setTimeout(LayoutManager.adjustScrollIfNecessary, 100);
                    };
                    LayoutManager._slideCenter = function (leftOperation, rightOperation, onBeforeAnimate) {
                        onBeforeAnimate = onBeforeAnimate || (function () { });
                        var duration = 500;
                        var centerContainer = $(".center-panel-container");
                        // Add clone
                        var centerClone = centerContainer.clone();
                        centerClone.addClass("clone");
                        var parent = $(".center-panel-content");
                        parent.append(centerClone);
                        // Reposition real container
                        parent.css("overflow", "hidden");
                        var width = centerContainer.width() + 15;
                        var originalLeft = parseInt(centerContainer.css("left"), 10);
                        var originalRight = parseInt(centerContainer.css("right"), 10);
                        centerContainer.css("left", rightOperation(originalLeft, width));
                        centerContainer.css("right", leftOperation(originalRight, width));
                        onBeforeAnimate();
                        // Animate slide
                        centerClone.animate({
                            left: leftOperation(originalLeft, width),
                            right: rightOperation(originalRight, width)
                        }, duration, function () {
                            centerClone.remove();
                        });
                        centerContainer.animate({
                            left: originalLeft,
                            right: originalRight
                        }, duration, function () {
                            centerContainer.css("left", "");
                            centerContainer.css("right", "");
                            parent.css("overflow", "");
                        });
                    };
                    LayoutManager.adjustScrollIfNecessary = function () {
                        clearTimeout(LayoutManager.adjustmentTimer);
                        var selected = $(".center-panel .selected");
                        if (selected.length === 1) {
                            var asset = selected[0];
                            var container = $(".center-panel-content")[0];
                            var cur = $(container).scrollTop();
                            var offset = $(container).offset().top + $(".heading").height(); // Adjust for positioning on the page and the browse heading.
                            var diff = $(asset).offset().top - offset;
                            $(container).animate({ scrollTop: (diff + cur) }, 250);
                        }
                    };
                    LayoutManager.isMasked = ko.observable(false);
                    return LayoutManager;
                })();
                Managers.LayoutManager = LayoutManager;
            })(Managers = DataCatalog.Managers || (DataCatalog.Managers = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
Microsoft.DataStudio.DataCatalog.Managers.LayoutManager.init();
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindableColumn = (function () {
                    function BindableColumn(experts, columnDesc) {
                        var _this = this;
                        this.tags = ko.observableArray([]);
                        this.description = ko.observable();
                        this.otherInfo = [];
                        this.tagAttributes = ko.observableArray([]);
                        //#region indicator observables
                        this.isSettingTags = ko.observable(false);
                        this.successUpdatingTags = ko.observable(false);
                        this.isChangingDesc = ko.observable(false);
                        this.isSettingDesc = ko.observable(false);
                        this.successUpdatingDesc = ko.observable(false);
                        this.otherDescriptions = ko.pureComputed(function () {
                            var others = _this.getOtherDescriptions(function (desc) { return !!$.trim(desc.description); });
                            return others.slice(0, _this.descExpanded()
                                ? others.length
                                : Math.min(1, others.length));
                        });
                        this.expandText = ko.pureComputed(function () {
                            var others = _this.getOtherDescriptions(function (desc) { return !!$.trim(desc.description); });
                            return _this.descExpanded() ? DataCatalog.Core.Utilities.stringFormat("- {0}", DataCatalog.Core.Resx.seeLess) : DataCatalog.Core.Utilities.stringFormat("+ {0} ({1})", DataCatalog.Core.Resx.seeMore, others.length - 1);
                        });
                        this.expandable = ko.pureComputed(function () {
                            return _this.getOtherDescriptions(function (desc) { return !!$.trim(desc.description); }).length > 1;
                        });
                        this.tagCreators = {};
                        this.experts = experts;
                        this.columnName = columnDesc.columnName;
                        this.tags(columnDesc.tags || []);
                        this.description(columnDesc.description);
                        var safe = DataCatalog.Core.Utilities.removeScriptTags(this.description());
                        var stripped = DataCatalog.Core.Utilities.removeHtmlTags(safe);
                        this.plainDescription = ko.observable(stripped);
                        this.otherInfo = [];
                        this.descExpanded = ko.observable(false);
                        this.setTagAttributes();
                        var subscription = this.tags.subscribe(function () {
                            _this.setTagAttributes();
                        });
                        var descSubscription = this.description.subscribe(function (newDesc) {
                            var safe = DataCatalog.Core.Utilities.removeScriptTags(newDesc);
                            var stripped = DataCatalog.Core.Utilities.removeHtmlTags(safe);
                            _this.plainDescription(stripped);
                        });
                        var plainSubscription = this.plainDescription.subscribe(function (newDesc) {
                            _this.description(newDesc);
                        });
                        this.dispose = function () {
                            subscription.dispose();
                            descSubscription.dispose();
                            plainSubscription.dispose();
                        };
                    }
                    BindableColumn.prototype.addOtherInfo = function (creatorId, modifiedTime, columnDescription) {
                        var _this = this;
                        this.otherInfo.push({
                            __creatorId: creatorId,
                            modifiedTime: modifiedTime,
                            tags: columnDescription.tags || [],
                            description: columnDescription.description || ""
                        });
                        DataCatalog.Core.Utilities.arrayDistinct((columnDescription.tags || []).map($.trim)).forEach(function (t) {
                            var identifier = t.toUpperCase();
                            _this.tagCreators[identifier] = _this.tagCreators[identifier] || [];
                            if (!_this.tagCreators[identifier].some(function (tp) { return tp.email === creatorId; })) {
                                _this.tagCreators[identifier].push({ email: creatorId });
                            }
                        });
                        this.setTagAttributes();
                    };
                    BindableColumn.prototype.setTagAttributes = function () {
                        var _this = this;
                        var sorter = function (a, b) {
                            var favorMine = function (a, b) {
                                if (a.readOnly === b.readOnly) {
                                    return 0;
                                }
                                if (!a.readOnly) {
                                    return -1;
                                }
                                if (!b.readOnly) {
                                    return 1;
                                }
                                return 0;
                            };
                            var compareStrings = function (a, b) {
                                if (a > b) {
                                    return 1;
                                }
                                if (a < b) {
                                    return -1;
                                }
                                return 0;
                            };
                            // Sort mine first and then alphabetically
                            return favorMine(a, b) || compareStrings(a.name, b.name);
                        };
                        var myTagsLookup = {};
                        this.tags().forEach(function (tag) {
                            myTagsLookup[tag.toUpperCase()] = true;
                            _this.tagCreators[tag.toUpperCase()] = _this.tagCreators[tag.toUpperCase()] || [];
                            if (!_this.tagCreators[tag.toUpperCase()].some(function (tp) { return tp.email === $tokyo.user.email; })) {
                                _this.tagCreators[tag.toUpperCase()].push({ email: $tokyo.user.email });
                            }
                        });
                        var otherTags = this.otherInfo.map(function (o) { return o.tags; }).reduce(function (a, b) {
                            return a.concat(b);
                        }, []);
                        this.tagAttributes(DataCatalog.Core.Utilities.arrayDistinct(this.tags().concat(otherTags)).map(function (t) {
                            return { name: t, readOnly: !myTagsLookup[t.toUpperCase()], tooltips: _this.tagCreators[t.toUpperCase()] || [] };
                        }).sort(sorter));
                    };
                    BindableColumn.prototype.getOtherDescriptions = function (predicate) {
                        var _this = this;
                        var others = [];
                        var translate = function (otherInfo) {
                            return new Models.BindableDescription(_this.experts, {
                                __id: "",
                                __creatorId: otherInfo.__creatorId,
                                friendlyName: "",
                                tags: otherInfo.tags,
                                description: otherInfo.description,
                                modifiedTime: otherInfo.modifiedTime
                            });
                        };
                        // Find the experts if they exists
                        $.each(this.otherInfo, function (i, other) {
                            if (_this.experts().some(function (e) { return e === other.__creatorId; }) && other.description && predicate(other)) {
                                others.push(translate(other));
                            }
                        });
                        // Add the rest
                        $.each(this.otherInfo, function (i, other) {
                            if (_this.experts().every(function (e) { return e !== other.__creatorId; }) && other.description && predicate(other)) {
                                others.push(translate(other));
                            }
                        });
                        return others;
                    };
                    BindableColumn.prototype.onSeeMore = function () {
                        this.descExpanded(!this.descExpanded());
                    };
                    return BindableColumn;
                })();
                Models.BindableColumn = BindableColumn;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
// [TODO] raghum uncomment and fix the issue
//import SourceTypes = require("core/SourceTypes");
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                Models.logger = Microsoft.DataStudio.DataCatalog.LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Models" });
                var BindableDataEntity = (function () {
                    function BindableDataEntity(searchEntity) {
                        var _this = this;
                        this.__effectiveRights = ko.observableArray([]);
                        this.__effectiveRightsLookup = {};
                        this.__permissions = ko.observableArray([]);
                        this.__roles = ko.observableArray([]);
                        this.descriptions = ko.observableArray([]);
                        this.experts = ko.observableArray([]);
                        this.documentation = ko.observable();
                        this.officeTelemetry = null;
                        this.officeTelemetryRule = null;
                        this.preview = ko.observable();
                        this.metadataLastUpdated = ko.observable();
                        this.metadataLastUpdatedBy = ko.observable();
                        this.pinned = ko.observable(false);
                        this.allExperts = ko.pureComputed(function () {
                            var allExperts = [];
                            var sorter = function (a, b) {
                                var favorMe = function (a, b) {
                                    if (a === b) {
                                        return 0;
                                    }
                                    if (a === $tokyo.user.email) {
                                        return -1;
                                    }
                                    if (b === $tokyo.user.email) {
                                        return 1;
                                    }
                                    return 0;
                                };
                                var compareStrings = function (a, b) {
                                    if (a > b) {
                                        return 1;
                                    }
                                    if (a < b) {
                                        return -1;
                                    }
                                    return 0;
                                };
                                // Sort mine first and then alphabetically
                                return favorMe(a.__creatorId, b.__creatorId) || compareStrings(a.__creatorId, b.__creatorId);
                            };
                            _this.experts().sort(sorter).forEach(function (e) {
                                allExperts = allExperts.concat(e.experts());
                            });
                            return DataCatalog.Core.Utilities.arrayDistinct(allExperts);
                        }, this);
                        this.firstExpertDisplay = ko.pureComputed(function () {
                            var email = DataCatalog.Core.Utilities.arrayFirst(_this.allExperts()) || "";
                            var searchWords = DataCatalog.Core.Utilities.extractHighlightedWords(email);
                            var baseEmail = DataCatalog.Core.Utilities.plainText(email);
                            var maxLength;
                            var ending;
                            var baseLength = BindableDataEntity.DISPLAY_LENGTH;
                            if (_this.allExperts().length === 1) {
                                maxLength = baseLength - 3;
                                ending = "...";
                            }
                            else {
                                maxLength = baseLength;
                                ending = "";
                            }
                            if (baseEmail.length > maxLength) {
                                baseEmail = baseEmail.substring(0, maxLength);
                                baseEmail += ending;
                            }
                            email = DataCatalog.Core.Utilities.applyHighlighting(searchWords, baseEmail);
                            return email;
                        }, this);
                        this.hasUpdateRight = ko.pureComputed(function () {
                            return !!_this.__effectiveRights().filter(function (r) { return r === "Update"; }).length;
                        });
                        this.hasDeleteRight = ko.pureComputed(function () {
                            return !!_this.__effectiveRights().filter(function (r) { return r === "Delete"; }).length;
                        });
                        this.hasTakeOwnershipRight = ko.pureComputed(function () {
                            return !!_this.__effectiveRights().filter(function (r) { return r === "TakeOwnership"; }).length;
                        });
                        this.hasChangeOwnershipRight = ko.pureComputed(function () {
                            return !!_this.__effectiveRights().filter(function (r) { return r === "ChangeOwnership"; }).length;
                        });
                        this.hasChangeVisibilityRight = ko.pureComputed(function () {
                            return !!_this.__effectiveRights().filter(function (r) { return r === "ChangeVisibility"; }).length;
                        });
                        this.hasAuthorizationManagement = ko.pureComputed(function () {
                            return !!_this.__effectiveRights().filter(function (r) { return r === "TakeOwnership" || r === "ChangeOwnership" || r === "ChangeVisibility"; }).length;
                        });
                        this.displayDescription = ko.pureComputed(function () {
                            if (_this.descriptions().length > 0) {
                                var ensureDesc = function (desc) { return desc && desc.description && !!$.trim(desc.description()); };
                                // Use experts, or mine, or first
                                var descObject = DataCatalog.Core.Utilities.arrayFirst(_this.getDescriptionsByEmails(_this.allExperts(), ensureDesc)) ||
                                    DataCatalog.Core.Utilities.arrayFirst(_this.getDescriptionsByEmails([$tokyo.user.email], ensureDesc)) ||
                                    _this.descriptions()[0];
                                var description = descObject.description() || "";
                                if (!description) {
                                    // Ugh, we still haven't found a viable description,
                                    // so let's get the first one defined.
                                    $.each(_this.descriptions(), function (i, desc) {
                                        if (ensureDesc(desc)) {
                                            description = desc.description();
                                            return false;
                                        }
                                    });
                                }
                                return description;
                            }
                            return "";
                        });
                        this.displayName = ko.pureComputed(function () {
                            // var myDescription = Core.Utilities.arrayFirst(this.getDescriptionsByEmails([$tokyo.user.email]));
                            // var name = myDescription.friendlyName() || this.name;
                            // return name;
                            return _this.name;
                        });
                        this.displayTags = ko.pureComputed(function () {
                            var tagSummary = [];
                            var tagHash = {};
                            // Use mine, experts, others
                            var myDescription = DataCatalog.Core.Utilities.arrayFirst(_this.getDescriptionsByEmails([$tokyo.user.email]));
                            $.each(myDescription.tags(), function (i, tag) {
                                tag = $.trim(tag);
                                if (tag && !tagHash[tag.toUpperCase()]) {
                                    tagHash[tag.toUpperCase()] = true;
                                    tagSummary.push(tag);
                                }
                            });
                            // Experts
                            var expertDescriptions = _this.getDescriptionsByEmails(_this.allExperts());
                            if (expertDescriptions && expertDescriptions.length) {
                                $.each(expertDescriptions, function (i, expertDescription) {
                                    $.each(expertDescription.tags(), function (j, tag) {
                                        tag = $.trim(tag);
                                        if (tag && !tagHash[tag.toUpperCase()]) {
                                            tagHash[tag.toUpperCase()] = true;
                                            tagSummary.push(tag);
                                        }
                                    });
                                });
                            }
                            // Others
                            $.each(_this.descriptions() || [], function (i, other) {
                                $.each(other.tags() || [], function (j, tag) {
                                    tag = $.trim(tag);
                                    if (tag && !tagHash[tag.toUpperCase()]) {
                                        tagHash[tag.toUpperCase()] = true;
                                        tagSummary.push(tag);
                                    }
                                });
                            });
                            return tagSummary.slice(0, 8);
                        });
                        this.pinEntity = function () {
                            _this.pinned(true);
                            Models.logger.logInfo("Pin Asset", { assetId: _this.__id });
                            DataCatalog.Services.UserProfileService.getPins().done(function (pins) {
                                // Make sure this item isn't already in the array before adding it to the front.
                                var pinItems = pins.pins.filter(function (p) { return p.assetId !== _this.__id; });
                                var created = new Date().toISOString();
                                var entityPin = {
                                    id: DataCatalog.Core.Utilities.createID(),
                                    name: DataCatalog.Core.Utilities.plainText(_this.name),
                                    assetId: _this.__id,
                                    createdDate: created,
                                    lastUsedDate: created
                                };
                                pinItems.unshift(entityPin);
                                pins.pins = pinItems;
                                DataCatalog.Services.UserProfileService.setPins(pins);
                            });
                        };
                        this.unpinEntity = function () {
                            _this.pinned(false);
                            Models.logger.logInfo("Unpin Asset", { assetId: _this.__id });
                            DataCatalog.Services.UserProfileService.getPins().done(function (pins) {
                                var pinItems = pins.pins.filter(function (p) { return p.assetId !== _this.__id; });
                                pins.pins = pinItems;
                                DataCatalog.Services.UserProfileService.setPins(pins);
                            });
                        };
                        this.updated = searchEntity.updated;
                        var content = searchEntity.content;
                        this.__id = content.__id;
                        this.__type = content.__type;
                        this.__creatorId = content.__creatorId;
                        this.DataSourceType = DataCatalog.Core.Utilities.getTypeFromString(content.__type);
                        // Authorization
                        this.__effectiveRights(content.__effectiveRights || []);
                        if (content.__permissions) {
                            var bindablePermissions = content.__permissions.map(function (p) { return new Models.BindablePermission(p); });
                            this.__permissions(bindablePermissions);
                        }
                        if (content.__roles && content.__roles.length) {
                            var bindableRoles = content.__roles.map(function (r) { return new Models.BindableRole(r); });
                            this.__roles(bindableRoles);
                        }
                        var onRightsChanged = function (newValue) {
                            _this.__effectiveRightsLookup = {};
                            (newValue || []).forEach(function (r) {
                                _this.__effectiveRightsLookup[r] = true;
                            });
                        };
                        onRightsChanged(this.__effectiveRights());
                        var subscription = this.__effectiveRights.subscribe(onRightsChanged);
                        this.dispose = function () {
                            subscription.dispose();
                        };
                        this.modifiedTime = DataCatalog.Core.Utilities.convertDateTimeStringToISOString(content.modifiedTime);
                        this.name = content.name || (content.measure || {}).name || "";
                        this.containerId = content.containerId;
                        this.dataSource = content.dataSource;
                        this.dsl = content.dsl;
                        this.measure = content.measure;
                        this.lastRegisteredTime = content.lastRegisteredTime;
                        this.lastRegisteredBy = content.lastRegisteredBy;
                        this.previewId = this.getPreviewId(content);
                        $.each(content.experts || [], function (i, expert) {
                            _this.experts.push(new Models.BindableExpert(expert));
                        });
                        this.ensureMyExpert();
                        $.each(content.descriptions || [], function (i, desc) {
                            _this.descriptions.push(new Models.BindableDescription(_this.allExperts, desc));
                        });
                        this.ensureMyDescription(content.descriptions);
                        this.accessInstructions = content.accessInstructions || [];
                        this.ensureMyAccessInstruction();
                        var documentation = content.documentation;
                        if ($.isArray(content.documentation)) {
                            // Backwards compatible for documentation as array
                            documentation = DataCatalog.Core.Utilities.arrayFirst(content.documentation || []);
                        }
                        this.documentation(new Models.BindableDocumentation(documentation));
                        var schema = Models.BindableSchema.getSchemaForDisplay(content.schemas);
                        this.schema = new Models.BindableSchema(schema);
                        // Merge schemaDescription from the location under schemas and root
                        var allSchemaDescriptions = (schema.schemaDescriptions || []).concat(content.schemaDescriptions || []);
                        var mergedSchemaDescriptions = Models.BindableSchemaDescription.mergeSchemaDescriptions(allSchemaDescriptions);
                        var myBindableSchemaDescription = Models.BindableSchemaDescription.getMyBindableSchemaDescription(mergedSchemaDescriptions, schema.columns, this.allExperts);
                        this.schemaDescription = myBindableSchemaDescription;
                        var minDate = new Date(0);
                        var maxDateInfo = BindableDataEntity.findMaxDate(searchEntity, { date: minDate, by: "" });
                        if (maxDateInfo.date > minDate) {
                            this.metadataLastUpdated(maxDateInfo.date);
                            this.metadataLastUpdatedBy(maxDateInfo.by);
                        }
                        this.searchRelevanceInfo = searchEntity.searchRelevanceInfo;
                        // Data Profile
                        if (searchEntity.content.tableDataProfiles && searchEntity.content.tableDataProfiles.length) {
                            var tableProfiles = searchEntity.content.tableDataProfiles;
                            var tableProfile = DataCatalog.Core.Utilities.getLatestModifiedAsset(tableProfiles);
                            this.dataProfile = {
                                tableName: this.name,
                                schema: "",
                                numberOfRows: tableProfile.numberOfRows,
                                size: tableProfile.size,
                                rowDataLastUpdated: tableProfile.dataModifiedTime || "",
                                schemaLastModified: tableProfile.schemaModifiedTime || "",
                                columns: []
                            };
                        }
                        this.columnProfileId = this.getColumnProfileId(searchEntity.content);
                        DataCatalog.Services.UserProfileService.getPins().done(function (pins) {
                            var self = pins.pins.filter(function (p) { return p.assetId === _this.__id; });
                            _this.pinned(self.length > 0);
                        });
                        if (searchEntity.content.officeTelemetrys && searchEntity.content.officeTelemetrys.length) {
                            this.officeTelemetry = new Models.BindableOfficeTelemetry(DataCatalog.Core.Utilities.getLatestModifiedAsset(searchEntity.content.officeTelemetrys));
                        }
                        if (searchEntity.content.officeTelemetryRules && searchEntity.content.officeTelemetryRules.length) {
                            this.officeTelemetryRule = new Models.BindableOfficeTelemetryRule(DataCatalog.Core.Utilities.getLatestModifiedAsset(searchEntity.content.officeTelemetryRules));
                        }
                    }
                    BindableDataEntity.prototype.setColumnProfiles = function (columnProfile) {
                        var columnDataArray = [];
                        (columnProfile.columns || []).forEach(function (columnData) {
                            var stdev = "";
                            if (columnData.hasOwnProperty("stdev")) {
                                stdev = columnData.stdev.toString(10);
                            }
                            var avg = "";
                            if (columnData.hasOwnProperty("avg")) {
                                avg = columnData.avg;
                            }
                            var bindableColumnProfile = {
                                name: columnData.columnName,
                                type: columnData.type,
                                distinct: columnData.distinctCount || 0,
                                nullcount: columnData.nullCount || 0,
                                min: columnData.min || "",
                                max: columnData.max || "",
                                avg: avg,
                                stdev: stdev
                            };
                            columnDataArray.push(bindableColumnProfile);
                        });
                        if (this.dataProfile) {
                            this.dataProfile.columns = columnDataArray;
                        }
                    };
                    BindableDataEntity.prototype.ensureMyAccessInstruction = function () {
                        var hasMyAccessInstruction = this.accessInstructions.some(function (ai) { return ai.__creatorId === $tokyo.user.email; });
                        if (!hasMyAccessInstruction) {
                            this.accessInstructions.push({
                                __id: null,
                                __creatorId: $tokyo.user.email,
                                content: "",
                                modifiedTime: new Date().toISOString(),
                                mimeType: "text/html"
                            });
                        }
                    };
                    BindableDataEntity.prototype.ensureMyExpert = function () {
                        var hasMyExpert = this.experts().some(function (e) { return e.__creatorId === $tokyo.user.email; });
                        if (!hasMyExpert) {
                            var myExpert = new Models.BindableExpert();
                            this.experts.push(myExpert);
                        }
                    };
                    BindableDataEntity.prototype.ensureMyDescription = function (allDescriptions) {
                        // Find the most recent friendlyName (last one wins)
                        var mostRecentFriendlyName = "";
                        var mostRecentDate = new Date(0);
                        $.each(allDescriptions || [], function (i, desc) {
                            var modifiedTime = new Date(desc.modifiedTime);
                            if (modifiedTime > mostRecentDate) {
                                mostRecentDate = modifiedTime;
                                mostRecentFriendlyName = desc.friendlyName;
                            }
                        });
                        var myDesc = DataCatalog.Core.Utilities.arrayFirst(this.getDescriptionsByEmails([$tokyo.user.email]));
                        if (!myDesc) {
                            myDesc = new Models.BindableDescription(this.allExperts);
                            this.descriptions.push(myDesc);
                        }
                        myDesc.friendlyName(mostRecentFriendlyName);
                    };
                    BindableDataEntity.findMaxDate = function (object, maxSoFar) {
                        if ($.isPlainObject(object)) {
                            if (object && /@/.test(object.__creatorId) && object.modifiedTime) {
                                var isoUtcDate = DataCatalog.Core.Utilities.convertDateTimeStringToISOString(object.modifiedTime);
                                var currentModifiedTime = new Date(isoUtcDate);
                                if (currentModifiedTime > maxSoFar.date) {
                                    maxSoFar.date = currentModifiedTime;
                                    maxSoFar.by = object.__creatorId;
                                }
                            }
                            $.each(object, function (key, value) {
                                if ($.isPlainObject(value)) {
                                    maxSoFar = BindableDataEntity.findMaxDate(value, maxSoFar);
                                }
                                if ($.isArray(value)) {
                                    $.each(value, function (i, j) {
                                        maxSoFar = BindableDataEntity.findMaxDate(j, maxSoFar);
                                    });
                                }
                            });
                        }
                        return maxSoFar;
                    };
                    BindableDataEntity.prototype.getDescriptionsByEmails = function (emails, predicate) {
                        var _this = this;
                        predicate = predicate || (function () { return true; });
                        var matches = [];
                        $.each(emails, function (i, email) {
                            $.each(_this.descriptions(), function (j, desc) {
                                if (email && desc.__creatorId === email && predicate(desc)) {
                                    matches.push(desc);
                                    return false;
                                }
                            });
                        });
                        return matches;
                    };
                    BindableDataEntity.prototype.getColumnProfileId = function (content) {
                        var profileAsset = DataCatalog.Core.Utilities.getLatestModifiedAsset(content.columnsDataProfileLinks) || DataCatalog.Core.Utilities.getLatestModifiedAsset(content.columnsDataProfiles);
                        var profileId = profileAsset ? profileAsset.__id : null;
                        return profileId;
                    };
                    BindableDataEntity.prototype.getPreviewId = function (content) {
                        var previewAsset = DataCatalog.Core.Utilities.getLatestModifiedAsset(content.previewLinks) || DataCatalog.Core.Utilities.getLatestModifiedAsset(content.previews);
                        var previewId = previewAsset ? previewAsset.__id : null;
                        return previewId;
                    };
                    BindableDataEntity.prototype.hasDocumentation = function () {
                        return true;
                    };
                    BindableDataEntity.prototype.hasPreviewLink = function () {
                        return this.hasSchema();
                    };
                    BindableDataEntity.prototype.hasPreviewData = function () {
                        return !!$.trim(this.previewId);
                    };
                    BindableDataEntity.prototype.hasSchema = function () {
                        return true;
                        // [TODO] raghum uncomment and fix the issue
                        // return (this.schema && (this.schema.columns || []).length > 0) || (this.dataSource &&
                        //     SourceTypes.supportsSchema(this.dataSource.sourceType, this.dataSource.objectType));
                    };
                    BindableDataEntity.prototype.hasDataProfile = function () {
                        var hasProfile = false;
                        if (this.dataProfile) {
                            hasProfile = true;
                        }
                        return hasProfile;
                    };
                    BindableDataEntity.prototype.hasTelemetry = function () {
                        return (this.officeTelemetry !== null || this.officeTelemetryRule !== null);
                    };
                    BindableDataEntity.prototype.getMostRecentAccessInstruction = function () {
                        var currDate = new Date(0);
                        var accessInstruction;
                        // Find most recent description object
                        (this.accessInstructions || []).forEach(function (ai) {
                            var isoUtcDate = DataCatalog.Core.Utilities.convertDateTimeStringToISOString(ai.modifiedTime);
                            var currentModifiedTime = new Date(isoUtcDate);
                            if (currentModifiedTime > currDate && $.trim(ai.content)) {
                                currDate = currentModifiedTime;
                                accessInstruction = ai;
                            }
                        });
                        return {
                            __id: accessInstruction ? accessInstruction.__id : "",
                            __creatorId: accessInstruction ? accessInstruction.__creatorId : $tokyo.user.email,
                            content: accessInstruction ? accessInstruction.content : "",
                            modifiedTime: accessInstruction ? accessInstruction.modifiedTime : new Date().toISOString(),
                            mimeType: accessInstruction ? accessInstruction.mimeType : ""
                        };
                    };
                    BindableDataEntity.prototype.getContainerName = function () {
                        var containerTypeName = "";
                        switch (DataCatalog.Core.Utilities.plainText(this.dataSource.sourceType).toLowerCase()) {
                            case "sql server":
                            case "sql data warehouse":
                            case "oracle database":
                            case "hive":
                            case "teradata":
                            case "mysql":
                            case "db2":
                            case "postgresql":
                                containerTypeName = DataCatalog.Core.Resx.database;
                                break;
                            case "sql server analysis services":
                            case "sql server analysis services multidimensional":
                            case "sql server analysis services tabular":
                                containerTypeName = DataCatalog.Core.Resx.model;
                                break;
                            case "azure storage":
                                containerTypeName = DataCatalog.Core.Resx.container;
                                break;
                            case "sql server reporting services":
                                containerTypeName = DataCatalog.Core.Resx.folder;
                                break;
                            case "cosmos":
                                containerTypeName = DataCatalog.Core.Resx.virtualCluster;
                                break;
                            case "azure data lake store":
                                containerTypeName = DataCatalog.Core.Resx.datalake;
                                break;
                            case "hadoop distributed file system":
                                containerTypeName = DataCatalog.Core.Resx.cluster;
                                break;
                            case "sap hana":
                                containerTypeName = DataCatalog.Core.Resx.package;
                                break;
                            case "odata":
                                containerTypeName = DataCatalog.Core.Resx.objecttype_entitycontainer;
                                break;
                            case "http":
                                containerTypeName = DataCatalog.Core.Resx.objecttype_site;
                                break;
                        }
                        return containerTypeName;
                    };
                    BindableDataEntity.DISPLAY_LENGTH = 25;
                    return BindableDataEntity;
                })();
                Models.BindableDataEntity = BindableDataEntity;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindableDescription = (function () {
                    function BindableDescription(experts, desc) {
                        var _this = this;
                        this.displayDate = ko.pureComputed(function () {
                            var dateString = "";
                            if (_this.modifiedTime()) {
                                var date = new Date(_this.modifiedTime());
                                dateString = date.toLocaleDateString();
                            }
                            return dateString;
                        });
                        this.isExpertDesc = ko.pureComputed(function () {
                            return _this.experts().some(function (e) { return e === _this.__creatorId; });
                        });
                        this.linkedDescription = ko.pureComputed(function () {
                            var desc = _this.description() || "";
                            var highlightedWords = DataCatalog.Core.Utilities.extractHighlightedWords(desc);
                            var plainText = DataCatalog.Core.Utilities.plainText(desc);
                            // Add links
                            plainText = plainText.replace(DataCatalog.Core.Constants.HttpRegex, "<a href='{$&}' target='_blank'>$&</a>");
                            // Add mailto
                            plainText = plainText.replace(DataCatalog.Core.Constants.EmailRegex, "<a href='{mailto:$&'}>$&</a>");
                            // Add highlights back
                            plainText = DataCatalog.Core.Utilities.applyHighlighting(highlightedWords, plainText);
                            // Clean up links
                            plainText = plainText.replace(/(href='{)([^}]*)(})/g, function (a, b, c) {
                                return "href='" + DataCatalog.Core.Utilities.plainText(c);
                            });
                            return plainText;
                        });
                        this.experts = experts;
                        this.__id = (desc && desc.__id) || "";
                        this.__creatorId = desc ? desc.__creatorId : $tokyo.user.email;
                        this.friendlyName = ko.observable(desc && desc.friendlyName || "");
                        this.description = ko.observable(desc && desc.description || "");
                        var safe = Microsoft.DataStudio.DataCatalog.Core.Utilities.removeScriptTags(this.description());
                        var stripped = DataCatalog.Core.Utilities.removeHtmlTags(safe);
                        this.plainDescription = ko.observable(stripped);
                        this.tags = ko.observableArray(desc && desc.tags || []);
                        this.modifiedTime = ko.observable(desc && desc.modifiedTime || (new Date()).toISOString());
                        var descSubscription = this.description.subscribe(function (newDesc) {
                            var safe = DataCatalog.Core.Utilities.removeScriptTags(newDesc);
                            var stripped = DataCatalog.Core.Utilities.removeHtmlTags(safe);
                            _this.plainDescription(stripped);
                        });
                        var plainSubscription = this.plainDescription.subscribe(function (newDesc) {
                            _this.description(newDesc);
                        });
                        this.dispose = function () {
                            descSubscription.dispose();
                            plainSubscription.dispose();
                        };
                    }
                    BindableDescription.prototype.displayCreatedBy = function () {
                        // If __creatorId is not an email address then it must be from extractor
                        return this.isUserCreated() ? this.__creatorId : DataCatalog.Core.Resx.dataSource;
                    };
                    BindableDescription.prototype.isUserCreated = function () {
                        return /@/.test(this.__creatorId);
                    };
                    return BindableDescription;
                })();
                Models.BindableDescription = BindableDescription;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindableDocumentation = (function () {
                    function BindableDocumentation(documentation) {
                        this.__id = "";
                        this.__id = (documentation && documentation.__id) || "";
                        this.__roles = (documentation && documentation.__roles) || [];
                        this.modifiedTime = documentation && documentation.modifiedTime || (new Date()).toISOString();
                        this.mimeType = ko.observable(documentation && documentation.mimeType || "text/html");
                        this.content = ko.observable(documentation && documentation.content || "");
                        if (!this.__id) {
                            DataCatalog.Core.Utilities.setAssetAsMine(this, true);
                        }
                    }
                    return BindableDocumentation;
                })();
                Models.BindableDocumentation = BindableDocumentation;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindableExpert = (function () {
                    function BindableExpert(expert) {
                        this.__id = "";
                        this.experts = ko.observableArray([]);
                        this.__id = (expert && expert.__id) || "";
                        this.__creatorId = expert ? expert.__creatorId : $tokyo.user.email;
                        this.experts(expert ? (expert.experts || []) : []);
                        this.modifiedTime = ko.observable(expert && expert.modifiedTime || (new Date()).toISOString());
                    }
                    return BindableExpert;
                })();
                Models.BindableExpert = BindableExpert;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindableOfficeTelemetry = (function () {
                    function BindableOfficeTelemetry(params) {
                        this.categories = ko.observableArray([]);
                        this.scopeQuery = ko.observable(null);
                        this.__id = params.__id;
                        this.__type = params.__type;
                        this.categories((params.categories || []).map(function (c) { return { name: c, readOnly: true }; }));
                        this.scopeQuery(params.scopeQuery || null);
                    }
                    return BindableOfficeTelemetry;
                })();
                Models.BindableOfficeTelemetry = BindableOfficeTelemetry;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindableOfficeTelemetryRule = (function () {
                    function BindableOfficeTelemetryRule(params) {
                        this.apps = ko.observableArray([]);
                        this.platforms = ko.observableArray([]);
                        this.builds = ko.observableArray([]);
                        this.flights = ko.observableArray([]);
                        this.ruleReference = ko.observable(null);
                        this.ruleHealthReportDogfood = ko.observable(null);
                        this.ruleHealthReportProduction = ko.observable(null);
                        this.splunkLink = ko.observable(null);
                        this.__id = params.__id;
                        this.__type = params.__type;
                        this.apps((params.apps || []).map(function (a) { return { name: a, readOnly: true }; }));
                        this.platforms((params.platforms || []).map(function (p) { return { name: p, readOnly: true }; }));
                        this.builds((params.builds || []).map(function (b) { return { name: b, readOnly: true }; }));
                        this.flights((params.flights || []).map(function (f) { return { name: f, readOnly: true }; }));
                        this.ruleReference(params.ruleReference || null);
                        this.ruleHealthReportDogfood(params.ruleHealthReportDogfood || null);
                        this.ruleHealthReportProduction(params.ruleHealthReportProduction || null);
                        this.splunkLink(params.splunkLink || null);
                    }
                    return BindableOfficeTelemetryRule;
                })();
                Models.BindableOfficeTelemetryRule = BindableOfficeTelemetryRule;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindablePermission = (function () {
                    function BindablePermission(permission) {
                        this.rights = ko.observableArray([]);
                        if (permission) {
                            this.principal = permission.principal;
                            this.rights(permission.rights || []);
                        }
                    }
                    return BindablePermission;
                })();
                Models.BindablePermission = BindablePermission;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindablePinnableListItem = (function () {
                    function BindablePinnableListItem(params) {
                        var _this = this;
                        this.friendlyName = ko.observable(null);
                        this.pinned = ko.observable(false);
                        this.maxStringSize = 35;
                        this.displayLabel = ko.pureComputed(function () {
                            var label = DataCatalog.Core.Utilities.centerTruncate(_this.label, _this.maxStringSize);
                            if (_this.friendlyName()) {
                                label = DataCatalog.Core.Utilities.centerTruncate(_this.friendlyName(), _this.maxStringSize);
                            }
                            return label;
                        });
                        this.label = params.label;
                        this.pinned = params.pinned;
                        this.id = params.id;
                        if (params.hasOwnProperty("friendlyName")) {
                            this.friendlyName(params.friendlyName);
                        }
                    }
                    BindablePinnableListItem.prototype.setFriendlyName = function (value) {
                        this.friendlyName(value);
                    };
                    return BindablePinnableListItem;
                })();
                Models.BindablePinnableListItem = BindablePinnableListItem;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindableResult = (function () {
                    function BindableResult(searchResult) {
                        var _this = this;
                        this.batchedResults = ko.observableArray();
                        this.isBatchLoading = ko.observable(false);
                        this.id = searchResult.id;
                        this.totalResults = searchResult.totalResults;
                        this.startIndex = searchResult.startIndex;
                        this.itemsPerPage = searchResult.itemsPerPage;
                        this.results = searchResult.results.map(function (searchEntity) { return new Models.BindableDataEntity(searchEntity); });
                        this.isBatchLoading(true);
                        var chunks = DataCatalog.Core.Utilities.arrayChunk(this.results, 10);
                        var promise = $.when();
                        var i = 0;
                        chunks.forEach(function (c) {
                            // Bind the first batch synchronously
                            promise = _this._chain(promise, function () {
                                _this.batchedResults.push.apply(_this.batchedResults, c);
                            }, i > 0);
                            i++;
                        });
                        promise.done(function () {
                            _this.isBatchLoading(false);
                        });
                        this.query = searchResult.query;
                    }
                    BindableResult.prototype._chain = function (parent, fn, async) {
                        if (async === void 0) { async = true; }
                        var deferred = $.Deferred();
                        parent.always(function () {
                            var timeout = async ? setTimeout : function (callback, num) { callback(); };
                            timeout(function () {
                                fn();
                                deferred.resolve();
                            }, 0);
                        });
                        return deferred.promise();
                    };
                    return BindableResult;
                })();
                Models.BindableResult = BindableResult;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindableRole = (function () {
                    function BindableRole(roleResult) {
                        this.role = "";
                        this.members = ko.observableArray([]);
                        if (roleResult) {
                            this.role = roleResult.role || "";
                            this.members(roleResult.members || []);
                        }
                    }
                    return BindableRole;
                })();
                Models.BindableRole = BindableRole;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindableSchema = (function () {
                    function BindableSchema(schema) {
                        this.__id = "";
                        this.__creatorId = "";
                        this.columns = [];
                        if (schema) {
                            this.__id = schema.__id;
                            this.__creatorId = schema.__creatorId;
                            this.modifiedTime = schema.modifiedTime;
                            this.columns = schema.columns || [];
                        }
                    }
                    BindableSchema.getSchemaForDisplay = function (schemas) {
                        // Use the most recently updated schema
                        var schema = {};
                        if ((schemas || []).length) {
                            schema = schemas[0];
                            schemas.forEach(function (s) {
                                var myDate = new Date(s.modifiedTime);
                                if (myDate > new Date(schema.modifiedTime)) {
                                    schema = s;
                                }
                            });
                        }
                        return schema;
                    };
                    return BindableSchema;
                })();
                Models.BindableSchema = BindableSchema;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var BindableSchemaDescription = (function () {
                    function BindableSchemaDescription(experts, schemaDesc) {
                        var _this = this;
                        this.__id = "";
                        this.__creatorId = "";
                        this.columnDescriptions = [];
                        this.columnLookup = {};
                        this.experts = experts;
                        this.__id = schemaDesc ? schemaDesc.__id : "";
                        this.__creatorId = schemaDesc ? schemaDesc.__creatorId : $tokyo.user.email;
                        this.modifiedTime = ko.observable(schemaDesc && schemaDesc.modifiedTime || (new Date()).toISOString());
                        if (schemaDesc) {
                            $.each(schemaDesc.columnDescriptions || [], function (i, columnDesc) {
                                var bindableColumn = new Models.BindableColumn(experts, columnDesc);
                                _this.columnLookup[bindableColumn.columnName] = bindableColumn;
                                _this.columnDescriptions.push(bindableColumn);
                            });
                        }
                    }
                    BindableSchemaDescription.prototype.ensureAllColumns = function (columnNames) {
                        var _this = this;
                        $.each(columnNames || [], function (i, column) {
                            if (!_this.columnLookup[column.name]) {
                                var bindableColumn = new Models.BindableColumn(_this.experts, { columnName: column.name, tags: [], description: "" });
                                _this.columnLookup[bindableColumn.columnName] = bindableColumn;
                                _this.columnDescriptions.push(bindableColumn);
                            }
                        });
                    };
                    BindableSchemaDescription.prototype.addOtherData = function (schemaDescriptions) {
                        var _this = this;
                        $.each(schemaDescriptions || [], function (i, schemaDesc) {
                            if (schemaDesc.__creatorId !== $tokyo.user.email) {
                                // This is someone else's schema description
                                $.each(schemaDesc.columnDescriptions || [], function (j, columnDesc) {
                                    var myColumnDesc = _this.getBindableColumnByName(columnDesc.columnName);
                                    myColumnDesc && myColumnDesc.addOtherInfo(schemaDesc.__creatorId, schemaDesc.modifiedTime, columnDesc);
                                });
                            }
                        });
                    };
                    BindableSchemaDescription.prototype.getBindableColumnByName = function (columnName) {
                        return this.columnLookup[columnName];
                    };
                    BindableSchemaDescription.prototype.removeColumnDescription = function (columnName) {
                        this.columnDescriptions = this.columnDescriptions.filter(function (d) { return d.columnName !== columnName; });
                        delete (this.columnLookup[columnName]);
                    };
                    BindableSchemaDescription.mergeSchemaDescriptions = function (schemaDescriptions) {
                        // Give priority to the most recent one if there are multiple from the same user
                        var creatorBuckets = {};
                        (schemaDescriptions || []).forEach(function (sd) {
                            if (creatorBuckets[sd.__creatorId]) {
                                var myDate = new Date(sd.modifiedTime);
                                var theirDate = new Date(creatorBuckets[sd.__creatorId].modifiedTime);
                                if (myDate > theirDate) {
                                    creatorBuckets[sd.__creatorId] = sd;
                                }
                            }
                            else {
                                creatorBuckets[sd.__creatorId] = sd;
                            }
                        });
                        var allSchemaDescriptions = [];
                        Object.keys(creatorBuckets).forEach(function (cid) {
                            allSchemaDescriptions.push(creatorBuckets[cid]);
                        });
                        return allSchemaDescriptions;
                    };
                    BindableSchemaDescription.getMyBindableSchemaDescription = function (schemaDescriptions, columns, experts) {
                        var myBindableSchemaDescription;
                        // Try to find my schema desc
                        $.each(schemaDescriptions || [], function (i, schemaDesc) {
                            if (schemaDesc.__creatorId === $tokyo.user.email) {
                                myBindableSchemaDescription = new BindableSchemaDescription(experts, schemaDesc);
                                return false;
                            }
                        });
                        if (!myBindableSchemaDescription) {
                            myBindableSchemaDescription = new BindableSchemaDescription(experts);
                        }
                        myBindableSchemaDescription.ensureAllColumns(columns);
                        myBindableSchemaDescription.addOtherData(schemaDescriptions);
                        return myBindableSchemaDescription;
                    };
                    return BindableSchemaDescription;
                })();
                Models.BindableSchemaDescription = BindableSchemaDescription;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
// [TODO] raghum uncomment and fix the issue
//import browseManager = require("components/browse/manager");
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Models;
            (function (Models) {
                var SavedSearch = (function () {
                    function SavedSearch(name) {
                        this.version = "1.0.0";
                        var now = new Date().toISOString();
                        this.id = DataCatalog.Core.Utilities.createID();
                        this.name = name;
                        this.lastUsedDate = now;
                        this.createdDate = now;
                        this.isDefault = false;
                        // [TODO] raghum uncomment and fix the issue
                        //this.searchTerms = browseManager.searchText();
                        //this.facetFilters = (browseManager.selectedFilters() || []).slice();
                        //this.sortKey = browseManager.sortField().value;
                        //this.containerId = null;
                        //if (browseManager.container()) {
                        //    this.containerId = browseManager.container().__id;
                        //}
                    }
                    return SavedSearch;
                })();
                Models.SavedSearch = SavedSearch;
            })(Models = DataCatalog.Models || (DataCatalog.Models = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Services;
            (function (Services) {
                Services.logger = Microsoft.DataStudio.DataCatalog.LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC service Components" });
                var authenticationManager = Microsoft.DataStudio.Managers.AuthenticationManager.instance;
                var configurationManager = Microsoft.DataStudio.Managers.ConfigurationManager.instance;
                var BaseService = (function () {
                    function BaseService() {
                    }
                    BaseService.stringify = function (value) {
                        var jsonString = JSON.stringify(value);
                        // Remove any HTML lingering around
                        jsonString = DataCatalog.Core.Utilities.plainText(jsonString);
                        return jsonString;
                    };
                    BaseService.ensureAuth = function () {
                        return this.ajax("/api/ensureauthorized", { method: "GET" });
                    };
                    BaseService.getNewCorrelationId = function () {
                        return (parseInt(Math.random() * Math.pow(2, 32) + "", 10)).toString(36).toUpperCase();
                    };
                    BaseService.logAjaxError = function (jqueryXhr, logObject, logAsWarning) {
                        jqueryXhr = jqueryXhr || {};
                        logObject = logObject || {};
                        if (jqueryXhr.getResponseHeader) {
                            var tracingId = jqueryXhr.getResponseHeader($tokyo.constants.azureStandardResponseActivityIdHeader);
                            var clientTracingId = jqueryXhr.getResponseHeader($tokyo.constants.azureStandardActivityIdHeader);
                            var catalogResponseCode = jqueryXhr.getResponseHeader($tokyo.constants.catalogResponseStatusCodeHeaderName);
                            var searchResponseCode = jqueryXhr.getResponseHeader($tokyo.constants.searchResponseStatusCodeHeaderName);
                            logObject = $.extend({
                                tracingId: tracingId,
                                clientTracingId: clientTracingId,
                                catalogResponseCode: catalogResponseCode,
                                searchResponseCode: searchResponseCode
                            }, logObject);
                        }
                        var stackTrace = "";
                        try {
                            var error = new Error();
                            stackTrace = error.stack;
                        }
                        catch (e) {
                        }
                        logObject = $.extend({ responseText: jqueryXhr.responseText, stackTrace: stackTrace }, logObject);
                        logAsWarning
                            ? Services.logger.logWarning(DataCatalog.Core.Utilities.stringFormat("Ajax Warn: {0} - {1}", jqueryXhr.status, jqueryXhr.statusText), logObject)
                            : Services.logger.logError(DataCatalog.Core.Utilities.stringFormat("Ajax Error: {0} - {1}", jqueryXhr.status, jqueryXhr.statusText), logObject);
                    };
                    BaseService.ajax = function (url, settings, cancelAction, showModalOnError, onUnauthorized) {
                        var _this = this;
                        var deferred = $.Deferred();
                        var correlationId = this.getNewCorrelationId();
                        var urlAction = /[^?]*/.exec(url.split("/").pop())[0];
                        // Try again after transient error
                        var reTry = function () {
                            var retryDeferred = $.Deferred();
                            var numFails = 0;
                            var maxFails = 3;
                            var execute = function () {
                                authenticationManager.getAccessTokenADC().then(function (token) {
                                    $.ajax(buildRequestUrl(token), $.extend({
                                        beforeSend: function (xhr, settings) {
                                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                                        }
                                    }, settings))
                                        .done(function () {
                                        Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("successful ajax call after retry ({0})", urlAction), { correlationId: correlationId });
                                    })
                                        .done(retryDeferred.resolve)
                                        .fail(function (r, textStatus, thrownError) {
                                        r = r || {};
                                        Services.logger.logWarning(DataCatalog.Core.Utilities.stringFormat("unsuccessful ajax call during retry: ({0}) {1} - {2}", urlAction, r.status, r.statusText), { url: url, settings: settings, responseText: r.responseText, correlationId: correlationId });
                                        numFails++;
                                        if (numFails > maxFails) {
                                            retryDeferred.reject.apply(retryDeferred, arguments);
                                        }
                                        else {
                                            setTimeout(execute, 500 * numFails);
                                        }
                                    });
                                });
                            };
                            setTimeout(execute, 1000);
                            return retryDeferred.promise();
                        };
                        // Try to reauthenticate the user
                        var reAuth = (function () {
                            var authFrameId = "renew-auth-frame";
                            var timeout;
                            var executingKillSwitch = false;
                            return function () {
                                Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("reauthenticating user ({0})", urlAction), { correlationId: correlationId });
                                var authDeferred = $.Deferred();
                                $("#" + authFrameId).remove();
                                var executeKillSwitch = function () {
                                    if (!executingKillSwitch) {
                                        executingKillSwitch = true;
                                        // Just in case, let's arm a kill switch
                                        Services.logger.logWarning(DataCatalog.Core.Utilities.stringFormat("failed to automatically reauthenticate user ({0})", urlAction), { correlationId: correlationId });
                                        if (Services.ModalService.isShowing()) {
                                            var response = confirm(DataCatalog.Core.Resx.expiredSession);
                                            if (response) {
                                                window.location.reload();
                                            }
                                        }
                                        else {
                                            Services.ModalService.show({ title: DataCatalog.Core.Resx.expiredSessionTitle, bodyText: DataCatalog.Core.Resx.expiredSession })
                                                .done(function (modal) {
                                                modal.close();
                                                window.location.reload();
                                            });
                                        }
                                    }
                                };
                                var frame = $("<iframe>")
                                    .css({ width: 0, height: 0, borderWidth: 0, position: "absolute", visibility: "hidden" })
                                    .attr("id", authFrameId)
                                    .attr("src", "/home/reauthenticate")
                                    .load(function () {
                                    try {
                                        var responseBody = $("#" + authFrameId).contents().find("body").html();
                                        if (responseBody === "reauthenticated") {
                                            // We are re-authenticated
                                            Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("successfully automatically re-authenticated user ({0})", urlAction), { correlationId: correlationId });
                                            // De-arm the kill switch
                                            clearTimeout(timeout);
                                            authDeferred.resolve();
                                        }
                                        else {
                                            Services.logger.logWarning(DataCatalog.Core.Utilities.stringFormat("bad response from reauthenticate endpoint ({0})", urlAction), { correlationId: correlationId, responseBody: responseBody });
                                            executeKillSwitch();
                                        }
                                    }
                                    catch (e) {
                                        // Cross origin frame
                                        timeout = setTimeout(executeKillSwitch, 3000);
                                    }
                                });
                                $("body").append(frame);
                                return authDeferred.promise();
                            };
                        })();
                        // Try to update the csrf token
                        var tryToUpdateCsrf = function () {
                            var csrfDeferred = $.Deferred();
                            var csrfFrameId = "csrf-frame";
                            Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("starting to update csrf for user ({0})", urlAction), { correlationId: correlationId });
                            $("#" + csrfFrameId).remove();
                            var frame = $("<iframe>")
                                .css({ width: 0, height: 0, borderWidth: 0, position: "absolute", visibility: "hidden" })
                                .attr("id", csrfFrameId)
                                .attr("src", "/home/csrfrefresh")
                                .load(function () {
                                try {
                                    var contents = $("#" + csrfFrameId).contents();
                                    var token = contents.find("input[name='__RequestVerificationToken']").val();
                                    var version = contents.find("input[name='__AzureDataCatalogVersion']").val();
                                    if (token && version && version !== $tokyo.app.version) {
                                        // We have updated the csrf 
                                        $("input[name='__RequestVerificationToken']").val(token);
                                        Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("successfully udpated csrf for user ({0})", urlAction), { correlationId: correlationId });
                                    }
                                    else if (!token || !version) {
                                        var responseBody = contents.find("body").html();
                                        Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("bad response from csrfrefresh endpoint ({0})", urlAction), { correlationId: correlationId, responseBody: responseBody });
                                    }
                                    else {
                                        Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("no need to udpate csrf for user ({0})", urlAction), { correlationId: correlationId });
                                    }
                                    csrfDeferred.resolve();
                                }
                                catch (e) {
                                    Services.logger.logWarning(DataCatalog.Core.Utilities.stringFormat("failed to automatically update csrf for user ({0})", urlAction), { correlationId: correlationId });
                                    if (Services.ModalService.isShowing()) {
                                        var response = confirm(DataCatalog.Core.Resx.expiredSession);
                                        if (response) {
                                            window.location.reload();
                                        }
                                    }
                                    else {
                                        Services.ModalService.show({ title: DataCatalog.Core.Resx.expiredSessionTitle, bodyText: DataCatalog.Core.Resx.expiredSession })
                                            .done(function (modal) {
                                            modal.close();
                                            window.location.reload();
                                        });
                                    }
                                }
                            });
                            $("body").append(frame);
                            return csrfDeferred.promise();
                        };
                        var onFailure = function (jqXhr, textStatus, thrownError) {
                            var isClientError = Math.floor(jqXhr.status / 100) === 4;
                            var isAuthError = jqXhr.status === DataCatalog.Core.Constants.HttpStatusCodes.UNAUTHORIZED || jqXhr.status === DataCatalog.Core.Constants.HttpStatusCodes.FORBIDDEN;
                            var isTooLargeError = jqXhr.status === DataCatalog.Core.Constants.HttpStatusCodes.REQUESTENTITYTOOLARGE;
                            if (showModalOnError === void 0) {
                                // Default behavior is not to show modal error for GET requests unless auth error
                                showModalOnError = (settings && (settings.type || "GET").toUpperCase() !== "GET") || isAuthError;
                            }
                            if (!showModalOnError) {
                                deferred.reject.apply(deferred, arguments);
                                return;
                            }
                            var tracingId = jqXhr.getResponseHeader("x-ms-request-id");
                            var clientTracingId = jqXhr.getResponseHeader("x-ms-client-request-id");
                            var bodyText = DataCatalog.Core.Resx.saveErrorNotice;
                            isAuthError && (bodyText = DataCatalog.Core.Resx.expiredSession);
                            if (isTooLargeError) {
                                var maxEntitySizeKb = (256000 / 1000);
                                var currentSizeKb = ((settings || {}).data || "").toString().length / 1000;
                                currentSizeKb = Math.max(currentSizeKb, maxEntitySizeKb + 1);
                                bodyText = DataCatalog.Core.Utilities.stringFormat(DataCatalog.Core.Resx.saveErrorTooLargeNoticeFormat, maxEntitySizeKb.toFixed(0) + "KB", currentSizeKb.toFixed(0) + "KB");
                            }
                            if (isClientError && jqXhr && jqXhr.responseJSON && jqXhr.responseJSON.error && jqXhr.responseJSON.error.message) {
                                bodyText = jqXhr.responseJSON.error.message;
                            }
                            if (tracingId || clientTracingId) {
                                bodyText += "<br><div class='small'>";
                            }
                            if (tracingId) {
                                bodyText += DataCatalog.Core.Utilities.stringFormat("<br>Tracing ID: {0}", tracingId);
                            }
                            if (clientTracingId) {
                                bodyText += DataCatalog.Core.Utilities.stringFormat("<br>Tracing Client ID: {0}", clientTracingId);
                            }
                            if (tracingId || clientTracingId) {
                                bodyText += "</div>";
                            }
                            var reloadWindowAction = function () {
                                window.location.reload();
                                return $.Deferred().resolve().promise();
                            };
                            Services.ErrorService.addError({
                                title: isAuthError ? DataCatalog.Core.Resx.expiredSessionTitle : DataCatalog.Core.Resx.anErrorHasOccurred,
                                bodyText: bodyText,
                                cancelAction: isTooLargeError ? null : cancelAction,
                                okAction: isClientError ? reloadWindowAction : null,
                                retryAction: isClientError ? null : function () { return reTry(); }
                            })
                                .done(deferred.resolve)
                                .fail(function () {
                                deferred.reject(jqXhr, textStatus, thrownError);
                            });
                        };
                        var buildRequestUrl = function (token) {
                            return DataCatalog.Core.Utilities.stringFormat(configurationManager.getADCEndpoint(), jwt.decode(token).tid, _this.catalogName, url);
                        };
                        Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("pre ajax call ({0})", urlAction), { url: url, settings: settings, correlationId: correlationId });
                        authenticationManager.getAccessTokenADC().then(function (token) {
                            $.ajax(buildRequestUrl(token), $.extend({
                                beforeSend: function (xhr, settings) {
                                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                                }
                            }, settings))
                                .done(function () {
                                Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("successful ajax call ({0})", urlAction), { correlationId: correlationId });
                            })
                                .done(deferred.resolve)
                                .fail(function (jqXhr, textStatus, thrownError) {
                                if (jqXhr.status === DataCatalog.Core.Constants.HttpStatusCodes.UNAUTHORIZED || jqXhr.status === DataCatalog.Core.Constants.HttpStatusCodes.FORBIDDEN) {
                                    var tryToReAuth = onUnauthorized ? onUnauthorized : reAuth;
                                    tryToReAuth(correlationId)
                                        .done(function () {
                                        tryToUpdateCsrf()
                                            .always(function () {
                                            Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("attempting ajax call again after auth refresh ({0})", urlAction), { url: url, settings: settings, correlationId: correlationId });
                                            reTry()
                                                .then(deferred.resolve, onFailure);
                                            deferred.done(function () {
                                                Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("successful ajax call after auth and csrf refresh ({0})", urlAction), { correlationId: correlationId });
                                            });
                                        });
                                    });
                                }
                                else if (Math.floor(jqXhr.status / 100) === 5) {
                                    reTry()
                                        .then(deferred.resolve, onFailure);
                                }
                                else {
                                    onFailure(jqXhr, textStatus, thrownError);
                                }
                            })
                                .always(function (jqXhr, textStatus, jqXhr2) {
                                jqXhr = jqXhr || {};
                                jqXhr2 = jqXhr2 || {};
                                var status = jqXhr.status || jqXhr2.status;
                                var statusText = jqXhr.statusText || jqXhr2.statusText;
                                Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("ajax call complete ({0}) {1} - {2}", urlAction, status, statusText), { correlationId: correlationId, textStatus: textStatus });
                            });
                        });
                        deferred.fail(function (jqueryXhr) {
                            var isError = jqueryXhr && Math.floor(jqueryXhr.status / 100) === 5;
                            _this.logAjaxError(jqueryXhr, { url: url, settings: settings, correlationId: correlationId }, !isError);
                        });
                        return deferred.promise();
                    };
                    BaseService.allSettled = function (promises) {
                        promises = promises || [];
                        var internalPromises = [];
                        var outerDeferred = $.Deferred();
                        var results = new Array(promises.length);
                        $.each(promises, function (i, promise) {
                            var innerDeferred = $.Deferred();
                            promise
                                .done(function (v) {
                                results[i] = {
                                    state: "fulfilled",
                                    value: v
                                };
                            })
                                .fail(function (r) {
                                results[i] = {
                                    state: "failed",
                                    reason: r
                                };
                            })
                                .always(function () {
                                outerDeferred.notify(results[i]);
                                innerDeferred.resolve();
                            });
                            var innerPromise = innerDeferred.promise();
                            internalPromises.push(innerPromise);
                        });
                        $.when.apply($, internalPromises)
                            .done(function () { outerDeferred.resolve(results); });
                        return outerDeferred.promise();
                    };
                    BaseService.useMock = true;
                    BaseService.catalogName = "DefaultCatalog";
                    return BaseService;
                })();
                Services.BaseService = BaseService;
            })(Services = DataCatalog.Services || (DataCatalog.Services = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Services;
            (function (Services) {
                var CatalogService = (function (_super) {
                    __extends(CatalogService, _super);
                    function CatalogService() {
                        _super.apply(this, arguments);
                    }
                    CatalogService.createCatalogEntry = function (typeName, body) {
                        var url = DataCatalog.Core.Utilities.stringFormat("/views/{0}?api-version={1}", encodeURIComponent(typeName), CatalogService.API_VERSION);
                        var deferred = $.Deferred();
                        this.ajax(url, { method: "POST", data: this.stringify(body), contentType: "application/json" })
                            .done(function (data, textStatus, jqXhr) {
                            var location = jqXhr.getResponseHeader("Location");
                            deferred.resolve(location);
                        })
                            .fail(deferred.reject);
                        return deferred.promise();
                    };
                    CatalogService.updateDocumentation = function (containerId, documentation, viewRebinder) {
                        var _this = this;
                        var baseUrl = "/views/{0}?api-version={1}";
                        var method = "", url = "";
                        if (documentation.__id) {
                            method = "PUT";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(documentation.__id), CatalogService.API_VERSION);
                        }
                        else {
                            method = "POST";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/documentation"), CatalogService.API_VERSION);
                        }
                        var doc = ko.toJS(documentation);
                        delete doc.__creatorId;
                        delete doc.__effectiveRights;
                        delete doc.__type;
                        delete doc.experts;
                        var previousModifiedTime = doc.modifiedTime;
                        doc.modifiedTime = documentation.modifiedTime = new Date().toISOString();
                        var logData = $.extend({}, doc);
                        Services.logger.logInfo("Update documentation", { data: logData });
                        return this.ajax(url, { method: method, data: JSON.stringify(doc), contentType: "application/json" }, function () {
                            documentation.modifiedTime = previousModifiedTime;
                            if (!documentation.__id) {
                                documentation.content("");
                                viewRebinder();
                                return $.Deferred().resolve().promise();
                            }
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(documentation.__id));
                            return _this.ajax(url, { method: "GET" })
                                .done(function (response) {
                                documentation.content(response.content);
                                documentation.modifiedTime = response.modifiedTime;
                                viewRebinder();
                            });
                        })
                            .done(function (data, textStatus, jqXhr) {
                            Services.logger.logInfo("Update documentation complete", { data: logData });
                            // Get location from headers if this was a POST
                            var location = jqXhr.getResponseHeader("Location");
                            if (location && !documentation.__id) {
                                documentation.__id = location;
                            }
                        });
                    };
                    CatalogService.updateAccessInstruction = function (containerId, accessInstruction, viewRebinder) {
                        var _this = this;
                        var baseUrl = "/views/{0}?api-version={1}";
                        var method = "", url = "";
                        if (accessInstruction.__id) {
                            method = "PUT";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(accessInstruction.__id), CatalogService.API_VERSION);
                        }
                        else {
                            method = "POST";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/accessInstructions"), CatalogService.API_VERSION);
                        }
                        var ai = ko.toJS(accessInstruction);
                        delete ai.__effectiveRights;
                        delete ai.__roles;
                        delete ai.__type;
                        var previousModifiedTime = ai.modifiedTime;
                        ai.modifiedTime = accessInstruction.modifiedTime = new Date().toISOString();
                        var logData = $.extend({}, ai);
                        delete logData.__creatorId;
                        Services.logger.logInfo("Update access instruction", { data: logData });
                        return this.ajax(url, { method: method, data: this.stringify(ai), contentType: "application/json" }, function () {
                            accessInstruction.modifiedTime = previousModifiedTime;
                            if (!accessInstruction.__id) {
                                accessInstruction.content = "";
                                viewRebinder();
                                return $.Deferred().resolve().promise();
                            }
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(accessInstruction.__id));
                            return _this.ajax(url, { method: "GET" })
                                .done(function (response) {
                                accessInstruction.content = response.content;
                                accessInstruction.modifiedTime = response.modifiedTime;
                                viewRebinder();
                            });
                        })
                            .done(function (data, textStatus, jqXhr) {
                            Services.logger.logInfo("Update access instruction complete", { data: logData });
                            // Get location from headers if this was a POST
                            var location = jqXhr.getResponseHeader("Location");
                            if (location && !accessInstruction.__id) {
                                accessInstruction.__id = location;
                            }
                        });
                    };
                    CatalogService.updateUserDescription = function (containerId, desc, viewRebinder) {
                        var _this = this;
                        var baseUrl = "/views/{0}?api-version={1}";
                        var method = "", url = "";
                        if (desc.__id) {
                            method = "PUT";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(desc.__id), CatalogService.API_VERSION);
                        }
                        else {
                            method = "POST";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/descriptions"), CatalogService.API_VERSION);
                        }
                        var previousModifiedTime = desc.modifiedTime();
                        desc.modifiedTime(new Date().toISOString());
                        var description = {
                            friendlyName: desc.friendlyName(),
                            description: desc.description(),
                            tags: desc.tags(),
                            modifiedTime: desc.modifiedTime(),
                            __creatorId: desc.__creatorId
                        };
                        var logData = $.extend({}, description);
                        delete logData.__creatorId;
                        Services.logger.logInfo("Update description", { data: logData });
                        return this.ajax(url, { method: method, data: this.stringify(description), contentType: "application/json" }, function () {
                            desc.modifiedTime(previousModifiedTime);
                            if (!desc.__id) {
                                desc.friendlyName("");
                                desc.description("");
                                desc.tags([]);
                                viewRebinder();
                                return $.Deferred().resolve().promise();
                            }
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(desc.__id));
                            return _this.ajax(url, { method: "GET" })
                                .done(function (response) {
                                desc.friendlyName(response.friendlyName);
                                desc.description(response.description);
                                desc.tags(response.tags);
                                viewRebinder();
                            });
                        })
                            .done(function (data, textStatus, jqXhr) {
                            Services.logger.logInfo("Update description complete", { data: logData });
                            // Get location from headers if this was a POST
                            var location = jqXhr.getResponseHeader("Location");
                            if (location && !desc.__id) {
                                desc.__id = location;
                            }
                        });
                    };
                    CatalogService.updateUserExperts = function (containerId, bindableExpert, viewRebinder) {
                        var _this = this;
                        var baseUrl = "/views/{0}?api-version={1}";
                        var method = "", url = "";
                        if (bindableExpert.__id) {
                            method = "PUT";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(bindableExpert.__id), CatalogService.API_VERSION);
                        }
                        else {
                            method = "POST";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/experts"), CatalogService.API_VERSION);
                        }
                        var expert = {
                            experts: bindableExpert.experts() || [],
                            modifiedTime: new Date().toISOString(),
                            __creatorId: $tokyo.user.email
                        };
                        var logData = $.extend({}, expert);
                        delete logData.__creatorId;
                        Services.logger.logInfo("Update expert", { data: logData });
                        var previousModifiedTime = bindableExpert.modifiedTime();
                        bindableExpert.modifiedTime(new Date().toISOString());
                        return this.ajax(url, { method: method, data: this.stringify(expert), contentType: "application/json" }, function () {
                            bindableExpert.modifiedTime(previousModifiedTime);
                            if (!bindableExpert.__id) {
                                bindableExpert.experts([]);
                                viewRebinder();
                                return $.Deferred().resolve().promise();
                            }
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(bindableExpert.__id));
                            return _this.ajax(url, { method: "GET" })
                                .done(function (response) {
                                bindableExpert.experts(response.experts);
                                viewRebinder();
                            });
                        })
                            .done(function (data, textStatus, jqXhr) {
                            Services.logger.logInfo("Update expert complete", { data: logData });
                            // Get location from headers if this was a POST
                            var location = jqXhr.getResponseHeader("Location");
                            if (location && !bindableExpert.__id) {
                                bindableExpert.__id = location;
                            }
                        });
                    };
                    CatalogService.updateUserSchemaDescription = function (containerId, bindableSchemaDesc, viewRebinder) {
                        var _this = this;
                        var baseUrl = "/views/{0}?api-version={1}";
                        var method = "", url = "";
                        if (bindableSchemaDesc.__id) {
                            method = "PUT";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(bindableSchemaDesc.__id), CatalogService.API_VERSION);
                        }
                        else {
                            method = "POST";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/schemaDescriptions"), CatalogService.API_VERSION);
                        }
                        bindableSchemaDesc.modifiedTime(new Date().toISOString());
                        var schemaDescription = {
                            __id: bindableSchemaDesc.__id,
                            __creatorId: $tokyo.user.email,
                            modifiedTime: bindableSchemaDesc.modifiedTime(),
                            columnDescriptions: []
                        };
                        $.each(bindableSchemaDesc.columnDescriptions || [], function (i, columnDesc) {
                            schemaDescription.columnDescriptions.push({
                                tags: columnDesc.tags(),
                                description: columnDesc.description(),
                                columnName: columnDesc.columnName
                            });
                        });
                        var logData = $.extend({}, schemaDescription);
                        delete logData.__creatorId;
                        Services.logger.logInfo("Update schema description", { data: logData });
                        return this.ajax(url, { method: method, data: this.stringify(schemaDescription), contentType: "application/json" }, function () {
                            if (!bindableSchemaDesc.__id) {
                                (bindableSchemaDesc.columnDescriptions || []).forEach(function (cd) {
                                    cd.tags([]);
                                    cd.description("");
                                });
                                viewRebinder();
                                return $.Deferred().resolve().promise();
                            }
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(bindableSchemaDesc.__id));
                            return _this.ajax(url, { method: "GET" })
                                .done(function (response) {
                                (response.columnDescriptions || []).forEach(function (cd) {
                                    var columnName = cd.columnName;
                                    var bindableColumn = bindableSchemaDesc.getBindableColumnByName(columnName);
                                    if (bindableColumn) {
                                        bindableColumn.tags(cd.tags);
                                        bindableColumn.description(cd.description);
                                    }
                                });
                                viewRebinder();
                            });
                        })
                            .done(function (data, textStatus, jqXhr) {
                            Services.logger.logInfo("Update schema description complete", { data: logData });
                            // Get location from headers if this was a POST
                            var location = jqXhr.getResponseHeader("Location");
                            if (location) {
                                bindableSchemaDesc.__id = location;
                            }
                        });
                    };
                    CatalogService.updateSchema = function (containerId, bindableSchema, viewRebinder) {
                        var baseUrl = "/views/{0}?api-version={1}";
                        var method = "";
                        var url = "";
                        if (bindableSchema.__id && bindableSchema.__id !== undefined) {
                            method = "PUT";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(bindableSchema.__id), CatalogService.API_VERSION);
                        }
                        else {
                            method = "POST";
                            url = DataCatalog.Core.Utilities.stringFormat(baseUrl, encodeURIComponent(containerId + "/schemas"), CatalogService.API_VERSION);
                        }
                        bindableSchema.modifiedTime = new Date().toISOString();
                        var schema = {
                            __id: bindableSchema.__id,
                            __creatorId: bindableSchema.__creatorId || $tokyo.user.email,
                            modifiedTime: bindableSchema.modifiedTime,
                            columns: []
                        };
                        $.each(bindableSchema.columns || [], function (i, column) {
                            if ($.trim(column.name) !== "") {
                                schema.columns.push({
                                    name: column.name,
                                    type: column.type
                                });
                            }
                        });
                        var logData = $.extend({}, schema);
                        delete logData.__creatorId;
                        Services.logger.logInfo("Update schema", { data: logData });
                        return this.ajax(url, { method: method, data: this.stringify(schema), contentType: "application/json" }, function () {
                            return $.Deferred().resolve().promise();
                        })
                            .done(function (data, textStatus, jqXhr) {
                            Services.logger.logInfo("Update schema complete", { data: logData });
                            var location = jqXhr.getResponseHeader("Location");
                            if (location) {
                                bindableSchema.__id = location;
                            }
                        });
                    };
                    CatalogService.deleteAssets = function (ids) {
                        var _this = this;
                        var outerDeferred = $.Deferred();
                        var promises = [];
                        var failedIds = [];
                        $.each(ids, function (i, id) {
                            var url = DataCatalog.Core.Utilities.stringFormat("/views/{0}?api-version={1}", encodeURIComponent(id), CatalogService.API_VERSION);
                            var promise = _this.ajax(url, { method: "DELETE" });
                            promises.push(promise);
                        });
                        this.allSettled(promises)
                            .progress(function () {
                            outerDeferred.notify();
                        })
                            .done(function (results) {
                            $.each(results, function (i, result) {
                                if (result.state !== "fulfilled") {
                                    failedIds.push(ids[i]);
                                }
                            });
                            outerDeferred.resolve(failedIds);
                        });
                        return outerDeferred.promise();
                    };
                    CatalogService.saveBatchChanges = function (propertyChanges, schemaChanges, authChanges, assets, viewRebinder) {
                        var _this = this;
                        var deferred = $.Deferred();
                        var promises = [];
                        (assets || []).forEach(function (asset) {
                            var foundDescChange = false;
                            var foundExpertChange = false;
                            var foundSchemaChange = false;
                            var foundAccessInstructionChange = false;
                            var myAccessInstruction = DataCatalog.Core.Utilities.arrayFirst(asset.accessInstructions.filter(function (ai) { return ai.__creatorId === $tokyo.user.email; }));
                            var myDesc = DataCatalog.Core.Utilities.arrayFirst(asset.descriptions().filter(function (d) { return d.__creatorId === $tokyo.user.email; }));
                            var myExpert = DataCatalog.Core.Utilities.arrayFirst(asset.experts().filter(function (d) { return d.__creatorId === $tokyo.user.email; }));
                            var mySchemaDesc = asset.schemaDescription;
                            if (propertyChanges.description !== undefined) {
                                myDesc.description(propertyChanges.description);
                                foundDescChange = true;
                            }
                            if (propertyChanges.tagsToAdd) {
                                var tagPreCount = myDesc.tags().length;
                                var tagsToAddHere = DataCatalog.Core.Utilities.arrayExcept(propertyChanges.tagsToAdd, myDesc.tags(), function (a, b) {
                                    return $.trim(a.toLowerCase()) === $.trim(b.toLowerCase());
                                });
                                myDesc.tags(DataCatalog.Core.Utilities.arrayDistinct(tagsToAddHere.concat(myDesc.tags())));
                                foundDescChange = foundDescChange || (tagPreCount < myDesc.tags().length);
                            }
                            if (propertyChanges.tagsToRemove) {
                                var removedTags = myDesc.tags.removeAll(propertyChanges.tagsToRemove);
                                foundDescChange = foundDescChange || (removedTags.length > 0);
                            }
                            if (propertyChanges.expertsToAdd) {
                                var expertPreCount = myExpert.experts().length;
                                var expertsToAddHere = DataCatalog.Core.Utilities.arrayExcept(propertyChanges.expertsToAdd, myExpert.experts(), function (a, b) {
                                    return $.trim(a.toLowerCase()) === $.trim(b.toLowerCase());
                                });
                                myExpert.experts(DataCatalog.Core.Utilities.arrayDistinct(expertsToAddHere.concat(myExpert.experts())));
                                foundExpertChange = foundExpertChange || (expertPreCount < myExpert.experts().length);
                            }
                            if (propertyChanges.expertsToRemove) {
                                var removedExperts = myExpert.experts.removeAll(propertyChanges.expertsToRemove);
                                foundExpertChange = foundExpertChange || (removedExperts.length > 0);
                            }
                            if (propertyChanges.requestAccess !== myAccessInstruction.content) {
                                myAccessInstruction.content = propertyChanges.requestAccess;
                                foundAccessInstructionChange = true;
                            }
                            schemaChanges.forEach(function (sc) {
                                var myColumnDesc = mySchemaDesc.getBindableColumnByName(sc.columnName);
                                if (sc.tagsToAdd) {
                                    var schemaTagPreCount = myColumnDesc.tags().length;
                                    myColumnDesc.tags(DataCatalog.Core.Utilities.arrayDistinct(sc.tagsToAdd.concat(myColumnDesc.tags())));
                                    foundSchemaChange = foundSchemaChange || (schemaTagPreCount < myColumnDesc.tags().length);
                                }
                                if (sc.tagsToRemove) {
                                    var schemaDescRemovedTags = myColumnDesc.tags.removeAll(sc.tagsToRemove);
                                    foundSchemaChange = foundSchemaChange || (schemaDescRemovedTags.length > 0);
                                }
                                if ((sc.description || "") !== myColumnDesc.description()) {
                                    foundSchemaChange = true;
                                    myColumnDesc.description(sc.description || "");
                                }
                            });
                            if (foundDescChange) {
                                asset.metadataLastUpdated(new Date());
                                asset.metadataLastUpdatedBy($tokyo.user.email);
                                var descPromise = _this.updateUserDescription(asset.__id, myDesc, viewRebinder);
                                promises.push(descPromise);
                            }
                            if (foundExpertChange) {
                                asset.metadataLastUpdated(new Date());
                                asset.metadataLastUpdatedBy($tokyo.user.email);
                                var expertPromise = _this.updateUserExperts(asset.__id, myExpert, viewRebinder);
                                promises.push(expertPromise);
                            }
                            if (foundSchemaChange) {
                                asset.metadataLastUpdated(new Date());
                                asset.metadataLastUpdatedBy($tokyo.user.email);
                                var schemaDescPromise = _this.updateUserSchemaDescription(asset.__id, mySchemaDesc, viewRebinder);
                                promises.push(schemaDescPromise);
                            }
                            if (foundAccessInstructionChange) {
                                asset.metadataLastUpdated(new Date());
                                asset.metadataLastUpdatedBy($tokyo.user.email);
                                var accessInstructionPromise = _this.updateAccessInstruction(asset.__id, myAccessInstruction, viewRebinder);
                                promises.push(accessInstructionPromise);
                            }
                            var authResult = _this.applyAuthChanges(authChanges, asset, viewRebinder);
                            if (authResult.foundChange) {
                                promises.push(authResult.promise);
                            }
                        });
                        this.allSettled(promises).done(function (results) {
                            deferred.resolve(results);
                        });
                        return deferred.promise();
                    };
                    CatalogService.applyAuthChanges = function (authChanges, asset, viewRebinder) {
                        var foundChange = false;
                        var promise = null;
                        if (authChanges.visibility === "All" && asset.__permissions()) {
                            // Updating visibility to all
                            var removedReadPermissions = false;
                            // Remove all "Read" rights
                            asset.__permissions().forEach(function (p) {
                                removedReadPermissions = !!(p.rights.remove(function (r) { return r.right === "Read"; }) || []).length;
                            });
                            if (removedReadPermissions) {
                                foundChange = true;
                            }
                            // Remove all permissions without any rights
                            var newPermissions = asset.__permissions().filter(function (p) { return p.rights().length > 0; });
                            asset.__permissions(newPermissions);
                        }
                        if (authChanges.visibility === "Some") {
                            if (!asset.__permissions()) {
                                asset.__permissions([]);
                            }
                            var foundReadPermission = false;
                            asset.__permissions().forEach(function (p) {
                                var hasReadPermission = p.rights().some(function (r) { return r.right === "Read"; });
                                if (hasReadPermission) {
                                    foundReadPermission = true;
                                }
                            });
                            if (!foundReadPermission) {
                                foundChange = true;
                                asset.__permissions.push({
                                    rights: ko.observableArray([{ right: "Read" }]),
                                    principal: {
                                        objectId: DataCatalog.Core.Constants.Users.NOBODY,
                                        upn: DataCatalog.Core.Constants.Users.NOBODY
                                    }
                                });
                            }
                        }
                        var owners = DataCatalog.Core.Utilities.arrayFirst(asset.__roles().filter(function (r) { return r.role === "Owner"; }));
                        (authChanges.ownersToAdd || []).forEach(function (o) {
                            if (owners && owners.members && owners.members()) {
                                var preExistingOwner = DataCatalog.Core.Utilities.arrayFirst(owners.members().filter(function (m) { return m.objectId === o.objectId; }));
                                if (!preExistingOwner) {
                                    foundChange = true;
                                    owners.members.push({
                                        upn: o.upn,
                                        objectId: o.objectId
                                    });
                                }
                            }
                            else {
                                if (!owners) {
                                    owners = {
                                        role: "Owner",
                                        members: ko.observableArray([])
                                    };
                                    asset.__roles.push(owners);
                                }
                                foundChange = true;
                                owners.members.push({
                                    upn: o.upn,
                                    objectId: o.objectId
                                });
                            }
                        });
                        (authChanges.ownersToRemove || []).forEach(function (o) {
                            if (owners && owners.members && owners.members()) {
                                var removedOwner = !!(owners.members.remove(function (m) { return m.objectId === o.objectId; }) || []).length;
                                if (removedOwner) {
                                    foundChange = true;
                                }
                            }
                        });
                        (authChanges.usersToAdd || []).forEach(function (u) {
                            if (!asset.__permissions()) {
                                asset.__permissions([]);
                            }
                            var userPerms = DataCatalog.Core.Utilities.arrayFirst(asset.__permissions().filter(function (p) { return p.principal.objectId === u.objectId; }));
                            if (userPerms && !DataCatalog.Core.Utilities.arrayFirst(userPerms.rights().filter(function (r) { return r.right === "Read"; }))) {
                                foundChange = true;
                                userPerms.rights.push({ right: "Read" });
                            }
                            else if (!userPerms) {
                                foundChange = true;
                                asset.__permissions.push({
                                    rights: ko.observableArray([{ right: "Read" }]),
                                    principal: {
                                        objectId: u.objectId,
                                        upn: u.upn
                                    }
                                });
                            }
                        });
                        (authChanges.usersToRemove || []).forEach(function (u) {
                            if (asset.__permissions()) {
                                // Remove "Read" rights from user
                                asset.__permissions().filter(function (p) { return p.principal.objectId === u.objectId; }).forEach(function (p) {
                                    var removedRight = p.rights.remove(function (r) { return r.right === "Read"; });
                                    if (removedRight) {
                                        foundChange = true;
                                    }
                                });
                                // Remove all permissions without any rights
                                var newPermissions = asset.__permissions().filter(function (p) { return p.rights().length > 0; });
                                asset.__permissions(newPermissions);
                            }
                        });
                        if (foundChange) {
                            var permissions = ko.toJS(asset.__permissions());
                            var roles = ko.toJS(asset.__roles());
                            promise = this.updateRolesAndPermissions(asset, roles, permissions, viewRebinder);
                        }
                        return {
                            foundChange: foundChange,
                            promise: promise
                        };
                    };
                    CatalogService.updateRolesAndPermissions = function (asset, roles, permissions, viewRebinder) {
                        var _this = this;
                        var url = DataCatalog.Core.Utilities.stringFormat("api/catalog?idPath={0}", encodeURIComponent(asset.__id));
                        var deferred = $.Deferred();
                        // Go get the asset to do a diff on properties so as to only update those that have changed
                        this.ajax(url, { method: "GET" })
                            .done(function (result) {
                            var rolesAndPermissions = {
                                // Only update Owner roles
                                __roles: (roles || []).filter(function (r) { return r.role === "Owner"; }),
                                __permissions: permissions || []
                            };
                            //#region Diff check roles
                            var existingOwners = [];
                            (result.__roles || []).forEach(function (r) {
                                if (r.role === "Owner") {
                                    (r.members || []).forEach(function (m) {
                                        $.trim(m.objectId) && existingOwners.push(m.objectId);
                                    });
                                }
                            });
                            var newOwners = [];
                            rolesAndPermissions.__roles.forEach(function (r) {
                                if (r.role === "Owner") {
                                    (r.members || []).forEach(function (m) {
                                        $.trim(m.objectId) && newOwners.push(m.objectId);
                                    });
                                }
                            });
                            // Tidy up
                            existingOwners = DataCatalog.Core.Utilities.arrayDistinct(existingOwners.map($.trim)).sort();
                            newOwners = DataCatalog.Core.Utilities.arrayDistinct(newOwners.map($.trim)).sort();
                            // If there is no change, delete the __roles
                            var existingOwnersString = existingOwners.join(";");
                            var newOwnersString = newOwners.join(";");
                            if (existingOwnersString === newOwnersString) {
                                // No change
                                delete rolesAndPermissions.__roles;
                            }
                            //#endregion
                            //#region Diff check permissions
                            var existingReaders = [];
                            (result.__permissions || []).forEach(function (p) {
                                var hasReadPermission = (p.rights || []).some(function (r) { return r.right === "Read"; });
                                if (hasReadPermission) {
                                    p.principal && $.trim(p.principal.objectId) && existingReaders.push(p.principal.objectId);
                                }
                            });
                            var newReaders = [];
                            rolesAndPermissions.__permissions.forEach(function (p) {
                                var hasReadPermission = (p.rights || []).some(function (r) { return r.right === "Read"; });
                                if (hasReadPermission) {
                                    p.principal && $.trim(p.principal.objectId) && newReaders.push(p.principal.objectId);
                                }
                            });
                            // Tidy up
                            existingReaders = DataCatalog.Core.Utilities.arrayDistinct(existingReaders.map($.trim)).sort();
                            newReaders = DataCatalog.Core.Utilities.arrayDistinct(newReaders.map($.trim)).sort();
                            // If there is no change, delete the __permissions
                            var existingReadersString = existingReaders.join(";");
                            var newReadersString = newReaders.join(";");
                            if (existingReadersString === newReadersString) {
                                // No change
                                delete rolesAndPermissions.__permissions;
                            }
                            //#endregion
                            if (!rolesAndPermissions.__roles && !rolesAndPermissions.__permissions) {
                                // No changes at all, this is odd.
                                Services.logger.logInfo("Call to update roles and permission, but no changes found.", { data: asset.__id });
                                deferred.resolve();
                            }
                            else {
                                Services.logger.logInfo("Updating roles and permissions", { data: asset.__id });
                                _this.ajax(url, { method: "PUT", data: _this.stringify(rolesAndPermissions), contentType: "application/json" }, function () {
                                    asset.__roles((result.__roles || []).map(function (r) { return new DataCatalog.Models.BindableRole(r); }));
                                    asset.__permissions((result.__permissions || []).map(function (p) { return new DataCatalog.Models.BindablePermission(p); }));
                                    viewRebinder();
                                    return $.Deferred().resolve().promise();
                                })
                                    .done(function () {
                                    // Now go get the updated effective rights
                                    _this.ajax(url, { method: "GET" })
                                        .done(function (result) {
                                        Services.logger.logInfo("Getting updated effective rights", { data: asset.__id });
                                        var effectiveRights = (result || { __effectiveRights: null }).__effectiveRights;
                                        // Apply the updated effective rights to the asset
                                        asset.__effectiveRights(effectiveRights);
                                        deferred.resolve(effectiveRights);
                                    })
                                        .fail(deferred.reject);
                                })
                                    .fail(deferred.reject);
                            }
                        })
                            .fail(deferred.reject);
                        return deferred.promise();
                    };
                    CatalogService.getAsset = function (id, cancelAction, showModalOnError, onUnauthorized) {
                        var url = DataCatalog.Core.Utilities.stringFormat("api/catalog?idPath={0}", encodeURIComponent(id));
                        return this.ajax(url, { method: "GET" }, cancelAction, showModalOnError, onUnauthorized);
                    };
                    CatalogService.API_VERSION = "2015-07.1.0-Preview";
                    return CatalogService;
                })(Services.BaseService);
                Services.CatalogService = CatalogService;
            })(Services = DataCatalog.Services || (DataCatalog.Services = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Services;
            (function (Services) {
                var ConnectService = (function (_super) {
                    __extends(ConnectService, _super);
                    function ConnectService() {
                        _super.apply(this, arguments);
                    }
                    ConnectService.getConnectionTypes = function (dataEntity) {
                        var entity = dataEntity || {};
                        var dsl = entity.dsl || {};
                        var protocol = DataCatalog.Core.Utilities.plainText(dsl.protocol || "");
                        if (entity.DataSourceType === DataCatalog.Models.DataSourceType.Container && entity.dsl.protocol !== "analysis-services") {
                            return [];
                        }
                        if (entity.dataSource && entity.dataSource.sourceType === "Azure Data Lake Store" && entity.dsl.protocol === "webhdfs") {
                            return [];
                        }
                        return $tokyo.applications
                            .filter(function (a) { return a.protocols.some(function (b) { return b === protocol; }); })
                            .map(function (c) {
                            var text = DataCatalog.Core.Resx[DataCatalog.Core.Utilities.stringFormat("{0}_{1}_{2}", c.applicationId, c.limit, protocol)] ||
                                DataCatalog.Core.Resx[DataCatalog.Core.Utilities.stringFormat("{0}_{1}", c.applicationId, c.limit)] ||
                                DataCatalog.Core.Resx[DataCatalog.Core.Utilities.stringFormat("{0}_{2}", c.applicationId, protocol)] ||
                                DataCatalog.Core.Resx[DataCatalog.Core.Utilities.stringFormat("{0}_", c.applicationId)];
                            if (!text) {
                                Services.logger.logWarning("no text found for connect to option", c);
                                text = c.applicationId;
                            }
                            return $.extend({ text: text }, c);
                        });
                    };
                    ConnectService.connect = function (dataEntity, data) {
                        var dataEntityString = JSON.stringify(dataEntity);
                        dataEntity = JSON.parse(DataCatalog.Core.Utilities.plainText(dataEntityString));
                        Services.logger.logInfo(DataCatalog.Core.Utilities.stringFormat("connect to data source executed ({0})", data.applicationId), {
                            id: dataEntity.__id,
                            applicationId: data.applicationId,
                            limit: data.limit,
                            name: dataEntity.name,
                            dsl: dataEntity.dsl
                        });
                        if (dataEntity.dsl.protocol === "reporting-services") {
                            var reportingServicesUrl = DataCatalog.Core.Utilities.stringFormat("{0}?{1}&rs:Command=Render", dataEntity.dsl.address.server, encodeURIComponent(dataEntity.dsl.address.path));
                            window.open(reportingServicesUrl, "_blank");
                        }
                        else if (dataEntity.dsl.address.url) {
                            window.open(dataEntity.dsl.address.url, "_blank");
                        }
                        else if (dataEntity.dsl.address.path) {
                            window.open(dataEntity.dsl.address.path, "_blank");
                        }
                        else if (data.applicationId === "ssdt") {
                            var vsWebUriTemplate = "vsweb://vs/?product=Visual_Studio&encformat=UTF8&sqldbaction={0}";
                            var authentication = /sql/i.test(dataEntity.dsl.authentication || "sql") ? "sql" : "integrated";
                            var queryString = DataCatalog.Core.Utilities.stringFormat("action=connect&authentication={0}&server={1}&Database={2}", authentication, dataEntity.dsl.address.server, dataEntity.dsl.address.database);
                            var base64EncodedString = btoa(queryString);
                            window.open(DataCatalog.Core.Utilities.stringFormat(vsWebUriTemplate, base64EncodedString), "_self");
                        }
                        else {
                            var token = $("body > input[name='__RequestVerificationToken']").val();
                            var connectFormId = "connect-form";
                            $("#" + connectFormId).remove();
                            var form = $("<form>")
                                .attr("id", connectFormId)
                                .attr("method", "POST")
                                .attr("action", "\connect")
                                .attr("target", "_self")
                                .append($("<input type='hidden'>").attr("name", "__RequestVerificationToken").attr("value", token), $("<input type='hidden'>").attr("name", "applicationId").attr("value", data.applicationId), $("<input type='hidden'>").attr("name", "limitRows").attr("value", data.limit), $("<input type='hidden'>").attr("name", "id").attr("value", dataEntity.__id), $("<input type='hidden'>").attr("name", "tenantDirectory").attr("value", $tokyo.user.tenantDirectory))
                                .appendTo("body");
                            this.ensureAuth().done(function () {
                                form.submit();
                            });
                        }
                    };
                    return ConnectService;
                })(Services.BaseService);
                Services.ConnectService = ConnectService;
            })(Services = DataCatalog.Services || (DataCatalog.Services = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
//import logger = require("../services/loggingService");
//import util = require("../core/utilities");
//import modalService = require("../services/modalService");
"use strict";
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Services;
            (function (Services) {
                var ErrorService = (function () {
                    function ErrorService() {
                    }
                    ErrorService.addError = function (error) {
                        var deferred = $.Deferred();
                        this._errorQueue.push({
                            deferred: deferred,
                            errorNotice: error
                        });
                        this._checkQueue();
                        return deferred.promise();
                    };
                    ErrorService._checkQueue = function () {
                        var _this = this;
                        var nextError = this._errorQueue.shift();
                        if (nextError) {
                            if (Services.ModalService.isShowing()) {
                                // If the modal is showing, but it isn't an error, force it closed to show the error
                                if (!this._isShowingError) {
                                    Services.ModalService.forceClose();
                                }
                                var interval = setInterval(function () {
                                    if (!Services.ModalService.isShowing()) {
                                        clearInterval(interval);
                                        _this._proccessError(nextError);
                                    }
                                }, 250);
                            }
                            else {
                                this._proccessError(nextError);
                            }
                        }
                    };
                    ErrorService._proccessError = function (errorEntry) {
                        var _this = this;
                        var error = errorEntry.errorNotice;
                        var deferred = errorEntry.deferred;
                        this._isShowingError = true;
                        var buttons = [];
                        if (error.retryAction) {
                            buttons.push({
                                id: "retry",
                                text: DataCatalog.Core.Resx.retry,
                                isDefault: false
                            });
                        }
                        if (error.okAction) {
                            buttons.push({
                                id: "ok",
                                text: DataCatalog.Core.Resx.ok,
                                isDefault: false
                            });
                        }
                        buttons.push({
                            id: "cancel",
                            text: DataCatalog.Core.Resx.cancel,
                            isDefault: true
                        });
                        Services.ModalService.show({
                            bodyText: error.bodyText,
                            title: error.title || DataCatalog.Core.Resx.anErrorHasOccurred,
                            hideCancelButton: true,
                            buttons: buttons
                        })
                            .done(function (modal) {
                            if (modal.button() === "retry") {
                                error.retryAction()
                                    .done(function () {
                                    modal.close();
                                    deferred.resolve.apply(deferred, arguments);
                                })
                                    .fail(function () {
                                    _this._errorQueue.push(errorEntry);
                                })
                                    .always(function () {
                                    modal.close();
                                    _this._isShowingError = false;
                                    _this._checkQueue();
                                });
                            }
                            if (modal.button() === "ok") {
                                var okAction = error.okAction || (function () { return $.Deferred().resolve().promise(); });
                                okAction()
                                    .always(function () {
                                    deferred.reject();
                                    modal.close();
                                    _this._isShowingError = false;
                                });
                            }
                            if (modal.button() === "cancel") {
                                var cancelAction = error.cancelAction || (function () { return $.Deferred().resolve().promise(); });
                                cancelAction()
                                    .always(function () {
                                    deferred.reject();
                                    modal.close();
                                    _this._isShowingError = false;
                                });
                            }
                        })
                            .fail(function () {
                            deferred.reject();
                            _this._isShowingError = false;
                        });
                    };
                    ErrorService._errorQueue = [];
                    ErrorService._isShowingError = false;
                    return ErrorService;
                })();
                Services.ErrorService = ErrorService;
            })(Services = DataCatalog.Services || (DataCatalog.Services = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
/// <reference path="../../References.d.ts" />
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Services;
            (function (Services) {
                var ModalService = (function () {
                    function ModalService() {
                    }
                    ModalService.show = function (parameters) {
                        var _this = this;
                        if (this._isShowing) {
                            Services.logger.logWarning("must resolve modal prior to opening another", parameters);
                            return $.Deferred().reject().promise();
                        }
                        this._isShowing = true;
                        this.isWorking(false);
                        this.cancelButtonText(DataCatalog.Core.Resx.cancel);
                        this.confirmButtons.removeAll();
                        if (parameters) {
                            this.component(parameters.component);
                            this.bodyText(parameters.bodyText);
                            Services.logger.logInfo("showing modal", parameters);
                            if (parameters.buttons) {
                                this.confirmButtons(parameters.buttons);
                            }
                            else {
                                this.confirmButtons.push({
                                    id: "ok",
                                    text: parameters.confirmButtonText || DataCatalog.Core.Resx.ok,
                                    isDefault: false
                                });
                            }
                            this.title(parameters.title);
                            this.cancelButtonText(parameters.cancelButtonText || DataCatalog.Core.Resx.cancel);
                            this.hideCancelButton(!!parameters.hideCancelButton);
                        }
                        if (this._deferred) {
                            this._deferred.reject();
                        }
                        this._deferred = $.Deferred();
                        // Add the confirm buttons
                        var modalButtons = this.confirmButtons().map(function (button) {
                            return {
                                label: button.text,
                                isPrimary: true,
                                action: function (actions) {
                                    ModalService.onConfirm(button, actions);
                                }
                            };
                        });
                        // If required, add the hide button
                        if (!this.hideCancelButton()) {
                            modalButtons.push({
                                label: this.cancelButtonText(),
                                action: function (actions) {
                                    _this.resetModalService();
                                    actions.remove();
                                }
                            });
                        }
                        // Create the modal parameters
                        var modalViewModel = function () {
                            this.modalService = ModalService;
                        };
                        var modalParams = {
                            header: ModalService.title(),
                            message: '<!-- ko if: modalService.component -->' +
                                '<div data-bind="component: { name: modalService.component, params: {} }"></div>' +
                                '<!-- /ko -->' +
                                '<!-- ko if: modalService.bodyText -->' +
                                '<div data-bind="html: modalService.bodyText"></div>' +
                                '<!-- /ko -->',
                            buttons: modalButtons,
                            viewModel: new modalViewModel,
                            closeCallback: function () { return ModalService.resetModalService(); }
                        };
                        if (parameters.modalContainerClass) {
                            modalParams.modalContainerClass = parameters.modalContainerClass;
                        }
                        // Show the modal
                        this.activeModalActions = Microsoft.DataStudioUX.Managers.ModalManager.show(modalParams);
                        return this._deferred.promise();
                    };
                    ModalService.onConfirm = function (button, modalActions) {
                        var _this = this;
                        var closeDeferred = $.Deferred();
                        this.isWorking(true);
                        this._deferred.resolve({
                            close: function () { closeDeferred.resolve(); },
                            button: function () { return button.id; },
                            reset: function () {
                                Services.logger.logInfo("resetting modal");
                                _this.isWorking(false);
                                _this._deferred = $.Deferred();
                                return _this._deferred.promise();
                            }
                        });
                        closeDeferred
                            .done(function () {
                            Services.logger.logInfo("closing modal");
                            _this.resetModalService();
                            modalActions.remove();
                        })
                            .always(function () {
                            _this.isWorking(false);
                        });
                    };
                    ModalService.resetModalService = function () {
                        this._isShowing = false;
                        if (this._deferred && this._deferred.state() === "pending") {
                            this._deferred.reject();
                        }
                    };
                    ModalService.isShowing = function () {
                        return this._isShowing;
                    };
                    ModalService.forceClose = function () {
                        Services.logger.logInfo("force close modal");
                        this.resetModalService();
                        if (this.activeModalActions && this.activeModalActions.remove) {
                            this.activeModalActions.remove();
                        }
                    };
                    ModalService.component = ko.observable();
                    ModalService.bodyText = ko.observable();
                    ModalService.title = ko.observable();
                    ModalService.isWorking = ko.observable(false);
                    ModalService.cancelButtonText = ko.observable(DataCatalog.Core.Resx.cancel);
                    ModalService.hideCancelButton = ko.observable(false);
                    ModalService.activeModalActions = null;
                    ModalService.confirmButtons = ko.observableArray([]);
                    ModalService._isShowing = false;
                    return ModalService;
                })();
                Services.ModalService = ModalService;
            })(Services = DataCatalog.Services || (DataCatalog.Services = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Services;
            (function (Services) {
                var ProvisioningService = (function (_super) {
                    __extends(ProvisioningService, _super);
                    function ProvisioningService() {
                        _super.apply(this, arguments);
                    }
                    ProvisioningService.executeAsyncPoll = function (asyncFn, keyMapper, pollingEndKey) {
                        var deferred = $.Deferred();
                        var timeout = setTimeout(function () {
                            deferred.reject("timeout");
                        }, 1000 * 60 * 5); // 5 minutes
                        var poll = function () {
                            asyncFn()
                                .done(function (result) {
                                // Treat empty key value as a success
                                if (result && ($.trim(keyMapper(result)) || pollingEndKey).toUpperCase() === pollingEndKey.toUpperCase()) {
                                    clearTimeout(timeout);
                                    deferred.resolve();
                                }
                                else if (deferred.state() === "pending") {
                                    setTimeout(poll, 1500);
                                }
                            })
                                .fail(deferred.reject);
                        };
                        poll();
                        return deferred.promise();
                    };
                    ProvisioningService.onUnauthorized = function (correlationId) {
                        Services.logger.logWarning("arm token expired", { correlationId: correlationId });
                        if (Services.ModalService.isShowing()) {
                            var response = confirm(DataCatalog.Core.Resx.expiredSession);
                            if (response) {
                                window.location.reload();
                            }
                        }
                        else {
                            Services.ModalService.show({ title: DataCatalog.Core.Resx.expiredSessionTitle, bodyText: DataCatalog.Core.Resx.expiredSession })
                                .done(function (modal) {
                                modal.close();
                                window.location.reload();
                            });
                        }
                        return $.Deferred().reject().promise();
                    };
                    ProvisioningService.getSubscriptions = function () {
                        return this.ajax("/api/provisioning/subscriptions", null, null, false, this.onUnauthorized);
                    };
                    ProvisioningService.getLocations = function (subscriptionId) {
                        return this.ajax("/api/provisioning/locations", { data: { subscriptionId: subscriptionId } }, null, false, this.onUnauthorized);
                    };
                    ProvisioningService.registerSubscription = function (subscriptionId) {
                        var _this = this;
                        return this.executeAsyncPoll(function () {
                            return _this.ajax("/api/provisioning/registerSubscription?subscriptionId=" + subscriptionId, { method: "PUT" }, null, false, _this.onUnauthorized);
                        }, function (result) { return result.registrationState; }, "Registered");
                    };
                    ProvisioningService.createResourceGroup = function (subscriptionId, location) {
                        var _this = this;
                        return this.executeAsyncPoll(function () {
                            return _this.ajax(DataCatalog.Core.Utilities.stringFormat("/api/provisioning/createResourceGroup?subscriptionId={0}&location={1}", subscriptionId, location), { method: "PUT" }, null, false, _this.onUnauthorized);
                        }, function (result) { return result.properties.provisioningState; }, "Succeeded");
                    };
                    ProvisioningService.createCatalog = function (catalog) {
                        var _this = this;
                        return this.executeAsyncPoll(function () {
                            return _this.ajax("/api/provisioning/createCatalog", { method: "PUT", data: _this.stringify(catalog), contentType: "application/json" }, null, false, _this.onUnauthorized);
                        }, function (result) { return result.properties.provisioningState; }, "Succeeded");
                    };
                    ProvisioningService.updateCatalog = function (catalog) {
                        var _this = this;
                        return this.executeAsyncPoll(function () {
                            return _this.ajax("/api/provisioning/updateCatalog", { method: "PATCH", data: _this.stringify(catalog), contentType: "application/json" }, null, false, _this.onUnauthorized);
                        }, function (result) { return result.properties.provisioningState; }, "Succeeded");
                    };
                    ProvisioningService.updateCatalogRp = function (catalog) {
                        var _this = this;
                        return this.executeAsyncPoll(function () {
                            return _this.ajax("/api/provisioning/updateCatalogRp", { method: "PATCH", data: _this.stringify(catalog), contentType: "application/json" }, null, false);
                        }, function (result) { return result.properties.provisioningState; }, "Succeeded");
                    };
                    ProvisioningService.deleteCatalog = function (subscriptionId, catalogName, location, resourceGroupName) {
                        var _this = this;
                        var deferred = $.Deferred();
                        var timeout = setTimeout(function () {
                            deferred.reject("timeout");
                        }, 1000 * 60 * 5); // 5 minutes
                        var poll = function () {
                            _this.ajax(DataCatalog.Core.Utilities.stringFormat("/api/provisioning/deleteCatalog?subscriptionId={0}&location={1}&catalogName={2}&resourceGroupName={3}", subscriptionId, location, catalogName, resourceGroupName), { method: "DELETE" }, null, true, _this.onUnauthorized)
                                .done(function (data, textStatus, jqXhr) {
                                //// https://msdn.microsoft.com/en-us/library/azure/dn790539.aspx
                                if (jqXhr.status === 200) {
                                    clearTimeout(timeout);
                                    deferred.resolve();
                                }
                                else if (jqXhr.status === 202) {
                                    setTimeout(poll, 1500);
                                }
                            })
                                .fail(deferred.reject);
                        };
                        poll();
                        return deferred.promise();
                    };
                    return ProvisioningService;
                })(Services.BaseService);
                Services.ProvisioningService = ProvisioningService;
            })(Services = DataCatalog.Services || (DataCatalog.Services = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Services;
            (function (Services) {
                var SearchService = (function (_super) {
                    __extends(SearchService, _super);
                    function SearchService() {
                        _super.apply(this, arguments);
                    }
                    SearchService.getQueryParameters = function (options) {
                        var searchFilters = options.searchFilters || [];
                        var facetFilters = options.facetFilters || [];
                        var facets = null;
                        if (options.containerId) {
                            searchFilters.push("containerId=" + options.containerId);
                        }
                        if (facetFilters.length) {
                            // Group the facet filters by groupType
                            var grouping = {};
                            $.each(facetFilters, function (i, item) {
                                if (!grouping[item.groupType]) {
                                    grouping[item.groupType] = [];
                                }
                                grouping[item.groupType].push(item);
                            });
                            var andGroup = [];
                            $.each(grouping, function (key, value) {
                                var orGroup = [];
                                $.each(value || [], function (i, item) {
                                    orGroup.push(DataCatalog.Core.Utilities.stringFormat("{0}=\"{1}\"", item.groupType.replace("_na", ""), item.term));
                                });
                                var orString = "(" + orGroup.join(" OR ") + ")";
                                andGroup.push(orString);
                            });
                            var facetSearchString = "(" + andGroup.join(" AND ") + ")";
                            searchFilters.push(facetSearchString);
                        }
                        if (options.facets) {
                            facets = options.facets.join(",");
                        }
                        return {
                            searchTerms: $.trim(options.searchTerms) || "*",
                            pageSize: options.pageSize,
                            startPage: options.startPage,
                            sortKeys: options.sortKey,
                            maxFacetTerms: options.maxFacetTerms,
                            searchFilter: searchFilters.join(" AND "),
                            facets: facets
                        };
                    };
                    SearchService.search = function (options) {
                        var _this = this;
                        console.log('searchService', 'search');
                        var defaults = {
                            searchTerms: "*",
                            searchFilters: [],
                            facetFilters: [],
                            startPage: 1,
                            pageSize: 10,
                            sortKey: null,
                            containerId: null,
                            capture: true,
                            facets: ["tags,objectType,sourceType,experts"],
                            captureSearchTerm: true
                        };
                        options = $.extend(defaults, options);
                        //options.facets = options.facets.concat($tokyo.user.tenantFacets || []);
                        var searchData = this.getQueryParameters(options);
                        //if (options.capture && options.captureSearchTerm) {
                        //    UserProfileService.addSearchTerm(searchData.searchTerms);
                        //}
                        Services.logger.logInfo("Search executing", { data: searchData });
                        var deferred = jQuery.Deferred();
                        var requestData = {
                            searchTerms: options.searchTerms ? options.searchTerms : '*',
                            startPage: options.startPage,
                            count: options.pageSize,
                            searchFilter: options.searchFilters.join(','),
                            sortKeys: options.sortKey,
                            facets: options.facets.join(','),
                            maxFacetTerms: 10,
                        };
                        requestData['api-version'] = this.API_VERSION;
                        var execute = function (queryParameters) {
                            return _this.ajax("/search/search", { data: queryParameters })
                                .fail(function (result) {
                                var errorResponse = result;
                                var bodyText;
                                var code = "";
                                try {
                                    var errorResult = JSON.parse(errorResponse.responseText);
                                    Services.logger.logInfo("Search failed", { data: errorResult });
                                    code = ": " + errorResult.__error.code;
                                    bodyText = errorResult.__error.message.value;
                                }
                                catch (e) {
                                }
                                if (bodyText) {
                                    Services.ModalService.show({
                                        title: DataCatalog.Core.Resx.error + code,
                                        bodyText: bodyText,
                                        hideCancelButton: true
                                    }).done(function (modal) { return modal.close(); });
                                }
                            })
                                .done(function (result) {
                                // Set current search activityId on logger
                                //logger.setSearchActivityId(result.id);
                                Services.logger.logInfo("Search complete", { data: queryParameters });
                            });
                        };
                        return execute(requestData)
                            .done(function () {
                            if (options.capture) {
                                _this.research = function () {
                                    return execute(requestData);
                                };
                            }
                        });
                    };
                    SearchService.getNumberOfItems = function () {
                        var deferred = jQuery.Deferred();
                        var data = {
                            searchTerms: '*',
                            count: 1,
                            startPage: 1,
                            maxFacetTerms: 10,
                            'api-version': this.API_VERSION
                        };
                        var successFunc = function (result) {
                            deferred.resolve((result || {}).totalResults);
                        };
                        this.ajax("/search/search", { data: data })
                            .fail(deferred.reject)
                            .done(successFunc);
                        return deferred.promise();
                    };
                    SearchService.getNumberOfAnnotatedItems = function () {
                        var deferred = jQuery.Deferred();
                        // Mock Data
                        if (Services.BaseService.useMock) {
                            deferred.resolve(0);
                            return deferred.promise();
                        }
                        var annotations = "has:tags || has:experts || has:description || has:friendlyname";
                        this.search({ searchFilters: [annotations], pageSize: 1, startPage: 1, capture: false })
                            .done(function (results) {
                            deferred.resolve(results.totalResults);
                        }).fail(deferred.reject);
                        return deferred.promise();
                    };
                    SearchService.getNumberOfPublishers = function () {
                        var deferred = jQuery.Deferred();
                        // Mock Data
                        if (Services.BaseService.useMock) {
                            deferred.resolve(0);
                            return deferred.promise();
                        }
                        this.search({ searchTerms: "*", capture: false, facets: ["lastRegisteredBy.upn"], maxFacetTerms: 101 }).done(function (result) {
                            var count = 0;
                            if (result && result.facets && result.facets.length && result.facets[0].terms) {
                                count = result.facets[0].terms.length;
                            }
                            deferred.resolve(count);
                        }).fail(deferred.reject);
                        return deferred.promise();
                    };
                    SearchService.getAssets = function (searchFilters) {
                        // Mock Data
                        if (Services.BaseService.useMock) {
                            var deferred = jQuery.Deferred();
                            var results = {
                                query: {
                                    id: "test",
                                    searchTerms: "test",
                                    startIndex: 0,
                                    startPage: 0,
                                    count: 0,
                                },
                                id: 'test',
                                totalResults: 0,
                                startIndex: 0,
                                itemsPerPage: 0,
                                facets: [],
                                results: [],
                                __error: null
                            };
                            deferred.resolve(results);
                            return deferred.promise();
                        }
                        var assetIds = searchFilters.join(" OR ");
                        return this.search({ searchFilters: [assetIds], pageSize: searchFilters.length, capture: false });
                    };
                    SearchService.API_VERSION = "2016-03-30";
                    return SearchService;
                })(Services.BaseService);
                Services.SearchService = SearchService;
            })(Services = DataCatalog.Services || (DataCatalog.Services = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Services;
            (function (Services) {
                var UserProfileService = (function (_super) {
                    __extends(UserProfileService, _super);
                    function UserProfileService() {
                        _super.apply(this, arguments);
                    }
                    //#region Saved Searches
                    UserProfileService.getSavedSearches = function () {
                        // Mock Data
                        var deferred = jQuery.Deferred();
                        var searches = {
                            version: "0.1",
                            searches: []
                        };
                        deferred.resolve(searches);
                        return deferred.promise();
                        if (!this._savedSearchesPromise) {
                            this._savedSearchesPromise = this.ajax(this._savedSearchesUrl);
                        }
                        return this._savedSearchesPromise;
                    };
                    UserProfileService.setSavedSearches = function (savedSearches) {
                        var _this = this;
                        return this.ajax(this._savedSearchesUrl, { method: "PUT", data: JSON.stringify(savedSearches), contentType: "application/json" })
                            .done(function () {
                            _this._savedSearchesPromise = $.Deferred().resolve(savedSearches).promise();
                        });
                    };
                    //#endregion
                    //#region Search Terms
                    UserProfileService.getSearchTerms = function () {
                        // Mock Data
                        var deferred = jQuery.Deferred();
                        var terms = {
                            version: "0.1",
                            terms: []
                        };
                        deferred.resolve(terms);
                        return deferred.promise();
                        if (!this._searchTermsPromise) {
                            this._searchTermsPromise = this.ajax(this._searchTermsUrl);
                        }
                        return this._searchTermsPromise;
                    };
                    UserProfileService.setSearchTerms = function (searchTerms) {
                        var _this = this;
                        // Mock Data
                        var deferred = jQuery.Deferred();
                        deferred.resolve([]);
                        return deferred.promise();
                        return this.ajax(this._searchTermsUrl, { method: "PUT", data: JSON.stringify(searchTerms), contentType: "application/json" })
                            .done(function () {
                            _this._searchTermsPromise = $.Deferred().resolve(searchTerms).promise();
                        });
                    };
                    UserProfileService.addSearchTerm = function (termToAdd) {
                        var _this = this;
                        return;
                        termToAdd = $.trim(termToAdd);
                        if (!termToAdd || termToAdd === "*") {
                            return $.Deferred().reject().promise();
                        }
                        var deferred = $.Deferred();
                        this.getSearchTerms()
                            .fail(deferred.reject)
                            .done(function (searchTerms) {
                            var preexisting = DataCatalog.Core.Utilities.arrayRemove(searchTerms.terms, function (s) { return s.term.toLowerCase() === termToAdd.toLowerCase(); });
                            var searchTermToAdd = preexisting || { createdDate: (new Date()).toISOString() };
                            searchTermToAdd.lastUsedDate = (new Date()).toISOString();
                            searchTermToAdd.term = termToAdd;
                            searchTerms.terms.unshift(searchTermToAdd);
                            _this.setSearchTerms(searchTerms)
                                .then(deferred.resolve, deferred.reject);
                        });
                        return deferred.promise();
                    };
                    //#endregion
                    //#region Pins
                    UserProfileService.getPins = function () {
                        // Mock Data
                        var deferred = jQuery.Deferred();
                        var pins = {
                            version: "0.1",
                            pins: []
                        };
                        deferred.resolve(pins);
                        return deferred.promise();
                        if (!this._pinsPromise) {
                            this._pinsPromise = this.ajax(this._pinsUrl);
                        }
                        return this._pinsPromise;
                    };
                    UserProfileService.setPins = function (pins) {
                        var _this = this;
                        return this.ajax(this._pinsUrl, { method: "PUT", data: JSON.stringify(pins), contentType: "application/json" })
                            .done(function () {
                            _this._pinsPromise = $.Deferred().resolve(pins).promise();
                        });
                    };
                    //#endregion
                    //#region Recent items
                    UserProfileService.getRecentItems = function () {
                        // Mock Data
                        var deferred = jQuery.Deferred();
                        var recentItems = {
                            version: "0.1",
                            items: []
                        };
                        deferred.resolve(recentItems);
                        return deferred.promise();
                        if (!this._recentItemsPromise) {
                            this._recentItemsPromise = this.ajax(this._recentItemsUrl);
                        }
                        return this._recentItemsPromise;
                    };
                    UserProfileService.addRecentItems = function (items) {
                        var _this = this;
                        return;
                        var maxRecentItems = 25;
                        this.getRecentItems().done(function (recentItems) {
                            var recent = recentItems.items.filter(function (i) { return !items.some(function (s) { return s.assetId === i.assetId; }); });
                            items.forEach(function (i) {
                                recent.unshift(i);
                            });
                            if (recent.length > maxRecentItems) {
                                recent = recent.slice(0, maxRecentItems);
                            }
                            recentItems.items = recent;
                            _this.ajax(_this._recentItemsUrl, { method: "PUT", data: JSON.stringify(recentItems), contentType: "application/json" })
                                .done(function () {
                                _this._recentItemsPromise = $.Deferred().resolve(recentItems).promise();
                            });
                        });
                    };
                    UserProfileService.resetRecentItems = function () {
                        var _this = this;
                        return;
                        var items = {
                            version: "1.0.0",
                            items: []
                        };
                        this.ajax(this._recentItemsUrl, { method: "PUT", data: JSON.stringify(items), contentType: "application/json" })
                            .done(function () {
                            _this._recentItemsPromise = $.Deferred().resolve(items).promise();
                        });
                    };
                    //#endregion
                    //#region Browse Settings
                    UserProfileService.getBrowseSettings = function () {
                        // Mock Data
                        var deferred = jQuery.Deferred();
                        var browseSettings = {
                            version: "0.1",
                            settings: []
                        };
                        deferred.resolve(browseSettings);
                        return deferred.promise();
                        if (!this._browseSettingsPromise) {
                            this._browseSettingsPromise = this.ajax(this._browseSettingsUri);
                        }
                        return this._browseSettingsPromise;
                    };
                    UserProfileService.updateBrowseSettings = function (settings) {
                        var _this = this;
                        return;
                        this.ajax(this._browseSettingsUri, { method: "PUT", data: JSON.stringify(settings), contentType: "application/json" }).done(function () {
                            _this._browseSettingsPromise = $.Deferred().resolve(settings).promise();
                        });
                    };
                    UserProfileService._savedSearchesUrl = "/api/user/profile/searches";
                    UserProfileService._searchTermsUrl = "/api/user/profile/searchTerms";
                    UserProfileService._pinsUrl = "/api/user/profile/pins";
                    UserProfileService._recentItemsUrl = "/api/user/profile/recentItems";
                    UserProfileService._browseSettingsUri = "/api/user/profile/browseSettings";
                    return UserProfileService;
                })(Services.BaseService);
                Services.UserProfileService = UserProfileService;
            })(Services = DataCatalog.Services || (DataCatalog.Services = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var DataStudio;
    (function (DataStudio) {
        var DataCatalog;
        (function (DataCatalog) {
            var Services;
            (function (Services) {
                var UserService = (function (_super) {
                    __extends(UserService, _super);
                    function UserService() {
                        _super.apply(this, arguments);
                    }
                    UserService.init = function () {
                        this._objectIdCache[DataCatalog.Core.Constants.Users.NOBODY] = {
                            upn: DataCatalog.Core.Constants.Users.NOBODY,
                            objectId: DataCatalog.Core.Constants.Users.NOBODY,
                            objectType: "User"
                        };
                        this._objectIdCache[$tokyo.user.objectId] = {
                            upn: $tokyo.user.upn,
                            objectId: $tokyo.user.objectId,
                            objectType: "User"
                        };
                        this._upnCache[$tokyo.user.upn] = {
                            upn: $tokyo.user.upn,
                            objectId: $tokyo.user.objectId,
                            objectType: "User"
                        };
                    };
                    UserService.getUnitsForAutoUnitAdjustCatalog = function (objectIds) {
                        var _this = this;
                        var deferred = $.Deferred();
                        deferred.resolve({ value: 0 });
                        return deferred.promise();
                        objectIds = DataCatalog.Core.Utilities.arrayDistinct((objectIds || [])).sort();
                        if (!objectIds.length) {
                            return $.Deferred().resolve({ value: 1 }).promise();
                        }
                        var cacheKey = objectIds.join("&");
                        if (this._getUnitsForAutoUnitAdjustCatalogCache[cacheKey]) {
                            return this._getUnitsForAutoUnitAdjustCatalogCache[cacheKey];
                        }
                        var promise = this.ajax("/api/users/getUnitsForAutoUnitAdjustCatalog", { method: "PUT", data: this.stringify(objectIds), contentType: "application/json" });
                        this._getUnitsForAutoUnitAdjustCatalogCache[cacheKey] = promise;
                        promise.done(function () {
                            // Clear the cache after a minute
                            setTimeout(function () {
                                _this._getUnitsForAutoUnitAdjustCatalogCache[cacheKey] = null;
                            }, 1000 * 60);
                        });
                        return promise;
                    };
                    UserService.resolveUpns = function (upns, groupBehavior) {
                        var _this = this;
                        var deferred = $.Deferred();
                        deferred.resolve({ valid: [], invalid: [], failed: [], duplicated: [] });
                        return deferred.promise();
                        upns = (upns || []).filter(function (upn) { return !!$.trim(upn); });
                        // Find upns not in the cache
                        var cacheMisses = [];
                        var cacheHits = [];
                        upns.forEach(function (upn) {
                            var cacheHit = _this._upnCache[upn];
                            if (cacheHit) {
                                cacheHits.push(cacheHit);
                            }
                            else {
                                cacheMisses.push(upn);
                            }
                        });
                        var resolveFromCache = function () {
                            deferred.resolve({
                                valid: cacheHits,
                                invalid: cacheMisses,
                                failed: [],
                                duplicated: []
                            });
                        };
                        if (!cacheMisses.length) {
                            resolveFromCache();
                        }
                        else {
                            this.ajax("/api/users/resolveupns", { data: { upns: cacheMisses, groupBehavior: groupBehavior } })
                                .done(function (result) {
                                if (result) {
                                    result.valid = result.valid || [];
                                    // Add to cache
                                    result.valid.forEach(function (r) {
                                        _this._objectIdCache[r.objectId] = r;
                                        _this._upnCache[r.upn] = r;
                                    });
                                    // Add cache hits to response
                                    result.valid = result.valid.concat(cacheHits);
                                    deferred.resolve(result);
                                }
                                else {
                                    resolveFromCache();
                                }
                            })
                                .fail(function () {
                                deferred.resolve({
                                    valid: cacheHits,
                                    invalid: [],
                                    failed: cacheMisses,
                                    duplicated: []
                                });
                            });
                        }
                        return deferred.promise();
                    };
                    UserService.resolveObjectIds = function (objectIds) {
                        var _this = this;
                        var deferred = $.Deferred();
                        deferred.resolve({ valid: [], invalid: [], failed: [] });
                        return deferred.promise();
                        objectIds = (objectIds || []).filter(function (objectId) { return !!$.trim(objectId); });
                        // Find objectIds not in the cache
                        var cacheMisses = [];
                        objectIds.forEach(function (objectId) {
                            if (!_this._objectIdCache[objectId]) {
                                cacheMisses.push(objectId);
                            }
                        });
                        var resolveFromCache = function () {
                            var valid = [];
                            var invalid = [];
                            var failed = [];
                            objectIds.forEach(function (objectId) {
                                valid.push(_this._objectIdCache[objectId]);
                                if (_this._invalidObjectIds[objectId]) {
                                    invalid.push(objectId);
                                }
                                if (_this._failedObjectIds[objectId]) {
                                    failed.push(objectId);
                                }
                            });
                            deferred.resolve({
                                valid: valid,
                                invalid: invalid,
                                failed: failed
                            });
                        };
                        // Did everything get resolved?
                        if (!cacheMisses.length) {
                            resolveFromCache();
                        }
                        else {
                            this.ajax("api/users/resolveobjectids", { method: "PUT", data: this.stringify(cacheMisses), contentType: "application/json" }, null, false)
                                .done(function (result) {
                                if (result) {
                                    // Add to caches
                                    (result.valid || []).forEach(function (r) {
                                        _this._objectIdCache[r.objectId] = r;
                                        _this._upnCache[r.upn] = r;
                                    });
                                    (result.invalid || []).forEach(function (objectId) {
                                        _this._invalidObjectIds[objectId] = true;
                                    });
                                    (result.failed || []).forEach(function (objectId) {
                                        _this._failedObjectIds[objectId] = true;
                                    });
                                }
                            })
                                .always(function () {
                                cacheMisses.forEach(function (objectId) {
                                    if (!_this._objectIdCache[objectId]) {
                                        // Add it to the valid list with a placeholder upn
                                        _this._objectIdCache[objectId] = {
                                            objectId: objectId,
                                            upn: objectId,
                                            objectType: "User"
                                        };
                                        // Make sure, if nothing else, I'm resolved
                                        if (objectId === $tokyo.user.objectId) {
                                            _this._objectIdCache[objectId].upn = $tokyo.user.upn;
                                        }
                                    }
                                });
                                resolveFromCache();
                            });
                        }
                        return deferred.promise();
                    };
                    UserService.waitUntilAllowed = function () {
                        var _this = this;
                        var deferred = $.Deferred();
                        var correlationId = this.getNewCorrelationId();
                        var requiredConsecutivePass = 2;
                        var currentPassCount = 0;
                        var url = "/home/isallowed";
                        var timeout = setTimeout(function () {
                            deferred.reject("timeout");
                        }, 1000 * 60 * 5); // 5 minutes
                        Services.logger.logInfo("starting to wait if user is allowed", { correlationId: correlationId });
                        var check = function () {
                            $.ajax(url)
                                .done(function () {
                                if (currentPassCount < requiredConsecutivePass) {
                                    currentPassCount++;
                                    Services.logger.logInfo("user is allowed - checking again", { correlationId: correlationId, currentPassCount: currentPassCount, requiredConsecutivePass: requiredConsecutivePass });
                                    setTimeout(check, 1500);
                                }
                                else {
                                    Services.logger.logInfo("user is now allowed", { correlationId: correlationId, currentPassCount: currentPassCount, requiredConsecutivePass: requiredConsecutivePass });
                                    deferred.resolveWith(deferred, arguments);
                                }
                            })
                                .fail(function (jqXhr) {
                                if ((jqXhr.status === 401 || jqXhr.status === 403) && (deferred.state() === "pending")) {
                                    Services.logger.logInfo("user is not allowed yet", { correlationId: correlationId });
                                    setTimeout(check, 1500);
                                }
                                else {
                                    deferred.rejectWith(deferred, arguments);
                                }
                            });
                        };
                        deferred
                            .done(function () {
                            clearTimeout(timeout);
                            Services.logger.logInfo("user is now allowed", { correlationId: correlationId });
                        })
                            .fail(function (jqueryXhr) {
                            _this.logAjaxError(jqueryXhr, { url: url, correlationId: correlationId });
                        })
                            .always(function () {
                            clearTimeout(timeout);
                        });
                        check();
                        return deferred.promise();
                    };
                    UserService.waitUntilNotAllowed = function () {
                        var _this = this;
                        var deferred = $.Deferred();
                        var correlationId = this.getNewCorrelationId();
                        var url = "/home/isallowed";
                        var timeout = setTimeout(function () {
                            deferred.reject("timeout");
                        }, 1000 * 60 * 5); // 5 minutes
                        Services.logger.logInfo("starting to wait if user is not allowed", { correlationId: correlationId });
                        var check = function () {
                            $.ajax(url)
                                .done(function () {
                                Services.logger.logInfo("user is still allowed", { correlationId: correlationId });
                                setTimeout(check, 1500);
                            })
                                .fail(function (jqXhr) {
                                if ((jqXhr.status === 401 || jqXhr.status === 403) && (deferred.state() === "pending")) {
                                    deferred.resolve();
                                }
                                else {
                                    deferred.rejectWith(deferred, arguments);
                                }
                            });
                        };
                        deferred
                            .done(function () {
                            clearTimeout(timeout);
                            Services.logger.logInfo("user is now not allowed", { correlationId: correlationId });
                        })
                            .fail(function (jqueryXhr) {
                            _this.logAjaxError(jqueryXhr, { url: url, correlationId: correlationId });
                        })
                            .always(function () {
                            clearTimeout(timeout);
                        });
                        check();
                        return deferred.promise();
                    };
                    UserService.getTotalUsers = function () {
                        var deferred = $.Deferred();
                        deferred.resolve(0);
                        return deferred.promise();
                        if (!this._userCountPromise) {
                            var url = "api/users/TotalUserCount";
                            this._userCountPromise = $.ajax(url);
                        }
                        return this._userCountPromise;
                    };
                    UserService._upnCache = {};
                    UserService._objectIdCache = {};
                    UserService._invalidObjectIds = {};
                    UserService._failedObjectIds = {};
                    UserService._getUnitsForAutoUnitAdjustCatalogCache = {};
                    return UserService;
                })(Services.BaseService);
                Services.UserService = UserService;
            })(Services = DataCatalog.Services || (DataCatalog.Services = {}));
        })(DataCatalog = DataStudio.DataCatalog || (DataStudio.DataCatalog = {}));
    })(DataStudio = Microsoft.DataStudio || (Microsoft.DataStudio = {}));
})(Microsoft || (Microsoft = {}));
//UserService.init(); 
//# sourceMappingURL=Module.js.map