import Disposable = require("../Shared/Disposable");

// frequency in milliseconds
const REFRESH_FREQUENCY = 5000;

export interface IRefreshElement {
    html: KnockoutObservable<string>;
    timestamp: KnockoutObservable<moment.Moment>;
}

export class RefreshHandler extends Disposable.ChildDisposable {
    public createElement = (moment: moment.Moment) => {
        let timestamp = ko.observable(moment);

        let html = ko.pureComputed(() => {
            return this._template.replace(/\{TIMESTAMP\}/, timestamp().fromNow());
        });

        let element = {
            html: html,
            timestamp: timestamp
        };

        this._timestamps.push(timestamp);

        return element;
    };

    private _template: string = "Last refreshed {TIMESTAMP}.";
    private _timeout: number = null;
    private _timestamps: KnockoutObservable<moment.Moment>[] = [];

    private _updateTimestamps = () => {
        // we should cancel
        if (this._timeout === null) {
            return;
        }

        this._timestamps.forEach((timestamp) => {
            if (timestamp()) {
                timestamp.notifySubscribers();
            }
        });

        // kickoff again
        this._timeout = window.setTimeout(this._updateTimestamps, REFRESH_FREQUENCY);
    };

    constructor(lifetimeManager: Disposable.IDisposableLifetimeManager) {
        super(lifetimeManager);

        this._timeout = window.setTimeout(this._updateTimestamps, REFRESH_FREQUENCY);
    }

    public dispose() {
        super.dispose();

        // cancel
        let tmp = this._timeout;
        this._timeout = null;
        clearTimeout(tmp);
    }
}
