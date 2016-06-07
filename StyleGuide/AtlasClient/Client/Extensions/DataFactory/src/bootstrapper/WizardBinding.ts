/// <amd-dependency path="text!./Templates/WizardTemplate.html" />
/// <amd-dependency path="css!./CSS/Wizard.css" />
/// <amd-dependency path="css!./CSS/Common.css" />

import Log = require("../scripts/Framework/Util/Log");
import Validation = require("./Validation");
import Framework = require("../_generated/Framework");

let logger = Log.getLogger({ loggerName: "WizardBinding" });

/* tslint:disable:no-any */
export interface IWizardStep {
    name: string;
    displayText: string;
    subheaderText?: KnockoutObservable<string>;
    template?: KnockoutObservableBase<string> | string;
    viewModel?: any;
    validationObservable?: KnockoutObservable<boolean>;
    validateable?: KnockoutObservable<Validation.IValidatable>;
    groupId?: string;
    cloacked?: KnockoutObservableBase<boolean>;
    substeps?: IWizardStep[];
    onLoad?: (forwardNavigation: boolean) => Q.Promise<void>;
    onForwardLoad?: () => Q.Promise<void>;
    useCustomErrorMessage?: boolean;
    onNext?: () => Q.Promise<void>;
}
/* tslint:enable:no-any */

interface INavItem {
    selected: KnockoutObservable<boolean>;
    completed: KnockoutObservable<boolean>;
    validating: boolean;
    wizardStep: IWizardStep;
    groupId?: string;
}

interface IWizardConfig {
    steps: IWizardStep[];
    headerTemplate?: string;
    headerViewModel?: Object;
}

interface IPivotGroup {
    selected: KnockoutComputed<boolean>;
    completed: KnockoutComputed<boolean>;
    cloacked: KnockoutComputed<boolean>;
    displayText: string;
    groupId: string;
    name: string;
}

let genericErrorMessage = "Please fix the errors on this page before continuing";

export class Wizard extends Framework.Disposable.RootDisposable {
    public previous: () => void;
    public next: () => void;
    public nextEnabled = ko.observable(true);
    public currentStep = ko.observable<string>();
    public currentSubstep = ko.observable<string>();
    public stepLoading = ko.observable(false);
    public validating = ko.observable(false);
    public waitingForOnNextCallback = ko.observable(false);
    public loading = ko.computed(() => this.stepLoading() || this.validating() || this.waitingForOnNextCallback()).extend({ throttle: 100 });

    private wizardSteps: IWizardStep[];
    private navItems = ko.observableArray<INavItem>();
    private pivots = ko.observableArray<INavItem>();
    private pivotMap: { [navItemName: string]: KnockoutObservableArray<INavItem> };
    private pivotGroups = ko.observableArray<IPivotGroup>();
    private visiblePivotGroupsCount: KnockoutComputed<number>;
    private pivotGroupsMap: { [navItemName: string]: KnockoutObservableArray<IPivotGroup> };

    private selectNavItem: (item: INavItem, forward: boolean) => void;
    private selectNavItemByClick: (item: INavItem) => void;
    private selectPivot: (item: INavItem, forwardNavigation: boolean) => void;
    private selectPivotGroup: (groupItem: IPivotGroup) => void;
    private validationObservable: KnockoutObservable<boolean>;
    private validateable: KnockoutObservable<Validation.IValidatable>;

    // this subscription will be set up when validation is started
    private validationSubscripton: KnockoutSubscription<number>;
    // validatedable is observable and can change while within the single wizard step/substep
    // this subscription will handle those changes
    private validatableSubscription: KnockoutSubscription<number>;

    private selectedItem: INavItem;
    private element: HTMLElement;
    private nextButtonText: KnockoutComputed<string>;
    private previousButtonVisible: KnockoutComputed<boolean>;
    private headerTemplate: string;
    private headerViewModel: Object;
    /* tslint:disable:no-any */
    private finalAction: () => any;
    /* tslint:enable:no-any */
    private hasFinalStep: boolean;
    private finalNavItem: INavItem;
    private errorMessage = ko.observable<string>();
    private hasPrevNextButtons = ko.observable(true);

    public setElement(element: HTMLElement) {
        this.element = element;
    }

