// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./batchproperties.html" />
/// <amd-dependency path="css!./batchproperties.css" />

import ko = require("knockout");
import $ = require("jquery");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import layoutManager = Microsoft.DataStudio.DataCatalog.Managers.LayoutManager;
import catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
import detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
import batchSchemaManager = Microsoft.DataStudio.DataCatalog.Managers.BatchSchemaManager;
import batchManagementManager = Microsoft.DataStudio.DataCatalog.Managers.BatchManagementManager;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./batchproperties.html");

interface ISnapshotData {
    description: string;
    myExpertsOnAll: string[];
    myExpertsOnSome: string[];
    expertsOnAll: string[];
    expertsOnSome: string[];
    myTagsOnAll: string[];
    myTagsOnSome: string[];
    tagsOnAll: string[];
    tagsOnSome: string[];

    requestAccessMode: string; // "Mixed"/null
    requestAccess: string;
    locations: string[];
}

export class viewModel {
    private dispose: () => void;
    resx = resx;
    plainText = util.plainText;

    // Take a snapshot of the state of affairs so that, when the user commits the changes,
    // we can compare what they are committing to the snapshot and find additions and
    // deletions. We don't want this to be bound via ko, o/w we would be unable to figure
    // out all the changes the user performed.
    private snapshotData: ISnapshotData;
    public snapshot = ko.observable<Interfaces.IBindableSnapshot>();

    private tagCreators: { [tag: string]: Interfaces.ITooltipInfo[]; };
    private expertCreators: { [expert: string]: Interfaces.ITooltipInfo[]; };

    commitEnabled: KnockoutComputed<boolean>;
    isSaving = ko.observable(false);

    validateEmail = util.validateEmails;

    constructor() {
        this.takeSnapshot();

        this.commitEnabled = ko.computed(() => {
            var changes = this.getChanges();
            this.hasRequestAccessChanges(changes.requestAccess !== void 0);
            var hasPropertyChanges = !!Object.keys(changes).length;
            var hasSchemaChanges = batchSchemaManager.hasChanges();
            var hasAuthChanges = batchManagementManager.hasChanges();
            var hasChanged = hasPropertyChanges || hasSchemaChanges || hasAuthChanges;
            
            if (hasChanged) {
                layoutManager.maskRight();
                layoutManager.maskBottom();
            } else {
                layoutManager.unmask();
            }
            return hasChanged;
        });

        var subscription = browseManager.multiSelected.subscribe(() => {
            // Setup snapshots for comparing during commit
            if (browseManager.multiSelected().length > 1) {
                // This is batch properties so don't do any work we don't need to
                this.takeSnapshot();
            }
        });

        this.dispose = () => {
            subscription.dispose();
            this.commitEnabled.dispose();
            layoutManager.unmask();
        };
    }

    selectedText = ko.pureComputed(() => {
        return util.stringFormat(resx.multiSelectedTextFormat, browseManager.multiSelected().length);
    });

