/// <amd-dependency path="css!../ActivityTool.css" />
/// <amd-dependency path="text!../Templates/PropertiesTemplate.html" />
/// <amd-dependency path="text!./Templates/SqlServerTemplate.html" />
/// <amd-dependency path="text!./Templates/NewSqlServerTemplate.html" />

import AuthoringOverlay = require("../../Editor/Wizards/AuthoringOverlay");
import {ActivityTool} from "../ActivityTool";
import Constants = require("../../PowercopyTool/Constants");
import EntityStore = require("../../../scripts/Framework/Model/Authoring/EntityStore");
import Validation = require("../../../bootstrapper/Validation");
import FactoryEntities = require("../../PowercopyTool/FactoryEntities");
import {IPivotValueAccessor} from "../../../bootstrapper/PivotKnockoutBinding";
import {ExistingLinkedServicesGridViewModel} from "../../PowercopyTool/LinkedServicesViewModel";
import {LinkedServiceType, linkedServiceTypeToResourceMap} from "../../../scripts/Framework/Model/Contracts/LinkedService";
import FormFields = require("../../../bootstrapper/FormFields");

const defaultTitle: string = "Stored procedure activity settings";

enum SqlServerSelection {
    Existing,
    New
}

export class StoredProcedureTool extends ActivityTool {
    public static taskPropertiesTemplate: string = require("text!../Templates/PropertiesTemplate.html");
    public static sqlServerTemplate: string = require("text!./Templates/SqlServerTemplate.html");
    public newSqlServerTemplate: string = require("text!./Templates/NewSqlServerTemplate.html");
    public linkedServicesGridTemplate: string = require("text!../../PowercopyTool/templates/LinkedServicesGridTemplate.html");

    public pivotVisible: KnockoutObservable<boolean>;

    public propertiesStepSubtitle = ko.observable<string>(ClientResources.propertiesStepSubtitle.format(ClientResources.storedProcedureActivity));

    public errorMessage = ko.observable<string>();

    public valid: Validation.IValidatable;
    public nextEnabled = ko.observable(true);

    public sqlServerSelectionType: KnockoutObservable<SqlServerSelection> = ko.observable(SqlServerSelection.Existing);
    public sqlServerSelection = SqlServerSelection;

    public existingLinkedServicesGrid: ExistingLinkedServicesGridViewModel;
    public linkedServiceTypeFilterOptions: KnockoutObservableArray<FormFields.IOption> = ko.observableArray([
        { displayText: linkedServiceTypeToResourceMap[LinkedServiceType.azureSqlDatabase], value: LinkedServiceType.azureSqlDatabase },
        { displayText: linkedServiceTypeToResourceMap[LinkedServiceType.azureSqlDW], value: LinkedServiceType.azureSqlDW },
        { displayText: linkedServiceTypeToResourceMap[LinkedServiceType.onPremisesSqlServer], value: LinkedServiceType.onPremisesSqlServer }
    ]);
    public selectedLinkedServiceName: KnockoutObservable<string> = ko.observable("");

    constructor(entity: EntityStore.IActivityEntity) {
        super(entity, AuthoringOverlay.OverlayType.PIVOT, defaultTitle);

        FactoryEntities.loadEntities();

        this.overlayContent = <IPivotValueAccessor>{
            pivotItems: [
                {
                    header: Constants.taskProperties,
                    viewModel: this,
                    template: StoredProcedureTool.taskPropertiesTemplate
                },
                {
                    header: ClientResources.selectSqlServerLabel,
                    viewModel: this,
                    template: StoredProcedureTool.sqlServerTemplate
                },
                {
                    header: ClientResources.selectStoredProcedureLabel
                }
            ]
        };

        this.existingLinkedServicesGrid = new ExistingLinkedServicesGridViewModel(
            this.selectedLinkedServiceName, this.linkedServiceTypeFilterOptions, ko.observable<string>(), true);

    }

    public applyClicked() {
        // update the authoring model.
    }
}
