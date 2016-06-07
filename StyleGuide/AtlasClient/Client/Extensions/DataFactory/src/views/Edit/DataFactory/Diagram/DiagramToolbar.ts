import TypeDeclarations = require("../../../../scripts/Framework/Shared/TypeDeclarations");
import Framework = require("../../../../_generated/Framework");
import WinJSHandlers = require("../../../../scripts/Handlers/WinJSHandlers");
import AppContext = require("../../../../scripts/AppContext");

export class DiagramToolbarViewModel extends Framework.Toolbar.ToolbarViewModelBase {
    public diagramLocked: KnockoutObservable<boolean> = ko.observable(true);
    public lineageEnabled: KnockoutObservable<boolean> = ko.observable(false);
    public multiSelectEnabled: KnockoutObservable<boolean> = ko.observable(false);
    private _appContext: AppContext.AppContext = AppContext.AppContext.getInstance();

    private _userHasWriteAccess: KnockoutObservable<boolean>;

    constructor(lifetimeManager: TypeDeclarations.DisposableLifetimeManager, userHasWriteAccess: KnockoutObservable<boolean>) {
        super(lifetimeManager, "DataFactory.WinJSExtensions.DiagramToolbar");

        this._userHasWriteAccess = userHasWriteAccess;
    }

    public addZoomInButton(zoomInCallback: () => TypeDeclarations.Promise): void {
        this.addButton({
            tooltip: ClientResources.zoomInTooltip,
            onclick: zoomInCallback,
            icon: Framework.Svg.zoomIn
        });
    }

    public addZoomOutButton(zoomOutCallback: () => TypeDeclarations.Promise): void {
        this.addButton({
            tooltip: ClientResources.zoomOutTooltip,
            onclick: zoomOutCallback,
            icon: Framework.Svg.zoomOut
        });
    }

    public addZoomToFitButton(zoomToFitCallback: () => TypeDeclarations.Promise): void {
        this.addButton({
            tooltip: ClientResources.zoomToFitTooltip,
            onclick: zoomToFitCallback,
            icon: Framework.Svg.zoomToFit
        });
    }

    public addZoomTo100PercentButton(zoomTo100PercentCallback: () => TypeDeclarations.Promise): void {
        this.addButton({
            tooltip: ClientResources.zoomOneHundredPercentTooltip,
            onclick: zoomTo100PercentCallback,
            icon: Framework.Svg.zoomTo100
        });
    }

    public addLineageDisplayButton(): void {
        this.addToggleButton({
            tooltip: ClientResources.lineageDisplayTooltip,
            icon: Framework.Svg.lineageDisplay
        }, this.lineageEnabled);
    }

    public addSelectionModeButton(): void {
        this.addToggleButton({
            tooltip: ClientResources.selectionModeTooltip,
            icon: Framework.Svg.selectionMode
        }, this.multiSelectEnabled);
    }

    public addLockLayoutButton(): void {
        let lockLayout = this.addToggleButton({
            tooltip: ClientResources.lockDiagramTooltip,
            icon: Framework.Svg.lock
        }, this.diagramLocked);

        let callback = () => {
            if (this._userHasWriteAccess()) {
                lockLayout._command.tooltip(ClientResources.lockDiagramTooltip);
                lockLayout.disabled = false;
            } else {
                lockLayout._command.tooltip(ClientResources.diagramLockedNoAccessTooltip);
                lockLayout.disabled = true;
                lockLayout.selected = true;
            }
        };
        this._lifetimeManager.registerForDispose(this._userHasWriteAccess.subscribe(callback));
        callback();
    }

    public addAutoLayoutButton(autoLayoutCallback: () => TypeDeclarations.Promise): void {
        let autoLayoutInProgress = ko.observable(false);

        let autolayoutButton = this.addButton({
            tooltip: ClientResources.autolayoutTooltip,
            onclick: () => {
                this._appContext.dialogHandler.addRequest({
                    title: ClientResources.autolayoutConfirmationTitle,
                    primaryCommandText: ClientResources.Yes,
                    secondaryCommandText: ClientResources.No,
                    innerHTML: ClientResources.autolayoutConfirmationMessage,
                    dismissalHandler: (value) => {
                        if (value === WinJSHandlers.DismissalResult.primary) {
                            autoLayoutInProgress(true);
                            autoLayoutCallback().finally(() => {
                                autoLayoutInProgress(false);
                            });
                        }
                    }
                });
            },
            icon: Framework.Svg.autoLayout
        });

        let callback = () => {
            if (this._userHasWriteAccess() && !autoLayoutInProgress() && !this.diagramLocked()) {
                autolayoutButton.disabled = false;
                autolayoutButton._command.tooltip(ClientResources.autolayoutTooltip);
            } else {
                autolayoutButton.disabled = true;
                autolayoutButton._command.tooltip(ClientResources.autolayoutLockedTooltip);
            }
        };

        this._lifetimeManager.registerForDispose(ko.computed(callback));
    }
}
