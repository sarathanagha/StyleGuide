//------------------------------------------------------------------------------
// <copyright>
//     Copyright (c) Microsoft Corporation. All Rights Reserved.
// </copyright>
//------------------------------------------------------------------------------

using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Microsoft.Streaming.Service.NrtDeploy
{    
    internal static class ActivityExtension
    {
        public static IEnumerable<Parameter> GetParameters(this Activity workflow)
        {
            Type t = workflow.GetType();
            foreach (var property in t.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                      .Where(p => p.PropertyType == typeof(InArgument) ||
                                                  p.PropertyType.IsSubclassOf(typeof(InArgument)) ||
                                                  p.PropertyType == typeof(InOutArgument) ||
                                                  p.PropertyType.IsSubclassOf(typeof(InOutArgument))))
            {
                if (property.GetCustomAttributes(true).Any(a => a is RequiredArgumentAttribute))
                {
                    yield return new Parameter { Name = property.Name, IsRequired = true };
                }
                else
                {
                    yield return new Parameter { Name = property.Name };
                }
            }
        }
    }
}

