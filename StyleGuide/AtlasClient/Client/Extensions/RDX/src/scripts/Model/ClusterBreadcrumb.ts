/// <reference path="../../References.d.ts" />

module Microsoft.DataStudio.Crystal.Models {
    export class ClusterBreadcrumb {
        public clusterName: KnockoutObservable<string> = ko.observable('');
        public predicate: string;

        constructor() {
        }
    }
}