import KnockoutExtensions = require("../../Base/KnockoutExtensions");
import Promise = require("../../Base/Promise");
import Base = require("../../Base/Base");
import GraphEntitiesAddition = require("./GraphEntitiesAddition");
import GraphEntityViewModel = require("./GraphEntityViewModel");
import Geometry = require("./Geometry");
export = Main;
declare module Main {
    /**
     * Skin styles of the graph editor.
     */
    enum GraphEditorSkinStyle {
        /**
         * Canvas and node background colors are consistent with typical blade and parts background colors.
         */
        Blade = 0,
        /**
         * Canvas background color is strictly white or black (depending on main color theme), node background color is a tint of blue.
         */
        Document = 1,
    }
    /**
     * Capabilities of the graph editor. Flags enum, literals can be combined.
     */
    enum GraphEditorCapabilities {
        /**
         * No editor capabilities. Only viewing, panning and zooming-in/-out allowed on the graph.
         */
        None = 0,
        /**
         * Capability to move nodes (connected edges move accordingly).
         */
        MoveEntities = 1,
        /**
         * Capability to update lists of nodes and edges.
         */
        AddRemoveEntities = 2,
    }
    /**
     * Strategies defining how edges connect to nodes and how they follow the nodes' moves.
     */
    enum EdgeConnectionStrategy {
        /**
         * Edge line is a ray originating at the center of the start node and going to the center of the end node.
         */
        NodeCenter = 0,
        /**
         * Edge path is a Bezier curve originating at the output port of the start node and going to the input port of the end node.
         */
        NodePort = 1,
    }
    /**
     * View model that represents a graph.
     */
    class ViewModel extends Base.ViewModel {
        /**
         * The strategy defining how edges connect to nodes and how they follow the nodes' moves. Default is EdgeConnectionStrategy.NodeCenter.
         */
        edgeConnectionStrategy: KnockoutObservable<EdgeConnectionStrategy>;
        /**
         * The editing capabilities the graph editor exposes. Default is GraphEditorCapabilities.None.
         */
        editorCapabilities: KnockoutObservable<GraphEditorCapabilities>;
        /**
         * All graph nodes in the graph.
         */
        graphNodes: KnockoutExtensions.IMutableObservableMap<GraphEntityViewModel.GraphNode>;
        /**
         * All edges in the graph.
         */
        edges: KnockoutExtensions.IMutableObservableMap<GraphEntityViewModel.GraphEdge>;
        /**
         * When dragging graph nodes, they snap to a grid. This is how many pixels wide and tall each grid cell is. Default is 10.
         */
        gridResolution: KnockoutObservable<number>;
        /**
         * Notifies subscribers when the a layout change has been committed to the graph.
         */
        layoutChanged: KnockoutObservable<number>;
        /**
        * Returns a new candidate layout without overlaps, given a proposed movement of some nodes.
        * The returned candidade layout is used to preview the change and, if the user commits the change,
        * to update the committed locations of nodes.
        * This should be specified by the extension. If it's set null, no automatic layout will occur.
        *
        * @param changedNodes The nodes with explicitly changed positions.
        * @param rootId The node under the user's cursor (which should not move).
        * @return The nodes with implicitly changed positions.
        */
        getLayoutNoOverlaps: KnockoutObservable<(changedNodes: StringMap<Geometry.IPoint>, rootId: string) => Promise.PromiseV<StringMap<Geometry.IPoint>>>;
        /**
         * Sets the rects for specified graph nodes.
         *
         * This can only be called after widgetAttached() is true, otherwise it will throw an exception.
         * All calls to this function will result in animation, so best practice is to initialize nodes with
         * their starting rects (per the optional constructor).
         * This API is used to allow the widget to track animated and comitted state, as well as allow for batch updates.
         *
         * @param rects Map of rects.
         * @param options Configuratble options (ex: undo/redo stack).
         * @return A promise that resolves once the changes have been applied.
         */
        setNodeRects: KnockoutObservable<(rects: StringMap<GraphEntityViewModel.IUpdateRect>, options?: GraphEntityViewModel.ISetNodeRectOptions) => Promise.Promise>;
        /**
         * Returns all rects for every graph node, or a specified list of graph node ids.
         *
         * This can only be called after widgetAttached() is true, otherwise it will throw an exception.
         *
         * @param ids The list of ids from which to return corresponding gaphNodes.
         * @return A promise that resolves with a string map of committed rects.
         */
        getNodeRects: KnockoutObservable<(ids?: string[]) => StringMap<Geometry.IRect>>;
        /**
         * Currently selected entities.
         */
        selectedEntities: KnockoutObservableArray<GraphEntityViewModel.GraphEntity>;
        /**
         * When true, the user can multi-select by clicking in the background and dragging. When false, clicking and dragging in the background pans.
         * Default is false.
         */
        rectSelectionMode: KnockoutObservable<boolean>;
        /**
         * Zooms to fit the graph in the viewport.
         */
        zoomToFit: KnockoutObservable<() => Promise.Promise>;
        /**
         * Zooms in.
         */
        zoomIn: KnockoutObservable<() => Promise.Promise>;
        /**
         * Zooms out.
         */
        zoomOut: KnockoutObservable<() => Promise.Promise>;
        /**
         * Zooms to 100%.
         */
        zoomTo100Percent: KnockoutObservable<() => Promise.Promise>;
        /**
         * Brings a specified rectangle into the view with an animation.
         */
        bringRectIntoView: KnockoutObservable<(rect: Geometry.IRect) => Promise.Promise>;
        /**
         * If true, disable zoom in/out behavior on mouse wheel events. Default to false.
         */
        disableMouseWheelZoom: KnockoutObservable<boolean>;
        /**
         * The style skin applied to the graph editor defining canvas and entities styling (mostly colors).
         */
        private _styleSkin;
        /**
         * Creates instance of Graph ViewModel, optionally setting non-default style skin.
         */
        constructor(styleSkin?: GraphEditorSkinStyle);
        /**
         * If true, reduce opacity of all graph entities except the ones selected and the ones in its
         * upstream and downstream
         */
        enableLineage: KnockoutObservable<boolean>;
        /**
         * Teardown the view model.
         */
        dispose(): void;
        /**
         * Deletes the specified graph entities (nodes and edges).
         *
         * @param nodesToDelete The array of nodes to delete.
         * @param edgesToDelete The array of edges to delete.
         * @return JQuery promise object that is resolved when the operation completes or fails.
         */
        deleteEntities(nodesToDelete: IGraphNodeForDeletion[], edgesToDelete: IGraphEdgeForDeletion[]): JQueryPromise<any>;
        /**
         * Adds the specified GraphEntityViewModel.GraphEdge instance to the list of the view model edges.
         *
         * @param edgeToAdd The edge instance to add.
         * @return JQuery promise object that is resolved when the operation completes or fails.
         */
        addEdge(edgeToAdd: GraphEntitiesAddition.IGraphEdgeForAddition): JQueryPromise<any>;
        hasEditorCapability(capability: GraphEditorCapabilities): boolean;
    }
    /**
    * The contract definition of Graph node interface for the purposes of deletion logic.
    */
    interface IGraphNodeForDeletion {
        /**
         * The identifier of the node.
         */
        id: string;
    }
    /**
     * The contract definition of Graph edge interface for the purposes of deletion logic.
     */
    interface IGraphEdgeForDeletion {
        /**
         * The identifier of the edge.
         */
        id: string;
    }
    /**
     * Utility class encapsulates deletion functionality.
     */
    class GraphEntitiesDeletion {
        /**
         * Performs deletion of the specified nodes and edges from the specified graph model.
         * @param model GraphViewModel.ViewModel instance to run the deletion on.
         * @param nodesToDelete List of nodes to delete.
         * @param edgesToDelete List of edges to delete.
         */
        static run(model: ViewModel, nodesToDelete: IGraphNodeForDeletion[], edgesToDelete: IGraphEdgeForDeletion[]): void;
    }
}
