/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class Environment {
        public displayName: KnockoutObservable<string> = ko.observable('');
        public id: KnockoutObservable<string> = ko.observable(''); 

        constructor() {
        }
    }
}