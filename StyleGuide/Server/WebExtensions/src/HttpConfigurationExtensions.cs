using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Microsoft.DataStudio.WebExtensions
{
    public static class HttpConfigurationExtensions
    {
        public static void EnableCors(this HttpConfiguration config, string allowedOrigins, bool fAllowHttp)
        {
            string[] allowedOriginList = allowedOrigins.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
            var corsUrls = string.Join(",", allowedOriginList.Select(u => "https://" + u));

            if (fAllowHttp)
            {
                corsUrls += ("," + string.Join(",", allowedOriginList.Select(u => "http://" + u)));
            }

            var cors = new EnableCorsAttribute(corsUrls, "*", "*");
            config.EnableCors(cors);
        }
    }
}
