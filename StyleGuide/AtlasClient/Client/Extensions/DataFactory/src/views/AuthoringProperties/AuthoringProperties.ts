import Framework = require("../../_generated/Framework");
import AppContext =  require("../../scripts/AppContext");
import PropertiesViewModel =  require("../../scripts/Framework/Views/Properties/PropertiesViewModel");
import PropertyTypes = require("../../scripts/Framework/Views/Properties/PropertyTypes");
import Pipeline = require("../../scripts/Framework/Model/Contracts/Pipeline");

let logger = Framework.Log.getLogger({
    loggerName: "StudioProperties"
});

export class StudioProperties extends PropertiesViewModel.PropertiesViewModel {
    public selectionChanged = (objects: Object[]) => {
        this._viewModels = <PropertiesViewModel.IHasDisplayProperties[]>objects;
        this._refresh();
    };

    private _viewModels: PropertiesViewModel.IHasDisplayProperties[] = [];

    public constructor() {
        super();
        this.propertyGroups(this._getPipelinePropertyGroups());
        this.loading(false);

        AppContext.AppContext.getInstance().selectionHandler.register({
            name: "Properties",
            callback: this.selectionChanged
        });
    }

    public _refresh(): void {
        this.addProperties();
    }

    public addProperties(): void {
        this.loading(true);

        Q.all(PropertiesViewModel.PropertiesViewModel.getPropertyGroups(this._viewModels)).then((properties: PropertiesViewModel.IDisplayPropertyGroup[]) => {
            this.propertyGroups(properties.length > 0 ? properties : this._getPipelinePropertyGroups());
            this.loading(false);
        }, (err) => {
            this.propertyGroups([]);
            logger.logError("Failed to show properties:", err);
        });
    }

    private _getPipelinePropertyGroups(): PropertiesViewModel.IDisplayPropertyGroup[] {
        let pipelineProps = AppContext.AppContext.getInstance().authoringPipelineProperties;

        let props = [];
        props.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: ClientResources.pipelineNameLabel,
            valueAccessor: () => { return pipelineProps.name; },
            input: true,
            showEmpty: true,
            editable: pipelineProps.nameEditable,
            copy: false,
            required: true
        }));
        props.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: ClientResources.pipelineDescriptionLabel,
            valueAccessor: () => { return pipelineProps.description; },
            input: true,
            showEmpty: true,
            editable: true,
            copy: false,
            required: false
        }));

        let propertiesGroup = {
            expanded: ko.observable(true),
            hideHeader: true,
            // yikei: Consider making these fields optional in the future.
            name: "",
            type: "",
            properties: props
        };

        let advancedProps = [];

        advancedProps.push(PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Paused",
            valueAccessor: () => { return pipelineProps.isPaused; }
        }));

        let modeProperty = <PropertyTypes.RadioGroupProperty<string>>PropertiesViewModel.PropertiesViewModel._addProperty({
            name: "Mode",
            valueAccessor: () => {
                return <PropertyTypes.IRadioGroupProperty<string>>{
                    radioOptions: ko.observableArray([
                        <PropertyTypes.IRadioProperty<string>>{
                            label: ko.observable(ClientResources.oneTimePipelineModeLabel),
                            value: ko.observable(Pipeline.PipelineMode.OneTime),
                            checked: ko.observable(pipelineProps.mode() === Pipeline.PipelineMode.OneTime)
                        },
                        <PropertyTypes.IRadioProperty<string>>{
                            label: ko.observable(ClientResources.scheduledPipelineModeLabel),
                            value: ko.observable(Pipeline.PipelineMode.Scheduled),
                            checked: ko.observable(pipelineProps.mode() === Pipeline.PipelineMode.Scheduled)
                        }
                    ])
                };
            },
            showEmpty: true,
            editable: true,
            copy: false,
            required: false
        });

        advancedProps.push(modeProperty);

        let activePeriodProperty = PropertiesViewModel.PropertiesViewModel._addProperty({
            name: ClientResources.pipelineActivePeriodLabel,
            valueAccessor: () => { return pipelineProps.activePeriod; },
            input: true,
            showEmpty: true,
            editable: true,
            copy: false,
            required: false,
            hidden: pipelineProps.isOneTimePipeline()
        });

        advancedProps.push(activePeriodProperty);

        modeProperty.value.subscribe((newValue) => {
            pipelineProps.mode(newValue);
            activePeriodProperty.hidden(newValue === Pipeline.PipelineMode.OneTime);
        });

        let advancedPropertiesGroup = {
            expanded: ko.observable(false),
            hideHeader: false,
            name: ClientResources.advancedPropertiesLabel,
            type: "",
            properties: advancedProps
        };

        return [propertiesGroup, advancedPropertiesGroup];
    }
}

/* tslint:disable:class-name */
export class viewModel extends StudioProperties { };
/* tslint:enable:class-name */
export const template = PropertiesViewModel.template;
