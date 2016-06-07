using System.Collections.Generic;

namespace Microsoft.DataStudio.Services.Data.Models.Solutions
{
    internal class NativeSolutionDetailsProperties
    {
        public NativeSolutionDetailsProperties()
        {
            History = new List<SolutionDetailsHistory>();
            Diagram = new SolutionDiagram();
        }

        public string SolutionAcceleratorName { get; set; }
        public string SolutionAcceleratorUrl { get; set; }
        public string DefaultSubscription { get; set; }

        public List<SolutionDetailsHistory> History { get; set; }

        public SolutionDiagram Diagram { get; set; }
    }
}