using System;
using System.Collections.Generic;
using System.Linq;

namespace Microsoft.DataStudio.Solutions.Helpers
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<T> EmptyIfNull<T>(this IEnumerable<T> source)
        {
            return source ?? Enumerable.Empty<T>();
        }
    }
}
