// Studio module specific additions to existing interfaces.
// Loading of their implementations would be handled by the CA studio module itself.

/* tslint:disable:interface-name */

declare module CAStudio {
    interface IService {
        ajax<T>(request: JQueryAjaxSettingsExtended): JQueryXHRPromise<T>;
        ajaxQ<T>(request: JQueryAjaxSettingsExtended): Q.Promise<T>;
    }
}
