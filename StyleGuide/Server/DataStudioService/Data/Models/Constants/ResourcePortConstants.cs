using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Microsoft.DataStudio.Services.Data.Models.Constants
{
    public static class ResourcePortConstants
    {
        // todo: vija confirm with PM's - ML has same rule thus keeping it similar
        public const int MaxPortNameLength = 128;

        public const string DefaultTag = "default";

        public const string DescriptionTag = "description";

        public const string FriendlyNameTag = "friendlyname";

        public const string InputPortTag = "in";

        public const string OutputPortTag = "out";
    }
}