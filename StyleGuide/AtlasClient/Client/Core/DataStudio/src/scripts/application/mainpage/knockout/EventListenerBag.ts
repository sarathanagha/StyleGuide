module Microsoft.DataStudio.Application.Knockout {

    export class EventListenerBag {

        private bag: [EventTarget, string, EventListener][] = [];

        addEventListener(target: EventTarget, type: string, listener: EventListener, useCapture?: boolean): void {
            target.addEventListener(type, listener, useCapture);
            this.bag.push([target, type, listener]);
        }

        removeEventListeners(): void {
            while(this.bag.length > 0) {
                var item = this.bag.pop();
                item[0].removeEventListener(item[1], item[2]);
            }
        }
    }
}
