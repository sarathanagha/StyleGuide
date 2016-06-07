//TODO pacodel move this to Core
// paverma Future of this piece of code is undecided. For now, the structure matches Ibiza, but the functionality provided is next
// to nothing. We might shift away from this structure, but anyhow will have to expose observablified objects to the consumers.
// Skipping type checking.
// TODO paverma The current implementation creates the issue of simultaneous use of Q and JQuery promises, which is bad. Modify all to Q. But will depend on the future of this.

export interface IDataCacheParams {
    serviceObject: CAStudio.IService;
    requestParams: JQueryAjaxSettings;
    processServerResponse?: (data: Object) => Object;
}

export interface IDataCacheViewFetchParams {
}

// TODO paverma Use graph control's lifetime manager to control the lifetime of this and associated objects.
export class DataCache<T> {
    private _params: IDataCacheParams = null;
    public items: KnockoutObservable<T> = ko.observable<T>();

    // Cache queries.
    private _deferred: Q.Deferred<T> = null;
    private _time: Date = null;
    private static timeDelta = 1 * 60 * 1000;
    
    constructor(params: IDataCacheParams) {
        this._params = params;
    }

    public fetch(fetchParams: IDataCacheViewFetchParams,  cache: boolean = false): Q.Promise<T> {
        if (cache && this._deferred) {
            if (new Date().getTime() - this._time.getTime() <= DataCache.timeDelta) {
                return this._deferred.promise;
            }
        }
        
        let deferred = Q.defer<Object>();
        this._time = new Date();
        
        let requestParams: JQueryAjaxSettings = null; 
        
        try{
            requestParams = JSON.parse(JSON.stringify(this._params.requestParams));
        }
        catch(e){
            deferred.reject(new Error("Couldn't parse requestParams"));
        }
        
        requestParams.data = fetchParams;
        this._params.serviceObject.ajax<Object>(requestParams)
            .then((responseData: Object) => {
                let data = responseData;
                if (this._params.processServerResponse) {
                    data = this._params.processServerResponse(responseData);
                }
                deferred.resolve(data);
            }, (reason: JQueryXHR) => {
                deferred.reject(reason);
            });
        
        let deferredObject = Q.defer<T>();
        this._deferred = deferredObject; 
        let fetchPromise = deferred.promise;
        fetchPromise.then((responseData: T) => {
            this.items(objectToObservables(responseData)());
            deferredObject.resolve(this.items());
        }, (reason: Object) => {
            // TODO paverma Error handling is not accurate.
            deferredObject.reject(reason);
        });

        return deferredObject.promise;
    }
    
    public getUrl(): string {
        return this._params.requestParams.url;
    }
    
    
    public setUrl(url: string){
        this._params.requestParams.url = url;
    }
}

export function objectToObservables(obj): KnockoutObservable<any> {
    if (ko.isObservable(obj)) {
        return obj;
    }
    if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
            obj[i] = objectToObservables(obj[i])();
        }
        return ko.observableArray(obj);
    }
    if (obj instanceof Object) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                obj[prop] = objectToObservables(obj[prop]);
            }
        }
        return ko.observable(obj);
    }
    return ko.observable(obj);
};