    public dispose() {
        if (this.validationSubscripton) {
            this.validationSubscripton.dispose();
        }
    }

    /* tslint:disable:no-any */
    constructor(wizardConfig: IWizardConfig, finalAction: () => any, finalStep?: IWizardStep) {
        super();
        /* tslint:enable:no-any */
        this.wizardSteps = wizardConfig.steps;
        this.headerTemplate = wizardConfig.headerTemplate;
        this.headerViewModel = wizardConfig.headerViewModel;
        this.pivotMap = {};
        this.pivotGroupsMap = {};
        this.finalAction = finalAction;
        this.wizardSteps.forEach(step => {
            if (!step.subheaderText) {
                step.subheaderText = ko.observable<string>();
            }
            this.navItems.push({
                completed: ko.observable(false),
                selected: ko.observable(false),
                wizardStep: step,
                validating: false
            });
            this.pivotMap[step.name] = ko.observableArray<INavItem>();
            this.pivotGroupsMap[step.name] = ko.observableArray<IPivotGroup>();
            if (step.substeps) {
                if (step.viewModel) {
                    logger.logError("Wizard should not define both view model and sub-steps, view model setting will have no effect");
                }
                if (step.template) {
                    logger.logError("Wizard should not define both template and sub-steps, template setting will have no effect");
                }
                step.substeps.forEach(substep => {
                    this.pivotMap[step.name].push({
                        completed: ko.observable(false),
                        selected: ko.observable(false),
                        wizardStep: substep,
                        validating: false,
                        groupId: substep.groupId
                    });
                });

                let processedGroups: { [groupId: string]: string } = {};
                this.pivotMap[step.name]().forEach(pivot => {
                    if (!pivot.groupId) {
                        this.pivotGroupsMap[step.name].push({
                            completed: ko.computed(() => pivot.completed()),
                            selected: ko.computed(() => pivot.selected()),
                            cloacked: ko.computed(() => pivot.wizardStep.cloacked && pivot.wizardStep.cloacked()),
                            displayText: pivot.wizardStep.displayText,
                            groupId: pivot.groupId,
                            name: pivot.wizardStep.name
                        });
                    } else {
                        if (processedGroups[pivot.groupId] === undefined) {
                            this.pivotGroupsMap[step.name].push({
                                completed: ko.computed(() => {
                                    let completed = true;
                                    this.pivotMap[step.name]().forEach(p => {
                                        if (p.groupId === pivot.groupId) {
                                            completed = completed && p.completed();
                                        }
                                    });
                                    return completed;
                                }),
                                selected: ko.computed(() => {
                                    let selected = false;
                                    this.pivotMap[step.name]().forEach(p => {
                                        if (p.groupId === pivot.groupId) {
                                            selected = selected || p.selected();
                                        }
                                    });
                                    return selected;
                                }),
                                cloacked: ko.computed(() => {
                                    return this.pivotMap[step.name]().every(s => s.wizardStep.cloacked && s.wizardStep.cloacked());
                                }),
                                displayText: pivot.wizardStep.displayText,
                                groupId: pivot.groupId,
                                name: pivot.wizardStep.name
                            });
                            processedGroups[pivot.groupId] = "processed";
                        }
                    }
                });

            }
        });

        let findNextPivot = (initialIndex: number): number => {
            let index = initialIndex;
            while (index < this.pivots().length && this.pivots()[index].wizardStep.cloacked && this.pivots()[index].wizardStep.cloacked()) {
                index++;
            }
            return index;
        };

        let findPreviousPivot = (initialIndex: number): number => {
            let index = initialIndex;
            while (index > 0 && this.pivots()[index].wizardStep.cloacked && this.pivots()[index].wizardStep.cloacked()) {
                index--;
            }
            return index;
        };

        this.hasFinalStep = false;
        if (finalStep) {
            this.finalNavItem = {
                completed: ko.observable(false),
                selected: ko.observable(false),
                wizardStep: finalStep,
                validating: false
            };
            this.hasFinalStep = true;
            this.pivotMap[finalStep.name] = ko.observableArray<INavItem>();
            this.pivotGroupsMap[finalStep.name] = ko.observableArray<IPivotGroup>();
        }

        this.selectNavItem = (item: INavItem, forward: boolean) => {
            this.currentStep(item.wizardStep.name);
            this.navItems().forEach(n => {
                n.selected(n === item);
            });
            item.selected(true);

            let pivots = this.pivotMap[item.wizardStep.name]();
            this.pivots(pivots);
            this.pivotGroups(this.pivotGroupsMap[item.wizardStep.name]());
            if (pivots && pivots.length > 0) {
                // assumption is that step (nav item) will have at least one pivot that is not cloacked
                if (forward) {
                    let index = findNextPivot(0);
                    this.selectPivot(pivots[index], true);
                } else {
                    let index = findPreviousPivot(pivots.length - 1);
                    this.selectPivot(pivots[index], false);
                }
            } else {
                this.currentSubstep("");
                this.renderItem(item, forward);
            }
        };

        this.selectNavItemByClick = (item: INavItem) => {
            if (item.completed()) {
                this.selectNavItem(item, true);
            }
        };

        this.selectPivot = (item: INavItem, forwardNavigation: boolean) => {
            this.currentSubstep(item.wizardStep.name);
            this.pivots().forEach(p => {
                p.selected(p === item);
            });
            this.renderItem(item, forwardNavigation);
        };

        this.selectPivotGroup = (pivotGroup: IPivotGroup) => {
            if (pivotGroup.completed()) {
                let pivot = this.pivots().filter(p => p.wizardStep.name === pivotGroup.name)[0];
                this.selectPivot(pivot, false);
            }
        };

        let goNext = () => {
            if (this.pivots()) {
                let selectedIndex = this._getSelectedIndex(this.pivots);
                selectedIndex = findNextPivot(selectedIndex + 1);

                if (selectedIndex < this.pivots().length) {
                    this.selectedItem.completed(true);
                    this.selectPivot(this.pivots()[selectedIndex], true);
                    return;
                }
            }

            let selectedIndex = this._getSelectedIndex(this.navItems);
            if (selectedIndex < this.navItems().length - 1) {

                this.selectedItem.completed(true);
                this.navItems()[selectedIndex].completed(true);
                this.selectNavItem(this.navItems()[selectedIndex + 1], true);
                return;
            }

            if (this.finalAction) {
                this.finalAction();
                this.selectedItem.completed(true);
                if (this.finalNavItem) {
                    this.selectNavItem(this.finalNavItem, true);
                    this.finalNavItem.completed(true);
                    this.hasPrevNextButtons(false);
                }
            }
        };

        this.previous = () => {
            if (this.pivots()) {
                let selectedIndex = this._getSelectedIndex(this.pivots);
                if (selectedIndex > 0) {
                    selectedIndex = findPreviousPivot(selectedIndex - 1);
                    this.selectedItem.validating = false;
                    this.selectPivot(this.pivots()[selectedIndex], false);
                    return;
                }
            }

            let selectedIndex = this._getSelectedIndex(this.navItems);
            if (selectedIndex > 0) {
                this.selectedItem.validating = false;
                this.selectNavItem(this.navItems()[selectedIndex - 1], false);
            }
        };

        // We only allow going to next step if validation succeeds
        this.next = () => {
            this.selectedItem.validating = true;

            let onNextPromise = Q<void>(null);
            if (this.selectedItem.wizardStep.onNext) {
                this.waitingForOnNextCallback(true);
                let promise = this.selectedItem.wizardStep.onNext();
                if (promise) {
                    onNextPromise = promise;
                }
            }

            onNextPromise.then(() => {
                if (this.validationObservable) {
                    if (this.validationObservable()) {
                        goNext();
                    } else {
                        this.errorMessage(genericErrorMessage);
                        this.createValidationSubscription();
                    }
                } else if (this.validateable && this.validateable()) {
                    this.validating(true);
                    this.validateable().isValid().then(result => {
                        if (result.valid) {
                            goNext();
                        } else {
                            if (this.selectedItem.wizardStep.useCustomErrorMessage) {
                                this.errorMessage(result.message);
                            } else {
                                this.errorMessage(genericErrorMessage);
                            }
                            this.createValidationSubscription();
                        }
                    }).finally(() => {
                        this.validating(false);
                    });
                } else {
                    goNext();
                }
            }, (reason) => {
                // TODO paverma Display the error to the user, disable next, and re-enable it only after some change
                // has been made.
            }).finally(() => {
                this.waitingForOnNextCallback(false);
            });
        };

        this.nextButtonText = ko.pureComputed(() => {
            let toRet = ClientResources.wizardNext;
            if (this.currentStep() === this.navItems()[this.navItems().length - 1].wizardStep.name &&
                (this.pivots().length === 0 || this.currentSubstep() === this.pivots()[this.pivots().length - 1].wizardStep.name)) {
                toRet = ClientResources.wizardFinish;
            }
            return toRet;
        });

        this._lifetimeManager.registerForDispose(this.nextButtonText);

        this.previousButtonVisible = ko.pureComputed(() => {
            return this.navItems()[0].wizardStep.name !== this.currentStep();
        });

        this._lifetimeManager.registerForDispose(this.previousButtonVisible);
        this.visiblePivotGroupsCount = ko.computed(() => this.pivotGroups().filter(pg => !pg.cloacked()).length);
    }

