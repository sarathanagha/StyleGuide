import Log = require("./Log");

let logger = Log.getLogger({ loggerName: "Util" });

/* tslint:disable:no-any */

export function objectToObservables(obj): KnockoutObservable<any> {
    if (ko.isObservable(obj)) {
        return obj;
    }
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = objectToObservables(obj[i])();
        }
        return ko.observableArray(obj);
    }
    if (obj instanceof Object) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                obj[prop] = objectToObservables(obj[prop]);
            }
        }
        return ko.observable(obj);
    }
    return ko.observable(obj);
};

export function koPropertyHasValue(property: KnockoutObservable<any>): boolean {
    if (property) {
        let value: any = property();
        return value instanceof Object ? !$.isEmptyObject(value) : propertyHasValue(value);
    }
    return false;
}

export function propertyHasValue(property: any): boolean {
    return !(property === undefined || property === null || property === "");
}

export function curry(method: (...args: any[]) => any, scope: any, ...args: any[]) {
    let previousArgs = args;
    return function (..._args: any[]) {
        return method.apply(scope, previousArgs.concat(_args));
    };
}

/* tslint:enable:no-any */

// Tries to copy the selected text or set the value to the clipboard directly when possible
export function copySelectedText(value: string = "") {
    let succeeded = false;

    try {
        /* tslint:disable:no-any */
        // If they have a clipboardData object, use it.
        if ((<any>window).clipboardData) {
            succeeded = (<any>window).clipboardData.setData("Text", value);
        } else {
            succeeded = document.execCommand("copy");
        }
        /* tslint:enable:no-any */
    } catch (err) {
        // perfectly normal for this to fail depending on OS and browser
        logger.logDebug("User declined to give keyboard access", err);
    }

    return succeeded;
}

export class DefaultDict<T> {
    public generator: () => T;
    private _map: StringMap<T> = {};

    public get(key: string, defaultValue?: T): T {
        let val = this._map[key];
        if (val === undefined) {
            val = defaultValue === undefined ? this.generator() : defaultValue;
            this._map[key] = val;
            return val;
        } else {
            return val;
        }
    }

    public set(key: string, value: T): void {
        this._map[key] = value;
    }

    public keys(): string[] {
        return Object.keys(this._map);
    }

    constructor(generator: () => T) {
        this.generator = generator;
    }

    public dispose(): void {
        for (let key in Object.keys(this._map)) {
            let val = this._map[key];
            if (val["dispose"]) {
                val["dispose"]();
            }
        }
    }
}

export function subscribeAndCall<T>(observable: KnockoutObservable<T>, lambda: (param: T) => void): KnockoutSubscription<T> {
    let subscription = observable.subscribe(lambda);
    lambda(observable());
    return subscription;
}

export function andFilter(first: string, second: string): string {
    first = first || null;
    second = second || null;
    if (!second) {
        return first;
    }
    if (!first) {
        return second;
    }
    return "({0} and {1})".format(first, second);
}

// only for ascii characters.
export function hashCode(str: string): string {
    let hashCode: number = 0, prime = 18446744073709551557;  // largest prime number less than 2^64.
    let strLength = str.length;
    for (let i = 0; i < strLength; i++) {
        let char = str.charCodeAt(i);
        hashCode = (hashCode * 128 + char) % prime;
    }
    return hashCode.toString();
}

export interface IAzureError {
    message: string;
    code: string;
};

export function getAzureError(reason: JQueryXHR): IAzureError {
    let result: IAzureError = {
        message: null,
        code: null
    };

    if (reason && reason.status && reason.status < 500 && reason.status >= 400 && (reason.responseText || reason.responseJSON)) {
        let json = reason.responseJSON;
        if (!json) {
            try {
                json = JSON.parse(reason.responseText);
            } catch (e) {
                json = reason.responseText;
                return {
                    code: "",
                    message: json
                };
            }
        }

        if (json.error) {
            result.message = json.error.message || "";
            result.code = json.error.code || "";
        } else {
            result.message = json.message || "";
            result.code = json.code || "";
        }
        return result;
    } else {
        return null;
    }
}

export function callIfKoHasValue<T>(koVal: KnockoutObservable<T>, toCall: (T) => Object | void): void {
    if (koPropertyHasValue(koVal)) {
        toCall(koVal());
    }
}
