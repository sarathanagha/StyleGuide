/// <reference path="../../../Definitions/knockout.d.ts" />
/// <reference path="../../../Definitions/jquery.d.ts" />
/// <reference path="../../../Definitions/Html5.d.ts" />
/// <reference path="../../../Definitions/knockout.extensionstypes.d.ts" />
import DisposableBase = require("../../Base/Base.Disposable");
export = Main;
declare module Main {
    /**
     * An observable map. This interface is immutable.
     */
    interface IObservableMap<T> {
        /**
         * Equivalent to doing () on an observable. Triggers updates in computeds, etc.
         *
         * @return The underlying map.
         */
        latch(): StringMap<T>;
        /**
         * Returns the item associated with key in the map.
         *
         * @param key The key to look up.
         * @return The item associated with the key value pair.
         */
        lookup(key: string): T;
        /**
         * Iterates through each object in the observable map.
         *
         * @param callback The function that gets called on each item in the map.
         */
        forEach(callback: (value: T, key: string) => void): void;
        /**
         * Determines whether all the members of an array satisfy the specified test.
         *
         * @param callbackfn A function that accepts up to two arguments. The every method calls the callbackfn function for each element in the map until the callbackfn returns false, or until the end of the map.
         * @return True if the callback function returns true for all map elements, false otherwise.
         */
        every(callbackfn: (value: T, key: string) => boolean): boolean;
        /**
         * Determines whether the specified callback function returns true for any element of a map.
         *
         * @param callbackfn A function that accepts up to two arguments. The some method calls the callbackfn function for each element in the map until the callbackfn returns true, or until the end of the map.
         * @return True if the callback function returns true for at least one map element, false otherwise.
         */
        some(callbackfn: (value: T, key: string) => boolean): boolean;
        /**
         * Creates an Array<T> from the elements of the map.
         * @return The instance of the array with flattened map elements.
         */
        toArray(): Array<T>;
        /**
         * Creates a projection of the observable map.
         *
         * @param transform A function that transforms object in this map into objects in the projection.
         * @return The projected map.
         */
        map<U>(lifetimeManager: DisposableBase.LifetimeManager, transform: (value: T) => U): IObservableMap<U>;
        /**
         * Gets the number of items in the observable map.
         */
        count: number;
        /**
         * Disposes of the map.
         */
        dispose(): void;
        /**
         * Subscribes to an observable map.
         *
         * @param lifetimeManager The manager responsible for disposing of the subscription.
         * @param callback Called when the map changes.
         * @param target See observable subscribe function.
         * @param topic See observable subscribe function.
         * @return The subscription to the map.
         */
        subscribe(lifetimeManager: DisposableBase.LifetimeManager, callback: (newValue: StringMap<T>) => void, target?: any, topic?: string): KnockoutSubscription<StringMap<T>>;
    }
    /**
     * An observable map. This interface is mutable.
     */
    interface IMutableObservableMap<T> extends IObservableMap<T> {
        /**
         * Associates the passed key with the passed value.
         *
         * @param the key of the key/value pair.
         * @param the value of the key/value pair.
         */
        put(key: string, value: T): void;
        /**
         * Prevents any knockout notifications until the passed callback executes.
         * Anytime you need to push lots of key value pairs, you should do it in the passed callback.
         * This function also locks any dependant maps (projections or unions) so they too only fire one
         * update.
         *
         * @param callback the function to call before notifying subsribers.
         */
        modify(callback: () => void): void;
        /**
         * Removes all items from the observable map.
         */
        clear(): void;
        /**
         * Removes the key/value pair from the map.
         *
         * @param key The key (and its corresponding value) to remove from the map.
         */
        remove(key: string): void;
    }
    /**
     * Stores the Knockout bindingContext private variable (in normal and minified forms).
     */
    var _koBindingContext: any;
    /**
     * Stores the Knockout dependencyDetection private variable (in normal and minified forms).
     */
    var _koDependencyDetectionIgnore: any;
    /**
     * An observable map/dictionary. When you add or remove key value pairs, it notifies subscribers.
     * Can be used in computeds and like any other observable except that you use .latch() to read the map
     * and put, remove, and clear to mutate the map.
     */
    class ObservableMap<T> implements IMutableObservableMap<T> {
        /**
         * Actual string map that stores the values.
         */
        _modifyMap: StringMap<T>;
        /**
         * Maps, dependent on this one.
         */
        _dependantMaps: ObservableMap<any>[];
        /**
         * The internal workings of observable map. We name it without _ so Ibiza will synchronize the observables
         * across the iframe.
         */
        private observable;
        private _isInModifyBlock;
        /**
         * See interface.
         */
        put(key: string, value: T): void;
        /**
         * See interface.
         */
        lookup(key: string): T;
        /**
         * See interface.
         */
        modify(callback: () => void): void;
        /**
         * See interface.
         */
        latch(): StringMap<T>;
        /**
         * See interface.
         */
        clear(): void;
        /**
         * See interface.
         */
        count: number;
        /**
         * See interface.
         */
        remove(key: string): void;
        /**
         * See interface.
         */
        forEach(callback: (value: T, key: string) => void): void;
        /**
         * See interface.
         */
        some(callbackfn: (value: T, key: string) => boolean): boolean;
        /**
         * See interface.
         */
        every(callbackfn: (value: T, key: string) => boolean): boolean;
        /**
         * See interface.
         */
        toArray(): Array<T>;
        /**
         * See interface.
         */
        dispose(): void;
        /**
         * See interface.
         */
        subscribe(lifetimeManager: DisposableBase.LifetimeManager, callback: (newValue: StringMap<T>) => void, target?: any, topic?: string): KnockoutSubscription<StringMap<T>>;
        /**
         * See interface.
         */
        map<U>(lifetimeManager: DisposableBase.LifetimeManager, transform: (value: T) => U): IObservableMap<U>;
        /**
         * Adds a map as a dependant. Whenever the user adds or removes a key, this change gets reflected
         * in all dependant maps.
         *
         * @param map The map that depends on us. Generic parameter is any instead of T because projections are generally a different type.
         */
        _addDependantMap(map: ObservableMap<any>): void;
        /**
         * Removes a dependant observable map. The map will no longer receive updates from this map.
         *
         * @param map The map to remove as a dependancy. Generic parameter is any instead of T because projections are generally a different type.
         */
        _removeDependantMap(map: ObservableMap<any>): void;
        /**
         * Called when an an upstream map adds a key value pair.
         *
         * @param key The added key.
         * @param value The added value. Type is any because projections may have a different type than the parent map.
         */
        _putNotification(key: string, value: any): void;
        /**
         * Called when an upstream map removes a key.
         *
         * @param key The key removed.
         */
        _removeNotification(key: string): void;
        /**
         * Called when an upstream map removes all keys
         *
         * @param map The map being cleared.
         */
        _clearNotification(map: IObservableMap<any>): void;
        private _validateKey(key);
    }
    /**
     * A projection of an observable map. Whenever a key/value pair gets added to the base map,
     * a transformed object with the same key gets added to the projection. Removing from or clearing
     * the base map reflects in the projection as well.
     * Map.project is an easier was to create these.
     */
    class ObservableMapProjection<T, U> extends ObservableMap<U> {
        private _transform;
        private _map;
        constructor(lifetimeManager: DisposableBase.LifetimeManager, map: ObservableMap<T>, transform: (value: T) => U);
        /**
         * See parent.
         */
        dispose(): void;
        /**
         * Projections are immutable. Throws an exception.
         */
        put(key: string, value: U): void;
        /**
         * Projections are immutable. Throws an exception.
         */
        remove(key: string): void;
        /**
         * Projections are immutable. Throws an exceptions.
         */
        clear(): void;
        /**
         * See parent.
         */
        _putNotification(key: string, value: T): void;
        /**
         * See parent.
         */
        _removeNotification(key: string): void;
        /**
         * See parent.
         */
        _clearNotification(map: IObservableMap<any>): void;
    }
    /**
     * Contains the union of key/value pairs on any number of other maps.
     */
    class ObservableMapUnion<T> extends ObservableMap<T> {
        private _maps;
        constructor(lifetimeManager: DisposableBase.LifetimeManager, ...maps: IObservableMap<T>[]);
        /**
         * See interface.
         */
        dispose(): void;
        /**
         * Unions are immutable. Throws an exceptions.
         */
        put(key: string, value: T): void;
        /**
         * Unions are immutable. Throws an exceptions.
         */
        remove(key: string): void;
        /**
         * Unions are immutable. Throws an exceptions.
         */
        clear(): void;
        /**
         * See parent.
         */
        _putNotification(key: string, value: T): void;
        /**
         * See parent.
         */
        _removeNotification(key: string): void;
        /**
         * See parent.
         */
        _clearNotification(map: IObservableMap<any>): void;
    }
    /**
     * Encodes the input into a string that has none of these characters: <>&.
     *
     * @param value Input to encode.
     * @return Encoded HTML.
     */
    function htmlEncode(value?: any): string;
}
