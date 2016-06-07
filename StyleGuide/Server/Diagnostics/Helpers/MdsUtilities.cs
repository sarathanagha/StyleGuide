using System;

namespace Microsoft.DataStudio.Diagnostics
{
    public static class MdsUtilities
    {
        private static readonly int AzureTableCompliant = 31 * 1024; // Azure table does not support columns which are longer then 64KB. As we are unicode we are talking about 32K strings. taking a little bit of extra saving.
        private static readonly DateTime MinFileTimeDateTime = DateTime.FromFileTimeUtc(0);

        public static void MakeMdsCompatible(ref String str)
        {
            str = str ?? String.Empty;
            if (str.Length > AzureTableCompliant)
            {
                str = str.Remove(AzureTableCompliant);
            }
        }

        public static void MakeMdsCompatible(ref DateTime dt)
        {
            if (dt >= MinFileTimeDateTime)
            {
                return;
            }
            dt = MinFileTimeDateTime;
        }
    }
}