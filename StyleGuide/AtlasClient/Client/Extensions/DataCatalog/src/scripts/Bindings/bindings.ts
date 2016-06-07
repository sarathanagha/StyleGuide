/// <reference path="../core/constants.ts" />
/// <reference path="../core/utilities.ts" />
/// <reference path="../LoggerFactory.ts" />

class BootstrapPopover {
    init(element, valueAccessor) {
        var $element = <any>$(element);
        var value = ko.unwrap(valueAccessor());
        
        if(value) {
            $element.popover(valueAccessor);
        }
    }

    update(element, valueAccessor) {
        var $element = <any>$(element);
        var value = ko.unwrap(valueAccessor());
        
        if(value) {
            $element.popover(valueAccessor);
        } else if ($.isFunction($element.popover)) {
            $element.popover("destroy");
        }
    }
}

class Spinner {
    init(element, valueAccessor) {
        $(element).addClass("tokyo-spinner");
        var imagePath = Microsoft.DataStudio.DataCatalog.ConfigData.datacatalogImagePath + "indicators/green_check.png";
        $(element).append("<div class='dot'></div><div class='dot'></div><div class='dot'></div><img src='" + imagePath + "/>");
    }

    update(element, valueAccessor, allBindings) {
        var $element = $(element);
        var value = ko.unwrap(valueAccessor());

        var toggleWorking = (toggle: boolean) => {
            if (toggle) {
                $element.addClass("working");

                var animate = () => {
                    $(".curr", $element).removeClass("curr");
                    $($(".dot", $element)[0]).addClass("curr");

                    setTimeout(() => {
                        $(".curr", $element).removeClass("curr");
                        $($(".dot", $element)[1]).addClass("curr");
                    }, 200);

                    setTimeout(() => {
                        $(".curr", $element).removeClass("curr");
                        $($(".dot", $element)[2]).addClass("curr");
                    }, 400);
                };

                animate();
                var interval = setInterval(animate, 1000);
                clearInterval($element.data("interval"));
                $element.data("interval", interval);
            } else {
                $element.removeClass("working");
                clearInterval($element.data("interval"));
            }
        };

        if (typeof value === "boolean") {
            toggleWorking(value);
        } else if (value !== null && typeof value === "object") {
            if (typeof value.working === "undefined" || typeof value.success === "undefined") {
                throw new Error("when using an object with spinner binding 'working' and 'success' are required");
            }
            var showSpinner = ko.unwrap(value.working);
            toggleWorking(showSpinner);

            var showSuccess = ko.unwrap(value.success);
            if (showSuccess) {
                $element.addClass("success");
                setTimeout(() => {
                    $element.removeClass("success");
                    if (ko.isObservable(value.success)) {
                        value.success(false);
                    }
                }, ko.unwrap(value.showSuccessFor) || 2000);
            }
        }
    }
}

