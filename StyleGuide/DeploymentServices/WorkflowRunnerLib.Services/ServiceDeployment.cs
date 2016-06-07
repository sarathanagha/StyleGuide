//==============================================================================
// Copyright (c) Microsoft Corporation. All Rights Reserved.
//==============================================================================

using Microsoft.DataPipeline.Deployment.Activities;
using Microsoft.DPG.Deployment.Logging;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;

namespace Microsoft.DataPipeline.Deployment.Workflow.Services
{
    public class ServiceDeployment
    {
        readonly ServiceCmdLineOptions cmdLineOptions;
        readonly TextWriter logWriter;
        IDictionary<string, object> lastRunOutputs = new Dictionary<string, object>();

        public IDictionary<string, object> LastRunOutputs { get { return this.lastRunOutputs; } }

        public ServiceDeployment(ServiceCmdLineOptions cmdLineOptions, TextWriter logWriter)
        {
            this.cmdLineOptions = cmdLineOptions;
            this.logWriter = logWriter;
            Log.AddEntryPosted(this.logWriter.Write);
        }

        public void Run()
        {
            Log.Info("Starting Service deployment: type={0}, location={1}, user alias={2}, cluster={3}",
                this.cmdLineOptions.DeploymentType, this.cmdLineOptions.Location, this.cmdLineOptions.UserAliasPrivateDeployment, this.cmdLineOptions.ClusterName);

            var totalTime = new Stopwatch();
            totalTime.Start();
            var wadiSettings = new WadiConfigSettings(this.cmdLineOptions.ConfigDirectory, this.logWriter);
            var mappings = new ServiceMappings(this.cmdLineOptions.DeploymentType, this.cmdLineOptions.Location, this.cmdLineOptions.ClusterName, this.cmdLineOptions.UserAliasPrivateDeployment);
            var symbols = CreateSymbolsMap(cmdLineOptions.ClusterName, mappings.DeploymentName, mappings.BaseConfigName);
            wadiSettings.Load(symbols.BaseConfigName, symbols.Symbols);

            var workflowName = DetermineWorkflow(wadiSettings, mappings.DeploymentName);
            var runner = CreateRunner(workflowName, wadiSettings, symbols, this.cmdLineOptions.ConfigDirectory);

            runner.Invoke();
            this.lastRunOutputs = runner.Outputs;

            string deploymentId;
            object deploymentIdObj;
            if (runner.Outputs.TryGetValue("DeploymentID", out deploymentIdObj))
            {
                deploymentId = deploymentIdObj.ToString();
            }
            else
            {
                deploymentId = "<none>";
            }
            totalTime.Stop();
            Log.Info("Finished deploying to '{0}' with deploymentID={1}", mappings.DeploymentName, deploymentId);
            Log.Info("Total elapsed time for SvcDeploy: {0}", totalTime.Elapsed.Duration().ToString("c", CultureInfo.CurrentCulture));

            var result = new DeploymentResults
            {
                DeploymentName = mappings.DeploymentName,
                DeploymentId = deploymentId,
                ElapsedTime = totalTime.Elapsed.Duration(),
            };
            WriteResultsFile(result, this.cmdLineOptions.DeploymentResultsFile);
        }

        string DetermineWorkflow(WadiConfigSettings wadiSettings, string targetDeployment)
        {
            var servicesManager = new HostedServicesManager(wadiSettings.Config.HostedService[0]);
            var workflowName = this.cmdLineOptions.MissingTargetWorkflow;
            var serviceExists = servicesManager.HostedServiceIsUpgradable(targetDeployment);
            var forceCleanDeploy = this.cmdLineOptions.ForceCleanDeploy;
            if (serviceExists && !forceCleanDeploy)
            {
                workflowName = this.cmdLineOptions.ExistingTargetWorkflow;
            }
            Log.Info("DetermineWorkflow: hosted service {0} exists: {1}, selected workflow: {2}, forceCleanDeploy: {3}", targetDeployment, serviceExists, workflowName, forceCleanDeploy);
            return workflowName;
        }

        ConfigSymbols CreateSymbolsMap(string environmentName, string targetDeployment, string baseConfigName)
        {
            var buildDropPath = Path.GetFullPath(this.cmdLineOptions.BuildDropPath);
            if (!Directory.Exists(buildDropPath))
            {
                throw Error.DirectoryNotFoundException("Build drop path '{0}' does not exist", buildDropPath);
            }

            return new ConfigSymbols
            {
                BaseConfigName = baseConfigName,
                SymbolList = new Symbol[]
                {
                    new Symbol{ Name = "BuildDropPath", Value = buildDropPath },
                    new Symbol{ Name = "DeploymentNameValue", Value = targetDeployment },
                    new Symbol{ Name = "DeploymentName", Value = targetDeployment },
                    new Symbol{ Name = "BackendDeploymentUri", Value = this.cmdLineOptions.BackendUri },
                }
            };
        }

        void WriteResultsFile(DeploymentResults results, string resultsFile)
        {
            using (var stream = new FileStream(resultsFile, FileMode.Create, FileAccess.Write, FileShare.Read))
            {
                results.WriteTo(stream);
            }
        }

        DeploymentRunner CreateRunner(string workflowName, WadiConfigSettings settings, ConfigSymbols symbols, string configDirectory)
        {
            var runner = new DeploymentRunner(this.logWriter);
            runner.LoadActivity(workflowName, this.cmdLineOptions.WorkflowDirectory);
            var resumePoint = this.cmdLineOptions.ResumePoint;
            if (!string.IsNullOrEmpty(resumePoint))
            {
                if (!runner.ResumePoints.Contains(resumePoint))
                {
                    throw Error.InvalidOperationException("Specified resume point '{0}' is not part of workflow", resumePoint);
                }
            }
            runner.Inputs.Add("ResumePoint", resumePoint);
            runner.Inputs.Add("ConfigFolder", configDirectory);
            runner.Inputs.Add("SerializedSymbols", symbols.SaveAsString());
            return runner;
        }
    }
}
