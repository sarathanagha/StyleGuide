using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Configuration;
using System.Threading.Tasks;
using MLApiClientTestApp.Models;
using Microsoft.DataStudio.Services.MachineLearning;
using Microsoft.DataStudio.Services.MachineLearning.Contracts;
using Newtonsoft.Json;

namespace MLApiClientTestApp
{
    public class Globals
    {
        public static string WindowsManagementUri = ConfigurationManager.AppSettings["WindowsManagementUri"];
        public static string AzuremlManagementUri = ConfigurationManager.AppSettings["AzuremlManagementUri"];
        public static string StudioApiUri = ConfigurationManager.AppSettings["StudioApiUri"];
        public static string SolutionTemplateName = ConfigurationManager.AppSettings["SolutionTemplateName"];
        public static Guid SubscriptionId = Guid.Parse(ConfigurationManager.AppSettings["SubscriptionId"]);
    }

    public class MLDeploymentActorTest
    {
        public enum MLApiSource // public is a workaround for forms code..
        {
            SolutionAccelerator
        };

        private PollingMLApiClient mClient = null;
        private ITestLogger mLogger = null;

        public MLDeploymentActorTest(PollingMLApiClient client, ITestLogger logger)
        {
            mClient = client;
            mLogger = logger;
        }

        public async Task<DeploymentOutputs> ExecuteAsync(DeploymentParameters deploymentParams)
        {
            // First, generate a new workspace name
            // It looks like two workspaces can have the same name in a subscription (they will have a different id), but let's not confuse the user...
            string newWorkspaceName = await GenerateNewWorkspaceName(Globals.SolutionTemplateName);

            LogInformation("New workspace name that's available: {0}, we'll next attempt to create it", newWorkspaceName);
            mLogger.WriteEmptyLineAsync();

            // Create a workspace in the customer's subscription
            var newWorkspace = await mClient.CreateWorkspaceAsync(new CreateWorkspaceRequest
            {
                Name = newWorkspaceName,
                StorageAccountName = deploymentParams.StorageAccountName,
                StorageAccountKey = deploymentParams.StorageAccountKey,
                Location = deploymentParams.Location,
                OwnerId = deploymentParams.UserEmail,
                OwnerPrincipalId = deploymentParams.UserPuid,
                ImmediateActivation = true, // We want the workspace auth token to be available immediately
                Source = MLApiSource.SolutionAccelerator.ToString(),
            });
            mLogger.WriteEmptyLineAsync();

            string trainingExperimentId = string.Empty;
            string scoringExperimentId = string.Empty;
            
            if (!string.IsNullOrEmpty(deploymentParams.TrainingExperimentPackageLocation))
            {
                // Unpack the training experiment to customer's workspace
                trainingExperimentId = await mClient.UnpackExperimentAsync(deploymentParams.TrainingExperimentPackageLocation, deploymentParams.TrainingExperimentCommunityUri, newWorkspace);
                mLogger.WriteEmptyLineAsync();
            }

            if (string.IsNullOrEmpty(deploymentParams.ScoringExperimentPackageLocation))
            {
                throw new Exception("Please provide scoring experiment package location!");
            }

            // Unpack the scoring experiment to customer's workspace
            scoringExperimentId = await mClient.UnpackExperimentAsync(deploymentParams.ScoringExperimentPackageLocation, deploymentParams.ScoringExperimentCommunityUri, newWorkspace);
            mLogger.WriteEmptyLineAsync();

            if (string.IsNullOrEmpty(trainingExperimentId))
            {
                mLogger.Write(TraceEventType.Information, "Skipping CreateProject step since training experiment isn't specified");
            }
            else
            {
                // Create a project that includes the training and scoring experiments
                await mClient.CreateProjectAsync(trainingExperimentId, scoringExperimentId);
                mLogger.WriteEmptyLineAsync();
            }

            // Publish the scoring experiment as a web service
            var webService = await mClient.CreateWebServiceAsync(scoringExperimentId, newWorkspace);
            mLogger.WriteEmptyLineAsync();

            return new DeploymentOutputs
            {
                NewWorkspace = newWorkspace,
                DeployedWebService = webService
            };
        }

        private async Task<string> GenerateNewWorkspaceName(string solutionTemplateName)
        {
            string newWorkspaceName = null;

            var workspacesExisting = await mClient.ListWorkspacesAsync();

            string nextPossibleWorkspaceName = null;
            int workspaceNameSuffix = 1;

            const int maxWorkspaceNameSuffix = 10000;

            while (true)
            {
                if (workspaceNameSuffix > maxWorkspaceNameSuffix)
                {
                    throw new Exception("Too many workspaces?");
                }

                nextPossibleWorkspaceName = solutionTemplateName + "_workspace" + workspaceNameSuffix;

                bool fWorkspaceNameTaken = false;

                foreach (var workspace in workspacesExisting)
                {
                    if (workspace.Name.Equals(nextPossibleWorkspaceName))
                    {
                        fWorkspaceNameTaken = true;
                        break;
                    }
                }

                if (fWorkspaceNameTaken)
                {
                    workspaceNameSuffix++;
                }
                else
                {
                    newWorkspaceName = nextPossibleWorkspaceName;
                    break;
                }
            }

            return newWorkspaceName;
        }

        private void LogInformation(string format, params object[] args)
        {
            mLogger.Write(TraceEventType.Information, String.Format("TestMLDeploymentActor: " + format, args));
        }
    }
}