class LoadingIndicator {
    init(element, valueAccessor) {
        $(element).hide();
        // Shield your eyes!
        $(element).append("<img src='data:image/gif;base64,R0lGODlh8gAEAIAAAJmZmf///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJAAABACwAAAAA8gAEAAACHYyPqcvtD6OctNqLs968+w+G4kiW5omm6sq27qsVACH5BAkAAAEALAAAAAABAAEAAAICTAEAIfkECQAAAQAsAAAAAAEAAQAAAgJMAQAh+QQJAAABACwAAAAAAQABAAACAkwBACH5BAkAAAEALAAAAAABAAEAAAICTAEAIfkECQAAAQAsAAAAAAEAAQAAAgJMAQAh+QQJAAABACwAAAAABAAEAAACBQxgp5dRACH5BAkAAAEALBMAAAAEAAQAAAIFDGCnl1EAIfkECQAAAQAsJQAAAAQABAAAAgUMYKeXUQAh+QQJAAABACw1AAAABAAEAAACBQxgp5dRACH5BAkAAAEALEMAAAAEAAQAAAIFDGCnl1EAIfkECQAAAQAsTgAAAAQABAAAAgUMYKeXUQAh+QQJAAABACwJAAAAUgAEAAACGgwQqcvtD6OMxxw0s95c3Y914ih+FommWVUAACH5BAkAAAEALBsAAABHAAQAAAIYDBCpy+0PYzzmIImzxrbfDYZZV4nm+VAFACH5BAkAAAEALCsAAAA6AAQAAAIXDBCpy+0P3TEHxYuzqtzqD24VFZbhVAAAIfkECQAAAQAsOAAAAC8ABAAAAhQMEKnL7c+OOQja+6iuuGM9eeKHFAAh+QQJAAABACxEAAAAJQAEAAACEwwQqcvtesxBr1o5590tSw4uUQEAIfkECQAAAQAsAQAAAGoABAAAAiAMEKnL7Q+jfGfOeqrdvNuMeAsIiubJlWipoe7btCtSAAAh+QQJAAABACwSAAAAWwAEAAACHgwQqcvtD+M7EtJDq968YdQZHxaWpvOVaXa2JxtSBQAh+QQJAAABACwhAAAATgAEAAACHQwQqcvtD9uJcJ5Js84X7dR130gaFyli5cp5KFIAACH5BAkAAAEALC8AAABCAAQAAAIcDBCpy+2vDpzyyIlztHrZj3Si840Gd5lqko5SAQAh+QQJAAABACw6AAAAOQAEAAACGgwQqcvteZ6E6MSJm0V57d2FhiVS0VVmaBkVACH5BAkAAAEALEMAAAAyAAQAAAIaDBCpy53n4oIHymsqbrWjHXXgpFmjY55ZUAAAIfkECQAAAQAsBgAAAHEABAAAAiQMEKnL7Q9jPPLR2ui5uPuvbMgngmIJpqq1mS3Zcus8y57dUQUAIfkECQAAAQAsFgAAAGMABAAAAiIMEKnL7Q/fiRLRNs+8vFNtdaBngBqJpqO3iueWxq4askgBACH5BAkAAAEALCMAAABYAAQAAAIiDBCpy+3fDoRyOnmq3Txl1BlZKH4aiS4fuYbrmcZiCnNSAQAh+QQJAAABACwuAAAATwAEAAACIAwQqcvtfJ40aLp4ot03c5VVXxh+ZlKa6ehppyrCLxUUACH5BAkAAAEALD0AAABCAAQAAAIgDBCpy3wNHYr0nUfjnXntLm0Y6F2k8p2GOapJe8LkUwAAIfkECQAAAQAsQQAAAEAABAAAAh8MEKnLeg3Zi/SdSeXN7SK+eB4YbmQynsaGqe35kk8BACH5BAkAAAEALEMAAABAAAQAAAIfDBCpy3oN2Yv0nUnlze0ivngeGG5kMp7Ghqnt+ZJPAQAh+QQJAAABACxFAAAAQAAEAAACHwwQqct6DdmL9J1J5c3tIr54HhhuZDKexoap7fmSTwEAIfkECQAAAQAsRwAAAEAABAAAAh8MEKnLeg3Zi/SdSeXN7SK+eB4YbmQynsaGqe35kk8BACH5BAkAAAEALEkAAABFAAQAAAIgDBCpy3oN2YtUojPrwkhv7FEcFzpgaZzo92SoW8Jr8hQAIfkECQAAAQAsSwAAAFEABAAAAiAMEKnLeg3Zi7TCd6Z1ea+MeKIEdiM4GmZ6dlrLqjH7FAAh+QQJAAABACxNAAAAYQAEAAACIwwQqct6DdmLtNr7zrxJI95p4Egunkeio1q2mLitXzq7NvUUACH5BAkAAAEALE8AAABzAAQAAAImDBCpy3oN2Yu02oslOjNzlBlcSJam+HXYR7LnCzes6oGtHefwUwAAIfkECQAAAQAsUQAAAIkABAAAAicMEKnLeg3Zi7TaizN+Z+aOaKBGlua5gKPYkSsKx7LReqxpz/p+PQUAIfkECQAAAQAsUwAAAJ8ABAAAAioMEKnLeg1jerLai7Pe8XikfdwijuaJps3nbaX5qvJMrw/lgihe9356KAAAIfkECQAAAQAsVQAAADwABAAAAhoMEKnLeg2jXO+8ySzCPGrdOVZIitVWXmWKFAAh+QQJAAABACxXAAAATAAEAAACHQwQqct6DaOc851H10W5+7htn3GN5idio3q2FVIAACH5BAkAAAEALFkAAABgAAQAAAIgDBCpy3oNo5y0wneeTRntD4ZM14GliKZTqZmeCsccUgAAIfkECQAAAQAsWwAAAHUABAAAAiIMEKnLeg2jnLTaa9B5eCMMhuLoeBvokerKlg+Hfu1MX08BACH5BAkAAAEALF0AAACNAAQAAAIjDBCpy53nopy02ospPDAvjnjiSJYVCJapybaulXZq+NZ2DRUAIfkECQAAAQAsXwAAACkABAAAAhQMEKnL7X7MQa9aNjO9/GXZhR5SAAAh+QQJAAABACxhAAAAOQAEAAACFwwQqcvtD9sxB8WLc6rc6g9uFRWW4FQAACH5BAkAAAEALGMAAABNAAQAAAIZDBCpy+0Po2THHDSz3vp6zIUi51njiUpVAQAh+QQJAAABACxlAAAAYwAEAAACHAwQqcvtD6OcNB1zUN28+5iF2keWphNi58qWVwEAIfkECQAAAQAsagAAAHgABAAAAh4MEKnL7Q+jnLTCYw6yvPsPNtq4heaJgmOWtu77YAUAIfkECQAAAQAseAAAAAQABAAAAgUMYKeXUQAh+QQJAAABACyLAAAABAAEAAACBQxgp5dRACH5BAkAAAEALKEAAAAEAAQAAAIFDGCnl1EAIfkECQAAAQAsugAAAAQABAAAAgUMYKeXUQAh+QQJAAABACzUAAAABAAEAAACBQxgp5dRACH5BAkAAAEALO4AAAAEAAQAAAIFDGCnl1EAIfkEBQMAAQAsAAAAAAEAAQAAAgJMAQA7'/>");
    }

