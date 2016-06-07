export class PanelMessage {
    private static _panelSelector = ".rightSidePanel";
    private static _messageSelector = ".adf-panelMessage";
    private static _switchSelector = ".rightSidePanel .switch";
    private static _switchClass = "adf-panelMessageSwitch";
    private static _template = "<div class=\"adf-panelMessage\"></div>";

    public static showMessage(message: string) {
        // create all the dom elements
        if ($(PanelMessage._messageSelector).length === 0) {
            $(PanelMessage._panelSelector).prepend(PanelMessage._template);
        }

        // change the message
        $(PanelMessage._messageSelector).html(message);

        // add our special class to the switch
        $(PanelMessage._switchSelector).addClass(this._switchClass);
    }

    public static removeMessage() {
        // remove special class switch
        $(PanelMessage._switchSelector).removeClass(this._switchClass);

        // remove message
        $(PanelMessage._messageSelector).remove();
    }
}

