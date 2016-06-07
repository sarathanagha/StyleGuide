export = Main;
declare module Main {
    /**
     * The interface for a graph control command.
     */
    interface ICommand {
        /**
         * Runs the command.
         */
        run(): void;
        /**
         * Undoes the action of the run command.
         */
        undo(): void;
    }
}
