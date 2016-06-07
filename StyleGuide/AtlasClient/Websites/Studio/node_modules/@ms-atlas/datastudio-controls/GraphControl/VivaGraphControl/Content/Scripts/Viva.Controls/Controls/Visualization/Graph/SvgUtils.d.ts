import GraphEntityViewModel = require("./GraphEntityViewModel");
export = Main;
declare module Main {
    /**
     * Returns a value for the stroke-dash attribute of a path in respect to the specified edge style.
     *
     * @param style The edge line style selected.
     * @return String value for the dash array used if the style is not a solid line, 'none' otherwise.
     */
    function strokeDashArray(style: GraphEntityViewModel.EdgeStyle): string;
    /**
     * Returns a value for the stroke-width attribute of a path in respect to the specified edge strength.
     *
     * @param strength The edge strength selected.
     * @return Width value.
     */
    function strokeWidth(thickness: number): number;
    /**
     * Returns a value for the marker attribute of a path in respect to the specified edge marker.
     *
     * @param marker The edge marker selected.
     * @param startMarker Is an edge start marker.
     * @return String value for the marker used, 'none' otherwise.
     */
    function marker(marker: GraphEntityViewModel.EdgeMarker, startMarker: boolean): string;
    /**
     * The classes managing colors (background, fill, border color, stroke color, etc) applied to a graph node.
     */
    interface IGraphNodeColorClasses {
        /**
         * States index.
         */
        [index: string]: string[];
        /**
         * Classes managing colors (background, fill, border color, stroke color, etc) applied to a graph node at rest.
         */
        atRest: string[];
        /**
         * Classes managing colors (background, fill, border color, stroke color, etc) applied to a hovered graph node.
         */
        hovered: string[];
        /**
         * Classes managing colors (background, fill, border color, stroke color, etc) applied to a selected graph node.
         */
        selected: string[];
        /**
         * Classes managing colors (background, fill, border color, stroke color, etc) applied to a graph node that is currently emitting an edge draft as a source node.
         */
        dragSource: string[];
        /**
         * Classes managing colors (background, fill, border color, stroke color, etc) applied to a graph node that is currently accepting an edge draft as destination node.
         */
        dragTarget: string[];
    }
    /**
     * The classes managing colors (background, fill, border color, stroke color, etc) applied to a graph edge.
     */
    interface IGraphEdgeColorClasses {
        /**
         * States index.
         */
        [index: string]: string[];
        /**
         * Classes managing colors (stroke color, etc) applied to a graph edge at rest.
         */
        atRest: string[];
        /**
         * Classes managing colors (stroke color, etc) applied to a selected graph edge.
         */
        selected: string[];
    }
    /**
     * The definition of the order and comptatibility the entity states are used to apply skin color classes.
     */
    interface IStateCompatibilityStrategy {
        /**
         * Name of the entity state defined for current strategy step.
         */
        state: string;
        /**
         * Names of the states that can be applied together with the state defined for current strategy step.
         */
        compatible?: string[];
        /**
         * Strategy to go with in case current entity state is different from the state defined for current strategy step
         */
        disjunctive?: IStateCompatibilityStrategy;
    }
    var StateCompatibilityStrategyDefinitions: {
        [name: string]: IStateCompatibilityStrategy;
    };
    /**
     * The definition of a Graph node skin - set of classes used to define ONLY COLOR-RELATED style properties of the elements.
     */
    interface IGraphSkinDefinition {
        /**
         * Class name representing the skin identity.
         * Used as a CSS class in Graph.less file to style NON-COLOR-RELATED properties of the elements (border width, stroke width, etc).
         */
        skinMonikerClass: string;
        /**
         * Classes managing colors (background, fill, stroke, etc) applied to the graph canvas.
         */
        canvasColorClasses: string[];
        /**
         * Classes managing colors (background, fill, border color, stroke color, etc) applied to a graph node.
         */
        nodeColorClasses: IGraphNodeColorClasses;
        /**
         * Classes managing colors (background, fill, border color, stroke color, etc) applied to a graph edge.
         */
        edgeColorClasses: IGraphEdgeColorClasses;
        /**
         * The order and comptatibility the node states are used to apply skin color classes.
         */
        nodeStatesCompatibility: IStateCompatibilityStrategy;
    }
    /**
     * Collection of supported graph skins. Use a value of GraphEditorSkinStyle enum as a skin key/index.
     */
    var GraphSkinsCollection: {
        [skin: number]: IGraphSkinDefinition;
    };
}
