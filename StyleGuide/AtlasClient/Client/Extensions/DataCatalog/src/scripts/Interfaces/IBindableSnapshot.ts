module Microsoft.DataStudio.DataCatalog.Interfaces {
    export interface IBindableSnapshot {
	    description: KnockoutObservable<string>;
	    expertsOnSome: KnockoutObservableArray<IAttributeInfo>;
	    expertsOnAll: KnockoutObservableArray<IAttributeInfo>;
	    tagsOnSome: KnockoutObservableArray<IAttributeInfo>;
	    tagsOnAll: KnockoutObservableArray<IAttributeInfo>;

	    requestAccessMode: KnockoutObservable<string>; // "Mixed"/null
	    requestAccess: KnockoutObservable<string>;
	    locations: KnockoutObservableArray<string>;
	}
}