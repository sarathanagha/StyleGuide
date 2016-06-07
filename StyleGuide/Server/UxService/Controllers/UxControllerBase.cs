using System;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.WebRole.Common.Controllers;

namespace Microsoft.DataStudio.UxService.Controllers
{
    public class UxControllerBase : ControllerBase
    {
        public UxControllerBase(ILogger logger) : base(logger)
        {
        }
    }
}