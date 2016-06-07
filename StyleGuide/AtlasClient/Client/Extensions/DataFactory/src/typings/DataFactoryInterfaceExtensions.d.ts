// DataFactory module specific additions to existing interfaces.
// Loading of their implementations would be handled by the data factory module itself.

/* tslint:disable:interface-name */

interface String {
    format: (...args: any[]) => string;
}

interface JQueryStatic {
    mockjax: {
        (...args: any[]): number;
        clear(mockId?: number);
    }
}

interface JQueryXHRPromise<T> extends JQueryPromise<T> {
    then(doneCallback: (data: T, textStatus: string, jqXHR: JQueryXHR) => void, failCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): JQueryPromise<any>;
    done(doneCallback: (data: T, textStatus: string, jqXHR: JQueryXHR) => void);
    fail(failCallback?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: any) => void): JQueryPromise<any>;
}

interface JQueryXHRExtended extends JQueryXHR {
    requestUrl?: string;
}

interface JQueryAjaxSettingsExtended extends JQueryAjaxSettings {
    // data to be tagged on to the get data when the request is type post
    getData?: StringMap<any>;
}

// Additional datetimepcker's definition. These are allowed according to documentation and runtime verification,
// but missing from the .d.ts file.
interface JQuery {
    datetimepicker(method: string, methodParameter: string, value: any): void;
    datetimepicker(method: "getDate"): Date;
    setDatepickerToNow: (element: JQuery) => void;
}

declare module DataFactory {
    module WinJSExtensions {
        interface DiagramToolbar {
            commandList: WinJS.Binding.List<WinJS.UI.AppBarCommand>;
        }
    }

    interface IService {
        ajax<T>(request: JQueryAjaxSettingsExtended): JQueryXHRPromise<T>;
        ajaxQ<T>(request: JQueryAjaxSettingsExtended): Q.Promise<T>;
    }
}

declare module Q {
    export function all<T, U>(promises: [Q.IPromise<T>, Q.IPromise<U>]): Promise<[T, U]>;
    export function all<T, U, V>(promises: [Q.IPromise<T>, Q.IPromise<U>, Q.IPromise<V>]): Promise<[T, U, V]>;
}
