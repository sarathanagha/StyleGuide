/// <amd-dependency path="css!./notificationBalloon.css" />

require(["css!datastudio.controls/Managers/Notifications/notificationBalloon.css"]);

module Microsoft.DataStudioUX.Managers {

    export class Balloon {

        private balloonContainer: JQuery;
        private messageContainer: JQuery;
        private balloonActionsContainer: JQuery;
        private okBtn: JQuery;

        public static balloonContainerClass: string = "dsux-balloon-container";
        public static balloonMessageClass: string = "dsux-balloon-message";
        public static balloonActionsClass: string = "dsux-balloon-actions";
        public static okBtnClass: string = "dsux-balloon-action-btn";

        constructor(message: string) {
            var self = this;

            self.balloonContainer = $('<div class="' + Balloon.balloonContainerClass + '"></div>');
            self.messageContainer = $('<div class="' + Balloon.balloonMessageClass + '">' + message + '</div>');
            self.balloonActionsContainer = $('<div class="' + Balloon.balloonActionsClass + '"></div>');
            self.okBtn = $('<input type="button" value="Ok" class="' + Balloon.okBtnClass + '">');

            self.balloonActionsContainer.append(self.okBtn);
            self.balloonContainer
                .append(self.messageContainer)
                .append(self.balloonActionsContainer);
        }

        public appendTo(parent: JQuery): Balloon {
            this.balloonContainer.appendTo(parent);

            return this;
        }

        public show(): Balloon {
            var self = this;

            self.balloonContainer.slideDown(150, function() {
                self.balloonContainer.css( {bottom: "-20px" } ).animate( {opacity: 1, bottom: "0px"}, 100);
                self.messageContainer.css( {opacity: 0, top: "-20px", display: "block"} ).animate( {opacity: 1, top: "0px"}, 200);
                self.okBtn.css( {opacity: 0, right: "-20px", display: "block"} ) .animate( {opacity: 1, right: "0px"}, 200);
            });

            return this;
        }

        public static hide(balloonContainer): void {
            balloonContainer
                .animate( {opacity: 0, bottom: "-20px"}, 100, function() { 
                    $(this).slideUp(150, function() {
                        $(this).remove();
                    });
                });
        }
    }
}