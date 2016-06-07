using System;
using System.Linq;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;
using System.Web.OData.Routing;
using System.Collections.Generic;

using Microsoft.Data.OData;
using Microsoft.CortanaAnalytics.Models;
using Microsoft.CortanaAnalytics.SolutionRole.DataSource;
using Microsoft.CortanaAnalytics.SolutionAccelerators.Shared;
using Microsoft.Azure.Management.Resources.Models;
using System.Net;

namespace Microsoft.CortanaAnalytics.ResourceService.Controllers
{
    public class SolutionController : ODataController
    {
        /// <summary>
        /// Gets the resources.
        /// </summary>
        /// <param name="token">The token.</param>
        /// <param name="subscriptionId">The subscription identifier.</param>
        /// <param name="tagName">Name of the tag.</param>
        /// <returns></returns>
        [HttpGet]
        [EnableQuery]
        [ODataRoute("GetSolutions(SubscriptionId={subscriptionId},SolutionName={solutionName})")]
        public IEnumerable<Solution> GetSolutions([FromODataUri] string subscriptionId, [FromODataUri] string solutionName, ODataQueryOptions<Solution> options)
        {
            // Since we do not support the filter attribute at this time we are blocking it
            // and enabling the request validation for the ODATA query to fail.

            // Example of a failed query: http://localhost:14160/GetSolutions(SubscriptionId='',SolutionName='')?$filter=SolutionName%20eq%20%27foo%27
            // Example of a successful query: http://localhost:14160/GetSolutions(SubscriptionId='testContainername',SolutionName='Connectedcar01')

            var settings = new ODataValidationSettings
            {
                AllowedFunctions = AllowedFunctions.None,
                AllowedLogicalOperators = AllowedLogicalOperators.None,
                AllowedArithmeticOperators = AllowedArithmeticOperators.None,
                AllowedQueryOptions = AllowedQueryOptions.None
            };
            try
            {
                options.Validate(settings);
            }
            catch (ODataException ex)
            {
                throw ex;
            }

            var storage = new StorageDataSource(AzureClientManager.GetBlobClient());
            var tmpResults = storage.GetListOfSolutions(subscriptionId, solutionName);

            if(tmpResults == null)
            {
                return Enumerable.Empty<Solution>();
            }
            else
            {
                return tmpResults;
            }
        }

        Guid correlationId;

    }
}