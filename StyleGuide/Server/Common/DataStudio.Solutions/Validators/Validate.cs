using System;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace Microsoft.DataStudio.Solutions.Validators
{
    public static class Validate
    {
        [DebuggerStepThrough]
        public static void TableName([ValidatedNotNull]string paramValue, string paramName)
        {
            ThrowIf.Null(paramValue, paramName);

            var regex = new Regex("^[A-Za-z][A-Za-z0-9]{2,62}$", RegexOptions.Compiled);
            if (!regex.IsMatch(paramValue))
            {
                throw new ArgumentException("Table names must conform to these rules: " +
                    "May contain only alphanumeric characters. " +
                    "Cannot begin with a numeric character. " +
                    "Are case-insensitive. " +
                    "Must be from 3 to 63 characters long.", paramName ?? "");
            }
        }

        [DebuggerStepThrough]
        public static void TablePropertyValue([ValidatedNotNull]string paramValue, string paramName)
        {
            ThrowIf.Null(paramValue, paramName);

            var regex = new Regex(@"^[^/\\#?]{0,1024}$", RegexOptions.Compiled);
            if (!regex.IsMatch(paramValue))
            {
                throw new ArgumentException("Table property values must conform to these rules: " +
                    "Must not contain the forward slash (/), backslash (\\), number sign (#), or question mark (?) characters. " +
                    "Must be from 1 to 1024 characters long.", paramName ?? "");
            }
        }

        [DebuggerStepThrough]
        public static void QueueName([ValidatedNotNull]string paramValue, string paramName)
        {
            ThrowIf.Null(paramValue, paramName);

            var regex = new Regex("^(?-i)(?:[a-z0-9]|(?<=[0-9a-z])-(?=[0-9a-z])){3,63}$", RegexOptions.Compiled);
            if (!regex.IsMatch(paramValue))
            {
                throw new ArgumentException("Queue names must conform to these rules: " +
                    "Must start with a letter or number, and can contain only letters, numbers, and the dash (-) character. " +
                    "The first and last letters in the queue name must be alphanumeric. The dash (-) character cannot be the first or last character. Consecutive dash characters are not permitted in the queue name. " +
                    "All letters in a queue name must be lowercase. " +
                    "Must be from 3 to 63 characters long.", paramName ?? "");
            }
        }

        [DebuggerStepThrough]
        public static void NotNull([ValidatedNotNull]object paramValue, string message)
        {
            if (paramValue == null)
            {
                throw new ArgumentException(message);
            }
        }
    }
}