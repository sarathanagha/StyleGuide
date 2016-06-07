// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "jquery", "text!./batchproperties.html", "css!./batchproperties.css"], function (require, exports, ko, $) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
    var catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
    var detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
    var batchSchemaManager = Microsoft.DataStudio.DataCatalog.Managers.BatchSchemaManager;
    var batchManagementManager = Microsoft.DataStudio.DataCatalog.Managers.BatchManagementManager;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    exports.template = require("text!./batchproperties.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.plainText = util.plainText;
            this.snapshot = ko.observable();
            this.isSaving = ko.observable(false);
            this.validateEmail = util.validateEmails;
            this.selectedText = ko.pureComputed(function () {
                return util.stringFormat(resx.multiSelectedTextFormat, browseManager.multiSelected().length);
            });
            //#region Request Access
            this.requestAccessShowEditMode = ko.observable(false);
            this.isChangingRequestAccess = ko.observable(false);
            this.hasRequestAccessChanges = ko.observable(false);
            this.showEditForRequestAccess = ko.pureComputed(function () {
                return _this.requestAccessShowEditMode() || (!_this.snapshot().requestAccess() && _this.snapshot().requestAccessMode() !== "Mixed");
            });
            this.requestAccessLinkText = ko.pureComputed(function () {
                var instructions = _this.snapshot().requestAccess() || "";
                var highlightedWords = util.extractHighlightedWords(instructions);
                var plainText = $.trim(util.plainText(instructions));
                var assetInfo = "%0A";
                // Build a list of selected objects along with connection information so the recipient has the information needed to identify the asset.
                browseManager.multiSelected().forEach(function (a) {
                    assetInfo += resx.address_sourceName + ": " + a.name + "%0A";
                    $.each(a.dsl.address, function (key) {
                        var value = util.plainText(a.dsl.address[key]);
                        assetInfo += " " + (resx["address_" + key] || key) + ": " + value + "%0A";
                    });
                    assetInfo += "%0A";
                });
                var mailToLink = "mailto:{0}?subject=" + resx.requestAccessToAssetEmailSubject +
                    "&body=" + util.stringFormat(resx.requestAccessToBatchAssetEmailBodyFormat, assetInfo, $tokyo.user.email);
                if (plainText === util.arrayFirst((plainText.match(constants.HttpRegex) || []))) {
                    return util.stringFormat("<a href=\"{0}\" target='_blank'>{1}</a>", plainText, resx.requestAccessToDataSource);
                }
                else if (plainText === util.arrayFirst((plainText.match(constants.EmailRegex) || []))) {
                    return util.stringFormat("<a href=\"{0}\">{1}</a>", util.stringFormat(mailToLink, plainText), resx.requestAccessToDataSource);
                }
                else {
                    // Add links
                    plainText = plainText.replace(constants.HttpRegex, "<a href=\"{$&}\" target='_blank'>$&</a>");
                    // Add mailto
                    plainText = plainText.replace(constants.EmailRegex, util.stringFormat("<a href=\"{{0}\"}>$&</a>", util.stringFormat(mailToLink, "$&")));
                    // Add highlights back
                    plainText = util.applyHighlighting(highlightedWords, plainText);
                    // Clean up links
                    plainText = plainText.replace(/(href="{)([^}]*)(})/g, function (a, b, c) {
                        return "href=\"" + util.plainText(c);
                    });
                }
                return plainText;
            });
            this.getRequestAccessLabelTooltipText = ko.pureComputed(function () {
                return _this.snapshot().requestAccessMode() === "Mixed" || _this.snapshot().requestAccess()
                    ? resx.requestAccessTooltip
                    : resx.requestAccessVerboseTooltip;
            });
            this.getRequestAccessValueTooltipText = ko.pureComputed(function () {
                var instructions = _this.snapshot().requestAccessMode() === "Mixed"
                    ? ""
                    : _this.snapshot().requestAccess();
                var plainText = $.trim(util.plainText(instructions));
                if (plainText === util.arrayFirst((plainText.match(constants.HttpRegex) || []))) {
                    // Http/https link
                    return plainText;
                }
                else if (plainText === util.arrayFirst((plainText.match(constants.EmailRegex) || []))) {
                    return plainText;
                }
                else {
                    // Free text
                    return plainText;
                }
            });
            this.takeSnapshot();
            this.commitEnabled = ko.computed(function () {
                var changes = _this.getChanges();
                _this.hasRequestAccessChanges(changes.requestAccess !== void 0);
                var hasPropertyChanges = !!Object.keys(changes).length;
                var hasSchemaChanges = batchSchemaManager.hasChanges();
                var hasAuthChanges = batchManagementManager.hasChanges();
                var hasChanged = hasPropertyChanges || hasSchemaChanges || hasAuthChanges;
                if (hasChanged) {
                    layoutManager.maskRight();
                    layoutManager.maskBottom();
                }
                else {
                    layoutManager.unmask();
                }
                return hasChanged;
            });
            var subscription = browseManager.multiSelected.subscribe(function () {
                // Setup snapshots for comparing during commit
                if (browseManager.multiSelected().length > 1) {
                    // This is batch properties so don't do any work we don't need to
                    _this.takeSnapshot();
                }
            });
            this.dispose = function () {
                subscription.dispose();
                _this.commitEnabled.dispose();
                layoutManager.unmask();
            };
        }
        viewModel.prototype.takeSnapshot = function () {
            var _this = this;
            this.snapshotData = this.getSnapshot();
            var copy = $.extend(true, {}, this.snapshotData);
            var myExpertsOnAllLookup = {};
            copy.myExpertsOnAll.forEach(function (e) {
                myExpertsOnAllLookup[e] = true;
            });
            var myExpertsOnSomeLookup = {};
            copy.myExpertsOnSome.forEach(function (e) {
                myExpertsOnSomeLookup[e] = true;
            });
            var myTagsOnAllLookup = {};
            copy.myTagsOnAll.forEach(function (t) {
                myTagsOnAllLookup[t] = true;
            });
            var myTagsOnSomeLookup = {};
            copy.myTagsOnSome.forEach(function (e) {
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
            var expertsOnAll = copy.expertsOnAll.map(function (e) {
                var tooltips = _this.expertCreators[e];
                return { name: e, readOnly: !myExpertsOnAllLookup[e], tooltips: tooltips };
            }).sort(sorter);
            var expertsOnSome = copy.expertsOnSome.map(function (e) {
                var tooltips = _this.expertCreators[e];
                return { name: e, readOnly: !myExpertsOnSomeLookup[e], tooltips: tooltips };
            }).sort(sorter);
            var tagsOnAll = copy.tagsOnAll.map(function (t) {
                var tooltips = _this.tagCreators[t];
                return { name: t, readOnly: !myTagsOnAllLookup[t], tooltips: tooltips };
            }).sort(sorter);
            var tagsOnSome = copy.tagsOnSome.map(function (t) {
                var tooltips = _this.tagCreators[t];
                return { name: t, readOnly: !myTagsOnSomeLookup[t], tooltips: tooltips };
            }).sort(sorter);
            this.snapshot({
                description: ko.observable(copy.description),
                expertsOnSome: ko.observableArray(expertsOnSome),
                expertsOnAll: ko.observableArray(expertsOnAll),
                tagsOnAll: ko.observableArray(tagsOnAll),
                tagsOnSome: ko.observableArray(tagsOnSome),
                requestAccessMode: ko.observable(copy.requestAccessMode),
                requestAccess: ko.observable(copy.requestAccess),
                locations: ko.observableArray(copy.locations)
            });
        };
        viewModel.prototype.getSnapshot = function () {
            var _this = this;
            var descriptionHash = {};
            var myTagIntersections;
            var myDistinctTags;
            var tagIntersection;
            var tagUnion;
            var myExpertIntersections;
            var myDistinctExperts;
            var expertIntersection;
            var expertUnion;
            var requestAccessHash = {};
            var locationHash = {};
            this.tagCreators = {};
            this.expertCreators = {};
            browseManager.multiSelected().forEach(function (a) {
                a.descriptions().forEach(function (desc) {
                    desc.tags().forEach(function (tag) {
                        _this.tagCreators[tag] = _this.tagCreators[tag] || [];
                        if (!_this.tagCreators[tag].some(function (tp) { return tp.email === desc.__creatorId; })) {
                            _this.tagCreators[tag].push({ email: desc.__creatorId });
                        }
                    });
                });
                var myExpertObj = util.arrayFirst(a.experts().filter(function (e) { return e.__creatorId === $tokyo.user.email; }));
                var myExperts = [];
                if (myExpertObj) {
                    myExperts = myExpertObj.experts().map($.trim);
                }
                var allExperts = [];
                a.experts().forEach(function (e) {
                    allExperts = allExperts.concat(e.experts());
                    e.experts().forEach(function (expert) {
                        _this.expertCreators[expert] = _this.expertCreators[expert] || [];
                        if (!_this.expertCreators[expert].some(function (tp) { return tp.email === e.__creatorId; })) {
                            _this.expertCreators[expert].push({ email: e.__creatorId });
                        }
                    });
                });
                // My experts
                if (!myExpertIntersections) {
                    myExpertIntersections = myExperts;
                }
                else {
                    myExpertIntersections = util.arrayIntersect(myExpertIntersections, myExperts);
                }
                if (!myDistinctExperts) {
                    myDistinctExperts = util.arrayDistinct(myExperts);
                }
                else {
                    myDistinctExperts = util.arrayDistinct(myDistinctExperts.concat(myExperts));
                }
                // All experts
                if (!expertIntersection) {
                    expertIntersection = allExperts;
                }
                else {
                    expertIntersection = util.arrayIntersect(expertIntersection, allExperts);
                }
                if (!expertUnion) {
                    expertUnion = util.arrayDistinct(allExperts);
                }
                else {
                    expertUnion = util.arrayDistinct(expertUnion.concat(allExperts));
                }
                var myDescObj = util.arrayFirst(a.descriptions().filter(function (e) { return e.__creatorId === $tokyo.user.email; }));
                var myTags = [];
                if (myDescObj) {
                    myTags = myDescObj.tags().map($.trim);
                    // My description
                    var trimmedDesc = $.trim(myDescObj.description());
                    descriptionHash[_this.plainText(trimmedDesc)] = true;
                }
                var allTags = [];
                a.descriptions().forEach(function (d) {
                    allTags = allTags.concat(d.tags());
                });
                // My tags
                if (!myTagIntersections) {
                    myTagIntersections = myTags;
                }
                else {
                    myTagIntersections = util.arrayIntersect(myTagIntersections, myTags);
                }
                if (!myDistinctTags) {
                    myDistinctTags = util.arrayDistinct(myTags);
                }
                else {
                    myDistinctTags = util.arrayDistinct(myDistinctTags.concat(myTags));
                }
                // All tags
                if (!tagIntersection) {
                    tagIntersection = allTags;
                }
                else {
                    tagIntersection = util.arrayIntersect(tagIntersection, allTags);
                }
                if (!tagUnion) {
                    tagUnion = util.arrayDistinct(allTags);
                }
                else {
                    tagUnion = util.arrayDistinct(tagUnion.concat(allTags));
                }
                var requestAccessObject = a.getMostRecentAccessInstruction();
                var trimmedContent = $.trim(requestAccessObject.content);
                requestAccessHash[_this.plainText(trimmedContent)] = true;
                locationHash[((a.dsl || {}).address || {}).server || ""] = true;
            });
            var commonRequestAccess = Object.keys(requestAccessHash).length === 1
                ? Object.keys(requestAccessHash)[0]
                : "";
            var requestAccessMode = Object.keys(requestAccessHash).length > 1
                ? "Mixed"
                : null;
            if (requestAccessMode === "Mixed") {
                commonRequestAccess = resx.requestAccessMixedMessage;
            }
            var commonDescription = Object.keys(descriptionHash).length === 1
                ? Object.keys(descriptionHash)[0]
                : "";
            var myExpertsOnAll = util.arrayDistinct((myExpertIntersections || []).map($.trim));
            var myExpertsOnSome = util.arrayDistinct(util.arrayExcept((myDistinctExperts || []).map($.trim), myExpertsOnAll));
            var expertsOnAll = util.arrayDistinct((expertIntersection || []).map($.trim));
            var expertsOnSome = util.arrayDistinct(util.arrayExcept((expertUnion || []).map($.trim), expertsOnAll));
            var myTagsOnAll = util.arrayDistinct((myTagIntersections || []).map($.trim));
            var myTagsOnSome = util.arrayDistinct(util.arrayExcept((myDistinctTags || []).map($.trim), myTagsOnAll));
            var tagsOnAll = util.arrayDistinct((tagIntersection || []).map($.trim));
            var tagsOnSome = util.arrayDistinct(util.arrayExcept((tagUnion || []).map($.trim), tagsOnAll));
            return {
                description: commonDescription,
                myExpertsOnAll: myExpertsOnAll,
                myExpertsOnSome: myExpertsOnSome,
                expertsOnAll: expertsOnAll,
                expertsOnSome: expertsOnSome,
                myTagsOnAll: myTagsOnAll,
                myTagsOnSome: myTagsOnSome,
                tagsOnAll: tagsOnAll,
                tagsOnSome: tagsOnSome,
                requestAccessMode: requestAccessMode,
                requestAccess: commonRequestAccess,
                locations: Object.keys(locationHash)
            };
        };
        viewModel.prototype.onSchema = function () {
            logger.logInfo("show schema from batch properties", { ids: browseManager.multiSelected().map(function (s) { return s.__id; }) });
            detailsManager.showSchema();
            layoutManager.bottomExpanded(true);
        };
        viewModel.prototype.cancel = function () {
            this.takeSnapshot();
            batchSchemaManager.cancel();
            batchManagementManager.cancel();
            layoutManager.unmask();
        };
        viewModel.prototype.saveChanges = function () {
            var _this = this;
            this.isSaving(true);
            var propertyChanges = this.getChanges();
            var schemaChanges = batchSchemaManager.getChanges();
            var authChanges = batchManagementManager.getChanges();
            catalogService.saveBatchChanges(propertyChanges, schemaChanges, authChanges, browseManager.multiSelected(), function () { browseManager.rebindView(); })
                .done(function () {
                _this.takeSnapshot();
                batchSchemaManager.init();
                batchManagementManager.init();
                layoutManager.unmask();
                _this.isSaving(false);
            });
        };
        viewModel.prototype.getChanges = function () {
            var changes = {};
            // Determine description change
            var desc = this.snapshot().description();
            if (desc !== this.snapshotData.description) {
                changes.description = desc;
            }
            // Determine expert deltas
            var endingExpertsOnAll = this.snapshot().expertsOnAll().map(function (t) { return t.name; });
            var endingExpertsOnSome = this.snapshot().expertsOnSome().map(function (t) { return t.name; });
            var expertsToAdd = util.arrayExcept(endingExpertsOnAll, this.snapshotData.expertsOnAll);
            var expertsToRemoveFromAll = util.arrayExcept(this.snapshotData.expertsOnAll, endingExpertsOnAll);
            var expertsToRemoveFromSome = util.arrayExcept(this.snapshotData.expertsOnSome, endingExpertsOnSome);
            expertsToRemoveFromSome = util.arrayExcept(expertsToRemoveFromSome, expertsToAdd);
            var expertsToRemove = expertsToRemoveFromAll.concat(expertsToRemoveFromSome);
            if (expertsToAdd.length) {
                changes.expertsToAdd = expertsToAdd;
            }
            if (expertsToRemove.length) {
                changes.expertsToRemove = expertsToRemove;
            }
            // Determine tag deltas
            var endingTagsOnAll = this.snapshot().tagsOnAll().map(function (t) { return t.name; });
            var endingTagsOnSome = this.snapshot().tagsOnSome().map(function (t) { return t.name; });
            var tagsToAdd = util.arrayExcept(endingTagsOnAll, this.snapshotData.tagsOnAll);
            var tagsToRemoveFromAll = util.arrayExcept(this.snapshotData.tagsOnAll, endingTagsOnAll);
            var tagsToRemoveFromSome = util.arrayExcept(util.arrayExcept(this.snapshotData.tagsOnSome, endingTagsOnSome), tagsToAdd);
            var tagsToRemove = tagsToRemoveFromAll.concat(tagsToRemoveFromSome);
            if (tagsToAdd.length) {
                changes.tagsToAdd = tagsToAdd;
            }
            if (tagsToRemove.length) {
                changes.tagsToRemove = tagsToRemove;
            }
            // Determine changes to request access
            var endingRequestAccess = this.snapshot().requestAccess();
            if (endingRequestAccess !== this.snapshotData.requestAccess && this.snapshot().requestAccessMode() !== "Mixed") {
                changes.requestAccess = endingRequestAccess;
            }
            return changes;
        };
        viewModel.prototype.onClickEditRequestAccess = function (d, e) {
            $(e.target).parent().popover("hide");
            this.requestAccessShowEditMode(true);
            if (this.snapshot().requestAccessMode() === "Mixed") {
                this.snapshot().requestAccessMode(null);
                this.snapshot().requestAccess("");
            }
            return true;
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=batchproperties.js.map