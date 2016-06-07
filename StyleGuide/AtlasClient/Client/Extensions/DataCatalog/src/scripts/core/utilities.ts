/// <reference path="../typings/utilities.d.ts" />
/// <reference path="constants.ts" />
/// <reference path="../models/DataSourceType.ts" />

module Microsoft.DataStudio.DataCatalog.Core {

    export class Utilities {

        public static stringFormat = function (formatStr: string, ...args: any[]) {
            return formatStr.replace(/{(\d+)}/g, (match, number) => {
                return typeof args[number] !== "undefined"
                    ? args[number]
                    : match;
            });
        };

        public static stringCapitalize = (formatStr: string) => {
            return formatStr.replace(/(^\w|\s\w)/g, a => a.toUpperCase());
        }

        public static arrayChunk = (arr: any[], chunkSize: number) => {
            if (chunkSize <= 0) {
                throw new Error("chunk size must be greater than zero");
            }
            var chunks = [];
            var start = 0;
            var end = chunkSize;
            while (start < arr.length) {
                chunks.push(arr.slice(start, end));
                start = end;
                end = (end + chunkSize);
            }
            return chunks;
        };

        public static arrayFirst = (arr: any[]): any => arr.length ? arr[0] : null;

        public static arrayLast = (arr: any[]): any => arr.length ? arr[arr.length - 1] : null;

        public static arrayIntersect = (arr: any[], otherArray: any[], comparator?: (a: any, b: any) => boolean): any[] => {
            return arr.filter(a => (otherArray || []).some(b => comparator ? comparator(a, b) : a === b));
        };

        public static arrayExcept = (arr: any[], otherArray: any[], comparator?: (a: any, b: any) => boolean): any[] => {
            return arr.filter(a => !(otherArray || []).some(b => comparator ? comparator(a, b) : a === b));
        };

        public static arrayRemove = (arr: any[], predicate: (a: any) => boolean): any => {
            // Find index
            var i = 0;
            for (; i < arr.length; i++) {
                if (predicate(arr[i])) {
                    break;
                }
            }
            // Remove in-place
            return Utilities.arrayFirst(arr.splice(i, 1));
        };

        public static arrayDistinct = (arr: any[], hashFn?: (a) => string): any[] => {
            var _hash = {};
            var _distinct = [];
            $.each(arr, (i, val) => {
                if (val) {
                    var key = hashFn ? hashFn(val) : val.toString();
                    if (!_hash[key]) {
                        _hash[key] = true;
                        _distinct.push(val);
                    }
                }
            });
            return _distinct;
        };

        public static regexEscape = (str) => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

        private static _span = $("<span>");

        static getCookieValue(name: string): string {
            var ca = (document.cookie || "").split(";");
            var cookieValue = null;
            $.each(ca, (i, cookieStr) => {
                cookieStr = $.trim(cookieStr);
                if (cookieStr.indexOf(name + "=") === 0) {
                    // We found our cookie!
                    cookieValue = cookieStr.split("=")[1];
                    return false;
                }
            });
            return cookieValue;
        }

        // Note: not setting an expiration date will make the cookie delete on session end
        static setCookie(name: string, value: string, expiresInDays?: number) {
            var now = new Date();
            var expires = "";
            if (expiresInDays !== void 0) {
                now.setTime(now.getTime() + (expiresInDays * 24 * 60 * 60 * 1000));
                expires = "expires=" + now.toUTCString();
            }
            document.cookie = name + "=" + value + "; " + expires;
        }

        // Converts a dateTime string to an ISO string
        // i.e. "4/1/2015 1:23:32 AM" => "2015-04-01T01:23:32.000Z".
        // This assumes that the dateTime string is in UTC.
        static convertDateTimeStringToISOString(dateTime: string): string {
            if (!dateTime) {
                return "";
            }

            // If the dateTime is already ISO 8601 UTC nothing to do
            if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,7}Z/.test(dateTime)) {
                return dateTime;
            }

