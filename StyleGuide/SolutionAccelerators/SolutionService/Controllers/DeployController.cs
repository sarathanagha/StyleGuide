using Microsoft.Azure.Management.Resources.Models;
using Microsoft.CortanaAnalytics.Models;
using Microsoft.CortanaAnalytics.SolutionAccelerators.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Microsoft.CortanaAnalytics.ResourceService.Controllers
{
    public class DeployController : ApiController
    {
        // TODO: [chrisriz] This needs to be a default configuration driven value on v1
        string resourceGroup = "solutionaccelerators";

        // TODO: [chrisriz] This is test until  we get the ARM templates from Anand Monday
        string template = @"{
            '$schema': 'https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#/',
            'contentVersion': '1.0.0.0', 
            'resources': [{ 
                'type': 'Microsoft.Compute/availabilitySets', 
                'name': 'availabilitySet3', 
                'apiVersion': '2015-05-01-preview', 
                'location': 'West US', 
                'properties': { } 
            }] 
        }";

        Guid correlationId;

        public class DeployParameters
        {
            public string subscriptionId { get; set; }
            public string solutionName { get; set; }
            public string token { get; set; }
        }

        /*
         * ----- AUTH FLOW -----------------------------------------------------------------------
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
        public Solution Post(DeployParameters parameters)
        {
            var prov = new Provision();
            var json = new Json()
            {
                Content = template
            };

            var result = prov.DeployTemplate(parameters.subscriptionId, resourceGroup, json, parameters.token);

            correlationId = result.CorrelationId;
            DeploymentOperationsCreateResult opResult = result.OperationResult;
            if (opResult != null && opResult.StatusCode.Equals(HttpStatusCode.Created))
            {
                return new Solution()
                {
                    ID = result.CorrelationId.ToString()
                };
            }

            return null;
        }

    }
}
