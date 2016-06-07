using Microsoft.Azure;
using Microsoft.Azure.Management.Resources;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Models;
using Microsoft.DataStudio.Services.Security;
using Microsoft.DataStudio.Solutions.Model;
using Microsoft.DataStudio.Solutions.Queues.Entities;
using Microsoft.DataStudio.Solutions.Tables.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using mdsm = Microsoft.DataStudio.Solutions.Model;

namespace Microsoft.DataStudio.Services.Controllers.SolutionAccelerator
{
    [Authorize]
    public class SolutionController : SolutionControllerBase
    {
        // TODO: [parvezp] Refine the version support to the API controllers
        private string CurrentApiVersion = "1.0";

        public SolutionController(ILogger logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("api/solutions")]
        [ResponseType(typeof(IEnumerable<Solution>))]
        public async Task<IHttpActionResult> Get()
        {
            List<string> subscriptionIds = await GetSubscriptionsForCurrentTenant();
            List<Solution> activeSolutions = new List<Solution>();

            if (subscriptionIds != null)
            {
                logger.Write(TraceEventType.Verbose, "HttpPost AllSolutions: Get list of solutions for subscriptionsIds: {0}", subscriptionIds.ToString());
                
                foreach (string subscription in subscriptionIds)
                {
                    activeSolutions.AddRange(await GetSolutions(subscription));
                }

                logger.Write(TraceEventType.Verbose, "HttpPost AllSolutions: Retrieved solutions for list subscriptionsIds: {0}", subscriptionIds.ToString());                
            }

            return Ok<IEnumerable<Solution>>(activeSolutions);
        }

        [HttpGet]
        [Route("api/{subscriptionId}/solutions")]
        [ResponseType(typeof(IEnumerable<Solution>))]
        public async Task<IHttpActionResult> Get([FromUri]string subscriptionId)
        {
            await CheckAccessLevel(subscriptionId, AccessLevel.Read);

            var solutions = await GetSolutions(subscriptionId);
            return Ok<IEnumerable<Solution>>(solutions);
        }

        [HttpGet]
        [ResponseType(typeof(Solution))]
        [Route("api/{subscriptionId}/solutions/{solutionId}")]
        public async Task<IHttpActionResult> Get([FromUri]string subscriptionId, [FromUri]string solutionId)
        {
            await CheckAccessLevel(subscriptionId, AccessLevel.Read);

            var solutionTableStorage = GetSolutionTableStorage(subscriptionId);
            SolutionEntity solutionEntity = await solutionTableStorage.GetAsync(solutionId);

            logger.Write(solutionEntity != null? TraceEventType.Verbose : TraceEventType.Information, "HttpGet Solution: Get solution {0} for solutionId:{1} and subscriptionId:{2}", solutionEntity != null ? "succeeded" : "failed", solutionId, subscriptionId);

            if (solutionEntity == null)
                return this.NotFound();

            return this.Ok(SolutionFromSolutionEntity(solutionEntity));
        }

        // There's no authorization here that user has access to all the subscriptions passed in
        // DataStudio# 6610932 is tracking to fix this
        [HttpPost]
        [Route("api/solutions/all")]
        [ResponseType(typeof(IEnumerable<Solution>))]
        public async Task<IEnumerable<Solution>> Post([FromBody] List<string> subscriptionIds)
        {
            CheckNotNull(subscriptionIds, "subscriptionIds");
            logger.Write(TraceEventType.Verbose, "HttpPost AllSolutions: Get list of solutions for subscriptionsIds: {0}", subscriptionIds.ToString());

            List<Solution> activeSolutions = new List<Solution>();
            foreach (string subscription in subscriptionIds)
            {
                //try
                //{
                //    await CheckAccessLevel(subscription, AccessLevel.Read);
                //}
                //catch
                //{
                //    // continue as we might have other subscriptions that we want check access for
                //}
                activeSolutions.AddRange(await GetSolutions(subscription));
            }

            logger.Write(TraceEventType.Verbose, "HttpPost AllSolutions: Retrieved solutions for list subscriptionsIds: {0}", subscriptionIds.ToString());
            return activeSolutions;
        }

        /*
         * ----- AUTH FLOW Prior to Deployment  -----------------------------------------
         * 
         * Deploy URL comes to site (atlas) via a get
         * 
         * Authentication happens
         * 
         * After landing on the page with incoming parameters the page then gets the auth token
         * 
         * After getting the auth token, that value and the rest of needed parameters are posted to this 
         * endpoint
         */
        [HttpPost]
        [Route("api/{subscriptionId}/solutions")]
        [ResponseType(typeof(Solution))]
        public async Task<IHttpActionResult> Post([FromUri] string subscriptionId, [FromBody] SolutionDeployParameters parameters)
        {
            await CheckAccessLevel(subscriptionId, AccessLevel.ReadWrite);

            ValidateParameters(parameters);

            var templatesTable = GetTemplatesTableStorage();

            var templateIdPart1 = parameters.TemplateId + "_part1";
            var templateIdPart2 = parameters.TemplateId + "_part2";

            logger.Write(TraceEventType.Information, "HttpPost Deployment: Received for template: {0}", parameters.TemplateId);
            var template1 = await templatesTable.GetAsync(templateIdPart1);
            var template2 = await templatesTable.GetAsync(templateIdPart2);

            string queueName = "Microsoft.QueueNames.CreateDeployment";
            if (template1 == null || template2 == null)
            {
                logger.Write(TraceEventType.Warning, "HttpPost Deployment: Coudln't find the template: {0} or {1}, Only deploying {2}", templateIdPart1, templateIdPart2, parameters.TemplateId);               
            }
            else
            {
                parameters.TemplateId = templateIdPart1;
            }

            return await PostMessageToQueue(subscriptionId, parameters, queueName);
        }

