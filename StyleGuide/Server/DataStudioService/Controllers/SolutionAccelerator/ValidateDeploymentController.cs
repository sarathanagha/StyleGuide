//using System;
//using System.Linq;
//using System.Web.Http;
//using Microsoft.Azure.Management.Resources.Models;

//namespace Microsoft.DataStudio.Services.Controllers.SolutionAccelerator
//{
//    [Authorize]
//    public class ValidateDeploymentController : ApiController
//    {
//        [HttpGet]
//        [Route("api/{subscriptionId}/solutions/validate/{templateId}")]
//        public DeploymentValidateResponse Get([FromUri] string resourceGroup, [FromUri] string subscriptionId, [FromUri] string solutionAccelerator)
//        {
//            var headers = base.Request.Headers;

//            var slnmgr = new StorageDataManager(AzureStorageClientManager.GetBlobClient());
//            var saKey = solutionAccelerator.ToLower();
//            var saParameters = saKey + "parameters";
//            var templateLinks = slnmgr.GetListOfSolutionAccelerators();

//            if (!templateLinks.ContainsKey(saKey))
//            {
//                throw new Exception("A solution accelerator requested to deploy does not exists.");
//            }

//            var prov = new Provision(subscriptionId, headers.GetValues("token").First());
//            var saDeploymentProperties = new SADeploymentProperties();
//            if (templateLinks.Keys.Contains(saKey))
//            {
//                saDeploymentProperties.TemplateLink = templateLinks[saKey];
//            }
//            if (templateLinks.Keys.Contains(saParameters))
//            {
//                saDeploymentProperties.ParametersLink = templateLinks[saParameters];
//            }

//            return prov.ValidateTemplate(resourceGroup, saDeploymentProperties);
//        }
//    }
//}