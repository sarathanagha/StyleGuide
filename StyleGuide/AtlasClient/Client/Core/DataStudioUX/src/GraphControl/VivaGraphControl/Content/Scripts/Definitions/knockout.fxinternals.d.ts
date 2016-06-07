// -------------------------------------------------------------------------
// The subset of KO APIs that only the portal framework should use directly.
// Portal extensions should not use these APIs, so this file should not be
// included in the distributed SDK.
//
// PLEASE DO NOT REFERENCE THIS FILE OR THESE APIs FROM A PORTAL EXTENSION,
// because doing so would prevent the framework from reliably releasing the
// memory held by your computeds and subscriptions.
// -------------------------------------------------------------------------

interface KnockoutComputedStatic {
    <T>(func: () => T, context?: any, options?: KnockoutComputedOptions<T>): KnockoutComputed<T>;
    <T>(options?: KnockoutComputedOptions<T>): KnockoutComputed<T>;
}

interface KnockoutSubscribable<T> {
    subscribe(callback: (newValue: T) => void, target?: any, topic?: string): KnockoutSubscription<T>;
}

interface KnockoutReadOnlyObservableArray<T> extends KnockoutReadOnlyObservable<T[]> {
    map<TResult>(options: KnockoutProjectionsMapOptions<T, TResult>): KnockoutProjectableComputedArray<TResult>;
    map<TResult>(mapping: (value: T) => TResult): KnockoutProjectableComputedArray<TResult>;
    filter(predicate: (value: T) => boolean): KnockoutProjectableComputedArray<T>;
}

interface KnockoutProjectableComputedArray<T> extends KnockoutComputed<T[]> {
    map<TResult>(options: KnockoutProjectionsMapOptions<T, TResult>): KnockoutProjectableComputedArray<TResult>;
    map<TResult>(mapping: (value: T) => TResult): KnockoutProjectableComputedArray<TResult>;
    filter(predicate: (value: T) => boolean): KnockoutProjectableComputedArray<T>;
}

interface KnockoutProjectionsMapOptions<T, TResult> {
    mapping? (value: T, index: KnockoutObservable<number>): TResult;
    mappingWithDisposeCallback? (value: T, index: KnockoutObservable<number>): { mappedValue: TResult; dispose: () => void };
    disposeItem? (mappedItem: TResult): void;
}
