import Net = require("./Net");

export interface ISubscription {
    displayName: string;
    id: string;
    subscriptionId: string;
}

export interface ISubscriptionResponse {
    value: ISubscription[];
}

export var loaded: Q.Deferred<void> = Q.defer<void>();
export var subscriptions: ISubscription[];

Net.sendMessage<ISubscriptionResponse>("/api/resource", "GET", { requestUrl: "/subscriptions" }).then(result => {
    subscriptions = result.value;
    loaded.resolve(null);
});
