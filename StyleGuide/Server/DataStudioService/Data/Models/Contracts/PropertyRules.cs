// <copyright>
// Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>

namespace Microsoft.DataStudio.Services.Data.Models.Contracts
{
    using System;
    using System.Collections.ObjectModel;
    using System.Linq;
    using System.Runtime.Serialization;
    using System.Web.UI.WebControls;

    using Microsoft.DataStudio.Services.Data.Models.Interfaces;
    using Microsoft.DataStudio.Services.Extensions;

    [DataContract]
    public class PropertyRules : IResourcePropertyRule
    {
        public string Pattern { get; set; }

        public int Maxlength { get; set; }

        public int Max { get; set; }

        public int Min { get; set; }

        public PropertyRules()
        {

        }
    }
}