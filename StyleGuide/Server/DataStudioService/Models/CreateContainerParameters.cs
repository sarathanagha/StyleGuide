
namespace Microsoft.DataStudio.Services.Models
{
    public class CreateContainerParameters
    {
        public string ContainerName;
        public string SourceContainerSasUri;
        public string DestinationContainerConnectionString;
        public bool Copy;
    }
}