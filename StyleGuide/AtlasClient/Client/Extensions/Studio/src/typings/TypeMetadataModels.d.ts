/* tslint:disable:interface-name */

declare module StudioExtension.DataModels {
    var StudioModuleType: string;
    interface StudioModule {
        ModuleId: KnockoutObservable<string>;
        ModuleName: KnockoutObservable<string>;
    }
    
    var PrimitivesType: string;
    interface IPrimitiveItem {
        PrimitiveId: KnockoutObservable<string>;
        PrimitiveName: KnockoutObservable<string>;
        CategoryName: KnockoutObservable<string>;
    }
}