/// <reference path="../References.d.ts" />
import Framework = require("../_generated/Framework");
import Loader = Framework.Loader;

export class LoadingBindingHandler implements KnockoutBindingHandler {
    static className: string = "loader";

    public init (
        element: HTMLElement,
        valueAccessor: () => KnockoutObservable<Loader.LoadingState>,
        allBindingsAccessor?: KnockoutAllBindingsAccessor,
        viewModel?: Object,
        bindingContext?: KnockoutBindingContext): { controlsDescendantBindings: boolean; } {

        element.classList.add("center");
        ko.applyBindingsToNode(element, {
            css: ko.pureComputed(() => {
                let loadingState: Loader.LoadingState = ko.utils.unwrapObservable(valueAccessor());
                let loadingClass = "";
                switch (loadingState) {
                    case Loader.LoadingState.Ready:
                        element.style.display = "none";
                        break;

                    case Loader.LoadingState.Failed:
                        element.style.display = "flex";
                        // TODO paverma set icon for failed part.
                        // Perhaps will also have to link this to retry logic for re-creating part.
                        $(element).html("");
                        loadingClass = "dataFactory-loader-failed";
                        break;

                    case Loader.LoadingState.Loading:
                        element.style.display = "flex";
                        $(element).html(Framework.Svg.progressRing);
                        loadingClass = "dataFactory-loader-loading";
                        break;

                    case Loader.LoadingState.BlockingUiLoading:
                        element.style.display = "flex";
                        $(element).html(Framework.Svg.progressRing);
                        loadingClass = "dataFactory-loader-blockingUiLoading";
                        break;

                    default:
                        break;
                }
                return loadingClass;
            })
        });
        return { controlsDescendantBindings: true };
    }
}