    update(element, valueAccessor, allBindings) {
        var $element = $(element);
        var value = ko.unwrap(valueAccessor());

        if (typeof value === "boolean") {
            value ? $element.show() : $element.hide();
        }
    }
}

// A binding for binding highlighted strings. Many strings are truncated after a specified number of characters, 
// when there are html elements this is problematic b/c
// 1) Not all characters are visible, so we can't just substring the string from 0 - n.
// 2) When we truncate the string we may be orphaning an HTML open tag so any open tags will need to be closed.
class HighlightBinding {
    init(element, valueAccessor) {
        return { controlsDescendantBindings: true };
    }

    update(element, valueAccessor, allBindings) {
        var value = ko.unwrap(valueAccessor());
        var fromString = "";
        var limit = Number.MAX_VALUE;
        var ellipsis = "...";

        if (typeof value === "string") {
            fromString = value;
        }
        if (value !== null && typeof value === "object") {
            if (typeof value.html === "undefined") {
                throw new Error("when using an object with highlight binding 'html' is required");
            }
            fromString = value.html;
            limit = value.limit || limit;
        }

        // Remove any script tags
        fromString = $.trim(Microsoft.DataStudio.DataCatalog.Core.Utilities.removeScriptTags(fromString));

        if (fromString.length <= limit) {
            ko.utils.setHtml(element, fromString);
        } else {
            var visibleCharCount = 0;
            var currentIndex = 0;
            var toChars = [];
            var openedTagIndexes = [];
            var fromChars = fromString.split("");
            var inTag = false; // Whether or not the current character is "in" a tag, therefore the visible length shouldn't be incremented
            while (currentIndex < fromString.length && visibleCharCount < (limit - ellipsis.length)) {
                // Copy the characters over to the toChars array one by one, keeping track of the number of visible characters seen
                var char = fromChars[currentIndex];
                if (char === "<") {
                    inTag = true;
                    // Peek-ahead
                    var isOpenTag = fromChars[currentIndex + 1] !== "/";
                    if (isOpenTag) {
                        openedTagIndexes.push(currentIndex);
                    } else {
                        openedTagIndexes.pop();
                    }
                }

                if (!inTag) {
                    visibleCharCount++;
                }

                if (char === ">") {
                    inTag = false;
                }

                toChars.push(char);

                currentIndex++;
            }
            var newString = $.trim(toChars.join(""));
            if (visibleCharCount >= (limit - ellipsis.length)) {
                newString += ellipsis;
            }
            newString += new Array(openedTagIndexes.length + 1).join(Microsoft.DataStudio.DataCatalog.Core.Constants.Highlighting.CLOSE_TAG);
            ko.utils.setHtml(element, newString);
        }
    }
}

