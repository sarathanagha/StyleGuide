export = Main;
declare module Main {
    /**
     * The function used to get the current time. Tests can inject their own method and control time in
     * a more rigorous manner.
     */
    var getCurrentTime: () => number;
    /**
     * The function used to call a function after a certain amount of time. Tests can inject their own method and control time in
     * a more rigorous manner.
     */
    var setTimeoutFromCurrentTime: (handler: any, timeout?: number) => number;
    /**
     * A dictionary of all the animating properties. The key is the property being animated and the value is the current tween.
     */
    interface IAnimationState {
        [key: string]: number;
    }
    /**
     * A dictionary of properties to animate. Each property is defined by numeric start and end values.
     * Note: end should be either <number> or <KnockourObservable<Number>>.
     */
    interface IAnimationDescriptor {
        [key: string]: {
            start: number;
            end: any;
        };
    }
    /**
     * A class that manages frame tweening for animating numeric properties.
     */
    class Animation {
        /**
         * A polyfill for requestAnimationFrame
         */
        static requestAnimationFramePolyfill: (callback: () => void) => number;
        static cancelAnimationFramePolyfill: (id: number) => void;
        /**
         * A subscribable that notifies subscribers when the animation is explicitly stopped or finishes naturally.
         */
        animationEnded: KnockoutSubscribable<IAnimationState>;
        private _duration;
        private _easingFunction;
        private _stepFunction;
        private _startTime;
        private _endTime;
        private _animatedProperties;
        private _animationStopped;
        private _ignoreFrames;
        /**
         * Creates an animation that tweens some collection of values between start and end values.
         *
         * @param stepFunction callback for every frame of the animation
         * @param animatedProperties a dictionary where the key is the name of the animated property and its value contains the start and end values.
         * @param duration the length of the animation in milliseconds
         * @param easingFunction a Callback that maps time to percentage complete for the animation.
         */
        constructor(stepFunction: (currentAnimationState: IAnimationState) => void, animatedProperties: IAnimationDescriptor, duration?: number, easingFunction?: (percentComplete: number) => number);
        private static _defaultEasing(percentTime);
        /**
         * Starts the animation.
         */
        start(): void;
        /**
         * Stops the animation
         */
        stop(): void;
        /**
         * Whether the animation is stopped (explicitly or the animation ended).
         */
        animationStopped: boolean;
        private _step();
    }
}
