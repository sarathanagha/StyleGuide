
interface KnockoutArrayEdit<T> {
    status: string;
    index: number;
    moved: number;
    value: T;
}

interface KnockoutObservableBase<T> extends KnockoutReadOnlyObservableBase<T> {
    (value: T): void;
}

interface KnockoutReadOnlyObservableBase<T> extends KnockoutSubscribable<T> {
    peek(): T;
    (): T;
}

interface KnockoutDisposable {
    dispose(): void;
}
