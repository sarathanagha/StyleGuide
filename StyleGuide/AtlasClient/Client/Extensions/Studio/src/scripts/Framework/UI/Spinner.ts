/// <reference path="../../References.d.ts" />

let logger = Microsoft.DataStudio.Studio.LoggerFactory.getLogger({ loggerName: "Spinner" });

/*
 * Represents a single "instance" of the spinner that believes it operates independently from any
 * others. Therefore, each seperate piece of logic (such as an api call) should create its own
 * instance. The main viewmodel (below), however, will only change to the off state when none
 * of the individual instances are turned on.
 */
export class SpinnerInstance {
    private _isOn: boolean;
    private _viewModel: SpinnerViewModel;

    constructor(viewModel: SpinnerViewModel) {
        this._viewModel = viewModel;
        this._isOn = false;
    }

    public on() {
        // don't allow invalid operations
        if (!this._isOn) {
            this._isOn = true;
            this._viewModel.instanceOn();
        } else {
            logger.logError("Spinner being toggled out of order");
        }

        return this;
    }

    public off() {
        // don't allow invalid operations
        if (this._isOn) {
            this._isOn = false;
            this._viewModel.instanceOff();
        } else {
            logger.logError("Spinner being toggled out of order");
        }

        return this;
    }

    // adds turning the spinner off to the promise and returns the original
    public promise(promise: Q.Promise<Object>): any {
        let final = (args) => {
            this.off();
        };

        promise.then(final, final);

        return promise;
    }
}

/*
 * ViewModel for the spinner itself. Will only change images when there are no "on" instances.
 *
 */
export class SpinnerViewModel {
    public spinner: KnockoutObservable<string>;

    private _spinners = 0;

    constructor() {
        this.spinner = ko.observable("");
    }

    public instanceOff() {
        this._spinners--;

        if (this._spinners === 0) {
            this.spinner("");
        }
    }

    public instanceOn() {
        this._spinners++;

        // iannight: we are disabling the spinner for now because it seems redundant
        // However, we'll keep this code around just in case we find a use case later
        // this.spinner(Svg.progressRing);
    }

    public getInstance() {
        return new SpinnerInstance(this);
    }
}
