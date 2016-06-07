module Microsoft.DataStudio.Application.Knockout {

    class ShellComponentLoader implements KnockoutComponentTypes.Loader {

        public getConfig(
            componentName: string,
            callback: (result: KnockoutComponentTypes.ComponentConfig) => void): void {
            if (!ko.components.isRegistered(componentName))
            {
                var componentUrl = this.getComponentURL(componentName);
                var viewModelURI = this.getViewModelURI(componentUrl);

                var result: any = { require: viewModelURI.toString() };

                callback(<KnockoutComponentTypes.ComponentConfig>result);
            }
            else
            {
                callback(null);
            }
        }

        public loadTemplate(
            componentName: string,
            templateConfig: any,
            callback: (result: Node[]) => void): void {

            ko.components.defaultLoader.loadTemplate(
                componentName,
                templateConfig,
                (result: Node[]): void => {

                    this.convertResourceUriForComponent(componentName, result);

                    callback(result);
                });
        }

        private convertResourceUriForComponent(componentName: string, nodes: Node[]): void {

            if (!componentName || componentName.length === 0) {
                throw new Error("componentName is undefined or empty");
            }

            if (nodes) {
                var elements: JQuery = $(<any>nodes)
                    .find('img[src], script[src], iframe[src], embed[src], input[src]');

                elements.each((number: number, element: Element): void => {
                    var uriValue: string  = element.getAttribute('src');

                    if (uriValue) {
                        var uri = new URI(uriValue);

                        if (uri.is('relative')) {

                            var rootUri = this.getComponentURL(componentName).toString();

                            if (componentName.indexOf('uxshell')!==0)
                            {
                                var moduleName: string = "datastudio-"+componentName.slice(0,componentName.indexOf('-'));
                                rootUri = ModuleCatalog.getModuleRootUrl(moduleName) + rootUri;
                            }

                            uri = uri.absoluteTo(rootUri);

                            // Fix possible parent references ("/views/../../images/image.png").
                            uri = uri.normalizePathname();

                            // TODO [agoyal] implement universal path resolution alg. (get config from requirejs packages)
                            element.setAttribute('src', uri.toString());
                        }
                    }
                });
            }
        }

        private getComponentURL(componentName: string): URI {

            var uriSegments: string[] = componentName.split("-");

            var uri = new URI("");
            uri.fragment("");

            if (uriSegments[0] !== "uxshell") {
                uriSegments[0] = "datastudio-" + uriSegments[0];
                uriSegments.splice(1, 0, "views");
            } else {
                uriSegments = ModuleCatalog.getModuleRootUrl("datastudio")
                    .split("/")
                    .concat(uriSegments);
            }

            uri.segment(uriSegments);

            // Add a segment for fileName (adds trailing slash).
            uri.segment('');

            return uri;
        }

        private getViewModelURI(componentURL: URI): URI {
            var vmUri = componentURL.clone();

            var segments = vmUri.segment();

            var lastFolderSegment = segments[segments.length-2];

            vmUri.filename(lastFolderSegment);

            return vmUri;
        }
    }

    export class ComponentLoader {
        public static initialize() {
            ko.components.loaders.unshift(new ShellComponentLoader());
        }
    }
}
