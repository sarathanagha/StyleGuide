using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Microsoft.DataStudio.Services.Data.Models.Solutions;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json.Linq;

namespace Microsoft.DataStudio.Services.Data.Managers
{
    public static class NativeSolutionExtentionMethods
    {
        internal static JObject GetJSONPackage(this NativeSolution sln)
        {
            JObject result = null;
            using (var ms = new MemoryStream())
            {
                var blockBlob = sln.Container.GetBlockBlobReference(sln.BlobName);
                blockBlob.DownloadToStream(ms);
                var jsonSln = Encoding.UTF8.GetString(ms.ToArray());
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
            result.GraphUrl = blockBlob.Metadata.ContainsKey("graphurl")
                ? blockBlob.Metadata["graphurl"]
                : "https://caslnacc.blob.core.windows.net/graphs/customerchurn.svg";
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
                var jsonSln = Encoding.UTF8.GetString(ms.ToArray());
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
            blockBlob.Metadata["graphurl"] = sln.GraphUrl;

            var encodedJSONStr = Encoding.ASCII.GetBytes(sln.Properties.GetJSONFromObject().ToString());

            try
            {
                using (var ms = new MemoryStream(encodedJSONStr, 0, encodedJSONStr.Length))
                {
                    // If the ETag is not empty, use this for implementing
                    // optimistic concurrency and avoid any data loss.  This
                    // means that a users edits must be applied against the 
                    // same version of data residing in the blob.
                    if (!string.IsNullOrEmpty(blockBlob.Properties.ETag))
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
            foreach (var n in nativeSlns)
            {
                yield return n.GetJSONPackage();
            }
        }
    }
}