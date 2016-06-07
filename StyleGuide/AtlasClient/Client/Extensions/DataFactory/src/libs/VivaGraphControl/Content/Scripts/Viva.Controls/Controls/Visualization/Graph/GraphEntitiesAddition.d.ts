export = Main;
declare module Main {
    /**
     * The contract definition of Graph edge interface for the purposes of addition logic.
     */
    interface IGraphEdgeForAddition {
        /**
         * The identifier of the node the edge starts from.
         */
        startNodeId: string;
        /**
         * The identifier of the node the edge ends at.
         */
        endNodeId: string;
    }
}
