import GraphEntityViewModel = require("./GraphEntityViewModel");
export = Main;
declare module Main {
    var NodeEdgePadding: number;
    var SixtyFPS: number;
    var PanPadding: number;
    var ZoomFactor: number;
    var MinScale: number;
    var MaxScale: number;
    var ZoomToFitPadding: number;
    var AnimatedZoomDuration: number;
    var SnapAnimationDuration: number;
    var MoveAnimationDuration: number;
    var EscAnimationDuration: number;
    var UndoAnimationDuration: number;
    var RedoAnimationDuration: number;
    var MinVelocity: number;
    var DoubleTapInterval: number;
    var InertiaFriction: number;
    var FeedbackAnimationDuration: number;
    var MaxFeedbackInertiaDistance: number;
    var FeedbackFriction: number;
    var MinFeedbackIntertiaVelocity: number;
    var HoldDuration: number;
    var QueueMaxInteractiveLength: number;
    var DefaultSetNodeRectsOpts: GraphEntityViewModel.ISetNodeRectOptions;
    interface GraphWidgetPort {
        Width: number;
        HalfWidth: number;
        Height: number;
        HalfHeight: number;
    }
    interface GraphWidgetConnector {
        SplinePointMax: number;
        SplinePointMin: number;
    }
    var Port: GraphWidgetPort;
    var Connector: GraphWidgetConnector;
    /**
    * Actions the user can take on the graph control.
    */
    enum InteractionAction {
        /**
         * The user double-clicked in a graph control using any mousebutton.
         */
        MouseDoubleClick = 0,
        /**
         * The user pressed any mouse button in the graph control (on an entity, the canvas, etc.)
         */
        MouseDown = 1,
        /**
         * The user released any mouse button in the graph control (on an entity, the canvas, etc.)
         */
        MouseUp = 2,
        /**
         * The user dragged the mouse.
         */
        MouseMove = 3,
        /**
         * The user pressed the delete key.
         */
        DeleteKeyPressed = 4,
        /**
         * The user pressed the escape key.
         */
        EscapeKeyPressed = 5,
        /**
         * The user pressed the 'A' key while holding shift.
         */
        ShiftAPressed = 6,
        /**
         * The user pressed F2.
         */
        F2KeyPressed = 7,
        /**
         * The user pressed 'X' while holding control.
         */
        ControlXPressed = 8,
        /**
         * The user pressed the spacebar key
         */
        SpacebarDown = 9,
        /**
         * The user depressed the spacebar key.
         */
        SpacebarUp = 10,
        /**
         * The user tapped an entity.
         */
        EntityTapped = 11,
        /**
        * The user doubletapped a node.
        */
        NodeDoubleTapped = 12,
        /**
         * The user dragged a node.
         */
        NodeDragged = 13,
        /**
        * The user held a node.
        */
        NodeHeld = 14,
        /**
         * The user dragged the sceen.
         */
        ScreenDragged = 15,
        /**
         * The user pinched the screen.
         */
        ScreenPinched = 16,
        /**
         * The user swiped the screen.
         */
        ScreenSwiped = 17,
        /**
         * The user held the screen.
         */
        ScreenHeld = 18,
        /**
        * The user tapped the screen.
        */
        ScreenTapped = 19,
        /**
         * The user started a gesture.
        */
        GestureStarted = 20,
        /**
         * The user ended a gesture.
        */
        GestureEnded = 21,
    }
    /**
     * What the user's drag intent is.
     */
    enum DraggingMode {
        /**
         * The user is not currently dragging an entity.
         */
        None = 0,
        /**
         * The user is moving graph nodes.
         */
        Entities = 1,
        /**
         * The user is creating a connection.
         */
        Connection = 2,
        /**
         * The user is dragging a selection rectangle.
         */
        SelectionRect = 3,
    }
}
