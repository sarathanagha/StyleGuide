// <copyright>
// Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>


using System.Runtime.Serialization;
using System.Collections.ObjectModel;
using Microsoft.DataStudio.Services.Data.Models.Interfaces;

namespace Microsoft.DataStudio.Services.Data.Models.Contracts
{
    /// <summary>
    /// Resource Class. This is the basic leaf node and building block to create a deployeable solution entity.
    /// </summary>
    [KnownType(typeof(ResourcePort))]
    [KnownType(typeof(ResourceProperty))]
    public class Resource
    {
        public Resource()
        {
                
        }

        [DataMember]
        public string Id { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public string FamilyId { get; set; }

        [DataMember]
        public string Category { get; set; }

        [DataMember]
        public Collection<Resource> Items { get; set; }

        [DataMember]
        public Collection<ResourcePort> InputPorts { get; set; }

        [DataMember]
        public Collection<ResourcePort> OutputPorts { get; set; }
        [DataMember]
        public Collection<ResourceProperty> Properties { get; set; }
    }
}
