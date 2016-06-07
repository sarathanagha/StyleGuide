/// <reference path="../../../Definitions/jquery.d.ts" />
/// <reference path="../../../Definitions/knockout.d.ts" />
/// <reference path="../../../Definitions/knockout.extensionstypes.d.ts" />
/// <reference path="../../../Definitions/Html5.d.ts" />
/// <reference path="../../../Definitions/d3.d.ts" />
import DisposableBase = require("../../Base/Base.Disposable");
export = Main;
declare module Main {
    interface CreateOptions {
        /**
         * The view model type expected.
         * Used to create a default view model instance if the options param is an un-typed object instance.
         */
        viewModelType?: new () => ViewModel;
        /**
         * Indicates the widget is being created directly by a knockout binding.
         * This allows the widget to handle descendant bindings and disposal appropriately.
         */
        knockoutBinding?: boolean;
    }
    interface Disposable {
        /**
         * Disposes resources.
         */
        dispose(): void;
    }
    interface Interface extends Disposable {
        /**
         * The element this widget is applied to.
         */
        element: JQuery;
        /**
         * The view model driving this widget.
         */
        options: ViewModel;
        /**
         * Dispose() has been called.
         */
        isDisposed(): boolean;
        /**
         * When overridden, gets the outermost element that this widget applies to.
         *
         * @return The outermost element that this widget applies to.
         */
        widget(): JQuery;
        /**
         * Lifetime manager for registering disposables that will be disposed when the widget is disposed.
         */
        lifetimeManager: DisposableBase.LifetimeManager;
    }
    class ViewModel {
        /**
         * Indicates if the widget is currently disabled.
         */
        disabled: KnockoutObservableBase<boolean>;
        /**
         * Populates the view model from a key/value pairs object.
         * The keys should map to properties on the view model.
         * The values are applied to the corresponding keys.
         *
         * @param object An un-typed object with values to populate on the view model.
         */
        populateFromObject(object: Object): void;
        /**
         * Deep copies all the properties of the source object to the destination object.
         * All properties in destination that are not in the source should remain intact.
         * Functions are copied by reference.
         *
         * @param source The object whose properties need to be copied.
         * @param destination The destination object.
         */
        static copyObject(source: Object, destination: any): void;
        /**
         * Deep copies all the properties of the source object to the destination object.
         * All properties in destination that are not in the source should remain intact.
         * Functions are copied by reference.
         *
         * We need to ensure that properties that point to one of their ancestors doesn't cause a infinite loop.
         * To that end, we pass in the sourceAncestors and destination ancestors and check against that.
         *
         * @param source The object whose properties need to be copied.
         * @param destination The destination object.
         * @param sourceAncestors The ancestors of the source object used to prevent circular linked list causing an infinite loop.
         * @param destinationAncestors The ancestors of the destination object corresponding to the sourceAncestors to assign to circular linked list.
         */
        private static _copyObject(source, destination, sourceAncestors, destinationAncestors);
    }
    interface FirstFocusCallback {
        /**
         * Gets a list of elements that will receive a "data-focusfirst" attribute.
         *
         * @return jQuery object for all the elements that need to add "data-focusfirst" attribute.
         */
        (): JQuery;
    }
    interface FocusCallback {
        /**
         * Sets focus implementation callback.
         *
         * @param elem The control element for setFocus is called on.
         * @param widget The control widget that setFocus is called on.
         * @return Whether successful setFocus on this control.
         */
        (elem: JQuery, widget: Widget): boolean;
    }
    class Widget implements Interface {
        /**
         * The element this widget is applied to.
         */
        element: JQuery;
        _options: ViewModel;
        _isLoading: KnockoutObservableBase<boolean>;
        /**
         * Creation options.
         */
        _createOptions: CreateOptions;
        _supportsFocus: KnockoutObservableBase<boolean>;
        _markFocusFirstElements: KnockoutObservable<FirstFocusCallback>;
        private _destroyIds;
        private static _widgetTypesDataKey;
        private static _widgetEventNamespace;
        private static _widgetRemoveEvent;
        private static _cleanData;
        private static _trackingContexts;
        private _dataFocusableCallback;
        private _lifetimeManager;
        private _subscriptionsLifetimeManager;
        private _disposablesLifetimeManager;
        private _disposeCallback;
        private _loading;
        private _prevElement;
        private _destroyTriggered;
        /**
         * Creates a new instance of the Widget.
         *
         * @param element The element to apply the widget to.
         * @param options The view model to use, as a strongly typed ViewModel instance.
         * @param createOptions The creation options.
         */
        constructor(element: JQuery, options: Object, createOptions: CreateOptions);
        /**
         * Creates a new instance of the Widget.
         *
         * @param element The element to apply the widget to.
         * @param options The view model to use, as an un-typed object with key/value pairs that match the view model properties.
         * @param createOptions The creation options.
         */
        constructor(element: JQuery, options: ViewModel, createOptions: CreateOptions);
        /**
         * _checkExistsOrRegisterDestroyId.  This is utility function for the destroy method to avoid recursive
         *
         * @param destroyId Unique identifier for the destroy to identify itself.  In the javascript inheritance, this.destroy is always the same.
         *                  But super.dispose is unique since super is function scope.  Typically, use super.dispose as id. For root object, use null as Id.
         * @return whether this destroyMethod is already on the executed. If true, mean it is already been executed.
         */
        _checkExistsOrRegisterDestroyId(destroyId: any): boolean;
        /**
         * See interface.
         */
        isDisposed(): boolean;
        /**
         * See interface.
         */
        dispose(): void;
        /**
         * See interface.
         */
        lifetimeManager: DisposableBase.LifetimeManager;
        /**
         * See interface.
         */
        options: ViewModel;
        /**
         * Gets the binding handler instance for the specified widget type.
         *
         * @param widgetType The prototype for initializing the portal control.
         * @param initOptions This initialization options for the widget binding.
         * @return Binding handler instance for initializing the portal control.
         */
        static getBindingHandler(widgetType: new (fixture: JQuery, viewModel: ViewModel, createOptions: CreateOptions) => Widget, initOptions?: any): KnockoutBindingHandler;
        /**
         * Retrieves the first widget instance of the requested type on the element, or null if none found.
         *
         * @param element The JQuery element to search on.
         * @param type The widget type to perform the search for.
         * @return The first widget instance found on the element, optionally filtered by type.
         */
        static getWidget(element: JQuery, type: any): Widget;
        /**
         * Retrieves the widget instances applied to an element, filtered with an optional type.
         *
         * @param element The JQuery element to search on.
         * @param type An optional widget type to filter with.
         * @return All the widget instances found on the element, optionally filtered by type.
         */
        static getWidgets(element: JQuery, type?: any): Widget[];
        /**
         * See interface.
         */
        widget(): JQuery;
        /**
         * Starts tracking widgets as they are created and disposed.
         *
         * @param context Array to hold the actively tracked widgets.
         */
        static beginTracking(context?: Widget[]): void;
        /**
         * Stops tracking widgets as they are created and disposed.
         *
         * @return The context array holding the active widgets that were tracked.
         */
        static endTracking(): Widget[];
        /**
         * Toggles display:none until this._loading reference count reaches zero. This is a performance optimization to avoid browsers from rendering until the DOM finish updating.
         * By default, we wrap bind() method with _delayRendering(true) and _delayRendering(false) to avoid the browsers from rendering until the DOM has finished updating by Knockout.
         *
         * @param delay True to increase ref count of this._loading to indicate the section needs to be wrapped into diaplay:none to optimize for the performance.
         *              False to decrease of ref count of this._loading to indicate exiting of prior _delayRendering(true).
         */
        _delayRendering(delay: boolean): void;
        _subscriptions: DisposableBase.LifetimeManager;
        _disposables: DisposableBase.LifetimeManager;
        /**
         * Can this control be focused.
         *
         * @return Whether this element can be set focus on.
         */
        _canSetFocus(): boolean;
        /**
         * Simple helper for _setFocus function. It will call focus on the returned Element.
         *
         * @return The element to set focus on.
         */
        _getElementToFocus(): Element;
        /**
         * Default implementation of setFocus for this widget when this._supportFocus(true).
         *
         * @param elem The element of the control that has _supportFocus(true).
         * @param widget This widget.
         * @return Whether it successfully sets the focus on the item.
         */
        _setFocus(elem: JQuery, widget: Widget): boolean;
        /**
         * Calls knockout to bind the descendant nodes to the view model.
         *
         * @param extraViewModel Extra view model you can attach to the Knockout view model.
         */
        _bindDescendants(extraViewModel?: any): void;
        /**
         * Calls Knockout to clean up all descendent bindings.
         */
        _cleanDescendants(): void;
        /**
         * Triggers an event on the widget associated element.
         *
         * @param type A string indicating the type of event to create.
         * @param event An optional JQueryEventObject containing data for this event.
         * @param data An optional object containing data for the event.
         * @param target An optional target for the event instead of the widget element.
         * @return A boolean indicating if the event should be propagated or not.
         */
        _trigger(type: string, event?: JQueryEventObject, data?: any, target?: EventTarget): boolean;
        /**
         * Helper method allowing you to unsubscribe from previously subscribed functions.
         * This method should not be overridden.
         */
        _disposeSubscriptions(): void;
        /**
         * Helper method allowing you to clean up resources related the the HTMLElement.
         * This method should not be overridden.
         *
         * @param cssClasses Optional css classes to remove from the HTMLElement.
         */
        _cleanElement(...cssClasses: string[]): void;
        /**
         * Helper method allowing you to subscribe to knockout objects.
         *
         * @param viewModel The ViewModel.
         */
        _initializeSubscriptions(viewModel: ViewModel): void;
        /**
         * Indicates if the UI is currently in RTL mode.
         *
         * @return true if RTL is enabled.
         */
        _isRtl(): boolean;
        /**
         * Placeholder to add additional logic after widget is initialized.
         * Inherited classes can override this method to add custom logic which requires widget to be in the initialized state.
         */
        _afterCreate(): void;
        /**
         * Adds a subscription to be cleaned up in the dispose().
         *
         * @param disposable One KnockoutComputed to be added to this._disposables.
         */
        _addDisposablesToCleanUp(disposable: KnockoutDisposable): void;
        /**
         * Adds a list of computed to be cleaned up in the dispose().
         *
         * @param disposable Array of KnockoutComputed to be added to this._disposables.
         */
        _addDisposablesToCleanUp(disposable: KnockoutDisposable[]): void;
        /**
         * Registers an appropriate callback to notify the widget to dispose.
         */
        private _registerDispose();
        /**
         * Unregisters the dispose callback when it is no longer needed.
         */
        private _unregisterDispose();
        /**
         * Registers the cleanData with jQuery.
         */
        private static setupCleanData();
    }
}
