using System.Web.Http;
using System.Web.OData.Batch;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;

using Microsoft.OData.Edm;
using Microsoft.CortanaAnalytics.Models;
using Microsoft.CortanaAnalytics.SolutionRole.DataSource;
using Microsoft.CortanaAnalytics.SolutionAccelerators.Shared;

namespace Microsoft.CortanaAnalytics
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Attribute routing.
            config.MapHttpAttributeRoutes();

            // Convention-based routing.
            config.Routes.MapHttpRoute(
                name: "api",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.MapODataServiceRoute("OData", "odata", GetEdmModel(), new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer));
           

            AzureClientManager.InitConfig();
        }
        private static IEdmModel GetEdmModel()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.Namespace = typeof(Resource).Namespace;
            builder.EntitySet<Resource>("Resource");
            builder.EntitySet<Solution>("Solution");

            ActionConfiguration getSolutionResources = builder.EntityType<Resource>().Collection.Action("GetSolutionResources");
            getSolutionResources.Parameter<string>("Token");
            getSolutionResources.Parameter<string>("SubscriptionId");
            getSolutionResources.Parameter<string>("SolutionName");
            getSolutionResources.ReturnsCollectionFromEntitySet<Resource>("Resources");

            var function2 = builder.Function("GetSolutions");
            function2.ReturnsCollectionFromEntitySet<Solution>("Solution");
            function2.Parameter<string>("SubscriptionId");
            function2.Parameter<string>("SolutionName");

            /*
            function2 = builder.Function("DeploySolution");
            function2.ReturnsFromEntitySet<Solution>("Solution");
            function2.Parameter<string>("SubscriptionId");
            function2.Parameter<string>("SolutionName");
            */
      

            var edmModel = builder.GetEdmModel();
            return edmModel;
        }
    }
}