    private takeSnapshot() {
        this.snapshotData = this.getSnapshot();
        var copy = <ISnapshotData>$.extend(true, {}, this.snapshotData);

        var myExpertsOnAllLookup = {};
        copy.myExpertsOnAll.forEach(e => {
            myExpertsOnAllLookup[e] = true;
        });

        var myExpertsOnSomeLookup = {};
        copy.myExpertsOnSome.forEach(e => {
            myExpertsOnSomeLookup[e] = true;
        });

        var myTagsOnAllLookup = {};
        copy.myTagsOnAll.forEach(t => {
            myTagsOnAllLookup[t] = true;
        });

        var myTagsOnSomeLookup = {};
        copy.myTagsOnSome.forEach(e => {
            myTagsOnSomeLookup[e] = true;
        });

        var sorter = (a: Interfaces.IAttributeInfo, b: Interfaces.IAttributeInfo): number => {
            var favorMine = (a: Interfaces.IAttributeInfo, b: Interfaces.IAttributeInfo) => {
                if (a.readOnly === b.readOnly) { return 0; }
                if (!a.readOnly) { return -1; }
                if (!b.readOnly) { return 1; }
                return 0;
            };

            var compareStrings = (a: string, b: string) => {
                if (a > b) { return 1; }
                if (a < b) { return -1; }
                return 0;
            }
            // Sort mine first and then alphabetically
            return favorMine(a, b) || compareStrings(a.name, b.name);
        };

        var expertsOnAll = copy.expertsOnAll.map(e => {
            var tooltips: Interfaces.ITooltipInfo[] = this.expertCreators[e];
            return { name: e, readOnly: !myExpertsOnAllLookup[e], tooltips: tooltips };
        }).sort(sorter);
        var expertsOnSome = copy.expertsOnSome.map(e => {
            var tooltips: Interfaces.ITooltipInfo[] = this.expertCreators[e];
            return { name: e, readOnly: !myExpertsOnSomeLookup[e], tooltips: tooltips };
        }).sort(sorter);

        var tagsOnAll = copy.tagsOnAll.map(t => {
            var tooltips: Interfaces.ITooltipInfo[] = this.tagCreators[t];
            return { name: t, readOnly: !myTagsOnAllLookup[t], tooltips: tooltips };
        }).sort(sorter);
        var tagsOnSome = copy.tagsOnSome.map((t) => {
            var tooltips: Interfaces.ITooltipInfo[] = this.tagCreators[t];
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
    }

    private getSnapshot(): ISnapshotData {
        var descriptionHash = {};

        var myTagIntersections: string[];
        var myDistinctTags: string[];
        var tagIntersection: string[];
        var tagUnion: string[];

        var myExpertIntersections: string[];
        var myDistinctExperts: string[];
        var expertIntersection: string[];
        var expertUnion: string[];

        var requestAccessHash = {};
        var locationHash = {};

        this.tagCreators = {};
        this.expertCreators = {};

        browseManager.multiSelected().forEach((a: Interfaces.IBindableDataEntity) => {
            a.descriptions().forEach((desc: Interfaces.IBindableDescription) => {
                desc.tags().forEach((tag: string) => {
                    this.tagCreators[tag] = this.tagCreators[tag] || [];
                    if (!this.tagCreators[tag].some(tp => tp.email === desc.__creatorId)) {
                        this.tagCreators[tag].push({ email: desc.__creatorId });
                    }
                });
            });
            var myExpertObj = util.arrayFirst(a.experts().filter(e => e.__creatorId === $tokyo.user.email));
            var myExperts = [];
            if (myExpertObj) {
                myExperts = myExpertObj.experts().map($.trim);
            }
            var allExperts = [];
            a.experts().forEach(e => {
                allExperts = allExperts.concat(e.experts());
                e.experts().forEach((expert: string) => {
                    this.expertCreators[expert] = this.expertCreators[expert] || [];
                    if (!this.expertCreators[expert].some(tp => tp.email === e.__creatorId)) {
                        this.expertCreators[expert].push({ email: e.__creatorId });
                    }
                });
            });

            // My experts
            if (!myExpertIntersections) {
                myExpertIntersections = myExperts;
            } else {
                myExpertIntersections = util.arrayIntersect(myExpertIntersections, myExperts);
            }

            if (!myDistinctExperts) {
                myDistinctExperts = util.arrayDistinct(myExperts);
            } else {
                myDistinctExperts = util.arrayDistinct(myDistinctExperts.concat(myExperts));
            }

            // All experts
            if (!expertIntersection) {
                expertIntersection = allExperts;
            } else {
                expertIntersection = util.arrayIntersect(expertIntersection, allExperts);
            }

            if (!expertUnion) {
                expertUnion = util.arrayDistinct(allExperts);
            } else {
                expertUnion = util.arrayDistinct(expertUnion.concat(allExperts));
            }

            var myDescObj = util.arrayFirst(a.descriptions().filter(e => e.__creatorId === $tokyo.user.email));
            var myTags = [];
            if (myDescObj) {
                myTags = myDescObj.tags().map($.trim);
                // My description
                var trimmedDesc = $.trim(myDescObj.description());
                descriptionHash[this.plainText(trimmedDesc)] = true;
            }

            var allTags = [];
            a.descriptions().forEach(d => {
                allTags = allTags.concat(d.tags());
            });

            // My tags
            if (!myTagIntersections) {
                myTagIntersections = myTags;
            } else {
                myTagIntersections = util.arrayIntersect(myTagIntersections, myTags);
            }

            if (!myDistinctTags) {
                myDistinctTags = util.arrayDistinct(myTags);
            } else {
                myDistinctTags = util.arrayDistinct(myDistinctTags.concat(myTags));
            }

            // All tags
            if (!tagIntersection) {
                tagIntersection = allTags;
            } else {
                tagIntersection = util.arrayIntersect(tagIntersection, allTags);
            }

            if (!tagUnion) {
                tagUnion = util.arrayDistinct(allTags);
            } else {
                tagUnion = util.arrayDistinct(tagUnion.concat(allTags));
            }

            var requestAccessObject = a.getMostRecentAccessInstruction();
            var trimmedContent = $.trim(requestAccessObject.content);
            requestAccessHash[this.plainText(trimmedContent)] = true;
            locationHash[((a.dsl || <any>{}).address || {}).server || ""] = true;
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
        }
    }

    onSchema() {
        logger.logInfo("show schema from batch properties", { ids: browseManager.multiSelected().map(s => s.__id) });
        detailsManager.showSchema();
        layoutManager.bottomExpanded(true);
    }

    cancel() {
        this.takeSnapshot();
        batchSchemaManager.cancel();
        batchManagementManager.cancel();
        layoutManager.unmask();
    }

    saveChanges() {
        this.isSaving(true);
        var propertyChanges = this.getChanges();
        var schemaChanges = batchSchemaManager.getChanges();
        var authChanges = batchManagementManager.getChanges();

        catalogService.saveBatchChanges(propertyChanges, schemaChanges, authChanges, browseManager.multiSelected(), () => { browseManager.rebindView(); })
            .done(() => {
                this.takeSnapshot();
                batchSchemaManager.init();
                batchManagementManager.init();
                layoutManager.unmask();
                this.isSaving(false);
            });
    }

    private getChanges(): Interfaces.IAssetChanges {
        var changes: Interfaces.IAssetChanges = {};

        // Determine description change
        var desc = this.snapshot().description();
        if (desc !== this.snapshotData.description) {
            changes.description = desc;
        }

        // Determine expert deltas
        var endingExpertsOnAll = this.snapshot().expertsOnAll().map(t => t.name);
        var endingExpertsOnSome = this.snapshot().expertsOnSome().map(t => t.name);

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
        var endingTagsOnAll = this.snapshot().tagsOnAll().map(t => t.name);
        var endingTagsOnSome = this.snapshot().tagsOnSome().map(t => t.name);

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
    }

    //#region Request Access
    requestAccessShowEditMode = ko.observable(false);
    isChangingRequestAccess = ko.observable(false);
    hasRequestAccessChanges = ko.observable(false);

    onClickEditRequestAccess(d, e) {
        (<any>$(e.target)).parent().popover("hide"); 
        this.requestAccessShowEditMode(true);
        if (this.snapshot().requestAccessMode() === "Mixed") {
            this.snapshot().requestAccessMode(null);
            this.snapshot().requestAccess("");
        } 
        return true;
    }

    showEditForRequestAccess = ko.pureComputed<boolean>(() => {
        return this.requestAccessShowEditMode() || (!this.snapshot().requestAccess() && this.snapshot().requestAccessMode() !== "Mixed");
    });

    requestAccessLinkText = ko.pureComputed<string>(() => {
        var instructions = this.snapshot().requestAccess() || "";
        var highlightedWords = util.extractHighlightedWords(instructions);
        var plainText = $.trim(util.plainText(instructions));

        var assetInfo = "%0A";
        // Build a list of selected objects along with connection information so the recipient has the information needed to identify the asset.
        browseManager.multiSelected().forEach(a => {
            assetInfo += resx.address_sourceName + ": " + a.name + "%0A";
            $.each(a.dsl.address,(key) => {
                var value = util.plainText(a.dsl.address[key]);
                assetInfo += " " + (resx["address_" + key] || key) + ": " + value + "%0A";
            });
            assetInfo += "%0A";
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
            plainText = util.applyHighlighting(highlightedWords, plainText);

            // Clean up links
            plainText = plainText.replace(/(href="{)([^}]*)(})/g, (a, b, c) => {
                return "href=\"" + util.plainText(c);
            });
        }

        return plainText;
    });

    getRequestAccessLabelTooltipText = ko.pureComputed(() => {
        return this.snapshot().requestAccessMode() === "Mixed" || this.snapshot().requestAccess()
            ? resx.requestAccessTooltip
            : resx.requestAccessVerboseTooltip;
    });

    getRequestAccessValueTooltipText = ko.pureComputed(() => {
        var instructions = this.snapshot().requestAccessMode() === "Mixed"
                                ? ""
                                : this.snapshot().requestAccess();

        var plainText = $.trim(util.plainText(instructions));

        if (plainText === util.arrayFirst((plainText.match(constants.HttpRegex) || []))) {
            // Http/https link
            return plainText;
        } else if (plainText === util.arrayFirst((plainText.match(constants.EmailRegex) || []))) {
            return plainText;
        } else {
            // Free text
            return plainText;
        }
    });
    //#endregion
}