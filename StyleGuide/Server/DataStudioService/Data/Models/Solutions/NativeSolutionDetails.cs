namespace Microsoft.DataStudio.Services.Data.Models.Solutions
{
    internal class NativeSolutionDetails : NativeSolution
    {
        public NativeSolutionDetails()
        {
            Properties = new NativeSolutionDetailsProperties();
        }

        public string ETag { get; set; }

        public string LeaseForEdit { get; set; }

        public NativeSolutionDetailsProperties Properties { get; set; }
    }
}