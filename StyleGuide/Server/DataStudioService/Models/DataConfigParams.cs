using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Microsoft.DataStudio.Services.Controllers.SolutionAccelerator
{
    public class DataGeneratorConfig
    {
        public string ZipFileUrl;
        public string ConfigName;
        public string GeneratorName;
        public Dictionary<string, string> Parameters;
        public string ConnectionString;
        public string ContainerName;
    }
}
