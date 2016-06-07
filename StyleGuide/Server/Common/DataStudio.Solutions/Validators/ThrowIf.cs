using System;
using System.Diagnostics;

namespace Microsoft.DataStudio.Solutions.Validators
{
    public class ThrowIf
    {
        /// <summary>
        /// Throws ArgumentNullException if the argument is null, otherwise passes it through.
        /// </summary>
        /// <typeparam name="T">The argument type.</typeparam>
        /// <param name="arg">The argument to check.</param>
        /// <param name="parameterName">The parameter name of the argument.</param>
        [DebuggerStepThrough]
        public static void Null<T>([ValidatedNotNull]T arg, string parameterName) where T : class
        {
            if (arg == null)
            {
                throw new ArgumentNullException(parameterName);
            }
        }

        [DebuggerStepThrough]
        public static void NullOrEmpty([ValidatedNotNull]string paramValue, string paramName)
        {
            ThrowIf.Null(paramValue, paramName);

            if (paramValue.Length == 0)
            {
                throw new ArgumentException("Parameter must have length greater than zero.", paramName ?? "");
            }
        }
    }

    /// <summary>
    /// Secret attribute that tells the CA1062 validate arguments rule that this method validates the argument is not null.
    /// </summary>
    /// <remarks>
    /// This is an internal-only workaround. Please do not share publicly.
    /// </remarks>
    [AttributeUsage(AttributeTargets.Parameter)]
    internal sealed class ValidatedNotNullAttribute : Attribute
    {
    }
}