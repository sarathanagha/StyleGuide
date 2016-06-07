// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./commandBar.html" />
/// <amd-dependency path="css!./commandBar.css" />

import resx = Microsoft.DataStudio.DataCatalog.Core.Resx;
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import router = Microsoft.DataStudio.Application.Router;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import dsuxHelpers = Microsoft.DataStudioUX.Helpers;
import dsuxManagers = Microsoft.DataStudioUX.Managers;
import dsuxInterfaces = Microsoft.DataStudioUX.Interfaces;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
import searchService = Microsoft.DataStudio.DataCatalog.Services.SearchService;
import focusManager = Microsoft.DataStudio.DataCatalog.Managers.FocusManager;
import constants = Microsoft.DataStudio.DataCatalog.Core.Constants;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;
import ManualEntry = require("../../publish/manualentry/manualentry");

export var template: string = require("text!./commandBar.html");

export class viewModel {
    public searchTerm = browseManager.searchText;
    public selectedPublishOption: KnockoutObservable<dsuxInterfaces.SelectMenuOption>;
    public publishOptions: dsuxInterfaces.SelectMenuParams;
    public resx = resx;
    public id: string = "home-commandbar";

    constructor(parameters: any) {

        var publishItems: dsuxInterfaces.SelectMenuOption[] = [
            { label: util.stringCapitalize(this.resx.launch), value: null, action: this.redirectToPublishUrl },
            { label: util.stringCapitalize(this.resx.manualEntry), value: null, action: this.openManualEntry },
        ];

        this.selectedPublishOption = ko.observable(null);

        this.publishOptions = {
            options: publishItems,
            selected: this.selectedPublishOption
        };
    }

    public onSectionSelect = (d, e: KeyboardEvent) => {
        var key = e.which || e.keyCode;
        if (util.isSelectAction(e)) {
            focusManager.setContainerInteractive(this.id);
        }
        else if (key === constants.KeyCodes.ESCAPE) {
            focusManager.resetContianer();
        }
    }

    public isSelectedSection = ko.pureComputed<boolean>(() => {
        return focusManager.selected() === this.id;
    });

    public doSearch(): void {
        if (this.searchTerm().length > 0) {
            browseManager.doSearch({ resetPage: true });
            router.navigate("datacatalog/browse/?searchTerms=" + this.searchTerm());
        }
    }

    public redirectToPublishUrl = () => {
        logger.logInfo("launch publisher button");
        window.location.assign($tokyo.publishingLink);
    }

    public openManualEntry = () => {
        logger.logInfo("open manual entry dialog");
        var buttons: Interfaces.IModalButton[] = [
            { id: "create-more", isDefault: false, text: resx.createMoreAssets },
            { id: "navigate", isDefault: false, text: resx.createAndViewPortal }
        ];
        modalService.show({ title: resx.manualEntryTitle, component: "datacatalog-publish-manualentry", modalContainerClass: 'datacatalog-manualentry-modal-override', buttons: buttons }).done((modal) => {
            this.resolveManualEntry(modal);
        });
    }

    private resolveManualEntry(modal: Interfaces.IModalResolver) {
        logger.logInfo("resolve manual entry dialog");
        var entry = (<ManualEntry.viewModel>ko.dataFor(document.getElementById("manual-entry")));
        if (entry.isValid()) {
            entry.submitEntry().done((id) => {
                if (modal.button() === "navigate") {
                    var time = entry.assetCreatedTime.toLocaleDateString();
                    var searchTerm = util.stringFormat("upn={0} AND lastRegisteredTime > '{1}'", $tokyo.user.upn, time);
                    modal.close();
                    browseManager.searchText(searchTerm);
                    browseManager.doSearch().done(() => {
                        router.navigate("datacatalog/browse/?searchTerms=" + searchTerm);
                    });

                    // TODO [v-sergzh] after adding the location to Access-Control-Expose-Headers in ADC Gateway, renable the code below.

                    //var time = entry.assetCreatedTime.toLocaleDateString();
                    //var searchTerm = util.stringFormat("upn={0} AND lastRegisteredTime > '{1}'", $tokyo.user.upn, time);

                    //var deferred = $.Deferred();
                    //var timeout = setTimeout(() => {
                    //    deferred.reject("timeout");
                    //}, 1000 * 60 * 5);

                    //var key = id.split("/")[1];
                    //var checkTerm = key + " and upn=" + $tokyo.user.upn;

                    //var check = () => {
                    //    searchService.search({ searchTerms: checkTerm, capture: false }).done((result) => {
                    //        if (result.results.length > 0) {
                    //            clearTimeout(timeout);
                    //            deferred.resolve();
                    //        }
                    //        else {
                    //            setTimeout(check, 1500);
                    //        }
                    //    }).fail(deferred.reject);
                    //};
                    //check();

                    //deferred
                    //    .always(() => {
                    //        clearTimeout(timeout);
                    //        logger.logInfo("close manual entry dialog");
                    //        modal.close();
                    //        browseManager.searchText(searchTerm);

                    //        browseManager.doSearch().done(() => {
                    //            router.navigate("datacatalog/browse/?searchTerms=" + searchTerm);
                    //        });
                    //    });
                }
                else if (modal.button() === "create-more") {
                    modal.reset().done((rModal) => {
                        this.resolveManualEntry(rModal);
                    });
                }
                else {
                    logger.logInfo("cancel manual entry dialog");
                    modal.close();
                }
            });
        }
        else {
            modal.reset().done((rModal) => {
                this.resolveManualEntry(rModal);
            });
        }
    }
    
} 