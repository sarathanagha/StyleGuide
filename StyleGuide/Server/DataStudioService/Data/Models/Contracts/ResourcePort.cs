// <copyright>
// Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>

using Microsoft.DataStudio.Services.Data.Models.Interfaces;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;

namespace Microsoft.DataStudio.Services.Data.Models.Contracts
{
    using System;
    using System.Globalization;

    using Microsoft.DataStudio.Services.Data.Models.Constants;

    using Newtonsoft.Json;

    [DataContract]
    public class ResourcePort : IResourcePort
    {
        private string _description;
        private string _friendlyname;

        public ResourcePort()
        {
        }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string Description
        {
            get { return string.IsNullOrEmpty(this._description) ? Name : this._description; }
            set { this._description = value; }
        }

        [DataMember]
        public Collection<ResourceType> AllowedTypes { get; set; }

        [DataMember]
        public string FriendlyName
        {
            get { return string.IsNullOrEmpty(this._friendlyname) ? Name : this._friendlyname; }
            set { this._friendlyname = value; }
        }

        [DataMember]
        public bool IsOptional { get; set; }

    }
}
