using System;
using System.IO;
using System.Net;
using System.Text;
using System.Linq;
using System.Collections.Generic;

using Microsoft.WindowsAzure.Storage;
using Microsoft.CortanaAnalytics.Models;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.RetryPolicies;

using Newtonsoft.Json.Linq;

namespace Microsoft.CortanaAnalytics.SolutionRole.DataSource
{
    public class StorageDataSource
    {
        public CloudBlobClient blobClient;

        public StorageDataSource(CloudBlobClient cloudBlobClient)
        {
            blobClient = cloudBlobClient;
            blobClient.DefaultRequestOptions.RetryPolicy = new ExponentialRetry(TimeSpan.FromSeconds(0.3), 10);
        }

        private CloudBlobContainer GetContainer(string containerName)
        {
            if (string.IsNullOrEmpty(containerName))
            {
                return null;
            }
            else
            {
                var container = blobClient.GetContainerReference(containerName.ToLower());
                container.CreateIfNotExists();
                return container;
            }
        }

        #region Write Logic
        // TODO: [chrisriz] We need to have JSON payload represnting the displayed graph.  This will land early next week.
        internal NativeSolutionDetails WriteNewSolution(string subscriptionId, string createdByUserId, string solutionName, string solutionAcceleratorName = "", string solutionAcceleratorUrl = "")
        {
            var blobContainer = GetContainer(subscriptionId);

            var details = new NativeSolutionDetails();
            details.Container = blobContainer;

            details.ID = Guid.NewGuid().ToString();
            details.Name = solutionName;

            details.BlobName = solutionName; // TODO: [chrisriz] make sure the "friendlyName" is trnaslated to a valid blobName

            if (details.Exists())
            {
                throw new SolutionNameAlreadyInUseException();
            }
            else
            {
                details.Properties.SolutionAcceleratorName = solutionAcceleratorName;
                details.Properties.SolutionAcceleratorUrl = solutionAcceleratorUrl;
                details.Properties.History.Add(new SolutionDetailsHistory()
                {
                    ChangedByUser = createdByUserId,
                    ChangedDateTime = DateTime.UtcNow,
                    Note = SolutionDetailsChangeType.Created
                });

                details.WritePropertiesToBlob();
            }

            return details;
        }

        // TODO: [chrisriz] This will get udpated later today
        internal void WriteUpdateToSolution(string subscriptionId, string modifiedByUserId, NativeSolutionDetails newSlnDetails)
        {
            if (newSlnDetails.ETag == "")
            {
                // TODO [chrisriz] Throw exception as no ETag exists.
            }

            var blobContainer = GetContainer(subscriptionId);

            var sln = new NativeSolution();            
            sln.Container = blobContainer;
            sln.BlobName = newSlnDetails.BlobName;

            if (newSlnDetails.Container == null)
            {
                newSlnDetails.Container = blobContainer;
            }

            newSlnDetails.WritePropertiesToBlob();            

        }
        #endregion

        #region Read Logic

        internal IEnumerable<NativeSolution> GetListOfSolutions(string subscriptionId, string solutionName = "")
        {
            var blobContainer = GetContainer(subscriptionId);

            if (blobContainer == null)
            {
                yield break;
            }
            else
            {
                var listOfBlobs = blobContainer.ListBlobs(null, true, BlobListingDetails.All).Cast<CloudBlockBlob>();
                foreach (var blob in listOfBlobs)
                {
                    yield return new NativeSolution()
                    {
                        // TODO: [chrisriz] Remove the terenary operator logic and just use the values after the 
                        // the provisioning pieces and blob publish is in place.
                        ID = blob.Metadata.ContainsKey("id") ? blob.Metadata["id"] : blob.Properties.ETag,
                        Name = blob.Metadata.ContainsKey("friendlyName") ? blob.Metadata["friendlyName"] : blob.Name,
                        BlobName = blob.Name,
                        Container = blobContainer
                    };

                    if (solutionName != "" && blob.Name.ToLower() == solutionName.ToLower())
                    {
                        yield break;
                    }
                }
            }
        }
        #endregion
    }

