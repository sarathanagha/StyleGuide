using System;
using System.Diagnostics;
using System.Web.Http;
using Microsoft.Azure;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.Practices.Unity;

namespace Microsoft.DataStudio.WebRole.Common.Unity
{
    public class UnityBootstrapper
    {
        public static IUnityContainer Initialize(ComponentID componentId)
        {
            return RegisterUnityContainer(componentId);
        }

        private static IUnityContainer RegisterUnityContainer(ComponentID componentId)
        {
            var container = new UnityContainer();

            // Register types are different Interfaces that will resolved at runtime
            RegisterTypes(container, componentId);

            //Set the DependencyResolver to pick up are newly created dependencies
            GlobalConfiguration.Configuration.DependencyResolver = new UnityResolver(container);

            return container;
        }

        private static IUnityContainer RegisterTypes(IUnityContainer unityContainer, ComponentID componentId)
        {
            return unityContainer.RegisterType<ILogger, ServiceLogger>(new InjectionConstructor(new LoggerSettings
            {
                ComponentId = componentId,
                EnableMdsTracing = Boolean.Parse(CloudConfigurationManager.GetSetting("Microsoft.Diagnostics.EnableMdsTracing")),
                SourceLevels = (SourceLevels)Enum.Parse(typeof(SourceLevels), CloudConfigurationManager.GetSetting("Microsoft.Diagnostics.LogLevel"))
            }));
        }
    }
}