/// <reference path="../../References.d.ts" />

import Encodable = require("../Framework/Model/Contracts/Encodable");

export interface IMessageSubscription<T> {
    name: string;
    callback: (message: T, publisherName?: string) => void;
}

/**
 * Propagates message to the view models which choose to subscribe.
 */
export class MessageHandler<T> {
    protected state: T = null;
    protected subscribers: StringMap<IMessageSubscription<T>[]>;

    constructor() {
        this.subscribers = {};
    }

    // Pushes the new state to specified listeners. If none specified,
    // push to all listeners
    public pushState(publisherName: string, newState: T, listeners: string[] = null) {
        this.state = newState;

        if (listeners === null) {
            listeners = Object.keys(this.subscribers);
        }

        this.notifySubscribers(publisherName, listeners);
    }

    /**
     * Allows view models to register with this handler.
     * Each view model must specify a callback which will be fired on all state update events.
     * The callback logic may ignore certain events if appropriate.
     */
    public register(newSubscriber: IMessageSubscription<T>) {
        let subscriptions = [];

        if (!(newSubscriber.name in this.subscribers)) {
            this.subscribers[newSubscriber.name] = subscriptions;
        } else {
            subscriptions = this.subscribers[newSubscriber.name];
        }

        subscriptions.push(newSubscriber);
    }

    public unregister(oldSubscriber: IMessageSubscription<T>): void {
        if (!(oldSubscriber.name in this.subscribers)) {
            return;
        }

        let index = this.subscribers[oldSubscriber.name].indexOf(oldSubscriber);
        if (index !== -1) {
            this.subscribers[oldSubscriber.name].splice(index, 1);
        }
    }

    public getState(): T {
        return this.state;
    }

    protected notifySubscribers(publisherName: string, subscriberNames: string[]) {
        subscriberNames.forEach(name => {
            // never send a message to yourself
            if (name === publisherName) {
                return;
            }

            this.subscribers[name].forEach((subscriber) => {
                subscriber.callback(this.state, publisherName);
            });
        });
    }
}

class DefaultMessageHandler<T> extends MessageHandler<T> {
    private defaultState: T;
    private isEmpty: (state: T) => boolean;

    constructor(defaultState: T, isEmpty: (state: T) => boolean) {
        super();
        this.isEmpty = isEmpty;
        this.setDefaultState(defaultState);
    }

    public pushState(publisherName: string, newState: T, listeners: string[] = null) {
        if (this.isEmpty(newState)) {
            newState = this.defaultState;
        }
        super.pushState(publisherName, newState, listeners);
    }

    public setDefaultState(state: T): void {
        this.defaultState = state;
        if (this.isEmpty(this.state)) {
            this.state = state;
        }
    }
}

export interface ISelectionSubscription extends IMessageSubscription<Encodable.Encodable[]> { };
export class SelectionHandler extends DefaultMessageHandler<Encodable.Encodable[]> { };

export interface IActivityRunUpdateSubscription extends IMessageSubscription<Encodable.ActivityRunEncodable> { };
export class ActivityRunUpdateHandler extends MessageHandler<Encodable.ActivityRunEncodable> { };
