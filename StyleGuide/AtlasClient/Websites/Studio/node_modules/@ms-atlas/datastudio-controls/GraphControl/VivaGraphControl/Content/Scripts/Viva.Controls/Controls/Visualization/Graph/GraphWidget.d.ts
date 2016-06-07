/// <reference path="../../../../Definitions/hammer.d.ts" />
import KnockoutExtensions = require("../../Base/KnockoutExtensions");
import GraphViewModel = require("./GraphViewModel");
import Base = require("../../Base/Base");
import Promise = require("../../Base/Promise");
import Geometry = require("./Geometry");
import GraphEntityViewModelViva = require("./GraphEntityViewModel");
import GraphViewModelViva = require("./GraphViewModel");
import MoveNodes = require("./Commands/MoveNodes");
import ICommand = require("./Commands/ICommand");
import GraphWidgetConstants = require("./GraphWidget.Constants");
export = Main;
declare module Main {
    interface Interface extends Base.Interface {
    }
    interface InteractionClassesInterface {
        Panning: string;
        Idle: string;
        MovingEntities: string;
        MakingConnection: string;
        MultiSelecting: string;
    }
    var InteractionClasses: InteractionClassesInterface;
    interface XEStateMachineInterface {
        ConnectionPendingThreshhold: number;
    }
    var XEStateMachine: {
        ConnectionPendingThreshhold: number;
    };
    /**
     * Has all the information of how to zooming. How much to zoom and around what point.
     */
    interface IZoomInfo {
        /**
         * The scale in the zoom operation.
         */
        scale: number;
        /**
         * The point about which to zoom.
         */
        location: Geometry.IPoint;
    }
    /**
     * The size of scrollbars given Browser, styling, etc.
     */
    interface IScrollBarSize {
        /**
         * The width of vertical scrollbars.
         */
        vertical: number;
        /**
         * The height of horizontal scrollbars.
         */
        horizontal: number;
    }
    /**
     * Used in our IE marker bug workaround. Pass this to the path binding.
     */
    interface IPathSpec {
        /**
         * The 'd' attribute that goes on the path element.
         */
        path: KnockoutObservable<string>;
        /**
         * The 'style' attribute that goes on the path element.
         */
        style: KnockoutObservable<string>;
        /**
         * The 'event' attribute that goes on the path element.
         */
        events: KnockoutObservable<string>;
        /**
         * The flag, indicates whether the path needs to have markers on it or not.
         */
        needMarkers: KnockoutObservable<boolean>;
        /**
         * The 'begin-marker' attribute that goes on the path element.
         */
        beginMarker: KnockoutObservable<string>;
        /**
         * The 'end-marker' attribute that goes on the path element.
         */
        endMarker: KnockoutObservable<string>;
        /**
         * The event handlers, defined for the path element.
         */
        event: KnockoutObservable<string>;
        /**
         * The 'class' attribute that goes on the path element.
         */
        cssClass: KnockoutObservable<string>;
        /**
         * To work around another IE bug where markers disappear
         */
        scale: KnockoutObservable<number>;
    }
    /**
    * A wrapper for registering and unregistering HammerEvents.
    */
    class HammerEventListenerSubscription implements KnockoutDisposable {
        private _handler;
        private _instance;
        private _eventType;
        /**
         * Constructs a wrapper for HammerEvent listeners that can remove them on dispose.
         *
         * @param element The element on which to attach the listener.
         * @param eventType The type of event to register (e.g. pinch, tap, etc.)
         * @param handler The callback to fire when the event occurs.
         * @param options The options to supply to the Hammer constructor
         */
        constructor(element: HTMLElement, eventType: string, handler: (e: HammerEvent) => void, options?: any);
        /**
         * Removes the registered event listeners.
         */
        dispose(): void;
    }
    /**
     * The graph widget instantiates high-level representations of entities that have
     * additional computeds and state.
     */
    class GraphEntityViewModel {
        /**
         * The inner entity this ViewModel wraps around.
         */
        entity: GraphEntityViewModelViva.GraphEntity;
        /**
         * Objects to be disposed.
         */
        private _disposables;
        /**
         * Set according to lineage display logic. If true, the entity should have a low opacity.
         */
        lineageDimmed: KnockoutObservable<boolean>;
        /**
         * Creates a graph entity. This class is abstract, do not instantiate it.
         * @param entity The entity this view model wraps around.
         */
        constructor(entity: GraphEntityViewModelViva.GraphEntity);
        /**
         * Adds an object to be disposed during cleanup.
         * @param disposable The object to be be disposed later.
         */
        addDisposableToCleanup(disposable: KnockoutDisposable): void;
        /**
         * Returns whether or not this entity completely resides in rect. Overloaded in child classes.
         * @param rect The enclosing rect to test.
         * @return true if this entity lies in the enclosing rect. False if not.
         */
        liesInRect(rect: Geometry.IRect): boolean;
        /**
         * Overloaded in child classes.
         */
        dispose(): void;
    }
    /**
     * Wraps graph ports to contain the additional computeds needed to correctly render ports.
     */
    class GraphNodePortViewModel extends GraphEntityViewModel {
        /**
         * The port entity reference.
         */
        port: GraphEntityViewModelViva.GraphNodePort;
        /**
         * The X coordinate of the port, relative to the host node X coordinate.
         */
        hostRelativeX: KnockoutObservable<number>;
        /**
         * The Y coordinate of the port, relative to the host node Y coordinate.
         */
        hostRelativeY: KnockoutObservable<number>;
        /**
         * The absolute X coordinate of the port on the canvas.
         */
        absoluteX: KnockoutObservable<number>;
        /**
         * The absolute Y coordinate of the port on the canvas.
         */
        absoluteY: KnockoutObservable<number>;
        private _displayX;
        private _displayY;
        private _displayR;
        private _displayCx;
        private _displayCy;
        private _displayClass;
        /**
         * Creates a graph node port view model.
         * @param graphPort The port this view model wraps around.
         */
        constructor(graphPort: GraphEntityViewModelViva.GraphNodePort);
        /**
         * Disposes computeds and subscriptions.
         */
        dispose(): void;
    }
    /**
     * Wraps graph nodes to contain the additional computeds needed to correctly render nodes.
     */
    class GraphNodeViewModel extends GraphEntityViewModel {
        /**
         * A typed alias for this.entity.
         */
        graphNode: GraphEntityViewModelViva.GraphNode;
        /**
         * The uncommitted (e.g. the user is dragging them) x coordinate of the top-left of the graph node.
         */
        x: KnockoutObservable<number>;
        /**
         * The uncommitted y coordinate of the top-left of the graph node.
         */
        y: KnockoutObservable<number>;
        /**
         * The input port on the node.
         */
        inputPort: GraphNodePortViewModel;
        /**
         * The output ports on the node.
         */
        outputPorts: KnockoutExtensions.IMutableObservableMap<GraphNodePortViewModel>;
        /**
         * The height of the graph node.
         */
        height: KnockoutObservable<number>;
        /**
         * The width of the graph node.
         */
        width: KnockoutObservable<number>;
        /**
         * The committed x coordinate of the top-left of the graph node.
         */
        committedX: KnockoutObservable<number>;
        /**
         * The committed y coordinate of the top-left of the graph node.
         */
        committedY: KnockoutObservable<number>;
        /**
         * The committed width of the graph node.
         */
        committedWidth: KnockoutObservable<number>;
        /**
         * The committed height of the graph node.
         */
        committedHeight: KnockoutObservable<number>;
        /**
         * The candidate x coordinate of where the top-left of the graph node would be in a potential uncommitted layout.
         */
        candidateX: KnockoutObservable<number>;
        /**
         * The candidate y coordinate of where the top-left of the graph node would be in a potential uncommitted layout.
         */
        candidateY: KnockoutObservable<number>;
        /**
         * The candidate width of the graph node in a potentially uncommitted layout.
         */
        candidateWidth: KnockoutObservable<number>;
        /**
         * The candidate height of the graph node in a potentially uncommitted layout.
         */
        candidateHeight: KnockoutObservable<number>;
        /**
         * When the user is dragging, this is the x coordinate where the top-left of the graph node should be.
         */
        draggedX: KnockoutObservable<number>;
        /**
         * When the user is dragging, this is the y coordinate where the top-left of the graph node should be.
         */
        draggedY: KnockoutObservable<number>;
        /**
         * Whether or not the node's x and y coordinates are equal to its committed x and y coordinates.
         */
        committed: KnockoutComputed<boolean>;
        /**
         * When true, this node is currently in the process of dynamically animating towards its committed x and y coordinates.
         */
        reverting: KnockoutObservable<boolean>;
        /**
         * When the user is dragging, whether or not the graph node's draggedX and draggedY are equal to its uncommitted x and y.
         * This can occur when the nodes have to move out of the way to prevent overlaps, as well as snapping to grid
         * when the user hovers.
         */
        dragAdjusted: KnockoutComputed<boolean>;
        /**
         * Whether the node is hovered as a source node during the process of edge creation or not.
         */
        newEdgeDraftSource: KnockoutObservable<boolean>;
        /**
         * Whether the node is hovered as a target node during the process of edge creation or not.
         */
        newEdgeDraftTarget: KnockoutObservable<boolean>;
        /**
         * Whether the node is hovered.
         */
        hovered: KnockoutObservable<boolean>;
        /**
         * Currently choosen graph style skin. Set by looking at parent widget ViewModel.
         */
        styleSkin: KnockoutObservable<GraphViewModelViva.GraphEditorSkinStyle>;
        /**
         * Whether the node is hovered during the process of edge creation or not.
         */
        acceptsNewEdge: KnockoutObservable<boolean>;
        private _displayHeight;
        private _displayWidth;
        private _displayClass;
        private _displayX;
        private _displayY;
        private _xSubscription;
        private _ySubscription;
        private _heightSubscription;
        private _widthSubscription;
        private _moveAnimation;
        private _endDragAnimation;
        private _mouseMoveAnimationFrame;
        /**
         * When true, this node is currently in the process of dynamically animating towards its draggedX and draggedY coordinates.
         */
        private _dragUnadjusting;
        /**
        * Snaps a value to a given grid with this node's parent widget's grid resolution.
        *
        * @param value The value to be snapped
        * @return The snapped value.
        */
        snappedValue: (value: number) => number;
        /**
         * Creates a wrapper view model for graph nodes. This wrapper contains extra state needed for interacting
         * with the graph control.
         *
         * @param graphNode The inner graph node this wraps.
         * @param parentWidget The graph control using this node.
         */
        constructor(graphNode: GraphEntityViewModelViva.GraphNode, parentWidget: Widget);
        private _createPorts(graphNode);
        private _topOutPort;
        private _bottomOutPort;
        private _leftOutPort;
        private _rightOutPort;
        /**
         * Tears down this node.
         */
        dispose(): void;
        /**
         * Returns true if this graph nodes lies completely in the passed rectangle.
         *
         * @param rect The enclosing rectangle.
         * @return Returns true if the graph node in the rectangle. False if not.
         */
        liesInRect(rect: Geometry.IRect): boolean;
        /**
         * Signals this node is ending its move operation.
         */
        endMove(): void;
        /**
        * Cancels this node's current move animation.
        */
        stopAnimation(): void;
        /**
        * Animates this node to its candidate layout position.
        */
        applyCandidate(): void;
        /**
        * Animates this node from its current position to where the user actually dragged it.
        */
        dragUnadjust(): void;
        /**
         * Animate this node from its current position to its last committed position.
         */
        revert(duration?: number): Promise.Promise;
        /**
         * Moves this node from its current position to its last committed position.
         */
        revertNoAnimation(): void;
        /**
         * Animate this node from its current position to its last committed position, stopping any previous animation if necessary.
         */
        revertStatic(duration?: number): void;
        /**
         * Changes the internal graphNode viewmodel of this node while maintaining the external x and y cordinates.
         *
         * @param x The desired internal graphNode x cordinate.
         * @param y The desired internal graphnode y cordinate.
         */
        commit(x: number, y: number, width: number, height: number): void;
        /**
         * Helper for creating animation from the current x and y coordinates to a destination.
         *
         * @param destinationX Either a number or a KnockoutObservable<number>.
         * @param destinationY Either a number or a KnockoutObservable<number>.
         * @param duration How long the animation should last in milliseconds.
         * @return The new move Animation.
         */
        private _createMoveAnimation(destinationX, destinationY, destinationWidth, destinationHeight, duration);
        /**
        * Snaps a value to a given grid with a specified resolution.
        *
        * @param val The value to be snapped.
        * @param movingAllowed Whether or not the graph is read-only.
        * @param gridResolution The resolution of the grid.
        * @return The snapped value.
        */
        private _snapToGrid(val, movingAllowed, gridResolution);
        /**
         * Re-calculates all ports' relative and absolute position.
         */
        private _layoutAllPorts();
        private _setInputPortRelativePosition();
        private _setOutputPortRelativePosition();
        private _setPortsAbsoluteXPosition();
        private _setPortsAbsoluteYPosition();
    }
    /**
     * Wrapper containing state needed for rendering edges in graph widget.
     */
    class GraphEdgeViewModel extends GraphEntityViewModel {
        /**
         * The inner graph edge.
         */
        graphEdge: GraphEntityViewModelViva.GraphEdge;
        /**
         * The start node from which this edge egresses.
         */
        startNode: GraphNodeViewModel;
        /**
         * The end node to which this edge ingresses.
         */
        endNode: GraphNodeViewModel;
        /**
         * The computed x,y for the egress point.
         */
        startPoint: KnockoutComputed<Geometry.IPoint>;
        /**
         * The computed x,y for the ingress point.
         */
        endPoint: KnockoutComputed<Geometry.IPoint>;
        /**
         * The path that defines this edge's SVG path d attribute.
         */
        path: KnockoutComputed<string>;
        /**
         * The flag indicating whether the edge path need markers or not.
         */
        needMarkers: KnockoutComputed<boolean>;
        /**
         * Currently choosen graph style skin. Set by looking at parent widget ViewModel.
         */
        private _styleSkin;
        /**
         * The computed class for this edge's line.
         */
        private _lineDisplayClass;
        /**
         * The computed stroke-dasharray attribute for this edge's line.
         */
        private _strokeDashArray;
        /**
         * The computed stroke-width attribute for this edge's line.
         */
        private _strokeWidth;
        /**
         * The computed start marker attribute for this edge.
         */
        private _startMarker;
        /**
         * The computed end marker attribute for this edge.
         */
        private _endMarker;
        /**
         * Creates a wrapper that contains extra state for rendering edges in the graph widget.
         *
         * @param graphEdge The edge this wrapper wraps.
         * @param startNode The node from which this edge egresses.
         * @param endNode The node to which this edge ingresses.
         */
        constructor(graphEdge: GraphEntityViewModelViva.GraphEdge, startNode: GraphNodeViewModel, endNode: GraphNodeViewModel, parentWidget: Widget);
        /**
         * Dispose of this edge wrapper.
         */
        dispose(): void;
        /**
         * Returns whether this edge lies in the passed rectangle or not.
         *
         * @param rect The bounding rectangle to test.
         * @return True if this lies in the passed rectangle. False if not.
         */
        liesInRect(rect: Geometry.IRect): boolean;
    }
    class MoveNodesCommit {
        /**
         * The positions of all graph nodes that were explicitly moved by this commit.
         */
        movedNodePositions: StringMap<Geometry.IRect>;
        /**
         * A promise that's resolved when this commit is complete.
         */
        promise: Promise.Promise;
        /**
         * The command in the widget's undo/redo queue.
         */
        command: MoveNodes.MoveNodesCommand;
        /**
         * This commit's parent widget.
         */
        widget: Widget;
        private _deferred;
        private _draggingNodeUnderCursor;
        private _canceled;
        constructor(movedNodePositions: StringMap<Geometry.IRect>, draggingNodeUnderCursor: string, command: MoveNodes.MoveNodesCommand, widget: Widget);
        /**
         * Handles whether or not a specified graphNode should animate or just commit, given the current state of the node and the widget.
         * @param graphNode The graphNodeViewModel.
         * @return True if the node should move.
         */
        shouldAnimate(graphNode: GraphNodeViewModel): boolean;
        /**
         * Fetches a candidate and applies it.
         */
        execute: () => void;
        /**
         * Cancels this commit.
         */
        cancel: () => void;
        /**
         * Returns true when this commit causses overlaps.
         */
        static causesOverlaps(movedNodePositions: StringMap<Geometry.IRect>, widget: Widget): boolean;
        /**
        * Searches through the widget's commitQueue and returns true if this id is
        * ever explicitly moved by any of the commits.
        *
        * @param id Id of the node
        * @return True if this id is in the pushingIds of the queue
        */
        private _inQueue(id);
        private _done;
        /**
        * Handler for getLayoutNoOverlaps. Should only be called in MoveNodesCommit.exectute().
        */
        private _fail;
    }
    class SynchronousMoveCommit extends MoveNodesCommit {
        private _syncDeferred;
        private _rects;
        constructor(rects: StringMap<GraphEntityViewModelViva.IUpdateRect>, command: MoveNodes.MoveNodesCommand, widget: Widget);
        execute: () => void;
    }
    /**
     * Utility class for edges creation
     */
    class EdgeCreator {
        /**
         * Output port used for the edge creation.
         */
        startPort: GraphEntityViewModelViva.OutputPort;
        /**
         * Input port used for the edge creation.
         */
        endPort: GraphEntityViewModelViva.InputPort;
        /**
         * X-coordinate of the edge draft start point.
         */
        x1: KnockoutObservable<number>;
        /**
         * Y-coordinate of the edge draft start point.
         */
        y1: KnockoutObservable<number>;
        /**
         * X-coordinate of the edge draft end point.
         */
        x2: KnockoutObservable<number>;
        /**
         * Y-coordinate of the edge draft end point.
         */
        y2: KnockoutObservable<number>;
        /**
         * A flag indicates whether the edge draft line is a preview of what the edge would look like upon creation completion.
         */
        isPreview: KnockoutObservable<boolean>;
        /**
         * Svg translation applied.
         */
        translation: KnockoutComputed<string>;
        /**
         * A flag indicates whether the edge creator currently working on an edge creation.
         */
        creatingNewEdge: KnockoutObservable<boolean>;
        /**
         * A flag to indicate if the connector line is visible or not
         */
        visible: KnockoutObservable<boolean>;
        /**
         * Creates an edge creator that manages state when connecting nodes.
         */
        constructor();
        onMouseMove(x: number, y: number, entity: GraphEntityViewModelViva.GraphEntity): void;
        /**
         * Resets the state of the edge creator to "nothing is being created" state.
         */
        reset(): void;
        /**
         * Starts an Edge creation.
         * @param source The first port for the Edge
         */
        startEdgeCreation(source: GraphNodePortViewModel): void;
        /**
         * Ends an Edge creation.
         * @param destination The entity the user ended the Edge on. If the entity is an input port or a node, the Edge will finalize.
         * @param x The domain x coordinate where the Edge ended.
         * @param y The domain y coordinate where the Edge ended.
         */
        endEdgeCreation(destination: GraphEntityViewModel, x: number, y: number): GraphEntityViewModelViva.GraphEdge;
    }
    /**
     * The widget for viewing and manipulating graphs.
     */
    class Widget extends Base.Widget implements Interface {
        private static scrollBarSizes;
        /**
         * The manager of edge creation.
         */
        edgeCreator: EdgeCreator;
        /**
         * The manager of selection. Don't disturb the selection manager.
         */
        selectionManager: SelectionManager;
        /**
         * The set of all graph node view models in this graph.
         */
        graphNodes: KnockoutExtensions.IObservableMap<GraphNodeViewModel>;
        /**
         * The set of all graph edge view models in this graph.
         */
        graphEdges: KnockoutExtensions.IObservableMap<GraphEdgeViewModel>;
        /**
         * The union of all graph node and edge view models.
         */
        graphEntities: KnockoutExtensions.IObservableMap<GraphEntityViewModel>;
        /**
         * The state machine that handles user interactions. You shouldn't need to touch this.
         */
        interactionStateMachine: InteractionStateMachine;
        /**
         * How zoomed in the user is.
         */
        scale: KnockoutObservable<number>;
        /**
         * Log_1.1(scale)
         */
        logScale: KnockoutComputed<number>;
        edgesJoinNodesOnPorts: KnockoutComputed<boolean>;
        /**
         * Whether or not the nodes are locked.
         */
        nodesLocked: KnockoutObservable<boolean>;
        /**
         * Whether or not we're currently committing.
         */
        committing: KnockoutObservable<boolean>;
        /**
         * Queued commits.
         */
        commitQueue: MoveNodesCommit[];
        /**
         * Map of all node locations at the beginning of a move.
         */
        nodeMoveStartLocations: StringMap<Geometry.IRect>;
        /**
         * Currently choosen graph style skin.
         */
        styleSkin: KnockoutObservable<GraphViewModelViva.GraphEditorSkinStyle>;
        /**
         * Create the context menu for graphEntityViewModel because of the evt event.
         * The context menu part is handled by the Impl layer, hence it is expected that the Impl layer will inject the method after creating the widget object.
         */
        createContextMenu: (evt: JQueryEventObject, graphEntityViewModel: GraphEntityViewModel) => void;
        private _mouseCapture;
        private _matrixTransform;
        private _movingGraphNodes;
        private _draggingNodeUnderCursor;
        private _lastMove;
        private _nodesMoved;
        private _candidatePromise;
        private _holdTimeout;
        private _currentCommit;
        private _graphNodesById;
        private _graphEdgesById;
        private _lastAnimatedScale;
        private _undoStack;
        private _redoStack;
        private _scrollBarSizes;
        private _viewUpdatingHorizontalScrollbar;
        private _viewUpdatingVerticalScrollbar;
        private _mouseMoveAnimationFrame;
        private _touchMoveAnimationFrame;
        private _touchZoomAnimationFrame;
        private _defaultTouchAction;
        private _currentPanZoomAnimation;
        private _currentPanZoomAnimationFinishedSubscription;
        private _endFeedbackAnimation;
        private _overlayLeft;
        private _overlayRight;
        private _overlayBottom;
        private _overlayTop;
        private _intertiaVelocityX;
        private _intertiaVelocityY;
        private _lastInertiaTime;
        private _inertiaAnimationFrame;
        private _inertiaPanningSubscription;
        private _topLeft;
        private _classes;
        private _lastContainerWidth;
        private _lastContainerHeight;
        /**
         * Creates a new instance of the Widget.
         *
         * @param element The element to apply the widget to.
         * @param options The view model to use, as a strongly typed GraphViewModel.ViewModel instance.
         * @param viewModelType The view model type expected. Used to create a default view model instance if the options param is an un-typed object instance. If null, will use the widget GraphViewModel.ViewModel type.
         */
        constructor(element: JQuery, options?: GraphViewModel.ViewModel, createOptions?: Base.CreateOptions);
        /**
         * Creates a new instance of the Widget.
         *
         * @param element The element to apply the widget to.
         * @param options The view model to use, as an un-typed object with key/value pairs that match the view model properties.
         * @param viewModelType The view model type expected. Used to create a default view model instance if the options param is an un-typed object instance. If null, will use the widget GraphViewModel.ViewModel type.
         */
        constructor(element: JQuery, options?: Object, createOptions?: Base.CreateOptions);
        /**
         * Handler for the external viewmodel function.
         */
        setNodeRects: (rects: StringMap<GraphEntityViewModelViva.IUpdateRect>, options: GraphEntityViewModelViva.ISetNodeRectOptions) => Promise.Promise;
        /**
         * Handler for the external viewmodel function.
         */
        getNodeRects: (ids?: string[]) => StringMap<Geometry.IRect>;
        /**
         * See interface.
         */
        dispose(): void;
        /**
         * Updates the move start locations.
         */
        private updateMoveStartLocations();
        /**
         * Returns the height of horizontal scroll bars and the width of vertical scrollbars (i.e. the invariant dimension).
         *
         * @return horizontal Contains the height of horizontal scrollbars and vertical contains the width of vertical scrollbars.
         */
        private static ScrollBarSizes;
        /**
         * Returns the dimensions of the graph view in client coordinates.
         *
         * @return The x and y offset on the page as well as the height and width of the view in client coordinates.
         */
        viewDimensions: Geometry.IRect;
        /**
         * See interface.
         */
        options: GraphViewModel.ViewModel;
        /**
         * The root SVG container for the connections.
         */
        private _svgRootElement;
        /**
         * The element containing the SVG scale and pan transforms.
         */
        private _transformElement;
        /**
         * The element containing and transforming the div overlays.
         */
        private _graphOverlay;
        /**
         * Returns the dimensions of the entire experiment in domain coordinates
         */
        private _graphBounds;
        /**
         * Converts user space screen coordinates to graph coordinates.
         *
         * @param clientPoint The point to convert in screen coordinates.
         * @return The input point in graph coordinates.
         */
        clientToDomainCoordinates(clientPoint: Geometry.IPoint): Geometry.IPoint;
        /**
         * Zooms and pans to at a specified scale centered around a specific point.
         *
         * @param clientDx The amount to pan in the x direction in client-space coordinates.
         * @param clientDy The amount to pan in the y direction in client-space coordinates.
         * @param domainCoords The domain coordinates to zoom about.
         * @param targetScale The scale to zoom to.
         */
        pinchZoom(clientDx: number, clientDy: number, domainCoords: Geometry.IPoint, targetScale: number): void;
        /**
        * Starts inertia at specified velocities.
        *
        * @param inertiaVelocityX Signed velocity in the x direction.
        * @param inertiaVelocityY Signed velocity in the y direction.
        */
        startInertia(inertiaVelocityX: number, inertiaVelocityY: number): void;
        /**
         * Pans the user's view by some delta in client coordinates.
         *
         * @param clientDx the amount to pan in the x direction in client-space coordinates
         * @param clientDy the amount to pan in the y direction in client-space coordinates
         */
        pan(clientDx: number, clientDy: number): void;
        /**
         * Performs a pan with feedback (pan boundry with visible spring).
         *
         * @param clientDx the amount to pan in the x direction in client-space coordinates
         * @param clientDy the amount to pan in the y direction in client-space coordinates
         */
        panWithFeedback(clientDx: number, clientDy: number): void;
        /**
         * Returns the maximum feedback distance from all directions.
         * @return The maximum feedback distance for all directions.
         */
        maxFeedbackDistance(): number;
        /**
         * Returns whether or not any feedback is currently showing.
         * @return true if feedback is currently showing.
         */
        feedbackShowing(): boolean;
        /**
         * Animates after feedback is finished.
         * @param callback Optional function to be called once feedback has animated back into place.
         */
        animateEndFeedback(callback?: () => void): void;
        /**
         * Call this when the user starts dragging entities.
         */
        beginMoveSelectedEntities(): void;
        /**
         * Call this when the user drags entities.
         *
         * @param domainDx The amount the mouse moved since the last update in domain coordinates in the x direction.
         * @param domainDy The amount the mouse moved since the last update in domain coordinates in the y direction.
         */
        moveSelectedEntities(domainDx: number, domainDy: number): void;
        /**
         * Call this when the user cancels moving selected entities.
         */
        cancelMoveSelectedEntities(): void;
        /**
         * Call this when the user is done dragging the selected entities around.
         */
        endMoveSelectedEntities(): void;
        /**
         * Selects all graph nodes and edges.
         */
        selectAllEntities(): void;
        /**
         * Starts edge creation from the specified port.
         * @param domainCoords Source port to create edge from.
         */
        startEdgeCreation(source: GraphNodePortViewModel): void;
        /**
         * Tracks the movement of the edge draft from the source port to target node.
         * @param domainCoords Current position of mouse pointer.
         */
        moveConnection(domainCoords: Geometry.IPoint): void;
        /**
         * Cancels edge creation process.
         */
        cancelEdgeCreation(): void;
        /**
         * Finishes edge creation process, adds created edge to the map of edges.
         */
        endEdgeCreation(destination: GraphEntityViewModel, domainCoords: Geometry.IPoint): void;
        /**
         * Computes the canvas pan limits which are used both for scroll bar elevator sizing and to prevent the user from getting lost while they are panning.
         * These limits are a function of where the user is currently viewing and the bounds of the graph.
         *
         * @param scale The scale for which to get the pan limits.
         * @return The pan limits denoted by the top left corner (x,y) and the panning area (width,height)
         */
        getPanLimits(scale?: number): Geometry.IRect;
        /**
         * Zooms in or out about the center of the graph
         *
         * @param steps The number of steps to zoom. Positive zooms in, negative out.
         * @param animate Whether the zoom should be animated or instantaneous.
         */
        private _zoomAboutCenter(steps, animate?);
        /**
         * Zooms to a point given a scale.
         *
         * @param targetScale The scale to be zoomed to.
         * @param domainCoords The point to be zoomed about.
         */
        zoomAboutPoint(targetScale: number, domainCoords: Geometry.IPoint): void;
        /**
         * Performs a zoom to fit with animation.
         */
        private _zoomToFitWithAnimation();
        /**
         * Animates such that target becomes the top left corner of the control at the specified scale.
         *
         * @param target The point that will become the new top-left corner.
         * @param targetScale The desired scale.
         */
        animateToLocation(target: Geometry.IPoint, targetScale?: number): Promise.Promise;
        /**
         * Executes a command, pushes it onto the undo stack, and clears the redo stack.
         *
         * @param command the command to run
         */
        executeNewCommand(command: ICommand.ICommand): void;
        /**
         * Pushes it onto the undo stack, and clears the redo stack.
         *
         * @param command the command to push
         */
        pushNewCommand(command: ICommand.ICommand): void;
        /**
         * Pops the top command off the undo stack, undoes it, and pushes it onto the redo stack.
         */
        undo(): void;
        /**
         * Pops the top command off the undo stack, executes it, and pushes it on the undo stack.
         */
        redo(): void;
        /**
         * Brings a graph node into view and selects it.
         *
         * @param graphNodeViewModel the view model for the graph node to focus on
         */
        focusOnGraphNode(graphNodeViewModel: GraphNodeViewModel): void;
        /**
         * Animates the desired rectangular region into view. If already in view, this is a no-op.
         * The method attempts to make least amount of translation as well as scaling to get the rect.
         *
         * @param rect the rectangle to bring into view
         */
        bringRectIntoView(rect: Geometry.IRect): Promise.Promise;
        /**
         * Handles requesting only one candidate from the server at a time.
         */
        private _requestCandidate(changedNodes);
        /**
         * Cancels a previously requested candidate.
         */
        private _cancelRequestCandidate();
        /**
         * Synchronizes the scrollbar positions with the view dimensions and where the user is looking.
         */
        private _updateScrollbars;
        /**
         * This is our primitive for setting view. The user passes the domainX and Y of the top
         * left corner of the screen they want and the zoom level they want. This should be the only
         * function that writes to the transform matrix.
         *
         * @param domainCoords The desired top left corner of the screen in domain units.
         * @param scale The desired scale.
         */
        private _setOriginAndZoom(domainCoords, scale?);
        /**
         * Immediately zooms the control about a point without animation.
         *
         * @param targetScale the desired scale after the zoom operation
         * @param domainCoords the point about which to zoom
         */
        private _zoomWithoutAnimation(targetScale, domainCoords);
        /**
         * Calculates the new top left of the view and scale given a desired scale and point around which to zoom.
         *
         * @param targetScale the desired scale the view should have
         * @param domainCoords the point about which to zoom in or out
         */
        private _zoomToPoint(targetScale, domainCoords);
        /**
         * Computes the top left corner and scale for zoom to fit.
         *
         * @return The scale and top-left corner for a zoom-to-fit operation.
         */
        private _computeZoomToFitLocation();
        /**
         * Computes the new scale sooming in by steps number of steps (which can be negative for zoom out).
         * This computed scale is relative to the current scale.
         *
         * @param steps the number of steps to zoom in our out. In is positive, out is negative.
         * @return the new scale that will result from zooming in or out.
         */
        private _calculateNewZoom(steps);
        /**
        * Moves the feedback for each specified direction in client cordinates
        *
        * @param top Change in feedback from the top in px
        * @param right Change in feedback from the right in px
        * @param bottom Change in feedback from the bottom in px
        * @param left Change in feedback from the left
        */
        private _moveFeedback(top, right, bottom, left);
        /**
        * Sets the feedback in each specified direction in client cordinates
        *
        * @param top Feedback from the top in px
        * @param right Feedback from the right in px
        * @param bottom Feedback from the bottom in px
        * @param left Feedback from the left in px
        */
        private _setFeedback(top, right, bottom, left);
        /**
         * Sets up event listeners for interacting with the control. They're added for auto-disposal.
         */
        private _setupEventListeners();
        private _updateInputPortsConnectedState();
        /**
         * Handles a candidate layout being requested.
         * @param pushingNodes The nodes that should move as little as possible.
         */
        private _onRequestCandidate(pushingNodes);
        /**
         * Reverts all nodes to their committed position (except for those currently being dragged).
         */
        private _revertNodes();
        /**
         * Handles the user committing their layout.
         */
        private _onCommit(pushingNodes, command);
        /**
         * Adds a commit to the existing queue or runs it immediately.
         */
        private _addCommit(commit);
        /**
        * Returns whether or not autolayout is disabled.
        * @return True if autolayout is disabled.
        */
        private _layoutDisabled();
        /**
         * See base.
         */
        _getElementToFocus(): Element;
        /**
         * Callback for when the user moves the mouse after pressing a mouse button.
         */
        _dragMouseMove: (e: MouseEvent) => void;
        /**
         * Callback for when the user releases a mouse button.
         *
         * @param e The mouse event.
         */
        _dragMouseUp: (e: MouseEvent) => void;
        /**
         * Callback for when the user hovers a graph entity with a mouse.
         *
         * @param graphEntity the view model backing the thing which they hovered.
         */
        _entityMouseEnter: (graphEntity: GraphEntityViewModel) => void;
        /**
         * Callback for when the user leaves a hover off a graph entity with a mouse.
         *
         * @param graphEntity the view model backing the thing which they left the mouse hover.
         */
        _entityMouseLeave: (graphEntity: GraphEntityViewModel) => void;
        /**
         * Callback for when the user double-clicks on a graph entity.
         *
         * @param graphEntity the view model backing the thing on which double-clicked the mouse button.
         */
        _entityMouseDoubleClick: (graphEntity: GraphEntityViewModel) => void;
        /**
         * Callback for when the user right-clicks on a graph entiry.
         * Long touch (hammer event press) also defaults to right-click.
         *
         * @param graphEntity the view model backing the thing which was right-clicked.
         * @param evt the event object defining the right-click.
         */
        _entityMouseRightClick: (graphEntity: GraphEntityViewModel, evt: JQueryEventObject) => void;
        /**
         * Callback for when the user presses a mouse button on a graph entity.
         *
         * @param graphEntity the view model backing the thing on which they pressed the mouse button.
         * @param e The mouse event.
         */
        _entityMouseDown: (graphEntity: GraphEntityViewModel, e: MouseEvent) => boolean;
        /**
         * Callback for then the user releases a mouse button on a graph entity.
         *
         * @param graphEntity the view model backing the thing on which they released the mouse button.
         * @param e The mouse event.
         */
        _entityMouseUp: (graphEntity: GraphEntityViewModel, e: MouseEvent) => void;
        /**
         * Callback for when the user presses a mouse button on the canvas.
         *
         * @param canvasViewModel Unused, but Knockout passes view models first in its event binding.
         * @param e The mouse event.
         */
        _canvasMouseDown: (canvasViewModel: GraphViewModel.ViewModel, e: MouseEvent) => boolean;
        /**
         * Callback for when the user releases a mouse button on the canvas.
         *
         * @param canvasViewModel Unused, but Knockout passes view models first in its event binding.
         * @param e The mouse event.
         */
        _canvasMouseUp: (canvasViewModel: GraphViewModel.ViewModel, e: MouseEvent) => void;
        /**
         * Callback for when the user scrolls the mouse wheel.
         *
         * The default behavior is for the mouse wheel to zoom the graph control in or out.
         * If the disableMouseWheelZoom option is set to true, the mouse wheel will instead pan the graph control up or down.
         *
         * @param e The mouse wheel event. This could be WheelEvent or MouseWheelEvent, depending on what the browser supports.
         */
        _mouseWheel: (e: any) => void;
        /**
         * Callback for when the graph control resizes for any reason.
         */
        _resize: () => void;
        /**
         * Callback for when the user mousedowns on the scrollbar. Stops events from propagating.
         *
         * @param viewModel The view model of the graph control.
         * @param e The mouse event.
         * @return Returns to true to tell Knockout to not prevent default.
         */
        _scrollBarMouseDown: (viewModel: any, e: MouseEvent) => boolean;
        /**
         * Callback for when the user slides the horizontal scrollbar.
         *
         * @param e The scroll event.
         */
        _scrollX: (e: Event) => void;
        /**
         * Callback for when the user slides the vertical scrollbar.
         *
         * @param e The scroll event.
         */
        _scrollY: (e: Event) => void;
        /**
         * Handles key down events when the user presses a keyboard key.
         *
         * @param e The keyboard event.
         */
        _keyDown: (e: KeyboardEvent) => void;
        /**
         * Callback for when the user depresses a keyboard key.
         *
         * @param e The keyboard event.
         */
        _keyUp: (e: KeyboardEvent) => void;
        /**
        * Handles the beginning and end of all gestures.
        *
        * @param e The gesture event
        */
        _onGesture: (e: HammerEvent) => void;
        /**
         * Zooms and pans using a Hammer pinch event.
         *
         * @param e The pinch event
         */
        _onPinch: (e: HammerEvent) => void;
        /**
         * Handles the screen being dragged.
         *
         * @param e The drag event
         */
        _onDrag: (e: HammerEvent) => void;
        /**
        * Handles the screen being tapped.
        *
        * @param e The tap event
        */
        _onTap: (e: HammerEvent) => void;
        /**
        * Pans with inertia using a Hammer swipe event.
        *
        * @param e The swipe event
        */
        _onSwipe: (e: HammerEvent) => void;
        /**
        * Handles a hold on the screen.
        *
        * @param e The hold event
        */
        _onHold: (e: HammerEvent) => void;
        /**
         * Handles a node being dragged.
         *
         * @param viewModel The GraphNodeViewModel of the node being handled
         * @param e The drag event
         */
        _onNodeDrag: (viewModel: GraphNodeViewModel, e: HammerEvent) => void;
        /**
        * Handles a node being swiped.
        *
        * @param viewModel The GraphNodeViewModel of the node being handled
        * @param e The swipe event
        */
        _onNodeSwipe: (viewModel: GraphNodeViewModel, e: HammerEvent) => void;
        /**
         * Handles a tap on an entity.
         *
         * @param viewModel The GraphEntityViewModel of the entity being handled
         * @param e The tap event
         */
        _onEntityTap: (viewModel: GraphEntityViewModel, e: HammerEvent) => void;
        /**
        * Handles a doubletap on an entity.
        * Note: when the user doubletaps, only the doubletap event will fire, not a second tap event.
        *
        * @param viewModel The GraphEntityViewModel of the entity being doubletapped
        * @param e The doubletap event
        */
        _onEntityDoubleTap: (viewModel: GraphEntityViewModel, e: HammerEvent) => void;
        /**
         * Returns true if the specified event's target or any of its ancestors has the 'msportalfx-graph-ignore-input' CSS class
         *
         * @param e The event with the target element to check
         * @return A Boolean indicating whether the Graph should ignore the event
         */
        _shouldIgnoreEvent: (e: Event) => boolean;
        /**
         * Returns a string with the name of the mouse wheel event handler to listen to
         *
         * @param el The element to attach the event listener to
         * @return A string with the name of the event to listen to
         */
        _getMouseWheelEventName: (el: any) => string;
        /**
         * Dismisses all open dock balloons.
         */
        _dismissAllBalloons: () => void;
        private _forwardAdjacencyList;
        private _reverseAdjacencyList;
        /**
         * Create forward and backward adjacency list for the directed graph
         */
        private _createAdjacencyList();
        /**
         * Modify opacity of graph entities to display lineage of selected nodes.
         */
        private _displayLineage();
        /**
         * Run BFS from the selected nodes to identify the entities that should not be dimmed.
         *
         * @param undimmedNodes Set of nodes that should not be dimmed
         * @param undimmedEdges Set of edges that should not be dimmed
         * @param adjacencyList Directed graph as adjacency list
         * @param selectedNodes List of nodes that have been selected
         */
        private _identifyEntitiesToHighlight(undimmedNodes, undimmedEdges, adjacencyList, selectedNodes);
        /**
         * Set lineageDimmed state for all nodes to be false
         */
        private _highlightAllEntities();
    }
    /**
     * This is the state machine for handling user actions in the graph viewer. It tracks a user's intent,
     * such as making a connection or dragging a rectangle by handling actions, such as mouse up or down on various objects.
     * Shamelessly stolen from DataLab.
     */
    class InteractionStateMachine {
        /**
         * True if the user isn't currently performing an interaction.
         */
        atRest: KnockoutComputed<boolean>;
        /**
         * The intent behind the current drag operation. None if the user isn't dragging.
         */
        dragging: KnockoutObservable<GraphWidgetConstants.DraggingMode>;
        /**
         * CSS classes to put on the DOM as a result of the user's interaction.
         */
        classes: KnockoutComputed<string>;
        /**
         * True if we're currently panning with inertia
         */
        intertiaPanning: KnockoutObservable<boolean>;
        private _widget;
        private _lastMouseCoords;
        private _lastDomainCoords;
        private _lastTouchCoords;
        private _lastTouchDomainCoords;
        private _lastTouches;
        private _touchHeld;
        private _leftMousePanning;
        private _centerMousePanning;
        private _spacebarHeld;
        private _mouseDownDomainCoords;
        private _mouseDownEvent;
        private _mouseDownEntity;
        private _gestureScale;
        private _gestureDomainCoords;
        private _connectionDragPending;
        private _gesturing;
        private _pendingClearSelection;
        /**
         * Creates a state machine for handling user interation.
         *
         * @param widget The parent widget that will use this state machine.
         */
        constructor(widget: Widget);
        /**
         * Responds to a user action.
         *
         * @param action The user's action.
         * @param e If the action is a mouse or keyboard action, the associated event.
         * @param relevantEntity If acting upon something in the graph widget, what they're acting on.
         */
        handleAction(action: GraphWidgetConstants.InteractionAction, e?: Event, relevantEntity?: GraphEntityViewModel): void;
        /**
         * Dispose of the state machine.
         */
        dispose(): void;
    }
    /**
 * A class that provides support for item selection (single or multiple).
 * The multi selection works in the following way. The selection process
 * is done by creating a selection rectangle R(P1, P2) in 2 steps. The first
 * step is to capture the P1 position and the second step is to capture P2.
 * Once P2 is captured, all 'entities' that intersect with the R(P1, P2) will
 * be selected. It assumes that each entity implements ISprite interface.
 *
 * This class also features a smart rectangle selection in that it detects
 * the vector direction of the P1->P2 points and know how to perform collision
 * detection correctly regardless of the direction of the P1->P2 points.
 */
    class SelectionManager {
        /**
         * The set of selected graph nodes.
         */
        selectedGraphNodeViewModels: KnockoutExtensions.IMutableObservableMap<GraphNodeViewModel>;
        /**
         * The set of selected graph edges.
         */
        selectedGraphEdgeViewModels: KnockoutExtensions.IMutableObservableMap<GraphEdgeViewModel>;
        /**
         * The start point for the multi-selection rectangle
         */
        multiSelectStartPoint: KnockoutObservable<Geometry.IPoint>;
        /**
         * The current end point for the multi-selection rectangle
         */
        multiSelectCurrentPoint: KnockoutObservable<Geometry.IPoint>;
        /**
         * The bounds of the selection rectangle
         */
        selectionRect: KnockoutComputed<Geometry.IRect>;
        private _multiSelecting;
        private _selectedEntities;
        private _selectedEntitiesSubscription;
        constructor(selectedEntities: KnockoutObservableArray<GraphEntityViewModelViva.GraphEntity>);
        /**
         * Cleanup.
         */
        dispose(): void;
        /**
         * Deselects the given entity.
         *
         * @param entityViewModel The entity to deselect.
         */
        deselectEntity(entityViewModel: GraphEntityViewModel): void;
        /**
         * Removes all items from the selection.
         */
        resetSelection(): void;
        /**
         * Batches multiple selection updates to minimize the number of knockout updates.
         *
         * @param callback A callback that does multiple operations to selection.
         */
        modifySelection(callback: () => void): void;
        /**
         * Adds an entity to the current selection.
         *
         * @param entityViewModel the entity to select.
         */
        selectEntity(entityViewModel: GraphEntityViewModel): void;
        /**
         * Toggles an entity's selection state.
         *
         * @param entityViewModel the entity to toggle selection state
         */
        toggleEntitySelection(entityViewModel: GraphEntityViewModel): void;
        /**
         * Starts a drag multi-selection. Note that rect selections do not clear the current selection
         * @param location the x, y domain coordinates to start the drag
         */
        beginRectSelection(location: Geometry.IPoint): void;
        /**
         * Ends a drag multi-selection. All entities in 'entities' fully enclosed by the selection
         * rectangle are added to the current user selection.
         *
         * @param point the x, y domain coordinate to end the drag
         * @param entities an array of all entities to test for selection
         */
        endRectSelection(point: Geometry.IPoint, entityViewModels: KnockoutExtensions.IObservableMap<GraphEntityViewModel>): void;
        /**
         * Aborts a drag multi-selection. Nothing is added to the current user selection.
         */
        cancelRectSelection(): void;
        /**
         * Updates the current drag selection rectangle. The rectangle will extend from the point
         * where start was called to the current mouse location.
         *
         * @param point the current x domain coordinate of the mouse
         */
        updateRectSelection(point: Geometry.IPoint): void;
    }
}
