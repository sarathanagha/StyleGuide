// <copyright>
// Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>

using System.Collections.ObjectModel;
using Microsoft.DataStudio.Services.Data.Models.Contracts;

namespace Microsoft.DataStudio.Services.Data.Models.Interfaces
{
    public interface IResourcePort
    {
        bool IsOptional { get; set; }
        string Description { get; set; }
        string Name { get; set; }
        Collection<ResourceType> AllowedTypes { get; set; }
    }
}