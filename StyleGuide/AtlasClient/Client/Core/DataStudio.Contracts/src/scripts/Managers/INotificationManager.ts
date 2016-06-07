module Microsoft.DataStudio.Managers {

    export interface INotificationManager {
        getActiveNotifications(): Promise<Model.IActiveNotificationItem[]>;

        getArchivedNotifications(): Promise<Model.IArchivedNotificationItem[]>;
    }
}
