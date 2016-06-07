using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Microsoft.DataStudio.UxMonitoring.WebRole.Contracts
{
    public class EventBase
    {
#pragma warning disable 649 // Field 'fieldName' is never assigned to, and will always have its default value {value}
        [JsonExtensionData]
        private IDictionary<string, JToken> _customProperties;
#pragma warning restore 649

        public string ModuleName { get; set; }

        public string LoggerName { get; set; }

        public string Category { get; set; }

        [JsonIgnore]
        public IDictionary<string, string> CustomProperties
        {
            get
            {
                if (_customProperties == null)
                    return null;

                return _customProperties.ToDictionary(kp => kp.Key, kp =>
                {
                    if (kp.Value.Type == JTokenType.Undefined || kp.Value.Type == JTokenType.Null)
                    {
                        return null;
                    }

                    if (kp.Value.Type == JTokenType.String)
                    {
                        return (string)kp.Value;
                    }

                    // Return other types in JSON representation
                    return kp.Value.ToString(Formatting.None);
                });
            }
        }
    }
}