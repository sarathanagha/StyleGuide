import NotificationService = require("../Services/NotificationService");

class NotificationManagerImpl implements Microsoft.DataStudio.Managers.INotificationManager {
    private notificationService: NotificationService.INotificationService;

    constructor(notificationService: NotificationService.INotificationService) {
        this.notificationService = notificationService;
    }

    public getActiveNotifications(): Promise<Microsoft.DataStudio.Model.IActiveNotificationItem[]> {
        return this.notificationService.getActiveNotifications();
    }

    public getArchivedNotifications(): Promise<Microsoft.DataStudio.Model.IArchivedNotificationItem[]> {
        return this.notificationService.getArchivedNotifications();
    }
}

export function createNotificationManager(notificationService: NotificationService.INotificationService): Microsoft.DataStudio.Managers.INotificationManager {
    return new NotificationManagerImpl(notificationService);
}
