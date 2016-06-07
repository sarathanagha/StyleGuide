/// <reference path="../../references.ts" />

module Microsoft.DataStudio.UxShell.Controls {

    export interface IActionItem extends Microsoft.DataStudio.Model.ICommand {
        icon?: string;
        title?: KnockoutObservable<string>;
        description?: KnockoutObservable<string>;
    }

    export interface IActionItemListParams {
        icon?: string;
        title: KnockoutObservable<string>;
        items: KnockoutObservableArray<IActionItem>;
    }
}
