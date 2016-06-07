/// <amd-dependency path="css!./Toaster.css" />

require(["css!datastudio.controls/Managers/ToasterManager/Toaster.css"]);

module Microsoft.DataStudioUX.Managers {

    export class ToasterManager {

        // Static variables
        private static _instance: ToasterManager = new ToasterManager();
        private static toasterId: string = 'dsux-toaster-container';
        private static animateSpeed: number = 300;

        // Instance variables
        private messageQueue: string[] = [];
        private displayingMessages: boolean = false;
        private currentTimeout: any = null;

        constructor() {
            if (ToasterManager._instance) {
                throw new Error("Error: Instantiation failed: USE [Microsoft.DataStudioUX.Managers.ToasterManager.getInstance()] instead of new.");
            } else {
                ToasterManager._instance = this;
            }
        }

        // Method: getInstance
        // Return the instance of the toaster manager
        public static getInstance = (): ToasterManager => ToasterManager._instance;

        // Method: notify
        // Add a message to the message queue and begin displaying if needed
        public notify = (message: string): ToasterManager => {
            this.messageQueue.push(message);
            if (!this.displayingMessages) {
                this.displayingMessages = true;
                this.displayMessage(this.messageQueue.shift());
            }
            return this;
        }

        // Method: displayMessage
        // Create the toaster DOM element, attach it to the page, and animate it into view
        // Continue to call recursively until the messageQueue is empty
        private displayMessage = (message: string): void => {
            var self = this;
            // Only display a message if no toaster is currently active
            if (!!!document.getElementById(ToasterManager.toasterId)) {
                var toaster: JQuery = $('<div id="' + ToasterManager.toasterId + '">' + message + '</div>');
                var closeBnt: JQuery = $('<span class="btn-close-toaster">&times;</span>');
                closeBnt.click(() => self.removeToaster(toaster));
                toaster.append(closeBnt).appendTo('body').animate({ right: '0px', opacity: 1 }, ToasterManager.animateSpeed);
                self.currentTimeout = setTimeout(() => self.removeToaster(toaster), message.length * 100 + 1000); 
            }
        }

        // Method: removeToaster
        // Contains the logic to stop any existing timeouts and remove the provided toaster
        private removeToaster = (toaster: JQuery): void => {
            var self = this;
            self.currentTimeout = clearTimeout(self.currentTimeout);
            toaster.animate({ right: '-320px', opacity: 0 }, ToasterManager.animateSpeed, () => {
                toaster.remove();
                // If there are more messages, display the next message
                self.displayingMessages = self.messageQueue.length > 0;
                if (self.displayingMessages) self.displayMessage(self.messageQueue.shift());
            });
        }
    }

}