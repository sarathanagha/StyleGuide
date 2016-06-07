declare module DataLab.Constants {
    enum GraphNodeType {
        Module = 0,
        Dataset = 1,
        TrainedModel = 2,
        WebServicePort = 3,
        Transform = 4,
        None = 5,
    }
    var PasswordPlaceholder: string;
    module ResourceCategory {
        var Dataset: string;
        var TrainedModel: string;
        var Transform: string;
        var Uncategorized: string;
        var TrainModule: string;
        var ScoreModule: string;
        var WebService: string;
        var Deprecated: string;
        var Transformation: string;
    }
    enum DisplayEndpointType {
        Error = 0,
    }
    var MaximumCharsForErrorToolTip: number;
    var DatasetName: string;
    var CustomModulePackageName: string;
    var TrainedModelName: string;
    var TransformModuleName: string;
    module WellKnownResource {
        var ScoreGenericModuleFamilyId: string;
        var TransformFamilyId: string;
        var SplitModuleFamilyId: string;
        var ProjectColumnFamilyId: string;
        var ApplyTransformationFamilyId: string;
    }
    module WellKnownDataTypeId {
        var ITransformDotNet: string;
    }
    var WelcomeSkipOptionId: string;
    enum FeatureId {
        None = 0,
        Upgrade_Yes = 1,
        Upgrade_No = 2,
        ShellUICommands = 3,
        Run = 4,
        PublishWebService = 5,
        PublishDataflow = 6,
        RepublishWebService = 7,
        Save = 8,
        SaveAs = 9,
        Discard_PressedYes = 10,
        Discard_PressedNo = 11,
        Cancel = 12,
        Refresh = 13,
        RemoveCredentials = 14,
        Settings = 15,
        Palette = 16,
        Search = 17,
        Download = 18,
        Visualize = 19,
        SendFeedback = 20,
        Feedback = 21,
        OpenHelp = 22,
        VisualizationParameter = 23,
        Visualization = 24,
        HistogramMode = 25,
        BoxchartMode = 26,
        ColumnPicker = 27,
        AddRule = 28,
        RemoveRule = 29,
        CloseColumnPicker = 30,
        EnableAllowDuplicates = 31,
        DisableAllowDuplicates = 32,
        PreviewExperiment = 33,
        PreviewWebServiceGroup = 34,
        ThumbnailSize = 35,
        AddModuleByDragging = 36,
        AddModuleByDoubleClick = 37,
        ExperimentEditor = 38,
        Help = 39,
        HelpSearched = 40,
        HelpSearchResultClicked = 41,
        HelpSemanticSynonymClicked = 42,
        WebServiceParameter = 43,
        CreateNewParameter = 44,
        LinkExistingParameter = 45,
        UnlinkParameter = 46,
        RenameParameter = 47,
        ProvideDefaultValue = 48,
        RemoveDefaultValue = 49,
        RemoveParameter = 50,
        ExperimentParameterInUse = 51,
        WebServicePort = 52,
        DragNewPort = 53,
        PublishToCommunity = 54,
        UploadDataset = 55,
        TrialFeature = 56,
        DisabledWebServicePublish = 57,
        DisabledModule = 58,
        DisabledDatasetUpload = 59,
        ExceededModuleCountLimit = 60,
        TrialDialogSignIn = 61,
        TrialDialogClose = 62,
        ExceededModuleRuntimeLimit = 63,
        ExceededStorageLimit = 64,
        ParallelRunDisabled = 65,
        DisabledFeature = 66,
        TrialDialogSignUp = 67,
        PrepareWebService = 68,
        SwitchExperimentDataFlow = 69,
        SwitchWebServiceDataFlow = 70,
        PrepareWebServiceFailed = 71,
        ScoringExperiment = 72,
        CreateScoringExperiment = 73,
        CreateScoringExperimentFailed = 74,
        UpdateScoringExperiment = 75,
        UpdateScoringExperimentFailed = 76,
        SwitchExperiment = 77,
        DeleteScoringExperiment = 78,
        BubbleTutorial = 79,
        UserDismiss = 80,
        CopyExperimentAcrossWorkspace = 81,
        PlusNewExperiment = 82,
        GuidedTour = 83,
        GuidedExperiment = 84,
        GuidedExperimentStep1 = 85,
        GuidedExperimentStep2 = 86,
        GuidedExperimentStep3 = 87,
        GuidedExperimentStep4 = 88,
        GuidedExperimentStep5 = 89,
        GuidedExperimentStep6 = 90,
        GuidedExperimentStep7 = 91,
        GuidedExperimentOpenFromDrawer = 92,
        GuidedExperimentOpenFromGuidedTour = 93,
        GuidedTourStep1 = 94,
        GuidedTourStep2 = 95,
        GuidedTourStep3 = 96,
        GuidedTourStep4 = 97,
        GuidedTourStep5 = 98,
        GuidedTourStep6 = 99,
        GuidedTourStep7 = 100,
        GuidedTourOpenFromNavigationBar = 101,
        GuidedTourOpenFromIntroVideo = 102,
        DisabledModuleUpload = 103,
        DisabledPublishToCommunity = 104,
        CopyExperimentFromGallery = 105,
        GuidedTourStep8 = 106,
        CommandBarShowLineage = 107,
        CommandBarSave = 108,
        CommandBarSaveAs = 109,
        CommandBarDiscard = 110,
        CommandBarPublish = 111,
        CommandBarSubmit = 112,
        CommandBarCancel = 113,
        CommandBarPublishWebService = 114,
        CommandBarPublishToCommunity = 115,
        CommandBarCreateScoringGraph = 116,
        CommandBarRefresh = 117,
        CommandBarPrepareWebService = 118,
    }
    var WorkspaceNameRegex: RegExp;
    var ExperimentSubmissionFailedRegExp: RegExp;
    module ModuleError {
        var GetErrorIdRegExp: RegExp;
        var SkipErrorHeadingRegExp: RegExp;
        var SkipWhitespaceAndModuleOutputStrRegExp: RegExp;
        var StartMessageEndRegExp: RegExp;
    }
    var GuidedExperimentDescription: string;
}

declare module DataLab.Util {
    interface ILocaleFormatString {
        [key: string]: string;
        d: string;
        D: string;
        F: string;
        m: string;
        M: string;
        r: string;
        R: string;
        s: string;
        t: string;
        T: string;
        u: string;
        y: string;
        Y: string;
    }
    interface ILocalValues {
        days: string[];
        daysAbbr: string[];
        months: string[];
        monthsAbbr: string[];
        ampm: string[];
        ampmAbbr: string[];
        dateSeparator: string;
        timeSeparator: string;
        standard: ILocaleFormatString;
    }
    class DateFormatter {
        private localeValues;
        private date;
        constructor(date: Date);
        static parse(value: string): any;
        getLocaleValues(): ILocalValues;
        setLocaleValues(def: ILocalValues): void;
        toString(format: string): string;
        private pad(str, length, padding?);
        private truncate(str, length);
        private truncateAndPad(str, length);
        private fixHour12(time);
        private reverse(arg);
        private escapeEverything(arg);
        private replaceCharacters(arg);
        private replaceCharactersWithReverse(arg);
    }
}

/// <reference path="Global.refs.d.ts" />
declare module DataLab.Log {
    interface ILogger {
        info(message: string, eventSource: string, data: any): void;
        error(message: string, eventSource: string, data: any): void;
        warn(message: string, eventSource: string, data: any): void;
        unhandledException?(message: string, url: string, lineNumber: number): void;
    }
    function info(message: string, eventSource?: string, data?: any): void;
    function error(message: string, eventSource?: string, data?: any): void;
    function warn(message: string, eventSource?: string, data?: any): void;
    function exception(exception: string, message?: string, eventSource?: string, data?: any): void;
    function exception(exception: Error, message?: string, eventSource?: string, data?: any): void;
    function exception(exception: any, message?: string, eventSource?: string, data?: any): void;
    /** Emits an error-level trace (potentially containing the current call stack) and then throws an exception with the given message.
        The intended usage is 'throw new TracedException(...)'. Creating a TracedException writes the trace immediately (i.e. not as a part of a later throw). */
    class TracedException {
        constructor(message: string, eventSource?: string, data?: any);
    }
    function setLogger(newLogger: ILogger): void;
    /** When true, unhandled exceptions (as sent to the window.onerror event) are traced as errors. */
    var traceUnhandledExceptions: boolean;
    /** ko.subscribable which is triggered by window.onerror. The notification value is an array of the window.onerror arguments:
        {message: string, url: string, line: number} */
    var unhandledExceptionEvent: KnockoutSubscribable<{
        message: string;
        url: string;
        line: number;
    }>;
    class ConsoleLogger implements ILogger {
        constructor();
        info(message: string, eventSource: string, data: any): void;
        error(message: string, eventSource: string, data: any): void;
        warn(message: string, eventSource: string, data: any): void;
        private format(message, eventSource);
    }
    class NullLogger implements ILogger {
        info(message: string, eventSource: string, data: any): void;
        error(message: string, eventSource: string, data: any): void;
        warn(message: string, eventSource: string, data: any): void;
    }
}

/// <reference path="Global.refs.d.ts" />
declare module DataLab.Util {
    interface IDisposable {
        dispose(): void;
        registerForDisposal(...disposables: IDisposable[]): any;
        disposableId: string;
    }
    var reduceRetainingTreeVerbosity: boolean;
    class Disposable implements IDisposable {
        private parentDisposalContext;
        private objectsToDispose;
        private stack;
        private static ownershipAssertionContext;
        private static nextDisposableId;
        disposableId: string;
        constructor();
        private static createKeyFromID(val);
        /**
          * Throws an exception if a disposable isn't explicitly added to a disposal
          * context using registerForDisposable.
          * @param {() => void} contextCallback The block of code over which to make the assertion
         **/
        static assertDisposablesInContext(contextCallback: () => void): void;
        /**
          * Disposable trees must have a root. This function removes one disposable
          * from the assertDisposablesInContext's assertion. If not in such an assertion's
          * scope, this is a NOP.
         **/
        static exemptFromDiposablesInContextAssertion(disposable: DataLab.Util.IDisposable): void;
        /**
          * Adds a list of objects to dispose of when this object is disposed
          * @param {...DataLab.Util.Disposable[]} disposables the objects to dispose
          *                                       when this object is disposed
         **/
        registerForDisposal(...disposables: DataLab.Util.IDisposable[]): void;
        /**
          * Dispose of an object and any objects it owns (recursively)
         **/
        dispose(): void;
        static observableArrayOfDisposables<T extends IDisposable>(value?: T[]): KnockoutObservableArray<T>;
    }
    class DisposableSubscription extends Disposable {
        private subscription;
        constructor(subscription: KnockoutSubscription<any>);
        dispose(): void;
    }
    interface IKODisposable {
        dispose(): void;
    }
    class DisposableKnockoutObject extends Disposable {
        private object;
        constructor(computed: IKODisposable);
        dispose(): void;
    }
    class DisposableEventListener extends Disposable {
        private type;
        private element;
        private callback;
        private capture;
        constructor(element: EventTarget, type: string, callback: (e: any) => any, capture?: boolean);
        dispose(): void;
    }
    /**
      * A disposable timer that can be used multiple times. Will be cancelled if it is disposed prematurely.
     **/
    class DisposableTimer extends Disposable {
        private timerHandle;
        private callback;
        private defaultDuration;
        /**
          * Creates and sets a disposable timer
          * @constructor
          * @this {DisposableTimer}
          * @param {number} msec the timer delay in milliseconds.
          * @param {() => void} callback the function that will be called when the timer has elapsed
         **/
        constructor(msec: number, callback: () => void);
        /**
          * Starts the timer. If no duration is supplied, the default is used. If the timer is already
          * counting down, the existing one is cancelled and a new countdown is started.
          * @param {number} msec the timer delay in milliseconds (if not provided, the default is used)
         **/
        start(msec?: number): void;
        /**
          * Cancels the timer and stops the execution of the callback function.
         **/
        cancel(): void;
        isCountingDown(): boolean;
        dispose(): void;
    }
    class DisposableKOApplyBindings extends Disposable {
        private element;
        constructor(viewModel: any, element: HTMLElement);
        dispose(): void;
    }
    class DisposableSetHTML extends Disposable {
        private element;
        constructor(element: HTMLElement, innerHTML: string);
        /** The contract we have is one control per node, so we can just remove all child nodes.
          * This is significantly easier than trying to track nodes across multiple changes to
          * innerHTML.
         **/
        dispose(): void;
    }
}

declare module DataLab.Util.Str {
    function getArrayFromCommaSeparatedString(userEnteredColumns: string): string[];
}

interface FileDisambiguator extends File {
}
declare module DataLab.Util.File {
    function readDataUrlFromBlob(blob: Blob): Promise<string>;
}

/// <reference path="DateFormatter.d.ts" />
/// <reference path="ObjectWithId.d.ts" />
/// <reference path="Disposable.d.ts" />
/// <reference path="UtilString.d.ts" />
/// <reference path="UtilFile.d.ts" />
declare module DataLab.Util {
    var minDate: number;
    interface IPromiseCallback<T> {
        (result: T): void;
    }
    interface Promise<T> {
        typeCheck?: T;
        done(...callbacks: IPromiseCallback<T>[]): Promise<T>;
        fail(callback: (error: Error) => void): Promise<T>;
        then<U>(doneCallback: (value: T) => Promise<U>, failCallback?: (error: Error) => any, progressCallback?: (...args: any[]) => any): Promise<U>;
        then<U>(doneCallback: (value: T) => U, failCallback?: (error: Error) => any, progressCallback?: (...args: any[]) => any): Promise<U>;
        always(...callbacks: IPromiseCallback<T>[]): Promise<T>;
        state: () => string;
    }
    interface IProgressCallback {
        (progress: ProgressEvent): void;
    }
    /** A promise which will additionally generate progress events. The progress callbacks accept a {ProgressEvent}, as generated by XHR.
        See http://www.w3.org/TR/progress-events/ */
    interface IProgressPromise<T> extends Promise<T> {
        progress(...callbacks: IProgressCallback[]): IProgressPromise<T>;
    }
    interface Deferred<T> extends Promise<T> {
        reject(error: Error): any;
        resolve(...args: any[]): any;
        promise(): any;
    }
    interface IMap<T> {
        [key: string]: T;
    }
    /**
     * An error class specifically for failed AJAX requests.
     */
    class AjaxError implements Error {
        private error;
        xmlHttpRequest: XMLHttpRequest;
        constructor(message?: string, xhr?: XMLHttpRequest);
        name: string;
        message: string;
        toString(): string;
    }
    /**
      * This function makes an opt-out-of-failure promise from a $.when. There are two usages:
      *    when(value) - returns an already-resolved promise with the given value
      *    when(promises...) - returns an opt-out promise for the completion of all given promises (like $.when).
      * In the second usage, all parameters must be jQuery promises / DataLab.Util.Promises.
      * Note that $.when does not have that restriction.
      * @param {...any[]} ...deferredList the arguments to $.when. Note that this function assumes
      *   that any object responding to fail, done, and always is a promise because JQuery doesn't
      *   allow checking via instanceof; passing objects with these methods named fail, done, and always
      *   that are not promises has undefined results. Should any parameter be a deferred that has already
      *   rejected, this Util.when will ALWAYS throw an exception that cannot be opted out of.
     **/
    function when<T>(...deferredList: T[]): Promise<T>;
    /**
      * This function makes an opt-out-of-failure promise from a JQueryPromise.then().
      * See JQuery promise.then() documentation for more information on arguments 1, 2, 3.
      * Passing the failCallbacks argument opts out of handling.
      * @param {JQueryPromise} promise the promise to apply .then() to. If the promise has already failed,
      *   Util.then will always result in an exception that cannot be opted out of.
      * @param {any} doneCallback the function to call upon success
      * @param {any} failCallback the function to call upon failure
      * @param {any} progressCallback the function to call on
     **/
    function then<T>(promise: Util.Promise<T>, doneCallback: (...args: T[]) => any, failCallback?: (...args: any[]) => any, progressCallback?: (...args: any[]) => any): Promise<any>;
    /**
      * Creates a Promise which will be rejected with the given Error when the stack unwinds. This allows
      * for returning immediate failures as promises such that the caller can still explicitly handle the failure.
      *
      * @param {Error} e Error to be passed to the promise's fail callbacks (which must be installed before the stack unwinds)
     **/
    function fail(e: Error): Promise<any>;
    /**
      * Creates a Promise which will be resolved with the given value. This makes it easy to mix code that needs to use Util.fail,
      * Since typescript will complain if we try to mix returning values synchronously with returning a promise with Util.fail().
      *
      * @param {value: T} value T to be passed to the promise's resolve callbacks (e.g. .then())
     **/
    function succeed<T>(value: T): Promise<T>;
    /**
      * Creates a Promise which will be resolved when ALL the promise arguments are resolved, with an array of all the resolved
      * values in the same order as the promise arguments, or rejected when ANY of the promise arguments are rejected.
      *
      * @param {...Promise<T>[]} Array of promises to aggregate
     **/
    function all<T>(...promises: Promise<T>[]): Promise<T[]>;
    /**
      * Encodes text for non-input elements. Uses Jquery .text() method to encode text on a div element that is created in memory, but it is never appended to the document.
      * @param {input} Text to be encoded.
     **/
    function encodeAsHtml(input: string): string;
    function parseJsonDate(jsonDate: string): Date;
    function replaceJsonDates(obj: Object, propertyNames: string[]): any;
    function replaceJsonDates(objs: Object[], propertyNames: string[]): any;
    function formatElapsedTime(milliseconds: number, millisecondsAfterDecimal?: number): string;
    function getElapsedTimeMilliseconds(start: Date, end: Date): number;
    function formatDate(date: Date): string;
    function formatDataSize(size: number, precision?: number): string;
    function createReadOnlyView(o: Object): Object;
    function isObjectEmpty(o: Object): boolean;
    /** Sets the global session id. This may only occur once in the application's lifetime. */
    function setSessionId(id: string): void;
    /** Gets the global session id. The session id will change at most once in the application's lifetime
        (from the default session id to one provided, such as at startup).
        @see {setSessionId} */
    function getSessionId(): string;
    function generateUID(): string;
    function tuple(...m: IObjectWithId[]): IObjectWithId;
    function randomInt(lowerInclusive: number, upperInclusive: number): number;
    interface IObservableSyncHandle {
        stopSyncing: () => void;
    }
    function forEach(obj: {}, fn: (value: any, key: string, obj: any) => void): void;
    function forEach<T>(obj: IMap<T>, fn: (value: T, key: string, obj: any) => void): void;
    function forEach<T>(obj: T[], fn: (value: T, key: number, obj: any) => void): void;
    function map(obj: {}, fn: (value: any, key: string, obj: any) => any): any[];
    function map<T>(obj: T[], fn: (value: T, key: number, obj: any) => any): any[];
    function filter(obj: {}, fn: (value: any, key: string, obj: any) => boolean): any[];
    function filter<T>(obj: T[], fn: (value: T, key: number, obj: any) => boolean): T[];
    /**
        Returns the first value in the given object or array for which the given filter function returned true.
        If no value matches but a default is provided, the default value is returned.
        If no value matches and no default is provided, an exception is thrown.
        The default filter always returns true.
    
        fn is called per enumerable key-value pair in obj as fn(value, key, obj) and should return a boolean indicating
        if the value matches. The iteration includes keys in the prototype chain and is in the same order as forEach.
    */
    function first(obj: {}, fn?: (value: any, key: string, obj: any) => boolean, default_?: any): any;
    function first<T>(obj: T[], fn?: (value: T, key: number, obj: any) => boolean, default_?: T): T;
    function values(obj: {}): any[];
    function values<T>(obj: T[]): T[];
    function size(obj: {}): number;
    function size(obj: any[]): number;
    /**
      * O(1) Check if an object or array contains anything.
      * @param {any} obj the object whose soul to check for emptiness
      * @return {boolean} true if the object is empty, false if not.
     **/
    function isEmpty(obj: {}): boolean;
    function isEmpty(obj: any[]): boolean;
    function clone<T>(obj: T): T;
    function removeElementFromArray(arry: any[], element: any, throwOnNotFound?: boolean): void;
    var localStorage: Storage;
    var sessionStorage: Storage;
    function format(target: string, ...parameters: string[]): string;
    function formatWithPluralOption(num: number, textSingular: string, textPlural: string): string;
    function resurrectDashesInGUID(guid: string): string;
    function addSpaceAfterCapitals(stringToModify: string): string;
    function getAllPropertyNames(objectWithProperties: any): string[];
    function reducePrecision(value: number, maxPrecision: number): number;
    function whenTrue(value: KnockoutObservable<boolean>, parentDisposable?: DataLab.Util.IDisposable): JQueryPromise<any>;
    class StringSet {
        private items;
        private count;
        constructor(initialItems?: string[]);
        size: number;
        add(item: string): boolean;
        has(item: string): boolean;
        delete(item: string): void;
        clear(): void;
        forEach(func: (value: string, key?: string, setObj?: StringSet) => void): void;
        map<T>(func: (value: string, key?: string, setObj?: StringSet) => T): T[];
        exceptWith(elements: string[]): void;
        unionWith(elements: string[]): void;
        overlaps(elements: string[]): boolean;
        setEqual(elements: string[]): boolean;
        toArray(): string[];
    }
    function initializeTemplateIfNecessary(templateElementId: string, htmlMarkup: string, dependancy?: {
        componentName: string;
        viewModel: any;
        template: any;
    }[]): string;
    function registerComponent(componentName: string, viewModel: any, template: any): void;
    function param(obj: any): string;
    function megaBytesToBytes(mB: number): number;
    function getBytesEncodedInBase64String(base64Text: string): number;
    function deferredComputed<T>(readFunc: () => T): KnockoutComputed<T>;
    function getQueryParamValueAndRemoveIfPresent(key: string): any;
    function escapeRegExpString(stringToEscape: string): string;
}

/// <reference path="Util.d.ts" />
declare module DataLab {
    interface IObjectWithId {
        id: string;
    }
    class ObjectWithId implements IObjectWithId {
        id: string;
        constructor(id?: string);
    }
}

/// <reference path="Disposable.d.ts" />
declare module DataLab {
    enum CollectionChangeType {
        add = 0,
        replace = 1,
        remove = 2,
    }
    interface ICollectionChange<T> {
        type: CollectionChangeType;
        key: string;
        oldValue: T;
        newValue?: T;
    }
    interface IObservableMapTransform {
        (item: any, key: string): any;
    }
    interface IObservableMapItemHandler {
        (item: any, key: string): void;
    }
    interface IObservableMap<T> extends KnockoutSubscribable<T> {
        (): {
            [key: string]: T;
        };
        lookup(key: string): T;
        contains(key: string): boolean;
        subscribeToCollectionChanges(callback: (value: ICollectionChange<T>) => void): KnockoutSubscription<any>;
        transform(transform: IObservableMapTransform): any;
        forEach(lambda: (item: T, key: string) => void): void;
        keys(): string[];
        /**
          * The number of items in the observable map.
         **/
        count: KnockoutObservable<number>;
        /**
          * True iff the observable is being used in a modify block
         **/
        isInModifyBlock: KnockoutObservable<boolean>;
        /**
          * Batch multiple edits into a single update. If the map is a map union, it will batch updates from
          * all of its children.
         **/
        modify(callback: () => void): any;
        /**
          * Return the underlying observable so you can call valueWillMutate and valueHasMutated.
         **/
        observable: IKOObservableInternal;
        /**
          * Put an object with key into the map
          * @param {string} key the key to associate with the object
          * @param {any} value the object to put into the map
         **/
        put(key: string, value: T): void;
        /**
          * Remove the object with key from the map
          * @param {string} key the key of the object to remove
         **/
        remove(key: string): void;
        /**
          * Removes all items from the observable map
         **/
        clear(): void;
    }
    interface IDisposableObservableMap<T> extends IObservableMap<T>, DataLab.Util.IDisposable {
        dispose(): void;
        registerForDisposal(...disposables: DataLab.Util.Disposable[]): any;
        disposableId: string;
    }
    interface IKOObservableInternal extends KnockoutObservable<any> {
        valueWillMutate(): void;
        valueHasMutated(): void;
    }
    function observableMap<T>(): IObservableMap<T>;
    function observableMapUnion<T>(...maps: IObservableMap<T>[]): IDisposableObservableMap<T>;
}

