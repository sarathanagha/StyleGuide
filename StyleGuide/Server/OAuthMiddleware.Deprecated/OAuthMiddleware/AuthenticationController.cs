using System.Web;
using System.Web.Mvc;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using Microsoft.DataStudio.OAuthMiddleware.Models;


namespace Microsoft.DataStudio.OAuthMiddleware
{

    /// <summary>
    /// Sign Out Controller for the application. 
    /// </summary>
    /// <remarks>This class is responsible for clearing the Authentication manager and signing out the user.</remarks>
    public class AccountController : Controller
    {
        public void SignOut()
        {
            if (HttpContext.GetOwinContext() != null)
            {
                HttpContext.GetOwinContext().Authentication.SignOut(OpenIdConnectAuthenticationDefaults.AuthenticationType, CookieAuthenticationDefaults.AuthenticationType);
            }
        }

        public ActionResult GetConfiguration()
        {
            return Content(ServiceConfiguration.Default(), "application/json");
        }
    }
}