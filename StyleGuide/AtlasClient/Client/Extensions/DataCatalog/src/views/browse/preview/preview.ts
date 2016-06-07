// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />

/// <amd-dependency path="text!./preview.html" />
/// <amd-dependency path="css!./preview.css" />

import ko = require("knockout");
import resx = Microsoft.DataStudio.DataCatalog.Core.Resx
import browseManager = Microsoft.DataStudio.DataCatalog.Managers.BrowseManager;
import detailsManager = Microsoft.DataStudio.DataCatalog.Managers.DetailsManager;
import logger = Microsoft.DataStudio.DataCatalog.ComponentLogger;
import modalService = Microsoft.DataStudio.DataCatalog.Services.ModalService;
import catalogService = Microsoft.DataStudio.DataCatalog.Services.CatalogService;
import util = Microsoft.DataStudio.DataCatalog.Core.Utilities;
import Interfaces = Microsoft.DataStudio.DataCatalog.Interfaces;

export var template: string = require("text!./preview.html");

export class viewModel {
    private dispose: () => void;
    resx = resx;
    selected = browseManager.selected;

    previewData = ko.observable<{ keys: any[]; data: any[]}>();
    errorFetchingPreviewData = ko.observable<boolean>(false);

    constructor(parameters: any) {
        this.fetchPreviewData();
        this.setupHorizontalScrolling();
        var subscription = this.selected.subscribe(() => {
            this.fetchPreviewData();
            this.setupHorizontalScrolling();
        });

        this.dispose = () => {
            subscription.dispose();
        };
    }

    private setupHorizontalScrolling() {
        setTimeout(() => {
            $(".scrollable-table.content").scroll(function () {
                var l = $(".scrollable-table.content table").position().left;
                $(".scrollable-table.header").css("left", l - parseInt($(this).css("paddingLeft"), 10));
            });
        });
    }

    fetchPreviewData() {
        if (!this.selected()) { return; }
        this.previewData(null);
        this.errorFetchingPreviewData(false);

        var getPreview: () => JQueryPromise<Interfaces.IPreview>;
        if (!this.selected().preview() && this.selected().previewId) {
            getPreview = () => { return <JQueryPromise<Interfaces.IPreview>>catalogService.getAsset(this.selected().previewId); };
        } else if (this.selected().preview()) {
            getPreview = () => { return $.Deferred().resolve(this.selected().preview()).promise(); };
        } else {
            getPreview = () => { return $.Deferred().reject().promise(); };
        }

        var selected = this.selected();

        getPreview()
            .fail(() => {
                this.previewData({ keys: [], data: [] });
                this.errorFetchingPreviewData(true);
            })
            .done(preview => {
                var keys = [];
                var data = [];

                if (this.selected() === selected && preview) {
                    this.selected().preview(preview);

                    data = preview.preview;

                    if (data && data.length) {
                        var first = data[0];
                        $.each(first, (key, value) => {
                            keys.push(key);
                        });
                    }
                }

                this.previewData({ keys: keys, data: data });
            });
    }

    removePreview() {
        modalService.show({
            title: resx.confirmPreviewDeleteTitle,
            bodyText: util.stringFormat(resx.confirmPreviewDelete, util.plainText(this.selected().displayName()))
        }).then(modal => {
            var previewId = this.selected().previewId;
            logger.logInfo("deleting preview data", previewId);
            catalogService.deleteAssets([previewId])
                .done(() => {
                    this.selected().previewId = null;
                    this.selected().preview(null);
                    this.selected.notifySubscribers(this.selected());
                    if (this.selected().hasSchema()) {
                        detailsManager.showSchema();
                    }
                })
                .always(() => {
                    modal.close();
                });
        });
    }

}