/// <reference path="../ExperimentEditor/TypescriptLib/Knockout.d.ts" />
/// <reference path="../ExperimentEditor/TypescriptLib/Knockout-extensions.d.ts" />
/// <reference path="../ExperimentEditor/TypescriptLib/UxFxScript.d.ts" />
/// <reference path="../../../External/Typescript/jquery.d.ts" />
/// <reference path="Constants.d.ts" />
/// <reference path="DateFormatter.d.ts" />
/// <reference path="Logging.d.ts" />
/// <reference path="ObjectWithId.d.ts" />
/// <reference path="ObservableMap.d.ts" />
/// <reference path="Util.d.ts" />
/// <reference path="UtilString.d.ts" />
/// <reference path="Disposable.d.ts" />
/// <reference path="LocalizedResources.d.ts" />

declare module DataLab.DataContract {
    interface DataTableFeatures {
        name: string;
        index: number;
        elementType: string;
        featureType: string;
    }
    interface DataTable {
        records: any[];
        features: DataTableFeatures[];
        name: string;
        numberOfRows: number;
        numberOfColumns: number;
    }
    function isNumericFeature(featureType: string): boolean;
}

/// <reference path="Global.refs.d.ts" />
/// <reference path="Contracts/Common/VisualizationContracts.d.ts" />
declare module DataLab.Util {
    function convertCsvToDataTable(csv: string): DataLab.DataContract.DataTable;
    function calculateStats(datatable: DataContract.DataTable): DataContract.DataTable;
}

/// <reference path="Global.refs.d.ts" />
declare module DataLab.Util {
    /** A PromiseQueue serializes a dynamic set of asynchronous actions (of the form () => Promise). When
        an action reaches the head of the PromiseQueue, it is called (returning a promise). When
        that promise succeeds or fails, it is removed from the queue. */
    class PromiseQueue {
        private queue;
        /** Queues an asynchronous action. When at the head of the queue, the action is called (generating a promise).
            The returned promise completes when the queued action has reached the head of the queue and completed.

            Promise handlers (done, fail, etc.) which are immediately installed (i.e. within the same call stack
            as 'enqueue') are guaranteed to execute before the next operation in the queue is started.
            */
        enqueue<T>(action: () => Util.Promise<T>): Util.Promise<T>;
        private onCurrentQueueItemCompleted();
        /**
          * Returns the number of promises currently in the queue
          * @return {number} the number of promises currently in the queue
         **/
        size(): number;
    }
}

declare module DataLab.Model {
    module WellKnownDataTypeIds {
        var Any: string;
    }
    class DataType {
        dataTypeId: string;
        name: string;
        description: string;
        fileExtension: string;
        allowUpload: boolean;
        allowPromotion: boolean;
        allowModelPromotion: boolean;
        constructor(dataTypeId: string);
        areSame(other: DataType): boolean;
        acceptsConnectionFrom(other: DataType): boolean;
        toString(): string;
    }
}

/// <reference path="../Global.refs.d.ts" />
declare module DataLab.Model {
    class Resource {
        id: string;
        created: Date;
        familyId: string;
        serviceVersion: number;
        isLatest: KnockoutObservable<boolean>;
        category: string;
        description: KnockoutObservable<string>;
        name: KnockoutObservable<string>;
        constructor(id: string, created?: Date, familyId?: string, serviceVersion?: number);
    }
    class DataResource extends Resource {
        dataType: DataType;
        filename: string;
        downloadLocation: DataContract.IEndpoint;
        owner: string;
        experimentId: string;
        moduleId: string;
        outputName: string;
        constructor(id: string, dataType: DataType, created?: Date, familyId?: string, serviceVersion?: number);
    }
}

/// <reference path="../../Util.d.ts" />
declare module DataLab.DataContract {
    interface IHasSchema {
        SchemaVersion: number;
    }
    interface IAddDatasourceRequest_Base {
        DataSource: IExperimentDataResource_Submission;
    }
    interface IAddDatasourceRequest_Promote extends IAddDatasourceRequest_Base {
        OutputName: string;
        ModuleNodeId: string;
        ExperimentId: string;
    }
    interface IAddDatasourceRequest_Uploaded extends IAddDatasourceRequest_Base {
        UploadId: string;
        UploadedFromFilename: string;
        ClientPoll?: boolean;
    }
    interface IAddDatasourceRequest_Reference extends IAddDatasourceRequest_Base {
        DataSourceUri: string;
    }
    interface IBuildCustomModulePackageRequest_Uploaded extends IResourceUploadInfo {
        ClientPoll?: boolean;
    }
    interface IAddTrainedModelRequest_Base {
        TrainedModel: IExperimentDataResource_Submission;
    }
    interface IAddTrainedModelRequest_Promote extends IAddTrainedModelRequest_Base {
        OutputName: string;
        ModuleNodeId: string;
        ExperimentId: string;
    }
    interface IAddTransformRequest_Base {
        Transform: IExperimentDataResource_Submission;
    }
    interface IAddTransformRequest_Promote extends IAddTransformRequest_Base {
        OutputName: string;
        ModuleNodeId: string;
        ExperimentId: string;
    }
    interface IResourceUploadInfo {
        Id: string;
        DataTypeId: string;
        ContentType: string;
        Endpoint: IEndpoint;
        /** Indicates if the resource has been committed as a dataset / module */
        Committed: boolean;
    }
    interface IInterfaceToken {
        PortType: string;
        DataTypeId: string;
        Label: string;
    }
    interface IDatatype {
        CreatedDate: string;
        Description: string;
        Id: string;
        Name: string;
        FileExtension?: string;
        AllowUpload?: boolean;
        AllowPromotion?: boolean;
        AllowModelPromotion?: boolean;
    }
    /** Base interfaces for versioned resources (e.g. modules and datasets) */
    interface IResource {
        Id: string;
        FamilyId: string;
        ServiceVersion: number;
        IsLatest: boolean;
    }
    /** Represents the components of the ID of a resource (e.g. a module or dataset).
        Each resource's ID indicates its owning workspace and version family as well
        as a workspace-unique instance ID. A string representation of a resource ID
        can be parsed via {@see parseResourceId}.
        
        Note that familyId and instanceId should be considered unique within a workspace (but not necessarily globally).
    */
    interface IResourceId {
        workspaceId: string;
        familyId: string;
        instanceId: string;
    }
    /** Parses a string representation of a resource (module / dataset) ID (of the form workspace.family.instance). */
    function parseResourceId(resourceId: string): IResourceId;
    /** Parses a string representation of a resource ID ({@see parseResourceId}) and validates that it contains an expected family ID.
        An exception is thrown if the IDs do not agree. */
    function parseResourceIdAndValidateFamily(resourceId: string, expectedFamilyId: string): IResourceId;
    /** Returns a variant of a resource's family ID that is globally unique (i.e. across workspaces). */
    function createGloballyUniqueFamilyId(parsedResourceId: IResourceId): string;
}

declare module DataLab.DataContract {
    interface IModuleNodeParameter {
        Name: string;
        Value: string;
        ValueType: string;
        LinkedValue?: any;
        ChildParameters?: v2.IModeValueInfoMap;
        LinkedGlobalParameter?: string;
    }
    interface IEndpoint {
        BaseUri: string;
        IsDirectory: boolean;
        Name: string;
        Location: string;
        AccessCredential: string;
        Size: number;
        IsAuxiliary: boolean;
    }
}

