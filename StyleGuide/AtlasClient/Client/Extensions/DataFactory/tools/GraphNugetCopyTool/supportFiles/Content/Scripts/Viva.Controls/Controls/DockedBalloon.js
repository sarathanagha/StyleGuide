define(["require", "exports"], function(require, exports) {
    var Main;
    (function (Main) {
        // TODO paverma The DockedBalloon.js is missing from the grpah control nuget. However, we do not rely on any of its functionality. Hence
        // using this dummy file to avoid issues.
        Main.classes = {
            widget: "azc-dockedballoon"
        };

        function DismissAllBalloons() {
        }
        Main.DismissAllBalloons = DismissAllBalloons;

        var DockedBalloon = (function () {
            function DockedBalloon() {
            }
            return DockedBalloon;
        })();
        Main.DockedBalloon = DockedBalloon;
    })(Main || (Main = {}));
    return Main;
});
