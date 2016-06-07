/// <reference path="../../Definitions/knockout.d.ts" />
import DisposableBase = require("./Base.Disposable");
export = Main;
declare module Main {
    /**
     * An object that tracks and invokes disposal callbacks. This can be used
     * in other classes that wish to implement LifetimeManager.
     */
    class TriggerableLifetimeManager implements DisposableBase.DisposableLifetimeManager, DisposableBase.LifetimeManager {
        private _disposables;
        private _isDisposed;
        private _isDisposing;
        private _container;
        private _children;
        private _failToDispose;
        private _diagnosticCreateStack;
        isDisposed: KnockoutObservableBase<boolean>;
        static setDevMode(value: boolean): void;
        static setDiagnosticMode(value: boolean): void;
        constructor();
        /**
        * Mirror version of computed.
        */
        /**
         * Mirror version of but return a LifetimeManager for chainning.
         */
        /**
         * subscribe to a KnockoutSubscribable object
         */
        /**
         * subscribe to a KnockoutSubscribable object but return a LifetimeManager for chainning.
         */
        /**
         * See interface.
         */
        registerForDispose(disposables: DisposableBase.Disposable[]): DisposableBase.LifetimeManagerBase;
        registerForDispose(disposable: DisposableBase.Disposable): DisposableBase.LifetimeManagerBase;
        /**
         * See interface.
         */
        createChildLifetime(): DisposableBase.DisposableLifetimeManager;
        /**
         * Causes the instance to regard itself as disposed, and to trigger any
         * callbacks that were already registered.
         */
        dispose(): void;
        _unregisterChildForDispose(disposable: DisposableBase.Disposable): void;
        _isRegistered(disposable: DisposableBase.Disposable): boolean;
        _registerForDispose(disposable: DisposableBase.Disposable): void;
    }
}
