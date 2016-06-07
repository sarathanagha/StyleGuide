// <reference path="../../../References.d.ts" />
/// <reference path="../../../../bin/Module.d.ts" />
"use strict";
var ko = require("knockout");
//var lastScrollTop = 0;
var Microsoft;
(function (Microsoft) {
    var DataStudioUX;
    (function (DataStudioUX) {
        var Knockout;
        (function (Knockout) {
            var Binding;
            (function (Binding) {
                var ScrollSpy = (function () {
                    function ScrollSpy() {
                    }
                    ScrollSpy.prototype.init = function (element, valueAccessor) {
                        var index = ko.observable(0);
                        var shouter = valueAccessor();
                        index.subscribe(function (newValue) {
                            shouter.notifySubscribers(newValue, 'messageToPublish');
                        });
                        shouter.subscribe(function (newValue) {
                            index(newValue);
                        }, this, 'message');
                        shouter.subscribe(function (newValue) {
                            ScrollSpy.lastScrollTop = undefined;
                        }, this, 'Reset');
                        var Left_click = false;
                        setTimeout(function () {
                            $('ul li.subNav').on("click", function (event) {
                                var currentPosition = $(this).parent().find('li').index($(this));
                                index(currentPosition);
                                Left_click = true;
                            });
                        }, 1000);
                        ko.utils.registerEventHandler(document.getElementsByClassName('editorArea'), "scroll", function (event) {
                            var totalHeight = 0;
                            $('.page').each(function (key, value) {
                                totalHeight = totalHeight + $(value).height();
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
                                if ((2 * ($('.fixedDiv')).height() - $('.page').eq(index()).offset().top) >= $('.page').eq(index()).height()) {
                                    index(index() + 1);
                                }
                            }
                            else {
                                // upscroll code
                                if ($('.page').eq(index()).offset().top >= ($('.fixedDiv')).height() && index() != 0) {
                                    index(index() - 1);
                                }
                            }
                            ScrollSpy.lastScrollTop = st;
                        });
                    };
                    ScrollSpy.lastScrollTop = 0;
                    return ScrollSpy;
                }());
                Binding.ScrollSpy = ScrollSpy;
                ;
                ko.bindingHandlers['datastudio-ux-scrollSpi'] = new ScrollSpy();
            })(Binding = Knockout.Binding || (Knockout.Binding = {}));
        })(Knockout = DataStudioUX.Knockout || (DataStudioUX.Knockout = {}));
    })(DataStudioUX = Microsoft.DataStudioUX || (Microsoft.DataStudioUX = {}));
})(Microsoft || (Microsoft = {}));
