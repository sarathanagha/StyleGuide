using System;
using Microsoft.DataStudio.Solutions.Validators;

namespace Microsoft.DataStudio.Solutions.Helpers
{
    public static class CommonUtils
    {
        public static void ConvertToLowerCase(ref string input, string argName)
        {
            ThrowIf.NullOrEmpty(input, argName);
            input = input.ToLowerInvariant();
        }
    }
}
