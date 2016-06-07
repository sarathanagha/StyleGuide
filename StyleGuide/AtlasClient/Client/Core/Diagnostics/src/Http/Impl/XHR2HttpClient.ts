/// <reference path="../../references.ts" />
/// <reference path="../HttpClient.ts" />
/// <reference path="../HttpError.ts" />

module Microsoft.DataStudio.Diagnostics.Http.Impl {

    /*
        This implementation could be replaced by a polyfill for the modern Fetch API specification:
        https://github.com/github/fetch
     */

    export class XHR2HttpClient implements HttpClient {

        postAsync(url: string, data: string, contentType?: string, bearerToken?: string): Promise<void> {
            Assert.argumentIsString(url, "url");
            Assert.argumentIsString(data, "data");

            return new Promise<void>((resolve, reject) => {

                // Initialize request
                var request = new XMLHttpRequest();
                request.open("post", url, true);

                if (contentType) {
                    request.setRequestHeader("Content-Type", contentType);
                }

                if (bearerToken) {
                    request.setRequestHeader("Authorization", "Bearer " + bearerToken);
                }

                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve();
                    } else {
                        reject(new HttpError(request.status, request.statusText));
                    }
                };

                request.onerror = () => {
                    reject(new Error("Unable to send the request due to a network error."));
                };

                // Send the request
                request.send(data);
            });
        }
    }
}