    #region Extension Methods (Serialization and Interaction with Storage)
    public static partial class NativeSolutionExtentionMethods
    {
        internal static JObject GetJSONPackage(this NativeSolution sln)
        {
            JObject result = null;
            using (var ms = new MemoryStream())
            {
                var blockBlob = sln.Container.GetBlockBlobReference(sln.BlobName);
                blockBlob.DownloadToStream(ms);
                var jsonSln = System.Text.Encoding.UTF8.GetString(ms.ToArray());
                result = JObject.Parse(jsonSln);
            }

            return result;
        }

        internal static NativeSolutionDetails GetNativeSolutionWithDetails(this NativeSolution sln)
        {
            NativeSolutionDetails result = null;

            var props = sln.GetJSONPackage();

            var tmp = JObject.FromObject((Solution)sln);
            tmp["Properties"] = props;

            result = tmp.ToObject<NativeSolutionDetails>();
            result.BlobName = sln.BlobName;
            result.Container = sln.Container;

            var blockBlob = result.Container.GetBlockBlobReference(sln.BlobName);
            result.ID = blockBlob.Metadata["id"];
            result.Name = blockBlob.Metadata["friendlyName"];
            result.ETag = blockBlob.Properties.ETag;

            return result;
        }

        internal static JObject GetJSONPackage(this NativeSolutionDetails sln)
        {
            JObject result = null;
            using (var ms = new MemoryStream())
            {
                var blockBlob = sln.Container.GetBlockBlobReference(sln.BlobName);
                blockBlob.DownloadToStream(ms);
                var jsonSln = System.Text.Encoding.UTF8.GetString(ms.ToArray());
                result = JObject.Parse(jsonSln);
            }

            return result;
        }

        internal static JObject GetJSONFromObject(this NativeSolutionDetailsProperties props)
        {
            return JObject.FromObject(props);
        }

        internal static void WritePropertiesToBlob(this NativeSolutionDetails sln)
        {
            var blockBlob = sln.Container.GetBlockBlobReference(sln.BlobName);
            blockBlob.Metadata["id"] = sln.ID;
            blockBlob.Metadata["friendlyName"] = sln.Name;

            var encodedJSONStr = Encoding.ASCII.GetBytes(sln.Properties.GetJSONFromObject().ToString());

            try
            {
                using (var ms = new MemoryStream(encodedJSONStr, 0, encodedJSONStr.Length))
                {
                    // If the ETag is not empty, use this for implementing
                    // optimistic concurrency and avoid any data loss.  This
                    // means that a users edits must be applied against the 
                    // same version of data residing in the blob.
                    if (blockBlob.Properties.ETag != string.Empty)
                    {
                        blockBlob.UploadFromStream(ms, AccessCondition.GenerateIfMatchCondition(blockBlob.Properties.ETag));
                    }
                    else
                    {
                        blockBlob.UploadFromStream(ms);
                    }
                }
            }
            catch (StorageException ex)
            {
                if (ex.RequestInformation.HttpStatusCode == (int)HttpStatusCode.PreconditionFailed)
                {
                    // TODO: [chrisriz] Better handle the data conflict
                    throw ex;
                }
                else
                {
                    throw;
                } 
            }
        }

        internal static bool Exists(this NativeSolution sln)
        {
            return sln.Container.GetBlockBlobReference(sln.BlobName).Exists();
        }

        internal static IEnumerable<Solution> GetSolutionObjects(this IEnumerable<NativeSolution> nativeSlns)
        {
            return nativeSlns.Cast<Solution>();
        }

        internal static IEnumerable<JObject> GetJSONPackages(this IEnumerable<NativeSolution> nativeSlns)
        {
            foreach(var n in nativeSlns)
            {
                yield return n.GetJSONPackage();
            }
        }
    }
    #endregion

    #region Exceptions
    public class SolutionNameAlreadyInUseException:Exception
    {

    }
    #endregion
}
