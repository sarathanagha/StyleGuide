import Util = require("../Util/Util");

// paverma Future of this piece of code is undecided. For now, the structure matches Ibiza, but the functionality provided is next
// to nothing. We might shift away from this structure, but anyhow will have to expose observablified objects to the consumers.
// Skipping type checking.
// TODO paverma The current implementation creates the issue of simultaneous use of Q and JQuery promises, which is bad. Modify all to Q. But will depend on the future of this.

export interface IDataCacheParams<X, Y> {
    /* tslint:disable:no-any Because the cache could be either of datafactory service or arm service, with different invocation interfaces */
    serviceObject: any;
    /* tslint:enable:no-any */
    serviceMethod?: (baseUrlParams: X, requestParams: Y) => Q.Promise<Object>;
    requestParams?: JQueryAjaxSettings;
    processServerResponse?: (data: Object) => Object;
}

export interface IDataCacheViewFetchParams {
}

// TODO paverma Use graph control's lifetime manager to control the lifetime of this and associated objects.
export class DataCache<T, X, Y> {
    public view: DataCacheView<T, X, Y>;
    private _params: IDataCacheParams<X, Y> = null;

    constructor(params: IDataCacheParams<X, Y>) {
        this._params = params;
    }

    public fetch(...args: Object[]): Q.Promise<Object> {
        let deferred = Q.defer<Object>();
        let promise = null;
        if (this._params.serviceMethod) {
            promise = this._params.serviceMethod.apply(this._params.serviceObject, args);
        } else {
            let requestParams: JQueryAjaxSettings = JSON.parse(JSON.stringify(this._params.requestParams));
            requestParams.data = args[0];
            promise = this._params.serviceObject.ajax(requestParams);
        }

        promise.then((responseData: Object) => {
                let data = responseData;
                if (this._params.processServerResponse) {
                    data = this._params.processServerResponse(responseData);
                }
                deferred.resolve(data);
            }, (reason: JQueryXHR) => {
                deferred.reject(reason);
            });
        return deferred.promise;
    }

    public createView(cache: boolean = false): DataCacheView<T, X, Y> {
        return new DataCacheView<T, X, Y>(this, cache);
    }
}

// TODO paverma Temporary caching logic. Will need to revisit once loading factories does not require a page reload.
export class DataCacheView<T, X, Y> {
    private static timeDelta = 1 * 60 * 1000;

    public items: KnockoutObservable<T> = ko.observable<T>();

    private _dataCache: DataCache<T, X, Y> = null;

    // Cache queries.
    private _cache: boolean = false;
    private _deferred: Q.Deferred<T> = null;
    private _time: Date = null;

    constructor(dataCache: DataCache<T, X, Y>, cache: boolean = false) {
        this._dataCache = dataCache;
        this._cache = cache;
    }

    public fetch(fetchParams: IDataCacheViewFetchParams): Q.Promise<T>
    public fetch(urlParams: X): Q.Promise<T>
    public fetch(urlParams: X, queryParams: Y): Q.Promise<T>
    public fetch(...args: Object[]): Q.Promise<T> {
        if (this._cache && this._deferred) {
            if (new Date().getTime() - this._time.getTime() <= DataCacheView.timeDelta) {
                return this._deferred.promise;
            }
        }
        let deferred = Q.defer<T>();
        this._deferred = deferred;
        this._time = new Date();
        let fetchPromise = this._dataCache.fetch.apply(this._dataCache, args);
        fetchPromise.then((responseData: T) => {
            this.items(Util.objectToObservables(responseData)());
            deferred.resolve(this.items());
        }, (reason: Object) => {
            // TODO paverma Error handling is not accurate.
            deferred.reject(reason);
        });

        return deferred.promise;
    }
}
