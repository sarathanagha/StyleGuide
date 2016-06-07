using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using CloudBlobContainer = Microsoft.WindowsAzure.Storage.Blob.CloudBlobContainer;

namespace Microsoft.CortanaAnalytics.Models
{

    public class SolutionDiagramItem
    {
        // TODO: [chrisriz] Once we get the diagram work complete we can update 
        // this model with the additional details.
    }

    public class SolutionDiagram
    {
        // TODO: [chrisriz] Once we get the diagram work complete we can update 
        // this model with the additional details.
    }

    public class Solution
    {
        public string ID { get; set; }

        [Key]
        public string Name { get; set; }
    }

    internal class NativeSolution : Solution
    {
        public CloudBlobContainer Container { get; set; }
        public string BlobName { get; set; }
    }

    // This is done as flags as on modifications there can be multiple types of
    // change.  This allows us to overload what changes are happening and have 
    // discrete data so that we will eventually be able to corresponding text
    // in different languages in the future.
    [Flags]
    public enum SolutionDetailsChangeType
    {
        Created = 0,
        ModifiedAddedAzureResource = 2,
        ModifiedChangedDiagramLayout = 4,
        RemovedAzureResourceFromSolution = 8,
        DeletedSolution = 16
    }

    public class SolutionDetailsHistory
    {
        private string _changeDateString;

        public string ChangedByUser { get; set; }
        public SolutionDetailsChangeType Note { get; set; }

        public DateTime ChangedDateTime {
            get
            {
                return DateTime.Parse(_changeDateString);
            }
            set {
                _changeDateString = value.ToString("yyyy-MM-dd HH:mm:ss.ffffff", CultureInfo.InvariantCulture);
            } 
        }
    }

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