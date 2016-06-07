// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
define(["require", "exports", "knockout", "jquery", "text!./properties.html", "css!./properties.css"], function (require, exports, ko, $) {
    var resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
    var browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
    var logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
    var layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
    var catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
    var detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
    var util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
    var constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
    var SourceTypes = Microsoft.DataStudio.DataCatalog.Core.SourceTypes;
    var modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
    exports.template = require("text!./properties.html");
    var viewModel = (function () {
        function viewModel() {
            var _this = this;
            this.resx = resx;
            this.plainText = util.plainText;
            this.entity = browseManager.selected;
            this.descExpanded = ko.observable(false);
            this.tagAttributes = ko.observableArray([]);
            this.expertAttributes = ko.observableArray([]);
            this.delayedEntityChange = ko.observable().extend({ rateLimit: 1 });
            //#region spinner observables
            this.isChangingFriendlyName = ko.observable(false);
            this.isSettingFriendlyName = ko.observable(false);
            this.successUpdatingFriendlyName = ko.observable(false);
            this.isChangingDesc = ko.observable(false);
            this.isSettingDesc = ko.observable(false);
            this.successUpdatingDesc = ko.observable(false);
            this.isSettingExperts = ko.observable(false);
            this.successUpdatingExperts = ko.observable(false);
            this.isSettingTags = ko.observable(false);
            this.successUpdatingTags = ko.observable(false);
            this.isChangingRequestAccess = ko.observable(false);
            this.isSettingRequestAccess = ko.observable(false);
            this.successUpdatingRequestAccess = ko.observable(false);
            //#endregion
            this.validateEmail = util.validateEmails;
            this.friendlyNameIsSet = ko.pureComputed(function () {
                return !!$.grep(_this.entity().descriptions(), function (desc, i) { return !!desc.friendlyName; }).length;
            });
            this.userIsExpert = ko.pureComputed(function () {
                return _this.entity().allExperts().some(function (e) { return e === $tokyo.user.email; });
            });
            this.myDesc = ko.pureComputed(function () {
                return util.arrayFirst(_this.getDescriptionsByEmails([$tokyo.user.email]));
            });
            this.myExpert = ko.pureComputed(function () {
                var myExperts = _this.entity().experts().filter(function (e) { return e.__creatorId === $tokyo.user.email; });
                return util.arrayFirst(myExperts);
            });
            this.myAccessInstruction = ko.pureComputed(function () {
                return util.arrayFirst(_this.entity().accessInstructions.filter(function (ai) { return ai.__creatorId === $tokyo.user.email; }));
            });
            this.friendlyName = ko.pureComputed(function () {
                var ensureFriendlyName = function (desc) { return desc && desc.friendlyName() && !!$.trim(desc.friendlyName()); };
                var expertDescriptions = _this.getDescriptionsByEmails(_this.entity().allExperts(), ensureFriendlyName);
                var firstFriendlyName = "";
                // Try to find from experts
                $.each(expertDescriptions || [], function (i, desc) {
                    if (ensureFriendlyName(desc)) {
                        firstFriendlyName = desc.friendlyName();
                        return false;
                    }
                });
                if (firstFriendlyName) {
                    _this.plainText(firstFriendlyName);
                }
                // Not found on experts, just find the first one
                $.each(_this.entity().descriptions() || [], function (i, desc) {
                    if (ensureFriendlyName(desc)) {
                        firstFriendlyName = desc.friendlyName();
                        return false;
                    }
                });
                return _this.plainText(firstFriendlyName);
            });
            this.expandText = ko.pureComputed(function () {
                var others = _this.getOtherDescriptions();
                return _this.descExpanded() ? util.stringFormat("- {0}", resx.seeLess) : util.stringFormat("+ {0} ({1})", resx.seeAll, others.length);
            });
            this.expandable = ko.pureComputed(function () {
                return _this.getOtherDescriptions().length > 1;
            });
            this.otherDescriptions = ko.pureComputed(function () {
                var others = _this.getOtherDescriptions();
                return others.slice(0, _this.descExpanded()
                    ? others.length
                    : 1);
            });
            this.hasConnectionStrings = ko.pureComputed(function () {
                var hasStrings = false;
                if (browseManager.selected() && browseManager.selected().dataSource) {
                    hasStrings = SourceTypes.hasConnectionsString(browseManager.selected().dataSource.sourceType);
                }
                return hasStrings;
            });
            this.outstandingDescUpdates = 0;
            this.outstandingExpertUpdates = 0;
            this.outstandingAccessInstructionsUpdates = 0;
            //#region Request Access
            this.requestAccessInstructions = ko.observable("");
            this.requestAccessInstructionsCreator = ko.observable("");
            this.requestAccessInstructionsDate = ko.observable();
            this.requestAccessShowEditMode = ko.observable(false);
            this.requestAccessHighlightedWords = ko.observable([]);
            this.showEditForRequestAccess = ko.pureComputed(function () {
                return (!_this.requestAccessInstructions() || _this.requestAccessShowEditMode() || _this.isChangingRequestAccess()) && !!_this.entity();
            });
            this.requestAccessLinkText = ko.pureComputed(function () {
                if (!_this.entity()) {
                    return "";
                }
                var instructions = _this.requestAccessInstructions() || "";
                var plainText = $.trim(util.plainText(instructions));
                // List the connection information for the selected asset.
                var assetInfo = "%0A" + resx.address_sourceName + ": " + _this.entity().name + "%0A";
                $.each(_this.entity().dsl.address, function (key) {
                    var value = util.plainText(_this.entity().dsl.address[key]);
                    assetInfo += " " + (resx["address_" + key] || key) + ": " + value + "%0A";
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
                    plainText = util.applyHighlighting(_this.requestAccessHighlightedWords(), plainText);
                    // Clean up links
                    plainText = plainText.replace(/(href="{)([^}]*)(})/g, function (a, b, c) {
                        return "href=\"" + util.plainText(c);
                    });
                }
                return plainText;
            });
            this.getRequestAccessLabelTooltipText = ko.pureComputed(function () {
                return !!_this.requestAccessInstructions()
                    ? resx.requestAccessTooltip
                    : resx.requestAccessVerboseTooltip;
            });
            this.getRequestAccessValueTooltipText = ko.pureComputed(function () {
                var creator = _this.requestAccessInstructionsCreator();
                var date = _this.requestAccessInstructionsDate() || new Date();
                var dateText = date.toLocaleString();
                var instructions = _this.requestAccessInstructions() || "";
                if (!_this.entity()) {
                    return "";
                }
                var plainText = $.trim(util.plainText(instructions));
                if (plainText === util.arrayFirst((plainText.match(constants.HttpRegex) || []))) {
                    // Http/https link
                    return util.stringFormat(resx.requestAccessUrlToolTipFormat, creator, dateText, plainText);
                }
                else if (plainText === util.arrayFirst((plainText.match(constants.EmailRegex) || []))) {
                    return util.stringFormat(resx.requestAccessEmailTooltipFormat, creator, dateText, plainText);
                }
                else {
                    // Free text
                    return util.stringFormat(resx.requestAccessTooltipFormat, creator, dateText);
                }
            });
            this.propertyActions = [
                { name: resx.preview, iconPath: Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "properties/preview.png", action: this.onPreview, visible: ko.pureComputed(function () { return _this.entity() && _this.entity().hasPreviewLink(); }) },
                { name: resx.schema, iconPath: Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "properties/schema.png", action: this.onSchema, visible: ko.pureComputed(function () { return _this.entity() && _this.entity().hasSchema(); }) },
                { name: resx.dataProfile, iconClass: "glyphicon glyphicon-stats", action: this.onDataProfile, visible: ko.pureComputed(function () { return _this.entity() && _this.entity().hasDataProfile(); }) },
                { name: resx.docs, iconPath: Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "properties/docs.png", action: this.onDocs, visible: ko.pureComputed(function () { return _this.entity() && _this.entity().hasDocumentation(); }) }
            ];
            var onSelectedChanged = function (newValue) {
                _this.setTagAttributes();
                _this.setExpertAttributes();
                _this.updateRequestAccessInstructions();
                _this.delayedEntityChange(newValue);
            };
            var beforeSelectedChanged = function (oldValue) {
                if (oldValue) {
                    if (_this.isChangingFriendlyName() || _this.isChangingDesc() || _this.isChangingRequestAccess()) {
                        oldValue.metadataLastUpdated(new Date());
                        oldValue.metadataLastUpdatedBy($tokyo.user.email);
                    }
                    if (_this.isChangingFriendlyName()) {
                        var friendlyName = $("#properties-friendly-name").val();
                        _this.myDesc().friendlyName(friendlyName);
                        catalogService.updateUserDescription(oldValue.__id, _this.myDesc(), function () { });
                        _this.isChangingFriendlyName(false);
                    }
                    if (_this.isChangingDesc()) {
                        catalogService.updateUserDescription(oldValue.__id, _this.myDesc(), function () { });
                        _this.isChangingDesc(false);
                    }
                    if (_this.isChangingRequestAccess()) {
                        var instructions = util.arrayFirst(oldValue.accessInstructions.filter(function (ai) { return ai.__creatorId === $tokyo.user.email; }));
                        instructions.content = $("#properties-request-access-instructions").val();
                        catalogService.updateAccessInstruction(oldValue.__id, instructions, function () { });
                        _this.isSettingRequestAccess(false);
                    }
                }
            };
            onSelectedChanged(browseManager.selected());
            var subscription = browseManager.selected.subscribe(onSelectedChanged);
            var beforeChangeSubscription = browseManager.selected.subscribe(beforeSelectedChanged, null, "beforeChange");
            this.dispose = function () {
                subscription.dispose();
                beforeChangeSubscription.dispose();
            };
        }
        viewModel.prototype.setTagAttributes = function () {
            var tags = browseManager.selected() ? this.getTagAttributes() : [];
            this.tagAttributes(tags);
        };
        viewModel.prototype.setExpertAttributes = function () {
            var experts = browseManager.selected() ? this.getExpertAttributes() : [];
            this.expertAttributes(experts);
        };
        viewModel.prototype.getDescriptionsByEmails = function (emails, predicate) {
            var _this = this;
            predicate = predicate || (function () { return true; });
            var matches = [];
            $.each(emails, function (i, email) {
                $.each(_this.entity().descriptions(), function (j, desc) {
                    if (email && desc.__creatorId === email && predicate(desc)) {
                        matches.push(desc);
                        return false;
                    }
                });
            });
            return matches;
        };
        viewModel.prototype.getAllExpertsByEmails = function () {
            var emails = this.entity().allExperts();
            var matches = [];
            var sortedEmailIndices = {};
            $.each(emails, function (i, email) {
                sortedEmailIndices[email] = i;
            });
            $.each(this.entity().experts(), function (i, expertCreator) {
                $.each(expertCreator.experts(), function (j, addedExpertEmail) {
                    var sortedExpertIndex = sortedEmailIndices[addedExpertEmail];
                    matches[sortedExpertIndex] = matches[sortedExpertIndex] || [];
                    matches[sortedExpertIndex].push(expertCreator);
                });
            });
            return matches;
        };
        viewModel.prototype.getOtherDescriptions = function () {
            var _this = this;
            var others = [];
            // Find the experts if they exist
            $.each(util.arrayDistinct(this.entity().allExperts()), function (i, expert) {
                $.each(_this.entity().descriptions(), function (j, other) {
                    if (other.__creatorId !== $tokyo.user.email && other.__creatorId === expert && !!$.trim(other.description())) {
                        others.push(other);
                    }
                });
            });
            // Add the rest
            $.each(this.entity().descriptions(), function (i, other) {
                if (other.__creatorId !== $tokyo.user.email && _this.entity().allExperts().every(function (e) { return e !== other.__creatorId; }) && !!$.trim(other.description())) {
                    others.push(other);
                }
            });
            return others;
        };
        viewModel.prototype.getExpertAttributes = function () {
            var myExperts = {};
            this.myExpert().experts().forEach(function (e) {
                myExperts[e] = true;
            });
            var all = this.entity().allExperts();
            var creator = this.getAllExpertsByEmails();
            return all.map(function (e, i) {
                var tooltips = creator[i].map(function (creator) {
                    return { email: creator.__creatorId };
                });
                return {
                    name: e,
                    tooltips: tooltips,
                    readOnly: !myExperts[e]
                };
            });
        };
        // Case insensitive distinct list of all tags
        viewModel.prototype.getTagAttributes = function () {
            var _this = this;
            var tagSummary = [];
            var tagHash = {};
            // Use mine -> experts -> others
            // Mine
            var myDescription = util.arrayFirst(this.getDescriptionsByEmails([$tokyo.user.email]));
            $.each(myDescription.tags(), function (i, tag) {
                tag = $.trim(tag);
                if (tag && !tagHash[tag.toUpperCase()]) {
                    tagHash[tag.toUpperCase()] = true;
                    var tooltips = [{ email: $tokyo.user.email }];
                    tagSummary.push({ name: tag, tooltips: tooltips, readOnly: false });
                }
            });
            // Experts
            var expertDescriptions = this.getDescriptionsByEmails(this.entity().allExperts());
            if (expertDescriptions && expertDescriptions.length) {
                $.each(expertDescriptions, function (i, expertDescription) {
                    $.each(expertDescription.tags(), function (j, tag) {
                        tag = $.trim(tag);
                        if (expertDescription.__creatorId !== $tokyo.user.email && tag) {
                            if (!tagHash[tag.toUpperCase()]) {
                                tagHash[tag.toUpperCase()] = true;
                                var tooltips = [{ email: expertDescription.__creatorId }];
                                tagSummary.push({ name: tag, tooltips: tooltips, readOnly: true });
                            }
                            else {
                                $.each(tagSummary, function (i, currentSummary) {
                                    if (currentSummary.name === tag) {
                                        currentSummary.tooltips.push({ email: expertDescription.__creatorId });
                                    }
                                });
                            }
                        }
                    });
                });
            }
            // Others
            $.each(this.entity().descriptions() || [], function (i, other) {
                if (other.__creatorId !== $tokyo.user.email && _this.entity().allExperts().every(function (e) { return e !== other.__creatorId; })) {
                    $.each(other.tags() || [], function (j, tag) {
                        tag = $.trim(tag);
                        if (tag) {
                            if (!tagHash[tag.toUpperCase()]) {
                                tagHash[tag.toUpperCase()] = true;
                                var tooltips = [{ email: other.__creatorId }];
                                tagSummary.push({ name: tag, tooltips: tooltips, readOnly: true });
                            }
                            else {
                                $.each(tagSummary, function (i, currentSummary) {
                                    if (currentSummary.name === tag) {
                                        currentSummary.tooltips.push({ email: other.__creatorId });
                                    }
                                });
                            }
                        }
                    });
                }
            });
            return tagSummary;
        };
        viewModel.prototype.removeUserTag = function (tag) {
            var removedItems = this.myDesc().tags.remove(function (t) { return t.toUpperCase() === tag.toUpperCase(); });
            if (removedItems.length) {
                this.updateUserDesc(this.isSettingTags, this.successUpdatingTags);
            }
        };
        viewModel.prototype.addUserTags = function (tags) {
            var myDesc = this.myDesc();
            // Let's see if we have any changes so we don't do an update if not necessary
            var foundChange = false;
            tags.forEach(function (tag) {
                if (!myDesc.tags().some(function (a) { return $.trim(a).toUpperCase() === $.trim(tag).toUpperCase(); }) && $.trim(tag)) {
                    foundChange = true;
                    myDesc.tags.unshift(tag);
                }
            });
            if (foundChange) {
                this.updateUserDesc(this.isSettingTags, this.successUpdatingTags);
            }
        };
        viewModel.prototype.removeUserExpert = function (expert) {
            var removedItems = this.myExpert().experts.remove(function (t) { return t === expert; });
            if (removedItems.length) {
                this.updateUserExperts();
            }
        };
        viewModel.prototype.addUserExperts = function (experts) {
            var myExpert = this.myExpert();
            // Let's see if we have any changes so we don't do an updated if not necessary
            var foundChange = false;
            experts.forEach(function (expert) {
                if (!myExpert.experts().some(function (e) { return $.trim(e).toUpperCase() === $.trim(expert).toUpperCase(); }) && $.trim(expert)) {
                    foundChange = true;
                    myExpert.experts.unshift(expert);
                }
            });
            if (foundChange) {
                this.updateUserExperts();
            }
        };
        viewModel.prototype.updateFriendlyName = function (data, event) {
            var friendlyName = $(event.target).val();
            var myDesc = this.myDesc();
            myDesc.friendlyName(friendlyName);
            this.updateUserDesc(this.isSettingFriendlyName, this.successUpdatingFriendlyName);
        };
        viewModel.prototype.updateUserDesc = function (isWorking, isSuccess) {
            var _this = this;
            this.entity().metadataLastUpdated(new Date());
            this.entity().metadataLastUpdatedBy($tokyo.user.email);
            isWorking(true);
            this.isChangingDesc(false);
            this.outstandingDescUpdates++;
            var promise = catalogService.updateUserDescription(this.entity().__id, this.myDesc(), function () { browseManager.rebindView(); });
            promise
                .always(function () {
                _this.outstandingDescUpdates--;
                if (_this.outstandingDescUpdates === 0) {
                    isWorking(false);
                    if (promise.state() === "resolved") {
                        isSuccess(true);
                        setTimeout(function () {
                            isSuccess(false); // Reset to false
                        }, 2000);
                    }
                }
            });
            return promise;
        };
        viewModel.prototype.updateUserExperts = function () {
            var _this = this;
            this.entity().metadataLastUpdated(new Date());
            this.entity().metadataLastUpdatedBy($tokyo.user.email);
            this.isSettingExperts(true);
            this.outstandingExpertUpdates++;
            var deferred = catalogService.updateUserExperts(this.entity().__id, this.myExpert(), function () { browseManager.rebindView(); });
            deferred
                .always(function () {
                _this.outstandingExpertUpdates--;
                if (_this.outstandingExpertUpdates === 0) {
                    _this.isSettingExperts(false);
                    if (deferred.state() === "resolved") {
                        _this.successUpdatingExperts(true);
                        setTimeout(function () {
                            _this.successUpdatingExperts(false); // Reset to false
                        }, 2000);
                    }
                }
            });
        };
        viewModel.prototype.updateAccessInstruction = function () {
            var _this = this;
            this.entity().metadataLastUpdated(new Date());
            this.entity().metadataLastUpdatedBy($tokyo.user.email);
            this.isSettingRequestAccess(true);
            this.outstandingAccessInstructionsUpdates++;
            var deferred = catalogService.updateAccessInstruction(this.entity().__id, this.myAccessInstruction(), function () { browseManager.rebindView(); });
            deferred
                .always(function () {
                _this.outstandingAccessInstructionsUpdates--;
                if (_this.outstandingAccessInstructionsUpdates === 0) {
                    _this.isSettingRequestAccess(false);
                    if (deferred.state() === "resolved") {
                        _this.successUpdatingRequestAccess(true);
                        setTimeout(function () {
                            _this.successUpdatingRequestAccess(false); // Reset to false
                        }, 2000);
                    }
                }
            });
            return deferred;
        };
        viewModel.prototype.onPreview = function () {
            logger.logInfo("show preview from properties", { id: this.entity().__id });
            detailsManager.showPreview();
            layoutManager.bottomExpanded(true);
        };
        viewModel.prototype.onSchema = function () {
            logger.logInfo("show schema from properties", { id: this.entity().__id });
            detailsManager.showSchema();
            layoutManager.bottomExpanded(true);
        };
        viewModel.prototype.onDocs = function () {
            logger.logInfo("show docs from properties", { id: this.entity().__id });
            detailsManager.showDocs();
            layoutManager.bottomExpanded(true);
        };
        viewModel.prototype.onDataProfile = function () {
            logger.logInfo("show data profile from properties", { id: this.entity().__id });
            detailsManager.showDataProfile();
            layoutManager.bottomExpanded(true);
        };
        viewModel.prototype.onSeeMore = function () {
            this.descExpanded(!this.descExpanded());
        };
        viewModel.prototype.onCopy = function (data, event) {
            var target = $(event.target);
            if (!target) {
                logger.logWarning("Attempted to log copy connection info with no target");
                return true;
            }
            try {
                var textCopying = target.text();
                var bindingTarget = target.closest("[data-bind]");
                var bindingPath = bindingTarget.attr("data-bind").replace(/^.*highlight: entity\(\)\.([^,]*).*$/, "$1");
                var id = this.entity().__id;
                logger.logInfo("Copy connection info", { text: textCopying, bindingPath: bindingPath, id: id });
            }
            catch (e) {
                logger.logWarning("Problem attempting to log copy connection info", { name: e.name, target: target.html(), message: e.message, stack: e.stack });
            }
            return true;
        };
        viewModel.prototype.deleteAsset = function () {
            logger.logInfo("Deleting asset from properties pane");
            browseManager.deleteSelected();
        };
        viewModel.prototype.onDescBlur = function () {
            var _this = this;
            if (this.isChangingDesc()) {
                this.updateUserDesc(this.isSettingDesc, this.successUpdatingDesc).done(function () {
                    _this.isChangingDesc(false);
                });
            }
        };
        viewModel.prototype.onShowConnectionStrings = function () {
            logger.logInfo("Open connection strings window");
            modalService.show({ title: resx.connectionStrings, component: "datacatalog-browse-connectionstrings", hideCancelButton: true }).done(function (modal) {
                modal.close();
            });
        };
        // Initialize
        viewModel.prototype.updateRequestAccessInstructions = function () {
            if (!browseManager.selected()) {
                return;
            }
            var requestAccess = browseManager.selected().getMostRecentAccessInstruction();
            this.requestAccessHighlightedWords(util.extractHighlightedWords(requestAccess.content));
            this.requestAccessInstructions($.trim(util.plainText(requestAccess.content)));
            this.requestAccessInstructionsCreator(requestAccess.__creatorId);
            this.requestAccessInstructionsDate(new Date(requestAccess.modifiedTime));
            this.requestAccessShowEditMode(false);
        };
        viewModel.prototype.updateRequestAccess = function (data, event) {
            var _this = this;
            var instructions = $(event.target).val();
            var myInstruction = this.myAccessInstruction();
            myInstruction.content = instructions;
            this.updateAccessInstruction()
                .always(function () {
                _this.requestAccessShowEditMode(false);
            });
        };
        //#endregion
        viewModel.prototype.dismissPopovers = function () {
            $(".dismiss-popover-on-scroll").popover("hide");
        };
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=properties.js.map