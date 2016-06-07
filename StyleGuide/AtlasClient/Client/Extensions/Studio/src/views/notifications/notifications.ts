/// <reference path="../references.d.ts" />

/// <amd-dependency path="text!./notifications.html" />
/// <amd-dependency path="css!./notifications.css" />

import ko = require("knockout");

export var template: string = require("text!./notifications.html");
import Model = Microsoft.DataStudio.Model;
import Modules = Microsoft.DataStudio.Modules;
import Managers = Microsoft.DataStudio.Managers;

export class viewModel {

    public notificationCenterTitle: KnockoutObservable<string>;
    public archivedNotificationsTitle: KnockoutObservable<string>;
    public activeNotifications: KnockoutObservableArray<Model.IActiveNotificationItem>;
    public archivedNotifications: KnockoutObservableArray<Model.IArchivedNotificationItem>;

    constructor() {
        this.notificationCenterTitle = ko.observable("Notification Center");
        this.archivedNotificationsTitle = ko.observable("Archive");

        this.activeNotifications = ko.observableArray<Model.IActiveNotificationItem>();
        this.archivedNotifications = ko.observableArray<Model.IArchivedNotificationItem>();

        var registeredModules: Modules.DataStudioModule[] = ModuleCatalog.getModules();

        registeredModules.forEach((module: Modules.DataStudioModule): void => {

            var notificationManager: Managers.INotificationManager = module.getNotificationManager();

            if (notificationManager == null)
                return;

            //TODO: Refine. This is just temp code to aggregate notifications for now

            notificationManager.getActiveNotifications().then(activeNotifications => {
                ko.utils.arrayPushAll(this.activeNotifications, activeNotifications);
            });

            notificationManager.getArchivedNotifications().then(archivedNotifications => {
                ko.utils.arrayPushAll(this.archivedNotifications, archivedNotifications);
            });
        });
    }
}
