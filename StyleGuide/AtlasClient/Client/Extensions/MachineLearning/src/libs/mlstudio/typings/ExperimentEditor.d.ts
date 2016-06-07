/// <reference path="./jquery.extension.d.ts"/>
/// <reference path="./uxfxscript.d.ts" />
/// <reference path="./Knockout-extensions.d.ts" />

declare module DataLab {
    export var LocalizedResources;
}
declare module ExperimentEditor {
    export var typescriptResourceVariables;
}

declare module ExperimentEditor {
    interface IDialogResult {
        dialog: IDialog;
        accepted: boolean;
    }
    interface IDialog {
        /** Displays this dialog, closing the currently active one if needed. The returned promise will be
            resolved when the dialog is dismissed (including dismissals considered non-affirmative).
            An IDialog may only be shown once. */
        show(): DataLab.Util.Promise<IDialogResult>;
        close(): void;
        /** Indicates if the dialog is currently in a state in which it can be accepted (i.e. all fields are valid). */
        canBeAccepted(): boolean;
        optionsOverrides?: Shell.UI.DialogPresenter.IDialogOptions;
    }
    /** An IDialogHost is responsible for showing at most one IDialog at any time.
        The current DialogHost is exposed as ExperimentEditor.DialogHost. */
    interface IDialogHost {
        /** Fired whenever the active dialog is dismissed (accepted, rejected, etc.) */
        dialogDismissedEvent: KnockoutSubscribable<IDialogResult>;
        /** Dismisses the active dialog and shows a new one. The given dialog is recorded
            as the active one, but is not yet rendered. The returned HTMLElement is an element
            which the new active dialog should populate with its contents. The element will be
            removed from the DOM when the dialog is dismissed. */
        showNewDialog(dialog: IDialog): HTMLElement;
        isActiveDialog(dialog: IDialog): boolean;
        /** Closes the active dialog (if present). The resulting dismiss event indicates the dialog was not accepted. */
        closeActiveDialog(): void;
    }
    var DialogHost: IDialogHost;
    function setDialogHost(host: IDialogHost): void;
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
declare module ExperimentEditor.CustomUX {
    interface IDataSeries {
        data: number[][];
        label: string;
    }
    class PlotViewModel extends DataLab.Util.Disposable {
        private falsePositiveRate;
        private truePositiveRate;
        private precision;
        private yRate;
        private truePositive;
        private rocChartsFull;
        private precisionRecallChartsFull;
        private liftChartsFull;
        private data;
        label: KnockoutObservable<string>;
        constructor(data: IBinaryClassificationData, label: string);
        getCurrentChart(currentChart: string): IDataSeries;
        private constructChart(chartData, xField, yField);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
/// <reference path="../../../TypescriptLib/flot.d.ts" />
declare module ExperimentEditor.CustomUX {
    class Row {
        cells: KnockoutObservableArray<string>;
        constructor(cells: string[]);
    }
    class TableViewModel extends DataLab.Util.Disposable {
        headerRow: KnockoutObservable<Row>;
        rows: KnockoutObservableArray<Row>;
        constructor(rows: string[][], headerRowArray?: string[]);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
/// <reference path="PlotViewModel.d.ts" />
/// <reference path="TableViewModel.d.ts" />
declare module ExperimentEditor.CustomUX {
    interface IBinaryClassificationData {
        chart?: IBinaryClassificationChartData;
        charts?: IBinaryClassificationChartData[];
        reportName?: string;
    }
    interface IBinaryClassificationChartData {
        auc: any;
        min?: number;
        max?: number;
        coarseData: IBinaryClassificationCoarseData[];
        data: IBinaryClassificationDetailedData[];
    }
    interface IBinaryClassificationCoarseData {
        AUC: number;
        BinEnd: number;
        BinStart: number;
        Count: number;
        accuracy: number;
        f1: number;
        fn: number;
        fp: number;
        fpr: number;
        negPrecision: number;
        negRecall: number;
        numNeg: number;
        numPos: number;
        precision: number;
        recall: number;
        tn: number;
        tp: number;
        tpr: number;
    }
    interface IBinaryClassificationDetailedData {
        accuracy: number;
        confusionMatrix: IConfusionMatrix;
        f1: number;
        fpr: number;
        precision: number;
        probability: number;
        recall: number;
        tpr: number;
        truepositive: number;
        yrate: number;
    }
    interface IConfusionMatrix {
        fn: number;
        fp: number;
        tn: number;
        tp: number;
    }
    class BinaryClassificationUXViewModel extends DataLab.Util.Disposable implements CustomUX.ICustomUXViewModel {
        private data;
        private precision;
        plotViewModel: PlotViewModel;
        confusionMatrixViewModel: KnockoutComputed<TableViewModel>;
        precisionRecallViewModel: KnockoutComputed<TableViewModel>;
        binDataViewModel: TableViewModel;
        auc: KnockoutObservable<string>;
        threshold: KnockoutObservable<number>;
        rawThreshold: KnockoutComputed<number>;
        setCurrentCmData: (cmData: string) => void;
        currentCmData: KnockoutObservable<string>;
        name: KnockoutObservable<string>;
        loaded: KnockoutObservable<boolean>;
        constructor(parsedData?: any);
        static initializeFromEndpoint(experimentId: string, nodeId: string, portName: string, workspace: DataLab.Model.Workspace): BinaryClassificationUXViewModel;
        private initializeFromParsedJson(parsedJson);
        private getReportName(reportName);
        private getBucket(chartInfo, threshold);
        private getIndex(chartInfo, threshold);
        private initializeBinData(data);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../../TypescriptResources.d.ts" />
/// <reference path="../../Common/DialogInterfaces.d.ts" />
/// <reference path="../CustomUX/BinaryClassificationUX.d.ts" />
declare module ExperimentEditor.CustomUX {
    interface ICustomUX {
        markup: string;
        viewModel: ICustomUXViewModel;
    }
    interface ICustomUXViewModel extends DataLab.Util.IDisposable {
    }
    interface IBreadcrumbHeader {
        experimentName: string;
        moduleName: string;
        portName: string;
    }
    var uxClass: KnockoutObservable<string>;
    function open(markup: string, viewModel: ICustomUXViewModel, height?: string, width?: string, onCloseAction?: () => void, breadcrumbHeader?: IBreadcrumbHeader): void;
    function close(viewModel: ICustomUXViewModel, onCloseAction?: () => void): void;
    class CustomUXContainerViewModel {
        width: KnockoutObservable<string>;
        height: KnockoutObservable<string>;
        breadcrumbHeader: KnockoutObservable<IBreadcrumbHeader>;
        showBreadcrumbHeader: KnockoutObservable<boolean>;
        constructor(width: string, height: string, header: IBreadcrumbHeader);
    }
}

declare module ExperimentEditor {
    function auxConfirm(title: string, text: string): DataLab.Util.Promise<void>;
}

/// <reference path="../_ReferenceSupport/DataLabClient.d.ts" />
/// <reference path="../TypescriptLib/Knockout.d.ts" />
/// <reference path="../TypescriptLib/Knockout-extensions.d.ts" />
/// <reference path="../TypescriptLib/d3.d.ts" />
/// <reference path="../TypescriptLib/UxFxScript.d.ts" />
/// <reference path="../TypescriptLib/JsViews.d.ts" />
/// <reference path="../../../../External/Typescript/jquery.d.ts" />
/// <reference path="../TypescriptLib/jqueryui.d.ts" />
/// <reference path="../TypescriptLib/jqueryui.extension.d.ts" />
/// <reference path="../TypescriptResources.d.ts" />
/// <reference path="../_ReferenceSupport/MonacoAdditions.d.ts" />
/// <reference path="../TypescriptLib/zopim.d.ts" />
/// <reference path="ViewModel/ExperimentEditor/CustomUX.d.ts" />
/// <reference path="Common/Confirm.d.ts" />
declare module ExperimentEditor.Constants {
    module EntityType {
        var Module: string;
        var Dataset: string;
        var TrainedModel: string;
        var Transform: string;
        var Connection: string;
        var InputPort: string;
        var OutputPort: string;
        var Entity: string;
        var WebServicePort: string;
    }
    enum MouseButton {
        Left = 0,
        Center = 1,
        Right = 2,
    }
    enum Browser {
        Gecko = 0,
        Webkit = 1,
        IE9 = 2,
        IE10 = 3,
        IE11 = 4,
        Unknown = 5,
    }
    var CurrentBrowser: Browser;
    var errorHelpLinkGuidStart: string;
    var errorHelpLinkGuidEnd: string;
    var saveAsHelpLinkGuid: string;
    var rScriptEditorFocusWidth: number;
    var rScriptEditorFocusHeight: number;
    enum Key {
        Escape = 27,
        A = 65,
        Delete = 46,
        Minus,
        KeypadMinus = 109,
        Equals,
        KeypadPlus = 107,
        Zero = 48,
        KeypadZero = 96,
        Nine = 57,
        KeypadNine = 105,
        C = 67,
        S = 83,
        V = 86,
        X = 88,
        F2 = 113,
        Return = 13,
        SpaceBar = 32,
        F1 = 112,
    }
    module ContextMenuItem {
        var Height: number;
    }
    module ContextMenu {
        var DefaultWidth: number;
    }
    module Layout {
        var zoomToFitPadding: number;
    }
    var RectWidth: number;
    var RectHeight: number;
    module Icon {
        var Height: number;
        var Width: number;
        var XOffset: number;
    }
    module Port {
        var Width: number;
        var HalfWidth: number;
        var Height: number;
        var HalfHeight: number;
        var InYPos: number;
        var OutYPos: number;
        var Offset: number;
    }
    module Label {
        var InPortYPos: number;
        var OutPortYPos: number;
        var PortOffset: number;
        var MaxSize: number;
        var ReducedLength: number;
        var ModuleBuffer: number;
        var ModuleXOffset: number;
        var ModuleYOffset: number;
        var RectYOffset: number;
        var MaxWidth: number;
    }
    module Tooltip {
        var RectXOffset: number;
        var RectYOffset: number;
        var WidthOffset: number;
        var HeightOffset: number;
        var PortYOffset: number;
        var RectClass: string;
        var Class: string;
        var XPos: string;
    }
    module Connector {
        var SplinePointMax: number;
        var SplinePointMin: number;
    }
    module ExperimentDataFlowType {
        var Experiment: string;
        var WebService: string;
    }
    var maxModulePackageUploadSizeInBytes: number;
    var maxModulePackageUploadSizeDescription: string;
    var maxUploadSizeInBytes: number;
    var maxUploadSizeInBytesNew: number;
    var maxUploadSizeDescription: string;
    var maxUploadSizeDescriptionNew: string;
}

/// <reference path="../Global.d.ts" />
declare module ExperimentEditor {
    interface ICommand {
        userState?: any;
        /**
          * A flag if whether this command can be executed or not.
          * If not specified it is up to the application to choose the default value.
         **/
        canExecute: KnockoutObservable<boolean>;
        /**
          * Execute the command
         **/
        execute(target?: any): void;
    }
}

/// <reference path="ICommand.d.ts" />
declare module ExperimentEditor {
    class CallbackCommand implements ICommand {
        canExecute: KnockoutObservable<boolean>;
        private executeCallback;
        constructor(executeCallback: (targetObject?: any) => void);
        execute(targetObject?: any): void;
    }
}

declare module ExperimentEditor {
    interface ISprite {
        hit(ox1: number, oy1: number, ox2: number, oy2: number): boolean;
        translate(dx: number, dy: number): void;
        remove(): void;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="ISprite.d.ts" />
declare module ExperimentEditor {
    var EntityTypes: any;
    interface IEntityMap {
        [key: string]: Entity;
    }
    class Entity implements ISprite {
        type: number;
        classId: KnockoutComputed<string>;
        selected: KnockoutObservable<boolean>;
        hovered: KnockoutObservable<boolean>;
        showFullLabel: KnockoutObservable<boolean>;
        isTruncated: KnockoutObservable<boolean>;
        labelWidth: KnockoutObservable<number>;
        labelHeight: KnockoutObservable<number>;
        belongsToExperimentFlow: KnockoutObservable<boolean>;
        belongsToWebServiceFlow: KnockoutObservable<boolean>;
        private labelTimer;
        private labelTimerDelay;
        constructor(type: number);
        remove(): void;
        x: KnockoutObservable<number>;
        y: KnockoutObservable<number>;
        width: KnockoutObservable<number>;
        height: KnockoutObservable<number>;
        getType(): number;
        hit(ox1: number, oy1: number, ox2: number, oy2: number): boolean;
        translate(dx: number, dy: number): void;
        isModule(): boolean;
        isData(): boolean;
        isTrainedModel(): boolean;
        isTransform(): boolean;
        isConnection(): boolean;
        entityAtPoint(x: number, y: number): Entity;
        containsPoint(x: number, y: number): boolean;
        showLabel(): void;
        hideLabel(): void;
        onMouseIn(): void;
        onMouseOut(): void;
        startValidating(): void;
        updateValidState(): void;
        belongsToCurrentFlow(currentFlow: string): boolean;
        getClassId(currentFlow: string): string;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Entity.d.ts" />
/// <reference path="PortViewModel.d.ts" />
declare module ExperimentEditor {
    class Connection extends Entity {
        private controlPointDistance;
        inputPort: InputPort;
        outputPort: OutputPort;
        ix: KnockoutComputed<number>;
        iy: KnockoutComputed<number>;
        ox: KnockoutComputed<number>;
        oy: KnockoutComputed<number>;
        path: KnockoutComputed<string>;
        classId: KnockoutComputed<string>;
        hidden: KnockoutObservable<boolean>;
        constructor(inputPort: InputPort, outputPort: OutputPort);
        static createFromPorts(a: PortViewModel, b: PortViewModel): Connection;
        key: string;
        static getConnectionKeyForPorts(inputPort: InputPort, outputPort: OutputPort): string;
        x: KnockoutObservable<number>;
        y: KnockoutObservable<number>;
        remove(): void;
        hit(ox1: number, oy1: number, ox2: number, oy2: number): boolean;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Entity.d.ts" />
/// <reference path="Connection.d.ts" />
/// <reference path="GraphNodeViewModel.d.ts" />
declare module ExperimentEditor {
    interface IPortViewModelMap {
        [portName: string]: PortViewModel;
    }
    interface IInputPortViewModelMap {
        [portName: string]: InputPort;
    }
    interface IOutputPortViewModelMap {
        [portName: string]: OutputPort;
    }
    class PortViewModel extends Entity {
        connections: KnockoutObservableArray<Connection>;
        portModel: DataLab.Model.Port;
        balloonMessage: KnockoutObservable<string>;
        private _parent;
        portState: KnockoutObservable<string>;
        classId: KnockoutComputed<string>;
        hostRelativeX: KnockoutObservable<number>;
        hostRelativeY: KnockoutObservable<number>;
        private _x;
        private _y;
        translation: KnockoutComputed<string>;
        portTypes: string;
        labelPosX: KnockoutComputed<number>;
        labelPosY: KnockoutComputed<number>;
        labelYOffset: KnockoutObservable<number>;
        labelMaxWidth: KnockoutObservable<number>;
        tooltipPosX: KnockoutComputed<number>;
        tooltipPosY: KnockoutComputed<number>;
        tooltipBoxPosX: KnockoutComputed<number>;
        infoIcon: string;
        constructor(parent: GraphNodeViewModel, portModel: DataLab.Model.Port, type: number);
        x: KnockoutObservable<number>;
        y: KnockoutObservable<number>;
        parent: GraphNodeViewModel;
        getCX(): number;
        getCY(): number;
        entityAtPoint(x: number, y: number): Entity;
        containsPoint(x: number, y: number): boolean;
        addConnection(connection: Connection): void;
        removeConnection(connection: Connection): void;
        getClassId(currentFlow: string): string;
    }
    class InputPort extends PortViewModel {
        portModel: DataLab.Model.InputPort;
        constructor(host: GraphNodeViewModel, portModel: DataLab.Model.InputPort);
    }
    class OutputPort extends PortViewModel {
        portModel: DataLab.Model.OutputPort;
        constructor(host: GraphNodeViewModel, portModel: DataLab.Model.OutputPort);
        getCY(): number;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Entity.d.ts" />
/// <reference path="PortViewModel.d.ts" />
declare module ExperimentEditor {
    module Comments {
        var XOffset: number;
        var YOffset: number;
        var GraphNodeYOffset: number;
        var WidthBuffer: number;
        var HeightOffset: number;
        var LineHeight: number;
        var MaxLinesToShow: number;
    }
    module Growth {
        var Rate: number;
        var Trigger: number;
    }
    class GraphNodeViewModel extends Entity {
        graphNode: DataLab.Model.GraphNode;
        graphNodeType: DataLab.Constants.GraphNodeType;
        ports: IPortViewModelMap;
        inputPorts: IInputPortViewModelMap;
        outputPorts: IOutputPortViewModelMap;
        labelMaxWidth: number;
        labelPosX: KnockoutComputed<number>;
        labelPosY: KnockoutComputed<number>;
        tooltipPosX: KnockoutComputed<number>;
        tooltipPosY: KnockoutComputed<number>;
        valid: KnockoutObservable<boolean>;
        hasComment: KnockoutComputed<boolean>;
        commentPosX: KnockoutComputed<string>;
        commentPosY: KnockoutComputed<string>;
        commentWidth: KnockoutComputed<string>;
        commentTransform: KnockoutComputed<string>;
        editingComment: KnockoutObservable<boolean>;
        linesToShow: KnockoutComputed<number>;
        commentToShow: KnockoutComputed<string>;
        commentClass: KnockoutComputed<string>;
        showHideComment: () => void;
        forceBalloon: KnockoutSubscribable<boolean>;
        statusIconURL: KnockoutComputed<string>;
        nodeIconClicked: (source: any, e: MouseEvent) => void;
        commentCollapsedExpandedIconURL: KnockoutComputed<string>;
        commentCollapsedExpandedIconSymbol: KnockoutComputed<string>;
        portState: KnockoutObservable<string>;
        iconPosX: KnockoutComputed<number>;
        iconPosY: KnockoutComputed<number>;
        icon: string;
        iconSymbol: string;
        iconClass: string;
        textClassId: KnockoutComputed<string>;
        constructor(graphNode: DataLab.Model.GraphNode, type: number);
        x: KnockoutObservable<number>;
        y: KnockoutObservable<number>;
        width: KnockoutObservable<number>;
        height: KnockoutObservable<number>;
        comment: KnockoutObservable<string>;
        balloonMessage: KnockoutObservable<string>;
        label: string;
        tooltip: string;
        /**
          * Returns the closest input port on this graph node to the domain coordinates x, y
          * @param {number} x the x domain coordinate
          * @param {number} y the y domain coordinate
          * @return {PortViewModel} The closest input port on this graph node to the specified coordinates or null if this node has no inputs
         **/
        findClosestInputPort(x: number, y: number): PortViewModel;
        /**
          * Returns the closest output port on this graph node to the domain coordinates x, y
          * @param {number} x the x domain coordinate
          * @param {number} y the y domain coordinate
          * @return {PortViewModel} The closest output port on this graph node to the specified coordinates or null if this node has no outputs
         **/
        findClosestOutputPort(x: number, y: number): PortViewModel;
        remove(): void;
        hit(ox1: number, oy1: number, ox2: number, oy2: number): boolean;
        entityAtPoint(x: number, y: number): Entity;
        containsPoint(x: number, y: number): boolean;
        boundingBoxContainsPoint(x: number, y: number): boolean;
        relayout(): void;
        getCompatibilityClass(): string;
        private findClosestPort(ports, x, y);
        private relayoutPorts(ports, hostWidth, hostHeight);
        editComment(): void;
        private commentLargerThanDiv(size, commentText);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../../../MonacoEditor/Monaco.d.ts" />
declare module ExperimentEditor {
    module MonacoMimeTypes {
        var R: string;
        var Python: string;
        var Hive: string;
        var Sql: string;
        var PlainText: string;
        var JavaScript: string;
        var TypeScript: string;
    }
    interface IMonacoBindingOptions {
        value: KnockoutObservable<string>;
        disabled: boolean;
        mimetype: string;
        containerWidth: number;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="CustomUX.d.ts" />
declare module ExperimentEditor.ColumnPicker {
    interface IRuleIdentifier {
        id: string;
        serializedId?: string;
        columnKind?: string;
        name: string;
        exclude: boolean;
        hidden: boolean;
        inSingleColumnMode: boolean;
        inAllowDuplicatesMode: boolean;
    }
    interface ISavedColumnPickerRule {
        columns: string[];
        columnTypes: string[];
        columnKinds: string[];
        ruleType: string;
        exclude: boolean;
    }
    class RuleType {
        static AllColumns: IRuleIdentifier;
        static NoColumns: IRuleIdentifier;
        static ColumnNames: IRuleIdentifier;
        static ColumnIndices: IRuleIdentifier;
        static ColumnTypes: IRuleIdentifier;
        static ExcludeColumnNames: IRuleIdentifier;
        static ExcludeColumnIndices: IRuleIdentifier;
        static ExcludeColumnTypes: IRuleIdentifier;
        static Features: IRuleIdentifier;
        static Scores: IRuleIdentifier;
        static Labels: IRuleIdentifier;
        static ExcludeFeatures: IRuleIdentifier;
        static ExcludeScores: IRuleIdentifier;
        static ExcludeLabels: IRuleIdentifier;
        static all: IRuleIdentifier[];
        static equals(rule1: IRuleIdentifier, rule2: IRuleIdentifier): boolean;
        static findRule(id: string, exclude: boolean): IRuleIdentifier;
        static findRule(exclude: boolean, columnKind: string): IRuleIdentifier;
    }
    class ColumnType {
        static String: string;
        static Integer: string;
        static Double: string;
        static Boolean: string;
        static DateTime: string;
        static TimeSpan: string;
        static Categorical: string;
        static Numeric: string;
        static All: string;
    }
    class ColumnKind {
        static All: string;
        static Feature: string;
        static Score: string;
        static Label: string;
    }
    class ColumnPickerRule extends DataLab.Util.Disposable {
        ruleType: KnockoutObservable<IRuleIdentifier>;
        ruleCategory: KnockoutObservable<boolean>;
        private ruleChoices;
        private ruleCategoryChoices;
        selectedColumns: KnockoutObservableArray<string>;
        invalidColumns: KnockoutObservableArray<string>;
        columnTypes: KnockoutObservableArray<string>;
        columnKinds: KnockoutObservableArray<string>;
        typeChoices: KnockoutComputed<string[]>;
        kindChoices: KnockoutComputed<string[]>;
        hasKinds: KnockoutComputed<boolean>;
        currentColumn: DataLab.Validation.IValidatableObservable;
        isFirstRule: DataLab.Validation.IValidatableObservable;
        removeColumnName: (string) => void;
        removeInvalidColumnName: (string) => void;
        private validateNamesSelection;
        private allowDuplicates;
        hasError: KnockoutComputed<boolean>;
        hasRuleTypeError: KnockoutObservable<boolean>;
        hasIndexRuleError: KnockoutObservable<boolean>;
        hasNameRuleError: KnockoutObservable<boolean>;
        nameInputFocused: KnockoutObservable<boolean>;
        setNameInputFocused: () => void;
        indexList: DataLab.Validation.IValidatableObservable;
        private columnIndexRegExp;
        private columnRangeRegExp;
        private validateIndices;
        private validateRuleType;
        placeholderText: KnockoutComputed<string>;
        constructor(ruleType: IRuleIdentifier, viewModel: ColumnPickerViewModel, columns?: string[], invalidColumns?: string[], columnTypes?: string[], columnKinds?: string[], schema?: DataLab.Model.ISchema);
        toJSON(): ISavedColumnPickerRule;
        setWidthToStartingChoiceLabelWidth(element: Element): void;
        static validateColumnIndex(index: number, schema?: DataLab.Model.ISchema): string;
        static validateColumnRange(fromIndex: number, toIndex: number, schema?: DataLab.Model.ISchema): string;
    }
    interface IColumnAutoCompleteValue extends IAutocompleteItem {
        isInaccurate: boolean;
    }
    class ColumnPickerViewModel extends DataLab.Util.Disposable implements ExperimentEditor.CustomUX.ICustomUXViewModel {
        rules: KnockoutObservableArray<ColumnPickerRule>;
        visibleRules: KnockoutComputed<ColumnPickerRule[]>;
        createNewRule: (ColumnPickerRule?) => void;
        removeRule: (ColumnPickerRule) => void;
        saveRulesAndClose: () => void;
        createRulesJSONString: () => string;
        autocompleteArray: KnockoutObservableArray<IColumnAutoCompleteValue>;
        hasSchema: KnockoutObservable<boolean>;
        schemaIsInaccurate: KnockoutObservable<boolean>;
        hiddenRuleTypes: KnockoutObservableArray<IRuleIdentifier>;
        hasErrors: KnockoutComputed<boolean>;
        allowDuplicates: KnockoutObservable<boolean>;
        firstRule: KnockoutComputed<ColumnPickerRule>;
        singleColumnSelection: KnockoutObservable<boolean>;
        allowMultipleRules: KnockoutComputed<boolean>;
        private validateColumns;
        private validColumnNamesFromSchema;
        private startingChoices;
        private startingChoice;
        typeChoices: string[];
        kindChoices: string[];
        constructor(storedRules: DataLab.Validation.IValidatableObservable, singleColumnSelection: boolean, schema?: DataLab.Model.ISchema);
        static parseRules(rules: string, forEachRuleCallback: (rule: ISavedColumnPickerRule, ruleType: IRuleIdentifier) => void): any;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="ColumnPickerViewModel.d.ts" />
/// <reference path="CustomUX.d.ts" />
declare module ExperimentEditor.ColumnPicker {
    interface IRuleIdentifierLegacy {
        id: string;
        name: string;
        exclude: boolean;
    }
    class RuleTypeLegacy {
        static ColumnNames: IRuleIdentifierLegacy;
        static ColumnIndices: IRuleIdentifierLegacy;
        static ColumnTypes: IRuleIdentifierLegacy;
        static AllColumns: IRuleIdentifierLegacy;
        static ExcludeColumnNames: IRuleIdentifierLegacy;
        static ExcludeColumnIndices: IRuleIdentifierLegacy;
        static ExcludeColumnTypes: IRuleIdentifierLegacy;
        static findRule(id: string, exclude: boolean): IRuleIdentifierLegacy;
    }
    class RuleOptions {
        exclude: boolean;
        first: KnockoutObservable<boolean>;
        constructor(exclude: boolean, first: KnockoutObservable<boolean>);
    }
    class ColumnPickerRuleLegacy {
        ruleType: KnockoutObservable<IRuleIdentifierLegacy>;
        selectedColumns: KnockoutObservableArray<string>;
        invalidColumns: KnockoutObservableArray<string>;
        columnTypes: KnockoutObservableArray<string>;
        columnKinds: KnockoutObservableArray<string>;
        ruleChoicesObservable: KnockoutObservableArray<RuleOptions>;
        currentColumn: DataLab.Validation.IValidatableObservable;
        firstRule: DataLab.Validation.IValidatableObservable;
        removeColumnName: (string) => void;
        removeInvalidColumnName: (string) => void;
        private validateNamesSelection;
        private allowDuplicates;
        hasError: KnockoutComputed<boolean>;
        hasRuleTypeError: KnockoutObservable<boolean>;
        hasIndexRuleError: KnockoutObservable<boolean>;
        hasNameRuleError: KnockoutObservable<boolean>;
        nameInputFocused: KnockoutObservable<boolean>;
        setNameInputFocused: () => void;
        indexList: DataLab.Validation.IValidatableObservable;
        private columnIndexRegExp;
        private columnRangeRegExp;
        private validateIndices;
        private validateRuleType;
        private oldRuleTypeId;
        constructor(ruleType: IRuleIdentifierLegacy, columnTypesDefault: string[], columnKindsDefault: string[], firstRule: boolean, columns?: string[], invalidColumns?: string[], columnTypes?: string[], columnKinds?: string[], allowDuplicates?: KnockoutObservable<boolean>);
    }
    class ColumnPickerViewModelLegacy extends DataLab.Util.Disposable implements ExperimentEditor.CustomUX.ICustomUXViewModel {
        rules: KnockoutObservableArray<ColumnPickerRuleLegacy>;
        addRule: (ColumnPickerRuleLegacy) => void;
        removeRule: (ColumnPickerRuleLegacy) => void;
        saveRulesAndClose: () => void;
        createRulesJSONString: () => string;
        autocompleteArray: KnockoutObservableArray<string>;
        hasSchema: KnockoutObservable<boolean>;
        hasErrors: KnockoutComputed<boolean>;
        private validateColumns;
        private validColumnNamesFromSchema;
        allowDuplicates: KnockoutObservable<boolean>;
        private singleColumnSelection;
        private allowMultipleRules;
        private ruleChoices;
        static allRuleChoicesAndUIConstraints: {
            ruleIdentifier: IRuleIdentifierLegacy;
            inSingleColumnMode: boolean;
            inAllowDuplicatesMode: boolean;
        }[];
        typeChoices: string[];
        kindChoices: string[];
        constructor(storedRules: DataLab.Validation.IValidatableObservable, singleColumnSelection: boolean, schema?: DataLab.Model.ISchema);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="CustomUX.d.ts" />
declare module ExperimentEditor.ModuleError {
    class ModuleErrorViewModel extends DataLab.Util.Disposable implements ExperimentEditor.CustomUX.ICustomUXViewModel {
        errorInfo: KnockoutObservable<DataLab.Model.ErrorLogInfo>;
        errorHelpLink: KnockoutObservable<string>;
        errorLinkLabel: KnockoutObservable<string>;
        dialogHeading: string;
        launchErrorHelp: () => void;
        constructor(errorText: string, moduleName: string, moduleID: string);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/CustomBindingHandlers/Monaco.d.ts" />
/// <reference path="../../Common/EntityDataDownloader.d.ts" />
/// <reference path="../../../TypescriptResources.d.ts" />
/// <reference path="../ExperimentEditor/ColumnPickerViewModel.d.ts" />
/// <reference path="../ExperimentEditor/ColumnPickerViewModelLegacy.d.ts" />
/// <reference path="../ExperimentEditor/ModuleErrorViewModel.d.ts" />
declare module ExperimentEditor {
    enum PropertyItemType {
        Textbox = 0,
        Checkbox = 1,
        Textarea = 2,
        Select = 3,
        Link = 4,
        Button = 5,
        Credential = 6,
        ColumnPicker = 7,
        ParameterRange = 8,
        EditableText = 9,
        MultiSelect = 10,
    }
    class PropertyViewModel {
        property: DataLab.Model.IProperty;
        type: PropertyItemType;
        isStaticContent: KnockoutObservable<boolean>;
        currentError: KnockoutObservable<string>;
        _isDisabled: KnockoutComputed<boolean>;
        _isExperimentLevel: KnockoutObservable<boolean>;
        isLinkable: boolean;
        focus: KnockoutObservable<boolean>;
        templateType: () => string;
        childParameters: KnockoutObservableArray<ParameterViewModel>;
        linkedParameterName: KnockoutComputed<string>;
        /**
          * @constructor
          * THIS CLASS IS ABSTRACT. DO NOT INSTANTIATE IT.
         **/
        constructor(property: DataLab.Model.IProperty);
        isDisabled: KnockoutComputed<boolean>;
        isExperimentLevel: KnockoutObservable<boolean>;
        static experimentPropertyFactory(property: DataLab.Model.IProperty): PropertyViewModel;
    }
    class ParameterViewModel extends PropertyViewModel {
        linkClass: KnockoutComputed<string>;
        autocompleteArray: KnockoutObservableArray<any>;
        /**
         * Factory Method returning the correct ParameterViewModel
        **/
        static createParameterViewModel(property: DataLab.Model.ModuleNodeParameter, workspace: DataLab.Model.Workspace): ParameterViewModel;
        /**
          * @constructor
          * View model for editable parameters.
          * This class must be instantiated through the Factory method createParameterViewModel.
         **/
        constructor(property: DataLab.Model.ModuleNodeParameter, workspace: DataLab.Model.Workspace);
        isDisabled: KnockoutComputed<boolean>;
        validate(): string[];
    }
    class ColumnPickerParameterViewModel extends ParameterViewModel {
        openColumnPicker: () => void;
        launchDisabled: KnockoutObservable<boolean>;
        constructor(property: DataLab.Model.ModuleNodeParameter, workspace: DataLab.Model.Workspace);
    }
    class ParameterRangeViewModel extends ParameterViewModel {
        parameterType: string;
        title: string;
        minLimit: number;
        maxLimit: number;
        sliderMin: number;
        sliderMax: number;
        useRangeBuilder: KnockoutObservable<boolean>;
        literalList: DataLab.Validation.IValidatableObservable;
        defaultLiteralValue: string;
        countValidatable: DataLab.Validation.IValidatableObservable;
        minValue: KnockoutObservable<number>;
        maxValue: KnockoutObservable<number>;
        rangeString: KnockoutComputed<string>;
        isLogarithmic: KnockoutObservable<boolean>;
        private validateCount;
        private count;
        linSliderStep: number;
        logSliderStep: number;
        logCapable: boolean;
        logMin: KnockoutComputed<number>;
        logMax: KnockoutComputed<number>;
        logMinLimit: number;
        logMaxLimit: number;
        literalItemRegExp: RegExp;
        literalRangeRegExp: RegExp;
        validateItems: (string) => string;
        private makeJsonString;
        hasIndexRuleError: KnockoutObservable<boolean>;
        /**
         * Factory Method returning the correct ParameterViewModel
        **/
        static createParameterRangeViewModel(property: DataLab.Model.ModuleNodeParameter, workspace: DataLab.Model.Workspace): ParameterRangeViewModel;
        constructor(property: DataLab.Model.ModuleNodeParameter, workspace: DataLab.Model.Workspace);
        finishConstruction(): void;
    }
    class EnumItemViewModel {
        value: string;
        displayValue: string;
        isSelected: KnockoutObservable<boolean>;
        classString: KnockoutComputed<string>;
        constructor(value: string, displayValue: string, selected: boolean);
    }
    class EnumSweepViewModel extends ParameterViewModel {
        enumItems: KnockoutObservableArray<EnumItemViewModel>;
        buttonLabel: KnockoutComputed<string>;
        private JSONString;
        className: string;
        private makeJsonString;
        private updateButtonLabel;
        constructor(property: DataLab.Model.ModuleNodeParameter, workspace: DataLab.Model.Workspace);
    }
    class IntegerParameterRangeViewModel extends ParameterRangeViewModel {
        constructor(property: DataLab.Model.ModuleNodeParameter, workspace: DataLab.Model.Workspace);
    }
    class DoubleParameterRangeViewModel extends ParameterRangeViewModel {
        constructor(property: DataLab.Model.ModuleNodeParameter, workspace: DataLab.Model.Workspace);
    }
    class MonacoParameterViewModel extends ParameterViewModel {
        private monacoMimeType;
        /**
          * @constructor
          * View model for editable text area properties that will use the Monaco text editor
          * Additionally, this Property is able to resize vertically.
        **/
        constructor(property: DataLab.Model.ModuleNodeParameter, workspace: any);
    }
    class StaticContentPropertyViewModel extends PropertyViewModel {
        /**
          * @constructor
          * THIS CLASS IS ABSTRACT. DO NOT INSTANTIATE IT.
         **/
        constructor(property: DataLab.Model.StaticProperty);
        isDisabled: KnockoutComputed<boolean>;
    }
    class LinkPropertyViewModel extends StaticContentPropertyViewModel {
        onClick: (viewModel: any, e: MouseEvent) => void;
        /**
          * @constructor
          * View model for properties that should appear as HTML links
         **/
        constructor(property: DataLab.Model.LinkProperty, callback?: (e: MouseEvent) => any);
    }
    class EndpointPropertyViewModel extends LinkPropertyViewModel {
        endpoint: KnockoutObservable<DataLab.DataContract.IEndpoint>;
        /**
          * @constructor
          * View model for endpoint properties that should appear as HTML links
         **/
        constructor(property: DataLab.Model.EndpointProperty, endpointDownloader?: EndpointDownloader);
        endpointDownloader: EndpointDownloader;
    }
    class ButtonPropertyViewModel extends StaticContentPropertyViewModel {
        onClick: (viewModel: any, e: MouseEvent) => void;
        /**
          * @constructor
          * View model for properties that should appear as buttons
         **/
        constructor(property: DataLab.Model.ButtonProperty, callback?: (e: MouseEvent) => any);
    }
    class EndpointDialogPropertyViewModel extends ButtonPropertyViewModel {
        endpoint: KnockoutObservable<DataLab.DataContract.IEndpoint>;
        moduleName: string;
        clickDisabled: KnockoutObservable<boolean>;
        /**
          * @constructor
          *  View model for endpoint properties that should appear as buttons and be displayed in a dialog
         **/
        constructor(property: DataLab.Model.DisplayEndpointProperty, moduleName: string, moduleID: string, workspace: DataLab.Model.Workspace, experimentId: string);
    }
    class StaticTextPropertyViewModel extends StaticContentPropertyViewModel {
        /**
          * @constructor
          * View model for properties that should appear as static text
         **/
        constructor(property: DataLab.Model.StaticProperty);
    }
    class CheckboxPropertyViewModel extends PropertyViewModel {
        constructor(property: DataLab.Model.BooleanProperty);
    }
    class EditableTextPropertyViewModel extends PropertyViewModel {
        constructor(property: DataLab.Model.EditableTextProperty);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    function GetIconForCategory(category: string): string;
    function GetIconSymbol(icon: string): string;
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    interface IPaletteItem {
        id: KnockoutObservable<string>;
        name: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        type: KnockoutObservable<string>;
        classId: KnockoutObservable<string>;
        tooltip: KnockoutObservable<string>;
        isVisible: KnockoutObservable<boolean>;
    }
}

/// <reference path="IPaletteItem.d.ts" />
declare module ExperimentEditor {
    interface IPaletteDragResponder {
        paletteDragStart(e: MouseEvent, paletteItem: IPaletteItem): void;
        paletteDragMoved(e: MouseEvent): void;
        paletteDragEnd(e: MouseEvent): void;
        paletteDragCancel(): void;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="CustomUX.d.ts" />
declare module ExperimentEditor.HelpSearch {
    function Initialize(): void;
}

/// <reference path="../../Common/ICommand.d.ts" />
declare module ExperimentEditor {
    interface IMenuItem {
        label?: string;
        divider?: boolean;
        iconClass?: string;
        command?: ICommand;
        items?: IMenuItem[];
    }
    interface IMenuItemObservable {
        label: KnockoutObservable<string>;
        divider: KnockoutObservable<boolean>;
        iconClass: KnockoutObservable<string>;
        command: ICommand;
        items: KnockoutObservableArray<IMenuItem>;
    }
}

/// <reference path="IMenuItem.d.ts" />
declare module ExperimentEditor {
    interface IMenuData {
        name?: string;
        width?: number;
        classId?: string;
        items: IMenuItem[];
    }
}

/// <reference path="../ViewModel/ContextMenuControl/IMenuData.d.ts" />
declare module ExperimentEditor {
    interface IMenuBuilder {
        build(argument: any): IMenuData;
        currentTarget: KnockoutObservable<any>;
    }
}

/// <reference path="../Global.d.ts" />
/// <reference path="../../TypescriptLib/jQuery.extension.d.ts" />
/// <reference path="../ViewModel/ContextMenuControl/MenuViewModel.d.ts" />
declare module ExperimentEditor {
    module MenuControl {
        var menuIsOpen: boolean;
        var targetViewModel: any;
        function initialize(): void;
        /**
          * Remove the menu currently on the page if open. Otherwise, do nothing.
         **/
        var removeContextMenu: () => void;
        /**
          * Spawns a context menu in the application.
          * @param {MenuViewModel} menu the view model for the context menu
          * @param {string} selector the selector for the element on which to position the menu
         **/
        function spawnMenu(menu: MenuViewModel, selector: string): any;
        /**
          * Spawns a context menu in the application.
          * @param {MenuViewModel} menu the view model for the context menu
          * @param {JQuery} jquery the jQuery object for the element on which to position the menu
         **/
        function spawnMenu(menu: MenuViewModel, jquery: JQuery): any;
        /**
          * Spawns a context menu in the application.
          * @param {MenuViewModel} menu the view model for the context menu
          * @param {HTMLElement} element the element on which to position the menu
         **/
        function spawnMenu(menu: MenuViewModel, element: HTMLElement): any;
        /**
          * Spawns a context menu in the application.
          * @param {MenuViewModel} menu the view model for the context menu
          * @param {MouseEvent} event the context menu will appear about pageX and pageY of this mouse event
         **/
        function spawnMenu(menu: MenuViewModel, event: MouseEvent): any;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="MenuViewModel.d.ts" />
/// <reference path="IMenuItem.d.ts" />
/// <reference path="../../View/MenuControl.d.ts" />
declare module ExperimentEditor {
    class MenuItemViewModel {
        private menuItem;
        private enabled;
        private subMenu;
        private onActivated;
        private onMouseDown;
        private parentMenu;
        private targetViewModel;
        parentViewModel: any;
        hasSubmenu: boolean;
        /**
          * @constructor
          * The view model for context and drop menus.
          * @param {IMenuData} menuData the list of items to put in the menu
          * @param {any} targetViewModel the viewModel corresponding to the thing the user clicked on
          * @param {MenuViewModel} parentMenu The menu containing this item
         **/
        constructor(menuItemData: IMenuItem, targetViewModel: any, parentMenu: MenuViewModel);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../Common/IMenuBuilder.d.ts" />
/// <reference path="IMenuData.d.ts" />
/// <reference path="MenuItemViewModel.d.ts" />
declare module ExperimentEditor {
    class MenuViewModel {
        private classId;
        private parentMenu;
        private targetViewModel;
        items: KnockoutObservableArray<IMenuItem>;
        constructor(menuData: IMenuData, targetViewModel: any, parentMenu?: MenuViewModel);
        /**
          * Yo dawg, I heard you don't like context menus on your context menus, so prevent default
          * on mouse up to stop that.
         **/
        contextMenuMouseUp(target: any, e: MouseEvent): void;
    }
}

/// <reference path="../Global.d.ts" />
/// <reference path="../Common/IMenuBuilder.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/Entity.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/Module.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/ExperimentEditorViewModel.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/PortViewModel.d.ts" />
declare module ExperimentEditor {
    interface IExperimentEditorContextMenus {
        portMenu: IMenuData;
        inputPortMenu: IMenuData;
        portDatasetMenu: IMenuData;
        datasetMenu: IMenuData;
        trainedModelMenu: IMenuData;
        transformMenu: IMenuData;
        moduleMenu: IMenuData;
        mainMenu: IMenuData;
        multiSelectMenu: IMenuData;
    }
    interface ICommand_OutputPort extends ICommand {
        execute(targetObject?: OutputPort): any;
    }
    interface IExperimentEditorMenuBuilderCommands {
        promoteOutput: ICommand_OutputPort;
        promoteTrainerOutput: ICommand_OutputPort;
        promoteTransformOutput: ICommand_OutputPort;
        openPythonNotebook: ICommand;
        openNewPythonNotebook: ICommand;
        listPythonNotebooks: ICommand;
        editComment: ICommand;
        viewOutput: ICommand;
        viewStdOut: ICommand;
        viewStdErr: ICommand;
        downloadDataset: ICommand;
        visualizeData: ICommand;
        setPublishPort: ICommand;
        unsetPublishPort: ICommand;
        delete_: ICommand;
        refreshExperiment: ICommand;
        navigateToParent: ICommand;
        copy: ICommand;
        cut: ICommand;
        paste: ICommand;
        promoteCreateWebService: ICommand_OutputPort;
        showHelp: ICommand;
        showOutputPortApiCode: ICommand;
    }
    class ExperimentEditorMenuBuilder extends DataLab.Util.Disposable implements IMenuBuilder {
        private commands;
        private argument;
        private experimentEditorViewModel;
        private menuMap;
        currentTarget: KnockoutObservable<any>;
        readOnlyMode: KnockoutObservable<boolean>;
        constructor(experimentEditorViewModel: ExperimentEditorViewModel, commands: IExperimentEditorMenuBuilderCommands);
        build(target: any): IMenuData;
    }
}

/// <reference path="ICommand.d.ts" />
declare module ExperimentEditor {
    /**
     A NullCommand is never enabled and cannot execute. It is useful for when a command
     is not available (e.g. not injected by some outer container).

     For substituting absent commands with NullCommands, see {@see optionalCommand}.
     */
    class NullCommand implements ICommand {
        canExecute: KnockoutObservable<boolean>;
        constructor();
        execute(target?: any): void;
    }
    /**
     Returns the given command if provided; otherwise, a NullCommand
    */
    function optionalCommand(command?: ICommand): ICommand;
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Entity.d.ts" />
/// <reference path="ExperimentEditorViewModel.d.ts" />
declare module ExperimentEditor {
    class SelectionManager extends DataLab.Util.Disposable {
        private startCapture;
        private selectionChangeCallback;
        private width;
        private height;
        private curX;
        private curY;
        private startX;
        private startY;
        private visible;
        private experimentViewModel;
        private _selectedGraphNodes;
        private _selectedConnections;
        private _selectedEntities;
        private _selectedGraphNodeModels;
        constructor(experimentViewModel: KnockoutObservable_ReadOnly<ExperimentViewModel>);
        isVisible(): boolean;
        selectedGraphNodes: DataLab.IObservableMap<Entity>;
        selectedConnections: DataLab.IObservableMap<Entity>;
        selectedEntities: DataLab.IObservableMap<Entity>;
        selectedGraphNodeModels: DataLab.IObservableMap<DataLab.Model.GraphNode>;
        /**
          * Deselect the given entity
          * @param {Entity} entity the entity to deselect
         **/
        deselectEntity(entity: Entity): void;
        /**
          * Select all entities in the experiment
         **/
        selectAll(): void;
        /**
          * Remove all items from the selection
         **/
        resetSelection(): void;
        /**
          * Batch multiple selection updates to minimize the number of knockout updates
         **/
        modifySelection(callback: () => void): void;
        /**
          * Add an entity to the current selection
          * @param {Entity} entity the entity to select
         **/
        selectEntity(entity: Entity): void;
        /**
          * Toggles an entity's selection state.
          * @param {Entity} entity the entity to toggle selection state
         **/
        toggleEntitySelection(entity: Entity): void;
        /**
          * Starts a drag multi-selection. Note that rect selections do not clear the current selection
          * @param {number} x the x domain coordinate to start the drag
          * @param {number} y the y domain coordinate to start the drag
         **/
        beginRectSelection(x: number, y: number): void;
        /**
          * Ends a drag multi-selection. All entities in 'entities' fully enclosed by the selection
          * rectangle are added to the current user selection.
          * @param {number} x the x domain coordinate to end the drag
          * @param {number} y the y domain coordinate to end the drag
          * @param {IEntityMap} entities a map of all entities to test for selection
         **/
        endRectSelection(x: number, y: number, entities: IEntityMap): boolean;
        /**
          * Aborts a drag multi-selection. Nothing is added to the current user selection.
         **/
        cancelRectSelection(): void;
        /**
          * Updates the current drag selection rectangle. The rectangle will extend from the point
          * where start was called to the current mouse location.
          * @param {number} x the current x domain coordinate of the mouse
          * @param {number} y the current y domain coordinate of the mouse
         **/
        updateRectSelection(x: number, y: number): void;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Entity.d.ts" />
/// <reference path="GraphNodeViewModel.d.ts" />
/// <reference path="PortViewModel.d.ts" />
declare module ExperimentEditor {
    class Dataset extends GraphNodeViewModel {
        datasetNode: DataLab.Model.DatasetNode;
        path: KnockoutComputed<string>;
        author: StaticTextPropertyViewModel;
        size: StaticTextPropertyViewModel;
        format: StaticTextPropertyViewModel;
        createdOn: StaticTextPropertyViewModel;
        viewDataset: EndpointPropertyViewModel;
        constructor(datasetNode: DataLab.Model.DatasetNode);
        datasetPort: OutputPort;
        label: string;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Entity.d.ts" />
/// <reference path="GraphNodeViewModel.d.ts" />
/// <reference path="PortViewModel.d.ts" />
declare module ExperimentEditor {
    class TrainedModel extends GraphNodeViewModel {
        trainedModelNode: DataLab.Model.TrainedModelNode;
        path: KnockoutComputed<string>;
        author: StaticTextPropertyViewModel;
        format: StaticTextPropertyViewModel;
        createdOn: StaticTextPropertyViewModel;
        trainingExperiment: LinkPropertyViewModel;
        constructor(trainedModelNode: any);
        trainedModelPort: OutputPort;
        label: string;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Entity.d.ts" />
/// <reference path="GraphNodeViewModel.d.ts" />
/// <reference path="PortViewModel.d.ts" />
declare module ExperimentEditor {
    class Transform extends GraphNodeViewModel {
        transformNode: DataLab.Model.TransformNode;
        path: KnockoutComputed<string>;
        author: StaticTextPropertyViewModel;
        format: StaticTextPropertyViewModel;
        createdOn: StaticTextPropertyViewModel;
        trainingExperiment: LinkPropertyViewModel;
        constructor(transformNode: any);
        transformPort: OutputPort;
        label: string;
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    class WebServicePortParameter extends PropertyViewModel {
        autocompleteArray: KnockoutObservableArray<any>;
        constructor(parameter: DataLab.Model.WebServicePortNodeParameter);
        validate(): string[];
        isDisabled: KnockoutComputed<boolean>;
    }
    class WebServicePort extends GraphNodeViewModel {
        webServicePortNode: DataLab.Model.WebServicePortNode;
        path: KnockoutComputed<string>;
        icon: string;
        constructor(webServicePortNode: DataLab.Model.WebServicePortNode);
        label: string;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Entity.d.ts" />
/// <reference path="Module.d.ts" />
/// <reference path="Dataset.d.ts" />
/// <reference path="TrainedModel.d.ts" />
/// <reference path="Transform.d.ts" />
/// <reference path="PortViewModel.d.ts" />
/// <reference path="Connection.d.ts" />
/// <reference path="WebServicePort.d.ts" />
/// <reference path="../PropertyEditorControl/PropertyViewModel.d.ts" />
declare module ExperimentEditor {
    interface IExperimentStateDisplay {
        statusLabel: KnockoutObservable<string>;
        statusIconUrl: string;
        iconHoverBalloon: string;
    }
    class ExperimentViewModel extends DataLab.Util.Disposable {
        nodes: DataLab.IDisposableObservableMap<GraphNodeViewModel>;
        experimentNodes: DataLab.IDisposableObservableMap<GraphNodeViewModel>;
        tempNodes: DataLab.IObservableMap<GraphNodeViewModel>;
        connections: DataLab.IObservableMap<Connection>;
        selectableEntities: DataLab.IDisposableObservableMap<Entity>;
        readOnlyMode: KnockoutObservable<boolean>;
        experiment: DataLab.Model.Experiment;
        webServiceParameters: DataLab.IDisposableObservableMap<ParameterViewModel>;
        experimentProperties: KnockoutObservableArray<StaticContentPropertyViewModel>;
        summary: EditableTextPropertyViewModel;
        details: EditableTextPropertyViewModel;
        detailsLink: LinkPropertyViewModel;
        experimentStateDisplay: KnockoutComputed<IExperimentStateDisplay>;
        experimentStateIntervalID: number;
        experimentLoaded: KnockoutObservable<boolean>;
        private experimentStateUpdateRunningTime;
        workspace: DataLab.Model.Workspace;
        displayFlowType: KnockoutObservable<string>;
        constructor(experiment: DataLab.Model.Experiment, workspace: DataLab.Model.Workspace);
        addPublishOutputPort(outputPort: OutputPort): void;
        addPublishInputPort(inputPort: InputPort): void;
        removePublishOutputPort(outputPort: OutputPort): void;
        removePublishInputPort(inputPort: InputPort): void;
        createModule(module_: DataLab.Model.Module, x?: number, y?: number): Module;
        createDataset(dataset: DataLab.Model.Dataset, x?: number, y?: number): Dataset;
        createTrainedModel(trainedModel: DataLab.Model.TrainedModel, x?: number, y?: number): TrainedModel;
        createTransformModule(transform: DataLab.Model.Transform, x?: number, y?: number): Transform;
        createWebServicePort(type: DataLab.Model.WebServicePortType, x?: number, y?: number): WebServicePort;
        /**
          * Remove a graph node view model from the staging pool of view models and commit it to the experiment
          * @param {GraphNodeViewModel} node the view model for the node to commit
          * @return {GraphNodeViewModel} the view model for the committed node
         **/
        addNode(node: GraphNodeViewModel): GraphNodeViewModel;
        removeSelected(): void;
        editSelected(): void;
        findEntityAtPoint(x: number, y: number): Entity;
        getViewModelForNode(node: DataLab.Model.GraphNode): GraphNodeViewModel;
        getViewModelForPort(port: DataLab.Model.Port): PortViewModel;
        isSampleExperiment(): boolean;
        displayFlowToggle(): void;
        private createNodeViewModel(node);
        private addConnection(inputPort, outputPort);
        private removeConnection(inputPort, outputPort);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="PortViewModel.d.ts" />
declare module ExperimentEditor {
    class Connector {
        private controlPointDistance;
        private lastCandidatePort;
        private hiddenConnection;
        private snappedPort;
        p0: PortViewModel;
        p1: PortViewModel;
        x1: KnockoutObservable<number>;
        y1: KnockoutObservable<number>;
        x2: KnockoutObservable<number>;
        y2: KnockoutObservable<number>;
        isPreview: KnockoutObservable<boolean>;
        translation: KnockoutComputed<string>;
        path: KnockoutComputed<string>;
        counter: KnockoutObservable<number>;
        visible: KnockoutObservable<boolean>;
        /**
          * Creates a connector that manages state when connecting ports.
          * @constructor
         **/
        constructor();
        onMouseMove(x: number, y: number, entity: Entity): void;
        reset(): void;
        /**
          * Starts a connection.
          * @param {PortViewModel} source The first port for the connection
         **/
        startConnection(source: PortViewModel): void;
        /**
          * Ends a connection.
          * @param {Entity} destination The entity the user ended the connection on. If the entity is a valid
                            port or module with a valid port, the connection will finalize.
          * @param {number} x The domain x coordinate where the connection ended.
          * @param {number} y The domain y coordinate where the connection ended.
         **/
        endConnection(destination: Entity, x: number, y: number): void;
        private snapToPort(port);
        private unsnap();
        /**
          * Shows any existing hidden connection
         **/
        private showHiddenConnection();
        /**
          * Shows the existing hidden connection and hides the specified connection.
          * @param {Connection} connection the connection to hide
         **/
        private hideConnection(connection);
        private setCandidatePort(port);
    }
}

/// <reference path="PortViewModel.d.ts" />
/// <reference path="Entity.d.ts" />
/// <reference path="../../Global.d.ts" />
/// <reference path="ExperimentEditorViewModel.d.ts" />
/// <reference path="SelectionManager.d.ts" />
/// <reference path="Help.d.ts" />
declare module ExperimentEditor {
    module XEInteractionClasses {
        var PanMode: string;
        var Panning: string;
        var Idle: string;
        var MovingEntities: string;
        var MakingConnection: string;
        var MultiSelecting: string;
    }
    enum XEInteractionAction {
        MouseDown = 0,
        MouseUp = 1,
        MouseMove = 2,
        PanButtonClicked = 3,
        DeleteKeyPressed = 4,
        EscapeKeyPressed = 5,
        ShiftAPressed = 6,
        F2KeyPressed = 7,
        ControlXPressed = 8,
        SpacebarDown = 9,
        SpacebarUp = 10,
    }
    enum DraggingMode {
        None = 0,
        Entities = 1,
        Connection = 2,
        SelectionRect = 3,
    }
    module Constants.XEStateMachine {
        var ConnectionPendingThreshhold: number;
    }
    class XEInteractionStateMachine extends DataLab.Util.Disposable {
        private viewModel;
        private lastMouseCoords;
        private lastDomainCoords;
        private panModeOn;
        private leftMousePanning;
        private centerMousePanning;
        private spacebarHeld;
        private mouseDownCoords;
        private mouseDownEvent;
        private mouseDownEntity;
        private connectionDragPending;
        atRest: KnockoutObservable<boolean>;
        dragging: KnockoutObservable<DraggingMode>;
        classes: KnockoutComputed<string>;
        constructor(viewModel: ExperimentEditorViewModel);
        handleAction(action: XEInteractionAction, e?: MouseEvent, relevantEntity?: Entity): void;
    }
}

declare module ExperimentEditor {
    interface ICoordinateConverter {
        clientToDomainCoordinates(x: number, y: number): SVGPoint;
    }
}

declare module ExperimentEditor {
    interface IPanResponder {
        pan(clientdx: number, clientdy: number): void;
    }
}

/// <reference path="../../../Global.d.ts" />
declare module ExperimentEditor {
    class Command {
        experimentEditorViewModel: ExperimentEditorViewModel;
        experiment: DataLab.Model.Experiment;
        constructor(experimentViewModel: ExperimentEditorViewModel);
        run(): void;
        undo(): void;
    }
}

/// <reference path="Command.d.ts" />
/// <reference path="../../../Global.d.ts" />
declare module ExperimentEditor {
    class AddNodesCommand extends Command {
        nodesToAdd: DataLab.Model.GraphNode[];
        constructor(nodesToAdd: DataLab.Model.GraphNode[], experimentViewModel: ExperimentEditorViewModel);
        run(): void;
        undo(): void;
    }
}

/// <reference path="Command.d.ts" />
/// <reference path="../ExperimentEditorViewModel.d.ts" />
/// <reference path="../../../Global.d.ts" />
declare module ExperimentEditor {
    import DataContractV2 = DataLab.DataContract.v2;
    class AddConnectionsCommand extends Command {
        private _connections;
        constructor(connections: DataLab.DataContract.v2.IAddedConnectionInfo[], experimentViewModel: ExperimentEditorViewModel);
        connections: DataContractV2.IAddedConnectionInfo[];
        run(): void;
        undo(): void;
    }
}

/// <reference path="Command.d.ts" />
/// <reference path="AddNodesCommand.d.ts" />
/// <reference path="AddConnectionsCommand.d.ts" />
/// <reference path="../../../Global.d.ts" />
/// <reference path="../Clipboard.d.ts" />
declare module ExperimentEditor {
    import DataContractV2 = DataLab.DataContract.v2;
    module Constants {
        var PasteCascadeX: number;
        var PasteCascadeY: number;
        var PasteBoundary: number;
    }
    class PasteCommand extends Command {
        private addNodesCommand;
        private addConnectionsCommand;
        private clipboard;
        private nodesAddedPromise;
        private viewTopLeft;
        private experimentBounds;
        private placementRect;
        private validate;
        pastedItemCount: number;
        itemsPasted: KnockoutSubscribable<SVGRect>;
        constructor(clipboardSubgraph: DataLab.DataContract.v2.ISerializedSubgraph, experimentViewModel: ExperimentEditorViewModel, experimentBounds: SVGRect, viewTopLeft: SVGPoint, workspace: DataLab.Model.Workspace, validate?: (nodesAddedInfo: DataContractV2.IAddedNodesInfo) => boolean);
        run(): void;
        undo(): void;
        private calculatePlacement(nodes);
        private createAddNodesCommand(nodesAddedInfo);
        private createAddConnectionsCommand(nodesAddedInfo);
        private selectPastedContent();
    }
}

/// <reference path="Command.d.ts" />
/// <reference path="../../../Global.d.ts" />
/// <reference path="../ExperimentEditorViewModel.d.ts" />
declare module ExperimentEditor {
    class DeleteConnectionCommand extends Command {
        inputPort: DataLab.Model.InputPort;
        outputPort: DataLab.Model.OutputPort;
        constructor(inputPort: DataLab.Model.InputPort, outputPort: DataLab.Model.OutputPort, experimentViewModel: ExperimentEditorViewModel);
        run(): void;
        undo(): void;
    }
}

/// <reference path="DeleteConnectionCommand.d.ts" />
/// <reference path="../../../Global.d.ts" />
/// <reference path="../ExperimentEditorViewModel.d.ts" />
declare module ExperimentEditor {
    class DeleteNodesCommand extends Command {
        deletedNodes: DataLab.Model.GraphNode[];
        deleteConnectionCommands: DeleteConnectionCommand[];
        constructor(nodesToDelete: DataLab.Model.GraphNode[], experimentEditorViewModel: ExperimentEditorViewModel);
        run(): void;
        undo(): void;
    }
}

/// <reference path="Commands/PasteCommand.d.ts" />
/// <reference path="Commands/DeleteNodesCommand.d.ts" />
/// <reference path="ExperimentEditorViewModel.d.ts" />
/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    module Constants {
        var ClipboardName: string;
    }
    module Clipboard {
        /**
          * Write data to the clipboard (usually serialized objects)
          * @param {string} data the string to write into the clipboard
         **/
        function write(data: string): void;
        /**
          * Reads the clipboard contents.
          * @return {string} the string contents of the clipboard
         **/
        function read(): string;
        /**
          * Removes all contents from the clipboard. Useful for testing.
          * However, this function should never be called on the actual page due
          * to assumptions we make about the clipboard lifetime.
         **/
        function clear(): void;
    }
}

/// <reference path="../Global.d.ts" />
declare module ExperimentEditor.Balloon {
    /**
      * Show a balloon with message at the specified bounding box. Will hide the existing balloon
      * if present.
      * @param {string} message The message to display.
      * @param {SVGRect} bounds The bounding box of the object to render balloon on
     **/
    function show(message: string, element: HTMLElement): void;
    /**
      * Hides the current balloon, if present.
     **/
    function hide(element?: HTMLElement): void;
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    module PythonNotebook {
        function openNotebook(workspace: DataLab.Model.Workspace, targetObject: any, alwaysCreateNew: boolean): void;
        function openNotebookList(workspace: DataLab.Model.Workspace): void;
        function openNotebookForOutputPort(workspace: DataLab.Model.Workspace, port: DataLab.Model.OutputPort, alwaysCreateNew: boolean, success: Function, error: Function): void;
    }
}

/// <reference path="../ContextMenuControl/MenuViewModel.d.ts" />
/// <reference path="../ContextMenuControl/IMenuData.d.ts" />
/// <reference path="../../MenuBuilders/ExperimentEditorMenuBuilder.d.ts" />
/// <reference path="../../Common/ICommand.d.ts" />
/// <reference path="../../Common/CallbackCommand.d.ts" />
/// <reference path="../../Common/NullCommand.d.ts" />
/// <reference path="SelectionManager.d.ts" />
/// <reference path="ExperimentViewModel.d.ts" />
/// <reference path="Connector.d.ts" />
/// <reference path="XEStateMachine.d.ts" />
/// <reference path="../../View/ICoordinateConverter.d.ts" />
/// <reference path="../../View/IPanResponder.d.ts" />
/// <reference path="Clipboard.d.ts" />
/// <reference path="Commands/DeleteNodesCommand.d.ts" />
/// <reference path="Commands/PasteCommand.d.ts" />
/// <reference path="../PaletteControl/IPaletteItem.d.ts" />
/// <reference path="../../Common/EntityDataDownloader.d.ts" />
/// <reference path="../../View/Balloon.d.ts" />
/// <reference path="CustomUX.d.ts" />
/// <reference path="../../../_ReferenceSupport/DataLabClient.d.ts" />
/// <reference path="PythonNotebook.d.ts" />
declare module ExperimentEditor {
    import Model = DataLab.Model;
    interface IExperimentEditorViewModelCommands {
        promoteOutput?: ICommand_OutputPort;
        promoteTrainerOutput?: ICommand_OutputPort;
        promoteTransformOutput?: ICommand_OutputPort;
        refreshExperiment?: ICommand;
        navigateToParent?: ICommand;
        promoteCreateWebService?: ICommand_OutputPort;
    }
    interface IExperimentEditorViewModelEvents {
        onAlert?: (message: string) => void;
    }
    interface IViewInfo {
        topLeft: SVGPoint;
        experimentBounds: SVGRect;
    }
    interface IExperimentView {
        getViewInfo(): IViewInfo;
    }
    enum UserActionState {
        IsMultiSelecting = 0,
        IsMovingEntity = 1,
        IsConnecting = 2,
        None = 3,
    }
    class ExperimentEditorViewModel extends DataLab.Util.Disposable {
        private entityActivationCallback;
        private cloneHandler;
        private paletteDragItem;
        private menuBuilder;
        private contextMenu;
        private lastMouseCoords;
        private lastConnectingPort;
        private _experiment;
        private currentExperimentHasBeenNonEmpty;
        private experimentIsEmptySubscription;
        private endpointDownloader;
        private workspace;
        private experimentDisposable;
        private saveStatus;
        private statusRefresher;
        private dirtySubscription;
        experimentViewModel: KnockoutObservable_ReadOnly<ExperimentViewModel>;
        stateMachine: XEInteractionStateMachine;
        selectionManager: SelectionManager;
        entityMouseDown: (source: Entity, event: MouseEvent) => void;
        entityMouseUp: (source: Entity, event: MouseEvent) => void;
        entityDoubleClick: (source: Entity, event: MouseEvent) => void;
        commentsEventHandler: (source: Entity, event: KeyboardEvent) => boolean;
        panButtonClicked: (event: MouseEvent) => void;
        connector: Connector;
        classId: KnockoutComputed<string>;
        paletteItem: IPaletteItem;
        coordinateConverter: ICoordinateConverter;
        experimentView: IExperimentView;
        panResponder: IPanResponder;
        moduleCache: DataLab.IClientCache<Model.Module>;
        datasetCache: DataLab.IClientCache<Model.Dataset>;
        trainedModelCache: DataLab.IClientCache<Model.TrainedModel>;
        transformModulesCache: DataLab.IClientCache<Model.Transform>;
        needsAnimationToContent: KnockoutSubscribable<SVGRect>;
        needsAnimationToNode: KnockoutSubscribable<GraphNodeViewModel>;
        animationComplete: KnockoutSubscribable<void>;
        isBeingResized: KnockoutObservable<boolean>;
        experimentDirty: KnockoutObservable<boolean>;
        experimentOrViewBoundsChanged: KnockoutSubscribable<void>;
        parentExperimentId: KnockoutObservable<string>;
        experimentOrViewPerturbed: KnockoutSubscribable<void>;
        shouldShowHelpWatermark: KnockoutObservable_ReadOnly<boolean>;
        newExperimentLoaded: KnockoutSubscribable<void>;
        setLastPositionForExperiment: KnockoutSubscribable<string>;
        draftSaveLabel: KnockoutObservable<string>;
        draftStateMachine: Model.DraftStateMachine;
        refreshStatusLabel: KnockoutObservable<string>;
        isAutoRefreshing: boolean;
        events: IExperimentEditorViewModelEvents;
        constructor(moduleCache: DataLab.IClientCache<Model.Module>, datasetCache: DataLab.IClientCache<Model.Dataset>, trainedModelCache: DataLab.IClientCache<Model.TrainedModel>, transformModulesCache: DataLab.IClientCache<Model.Transform>, endpointDownloader: EndpointDownloader, commands?: IExperimentEditorViewModelCommands, workspace?: Model.Workspace, events?: IExperimentEditorViewModelEvents);
        experiment: Model.Experiment;
        stopAutoRefresh(): void;
        rememberExperimentPosition(experimentId: string): void;
        registerEntityActivationEvent(callback: (entity: Entity, secondaryActivation: boolean) => void): void;
        registerCloneHandler(callback: () => void): void;
        removeSelected(): void;
        editSelected(): void;
        startConnection(source: PortViewModel): void;
        moveConnection(domainCoords: SVGPoint): void;
        cancelConnection(): void;
        endConnection(destination: Entity, domainCoords: SVGPoint): void;
        activate(entity: Entity, secondaryActivation?: boolean): void;
        onMouseMove(e: MouseEvent): void;
        beginMultiSelect(domainCoords: SVGPoint): void;
        updateMultiSelect(domainCoords: SVGPoint): void;
        endMultiSelect(domainCoords: SVGPoint): void;
        moveEntities(dx: number, dy: number): void;
        addModuleById(guid: string, x?: number, y?: number): Module;
        addDatasetById(guid: string, x?: number, y?: number): Dataset;
        addTrainedModelById(guid: string, x?: number, y?: number): TrainedModel;
        addTransformById(guid: string, x?: number, y?: number): Transform;
        createModule(guid: string, x?: number, y?: number): Module;
        createDataset(guid: string, x?: number, y?: number): Dataset;
        createTrainedModel(guid: string, x?: number, y?: number): TrainedModel;
        createTransformModule(guid: string, x?: number, y?: number): Transform;
        createWebServicePort(type: string, x?: number, y?: number): WebServicePort;
        createNode(entityType: string, guid: string, x?: number, y?: number): GraphNodeViewModel;
        paletteDragStart(paletteItem: IPaletteItem): void;
        paletteDragEnter(domainCoords: SVGPoint): void;
        paletteDragMove(domainCoords: SVGPoint): void;
        paletteDragLeave(): void;
        paletteDragEnd(): GraphNodeViewModel;
        copy(): void;
        cut(): void;
        paste(): void;
        refreshExperiment(): DataLab.Util.Promise<any>;
        startAutoRefresh(): void;
        /** Sets the {@see currentExperimentHasBeenNonEmpty} flag based on the current experiment's isEmpty state.
            The current experiment is assumed to have been newly installed, so an empty experiment will result in
            currentExperimentHasBeenNonEmpty being unset. */
        private observeEmptinessOfNewExperiment();
        private createContextMenuCommands(commands);
        private setCommandAvailabilities(commands);
        private highlightNodesAndPorts(port);
        private setRefreshConditions(experiment);
        /**
         *  Calculate placement for new or pasted nodes
         *  @param {SVGPoint} preferredLocation the initial preferred location.
         *  @return {SVGRect} the computed placement position
         **/
        calculatePlacement(preferredLocation: SVGPoint): SVGPoint;
        private getNumberOfModulesToBePasted(clipboardData);
    }
}

declare module ExperimentEditor {
    function isInputSupported(type: string): boolean;
}

/// <reference path="../Global.d.ts" />
/// <reference path="../Common/FeatureDetection.d.ts" />
declare module ExperimentEditor {
    interface IZoomEvent {
        scale: number;
        x?: number;
        y?: number;
    }
    module Constants.ZoomControl {
        var SliderZoomIncrement: number;
    }
    interface IZoomSubscribable extends KnockoutSubscribable<IZoomEvent> {
        subscribe(callback: (zoomEvent: IZoomEvent) => void): KnockoutSubscription<any>;
        notifySubscribers(zoomEvent: IZoomEvent): any;
    }
    interface IZoomToFitSubscribable extends KnockoutSubscribable<boolean> {
        subscribe(callback: () => void, callbackTarget?: any, event?: string): KnockoutSubscription<any>;
        notifySubscribers(dummy: boolean): any;
    }
    class ZoomControl extends DataLab.Util.Disposable {
        private containerDiv;
        private canvasDiv;
        private zoominButton;
        private zoomoutButton;
        private zoomSlider;
        private zoomToFitButton;
        private zoomInImage;
        private zoomOutImage;
        private zoomInOverImage;
        private zoomOutOverImage;
        private actualSizeImage;
        private actualSizeOverImage;
        private actualSizeButton;
        private zoomFactor;
        private zoomSteps;
        private minZoomSteps;
        private maxZoomSteps;
        private scale;
        minScale: number;
        maxScale: number;
        zoomWithoutAnimation: IZoomSubscribable;
        zoomWithAnimation: IZoomSubscribable;
        zoomToFit: IZoomToFitSubscribable;
        constructor(containerDiv: HTMLDivElement, canvasDiv: HTMLDivElement, minScale?: number, maxScale?: number);
        getClosestValidScale(requestedScale: number): number;
        setScale(requestedScale: number, x?: number, y?: number): number;
        getScale(): number;
        private computeZoomStepForScale(requestedScale);
        private handleReset();
        private handleZoomIn();
        private handleZoomOut();
        private handleMouseWheelZoom(e);
        private handleZoomToFit();
        private calculateNewZoom(steps);
    }
}

/// <reference path="../Global.d.ts" />
/// <reference path="../Common/FeatureDetection.d.ts" />
declare module ExperimentEditor {
    module Constants {
        var ScrollbarSizeTestDimensions: number;
    }
    enum ScrollOrientation {
        Vertical = 0,
        Horizontal = 1,
    }
    /**
     *  A scrollbar position
     *
     *  @param {number} elevatorLength  The scrollbar elevator length as a fraction of the entire scrollbar length
     *  @param {number} elevatorOffset  The scrollbar elevator offset as a fraction of the entire scrollbar length.
     *                                  For a vertical scrollbar, this is the offset from the top. For a horizontal
     *                                  scrollbar this is the offset from the left.
     **/
    interface ScrollPosition {
        elevatorLength: number;
        elevatorOffset: number;
    }
    /**
     *  Scrollbar size information used for positioning because browser-rendered scrollbars may be of different sizes
     *  between different browsers and DPI settings.
     *
     *  @param {number} horizontalScrollbarHeight   The height of a horizontal scrollbar
     *  @param {number} verticalScrollbarWidth      The width of a vertical scrollbar
     *
     **/
    interface IScrollbarSizeInfo {
        horizontalScrollbarHeight: number;
        verticalScrollbarWidth: number;
    }
    class ScrollControl {
        private scrollDiv;
        private scrollRange;
        private orientation;
        private positionReference;
        private positionControl;
        private suppressScrollEvent;
        viewScrolled: KnockoutObservable<number>;
        private clientLength;
        private clientOffset;
        private styleLength;
        /**
         *  @constructor
         *  Construct a new scollbar.
         *
         * @param {HTMLDivElement} scrollDiv The DIV element, of class 'verticalScroll' or class 'horizontalScroll' which is to become the scrollbar.
         * @param getPositionInAttachedView A callback function which returns a ScrollPosition object for this scroll bar.
         * @param {ScrollOrientation} The scrollbar orientation, vertical or horizontal.
         * @param {IScrollbarSizeInfo} Browser and DPI-dependent scrollbar size info.
         **/
        constructor(scrollDiv: HTMLDivElement, getPositionInAttachedView: (orientation: ScrollOrientation) => ScrollPosition, orientation: ScrollOrientation, sizeInfo: IScrollbarSizeInfo);
        /**
         *  Notifies the scrollbar that it should requery for elevatorLength and elevatorOffset
         **/
        sizeUpdated(): void;
        /**
         *  Computes the width of vertical scrollbars and the height of horizontal scollbars.
         *
         * @return {IScrollbarSizeInfo} the scrollbar dimensions.
         **/
        static computeDimensions(): IScrollbarSizeInfo;
    }
}

declare module ExperimentEditor {
    class MouseCapture extends DataLab.Util.Disposable {
        private buttonsDown;
        private mouseMoveHandler;
        private mouseUpHandler;
        private beginCapture;
        private endCapture;
        private mouseDownOrigin;
        private mouseMoveDisposableListener;
        private mouseUpDisposableListener;
        private endCapturesDisposableListener;
        private countMouseDownsDisposableListener;
        constructor(mouseDownOrigin: Element, mouseMoveHandler: (e: MouseEvent) => void, mouseUpHandler: (e: MouseEvent) => void);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    module Constants {
        var SixtyFPS: number;
    }
    class Animation {
        private duration;
        private easingFunction;
        private stepFunction;
        private startTime;
        private endTime;
        private legacyIntervalAnimationId;
        private animatedProperties;
        private _animationStopped;
        private ignoreFrames;
        animationEnded: KnockoutSubscribable<any>;
        constructor(stepFunction: (currentAnimationState: any) => void, animatedProperties: Object, duration?: number, easingFunction?: (number) => number);
        private static defaultEasing(percentTime);
        start(): void;
        stop(): void;
        animationStopped: boolean;
        private step();
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    interface ILRUDate {
        now(): number;
    }
    class LocalStorageCache<T> {
        private name;
        private cacheLines;
        private items;
        private static localStorageWrapper;
        private LRUDate;
        /**
          * Constructs a cache stored in localStorage. An LRU policy is used to
          * evict old items from the cache.
          * @param {string} name The name of the cache
          * @param {number} cacheLines The max number of lines to be stored in
          * the cache. If max is reached, LRU is used to evict old items.
          * @param {ILRUDate} An object used to generate timestamps, by default
          * the Date object is used.
         **/
        constructor(name: string, cacheLines: number, date?: ILRUDate);
        /**
          * Adds an item to the cache. If the cache is full, an LRU policy is
          * used to remove old items. A current timestamp is attached to an item
          * when it is added into the cache, and updated if it is re-added.
          * @param {T} item The item to be added to the cache
          * @param {string} key The key used to lookup the item in the cache
         **/
        add(item: T, key: string): void;
        /**
          * Fetches an item from the cache using the key for lookup.
          * The timestamp of an item is updated when it is fetched.
          * @param {string} key The key used for lookup
          * @return {T} The item from the cache, or undefined if the key is not
          * found
         **/
        fetch(key: string): T;
        clear(): void;
    }
}

declare module ExperimentEditor {
    class CoordinateHelper {
        private svgRoot;
        private getViewDimensions;
        private svgTransformElement;
        constructor(svgRoot: SVGSVGElement, getViewDimensions: () => SVGRect, svgTransformElement: SVGGElement);
        clientToDomainCoordinates(x: number, y: number): SVGPoint;
    }
}

/// <reference path="CoordinateHelper.d.ts" />
/// <reference path="IPanResponder.d.ts" />
declare module ExperimentEditor {
    class ZoomHelper extends DataLab.Util.Disposable implements IPanResponder {
        private initOnly;
        private currentPanZoomAnimation;
        private topLeftDest;
        private lastAnimatedScale;
        constructor(svgTransformElement: SVGGElement, svgRoot: SVGSVGElement, coordinateHelper: CoordinateHelper, zoomControl: ZoomControl, getViewDimensions: () => SVGRect, changeCallback: (change: {
            domainX: number;
            domainY: number;
            scale: number;
        }) => void, getTopLeft: () => SVGPoint, animationComplete: () => void, updateScrollbars: () => void, overlayDivs: {
            length: number;
            item: (index: number) => any;
        }, getBounds: () => SVGRect);
        currentAnimation: Animation;
        /**
         *  Computes the experiment pan limits which are used both for scroll bar elevator sizing and to prevent the user from getting lost while they are panning.
         *
         * @return {SVGRect} the pan limits denoted by the top left corner (x,y) and the panning area (width,height)
         */
        getPanLimits(scale?: number): SVGRect;
        zoom(scale: number): void;
        zoomToEventWithoutAnimation(e: IZoomEvent): void;
        zoomToEventWithAnimation(e: IZoomEvent): void;
        viewCenter: SVGPoint;
        animateToLocation(targetX: number, targetY: number, targetScale?: number): void;
        getDestinationOrigin(): SVGPoint;
        private zoomToPointWithoutAnimation(targetScale, domainX, domainY);
        private zoomToPointWithAnimation(targetScale, domainX, domainY);
        private zoomToPoint(targetScale, domainX, domainY);
        /**
          * Performs a zoom to fit with animation
         **/
        zoomToFitWithAnimation(): void;
        computeZoomToFitLocation(): IExperimentPosition;
        /**
          * This is our primitive for setting view. The user passes the domainX and Y of the top
          * left corner of the screen they want and the zoom level they want. This should be the only
          * function that writes to the transform matrix.
          * @param {number} domainX The X value of the desired top left corner of the screen
          * @param {number} domainX The Y value of the desired top left corner of the screen
          * @param {number} scale The desired scale
          * @param {number} fromScrollBars Whether or not to update the size of the scroll bars
         **/
        setOriginAndZoom(domainX: number, domainY: number, scale?: number, fromScrollbars?: boolean): void;
        pan(clientdx: number, clientdy: number): void;
        /**
          * Fits the experiment without animation. If the computed best fit scale
          * is greater than 1, scale is set to 1 and experiment is centered.
         **/
        fitExperimentWithoutAnimation(): void;
    }
}

/// <reference path="../Global.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/ExperimentEditorViewModel.d.ts" />
/// <reference path="ZoomControl.d.ts" />
/// <reference path="ScrollControl.d.ts" />
/// <reference path="../ViewModel/PaletteControl/IPaletteDragResponder.d.ts" />
/// <reference path="ICoordinateConverter.d.ts" />
/// <reference path="../Common/MouseCapture.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/Animation.d.ts" />
/// <reference path="Balloon.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/LocalStorageCache.d.ts" />
/// <reference path="ZoomHelper.d.ts" />
/// <reference path="CoordinateHelper.d.ts" />
declare module ExperimentEditor {
    module Constants {
        var ModuleFromPaletteAnimationDuration: number;
        var AnimatedZoomDuration: number;
        var InitialZoomToFitYOffSet: number;
        var NumberOfCacheLines: number;
    }
    interface IExperimentPosition {
        domainX: number;
        domainY: number;
        scale: number;
    }
    class ExperimentEditorControl extends DataLab.Util.Disposable implements IPaletteDragResponder, ICoordinateConverter, IExperimentView {
        private initOnly;
        private rootContainerDiv;
        private experimentCanvasDiv;
        private canvasEventDiv;
        private controlPanelDiv;
        private scrollVertical;
        private scrollHorizontal;
        private panControl;
        private isDraggingNewEntity;
        private topLeft;
        private divOverlayTransform;
        private calculateScrollPosition;
        private experimentPositionCache;
        private viewModelDisposable;
        private _viewModel;
        clearPositionCache(): void;
        constructor(rootContainerDiv: HTMLDivElement, viewModel: ExperimentEditorViewModel);
        private updateScrollbars();
        currentPanZoomAnimation: Animation;
        viewModel: ExperimentEditorViewModel;
        /**
         *  Computes the experiment pan limits which are used both for scroll bar elevator sizing and to prevent the user from getting lost while they are panning.
         *
         * @return {SVGRect} the pan limits denoted by the top left corner (x,y) and the panning area (width,height)
         */
        getPanLimits(scale?: number): SVGRect;
        getScale(): number;
        paletteDragMoved(e: MouseEvent): void;
        rememberPositionForExperiment(position: IExperimentPosition, experimentId: string): void;
        paletteDragStart(e: MouseEvent, paletteItem: IPaletteItem): void;
        paletteDragEnd(e: MouseEvent): void;
        paletteDragCancel(): void;
        zoom(scale: number): void;
        pan(clientdx: number, clientdy: number): void;
        getViewDimensions(): SVGRect;
        viewCenter: SVGPoint;
        addEntityToCenter(paletteItem: IPaletteItem, e: MouseEvent): void;
        clientToDomainCoordinates(x: number, y: number): SVGPoint;
        /**
          * Returns the dimensions of the entire experiment in domain coordinates
         **/
        getExperimentBounds(): SVGRect;
        /**
          * Performs a zoom to fit with animation
         **/
        zoomToFitWithAnimation(): void;
        getViewInfo(): IViewInfo;
        getDestinationOrigin(): SVGPoint;
        /**
          * Brings graph node into view (wrapping bringRectIntoView).
          * @param {GraphNodeViewModel} graphNode
         **/
        animateToGraphNode(graphNode: GraphNodeViewModel): void;
        /**
          * A constructor helper function that adds event listeners. Assume bindingElement is something we created
         **/
        private setupEventHandlers(bindingElement);
        /**
          * Brings the desired rectangle into view
          * @param {SVGRect} rect the rectangle to bring into view
         **/
        private bringRectIntoView(rect);
    }
}

/// <reference path="../Global.d.ts" />
/// <reference path="../ViewModel/PaletteControl/PaletteViewModel.d.ts" />
/// <reference path="../ViewModel/PaletteControl/IPaletteDragResponder.d.ts" />
/// <reference path="../Common/MouseCapture.d.ts" />
declare module ExperimentEditor {
    class PaletteControl extends DataLab.Util.Disposable implements DataLab.Util.IDisposable {
        private rootContainerDiv;
        paletteViewModel: PaletteViewModel;
        /**
          * Constructor for PaletteControl
          * @constructor
          * @param rootContainerDiv {HTMLDivElement} the div onto which to apply the palette control's apply knockout bindings
          * @param paletteViewModel {PaletteViewModel} the backing view model for the control
         **/
        constructor(rootContainerDiv: HTMLDivElement, paletteViewModel: PaletteViewModel);
    }
}

/// <reference path="../../Common/IMenuBuilder.d.ts" />
/// <reference path="../ExperimentEditor/ExperimentEditorViewModel.d.ts" />
declare module ExperimentEditor {
    interface IPropertyEditorLinkCommands {
        unlink: ICommand;
        newLink: ICommand;
    }
    class PropertyEditorMenuBuilder extends DataLab.Util.Disposable implements IMenuBuilder {
        currentTarget: KnockoutObservable<ParameterViewModel>;
        private experimentEditorViewModel;
        private unlinkCommand;
        private newLinkCommand;
        constructor(experimentEditorViewModel: ExperimentEditorViewModel);
        build(moduleNodeParameterViewModel: ParameterViewModel): IMenuData;
        private featureUsage(featureId);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="PropertyViewModel.d.ts" />
/// <reference path="PropertyEditorMenuBuilder.d.ts" />
/// <reference path="../ExperimentEditor/ExperimentEditorViewModel.d.ts" />
/// <reference path="../../View/MenuControl.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
/// <reference path="../ExperimentEditor/Help.d.ts" />
declare module ExperimentEditor {
    class PropertyEditorViewModel extends DataLab.Util.Disposable {
        private lastVisitedParameter;
        private experimentEditorViewModel;
        private linkParameterClicked;
        private removeParameterClicked;
        private focusLinkedWebServiceParameter;
        private hasParentExperiment;
        private menuBuilder;
        private webServiceParameterMenuBuilder;
        private lastX;
        private animatingDrawer;
        private isDraggingDrawer;
        private drawerIsCollapsed;
        private quickHelpCollapsed;
        openCloseAnimationEnded: KnockoutSubscribable<void>;
        private graphNode;
        private nodeParameters;
        experimentPropertiesCollapsed: KnockoutObservable<boolean>;
        competitionPropertiesCollapsed: KnockoutObservable<boolean>;
        readOnlyMode: KnockoutObservable<boolean>;
        globalParamsCollapsed: KnockoutObservable<boolean>;
        entityParamsCollapsed: KnockoutObservable<boolean>;
        prevParameterClicked: (target: ParameterViewModel, e: MouseEvent) => void;
        nextParameterClicked: (target: ParameterViewModel, e: MouseEvent) => void;
        onParameterFocus: (target: ParameterViewModel, e: MouseEvent) => void;
        onParameterReturn: (target: ParameterViewModel, e: KeyboardEvent) => void;
        webServiceParameterChanged: KnockoutComputed<boolean>;
        experiment: KnockoutObservable<DataLab.Model.Experiment>;
        navigateToParent: KnockoutSubscribable<void>;
        navigateToWebService: KnockoutSubscribable<void>;
        getModuleHelp: () => void;
        openColumnPicker: (target: ParameterViewModel) => void;
        experimentSummaryCollapsed: KnockoutObservable<boolean>;
        experimentDetailsCollapsed: KnockoutObservable<boolean>;
        /**
          * Creates the view model for the property editor
          * @constructor
          * @param {string} rootContainerId the id of the container div for the property editor
          * @param {ExperimentEditorViewModel} experimentEditorViewModel the viewmodel for the experiment editor.
          *        needed for experiment parameters
         **/
        constructor(experimentEditorViewModel: ExperimentEditorViewModel, endpointDownloader: EndpointDownloader, workspace: DataLab.Model.Workspace);
        selectedGraphNodeName: string;
        /**
          * Sets the node that is newly selected, so its properties and/or parameters can be
          * displayed in the property editor.
          * @param {DataLab.Model.GraphNode} node the newly selected node
         **/
        setNode(node: GraphNodeViewModel): void;
        onCommit(propertyItem: PropertyViewModel, e: JQueryEventObject): void;
        /**
          * Removes all properties from the property editor and clears the heading for the
          * module parameters section
         **/
        clearModuleParameters(): void;
        navigateToParentHandler(): void;
        navigateToWebServiceHandler(): void;
        /**
          * Ensure the specified parameter is visible. This may require moving entities into view, opening the drawer, etc.
          * Sends focus to the specified parameter, will cause any error balloons to appear.
          * @param {DataLab.Model.Parameter} parameter The parameter to show
         **/
        navigateToParameter(parameter: DataLab.Model.Parameter): void;
        /**
         * Handler for the submit-to-competition-entry button click event.
         */
        submitCompetitionEntry(): void;
        private toggleDrawer();
        private setupEventHandlers();
        viewModelForProperty(propertyToFind: DataLab.Model.IProperty): PropertyViewModel;
        private findModePropertyViewModel(properties, propertyToFind);
    }
}

/// <reference path="../Global.d.ts" />
/// <reference path="../Common/DialogInterfaces.d.ts" />
declare module ExperimentEditor {
    interface IDialogViewModel {
        dismissed(result: IDialogResult): void;
        canBeAccepted?(): boolean;
    }
    interface IDialogViewFactory {
        new (viewModel: IDialogViewModel): DialogView;
        show(viewModel: IDialogViewModel): DataLab.Util.Promise<IDialogResult>;
    }
    /** IDialog implementation which renders a Knockout template and view-model.
        The view-model must implement {IDialogViewModel} to facilitate dismissal
        notification (i.e. so the viewmodel can perform some action if the user
        dismisses the dialog affirmatively). */
    class DialogView implements IDialog {
        optionsOverrides: Shell.UI.DialogPresenter.IDialogOptions;
        private hasBeenShown;
        private dialogResult;
        private dialogHostResultSubscription;
        private koTemplate;
        private viewModel;
        constructor(koTemplate: string, viewModel?: IDialogViewModel, optionsOverrides?: Shell.UI.DialogPresenter.IDialogOptions);
        static createFactoryForTemplate(koTemplate: string, optionsOverrides?: Shell.UI.DialogPresenter.IDialogOptions): IDialogViewFactory;
        show(): DataLab.Util.Promise<IDialogResult>;
        close(): void;
        canBeAccepted(): boolean;
        private onDialogDismissed(result);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
/// <reference path="../ExperimentEditor/PortViewModel.d.ts" />
declare module ExperimentEditor {
    class OutputPromotionDialogViewModel<T extends DataLab.Model.Resource> implements IDialogViewModel {
        outputPort: OutputPort;
        resource: DataLab.Model.UnsavedResource;
        /** Fired if the user initiates promotion of an output port (by accepting the dialog).
            The event value is a DataLab.Util.Promise representing the in-progress promotion. */
        resourcePromotionStartedEvent: KnockoutSubscribable<DataLab.Util.Promise<DataLab.Model.Resource>>;
        private workspace;
        private promoteFunc;
        constructor(port: OutputPort, resource: DataLab.Model.UnsavedResource, resourceCache: DataLab.IResourceCache<T>, promoteFunc: (portModel: DataLab.Model.OutputPort, name: string, familyId: string, description: string) => DataLab.Util.Promise<DataLab.Model.Resource>);
        canBeAccepted(): boolean;
        dismissed(result: IDialogResult): void;
        private promote();
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
declare module ExperimentEditor {
    class CreateWebServiceFromTrainedModelDialogViewModel implements IDialogViewModel {
        name: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        private handler;
        constructor(name: string, handler: (name: string, description: string) => void);
        canBeAccepted(): boolean;
        dismissed(result: IDialogResult): void;
    }
}

/// <reference path="../Global.d.ts" />
/// <reference path="DialogView.d.ts" />
declare module ExperimentEditor.DialogViews {
    var OutputPromotion: IDialogViewFactory;
    var Confirmation: IDialogViewFactory;
    var UploadDataset: IDialogViewFactory;
    var UploadCustomModulePackage: IDialogViewFactory;
    var SaveSSSIMDataset: IDialogViewFactory;
    var InteractiveScore: IDialogViewFactory;
    var TrainedModelPromotion: IDialogViewFactory;
    var TransformModulePromotion: IDialogViewFactory;
    var FeedbackControl: IDialogViewFactory;
    var CreateWebServiceFromTrainedModel: IDialogViewFactory;
    var PublishToCommunityStepOnComplete: IDialogViewFactory;
    var ShowApiCode: IDialogViewFactory;
    var CopyExperiment: IDialogViewFactory;
    var CopyExperimentFromGallery: IDialogViewFactory;
    function createViews(): void;
}

/// <reference path="../../Global.d.ts" />
/// <reference path="ExperimentEditorViewModel.d.ts" />
/// <reference path="../../View/ExperimentEditorContainer.d.ts" />
/// <reference path="../PaletteControl/PaletteViewModel.d.ts" />
/// <reference path="../PropertyEditorControl/PropertyEditorViewModel.d.ts" />
/// <reference path="../Dialogs/OutputPromotionDialogViewModel.d.ts" />
/// <reference path="../Dialogs/CreateWebServiceFromTrainedModelDialogViewModel.d.ts" />
/// <reference path="../../View/DialogViewFactories.d.ts" />
declare module ExperimentEditor {
    interface IGraphFetcher {
        loadFromService(id: string): DataLab.Util.Promise<DataLab.Model.Experiment>;
    }
    interface IExperimentValidationResult {
        allErrors: DataLab.Validation.IObjectError[];
        unhandledErrors: DataLab.Validation.IObjectError[];
        valid: boolean;
    }
    class ExperimentEditorContainerViewModel extends DataLab.Util.Disposable {
        private refreshExperimentHandler;
        private navigateToParentHandler;
        private navigateToWebServiceHandler;
        private alertHandler;
        private outputPromotionProgressHandler;
        private nodesEligibleForUpgradeHandler;
        private cannotSaveDraftHandler;
        private graphFetcher;
        private endpointDownloader;
        experimentEditorViewModel: ExperimentEditorViewModel;
        paletteViewModel: PaletteViewModel;
        propertyEditorViewModel: PropertyEditorViewModel;
        webServiceViewModel: ExperimentWebServiceViewModel;
        experimentId: KnockoutObservable<string>;
        readOnlyMode: KnockoutObservable_ReadOnly<boolean>;
        userWorkspaceExperiment: KnockoutComputed<boolean>;
        workspace: DataLab.Model.Workspace;
        searchText: KnockoutObservable<string>;
        descriptionFocus: KnockoutObservable<boolean>;
        paletteIsCollapsed: KnockoutObservable<boolean>;
        projectViewModel: ProjectViewModel;
        onRefreshFromNewExperiment: (oldExperiment: DataLab.Model.Experiment, newExperiment: DataLab.Model.Experiment) => void;
        constructor(workspace: DataLab.Model.Workspace, graphFetcher: IGraphFetcher, experimentId: string);
        experiment: DataLab.Model.Experiment;
        registerNavigateToParentHandler(handler: (parentExperimentId: string) => void): void;
        registerNavigateToWebServiceHandler(handler: (publishedWebServiceGroupId: string) => void): void;
        registerOutputPromotionProgressHandler(handler: (promise: DataLab.Util.Promise<any>) => void): void;
        /** Register a handler to be called when the user should be prompted to upgrade outdated modules / datasets in the experiment. */
        registerNodeUpgradeEligibilityHandler(handler: (eligibleNodes: DataLab.Model.GraphNode[]) => void): void;
        registerAlertHandler(handler: (message: string) => void): void;
        registerCannotSaveDraftHandler(handler: (message: string) => void): void;
        refreshExperiment(): DataLab.Util.Promise<any>;
        startAutoRefresh(): void;
        loadFromService(): DataLab.Util.Promise<any>;
        navigateToParent(): void;
        navigateToWebService(): void;
        clone(suppressUpgradePrompt?: boolean): void;
        /**
         * Copies the current experiment. Unlike clone, the new experiment is the root of a new lineage.
         */
        copy(copyName?: string): void;
        /**
         * Creates a copy of the current experiment. Utility function used by both the "copy" and "clone" functions
         */
        private createExperimentCopy(suppressUpgradePrompt?);
        submit(): DataLab.Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
        publish(): DataLab.Util.Promise<any>;
        save(): DataLab.Util.Promise<void>;
        discard(): DataLab.Util.Promise<void>;
        cancel(): DataLab.Util.Promise<void>;
        firstTimePublishWebService(webServiceGroupName: string): DataLab.Util.Promise<any>;
        republishWebService(webServiceGroupId: string, webServiceId: string): DataLab.Util.Promise<any>;
        firstTimePublishExperimentToCommunity(publishableExperiment: DataLab.Model.PublishableExperiment): promise<any>;
        validate(): IExperimentValidationResult;
        private pollOnPackage(experimentPackage);
        private pollOnPackageHandler(experimentPackage, retryCount, resultPromise);
        private promoteOutputToDataset(target);
        private promoteOutputToModel(target);
        private promoteOutputToTransform(target);
        private promoteCreateWebService(target);
        private createTrainedModelAndWebServiceGraph(name, description, target);
        private createTransformAndWebServiceGraph(name, description, target);
        private activateEntity(entity, secondaryActivation);
        /** If nodes in the graph are eligible for upgrade, prompts the user to upgrade them (via nodesEligibleForUpgradeHandler). */
        private promptForUpgradeIfNodesAreEligible();
    }
}

/// <reference path="../ViewModel/PropertyEditorControl/PropertyEditorViewModel.d.ts" />
declare module ExperimentEditor {
    class PropertyEditorControl extends DataLab.Util.Disposable {
        private rootContainerDiv;
        viewModel: PropertyEditorViewModel;
        /**
          * Constructor of the PropertyEditorControl
          * @constructor
          * @param rootContainerId {string} the div the control applies its knockout bindings to
          * @param viewModel {PropertyEditorViewModel} the view model backing the property editor
         **/
        constructor(rootContainerDiv: HTMLDivElement, viewModel: PropertyEditorViewModel);
    }
}

/// <reference path="../Global.d.ts" />
/// <reference path="ExperimentEditorControl.d.ts" />
/// <reference path="PaletteControl.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/ExperimentEditorContainerViewModel.d.ts" />
/// <reference path="PropertyEditorControl.d.ts" />
declare module ExperimentEditor {
    module Constants.PropertyEditor {
        var Id: string;
    }
    class ExperimentEditorContainer extends DataLab.Util.Disposable {
        private parentDiv;
        private paletteView;
        private experimentEditorContainerViewModel;
        private xeControl;
        private propertyEditorControl;
        constructor(parentDiv: HTMLDivElement, xeContainerViewModel: ExperimentEditorContainerViewModel);
        zoomToFitIfSample(): void;
        zoomToFitWithAnimation(): DataLab.Util.Promise<any>;
        dispose(): void;
    }
}

/// <reference path="../Global.d.ts" />
declare module ExperimentEditor {
    class PublishWebServiceDialogViewModel {
        webServiceGroupName: KnockoutObservable<string>;
        error: boolean;
        constructor(description: string, error: boolean);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
declare module ExperimentEditor {
    class InputColumnViewModel {
        valueType: string;
        value: KnockoutObservable<string>;
        name: string;
        friendlyName: string;
        allowedValues: string[];
        constructor(name: string, valueType: string, value: any, friendlyName: string, allowedValues: string[]);
    }
    class WebServiceParameterViewModel {
        metadata: DataLab.DataContract.IGlobalParameterMetadata;
        value: KnockoutObservable<any>;
        constructor(metadata: DataLab.DataContract.IGlobalParameterMetadata, value: any);
    }
    class ScoreDialogErrorInfo {
        title: string;
        message: string;
        constructor(title: string, message: string);
    }
    class ScoreDialogViewModel implements IDialogViewModel {
        wsgName: string;
        wsgId: string;
        inputColumns: InputColumnViewModel[];
        webServiceParameters: WebServiceParameterViewModel[];
        webserviceId: string;
        workspace: DataLab.Model.Workspace;
        constructor(modelPackageInfo: DataLab.DataContract.IModelPackageInfo, webServiceGroup: DataLab.DataContract.IWebServiceGroup, webserviceId: string, workspace: DataLab.Model.Workspace);
        dismissed(result: IDialogResult): void;
        canBeAccepted(): boolean;
        getScoringResultSummary(result: any): string;
        getScoringErrorInfo(error: DataLab.Util.AjaxError): ScoreDialogErrorInfo;
        private tryParseJson(text);
        private getDefaultValue(type, allowedValues);
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="../Typescript/View/DialogViewFactories.d.ts" />
/// <reference path="../Typescript/ViewModel/Dialogs/ScoreDialogViewModel.d.ts" />
/// <reference path="../Typescript/View/ExperimentEditorContainer.d.ts" />
declare module DataLabViews {
    var WebServiceGroupType: FxType;
    class WebService {
        Id: string;
        Url: string;
        Type: string;
        CreationTime: Date;
        constructor(id: string, url: string, type: string, creationTime: Date);
    }
}

/// <reference path="../Typescript/Global.d.ts" />
declare module DataLabViews {
    class ViewBase extends DataLab.Util.Disposable {
        private extensionName;
        constructor(extensionName: any);
        isViewExtensionStillActive(): boolean;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="CustomUX.d.ts" />
declare module ExperimentEditor.ExperimentSaveAs {
    class ExperimentSaveAsViewModel extends DataLab.Util.Disposable implements ExperimentEditor.CustomUX.ICustomUXViewModel {
        saveNameAndClose: () => void;
        name: DataLab.Validation.IValidatableObservable;
        launchSaveAsHelp: () => void;
        hasErrors: KnockoutObservable<boolean>;
        save: () => void;
        constructor(newExperimentName: KnockoutObservable<string>, oldExperimentName: string);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    class TagTextBoxViewModel {
        tags: KnockoutObservableArray<string>;
        setNameInputFocused: () => void;
        nameInputFocused: KnockoutObservable<boolean>;
        removeTag: (string) => void;
        currentTag: DataLab.Validation.IValidatableObservable;
        hasTags: KnockoutComputed<boolean>;
        constructor(tags: KnockoutObservableArray<string>);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    interface IFxRadioTextValuePair {
        text: string;
        value: any;
    }
}

/// <reference path="../Global.d.ts" />
declare module ExperimentEditor {
    interface OnWizardClosingInfo {
        completed: boolean;
    }
    interface IWizardViewModel extends DataLab.Util.IDisposable {
        onWizardClosing: (info: OnWizardClosingInfo) => boolean;
        isNextStepDisabled?: KnockoutComputed<boolean>;
    }
    class WizardView {
        private wizardContentViewModel;
        private wizard;
        onWizardClosingEvent: KnockoutSubscribable<OnWizardClosingInfo>;
        private wizardInternalViewModel;
        show(): void;
        private enableOrDisable;
        constructor(wizardContentViewModel: IWizardViewModel, stepsAny: any, fxsWizardOptions: any);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="TagTextBoxViewModel.d.ts" />
/// <reference path="../../../../../../External/Typescript/jquery.d.ts" />
/// <reference path="../../View/CustomBindingHandlers/fxRadio.d.ts" />
/// <reference path="../../View/WizardView.d.ts" />
declare module ExperimentEditor {
    enum ImageSelectionMode {
        SelectYourOwn = 0,
        StockImageFromGallery = 1,
    }
    class PublishToCommunityWizardViewModel extends DataLab.Util.Disposable implements IWizardViewModel {
        private experimentViewModel;
        experimentName: DataLab.Validation.IValidatableObservable;
        summary: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        hasCredentials: boolean;
        visibility: KnockoutObservable<DataLab.Model.CommunityExperimentVisibility>;
        tags: KnockoutObservableArray<string>;
        isValid: KnockoutComputed<boolean>;
        isNextStepDisabled: KnockoutComputed<boolean>;
        onWizardClosingEvent: KnockoutSubscribable<OnWizardClosingInfo>;
        onWizardCompleted: KnockoutObservable<boolean>;
        imageViewModel: ImageSelectorViewModel;
        uploadImageOption: KnockoutObservable<ImageSelectionMode>;
        static uploadImageOptions: IFxRadioTextValuePair[];
        hasConsented: KnockoutObservable<boolean>;
        hasConsentedCredentials: KnockoutObservable<boolean>;
        useMarkdownEditor: boolean;
        onWizardClosing(info: OnWizardClosingInfo): boolean;
        getPublishableExperiment(): DataLab.Model.PublishableExperiment;
        constructor(experimentViewModel: ExperimentEditor.ExperimentViewModel);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    interface ITwitterButtonOptions {
        url?: string;
        text?: string;
        related?: string;
        hashtags?: string;
        via?: string;
        "in-reply-to"?: string;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/CustomBindingHandlers/fxRadio.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
/// <reference path="../../View/CustomBindingHandlers/TwitterButton.d.ts" />
declare module ExperimentEditor {
    class PublishToCommunityOnCompleteViewModel implements IDialogViewModel {
        catalogExperimentUrl: KnockoutObservable<string>;
        defaultPromotionTitle: KnockoutObservable<string>;
        defaultPromotionText: KnockoutObservable<string>;
        twitterButtonOptions: KnockoutComputed<ITwitterButtonOptions>;
        emailBody: KnockoutComputed<string>;
        emailSubject: KnockoutComputed<string>;
        emailLink: KnockoutComputed<string>;
        shouldGoToPublishedExperiment: KnockoutObservable<boolean>;
        constructor(catalogExperimentUrl: string);
        dismissed(result: IDialogResult): void;
    }
}

/// <reference path="../../../TypescriptLib/lodash.d.ts" />
declare var buttonBarId: string, inputAreaId: string, previewAreaId: string;
declare enum ScorllingSource {
    EDIT = 0,
    PREVIEW = 1,
}
declare module ExperimentEditor {
    class MarkdownEditor {
        constructor(value: any, placeholder: any, element: any, idPostfix: any);
        value: KnockoutObservable<string>;
        placeholder: KnockoutObservable<string>;
        buttonBarId: KnockoutObservable<string>;
        inputAreaId: KnockoutObservable<string>;
        previewAreaId: KnockoutObservable<string>;
        inPreview: KnockoutObservable<boolean>;
        toPreview(previewMode: any): void;
        private syncScrolling(scorllingSource);
        private setupMarkdown();
        private textareaElement;
        private previewElement;
        private converter;
        private editor;
        private previousEditorScrollPosition;
        private previousPreviewScrollPosition;
    }
    interface MarkdownEditorFactoryParams {
        value: KnockoutObservable<string>;
        placeholder: string;
        idPostfix?: string;
    }
    function createMarkdownEditorViewModel(params: MarkdownEditorFactoryParams, componentInfo: any): MarkdownEditor;
    var markdownEditorRegisterInfo: {
        componentName: string;
        viewModel: {
            createViewModel: (params: MarkdownEditorFactoryParams, componentInfo: any) => MarkdownEditor;
        };
        template: string;
    };
}

/// <reference path="../Global.d.ts" />
declare module ExperimentEditor {
    interface IStrippedDialogOptions {
        canCloseWithEscape?: boolean;
    }
    class StrippedDialog {
        private dialog;
        private options;
        constructor(options?: IStrippedDialogOptions);
        show(data: any, template: string, size?: string[]): void;
        close(event?: Event): void;
        private closeAnyActiveDialog();
        private autofocus(container);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/StrippedDialog.d.ts" />
declare module ExperimentEditor {
    function showExpiredTrialDialog(): void;
    function showDisabledFeatureDialog(): void;
    function showDisabledDatasetUploadDialog(): void;
    function showDisabledModuleUploadDialog(): void;
    function showDisabledModuleDialog(familyId?: string, moduleName?: string): void;
    function showDisabledWebServicePublishDialog(): void;
    function showDisabledPublishToCommunityDialog(): void;
    function showExceededNumberOfModulesLimitDialog(value?: number): void;
    function showExceededStorageLimitDialog(value?: number): void;
    function showParallelRunDisabledDialog(): void;
    function showExceededRuntimeLimitDialog(value?: number): void;
    function tryShowDialogForTrialRestriction(error: Error): boolean;
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="../Typescript/View/ExperimentEditorContainer.d.ts" />
/// <reference path="../Typescript/View/PublishWebServiceDialog.d.ts" />
/// <reference path="WebServiceGroupView.d.ts" />
/// <reference path="DataLabView.d.ts" />
/// <reference path="../Typescript/ViewModel/ExperimentEditor/ExperimentSaveAsViewModel.d.ts" />
/// <reference path="../Typescript/View/DialogViewFactories.d.ts" />
/// <reference path="../Typescript/ViewModel/ExperimentEditor/PublishToCommunityWizardViewModel.d.ts" />
/// <reference path="../Typescript/ViewModel/ExperimentEditor/PublishToCommunityOnCompleteViewModel.d.ts" />
/// <reference path="../Typescript/View/MarkdownEditor/MarkdownEditor.d.ts" />
/// <reference path="../Typescript/View/ExperimentEditorControl.d.ts" />
/// <reference path="../Typescript/View/WizardView.d.ts" />
/// <reference path="../Typescript/ViewModel/Dialogs/TrialDialogs.d.ts" />
declare module DataLabViews {
    interface FxType {
        name: string;
        displayName: string;
        dataFunction: (dataRequest: any, path: string, dataSet: any) => void;
        draftExperimentId?: string;
    }
    var experimentExtensionName: string;
    var dataflowExtensionName: string;
    var webServiceGroupExtensionName: string;
    var ExperimentType: FxType;
    var ExperimentLineageType: FxType;
    var DataflowType: FxType;
    function navigateToExperiment(experimentId: any): void;
    function navigateToExperimentLineage(experimentId: any): void;
    function navigateToDataflow(dataflowId: any): void;
    function navigateToWebService(webServiceGroupId: any): void;
    class ExperimentView extends DataLabViews.ViewBase {
        commandsDisabled: KnockoutObservable<boolean>;
        private _renderArea;
        private xeViewModel;
        private xeControlContainer;
        private newExperimentSubscription;
        private descriptionSubscription;
        private upgradeNotificationOpen;
        private notifications;
        private createScoreGraphOperation;
        private updateScoreGraphOperation;
        private prepareWebServiceOperation;
        constructor(renderArea: any, experimentId: any, workspace: any);
        private addNotification(notification);
        private removeNotifications();
        private validateExperiment();
        publish(): void;
        submit(): void;
        createScoringGraphCommand(): void;
        prepareWebServiceCommand(): void;
        handlePublishWebServiceCommand(): void;
        launchPublishWebServiceDialog(): promise<any>;
        firstTimePublishWebService(webServiceGroupName: string): promise<any>;
        republishWebService(webServiceGroupId: string, webServiceId: string): promise<any>;
        handlePublishToCommunityCommand(): void;
        launchPublishToCommunityDialog(): void;
        onPublishToCommunityComplete(catalogExperimentUrl: string): void;
        firstTimePublishToCommunity(publishableExperiment: DataLab.Model.PublishableExperiment): promise<any>;
        save(): void;
        confirmDiscard(): void;
        discard(): void;
        saveAs(): void;
        cancel(): void;
        refresh(): void;
        open(): void;
        private showLineage();
        _updateSidebarTitle(title: any): void;
        private isPublishToCommunityOrWebServiceDisabled();
        setCommands(): void;
        private showErrorNotification(title, details?);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="HelpSearchViewModel.d.ts" />
/// <reference path="../../../DataLabViews/ExperimentView.d.ts" />
declare var environment: any;
declare module ExperimentEditor.Help {
    var currentHelpTopic: KnockoutObservable<string>;
    var moduleTopicID: KnockoutObservable<string>;
    var resourceName: KnockoutObservable<string>;
    function setHelpContent(content: string, topicID?: string, resourceNameArg?: string): void;
    function getTopicUrl(topic: string): string;
    function openHelpWindow(helpTopicURL: string, anchor?: string): void;
    function Initialize(): void;
    function QuickHelpMoreInfo(): void;
}

/// <reference path="../../Global.d.ts" />
/// <reference path="IconUtilities.d.ts" />
/// <reference path="IPaletteItem.d.ts" />
/// <reference path="IPaletteDragResponder.d.ts" />
/// <reference path="../ExperimentEditor/Help.d.ts" />
declare module ExperimentEditor {
    class PaletteItem implements IPaletteItem {
        id: KnockoutObservable<string>;
        name: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        type: KnockoutObservable<string>;
        classId: KnockoutObservable<string>;
        tooltip: KnockoutObservable<string>;
        isVisible: KnockoutObservable<boolean>;
        constructor(id: string, name: string, description: string, type: string);
    }
    class PaletteCategory extends DataLab.Util.Disposable {
        name: KnockoutObservable<string>;
        path: string;
        items: KnockoutObservableArray<PaletteItem>;
        isEmpty: KnockoutComputed<boolean>;
        childCategories: KnockoutObservableArray<PaletteCategory>;
        isCollapsed: KnockoutObservable<boolean>;
        icon: string;
        private currentSearchFilter;
        private resourceCache;
        private isCollapsedWhenSearchEmpty;
        private hasVisibleItems;
        private hasVisibleChildCategories;
        constructor(categoryPath: string, resourceCache?: DataLab.IResourceCache<DataLab.Model.Resource>, children?: DataLab.ICategoryInfoMap);
        /**
         * Perform a case-insensitive search over all palette items (name, description and category heading)
         * using the supplied search text.
         * @return {boolean} whether any item in this category matches the search text
         */
        applyPaletteSearch(searchText: string): boolean;
        /**
          * Applies the current search (set by {@see applyPaletteSearch}).
          * This is the only code which updates the visibility of palette items.
          * Also checks whether the palette category contains any visible items and sets this.isEmpty() accordingly.
          * The list of PaletteItems is provided as a parameter to facilitate pre-filtering the item list
          * before exposing it to the view.
        */
        private applyCurrentSearchFilterToItems(items);
        /**
         * Populates palette items for the current contents of the underlying resource cache that belong in this category.
         * Only the latest version in each resource family is included, and the updated list is sorted by name.
         * The current search filter is re-applied to the new palette category list.
         */
        private updatePaletteItemsFromResourceCache();
        private createPaletteItemForResource(resource);
        private getEntityTypeOfResource(resource);
    }
    class PaletteViewModel extends DataLab.Util.Disposable {
        private activationAction;
        private mouseDown;
        private mouseMove;
        private mouseUp;
        private activate;
        private datasetCache;
        private trainedModelCache;
        private transformModulesCache;
        private moduleCache;
        private keyDragHandler;
        private canceled;
        private firstModuleCategoryIndex;
        isDragging: KnockoutObservable<boolean>;
        categories: KnockoutObservableArray<PaletteCategory>;
        dragResponder: IPaletteDragResponder;
        constructor(moduleCategoryRegistry: DataLab.ICategoryInfoMap, datasetCategoryRegistry: DataLab.ICategoryInfoMap, datasetCache: DataLab.IResourceCache<DataLab.Model.Dataset>, moduleCache: DataLab.IResourceCache<DataLab.Model.Module>, trainedModelCache: DataLab.IResourceCache<DataLab.Model.TrainedModel>, transformModulesCache: DataLab.IResourceCache<DataLab.Model.Transform>);
        registerActivationEvent(callback: (paletteItem: IPaletteItem) => void): void;
        /**
         * Perform a case-insensitive search over all palette items (name and description) and category headings
         * in the entire palette using the supplied search text.
         */
        applyPaletteSearch(searchText: string): void;
        cancelDrag(): void;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Entity.d.ts" />
/// <reference path="GraphNodeViewModel.d.ts" />
/// <reference path="PortViewModel.d.ts" />
/// <reference path="../PropertyEditorControl/PropertyViewModel.d.ts" />
/// <reference path="../PaletteControl/PaletteViewModel.d.ts" />
declare module ExperimentEditor {
    class Module extends GraphNodeViewModel {
        moduleNode: DataLab.Model.ModuleNode;
        startTime: StaticTextPropertyViewModel;
        endTime: StaticTextPropertyViewModel;
        elapsedTime: StaticTextPropertyViewModel;
        statusCode: StaticTextPropertyViewModel;
        statusDetails: StaticTextPropertyViewModel;
        outputLog: EndpointPropertyViewModel;
        errorLog: EndpointDialogPropertyViewModel;
        outputEndpoints: EndpointPropertyViewModel[];
        constructor(moduleNode: DataLab.Model.ModuleNode, workspace: DataLab.Model.Workspace);
        label: string;
        startValidating(): void;
        updateValidState(): void;
        private subscribeToParameters(parameters);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="GraphControlViewModel.d.ts" />
declare module ExperimentEditor.Visualization {
    class D3GraphViewModel {
        graphType: KnockoutComputed<GraphType>;
        xlog: KnockoutObservable<boolean>;
        ylog: KnockoutObservable<boolean>;
        binCount: KnockoutObservable<number>;
        categoryCount: KnockoutObservable<number>;
        cumulativeDistibution: KnockoutObservable<boolean>;
        probabilityDensity: KnockoutObservable<boolean>;
        datatable: DataLab.DataContract.DataTable;
        feature: DataLab.DataContract.DataTableFeatures;
        crossCompareFeature: KnockoutObservable<DataLab.DataContract.DataTableFeatures>;
        index: number;
        subscribed: boolean;
        layout: DataLab.DataContract.DataTable;
        private _graphType;
        constructor(graphType: GraphType, xlog: KnockoutObservable<boolean>, ylog: KnockoutObservable<boolean>, binCount: KnockoutObservable<number>, categoryCount: KnockoutObservable<number>, cumulativeDistribution: KnockoutObservable<boolean>, probabilityDensity: KnockoutObservable<boolean>, datatable: DataLab.DataContract.DataTable, feature: DataLab.DataContract.DataTableFeatures, crossCompareFeature: KnockoutObservable<DataLab.DataContract.DataTableFeatures>, layout: DataLab.DataContract.DataTable, index?: number);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="D3GraphViewModel.d.ts" />
/// <reference path="VisualizationViewModel.d.ts" />
declare module ExperimentEditor.Visualization {
    enum GraphType {
        Histogram = 0,
        BoxPlot = 1,
        ScatterPlot = 2,
        MultiboxPlot = 3,
        Crosstab = 4,
    }
    class ScaleBoxViewModel {
        visible: KnockoutObservable<boolean>;
        value: KnockoutObservable<boolean>;
        label: KnockoutObservable<string>;
        constructor(visible: boolean, value: boolean, label: string);
        refresh(visible: boolean, label: string): void;
    }
    class GraphControlViewModel {
        crossCompareFeature: KnockoutObservable<string>;
        feature: string;
        private compareToFeatures;
        private graphType;
        private graphTypeString;
        parametersVisible: KnockoutComputed<boolean>;
        private scaleCheckboxesVisible;
        private xScaleCheckbox;
        private yScaleCheckbox;
        private binCountVisible;
        private binCount;
        private categoriesVisible;
        private categoriesCount;
        private probabilityFunctionsVisible;
        private cumulativeDistribution;
        private probabilityDensity;
        private graph;
        private featureContract;
        private crossCompareFeatureContract;
        isNull: boolean;
        private mainGraphType;
        constructor(compareToFeatures: string[], datatable: DataLab.DataContract.DataTable, featureContract: DataLab.DataContract.DataTableFeatures, layout: DataLab.DataContract.DataTable);
        setCrossCompareFeature(featureName: string): void;
        setGraphType(graphType: GraphType): void;
        private logGraphControlEvent(eventName);
        private createInputsUI();
    }
    var NullGraph: GraphControlViewModel;
}

/// <reference path="../../Global.d.ts" />
/// <reference path="GraphControlViewModel.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
declare module ExperimentEditor.Visualization.Constants {
    var placeholderWidth: string;
    var placeholderHeight: string;
    var graphControlWidth: string;
    var graphControlheight: string;
    var transitionDuration: number;
    var maxPrecision: number;
    var maxPrecisionOfStats: number;
    var maxNumberOfRowsToDisplay: number;
    var typesToNotReducePrecision: string[];
}
declare module ExperimentEditor.Visualization {
    class ColumnViewModel {
        selected: KnockoutObservable<boolean>;
        name: string;
        minimizedGraph: D3GraphViewModel;
        columnStatistics: KnockoutObservableArray<IColumnStatistic>;
        graphControl: GraphControlViewModel;
        constructor(name: string, graphControl: GraphControlViewModel, minimizedGraph: D3GraphViewModel, columnStatistics: IColumnStatistic[]);
    }
    interface IColumnStatistic {
        name: string;
        value: any;
    }
    class SnapshotViewModel {
        feature: string;
        visible: KnockoutObservable<boolean>;
        animationDuration: number;
        constructor(feature: string);
    }
    function reduceToFixedPrecision(value: number, precision: number): number;
    class DataTableViewModel {
        records: any[];
        numberOfRows: number;
        numberOfColumns: number;
        constructor(datatable: DataLab.DataContract.DataTable, numColumnsToDisplay: number);
    }
    class VisualizationViewModel extends DataLab.Util.Disposable implements ExperimentEditor.CustomUX.ICustomUXViewModel {
        snapshots: KnockoutObservableArray<SnapshotViewModel>;
        graphControl: KnockoutObservable<GraphControlViewModel>;
        columns: KnockoutObservableArray<ColumnViewModel>;
        currentSelectedColumnIndex: KnockoutObservable<number>;
        currentSelectedColumnViewModel: KnockoutComputed<ColumnViewModel>;
        statsAndGraphsIsCollapsed: KnockoutObservable<boolean>;
        statsIsCollapsed: KnockoutObservable<boolean>;
        visualizationIsCollapsed: KnockoutObservable<boolean>;
        parametersAreVisible: KnockoutComputed<boolean>;
        placeholderIsVisible: KnockoutComputed<boolean>;
        columnIsSelected: KnockoutComputed<boolean>;
        private dataTableViewModel;
        private minimizedGraphsTypeEnum;
        private minimizedGraphsType;
        private datatable;
        private entireDatasetIsPresent;
        private layout;
        private featureNames;
        private statsDataTable;
        constructor(datatable: DataLab.DataContract.DataTable, stats: DataLab.DataContract.DataTable, layout: DataLab.DataContract.DataTable);
        private constructColumnViewModels(numColumnsToDisplay);
        private constructMinimizedGraphViewModel(featureIndex);
        private constructColumnStatistics(featureIndex);
        private getStatisticName(name);
        private selectColumn(viewModel, event);
        private setSelectedColumnStyle(columnIndex, previousIndex);
        private setHeightOfResizeBar(delay, height?);
        private createHeightOfResizeBarSubscription(delay, heightComputation?);
        private setGraphType(graphType);
        private setHistogramMode();
        private setBoxchartMode();
        private takeSnapshot();
        private closeSnapshot(viewModel, e);
        private addFeatureTypeToStatsTable(featureTypes);
    }
}

declare module ExperimentEditor.CustomUX.Constants {
    var DarkBlue: string;
    var DarkRed: string;
    var Green: string;
    var Turquoise: string;
    var Blue: string;
    var BurntOrange: string;
    var Red: string;
    var DarkGreen: string;
    var Purple: string;
    var Teal: string;
    var Orange: string;
    var LightBlue: string;
    var LightRed: string;
    var LightGreen: string;
    var LightPurple: string;
    var Grey: string;
    var ColorTable: string[];
}

/// <reference path="Constants.d.ts" />
/// <reference path="../../Global.d.ts" />
/// <reference path="../../../TypescriptLib/d3.d.ts" />
declare module ExperimentEditor.CustomUX {
    class PlotContainerViewModel extends DataLab.Util.Disposable {
        private rocPlot;
        private prPlot;
        private liftPlot;
        private padding;
        private plotAreaWidth;
        private plotAreaHeight;
        private chartNameToDescription;
        private plotViewModels;
        chartNames: KnockoutObservableArray<string>;
        currentChart: KnockoutObservable<string>;
        xScale: KnockoutComputed<(number) => number>;
        yScale: KnockoutComputed<(number) => number>;
        yAxisLabel: KnockoutComputed<string>;
        xAxisLabel: KnockoutComputed<string>;
        plotData: KnockoutComputed<IDataSeries[]>;
        colors: KnockoutObservableArray<string>;
        width: KnockoutObservable<number>;
        height: KnockoutObservable<number>;
        setCurrentChart: any;
        svgLineFunction: KnockoutComputed<(any) => string>;
        renderSvg: any;
        constructor(plots: PlotViewModel[]);
        drawAxes(xScale: any, yScale: any, chartType: string): void;
    }
    interface IPlotDescription {
        plotName: string;
        xScale: any;
        yScale: any;
        xAxisLabel: string;
        yAxisLabel: string;
    }
}

/// <reference path="BinaryClassificationUX.d.ts" />
/// <reference path="PlotContainerViewModel.d.ts" />
declare module ExperimentEditor.CustomUX {
    class BinaryClassificationComparisonUXViewModel extends DataLab.Util.Disposable implements CustomUX.ICustomUXViewModel {
        private viewModels;
        currentViewModel: KnockoutComputed<BinaryClassificationUXViewModel>;
        currentViewModelIndex: KnockoutObservable<number>;
        plotContainer: KnockoutObservable<PlotContainerViewModel>;
        loaded: KnockoutObservable<boolean>;
        setCurrentViewModelIndex: (index: number) => void;
        constructor(parsedData: IBinaryClassificationComparisonData);
    }
    interface IBinaryClassificationComparisonData {
        visualizationType: string;
        reports: any[];
    }
}

declare module ExperimentEditor.D3Graph.Constants {
    var numericAxisLabelPrecision: number;
    var defaultBinCount: number;
    var defaultCategoryCount: number;
}
declare module ExperimentEditor.D3Graph {
    interface graphScale {
        name: string;
        index: number;
        label: string;
        func: (d: any) => any;
    }
    var Scales: {
        name: string;
        index: number;
        label: string;
        func: (d: any) => any;
    }[];
    function ObjectToArray(object: any): any[];
    function UniqueValueCounts(array: any, accessor: any): any;
    function NumericAxisFormatter(axisLabel: any): any;
    function CategoricalAxisFormatter(axisLabel: any): any;
    function AddAxes(svg: any, xAxis: any, yAxis: any, height: any, blPadding: any): void;
    function AddAxisLabels(svg: any, xLabel: any, yLabel: any, height: any, width: any, blPadding: any, trPadding: any): void;
    function GenerateAxisLabel(feature: any, scale: any): any;
    function CategoricalHistogramBins(dataset: any, feature: any, numBins: any, withOtherBin: any): any[];
    function BoxplotLayout(data: any): Object;
    function CreateBoxplotElements(svg: any, boxplot: any, yScale: any, midpoint: any, boxWidth: any, whiskerWidth: any, minimized: any): void;
    class CrosstabLayout {
        instances: any[];
        numberOfXCategories: number;
        numberOfYCategories: number;
        xCategories: string[];
        yCategories: string[];
        constructor(data: any[], xFeature: DataLab.DataContract.DataTableFeatures, yFeature: DataLab.DataContract.DataTableFeatures);
    }
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../../../ViewModel/Visualization/VisualizationViewModel.d.ts" />
/// <reference path="D3Common.d.ts" />
import V = ExperimentEditor.Visualization;
declare module ExperimentEditor.D3Graph {
    function createHistogram(svg: any, datatable: DataLab.DataContract.DataTable, feature: DataLab.DataContract.DataTableFeatures, xAxisScale: any, yAxisScale: any, binCounts: number, pdf: boolean, cdf: boolean, width: number, height: number, padding: number, layout: DataLab.DataContract.DataTable, minimized: boolean): void;
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../../../ViewModel/Visualization/VisualizationViewModel.d.ts" />
/// <reference path="D3Common.d.ts" />
declare module ExperimentEditor.D3Graph {
    function createBoxplot(svg: any, datatable: DataLab.DataContract.DataTable, feature: DataLab.DataContract.DataTableFeatures, scale: any, width: any, height: any, padding: any, layout: DataLab.DataContract.DataTable, minimized: any): void;
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../../../ViewModel/Visualization/VisualizationViewModel.d.ts" />
/// <reference path="D3Common.d.ts" />
declare module ExperimentEditor.D3Graph {
    function createScatterplot(svg: any, datatable: DataLab.DataContract.DataTable, xFeature: DataLab.DataContract.DataTableFeatures, yFeature: DataLab.DataContract.DataTableFeatures, xScale: any, yScale: any, width: any, height: any, padding: any): void;
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../../../ViewModel/Visualization/VisualizationViewModel.d.ts" />
/// <reference path="D3Common.d.ts" />
import C = DataLab.DataContract;
declare module ExperimentEditor.D3Graph {
    function createMultiboxplot(svg: any, datatable: C.DataTable, categoricalFeature: C.DataTableFeatures, numericFeature: C.DataTableFeatures, numericScale: any, numCategoriesS: any, width: any, height: any, padding: any): void;
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../../../ViewModel/Visualization/VisualizationViewModel.d.ts" />
/// <reference path="D3Common.d.ts" />
declare module ExperimentEditor.D3Graph {
    function createCrosstab(svg: any, datatable: DataLab.DataContract.DataTable, xFeature: DataLab.DataContract.DataTableFeatures, yFeature: DataLab.DataContract.DataTableFeatures, xScale: graphScale, yScale: graphScale, width: number, height: number, padding: number): void;
}

/// <reference path="../../Global.d.ts" />
/// <reference path="D3Graphing/D3Common.d.ts" />
/// <reference path="D3Graphing/Histogram.d.ts" />
/// <reference path="D3Graphing/Boxplot.d.ts" />
/// <reference path="D3Graphing/Scatterplot.d.ts" />
/// <reference path="D3Graphing/Multiboxplot.d.ts" />
/// <reference path="D3Graphing/Crosstab.d.ts" />
/// <reference path="../../ViewModel/Visualization/VisualizationViewModel.d.ts" />
declare module ExperimentEditor.D3Graph {
    var svgMap: any;
    function CreateGraph(element: Element, valueAccessor: () => any, targetViewModel: any): void;
}
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
/// <reference path="../../View/CustomBindingHandlers/d3graph.d.ts" />
declare module ExperimentEditor.CustomUX {
    class MulticlassConfusionMatrixViewModel extends DataLab.Util.Disposable {
        metrics: any[][];
        superHeaders: KnockoutObservableArray<LabelViewModel>;
        xClassLabels: KnockoutObservableArray<LabelViewModel>;
        yClassLabels: KnockoutObservableArray<LabelViewModel>;
        instances: KnockoutObservableArray<MulticlassConfusionMatrixInstanceViewModel>;
        width: KnockoutComputed<number>;
        height: KnockoutComputed<number>;
        showMetrics: KnockoutObservable<boolean>;
        metricsIsCollapsed: KnockoutObservable<boolean>;
        confusionMatrixIsCollapsed: KnockoutObservable<boolean>;
        private xAxisScale;
        private yAxisScale;
        private sideLength;
        private superHeaderPadding;
        private headerPadding;
        private rightPadding;
        private degreeOfRotation;
        private precision;
        constructor(matrix: IMulticlassConfusionMatrixData);
        private convertFrequencyMatrixToInstances(frequencyMatrix, classLabels);
        private createMetricsTable(matrix);
    }
    class MulticlassConfusionMatrixInstanceViewModel {
        trueLabel: KnockoutObservable<string>;
        predictedLabel: KnockoutObservable<string>;
        frequency: KnockoutObservable<number>;
        fractionOfActualClass: KnockoutObservable<number>;
        percentOfActualClass: KnockoutObservable<string>;
        isMainDiagonalEntry: KnockoutObservable<boolean>;
        xCoordinate: KnockoutObservable<number>;
        yCoordinate: KnockoutObservable<number>;
        sideLength: KnockoutObservable<number>;
        constructor(trueLabel: string, predictedLabel: string, frequency: number, fractionOfActualClass: number, xCoordinate: number, yCoordinate: number, sideLength: number);
    }
    class LabelViewModel {
        fullLabel: KnockoutObservable<string>;
        label: KnockoutObservable<string>;
        xCoordinate: KnockoutObservable<number>;
        yCoordinate: KnockoutObservable<number>;
        transform: KnockoutObservable<string>;
        constructor(label: string, xCoordinate: number, yCoordinate: number, transform: string, formatLabel: boolean);
    }
    interface IMulticlassConfusionMatrixData {
        classLabels: string[];
        frequencyMatrix: number[][];
        overallAccuracy?: number;
        averageAccuracy?: number;
        microAveragedPrecision?: number;
        macroAveragedPrecision?: number;
        microAveragedRecall?: number;
        macroAveragedRecall?: number;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
/// <reference path="MulticlassConfusionMatrixViewModel.d.ts" />
declare module ExperimentEditor.CustomUX {
    class MulticlassClassificationUXViewModel extends DataLab.Util.Disposable implements CustomUX.ICustomUXViewModel {
        private viewModels;
        loaded: KnockoutObservable<boolean>;
        constructor(parsedData: IMulticlassClassificationData);
    }
    interface IMulticlassClassificationData {
        visualizationType: string;
        matrices: IMulticlassConfusionMatrixData[];
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
declare module ExperimentEditor.CustomUX {
    class ROutputViewModel extends DataLab.Util.Disposable implements CustomUX.ICustomUXViewModel {
        private pngSrcBase;
        outputLogs: KnockoutObservableArray<OutputLogViewModel>;
        pngSrcs: KnockoutObservableArray<string>;
        showGraphicsDevice: KnockoutObservable<boolean>;
        constructor(rOutputData: IROutputData);
    }
    class OutputLogViewModel extends DataLab.Util.Disposable {
        label: KnockoutObservable<string>;
        content: KnockoutObservable<string>;
        show: KnockoutObservable<boolean>;
        constructor(outputLogData: IOutputLogData);
    }
    interface IROutputData {
        "Standard Output": string;
        "Standard Error": string;
        "Graphics Device": string[];
    }
    interface IOutputLogData {
        label: string;
        content: string;
        show: boolean;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
declare module ExperimentEditor.CustomUX {
    class GenericMimeViewModel extends DataLab.Util.Disposable implements CustomUX.ICustomUXViewModel {
        pngSrcBase: string;
        mimeSections: KnockoutObservableArray<MimeSectionViewModel>;
        constructor(genericMimeData: IGenericMimeData);
        getSectionTemplateByMimeType(dataType: string): string;
    }
    class MimeSectionViewModel extends DataLab.Util.Disposable {
        title: KnockoutObservable<string>;
        values: KnockoutObservableArray<MimeSubSectionViewModel>;
        show: KnockoutObservable<boolean>;
        constructor(mimeSectionData: IMimeSectionData);
    }
    class MimeSubSectionViewModel extends DataLab.Util.Disposable {
        dataType: KnockoutObservable<string>;
        data: KnockoutObservable<string>;
        constructor(mimeSubSectionData: IMimeSubSectionData);
    }
    interface IGenericMimeData {
        sections: IMimeSectionData[];
    }
    interface IMimeSectionData {
        title: string;
        values: IMimeSubSectionData[];
    }
    interface IMimeSubSectionData {
        dataType: string;
        data: string;
    }
}

declare module ExperimentEditor.CustomUX {
    class JSONViewModel extends DataLab.Util.Disposable implements CustomUX.ICustomUXViewModel {
        text: string;
        constructor(jsonData: IJSONData);
    }
    interface IJSONData {
        "object": string;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
/// <reference path="../Visualization/VisualizationViewModel.d.ts" />
declare module ExperimentEditor.CustomUX {
    class LearnerViewModel extends DataLab.Util.Disposable implements CustomUX.ICustomUXViewModel {
        learnerName: KnockoutObservable<string>;
        tables: KnockoutObservableArray<LearnerTableViewModel>;
        constructor(parsedData: ILearnerViewModelData);
        private constructLearnerTableViewModelFromDataTable(table, headerLabel, nameFormatter?, valueFormatter?);
        private constructLearnerTableViewModelFromObject(objectToConstructFrom, header, nameHeader, valueHeader, nameFormatter?, valueFormatter?);
        private isDataTable(table);
        private getLocalizedColumnName(columnName);
        private reducePrecisionWithTypeCheck(value);
    }
    class LearnerTableViewModel extends DataLab.Util.Disposable {
        table: any[][];
        headerLabel: KnockoutObservable<string>;
        columnNames: KnockoutObservableArray<string>;
        constructor(table: any[][], headerLabel: string, columnNames: string[]);
    }
    interface ILearnerViewModelData {
        visualizationType: string;
        learner: ILearnerData;
    }
    interface ILearnerData {
        name: string;
        isTrained: boolean;
        settings?: any;
        weights?: any;
    }
}

declare module ExperimentEditor {
    class PanHelper {
        constructor(containerDiv: HTMLDivElement, mouseEventHandler: (e: MouseEvent) => void);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.Bubble {
    class ViewPort {
        left: KnockoutObservable<number>;
        top: KnockoutObservable<number>;
        width: KnockoutObservable<number>;
        height: KnockoutObservable<number>;
        refreshed: KnockoutSubscribable<ViewPort>;
        refresh(): void;
        static instance: ViewPort;
        static getInstance(): ViewPort;
    }
}

/// <reference path="../../../TypescriptLib/Knockout.d.ts" />
/// <reference path="../../../TypescriptLib/Knockout-extensions.d.ts" />
/// <reference path="../../../../../../External/Typescript/jquery.d.ts" />
/// <reference path="../../../TypescriptLib/d3.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
/// <reference path="../../View/ZoomControl.d.ts" />
/// <reference path="../../View/ZoomHelper.d.ts" />
/// <reference path="../../View/PanHelper.d.ts" />
/// <reference path="../../View/Bubble/ViewPort.d.ts" />
/// <reference path="../../View/CustomBindingHandlers/d3graph.d.ts" />
declare module ExperimentEditor.CustomUX {
    interface ITreeDataProvider {
        getTreeThumbnail(treeIndex: number, treeThumbnailHandler: (str: string) => void): void;
        getRootSubTreeStructure(treeIndex: number, treeStructureHandler: (tree: ITreeStructure) => void): void;
        getSubTreeStructure(treeIndex: number, subtreeRoot: IInteriorNodeIdentifier, treeStructureHandler: (tree: ITreeStructure) => void): void;
        getInteriorNodeStatistics(treeIndex: number, nodeIndex: IInteriorNodeIdentifier, nodeStatisticsHandler: (statistics: IInteriorNodeStatistics) => void): void;
        getLeafNodeStatistics(treeIndex: number, nodeIndex: ILeafNodeIdentifier, nodeStatisticsHandler: (statistics: ILeafNodeStatistics) => void): void;
    }
    interface IInteriorNodeIdentifier {
        offset: number;
    }
    interface ILeafNodeIdentifier {
        offset: number;
    }
    interface INodeIdentifier {
        isLeaf(): boolean;
        getLeaf(): ILeafNodeIdentifier;
        getInterior(): IInteriorNodeIdentifier;
    }
    interface IStatisticsGraph {
        xValues: string[];
        yPredictionValues?: number[];
        yTrainingValues?: number[];
    }
    interface INodeStatistics {
        inner?: any;
        graph?: IStatisticsGraph;
    }
    interface ILeafNodeStatistics extends INodeStatistics {
    }
    interface IInteriorNodeStatistics extends INodeStatistics {
        features: string[];
        predicate: string;
    }
    interface ITreeStructure {
        interiorXs: number[];
        interiorYs: number[];
        leafXs: number[];
        leafYs: number[];
        leftChild: number[];
        rightChild: number[];
        feature: string[];
        predicate: string[];
        interiorWeight?: number[];
        interiorEntropy?: number[];
        leafWeight?: number[];
        leafEntropy?: number[];
        interiorIds: number[];
        leafIds: number[];
    }
    interface IPropertyKeyValuePair {
        label: string;
        value: string;
        tooltip: string;
    }
    interface IValueTooltipPair {
        value: string;
        tooltip: string;
    }
    interface INodeStackDataSeries {
        label: string;
        series: IValueTooltipPair[];
    }
    interface INodeStackInformation {
        leafRows: IPropertyKeyValuePair[];
        leafPreview: IPreview;
        interiorRows: INodeStackDataSeries[];
        interiorPreviews: IPreviewSeries;
    }
    interface INodeProvider {
        getInteriorNodeStatistics(nodeId: IInteriorNodeIdentifier, nodeStatisticsHandler: (statistics: IInteriorNodeStatistics) => void): void;
        getLeafNodeStatistics(nodeId: ILeafNodeIdentifier, nodeStatisticsHandler: (statistics: ILeafNodeStatistics) => void): void;
        getSubtree(subtreeIndex: IInteriorNodeIdentifier, subtreeHandler: (subtree: ITreeStructure) => void): void;
    }
    interface IPreviewValues {
        predict: number;
        train: number;
    }
    interface IPreviewSeriesRow {
        label: string;
        values: IPreviewValues[];
    }
    interface IPreviewSeries {
        columnWidth: number;
        series: IPreviewSeriesRow[];
    }
    interface IPreview {
        columnWidth: number;
        labels: string[];
        trainValues: number[];
        predictValues: number[];
    }
    interface IPoint {
        x: number;
        y: number;
    }
    interface ITreeThumbnailViewModel {
        index: number;
        thumbnailUrl: KnockoutObservable<string>;
        select: (viewModel: ITreeThumbnailViewModel) => void;
    }
    interface ITreeEnsembleLearnerData {
        treeCount: number;
    }
    interface ITreeEnsembleData {
        learner: ITreeEnsembleLearnerData;
        dataProvider: ITreeDataProvider;
    }
    class NodeIdentifier implements INodeIdentifier {
        index: number;
        constructor(index: number);
        static fromLeaf(node: ILeafNodeIdentifier): NodeIdentifier;
        static fromInterior(node: IInteriorNodeIdentifier): NodeIdentifier;
        static interiorRoot(): NodeIdentifier;
        static leafRoot(): NodeIdentifier;
        isLeaf(): boolean;
        getLeaf(): ILeafNodeIdentifier;
        getInterior(): IInteriorNodeIdentifier;
    }
    class TreeNode {
        index: INodeIdentifier;
        x: number;
        y: number;
        r: KnockoutObservable<number>;
        tree: Tree;
        shade: KnockoutObservable<number>;
        highlight: KnockoutObservable<boolean>;
        text: KnockoutObservable<string>;
        select: (element: TreeNode) => void;
        selectText: (element: TreeNode) => void;
        openPreview: (element: TreeNode, event: Event) => void;
        closePreview: () => void;
        clearLabel(): void;
        showFeature(): void;
        showPredicate(): void;
        constructor(index: INodeIdentifier, x: number, y: number, tree: Tree);
    }
    class TreeEdge {
        start: IPoint;
        end: IPoint;
        highlight: KnockoutObservable<boolean>;
        text: KnockoutObservable<string>;
        constructor(start: IPoint, end: IPoint);
    }
    class Tree extends DataLab.Util.Disposable {
        leafNodes: KnockoutObservableArray<TreeNode>;
        interiorNodes: KnockoutObservableArray<TreeNode>;
        leftEdges: KnockoutObservableArray<TreeEdge>;
        rightEdges: KnockoutObservableArray<TreeEdge>;
        nodeStackInformation: KnockoutObservable<INodeStackInformation>;
        nodeStackHeight: KnockoutObservable<string>;
        hoverSummaryRows: KnockoutObservable<IPropertyKeyValuePair[]>;
        preview: KnockoutObservable<IPreview>;
        isLoadingNodes: boolean;
        predicateLabels: string[];
        featureLabels: string[];
        nodeProvider: INodeProvider;
        desiredOffset: {
            top: number;
            left: number;
        };
        private captionMode;
        private interiorWeights;
        private leafWeights;
        private interiorEntropy;
        private leafEntropy;
        private zoomControl;
        private zoomHelper;
        private coordinateHelper;
        private buttonDragMode;
        private spaceDragMode;
        private leftChild;
        private rightChild;
        private leafNodeToParentNode;
        private interiorNodeToParentNode;
        private previouslyHighlighted;
        private draggable;
        private serverInteriorIds;
        private serverLeafIds;
        private nodeToParentMap(nodeIndex);
        private updateTreeViewHeight();
        private isRoot(node);
        private updateTreeViewWidth();
        private viewCenter;
        private updateTreeViewLayout();
        private getViewDimensions();
        private setPanning(panning);
        private togglePanning();
        private updateCaptions();
        loadSubtree(nodeIndex: IInteriorNodeIdentifier): void;
        initialize(): void;
        private assignParentNodes(parentToChild, leafNodeToParentNode, interiorNodeToParentNode);
        private setupNodeToParentMap(leftChild, rightChild);
        private nodePairToEdgeWithCollection(childNodeIndex, parentNodeIndex);
        private nodePairToEdge(childNodeIndex, parentNodeIndex);
        private addNodes(startOffset, nodeXs, nodeYs, nodes, mapOffsetToIdentifier);
        private createEdgeFromNodeSplit(nodeId, splitArray);
        private addEdges(startIndex, endIndex, splitArray, edges);
        private setHighlightInteriorNode(node, highlight);
        private setHighlightLeafNode(node, highlight);
        private setHighlightEdge(childNode, parentNode, highlight);
        private setHighlightNodesUpToRoot(nodeIndex, highlight);
        private switchHighlightingToNodeToRoot(nodeOffset);
        clearSelection(): void;
        private handleNodeStatistics(statistics, statisticHandler);
        private addGraphToPreviewSeries(preview, graph, length);
        private createPropertyValuePair(label, value);
        private populateStatistics(nodesToGet, propertyMap, nodeStackInfo, propertyMapLength);
        selectNode(nodeIndex: INodeIdentifier): void;
        isNodeLoaded(node: INodeIdentifier): boolean;
        private graphToPreview(graph);
        hoverNode(index: INodeIdentifier, onShowSummary: () => void): void;
        replaceNodeWithTree(node: IInteriorNodeIdentifier, subtree: ITreeStructure): void;
        rebalanceWeights(): void;
        rebalanceEntropies(): void;
        rebalanceValues(interiorValues: number[], leafValues: number[], interiorNodes: KnockoutObservableArray<TreeNode>, leafNodes: KnockoutObservableArray<TreeNode>, setValueOnNode: (node: TreeNode, value: number) => void): void;
        constructor(tree: ITreeStructure, provider: INodeProvider);
    }
    class TreeEnsembleViewModel extends DataLab.Util.Disposable implements CustomUX.ICustomUXViewModel {
        treeThumbnailUrls: KnockoutObservableArray<ITreeThumbnailViewModel>;
        tree: KnockoutObservable<Tree>;
        treeCount: number;
        dataProvider: ITreeDataProvider;
        showLoadMore: KnockoutObservable<boolean>;
        resizeHandler: (event: JQueryEventObject) => void;
        loadMore: (vm: TreeEnsembleViewModel) => void;
        onScroll: (vm: TreeEnsembleViewModel) => void;
        private unloadedTreesRemaining();
        private isAlmostScrolledToBottom();
        dispose(): void;
        private loadTrees(startIndex, endIndex);
        initialize(): void;
        constructor(data: ITreeEnsembleData);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../ExperimentEditor/CustomUX.d.ts" />
/// <reference path="Constants.d.ts" />
/// <reference path="../../View/CustomBindingHandlers/D3Graphing/D3Common.d.ts" />
declare module ExperimentEditor.CustomUX {
    class ClusteringViewModel extends DataLab.Util.Disposable implements CustomUX.ICustomUXViewModel {
        clusterViewModels: KnockoutObservableArray<ClusterViewModel>;
        private xScale;
        private yScale;
        width: number;
        height: number;
        padding: number;
        constructor(clusteringData: IClusteringData);
        drawAxes(): void;
        private computeScales(clusters);
    }
    class ClusterViewModel {
        label: KnockoutObservable<string>;
        color: KnockoutObservable<string>;
        centroidX: KnockoutObservable<number>;
        centroidY: KnockoutObservable<number>;
        majorAxisLength: KnockoutComputed<number>;
        minorAxisLength: KnockoutComputed<number>;
        ellipseRotation: KnockoutComputed<string>;
        private majorAxisX;
        private majorAxisY;
        private minorAxisX;
        private minorAxisY;
        private unscaledCentroidX;
        private unscaledCentroidY;
        private angleOfRotation;
        constructor(cluster: ICluster, xScale: (number) => number, yScale: (number) => number);
        private computeDistance(propertyPrefix, xScale, yScale);
    }
    interface IClusteringData {
        visualizationType: string;
        clusters: ICluster[];
    }
    interface ICluster {
        label: number;
        centroidX: number;
        centroidY: number;
        majorAxisX: number;
        majorAxisY: number;
        minorAxisX: number;
        minorAxisY: number;
        angleOfRotation: number;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../Visualization/VisualizationViewModel.d.ts" />
/// <reference path="BinaryClassificationUX.d.ts" />
/// <reference path="BinaryClassificationComparisonUX.d.ts" />
/// <reference path="MulticlassClassificationUX.d.ts" />
/// <reference path="ROutputViewModel.d.ts" />
/// <reference path="GenericMimeViewModel.d.ts" />
/// <reference path="JSONViewModel.d.ts" />
/// <reference path="LearnerViewModel.d.ts" />
/// <reference path="TreeEnsembleViewModel.d.ts" />
/// <reference path="ClusteringViewModel.d.ts" />
declare module ExperimentEditor.Visualization {
    interface ViewModelWithMarkup {
        viewModel: ExperimentEditor.CustomUX.ICustomUXViewModel;
        markup: string;
    }
    class VisualizationViewModelFactory {
        constructor();
        createViewModelWithMarkup(visualizationData: any, portModel: DataLab.Model.Port, workspace: DataLab.Model.Workspace): ViewModelWithMarkup;
    }
}

/// <reference path="../ViewModel/ExperimentEditor/Entity.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/Module.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/CustomUX.d.ts" />
/// <reference path="../ViewModel/CustomUX/VisualizationViewModelFactory.d.ts" />
declare module ExperimentEditor {
    class EndpointDownloader {
        endpointTooBig: KnockoutSubscribable<{}>;
        download(endpoint: DataLab.DataContract.IEndpoint): void;
        visualize(portModel: DataLab.Model.Port, workspace: DataLab.Model.Workspace, isModule: boolean): void;
    }
}

/// <reference path="../Global.d.ts" />

/// <reference path="../Global.d.ts" />
/// <reference path="../Common/DialogInterfaces.d.ts" />
declare module ExperimentEditor {
    class AzureFxDialogHost implements IDialogHost {
        dialogDismissedEvent: KnockoutSubscribable<IDialogResult>;
        private activeDialog;
        private activeDialogElement;
        isActiveDialog(dialog: IDialog): boolean;
        closeActiveDialog(): void;
        showNewDialog(dialog: IDialog): HTMLElement;
        private onDialogDismissed(dialog, accepted);
        private assertDialogIsActive();
    }
}

/// <reference path="../Global.d.ts" />
declare module ExperimentEditor.ShellControls {
    function initChatControl(): void;
    class ChatViewModel {
        showChatButton: KnockoutObservable<boolean>;
        constructor();
        toggle(): void;
    }
}

/// <reference path="../Global.d.ts" />
declare module ExperimentEditor {
    interface CredentialGridDataItem {
        type: string;
        credential: string;
        keyParts: DataLab.DataContract.ICredentialKeyParts;
    }
    class CredentialsPivot {
        private grid;
        data: CredentialGridDataItem[];
        private renderArea;
        private removeCommand;
        private client;
        constructor(client: DataLab.DataContract.Client, renderArea: JQuery);
        setRemoveCommand(removeCommand: any): void;
        keypartsToString(keyParts: DataLab.DataContract.ICredentialKeyParts): string;
        refreshFromService(): void;
        removeCredentials(): void;
        private doRemoveCredentials();
    }
}

/// <reference path="../Global.d.ts" />
declare module ExperimentEditor {
    interface DataImportGridDataItem {
        id: string;
        name: string;
        description: string;
        status: string;
    }
    class DataImportsPivot {
        private grid;
        data: DataImportGridDataItem[];
        private renderArea;
        private removeCommand;
        private client;
        constructor(client: DataLab.DataContract.Client, renderArea: JQuery);
        setRemoveCommand(removeCommand: any): void;
        refreshFromService(): void;
        removeDataImports(): void;
        private doRemoveDataImports();
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../../DataLabViews/ExperimentView.d.ts" />
declare module ExperimentEditor.Feedback {
    class FeedbackControlViewModel extends DataLab.Util.Disposable {
        MAX_LENGTH: number;
        isExpanded: KnockoutObservable<boolean>;
        isHappy: KnockoutObservable<boolean>;
        private isSending;
        question: KnockoutObservable<string>;
        feedbackText: KnockoutObservable<string>;
        remainingLength: KnockoutObservable<number>;
        remainingLengthText: KnockoutObservable<string>;
        expand: () => void;
        collapse: () => void;
        smileyHappySelected: () => void;
        smileySadSelected: () => void;
        sendFeedback: () => void;
        constructor();
    }
}

/// <reference path="../Global.d.ts" />
/// <reference path="../ViewModel/ExperimentEditor/FeedbackControlViewModel.d.ts" />
declare module ExperimentEditor.ShellControls {
    function initFeedbackControl(): void;
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/OnlineSearch.d.ts" />
declare module ExperimentEditor.SSIMSearch {
    module Constants {
        var resultsPerPage: number;
        var maxLengthOfDatasetName: number;
        var pageBatchSize: number;
        var maxDescription: number;
    }
    class SearchResultViewModel {
        resultTitle: string;
        resultDescription: string;
        shortDescription: string;
        resultPreviewUrl: string;
        resultDataUrl: string;
        resultDataType: string;
        resultDataProtocol: string;
        resultDataAuthentication: string;
        iconUrl: string;
        iconVisible: boolean;
        hovered: KnockoutObservable<boolean>;
        constructor(searchResult: DataLab.OnlineSearch.ISsimSearchResult);
    }
    class SearchResultsPage {
        pageId: number;
        selected: KnockoutObservable<boolean>;
        constructor(pageId: number, selected: boolean, currentPage: KnockoutObservable<number>);
    }
    var windowHeight: KnockoutObservable<number>;
    class SearchTabViewModel {
        searchResults: KnockoutObservableArray<SearchResultViewModel>;
        hoveredItem: KnockoutObservable<SearchResultViewModel>;
        private client;
        private selectedPreviewAddress;
        private searchQuery;
        private datalabPreviewUrl;
        private hideSpinner;
        private searchBoxFocus;
        private parent;
        private previewTitle;
        private previewDescription;
        private noResultsFound;
        private searchResultCount;
        private headerText;
        private currentQuery;
        private searchResultPages;
        private currentPage;
        private pageCount;
        private previousEnabled;
        private nextEnabled;
        private windowHeight;
        private activeQuery;
        private activePage;
        private searchActive;
        private previewLoadActive;
        private spinnerActive;
        constructor(client: DataLab.DataContract.Client, parent: SearchView);
        refresh(client: DataLab.DataContract.Client, searchView: SearchView): void;
        private selectItem(item);
        private selectPreview(item);
        private doSearch(query, page, createPages);
        private search();
        private doSwitchPage(page);
        private center(target);
        private switchPage(page);
        private prevPage();
        private nextPage();
        private handleKeypress(data, key);
        private iframeLoad(data, event);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/OnlineSearch.d.ts" />
/// <reference path="SearchViewModels.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
declare module ExperimentEditor.SSIMSearch {
    class SaveDatasetViewModel implements ExperimentEditor.IDialogViewModel {
        dataUrl: string;
        dataset: DataLab.Model.UnsavedResource;
        private nameFocus;
        private selectedItem;
        private workspace;
        private client;
        private activeNotifications;
        constructor(selectedItem: SearchResultViewModel, workspace: DataLab.Model.Workspace, client: DataLab.DataContract.Client, activeNotifications: any[]);
        dismissed(result: IDialogResult): void;
        canBeAccepted(): boolean;
        private saveData();
    }
}

/// <reference path="../Global.d.ts" />
/// <reference path="../ViewModel/SSIMSearch/SaveSSIMDataDialog.d.ts" />
/// <reference path="../ViewModel/SSIMSearch/SearchViewModels.d.ts" />
/// <reference path="DialogViewFactories.d.ts" />
declare module ExperimentEditor.SSIMSearch {
    class SearchView {
        private viewModel;
        private client;
        private workspace;
        private activeNotifications;
        private removeNotifications();
        launchSaveDatasetDialog(): void;
        constructor(renderArea: JQuery, client: DataLab.DataContract.Client, workspace: DataLab.Model.Workspace);
    }
}

/// <reference path="../Global.d.ts" />
declare module ExperimentEditor {
    class PublishModelPackageDialogViewModel {
        packageName: KnockoutObservable<string>;
        error: boolean;
        constructor(description: string, error: boolean);
    }
}

/// <reference path="../Global.d.ts" />
interface cdm {
    setActiveItem: any;
}
declare module ExperimentEditor {
    module Constants.UsersPivot {
        var inviteText: string;
        var reinviteText: string;
        var title: string;
        var userRoleDescription: string;
        var ownerRoleDescription: string;
        var invalidRowMarkupTemplate: string;
        var userActiveText: string;
        var userInvitedText: string;
        var inviteDialogSize: number[];
    }
    class InvitationDialogViewModel {
        role: KnockoutObservable<string>;
        roleDescription: KnockoutComputed<string>;
        instructions: string;
        error: boolean;
        pressHandler: (data: any, key: any) => void;
        dropHandler: () => void;
    }
    enum EntityType {
        User = 0,
        Invitation = 1,
    }
    interface GridDataItem {
        entityType: EntityType;
        id: string;
        name: string;
        email: string;
        role: string;
        status: string;
    }
    class UsersPivot {
        private client;
        private grid;
        private renderArea;
        private data;
        private removeCommand;
        private role;
        private viewModel;
        constructor(client: DataLab.DataContract.Client, renderArea: JQuery);
        private ownersCount;
        refreshFromService(): void;
        private removeEntity(item);
        removeUsers(): void;
        doRemoveUsers(usersToRemove: any[]): void;
        launchInvitationDialog(htmlText: string): void;
        sendInvitations(inviteString: string): void;
        setRemoveCommand(removeCommand: any): void;
        private addFailNotification(message);
    }
}

/// <reference path="../Global.d.ts" />
declare module ExperimentEditor.ShellControls {
    module Constants.WorkspacesBar {
        var workspaceManagerClass: string;
        var menuHeaderItemClass: string;
        var menuItemClass: string;
        var fxsSelectedItemClass: string;
        var maxTopPosition: number;
        var animationDuration: number;
    }
    module WorkspacesBar {
        var settingsNameFocusOnNameBox: boolean;
    }
    function createWorkspacesBar(client: DataLab.DataContract.Client, isOwner: boolean): void;
    function updateBar(settings: DataLab.Model.WorkspaceSettings): void;
}

/// <reference path="../Global.d.ts" />
/// <reference path="WorkspacesBar.d.ts" />
declare module ExperimentEditor {
    class WorkspaceSettings extends DataLab.Util.Disposable {
        private client;
        private workspace;
        private renderArea;
        workspaceSettings: KnockoutObservable<DataLab.Model.WorkspaceSettings>;
        hasBeenEdited: KnockoutObservable<boolean>;
        isReadOnly: boolean;
        workspaceTypeText: KnockoutObservable<string>;
        spaceQuota: KnockoutObservable<IUsageBarOptions>;
        spaceQuotaNote: string;
        accountInfo: {
            label: string;
            value: string;
        }[];
        constructor(client: DataLab.DataContract.Client, workspace: DataLab.Model.Workspace, renderArea: JQuery, readOnly?: boolean);
        refreshFromService(): void;
        settingsUpdated(): void;
        private showConfirmation(isPrimary);
        private update();
        private regenerateAuthorizationToken(isPrimary);
        private discard();
        private errorNotificationProgress(title);
        private getTextForWorkspaceType(type);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.Bubble {
    interface IUserSettings {
        shouldShowBubble(bubbleId: string): boolean;
        neverShowAgain(bubbleId: string): any;
        resetAll(): any;
    }
    class LocalStorageUserSettings implements IUserSettings {
        private static storageNamespace;
        shouldShowBubble(bubbleId: string): boolean;
        neverShowAgain(bubbleId: string): void;
        resetAll(): void;
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.Bubble {
    enum ArrowDirection {
        None = 0,
        Up = 1,
        Down = 2,
        Left = 3,
        Right = 4,
    }
    enum ArrowAlignment {
        Left = 0,
        Right = 1,
        Center = 2,
        Top = 3,
        Bottom = 4,
    }
    class Position {
        x: KnockoutObservable<number>;
        y: KnockoutObservable<number>;
        arrowAlignment: KnockoutObservable<ArrowAlignment>;
        arrowDirection: KnockoutObservable<ArrowDirection>;
        constructor(x?: number, y?: number, arrowDirection?: ArrowDirection, arrowAlignment?: ArrowAlignment);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.Bubble {
    interface IPositionLocator {
        getPosition(): Position;
    }
    class FixedPositionLocator implements IPositionLocator {
        position: Position;
        constructor(position: Position);
        getPosition(): Position;
    }
    class RectPositionLocator implements IPositionLocator {
        getRect: () => ClientRect;
        private viewPort;
        constructor(getRect: () => ClientRect, viewPort?: ViewPort);
        static getPositionFromRectAndViewPort(rect: ClientRect, viewPort: ViewPort, alignmentThrottle?: number): Position;
        getPosition(): Position;
    }
    class HtmlElementPositionLocator extends RectPositionLocator {
        constructor(selector: () => HTMLElement);
    }
    class JQuerySelectorPositionLocator extends HtmlElementPositionLocator {
        constructor(selector: () => JQuery);
    }
    class MultiJQuerySelectorPositionLocator extends RectPositionLocator {
        constructor(selector: any);
        private static computeBoundingBox(locators);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.Bubble {
    class Step {
        title: KnockoutObservable<string>;
        content: KnockoutObservable<string>;
        beforeLoadHandlerAsync: (bubbleViewModel: BubbleViewModel) => DataLab.Util.Promise<any>;
        loadHandlerAsync: (bubbleViewModel: BubbleViewModel) => DataLab.Util.Promise<any>;
        nextHandlerAsync: (bubbleViewModel: BubbleViewModel) => DataLab.Util.Promise<any>;
        backHandlerAsync: (bubbleViewModel: BubbleViewModel) => DataLab.Util.Promise<any>;
        position: () => Position;
        width: KnockoutObservable<number>;
        height: KnockoutObservable<number>;
        highlight: () => ClientRect;
        constructor(title: string, content: string, locator?: IPositionLocator, highlight?: () => ClientRect, width?: number, height?: number);
        private static voidPromise(bubbleViewModel);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.Bubble {
    class BubbleViewModel {
        steps: KnockoutObservableArray<Step>;
        current: KnockoutObservable<Step>;
        currentIndex: KnockoutObservable<number>;
        totalSteps: KnockoutComputed<number>;
        visible: KnockoutObservable<boolean>;
        overlayVisible: KnockoutObservable<boolean>;
        hasNext: KnockoutComputed<boolean>;
        hasBack: KnockoutComputed<boolean>;
        arrowClassId: KnockoutComputed<string>;
        arrowX: KnockoutComputed<number>;
        arrowY: KnockoutComputed<number>;
        bubbleX: KnockoutComputed<number>;
        bubbleY: KnockoutComputed<number>;
        width: KnockoutComputed<number>;
        height: KnockoutComputed<number>;
        title: KnockoutComputed<string>;
        content: KnockoutComputed<string>;
        hightlightRect: KnockoutComputed<ClientRect>;
        userSettings: IUserSettings;
        id: string;
        dismissOnScroll: boolean;
        dismissOnResize: boolean;
        dismissOnClick: boolean;
        showOverlay: KnockoutObservable<boolean>;
        constructor();
        addStep(step: Step): void;
        setCurrentAsync(index: number): DataLab.Util.Promise<number>;
        close(): void;
        dismiss(neverShowAgain?: boolean): void;
        show(): void;
        nextAsync(): DataLab.Util.Promise<number>;
        backAsync(): DataLab.Util.Promise<number>;
        gotoAsync(index: number): DataLab.Util.Promise<number>;
        copyFromAsync(options: Options): DataLab.Util.Promise<number>;
        onResize(): void;
        onScroll(): void;
        onClick(e: MouseEvent): void;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="UserSettings.d.ts" />
/// <reference path="ViewPort.d.ts" />
/// <reference path="Position.d.ts" />
/// <reference path="PositionLocators.d.ts" />
/// <reference path="Step.d.ts" />
/// <reference path="BubbleViewModel.d.ts" />
declare module ExperimentEditor.Bubble {
    class Options {
        dismissOnScroll: boolean;
        dismissOnResize: boolean;
        dismissOnClick: boolean;
        steps: Step[];
        start: number;
        id: string;
        userSettings: IUserSettings;
        alwaysShow: boolean;
        showOverlay: boolean;
        autoDismiss: boolean;
        autoDismissDelayMS: number;
        constructor(id: string);
        addStepByPosition(x: number, y: number, title: string, content: string, width?: number, height?: number): Step;
        addStepByJquerySelector(selector: any, title: string, content: string, width?: number, height?: number): Step;
        addStepByGraphNode(node: DataLab.Model.GraphNode, title: string, content: string): Step;
        addStepAtCenter(title: string, content: string, width?: number, height?: number): Step;
    }
    function showAsync(options: Options): DataLab.Util.Promise<BubbleViewModel>;
    function dismiss(): void;
    function getBubbleContainer(): HTMLElement;
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../ViewModel/ExperimentEditor/ColumnPickerViewModel.d.ts" />
declare module ExperimentEditor {
    interface IAutocompleteItem {
        label: string;
        value: string;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../Balloon.d.ts" />
declare module ExperimentEditor {
    interface IBalloonOptions {
        message: any;
        forceBalloon?: KnockoutSubscribable<boolean>;
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.CheckboxBindings {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../Common/MouseCapture.d.ts" />
declare module ExperimentEditor.CollapseResize {
    class CollapseResizeManager extends DataLab.Util.Disposable {
        private collapsed;
        private containerElement;
        private collapseElement;
        private minSize;
        private maxSize;
        private collapsedSize;
        private resizeDirection;
        private resizeDimension;
        private expandedSize;
        private lastExpandStateWasCollapsed;
        private mouseDimension;
        private openCloseAnimationEnded;
        private resizeIsInitialized;
        private collapseIsInitialized;
        private jQueryCollapseIsInitialized;
        id: string;
        direction: string;
        private static sessionStorage;
        /**
          * Manages state and interaction between collapse, jQueryCollapse, and resize bindings. Can be set up for
          * the following modes: collapse, collapse + resize, resize, jQueryCollapse, jQueryCollapse + resize.
          * @param {HTMLElement} containerElement the drawer element. This is the elememnt whose dimensions change on resize, collapse, etc.
          * @param {string} direction where the drawer will resize/collapse from
         **/
        constructor(containerElement: HTMLElement, direction: string, id: string);
        /**
          * Used by the resize binding. Initialize the manager for resizing.
          * @param {number} minSize the minimum size of the drawer in pixels
          * @param {number} maxSize the maximum size of the drawer in pixels
         **/
        initForResize(minSize: number, maxSize: number): void;
        /**
          * Used by the Collapse binding. Initializes the manager for handling collapsing/expanding drawers.
          * @param {KnockoutObservable<boolean>} collapsed an observable indicating whether the collapsing thing is expanded or collapsed
          * @param {number} collapsedSize the minimized size of the drawer.
          * @param {KnockoutSubscribable?} openCloseAnimationEnded an optional subscribable that gets notifications when the drawer opens or closes.
         **/
        initForCollapse(collapsed: KnockoutObservable<boolean>, collapsedSize: number, openCloseAnimationEnded?: KnockoutSubscribable<string>): void;
        /**
          * Used by the jQueryCollapse binding. Initialize the manager to perform jQuery's slideToggle.
          * Note this implementation can go between size auto and 0 correctly, but can't use any other minimum size and can't be interrupted.
          * @param {KnockoutObservable<boolean>} collpased an observable indicating whether the drawer is in the collapsed state or not.
          * @param {KnockoutSubscribable} openCloseAnimationEnded? an optional subscribable that gets notified when the drawer fully opens or closes
         **/
        initForJQueryCollapse(collapsed: KnockoutObservable<boolean>, contentSelector?: string, openCloseAnimationEnded?: KnockoutSubscribable<string>): void;
        /**
          * Try to resize the box, contingent on size being between the maximum and minimum allowed size
          * @param {number} size how big do you want the box to be
         **/
        resize(size: number): void;
        updateJQueryCollapsedState(): void;
        updateCollapsedState(): void;
        private resizeState;
        private collapseState;
        private setDrawerClass(className);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="CollapseResizeManager.d.ts" />
declare module ExperimentEditor.CollapseResize {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../ViewModel/ExperimentEditor/ColumnPickerViewModel.d.ts" />
declare module ExperimentEditor.ColumnPicker {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../MenuControl.d.ts" />
declare module ExperimentEditor {
    interface ISubmenuContext {
        activate: boolean;
        width: number;
        height: number;
        menuSelector: string;
        options: JQueryPosition;
    }
    interface IMenuPositionContext {
        width: number;
        height: number;
        options: JQueryPosition;
    }
    function ContextMenuEventHandler(e: MouseEvent, target: any, menuBuilder: IMenuBuilder): boolean;
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../MenuControl.d.ts" />
declare module ExperimentEditor.DropMenu {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    interface IEditableTextAreaOptions {
        expandOnFocus: boolean;
        maxCharacters: number;
        showMaxCharacterWarning: boolean;
        placeholderText: string;
        isReadOnly: boolean;
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.FadeVisible {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.ColumnPicker {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="CollapseResizeManager.d.ts" />
declare module ExperimentEditor.CollapseResize {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../ViewModel/ExperimentEditor/CustomUX.d.ts" />
/// <reference path="../../../TypescriptLib/jqueryui.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../Common/MouseCapture.d.ts" />
/// <reference path="CollapseResizeManager.d.ts" />
declare module ExperimentEditor.CollapseResize {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../ViewModel/ExperimentEditor/CustomUX.d.ts" />
/// <reference path="../../../TypescriptLib/jqueryui.d.ts" />
declare module ExperimentEditor.CustomUX {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    interface IUsageBarOptions {
        used: number;
        total: number;
        usedLabel: string;
        totalLabel: string;
        unitLabel: string;
        unitLabelLong: string;
        overCapacityLabel?: string;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Balloon.d.ts" />
declare module ExperimentEditor.ValidateBindings {
    interface IValidateBindingOptions {
        value: DataLab.Validation.IValidatableObservable;
        forceBalloon?: KnockoutObservable<boolean>;
        disabled?: KnockoutObservable<boolean>;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="Validate.d.ts" />
declare module ExperimentEditor.ValidateBindings {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="d3graph.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
declare module ExperimentEditor {
    class ApiCodeDialogViewModel implements IDialogViewModel {
        language: KnockoutObservable<string>;
        useSecondaryToken: KnockoutObservable<boolean>;
        showLongCode: boolean;
        showPreviewTag: boolean;
        showExtraHelp: boolean;
        private targetObject;
        private workspaceId;
        private workspaceToken;
        languages: string[];
        private workspaceTokenToUse;
        private datasetName;
        private longCodeTemplates_DataOutputPort;
        private longCodeTemplates_InterOutputPort;
        longCode: KnockoutComputed<string>;
        constructor(targetObject: any, workspaceId: string, workspaceToken: DataLab.Model.AuthorizationToken);
        canBeAccepted(): boolean;
        dismissed(result: IDialogResult): void;
        showDialog(): DataLab.Util.Promise<IDialogResult>;
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    class UserWorkspacesHelper {
        private static userWorkspacesPromise;
        static getUserWorkspaces(): DataLab.Util.Promise<DataLab.DataContract.v1.IWorkspaceSettings[]>;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
/// <reference path="../ExperimentEditor/UserWorkspaceHelpers.d.ts" />
declare module ExperimentEditor {
    class CopyExperimentDialogViewModel implements IDialogViewModel {
        experimentName: DataLab.Validation.IValidatableObservable;
        experimentId: string;
        workspaces: KnockoutObservableArray<DataLab.DataContract.v1.IWorkspaceSettings>;
        destinationWorkspace: KnockoutObservable<DataLab.DataContract.v1.IWorkspaceSettings>;
        private validatedFields;
        workspaceInfoAvailable: KnockoutComputed<boolean>;
        constructor(experimentName: string, experimentId: string);
        dismissed(result: IDialogResult): void;
        canBeAccepted(): boolean;
        private pollOnPackage(experimentPackage, progress);
        private pollOnPackageHandler(experimentPackage, retryCount, resultPromise, progress);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
/// <reference path="../ExperimentEditor/UserWorkspaceHelpers.d.ts" />
declare module ExperimentEditor {
    class WorkspaceWithDisplayName {
        workspace: DataLab.DataContract.v1.IWorkspaceSettings;
        displayName: string;
        constructor(workspace: DataLab.DataContract.v1.IWorkspaceSettings, displayName?: string);
    }
    class CopyExperimentFromGalleryDialogViewModel implements IDialogViewModel {
        packageUri: string;
        communityUri: string;
        workspaces: KnockoutObservableArray<WorkspaceWithDisplayName>;
        destinationWorkspace: KnockoutObservable<WorkspaceWithDisplayName>;
        workspaceInfoAvailable: KnockoutComputed<boolean>;
        constructor(packageUri: string, communityUri: string, destinationWorkspace?: KnockoutObservable<DataLab.DataContract.v1.IWorkspaceSettings>);
        dismissed(result: IDialogResult): void;
        static copyExperiment(packageUri: string, communityUri: string, destinationWorkspace?: {
            WorkspaceId: string;
            FriendlyName: string;
        }): promise<any>;
        canBeAccepted(): boolean;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
declare module ExperimentEditor {
    class CreateWebServiceFromTransformDialogViewModel implements IDialogViewModel {
        name: KnockoutObservable<string>;
        description: KnockoutObservable<string>;
        private handler;
        constructor(name: string, handler: (name: string, description: string) => void);
        canBeAccepted(): boolean;
        dismissed(result: IDialogResult): void;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
/// <reference path="../ExperimentEditor/PortViewModel.d.ts" />
declare module ExperimentEditor {
    class UploadDatasetDialogViewModel implements IDialogViewModel {
        dataset: DataLab.Model.UnsavedResource;
        fileToUpload: DataLab.Validation.IValidatableObservable;
        dataTypes: DataLab.Model.DataType[];
        /** Fired if the user initiates dataset upload (by accepting the dialog).
            The event value is a DataLab.Util.IProgressPromise representing the in-progress upload.
            The promise generates progress events for the upload. */
        datasetUploadStartedEvent: KnockoutSubscribable<promise<DataLab.Model.Dataset>>;
        private workspace;
        private validatedFields;
        constructor(workspace: DataLab.Model.Workspace);
        getDataTypeCaption(datatype: DataLab.Model.DataType): string;
        dismissed(result: IDialogResult): void;
        canBeAccepted(): boolean;
        private upload();
        private selectDataTypeForFileName(fileName);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/DialogView.d.ts" />
/// <reference path="../ExperimentEditor/PortViewModel.d.ts" />
declare module ExperimentEditor {
    class UploadModuleDialogViewModel implements IDialogViewModel {
        zipFile: DataLab.Model.UnsavedResource;
        fileToUpload: DataLab.Validation.IValidatableObservable;
        /** Fired if the user initiates zip package upload (by accepting the dialog).
            The event value is a DataLab.Util.IProgressPromise representing the in-progress upload.
            The promise generates progress events for the upload. */
        modulePackageUploadStartedEvent: KnockoutSubscribable<promise<string[]>>;
        private workspace;
        private validatedFields;
        constructor(workspace: DataLab.Model.Workspace);
        getDataTypeCaption(datatype: DataLab.Model.DataType): string;
        dismissed(result: IDialogResult): void;
        canBeAccepted(): boolean;
        private upload();
        private selectDataTypeForFileName(fileName);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.NewDrawerMenu {
    class NewDatasetMenuViewModel extends DataLab.Util.Disposable {
        detailMessage: KnockoutObservable<string>;
        constructor();
    }
    function NewDatasetMenuInitialize(): void;
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.NewDrawerMenu {
    function NewDrawerMenuDestroy(): void;
    function openSampleAsCopy(experimentId: string, description: string, runAfterCopy?: () => void): void;
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.Community {
    var activityServiceUrl: string;
    class UserActivityClient {
        private activityServiceUrl;
        constructor(activityServiceUrl: any);
        view(entityId: string, userId: string, context: string): void;
        download(entityId: string, userId: string, context: string): void;
        publish(entityId: string, userId: string, context: string): void;
        comment(entityId: string, userId: string, context: string): void;
        open(entityId: string, userId: string, context: string): void;
        clone(entityId: string, userId: string, context: string): void;
        share(entityId: string, userId: string, context: string): void;
        private postActivity(entityId, userId, context, activityType);
    }
    function getEntityIdFromCommunityUri(communityUri: string): string;
    function copyCommunityExperimentToThisWorkspaceAndNavigateToExperiment(packageUri: string, communityUri: string, templateEntityId?: string): DataLab.Util.Promise<void>;
    function copyCommunityExperimentToWorkspaceAndNavigateToExperiment(workspaceOrWorkspaceId: any, workspaceFriendlyName: string, packageUri: string, communityUri: string, templateEntityId?: string): promise<any>;
    function copyCommunityExperiment(workspaceOrWorkspaceId: any, workspaceFriendlyName: string, packageUri: string, communityUri: string, templateEntityId?: string): DataLab.Util.Promise<DataLab.DataContract.v1.IExperimentSubmissionResult>;
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../ExperimentEditor/CommunityHelpers.d.ts" />
declare module ExperimentEditor.NewDrawerMenu {
    class CatalogQueryResult {
        total_count: string;
        value: CatalogExperiment[];
        constructor(count: string, val: CatalogExperiment[]);
    }
    class CatalogExperiment {
        node_count: number;
        entity_type: string;
        name: string;
        summary: string;
        description: string;
        tags: Array<string>;
        community_id: string;
        content: Content;
        tenant_id: string;
        id: string;
        author: Author;
        updated_at: string;
        image_url: string;
        rating: number;
        comment_count: number;
        algorithms: Array<string>;
        view_count: number;
        download_count: number;
        static numberedSampleRegEx: RegExp;
        static CatalogExperimentSampleSortFunction(left: CatalogExperiment, right: CatalogExperiment): number;
    }
    class Author {
        avatar_url: string;
        id: string;
        name: string;
    }
    class Content {
        package_link: string;
        service_type: string;
    }
    var galleryBaseUrl: string;
    var catalogSearchBaseUri: string;
    var catalogQueryBaseUri: string;
    var msftAuthorId: string;
    class NewExperimentMenuFromCatalogUtil {
        static newExperimentMenuSamplesCache: CatalogQueryResult;
        private static galleryTopNSamplesFilterTemplate(allSamples?);
        private static galleryTopNFilterTemplate;
        private static searchFilterTemplate;
        private static queryCatalog(uri, filter?);
        static getTopSamples(numberSamples?: number): DataLab.Util.Promise<CatalogQueryResult>;
        static getTopExperiments(numberExperiments: number): DataLab.Util.Promise<CatalogQueryResult>;
        static searchCatalog(searchTerm: string, numberExperiments: number): DataLab.Util.Promise<CatalogQueryResult>;
        static sortSamplesResult(samplesResult: CatalogQueryResult, catalogExperimentSortMethod: (left: CatalogExperiment, right: CatalogExperiment) => number): CatalogQueryResult;
    }
    class ExperimentCardViewModel {
        isBlank: boolean;
        isTourExperiment: boolean;
        id: string;
        title: string;
        description: string;
        summary: string;
        authorName: string;
        authorAvatarUrl: KnockoutObservable<string>;
        authorId: string;
        updateDate: string;
        imgUrl: string;
        entityId: string;
        detailsUrl: string;
        tags: Array<string>;
        rating: number;
        commentCount: number;
        algorithms: Array<string>;
        algorithmList: string;
        viewCount: number;
        downloadCount: number;
        isMsft: boolean;
        daysAgoText: string;
        packageUri: string;
        overlayIsActive: KnockoutObservable<boolean>;
        activateOverlay: () => void;
        deactivateOverlay: () => void;
        viewInGalleryLink: string;
        isVisible: KnockoutComputed<boolean>;
        constructor(isBlank: boolean, isTourExperiment: boolean, id: string, searchString: KnockoutObservable<string>, catalogItem?: CatalogExperiment);
    }
    class NewExperimentCatalogMenuViewModel extends DataLab.Util.Disposable {
        sampleExperiments: KnockoutComputed<ExperimentCardViewModel[]>;
        tourExperimentTemplate: KnockoutObservable<NewExperimentTemplate>;
        loading: KnockoutObservable<boolean>;
        samplesQueryResults: KnockoutObservable<CatalogQueryResult>;
        searchResults: KnockoutObservableArray<ExperimentCardViewModel>;
        onExperimentSelected: (any) => void;
        searchTextInstantValue: KnockoutObservable<string>;
        searchTextDelayedValue: KnockoutObservable<string>;
        viewMoreSamplesLink: string;
        viewMoreSamplesMargin: KnockoutObservable<string>;
        setViewMoreLabelMargin: () => void;
        private generateCardList;
        constructor();
    }
    function NewExperimentCatalogMenuInitialize(): void;
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.NewDrawerMenu {
    class NewExperimentTemplate {
        experimentId: string;
        description: string;
        title: string;
        experimentIcon: string;
        isGuidedExperiment: boolean;
        static numberedSampleRegEx: RegExp;
        static templateSortFunction(left: NewExperimentTemplate, right: NewExperimentTemplate): number;
        constructor(experimentId: string, description: string);
    }
    class NewExperimentTemplateList {
        static templateList: NewExperimentTemplate[];
        static guidedExperimentTemplate: NewExperimentTemplate;
        static initializeTutorialTemplate(workspace: DataLab.Model.Workspace): DataLab.Util.Promise<any>;
        static initialize(workspace: DataLab.Model.Workspace): DataLab.Util.Promise<any>;
    }
    class NewExperimentMenuTemplateViewModel {
        id: string;
        title: string;
        description: string;
        icon: string;
        isBlankTemplate: boolean;
        isGuidedExperiment: boolean;
        isVisible: KnockoutComputed<boolean>;
        constructor(template: NewExperimentTemplate, searchString: KnockoutObservable<string>);
    }
    class NewExperimentMenuViewModel extends DataLab.Util.Disposable {
        sampleExperiments: KnockoutComputed<NewExperimentMenuTemplateViewModel[]>;
        sampleExperimentTemplates: KnockoutObservable<NewExperimentTemplate[]>;
        onExperimentSelected: (NewExperimentTemplate) => void;
        searchText: KnockoutObservable<string>;
        constructor();
    }
    function NewExperimentMenuInitialize(): void;
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor.NewDrawerMenu {
    class NewModuleMenuViewModel extends DataLab.Util.Disposable {
        detailMessage: KnockoutObservable<string>;
        constructor();
    }
    function NewModuleMenuInitialize(): void;
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    class StockImage {
        category: string;
        url: string;
    }
    class CommunityStockImages {
        static Gallery: StockImage[];
        static init(galleryStockImagesUrl: string): void;
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    class ExperimentDataFlowWalker extends DataLab.Util.Disposable {
        nodes: DataLab.IDisposableObservableMap<GraphNodeViewModel>;
        connections: DataLab.IObservableMap<Connection>;
        private wsInputNodes;
        private wsOutputNodes;
        private portsMap;
        private nodesSubscription;
        private connectionsSubscription;
        constructor(nodes: DataLab.IDisposableObservableMap<GraphNodeViewModel>, connections: DataLab.IObservableMap<Connection>);
        walk(): void;
        reloadNodes(): void;
        reloadConnections(): void;
        private findReachableNodes(node, reachableNodes);
        private putPortMap(port1, port2);
        private pruneInputNodes(inputNode, wsFlowNodes, wsInputPort);
        private getPortMap(port);
        private getPortId(port);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../PaletteControl/PaletteViewModel.d.ts" />
declare module ExperimentEditor {
    class ExperimentWebServiceConstants {
        static InputPortId: string;
        static OutputPortId: string;
    }
    class ExperimentWebServiceViewModel extends DataLab.Util.Disposable {
        webServiceCategory: PaletteCategory;
        inputPalleteItem: PaletteItem;
        outputPalleteItem: PaletteItem;
        constructor();
    }
}

/// <reference path="CommunityStockImages.d.ts" />
declare module ExperimentEditor {
    class ImageSelectorViewModel {
        imageUploadViewModel: ImageUploadViewModel;
        selectedStockImgUrl: KnockoutObservable<string>;
        stockImages: StockImage[];
        PlaceHolderImageURL: string;
        constructor();
        selectedImageThumbnailSrc: KnockoutComputed<string>;
        hasImage: KnockoutComputed<boolean>;
        fillStockImages(): void;
        selectStockImage: (data: any, event: any) => void;
    }
}

declare module ExperimentEditor {
    import ImageContent = DataLab.ImageContent;
    class ImageUploadViewModel {
        maxSizeInMegabytes: number;
        imageResizeOptions: DataLab.Util.Images.IImageResizeOptions;
        finalImageContent: KnockoutObservable<ImageContent>;
        selectedImage: KnockoutObservable<File>;
        errorMessage: KnockoutObservable<string>;
        isProcessingSelectedImage: KnockoutObservable<boolean>;
        clearImage(): void;
        processSelectedImage(file: File): DataLab.Util.Promise<ImageContent>;
        constructor(maxSizeInMegabytes: number, imageResizeOptions: DataLab.Util.Images.IImageResizeOptions);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    class ProjectExperimentViewModel {
        experimentId: KnockoutObservable<string>;
        role: DataLab.DataContract.ExperimentRole;
        roleName: KnockoutComputed<string>;
        active: KnockoutComputed<boolean>;
        constructor(experimentId: string, role: DataLab.DataContract.ExperimentRole, project: ProjectViewModel);
        navigate(): void;
    }
    class ProjectViewModel {
        projectId: string;
        experimentVMs: KnockoutObservableArray<ProjectExperimentViewModel>;
        experiment: KnockoutComputed<DataLab.Model.Experiment>;
        modified: KnockoutObservable<boolean>;
        hasScoringGraph: KnockoutComputed<boolean>;
        experimentId: KnockoutComputed<string>;
        loaded: KnockoutObservable<boolean>;
        private workspace;
        constructor(workspace: DataLab.Model.Workspace, getExperiment: () => DataLab.Model.Experiment);
        init(): void;
        reset(): void;
        addExperiment(id: string, role: DataLab.DataContract.ExperimentRole): ProjectExperimentViewModel;
        save(): DataLab.Util.Promise<DataLab.DataContract.IProject>;
        findExperiment(filter: (experimentVM: ProjectExperimentViewModel) => boolean): ProjectExperimentViewModel;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/Bubble/PositionLocators.d.ts" />
/// <reference path="../../View/Bubble/BubbleViewModel.d.ts" />
declare module ExperimentEditor {
    class GuidedTour {
        private options;
        constructor();
        private static drawerAnimationDone();
        private static waitFor(conditionCallback, completedCallback, maxWaitInMs);
        private static blankExperimentCardVisible();
        private static closeDrawer();
        private static getBlankExperimentSelector();
        private static getOption();
        private static logGuidedTourStep(stepNumber);
        private static addLoggingLoadHandlerToStep(step, stepNumber);
        private static launchGuidedExperiment();
        static launch(): void;
    }
    class GuidedExperiment {
        private static options;
        constructor();
        private static getOption();
        private static logGuidedExperimentStep(stepNumber);
        private static addLoggingLoadHandlerToStep(step, stepNumber);
        private static getNodeSelector(nodeId);
        static launch(): void;
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    class AsyncOperation {
        isRunning: KnockoutObservable<boolean>;
        addNotification: (notification: any) => void;
        removeNotification: (notification: any) => void;
        progress: any;
        step: any;
        constructor();
        runAsync(): DataLab.Util.Promise<any>;
        runInternalAsync(): DataLab.Util.Promise<any>;
        reject(error: Error): JQueryPromise<any>;
        startProgress(title: string): void;
        addStep(title: string): void;
        updateCurrentStep(title: string): void;
        progressSuccess(): void;
        progressError(errorMessage: string): void;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="AsyncOperation.d.ts" />
declare module ExperimentEditor {
    import Model = DataLab.Model;
    class AddWebServicePortAnimationOperation extends AsyncOperation {
        private experiment;
        private workspace;
        webServiceInputPorts: Model.InputPort[];
        webServiceOutputPorts: Model.OutputPort[];
        webServiceInputPortNodes: Model.WebServicePortNode[];
        webServiceOutputPortNodes: Model.WebServicePortNode[];
        initialize(experiment: Model.Experiment, workspace: Model.Workspace): void;
        runInternalAsync(): DataLab.Util.Promise<any>;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="AsyncOperation.d.ts" />
declare module ExperimentEditor {
    class AnimationContext {
        context: any;
        stepFunc: (step: number, context: any) => {};
    }
    class AnimationOperation extends AsyncOperation {
        private intervalId;
        totalSteps: number;
        interval: number;
        currentStep: number;
        animations: AnimationContext[];
        runInternalAsync(): DataLab.Util.Promise<any>;
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    class Vertex {
        x: number;
        y: number;
        pos: number;
        isDummy: boolean;
        rank: number;
        graphNode: GraphNodeViewModel;
        inEdges: Edge[];
        outEdges: Edge[];
        layer: Layer;
        name: string;
        constructor(name?: string);
        sortEdges(): void;
        switch(target: Vertex): void;
        getEdges(dir: boolean): Edge[];
        getSortedEdges(dir: boolean): Edge[];
        getConnectedVertexes(dir: boolean): Vertex[];
        toString(): string;
    }
    class Edge {
        from: Vertex;
        fromPortPos: number;
        to: Vertex;
        toPortPos: number;
        compare(e: Edge, top: boolean): number;
        compareEnd(e: Edge, top: boolean): number;
    }
    class Layer {
        vectors: Vertex[];
        level: number;
        constructor(level: number);
        init(): void;
        pushVertex(v: Vertex): void;
        removeVertex(v: Vertex): void;
        sortByRank(): void;
        reorder(dir: boolean): void;
        reorderByRank(dir: boolean): void;
        countCrosses(dir: boolean): number;
        reorderIfReduceCross(dir: boolean): number;
    }
    class LayoutGraph {
        V: Vertex[];
        E: Edge[];
        L: Layer[];
        setupLayers(): void;
        setupGraph(nodes: GraphNodeViewModel[]): void;
        init(): void;
        reorder(dir: boolean): void;
        tryGetLayer(level: number): Layer;
        setupDummies(): void;
        pushEdge(e: Edge): void;
        removeEdge(e: Edge): void;
        setPositions(xDistance: number, yDistance: number): void;
        setPositionsToGraphNode(): DataLab.Util.Promise<any>;
        private static removeFromArray(item, array);
    }
    class AutoLayoutOperation extends AsyncOperation {
        graph: LayoutGraph;
        XDistance: number;
        YDistance: number;
        constructor(nodes: GraphNodeViewModel[]);
        runInternalAsync(): DataLab.Util.Promise<any>;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="../../View/Bubble/Bubble.d.ts" />
/// <reference path="../PaletteControl/PaletteViewModel.d.ts" />
declare module ExperimentEditor {
    import Util = DataLab.Util;
    import Model = DataLab.Model;
    class GuideTours {
        static showPrepareWebServiceTourAsync(portNode: Model.GraphNode, paletteVM: PaletteViewModel, webServiceCategoryName: string): Util.Promise<Bubble.BubbleViewModel>;
        static showCreatingScoringExperimentTourAsync(portNode: Model.GraphNode, paletteVM: PaletteViewModel, webServiceCategoryName: string, trainedModelNode: Model.GraphNode): Util.Promise<Bubble.BubbleViewModel>;
        static showCreatingScoringGraphCommandTour(): void;
        static showUpdatingScoringGraphCommandTour(): void;
        static showPublishWebServiceCommandTour(): void;
        static showMultipleTrainModuleSelectionTour(): void;
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    import Model = DataLab.Model;
    class ModelHelpers {
        static isDesiredModuleNode(node: Model.GraphNode, category: string): boolean;
        static isScoreModuleNode(node: Model.GraphNode): boolean;
        static isApplyTransformModuleNode(node: Model.GraphNode): boolean;
        static isModuleFamily(module_: Model.Module, familyId: string): boolean;
        static isModuleCategory(module_: Model.Module, category: string): boolean;
        static formatResourceName(name: string): string;
        static getUniqueResourceName(resourceCache: DataLab.IResourceCache<Model.DataResource>, name: string): string;
        static parseModelFamilyId(familyId: string): string;
        static parseExperimentFamilyId(experimentId: string): string;
        static searchTrainingModuleInTrainingGraph(experiment: Model.Experiment, moduleNodeId: string): Model.ModuleNode;
        static searchTrainedModelInScoreGraph(experiment: Model.Experiment, experimentFamilyId: string): Model.TrainedModelNode;
        static searchTransformNodeInScoreGraph(experiment: Model.Experiment, experimentFamilyId: string, transformResource: Model.Transform): Model.TransformNode;
        static searchSavedTrainedModel(trainedModelCache: DataLab.IResourceCache<Model.TrainedModel>, experimentFamilyId: string, moduleId: string, outputName: string): Model.TrainedModel;
        static getTrainingModuleNodes(experiment: Model.Experiment): Model.ModuleNode[];
    }
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../ModelHelpers.d.ts" />
/// <reference path="../ModelHelpers.d.ts" />
declare module ExperimentEditor {
    import Model = DataLab.Model;
    class Context {
        workspace: Model.Workspace;
        inputNode: Model.WebServicePortNode;
        outputNode: Model.WebServicePortNode;
        trainedModelNode: Model.GraphNode;
        experimentEditorViewModel: ExperimentEditorViewModel;
        asyncOperation: AsyncOperation;
    }
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../ModelHelpers.d.ts" />
/// <reference path="Context.d.ts" />
declare module ExperimentEditor {
    import Util = DataLab.Util;
    import Model = DataLab.Model;
    interface IExperimentProcessor {
        preProcess(trainingExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        process(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        postProcess(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
    }
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../ModelHelpers.d.ts" />
/// <reference path="../AsyncOperation.d.ts" />
/// <reference path="../GuideTours.d.ts" />
/// <reference path="IExperimentProcessor.d.ts" />
/// <reference path="Context.d.ts" />
/// <reference path="../AnimationOperation.d.ts" />
declare module ExperimentEditor {
    import Util = DataLab.Util;
    import Model = DataLab.Model;
    class TrainedModelExperimentProcessorBase implements IExperimentProcessor {
        trainedModelCache: DataLab.IResourceCache<Model.TrainedModel>;
        workspace: Model.Workspace;
        trainedModel: Model.TrainedModel;
        trainedModelPort: Model.OutputPort;
        webServiceInputPorts: Model.InputPort[];
        webServiceOutputPorts: Model.OutputPort[];
        scoreNodes: Model.GraphNode[];
        trainModuleNode: Model.ModuleNode;
        scoreModuleNode: Model.ModuleNode;
        constructor(workspace: Model.Workspace);
        preProcess(trainingExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        process(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        postProcess(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        searchTrainingModuleInGraph(experiment: Model.Experiment, context: Context): Util.Promise<Model.ModuleNode>;
        createTrainedModelAsync(experiment: Model.Experiment, trainModuleNode: Model.ModuleNode, context: Context): Util.Promise<Model.TrainedModel>;
        saveTrainedModel(workspace: Model.Workspace, port?: Model.OutputPort, name?: string, familyId?: string, description?: string): Util.Promise<any>;
    }
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../ModelHelpers.d.ts" />
/// <reference path="../AsyncOperation.d.ts" />
/// <reference path="../GuideTours.d.ts" />
/// <reference path="IExperimentProcessor.d.ts" />
/// <reference path="TrainedModelExperimentProcessorBase.d.ts" />
/// <reference path="Context.d.ts" />
/// <reference path="../AnimationOperation.d.ts" />
declare module ExperimentEditor {
    import Util = DataLab.Util;
    import Model = DataLab.Model;
    class TrainedModelExperimentCreateProcessor extends TrainedModelExperimentProcessorBase {
        constructor(workspace: Model.Workspace);
        preProcess(trainingExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        process(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        postProcess(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        private addTrainedModelToGraph(experiment, tm, context);
        private findOrCreateScoreModuleNodeAsync(experiment, context);
        private removeUnusedNodesAsync(experiment, scoreModuleNode);
        private traverseScoreGraphNodes(node);
        addWebServiceInputOutputPortsAsync(experiment: Model.Experiment, context: Context): Util.Promise<any>;
    }
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../ModelHelpers.d.ts" />
/// <reference path="../AsyncOperation.d.ts" />
/// <reference path="../GuideTours.d.ts" />
/// <reference path="IExperimentProcessor.d.ts" />
/// <reference path="Context.d.ts" />
/// <reference path="../AnimationOperation.d.ts" />
declare module ExperimentEditor {
    import Util = DataLab.Util;
    import Model = DataLab.Model;
    class TransformModuleExperimentProcessorBase implements IExperimentProcessor {
        transformResources: {
            [index: string]: Model.Transform;
        };
        transformProducerNodes: {
            [index: string]: Model.ModuleNode;
        };
        transformModulesCache: DataLab.IResourceCache<Model.Transform>;
        constructor(workspace: Model.Workspace);
        preProcess(trainingExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        process(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        postProcess(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        searchTransformModule(transformModulesCache: DataLab.IResourceCache<Model.Transform>, experimentFamilyId: string, moduleId: string, outputName: string): Model.TrainedModel;
        private saveTransformModel(workspace, port?, name?, familyId?, description?);
    }
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../ModelHelpers.d.ts" />
/// <reference path="../AsyncOperation.d.ts" />
/// <reference path="../GuideTours.d.ts" />
/// <reference path="IExperimentProcessor.d.ts" />
/// <reference path="TransformModuleExperimentProcessorBase.d.ts" />
/// <reference path="Context.d.ts" />
/// <reference path="../AnimationOperation.d.ts" />
declare module ExperimentEditor {
    import Util = DataLab.Util;
    import Model = DataLab.Model;
    class TransformModuleExperimentCreateProcessor extends TransformModuleExperimentProcessorBase {
        private applyTransformModuleName;
        private transformationOutputTransformPortName;
        private applyTransformInputPortName;
        constructor(workspace: Model.Workspace);
        preProcess(trainingExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        process(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        postProcess(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        private addTransformToGraph(tm, transformProducerNode, context);
        private findOrCreateApplyTransformNodeAsync(context, experiment, transformProducerNode, transformResource);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="AsyncOperation.d.ts" />
/// <reference path="GuideTours.d.ts" />
/// <reference path="ModelHelpers.d.ts" />
/// <reference path="ExperimentProcessor/TrainedModelExperimentCreateProcessor.d.ts" />
/// <reference path="ExperimentProcessor/TransformModuleExperimentCreateProcessor.d.ts" />
/// <reference path="ExperimentProcessor/IExperimentProcessor.d.ts" />
/// <reference path="ExperimentProcessor/Context.d.ts" />
declare module ExperimentEditor {
    import Util = DataLab.Util;
    class CreateScoringGraphOperation extends AsyncOperation {
        private notification;
        private workspace;
        private experiment;
        private experimentContainerViewModel;
        private xeControlContainer;
        private context;
        private processors;
        constructor(experimentContainerViewModel?: ExperimentEditorContainerViewModel, xeControlContainer?: ExperimentEditor.ExperimentEditorContainer);
        initialize(experimentContainerViewModel: ExperimentEditorContainerViewModel, xeControlContainer: ExperimentEditorContainer): void;
        runAsync(): DataLab.Util.Promise<any>;
        runInternalAsync(): DataLab.Util.Promise<any>;
        createScoreGraph(): Util.Promise<any>;
        private addExperimentToProject(id, role);
        isEnabled(): boolean;
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    import Model = DataLab.Model;
    enum MoveDirection {
        up = 0,
        down = 1,
    }
    class NodeMovement {
        node: Model.GraphNode;
        direction: MoveDirection;
    }
    class MoveNodesAnimationOperation extends AsyncOperation {
        yDistance: number;
        xDistance: number;
        private nodes;
        private nodeMovements;
        private rects;
        initialize(nodes: Model.GraphNode[]): void;
        AddMovement(movement: NodeMovement): void;
        runInternalAsync(): DataLab.Util.Promise<any>;
        private getBestPosition(movement);
        private isOverlap(r1, r2);
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="AsyncOperation.d.ts" />
declare module ExperimentEditor {
    import Model = DataLab.Model;
    class PrepareWebServiceOperation extends AsyncOperation {
        private experiment;
        private experimentContainerViewModel;
        private experimentEditorViewModel;
        private workspace;
        private xeControlContainer;
        inputPort: DataLab.Model.InputPort;
        outputPort: DataLab.Model.OutputPort;
        private nodes;
        private inputPortDepth;
        private outputPortDepth;
        private inputToOutputDepth;
        constructor(experimentContainerViewModel?: ExperimentEditorContainerViewModel, xeControlContainer?: ExperimentEditorContainer);
        reset(): void;
        initialize(experimentContainerViewModel: ExperimentEditorContainerViewModel, xeControlContainer: ExperimentEditorContainer): void;
        runAsync(): DataLab.Util.Promise<any>;
        runInternalAsync(): DataLab.Util.Promise<any>;
        searchGraph(): void;
        searchTree(node: Model.GraphNode, inputPort?: Model.InputPort, depth?: number, depthFromInputPort?: number): void;
        private isRoot(node);
    }
}

/// <reference path="../../Global.d.ts" />
declare module ExperimentEditor {
    class SaveTrainedModelOperation extends AsyncOperation {
        private workspace;
        port: DataLab.Model.OutputPort;
        name: string;
        familyId: string;
        description: string;
        showProgress: boolean;
        constructor(workspace: DataLab.Model.Workspace, port?: DataLab.Model.OutputPort, name?: string, familyId?: string, description?: string, showProgress?: boolean);
        runInternalAsync(): DataLab.Util.Promise<any>;
    }
}

/// <reference path="../GuideTours.d.ts" />
/// <reference path="IExperimentProcessor.d.ts" />
/// <reference path="TrainedModelExperimentProcessorBase.d.ts" />
/// <reference path="Context.d.ts" />
/// <reference path="../AnimationOperation.d.ts" />
declare module ExperimentEditor {
    import Util = DataLab.Util;
    import Model = DataLab.Model;
    class TrainedModelExperimentUpdateProcessor extends TrainedModelExperimentProcessorBase {
        private trainingExperiment;
        constructor(workspace: Model.Workspace);
        preProcess(trainingExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        process(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
    }
}

/// <reference path="../../../Global.d.ts" />
/// <reference path="../ModelHelpers.d.ts" />
/// <reference path="../AsyncOperation.d.ts" />
/// <reference path="../GuideTours.d.ts" />
/// <reference path="IExperimentProcessor.d.ts" />
/// <reference path="TransformModuleExperimentProcessorBase.d.ts" />
/// <reference path="Context.d.ts" />
/// <reference path="../AnimationOperation.d.ts" />
declare module ExperimentEditor {
    import Util = DataLab.Util;
    import Model = DataLab.Model;
    class TransformModuleExperimentUpdateProcessor extends TransformModuleExperimentProcessorBase {
        private trainingExperiment;
        constructor(workspace: Model.Workspace);
        preProcess(trainingExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        process(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
        postProcess(scoringExperiment: Model.Experiment, context: Context): Util.Promise<any>;
    }
}

/// <reference path="../../Global.d.ts" />
/// <reference path="AsyncOperation.d.ts" />
/// <reference path="ExperimentProcessor/TrainedModelExperimentUpdateProcessor.d.ts" />
/// <reference path="ExperimentProcessor/TransformModuleExperimentUpdateProcessor.d.ts" />
/// <reference path="ExperimentProcessor/IExperimentProcessor.d.ts" />
/// <reference path="ExperimentProcessor/Context.d.ts" />
declare module ExperimentEditor {
    class UpdateScoringGraphOperation extends AsyncOperation {
        private workspace;
        private experiment;
        private experimentContainerViewModel;
        private experimentEditorViewModel;
        private projectViewModel;
        private context;
        private processors;
        constructor(experimentContainerViewModel?: ExperimentEditorContainerViewModel);
        initialize(experimentContainerViewModel: ExperimentEditorContainerViewModel): void;
        runAsync(): DataLab.Util.Promise<any>;
        runInternalAsync(): DataLab.Util.Promise<any>;
        isUpdatable(): boolean;
        isEnabled(): boolean;
    }
}

/// <reference path="../../Common/IMenuBuilder.d.ts" />
/// <reference path="../ExperimentEditor/ExperimentEditorViewModel.d.ts" />
declare module ExperimentEditor {
    class WebServiceParameterMenuBuilder extends DataLab.Util.Disposable implements IMenuBuilder {
        currentTarget: KnockoutObservable<ParameterViewModel>;
        private experimentEditorViewModel;
        private deleteCommand;
        private provideDefaultValueCommand;
        constructor(experimentEditorViewModel: ExperimentEditorViewModel);
        build(parameterViewModel: ParameterViewModel): IMenuData;
        private featureUsage(featureId);
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="ExperimentView.d.ts" />
declare module DataLabViews {
    function formatExperimentStatusCode(statusCode: any): any;
    function dateTimeSortFormatter(dateTime: any): any;
    function formatExperimentName(name: any, rowInfo: any): string;
    class ExperimentListView {
        deleteCommand: any;
        private _renderArea;
        private _data;
        private listedExperiments;
        private _grid;
        private _workspace;
        private _client;
        private _userName;
        private _selectedRows;
        private formatCheckbox;
        private _experimentCategory;
        constructor(renderArea: any, workspace: any, client: any, userName: any, experimentCategory: string);
        refreshFromService(): void;
        changeExperimentArchiveState(archiveExperiment: boolean): void;
        setCommands(): void;
        private filterExperiments(experiments);
        private filterExperimentsByCategory(experiments);
        private refreshFromLocal(list);
        private getExperimentCategory(experiment);
        private _populateExperimentList(serviceExperiments);
        private deleteConfirmation();
        private delete();
        private _isGlobalWorkspaceId(workspaceId);
        private _isUserWorkspaceId(workspaceId);
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="ExperimentView.d.ts" />
/// <reference path="../Typescript/ViewModel/ExperimentEditor/ExperimentViewModel.d.ts" />
declare module DataLabViews {
    class ExperimentThumbnail extends DataLab.Util.Disposable {
        experimentViewModel: KnockoutObservable<ExperimentEditor.ExperimentViewModel>;
        constructor(experiment: DataLab.Model.Experiment, workspace: DataLab.Model.Workspace);
    }
    class RecentWorkView extends DataLab.Util.Disposable {
        static MAXRESULTS: number;
        selectedFilter: KnockoutObservable<string>;
        thumbnail: KnockoutObservable<ExperimentThumbnail>;
        thumbnailSize: KnockoutObservable<string>;
        thumbnailTitle: KnockoutObservable<string>;
        renderThumbnail: boolean;
        loading: KnockoutObservable<boolean>;
        private static LASTEDITCONTAINER;
        private static LASTRUNCONTAINER;
        private static LASTPUBLISHEDCONTAINER;
        private static THUMBNAIL;
        private _renderArea;
        private _experiments;
        private _webServiceGroups;
        private _workspace;
        private _selectedItem;
        constructor(renderArea: any, workspace: DataLab.Model.Workspace);
        thumbnailOnClick(): void;
        refreshFromService(): void;
        private _isGlobalWorkspaceId(workspaceId);
        private static _compareEditDate(left, right);
        private static _compareRunDate(left, right);
        private static _comparePublishDate(left, right);
        private static _fitSvg(container);
        private _getExperimentIdAsync(item);
        private _renderThumbnail(selection, thumbnail, svgContainer);
        private setupFilterSelector();
        private setupThumbnailSizeSelector(renderArea);
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="ExperimentView.d.ts" />
/// <reference path="ExperimentListView.d.ts" />
/// <reference path="RecentWorkView.d.ts" />
/// <reference path="../Typescript/ViewModel/ExperimentEditor/CommunityHelpers.d.ts" />
/// <reference path="../Typescript/ViewModel/ExperimentEditor/UserWorkspaceHelpers.d.ts" />
declare module DataLabViews {
    class AllExperimentsView extends DataLab.Util.Disposable {
        private static _SVG_CONTAINER_ID;
        private static _PREVIEW_PANE_ID;
        private static _SVG_MAX_ZOOM_IN_FACTOR;
        private static _PAGE_SIZE;
        private static _GRID_COLUMN_WIDTHS;
        private static _GRID_SEARCH_DELAY;
        deleteCommand: any;
        copyCommand: any;
        thumbnail: KnockoutObservable<ExperimentThumbnail>;
        loading: KnockoutObservable<boolean>;
        renderThumbnail: boolean;
        selectedItems: KnockoutObservableArray<any>;
        itemsSelectedMessage: KnockoutObservable<string>;
        pageLoaded: KnockoutObservable<boolean>;
        private _renderArea;
        private _data;
        private listedExperiments;
        private _grid;
        private _gridOptions;
        private _workspace;
        private _client;
        private _userName;
        private formatCheckbox;
        private _samplesOnly;
        private _selectedExperiment;
        private _previousSelectedExperiment;
        private _getSelectedExperimentPromise;
        constructor(renderArea: any, workspace: any, client: any, userName: any, samplesOnly?: boolean);
        private refreshExperimentListFromService();
        refreshFromService(): void;
        handleExperimentUnpackIfNecessary(): void;
        setCommands(): void;
        private static isDeleteBlockedByDependencies(deleteError);
        private static formatDeleteError(deleteError);
        private createGrid(options);
        private refreshFromLocal(list);
        private _populateExperimentList(serviceExperiments);
        private copyDialog();
        private deleteConfirmation();
        private delete();
        private _isGlobalWorkspaceId(workspaceId);
        private _isUserWorkspaceId(workspaceId);
        private setPreviewMinimumHeight();
        private fitSvg();
        private previewExperiment(dataItem);
        private computeShrinkToFitViewBox(containerWidth, containerHeight, bbox, zoomLimit);
        private rowSelect(evt, args);
        private _getSpaceUsedAsync();
        private _validateForCopyAsync();
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="ExperimentView.d.ts" />
declare module DataLabViews {
    class DataflowListView {
        private _renderArea;
        private _data;
        private _grid;
        private _client;
        constructor(renderArea: any, client: any);
        private refreshFromService();
        private _populateDataflowList(serviceExperiments);
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="../Typescript/View/ExperimentEditorContainer.d.ts" />
/// <reference path="ExperimentView.d.ts" />
declare module DataLabViews {
    class DataflowView {
        private _renderArea;
        private xeViewModel;
        private xeControlContainer;
        constructor(renderArea: any, dataflowId: any, workspace: any);
        dispose(): void;
        open(): void;
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="../Typescript/ViewModel/Dialogs/ApiCodeDialogViewModel.d.ts" />
declare module DataLabViews {
    interface IDatasetListViewOptions {
        listSamples: boolean;
        showDependantsLinks: boolean;
    }
    class DatasetListView extends DataLab.Util.Disposable {
        private _renderArea;
        private _data;
        private _grid;
        private _client;
        private _workspace;
        private _selectedRows;
        private _downloadCommand;
        private _deleteCommand;
        private _apicodecopy;
        private _commandsWereSet;
        private _downloadableTypeIds;
        private _downloader;
        private _options;
        private _isBusy;
        private _datasetFilter;
        private static _defaultOptions;
        constructor(renderArea: any, workspace: any, client: any, options?: IDatasetListViewOptions);
        populateDatasetList(): void;
        setCommands(): void;
        apicodecopy(dataset: any): void;
        downloadDataset(dataset: any): void;
        deleteResourceFamily(rowItem: any): void;
        private confirmDeletetionAsync();
        private confirmDeletionWithSoftDependantsAsync(items);
        private showDependants(items);
        private showHardDependantsAsync(webServiceGroups);
        private setBusy(value?);
        private unsetBusy();
        private _watchCacheChanges();
        private onSelect(evt, args);
        private static _extractFamilyGuid(id);
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="ExperimentView.d.ts" />
declare module DataLabViews {
    class ExperimentLineageView {
        private _grid;
        private _data;
        private _workspace;
        private _experimentId;
        private backCommand;
        constructor(renderArea: any, workspace: DataLab.Model.Workspace, experimentId: string);
        setCommands(): void;
        refreshFromService(): void;
        private navigateToSource();
        private getLineage(startExperimentId, leafExperimentInfo?);
        private _populateExperimentList(serviceExperiments);
    }
}

/// <reference path="../Typescript/Global.d.ts" />
declare module DataLabViews {
    interface IExperimentNotification {
        name: string;
        urlHash?: string;
    }
    function createListOfDependants(items: IExperimentNotification[], showLinks?: boolean): JQuery;
}

/// <reference path="ExperimentView.d.ts" />
declare module DataLabViews {
    class ModuleListView {
        private _renderArea;
        private _data;
        private _grid;
        private _client;
        private _moduleCacheOnChange;
        private _workspace;
        constructor(renderArea: any, workspace: any, client: any);
        populateModuleList(): void;
        private dispose();
    }
}

/// <reference path="../Typescript/Global.d.ts" />
declare module DataLabViews {
    interface ITrainedModelListViewOptions {
        showDependantsLinks: boolean;
    }
    class TrainedModelListView<T extends DataLab.Model.DataResource> extends DataLab.Util.Disposable {
        private _renderArea;
        private _data;
        private _grid;
        private _client;
        private _workspace;
        private _selectedRows;
        private _deleteCommand;
        private _options;
        private _isBusy;
        private static _defaultOptions;
        constructor(renderArea: any, workspace: any, client: any, options?: ITrainedModelListViewOptions);
        populateList(): void;
        setCommands(): void;
        deleteResourceFamily(rowItem: any): void;
        private confirmDeletetionAsync();
        private confirmDeletionWithSoftDependantsAsync(items);
        private showDependants(items);
        private showHardDependantsAsync(webServiceGroups);
        private setBusy(value?);
        private unsetBusy();
        private _watchCacheChanges();
        private onSelect(evt, args);
        private static _extractFamilyGuid(id);
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="../Typescript/View/DialogViewFactories.d.ts" />
/// <reference path="../Typescript/ViewModel/Dialogs/ScoreDialogViewModel.d.ts" />
/// <reference path="../Typescript/View/ExperimentEditorContainer.d.ts" />
declare module DataLabViews {
    class InputOutputViewModel {
        columnName: string;
        columnDisplayName: string;
        columnType: string;
        columnFriendlyName: string;
        constructor(name: string, type: string, friendlyName: string);
    }
    class WebServiceParameterViewModel {
        name: string;
        type: string;
        description: string;
        defaultValue: string;
        parameterRules: DataLab.DataContract.IParameterRule[];
        displayName: KnockoutComputed<string>;
        constructor(parameter: DataLab.DataContract.IGlobalParameterMetadata);
    }
    class WebServiceGroupConfigViewModel {
        description: KnockoutObservable<string>;
        name: KnockoutObservable<string>;
        inputs: KnockoutObservableArray<InputOutputViewModel>;
        outputs: KnockoutObservableArray<InputOutputViewModel>;
        globalParameters: KnockoutObservableArray<WebServiceParameterViewModel>;
        allowAnonymousTest: KnockoutObservable<boolean>;
        diagnosticsMode: KnockoutObservable<boolean>;
        webServiceGroupId: any;
        modelPackageInfo: DataLab.DataContract.IModelPackageInfo;
        modelPackageStatusCode: DataLab.DataContract.ModelPackageStatusCode;
        webServiceGroup: DataLab.DataContract.IWebServiceGroup;
        refreshedFromServiceHandler: (isInitialLoad: boolean, source: WebServiceGroupConfigViewModel) => void;
        errorSchemaUpdateHandler: () => void;
        errorNameUpdateHandler: () => void;
        errorDiagnosticsModeUpdateHandler: () => void;
        successUpdateHandler: () => void;
        finishedUpdateHandler: () => void;
        private _workspace;
        private _existingDiagnosticsMode;
        private _existingFriendlyNames;
        constructor(webServiceGroupId: any, workspace: DataLab.Model.Workspace);
        refreshFromService(isInitialLoad: boolean): void;
        loadSchema(): void;
        getFriendlyNames(): string;
        update(): DataLab.Util.Promise<any>;
    }
    class WebServiceGroupConfigContainerViewModel extends DataLab.Util.Disposable {
        configViewModel: WebServiceGroupConfigViewModel;
        shouldShowDiagnosticsButton: boolean;
        private saveCommand;
        private discardCommand;
        private _renderArea;
        private _template;
        private _workspace;
        private _modelPackageInfo;
        private _webServiceGroup;
        private _allowAnonymousTest;
        private _diagnosticsModeOptions;
        private hasBeenEdited;
        constructor(renderArea: any, webServiceGroupId: any, workspace: DataLab.Model.Workspace);
        open(): void;
        setCommands(): void;
        configUpdated(rootObj: any): void;
        private refreshFromService(isInitialLoad);
        configRefreshedFromServiceEventHandler(isInitialLoad: boolean, source: WebServiceGroupConfigViewModel): void;
        private successfulUpdateEventHandler();
        private refreshModelPackageUI();
        private update();
        private discard();
        private setErrorNotification(title);
        private updateTitles(title);
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="../Typescript/View/DialogViewFactories.d.ts" />
/// <reference path="../Typescript/ViewModel/Dialogs/ScoreDialogViewModel.d.ts" />
/// <reference path="../Typescript/View/ExperimentEditorContainer.d.ts" />
declare module DataLabViews {
    class WebServiceGroupDashboardView extends DataLab.Util.Disposable {
        creationTime: string;
        webServices: WebService[];
        parentExperimentDescription: string;
        parentExperimentId: string;
        parentExperimentLatestId: string;
        shouldShowRelatedWebService: boolean;
        relatedWebServiceGroupId: string;
        relatedWebServiceName: string;
        relatedWebServiceLabel: string;
        wsgDescription: string;
        shouldShowProductionElements: boolean;
        productionStatusSectionTitle: string;
        productionStatusDescription: string;
        productionActionDescription: string;
        productionActionUrl: string;
        private _renderArea;
        private _workspace;
        private _webServiceGroupId;
        private _modelPackageInfo;
        private _webServiceGroup;
        private _grid;
        constructor(renderArea: any, webServiceGroupId: any, workspace: DataLab.Model.Workspace);
        open(): void;
        setCommands(): void;
        private getLatestExperimentRunId();
        private setUpRelatedWebserviceLink();
        private showProductionStatus();
        private getConfigTabUrl();
        private getApiHelpPageUrl(methodId);
        private getDownloadExcelUrl();
        private showExcelLink();
        private setupWebServiceGrid();
        private onDeleteWebServiceGroup();
        private showError(message);
        private confirmDelete();
        private deleteWebServiceGroup();
        private showInteractiveScoreDialog(webServiceId);
        private updateSidebarTitle(title);
        static getProductionStatus(modelPackageInfo: DataLab.DataContract.IModelPackageInfo): DataLab.DataContract.ModelPackageStatusCode;
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="ExperimentView.d.ts" />
/// <reference path="WebServiceGroupView.d.ts" />
declare module DataLabViews {
    class WebServiceGroupListView {
        private _renderArea;
        private _data;
        private _grid;
        private _workspace;
        private _client;
        private _webServiceGroup;
        constructor(renderArea: any, workspace: DataLab.Model.Workspace, client: any);
        setCommands(): void;
        refreshFromService(): void;
        navigateToWebServiceGroup(webServiceGroupId: any): void;
        private createGrid();
        private showError(message);
        private confirmDelete();
        private deleteWebServiceGroup();
    }
}

/// <reference path="../Typescript/Global.d.ts" />
/// <reference path="../Typescript/ViewModel/ExperimentEditor/Help.d.ts" />
/// <reference path="../Typescript/ViewModel/ExperimentEditor/CustomUX.d.ts" />
declare module DataLabViews {
    interface Link {
        caption: string;
        url?: string;
        onclick?: any;
        openInNewWindow?: boolean;
    }
    interface InfoSection {
        title: string;
        text: string;
        links?: Link[];
        moreLink?: Link;
    }
    class GetStartedVideo extends DataLab.Util.Disposable implements ExperimentEditor.CustomUX.ICustomUXViewModel {
        id: string;
        url: string;
        title: string;
        description: string;
        openMoreInfo: () => void;
        thumbnail: string;
        hasBeenWatched: KnockoutObservable<boolean>;
        selected: KnockoutObservable<boolean>;
        width: number;
        height: number;
        constructor(id: string, url: string, thumbnail: string, title: string, width: number, height: number, description?: string, openMoreInfo?: () => void, hasBeenWatched?: KnockoutObservable<boolean>, selected?: KnockoutObservable<boolean>);
        markAsWatched(): void;
        private getWatchedVideosIds();
        private setWatchedVideId(videoId);
    }
    class WelcomeView extends DataLab.Util.Disposable {
        private static _CUSTOMUX_XPADDING;
        private static _CUSTOMUX_YPADDING;
        private static _TOPIC_ID_CREATE_EXPERIMENT;
        private static _TOPIC_ID_GETTING_DATA;
        private static _TOPIC_ID_SHARING_WORKSPACES;
        private static _TOPIC_ID_CREATING_EXPERIMENTS;
        private static _TOPIC_ID_AZ_LIST;
        private static _TOPIC_ID_MODULE_LIST;
        private static _TOPIC_ID_OVERVIEW;
        private static _TOPIC_ID_CREATING_SIMPLE_EXPERIMENT;
        private static _TOPIC_ID_SAMPLE_EXPERIMENTS;
        private static _TOPIC_ID_SAMPLE_DATA;
        private static _TOPIC_ID_PUBLISHING;
        private static _TOPIC_ID_GUIDE_START;
        static INFOSECTIONS: InfoSection[];
        welcomeSkipOption: KnockoutObservable<boolean>;
        selectedVideo: KnockoutObservable<GetStartedVideo>;
        videos: GetStartedVideo[];
        infoSections: InfoSection[];
        constructor(client: DataLab.DataContract.Client, workspace: DataLab.Model.Workspace, renderArea: JQuery);
        goNewExperiment(): void;
        selectVideo(video: GetStartedVideo): void;
    }
}
