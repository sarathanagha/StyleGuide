/// <reference path="Balloon.ts" />

module Microsoft.DataStudioUX.Managers {

    export class NotificationManager {

        private static _instance: NotificationManager = new NotificationManager();
        private static notificationContainer: JQuery;

        constructor() {
            if (NotificationManager._instance) {
                throw new Error("Error: Instantiation failed: USE [Microsoft.DataStudio.Application.Notifications.NotificationManager.getInstance()] instead of new.");
            } else {
                NotificationManager._instance = this;
            }

            // Initialize the notification container and append it to the page
            NotificationManager.notificationContainer = $('<div id="dsux-notification-container"></div>');

            NotificationManager.notificationContainer.click( function(eventHandler) {
                var clickedElement: JQuery = $(eventHandler.target);
                if (clickedElement.hasClass(Balloon.okBtnClass)) {
                    var balloonContainer: JQuery = clickedElement.closest('.' + Balloon.balloonContainerClass);
                    Balloon.hide(balloonContainer);
                } 
            });

            $("body").append(NotificationManager.notificationContainer);
        }

        public static getInstance(): NotificationManager {
            return NotificationManager._instance;
        }

        public notify(message: string): NotificationManager {
            (new Balloon(message))
                .appendTo(NotificationManager.notificationContainer)
                .show();
            return this;
        }

    }

}