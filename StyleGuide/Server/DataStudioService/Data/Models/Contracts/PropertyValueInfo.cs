// <copyright>
// Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>

using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;
using System.Web.UI.WebControls;
using Microsoft.DataStudio.Services.Data.Models.Interfaces;

namespace Microsoft.DataStudio.Services.Data.Models.Contracts
{
    public class PropertyValueInfo
    {
        // Display Value of the parameter or drop down item
        [DataMember]
        public string Key { get; set; }

        // Parameters that may be associated with that value
        [DataMember]
        public Value Value { get; set; }
    }

    public class Value
    {
        public string DisplayValue { get; set; }
        public Collection<ResourceProperty> Parameters { get; set; }
    }
}
