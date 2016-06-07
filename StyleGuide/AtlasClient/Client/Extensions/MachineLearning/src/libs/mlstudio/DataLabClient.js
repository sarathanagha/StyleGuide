var DataLab;
(function (DataLab) {
    var Constants;
    (function (Constants) {
        (function (GraphNodeType) {
            GraphNodeType[GraphNodeType["Module"] = 0] = "Module";
            GraphNodeType[GraphNodeType["Dataset"] = 1] = "Dataset";
            GraphNodeType[GraphNodeType["TrainedModel"] = 2] = "TrainedModel";
            GraphNodeType[GraphNodeType["WebServicePort"] = 3] = "WebServicePort";
            GraphNodeType[GraphNodeType["Transform"] = 4] = "Transform";
            GraphNodeType[GraphNodeType["None"] = 5] = "None";
        })(Constants.GraphNodeType || (Constants.GraphNodeType = {}));
        var GraphNodeType = Constants.GraphNodeType;
        Constants.PasswordPlaceholder = "xxxxxxxx";
        var ResourceCategory;
        (function (ResourceCategory) {
            ResourceCategory.Dataset = "Saved Datasets";
            ResourceCategory.TrainedModel = "Trained Models";
            ResourceCategory.Transform = "Transforms";
            ResourceCategory.Uncategorized = "Miscellaneous";
            ResourceCategory.TrainModule = "Machine Learning\\Train";
            ResourceCategory.ScoreModule = "Machine Learning\\Score";
            ResourceCategory.WebService = "Web Service";
            ResourceCategory.Deprecated = "Deprecated";
            ResourceCategory.Transformation = "Data Transformation\\Manipulation";
        })(ResourceCategory = Constants.ResourceCategory || (Constants.ResourceCategory = {}));
        (function (DisplayEndpointType) {
            DisplayEndpointType[DisplayEndpointType["Error"] = 0] = "Error";
        })(Constants.DisplayEndpointType || (Constants.DisplayEndpointType = {}));
        var DisplayEndpointType = Constants.DisplayEndpointType;
        Constants.MaximumCharsForErrorToolTip = 100;
        Constants.DatasetName = "dataset";
        Constants.CustomModulePackageName = "zipFile";
        Constants.TrainedModelName = "Trained model";
        Constants.TransformModuleName = "Transformation module";
        var WellKnownResource;
        (function (WellKnownResource) {
            WellKnownResource.ScoreGenericModuleFamilyId = "401b4f92e7244d5abe81d5b0ff9bdb33";
            WellKnownResource.TransformFamilyId = "602aed7baab34e2abaf78cee080b06ff";
            WellKnownResource.SplitModuleFamilyId = "70530644c97a4ab685f788bf30a8be5f";
            WellKnownResource.ProjectColumnFamilyId = "1ec722fab6234e26a44ea50c6d726223";
            WellKnownResource.ApplyTransformationFamilyId = "805e592d0f1f48eb97c9688ed0c1dc70";
        })(WellKnownResource = Constants.WellKnownResource || (Constants.WellKnownResource = {}));
        var WellKnownDataTypeId;
        (function (WellKnownDataTypeId) {
            WellKnownDataTypeId.ITransformDotNet = "ITransformDotNet";
        })(WellKnownDataTypeId = Constants.WellKnownDataTypeId || (Constants.WellKnownDataTypeId = {}));
        Constants.WelcomeSkipOptionId = "welcomeSkipOption";
        (function (FeatureId) {
            FeatureId[FeatureId["None"] = 0] = "None";
            FeatureId[FeatureId["Upgrade_Yes"] = 1] = "Upgrade_Yes";
            FeatureId[FeatureId["Upgrade_No"] = 2] = "Upgrade_No";
            FeatureId[FeatureId["ShellUICommands"] = 3] = "ShellUICommands";
            FeatureId[FeatureId["Run"] = 4] = "Run";
            FeatureId[FeatureId["PublishWebService"] = 5] = "PublishWebService";
            FeatureId[FeatureId["PublishDataflow"] = 6] = "PublishDataflow";
            FeatureId[FeatureId["RepublishWebService"] = 7] = "RepublishWebService";
            FeatureId[FeatureId["Save"] = 8] = "Save";
            FeatureId[FeatureId["SaveAs"] = 9] = "SaveAs";
            FeatureId[FeatureId["Discard_PressedYes"] = 10] = "Discard_PressedYes";
            FeatureId[FeatureId["Discard_PressedNo"] = 11] = "Discard_PressedNo";
            FeatureId[FeatureId["Cancel"] = 12] = "Cancel";
            FeatureId[FeatureId["Refresh"] = 13] = "Refresh";
            FeatureId[FeatureId["RemoveCredentials"] = 14] = "RemoveCredentials";
            FeatureId[FeatureId["Settings"] = 15] = "Settings";
            FeatureId[FeatureId["Palette"] = 16] = "Palette";
            FeatureId[FeatureId["Search"] = 17] = "Search";
            FeatureId[FeatureId["Download"] = 18] = "Download";
            FeatureId[FeatureId["Visualize"] = 19] = "Visualize";
            FeatureId[FeatureId["SendFeedback"] = 20] = "SendFeedback";
            FeatureId[FeatureId["Feedback"] = 21] = "Feedback";
            FeatureId[FeatureId["OpenHelp"] = 22] = "OpenHelp";
            FeatureId[FeatureId["VisualizationParameter"] = 23] = "VisualizationParameter";
            FeatureId[FeatureId["Visualization"] = 24] = "Visualization";
            FeatureId[FeatureId["HistogramMode"] = 25] = "HistogramMode";
            FeatureId[FeatureId["BoxchartMode"] = 26] = "BoxchartMode";
            FeatureId[FeatureId["ColumnPicker"] = 27] = "ColumnPicker";
            FeatureId[FeatureId["AddRule"] = 28] = "AddRule";
            FeatureId[FeatureId["RemoveRule"] = 29] = "RemoveRule";
            FeatureId[FeatureId["CloseColumnPicker"] = 30] = "CloseColumnPicker";
            FeatureId[FeatureId["EnableAllowDuplicates"] = 31] = "EnableAllowDuplicates";
            FeatureId[FeatureId["DisableAllowDuplicates"] = 32] = "DisableAllowDuplicates";
            FeatureId[FeatureId["PreviewExperiment"] = 33] = "PreviewExperiment";
            FeatureId[FeatureId["PreviewWebServiceGroup"] = 34] = "PreviewWebServiceGroup";
            FeatureId[FeatureId["ThumbnailSize"] = 35] = "ThumbnailSize";
            FeatureId[FeatureId["AddModuleByDragging"] = 36] = "AddModuleByDragging";
            FeatureId[FeatureId["AddModuleByDoubleClick"] = 37] = "AddModuleByDoubleClick";
            FeatureId[FeatureId["ExperimentEditor"] = 38] = "ExperimentEditor";
            FeatureId[FeatureId["Help"] = 39] = "Help";
            FeatureId[FeatureId["HelpSearched"] = 40] = "HelpSearched";
            FeatureId[FeatureId["HelpSearchResultClicked"] = 41] = "HelpSearchResultClicked";
            FeatureId[FeatureId["HelpSemanticSynonymClicked"] = 42] = "HelpSemanticSynonymClicked";
            /* WebServiceParameter */
            FeatureId[FeatureId["WebServiceParameter"] = 43] = "WebServiceParameter";
            FeatureId[FeatureId["CreateNewParameter"] = 44] = "CreateNewParameter";
            FeatureId[FeatureId["LinkExistingParameter"] = 45] = "LinkExistingParameter";
            FeatureId[FeatureId["UnlinkParameter"] = 46] = "UnlinkParameter";
            FeatureId[FeatureId["RenameParameter"] = 47] = "RenameParameter";
            FeatureId[FeatureId["ProvideDefaultValue"] = 48] = "ProvideDefaultValue";
            FeatureId[FeatureId["RemoveDefaultValue"] = 49] = "RemoveDefaultValue";
            FeatureId[FeatureId["RemoveParameter"] = 50] = "RemoveParameter";
            FeatureId[FeatureId["ExperimentParameterInUse"] = 51] = "ExperimentParameterInUse";
            /* WebServicePort */
            FeatureId[FeatureId["WebServicePort"] = 52] = "WebServicePort";
            FeatureId[FeatureId["DragNewPort"] = 53] = "DragNewPort";
            FeatureId[FeatureId["PublishToCommunity"] = 54] = "PublishToCommunity";
            /* Friction free trial */
            FeatureId[FeatureId["UploadDataset"] = 55] = "UploadDataset";
            FeatureId[FeatureId["TrialFeature"] = 56] = "TrialFeature";
            FeatureId[FeatureId["DisabledWebServicePublish"] = 57] = "DisabledWebServicePublish";
            FeatureId[FeatureId["DisabledModule"] = 58] = "DisabledModule";
            FeatureId[FeatureId["DisabledDatasetUpload"] = 59] = "DisabledDatasetUpload";
            FeatureId[FeatureId["ExceededModuleCountLimit"] = 60] = "ExceededModuleCountLimit";
            FeatureId[FeatureId["TrialDialogSignIn"] = 61] = "TrialDialogSignIn";
            FeatureId[FeatureId["TrialDialogClose"] = 62] = "TrialDialogClose";
            FeatureId[FeatureId["ExceededModuleRuntimeLimit"] = 63] = "ExceededModuleRuntimeLimit";
            FeatureId[FeatureId["ExceededStorageLimit"] = 64] = "ExceededStorageLimit";
            FeatureId[FeatureId["ParallelRunDisabled"] = 65] = "ParallelRunDisabled";
            FeatureId[FeatureId["DisabledFeature"] = 66] = "DisabledFeature";
            FeatureId[FeatureId["TrialDialogSignUp"] = 67] = "TrialDialogSignUp";
            /* PrepareWebService */
            FeatureId[FeatureId["PrepareWebService"] = 68] = "PrepareWebService";
            FeatureId[FeatureId["SwitchExperimentDataFlow"] = 69] = "SwitchExperimentDataFlow";
            FeatureId[FeatureId["SwitchWebServiceDataFlow"] = 70] = "SwitchWebServiceDataFlow";
            FeatureId[FeatureId["PrepareWebServiceFailed"] = 71] = "PrepareWebServiceFailed";
            /* ScoringExperiment */
            FeatureId[FeatureId["ScoringExperiment"] = 72] = "ScoringExperiment";
            FeatureId[FeatureId["CreateScoringExperiment"] = 73] = "CreateScoringExperiment";
            FeatureId[FeatureId["CreateScoringExperimentFailed"] = 74] = "CreateScoringExperimentFailed";
            FeatureId[FeatureId["UpdateScoringExperiment"] = 75] = "UpdateScoringExperiment";
            FeatureId[FeatureId["UpdateScoringExperimentFailed"] = 76] = "UpdateScoringExperimentFailed";
            FeatureId[FeatureId["SwitchExperiment"] = 77] = "SwitchExperiment";
            FeatureId[FeatureId["DeleteScoringExperiment"] = 78] = "DeleteScoringExperiment";
            /* BubbleTutorial */
            FeatureId[FeatureId["BubbleTutorial"] = 79] = "BubbleTutorial";
            FeatureId[FeatureId["UserDismiss"] = 80] = "UserDismiss";
            /* Copy Experiment uses ShellUICommands as category */
            FeatureId[FeatureId["CopyExperimentAcrossWorkspace"] = 81] = "CopyExperimentAcrossWorkspace";
            /* GuidedExperiment */
            /* GuidedExperimentOpen */
            FeatureId[FeatureId["PlusNewExperiment"] = 82] = "PlusNewExperiment";
            FeatureId[FeatureId["GuidedTour"] = 83] = "GuidedTour";
            FeatureId[FeatureId["GuidedExperiment"] = 84] = "GuidedExperiment";
            FeatureId[FeatureId["GuidedExperimentStep1"] = 85] = "GuidedExperimentStep1";
            FeatureId[FeatureId["GuidedExperimentStep2"] = 86] = "GuidedExperimentStep2";
            FeatureId[FeatureId["GuidedExperimentStep3"] = 87] = "GuidedExperimentStep3";
            FeatureId[FeatureId["GuidedExperimentStep4"] = 88] = "GuidedExperimentStep4";
            FeatureId[FeatureId["GuidedExperimentStep5"] = 89] = "GuidedExperimentStep5";
            FeatureId[FeatureId["GuidedExperimentStep6"] = 90] = "GuidedExperimentStep6";
            FeatureId[FeatureId["GuidedExperimentStep7"] = 91] = "GuidedExperimentStep7";
            FeatureId[FeatureId["GuidedExperimentOpenFromDrawer"] = 92] = "GuidedExperimentOpenFromDrawer";
            FeatureId[FeatureId["GuidedExperimentOpenFromGuidedTour"] = 93] = "GuidedExperimentOpenFromGuidedTour";
            FeatureId[FeatureId["GuidedTourStep1"] = 94] = "GuidedTourStep1";
            FeatureId[FeatureId["GuidedTourStep2"] = 95] = "GuidedTourStep2";
            FeatureId[FeatureId["GuidedTourStep3"] = 96] = "GuidedTourStep3";
            FeatureId[FeatureId["GuidedTourStep4"] = 97] = "GuidedTourStep4";
            FeatureId[FeatureId["GuidedTourStep5"] = 98] = "GuidedTourStep5";
            FeatureId[FeatureId["GuidedTourStep6"] = 99] = "GuidedTourStep6";
            FeatureId[FeatureId["GuidedTourStep7"] = 100] = "GuidedTourStep7";
            FeatureId[FeatureId["GuidedTourOpenFromNavigationBar"] = 101] = "GuidedTourOpenFromNavigationBar";
            FeatureId[FeatureId["GuidedTourOpenFromIntroVideo"] = 102] = "GuidedTourOpenFromIntroVideo";
            FeatureId[FeatureId["DisabledModuleUpload"] = 103] = "DisabledModuleUpload";
            FeatureId[FeatureId["DisabledPublishToCommunity"] = 104] = "DisabledPublishToCommunity";
            FeatureId[FeatureId["CopyExperimentFromGallery"] = 105] = "CopyExperimentFromGallery";
            FeatureId[FeatureId["GuidedTourStep8"] = 106] = "GuidedTourStep8";
            FeatureId[FeatureId["CommandBarShowLineage"] = 107] = "CommandBarShowLineage";
            FeatureId[FeatureId["CommandBarSave"] = 108] = "CommandBarSave";
            FeatureId[FeatureId["CommandBarSaveAs"] = 109] = "CommandBarSaveAs";
            FeatureId[FeatureId["CommandBarDiscard"] = 110] = "CommandBarDiscard";
            FeatureId[FeatureId["CommandBarPublish"] = 111] = "CommandBarPublish";
            FeatureId[FeatureId["CommandBarSubmit"] = 112] = "CommandBarSubmit";
            FeatureId[FeatureId["CommandBarCancel"] = 113] = "CommandBarCancel";
            FeatureId[FeatureId["CommandBarPublishWebService"] = 114] = "CommandBarPublishWebService";
            FeatureId[FeatureId["CommandBarPublishToCommunity"] = 115] = "CommandBarPublishToCommunity";
            FeatureId[FeatureId["CommandBarCreateScoringGraph"] = 116] = "CommandBarCreateScoringGraph";
            FeatureId[FeatureId["CommandBarRefresh"] = 117] = "CommandBarRefresh";
            FeatureId[FeatureId["CommandBarPrepareWebService"] = 118] = "CommandBarPrepareWebService"; // Prepare web service Command bar click.
        })(Constants.FeatureId || (Constants.FeatureId = {}));
        var FeatureId = Constants.FeatureId;
        Constants.WorkspaceNameRegex = /^[0-9a-zA-Z][0-9a-zA-Z-]*[a-zA-Z0-9]$/;
        Constants.ExperimentSubmissionFailedRegExp = /([\s\S]*)(Request ID:.*$)/;
        var ModuleError;
        (function (ModuleError) {
            ModuleError.GetErrorIdRegExp = /^Error (\d{4})/;
            ModuleError.SkipErrorHeadingRegExp = /(^\s*Error:\s*)/;
            ModuleError.SkipWhitespaceAndModuleOutputStrRegExp = /(^\s+|\[ModuleOutput\]|\s+$)/g;
            ModuleError.StartMessageEndRegExp = /Record Starts at (.*):([\s\S]*)Record Ends at (.*)\./;
        })(ModuleError = Constants.ModuleError || (Constants.ModuleError = {}));
        Constants.GuidedExperimentDescription = "Experiment Tutorial";
    })(Constants = DataLab.Constants || (DataLab.Constants = {}));
})(DataLab || (DataLab = {}));

// This was copied out of AzureFX and converted to Typescript
var DataLab;
(function (DataLab) {
    var Util;
    (function (Util) {
        // This DateFormatter code is a complete fork from the AzureFx Date.js and is converted into TypeScript.
        // It is considered as a temporary utility that we might reconsidered and changed or replaced
        // in the future
        var DateFormatter = (function () {
            function DateFormatter(date) {
                this.date = date;
                // Default en-US
                this.localeValues = {
                    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    daysAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    monthsAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    ampm: ["AM", "PM"],
                    ampmAbbr: ["A", "P"],
                    dateSeparator: "/",
                    timeSeparator: ":",
                    standard: {
                        d: "M/d/yyyy",
                        D: "dddd, MMMM dd, yyyy",
                        F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                        m: "MMMM dd",
                        M: "MMMM dd",
                        r: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
                        R: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
                        s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                        t: "h:mm tt",
                        T: "h:mm:ss tt",
                        u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                        y: "MMMM, yyyy",
                        Y: "MMMM, yyyy" // DateTimeFormatInfo.YearMonthPattern
                    }
                };
            }
            DateFormatter.parse = function (value) {
                if ((value + "").substr(0, 6) === "/Date(") {
                    return parseInt(value.substr(6), 10);
                }
                else {
                    return this.parse.apply(this, arguments);
                }
            };
            DateFormatter.prototype.getLocaleValues = function () {
                return this.localeValues;
            };
            DateFormatter.prototype.setLocaleValues = function (def) {
                var standard;
                this.localeValues = def;
                this.localeValues.ampmAbbr = [this.localeValues.ampm[0][0], this.localeValues.ampm[1][0]];
                standard = this.localeValues.standard;
                standard.f = standard.D + " " + standard.t;
                standard.g = standard.d + " " + standard.t;
                standard.G = standard.d + " " + standard.T;
            };
            DateFormatter.prototype.toString = function (format) {
                var _this = this;
                /*jshint regexp:false*/
                // To prevent calling multiple functions for each replace,
                // We use private functions that would be called only if the regex is matched
                // We need to save the current this to a common place for the method
                // to be able to pick it up
                if (arguments.length) {
                    var formatString = arguments[0];
                    formatString = this.localeValues.standard[formatString] || formatString;
                    // Support ' escape
                    formatString = formatString.replace(/'([^']*)'/g, function (full, capture) {
                        return this.escapeEverything(capture);
                    });
                    // Look-Behind are not supported, so we execute everything in reverse
                    // So we can support escaping \\ by using a Look-Ahead.
                    // this.date = this;
                    return this.reverse(this.reverse(formatString).replace(/(y{1,5}|M{1,4}|d{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|t{1,2}|z{1,3}|\/|:)(?!\\)/g, function (arg) { return _this.replaceCharactersWithReverse(arg); }).replace(/\\(?!\\)/g, ""));
                }
                else {
                    return this.toString.apply(this, arguments);
                }
            };
            DateFormatter.prototype.pad = function (str, length, padding) {
                /*jshint newcap:false*/
                padding = (padding === undefined) ? "0" : padding;
                str = str + "";
                if (length + 1 >= str.length) {
                    str = Array(length + 1 - str.length).join(padding) + str;
                }
                return str;
            };
            DateFormatter.prototype.truncate = function (str, length) {
                str = str + "";
                return str.substr(str.length - length);
            };
            DateFormatter.prototype.truncateAndPad = function (str, length) {
                return this.truncate(this.pad(str, length, "0"), length);
            };
            DateFormatter.prototype.fixHour12 = function (time) {
                time = time % 12;
                return time === 0 ? 12 : time;
            };
            DateFormatter.prototype.reverse = function (arg) {
                return arg.split("").reverse().join("");
            };
            DateFormatter.prototype.escapeEverything = function (arg) {
                return "\\" + arg.split("").join("\\");
            };
            DateFormatter.prototype.replaceCharacters = function (arg) {
                // Adding falls through to make sure JSHint doesn't complain, even though it doesn't fall through since it returns
                var length = arg.length;
                var timezone;
                var isNegative;
                var hour;
                var minute;
                switch (arg[0]) {
                    case "y":
                        switch (length) {
                            case 3:
                                return this.pad(this.date.getFullYear().toString(), length);
                            case 1:
                                return (+this.truncate(this.date.getFullYear().toString(), 2)) + "";
                            default:
                                return this.truncateAndPad(this.date.getFullYear().toString(), length);
                        }
                    case "M":
                        switch (length) {
                            case 4:
                                return this.escapeEverything(this.localeValues.months[this.date.getMonth()]);
                            case 3:
                                return this.escapeEverything(this.localeValues.monthsAbbr[this.date.getMonth()]);
                            case 2:
                                return this.truncateAndPad((this.date.getMonth() + 1).toString(), 2);
                            default:
                                return this.truncate((this.date.getMonth() + 1).toString(), 2);
                        }
                    case "d":
                        switch (length) {
                            case 4:
                                return this.escapeEverything(this.localeValues.days[this.date.getDay()]);
                            case 3:
                                return this.escapeEverything(this.localeValues.daysAbbr[this.date.getDay()]);
                            case 2:
                                return this.truncateAndPad(this.date.getDate().toString(), 2);
                            default:
                                return this.truncate(this.date.getDate().toString(), 2);
                        }
                    case "h":
                        if (length === 2) {
                            return this.truncateAndPad(this.fixHour12(this.date.getHours()).toString(), 2);
                        }
                        return this.truncate(this.fixHour12(this.date.getHours()).toString(), 2);
                    case "H":
                        if (length === 2) {
                            return this.truncateAndPad(this.date.getHours().toString(), 2);
                        }
                        return this.truncate(this.date.getHours().toString(), 2);
                    case "m":
                        if (length === 2) {
                            return this.truncateAndPad(this.date.getMinutes().toString(), 2);
                        }
                        return this.truncate(this.date.getMinutes().toString(), 2);
                    case "s":
                        if (length === 2) {
                            return this.truncateAndPad(this.date.getSeconds().toString(), 2);
                        }
                        return this.truncate(this.date.getSeconds().toString(), 2);
                    case "t":
                        if (length === 2) {
                            return this.localeValues.ampm[this.date.getHours() < 12 ? 0 : 1];
                        }
                        return this.localeValues.ampmAbbr[this.date.getHours() < 12 ? 0 : 1];
                    case "z":
                        timezone = -this.date.getTimezoneOffset() / 60;
                        isNegative = timezone < 0;
                        if (isNegative) {
                            timezone = -timezone;
                        }
                        hour = parseInt(timezone, 10);
                        minute = (timezone - hour) * 60;
                        if (length === 3) {
                            return (isNegative ? "-" : "+") + this.pad(hour, 2) + ":" + this.pad(minute, 2);
                        }
                        return (isNegative ? "-" : "+") + this.pad(hour, length);
                    case "/":
                        return this.localeValues.dateSeparator;
                    case ":":
                        return this.localeValues.timeSeparator;
                }
                return "";
            };
            DateFormatter.prototype.replaceCharactersWithReverse = function (arg) {
                return this.reverse(this.replaceCharacters(arg));
            };
            return DateFormatter;
        })();
        Util.DateFormatter = DateFormatter;
    })(Util = DataLab.Util || (DataLab.Util = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
var DataLab;
(function (DataLab) {
    var Log;
    (function (Log) {
        var logger;
        function info(message, eventSource, data) {
            if (eventSource === void 0) { eventSource = null; }
            if (data === void 0) { data = null; }
            logger.info(message, eventSource, data);
        }
        Log.info = info;
        function error(message, eventSource, data) {
            if (eventSource === void 0) { eventSource = null; }
            if (data === void 0) { data = null; }
            logger.error(message, eventSource, data);
        }
        Log.error = error;
        function warn(message, eventSource, data) {
            if (eventSource === void 0) { eventSource = null; }
            if (data === void 0) { data = null; }
            logger.warn(message, eventSource, data);
        }
        Log.warn = warn;
        function exception(exception, message, eventSource, data) {
            if (message === void 0) { message = DataLab.LocalizedResources.exceptionOccurred; }
            if (eventSource === void 0) { eventSource = null; }
            if (data === void 0) { data = null; }
            logger.error(message, eventSource, {
                exceptionMessage: exception.message || exception.toString(),
                // In some browsers, the stack property on an Error instance contains a stacktrace.
                stack: exception.stack || null,
                data: data,
            });
        }
        Log.exception = exception;
        /** Emits an error-level trace (potentially containing the current call stack) and then throws an exception with the given message.
            The intended usage is 'throw new TracedException(...)'. Creating a TracedException writes the trace immediately (i.e. not as a part of a later throw). */
        var TracedException = (function () {
            function TracedException(message, eventSource, data) {
                if (eventSource === void 0) { eventSource = null; }
                if (data === void 0) { data = null; }
                var error = new Error(message);
                var stackDataOverlay = Object.create(data);
                // In some browsers, the stack property on an Error instance contains a stacktrace.
                stackDataOverlay.stack = error.stack || null;
                logger.error(message, eventSource, stackDataOverlay);
                return error;
            }
            return TracedException;
        })();
        Log.TracedException = TracedException;
        function unhandledException(message, url, line) {
            if (logger.unhandledException) {
                logger.unhandledException(message, url, line);
            }
            else {
                logger.error(message, "window.onerror", { line: line, url: url });
            }
        }
        function setLogger(newLogger) {
            if (!newLogger) {
                throw "'logger' parameter is required";
            }
            logger = newLogger;
        }
        Log.setLogger = setLogger;
        /** When true, unhandled exceptions (as sent to the window.onerror event) are traced as errors. */
        Log.traceUnhandledExceptions = true;
        /** ko.subscribable which is triggered by window.onerror. The notification value is an array of the window.onerror arguments:
            {message: string, url: string, line: number} */
        Log.unhandledExceptionEvent = new ko.subscribable();
        var ConsoleLogger = (function () {
            function ConsoleLogger() {
                if (!window.console) {
                    throw "window.console object must be present to create a ConsoleLogger";
                }
            }
            ConsoleLogger.prototype.info = function (message, eventSource, data) {
                console.info(this.format(message, eventSource), data);
            };
            ConsoleLogger.prototype.error = function (message, eventSource, data) {
                console.error(this.format(message, eventSource), data);
            };
            ConsoleLogger.prototype.warn = function (message, eventSource, data) {
                console.warn(this.format(message, eventSource), data);
            };
            ConsoleLogger.prototype.format = function (message, eventSource) {
                return eventSource ? eventSource + ": " + message : message;
            };
            return ConsoleLogger;
        })();
        Log.ConsoleLogger = ConsoleLogger;
        var NullLogger = (function () {
            function NullLogger() {
            }
            NullLogger.prototype.info = function (message, eventSource, data) {
            };
            NullLogger.prototype.error = function (message, eventSource, data) {
            };
            NullLogger.prototype.warn = function (message, eventSource, data) {
            };
            return NullLogger;
        })();
        Log.NullLogger = NullLogger;
        if (window.console) {
            setLogger(new ConsoleLogger());
        }
        else {
            setLogger(new NullLogger());
        }
        var existingOnErrorHandler = window.onerror || function () {
            return false;
        };
        window.onerror = function (message, url, line, columnNumber) {
            if (Log.traceUnhandledExceptions) {
                unhandledException(message, url, line);
            }
            Log.unhandledExceptionEvent.notifySubscribers({ message: message, url: url, line: line });
            return existingOnErrorHandler.apply(this, arguments);
        };
    })(Log = DataLab.Log || (DataLab.Log = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Util;
    (function (Util) {
        Util.reduceRetainingTreeVerbosity = false;
        function clearObject(obj) {
            for (var i in obj) {
                obj[i] = null;
            }
        }
        var Disposable = (function () {
            function Disposable() {
                // Will underflow at around 18 quadrillion entities.
                this.disposableId = Disposable.createKeyFromID(Disposable.nextDisposableId++);
                this.objectsToDispose = Object.create(null);
                this.parentDisposalContext = null;
                this.stack = null;
                // currentContext is null by default, so we don't have side effects unless we're
                // in an assertDisposablesInContext block
                if (Disposable.ownershipAssertionContext) {
                    // Get a stack trace of where the user created this if possible.
                    this.stack = (new Error('')).stack;
                    Disposable.ownershipAssertionContext[this.disposableId] = this;
                }
            }
            Disposable.createKeyFromID = function (val) {
                return "disposable-" + val;
            };
            /**
              * Throws an exception if a disposable isn't explicitly added to a disposal
              * context using registerForDisposable.
              * @param {() => void} contextCallback The block of code over which to make the assertion
             **/
            Disposable.assertDisposablesInContext = function (contextCallback) {
                var oldOwnershipAssertionContext = Disposable.ownershipAssertionContext;
                Disposable.ownershipAssertionContext = Object.create(null);
                try {
                    contextCallback();
                    if (Object.keys(Disposable.ownershipAssertionContext).length > 0) {
                        var err = new Error(DataLab.LocalizedResources.disposableNotAssignedOwner);
                        err.attachedContext = Disposable.ownershipAssertionContext;
                        throw err;
                    }
                }
                finally {
                    Disposable.ownershipAssertionContext = oldOwnershipAssertionContext;
                }
            };
            /**
              * Disposable trees must have a root. This function removes one disposable
              * from the assertDisposablesInContext's assertion. If not in such an assertion's
              * scope, this is a NOP.
             **/
            Disposable.exemptFromDiposablesInContextAssertion = function (disposable) {
                if (Disposable.ownershipAssertionContext) {
                    delete Disposable.ownershipAssertionContext[disposable.disposableId];
                }
            };
            /**
              * Adds a list of objects to dispose of when this object is disposed
              * @param {...DataLab.Util.Disposable[]} disposables the objects to dispose
              *                                       when this object is disposed
             **/
            Disposable.prototype.registerForDisposal = function () {
                var _this = this;
                var disposables = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    disposables[_i - 0] = arguments[_i];
                }
                disposables.forEach(function (disposable) {
                    _this.objectsToDispose[disposable.disposableId] = disposable;
                    disposable.parentDisposalContext = _this.objectsToDispose;
                    // This disposable is now owned, so we can remove it from the assertion context
                    if (Disposable.ownershipAssertionContext) {
                        disposable.stack = null;
                        delete Disposable.ownershipAssertionContext[disposable.disposableId];
                    }
                });
            };
            /**
              * Dispose of an object and any objects it owns (recursively)
             **/
            Disposable.prototype.dispose = function () {
                // We're using the assumption that looping over properties works on order of insertion
                // http://stackoverflow.com/questions/280713/elements-order-in-a-for-in-loop
                // Object.keys returns keys in the same order as looping over keys using for i in ...
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
                // (our keys are not integers, so the Chrome exception won't bite us)
                // We want to loop in reverse order to destruct things in the reverse order we added them.
                var keys = Object.keys(this.objectsToDispose);
                for (var i = keys.length - 1; i >= 0; i--) {
                    this.objectsToDispose[keys[i]].dispose();
                }
                // Since we may have been disposed earlier than our parentContext, our parent should
                // no longer be responsible for disposing us.
                if (this.parentDisposalContext) {
                    delete this.parentDisposalContext[this.disposableId];
                }
                if (Util.reduceRetainingTreeVerbosity) {
                    clearObject(this);
                }
            };
            // ***** WARNING ******
            // This won't be fool-proof until KnockoutJS 3 (see note below). Until then, make sure you only 
            // remove elements from the observable array returned by observableArrayOfDisposables() through 
            // the shift / pop / splice methods.
            // ***** WARNING ******
            //
            // Note that we can't create a class that inherits from KnockoutObservableArray<T> b/c the 
            // interface has a CallSignature which can't be implemented by a class.
            Disposable.observableArrayOfDisposables = function (value) {
                var observableArray = ko.observableArray(value);
                // This should be rewritten for KnockoutJS 3 to make use of array subscriptions: 
                // http://blog.stevensanderson.com/2013/10/08/knockout-3-0-release-candidate-available/
                //
                // We can just listen for changes on the array ("arrayChange" event) and call .dispose() on
                // every removed element.  That way, we aren't hard-coding the set of mutations that can 
                // modify the array, which can be incomplete (e.g. if someone just resets the array to a 
                // new array, we won't call dispose on any of the items of the previous array!)
                ["shift", "pop"].forEach(function (methodName) {
                    var oldMethod = observableArray[methodName];
                    observableArray[methodName] = function () {
                        var removed = oldMethod.apply(observableArray, arguments);
                        removed.dispose();
                        return removed;
                    };
                });
                ["splice", "remove", "removeAll"].forEach(function (methodName) {
                    var oldMethod = observableArray[methodName];
                    observableArray[methodName] = function () {
                        var removed = oldMethod.apply(observableArray, arguments);
                        if (removed) {
                            removed.forEach(function (removed) {
                                removed.dispose();
                            });
                        }
                        return removed;
                    };
                });
                var wrapperArray = function (values) {
                    if (Array.isArray(values)) {
                        observableArray.removeAll(); // Make sure everything gets disposed of in the "observable([new array])" case
                    }
                    return observableArray.apply(observableArray, arguments);
                };
                $.extend(wrapperArray, observableArray);
                return wrapperArray;
            };
            // These guys are used to assert that we've assigned the disposable an owner. When
            // in an assert block, all Disposables get put here upon construction. When they get
            // registered for deletion, they get removed. If the assert block finishes and the map
            // is non-empty, something didn't get registered and we throw an exception.
            Disposable.ownershipAssertionContext = null;
            Disposable.nextDisposableId = 0;
            return Disposable;
        })();
        Util.Disposable = Disposable;
        var DisposableSubscription = (function (_super) {
            __extends(DisposableSubscription, _super);
            function DisposableSubscription(subscription) {
                _super.call(this);
                this.subscription = subscription;
            }
            DisposableSubscription.prototype.dispose = function () {
                this.subscription.dispose();
                _super.prototype.dispose.call(this);
            };
            return DisposableSubscription;
        })(Disposable);
        Util.DisposableSubscription = DisposableSubscription;
        var DisposableKnockoutObject = (function (_super) {
            __extends(DisposableKnockoutObject, _super);
            function DisposableKnockoutObject(computed) {
                _super.call(this);
                this.object = computed;
            }
            DisposableKnockoutObject.prototype.dispose = function () {
                this.object.dispose();
                _super.prototype.dispose.call(this);
            };
            return DisposableKnockoutObject;
        })(Disposable);
        Util.DisposableKnockoutObject = DisposableKnockoutObject;
        var DisposableEventListener = (function (_super) {
            __extends(DisposableEventListener, _super);
            function DisposableEventListener(element, type, callback, capture) {
                if (capture === void 0) { capture = false; }
                _super.call(this);
                this.type = type;
                this.element = element;
                this.callback = callback;
                this.capture = capture;
                this.element.addEventListener(this.type, this.callback, this.capture);
            }
            DisposableEventListener.prototype.dispose = function () {
                this.element.removeEventListener(this.type, this.callback, this.capture);
                _super.prototype.dispose.call(this);
            };
            return DisposableEventListener;
        })(Disposable);
        Util.DisposableEventListener = DisposableEventListener;
        /**
          * A disposable timer that can be used multiple times. Will be cancelled if it is disposed prematurely.
         **/
        var DisposableTimer = (function (_super) {
            __extends(DisposableTimer, _super);
            /**
              * Creates and sets a disposable timer
              * @constructor
              * @this {DisposableTimer}
              * @param {number} msec the timer delay in milliseconds.
              * @param {() => void} callback the function that will be called when the timer has elapsed
             **/
            function DisposableTimer(msec, callback) {
                _super.call(this);
                this.defaultDuration = msec;
                this.callback = callback;
            }
            /**
              * Starts the timer. If no duration is supplied, the default is used. If the timer is already
              * counting down, the existing one is cancelled and a new countdown is started.
              * @param {number} msec the timer delay in milliseconds (if not provided, the default is used)
             **/
            DisposableTimer.prototype.start = function (msec) {
                var _this = this;
                if (msec === void 0) { msec = this.defaultDuration; }
                if (this.isCountingDown()) {
                    this.cancel();
                }
                this.timerHandle = setTimeout(function () {
                    _this.timerHandle = null;
                    _this.callback();
                }, msec);
            };
            /**
              * Cancels the timer and stops the execution of the callback function.
             **/
            DisposableTimer.prototype.cancel = function () {
                if (this.isCountingDown()) {
                    clearTimeout(this.timerHandle);
                    this.timerHandle = null;
                }
            };
            DisposableTimer.prototype.isCountingDown = function () {
                return !!this.timerHandle;
            };
            DisposableTimer.prototype.dispose = function () {
                this.cancel();
                _super.prototype.dispose.call(this);
            };
            return DisposableTimer;
        })(Disposable);
        Util.DisposableTimer = DisposableTimer;
        var DisposableKOApplyBindings = (function (_super) {
            __extends(DisposableKOApplyBindings, _super);
            function DisposableKOApplyBindings(viewModel, element) {
                _super.call(this);
                ko.applyBindings(viewModel, element);
                this.element = element;
            }
            DisposableKOApplyBindings.prototype.dispose = function () {
                ko.cleanNode(this.element);
                _super.prototype.dispose.call(this);
            };
            return DisposableKOApplyBindings;
        })(Disposable);
        Util.DisposableKOApplyBindings = DisposableKOApplyBindings;
        var DisposableSetHTML = (function (_super) {
            __extends(DisposableSetHTML, _super);
            function DisposableSetHTML(element, innerHTML) {
                _super.call(this);
                this.element = element;
                this.element.innerHTML = innerHTML;
            }
            /** The contract we have is one control per node, so we can just remove all child nodes.
              * This is significantly easier than trying to track nodes across multiple changes to
              * innerHTML.
             **/
            DisposableSetHTML.prototype.dispose = function () {
                this.element.innerHTML = "";
                _super.prototype.dispose.call(this);
            };
            return DisposableSetHTML;
        })(Disposable);
        Util.DisposableSetHTML = DisposableSetHTML;
    })(Util = DataLab.Util || (DataLab.Util = {}));
})(DataLab || (DataLab = {}));

var DataLab;
(function (DataLab) {
    var Util;
    (function (Util) {
        var Str;
        (function (Str) {
            // Regular expression for matching entries separated by commas or a double quote delimited entry in which all characters, including double quotes and commas, are allowed.
            // (?!\s*$) -- don't match empty
            // (?:"([^"]*(?:[\S\s][^"]*)*)" -- match anything delimited by quotes
            // ([^,"\s]*(?:\s+[^,"\s]+)*)) -- or match things that aren't delimited by quotes and are separated by commas.
            // (?:,|$) -- don't match things that end in a comma.
            var commaSeparatedRegEx = /(?!\s*$)\s*(?:"([^"]*(?:[\S\s][^"]*)*)"|([^,"\s]*(?:\s+[^,"\s]+)*))\s*(?:,|$)/g;
            function getArrayFromCommaSeparatedString(userEnteredColumns) {
                var stripColumn = commaSeparatedRegEx.exec(userEnteredColumns);
                var names = [];
                while (stripColumn != null) {
                    var columnName = stripColumn[1] === undefined ? stripColumn[2] : stripColumn[1];
                    names.push(columnName);
                    stripColumn = commaSeparatedRegEx.exec(userEnteredColumns);
                }
                return names;
            }
            Str.getArrayFromCommaSeparatedString = getArrayFromCommaSeparatedString;
        })(Str = Util.Str || (Util.Str = {}));
    })(Util = DataLab.Util || (DataLab.Util = {}));
})(DataLab || (DataLab = {}));

var DataLab;
(function (DataLab) {
    var Util;
    (function (Util) {
        var File;
        (function (File) {
            function readDataUrlFromBlob(blob) {
                var deferred = $.Deferred();
                var inError = false;
                // Read the file as a data URL
                var dataUrlReader = new FileReader();
                dataUrlReader.onload = function (readFileEvent) {
                    if (!inError) {
                        var dataUrl = readFileEvent.target["result"];
                        deferred.resolve(dataUrl);
                    }
                };
                dataUrlReader.onerror = dataUrlReader.onabort = function () {
                    if (!inError) {
                        inError = true;
                        deferred.reject(this.error);
                    }
                };
                try {
                    dataUrlReader.readAsDataURL(blob);
                }
                catch (e) {
                    return Util.fail(new Error(DataLab.LocalizedResources.imageUploadError_GenericLoading));
                }
                return Util.when(deferred.promise());
            }
            File.readDataUrlFromBlob = readDataUrlFromBlob;
        })(File = Util.File || (Util.File = {}));
    })(Util = DataLab.Util || (DataLab.Util = {}));
})(DataLab || (DataLab = {}));

/// <reference path="DateFormatter.ts" />
/// <reference path="ObjectWithId.ts" />
/// <reference path="Disposable.ts" />
/// <reference path="UtilString.ts" />
/// <reference path="UtilFile.ts" />
var DataLab;
(function (DataLab) {
    var Util;
    (function (Util) {
        // /Date(1343864041000+0001)/
        // /Date(1343864041000-0001)/
        // /Date(-62135596800000+0000)/ (DateTime.MinValue)
        // /Date(1343864041000)/
        var jsonDateRegex = /^\/Date\(([+-]?\d+)([+-]\d+)?\)\/$/;
        // .NET min DateTime constant
        Util.minDate = -62135596800000;
        /**
         * An error class specifically for failed AJAX requests.
         */
        var AjaxError = (function () {
            function AjaxError(message, xhr) {
                this.error = new Error(message);
                this.xmlHttpRequest = xhr;
            }
            Object.defineProperty(AjaxError.prototype, "name", {
                get: function () {
                    return this.error.name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AjaxError.prototype, "message", {
                get: function () {
                    return this.error.message;
                },
                enumerable: true,
                configurable: true
            });
            AjaxError.prototype.toString = function () {
                return String(this.error);
            };
            return AjaxError;
        })();
        Util.AjaxError = AjaxError;
        /**
          * Makes a JQuery promise and opt-out promise. If the user does not explicitly call .fail(), a failure
          * will result in an exception.
          * @param {JQueryPromise} promise the promise we want to turn into opt-out
         **/
        function makePromiseOptOutOfFailures(promise) {
            var optedOut = false;
            promise.fail(function (err) {
                if (!optedOut) {
                    if (err instanceof Error) {
                        throw err;
                    }
                    else {
                        throw new Error("A promise failed with object" + String(err));
                    }
                }
            });
            var oldFailFunction = promise.fail;
            promise.fail = function () {
                optedOut = true;
                return oldFailFunction.apply(promise, arguments);
            };
        }
        function isPromise(val) {
            return val && val.fail && val.fail instanceof Function && val.done && val.done instanceof Function && val.always && val.always instanceof Function;
        }
        function assertIsPromise(val) {
            if (!isPromise(val)) {
                throw new Error("Expected a jQuery-style promise");
            }
        }
        /**
          * This function makes an opt-out-of-failure promise from a $.when. There are two usages:
          *    when(value) - returns an already-resolved promise with the given value
          *    when(promises...) - returns an opt-out promise for the completion of all given promises (like $.when).
          * In the second usage, all parameters must be jQuery promises / DataLab.Util.Promises.
          * Note that $.when does not have that restriction.
          * @param {...any[]} ...deferredList the arguments to $.when. Note that this function assumes
          *   that any object responding to fail, done, and always is a promise because JQuery doesn't
          *   allow checking via instanceof; passing objects with these methods named fail, done, and always
          *   that are not promises has undefined results. Should any parameter be a deferred that has already
          *   rejected, this Util.when will ALWAYS throw an exception that cannot be opted out of.
         **/
        function when() {
            var deferredList = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                deferredList[_i - 0] = arguments[_i];
            }
            // If more that one parameter is provided, we expect that all of them are promises.
            // If exactly one parameter is provided, it's okay for that value to not be a promise,
            // since that usage allows creation of an already-resolve promise from a value.
            if (deferredList.length > 1) {
                deferredList.forEach(assertIsPromise);
            }
            // Opt out of failures on the existing deferreds with opt-out failure
            deferredList.forEach(function (deferred) {
                if (isPromise(deferred)) {
                    deferred.fail(function () {
                    });
                }
            });
            var promise = $.when.apply($, deferredList);
            makePromiseOptOutOfFailures(promise);
            return promise;
        }
        Util.when = when;
        /**
          * This function makes an opt-out-of-failure promise from a JQueryPromise.then().
          * See JQuery promise.then() documentation for more information on arguments 1, 2, 3.
          * Passing the failCallbacks argument opts out of handling.
          * @param {JQueryPromise} promise the promise to apply .then() to. If the promise has already failed,
          *   Util.then will always result in an exception that cannot be opted out of.
          * @param {any} doneCallback the function to call upon success
          * @param {any} failCallback the function to call upon failure
          * @param {any} progressCallback the function to call on
         **/
        function then(promise, doneCallback, failCallback, progressCallback) {
            assertIsPromise(promise);
            //Opt out of failures on the old promise
            promise.fail(function () {
            });
            var thenPromise;
            // Like $.pipe, then supports the done callback returning a 'next' promise (which allows sequencing promises):
            //   then(id => loadThingById(id));
            // If the 'next' promise fails, the overall then-promise will fail. Therefore, we should opt out of failures from
            // the 'next' promise if it is given.
            var doneCallbackWithNextPromiseOptedOut = function () {
                var value = doneCallback.apply(this, arguments);
                if (isPromise(value)) {
                    value.fail(function () {
                    });
                }
                return value;
            };
            thenPromise = promise.then(doneCallbackWithNextPromiseOptedOut, failCallback, progressCallback);
            makePromiseOptOutOfFailures(thenPromise);
            return thenPromise;
        }
        Util.then = then;
        /**
          * Creates a Promise which will be rejected with the given Error when the stack unwinds. This allows
          * for returning immediate failures as promises such that the caller can still explicitly handle the failure.
          *
          * @param {Error} e Error to be passed to the promise's fail callbacks (which must be installed before the stack unwinds)
         **/
        function fail(e) {
            var d = $.Deferred();
            setTimeout(function () { return d.reject(e); });
            return Util.when(d);
        }
        Util.fail = fail;
        /**
          * Creates a Promise which will be resolved with the given value. This makes it easy to mix code that needs to use Util.fail,
          * Since typescript will complain if we try to mix returning values synchronously with returning a promise with Util.fail().
          *
          * @param {value: T} value T to be passed to the promise's resolve callbacks (e.g. .then())
         **/
        function succeed(value) {
            var d = $.Deferred();
            d.resolve(value);
            return Util.when(d.promise());
        }
        Util.succeed = succeed;
        /**
          * Creates a Promise which will be resolved when ALL the promise arguments are resolved, with an array of all the resolved
          * values in the same order as the promise arguments, or rejected when ANY of the promise arguments are rejected.
          *
          * @param {...Promise<T>[]} Array of promises to aggregate
         **/
        function all() {
            var promises = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                promises[_i - 0] = arguments[_i];
            }
            var hasResolvedOrRejected = false;
            var deferred = $.Deferred();
            var allResults = [];
            function isAllResolved() {
                return promises.every(function (promise) { return promise.state() === "resolved"; });
            }
            promises.forEach(function (promise) {
                // Note that this opts-out all the promises passed in from automatic failure handling, since 
                // the aggregate promise returned from this method is an opt-out-of-failure promise.
                promise.fail(function (error) {
                    if (hasResolvedOrRejected) {
                        return;
                    }
                    hasResolvedOrRejected = true;
                    deferred.reject(error);
                });
                promise.done(function (result) {
                    if (hasResolvedOrRejected) {
                        return;
                    }
                    var index = promises.indexOf(promise);
                    allResults[index] = result;
                    if (isAllResolved()) {
                        hasResolvedOrRejected = true;
                        deferred.resolve(allResults);
                    }
                });
            });
            return Util.when(deferred.promise());
        }
        Util.all = all;
        /**
          * Encodes text for non-input elements. Uses Jquery .text() method to encode text on a div element that is created in memory, but it is never appended to the document.
          * @param {input} Text to be encoded.
         **/
        function encodeAsHtml(input) {
            var helperDiv = $('<div />');
            var toReturn = helperDiv.text(input).html();
            return toReturn;
        }
        Util.encodeAsHtml = encodeAsHtml;
        function parseJsonDate(jsonDate) {
            /// <summary>
            ///   Parses ASP's JSON date strings of the form /Date(123)/
            ///   An exception is thrown if the date contains a UTC offset.
            /// </summary>
            /// <param name="s" type="string">ASP-style JSON date string</param>
            /// <returns type="Date"></returns>
            var v = jsonDate.match(jsonDateRegex);
            if (v !== null) {
                // v[0]: full match (jsonDate)
                // v[1]: milliseconds since epoch
                // v[2]: UTC offset or undefined (since it's optional)
                var millis = Number(v[1]);
                if (v[2] !== undefined) {
                    throw "Unexpected UTC offset";
                }
                return new Date(millis);
            }
            else {
                throw "Invalid JSON date format";
            }
        }
        Util.parseJsonDate = parseJsonDate;
        function replaceJsonDates(objOrObjs, propertyNames) {
            /// <summary>
            ///   For the given object (or each in an array of objects), replaces the values of named properties by parsing them as JSON dates.
            ///   The date strings are parsed with parseJsonDate.
            /// </summary>
            /// <param name="objs">Object or array of objects to modify</param>
            /// <param name="propertyNames" type="Array" elementType="string"></param>
            var objs = (objOrObjs instanceof Array) ? objOrObjs : [objOrObjs];
            objs.forEach(function (o) {
                propertyNames.forEach(function (propertyName) {
                    if (!Object.prototype.hasOwnProperty.call(o, propertyName)) {
                        throw "Expected property missing: " + propertyName;
                    }
                    o[propertyName] = parseJsonDate(o[propertyName]);
                });
            });
        }
        Util.replaceJsonDates = replaceJsonDates;
        function formatElapsedTime(milliseconds, millisecondsAfterDecimal) {
            /// <summary>
            ///   Returns a formatted elapsed time in h:m:s.ms, e.g. 4:45:56.251 means 4 hours 45 minutes 56 seconds and 251 milliseconds.
            /// </summary>
            /// <param name="milliseconds" type="number">elapsed time in milliseconds</param>
            /// <param name="millisecondsAfterDecimal" type="number">number of digits (0-20) to show after decimal point
            if (millisecondsAfterDecimal === void 0) { millisecondsAfterDecimal = 3; }
            if (milliseconds < 0) {
                throw new Error("Elapsed time cannot be less than zero.");
            }
            var seconds = millisecondsAfterDecimal === 0 ? Math.floor(milliseconds / 1000) : milliseconds / 1000;
            var hours = Math.floor(seconds / 3600);
            seconds -= hours * 3600;
            var minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;
            return hours + ":" + (minutes < 10 ? "0" + minutes : minutes.toString()) + ":" + (seconds < 10 ? "0" + seconds.toFixed(millisecondsAfterDecimal) : seconds.toFixed(millisecondsAfterDecimal));
        }
        Util.formatElapsedTime = formatElapsedTime;
        function getElapsedTimeMilliseconds(start, end) {
            /// <summary>
            ///   Returns an elapsed time within 24 hours duration in x seconds
            /// </summary>
            /// <param name="start" type="Date>start date</param>
            /// <param name="end" type="Date>end date</param>
            var elapsedTimeMilliseconds = (end.getTime() - start.getTime());
            return elapsedTimeMilliseconds;
        }
        Util.getElapsedTimeMilliseconds = getElapsedTimeMilliseconds;
        function formatDate(date) {
            /// <summary>
            ///   Returns a string representation of a Date conforming to .NET's DateTimeFormat.ShortDatePattern + DateTimeFormat.LongTimePattern format
            /// </summary>
            /// <param name="date" type="Date>javascript Date to format</param>
            /// This requires the DateFormatter.toString() utility (forked from AzureFx)
            if (date.getTime() === Util.minDate) {
                return "-";
            }
            var dateFormatter = new DataLab.Util.DateFormatter(date);
            return (dateFormatter.toString("d") + " " + dateFormatter.toString("T"));
        }
        Util.formatDate = formatDate;
        function formatDataSize(size, precision) {
            if (precision === void 0) { precision = 3; }
            /// <summary>
            ///   Returns a formatted data size to a desired number of significant figures with the suitable unit of measurement (B, KB, MB, GB, TB or PB).
            ///   Follows the same format as the file sizes shown in the status bar at the bottom of Windows explorer.
            /// </summary>
            /// <param name="size" type="number>number of bytes to format</param>
            /// <param name="precision" type="number>number of significant figures, default is 3</param>
            var units = ["bytes", "KB", "MB", "GB", "TB", "PB"];
            if (size < 0) {
                throw new Error("Data size cannot be less than zero.");
            }
            var prefixDivisor = 1;
            var sizeInPrefix;
            for (var i = 0; i < units.length; i++) {
                if (size < 1024 * prefixDivisor || i === units.length - 1) {
                    sizeInPrefix = size / prefixDivisor;
                    if (i === 0 || i === units.length - 1) {
                        // Display integer number if using smallest or largest unit of measurement.
                        return Math.round(sizeInPrefix) + ' ' + units[i];
                    }
                    else {
                        return sizeInPrefix.toPrecision(precision) + ' ' + units[i];
                    }
                }
                prefixDivisor *= 1024;
            }
        }
        Util.formatDataSize = formatDataSize;
        function createReadOnlyView(o) {
            /// <summary>
            ///   Creates a read-only view of a given object or array. The returned view can not have properties modified, added, or removed.
            ///   Changes to the original object are reflected in the read-only view.
            /// </summary>
            return Object.freeze(Object.create(o));
        }
        Util.createReadOnlyView = createReadOnlyView;
        function isObjectEmpty(o) {
            for (var n in o) {
                return false;
            }
            return true;
        }
        Util.isObjectEmpty = isObjectEmpty;
        var sessionId = "DefaultSession";
        /** Sets the global session id. This may only occur once in the application's lifetime. */
        function setSessionId(id) {
            if (sessionId === "DefaultSession") {
                sessionId = id;
            }
            else {
                throw "Cannot set the session ID more than once";
            }
        }
        Util.setSessionId = setSessionId;
        /** Gets the global session id. The session id will change at most once in the application's lifetime
            (from the default session id to one provided, such as at startup).
            @see {setSessionId} */
        function getSessionId() {
            return sessionId;
        }
        Util.getSessionId = getSessionId;
        var currentUID = 0;
        function generateUID() {
            /// <summary>
            ///   Generate unique identifier valid for a single session.
            ///   The identifier is guaranteed to be of the form "UID" + integer.toString()
            /// </summary>
            return sessionId + "-" + (++currentUID);
        }
        Util.generateUID = generateUID;
        function tuple() {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i - 0] = arguments[_i];
            }
            /// <summary>
            ///   Constructs a tuple with a globally unique ID (based on its uniquely identifiable members).
            ///   Calls to tuple with the same arguments (in the same order) will produce the same id (the tuples are equivalent).
            ///   i.e.:
            ///      { tuple(x1, x2, ...).id === tuple(y1, y2, ...).id } <=> { sequences x and y are the same }
            /// </summary>
            // The : separator is guaranteed to not be produced by generateUID. Here we assume that all unique IDs were generated with that function.
            return { id: m.map(function (o) { return o.id; }).join(":") };
        }
        Util.tuple = tuple;
        function randomInt(lowerInclusive, upperInclusive) {
            // We use (upper inclusive - lower inclusive + 1) due to use of floor.
            // Consider lower=0 and upper=1. If we floor anything in [0, 1), we get 0. For anything in [1, 2), we get 1.
            var n = Math.floor(Math.random() * (upperInclusive - lowerInclusive + 1)) + lowerInclusive;
            // Despite Math.random guaranteeing that it will always return a value less than 1, we might get unlucky with
            // floating point rounding in the above calculation.
            return Math.min(upperInclusive, n);
        }
        Util.randomInt = randomInt;
        function forEach(obj, fn) {
            /// <summary>
            ///   Extension of Array.forEach to general objects
            ///   forEach(obj, fn) is similar to array.forEach(fn)
            ///
            ///   fn is called per enumerable key-value pair in obj as fn(value, key, obj)
            ///   The iteration includes keys found in the prototype chain.
            ///
            ///   For arrays, the iteration order is the same as with Array.forEach
            ///   For other objects, the iteration order is undefined.
            ///
            ///   Note that the array.forEach(fn, this) form is not supported;
            ///   Use Function.bind in that case.
            /// </summary>
            if (obj instanceof Array) {
                obj.forEach(fn);
            }
            else if (typeof obj === 'object') {
                for (var k in obj) {
                    // fn(value, index, array), in the array analogy
                    fn(obj[k], k, obj);
                }
            }
            else {
                throw "Expected an Array or Object";
            }
        }
        Util.forEach = forEach;
        function map(obj, fn) {
            /// <summary>
            ///   Extension of Array.map to general objects
            ///   map(obj, fn) is similar to array.map(fn)
            ///
            ///   fn is called per enumerable key-value pair in obj as fn(value, key, obj) and should return
            ///   a mapped value to appear in the result array. The iteration includes keys in the prototype chain.
            ///
            ///   The iteration order follows the same rules as forEach
            ///
            ///   Note that the array.map(fn, this) form is not supported;
            ///   use Function.bind instead.
            /// </summary>
            /// <returns type="Array">Mapped values (one per input key-value pair)</returns>
            if (obj instanceof Array) {
                return obj.map(fn);
            }
            var l = [];
            forEach(obj, function (v, k) {
                l.push(fn(v, k, obj));
            });
            return l;
        }
        Util.map = map;
        function filter(obj, fn) {
            /// <summary>
            ///   Extension of Array.filter to general objects
            ///   filter(obj, fn) is similar to array.filter(fn)
            ///
            ///   fn is called per enumerable key-value pair in obj as fn(value, key, obj) and should a boolean indicating
            ///   if the value should appear in the result array. The iteration includes keys in the prototype chain.
            ///
            ///   The iteration order follows the same rules as forEach
            ///
            ///   Note that the array.filter(fn, this) form is not supported;
            ///   use Function.bind instead.
            /// </summary>
            /// <returns type="Array">Mapped values (one per input key-value pair)</returns>
            if (obj instanceof Array) {
                return obj.filter(fn);
            }
            var l = [];
            forEach(obj, function (v, k) {
                if (fn(v, k, obj)) {
                    l.push(v);
                }
            });
            return l;
        }
        Util.filter = filter;
        function first(obj, fn, default_) {
            if (fn === void 0) { fn = function () { return true; }; }
            if (obj instanceof Array) {
                var a = obj;
                for (var i = 0; i < a.length; i++) {
                    var v = fn(a[i], i, obj);
                    if (v) {
                        return a[i];
                    }
                }
            }
            else if (typeof obj === 'object') {
                for (var k in obj) {
                    var v = fn(obj[k], k, obj);
                    if (v) {
                        return obj[k];
                    }
                }
            }
            else {
                throw "Expected an Array or Object";
            }
            if (typeof default_ === 'undefined') {
                throw "No matching value found";
            }
            else {
                return default_;
            }
        }
        Util.first = first;
        function values(obj) {
            /// <summary>
            ///   Returns the values contained in an array or object. For an array, the values
            ///   are returned in the same order as forEach. The values are returned in a new array.
            /// </summary>
            return map(obj, function (val) { return val; });
        }
        Util.values = values;
        function size(obj) {
            /// <summary>
            ///   Extension of Array.length to general objects
            /// </summary>
            if (obj instanceof Array) {
                return obj.length;
            }
            var c = 0;
            for (var n in obj) {
                c++;
            }
            return c;
        }
        Util.size = size;
        function isEmpty(obj) {
            if (obj instanceof Array) {
                return obj.length === 0;
            }
            for (var key in obj) {
                return false;
            }
            return true;
        }
        Util.isEmpty = isEmpty;
        function clone(obj) {
            var clone = $.extend(true, {}, obj);
            return clone;
        }
        Util.clone = clone;
        function removeElementFromArray(arry, element, throwOnNotFound) {
            if (throwOnNotFound === void 0) { throwOnNotFound = true; }
            for (var index = 0; index < arry.length; index++) {
                if (arry[index] === element) {
                    arry.splice(index, 1);
                    return;
                }
            }
            if (throwOnNotFound) {
                throw new Error("Couldn't find element in array");
            }
        }
        Util.removeElementFromArray = removeElementFromArray;
        function createMockStorageObject() {
            var storage = {};
            Object.defineProperty(storage, "clear", {
                value: function () {
                    for (var key in storage) {
                        delete storage[key];
                    }
                },
                writable: true,
                configurable: true,
                enumerable: false
            });
            Object.defineProperty(storage, "getItem", {
                value: function (key) {
                    return key in storage ? storage[key] : null;
                },
                writable: true,
                configurable: true,
                enumerable: false
            });
            Object.defineProperty(storage, "key", {
                value: function (i) {
                    Object.keys(storage)[i];
                },
                writable: true,
                configurable: true,
                enumerable: false
            });
            Object.defineProperty(storage, "removeItem", {
                value: function (key) {
                    delete storage[key];
                },
                writable: true,
                configurable: true,
                enumerable: false
            });
            Object.defineProperty(storage, "setItem", {
                value: function (key, val) {
                    storage[key] = val;
                },
                writable: true,
                configurable: true,
                enumerable: false
            });
            Object.defineProperty(storage, "length", {
                configurable: false,
                enumerable: false,
                get: function () {
                    return Object.keys(storage).length;
                }
            });
            Object.defineProperty(storage, "remainingSpace", {
                configurable: false,
                enumerable: false,
                get: function () {
                    return Infinity;
                }
            });
            return storage;
        }
        Util.localStorage = createMockStorageObject();
        Util.sessionStorage = createMockStorageObject();
        function format(target) {
            var parameters = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parameters[_i - 1] = arguments[_i];
            }
            return target.replace(/\{[0-9]\}/g, function (match) {
                var matchIndex = parseInt(match.replace("{", "").replace("}", ""));
                if (parameters.length <= matchIndex) {
                    throw new Error("Parameter with index " + matchIndex + " not found");
                }
                return parameters[matchIndex];
            });
        }
        Util.format = format;
        function formatWithPluralOption(num, textSingular, textPlural) {
            if (num === 1) {
                return DataLab.Util.format(textSingular, num.toString());
            }
            else {
                return DataLab.Util.format(textPlural, num.toString());
            }
        }
        Util.formatWithPluralOption = formatWithPluralOption;
        function resurrectDashesInGUID(guid) {
            return guid.slice(0, 8) + "-" + guid.slice(8, 12) + "-" + guid.slice(12, 16) + "-" + guid.slice(16, 20) + "-" + guid.slice(20);
        }
        Util.resurrectDashesInGUID = resurrectDashesInGUID;
        function addSpaceAfterCapitals(stringToModify) {
            var tokens = stringToModify.split(/(?=[A-Z])/);
            return tokens.reduce(function (previous, current) {
                return previous + " " + current;
            }, "");
        }
        Util.addSpaceAfterCapitals = addSpaceAfterCapitals;
        function getAllPropertyNames(objectWithProperties) {
            var properties = [];
            for (var property in objectWithProperties) {
                if (objectWithProperties.hasOwnProperty(property)) {
                    properties.push(property);
                }
            }
            return properties;
        }
        Util.getAllPropertyNames = getAllPropertyNames;
        function reducePrecision(value, maxPrecision) {
            return parseFloat(value.toPrecision(maxPrecision));
        }
        Util.reducePrecision = reducePrecision;
        // returns promise that resolves when observable is/turns true
        function whenTrue(value, parentDisposable) {
            if (parentDisposable === void 0) { parentDisposable = null; }
            var deferred = $.Deferred();
            if (value()) {
                return deferred.resolve().promise();
            }
            else {
                var checkFunc = function (value) {
                    if (value) {
                        subscription.dispose();
                        subscription = null;
                        deferred.resolve();
                    }
                };
                var subscription = value.subscribe(checkFunc);
                if (parentDisposable) {
                    parentDisposable.registerForDisposal(new DataLab.Util.DisposableSubscription(subscription));
                }
                return deferred.promise();
            }
        }
        Util.whenTrue = whenTrue;
        /* An unordered string set class, with constant time insertion, deletion and lookup. */
        var StringSet = (function () {
            function StringSet(initialItems) {
                var _this = this;
                if (initialItems === void 0) { initialItems = []; }
                this.items = Object.create(null);
                this.count = 0;
                initialItems.forEach(function (item) { return _this.add(item); });
            }
            Object.defineProperty(StringSet.prototype, "size", {
                get: function () {
                    return this.count;
                },
                enumerable: true,
                configurable: true
            });
            StringSet.prototype.add = function (item) {
                if (item in this.items) {
                    return false;
                }
                this.items[item] = null;
                this.count++;
                return true;
            };
            StringSet.prototype.has = function (item) {
                return item in this.items;
            };
            StringSet.prototype.delete = function (item) {
                if (item in this.items) {
                    delete this.items[item];
                    this.count--;
                }
            };
            StringSet.prototype.clear = function () {
                this.items = Object.create(null);
                this.count = 0;
            };
            StringSet.prototype.forEach = function (func) {
                var _this = this;
                Util.forEach(this.items, function (value, key) { return func(key, key, _this); });
            };
            StringSet.prototype.map = function (func) {
                var _this = this;
                return Util.map(this.items, function (val, key) { return func(key, key, _this); });
            };
            StringSet.prototype.exceptWith = function (elements) {
                var _this = this;
                elements.forEach(function (e) { return _this.delete(e); });
            };
            StringSet.prototype.unionWith = function (elements) {
                var _this = this;
                elements.forEach(function (e) { return _this.add(e); });
            };
            StringSet.prototype.overlaps = function (elements) {
                var _this = this;
                return elements.some(function (e) { return _this.has(e); });
            };
            StringSet.prototype.setEqual = function (elements) {
                var _this = this;
                return this.count == elements.length && elements.every(function (e) { return _this.has(e); });
            };
            StringSet.prototype.toArray = function () {
                return Object.keys(this.items);
            };
            return StringSet;
        })();
        Util.StringSet = StringSet;
        function initializeTemplateIfNecessary(templateElementId, htmlMarkup, dependancy) {
            if (dependancy) {
                dependancy.forEach(function (component) {
                    registerComponent(component.componentName, component.viewModel, component.template);
                });
            }
            if (!document.getElementById(templateElementId)) {
                var template = htmlMarkup;
                // Insert the markup template into "body". Thus, the caller needs to ensure
                // that the head element needs to be ready before using this control.
                if (!$("head")) {
                    throw "<head> is not ready, make sure you instantiate the control on document ready";
                }
                $("head").append(template);
            }
            return templateElementId;
        }
        Util.initializeTemplateIfNecessary = initializeTemplateIfNecessary;
        function registerComponent(componentName, viewModel, template) {
            if (!ko.components.isRegistered(componentName)) {
                ko.components.register(componentName, {
                    viewModel: viewModel,
                    template: template
                });
            }
        }
        Util.registerComponent = registerComponent;
        // Simpler version of $.param that isn't coded to the wrong spec (http://bugs.jquery.com/ticket/3400)
        function param(obj) {
            return Object.keys(obj).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
            }).join('&');
        }
        Util.param = param;
        function megaBytesToBytes(mB) {
            return mB * 1024 * 1024;
        }
        Util.megaBytesToBytes = megaBytesToBytes;
        function getBytesEncodedInBase64String(base64Text) {
            return base64Text.length / 4 * 3;
        }
        Util.getBytesEncodedInBase64String = getBytesEncodedInBase64String;
        function deferredComputed(readFunc) {
            return ko.computed({
                read: readFunc,
                deferEvaluation: true
            });
        }
        Util.deferredComputed = deferredComputed;
        function getQueryParamValueAndRemoveIfPresent(key) {
            var query = new Shell.Utilities.QueryStringBuilder(window.location.search);
            var isPresent = query.containsKey(key);
            var value;
            if (isPresent) {
                value = query.getValue(key);
                query.remove([key]);
                var queryAsString = query.toString(true);
                queryAsString = queryAsString === "?" ? "" : queryAsString;
                var newUrl = location.protocol + "//" + location.host + location.pathname + queryAsString + location.hash;
                history.replaceState({}, document.title, newUrl);
            }
            return value;
        }
        Util.getQueryParamValueAndRemoveIfPresent = getQueryParamValueAndRemoveIfPresent;
        // Escape strings that are to be used as a regular expression in RexExp. This is same as UxFxImpl private method that does the same.
        function escapeRegExpString(stringToEscape) {
            return stringToEscape.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
        Util.escapeRegExpString = escapeRegExpString;
    })(Util = DataLab.Util || (DataLab.Util = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Util.ts" />
var DataLab;
(function (DataLab) {
    // In a particular session, all instances of ObjectWithId are guaranteed to be unique.
    // This is useful for storing instances in an object (a map of string -> any).
    var ObjectWithId = (function () {
        function ObjectWithId(id) {
            if (id === void 0) { id = null; }
            this.id = id ? id : DataLab.Util.generateUID();
        }
        return ObjectWithId;
    })();
    DataLab.ObjectWithId = ObjectWithId;
})(DataLab || (DataLab = {}));

/// <reference path="Disposable.ts" />
var DataLab;
(function (DataLab) {
    var collectionChangeEventName = "collectionChange";
    (function (CollectionChangeType) {
        CollectionChangeType[CollectionChangeType["add"] = 0] = "add";
        CollectionChangeType[CollectionChangeType["replace"] = 1] = "replace";
        CollectionChangeType[CollectionChangeType["remove"] = 2] = "remove";
    })(DataLab.CollectionChangeType || (DataLab.CollectionChangeType = {}));
    var CollectionChangeType = DataLab.CollectionChangeType;
    function makeObservableMapDisposable(map) {
        // We're going to steal functionality from the Disposable class
        // Construct unionMap as if it were a Disposable, because we want it to be a disposable.
        DataLab.Util.Disposable.apply(map);
        map.dispose = DataLab.Util.Disposable.prototype.dispose.bind(map);
        map.registerForDisposal = DataLab.Util.Disposable.prototype.registerForDisposal.bind(map);
        return map;
    }
    function observableMap() {
        // Since we don't allow 'writes' (i.e. replacement with another object), we can
        // safely hold a reference to the backing data forever.
        var data = Object.create(null);
        var observable = ko.observable(data);
        var count = ko.observable(0);
        var isInModifyBlock = ko.observable(false);
        var map = function () {
            if (arguments.length > 0) {
                throw "observableMaps do not support ko.observable style writes.";
            }
            return DataLab.Util.createReadOnlyView(observable());
        };
        // Used by ko.isObservable (and thus ko.unwrapObserbable) to identify observables
        map.__ko_proto__ = ko.observable;
        function notifyCollectionChange(change) {
            observable.notifySubscribers(change, collectionChangeEventName);
        }
        map.observable = observable;
        map.isInModifyBlock = isInModifyBlock;
        map.lookup = function (key) {
            return data[key];
        };
        map.contains = function (key) {
            return key in data;
        };
        map.put = function (key, value) {
            var hasExistingValue = (key in data);
            var oldValue = data[key];
            var changeType = hasExistingValue ? 1 /* replace */ : 0 /* add */;
            if (!shouldIgnoreChange(value, oldValue) || !hasExistingValue) {
                if (isInModifyBlock() === false) {
                    observable.valueWillMutate();
                }
                data[key] = value;
                if (!hasExistingValue) {
                    map.count(map.count() + 1);
                }
                if (isInModifyBlock() === false) {
                    observable.valueHasMutated();
                }
                notifyCollectionChange({
                    type: changeType,
                    key: key,
                    oldValue: oldValue,
                    newValue: value,
                });
            }
        };
        map.clear = function () {
            map.modify(function () {
                for (var key in data) {
                    map.remove(key);
                }
            });
        };
        map.remove = function (key) {
            if (key in data) {
                if (isInModifyBlock() === false) {
                    observable.valueWillMutate();
                }
                var oldValue = data[key];
                delete data[key];
                map.count(map.count() - 1);
                if (isInModifyBlock() === false) {
                    observable.valueHasMutated();
                }
                notifyCollectionChange({
                    type: 2 /* remove */,
                    key: key,
                    oldValue: oldValue,
                });
            }
        };
        map.modify = function (callback) {
            var needsToReleaseModify = false;
            if (isInModifyBlock() === false) {
                needsToReleaseModify = true;
                isInModifyBlock(true);
                observable.valueWillMutate();
            }
            try {
                callback();
            }
            finally {
                if (needsToReleaseModify) {
                    isInModifyBlock(false);
                    observable.valueHasMutated();
                }
            }
        };
        map.subscribeToCollectionChanges = function (callback) {
            return observable.subscribe(callback, null, collectionChangeEventName);
        };
        map.transform = function (transform) {
            return transformObservableMap(map, transform);
        };
        map.forEach = function (lambda) {
            for (var key in data) {
                lambda(data[key]);
            }
        };
        map.keys = function () {
            return Object.keys(data);
        };
        map.subscribe = function () {
            return observable.subscribe.apply(observable, arguments);
        };
        map.count = count;
        return map;
    }
    DataLab.observableMap = observableMap;
    function observableMapUnion() {
        var maps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            maps[_i - 0] = arguments[_i];
        }
        var unionMap = makeObservableMapDisposable(observableMap());
        // ModifyMap is two way. When reading from it, it returns true if any of the dependant maps are in
        // the modify state. When setting it, it notifies all of the dependant maps that they are in the
        // modify state. Note that writing is N^2, so don't make huge unions.
        var modifyMap = ko.computed({
            read: function () {
                var someParentMapBeingModified = false;
                maps.forEach(function (map) {
                    someParentMapBeingModified = someParentMapBeingModified || map.isInModifyBlock();
                });
                return someParentMapBeingModified;
            },
            write: function (isInModifyBlock) {
                maps.forEach(function (map) {
                    map.isInModifyBlock(isInModifyBlock);
                });
            }
        });
        unionMap.registerForDisposal(new DataLab.Util.DisposableSubscription(modifyMap.subscribe(function (isBeingModified) {
            // There is an assumption here that knockout only notifies subscribers when the value is updated
            // and it is different that the old value. With this assumption, we can imply that if newValue is
            // true, then modifyMap() was previously false and vice versa.
            if (isBeingModified) {
                unionMap.isInModifyBlock(true);
                unionMap.observable.valueWillMutate();
            }
            else {
                unionMap.isInModifyBlock(false);
                unionMap.observable.valueHasMutated();
            }
        })));
        unionMap.modify = function (callback) {
            var needsToReleaseModify = false;
            // Our subscription to modifyMap calls valueWillMutate() and valueHasMutated() for us.
            // We just need to manage setting that to true and false as needed. If none of the parents
            // are locked, we lock all of them. Otherwise, we defer notification responsibility to
            // the one that accepted it.
            if (modifyMap() === false) {
                needsToReleaseModify = true;
                modifyMap(true);
            }
            try {
                callback();
            }
            finally {
                if (needsToReleaseModify) {
                    modifyMap(false);
                }
            }
        };
        function onAdd(key, value) {
            if (unionMap.lookup(key) === undefined) {
                unionMap.put(key, value);
            }
            else {
                throw new Error("Maps in union must have disjoint key sets");
            }
        }
        function onReplace(key, value) {
            // Since this is a replace (not an add), we know that this is an update to the map already providing this key
            // (i.e. the key sets are still disjoint).
            unionMap.put(key, value);
        }
        function onRemove(key) {
            unionMap.remove(key);
        }
        function handleChange(change) {
            switch (change.type) {
                case 0 /* add */:
                    onAdd(change.key, change.newValue);
                    break;
                case 1 /* replace */:
                    onReplace(change.key, change.newValue);
                    break;
                case 2 /* remove */:
                    onRemove(change.key);
                    break;
                default:
                    throw "Unknown collection change type";
            }
        }
        maps.forEach(function (map) {
            DataLab.Util.forEach(map(), function (value, key) { return onAdd(key, value); });
            // We don't own our dependent maps, so we need to dispose of subscriptions
            unionMap.registerForDisposal(new DataLab.Util.DisposableSubscription(map.subscribeToCollectionChanges(function (change) {
                handleChange(change);
            })));
        });
        return unionMap;
    }
    DataLab.observableMapUnion = observableMapUnion;
    function shouldIgnoreChange(a, b) {
        return canIgnoreChangeIfEqual(a) && canIgnoreChangeIfEqual(b) && (a == b);
    }
    function canIgnoreChangeIfEqual(o) {
        return (typeof o !== "object") && (typeof o !== "function");
    }
    function transformObservableMap(map, transform) {
        var transformedMap = makeObservableMapDisposable(observableMap());
        DataLab.Util.forEach(map(), function (v, k) {
            transformedMap.put(k, transform(v, k));
        });
        // We don't own map, so we need to dispose of subscriptions.
        transformedMap.registerForDisposal(new DataLab.Util.DisposableSubscription(map.isInModifyBlock.subscribe(function (parentIsBeingModified) {
            if (parentIsBeingModified) {
                transformedMap.isInModifyBlock(true);
                transformedMap.observable.valueWillMutate();
            }
            else {
                transformedMap.isInModifyBlock(false);
                transformedMap.observable.valueHasMutated();
            }
        })), new DataLab.Util.DisposableSubscription(map.subscribeToCollectionChanges(handleChanges)));
        function handleChanges(change) {
            switch (change.type) {
                case 0 /* add */:
                case 1 /* replace */:
                    transformedMap.put(change.key, transform(change.newValue, change.key));
                    break;
                case 2 /* remove */:
                    transformedMap.remove(change.key);
                    break;
                default:
                    throw "Unknown collection change type";
            }
        }
        return transformedMap;
    }
})(DataLab || (DataLab = {}));

/// <reference path="../ExperimentEditor/TypescriptLib/Knockout.d.ts" />
/// <reference path="../ExperimentEditor/TypescriptLib/Knockout-extensions.d.ts" />
/// <reference path="../ExperimentEditor/TypescriptLib/UxFxScript.d.ts" />
/// <reference path="../../../External/Typescript/jquery.d.ts" />
/// <reference path="Constants.ts" />
/// <reference path="DateFormatter.ts" />
/// <reference path="Logging.ts" />
/// <reference path="ObjectWithId.ts" />
/// <reference path="ObservableMap.ts" />
/// <reference path="Util.ts" />
/// <reference path="UtilString.ts" />
/// <reference path="Disposable.ts" />
/// <reference path="LocalizedResources.d.ts" /> 

var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        function isNumericFeature(featureType) {
            return featureType.lastIndexOf("Numeric", 0) === 0;
        }
        DataContract.isNumericFeature = isNumericFeature;
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
/// <reference path="Contracts/Common/VisualizationContracts.ts" />
var DataLab;
(function (DataLab) {
    var Util;
    (function (Util) {
        function getFeatures(rows) {
            var firstRow = rows[0];
            var features = [];
            for (var i = 0; i < firstRow.length; i++) {
                var featureType = "Numeric";
                for (var j = 1; j < rows.length && featureType === "Numeric"; j++) {
                    if (rows[j][i]) {
                        if (!(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(rows[j][i]))) {
                            featureType = "String";
                        }
                    }
                }
                features.push({
                    name: firstRow[i],
                    featureType: featureType,
                    index: i,
                    elementType: ""
                });
            }
            return features;
        }
        function csvSplit(csvLine) {
            var retArray = [];
            var accumulator = [];
            var commaSplit = csvLine.split(',');
            for (var i = 0; i < commaSplit.length; i++) {
                if ((/^[^\"].*[^\"]$/.test(commaSplit[i]) || /^\".*\"$/.test(commaSplit[i]) || /^[^\"]$/.test(commaSplit[i])) && accumulator.length === 0) {
                    retArray.push(commaSplit[i]);
                }
                else {
                    accumulator.push(commaSplit[i]);
                    if (/.*\"$/.test(commaSplit[i])) {
                        retArray.push(accumulator.join(','));
                        accumulator = [];
                    }
                }
            }
            return retArray;
        }
        function convertCsvToDataTable(csv) {
            var datatable = {
                records: null,
                features: null,
                name: "Converted CSV data",
                numberOfRows: 0,
                numberOfColumns: 0
            };
            var rows = csv.split('\r\n');
            if (rows.length < 2) {
                return null;
            }
            datatable.records = rows.map(function (r) {
                return csvSplit(r);
            });
            datatable.features = getFeatures(datatable.records);
            datatable.records.shift();
            return datatable;
        }
        Util.convertCsvToDataTable = convertCsvToDataTable;
        function calculateStats(datatable) {
            var stats = {
                records: [],
                features: [],
                name: "Dummy statistics",
                numberOfRows: 5,
                numberOfColumns: datatable.features.length
            };
            return stats;
        }
        Util.calculateStats = calculateStats;
    })(Util = DataLab.Util || (DataLab.Util = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
var DataLab;
(function (DataLab) {
    var Util;
    (function (Util) {
        /** A PromiseQueue serializes a dynamic set of asynchronous actions (of the form () => Promise). When
            an action reaches the head of the PromiseQueue, it is called (returning a promise). When
            that promise succeeds or fails, it is removed from the queue. */
        var PromiseQueue = (function () {
            function PromiseQueue() {
                this.queue = [];
            }
            /** Queues an asynchronous action. When at the head of the queue, the action is called (generating a promise).
                The returned promise completes when the queued action has reached the head of the queue and completed.
    
                Promise handlers (done, fail, etc.) which are immediately installed (i.e. within the same call stack
                as 'enqueue') are guaranteed to execute before the next operation in the queue is started.
                */
            PromiseQueue.prototype.enqueue = function (action) {
                var _this = this;
                // The caller wants to know when action() is complete. We don't intend to start action yet,
                // so the promise we return is for the sequence 'wait for start' -> action().
                var atHeadOfQueue = $.Deferred();
                var actionCompleted = Util.then(atHeadOfQueue, function () {
                    // Now that the queued action is the current one, we need to ask for the promise (i.e. start the action).
                    return action();
                }).always(function () {
                    setTimeout(function () {
                        _this.onCurrentQueueItemCompleted();
                    }, 0);
                });
                // atHeadOfQueue is currently an unresolved Deferred. We store it for now, and will resolve it when it
                // reaches the head of the queue.
                this.queue.push(atHeadOfQueue);
                // If it is now the only item in the queue, it must be started here (there's no prior item to wait for).
                if (this.queue.length === 1) {
                    atHeadOfQueue.resolve();
                }
                return actionCompleted;
            };
            PromiseQueue.prototype.onCurrentQueueItemCompleted = function () {
                var current = this.queue.shift();
                if (!current) {
                    throw new Error("Expected a completed operation at the head of the queue.");
                }
                if (this.queue.length >= 1) {
                    this.queue[0].resolve();
                }
            };
            /**
              * Returns the number of promises currently in the queue
              * @return {number} the number of promises currently in the queue
             **/
            PromiseQueue.prototype.size = function () {
                return this.queue.length;
            };
            return PromiseQueue;
        })();
        Util.PromiseQueue = PromiseQueue;
    })(Util = DataLab.Util || (DataLab.Util = {}));
})(DataLab || (DataLab = {}));

var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var WellKnownDataTypeIds;
        (function (WellKnownDataTypeIds) {
            // ID of the 'Any' datatype (accepts any incoming connection)
            WellKnownDataTypeIds.Any = "Any";
        })(WellKnownDataTypeIds = Model.WellKnownDataTypeIds || (Model.WellKnownDataTypeIds = {}));
        var DataType = (function () {
            function DataType(dataTypeId) {
                if (!dataTypeId) {
                    throw new Error("'dataTypeId' is required");
                }
                this.dataTypeId = dataTypeId;
                // Rather than sometimes not having a name, we start with the ID as a baseline.
                this.name = dataTypeId;
                this.description = "";
                this.fileExtension = null;
                this.allowUpload = true;
                this.allowPromotion = true;
                this.allowModelPromotion = false;
            }
            DataType.prototype.areSame = function (other) {
                return other.allowPromotion === this.allowPromotion && other.allowModelPromotion === this.allowModelPromotion && other.allowUpload === this.allowUpload && other.dataTypeId === this.dataTypeId && other.description === this.description && other.fileExtension === this.fileExtension && other.name === this.name;
            };
            DataType.prototype.acceptsConnectionFrom = function (other) {
                // The special rules for the 'Any' type are implied only by its magic ID.
                // The 'Any' type allows connections both to and from anything.
                return (this.areSame(other)) || (this.dataTypeId === WellKnownDataTypeIds.Any) || (other.dataTypeId === WellKnownDataTypeIds.Any);
            };
            DataType.prototype.toString = function () {
                return this.dataTypeId;
            };
            return DataType;
        })();
        Model.DataType = DataType;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var Resource = (function () {
            function Resource(id, created, familyId, serviceVersion) {
                if (created === void 0) { created = new Date(); }
                if (familyId === void 0) { familyId = null; }
                if (serviceVersion === void 0) { serviceVersion = 0; }
                this.description = ko.observable("");
                this.name = ko.observable("");
                this.id = id;
                this.created = created;
                this.familyId = familyId;
                this.serviceVersion = serviceVersion;
                this.isLatest = ko.observable(true);
                this.category = null;
            }
            return Resource;
        })();
        Model.Resource = Resource;
        var DataResource = (function (_super) {
            __extends(DataResource, _super);
            function DataResource(id, dataType, created, familyId, serviceVersion) {
                if (created === void 0) { created = new Date(); }
                if (familyId === void 0) { familyId = null; }
                if (serviceVersion === void 0) { serviceVersion = 0; }
                _super.call(this, id, created, familyId, serviceVersion);
                this.dataType = dataType;
            }
            return DataResource;
        })(Resource);
        Model.DataResource = DataResource;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../../Util.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        ;
        ;
        ;
        /** Parses a string representation of a resource (module / dataset) ID (of the form workspace.family.instance). */
        function parseResourceId(resourceId) {
            var components = resourceId.split(".");
            if (components.length !== 3) {
                throw new Error(DataLab.Util.format(DataLab.LocalizedResources.componentCount, components.length.toString()));
            }
            return {
                workspaceId: components[0],
                familyId: components[1],
                instanceId: components[2]
            };
        }
        DataContract.parseResourceId = parseResourceId;
        /** Parses a string representation of a resource ID ({@see parseResourceId}) and validates that it contains an expected family ID.
            An exception is thrown if the IDs do not agree. */
        function parseResourceIdAndValidateFamily(resourceId, expectedFamilyId) {
            var parsedResourceId = parseResourceId(resourceId);
            if (parsedResourceId.familyId !== expectedFamilyId) {
                throw new DataLab.Log.TracedException(DataLab.LocalizedResources.parseResourceIdAndValidate, "parseResourceIdAndValidateFamily", {
                    resourceId: resourceId,
                    familyId: expectedFamilyId
                });
            }
            return parsedResourceId;
        }
        DataContract.parseResourceIdAndValidateFamily = parseResourceIdAndValidateFamily;
        /** Returns a variant of a resource's family ID that is globally unique (i.e. across workspaces). */
        function createGloballyUniqueFamilyId(parsedResourceId) {
            return parsedResourceId.workspaceId + "." + parsedResourceId.familyId;
        }
        DataContract.createGloballyUniqueFamilyId = createGloballyUniqueFamilyId;
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));



/// <reference path="Common.ts" />
/// <reference path="GraphNode.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        var sampleSubcategoryName = "\\" + DataLab.LocalizedResources.datasetCategorySamples;
        var userSubCategoryName = "\\" + DataLab.LocalizedResources.datasetCategoryUserCreated;
        function deserializeDataset(dataset, dataTypeRegistry) {
            var parsedResourceId = DataContract.parseResourceIdAndValidateFamily(dataset.Id, dataset.FamilyId);
            // To allow a ResourceCache to index modules from multiple workspaces, we construct a globally-unique (rather than workspace-unique) family ID.
            // This is a common scenario since end-user workspaces also semantically contain modules from the global workspace.
            var familyId = DataContract.createGloballyUniqueFamilyId(parsedResourceId);
            var deserializedInputData = new DataLab.Model.Dataset(dataset.Id, dataTypeRegistry.getDataTypeWithId(dataset.DataTypeId), DataLab.Util.parseJsonDate(dataset.CreatedDate), familyId, dataset.ServiceVersion, dataset.VisualizeEndPoint, dataset.SchemaEndPoint, dataset.SchemaStatus);
            var deserializedDataset = deserializeHelper(dataset, deserializedInputData);
            if (dataset.Owner === "Microsoft Corporation") {
                deserializedDataset.category += sampleSubcategoryName;
            }
            else {
                deserializedDataset.category += userSubCategoryName;
            }
            return deserializedDataset;
        }
        DataContract.deserializeDataset = deserializeDataset;
        function deserializeTrainedModel(dataResource, dataTypeRegistry) {
            var parsedResourceId = DataContract.parseResourceIdAndValidateFamily(dataResource.Id, dataResource.FamilyId);
            var familyId = DataContract.createGloballyUniqueFamilyId(parsedResourceId);
            var deserializedInputData = new DataLab.Model.TrainedModel(dataResource.Id, dataTypeRegistry.getDataTypeWithId(dataResource.DataTypeId), DataLab.Util.parseJsonDate(dataResource.CreatedDate), familyId, dataResource.ServiceVersion);
            return deserializeHelper(dataResource, deserializedInputData);
        }
        DataContract.deserializeTrainedModel = deserializeTrainedModel;
        function deserializeTransformModule(dataResource, dataTypeRegistry) {
            var parsedResourceId = DataContract.parseResourceIdAndValidateFamily(dataResource.Id, dataResource.FamilyId);
            var familyId = DataContract.createGloballyUniqueFamilyId(parsedResourceId);
            var deserializedInputData = new DataLab.Model.Transform(dataResource.Id, dataTypeRegistry.getDataTypeWithId(dataResource.DataTypeId), DataLab.Util.parseJsonDate(dataResource.CreatedDate), familyId, dataResource.ServiceVersion);
            return deserializeHelper(dataResource, deserializedInputData);
        }
        DataContract.deserializeTransformModule = deserializeTransformModule;
        function deserializeHelper(dataResource, deserializedInputData) {
            deserializedInputData.name(dataResource.Name);
            deserializedInputData.description(dataResource.Description);
            deserializedInputData.downloadLocation = dataResource.DownloadLocation;
            deserializedInputData.owner = dataResource.Owner;
            deserializedInputData.isLatest(dataResource.IsLatest);
            // Overwrite the size on the endpoint with the size on our contract. The size on the endpoint
            // is always zero and is incorrect.
            if (deserializedInputData.downloadLocation) {
                deserializedInputData.downloadLocation.Size = dataResource.Size;
            }
            // Set origin properties so we can provide adequate deprecation hint to the user
            deserializedInputData.filename = dataResource.UploadedFromFilename;
            // Set output promotion properties so we can provide adequate deprecation hint to the user        
            if (dataResource.PromotedFrom) {
                // Verify format: {workspaceId}.{experimentId}.{moduleNodeId}.{outputname}
                var logError = function () {
                    DataLab.Log.error("Incorrect format for 'PromotedFrom' field: " + dataResource.PromotedFrom);
                };
                // The length of the components is variable depending on if the experiment is a prior run or not.
                // components[0] = workspace id
                // components[1] through length-2 = experiment id 
                // components[length-2] = module id
                // components[length-1] = output name
                var components = dataResource.PromotedFrom.split('.');
                if (components.length < 5) {
                    logError();
                    return deserializedInputData;
                }
                else {
                    var guidRegex = /^[A-F0-9]{32}$/i;
                    var guidWithDashesRegex = /^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}-[A-F0-9]+$/i;
                    if (!(guidRegex.test(components[0]) && guidRegex.test(components[2]))) {
                        logError();
                        return deserializedInputData;
                    }
                    var moduleIdIndex = components.length - 2;
                    if (components[moduleIdIndex] && !(guidWithDashesRegex.test(components[moduleIdIndex]))) {
                        logError();
                        return deserializedInputData;
                    }
                }
                deserializedInputData.experimentId = components.filter(function (value, index) {
                    return index < moduleIdIndex;
                }).join(".");
                deserializedInputData.moduleId = components[moduleIdIndex];
                deserializedInputData.outputName = components.filter(function (value, index) {
                    return index > moduleIdIndex;
                }).join(".");
            }
            return deserializedInputData;
        }
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="DataType.ts" />
/// <reference path="Resource.ts" />
/// <reference path="../Contracts/Common/DataResource.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var Dataset = (function (_super) {
            __extends(Dataset, _super);
            function Dataset(id, dataType, created, familyId, serviceVersion, visualizeEndPoint, schemaEndPoint, schemaStatus) {
                _super.call(this, id, dataType, created, familyId, serviceVersion);
                this.category = DataLab.Constants.ResourceCategory.Dataset;
                this.visualizeEndPoint = visualizeEndPoint;
                this.schemaEndPoint = schemaEndPoint;
                this.schemaStatus = schemaStatus;
            }
            return Dataset;
        })(Model.DataResource);
        Model.Dataset = Dataset;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />

/// <reference path="../Global.refs.ts" />
/// <reference path="../Constants.ts" />
/// <reference path="../Contracts/Common/GraphNode.ts" />
/// <reference path="DataType.ts" />
/// <reference path="GraphNode.ts" />
/// <reference path="ExperimentEvents.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var Constants;
        (function (Constants) {
            var PortState;
            (function (PortState) {
                PortState.Compatible = "compatiblePort";
                PortState.Incompatible = "incompatiblePort";
                PortState.Default = "idlePort";
                PortState.Replaceable = "replaceablePort";
                PortState.CompatibleSnapped = "compatibleSnapped";
                PortState.Selected = "selectedPort";
                PortState.Connected = "connectedPort";
            })(PortState = Constants.PortState || (Constants.PortState = {}));
        })(Constants = Model.Constants || (Model.Constants = {}));
        var Constants;
        (function (Constants) {
            Constants.PortClass = "port";
        })(Constants = Model.Constants || (Model.Constants = {}));
        var Port = (function (_super) {
            __extends(Port, _super);
            function Port(descriptor, ordinal) {
                var _this = this;
                if (ordinal === void 0) { ordinal = 0; }
                _super.call(this);
                this.outputEndpoint = null;
                // parent must be set after construction (so that ports can be constructed in GraphNode constructors).
                this.parent = null;
                this.connectionAdded = new ko.subscribable();
                this.connectionRemoved = new ko.subscribable();
                this.isWebServicePort = false;
                if (!descriptor) {
                    throw "'dataType' parameter is required";
                }
                this.connectedPorts = DataLab.observableMap();
                this.descriptor = descriptor;
                this.ordinal = ordinal;
                this.connectedWebServicePorts = ko.computed(function () {
                    return DataLab.Util.filter(DataLab.Util.values(_this.connectedPorts()), function (port) { return port.isWebServicePort; });
                });
                this.connectedNonWebServicePorts = ko.computed(function () {
                    return DataLab.Util.filter(DataLab.Util.values(_this.connectedPorts()), function (port) { return !port.isWebServicePort; });
                });
                this.isConnected = ko.computed(function () {
                    return !DataLab.Util.isEmpty(_this.connectedNonWebServicePorts());
                });
            }
            Object.defineProperty(Port.prototype, "name", {
                get: function () {
                    return this.descriptor.name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Port.prototype, "friendlyName", {
                get: function () {
                    return this.descriptor.friendlyName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Port.prototype, "optional", {
                get: function () {
                    return this.descriptor.optional;
                },
                enumerable: true,
                configurable: true
            });
            // Effectively 'internal' via IPort_Internal
            Port.prototype.setParent = function (parent) {
                if (this.parent) {
                    throw "Parent GraphNode already set";
                }
                this.parent = parent;
            };
            Port.prototype.isConnectedTo = function (other) {
                return this.connectedPorts.lookup(other.id) !== undefined;
            };
            Port.prototype.compatibilityWithPort = function (other) {
                throw "abstract: compatibilityWithPort";
            };
            Port.prototype.disconnect = function (ports) {
                var _this = this;
                // Snapshot for destructive iteration
                var ports = ports || DataLab.Util.values(this.connectedPorts());
                ports.forEach(function (port) {
                    _this.disconnectFrom(port);
                });
            };
            Port.prototype.disconnectFrom = function (other) {
                this.connectedPorts.remove(other.id);
                other.connectedPorts.remove(this.id);
                this.connectionRemoved.notifySubscribers(createInputOutputPortPair(this, other));
                if (this instanceof InputPort) {
                    this.dirtyStatusInfo.dirty();
                    this.dirtyDraftState.dirty();
                }
                else {
                    other.dirtyStatusInfo.dirty();
                    other.dirtyDraftState.dirty();
                }
            };
            Port.prototype.connectTo = function (other) {
                /// <summary>
                ///   Connects this port to the one given.
                ///   If the ports are not compatible, an exception is thrown. 
                ///   If the ports are already connected, no change is made.
                /// </summary>
                if (!this.isCompatible(other)) {
                    throw "Invalid port connection";
                }
                if (this.isConnectedTo(other)) {
                    return;
                }
                this.connectedPorts.put(other.id, other);
                other.connectedPorts.put(this.id, this);
                this.connectionAdded.notifySubscribers(createInputOutputPortPair(this, other));
                if (this instanceof InputPort) {
                    this.dirtyStatusInfo.dirty();
                    this.dirtyDraftState.dirty();
                }
                else {
                    other.dirtyStatusInfo.dirty();
                    other.dirtyDraftState.dirty();
                }
            };
            Port.prototype.isCompatible = function (other) {
                // In addition to descriptor compatibility, we immediately disallow connections between ports on one node.
                // This is in contrast to edges which form (larger) cycles, which fail validation rather than compatibility.
                if (this.parent !== null && other.parent !== null) {
                    if (this.parent === other.parent) {
                        return false;
                    }
                }
                return this.descriptor.isCompatible(other.descriptor);
            };
            /**
             * Returns true if this port outputs or accepts data that is a Dataset and can be set as a port for publish.
             */
            Port.prototype.isDatasetDataType = function () {
                return !!DataLab.Util.first(this.descriptor.allowedDataTypes, function (outputDataType) {
                    // TODO[1769746]: Replace this constant with something more easily maintainable.
                    return outputDataType.dataTypeId === "Dataset" || outputDataType.dataTypeId === "DataTableDotNet";
                }, null);
            };
            return Port;
        })(DataLab.ObjectWithId);
        Model.Port = Port;
        var InputPort = (function (_super) {
            __extends(InputPort, _super);
            function InputPort(descriptor, ordinal) {
                if (ordinal === void 0) { ordinal = 0; }
                _super.call(this, descriptor, ordinal);
                // The experiment model updates this flag when it detects cycles. We use this because we
                // don't have an explicit connection object in the model.
                this.connectionIsInCycle = ko.observable(false);
                this.isInputPortForPublish = ko.observable(false);
                this.publishIcon = "/Libraries/Images/publish_input_32.svg";
                this.dirtyStatusInfo = new DataLab.Util.Dirtyable();
                this.dirtyDraftState = new DataLab.Util.Dirtyable();
            }
            Object.defineProperty(InputPort.prototype, "connectedOutputPort", {
                get: function () {
                    // An input port may be connected to either nothing or 1 output port.
                    // This accessor exposes that single port (or null) as a convenience.
                    var ports = this.connectedNonWebServicePorts();
                    if (ports.length === 0) {
                        return null;
                    }
                    else if (ports.length === 1) {
                        return ports[0];
                    }
                    else {
                        throw "InputPort has multiple connections, but should have either 0 or 1.";
                    }
                },
                enumerable: true,
                configurable: true
            });
            InputPort.prototype.compatibilityWithPort = function (other) {
                if (this.isCompatible(other)) {
                    return DataLab.Model.Constants.PortState.Compatible;
                }
                else {
                    return other instanceof InputPort ? Constants.PortState.Default : Constants.PortState.Incompatible;
                }
            };
            InputPort.prototype.connectTo = function (other) {
                if (this.isConnected() && !other.isWebServicePort) {
                    throw new Error("Trying to put more than one connection on an input port.");
                }
                if (!(other instanceof OutputPort)) {
                    throw new Error("Can't connect an input port to anything other than an output port.");
                }
                _super.prototype.connectTo.call(this, other);
            };
            /**
             * Compares this to a provided clean input port and dirties this if they are not equal for the sake of status updating
             */
            InputPort.prototype.dirtyIfNeeded = function (cleanPort) {
                var _this = this;
                if (this.connectedPorts.count() !== cleanPort.connectedPorts.count()) {
                    this.dirtyStatusInfo.dirty();
                }
                else {
                    cleanPort.connectedPorts.forEach(function (cleanConnected) {
                        // Cloned ports have different Id's but cloned modules retain their Id's. The parent module
                        // Id is used along with the port name to verify the connected ports are equivalent.
                        var found = false;
                        _this.connectedPorts.forEach(function (thisConnected) {
                            if (cleanConnected.name === thisConnected.name && cleanConnected.parent.id === thisConnected.parent.id) {
                                found = true;
                            }
                        });
                        if (!found) {
                            _this.dirtyStatusInfo.dirty();
                        }
                    });
                }
            };
            return InputPort;
        })(Port);
        Model.InputPort = InputPort;
        var OutputPort = (function (_super) {
            __extends(OutputPort, _super);
            function OutputPort() {
                _super.apply(this, arguments);
                this.isOutputPortForPublish = ko.observable(false);
                this.publishIcon = "/Libraries/Images/publish_output_32.svg";
                this.trainGenericModelIcon = "/Libraries/Images/trained_model_24.svg";
            }
            OutputPort.prototype.compatibilityWithPort = function (other) {
                if (this.isCompatible(other)) {
                    return other.isConnected() ? DataLab.Model.Constants.PortState.Replaceable : DataLab.Model.Constants.PortState.Compatible;
                }
                else {
                    return other instanceof OutputPort ? DataLab.Model.Constants.PortState.Default : DataLab.Model.Constants.PortState.Incompatible;
                }
            };
            OutputPort.prototype.connectTo = function (other) {
                if (other.isConnected() && !this.isWebServicePort) {
                    throw new Error("Trying to put more than one connection on an output port");
                }
                if (!(other instanceof InputPort)) {
                    throw new Error("Can't connect an output port to anything other than an input port.");
                }
                _super.prototype.connectTo.call(this, other);
            };
            /**
             * Returns true if this output port is of type Dataset, DataTableDotNet, or ILearnerDotNet and can be visualized.
             */
            OutputPort.prototype.isVisualizable = function () {
                return !!DataLab.Util.first(this.descriptor.allowedDataTypes, function (outputDataType) {
                    // TODO[1769746]: Replace this constant with something more easily maintainable.
                    return outputDataType.dataTypeId === "Dataset" || outputDataType.dataTypeId === "DataTableDotNet" || outputDataType.dataTypeId === "ILearnerDotNet";
                }, null);
            };
            OutputPort.prototype.isTrainModulePort = function () {
                if (this.parent instanceof Model.ModuleNode) {
                    var moduleNode = this.parent;
                    if (moduleNode.module_.category === DataLab.Constants.ResourceCategory.TrainModule) {
                        return this.descriptor.allowedDataTypes.filter(function (outputDataType) {
                            return !outputDataType.allowModelPromotion;
                        }).length === 0;
                    }
                }
                return false;
            };
            OutputPort.prototype.isTransformPort = function () {
                if (this.parent instanceof Model.ModuleNode) {
                    var moduleNode = this.parent;
                    if (moduleNode.module_.category === DataLab.Constants.ResourceCategory.Transform) {
                        return this.descriptor.allowedDataTypes.filter(function (outputDataType) {
                            return !outputDataType.allowModelPromotion;
                        }).length === 0;
                    }
                }
                return false;
            };
            OutputPort.prototype.isTransformProducerPort = function () {
                if (this.parent instanceof Model.ModuleNode) {
                    return this.descriptor.allowedDataTypes.filter(function (outputDataType) {
                        return outputDataType.dataTypeId === DataLab.Constants.WellKnownDataTypeId.ITransformDotNet;
                    }).length === 1;
                }
                return false;
            };
            return OutputPort;
        })(Port);
        Model.OutputPort = OutputPort;
        function createInputOutputPortPair(a, b) {
            if (a instanceof InputPort && b instanceof OutputPort) {
                return {
                    input: a,
                    output: b
                };
            }
            else if (a instanceof OutputPort && b instanceof InputPort) {
                return {
                    input: b,
                    output: a
                };
            }
            else {
                throw "Expected one InputPort and one OutputPort";
            }
        }
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="Port.ts" />
/// <reference path="../Validation.ts" />
/// <reference path="../Util.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var GraphNode = (function (_super) {
            __extends(GraphNode, _super);
            function GraphNode(ports, id) {
                var _this = this;
                if (id === void 0) { id = null; }
                _super.call(this, id);
                this.x = ko.observable(0);
                this.y = ko.observable(0);
                this.height = ko.observable(0);
                this.width = ko.observable(0);
                this.comment = ko.observable("");
                this.commentCollapsed = ko.observable(true);
                this.balloonMessage = ko.observable("");
                this.parent = null;
                // Create port maps with no prototype, so e.g. ports["toString"] is undefined.
                this.ports = Object.create(null);
                this.inputPorts = Object.create(null);
                this.outputPorts = Object.create(null);
                this.dirtyDraftState = new DataLab.Util.Dirtyable();
                this.dirtySinceLastRun = new DataLab.Util.Dirtyable();
                this.dirtyForPublish = new DataLab.Util.Dirtyable();
                this.dirtyDraftState.addChild(this.dirtySinceLastRun);
                this.dirtySinceLastRun.isDirty.subscribe(function (dirty) {
                    if (dirty) {
                        _this.dirtyForPublish.dirty();
                    }
                });
                this.x.subscribe(function () {
                    _this.dirtyDraftState.dirty();
                });
                this.y.subscribe(function () {
                    _this.dirtyDraftState.dirty();
                });
                this.comment.subscribe(function () {
                    // Don't allow empty comments and trim initial and final white space.
                    _this.comment(_this.comment().trim());
                    _this.dirtyDraftState.dirty();
                });
                ports.forEach(function (port) {
                    if (port.name in _this.ports) {
                        throw DataLab.Util.format(DataLab.LocalizedResources.duplicatePortName, port.name);
                    }
                    _this.ports[port.name] = port;
                    if (port instanceof Model.InputPort) {
                        _this.inputPorts[port.name] = port;
                    }
                    else if (port instanceof Model.OutputPort) {
                        _this.outputPorts[port.name] = port;
                    }
                    else {
                        throw DataLab.LocalizedResources.unknownPortType;
                    }
                    port.setParent(_this);
                    port.connectionAdded.subscribe(function (e) { return _this.onPortConnectionAdded(e); });
                    port.connectionRemoved.subscribe(function (e) { return _this.onPortConnectionRemoved(e); });
                });
                // Port maps should be immutable after construction.
                Object.freeze(this.ports);
                Object.freeze(this.inputPorts);
                Object.freeze(this.outputPorts);
            }
            /**
              * Validate the graph node.
              * @return {string} a string containing the error or null if no error exists
             **/
            GraphNode.prototype.validate = function () {
                return [];
            };
            GraphNode.prototype.startValidating = function () {
            };
            Object.defineProperty(GraphNode.prototype, "name", {
                get: function () {
                    throw new Error(DataLab.LocalizedResources.nameIsAbstract);
                },
                enumerable: true,
                configurable: true
            });
            GraphNode.prototype.remove = function () {
                DataLab.Util.forEach(this.ports, function (p) { return p.disconnect(); });
                if (this.parent) {
                    this.parent._removeNode(this);
                    this.parent = null;
                }
            };
            Object.defineProperty(GraphNode.prototype, "description", {
                get: function () {
                    return "";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GraphNode.prototype, "owner", {
                get: function () {
                    return "";
                },
                enumerable: true,
                configurable: true
            });
            GraphNode.prototype.replaceWith = function (other, incompatibleConnections) {
                if (!this.parent) {
                    throw new Error(DataLab.LocalizedResources.nodeCannotReplaceOutsideExperiment);
                }
                if (other.parent) {
                    throw new Error(DataLab.LocalizedResources.nodeCannotReplaceAlreadyInExperiment);
                }
                this.parent.addNode(other, this.x(), this.y());
                if (this.comment() !== "") {
                    other.comment(this.comment());
                    other.commentCollapsed(this.commentCollapsed());
                }
                DataLab.Util.forEach(this.ports, function (thisPort) {
                    if (thisPort.name in other.ports) {
                        var otherPort = other.ports[thisPort.name];
                        // We use Util.values here to snapshot connectedPorts. We're modifying the set of connected ports in the loop body.
                        DataLab.Util.forEach(DataLab.Util.values(thisPort.connectedPorts()), function (thisPortConnection) {
                            thisPort.disconnectFrom(thisPortConnection);
                            if (otherPort.isCompatible(thisPortConnection)) {
                                otherPort.connectTo(thisPortConnection);
                            }
                            else {
                                // if the connection is now incompatible, record this to try to reconstruct it if the 
                                // other module is upgraded later and connection is possible again
                                if (incompatibleConnections[thisPortConnection.id]) {
                                    incompatibleConnections[thisPortConnection.id].push(otherPort);
                                }
                                else {
                                    incompatibleConnections[thisPortConnection.id] = [otherPort];
                                }
                            }
                        });
                        // Try to reconstruct connections to this module that were broken when upgrading other modules 
                        if (incompatibleConnections[thisPort.id]) {
                            incompatibleConnections[thisPort.id].forEach(function (currentPort) {
                                if (otherPort.isCompatible(currentPort)) {
                                    otherPort.connectTo(currentPort);
                                }
                            });
                            delete incompatibleConnections[thisPort.id];
                        }
                    }
                });
                other.dirtyDraftState.startDirtying();
                other.dirtySinceLastRun.startDirtying();
                other.dirtyForPublish.startDirtying();
                this._onReplacing(other);
                this.remove();
            };
            /** Subclasses can override this to copy over additional information when this node is being replaced with another
                (possibly of a different type). */
            GraphNode.prototype._onReplacing = function (other) {
            };
            GraphNode.prototype.onPortConnectionAdded = function (e) {
                if (this.parent) {
                    this.parent.connectionAdded.notifySubscribers(e);
                }
                else {
                    throw new Error(DataLab.LocalizedResources.nodeCannotConnectOutsideExperiment);
                }
            };
            GraphNode.prototype.onPortConnectionRemoved = function (e) {
                if (this.parent) {
                    this.parent.connectionRemoved.notifySubscribers(e);
                }
                else {
                    throw DataLab.LocalizedResources.nodeCannotDisconnectOutsideExperiment;
                }
            };
            return GraphNode;
        })(DataLab.ObjectWithId);
        Model.GraphNode = GraphNode;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
/// <reference path="Model/GraphNode.ts" />
var DataLab;
(function (DataLab) {
    var Validation;
    (function (Validation) {
        var ValidationThrottleRate = 400;
        ;
        function validatableObservable(val, validationFunction) {
            var observable;
            if (ko.isObservable(val)) {
                observable = val;
            }
            else {
                observable = ko.observable(val);
            }
            var isValidating = ko.observable(false);
            // Anytime the observable updates, update the error message
            var errorMessage = ko.observable(null);
            var isUpToDate = true;
            observable.subscribe(function () {
                isUpToDate = false;
                setTimeout(function () {
                    if (!isUpToDate) {
                        observable.validate();
                    }
                }, ValidationThrottleRate);
            });
            observable.validate = function () {
                isUpToDate = true;
                if (isValidating()) {
                    var error = validationFunction(observable());
                    errorMessage(error);
                    (observable.isValid)(!error);
                    return error ? [error] : [];
                }
                else {
                    return [];
                }
            };
            observable.isValid = ko.observable(true);
            observable.errorMessage = errorMessage;
            observable.startValidating = function () {
                isValidating(true);
                observable.validate();
            };
            return observable;
        }
        Validation.validatableObservable = validatableObservable;
        var PropertyMinValidator = (function () {
            /**
              * @constructor
              * Validates that a value is greater than or equal to a minimum value.
              * @param {number} min the minimum value a valid value can be.
             **/
            function PropertyMinValidator(min) {
                this.min = min;
            }
            /**
              * Verifies that value is >= the minimum the validator allows.
              * @param {string} value the value to evaluate
              * @return {string} the error message if value is NaN or less than the minimum or null if
              *                  the value is valid
              * @see IPropertyValidator
             **/
            PropertyMinValidator.prototype.validate = function (value) {
                if (!value) {
                    return null;
                }
                if (isNaN(parseFloat(value))) {
                    return DataLab.Util.format(DataLab.LocalizedResources.validationValueIsNotAValidNumberGreaterThan, value, this.min.toString());
                }
                var valueAsNumber = parseFloat(value);
                return this.min <= valueAsNumber ? null : DataLab.Util.format(DataLab.LocalizedResources.validationValueIsLessThanMinimumOf, value, this.min.toString());
            };
            return PropertyMinValidator;
        })();
        Validation.PropertyMinValidator = PropertyMinValidator;
        var PropertyMaxValidator = (function () {
            /**
              * @constructor
              * Validates that a value is less than or equal to a maximum value.
              * @param {number} max the maximum value a valid value can be.
             **/
            function PropertyMaxValidator(max) {
                this.max = max;
            }
            /**
              * Verifies that value is <= the maximum the validator allows.
              * @param {string} value the value to evaluate
              * @return {string} the error message if value is NaN or greater than the maximum or null if
              *                  the value is valid
              * @see IPropertyValidator
             **/
            PropertyMaxValidator.prototype.validate = function (value) {
                if (!value) {
                    return null;
                }
                if (isNaN(parseFloat(value))) {
                    return DataLab.Util.format(DataLab.LocalizedResources.validationValueIsNotAValidNumberLessThan, value, this.max.toString());
                }
                var valueAsNumber = parseFloat(value);
                return this.max >= valueAsNumber ? null : DataLab.Util.format(DataLab.LocalizedResources.validationValueIsGreaterThanMaximumOf, value, this.max.toString());
            };
            return PropertyMaxValidator;
        })();
        Validation.PropertyMaxValidator = PropertyMaxValidator;
        var PropertyValuesValidator = (function () {
            /**
              * @constructor
              * Validates that a given value exists in a set of values.
              * @param {string[]} requiredValues the set of values in which a validated value should reside.
             **/
            function PropertyValuesValidator(allowedValues) {
                this.allowedValues = allowedValues;
            }
            /**
              * Verifies that value is in the set of required values.
              * @param {string} value the value to evaluate
              * @return {string} the error message if the value is not in the set or null if
              *                  the value is valid
              * @see IPropertyValidator
             **/
            PropertyValuesValidator.prototype.validate = function (value) {
                var matches = false;
                var listString = "";
                this.allowedValues.forEach(function (requiredValue) {
                    // We use == here because casting between string and number is acceptable
                    if (value == requiredValue.value && requiredValue.displayValue !== DataLab.LocalizedResources.choiceParameterPleaseSelectValue) {
                        matches = true;
                    }
                    if (requiredValue.value !== DataLab.LocalizedResources.choiceParameterPleaseSelectValue) {
                        listString += requiredValue.displayValue + ", ";
                    }
                });
                if (!matches) {
                    return DataLab.Util.format(DataLab.LocalizedResources.validationTheValueDoesNotMatchTheFollowing, value, listString.substring(0, listString.length - 2)); // Remove trailing comma
                }
                return null;
            };
            return PropertyValuesValidator;
        })();
        Validation.PropertyValuesValidator = PropertyValuesValidator;
        var RequiredValueValidator = (function () {
            function RequiredValueValidator() {
            }
            /**
              * Verifies a value is given.
              * @param {string} value the value to ensure is provided
              * @return {string} "Value required." if the value is missing or null otherwise.
              * @see IPropertyValidator
             **/
            RequiredValueValidator.prototype.validate = function (value) {
                return value ? null : DataLab.LocalizedResources.validationValueRequired;
            };
            return RequiredValueValidator;
        })();
        Validation.RequiredValueValidator = RequiredValueValidator;
        var IntegerValidator = (function () {
            function IntegerValidator() {
            }
            /**
              * Verifies whether a given value is a valid integer (i.e. optional + or -, digits only).
              * @param {string} value the string to validate
              * @return {string} the error message if the value is not an integer, or null if valid.
             **/
            IntegerValidator.prototype.validate = function (value) {
                var integer = /^(^[-+]?[0-9]+)?$/;
                return integer.test(value) ? null : DataLab.LocalizedResources.validationValueIsNotAValidInteger;
            };
            return IntegerValidator;
        })();
        Validation.IntegerValidator = IntegerValidator;
        var FloatValidator = (function () {
            function FloatValidator() {
            }
            /**
              * Verifies whether a given value is a valid floating point number.
              * @param {string} value the string to validate
              * @return {string} the error message if the value is not a float, or null if valid.
             **/
            FloatValidator.prototype.validate = function (value) {
                // Number(value) returns NaN if value is not a valid float.
                // We explicitly check for "NaN" because we want to accept NaN as a valid float.
                return (value !== "NaN" && isNaN(Number(value))) ? DataLab.LocalizedResources.validationValueIsNotAValidFloatingPointNumber : null;
            };
            return FloatValidator;
        })();
        Validation.FloatValidator = FloatValidator;
        var WorkspaceNameValidator = (function () {
            function WorkspaceNameValidator() {
            }
            /**
              * Verifies whether a given workspace name is valid.
              * @param {string} the string to validate
              * @return {string} the error message if the string is empty or contains invalid characters,
              *                  or null if the value is valid
              *
             **/
            WorkspaceNameValidator.prototype.validate = function (value) {
                var validWorkspaceName = DataLab.Constants.WorkspaceNameRegex;
                if (!value) {
                    return DataLab.LocalizedResources.workspaceNameCannotBeEmpty;
                }
                return validWorkspaceName.test(value) ? null : DataLab.LocalizedResources.workspaceNameInvalidErrorMessage;
            };
            return WorkspaceNameValidator;
        })();
        Validation.WorkspaceNameValidator = WorkspaceNameValidator;
    })(Validation = DataLab.Validation || (DataLab.Validation = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var StaticProperty = (function () {
            function StaticProperty(name, value) {
                this.value = value;
                this.name = name;
                this.label = name;
                this.tooltip = name;
            }
            return StaticProperty;
        })();
        Model.StaticProperty = StaticProperty;
        var EditableTextProperty = (function (_super) {
            __extends(EditableTextProperty, _super);
            // Creates an Editable Text Property for an experiment
            function EditableTextProperty(name, placeholderText, value, experiment) {
                _super.call(this, name, value);
                this.placeholderText = placeholderText;
                if (experiment) {
                    this.value.subscribe(function () {
                        experiment.dirtyStatus.dirty();
                        experiment.dirtyForPublishStatus.dirty();
                    });
                }
            }
            return EditableTextProperty;
        })(StaticProperty);
        Model.EditableTextProperty = EditableTextProperty;
        var LinkProperty = (function (_super) {
            __extends(LinkProperty, _super);
            function LinkProperty(name, value) {
                _super.call(this, name, ko.observable(value));
            }
            return LinkProperty;
        })(StaticProperty);
        Model.LinkProperty = LinkProperty;
        var ButtonProperty = (function (_super) {
            __extends(ButtonProperty, _super);
            function ButtonProperty(name, value) {
                _super.call(this, name, ko.observable(value));
            }
            return ButtonProperty;
        })(StaticProperty);
        Model.ButtonProperty = ButtonProperty;
        var EndpointProperty = (function (_super) {
            __extends(EndpointProperty, _super);
            /**
              * @constructor
              * Makes an endpoint property, which has the endpoint's URL as its value
              * @param {KnockoutObservable} endpoint
             **/
            function EndpointProperty(name, endpoint) {
                var _this = this;
                _super.call(this, name, endpoint() ? endpoint().BaseUri + endpoint().Location + endpoint().AccessCredential : "");
                this.endpoint = endpoint;
                this.endpoint.subscribe(function () {
                    _this.value(endpoint() ? endpoint().BaseUri + endpoint().Location + endpoint().AccessCredential : "");
                });
            }
            return EndpointProperty;
        })(LinkProperty);
        Model.EndpointProperty = EndpointProperty;
        var DisplayEndpointProperty = (function (_super) {
            __extends(DisplayEndpointProperty, _super);
            /**
              * @constructor
              * Makes a displayEndpoint property, which has the endpoint's URL as its value and an ID wich can be used to id the view model and view that should be used to display it
              * @param {KnockoutObservable} endpoint
             **/
            function DisplayEndpointProperty(name, id, endpoint) {
                var _this = this;
                _super.call(this, name, endpoint() ? endpoint().BaseUri + endpoint().Location + endpoint().AccessCredential : "");
                this.id = id;
                this.endpoint = endpoint;
                this.endpoint.subscribe(function () {
                    _this.value(endpoint() ? endpoint().BaseUri + endpoint().Location + endpoint().AccessCredential : "");
                });
            }
            return DisplayEndpointProperty;
        })(ButtonProperty);
        Model.DisplayEndpointProperty = DisplayEndpointProperty;
        var BooleanProperty = (function () {
            // Creates a boolean setting for an experiment
            function BooleanProperty(name, label, tooltip, value, experiment) {
                this.value = value;
                this.name = name;
                this.label = label;
                this.tooltip = tooltip;
                if (experiment) {
                    this.value.subscribe(function () {
                        experiment.dirtyStatus.dirty();
                        experiment.dirtyForPublishStatus.dirty();
                    });
                }
            }
            return BooleanProperty;
        })();
        Model.BooleanProperty = BooleanProperty;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var CredentialStore;
        (function (CredentialStore) {
            CredentialStore.storeClient;
            function throwOnNoClient() {
                if (!CredentialStore.storeClient) {
                    throw new Error(DataLab.LocalizedResources.cannotRefresh);
                }
            }
            function initialize(client) {
                CredentialStore.storeClient = client;
            }
            CredentialStore.initialize = initialize;
            // Optimized listing of credentials, if there is a request to list credentials while other list credentials operation is in progress
            // do not list again, reuse result of first operation
            var listDeferred = null;
            function listCredentials() {
                throwOnNoClient();
                var listReturn = listDeferred;
                if (!listDeferred) {
                    listReturn = listDeferred = $.Deferred();
                    CredentialStore.storeClient.listCredentials().done(function (credentials) {
                        listDeferred.resolve(credentials);
                        listDeferred = null;
                    });
                }
                return listReturn;
            }
            CredentialStore.listCredentials = listCredentials;
            function compareCredentials(credential1, credential2) {
                if (credential1.Type != credential2.Type) {
                    return false;
                }
                if (credential1.Parts.length != credential2.Parts.length) {
                    return false;
                }
                for (var i = 0; i < credential1.Parts.length; i++) {
                    if (credential1.Parts[i].Name != credential2.Parts[i].Name || credential1.Parts[i].Value != credential2.Parts[i].Value) {
                        return false;
                    }
                }
                return true;
            }
            // This is optimized verify credential service call, it uses result of list operation which will be run when experiment is loaded / refreshed
            function verifyCredential(credential) {
                if (!listDeferred) {
                    return CredentialStore.storeClient.verifyCredential(credential);
                }
                else {
                    return DataLab.Util.then(listDeferred, function (credentials) {
                        var foundCredential = DataLab.Util.first(credentials, function (credentialFromService) {
                            return compareCredentials(credentialFromService, credential);
                        }, null);
                        return DataLab.Util.when(!!foundCredential);
                    });
                }
            }
            CredentialStore.verifyCredential = verifyCredential;
        })(CredentialStore = Model.CredentialStore || (Model.CredentialStore = {}));
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Common.ts" />
/// <reference path="GraphNode.ts" />
/// <reference path="../../Model/ModuleParameterDescriptor.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        function deserializeModule(module_, dataTypeRegistry) {
            var scriptDefaults = Object.create(null);
            if (module_.ScriptsDefaultContents) {
                module_.ScriptsDefaultContents.forEach(function (v) {
                    scriptDefaults[v.Name] = v.Value;
                });
            }
            var parameterDescriptors = module_.ModuleInterface.Parameters.map(function (parameterDef) { return deserializeModuleParameterDescriptor(parameterDef, scriptDefaults, module_.CloudSystem); });
            var inputPortDescriptors = module_.ModuleInterface.InputPorts.map(function (p) {
                var allowedDataTypes = p.Types.map(function (d) { return dataTypeRegistry.getDataTypeWithId(d.Id); });
                return new DataLab.Model.ModuleInputPortDescriptor(p.Name, p.FriendlyName, allowedDataTypes, p.IsOptional);
            });
            var outputPortDescriptors = module_.ModuleInterface.OutputPorts.map(function (p) {
                var descriptor = new DataLab.Model.ModuleOutputPortDescriptor(p.Name, p.FriendlyName, dataTypeRegistry.getDataTypeWithId(p.Type.Id), p.IsOptional);
                descriptor.schemaPropagationRule = DataLab.Model.getSchemaPropagationRule(module_.Name, p.Name);
                return descriptor;
            });
            var portDescriptors = inputPortDescriptors.concat(outputPortDescriptors);
            // Data reference modules share a family ID, but are unrelated (and all have the same version number).
            // Here we treat modules with that well-known family ID as unrelated (null family id has that effect).
            // To allow a ResourceCache to index modules from multiple workspaces, we construct a globally-unique (rather than workspace-unique) family ID.
            // This is a common scenario since end-user workspaces also semantically contain modules from the global workspace.
            var familyId = module_.FamilyId === DataContract.DataReferenceModuleFamilyId ? null : DataContract.createGloballyUniqueFamilyId(DataContract.parseResourceIdAndValidateFamily(module_.Id, module_.FamilyId));
            var deserializedModule = new DataLab.Model.Module(module_.Id, module_.Category, portDescriptors, parameterDescriptors, DataLab.Util.parseJsonDate(module_.CreatedDate), familyId, module_.ServiceVersion);
            deserializedModule.description(module_.Description);
            deserializedModule.name(module_.Name);
            deserializedModule.isLatest(module_.IsLatest);
            deserializedModule.owner = module_.Owner;
            deserializedModule.clientVersion = module_.ClientVersion ? module_.ClientVersion : "";
            return deserializedModule;
        }
        DataContract.deserializeModule = deserializeModule;
        function deserializeModuleParameterDescriptor(parameterDef, scriptDefaults, cloudSystemString) {
            if (scriptDefaults === void 0) { scriptDefaults = Object.create(null); }
            if (cloudSystemString === void 0) { cloudSystemString = null; }
            var defaultValue;
            if (parameterDef.HasDefaultValue) {
                defaultValue = parameterDef.DefaultValue;
            }
            else if (parameterDef.ParameterType === DataContract.ModuleParameterType.Script && parameterDef.Name in scriptDefaults) {
                defaultValue = scriptDefaults[parameterDef.Name];
            }
            if (parameterDef.ParameterType === DataContract.ModuleParameterType.Enumerated) {
                var modeValuesInfo = null;
                if (parameterDef.ModeValuesInfo) {
                    modeValuesInfo = deserializeModeValuesInfo(parameterDef.ModeValuesInfo);
                }
                return DataLab.Model.ChoiceModuleParameterDescriptor.CreateDescriptor(parameterDef.Name, parameterDef.FriendlyName, parameterDef.IsOptional, parameterDef.ParameterRules, modeValuesInfo, defaultValue);
            }
            else if (parameterDef.ParameterType === DataContract.ModuleParameterType.Mode) {
                return new DataLab.Model.ModeModuleParameterDescriptor(parameterDef.Name, parameterDef.FriendlyName, deserializeModeValuesInfo(parameterDef.ModeValuesInfo), parameterDef.IsOptional, parameterDef.ParameterRules, defaultValue);
            }
            else if (parameterDef.ParameterType === DataContract.ModuleParameterType.Script) {
                return new DataLab.Model.ScriptModuleParameterDescriptor(parameterDef.Name, parameterDef.FriendlyName, parameterDef.ScriptName, defaultValue, parameterDef.IsOptional, parameterDef.ParameterRules);
            }
            else if (parameterDef.ParameterType === DataContract.ModuleParameterType.Credential) {
                return new DataLab.Model.CredentialModuleParameterDescriptor(parameterDef.CredentialDescriptor, parameterDef.Name, parameterDef.FriendlyName, parameterDef.IsOptional, parameterDef.ParameterRules);
            }
            else if (parameterDef.ParameterType === DataContract.ModuleParameterType.ColumnPicker) {
                return new DataLab.Model.ColumnPickerModuleParameterDescriptor(parameterDef.Name, parameterDef.FriendlyName, parameterDef.ColumnPickerFor, parameterDef.SingleColumnSelection, parameterDef.ColumnSelectionCategories, parameterDef.ParameterRules, parameterDef.IsOptional, parameterDef.DefaultValue);
            }
            else if (parameterDef.ParameterType === DataContract.ModuleParameterType.ParameterRange) {
                return new DataLab.Model.ParameterRangeModuleParameterDescriptor(parameterDef.Name, parameterDef.FriendlyName, parameterDef.IsInt, parameterDef.MinLimit, parameterDef.MaxLimit, parameterDef.SliderMin, parameterDef.SliderMax, parameterDef.DefaultValue, parameterDef.IsLog);
            }
            else if (parameterDef.ParameterType === DataContract.ModuleParameterType.Boolean) {
                return new DataLab.Model.BooleanModuleParameterDescriptor(parameterDef.Name, parameterDef.FriendlyName, [new DataLab.Model.ChoiceParameterValue("True"), new DataLab.Model.ChoiceParameterValue("False")], defaultValue);
            }
            else {
                return new DataLab.Model.ModuleParameterDescriptor(parameterDef.Name, parameterDef.FriendlyName, defaultValue, parameterDef.IsOptional, parameterDef.ParameterRules, [], parameterDef.ParameterType);
            }
        }
        DataContract.deserializeModuleParameterDescriptor = deserializeModuleParameterDescriptor;
        function deserializeModeValuesInfo(modeValuesInfo) {
            var result = {};
            DataLab.Util.forEach(modeValuesInfo, function (value, key) {
                // Keep track of whether this mode value already has a child mode parameter descriptor or not - it can only have one.
                var hasChildModeParameterDescriptor = false;
                var childParameterDescriptors = value.Parameters.map(function (parameter) {
                    var childParameterDescriptor = deserializeModuleParameterDescriptor(parameter);
                    if (childParameterDescriptor instanceof DataLab.Model.ModeModuleParameterDescriptor) {
                        if (hasChildModeParameterDescriptor) {
                            throw new Error("Mode parameter descriptor cannot have multiple child mode parameter descriptors.");
                        }
                        else {
                            hasChildModeParameterDescriptor = true;
                        }
                    }
                    return childParameterDescriptor;
                });
                result[key] = new DataLab.Model.ModeValueInfo(value.InterfaceString, childParameterDescriptors, value.DisplayValue);
            });
            return result;
        }
        DataContract.deserializeModeValuesInfo = deserializeModeValuesInfo;
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="../Validation.ts" />
/// <reference path="Property.ts" />
/// <reference path="CredentialStore.ts" />
/// <reference path="ModuleParameterDescriptor.ts" />
/// <reference path="../Contracts/Common/Module.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        /** Base class for experiment and node-level parameters. **/
        var Parameter = (function (_super) {
            __extends(Parameter, _super);
            function Parameter(descriptor, value) {
                if (value === void 0) { value = undefined; }
                _super.call(this);
                this.descriptor = descriptor;
                value = typeof value === "undefined" ? this.descriptor.defaultValue : value;
                value = value !== undefined && value !== null ? value : "";
                this.value = DataLab.Validation.validatableObservable(value, this.validateValue.bind(this));
                this.autocompleteArray = ko.observableArray();
            }
            Parameter.prototype.validate = function () {
                return this.value.validate();
            };
            Parameter.prototype.startValidating = function () {
                this.value.startValidating();
            };
            Object.defineProperty(Parameter.prototype, "label", {
                get: function () {
                    return this.descriptor.friendlyName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Parameter.prototype, "parameterType", {
                get: function () {
                    var paramType = "";
                    if (this.descriptor instanceof Model.ScriptModuleParameterDescriptor) {
                        paramType = DataLab.DataContract.ModuleParameterType.Script;
                    }
                    else if (this.descriptor instanceof Model.BooleanModuleParameterDescriptor) {
                        paramType = DataLab.DataContract.ModuleParameterType.Boolean;
                    }
                    else if (this.descriptor instanceof Model.ChoiceModuleParameterDescriptor) {
                        paramType = DataLab.DataContract.ModuleParameterType.Enumerated;
                    }
                    else if (this.descriptor instanceof Model.CredentialModuleParameterDescriptor) {
                        paramType = DataLab.DataContract.ModuleParameterType.Credential;
                    }
                    else if (this.descriptor instanceof Model.ColumnPickerModuleParameterDescriptor) {
                        paramType = DataLab.DataContract.ModuleParameterType.ColumnPicker;
                    }
                    else if (this.descriptor instanceof Model.ParameterRangeModuleParameterDescriptor) {
                        paramType = DataLab.DataContract.ModuleParameterType.ParameterRange;
                    }
                    else {
                        paramType = DataLab.DataContract.ModuleParameterType.String;
                    }
                    return paramType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Parameter.prototype, "tooltip", {
                get: function () {
                    return this.descriptor.friendlyName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Parameter.prototype, "name", {
                get: function () {
                    return this.descriptor.name;
                },
                enumerable: true,
                configurable: true
            });
            Parameter.prototype.validateValue = function (val) {
                return this.descriptor.validate(val);
            };
            return Parameter;
        })(DataLab.ObjectWithId);
        Model.Parameter = Parameter;
        function createModuleNodeParametersFromDescriptors(parameterDescriptors, parent, value, parentParameter, relevancyKey) {
            if (value === void 0) { value = undefined; }
            if (parentParameter === void 0) { parentParameter = null; }
            if (relevancyKey === void 0) { relevancyKey = null; }
            var map = Object.create(null);
            var credentialDescriptors = [];
            parameterDescriptors.forEach(function (parameterDef) {
                if (parameterDef.name in map) {
                    throw new Error("Duplicate parameter definition names.");
                }
                if (!(parameterDef instanceof Model.CredentialModuleParameterDescriptor)) {
                    map[parameterDef.name] = new ModuleNodeParameter(parameterDef, parent, value, parentParameter, relevancyKey);
                }
                else {
                    // Create a placeholder for Credential parameter, this is needed to preserve order of parameters in UI
                    map[parameterDef.name] = null;
                }
            });
            // Create credential parameters after all other parameters have been created, because other parameters
            // that represent key parts for credential need to be present in the collection when credential parameter is created
            parameterDescriptors.forEach(function (parameterDef) {
                if (parameterDef instanceof Model.CredentialModuleParameterDescriptor) {
                    map[parameterDef.name] = new CredentialParameter(parameterDef, parent, value, parentParameter, relevancyKey, map);
                }
            });
            return map;
        }
        Model.createModuleNodeParametersFromDescriptors = createModuleNodeParametersFromDescriptors;
        var ModuleNodeParameter = (function (_super) {
            __extends(ModuleNodeParameter, _super);
            function ModuleNodeParameter(descriptor, parent, value, parentParameter, relevancyKey) {
                var _this = this;
                if (value === void 0) { value = undefined; }
                if (parentParameter === void 0) { parentParameter = null; }
                if (relevancyKey === void 0) { relevancyKey = null; }
                _super.call(this, descriptor, value);
                this.linkedWebServiceParameter = ko.observable(null);
                this.isLinked = ko.computed(function () { return !!_this.linkedWebServiceParameter(); });
                this.parent = parent;
                this.isRelevant = ko.observable(true);
                this.childParameters = Object.create(null);
                this.dirtyStatusInfo = new DataLab.Util.Dirtyable();
                this.dirtyDraftState = new DataLab.Util.Dirtyable();
                // A child parameter is relevant if and only if the parent mode parameter is relevant,
                // and the mode value that it depends on is selected on the mode parameter.
                if (parentParameter) {
                    // TODO [#1147335]: Unsubscribe when the parameter is destroyed.
                    this.isRelevant = ko.computed(function () {
                        return (parentParameter.isRelevant() && ((parentParameter.value()) === relevancyKey));
                    });
                }
                this.value.subscribe(function () {
                    _this.dirtyStatusInfo.dirty();
                    _this.dirtyDraftState.dirty();
                });
                if (this.descriptor instanceof Model.ModeModuleParameterDescriptor) {
                    // Create child parameters if this is a mode parameter.
                    DataLab.Util.forEach(this.descriptor.modeValuesInfo, function (value, key) {
                        var modeValue = createModuleNodeParametersFromDescriptors(value.childParameterDescriptors, _this.parent, undefined, _this, key);
                        _this.childParameters[key] = modeValue;
                    });
                }
            }
            ModuleNodeParameter.prototype.linkToWebServiceParameter = function (webServiceParameter) {
                if (this.linkedWebServiceParameter()) {
                    throw new Error("Cannot link because the parameter is already linked");
                }
                webServiceParameter.link(this);
                this.linkedWebServiceParameter(webServiceParameter);
            };
            /** Unlinks this parameter from the linked {WebServiceParameter}.
                Note that the lifetime of a {ModuleNodeParameter} is at least as long as that of any linked parameter.
                When a {ModuleNodeParameter} is removed from an experiment graph, it should be unlinked(). */
            ModuleNodeParameter.prototype.unlink = function () {
                if (!this.linkedWebServiceParameter()) {
                    throw new Error("Cannot unlink because the parameter is not currently linked");
                }
                this.linkedWebServiceParameter().unlink(this);
                this.linkedWebServiceParameter(null);
            };
            /** Unlinks this parameter if it is currently linked. Otherwise, no change is made. */
            ModuleNodeParameter.prototype.ensureUnlinked = function () {
                if (this.linkedWebServiceParameter()) {
                    this.unlink();
                }
            };
            /**
             * Compares this to a provided clean parameter and dirties this if they are not equal for the sake of status updating.
             */
            ModuleNodeParameter.prototype.dirtyIfNeeded = function (cleanParam) {
                if (cleanParam.name !== this.name || cleanParam.value() !== this.value()) {
                    this.dirtyStatusInfo.dirty();
                }
            };
            return ModuleNodeParameter;
        })(Parameter);
        Model.ModuleNodeParameter = ModuleNodeParameter;
        var Constants;
        (function (Constants) {
            var CredentialParameter;
            (function (CredentialParameter) {
                CredentialParameter.credentialVerificationTimeout = 500;
            })(CredentialParameter = Constants.CredentialParameter || (Constants.CredentialParameter = {}));
        })(Constants = Model.Constants || (Model.Constants = {}));
        ;
        var Constants;
        (function (Constants) {
            var Key;
            (function (Key) {
                Key.Return = 13;
            })(Key = Constants.Key || (Constants.Key = {}));
        })(Constants = Model.Constants || (Model.Constants = {}));
        ;
        var CredentialParameter = (function (_super) {
            __extends(CredentialParameter, _super);
            function CredentialParameter(descriptor, parent, value, parentParameter, relevancyKey, nodeParameters) {
                var _this = this;
                _super.call(this, descriptor, parent, value, parentParameter, relevancyKey);
                this.isDirty = false;
                this.credentialType = descriptor.credentialDescriptor.CredentialType;
                this.credentialKeyParts = [];
                this.activeRequests = [];
                this.requestsBlocked = false;
                DataLab.Util.forEach(nodeParameters, function (param) {
                    // If parameter comprises a part of the key for credential, add handler for a change so that password field gets autofilled upon changing any of the dependent fields
                    if (param) {
                        if (DataLab.Util.first(descriptor.credentialDescriptor.CredentialKeyParts, function (cp) { return cp === param.name; }, false)) {
                            param.value.subscribe(function () {
                                _this.fill();
                            });
                            _this.credentialKeyParts.push({ label: param.label, tooltip: param.tooltip, value: param.value, name: param.name });
                            // setup autocomplete on credential key part field
                            Model.CredentialStore.listCredentials().done(function (credentialCache) {
                                DataLab.Util.forEach(credentialCache, function (c) {
                                    if (c.Type === _this.credentialType) {
                                        var parameterToPush = DataLab.Util.first(c.Parts, function (p) { return p.Name === param.name; }, null);
                                        if (parameterToPush) {
                                            param.autocompleteArray.push(parameterToPush.Value);
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
                if (this.credentialKeyParts.length != descriptor.credentialDescriptor.CredentialKeyParts.length) {
                    throw new Error("Invalid Credential descriptor for the module, some of the parameters defined as part of the credential key are missing");
                }
                this.value.subscribe(function () {
                    _this.isDirty = (_this.value() && !_this.isLinked()) ? true : false;
                });
                this.fill();
                this.isLinked.subscribe(function (linked) {
                    _this.isDirty = false;
                    if (!linked) {
                        _this.fill();
                    }
                });
            }
            CredentialParameter.prototype.sendRequest = function (keyParts) {
                var _this = this;
                DataLab.Model.CredentialStore.verifyCredential(keyParts).done(function (result) {
                    if (_this.activeRequests.length > 0 && _this.activeRequests[_this.activeRequests.length - 1] == keyParts) {
                        // Do not perform autofill opeartion if parameter is linked or field is dirty
                        if (!_this.isLinked() && !_this.isDirty) {
                            if (!_this.dirtyDraftState.isDirty()) {
                                // Pause dirtying so this value replacement doesn't mark the parameter as dirty
                                _this.dirtyDraftState.stopDirtying();
                                _this.dirtyStatusInfo.stopDirtying();
                                if (result && _this.value()) {
                                    _this.value(DataLab.Constants.PasswordPlaceholder);
                                }
                                else {
                                    _this.value("");
                                }
                                _this.dirtyDraftState.startDirtying();
                                _this.dirtyStatusInfo.startDirtying();
                            }
                            // isDirty is set by changing the password observable value, it needs to be reset in this specific case as user did not modify the actual field
                            // it got populated as a result of credential lookup when some of the dependent fields changed
                            _this.isDirty = false;
                            _this.activeRequests = [];
                        }
                    }
                });
            };
            CredentialParameter.prototype.fill = function () {
                var _this = this;
                if (!this.isDirty && !this.isLinked()) {
                    var parts = [];
                    DataLab.Util.forEach(this.credentialKeyParts, function (cr) {
                        parts.push({ Name: cr.name, Value: cr.value() });
                    });
                    var keyParts = {
                        Type: this.credentialType,
                        Parts: parts
                    };
                    this.activeRequests.push(keyParts);
                    // Throttle requests so that server is not clogged
                    if (!this.requestsBlocked) {
                        this.sendRequest(keyParts);
                        if (this.activeRequests.length > 1) {
                            this.requestsBlocked = true;
                            setTimeout(function () {
                                if (_this.activeRequests.length > 0) {
                                    _this.sendRequest(_this.activeRequests[_this.activeRequests.length - 1]);
                                }
                                _this.requestsBlocked = false;
                            }, Constants.CredentialParameter.credentialVerificationTimeout);
                        }
                    }
                }
            };
            CredentialParameter.prototype.getSerializedValue = function () {
                // Do not serialize value of credential parameter. It will be saved separately via secure API
                // Treat linked parameter the same way as in the base class
                return "";
            };
            return CredentialParameter;
        })(ModuleNodeParameter);
        Model.CredentialParameter = CredentialParameter;
        // Represents parameters global to an entire experiment. They are linked to zero or more
        // module parameters.
        var WebServiceParameter = (function (_super) {
            __extends(WebServiceParameter, _super);
            /**
              * @constructor
              * Parameters to an experiment. Are linked to zero or more module parameters.
              * @param {ModuleParameterDescriptor} descriptor The descriptor for the
                  parameter we're promoting this experiment from
              * @param {string} name The initial name for the parameter
              * @param {any} value The initial value for the parameter
              * @param {(name: string) => string} validateName A function that validates this parameter's
                  name. If the parameter is valid, it should return null. If the parameter is invalid, it
                  should return a string with the reason why it's invalid.
             **/
            function WebServiceParameter(descriptor, name, value, parameterContainer) {
                _super.call(this, descriptor, value);
                this.isExperimentParameter = false;
                // When the same name exists more than once, we effectively need to update the error message on name's
                // validatable observable. Since the errorMessage is a read-only observable triggered on a validate call,
                // we need to effectively call validate on at least the set of parameters with our current or previous
                // name (or we can be promiscuous and just validate all the experiment parameters). We need to not validate
                // the other parameters' names in the second call to avoid infinte recursion. We use a static variable to
                // delegate this responsibility.
                var validateName = function (name) {
                    var sameNamedParameters = parameterContainer.parameters;
                    var errorString = null;
                    if (name === "") {
                        errorString = "Experiment parameter name cannot be empty.";
                    }
                    else if (parameterContainer.parametersWithName(name).length > 1) {
                        errorString = "Experiment parameter '" + name + "' already exists.";
                    }
                    // TODO 1294335: Introduce bookkeeping so we only have to notify parameters that currently or previously
                    // had our name.
                    if (WebServiceParameter.shouldRecurseValidation) {
                        try {
                            WebServiceParameter.shouldRecurseValidation = false;
                            parameterContainer.parameters.forEach(function (parameter) {
                                parameter.validatableName.validate();
                            });
                        }
                        finally {
                            WebServiceParameter.shouldRecurseValidation = true;
                        }
                    }
                    return errorString;
                };
                this.linkedParameters = Object.create(null);
                this.validatableName = DataLab.Validation.validatableObservable(name, validateName);
                this.hasDefaultValue = ko.observable(this.value() != null && this.value() != "");
                this.validatableName.startValidating();
                this.value.startValidating();
                this.isEditingName = ko.observable(false);
            }
            /**
              * Remove the linked module parameter from the experiment parameter's linkage.
              * @param {ModuleNodeParameter} moduleParameter The parameter to unlink.
             **/
            WebServiceParameter.prototype.unlink = function (moduleParameter) {
                if (!(moduleParameter.id in this.linkedParameters)) {
                    throw new Error("Unlinking an module parameter that hasn't been linked");
                }
                delete this.linkedParameters[moduleParameter.id];
                // Redo value validation since the thing we just unlinked might be the only invalid parameter
                // making this one now valid.
                if (this.hasDefaultValue()) {
                    this.value.validate();
                }
            };
            /**
              * Add a module parameter to this parameter's linkage.
              * @param {ModuleNodeParameter} moduleParameter The parameter to link
             **/
            WebServiceParameter.prototype.link = function (moduleParameter) {
                if (moduleParameter.id in this.linkedParameters) {
                    throw new Error("Experiment parameter is alread linked to module parameter");
                }
                this.linkedParameters[moduleParameter.id] = moduleParameter;
                // Redo validation, since the thing we just linked might be invalid, making invalid
                if (this.hasDefaultValue()) {
                    this.value.validate();
                }
            };
            /**
              * Removes all of this experiment parameter's links to module parameters
             **/
            WebServiceParameter.prototype.unlinkAll = function () {
                DataLab.Util.forEach(this.linkedParameters, function (moduleNodeParameter) {
                    moduleNodeParameter.ensureUnlinked();
                });
            };
            /**
              * Ensures that the parameter's value is valid (i.e. it's valid for all of its linked parameters).
              * This function serves as the IValidator (it just ignores its input) for WebServiceParameters' validatable
              * observable.
              * @return {string} A string containing the first validation error or null if no error occurred.
             **/
            WebServiceParameter.prototype.validateValue = function () {
                var _this = this;
                if (!this.hasDefaultValue()) {
                    return null;
                }
                var errors = [];
                // We use each linked parameter's validators to validate this value. We cannot simply
                // call otherParameter.valdate() because a module's enum parameter will always have a valid
                // value; attempting to set a select input to an invalid value just silently fails.
                DataLab.Util.forEach(this.linkedParameters, function (parameter) {
                    parameter.descriptor.validators.forEach(function (validator) {
                        if (errors.length === 0) {
                            var curError = validator.validate(_this.value());
                            if (curError) {
                                curError = "Value is invalid for linked parameter " + parameter.name + " on " + parameter.parent.name + ". " + curError;
                                errors.push(curError);
                            }
                        }
                    });
                });
                return errors.length > 0 ? errors[0] : null;
            };
            WebServiceParameter.prototype.textboxKeydown = function (data, event) {
                if (event.keyCode === Constants.Key.Return) {
                    data.property.isEditingName(false);
                    return false;
                }
                // Knockout event bindings suppress the default action for the event normally. We can return true to prevent this.
                // see: http://knockoutjs.com/documentation/event-binding.html
                return true;
            };
            WebServiceParameter.prototype.toggleEditingName = function (data, event) {
                data.property.isEditingName(true);
                Shell.Diagnostics.Telemetry.featureUsage(47 /* RenameParameter */, 43 /* WebServiceParameter */);
                // Workaround knockout hasfocus bug. After update to knockout > 2.3.0, please remove this code
                // and add hasfocus binding instead.
                $(event.srcElement).parent().children("input").focus();
            };
            WebServiceParameter.prototype.textboxBlur = function (data, event) {
                data.property.isEditingName(false);
            };
            /**
              * Validate that both this parameter's name and value are correct.
              * @return {string[]} An array of the errors for this parameter
             **/
            WebServiceParameter.prototype.validate = function () {
                var valueError = this.hasDefaultValue() ? this.value.validate()[0] : null;
                var parameterErrors = [];
                if (valueError) {
                    parameterErrors.push(valueError);
                }
                return parameterErrors.concat(this.validatableName.validate());
            };
            Object.defineProperty(WebServiceParameter.prototype, "name", {
                get: function () {
                    return this.validatableName();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebServiceParameter.prototype, "label", {
                get: function () {
                    var newLineIndex = this.name.indexOf("\n");
                    if (newLineIndex == -1) {
                        newLineIndex = this.name.length;
                    }
                    return this.name.substring(0, newLineIndex);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebServiceParameter.prototype, "tooltip", {
                get: function () {
                    return this.name;
                },
                enumerable: true,
                configurable: true
            });
            WebServiceParameter.prototype.isLinked = function () {
                return !DataLab.Util.isEmpty(this.linkedParameters);
            };
            WebServiceParameter.shouldRecurseValidation = true;
            return WebServiceParameter;
        })(Parameter);
        Model.WebServiceParameter = WebServiceParameter;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        // The service serializes enums as strings. Below, we have a pattern for string-valued enums.
        // e[s] === s for any key s, therefore e[s] in e === true.
        // This allows using e.g. State.NotStarted in place of a string constant, as well as validation that a state is valid.
        var ModuleParameterType;
        (function (ModuleParameterType) {
            ModuleParameterType.String = "String";
            ModuleParameterType.Int = "Int";
            ModuleParameterType.Float = "Float";
            ModuleParameterType.Double = "Double";
            ModuleParameterType.Boolean = "Boolean";
            ModuleParameterType.Enumerated = "Enumerated";
            ModuleParameterType.Script = "Script";
            ModuleParameterType.Mode = "Mode";
            ModuleParameterType.Credential = "Credential";
            ModuleParameterType.ColumnPicker = "ColumnPicker";
            ModuleParameterType.ParameterRange = "ParameterRange";
        })(ModuleParameterType = DataContract.ModuleParameterType || (DataContract.ModuleParameterType = {}));
        var ModuleParameterValueType;
        (function (ModuleParameterValueType) {
            ModuleParameterValueType.Literal = "Literal";
            ModuleParameterValueType.GraphParameterName = "GraphParameterName";
        })(ModuleParameterValueType = DataContract.ModuleParameterValueType || (DataContract.ModuleParameterValueType = {}));
        var State;
        (function (State) {
            State.NotStarted = "NotStarted";
            State.Running = "Running";
            State.Finished = "Finished";
            State.Failed = "Failed";
            State.Canceled = "Canceled";
            State.InDraft = "InDraft";
        })(State = DataContract.State || (DataContract.State = {}));
        var DataSourceOrigin;
        (function (DataSourceOrigin) {
            // From DataSourceOrigin.cs
            DataSourceOrigin.InvalidOrigin = "InvalidOrigin";
            DataSourceOrigin.FromResourceUpload = "FromResourceUpload";
            DataSourceOrigin.FromExistingBlob = "FromExistingBlob";
            DataSourceOrigin.FromOutputPromotion = "FromOutputPromotion";
        })(DataSourceOrigin = DataContract.DataSourceOrigin || (DataContract.DataSourceOrigin = {}));
        var CloudSystemTypes;
        (function (CloudSystemTypes) {
            // From WellKnownCloudSystems.cs
            CloudSystemTypes.Exe = "exe";
            CloudSystemTypes.Hive = "hive";
            CloudSystemTypes.Pig = "pig";
            CloudSystemTypes.MapReduce = "mapreduce";
            CloudSystemTypes.MapReduceJar = "mapreducejar";
            CloudSystemTypes.AnalyticsFramework = "analyticsFramework"; // aka AFx
            CloudSystemTypes.Dll = "dll";
            CloudSystemTypes.R = "r";
            CloudSystemTypes.Python = "python";
            CloudSystemTypes.Cosmos = "cosmos";
        })(CloudSystemTypes = DataContract.CloudSystemTypes || (DataContract.CloudSystemTypes = {}));
        var SchemaStatus;
        (function (SchemaStatus) {
            SchemaStatus.Pending = "Pending";
            SchemaStatus.Complete = "Complete";
            SchemaStatus.NotSupported = "NotSupported";
            SchemaStatus.Failed = "Failed";
        })(SchemaStatus = DataContract.SchemaStatus || (DataContract.SchemaStatus = {}));
        DataContract.DataReferenceModuleFamilyId = "DataReferenceModule";
        var CancellationReason;
        (function (CancellationReason) {
            CancellationReason.ExceededRuntimeLimit = "Experiment runtime quota exceeded";
            CancellationReason.ExceededStorageLimit = "StorageQuota";
            CancellationReason.DatasetRestriction = "http://schemas.azureml.net/ws/2014/11/identity/claims/Dataset";
            CancellationReason.ModulesRestriction = "http://schemas.azureml.net/ws/2014/11/identity/claims/Modules";
            CancellationReason.CustomModulesRestriction = "http://schemas.azureml.net/ws/2014/11/identity/claims/CustomModules";
            CancellationReason.WebServicesRestriction = "http://schemas.azureml.net/ws/2014/11/identity/claims/WebServices";
            CancellationReason.WorkspaceTypeRestriction = "http://schemas.azureml.net/ws/2014/11/identity/claims/WorkspaceType";
        })(CancellationReason = DataContract.CancellationReason || (DataContract.CancellationReason = {}));
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="Parameter.ts" />
/// <reference path="../Contracts/Constants.ts" />
/// <reference path="../Contracts/Common/Module.ts" />
/// <reference path="../Validation.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var ChoiceParameterValue = (function () {
            function ChoiceParameterValue(value, displayName) {
                this.value = value;
                this.displayValue = displayName ? displayName : value;
            }
            return ChoiceParameterValue;
        })();
        Model.ChoiceParameterValue = ChoiceParameterValue;
        var ModuleParameterDescriptor = (function () {
            function ModuleParameterDescriptor(name, friendlyName, defaultValue, isOptional, rules, choiceParameterValues, parameterType) {
                var _this = this;
                if (isOptional === void 0) { isOptional = false; }
                if (rules === void 0) { rules = []; }
                if (choiceParameterValues === void 0) { choiceParameterValues = []; }
                this.name = name;
                this.friendlyName = friendlyName;
                this.defaultValue = defaultValue;
                this.isOptional = isOptional;
                // We need to keep the rules array so we can echo them back to the service in the case of
                // experiment parameters. We don't actually use these other than to initially create validators
                this.rules = rules;
                this.validators = [];
                if (!this.isOptional) {
                    this.validators.push(new DataLab.Validation.RequiredValueValidator());
                }
                if (parameterType === DataLab.DataContract.ModuleParameterType.Int) {
                    this.validators.push(new DataLab.Validation.IntegerValidator());
                }
                else if (parameterType === DataLab.DataContract.ModuleParameterType.Float || parameterType === DataLab.DataContract.ModuleParameterType.Double) {
                    this.validators.push(new DataLab.Validation.FloatValidator());
                }
                this.type = (parameterType != null) ? parameterType : DataLab.DataContract.ModuleParameterType.String;
                this.rules.forEach(function (rule) {
                    if ("Max" in rule) {
                        _this.validators.push(new DataLab.Validation.PropertyMaxValidator(rule.Max));
                    }
                    if ("Min" in rule) {
                        _this.validators.push(new DataLab.Validation.PropertyMinValidator(rule.Min));
                    }
                    if ("Values" in rule) {
                        _this.validators.push(new DataLab.Validation.PropertyValuesValidator(choiceParameterValues));
                    }
                });
            }
            ModuleParameterDescriptor.prototype.validate = function (value) {
                var error = null;
                this.validators.forEach(function (validator) {
                    if (!error) {
                        error = validator.validate(value);
                    }
                });
                return error;
            };
            return ModuleParameterDescriptor;
        })();
        Model.ModuleParameterDescriptor = ModuleParameterDescriptor;
        var ChoiceModuleParameterDescriptor = (function (_super) {
            __extends(ChoiceModuleParameterDescriptor, _super);
            function ChoiceModuleParameterDescriptor(name, friendlyName, isOptional, choiceParameterValues, rules, defaultValue) {
                if (choiceParameterValues.length == 0) {
                    throw new Error("Set of choices is empty for enumerated parameter.");
                }
                this.choices = ko.observableArray(choiceParameterValues);
                _super.call(this, name, friendlyName, defaultToFirstChoice(choiceParameterValues, defaultValue), isOptional, rules, choiceParameterValues);
                // If the descriptor doesn't have a values validator (e.g. boolean parameters and mode parameters),
                // add one.
                var hasValuesValidator = false;
                this.validators.forEach(function (validator) {
                    if (validator instanceof DataLab.Validation.PropertyValuesValidator) {
                        hasValuesValidator = true;
                    }
                });
                if (!hasValuesValidator) {
                    this.validators.push(new DataLab.Validation.PropertyValuesValidator(choiceParameterValues));
                }
            }
            /**
              * If the given choices are "true"/"false" or "yes"/"no" (case-insensitive), then
              * the parameter is a boolean.
              * @param {string[]} choices the array of valid choices for an enumerated parameter
              */
            ChoiceModuleParameterDescriptor.isBooleanDescriptor = function (choiceParameterValues) {
                if (choiceParameterValues.length != 2) {
                    return false;
                }
                // Make sure the choices are True/False or Yes/No and that the affirmative choice comes before negative one
                var choice1 = choiceParameterValues[0].value.toLowerCase().trim();
                var choice2 = choiceParameterValues[1].value.toLowerCase().trim();
                if ((choice1 === "true" && choice2 === "false") || (choice1 === "yes" && choice2 === "no")) {
                    return true;
                }
                else if ((choice1 === "false" && choice2 === "true") || (choice1 === "no" && choice2 === "yes")) {
                    choiceParameterValues = choiceParameterValues.reverse();
                    return true;
                }
                return false;
            };
            ChoiceModuleParameterDescriptor.CreateDescriptor = function (name, friendlyName, isOptional, rules, modeValuesInfo, defaultValue, isMulti) {
                if (isOptional === void 0) { isOptional = false; }
                if (rules === void 0) { rules = []; }
                if (modeValuesInfo === void 0) { modeValuesInfo = null; }
                if (isMulti === void 0) { isMulti = false; }
                var choiceParameterValues = CreateChoiceParameterValues(rules, modeValuesInfo, isOptional);
                if (!isOptional && ChoiceModuleParameterDescriptor.isBooleanDescriptor(choiceParameterValues)) {
                    return new BooleanModuleParameterDescriptor(name, friendlyName, choiceParameterValues, defaultValue);
                }
                else if (isMulti) {
                    return new MultiChoiceModuleParameterDescriptor(name, friendlyName, choiceParameterValues, rules, defaultValue);
                }
                else {
                    return new ChoiceModuleParameterDescriptor(name, friendlyName, isOptional, choiceParameterValues, rules, defaultValue);
                }
            };
            return ChoiceModuleParameterDescriptor;
        })(ModuleParameterDescriptor);
        Model.ChoiceModuleParameterDescriptor = ChoiceModuleParameterDescriptor;
        var BooleanModuleParameterDescriptor = (function (_super) {
            __extends(BooleanModuleParameterDescriptor, _super);
            function BooleanModuleParameterDescriptor(name, friendlyName, choiceParameterValues, defaultValue) {
                if (choiceParameterValues === void 0) { choiceParameterValues = []; }
                _super.call(this, name, friendlyName, false, choiceParameterValues, [], defaultValue);
            }
            return BooleanModuleParameterDescriptor;
        })(ChoiceModuleParameterDescriptor);
        Model.BooleanModuleParameterDescriptor = BooleanModuleParameterDescriptor;
        var MultiChoiceModuleParameterDescriptor = (function (_super) {
            __extends(MultiChoiceModuleParameterDescriptor, _super);
            function MultiChoiceModuleParameterDescriptor(name, friendlyName, choiceParameterValues, rules, defaultValue) {
                _super.call(this, name, friendlyName, false, choiceParameterValues, rules, defaultValue);
            }
            return MultiChoiceModuleParameterDescriptor;
        })(ChoiceModuleParameterDescriptor);
        Model.MultiChoiceModuleParameterDescriptor = MultiChoiceModuleParameterDescriptor;
        var ColumnPickerModuleParameterDescriptor = (function (_super) {
            __extends(ColumnPickerModuleParameterDescriptor, _super);
            function ColumnPickerModuleParameterDescriptor(name, friendlyName, columnPickerFor, singleColumnSelection, columnSelectionCategories, rules, isOptional, defaultValue) {
                if (rules === void 0) { rules = []; }
                if (isOptional === void 0) { isOptional = false; }
                _super.call(this, name, friendlyName, defaultValue, isOptional, rules);
                this.columnPickerFor = columnPickerFor;
                this.singleColumnSelection = singleColumnSelection;
                this.columnSelectionCategories = columnSelectionCategories;
            }
            return ColumnPickerModuleParameterDescriptor;
        })(ModuleParameterDescriptor);
        Model.ColumnPickerModuleParameterDescriptor = ColumnPickerModuleParameterDescriptor;
        var ParameterRangeModuleParameterDescriptor = (function (_super) {
            __extends(ParameterRangeModuleParameterDescriptor, _super);
            function ParameterRangeModuleParameterDescriptor(name, friendlyName, isInt, minLimit, maxLimit, sliderMin, sliderMax, defaultValue, isLog) {
                _super.call(this, name, friendlyName, defaultValue);
                this.isInt = isInt;
                this.sliderMin = sliderMin;
                this.sliderMax = sliderMax;
                this.minLimit = minLimit;
                this.maxLimit = maxLimit;
                this.isLog = isLog;
            }
            return ParameterRangeModuleParameterDescriptor;
        })(ModuleParameterDescriptor);
        Model.ParameterRangeModuleParameterDescriptor = ParameterRangeModuleParameterDescriptor;
        function defaultToFirstChoice(choices, value) {
            if (choices.length === 0) {
                throw new Error("Expected at least one choice.");
            }
            if (value !== undefined) {
                return value;
            }
            else {
                return choices[0].value;
            }
        }
        function CreateChoiceParameterValues(rules, modeValuesInfo, isOptional) {
            if (rules === void 0) { rules = []; }
            if (modeValuesInfo === void 0) { modeValuesInfo = null; }
            if (isOptional === void 0) { isOptional = false; }
            var choiceParameterValues = [];
            // if modeValuesInfo has display value information we try to use it if values are not listed in the first rule.
            if (modeValuesInfo) {
                // Note that Object.keys returns keys in arbitrary order: see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
                // therefore, if rules are not empty, the value order in rules specifies the order of the display values we want in the drop down otherwise we use the order
                // returned by Object.keys
                var modeKeys = (rules[0] && rules[0].Values.length > 0) ? rules[0].Values : Object.keys(modeValuesInfo);
                modeKeys.forEach(function (modeKey) {
                    if (modeValuesInfo[modeKey].displayValue) {
                        choiceParameterValues.push(new ChoiceParameterValue(modeKey, modeValuesInfo[modeKey].displayValue));
                    }
                    else {
                        choiceParameterValues.push(new ChoiceParameterValue(modeKey));
                    }
                });
            }
            else {
                if (rules.length > 0) {
                    rules[0].Values.forEach(function (value) {
                        choiceParameterValues.push(new ChoiceParameterValue(value));
                    });
                }
                else {
                    throw new Error("Enumerated parameter has neither modeValuesInfo nor rules array with values.");
                }
            }
            if (isOptional) {
                choiceParameterValues.unshift(new ChoiceParameterValue(""));
            }
            return choiceParameterValues;
        }
        var ScriptModuleParameterDescriptor = (function (_super) {
            __extends(ScriptModuleParameterDescriptor, _super);
            function ScriptModuleParameterDescriptor(name, friendlyName, scriptName, defaultValue, isOptional, rules) {
                if (scriptName === void 0) { scriptName = null; }
                if (defaultValue === void 0) { defaultValue = null; }
                if (isOptional === void 0) { isOptional = false; }
                if (rules === void 0) { rules = []; }
                _super.call(this, name, friendlyName, defaultValue, isOptional, rules);
                this.scriptName = scriptName;
            }
            return ScriptModuleParameterDescriptor;
        })(ModuleParameterDescriptor);
        Model.ScriptModuleParameterDescriptor = ScriptModuleParameterDescriptor;
        var CredentialModuleParameterDescriptor = (function (_super) {
            __extends(CredentialModuleParameterDescriptor, _super);
            function CredentialModuleParameterDescriptor(credential, name, friendlyName, isOptional, rules) {
                if (rules === void 0) { rules = []; }
                _super.call(this, name, friendlyName, "", isOptional, rules);
                this.credentialDescriptor = credential;
            }
            return CredentialModuleParameterDescriptor;
        })(ModuleParameterDescriptor);
        Model.CredentialModuleParameterDescriptor = CredentialModuleParameterDescriptor;
        var ModeModuleParameterDescriptor = (function (_super) {
            __extends(ModeModuleParameterDescriptor, _super);
            function ModeModuleParameterDescriptor(name, friendlyName, modeValuesInfo, isOptional, rules, defaultValue) {
                if (isOptional === void 0) { isOptional = false; }
                if (rules === void 0) { rules = []; }
                _super.call(this, name, friendlyName, isOptional, CreateChoiceParameterValues(rules, modeValuesInfo, isOptional), rules, defaultValue);
                this.modeValuesInfo = modeValuesInfo;
            }
            return ModeModuleParameterDescriptor;
        })(ChoiceModuleParameterDescriptor);
        Model.ModeModuleParameterDescriptor = ModeModuleParameterDescriptor;
        var ModeValueInfo = (function () {
            /**
              * @constructor
              * ModeValueInfo describes an option of a mode parameter.
              * @param {string} interfaceString the interface string corresponding to selecting this mode value
              * @param {ModuleParameterDescriptor[]} childParameterDescriptors array of child parameters relevant to this mode value
              */
            function ModeValueInfo(interfaceString, childParameterDescriptors, displayValue) {
                if (interfaceString === void 0) { interfaceString = ""; }
                if (childParameterDescriptors === void 0) { childParameterDescriptors = []; }
                if (displayValue === void 0) { displayValue = null; }
                this.interfaceString = "";
                this.childParameterDescriptors = [];
                this.displayValue = null;
                this.interfaceString = interfaceString;
                this.childParameterDescriptors = childParameterDescriptors;
                this.displayValue = displayValue;
            }
            return ModeValueInfo;
        })();
        Model.ModeValueInfo = ModeValueInfo;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Util.ts" />
/// <reference path="../Contracts/Common/Module.ts" />
/// <reference path="GraphNode.ts" />
/// <reference path="Module.ts" />
/// <reference path="Parameter.ts" />
/// <reference path="../Global.refs.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var ErrorLogInfo = (function () {
            function ErrorLogInfo() {
                var _this = this;
                this.errorMessage = ko.observable("");
                this.startTime = ko.observable("");
                this.endTime = ko.observable("");
                this.errorId = ko.observable("");
                this.hasErrorId = ko.computed(function () {
                    return _this.errorId() !== "";
                }, this);
                this.messageInExpectedFormat = ko.observable(false);
            }
            ErrorLogInfo.prototype.updateErrorLogInfo = function (errorText, nodeName, nodeID) {
                // split off the record begin and end times and the error message.
                var startMessageEndRegExp = DataLab.Constants.ModuleError.StartMessageEndRegExp;
                var matchedValues = startMessageEndRegExp.exec(errorText);
                if (!matchedValues || matchedValues.length !== 4) {
                    this.messageInExpectedFormat(false);
                    errorText === "" ? this.errorMessage(DataLab.LocalizedResources.moduleErrorNoErrorMessage) : this.errorMessage(errorText);
                    Shell.Diagnostics.Telemetry.customEvent("GetErrorLog", "BadFormatForErrorLog", JSON.stringify({ errorText: errorText, nodeName: nodeName, nodeID: nodeID }));
                }
                else {
                    this.messageInExpectedFormat(true);
                    this.startTime(matchedValues[1]);
                    var unprocessedMessage = matchedValues[2];
                    this.endTime(matchedValues[3]);
                    // skip the initial whitespace and [ModuleOutput] labels
                    unprocessedMessage = unprocessedMessage.replace(DataLab.Constants.ModuleError.SkipWhitespaceAndModuleOutputStrRegExp, "");
                    // skip the initial Error: 
                    unprocessedMessage = unprocessedMessage.replace(DataLab.Constants.ModuleError.SkipErrorHeadingRegExp, "");
                    if (unprocessedMessage !== "") {
                        this.errorMessage(unprocessedMessage);
                        // Check if message begins with Error ID.
                        var errorIdRegEx = DataLab.Constants.ModuleError.GetErrorIdRegExp;
                        if (errorIdRegEx.test(unprocessedMessage)) {
                            matchedValues = errorIdRegEx.exec(unprocessedMessage);
                            this.errorId(matchedValues[1]);
                        }
                    }
                    else {
                        this.errorMessage(DataLab.LocalizedResources.moduleErrorNoErrorMessage);
                    }
                }
            };
            return ErrorLogInfo;
        })();
        Model.ErrorLogInfo = ErrorLogInfo;
        var ModuleNode = (function (_super) {
            __extends(ModuleNode, _super);
            /**
              * @constructor
              * Creates a module graph node that you can add to the experiment.
              * @param {Module} module_ the definition for this module
              * @param {string} guid by default, the module will take a new unique ID. Passing this parameter overrides this behavior.
             **/
            function ModuleNode(module_, workspace, guid) {
                var _this = this;
                if (guid === void 0) { guid = null; }
                _super.call(this, createPortsForModule(module_), guid);
                // A ModuleNode which has been submitted for execution has an executedExperimentId (otherwise, it is null).
                // This is in contrast to modules which have been added to a draft, but never submitted for execution.
                // Note that executedExperimentId may differ from the id of the containing experiment (e.g. if it is a draft cloned from a submitted experiment).
                // We still want to show state and allow output promotion / download so long as the module node has not been dirtied (e.g. parameters changed).
                this.executedExperimentId = null;
                this.module_ = module_;
                this.parameters = this.createParametersForModule(module_);
                this.hasParameter = function (parameterFilter) {
                    return ModuleNode.parameterFilterHelper(_this.parameters, parameterFilter);
                };
                this.hasCredentials = function () {
                    return _this.hasParameter(function (parameter) {
                        return parameter instanceof Model.CredentialParameter;
                    });
                };
                // @TODO Replace with real code, TFS Defect 3972938
                this.isCustomModule = function () {
                    return _this.module_.familyId.split(".")[0].toLowerCase() !== "506153734175476c4f62416c57734963";
                };
                this.isDirty = false;
                this.isValidating = false;
                this.startTime = new Model.StaticProperty(DataLab.LocalizedResources.PropertyPanelStartTime, ko.observable());
                this.endTime = new Model.StaticProperty(DataLab.LocalizedResources.PropertyPanelEndTime, ko.observable());
                this.elapsedTime = new Model.StaticProperty(DataLab.LocalizedResources.elapsedTime, ko.observable());
                this.statusCode = new Model.StaticProperty(DataLab.LocalizedResources.PropertyPanelStatusCode, ko.observable(DataLab.DataContract.State.NotStarted));
                this.statusDetails = new Model.StaticProperty(DataLab.LocalizedResources.PropertyPanelStatusDetails, ko.observable());
                this.outputLog = new Model.EndpointProperty(DataLab.LocalizedResources.PropertyPanelViewOutputLog, ko.observable());
                this.errorLog = new Model.DisplayEndpointProperty(DataLab.LocalizedResources.moduleErrorDialogButtonLabel, 0 /* Error */, ko.observable());
                this.errorLogInfo = new ErrorLogInfo();
                this.errorLog.endpoint.subscribe(function () {
                    if (_this.statusCode.value() === DataLab.DataContract.State.Failed && _this.errorLog.endpoint() && _this.errorLog.endpoint().Size > 0 && _this.executedExperimentId) {
                        DataLab.Util.then(workspace.getModuleErrorLog(_this.executedExperimentId, _this.id), function (errorText) {
                            _this.errorLogInfo.updateErrorLogInfo(errorText, _this.name, _this.id);
                        });
                    }
                });
                this.errorLogInfo.errorMessage.subscribe(function () {
                    if (_this.statusCode.value() === DataLab.DataContract.State.Failed || _this.statusCode.value() === DataLab.DataContract.State.Running) {
                        var errorMessage = _this.errorLogInfo.errorMessage().length > DataLab.Constants.MaximumCharsForErrorToolTip ? _this.errorLogInfo.errorMessage().slice(0, DataLab.Constants.MaximumCharsForErrorToolTip - 1) + " ..." : _this.errorLogInfo.errorMessage();
                        _this.balloonMessage(errorMessage);
                    }
                });
                this.outputEndpoints = Object.create(null);
                this.dirtyStatusInfo = new DataLab.Util.Dirtyable();
                DataLab.Util.forEach(this.inputPorts, function (port) {
                    _this.dirtyStatusInfo.addChild(port.dirtyStatusInfo);
                    _this.dirtySinceLastRun.addChild(port.dirtyDraftState);
                });
                DataLab.Util.forEach(this.parameters, function (parameter) {
                    _this.dirtyStatusInfo.addChild(parameter.dirtyStatusInfo);
                    _this.dirtySinceLastRun.addChild(parameter.dirtyDraftState);
                });
                this.dirtyStatusInfo.isDirty.subscribe(function (dirty) {
                    if (dirty)
                        _this.dirtyModule();
                });
            }
            ModuleNode.parameterFilterHelper = function (parameterMap, parameterFilter) {
                return DataLab.Util.values(parameterMap).some(function (parameter) {
                    // Does this param match the filter?
                    if (parameterFilter(parameter)) {
                        return true;
                    }
                    // If not, does a child parameter match the filter?
                    if (parameter.descriptor instanceof Model.ModeModuleParameterDescriptor) {
                        // Find the selected mode and filter all relevant child parameters.
                        var relevantChildParameters = parameter.childParameters[parameter.value()];
                        return ModuleNode.parameterFilterHelper(relevantChildParameters, parameterFilter);
                    }
                    else {
                        var childParameterMaps = DataLab.Util.values(parameter.childParameters);
                        return childParameterMaps.some(function (childParameterMap) {
                            return ModuleNode.parameterFilterHelper(childParameterMap, parameterFilter);
                        });
                    }
                });
            };
            Object.defineProperty(ModuleNode.prototype, "owner", {
                get: function () {
                    return this.module_.owner;
                },
                enumerable: true,
                configurable: true
            });
            /**
              * Start validation on this module and all its parameters
             **/
            ModuleNode.prototype.startValidating = function () {
                this.isValidating = true;
                this.startValidatingAll(this.parameters);
            };
            ModuleNode.prototype.startValidatingAll = function (parameters) {
                var _this = this;
                DataLab.Util.forEach(parameters, function (parameter) {
                    parameter.startValidating();
                    if (parameter.descriptor instanceof Model.ModeModuleParameterDescriptor) {
                        DataLab.Util.forEach(parameter.childParameters, function (childParameters) {
                            _this.startValidatingAll(childParameters);
                        });
                    }
                });
            };
            /**
              * Validates that all parameters meet constraints, and that all inputs have a connection
              * @return {string[]} an array of strings describing the errors on this module node. If no errors
              *   exist, the returned array is empty
             **/
            ModuleNode.prototype.validate = function () {
                var errors = [];
                if (!this.isValidating) {
                    return [];
                }
                // Get parameter errors
                var parameterErrors = [];
                this.validateParameters(this.parameters, parameterErrors);
                errors = errors.concat(parameterErrors);
                // Check that all the inputs are connected
                var portErrors = [];
                DataLab.Util.forEach(this.inputPorts, function (inputPort) {
                    if (!inputPort.isConnected() && !inputPort.optional) {
                        portErrors.push("Input port " + inputPort.name + " is unconnected.");
                    }
                });
                if (portErrors.length > 0) {
                    errors.push({
                        errorMessages: portErrors,
                        erroneousObject: this
                    });
                }
                return errors;
            };
            // Updates status information on this ModuleNode instead of replacing it entirely
            // in order to avoid the costly act of replacing connections
            ModuleNode.prototype.updateInfo = function (otherModule) {
                var _this = this;
                if (this.id === otherModule.id) {
                    this.startTime.value(otherModule.startTime.value());
                    this.endTime.value(otherModule.endTime.value());
                    this.elapsedTime.value(otherModule.elapsedTime.value());
                    this.statusCode.value(otherModule.statusCode.value());
                    this.statusDetails.value(otherModule.statusDetails.value());
                    this.outputLog.endpoint(otherModule.outputLog.endpoint());
                    this.errorLog.endpoint(otherModule.errorLog.endpoint());
                    DataLab.Util.forEach(this.outputEndpoints, function (endpointProperty, name) {
                        if (otherModule.outputEndpoints[name]) {
                            endpointProperty.endpoint(otherModule.outputEndpoints[name].endpoint());
                            if (_this.outputPorts[name]) {
                                _this.outputPorts[name].outputEndpoint = otherModule.outputEndpoints[name].endpoint();
                            }
                        }
                    });
                    // update visualization and schema endpoints for output ports
                    // visualization and schema endpoints are not defined at the begining of execution
                    // like other endpoints, so we need to update them when experiment is refreshed
                    DataLab.Util.forEach(otherModule.outputPorts, function (op) {
                        _this.outputPorts[op.name].visualizationEndpoint = op.visualizationEndpoint;
                        _this.outputPorts[op.name].schemaEndpoint = op.schemaEndpoint;
                    });
                }
                else {
                    throw new Error("Updated GraphNode ID does not match previous ID.");
                }
            };
            // Validate all relevant parameters in module node.
            ModuleNode.prototype.validateParameters = function (parameters, errors) {
                var _this = this;
                DataLab.Util.forEach(parameters, function (parameter) {
                    if (!(parameter.descriptor instanceof Model.ModeModuleParameterDescriptor)) {
                        var parameterErrors = parameter.validate();
                        if (parameterErrors.length > 0) {
                            errors.push({
                                errorMessages: parameterErrors,
                                erroneousObject: parameter
                            });
                        }
                        return;
                    }
                    // Find the selected mode and validate all relevant child parameters.
                    var relevantChildParameters = parameter.childParameters[parameter.value()];
                    if (relevantChildParameters) {
                        _this.validateParameters(relevantChildParameters, errors);
                    }
                });
            };
            Object.defineProperty(ModuleNode.prototype, "name", {
                get: function () {
                    return this.module_.name();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ModuleNode.prototype, "description", {
                get: function () {
                    return this.module_.description();
                },
                enumerable: true,
                configurable: true
            });
            ModuleNode.prototype.remove = function () {
                _super.prototype.remove.call(this);
                // We need to remove parameter links here so that this node doesn't leak. A linked experiment-level
                // parameter is effectively another reference from the graph.
                this.unlinkAllParameters();
                // Instrumentation scenario: User adds a Dataset
                // For privacy reasons, log the name of the node only if the author is "Microsoft Corporation"
                var canInstrumentNodeName = true; // this.owner === "Microsoft Corporation";
                // Shell.Diagnostics.Telemetry.customEvent("RemoveModule", "RemoveNode", canInstrumentNodeName ? newModuleNode.module_.name() : DataLab.LocalizedResources.NotAuthorizedToInstrument);
            };
            ModuleNode.prototype._onReplacing = function (other) {
                var _this = this;
                if (other instanceof ModuleNode) {
                    var otherModuleNode = other;
                    otherModuleNode.dirtyStatusInfo.startDirtying();
                    otherModuleNode.dirtyStatusInfo.dirty();
                    copyParameters(this.parameters, otherModuleNode.parameters);
                    // Copy over inputPort publish status.
                    DataLab.Util.forEach(this.inputPorts, function (thisPort) {
                        if (thisPort.isInputPortForPublish()) {
                            _this.parent.removePublishInputPort(thisPort);
                            if (thisPort.name in other.inputPorts) {
                                var otherPort = other.inputPorts[thisPort.name];
                                _this.parent.addPublishInputPort(otherPort);
                            }
                        }
                    });
                    // Copy over outputPort publish status.
                    DataLab.Util.forEach(this.outputPorts, function (thisPort) {
                        if (thisPort.isOutputPortForPublish()) {
                            _this.parent.removePublishOutputPort(thisPort);
                            if (thisPort.name in other.outputPorts) {
                                var otherPort = other.outputPorts[thisPort.name];
                                _this.parent.addPublishOutputPort(otherPort);
                            }
                        }
                    });
                    DataLab.Util.forEach(otherModuleNode.parameters, function (parameter) {
                        parameter.dirtyDraftState.startDirtying();
                    });
                    DataLab.Util.forEach(otherModuleNode.inputPorts, function (port) {
                        port.dirtyDraftState.startDirtying();
                    });
                }
            };
            /** Unlinks all parameters (as applicable). */
            ModuleNode.prototype.unlinkAllParameters = function () {
                DataLab.Util.forEach(this.parameters, function (param) { return param.ensureUnlinked(); });
            };
            // When dirtyModule is called elsewhere the parameters should be left unspecified
            ModuleNode.prototype.dirtyModule = function (visitedNodeMap) {
                if (visitedNodeMap === void 0) { visitedNodeMap = Object.create(null); }
                this.isDirty = true;
                this.startTime.value("");
                this.endTime.value("");
                this.elapsedTime.value("");
                this.statusCode.value(DataLab.DataContract.State.NotStarted);
                this.statusDetails.value("");
                this.outputLog.endpoint(null);
                this.errorLog.endpoint(null);
                DataLab.Util.forEach(this.outputEndpoints, function (endpointProperty, name) {
                    endpointProperty.endpoint(null);
                });
                visitedNodeMap[this.id] = this;
                DataLab.Util.forEach(this.outputPorts, function (output, name) {
                    DataLab.Util.forEach(output.connectedPorts(), function (connectedInputPort, id) {
                        // We can assume a module's output is connected to another module
                        if (connectedInputPort.parent instanceof ModuleNode) {
                            var childModule = connectedInputPort.parent;
                            if (!childModule.isDirty && !visitedNodeMap[childModule.id]) {
                                childModule.dirtyModule(visitedNodeMap);
                            }
                        }
                    });
                });
            };
            // Adds the endpoint if there is not already an existing auxiliary endpoint of that name.
            ModuleNode.prototype.addEndpoint = function (endpoint) {
                if (!(this.outputEndpoints[endpoint.Name] && this.outputEndpoints[endpoint.Name].endpoint().IsAuxiliary)) {
                    this.outputEndpoints[endpoint.Name] = new Model.EndpointProperty(endpoint.Name, ko.observable(endpoint));
                }
            };
            /**
             * Compares this to a provided clean module and dirties this if they are not equal for the sake of status updating.
             */
            ModuleNode.prototype.dirtyIfNeeded = function (cleanModule) {
                var _this = this;
                if (DataLab.Util.values(cleanModule.parameters).length === DataLab.Util.values(this.parameters).length) {
                    DataLab.Util.forEach(cleanModule.parameters, function (cleanParam, name) {
                        var thisParam = _this.parameters[name];
                        if (thisParam) {
                            thisParam.dirtyIfNeeded(cleanParam);
                        }
                        else {
                            _this.dirtyStatusInfo.dirty();
                        }
                    });
                }
                else {
                    this.dirtyStatusInfo.dirty();
                }
                if (DataLab.Util.values(cleanModule.inputPorts).length === DataLab.Util.values(this.inputPorts).length) {
                    DataLab.Util.forEach(cleanModule.inputPorts, function (cleanPort, name) {
                        var thisPort = _this.inputPorts[name];
                        if (thisPort) {
                            thisPort.dirtyIfNeeded(cleanPort);
                        }
                        else {
                            _this.dirtyStatusInfo.dirty();
                        }
                    });
                }
                else {
                    this.dirtyStatusInfo.dirty();
                }
                if (DataLab.Util.values(cleanModule.outputPorts).length !== DataLab.Util.values(this.outputPorts).length) {
                    this.dirtyStatusInfo.dirty();
                }
            };
            ModuleNode.prototype.createParametersForModule = function (module_) {
                return DataLab.Model.createModuleNodeParametersFromDescriptors(module_.parameterDescriptors, this);
            };
            return ModuleNode;
        })(Model.GraphNode);
        Model.ModuleNode = ModuleNode;
        function createPortsForModule(module_) {
            // Normally we want to access ports via port name. For some usages (such as laying out ports on a visual representation of a node),
            // it is convenient to have a stable ordering of ports (across browsers and interface changes). Input ports are ordered separately 
            // from output ports (i.e. there can be an input port #0 and an output port #0) since we currently arrange them independently.
            var inputPortOrdinal = 0;
            var outputPortOrdinal = 0;
            return module_.portDescriptors.map(function (descriptor) {
                if (descriptor instanceof Model.ModuleInputPortDescriptor) {
                    return new Model.InputPort(descriptor, inputPortOrdinal++);
                }
                else if (descriptor instanceof Model.ModuleOutputPortDescriptor) {
                    return new Model.OutputPort(descriptor, outputPortOrdinal++);
                }
                else {
                    throw new Error("Unknown port descriptor type.");
                }
            });
        }
        /** Copies and links a parameter set recursively. Parameters missing on the target are silently ignored.
            Values are copied even if they are not valid for the corresponding target parameter.
            This is intended to be used for replacing one module node with another (with similar parameters).
           */
        function copyParameters(existingParameters, replacementParameters) {
            DataLab.Util.forEach(existingParameters, function (existingParam) {
                if (existingParam.name in replacementParameters) {
                    var replacementParam = replacementParameters[existingParam.name];
                    if (existingParam.parameterType === replacementParam.parameterType) {
                        replacementParam.value(existingParam.value());
                        if (existingParam.isLinked()) {
                            replacementParam.linkToWebServiceParameter(existingParam.linkedWebServiceParameter());
                        }
                    }
                    // If this parameter has sets of child parameters (modes), we can recurse for each set in common.
                    DataLab.Util.forEach(existingParam.childParameters, function (existingChildParameters, optionValue) {
                        if (optionValue in replacementParam.childParameters) {
                            copyParameters(existingChildParameters, replacementParam.childParameters[optionValue]);
                        }
                    });
                }
            });
        }
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        (function (SchemaCorrectness) {
            SchemaCorrectness[SchemaCorrectness["Accurate"] = 0] = "Accurate";
            SchemaCorrectness[SchemaCorrectness["Superset"] = 1] = "Superset";
            SchemaCorrectness[SchemaCorrectness["Inaccurate"] = 2] = "Inaccurate";
        })(Model.SchemaCorrectness || (Model.SchemaCorrectness = {}));
        var SchemaCorrectness = Model.SchemaCorrectness;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Common.ts" />
/// <reference path="Module.ts" />

/// <reference path="Constants.ts" />
/// <reference path="Common/Common.ts" />
/// <reference path="Common/Experiment.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        var v1;
        (function (v1) {
            // sync with \Product\Source\StudioContracts\SubscriptionStatus.cs
            (function (SubscriptionStatus) {
                SubscriptionStatus[SubscriptionStatus["Deleted"] = 0] = "Deleted";
                SubscriptionStatus[SubscriptionStatus["Enabled"] = 1] = "Enabled";
                SubscriptionStatus[SubscriptionStatus["Disabled"] = 2] = "Disabled";
                SubscriptionStatus[SubscriptionStatus["Migrated"] = 3] = "Migrated";
                SubscriptionStatus[SubscriptionStatus["Updated"] = 4] = "Updated";
                SubscriptionStatus[SubscriptionStatus["Registered"] = 5] = "Registered";
                SubscriptionStatus[SubscriptionStatus["Unregistered"] = 6] = "Unregistered";
            })(v1.SubscriptionStatus || (v1.SubscriptionStatus = {}));
            var SubscriptionStatus = v1.SubscriptionStatus;
        })(v1 = DataContract.v1 || (DataContract.v1 = {}));
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Contracts/DataContractInterfaces-v1.ts" />
/// <reference path="GraphNode.ts" />
/// <reference path="Dataset.ts" />
/// <reference path="Experiment.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var datasetPortName = "dataset";
        var DatasetNode = (function (_super) {
            __extends(DatasetNode, _super);
            function DatasetNode(dataset, guid) {
                if (guid === void 0) { guid = null; }
                _super.call(this, createPortsForDataset(dataset), guid);
                this.dataset = dataset;
                this.author = new Model.StaticProperty("Submitted by", ko.observable(dataset.owner));
                this.format = new Model.StaticProperty("Format", ko.observable(dataset.dataType.toString()));
                this.createdOn = new Model.StaticProperty("Created on", ko.observable(DataLab.Util.formatDate(dataset.created)));
                if (dataset.downloadLocation) {
                    this.size = new Model.StaticProperty("Size", ko.observable(DataLab.Util.formatDataSize(dataset.downloadLocation.Size)));
                    this.viewDataset = new Model.EndpointProperty("View dataset", ko.observable(dataset.downloadLocation));
                }
                else {
                    this.size = new Model.StaticProperty("Size", ko.observable());
                    this.viewDataset = new Model.EndpointProperty("View dataset", ko.observable());
                }
            }
            Object.defineProperty(DatasetNode.prototype, "datasetPort", {
                get: function () {
                    return this.outputPorts[datasetPortName];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DatasetNode.prototype, "name", {
                get: function () {
                    return this.dataset.name();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DatasetNode.prototype, "description", {
                get: function () {
                    return this.dataset.description();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DatasetNode.prototype, "owner", {
                get: function () {
                    return this.dataset.owner;
                },
                enumerable: true,
                configurable: true
            });
            DatasetNode.prototype.remove = function () {
                _super.prototype.remove.call(this);
                // Instrumentation scenario: User adds a Dataset
                // For privacy reasons, log the name of the node only if the author is "Microsoft Corporation"
                var canInstrumentNodeName = true; // this.owner === "Microsoft Corporation";
                Shell.Diagnostics.Telemetry.customEvent("RemoveTrainedModel", "RemoveNode", canInstrumentNodeName ? this.dataset.name() : DataLab.LocalizedResources.NotAuthorizedToInstrument);
            };
            return DatasetNode;
        })(Model.GraphNode);
        Model.DatasetNode = DatasetNode;
        function createPortsForDataset(dataset) {
            var outputPortDescriptor = new Model.ModuleOutputPortDescriptor(datasetPortName, datasetPortName, dataset.dataType, false);
            var outputPort = new Model.OutputPort(outputPortDescriptor);
            outputPort.outputEndpoint = dataset.downloadLocation;
            outputPort.visualizationEndpoint = dataset.visualizeEndPoint;
            outputPort.schemaEndpoint = dataset.schemaEndPoint;
            return [outputPort];
        }
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="DataType.ts" />
/// <reference path="Resource.ts" />
/// <reference path="../Contracts/Common/DataResource.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var TrainedModel = (function (_super) {
            __extends(TrainedModel, _super);
            function TrainedModel(id, dataType, created, familyId, serviceVersion) {
                _super.call(this, id, dataType, created, familyId, serviceVersion);
                this.category = DataLab.Constants.ResourceCategory.TrainedModel;
            }
            return TrainedModel;
        })(Model.DataResource);
        Model.TrainedModel = TrainedModel;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Contracts/DataContractInterfaces-v1.ts" />
/// <reference path="GraphNode.ts" />
/// <reference path="TrainedModel.ts" />
/// <reference path="Experiment.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var trainedModelPortName = "trained model";
        var TrainedModelNode = (function (_super) {
            __extends(TrainedModelNode, _super);
            function TrainedModelNode(trainedModel, guid) {
                if (guid === void 0) { guid = null; }
                _super.call(this, createPortsForTrainedModel(trainedModel), guid);
                this.trainedModel = trainedModel;
                this.author = new Model.StaticProperty(DataLab.LocalizedResources.resourceAuthor, ko.observable(trainedModel.owner));
                this.format = new Model.StaticProperty(DataLab.LocalizedResources.resourceFormat, ko.observable(trainedModel.dataType.toString()));
                this.createdOn = new Model.StaticProperty(DataLab.LocalizedResources.resourceCreatedOn, ko.observable(DataLab.Util.formatDate(trainedModel.created)));
                this.trainingExperiment = new Model.LinkProperty(DataLab.LocalizedResources.trainingExperimentLink, DataLab.LocalizedResources.trainingExperimentLink);
            }
            Object.defineProperty(TrainedModelNode.prototype, "trainedModelPort", {
                get: function () {
                    return this.outputPorts[trainedModelPortName];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TrainedModelNode.prototype, "name", {
                get: function () {
                    return this.trainedModel.name();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TrainedModelNode.prototype, "description", {
                get: function () {
                    return this.trainedModel.description();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TrainedModelNode.prototype, "owner", {
                get: function () {
                    return this.trainedModel.owner;
                },
                enumerable: true,
                configurable: true
            });
            TrainedModelNode.prototype.remove = function () {
                _super.prototype.remove.call(this);
                // Instrumentation scenario: User adds a Dataset
                // For privacy reasons, log the name of the node only if the author is "Microsoft Corporation"
                var canInstrumentNodeName = true; // this.owner === "Microsoft Corporation";
                Shell.Diagnostics.Telemetry.customEvent("RemoveTrainedModel", "RemoveNode", canInstrumentNodeName ? this.trainedModel.name() : DataLab.LocalizedResources.NotAuthorizedToInstrument);
            };
            return TrainedModelNode;
        })(Model.GraphNode);
        Model.TrainedModelNode = TrainedModelNode;
        function createPortsForTrainedModel(trainedModel) {
            var outputPortDescriptor = new Model.ModuleOutputPortDescriptor(trainedModelPortName, trainedModelPortName, trainedModel.dataType, false);
            var outputPort = new Model.OutputPort(outputPortDescriptor);
            outputPort.outputEndpoint = trainedModel.downloadLocation;
            return [outputPort];
        }
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="DataType.ts" />
/// <reference path="Resource.ts" />
/// <reference path="../Contracts/Common/DataResource.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var Transform = (function (_super) {
            __extends(Transform, _super);
            function Transform(id, dataType, created, familyId, serviceVersion) {
                _super.call(this, id, dataType, created, familyId, serviceVersion);
                this.category = DataLab.Constants.ResourceCategory.Transform;
            }
            return Transform;
        })(Model.DataResource);
        Model.Transform = Transform;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Contracts/DataContractInterfaces-v1.ts" />
/// <reference path="GraphNode.ts" />
/// <reference path="Transform.ts" />
/// <reference path="Experiment.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var transformPortName = "transformation";
        var TransformNode = (function (_super) {
            __extends(TransformNode, _super);
            function TransformNode(transform, guid) {
                if (guid === void 0) { guid = null; }
                _super.call(this, createPortsForTransform(transform), guid);
                this.transform = transform;
                this.author = new Model.StaticProperty(DataLab.LocalizedResources.resourceAuthor, ko.observable(transform.owner));
                this.format = new Model.StaticProperty(DataLab.LocalizedResources.resourceFormat, ko.observable(transform.dataType.toString()));
                this.createdOn = new Model.StaticProperty(DataLab.LocalizedResources.resourceCreatedOn, ko.observable(DataLab.Util.formatDate(transform.created)));
                this.trainingExperiment = new Model.LinkProperty(DataLab.LocalizedResources.trainingExperimentLink, DataLab.LocalizedResources.trainingExperimentLink);
            }
            Object.defineProperty(TransformNode.prototype, "transformPort", {
                get: function () {
                    return this.outputPorts[transformPortName];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformNode.prototype, "name", {
                get: function () {
                    return this.transform.name();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformNode.prototype, "description", {
                get: function () {
                    return this.transform.description();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformNode.prototype, "owner", {
                get: function () {
                    return this.transform.owner;
                },
                enumerable: true,
                configurable: true
            });
            TransformNode.prototype.remove = function () {
                _super.prototype.remove.call(this);
                // Instrumentation scenario: User adds a Dataset
                // For privacy reasons, log the name of the node only if the author is "Microsoft Corporation"
                var canInstrumentNodeName = true; // this.owner === "Microsoft Corporation";
                Shell.Diagnostics.Telemetry.customEvent("RemoveTransform", "RemoveNode", canInstrumentNodeName ? this.transform.name() : DataLab.LocalizedResources.NotAuthorizedToInstrument);
            };
            return TransformNode;
        })(Model.GraphNode);
        Model.TransformNode = TransformNode;
        function createPortsForTransform(transform) {
            var outputPortDescriptor = new Model.ModuleOutputPortDescriptor(transformPortName, transformPortName, transform.dataType, false);
            var outputPort = new Model.OutputPort(outputPortDescriptor);
            outputPort.outputEndpoint = transform.downloadLocation;
            return [outputPort];
        }
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Dataset.ts" />
/// <reference path="Module.ts" />
/// <reference path="Resource.ts" />
/// <reference path="GraphNode.ts" />
/// <reference path="DatasetNode.ts" />
/// <reference path="ModuleNode.ts" />
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        function createNodeForResource(resource, workspace) {
            if (resource instanceof Model.Module) {
                return new Model.ModuleNode(resource, workspace);
            }
            else if (resource instanceof Model.Dataset) {
                return new Model.DatasetNode(resource);
            }
            else if (resource instanceof Model.TrainedModel) {
                return new Model.TrainedModelNode(resource);
            }
            else if (resource instanceof Model.Transform) {
                return new Model.TransformNode(resource);
            }
            else {
                throw new Error(DataLab.LocalizedResources.unknownResourceType);
            }
        }
        Model.createNodeForResource = createNodeForResource;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
var DataLab;
(function (DataLab) {
    var Util;
    (function (Util) {
        /**
         * A Dirtyable can be dirtied or cleaned in any order and can have up to 1 parent and an array of children.
         * Calling dirty will alert subscribers to dirtied as well as dirty the parent. If startDirtying has not been called, dirty will no-op.
         * Calling clean will alert subscribers to cleaned as well as clean the children.
         */
        var Dirtyable = (function () {
            function Dirtyable() {
                this.isDirty = ko.observable(false);
                this.parent = null;
                this.children = [];
                this._started = false;
            }
            /** Links this and the child dirtyable together.*/
            Dirtyable.prototype.addChild = function (child) {
                child.parent = this;
                this.children.push(child);
            };
            /** Notifies cleaned subscribers and cleans all children.*/
            Dirtyable.prototype.clean = function () {
                this.isDirty(false);
                this.children.forEach(function (child) {
                    if (child.isDirty()) {
                        child.clean();
                    }
                });
            };
            /** If dirtying has started, notifies dirtied subscribers and dirties the parent.*/
            Dirtyable.prototype.dirty = function () {
                if (this._started) {
                    this.isDirty(true);
                    if (this.parent && !this.parent.isDirty()) {
                        this.parent.dirty();
                    }
                }
            };
            /**
             * If the passed child is present in the children array, removes the child
             * from the array and removes the child's parent reference to this.
             */
            Dirtyable.prototype.removeChild = function (child) {
                var index = this.children.indexOf(child);
                if (index > -1) {
                    child.parent = null;
                    this.children.splice(index, 1);
                }
            };
            Dirtyable.prototype.startDirtying = function () {
                this._started = true;
            };
            Dirtyable.prototype.stopDirtying = function () {
                this._started = false;
            };
            Object.defineProperty(Dirtyable.prototype, "started", {
                get: function () {
                    return this._started;
                },
                enumerable: true,
                configurable: true
            });
            return Dirtyable;
        })();
        Util.Dirtyable = Dirtyable;
    })(Util = DataLab.Util || (DataLab.Util = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="Resource.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var inputPortName = "Web service input";
        var outputPortName = "Web service output";
        (function (WebServicePortType) {
            WebServicePortType[WebServicePortType["Input"] = 0] = "Input";
            WebServicePortType[WebServicePortType["Output"] = 1] = "Output";
        })(Model.WebServicePortType || (Model.WebServicePortType = {}));
        var WebServicePortType = Model.WebServicePortType;
        var WebServicePortNameValidator = (function () {
            function WebServicePortNameValidator(type, parent) {
                if (!parent) {
                    throw new Error("WebServicePortNameValidator: parent argument can't be null");
                }
                this.type = type;
                this.parent = parent;
            }
            WebServicePortNameValidator.prototype.validate = function (val) {
                var _this = this;
                if (!this.parent.getWebServicePortNodes || !val) {
                    return null;
                }
                var nodes = DataLab.Util.filter(this.parent.getWebServicePortNodes(this.type), function (node) {
                    if (node === _this.parent) {
                        return false;
                    }
                    return node.nameParameter.value() === val;
                });
                if (nodes.length > 0) {
                    return DataLab.Util.format(DataLab.LocalizedResources.validationDuplicateWebServicePortNameFailed, val);
                }
                ;
                return null;
            };
            return WebServicePortNameValidator;
        })();
        Model.WebServicePortNameValidator = WebServicePortNameValidator;
        var WebServicePortNodeParameter = (function (_super) {
            __extends(WebServicePortNodeParameter, _super);
            function WebServicePortNodeParameter(descriptor, parent, value) {
                if (value === void 0) { value = undefined; }
                _super.call(this, descriptor, value);
                this.isLinked = ko.computed(function () { return false; });
                this.parent = parent;
            }
            return WebServicePortNodeParameter;
        })(Model.Parameter);
        Model.WebServicePortNodeParameter = WebServicePortNodeParameter;
        var WebServicePortNode = (function (_super) {
            __extends(WebServicePortNode, _super);
            function WebServicePortNode(portType, id, getWebServicePortNodes, dataTypeRegistry) {
                _super.call(this, createPorts(portType, dataTypeRegistry), id);
                this.connectedPort = null;
                this.type = portType;
                this.port = portType === 0 /* Input */ ? this.ports[inputPortName] : this.ports[outputPortName];
                this.getWebServicePortNodes = getWebServicePortNodes;
                var descriptor = new Model.ModuleParameterDescriptor("Name", "Name", "", true);
                descriptor.validators.push(new WebServicePortNameValidator(portType, this));
                this.nameParameter = new WebServicePortNodeParameter(descriptor, this, this.getDefaultValue());
            }
            Object.defineProperty(WebServicePortNode.prototype, "name", {
                get: function () {
                    return this.type === 0 /* Input */ ? inputPortName : outputPortName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebServicePortNode.prototype, "description", {
                get: function () {
                    return this.type === 0 /* Input */ ? inputPortName : outputPortName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebServicePortNode.prototype, "owner", {
                get: function () {
                    return "";
                },
                enumerable: true,
                configurable: true
            });
            WebServicePortNode.prototype.connectTo = function (port) {
                if (this.connectedPort) {
                    if (this.connectedPort === port) {
                        return;
                    }
                    this.parent.connectionRemoved.notifySubscribers(createInputOutputPortPair(this.port, this.connectedPort));
                }
                this.parent.connectionAdded.notifySubscribers(createInputOutputPortPair(this.port, port));
                this.connectedPort = port;
            };
            WebServicePortNode.prototype.getDefaultValue = function () {
                var _this = this;
                if (!this.getWebServicePortNodes) {
                    return null;
                }
                var names = {};
                DataLab.Util.forEach(this.getWebServicePortNodes(this.type), function (node) {
                    if (node === _this) {
                        return;
                    }
                    var value = node.nameParameter.value();
                    if (!value) {
                        return;
                    }
                    names[value] = true;
                });
                var defaultValue = this.type === 0 /* Input */ ? "input" : "output";
                var index = 1;
                for (; names[defaultValue + index]; index++) {
                }
                return defaultValue + index;
            };
            return WebServicePortNode;
        })(Model.GraphNode);
        Model.WebServicePortNode = WebServicePortNode;
        function createPorts(portType, dataTypeRegistry) {
            if (!dataTypeRegistry) {
                throw new Error("WebServicePortNode: dataTypeRegistry cannot be null");
            }
            if (portType === 0 /* Input */) {
                var outputPortDescriptor = new Model.ModuleOutputPortDescriptor(inputPortName, inputPortName, dataTypeRegistry.getDataTypeWithId("Dataset"), false);
                var outputPort = new Model.OutputPort(outputPortDescriptor);
                outputPort.isWebServicePort = true;
                return [outputPort];
            }
            else {
                var inputPortDescriptor = new Model.ModuleInputPortDescriptor(outputPortName, outputPortName, [dataTypeRegistry.getDataTypeWithId("Dataset"), dataTypeRegistry.getDataTypeWithId("ILearnerDotNet"), dataTypeRegistry.getDataTypeWithId("ITransformDotNet")], false);
                var inputPort = new Model.InputPort(inputPortDescriptor);
                inputPort.isWebServicePort = true;
                return [inputPort];
            }
        }
        function createInputOutputPortPair(a, b) {
            if (a instanceof Model.InputPort && b instanceof Model.OutputPort) {
                return {
                    input: a,
                    output: b
                };
            }
            else if (a instanceof Model.OutputPort && b instanceof Model.InputPort) {
                return {
                    input: b,
                    output: a
                };
            }
            else {
                throw "Expected one InputPort and one OutputPort";
            }
        }
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Contracts/Common/Experiment.ts" />
/// <reference path="ModuleNode.ts" />
/// <reference path="Module.ts" />
/// <reference path="DatasetNode.ts" />
/// <reference path="TrainedModelNode.ts" />
/// <reference path="TransformNode.ts" />
/// <reference path="Dataset.ts" />
/// <reference path="ExperimentEvents.ts" />
/// <reference path="../Validation.ts" />
/// <reference path="../ClientCache.ts" />
/// <reference path="ModelUtils.ts" />
/// <reference path="../Disposable.ts" />
/// <reference path="../Dirtyable.ts" />
/// <reference path="WebServicePortNode.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        (function (CycleDetectionVisitationStatus) {
            CycleDetectionVisitationStatus[CycleDetectionVisitationStatus["NotVisited"] = 0] = "NotVisited";
            CycleDetectionVisitationStatus[CycleDetectionVisitationStatus["BeingVisited"] = 1] = "BeingVisited";
            CycleDetectionVisitationStatus[CycleDetectionVisitationStatus["BeenVisited"] = 2] = "BeenVisited";
        })(Model.CycleDetectionVisitationStatus || (Model.CycleDetectionVisitationStatus = {}));
        var CycleDetectionVisitationStatus = Model.CycleDetectionVisitationStatus;
        var ExperimentPublishInfo = (function () {
            function ExperimentPublishInfo() {
                return { InputPortsForPublish: [], OutputPortsForPublish: [] };
            }
            return ExperimentPublishInfo;
        })();
        Model.ExperimentPublishInfo = ExperimentPublishInfo;
        var Experiment = (function (_super) {
            __extends(Experiment, _super);
            /**
              * Creates an experiment
              * @constructor
              * @this {Experiment}
              * @param {string} experimentId The unique and immutable id of this experiment, or 'null' if this experiment is a local draft.
              * @param {string} parentExperimentId The unique and immutable id of the experiment from which this experiment was cloned, or 'null' if this experiment is not a clone.
              * @param {string} publishedWebServiceGroupId The id of web service group which has been published from this experiment before, or 'null' if this experiment has never been published.
            **/
            function Experiment(experimentId, parentExperimentId, creator, publishedWebServiceGroupId) {
                var _this = this;
                if (experimentId === void 0) { experimentId = null; }
                if (parentExperimentId === void 0) { parentExperimentId = null; }
                if (creator === void 0) { creator = null; }
                if (publishedWebServiceGroupId === void 0) { publishedWebServiceGroupId = null; }
                _super.call(this);
                this.etag = ko.observable(null);
                this.schemaVersion = ko.observable(1);
                this.nodes = DataLab.observableMap();
                this.parameters = DataLab.observableMap();
                this.connectionAdded = new ko.subscribable();
                this.connectionRemoved = new ko.subscribable();
                /** Used for dirty tracking, incremented on every change in the experiment. */
                this.editVersion = ko.observable(0);
                // Track if there is any experiment parameter deleted
                // Should be removed after we are sure no user is using it anymore
                this.experimentParameterInUse = false;
                this.isWebServiceExperimentInternal = ko.observable(false);
                this.hasMissingResources = false;
                this.startTime = ko.observable();
                this.endTime = ko.observable();
                // We will always assume an experiment to be a local draft. If it is not a draft, setDraftState() should be called.
                this.statusCode = ko.observable(DataLab.DataContract.State.InDraft);
                this.statusDetails = ko.observable();
                // Description is the name of the experiment. Default name is "Experiment created on <Date>"
                var d = new Date();
                var dateAsString = d.toLocaleDateString();
                var experimentTitle = DataLab.Util.format(DataLab.LocalizedResources.ExperimentDefaultTitle, dateAsString);
                this.description = DataLab.Validation.validatableObservable(experimentTitle, Experiment.validateDescription);
                this.summary = new Model.EditableTextProperty(DataLab.LocalizedResources.experimentSummary, DataLab.LocalizedResources.experimentSummaryPlaceholder, ko.observable(""), this);
                this.originalExperimentDocumentation = new Model.LinkProperty(DataLab.LocalizedResources.originalExperimentDocumentation, "");
                this.experimentId = ko.observable(experimentId);
                this.parentExperimentId = parentExperimentId;
                this.publishedWebServiceGroupId = publishedWebServiceGroupId;
                this.publishInfo = new ExperimentPublishInfo();
                // The following invariant is true: isDraft <=> StatusCode === InDraft
                this.isDraft = ko.computed(function () {
                    return _this.statusCode() === DataLab.DataContract.State.InDraft;
                });
                this.dirtyStatus = new DataLab.Util.Dirtyable();
                this.dirtyStatus.isDirty.subscribe(function (dirty) {
                    if (dirty && _this.isDraft()) {
                        _this.editVersion(_this.editVersion() + 1);
                    }
                });
                this.dirtyForPublishStatus = new DataLab.Util.Dirtyable();
                this.allowPublish = ko.computed(function () {
                    return _this.statusCode() === DataLab.DataContract.State.Finished && !_this.dirtyForPublishStatus.isDirty();
                });
                // Check for graph cycles when a user adds or removes a connection
                // We own this. No need to unsubscribe
                this.connectionAdded.subscribe(function (args) {
                    _this.findCycles();
                    _this.dirtyStatus.dirty();
                    _this.dirtyForPublishStatus.dirty();
                });
                // Adds a reference to this. No need to dispose
                this.connectionRemoved.subscribe(function (args) {
                    _this.findCycles();
                    _this.dirtyStatus.dirty();
                    _this.dirtyForPublishStatus.dirty();
                });
                // We own these. No need to unsubscribe.
                this.description.subscribe(function () {
                    _this.dirtyStatus.dirty();
                });
                this.datasets = Object.create(null);
                this.trainedModels = Object.create(null);
                this.transformModules = Object.create(null);
                this.isEmpty = ko.computed(function () {
                    return _this.nodes.count() === 0;
                });
                this.parametersWithName = function (name) {
                    var parameters = [];
                    _this.parameters.forEach(function (parameter) {
                        if (parameter.name === name) {
                            parameters.push(parameter);
                        }
                    });
                    return parameters;
                };
                this.disableNodesUpdate = ko.observable(false);
                this.disableNodesUpdateProperty = new Model.BooleanProperty(Experiment.disableNodesUpdatePropertyName, DataLab.LocalizedResources.disableNodesUpdateLabel, DataLab.LocalizedResources.disableNodesUpdateTooltip, this.disableNodesUpdate, this);
                var propertyArray = [];
                propertyArray.push(new Model.StaticProperty(DataLab.LocalizedResources.PropertyPanelStartTime, this.startTime));
                propertyArray.push(new Model.StaticProperty(DataLab.LocalizedResources.PropertyPanelEndTime, this.endTime));
                propertyArray.push(new Model.StaticProperty(DataLab.LocalizedResources.PropertyPanelStatusCode, this.statusCode));
                propertyArray.push(new Model.StaticProperty(DataLab.LocalizedResources.PropertyPanelStatusDetails, this.statusDetails));
                if (this.publishedWebServiceGroupId) {
                    this.publishedWebServiceLinkProperty = new Model.LinkProperty("Go to web service", "Go to web service");
                    propertyArray.push(this.publishedWebServiceLinkProperty);
                }
                propertyArray.push(this.disableNodesUpdateProperty);
                if (this.parentExperimentId) {
                    this.priorRunLinkProperty = new Model.LinkProperty("Prior Run", "Prior Run");
                    propertyArray.push(this.priorRunLinkProperty);
                }
                this.properties = ko.observableArray(propertyArray);
                this.isLeaf = ko.observable(true);
                this.isWebServiceExperiment = ko.computed({
                    read: function () {
                        if (!_this.isWebServiceExperimentInternal()) {
                            DataLab.Util.forEach(_this.nodes(), function (n) {
                                if (n instanceof Model.WebServicePortNode) {
                                    _this.isWebServiceExperimentInternal(true);
                                    return false;
                                }
                                return true;
                            });
                        }
                        if (!_this.isWebServiceExperimentInternal()) {
                            _this.isWebServiceExperimentInternal(DataLab.Util.values(_this.parameters()).length > 0);
                        }
                        return _this.isWebServiceExperimentInternal();
                    },
                    write: function (value) {
                        _this.isWebServiceExperimentInternal(value);
                    }
                });
            }
            Experiment.prototype.addPublishOutputPort = function (outputPort) {
                if (this.publishInfo.OutputPortsForPublish.length > 0) {
                    this.publishInfo.OutputPortsForPublish.forEach(function (outputPortRemoved) {
                        outputPortRemoved.isOutputPortForPublish(false);
                    });
                    this.publishInfo.OutputPortsForPublish = [];
                }
                this.publishInfo.OutputPortsForPublish.push(outputPort);
                outputPort.isOutputPortForPublish(true);
                this.dirtyStatus.dirty();
            };
            Experiment.prototype.addPublishInputPort = function (inputPort) {
                if (this.publishInfo.InputPortsForPublish.length > 0) {
                    this.publishInfo.InputPortsForPublish.forEach(function (inputPortRemoved) {
                        inputPortRemoved.isInputPortForPublish(false);
                    });
                    this.publishInfo.InputPortsForPublish = [];
                }
                this.publishInfo.InputPortsForPublish.push(inputPort);
                inputPort.isInputPortForPublish(true);
                this.dirtyStatus.dirty();
            };
            Experiment.prototype.getWebServicePortNodes = function (portType) {
                return DataLab.Util.filter(DataLab.Util.values(this.nodes()), function (node) {
                    if (node instanceof Model.WebServicePortNode) {
                        var portNode = node;
                        return (portNode.type === portType);
                    }
                    return false;
                });
            };
            Experiment.prototype.getModules = function () {
                return DataLab.Util.values(this.nodes()).filter(function (node) { return node instanceof Model.ModuleNode; });
            };
            Experiment.prototype.getDatasets = function () {
                return DataLab.Util.filter(this.nodes(), function (node) { return node instanceof Model.DatasetNode; });
            };
            Object.defineProperty(Experiment.prototype, "storageUsedByDatasets", {
                get: function () {
                    return this.getDatasets().filter(function (node) { return node.dataset.downloadLocation && node.dataset.downloadLocation.Size > 0; }).map(function (node) { return node.dataset.downloadLocation.Size; }).reduce(function (acc, size) { return acc + size; }, 0);
                },
                enumerable: true,
                configurable: true
            });
            Experiment.prototype.firstModuleWithCredentials = function () {
                return DataLab.Util.first(this.getModules(), function (node) { return node.hasCredentials(); }, null);
            };
            Experiment.prototype.firstCustomModule = function () {
                return DataLab.Util.first(this.getModules(), function (node) { return node.isCustomModule(); }, null);
            };
            Experiment.prototype.getPublishInputPorts = function () {
                var inputNodes = DataLab.Util.filter(this.getWebServicePortNodes(0 /* Input */), function (node) {
                    return node.port.connectedNonWebServicePorts().length > 0;
                });
                if (inputNodes && inputNodes.length > 0) {
                    return DataLab.Util.map(inputNodes, function (node) {
                        return node.port.connectedNonWebServicePorts()[0];
                    });
                }
                if (this.publishInfo.InputPortsForPublish.length > 0) {
                    return this.publishInfo.InputPortsForPublish;
                }
                return [];
            };
            Experiment.prototype.getPublishOutputPorts = function () {
                var outputNodes = DataLab.Util.filter(this.getWebServicePortNodes(1 /* Output */), function (node) {
                    return node.port.connectedNonWebServicePorts().length > 0;
                });
                if (outputNodes && outputNodes.length > 0) {
                    return DataLab.Util.map(outputNodes, function (node) {
                        return node.port.connectedNonWebServicePorts()[0];
                    });
                }
                if (this.publishInfo.OutputPortsForPublish.length > 0) {
                    return this.publishInfo.OutputPortsForPublish;
                }
                return [];
            };
            Experiment.prototype.removePublishOutputPort = function (outputPort) {
                var indexOfItemToRemove = this.publishInfo.OutputPortsForPublish.indexOf(outputPort);
                outputPort.isOutputPortForPublish(false);
                this.publishInfo.OutputPortsForPublish.splice(indexOfItemToRemove, 1);
                this.dirtyStatus.dirty();
            };
            Experiment.prototype.removePublishInputPort = function (inputPort) {
                var indexOfItemToRemove = this.publishInfo.InputPortsForPublish.indexOf(inputPort);
                inputPort.isInputPortForPublish(false);
                this.publishInfo.InputPortsForPublish.splice(indexOfItemToRemove, 1);
                this.dirtyStatus.dirty();
            };
            Experiment.validateDescription = function (name) {
                // String must contain a non-whitespace character
                return /\S/.test(name) ? null : DataLab.LocalizedResources.ErrorExperimentNameMustContainAtLeastOneNonWhitespaceCharacter;
            };
            Experiment.prototype.validatePortsForPublishAndSetSubgraph = function () {
                var inputPortsForPublish = this.getPublishInputPorts();
                var outputPortsForPublish = this.getPublishOutputPorts();
                // For now we assume that there is at most a single input and output port.
                // If only one or the other are selected, then they are valid.
                if ((inputPortsForPublish.length === 1 && outputPortsForPublish.length === 0) || (inputPortsForPublish.length === 0 && outputPortsForPublish.length === 1)) {
                    return true;
                }
                // If more than one input port are selected, this is currently invalid
                if (inputPortsForPublish.length > 1) {
                    return false;
                }
                // If both an input and output port are selected, check that tracing up the graph from the output port we will eventually hit the input port.
                var valid = false;
                var queue = [outputPortsForPublish[0].parent.id];
                while (queue.length > 0 && !valid) {
                    var currentNodeId = queue.shift();
                    var currentNode = this.nodes.lookup(currentNodeId);
                    DataLab.Util.forEach(currentNode.inputPorts, function (inputPort) {
                        if (inputPort.connectedOutputPort) {
                            if (inputPort.isDatasetDataType()) {
                                // if not marked add to queue
                                if (inputPortsForPublish.indexOf(inputPort) < 0) {
                                    if (queue.indexOf(inputPort.connectedOutputPort.parent.id) < 0) {
                                        queue.push(inputPort.connectedOutputPort.parent.id);
                                    }
                                }
                                else {
                                    valid = true;
                                }
                            }
                            else {
                                if (queue.indexOf(inputPort.connectedOutputPort.parent.id) < 0) {
                                    queue.push(inputPort.connectedOutputPort.parent.id);
                                }
                            }
                        }
                    });
                }
                return valid;
            };
            Experiment.prototype.addModule = function (module_, workspace, x, y, guid) {
                var newModuleNode = new Model.ModuleNode(module_, workspace, guid);
                this.addNode(newModuleNode, x, y);
                return newModuleNode;
            };
            Experiment.prototype.addDataset = function (dataset, x, y, guid) {
                if (guid === void 0) { guid = null; }
                var newDatasetNode = new Model.DatasetNode(dataset, guid);
                this.addNode(newDatasetNode, x, y);
                return newDatasetNode;
            };
            Experiment.prototype.addTrainedModel = function (trainedModel, x, y, guid) {
                if (guid === void 0) { guid = null; }
                var newTrainedModelNode = new Model.TrainedModelNode(trainedModel, guid);
                this.addNode(newTrainedModelNode, x, y);
                return newTrainedModelNode;
            };
            Experiment.prototype.addWebServicePort = function (portType, x, y, id, dataTypeRegistry, connectedPort, portName) {
                var _this = this;
                var webServicePortNode = new Model.WebServicePortNode(portType, id, function (portType) { return _this.getWebServicePortNodes(portType); }, dataTypeRegistry);
                this.addNode(webServicePortNode, x, y);
                if (connectedPort) {
                    webServicePortNode.port.connectTo(connectedPort);
                }
                if (portName) {
                    webServicePortNode.nameParameter.value(portName);
                }
                return webServicePortNode;
            };
            Experiment.prototype.addTransformModule = function (transform, x, y, guid) {
                if (guid === void 0) { guid = null; }
                var newTransformNode = new Model.TransformNode(transform, guid);
                this.addNode(newTransformNode, x, y);
                return newTransformNode;
            };
            Experiment.prototype.addParameter = function (descriptor, name, value) {
                // Ongoing validation. If the user renames a parameter, 
                var param = new Model.WebServiceParameter(descriptor, name, value, this);
                // On initially adding the parameter, the name must be unique, because we use the initial
                // name as the key in the parameter map.
                if (this.parameters.lookup(param.name)) {
                    throw new Error("An experiment parameter with the given name already exists");
                }
                this.parameters.put(param.id, param);
                this.dirtyStatus.dirty();
                return param;
            };
            /**
              * Promote a module level parameter to an experiment level parameter (implicitly linking the two as well).
              * @param {ModuleNodeParameter} moduleParameter the parameter to promote
              * @return {WebServiceParameter} the promoted parameter
             **/
            Experiment.prototype.promoteModuleParameter = function (moduleParameter) {
                // Find the first available name
                var candidateName = moduleParameter.descriptor.friendlyName;
                var suffix = 0;
                while (1) {
                    if (DataLab.Util.first(this.parameters(), function (param) { return param.name === candidateName; }, null) === null) {
                        break;
                    }
                    suffix++;
                    candidateName = moduleParameter.descriptor.friendlyName + suffix;
                }
                var webServiceParameter = this.addParameter(moduleParameter.descriptor, candidateName, null);
                moduleParameter.ensureUnlinked();
                moduleParameter.linkToWebServiceParameter(webServiceParameter);
                this.dirtyStatus.dirty();
                return webServiceParameter;
            };
            Experiment.prototype.removeWebServiceParameter = function (webServiceParameter) {
                webServiceParameter.unlinkAll();
                this.parameters.remove(webServiceParameter.id);
                this.dirtyStatus.dirty();
            };
            Experiment.prototype.addNode = function (node, x, y) {
                // Don't let users add the same dataset, trained model, or transform more than once
                if (node instanceof Model.DatasetNode) {
                    var existingDataset = null;
                    var dataset = node.dataset;
                    // If we find the dataset, throw an exception.
                    if (this.datasets[dataset.id]) {
                        throw "Dataset with id " + dataset.id + " already in experiment.";
                    }
                    else {
                        this.datasets[dataset.id] = node;
                    }
                }
                if (node instanceof Model.TrainedModelNode) {
                    var existingTrainedModel = null;
                    var trainedModel = node.trainedModel;
                    if (this.trainedModels[trainedModel.id]) {
                        throw "TrainedModel with id " + trainedModel.id + " already in experiment.";
                    }
                    else {
                        this.trainedModels[trainedModel.id] = node;
                    }
                }
                if (node instanceof Model.TransformNode) {
                    var existingTransform = null;
                    var transform = node.transform;
                    if (this.transformModules[transform.id]) {
                        throw "Transform with id " + transform.id + " already in experiment.";
                    }
                    else {
                        this.transformModules[transform.id] = node;
                    }
                }
                // If the node is already in an experiment, remove it from that experiment
                // before moving into this one.
                if (node.parent) {
                    node.parent._removeNode(node);
                }
                if (x) {
                    node.x(x);
                }
                if (y) {
                    node.y(y);
                }
                this.nodes.put(node.id, node);
                node.parent = this;
                this.dirtyStatus.addChild(node.dirtyDraftState);
                if (node instanceof Model.ModuleNode) {
                    this.dirtyForPublishStatus.addChild(node.dirtyForPublish);
                }
                this.dirtyStatus.dirty();
                this.dirtyForPublishStatus.dirty();
            };
            Experiment.prototype.getDatasetNode = function (id) {
                return this.datasets[id] ? this.datasets[id] : null;
            };
            Experiment.prototype.getTrainedModelNode = function (id) {
                return this.trainedModels[id] ? this.trainedModels[id] : null;
            };
            Experiment.prototype.getTransformNode = function (id) {
                return this.transformModules[id] ? this.transformModules[id] : null;
            };
            Experiment.prototype.forEachConnection = function (fn) {
                DataLab.Util.forEach(this.nodes(), function (node) {
                    DataLab.Util.forEach(node.inputPorts, function (inputPort) {
                        DataLab.Util.forEach(inputPort.connectedPorts(), function (outputPort) {
                            fn(inputPort, outputPort);
                        });
                    });
                });
            };
            Experiment.prototype.validate = function () {
                var errors = [];
                // Validate the experiment name
                this.description.startValidating();
                var nameErrors = this.description.validate();
                if (nameErrors.length > 0) {
                    errors.push({
                        erroneousObject: this.description,
                        errorMessages: nameErrors
                    });
                }
                // The experiment should have at least one module
                if (!this.containsModule()) {
                    errors.push({
                        erroneousObject: { name: this.description() },
                        errorMessages: ["This experiment contains no modules."]
                    });
                }
                // Look for cycles
                var cycleMap = this.findCycles();
                if (cycleMap.rootNode) {
                    errors.push({
                        erroneousObject: cycleMap.rootNode,
                        errorMessages: ["This module is in a cycle."]
                    });
                }
                // Check the experiment parameters
                this.parameters.forEach(function (parameter) {
                    var parameterErrors = parameter.validate();
                    if (parameterErrors.length > 0) {
                        errors.push({
                            erroneousObject: parameter,
                            errorMessages: parameterErrors
                        });
                    }
                });
                // Validate each node
                this.nodes.forEach(function (graphNode) {
                    graphNode.startValidating();
                    var nodeErrors = graphNode.validate();
                    errors = errors.concat(nodeErrors);
                });
                return errors;
            };
            /**
              * Performs checks on the experiment to determine whether it is in a state that can be saved or not.
              * @return {string} the error message if experiment cannot be saved, or null otherwise
             **/
            Experiment.prototype.saveError = function () {
                // If the experiment name is invalid, we cannot save.
                this.description.startValidating();
                if (this.description.validate().length > 0) {
                    return "Cannot save experiment draft with empty name.";
                }
                // If the experiment has no modules, we cannot save.
                if (!this.containsModule()) {
                    return "Cannot save experiment draft with no modules.";
                }
                if (!this.arePortNamesValid()) {
                    return "Cannot save experiment draft with ':' in input/output names";
                }
                return null;
            };
            Experiment.prototype.arePortNamesValid = function () {
                for (var nodeId in this.nodes()) {
                    var node = this.nodes()[nodeId];
                    if (node instanceof Model.WebServicePortNode) {
                        if (node.nameParameter.value().indexOf(":") > -1) {
                            return false;
                        }
                    }
                }
                // otherwise return true
                return true;
            };
            Experiment.prototype.findCycles = function () {
                var _this = this;
                var visitedMap = {
                    map: {},
                    rootNode: null
                };
                this.nodes.forEach(function (node) {
                    _this.cycleFromNode(node, visitedMap);
                });
                return visitedMap;
            };
            Experiment.prototype._removeNode = function (node) {
                this.nodes.remove(node.id);
                node.parent = null;
                if (node instanceof Model.DatasetNode) {
                    this.datasets[node.dataset.id] = null;
                }
                if (node instanceof Model.TrainedModelNode) {
                    this.trainedModels[node.trainedModel.id] = null;
                }
                if (node instanceof Model.TransformNode) {
                    this.transformModules[node.transform.id] = null;
                }
                this.dirtyStatus.removeChild(node.dirtyDraftState);
                if (node instanceof Model.ModuleNode) {
                    this.dirtyForPublishStatus.removeChild(node.dirtyForPublish);
                }
                this.dirtyStatus.dirty();
                this.dirtyForPublishStatus.dirty();
            };
            /** Returns the list of nodes for which a newer resource (e.g. module or dataset) is available.
                This is the set of nodes which would be upgraded by {@see upgradeNodes}. */
            Experiment.prototype.findNodesEligibleForUpgrade = function () {
                var eligibleForUpgrade = [];
                DataLab.Util.forEach(this.nodes(), function (node) {
                    var resource;
                    if (node instanceof Model.ModuleNode) {
                        resource = node.module_;
                    }
                    else if (node instanceof Model.DatasetNode) {
                        resource = node.dataset;
                    }
                    else if (node instanceof Model.TrainedModelNode) {
                        resource = node.trainedModel;
                    }
                    else if (node instanceof Model.WebServicePortNode) {
                        return;
                    }
                    else if (node instanceof Model.TransformNode) {
                        resource = node.transform;
                    }
                    else {
                        throw new Error("Unknown node type");
                    }
                    if (!resource.isLatest()) {
                        eligibleForUpgrade.push(node);
                    }
                });
                return eligibleForUpgrade;
            };
            /** Upgrades nodes for which a newer resource (e.g. module or dataset) is available.
                Each node in need of upgrade is replaced with a new one. See {@see GraphNode.replaceWith}.
                @see findNodesEligibleForUpgrade
                */
            Experiment.prototype.upgradeNodes = function (moduleCache, datasetCache, trainedModelCache, transformModulesCache, workspace) {
                var _this = this;
                var nodesToUpgrade = this.findNodesEligibleForUpgrade();
                // record of connections that have been broken by the upgrade
                var incompatibleConnections = {};
                nodesToUpgrade.forEach(function (node) {
                    var existingNodeResource;
                    var resourceCacheForNode;
                    if (node instanceof Model.ModuleNode) {
                        existingNodeResource = node.module_;
                        resourceCacheForNode = moduleCache;
                    }
                    else if (node instanceof Model.DatasetNode) {
                        existingNodeResource = node.dataset;
                        resourceCacheForNode = datasetCache;
                    }
                    else if (node instanceof Model.TrainedModelNode) {
                        existingNodeResource = node.trainedModel;
                        resourceCacheForNode = trainedModelCache;
                    }
                    else if (node instanceof Model.TransformNode) {
                        existingNodeResource = node.transform;
                        resourceCacheForNode = transformModulesCache;
                    }
                    else {
                        throw new Error("Unknown node type");
                    }
                    var newNodeResource = resourceCacheForNode.getLatestResourceInFamily(existingNodeResource.familyId);
                    DataLab.Log.info("Replacing an existing node since it uses a resource which has been updated.", "Experiment.upgradeNodes", {
                        experimentId: _this.experimentId,
                        existingNodeId: node.id,
                        existingNodeFamilyId: existingNodeResource.familyId
                    });
                    var replacementNode = DataLab.Model.createNodeForResource(newNodeResource, workspace);
                    node.replaceWith(replacementNode, incompatibleConnections);
                });
            };
            Experiment.prototype.refresh = function (workspace) {
                var _this = this;
                var experimentRefreshed = $.Deferred();
                var getExperiment = null;
                if (this.statusCode() === DataLab.DataContract.State.InDraft && this.parentExperimentId) {
                    getExperiment = workspace.getExperimentAsync(this.parentExperimentId);
                }
                else if (this.experimentId()) {
                    getExperiment = workspace.getExperimentAsync(this.experimentId());
                }
                else {
                    experimentRefreshed.reject(new Error("Null experimentId"));
                }
                if (getExperiment !== null) {
                    getExperiment.done(function (experiment) {
                        _this.refreshFromNewExperiment(experiment);
                        experimentRefreshed.resolve(experiment);
                    }).fail(function (err) {
                        experimentRefreshed.reject(err);
                    });
                }
                // We want an exception to be thrown if a failure during refresh is not observed.
                return DataLab.Util.when(experimentRefreshed);
            };
            /**
             * Iterates through the experiment's nodes and module nodes' parameters and input ports to call startDirtying on all.
             */
            Experiment.prototype.startDirtyingAll = function () {
                this.dirtyStatus.startDirtying();
                this.dirtyForPublishStatus.startDirtying();
                this.nodes.forEach(function (node) {
                    node.dirtyDraftState.startDirtying();
                    node.dirtySinceLastRun.startDirtying();
                    node.dirtyForPublish.startDirtying();
                    if (node instanceof Model.ModuleNode) {
                        node.dirtyStatusInfo.startDirtying();
                        DataLab.Util.forEach(node.parameters, function (parameter) {
                            parameter.dirtyStatusInfo.startDirtying();
                            parameter.dirtyDraftState.startDirtying();
                        });
                        DataLab.Util.forEach(node.inputPorts, function (port) {
                            port.dirtyStatusInfo.startDirtying();
                            port.dirtyDraftState.startDirtying();
                        });
                    }
                });
            };
            /**
             * Iterates over a clean experiment's modules and dirties them if they are not equal for the sake of status updating.
             */
            Experiment.prototype.dirtyIfNeeded = function (cleanExperiment) {
                var _this = this;
                cleanExperiment.getModules().forEach(function (node) {
                    var cleanNode = node;
                    var thisNode = _this.nodes.lookup(cleanNode.id);
                    if (thisNode) {
                        thisNode.dirtyIfNeeded(cleanNode);
                    }
                });
            };
            Experiment.prototype.getNumberOfModules = function () {
                return DataLab.Util.filter(this.nodes(), function (node) { return node instanceof DataLab.Model.ModuleNode; }).length;
            };
            // When calling this, don't use a second parameter so the initial call can create its
            // visitation data structure
            Experiment.prototype.cycleFromNode = function (currentNode, visitedMap) {
                var _this = this;
                if (visitedMap === void 0) { visitedMap = { map: {}, rootNode: null }; }
                var endCycleNode = null;
                switch (visitedMap.map[currentNode.id]) {
                    case 1 /* BeingVisited */:
                        return currentNode;
                    case 2 /* BeenVisited */:
                        return null;
                    default:
                        visitedMap.map[currentNode.id] = 1 /* BeingVisited */;
                }
                // Iterate all output ports and find the corresponding nodes. If the node has been visited
                // on this subgraph traversal, the graph has a cycle. This method essentially quits after the
                // first cycle it finds. The user will see subsequent cycles when they fix the current one.
                DataLab.Util.forEach(currentNode.outputPorts, function (currentPort) {
                    currentPort.connectedPorts.forEach(function (inputPort) {
                        var subgraphCycleNode = _this.cycleFromNode(inputPort.parent, visitedMap);
                        if (subgraphCycleNode) {
                            inputPort.connectionIsInCycle(true);
                            // endCycleNode is the first node in the traversal that we visit twice
                            endCycleNode = subgraphCycleNode === currentNode ? null : subgraphCycleNode;
                            if (endCycleNode) {
                                visitedMap.rootNode = endCycleNode;
                            }
                        }
                        else {
                            inputPort.connectionIsInCycle(false);
                        }
                    });
                });
                visitedMap.map[currentNode.id] = 2 /* BeenVisited */;
                return endCycleNode;
            };
            // Copies over relevant status information without replacing the entire experiment in preparation for autoclone.
            Experiment.prototype.refreshFromNewExperiment = function (experiment) {
                var _this = this;
                this.onRefreshFromNewExperiment && this.onRefreshFromNewExperiment(this, experiment);
                if (this.statusCode() !== DataLab.DataContract.State.InDraft) {
                    this.startTime(experiment.startTime());
                    this.endTime(experiment.endTime());
                    // update statusDetails before statusCode; needed for check for trial restrictions
                    this.statusDetails(experiment.statusDetails());
                    this.statusCode(experiment.statusCode());
                }
                experiment.getModules().forEach(function (newNode) {
                    var oldNode = _this.nodes.lookup(newNode.id);
                    if (oldNode && !oldNode.isDirty) {
                        oldNode.updateInfo(newNode);
                    }
                });
            };
            /**
              * Checks whether the experiment contains a module or not.
              * @return {boolean} whether the experiment contains a module or not
             **/
            Experiment.prototype.containsModule = function () {
                var firstModuleNode = DataLab.Util.first(this.nodes(), function (node) {
                    return node instanceof Model.ModuleNode;
                }, null);
                return firstModuleNode !== null;
            };
            /**
              * Checks whether the experiment contains a train generic module or not.
              * @return {boolean} whether the experiment contains a train generic module or not
             **/
            Experiment.prototype.containsTrainingModule = function () {
                return DataLab.Util.first(this.nodes(), function (node) {
                    if (node instanceof Model.ModuleNode) {
                        var moduleNode = node;
                        return moduleNode.module_.category === DataLab.Constants.ResourceCategory.TrainModule;
                    }
                    return false;
                }, null) != null;
            };
            /**
              * Returns whether this experiment is stored (either saved or submitted) on the service or not.
              * @return {boolean} true if experiment exists on service
             **/
            Experiment.prototype.persistedOnService = function () {
                return this.experimentId() !== null;
            };
            /**
              * Manually set the draft state of this experiment.
              * @param {boolean} newDraftState whether the experiment should be set to "draft" or "not a draft".
             **/
            Experiment.prototype.setDraftState = function (newDraftState) {
                if (this.isDraft() !== newDraftState) {
                    this.statusCode(newDraftState ? DataLab.DataContract.State.InDraft : DataLab.DataContract.State.NotStarted);
                }
            };
            Experiment.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
            };
            Experiment.disableNodesUpdatePropertyName = "disableNodesUpdate";
            return Experiment;
        })(DataLab.Util.Disposable);
        Model.Experiment = Experiment;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="../ClientCache.ts" />
/// <reference path="Experiment.ts" />
/// <reference path="Schema.ts" />
/// <reference path="Port.ts" />
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        /**
         A Workspace represents an isolated store of modules, datasets, and experiments.
         A Workspace is backed by an IWorkspaceBackend (providing creation of and changes to resources)
         and module / dataset caches (providing access to resources that already exist).
    
         Responsibilities of a Workspace (but not an IWorkspaceBackend) include the following:
         - Managing state (e.g. a promoted dataset should appear in the dataset list)
         - Validation (e.g. an experiment needs a description to be submitted)
    
         @see {IWorkspaceBackend}
         */
        var Workspace = (function () {
            function Workspace(workspaceBackend, applicationCache) {
                if (!workspaceBackend) {
                    throw new Error("'workspaceBackend' must be provided");
                }
                if (!applicationCache) {
                    throw new Error("'applicationCache' must be provided");
                }
                this.id = workspaceBackend.workspaceId;
                this.friendlyName = workspaceBackend.friendlyName;
                this.applicationCache = applicationCache;
                this.moduleCache = applicationCache.moduleCache;
                this.datasetCache = applicationCache.datasetCache;
                this.trainedModelCache = applicationCache.trainedModelCache;
                this.transformModulesCache = applicationCache.transformModulesCache;
                this.moduleCategoryRegistry = applicationCache.moduleCategoryRegistry;
                this.datasetCategoryRegistry = applicationCache.datasetCategoryRegistry;
                this.datasetUploadsInProgress = ko.observable([]);
                this.customModulePackageUploadsInProgress = ko.observable([]);
                this.trainedModelUploadsInProgress = ko.observable([]);
                this.transformModuleUploadsInProgress = ko.observable([]);
                this.workspaceBackend = workspaceBackend;
            }
            Workspace.prototype.setUserName = function (userName) {
                this.userName = userName;
            };
            Workspace.prototype.getUserName = function () {
                return this.userName;
            };
            Workspace.prototype.publishExperimentAsync = function (experiment) {
                return this.workspaceBackend.publishExperimentAsync(experiment);
            };
            Workspace.prototype.submitExperimentAsync = function (experiment) {
                return this.workspaceBackend.submitExperimentAsync(experiment);
            };
            /**
             Saves a draft to the service for the first time. This is used for drafts that do not have an experiment ID.
             */
            Workspace.prototype.saveDraftAsync = function (experiment) {
                return this.workspaceBackend.saveDraftAsync(experiment);
            };
            /**
             Updates a draft that is saved to the service and already has an experiment ID.
             */
            Workspace.prototype.updateDraftAsync = function (experiment) {
                return this.workspaceBackend.updateExperimentAsync(experiment);
            };
            /**
             Deletes a draft or experiment that is saved to the service and already has an experiment ID.
             */
            Workspace.prototype.deleteExperimentAsync = function (experimentId, eTag) {
                return this.workspaceBackend.deleteExperimentAsync(experimentId, eTag);
            };
            Workspace.prototype.cancelExperimentAsync = function (experimentId) {
                return this.workspaceBackend.cancelExperimentAsync(experimentId);
            };
            /**
            Deletes a draft or experiment that is saved to the service and already has an experiment ID, and its ancestors.
            */
            Workspace.prototype.deleteExperimentAndAncestorsAsync = function (experimentId, eTag) {
                return this.workspaceBackend.deleteExperimentAndAncestorsAsync(experimentId, eTag);
            };
            /**
             Promotes output from a finished module node to a new Dataset. This creates a new Dataset
             in the backing IWorkspaceBackend. The returned promise completes when the dataset has been
             created on the backend and loaded into the datasetCache.
             */
            Workspace.prototype.promoteOutputToDatasetAsync = function (outputPort, newDatasetName, familyId, description) {
                var _this = this;
                if (outputPort.descriptor.allowedDataTypes.length !== 1) {
                    throw new Error("Can't promote output from a multi-typed output port.");
                }
                if (!(outputPort.parent instanceof Model.ModuleNode)) {
                    throw new Error("Only the output ports of a module node can be promoted to a dataset.");
                }
                // TODO [1191642]: Util.then should not cause us to lose the typing from TypedPromises.ts
                return DataLab.Util.then(this.workspaceBackend.promoteOutputToDatasetAsync(outputPort, newDatasetName, familyId, description), function (newDatasetId) {
                    return _this.datasetCache.getItem(newDatasetId);
                });
            };
            Workspace.prototype.promoteOutputToTrainedModelAsync = function (outputPort, newTrainedModelName, familyId, description) {
                var _this = this;
                if (outputPort.descriptor.allowedDataTypes.length !== 1) {
                    throw new Error("Can't promote output from a multi-typed output port.");
                }
                if (!(outputPort.parent instanceof Model.ModuleNode)) {
                    throw new Error("Only the output ports of a module node can be promoted to a trained model.");
                }
                return DataLab.Util.then(this.workspaceBackend.promoteOutputToTrainedModelAsync(outputPort, newTrainedModelName, familyId, description), function (newTrainedModelId) {
                    return _this.trainedModelCache.getItem(newTrainedModelId);
                });
            };
            Workspace.prototype.promoteOutputToTransformModuleAsync = function (outputPort, newTransformName, familyId, description) {
                var _this = this;
                if (outputPort.descriptor.allowedDataTypes.length !== 1) {
                    throw new Error("Can't promote output from a multi-typed output port.");
                }
                if (!(outputPort.parent instanceof Model.ModuleNode)) {
                    throw new Error("Only the output ports of a module node can be promoted to a transformation model.");
                }
                return DataLab.Util.then(this.workspaceBackend.promoteOutputToTransformModuleAsync(outputPort, newTransformName, familyId, description), function (newTransformId) {
                    return _this.transformModulesCache.getItem(newTransformId);
                });
            };
            /**
             Creates a new dataset from the contents of a Blob (such as a File). This creates a new Dataset
             in the backing IWorkspaceBackend. The returned promise completes when the dataset has been
             created on the backend and loaded into the datasetCache.
             */
            Workspace.prototype.uploadDatasetAsync = function (contents, newDatasetName, dataType, filename, description, familyId) {
                var _this = this;
                return DataLab.Util.then(this.workspaceBackend.uploadDatasetAsync(contents, newDatasetName, dataType, filename, description, familyId), function (newDatasetId) {
                    return _this.datasetCache.getItem(newDatasetId);
                });
            };
            /**
             Creates a new module from the contents of a Blob (zip File). This creates a new Module
             in the backing IWorkspaceBackend. The returned promise completes when the module has been
             created on the backend and the module pallet refreshed for each module
             */
            Workspace.prototype.uploadCustomModulePackageAsync = function (contents, newModuleName, dataType, filename, description, familyId) {
                var _this = this;
                return DataLab.Util.then(this.workspaceBackend.uploadCustomModulePackageAsync(contents, newModuleName, dataType, filename, description, familyId), function (newModuleResults) {
                    var moduleBuildResults = newModuleResults.slice();
                    var status = newModuleResults.splice(0, 1)[0];
                    if (status === "Finished") {
                        var promises = newModuleResults.map(function (x) {
                            return _this.moduleCache.getItem(x);
                        });
                        // Resolve the promises from refreshing the module cache
                        return DataLab.Util.then(DataLab.Util.when.apply(null, promises), function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i - 0] = arguments[_i];
                            }
                            var moduleNames = [];
                            moduleNames.push(status);
                            // Check if the categories for the modules we are adding exist, if not add it them to the moduleCategoryRegistry
                            args.forEach(function (m) {
                                if (!_this.moduleCategoryRegistry.contains(m.category)) {
                                    _this.applicationCache.addCategory(m.category, _this.moduleCategoryRegistry);
                                }
                                moduleNames.push(m.name());
                            });
                            return moduleNames;
                        });
                    }
                    else {
                        var failedResults = $.Deferred();
                        setTimeout(function () {
                            return failedResults.resolve(moduleBuildResults);
                        });
                        return failedResults;
                    }
                });
            };
            // TODO [1199157]: Workspace.getExperimentAsync should be reconciled with ApplicationCache. There's a lack of symmetry here.
            Workspace.prototype.getExperimentAsync = function (experimentId) {
                return this.workspaceBackend.getExperimentAsync(experimentId, this.moduleCache, this.datasetCache, this.trainedModelCache, this.transformModulesCache, this.applicationCache.dataTypeRegistry, this);
            };
            Workspace.prototype.getExperimentLineageAsync = function (experimentId) {
                return this.workspaceBackend.getExperimentLineageAsync(experimentId);
            };
            Workspace.prototype.getExperimentInfoAsync = function (experimentId) {
                return this.workspaceBackend.getExperimentInfoAsync(experimentId);
            };
            Workspace.prototype.getDataflowAsync = function (dataflowId) {
                return this.workspaceBackend.getDataflowAsync(dataflowId, this.moduleCache, this.datasetCache, this.trainedModelCache, this.transformModulesCache, this.applicationCache.dataTypeRegistry, this);
            };
            Workspace.prototype.createWebServiceGroupAsync = function (name, description, allowAnonymousTest) {
                return this.workspaceBackend.createWebServiceGroupAsync(name, description, allowAnonymousTest);
            };
            Workspace.prototype.getWebServiceGroupAsync = function (webServiceGroupId) {
                return this.workspaceBackend.getWebServiceGroupAsync(webServiceGroupId);
            };
            Workspace.prototype.updateWebServiceGroupAsync = function (webServiceGroupId, name, description, allowAnonymousTest) {
                return this.workspaceBackend.updateWebServiceGroupAsync(webServiceGroupId, name, description, allowAnonymousTest);
            };
            Workspace.prototype.listWebServiceGroupsAsync = function () {
                return this.workspaceBackend.listWebServiceGroupsAsync();
            };
            Workspace.prototype.deleteWebServiceGroupAsync = function (webServiceGroupId) {
                return this.workspaceBackend.deleteWebServiceGroupAsync(webServiceGroupId);
            };
            Workspace.prototype.createModelPackageAsync = function (webServiceGroupId, experiment, workspace) {
                return this.workspaceBackend.createModelPackageAsync(webServiceGroupId, experiment, workspace);
            };
            Workspace.prototype.listModelPackagesAsync = function (webServiceGroupId) {
                return this.workspaceBackend.listModelPackagesAsync(webServiceGroupId);
            };
            Workspace.prototype.getModelPackageAsync = function (webServiceGroupId, modelPackageId) {
                return this.workspaceBackend.getModelPackageAsync(webServiceGroupId, modelPackageId);
            };
            Workspace.prototype.updateModelPackageAsync = function (webServiceGroupId, modelPackageId, statusCode, inputsMetadata, outputMetadata, apiParameterMetadata) {
                return this.workspaceBackend.updateModelPackageAsync(webServiceGroupId, modelPackageId, statusCode, inputsMetadata, outputMetadata, apiParameterMetadata);
            };
            Workspace.prototype.registerWebServiceAsync = function (webServiceGroupId, modelPackageId) {
                return this.workspaceBackend.registerWebServiceAsync(webServiceGroupId, modelPackageId);
            };
            Workspace.prototype.getWebServiceAsync = function (webServiceGroupId, webServiceId) {
                return this.workspaceBackend.getWebServiceAsync(webServiceGroupId, webServiceId);
            };
            Workspace.prototype.updateWebServiceAsync = function (webServiceGroupId, webServiceId, modelPackageId, diagnosticsSettings) {
                return this.workspaceBackend.updateWebServiceAsync(webServiceGroupId, webServiceId, modelPackageId, diagnosticsSettings);
            };
            Workspace.prototype.invokeScoreWebServiceAsync = function (webServiceGroupId, webserviceId, inputs, globalParameters) {
                return this.workspaceBackend.invokeScoreWebServiceAsync(webServiceGroupId, webserviceId, inputs, globalParameters);
            };
            Workspace.prototype.createCommunityExperimentAsync = function (publishableExperiment, packageUri) {
                return this.workspaceBackend.createCommunityExperimentAsync(publishableExperiment, packageUri);
            };
            Workspace.prototype.getCommunityExperimentIdAsync = function (workspaceId, packageUri, communityUri) {
                return this.workspaceBackend.getCommunityExperimentIdAsync(workspaceId, packageUri, communityUri);
            };
            Workspace.prototype.getWorkspaceSettingsAsync = function () {
                return this.workspaceBackend.getWorkspaceSettingsAsync();
            };
            /**
             Updates workspace settings given a WorkspaceSettings instance. The regenerateType
             parameter is for specifying whether an authorization token needs to be regenerated.
             */
            Workspace.prototype.updateWorkspaceSettings = function (workspaceSettings, regenerateType) {
                return this.workspaceBackend.updateWorkspaceSettings(workspaceSettings, regenerateType);
            };
            Workspace.prototype.archiveExperimentAsync = function (experimentId) {
                var _this = this;
                return DataLab.Util.then(this.getExperimentAsync(experimentId), function (experiment) {
                    experiment.isArchived = true;
                    return _this.workspaceBackend.updateExperimentAsync(experiment);
                });
            };
            Workspace.prototype.unarchiveExperimentAsync = function (experimentId) {
                var _this = this;
                return DataLab.Util.then(this.getExperimentAsync(experimentId), function (experiment) {
                    experiment.isArchived = false;
                    return _this.workspaceBackend.updateExperimentAsync(experiment);
                });
            };
            Workspace.prototype.listExperimentsAsync = function (filter) {
                var filterFunction = function (experiment) {
                    if (filter.creator !== undefined && filter.creator !== experiment.Creator) {
                        return false;
                    }
                    if (filter.includeArchived !== undefined && filter.includeArchived !== experiment.IsArchived) {
                        return false;
                    }
                    if (filter.isDraft !== undefined) {
                        if (filter.isDraft && (DataLab.DataContract.State.InDraft !== experiment.Status.StatusCode)) {
                            return false;
                        }
                        if (!filter.isDraft && (DataLab.DataContract.State.InDraft === experiment.Status.StatusCode)) {
                            return false;
                        }
                    }
                    return true;
                };
                return DataLab.Util.then(this.workspaceBackend.listExperimentsAsync(filter), function (experiments) {
                    return experiments.filter(filterFunction);
                });
            };
            Workspace.prototype.listWorkspacesAsync = function () {
                return this.workspaceBackend.listWorkspacesAsync();
            };
            Workspace.prototype.createExperimentStoragePackageAsync = function (experimentId, clearCredentials, newExperimentName) {
                return this.workspaceBackend.createExperimentStoragePackageAsync(experimentId, clearCredentials, newExperimentName);
            };
            Workspace.prototype.getExperimentStoragePackageAsync = function (storagePackageId) {
                return this.workspaceBackend.getExperimentStoragePackageAsync(storagePackageId);
            };
            Workspace.prototype.createExperimentFromStoragePackageAsync = function (destinationWorkspaceId, packageUri) {
                return this.workspaceBackend.createExperimentFromStoragePackageAsync(destinationWorkspaceId, packageUri);
            };
            Workspace.prototype.getModuleVisualizationData = function (experimentId, nodeId, portName) {
                return this.workspaceBackend.getModuleVisualizationData(experimentId, nodeId, portName);
            };
            Workspace.prototype.getModuleVisualizationDataItem = function (experimentId, nodeId, portName, item, type, subtype, parseAs) {
                return this.workspaceBackend.getModuleVisualizationDataItem(experimentId, nodeId, portName, item, type, subtype, parseAs);
            };
            Workspace.prototype.getDatasetVisualizationData = function (datasetId) {
                return this.workspaceBackend.getDatasetVisualizationData(datasetId);
            };
            Workspace.prototype.getModuleOutputSchema = function (experimentId, nodeId, portName) {
                return this.workspaceBackend.getModuleOutputSchema(experimentId, nodeId, portName);
            };
            Workspace.prototype.getDatasetSchema = function (datasetId) {
                return this.workspaceBackend.getDatasetSchema(datasetId);
            };
            Workspace.prototype.getModuleOutput = function (experimentId, nodeId, portName) {
                return this.workspaceBackend.getModuleOutput(experimentId, nodeId, portName);
            };
            Workspace.prototype.getModuleErrorLog = function (experimentId, nodeId) {
                return this.workspaceBackend.getModuleErrorLog(experimentId, nodeId);
            };
            Workspace.prototype.signOut = function () {
                return this.workspaceBackend.signOut();
            };
            Workspace.prototype.getStorageSpaceQuotaAsync = function () {
                return this.workspaceBackend.getStorageSpaceQuotaAsync();
            };
            Workspace.prototype.getExperimentDetailsAsync = function (experimentId) {
                return this.workspaceBackend.getExperimentDetailsAsync(experimentId);
            };
            Workspace.prototype.updateExperimentDetailsAsync = function (experimentId, details) {
                return this.workspaceBackend.updateExperimentDetailsAsync(experimentId, details);
            };
            Workspace.prototype.listProjects = function (experimentId) {
                if (experimentId === void 0) { experimentId = null; }
                return this.workspaceBackend.listProjects(experimentId);
            };
            Workspace.prototype.createProject = function (request) {
                return this.workspaceBackend.createProject(request);
            };
            Workspace.prototype.updateProject = function (projectId, request) {
                return this.workspaceBackend.updateProject(projectId, request);
            };
            return Workspace;
        })();
        Model.Workspace = Workspace;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));
var DataLab;
(function (DataLab) {
})(DataLab || (DataLab = {}));

/// <reference path="../Util.ts" />
/// <reference path="Schema.ts" />
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var SchemaUtils;
        (function (SchemaUtils) {
            // Returns a deep clone of a schema
            function clone(schema) {
                return DataLab.Util.clone(schema);
            }
            SchemaUtils.clone = clone;
            // Returns the number of columns in a schema
            function numColumns(schema) {
                return schema.columnAttributes.length;
            }
            SchemaUtils.numColumns = numColumns;
            // Creates a new Schema object
            function createSchema(columnAttributes, scoreColumns, labelColumns, featureChannels, isInaccurate) {
                if (scoreColumns === void 0) { scoreColumns = {}; }
                if (labelColumns === void 0) { labelColumns = {}; }
                if (featureChannels === void 0) { featureChannels = []; }
                if (isInaccurate === void 0) { isInaccurate = 0 /* Accurate */; }
                return {
                    isInaccurate: isInaccurate,
                    columnAttributes: columnAttributes,
                    scoreColumns: scoreColumns,
                    labelColumns: labelColumns,
                    featureChannels: featureChannels
                };
            }
            SchemaUtils.createSchema = createSchema;
            // concatenate several schemas together horizontally, handling column name collisions
            function concat(first) {
                var rest = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    rest[_i - 1] = arguments[_i];
                }
                var result = clone(first);
                // make sure isInaccurate has a value in case it's undefined.
                result.isInaccurate = result.isInaccurate || 0 /* Accurate */;
                if (rest.length == 0) {
                    return result;
                }
                var resultNames = first.columnAttributes.map(function (ca) { return ca.name; });
                rest.forEach(function (schema) { return schema.columnAttributes.forEach(function (ca) { return resultNames.push(ca.name); }); });
                var numRenamed = correctColumnNames(resultNames, numColumns(first));
                var namesOffset = numColumns(first);
                rest.forEach(function (schema) {
                    schema = clone(schema);
                    schema.isInaccurate = schema.isInaccurate || 0 /* Accurate */;
                    result.isInaccurate = Math.max(result.isInaccurate, schema.isInaccurate);
                    if (numRenamed > 0) {
                        for (var i = 0; i < numColumns(schema); i++) {
                            var oldName = schema.columnAttributes[i].name;
                            var newName = resultNames[i + namesOffset];
                            if (oldName != newName) {
                                renameColumn(schema, i, newName, false);
                            }
                        }
                    }
                    namesOffset += numColumns(schema);
                    // merge column attributes
                    result.columnAttributes.push.apply(result.columnAttributes, schema.columnAttributes);
                    for (var key in schema.scoreColumns) {
                        if (!(key in result.scoreColumns)) {
                            result.scoreColumns[key] = schema.scoreColumns[key];
                        }
                    }
                    for (var key in schema.labelColumns) {
                        if (!(key in result.labelColumns)) {
                            result.labelColumns[key] = schema.labelColumns[key];
                        }
                    }
                    // merge featureChannels
                    schema.featureChannels.forEach(function (channel) {
                        var resultChannel = DataLab.Util.first(result.featureChannels, function (ch) { return ch.name == channel.name; }, null);
                        if (resultChannel) {
                            resultChannel.featureColumns.push.apply(resultChannel.featureColumns, channel.featureColumns);
                        }
                        else {
                            result.featureChannels.push(channel);
                        }
                    });
                });
                return result;
            }
            SchemaUtils.concat = concat;
            // return a new schema containing only the columns indicated by the given column indexes
            function selectColumns(schema, columnIndexes) {
                var newColumnAttrs = columnIndexes.map(function (index) { return schema.columnAttributes[index]; });
                var newColumnNames = new DataLab.Util.StringSet(newColumnAttrs.map(function (ca) { return ca.name; }));
                var newScoreColumns = Object.create(null);
                DataLab.Util.forEach(schema.scoreColumns, function (colName, key) {
                    if (newColumnNames.has(colName)) {
                        newScoreColumns[key] = colName;
                    }
                });
                var newLabelColumns = Object.create(null);
                DataLab.Util.forEach(schema.labelColumns, function (colName, key) {
                    if (newColumnNames.has(colName)) {
                        newLabelColumns[key] = colName;
                    }
                });
                var newFeatureChannels = [];
                schema.featureChannels.forEach(function (fc) {
                    var newFcColumns = fc.featureColumns.filter(function (name) { return newColumnNames.has(name); });
                    if (newFcColumns.length > 0) {
                        newFeatureChannels.push({ name: fc.name, isNormalized: fc.isNormalized, featureColumns: newFcColumns });
                    }
                });
                return createSchema(newColumnAttrs, newScoreColumns, newLabelColumns, newFeatureChannels, schema.isInaccurate);
            }
            SchemaUtils.selectColumns = selectColumns;
            function renameColumn(schema, oldNameOrIndex, newName, checkForCollisions) {
                if (checkForCollisions === void 0) { checkForCollisions = true; }
                var columnIndex;
                var oldName;
                var attrs = schema.columnAttributes;
                if (typeof oldNameOrIndex == "string") {
                    oldName = oldNameOrIndex;
                    var foundName = attrs.some(function (ca, index) {
                        if (ca.name == oldName) {
                            columnIndex = index;
                            return true;
                        }
                        return false;
                    });
                    if (!foundName) {
                        throw new Error("Couldn't find column named '" + oldName + "'");
                    }
                }
                else {
                    columnIndex = oldNameOrIndex;
                    if (columnIndex < 0 || columnIndex >= attrs.length) {
                        throw new Error("Out of bounds column index: " + columnIndex);
                    }
                    oldName = attrs[columnIndex].name;
                }
                if (checkForCollisions) {
                    if (attrs.some(function (ca) { return ca.name == newName; })) {
                        throw new Error("New column name already exists in schema: '" + newName + "'");
                    }
                }
                attrs[columnIndex].name = newName;
                for (var key in schema.labelColumns) {
                    if (schema.labelColumns[key] == oldName) {
                        schema.labelColumns[key] = newName;
                    }
                }
                for (var key in schema.scoreColumns) {
                    if (schema.scoreColumns[key] == oldName) {
                        schema.scoreColumns[key] = newName;
                    }
                }
                schema.featureChannels.forEach(function (channel) {
                    for (var i = 0; i < channel.featureColumns.length; i++) {
                        if (channel.featureColumns[i] == oldName) {
                            channel.featureColumns[i] = newName;
                        }
                    }
                });
            }
            SchemaUtils.renameColumn = renameColumn;
            // Handle column name colisions.  The names array is modified in-place. This is copied from 
            // Common.Dll.Common.CorrectColumnNames, and is the same algorithm used by the modules.  
            // Returns the number of columns renamed
            function correctColumnNames(names, numColumns1, minSuffixValue, suffixFormat) {
                if (minSuffixValue === void 0) { minSuffixValue = 2; }
                if (suffixFormat === void 0) { suffixFormat = "({0})"; }
                var n = names.length;
                if (n == numColumns1) {
                    return 0;
                }
                var uniqueColNames = new DataLab.Util.StringSet();
                for (var i = 0; i < numColumns1; i++) {
                    uniqueColNames.add(names[i]);
                }
                var colsToRename = [];
                for (var i = numColumns1; i < n; i++) {
                    if (!uniqueColNames.add(names[i])) {
                        // duplicate encountered
                        colsToRename.push(i);
                    }
                }
                // Add suffix to each duplicated column name to make it unique
                colsToRename.forEach(function (colIdx) {
                    var oldColName = names[colIdx];
                    var suffix = minSuffixValue;
                    var newColName;
                    do {
                        newColName = oldColName + DataLab.Util.format(suffixFormat, suffix.toString());
                        suffix++;
                    } while (!uniqueColNames.add(newColName));
                    names[colIdx] = newColName;
                });
                return colsToRename.length;
            }
        })(SchemaUtils = Model.SchemaUtils || (Model.SchemaUtils = {}));
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Schema.ts" />
/*
This file contains functionality to process column selector queries created by column selector dialogs.
*/
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var ColumnPicker;
        (function (ColumnPicker) {
            (function (RuleType) {
                RuleType[RuleType["ColumnNames"] = 0] = "ColumnNames";
                RuleType[RuleType["ColumnIndexes"] = 1] = "ColumnIndexes";
                RuleType[RuleType["ColumnTypes"] = 2] = "ColumnTypes";
                RuleType[RuleType["AllColumns"] = 3] = "AllColumns";
            })(ColumnPicker.RuleType || (ColumnPicker.RuleType = {}));
            var RuleType = ColumnPicker.RuleType;
            (function (ColumnType) {
                ColumnType[ColumnType["String"] = 0] = "String";
                ColumnType[ColumnType["Integer"] = 1] = "Integer";
                ColumnType[ColumnType["Double"] = 2] = "Double";
                ColumnType[ColumnType["Boolean"] = 3] = "Boolean";
                ColumnType[ColumnType["DateTime"] = 4] = "DateTime";
                ColumnType[ColumnType["TimeSpan"] = 5] = "TimeSpan";
                ColumnType[ColumnType["Categorical"] = 6] = "Categorical";
                ColumnType[ColumnType["Numeric"] = 7] = "Numeric";
                ColumnType[ColumnType["All"] = 8] = "All";
            })(ColumnPicker.ColumnType || (ColumnPicker.ColumnType = {}));
            var ColumnType = ColumnPicker.ColumnType;
            (function (ColumnKind) {
                ColumnKind[ColumnKind["Feature"] = 0] = "Feature";
                ColumnKind[ColumnKind["Score"] = 1] = "Score";
                ColumnKind[ColumnKind["Label"] = 2] = "Label";
                ColumnKind[ColumnKind["All"] = 3] = "All";
            })(ColumnPicker.ColumnKind || (ColumnPicker.ColumnKind = {}));
            var ColumnKind = ColumnPicker.ColumnKind;
            // Parse a column selector query in the JSON format generated by a column selector dialog, into an IQuery object.
            function parseQuery(json) {
                var rulesObj = JSON.parse(json);
                // sanity check to make sure it looks like a ruleset object
                if (!("isFilter" in rulesObj && "rules" in rulesObj)) {
                    throw new Error("Invalid ruleset JSON: " + json.substr(0, 1000) + " )");
                }
                var rules = rulesObj.rules.map(function (ruleObj) {
                    var ruleType = RuleType[ruleObj.ruleType];
                    var columns = [];
                    var columnTypes = [];
                    var columnKinds = [];
                    if ("columns" in ruleObj) {
                        columns = ruleObj.columns;
                    }
                    if ("columnTypes" in ruleObj) {
                        columnTypes = ruleObj.columnTypes.map(function (ct) { return ColumnType[ct]; });
                    }
                    if ("columnKinds" in ruleObj) {
                        columnKinds = ruleObj.columnKinds.map(function (ck) { return ColumnKind[ck]; });
                    }
                    return {
                        ruleType: ruleType,
                        exclude: ruleObj.exclude,
                        columns: columns,
                        columnTypes: columnTypes,
                        columnKinds: columnKinds
                    };
                });
                return {
                    isFilter: rulesObj.isFilter,
                    rules: rules
                };
            }
            ColumnPicker.parseQuery = parseQuery;
            // implements the same column selection logic as the .Net ColumnSelection class used by modules
            var ColumnSelection = (function () {
                function ColumnSelection(jsonOrQuery, source) {
                    var _this = this;
                    this.nameToIndexMap = null;
                    var query;
                    if (typeof jsonOrQuery == "string") {
                        query = parseQuery(jsonOrQuery);
                    }
                    else {
                        query = jsonOrQuery;
                    }
                    this.query = query;
                    this.source = source;
                    /*
                      Interpret the ruleset as follows to get the set of selected columns.
                      Prerequisites:
                      1. Each rule is either an include rule or exclude rule.
                      2. Rules are processed in order.
                      3. Ensure that the first rule is an include rule.  If the first rule is an
                         exclude rule then prepend an AllColumns include rule to the ruleset.
                      4. Let includedIndexes be the set of column indexes selected by the rules. It is
                         initially empty.
                   
                      Now interpret the rules in order as follows:
                      1. Interpret the rule's selection criteria as if it were an include rule, against
                         the full set of columns in the DataTable, to get a set of columns selected by the rule.
                      2. If the rule is an include rule, then set includedIndexes to the union of includedIndexes
                         and the rule's column set.
                      3. If the rule is an exclude rule, then remove any columns in the rule's column set from
                         includedIndexes.
                      4. Once all the rules have been processed, includedIndexes contains the set of selected
                         columns.
                     */
                    if (query.rules.length == 0) {
                        throw new Error("At least one rule must be specified");
                    }
                    // First rule must be an include rule
                    if (query.rules[0].exclude) {
                        throw new Error("The first rule must be an include rule.");
                    }
                    if (query.isFilter) {
                        // I use a StringSet because Javascript has no hashtable with non-string keys.
                        var includedIndexesSet = new DataLab.Util.StringSet();
                        query.rules.forEach(function (rule) {
                            var ruleColumns = _this.getRuleColumns(source, rule);
                            if (rule.exclude) {
                                includedIndexesSet.exceptWith(ruleColumns.map(function (c) { return c.toString(); }));
                            }
                            else {
                                includedIndexesSet.unionWith(ruleColumns.map(function (c) { return c.toString(); }));
                            }
                        });
                        this.includedColumnIndexes = includedIndexesSet.map(function (i) { return parseInt(i); }).sort(function (a, b) { return a - b; });
                    }
                    else {
                        if (query.rules.length != 1) {
                            throw new Error("Only one rule is allowed in non-filter mode.");
                        }
                        // In non-filter mode, only one include rule is allowed, and column order and duplicate columns
                        // are preserved.
                        this.includedColumnIndexes = this.getRuleColumns(source, query.rules[0]);
                    }
                }
                // Returns the column indexes of the columns of source selected by rule
                ColumnSelection.prototype.getRuleColumns = function (source, rule) {
                    switch (rule.ruleType) {
                        case 0 /* ColumnNames */:
                            return this.handleColumnNamesRule(source, rule);
                        case 1 /* ColumnIndexes */:
                            return this.handleColumnIndexesRule(source, rule);
                        case 2 /* ColumnTypes */:
                            return this.handleColumnTypesRule(source, rule);
                        case 3 /* AllColumns */:
                            return source.columnAttributes.map(function (val, index) { return index; });
                        default:
                            throw new Error("Unhandled ruleType: " + rule.ruleType);
                    }
                };
                // Return the column indexes of columns selected by a ColumnNames rule
                ColumnSelection.prototype.handleColumnNamesRule = function (source, rule) {
                    var _this = this;
                    if (!this.nameToIndexMap) {
                        this.nameToIndexMap = Object.create(null);
                        this.source.columnAttributes.forEach(function (ca, index) { return _this.nameToIndexMap[ca.name] = index; });
                    }
                    return rule.columns.filter(function (name) { return name in _this.nameToIndexMap; }).map(function (name) { return _this.nameToIndexMap[name]; });
                };
                // Return the column indexes of columns selected by a ColumnIndexes rule
                ColumnSelection.prototype.handleColumnIndexesRule = function (source, rule) {
                    var indexRegex = /^\s*(\d+)\s*$/;
                    var indexRangeRegex = /^\s*(\d+)\s*\-\s*(\d+)\s*$/;
                    var numColumns = source.columnAttributes.length;
                    var indexes = [];
                    // each column expression can be either a single column index, or a range of column indexes
                    rule.columns.forEach(function (indexExpr) {
                        var match = indexExpr.match(indexRegex);
                        if (match) {
                            var columnIndex = parseInt(match[1]) - 1;
                            if (columnIndex >= 0 && columnIndex < numColumns) {
                                indexes.push(columnIndex);
                            }
                        }
                        else {
                            match = indexExpr.match(indexRangeRegex);
                            if (!match) {
                                throw new Error("Invalid index range expression: " + indexExpr);
                            }
                            var startIndex = parseInt(match[1]) - 1;
                            var endIndex = parseInt(match[2]) - 1;
                            if (endIndex < startIndex || startIndex < 0 || endIndex < 0) {
                                throw new Error("Out of range column range: " + indexExpr);
                            }
                            if (startIndex < numColumns && endIndex < numColumns) {
                                for (var i = startIndex; i <= endIndex; i++) {
                                    indexes.push(i);
                                }
                            }
                        }
                    });
                    return indexes;
                };
                // Return the column indexes of columns selected by a ColumnTypes rule
                ColumnSelection.prototype.handleColumnTypesRule = function (source, rule) {
                    // for now the ruleColumnElementTypes array will have to hold the high level column type.  When 
                    // the column element type change goes through, I will change this to hold the element types instead.
                    var ruleColumnElementTypes = [];
                    var isCategorical = false;
                    var allTypes = false;
                    rule.columnTypes.forEach(function (type) {
                        switch (type) {
                            case 0 /* String */:
                                ruleColumnElementTypes.push("String");
                                break;
                            case 1 /* Integer */:
                            case 2 /* Double */:
                            case 7 /* Numeric */:
                                // for now I have to lump integer and double together with numeric because the schema doesn't have
                                // more detailed information.  When the element type changeset goes in I can fix this.
                                ruleColumnElementTypes.push("Numeric");
                                break;
                            case 3 /* Boolean */:
                                ruleColumnElementTypes.push("Binary");
                                break;
                            case 4 /* DateTime */:
                            case 5 /* TimeSpan */:
                                // same here, I can fix this to be more specific when schema element type change goes through
                                ruleColumnElementTypes.push("Object");
                                break;
                            case 6 /* Categorical */:
                                isCategorical = true;
                                break;
                            case 8 /* All */:
                                allTypes = true;
                                break;
                            default:
                                throw new Error("Unhandled ColumnType: " + type);
                        }
                    });
                    var indexes = [];
                    source.columnAttributes.forEach(function (ca, colIndex) {
                        if (allTypes || (isCategorical && ca.type == "Categorical") || ruleColumnElementTypes.indexOf(ca.type) >= 0) {
                            for (var i = 0; i < rule.columnKinds.length; i++) {
                                var kind = rule.columnKinds[i];
                                var includeColumn;
                                switch (kind) {
                                    case 0 /* Feature */:
                                        includeColumn = ca.isFeature;
                                        break;
                                    case 1 /* Score */:
                                        includeColumn = DataLab.Util.values(source.scoreColumns).indexOf(ca.name) >= 0;
                                        break;
                                    case 2 /* Label */:
                                        includeColumn = DataLab.Util.values(source.labelColumns).indexOf(ca.name) >= 0;
                                        break;
                                    case 3 /* All */:
                                        includeColumn = true;
                                        break;
                                    default:
                                        throw new Error("Unhandled ColumnKind: " + kind);
                                }
                                if (includeColumn) {
                                    indexes.push(colIndex);
                                    break;
                                }
                            }
                        }
                    });
                    return indexes;
                };
                return ColumnSelection;
            })();
            ColumnPicker.ColumnSelection = ColumnSelection;
        })(ColumnPicker = Model.ColumnPicker || (Model.ColumnPicker = {}));
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Schema.ts" />
/// <reference path="ColumnPickerQuery.ts" />
/// <reference path="SchemaUtils.ts" />
/*
This file contains support for computing the output schema of the Metadata Editor module.
*/
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var MetadataEditor;
        (function (MetadataEditor) {
            (function (DataType) {
                DataType[DataType["Unchanged"] = 0] = "Unchanged";
                DataType[DataType["String"] = 1] = "String";
                DataType[DataType["Integer"] = 2] = "Integer";
                DataType[DataType["Double"] = 3] = "Double";
                DataType[DataType["Boolean"] = 4] = "Boolean";
                DataType[DataType["DateTime"] = 5] = "DateTime";
                DataType[DataType["TimeSpan"] = 6] = "TimeSpan";
            })(MetadataEditor.DataType || (MetadataEditor.DataType = {}));
            var DataType = MetadataEditor.DataType;
            (function (Categorical) {
                Categorical[Categorical["Unchanged"] = 0] = "Unchanged";
                Categorical[Categorical["Categorical"] = 1] = "Categorical";
                Categorical[Categorical["NonCategorical"] = 2] = "NonCategorical";
            })(MetadataEditor.Categorical || (MetadataEditor.Categorical = {}));
            var Categorical = MetadataEditor.Categorical;
            (function (Fields) {
                Fields[Fields["Unchanged"] = 0] = "Unchanged";
                Fields[Fields["Features"] = 1] = "Features";
                Fields[Fields["Labels"] = 2] = "Labels";
                Fields[Fields["Weights"] = 3] = "Weights";
                Fields[Fields["ClearFeatures"] = 4] = "ClearFeatures";
                Fields[Fields["ClearLabels"] = 5] = "ClearLabels";
                Fields[Fields["ClearScores"] = 6] = "ClearScores";
                Fields[Fields["ClearWeights"] = 7] = "ClearWeights";
            })(MetadataEditor.Fields || (MetadataEditor.Fields = {}));
            var Fields = MetadataEditor.Fields;
            // given an input schema, and all the same input parameters which were passed to the Metadata Editor, compute its output schema
            function computeOutputSchema(inputSchema, columnSelection, newDataType, newCategoricalAttribute, newFieldAttribute, newColumnNamesString) {
                var result = Model.SchemaUtils.clone(inputSchema);
                // handle changes in column type
                if (newDataType != 0 /* Unchanged */) {
                    columnSelection.includedColumnIndexes.forEach(function (colIdx) {
                        var colTypeStr;
                        switch (newDataType) {
                            case 1 /* String */:
                                colTypeStr = "String";
                                break;
                            case 2 /* Integer */:
                            case 3 /* Double */:
                                colTypeStr = "Numeric";
                                break;
                            case 4 /* Boolean */:
                                colTypeStr = "Binary";
                                break;
                            case 5 /* DateTime */:
                            case 6 /* TimeSpan */:
                                colTypeStr = "Object";
                                break;
                            default:
                                throw new Error("Unexpected DataType encountered");
                        }
                        result.columnAttributes[colIdx].type = colTypeStr;
                    });
                }
                // handle changes in categorical-ness
                if (newCategoricalAttribute != 0 /* Unchanged */) {
                    columnSelection.includedColumnIndexes.forEach(function (colIdx) {
                        var ca = result.columnAttributes[colIdx];
                        switch (newCategoricalAttribute) {
                            case 1 /* Categorical */:
                                if (ca.type != "Categorical") {
                                    ca.type = "Categorical";
                                    ca.domain = {
                                        categoryType: "double",
                                        isNullable: true,
                                        categories: []
                                    };
                                }
                                break;
                            case 2 /* NonCategorical */:
                                if (ca.type == "Categorical") {
                                    if (["short", "ushort", "int", "uint", "long", "ulong", "float", "double"].indexOf(ca.domain.categoryType) != -1) {
                                        ca.type = "Numeric";
                                    }
                                    else if (ca.domain.categoryType == "string") {
                                        ca.type = "String";
                                    }
                                    else {
                                        ca.type = "Object";
                                    }
                                    ca.domain = undefined;
                                }
                                break;
                            default:
                                throw new Error("Unexpected Categorical value encountered");
                        }
                    });
                }
                if (newFieldAttribute != 0 /* Unchanged */) {
                    changeFeatureAndLabelColumns(result, columnSelection.includedColumnIndexes, newFieldAttribute);
                }
                // handle column renaming
                if (newColumnNamesString) {
                    var newColumnNames = splitCsvString(newColumnNamesString);
                    if (newColumnNames.length != (new DataLab.Util.StringSet(newColumnNames)).size) {
                        throw new Error("Duplicate column names given for renaming");
                    }
                    if (newColumnNames.length != columnSelection.includedColumnIndexes.length) {
                        throw new Error("Number of new column names must match number of selected columns");
                    }
                    for (var i = 0; i < newColumnNames.length; i++) {
                        Model.SchemaUtils.renameColumn(result, columnSelection.includedColumnIndexes[i], newColumnNames[i], false);
                    }
                }
                return result;
            }
            MetadataEditor.computeOutputSchema = computeOutputSchema;
            var defaultLabelType = "True Labels";
            // Makes change to feature, label and score columns.  Modifies schema in place.
            function changeFeatureAndLabelColumns(schema, selectedColumns, newFieldAttribute) {
                switch (newFieldAttribute) {
                    case 0 /* Unchanged */:
                        break;
                    case 1 /* Features */:
                        selectedColumns.forEach(function (colIdx) { return schema.columnAttributes[colIdx].isFeature = true; });
                        break;
                    case 2 /* Labels */:
                        if (selectedColumns.length == 1) {
                            schema.labelColumns[defaultLabelType] = schema.columnAttributes[selectedColumns[0]].name;
                            schema.columnAttributes[selectedColumns[0]].isFeature = false;
                        }
                        break;
                    case 4 /* ClearFeatures */:
                        selectedColumns.forEach(function (colIdx) { return schema.columnAttributes[colIdx].isFeature = false; });
                        break;
                    case 5 /* ClearLabels */:
                        if (defaultLabelType in schema.labelColumns) {
                            var labelColName = schema.labelColumns[defaultLabelType];
                            if (selectedColumns.some(function (i) { return schema.columnAttributes[i].name == labelColName; })) {
                                delete schema.labelColumns[defaultLabelType];
                            }
                        }
                        break;
                    case 6 /* ClearScores */:
                        schema.scoreColumns = {};
                        break;
                    case 3 /* Weights */:
                    case 7 /* ClearWeights */:
                        break;
                    default:
                        throw new Error("Unexpected Fields value encountered");
                }
            }
            /// <summary>
            /// Splits a string into fields using commas as the separator, handling quoted fields
            /// </summary>
            /// <param name="csvString">The string to split</param>
            /// <returns>An array containing the field values.</returns>
            /// <remarks>
            /// This function follows rules similar to how Excel would parse a single line of a CSV for handling double-quotes 
            /// in field values.  One thing this does differently from Excel is that it ignores whitespace at the beginning of 
            /// fields.
            /// <para>
            /// If the first character in a field is a double-quote, then all characters up until another unescaped 
            /// double-quote, including commas, are part of the field value.  The surrounding quotes are not part
            /// of the field value. 
            /// </para><para>
            /// If a field starts with a quote, and the line ends without seeing another quote, it is treated as if the line ended
            /// with a quote.
            /// </para><para>
            /// Within a quoted field, a double-quote can be included by using two quotes, as in "a "" within".
            /// </para><para>
            /// If a field does not start with a double-quote, then any double-quotes within it are just treated as normal 
            /// characters and do not need to be escaped.  For example given the line:
            /// a"b,c
            /// the first field value is a"b.
            /// </para><para>
            /// A field value can continue after the closing quote of a quoted section.  For example given the line
            /// "a"b,c
            /// The first field value is ab.
            /// </para>
            /// </remarks>
            function splitCsvString(csvString) {
                var result = [];
                var field = "";
                var unquotedField = "";
                var index = 0;
                function trimEnd(str) {
                    return str.replace(/\s*$/, "");
                }
                while (index < csvString.length) {
                    var ch = csvString.charAt(index++);
                    if (ch == ',') {
                        // end of a field
                        field += trimEnd(unquotedField);
                        result.push(field);
                        field = '';
                        unquotedField = '';
                    }
                    else if ((ch == ' ' || ch == '\t') && field.length == 0 && unquotedField.length == 0) {
                    }
                    else if (ch == '"' && field.length == 0 && unquotedField.length == 0) {
                        while (index < csvString.length) {
                            ch = csvString.charAt(index++);
                            if (ch == '"') {
                                if (index < csvString.length && csvString.charAt(index) == '"') {
                                    // it's an escaped "
                                    field += ch;
                                    index++;
                                }
                                else {
                                    break;
                                }
                            }
                            else {
                                // a character within the quoted section
                                field += ch;
                            }
                        }
                    }
                    else {
                        // part of an unquoted portion of a field
                        unquotedField += ch;
                    }
                }
                // add the last field
                field += trimEnd(unquotedField);
                result.push(field);
                return result;
            }
        })(MetadataEditor = Model.MetadataEditor || (Model.MetadataEditor = {}));
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="ModuleNode.ts" />
/// <reference path="Schema.ts" />
/// <reference path="Workspace.ts" />
/// <reference path="SchemaUtils.ts" />
/// <reference path="ColumnPickerQuery.ts" />
/// <reference path="MetadataEditorSchemaPropagation.ts" />
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        // Implements a rule which returns a schema whose columns are a union of the columns of all input ports to the module.
        // Intended to be used as a default rule for modules which don't have a custom propagation rule.
        var UnionOfInputPortsRule = (function () {
            function UnionOfInputPortsRule() {
            }
            UnionOfInputPortsRule.prototype.computeOutputSchema = function (moduleNode, workspace) {
                var _this = this;
                var inputPorts = DataLab.Util.filter(moduleNode.inputPorts, function (port) { return port.isDatasetDataType() && port.isConnected(); });
                if (inputPorts.length == 0) {
                    return DataLab.Util.when(null);
                }
                var inputPortNames = inputPorts.map(function (port) { return port.name; });
                return applyFunctionToInputSchemas(moduleNode, workspace, inputPortNames, function () {
                    var schemas = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        schemas[_i - 0] = arguments[_i];
                    }
                    return _this.unionOfSchemas(schemas);
                });
            };
            UnionOfInputPortsRule.prototype.unionOfSchemas = function (schemas) {
                var result = Model.SchemaUtils.clone(schemas[0]);
                result.isInaccurate = 2 /* Inaccurate */;
                if (schemas.length > 1) {
                    var namesUsed = new DataLab.Util.StringSet(result.columnAttributes.map(function (ca) { return ca.name; }));
                    for (var i = 1; i < schemas.length; i++) {
                        schemas[i].columnAttributes.forEach(function (ca) {
                            if (namesUsed.add(ca.name)) {
                                result.columnAttributes.push(DataLab.Util.clone(ca));
                            }
                        });
                    }
                }
                result.columnAttributes.forEach(function (ca) { return ca.isInaccurate = true; });
                return result;
            };
            return UnionOfInputPortsRule;
        })();
        // return a default rule to use for modules which don't have a specific rule assigned to them yet.
        function makeDefaultRule() {
            return new UnionOfInputPortsRule();
        }
        /* Takes an array of input port names, and a propagation function, and returns a SchemaPropagationRule.  The returned rule will
         * attempt to fetch the schemas for the given input ports, and if it successfully retrieves them all, it will invoke the
         * given propagation function with the schemas in the same order as the given input port names.
         */
        function makeSchemaPropagationRule(inputPortNames, propagationFunc) {
            return {
                computeOutputSchema: function (moduleNode, workspace) {
                    return applyFunctionToInputSchemas(moduleNode, workspace, inputPortNames, function () {
                        var schemas = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            schemas[_i - 0] = arguments[_i];
                        }
                        return propagationFunc.apply(null, [moduleNode, workspace].concat(schemas));
                    });
                }
            };
        }
        // Create rule which returns the same schema as the given input port
        function makeIdentityRule(inputPortName) {
            return makeSchemaPropagationRule([inputPortName], function (moduleNode, workspace, schema) {
                return schema;
            });
        }
        // Create a rule which returns the schema of the given input port with the given new columns appended.
        function makeAddColumnsRule(inputPortName, newColumns) {
            return makeSchemaPropagationRule([inputPortName], function (moduleNode, workspace, schema) {
                return Model.SchemaUtils.concat(schema, Model.SchemaUtils.createSchema(newColumns));
            });
        }
        // Create a rule which concatenates the schemas of the given input ports
        function makeConcatRule(firstInputPortName, secondInputPortName) {
            return makeSchemaPropagationRule([firstInputPortName, secondInputPortName], function (moduleNode, workspace, schema1, schema2) {
                return Model.SchemaUtils.concat(schema1, schema2);
            });
        }
        // Creates a rule which returns a schema containing o ly the  olumns selecte by the given
        // column selector parameter from the given input port.
        function makeColumnSelectorRule(columnSelectorName, inputPortName) {
            return makeSchemaPropagationRule([inputPortName], function (moduleNode, workspace, schema) {
                var paramValue = moduleNode.parameters[columnSelectorName].value();
                if (!paramValue) {
                    // if column selector hasn't been set yet, can't compute schema
                    return null;
                }
                var selection = new Model.ColumnPicker.ColumnSelection(decodeURIComponent(paramValue), schema);
                return Model.SchemaUtils.selectColumns(schema, selection.includedColumnIndexes);
            });
        }
        // Create a rule to handle a pattern which is used by several modules.  These modules have a single input port, a column selector parameter, 
        // and an outputMode parameter which can have the values Inplace, Append or ResultOnly.  If outputMode is Inplace then they return
        // the input schema; if outputMode is ResultOnly then they return the result of applying the column selector to the input, and if outputMode
        // is Append, they return the result of appending the selected columns to the input schema.
        function makeOutputModeAndColumnSelectorRule(columnSelectorName, outputModeName, inputPortName) {
            return makeSchemaPropagationRule([inputPortName], function (moduleNode, workspace, inputSchema) {
                var outputMode = moduleNode.parameters[outputModeName].value();
                if (outputMode == "Inplace") {
                    return inputSchema;
                }
                else {
                    var columnSelectorValue = moduleNode.parameters[columnSelectorName].value();
                    if (!columnSelectorValue) {
                        return null;
                    }
                    var selection = new Model.ColumnPicker.ColumnSelection(decodeURIComponent(columnSelectorValue), inputSchema);
                    var resultColumns = Model.SchemaUtils.selectColumns(inputSchema, selection.includedColumnIndexes);
                    if (outputMode == "Append") {
                        return Model.SchemaUtils.concat(inputSchema, resultColumns);
                    }
                    else {
                        // outputMode == "ResultOnly"
                        return resultColumns;
                    }
                }
            });
        }
        function computeSchemaOfInputPort(workspace, inputPortOrName, moduleNode) {
            var inputPort;
            if (typeof inputPortOrName == "string") {
                var inputPortName = inputPortOrName;
                inputPort = moduleNode.inputPorts[inputPortOrName];
                if (!inputPort) {
                    throw new Error("Expected input port not found: '" + inputPortName + "'");
                }
            }
            else {
                inputPort = inputPortOrName;
            }
            var connectedPort = inputPort.connectedOutputPort;
            if (connectedPort) {
                // if connected to a dataset, fetch the schema for that dataset.
                if (connectedPort.parent instanceof Model.DatasetNode) {
                    if (connectedPort.schemaEndpoint) {
                        return workspace.getDatasetSchema(connectedPort.parent.dataset.id);
                    }
                }
                else if (connectedPort.parent instanceof Model.ModuleNode) {
                    var connectedModule = connectedPort.parent;
                    // if parent module is clean and has already run, prefer the actual schema of its output to a computed schema
                    var preferActualSchema = connectedPort.schemaEndpoint && !connectedModule.isDirty;
                    var rule = connectedPort.descriptor.schemaPropagationRule;
                    var promise = DataLab.Util.when(null);
                    // compute schema using rule if a rule exists and we don't prefer actual schema
                    if (!preferActualSchema && rule) {
                        promise = rule.computeOutputSchema(connectedModule, workspace);
                    }
                    return DataLab.Util.then(promise, function (schema) {
                        // if promise yielded a schema, return it, otherwise try fetching a schema from the service if one is available.
                        if (schema) {
                            return schema;
                        }
                        else if (connectedPort.schemaEndpoint) {
                            return workspace.getModuleOutputSchema(connectedModule.executedExperimentId, connectedModule.id, connectedPort.name);
                        }
                        else {
                            return null;
                        }
                    });
                }
            }
            return DataLab.Util.when(null);
        }
        Model.computeSchemaOfInputPort = computeSchemaOfInputPort;
        // Utility function which will fetch a set of schemas from the given input ports of a module, and if it successfully gets them all
        // it applies a schema propagation function to the resulting schemas to compute an output schema.  Returns a promise whose value will
        // be either the schema returned by propagationFunc, or null if it failed to fetch all the input port schemas.
        function applyFunctionToInputSchemas(moduleNode, workspace, inputPortNames, propagationFunc) {
            var schemaPromises = inputPortNames.map(function (name) { return computeSchemaOfInputPort(workspace, name, moduleNode); });
            var schemaPromise;
            if (schemaPromises.length > 1) {
                schemaPromise = DataLab.Util.when.apply(null, schemaPromises);
            }
            else {
                schemaPromise = schemaPromises[0];
            }
            return DataLab.Util.then(schemaPromise, function () {
                var schemas = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    schemas[_i - 0] = arguments[_i];
                }
                if (schemas.every(function (s) { return s != null; })) {
                    return propagationFunc.apply(null, schemas);
                }
                else {
                    return null;
                }
            });
        }
        // table used to store schema propagation rules for module/output port pairs.
        var moduleSchemaPropagationRulesTable = {};
        function registerRule(moduleName, outputPortName, ruleOrInputPorts, propagationFunc) {
            var rule;
            if (typeof propagationFunc == "undefined") {
                rule = ruleOrInputPorts;
            }
            else {
                var inputPortNames = ruleOrInputPorts;
                rule = makeSchemaPropagationRule(inputPortNames, propagationFunc);
            }
            moduleSchemaPropagationRulesTable[moduleName + "/" + outputPortName] = rule;
        }
        // Gets the schema propagation rule registered for the given module and output port, or returns a default
        // rule if none was registered.
        function getSchemaPropagationRule(moduleName, outputPortName) {
            var key = moduleName + "/" + outputPortName;
            return moduleSchemaPropagationRulesTable[key] || makeDefaultRule();
        }
        Model.getSchemaPropagationRule = getSchemaPropagationRule;
        // Register rules for modules
        registerRule("Add Columns", "Combined dataset", makeConcatRule("Left dataset", "Right dataset"));
        // TODO: Add Image Labels
        registerRule("Add Rows", "Results dataset", makeIdentityRule("Dataset1"));
        registerRule("Apply Filter", "Results dataset", makeColumnSelectorRule("Column set", "Dataset"));
        // TODO: Apply Math Operation
        // TODO: Apply Quantization Function
        // TODO: Apply Transformation
        registerRule("Assign to Clusters", "Results dataset", ["Dataset"], function (moduleNode, workspace, schema) {
            var appendParamName = "Check for Append or Uncheck for Result Only";
            var append = moduleNode.parameters[appendParamName].value();
            var assignColumnSchema = Model.SchemaUtils.createSchema([{ name: "Assignment", type: "Numeric", isFeature: true }]);
            if (append) {
                return Model.SchemaUtils.concat(schema, assignColumnSchema);
            }
            else {
                return assignColumnSchema;
            }
        });
        registerRule("Clip Values", "Results dataset", ["Dataset"], function (moduleNode, workspace, inputSchema) {
            var overwrite = moduleNode.parameters["Overwrite flag"].value();
            var addIndicatorColumns = moduleNode.parameters["Add indicator columns"].value();
            if (overwrite && !addIndicatorColumns) {
                return inputSchema;
            }
            var result = Model.SchemaUtils.clone(inputSchema);
            var newColAttrs = [];
            result.columnAttributes.forEach(function (ca) {
                newColAttrs.push(ca);
                if (!overwrite) {
                    newColAttrs.push({
                        name: ca.name + "_clipped_value",
                        type: ca.type,
                        isFeature: true
                    });
                }
                if (addIndicatorColumns) {
                    newColAttrs.push({
                        name: ca.name + "_clipped",
                        type: "Binary",
                        isFeature: true
                    });
                }
            });
            result.columnAttributes = newColAttrs;
            return result;
        });
        for (var format in ["CSV", "TSV", "ARFF", "SVMLight", "Dataset"]) {
            var moduleName = "Convert to " + format;
            registerRule(moduleName, "Results dataset", makeIdentityRule("Dataset"));
        }
        // TODO: Cross Validate Model
        // TODO: Descriptive Statistics
        // TODO: Elementary Statistics
        // TODO: Evaluate Model
        // TODO: Evaluate Recommender
        // TODO: Feature Hashing
        // TODO: Filter Based Feature Selection
        // TODO: Hypothesis Testing T-Test
        registerRule("Group Categorical Values", "Results dataset", makeOutputModeAndColumnSelectorRule("Selected columns", "Output mode", "Dataset"));
        registerRule("Indicator Values", "Results dataset", ["Dataset"], function (moduleNode, workspace, inputSchema) {
            var overwrite = moduleNode.parameters["Overwrite categorical columns"].value();
            if (overwrite) {
                return inputSchema;
            }
            else {
                var columnSelectorValue = moduleNode.parameters["Categorical columns to convert"].value();
                if (!columnSelectorValue) {
                    return null;
                }
                var selection = new Model.ColumnPicker.ColumnSelection(decodeURIComponent(columnSelectorValue), inputSchema);
                var resultColumns = Model.SchemaUtils.selectColumns(inputSchema, selection.includedColumnIndexes);
                return Model.SchemaUtils.concat(inputSchema, resultColumns);
            }
        });
        // TODO: Join
        registerRule("Linear Correlation", "Results dataset", makeIdentityRule("Dataset"));
        // TODO: Linear Discriminant Analysis
        // TODO: Metadata Editor
        registerRule("Metadata Editor", "Results dataset", ["Dataset"], function (moduleNode, workspace, inputSchema) {
            var columnSelectorValue = moduleNode.parameters["Column"].value();
            if (!columnSelectorValue) {
                return null;
            }
            var selection = new Model.ColumnPicker.ColumnSelection(decodeURIComponent(columnSelectorValue), inputSchema);
            var newDataTypeStr = moduleNode.parameters["Data Type"].value();
            var newDataType = Model.MetadataEditor.DataType[newDataTypeStr];
            var newCategoricalStr = moduleNode.parameters["Categorical"].value();
            var newCategorical = Model.MetadataEditor.Categorical[newCategoricalStr];
            var newFieldsStr = moduleNode.parameters["Fields"].value();
            var newFields = Model.MetadataEditor.Fields[newFieldsStr];
            var newColumnNames = moduleNode.parameters["New Column Name"].value();
            return Model.MetadataEditor.computeOutputSchema(inputSchema, selection, newDataType, newCategorical, newFields, newColumnNames);
        });
        registerRule("Missing Values Scrubber", "Results dataset", ["Dataset"], function (moduleNode, workspace, inputSchema) {
            var result = Model.SchemaUtils.clone(inputSchema);
            var colsWithAllMissings = moduleNode.parameters["Cols with all MV"].value();
            var genIndicatorCols = moduleNode.parameters["MV indicator column"].value();
            if (colsWithAllMissings != "KeepColumns" || genIndicatorCols != "DoNotGenerate") {
                result.isInaccurate = 1 /* Superset */;
            }
            if (colsWithAllMissings != "KeepColumns") {
                result.columnAttributes.forEach(function (ca) { return ca.isInaccurate = true; });
            }
            if (genIndicatorCols != "DoNotGenerate") {
                var indicatorCols = result.columnAttributes.map(function (ca) {
                    return { name: ca.name + "_IsMissing", type: "Binary", isFeature: true, isInaccurate: true };
                });
                var indicatorsSchema = Model.SchemaUtils.createSchema(indicatorCols);
                result = Model.SchemaUtils.concat(result, indicatorsSchema);
            }
            return result;
        });
        // TODO: Named Entity Recognition
        registerRule("Partition and Sample", "Results dataset", makeIdentityRule("Dataset"));
        registerRule("Probability Function Evaluation", "Results dataset", makeOutputModeAndColumnSelectorRule("Column set", "Result mode", "Dataset"));
        registerRule("Project Columns", "Results dataset", makeColumnSelectorRule("Select Columns", "Dataset"));
        registerRule("Quantize", "Quantized dataset", makeOutputModeAndColumnSelectorRule("Comma-separated list of columns to bin", "Output mode", "Dataset"));
        registerRule("Remove Duplicate Rows", "Results dataset", makeIdentityRule("Dataset"));
        // TODO: Replace Discrete Values
        // TODO: Score Matchbox Recommender
        // TODO: Fix Score Module to take into account ILearner input.
        registerRule("Score Model", "Scored dataset", makeAddColumnsRule("Dataset", [{ name: "Scored Labels", type: "String", isFeature: true }, { name: "Scored Probabilities", type: "Numeric", isFeature: true }]));
        registerRule("Split", "Results dataset1", makeIdentityRule("Dataset"));
        registerRule("Split", "Results dataset2", makeIdentityRule("Dataset"));
        // TODO: Sweep Parameters
        // TODO: Train Clustering Model
        registerRule("Transform Data By Scaling", "Transformed dataset", makeIdentityRule("Dataset"));
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="SchemaPropagationRule.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var ModulePortDescriptor = (function () {
            function ModulePortDescriptor(name, friendlyName, allowedDataTypes, optional) {
                if (optional === void 0) { optional = false; }
                if (!allowedDataTypes || allowedDataTypes.length == 0) {
                    throw new Error("At least one allowed DataType must be specified");
                }
                this.name = name;
                this.friendlyName = friendlyName;
                this.allowedDataTypes = DataLab.Util.values(allowedDataTypes);
                this.optional = optional;
            }
            /** Indicates if this descriptor is compatible with another (i.e. a port of this descriptor is potentially
                compatible with a port of the other descriptor. This relation is symmetric, irreflexive, and transitive. */
            ModulePortDescriptor.prototype.isCompatible = function (other) {
                throw new Error("isCompatible is abstract");
            };
            return ModulePortDescriptor;
        })();
        Model.ModulePortDescriptor = ModulePortDescriptor;
        var ModuleInputPortDescriptor = (function (_super) {
            __extends(ModuleInputPortDescriptor, _super);
            function ModuleInputPortDescriptor(name, friendlyName, allowedDataTypes, optional) {
                _super.call(this, name, friendlyName, allowedDataTypes, optional);
            }
            ModuleInputPortDescriptor.prototype.isCompatible = function (other) {
                return other instanceof ModuleOutputPortDescriptor && allowedDataTypesAreCompatible(this, other);
            };
            return ModuleInputPortDescriptor;
        })(ModulePortDescriptor);
        Model.ModuleInputPortDescriptor = ModuleInputPortDescriptor;
        var ModuleOutputPortDescriptor = (function (_super) {
            __extends(ModuleOutputPortDescriptor, _super);
            function ModuleOutputPortDescriptor(name, friendlyName, dataType, optional) {
                // Currently only input ports can have multiple allowed types.
                _super.call(this, name, friendlyName, [dataType], optional);
            }
            ModuleOutputPortDescriptor.prototype.isCompatible = function (other) {
                return other instanceof ModuleInputPortDescriptor && allowedDataTypesAreCompatible(other, this);
            };
            return ModuleOutputPortDescriptor;
        })(ModulePortDescriptor);
        Model.ModuleOutputPortDescriptor = ModuleOutputPortDescriptor;
        function allowedDataTypesAreCompatible(input, output) {
            if (output.allowedDataTypes.length !== 1) {
                throw new Error("OutputPortDescriptor has multiple allowed types, which is not currently supported.");
            }
            var outputType = output.allowedDataTypes[0];
            return input.allowedDataTypes.some(function (d) { return d.acceptsConnectionFrom(outputType); });
        }
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="Resource.ts" />
/// <reference path="ModuleParameterDescriptor.ts" />
/// <reference path="ModulePortDescriptor.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var Module = (function (_super) {
            __extends(Module, _super);
            function Module(id, category, portDescriptors, parameterDescriptors, created, familyId, serviceVersion) {
                if (parameterDescriptors === void 0) { parameterDescriptors = []; }
                _super.call(this, id, created, familyId, serviceVersion);
                this.portDescriptors = portDescriptors;
                Object.freeze(portDescriptors);
                this.parameterDescriptors = parameterDescriptors;
                Object.freeze(parameterDescriptors);
                this.category = category;
                this.isLatestClientVersion = true;
            }
            return Module;
        })(Model.Resource);
        Model.Module = Module;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Model/DatasetNode.ts" />
/// <reference path="../Model/ModuleNode.ts" />
/// <reference path="../Model/Experiment.ts" />
/// <reference path="../Global.refs.ts" />
/// <referebce path="DataContractInterfacesCommon.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        var v2;
        (function (v2) {
            var Model = DataLab.Model;
            /**
              * Takes an experiment and creates a serializable version of it including its graph.
              * @param {Model.Experiment} experiment the experiment to turn into a serializable experiment
              * @return {ISerializableGraph} the serializable experiment
             **/
            function SerializedExperiment(experiment) {
                if (!DataLab.Util.isObjectEmpty(experiment.parameters)) {
                    throw new Error("v2 experiments do not yet support experiment-level parameters");
                }
                return {
                    SchemaVersion: 2.0,
                    ExperimentId: experiment.experimentId(),
                    ParentExperimentId: experiment.parentExperimentId,
                    Graph: SerializedGraph(experiment.nodes),
                    Etag: null
                };
            }
            v2.SerializedExperiment = SerializedExperiment;
            /**
              * Takes a node map and creates a serializable graph of those nodes.
              * @param {Model.IExperimentNodeMap} nodes the collection of nodes to turn into a serializable subgraph
              * @return {ISerializableGraph} the serializable subgraph
             **/
            function SerializedGraph(nodes) {
                var serializedNodes = [];
                nodes.forEach(function (node) {
                    if (node instanceof Model.ModuleNode) {
                        serializedNodes.push(SerializedModuleNode(node));
                    }
                    else if (node instanceof Model.DatasetNode) {
                        serializedNodes.push(SerializedDatasetNode(node));
                    }
                    else if (node instanceof Model.TrainedModelNode) {
                        serializedNodes.push(SerializedTrainedModelNode(node));
                    }
                    else if (node instanceof Model.TransformNode) {
                        serializedNodes.push(SerializedTransformNode(node));
                    }
                });
                return { Nodes: serializedNodes };
            }
            v2.SerializedGraph = SerializedGraph;
            function SerializedSubgraph(nodes) {
                var serializedNodes = SerializedGraph(nodes).Nodes;
                // Create a map for O(1) lookup to see if nodes are in the subgraph
                var serializedNodesMap = Object.create(null);
                var serializedSubgraphParameters = Object.create(null);
                serializedNodes.forEach(function (node) {
                    serializedNodesMap[node.Id] = node;
                });
                var egressConnections = [];
                var minX = Infinity;
                var minY = Infinity;
                var maxX = -Infinity;
                var maxY = -Infinity;
                // Get the information we need to serialize the modules
                nodes.forEach(function (graphNode) {
                    minX = Math.min(minX, graphNode.x());
                    minY = Math.min(minY, graphNode.y());
                    maxX = Math.max(maxX, graphNode.x() + graphNode.width());
                    maxY = Math.max(maxY, graphNode.y() + graphNode.height());
                });
                // Make each node's x and y be an offset of the graph's x and y
                serializedNodes.forEach(function (nodeContract) {
                    nodeContract.X -= minX;
                    nodeContract.Y -= minY;
                });
                // Get egress connections
                nodes.forEach(function (node) {
                    DataLab.Util.forEach(node.outputPorts, function (outputPort) {
                        DataLab.Util.forEach(outputPort.connectedPorts(), function (inputPort) {
                            // If the connected node isn't in the map, then we have an egress connection
                            if (!(inputPort.parent.id in serializedNodesMap)) {
                                egressConnections.push(SerializedConnection(inputPort, outputPort));
                            }
                        });
                    });
                });
                return {
                    Nodes: serializedNodes,
                    X: minX,
                    Y: minY,
                    Width: maxX - minX,
                    Height: maxY - minY,
                    SubgraphParameters: serializedSubgraphParameters,
                    EgressConnections: egressConnections
                };
            }
            v2.SerializedSubgraph = SerializedSubgraph;
            function SerializedConnection(input, output) {
                return {
                    InputNodeId: input.parent.id,
                    InputPortName: input.name,
                    OutputNodeId: output.parent.id,
                    OutputPortName: output.name
                };
            }
            v2.SerializedConnection = SerializedConnection;
            function SerializedInputPort(name, parentId) {
                return {
                    IsInput: true,
                    PortName: name,
                    ParentNodeId: parentId,
                    Connection: null
                };
            }
            function SerializedOutputPort(name, parentId) {
                return {
                    IsInput: false,
                    PortName: name,
                    ParentNodeId: parentId,
                };
            }
            function SerializedGraphNode(node) {
                var graphNode = {
                    Id: node.id,
                    InputPorts: [],
                    OutputPorts: [],
                    NodeType: 5 /* None */,
                    Guid: "",
                    X: node.x(),
                    Y: node.y(),
                    Comment: node.comment(),
                    CommentCollapsed: node.commentCollapsed()
                };
                DataLab.Util.forEach(node.inputPorts, function (port) {
                    var portSpec = SerializedInputPort(port.name, graphNode.Id);
                    // This should trip zero or one times because input ports can only have one connection
                    DataLab.Util.forEach(port.connectedPorts(), function (otherPort) {
                        portSpec.Connection = SerializedConnection(port, otherPort);
                    });
                    graphNode.InputPorts.push(portSpec);
                });
                return graphNode;
            }
            function SerializedDatasetNode(node) {
                var graphNode = SerializedGraphNode(node);
                graphNode.NodeType = 1 /* Dataset */;
                graphNode.Guid = node.dataset.id;
                return graphNode;
            }
            v2.SerializedDatasetNode = SerializedDatasetNode;
            function SerializedTrainedModelNode(node) {
                var graphNode = SerializedGraphNode(node);
                graphNode.NodeType = 2 /* TrainedModel */;
                graphNode.Guid = node.trainedModel.id;
                return graphNode;
            }
            v2.SerializedTrainedModelNode = SerializedTrainedModelNode;
            function SerializedTransformNode(node) {
                var graphNode = SerializedGraphNode(node);
                graphNode.NodeType = 4 /* Transform */;
                graphNode.Guid = node.transform.id;
                return graphNode;
            }
            v2.SerializedTransformNode = SerializedTransformNode;
            function SerializedModuleNode(node) {
                var serializableGraphNode = SerializedGraphNode(node);
                serializableGraphNode.NodeType = 0 /* Module */;
                serializableGraphNode.Guid = node.module_.id;
                serializableGraphNode.Parameters = Object.create(null);
                serializeModuleParameters(node.parameters, serializableGraphNode.Parameters);
                return serializableGraphNode;
            }
            v2.SerializedModuleNode = SerializedModuleNode;
            /**
              * Traverses through all module parameters and pushes serialized values of all parameters into serialized structure.
              * @param {Model.IModuleNodeParameterMap} parameters the collection of parameters to serialize
              * @param {IModuleNodeParameterMap} serializedModuleParameters the structure to store serialized parameter values
             **/
            function serializeModuleParameters(parameters, serializedModuleParameters) {
                DataLab.Util.forEach(parameters, function (parameter) {
                    // This map should not be created via Object.create() since there is an IE issue with running JSON.stringify on such objects where all properties have numerical names
                    var modeValueInfo = {};
                    if (parameter.descriptor instanceof Model.ModeModuleParameterDescriptor) {
                        DataLab.Util.forEach(parameter.childParameters, function (childParameters, optionValue) {
                            var children = Object.create(null);
                            serializeModuleParameters(childParameters, children);
                            modeValueInfo[optionValue] = children;
                        });
                    }
                    if (parameter.isLinked()) {
                        serializedModuleParameters[parameter.name] = {
                            Name: parameter.name,
                            Value: parameter.linkedWebServiceParameter().name,
                            ValueType: DataContract.ModuleParameterValueType.GraphParameterName,
                            // Parameter value is stored in case the experiment-level parameter is not available when the module is pasted.
                            LinkedValue: parameter.value(),
                            ChildParameters: Object.keys(modeValueInfo).length > 0 ? modeValueInfo : undefined
                        };
                    }
                    else {
                        serializedModuleParameters[parameter.name] = {
                            Name: parameter.name,
                            Value: parameter.value(),
                            ValueType: DataContract.ModuleParameterValueType.Literal,
                            ChildParameters: Object.keys(modeValueInfo).length > 0 ? modeValueInfo : undefined
                        };
                    }
                });
            }
        })(v2 = DataContract.v2 || (DataContract.v2 = {}));
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="DataType.ts" />
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var DataTypeRegistry = (function () {
            function DataTypeRegistry(dataTypes) {
                var _this = this;
                this.dataTypes = Object.create(null);
                dataTypes.forEach(function (d) {
                    if (d.dataTypeId in _this.dataTypes) {
                        throw new Error(DataLab.Util.format(DataLab.LocalizedResources.duplicateType, d.dataTypeId));
                    }
                    _this.dataTypes[d.dataTypeId] = d;
                });
                Object.freeze(this.dataTypes);
            }
            /** Returns an array of the data types that have the given file extension.
                A leading dot is removed (if present), so "csv" is considered equivalent to ".csv".
                If the given extension is empty or is only a dot, an exception is thrown. */
            DataTypeRegistry.prototype.findDataTypesForFileExtension = function (extension) {
                extension = removeLeadingDot(extension);
                if (!extension) {
                    throw new Error(DataLab.LocalizedResources.nonEmptyExtension);
                }
                return DataLab.Util.filter(this.dataTypes, function (dataType) {
                    if (!dataType.fileExtension) {
                        return false;
                    }
                    // Normalize extension for case 
                    return extension.toLowerCase() === removeLeadingDot(dataType.fileExtension.toLowerCase());
                });
            };
            /** Returns an array of the data types for the given filename's extension.
                If the given filename does not have an extension, an empty array is returned. */
            DataTypeRegistry.prototype.findDataTypesForFileName = function (fileName) {
                var extension = getFileExtension(fileName);
                if (!extension) {
                    return [];
                }
                else {
                    return this.findDataTypesForFileExtension(extension);
                }
            };
            DataTypeRegistry.prototype.getDataTypeWithId = function (id) {
                var d = this.dataTypes[id];
                if (!d) {
                    throw DataLab.Util.format(DataLab.LocalizedResources.noSuchDataType, id);
                }
                return d;
            };
            DataTypeRegistry.prototype.tryGetDataTypeWithId = function (id) {
                var d = this.dataTypes[id];
                return (d === undefined) ? null : d;
            };
            return DataTypeRegistry;
        })();
        Model.DataTypeRegistry = DataTypeRegistry;
        /** Returns a filename's extension (without a dot).
            foo.txt -> txt
            foo.tar.gz -> gz */
        function getFileExtension(fileName) {
            var match = fileName.match(/\.(\w+)$/);
            if (!match) {
                return null;
            }
            else {
                // First capture group (the extension without a leading dot)
                return match[1];
            }
        }
        function removeLeadingDot(s) {
            return (s.charAt(0) === ".") ? s.substr(1) : s;
        }
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Contracts/Common/Experiment.ts" />
/// <reference path="Experiment.ts" />
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        (function (CommunityExperimentVisibility) {
            CommunityExperimentVisibility[CommunityExperimentVisibility["Private"] = 0] = "Private";
            CommunityExperimentVisibility[CommunityExperimentVisibility["Public"] = 1] = "Public";
        })(Model.CommunityExperimentVisibility || (Model.CommunityExperimentVisibility = {}));
        var CommunityExperimentVisibility = Model.CommunityExperimentVisibility;
        var PublishableExperiment = (function () {
            function PublishableExperiment(sourceExperiment, experimentName, summary, description, visibility, tags, thumbnail, imageUrl) {
                this.sourceExperiment = sourceExperiment;
                this.experimentName = experimentName;
                this.summary = summary;
                this.description = description;
                this.visibility = visibility;
                this.tags = tags;
                this.thumbnail = thumbnail;
                this.imageUrl = imageUrl;
            }
            return PublishableExperiment;
        })();
        Model.PublishableExperiment = PublishableExperiment;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="../Model/_refs.ts" />
/// <reference path="DataContractInterfaces-v1.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        var v1;
        (function (v1) {
            function serializeClientData(nodes) {
                // We should keep the legacy layout format until we have the web Aether client that can submit experiment.
                // We will ignore the <NodePositions2>...</NodePositions2> for web client.
                var layoutData = "<?xml version='1.0' encoding='utf-16'?>" + "<DataV1 xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>" + "<Meta />" + "<NodePositions>";
                DataLab.Util.forEach(nodes, function (node) {
                    // TODO: TFS#1057482 Due to the DataContract format that special treats the Dataset (not as a graph node), the Dataset in
                    // legacy world does not have a notion of graph NodeId (as far as the DataContract is concerned). Also the legacy world
                    // has a contraint to dissalow more than one dataset of the same GUID to be added into the surface, and hence it uses GUID
                    // as the key of the layout data. Hence, to support the legacy world (service and client), the layout NodeId for Dataset needs 
                    // to use the GUID, and NodeId for the Module.
                    var id = "";
                    if (node instanceof DataLab.Model.ModuleNode) {
                        id = node.id;
                    }
                    else if (node instanceof DataLab.Model.DatasetNode) {
                        id = node.dataset.id;
                    }
                    else if (node instanceof DataLab.Model.TrainedModelNode) {
                        id = node.trainedModel.id;
                    }
                    else if (node instanceof DataLab.Model.TransformNode) {
                        id = node.transform.id;
                    }
                    else if (node instanceof DataLab.Model.WebServicePortNode) {
                        id = node.id;
                    }
                    else {
                        throw "Unknown GraphNode subtype";
                    }
                    layoutData += "<NodePosition Node='" + id + "' Position='" + node.x() + "," + node.y() + ",200,200'/>";
                });
                layoutData += "</NodePositions>";
                layoutData += "<NodeGroups />";
                layoutData += "</DataV1>";
                return layoutData;
            }
            v1.serializeClientData = serializeClientData;
            function serialize(experiment, schemaVersion) {
                if (schemaVersion === undefined) {
                    schemaVersion = 1;
                }
                var experimentNodes = DataLab.Util.filter(DataLab.Util.values(experiment.nodes()), function (node) { return !(node instanceof DataLab.Model.WebServicePortNode); });
                var serializedModuleNodes = [];
                var serializedEdges = [];
                DataLab.Util.forEach(experimentNodes, function (node) {
                    if (!(node instanceof DataLab.Model.ModuleNode)) {
                        // Dataset nodes are encoded in the serialized input ports for modules.
                        return;
                    }
                    var moduleNode = node;
                    var serializedModuleNode = {
                        Id: moduleNode.id,
                        ModuleId: moduleNode.module_.id,
                        ModuleParameters: [],
                        InputPortsInternal: [],
                        OutputPortsInternal: []
                    };
                    DataLab.Util.forEach(moduleNode.outputPorts, function (outputPort) {
                        DataLab.Util.forEach(outputPort.connectedNonWebServicePorts(), function (inputPort) {
                            var edge = {
                                // In order to cause pain, this is the only way to correlate edges with ports in the graph contract.
                                DestinationInputPortId: (inputPort.parent.id + ":" + inputPort.name),
                                SourceOutputPortId: (outputPort.parent.id + ":" + outputPort.name)
                            };
                            serializedEdges.push(edge);
                        });
                    });
                    serializedModuleNode.InputPortsInternal = DataLab.Util.map(moduleNode.inputPorts, function (inputPort) {
                        var dataGuid = null;
                        var trainedModelGuid = null;
                        var transformModuleGuid = null;
                        if (inputPort.isConnected()) {
                            var connectedNode = inputPort.connectedOutputPort.parent;
                            if (connectedNode instanceof DataLab.Model.DatasetNode) {
                                dataGuid = connectedNode.dataset.id;
                            }
                            if (connectedNode instanceof DataLab.Model.TrainedModelNode) {
                                trainedModelGuid = connectedNode.trainedModel.id;
                            }
                            if (connectedNode instanceof DataLab.Model.TransformNode) {
                                transformModuleGuid = connectedNode.transform.id;
                            }
                        }
                        return {
                            DataSourceId: dataGuid,
                            TrainedModelId: trainedModelGuid,
                            TransformModuleId: transformModuleGuid,
                            Name: inputPort.name,
                            NodeId: inputPort.parent.id,
                        };
                    });
                    serializedModuleNode.OutputPortsInternal = DataLab.Util.map(moduleNode.outputPorts, function (outputPort) {
                        var outputType = null;
                        // If the port is train model or transform output and user specify it as web service ouput
                        // set the output type to TrainedModel or Transform
                        if (outputPort.connectedWebServicePorts().length > 0) {
                            for (var id in outputPort.descriptor.allowedDataTypes) {
                                if (outputPort.descriptor.allowedDataTypes[id].dataTypeId === "ILearnerDotNet") {
                                    outputType = "TrainedModel";
                                    break;
                                }
                                else if (outputPort.descriptor.allowedDataTypes[id].dataTypeId === "ITransformDotNet") {
                                    outputType = "Transform";
                                    break;
                                }
                            }
                        }
                        return {
                            Name: outputPort.name,
                            NodeId: outputPort.parent.id,
                            OutputType: outputType
                        };
                    });
                    // Serialize only the module parameters (i.e. not the completion time, endpoints, etc.)
                    serializeModuleParameters(moduleNode.parameters, serializedModuleNode.ModuleParameters);
                    serializedModuleNode.Comment = moduleNode.comment() ? moduleNode.comment() : "";
                    serializedModuleNode.CommentCollapsed = moduleNode.commentCollapsed();
                    serializedModuleNodes.push(serializedModuleNode);
                });
                var graph = {
                    EdgesInternal: serializedEdges,
                    ModuleNodes: serializedModuleNodes,
                    SerializedClientData: serializeClientData(experimentNodes)
                };
                return graph;
            }
            v1.serialize = serialize;
            function serializeWebServiceInfo(experiment, schemaVersion) {
                if (schemaVersion === undefined) {
                    schemaVersion = 1;
                }
                var inputs = DataLab.Util.map(experiment.getPublishInputPorts(), serializeWebServicePort);
                var outputs = DataLab.Util.map(experiment.getPublishOutputPorts(), serializeWebServicePort);
                var webServiceNodes = DataLab.Util.filter(DataLab.Util.values(experiment.nodes()), function (node) { return node instanceof DataLab.Model.WebServicePortNode; });
                return {
                    IsWebServiceExperiment: experiment.isWebServiceExperiment(),
                    Inputs: inputs,
                    Outputs: outputs,
                    Parameters: serializeWebServiceParameters(experiment.parameters()),
                    WebServiceGroupId: experiment.publishedWebServiceGroupId,
                    ModelPackageId: experiment.publishedModelPackageId,
                    SerializedClientData: serializeClientData(webServiceNodes)
                };
            }
            v1.serializeWebServiceInfo = serializeWebServiceInfo;
            function extractCredentials(experiment, schemaVersion) {
                var extractedCredentials = [];
                var extractCredentialsFromParameterMap = function (parameterMap) {
                    DataLab.Util.forEach(parameterMap, function (moduleNodeParameter) {
                        if (moduleNodeParameter instanceof DataLab.Model.CredentialParameter) {
                            var credentialParameter = moduleNodeParameter;
                            if (credentialParameter.isDirty) {
                                var parts = [];
                                DataLab.Util.forEach(credentialParameter.credentialKeyParts, function (p) {
                                    parts.push({
                                        Name: p.name,
                                        Value: p.value()
                                    });
                                });
                                var credentialToAdd = {
                                    SecretName: credentialParameter.name,
                                    SecretValue: credentialParameter.value(),
                                    KeyParts: {
                                        Type: credentialParameter.credentialType,
                                        Parts: parts
                                    },
                                };
                                extractedCredentials.push(credentialToAdd);
                            }
                        }
                        if (moduleNodeParameter.descriptor instanceof DataLab.Model.ModeModuleParameterDescriptor) {
                            DataLab.Util.forEach(moduleNodeParameter.childParameters, function (subparameterMap) {
                                extractCredentialsFromParameterMap(subparameterMap);
                            });
                        }
                    });
                };
                experiment.nodes.forEach(function (node) {
                    if (node instanceof DataLab.Model.ModuleNode) {
                        var moduleNode = node;
                        extractCredentialsFromParameterMap(moduleNode.parameters);
                    }
                });
                return extractedCredentials;
            }
            v1.extractCredentials = extractCredentials;
            function serializePublishInfo(publishInfo) {
                var inputPortsForPublishNames = [];
                var outputPortsForPublishNames = [];
                publishInfo.InputPortsForPublish.forEach(function (inputPort) {
                    inputPortsForPublishNames.push(inputPort.parent.id + ":" + inputPort.name);
                });
                publishInfo.OutputPortsForPublish.forEach(function (outputPort) {
                    outputPortsForPublishNames.push(outputPort.parent.id + ":" + outputPort.name);
                });
                var experimentPublishInfo = {
                    InputPortsForPublish: inputPortsForPublishNames,
                    OutputPortsForPublish: outputPortsForPublishNames,
                };
                return experimentPublishInfo;
            }
            function serializeWebServiceParameters(parameters) {
                return DataLab.Util.map(parameters, function (parameter) {
                    var paramType;
                    var scriptName;
                    // This should be symmetric with deserializeModuleParameterDescriptor in Common\Module.ts
                    if (parameter.descriptor instanceof DataLab.Model.ScriptModuleParameterDescriptor) {
                        paramType = DataContract.ModuleParameterType.Script;
                        scriptName = parameter.descriptor.scriptName;
                    }
                    else if (parameter.descriptor instanceof DataLab.Model.BooleanModuleParameterDescriptor) {
                        paramType = DataContract.ModuleParameterType.Boolean;
                    }
                    else if (parameter.descriptor instanceof DataLab.Model.ChoiceModuleParameterDescriptor) {
                        paramType = DataContract.ModuleParameterType.Enumerated;
                    }
                    else if (parameter.descriptor instanceof DataLab.Model.CredentialModuleParameterDescriptor) {
                        paramType = DataContract.ModuleParameterType.Credential;
                    }
                    else {
                        // TODO [1227695]: Experiment-level parameter serialization should preserve int / float / etc. typing.
                        paramType = parameter.descriptor.type;
                    }
                    return {
                        Name: parameter.name,
                        Value: parameter.value(),
                        ParameterDefinition: {
                            // Redundant with Name above
                            Name: parameter.name,
                            FriendlyName: parameter.name,
                            // Redundant with Value above
                            DefaultValue: (paramType == DataContract.ModuleParameterType.Credential) ? "" : parameter.value(),
                            ParameterType: paramType,
                            HasDefaultValue: true,
                            IsOptional: parameter.descriptor.isOptional,
                            ParameterRules: parameter.descriptor.rules,
                            HasRules: parameter.descriptor.rules.length > 0,
                            MarkupType: 0,
                            CredentialDescriptor: null,
                            ScriptName: scriptName
                        },
                    };
                });
            }
            /**
              * Traverses through all module parameters and pushes serialized parameter value information into supplied array.
              * @param {Model.IModuleNodeParameterMap} parameters the collection of parameters to serialize
              * @param {IModuleNodeParameter[]} serializedModuleParameters the array to store serialized parameter values
             **/
            function serializeModuleParameters(parameters, serializedModuleParameters) {
                DataLab.Util.forEach(parameters, function (parameter) {
                    // Include this parameter if it is relevant, or if we want all parameters (regardless of relevancy).
                    if (parameter.isRelevant()) {
                        serializedModuleParameters.push({
                            Name: parameter.name,
                            Value: parameter.value(),
                            ValueType: DataContract.ModuleParameterValueType.Literal,
                            LinkedGlobalParameter: parameter.isLinked() ? parameter.linkedWebServiceParameter().name : null
                        });
                        if (parameter.descriptor instanceof DataLab.Model.ModeModuleParameterDescriptor) {
                            DataLab.Util.forEach(parameter.childParameters, function (value, key) {
                                if (parameter.value() === key) {
                                    serializeModuleParameters(value, serializedModuleParameters);
                                }
                            });
                        }
                    }
                });
            }
            function serializeWebServicePort(port) {
                var id, portId, name;
                portId = [port.parent.id, port.name].join(":");
                var connectedPorts = port.connectedWebServicePorts();
                if (connectedPorts && connectedPorts.length > 0) {
                    id = connectedPorts[0].parent.id;
                    name = connectedPorts[0].parent.nameParameter.value();
                }
                return {
                    Id: id,
                    PortId: portId,
                    Name: name
                };
            }
        })(v1 = DataContract.v1 || (DataContract.v1 = {}));
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

// Feature On-Off (FOOF)
var DataLab;
(function (DataLab) {
    var Features;
    (function (Features) {
        var integrationPoints = {
            ConfigureYourOwnHdInsight: {
                Enabled: true,
                Experience: ""
            },
            Dataflows: {
                Enabled: true,
                Experience: ""
            },
            ModulesList: {
                Enabled: true,
                Experience: ""
            },
            AuthorizeDownloadILearner: {
                Enabled: true,
                Experience: ""
            },
            AuthorizeDownloadITransform: {
                Enabled: true,
                Experience: ""
            },
            SSIMSearch: {
                Enabled: true,
                Experience: ""
            },
            ColumnPickerRulesRedesign: {
                Enabled: true,
                Experience: ""
            },
            SemanticHelpSearch: {
                Enabled: true,
                Experience: ""
            },
            AllowAnonymousTest: {
                Enabled: true,
                Experience: ""
            },
            ExperimentalExperimentList: {
                Enabled: true,
                Experience: ""
            },
            EnableFrictionFreeUserExperience: {
                Enabled: true,
                Experience: ""
            },
            EnableSchemaPropagation: {
                Enabled: true,
                Experience: ""
            },
            EnableNewExperimentFlow: {
                Enabled: true,
                Experience: ""
            },
            EnableGalleryInPlusNewInterim: {
                Enabled: true,
                Experience: ""
            },
            EnablePackingService: {
                Enabled: true,
                Experience: ""
            },
            IPythonNotebook: {
                Enabled: true,
                Experience: ""
            },
            AnonymousWorkspace: {
                Enabled: true,
                Experience: ""
            },
            TrialLimitations: {
                Enabled: true,
                Experience: ""
            },
            EnableWorkspaceQuotas: {
                Enabled: true,
                Experience: ""
            },
            StorageUsageWidget: {
                Enabled: true,
                Experience: ""
            },
            ExperimentDescription: {
                Enabled: true,
                Experience: ""
            },
            EnableOutputPortApiCode: {
                Enabled: true,
                Experience: ""
            },
            EnablePayboardTelemetry: {
                Enabled: true,
                Experience: ""
            },
            EnableNewCustomModuleUpload: {
                Enabled: true,
                Experience: ""
            },
            EnableAssetDeletion: {
                Enabled: true,
                Experience: ""
            },
            AssetDeletionUi: {
                Enabled: true,
                Experience: ""
            },
            EnableGuidedTour: {
                Enabled: true,
                Experience: ""
            },
            EnableGuidedExperiment: {
                Enabled: true,
                Experience: ""
            },
            TrainedModelDeletionUi: {
                Enabled: true,
                Experience: ""
            },
            EnableCommunityUXInStudio: {
                Enabled: true,
                Experience: ""
            },
            ChatSupport: {
                Enabled: true,
                Experience: ""
            },
            ExcelDownloadEnabled: {
                Enabled: true,
                Experience: ""
            },
            ShowSubscriptionInfo: {
                Enabled: false,
                Experience: ""
            },
            CopyExperimentAcrossWorkspace: {
                Enabled: true,
                Experience: ""
            },
            DatasetUploadInTrial: {
                Enabled: true,
                Experience: ""
            },
            ModuleUploadInTrial: {
                Enabled: true,
                Experience: ""
            },
            TreeVisualization: {
                Enabled: false,
                Experience: ""
            },
            PublishWebServiceInTrial: {
                Enabled: true,
                Experience: ""
            },
            ExperimentListCategories: {
                Enabled: true,
                Experience: ""
            },
            EnableChunkedUploadInStudio: {
                Enabled: true,
                Experience: ""
            },
            MarkdownInPublishDialog: {
                Enabled: true,
                Experience: ""
            },
            MarkdownInExperimentDescription: {
                Enabled: true,
                Experience: ""
            },
            CompetitionExperimentSupport: {
                Enabled: true,
                Experience: ""
            }
        };
        function setIntegrationPoints(newIntegrationPoints) {
            integrationPoints = newIntegrationPoints;
        }
        Features.setIntegrationPoints = setIntegrationPoints;
        /**
          * ConfigureYourOwnHdInsight is a feature which only depends on the Enabled boolean value.
          * Other features may offer different experiences based on integrationPoints.FeatureName.Experience.
          */
        function configureYourOwnHdInsightEnabled() {
            return integrationPoints.ConfigureYourOwnHdInsight.Enabled;
        }
        Features.configureYourOwnHdInsightEnabled = configureYourOwnHdInsightEnabled;
        function dataflowsEnabled() {
            return integrationPoints.Dataflows.Enabled;
        }
        Features.dataflowsEnabled = dataflowsEnabled;
        function packingServiceEnabled() {
            return integrationPoints.EnablePackingService.Enabled;
        }
        Features.packingServiceEnabled = packingServiceEnabled;
        function modulesListEnabled() {
            return integrationPoints.ModulesList.Enabled;
        }
        Features.modulesListEnabled = modulesListEnabled;
        function authorizeDownloadILearnerEnabled() {
            return integrationPoints.AuthorizeDownloadILearner.Enabled;
        }
        Features.authorizeDownloadILearnerEnabled = authorizeDownloadILearnerEnabled;
        function authorizeDownloadITransformEnabled() {
            return integrationPoints.AuthorizeDownloadITransform.Enabled;
        }
        Features.authorizeDownloadITransformEnabled = authorizeDownloadITransformEnabled;
        function ssimSearchEnabled() {
            return integrationPoints.SSIMSearch.Enabled;
        }
        Features.ssimSearchEnabled = ssimSearchEnabled;
        function columnPickerRulesRedesignEnabled() {
            return integrationPoints.ColumnPickerRulesRedesign.Enabled;
        }
        Features.columnPickerRulesRedesignEnabled = columnPickerRulesRedesignEnabled;
        function semanticHelpSearch() {
            return integrationPoints.SemanticHelpSearch.Enabled;
        }
        Features.semanticHelpSearch = semanticHelpSearch;
        function allowAnonymousTest() {
            return integrationPoints.AllowAnonymousTest.Enabled;
        }
        Features.allowAnonymousTest = allowAnonymousTest;
        function experimentalExperimentListEnabled() {
            return integrationPoints.ExperimentalExperimentList.Enabled;
        }
        Features.experimentalExperimentListEnabled = experimentalExperimentListEnabled;
        function enableFrictionFreeUserExperienceEnabled() {
            return integrationPoints.EnableFrictionFreeUserExperience.Enabled;
        }
        Features.enableFrictionFreeUserExperienceEnabled = enableFrictionFreeUserExperienceEnabled;
        function schemaPropagationEnabled() {
            return integrationPoints.EnableSchemaPropagation.Enabled;
        }
        Features.schemaPropagationEnabled = schemaPropagationEnabled;
        function newExperimentFlowEnabled() {
            return integrationPoints.EnableNewExperimentFlow.Enabled;
        }
        Features.newExperimentFlowEnabled = newExperimentFlowEnabled;
        function galleryInPlusNewInterimEnabled() {
            return integrationPoints.EnableGalleryInPlusNewInterim.Enabled && integrationPoints.EnableCommunityUXInStudio.Enabled && integrationPoints.EnablePackingService.Enabled;
        }
        Features.galleryInPlusNewInterimEnabled = galleryInPlusNewInterimEnabled;
        function anonymousWorkspaceEnabled() {
            return integrationPoints.AnonymousWorkspace.Enabled;
        }
        Features.anonymousWorkspaceEnabled = anonymousWorkspaceEnabled;
        function trialLimitationsEnabled() {
            return integrationPoints.TrialLimitations.Enabled;
        }
        Features.trialLimitationsEnabled = trialLimitationsEnabled;
        function enableWorkspaceQuotasEnabled() {
            return integrationPoints.EnableWorkspaceQuotas.Enabled;
        }
        Features.enableWorkspaceQuotasEnabled = enableWorkspaceQuotasEnabled;
        function iPythonNotebookEnabled() {
            return integrationPoints.IPythonNotebook.Enabled;
        }
        Features.iPythonNotebookEnabled = iPythonNotebookEnabled;
        function experimentDescriptionEnabled() {
            return integrationPoints.ExperimentDescription.Enabled;
        }
        Features.experimentDescriptionEnabled = experimentDescriptionEnabled;
        function storageUsageWidgetEnabled() {
            return integrationPoints.StorageUsageWidget.Enabled;
        }
        Features.storageUsageWidgetEnabled = storageUsageWidgetEnabled;
        function enableOutputPortApiCodeEnabled() {
            return integrationPoints.EnableOutputPortApiCode.Enabled;
        }
        Features.enableOutputPortApiCodeEnabled = enableOutputPortApiCodeEnabled;
        function payboardTelemetryEnabled() {
            return integrationPoints.EnablePayboardTelemetry.Enabled;
        }
        Features.payboardTelemetryEnabled = payboardTelemetryEnabled;
        function enableOutputPortApiCodeExperience() {
            return integrationPoints.EnableOutputPortApiCode.Experience;
        }
        Features.enableOutputPortApiCodeExperience = enableOutputPortApiCodeExperience;
        function newCustomModuleUploadEnabled() {
            return integrationPoints.EnableNewCustomModuleUpload.Enabled;
        }
        Features.newCustomModuleUploadEnabled = newCustomModuleUploadEnabled;
        function enableAssetDeletionEnabled() {
            return integrationPoints.EnableAssetDeletion.Enabled;
        }
        Features.enableAssetDeletionEnabled = enableAssetDeletionEnabled;
        function assetDeletionUiEnabled() {
            return integrationPoints.AssetDeletionUi.Enabled;
        }
        Features.assetDeletionUiEnabled = assetDeletionUiEnabled;
        function guidedTourEnabled() {
            return integrationPoints.EnableGuidedTour.Enabled;
        }
        Features.guidedTourEnabled = guidedTourEnabled;
        function guidedExperimentEnabled() {
            return integrationPoints.EnableGuidedExperiment.Enabled;
        }
        Features.guidedExperimentEnabled = guidedExperimentEnabled;
        function trainedModelDeletionUiEnabled() {
            return integrationPoints.TrainedModelDeletionUi.Enabled;
        }
        Features.trainedModelDeletionUiEnabled = trainedModelDeletionUiEnabled;
        function excelDownloadEnabled() {
            return integrationPoints.ExcelDownloadEnabled.Enabled;
        }
        Features.excelDownloadEnabled = excelDownloadEnabled;
        function communityUXInStudioEnabled() {
            return integrationPoints.EnableCommunityUXInStudio.Enabled;
        }
        Features.communityUXInStudioEnabled = communityUXInStudioEnabled;
        function chatSupportEnabled() {
            return integrationPoints.ChatSupport.Enabled;
        }
        Features.chatSupportEnabled = chatSupportEnabled;
        function showSubscriptionInfoEnabled() {
            return integrationPoints.ShowSubscriptionInfo.Enabled;
        }
        Features.showSubscriptionInfoEnabled = showSubscriptionInfoEnabled;
        function copyExperimentAcrossWorkspaceEnabled() {
            return integrationPoints.CopyExperimentAcrossWorkspace.Enabled;
        }
        Features.copyExperimentAcrossWorkspaceEnabled = copyExperimentAcrossWorkspaceEnabled;
        function datasetUploadInTrialEnabled() {
            return integrationPoints.DatasetUploadInTrial.Enabled;
        }
        Features.datasetUploadInTrialEnabled = datasetUploadInTrialEnabled;
        function moduleUploadInTrialEnabled() {
            return integrationPoints.ModuleUploadInTrial.Enabled;
        }
        Features.moduleUploadInTrialEnabled = moduleUploadInTrialEnabled;
        function treeVisualizationEnabled() {
            return integrationPoints.TreeVisualization.Enabled;
        }
        Features.treeVisualizationEnabled = treeVisualizationEnabled;
        function publishWebServiceInTrialEnabled() {
            return integrationPoints.PublishWebServiceInTrial.Enabled;
        }
        Features.publishWebServiceInTrialEnabled = publishWebServiceInTrialEnabled;
        function experimentListCategoriesEnabled() {
            return integrationPoints.ExperimentListCategories.Enabled;
        }
        Features.experimentListCategoriesEnabled = experimentListCategoriesEnabled;
        function chunkedUploadInStudioEnabled() {
            return integrationPoints.EnableChunkedUploadInStudio.Enabled;
        }
        Features.chunkedUploadInStudioEnabled = chunkedUploadInStudioEnabled;
        function competitionExperimentSupportEnabled() {
            return integrationPoints.CompetitionExperimentSupport.Enabled;
        }
        Features.competitionExperimentSupportEnabled = competitionExperimentSupportEnabled;
        function markdownInPublishDialogEnabled() {
            return integrationPoints.MarkdownInPublishDialog.Enabled;
        }
        Features.markdownInPublishDialogEnabled = markdownInPublishDialogEnabled;
        function markdownInExperimentDescriptionEnabled() {
            return integrationPoints.MarkdownInExperimentDescription.Enabled;
        }
        Features.markdownInExperimentDescriptionEnabled = markdownInExperimentDescriptionEnabled;
    })(Features = DataLab.Features || (DataLab.Features = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="../Model/Workspace.ts" />
/// <reference path="../Model/CommunityExperiment.ts" />
/// <reference path="DataLabClient.ts" />
/// <reference path="DataContractInterfaces-v1.ts" />
/// <reference path="Serializer.ts" />
/// <reference path="../Features.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        (function (RegenerateTokenType) {
            RegenerateTokenType[RegenerateTokenType["None"] = 0] = "None";
            RegenerateTokenType[RegenerateTokenType["Primary"] = 1] = "Primary";
            RegenerateTokenType[RegenerateTokenType["Secondary"] = 2] = "Secondary";
        })(DataContract.RegenerateTokenType || (DataContract.RegenerateTokenType = {}));
        var RegenerateTokenType = DataContract.RegenerateTokenType;
        /**
         WorkspaceBackend adapts an IApplicationClient to provide the backing operations for a Workspace.
    
         @see {DataLab.Model.Workspace}
         @see {DataLab.Model.IWorkspaceBackend}
         @see {DataLab.DataContract.IApplicationClient}
         */
        var WorkspaceBackend = (function () {
            function WorkspaceBackend(client) {
                this.workspaceId = client.workspaceId;
                this.friendlyName = client.workspaceFriendlyName;
                this.client = client;
            }
            // TODO: Update this when API that accepts array of credentials become available [TASK: 1320037]
            WorkspaceBackend.prototype.saveCredentials = function (credentialsToSave) {
                var _this = this;
                var credentialSavePromises = [];
                DataLab.Util.forEach(credentialsToSave, function (credential) {
                    credentialSavePromises.push(_this.client.saveCredential(credential));
                });
                return $.when.apply($, credentialSavePromises);
            };
            WorkspaceBackend.prototype.publishExperimentAsync = function (experiment) {
                var _this = this;
                // SUO6 behaviour: TODO: [TASK: 1320037] Create notification display Util function
                var validationMessage = "";
                experiment.nodes.forEach(function (node) {
                    if (node instanceof DataLab.Model.ModuleNode) {
                        var moduleNode = node;
                        DataLab.Util.forEach(moduleNode.parameters, function (param) {
                            if (param instanceof DataLab.Model.CredentialParameter && !param.isLinked()) {
                                validationMessage += "Module: " + moduleNode.name + ", Parameter: " + param.name + "; ";
                            }
                        });
                    }
                });
                if (validationMessage) {
                    // TODO: [TASK: 1320037] Remove this
                    validationMessage = "Some of the credential parameters in experiment are not linked to experiment level parameters. This is a restriction that will be removed in the future. " + validationMessage;
                    var failNotification = new Shell.UI.Notifications.Notification(validationMessage, 'error');
                    failNotification.setActions([
                        new Shell.UI.Notifications.Buttons.close(function () {
                            Shell.UI.Notifications.remove(failNotification);
                        })
                    ]);
                    // Need to run with timeout so that notification is displayed after progress is closed, otherwise it will be minimized
                    setTimeout(function () { return Shell.UI.Notifications.add(failNotification); }, 500);
                    // return "CredentialValidationSUO6" so that the code in DataLab.js know that this is error
                    var x = $.Deferred();
                    return x.reject("CredentialValidationSUO6");
                }
                var credentialsToSave = DataContract.v1.extractCredentials(experiment);
                var request = {
                    Description: experiment.description(),
                    DataflowGraph: DataContract.v1.serialize(experiment),
                    ParentId: experiment.experimentId()
                };
                return DataLab.Util.then(this.saveCredentials(credentialsToSave), function () {
                    return DataLab.Util.then(_this.client.publishExperimentAsync(request), function (e) {
                        return e.DataflowId;
                    });
                });
            };
            WorkspaceBackend.prototype.listExperimentsAsync = function (filter) {
                return this.client.listExperimentsAsync(filter);
            };
            WorkspaceBackend.prototype.listWorkspacesAsync = function () {
                return this.client.listWorkspacesAsync();
            };
            WorkspaceBackend.prototype.createExperimentStoragePackageAsync = function (experimentId, clearCredentials, newExperimentName) {
                return this.client.createExperimentStoragePackageAsync(experimentId, clearCredentials, newExperimentName);
            };
            WorkspaceBackend.prototype.getExperimentStoragePackageAsync = function (storagePackageId) {
                return this.client.getExperimentStoragePackageAsync(storagePackageId);
            };
            WorkspaceBackend.prototype.createExperimentFromStoragePackageAsync = function (destinationWorkspaceId, packageUri) {
                return this.client.createExperimentFromStoragePackageAsync(destinationWorkspaceId, packageUri);
            };
            WorkspaceBackend.prototype.submitExperimentAsync = function (experiment) {
                var _this = this;
                var credentialsToSave = DataContract.v1.extractCredentials(experiment);
                var request = this.generateSubmissionRequest(experiment, false);
                return DataLab.Util.then(this.saveCredentials(credentialsToSave), function () {
                    // For service side drafts, update the existing draft to become a submitted draft.
                    // For local drafts or submitted experiments, submit a new experiment.
                    if (experiment.isDraft() && experiment.persistedOnService()) {
                        return DataLab.Util.then(_this.client.updateExperimentAsync(experiment.experimentId(), experiment.etag(), request), function (etag) {
                            return { ExperimentId: experiment.experimentId(), Etag: etag };
                        });
                    }
                    else {
                        return DataLab.Util.then(_this.client.submitExperimentAsync(request), function (result) {
                            return result;
                        });
                    }
                });
            };
            WorkspaceBackend.prototype.saveDraftAsync = function (experiment) {
                var _this = this;
                var credentialsToSave = DataContract.v1.extractCredentials(experiment);
                var request = this.generateSubmissionRequest(experiment, true);
                return DataLab.Util.then(this.saveCredentials(credentialsToSave), function () {
                    return DataLab.Util.then(_this.client.submitExperimentAsync(request), function (result) {
                        return result;
                    });
                });
            };
            WorkspaceBackend.prototype.updateExperimentAsync = function (experiment) {
                var _this = this;
                var credentialsToSave = DataContract.v1.extractCredentials(experiment);
                var request = this.generateSubmissionRequest(experiment, experiment.isDraft());
                return DataLab.Util.then(this.saveCredentials(credentialsToSave), function () {
                    return DataLab.Util.then(_this.client.updateExperimentAsync(experiment.experimentId(), experiment.etag(), request), function (etag) {
                        return { "ExperimentId": experiment.experimentId(), Etag: etag };
                    });
                });
            };
            WorkspaceBackend.prototype.deleteExperimentAsync = function (experimentId, eTag) {
                return this.client.deleteExperimentAsync(experimentId, eTag);
            };
            WorkspaceBackend.prototype.deleteExperimentAndAncestorsAsync = function (experimentId, eTag) {
                return this.client.deleteExperimentAndAncestorsAsync(experimentId, eTag);
            };
            WorkspaceBackend.prototype.cancelExperimentAsync = function (experimentId) {
                return this.client.cancelExperimentAsync(experimentId);
            };
            WorkspaceBackend.prototype.promoteOutputToDatasetAsync = function (outputPort, newDatasetName, familyId, description) {
                if (familyId === void 0) { familyId = null; }
                if (description === void 0) { description = ""; }
                var dataset = this.promotionHelper(outputPort, newDatasetName, familyId, description);
                var request = {
                    DataSource: dataset,
                    // We don't use the containing experiment's id, since e.g. it may be a draft cloned from a completed experiment.
                    // We instead need the id of the most recent ancestor experiment which actually executed this node (so the service can look up the endpoint).
                    ExperimentId: outputPort.parent.executedExperimentId,
                    ModuleNodeId: outputPort.parent.id,
                    OutputName: outputPort.name,
                };
                return this.client.promoteOutputToDatasetAsync(request);
            };
            WorkspaceBackend.prototype.promoteOutputToTrainedModelAsync = function (outputPort, newTrainedModelName, familyId, description) {
                if (familyId === void 0) { familyId = null; }
                if (description === void 0) { description = ""; }
                var trainedModel = this.promotionHelper(outputPort, newTrainedModelName, familyId, description);
                var request = {
                    TrainedModel: trainedModel,
                    ExperimentId: outputPort.parent.executedExperimentId,
                    ModuleNodeId: outputPort.parent.id,
                    OutputName: outputPort.name,
                };
                return this.client.promoteOutputToTrainedModelAsync(request);
            };
            WorkspaceBackend.prototype.promoteOutputToTransformModuleAsync = function (outputPort, newTransformName, familyId, description) {
                if (familyId === void 0) { familyId = null; }
                if (description === void 0) { description = ""; }
                var transform = this.promotionHelper(outputPort, newTransformName, familyId, description);
                var request = {
                    Transform: transform,
                    ExperimentId: outputPort.parent.executedExperimentId,
                    ModuleNodeId: outputPort.parent.id,
                    OutputName: outputPort.name,
                };
                return this.client.promoteOutputToTransformModuleAsync(request);
            };
            WorkspaceBackend.prototype.promotionHelper = function (outputPort, newDataResourceName, familyId, description) {
                if (familyId === void 0) { familyId = null; }
                if (description === void 0) { description = ""; }
                if (outputPort.descriptor.allowedDataTypes.length !== 1) {
                    throw new Error("Can't promote output from a multi-typed output port.");
                }
                if (!(outputPort.parent instanceof DataLab.Model.ModuleNode)) {
                    throw new Error("Only the output ports of a module node can be promoted.");
                }
                return {
                    Name: newDataResourceName,
                    DataTypeId: outputPort.descriptor.allowedDataTypes[0].dataTypeId,
                    Description: description,
                    FamilyId: familyId,
                };
            };
            WorkspaceBackend.prototype.uploadDatasetAsync = function (contents, newDatasetName, dataType, filename, description, familyId) {
                var _this = this;
                if (description === void 0) { description = ""; }
                if (familyId === void 0) { familyId = null; }
                var dataset = {
                    Name: newDatasetName,
                    DataTypeId: dataType.dataTypeId,
                    Description: description,
                    FamilyId: familyId
                };
                // Dataset upload is two-phase. First an uncommitted resource is uploaded. We then commit the resource as a dataset.
                // The returned aggregate promise flows progress events from uploadResourceAsync. commitResourceAsDatasetAsync is
                // assumed to not generate any progress events.
                return DataLab.Util.then(this.client.uploadResourceAsync(contents, dataType.dataTypeId), function (upload) {
                    var request = {
                        DataSource: dataset,
                        UploadId: upload.Id,
                        UploadedFromFilename: filename
                    };
                    return _this.client.commitResourceAsDatasetAsync(request);
                });
            };
            WorkspaceBackend.prototype.uploadCustomModulePackageAsync = function (contents, newModuleName, dataType, filename, description, familyId) {
                var _this = this;
                if (description === void 0) { description = ""; }
                if (familyId === void 0) { familyId = null; }
                var dataset = {
                    Name: newModuleName,
                    DataTypeId: dataType.dataTypeId,
                    Description: description,
                    FamilyId: familyId
                };
                // Module upload is two-phase. First an uncommitted resource is uploaded. We then call the module registrar that builds and commits the module resource.
                // The returned aggregate promise flows progress events from buildResourceAsCustomModulePackageAsync.
                return DataLab.Util.then(this.client.uploadResourceAsync(contents, dataType.dataTypeId), function (upload) {
                    var request = upload;
                    return _this.client.buildResourceAsCustomModulePackageAsync(request);
                });
            };
            WorkspaceBackend.prototype.getExperimentAsync = function (experimentId, moduleCache, datasetCache, trainedModelCache, transformModulesCache, dataTypeRegistry, workspace) {
                return DataLab.Util.then(this.client.getExperimentAsync(experimentId), function (experimentInfo) {
                    return DataContract.v1.deserializeExperiment(experimentInfo, moduleCache, datasetCache, trainedModelCache, transformModulesCache, dataTypeRegistry, workspace);
                });
            };
            WorkspaceBackend.prototype.getExperimentLineageAsync = function (experimentId) {
                return this.client.getExperimentLineageAsync(experimentId);
            };
            WorkspaceBackend.prototype.getExperimentInfoAsync = function (experimentId) {
                return DataLab.Util.then(this.client.getExperimentAsync(experimentId), function (experimentInfo) {
                    DataLab.Util.replaceJsonDates(experimentInfo.Status, ['CreationTime', 'StartTime', 'EndTime']);
                    return experimentInfo;
                });
            };
            WorkspaceBackend.prototype.getDataflowAsync = function (dataflowId, moduleCache, datasetCache, trainedModelCache, transformModulesCache, dataTypeRegistry, workspace) {
                return DataLab.Util.then(this.client.getDataflowAsync(dataflowId), function (dataflowContract) {
                    return DataContract.v1.deserializeDataflow(dataflowContract, moduleCache, datasetCache, trainedModelCache, transformModulesCache, dataTypeRegistry, workspace);
                });
            };
            WorkspaceBackend.prototype.createWebServiceGroupAsync = function (name, description, allowAnonymousTest) {
                var request = {
                    Name: name,
                    Description: description,
                    AllowAnonymousTest: allowAnonymousTest
                };
                return this.client.createWebServiceGroupAsync(request);
            };
            WorkspaceBackend.prototype.listWebServiceGroupsAsync = function () {
                return this.client.listWebServiceGroupsAsync();
            };
            WorkspaceBackend.prototype.updateWebServiceGroupAsync = function (webServiceGroupId, name, description, allowAnonymousTest) {
                var request = {
                    Name: name,
                    Description: description,
                    AllowAnonymousTest: allowAnonymousTest
                };
                return this.client.updateWebServiceGroupAsync(webServiceGroupId, request);
            };
            WorkspaceBackend.prototype.getWebServiceGroupAsync = function (webServiceGroupId) {
                return this.client.getWebServiceGroupAsync(webServiceGroupId);
            };
            WorkspaceBackend.prototype.deleteWebServiceGroupAsync = function (webServiceGroupId) {
                return this.client.deleteWebServiceGroupAsync(webServiceGroupId);
            };
            WorkspaceBackend.prototype.createModelPackageAsync = function (webServiceGroupId, experiment, workspace) {
                var _this = this;
                var inputs = [];
                var outputs = [];
                var updatableInputs = [];
                var webServiceInfo = DataContract.v1.serializeWebServiceInfo(experiment);
                function createModelPackageHelper(client) {
                    var request = {
                        StatusCode: 1 /* ReadyForProduction */,
                        Workflow: DataContract.v1.serialize(experiment),
                        Inputs: inputs,
                        LinkedExperimentId: experiment.experimentId(),
                        Parameters: webServiceInfo ? webServiceInfo.Parameters : null,
                        UpdatableInputs: updatableInputs
                    };
                    request.Outputs = outputs;
                    return client.registerModelPackageAsync(webServiceGroupId, request);
                }
                function processPort(mainPort, schemaPort, isInput) {
                    if (schemaPort && schemaPort.schemaEndpoint) {
                        var schemaPromise;
                        if (schemaPort.parent instanceof DataLab.Model.DatasetNode) {
                            schemaPromise = workspace.getDatasetSchema(schemaPort.parent.dataset.id);
                        }
                        else {
                            schemaPromise = workspace.getModuleOutputSchema(experiment.experimentId(), schemaPort.parent.id, schemaPort.name);
                        }
                        schemaPromise.done(function (schemaData) {
                            addPortMetadata(mainPort, JSON.stringify(schemaData), isInput);
                        }).fail(function (failureInfo) {
                            addPortMetadata(mainPort, null, isInput);
                        });
                        schemaPromises.push(schemaPromise);
                    }
                    else {
                        addPortMetadata(mainPort, null, isInput);
                    }
                }
                function addPortMetadata(port, schemaData, isInput) {
                    var name = null;
                    var webServicePorts = port.connectedWebServicePorts();
                    if (webServicePorts && webServicePorts.length) {
                        name = webServicePorts[0].parent.nameParameter.value();
                    }
                    var portMetadata = { GraphModuleNodeId: port.parent.id, PortName: port.name, Schema: schemaData, Name: name };
                    if (isInput) {
                        inputs.push(portMetadata);
                    }
                    else {
                        if (port.descriptor && port.descriptor.allowedDataTypes) {
                            for (var id in port.descriptor.allowedDataTypes) {
                                if (port.descriptor.allowedDataTypes[id].dataTypeId === "ILearnerDotNet") {
                                    portMetadata.OutputType = "TrainedModel";
                                    break;
                                }
                                else if (port.descriptor.allowedDataTypes[id].dataTypeId === "ITransformDotNet") {
                                    portMetadata.OutputType = "Transform";
                                    break;
                                }
                            }
                        }
                        outputs.push(portMetadata);
                    }
                }
                DataLab.Util.forEach(experiment.trainedModels, function (tm) {
                    var trainedModelPort = tm.trainedModelPort;
                    if (!trainedModelPort.isConnected()) {
                        return;
                    }
                    DataLab.Util.forEach(trainedModelPort.connectedPorts(), function (port) {
                        updatableInputs.push({
                            GraphModuleNodeId: port.parent.id,
                            PortName: port.name,
                            Name: tm.trainedModel.name(),
                            Schema: null
                        });
                    });
                });
                var publishInputPorts = experiment.getPublishInputPorts();
                var publishOutputPorts = experiment.getPublishOutputPorts();
                if (publishInputPorts.length > 0 || publishOutputPorts.length > 0) {
                    var schemaPromises = [];
                    publishInputPorts.forEach(function (inputPort) {
                        processPort(inputPort, inputPort.connectedOutputPort, true);
                    });
                    publishOutputPorts.forEach(function (outputPort) {
                        processPort(outputPort, outputPort, false);
                    });
                    var returnedPromise = $.Deferred();
                    $.when.apply($, schemaPromises).always(function () {
                        createModelPackageHelper(_this.client).done(function (modelPackageId) {
                            returnedPromise.resolveWith($, [modelPackageId]);
                        }).fail(function (err) {
                            returnedPromise.rejectWith($, [err]);
                        });
                    });
                    return returnedPromise;
                }
                else {
                    return createModelPackageHelper(this.client);
                }
            };
            WorkspaceBackend.prototype.listModelPackagesAsync = function (webServiceGroupId) {
                return this.client.listModelPackagesAsync(webServiceGroupId);
            };
            WorkspaceBackend.prototype.getModelPackageAsync = function (webServiceGroupId, modelPackageId) {
                return this.client.getModelPackageAsync(webServiceGroupId, modelPackageId);
            };
            WorkspaceBackend.prototype.updateModelPackageAsync = function (webServiceGroupId, modelPackageId, statusCode, inputsMetadata, outputsMetadata, globalParametersMetadata) {
                var request = {
                    StatusCode: statusCode,
                    InputsMetadata: inputsMetadata,
                    GlobalParametersMetadata: globalParametersMetadata
                };
                request.OutputsMetadata = outputsMetadata;
                return this.client.updateModelPackageAsync(webServiceGroupId, modelPackageId, request);
            };
            WorkspaceBackend.prototype.registerWebServiceAsync = function (webServiceGroupId, modelPackageId) {
                var _this = this;
                return DataLab.Util.then(this.getWorkspaceSettingsAsync(), function (workspaceSettings) {
                    var isProductionWorkspace = DataLab.Model.WorkspaceTypeExtensions.isProduction(workspaceSettings.type);
                    var request = {
                        ModelPackageId: modelPackageId,
                        WebServiceType: (isProductionWorkspace ? DataContract.WebServiceType.Production : DataContract.WebServiceType.Staging),
                        DiagnosticsSettings: null
                    };
                    return _this.client.registerWebServiceAsync(webServiceGroupId, request);
                });
            };
            WorkspaceBackend.prototype.getWebServiceAsync = function (webServiceGroupId, webServiceId) {
                return this.client.getWebServiceAsync(webServiceGroupId, webServiceId);
            };
            WorkspaceBackend.prototype.updateWebServiceAsync = function (webServiceGroupId, webServiceId, modelPackageId, diagnosticsSettings) {
                var request = {
                    ModelPackageId: modelPackageId,
                    WebServiceType: DataContract.WebServiceType.Staging,
                    DiagnosticsSettings: diagnosticsSettings
                };
                return this.client.updateWebServiceAsync(webServiceGroupId, webServiceId, request);
            };
            WorkspaceBackend.prototype.invokeScoreWebServiceAsync = function (webServiceGroupId, webserviceId, inputs, globalParameters) {
                return this.client.invokeScoreWebServiceAsync(webServiceGroupId, webserviceId, inputs, globalParameters);
            };
            WorkspaceBackend.prototype.createCommunityExperimentAsync = function (publishableExperiment, packageUri) {
                var request = {
                    ExperimentId: publishableExperiment.sourceExperiment.experimentId(),
                    PublishableExperiment: {
                        name: publishableExperiment.experimentName,
                        description: publishableExperiment.description,
                        summary: publishableExperiment.summary,
                        hidden: publishableExperiment.visibility == 0 /* Private */,
                        tags: publishableExperiment.tags
                    }
                };
                if (publishableExperiment.thumbnail) {
                    request.PublishableExperiment.upload_image_data = {
                        content: publishableExperiment.thumbnail.base64Text,
                        content_type: publishableExperiment.thumbnail.type
                    };
                }
                else if (publishableExperiment.imageUrl) {
                    request.PublishableExperiment.image_url = publishableExperiment.imageUrl;
                }
                return this.client.createCommunityExperimentAsync(request, packageUri);
            };
            WorkspaceBackend.prototype.getCommunityExperimentIdAsync = function (workspaceId, packageUri, communityUri) {
                return this.client.getCommunityExperimentIdAsync(workspaceId, packageUri, communityUri);
            };
            WorkspaceBackend.prototype.getWorkspaceSettingsAsync = function () {
                return DataLab.Util.then(this.client.getWorkspaceSettingsAsync(), function (workspaceSettings) {
                    return DataContract.v1.deserializeWorkspaceSettings(workspaceSettings);
                });
            };
            WorkspaceBackend.prototype.updateWorkspaceSettings = function (workspaceSettings, regenerateType) {
                var request = {
                    WorkspaceId: workspaceSettings.id,
                    FriendlyName: workspaceSettings.friendlyName(),
                    Description: workspaceSettings.description(),
                    AzureStorageConnectionString: workspaceSettings.azureStorageConnectionString(),
                    HDInsightClusterConnectionString: workspaceSettings.hdinsightClusterConnectionString.serialize(),
                    HDInsightStorageConnectionString: workspaceSettings.hdinsightStorageConnectionString.serialize(),
                    UseDefaultHDInsightSettings: workspaceSettings.useDefaultHDInsightSettings(),
                    SqlAzureConnectionString: workspaceSettings.sqlAzureConnectionString(),
                    AnalyticFrameworkClusterConnectionString: workspaceSettings.analyticFrameworkClusterConnectionString(),
                    AuthorizationToken: {
                        PrimaryToken: workspaceSettings.authorizationToken.primary(),
                        SecondaryToken: workspaceSettings.authorizationToken.secondary()
                    },
                    Etag: workspaceSettings.etag
                };
                switch (regenerateType) {
                    case 0 /* None */:
                        break;
                    case 1 /* Primary */:
                        request.AuthorizationToken.PrimaryToken = "UpdateToken";
                        Shell.Diagnostics.Telemetry.customEvent("Primary", "AuthorizationToken", undefined);
                        break;
                    case 2 /* Secondary */:
                        request.AuthorizationToken.SecondaryToken = "UpdateToken";
                        Shell.Diagnostics.Telemetry.customEvent("Second", "AuthorizationToken", undefined);
                        break;
                }
                return this.client.updateWorkspaceSettings(request);
            };
            WorkspaceBackend.prototype.getModuleVisualizationData = function (experimentId, nodeId, portName) {
                return this.client.getModuleVisualizationData(experimentId, nodeId, portName);
            };
            WorkspaceBackend.prototype.getModuleVisualizationDataItem = function (experimentId, nodeId, portName, item, type, subtype, parseAs) {
                return this.client.getModuleVisualizationDataItem(experimentId, nodeId, portName, item, type, subtype, parseAs);
            };
            WorkspaceBackend.prototype.getDatasetVisualizationData = function (datasetId) {
                return this.client.getDatasetVisualizationData(datasetId);
            };
            WorkspaceBackend.prototype.getModuleOutputSchema = function (experimentId, nodeId, portName) {
                return this.client.getModuleOutputSchema(experimentId, nodeId, portName);
            };
            WorkspaceBackend.prototype.getDatasetSchema = function (datasetId) {
                return this.client.getDatasetSchema(datasetId);
            };
            WorkspaceBackend.prototype.getModuleOutput = function (experimentId, nodeId, portName) {
                return this.client.getModuleOutput(experimentId, nodeId, portName);
            };
            WorkspaceBackend.prototype.getModuleErrorLog = function (experimentId, nodeId) {
                return this.client.getModuleErrorLog(experimentId, nodeId);
            };
            WorkspaceBackend.prototype.signOut = function () {
                return this.client.signOut();
            };
            WorkspaceBackend.prototype.getStorageSpaceQuotaAsync = function () {
                return this.client.getStorageSpaceQuotaAsync();
            };
            WorkspaceBackend.prototype.getExperimentDetailsAsync = function (experimentId) {
                return this.client.getExperimentDetailsAsync(experimentId);
            };
            WorkspaceBackend.prototype.updateExperimentDetailsAsync = function (experimentId, details) {
                return this.client.updateExperimentDetailsAsync(experimentId, details);
            };
            WorkspaceBackend.prototype.generateSubmissionRequest = function (experiment, isDraft) {
                return {
                    Description: experiment.description(),
                    Summary: experiment.summary.value(),
                    ExperimentGraph: DataContract.v1.serialize(experiment),
                    IsDraft: isDraft,
                    IsArchived: experiment.isArchived,
                    // The parent ID is null for a new experiment, otherwise it is the ID of the original experiment from which it was cloned from.
                    // This allows lineage to be tracked.
                    ParentExperimentId: experiment.parentExperimentId,
                    WebService: DataContract.v1.serializeWebServiceInfo(experiment),
                    DisableNodesUpdate: experiment.disableNodesUpdate(),
                    Category: "user"
                };
            };
            WorkspaceBackend.prototype.listProjects = function (experimentId) {
                if (experimentId === void 0) { experimentId = null; }
                return this.client.listProjects(experimentId);
            };
            WorkspaceBackend.prototype.createProject = function (request) {
                return this.client.createProject(request);
            };
            WorkspaceBackend.prototype.updateProject = function (projectId, request) {
                return this.client.updateProject(projectId, request);
            };
            return WorkspaceBackend;
        })();
        DataContract.WorkspaceBackend = WorkspaceBackend;
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Model/Experiment.ts" />
/// <reference path="../ClientCache.ts" />
/// <reference path="DataContractInterfaces-v2.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        var v2;
        (function (v2) {
            var Model = DataLab.Model;
            /**
              * Creates nodes of serialized graph and stores them in maps to translate between contract and instance ids
              * @param {ISerializableGraph} contractGraph the serialized graph containing the nodes to construct
              * @param {ApplicationCache} applicationCache the cache for modules and datasets
              * @param {(ISerializableGraphNode) => void) onLookupFail a callback for when looking up the module/dataset by guid in the application cache fails
              * @param {(ISerializableGraphNode) => string) idTransform a callback that maps between contract and experiment ids
              * @return {INodesAddedPromise} a promise whose .done callback's parameter contains an IAddedNodesInfo
             **/
            function createNodes(contractGraph, moduleCache, datasetCache, trainedModelCache, transformModulesCache, onLookupFail, idTransform, workspace) {
                var addedNodesInfo = {
                    nodesToContract: Object.create(null),
                    contractToNodes: Object.create(null)
                };
                var addedNodesPromises = [];
                function addGraphNode(graphNode, contractGraphNode) {
                    graphNode.x(contractGraphNode.X);
                    graphNode.y(contractGraphNode.Y);
                    addedNodesInfo.nodesToContract[graphNode.id] = contractGraphNode;
                    addedNodesInfo.contractToNodes[contractGraphNode.Id] = graphNode;
                }
                contractGraph.Nodes.forEach(function (contractGraphNode) {
                    if (contractGraphNode.NodeType === 1 /* Dataset */) {
                        // If the dataset doesn't already exist in the experiment, and the dataset exists
                        // in the palette, add a command to put one in the experiment
                        var datasetFetchPromise = datasetCache.getItem(contractGraphNode.Guid);
                        datasetFetchPromise.done(function (dataset) {
                            var newDatasetNode = new DataLab.Model.DatasetNode(dataset, idTransform(contractGraphNode));
                            addGraphNode(newDatasetNode, contractGraphNode);
                        }).fail(function () {
                            onLookupFail(contractGraphNode);
                        });
                        addedNodesPromises.push(datasetFetchPromise);
                    }
                    else if (contractGraphNode.NodeType === 0 /* Module */) {
                        var moduleFetchPromise = moduleCache.getItem(contractGraphNode.Guid);
                        moduleFetchPromise.done(function (module_) {
                            var newModuleNode = new DataLab.Model.ModuleNode(module_, workspace, idTransform(contractGraphNode));
                            addGraphNode(newModuleNode, contractGraphNode);
                            var contractModule = contractGraphNode;
                            // Traverse down the tree of parameters and populate the values.
                            deserializeModuleParameters(newModuleNode.parameters, contractModule.Parameters);
                            newModuleNode.comment(contractGraphNode.Comment);
                        }).fail(function () {
                            onLookupFail(contractGraphNode);
                        });
                        addedNodesPromises.push(moduleFetchPromise);
                    }
                    else if (contractGraphNode.NodeType === 2 /* TrainedModel */) {
                        // If the trained model doesn't already exist in the experiment, and the trained model exists
                        // in the palette, add a command to put one in the experiment
                        var trainedModelFetchPromise = trainedModelCache.getItem(contractGraphNode.Guid);
                        trainedModelFetchPromise.done(function (trainedModel) {
                            var newTrainedModelNode = new DataLab.Model.TrainedModelNode(trainedModel, idTransform(contractGraphNode));
                            addGraphNode(newTrainedModelNode, contractGraphNode);
                        }).fail(function () {
                            onLookupFail(contractGraphNode);
                        });
                        addedNodesPromises.push(trainedModelFetchPromise);
                    }
                    else if (contractGraphNode.NodeType === 4 /* Transform */) {
                        var transformFetchPromise = transformModulesCache.getItem(contractGraphNode.Guid);
                        transformFetchPromise.done(function (transform) {
                            var newTransformNode = new DataLab.Model.TransformNode(transform, idTransform(contractGraphNode));
                            addGraphNode(newTransformNode, contractGraphNode);
                        }).fail(function () {
                            onLookupFail(contractGraphNode);
                        });
                        addedNodesPromises.push(transformFetchPromise);
                    }
                    else {
                        onLookupFail(contractGraphNode);
                    }
                });
                return DataLab.Util.then(DataLab.Util.when.apply(addedNodesPromises), function () {
                    return addedNodesInfo;
                });
            }
            v2.createNodes = createNodes;
            /**
              * Create connections for the given added nodes.
             **/
            function createConnections(addedNodesInfo, onConnectToMissingPort) {
                var addedConnectionInfos = [];
                // Iterate over each nodes' input ports and make connections to nodes in the added set. If one
                // end is not in the added set, call onConnectToMissing node so the caller can deal with it.
                // Then iterate over each nodes'output ports looking for egress connections, notifying the caller
                // for each one found.
                DataLab.Util.forEach(addedNodesInfo.nodesToContract, function (contractGraphNode) {
                    var graphNode = addedNodesInfo.contractToNodes[contractGraphNode.Id];
                    contractGraphNode.InputPorts.forEach(function (contractInputPort) {
                        if (contractInputPort.Connection) {
                            var thisPort = graphNode.inputPorts[contractInputPort.PortName];
                            var otherNode = addedNodesInfo.contractToNodes[contractInputPort.Connection.OutputNodeId];
                            var otherPort = null;
                            if (otherNode) {
                                otherPort = otherNode.outputPorts[contractInputPort.Connection.OutputPortName];
                                if (otherPort) {
                                    addedConnectionInfos.push({
                                        inputPort: thisPort,
                                        outputPort: otherPort
                                    });
                                }
                            }
                            if (!otherNode || !otherPort) {
                                onConnectToMissingPort(contractInputPort, contractInputPort.Connection);
                            }
                        }
                    });
                });
                return addedConnectionInfos;
            }
            v2.createConnections = createConnections;
            /**
              * Traverses through all module parameters of the new (pasted) module and populates them from the module
                parameters of the original (copied) module.
              * @param {Model.IModuleNodeParameterMap} parameters the collection of parameters of the new (pasted) module
              * @param {IModuleNodeParameterMap} serializedModuleParameters the structure of parameters of the original
                                                        (copied) module
             **/
            function deserializeModuleParameters(parameters, serializedModuleParameters) {
                DataLab.Util.forEach(parameters, function (newParameter, key) {
                    var copiedParameter = serializedModuleParameters[key];
                    // We already convert all old experiment parameter back to literal parameter in deserialize-v1
                    // so we should never in a state that the parameter here is still using experiment parameter.
                    newParameter.value(copiedParameter.Value);
                    // If this is a mode parameter, deserialize all child parameters.
                    if (newParameter.descriptor instanceof Model.ModeModuleParameterDescriptor) {
                        DataLab.Util.forEach(newParameter.childParameters, function (childParameters, optionValue) {
                            deserializeModuleParameters(childParameters, copiedParameter.ChildParameters[optionValue]);
                        });
                    }
                });
            }
        })(v2 = DataContract.v2 || (DataContract.v2 = {}));
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Contracts/Deserializer-v2.ts" />
var DataLab;
(function (DataLab) {
})(DataLab || (DataLab = {}));
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var User = (function () {
            function User(userInfo) {
                this.email = userInfo.Email;
                this.name = userInfo.Name;
                this.role = userInfo.Role;
                this.userId = userInfo.UserId;
            }
            Object.defineProperty(User.prototype, "isWorkspaceOwner", {
                get: function () {
                    return this.role === "Owner";
                },
                enumerable: true,
                configurable: true
            });
            return User;
        })();
        Model.User = User;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var AuthorizationToken = (function () {
            function AuthorizationToken() {
                this.primary = ko.observable(null);
                this.secondary = ko.observable(null);
            }
            AuthorizationToken.prototype.deserialize = function (token) {
                this.primary(token.PrimaryToken);
                this.secondary(token.SecondaryToken);
            };
            return AuthorizationToken;
        })();
        Model.AuthorizationToken = AuthorizationToken;
        var HDInsightClusterConnectionString = (function () {
            function HDInsightClusterConnectionString() {
                var _this = this;
                this.hasBeenEdited = ko.observable(false);
                var validationFunction = function (value) {
                    if (_this.hasBeenEdited() && !value) {
                        return "This field is required to update HDInsight Cluster connection.";
                    }
                    return /[;]/.test(value) ? "This field cannot contain any semi-colons (;)." : null;
                };
                this.user = DataLab.Validation.validatableObservable(null, validationFunction);
                this.password = DataLab.Validation.validatableObservable(null, validationFunction);
                this.uri = DataLab.Validation.validatableObservable(null, validationFunction);
            }
            HDInsightClusterConnectionString.prototype.settingsUpdated = function () {
                if (!this.hasBeenEdited()) {
                    this.hasBeenEdited(true);
                    this.user.startValidating();
                    this.password.startValidating();
                    this.uri.startValidating();
                    this.user.validate();
                    this.password.validate();
                    this.uri.validate();
                }
            };
            /** Sets the fields using the string received from service. Expected to consist only of the URI. */
            HDInsightClusterConnectionString.prototype.deserialize = function (receivedString) {
                this.uri(receivedString);
            };
            /** Serialize the three fields into a single connection string. */
            HDInsightClusterConnectionString.prototype.serialize = function () {
                // Format the string to: User=foo;Password=bar;URI=foobar
                // If any fields are missing, exclude the field completely. The resultant string will be incorrectly formatted, which will be ignored by service.
                return (this.user() ? "User=" + this.user() + ";" : "") + (this.password() ? "Password=" + this.password() + ";" : "") + (this.uri() ? "Uri=" + this.uri() : "");
            };
            return HDInsightClusterConnectionString;
        })();
        Model.HDInsightClusterConnectionString = HDInsightClusterConnectionString;
        var HDInsightStorageConnectionString = (function () {
            function HDInsightStorageConnectionString() {
                var _this = this;
                this.hasBeenEdited = ko.observable(false);
                var validationFunction = function (value) {
                    if (_this.hasBeenEdited() && !value) {
                        return "This field is required to update HDInsight Cluster connection.";
                    }
                    return /[;@]/.test(value) ? "This field cannot contain any semi-colons (;) or at symbols (@)." : null;
                };
                var keyValidationFunction = function (value) {
                    if (_this.hasBeenEdited() && !value) {
                        return "This field is required to update HDInsight Cluster connection.";
                    }
                    return /[;]/.test(value) ? "This field cannot contain any semi-colons (;)." : null;
                };
                this.accountName = DataLab.Validation.validatableObservable(null, validationFunction);
                this.accountKey = DataLab.Validation.validatableObservable(null, keyValidationFunction);
                this.container = DataLab.Validation.validatableObservable(null, validationFunction);
            }
            HDInsightStorageConnectionString.prototype.settingsUpdated = function () {
                if (!this.hasBeenEdited()) {
                    this.hasBeenEdited(true);
                    this.accountName.startValidating();
                    this.accountKey.startValidating();
                    this.container.startValidating();
                    this.accountName.validate();
                    this.accountKey.validate();
                    this.container.validate();
                }
            };
            /** Sets the fields using the string received from service. Expected to be of the format "container@accountName". */
            HDInsightStorageConnectionString.prototype.deserialize = function (receivedString) {
                if (receivedString) {
                    var fields = receivedString.split('@');
                    this.accountName(fields[1]);
                    this.container(fields[0]);
                }
            };
            /** Serialize the three fields into a single connection string. */
            HDInsightStorageConnectionString.prototype.serialize = function () {
                // Format the string to: AccountName=foo;AccountKey=bar;Container=foobar
                // If any fields are missing, exclude the field completely. The resultant string will be incorrectly formatted, which will be ignored by service.
                return (this.accountName() ? "AccountName=" + this.accountName() + ";" : "") + (this.accountKey() ? "AccountKey=" + this.accountKey() + ";" : "") + (this.container() ? "Container=" + this.container() : "");
            };
            return HDInsightStorageConnectionString;
        })();
        Model.HDInsightStorageConnectionString = HDInsightStorageConnectionString;
        (function (WorkspaceType) {
            WorkspaceType[WorkspaceType["Production"] = 0] = "Production";
            WorkspaceType[WorkspaceType["Free"] = 1] = "Free";
            WorkspaceType[WorkspaceType["Anonymous"] = 2] = "Anonymous";
            WorkspaceType[WorkspaceType["PaidStandard"] = 3] = "PaidStandard";
            WorkspaceType[WorkspaceType["PaidPremium"] = 4] = "PaidPremium";
        })(Model.WorkspaceType || (Model.WorkspaceType = {}));
        var WorkspaceType = Model.WorkspaceType;
        ;
        var WorkspaceTypeExtensions = (function () {
            function WorkspaceTypeExtensions() {
            }
            WorkspaceTypeExtensions.isProduction = function (workspaceType) {
                switch (workspaceType) {
                    case 2 /* Anonymous */:
                    case 1 /* Free */:
                        return false;
                    case 0 /* Production */:
                    case 3 /* PaidStandard */:
                    case 4 /* PaidPremium */:
                        return true;
                    default:
                        DataLab.Log.error("Unexpected WorkspaceType.");
                        return false;
                }
            };
            return WorkspaceTypeExtensions;
        })();
        Model.WorkspaceTypeExtensions = WorkspaceTypeExtensions;
        var WorkspaceSettings = (function () {
            function WorkspaceSettings(id) {
                this.id = null;
                this.friendlyName = DataLab.Validation.validatableObservable(null, new DataLab.Validation.WorkspaceNameValidator().validate);
                this.description = ko.observable(null);
                this.azureStorageConnectionString = ko.observable(null);
                this.hdinsightClusterConnectionString = new HDInsightClusterConnectionString();
                this.hdinsightStorageConnectionString = new HDInsightStorageConnectionString();
                this.useDefaultHDInsightSettings = ko.observable(true);
                this.sqlAzureConnectionString = ko.observable(null);
                this.analyticFrameworkClusterConnectionString = ko.observable(null);
                this.authorizationToken = new AuthorizationToken();
                this.etag = null;
                this.type = null;
                this.id = id;
            }
            WorkspaceSettings.prototype.populateFromContract = function (contract) {
                this.friendlyName(contract.FriendlyName);
                this.description(contract.Description);
                this.azureStorageConnectionString(contract.AzureStorageConnectionString);
                this.hdinsightClusterConnectionString.deserialize(contract.HDInsightClusterConnectionString);
                this.hdinsightStorageConnectionString.deserialize(contract.HDInsightStorageConnectionString);
                this.useDefaultHDInsightSettings(contract.UseDefaultHDInsightSettings);
                this.sqlAzureConnectionString(contract.SqlAzureConnectionString);
                this.analyticFrameworkClusterConnectionString(contract.AnalyticFrameworkClusterConnectionString);
                this.authorizationToken.deserialize(contract.AuthorizationToken);
                this.etag = contract.Etag;
                if (contract.Type) {
                    this.type = (typeof (contract.Type) !== "number" && contract.Type in WorkspaceType) ? WorkspaceType[contract.Type] : null;
                }
                else {
                    this.type = 0 /* Production */;
                }
                this.ownerEmail = contract.OwnerEmail;
                this.userStorage = contract.UserStorage;
                this.subscriptionId = contract.SubscriptionId;
                this.subscriptionName = contract.SubscriptionName;
                this.subscriptionState = typeof contract.SubscriptionState === 'string' && DataLab.DataContract.v1.SubscriptionStatus[contract.SubscriptionState] || null;
                var indexToNumberOfMilliseconds = 6; // for serialized date time in the format: /Date(123456)/
                var createdTimeMs = parseInt(contract.CreatedTime.substr(indexToNumberOfMilliseconds));
                this.createdTime = !!createdTimeMs ? new Date(createdTimeMs) : null;
            };
            /** Trigger validation on all validatable fields. Return true if there are no errors, false if there are errors. */
            WorkspaceSettings.prototype.validateAll = function () {
                this.friendlyName.startValidating();
                if (this.friendlyName.validate().length > 0 || this.hdinsightClusterConnectionString.user.validate().length > 0 || this.hdinsightClusterConnectionString.password.validate().length > 0 || this.hdinsightClusterConnectionString.uri.validate().length > 0 || this.hdinsightStorageConnectionString.accountName.validate().length > 0 || this.hdinsightStorageConnectionString.accountKey.validate().length > 0 || this.hdinsightStorageConnectionString.container.validate().length > 0) {
                    return false;
                }
                return true;
            };
            return WorkspaceSettings;
        })();
        Model.WorkspaceSettings = WorkspaceSettings;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="DatasetNode.ts" />
/// <reference path="DataType.ts" />
/// <reference path="DataTypeRegistry.ts" />
/// <reference path="Experiment.ts" />
/// <reference path="ExperimentEvents.ts" />
/// <reference path="GraphNode.ts" />
/// <reference path="ModuleNode.ts" />
/// <reference path="Parameter.ts" />
/// <reference path="ModelTestData.ts" />
/// <reference path="Port.ts" />
/// <reference path="Workspace.ts" />
/// <reference path="User.ts" />
/// <reference path="WorkspaceSettings.ts" />
/// <reference path="ModelUtils.ts" />
/// <reference path="Property.ts" /> 

/// <reference path="../Global.refs.ts" />
/// <reference path="../Model/_refs.ts" />
/// <reference path="DataContractInterfaces-v1.ts" />
/// <reference path="../ClientCache.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        var v1;
        (function (v1) {
            var defaultLayout = { x: 0, y: 0 };
            function getPortKey(port) {
                // In order to cause pain, this is the only way to correlate edges with ports in the graph contract.
                return port.NodeId + ":" + port.Name;
            }
            function deserializeDataflow(dataflow, moduleCache, datasetCache, trainedModelCache, transformModulesCache, dataTypeRegistry, workspace) {
                var experimentModel = new DataLab.Model.Experiment(dataflow.Id, dataflow.ParentId);
                experimentModel.description(dataflow.Description);
                experimentModel.setDraftState(false);
                return DataLab.Util.when(deserializeGraph(dataflow, workspace, moduleCache, datasetCache, trainedModelCache, transformModulesCache, dataTypeRegistry, experimentModel));
            }
            v1.deserializeDataflow = deserializeDataflow;
            function deserializeExperiment(experiment, moduleCache, datasetCache, trainedModelCache, transformModulesCache, dataTypeRegistry, workspace) {
                var schemaVersion = (experiment.SchemaVersion === undefined) ? 1 : experiment.SchemaVersion;
                if (schemaVersion === 2) {
                    throw new Error("SchemaVersion:2 is not yet supported!");
                }
                var webServiceGroupId = experiment.WebService ? experiment.WebService.WebServiceGroupId : null;
                var experimentModel = new DataLab.Model.Experiment(experiment.ExperimentId, experiment.ParentExperimentId, experiment.Creator, webServiceGroupId);
                // Setting the status here will give the experiment the correct isDraft state. This should be done before any other
                // changes to the experiment to avoid making a non-draft experiment "dirty".
                if (experiment.Status.StatusCode) {
                    experimentModel.statusCode(experiment.Status.StatusCode);
                }
                experimentModel.description(experiment.Description);
                experimentModel.summary.value(experiment.Summary);
                experimentModel.originalExperimentDocumentation.value(experiment.OriginalExperimentDocumentationLink);
                experimentModel.etag(experiment.Etag);
                experimentModel.isArchived = experiment.IsArchived;
                experimentModel.isLeaf(experiment.IsLeaf);
                experimentModel.publishedModelPackageId = experiment.WebService ? experiment.WebService.ModelPackageId : null;
                experimentModel.disableNodesUpdate(experiment.DisableNodesUpdate === true);
                experimentModel.category = experiment.Category;
                if (experiment.Status.StartTime) {
                    experimentModel.startTime(DataLab.Util.formatDate(DataLab.Util.parseJsonDate(experiment.Status.StartTime)));
                }
                if (experiment.Status.EndTime) {
                    experimentModel.endTime(DataLab.Util.formatDate(DataLab.Util.parseJsonDate(experiment.Status.EndTime)));
                }
                if (experiment.Status.StatusDetail) {
                    experimentModel.statusDetails(experiment.Status.StatusDetail);
                }
                var nodeStatus = Object.create(null);
                // Fill out the node status table
                experiment.NodeStatuses.forEach(function (status) {
                    nodeStatus[status.NodeId] = status;
                });
                return deserializeGraph(experiment, workspace, moduleCache, datasetCache, trainedModelCache, transformModulesCache, dataTypeRegistry, experimentModel, nodeStatus, experiment.WebService);
            }
            v1.deserializeExperiment = deserializeExperiment;
            function deserializeWorkspaceSettings(workspaceSettings) {
                var workspaceSettingsModel = new DataLab.Model.WorkspaceSettings(workspaceSettings.WorkspaceId);
                workspaceSettingsModel.populateFromContract(workspaceSettings);
                return workspaceSettingsModel;
            }
            v1.deserializeWorkspaceSettings = deserializeWorkspaceSettings;
            function deserializeGraph(experiment, workspace, moduleCache, datasetCache, trainedModelCache, transformModulesCache, dataTypeRegistry, experimentModel, nodeStatusTable, webService) {
                if (nodeStatusTable === void 0) { nodeStatusTable = Object.create(null); }
                if (webService === void 0) { webService = Object.create(null); }
                // A port lookup table [dataSourceId] => port, a lookup table to help cache/index the DataSourceId to Port map
                // and this is specific to SchemaVersion:1 format.
                var datasetToPortTable = Object.create(null);
                // A port lookup table [id:label] = > port
                var portLookupTable = Object.create(null);
                var indexPort = function (key, port) {
                    portLookupTable[key] = port;
                };
                var webServiceParameters = Object.create(null);
                // Index the layout information keyed by the module/dataset id
                var layoutTable = parseLegacyLayoutData(experiment.Graph.SerializedClientData);
                var asyncTasks = [];
                var dirtyInputPorts = [];
                // We create experiment-level parameters before touching creating nodes since module nodes may reference them.
                if (!webService) {
                    webService = {};
                }
                if (!webService.Parameters) {
                    webService.Parameters = [];
                }
                webService.Parameters.forEach(function (graphParameterDescriptor) {
                    if (graphParameterDescriptor.Name in webServiceParameters) {
                        throw new Error("Duplicate experiment-level parameter name.");
                    }
                    var deserializedParameterDescriptor = DataContract.deserializeModuleParameterDescriptor(graphParameterDescriptor.ParameterDefinition);
                    // The Name field on a graph parameter descriptor is redundant with the Name on the inner module parameter descriptor.
                    // We let the graph parameter name take precedence here.
                    deserializedParameterDescriptor.name = graphParameterDescriptor.Name;
                    // The inner descriptor's DefaultValue is similarly redundant with the outer Value.
                    deserializedParameterDescriptor.defaultValue = graphParameterDescriptor.Value;
                    webServiceParameters[graphParameterDescriptor.Name] = experimentModel.addParameter(deserializedParameterDescriptor, graphParameterDescriptor.Name, graphParameterDescriptor.Value);
                });
                // Process each ModuleNode
                experiment.Graph.ModuleNodes.forEach(function (mod) {
                    // Create a Module
                    var moduleAddedPromise = $.Deferred();
                    moduleCache.getItem(mod.ModuleId).done(function (targetModule) {
                        // Gets the layout info for module.Id
                        var layout = layoutTable[mod.Id] || defaultLayout;
                        var nodeStatus = nodeStatusTable[mod.Id];
                        var hasNodeStatus = (nodeStatus !== undefined);
                        var x = layout.x;
                        var y = layout.y;
                        var portToOutputEndpoint = {};
                        if (hasNodeStatus) {
                            nodeStatus.OutputEndpoints.forEach(function (endpoint) {
                                if (!(portToOutputEndpoint[endpoint.Name] && portToOutputEndpoint[endpoint.Name].IsAuxiliary)) {
                                    portToOutputEndpoint[endpoint.Name] = endpoint;
                                }
                            });
                        }
                        var newModuleNode = experimentModel.addModule(targetModule, workspace, x, y, mod.Id);
                        var datasetTasks = [];
                        var trainedModelTasks = [];
                        var transformModuleTasks = [];
                        // Traverse down the tree of parameters and populate the values.
                        deserializeModuleParameters(newModuleNode.parameters, mod.ModuleParameters, webServiceParameters);
                        // Update node execution state
                        if (hasNodeStatus) {
                            // Since we have node status from this experiment, we should consider it to be the one which
                            // owns all of the node's output endpoints.
                            newModuleNode.executedExperimentId = experimentModel.experimentId();
                            // Update observable statuses and endpoints.
                            if (nodeStatus.Status.StartTime) {
                                var startTime = DataLab.Util.parseJsonDate(nodeStatus.Status.StartTime);
                                newModuleNode.startTime.value(DataLab.Util.formatDate(startTime));
                            }
                            if (nodeStatus.Status.EndTime && nodeStatus.Status.StartTime) {
                                var endTime = DataLab.Util.parseJsonDate(nodeStatus.Status.EndTime);
                                if (endTime.getTime() > DataLab.Util.minDate) {
                                    newModuleNode.endTime.value(DataLab.Util.formatDate(endTime));
                                    var elapsedTime = DataLab.Util.getElapsedTimeMilliseconds(startTime, endTime);
                                    if (elapsedTime >= 0) {
                                        newModuleNode.elapsedTime.value(DataLab.Util.formatElapsedTime(elapsedTime));
                                    }
                                }
                            }
                            if (nodeStatus.Status.StatusCode) {
                                newModuleNode.statusCode.value(nodeStatus.Status.StatusCode);
                            }
                            if (nodeStatus.Status.StatusDetail) {
                                newModuleNode.statusDetails.value(nodeStatus.Status.StatusDetail);
                            }
                            if (nodeStatus.StandardOutEndpoint) {
                                newModuleNode.outputLog.endpoint(nodeStatus.StandardOutEndpoint);
                            }
                            if (nodeStatus.StandardErrorEndpoint) {
                                newModuleNode.errorLog.endpoint(nodeStatus.StandardErrorEndpoint);
                            }
                            nodeStatus.OutputEndpoints.forEach(function (endpoint) {
                                newModuleNode.addEndpoint(endpoint);
                            });
                        }
                        mod.InputPortsInternal.forEach(function (port) {
                            // Add InputPort
                            var newInputPort = newModuleNode.inputPorts[port.Name];
                            if (!newInputPort) {
                                throw new Error("Invalid input port: " + port.Name);
                            }
                            indexPort(getPortKey(port), newInputPort);
                            // For schema version 1 Dataset is implicitly specified as DataSourceId field in the InputPort. If DataSourceId != null the
                            // InputPort is connected to Dataset[ID=DataSourceId]
                            if (port.DataSourceId) {
                                var datasetPromise = processDataResourceLegacyFormat(experimentModel, newInputPort, port.DataSourceId, datasetCache, layoutTable, datasetToPortTable);
                                datasetPromise.fail(function (error) {
                                    experimentModel.hasMissingResources = true;
                                    dirtyInputPorts.push(newInputPort);
                                });
                                datasetTasks.push(datasetPromise);
                            }
                            if (port.TrainedModelId) {
                                var trainedModelPromise = processTrainedModel(experimentModel, newInputPort, port.TrainedModelId, trainedModelCache, layoutTable, datasetToPortTable);
                                trainedModelPromise.fail(function (error) {
                                    experimentModel.hasMissingResources = true;
                                    dirtyInputPorts.push(newInputPort);
                                });
                                trainedModelTasks.push(trainedModelPromise);
                            }
                            if (port.TransformModuleId) {
                                transformModuleTasks.push(processTransformModule(experimentModel, newInputPort, port.TransformModuleId, transformModulesCache, layoutTable, datasetToPortTable));
                            }
                        });
                        // Process each output port internal
                        mod.OutputPortsInternal.forEach(function (port) {
                            var newOutputPort = newModuleNode.outputPorts[port.Name];
                            if (!newOutputPort) {
                                throw new Error("Invalid output port: " + port.Name);
                            }
                            indexPort(getPortKey(port), newOutputPort);
                            var outputEndpoint = portToOutputEndpoint[port.Name];
                            if (outputEndpoint) {
                                newOutputPort.outputEndpoint = outputEndpoint;
                            }
                        });
                        if (hasNodeStatus && nodeStatus.MetadataOutputEndpoints) {
                            var outputPortsMap = newModuleNode.outputPorts;
                            DataLab.Util.forEach(outputPortsMap, function (port) {
                                var endpointsForPort = nodeStatus.MetadataOutputEndpoints[port.name];
                                if (endpointsForPort) {
                                    var visualizationEndpointWithKey = DataLab.Util.first(endpointsForPort, function (ep) {
                                        return ep.Key === "visualization";
                                    }, null);
                                    var schemaEndpointWithKey = DataLab.Util.first(endpointsForPort, function (ep) {
                                        return ep.Key === "schema";
                                    }, null);
                                    port.visualizationEndpoint = visualizationEndpointWithKey ? visualizationEndpointWithKey.Value : null;
                                    port.schemaEndpoint = schemaEndpointWithKey ? schemaEndpointWithKey.Value : null;
                                }
                            });
                        }
                        // Deserialise module comment
                        if (mod.Comment) {
                            newModuleNode.comment(mod.Comment);
                            newModuleNode.commentCollapsed(mod.CommentCollapsed);
                        }
                        else {
                            newModuleNode.comment("");
                            newModuleNode.commentCollapsed(true);
                        }
                        // Wait til all the required resources have been loaded.
                        var resourceLoadTasks = datasetTasks.concat(trainedModelTasks);
                        $.when.apply($, resourceLoadTasks.map(function (task) {
                            // continue if a resource failed to load; this means we'll mark the module dirty later
                            var deferred = $.Deferred();
                            task.always(function () { return deferred.resolve(); });
                            return deferred.promise();
                        })).done(function () {
                            moduleAddedPromise.resolve();
                        });
                    }).fail(function () {
                        // TODO: gracefully handle failures to load modules
                        moduleAddedPromise.reject(new Error("Module with ID " + mod.ModuleId + " does not exist in your workspace."));
                    });
                    asyncTasks.push(moduleAddedPromise);
                });
                for (var key in webServiceParameters) {
                    // If the parameter is old experment parameter
                    // remove it fron the list to avoid confusing
                    if (webServiceParameters[key].isExperimentParameter) {
                        experimentModel.removeWebServiceParameter(webServiceParameters[key]);
                        experimentModel.experimentParameterInUse = true;
                    }
                }
                var returnedPromise = $.Deferred();
                var addedConnections = $.when.apply($, asyncTasks).done(function () {
                    experiment.Graph.EdgesInternal.forEach(function (edge) {
                        // SourceOutputPortId / DestinationInputPortId are in the format nodeId:portName. See getPortKey.
                        var source = portLookupTable[edge.SourceOutputPortId];
                        var target = portLookupTable[edge.DestinationInputPortId];
                        source.connectTo(target);
                    });
                    returnedPromise.resolve(experimentModel);
                }).fail(function (error) {
                    returnedPromise.reject(error);
                });
                var webServiceLayoutTable = webService.SerializedClientData ? parseLegacyLayoutData(webService.SerializedClientData) : {};
                experimentModel.isWebServiceExperiment(webService.IsWebServiceExperiment);
                return returnedPromise.done(function () {
                    if (webService.Inputs) {
                        DataLab.Util.forEach(webService.Inputs, function (port) {
                            addWebServicePort(experimentModel, portLookupTable, port, 0 /* Input */, webServiceLayoutTable, dataTypeRegistry);
                        });
                    }
                    if (webService.Outputs) {
                        DataLab.Util.forEach(webService.Outputs, function (port) {
                            addWebServicePort(experimentModel, portLookupTable, port, 1 /* Output */, webServiceLayoutTable, dataTypeRegistry);
                        });
                    }
                    experimentModel.startDirtyingAll();
                    if (experimentModel.isLeaf() && experimentModel.statusCode() === DataLab.DataContract.State.Finished) {
                        dirtyInputPorts.forEach(function (port) {
                            port.dirtyStatusInfo.dirty();
                            port.dirtyDraftState.dirty();
                        });
                    }
                });
            }
            function deserializeDataType(dataType) {
                var dataTypeModel = new DataLab.Model.DataType(dataType.Id);
                dataTypeModel.name = dataType.Name;
                dataTypeModel.description = dataType.Description;
                dataTypeModel.fileExtension = dataType.FileExtension;
                dataTypeModel.allowUpload = dataType.AllowUpload === undefined ? true : dataType.AllowUpload;
                dataTypeModel.allowPromotion = dataType.AllowPromotion === undefined ? true : dataType.AllowPromotion;
                dataTypeModel.allowModelPromotion = dataType.AllowModelPromotion === undefined ? false : dataType.AllowModelPromotion;
                return dataTypeModel;
            }
            v1.deserializeDataType = deserializeDataType;
            function processDataResourceLegacyFormat(experiment, inputPort, dataResourceId, resourceCache, layoutTable, dataResourceToPortTable) {
                if (dataResourceId === null) {
                    return;
                }
                var dataResourceAddedPromise = $.Deferred();
                resourceCache.getItem(dataResourceId).done(function (dataResource) {
                    // TODO: TFS #1031791 We really don't have to do this if the Dataset is a separate collection in our DataContract
                    // and makes processing more consistent and simpler. Once the backend is switching to the V2, we can deprecate all the related code 
                    // Create Dataset if it is not previously created
                    if (dataResourceToPortTable[dataResourceId] === undefined) {
                        // Gets the layout info for DataSourceId
                        var layout = layoutTable[dataResourceId] || defaultLayout;
                        var datasetNode = experiment.addDataset(dataResource, layout.x, layout.y, dataResourceId);
                        // This same dataset node and port should be used for future usages of the same dataset.
                        dataResourceToPortTable[dataResourceId] = datasetNode.datasetPort;
                    }
                    // Create connection between DS::OutPort and InputPort
                    dataResourceToPortTable[dataResourceId].connectTo(inputPort);
                    dataResourceAddedPromise.resolve();
                }).fail(function () {
                    dataResourceAddedPromise.reject(new Error("Dataset with id " + dataResourceId + " does not exist in your workspace."));
                });
                return dataResourceAddedPromise;
            }
            function processTrainedModel(experiment, inputPort, trainedModelId, trainedModelCache, layoutTable, trainedModelToPortTable) {
                if (trainedModelId === null) {
                    return;
                }
                var trainedModelAddedPromise = $.Deferred();
                trainedModelCache.getItem(trainedModelId).done(function (trainedModel) {
                    // TODO: TFS #1031791 We really don't have to do this if the trained model is a separate collection in our DataContract
                    // and makes processing more consistent and simpler. Once the backend is switching to the V2, we can deprecate all the related code 
                    // Create trained model if it is not previously created
                    if (trainedModelToPortTable[trainedModelId] === undefined) {
                        // Gets the layout info for DataSourceId
                        var layout = layoutTable[trainedModelId] || defaultLayout;
                        var trainedModelNode = experiment.addTrainedModel(trainedModel, layout.x, layout.y, trainedModelId);
                        // This same trained model node and port should be used for future usages of the same trained model.
                        trainedModelToPortTable[trainedModelId] = trainedModelNode.trainedModelPort;
                    }
                    // Create connection between DS::OutPort and InputPort
                    trainedModelToPortTable[trainedModelId].connectTo(inputPort);
                    trainedModelAddedPromise.resolve();
                }).fail(function () {
                    trainedModelAddedPromise.reject(new Error("Trained model with id " + trainedModelId + " does not exist in your workspace."));
                });
                return trainedModelAddedPromise;
            }
            function processTransformModule(experiment, inputPort, transformModuleId, transformModulesCache, layoutTable, transformModuleToPortTable) {
                if (transformModuleId === null) {
                    return;
                }
                var transformModuleAddedPromise = $.Deferred();
                transformModulesCache.getItem(transformModuleId).done(function (transformModule) {
                    // Create transformation module if it is not previously created
                    if (transformModuleToPortTable[transformModuleId] === undefined) {
                        // Gets the layout info for DataSourceId
                        var layout = layoutTable[transformModuleId] || defaultLayout;
                        var transformModuleNode = experiment.addTransformModule(transformModule, layout.x, layout.y, transformModuleId);
                        // This same transformation module node and port should be used for future usages of the same transformation module.
                        transformModuleToPortTable[transformModuleId] = transformModuleNode.transformPort;
                    }
                    // Create connection between DS::OutPort and InputPort
                    transformModuleToPortTable[transformModuleId].connectTo(inputPort);
                    transformModuleAddedPromise.resolve();
                }).fail(function () {
                    transformModuleAddedPromise.reject(new Error("Transformation module with id " + transformModuleId + " does not exist in your workspace."));
                });
                return transformModuleAddedPromise;
            }
            /**
              * Traverses through all module parameters and deserializes their values from an array of parameter values.
              * @param {Model.IModuleNodeParameterMap} parameters the collection of parameters to deserialize
              * @param {IModuleNodeParameter[]} serializedModuleParameters the array containing serialized parameter values
              * @param {{[string]: Model.WebServiceParameter;}} webServiceParameters array containing web service parameters
             **/
            function deserializeModuleParameters(parameters, serializedModuleParameters, webServiceParameters) {
                DataLab.Util.forEach(parameters, function (parameter) {
                    // For each parameter in this level, find all IModuleNodeParameter with matching name.
                    var matchingModuleParameters = serializedModuleParameters.filter(function (entry) {
                        return (entry.Name === parameter.name);
                    });
                    if (matchingModuleParameters.length === 0) {
                        if (!parameter.descriptor.isOptional) {
                            DataLab.Log.error("No value exist for module parameter with name " + parameter.name + ".");
                        }
                        return;
                    }
                    if (matchingModuleParameters.length > 1) {
                        DataLab.Log.error("Multiple values exist for module parameter with name " + parameter.name + ".");
                    }
                    // Determine if the parameter value is dependent on an web service parameter.
                    var moduleParameter = matchingModuleParameters[0];
                    if (moduleParameter.ValueType === DataContract.ModuleParameterValueType.GraphParameterName) {
                        // Found old experiment parameter which is no longer supported
                        // Pass the value to module parameter and change module parameter back to literal parameter
                        if (!(moduleParameter.Value in webServiceParameters)) {
                            DataLab.Log.error("Module node references an unknown experiment-level parameter.");
                            return;
                        }
                        webServiceParameters[moduleParameter.Value].isExperimentParameter = true;
                        moduleParameter.ValueType = DataContract.ModuleParameterValueType.Literal;
                        moduleParameter.Value = webServiceParameters[moduleParameter.Value].value();
                    }
                    parameter.value(moduleParameter.Value);
                    if (moduleParameter.LinkedGlobalParameter) {
                        if (!(moduleParameter.LinkedGlobalParameter in webServiceParameters)) {
                            DataLab.Log.error("Module node references an unknown web service parameter.");
                            return;
                        }
                        parameter.linkToWebServiceParameter(webServiceParameters[moduleParameter.LinkedGlobalParameter]);
                    }
                    // If this is a mode parameter, deserialize all child parameters which are relevant.
                    if (parameter.descriptor instanceof DataLab.Model.ModeModuleParameterDescriptor) {
                        var relevantChildParameters = parameter.childParameters[parameter.value()];
                        // If parameter name was changed in a newer version of the module, do not deserialize the children of the obsolete parameter
                        if (relevantChildParameters) {
                            deserializeModuleParameters(relevantChildParameters, serializedModuleParameters, webServiceParameters);
                        }
                    }
                });
            }
            // TODO: TFS #1020540 this code should be deprecated once we have the new layout data format.
            // It exists to support legacy layout.
            function parseLegacyLayoutData(layoutData) {
                /*
                <?xml version="1.0" encoding="utf-16"?>
                    <DataV1 xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                      <Meta />
                      <NodePositions>
                        <NodePosition Node="b90435290b064b26ae2bd45588687a0d.991fe4b65cdb4b919d4a9f22ad6ba89a" Position="373,53,200,60" />
                        <NodePosition Node="b90435290b064b26ae2bd45588687a0d.65dfc668b241461a91ad6d7527b3f331" Position="631,55,200,60" />
                        <NodePosition Node="80304a33" Position="511,222,200,60" />
                        <NodePosition Node="1e4f5b73" Position="513,356,200,60" />
                      </NodePositions>
                      <NodePositions2>
                        <NodePosition2 Node="b90435290b064b26ae2bd45588687a0d.991fe4b65cdb4b919d4a9f22ad6ba89a" nid="" Position="373,53,200,60" ConnectedTo="80304a33" />
                        <NodePosition2 Node="b90435290b064b26ae2bd45588687a0d.65dfc668b241461a91ad6d7527b3f331" nid="" Position="631,55,200,60" ConnectedTo="80304a33" />
                        <NodePosition2 Node="80304a33" Position="511,222,200,60" ConnectedTo="" />
                        <NodePosition2 Node="1e4f5b73" Position="513,356,200,60" ConnectedTo="" />
                      </NodePositions2>
                      <NodeGroups />
                    </DataV1>
                */
                try {
                    var layoutTable = {};
                    var layoutXml = $.parseXML(layoutData);
                    var nodePositions = layoutXml.querySelectorAll("DataV1 > NodePositions > NodePosition");
                    // Since querySelectorAll returns NodeList, forEach does not work
                    // without this work around. Source:https://developer.mozilla.org/en-US/docs/DOM/NodeList.
                    var forEach = Array.prototype.forEach;
                    forEach.call(nodePositions, function (nodePosition) {
                        var id = nodePosition.getAttribute("Node");
                        var layoutStr = nodePosition.getAttribute("Position");
                        var layoutTokens = layoutStr.split(',');
                        if (layoutTokens.length !== 4) {
                            throw new Error("Invalid layout data, expected Position=\"x,x,x,x\", read: " + layoutStr);
                        }
                        // Index the position keyed by nodeId
                        layoutTable[id] = {
                            x: parseInt(layoutTokens[0]),
                            y: parseInt(layoutTokens[1]),
                            width: parseInt(layoutTokens[2]),
                            height: parseInt(layoutTokens[3])
                        };
                    });
                    return layoutTable;
                }
                catch (ex) {
                    DataLab.Log.exception(ex, "Failed to parse layout data.", "parseLegacyLayoutData");
                    return {};
                }
            }
            function addWebServicePort(experimentModel, portLookupTable, port, type, layoutTable, dataTypeRegistry) {
                var connectedPort = portLookupTable[port.PortId];
                if (!connectedPort) {
                    DataLab.Log.warn("Can't find publish port from port lookup table. It can happens if node id or port name are changed for some reason. User has to reset publish ports again.");
                    return;
                }
                var x = 0, y = 0;
                var layout = layoutTable[port.Id];
                if (!layout) {
                    layout = getDefaultLayout(experimentModel, connectedPort, type);
                }
                x = layout.x;
                y = layout.y;
                experimentModel.addWebServicePort(type, x, y, port.Id, dataTypeRegistry, connectedPort, port.Name);
            }
            function getDefaultLayout(experimentModel, connectedPort, type) {
                var layout = {
                    x: connectedPort ? connectedPort.parent.x() : 0,
                    y: 0
                };
                var yArray = DataLab.Util.map(DataLab.Util.values(experimentModel.nodes()), function (node) { return node.y(); });
                if (yArray && yArray.length) {
                    if (type == 0 /* Input */) {
                        layout.y = Math.min.apply(null, yArray) - 77;
                    }
                    else {
                        layout.y = Math.max.apply(null, yArray) + 77;
                    }
                }
                return layout;
            }
        })(v1 = DataContract.v1 || (DataContract.v1 = {}));
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Model/Experiment.ts" />
/// <reference path="../ClientCache.ts" />
/// <reference path="DataContractInterfaces-v2.ts" />
/// <reference path="DataContractInterfaces-v1.ts" />
/// <reference path="Deserializer-v1.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        function deserializeExperiment(experiment, applicationCache, workspace) {
            if (experiment.SchemaVersion === 1.0) {
                return DataContract.v1.deserializeExperiment(experiment, applicationCache.moduleCache, applicationCache.datasetCache, applicationCache.trainedModelCache, applicationCache.transformModulesCache, applicationCache.dataTypeRegistry, workspace);
            }
            else if (experiment.SchemaVersion === 2.0) {
                throw new Error("Schema version > 2 not implemented");
            }
        }
        DataContract.deserializeExperiment = deserializeExperiment;
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

var DataLab;
(function (DataLab) {
    var WorkspaceManagement;
    (function (WorkspaceManagement) {
        (function (InvitationStatus) {
            InvitationStatus[InvitationStatus["Invited"] = 0] = "Invited";
            InvitationStatus[InvitationStatus["Active"] = 1] = "Active";
        })(WorkspaceManagement.InvitationStatus || (WorkspaceManagement.InvitationStatus = {}));
        var InvitationStatus = WorkspaceManagement.InvitationStatus;
    })(WorkspaceManagement = DataLab.WorkspaceManagement || (DataLab.WorkspaceManagement = {}));
})(DataLab || (DataLab = {}));

var DataLab;
(function (DataLab) {
    var OnlineSearch;
    (function (OnlineSearch) {
        ;
        ;
        ;
        (function (TaskStatusCode) {
            TaskStatusCode[TaskStatusCode["NotStarted"] = 0] = "NotStarted";
            TaskStatusCode[TaskStatusCode["InDraft"] = 1] = "InDraft";
            TaskStatusCode[TaskStatusCode["Running"] = 2] = "Running";
            TaskStatusCode[TaskStatusCode["Failed"] = 3] = "Failed";
            TaskStatusCode[TaskStatusCode["Finished"] = 4] = "Finished";
            TaskStatusCode[TaskStatusCode["Canceled"] = 5] = "Canceled";
        })(OnlineSearch.TaskStatusCode || (OnlineSearch.TaskStatusCode = {}));
        var TaskStatusCode = OnlineSearch.TaskStatusCode;
    })(OnlineSearch = DataLab.OnlineSearch || (DataLab.OnlineSearch = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../../Global.refs.ts" />
/// <reference path="Common.ts" />
/// <reference path="../DataContractInterfaces-v1.ts" />
/// <reference path="../DataLabClient.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        (function (ModelPackageStatusCode) {
            ModelPackageStatusCode[ModelPackageStatusCode["InTesting"] = 0] = "InTesting";
            ModelPackageStatusCode[ModelPackageStatusCode["ReadyForProduction"] = 1] = "ReadyForProduction";
            ModelPackageStatusCode[ModelPackageStatusCode["DeployedToProduction"] = 2] = "DeployedToProduction";
            ModelPackageStatusCode[ModelPackageStatusCode["Retired"] = 3] = "Retired";
        })(DataContract.ModelPackageStatusCode || (DataContract.ModelPackageStatusCode = {}));
        var ModelPackageStatusCode = DataContract.ModelPackageStatusCode;
        (function (DiagnosticsTraceLevel) {
            DiagnosticsTraceLevel[DiagnosticsTraceLevel["None"] = "None"] = "None";
            DiagnosticsTraceLevel[DiagnosticsTraceLevel["Error"] = "Error"] = "Error";
            DiagnosticsTraceLevel[DiagnosticsTraceLevel["All"] = "All"] = "All";
        })(DataContract.DiagnosticsTraceLevel || (DataContract.DiagnosticsTraceLevel = {}));
        var DiagnosticsTraceLevel = DataContract.DiagnosticsTraceLevel;
        (function (WebServiceType) {
            WebServiceType[WebServiceType["Staging"] = "Staging"] = "Staging";
            WebServiceType[WebServiceType["Production"] = "Production"] = "Production";
        })(DataContract.WebServiceType || (DataContract.WebServiceType = {}));
        var WebServiceType = DataContract.WebServiceType;
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="DataLabClient.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        var BlobUploader = (function () {
            function BlobUploader(client, blob, dataTypeId) {
                this.client = client;
                this.blob = blob;
                this.dataTypeId = dataTypeId;
                this.chunkSize = 4 * 1024 * 1024; // Chunk size = 4MB
                this.numberOfChunks = 0;
                this.chunkId = 0;
                this.bytesRemaining = 0;
                this.currentPosition = 0;
                this.maxRetries = 3;
                this.retryAfterSeconds = 20; // retry after 20 seconds
                this.numberOfRetries = 0;
                this.started = false; // Currently a BlobUploader can be used only once
                var blobSize = this.blob.size;
                if (blobSize > 0) {
                    if (blobSize < this.chunkSize) {
                        this.chunkSize = blobSize;
                        this.numberOfChunks = 1;
                    }
                    this.bytesRemaining = blobSize;
                    if (blobSize % this.chunkSize == 0) {
                        this.numberOfChunks = blobSize / this.chunkSize;
                    }
                    else {
                        this.numberOfChunks = parseInt((blobSize / this.chunkSize).toString(), 10) + 1;
                    }
                }
                // Please note that the upload dialog checks against empty file.
            }
            BlobUploader.prototype.uploadBlobAsync = function () {
                if (!this.started) {
                    this.started = true;
                    this.promise = $.Deferred();
                    this.startUploadAsync();
                    return DataLab.Util.when(this.promise);
                }
                else {
                    var failedPromise = $.Deferred();
                    failedPromise.rejectWith(this.client, [new DataLab.Util.AjaxError("A BlobUploader can be used only once")]);
                    return DataLab.Util.when(failedPromise);
                }
            };
            BlobUploader.prototype.updateUploadProgress = function () {
                var progressStr = "block " + this.chunkId + " of total " + this.numberOfChunks;
                DataLab.Log.info("Upload progress: " + progressStr, "logUploadProgress", {
                    loaded: this.chunkId,
                    total: this.numberOfChunks,
                    determinateLength: true
                });
                var progress = $.extend(({}));
                progress.loaded = this.chunkId;
                progress.total = this.numberOfChunks;
                progress.lengthComputable = true;
                this.promise.notifyWith(this.client, [progress]);
            };
            // Initiate the upload
            BlobUploader.prototype.startUploadAsync = function () {
                var _this = this;
                var initializationPromise = this.client.initiateResourceUpload(this.dataTypeId);
                initializationPromise.done(function (result) {
                    _this.response = result;
                    // Start the upload in chunks
                    _this.uploadInChunksAsync();
                }).fail(function (error) {
                    _this.promise.rejectWith(_this.client, [error]);
                });
            };
            BlobUploader.prototype.uploadInChunksAsync = function () {
                var _this = this;
                var content;
                // Please note that the vendor prefixed Slice functions are in the versions older than the minimum ones AML supports 
                if (this.blob.slice) {
                    content = this.blob.slice(this.currentPosition, this.currentPosition + this.chunkSize);
                }
                else if (this.blob['webkitSlice']) {
                    content = this.blob['webkitSlice'](this.currentPosition, this.currentPosition + this.chunkSize);
                }
                else if (this.blob['mozSlice']) {
                    content = this.blob['mozSlice'](this.currentPosition, this.currentPosition + this.chunkSize);
                }
                else {
                    this.promise.rejectWith(this.client, [new DataLab.Util.AjaxError("Unsupported browser detected")]);
                    return;
                }
                var uploadPromise = this.client.uploadBlobChunk(content, this.dataTypeId, this.response.Id, this.chunkId, this.numberOfChunks);
                uploadPromise.done(function (result) {
                    _this.bytesRemaining -= _this.chunkSize;
                    _this.chunkId += 1;
                    _this.numberOfRetries = 0;
                    _this.updateUploadProgress();
                    if (_this.bytesRemaining <= 0) {
                        _this.currentPosition = _this.blob.size;
                        _this.bytesRemaining = 0;
                        _this.promise.resolveWith(_this.client, [_this.response]);
                    }
                    else {
                        _this.currentPosition += _this.chunkSize;
                        _this.uploadInChunksAsync();
                    }
                }).fail(function (error) {
                    var canRetry = _this.numberOfRetries < _this.maxRetries;
                    if (canRetry) {
                        ++_this.numberOfRetries;
                        setTimeout(function () {
                            _this.uploadInChunksAsync();
                        }, _this.retryAfterSeconds * 1000);
                    }
                    else {
                        _this.promise.rejectWith(_this.client, [error]);
                    }
                });
            };
            return BlobUploader;
        })();
        DataContract.BlobUploader = BlobUploader;
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="DataContractInterfaces-v1.ts" />
/// <reference path="Deserializer.ts" />
/// <reference path="Common/WorkspaceManagement.ts" />
/// <reference path="Common/OnlineSearchContracts.ts" />
/// <reference path="Common/WebServiceContracts.ts" />
/// <reference path="BlobUploader.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        var sendRequestTraceSource = "Client.sendRequest";
        var dataLabAccessTokenHeaderName = "DataLabAccessToken";
        // For indeterminate uploads (i.e. total length is not known), log progress when crossing a 5MB boundary.
        var indeterminateUploadLogIntervalInBytes = 1024 * 1024 * 5;
        // For known-size uploads, log progress when crossing a percentage milestone (e.g. ~10 messages if set to 0.1 == 10%).
        var determinateUploadLogIntervalPercentage = 0.2;
        // These are the values for the XHR responseType property. 'None' is nonstandard.
        // http://www.w3.org/TR/XMLHttpRequest2/#the-responsetype-attribute
        DataContract.ResponseType = {
            ArrayBuffer: 'arraybuffer',
            JSON: 'json',
            Blob: 'blob',
            Document: 'document',
            Text: 'text',
            // Non-standard. Used to indicate that no response is expected.
            None: 'none',
        };
        function ensureTrailingSlash(s) {
            return s + (s.charAt(s.length - 1) === '/' ? '' : '/');
        }
        function getAjaxResponseTraceData(xhr, url, isSecondAttempt) {
            return {
                status: xhr.status,
                statusText: xhr.statusText,
                // We can't use 'url' as the name here since AzureFX telemetry sets that (to window.location.href)
                requestUrl: url,
                requestId: xhr.getResponseHeader("x-ms-client-request-id"),
                isSecondAttempt: isSecondAttempt,
            };
        }
        function getAjaxRequestTraceData(xhr, url, isSecondAttempt) {
            return {
                // We can't use 'url' as the name here since AzureFX telemetry sets that (to window.location.href)
                requestUrl: url,
                isSecondAttempt: isSecondAttempt,
            };
        }
        /** Returns the equivalent of 'v instanceof Blob'. This is safe for IE9 and other browsers that don't support the File API. */
        function isBlob(v) {
            // TODO [1226319]: Remove this shim when the build agents use IE10.
            return window.Blob && v instanceof Blob;
        }
        /** Logs upload progress at fixed or percentage boundaries. The previousProgress parameter must be the 'loaded' property of the
            previous progress event (or 0). This adds a low-volume indication of progress to the logs. By the XHR2 spec, progress events
            will likely occur approximately every 50ms, which could otherwise result in a high log volume.
            http://www.w3.org/TR/XMLHttpRequest2/#make-upload-progress-notifications */
        function logUploadProgress(e, previousProgress) {
            var interval = e.lengthComputable ? (determinateUploadLogIntervalPercentage * e.total) : indeterminateUploadLogIntervalInBytes;
            if (Math.floor(previousProgress / interval) < Math.floor(e.loaded / interval)) {
                var progressStr = e.lengthComputable ? ((e.loaded / e.total * 100) + "% - " + e.loaded + " bytes") : (e.loaded + " bytes");
                DataLab.Log.info("Upload progress: " + progressStr, "logUploadProgress", {
                    loaded: e.loaded,
                    total: e.total,
                    determinateLength: e.lengthComputable
                });
            }
        }
        /** Maps a ResponseType to a value for the responseType field on an XHR (the 'native' response type.
            The mapping here must agree with the logic in getResponse. */
        function getNativeResponseType(responseType) {
            // The json responseType is not natively supported in most browsers. We do it ourselves with JSON.parse in getResponse.
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest?redirectlocale=en-US&redirectslug=DOM%2FXMLHttpRequest#Browser_Compatibility
            // None is just an alias for text. We use it to clarify when a text response vs. empty response is expected.
            if (responseType === DataContract.ResponseType.JSON || responseType === DataContract.ResponseType.None) {
                return DataContract.ResponseType.Text;
            }
            else {
                return responseType;
            }
        }
        function getResponse(xhr, responseType, url, isSecondAttempt) {
            // The meaning of xhr.response here depends on responseType. See http://www.w3.org/TR/XMLHttpRequest2/#the-response-attribute.
            // However, we do our own handling for the json responseType due to poor browser compatibility. See above.
            // TODO [1226319]: Remove the use of responseText when the build agents use IE10.
            if (responseType === DataContract.ResponseType.JSON) {
                try {
                    // getNativeResponseType should have resulted in the XHR getting a text response.
                    if (xhr.responseText) {
                        return JSON.parse(xhr.responseText);
                    }
                    else {
                        return "";
                    }
                }
                catch (e) {
                    // JSON parsing errors are often not informative in isolation. Here we log an error with context about the request. 
                    // This may result in two log messages(the error trace and an unhandled exception later).
                    var traceData = getAjaxResponseTraceData(xhr, url, isSecondAttempt);
                    var message = "Failed to deserialize an API response as JSON";
                    traceData.exception = String(e);
                    DataLab.Log.error(message, "getResponse", traceData);
                    throw new Error(message + ": " + String(e));
                }
            }
            else if (responseType === DataContract.ResponseType.Text) {
                // We need to use responseText here for IE9 compatibility.
                return xhr.responseText;
            }
            else if (responseType === DataContract.ResponseType.None) {
                return null;
            }
            else {
                return xhr.response;
            }
        }
        function statusIndicatesSuccess(status) {
            // IE before version 10 reports an incorrect status code for 204 (No Content), as returned by e.g. the UpdateWorkspace API.
            // http://blogs.msdn.com/b/ieinternals/archive/2009/07/23/the-ie8-native-xmlhttprequest-object.aspx
            if (status === 1223) {
                return true;
            }
            if (status >= 200 && status <= 299) {
                return true;
            }
            return false;
        }
        var Client = (function () {
            function Client(workspaceId, workspaceFriendlyName, authToken, redirectOn401) {
                if (authToken === void 0) { authToken = null; }
                if (redirectOn401 === void 0) { redirectOn401 = true; }
                /** Base URL used for sending requests to the service. By default, the service base URL
                    is /api/, which will result in requests being sent to the same domain. This property
                    can be changed after construction to affect subsequent requests. */
                this.serviceBaseAddress = "/api/";
                this.cachedAccessToken = null;
                /// <summary>
                ///   Creates a client for the given DataLab workspace. If an authorization token is provided, it will be sent to
                ///   the service on each call.
                /// </summary>
                this.authToken = authToken;
                this.redirectOn401 = redirectOn401;
                this.workspaceId = workspaceId;
                this.workspaceFriendlyName = workspaceFriendlyName;
            }
            // Sends an AJAX request to the MetaAnalytics service.
            Client.prototype.sendRequest = function (workspaceRelativeUrl, settings, additionalHeaders) {
                if (settings === void 0) { settings = {}; }
                if (additionalHeaders === void 0) { additionalHeaders = {}; }
                return this.sendRequestHelper(this.serviceBaseAddress, workspaceRelativeUrl, settings, additionalHeaders);
            };
            /** Sends an AJAX request.
                By default, the returned data is deserialized as JSON before being passed to any callbacks.
                @param {string} workspaceRealtiveUrl A URL relative to the workspace, i.e. X in /api/workspaces/<workspace id>/<relative url>
                @param {IRequestSettings} Optional request settings such as the data to send and HTTP method.
                @return {Util.Promise<any>} A promise for the completion of the request. If settings.reportUploadProgress is set, the promise will generate progress
                                       events (and so is more specifically a {Util.IProgressPromise}).
            */
            Client.prototype.sendRequestHelper = function (serviceBaseUrl, workspaceRelativeUrl, settings, additionalHeaders) {
                if (settings === void 0) { settings = {}; }
                if (additionalHeaders === void 0) { additionalHeaders = {}; }
                var deferred = $.Deferred();
                this.sendRequestHelperWithRetry(serviceBaseUrl, workspaceRelativeUrl, settings, additionalHeaders, deferred, false);
                // We want the caller to opt-out of request failures. See Util.when.
                return DataLab.Util.when(deferred.promise());
            };
            Client.prototype.sendRequestHelperWithRetry = function (serviceBaseUrl, workspaceRelativeUrl, settings, additionalHeaders, deferred, isSecondAttempt) {
                var _this = this;
                var baseUrl = ensureTrailingSlash(serviceBaseUrl) + "workspaces/" + this.workspaceId;
                workspaceRelativeUrl = (workspaceRelativeUrl.charAt(0) === '/' ? '' : '/') + workspaceRelativeUrl;
                var dataIsBlob = isBlob(settings.data);
                var serializeRequestDataAsJson = !dataIsBlob && (typeof settings.data !== "undefined");
                var headers = Object.create(additionalHeaders);
                // The service generates trace transfers from the client's session ID (if provided) to its own activities.
                // This allows getting an end-to-end trace for an entire client session.
                headers["x-ms-client-session-id"] = DataLab.Util.getSessionId();
                // Firefox deviates from the XHR spec and send an Accept header which wants XML. Here we force */*
                // as should be the default. Otherwise, the service might respond with XML instead of JSON.
                // http://www.w3.org/TR/XMLHttpRequest2/#the-send-method
                headers["Accept"] = "*/*";
                if (this.authToken) {
                    headers[dataLabAccessTokenHeaderName] = this.authToken;
                }
                // The service will sometimes send down an opaque access token which we should include in subsequent requests (until a new one is provided).
                if (this.cachedAccessToken) {
                    headers[dataLabAccessTokenHeaderName] = this.cachedAccessToken;
                }
                // A JSON Content-Type is required for the service to try to deserialize the request body as JSON, and also hints that the response should be in JSON.
                // In the event of a Blob, we let the browser pick a Content-Type. See http://www.w3.org/TR/XMLHttpRequest2/#the-send-method
                if (!dataIsBlob) {
                    headers['Content-Type'] = 'application/json;charset=UTF-8';
                }
                var antiforgeryToken = $('[name=__RequestVerificationToken]').val();
                if (antiforgeryToken) {
                    headers['__RequestVerificationToken'] = antiforgeryToken;
                }
                settings = $.extend({
                    type: 'GET',
                    // Returned data should be parsed as JSON by default.
                    responseType: DataContract.ResponseType.JSON,
                    reportUploadProgress: false,
                }, settings);
                var xhr = new XMLHttpRequest();
                var openTime = new Date();
                xhr.open(settings.type, baseUrl + workspaceRelativeUrl);
                xhr.responseType = getNativeResponseType(settings.responseType);
                DataLab.Util.forEach(headers, function (v, k) { return xhr.setRequestHeader(k, v); });
                var retryXHR = function () {
                    _this.sendRequestHelperWithRetry(serviceBaseUrl, workspaceRelativeUrl, settings, additionalHeaders, deferred, true);
                };
                var completeWithRequestError = function (message) {
                    var onerrorTime = new Date();
                    var messageWithUrl = message + " Error when requesting " + baseUrl + workspaceRelativeUrl + " Request opened: " + openTime.toISOString() + " Onerror called: " + onerrorTime.toISOString();
                    DataLab.Log.warn(messageWithUrl, sendRequestTraceSource, getAjaxRequestTraceData(xhr, workspaceRelativeUrl, isSecondAttempt));
                    if (isSecondAttempt) {
                        deferred.rejectWith(_this, [new DataLab.Util.AjaxError(messageWithUrl, xhr)]);
                    }
                    else {
                        retryXHR();
                    }
                };
                var completeWithResponseError = function () {
                    var message = "Service call failed. Error " + xhr.status + " (" + xhr.statusText + ") when requesting " + workspaceRelativeUrl;
                    DataLab.Log.warn(message, sendRequestTraceSource, getAjaxResponseTraceData(xhr, workspaceRelativeUrl, isSecondAttempt));
                    if (xhr.status === 401 && _this.redirectOn401) {
                        alert(DataLab.LocalizedResources.sessionExpired);
                        window.location.reload();
                    }
                    else if (isSecondAttempt) {
                        deferred.rejectWith(_this, [new DataLab.Util.AjaxError(message, xhr)]);
                    }
                    else {
                        retryXHR();
                    }
                };
                var completeSuccessfully = function () {
                    DataLab.Log.info("Service call finished successfully", sendRequestTraceSource, getAjaxResponseTraceData(xhr, workspaceRelativeUrl, isSecondAttempt));
                    var accessTokenHeader = xhr.getResponseHeader(dataLabAccessTokenHeaderName);
                    if (accessTokenHeader) {
                        _this.cachedAccessToken = accessTokenHeader;
                    }
                    var response = getResponse(xhr, settings.responseType, workspaceRelativeUrl, isSecondAttempt);
                    deferred.resolveWith(_this, [response]);
                };
                // Details of event order are available at http://www.w3.org/TR/XMLHttpRequest2/#the-send-method
                xhr.onabort = function () {
                    // Do not log the client initiated xhr abort exceptions. The client aborts the outstanding requests
                    // upon navigation.  The requests aborted by the client won't have any headers/data in the response that
                    // is typically added by the server/proxies/etc.
                    if (xhr.getAllResponseHeaders()) {
                        completeWithRequestError("Service call was aborted.");
                    }
                };
                xhr.onerror = function () {
                    completeWithRequestError("Service call failed due to a network error.");
                };
                xhr.ontimeout = function () {
                    completeWithRequestError("Service call failed due to a timeout.");
                };
                xhr.onload = function () {
                    if (statusIndicatesSuccess(xhr.status)) {
                        completeSuccessfully();
                    }
                    else {
                        completeWithResponseError();
                    }
                };
                if (settings.reportUploadProgress && xhr.upload) {
                    var previousProgress = 0;
                    xhr.upload.onprogress = function (e) {
                        logUploadProgress(e, previousProgress);
                        previousProgress = e.loaded;
                        deferred.notifyWith(_this, [e]);
                    };
                }
                // We can begin communication now that all event handlers have been installed.
                if (serializeRequestDataAsJson) {
                    xhr.send(JSON.stringify(settings.data));
                }
                else if (dataIsBlob) {
                    xhr.send(settings.data);
                }
                else if (typeof settings.data === 'undefined') {
                    xhr.send();
                }
                else {
                    throw new Error("Unhandled case for sending the request data.");
                }
            };
            Client.prototype.signOut = function () {
                return this.sendRequestHelper("/", Shell.Environment.getSignOutLink(), { type: "POST" });
            };
            Client.prototype.listDatasetsAsync = function () {
                return this.sendRequest('datasources');
            };
            Client.prototype.getDataset = function (guid) {
                return this.sendRequest('datasources/' + guid);
            };
            Client.prototype.deleteDatasetFamilyAsync = function (guid) {
                return this.sendRequest('datasources/family/' + guid, {
                    type: "DELETE",
                    responseType: DataContract.ResponseType.None,
                });
            };
            Client.prototype.getTrainedModel = function (guid) {
                return this.sendRequest('trainedmodels/' + guid);
            };
            Client.prototype.listTrainedModelsAsync = function () {
                return this.sendRequest('trainedmodels/');
            };
            Client.prototype.deleteTrainedModelFamilyAsync = function (guid) {
                return this.sendRequest('trainedmodels/family/' + guid, {
                    type: "DELETE",
                    responseType: DataContract.ResponseType.None,
                });
            };
            Client.prototype.getTransformModule = function (guid) {
                return this.sendRequest('transformmodules/' + guid);
            };
            Client.prototype.listTransformModulesAsync = function () {
                return this.sendRequest('transformmodules/');
            };
            Client.prototype.listModulesAsync = function () {
                return this.sendRequest('modules');
            };
            Client.prototype.getModule = function (guid) {
                return this.sendRequest('modules/' + guid);
            };
            Client.prototype.listWorkspacesAsync = function () {
                return this.sendRequest('listworkspaces');
            };
            Client.prototype.createExperimentStoragePackageAsync = function (experimentId, clearCredentials, newExperimentName) {
                var request;
                if (newExperimentName) {
                    request = this.generateRequestURI('packages', { 'experimentId': experimentId, 'clearCredentials': String(clearCredentials), 'newExperimentName': newExperimentName });
                }
                else {
                    request = this.generateRequestURI('packages', { 'experimentId': experimentId, 'clearCredentials': String(clearCredentials) });
                }
                return this.sendRequest(request, {
                    type: "POST"
                });
            };
            Client.prototype.getExperimentStoragePackageAsync = function (storagePackageId) {
                var request = this.generateRequestURI('packages', { 'packageUri': storagePackageId });
                return this.sendRequest(request);
            };
            Client.prototype.createExperimentFromStoragePackageAsync = function (workspaceId, packageUri) {
                return this.sendRequest('packages' + '?workspaceId=' + encodeURIComponent(workspaceId) + '&packageUri=' + encodeURIComponent(packageUri), { type: "PUT" });
            };
            Client.prototype.getSingleUserAsync = function (userId) {
                return this.sendRequest('users/' + userId);
            };
            Client.prototype.listUsersAndInvitationsAsync = function () {
                return this.sendRequest('users');
            };
            Client.prototype.removeUser = function (userId) {
                return this.sendRequest('users/' + userId, {
                    type: "DELETE",
                    responseType: DataContract.ResponseType.None,
                });
            };
            Client.prototype.sendInvitation = function (invitation) {
                return this.sendRequest('invitations', { type: "POST", data: invitation });
            };
            Client.prototype.acceptInvitation = function (token) {
                return this.sendRequest('invitations?token=' + token, {
                    type: "PUT",
                    responseType: DataContract.ResponseType.None,
                });
            };
            Client.prototype.removeInvitation = function (invitationId) {
                return this.sendRequest('invitations?token=' + invitationId, {
                    type: "DELETE",
                    responseType: DataContract.ResponseType.None,
                });
            };
            Client.prototype.listCredentials = function () {
                return this.sendRequest('credentials');
            };
            Client.prototype.verifyCredential = function (keyParts) {
                return this.sendRequest('credentials', { type: "POST", data: keyParts });
            };
            Client.prototype.deleteCredential = function (keyParts) {
                return this.sendRequest('credentials', { type: "DELETE", data: keyParts });
            };
            Client.prototype.saveCredential = function (instance) {
                return this.sendRequest('credentials', { type: "PUT", data: instance });
            };
            Client.prototype.ssimSearch = function (searchQuery, page, pageSize) {
                if (page === void 0) { page = 1; }
                if (pageSize === void 0) { pageSize = 10; }
                return this.sendRequest('ssimdata?searchTerm=' + searchQuery + "&page=" + page + "&pageSize=" + pageSize);
            };
            Client.prototype.saveSsimData = function (request) {
                return this.sendRequest('ssimdata', { type: "PUT", data: request });
            };
            Client.prototype.listDataImports = function () {
                return this.sendRequest('dataimports');
            };
            Client.prototype.getDataImport = function (dataImportId) {
                return this.sendRequest("dataimport/" + dataImportId);
            };
            Client.prototype.deleteDataImport = function (dataImportId) {
                return this.sendRequest("dataimport/" + dataImportId, { type: "DELETE" });
            };
            Client.prototype.listExperimentsAsync = function (filters) {
                if (filters === void 0) { filters = {}; }
                // We want includeNonLeaf and includeArchived to be false by default, which is conveniently the boolean value of undefined.
                filters.includeNonLeaf = Boolean(filters.includeNonLeaf);
                filters.includeArchived = Boolean(filters.includeArchived);
                var request = this.generateRequestURI("experiments", { "includeNonLeaf": String(filters.includeNonLeaf), "includeArchived": String(filters.includeArchived) });
                return this.sendRequest(request).done(function (experimentList) {
                    experimentList.forEach(function (experiment) {
                        DataLab.Util.replaceJsonDates(experiment.Status, ['CreationTime', 'StartTime', 'EndTime']);
                    });
                });
            };
            Client.prototype.generateRequestURI = function (relativeURI, options) {
                var result = relativeURI;
                var numOptions = DataLab.Util.size(options);
                if (numOptions != 0) {
                    result += "?";
                    var arguments = DataLab.Util.map(options, function (value, key, obj) {
                        return key + "=" + encodeURIComponent(value);
                    });
                    result += arguments.join("&");
                }
                return result;
            };
            Client.prototype.listDataflowsAsync = function () {
                return this.sendRequest('dataflows');
            };
            Client.prototype.getExperimentAsync = function (experimentId) {
                return this.sendRequest('experiments/' + experimentId);
            };
            Client.prototype.getExperimentLineageAsync = function (experimentId) {
                return this.sendRequest('experiments/' + experimentId + '/lineage').done(function (experimentList) {
                    experimentList.forEach(function (experiment) {
                        DataLab.Util.replaceJsonDates(experiment.Status, ['CreationTime', 'StartTime', 'EndTime']);
                    });
                });
            };
            Client.prototype.getDataflowAsync = function (dataflowId) {
                return this.sendRequest('dataflows/' + dataflowId);
            };
            Client.prototype.createWebServiceGroupAsync = function (addWebServiceGroupRequest) {
                return this.sendRequest('webservicegroups/', {
                    type: 'POST',
                    data: addWebServiceGroupRequest,
                });
            };
            Client.prototype.getWebServiceGroupAsync = function (webServiceGroupId) {
                return this.sendRequest('webservicegroups/' + webServiceGroupId);
            };
            Client.prototype.deleteWebServiceGroupAsync = function (webServiceGroupId) {
                return this.sendRequest('webservicegroups/' + webServiceGroupId, {
                    type: "DELETE"
                });
            };
            Client.prototype.updateWebServiceGroupAsync = function (webServiceGroupId, updateWebServiceGroupRequest) {
                if (updateWebServiceGroupRequest === undefined) {
                    throw "Expected an IAddOrUpdateWebServiceGroupRequest";
                }
                return this.sendRequest('webservicegroups/' + webServiceGroupId, {
                    type: "PUT",
                    data: updateWebServiceGroupRequest
                });
            };
            Client.prototype.listWebServiceGroupsAsync = function () {
                return this.sendRequest('webservicegroups/');
            };
            Client.prototype.registerModelPackageAsync = function (webServiceGroupId, addModelPackageRequest) {
                if (addModelPackageRequest === undefined) {
                    throw "Expected an IAddModelPackageRequest";
                }
                return this.sendRequest('webservicegroups/' + webServiceGroupId + '/modelpackages/', {
                    type: 'POST',
                    data: addModelPackageRequest
                });
            };
            Client.prototype.listModelPackagesAsync = function (webServiceGroupId) {
                return this.sendRequest('webservicegroups/' + webServiceGroupId + '/modelpackages/');
            };
            Client.prototype.getModelPackageAsync = function (webServiceGroupId, modelPackageId) {
                return this.sendRequest('webservicegroups/' + webServiceGroupId + '/modelpackages/' + modelPackageId);
            };
            Client.prototype.updateModelPackageAsync = function (webServiceGroupId, modelPackageId, updateModelPackageRequest) {
                if (updateModelPackageRequest === undefined) {
                    throw "Expected an IUpdateModelPackageRequest";
                }
                return this.sendRequest('webservicegroups/' + webServiceGroupId + '/modelpackages/' + modelPackageId, {
                    type: 'PUT',
                    data: updateModelPackageRequest
                });
            };
            Client.prototype.registerWebServiceAsync = function (webServiceGroupId, registerWebServiceRequest) {
                if (registerWebServiceRequest === undefined) {
                    throw "Expected an IAddUpdateWebServiceRequest";
                }
                return this.sendRequest('webservicegroups/' + webServiceGroupId + '/webservices/', {
                    type: 'POST',
                    data: registerWebServiceRequest
                });
            };
            Client.prototype.getWebServiceAsync = function (webServiceGroupId, webServiceId) {
                return this.sendRequest('webservicegroups/' + webServiceGroupId + '/webservices/' + webServiceId);
            };
            Client.prototype.updateWebServiceAsync = function (webServiceGroupId, webServiceId, updateWebServiceRequest) {
                if (updateWebServiceRequest === undefined) {
                    throw "Expected an IAddUpdateWebServiceRequest";
                }
                return this.sendRequest('webservicegroups/' + webServiceGroupId + '/webservices/' + webServiceId, {
                    type: 'PUT',
                    data: updateWebServiceRequest
                });
            };
            Client.prototype.invokeScoreWebServiceAsync = function (webServiceGroupId, webServiceId, featureVector, globalParameters) {
                // TODO: 2107669 the format is from Ritwik, we need to figure out what purpose of Id and GlobalParameters
                return this.sendRequest('webservicegroups/' + webServiceGroupId + '/webservices/' + webServiceId + "/score", {
                    type: 'POST',
                    data: {
                        "Id": "scoring0002",
                        "Instance": {
                            "FeatureVector": featureVector,
                            "GlobalParameters": globalParameters
                        }
                    }
                });
            };
            Client.prototype.createCommunityExperimentAsync = function (request, packageUri) {
                return this.sendRequest('packages' + '?packageUri=' + encodeURIComponent(packageUri), {
                    type: 'POST',
                    data: request.PublishableExperiment
                });
            };
            Client.prototype.getCommunityExperimentIdAsync = function (workspaceId, packageUri, communityUri) {
                return this.sendRequest('packages' + '?workspaceId=' + encodeURIComponent(workspaceId) + '&packageUri=' + encodeURIComponent(packageUri) + '&communityUri=' + encodeURIComponent(communityUri), { type: "PUT" });
            };
            Client.prototype.listDataTypesAsync = function () {
                return this.sendRequest('datatypes');
            };
            Client.prototype.publishExperimentAsync = function (publishExperimentRequest) {
                if (publishExperimentRequest === undefined) {
                    throw "Expected an experiment publishing request";
                }
                return this.sendRequest('dataflows', {
                    type: 'POST',
                    data: publishExperimentRequest,
                });
            };
            Client.prototype.submitExperimentAsync = function (submitExperimentRequest) {
                if (submitExperimentRequest === undefined) {
                    throw "Expected an experiment submission request";
                }
                return this.sendRequest('experiments', {
                    type: 'POST',
                    data: submitExperimentRequest,
                });
            };
            Client.prototype.updateExperimentAsync = function (experimentId, eTag, submitExperimentRequest) {
                if (submitExperimentRequest === undefined) {
                    throw "Expected an experiment update request";
                }
                return this.sendRequest('experiments/' + experimentId, {
                    type: 'POST',
                    data: submitExperimentRequest,
                }, { "If-Match": eTag });
            };
            Client.prototype.deleteExperimentAsync = function (experimentId, eTag) {
                return this.sendRequest('experiments/' + experimentId + "?deleteAncestors=false", {
                    type: 'DELETE',
                }, { "If-Match": eTag });
            };
            Client.prototype.deleteExperimentAndAncestorsAsync = function (experimentId, eTag) {
                return this.sendRequest('experiments/' + experimentId + "?deleteAncestors=true", {
                    type: 'DELETE',
                }, { "If-Match": eTag });
            };
            Client.prototype.cancelExperimentAsync = function (experimentId) {
                return this.sendRequest('experiments/' + experimentId, { type: 'PUT' }, { 'x-ms-action': 'cancel' });
            };
            Client.prototype.promoteOutputToDatasetAsync = function (promoteDatasetRequest) {
                if (!promoteDatasetRequest) {
                    throw new Error("'promoteDatasetRequest' must be provided");
                }
                return this.addDatasetAsync(promoteDatasetRequest, DataContract.DataSourceOrigin.FromOutputPromotion);
            };
            Client.prototype.promoteOutputToTrainedModelAsync = function (promoteTrainedModelRequest) {
                if (!promoteTrainedModelRequest) {
                    throw new Error("'promoteTrainedModelRequest' must be provided");
                }
                return this.addTrainedModelAsync(promoteTrainedModelRequest, DataContract.DataSourceOrigin.FromOutputPromotion);
            };
            Client.prototype.promoteOutputToTransformModuleAsync = function (promoteTransformModuleRequest) {
                if (!promoteTransformModuleRequest) {
                    throw new Error("'promoteTransformModuleRequest' must be provided");
                }
                return this.addTransformModuleAsync(promoteTransformModuleRequest, DataContract.DataSourceOrigin.FromOutputPromotion);
            };
            Client.prototype.getModuleVisualizationData = function (experimentId, nodeId, portName) {
                return this.sendRequest(DataLab.Util.format('experiments/{0}/visualizationdata/{1}/{2}', experimentId, nodeId, portName));
            };
            Client.prototype.getModuleVisualizationDataItem = function (experimentId, nodeId, portName, item, type, subtype, parseAs) {
                return this.sendRequest(DataLab.Util.format('experiments/{0}/visualizationdata/{1}/{2}?item={3}&resourceType={4}&resourceSubType={5}', experimentId, nodeId, portName, encodeURIComponent(item), encodeURIComponent(type), encodeURIComponent(subtype)), { responseType: parseAs });
            };
            Client.prototype.getDatasetVisualizationData = function (datasetId) {
                return this.sendRequest(DataLab.Util.format('datasources/{0}/visualizationdata', datasetId));
            };
            Client.prototype.getModuleOutputSchema = function (experimentId, nodeId, portName) {
                return this.sendRequest(DataLab.Util.format('experiments/{0}/outputschema/{1}/{2}', experimentId, nodeId, portName));
            };
            Client.prototype.getDatasetSchema = function (datasetId) {
                return this.sendRequest(DataLab.Util.format('datasources/{0}/schema', datasetId));
            };
            Client.prototype.getModuleOutput = function (experimentId, nodeId, portName) {
                return this.sendRequest(DataLab.Util.format('experiments/{0}/outputdata/{1}/{2}', experimentId, nodeId, portName));
            };
            Client.prototype.getModuleErrorLog = function (experimentId, nodeId) {
                return this.sendRequest(DataLab.Util.format('experiments/{0}/errorlog/{1}', experimentId, nodeId), { responseType: "text" });
            };
            Client.prototype.commitResourceAsDatasetAsync = function (commitDatasetRequest) {
                if (!commitDatasetRequest) {
                    throw new Error("'commitDatasetRequest' must be provided");
                }
                commitDatasetRequest.ClientPoll = true;
                return this.addDatasetAsync(commitDatasetRequest, DataContract.DataSourceOrigin.FromResourceUpload);
            };
            Client.prototype.getResourceDependantsAsync = function (familyId) {
                return this.sendRequest(DataLab.Util.format('assets/{0}/experiments', familyId));
            };
            Client.prototype.buildResourceAsCustomModulePackageAsync = function (commitCustomModuleRequest) {
                var _this = this;
                if (!commitCustomModuleRequest) {
                    throw new Error("'commitCustomModulePackageRequest' must be provided");
                }
                commitCustomModuleRequest.ClientPoll = true;
                return DataLab.Util.then(this.sendRequest('modules/custom', {
                    type: 'POST',
                    data: commitCustomModuleRequest,
                }), function (activityId) {
                    return _this.pollCustomModuleIds(activityId);
                });
            };
            Client.prototype.getCustomModuleIds = function (activityId) {
                return this.sendRequest('modules/custom?activityGroupId=' + activityId, {
                    type: 'GET'
                });
            };
            Client.prototype.pollCustomModuleIds = function (activityId) {
                var pollInterval = 1000; // ms
                var timeout = 3600000; // ms 
                var result = $.Deferred();
                this.setupCustomModuleResponseHandler(activityId, this.getCustomModuleIds(activityId), result, pollInterval, 0, timeout);
                return DataLab.Util.when(result.promise());
            };
            Client.prototype.setupCustomModuleResponseHandler = function (activityId, fetch, result, interval, runtime, timeout) {
                var _this = this;
                fetch.done(function (fetched) {
                    DataLab.Log.info("polling activity with activityId = " + activityId + ".");
                    if (fetched === null) {
                        result.reject(new Error("Internal error"));
                    }
                    var status = fetched[0];
                    if (status === "Pending") {
                        DataLab.Log.info("custom module activity with activityId = " + activityId + " still pending, will poll again");
                        // Poll again
                        if (runtime < timeout) {
                            var newInterval = interval * 2 < 5000 ? interval * 2 : 5000;
                            setTimeout(function () {
                                _this.setupCustomModuleResponseHandler(activityId, _this.getCustomModuleIds(activityId), result, newInterval, runtime + interval, timeout);
                            }, newInterval);
                        }
                        else {
                            result.reject(new Error("Custom module registrartion exceeded maximum timout of " + timeout + " ms."));
                        }
                    }
                    else if (status === "Finished") {
                        DataLab.Log.info("custom module activity with activityId = " + activityId + " is finished, resolving");
                        result.resolve(fetched);
                    }
                    else if (status === "Failed") {
                        DataLab.Log.info("custom module activity with activityId = " + activityId + " failed, resolving");
                        result.resolve(fetched);
                    }
                    else {
                        result.reject(new Error("Internal error"));
                    }
                });
            };
            /** This corresponds to AddDatasource on the service. sourceOrigin must be an enum value from DataContract.DataSourceOrigin
                (e.g. FromOutputPromotion). A public variant exists for each supported origin that takes the additional origin-specific field,
                e.g. IAddDatasourceRequest_Promote. */
            Client.prototype.addDatasetAsync = function (addDatasetRequest, sourceOrigin) {
                if (!addDatasetRequest) {
                    throw new Error("'addDatasetRequest' must be provided");
                }
                // The behavior of the AddDatasSource API call is determined by the new DataSource's declared SourceOrigin.
                // The IExperimentDataset contract makes this field optional so that callers can omit it (it is implied by
                // choosing to call promoteDatasetAsync).
                if (!(sourceOrigin in DataContract.DataSourceOrigin)) {
                    throw new Error("sourceOrigin must be a member of DataContract.DataSourceOrigin");
                }
                addDatasetRequest.DataSource.SourceOrigin = sourceOrigin;
                return this.sendRequest('datasources', {
                    type: 'POST',
                    data: addDatasetRequest,
                });
            };
            Client.prototype.addTrainedModelAsync = function (addTrainedModelRequest, sourceOrigin) {
                if (!addTrainedModelRequest) {
                    throw new Error("'addTrainedModelRequest' must be provided");
                }
                if (!(sourceOrigin in DataContract.DataSourceOrigin)) {
                    throw new Error("sourceOrigin must be a member of DataContract.DataSourceOrigin");
                }
                addTrainedModelRequest.TrainedModel.SourceOrigin = sourceOrigin;
                return this.sendRequest('trainedmodels', {
                    type: 'POST',
                    data: addTrainedModelRequest,
                });
            };
            Client.prototype.addTransformModuleAsync = function (addTransformModuleRequest, sourceOrigin) {
                if (!addTransformModuleRequest) {
                    throw new Error("'addTransformModuleRequest' must be provided");
                }
                if (!(sourceOrigin in DataContract.DataSourceOrigin)) {
                    throw new Error("sourceOrigin must be a member of DataContract.DataSourceOrigin");
                }
                addTransformModuleRequest.Transform.SourceOrigin = sourceOrigin;
                return this.sendRequest('transformmodules', {
                    type: 'POST',
                    data: addTransformModuleRequest,
                });
            };
            Client.prototype.uploadResourceAsync = function (resource, dataTypeId) {
                if (DataLab.Features.chunkedUploadInStudioEnabled()) {
                    var uploader = new DataContract.BlobUploader(this, resource, dataTypeId);
                    return uploader.uploadBlobAsync();
                }
                else {
                    return this.sendRequestHelper(this.serviceBaseAddress + 'resourceuploads/', '?userStorage=true&dataTypeId=' + encodeURIComponent(dataTypeId), {
                        type: 'POST',
                        data: resource,
                        reportUploadProgress: true,
                    });
                }
            };
            Client.prototype.getWorkspaceSettingsAsync = function () {
                return this.sendRequest('');
            };
            Client.prototype.updateWorkspaceSettings = function (workspaceSettingsRequest) {
                if (workspaceSettingsRequest === undefined) {
                    throw "Expected a workspace settings update request";
                }
                return this.sendRequest('', {
                    type: 'POST',
                    data: workspaceSettingsRequest,
                    responseType: DataContract.ResponseType.None,
                });
            };
            Client.prototype.getJobInstance = function (jobId) {
                return this.sendRequest('executions/' + jobId);
            };
            Client.prototype.getStorageSpaceQuotaAsync = function () {
                return this.sendRequest('quota');
            };
            Client.prototype.getExperimentDetailsAsync = function (experimentId) {
                return this.sendRequest('/Experiments/' + encodeURIComponent(experimentId) + '/details');
            };
            Client.prototype.updateExperimentDetailsAsync = function (experimentId, details) {
                return this.sendRequest('/Experiments/' + encodeURIComponent(experimentId) + '/details', {
                    type: 'POST',
                    data: details
                });
            };
            Client.prototype.listProjects = function (experimentId) {
                if (experimentId === void 0) { experimentId = null; }
                var url;
                if (experimentId) {
                    url = DataLab.Util.format("projects?experimentId={0}", experimentId);
                }
                else {
                    url = "projects";
                }
                return this.sendRequest(url);
            };
            Client.prototype.createProject = function (request) {
                if (!request) {
                    throw "Expected AddOrUpdateProjectRequest has value";
                }
                return this.sendRequest("projects", {
                    type: "POST",
                    data: request
                });
            };
            Client.prototype.updateProject = function (projectId, request) {
                if (!request) {
                    throw "Expected AddOrUpdateProjectRequest has value";
                }
                return this.sendRequest(DataLab.Util.format("projects/{0}", projectId), {
                    type: "PUT",
                    data: request
                });
            };
            Client.prototype.initiateResourceUpload = function (dataTypeId) {
                return this.sendRequestHelper(this.serviceBaseAddress + 'resourceuploads/', '?userStorage=true&dataTypeId=' + encodeURIComponent(dataTypeId), {
                    type: 'POST',
                    reportUploadProgress: false,
                }, {});
            };
            Client.prototype.uploadBlobChunk = function (blobChunk, dataTypeId, uploadId, chunkId, numberOfChunks) {
                return this.sendRequestHelper(this.serviceBaseAddress + 'blobuploads/', '?numberOfBlocks=' + numberOfChunks.toString() + '&blockId=' + chunkId.toString() + '&uploadId=' + uploadId + '&dataTypeId=' + encodeURIComponent(dataTypeId), {
                    type: 'POST',
                    responseType: DataContract.ResponseType.JSON,
                    data: blobChunk,
                    reportUploadProgress: false,
                }, {});
            };
            return Client;
        })();
        DataContract.Client = Client;
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
/// <reference path="PromiseQueue.ts" />
/// <reference path="Model/Dataset.ts" />
/// <reference path="Model/Module.ts" />
/// <reference path="Model/TrainedModel.ts" />
/// <reference path="Model/Transform.ts" />
/// <reference path="Contracts/DataLabClient.ts" />
/// <reference path="Contracts/DataContractInterfaces-v1.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var ApplicationCache = (function () {
        /**
          * Creates a cache for modules, datasets, and datatypes.
          * The caches must be loaded with prefetch() before use.
          * @constructor
          * @this {ApplicationCache}
          * @param {IDatasetModuleClient} the backend client
         **/
        function ApplicationCache(client) {
            var _this = this;
            this.client = client;
            this.moduleCategoryRegistry = DataLab.observableMap();
            this.datasetCategoryRegistry = DataLab.observableMap();
            this.addCategory(DataLab.Constants.ResourceCategory.Dataset + "\\" + DataLab.LocalizedResources.datasetCategorySamples, this.datasetCategoryRegistry);
            this.addCategory(DataLab.Constants.ResourceCategory.Dataset + "\\" + DataLab.LocalizedResources.datasetCategoryUserCreated, this.datasetCategoryRegistry);
            var datasetBackend = this.createResourceBackend(function (id) { return _this.client.getDataset(id); }, function () { return _this.client.listDatasetsAsync(); }, function (contract) { return _this.deserializeDataset(contract); }, function (guid) { return _this.client.deleteDatasetFamilyAsync(guid); });
            this.datasetCache = new DatasetResourceCache(datasetBackend);
            var moduleBackend = this.createResourceBackend(function (id) { return _this.client.getModule(id); }, function () { return _this.client.listModulesAsync(); }, function (contract) { return _this.deserializeModule(contract); });
            this.moduleCache = new ResourceCache(moduleBackend);
            var trainedModelBackend = this.createResourceBackend(function (id) { return _this.client.getTrainedModel(id); }, function () { return _this.client.listTrainedModelsAsync(); }, function (contract) { return _this.deserializeTrainedModel(contract); }, function (guid) { return _this.client.deleteTrainedModelFamilyAsync(guid); });
            this.trainedModelCache = new ResourceCache(trainedModelBackend);
            var transformBackend = this.createResourceBackend(function (id) { return _this.client.getTransformModule(id); }, function () { return _this.client.listTransformModulesAsync(); }, function (contract) { return _this.deserializeTransformModule(contract); });
            this.transformModulesCache = new ResourceCache(transformBackend);
            this.dataTypeRegistry = Object.create(null);
            this.localPendingDatasets = ko.observableArray([]);
            this.datasetsPrefetched = ko.observable(false);
            this.modulesPrefetched = ko.observable(false);
            this.datatypesPrefetched = ko.observable(false);
            this.trainedModelsPrefetched = ko.observable(false);
            this.transformModulesPrefetched = ko.observable(false);
            this.allPrefetched = ko.computed(function () {
                return this.datasetsPrefetched() && this.modulesPrefetched() && this.trainedModelsPrefetched() && this.transformModulesPrefetched();
            }, this);
        }
        /**
          * Preloads the module, dataset, and datatype caches by fetching lists of each from the service.
         **/
        ApplicationCache.prototype.prefetch = function () {
            var _this = this;
            // We first initiate fetches for datatypes, datasets, and modules in parallel.
            var dataTypesPrefetched = this.client.listDataTypesAsync();
            var datasetsPrefetched = this.client.listDatasetsAsync();
            var modulesPrefetched = this.client.listModulesAsync();
            var trainedModelsPrefetched = this.client.listTrainedModelsAsync();
            var transformModulesPrefetched = this.client.listTransformModulesAsync();
            // Since datasets and module deserialization depends on the DataType registry,
            // we have to hold on to the fetched module and dataset contracts until the DataTypes
            // have definitely been loaded.
            var datasets;
            datasetsPrefetched.done(function (d) {
                datasets = d;
            });
            var modules;
            modulesPrefetched.done(function (d) {
                modules = d;
            });
            var trainedModels;
            trainedModelsPrefetched.done(function (t) {
                trainedModels = t;
            });
            var transformModules;
            transformModulesPrefetched.done(function (t) {
                transformModules = t;
            });
            // DataType deserialization has no dependencies, so we populate the registry as soon
            // as the contracts are returned.
            dataTypesPrefetched.done(function (dataTypes) {
                _this.dataTypeRegistry = new DataLab.Model.DataTypeRegistry(dataTypes.map(function (d) { return DataLab.DataContract.v1.deserializeDataType(d); }));
                _this.datatypesPrefetched(true);
            });
            // When all three calls have finished, we can deserialize the modules and datasets to populate the caches.
            // The 'done' callbacks above ensure that the module / dataset contracts and datatype registry will be
            // available at that point.
            var datasetsPrereqsPromise = DataLab.Util.when(datasetsPrefetched, dataTypesPrefetched);
            var modulesPrereqsPromise = DataLab.Util.when(modulesPrefetched, dataTypesPrefetched);
            var trainedModelsPrereqsPromise = DataLab.Util.when(trainedModelsPrefetched, dataTypesPrefetched);
            var transformModulesPrereqsPromise = DataLab.Util.when(transformModulesPrefetched, dataTypesPrefetched);
            this.datasetsPrefetchPromise = DataLab.Util.then(datasetsPrereqsPromise, function () {
                datasets.forEach(function (dataset) {
                    try {
                        var deserializedDataSet = _this.deserializeDataset(dataset);
                        if (deserializedDataSet.schemaStatus != null && deserializedDataSet.schemaStatus === DataLab.DataContract.SchemaStatus.Pending) {
                            _this.datasetCache.handlePendingInList(deserializedDataSet);
                            if (deserializedDataSet.id.lastIndexOf(_this.client.workspaceId, 0) === 0) {
                                var pendingDatasetPromise = _this.datasetCache.getPromiseForPendingItem(deserializedDataSet.id);
                                if (pendingDatasetPromise) {
                                    _this.localPendingDatasets.push({
                                        id: deserializedDataSet.id,
                                        name: deserializedDataSet.name(),
                                        promise: pendingDatasetPromise
                                    });
                                    (function (dataset, promise) {
                                        promise.always(function () {
                                            _this.localPendingDatasets.remove(function (pendingDataset) { return pendingDataset.id === dataset.id; });
                                        });
                                    })(deserializedDataSet, pendingDatasetPromise);
                                }
                            }
                        }
                        else {
                            _this.datasetCache.setItem(dataset.Id, deserializedDataSet);
                            if (deserializedDataSet.category) {
                                _this.addCategory(deserializedDataSet.category, _this.datasetCategoryRegistry);
                            }
                        }
                    }
                    catch (e) {
                        DataLab.Log.exception(e, "A dataset failed to deserialize while prefetching. It will be ignored.", "ApplicationCache.prefetch", { id: dataset.Id });
                    }
                });
                _this.datasetsPrefetched(true);
            });
            this.modulesPrefetchPromise = DataLab.Util.then(modulesPrereqsPromise, function () {
                modules.forEach(function (module_) {
                    try {
                        _this.moduleCache.setItem(module_.Id, _this.deserializeModule(module_));
                    }
                    catch (e) {
                        DataLab.Log.exception(e, "A module failed to deserialize while prefetching. It will be ignored.", "ApplicationCache.prefetch", { id: module_.Id });
                    }
                    // Populate list of module categories.
                    if (module_.Category) {
                        _this.addCategory(module_.Category, _this.moduleCategoryRegistry);
                    }
                });
                _this.modulesPrefetched(true);
            });
            this.trainedModelsPrefetchPromise = DataLab.Util.then(trainedModelsPrereqsPromise, function () {
                trainedModels.forEach(function (trainedModel_) {
                    try {
                        _this.trainedModelCache.setItem(trainedModel_.Id, _this.deserializeTrainedModel(trainedModel_));
                    }
                    catch (e) {
                        DataLab.Log.exception(e, "A trained model failed to deserialize while prefetching. It will be ignored.", "ApplicationCache.prefetch", { id: trainedModel_.Id });
                    }
                });
                _this.trainedModelsPrefetched(true);
            });
            this.transformModulesPrefetchPromise = DataLab.Util.then(transformModulesPrereqsPromise, function () {
                transformModules.forEach(function (transformModule_) {
                    try {
                        _this.transformModulesCache.setItem(transformModule_.Id, _this.deserializeTransformModule(transformModule_));
                    }
                    catch (e) {
                        DataLab.Log.exception(e, "A transform failed to deserialize while prefetching. It will be ignored.", "ApplicationCache.prefetch", { id: transformModule_.Id });
                    }
                });
                _this.transformModulesPrefetched(true);
            });
        };
        ApplicationCache.prototype.addCategory = function (category, registry, parentCategoryPath) {
            // Example: Adding A\B\C, assuming A is already in the registry and currently adding B\C.
            // category = "B\C"
            // registry[A] = null
            // parentCategoryPath = ["A"]
            // splitCategory = ["C"]
            // splitTopLevelCategory = ["A", "B"]
            // topLevelCategory = "A\B"
            if (parentCategoryPath === void 0) { parentCategoryPath = []; }
            var splitCategory = category.split('\\');
            var splitTopLevelCategory = parentCategoryPath.concat(splitCategory.splice(0, 1));
            var topLevelCategory = splitTopLevelCategory.join('\\');
            if (!registry.contains(topLevelCategory)) {
                var map = DataLab.observableMap();
                registry.put(topLevelCategory, map);
            }
            // If there are remaining child categories, add them too. (From example: add C)
            if (splitCategory.length > 0) {
                this.addCategory(splitCategory.join('\\'), registry.lookup(topLevelCategory), splitTopLevelCategory);
            }
        };
        ApplicationCache.prototype.createResourceBackend = function (getSerialized, listSerialized, deserialize, deleteFamily) {
            var _this = this;
            return {
                fetch: function (guid) {
                    _this.assertPrefetched();
                    var promise = DataLab.Util.then(getSerialized(guid), function (contract) {
                        return deserialize(contract);
                    });
                    return promise;
                },
                list: function () {
                    _this.assertPrefetched();
                    var promise = DataLab.Util.then(listSerialized(), function (contracts) {
                        var deserializedKvps = [];
                        contracts.forEach(function (contract) {
                            var resource;
                            try {
                                resource = deserialize(contract);
                                deserializedKvps.push({ key: resource.id, value: resource });
                            }
                            catch (e) {
                                DataLab.Log.exception(e, "A resource failed to deserialize while fetching items into a resource cache. It will be ignored.", "createResourceBackend", { id: contract.Id });
                            }
                        });
                        return deserializedKvps;
                    });
                    return promise;
                },
                deleteFamily: function (guid) {
                    if (deleteFamily) {
                        _this.assertPrefetched();
                        return deleteFamily(guid);
                    }
                    else {
                        return $.Deferred().reject(new Error("deleteFamily not implemented for this resource cache")).promise();
                    }
                }
            };
        };
        ApplicationCache.prototype.deserializeModule = function (moduleContract) {
            return DataLab.DataContract.deserializeModule(moduleContract, this.dataTypeRegistry);
        };
        ApplicationCache.prototype.deserializeDataset = function (datasetContract) {
            return DataLab.DataContract.deserializeDataset(datasetContract, this.dataTypeRegistry);
        };
        ApplicationCache.prototype.deserializeTrainedModel = function (trainedModelContract) {
            return DataLab.DataContract.deserializeTrainedModel(trainedModelContract, this.dataTypeRegistry);
        };
        ApplicationCache.prototype.deserializeTransformModule = function (transformModuleContract) {
            return DataLab.DataContract.deserializeTransformModule(transformModuleContract, this.dataTypeRegistry);
        };
        ApplicationCache.prototype.assertPrefetched = function () {
            if (!this.allPrefetched()) {
                throw new Error("Before using an ApplicationCache, prefetch() must have been called and completed.");
            }
        };
        return ApplicationCache;
    })();
    DataLab.ApplicationCache = ApplicationCache;
    /** A ClientCache represents a set of immutable entities, stored by key. Since each entity is assumed to be immutable,
        updates for existing keys are not allowed.

        A cache is backed by an {@see ICacheBackend}, which provides async 'fetch' and 'list' operations. On a cache miss,
        ({@see ClientCache.getItem}), a 'fetch' is issued to attempt to load the missing item (this implies that the caller
        knows a valid key ahead of time). A 'list' operation can be triggered via {@see ClientCache.loadNewItems}, which
        will store any newly seen items (existing keys are ignored due to the immutability assumption).
        */
    var ClientCache = (function () {
        /**
          * Creates a read-only data cache using strings to demark cache lines.
          * @constructor
          * @this {ClientCache}
          * @param {ICacheBackend} the backend used to fetch data that doesn't exist in cache
         */
        function ClientCache(backend) {
            this.data = DataLab.observableMap();
            // Promises for in-progress fetches are tracked to satisfy subsequent cache reads. See getItem.
            this.outstandingPromises = Object.create(null);
            this.backend = backend;
        }
        Object.defineProperty(ClientCache.prototype, "items", {
            /**
              * Returns a read-only observable map of items currently in the cache.
             */
            get: function () {
                return this.data;
            },
            enumerable: true,
            configurable: true
        });
        /**
          * Explicitly and immediately set the item associated with key. If the key already exists,
          * calling this results in an exception, as it violates the notion of a read-only cache. This
          * function is useful for prepopulating the cache without backend fetch operations.
          *
          * setItem is the only method which modifies the cache, so subclasses may override it to observe cache changes.
          *
          * @param {string} key The cache line to associate
          * @param {any} val The value to set
          * @throws {string} When the same line is written twice
         */
        ClientCache.prototype.setItem = function (key, val) {
            if (this.data.contains(key)) {
                throw new Error("Cannot overwrite cache lines. The given key already exists in the cache: " + key);
            }
            else if (this.updateIsPendingForKey(key)) {
                throw new Error("Cannot overwrite cache lines. A pending fetch for this key is in progress: " + key);
            }
            else {
                this.data.put(key, val);
            }
        };
        /**
          * Immediately returns the item in the cache if it exists. If not, it returns null.
          * This function will never invoke a backend fetch call.
          * @param {string} key The string for whose cache line to fetch
          * @return {any} The fetched cache line for key or null if the item isn't in the cache
         */
        ClientCache.prototype.getItemIfCached = function (key) {
            return this.data.contains(key) ? this.data.lookup(key) : null;
        };
        /**
          * Returns a jquery promise that will return the item associated with key. Values
          * are cached so only one backend request is ever issued for a given key. Concurrent
          * requests for the same item collapse into the same promise when the item is not
          * in the cache. When the item is in the cache, this returned promise resolves immediately.
          * @param {string} key The string for whose cache line to fetch
          * @return {JQueryPromise} The promise containing the value for the requested cache line when resolved.
         */
        ClientCache.prototype.getItem = function (key) {
            var _this = this;
            if (this.data.contains(key)) {
                return $.when(this.data.lookup(key));
            }
            else if (this.updateIsPendingForKey(key)) {
                // We satisfy subsequent requests for a key already being fetched with the existing fetch promise.
                // Fetches for the same key are redundant due to the immutability property.
                return this.outstandingPromises[key];
            }
            else {
                var fetchWasSatisfiedFromCache = false;
                var fetch = DataLab.Util.then(this.backend.fetch(key), function (fetched) {
                    // Though the key wasn't cached at the time we started the fetch, it may be by the
                    // time the fetch completes (e.g. due to a concurrent 'list' operation). In that case,
                    // we need to be sure to not replace the existing cache entry with a new instance
                    // (that would break our 'write once' guarantee).
                    if (_this.data.contains(key)) {
                        fetchWasSatisfiedFromCache = true;
                        return _this.data.lookup(key);
                    }
                    else {
                        return fetched;
                    }
                });
                this.outstandingPromises[key] = fetch;
                fetch.always(function () {
                    // Note that we install the always handler here after outstandingPromises has been updated
                    // so that 'delete' does the right thing if the promise has already completed synchronously.
                    delete _this.outstandingPromises[key];
                }).done(function (fetched) {
                    if (!fetchWasSatisfiedFromCache) {
                        _this.setItem(key, fetched);
                    }
                });
                return fetch;
            }
        };
        /**
          * Loads additional items into the cache based on the cache backend's 'list' operation. Note that
          * items will be added, but not removed (even if existing items do not appear in the returned list).
          *
          * @return {JQueryPromise} The promise containing the value for the requested cache line when resolved.
         */
        ClientCache.prototype.loadNewItems = function () {
            var _this = this;
            return this.backend.list().done(function (kvps) {
                _this.data.modify(function () {
                    kvps.forEach(function (kvp) {
                        if (!_this.getItemIfCached(kvp.key)) {
                            // A fetch may be outstanding for this key, but we have it already. The fetch will notice
                            // this when it completes.
                            delete _this.outstandingPromises[kvp.key];
                            _this.setItem(kvp.key, kvp.value);
                        }
                    });
                });
            });
        };
        ClientCache.prototype.clear = function () {
            this.data.clear();
        };
        ClientCache.prototype.updateIsPendingForKey = function (key) {
            return key in this.outstandingPromises;
        };
        return ClientCache;
    })();
    DataLab.ClientCache = ClientCache;
    /** A ResourceCache is a ClientCache which understands the version relationships of {@see DataLab.Model.Resource} instances.
        As with ClientCache, each cached entity is considered and assumed to be immutable. As an exception, the isLatest flag
        on each cached Resource is kept up to date as newer related resources (those with the same familyId) are added. */
    var ResourceCache = (function (_super) {
        __extends(ResourceCache, _super);
        function ResourceCache(backend) {
            _super.call(this, backend);
            /** Fired when a newer resource version has been added to a resource family. It has been marked as the latest version (isLatest() === true). */
            this.resourceFamilyUpdated = new ko.subscribable();
            this._backend = backend;
            this.latestResourceByFamily = Object.create(null);
        }
        /** Returns the latest resource in the given resource family. If there are no known resources in the family, returns null.
            Attempting to look up the latest resource in the null family (familyId === null) returns null. */
        ResourceCache.prototype.getLatestResourceInFamily = function (familyId) {
            return (familyId !== null && familyId in this.latestResourceByFamily) ? this.latestResourceByFamily[familyId] : null;
        };
        ResourceCache.prototype.setItem = function (key, val) {
            var familyLatestUpdated = false;
            // In the absence of a family ID, we act as if the module is unrelated to all others and is the 'latest'.
            if (val.familyId) {
                var existingResourceInFamily = this.latestResourceByFamily[val.familyId];
                var noExistingResource = !existingResourceInFamily;
                var existingResourceIsOlder = existingResourceInFamily && (existingResourceInFamily.serviceVersion < val.serviceVersion);
                var traceData = {
                    familyId: val.familyId,
                    newResourceId: val.id,
                    newResourceServiceVersion: val.serviceVersion,
                    newResourceName: val.name(),
                    existingResourceId: null,
                    existingResourceServiceVersion: null,
                    existingResourceName: null
                };
                if (existingResourceInFamily) {
                    traceData.existingResourceId = existingResourceInFamily.id;
                    traceData.existingResourceServiceVersion = existingResourceInFamily.serviceVersion;
                    traceData.existingResourceName = existingResourceInFamily.name();
                }
                if (existingResourceInFamily && existingResourceInFamily.serviceVersion == val.serviceVersion) {
                    throw new DataLab.Log.TracedException("Attempted to add a resource with the same version number as the latest version already cached for its family", "ResourceCache.setItem", traceData);
                }
                if (existingResourceIsOlder || noExistingResource) {
                    this.latestResourceByFamily[val.familyId] = val;
                }
                if (noExistingResource) {
                    DataLab.Log.info("A resource version has been added as the first in its family", "ResourceCache.setItem", traceData);
                    val.isLatest(true);
                    this.setIsLatestClientVersion(val, true);
                    familyLatestUpdated = true;
                }
                else if (existingResourceIsOlder) {
                    DataLab.Log.info("A new resource version has been received for an existing family", "ResourceCache.setItem", traceData);
                    existingResourceInFamily.isLatest(false);
                    this.updateIsLatestClientVersion(existingResourceInFamily, val);
                    val.isLatest(true);
                    this.setIsLatestClientVersion(val, true);
                    familyLatestUpdated = true;
                }
                else {
                    DataLab.Log.warn("A resource version is being added to the cache that is older than the latest in the family", "ResourceCache.setItem", traceData);
                    val.isLatest(false);
                    this.updateIsLatestClientVersion(val, existingResourceInFamily);
                }
            }
            // item added to cache at the end so that notifications take place after cache is in valid state
            _super.prototype.setItem.call(this, key, val);
            if (familyLatestUpdated) {
                this.resourceFamilyUpdated.notifySubscribers(val);
            }
        };
        // clear entries with matching family ID from cache and latest-resource-by-family pointer
        ResourceCache.prototype.removeFamilyFromCache = function (familyId) {
            var _this = this;
            var resources = this.items();
            var toBeRemovedKeys = [];
            for (var key in resources) {
                if (resources[key].familyId === familyId) {
                    toBeRemovedKeys.push(key);
                }
            }
            var latest = this.latestResourceByFamily[familyId];
            delete this.latestResourceByFamily[familyId];
            if (toBeRemovedKeys.length > 0) {
                this.items.modify(function () {
                    toBeRemovedKeys.forEach(function (key) { return _this.items.remove(key); });
                });
            }
            this.resourceFamilyUpdated.notifySubscribers(latest);
        };
        // requests the service to delete a resource family and updates the cache to reflect this
        ResourceCache.prototype.deleteFamily = function (familyId) {
            var _this = this;
            if (!this._backend.deleteFamily) {
                return $.Deferred().fail(new Error("not implemented")).promise();
            }
            var guid = familyId.split(".")[1] || familyId;
            var promise = this._backend.deleteFamily(guid);
            promise.done(function () {
                _this.removeFamilyFromCache(familyId);
            });
            return promise;
        };
        ResourceCache.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.latestResourceByFamily = Object.create(null);
            this.resourceFamilyUpdated.notifySubscribers(null);
        };
        ResourceCache.prototype.setIsLatestClientVersion = function (resource, isLatest) {
            if (resource instanceof DataLab.Model.Module) {
                // the intermediate cast to <any> is to work around a TypeScript limitation with casting generic types
                resource.isLatestClientVersion = isLatest;
            }
        };
        ResourceCache.prototype.updateIsLatestClientVersion = function (resource, other) {
            if (resource instanceof DataLab.Model.Module) {
                var mod = resource;
                var otherMod = other;
                var versionRe = /(^\d+)(\.\d+)*/;
                if (versionRe.test(mod.clientVersion) && versionRe.test(otherMod.clientVersion)) {
                    var modMajorVersion = parseInt(mod.clientVersion.match(versionRe)[1]);
                    var otherModMajorVersion = parseInt(otherMod.clientVersion.match(versionRe)[1]);
                    mod.isLatestClientVersion = (modMajorVersion >= otherModMajorVersion);
                }
            }
        };
        return ResourceCache;
    })(ClientCache);
    DataLab.ResourceCache = ResourceCache;
    /** A resource cache for datasets that filters data sources that have outstanding pending schema jobs.  This way,
        they do not show up in the palette until the schema job is complete */
    var DatasetResourceCache = (function () {
        function DatasetResourceCache(backend) {
            this.outstandingPromises = Object.create(null);
            this.pollInterval = 5000;
            this.maxPollInterval = 120000;
            this.maxSchemaJobWaitHours = 4;
            this.backend = backend;
            this.resourceCache = new ResourceCache(backend);
        }
        Object.defineProperty(DatasetResourceCache.prototype, "resourceFamilyUpdated", {
            // Pass through to the wrapped cache
            get: function () {
                return this.resourceCache.resourceFamilyUpdated;
            },
            set: function (value) {
                this.resourceCache.resourceFamilyUpdated = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DatasetResourceCache.prototype, "items", {
            get: function () {
                return this.resourceCache.items;
            },
            enumerable: true,
            configurable: true
        });
        DatasetResourceCache.prototype.getLatestResourceInFamily = function (familyId) {
            return this.resourceCache.getLatestResourceInFamily(familyId);
        };
        DatasetResourceCache.prototype.setItem = function (key, val) {
            this.resourceCache.setItem(key, val);
        };
        DatasetResourceCache.prototype.getItemIfCached = function (key) {
            return this.resourceCache.getItemIfCached(key);
        };
        // Return a promise that is resolved only when the data source schema job is not pending
        DatasetResourceCache.prototype.getItem = function (key) {
            DataLab.Log.info("dataset getItem() key = " + key);
            var cachedItem = this.getItemIfCached(key);
            if (cachedItem != null) {
                return $.when(cachedItem);
            }
            else if (key in this.outstandingPromises) {
                return this.outstandingPromises[key];
            }
            else {
                DataLab.Log.info("dataset getItem() key = " + key + " fetching from the service");
                var result = $.Deferred(); // TODO: handle failed request
                this.setupResponseHandler(key, this.backend.fetch(key), result, this.pollInterval);
                this.setupAfterActions(key, result);
                return result;
            }
        };
        // Filter data sources that are still pending
        DatasetResourceCache.prototype.loadNewItems = function () {
            var _this = this;
            return DataLab.Util.then(this.backend.list(), function (list) {
                var result = [];
                list.forEach(function (kvp) {
                    if (kvp.value.schemaStatus != null && kvp.value.schemaStatus === DataLab.DataContract.SchemaStatus.Pending) {
                        _this.handlePendingInList(kvp.value);
                    }
                    else {
                        if (!_this.getItemIfCached(kvp.key)) {
                            _this.setItem(kvp.key, kvp.value);
                        }
                        result.push(kvp.value);
                    }
                });
                return result;
            });
        };
        DatasetResourceCache.prototype.handlePendingInList = function (dataset) {
            var _this = this;
            if (this.okToPoll(dataset)) {
                var key = dataset.id;
                if (!(key in this.outstandingPromises)) {
                    var promise = $.Deferred();
                    setTimeout(function () {
                        _this.pollDataSource(key, promise, _this.pollInterval);
                    }, this.pollInterval);
                    this.setupAfterActions(key, promise);
                }
            }
        };
        DatasetResourceCache.prototype.getPromiseForPendingItem = function (key) {
            return this.outstandingPromises[key];
        };
        DatasetResourceCache.prototype.clear = function () {
            this.resourceCache.clear();
        };
        DatasetResourceCache.prototype.removeFamilyFromCache = function (familyId) {
            this.resourceCache.removeFamilyFromCache(familyId);
        };
        DatasetResourceCache.prototype.deleteFamily = function (familyId) {
            return this.resourceCache.deleteFamily(familyId);
        };
        DatasetResourceCache.prototype.okToPoll = function (dataset) {
            var created = dataset.created;
            var bound = new Date(created.getTime() + this.maxSchemaJobWaitHours * 60 * 60 * 1000);
            var current = new Date();
            DataLab.Log.info("okToPoll on id = " + dataset.id + "created = " + created.toString() + " bound = " + bound.toString() + " current time = " + current.toString());
            if (current.getTime() > bound.getTime()) {
                return false;
            }
            else {
                return true;
            }
        };
        DatasetResourceCache.prototype.pollDataSource = function (key, result, interval) {
            this.setupResponseHandler(key, this.backend.fetch(key), result, interval);
        };
        DatasetResourceCache.prototype.setupResponseHandler = function (key, fetch, result, interval) {
            var _this = this;
            fetch.done(function (fetched) {
                DataLab.Log.info("dataset getItem() key = " + key + " fetched from service");
                var cachedItem = _this.resourceCache.getItemIfCached(key);
                if (cachedItem != null) {
                    DataLab.Log.info("dataset getItem() key = " + key + " resolved from cache");
                    result.resolve(cachedItem);
                }
                else if (fetched != null && fetched.schemaStatus === DataLab.DataContract.SchemaStatus.Pending) {
                    DataLab.Log.info("dataset getItem() key = " + key + " schema still pending, will fetch again");
                    // Poll again
                    if (_this.okToPoll(fetched)) {
                        var newInterval = _this.computeBackoff(interval);
                        setTimeout(function () {
                            _this.pollDataSource(key, result, newInterval);
                        }, newInterval);
                    }
                    else {
                        result.reject(new Error("Upload timed out"));
                    }
                }
                else if (fetched == null || fetched.schemaStatus === DataLab.DataContract.SchemaStatus.Complete || fetched.schemaStatus === DataLab.DataContract.SchemaStatus.NotSupported) {
                    DataLab.Log.info("dataset getItem() key = " + key + " schema done, resolving");
                    result.resolve(fetched);
                }
                else if (fetched != null && fetched.schemaStatus === DataLab.DataContract.SchemaStatus.Failed) {
                    DataLab.Log.info("dataset getItem() key = " + key + " schema job failed, resolving");
                    result.resolve(fetched);
                }
                else if (fetched != null && !fetched.schemaStatus) {
                    result.resolve(fetched);
                }
                else {
                    result.reject(new Error("Internal error"));
                }
            }).fail(function (error) { return result.reject(error); });
        };
        DatasetResourceCache.prototype.computeBackoff = function (interval) {
            var result = interval * 2;
            return result > this.maxPollInterval ? this.maxPollInterval : result;
        };
        DatasetResourceCache.prototype.setupAfterActions = function (key, result) {
            var _this = this;
            this.outstandingPromises[key] = result;
            result.always(function () {
                // Note that we install the always handler here after outstandingPromises has been updated
                // so that 'delete' does the right thing if the promise has already completed synchronously.
                delete _this.outstandingPromises[key];
            }).done(function (fetched) {
                if (_this.getItemIfCached(fetched) == null) {
                    _this.setItem(key, fetched);
                }
            });
        };
        return DatasetResourceCache;
    })();
    DataLab.DatasetResourceCache = DatasetResourceCache;
})(DataLab || (DataLab = {}));

// This is the client-side counterpart for Microsoft.MetaAnalytics.Configuration.ClientConfiguration
var DataLab;
(function (DataLab) {
    var Configuration;
    (function (Configuration) {
        Configuration.ClientConfiguration = { AzureManagementPortalUrl: "" };
    })(Configuration = DataLab.Configuration || (DataLab.Configuration = {}));
})(DataLab || (DataLab = {}));

var DataLab;
(function (DataLab) {
    var ImageContent = (function () {
        function ImageContent(dataUrl, typeOrFile) {
            this.dataUrl = dataUrl;
            if (typeof typeOrFile === "string") {
                var type = typeOrFile;
                this.type = type;
                this.size = DataLab.Util.getBytesEncodedInBase64String(this.base64Text);
            }
            else {
                var file = typeOrFile;
                this.size = file.size;
                this.type = file.type;
            }
        }
        Object.defineProperty(ImageContent.prototype, "base64Text", {
            get: function () {
                return this.dataUrl.replace(/^.*?base64,/, "");
            },
            enumerable: true,
            configurable: true
        });
        return ImageContent;
    })();
    DataLab.ImageContent = ImageContent;
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
var DataLab;
(function (DataLab) {
    var Performance;
    (function (Performance) {
        "use strict";
        // singleton to manage resource timings
        var ResourceTimings;
        (function (ResourceTimings) {
            ResourceTimings.isEnabled = false;
            ResourceTimings.isSetBufferSizeSupported = false;
            ResourceTimings.beforeClearCallback = null;
            ResourceTimings.dataForFlush = null;
            ResourceTimings.doClearWhenAllSent = true;
            var _api = (window.performance) || {};
            var _data = [];
            var _fromIndex = 0;
            var _timeoutIdForSendResourceTiming = null;
            function clear() {
                if (ResourceTimings.beforeClearCallback) {
                    ResourceTimings.beforeClearCallback();
                }
                clearBuffer();
            }
            ResourceTimings.clear = clear;
            function send(data, retries, interval) {
                if (retries === void 0) { retries = 0; }
                if (interval === void 0) { interval = 1000; }
                var resources = _api.getEntriesByType("resource");
                var toIndex = resources.length;
                for (var index = _fromIndex; index < toIndex; ++index) {
                    _data[index] = data;
                }
                _fromIndex = toIndex;
                sendHelper(toIndex, retries, interval);
            }
            ResourceTimings.send = send;
            function flush() {
                send(ResourceTimings.dataForFlush, 0);
            }
            ResourceTimings.flush = flush;
            function setBufferSize(size) {
                if (_api.setResourceTimingBufferSize) {
                    _api.setResourceTimingBufferSize(size);
                }
            }
            ResourceTimings.setBufferSize = setBufferSize;
            function sendHelper(toIndex, retries, interval) {
                cancelAsyncCalls();
                var resources = _api.getEntriesByType("resource");
                var amountUnsent = 0;
                var amountSent = 0;
                for (var index = 0; index < toIndex; ++index) {
                    var data = _data[index];
                    if (data) {
                        var resource = resources[index];
                        if (retries === 0 || resource.duration > 0) {
                            Shell.Diagnostics.Telemetry.performance("resource", resource.duration, "", $.extend({}, resource, data));
                            _data[index] = null;
                            amountSent++;
                        }
                        else {
                            amountUnsent++;
                        }
                    }
                }
                if (amountUnsent > 0 && retries > 0) {
                    _timeoutIdForSendResourceTiming = setTimeout(sendHelper.bind(undefined, toIndex, retries - 1, interval), interval);
                }
                else if (toIndex === resources.length && ResourceTimings.doClearWhenAllSent) {
                    // empty buffer if all entries have been sent
                    clearBuffer();
                }
            }
            function cancelAsyncCalls() {
                if (_timeoutIdForSendResourceTiming) {
                    clearTimeout(_timeoutIdForSendResourceTiming);
                    _timeoutIdForSendResourceTiming = null;
                }
            }
            function clearBuffer() {
                cancelAsyncCalls();
                _api.clearResourceTimings();
                _fromIndex = 0;
                _data = [];
            }
            (function initialize(global) {
                _api.clearResourceTimings = _api.clearResourceTimings || _api.webkitClearResourceTimings || _api.msClearResourceTimings || _api.mozClearResourceTimings || _api.oClearResourceTimings;
                _api.getEntriesByType = _api.getEntriesByType || _api.webkitGetEntriesByType || _api.msGetEntriesByType || _api.mozGetEntriesByType || _api.oGetEntriesByType;
                // used to make the buffer for Resource Timing entries bigger if possible
                _api.setResourceTimingBufferSize = _api.setResourceTimingBufferSize || _api.webkitSetResourceTimingBufferSize || _api.msSetResourceTimingBufferSize || _api.mozSetResourceTimingBufferSize || _api.oSetResourceTimingBufferSize;
                ResourceTimings.isSetBufferSizeSupported = !!_api.setResourceTimingBufferSize;
                ResourceTimings.isEnabled = !!_api.getEntriesByType && !!_api.clearResourceTimings;
                if (global.environment && global.environment.doMeasurePerformance !== true) {
                    ResourceTimings.isEnabled = false;
                }
            })(window);
        })(ResourceTimings = Performance.ResourceTimings || (Performance.ResourceTimings = {}));
        ;
        Performance.isEnabled = true;
        // helps avoid losing entries due to full buffer but might lose timing info for some
        Performance.doClearResourceTimingsOnIntervalStart = true;
        var _api;
        var _timeoutIdForIntervalEnd = null;
        // non-overlapping page load statistics
        var _interval = null;
        var _pageCounter = 0;
        function logNavigationTiming() {
            if (!Performance.isEnabled) {
                return;
            }
            if (_api.timing) {
                var logTiming = function logTiming() {
                    setTimeout(function () {
                        Shell.Diagnostics.Telemetry.performance("initialPageLoad", _api.timing.loadEventEnd - _api.timing.navigationStart, "", _api.timing);
                    }, 0);
                    if (disposable) {
                        disposable.dispose();
                        disposable = null;
                    }
                };
                if (_api.timing.loadEventStart > 0) {
                    logTiming();
                }
                else {
                    var disposable = new DataLab.Util.DisposableEventListener(window, "load", logTiming);
                }
            }
        }
        Performance.logNavigationTiming = logNavigationTiming;
        function intervalStart(name) {
            if (!Performance.isEnabled) {
                return;
            }
            _pageCounter++;
            _interval = {
                name: name,
                startTime: _api.now(),
                number: _pageCounter
            };
            if (_timeoutIdForIntervalEnd) {
                clearTimeout(_timeoutIdForIntervalEnd);
                _timeoutIdForIntervalEnd = null;
            }
            // Resource Timing
            if (ResourceTimings.isEnabled && Performance.doClearResourceTimingsOnIntervalStart) {
                ResourceTimings.flush();
                ResourceTimings.clear();
            }
        }
        Performance.intervalStart = intervalStart;
        function intervalEnd() {
            if (!Performance.isEnabled) {
                return;
            }
            // the end of the interval should be when the UI is responsive again, non-blocking
            if (_interval) {
                if (_timeoutIdForIntervalEnd) {
                    clearTimeout(_timeoutIdForIntervalEnd);
                }
                _timeoutIdForIntervalEnd = setTimeout(function () {
                    var duration = _api.now() - _interval.startTime;
                    Shell.Diagnostics.Telemetry.performance("interval", duration, "", _interval);
                    // Resource Timing
                    if (ResourceTimings.isEnabled) {
                        ResourceTimings.send({ intervalNumber: _interval.number }, 5, 2000);
                    }
                    _interval = null;
                }, 0);
            }
        }
        Performance.intervalEnd = intervalEnd;
        (function initialize(global) {
            _api = global.performance || {};
            Performance.isEnabled = global.environment && !!global.environment.doMeasurePerformance && !!_api.now;
            if (!Performance.isEnabled) {
                return;
            }
            if (ResourceTimings.isSetBufferSizeSupported) {
                ResourceTimings.setBufferSize(300);
                Performance.doClearResourceTimingsOnIntervalStart = false; // changed later after initial page load
            }
            ResourceTimings.dataForFlush = { intervalNumber: 1 };
            ResourceTimings.beforeClearCallback = function () {
                ResourceTimings.beforeClearCallback = null;
                ResourceTimings.dataForFlush = null;
            };
        })(window);
    })(Performance = DataLab.Performance || (DataLab.Performance = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Util;
    (function (Util) {
        // A repeater will repeatedly execute a callback a set duration after the callback's returned promise is completed. 
        // A repeater has the ability to start or stop repetition and execute the callback on demand. 
        var Repeater = (function (_super) {
            __extends(Repeater, _super);
            function Repeater(callback, timeoutInMs) {
                _super.call(this);
                this.action = callback;
                this.delay = timeoutInMs;
                this.inFlight = false;
                this.repeating = false;
            }
            // Initiates repetition.
            Repeater.prototype.start = function () {
                if (!this.repeating) {
                    this.repeating = true;
                    this.doAction();
                }
            };
            // Executes the callback immediately and returns its promise. 
            // If the callback is already in the midst of execution, its promise will be returned instead.
            Repeater.prototype.doActionNow = function () {
                if (!this.inFlight) {
                    // clearTimeout will no-op if this.timer has not yet been initialized.
                    clearTimeout(this.timer);
                    this.doAction();
                }
                return this.promise;
            };
            // Halts repetition.
            Repeater.prototype.stop = function () {
                this.repeating = false;
                clearTimeout(this.timer);
            };
            Repeater.prototype.dispose = function () {
                this.stop();
                _super.prototype.dispose.call(this);
            };
            // Executes the callback and handles its promise. 
            Repeater.prototype.doAction = function () {
                var _this = this;
                var doDeferred = $.Deferred();
                this.promise = doDeferred.promise();
                this.inFlight = true;
                this.action().always(function () {
                    _this.inFlight = false;
                    if (_this.repeating) {
                        _this.timer = setTimeout(function () {
                            _this.doAction();
                        }, _this.delay);
                    }
                }).done(function () {
                    doDeferred.resolve();
                });
            };
            return Repeater;
        })(Util.Disposable);
        Util.Repeater = Repeater;
    })(Util = DataLab.Util || (DataLab.Util = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
var DataLab;
(function (DataLab) {
    var TestMessaging;
    (function (TestMessaging) {
        var Constants;
        (function (Constants) {
            Constants.AnimationComplete = "AnimationComplete";
        })(Constants = TestMessaging.Constants || (TestMessaging.Constants = {}));
        /**
          * Post a message for the test page to notify when things like animations complete. This lets us avoid
          * retry/waits in tests.
         **/
        function postMessage(message) {
            if (window["testMessagingEnabled"]) {
                window.postMessage(message, "*");
            }
        }
        TestMessaging.postMessage = postMessage;
    })(TestMessaging = DataLab.TestMessaging || (DataLab.TestMessaging = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Global.refs.ts" />
/// <reference path="Features.ts" />
/// <reference path="Model/WorkspaceSettings.ts" />
/// <reference path="Model/ModuleNode.ts" />
var DataLab;
(function (DataLab) {
    var Trial;
    (function (Trial) {
        var RestrictedFeatureError = (function () {
            function RestrictedFeatureError(xhr) {
                this.feature = null;
                this.type = null; // can be "MaxLimit" or "Value"
                this.value = null; // can be either string or number; based on value in 'type'
                if (xhr.status === 403 && xhr.responseText) {
                    var message = xhr.responseText;
                    // matches service response for disabled features; e.g.:
                    // "Feature:http://schemas.azureml.net/ws/2014/11/identity/claims/Modules;MaxLimit:10"
                    var matches = message.match(/^Feature:([^;]+);(\w+):(.*)$/);
                    if (matches && matches[1] && matches[2] && matches[3]) {
                        this.feature = matches[1]; // eg: "http://schemas.azureml.net/ws/2014/11/identity/claims/Modules"
                        this.type = matches[2]; // eg: "MaxLimit"
                        this.value = this.type === "MaxLimit" ? +matches[3] : matches[3]; // eg: "10"
                    }
                }
            }
            return RestrictedFeatureError;
        })();
        Trial.RestrictedFeatureError = RestrictedFeatureError;
        // private properties
        var _limits = {
            maxModuleCount: Number.MAX_VALUE,
            restrictedModules: [],
            timeLimit: -1,
            moduleRunTimeLimit: Number.MAX_VALUE,
            storageLimit: 10737418240,
            maxDatasetUploadSize: -1,
        };
        var _restrictedModulesSet = null;
        var _global = window;
        // public methods
        function setContext(global) {
            _global = global;
        }
        Trial.setContext = setContext;
        function setUsageLimits(usageLimits) {
            if (usageLimits) {
                _limits = usageLimits;
            }
        }
        Trial.setUsageLimits = setUsageLimits;
        function getWorkspaceType() {
            var res = 0 /* Production */;
            if (_global.environment) {
                res = DataLab.Model.WorkspaceType[_global.environment.workspaceType];
                if (typeof (res) !== 'number') {
                    res = 0 /* Production */;
                    DataLab.Log.error("invalid workspace type", "DataLab.Trial.getWorkspaceType", _global.environment.workspaceType);
                }
            }
            return res;
        }
        Trial.getWorkspaceType = getWorkspaceType;
        function isWorkspaceTypeFree() {
            return getWorkspaceType() === 1 /* Free */;
        }
        Trial.isWorkspaceTypeFree = isWorkspaceTypeFree;
        function isWorkspaceTypeAnonymous() {
            return getWorkspaceType() === 2 /* Anonymous */;
        }
        Trial.isWorkspaceTypeAnonymous = isWorkspaceTypeAnonymous;
        function filterSample(experiment) {
            switch (experiment.Description) {
                case "Sample 1: Download dataset from UCI: Adult 2 class dataset":
                case "Sample 2: Dataset Processing and Analysis: Auto Imports Regression Dataset":
                case "Sample 7: Train, Test, Evaluate for Multiclass Classification: Letter Recognition Dataset":
                case "Sample Experiment - Direct Marketing - Development – Training":
                case "Sample Experiment - Network Intrusion Detection - Development":
                case "Sample Experiment - News Categorization - Development":
                case "Sample Experiment - Student Performance - Development":
                    return false;
                default:
                    return true;
            }
        }
        Trial.filterSample = filterSample;
        // Checks for avaibility of features
        function isDatasetUploadEnabled() {
            if (!DataLab.Features.trialLimitationsEnabled()) {
                return true;
            }
            var enabled = !isWorkspaceTypeAnonymous() || DataLab.Features.datasetUploadInTrialEnabled();
            return enabled;
        }
        Trial.isDatasetUploadEnabled = isDatasetUploadEnabled;
        function isModuleUploadEnabled() {
            if (!DataLab.Features.trialLimitationsEnabled()) {
                return true;
            }
            var enabled = !isWorkspaceTypeAnonymous() || DataLab.Features.moduleUploadInTrialEnabled();
            return enabled;
        }
        Trial.isModuleUploadEnabled = isModuleUploadEnabled;
        function isModuleEnabledById(id) {
            if (!DataLab.Features.trialLimitationsEnabled()) {
                return true;
            }
            var enabled = !isRestricted(id);
            return enabled;
        }
        Trial.isModuleEnabledById = isModuleEnabledById;
        function isWebServicePublishEnabled() {
            if (!DataLab.Features.trialLimitationsEnabled()) {
                return true;
            }
            var enabled = !isWorkspaceTypeAnonymous() || DataLab.Features.publishWebServiceInTrialEnabled();
            return enabled;
        }
        Trial.isWebServicePublishEnabled = isWebServicePublishEnabled;
        function isPublishToCommunityEnabled() {
            if (!DataLab.Features.trialLimitationsEnabled()) {
                return true;
            }
            var enabled = !isWorkspaceTypeAnonymous();
            return enabled;
        }
        Trial.isPublishToCommunityEnabled = isPublishToCommunityEnabled;
        function isNumberOfModulesUnrestricted() {
            if (!DataLab.Features.trialLimitationsEnabled() || getMaxNumberOfModules() < 1) {
                return true;
            }
            return DataLab.Model.WorkspaceTypeExtensions.isProduction(getWorkspaceType());
        }
        Trial.isNumberOfModulesUnrestricted = isNumberOfModulesUnrestricted;
        function isWorkspaceStorageLimited() {
            return DataLab.Features.trialLimitationsEnabled() && DataLab.Trial.isWorkspaceTypeFree() && DataLab.Features.enableWorkspaceQuotasEnabled();
        }
        Trial.isWorkspaceStorageLimited = isWorkspaceStorageLimited;
        function getMaxNumberOfModules() {
            return _limits.maxModuleCount;
        }
        Trial.getMaxNumberOfModules = getMaxNumberOfModules;
        function getTimeLimit() {
            return _limits.timeLimit;
        }
        Trial.getTimeLimit = getTimeLimit;
        function getModuleRunTimeLimit() {
            return _limits.moduleRunTimeLimit;
        }
        Trial.getModuleRunTimeLimit = getModuleRunTimeLimit;
        function getStorageLimit() {
            return _limits.storageLimit;
        }
        Trial.getStorageLimit = getStorageLimit;
        function getMaxDatasetUploadSize() {
            if (isWorkspaceTypeAnonymous() && _limits.maxDatasetUploadSize > 0) {
                return _limits.maxDatasetUploadSize;
            }
            return Number.MAX_VALUE; // ideally should default to ExperimentEditor.Constants.maxUploadSizeInBytes
        }
        Trial.getMaxDatasetUploadSize = getMaxDatasetUploadSize;
        function isRestricted(familyId) {
            if (!_restrictedModulesSet) {
                // init the set for looking up restricted modules
                _restrictedModulesSet = Object.create(null);
                _limits.restrictedModules.forEach(function (id) {
                    _restrictedModulesSet[id] = true;
                });
            }
            return !!_restrictedModulesSet[familyId];
        }
    })(Trial = DataLab.Trial || (DataLab.Trial = {}));
})(DataLab || (DataLab = {}));

var DataLab;
(function (DataLab) {
    var Util;
    (function (Util) {
        var Images;
        (function (Images) {
            Images.FileSelectionErrors = {
                fileTooLarge: DataLab.LocalizedResources.imageUploadError_FileTooLarge,
                errorLoadingIntoImage: DataLab.LocalizedResources.imageUploadError_GenericLoading
            };
            function resizeFileIfNecessary(blob, resizeOptions, maxSizeInMegaBytes) {
                var readPromise = Util.then(DataLab.Util.File.readDataUrlFromBlob(blob), function (dataUrl) {
                    return Util.then(getImageFromDataUrl(dataUrl), function (img) {
                        try {
                            var needsResizing = (resizeOptions.maxHeight && img.naturalHeight > resizeOptions.maxHeight) || (resizeOptions.maxWidth && img.naturalWidth > resizeOptions.maxWidth);
                            if (needsResizing) {
                                var dataUrlOfResizedImage = resizeImage(img, blob.type, resizeOptions);
                                return Util.succeed(new DataLab.ImageContent(dataUrlOfResizedImage, blob.type));
                            }
                            else {
                                return Util.succeed(new DataLab.ImageContent(dataUrl, blob));
                            }
                        }
                        catch (e) {
                            return Util.fail(new Error(Images.FileSelectionErrors.errorLoadingIntoImage));
                        }
                    });
                });
                return Util.then(readPromise, function (imageContent) {
                    if (maxSizeInMegaBytes && imageContent.size > DataLab.Util.megaBytesToBytes(maxSizeInMegaBytes)) {
                        var errorMessage = DataLab.Util.format(Images.FileSelectionErrors.fileTooLarge, maxSizeInMegaBytes.toString());
                        return Util.fail(new Error(errorMessage));
                    }
                    else {
                        return Util.succeed(imageContent);
                    }
                });
            }
            Images.resizeFileIfNecessary = resizeFileIfNecessary;
            function getImageFromDataUrl(dataUrl) {
                var deferred = $.Deferred();
                var img = new Image();
                img.onload = function (evt) {
                    var img = evt.target;
                    deferred.resolve(img);
                };
                img.onerror = function (evt) {
                    deferred.reject(new Error(Images.FileSelectionErrors.errorLoadingIntoImage));
                };
                try {
                    img.src = dataUrl; // if dataUrl is large enough, this can result in an exception
                }
                catch (e) {
                    return Util.fail(new Error(Images.FileSelectionErrors.errorLoadingIntoImage));
                }
                return Util.when(deferred.promise());
            }
            // Only resizes DOWN if necessary to a max spec.  Could easily add support to resize to exact dimensions.
            function resizeImage(img, type, resizeOptions) {
                var finalWidth = img.naturalWidth;
                var finalHeight = img.naturalHeight;
                if (!resizeOptions.maxHeight && !resizeOptions.maxWidth) {
                    throw new Error("Need to specify at least one max dimension");
                }
                // Too tall?
                if (resizeOptions.maxHeight && finalHeight > resizeOptions.maxHeight) {
                    finalWidth *= resizeOptions.maxHeight / finalHeight;
                    finalHeight = resizeOptions.maxHeight;
                }
                // Too wide?
                if (resizeOptions.maxWidth && finalWidth > resizeOptions.maxWidth) {
                    finalHeight *= resizeOptions.maxWidth / finalWidth;
                    finalWidth = resizeOptions.maxWidth;
                }
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = finalWidth;
                canvas.height = finalHeight;
                ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
                return canvas.toDataURL(type);
            }
        })(Images = Util.Images || (Util.Images = {}));
    })(Util = DataLab.Util || (DataLab.Util = {}));
})(DataLab || (DataLab = {}));

var dataGateway;
(function (dataGateway) {
    /**
      * States for the version of gateway bits that are running on premise.
     **/
    (function (gatewayVersionState) {
        gatewayVersionState[gatewayVersionState["None"] = 0] = "None";
        /** The version of the gateway bits running on premise are the latest available.*/
        gatewayVersionState[gatewayVersionState["UpToDate"] = 1] = "UpToDate";
        /** There is a newer version of the gateway bits available for installation. The current version is not scheduled for expiration. */
        gatewayVersionState[gatewayVersionState["NewVersionAvailable"] = 2] = "NewVersionAvailable";
        /** The version of the gateway will soon be unsupported and the gateway disconnected if the gateways is not updated soon. */
        gatewayVersionState[gatewayVersionState["Expiring"] = 3] = "Expiring";
        //** The version of the gateway is now unsupported and the gateway is not functional. */
        gatewayVersionState[gatewayVersionState["Expired"] = 4] = "Expired";
        gatewayVersionState[gatewayVersionState["Other"] = 5] = "Other";
    })(dataGateway.gatewayVersionState || (dataGateway.gatewayVersionState = {}));
    var gatewayVersionState = dataGateway.gatewayVersionState;
    ;
    (function (gatewayState) {
        gatewayState[gatewayState["None"] = 0] = "None";
        gatewayState[gatewayState["NeedRegistration"] = 1] = "NeedRegistration";
        gatewayState[gatewayState["Online"] = 2] = "Online";
        gatewayState[gatewayState["Offline"] = 3] = "Offline";
        gatewayState[gatewayState["UpdateAvailable"] = 4] = "UpdateAvailable";
        gatewayState[gatewayState["Other"] = 5] = "Other";
    })(dataGateway.gatewayState || (dataGateway.gatewayState = {}));
    var gatewayState = dataGateway.gatewayState;
    ;
    /**
      * Sample usage with error detection and detail extraction. Returned promises are assumed to
      * pass a error object that is used as shown below.
      *
    **/
    function makeSampleCall(backend) {
        var gatewayToDelete = "foo";
        backend.deleteGateway(gatewayToDelete).fail(function (error) {
            if (error.xmlHttpRequest.status == 404) {
                return; // ignore failure to delete gateway that no longer exists.
            }
            var message = "Unable to delete data gateway'" + gatewayToDelete + "'.";
            var errorDetail = null;
            if (error.xmlHttpRequest.responseText) {
                try {
                    errorDetail = JSON.parse(error.xmlHttpRequest.responseText);
                }
                catch (e) {
                }
            }
            if (errorDetail && errorDetail.code && errorDetail.message) {
                message += " " + errorDetail.code + ":" + errorDetail.message;
            }
            message += " (HTTP status code: " + error.xmlHttpRequest.status + ")";
            var requestId = error.xmlHttpRequest.getResponseHeader("x-ms-request-id");
            if (requestId) {
                message += " Request ID: " + requestId;
            }
            console.log(message);
        });
    }
})(dataGateway || (dataGateway = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="DataContractInterfaces-v1.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        var TestData;
        (function (TestData) {
            //  Contains serialized Module, Dataset, Experiment and WorkspaceSettings models.
            var Modules;
            (function (Modules) {
                Modules.Adder = {
                    "Category": "Math\\Basic",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1343867252000)\/",
                    "Description": "Adder exe that sums 10 numbers in the input",
                    "EscalationEmail": " ",
                    "Id": "b90435290b064b26ae2bd45588687a0d.adderFamily.a4640931d0ff46ebb5adcdfddc34455b",
                    "FamilyId": "adderFamily",
                    "InformationUrl": "",
                    "InterfaceString": "Adder.exe {in:GenericTSV:Input0} {out:GenericTSV:Output0}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "Name": "Adder",
                    "Owner": "REDMOND\\ramraman",
                    "ServiceVersion": 1,
                    "ClientVersion": "1.0",
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "Input0",
                                "FriendlyName": "Input0",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericTSV",
                                        "IsDirectory": false,
                                        "Name": "Generic TSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "Output0",
                                "FriendlyName": "Output0",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericTSV",
                                    "IsDirectory": false,
                                    "Name": "Generic TSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": []
                    }
                };
                Modules.OldAdder = {
                    "Category": "Math\\Deprecated",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1343867252000)\/",
                    "Description": "Outdated adder exe that sums 10 numbers in the input",
                    "EscalationEmail": " ",
                    "Id": "b90435290b064b26ae2bd45588687a0d.adderFamily.a4640931d0ff46ebb5adcdfddc32222b",
                    "FamilyId": "adderFamily",
                    "InformationUrl": "",
                    "InterfaceString": "Adder.exe {in:GenericTSV:Input0} {out:GenericTSV:Output0}",
                    "IsDeterministic": true,
                    "IsLatest": false,
                    "Name": "OldAdder",
                    "Owner": "REDMOND\\ramraman",
                    "ClientVersion": "1.0",
                    "ServiceVersion": 0,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "Input0",
                                "FriendlyName": "Input0",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericTSV",
                                        "IsDirectory": false,
                                        "Name": "Generic TSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "Output0",
                                "FriendlyName": "Output0",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericTSV",
                                    "IsDirectory": false,
                                    "Name": "Generic TSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": []
                    }
                };
                Modules.CustomUXModule = {
                    "Category": "Visualization",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1343867252000)\/",
                    "Description": "A module that has custom UX",
                    "EscalationEmail": " ",
                    "Id": "b90435290b064b26ae2bd45588687a0d.familyHasCustomUX.HasCustomUX",
                    "FamilyId": "familyHasCustomUX",
                    "InformationUrl": "",
                    "InterfaceString": "Adder.exe {in:GenericTSV:Input0} {out:GenericTSV:Output0}",
                    "IsDeterministic": true,
                    "IsLatest": false,
                    "Name": "CustomUXModule",
                    "Owner": "REDMOND\\misterbojangles",
                    "ClientVersion": "1.0",
                    "ServiceVersion": 0,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "Input0",
                                "FriendlyName": "Input0",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericTSV",
                                        "IsDirectory": false,
                                        "Name": "Generic TSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "Output0",
                                "FriendlyName": "Output0",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericTSV",
                                    "IsDirectory": false,
                                    "Name": "Generic TSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "ParameterType": "string",
                                "DefaultValue": "",
                                "HasDefaultValue": false,
                                "HasRules": false,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "data",
                                "FriendlyName": "data",
                                "ParameterRules": [
                                ],
                                "CredentialDescriptor": null,
                            },
                        ]
                    }
                };
                Modules.ModuleWithAnyType = {
                    "Category": "Random\\One Input",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1343867252000)\/",
                    "Description": "Module with Any for input and output types",
                    "EscalationEmail": " ",
                    "Id": "b90435290b064b26ae2bd45588687a0d.ModuleWithAnyType.a4640931d0ff46ebb5adcdfddeadbeef",
                    "FamilyId": "ModuleWithAnyType",
                    "InformationUrl": "",
                    "InterfaceString": "Adder.exe {in:Any:Input0} {out:Any:Output0}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "Name": "Module with Any type",
                    "Owner": "REDMOND\\kitty",
                    "ServiceVersion": 0,
                    "ClientVersion": "1.0",
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "Input0",
                                "FriendlyName": "Input0",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Can connect to anything",
                                        "Id": "Any",
                                        "IsDirectory": false,
                                        "Name": "Any",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "Output0",
                                "FriendlyName": "Output0",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Can connect to anything",
                                    "Id": "Any",
                                    "IsDirectory": false,
                                    "Name": "Any",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": []
                    }
                };
                Modules.FakeModule = {
                    "Category": "Fake",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165632000)\/",
                    "CustomerVersion": null,
                    "Description": "Fake module compatible with csv input and able to take various types of parameters",
                    "EscalationEmail": "",
                    "FamilyId": "FakeModule",
                    "Id": "7890f1f9d6f9424484c21ffea9fd98f6.FakeModule.c4250e129d7e4d688fa012416a2858sd",
                    "InformationUrl": "",
                    "InterfaceString": "FakeModule.exe (IntegerParameter:int,10,90:default,70) (FolatParameter:float,0.2,0.9:default,0.5) (EnumParameter:enum,option1,option2,option3:default,option1) {in:GenericCSV:inputdata.csv} {out:GenericCSV:traindata.csv} {out:GenericCSV:validatedata.csv}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata.csv",
                                "FriendlyName": "inputdata.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "FakeModule.exe (IntegerParameter:int,10,90:default,70) (FolatParameter:float,0.2,0.9:default,0.5) (EnumParameter:enum,option1,option2,option3:default,option1) {in:GenericCSV:inputdata.csv} {out:GenericCSV:traindata.csv} {out:GenericCSV:validatedata.csv}",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "traindata.csv",
                                "FriendlyName": "traindata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            },
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "validatedata.csv",
                                "FriendlyName": "validatedata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "ParameterType": "Int",
                                "DefaultValue": "70",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "IntegerParameter",
                                "FriendlyName": "IntegerParameter",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRuleInt:#Microsoft.MetaAnalytics",
                                        "Max": 90,
                                        "Min": 10
                                    },
                                ],
                                "CredentialDescriptor": null
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "ParameterType": "Enumerated",
                                "DefaultValue": "Option1",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "EnumParameter",
                                "FriendlyName": "EnumParameter",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRules:#Microsoft.MetaAnalytics",
                                        "Values": [
                                            "Option1",
                                            "Option2",
                                            "Option3"
                                        ]
                                    }
                                ],
                                "CredentialDescriptor": null
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "ParameterType": "Float",
                                "DefaultValue": "0.5",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": true,
                                "MarkupType": 0,
                                "Name": "FloatParameter",
                                "FriendlyName": "FloatParameter",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRuleFloat:#Microsoft.MetaAnalytics",
                                        "Max": 0.9,
                                        "Min": 0.2
                                    }
                                ],
                                "CredentialDescriptor": null
                            }
                        ]
                    },
                    "Name": "FakeModule",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\qizhen",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "ClientVersion": "1.0"
                };
                Modules.MergeFiles = {
                    "Category": "Random\\Multiple Input\\2 Input\\Merge Files",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1348184344543)\/",
                    "CustomerVersion": null,
                    "Description": "Merge 2 files into one",
                    "EscalationEmail": "a@a.com",
                    "FamilyId": "MergeFiles",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.MergeFiles.205c932722af4d1aba469c7ccbeda662",
                    "InformationUrl": "",
                    "InterfaceString": "MergeFiles.exe {in:GenericCSV:Input0} {in:GenericCSV:Input1} {out:GenericCSV:Output0}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "Input0",
                                "FriendlyName": "Input0",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "Input1",
                                "FriendlyName": "Input1",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "MergeFiles.exe {in:GenericCSV:Input0} {in:GenericCSV:Input1} {out:GenericCSV:Output0}",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "Output0",
                                "FriendlyName": "Output0",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                        ]
                    },
                    "Name": "MergeFileThatWorks",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\pavansa",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0.0"
                };
                Modules.LongName = {
                    "Category": "Random\\Multiple Input\\2 Input",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1348184344543)\/",
                    "CustomerVersion": null,
                    "Description": "Has a long name",
                    "EscalationEmail": "a@a.com",
                    "FamilyId": "LongName",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.LongName.205c932722af4d1aba469c7ccbeda663",
                    "InformationUrl": "",
                    "InterfaceString": "MergeFiles.exe {in:GenericCSV:Input0} {in:GenericCSV:Input1} {out:GenericCSV:Output0}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "Input0",
                                "FriendlyName": "Input0",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "Input1",
                                "FriendlyName": "Input1",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "MergeFiles.exe {in:GenericCSV:Input0} {in:GenericCSV:Input1} {out:GenericCSV:Output0}",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "Output0",
                                "FriendlyName": "Output0",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                        ]
                    },
                    "Name": "ThisModuleHasAReallyLongNameForTesting",
                    "NextVersionModuleId": null,
                    "Owner": "The devil himself",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0.0"
                };
                Modules.SamosTrain = {
                    "Category": "DoStuff",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165734000)\/",
                    "CustomerVersion": null,
                    "Description": "Samos train module",
                    "EscalationEmail": "",
                    "FamilyId": "SamosTrain",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.SamosTrain.299b196fa2e7413e9c555c63963b85a2",
                    "InformationUrl": "",
                    "InterfaceString": "AetherSamosModule.exe Train {in:GenericCSV:inputdata.csv} {out:PlainText:trained-model}  (OperatorName:enum,AveragedPerceptron,GaussianNaiveBayes,LinearSVM:default,AveragedPerceptron)",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata.csv",
                                "FriendlyName": "inputdata.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "AetherSamosModule.exe Train {in:GenericCSV:inputdata.csv} {out:PlainText:trained-model}  (OperatorName:enum,AveragedPerceptron,GaussianNaiveBayes,LinearSVM:default,AveragedPerceptron)",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "trained-model",
                                "FriendlyName": "trained-model",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Plain text file",
                                    "Id": "PlainText",
                                    "IsDirectory": false,
                                    "Name": "Plain Text",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "ParameterType": "Enumerated",
                                "DefaultValue": "AveragedPerceptron",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "OperatorName",
                                "FriendlyName": "OperatorName",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRules:#Microsoft.MetaAnalytics",
                                        "Values": [
                                            "AveragedPerceptron",
                                            "GaussianNaiveBayes",
                                            "LinearSVM"
                                        ]
                                    }
                                ],
                                "CredentialDescriptor": null
                            }
                        ]
                    },
                    "Name": "SamosTrain",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\adhurwit",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.ManyInputs = {
                    "Category": "Random\\Multiple Input",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165734000)\/",
                    "CustomerVersion": null,
                    "Description": "This module has a lot of inputs",
                    "EscalationEmail": "",
                    "FamilyId": "ManyInputs",
                    "Id": "1b90f1f9d6f9424484c21ffeb9fd98f6.ManyInputs.488b196fa2e7413e9c555c63963b85a2",
                    "InformationUrl": "",
                    "InterfaceString": "AetherSamosModule.exe Train {in:GenericCSV:inputdata.csv} {out:PlainText:trained-model}  (OperatorName:enum,AveragedPerceptron,GaussianNaiveBayes,LinearSVM:default,AveragedPerceptron)",
                    "IsLatest": true,
                    "IsDeterministic": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata_1.csv",
                                "FriendlyName": "inputdata_1.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "this input has a very very long name 1",
                                "FriendlyName": "this input has a very very long name 1",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "this input has a very very long name 2",
                                "FriendlyName": "this input has a very very long name 2",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "this input has a very very long name 3",
                                "FriendlyName": "this input has a very very long name 3",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata_2.csv",
                                "FriendlyName": "inputdata_2.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata_3.csv",
                                "FriendlyName": "inputdata_3.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata_4.csv",
                                "FriendlyName": "inputdata_4.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata_5.csv",
                                "FriendlyName": "inputdata_5.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "ManyInputs.exe",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "outputdata_1.txt",
                                "FriendlyName": "outputdata_1.txt",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Plain text file",
                                    "Id": "PlainText",
                                    "IsDirectory": false,
                                    "Name": "Plain Text",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": []
                    },
                    "Name": "ManyInputsModule",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\t-pachun",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.MissingValuesRemover = {
                    "Category": "File\\Make Smaller",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165579000)\/",
                    "CustomerVersion": null,
                    "Description": "Remove missing values from the input file. Missing value is considered as ? in value. Entire row with ? in it deleted.",
                    "EscalationEmail": "",
                    "FamilyId": "MissingValuesRemover",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.MissingValuesRemover.364d6e6e2c194e3f9e216148a23513d8",
                    "InformationUrl": "",
                    "InterfaceString": "MissingValues.exe {in:GenericCSV:inputdata.csv} {out:GenericCSV:outputdata.csv}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata.csv",
                                "FriendlyName": "inputdata.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "MissingValues.exe {in:GenericCSV:inputdata.csv} {out:GenericCSV:outputdata.csv}",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "outputdata.csv",
                                "FriendlyName": "outputdata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                        ]
                    },
                    "Name": "MissingValuesRemover",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\adhurwit",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.DictionaryBinner = {
                    "Category": "File",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165522000)\/",
                    "CustomerVersion": null,
                    "Description": "Replace values in the first column by 0-based values.",
                    "EscalationEmail": "",
                    "FamilyId": "DictionaryBinner",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.DictionaryBinner.70368dd3cb854b46b4dd51b9ac280cdd",
                    "InformationUrl": "",
                    "InterfaceString": "DictionaryBinner.exe {in:GenericCSV:inputdata.csv} {out:GenericCSV:outputdata.csv}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata.csv",
                                "FriendlyName": "inputdata.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "DictionaryBinner.exe {in:GenericCSV:inputdata.csv} {out:GenericCSV:outputdata.csv}",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "outputdata.csv",
                                "FriendlyName": "outputdata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                        ]
                    },
                    "Name": "DictionaryBinner",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\adhurwit",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.ParameterTest = {
                    "Category": null,
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1347435227000)\/",
                    "CustomerVersion": null,
                    "Description": "Publish model for analytics service",
                    "EscalationEmail": "",
                    "FamilyId": "ParameterTest",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.ParameterTest.75beea5ecb924aa3bfce46001fb93f08",
                    "InformationUrl": "",
                    "InterfaceString": "AetherSamosModule.exe Publish {in:PlainText:trained-model} {out:PlainText:publish-data} (AzureStorageConnectionString) (outputUri)",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "trained-model",
                                "FriendlyName": "trained-model",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Plain text file",
                                        "Id": "PlainText",
                                        "IsDirectory": false,
                                        "Name": "Plain Text",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "AetherSamosModule.exe Publish {in:PlainText:trained-model} {out:PlainText:publish-data} (AzureStorageConnectionString) (outputUri)",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "publish-data",
                                "FriendlyName": "publish-data",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Plain text file",
                                    "Id": "PlainText",
                                    "IsDirectory": false,
                                    "Name": "Plain Text",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "DefaultValue": "a",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "Coefficient",
                                "FriendlyName": "Coefficient",
                                "ParameterType": "Float",
                                "CredentialDescriptor": null,
                                "ParameterRules": [
                                    { Min: 0, Max: 1 }
                                ]
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "DefaultValue": "0.1",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "DragFactor",
                                "FriendlyName": "DragFactor",
                                "ParameterType": "Float",
                                "CredentialDescriptor": null,
                                "ParameterRules": [
                                    { Min: 0, Max: 1 }
                                ]
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "DefaultValue": "1000",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "InitialValue",
                                "FriendlyName": "InitialValue",
                                "ParameterType": "Int",
                                "CredentialDescriptor": null,
                                "ParameterRules": [
                                    { Min: 0, Max: 1000000 }
                                ]
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "DefaultValue": "orange",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "Color",
                                "FriendlyName": "Color",
                                "ParameterType": "String",
                                "CredentialDescriptor": null,
                                "ParameterRules": [
                                    {
                                        "__type": "WhoCares",
                                        "Values": [
                                            "blue",
                                            "orange",
                                            "silver"
                                        ]
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "DefaultValue": "v2",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "Version",
                                "FriendlyName": "Version",
                                "ParameterType": "Enumerated",
                                "CredentialDescriptor": null,
                                "ParameterRules": [
                                    {
                                        "__type": "WhoGivesAHoot",
                                        "Values": [
                                            "v1",
                                            "v2",
                                            "v3"
                                        ]
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "DefaultValue": "True",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 1,
                                "Name": "RunOptimized",
                                "FriendlyName": "RunOptimized",
                                "ParameterType": "Boolean",
                                "CredentialDescriptor": null,
                                "ParameterRules": []
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "DefaultValue": "false",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 1,
                                "Name": "RunInParallel",
                                "FriendlyName": "RunInParallel",
                                "ParameterType": "Enumerated",
                                "CredentialDescriptor": null,
                                "ParameterRules": [
                                    {
                                        "__type": "WhoGivesAHoot",
                                        "Values": [
                                            "TRUE",
                                            "false",
                                        ]
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "DefaultValue": "Yes",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 1,
                                "Name": "Mutation1",
                                "FriendlyName": "Mutation1",
                                "ParameterType": "Enumerated",
                                "CredentialDescriptor": null,
                                "ParameterRules": [
                                    {
                                        "__type": "WhoGivesAHoot",
                                        "Values": [
                                            "No",
                                            "Yes",
                                        ]
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "DefaultValue": "",
                                "HasDefaultValue": false,
                                "HasRules": true,
                                "IsOptional": true,
                                "MarkupType": 1,
                                "Name": "Compression",
                                "FriendlyName": "Compression",
                                "ParameterType": "Enumerated",
                                "CredentialDescriptor": null,
                                "ParameterRules": [
                                    {
                                        "__type": "WhoGivesAHoot",
                                        "Values": [
                                            "False",
                                            "True",
                                        ]
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "DefaultValue": "2.1",
                                "HasDefaultValue": true,
                                "HasRules": false,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "Scale",
                                "FriendlyName": "Scale",
                                "ParameterType": "String",
                                "CredentialDescriptor": null,
                                "ParameterRules": [
                                    { Min: 0, Max: 10 }
                                ]
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "DefaultValue": "Select * from Objects where id = '007'",
                                "HasDefaultValue": true,
                                "HasRules": false,
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "Script",
                                "FriendlyName": "Script",
                                "ParameterType": "String",
                                "CredentialDescriptor": null,
                                "ParameterRules": []
                            },
                        ]
                    },
                    "Name": "ParameterTest",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\yourmom",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.SamosPublish = {
                    "Category": "DoStuff",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165689000)\/",
                    "CustomerVersion": null,
                    "Description": "Samos publish module",
                    "EscalationEmail": "",
                    "FamilyId": "SamosPublish",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.SamosPublish.7a8fab7077f24d458760b3703bea0942",
                    "InformationUrl": "",
                    "InterfaceString": "AetherSamosModule.exe Publish {in:PlainText:trained-model} {out:PlainText:publish-data} (OperatorName:enum,AveragedPerceptron,GaussianNaiveBayes,LinearSVM:default,AveragedPerceptron)",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "trained-model",
                                "FriendlyName": "trained-model",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Plain text file",
                                        "Id": "PlainText",
                                        "IsDirectory": false,
                                        "Name": "Plain Text",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "AetherSamosModule.exe Publish {in:PlainText:trained-model} {out:PlainText:publish-data} (OperatorName:enum,AveragedPerceptron,GaussianNaiveBayes,LinearSVM:default,AveragedPerceptron)",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "publish-data",
                                "FriendlyName": "publish-data",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Plain text file",
                                    "Id": "PlainText",
                                    "IsDirectory": false,
                                    "Name": "Plain Text",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "ParameterType": "Enumerated",
                                "DefaultValue": "AveragedPerceptron",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "OperatorName",
                                "FriendlyName": "OperatorName",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRules:#Microsoft.MetaAnalytics",
                                        "Values": [
                                            "AveragedPerceptron",
                                            "GaussianNaiveBayes",
                                            "LinearSVM"
                                        ]
                                    }
                                ],
                                "CredentialDescriptor": null
                            }
                        ]
                    },
                    "Name": "SamosPublish",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\adhurwit",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.SamosValidate = {
                    "Category": "DoStuff",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165781000)\/",
                    "CustomerVersion": null,
                    "Description": null,
                    "EscalationEmail": "",
                    "FamilyId": "SamosValidate",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.SamosValidate.92e69f6ff2fd415e810263d272a88fd5",
                    "InformationUrl": "",
                    "InterfaceString": "AetherSamosModule.exe Validate {in:PlainText:trained-model} {in:GenericCSV:inputdata.csv} {out:PlainText:confusion-matrix} {out:PlainText:validation-results} (OperatorName:enum,AveragedPerceptron,GaussianNaiveBayes,LinearSVM:default,AveragedPerceptron)",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": true,
                                "MarkupType": 2,
                                "Name": "trained-model",
                                "FriendlyName": "trained-model",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Plain text file",
                                        "Id": "PlainText",
                                        "IsDirectory": false,
                                        "Name": "Plain Text",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata.csv",
                                "FriendlyName": "inputdata.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "AetherSamosModule.exe Validate {in:PlainText:trained-model} {in:GenericCSV:inputdata.csv} {out:PlainText:confusion-matrix} {out:PlainText:validation-results} (OperatorName:enum,AveragedPerceptron,GaussianNaiveBayes,LinearSVM:default,AveragedPerceptron)",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "confusion-matrix",
                                "FriendlyName": "confusion-matrix",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Plain text file",
                                    "Id": "PlainText",
                                    "IsDirectory": false,
                                    "Name": "Plain Text",
                                    "Owner": "passau"
                                }
                            },
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "validation-results",
                                "FriendlyName": "validation-results",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Plain text file",
                                    "Id": "PlainText",
                                    "IsDirectory": false,
                                    "Name": "Plain Text",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "ParameterType": "Enumerated",
                                "DefaultValue": "AveragedPerceptron",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "OperatorName",
                                "FriendlyName": "OperatorName",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRules:#Microsoft.MetaAnalytics",
                                        "Values": [
                                            "AveragedPerceptron",
                                            "GaussianNaiveBayes",
                                            "LinearSVM"
                                        ]
                                    }
                                ],
                                "CredentialDescriptor": null
                            }
                        ]
                    },
                    "Name": "SamosValidate",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\adhurwit",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.OptionalInputModule = {
                    "Category": "Random\\Multiple Input\\2 Input",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165781000)\/",
                    "CustomerVersion": null,
                    "Description": "Optional Input Module",
                    "EscalationEmail": "",
                    "FamilyId": "OptionalInputModule",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.OptionalInputModule.92e69f6ff2fd415e810263d272a88fe1",
                    "InformationUrl": "",
                    "InterfaceString": "AetherSamosModule.exe Validate {in:PlainText:trained-model} {in:GenericCSV:inputdata.csv} {out:PlainText:confusion-matrix} {out:PlainText:validation-results} (OperatorName:enum,AveragedPerceptron,GaussianNaiveBayes,LinearSVM:default,AveragedPerceptron)",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": true,
                                "MarkupType": 2,
                                "Name": "trained-model",
                                "FriendlyName": "trained-model",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Plain text file",
                                        "Id": "PlainText",
                                        "IsDirectory": false,
                                        "Name": "Plain Text",
                                        "Owner": "passau"
                                    }
                                ]
                            },
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata.csv",
                                "FriendlyName": "inputdata.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "AetherSamosModule.exe Validate {in:PlainText:trained-model} {in:GenericCSV:inputdata.csv} {out:PlainText:confusion-matrix} {out:PlainText:validation-results} (OperatorName:enum,AveragedPerceptron,GaussianNaiveBayes,LinearSVM:default,AveragedPerceptron)",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "confusion-matrix",
                                "FriendlyName": "confusion-matrix",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Plain text file",
                                    "Id": "PlainText",
                                    "IsDirectory": false,
                                    "Name": "Plain Text",
                                    "Owner": "passau"
                                }
                            },
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "validation-results",
                                "FriendlyName": "validation-results",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Plain text file",
                                    "Id": "PlainText",
                                    "IsDirectory": false,
                                    "Name": "Plain Text",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "ParameterType": "Enumerated",
                                "DefaultValue": "AveragedPerceptron",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "OperatorName",
                                "FriendlyName": "OperatorName",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRules:#Microsoft.MetaAnalytics",
                                        "Values": [
                                            "AveragedPerceptron",
                                            "GaussianNaiveBayes",
                                            "LinearSVM"
                                        ]
                                    }
                                ],
                                "CredentialDescriptor": null
                            }
                        ]
                    },
                    "Name": "ModuleWithOptionalInput",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\adhurwit",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.RandomFileSplitter = {
                    "Category": "File\\Make Smaller",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165632000)\/",
                    "CustomerVersion": null,
                    "Description": "Randomly split file into two based on Percentage parameter",
                    "EscalationEmail": "",
                    "FamilyId": "RandomFileSplitter",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.RandomFileSplitter.c4250e129d7e4d688fa012416a28585d",
                    "InformationUrl": "",
                    "InterfaceString": "Split.exe (Percentage:int,10,90:default,70) {in:GenericCSV:inputdata.csv} {out:GenericCSV:traindata.csv} {out:GenericCSV:validatedata.csv}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata.csv",
                                "FriendlyName": "inputdata.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "Split.exe (Percentage:int,10,90:default,70) {in:GenericCSV:inputdata.csv} {out:GenericCSV:traindata.csv} {out:GenericCSV:validatedata.csv}",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "traindata.csv",
                                "FriendlyName": "traindata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            },
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "validatedata.csv",
                                "FriendlyName": "validatedata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "ParameterType": "Int",
                                "DefaultValue": "70",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "Percentage",
                                "FriendlyName": "Percentage",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRuleInt:#Microsoft.MetaAnalytics",
                                        "Max": 90,
                                        "Min": 10
                                    }
                                ],
                                "CredentialDescriptor": null
                            }
                        ]
                    },
                    "Name": "RandomFileSplitter",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\adhurwit",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.CategoryColumnSelection = {
                    "Category": "File",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165315000)\/",
                    "CustomerVersion": null,
                    "Description": "Select category column and set it as a very first column",
                    "EscalationEmail": "",
                    "FamilyId": "CategoryColumnSelection",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.CategoryColumnSelection.f1d2150711064f3e911fb3269a5cfb78",
                    "InformationUrl": "",
                    "InterfaceString": "SelectCategoryColumn.exe (Column:int,1,) {in:GenericCSV:inputdata.csv} {out:GenericCSV:traindata.csv}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata.csv",
                                "FriendlyName": "inputdata.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "SelectCategoryColumn.exe (Column:int,1,) {in:GenericCSV:inputdata.csv} {out:GenericCSV:traindata.csv}",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "traindata.csv",
                                "FriendlyName": "traindata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "ParameterType": "Int",
                                "DefaultValue": null,
                                "HasDefaultValue": false,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "Column",
                                "FriendlyName": "Column",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRuleInt:#Microsoft.MetaAnalytics",
                                        "Max": 2147483647,
                                        "Min": 1
                                    }
                                ],
                                "CredentialDescriptor": null
                            }
                        ]
                    },
                    "Name": "CategoryColumnSelection",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\adhurwit",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.ScriptedModule = {
                    "Category": "Script",
                    "CloudSystem": "hive",
                    "CreatedDate": "\/Date(1346165315000)\/",
                    "CustomerVersion": null,
                    "Description": "Does things in a script-aculous way",
                    "EscalationEmail": "",
                    "FamilyId": "ScriptedModule",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.ScriptedModule.a1d2150711064f3e911fb3269a5cfb78",
                    "InformationUrl": "",
                    "InterfaceString": "",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [
                        { "Name": "ScriptWithDefault", "Value": "import antigravity\ndef foo():\n    foo()" }
                    ],
                    "ModuleInterface": {
                        "InputPorts": [],
                        "InterfaceString": "",
                        "OutputPorts": [],
                        "Parameters": [
                            {
                                "ParameterType": "Script",
                                "DefaultValue": null,
                                "HasDefaultValue": false,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "ScriptWithDefault",
                                "FriendlyName": "ScriptWithDefault",
                                "ParameterRules": [],
                                "ScriptName": "",
                                "CredentialDescriptor": null
                            },
                            {
                                "ParameterType": "Script",
                                "DefaultValue": null,
                                "HasDefaultValue": false,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "AnotherScript",
                                "FriendlyName": "AnotherScript",
                                "ParameterRules": [],
                                "ScriptName": "",
                                "CredentialDescriptor": null
                            }
                        ]
                    },
                    "Name": "Scripted",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\adhurwit",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.FakeModuleWithRelevantParameters = {
                    "Category": "Fake",
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165632000)\/",
                    "CustomerVersion": null,
                    "Description": "Fake module compatible with csv input and able to take various types of parameters with a relevancy hierarchy",
                    "EscalationEmail": "",
                    "FamilyId": "FakeModuleWithRelevantParameters",
                    "Id": "7890f1f9d6f9424484c21ffea9fd98f6.FakeModuleWithRelevantParameters.a1d2150711064f3e911fb3269a5cfb78",
                    "InformationUrl": "",
                    "InterfaceString": "FakeModule.exe (IntegerParameter:int,10,90:default,70) (FloatParameter:float,0.2,0.9:default,0.5) {in:GenericCSV:inputdata.csv} {out:GenericCSV:traindata.csv} {out:GenericCSV:validatedata.csv}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata.csv",
                                "FriendlyName": "inputdata.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "FakeModule.exe (IntegerParameter:int,10,90:default,70) (FloatParameter:float,0.2,0.9:default,0.5) (EnumParameter:enum,option1,option2,option3:default,option1) {in:GenericCSV:inputdata.csv} {out:GenericCSV:traindata.csv} {out:GenericCSV:validatedata.csv}",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "traindata.csv",
                                "FriendlyName": "traindata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            },
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "validatedata.csv",
                                "FriendlyName": "validatedata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "ParameterType": "Float",
                                "DefaultValue": "0.5",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "Float Parameter",
                                "FriendlyName": "Float Parameter",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRuleFloat:#Microsoft.MetaAnalytics",
                                        "Max": 0.9,
                                        "Min": 0.2
                                    }
                                ],
                                "CredentialDescriptor": null
                            },
                            {
                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                "ParameterType": "Mode",
                                "DefaultValue": "Option with no relevant parameters",
                                "HasDefaultValue": true,
                                "HasRules": false,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "Mode Parameter",
                                "FriendlyName": "Mode Parameter",
                                "ParameterRules": [],
                                "CredentialDescriptor": null,
                                "ModeValuesInfo": {
                                    "Option with relevant parameters": {
                                        "InterfaceString": "interface string 1",
                                        "Parameters": [
                                            {
                                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                                "ParameterType": "Int",
                                                "DefaultValue": "10",
                                                "HasDefaultValue": true,
                                                "HasRules": true,
                                                "IsOptional": false,
                                                "MarkupType": 0,
                                                "Name": "Integer Parameter 1",
                                                "FriendlyName": "Integer Parameter 1",
                                                "ParameterRules": [
                                                    {
                                                        "__type": "ParameterRuleInt:#Microsoft.MetaAnalytics",
                                                        "Max": 90,
                                                        "Min": 10
                                                    }
                                                ],
                                                "CredentialDescriptor": null
                                            },
                                            {
                                                "__type": "ModuleParameter:#Microsoft.MetaAnalytics",
                                                "ParameterType": "Int",
                                                "DefaultValue": "40",
                                                "HasDefaultValue": true,
                                                "HasRules": true,
                                                "IsOptional": true,
                                                "MarkupType": 0,
                                                "Name": "Integer Parameter 2",
                                                "FriendlyName": "Integer Parameter 2",
                                                "ParameterRules": [
                                                    {
                                                        "__type": "ParameterRuleInt:#Microsoft.MetaAnalytics",
                                                        "Max": 50,
                                                        "Min": 30
                                                    }
                                                ],
                                                "CredentialDescriptor": null
                                            }
                                        ]
                                    },
                                    "Option with no relevant parameters": {
                                        "InterfaceString": "interface string 2",
                                        "Parameters": []
                                    }
                                }
                            }
                        ]
                    },
                    "Name": "FakeModuleWithRelevantParameters",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\yikei",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.ModuleWithNestedRelevantParameters = {
                    "Category": null,
                    "CloudSystem": "exe",
                    "CreatedDate": "\/Date(1346165632000)\/",
                    "CustomerVersion": null,
                    "Description": "A fake module which has a mode parameter nested within a mode parameter.",
                    "EscalationEmail": "",
                    "FamilyId": "ModuleWithNestedRelevantParameters",
                    "Id": "7890f1f9d6f9424484c21ffea9fd98f6.ModuleWithNestedRelevantParameters.a1d2150711064f3e874fb3269a5cfb78",
                    "InformationUrl": "",
                    "InterfaceString": "FakeModule.exe (IntegerParameter:int,10,90:default,70) (FloatParameter:float,0.2,0.9:default,0.5) {in:GenericCSV:inputdata.csv} {out:GenericCSV:traindata.csv} {out:GenericCSV:validatedata.csv}",
                    "IsDeterministic": true,
                    "IsLatest": true,
                    "ScriptsDefaultContents": [],
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "__type": "ModuleInputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 2,
                                "Name": "inputdata.csv",
                                "FriendlyName": "inputdata.csv",
                                "Types": [
                                    {
                                        "CreatedDate": "\/Date(-62135596800000)\/",
                                        "Description": "Comma-separated text file",
                                        "Id": "GenericCSV",
                                        "IsDirectory": false,
                                        "Name": "Generic CSV File",
                                        "Owner": "passau"
                                    }
                                ]
                            }
                        ],
                        "InterfaceString": "FakeModule.exe (IntegerParameter:int,10,90:default,70) (FloatParameter:float,0.2,0.9:default,0.5) (EnumParameter:enum,option1,option2,option3:default,option1) {in:GenericCSV:inputdata.csv} {out:GenericCSV:traindata.csv} {out:GenericCSV:validatedata.csv}",
                        "OutputPorts": [
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "traindata.csv",
                                "FriendlyName": "traindata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            },
                            {
                                "__type": "ModuleOutputPort:#Microsoft.MetaAnalytics",
                                "IsOptional": false,
                                "MarkupType": 3,
                                "Name": "validatedata.csv",
                                "FriendlyName": "validatedata.csv",
                                "Type": {
                                    "CreatedDate": "\/Date(-62135596800000)\/",
                                    "Description": "Comma-separated text file",
                                    "Id": "GenericCSV",
                                    "IsDirectory": false,
                                    "Name": "Generic CSV File",
                                    "Owner": "passau"
                                }
                            }
                        ],
                        "Parameters": [
                            {
                                "ParameterType": "Mode",
                                "DefaultValue": "B (no child parameters)",
                                "HasDefaultValue": true,
                                "HasRules": false,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "Mode Parameter 1",
                                "FriendlyName": "Mode Parameter 1",
                                "ParameterRules": [],
                                "CredentialDescriptor": null,
                                "ModeValuesInfo": {
                                    "A (1 child parameter)": {
                                        "InterfaceString": "interface string 1",
                                        "Parameters": [
                                            {
                                                "ParameterType": "Mode",
                                                "DefaultValue": "C (no child parameters)",
                                                "HasDefaultValue": true,
                                                "HasRules": false,
                                                "IsOptional": false,
                                                "MarkupType": 0,
                                                "Name": "Child of A",
                                                "FriendlyName": "Child of A",
                                                "ParameterRules": [],
                                                "CredentialDescriptor": null,
                                                "ModeValuesInfo": {
                                                    "C (no child parameters)": {
                                                        "InterfaceString": "interface string 2",
                                                        "Parameters": []
                                                    },
                                                    "D (2 child parameters)": {
                                                        "InterfaceString": "interface string 1",
                                                        "Parameters": [
                                                            {
                                                                "ParameterType": "Int",
                                                                "DefaultValue": "10",
                                                                "HasDefaultValue": true,
                                                                "HasRules": true,
                                                                "IsOptional": false,
                                                                "MarkupType": 0,
                                                                "Name": "Child of D (1)",
                                                                "FriendlyName": "Child of D (1)",
                                                                "ParameterRules": [
                                                                    {
                                                                        "__type": "ParameterRuleInt:#Microsoft.MetaAnalytics",
                                                                        "Max": 90,
                                                                        "Min": 10
                                                                    }
                                                                ],
                                                                "CredentialDescriptor": null
                                                            },
                                                            {
                                                                "ParameterType": "Int",
                                                                "DefaultValue": "40",
                                                                "HasDefaultValue": true,
                                                                "HasRules": true,
                                                                "IsOptional": true,
                                                                "MarkupType": 0,
                                                                "Name": "Child of D (2)",
                                                                "FriendlyName": "Child of D (2)",
                                                                "ParameterRules": [
                                                                    {
                                                                        "__type": "ParameterRuleInt:#Microsoft.MetaAnalytics",
                                                                        "Max": 50,
                                                                        "Min": 30
                                                                    }
                                                                ],
                                                                "CredentialDescriptor": null
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    "B (no child parameters)": {
                                        "InterfaceString": "interface string 2",
                                        "Parameters": []
                                    }
                                }
                            },
                            {
                                "ParameterType": "Float",
                                "DefaultValue": "0.5",
                                "HasDefaultValue": true,
                                "HasRules": true,
                                "IsOptional": false,
                                "MarkupType": 0,
                                "Name": "Float Parameter",
                                "FriendlyName": "Float Parameter",
                                "ParameterRules": [
                                    {
                                        "__type": "ParameterRuleFloat:#Microsoft.MetaAnalytics",
                                        "Max": 0.9,
                                        "Min": 0.2
                                    }
                                ],
                                "CredentialDescriptor": null
                            }
                        ]
                    },
                    "Name": "ModuleWithNestedRelevantParameters",
                    "NextVersionModuleId": null,
                    "Owner": "REDMOND\\yikei",
                    "ServiceVersion": 0,
                    "Size": 0,
                    "Version": "1.0"
                };
                Modules.DataReferenceModule = {
                    "Category": "Data",
                    "Id": "4459e00fe5af410ca1bc83a5ab8dc13c.DataReferenceModule.DataEndpoint",
                    "Version": "1.0",
                    "FamilyId": "DataReferenceModule",
                    "Name": "AzureBlobReference",
                    "Description": null,
                    "ResourceUploadId": null,
                    "IsDeterministic": false,
                    "IsLatest": true,
                    "ClientVersion": null,
                    "ServiceVersion": 0,
                    "Size": 0,
                    "EscalationEmail": null,
                    "InformationUrl": null,
                    "CreatedDate": "/Date(-62135596800000)/",
                    "Owner": "DataLab",
                    "IsBlocking": false,
                    "InterfaceString": "GetAzureBlobReference",
                    "ModuleInterface": {
                        "InputPorts": [
                            {
                                "Types": [
                                    {
                                        "Id": "Any",
                                        "Name": "Any Data",
                                        "Description": "Data for any type for ReferenceModule",
                                        "IsDirectory": false,
                                        "CreatedDate": "/Date(-62135596800000)/",
                                        "Owner": "DataLab",
                                        "FileExtension": "",
                                        "ContentType": "*/*"
                                    }
                                ],
                                "Name": "Write",
                                "FriendlyName": "Write",
                                "IsOptional": true,
                                "MarkupType": 2
                            }
                        ],
                        "OutputPorts": [
                            {
                                "Type": {
                                    "Id": "Any",
                                    "Name": "Any Data",
                                    "Description": "Data for any type for ReferenceModule",
                                    "IsDirectory": false,
                                    "CreatedDate": "/Date(-62135596800000)/",
                                    "Owner": "DataLab",
                                    "FileExtension": "",
                                    "ContentType": "*/*"
                                },
                                "Name": "Read",
                                "FriendlyName": "Read",
                                "IsOptional": false,
                                "MarkupType": 3
                            }
                        ],
                        "Parameters": [
                            {
                                "HasRules": false,
                                "Name": "Name",
                                "FriendlyName": "Name",
                                "IsOptional": true,
                                "ParameterType": "String",
                                "ParameterRules": [],
                                "MarkupType": 0,
                                "HasDefaultValue": true,
                                "DefaultValue": "AzureBlobData",
                                "ScriptName": "",
                                "CredentialDescriptor": null
                            },
                            {
                                "HasRules": false,
                                "Name": "Url",
                                "FriendlyName": "Url",
                                "IsOptional": false,
                                "ParameterType": "String",
                                "ParameterRules": [],
                                "MarkupType": 0,
                                "HasDefaultValue": true,
                                "DefaultValue": "/container/blob",
                                "ScriptName": "",
                                "CredentialDescriptor": null
                            },
                            {
                                "HasRules": false,
                                "Name": "DefaultEndpointsProtocol",
                                "FriendlyName": "DefaultEndpointsProtocol",
                                "IsOptional": false,
                                "ParameterType": "String",
                                "ParameterRules": [],
                                "MarkupType": 0,
                                "HasDefaultValue": true,
                                "DefaultValue": "https",
                                "ScriptName": "",
                                "CredentialDescriptor": null
                            },
                            {
                                "HasRules": false,
                                "Name": "AccountName",
                                "FriendlyName": "AccountName",
                                "IsOptional": false,
                                "ParameterType": "String",
                                "ParameterRules": [],
                                "MarkupType": 0,
                                "HasDefaultValue": true,
                                "DefaultValue": "myAccount",
                                "ScriptName": "",
                                "CredentialDescriptor": null
                            },
                            {
                                "HasRules": false,
                                "Name": "AccountKey",
                                "FriendlyName": "AccountKey",
                                "IsOptional": false,
                                "ParameterType": "Credential",
                                "ParameterRules": [],
                                "MarkupType": 0,
                                "HasDefaultValue": false,
                                "DefaultValue": "",
                                "ScriptName": "",
                                "CredentialDescriptor": {
                                    "CredentialType": "AzureStorageCredential",
                                    "CredentialKeyParts": [
                                        "AccountName"
                                    ]
                                }
                            },
                            {
                                "HasRules": false,
                                "Name": "FileType",
                                "FriendlyName": "FileType",
                                "IsOptional": true,
                                "ParameterType": "String",
                                "ParameterRules": [],
                                "MarkupType": 0,
                                "HasDefaultValue": true,
                                "DefaultValue": "File",
                                "ScriptName": "",
                                "CredentialDescriptor": null
                            }
                        ],
                        "InterfaceString": null
                    },
                    "DownloadLocation": null,
                    "CloudSystem": "DataEndpoint",
                    "ModuleType": "DataReferenceModule",
                    "DataReferenceEndpointType": "DataEndpoint",
                    "ScriptsDefaultContents": null
                };
            })(Modules = TestData.Modules || (TestData.Modules = {}));
            ;
            var Datasets;
            (function (Datasets) {
                Datasets.IntegerFile = {
                    "CreatedDate": "\/Date(1343867020000)\/",
                    "DataTypeId": "GenericTSV",
                    "Description": "A TSV file containing numbers",
                    "ExperimentId": "",
                    "Hash": "377ED818532C5585F13E3BBE48887808",
                    "Id": "b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f",
                    "FamilyId": "IntegerFile",
                    "ServiceVersion": 1,
                    "IsExperiment": false,
                    "IsLatest": true,
                    "Name": "IntegerFile1",
                    "Owner": "REDMOND\\ramraman",
                    "Size": 25,
                    "SourceOrigin": "FromResourceUpload",
                    "DownloadLocation": {
                        "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                        "IsDirectory": false,
                        "Name": "traindata.csv",
                        "Location": "experimentoutput\/e1fba15e-78f8-4267-91ac-e4d6e526e3ca",
                        "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=ag5PjFCk3Rgx0cAuVpz7KFGrG90k3ikIe3WWGUbWsBE%3D",
                        "Size": 2000,
                        "IsAuxiliary": true
                    }
                };
                Datasets.OldIntegerFile = {
                    "CreatedDate": "\/Date(1343867020000)\/",
                    "DataTypeId": "GenericTSV",
                    "Description": "A TSV file containing numbers",
                    "ExperimentId": "",
                    "Hash": "377ED818532C5585F13E3BBE48887808",
                    "Id": "b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278522f",
                    "FamilyId": "IntegerFile",
                    "ServiceVersion": 0,
                    "IsExperiment": false,
                    "IsLatest": false,
                    "Name": "OldIntegerFile1",
                    "Owner": "REDMOND\\ramraman",
                    "Size": 25,
                    "SourceOrigin": "FromResourceUpload",
                    "DownloadLocation": {
                        "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                        "IsDirectory": false,
                        "Name": "traindata.csv",
                        "Location": "experimentoutput\/e1fba15e-78f8-4267-91ac-e4d6e526e3ca",
                        "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=ag5PjFCk3Rgx0cAuVpz7KFGrG90k3ikIe3WWGUbWsBE%3D",
                        "Size": 2000,
                        "IsAuxiliary": true
                    }
                };
                Datasets.FakeData = {
                    "CreatedDate": "\/Date(1343867020000)\/",
                    "DataTypeId": "GenericCSV",
                    "Description": "A CSV file containing numbers",
                    "ExperimentId": "",
                    "Hash": "566ED818532C5585F13E3BBE48887808",
                    "Id": "c08435290b064b26ae2bd45588687a0d.FakeData.4f2a27b899454199972860cf2278532t",
                    "FamilyId": "FakeData",
                    "ServiceVersion": 0,
                    "IsExperiment": false,
                    "IsLatest": true,
                    "Name": "FakeData",
                    "Owner": "NORTHAMERICA\\misavafi",
                    "Size": 50,
                    "SourceOrigin": "FromResourceUpload",
                    "DownloadLocation": {
                        "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                        "IsDirectory": false,
                        "Name": "traindata.csv",
                        "Location": "experimentoutput\/e1fba15e-78f8-4267-91ac-e4d6e526e3ca",
                        "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=ag5PjFCk3Rgx0cAuVpz7KFGrG90k3ikIe3WWGUbWsBE%3D",
                        "Size": 2000,
                        "IsAuxiliary": true
                    }
                };
                Datasets.SpyNet = {
                    "CreatedDate": "\/Date(1347432997000)\/",
                    "DataTypeId": "GenericCSV",
                    "Description": "Protection Services Data for Demo",
                    "ExperimentId": "",
                    "Hash": "8BE123FAD59567AE8D104489E35A8142",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.SpyNet.0801c01881d24297a53095eb01f81a2a",
                    "FamilyId": "SpyNet",
                    "ServiceVersion": 0,
                    "IsExperiment": false,
                    "IsLatest": true,
                    "Name": "spynet demo data",
                    "Owner": "REDMOND\\mikecl",
                    "Size": 0,
                    "SourceOrigin": "FromResourceUpload",
                    "DownloadLocation": {
                        "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                        "IsDirectory": false,
                        "Name": "traindata.csv",
                        "Location": "experimentoutput\/e1fba15e-78f8-4267-91ac-e4d6e526e3ca",
                        "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=ag5PjFCk3Rgx0cAuVpz7KFGrG90k3ikIe3WWGUbWsBE%3D",
                        "Size": 2000,
                        "IsAuxiliary": true
                    }
                };
                Datasets.BreastCancer = {
                    "CreatedDate": "\/Date(1346165160000)\/",
                    "DataTypeId": "GenericCSV",
                    "Description": "The Breast Cancer test data set. ",
                    "ExperimentId": "",
                    "Hash": "52B89051B9BD37A91A54E8570B963719",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.BreastCancer.175886960b4a4ead8759b4d88889c609",
                    "FamilyId": "BreastCancer",
                    "ServiceVersion": 0,
                    "IsExperiment": false,
                    "IsLatest": true,
                    "Name": "BreastCancerData",
                    "Owner": "REDMOND\\adhurwit",
                    "Size": 0,
                    "SourceOrigin": "FromResourceUpload",
                    "DownloadLocation": {
                        "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                        "IsDirectory": false,
                        "Name": "traindata.csv",
                        "Location": "experimentoutput\/e1fba15e-78f8-4267-91ac-e4d6e526e3ca",
                        "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=ag5PjFCk3Rgx0cAuVpz7KFGrG90k3ikIe3WWGUbWsBE%3D",
                        "Size": 2000,
                        "IsAuxiliary": true
                    }
                };
                Datasets.SomeText = {
                    "CreatedDate": "\/Date(1345124716000)\/",
                    "DataTypeId": "PlainText",
                    "Description": "This is a description",
                    "ExperimentId": "",
                    "Hash": "81334B1FA5A7121244FC06E6E379016D",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.SomeText.2e5d65771d4245e8a720ed8e70e61c26",
                    "FamilyId": "SomeText",
                    "ServiceVersion": 0,
                    "IsExperiment": false,
                    "IsLatest": true,
                    "Name": "Some App Config",
                    "Owner": "REDMOND\\randyd",
                    "Size": 331,
                    "SourceOrigin": "FromResourceUpload",
                    "DownloadLocation": {
                        "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                        "IsDirectory": false,
                        "Name": "traindata.csv",
                        "Location": "experimentoutput\/e1fba15e-78f8-4267-91ac-e4d6e526e3ca",
                        "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=ag5PjFCk3Rgx0cAuVpz7KFGrG90k3ikIe3WWGUbWsBE%3D",
                        "Size": 2000,
                        "IsAuxiliary": true
                    }
                };
            })(Datasets = TestData.Datasets || (TestData.Datasets = {}));
            var TrainedModels;
            (function (TrainedModels) {
                TrainedModels.SomeText = {
                    "CreatedDate": "\/Date(1345124716000)\/",
                    "DataTypeId": "PlainText",
                    "Description": "This is a description",
                    "ExperimentId": "",
                    "Hash": "81334B1FA5A7121244FC06E6E379016D",
                    "Id": "1b90f1f9d6f9424484c21ffea9fd98f6.SomeText.2e5d65771d4245e8a720ed8e70e61c26",
                    "FamilyId": "SomeText",
                    "ServiceVersion": 0,
                    "IsExperiment": false,
                    "IsLatest": true,
                    "Name": "Trained Model",
                    "Owner": "REDMOND\\randyd",
                    "Size": 331,
                    "SourceOrigin": "FromResourceUpload",
                    "DownloadLocation": {
                        "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                        "IsDirectory": false,
                        "Name": "traindata.csv",
                        "Location": "experimentoutput\/e1fba15e-78f8-4267-91ac-e4d6e526e3ca",
                        "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=ag5PjFCk3Rgx0cAuVpz7KFGrG90k3ikIe3WWGUbWsBE%3D",
                        "Size": 2000,
                        "IsAuxiliary": true
                    }
                };
            })(TrainedModels = TestData.TrainedModels || (TestData.TrainedModels = {}));
            var Transforms;
            (function (Transforms) {
                Transforms.SomeText = {
                    "CreatedDate": "\/Date(1345124716000)\/",
                    "DataTypeId": "PlainText",
                    "Description": "This is a description",
                    "ExperimentId": "",
                    "Hash": "81334B1FA5A7121244FC06E6E379016D",
                    "Id": "151e9a0cb3c743e197f58cfbdffa349c.SomeText.358a1c0304b1426ca6687baa414da410",
                    "FamilyId": "SomeText",
                    "ServiceVersion": 0,
                    "IsExperiment": false,
                    "IsLatest": true,
                    "Name": "Transformation",
                    "Owner": "NORTHAMERICA\\andlin",
                    "Size": 331,
                    "SourceOrigin": "FromResourceUpload",
                    "DownloadLocation": {
                        "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                        "IsDirectory": false,
                        "Name": "transform.csv",
                        "Location": "experimentoutput\/e1fba15e-78f8-4267-91ac-e4d6e526e3ca",
                        "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=ag5PjFCk3Rgx0cAuVpz7KFGrG90k3ikIe3WWGUbWsBE%3D",
                        "Size": 2000,
                        "IsAuxiliary": true
                    }
                };
            })(Transforms = TestData.Transforms || (TestData.Transforms = {}));
            TestData.ModuleMap = {};
            DataLab.Util.forEach(Modules, function (testModule) {
                TestData.ModuleMap[testModule.Id] = testModule;
            });
            TestData.DatasetMap = {};
            DataLab.Util.forEach(Datasets, function (dataset) {
                TestData.DatasetMap[dataset.Id] = dataset;
            });
            TestData.TrainedModelMap = {};
            DataLab.Util.forEach(TrainedModels, function (trainedModel) {
                TestData.TrainedModelMap[trainedModel.Id] = trainedModel;
            });
            TestData.TransformMap = {};
            DataLab.Util.forEach(Transforms, function (transform) {
                TestData.TransformMap[transform.Id] = transform;
            });
            var Experiments;
            (function (Experiments) {
                Experiments.SimpleExperiment = {
                    "SchemaVersion": 1.0,
                    "Description": "Experiment: One dataset and one module experiment",
                    "Summary": "Sample experiment summary",
                    "OriginalExperimentDocumentationLink": "http://studio.azureml.net",
                    "ExperimentId": "ContractTestDataWorkspace.SimpleExperiment",
                    "ParentExperimentId": "ContractTestDataWorkspace.FakeExperiment",
                    "Creator": "user1",
                    "Etag": null,
                    "IsArchived": false,
                    "IsLeaf": true,
                    "Graph": {
                        "Parameters": [],
                        "EdgesInternal": [],
                        "ModuleNodes": [
                            {
                                "Id": "c55ef8c5",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": "b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f",
                                        "Name": "Input0",
                                        "NodeId": "c55ef8c5"
                                    }
                                ],
                                "ModuleId": "b90435290b064b26ae2bd45588687a0d.adderFamily.a4640931d0ff46ebb5adcdfddc34455b",
                                "ModuleParameters": [],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "Output0",
                                        "NodeId": "c55ef8c5"
                                    }
                                ]
                            }
                        ],
                        "SerializedClientData": "<?xml version=\"1.0\" encoding=\"utf-16\"?>\r\n<DataV1 xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\r\n  <Meta />\r\n  <NodePositions>\r\n    <NodePosition Node=\"c55ef8c5\" Position=\"44,166,200,60\" />\r\n    <NodePosition Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" Position=\"30,30,200,60\" />\r\n  </NodePositions>\r\n  <NodePositions2>\r\n    <NodePosition2 Node=\"c55ef8c5\" Position=\"44,166,200,60\" ConnectedTo=\"\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"c55ef8c5\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"49e79585\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"8e09078e\" />\r\n  </NodePositions2>\r\n  <NodeGroups />\r\n</DataV1>",
                        "PublishInfo": {
                            "InputPortsForPublish": [],
                            "OutputPortsForPublish": []
                        }
                    },
                    "NodeStatuses": [],
                    "Status": {
                        "CreationTime": "/Date(1345149960982)/",
                        "EndTime": "/Date(1345150113034)/",
                        "StartTime": "/Date(1345150037008)/",
                        "StatusCode": "3",
                        "StatusDetail": "None"
                    }
                };
                Experiments.ExperimentWithOldResources = {
                    "SchemaVersion": 1.0,
                    "Description": "Things are outdated",
                    "Summary": "Sample experiment summary",
                    "OriginalExperimentDocumentationLink": "http://studio.azureml.net",
                    "ExperimentId": "ContractTestDataWorkspace.ExperimentWithOldResources",
                    "ParentExperimentId": "ContractTestDataWorkspace.SimpleExperiment",
                    "Creator": "user1",
                    "Etag": null,
                    "IsArchived": false,
                    "IsLeaf": true,
                    "Graph": {
                        "Parameters": [],
                        "EdgesInternal": [],
                        "ModuleNodes": [
                            {
                                "Id": "c55ef8c5",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": "b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278522f",
                                        "Name": "Input0",
                                        "NodeId": "c55ef8c5"
                                    }
                                ],
                                "ModuleId": "b90435290b064b26ae2bd45588687a0d.adderFamily.a4640931d0ff46ebb5adcdfddc32222b",
                                "ModuleParameters": [],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "Output0",
                                        "NodeId": "c55ef8c5"
                                    }
                                ]
                            }
                        ],
                        "SerializedClientData": "<?xml version=\"1.0\" encoding=\"utf-16\"?>\r\n<DataV1 xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\r\n  <Meta />\r\n  <NodePositions>\r\n    <NodePosition Node=\"c55ef8c5\" Position=\"44,166,200,60\" />\r\n    <NodePosition Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" Position=\"30,30,200,60\" />\r\n  </NodePositions>\r\n  <NodePositions2>\r\n    <NodePosition2 Node=\"c55ef8c5\" Position=\"44,166,200,60\" ConnectedTo=\"\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"c55ef8c5\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"49e79585\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"8e09078e\" />\r\n  </NodePositions2>\r\n  <NodeGroups />\r\n</DataV1>",
                        "PublishInfo": {
                            "InputPortsForPublish": [],
                            "OutputPortsForPublish": []
                        }
                    },
                    "NodeStatuses": [],
                    "Status": {
                        "CreationTime": "/Date(1345149960982)/",
                        "EndTime": "/Date(1345150113034)/",
                        "StartTime": "/Date(1345150037008)/",
                        "StatusCode": "3",
                        "StatusDetail": "None"
                    }
                };
                Experiments.ExperimentWithComments = {
                    "SchemaVersion": 1.0,
                    "Description": "Experiment: One dataset and one module experiment",
                    "Summary": "Sample experiment summary",
                    "OriginalExperimentDocumentationLink": "http://studio.azureml.net",
                    "ExperimentId": "ContractTestDataWorkspace.ExperimentWithComments",
                    "ParentExperimentId": "ContractTestDataWorkspace.FakeExperiment",
                    "Creator": "patrick",
                    "Etag": null,
                    "IsArchived": false,
                    "IsLeaf": true,
                    "Graph": {
                        "Parameters": [],
                        "EdgesInternal": [],
                        "ModuleNodes": [
                            {
                                "Id": "c55ef8c5",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": "b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f",
                                        "Name": "Input0",
                                        "NodeId": "c55ef8c5"
                                    }
                                ],
                                "ModuleId": "b90435290b064b26ae2bd45588687a0d.adderFamily.a4640931d0ff46ebb5adcdfddc34455b",
                                "ModuleParameters": [],
                                "Comment": "Mate, a comment",
                                "OutputPortsInternal": [
                                    {
                                        "Name": "Output0",
                                        "NodeId": "c55ef8c5"
                                    }
                                ]
                            }
                        ],
                        "SerializedClientData": "<?xml version=\"1.0\" encoding=\"utf-16\"?>\r\n<DataV1 xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\r\n  <Meta />\r\n  <NodePositions>\r\n    <NodePosition Node=\"c55ef8c5\" Position=\"44,166,200,60\" />\r\n    <NodePosition Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" Position=\"30,30,200,60\" />\r\n  </NodePositions>\r\n  <NodePositions2>\r\n    <NodePosition2 Node=\"c55ef8c5\" Position=\"44,166,200,60\" ConnectedTo=\"\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"c55ef8c5\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"49e79585\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"8e09078e\" />\r\n  </NodePositions2>\r\n  <NodeGroups />\r\n</DataV1>",
                        "PublishInfo": {
                            "InputPortsForPublish": [],
                            "OutputPortsForPublish": []
                        }
                    },
                    "NodeStatuses": [],
                    "Status": {
                        "CreationTime": "/Date(1345149960982)/",
                        "EndTime": "/Date(1345150113034)/",
                        "StartTime": "/Date(1345150037008)/",
                        "StatusCode": "3",
                        "StatusDetail": "None"
                    }
                };
                Experiments.WebServiceParameters = {
                    "SchemaVersion": 1.0,
                    "Description": "Linking parameters is fun",
                    "Summary": "Sample experiment summary",
                    "OriginalExperimentDocumentationLink": "http://studio.azureml.net",
                    "ExperimentId": "ContractTestDataWorkspace.WebServiceParameters",
                    "ParentExperimentId": "ContractTestDataWorkspace.FakeExperiment",
                    "Creator": "rickweb",
                    "Etag": null,
                    "IsArchived": false,
                    "IsLeaf": true,
                    "Graph": {
                        "EdgesInternal": [],
                        "ModuleNodes": [
                            {
                                "Id": "c55ef8c5",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": null,
                                        "TrainedModelId": null,
                                        "TransformModuleId": null,
                                        "Name": "trained-model",
                                        "NodeId": "c55ef8c5"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.ParameterTest.75beea5ecb924aa3bfce46001fb93f08",
                                "ModuleParameters": [
                                    {
                                        "Name": "Color",
                                        "LinkedGlobalParameter": "My fancy experiment parameter",
                                        "ValueType": "Liternal",
                                        "Value": "This is module parameter value"
                                    },
                                    {
                                        "Name": "InitialValue",
                                        "LinkedGlobalParameter": "My fancy validated experiment parameter",
                                        "ValueType": "Literal",
                                        "Value": "123"
                                    }
                                ],
                                "Comment": "Click me if you dare",
                                "OutputPortsInternal": [
                                    {
                                        "Name": "publish-data",
                                        "NodeId": "c55ef8c5"
                                    }
                                ]
                            }
                        ],
                        "SerializedClientData": "<?xml version=\"1.0\" encoding=\"utf-16\"?>\r\n<DataV1 xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\r\n  <Meta />\r\n  <NodePositions>\r\n    <NodePosition Node=\"c55ef8c5\" Position=\"44,166,200,60\" />\r\n    <NodePosition Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" Position=\"30,30,200,60\" />\r\n  </NodePositions>\r\n  <NodePositions2>\r\n    <NodePosition2 Node=\"c55ef8c5\" Position=\"44,166,200,60\" ConnectedTo=\"\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"c55ef8c5\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"49e79585\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"8e09078e\" />\r\n  </NodePositions2>\r\n  <NodeGroups />\r\n</DataV1>",
                        "PublishInfo": {
                            "InputPortsForPublish": [],
                            "OutputPortsForPublish": []
                        }
                    },
                    "NodeStatuses": [],
                    "Status": {
                        "CreationTime": "/Date(1345149960982)/",
                        "EndTime": "/Date(1345150113034)/",
                        "StartTime": "/Date(1345150037008)/",
                        "StatusCode": "3",
                        "StatusDetail": "None"
                    },
                    "WebService": {
                        "Parameters": [
                            {
                                "Name": "My fancy experiment parameter",
                                "FriendlyName": "My fancy experiment parameter",
                                "Value": "This is experiment level",
                                "ParameterDefinition": {
                                    "ParameterType": "String",
                                    "DefaultValue": "This is experiment level",
                                    "HasDefaultValue": true,
                                    "HasRules": false,
                                    "IsOptional": false,
                                    "MarkupType": 0,
                                    "Name": "My fancy experiment parameter",
                                    "FriendlyName": "My fancy experiment parameter",
                                    "CredentialDescriptor": null,
                                    "ParameterRules": []
                                }
                            },
                            {
                                "Name": "My fancy validated experiment parameter",
                                "Value": "123",
                                "ParameterDefinition": {
                                    "ParameterType": "Int",
                                    "DefaultValue": "123",
                                    "HasDefaultValue": true,
                                    "HasRules": false,
                                    "IsOptional": false,
                                    "MarkupType": 0,
                                    "Name": "My fancy validated experiment parameter",
                                    "FriendlyName": "My fancy validated experiment parameter",
                                    "CredentialDescriptor": null,
                                    "ParameterRules": [
                                        {
                                            "Max": 90,
                                            "Min": 10
                                        }
                                    ]
                                }
                            },
                        ]
                    }
                };
                Experiments.FakeExperiment = {
                    "SchemaVersion": 1.0,
                    "Description": "Experiment: Fake data feeding experiment",
                    "Summary": "Sample experiment summary",
                    "OriginalExperimentDocumentationLink": "http://studio.azureml.net",
                    "ExperimentId": "ContractTestDataWorkspace.FakeExperiment",
                    "ParentExperimentId": null,
                    "Creator": "user1",
                    "Etag": null,
                    "IsArchived": false,
                    "IsLeaf": true,
                    "Graph": {
                        "Parameters": [],
                        "EdgesInternal": [],
                        "ModuleNodes": [
                            {
                                "Id": "0e76223a",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": "c08435290b064b26ae2bd45588687a0d.FakeData.4f2a27b899454199972860cf2278532t",
                                        "Name": "inputdata.csv",
                                        "NodeId": "0e76223a"
                                    }
                                ],
                                "ModuleId": "7890f1f9d6f9424484c21ffea9fd98f6.FakeModule.c4250e129d7e4d688fa012416a2858sd",
                                "ModuleParameters": [
                                    {
                                        "Name": "IntegerParameter",
                                        "Value": "70",
                                        "ValueType": "Literal",
                                    },
                                    {
                                        "Name": "FloatParameter",
                                        "Value": "0.5",
                                        "ValueType": "Literal",
                                    },
                                    {
                                        "Name": "EnumParameter",
                                        "Value": "option1",
                                        "ValueType": "Literal",
                                    }
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "traindata.csv",
                                        "NodeId": "0e76223a"
                                    },
                                    {
                                        "Name": "validatedata.csv",
                                        "NodeId": "0e76223a"
                                    }
                                ]
                            }
                        ],
                        "SerializedClientData": "<?xml version=\"1.0\" encoding=\"utf-16\"?>\r\n<DataV1 xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\r\n  <Meta />\r\n  <NodePositions>\r\n    <NodePosition Node=\"0e76223a\" Position=\"44,166,200,64\" />\r\n    <NodePosition Node=\"c08435290b064b26ae2bd45588687a0d.FakeData.4f2a27b899454199972860cf2278532t\" Position=\"30,30,200,64\" />\r\n  </NodePositions>\r\n  <NodePositions2>\r\n    <NodePosition2 Node=\"0e76223a\" Position=\"44,166,200,64\" ConnectedTo=\"\" />\r\n    <NodePosition2 Node=\"c08435290b064b26ae2bd45588687a0d.FakeData.4f2a27b899454199972860cf2278532t\" nid=\"\" Position=\"30,30,200,64\" ConnectedTo=\"0e76223a\" />\r\n  </NodePositions2>\r\n  <NodeGroups />\r\n</DataV1>",
                        "PublishInfo": {
                            "InputPortsForPublish": [],
                            "OutputPortsForPublish": []
                        }
                    },
                    "NodeStatuses": [],
                    "Status": {
                        "CreationTime": "/Date(1345149960982)/",
                        "EndTime": "/Date(1345150113034)/",
                        "StartTime": "/Date(1345150037008)/",
                        "StatusCode": "3",
                        "StatusDetail": "None"
                    }
                };
                Experiments.RunWithLSVM = {
                    "SchemaVersion": 1.0,
                    "Description": "Run with LSVM",
                    "Summary": "Sample experiment summary",
                    "OriginalExperimentDocumentationLink": "http://studio.azureml.net",
                    "ExperimentId": "ContractTestDataWorkspace.RunWithLSVM",
                    "ParentExperimentId": null,
                    "Creator": "user1",
                    "Etag": null,
                    "IsArchived": false,
                    "IsLeaf": true,
                    "Graph": {
                        "Parameters": [],
                        "EdgesInternal": [
                            {
                                "DestinationInputPortId": "cbd35237:inputdata.csv",
                                "SourceOutputPortId": "0e76223a:traindata.csv"
                            },
                            {
                                "DestinationInputPortId": "4f730157:trained-model",
                                "SourceOutputPortId": "cbd35237:trained-model"
                            },
                            {
                                "DestinationInputPortId": "4f730157:inputdata.csv",
                                "SourceOutputPortId": "0e76223a:validatedata.csv"
                            }
                        ],
                        "ModuleNodes": [
                            {
                                "Id": "0e76223a",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": "1b90f1f9d6f9424484c21ffea9fd98f6.SpyNet.0801c01881d24297a53095eb01f81a2a",
                                        "Name": "inputdata.csv",
                                        "NodeId": "0e76223a"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.RandomFileSplitter.c4250e129d7e4d688fa012416a28585d",
                                "ModuleParameters": [
                                    {
                                        "Name": "Percentage",
                                        "Value": "80",
                                        "ValueType": "Literal"
                                    }
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "traindata.csv",
                                        "NodeId": "0e76223a"
                                    },
                                    {
                                        "Name": "validatedata.csv",
                                        "NodeId": "0e76223a"
                                    }
                                ]
                            },
                            {
                                "Id": "cbd35237",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": null,
                                        "Name": "inputdata.csv",
                                        "NodeId": "cbd35237"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.SamosTrain.299b196fa2e7413e9c555c63963b85a2",
                                "ModuleParameters": [
                                    {
                                        "Name": "OperatorName",
                                        "Value": "LinearSVM",
                                        "ValueType": "Literal",
                                    }
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "trained-model",
                                        "NodeId": "cbd35237"
                                    }
                                ]
                            },
                            {
                                "Id": "4f730157",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": null,
                                        "Name": "trained-model",
                                        "NodeId": "4f730157"
                                    },
                                    {
                                        "DataSourceId": null,
                                        "Name": "inputdata.csv",
                                        "NodeId": "4f730157"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.SamosValidate.92e69f6ff2fd415e810263d272a88fd5",
                                "ModuleParameters": [
                                    {
                                        "Name": "OperatorName",
                                        "Value": "LinearSVM",
                                        "ValueType": "Literal",
                                    }
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "confusion-matrix",
                                        "NodeId": "4f730157"
                                    },
                                    {
                                        "Name": "validation-results",
                                        "NodeId": "4f730157"
                                    }
                                ]
                            }
                        ],
                        "SerializedClientData": "<?xml version=\"1.0\" encoding=\"utf-16\"?>\u000d\u000a<DataV1 xmlns:xsd=\"http:\/\/www.w3.org\/2001\/XMLSchema\" xmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\">\u000d\u000a  <Meta \/>\u000d\u000a  <NodePositions>\u000d\u000a    <NodePosition Node=\"0e76223a\" Position=\"169,156,200,60\" \/>\u000d\u000a    <NodePosition Node=\"1b90f1f9d6f9424484c21ffea9fd98f6.SpyNet.0801c01881d24297a53095eb01f81a2a\" Position=\"190,30,200,60\" \/>\u000d\u000a    <NodePosition Node=\"cbd35237\" Position=\"115,296,200,60\" \/>\u000d\u000a    <NodePosition Node=\"4f730157\" Position=\"331,434,200,60\" \/>\u000d\u000a  <\/NodePositions>\u000d\u000a  <NodePositions2>\u000d\u000a    <NodePosition2 Node=\"0e76223a\" Position=\"169,156,200,60\" ConnectedTo=\"\" \/>\u000d\u000a    <NodePosition2 Node=\"1b90f1f9d6f9424484c21ffea9fd98f6.SpyNet.0801c01881d24297a53095eb01f81a2a\" nid=\"\" Position=\"190,30,200,60\" ConnectedTo=\"0e76223a\" \/>\u000d\u000a    <NodePosition2 Node=\"cbd35237\" Position=\"115,296,200,60\" ConnectedTo=\"\" \/>\u000d\u000a    <NodePosition2 Node=\"4f730157\" Position=\"331,434,200,60\" ConnectedTo=\"\" \/>\u000d\u000a  <\/NodePositions2>\u000d\u000a  <NodeGroups \/>\u000d\u000a<\/DataV1>",
                        "PublishInfo": {
                            "InputPortsForPublish": [],
                            "OutputPortsForPublish": []
                        }
                    },
                    "NodeStatuses": [
                        {
                            "NodeId": "0e76223a",
                            "OutputEndpoints": [
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "traindata.csv",
                                    "Location": "experimentoutput\/e1fba15e-78f8-4267-91ac-e4d6e526e3ca",
                                    "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=ag5PjFCk3Rgx0cAuVpz7KFGrG90k3ikIe3WWGUbWsBE%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                },
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "validatedata.csv",
                                    "Location": "experimentoutput\/3671ec00-0953-4723-9513-937a04c549fe",
                                    "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=ZcpD8py9%2Fo%2FaDYLFY%2B73CYGgtzk8SlDDx05F6aA%2Ftn4%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                }
                            ],
                            "StandardErrorEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "misavafi\/84315404-1556-4c5a-937f-d589f43f5a81",
                                "AccessCredential": "?st=2014-04-21T23%3A59%3A22Z&se=2014-04-22T00%3A59%3A22Z&sr=c&sp=r&sig=hm03%2BP0jCpPtbfpifauGzZc7jJMcPSTafAf3caJ%2Fzyc%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "StandardOutEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "experimentoutput\/30bec73f-6e76-4e49-af82-1910341bf462",
                                "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=d59mrlDD5sNunNEJwrVT4h%2FIGgPZm1izumJ3ZLVHe5Q%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "Status": {
                                "CreationTime": "\/Date(1347473156550)\/",
                                "EndTime": "\/Date(1347473156566)\/",
                                "StartTime": "\/Date(1347473156566)\/",
                                "StatusCode": "Failed",
                                "StatusDetail": "Task output was present in output cache"
                            }
                        },
                        {
                            "NodeId": "cbd35237",
                            "OutputEndpoints": [
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "trained-model",
                                    "Location": "experimentoutput\/83eb469e-8937-44ae-8202-ae6b01036983",
                                    "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=CCaTUViZGguR88QfrcHEf%2BD8FEs%2F0Xn8rGavv3JjWdc%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                }
                            ],
                            "StandardErrorEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "misavafi\/84315404-1556-4c5a-937f-d589f43f5a81",
                                "AccessCredential": "?st=2014-04-21T23%3A59%3A22Z&se=2014-04-22T00%3A59%3A22Z&sr=c&sp=r&sig=hm03%2BP0jCpPtbfpifauGzZc7jJMcPSTafAf3caJ%2Fzyc%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "StandardOutEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "experimentoutput\/39099b06-1a80-43bf-a50a-98fad3b91d37",
                                "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=rmDl%2B7zvl6td3cEfd%2BkynDq8079a3p5%2FvuMoCcjOAjc%3D",
                                "Size": 2000,
                                "IsAuxiliary": true
                            },
                            "Status": {
                                "CreationTime": "\/Date(1347473156878)\/",
                                "EndTime": "\/Date(1347473156878)\/",
                                "StartTime": "\/Date(1347473156878)\/",
                                "StatusCode": "Failed",
                                "StatusDetail": "Task output was present in output cache"
                            }
                        },
                        {
                            "NodeId": "4f730157",
                            "OutputEndpoints": [
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "confusion-matrix",
                                    "Location": "experimentoutput\/78e6a95f-5294-4ede-b6d4-39cb97bed47b",
                                    "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=LjOSJ%2FWjIxH3n1QLPDms0b7783ZRpmV%2FFrcbZwnVfWc%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                },
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "validation-results",
                                    "Location": "experimentoutput\/0b969aa6-85bd-4898-a424-8bac1f5127f4",
                                    "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=bL5sglitfAlR3zUCk6FuiCM3gdfTFWEJucRYq97x7UU%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                }
                            ],
                            "StandardErrorEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "misavafi\/84315404-1556-4c5a-937f-d589f43f5a81",
                                "AccessCredential": "?st=2014-04-21T23%3A59%3A22Z&se=2014-04-22T00%3A59%3A22Z&sr=c&sp=r&sig=hm03%2BP0jCpPtbfpifauGzZc7jJMcPSTafAf3caJ%2Fzyc%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "StandardOutEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "experimentoutput\/138a9599-1120-431d-98b8-a3e1daee1c31",
                                "AccessCredential": "?st=2012-09-26T05%3A01%3A37Z&se=2012-09-26T06%3A00%3A37Z&sr=b&sp=rl&sig=JUh4oQuxAGGTMbyR6eVAPwR4Ky7B8Y5O6SOXlvcyK4I%3D",
                                "Size": 2000,
                                "IsAuxiliary": true
                            },
                            "Status": {
                                "CreationTime": "\/Date(1347473157284)\/",
                                "EndTime": "\/Date(1347473157284)\/",
                                "StartTime": "\/Date(1347473157284)\/",
                                "StatusCode": "Running",
                                "StatusDetail": "Task output was present in output cache"
                            }
                        }
                    ],
                    "Status": {
                        "CreationTime": "\/Date(1347473157613)\/",
                        "EndTime": "\/Date(1347473160269)\/",
                        "StartTime": "\/Date(1347473160269)\/",
                        "StatusCode": "Failed",
                        "StatusDetail": "None"
                    }
                };
                Experiments.BreastCancer = {
                    "SchemaVersion": 1.0,
                    "Description": "Breast Cancer prediction",
                    "Summary": "Sample test summary",
                    "OriginalExperimentDocumentationLink": "http://studio.azureml.net",
                    "ExperimentId": "ContractTestDataWorkspace.BreastCancer",
                    "ParentExperimentId": null,
                    "Creator": "user1",
                    "Etag": null,
                    "IsArchived": false,
                    "IsLeaf": true,
                    "Graph": {
                        "Parameters": [],
                        "EdgesInternal": [
                            {
                                "DestinationInputPortId": "064d2838:inputdata.csv",
                                "SourceOutputPortId": "a0b38c43:outputdata.csv"
                            },
                            {
                                "DestinationInputPortId": "b9736843:inputdata.csv",
                                "SourceOutputPortId": "064d2838:traindata.csv"
                            },
                            {
                                "DestinationInputPortId": "4958e338:inputdata.csv",
                                "SourceOutputPortId": "b9736843:outputdata.csv"
                            },
                            {
                                "DestinationInputPortId": "2a9496c0:inputdata.csv",
                                "SourceOutputPortId": "4958e338:traindata.csv"
                            },
                            {
                                "DestinationInputPortId": "8c463a6d:trained-model",
                                "SourceOutputPortId": "2a9496c0:trained-model"
                            },
                            {
                                "DestinationInputPortId": "8c463a6d:inputdata.csv",
                                "SourceOutputPortId": "4958e338:validatedata.csv"
                            },
                            {
                                "DestinationInputPortId": "0a9224e2:trained-model",
                                "SourceOutputPortId": "2a9496c0:trained-model"
                            }
                        ],
                        "ModuleNodes": [
                            {
                                "Id": "a0b38c43",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": "1b90f1f9d6f9424484c21ffea9fd98f6.BreastCancer.175886960b4a4ead8759b4d88889c609",
                                        "Name": "inputdata.csv",
                                        "NodeId": "a0b38c43"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.MissingValuesRemover.364d6e6e2c194e3f9e216148a23513d8",
                                "ModuleParameters": [
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "outputdata.csv",
                                        "NodeId": "a0b38c43"
                                    }
                                ]
                            },
                            {
                                "Id": "064d2838",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": null,
                                        "Name": "inputdata.csv",
                                        "NodeId": "064d2838"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.CategoryColumnSelection.f1d2150711064f3e911fb3269a5cfb78",
                                "ModuleParameters": [
                                    {
                                        "Name": "Column",
                                        "Value": "11",
                                        "ValueType": "Literal",
                                    }
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "traindata.csv",
                                        "NodeId": "064d2838"
                                    }
                                ]
                            },
                            {
                                "Id": "b9736843",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": null,
                                        "Name": "inputdata.csv",
                                        "NodeId": "b9736843"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.DictionaryBinner.70368dd3cb854b46b4dd51b9ac280cdd",
                                "ModuleParameters": [
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "outputdata.csv",
                                        "NodeId": "b9736843"
                                    }
                                ]
                            },
                            {
                                "Id": "4958e338",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": null,
                                        "Name": "inputdata.csv",
                                        "NodeId": "4958e338"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.RandomFileSplitter.c4250e129d7e4d688fa012416a28585d",
                                "ModuleParameters": [
                                    {
                                        "Name": "Percentage",
                                        "Value": "70",
                                        "ValueType": "Literal",
                                    }
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "traindata.csv",
                                        "NodeId": "4958e338"
                                    },
                                    {
                                        "Name": "validatedata.csv",
                                        "NodeId": "4958e338"
                                    }
                                ]
                            },
                            {
                                "Id": "2a9496c0",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": null,
                                        "Name": "inputdata.csv",
                                        "NodeId": "2a9496c0"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.SamosTrain.299b196fa2e7413e9c555c63963b85a2",
                                "ModuleParameters": [
                                    {
                                        "Name": "OperatorName",
                                        "Value": "AveragedPerceptron",
                                        "ValueType": "Literal",
                                    }
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "trained-model",
                                        "NodeId": "2a9496c0"
                                    }
                                ]
                            },
                            {
                                "Id": "8c463a6d",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": null,
                                        "Name": "trained-model",
                                        "NodeId": "8c463a6d"
                                    },
                                    {
                                        "DataSourceId": null,
                                        "Name": "inputdata.csv",
                                        "NodeId": "8c463a6d"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.SamosValidate.92e69f6ff2fd415e810263d272a88fd5",
                                "ModuleParameters": [
                                    {
                                        "Name": "OperatorName",
                                        "Value": "AveragedPerceptron",
                                        "ValueType": "Literal",
                                    }
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "confusion-matrix",
                                        "NodeId": "8c463a6d"
                                    },
                                    {
                                        "Name": "validation-results",
                                        "NodeId": "8c463a6d"
                                    }
                                ]
                            },
                            {
                                "Id": "0a9224e2",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": null,
                                        "Name": "trained-model",
                                        "NodeId": "0a9224e2"
                                    }
                                ],
                                "ModuleId": "1b90f1f9d6f9424484c21ffea9fd98f6.SamosPublish.7a8fab7077f24d458760b3703bea0942",
                                "ModuleParameters": [
                                    {
                                        "Name": "OperatorName",
                                        "Value": "AveragedPerceptron",
                                        "ValueType": "Literal",
                                    }
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "publish-data",
                                        "NodeId": "0a9224e2"
                                    }
                                ]
                            }
                        ],
                        "SerializedClientData": "<?xml version=\"1.0\" encoding=\"utf-16\"?>\u000d\u000a<DataV1 xmlns:xsd=\"http:\/\/www.w3.org\/2001\/XMLSchema\" xmlns:xsi=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\">\u000d\u000a  <Meta \/>\u000d\u000a  <NodePositions>\u000d\u000a    <NodePosition Node=\"1b90f1f9d6f9424484c21ffea9fd98f6.BreastCancer.175886960b4a4ead8759b4d88889c609\" Position=\"33,30,200,60\" \/>\u000d\u000a    <NodePosition Node=\"a0b38c43\" Position=\"55,148,200,60\" \/>\u000d\u000a    <NodePosition Node=\"064d2838\" Position=\"98,267,200,60\" \/>\u000d\u000a    <NodePosition Node=\"b9736843\" Position=\"144,378,200,60\" \/>\u000d\u000a    <NodePosition Node=\"4958e338\" Position=\"201,477,200,60\" \/>\u000d\u000a    <NodePosition Node=\"2a9496c0\" Position=\"68,600,200,60\" \/>\u000d\u000a    <NodePosition Node=\"8c463a6d\" Position=\"332,700,200,60\" \/>\u000d\u000a    <NodePosition Node=\"0a9224e2\" Position=\"30,737,200,60\" \/>\u000d\u000a  <\/NodePositions>\u000d\u000a  <NodePositions2>\u000d\u000a    <NodePosition2 Node=\"1b90f1f9d6f9424484c21ffea9fd98f6.BreastCancer.175886960b4a4ead8759b4d88889c609\" nid=\"\" Position=\"33,30,200,60\" ConnectedTo=\"a0b38c43\" \/>\u000d\u000a    <NodePosition2 Node=\"a0b38c43\" Position=\"55,148,200,60\" ConnectedTo=\"\" \/>\u000d\u000a    <NodePosition2 Node=\"064d2838\" Position=\"98,267,200,60\" ConnectedTo=\"\" \/>\u000d\u000a    <NodePosition2 Node=\"b9736843\" Position=\"144,378,200,60\" ConnectedTo=\"\" \/>\u000d\u000a    <NodePosition2 Node=\"4958e338\" Position=\"201,477,200,60\" ConnectedTo=\"\" \/>\u000d\u000a    <NodePosition2 Node=\"2a9496c0\" Position=\"68,600,200,60\" ConnectedTo=\"\" \/>\u000d\u000a    <NodePosition2 Node=\"8c463a6d\" Position=\"332,700,200,60\" ConnectedTo=\"\" \/>\u000d\u000a    <NodePosition2 Node=\"0a9224e2\" Position=\"30,737,200,60\" ConnectedTo=\"\" \/>\u000d\u000a  <\/NodePositions2>\u000d\u000a  <NodeGroups \/>\u000d\u000a<\/DataV1>",
                        "PublishInfo": {
                            "InputPortsForPublish": [],
                            "OutputPortsForPublish": []
                        }
                    },
                    "NodeStatuses": [
                        {
                            "NodeId": "a0b38c43",
                            "OutputEndpoints": [
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "outputdata.csv",
                                    "Location": "experimentoutput\/4710bb2f-aa72-44db-b597-48c7f344c68b",
                                    "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=RLXoyuaeSA8c6PfaHl9L9uA89PBndZBOZce7hn6bC6A%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                }
                            ],
                            "StandardErrorEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "misavafi\/84315404-1556-4c5a-937f-d589f43f5a81",
                                "AccessCredential": "?st=2014-04-21T23%3A59%3A22Z&se=2014-04-22T00%3A59%3A22Z&sr=c&sp=r&sig=hm03%2BP0jCpPtbfpifauGzZc7jJMcPSTafAf3caJ%2Fzyc%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "StandardOutEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "experimentoutput\/7dcb5e9b-981f-480c-8d29-95f51ac6b301",
                                "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=lRlcfsgYpPO6fi5nXDzhanBbN5Gfw7s564V0efDoT8M%3D",
                                "Size": 2000,
                                "IsAuxiliary": true
                            },
                            "Status": {
                                "CreationTime": "\/Date(1346191200629)\/",
                                "EndTime": "\/Date(1346191209248)\/",
                                "StartTime": "\/Date(1346191205202)\/",
                                "StatusCode": "Finished",
                                "StatusDetail": "None"
                            }
                        },
                        {
                            "NodeId": "064d2838",
                            "OutputEndpoints": [
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "traindata.csv",
                                    "Location": "experimentoutput\/9f12560d-cf85-40fd-a3fc-5bd95dde99b5",
                                    "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=rDE0vJ6m0524ryNezFrzkSUpmGzYkL1NKupDCCePu5M%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                }
                            ],
                            "StandardErrorEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "misavafi\/84315404-1556-4c5a-937f-d589f43f5a81",
                                "AccessCredential": "?st=2014-04-21T23%3A59%3A22Z&se=2014-04-22T00%3A59%3A22Z&sr=c&sp=r&sig=hm03%2BP0jCpPtbfpifauGzZc7jJMcPSTafAf3caJ%2Fzyc%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "StandardOutEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "experimentoutput\/fea784fb-2299-4721-bb11-24b9f96a1a47",
                                "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=xG1fmnT23IkhJqdj%2Fai7gc%2BV9gJRnf2e6lWh0pkBrMA%3D",
                                "Size": 2000,
                                "IsAuxiliary": true
                            },
                            "Status": {
                                "CreationTime": "\/Date(1346191200739)\/",
                                "EndTime": "\/Date(1346191214342)\/",
                                "StartTime": "\/Date(1346191211170)\/",
                                "StatusCode": "Finished",
                                "StatusDetail": "None"
                            }
                        },
                        {
                            "NodeId": "b9736843",
                            "OutputEndpoints": [
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "outputdata.csv",
                                    "Location": "experimentoutput\/f30aed78-ad61-4ec5-9d65-ff3b162d8ada",
                                    "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=1kAJH21yCswYsC2QwjbDNHggkbHkfjlw8TEbVz2Ek7M%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                }
                            ],
                            "StandardErrorEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "misavafi\/84315404-1556-4c5a-937f-d589f43f5a81",
                                "AccessCredential": "?st=2014-04-21T23%3A59%3A22Z&se=2014-04-22T00%3A59%3A22Z&sr=c&sp=r&sig=hm03%2BP0jCpPtbfpifauGzZc7jJMcPSTafAf3caJ%2Fzyc%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "StandardOutEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "experimentoutput\/5ffeed3d-34c7-482e-8900-e06080094bc5",
                                "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=O1Lk1KNwudQlyZVnTT8qr0IXaYxyytz0XJqtrzpPNdE%3D",
                                "Size": 2000,
                                "IsAuxiliary": true
                            },
                            "Status": {
                                "CreationTime": "\/Date(1346191200770)\/",
                                "EndTime": "\/Date(1346191220029)\/",
                                "StartTime": "\/Date(1346191216373)\/",
                                "StatusCode": "Finished",
                                "StatusDetail": "None"
                            }
                        },
                        {
                            "NodeId": "4958e338",
                            "OutputEndpoints": [
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "traindata.csv",
                                    "Location": "experimentoutput\/7d0dd491-ede3-441e-9aa5-b1712c59edda",
                                    "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=wjQmKASxeYLMQdQjOUO975v%2FEf3SeX%2BxYVHtT%2FLHSm8%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                },
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "validatedata.csv",
                                    "Location": "experimentoutput\/f3c9080e-3f74-4e44-9e62-8a822af623e5",
                                    "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=9QtrqnRI4%2BqoGJnStaMkgSX6DnWAZ6iaE1N7C1BD87M%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                }
                            ],
                            "StandardErrorEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "misavafi\/84315404-1556-4c5a-937f-d589f43f5a81",
                                "AccessCredential": "?st=2014-04-21T23%3A59%3A22Z&se=2014-04-22T00%3A59%3A22Z&sr=c&sp=r&sig=hm03%2BP0jCpPtbfpifauGzZc7jJMcPSTafAf3caJ%2Fzyc%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "StandardOutEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "experimentoutput\/b851ffc1-fe88-4447-9bd8-d12125461790",
                                "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=2%2FE10TOxUOybEPNhxgBHM2YeSOaveLXLl1%2FPJfC%2B360%3D",
                                "Size": 2000,
                                "IsAuxiliary": true
                            },
                            "Status": {
                                "CreationTime": "\/Date(1346191200817)\/",
                                "EndTime": "\/Date(1346191227653)\/",
                                "StartTime": "\/Date(1346191222278)\/",
                                "StatusCode": "Finished",
                                "StatusDetail": "None"
                            }
                        },
                        {
                            "NodeId": "2a9496c0",
                            "OutputEndpoints": [
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "trained-model",
                                    "Location": "experimentoutput\/0adaee5e-6fac-4283-82b0-5585731e66ee",
                                    "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=a7vbgA0x4QhyiCEV0N%2FbfyCF9BFB1qrz80h%2BFfHEgqs%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                }
                            ],
                            "StandardErrorEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "misavafi\/84315404-1556-4c5a-937f-d589f43f5a81",
                                "AccessCredential": "?st=2014-04-21T23%3A59%3A22Z&se=2014-04-22T00%3A59%3A22Z&sr=c&sp=r&sig=hm03%2BP0jCpPtbfpifauGzZc7jJMcPSTafAf3caJ%2Fzyc%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "StandardOutEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "experimentoutput\/36c74a8a-e924-4ea6-82f8-9b4fec13a4bf",
                                "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=5jS9MvYevUN3Iwne34DpmFe9a1rRN%2FWJHt3ikdqSD1k%3D",
                                "Size": 2000,
                                "IsAuxiliary": true
                            },
                            "Status": {
                                "CreationTime": "\/Date(1346191200879)\/",
                                "EndTime": "\/Date(1346191233246)\/",
                                "StartTime": "\/Date(1346191229856)\/",
                                "StatusCode": "Finished",
                                "StatusDetail": "None"
                            }
                        },
                        {
                            "NodeId": "8c463a6d",
                            "OutputEndpoints": [
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "confusion-matrix",
                                    "Location": "experimentoutput\/96acc185-61fe-4c17-bd73-912db4c3701f",
                                    "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=YxdrS92Ky8u75MeNF7h%2FQ00VtD7qFZvgkM%2FXFGbNCgo%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                },
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "validation-results",
                                    "Location": "experimentoutput\/d3a3e2bc-207f-4eba-9f09-7392b8f85ccc",
                                    "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=uE5Bc%2FDg2yNUaQCpR2AstV2s0%2BBHXyDJsLINfFk%2BFHs%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                }
                            ],
                            "StandardErrorEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "misavafi\/84315404-1556-4c5a-937f-d589f43f5a81",
                                "AccessCredential": "?st=2014-04-21T23%3A59%3A22Z&se=2014-04-22T00%3A59%3A22Z&sr=c&sp=r&sig=hm03%2BP0jCpPtbfpifauGzZc7jJMcPSTafAf3caJ%2Fzyc%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "StandardOutEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "experimentoutput\/8825cc29-99dd-40ef-ace4-1b374ff3ea09",
                                "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=IZJj7b0uRpxy3%2BI6e3VcALyO3ueuns%2FTVv%2F6HCyblsg%3D",
                                "Size": 2000,
                                "IsAuxiliary": true
                            },
                            "Status": {
                                "CreationTime": "\/Date(1346191200942)\/",
                                "EndTime": "\/Date(1346191239402)\/",
                                "StartTime": "\/Date(1346191234981)\/",
                                "StatusCode": "Finished",
                                "StatusDetail": "None"
                            }
                        },
                        {
                            "NodeId": "0a9224e2",
                            "OutputEndpoints": [
                                {
                                    "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                    "IsDirectory": false,
                                    "Name": "publish-data",
                                    "Location": "experimentoutput\/7ed41944-4bd0-4935-8e2f-6432123b9118",
                                    "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=oEpH9LP4cyzv2ojaaOI23Y4RKPvYinvFdJq%2Fb5YqRW8%3D",
                                    "Size": 2000,
                                    "IsAuxiliary": true
                                }
                            ],
                            "StandardErrorEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "misavafi\/84315404-1556-4c5a-937f-d589f43f5a81",
                                "AccessCredential": "?st=2014-04-21T23%3A59%3A22Z&se=2014-04-22T00%3A59%3A22Z&sr=c&sp=r&sig=hm03%2BP0jCpPtbfpifauGzZc7jJMcPSTafAf3caJ%2Fzyc%3D",
                                "Size": 0,
                                "IsAuxiliary": true
                            },
                            "StandardOutEndpoint": {
                                "BaseUri": "https:\/\/passau.blob.core.windows.net\/",
                                "IsDirectory": false,
                                "Name": null,
                                "Location": "experimentoutput\/69e8e25c-935f-4f6f-8e9c-4ac772a6c92d",
                                "AccessCredential": "?st=2012-09-26T15%3A32%3A58Z&se=2012-09-26T16%3A31%3A58Z&sr=b&sp=rl&sig=JZHxuBjdbnvPn4O3us3p4y9RFzcdHuSqolZ6jJQ8VBg%3D",
                                "Size": 2000,
                                "IsAuxiliary": true
                            },
                            "Status": {
                                "CreationTime": "\/Date(1346191200989)\/",
                                "EndTime": "\/Date(1346191241246)\/",
                                "StartTime": "\/Date(1346191235559)\/",
                                "StatusCode": "Finished",
                                "StatusDetail": "None"
                            }
                        }
                    ],
                    "Status": {
                        "CreationTime": "\/Date(1346191201129)\/",
                        "EndTime": "\/Date(1346191241433)\/",
                        "StartTime": "\/Date(1346191202952)\/",
                        "StatusCode": "Finished",
                        "StatusDetail": "None"
                    },
                    "WebService": {
                        "Parameters": []
                    }
                };
                Experiments.DraftExperiment = {
                    "SchemaVersion": 1.0,
                    "Description": "Experiment: Draft experiment",
                    "Summary": "Sample test summary",
                    "OriginalExperimentDocumentationLink": "http://studio.azureml.net",
                    "ExperimentId": "ContractTestDataWorkspace.DraftExperiment",
                    "ParentExperimentId": null,
                    "Creator": "user1",
                    "Etag": null,
                    "IsArchived": false,
                    "IsLeaf": true,
                    "Graph": {
                        "Parameters": [],
                        "EdgesInternal": [],
                        "ModuleNodes": [],
                        "SerializedClientData": "<?xml version=\"1.0\" encoding=\"utf-16\"?>\r\n<DataV1 xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\r\n  <Meta />\r\n  <NodePositions>\r\n  </NodePositions>\r\n  <NodePositions2>\r\n  </NodePositions2>\r\n  <NodeGroups />\r\n</DataV1>",
                        "PublishInfo": {
                            "InputPortsForPublish": [],
                            "OutputPortsForPublish": []
                        }
                    },
                    "NodeStatuses": [],
                    "Status": {
                        "CreationTime": "",
                        "EndTime": "",
                        "StartTime": "",
                        "StatusCode": "",
                        "StatusDetail": ""
                    }
                };
                Experiments.InvalidExperiment = {
                    "SchemaVersion": 1.0,
                    "Description": "Experiment: One dataset and one module experiment",
                    "Summary": "Sample test summary",
                    "OriginalExperimentDocumentationLink": "http://studio.azureml.net",
                    "ExperimentId": "ContractTestDataWorkspace.InvalidExperiment",
                    "ParentExperimentId": null,
                    "Creator": "user1",
                    "Etag": null,
                    "IsArchived": false,
                    "IsLeaf": true,
                    "Graph": {
                        "Parameters": [],
                        "EdgesInternal": [],
                        "ModuleNodes": [
                            {
                                "Id": "c55ef8c5",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": "b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f",
                                        "Name": "Input0",
                                        "NodeId": "c55ef8c5"
                                    }
                                ],
                                "ModuleId": "deadbeef kills us all",
                                "ModuleParameters": [],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "Output0",
                                        "NodeId": "c55ef8c5"
                                    }
                                ]
                            }
                        ],
                        "SerializedClientData": "<?xml version=\"1.0\" encoding=\"utf-16\"?>\r\n<DataV1 xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\r\n  <Meta />\r\n  <NodePositions>\r\n    <NodePosition Node=\"c55ef8c5\" Position=\"44,166,200,60\" />\r\n    <NodePosition Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" Position=\"30,30,200,60\" />\r\n  </NodePositions>\r\n  <NodePositions2>\r\n    <NodePosition2 Node=\"c55ef8c5\" Position=\"44,166,200,60\" ConnectedTo=\"\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"c55ef8c5\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"49e79585\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"8e09078e\" />\r\n  </NodePositions2>\r\n  <NodeGroups />\r\n</DataV1>",
                        "PublishInfo": {
                            "InputPortsForPublish": [],
                            "OutputPortsForPublish": []
                        }
                    },
                    "NodeStatuses": [],
                    "Status": {
                        "CreationTime": "/Date(1345149960982)/",
                        "EndTime": "/Date(1345150113034)/",
                        "StartTime": "/Date(1345150037008)/",
                        "StatusCode": "3",
                        "StatusDetail": "None"
                    }
                };
                Experiments.RelevantParametersExperiment = {
                    "SchemaVersion": 1.0,
                    "Description": "Experiment: One dataset and one module (with relevant parameters) experiment",
                    "Summary": "Sample test summary",
                    "OriginalExperimentDocumentationLink": "http://studio.azureml.net",
                    "ExperimentId": "ContractTestDataWorkspace.RelevantParametersExperiment",
                    "ParentExperimentId": "ContractTestDataWorkspace.SimpleExperiment",
                    "Creator": "yikei",
                    "Etag": null,
                    "IsArchived": false,
                    "IsLeaf": true,
                    "Graph": {
                        "Parameters": [],
                        "EdgesInternal": [],
                        "ModuleNodes": [
                            {
                                "Id": "c55ef8c5",
                                "InputPortsInternal": [
                                    {
                                        "DataSourceId": "c08435290b064b26ae2bd45588687a0d.FakeData.4f2a27b899454199972860cf2278532t",
                                        "Name": "inputdata.csv",
                                        "NodeId": "0e76223a"
                                    }
                                ],
                                "ModuleId": "7890f1f9d6f9424484c21ffea9fd98f6.FakeModuleWithRelevantParameters.a1d2150711064f3e911fb3269a5cfb78",
                                "ModuleParameters": [
                                    {
                                        "Name": "Float Parameter",
                                        "Value": "0.85",
                                        "ValueType": "Literal",
                                    },
                                    {
                                        "Name": "Mode Parameter",
                                        "Value": "Option with relevant parameters",
                                        "ValueType": "Literal",
                                    },
                                    {
                                        "Name": "Integer Parameter 1",
                                        "Value": "85",
                                        "ValueType": "Literal",
                                    }
                                ],
                                "OutputPortsInternal": [
                                    {
                                        "Name": "traindata.csv",
                                        "NodeId": "0e76223a"
                                    },
                                    {
                                        "Name": "validatedata.csv",
                                        "NodeId": "0e76223a"
                                    }
                                ]
                            }
                        ],
                        "SerializedClientData": "<?xml version=\"1.0\" encoding=\"utf-16\"?>\r\n<DataV1 xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\r\n  <Meta />\r\n  <NodePositions>\r\n    <NodePosition Node=\"c55ef8c5\" Position=\"44,166,200,60\" />\r\n    <NodePosition Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" Position=\"30,30,200,60\" />\r\n  </NodePositions>\r\n  <NodePositions2>\r\n    <NodePosition2 Node=\"c55ef8c5\" Position=\"44,166,200,60\" ConnectedTo=\"\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"c55ef8c5\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"49e79585\" />\r\n    <NodePosition2 Node=\"b90435290b064b26ae2bd45588687a0d.IntegerFile.4f2a27b899454199972860cf2278591f\" nid=\"\" Position=\"30,30,200,60\" ConnectedTo=\"8e09078e\" />\r\n  </NodePositions2>\r\n  <NodeGroups />\r\n</DataV1>",
                        "PublishInfo": {
                            "InputPortsForPublish": [],
                            "OutputPortsForPublish": []
                        }
                    },
                    "NodeStatuses": [],
                    "Status": {
                        "CreationTime": "/Date(1345149960982)/",
                        "EndTime": "/Date(1345150113034)/",
                        "StartTime": "/Date(1345150037008)/",
                        "StatusCode": "3",
                        "StatusDetail": "None"
                    }
                };
            })(Experiments = TestData.Experiments || (TestData.Experiments = {}));
            var WorkspaceSettings;
            (function (WorkspaceSettings) {
                WorkspaceSettings.ContractTestDataWorkspace = {
                    "WorkspaceId": "ContractTestDataWorkspace",
                    "FriendlyName": "My Workspace",
                    "Description": "This is my sample workspace",
                    "AzureStorageConnectionString": "azure1234",
                    "HDInsightClusterConnectionString": "https://dummy.azurehdinsight.net:563",
                    "HDInsightStorageConnectionString": "dummy@datalabtesthdi",
                    "UseDefaultHDInsightSettings": false,
                    "SqlAzureConnectionString": "sql1234",
                    "AnalyticFrameworkClusterConnectionString": "cluster1234",
                    "AuthorizationToken": {
                        "PrimaryToken": "primary1234",
                        "SecondaryToken": "secondary1234"
                    },
                    "Etag": null
                };
            })(WorkspaceSettings = TestData.WorkspaceSettings || (TestData.WorkspaceSettings = {}));
            var DataTypes;
            (function (DataTypes) {
                DataTypes.GenericCSV = { "Id": "GenericCSV", "Name": "Generic CSV File", "Description": "Comma-separated text file", "IsDirectory": false, "CreatedDate": "\/Date(-62135596800000)\/", "Owner": "DataLab", "FileExtension": "csv", "ContentType": "text/plain" };
                DataTypes.GenericTSV = { "Id": "GenericTSV", "Name": "Generic TSV File", "Description": "Tab-separated text file", "IsDirectory": false, "CreatedDate": "\/Date(-62135596800000)\/", "Owner": "DataLab", "FileExtension": "tsv", "ContentType": "text/plain" };
                DataTypes.PlainText = { "Id": "PlainText", "Name": "Plain Text", "Description": "Plain text file", "IsDirectory": false, "CreatedDate": "\/Date(-62135596800000)\/", "Owner": "DataLab", "FileExtension": "txt", "ContentType": "text/plain", "AllowUpload": true };
                DataTypes.Any = { "Id": "Any", "Name": "Any Data", "Description": "Data of any type", "IsDirectory": false, "CreatedDate": "\/Date(-62135596800000)\/", "Owner": "DataLab", "FileExtension": "", "ContentType": "*/*" };
                DataTypes.NotUpload = { "Id": "NotUpload", "Name": "Not Uploadable Data Type", "Description": "Data that cannot be uploaded", "IsDirectory": false, "CreatedDate": "\/Date(-62135596800000)\/", "Owner": "DataLab", "FileExtension": "", "ContentType": "*/*", "AllowUpload": false };
            })(DataTypes = TestData.DataTypes || (TestData.DataTypes = {}));
            var WebServices;
            (function (WebServices) {
                WebServices.ContractTestDataExperimentPublishInfo = {
                    InputPortsForPublish: [],
                    OutputPortsForPublish: []
                };
                WebServices.ContractTestDataExperimentGraphModel = {
                    EdgesInternal: [],
                    ModuleNodes: [],
                    Parameters: [],
                    PublishInfo: WebServices.ContractTestDataExperimentPublishInfo,
                    SerializedClientData: ""
                };
                WebServices.ContractTestDataDiagnosticsSettings = {
                    DiagnosticsBESJobsPath: null,
                    DiagnosticsConnectionString: null,
                    DiagnosticsExpiryTime: null,
                    DiagnosticsRRSInitializationsPath: null,
                    DiagnosticsRRSRequestsPath: null,
                    DiagnosticsTraceLevel: DataLab.DataContract.DiagnosticsTraceLevel.None
                };
                WebServices.ContractTestDataWebService = {
                    Id: "ContractTestDataWebService",
                    CreationTime: "\/ Date(1330848000000 - 0800)\/",
                    Location: "http://rrsserver.com/webservice/1234/score",
                    ModelPackageId: "ContractTestDataModelPackage",
                    BatchLocation: "http://rrsserver.com/webservice/1234/jobs",
                    PrimaryKey: "",
                    SecondaryKey: "",
                    AllowAnonymousTest: false,
                    DiagnosticsSettings: WebServices.ContractTestDataDiagnosticsSettings
                };
                WebServices.ContractTestDataInputOutputPortMetadata = {
                    Id: "ContractTestDataInputOutputPortMetadata",
                    PortName: "Mock port name",
                    Schema: "Mock schema",
                    GraphModuleNodeId: "ContractTestDataExperimentGraphModel"
                };
                WebServices.ContractTestDataModelPackage = {
                    Id: "ContractTestDataModelPackage",
                    CreationTime: "\/ Date(1330848000000 - 0800)\/",
                    Inputs: [{
                        GraphModuleNodeId: "825d8018-7c5e-4c74-83fd-9ce85afb3866-379",
                        Id: "825d8018-7c5e-4c74-83fd-9ce85afb3866-379:Dataset",
                        PortName: "Dataset",
                        Schema: "{ \"columnAttributes\": [{ \"name\": \"Class\", \"type\": \"Numeric\", \"isFeature\": true }, { \"name\": \"Age\", \"type\": \"Numeric\", \"isFeature\": true }  ]}"
                    }],
                    InputsMetadata: {},
                    LinkedExperimentId: "Mock experiment id",
                    Outputs: [{
                        GraphModuleNodeId: "825d8018-7c5e-4c74-83fd-9ce85afb3866-379",
                        Id: "Id=825d8018-7c5e-4c74-83fd-9ce85afb3866-379:Results dataset",
                        PortName: "Result Dataset",
                        Schema: "{ \"columnAttributes\": [{ \"name\": \"Out(Class)\", \"type\": \"Numeric\", \"isFeature\": true }, { \"name\": \"Out(Age)\", \"type\": \"Numeric\", \"isFeature\": true }  ]}"
                    }],
                    OutputsMetadata: {},
                    GlobalParametersMetadata: [],
                    StatusCode: 0 /* InTesting */,
                    Workflow: WebServices.ContractTestDataExperimentGraphModel,
                    UpdatableInputs: []
                };
                WebServices.ContractTestDataWebServiceGroup = {
                    Id: "ContractTestDataWebServiceGroup",
                    Name: "My web service group",
                    CreationTime: "\/ Date(1330848000000 - 0800)\/",
                    Description: "This is my web service group",
                    ModelPackages: [WebServices.ContractTestDataModelPackage],
                    StagingWebService: WebServices.ContractTestDataWebService,
                    ProductionWebService: null,
                    Endpoints: []
                };
            })(WebServices = TestData.WebServices || (TestData.WebServices = {}));
        })(TestData = DataContract.TestData || (DataContract.TestData = {}));
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="../Model/Workspace.ts" />
/// <reference path="WorkspaceBackend.ts" />
/// <reference path="ContractTestData.ts" />
/// <reference path="DataContractInterfaces-v1.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        var TestData;
        (function (TestData) {
            var workspaceId = "ContractTestDataWorkspace";
            var workspaceFriendlyName = "ContractTestDataWorkspaceFriendlyName";
            var TestDataClient = (function () {
                function TestDataClient() {
                    this.workspaceId = workspaceId;
                    this.workspaceFriendlyName = workspaceFriendlyName;
                }
                TestDataClient.prototype.listDatasetsAsync = function () {
                    return DataLab.Util.when(DataLab.Util.values(DataLab.DataContract.TestData.Datasets));
                };
                TestDataClient.prototype.listTrainedModelsAsync = function () {
                    return DataLab.Util.when(DataLab.Util.values(DataLab.DataContract.TestData.TrainedModels));
                    ;
                };
                TestDataClient.prototype.listTransformModulesAsync = function () {
                    return DataLab.Util.when(DataLab.Util.values(DataLab.DataContract.TestData.Transforms));
                    ;
                };
                TestDataClient.prototype.getDataset = function (guid) {
                    if (guid in DataLab.DataContract.TestData.DatasetMap) {
                        return DataLab.Util.when(DataLab.DataContract.TestData.DatasetMap[guid]);
                    }
                    else {
                        return DataLab.Util.fail(new Error("No dataset with the given ID exists in the ContractTestData"));
                    }
                };
                TestDataClient.prototype.getTransformModule = function (guid) {
                    if (guid in DataLab.DataContract.TestData.TransformMap) {
                        return DataLab.Util.when(DataLab.DataContract.TestData.TransformMap[guid]);
                    }
                    else {
                        return DataLab.Util.fail(new Error("No transformation module with the given ID exists in the ContractTestData"));
                    }
                };
                TestDataClient.prototype.getTrainedModel = function (guid) {
                    if (guid in DataLab.DataContract.TestData.TrainedModelMap) {
                        return DataLab.Util.when(DataLab.DataContract.TestData.TrainedModelMap[guid]);
                    }
                    else {
                        return DataLab.Util.fail(new Error("No trained model with the given ID exists in the ContractTestData"));
                    }
                };
                TestDataClient.prototype.listModulesAsync = function () {
                    return DataLab.Util.when(DataLab.Util.values(DataLab.DataContract.TestData.Modules));
                };
                TestDataClient.prototype.getModule = function (guid) {
                    if (guid in DataLab.DataContract.TestData.ModuleMap) {
                        return DataLab.Util.when(DataLab.DataContract.TestData.ModuleMap[guid]);
                    }
                    else {
                        return DataLab.Util.fail(new Error("No module with the given ID exists in the ContractTestData"));
                    }
                };
                TestDataClient.prototype.listExperimentsAsync = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support listing experiments"));
                };
                TestDataClient.prototype.listWorkspacesAsync = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support listing workspaces"));
                };
                TestDataClient.prototype.createExperimentStoragePackageAsync = function (experimentId, clearCredentials, newExperimentName) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support copying experiments across workspaces"));
                };
                TestDataClient.prototype.getExperimentStoragePackageAsync = function (storagePackageId) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support copying experiments across workspaces"));
                };
                TestDataClient.prototype.createExperimentFromStoragePackageAsync = function (experimentId, destinationWorkspaceId) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support copying experiments across workspaces"));
                };
                TestDataClient.prototype.getExperimentAsync = function (experimentId) {
                    var experiment = DataLab.Util.first(DataLab.DataContract.TestData.Experiments, function (experiment) {
                        return experiment.ExperimentId === experimentId;
                    }, null);
                    if (experiment) {
                        return DataLab.Util.when(experiment);
                    }
                    else {
                        return DataLab.Util.fail(new Error("No experiment with the given ID exists in the ContractTestData"));
                    }
                };
                TestDataClient.prototype.getAncestorsAsync = function (experimentId) {
                    return DataLab.Util.fail(new Error("no mock for getAncestorsAsync"));
                };
                TestDataClient.prototype.getDescendantsAsync = function (experimentId) {
                    return DataLab.Util.fail(new Error("no mock for getDescendantsAsync"));
                };
                TestDataClient.prototype.getExperimentLineageAsync = function (experimentId) {
                    return DataLab.Util.fail(new Error("no mock for getExperimentLineageAsync"));
                };
                TestDataClient.prototype.listDataTypesAsync = function () {
                    return DataLab.Util.when(DataLab.Util.values(DataLab.DataContract.TestData.DataTypes));
                };
                TestDataClient.prototype.getWorkspaceSettingsAsync = function () {
                    if (workspaceId in DataLab.DataContract.TestData.WorkspaceSettings) {
                        return DataLab.Util.when(DataLab.DataContract.TestData.Experiments[workspaceId]);
                    }
                    else {
                        return DataLab.Util.fail(new Error("No workspace with the given ID exists in the ContractTestData"));
                    }
                };
                TestDataClient.prototype.publishExperimentAsync = function (publishExperimentRequest) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support publishing experiment"));
                };
                TestDataClient.prototype.getDataflowAsync = function (experimentId) {
                    throw "No mock for getDataflowAsync implemented.";
                };
                TestDataClient.prototype.createWebServiceGroupAsync = function (addWebServiceGroupRequest) {
                    return DataLab.Util.when(DataLab.DataContract.TestData.WebServices.ContractTestDataWebServiceGroup.Id);
                };
                TestDataClient.prototype.getWebServiceGroupAsync = function (webServiceGroupId) {
                    return DataLab.Util.when(DataLab.DataContract.TestData.WebServices.ContractTestDataWebServiceGroup);
                };
                TestDataClient.prototype.updateWebServiceGroupAsync = function (webServiceGroupId, addWebServiceGroupRequest) {
                    var d = $.Deferred();
                    setTimeout(function () { return d.resolve(); });
                    return DataLab.Util.when(d.promise());
                };
                TestDataClient.prototype.listWebServiceGroupsAsync = function () {
                    return DataLab.Util.when([DataLab.DataContract.TestData.WebServices.ContractTestDataWebServiceGroup]);
                };
                TestDataClient.prototype.deleteWebServiceGroupAsync = function (webServiceGroupId) {
                    var d = $.Deferred();
                    setTimeout(function () { return d.resolve(); });
                    return DataLab.Util.when(d.promise());
                };
                TestDataClient.prototype.registerModelPackageAsync = function (webServiceGroupId, addModelPackageRequest) {
                    return DataLab.Util.when(DataLab.DataContract.TestData.WebServices.ContractTestDataModelPackage.Id);
                };
                TestDataClient.prototype.listModelPackagesAsync = function (webServiceGroupId) {
                    return DataLab.Util.when([DataLab.DataContract.TestData.WebServices.ContractTestDataModelPackage]);
                };
                TestDataClient.prototype.getModelPackageAsync = function (webServiceGroupId, modelPackageId) {
                    return DataLab.Util.when(DataLab.DataContract.TestData.WebServices.ContractTestDataModelPackage);
                };
                TestDataClient.prototype.updateModelPackageAsync = function (webServiceGroupId, modelPackageId, updateModelPackageRequest) {
                    var d = $.Deferred();
                    setTimeout(function () { return d.resolve(); });
                    return DataLab.Util.when(d.promise());
                };
                TestDataClient.prototype.registerWebServiceAsync = function (webServiceGroupId, registerWebServiceRequest) {
                    return DataLab.Util.when(DataLab.DataContract.TestData.WebServices.ContractTestDataWebService.Id);
                };
                TestDataClient.prototype.getWebServiceAsync = function (webServiceGroupId, webServiceId) {
                    return DataLab.Util.when(DataLab.DataContract.TestData.WebServices.ContractTestDataWebService);
                };
                TestDataClient.prototype.updateWebServiceAsync = function (webServiceGroupId, webServiceId, updateWebServiceRequest) {
                    var d = $.Deferred();
                    setTimeout(function () { return d.resolve(); });
                    return DataLab.Util.when(d.promise());
                };
                TestDataClient.prototype.invokeScoreWebServiceAsync = function (webServiceGroupId, webServiceId, inputs, globalParameters) {
                    return DataLab.Util.when("Mock score result");
                };
                TestDataClient.prototype.createCommunityExperimentAsync = function (request) {
                    return DataLab.Util.when("Mock create community experiment result");
                };
                TestDataClient.prototype.getCommunityExperimentIdAsync = function (workspaceId, packageUri, communityUri) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support loading a community item"));
                };
                TestDataClient.prototype.submitExperimentAsync = function (submitExperimentRequest) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support submitting experiment"));
                };
                TestDataClient.prototype.updateExperimentAsync = function (experimentId, eTag, submitExperimentRequest) {
                    return DataLab.Util.when("Update experiment done");
                };
                TestDataClient.prototype.deleteExperimentAsync = function (experimentId, eTag) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support deleting experiment"));
                };
                TestDataClient.prototype.deleteExperimentAndAncestorsAsync = function (experimentId, eTag) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support deleting experiment"));
                };
                TestDataClient.prototype.cancelExperimentAsync = function (experimentId) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support cancelling experiment"));
                };
                TestDataClient.prototype.promoteOutputToDatasetAsync = function (promoteDatasetRequest) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support output port promotion"));
                };
                TestDataClient.prototype.promoteOutputToTrainedModelAsync = function (promoteTrainedModelRequest) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support output port promotion"));
                };
                TestDataClient.prototype.promoteOutputToTransformModuleAsync = function (promoteTransformModuleRequest) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support output port promotion"));
                };
                TestDataClient.prototype.commitResourceAsDatasetAsync = function (commitDatasetRequest) {
                    return DataLab.Util.fail(new Error("TestDataClient does not commit datasets"));
                };
                TestDataClient.prototype.buildResourceAsCustomModulePackageAsync = function (commitCustomModuleRequest) {
                    return DataLab.Util.fail(new Error("TestDataClient does not commit custom modules"));
                };
                TestDataClient.prototype.updateWorkspaceSettings = function (workspaceSettingsRequest) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support updating workspace settings"));
                };
                TestDataClient.prototype.saveCredential = function (credential) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support saving credentials"));
                };
                TestDataClient.prototype.uploadResourceAsync = function (resource, dataTypeId) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support uploading resources"));
                };
                TestDataClient.prototype.signOut = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support signOut"));
                };
                TestDataClient.prototype.getModuleVisualizationData = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support getModuleVizualizationData"));
                };
                TestDataClient.prototype.getModuleVisualizationDataItem = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support getModuleVizualizationDataItem"));
                };
                TestDataClient.prototype.getDatasetVisualizationData = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support getDatasetVizualizationData"));
                };
                TestDataClient.prototype.getModuleOutputSchema = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support getModuleOutputSchema"));
                };
                TestDataClient.prototype.getDatasetSchema = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support getDatasetSchema"));
                };
                TestDataClient.prototype.getModuleOutput = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support getModuleOutput"));
                };
                TestDataClient.prototype.getModuleErrorLog = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support getModuleErrorLog"));
                };
                TestDataClient.prototype.getStorageSpaceQuotaAsync = function () {
                    return DataLab.Util.fail(new Error("TestDataClient does not support getStorageSpaceQuotaAsync"));
                };
                TestDataClient.prototype.getExperimentDetailsAsync = function () {
                    //return Util.fail(new Error("TestDataClient does not support getExperimentDetailsAsync"));
                    var d = $.Deferred();
                    setTimeout(function () { return d.resolve("hello world."); });
                    return DataLab.Util.when(d.promise());
                };
                TestDataClient.prototype.updateExperimentDetailsAsync = function (experimentId, details) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support updateExperimentDetailsAsync"));
                };
                TestDataClient.prototype.listProjects = function (experimentId) {
                    return DataLab.Util.when([]);
                };
                TestDataClient.prototype.createProject = function (request) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support createProject"));
                };
                TestDataClient.prototype.updateProject = function (projectId, request) {
                    return DataLab.Util.fail(new Error("TestDataClient does not support updateProject"));
                };
                return TestDataClient;
            })();
            TestData.TestDataClient = TestDataClient;
            var client = new TestDataClient();
            // Since we are providing a workspace based on serialized contracts, we can use the real implementation
            // of WorkspaceBackend and prefetch modules, datasets, and datatypes normally.
            var backend = new DataContract.WorkspaceBackend(client);
            var caches = new DataLab.ApplicationCache(client);
            caches.prefetch();
            TestData.workspace = new DataLab.Model.Workspace(backend, caches);
        })(TestData = DataContract.TestData || (DataContract.TestData = {}));
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Experiment.ts" />
/// <reference path="../Disposable.ts" />
/// <reference path="../PromiseQueue.ts" />
/// <reference path="../Util.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        (function (DraftSaveState) {
            DraftSaveState[DraftSaveState["None"] = 0] = "None";
            DraftSaveState[DraftSaveState["Saved"] = 1] = "Saved";
            DraftSaveState[DraftSaveState["Saving"] = 2] = "Saving";
            DraftSaveState[DraftSaveState["SaveFailed"] = 3] = "SaveFailed";
        })(Model.DraftSaveState || (Model.DraftSaveState = {}));
        var DraftSaveState = Model.DraftSaveState;
        /** This is the state machine for handling editing, saving, and discarding of drafts.
          * It keeps track of whether or not an experiment draft is dirty (contains changes locally that are not stored on the server) and
          * manages saving (which converts the dirty state to the clean state provided that no changes are made during the save). This state
          * machine also handles discarding of drafts, which means deleting them from the server if they exist there.
         **/
        var DraftStateMachine = (function (_super) {
            __extends(DraftStateMachine, _super);
            /**
              * Creates the experiment draft state machine.
              * @constructor
              * @this {DraftStateMachine}
              * @param {Experiment} experiment the experiment for which this DraftStateMachine is being used.
             **/
            function DraftStateMachine(workspace, experiment) {
                var _this = this;
                _super.call(this);
                this.workspace = workspace;
                this.experiment = experiment;
                this.queuedSave = null;
                this.queuedSubmit = null;
                this.discardTriggered = ko.observable(false);
                this.saveStatus = ko.observable({ state: 0 /* None */, lastSave: null });
                this.postedVersion = ko.observable(this.experiment.editVersion());
                this.dirty = ko.computed(function () {
                    return (_this.experiment.editVersion() !== _this.postedVersion()) && _this.experiment.isDraft() && !_this.discardTriggered();
                });
                this.promiseQueue = new DataLab.Util.PromiseQueue();
                this.timedSave = function () {
                    _this.saveDraft().fail(function (err) {
                        // Do not retry auto-save if it failed due to an etag conflict.
                        if ((err instanceof DataLab.Util.AjaxError) && err.xmlHttpRequest.status !== 412 && err.xmlHttpRequest.status !== 404) {
                            _this.timer.start();
                        }
                    });
                };
                // Create a timer that executes this.timedSave 10 seconds after calling start().
                this.timer = new DataLab.Util.DisposableTimer(10000, this.timedSave);
                this.dirty.subscribe(function (isDirty) {
                    if (isDirty && !_this.timer.isCountingDown()) {
                        _this.timer.start();
                    }
                    else if (!isDirty && _this.timer.isCountingDown()) {
                        _this.timer.cancel();
                    }
                });
            }
            /**
              * Queue in the draft for saving.
              * @return {Util.Promise} a promise for the draft save operation
             **/
            DraftStateMachine.prototype.saveDraft = function () {
                var _this = this;
                if (!this.experiment.isDraft()) {
                    return DataLab.Util.fail(new Error(DataLab.LocalizedResources.modelCannotSaveExp));
                }
                if (this.discardTriggered()) {
                    return DataLab.Util.fail(new Error(DataLab.LocalizedResources.modelCannotQueueSave));
                }
                // Keep track of queuedSave, so while this save is still in queue and hasn't started,
                // any new attempts to save will be equivalent to queuedSave.
                if (this.queuedSave) {
                    return this.queuedSave;
                }
                else {
                    var promise = this.promiseQueue.enqueue(function () {
                        // Clear this when the save begins to allow future saves to be queued.
                        _this.queuedSave = null;
                        _this.savingVersion = _this.experiment.editVersion();
                        var returnedPromise = $.Deferred();
                        // Only perform save if there are no save errors in the experiment.
                        if (_this.experiment.saveError()) {
                            // Since the current state of the experiment cannot be saved, we clean the dirty status.
                            _this.experiment.dirtyStatus.clean();
                            return returnedPromise.resolve(null);
                        }
                        else {
                            _this.saveStatus({ state: 2 /* Saving */, lastSave: null });
                            if (!_this.experiment.persistedOnService()) {
                                returnedPromise = _this.workspace.saveDraftAsync(_this.experiment);
                            }
                            else {
                                returnedPromise = _this.workspace.updateDraftAsync(_this.experiment);
                            }
                        }
                        return returnedPromise;
                    }).done(function (result) {
                        // There would be no result if and only if the save was a no-op (i.e. save errors).
                        if (result) {
                            Shell.Diagnostics.Telemetry.customEvent("Succeeded", "SaveDraft", undefined);
                            if (!_this.experiment.persistedOnService()) {
                                _this.experiment.experimentId(result.ExperimentId);
                            }
                            _this.experiment.etag(result.Etag);
                            _this.saveStatus({ state: 1 /* Saved */, lastSave: new Date() });
                            _this.postedVersion(_this.savingVersion);
                            _this.experiment.dirtyStatus.clean();
                        }
                    }).fail(function (err) {
                        // Show a warning if save failed due to an etag conflict.
                        if ((err instanceof DataLab.Util.AjaxError) && err.xmlHttpRequest.status === 412) {
                            Shell.Diagnostics.Telemetry.customEvent("EtagConflict", "SaveDraft", undefined);
                            _this.saveStatus({ state: 0 /* None */, lastSave: null });
                            var errorNotification = new Shell.UI.Notifications.Confirmation(DataLab.LocalizedResources.modelCannotSaveDraftAlreadyUpdated, "active");
                            errorNotification.setActions([new Shell.UI.Notifications.Buttons.ok()]);
                            Shell.UI.Notifications.add(errorNotification);
                            _this.timer.cancel();
                        }
                        else if ((err instanceof DataLab.Util.AjaxError) && err.xmlHttpRequest.status === 404) {
                            Shell.Diagnostics.Telemetry.customEvent("NotFound", "SaveDraft", undefined);
                            _this.saveStatus({ state: 3 /* SaveFailed */, lastSave: null });
                            _this.timer.cancel();
                        }
                        else {
                            _this.saveStatus({ state: 3 /* SaveFailed */, lastSave: null });
                        }
                    });
                    if (this.promiseQueue.size() > 1) {
                        // Only save the promise for future use if the promise queue has something before this save,
                        // because in that case the promise will be executed immediately.
                        this.queuedSave = promise;
                    }
                    return promise;
                }
            };
            /**
              * Queue in the draft for deletion from the server, or resolve immediately if it's never been saved.
              * @return {Util.Promise} a promise for the draft discard operation
             **/
            DraftStateMachine.prototype.discardDraft = function () {
                var _this = this;
                if (!this.experiment.isDraft()) {
                    return DataLab.Util.fail(new Error(DataLab.LocalizedResources.modelCannotDiscardQueued));
                }
                if (!this.experiment.persistedOnService()) {
                    // Local draft, nothing to delete on service.
                    return this.promiseQueue.enqueue(function () {
                        _this.discardTriggered(true);
                        return DataLab.Util.when(null);
                    });
                }
                else if (this.discardTriggered()) {
                    return DataLab.Util.fail(new Error(DataLab.LocalizedResources.modelCannotQueueDiscard));
                }
                else {
                    return this.promiseQueue.enqueue(function () {
                        _this.discardTriggered(true);
                        return _this.workspace.deleteExperimentAsync(_this.experiment.experimentId(), _this.experiment.etag()).fail(function () {
                            _this.discardTriggered(false);
                        });
                    });
                }
            };
            /**
              * Queue in the experiment (either draft or not) for submitting.
              * @return {Util.Promise<DataContract.v1.IExperimentSubmissionResult>} a promise for the submission operation
             **/
            DraftStateMachine.prototype.submitExperiment = function () {
                var _this = this;
                if (this.discardTriggered()) {
                    return DataLab.Util.fail(new Error(DataLab.LocalizedResources.modelCannotQueueSubmit));
                }
                // Keep track of queuedSubmit, so while this submit is still in queue and hasn't started,
                // any new attempts to submit will be equivalent to queuedSave.    
                if (this.queuedSubmit) {
                    return this.queuedSubmit;
                }
                else {
                    var promise = this.promiseQueue.enqueue(function () {
                        // Clear this when the submit begins to allow future submits to be queued.
                        _this.queuedSubmit = null;
                        return _this.workspace.submitExperimentAsync(_this.experiment);
                    }).done(function (result) {
                        _this.experiment.experimentId(result.ExperimentId);
                        _this.experiment.etag(result.Etag);
                        Shell.Diagnostics.Telemetry.customEvent("Succeeded", "SubmitExperiment", undefined);
                    }).fail(function (err) {
                        // Show a warning if submit failed due to an etag conflict.
                        if ((err instanceof DataLab.Util.AjaxError) && err.xmlHttpRequest.status === 412) {
                            var errorNotification = new Shell.UI.Notifications.Confirmation(DataLab.LocalizedResources.modelExperimentCannotRun, "active");
                            errorNotification.setActions([new Shell.UI.Notifications.Buttons.ok()]);
                            Shell.UI.Notifications.add(errorNotification);
                            Shell.Diagnostics.Telemetry.customEvent("Timeout", "SubmitExperiment", undefined);
                            _this.timer.cancel();
                        }
                        else if (_this.experiment.experimentId()) {
                            // If submission fails for reasons not related to etag conflict, we should make sure the etag is properly updated for future submissions.
                            _this.workspace.getExperimentAsync(_this.experiment.experimentId()).done(function (e) {
                                _this.experiment.etag(e.etag());
                            });
                        }
                    });
                    if (this.promiseQueue.size() > 1) {
                        // Only save the promise for future use if the promise queue has something before this submit,
                        // because in that case the promise will be executed immediately.
                        this.queuedSubmit = promise;
                    }
                    return promise;
                }
            };
            DraftStateMachine.prototype.dispose = function () {
                if (this.timer !== null) {
                    this.timer.dispose();
                }
                _super.prototype.dispose.call(this);
            };
            return DraftStateMachine;
        })(DataLab.Util.Disposable);
        Model.DraftStateMachine = DraftStateMachine;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="DataType.ts" />
/// <reference path="Workspace.ts" />
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var Constants;
        (function (Constants) {
            Constants.maxDatasetNameLength = 100;
        })(Constants = Model.Constants || (Model.Constants = {}));
        /** An UnsavedDataset represents a dataset which has not yet been fully created
            (i.e. saved to a workspace). An UnsavedDataset does not have an id and has
            mutable fields (unlike a saved Dataset). The mutable fields are validatableObservables,
            and so can be used to provide feedback to a user that is drafting a new dataset. */
        var UnsavedDataset = (function () {
            function UnsavedDataset(workspace) {
                var _this = this;
                this.description = ko.observable();
                this.workspace = workspace;
                this.deprecate = ko.observable(false);
                this._familyId = ko.observable("");
                this.hint = ko.observable(false);
                this.updateAvailableDatasets = new DataLab.Util.Disposable();
                this._name = DataLab.Validation.validatableObservable("", function (val) {
                    if (DataLab.Util.first(workspace.datasetCache.items(), function (dataset) { return dataset.name() === val; }, false)) {
                        return "A dataset with this name already exists.";
                    }
                    else if (_this.workspace.datasetUploadsInProgress().indexOf(val) >= 0) {
                        return "A dataset with this name is being uploaded.";
                    }
                    else if (/^\s*$/.test(val)) {
                        return "A dataset name must be provided.";
                    }
                    else if (/[:\/#\?\\]/.test(val)) {
                        return "The dataset name contains invalid characters. The following characters are not allowed: / \\ ? : #";
                    }
                    else if (val.length > Constants.maxDatasetNameLength) {
                        return "The dataset name may contain at most " + Constants.maxDatasetNameLength + " characters.";
                    }
                    return null;
                });
                this.dataType = DataLab.Validation.validatableObservable(null, function (val) {
                    if (!val) {
                        return "Select a data type for the new dataset.";
                    }
                    return null;
                });
                this.datasetToDeprecate = DataLab.Validation.validatableObservable(null, function (val) {
                    if (!val) {
                        return "Select dataset to deprecate.";
                    }
                    return null;
                });
                this.availableDatasets = ko.observable(DataLab.Util.map(DataLab.Util.filter(workspace.datasetCache.items(), function (item) {
                    return item.isLatest() && item.id.lastIndexOf(workspace.id, 0) === 0;
                }), function (d) {
                    return d.name();
                }).sort());
                this.updateAvailableDatasets.registerForDisposal(new DataLab.Util.DisposableSubscription(this.workspace.datasetUploadsInProgress.subscribe(function () {
                    // update our list of available datasets with the names of latest (no dups) local datasets
                    _this.availableDatasets(DataLab.Util.map(DataLab.Util.filter(workspace.datasetCache.items(), function (item) {
                        return item.isLatest() && item.id.lastIndexOf(workspace.id, 0) === 0;
                    }), function (d) {
                        return d.name();
                    }).sort());
                })));
                this.datasetToDeprecate.subscribe(function (datasetToDeprecate) {
                    var dataset = DataLab.Util.first(workspace.datasetCache.items(), function (d) {
                        return d.name() === datasetToDeprecate && d.isLatest() && d.id.lastIndexOf(workspace.id, 0) === 0;
                    }, null);
                    _this.description(dataset ? dataset.description() : "");
                    _this.dataType(dataset ? dataset.dataType : null);
                    _this._familyId(dataset ? dataset.familyId : null);
                    _this.hint(false);
                });
                this.deprecate.subscribe(function () {
                    _this.hint(false);
                });
                this.familyId = ko.computed(function () {
                    return (_this.deprecate() && _this._familyId()) ? _this._familyId().split('.')[1] : null;
                });
                this.name = ko.computed({
                    read: function () {
                        return _this.deprecate() ? _this.datasetToDeprecate() : _this._name();
                    },
                    write: function (value) {
                        _this._name(value);
                    }
                });
            }
            UnsavedDataset.prototype.isValid = function () {
                return ((this._name.isValid() && !this.deprecate()) || (this.datasetToDeprecate.isValid() && this.deprecate()));
            };
            UnsavedDataset.prototype.startValidating = function () {
                this._name.startValidating();
                this.datasetToDeprecate.startValidating();
            };
            return UnsavedDataset;
        })();
        Model.UnsavedDataset = UnsavedDataset;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="../Global.refs.ts" />
/// <reference path="DataType.ts" />
/// <reference path="Workspace.ts" />
var DataLab;
(function (DataLab) {
    var Model;
    (function (Model) {
        var Constants;
        (function (Constants) {
            Constants.maxResourceNameLength = 100;
        })(Constants = Model.Constants || (Model.Constants = {}));
        /** An UnsavedResource represents a resource (e.g. dataset, trained model) which has not yet been fully created
            (i.e. saved to a workspace). An UnsavedResource does not have an id and has
            mutable fields (unlike a saved resource). The mutable fields are validatableObservables,
            and so can be used to provide feedback to a user that is drafting a new resource. */
        var UnsavedResource = (function () {
            function UnsavedResource(workspace, resourceCache, resourceUploadsInProgress, resourceName) {
                var _this = this;
                this.description = ko.observable();
                this.workspace = workspace;
                this.deprecate = ko.observable(false);
                this._familyId = ko.observable("");
                this.hint = ko.observable(false);
                this.updateAvailableResources = new DataLab.Util.Disposable();
                this._resourceCache = resourceCache;
                this._name = DataLab.Validation.validatableObservable("", function (val) {
                    if (DataLab.Util.first(resourceCache.items(), function (resource) { return resource.name() === val; }, false)) {
                        return "A " + resourceName + " with this name already exists.";
                    }
                    else if (resourceUploadsInProgress().indexOf(val) >= 0) {
                        return "A " + resourceName + " with this name is being uploaded.";
                    }
                    else if (/^\s*$/.test(val)) {
                        return "A " + resourceName + " name must be provided.";
                    }
                    else if (/[:\/#\?\\]/.test(val)) {
                        return "The " + resourceName + " name contains invalid characters. The following characters are not allowed: / \\ ? : #";
                    }
                    else if (val.length > Constants.maxResourceNameLength) {
                        return "The " + resourceName + " name may contain at most " + Constants.maxResourceNameLength + " characters.";
                    }
                    return null;
                });
                this.dataType = DataLab.Validation.validatableObservable(null, function (val) {
                    if (!val) {
                        return "Select a data type for the new " + resourceName + ".";
                    }
                    return null;
                });
                this.resourceToDeprecate = DataLab.Validation.validatableObservable(null, function (val) {
                    if (!val) {
                        return "Select " + resourceName + " to deprecate.";
                    }
                    return null;
                });
                this.availableResources = ko.observable(DataLab.Util.map(DataLab.Util.filter(this._resourceCache.items(), function (resource) { return _this.isLatestLocal(resource, _this.workspace); }), function (d) {
                    return d.name();
                }));
                this.updateAvailableResources.registerForDisposal(new DataLab.Util.DisposableSubscription(resourceUploadsInProgress.subscribe(function () {
                    _this.availableResources(DataLab.Util.map(DataLab.Util.filter(_this._resourceCache.items(), function (resource) { return _this.isLatestLocal(resource, _this.workspace); }), function (d) {
                        return d.name();
                    }));
                })));
                this.resourceToDeprecate.subscribe(function (resourceToDeprecate) {
                    var resource = DataLab.Util.first(_this._resourceCache.items(), function (d) {
                        return d.name() === resourceToDeprecate && _this.isLatestLocal(d, _this.workspace);
                    }, null);
                    _this.description(resource ? resource.description() : "");
                    _this.dataType(resource ? resource.dataType : null);
                    _this._familyId(resource ? resource.familyId : null);
                    _this.hint(false);
                });
                this.deprecate.subscribe(function () {
                    _this.hint(false);
                });
                this.familyId = ko.computed(function () {
                    return (_this.deprecate() && _this._familyId()) ? _this._familyId().split('.')[1] : null;
                });
                this.name = ko.computed({
                    read: function () {
                        return _this.deprecate() ? _this.resourceToDeprecate() : _this._name();
                    },
                    write: function (value) {
                        _this._name(value);
                    }
                });
            }
            UnsavedResource.prototype.isValid = function () {
                return ((this._name.isValid() && !this.deprecate()) || (this.resourceToDeprecate.isValid() && this.deprecate()));
            };
            UnsavedResource.prototype.startValidating = function () {
                this._name.startValidating();
                this.resourceToDeprecate.startValidating();
            };
            /** Tests if the resource is the latest version and belongs to the local workspace */
            UnsavedResource.prototype.isLatestLocal = function (resource, workspace) {
                return resource.isLatest() && resource.id.lastIndexOf(workspace.id, 0) === 0;
            };
            return UnsavedResource;
        })();
        Model.UnsavedResource = UnsavedResource;
    })(Model = DataLab.Model || (DataLab.Model = {}));
})(DataLab || (DataLab = {}));

/// <reference path="Common.ts" />
var DataLab;
(function (DataLab) {
    var DataContract;
    (function (DataContract) {
        (function (ExperimentRole) {
            ExperimentRole[ExperimentRole["Training"] = "Training"] = "Training";
            ExperimentRole[ExperimentRole["Scoring"] = "Scoring"] = "Scoring";
            ExperimentRole[ExperimentRole["Computing"] = "Computing"] = "Computing";
        })(DataContract.ExperimentRole || (DataContract.ExperimentRole = {}));
        var ExperimentRole = DataContract.ExperimentRole;
    })(DataContract = DataLab.DataContract || (DataLab.DataContract = {}));
})(DataLab || (DataLab = {}));
