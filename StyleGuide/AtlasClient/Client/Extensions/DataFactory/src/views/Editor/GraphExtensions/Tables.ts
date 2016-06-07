import Shared = require("./Shared");

import Framework = require("../../../_generated/Framework");
import AppContext = require("../../../scripts/AppContext");
import PropertiesViewModel = require("../../../scripts/Framework/Views/Properties/PropertiesViewModel");
import PropertyTypes = PropertiesViewModel.PropertyTypes;
import EntityStore = require("../../../scripts/Framework/Model/Authoring/EntityStore");

let logger = Framework.Log.getLogger({
    loggerName: "Tables"
});

export class TableViewModel extends Shared.Base.BaseViewModel implements PropertiesViewModel.IHasDisplayProperties {
    public tableName: KnockoutObservable<string> = ko.observable(null);

    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();

    constructor(entity: EntityStore.IDatasetEntity) {
        super(entity.model.name, entity.model.properties().type, entity);
        this.icon = entity.metadata.icon;
    }

    public getPropertyGroup() {
        let deferred = Q.defer<PropertiesViewModel.IDisplayPropertyGroup>();

        let properties: PropertyTypes.IProperty[] = [];

        properties.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Name",
            valueAccessor: () => { return this.displayName; },
            editable: true,
            input: true,
            copy: false
        }));

        let tablesView = this._appContext.armDataFactoryCache.tableListCacheObject.createView();

        tablesView.fetch({
            subscriptionId: this._appContext.splitFactoryId().subscriptionId,
            resourceGroupName: this._appContext.splitFactoryId().resourceGroupName,
            factoryName: this._appContext.splitFactoryId().dataFactoryName
        }).then((tables) => {
            properties.push(this.getTableProperties(tables, this.tableName));

            // TODO iannight: add more properties
            deferred.resolve({
                properties: properties,
                expanded: ko.observable(true),
                hideHeader: false,
                name: this.displayName,
                type: this.displayType()
            });
        }, (err) => {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    public getTableProperties(tables: MdpExtension.DataModels.DataArtifact[],
                              tableName: KnockoutObservable<string>): PropertyTypes.IProperty {
        let tableNames: KnockoutObservableArray<string> = ko.observableArray<string>(tables.map((table) => {
            return table.name();
        }));

        let tableProperty = PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Table Name",
            required: true,
            valueAccessor: () => {
                return {
                    options: tableNames,
                    value: tableName,
                    setDefault: true
                };
            }
        });

        if (!tableName() && tableNames.length > 0) {
            tableName(tableNames[0]);
        }

        return tableProperty;
    }
}

export class TableNode extends Shared.Base.BaseExtensionConfig implements Shared.GraphContracts.IExtensionConfig {
    public static width = 232;
    public static height = 112;
    public viewModel: TableViewModel;
    public entity: EntityStore.IDatasetEntity;

    constructor(entity: EntityStore.IDatasetEntity) {
        super(entity.model.name(), TableNode.width, TableNode.height);
        this.entity = entity;

        let thisExtensionConfig = <Shared.GraphContracts.IExtensionConfig>this;
        if (!thisExtensionConfig.onEdit) {
            logger.logError("Running unpatched TableNode. Please make sure that patchNodes from NodePatcher is being called.");
        } else {
            // Binding because the type of onEdit is a lambda, thus "this" should refer to the object, irrespective of call style.
            thisExtensionConfig.onEdit = thisExtensionConfig.onEdit.bind(this);
        }

        this.viewModel = new TableViewModel(entity);
        this.acceptedTypes = [Shared.BASIC_TYPES.activity];
        this.types = [Shared.BASIC_TYPES.table, entity.model.properties().type()];
    }
}

export class TableSummaryViewModel extends Shared.Summary.SummaryViewModel<TableViewModel> {
    private _warningCount: KnockoutObservable<number> = ko.observable(0);
    private _errorCount: KnockoutObservable<number> = ko.observable(0);
    private _readyCount: KnockoutObservable<number> = ko.observable(0);

    private _subscriptions: KnockoutSubscription<string>[] = [];

    private _viewModels: TableViewModel[] = [];

    private _updateStatuses = (ignore = null) => {
        // reset all of the counts
        [this._warningCount, this._errorCount, this._readyCount].forEach((count) => {
            count(0);
        });

        this._viewModels.forEach((viewModel) => {
            switch (viewModel.statusIcon()) {
                case Framework.Svg.statusReady:
                    this._readyCount(this._readyCount() + 1);
                    break;
                case Framework.Svg.status_warning:
                    this._warningCount(this._warningCount() + 1);
                    break;
                case Framework.Svg.statusFailed:
                    this._errorCount(this._errorCount() + 1);
                    break;
                default:
                // noop
            }
        });
    };

    constructor() {
        super();

        this._summaryIcon(Framework.Svg.tableSummary);

        this.subCollections = [
            {
                icon: Framework.Svg.status_warning,
                count: this._warningCount
            }, {
                icon: Framework.Svg.statusFailed,
                count: this._errorCount
            }, {
                icon: Framework.Svg.statusReady,
                count: this._readyCount
            }];
    }

    public updateSummary(viewModels: TableViewModel[]) {
        this.dispose();

        this._viewModels = viewModels;

        // subscribe to the status changing for each of our viewmodels
        viewModels.forEach((viewModel) => {
            this._subscriptions.push(viewModel.statusIcon.subscribe(this._updateStatuses));
        });

        // perform the initial update
        this._updateStatuses();

        this._summaryText(this._viewModels.length + " Datasets");
    }

    public dispose(): void {
        this._subscriptions.forEach((subscription) => {
            subscription.dispose();
        });
    }
}

export class TableSummary extends Shared.Summary.SummaryExtensionConfig<TableViewModel> {
    constructor() {
        super();
        this.viewModel = new TableSummaryViewModel();

        this.initialRect = {
            x: 0,
            y: 0,
            height: TableNode.height,
            width: TableNode.width
        };
    }
}
