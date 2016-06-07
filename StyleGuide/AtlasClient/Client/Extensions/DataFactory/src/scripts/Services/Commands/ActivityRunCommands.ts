/// <reference path="../../../References.d.ts" />
import AppContext = require("../../AppContext");
import Encodable = require("../../Framework/Model/Contracts/Encodable");
import Framework = require("../../../_generated/Framework");
import TypeDeclarations = require("../../Framework/Shared/TypeDeclarations");
import SliceModel = require("../../Framework/Model/Contracts/DataSlice");
import Log = require("../../Framework/Util/Log");

let logger = Log.getLogger({
    loggerName: "ActivityRunCommands"
});

export class ActivityRunCommands extends Framework.Disposable.ChildDisposable {
    public makingRequest: KnockoutObservable<boolean> = ko.observable(false);

    public selectedActivityRuns: KnockoutObservableArray<Encodable.ActivityRunEncodable> = null;

    public rerunCommand: Framework.Command.ObservableCommand;
    public markReadyCommand: Framework.Command.ObservableCommand;

    public rerunMenu: Framework.Menu.MenuViewModelBase = null;
    public markMenu: Framework.Menu.MenuViewModelBase = null;

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();
    private _markMenuElement: HTMLElement;
    private _rerunMenuElement: HTMLElement;

    /* Button Handlers */
    private _rerunHandler = (updateType: SliceModel.UpdateType) => {
        return () => {
            this._updateStatus(SliceModel.SliceStatus.PendingExecution, updateType);
        };
    };

    private _changeSliceStatusHandler = (status: string, updateType: SliceModel.UpdateType) => {
        return () => {
            this._updateStatus(status, updateType);
        };
    };

    private _updateStatus = (status: string, updateType: SliceModel.UpdateType) => {
        this.makingRequest(true);

        let splitFactoryId = this._appContext.splitFactoryId();

        let activityRuns = this.selectedActivityRuns();

        let promises = [];

        activityRuns.forEach((activityRun) => {
            let sliceStart = new Date(activityRun.observable().windowStart);
            let sliceEnd = new Date(activityRun.observable().windowEnd);
            let outputTables = activityRun.observable().entities.toTypeMap(Encodable.EncodableType.TABLE);

            // update the slices for each output table
            $.each(outputTables, (id: string, outputTable: Encodable.TableEncodable) => {
                let promise = this._appContext.armService.setSliceStatus({
                    subscriptionId: splitFactoryId.subscriptionId,
                    resourceGroupName: splitFactoryId.resourceGroupName,
                    factoryName: splitFactoryId.dataFactoryName,
                    slicesStart: sliceStart.toISOString(),
                    slicesEnd: sliceEnd.toISOString(),
                    tableName: outputTable.name
                }, { SliceStatus: status, updateType: updateType });

                logger.logDebug("Sending update slice status request: " + JSON.stringify({
                    SliceStart: sliceStart,
                    TableName: outputTable.name,
                    FactoryName: splitFactoryId.dataFactoryName
                }));

                promises.push(promise);

                promise.done(this._updateActivityRunHandler(activityRun));
            });
        });

        // wait until everyone is done
        Q.all(promises).fin(() => {
            this.makingRequest(false);
        });
    };

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, activityRuns: KnockoutObservableArray<Encodable.ActivityRunEncodable>) {
        super(lifetimeManager);

        this.selectedActivityRuns = activityRuns;

        // selection-based commands
        this.rerunCommand = new Framework.Command.ObservableCommand({
            tooltip: ClientResources.rerunTooltip,
            icon: Framework.Svg.rerun,
            label: ClientResources.rerunLabel,
            disabled: true
        });

        this.rerunCommand.disabled = ko.pureComputed(() => {
            return this.makingRequest() || this.selectedActivityRuns().length === 0;
        });

        // selection-based commands
        this.markReadyCommand = new Framework.Command.ObservableCommand({
            tooltip: ClientResources.changeStateTooltip,
            label: ClientResources.changeStateLabel,
            icon: null,
            disabled: true
        });

        this.markReadyCommand.disabled = ko.pureComputed(() => {
            return this.makingRequest() || this.selectedActivityRuns().length === 0;
        });

        // create divs
        // TODO iannight: Atlas should give us a place closer to document.body (as WinJS reccomends)
        this._rerunMenuElement = <HTMLElement>($("<div></div").appendTo("body")[0]);
        this._markMenuElement = <HTMLElement>($("<div></div").appendTo("body")[0]);

        this.rerunMenu = new Framework.Menu.MenuViewModelBase(this._lifetimeManager, this._rerunMenuElement);
        this.markMenu = new Framework.Menu.MenuViewModelBase(this._lifetimeManager, this._markMenuElement);

        this.rerunMenu.addMenuButton({
            label: ClientResources.rerunLabel,
            onclick: this._rerunHandler(SliceModel.UpdateType.INDIVIDUAL)
        });

        this.rerunMenu.addMenuButton({
            label: ClientResources.rerunUpstreamLabel,
            onclick: this._rerunHandler(SliceModel.UpdateType.UPSTREAM_IN_PIPELINE)
        });

        this.markMenu.addMenuButton({
            label: SliceModel.SliceStatus.Ready,
            onclick: this._changeSliceStatusHandler(SliceModel.SliceStatus.Ready, SliceModel.UpdateType.INDIVIDUAL)
        });

        this.markMenu.addMenuButton({
            label: SliceModel.SliceStatus.Skip,
            onclick: this._changeSliceStatusHandler(SliceModel.SliceStatus.Skip, SliceModel.UpdateType.INDIVIDUAL)
        });
    }

    public dispose() {
        $(this._rerunMenuElement).remove();
        $(this._markMenuElement).remove();
    }

    private _updateActivityRunHandler(activityRun: Encodable.ActivityRunEncodable) {
        return () => {
            this._appContext.activityWindowCache.waitForUpdate(activityRun.observable);
        };
    }
}
