/// <amd-dependency path="text!./templates/TableListItemTemplate.html" />

/* tslint:disable:no-unused-variable */
import Common = require("./Common");
import ISelectable = Common.ISelectable;
import SourceTableViewModelModule = require("./SourceTableViewModel");
import SourceTableViewModel = SourceTableViewModelModule.SourceTableViewModel;
import KnockoutBindings = require("../../bootstrapper/KnockoutBindings");
/* tslint:enable:no-unused-variable */

/* tslint:disable:no-var-requires */
export const tableListItem: string = require("text!./templates/TableListItemTemplate.html");
/* tslint:enable:no-var-requires */

class SelectAllViewModel {
    private checked: KnockoutComputed<boolean>;
    private indeterminate: KnockoutComputed<boolean>;
    private items: KnockoutObservableArray<ISelectable<SourceTableViewModel>>;
    private selectedItems: KnockoutComputed<ISelectable<SourceTableViewModel>[]>;

    constructor(items: KnockoutObservableArray<ISelectable<SourceTableViewModel>>) {
        this.items = items;
        this.selectedItems = ko.computed(() => this.items().filter(tbl => tbl.selected()));

        this.checked = ko.computed<boolean>(() => {
            return this.selectedItems().length > 0;
        });

        this.indeterminate = ko.computed<boolean>(() => {
            return this.selectedItems().length > 0 && this.selectedItems().length < this.items().length;
        });
    }

    /* tslint:disable:no-unused-variable */
    private onSelectAllClicked = (data, event) => {
        let currentCheckValue = this.checked();
        for (let item of this.items()) {
            item.selected(!currentCheckValue);
        }

        return true;
    };
    /* tslint:disable:no-unused-variable */
};

export class TableListViewModel {
    public winJSListView: WinJS.UI.ListView<ISelectable<SourceTableViewModel>>;
    public items: KnockoutObservableArray<ISelectable<SourceTableViewModel>>;
    public template = tableListItem;
    public onItemInvoked: (eventInfo: CustomEvent) => void;
    public previewTableObservable = ko.observable<SourceTableViewModel>();
    public winJSListViewBindingOptions: KnockoutBindings.IWinJSListViewValueAccessor<ISelectable<SourceTableViewModel>> = null;
    public getHighlightedCount: () => number;
    public clearHighlights: () => void;
    private selectAllVM: SelectAllViewModel;

    constructor(tableList: KnockoutObservableArray<ISelectable<SourceTableViewModel>>) {
        this.items = tableList;
        this.selectAllVM = new SelectAllViewModel(this.items);

        this.onItemInvoked = (eventInfo) => {
            this.winJSListView.selection.getItems().then(selected => {
                if (selected.length > 0 && selected[0]) {
                    this.previewTableObservable(selected[0].data.data);
                } else {
                    this.previewTableObservable(null);
                }
            });
        };

        this.getHighlightedCount = (): number => {
            if (this.winJSListView) {
                try {
                    return this.winJSListView.selection.count();
                } catch (e) {
                    return 0;
                }
            } else {
                return 0;
            }
        };

        this.clearHighlights = (): void => {
            if (this.winJSListView && this.winJSListView.selection) {
                this.winJSListView.selection.clear();
            }
        };

        this.winJSListViewBindingOptions = {
            data: this.items,
            options: {
                maxLeadingPages: Number.MAX_VALUE,
                maxTrailingPages: Number.MAX_VALUE,
                layout: new WinJS.UI.ListLayout(),
                selectionMode: WinJS.UI.SelectionMode.single,
                tapBehavior: WinJS.UI.TapBehavior.directSelect,
                oniteminvoked: this.onItemInvoked,
                oncontentanimating: (event: CustomEvent) => { event.preventDefault(); }
            },
            template: this.template
        };
    }
}
