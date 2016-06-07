/// <amd-dependency path="text!./templates/BlobBrowserTemplate.html" />
/// <amd-dependency path="text!./templates/ListItemTemplate.html" />
/// <amd-dependency path="text!./images/UpArrow.svg" />
/// <amd-dependency path="css!./css/BlobBrowser.css" />

import FormRenderModule = require("./FormRender");
import IConnectible = FormRenderModule.IConnectible;
import KnockoutBindings = require("../../bootstrapper/KnockoutBindings");

import IListItem = FormRenderModule.INavTable;

export class ListItemWrapper {
    private static listItemTemplate: string = require("text!./templates/ListItemTemplate.html");
    public items = ko.observableArray<IListItem>();
    public winJSListView: WinJS.UI.ListView<IListItem>;
    public onSelectionChanged: () => void;
    public template = ListItemWrapper.listItemTemplate;
    public blockActivation = false;
    public winJSListViewBindingOptions: KnockoutBindings.IWinJSListViewValueAccessor<IListItem> = null;

    constructor(parent: BlobBrowser) {
        let onSelectionChangedExecute = () => {
            this.winJSListView.selection.getItems().then(selected => {
                if (selected.length > 0 && selected[0]) {
                    parent.selectBlob(selected[0].data, this.blockActivation);
                    if (!this.blockActivation) {
                        this.blockActivation = true;
                        setTimeout(() => {
                            this.blockActivation = false;
                        }, 500);
                    }
                }
            });
        };
        this.onSelectionChanged = () => {
            setTimeout(onSelectionChangedExecute, 0);
        };

        this.winJSListViewBindingOptions = {
            data: this.items,
            options: {
                maxLeadingPages: Number.MAX_VALUE,
                maxTrailingPages: Number.MAX_VALUE,
                layout: new WinJS.UI.ListLayout(),
                selectionMode: WinJS.UI.SelectionMode.single,
                tapBehavior: WinJS.UI.TapBehavior.directSelect,
                oniteminvoked: this.onSelectionChanged
            },
            template: this.template
        };
    }
}

interface IBreadCrumb {
    name: string;
}

export class BlobBrowser {
    public static blobBrowserTemplate: string = require("text!./templates/BlobBrowserTemplate.html");
    public listItems = new ListItemWrapper(this);
    public folderPath: KnockoutComputed<string>;
    public breadCrumbs = ko.observableArray<IBreadCrumb>();
    public directorySelected = ko.observable(false);
    public winJSListViewBindingOptions: KnockoutBindings.IWinJSListViewValueAccessor<IListItem> = null;

    private blobPathBase = ko.observable("");
    private blobName = ko.observable("");
    private backButtonEnabled: KnockoutComputed<boolean>;
    private loadRequestId = 0;
    private visibleObservable: KnockoutObservable<boolean>;
    private resultObservable: KnockoutObservable<string>;
    private resultDsr: KnockoutObservable<string>;
    private selectedItem: IListItem;
    private connectible: IConnectible;
    private dsrCache: { [path: string]: string } = {};
    private loading = ko.observable(false);

    constructor(visible: KnockoutObservable<boolean>, resultObservable: KnockoutObservable<string>, resultDsr: KnockoutObservable<string>) {
        this.visibleObservable = visible;
        this.resultObservable = resultObservable;
        this.resultDsr = resultDsr;
        this.folderPath = ko.computed(() => {
            if (this.blobPathBase()) {
                return this.blobPathBase() + (this.blobName() ? "/" + this.blobName() : "");
            } else {
                return this.blobName();
            }
        });
        this.backButtonEnabled = ko.computed(() => {
            return !!this.blobPathBase();
        });
        this.blobPathBase.subscribe(pathBase => {
            let breadCrumbs: IBreadCrumb[] = [];
            if (pathBase) {
                pathBase.split("/").forEach(folder => {
                    breadCrumbs.push({ name: folder });
                });
            }
            this.breadCrumbs(breadCrumbs);
        });
    }

    public initialize(connectible: IConnectible) {
        this.connectible = connectible;
        this.dsrCache = {};
        this.breadCrumbs([]);
        this.blobPathBase("");
        this.blobName("");
        this.loadItems();
    }

