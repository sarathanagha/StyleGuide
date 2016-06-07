using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Microsoft.DataStudio.Services.Data.Models.Enums
{
    [DataContract]
    public enum PropertyType
    {
        [EnumMember]
        String,

        [EnumMember]
        Int,

        [EnumMember]
        Float,

        [EnumMember]
        Boolean,

        [EnumMember]
        Double,

        [EnumMember]
        Enumerated,

        [EnumMember]
        Group,

        [EnumMember]
        Table,

        [EnumMember]
        Script,

        [EnumMember]
        Credential
    }
}