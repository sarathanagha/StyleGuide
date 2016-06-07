using System;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.UxService.Contracts;
using Microsoft.DataStudio.WebRole.Common.Controllers;
using System.Net.Http;
using System.Web.Mvc;
using System.Text;
using System.Reflection;
using System.IO;

namespace Microsoft.DataStudio.UxService.Controllers
{
    // We don't want to do this extra AuthN work for a call that just returns the environment configuration. If this is needed later, uncomment the below line.
    // [Authorize]
    public class OAuthRedirectController : ApiController
    {
        [System.Web.Http.Route("OAuthRedirect")]
        [System.Web.Http.HttpGet]
        public HttpResponseMessage Get()
        {
            var assembly = typeof(OAuthRedirectController).Assembly;

            const string resourceName = "Microsoft.DataStudio.UxService.OAuthRedirect.html";
            string result = "";
            using (var stream = assembly.GetManifestResourceStream(resourceName))
            {
                using (StreamReader reader = new StreamReader(stream))
                {
                    result = reader.ReadToEnd();
                }
            }

            return new HttpResponseMessage()
            {
                Content = new StringContent(result, Encoding.UTF8, "text/html")
            };
        }
    }
}