/// <reference path="../../Definitions/knockout.d.ts" />
export = Main;
declare module Main {
    /**
     * An object that is disposable.
     */
    interface Disposable {
        /**
         * A function called on the object when it is disposed.
         */
        dispose(): void;
    }
    /**
     * An object that can limit the lifetime of other objects. When a LifetimeManager object
     * is disposed, it will dispose all other objects that were registered for disposal.
     */
    interface LifetimeManagerBase {
        /**
         * Registers an object to be disposed.  It will throw if the object doesn't have dispose method.
         *
         * @param disposable An object to be disposed once the LifetimeManager object itself is disposed.
         */
        registerForDispose(disposables: Disposable[]): LifetimeManagerBase;
        registerForDispose(disposable: Disposable): LifetimeManagerBase;
    }
    interface LifetimeManager extends LifetimeManagerBase {
        /**
         * Create a createChildManager to localize the LifetimeManager.
         * It will provide the function on tracking who create it and when it dispose, it will remove itself from Container's lifetimeManager
         *
         */
        createChildLifetime(): DisposableLifetimeManager;
    }
    interface DisposableLifetimeManager extends Disposable, LifetimeManager {
    }
}
