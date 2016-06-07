namespace Microsoft.DataStudio.Services.Extensions
{
    using System.Globalization;

    /// <summary>
    /// class for string extension methods
    /// </summary>
    public static class StringExtensions
    {
        /// <summary>
        /// Formats the arguments invariant.
        /// </summary>
        /// <param name="format">The format.</param>
        /// <param name="args">The arguments.</param>
        /// <returns></returns>
        public static string FormatArgsInvariant(this string format, params object[] args)
        {
            return string.Format(CultureInfo.InvariantCulture, format, args);
        }

        /// <summary>
        /// Formats the arguments.
        /// </summary>
        /// <param name="format">The format.</param>
        /// <param name="args">The arguments.</param>
        /// <returns></returns>
        public static string FormatArgs(this string format, params object[] args)
        {
            return string.Format(CultureInfo.CurrentCulture, format, args);
        }
    }
}