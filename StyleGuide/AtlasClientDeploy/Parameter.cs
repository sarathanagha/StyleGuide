//------------------------------------------------------------------------------
// <copyright>
//     Copyright (c) Microsoft Corporation. All Rights Reserved.
// </copyright>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;

namespace Microsoft.Streaming.Service.NrtDeploy
{
    internal class Parameter
    {
        public const char ValueSeparator = ':';

        public static readonly char[] ParameterSpecifiers = new[] { '/', '-' };
        
        public Parameter()
        {
        }

        public Parameter(string parameter)
        {
            if (string.IsNullOrWhiteSpace(parameter))
            {
                throw new ArgumentException("Parameter cannot be null or empty string.");
            }

            parameter = parameter.Trim();
            if (ParameterSpecifiers.All(s => s != parameter[0]))
            {
                IsOrphan = true;
                Value = parameter;
                return;
            }

            IsOrphan = false;
            parameter = parameter.Substring(1);
            if (string.IsNullOrEmpty(parameter))
            {
                throw new ArgumentException("Empty parameter passed.");
            }

            int separator = parameter.IndexOf(ValueSeparator);
            if (separator > 0)
            {
                Name = parameter.Substring(0, separator).ToUpperInvariant();
                Value = parameter.Substring(separator + 1);
            }
            else
            {
                Name = parameter.ToUpperInvariant();
                Value = null;
            }
        }

        public string Name { get; set; }

        public string Value { get; set; }

        public bool IsOrphan { get; set; }

        public bool IsRequired { get; set; }

        public static IEnumerable<Parameter> Parse(string[] paras)
        {
            if (paras == null)
            {
                return Enumerable.Empty<Parameter>();
            }

            return paras.Select(p => new Parameter(p));
        }
    }
}

