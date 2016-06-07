// Copyright (c) Microsoft Corporation. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;

namespace Microsoft.DataPipeline.Deployment.Workflow.Services
{
    public class ServiceMappings
    {
        readonly string deploymentType;
        readonly string location;
        readonly string clusterName;
        readonly string useraliasPrivateDeployment;

        public const string BaseNamePostfix = "-base";
        const string DefaultLocation = "WestUS";
        const string DefaultClusterName = "adfgated";
        const string DefaultLabAccount = "_sqlbld";

        static readonly Dictionary<string, string> deploymentType2BaseConfig = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "dev", "MonitoringDev" },
            { "dev2","MonitoringDev2" },
            { "bvt", "MonitoringBVT" },
            { "int", "MonitoringIntCommon" },
            { "prod", "MonitoringProdCommon" },
        };

        static readonly HashSet<string> locations = new HashSet<string>(new string[]
        {
            "WestUS",
            "EastUS",
        }, StringComparer.OrdinalIgnoreCase);

        static readonly string[] devSubscriptions = new string[]
        {
            "dev",
            "dev2",
        };

        static readonly HashSet<string> bvtSubscriptions = new HashSet<string>(new string[]
        {
            "bvt",
        }, StringComparer.OrdinalIgnoreCase);

        public static IEnumerable<string> AvailableBaseConfigs
        {
            get
            {
                foreach (var config in deploymentType2BaseConfig.Values)
                {
                    if (config.Contains("{0}"))
                    {
                        foreach (var loc in locations)
                        {
                            yield return FormatConfig(config, loc);
                        }
                    }
                    else
                    {
                        yield return config;
                    }
                }
            }
        }

        public string BaseConfigName
        {
            get
            {
                var adjustedDeplType = SpreadDevSubscriptions(this.deploymentType, this.UserAlias);
                string baseConfig = ValidateDeploymentType(adjustedDeplType);
                if (baseConfig.Contains("{0}"))
                {
                    baseConfig = FormatConfig(baseConfig, this.location);
                }
                return baseConfig + BaseNamePostfix;
            }
        }

        public string DeploymentName
        {
            get
            {
                return IsPrivateDeployment ? UserAlias + this.clusterName : this.clusterName;
            }
        }

        public bool IsPrivateDeployment
        {
            get
            {
                return !string.IsNullOrEmpty(this.useraliasPrivateDeployment);
            }
        }

        public string UserAlias
        {
            get
            {
                var normalizedAlias = this.IsPrivateDeployment ? this.useraliasPrivateDeployment : DefaultLabAccount;
                // user alias is also used to construct hosted service and storage account names, remove invalid characters
                return normalizedAlias.Replace("_", "").Replace("-", "").ToLower(CultureInfo.CurrentCulture).Trim();
            }
        }

        public ServiceMappings(string deploymentType, string location = DefaultLocation, string clusterName = DefaultClusterName, string userAliasPrivateDeployment = null)
        {
            if (!locations.Contains(location))
            {
                throw Error.ArgumentException("location", "{0} is not a valid location: {1}", location, string.Join(", ", locations));
            }
            ValidateDeploymentType(deploymentType);
            this.deploymentType = deploymentType;
            this.location = location;
            this.clusterName = clusterName;
            this.useraliasPrivateDeployment = userAliasPrivateDeployment;
            ValidateResultingReploymentName();
        }

        void ValidateResultingReploymentName()
        {
            var deploymentName = DeploymentName;
            // storage name rules are more restrictive than hosted service naming rules
            // see https://msdn.microsoft.com/en-us/library/hh264518.aspx
            // 3 to 24 char in length; numbers and lowercase letters only
            if (!Regex.IsMatch(deploymentName, @"^[a-z0-9]{3,24}$"))
            {
                throw new InvalidOperationException(string.Format(CultureInfo.CurrentCulture, "Resulting DeploymentName is not a valid storage and hosted service name: {0}"));
            }
        }

        string ValidateDeploymentType(string deploymentType)
        {
            string baseConfig;
            if (!deploymentType2BaseConfig.TryGetValue(deploymentType, out baseConfig))
            {
                throw Error.ArgumentException("deploymentType", "{0} is not a valid deploymentType", deploymentType);
            }
            return baseConfig;
        }

        static string FormatConfig(string baseConfig, string location)
        {
            return string.Format(CultureInfo.CurrentCulture, baseConfig, location.Trim());
        }

        static string SpreadDevSubscriptions(string deploymentType, string userAlias)
        {
            var alias = userAlias.Trim();
            if (devSubscriptions.Contains(deploymentType, StringComparer.OrdinalIgnoreCase))
            {
                // very simple algorithm: split based on starting letter of alias. Our team aliases divide pretty well
                // around the middle of the alphabet, subject to periodic review.
                return (alias.First() <= 'j') ? devSubscriptions[0] : devSubscriptions[1];
            }
            else
            {
                return deploymentType;
            }
        }
    }
}