    public initialize() {
        if (this.headerTemplate && this.headerViewModel) {
            let headerContentElement = $(this.element).find(".wizardHeader")[0];
            $(headerContentElement).html(this.headerTemplate);
            ko.applyBindings(this.headerViewModel, headerContentElement);
        }
        this.selectNavItem(this.navItems()[0], true);
    }

    private _getSelectedIndex(observableArray: KnockoutObservableArray<INavItem>): number {
        let ret = -1;
        observableArray().forEach((itm, i) => {
            if (itm.selected()) {
                ret = i;
            }
        });
        return ret;
    }

    private createValidationSubscription() {
        if (this.validationSubscripton) {
            this.validationSubscripton.dispose();
            this.validationSubscripton = null;
        }

        let observableToSubscribe = this.validationObservable || (this.validateable() && this.validateable().valid);
        if (observableToSubscribe) {
            this.validationSubscripton = observableToSubscribe.subscribe(value => {
                this.nextEnabled(value);
            });
            this.nextEnabled(observableToSubscribe());
        }
    }

    private renderItem(item: INavItem, forwardNavigation: boolean): void {
        item.validating = false;
        let wizardContentElement: HTMLElement = $(this.element).find(".wizardContentClass")[0];
        ko.cleanNode(wizardContentElement);

        let templateCopy = item.wizardStep.template;
        let template: string;
        if (typeof templateCopy === "string") {
            template = templateCopy;
        } else {
            template = templateCopy();
        }
        $(wizardContentElement).html(template);
        ko.applyBindings(item.wizardStep.viewModel, wizardContentElement);

        this.validationObservable = item.wizardStep.validationObservable;
        this.validateable = item.wizardStep.validateable;

        if (item.validating) {
            this.createValidationSubscription();
        } else {
            this.nextEnabled(true);
        }

        if (this.validatableSubscription) {
            this.validatableSubscription.dispose();
        }

        if (item.wizardStep.validateable) {
            this.validatableSubscription = item.wizardStep.validateable.subscribe(validateable => {
                item.validating = false;
                this.nextEnabled(true);
            });
        }
        this.selectedItem = item;

        let onLoadResult = undefined;
        if (item.wizardStep.onForwardLoad && forwardNavigation) {
            onLoadResult = item.wizardStep.onForwardLoad();
        } else if (item.wizardStep.onLoad) {
            onLoadResult = item.wizardStep.onLoad(forwardNavigation);
        }

        if (onLoadResult) {
            this.stepLoading(true);
            onLoadResult.finally(() => {
                this.stepLoading(false);
            });
        }
    }
}

export class WizardBindingHandler implements KnockoutBindingHandler {
    public static template = require("text!./Templates/WizardTemplate.html");
    public static bindingName = "wizard";
    public init(
        element: HTMLElement,
        valueAccessor: () => Object,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: {},
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        element.innerHTML = WizardBindingHandler.template;

        let wizardVM: Wizard = allBindingsAccessor.get(WizardBindingHandler.bindingName);
        if (!(wizardVM instanceof Wizard)) {
            logger.logDebug("viewModel has to be instance of Wizard");
            return;
        }
        let bindingElement = $(element).find(".wizardBindingElement")[0];
        ko.applyBindings(wizardVM, bindingElement);
        wizardVM.setElement(element);
        wizardVM.initialize();

        return { controlsDescendantBindings: false };
    }
}
