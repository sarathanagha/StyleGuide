export = Main;
declare module Main {
    /**
     * Definition of edge line types.
     */
    enum EdgeType {
        /**
         * Single line/curve.
         */
        Single = 1,
        /**
         * 2 parallel lines/curves.
         */
        Double = 2,
    }
    /**
     * Definition of edge line styles.
     */
    enum EdgeStyle {
        /**
         * Solid line/curve.
         */
        Solid = 1,
        /**
         * Dotted line/curve.
         */
        Dotted = 2,
        /**
         * Dashed line/curve.
         */
        Dashed = 3,
    }
    /**
     * Definition of edge markers.
     */
    enum EdgeMarker {
        /**
         * None.
         */
        None = 1,
        /**
         * Arrow.
         */
        Arrow = 2,
        /**
         * Circle.
         */
        Circle = 3,
    }
    /**
     * The Edge end contract.
     */
    interface IEdgeEnd {
        /**
         * The identifier of the edge end.
         */
        id: KnockoutObservable<string>;
    }
    /**
     * An interface for updating only specified aspects of a graphNode's Geometry.IRect.
     */
    interface IUpdateRect {
        /**
         * The X coordinate of the node's top-left corner.
         */
        x?: number;
        /**
         * The Y coordinate of the node's top-left corner.
         */
        y?: number;
        /**
         * The height of the node.
         */
        height?: number;
        /**
         * The width of the node.
         */
        width?: number;
    }
    /**
     * Options to be used when calling the widget's setNodeRectsOpts function.
     */
    interface ISetNodeRectOptions {
        /**
         * When true, clears the existing undo/redo stack.
         * Default: false;
         */
        clearUndo?: boolean;
    }
    /**
     * An abstract class that holds common elements for things that go in the graph.
     * Don't instantiate this.
     */
    class GraphEntity {
        /**
         * Whether this entity allows being selected by a user or not.
         */
        selectable: KnockoutObservable<boolean>;
        /**
         * Whether this entity is selected or not.
         */
        selected: KnockoutObservable<boolean>;
        /**
         * The id of this entity. Used for referring to other graph nodes. You may need to
         * overwrite the default one when loading existing graphs.
         */
        id: KnockoutObservable<string>;
        /**
        * If true, the entity should have a low opacity.
        */
        dimmed: KnockoutObservable<boolean>;
        /**
        * CommandGroup to display in the context menu of the node.
        */
        commandGroup: KnockoutObservable<string>;
        /**
         * This class is abstract. Do not instantiate it.
         */
        constructor(id?: string);
    }
    /**
     * A graph edge. Put these in Graph.ViewModel's edge array.
     */
    class GraphEdge extends GraphEntity {
        /**
         * The id of the start node for the edge. Do not change this after adding the edge to the
         * graph. This is set automatically by the constructor, and you should never need to change it.
         */
        startNodeId: KnockoutObservable<string>;
        /**
         * The id of the end node for the edge. Do not change this after adding the edge to the graph.
         * This is set automatically by the constructor, and you should never need to change it.
         */
        endNodeId: KnockoutObservable<string>;
        /**
         * The edge line strength (thickness). Limited to values in the range [1; 6] - where 1 represents the weakest (the thinnest) and 6 - the strongest (the thickest) connection.
         */
        strength: KnockoutObservable<number>;
        /**
         * The compound type characteristics of the edge line.
         */
        type: KnockoutObservable<EdgeType>;
        /**
         * The style of the edge line.
         */
        style: KnockoutObservable<EdgeStyle>;
        /**
         * The start marker of the edge.
         */
        startMarker: KnockoutObservable<EdgeMarker>;
        /**
         * The end marker of the edge.
         */
        endMarker: KnockoutObservable<EdgeMarker>;
        /**
         * Creates a graph edge.
         *
         * @param startNode The node the edge eminates from.
         * @param endNode The node the edge ends on.
         */
        constructor(startNode: IEdgeEnd, endNode: IEdgeEnd);
    }
    /**
     * A graph node. Put these in Graph.ViewModel's graphNodes array.
     */
    class GraphNode extends GraphEntity {
        /**
         * The view model to use for displaying the graph node's content.
         */
        extensionViewModel: any;
        /**
         * A Knockout template describing what the graph node looks like.
         */
        extensionTemplate: string;
        /**
         * Called when the user activates the graph node (double click or something via accessibility).
         */
        activated(): void;
        /**
         * Only used for constructor purposes. Shouldn't be touched by the extension.
         */
        private _initialRect;
        /**
         * Creates an instance of a graph node.
         * @param initialRect Optional initial position and size information.
         */
        constructor(initialRect?: IUpdateRect);
    }
    /**
     * An abstract class for the graph port is the connection point where an edge attaches to a node.
     * Don't instantiate this.
     */
    class GraphNodePort extends GraphEntity {
        /**
         * The value indicates whether the port is connected or not.
         */
        connected: KnockoutObservable<boolean>;
        /**
         * The flag manages whether the port should be visible or not.
         */
        visible: KnockoutObservable<boolean>;
        private _parent;
        /**
         * Creates instance of a node port.
         * @param parentGraphNode The node the port belongs to.
         */
        constructor(parentGraphNode: GraphNode);
        /**
         * Gets parent node of the port.
         */
        parentNode: GraphNode;
    }
    /**
     * The graph node port the edge starts from.
     * Don't instantiate this.
     */
    class InputPort extends GraphNodePort {
        /**
         * Creates the input port instance.
         */
        constructor(hostNode: GraphNode);
    }
    /**
     * The graph node port the edge ends at.
     * Don't instantiate this.
     */
    class OutputPort extends GraphNodePort {
        /**
         * Creates the output port instance.
         */
        constructor(hostNode: GraphNode);
    }
}
