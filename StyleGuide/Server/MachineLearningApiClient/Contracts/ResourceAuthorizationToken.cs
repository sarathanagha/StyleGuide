using System;
using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.MachineLearning.Contracts
{
    public class ResourceAuthorizationToken
    {
        public string PrimaryToken { get; set; }

        public string SecondaryToken { get; set; }
    }
}
