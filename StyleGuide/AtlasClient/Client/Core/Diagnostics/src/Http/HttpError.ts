/// <reference path="../references.ts" />

module Microsoft.DataStudio.Diagnostics.Http {

    export class HttpError implements Error {

        name: string = "HttpError";
        message: string;

        status: number;
        statusText: string;
        stack : any;

        constructor(status: number, statusText: string) {
            /*
            Workaround because current version of TypeScript doesn't support subclassing of native objects (e.g. Error)
            This has been fixed recently, but not released:
                see: https://github.com/Microsoft/TypeScript/issues/1168
                version with fix: Microsoft/TypeScript#b754cc1
             */
            this.constructor.prototype.__proto__ = Error.prototype;
            this.message = "The server returned response with status " + status + " (" + statusText + ")";
            this.status = status;
            this.statusText = statusText;
        }

        toString(): string {
            return this.name + ': ' + this.message;
        }
    }
}
