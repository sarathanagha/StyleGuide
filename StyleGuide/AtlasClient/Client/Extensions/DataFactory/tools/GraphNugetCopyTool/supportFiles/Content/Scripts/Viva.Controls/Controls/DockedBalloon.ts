
export = Main;

module Main {
    // TODO paverma The DockedBalloon.js is missing from the grpah control nuget. However, we do not rely on any of its functionality. Hence
    // using this dummy file to avoid issues.

    export const classes = {
        widget: "azc-dockedballoon"
    }

    export function DismissAllBalloons(): void {
    }

    export class DockedBalloon {
    }
}
