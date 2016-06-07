// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />


import ko = require("knockout");
//var lastScrollTop = 0;
module Microsoft.DataStudioUX.Knockout.Binding {

    export class ScrollSpy {
        constructor() {
           
        }
        public static lastScrollTop: number = 0;
        public init(element: HTMLElement, valueAccessor: () => any): void {
            var index = ko.observable(0);
            var shouter = valueAccessor();
            index.subscribe((newValue) => {
                shouter.notifySubscribers(newValue, 'messageToPublish');
            });
            shouter.subscribe((newValue: number) => {
                index(newValue);
            }, this, 'message');
            shouter.subscribe((newValue: number) => {
                ScrollSpy.lastScrollTop = undefined;
            }, this, 'Reset');

            var Left_click = false;
            setTimeout(() => {
                (<any>$('ul li.subNav')).on("click", function (event) {
                    var currentPosition = (<any>$(this).parent().find('li')).index((<any>$(this)));
                    index(currentPosition);
                    Left_click = true;
                });
            }, 1000);

            ko.utils.registerEventHandler(document.getElementsByClassName('editorArea'), "scroll", function (event) {

                var totalHeight = 0;
                (<any>$('.page')).each(function (key, value) {
                    totalHeight = totalHeight + (<any>$(value)).height();
                });

                if (ScrollSpy.lastScrollTop == undefined) {
                    ScrollSpy.lastScrollTop = 0;
                    index(0);
                }
                var st = $(this).scrollTop();
                if (Left_click == true) {
                    Left_click = false;
                    return false;
                }
                if (st > ScrollSpy.lastScrollTop) {
                    // downscroll code
                    if ((2 * <any>($('.fixedDiv')).height() - (<any>$('.page').eq(index())).offset().top) >= (<any>$('.page').eq(index())).height()) {
                        index(index() + 1);
                    }
                } else {
                    // upscroll code
                    if ((<any>$('.page').eq(index())).offset().top >= <any>($('.fixedDiv')).height() && index() != 0) {
                        index(index() - 1);
                    }
                }
                ScrollSpy.lastScrollTop = st;
            });
        }
    };



    ko.bindingHandlers['datastudio-ux-scrollSpi'] = new ScrollSpy();
}