        protected ResourceManagementClient GetClient(string subscriptionId, string token)
        {
            var credentials = new TokenCloudCredentials(subscriptionId, token);
            return new ResourceManagementClient(credentials);
        }

        [HttpPost]
        [Route("api/{subscriptionId}/workflow")]
        [ResponseType(typeof(Solution))]
        public async Task<IHttpActionResult> Post([FromUri] string subscriptionId, [FromUri]string version, [FromBody] SolutionDeployParameters parameters)
        {
            await CheckAccessLevel(subscriptionId, AccessLevel.ReadWrite);

            ValidateParameters(parameters);

            if (version == null || version == CurrentApiVersion)
            {
                string queueName = "Microsoft.QueueNames.CreateDeployment";
                return await PostMessageToQueue(subscriptionId, parameters, queueName, DeploymentType.WorkFlow);
            }
            else
            {
                return BadRequest("No mathing version for the endpoint workflow");
            }
        }

        private void ValidateParameters(SolutionDeployParameters parameters)
        {
            CheckNotNullOrEmpty(parameters.SolutionId, "parameters.SolutionId");
            CheckNotNullOrEmpty(parameters.UserEmail, "parameters.UserEmail");
            CheckNotNullOrEmpty(parameters.UserPuid, "parameters.UserPuid");
            if (parameters.Properties == null)
            {
                CheckNotNullOrEmpty(parameters.TemplateId, "parameters.TemplateId");
                CheckNotNullOrEmpty(parameters.TemplateParameters, "parameters.TemplateParameters");
            }
        }

        [HttpDelete]
        [ResponseType(typeof(Solution))]
        [Route("api/{subscriptionId}/solutions/{solutionId}")]
        public async Task<IHttpActionResult> Delete([FromUri] string subscriptionId, [FromUri] string solutionId)
        {
            await CheckAccessLevel(subscriptionId, AccessLevel.ReadWrite);
            CheckNotNullOrEmpty(solutionId, "solutionId");

            string userToken = GetToken();

            var solutionTableStorage = GetSolutionTableStorage(subscriptionId);
            SolutionEntity solution = await solutionTableStorage.GetAsync(solutionId);

            if (solution != null)
            {
                SolutionProvisioningData solutionProvisioning = JsonConvert.DeserializeObject<SolutionProvisioningData>(solution.Provisioning);
                if (solutionProvisioning.ProvisioningState != mdsm.ProvisioningState.Deleting.ToString() &&
                    solutionProvisioning.ProvisioningState != mdsm.ProvisioningState.Deleted.ToString())
                {
                    logger.Write(TraceEventType.Information, "HttpDelete: Received delete solution request for solutionId: {0} and subscriptionId: {1}", solutionId, subscriptionId);
                    var updatedEntity = new SolutionEntity
                    {
                        PartitionKey = subscriptionId,
                        RowKey = solutionId,
                        // [TODO][parvezp]: Should this be protected for optimal concurrency?
                        ETag = "*"
                    };

                    var resources = JsonConvert.DeserializeObject<List<SolutionResource>>(solution.Resources);
                    if (resources != null)
                    {
                        foreach (var resource in resources)
                        {
                            resource.ProvisioningState = mdsm.ProvisioningState.Deleting.ToString();
                            resource.State = mdsm.ProvisioningState.Deleting;
                        }
                    }
                    else
                    {
                        logger.Write(TraceEventType.Information, "HttpDelete: Resources could not be found for solutionId: {0} and subscriptionId: {1}", solutionId, subscriptionId);
                    }

                    SolutionProvisioningData newSolutionprovisioning = new SolutionProvisioningData();
                    newSolutionprovisioning.DeploymentName = solutionProvisioning.DeploymentName;
                    newSolutionprovisioning.ProvisioningState = mdsm.ProvisioningState.Deleting.ToString();
                    newSolutionprovisioning.Message = "Starting to delete solution: " + updatedEntity.RowKey;
                    updatedEntity.Provisioning = JsonConvert.SerializeObject(newSolutionprovisioning);
                    updatedEntity.Resources = JsonConvert.SerializeObject(resources);

                    // Update the status to start deleting
                    await solutionTableStorage.InsertOrUpdateAsync(updatedEntity);

                    var queue = queueClient.GetQueueReference(CloudConfigurationManager.GetSetting("Microsoft.QueueNames.DeleteDeployment"));
                    var deleteDeploymentMessage = new DeleteDeploymentMessage
                    {
                        SubscriptionId = subscriptionId,
                        SolutionId = solutionId,
                        ResourceManagerToken = await new SecurityHelper().Encrypt(userToken)
                    };

                    await QueueRequest(queue, deleteDeploymentMessage);

                    return this.Ok(SolutionFromSolutionEntity(updatedEntity));
                }
            }
            logger.Write(TraceEventType.Warning, "HttpDelete: Could not find solution with Id: {0} and subscriptionId: {1}", solutionId, subscriptionId);
            return this.NotFound();
        }
    }
}