    public breadCrumbClick(breadcrumb: IBreadCrumb) {
        let selectedIndex = -1;
        this.breadCrumbs().forEach((bc, idx) => {
            if (bc === breadcrumb) { selectedIndex = idx; }
        });
        if (selectedIndex < this.breadCrumbs().length - 1) {
            this.blobPathBase(this.breadCrumbs().slice(0, selectedIndex + 1).map(bc => bc.name).join("/"));
            this.loadItems();
        }
    }

    public render() {
        this.listItems.winJSListView.forceLayout();
    }

    public selectListItem(listItem: IListItem) {
        this.blobName(listItem.name);
    }

    public selectBlob(selectedItem: IListItem, blockActivation: boolean) {
        this.selectedItem = selectedItem;
        this.directorySelected(!selectedItem.isLeafNode);
        if (!selectedItem.isLeafNode && !blockActivation) {
            this.blobPathBase(this.blobPathBase() + "/" + selectedItem.name);
            this.blobPathBase(this.slashTrim(this.blobPathBase()));
            this.listItems.items([]);
            this.loadItems();
        } else {
            this.blobName(selectedItem.name);
        }
    }

    public choose() {
        if (!this.selectedItem) {
            return;
        }
        if (this.resultObservable() !== this.folderPath()) {
            this.resultObservable(this.folderPath());
        } else {
            this.resultObservable.valueHasMutated();
        }
        this.resultDsr(this.selectedItem.datasourceReference);
        this.visibleObservable(false);
    }

    public close() {
        this.visibleObservable(false);
    }

    public findFirstFile(folderPath: string, recursive: boolean): Q.Promise<IListItem> {
        let dsr = this.dsrCache[folderPath];
        return FormRenderModule.getNavTable(this.connectible, dsr).then(items => {
            let candidateItems = items.filter(itm => itm.isLeafNode);
            if (candidateItems.length > 0) {
                return candidateItems[0];
            } else {
                return undefined;
            }
        });
    }

    private slashTrim(input: string): string {
        if (input[0] === "/") {
            return input.substr(1);
        } else {
            return input;
        }
    }

    private loadItems() {
        this.loadRequestId++;
        let containerLoadRequestId = this.loadRequestId;
        let path = this.blobPathBase();
        let dsr = undefined;
        if (path) {
            dsr = this.dsrCache[path];
        }
        this.listItems.items.removeAll();
        this.loading(true);

        FormRenderModule.getNavTable(this.connectible, dsr).then(result => {
            if (containerLoadRequestId === this.loadRequestId) {
                this.listItems.items.removeAll();

                let folders = result.filter(item => !item.isLeafNode);
                folders.forEach(directory => {
                    this.dsrCache[this.slashTrim(`${path || ""}/${directory.name}`)] = directory.datasourceReference;
                });
                let files = result.filter(item => item.isLeafNode);
                this.listItems.items(folders.concat(files));
                this.blobName("");
            }
        }).fail(reason => {
            throw "Failed to load items";
        }).finally(() => {
            this.loading(false);
        });
    }

    /* tslint:disable:no-unused-variable */
    private navigateBack() {
        /* tslint:enable:no-unused-variable */
        let blobPathSplit = this.blobPathBase().split("/");
        if (blobPathSplit.length === 0) {
            return;
        }
        blobPathSplit.pop();
        this.blobPathBase(blobPathSplit.join("/"));
        this.loadItems();
    }

    /* tslint:disable:no-unused-variable */
    private click() {
        /* tslint:enable:no-unused-variable */
        if (this.listItems.blockActivation) {
            this.listItems.blockActivation = false;
            this.listItems.onSelectionChanged();
        } else {
            this.listItems.blockActivation = true;
            setTimeout(() => {
                this.listItems.blockActivation = false;
            }, 500);
        }
    }
}

class BlobBrowserWrapper {
    vm: BlobBrowser;
    /* tslint:disable:no-any */
    constructor(params: any) {
        /* tslint:enable:no-any */
        this.vm = <BlobBrowser>params.vm;
    }
}

ko.components.register("datafactory-blobbrowser", {
    viewModel: BlobBrowserWrapper,
    template: BlobBrowser.blobBrowserTemplate
});
