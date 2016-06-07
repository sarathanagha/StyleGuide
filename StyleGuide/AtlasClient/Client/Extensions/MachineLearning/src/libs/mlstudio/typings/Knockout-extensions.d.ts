/// <reference path="../../../References.d.ts" />

interface KnockoutObservable_ReadOnly<T> extends KnockoutSubscribable<T> {
    // read the value
    (): T;
    peek(): T;
}