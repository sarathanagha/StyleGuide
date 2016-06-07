module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IHomeListTile {
        title: string;
        popover: string;
        max: number;
        emptyMessage: string;
    }

    export interface IPinnableListItem {
        label: string;
        friendlyName?: string;
        pinned: KnockoutObservable<boolean>;
        id: string;
    }

    export interface IHomePinnableTile extends IHomeListTile {
        items: KnockoutObservableArray<IPinnableListItem>;
        grayUnpinned: boolean;
        onPinToggled?: () => void;
        idPrefix: string;
    }

    export interface IHomeAttributeListItem {
        term: string;
    }

    export interface IHomeAttributeList extends IHomeListTile {
        group: string;
        attributes: KnockoutObservableArray<IHomeAttributeListItem>;
    }

    export interface IHomeStatsListItem {
        label: string;
        value: KnockoutObservable<number>;
        popup: string;
        annotate?: KnockoutObservable<string>;
    }

    export interface IHomeStatsList {
        items: KnockoutObservableArray<IHomeStatsListItem>;
    }

    export interface IComponent {
        name: string;
        params?: any;
    }
}