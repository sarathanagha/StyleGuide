using System;
using System.Web.Http.Controllers;

namespace Microsoft.DataStudio.Hub.Authorization.Contracts
{
    public interface IAuthContextInitializer
    {
        void Initialize(HttpActionContext actionContext);
    }
}