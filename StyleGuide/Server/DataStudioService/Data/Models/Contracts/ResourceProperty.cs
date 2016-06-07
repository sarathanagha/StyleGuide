// <copyright>
// Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>

using Microsoft.DataStudio.Services.Data.Models.Enums;
using Microsoft.DataStudio.Services.Data.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;

namespace Microsoft.DataStudio.Services.Data.Models.Contracts
{
    [DataContract]
    [KnownType(typeof(PropertyRules))]
    public class ResourceProperty : IResourceProperty
    {
        private bool _hasDefaultValue;

        public ResourceProperty()
        {

        }

        [DataMember]
        public string PropertyName { get; set; }

        [DataMember]
        public string PropertyValue { get; set; }

        [DataMember]
        public PropertyType PropertyType { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public string FriendlyName { get; set; }
      
        [DataMember]
        public string DefaultValue { get; set; }

        [DataMember]
        public Collection<PropertyValueInfo> PropertyValueInfo { get; set; }

        [DataMember]
        public Collection<ResourceProperty> Properties { get; set; }

        [DataMember]
        public Collection<Collection<ResourceProperty>> TableProperties { get; set; }

        [DataMember]
        public string ScriptName { get; set; }

        [DataMember]
        public PropertyRules PropertyRules { get; set; }

        [DataMember]
        public Boolean HasRules { get; set; }

        [DataMember]
        public bool IsOptional { get; set; }

        [DataMember]
        public bool HasDefaultValue
        {
            get
            {
                _hasDefaultValue = !string.IsNullOrEmpty(DefaultValue);
                return _hasDefaultValue;
            }

            set
            {
                _hasDefaultValue = value;
            }
        }
        public bool IsToBeEncrypted
        {
            get
            {
                return PropertyType == PropertyType.Credential;
            }
        }
    }
}
