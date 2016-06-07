using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Microsoft.DataStudio.Services.Models
{
    public class Value
    {
        public List<string> Actions { get; set; }
        public List<string> NotActions { get; set; }
    }

    public class Permissions
    {
        public List<Value> Value { get; set; }
        public string NextLink { get; set; }
    }

    [Flags]
    public enum AccessLevel
    {
        None = 0,
        Read = 1,
        Write = 2,
        ReadWrite = Read | Write
    }
}
