using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net;

namespace Microsoft.DataStudio.Diagnostics
{
    public class LogHelpers
    {
        public static string FormatString(string format, params object[] args)
        {
            string message = string.Empty;

            if (args == null || args.Length == 0)
            {
                message = format; // If no args were provided then "format" is just a plain string, not a format string
            }
            else
            {
                message = string.Format(CultureInfo.InvariantCulture, format, args);
            }

            return message;
        }

        // AIMS alerts can use these log messages to have an html description
        // So html encode these messages before writing to ETW,
        // so that presence of html within the message doesn't mess up html alert description
        public static string FormatAndHtmlEncode(string format, params object[] args)
        {
            string message = FormatString(format, args);

            return WebUtility.HtmlEncode(message);
        }

        public static string ToString(IDictionary<string, string> properties)
        {
            string result = string.Empty;
            if (properties != null)
            {
                result = string.Join(", ", properties.Select(pair => string.Format(CultureInfo.InvariantCulture, "{{{0} : {1}}}", pair.Key, pair.Value)));
            }

            return WebUtility.HtmlEncode(result);
        }

        public static Guid GetCurrentActivityId()
        {
            return Trace.CorrelationManager.ActivityId;
        }

        public static void SetCurrentActivityId(Guid newActivityId)
        {
            Trace.CorrelationManager.ActivityId = newActivityId;
        }
    }
}