class NumericBinding {
    init(element, valueAccessor) {
        var $element = $(element);
        $element.keydown(event => {
            var keyCode = event.keyCode;
            var KeyCodes = Microsoft.DataStudio.DataCatalog.Core.Constants.KeyCodes;
            if (keyCode === KeyCodes.BACKSPACE || keyCode === KeyCodes.DELETE || keyCode === KeyCodes.ESCAPE || keyCode === KeyCodes.ENTER ||
            (keyCode === KeyCodes.A && event.ctrlKey) ||
            (keyCode >= KeyCodes.END && keyCode <= KeyCodes.RIGHT_ARROW)) {
                return;
            } else if (event.shiftKey || (keyCode < KeyCodes.ZER0 || keyCode > KeyCodes.NINE) && (keyCode < KeyCodes.NUMPAD_0 || keyCode > KeyCodes.NUMPAD_9)) {
                event.preventDefault();
            }
        });
    }
}

class DropdownReposition {
    init(element, valueAccessor) {
        var $element = $(element);
        var scrollSelector = ko.unwrap(valueAccessor());

        $element.hover(event => {
            var $container = $element.parents(scrollSelector);
            var containerHeight = $container.height();
            var containerTop = $container.offset().top;
            var dropdownTop = $element.offset().top - containerTop;
            var buttonHeight = $element.height();
            var menuHeight = $(".dropdown-menu", $element).outerHeight(true);
            if ((containerHeight - (dropdownTop + buttonHeight)) < menuHeight) {
                $element.addClass("dropup");
            } else {
                $element.removeClass("dropup");
            }
        });
    }
}

class KendoEditor {
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element = $(element);
        var value = valueAccessor();
        var rawValue = ko.unwrap(value);

        var options = allBindings().kendoOptions || {};
        var initialChange = options.change;
        options.value = rawValue;
        options.change = function() {
            if (ko.isObservable(value)) {
                value(this.value());
            }
            if ($.isFunction(initialChange)) {
                initialChange.apply(this, arguments);
            }
        };

        var initialExecute = options.execute;
        options.execute = function(e) {
            Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("kendo toolbar click id=" + ( e && e.name));
            if ($.isFunction(initialExecute)) {
                initialExecute.apply(this, arguments);
            }
        };

        Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("initializing kendo editor", { "document.domain": document.domain, "location.hostname": location.hostname});
        try {
            $element.kendoEditor(options);
        } catch (e) {
            Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("failed to initialize kendo editor", { name: e.name, message: e.message, stack: e.stack });
        }
        Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("initialized kendo editor", { "document.domain": document.domain, "location.hostname": location.hostname});

        var editor = $element.data("kendoEditor");

        if (editor) {
            if ($.isFunction(options.onFocus)) {
                $(editor.body).focus(options.onFocus);
            }
            if ($.isFunction(options.onBlur)) {
                $(editor.body).blur(options.onBlur);
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("destroying kendo editor", { "document.domain": document.domain, "location.hostname": location.hostname });

                try {
                    editor.destroy();
                } catch (ex) {
                    Microsoft.DataStudio.DataCatalog.BindingLogger.logInfo("failed to destroy kendo editor", { name: ex.name, message: ex.message, stack: ex.stack });
                }
            });
        }
    }

    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element = $(element);
        var editor = $element.data("kendoEditor");
        var value = ko.unwrap(valueAccessor());
        editor.value(value);
    }
}

ko.bindingHandlers["adc-popover"] = new BootstrapPopover();
ko.bindingHandlers["adc-spinner"] = new Spinner();
ko.bindingHandlers["adc-loading"] = new LoadingIndicator();
ko.bindingHandlers["adc-highlight"] = new HighlightBinding();
ko.bindingHandlers["adc-numeric"] = new NumericBinding();
ko.bindingHandlers["adc-dropdownautopos"] = new DropdownReposition();
ko.bindingHandlers["adc-kendoEditor"] = new KendoEditor();