/// <reference path="../../references.ts" />
/// <reference path="../HttpClient.ts" />
/// <reference path="../HttpError.ts" />

module Microsoft.DataStudio.Diagnostics.Http.Impl {

    export class FetchHttpClient implements HttpClient {

        postAsync(url: string, data: string, contentType?: string, bearerToken?: string): Promise<void> {
            Assert.argumentIsString(url, "url");
            Assert.argumentIsString(data, "data");

            // Request headers and options
            var requestHeaders = new Headers();

            if (contentType) {
                requestHeaders.set("Content-Type", contentType);
            }

            if (bearerToken) {
                requestHeaders.set("Authorization", "Bearer " + bearerToken);
            }

            var requestOptions: RequestInit = {
                method: "post",
                mode: <any>"cors",
                headers: requestHeaders,
                body: data
            };

            // Send the request
            return window.fetch(url, requestOptions).then<void>(response => {
                if (!response.ok) {
                    throw new HttpError(response.status, response.statusText);
                }
            });
        }
    }
}
