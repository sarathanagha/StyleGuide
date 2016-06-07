/// <reference path="../references.d.ts" />
/**
POC: Stephen Pryor (stpryor)

Description:
A knockout binding to load an svg into the html

Input: A string containing the path to an svg.

Example Usage:
    <span data-bind="datastudio-ux-svgloader: 'datastudio-mymextensionname/images/mySpecialSvg.svg'"></span>
*/

module Microsoft.DataStudio.Application.Knockout.Bindings {
    class SvgLoader {
        public init(element: JQuery, valueAccessor: () => string) {
            var $element: JQuery = $(element);
            var resourcePath: string = valueAccessor();
            require(["text!" + resourcePath], (svgString: string) => {
                var svg: JQuery = $(svgString || '');
                if (!!svg && svg.length) {
                    // Clean up the svg a bit
                    svg.removeAttr('id')
                       .attr('height', '100%')
                       .attr('width', '100%');

                    // Serialize the xml to reconstruct the string
                    var xml: XMLSerializer = new XMLSerializer();
                    var svgXML: string = svg.toArray().map((val: Node) => xml.serializeToString(val)).join('');
                    $element.html(svgXML);
                }
            });
        }
    }

    ko.bindingHandlers["datastudio-ux-svgloader"] = new SvgLoader();
};


