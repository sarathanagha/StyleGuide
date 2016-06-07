using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.DataStudio.WebExtensions;

namespace Microsoft.DataStudio.WebRole.Common.Handlers
{
    public sealed class RequestLoggingHandler : DelegatingHandler
    {
        private readonly ILogger mLogger = null;

        public RequestLoggingHandler(ILogger logger)
        {
            ThrowIf.Null(logger, "logger");
            this.mLogger = logger;
        }

        protected async override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Guid requestId = request.GetCorrelationId();

            using (new ActivityIdScope(requestId))
            {
                string fullRequest = request.Method + " " + request.RequestUri;
                string userAgent = request.Headers.UserAgent != null ? request.Headers.UserAgent.ToString() : string.Empty;

                RestApiCallsEventSource.Log.LogRestApiCallStart(
                    fullRequest,
                    request.Headers.ToStringWithoutPII(),
                    requestId,
                    userAgent);

                Stopwatch stopWatch = Stopwatch.StartNew();
                HttpResponseMessage response = await base.SendAsync(request, cancellationToken);
                stopWatch.Stop();

                SetResponseHeaders(request, response);

                bool isError = !response.IsSuccessStatusCode;
                int statusCode = (int)response.StatusCode;

                RestApiCallsEventSource.Log.LogRestApiCallEnd(
                    fullRequest,
                    statusCode,
                    response.Headers.ToString(),
                    requestId,
                    stopWatch.ElapsedMilliseconds);

                if (cancellationToken.IsCancellationRequested)
                {
                    mLogger.Write(TraceEventType.Warning, "HTTP request cancelled, Id: {0}, fullRequest: {1}", requestId, fullRequest);
                }

                return response;
            }
        }

        private static void SetResponseHeaders(HttpRequestMessage request, HttpResponseMessage response)
        {
            response.Headers.SetServerRequestId(request.GetCorrelationId());
        }
    }
}