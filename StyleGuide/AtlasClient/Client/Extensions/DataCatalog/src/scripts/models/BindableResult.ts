module Microsoft.DataStudio.DataCatalog.Models {
    export class BindableResult implements Interfaces.IBindableResult {
        query: Interfaces.IQueryResult;
        id: string;
        totalResults: number;
        startIndex: number;
        itemsPerPage: number;
        facets: any[];
        results: Interfaces.IBindableDataEntity[];
        batchedResults = ko.observableArray<Interfaces.IBindableDataEntity>();
        isBatchLoading = ko.observable<boolean>(false);

        constructor(searchResult: Interfaces.ISearchResult) {
            this.id = searchResult.id;
            this.totalResults = searchResult.totalResults;
            this.startIndex = searchResult.startIndex;
            this.itemsPerPage = searchResult.itemsPerPage;

            this.results = searchResult.results.map(searchEntity => new BindableDataEntity(searchEntity));

            this.isBatchLoading(true);
            var chunks = Core.Utilities.arrayChunk(this.results, 10);
            var promise = $.when();
            var i = 0;
            chunks.forEach(c => {
                // Bind the first batch synchronously
                promise = this._chain(promise, () => {
                    this.batchedResults.push.apply(this.batchedResults, c);
                }, i > 0);
                i++;
            });

            promise.done(() => {
                this.isBatchLoading(false);
            });

            this.query = searchResult.query;
        }

        private _chain(parent: JQueryPromise<any>, fn: () => void, async = true): JQueryPromise<any> {
            var deferred = $.Deferred();

            parent.always(() => {
                var timeout = async ? setTimeout : (callback: () => void, num: number) => { callback(); };

                timeout(() => {
                    fn();
                    deferred.resolve();
                }, 0);
            });

            return deferred.promise();
        }
    }
}