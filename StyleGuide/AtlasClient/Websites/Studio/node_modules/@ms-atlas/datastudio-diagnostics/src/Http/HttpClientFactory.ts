/// <reference path="../references.ts" />
/// <reference path="HttpClient.ts" />
/// <reference path="RetryHttpClient.ts" />
/// <reference path="Impl/FetchHttpClient.ts" />
/// <reference path="Impl/XHR2HttpClient.ts" />

module Microsoft.DataStudio.Diagnostics.Http {

    export class HttpClientFactory {

        static createClient(): HttpClient {
            if (window.fetch !== undefined) {
                // Use the modern HTTP request API if available in the browser
                return new Impl.FetchHttpClient();
            } else {
                return new Impl.XHR2HttpClient();
            }
        }

        static createRetryClient(): HttpClient {
            return new RetryHttpClient(HttpClientFactory.createClient());
        }
    }
}
