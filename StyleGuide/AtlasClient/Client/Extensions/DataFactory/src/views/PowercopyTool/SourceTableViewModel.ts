/* tslint:disable:no-unused-variable */
import Common = require("./Common");
import Constants = require("./Constants");
import IColumn = Common.IColumn;
import FormFields = require("../../bootstrapper/FormFields");
import DataNavModelModule = require("./DataNavModel");
import DataNavModel = DataNavModelModule.DataNavModel;
import JQueryUIBindingHandlers = require("../../bootstrapper/JQueryUIBindings");
import DateTime = require("../../scripts/Framework/Util/DateTime");
import Validation = require("../../bootstrapper/Validation");
import DataTypeConstants = require("./DataTypeConstants");
import Configuration = require("./Configuration");
/* tslint:enable:no-unused-variable */

let validateQuery = "Validate Query";
let validating = "Validating...";

let standardQuery = "select * from <tableName>";
let timedQuery = "$$Text.Format('select * from <tableName> where <columnName> >= \\'{0:yyyy-MM-dd HH:mm}\\' AND <columnName> < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)";

export class SourceTableViewModel implements Validation.IValidatable {
    private static id = 0;

    public tableName: string;
    public datasourceReference: string;
    public columns = ko.observableArray<IColumn>();
    public dateColumns = ko.observableArray<FormFields.IOption>();
    public selectedDateColumn = ko.observable<string>();
    public sourceTableTextWidth = ko.observable<string>();

    public expanded = ko.observable(false);
    public resultingQuery: KnockoutComputed<string>;
    public valid: KnockoutComputed<boolean>;

    private dataModel: DataNavModel;
    private useCustomQuery: KnockoutObservableBase<boolean>;
    private query = ko.observable<string>();
    private generatedQuery: KnockoutComputed<string>;
    private windowStartEnd: JQueryUIBindingHandlers.IDatetimeRangeBindingValueAccessor;
    private queryErrorMessage = ko.observable<string>();
    private variables: Common.IRuntimeVariables;
    private idGeneratedQuery: string;
    private idCustomQuery: string;
    private customQuerySchema: IColumn[];
    private dirty = ko.observable(true);
    private queryValid = ko.observable(false);
    private validatingButtonText = ko.observable(validateQuery);
    private variablesVisible: KnockoutComputed<boolean>;
    private tableNameField: FormFields.ValidatedSelectBoxViewModel<string> = null;

    public resultingSchema(): IColumn[] {
        return this.useCustomQuery() ? this.customQuerySchema : this.columns();
    }

    public runQuery() {
        this.validatingButtonText(validating);
        let query: Configuration.IUserQuery = {
            query: this.query(),
            runtimeVariables: this.variables,
            tableName: this.dataModel.dataType() === DataTypeConstants.azureTable ? this.tableName : ""
        };
        return this.dataModel.doRunQuery(query, this.queryErrorMessage).then(schema => {
            this.customQuerySchema = schema;
            this.queryValid(true);
            this.dirty(false);
        }).fail(reason => {
            this.queryValid(false);
            this.dirty(false);
        }).finally(() => {
            this.validatingButtonText(validateQuery);
        });
    }

    public setDateRange(dateRange: DateTime.IDateRange) {
        this.windowStartEnd.currentValue(dateRange);
    }

    public isValid() {
        if (this.useCustomQuery()) {
            if (this.dirty()) {
                return this.runQuery().then(() => {
                    let result: Validation.IValidationResult = {
                        valid: this.queryValid(),
                        message: this.queryErrorMessage()
                    };
                    return result;
                });
            } else {
                return Q({ valid: this.queryValid(), message: this.queryErrorMessage() });
            }
        }
        return Q({ valid: true, message: "" });
    }

    private getConfigEntry() {
        if (this.dataModel.dataType()) {
            return Configuration.copyConfig[this.dataModel.dataType()];
        } else {
            return undefined;
        }
    }

