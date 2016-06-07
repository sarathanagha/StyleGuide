/// <reference path="../references.ts" />

module Microsoft.DataStudio.Model {

    export interface ICommand {
        name: string;
        action: ()=>void;
    }
}
