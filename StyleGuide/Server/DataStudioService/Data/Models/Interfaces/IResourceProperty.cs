// <copyright>
// Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>

using Microsoft.DataStudio.Services.Data.Models.Enums;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Microsoft.DataStudio.Services.Data.Models.Interfaces
{
    public interface IResourceProperty
    {
        string PropertyName { get; set; }
        string PropertyValue { get; set; }
        string DefaultValue { get; set; }
        string Description { get; set; }
        string FriendlyName { get; }
        bool IsOptional { get; }
        PropertyType PropertyType { get; }
    }
}