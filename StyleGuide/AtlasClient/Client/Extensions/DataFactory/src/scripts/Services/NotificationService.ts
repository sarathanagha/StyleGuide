export interface INotificationService {
    getActiveNotifications(): Promise<Microsoft.DataStudio.Model.IActiveNotificationItem[]>;

    getArchivedNotifications(): Promise<Microsoft.DataStudio.Model.IArchivedNotificationItem[]>;
}
