namespace Microsoft.DataStudio.Solutions.Model
{
    public class SolutionDeploymentProperties
    {
        public string SolutionDeploymentId { get; set; }

        public string ResourceGroupName { get; set; }

        public string TemplateId { get; set; }

        public string Topology { get; set; }

        public string Parameters { get; set; }

        public string SolutionName { get; set; }

        // Temp property
        public string Token { get; set; }
    }
}
