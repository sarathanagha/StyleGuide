/// <reference path="../references.ts" />

module Microsoft.DataStudio.Diagnostics.Http {

    export interface HttpClient {

        postAsync(url: string, data: string, contentType?: string, bearerToken?: string): Promise<void>
    }
}
