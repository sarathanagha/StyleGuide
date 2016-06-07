import GraphWidget = require("../GraphWidget");
import ICommand = require("./ICommand");
import Geometry = require("../Geometry");
export = Main;
declare module Main {
    /**
     * A command that moves graph nodes on activation/undo
     */
    class MoveNodesCommand implements ICommand.ICommand {
        /**
         * Whether or not this command is in an "undone" state, meaning the user called undo and it's now in the redo queue.
         */
        undone: boolean;
        private _nodes;
        private _oldLocations;
        private _newLocations;
        /**
         * Creates a command that moves graph nodes.
         *
         * @param nodes a list of the nodes to move
         * @param oldLocations the original locations of the nodes. Needed for undo.
         * @param newLocation where the nodes should move.
         */
        constructor(nodes: GraphWidget.GraphNodeViewModel[], oldLocations: Geometry.IRect[], newLocations: Geometry.IRect[]);
        /**
         * Moves the nodes by comitting the new location to the view model.
         */
        run(): void;
        /**
         * Moves the nodes to their original location by comitting to the view model.
         */
        undo(): void;
        /**
         * Appends to a pre-existing command.
         * @param nodes a list of the nodes to move
         * @param oldLocations the original locations of the nodes. Needed for undo.
         * @param newLocation where the nodes should move.
         */
        update(nodes: GraphWidget.GraphNodeViewModel[], oldLocations: Geometry.IRect[], newLocations: Geometry.IRect[]): void;
    }
}
