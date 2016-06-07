module Microsoft.DataStudio.Modules {

    export interface DataStudioModule {

        name: string;

        moduleContext: UxShell.ModuleContext;

        initialize(moduleContext: UxShell.ModuleContext): void;

        getNotificationManager(): Managers.INotificationManager;
    }
}