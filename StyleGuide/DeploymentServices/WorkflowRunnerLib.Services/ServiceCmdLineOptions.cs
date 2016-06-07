//==============================================================================
// Copyright (c) Microsoft Corporation. All Rights Reserved.
//==============================================================================

using CommandLine;
using CommandLine.Text;
using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;

namespace Microsoft.DataPipeline.Deployment.Workflow.Services
{
    public class ServiceCmdLineOptions
    {
        public const string exampleCmdLineArgs = @" -t adfgated --deploymentType bvt -e MonitoringServiceUpgrade -m MonitoringServiceDeploy --backend https://adfuswest-int.windows-int.net:86/ -p ""\\bpddfs\TFS\DataPipeline\Main\20141202.6\x64\Release""";

        [Option('e', "existingTargetWorkflow", Required = true, HelpText = "workflow to run if target HostedService exists")]
        public string ExistingTargetWorkflow { get; set; }

        [Option('m', "missingTargetWorkflow", Required = true, HelpText = "workflow to run if target HostedService does not exist")]
        public string MissingTargetWorkflow { get; set; }

        [Option("forceCleanDeploy", Required = false, DefaultValue = false, HelpText = "a existing hosted service & account will first be deleted, in effect runs the missingTargetWorkflow")]
        public bool ForceCleanDeploy { get; set; }

        [Option('t', "targetClusterName", DefaultValue = "adfgated", HelpText = "Cluster name to use for deployment")]
        public string ClusterName { get; set; }

        [Option('d', "deploymentType", Required = false, DefaultValue = "dev", HelpText = "type of deployment: e.g. 'bvt'|'dev'|'prod'")]
        public string DeploymentType { get; set; }

        [Option('p', "buildDropPath", Required = true, HelpText = @"path to build drop location, e.g. '\\bpddfs\TFS\DataPipeline\Main\20141202.6\x64\Release'")]
        public string BuildDropPath { get; set; }

        [Option('c', "configDir", Required = false, DefaultValue = ".\\AzureConfig", HelpText = "path to config/profile files directory")]
        public string ConfigDirectory { get; set; }

        [Option('w', "workflowDir", Required = false, DefaultValue = ".", HelpText = "path to workflow files directory")]
        public string WorkflowDirectory { get; set; }

        [Option('l', "location", Required = false, DefaultValue = "WestUS", HelpText = "Azure data center location")]
        public string Location { get; set; }

        [Option("resumePoint", Required = false, HelpText = "Resume point for workflow")]
        public string ResumePoint { get; set; }

        [Option('b', "backend", DefaultValue = "https://adfuswest-int.windows-int.net:86/", Required = false, HelpText = "backend ResourceProvider DNS name")]
        public string BackendUri { get; set; }

        [Option("resultFile", Required = false, HelpText = "JSON file with deployment result data")]
        public string DeploymentResultsFile { get; set; }

        [Option('u', "useraliasPrivateDeployment", Required = false, HelpText = "User alias if running a private deployment")]
        public string UserAliasPrivateDeployment { get; set; }

        public bool IsPrivateDeployment { get { return string.IsNullOrEmpty(UserAliasPrivateDeployment); } }

        [ParserState]
        public IParserState LastParserState { get; set; }

        [HelpOption]
        public string GetUsage()
        {
            var consoleWidth = 200;
            if (!Console.IsOutputRedirected)
            {
                consoleWidth = Console.WindowWidth;
            }
            var help = new HelpText
            {
                Heading = Logo, 
                AdditionalNewLineAfterOption = true,
                AddDashesToOption = true,
                MaximumDisplayWidth = consoleWidth,
            };

            if (LastParserState.Errors.Any())
            {
                var errors = help.RenderParsingErrorsText(this, 2);
                if (!string.IsNullOrEmpty(errors))
                {
                    help.AddPreOptionsLine(Environment.NewLine + "Error, invalid command line arguments:");
                    help.AddPreOptionsLine(errors);
                }
            }

            help.AddOptions(this, "REQ");
            help.AddPreOptionsLine("\r\nUsage:");
            help.AddPreOptionsLine(AppName + exampleCmdLineArgs);
            return help;
        }

        public static ServiceCmdLineOptions Parse(string[] args, TextWriter helpWriter = null)
        {
            var options = new ServiceCmdLineOptions();
            using (var parser = new Parser((settings) =>
                {
                    settings.CaseSensitive = false;
                    settings.IgnoreUnknownArguments = false;
                    settings.HelpWriter = helpWriter ?? Console.Error;
                }))
            {
                // parser might not return on errors, using onFail error action instead
                parser.ParseArgumentsStrict(args, options, () => options = null);
            }
            if (options != null)
            {
                if (string.IsNullOrEmpty(options.DeploymentResultsFile))
                {
                    options.DeploymentResultsFile = Path.Combine(Environment.GetEnvironmentVariable("TEMP"), "DeploymentResultsFile.json");
                }
                options.BuildDropPath = Environment.ExpandEnvironmentVariables(options.BuildDropPath);
                options.ConfigDirectory = Environment.ExpandEnvironmentVariables(options.ConfigDirectory);
                options.WorkflowDirectory = Environment.ExpandEnvironmentVariables(options.WorkflowDirectory);
            }
            return options;
        }

        static string Logo
        {
            get
            {
                var versionInfo = FileVersionInfo.GetVersionInfo(AppLocation);
                return string.Format(CultureInfo.InvariantCulture, "{0} - v{1}: ADF deployment workflow runner", AppName, versionInfo.FileVersion);
            }
        }

        static string AppName
        {
            get { return Path.GetFileNameWithoutExtension(AppLocation); }
        }

        static string AppLocation
        {
            get
            {
                // entry assembly can be null when running within unit test framework, fallback to executing assembly:
                var entryAssm = Assembly.GetEntryAssembly();
                return (entryAssm != null) ? entryAssm.Location : Assembly.GetExecutingAssembly().Location;
            }
        }
    }
}
