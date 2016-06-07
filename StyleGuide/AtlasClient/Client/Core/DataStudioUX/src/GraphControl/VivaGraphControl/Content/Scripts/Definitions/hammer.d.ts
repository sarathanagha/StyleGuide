interface HammerEvent extends Event {
    gesture: HammerGesture;
}

interface HammerGesture {
    timeStamp: number;
    target: HTMLElement;
    touches: any;
    pointerType: string;
    center: {clientX: number; clientY: number};
    deltaTime: number;
    deltaX: number;
    deltaY: number;
    velocityX: number;
    velocityY: number;
    angle: number;
    interimAngle: number;
    direction: string
    interimDirection: string;
    distance: number;
    scale: number;
    rotation: number;
    eventType: string;
    srcEvent: Event;
    startEvent: HammerGesture
    preventDefault: () => void;
    stopPropagation: () => void;
}

interface HammerInstance {
    on: (gestureName: string, callback: (event: HammerEvent) => void) => HammerInstance;
    off: (gestureName: string, callback: (event: HammerEvent) => void) => HammerInstance;
    trigger: (gestureName: string, eventData?: HammerGesture) => HammerInstance;
    (target: HTMLElement, options?: any): HammerInstance;
    POINTER_MOUSE: string;
    EVENT_START: string;
    EVENT_MOVE: string;
    EVENT_END: string;
    defaults: any;
    PointerEvent: any;
    utils: any;
}

declare var Hammer: HammerInstance;

