// <copyright>
// Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>

namespace Microsoft.DataStudio.Services.Data.Models.Interfaces
{
    public interface IResourcePropertyRule
    {
       string Pattern { get; set; }

       int Maxlength { get; set; }

       int Max { get; set; }

       int Min { get; set; }
    }
}