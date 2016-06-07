// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./properties.html" />
/// <amd-dependency path="css!./properties.css" />

import ko = require("knockout");
import $ = require("jquery");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
import catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
import detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import SourceTypes = Microsoft.DataStudio.DataCatalog.Core.SourceTypes;
import modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./properties.html");

export class viewModel {
    private dispose: () => void;
    resx = resx;
    plainText = util.plainText;
    propertyActions: any[];
    entity = browseManager.selected;
    descExpanded = ko.observable(false);

    tagAttributes = ko.observableArray<Interfaces.IAttributeInfo>([]);
    expertAttributes = ko.observableArray<Interfaces.IAttributeInfo>([]);

    delayedEntityChange = ko.observable().extend({ rateLimit: 1 });

    //#region spinner observables
    isChangingFriendlyName = ko.observable(false);
    isSettingFriendlyName = ko.observable(false);
    successUpdatingFriendlyName = ko.observable(false);

    isChangingDesc = ko.observable(false);
    isSettingDesc = ko.observable(false);
    successUpdatingDesc = ko.observable(false);

    isSettingExperts = ko.observable(false);
    successUpdatingExperts = ko.observable(false);
    isSettingTags = ko.observable(false);
    successUpdatingTags = ko.observable(false);

    isChangingRequestAccess = ko.observable(false);
    isSettingRequestAccess = ko.observable(false);
    successUpdatingRequestAccess = ko.observable(false);
    //#endregion

    validateEmail = util.validateEmails;

    constructor() {
        this.propertyActions = [
            { name: resx.preview, iconPath: Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "properties/preview.png", action: this.onPreview, visible: ko.pureComputed(() => { return this.entity() && this.entity().hasPreviewLink(); }) },
            { name: resx.schema, iconPath: Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "properties/schema.png", action: this.onSchema, visible: ko.pureComputed(() => { return this.entity() && this.entity().hasSchema(); }) },
            { name: resx.dataProfile, iconClass: "glyphicon glyphicon-stats", action: this.onDataProfile, visible: ko.pureComputed(() => { return this.entity() && this.entity().hasDataProfile(); }) },
            { name: resx.docs, iconPath: Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "properties/docs.png", action: this.onDocs, visible: ko.pureComputed(() => { return this.entity() && this.entity().hasDocumentation(); }) }
        ];

        var onSelectedChanged = (newValue: Interfaces.IBindableDataEntity) => {
            this.setTagAttributes();
            this.setExpertAttributes();
            this.updateRequestAccessInstructions();
            this.delayedEntityChange(newValue);
        };

        var beforeSelectedChanged = (oldValue: Interfaces.IBindableDataEntity) => {
            if (oldValue) {
                if (this.isChangingFriendlyName() || this.isChangingDesc() || this.isChangingRequestAccess()) {
                    oldValue.metadataLastUpdated(new Date());
                    oldValue.metadataLastUpdatedBy($tokyo.user.email);
                }
                if (this.isChangingFriendlyName()) {
                    var friendlyName = $("#properties-friendly-name").val();
                    this.myDesc().friendlyName(friendlyName);
                    catalogService.updateUserDescription(oldValue.__id, this.myDesc(),() => {});
                    this.isChangingFriendlyName(false);
                }
                if (this.isChangingDesc()) {
                    catalogService.updateUserDescription(oldValue.__id, this.myDesc(),() => {});
                    this.isChangingDesc(false);
                }
                if (this.isChangingRequestAccess()) {
                    var instructions = util.arrayFirst(oldValue.accessInstructions.filter(ai => ai.__creatorId === $tokyo.user.email));
                    instructions.content = $("#properties-request-access-instructions").val();
                    catalogService.updateAccessInstruction(oldValue.__id, instructions,() => {});
                    this.isSettingRequestAccess(false);
                }
            }
        };

        onSelectedChanged(browseManager.selected());
        var subscription = browseManager.selected.subscribe(onSelectedChanged);
        var beforeChangeSubscription = browseManager.selected.subscribe(beforeSelectedChanged, null, "beforeChange");

        this.dispose = () => {
            subscription.dispose();
            beforeChangeSubscription.dispose();
        };
    }

    private setTagAttributes() {
        var tags = browseManager.selected() ? this.getTagAttributes() : [];
        this.tagAttributes(tags);
    }

    private setExpertAttributes() {
        var experts = browseManager.selected() ? this.getExpertAttributes() : [];
        this.expertAttributes(experts);
    }

