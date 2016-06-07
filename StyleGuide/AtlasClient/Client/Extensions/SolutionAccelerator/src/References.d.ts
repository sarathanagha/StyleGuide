/// <reference path="../../../core/DataStudio.Contracts/src/datastudio.contracts.d.ts" />
/// <reference path="../../../core/Diagnostics/lib/datastudio.diagnostics.d.ts" />
/// <reference path="../../../core/DataStudioUX/src/lib/datastudio.ux.d.ts" />

interface ModalOptions {
    active?: any; // boolean or number
    animate?: any; // boolean, number, string or object
    collapsible?: boolean;
    escapeClose?: boolean;
    overlay?: string;
    header?: string;
    heightStyle?: string;
    icons?: any;
}
interface JQuery {
    modal(options?: ModalOptions): JQuery;
    modal(command: string): JQuery;
}