    constructor(dataModel: DataNavModel, tableName: string, datasourceReference: string, customQueryTable: boolean, isOneTime: boolean, dateRange?: DateTime.IDateRange) {
        this.tableName = tableName;
        this.datasourceReference = datasourceReference;
        if (dataModel.isSource) {
            // "" means custom query, null means no filter
            if (customQueryTable) {
                this.useCustomQuery = ko.observable(true);
            } else {
                this.useCustomQuery = ko.computed(() => this.selectedDateColumn() === "");
            }

            this.dataModel = dataModel;
            this.variables = {
                windowStart: undefined,
                windowEnd: undefined
            };
            this.idCustomQuery = "idCustomQuery" + SourceTableViewModel.id;
            this.idGeneratedQuery = "idGeneratedQuery" + SourceTableViewModel.id;
            SourceTableViewModel.id++;
            let setVariables = (currentValue: DateTime.IDateRange) => {
                this.variables.windowStart = currentValue.startDate.toISOString();
                this.variables.windowEnd = currentValue.endDate.toISOString();
            };

            this.windowStartEnd = JQueryUIBindingHandlers.DatetimeRangeBindingHandler.getInitialValueAccessor();
            if (dateRange) {
                this.windowStartEnd.currentValue(dateRange);
                setVariables(dateRange);
            }

            this.windowStartEnd.currentValue.subscribe(currentValue => {
                setVariables(currentValue);
            });

            this.variablesVisible = ko.computed(() => {
                return this.query() && this.query().indexOf("$$") === 0;
            });

            let standardQueryTemplate = ko.computed(() => {
                if (dataModel.dataType()) {
                    let configQuery = Configuration.copyConfig[dataModel.dataType()].standardQueryTemplate;
                    if (configQuery !== undefined) {
                        return configQuery;
                    } else {
                        return standardQuery;
                    }
                } else {
                    return standardQuery;
                }
            });
            let timedQueryTemplate = ko.computed(() => (dataModel.dataType() && Configuration.copyConfig[dataModel.dataType()].timedQueryTemplate) || timedQuery);

            this.generatedQuery = ko.computed(() => {
                if (this.tableName) {
                    // db2 and postgresql are case sensitive and add double quotes for schema name and table name
                    // sql requires [] if table name contains special characters
                    let configEntry = this.getConfigEntry();
                    let startQuote = (configEntry && configEntry.tableColumnNameQuoteCharaters && configEntry.tableColumnNameQuoteCharaters[0]) || "";
                    let endQuote = (configEntry && configEntry.tableColumnNameQuoteCharaters && configEntry.tableColumnNameQuoteCharaters[1]) || "";
                    let name = this.tableName;
                    let columnName = this.selectedDateColumn();

                    columnName = startQuote + columnName + endQuote;
                    if (name.indexOf(".") !== -1) {
                        let names = name.split(".");
                        name = `${startQuote}${names[0]}${endQuote}.${startQuote}${names[1]}${endQuote}`;
                    } else {
                        name = `${startQuote}${name}${endQuote}`;
                    }

                    if (this.selectedDateColumn() && !isOneTime) {
                        return timedQueryTemplate().replace(/<tableName>/g, name).replace(/<columnName>/g, columnName);
                    } else {
                        return standardQueryTemplate().replace(/<tableName>/g, name);
                    }
                } else {
                    return "";
                }
            });
            let templateTableName = this.tableName || "<<table>>";
            ko.computed(() => {
                let query = timedQueryTemplate().replace(/<tableName>/g, templateTableName).replace(/<columnName>/g, "<<column>>");
                this.query(query);
            });
            this.tableName = this.tableName || Constants.customQuery;
            this.query.subscribe(() => {
                this.dirty(true);
            });

            this.valid = ko.computed(() => !this.useCustomQuery() || this.dirty() || this.queryValid());

            this.expanded.subscribe(expanded => {
                if (expanded) {
                    dataModel.preview(null);
                    dataModel.schema(null);
                }
            });

            this.resultingQuery = ko.computed(() => {
                if (this.useCustomQuery()) {
                    return this.query();
                } else {
                    return this.generatedQuery();
                }
            });
            // Azure table specific, query doens't contain table name            
            let tableNameSubscription: KnockoutSubscription<string>;
            if (customQueryTable) {
                this.dataModel.dataType.subscribe(dataType => {
                    if (dataType === DataTypeConstants.azureTable) {
                        this.tableNameField = new FormFields.ValidatedSelectBoxViewModel<string>(dataModel.tableListOptions,
                            {
                                label: "Table name"
                            });
                        tableNameSubscription = this.tableNameField.value.subscribe(tblName => {
                            this.tableName = tblName;
                            this.dirty(true);
                        });
                    } else {
                        if (tableNameSubscription) {
                            tableNameSubscription.dispose();
                        }
                        this.tableNameField = null;
                    }
                });
            }

        }
    }
}