    private getDescriptionsByEmails(emails: string[], predicate?: (desc: Interfaces.IBindableDescription) => boolean): Interfaces.IBindableDescription[] {
        predicate = predicate || (() => { return true; });
        var matches: Interfaces.IBindableDescription[] = [];

        $.each(emails,(i, email) => {
            $.each(this.entity().descriptions(), (j, desc: Interfaces.IBindableDescription) => {
                if (email && desc.__creatorId === email && predicate(desc)) {
                    matches.push(desc);
                    return false;
                }
            });
        });

        return matches;
    }

    private getAllExpertsByEmails(): Interfaces.IBindableExpert[][]{
        var emails: string[] = this.entity().allExperts();
        var matches: Interfaces.IBindableExpert[][] = [];
        var sortedEmailIndices = {};

        $.each(emails,(i, email) => {
            sortedEmailIndices[email] = i;
        });

        $.each(this.entity().experts(),(i, expertCreator) => {
            $.each(expertCreator.experts(),(j, addedExpertEmail) => {
                var sortedExpertIndex = sortedEmailIndices[addedExpertEmail];
                matches[sortedExpertIndex] = matches[sortedExpertIndex] || [];
                matches[sortedExpertIndex].push(expertCreator);
            });
        });

        return matches;
    }

    private getOtherDescriptions(): Interfaces.IBindableDescription[]{
        var others: Interfaces.IBindableDescription[] = [];

        // Find the experts if they exist
        $.each(util.arrayDistinct(this.entity().allExperts()), (i, expert: string) => {
            $.each(this.entity().descriptions(), (j, other: Interfaces.IBindableDescription) => {
                if (other.__creatorId !== $tokyo.user.email && other.__creatorId === expert && !!$.trim(other.description())) {
                    others.push(other);
                }
            });
        });

        // Add the rest
        $.each(this.entity().descriptions(), (i, other: Interfaces.IBindableDescription) => {
            if (other.__creatorId !== $tokyo.user.email && this.entity().allExperts().every(e => e !== other.__creatorId) && !!$.trim(other.description())) {
                others.push(other);
            }
        });

        return others;
    }

    friendlyNameIsSet = ko.pureComputed<boolean>(() => {
        return !!$.grep(this.entity().descriptions(), (desc, i) => { return !!desc.friendlyName;  }).length;
    });

    userIsExpert = ko.pureComputed<boolean>(() => {
        return this.entity().allExperts().some(e => e === $tokyo.user.email);
    });

    private getExpertAttributes(): Interfaces.IAttributeInfo[]{
        var myExperts = {};
        this.myExpert().experts().forEach(e => {
            myExperts[e] = true;
        });

        var all = this.entity().allExperts();
        var creator: Interfaces.IBindableExpert[][] = this.getAllExpertsByEmails();
        return all.map((e, i) => {
            var tooltips: Interfaces.ITooltipInfo[] = creator[i].map(creator => {
                return {email: creator.__creatorId };
            });
            return {
                name: e,
                tooltips: tooltips,
                readOnly: !myExperts[e]
            }
        });
    }

