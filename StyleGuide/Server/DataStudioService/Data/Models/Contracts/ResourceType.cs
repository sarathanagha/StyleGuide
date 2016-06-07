// <copyright>
// Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>

using System.Runtime.Serialization;

namespace Microsoft.DataStudio.Services.Data.Models.Contracts
{
    [DataContract]
    public class ResourceType
    {
        [DataMember]
        public string Description { get; set; }
        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public string Name { get; set; }
    }

}