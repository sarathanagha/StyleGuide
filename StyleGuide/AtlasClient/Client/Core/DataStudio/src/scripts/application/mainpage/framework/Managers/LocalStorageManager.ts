/// <reference path="../References.ts" />

module Microsoft.DataStudio.Framework.Managers {

    export class LocalStorageManager {

        // TODO Move instance variable to factory.
        private static _instance:LocalStorageManager;

        public static getInstance(): LocalStorageManager {

            if (!LocalStorageManager._instance) {
                LocalStorageManager._instance = new LocalStorageManager();
            }

            return LocalStorageManager._instance;
        }

        private storage = {};

        public getItem<T>(path:string):Promise<T> {

            // TODO Create PromiseHelper with Promise.RejectIfNullOrUndefined, etc...

            if (!path) {
                return Promise.reject(new Error("path is null or undefined."));
            }

            return Promise.resolve(this.getByPath<T>(path));
        }

        public setItem<T>(path:string, value:T): Promise<any> {
            if (!path) {
                return Promise.reject(new Error("path is null or undefined."));
            }

            this.setByPath(path, value);
            return Promise.resolve();
        }

        private getByPath<T>(path:string): T {

            var value = this.storage;

            path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            path = path.replace(/^\./, '');           // strip a leading dot

            var properties = path.split('.');
            for (var i = 0, n = properties.length; i < n; ++i) {
                var property = properties[i];
                if (property in value) {
                    value = value[property];
                } else {
                    return;
                }
            }

            return <T>value;
        }

        private setByPath<T>(path:string, value: T): void {

            var st = this.storage;

            path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            path = path.replace(/^\./, '');           // strip a leading dot

            var properties = path.split('.');
            for (var i = 0, n = properties.length-1; i < n; ++i) {
                var property = properties[i];
                if (property in st) {
                    st = st[property];
                } else {
                    st = st[property] = {};
                }
            }

            st[properties[properties.length-1]] = value;
        }

    }
}
