/// <reference path="../../references.ts" />
/// <reference path="../LoggerSink.ts" />

module Microsoft.DataStudio.Diagnostics.Logging.Sinks {

    var knownProperties = {
        "moduleName": true,
        "loggerName": true,
        "category": true,
        "level": true,
        "message": true,
        "cause": true,
        "error": true,
        "correlationId": true,
        "clientRequestId": true
    };

    export class BrowserConsoleSink implements LoggerSink {

        private extendedFormattingEnabled: boolean;

        constructor() {
            // TODO: Test output in other browsers that IE and Chrome.
            this.extendedFormattingEnabled = window["chrome"] !== undefined;
        }

        publishLogEvent(logEvent: LogEvent): void {
            var extendedFormatting = this.extendedFormattingEnabled;

            var formatStr: string[] = [];
            var formatArgs: any[] = [];

            function append(str: string, color?: string, bold?: boolean, italic?: boolean): void {
                if (!str)
                    return;

                var colorChanged = false;
                var boldChanged = false;
                var italicChanged = false;

                if ((color || bold || italic) && extendedFormatting) {
                    var css = "";

                    if (color) {
                        css += "color: " + color + ";";
                        colorChanged = true;
                    }

                    if (bold) {
                        css += "font-weight: bold;";
                        boldChanged = true;
                    }

                    if (italic) {
                        css += "font-style: italic;";
                        italicChanged = true;
                    }

                    formatStr.push("%c");
                    formatArgs.push(css);
                }

                formatStr.push("%s");
                formatArgs.push(str);

                if (colorChanged || boldChanged || italicChanged) {
                    var css = "";

                    if (colorChanged) {
                        css += "color: inherit;";
                    }

                    if (boldChanged) {
                        css += "font-weight: inherit;";
                    }

                    if (italicChanged) {
                        css += "font-style: inherit;";
                    }

                    formatStr.push("%c");
                    formatArgs.push(css);
                }
            }

            function appendObject(obj: any): void {
                if (extendedFormatting) {
                    formatStr.push("%o");
                    formatArgs.push(obj);
                } else {
                    append(ObjectUtils.serialize(obj));
                }
            }

            function appendError(error: any): void {
                if (!extendedFormatting && error.stack !== undefined) {
                    append(error.stack);
                } else {
                    appendObject(error);
                }
            }

            function appendNewLine(): void {
                formatStr.push("\n");
            }

            // Colors
            let levelColor: string = null;
            let messageColor: string = null;
            let messageBold: boolean = false;
            let consoleMethod = console.log;

            switch (logEvent.level) {
                case LogLevel.Error:
                    levelColor = "#cc3300";
                    messageColor = levelColor;
                    messageBold = true;
                    consoleMethod = console.error || consoleMethod;
                    break;

                case LogLevel.Warning:
                    levelColor = "#cc9900";
                    messageBold = true;
                    consoleMethod = console.warn || consoleMethod;
                    break;

                case LogLevel.Info:
                    messageColor = "#006699";
                    consoleMethod = console.info || consoleMethod;
                    //messageBold = true;
                    break;

                case LogLevel.Debug:
                    levelColor = "#999999";
                    messageColor = levelColor;
                    consoleMethod = console.debug || consoleMethod;
                    break;
            }

            // Log level
            append("↯ ", levelColor);
            append(LogLevel[logEvent.level], levelColor);

            // Module name and category
            append(" [");
            append(ObjectUtils.stringOrDefault(logEvent.moduleName, "<default>"));
            if (logEvent.category) {
                append(" @", "#339966", false, true);
                append(logEvent.category, "#339966", false, true);
            }
            append("] ");

            // Logger name
            append(ObjectUtils.stringOrDefault(logEvent.loggerName, "<default>"));
            append(":");

            // Message
            if (logEvent.message) {
                append(" ");
                append(logEvent.message, messageColor, messageBold);
            }

            // Cause
            if (logEvent.cause) {
                append(" Cause: ", null, false, true);
                append(logEvent.cause, messageColor, messageBold);
            }

            // Custom properties
            var addComma = false;
            ObjectUtils.forEachDefined(logEvent, (name, value) => {
                if (!knownProperties[name]) {
                    append(addComma ? ", " : " ");
                    append(name, null, false, true);
                    append(" = ");
                    appendObject(value);
                    addComma = true;
                }
            });

            // Error
            if (logEvent.error) {
                appendNewLine();
                append("   ");
                appendError(logEvent.error);
                //appendNewLine();
            }

            // Print the message
            formatArgs.unshift(formatStr.join(""));
            consoleMethod.apply(console, formatArgs);
        }

        publishUsageEvent(usageEvent: UsageEvent): void {
            throw new Error("BrowserConsoleSink: UsageEvent(s) aren't handled in this sink");
        }
    }
}
