/// <reference path="../references.ts" />
/// <reference path="HttpClient.ts" />
/// <reference path="HttpError.ts" />

module Microsoft.DataStudio.Diagnostics.Http {

    export class RetryHttpClient implements HttpClient {

        private httpClient: HttpClient;

        constructor(httpClient: HttpClient) {
            this.httpClient = httpClient;
        }

        postAsync(url: string, data: string, contentType?: string, bearerToken?: string): Promise<void> {
            var attempts = 0;
            var httpClient = this.httpClient;

            function sendRequest(): Promise<void> {
                return httpClient.postAsync(url, data, contentType, bearerToken).catch<void>(responseErrorHandler);
            }

            function responseErrorHandler(e: Error): Promise<void> {
                // Failing immediately if there's no sense to do any further attempts
                if (!RetryHttpClient.continueAttempts(e)) {
                    throw e;
                }

                // Get delay interval for the next attempt
                var retryDelay = RetryHttpClient.getRetryDelay(++attempts);

                if (retryDelay == -1) {
                    throw new Error("Unable to send the request after " + attempts + " attempts.");
                }

                // Make another attempt after the given delay
                return PromiseUtils.delay(retryDelay).then<void>(sendRequest);
            }

            return sendRequest();
        }

        private static continueAttempts(e: Error): boolean {
            if (e instanceof HttpError) {

                // Redirect
                if (e.status >= 300 && e.status < 400) {

                    switch (e.status) {
                        case 301:
                            /* Moved Permanently */
                            return false;

                        case 308:
                            /* Permanent Redirect */
                            return false;
                    }

                    // Redirect HTTP statuses maybe caused by an infrastructure in the middle (like public Wi-Fi),
                    // in this case further attempts make sense
                    return true;
                }

                // Client errors
                if (e.status >= 400 && e.status < 500) {

                    switch (e.status) {
                        case 404:
                            /* Not Found */
                            return true;

                        case 408:
                            /* Request Timeout */
                            return true;

                        case 429:
                            /* Too Many Requests */
                            return true;
                    }

                    // Client error HTTP statuses are non-recoverable
                    return false;
                }

                // Server errors
                if (e.status >= 500 && e.status < 600) {

                    switch (e.status) {

                        case 501:
                            /* Not Implemented */
                            return false;

                        case 500:
                            /* HTTP Version Not Supported */
                            return false;
                    }

                    // Most likely caused by a temporary server outage, further attempts make sense
                    return true;
                }

                // Considering other HTTP statuses as non-recoverable
                return false;

            } else {
                // A network connectivity error (likely temporary), further attempts make sense
                return true;
            }
        }

        private static getRetryDelay(attempts: number): number {
            var seconds = 2;

            if (attempts >= 1) {
                // Exponentially increase delay interval from 2 seconds up to 128 seconds
                seconds = attempts < 7 ? 2 << attempts - 1 : 128;
            }

            // Return calculated interval in milliseconds
            return seconds * 1000;
        }
    }
}
