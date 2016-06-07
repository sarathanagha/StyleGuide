import TypeDeclarations = require("./TypeDeclarations");
import VivaGraphLifetimeManager = require("Viva.Controls/Base/Base.TriggerableLifetimeManager");

export import IDisposableLifetimeManager = TypeDeclarations.DisposableLifetimeManager;
export class DisposableLifetimeManager extends VivaGraphLifetimeManager.TriggerableLifetimeManager { };
export type IDisposable = TypeDeclarations.Disposable;

/*
 * A disposable base class that registers itself for disposal.
 * Should never be used outside of this file.
 */
export class DisposableBase implements TypeDeclarations.Disposable {
    // We make this public but faux-protected to allow its use in the child classes
    // but to discourage its use in other contexts
    public _lifetimeManager: IDisposableLifetimeManager;

    constructor(lifetimeManager: IDisposableLifetimeManager) {
        this._lifetimeManager = lifetimeManager;
        this._lifetimeManager.registerForDispose(this);
    }

    public dispose() {
        /*
         * This can be overridden in the child classes, but typically
         * they will just register everything for disposal with their
         * LifetimeManager
         *
         * If they do override it, they most likely should call super.dispose() as well
        */

        this._lifetimeManager.dispose();
    }
}

/*
 * The root disposable object. Should be the only object that instantiates
 * the LifetimeManager.
 */
export class RootDisposable extends DisposableBase {
    constructor() {
        super(new DisposableLifetimeManager());
    }
}

/*
 * Every child of the root disposable always creates a child lifetime.
 * The constructor should use the lifetimeManager from the root
 * or from another child.
 *
 */
export class ChildDisposable extends DisposableBase {
    constructor(lifetimeManager: IDisposableLifetimeManager) {
        super(lifetimeManager.createChildLifetime());
    }
}
