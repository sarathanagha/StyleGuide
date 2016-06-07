// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "text!./manualentry.html", "css!./manualentry.css"], function (require, exports, ko) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var SourceTypes = Microsoft.DataStudio.DataCatalog.Core.SourceTypes;
    var catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
    var utilities = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var LoggerFactory = Microsoft.DataStudio.DataCatalog.LoggerFactory;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    exports.template = require("text!./manualentry.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.logger = LoggerFactory.getLogger({ loggerName: "ADC", category: "ADC Components" });
            this.sourceName = ko.observable("");
            this.friendlyName = ko.observable("");
            this.description = ko.observable("");
            this.requestAccess = ko.observable("");
            this.experts = ko.observableArray([]);
            this.tags = ko.observableArray([]);
            this.expertAttributes = ko.observableArray([]);
            this.tagAttributes = ko.observableArray([]);
            this.serverName = ko.observable("");
            this.databaseName = ko.observable("");
            this.objectName = ko.observable("");
            this.modelName = ko.observable("");
            this.sourceType = ko.observable("");
            this.objectType = ko.observable("");
            this.authentication = ko.observable(null);
            this.sourceNameError = ko.observable(false);
            this.isInvalid = ko.observable(false);
            this.validateEmail = utilities.validateEmails;
            this.sourceTypesArray = ko.pureComputed(function () {
                var sources = SourceTypes.getSourceTypesArray();
                if (sources.length) {
                    _this.sourceType(sources[0].sourceType);
                }
                return sources;
            });
            this.singleObjectType = ko.pureComputed(function () {
                var types = SourceTypes.getObjectTypes(_this.sourceType());
                return types[0];
            });
            this.objectTypes = ko.pureComputed(function () {
                var types = SourceTypes.getObjectTypesArray(_this.sourceType());
                return types;
            });
            this.singleAuthentication = ko.pureComputed(function () {
                var authentications = SourceTypes.getSourceType(_this.sourceType()).authentication;
                return authentications[0];
            });
            this.authenticationTypes = ko.pureComputed(function () {
                var authentications = SourceTypes.getSourceType(_this.sourceType()).authentication;
                return authentications;
            });
            this.inputFields = ko.pureComputed(function () {
                var fields = [];
                if (_this.objectTypes().length === 1) {
                    fields = SourceTypes.getEditFields(_this.sourceType(), _this.singleObjectType());
                }
                else {
                    fields = SourceTypes.getEditFields(_this.sourceType(), _this.objectType());
                }
                return fields;
            });
            var subscription = this.sourceType.subscribe(function (newValue) {
                if (_this.objectTypes().length > 1) {
                    _this.objectType(_this.objectTypes()[0].objectType);
                }
                if (_this.authenticationTypes().length > 1) {
                    _this.authentication(_this.authenticationTypes()[0]);
                }
            });
            this.dispose = function () {
                subscription.dispose();
            };
        }
        viewModel.prototype.updateObjectType = function (sourceType) {
            var types = SourceTypes.getObjectTypes(sourceType);
            if (types.length) {
                this.objectType(types[0]);
            }
        };
        viewModel.prototype.addUserTags = function (tags) {
            var _this = this;
            tags.forEach(function (tag) {
                if (!_this.tags().some(function (t) { return t.toUpperCase() === tag.toUpperCase(); }) && $.trim(tag)) {
                    _this.tags().unshift(tag);
                }
            });
        };
        viewModel.prototype.removeUserTag = function (tag) {
            this.tags.remove(function (t) { return t === tag; });
        };
        viewModel.prototype.addExperts = function (experts) {
            var _this = this;
            experts.forEach(function (expert) {
                if (!_this.experts().some(function (e) { return e.toUpperCase() === expert.toUpperCase(); }) && $.trim(expert)) {
                    _this.experts().unshift(expert);
                }
            });
        };
        viewModel.prototype.removeExpert = function (expert) {
            this.experts.remove(function (e) { return e === expert; });
        };
        viewModel.prototype.buildSource = function () {
            this.createdTime = new Date();
            if (this.objectTypes().length === 1) {
                this.objectType(this.objectTypes()[0].objectType);
            }
            if (this.authenticationTypes().length === 1) {
                this.authentication(this.authenticationTypes()[0]);
            }
            var source = SourceTypes.getSourceType(this.sourceType());
            var obj = SourceTypes.getObjectType(this.sourceType(), this.objectType());
            var protocol = obj.protocol || source.protocol;
            var entryData = {
                __creatorId: constants.ManualEntryID,
                lastRegisteredBy: {
                    upn: $tokyo.user.email,
                    firstName: $tokyo.user.email,
                    lastName: $tokyo.user.lastName
                },
                modifiedTime: this.createdTime,
                lastRegisteredTime: this.createdTime,
                name: this.sourceName(),
                dataSource: {
                    sourceType: source.sourceType,
                    objectType: obj.objectType,
                    formatType: source.formatType
                },
                descriptions: [{
                        __creatorId: $tokyo.user.email,
                        modifiedTime: this.createdTime,
                        description: this.description(),
                        tags: this.tags()
                    }],
                experts: [{
                        __creatorId: $tokyo.user.email,
                        modifiedTime: this.createdTime,
                        experts: this.experts()
                    }],
                dsl: {
                    protocol: protocol,
                    address: {}
                }
            };
            if (this.friendlyName().length) {
                entryData.descriptions[0].friendlyName = this.friendlyName();
            }
            if (this.requestAccess().length) {
                entryData.accessInstructions = [{
                        __creatorId: $tokyo.user.email,
                        modifiedTime: this.createdTime,
                        mimeType: "text/html",
                        content: this.requestAccess()
                    }];
            }
            this.inputFields().forEach(function (field) {
                var path = field.editFormParams.bindingPath;
                var fieldView = ko.dataFor(document.getElementById(path));
                var value = fieldView.value();
                fieldView.value("");
                utilities.addValueToObject(entryData, path, value);
            });
            if (this.authentication()) {
                entryData.dsl.authentication = this.authentication().name;
            }
            return entryData;
        };
        viewModel.prototype.reset = function () {
            this.logger.logInfo("resetting manual entry");
            this.sourceName("");
            this.friendlyName("");
            this.description("");
            this.isInvalid(false);
            this.sourceNameError(false);
        };
        viewModel.prototype.submitEntry = function () {
            var entryData = this.buildSource();
            this.logger.logInfo("create manual entry", entryData);
            this.reset();
            return catalogService.createCatalogEntry(SourceTypes.getObjectType(this.sourceType(), this.objectType()).rootType, entryData);
        };
        viewModel.prototype.isValid = function () {
            var isValid = true;
            if (this.sourceName().trim() === "") {
                this.sourceNameError(true);
                isValid = false;
            }
            this.inputFields().forEach(function (field) {
                var path = field.editFormParams.bindingPath;
                var fieldView = ko.dataFor(document.getElementById(path));
                var value = fieldView.value();
                if (!fieldView.validate()) {
                    isValid = false;
                }
            });
            if (!isValid) {
                $("#manual-entry .scrollable-content").scrollTop(0);
            }
            this.isInvalid(!isValid);
            return isValid;
        };
        Object.defineProperty(viewModel.prototype, "assetCreatedTime", {
            get: function () {
                return this.createdTime;
            },
            enumerable: true,
            configurable: true
        });
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=manualentry.js.map