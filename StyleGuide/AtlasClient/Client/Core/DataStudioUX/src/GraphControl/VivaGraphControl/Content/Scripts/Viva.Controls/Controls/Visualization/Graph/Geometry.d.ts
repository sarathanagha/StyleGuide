export = Main;
declare module Main {
    /**
     * A cartesian point. Who knew?
     */
    interface IPoint {
        /**
         * The x coordinate of the point.
         */
        x: number;
        /**
         * The y coordinate of the point.
         */
        y: number;
    }
    /**
     * A rectangle. Oh my!
     */
    interface IRect {
        /**
         * The x coordinate of the rectangle.
         */
        x: number;
        /**
         * The y coordinate of the rectangle.
         */
        y: number;
        /**
         * The height of the rectangle.
         */
        height: number;
        /**
         * The width of the rectangle.
         */
        width: number;
    }
    /**
     * Returns whether or not a completely lies in b
     *
     * @param a the rect to test for lying in b
     * @param b the enclosing rect
     * @return true if a lies completely in b. false otherwise.
     */
    function rectLiesInRect(a: IRect, b: IRect): boolean;
    /**
     * Returns the first point where the ray starting at p1 and ending at p2 intersects rect.
     *
     * @param p1 the start point for the line to test
     * @param p2 the end point for the line to test
     * @param rect the rectangle
     * @return where the line and rectangle intersect on the exterior of the rectangle or null if they don't
     */
    function rayRectIntersection(p1: IPoint, p2: IPoint, rect: IRect): IPoint;
}
