import Log = require("../../scripts/Framework/Util/Log");

// So as to maintain the same category name in PowercopyTool logging.
export function getPowercopyToolLogger(loggerName: string): Microsoft.DataStudio.Diagnostics.Logging.Logger {
    return Log.getLogger({
        category: "PowercopyTool"
    });
}

export let logger = getPowercopyToolLogger("PowerCopyTool");
