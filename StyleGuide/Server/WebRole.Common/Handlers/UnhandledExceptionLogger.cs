using System;
using System.Diagnostics;
using System.Net.Http;
using System.Web.Http.ExceptionHandling;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.DataStudio.WebExtensions;

namespace Microsoft.DataStudio.WebRole.Common.ExceptionHandling
{
    public class UnhandledExceptionLogger : ExceptionLogger
    {
        private readonly ILogger mLogger;

        public UnhandledExceptionLogger(ILogger logger)
        {
            ThrowIf.Null(logger, "logger");
            mLogger = logger;
        }

        public override void Log(ExceptionLoggerContext context)
        {
            try
            {
                Guid requestId = context.Request.GetCorrelationId();

                using (new ActivityIdScope(requestId))
                {
                    string requestUri = context.Request.RequestUri.ToString();
                    string userAgent = context.Request.Headers.UserAgent != null ? context.Request.Headers.UserAgent.ToString() : string.Empty;
                    string fullRequest = context.Request.Method + " " + requestUri;

                    mLogger.Write(
                       TraceEventType.Error,
                       "Unhandled exception for request - Id:{0}, Request:{1}, Headers:{2}, Exception:{3}",
                       requestId,
                       fullRequest,
                       context.Request.Headers.ToStringWithoutPII(),
                       context.Exception);
                }
            }
            catch(Exception)
            {
                // do not throw
            }
        }
    }
}
