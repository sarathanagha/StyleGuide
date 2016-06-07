module Microsoft.DataStudio.Model {

    export interface INotificationItem {
        id: string;
        icon: string;
        title: string;
        time: Date;
    }

    export interface IActiveNotificationItem extends INotificationItem {
        url: IUrl;
    }

    export interface IArchivedNotificationItem extends INotificationItem {
    }
}
