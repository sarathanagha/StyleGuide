/// <reference path="../../Definitions/knockout.extensionstypes.d.ts" />
import DisposableBase = require("../Base/Base.Disposable");
import azcPrivate = require("./Util.Private");
export = Main;
declare module Main {
    var blankGif: string;
    class Constants {
        /**
         * Declares the elements which can be focused on.
         * We expect when an element declares a "data-canfocus" attribute, the HTMLElement has a property called "data-canfocus" which has a "setFocus(): boolean" function callback.
         * That is, element["data-canfocus"] = () => boolean.
         */
        static dataCanFocusAttribute: string;
        /**
         * Declares the elements that should get the focus first of all the data-canfocus.
         */
        static dataFocusFirstAttribute: string;
        /**
         * Declares the elements that are also editable in addition to data-canfocus. For example, Grid.EditableRowExtension prefers data-editable over non-editable.
         */
        static dataEditableAttribute: string;
        /**
         * Declares the elements that are controls, such that when user click on an element of a control, we will search for the owning control (with data-control attribute.) to set the focus.
         */
        static dataControlAttribute: string;
        /**
         * Declares the elements that can be activatable.  For example, GridActivatableRowExtension use this as indicator for activate a column.
         */
        static dataActivatableAttribute: string;
        /**
         * Declares the elements activate additional info to pass to the ActivatedRowSelection.
         */
        static dataActivateInfoAttribute: string;
    }
    enum KeyCode {
        Alt = 18,
        Backslash = 220,
        Backspace = 8,
        Comma = 188,
        Control = 17,
        Delete = 46,
        Down = 40,
        End = 35,
        Enter = 13,
        Equals,
        Escape = 27,
        F10 = 121,
        Home = 36,
        Left = 37,
        Minus,
        PageDown = 34,
        PageUp = 33,
        Period = 190,
        Right = 39,
        Shift = 16,
        Slash = 191,
        Space = 32,
        Tab = 9,
        Up = 38,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        Num0 = 48,
        Num1 = 49,
        Num2 = 50,
        Num3 = 51,
        Num4 = 52,
        Num5 = 53,
        Num6 = 54,
        Num7 = 55,
        Num8 = 56,
        Num9 = 57,
    }
    enum MouseButton {
        Left = 1,
        Middle = 2,
        Right = 3,
    }
    /**
     * Returns a GUID such as xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
     *
     * @return New GUID.
     */
    function newGuid(): string;
    /**
     * Encodes html attribute string.
     *
     * @param value The string to encode.
     * @return The encoded string.
     */
    function encodeAttribute(value: string): string;
    /**
     * Encodes html string.
     *
     * @param value The string to encode.
     * @return The encoded string.
     */
    function encodeHtml(value: string): string;
    /**
     * Joins items in array with delimiter and suffix.
     *
     * @param items The items to join.
     * @param delim The delimiter to go between each item.
     * @param append The suffix to append to each item.
     * @return The joined string.
     */
    function joinAppend(items: string[], delim: string, append: string): string;
    /**
     * Joins items in array with delimiter and prefix.
     *
     * @param items The items to join.
     * @param prepend The prefix to place before each item.
     * @param delim The delimiter to go between each item.
     * @return The joined string.
     */
    function joinPrepend(items: string[], prepend: string, delim: string): string;
    /**
     * check object's setting
     *
     * @param object for the settingString to check on.  For example, global
     * @param settingString the environmentSetting to check. For example,  "fx.environment.isDevelopmentMode"
     *
     * @return if object setting exists and it's trusy.
     */
    function checkSetting(object: Object, settingString: string): boolean;
    /**
     * return the setting for "global.fx.environment.isDevelopmentMode".  This return the static setting of the object (load time check.)
     */
    function isDevMode(): boolean;
    /**
     * Detect a value is null or undefined.
     *
     * @param value The value to check against null && undefined.
     * @return boolean.
     */
    function isNullOrUndefined(value: any): boolean;
    /**
     * Generates a random integer between min and max inclusive.
     *
     * @param min The minimum integer result.
     * @param max The maximum integer result.
     * @return A random integer.
     */
    function random(min: number, max: number): number;
    /**
     * Truncates a number to the integer part.
     *
     * @param value The number to truncate.
     * @return The integer number.
     */
    function truncate(value: number): number;
    /**
     * Adds and removes an element to force the narrator to read the section again.
     *
     * @param element DOM element.
     * @param addAriaLive Adds aria-live to polite then restores the previous value.
     */
    function forceScreenRead(element: HTMLElement, addAriaLive?: boolean): void;
    /**
     * Returns true if the character is a non-written character.
     *
     * @param keyCode KeyCode to verify.
     * @return True if non-written character.
     */
    function isNonWrittenCharacter(keyCode: number): boolean;
    /**
     * Shallow copy from a key/value pairs object.
     *
     * @param to An un-typed object to be populated.
     * @param from An un-typed object with values to populate.
     * @param scopes Scoped down the list for shallowCopy
     */
    function shallowCopyFromObject(to: Object, from: Object, scopes?: string[]): void;
    /**
     * Shallow copy from a key/value pairs object.
     *
     * @param to An un-typed object to be populated.
     * @param from An un-typed object with values to populate.
     */
    function shallowCopyToObserableFromObject(to: Object, from: Object, scopes?: string[]): void;
    /**
     * Gets the scrollable parents for the specified element.
     *
     * @param element DOM element.
     * @param includeWindow True to include window in the list of scrollable parents.
     * @return List of scrollable parent elements.
     */
    function getScrollableParents(element: JQuery, includeWindow: boolean): JQuery;
    /**
     * Helper function to deal with short form number string.
     * Generally we want to show number.toFixed(1). But in the case when it can be round up to an integer, we choose the shorter form.
     * For example, 80 instead of 80.0 or 100 instead of 100.00.
     *
     * @param value The number.
     * @param fractionDigits  The fractionDigits for this number string output.
     * @return String for this number.
     */
    function toNiceFixed(value: number, fractionDigits?: number): string;
    /**
     * Helper function to in-place adjust KnockoutObserableArray<T> such that ko bind array doesn't destroy the origin DOM object.
     * Project the source Array into the KnockoutObserableArray.
     *
     * @param source Array that to be projected to the existing KnockoutObservableArray.
     * @param dest  KnockoutObserableArray<T> that's currently use in widget binding.
     * @param itemCopyFunction a function that take the source and copy the content but keep the ko.obserable and ko.obserable as it.
     */
    function projectArrayData<T>(source: T[], dest: KnockoutObservableArray<T>, itemCopyFunction: (sourceItem: T, destItem: T) => void): void;
    /**
     * Helper function to help identifying the container with data attribute "data-control".
     *
     * @param elem The current element to start searching.
     * @return The first element that has "data-control" attribute. It can be the element it starts with. If none is found, null is returned.
     */
    function findContainingControl(elem: Element): Element;
    /**
     * Helper function to help execute the setFocus function that "data-canfocus" has on the element.
     *
     * @param elem The current element to execute the setFocus on.
     * @return Whether setFocus() is successfully executed. If false, the container will need to find the next item to set focus on.
     */
    function executeSetFocusOn(elem: Element): boolean;
    /**
     * Helper function to return the basicShape of an object
     */
    function getObjectBasicShape(obj: Object, sort?: boolean): string[];
    /**
     * Helper function to return whether the extendedShape have same property bag names
     */
    function shapeContains(extendedShape: string[], baseShape: string[]): boolean;
    /**
     * Sets the focus to the first Focusable Child Control under the first element.
     * It goes through two paths to find the first suitable control.
     * First pass goes through the elements with both data-canfocus and data-focusfirst.
     * Then it tries again with data-canfocus and :not(data-focusfirst).
     * --(Note for experienced users who need to set the data-focusfirst, please use Base.Widget._markFocusFirstElements(elem: JQuery)
     *
     * @param elem The container element for this function to find the child element to set focus on.
     * @param preferFilter The optional function callback to filter on specific elements that the user perfers. For example, GridEditableRow, prefers the next data-editable row.
     */
    function setFocusToFirstFocusableChild(elem: JQuery, preferFilter?: (e: Element) => Element): boolean;
    /**
     * Clones the event by copying some important functions.
     * Will use the same type unless you pass one to the function.
     * The original event will be kept in newEvent.originalEvent.
     *
     * @param evt Object to clone.
     * @param type New type to use.
     * @return New cloned object.
     */
    function cloneEvent(evt: JQueryEventObject, type?: string): JQueryEventObject;
    /**
     * Mirror the souce fields, which are observables to the dest fields.
     * The purpose of this function is keep the obserable which is binded to a div and just mirror the value on to it.
     * This is to avoid destroy a DOM Element and recreate one.
     * For example, bar chart, when the new value come in. We push the value to the prior bar wihtout destroy it.
     *
     * @param source Object's keys are observable.
     * @param dest object
     * @param keyNames array of keys to mirror
     * @return New cloned object.
     */
    function fillObserableFields(source: any, dest: any, keyNames: string[]): void;
    /**
     * Utility to map a knockout projected array to an observable array.
     * Knockout projection which returns observable of array while many view model exposes KnokoutObservableArray.
     * This utility will help in mapping the projected array to ObservableArray.
     *
     * @param mappedArray Knockout projected array.
     * @param lifetime The LifetimeManager reflecting the lifetime of the array that's returned.
     * @return returns KnockoutObservableArray.
     */
    function thunkArray<T>(lifetime: DisposableBase.LifetimeManagerBase, mappedArray: KnockoutObservableBase<T[]>): KnockoutObservableArrayDisposable<T>;
    /**
     * existsOrRegisterId.  This is utility function for helping in the destroy method to avoid recursive
     *
     * @param id Unique identifier.
     * @return whether this id is already on the array. If true, mean this is not yet been executed.
     */
    function existsOrRegisterId(array: any[], id: any): boolean;
    /**
     * Shim that implements all of DOMTokenList except [] indexing. Use item() to index.
     */
    class DOMTokenListShim {
        /**
         * We're using the C++-esque friend pattern here. Only getClasses and setClasses should access this guy.
         */
        _fields: string[];
        /**
         * Creates a DOMTokenListShim that behaves like DOMTokenList
         */
        constructor(tokenString?: string);
        /**
         * Adds a taken to the token list if not already present.
         *
         * @param token The token to add.
         */
        add(token: string): void;
        /**
         * Removes all instances of token.
         *
         * @param token The token to remove.
         */
        remove(token: string): void;
        /**
         * Returns true if the token list contains the specified token.
         *
         * @param token The token to look for.
         * @return Whether or not the token appears in the token list.
         */
        contains(token: string): boolean;
        /**
         * The number of tokens in the token list.
         */
        length: number;
        /**
         * Adds a token if note present or removes it if it is.
         *
         * @param token The token to turn on or off.
         * @return Whether the item exists in the token list after toggling.
         */
        toggle(token: string): boolean;
        /**
         * Returns the token at the index parameter.
         *
         * @param index The index.
         * @return The item at the passed index.
         */
        item(index: number): string;
        /**
         * See toString on pretty much any other object.
         */
        toString(): string;
    }
    /**
     * This function exists as an alternative to element.classList, as IE doesn't support this on SVG elements.
     * Returns a token list shim containing all the classes on the element. Note the token list is not synchronized with
     * the element and you need to call setClassList to update a class attribute from a token list.
     *
     * @param element The element for which to get the classList.
     * @return The class list.
     */
    function getClassList(element: Element): DOMTokenListShim;
    /**
     * Sets the classes on an element to be those in the specified class list.
     *
     * @param element The element to set classes on.
     * @param classes The class list.
     */
    function setClassList(element: Element, classes: DOMTokenListShim): void;
    export import DataTransfer = azcPrivate.DataTransfer2;
    /**
    * Returns true if the Hammer.js library has been loaded.
    */
    function hammerLoaded(): boolean;
    /**
     * Compares two values.
     *
     * @param value The value.
     * @param compareTo The compare to value.
     * @param key? The key to access the values.
     * @return An integer indicating if the value is greater or less than the compareTo.
     */
    function compareTo(value: any, compareTo: any, key?: string): number;
    class KnockoutDelayTrigger {
        /**
         * This is internal implementation
         */
        private _value;
        /**
         * Creates a KOUpdateTrigger with certain extension
         *
         * @param knockoutObserveExtend the knockout extend apply to this value observable
         */
        constructor(knockoutObserveExtend?: any);
        /**
         * This is the value to subscribe to the delay trigger.
         */
        value: KnockoutObservableBase<number>;
        touch(): void;
    }
}
