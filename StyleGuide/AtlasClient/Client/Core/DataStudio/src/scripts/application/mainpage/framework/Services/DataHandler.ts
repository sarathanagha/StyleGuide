/// <reference path="../References.ts" />

module Microsoft.DataStudio.Services {
    export class DataStore {
        data: any = {};

        public Get(token:string)
        {
            return this.data[token];
        }

        public Set(token:string, payload: any)
        {
            this.data[token] = payload;
        }

        public Clear(token: string)
        {
            this.data[token] = null;
        }
    }

    export class DataHandlerImpl implements Microsoft.DataStudio.Services.IDataHandler
    {
        private static _instance: DataHandlerImpl = new DataHandlerImpl();
        constructor()
        {

            if (DataHandlerImpl._instance)
            {
                throw new Error("Error: Instantiation failed: USE \
                                [Microsoft.DataStudio.Services.DataHandler.instance] instead of new.");
            }
            else
            {
                DataHandlerImpl._instance = this;
            }
        }

        public static GetInstance(): Microsoft.DataStudio.Services.IDataHandler
        {
            return DataHandlerImpl._instance;
        }

        public GetData(query: any): Q.Promise<any>
        {
            var cachedData = null;

            if (query.useCache)
            {
                cachedData = this.dataStore.Get(query.url);
            }

            if (!cachedData)
            {
                cachedData = Q(jQuery.ajax(query));
                this.dataStore.Set(query.url, cachedData);
            }

            return cachedData;
        }

        public VoidData(token: string): void
        {
            this.dataStore.Clear(token);
        }

        dataStore: DataStore = new DataStore();
    }

    DataHandler = DataHandlerImpl;
}
