module Shell {
    export var extensionIndex = {};
    export var extensions = [];
}
module Shell.UI {
    export class Notification {
        // Not implemented
        public static addNotificationProcessor(notificationProcessor : string[]) {
            // Not implemented
        }
        
        public static removeNotificationProcessor(notificationProcessor : string[]) {
            // Not implemented
        }
    }
    
    export class Navigation {
        public static setConfirmNavigateAway(message: string) {
            // Not Implemented
        }
        
        public static navigate() {
            // Not implemented
        }
    }

    export class Spinner {
        public static show() {
            // Not implemeneted
        }
        
        public static hide() {
            // Not implemeneted
        }
    }
}

module Shell.Diagnostics {
    export var LogEntryLevel = {
        error: "error",
        warning: "warning",
        information: "information",
        verbose: "verbose"
    }
    export class Telemetry {
        public static performance(key: string, time: number, message: string, data: any) {
            //Not implemented
        }

        public static timerStart(key: String) {
            //Not implemented
        }

        public static customEvent(eventKey: string, customEventType: string, data: any) {
            //Not implemented
        }
        
        public static timerStopAndLog(key: string, message: string, data: any) {
            // Not Implemented
        }
        
        public static startup(secondsDuration: number, successfulDownloadCount: number, failedDownloadSummary: string, downloadMetricsSummary: string, data: any) {
            // Not Implemented
        }
        
        public static featureUsage(featureId: number, groupId: number, workspaceId: string, experimentId: string, moduleId: string, data: any) {
            // Not Implemeneted
        }
    }
    
    export class Log {
        public static writeEntry(eventKey: string, entry: string, severity:any, data:any) {
            // Not Implemented
        }
    }
}