/// <reference path="Common.d.ts" />
/// <reference path="GraphNode.d.ts" />
declare module DataLab.DataContract {
    interface IExperimentDataResource_Submission {
        DataTypeId: string;
        Name: string;
        Description: string;
        FamilyId: string;
        SourceOrigin?: string;
    }
    interface IExperimentDataResource extends IExperimentDataResource_Submission, IResource {
        Size: number;
        CreatedDate: string;
        Owner: string;
        DownloadLocation: IEndpoint;
        UploadedFromFilename?: string;
        PromotedFrom?: string;
    }
    interface IExperimentDataset extends IExperimentDataResource {
        VisualizeEndPoint?: DataLab.DataContract.IEndpoint;
        SchemaEndPoint?: DataLab.DataContract.IEndpoint;
        SchemaStatus?: string;
    }
    function deserializeDataset(dataset: IExperimentDataset, dataTypeRegistry: Model.DataTypeRegistry): DataLab.Model.Dataset;
    function deserializeTrainedModel(dataResource: IExperimentDataResource, dataTypeRegistry: Model.DataTypeRegistry): DataLab.Model.TrainedModel;
    function deserializeTransformModule(dataResource: IExperimentDataResource, dataTypeRegistry: Model.DataTypeRegistry): DataLab.Model.Transform;
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="DataType.d.ts" />
/// <reference path="Resource.d.ts" />
/// <reference path="../Contracts/Common/DataResource.d.ts" />
declare module DataLab.Model {
    class Dataset extends DataResource {
        visualizeEndPoint: DataLab.DataContract.IEndpoint;
        schemaEndPoint: DataLab.DataContract.IEndpoint;
        schemaStatus: string;
        constructor(id: string, dataType: DataType, created?: Date, familyId?: string, serviceVersion?: number, visualizeEndPoint?: DataLab.DataContract.IEndpoint, schemaEndPoint?: DataLab.DataContract.IEndpoint, schemaStatus?: string);
    }
}

/// <reference path="../Global.refs.d.ts" />
declare module DataLab.Model {
    interface IConnectionEventArgs {
        input: Port;
        output: Port;
    }
    interface IConnectionEvent extends KnockoutSubscribable<IConnectionEventArgs> {
        subscribe(callback: (args: IConnectionEventArgs) => void, callbackTarget?: any, event?: string): KnockoutSubscription<any>;
        notifySubscribers(valueToNotify: IConnectionEventArgs): void;
    }
    interface IExperimentEventAggregator {
        connectionAdded: IConnectionEvent;
        connectionRemoved: IConnectionEvent;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="../Constants.d.ts" />
/// <reference path="../Contracts/Common/GraphNode.d.ts" />
/// <reference path="DataType.d.ts" />
/// <reference path="GraphNode.d.ts" />
/// <reference path="ExperimentEvents.d.ts" />
declare module DataLab.Model {
    module Constants.PortState {
        var Compatible: string;
        var Incompatible: string;
        var Default: string;
        var Replaceable: string;
        var CompatibleSnapped: string;
        var Selected: string;
        var Connected: string;
    }
    module Constants {
        var PortClass: string;
    }
    interface IPort_Internal {
        setParent(parent: GraphNode): void;
    }
    class Port extends ObjectWithId implements IPort_Internal {
        descriptor: ModulePortDescriptor;
        ordinal: number;
        outputEndpoint: DataContract.IEndpoint;
        parent: GraphNode;
        connectedPorts: DataLab.IObservableMap<Port>;
        connectedWebServicePorts: KnockoutComputed<Port[]>;
        connectedNonWebServicePorts: KnockoutComputed<Port[]>;
        connectionAdded: IConnectionEvent;
        connectionRemoved: IConnectionEvent;
        isConnected: KnockoutComputed<boolean>;
        isWebServicePort: boolean;
        constructor(descriptor: ModulePortDescriptor, ordinal?: number);
        name: string;
        friendlyName: string;
        optional: boolean;
        setParent(parent: GraphNode): void;
        isConnectedTo(other: Port): boolean;
        compatibilityWithPort(other: Port): string;
        disconnect(ports?: Port[]): void;
        disconnectFrom(other: Port): void;
        connectTo(other: Port): void;
        isCompatible(other: Port): boolean;
        /**
         * Returns true if this port outputs or accepts data that is a Dataset and can be set as a port for publish.
         */
        isDatasetDataType(): boolean;
    }
    class InputPort extends Port {
        connectionIsInCycle: KnockoutObservable<boolean>;
        dirtyStatusInfo: Util.Dirtyable;
        dirtyDraftState: Util.Dirtyable;
        isInputPortForPublish: KnockoutObservable<boolean>;
        publishIcon: string;
        constructor(descriptor: ModulePortDescriptor, ordinal?: number);
        connectedOutputPort: OutputPort;
        compatibilityWithPort(other: Port): string;
        connectTo(other: Port): void;
        /**
         * Compares this to a provided clean input port and dirties this if they are not equal for the sake of status updating
         */
        dirtyIfNeeded(cleanPort: InputPort): void;
    }
    class OutputPort extends Port {
        visualizationEndpoint: DataLab.DataContract.IEndpoint;
        schemaEndpoint: DataLab.DataContract.IEndpoint;
        isOutputPortForPublish: KnockoutObservable<boolean>;
        publishIcon: string;
        trainGenericModelIcon: string;
        compatibilityWithPort(other: Port): string;
        connectTo(other: Port): void;
        /**
         * Returns true if this output port is of type Dataset, DataTableDotNet, or ILearnerDotNet and can be visualized.
         */
        isVisualizable(): boolean;
        isTrainModulePort(): boolean;
        isTransformPort(): boolean;
        isTransformProducerPort(): boolean;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="Port.d.ts" />
/// <reference path="../Validation.d.ts" />
/// <reference path="../Util.d.ts" />
declare module DataLab.Model {
    interface IPortMap {
        [portName: string]: Port;
    }
    interface IInputPortMap {
        [portName: string]: InputPort;
    }
    interface IOutputPortMap {
        [portName: string]: OutputPort;
    }
    class GraphNode extends ObjectWithId {
        x: KnockoutObservable<number>;
        y: KnockoutObservable<number>;
        height: KnockoutObservable<number>;
        width: KnockoutObservable<number>;
        comment: KnockoutObservable<string>;
        commentCollapsed: KnockoutObservable<boolean>;
        balloonMessage: KnockoutObservable<string>;
        ports: IPortMap;
        outputPorts: IOutputPortMap;
        inputPorts: IInputPortMap;
        parent: Experiment;
        dirtyDraftState: Util.Dirtyable;
        dirtySinceLastRun: Util.Dirtyable;
        dirtyForPublish: Util.Dirtyable;
        constructor(ports: Port[], id?: string);
        /**
          * Validate the graph node.
          * @return {string} a string containing the error or null if no error exists
         **/
        validate(): DataLab.Validation.IObjectError[];
        startValidating(): void;
        name: string;
        remove(): void;
        description: string;
        owner: string;
        replaceWith(other: GraphNode, incompatibleConnections: {
            [startPort: string]: Port[];
        }): void;
        /** Subclasses can override this to copy over additional information when this node is being replaced with another
            (possibly of a different type). */
        _onReplacing(other: GraphNode): void;
        private onPortConnectionAdded(e);
        private onPortConnectionRemoved(e);
    }
}

/// <reference path="Global.refs.d.ts" />
/// <reference path="Model/GraphNode.d.ts" />
declare module DataLab.Validation {
    interface IValidationInterface {
        startValidating(): void;
        isValid(): boolean;
    }
    interface IValidatableObservable extends KnockoutObservable<any>, IValidatable, IValidationInterface {
        errorMessage: KnockoutObservable_ReadOnly<string>;
        isValid: KnockoutObservable<boolean>;
    }
    /**
      * Creates a validatable observable that automatically validates its value and puts any error messages
      * in its errorMessage observable.
      * @param {string} val the initial value for the validatable observable
      * @param {(T) => string} the validate function that validates its parameter and returns a string
      *     containing the error or null if no error exists.
     **/
    function validatableObservable<T>(val: T, validationFunction: (val: T) => string): any;
    /**
      * Creates a validatable observable that automatically validates its value and puts any error messages
      * in its errorMessage observable.
      * @param {KnockoutObservable<T>} val an existing observable, such as an KnockoutComputed
      * @param {(T) => string} the validate function that validates its parameter and returns a string
      *     containing the error or null if no error exists.
     **/
    function validatableObservable<T>(val: KnockoutObservable<T>, validationFunction: (val: T) => string): any;
    interface IValidator {
        /**
          * Validates a value as correct or incorrect according to some rules
          * @param {string} val the value to evaluate
          * @return {string} null if no error or a string containing the error message if invalid
         **/
        validate(val: string): string;
    }
    interface IValidatable {
        /**
          * Validate the state of a single object and its children, returning all errors.
          * @return {string[]} an array of all errors that exist on the object or [] if no errors occur.
         **/
        validate(): string[];
        /**
          * IValidatables are arranged in a heirarchy and don't validate until the user interacts for
          * them for the first time, such as deselecting a module or bluring a property. After such
          * an interaction, each IValidatable and all of its child IValidatables should start validation.
          * Once started, validation continues for the lifetime of the object.
         **/
        startValidating(): void;
    }
    interface IObjectError {
        erroneousObject: any;
        errorMessages: string[];
    }
    interface IExperimentValidatable {
        /**
          * Validate the state of a single object and all of its children, returning all errors as a
          * pair of what the error occurred on and what its errors were.
          * @return {IObjectError[]} an array containing the errors on this object and its children
         **/
        validate(): IObjectError[];
        /**
          * IValidatables are arranged in a heirarchy and don't validate until the user interacts for
          * them for the first time, such as deselecting a module or bluring a property. After such
          * an interaction, each IValidatable and all of its child IValidatables should start validation.
          * Once started, validation continues for the lifetime of the object.
         **/
        startValidating(): void;
    }
    class PropertyMinValidator implements IValidator {
        private min;
        /**
          * @constructor
          * Validates that a value is greater than or equal to a minimum value.
          * @param {number} min the minimum value a valid value can be.
         **/
        constructor(min: number);
        /**
          * Verifies that value is >= the minimum the validator allows.
          * @param {string} value the value to evaluate
          * @return {string} the error message if value is NaN or less than the minimum or null if
          *                  the value is valid
          * @see IPropertyValidator
         **/
        validate(value: string): string;
    }
    class PropertyMaxValidator implements IValidator {
        private max;
        /**
          * @constructor
          * Validates that a value is less than or equal to a maximum value.
          * @param {number} max the maximum value a valid value can be.
         **/
        constructor(max: number);
        /**
          * Verifies that value is <= the maximum the validator allows.
          * @param {string} value the value to evaluate
          * @return {string} the error message if value is NaN or greater than the maximum or null if
          *                  the value is valid
          * @see IPropertyValidator
         **/
        validate(value: string): string;
    }
    class PropertyValuesValidator implements IValidator {
        private allowedValues;
        /**
          * @constructor
          * Validates that a given value exists in a set of values.
          * @param {string[]} requiredValues the set of values in which a validated value should reside.
         **/
        constructor(allowedValues: DataLab.Model.ChoiceParameterValue[]);
        /**
          * Verifies that value is in the set of required values.
          * @param {string} value the value to evaluate
          * @return {string} the error message if the value is not in the set or null if
          *                  the value is valid
          * @see IPropertyValidator
         **/
        validate(value: string): string;
    }
    class RequiredValueValidator implements IValidator {
        /**
          * Verifies a value is given.
          * @param {string} value the value to ensure is provided
          * @return {string} "Value required." if the value is missing or null otherwise.
          * @see IPropertyValidator
         **/
        validate(value: string): string;
    }
    class IntegerValidator implements IValidator {
        /**
          * Verifies whether a given value is a valid integer (i.e. optional + or -, digits only).
          * @param {string} value the string to validate
          * @return {string} the error message if the value is not an integer, or null if valid.
         **/
        validate(value: string): string;
    }
    class FloatValidator implements IValidator {
        /**
          * Verifies whether a given value is a valid floating point number.
          * @param {string} value the string to validate
          * @return {string} the error message if the value is not a float, or null if valid.
         **/
        validate(value: string): string;
    }
    class WorkspaceNameValidator implements IValidator {
        /**
          * Verifies whether a given workspace name is valid.
          * @param {string} the string to validate
          * @return {string} the error message if the string is empty or contains invalid characters,
          *                  or null if the value is valid
          *
         **/
        validate(value: string): string;
    }
}

/// <reference path="../Global.refs.d.ts" />
declare module DataLab.Model {
    interface IProperty {
        value: KnockoutObservable<any>;
        name: string;
        label: string;
        tooltip: string;
    }
    class StaticProperty implements IProperty {
        value: KnockoutObservable<any>;
        name: string;
        label: string;
        tooltip: string;
        constructor(name: string, value: KnockoutObservable<any>);
    }
    class EditableTextProperty extends StaticProperty {
        placeholderText: string;
        constructor(name: string, placeholderText: string, value: KnockoutObservable<any>, experiment: Experiment);
    }
    class LinkProperty extends StaticProperty {
        constructor(name: string, value: string);
    }
    class ButtonProperty extends StaticProperty {
        constructor(name: string, value: string);
    }
    class EndpointProperty extends LinkProperty {
        endpoint: KnockoutObservable<DataLab.DataContract.IEndpoint>;
        /**
          * @constructor
          * Makes an endpoint property, which has the endpoint's URL as its value
          * @param {KnockoutObservable} endpoint
         **/
        constructor(name: string, endpoint: KnockoutObservable<DataLab.DataContract.IEndpoint>);
    }
    class DisplayEndpointProperty extends ButtonProperty {
        endpoint: KnockoutObservable<DataLab.DataContract.IEndpoint>;
        id: DataLab.Constants.DisplayEndpointType;
        /**
          * @constructor
          * Makes a displayEndpoint property, which has the endpoint's URL as its value and an ID wich can be used to id the view model and view that should be used to display it
          * @param {KnockoutObservable} endpoint
         **/
        constructor(name: string, id: DataLab.Constants.DisplayEndpointType, endpoint: KnockoutObservable<DataLab.DataContract.IEndpoint>);
    }
    class BooleanProperty implements StaticProperty {
        value: KnockoutObservable<boolean>;
        name: string;
        label: string;
        tooltip: string;
        constructor(name: string, label: string, tooltip: string, value: KnockoutObservable<boolean>, experiment: Experiment);
    }
}

/// <reference path="../Global.refs.d.ts" />
declare module DataLab.Model.CredentialStore {
    var storeClient: DataLab.DataContract.Client;
    function initialize(client: DataLab.DataContract.IResourceClient): void;
    function listCredentials(): Util.Promise<DataContract.ICredentialKeyParts[]>;
    function verifyCredential(credential: DataContract.ICredentialKeyParts): Util.Promise<boolean>;
}

/// <reference path="Common.d.ts" />
/// <reference path="GraphNode.d.ts" />
/// <reference path="../../Model/ModuleParameterDescriptor.d.ts" />
declare module DataLab.DataContract {
    interface IPortDescriptor {
        IsOptional: boolean;
        MarkupType: number;
        Name: string;
        FriendlyName: string;
    }
    interface IPortDescriptor_Output extends IPortDescriptor {
        Type: IDatatype;
    }
    interface IPortDescriptor_Input extends IPortDescriptor {
        Types: IDatatype[];
    }
    interface IModuleModeSetting {
        InterfaceString?: string;
        Parameters: IModuleParameterDescriptor[];
        DisplayValue?: string;
    }
    interface IModeValueInfo extends IModuleModeSetting {
    }
    interface IModuleParameterRule {
        Min?: number;
        Max?: number;
        Values?: string[];
    }
    interface ICredentialDescriptor {
        CredentialType: string;
        CredentialKeyParts: string[];
    }
    interface INameValuePair {
        Name: string;
        Value: string;
    }
    interface ICredentialKeyParts {
        Type: string;
        Parts: INameValuePair[];
    }
    interface ISaveCredentialRequest {
        KeyParts: ICredentialKeyParts;
        SecretName: string;
        SecretValue: string;
    }
    interface IModuleParameterDescriptor {
        DefaultValue: string;
        HasDefaultValue: boolean;
        HasRules: boolean;
        MarkupType: number;
        IsOptional: boolean;
        Name: string;
        FriendlyName: string;
        ParameterRules: IModuleParameterRule[];
        ParameterType: string;
        ColumnPickerFor?: string;
        SingleColumnSelection?: boolean;
        ColumnSelectionCategories?: string[];
        ModeValuesInfo?: {
            [key: string]: IModeValueInfo;
        };
        CredentialDescriptor: ICredentialDescriptor;
        ScriptName?: string;
        IsInt?: boolean;
        MinLimit?: number;
        MaxLimit?: number;
        SliderMin?: number;
        SliderMax?: number;
        IsLog?: boolean;
    }
    interface IModuleInterface extends IModuleModeSetting {
        InputPorts: IPortDescriptor_Input[];
        OutputPorts: IPortDescriptor_Output[];
    }
    interface IExperimentModule extends IResource {
        Category: string;
        CloudSystem: string;
        CreatedDate: string;
        Description: string;
        EscalationEmail: string;
        InformationUrl: string;
        InterfaceString: string;
        IsDeterministic: boolean;
        Name: string;
        Owner: string;
        ClientVersion?: string;
        ServiceVersion: number;
        ModuleInterface: IModuleInterface;
        ScriptsDefaultContents: {
            Name: string;
            Value: string;
        }[];
    }
    function deserializeModule(module_: IExperimentModule, dataTypeRegistry: Model.DataTypeRegistry): DataLab.Model.Module;
    function deserializeModuleParameterDescriptor(parameterDef: IModuleParameterDescriptor, scriptDefaults?: {
        [scriptName: string]: string;
    }, cloudSystemString?: string): Model.ModuleParameterDescriptor;
    function deserializeModeValuesInfo(modeValuesInfo: {
        [key: string]: IModeValueInfo;
    }): {
        [key: string]: Model.ModeValueInfo;
    };
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="../Validation.d.ts" />
/// <reference path="Property.d.ts" />
/// <reference path="CredentialStore.d.ts" />
/// <reference path="ModuleParameterDescriptor.d.ts" />
/// <reference path="../Contracts/Common/Module.d.ts" />
declare module DataLab.Model {
    interface ILinkableParameter {
        isLinked(): boolean;
    }
    /** Base class for experiment and node-level parameters. **/
    class Parameter extends ObjectWithId implements IProperty, Validation.IValidatable {
        descriptor: ModuleParameterDescriptor;
        value: Validation.IValidatableObservable;
        autocompleteArray: KnockoutObservableArray<any>;
        constructor(descriptor: ModuleParameterDescriptor, value?: any);
        validate(): string[];
        startValidating(): void;
        label: string;
        parameterType: string;
        tooltip: string;
        name: string;
        validateValue(val: string): string;
    }
    function createModuleNodeParametersFromDescriptors(parameterDescriptors: DataLab.Model.ModuleParameterDescriptor[], parent: ModuleNode, value?: any, parentParameter?: ModuleNodeParameter, relevancyKey?: string): DataLab.Util.IMap<DataLab.Model.ModuleNodeParameter>;
    class ModuleNodeParameter extends Parameter {
        linkedWebServiceParameter: KnockoutObservable<WebServiceParameter>;
        isLinked: KnockoutObservable_ReadOnly<boolean>;
        parent: ModuleNode;
        isRelevant: KnockoutObservable<boolean>;
        childParameters: IModeValueInfoMap;
        dirtyStatusInfo: Util.Dirtyable;
        dirtyDraftState: Util.Dirtyable;
        constructor(descriptor: ModuleParameterDescriptor, parent: ModuleNode, value?: any, parentParameter?: ModuleNodeParameter, relevancyKey?: string);
        linkToWebServiceParameter(webServiceParameter: WebServiceParameter): void;
        /** Unlinks this parameter from the linked {WebServiceParameter}.
            Note that the lifetime of a {ModuleNodeParameter} is at least as long as that of any linked parameter.
            When a {ModuleNodeParameter} is removed from an experiment graph, it should be unlinked(). */
        unlink(): void;
        /** Unlinks this parameter if it is currently linked. Otherwise, no change is made. */
        ensureUnlinked(): void;
        /**
         * Compares this to a provided clean parameter and dirties this if they are not equal for the sake of status updating.
         */
        dirtyIfNeeded(cleanParam: ModuleNodeParameter): void;
    }
    module Constants.CredentialParameter {
        var credentialVerificationTimeout: number;
    }
    module Constants.Key {
        var Return: number;
    }
    class CredentialParameter extends ModuleNodeParameter {
        isDirty: boolean;
        credentialKeyParts: IProperty[];
        credentialType: string;
        private outerRequest;
        private activeRequests;
        private requestsBlocked;
        constructor(descriptor: CredentialModuleParameterDescriptor, parent: ModuleNode, value: any, parentParameter: ModuleNodeParameter, relevancyKey: string, nodeParameters: IModuleNodeParameterMap);
        private sendRequest(keyParts);
        private fill();
        getSerializedValue(): string;
    }
    class WebServiceParameter extends Parameter implements ILinkableParameter {
        linkedParameters: {
            [key: string]: ModuleNodeParameter;
        };
        validatableName: Validation.IValidatableObservable;
        private static shouldRecurseValidation;
        isEditingName: KnockoutObservable<boolean>;
        hasDefaultValue: KnockoutObservable<boolean>;
        isExperimentParameter: boolean;
        /**
          * @constructor
          * Parameters to an experiment. Are linked to zero or more module parameters.
          * @param {ModuleParameterDescriptor} descriptor The descriptor for the
              parameter we're promoting this experiment from
          * @param {string} name The initial name for the parameter
          * @param {any} value The initial value for the parameter
          * @param {(name: string) => string} validateName A function that validates this parameter's
              name. If the parameter is valid, it should return null. If the parameter is invalid, it
              should return a string with the reason why it's invalid.
         **/
        constructor(descriptor: ModuleParameterDescriptor, name: string, value: any, parameterContainer: IWebServiceParameterContainer);
        /**
          * Remove the linked module parameter from the experiment parameter's linkage.
          * @param {ModuleNodeParameter} moduleParameter The parameter to unlink.
         **/
        unlink(moduleParameter: ModuleNodeParameter): void;
        /**
          * Add a module parameter to this parameter's linkage.
          * @param {ModuleNodeParameter} moduleParameter The parameter to link
         **/
        link(moduleParameter: ModuleNodeParameter): void;
        /**
          * Removes all of this experiment parameter's links to module parameters
         **/
        unlinkAll(): void;
        /**
          * Ensures that the parameter's value is valid (i.e. it's valid for all of its linked parameters).
          * This function serves as the IValidator (it just ignores its input) for WebServiceParameters' validatable
          * observable.
          * @return {string} A string containing the first validation error or null if no error occurred.
         **/
        validateValue(): string;
        textboxKeydown(data: any, event: KeyboardEvent): boolean;
        toggleEditingName(data: any, event: any): void;
        textboxBlur(data: any, event: any): void;
        /**
          * Validate that both this parameter's name and value are correct.
          * @return {string[]} An array of the errors for this parameter
         **/
        validate(): string[];
        name: string;
        label: string;
        tooltip: string;
        isLinked(): boolean;
    }
}

declare module DataLab.DataContract {
    module ModuleParameterType {
        var String: string;
        var Int: string;
        var Float: string;
        var Double: string;
        var Boolean: string;
        var Enumerated: string;
        var Script: string;
        var Mode: string;
        var Credential: string;
        var ColumnPicker: string;
        var ParameterRange: string;
    }
    module ModuleParameterValueType {
        var Literal: string;
        var GraphParameterName: string;
    }
    module State {
        var NotStarted: string;
        var Running: string;
        var Finished: string;
        var Failed: string;
        var Canceled: string;
        var InDraft: string;
    }
    module DataSourceOrigin {
        var InvalidOrigin: string;
        var FromResourceUpload: string;
        var FromExistingBlob: string;
        var FromOutputPromotion: string;
    }
    module CloudSystemTypes {
        var Exe: string;
        var Hive: string;
        var Pig: string;
        var MapReduce: string;
        var MapReduceJar: string;
        var AnalyticsFramework: string;
        var Dll: string;
        var R: string;
        var Python: string;
        var Cosmos: string;
    }
    module SchemaStatus {
        var Pending: string;
        var Complete: string;
        var NotSupported: string;
        var Failed: string;
    }
    var DataReferenceModuleFamilyId: string;
    module CancellationReason {
        var ExceededRuntimeLimit: string;
        var ExceededStorageLimit: string;
        var DatasetRestriction: string;
        var ModulesRestriction: string;
        var CustomModulesRestriction: string;
        var WebServicesRestriction: string;
        var WorkspaceTypeRestriction: string;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="Parameter.d.ts" />
/// <reference path="../Contracts/Constants.d.ts" />
/// <reference path="../Contracts/Common/Module.d.ts" />
/// <reference path="../Validation.d.ts" />
declare module DataLab.Model {
    class ChoiceParameterValue {
        displayValue: string;
        value: string;
        constructor(value: string, displayName?: string);
    }
    class ModuleParameterDescriptor {
        name: string;
        friendlyName: string;
        defaultValue: any;
        rules: DataContract.IModuleParameterRule[];
        isOptional: boolean;
        validators: Validation.IValidator[];
        type: string;
        constructor(name: string, friendlyName: string, defaultValue: any, isOptional?: boolean, rules?: DataContract.IModuleParameterRule[], choiceParameterValues?: ChoiceParameterValue[], parameterType?: string);
        validate(value: string): string;
    }
    class ChoiceModuleParameterDescriptor extends ModuleParameterDescriptor {
        choices: KnockoutObservableArray<ChoiceParameterValue>;
        constructor(name: string, friendlyName: string, isOptional: boolean, choiceParameterValues: ChoiceParameterValue[], rules?: DataContract.IModuleParameterRule[], defaultValue?: string);
        /**
          * If the given choices are "true"/"false" or "yes"/"no" (case-insensitive), then
          * the parameter is a boolean.
          * @param {string[]} choices the array of valid choices for an enumerated parameter
          */
        private static isBooleanDescriptor(choiceParameterValues);
        static CreateDescriptor(name: string, friendlyName: string, isOptional?: boolean, rules?: DataContract.IModuleParameterRule[], modeValuesInfo?: {
            [key: string]: ModeValueInfo;
        }, defaultValue?: string, isMulti?: boolean): ChoiceModuleParameterDescriptor;
    }
    class BooleanModuleParameterDescriptor extends ChoiceModuleParameterDescriptor {
        constructor(name: string, friendlyName: string, choiceParameterValues?: ChoiceParameterValue[], defaultValue?: string);
    }
    class MultiChoiceModuleParameterDescriptor extends ChoiceModuleParameterDescriptor {
        constructor(name: string, friendlyName: string, choiceParameterValues: ChoiceParameterValue[], rules?: DataContract.IModuleParameterRule[], defaultValue?: string);
    }
    class ColumnPickerModuleParameterDescriptor extends ModuleParameterDescriptor {
        columnPickerFor: string;
        singleColumnSelection: boolean;
        columnSelectionCategories: string[];
        constructor(name: string, friendlyName: string, columnPickerFor: string, singleColumnSelection: boolean, columnSelectionCategories: string[], rules?: DataContract.IModuleParameterRule[], isOptional?: boolean, defaultValue?: string);
    }
    class ParameterRangeModuleParameterDescriptor extends ModuleParameterDescriptor {
        isInt: boolean;
        minLimit: number;
        maxLimit: number;
        sliderMin: number;
        sliderMax: number;
        isLog: boolean;
        constructor(name: string, friendlyName: string, isInt: boolean, minLimit: number, maxLimit: number, sliderMin: number, sliderMax: number, defaultValue: string, isLog: boolean);
    }
    class ScriptModuleParameterDescriptor extends ModuleParameterDescriptor {
        scriptName: string;
        constructor(name: string, friendlyName: string, scriptName?: string, defaultValue?: any, isOptional?: boolean, rules?: DataContract.IModuleParameterRule[]);
    }
    class CredentialModuleParameterDescriptor extends ModuleParameterDescriptor {
        credentialDescriptor: DataContract.ICredentialDescriptor;
        constructor(credential: DataContract.ICredentialDescriptor, name: string, friendlyName: string, isOptional: boolean, rules?: DataContract.IModuleParameterRule[]);
    }
    class ModeModuleParameterDescriptor extends ChoiceModuleParameterDescriptor {
        modeValuesInfo: {
            [key: string]: ModeValueInfo;
        };
        constructor(name: string, friendlyName: string, modeValuesInfo: {
            [key: string]: ModeValueInfo;
        }, isOptional?: boolean, rules?: DataContract.IModuleParameterRule[], defaultValue?: string);
    }
    class ModeValueInfo {
        interfaceString: string;
        childParameterDescriptors: ModuleParameterDescriptor[];
        displayValue: string;
        /**
          * @constructor
          * ModeValueInfo describes an option of a mode parameter.
          * @param {string} interfaceString the interface string corresponding to selecting this mode value
          * @param {ModuleParameterDescriptor[]} childParameterDescriptors array of child parameters relevant to this mode value
          */
        constructor(interfaceString?: string, childParameterDescriptors?: ModuleParameterDescriptor[], displayValue?: string);
    }
}

/// <reference path="../Util.d.ts" />
/// <reference path="../Contracts/Common/Module.d.ts" />
/// <reference path="GraphNode.d.ts" />
/// <reference path="Module.d.ts" />
/// <reference path="Parameter.d.ts" />
/// <reference path="../Global.refs.d.ts" />
declare module DataLab.Model {
    interface IModeValueInfoMap {
        [optionValue: string]: IModuleNodeParameterMap;
    }
    interface IModuleNodeParameterMap {
        [parameterName: string]: ModuleNodeParameter;
    }
    interface IPropertyMap {
        [parameterName: string]: IProperty;
    }
    class ErrorLogInfo {
        errorMessage: KnockoutObservable<string>;
        startTime: KnockoutObservable<string>;
        endTime: KnockoutObservable<string>;
        errorId: KnockoutObservable<string>;
        hasErrorId: KnockoutComputed<boolean>;
        messageInExpectedFormat: KnockoutObservable<boolean>;
        constructor();
        updateErrorLogInfo(errorText: string, nodeName: string, nodeID: string): void;
    }
    interface IParameterFilter {
        (parameter: ModuleNodeParameter): boolean;
    }
    class ModuleNode extends GraphNode implements Validation.IExperimentValidatable {
        module_: Module;
        parameters: IModuleNodeParameterMap;
        hasParameter: (parameterFilter: IParameterFilter) => boolean;
        hasCredentials: () => boolean;
        isCustomModule: () => boolean;
        executedExperimentId: string;
        startTime: StaticProperty;
        endTime: StaticProperty;
        elapsedTime: StaticProperty;
        statusCode: StaticProperty;
        statusDetails: StaticProperty;
        outputLog: EndpointProperty;
        errorLog: DisplayEndpointProperty;
        errorLogInfo: ErrorLogInfo;
        outputEndpoints: Util.IMap<EndpointProperty>;
        isDirty: boolean;
        dirtyStatusInfo: Util.Dirtyable;
        private isValidating;
        static parameterFilterHelper(parameterMap: IModuleNodeParameterMap, parameterFilter: IParameterFilter): boolean;
        /**
          * @constructor
          * Creates a module graph node that you can add to the experiment.
          * @param {Module} module_ the definition for this module
          * @param {string} guid by default, the module will take a new unique ID. Passing this parameter overrides this behavior.
         **/
        constructor(module_: Module, workspace: DataLab.Model.Workspace, guid?: string);
        owner: string;
        /**
          * Start validation on this module and all its parameters
         **/
        startValidating(): void;
        private startValidatingAll(parameters);
        /**
          * Validates that all parameters meet constraints, and that all inputs have a connection
          * @return {string[]} an array of strings describing the errors on this module node. If no errors
          *   exist, the returned array is empty
         **/
        validate(): DataLab.Validation.IObjectError[];
        updateInfo(otherModule: ModuleNode): void;
        private validateParameters(parameters, errors);
        name: string;
        description: string;
        remove(): void;
        _onReplacing(other: GraphNode): void;
        /** Unlinks all parameters (as applicable). */
        unlinkAllParameters(): void;
        dirtyModule(visitedNodeMap?: {
            [parameterName: string]: ModuleNode;
        }): void;
        addEndpoint(endpoint: DataContract.IEndpoint): void;
        /**
         * Compares this to a provided clean module and dirties this if they are not equal for the sake of status updating.
         */
        dirtyIfNeeded(cleanModule: ModuleNode): void;
        private createParametersForModule(module_);
    }
}

declare module DataLab.Model {
    enum SchemaCorrectness {
        Accurate = 0,
        Superset = 1,
        Inaccurate = 2,
    }
    interface IColumnAttribute {
        name: string;
        type: string;
        isFeature: boolean;
        elementType?: {
            typeName: string;
            isNullable: boolean;
        };
        domain?: {
            categoryType: string;
            isNullable: boolean;
            categories: any[];
        };
        isInaccurate?: boolean;
    }
    interface IScoreColumn {
        [key: string]: string;
    }
    interface ILabelColumn {
        [key: string]: string;
    }
    interface IFeatureChannel {
        name: string;
        isNormalized: boolean;
        featureColumns: string[];
    }
    interface ISchema {
        isInaccurate?: SchemaCorrectness;
        columnAttributes: IColumnAttribute[];
        scoreColumns: IScoreColumn;
        labelColumns: ILabelColumn;
        featureChannels: IFeatureChannel[];
    }
}

/// <reference path="Common.d.ts" />
/// <reference path="Module.d.ts" />
declare module DataLab.DataContract {
    interface IGraphParameterDescriptor {
        Name: string;
        Value: string;
        ParameterDefinition: IModuleParameterDescriptor;
    }
    interface IEndpointWithKey {
        Key: string;
        Value: IEndpoint;
    }
    interface IExperimentModuleStatus {
        NodeId: string;
        OutputEndpoints: IEndpoint[];
        MetadataOutputEndpoints?: Util.IMap<IEndpointWithKey[]>;
        StandardErrorEndpoint: IEndpoint;
        StandardOutEndpoint: IEndpoint;
        Status: IExperimentExecutionStatus;
    }
    interface IExperimentExecutionStatus {
        CreationTime: string;
        EndTime: string;
        StartTime: string;
        StatusCode: string;
        StatusDetail: string;
    }
    interface IExperimentSummary {
        Creator: string;
        Description: string;
        Etag: string;
        ExperimentId: string;
        Status: IExperimentExecutionStatus;
    }
    interface IUploadContent {
        content: string;
        content_type: string;
    }
    interface IAddOrUpdateCommunityExperimentRequestPublishableExperiment {
        name: string;
        summary: string;
        description: string;
        hidden: boolean;
        tags: string[];
        image_url?: string;
        upload_image_data?: IUploadContent;
    }
    interface IAddOrUpdateCommunityExperimentRequest {
        ExperimentId: string;
        PublishableExperiment: IAddOrUpdateCommunityExperimentRequestPublishableExperiment;
    }
}

/// <reference path="Constants.d.ts" />
/// <reference path="Common/Common.d.ts" />
/// <reference path="Common/Experiment.d.ts" />
declare module DataLab.DataContract.v1 {
    interface IPublishExperimentRequest {
        Description: string;
        DataflowGraph: IExperimentGraphModel;
        ParentId: string;
    }
    interface IExperimentEdgeInternal {
        DestinationInputPortId: string;
        SourceOutputPortId: string;
    }
    interface IExperimentOutputPort {
        NodeId: string;
        Name: string;
        OutputType?: string;
    }
    interface IExperimentInputPort {
        DataSourceId?: string;
        TrainedModelId?: string;
        TransformModuleId?: string;
        Name: string;
        NodeId: string;
    }
    interface ILayoutData {
        x: number;
        y: number;
    }
    interface IExperimentModuleNode {
        Id: string;
        ModuleId: string;
        ModuleParameters: IModuleNodeParameter[];
        InputPortsInternal: IExperimentInputPort[];
        OutputPortsInternal: IExperimentOutputPort[];
        Comment?: string;
        CommentCollapsed?: boolean;
    }
    interface IExperimentPublishInfo {
        InputPortsForPublish: string[];
        OutputPortsForPublish: string[];
    }
    interface IExperimentWebServiceInfo {
        IsWebServiceExperiment?: boolean;
        Inputs?: IExperimentWebServicePort[];
        Outputs?: IExperimentWebServicePort[];
        Parameters?: IGraphParameterDescriptor[];
        WebServiceGroupId?: string;
        ModelPackageId?: string;
        SerializedClientData?: string;
    }
    interface IExperimentWebServicePort {
        Id?: string;
        PortId: string;
        Name?: string;
    }
    interface IExperimentGraphModel {
        EdgesInternal: IExperimentEdgeInternal[];
        ModuleNodes: IExperimentModuleNode[];
        SerializedClientData: string;
    }
    interface ISubmitExperimentRequest {
        Description: string;
        ExperimentGraph: IExperimentGraphModel;
        ParentExperimentId: string;
        IsDraft: boolean;
        DisableNodesUpdate?: boolean;
        WebService?: IExperimentWebServiceInfo;
        Category?: string;
    }
    interface IContainsExperimentGraph {
        Graph: IExperimentGraphModel;
        Description: string;
    }
    interface IExperimentInfo extends IContainsExperimentGraph, DataContract.IHasSchema {
        ExperimentId: string;
        ParentExperimentId: string;
        Creator: string;
        NodeStatuses: IExperimentModuleStatus[];
        Status: IExperimentExecutionStatus;
        Etag: string;
        IsArchived: boolean;
        IsLeaf: boolean;
        DisableNodesUpdate?: boolean;
        WebService?: IExperimentWebServiceInfo;
        Summary: string;
        OriginalExperimentDocumentationLink: string;
        Category?: string;
    }
    interface IDataflowInfo extends IContainsExperimentGraph {
        Id: string;
        WorkspaceId: string;
        ParentId: string;
    }
    interface IExperimentSubmissionResult {
        ExperimentId: string;
        Etag: string;
    }
    interface IExperimentStoragePackage {
        Location: string;
        Status: string;
        ItemsComplete: number;
        ItemsPending: number;
    }
    interface IExperimentPublishingResult {
        DataflowId: string;
    }
    enum SubscriptionStatus {
        Deleted = 0,
        Enabled = 1,
        Disabled = 2,
        Migrated = 3,
        Updated = 4,
        Registered = 5,
        Unregistered = 6,
    }
    interface IWorkspaceSettings {
        WorkspaceId: string;
        FriendlyName: string;
        Description: string;
        AzureStorageConnectionString: string;
        HDInsightClusterConnectionString: string;
        HDInsightStorageConnectionString: string;
        UseDefaultHDInsightSettings: boolean;
        SqlAzureConnectionString: string;
        AnalyticFrameworkClusterConnectionString: string;
        AuthorizationToken: {
            PrimaryToken: string;
            SecondaryToken: string;
        };
        Etag: string;
        Type?: string;
        OwnerEmail?: string;
        UserStorage?: string;
        SubscriptionId?: string;
        SubscriptionName?: string;
        SubscriptionState?: string;
        CreatedTime?: string;
    }
    interface IWorkspace {
        Id: string;
        FriendlyName: string;
        Description: string;
        AzureStorageConnectionString: string;
        HDInsightClusterConnectionString: string;
        SqlAzureConnectionString: string;
        AnalyticFrameworkClusterConnectionString: string;
    }
    interface IQuotaResponse {
        UsedStorage: number;
        MaximumStorage: number;
    }
    interface IAssetDependencyResponse {
        WebServiceGroups: IWebServiceGroup[];
        Experiments: IExperimentInfo[];
    }
}

/// <reference path="../Contracts/DataContractInterfaces-v1.d.ts" />
/// <reference path="GraphNode.d.ts" />
/// <reference path="Dataset.d.ts" />
/// <reference path="Experiment.d.ts" />
declare module DataLab {
    var getExperimentHash: (experimentId: string) => string;
}
declare module DataLab.Model {
    class DatasetNode extends GraphNode {
        dataset: Dataset;
        author: StaticProperty;
        size: StaticProperty;
        format: StaticProperty;
        createdOn: StaticProperty;
        viewDataset: EndpointProperty;
        constructor(dataset: Dataset, guid?: string);
        datasetPort: OutputPort;
        name: string;
        description: string;
        owner: string;
        remove(): void;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="DataType.d.ts" />
/// <reference path="Resource.d.ts" />
/// <reference path="../Contracts/Common/DataResource.d.ts" />
declare module DataLab.Model {
    class TrainedModel extends DataResource {
        constructor(id: string, dataType: DataType, created?: Date, familyId?: string, serviceVersion?: number);
    }
}

/// <reference path="../Contracts/DataContractInterfaces-v1.d.ts" />
/// <reference path="GraphNode.d.ts" />
/// <reference path="TrainedModel.d.ts" />
/// <reference path="Experiment.d.ts" />
declare module DataLab.Model {
    class TrainedModelNode extends GraphNode {
        trainedModel: TrainedModel;
        author: StaticProperty;
        format: StaticProperty;
        createdOn: StaticProperty;
        trainingExperiment: LinkProperty;
        constructor(trainedModel: TrainedModel, guid?: string);
        trainedModelPort: OutputPort;
        name: string;
        description: string;
        owner: string;
        remove(): void;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="DataType.d.ts" />
/// <reference path="Resource.d.ts" />
/// <reference path="../Contracts/Common/DataResource.d.ts" />
declare module DataLab.Model {
    class Transform extends DataResource {
        constructor(id: string, dataType: DataType, created?: Date, familyId?: string, serviceVersion?: number);
    }
}

/// <reference path="../Contracts/DataContractInterfaces-v1.d.ts" />
/// <reference path="GraphNode.d.ts" />
/// <reference path="Transform.d.ts" />
/// <reference path="Experiment.d.ts" />
declare module DataLab.Model {
    class TransformNode extends GraphNode {
        transform: Transform;
        author: StaticProperty;
        format: StaticProperty;
        createdOn: StaticProperty;
        trainingExperiment: LinkProperty;
        constructor(transform: Transform, guid?: string);
        transformPort: OutputPort;
        name: string;
        description: string;
        owner: string;
        remove(): void;
    }
}

/// <reference path="Dataset.d.ts" />
/// <reference path="Module.d.ts" />
/// <reference path="Resource.d.ts" />
/// <reference path="GraphNode.d.ts" />
/// <reference path="DatasetNode.d.ts" />
/// <reference path="ModuleNode.d.ts" />
declare module DataLab.Model {
    function createNodeForResource(resource: Module, workspace: DataLab.Model.Workspace): ModuleNode;
    function createNodeForResource(resource: Dataset, workspace: DataLab.Model.Workspace): DatasetNode;
    function createNodeForResource(resource: Resource, workspace: DataLab.Model.Workspace): GraphNode;
}

/// <reference path="Global.refs.d.ts" />
declare module DataLab.Util {
    /**
     * A Dirtyable can be dirtied or cleaned in any order and can have up to 1 parent and an array of children.
     * Calling dirty will alert subscribers to dirtied as well as dirty the parent. If startDirtying has not been called, dirty will no-op.
     * Calling clean will alert subscribers to cleaned as well as clean the children.
     */
    class Dirtyable {
        isDirty: KnockoutObservable<boolean>;
        private parent;
        private children;
        private _started;
        constructor();
        /** Links this and the child dirtyable together.*/
        addChild(child: Dirtyable): void;
        /** Notifies cleaned subscribers and cleans all children.*/
        clean(): void;
        /** If dirtying has started, notifies dirtied subscribers and dirties the parent.*/
        dirty(): void;
        /**
         * If the passed child is present in the children array, removes the child
         * from the array and removes the child's parent reference to this.
         */
        removeChild(child: Dirtyable): void;
        startDirtying(): void;
        stopDirtying(): void;
        started: boolean;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="Resource.d.ts" />
declare module DataLab.Model {
    enum WebServicePortType {
        Input = 0,
        Output = 1,
    }
    class WebServicePortNameValidator implements DataLab.Validation.IValidator {
        type: WebServicePortType;
        parent: WebServicePortNode;
        constructor(type: WebServicePortType, parent: WebServicePortNode);
        validate(val: string): string;
    }
    class WebServicePortNodeParameter extends Parameter {
        parent: WebServicePortNode;
        isLinked: KnockoutComputed<boolean>;
        constructor(descriptor: ModuleParameterDescriptor, parent: WebServicePortNode, value?: any);
    }
    class WebServicePortNode extends GraphNode {
        type: WebServicePortType;
        portId: string;
        connectedPort: Port;
        port: Port;
        nameParameter: WebServicePortNodeParameter;
        getWebServicePortNodes: (type: WebServicePortType) => WebServicePortNode[];
        constructor(portType: WebServicePortType, id: string, getWebServicePortNodes: (type: WebServicePortType) => WebServicePortNode[], dataTypeRegistry: DataTypeRegistry);
        name: string;
        description: string;
        owner: string;
        connectTo(port: Port): void;
        getDefaultValue(): string;
    }
}

/// <reference path="../Contracts/Common/Experiment.d.ts" />
/// <reference path="ModuleNode.d.ts" />
/// <reference path="Module.d.ts" />
/// <reference path="DatasetNode.d.ts" />
/// <reference path="TrainedModelNode.d.ts" />
/// <reference path="TransformNode.d.ts" />
/// <reference path="Dataset.d.ts" />
/// <reference path="ExperimentEvents.d.ts" />
/// <reference path="../Validation.d.ts" />
/// <reference path="../ClientCache.d.ts" />
/// <reference path="ModelUtils.d.ts" />
/// <reference path="../Disposable.d.ts" />
/// <reference path="../Dirtyable.d.ts" />
/// <reference path="WebServicePortNode.d.ts" />
declare module DataLab.Model {
    enum CycleDetectionVisitationStatus {
        NotVisited = 0,
        BeingVisited = 1,
        BeenVisited = 2,
    }
    interface IVisitedMap {
        map: {
            [key: string]: CycleDetectionVisitationStatus;
        };
        rootNode: GraphNode;
    }
    interface IWebServiceParameterContainer {
        parameters: DataLab.IObservableMap<WebServiceParameter>;
        parametersWithName(name: string): WebServiceParameter[];
    }
    interface IGraphFetcher {
        loadFromService(id: string): DataLab.Util.Promise<Experiment>;
    }
    class ExperimentPublishInfo {
        InputPortsForPublish: InputPort[];
        OutputPortsForPublish: OutputPort[];
        constructor();
    }
    class Experiment extends DataLab.Util.Disposable implements IExperimentEventAggregator, IWebServiceParameterContainer {
        private datasets;
        trainedModels: Util.IMap<TrainedModelNode>;
        transformModules: Util.IMap<TransformNode>;
        /** Unique and immutable ID of this experiment. If this experiment is a local draft, this field is null. */
        experimentId: KnockoutObservable<string>;
        /** Unique and immutable ID of the experiment from which this experiment was cloned, or 'null' if this experiment is not a clone. */
        parentExperimentId: string;
        creator: string;
        category: string;
        description: Validation.IValidatableObservable;
        summary: EditableTextProperty;
        originalExperimentDocumentation: LinkProperty;
        etag: KnockoutObservable<string>;
        schemaVersion: KnockoutObservable<number>;
        nodes: DataLab.IObservableMap<GraphNode>;
        /** When true, the experiment does not contain any nodes. */
        isEmpty: KnockoutObservable_ReadOnly<boolean>;
        parameters: DataLab.IObservableMap<WebServiceParameter>;
        properties: KnockoutObservableArray<StaticProperty>;
        connectionAdded: IConnectionEvent;
        connectionRemoved: IConnectionEvent;
        parametersWithName: (name: string) => WebServiceParameter[];
        publishInfo: ExperimentPublishInfo;
        isDraft: KnockoutObservable_ReadOnly<boolean>;
        isArchived: boolean;
        isLeaf: KnockoutObservable<boolean>;
        startTime: KnockoutObservable<string>;
        endTime: KnockoutObservable<string>;
        statusCode: KnockoutObservable<string>;
        statusDetails: KnockoutObservable<string>;
        dirtyStatus: Util.Dirtyable;
        dirtyForPublishStatus: Util.Dirtyable;
        allowPublish: KnockoutComputed<boolean>;
        publishedWebServiceGroupId: string;
        publishedModelPackageId: string;
        /** Flags this experiment to NOT trigger module/dataset/model version upgrades */
        disableNodesUpdate: KnockoutObservable<boolean>;
        disableNodesUpdateProperty: BooleanProperty;
        publishedWebServiceLinkProperty: LinkProperty;
        priorRunLinkProperty: LinkProperty;
        /** Used for dirty tracking, incremented on every change in the experiment. */
        editVersion: KnockoutObservable<number>;
        static disableNodesUpdatePropertyName: string;
        experimentParameterInUse: boolean;
        onRefreshFromNewExperiment: (oldExperiment: Experiment, newExperiment: Experiment) => void;
        isWebServiceExperiment: KnockoutComputed<boolean>;
        private isWebServiceExperimentInternal;
        hasMissingResources: boolean;
        /**
          * Creates an experiment
          * @constructor
          * @this {Experiment}
          * @param {string} experimentId The unique and immutable id of this experiment, or 'null' if this experiment is a local draft.
          * @param {string} parentExperimentId The unique and immutable id of the experiment from which this experiment was cloned, or 'null' if this experiment is not a clone.
          * @param {string} publishedWebServiceGroupId The id of web service group which has been published from this experiment before, or 'null' if this experiment has never been published.
        **/
        constructor(experimentId?: string, parentExperimentId?: string, creator?: string, publishedWebServiceGroupId?: string);
        addPublishOutputPort(outputPort: OutputPort): void;
        addPublishInputPort(inputPort: InputPort): void;
        getWebServicePortNodes(portType: WebServicePortType): WebServicePortNode[];
        getModules(): ModuleNode[];
        getDatasets(): DatasetNode[];
        storageUsedByDatasets: number;
        firstModuleWithCredentials(): any;
        firstCustomModule(): any;
        getPublishInputPorts(): InputPort[];
        getPublishOutputPorts(): OutputPort[];
        removePublishOutputPort(outputPort: OutputPort): void;
        removePublishInputPort(inputPort: InputPort): void;
        static validateDescription(name: string): string;
        validatePortsForPublishAndSetSubgraph(): boolean;
        addModule(module_: Module, workspace: DataLab.Model.Workspace, x?: number, y?: number, guid?: string): ModuleNode;
        addDataset(dataset: Dataset, x?: number, y?: number, guid?: string): DatasetNode;
        addTrainedModel(trainedModel: TrainedModel, x?: number, y?: number, guid?: string): TrainedModelNode;
        addWebServicePort(portType: WebServicePortType, x: number, y: number, id: string, dataTypeRegistry: DataTypeRegistry, connectedPort?: Port, portName?: string): WebServicePortNode;
        addTransformModule(transform: Transform, x?: number, y?: number, guid?: string): TransformNode;
        addParameter(descriptor: ModuleParameterDescriptor, name: string, value?: any): WebServiceParameter;
        /**
          * Promote a module level parameter to an experiment level parameter (implicitly linking the two as well).
          * @param {ModuleNodeParameter} moduleParameter the parameter to promote
          * @return {WebServiceParameter} the promoted parameter
         **/
        promoteModuleParameter(moduleParameter: ModuleNodeParameter): WebServiceParameter;
        removeWebServiceParameter(webServiceParameter: WebServiceParameter): void;
        addNode(node: GraphNode, x?: number, y?: number): void;
        getDatasetNode(id: string): DatasetNode;
        getTrainedModelNode(id: string): TrainedModelNode;
        getTransformNode(id: string): TransformNode;
        forEachConnection(fn: (inputPort: InputPort, outputPort: OutputPort) => void): void;
        validate(): DataLab.Validation.IObjectError[];
        /**
          * Performs checks on the experiment to determine whether it is in a state that can be saved or not.
          * @return {string} the error message if experiment cannot be saved, or null otherwise
         **/
        saveError(): string;
        arePortNamesValid(): boolean;
        findCycles(): IVisitedMap;
        _removeNode(node: GraphNode): void;
        /** Returns the list of nodes for which a newer resource (e.g. module or dataset) is available.
            This is the set of nodes which would be upgraded by {@see upgradeNodes}. */
        findNodesEligibleForUpgrade(): GraphNode[];
        /** Upgrades nodes for which a newer resource (e.g. module or dataset) is available.
            Each node in need of upgrade is replaced with a new one. See {@see GraphNode.replaceWith}.
            @see findNodesEligibleForUpgrade
            */
        upgradeNodes(moduleCache: DataLab.IResourceCache<Module>, datasetCache: DataLab.IResourceCache<Dataset>, trainedModelCache: DataLab.IResourceCache<TrainedModel>, transformModulesCache: DataLab.IResourceCache<Transform>, workspace: DataLab.Model.Workspace): void;
        refresh(workspace: DataLab.Model.Workspace): DataLab.Util.Promise<any>;
        /**
         * Iterates through the experiment's nodes and module nodes' parameters and input ports to call startDirtying on all.
         */
        startDirtyingAll(): void;
        /**
         * Iterates over a clean experiment's modules and dirties them if they are not equal for the sake of status updating.
         */
        dirtyIfNeeded(cleanExperiment: Experiment): void;
        getNumberOfModules(): number;
        private cycleFromNode(currentNode, visitedMap?);
        private refreshFromNewExperiment(experiment);
        /**
          * Checks whether the experiment contains a module or not.
          * @return {boolean} whether the experiment contains a module or not
         **/
        containsModule(): boolean;
        /**
          * Checks whether the experiment contains a train generic module or not.
          * @return {boolean} whether the experiment contains a train generic module or not
         **/
        containsTrainingModule(): boolean;
        /**
          * Returns whether this experiment is stored (either saved or submitted) on the service or not.
          * @return {boolean} true if experiment exists on service
         **/
        persistedOnService(): boolean;
        /**
          * Manually set the draft state of this experiment.
          * @param {boolean} newDraftState whether the experiment should be set to "draft" or "not a draft".
         **/
        setDraftState(newDraftState: boolean): void;
        dispose(): void;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="../ClientCache.d.ts" />
/// <reference path="Experiment.d.ts" />
/// <reference path="Schema.d.ts" />
/// <reference path="Port.d.ts" />
declare module DataLab.Model {
    /**
     IWorkspaceBackend represents operations that can be performed on a Workspace
     by some backend, such as adding modules, datasets, or experiments. Operations
     on a Workspace are mirrored to its backing IWorkspaceBackend. An IWorkspaceBackend
     is tied to particular workspace (see workspaceId).

     IWorkspaceBackend operations should be stateless and as primitve as possible. The main implementation
     (WorkspaceBackend) calls corresponding service APIs with serialized versions of the model objects.
     The following are out of scope for an IWorkspaceBackend:
     - Managing state (e.g. a submitted experiment exists in the experiment list)
     - Validation (e.g. an experiment needs a description to be submitted)

     @see {Workspace}
     */
    interface IWorkspaceBackend {
        workspaceId: string;
        friendlyName: string;
        publishExperimentAsync(experiment: Experiment): Util.Promise<string>;
        submitExperimentAsync(experiment: Experiment): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        saveDraftAsync(experiment: Experiment): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        updateExperimentAsync(experiment: Experiment): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        deleteExperimentAsync(experimentId: string, eTag: string): Util.Promise<void>;
        deleteExperimentAndAncestorsAsync(experimentId: string, eTag: string): Util.Promise<void>;
        cancelExperimentAsync(experimentId: string): Util.Promise<void>;
        promoteOutputToDatasetAsync(outputPort: OutputPort, newDatasetName: string, familyId?: string, description?: string): Util.Promise<string>;
        promoteOutputToTrainedModelAsync(outputPort: OutputPort, newTrainedModelName: string, familyId?: string, description?: string): Util.Promise<string>;
        promoteOutputToTransformModuleAsync(outputPort: OutputPort, newTransformName: string, familyId?: string, description?: string): Util.Promise<string>;
        uploadDatasetAsync(contents: Blob, newDatasetName: string, dataType: DataType, filename: string, description?: string, familyId?: string): Util.IProgressPromise<string>;
        uploadCustomModulePackageAsync(contents: Blob, newModuleName: string, dataType: DataType, filename: string, description?: string, familyId?: string): Util.IProgressPromise<string[]>;
        getExperimentAsync(experimentId: string, moduleCache: IClientCache<Model.Module>, datasetCache: IClientCache<Model.Dataset>, trainedModelCache: IClientCache<Model.TrainedModel>, transformModuleCache: IClientCache<Model.Transform>, dataTypeRegistry: DataTypeRegistry, workspace: DataLab.Model.Workspace): Util.Promise<DataLab.Model.Experiment>;
        getExperimentLineageAsync(experimentId: string): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        getExperimentInfoAsync(experimentId: string): Util.Promise<DataContract.v1.IExperimentInfo>;
        getDataflowAsync(dataflowId: string, moduleCache: IClientCache<Model.Module>, datasetCache: IClientCache<Model.Dataset>, trainedModelCache: IClientCache<Model.TrainedModel>, transformModulesCache: IClientCache<Model.Transform>, dataTypeRegistry: DataTypeRegistry, workspace: DataLab.Model.Workspace): Util.Promise<DataLab.Model.Experiment>;
        createWebServiceGroupAsync(name: string, description: string, allowAnonymousTest: boolean): Util.Promise<string>;
        getWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<DataContract.IWebServiceGroup>;
        updateWebServiceGroupAsync(webServiceGroupId: string, name: string, description: string, allowAnonymousTest: boolean): Util.Promise<void>;
        deleteWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<void>;
        listWebServiceGroupsAsync(): Util.Promise<DataContract.IWebServiceGroup[]>;
        createModelPackageAsync(webServiceGroupId: string, experiment: Model.Experiment, workspace: DataLab.Model.Workspace): Util.Promise<string>;
        listModelPackagesAsync(webServiceGroupId: string): Util.Promise<DataContract.IModelPackageInfo[]>;
        getModelPackageAsync(webServiceGroupId: string, modelPackageId: string): Util.Promise<DataContract.IModelPackageInfo>;
        updateModelPackageAsync(webServiceGroupId: string, modelPackageId: string, statusCode: DataLab.DataContract.ModelPackageStatusCode, inputsMetadata: any, outputMetadata: any, apiParameterMetadata: any): Util.Promise<void>;
        registerWebServiceAsync(webServiceGroupId: string, modelPackageId: string): Util.Promise<string>;
        getWebServiceAsync(webServiceGroupId: string, webServiceId: string): Util.Promise<DataContract.IWebService>;
        updateWebServiceAsync(webServiceGroupId: string, webServiceId: string, modelPackageId: string, diagnosticsSettings: DataLab.DataContract.IDiagnosticsSettings): Util.Promise<void>;
        invokeScoreWebServiceAsync(webServiceGroupId: string, webserviceId: string, input: Util.IMap<string>, globalParameters: Util.IMap<string>): Util.Promise<string>;
        createCommunityExperimentAsync(publishableExperiment: Model.PublishableExperiment, packageUri: string): Util.Promise<string>;
        getCommunityExperimentIdAsync(workspaceId: string, packageUri: string, communityUri: string): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        getWorkspaceSettingsAsync(): Util.Promise<WorkspaceSettings>;
        updateWorkspaceSettings(workspaceSettings: WorkspaceSettings, regenerateType: DataLab.DataContract.RegenerateTokenType): Util.Promise<any>;
        listExperimentsAsync(filter: DataLab.Model.IExperimentInfoFilter): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        listWorkspacesAsync(): Util.Promise<DataContract.v1.IWorkspaceSettings[]>;
        createExperimentStoragePackageAsync(experimentId: string, clearCredentials: boolean, newExperimentName?: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        getExperimentStoragePackageAsync(storagePackageId: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        createExperimentFromStoragePackageAsync(destinationWorkspaceId: string, packageUri: string): Util.Promise<DataContract.v1.IExperimentSubmissionResult>;
        getModuleVisualizationData(experimentId: string, nodeId: string, portName: string): Util.Promise<any>;
        getModuleVisualizationDataItem(experimentId: string, nodeId: string, portName: string, item: string, type: string, subtype: string, parseAs: string): Util.Promise<any>;
        getDatasetVisualizationData(datasetId: string): Util.Promise<any>;
        getModuleOutputSchema(experimentId: string, nodeId: string, portName: string): Util.Promise<DataLab.Model.ISchema>;
        getDatasetSchema(datasetId: string): Util.Promise<DataLab.Model.ISchema>;
        getModuleOutput(experimentId: string, nodeId: string, portName: string): Util.Promise<any>;
        getModuleErrorLog(experimentId: string, nodeId: string): Util.Promise<any>;
        signOut(): Util.Promise<string>;
        getStorageSpaceQuotaAsync(): Util.Promise<DataContract.v1.IQuotaResponse>;
        getExperimentDetailsAsync(experimentId: string): Util.Promise<string>;
        updateExperimentDetailsAsync(experimentId: string, details: string): Util.Promise<void>;
        listProjects(experimentId: string): Util.Promise<DataLab.DataContract.IProject[]>;
        createProject(request: DataLab.DataContract.IAddOrUpdateProjectRequest): Util.Promise<DataLab.DataContract.IProject>;
        updateProject(projectId: string, request: DataLab.DataContract.IAddOrUpdateProjectRequest): Util.Promise<DataLab.DataContract.IProject>;
    }
    interface IExperimentInfoFilter {
        isDraft?: boolean;
        creator?: string;
        includeNonLeaf?: boolean;
        includeArchived?: boolean;
    }
    /**
     A Workspace represents an isolated store of modules, datasets, and experiments.
     A Workspace is backed by an IWorkspaceBackend (providing creation of and changes to resources)
     and module / dataset caches (providing access to resources that already exist).

     Responsibilities of a Workspace (but not an IWorkspaceBackend) include the following:
     - Managing state (e.g. a promoted dataset should appear in the dataset list)
     - Validation (e.g. an experiment needs a description to be submitted)

     @see {IWorkspaceBackend}
     */
    class Workspace {
        id: string;
        friendlyName: string;
        userName: string;
        applicationCache: IApplicationCache;
        moduleCache: IResourceCache<Model.Module>;
        datasetCache: IResourceCache<Model.Dataset>;
        trainedModelCache: IResourceCache<Model.TrainedModel>;
        transformModulesCache: IResourceCache<Model.Transform>;
        moduleCategoryRegistry: ICategoryInfoMap;
        datasetCategoryRegistry: ICategoryInfoMap;
        datasetUploadsInProgress: KnockoutObservable<string[]>;
        customModulePackageUploadsInProgress: KnockoutObservable<string[]>;
        trainedModelUploadsInProgress: KnockoutObservable<string[]>;
        transformModuleUploadsInProgress: KnockoutObservable<string[]>;
        private workspaceBackend;
        constructor(workspaceBackend: IWorkspaceBackend, applicationCache: IApplicationCache);
        setUserName(userName: string): void;
        getUserName(): string;
        publishExperimentAsync(experiment: Experiment): Util.Promise<string>;
        submitExperimentAsync(experiment: Experiment): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        /**
         Saves a draft to the service for the first time. This is used for drafts that do not have an experiment ID.
         */
        saveDraftAsync(experiment: Experiment): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        /**
         Updates a draft that is saved to the service and already has an experiment ID.
         */
        updateDraftAsync(experiment: Experiment): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        /**
         Deletes a draft or experiment that is saved to the service and already has an experiment ID.
         */
        deleteExperimentAsync(experimentId: string, eTag: string): Util.Promise<void>;
        cancelExperimentAsync(experimentId: string): Util.Promise<void>;
        /**
        Deletes a draft or experiment that is saved to the service and already has an experiment ID, and its ancestors.
        */
        deleteExperimentAndAncestorsAsync(experimentId: string, eTag: string): Util.Promise<void>;
        /**
         Promotes output from a finished module node to a new Dataset. This creates a new Dataset
         in the backing IWorkspaceBackend. The returned promise completes when the dataset has been
         created on the backend and loaded into the datasetCache.
         */
        promoteOutputToDatasetAsync(outputPort: OutputPort, newDatasetName: string, familyId?: string, description?: string): Util.Promise<DataLab.Model.Dataset>;
        promoteOutputToTrainedModelAsync(outputPort: OutputPort, newTrainedModelName: string, familyId?: string, description?: string): Util.Promise<DataLab.Model.TrainedModel>;
        promoteOutputToTransformModuleAsync(outputPort: OutputPort, newTransformName: string, familyId?: string, description?: string): Util.Promise<DataLab.Model.Transform>;
        /**
         Creates a new dataset from the contents of a Blob (such as a File). This creates a new Dataset
         in the backing IWorkspaceBackend. The returned promise completes when the dataset has been
         created on the backend and loaded into the datasetCache.
         */
        uploadDatasetAsync(contents: Blob, newDatasetName: string, dataType: DataType, filename: string, description?: string, familyId?: string): Util.Promise<DataLab.Model.Dataset>;
        /**
         Creates a new module from the contents of a Blob (zip File). This creates a new Module
         in the backing IWorkspaceBackend. The returned promise completes when the module has been
         created on the backend and the module pallet refreshed for each module
         */
        uploadCustomModulePackageAsync(contents: Blob, newModuleName: string, dataType: DataLab.Model.DataType, filename: string, description?: string, familyId?: string): Util.Promise<string[]>;
        getExperimentAsync(experimentId: string): promise<Experiment>;
        getExperimentLineageAsync(experimentId: string): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        getExperimentInfoAsync(experimentId: string): Util.Promise<DataContract.v1.IExperimentInfo>;
        getDataflowAsync(dataflowId: string): promise<Experiment>;
        createWebServiceGroupAsync(name: string, description: string, allowAnonymousTest: boolean): Util.Promise<string>;
        getWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<DataContract.IWebServiceGroup>;
        updateWebServiceGroupAsync(webServiceGroupId: string, name: string, description: string, allowAnonymousTest: boolean): Util.Promise<void>;
        listWebServiceGroupsAsync(): Util.Promise<DataContract.IWebServiceGroup[]>;
        deleteWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<void>;
        createModelPackageAsync(webServiceGroupId: string, experiment: Model.Experiment, workspace: DataLab.Model.Workspace): Util.Promise<string>;
        listModelPackagesAsync(webServiceGroupId: string): Util.Promise<DataContract.IModelPackageInfo[]>;
        getModelPackageAsync(webServiceGroupId: string, modelPackageId: string): Util.Promise<DataContract.IModelPackageInfo>;
        updateModelPackageAsync(webServiceGroupId: string, modelPackageId: string, statusCode: DataLab.DataContract.ModelPackageStatusCode, inputsMetadata: any, outputMetadata: any, apiParameterMetadata: any): Util.Promise<void>;
        registerWebServiceAsync(webServiceGroupId: string, modelPackageId: string): Util.Promise<string>;
        getWebServiceAsync(webServiceGroupId: string, webServiceId: string): Util.Promise<DataContract.IWebService>;
        updateWebServiceAsync(webServiceGroupId: string, webServiceId: string, modelPackageId: string, diagnosticsSettings: DataLab.DataContract.IDiagnosticsSettings): Util.Promise<void>;
        invokeScoreWebServiceAsync(webServiceGroupId: string, webserviceId: string, inputs: Util.IMap<string>, globalParameters: Util.IMap<string>): Util.Promise<string>;
        createCommunityExperimentAsync(publishableExperiment: DataLab.Model.PublishableExperiment, packageUri: string): Util.Promise<string>;
        getCommunityExperimentIdAsync(workspaceId: string, packageUri: string, communityUri: string): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        getWorkspaceSettingsAsync(): promise<WorkspaceSettings>;
        /**
         Updates workspace settings given a WorkspaceSettings instance. The regenerateType
         parameter is for specifying whether an authorization token needs to be regenerated.
         */
        updateWorkspaceSettings(workspaceSettings: WorkspaceSettings, regenerateType: DataLab.DataContract.RegenerateTokenType): Util.Promise<any>;
        archiveExperimentAsync(experimentId: string): Util.Promise<string>;
        unarchiveExperimentAsync(experimentId: string): Util.Promise<string>;
        listExperimentsAsync(filter: DataLab.Model.IExperimentInfoFilter): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        listWorkspacesAsync(): Util.Promise<DataContract.v1.IWorkspaceSettings[]>;
        createExperimentStoragePackageAsync(experimentId: string, clearCredentials: boolean, newExperimentName?: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        getExperimentStoragePackageAsync(storagePackageId: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        createExperimentFromStoragePackageAsync(destinationWorkspaceId: string, packageUri: string): Util.Promise<DataContract.v1.IExperimentSubmissionResult>;
        getModuleVisualizationData(experimentId: string, nodeId: string, portName: string): DataLab.Util.Promise<any>;
        getModuleVisualizationDataItem(experimentId: string, nodeId: string, portName: string, item: string, type: string, subtype: string, parseAs: string): DataLab.Util.Promise<any>;
        getDatasetVisualizationData(datasetId: string): promise<any>;
        getModuleOutputSchema(experimentId: string, nodeId: string, portName: string): Util.Promise<DataLab.Model.ISchema>;
        getDatasetSchema(datasetId: string): Util.Promise<DataLab.Model.ISchema>;
        getModuleOutput(experimentId: string, nodeId: string, portName: string): Util.Promise<any>;
        getModuleErrorLog(experimentId: string, nodeId: string): Util.Promise<any>;
        signOut(): promise<string>;
        getStorageSpaceQuotaAsync(): Util.Promise<DataContract.v1.IQuotaResponse>;
        getExperimentDetailsAsync(experimentId: string): Util.Promise<string>;
        updateExperimentDetailsAsync(experimentId: string, details: string): Util.Promise<void>;
        listProjects(experimentId?: string): Util.Promise<DataLab.DataContract.IProject[]>;
        createProject(request: DataLab.DataContract.IAddOrUpdateProjectRequest): Util.Promise<DataLab.DataContract.IProject>;
        updateProject(projectId: string, request: DataLab.DataContract.IAddOrUpdateProjectRequest): Util.Promise<DataLab.DataContract.IProject>;
    }
}
declare module DataLab {
    var Workspace: DataLab.Model.Workspace;
}

/// <reference path="../Util.d.ts" />
/// <reference path="Schema.d.ts" />
declare module DataLab.Model.SchemaUtils {
    function clone(schema: ISchema): ISchema;
    function numColumns(schema: ISchema): number;
    function createSchema(columnAttributes: IColumnAttribute[], scoreColumns?: IScoreColumn, labelColumns?: ILabelColumn, featureChannels?: IFeatureChannel[], isInaccurate?: SchemaCorrectness): ISchema;
    function concat(first: ISchema, ...rest: ISchema[]): ISchema;
    function selectColumns(schema: ISchema, columnIndexes: number[]): ISchema;
    function renameColumn(schema: ISchema, oldName: string, newName: string, checkForCollisions?: boolean): any;
    function renameColumn(schema: ISchema, columnIndex: number, newName: string, checkForCollisions?: boolean): any;
}

/// <reference path="Schema.d.ts" />
declare module DataLab.Model.ColumnPicker {
    interface IQuery {
        isFilter: boolean;
        rules: IRule[];
    }
    enum RuleType {
        ColumnNames = 0,
        ColumnIndexes = 1,
        ColumnTypes = 2,
        AllColumns = 3,
    }
    enum ColumnType {
        String = 0,
        Integer = 1,
        Double = 2,
        Boolean = 3,
        DateTime = 4,
        TimeSpan = 5,
        Categorical = 6,
        Numeric = 7,
        All = 8,
    }
    enum ColumnKind {
        Feature = 0,
        Score = 1,
        Label = 2,
        All = 3,
    }
    interface IRule {
        ruleType: RuleType;
        exclude: boolean;
        columns: string[];
        columnTypes: ColumnType[];
        columnKinds: ColumnKind[];
    }
    function parseQuery(json: string): IQuery;
    class ColumnSelection {
        private nameToIndexMap;
        includedColumnIndexes: number[];
        source: ISchema;
        query: IQuery;
        constructor(queryJson: string, source: ISchema);
        constructor(query: IQuery, source: ISchema);
        private getRuleColumns(source, rule);
        private handleColumnNamesRule(source, rule);
        private handleColumnIndexesRule(source, rule);
        private handleColumnTypesRule(source, rule);
    }
}

/// <reference path="Schema.d.ts" />
/// <reference path="ColumnPickerQuery.d.ts" />
/// <reference path="SchemaUtils.d.ts" />
declare module DataLab.Model.MetadataEditor {
    enum DataType {
        Unchanged = 0,
        String = 1,
        Integer = 2,
        Double = 3,
        Boolean = 4,
        DateTime = 5,
        TimeSpan = 6,
    }
    enum Categorical {
        Unchanged = 0,
        Categorical = 1,
        NonCategorical = 2,
    }
    enum Fields {
        Unchanged = 0,
        Features = 1,
        Labels = 2,
        Weights = 3,
        ClearFeatures = 4,
        ClearLabels = 5,
        ClearScores = 6,
        ClearWeights = 7,
    }
    function computeOutputSchema(inputSchema: ISchema, columnSelection: ColumnPicker.ColumnSelection, newDataType: DataType, newCategoricalAttribute: Categorical, newFieldAttribute: Fields, newColumnNamesString: string): ISchema;
}

/// <reference path="ModuleNode.d.ts" />
/// <reference path="Schema.d.ts" />
/// <reference path="Workspace.d.ts" />
/// <reference path="SchemaUtils.d.ts" />
/// <reference path="ColumnPickerQuery.d.ts" />
/// <reference path="MetadataEditorSchemaPropagation.d.ts" />
declare module DataLab.Model {
    interface SchemaPropagationRule {
        computeOutputSchema(moduleNode: ModuleNode, workspace: Workspace): DataLab.Util.Promise<ISchema>;
    }
    function computeSchemaOfInputPort(workspace: Workspace, inputPortName: string, moduleNode: ModuleNode): DataLab.Util.Promise<ISchema>;
    function computeSchemaOfInputPort(workspace: Workspace, inputPort: InputPort): DataLab.Util.Promise<ISchema>;
    function getSchemaPropagationRule(moduleName: string, outputPortName: string): SchemaPropagationRule;
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="SchemaPropagationRule.d.ts" />
declare module DataLab.Model {
    class ModulePortDescriptor {
        name: string;
        friendlyName: string;
        allowedDataTypes: DataType[];
        optional: boolean;
        constructor(name: string, friendlyName: string, allowedDataTypes: DataType[], optional?: boolean);
        /** Indicates if this descriptor is compatible with another (i.e. a port of this descriptor is potentially
            compatible with a port of the other descriptor. This relation is symmetric, irreflexive, and transitive. */
        isCompatible(other: ModulePortDescriptor): boolean;
    }
    class ModuleInputPortDescriptor extends ModulePortDescriptor {
        constructor(name: string, friendlyName: string, allowedDataTypes: DataType[], optional?: boolean);
        isCompatible(other: ModulePortDescriptor): boolean;
    }
    class ModuleOutputPortDescriptor extends ModulePortDescriptor {
        schemaPropagationRule: SchemaPropagationRule;
        constructor(name: string, friendlyName: string, dataType: DataType, optional?: boolean);
        isCompatible(other: ModulePortDescriptor): boolean;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="Resource.d.ts" />
/// <reference path="ModuleParameterDescriptor.d.ts" />
/// <reference path="ModulePortDescriptor.d.ts" />
declare module DataLab.Model {
    class Module extends Resource {
        portDescriptors: ModulePortDescriptor[];
        parameterDescriptors: ModuleParameterDescriptor[];
        owner: string;
        clientVersion: string;
        isLatestClientVersion: boolean;
        constructor(id: string, category: string, portDescriptors: ModulePortDescriptor[], parameterDescriptors?: ModuleParameterDescriptor[], created?: Date, familyId?: string, serviceVersion?: number);
    }
}

/// <reference path="../Model/DatasetNode.d.ts" />
/// <reference path="../Model/ModuleNode.d.ts" />
/// <reference path="../Model/Experiment.d.ts" />
/// <reference path="../Global.refs.d.ts" />
declare module DataLab.DataContract.v2 {
    import Model = DataLab.Model;
    interface IContainsGraph {
        Graph: ISerializedGraph;
    }
    interface ISerializedExperiment extends IContainsGraph, DataContract.IHasSchema {
        ExperimentId: string;
        ParentExperimentId: string;
        Etag: string;
    }
    /**
      * Takes an experiment and creates a serializable version of it including its graph.
      * @param {Model.Experiment} experiment the experiment to turn into a serializable experiment
      * @return {ISerializableGraph} the serializable experiment
     **/
    function SerializedExperiment(experiment: Model.Experiment): ISerializedExperiment;
    interface ISerializedGraph {
        Nodes: ISerializedGraphNode[];
    }
    /**
      * Takes a node map and creates a serializable graph of those nodes.
      * @param {Model.IExperimentNodeMap} nodes the collection of nodes to turn into a serializable subgraph
      * @return {ISerializableGraph} the serializable subgraph
     **/
    function SerializedGraph(nodes: DataLab.IObservableMap<Model.GraphNode>): ISerializedGraph;
    /** Used only for copy and paste */
    interface ISerializedSubgraph extends ISerializedGraph {
        X: number;
        Y: number;
        Width: number;
        Height: number;
        EgressConnections: ISerializedConnection[];
    }
    function SerializedSubgraph(nodes: DataLab.IObservableMap<Model.GraphNode>): ISerializedSubgraph;
    interface ISerializedConnection {
        OutputNodeId: string;
        OutputPortName: string;
        InputNodeId: string;
        InputPortName: string;
    }
    function SerializedConnection(input: Model.InputPort, output: Model.OutputPort): ISerializedConnection;
    interface ISerializedPort {
        IsInput: boolean;
        PortName: string;
        ParentNodeId: string;
    }
    interface ISerializedInputPort extends ISerializedPort {
        Connection: ISerializedConnection;
    }
    interface ISerializedOutputPort extends ISerializedPort {
    }
    interface ISerializedGraphNode {
        Id: string;
        InputPorts: ISerializedPort[];
        OutputPorts: ISerializedPort[];
        NodeType: DataLab.Constants.GraphNodeType;
        X: number;
        Y: number;
        Guid: string;
        Comment: string;
        CommentCollapsed: boolean;
    }
    interface ISerializedDataset extends ISerializedGraphNode {
    }
    interface ISerializedTrainedModel extends ISerializedGraphNode {
    }
    interface ISerializedTransform extends ISerializedGraphNode {
    }
    function SerializedDatasetNode(node: DataLab.Model.DatasetNode): ISerializedDataset;
    function SerializedTrainedModelNode(node: DataLab.Model.TrainedModelNode): ISerializedTrainedModel;
    function SerializedTransformNode(node: DataLab.Model.TransformNode): ISerializedTransform;
    interface ISerializedModule extends ISerializedGraphNode {
        Parameters: IModuleNodeParameterMap;
    }
    interface IModeValueInfoMap {
        [optionValue: string]: IModuleNodeParameterMap;
    }
    interface IModuleNodeParameterMap {
        [parameterName: string]: IModuleNodeParameter;
    }
    function SerializedModuleNode(node: DataLab.Model.ModuleNode): ISerializedModule;
}

/// <reference path="DataType.d.ts" />
declare module DataLab.Model {
    class DataTypeRegistry {
        dataTypes: {
            [dataTypeId: string]: DataType;
        };
        constructor(dataTypes: DataType[]);
        /** Returns an array of the data types that have the given file extension.
            A leading dot is removed (if present), so "csv" is considered equivalent to ".csv".
            If the given extension is empty or is only a dot, an exception is thrown. */
        findDataTypesForFileExtension(extension: string): DataType[];
        /** Returns an array of the data types for the given filename's extension.
            If the given filename does not have an extension, an empty array is returned. */
        findDataTypesForFileName(fileName: string): DataType[];
        getDataTypeWithId(id: string): DataType;
        tryGetDataTypeWithId(id: string): DataType;
    }
}

/// <reference path="../Contracts/Common/Experiment.d.ts" />
/// <reference path="Experiment.d.ts" />
declare module DataLab.Model {
    enum CommunityExperimentVisibility {
        Private = 0,
        Public = 1,
    }
    class PublishableExperiment {
        sourceExperiment: DataLab.Model.Experiment;
        experimentName: string;
        summary: string;
        description: string;
        visibility: CommunityExperimentVisibility;
        tags: string[];
        thumbnail: DataLab.ImageContent;
        imageUrl: string;
        constructor(sourceExperiment: DataLab.Model.Experiment, experimentName: string, summary: string, description: string, visibility: CommunityExperimentVisibility, tags: string[], thumbnail: DataLab.ImageContent, imageUrl: string);
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="../Model/_refs.d.ts" />
/// <reference path="DataContractInterfaces-v1.d.ts" />
declare module DataLab.DataContract.v1 {
    function serializeClientData(nodes: Model.GraphNode[]): string;
    function serialize(experiment: Model.Experiment, schemaVersion?: number): IExperimentGraphModel;
    function serializeWebServiceInfo(experiment: Model.Experiment, schemaVersion?: number): IExperimentWebServiceInfo;
    function extractCredentials(experiment: Model.Experiment, schemaVersion?: number): DataContract.ISaveCredentialRequest[];
}

declare module DataLab.Features {
    interface IIntegrationPoints {
        ConfigureYourOwnHdInsight: {
            Enabled: boolean;
            Experience: string;
        };
        Dataflows: {
            Enabled: boolean;
            Experience: string;
        };
        ModulesList: {
            Enabled: boolean;
            Experience: string;
        };
        AuthorizeDownloadILearner: {
            Enabled: boolean;
            Experience: string;
        };
        AuthorizeDownloadITransform: {
            Enabled: boolean;
            Experience: string;
        };
        SSIMSearch: {
            Enabled: boolean;
            Experience: string;
        };
        ColumnPickerRulesRedesign: {
            Enabled: boolean;
            Experience: string;
        };
        SemanticHelpSearch: {
            Enabled: boolean;
            Experience: string;
        };
        AllowAnonymousTest: {
            Enabled: boolean;
            Experience: string;
        };
        ExperimentalExperimentList: {
            Enabled: boolean;
            Experience: string;
        };
        EnableFrictionFreeUserExperience: {
            Enabled: boolean;
            Experience: string;
        };
        EnableSchemaPropagation: {
            Enabled: boolean;
            Experience: string;
        };
        EnableNewExperimentFlow: {
            Enabled: boolean;
            Experience: string;
        };
        EnableGalleryInPlusNewInterim: {
            Enabled: boolean;
            Experience: string;
        };
        EnablePackingService: {
            Enabled: boolean;
            Experience: string;
        };
        IPythonNotebook: {
            Enabled: boolean;
            Experience: string;
        };
        AnonymousWorkspace: {
            Enabled: boolean;
            Experience: string;
        };
        TrialLimitations: {
            Enabled: boolean;
            Experience: string;
        };
        EnableWorkspaceQuotas: {
            Enabled: boolean;
            Experience: string;
        };
        StorageUsageWidget: {
            Enabled: boolean;
            Experience: string;
        };
        ExperimentDescription: {
            Enabled: boolean;
            Experience: string;
        };
        EnableOutputPortApiCode: {
            Enabled: boolean;
            Experience: string;
        };
        EnablePayboardTelemetry: {
            Enabled: boolean;
            Experience: string;
        };
        EnableNewCustomModuleUpload: {
            Enabled: boolean;
            Experience: string;
        };
        EnableAssetDeletion: {
            Enabled: boolean;
            Experience: string;
        };
        AssetDeletionUi: {
            Enabled: boolean;
            Experience: string;
        };
        EnableGuidedTour: {
            Enabled: boolean;
            Experience: string;
        };
        EnableGuidedExperiment: {
            Enabled: boolean;
            Experience: string;
        };
        EnableCommunityUXInStudio: {
            Enabled: boolean;
            Experience: string;
        };
        TrainedModelDeletionUi: {
            Enabled: boolean;
            Experience: string;
        };
        ChatSupport: {
            Enabled: boolean;
            Experience: string;
        };
        ExcelDownloadEnabled: {
            Enabled: boolean;
            Experience: string;
        };
        ShowSubscriptionInfo: {
            Enabled: boolean;
            Experience: string;
        };
        CopyExperimentAcrossWorkspace: {
            Enabled: boolean;
            Experience: string;
        };
        DatasetUploadInTrial: {
            Enabled: boolean;
            Experience: string;
        };
        ModuleUploadInTrial: {
            Enabled: boolean;
            Experience: string;
        };
        TreeVisualization: {
            Enabled: boolean;
            Experience: string;
        };
        ExperimentListCategories: {
            Enabled: boolean;
            Experience: string;
        };
        PublishWebServiceInTrial: {
            Enabled: boolean;
            Experience: string;
        };
        EnableChunkedUploadInStudio: {
            Enabled: boolean;
            Experience: string;
        };
        MarkdownInPublishDialog: {
            Enabled: boolean;
            Experience: string;
        };
        MarkdownInExperimentDescription: {
            Enabled: boolean;
            Experience: string;
        };
        CompetitionExperimentSupport: {
            Enabled: boolean;
            Experience: string;
        };
    }
    function setIntegrationPoints(newIntegrationPoints: IIntegrationPoints): void;
    /**
      * ConfigureYourOwnHdInsight is a feature which only depends on the Enabled boolean value.
      * Other features may offer different experiences based on integrationPoints.FeatureName.Experience.
      */
    function configureYourOwnHdInsightEnabled(): boolean;
    function dataflowsEnabled(): boolean;
    function packingServiceEnabled(): boolean;
    function modulesListEnabled(): boolean;
    function authorizeDownloadILearnerEnabled(): boolean;
    function authorizeDownloadITransformEnabled(): boolean;
    function ssimSearchEnabled(): boolean;
    function columnPickerRulesRedesignEnabled(): boolean;
    function semanticHelpSearch(): boolean;
    function allowAnonymousTest(): boolean;
    function experimentalExperimentListEnabled(): boolean;
    function enableFrictionFreeUserExperienceEnabled(): boolean;
    function schemaPropagationEnabled(): boolean;
    function newExperimentFlowEnabled(): boolean;
    function galleryInPlusNewInterimEnabled(): boolean;
    function anonymousWorkspaceEnabled(): boolean;
    function trialLimitationsEnabled(): boolean;
    function enableWorkspaceQuotasEnabled(): boolean;
    function iPythonNotebookEnabled(): boolean;
    function experimentDescriptionEnabled(): boolean;
    function storageUsageWidgetEnabled(): boolean;
    function enableOutputPortApiCodeEnabled(): boolean;
    function payboardTelemetryEnabled(): boolean;
    function enableOutputPortApiCodeExperience(): string;
    function newCustomModuleUploadEnabled(): boolean;
    function enableAssetDeletionEnabled(): boolean;
    function assetDeletionUiEnabled(): boolean;
    function guidedTourEnabled(): boolean;
    function guidedExperimentEnabled(): boolean;
    function trainedModelDeletionUiEnabled(): boolean;
    function excelDownloadEnabled(): boolean;
    function communityUXInStudioEnabled(): boolean;
    function chatSupportEnabled(): boolean;
    function showSubscriptionInfoEnabled(): boolean;
    function copyExperimentAcrossWorkspaceEnabled(): boolean;
    function datasetUploadInTrialEnabled(): boolean;
    function moduleUploadInTrialEnabled(): boolean;
    function treeVisualizationEnabled(): boolean;
    function publishWebServiceInTrialEnabled(): boolean;
    function experimentListCategoriesEnabled(): boolean;
    function chunkedUploadInStudioEnabled(): boolean;
    function competitionExperimentSupportEnabled(): boolean;
    function markdownInPublishDialogEnabled(): boolean;
    function markdownInExperimentDescriptionEnabled(): boolean;
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="../Model/Workspace.d.ts" />
/// <reference path="../Model/CommunityExperiment.d.ts" />
/// <reference path="DataLabClient.d.ts" />
/// <reference path="DataContractInterfaces-v1.d.ts" />
/// <reference path="Serializer.d.ts" />
/// <reference path="../Features.d.ts" />
declare module DataLab.DataContract {
    enum RegenerateTokenType {
        None = 0,
        Primary = 1,
        Secondary = 2,
    }
    /**
     WorkspaceBackend adapts an IApplicationClient to provide the backing operations for a Workspace.

     @see {DataLab.Model.Workspace}
     @see {DataLab.Model.IWorkspaceBackend}
     @see {DataLab.DataContract.IApplicationClient}
     */
    class WorkspaceBackend implements DataLab.Model.IWorkspaceBackend {
        workspaceId: string;
        friendlyName: string;
        private client;
        constructor(client: IApplicationClient);
        private saveCredentials(credentialsToSave);
        publishExperimentAsync(experiment: Model.Experiment): Util.Promise<string>;
        listExperimentsAsync(filter: DataLab.Model.IExperimentInfoFilter): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        listWorkspacesAsync(): Util.Promise<DataContract.v1.IWorkspaceSettings[]>;
        createExperimentStoragePackageAsync(experimentId: string, clearCredentials: boolean, newExperimentName?: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        getExperimentStoragePackageAsync(storagePackageId: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        createExperimentFromStoragePackageAsync(destinationWorkspaceId: string, packageUri: string): Util.Promise<DataContract.v1.IExperimentSubmissionResult>;
        submitExperimentAsync(experiment: Model.Experiment): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        saveDraftAsync(experiment: Model.Experiment): Util.Promise<v1.IExperimentSubmissionResult>;
        updateExperimentAsync(experiment: Model.Experiment): Util.Promise<v1.IExperimentSubmissionResult>;
        deleteExperimentAsync(experimentId: string, eTag: string): Util.Promise<void>;
        deleteExperimentAndAncestorsAsync(experimentId: string, eTag: string): Util.Promise<void>;
        cancelExperimentAsync(experimentId: string): Util.Promise<void>;
        promoteOutputToDatasetAsync(outputPort: Model.OutputPort, newDatasetName: string, familyId?: string, description?: string): Util.Promise<string>;
        promoteOutputToTrainedModelAsync(outputPort: Model.OutputPort, newTrainedModelName: string, familyId?: string, description?: string): Util.Promise<string>;
        promoteOutputToTransformModuleAsync(outputPort: Model.OutputPort, newTransformName: string, familyId?: string, description?: string): Util.Promise<string>;
        private promotionHelper(outputPort, newDataResourceName, familyId?, description?);
        uploadDatasetAsync(contents: Blob, newDatasetName: string, dataType: DataLab.Model.DataType, filename: string, description?: string, familyId?: string): DataLab.Util.IProgressPromise<string>;
        uploadCustomModulePackageAsync(contents: Blob, newModuleName: string, dataType: DataLab.Model.DataType, filename: string, description?: string, familyId?: string): DataLab.Util.IProgressPromise<string[]>;
        getExperimentAsync(experimentId: string, moduleCache: IClientCache<Model.Module>, datasetCache: IClientCache<Model.Dataset>, trainedModelCache: IClientCache<Model.TrainedModel>, transformModulesCache: IClientCache<Model.Transform>, dataTypeRegistry: Model.DataTypeRegistry, workspace: DataLab.Model.Workspace): Util.Promise<DataLab.Model.Experiment>;
        getExperimentLineageAsync(experimentId: string): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        getExperimentInfoAsync(experimentId: string): Util.Promise<DataContract.v1.IExperimentInfo>;
        getDataflowAsync(dataflowId: string, moduleCache: IClientCache<Model.Module>, datasetCache: IClientCache<Model.Dataset>, trainedModelCache: IClientCache<Model.TrainedModel>, transformModulesCache: IClientCache<Model.Transform>, dataTypeRegistry: Model.DataTypeRegistry, workspace: DataLab.Model.Workspace): Util.Promise<DataLab.Model.Experiment>;
        createWebServiceGroupAsync(name: string, description: string, allowAnonymousTest: boolean): Util.Promise<string>;
        listWebServiceGroupsAsync(): Util.Promise<DataContract.IWebServiceGroup[]>;
        updateWebServiceGroupAsync(webServiceGroupId: string, name: string, description: string, allowAnonymousTest: boolean): Util.Promise<void>;
        getWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<DataContract.IWebServiceGroup>;
        deleteWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<void>;
        createModelPackageAsync(webServiceGroupId: string, experiment: Model.Experiment, workspace: DataLab.Model.Workspace): Util.Promise<string>;
        listModelPackagesAsync(webServiceGroupId: string): Util.Promise<IModelPackageInfo[]>;
        getModelPackageAsync(webServiceGroupId: string, modelPackageId: string): Util.Promise<IModelPackageInfo>;
        updateModelPackageAsync(webServiceGroupId: string, modelPackageId: string, statusCode: ModelPackageStatusCode, inputsMetadata: Util.IMap<DataLab.Util.IMap<string>>, outputsMetadata: Util.IMap<DataLab.Util.IMap<string>>, globalParametersMetadata: IGlobalParameterMetadata[]): Util.Promise<void>;
        registerWebServiceAsync(webServiceGroupId: string, modelPackageId: string): Util.Promise<string>;
        getWebServiceAsync(webServiceGroupId: string, webServiceId: string): Util.Promise<DataContract.IWebService>;
        updateWebServiceAsync(webServiceGroupId: string, webServiceId: string, modelPackageId: string, diagnosticsSettings: DataLab.DataContract.IDiagnosticsSettings): Util.Promise<void>;
        invokeScoreWebServiceAsync(webServiceGroupId: string, webserviceId: string, inputs: Util.IMap<string>, globalParameters: Util.IMap<string>): Util.Promise<string>;
        createCommunityExperimentAsync(publishableExperiment: DataLab.Model.PublishableExperiment, packageUri: string): Util.Promise<string>;
        getCommunityExperimentIdAsync(workspaceId: string, packageUri: string, communityUri: string): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        getWorkspaceSettingsAsync(): Util.Promise<Model.WorkspaceSettings>;
        updateWorkspaceSettings(workspaceSettings: Model.WorkspaceSettings, regenerateType: DataLab.DataContract.RegenerateTokenType): Util.Promise<any>;
        getModuleVisualizationData(experimentId: string, nodeId: string, portName: string): DataLab.Util.Promise<any>;
        getModuleVisualizationDataItem(experimentId: string, nodeId: string, portName: string, item: string, type: string, subtype: string, parseAs: string): DataLab.Util.Promise<any>;
        getDatasetVisualizationData(datasetId: string): promise<any>;
        getModuleOutputSchema(experimentId: string, nodeId: string, portName: string): Util.Promise<DataLab.Model.ISchema>;
        getDatasetSchema(datasetId: string): Util.Promise<DataLab.Model.ISchema>;
        getModuleOutput(experimentId: string, nodeId: string, portName: string): Util.Promise<any>;
        getModuleErrorLog(experimentId: string, nodeId: string): Util.Promise<any>;
        signOut(): Util.Promise<string>;
        getStorageSpaceQuotaAsync(): Util.Promise<v1.IQuotaResponse>;
        getExperimentDetailsAsync(experimentId: string): Util.Promise<string>;
        updateExperimentDetailsAsync(experimentId: string, details: string): Util.Promise<void>;
        private generateSubmissionRequest(experiment, isDraft);
        listProjects(experimentId?: string): Util.Promise<DataLab.DataContract.IProject[]>;
        createProject(request: DataLab.DataContract.IAddOrUpdateProjectRequest): Util.Promise<DataLab.DataContract.IProject>;
        updateProject(projectId: string, request: DataLab.DataContract.IAddOrUpdateProjectRequest): Util.Promise<DataLab.DataContract.IProject>;
    }
}

/// <reference path="../Model/Experiment.d.ts" />
/// <reference path="../ClientCache.d.ts" />
/// <reference path="DataContractInterfaces-v2.d.ts" />
declare module DataLab.DataContract.v2 {
    import Model = DataLab.Model;
    interface INodeToContractMap {
        [key: string]: ISerializedGraphNode;
    }
    interface IContractToNodeMap {
        [key: string]: DataLab.Model.GraphNode;
    }
    interface ILinkedParameter {
        moduleParameter: DataLab.Model.ModuleNodeParameter;
        webServiceParameterName: string;
        webServiceParameterValue: any;
    }
    interface IAddedNodesInfo {
        nodesToContract: INodeToContractMap;
        contractToNodes: IContractToNodeMap;
    }
    interface INodesAddedPromise extends Util.Promise<any> {
        done(doneCallback?: (addedNodes: IAddedNodesInfo) => void): INodesAddedPromise;
    }
    interface IAddedConnectionInfo {
        inputPort: Model.InputPort;
        outputPort: Model.OutputPort;
    }
    interface IUser {
        Email: string;
        Name: string;
        Role: string;
        UserId: string;
    }
    /**
      * Creates nodes of serialized graph and stores them in maps to translate between contract and instance ids
      * @param {ISerializableGraph} contractGraph the serialized graph containing the nodes to construct
      * @param {ApplicationCache} applicationCache the cache for modules and datasets
      * @param {(ISerializableGraphNode) => void) onLookupFail a callback for when looking up the module/dataset by guid in the application cache fails
      * @param {(ISerializableGraphNode) => string) idTransform a callback that maps between contract and experiment ids
      * @return {INodesAddedPromise} a promise whose .done callback's parameter contains an IAddedNodesInfo
     **/
    function createNodes(contractGraph: ISerializedGraph, moduleCache: IClientCache<Model.Module>, datasetCache: IClientCache<Model.Dataset>, trainedModelCache: IClientCache<Model.TrainedModel>, transformModulesCache: IClientCache<Model.Transform>, onLookupFail: (ISerializableGraphNode) => void, idTransform: (ISerializableGraphNode) => string, workspace: DataLab.Model.Workspace): INodesAddedPromise;
    /**
      * Create connections for the given added nodes.
     **/
    function createConnections(addedNodesInfo: IAddedNodesInfo, onConnectToMissingPort: (ISerializablePort, ISerializablerConnection) => void): IAddedConnectionInfo[];
}

/// <reference path="../Contracts/Deserializer-v2.d.ts" />
declare module DataLab {
    var User: DataLab.Model.User;
}
declare module DataLab.Model {
    class User {
        email: string;
        name: string;
        role: string;
        userId: string;
        isWorkspaceOwner: boolean;
        constructor(userInfo: DataLab.DataContract.v2.IUser);
    }
}

/// <reference path="../Global.refs.d.ts" />
declare module DataLab.Model {
    class AuthorizationToken {
        primary: KnockoutObservable<string>;
        secondary: KnockoutObservable<string>;
        deserialize(token: {
            PrimaryToken: string;
            SecondaryToken: string;
        }): void;
    }
    class HDInsightClusterConnectionString {
        user: Validation.IValidatableObservable;
        password: Validation.IValidatableObservable;
        uri: Validation.IValidatableObservable;
        hasBeenEdited: KnockoutObservable<boolean>;
        constructor();
        settingsUpdated(): void;
        /** Sets the fields using the string received from service. Expected to consist only of the URI. */
        deserialize(receivedString: string): void;
        /** Serialize the three fields into a single connection string. */
        serialize(): string;
    }
    class HDInsightStorageConnectionString {
        accountName: Validation.IValidatableObservable;
        accountKey: Validation.IValidatableObservable;
        container: Validation.IValidatableObservable;
        hasBeenEdited: KnockoutObservable<boolean>;
        constructor();
        settingsUpdated(): void;
        /** Sets the fields using the string received from service. Expected to be of the format "container@accountName". */
        deserialize(receivedString: string): void;
        /** Serialize the three fields into a single connection string. */
        serialize(): string;
    }
    enum WorkspaceType {
        Production = 0,
        Free = 1,
        Anonymous = 2,
        PaidStandard = 3,
        PaidPremium = 4,
    }
    class WorkspaceTypeExtensions {
        static isProduction(workspaceType: WorkspaceType): boolean;
    }
    class WorkspaceSettings {
        id: string;
        friendlyName: Validation.IValidatableObservable;
        description: KnockoutObservable<string>;
        azureStorageConnectionString: KnockoutObservable<string>;
        hdinsightClusterConnectionString: HDInsightClusterConnectionString;
        hdinsightStorageConnectionString: HDInsightStorageConnectionString;
        useDefaultHDInsightSettings: KnockoutObservable<boolean>;
        sqlAzureConnectionString: KnockoutObservable<string>;
        analyticFrameworkClusterConnectionString: KnockoutObservable<string>;
        authorizationToken: AuthorizationToken;
        etag: string;
        type: WorkspaceType;
        ownerEmail: string;
        userStorage: string;
        subscriptionId: string;
        subscriptionName: string;
        subscriptionState: string;
        createdTime: Date;
        constructor(id: string);
        populateFromContract(contract: DataContract.v1.IWorkspaceSettings): void;
        /** Trigger validation on all validatable fields. Return true if there are no errors, false if there are errors. */
        validateAll(): boolean;
    }
}

/// <reference path="DatasetNode.d.ts" />
/// <reference path="DataType.d.ts" />
/// <reference path="DataTypeRegistry.d.ts" />
/// <reference path="Experiment.d.ts" />
/// <reference path="ExperimentEvents.d.ts" />
/// <reference path="GraphNode.d.ts" />
/// <reference path="ModuleNode.d.ts" />
/// <reference path="Parameter.d.ts" />
/// <reference path="ModelTestData.d.ts" />
/// <reference path="Port.d.ts" />
/// <reference path="Workspace.d.ts" />
/// <reference path="User.d.ts" />
/// <reference path="WorkspaceSettings.d.ts" />
/// <reference path="ModelUtils.d.ts" />
/// <reference path="Property.d.ts" />

/// <reference path="../Global.refs.d.ts" />
/// <reference path="../Model/_refs.d.ts" />
/// <reference path="DataContractInterfaces-v1.d.ts" />
/// <reference path="../ClientCache.d.ts" />
declare module DataLab.DataContract.v1 {
    function deserializeDataflow(dataflow: IDataflowInfo, moduleCache: IClientCache<Model.Module>, datasetCache: IClientCache<Model.Dataset>, trainedModelCache: IClientCache<Model.TrainedModel>, transformModulesCache: IClientCache<Model.Transform>, dataTypeRegistry: Model.DataTypeRegistry, workspace: DataLab.Model.Workspace): Util.Promise<DataLab.Model.Experiment>;
    function deserializeExperiment(experiment: IExperimentInfo, moduleCache: IClientCache<Model.Module>, datasetCache: IClientCache<Model.Dataset>, trainedModelCache: IClientCache<Model.TrainedModel>, transformModulesCache: IClientCache<Model.Transform>, dataTypeRegistry: DataLab.Model.DataTypeRegistry, workspace: DataLab.Model.Workspace): Util.Promise<DataLab.Model.Experiment>;
    function deserializeWorkspaceSettings(workspaceSettings: IWorkspaceSettings): Model.WorkspaceSettings;
    function deserializeDataType(dataType: IDatatype): Model.DataType;
}

/// <reference path="../Model/Experiment.d.ts" />
/// <reference path="../ClientCache.d.ts" />
/// <reference path="DataContractInterfaces-v2.d.ts" />
/// <reference path="DataContractInterfaces-v1.d.ts" />
/// <reference path="Deserializer-v1.d.ts" />
declare module DataLab.DataContract {
    function deserializeExperiment(experiment: IHasSchema, applicationCache: ApplicationCache, workspace: DataLab.Model.Workspace): Util.Promise<DataLab.Model.Experiment>;
}

declare module DataLab.WorkspaceManagement {
    interface IUser {
        UserId: string;
        Email: string;
        Name: string;
        Role: string;
    }
    enum InvitationStatus {
        Invited = 0,
        Active = 1,
    }
    interface IUserInvitation {
        User: IUser;
        Status: string;
    }
    interface ISendInvitationRequest {
        Role: string;
        Emails: string;
    }
    interface ISendInvitationSingleResponse {
        Email: string;
        Failed: boolean;
        ErrorMessage: string;
    }
}

declare module DataLab.OnlineSearch {
    interface ISsimSearchResult {
        Id: string;
        Title: string;
        Description: string;
        DataSourceAddress: string;
        DataPreviewAddress: string;
        Provider: string;
        SourceNames: string[];
        PublisherIconUrl: string;
        DataSourceType: string;
        DataSourceProtocol: string;
        DataSourceAuthentication: string;
    }
    interface ISsimSearchResults {
        TotalResults: number;
        StartIndex: number;
        ItemsPerPage: number;
        SearchResults: ISsimSearchResult[];
    }
    interface ILoadSsimDataRequest {
        Name: string;
        Description: string;
        FamilyId: string;
        SsimDataSourceUrl: string;
        DataSourceType: string;
        DataSourceProtocol: string;
        DataSourceAuthentication: string;
    }
    enum TaskStatusCode {
        NotStarted = 0,
        InDraft = 1,
        Running = 2,
        Failed = 3,
        Finished = 4,
        Canceled = 5,
    }
    interface TaskStatus {
        StatusCode: TaskStatusCode;
        StatusDetail: string;
    }
    interface JobInstance {
        Status: TaskStatus;
    }
    interface DataImportInstance {
        Id: string;
        Source: string;
        DestinationName: string;
        DestinationDescription: string;
        ImportStatus: TaskStatus;
        ActivityId: string;
    }
}

/// <reference path="../../Global.refs.d.ts" />
/// <reference path="Common.d.ts" />
/// <reference path="../DataContractInterfaces-v1.d.ts" />
/// <reference path="../DataLabClient.d.ts" />
declare module DataLab.DataContract {
    enum ModelPackageStatusCode {
        InTesting = 0,
        ReadyForProduction = 1,
        DeployedToProduction = 2,
        Retired = 3,
    }
    enum DiagnosticsTraceLevel {
        None,
        Error,
        All,
    }
    enum WebServiceType {
        Staging,
        Production,
    }
    interface IInputOutputPortMetadata {
        GraphModuleNodeId: string;
        PortName: string;
        Schema: string;
        Id?: string;
        Name?: string;
        OutputType?: string;
    }
    interface IParameterRule {
        Values: string[];
    }
    interface IGlobalParameterMetadata {
        Name: string;
        Type: string;
        Description: string;
        DefaultValue: string;
        ParameterRules: IParameterRule[];
    }
    interface IAddModelPackageRequest {
        StatusCode: ModelPackageStatusCode;
        Workflow: v1.IExperimentGraphModel;
        Inputs: IInputOutputPortMetadata[];
        Output?: IInputOutputPortMetadata;
        Outputs?: IInputOutputPortMetadata[];
        InputsMetadata?: Util.IMap<Util.IMap<string>>;
        OutputMetadata?: Util.IMap<string>;
        OutputsMetadata?: Util.IMap<Util.IMap<string>>;
        LinkedExperimentId: string;
        Parameters?: IGraphParameterDescriptor[];
        UpdatableInputs?: IInputOutputPortMetadata[];
    }
    interface IUpdateModelPackageRequest {
        StatusCode: ModelPackageStatusCode;
        InputsMetadata: Util.IMap<Util.IMap<string>>;
        OutputMetadata?: Util.IMap<string>;
        OutputsMetadata?: Util.IMap<Util.IMap<string>>;
        GlobalParametersMetadata: IGlobalParameterMetadata[];
    }
    interface IModelPackageInfo {
        Id: string;
        Workflow: v1.IExperimentGraphModel;
        Inputs: IInputOutputPortMetadata[];
        Outputs: IInputOutputPortMetadata[];
        GlobalParametersMetadata: IGlobalParameterMetadata[];
        CreationTime: string;
        InputsMetadata: Util.IMap<Util.IMap<string>>;
        OutputsMetadata: Util.IMap<Util.IMap<string>>;
        LinkedExperimentId: string;
        StatusCode: ModelPackageStatusCode;
        UpdatableInputs: IInputOutputPortMetadata[];
    }
    interface IAddOrUpdateWebServiceRequest {
        ModelPackageId: string;
        WebServiceType: WebServiceType;
        DiagnosticsSettings: IDiagnosticsSettings;
    }
    interface IAddOrUpdateWebServiceGroupRequest {
        Name: string;
        Description: string;
        AllowAnonymousTest: boolean;
    }
    interface IDiagnosticsSettings {
        DiagnosticsBESJobsPath: string;
        DiagnosticsConnectionString: string;
        DiagnosticsExpiryTime: string;
        DiagnosticsRRSInitializationsPath: string;
        DiagnosticsRRSRequestsPath: string;
        DiagnosticsTraceLevel: DiagnosticsTraceLevel;
    }
    interface IWebService {
        Id: string;
        ModelPackageId: string;
        Location: string;
        CreationTime: string;
        BatchLocation: string;
        PrimaryKey: string;
        SecondaryKey: string;
        AllowAnonymousTest: boolean;
        DiagnosticsSettings: IDiagnosticsSettings;
    }
    interface IWebServiceGroup {
        Id: string;
        Name: string;
        CreationTime: string;
        Description: string;
        ModelPackages: IModelPackageInfo[];
        StagingWebService: IWebService;
        ProductionWebService: IWebService;
        Endpoints: IWebService[];
    }
}

/// <reference path="DataLabClient.d.ts" />
declare module DataLab.DataContract {
    class BlobUploader {
        private client;
        private blob;
        private dataTypeId;
        private chunkSize;
        private numberOfChunks;
        private chunkId;
        private bytesRemaining;
        private currentPosition;
        private promise;
        private response;
        private maxRetries;
        private retryAfterSeconds;
        private numberOfRetries;
        private started;
        constructor(client: Client, blob: Blob, dataTypeId: string);
        uploadBlobAsync(): Util.Promise<any>;
        private updateUploadProgress();
        private startUploadAsync();
        private uploadInChunksAsync();
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="DataContractInterfaces-v1.d.ts" />
/// <reference path="Deserializer.d.ts" />
/// <reference path="Common/WorkspaceManagement.d.ts" />
/// <reference path="Common/OnlineSearchContracts.d.ts" />
/// <reference path="Common/WebServiceContracts.d.ts" />
/// <reference path="BlobUploader.d.ts" />
declare module DataLab.DataContract {
    interface IWorkspaceClient {
        workspaceId: string;
        workspaceFriendlyName: string;
    }
    interface IResourceClient extends IWorkspaceClient {
        getDataset(guid: string): Util.Promise<DataContract.IExperimentDataResource>;
        getModule(guid: string): Util.Promise<DataContract.IExperimentModule>;
        getTrainedModel(guid: string): Util.Promise<DataContract.IExperimentDataResource>;
        getTransformModule(guid: string): Util.Promise<DataContract.IExperimentDataResource>;
        listDatasetsAsync(): Util.Promise<DataContract.IExperimentDataResource[]>;
        listModulesAsync(): Util.Promise<DataContract.IExperimentModule[]>;
        listTrainedModelsAsync(): Util.Promise<DataContract.IExperimentDataResource[]>;
        listTransformModulesAsync(): Util.Promise<DataContract.IExperimentDataResource[]>;
        listDataTypesAsync(): Util.Promise<DataContract.IDatatype[]>;
        deleteDatasetFamilyAsync?(guid: string): Util.Promise<void>;
        deleteTrainedModelFamilyAsync?(guid: string): Util.Promise<void>;
    }
    interface IApplicationClient extends IWorkspaceClient {
        listExperimentsAsync(filters: Model.IExperimentInfoFilter): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        listWorkspacesAsync(): Util.Promise<DataContract.v1.IWorkspaceSettings[]>;
        createExperimentStoragePackageAsync(experimentId: string, clearCredentials: boolean, newExperimentName?: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        getExperimentStoragePackageAsync(storagePackageId: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        createExperimentFromStoragePackageAsync(destinationWorkspaceId: string, packageUri: string): Util.Promise<DataContract.v1.IExperimentSubmissionResult>;
        getExperimentLineageAsync(experimentId: string): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        getExperimentAsync(experimentId: string): Util.Promise<any>;
        publishExperimentAsync(publishExperimentRequest: v1.IPublishExperimentRequest): Util.Promise<v1.IExperimentPublishingResult>;
        submitExperimentAsync(submitExperimentRequest: v1.ISubmitExperimentRequest): Util.Promise<v1.IExperimentSubmissionResult>;
        updateExperimentAsync(experimentId: string, eTag: string, submitExperimentRequest: v1.ISubmitExperimentRequest): Util.Promise<string>;
        deleteExperimentAsync(experimentId: string, eTag: string): Util.Promise<void>;
        deleteExperimentAndAncestorsAsync(experimentId: string, eTag: string): Util.Promise<void>;
        cancelExperimentAsync(experimentId: string): Util.Promise<void>;
        promoteOutputToDatasetAsync(promoteDatasetRequest: IAddDatasourceRequest_Promote): Util.Promise<string>;
        promoteOutputToTrainedModelAsync(promoteTrainedModelRequest: IAddTrainedModelRequest_Promote): Util.Promise<string>;
        promoteOutputToTransformModuleAsync(promoteTransformModuleRequest: IAddTransformRequest_Promote): Util.Promise<string>;
        commitResourceAsDatasetAsync(commitDatasetRequest: IAddDatasourceRequest_Uploaded): Util.Promise<string>;
        buildResourceAsCustomModulePackageAsync(buildCustomModulePackageRequest: IBuildCustomModulePackageRequest_Uploaded): Util.Promise<string[]>;
        uploadResourceAsync(resource: Blob, dataTypeId: string): Util.Promise<DataContract.IResourceUploadInfo>;
        getDataflowAsync(dataflowId: string): Util.Promise<any>;
        createWebServiceGroupAsync(addWebServiceGroupRequest: DataContract.IAddOrUpdateWebServiceGroupRequest): Util.Promise<string>;
        getWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<DataContract.IWebServiceGroup>;
        deleteWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<void>;
        updateWebServiceGroupAsync(webServiceGroupId: string, updateWebServiceGroupRequest: DataContract.IAddOrUpdateWebServiceGroupRequest): Util.Promise<void>;
        listWebServiceGroupsAsync(): Util.Promise<DataContract.IWebServiceGroup[]>;
        registerModelPackageAsync(webServiceGroupId: string, addModelPackageRequest: IAddModelPackageRequest): Util.Promise<string>;
        listModelPackagesAsync(webServiceGroupId: string): Util.Promise<DataContract.IModelPackageInfo[]>;
        getModelPackageAsync(webServiceGroupId: string, modelPackageId: string): Util.Promise<DataContract.IModelPackageInfo>;
        updateModelPackageAsync(webServiceGroupId: string, modelPackageId: string, updateModelPackageRequest: IUpdateModelPackageRequest): Util.Promise<void>;
        registerWebServiceAsync(webServiceGroupId: string, registerWebServiceRequest: DataContract.IAddOrUpdateWebServiceRequest): Util.Promise<string>;
        getWebServiceAsync(webServiceGroupId: string, webServiceId: string): Util.Promise<DataContract.IWebService>;
        updateWebServiceAsync(webServiceGroupId: string, webServiceId: string, updateWebServiceRequest: DataContract.IAddOrUpdateWebServiceRequest): Util.Promise<void>;
        invokeScoreWebServiceAsync(webServiceGroupId: string, webserviceId: string, inputs: Util.IMap<string>, globalParameters: Util.IMap<string>): Util.Promise<string>;
        createCommunityExperimentAsync(request: DataContract.IAddOrUpdateCommunityExperimentRequest, packageUri: string): Util.Promise<string>;
        getCommunityExperimentIdAsync(workspaceId: string, packageUri: string, communityUri: string): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        getWorkspaceSettingsAsync(): Util.Promise<v1.IWorkspaceSettings>;
        updateWorkspaceSettings(workspaceSettingsRequest: v1.IWorkspaceSettings): Util.Promise<any>;
        saveCredential(request: ISaveCredentialRequest): Util.Promise<any>;
        signOut(): Util.Promise<string>;
        getModuleVisualizationData(experimentId: string, nodeId: string, portName: string): Util.Promise<any>;
        getModuleVisualizationDataItem(experimentId: string, nodeId: string, portName: string, item: string, type: string, subtype: string, parseAs: string): Util.Promise<any>;
        getDatasetVisualizationData(datasetId: string): Util.Promise<any>;
        getModuleOutputSchema(experimentId: string, nodeId: string, portName: string): Util.Promise<DataLab.Model.ISchema>;
        getDatasetSchema(datasetId: string): Util.Promise<DataLab.Model.ISchema>;
        getModuleOutput(experimentId: string, nodeId: string, portName: string): Util.Promise<any>;
        getModuleErrorLog(experimentId: string, nodeId: string): Util.Promise<any>;
        getStorageSpaceQuotaAsync(): Util.Promise<v1.IQuotaResponse>;
        getExperimentDetailsAsync(experimentId: string): Util.Promise<string>;
        updateExperimentDetailsAsync(experimentId: string, details: string): Util.Promise<void>;
        listProjects(experimentId: string): Util.Promise<IProject[]>;
        createProject(request: IAddOrUpdateProjectRequest): Util.Promise<IProject>;
        updateProject(projectId: string, request: IAddOrUpdateProjectRequest): Util.Promise<IProject>;
        getResourceDependantsAsync?(familyId: string): Util.Promise<DataLab.DataContract.v1.IAssetDependencyResponse>;
    }
    var ResponseType: {
        ArrayBuffer: string;
        JSON: string;
        Blob: string;
        Document: string;
        Text: string;
        None: string;
    };
    interface IRequestSettings {
        /** GET, POST, etc. GET is the default. */
        type?: string;
        /** Data to send. The data may be a string, Blob, etc.
            Anything other than a Blob is first serialized with JSON.stringify. */
        data?: any;
        /** Supported XHR2 response type. The default is ResponseType.JSON. See http://www.w3.org/TR/XMLHttpRequest2/#the-response-attribute */
        responseType?: string;
        /** If set, the request promise will generate progress notifications for the upload of 'data'. The default is 'false'. */
        reportUploadProgress?: boolean;
    }
    class Client implements IResourceClient, IApplicationClient {
        /** Base URL used for sending requests to the service. By default, the service base URL
            is /api/, which will result in requests being sent to the same domain. This property
            can be changed after construction to affect subsequent requests. */
        serviceBaseAddress: string;
        workspaceId: string;
        workspaceFriendlyName: string;
        private authToken;
        private redirectOn401;
        private cachedAccessToken;
        constructor(workspaceId: string, workspaceFriendlyName: string, authToken?: string, redirectOn401?: boolean);
        private sendRequest(workspaceRelativeUrl, settings?, additionalHeaders?);
        /** Sends an AJAX request.
            By default, the returned data is deserialized as JSON before being passed to any callbacks.
            @param {string} workspaceRealtiveUrl A URL relative to the workspace, i.e. X in /api/workspaces/<workspace id>/<relative url>
            @param {IRequestSettings} Optional request settings such as the data to send and HTTP method.
            @return {Util.Promise<any>} A promise for the completion of the request. If settings.reportUploadProgress is set, the promise will generate progress
                                   events (and so is more specifically a {Util.IProgressPromise}).
        */
        private sendRequestHelper(serviceBaseUrl, workspaceRelativeUrl, settings?, additionalHeaders?);
        private sendRequestHelperWithRetry(serviceBaseUrl, workspaceRelativeUrl, settings, additionalHeaders, deferred, isSecondAttempt);
        signOut(): Util.Promise<string>;
        listDatasetsAsync(): Util.Promise<DataContract.IExperimentDataResource[]>;
        getDataset(guid: string): Util.Promise<DataContract.IExperimentDataResource>;
        deleteDatasetFamilyAsync(guid: string): Util.Promise<void>;
        getTrainedModel(guid: string): Util.Promise<DataContract.IExperimentDataResource>;
        listTrainedModelsAsync(): Util.Promise<DataContract.IExperimentDataResource[]>;
        deleteTrainedModelFamilyAsync(guid: string): Util.Promise<void>;
        getTransformModule(guid: string): Util.Promise<DataContract.IExperimentDataResource>;
        listTransformModulesAsync(): Util.Promise<DataContract.IExperimentDataResource[]>;
        listModulesAsync(): Util.Promise<DataContract.IExperimentModule[]>;
        getModule(guid: string): Util.Promise<DataContract.IExperimentModule>;
        listWorkspacesAsync(): Util.Promise<DataContract.v1.IWorkspaceSettings[]>;
        createExperimentStoragePackageAsync(experimentId: string, clearCredentials: boolean, newExperimentName?: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        getExperimentStoragePackageAsync(storagePackageId: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        createExperimentFromStoragePackageAsync(workspaceId: string, packageUri: string): Util.Promise<DataContract.v1.IExperimentSubmissionResult>;
        getSingleUserAsync(userId: string): Util.Promise<DataLab.WorkspaceManagement.IUser>;
        listUsersAndInvitationsAsync(): Util.Promise<DataLab.WorkspaceManagement.IUserInvitation[]>;
        removeUser(userId: string): Util.Promise<any>;
        sendInvitation(invitation: DataLab.WorkspaceManagement.ISendInvitationRequest): Util.Promise<DataLab.WorkspaceManagement.ISendInvitationSingleResponse[]>;
        acceptInvitation(token: string): Util.Promise<any>;
        removeInvitation(invitationId: string): Util.Promise<any>;
        listCredentials(): Util.Promise<ICredentialKeyParts[]>;
        verifyCredential(keyParts: DataContract.ICredentialKeyParts): Util.Promise<boolean>;
        deleteCredential(keyParts: DataContract.ICredentialKeyParts): Util.Promise<boolean>;
        saveCredential(instance: DataContract.ISaveCredentialRequest): Util.Promise<string>;
        ssimSearch(searchQuery: string, page?: number, pageSize?: number): Util.Promise<DataLab.OnlineSearch.ISsimSearchResults>;
        saveSsimData(request: OnlineSearch.ILoadSsimDataRequest): Util.Promise<string>;
        listDataImports(): Util.Promise<DataLab.OnlineSearch.DataImportInstance[]>;
        getDataImport(dataImportId: string): Util.Promise<DataLab.OnlineSearch.DataImportInstance>;
        deleteDataImport(dataImportId: string): Util.Promise<any>;
        listExperimentsAsync(filters?: Model.IExperimentInfoFilter): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        generateRequestURI(relativeURI: string, options: Util.IMap<string>): string;
        listDataflowsAsync(): Util.Promise<any>;
        getExperimentAsync(experimentId: string): Util.Promise<any>;
        getExperimentLineageAsync(experimentId: string): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        getDataflowAsync(dataflowId: string): Util.Promise<any>;
        createWebServiceGroupAsync(addWebServiceGroupRequest: DataContract.IAddOrUpdateWebServiceGroupRequest): Util.Promise<string>;
        getWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<DataContract.IWebServiceGroup>;
        deleteWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<void>;
        updateWebServiceGroupAsync(webServiceGroupId: string, updateWebServiceGroupRequest: DataContract.IAddOrUpdateWebServiceGroupRequest): Util.Promise<void>;
        listWebServiceGroupsAsync(): Util.Promise<DataContract.IWebServiceGroup[]>;
        registerModelPackageAsync(webServiceGroupId: string, addModelPackageRequest: IAddModelPackageRequest): Util.Promise<string>;
        listModelPackagesAsync(webServiceGroupId: string): Util.Promise<DataContract.IModelPackageInfo[]>;
        getModelPackageAsync(webServiceGroupId: string, modelPackageId: string): Util.Promise<DataContract.IModelPackageInfo>;
        updateModelPackageAsync(webServiceGroupId: string, modelPackageId: string, updateModelPackageRequest: IUpdateModelPackageRequest): Util.Promise<void>;
        registerWebServiceAsync(webServiceGroupId: string, registerWebServiceRequest: DataContract.IAddOrUpdateWebServiceRequest): Util.Promise<string>;
        getWebServiceAsync(webServiceGroupId: string, webServiceId: string): Util.Promise<DataContract.IWebService>;
        updateWebServiceAsync(webServiceGroupId: string, webServiceId: string, updateWebServiceRequest: DataContract.IAddOrUpdateWebServiceRequest): Util.Promise<void>;
        invokeScoreWebServiceAsync(webServiceGroupId: string, webServiceId: string, featureVector: Util.IMap<string>, globalParameters: Util.IMap<string>): Util.Promise<string>;
        createCommunityExperimentAsync(request: DataContract.IAddOrUpdateCommunityExperimentRequest, packageUri: string): Util.Promise<string>;
        getCommunityExperimentIdAsync(workspaceId: string, packageUri: string, communityUri: string): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        listDataTypesAsync(): Util.Promise<DataContract.IDatatype[]>;
        publishExperimentAsync(publishExperimentRequest: v1.IPublishExperimentRequest): Util.Promise<v1.IExperimentPublishingResult>;
        submitExperimentAsync(submitExperimentRequest: v1.ISubmitExperimentRequest): Util.Promise<v1.IExperimentSubmissionResult>;
        updateExperimentAsync(experimentId: string, eTag: string, submitExperimentRequest: v1.ISubmitExperimentRequest): Util.Promise<string>;
        deleteExperimentAsync(experimentId: string, eTag: string): Util.Promise<void>;
        deleteExperimentAndAncestorsAsync(experimentId: string, eTag: string): Util.Promise<void>;
        cancelExperimentAsync(experimentId: string): Util.Promise<void>;
        promoteOutputToDatasetAsync(promoteDatasetRequest: IAddDatasourceRequest_Promote): Util.Promise<string>;
        promoteOutputToTrainedModelAsync(promoteTrainedModelRequest: IAddTrainedModelRequest_Promote): Util.Promise<string>;
        promoteOutputToTransformModuleAsync(promoteTransformModuleRequest: IAddTransformRequest_Promote): Util.Promise<string>;
        getModuleVisualizationData(experimentId: string, nodeId: string, portName: string): Util.Promise<any>;
        getModuleVisualizationDataItem(experimentId: string, nodeId: string, portName: string, item: string, type: string, subtype: string, parseAs: string): Util.Promise<any>;
        getDatasetVisualizationData(datasetId: string): promise<any>;
        getModuleOutputSchema(experimentId: string, nodeId: string, portName: string): Util.Promise<DataLab.Model.ISchema>;
        getDatasetSchema(datasetId: string): Util.Promise<DataLab.Model.ISchema>;
        getModuleOutput(experimentId: string, nodeId: string, portName: string): Util.Promise<any>;
        getModuleErrorLog(experimentId: string, nodeId: string): Util.Promise<any>;
        commitResourceAsDatasetAsync(commitDatasetRequest: IAddDatasourceRequest_Uploaded): Util.Promise<string>;
        getResourceDependantsAsync(familyId: string): Util.Promise<DataLab.DataContract.v1.IAssetDependencyResponse>;
        buildResourceAsCustomModulePackageAsync(commitCustomModuleRequest: IBuildCustomModulePackageRequest_Uploaded): Util.Promise<string[]>;
        private getCustomModuleIds(activityId);
        private pollCustomModuleIds(activityId);
        private setupCustomModuleResponseHandler(activityId, fetch, result, interval, runtime, timeout);
        /** This corresponds to AddDatasource on the service. sourceOrigin must be an enum value from DataContract.DataSourceOrigin
            (e.g. FromOutputPromotion). A public variant exists for each supported origin that takes the additional origin-specific field,
            e.g. IAddDatasourceRequest_Promote. */
        private addDatasetAsync(addDatasetRequest, sourceOrigin);
        private addTrainedModelAsync(addTrainedModelRequest, sourceOrigin);
        private addTransformModuleAsync(addTransformModuleRequest, sourceOrigin);
        uploadResourceAsync(resource: Blob, dataTypeId: string): Util.Promise<DataContract.IResourceUploadInfo>;
        getWorkspaceSettingsAsync(): Util.Promise<v1.IWorkspaceSettings>;
        updateWorkspaceSettings(workspaceSettingsRequest: v1.IWorkspaceSettings): Util.Promise<any>;
        getJobInstance(jobId: string): Util.Promise<DataLab.OnlineSearch.JobInstance>;
        getStorageSpaceQuotaAsync(): Util.Promise<v1.IQuotaResponse>;
        getExperimentDetailsAsync(experimentId: string): Util.Promise<string>;
        updateExperimentDetailsAsync(experimentId: string, details: string): Util.Promise<void>;
        listProjects(experimentId?: string): Util.Promise<IProject[]>;
        createProject(request: IAddOrUpdateProjectRequest): Util.Promise<IProject>;
        updateProject(projectId: string, request: IAddOrUpdateProjectRequest): Util.Promise<IProject>;
        initiateResourceUpload(dataTypeId: string): Util.Promise<DataContract.IResourceUploadInfo>;
        uploadBlobChunk(blobChunk: Blob, dataTypeId: string, uploadId: string, chunkId: number, numberOfChunks: number): Util.Promise<DataContract.IResourceUploadInfo>;
    }
}

/// <reference path="Global.refs.d.ts" />
/// <reference path="PromiseQueue.d.ts" />
/// <reference path="Model/Dataset.d.ts" />
/// <reference path="Model/Module.d.ts" />
/// <reference path="Model/TrainedModel.d.ts" />
/// <reference path="Model/Transform.d.ts" />
/// <reference path="Contracts/DataLabClient.d.ts" />
/// <reference path="Contracts/DataContractInterfaces-v1.d.ts" />
declare module DataLab {
    interface ICacheBackend<T> {
        fetch(key: string): Util.Promise<T>;
        list(): Util.Promise<IKeyValuePair<T>[]>;
        deleteFamily?(guid: string): Util.Promise<void>;
    }
    interface IKeyValuePair<T> {
        key: string;
        value: T;
    }
    interface ICategoryInfoMap extends DataLab.IObservableMap<ICategoryInfoMap> {
    }
    interface IPendingDataset {
        id: string;
        name: string;
        promise: Util.Promise<DataLab.Model.Dataset>;
    }
    interface IApplicationCache {
        moduleCache: IResourceCache<DataLab.Model.Module>;
        datasetCache: IResourceCache<DataLab.Model.Dataset>;
        trainedModelCache: IResourceCache<DataLab.Model.TrainedModel>;
        transformModulesCache: IResourceCache<DataLab.Model.Transform>;
        dataTypeRegistry: Model.DataTypeRegistry;
        moduleCategoryRegistry: ICategoryInfoMap;
        datasetCategoryRegistry: ICategoryInfoMap;
        datasetsPrefetched: KnockoutObservable<boolean>;
        modulesPrefetched: KnockoutObservable<boolean>;
        trainedModelsPrefetched: KnockoutObservable<boolean>;
        transformModulesPrefetched: KnockoutObservable<boolean>;
        allPrefetched: KnockoutComputed<boolean>;
        addCategory: (category: string, registry: ICategoryInfoMap, parentCategoryPath?: string[]) => void;
    }
    class ApplicationCache implements IApplicationCache {
        private client;
        datasetsPrefetched: KnockoutObservable<boolean>;
        modulesPrefetched: KnockoutObservable<boolean>;
        trainedModelsPrefetched: KnockoutObservable<boolean>;
        transformModulesPrefetched: KnockoutObservable<boolean>;
        datatypesPrefetched: KnockoutObservable<boolean>;
        datasetsPrefetchPromise: Util.Promise<any>;
        modulesPrefetchPromise: Util.Promise<any>;
        trainedModelsPrefetchPromise: Util.Promise<any>;
        transformModulesPrefetchPromise: Util.Promise<any>;
        allPrefetched: KnockoutComputed<boolean>;
        moduleCache: IResourceCache<DataLab.Model.Module>;
        datasetCache: DatasetResourceCache;
        trainedModelCache: IResourceCache<DataLab.Model.TrainedModel>;
        transformModulesCache: IResourceCache<DataLab.Model.Transform>;
        dataTypeRegistry: Model.DataTypeRegistry;
        moduleCategoryRegistry: ICategoryInfoMap;
        datasetCategoryRegistry: ICategoryInfoMap;
        localPendingDatasets: KnockoutObservableArray<IPendingDataset>;
        /**
          * Creates a cache for modules, datasets, and datatypes.
          * The caches must be loaded with prefetch() before use.
          * @constructor
          * @this {ApplicationCache}
          * @param {IDatasetModuleClient} the backend client
         **/
        constructor(client: DataLab.DataContract.IResourceClient);
        /**
          * Preloads the module, dataset, and datatype caches by fetching lists of each from the service.
         **/
        prefetch(): void;
        addCategory(category: string, registry: ICategoryInfoMap, parentCategoryPath?: string[]): void;
        private createResourceBackend<T, U>(getSerialized, listSerialized, deserialize, deleteFamily?);
        private deserializeModule(moduleContract);
        private deserializeDataset(datasetContract);
        private deserializeTrainedModel(trainedModelContract);
        private deserializeTransformModule(transformModuleContract);
        private assertPrefetched();
    }
    interface IClientCache<T> {
        setItem(key: string, val: T): void;
        getItemIfCached(key: string): T;
        getItem(key: string): DataLab.Util.Promise<T>;
        items: DataLab.IObservableMap<T>;
        clear?(): void;
    }
    interface IResourceCache<T extends DataLab.Model.Resource> extends IClientCache<T> {
        resourceFamilyUpdated: KnockoutSubscribable<T>;
        getLatestResourceInFamily(familyId: string): T;
        removeFamilyFromCache?(familyId: string): void;
        deleteFamily?(familyId: string): Util.Promise<void>;
    }
    /** A ClientCache represents a set of immutable entities, stored by key. Since each entity is assumed to be immutable,
        updates for existing keys are not allowed.

        A cache is backed by an {@see ICacheBackend}, which provides async 'fetch' and 'list' operations. On a cache miss,
        ({@see ClientCache.getItem}), a 'fetch' is issued to attempt to load the missing item (this implies that the caller
        knows a valid key ahead of time). A 'list' operation can be triggered via {@see ClientCache.loadNewItems}, which
        will store any newly seen items (existing keys are ignored due to the immutability assumption).
        */
    class ClientCache<T> implements IClientCache<T> {
        private data;
        private backend;
        private outstandingPromises;
        /**
          * Creates a read-only data cache using strings to demark cache lines.
          * @constructor
          * @this {ClientCache}
          * @param {ICacheBackend} the backend used to fetch data that doesn't exist in cache
         */
        constructor(backend: ICacheBackend<T>);
        /**
          * Returns a read-only observable map of items currently in the cache.
         */
        items: DataLab.IObservableMap<T>;
        /**
          * Explicitly and immediately set the item associated with key. If the key already exists,
          * calling this results in an exception, as it violates the notion of a read-only cache. This
          * function is useful for prepopulating the cache without backend fetch operations.
          *
          * setItem is the only method which modifies the cache, so subclasses may override it to observe cache changes.
          *
          * @param {string} key The cache line to associate
          * @param {any} val The value to set
          * @throws {string} When the same line is written twice
         */
        setItem(key: string, val: T): void;
        /**
          * Immediately returns the item in the cache if it exists. If not, it returns null.
          * This function will never invoke a backend fetch call.
          * @param {string} key The string for whose cache line to fetch
          * @return {any} The fetched cache line for key or null if the item isn't in the cache
         */
        getItemIfCached(key: string): T;
        /**
          * Returns a jquery promise that will return the item associated with key. Values
          * are cached so only one backend request is ever issued for a given key. Concurrent
          * requests for the same item collapse into the same promise when the item is not
          * in the cache. When the item is in the cache, this returned promise resolves immediately.
          * @param {string} key The string for whose cache line to fetch
          * @return {JQueryPromise} The promise containing the value for the requested cache line when resolved.
         */
        getItem(key: string): Util.Promise<T>;
        /**
          * Loads additional items into the cache based on the cache backend's 'list' operation. Note that
          * items will be added, but not removed (even if existing items do not appear in the returned list).
          *
          * @return {JQueryPromise} The promise containing the value for the requested cache line when resolved.
         */
        loadNewItems(): Util.Promise<IKeyValuePair<T>[]>;
        clear(): void;
        private updateIsPendingForKey(key);
    }
    /** A ResourceCache is a ClientCache which understands the version relationships of {@see DataLab.Model.Resource} instances.
        As with ClientCache, each cached entity is considered and assumed to be immutable. As an exception, the isLatest flag
        on each cached Resource is kept up to date as newer related resources (those with the same familyId) are added. */
    class ResourceCache<T extends DataLab.Model.Resource> extends ClientCache<T> implements IResourceCache<T> {
        /** Fired when a newer resource version has been added to a resource family. It has been marked as the latest version (isLatest() === true). */
        resourceFamilyUpdated: KnockoutSubscribable<{}>;
        private latestResourceByFamily;
        private _backend;
        constructor(backend: ICacheBackend<T>);
        /** Returns the latest resource in the given resource family. If there are no known resources in the family, returns null.
            Attempting to look up the latest resource in the null family (familyId === null) returns null. */
        getLatestResourceInFamily(familyId: string): T;
        setItem(key: string, val: T): void;
        removeFamilyFromCache(familyId: string): void;
        deleteFamily(familyId: string): Util.Promise<void>;
        clear(): void;
        private setIsLatestClientVersion(resource, isLatest);
        private updateIsLatestClientVersion(resource, other);
    }
    /** A resource cache for datasets that filters data sources that have outstanding pending schema jobs.  This way,
        they do not show up in the palette until the schema job is complete */
    class DatasetResourceCache implements IResourceCache<DataLab.Model.Dataset> {
        private backend;
        private resourceCache;
        private outstandingPromises;
        private pollInterval;
        private maxPollInterval;
        private maxSchemaJobWaitHours;
        constructor(backend: ICacheBackend<DataLab.Model.Dataset>);
        resourceFamilyUpdated: KnockoutSubscribable<any>;
        items: DataLab.IObservableMap<DataLab.Model.Dataset>;
        getLatestResourceInFamily(familyId: string): DataLab.Model.Dataset;
        setItem(key: string, val: DataLab.Model.Dataset): void;
        getItemIfCached(key: string): DataLab.Model.Dataset;
        getItem(key: string): Util.Promise<DataLab.Model.Dataset>;
        loadNewItems(): Util.Promise<IKeyValuePair<DataLab.Model.Dataset>[]>;
        handlePendingInList(dataset: DataLab.Model.Dataset): void;
        getPromiseForPendingItem(key: string): Util.Promise<DataLab.Model.Dataset>;
        clear(): void;
        removeFamilyFromCache(familyId: string): void;
        deleteFamily(familyId: string): Util.Promise<void>;
        private okToPoll(dataset);
        private pollDataSource(key, result, interval);
        private setupResponseHandler(key, fetch, result, interval);
        private computeBackoff(interval);
        private setupAfterActions(key, result);
    }
}

declare module DataLab.Configuration {
    interface IClientConfiguration {
        AzureManagementPortalUrl: string;
    }
    var ClientConfiguration: IClientConfiguration;
}

declare module DataLab {
    class ImageContent {
        dataUrl: string;
        size: number;
        type: string;
        base64Text: string;
        constructor(dataUrl: string, file: Blob);
        constructor(dataUrl: string, type: string);
    }
}

/// <reference path="Global.refs.d.ts" />
declare module DataLab {
    module Performance {
        module ResourceTimings {
            var isEnabled: boolean;
            var isSetBufferSizeSupported: boolean;
            var beforeClearCallback: () => void;
            var dataForFlush: any;
            var doClearWhenAllSent: boolean;
            function clear(): void;
            function send(data: Object, retries?: number, interval?: number): void;
            function flush(): void;
            function setBufferSize(size: number): void;
        }
        var isEnabled: boolean;
        var doClearResourceTimingsOnIntervalStart: boolean;
        function logNavigationTiming(): void;
        function intervalStart(name: string): void;
        function intervalEnd(): void;
    }
}

/// <reference path="Global.refs.d.ts" />
declare module DataLab.Util {
    class Repeater<T> extends Disposable {
        private action;
        private promise;
        private delay;
        private timer;
        private inFlight;
        private repeating;
        constructor(callback: () => DataLab.Util.Promise<T>, timeoutInMs: number);
        start(): void;
        doActionNow(): DataLab.Util.Promise<any>;
        stop(): void;
        dispose(): void;
        private doAction();
    }
}

/// <reference path="Global.refs.d.ts" />
declare module DataLab.TestMessaging {
    module Constants {
        var AnimationComplete: string;
    }
    interface ITestMessage {
        type: string;
        extensionData?: any;
    }
    /**
      * Post a message for the test page to notify when things like animations complete. This lets us avoid
      * retry/waits in tests.
     **/
    function postMessage(message: ITestMessage): void;
}

/// <reference path="Global.refs.d.ts" />
/// <reference path="Features.d.ts" />
/// <reference path="Model/WorkspaceSettings.d.ts" />
/// <reference path="Model/ModuleNode.d.ts" />
declare module DataLab.Trial {
    interface IUsageLimits {
        maxModuleCount: number;
        restrictedModules: string[];
        timeLimit: number;
        moduleRunTimeLimit: number;
        storageLimit: number;
        maxDatasetUploadSize: number;
    }
    class RestrictedFeatureError {
        feature: string;
        type: string;
        value: any;
        constructor(xhr: XMLHttpRequest);
    }
    function setContext(global: any): void;
    function setUsageLimits(usageLimits: IUsageLimits): void;
    function getWorkspaceType(): DataLab.Model.WorkspaceType;
    function isWorkspaceTypeFree(): boolean;
    function isWorkspaceTypeAnonymous(): boolean;
    function filterSample(experiment: DataContract.v1.IExperimentInfo): boolean;
    function isDatasetUploadEnabled(): boolean;
    function isModuleUploadEnabled(): boolean;
    function isModuleEnabledById(id: string): boolean;
    function isWebServicePublishEnabled(): boolean;
    function isPublishToCommunityEnabled(): boolean;
    function isNumberOfModulesUnrestricted(): boolean;
    function isWorkspaceStorageLimited(): boolean;
    function getMaxNumberOfModules(): number;
    function getTimeLimit(): number;
    function getModuleRunTimeLimit(): number;
    function getStorageLimit(): number;
    function getMaxDatasetUploadSize(): number;
}

declare module DataLab.Util.Images {
    interface IImageResizeOptions {
        maxWidth?: number;
        maxHeight?: number;
    }
    var FileSelectionErrors: {
        fileTooLarge: string;
        errorLoadingIntoImage: string;
    };
    function resizeFileIfNecessary(blob: Blob, resizeOptions: IImageResizeOptions, maxSizeInMegaBytes?: number): Promise<ImageContent>;
}

/// <reference path="Global.refs.d.ts" />
import promise = DataLab.Util.Promise;
declare module dataGateway {
    /**
      * States for the version of gateway bits that are running on premise.
     **/
    enum gatewayVersionState {
        None = 0,
        /** The version of the gateway bits running on premise are the latest available.*/
        UpToDate = 1,
        /** There is a newer version of the gateway bits available for installation. The current version is not scheduled for expiration. */
        NewVersionAvailable = 2,
        /** The version of the gateway will soon be unsupported and the gateway disconnected if the gateways is not updated soon. */
        Expiring = 3,
        Expired = 4,
        Other = 5,
    }
    enum gatewayState {
        None = 0,
        NeedRegistration = 1,
        Online = 2,
        Offline = 3,
        UpdateAvailable = 4,
        Other = 5,
    }
    /**
      * A data gateway object. This if the cloud based service record of the on premise gateway.
      * When there is a on-premise gateway that is registered, this record will have details from the on premise gateway service.
     **/
    interface IDataGateway {
        /**
          * The scope in which this namespace exists. This is a GUID. For ML studio (DataLab) this is the workspace ID.
          */
        scope: string;
        gatewayName: string;
        createTime?: Date;
        description: string;
        /** Time when the version the gateway is running will no longer be supported.*/
        expiryTime?: Date;
        /** Key for registering this gateway. This is populated only on first creation of the gateway. In all other cases regenerate key needs to be called to obtain a registration key. */
        registrationKey?: string;
        lastConnectTime?: Date;
        /** Azure location of the cloud service for this gateway. */
        location: string;
        registerTime?: Date;
        status: gatewayState;
        version: string;
        versionStatus: gatewayVersionState;
        provisioningState: string;
    }
    interface IDataGatewayCredentiralEntryRequest {
        id: string;
        url: string;
    }
    /**
      * Methods for manageing on premise data gateways.
      * An object implementing this will have a workspace ID as the context for all methods,
      * and it is assumed the workspace ID is immuatable. Details on expected promise contract
      * are below.
     **/
    interface IDataGatewayService {
        nameAvailable(candidateName: string): promise<boolean>;
        createGateway(gatewayName: string, gatewayDescription: string): promise<void>;
        getGateways(): promise<IDataGateway[]>;
        /**
          * Deletes a data gateway from the workspace. If there is no gateway with the name passed, the call will fail with a 404 not found.
         */
        deleteGateway(gatewayName: string): promise<void>;
        generateRegistrationKey(gatewayName: string): promise<string>;
        updateGateway(gatewayName: string, gatewayDescription: string): promise<void>;
        getExpressInstallLink(gatewayName: string): promise<string>;
        getCredentialEntryRequest(gatewayName: string, serverName: string, databaseName: string): promise<IDataGatewayCredentiralEntryRequest>;
        getAreCredentialsEntered(requestId: string): promise<boolean>;
        getEnteredCredentials(requestId: string): promise<string>;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="DataContractInterfaces-v1.d.ts" />
declare module DataLab.DataContract.TestData {
    module Modules {
        var Adder: DataLab.DataContract.IExperimentModule;
        var OldAdder: DataLab.DataContract.IExperimentModule;
        var CustomUXModule: DataLab.DataContract.IExperimentModule;
        var ModuleWithAnyType: DataLab.DataContract.IExperimentModule;
        var FakeModule: DataLab.DataContract.IExperimentModule;
        var MergeFiles: DataLab.DataContract.IExperimentModule;
        var LongName: DataLab.DataContract.IExperimentModule;
        var SamosTrain: DataLab.DataContract.IExperimentModule;
        var ManyInputs: DataLab.DataContract.IExperimentModule;
        var MissingValuesRemover: DataLab.DataContract.IExperimentModule;
        var DictionaryBinner: DataLab.DataContract.IExperimentModule;
        var ParameterTest: DataLab.DataContract.IExperimentModule;
        var SamosPublish: DataLab.DataContract.IExperimentModule;
        var SamosValidate: DataLab.DataContract.IExperimentModule;
        var OptionalInputModule: DataLab.DataContract.IExperimentModule;
        var RandomFileSplitter: DataLab.DataContract.IExperimentModule;
        var CategoryColumnSelection: DataLab.DataContract.IExperimentModule;
        var ScriptedModule: DataLab.DataContract.IExperimentModule;
        var FakeModuleWithRelevantParameters: DataLab.DataContract.IExperimentModule;
        var ModuleWithNestedRelevantParameters: DataLab.DataContract.IExperimentModule;
        var DataReferenceModule: IExperimentModule;
    }
    module Datasets {
        var IntegerFile: DataLab.DataContract.IExperimentDataResource;
        var OldIntegerFile: DataLab.DataContract.IExperimentDataResource;
        var FakeData: DataLab.DataContract.IExperimentDataResource;
        var SpyNet: DataLab.DataContract.IExperimentDataResource;
        var BreastCancer: DataLab.DataContract.IExperimentDataResource;
        var SomeText: DataLab.DataContract.IExperimentDataResource;
    }
    module TrainedModels {
        var SomeText: DataLab.DataContract.IExperimentDataResource;
    }
    module Transforms {
        var SomeText: DataLab.DataContract.IExperimentDataResource;
    }
    interface IModuleMap {
        [guid: string]: DataLab.DataContract.IExperimentModule;
    }
    var ModuleMap: IModuleMap;
    interface IDataResourceMap {
        [guid: string]: DataLab.DataContract.IExperimentDataResource;
    }
    var DatasetMap: IDataResourceMap;
    var TrainedModelMap: IDataResourceMap;
    var TransformMap: IDataResourceMap;
    module Experiments {
        var SimpleExperiment: DataLab.DataContract.v1.IExperimentInfo;
        var ExperimentWithOldResources: DataLab.DataContract.v1.IExperimentInfo;
        var ExperimentWithComments: DataLab.DataContract.v1.IExperimentInfo;
        var WebServiceParameters: DataLab.DataContract.v1.IExperimentInfo;
        var FakeExperiment: DataLab.DataContract.v1.IExperimentInfo;
        var RunWithLSVM: DataLab.DataContract.v1.IExperimentInfo;
        var BreastCancer: DataLab.DataContract.v1.IExperimentInfo;
        var DraftExperiment: DataLab.DataContract.v1.IExperimentInfo;
        var InvalidExperiment: DataLab.DataContract.v1.IExperimentInfo;
        var RelevantParametersExperiment: DataLab.DataContract.v1.IExperimentInfo;
    }
    module WorkspaceSettings {
        var ContractTestDataWorkspace: DataLab.DataContract.v1.IWorkspaceSettings;
    }
    module DataTypes {
        var GenericCSV: DataLab.DataContract.IDatatype;
        var GenericTSV: DataLab.DataContract.IDatatype;
        var PlainText: DataLab.DataContract.IDatatype;
        var Any: DataLab.DataContract.IDatatype;
        var NotUpload: DataLab.DataContract.IDatatype;
    }
    module WebServices {
        var ContractTestDataExperimentPublishInfo: DataLab.DataContract.v1.IExperimentPublishInfo;
        var ContractTestDataExperimentGraphModel: DataLab.DataContract.v1.IExperimentGraphModel;
        var ContractTestDataDiagnosticsSettings: DataLab.DataContract.IDiagnosticsSettings;
        var ContractTestDataWebService: DataLab.DataContract.IWebService;
        var ContractTestDataInputOutputPortMetadata: DataLab.DataContract.IInputOutputPortMetadata;
        var ContractTestDataModelPackage: DataLab.DataContract.IModelPackageInfo;
        var ContractTestDataWebServiceGroup: DataLab.DataContract.IWebServiceGroup;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="../Model/Workspace.d.ts" />
/// <reference path="WorkspaceBackend.d.ts" />
/// <reference path="ContractTestData.d.ts" />
/// <reference path="DataContractInterfaces-v1.d.ts" />
declare module DataLab.DataContract.TestData {
    class TestDataClient implements IApplicationClient, IResourceClient {
        workspaceId: string;
        workspaceFriendlyName: string;
        listDatasetsAsync(): Util.Promise<DataContract.IExperimentDataResource[]>;
        listTrainedModelsAsync(): Util.Promise<DataContract.IExperimentDataResource[]>;
        listTransformModulesAsync(): Util.Promise<DataContract.IExperimentDataResource[]>;
        getDataset(guid: string): Util.Promise<DataContract.IExperimentDataResource>;
        getTransformModule(guid: string): Util.Promise<DataContract.IExperimentDataResource>;
        getTrainedModel(guid: string): Util.Promise<DataContract.IExperimentDataResource>;
        listModulesAsync(): Util.Promise<DataContract.IExperimentModule[]>;
        getModule(guid: string): Util.Promise<DataContract.IExperimentModule>;
        listExperimentsAsync(): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        listWorkspacesAsync(): Util.Promise<DataContract.v1.IWorkspaceSettings[]>;
        createExperimentStoragePackageAsync(experimentId: string, clearCredentials: boolean, newExperimentName?: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        getExperimentStoragePackageAsync(storagePackageId: string): Util.Promise<DataContract.v1.IExperimentStoragePackage>;
        createExperimentFromStoragePackageAsync(experimentId: string, destinationWorkspaceId: string): Util.Promise<DataContract.v1.IExperimentSubmissionResult>;
        getExperimentAsync(experimentId: string): Util.Promise<any>;
        getAncestorsAsync(experimentId: string): promise<any>;
        getDescendantsAsync(experimentId: string): promise<any>;
        getExperimentLineageAsync(experimentId: string): Util.Promise<DataContract.v1.IExperimentInfo[]>;
        listDataTypesAsync(): Util.Promise<DataContract.IDatatype[]>;
        getWorkspaceSettingsAsync(): Util.Promise<DataContract.v1.IWorkspaceSettings>;
        publishExperimentAsync(publishExperimentRequest: v1.IPublishExperimentRequest): Util.Promise<DataContract.v1.IExperimentPublishingResult>;
        getDataflowAsync(experimentId: string): Util.Promise<any>;
        createWebServiceGroupAsync(addWebServiceGroupRequest: DataContract.IAddOrUpdateWebServiceGroupRequest): Util.Promise<string>;
        getWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<DataContract.IWebServiceGroup>;
        updateWebServiceGroupAsync(webServiceGroupId: string, addWebServiceGroupRequest: DataContract.IAddOrUpdateWebServiceGroupRequest): Util.Promise<void>;
        listWebServiceGroupsAsync(): Util.Promise<DataContract.IWebServiceGroup[]>;
        deleteWebServiceGroupAsync(webServiceGroupId: string): Util.Promise<void>;
        registerModelPackageAsync(webServiceGroupId: string, addModelPackageRequest: IAddModelPackageRequest): Util.Promise<string>;
        listModelPackagesAsync(webServiceGroupId: string): Util.Promise<DataContract.IModelPackageInfo[]>;
        getModelPackageAsync(webServiceGroupId: string, modelPackageId: string): Util.Promise<DataContract.IModelPackageInfo>;
        updateModelPackageAsync(webServiceGroupId: string, modelPackageId: string, updateModelPackageRequest: IUpdateModelPackageRequest): Util.Promise<void>;
        registerWebServiceAsync(webServiceGroupId: string, registerWebServiceRequest: DataContract.IAddOrUpdateWebServiceRequest): Util.Promise<string>;
        getWebServiceAsync(webServiceGroupId: string, webServiceId: string): Util.Promise<DataContract.IWebService>;
        updateWebServiceAsync(webServiceGroupId: string, webServiceId: string, updateWebServiceRequest: DataContract.IAddOrUpdateWebServiceRequest): Util.Promise<void>;
        invokeScoreWebServiceAsync(webServiceGroupId: string, webServiceId: string, inputs: Util.IMap<string>, globalParameters: Util.IMap<string>): Util.Promise<string>;
        createCommunityExperimentAsync(request: DataContract.IAddOrUpdateCommunityExperimentRequest): Util.Promise<string>;
        getCommunityExperimentIdAsync(workspaceId: string, packageUri: string, communityUri: string): Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        submitExperimentAsync(submitExperimentRequest: v1.ISubmitExperimentRequest): Util.Promise<DataContract.v1.IExperimentSubmissionResult>;
        updateExperimentAsync(experimentId: string, eTag: string, submitExperimentRequest: v1.ISubmitExperimentRequest): Util.Promise<string>;
        deleteExperimentAsync(experimentId: string, eTag: string): Util.Promise<void>;
        deleteExperimentAndAncestorsAsync(experimentId: string, eTag: string): Util.Promise<void>;
        cancelExperimentAsync(experimentId: string): Util.Promise<void>;
        promoteOutputToDatasetAsync(promoteDatasetRequest: IAddDatasourceRequest_Promote): Util.Promise<string>;
        promoteOutputToTrainedModelAsync(promoteTrainedModelRequest: IAddTrainedModelRequest_Promote): Util.Promise<string>;
        promoteOutputToTransformModuleAsync(promoteTransformModuleRequest: DataContract.IAddTransformRequest_Promote): Util.Promise<string>;
        commitResourceAsDatasetAsync(commitDatasetRequest: IAddDatasourceRequest_Uploaded): Util.Promise<string>;
        buildResourceAsCustomModulePackageAsync(commitCustomModuleRequest: IBuildCustomModulePackageRequest_Uploaded): Util.Promise<string[]>;
        updateWorkspaceSettings(workspaceSettingsRequest: v1.IWorkspaceSettings): Util.Promise<any>;
        saveCredential(credential: ISaveCredentialRequest): promise<any>;
        uploadResourceAsync(resource: Blob, dataTypeId: string): Util.Promise<DataContract.IResourceUploadInfo>;
        signOut(): Util.Promise<string>;
        getModuleVisualizationData(): Util.Promise<any>;
        getModuleVisualizationDataItem(): Util.Promise<any>;
        getDatasetVisualizationData(): Util.Promise<string>;
        getModuleOutputSchema(): Util.Promise<DataLab.Model.ISchema>;
        getDatasetSchema(): Util.Promise<DataLab.Model.ISchema>;
        getModuleOutput(): Util.Promise<any>;
        getModuleErrorLog(): Util.Promise<any>;
        getStorageSpaceQuotaAsync(): Util.Promise<DataContract.v1.IQuotaResponse>;
        getExperimentDetailsAsync(): Util.Promise<string>;
        updateExperimentDetailsAsync(experimentId: string, details: string): Util.Promise<void>;
        listProjects(experimentId: string): Util.Promise<IProject[]>;
        createProject(request: IAddOrUpdateProjectRequest): Util.Promise<IProject>;
        updateProject(projectId: string, request: IAddOrUpdateProjectRequest): Util.Promise<IProject>;
    }
    var workspace: Model.Workspace;
}

/// <reference path="Experiment.d.ts" />
/// <reference path="../Disposable.d.ts" />
/// <reference path="../PromiseQueue.d.ts" />
/// <reference path="../Util.d.ts" />
declare module DataLab.Model {
    enum DraftSaveState {
        None = 0,
        Saved = 1,
        Saving = 2,
        SaveFailed = 3,
    }
    interface IDraftSaveStatus {
        state: DraftSaveState;
        lastSave: Date;
    }
    /** This is the state machine for handling editing, saving, and discarding of drafts.
      * It keeps track of whether or not an experiment draft is dirty (contains changes locally that are not stored on the server) and
      * manages saving (which converts the dirty state to the clean state provided that no changes are made during the save). This state
      * machine also handles discarding of drafts, which means deleting them from the server if they exist there.
     **/
    class DraftStateMachine extends Util.Disposable {
        dirty: KnockoutObservable<boolean>;
        saveStatus: KnockoutObservable<IDraftSaveStatus>;
        private postedVersion;
        private savingVersion;
        private experiment;
        private timedSave;
        private promiseQueue;
        private queuedSave;
        private queuedSubmit;
        private discardTriggered;
        private timer;
        private workspace;
        /**
          * Creates the experiment draft state machine.
          * @constructor
          * @this {DraftStateMachine}
          * @param {Experiment} experiment the experiment for which this DraftStateMachine is being used.
         **/
        constructor(workspace: Workspace, experiment: Experiment);
        /**
          * Queue in the draft for saving.
          * @return {Util.Promise} a promise for the draft save operation
         **/
        saveDraft(): Util.Promise<void>;
        /**
          * Queue in the draft for deletion from the server, or resolve immediately if it's never been saved.
          * @return {Util.Promise} a promise for the draft discard operation
         **/
        discardDraft(): Util.Promise<void>;
        /**
          * Queue in the experiment (either draft or not) for submitting.
          * @return {Util.Promise<DataContract.v1.IExperimentSubmissionResult>} a promise for the submission operation
         **/
        submitExperiment(): Util.Promise<DataContract.v1.IExperimentSubmissionResult>;
        dispose(): void;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="DataType.d.ts" />
/// <reference path="Workspace.d.ts" />
declare module DataLab.Model {
    module Constants {
        var maxDatasetNameLength: number;
    }
    /** An UnsavedDataset represents a dataset which has not yet been fully created
        (i.e. saved to a workspace). An UnsavedDataset does not have an id and has
        mutable fields (unlike a saved Dataset). The mutable fields are validatableObservables,
        and so can be used to provide feedback to a user that is drafting a new dataset. */
    class UnsavedDataset {
        name: KnockoutComputed<string>;
        description: KnockoutObservable<string>;
        deprecate: KnockoutObservable<boolean>;
        availableDatasets: KnockoutObservable<string[]>;
        datasetToDeprecate: DataLab.Validation.IValidatableObservable;
        dataType: DataLab.Validation.IValidatableObservable;
        workspace: DataLab.Model.Workspace;
        familyId: KnockoutComputed<string>;
        hint: KnockoutObservable<boolean>;
        updateAvailableDatasets: DataLab.Util.Disposable;
        private _name;
        private _familyId;
        constructor(workspace: DataLab.Model.Workspace);
        isValid(): boolean;
        startValidating(): void;
    }
}

/// <reference path="../Global.refs.d.ts" />
/// <reference path="DataType.d.ts" />
/// <reference path="Workspace.d.ts" />
declare module DataLab.Model {
    module Constants {
        var maxResourceNameLength: number;
    }
    /** An UnsavedResource represents a resource (e.g. dataset, trained model) which has not yet been fully created
        (i.e. saved to a workspace). An UnsavedResource does not have an id and has
        mutable fields (unlike a saved resource). The mutable fields are validatableObservables,
        and so can be used to provide feedback to a user that is drafting a new resource. */
    class UnsavedResource {
        name: KnockoutComputed<string>;
        description: KnockoutObservable<string>;
        deprecate: KnockoutObservable<boolean>;
        availableResources: KnockoutObservable<string[]>;
        resourceToDeprecate: DataLab.Validation.IValidatableObservable;
        dataType: DataLab.Validation.IValidatableObservable;
        workspace: DataLab.Model.Workspace;
        familyId: KnockoutComputed<string>;
        hint: KnockoutObservable<boolean>;
        updateAvailableResources: DataLab.Util.Disposable;
        private _name;
        private _familyId;
        private _resourceCache;
        private _resourceName;
        constructor(workspace: DataLab.Model.Workspace, resourceCache: DataLab.IResourceCache<Resource>, resourceUploadsInProgress: KnockoutObservable<string[]>, resourceName: string);
        isValid(): boolean;
        startValidating(): void;
        /** Tests if the resource is the latest version and belongs to the local workspace */
        private isLatestLocal(resource, workspace);
    }
}

/// <reference path="Common.d.ts" />
declare module DataLab.DataContract {
    enum ExperimentRole {
        Training,
        Scoring,
        Computing,
    }
    interface IProject {
        ProjectId: string;
        Experiments: IProjectExperiment[];
    }
    interface IAddOrUpdateProjectRequest {
        Experiments: IProjectExperiment[];
    }
    interface IProjectExperiment {
        ExperimentId: string;
        Role: ExperimentRole;
        Experiment?: IExperimentSummary;
    }
}
