// Used by views\shell\app

module Microsoft.DataStudio.DataCatalog.Managers {
    export class AppManager {
        private static _showUpdgradeOverride: KnockoutObservable<boolean> = ko.observable(false);
        private static _latestVersion: KnockoutObservable<string> = ko.observable($tokyo.app.version);

        static showUpgradeIsAvailable: KnockoutComputed<boolean> = ko.pureComputed(() => {
            return AppManager._latestVersion() !== $tokyo.app.version && !AppManager._showUpdgradeOverride();
        });

        static setLatestVersion(latestVersion: string) {
            AppManager._latestVersion(latestVersion);
        }

        static hideUpgradeNotice() {
            AppManager._showUpdgradeOverride(true);
            setTimeout(() => {
                AppManager._showUpdgradeOverride(false);
            }, 1000 * 60 * 60);
        }
    }
}