interface KnockoutObservableArrayDisposable<T> extends KnockoutObservableArray<T>, KnockoutDisposable {
}

interface KnockoutUtils {
    /**
     * Fixes up knockout array edits so they can be reapplied on the original array to recreate the same changes.
     *
     * @param edits The knockout array edits.
     * @return Returns the edits.
     */
    fixupArrayEdits<T>(edits: KnockoutArrayEdit<T>[]): KnockoutArrayEdit<T>[];

    /**
     * Applies fixed up knockout array edits to an array.
     *
     * @param target The array to apply the edits to.
     * @param edits The edits to apply.
     * @param mapFunc Function for mapping the value.
     */
    applyArrayEdits<T>(target: T[], edits: KnockoutArrayEdit<T>[]): void;
    applyArrayEdits<T>(target: KnockoutObservableArray<T>, edits: KnockoutArrayEdit<T>[]): void;
    applyArrayEdits<T, U>(target: U[], edits: KnockoutArrayEdit<T>[], mapFunc: (value: T) => U): void;
    applyArrayEdits<T, U>(target: KnockoutObservableArray<U>, edits: KnockoutArrayEdit<T>[], mapFunc: (value: T) => U): void;

    /**
     * Cleans knockout properties and disposables from descendents of the specified node
     * without cleaning the node itself.
     *
     * @param node The root node to start from.
     */
    cleanDescendantNodes(node: Element): void;
    cleanDescendantNodes(node: JQuery): void;

    /**
     * Ignores all dependent observables that are accessed in the callback.
     *
     * @param callback The function to execute.
     */
    ignoreDependencies(callback: () => void): void;
}