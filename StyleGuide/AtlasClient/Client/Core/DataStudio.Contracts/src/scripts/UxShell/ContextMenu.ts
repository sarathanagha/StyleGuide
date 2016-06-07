declare module Microsoft.DataStudio.UxShell.Menu {

    export interface IContextMenuCommandGroup {
        commandGroupName: string;
        commands: WinJS.UI.MenuCommand[];
        bindViewModels(...args: any[]);
        unbindViewModels();
    }

    export interface IContextMenuPosition {
        clientX: number;
        clientY: number;
    }

    export var createContextMenu: (position: IContextMenuPosition, commandGroup: IContextMenuCommandGroup) => void;
}
