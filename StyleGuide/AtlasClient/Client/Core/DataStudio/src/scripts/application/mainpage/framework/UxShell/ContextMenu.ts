module Microsoft.DataStudio.UxShell.Menu {
    
    export var createContextMenu = (position: IContextMenuPosition, commandGroup: IContextMenuCommandGroup): void => {
        var contextMenuControl = Application.Knockout.Bindings.ContextMenuBindingHandler.contextMenuControl;
        var contextMenuPositionElement = Application.Knockout.Bindings.ContextMenuBindingHandler.contextMenuPositionElement;
        
        contextMenuControl.commands = commandGroup.commands;
        var commandGroupCleanup = () => {
            commandGroup.unbindViewModels();
            contextMenuControl.removeEventListener("afterhide", commandGroupCleanup);
        };
        contextMenuControl.addEventListener("afterhide", commandGroupCleanup);

        contextMenuPositionElement.style.top = position.clientY + "px";
        contextMenuPositionElement.style.left = position.clientX + "px";

        contextMenuControl.show(contextMenuPositionElement, "right");
    }
}