            var d = new Date(dateTime);
            // IE 9 can not parse a dateTime in ISO.
            if (!d || isNaN(d.getFullYear())) {
                return dateTime;
            }
            var utcDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()));
            return utcDate.toISOString();
        }

        static plainText(value: string): string {
            var safe = Utilities.removeScriptTags(value);
            var stripped = Utilities.removeHtmlTags(safe);
            var escaped = Utilities.escapeHtml(stripped);
            return escaped;
        }

        static removeHtmlTags(value: string): string {
            return Utilities._span.html(value).text();
        }

        static escapeHtml(value: string): string {
            return Utilities._span.text(value).html();
        }

        static removeScriptTags(value: string): string {
            var html = $("<div>" + value + "</div>");
            html.find("script").remove();
            return html.html();
        }

        static extractHighlightedWords(value: any) {
            var targetString = "";
            if (typeof value === "object") {
                targetString = JSON.stringify(value || {});
            } else {
                targetString = (value || "").toString();
            }
            var highlightedWords = [];
            var regex = new RegExp(Constants.Highlighting.OPEN_TAG + "([^<]*)" + Constants.Highlighting.CLOSE_TAG, "g");
            targetString.replace(regex, (a, b) => {
                highlightedWords.push(b);
                return a;
            });
            return highlightedWords;
        }

        static addValueToObject(obj: {}, path: string, value: any) {
            var keys: string[] = path.split(".");
            var data = obj;
            keys.forEach((key: string, i: number) => {
                if (i === keys.length - 1) {
                    data[key] = value;
                }
                else {
                    data[key] = data[key] || {};
                    data = data[key];
                }
            });
        }

        static applyHighlighting(words: string[], target: string, regExpOptions = "g") {
            words = words || [];
            if (words.length) {
                target = (target || "").replace(new RegExp(words.join("|"), regExpOptions), Constants.Highlighting.OPEN_TAG + "$&" + Constants.Highlighting.CLOSE_TAG);
            }
            return target;
        }

        static reloadWindow(path: string = "") {
            window.location = <any>(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + path);
        }

        static getTypeFromString(typeString: string): Models.DataSourceType {
            var match = (typeString || "").match(/DataSource\.([^.]+)\./i);
            if (match && match.length > 1) {
                var typeName = match[1];
                return Models.DataSourceType[typeName] || Models.DataSourceType.Unknown;
            }
            return Models.DataSourceType.Unknown;
        }

        static setAssetAsMine(asset: { __creatorId?: string; __roles?: Interfaces.IRole[] }, everyOneIsContributor?: boolean) {
            var creatorId = everyOneIsContributor ? null : $tokyo.user.email;
            var objectId = everyOneIsContributor ? Constants.Users.EVERYONE : $tokyo.user.objectId;

            asset.__creatorId = creatorId;
            asset.__roles = asset.__roles || [];
            var member = { objectId: objectId };
            var existingContributor = Utilities.arrayFirst(asset.__roles.filter(r => /Contributor/i.test(r.role)));
            if (existingContributor) {
                existingContributor.members = [member];
            } else {
                asset.__roles.push({
                    members: [member],
                    role: "Contributor"
                });
            }
        }

        static getMyAsset<T extends Interfaces.IAsset>(assets: T[]): T {
            var myAsset;
            (assets || []).forEach(a => {
                (a.__roles || []).forEach(r => {
                    if (/Contributor/i.test(r.role) && (r.members || []).length === 1 && r.members[0].objectId === $tokyo.user.objectId) {
                        myAsset = a;
                    }
                });
            });
            return myAsset;
        }

        static getLatestModifiedAsset<T extends Interfaces.IAsset>(assets: T[]): T {
            var asset;
            if (assets && assets.length) {
                asset = assets[0];
                assets.forEach(a => {
                    var theDate = new Date(asset.modifiedTime);
                    var myDate = new Date(a.modifiedTime);
                    if (myDate > theDate) {
                        asset = a;
                    }
                });
            }
            return asset;
        }

        static validateEmails(emails: string[]): JQueryPromise<string[]> {
            var deferred = $.Deferred();
            var validEmails: string[] = [];
            Constants.EmailRegex.lastIndex = 0;
            emails.forEach(email => {
                var valid = Constants.EmailRegex.test(email)
            if (valid) {
                    validEmails.push(email);
                }
                Constants.EmailRegex.lastIndex = 0; // Prevent caching issue that causes the test to randomly fail.
            });
            deferred.resolve(validEmails);
            return deferred.promise();
        }

        static isValidEmail(email: string): boolean {
            Constants.EmailRegex.lastIndex = 0; // Reset before and after in case the regex is tested elsewhere.
            var isValid = Constants.EmailRegex.test(email);
            Constants.EmailRegex.lastIndex = 0;
            return isValid;

        }

        static createID(): string {
            return (parseInt(Math.random() * Math.pow(2, 32) + "", 10)).toString(36).toUpperCase();
        }

        static centerTruncate(value: string, max: number): string {
            var label = value;
            if (label.length > max) {
                var endCount = Math.floor(max / 2);
                var startCount = endCount - 3;
                var begin = label.substr(0, startCount);
                var end = label.substr(label.length - endCount);
                label = begin + "..." + end;
            }
            return label;
        }

        static asBindable<T>(item: any): T {
            var bindable = <T>{};
            Object.keys(item).forEach(key => {
                var value = item[key];
                if (!$.isArray(value) && !$.isFunction(value)) {
                    bindable[key] = ko.observable(value);
                }
                else {
                    bindable[key] = value;
                }
            });
            return bindable;
        }

        public static isSelectAction(e: KeyboardEvent): boolean {
            var keyCode = e.which || e.keyCode || -1;
            return (keyCode === Constants.KeyCodes.ENTER || keyCode === Constants.KeyCodes.SPACEBAR);
        }
    }
}