    // Case insensitive distinct list of all tags
    private getTagAttributes(): Interfaces.IAttributeInfo[]{
        var tagSummary: Interfaces.IAttributeInfo[] = [];
        var tagHash = {};
        // Use mine -> experts -> others
        // Mine
        var myDescription = util.arrayFirst(this.getDescriptionsByEmails([$tokyo.user.email]));
        $.each(myDescription.tags(),(i, tag) => {
            tag = $.trim(tag);
            if (tag && !tagHash[tag.toUpperCase()]) {
                tagHash[tag.toUpperCase()] = true;
                var tooltips: Interfaces.ITooltipInfo[] = [{ email: $tokyo.user.email }];
                tagSummary.push({ name: tag, tooltips: tooltips, readOnly: false });
            }
        });

        // Experts
        var expertDescriptions = this.getDescriptionsByEmails(this.entity().allExperts());
        if (expertDescriptions && expertDescriptions.length) {
            $.each(expertDescriptions,(i, expertDescription) => {
                $.each(expertDescription.tags(),(j, tag) => {
                    tag = $.trim(tag);
                    if (expertDescription.__creatorId !== $tokyo.user.email && tag) {
                        if (!tagHash[tag.toUpperCase()]) {
                        tagHash[tag.toUpperCase()] = true;
                            var tooltips: Interfaces.ITooltipInfo[] = [{ email: expertDescription.__creatorId }];
                            tagSummary.push({ name: tag, tooltips: tooltips, readOnly: true });
                        }
                        else {
                            $.each(tagSummary,(i, currentSummary) => {
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
        $.each(this.entity().descriptions() || [], (i, other: Interfaces.IBindableDescription) => {
            if (other.__creatorId !== $tokyo.user.email && this.entity().allExperts().every(e => e !== other.__creatorId)) {
                $.each(other.tags() || [],(j, tag: string) => {
                    tag = $.trim(tag);
                    if (tag) {
                        if (!tagHash[tag.toUpperCase()]) {
                        tagHash[tag.toUpperCase()] = true;
                            var tooltips: Interfaces.ITooltipInfo[] = [{ email: other.__creatorId }];
                            tagSummary.push({ name: tag, tooltips: tooltips, readOnly: true });
                        }
                        else {
                            $.each(tagSummary,(i, currentSummary) => {
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
    }

    myDesc = ko.pureComputed<Interfaces.IBindableDescription>(() => {
        return util.arrayFirst(this.getDescriptionsByEmails([$tokyo.user.email]));
    });

    myExpert = ko.pureComputed(() => {
        var myExperts = this.entity().experts().filter(e => e.__creatorId === $tokyo.user.email);
        return <Interfaces.IBindableExpert>util.arrayFirst(myExperts);
    });

    myAccessInstruction = ko.pureComputed(() => {
        return util.arrayFirst(this.entity().accessInstructions.filter(ai => ai.__creatorId === $tokyo.user.email));
    });

    friendlyName = ko.pureComputed<string>(() => {
        var ensureFriendlyName = (desc: Interfaces.IBindableDescription) => { return desc && desc.friendlyName() && !!$.trim(desc.friendlyName()); };
        var expertDescriptions = this.getDescriptionsByEmails(this.entity().allExperts(), ensureFriendlyName);
        var firstFriendlyName = "";

        // Try to find from experts
        $.each(expertDescriptions || [],(i, desc: Interfaces.IBindableDescription) => {
            if (ensureFriendlyName(desc)) {
                firstFriendlyName = desc.friendlyName();
                return false;
            }
        });
        if (firstFriendlyName) {
            this.plainText(firstFriendlyName);
        }

        // Not found on experts, just find the first one
        $.each(this.entity().descriptions() || [], (i, desc: Interfaces.IBindableDescription) => {
            if (ensureFriendlyName(desc)) {
                firstFriendlyName = desc.friendlyName();
                return false;
            }
        });
        return <string>this.plainText(firstFriendlyName);
    });

    expandText = ko.pureComputed<string>(() => {
        var others = this.getOtherDescriptions();
        return this.descExpanded() ? util.stringFormat("- {0}", resx.seeLess) : util.stringFormat("+ {0} ({1})", resx.seeAll, others.length);
    });

    expandable = ko.pureComputed<boolean>(() => {
        return this.getOtherDescriptions().length > 1;
    });

    otherDescriptions = ko.pureComputed<Interfaces.IBindableDescription[]>(() => {
        var others = this.getOtherDescriptions();
        return others.slice(0, this.descExpanded()
                                    ? others.length
                                    : 1);
    });

    hasConnectionStrings = ko.pureComputed<boolean>(() => {
        var hasStrings = false;
        if (browseManager.selected() && browseManager.selected().dataSource) {
            hasStrings = SourceTypes.hasConnectionsString(browseManager.selected().dataSource.sourceType);
        }
        return hasStrings;
    });

    removeUserTag(tag: string) {
        var removedItems = this.myDesc().tags.remove(t => t.toUpperCase() === tag.toUpperCase());
        if (removedItems.length) {
            this.updateUserDesc(this.isSettingTags, this.successUpdatingTags);
        }
    }

    addUserTags(tags: string[]) {
        var myDesc = this.myDesc();
        // Let's see if we have any changes so we don't do an update if not necessary
        var foundChange = false;
        tags.forEach((tag) => {
            if (!myDesc.tags().some(a => $.trim(a).toUpperCase() === $.trim(tag).toUpperCase()) && $.trim(tag)) {
                foundChange = true;
                myDesc.tags.unshift(tag);
            }
        });

        if (foundChange) {
            this.updateUserDesc(this.isSettingTags, this.successUpdatingTags);
        }
    }

    removeUserExpert(expert: string) {
        var removedItems = this.myExpert().experts.remove(t => t === expert);
        if (removedItems.length) {
            this.updateUserExperts();
        }
    }

    addUserExperts(experts: string[]) {
        var myExpert = this.myExpert();
        // Let's see if we have any changes so we don't do an updated if not necessary
        var foundChange = false;
        experts.forEach((expert) => {
            if (!myExpert.experts().some(e => $.trim(e).toUpperCase() === $.trim(expert).toUpperCase()) && $.trim(expert)) {
                foundChange = true;
                myExpert.experts.unshift(expert);
            }
        });

        if (foundChange) {
            this.updateUserExperts();
        }
    }

    updateFriendlyName(data, event) {
        var friendlyName = $(event.target).val();
        var myDesc = this.myDesc();
        myDesc.friendlyName(friendlyName);
        this.updateUserDesc(this.isSettingFriendlyName, this.successUpdatingFriendlyName);
    }

    private outstandingDescUpdates = 0;
    updateUserDesc(isWorking: KnockoutObservable<boolean>, isSuccess: KnockoutObservable<boolean>): JQueryPromise<any> {
        this.entity().metadataLastUpdated(new Date());
        this.entity().metadataLastUpdatedBy($tokyo.user.email);
        isWorking(true);
        this.isChangingDesc(false);
        this.outstandingDescUpdates++;
        var promise = catalogService.updateUserDescription(this.entity().__id, this.myDesc(), () => { browseManager.rebindView(); });
        promise
            .always(() => {
                this.outstandingDescUpdates--;
                if (this.outstandingDescUpdates === 0) {
                    isWorking(false);
                    if (promise.state() === "resolved") {
                        isSuccess(true);
                        setTimeout(() => {
                        isSuccess(false); // Reset to false
                        }, 2000);
                        
                    }
                }
            });
        return promise;
    }

    private outstandingExpertUpdates = 0;
    updateUserExperts() {
        this.entity().metadataLastUpdated(new Date());
        this.entity().metadataLastUpdatedBy($tokyo.user.email);
        this.isSettingExperts(true);
        this.outstandingExpertUpdates++;
        var deferred = catalogService.updateUserExperts(this.entity().__id, this.myExpert(), () => { browseManager.rebindView(); });
        deferred
            .always(() => {
                this.outstandingExpertUpdates--;
                if (this.outstandingExpertUpdates === 0) {
                    this.isSettingExperts(false);
                    if (deferred.state() === "resolved") {
                        this.successUpdatingExperts(true);
                        setTimeout(() => {
                        this.successUpdatingExperts(false); // Reset to false
                            }, 2000);
                    }
                }
            });
    }

    private outstandingAccessInstructionsUpdates = 0;
    updateAccessInstruction(): JQueryPromise<any> {
        this.entity().metadataLastUpdated(new Date());
        this.entity().metadataLastUpdatedBy($tokyo.user.email);
        this.isSettingRequestAccess(true);
        this.outstandingAccessInstructionsUpdates++;
        var deferred = catalogService.updateAccessInstruction(this.entity().__id, this.myAccessInstruction(), () => { browseManager.rebindView(); });
        deferred
            .always(() => {
                this.outstandingAccessInstructionsUpdates--;
                if (this.outstandingAccessInstructionsUpdates === 0) {
                    this.isSettingRequestAccess(false);
                    if (deferred.state() === "resolved") {
                        this.successUpdatingRequestAccess(true);
                        setTimeout(() => {
                            this.successUpdatingRequestAccess(false); // Reset to false
                        }, 2000);
                    }
                }
            });
        return deferred;
    }

    onPreview() {
        logger.logInfo("show preview from properties", { id: this.entity().__id });
        detailsManager.showPreview();
        layoutManager.bottomExpanded(true);
    }

    onSchema() {
        logger.logInfo("show schema from properties", { id: this.entity().__id });
        detailsManager.showSchema();
        layoutManager.bottomExpanded(true);
    }

    onDocs() {
        logger.logInfo("show docs from properties", { id: this.entity().__id });
        detailsManager.showDocs();
        layoutManager.bottomExpanded(true);
    }

    onDataProfile() {
        logger.logInfo("show data profile from properties", { id: this.entity().__id });
        detailsManager.showDataProfile();
        layoutManager.bottomExpanded(true);
    }

    onSeeMore() {
        this.descExpanded(!this.descExpanded());
    }

    onCopy(data, event) {
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
    }

    deleteAsset() {
        logger.logInfo("Deleting asset from properties pane");
        browseManager.deleteSelected();
    }

    onDescBlur() {
        if (this.isChangingDesc()) {
            this.updateUserDesc(this.isSettingDesc, this.successUpdatingDesc).done(() => {
                this.isChangingDesc(false);
            });
        }
    }

    onShowConnectionStrings() {
        logger.logInfo("Open connection strings window");
        modalService.show({ title: resx.connectionStrings, component: "datacatalog-browse-connectionstrings", hideCancelButton: true }).done((modal) => {
            modal.close();
        });
    }

    //#region Request Access
    requestAccessInstructions = ko.observable("");
    requestAccessInstructionsCreator = ko.observable("");
    requestAccessInstructionsDate = ko.observable<Date>();
    requestAccessShowEditMode = ko.observable(false);
    requestAccessHighlightedWords = ko.observable<string[]>([]);

    // Initialize
    private updateRequestAccessInstructions() {
        if (!browseManager.selected()) {
            return;
        }

        var requestAccess = browseManager.selected().getMostRecentAccessInstruction();
        this.requestAccessHighlightedWords(util.extractHighlightedWords(requestAccess.content));
        this.requestAccessInstructions($.trim(util.plainText(requestAccess.content)));
        this.requestAccessInstructionsCreator(requestAccess.__creatorId);
        this.requestAccessInstructionsDate(new Date(requestAccess.modifiedTime));
        this.requestAccessShowEditMode(false);
    }
    
    showEditForRequestAccess = ko.pureComputed<boolean>(() => {
        return (!this.requestAccessInstructions() || this.requestAccessShowEditMode() || this.isChangingRequestAccess()) && !!this.entity();
    });
    
    requestAccessLinkText = ko.pureComputed<string>(() => {
        if (!this.entity()) {
            return "";
        }
        var instructions = this.requestAccessInstructions() || "";
        var plainText = $.trim(util.plainText(instructions));

        // List the connection information for the selected asset.
        var assetInfo = "%0A" + resx.address_sourceName + ": " + this.entity().name + "%0A";
        $.each(this.entity().dsl.address,(key) => {
            var value = util.plainText(this.entity().dsl.address[key]);
            assetInfo += " " + (resx["address_" + key] || key) + ": " + value + "%0A"; 
        });
        var mailToLink = "mailto:{0}?subject=" + resx.requestAccessToAssetEmailSubject + 
                         "&body=" + util.stringFormat(resx.requestAccessToBatchAssetEmailBodyFormat, assetInfo, $tokyo.user.email);

        if (plainText === util.arrayFirst((plainText.match(constants.HttpRegex) || []))) {
            return util.stringFormat("<a href=\"{0}\" target='_blank'>{1}</a>", plainText, resx.requestAccessToDataSource);
        } else if (plainText === util.arrayFirst((plainText.match(constants.EmailRegex) || []))) {
            return util.stringFormat("<a href=\"{0}\">{1}</a>", util.stringFormat(mailToLink, plainText), resx.requestAccessToDataSource);
        } else {
            // Add links
            plainText = plainText.replace(constants.HttpRegex, "<a href=\"{$&}\" target='_blank'>$&</a>");
            // Add mailto
            plainText = plainText.replace(constants.EmailRegex, util.stringFormat("<a href=\"{{0}\"}>$&</a>", util.stringFormat(mailToLink, "$&")));
            // Add highlights back
            plainText = util.applyHighlighting(this.requestAccessHighlightedWords(), plainText);

            // Clean up links
            plainText = plainText.replace(/(href="{)([^}]*)(})/g, (a, b, c) => {
                return "href=\"" + util.plainText(c);
            });
        }

        return plainText;
    });
    
    updateRequestAccess(data, event) {
        var instructions = $(event.target).val();
        var myInstruction = this.myAccessInstruction();
        myInstruction.content = instructions;

        this.updateAccessInstruction()
            .always(() => {
                this.requestAccessShowEditMode(false);
            });
    }

    getRequestAccessLabelTooltipText = ko.pureComputed(() => {
        return !!this.requestAccessInstructions()
            ? resx.requestAccessTooltip
            : resx.requestAccessVerboseTooltip;
    });

    getRequestAccessValueTooltipText = ko.pureComputed(() => {
        var creator = this.requestAccessInstructionsCreator();
        var date = this.requestAccessInstructionsDate() || new Date();
        var dateText = date.toLocaleString();
        var instructions = this.requestAccessInstructions() || "";

        if (!this.entity()) {
            return "";
        }
        var plainText = $.trim(util.plainText(instructions));

        if (plainText === util.arrayFirst((plainText.match(constants.HttpRegex) || []))) {
            // Http/https link
            return util.stringFormat(resx.requestAccessUrlToolTipFormat, creator, dateText, plainText);
            // Email link
        } else if (plainText === util.arrayFirst((plainText.match(constants.EmailRegex) || []))) {
            return util.stringFormat(resx.requestAccessEmailTooltipFormat, creator, dateText, plainText);
        } else {
            // Free text
            return util.stringFormat(resx.requestAccessTooltipFormat, creator, dateText);
        }
    });
    //#endregion

    dismissPopovers() {
        (<any>$(".dismiss-popover-on-scroll")).popover("hide");
    }
}
