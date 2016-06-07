export = Main;
declare module Main {
    /**
     * The ImageContract that is defined the same as the MsPortalFx.Base.Image
     */
    interface ImageContract {
        /**
         * Stores the type of image (custom SVG/image or a built in SVG).
         */
        type: number;
        /**
         * Stores the SVG element, or URI to image file.
         */
        data?: string;
        /**
         * Stores the palette of the element.
         */
        palette?: number;
    }
    /**
     * Data type used for rendering images's.
     */
    class Image implements ImageContract {
        /**
         * See interface
         */
        type: number;
        /**
         * See interface
         */
        data: string;
        /**
         * See interface
         */
        palette: number;
        /**
         * Construct an image.
         */
        constructor(type?: number, data?: string, palette?: number);
    }
    /**
     * Type for the SVG image.
     */
    class SvgImage extends Image {
        /**
         * Height of the image.
         */
        height: number;
        /**
         * Width of the image.
         */
        width: number;
        /**
         * x coordinate of the origin of the image
         */
        x: number;
        /**
         * y coordinate of the origin of the image
         */
        y: number;
        /**
         * Factory method to construct an SvgImage from Image
         *
         * @param image the image to construct
         * @return the SvgImage
         */
        static fromImage(image: ImageContract): SvgImage;
    }
    /**
     * Minimal type used from MsPortalFx's Services.Images.ts for images.
     * If type is not specified here, the data of the image is treated as
     * SVG data.
     */
    enum SvgType {
        /**
         * Blank.
         */
        Blank = 0,
        /**
         * For loading custom SVG
         */
        Custom = 1,
        /**
         * Reserved for png/git/jpeg
         */
        ImageUri = 2,
    }
}
