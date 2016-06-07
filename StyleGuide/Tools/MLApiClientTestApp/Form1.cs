using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using MLApiClientTestApp.Models;
using Newtonsoft.Json;
using Microsoft.DataStudio.Services.MachineLearning;
using Microsoft.DataStudio.Services.MachineLearning.Contracts;

namespace MLApiClientTestApp
{
    public partial class Form1 : Form
    {
        private const string newLine = "\r\n";
        private const string tabSpace = "    ";

        private string mAccessToken = null;

        private PollingMLApiClient mClient = null;
        private ITestLogger mLogger = null;

        public Form1()
        {
            InitializeComponent();
            this.Load += Form1_Load;
        }

        void Form1_Load(object sender, EventArgs e)
        {
            mLogger = new TextBoxLogger(outputTextBox);   
        }

        private void EnsureApiClientIsInitialized()
        {
            if (mAccessToken == null)
            {
                throw new Exception("Access token is NULL, please login");
            }

            if (mClient == null)
            {
                mClient = new PollingMLApiClient(Globals.WindowsManagementUri,
                    Globals.AzuremlManagementUri,
                    Globals.StudioApiUri,
                    mAccessToken,
                    Globals.SubscriptionId,
                    mLogger,
                    new TestApiCallsLogger(mLogger));
            }
        }

        private string GetAccessToken()
        {
            if(mAccessToken == null)
            {
                mAccessToken = GenerateAccessToken();
            }

            return mAccessToken;
        }

        private void SetAccessToken(string token) // Workaround for PPE..
        {
            mAccessToken = token;
        }

        private static string GenerateAccessToken()
        {
            AuthenticationResult result = null;
            var thread = new Thread(() =>
            {
                try
                {
                    var context = new AuthenticationContext(ConfigurationManager.AppSettings["ActiveDirectoryEndpoint"] + ConfigurationManager.AppSettings["ActiveDirectoryTenantId"]);

                    result = context.AcquireToken(
                        resource: ConfigurationManager.AppSettings["WindowsManagementUri"],
                        clientId: ConfigurationManager.AppSettings["ClientId"],
                        redirectUri: new Uri(ConfigurationManager.AppSettings["RedirectUri"]),
                        promptBehavior: PromptBehavior.Always);
                }
                catch (Exception threadEx)
                {
                    Console.WriteLine(threadEx.Message);
                }
            });

            thread.SetApartmentState(ApartmentState.STA);
            thread.Name = "AcquireTokenThread";
            thread.Start();
            thread.Join();

            if (result != null)
            {
                return result.AccessToken;
            }

            throw new InvalidOperationException("Failed to acquire token");
        }

        private string WorkspaceAsString(Workspace workspace)
        {
            return "{" + newLine + tabSpace + "Id: " + workspace.Id + "," + newLine + tabSpace
                + "Name: " + workspace.Name + "," + newLine + tabSpace + "Description: " + workspace.Description
                + "," + newLine + tabSpace + "SubscriptionId: " + workspace.SubscriptionId + ","
                + newLine + tabSpace + "Region: " + workspace.Region + "," + newLine + tabSpace + "UserEmail: "
                + workspace.OwnerId + "," + newLine + tabSpace + "StorageAccountName: " + workspace.StorageAccountName
                + "," + newLine + tabSpace + "WorkspaceState: " + workspace.WorkspaceState + "," + newLine + tabSpace
                + "EditorLink: " + workspace.EditorLink + "," + newLine + tabSpace + "ResourceAuthorizationToken: "
                + ((workspace.AuthorizationToken == null) ? "null" : ("{" + newLine + tabSpace + tabSpace + "PrimaryToken: "
                + workspace.AuthorizationToken.PrimaryToken + "," + newLine + tabSpace + tabSpace + "SecondaryToken: "
                + workspace.AuthorizationToken.SecondaryToken + newLine + tabSpace + "}"))
                + newLine + "}";
        }

        private void getTokenButton_Click(object sender, EventArgs e)
        {
            try
            {
                tokenBox.Text = GetAccessToken();
            }
            catch(Exception ex)
            {
                DisplayException(ex);
            }
        }

        private async void listWorkspacesButton_Click(object sender, EventArgs e)
        {
            try
            {
                EnsureApiClientIsInitialized();

                if (inputTextBox.Text.Length > 0)
                {
                    var workspace = await mClient.GetWorkspaceAsync(inputTextBox.Text);

                    mLogger.WriteEmptyLineAsync();
                    mLogger.Write(TraceEventType.Information, WorkspaceAsString(workspace));
                }
                else
                {
                    var workspaces = await mClient.ListWorkspacesAsync();

                    string displayText = "";
                    foreach (Workspace workspace in workspaces)
                    {
                        displayText += WorkspaceAsString(workspace);
                        displayText += (newLine + newLine);
                    }

                    mLogger.WriteEmptyLineAsync();
                    mLogger.Write(TraceEventType.Information, displayText);
                }
            }
            catch (Exception ex)
            {
                DisplayException(ex);
            }
        }

        private async void createWorkspaceButton_Click(object sender, EventArgs e)
        {
            try
            {
                EnsureApiClientIsInitialized();

                if (inputTextBox.Text.Length == 0)
                {
                    throw new Exception("Specify a workspace name!");
                }

                Workspace workspace = await mClient.CreateWorkspaceAsync(new CreateWorkspaceRequest
                    {
                        Name = inputTextBox.Text,
                        Location = ConfigurationManager.AppSettings["Location"],
                        StorageAccountName = ConfigurationManager.AppSettings["StorageAccountName"],
                        StorageAccountKey = ConfigurationManager.AppSettings["StorageAccountKey"],
                        OwnerId = ConfigurationManager.AppSettings["UserEmail"],
                        OwnerPrincipalId = ConfigurationManager.AppSettings["UserPuid"],
                        ImmediateActivation = true,
                        Source = MLDeploymentActorTest.MLApiSource.SolutionAccelerator.ToString()
                    });

                mLogger.WriteEmptyLineAsync();
                mLogger.Write(TraceEventType.Information, WorkspaceAsString(workspace));
            }
            catch (Exception ex)
            {
                DisplayException(ex);
            }
        }

        private void DisplayException(Exception ex)
        {
            string doubleNewLine = newLine + newLine;
            string displayText = "EXCEPTION: " + ex.Message + doubleNewLine;

            displayText += String.Format("Inner Exception is {0}", ex.InnerException);
            displayText += doubleNewLine;

            displayText += String.Format("Error trace {0}", ex.StackTrace);

            mLogger.WriteEmptyLineAsync();
            mLogger.Write(TraceEventType.Error, displayText);
        }

        private void clearButton_Click(object sender, EventArgs e)
        {
            mLogger.Clear();
        }

        private void setTokenButton_click(object sender, EventArgs e)
        {
            if (tokenBox.Text.Length > 0)
            {
                SetAccessToken(tokenBox.Text);
            }
        }

        private async void listExperimentsButton_Click(object sender, EventArgs e)
        {
            try
            {
                EnsureApiClientIsInitialized();

                if (inputTextBox.Text.Length == 0)
                {
                    throw new Exception("Specify a workspace id!");
                }

                string responseText = null;

                if (inputTextBox.Text.IndexOf('.') != -1)
                {
                    // This is probably a experimentId
                    throw new Exception("Getting info for experimentId is currently not supported");
                }
                else
                {
                    // This is probably a workspaceId

                    string workspaceId = inputTextBox.Text;
                    var workspace = await mClient.GetWorkspaceAsync(workspaceId);
                    var experiments = await mClient.ListExperimentsAsync(workspace);

                    string experimentListText = newLine;

                    foreach(var experiment in experiments)
                    {
                        if (experiment.ExperimentId.StartsWith(workspaceId)) // Let's only show the experiments that we created...
                        {
                            experimentListText += ("\t" + experiment.Description + "\t" + experiment.ExperimentId + newLine);
                        }                            
                    }

                    responseText = experimentListText + newLine;
                }

                mLogger.Write(TraceEventType.Information, responseText);
                mLogger.WriteEmptyLineAsync();
            }
            catch(Exception ex)
            {
                DisplayException(ex);
            }
        }

        private async void deployButton_Click(object sender, EventArgs e)
        {
            try
            {
                var stopwatch = new Stopwatch();
                stopwatch.Start();

                EnsureApiClientIsInitialized();

                var mlDeployer = new MLDeploymentActorTest(mClient, mLogger);

                var deploymentOutput = await mlDeployer.ExecuteAsync(new DeploymentParameters
                    {
                        ResourceManagerToken = mAccessToken,
                        SubscriptionId = Globals.SubscriptionId,
                        Location = ConfigurationManager.AppSettings["Location"],
                        StorageAccountName = ConfigurationManager.AppSettings["StorageAccountName"],
                        StorageAccountKey = ConfigurationManager.AppSettings["StorageAccountKey"],
                        UserEmail = ConfigurationManager.AppSettings["UserEmail"],
                        UserPuid = ConfigurationManager.AppSettings["UserPuid"],

                        TrainingExperimentPackageLocation = ConfigurationManager.AppSettings["TrainingExperimentPackageLocation"],
                        TrainingExperimentCommunityUri = ConfigurationManager.AppSettings["TrainingExperimentCommunityUri"],
                        ScoringExperimentPackageLocation = ConfigurationManager.AppSettings["ScoringExperimentPackageLocation"],
                        ScoringExperimentCommunityUri = ConfigurationManager.AppSettings["ScoringExperimentCommunityUri"]
                    });

                stopwatch.Stop();

                mLogger.WriteEmptyLineAsync();
                mLogger.Write(TraceEventType.Information,
                    "Deployment complete to target workspace!" + newLine
                    + "Target Workspace details:" + newLine
                    + "\tID: " + deploymentOutput.NewWorkspace.Id + newLine
                    + "\tName: " + deploymentOutput.NewWorkspace.Name + newLine
                    + "Deployed web service details:" + newLine
                    + "\tName: " + deploymentOutput.DeployedWebService.Name + newLine
                    + "\tApiLocation: " + deploymentOutput.DeployedWebService.ApiLocation + newLine
                    + "\tExperimentLocation: " + deploymentOutput.DeployedWebService.ExperimentLocation + newLine
                    + "\tHelpLocation: " + deploymentOutput.DeployedWebService.HelpLocation + newLine
                    + "\tPrimaryKey: " + deploymentOutput.DeployedWebService.PrimaryKey + newLine
                    + "\tSecondaryKey: " + deploymentOutput.DeployedWebService.SecondaryKey + newLine);
                mLogger.WriteEmptyLineAsync();
                mLogger.Write(TraceEventType.Information, "Total time elapsed: " + stopwatch.Elapsed.ToString());
                mLogger.WriteEmptyLineAsync();
            }
            catch (Exception ex)
            {
                DisplayException(ex);
            }
        }

        private async void masterPackButton_Click(object sender, EventArgs e)
        {
            try
            {
                EnsureApiClientIsInitialized();

                if (inputTextBox.Text.Length == 0)
                {
                    throw new Exception("Enter valid value for MasterExperimentId");
                }

                await mClient.PackExperimentAsync(inputTextBox.Text);
            }
            catch(Exception ex)
            {
                DisplayException(ex);
            }
        }

        private async void createProjectButton_Click(object sender, EventArgs e)
        {
            try
            {
                EnsureApiClientIsInitialized();

                if (masterWorkspaceIdBox.Text.Length == 0)
                {
                    throw new Exception("Enter valid value for TrainingExperimentId");
                }

                if (masterExperimentIdBox.Text.Length == 0)
                {
                    throw new Exception("Enter valid value for ScoringExperimentId");
                }

                await mClient.CreateProjectAsync(masterWorkspaceIdBox.Text, masterExperimentIdBox.Text);
            }
            catch (Exception ex)
            {
                DisplayException(ex);
            }
        }

        private async void deleteWorkspaceButton_Click(object sender, EventArgs e)
        {
            try
            {
                EnsureApiClientIsInitialized();

                if (inputTextBox.Text.Length == 0)
                {
                    throw new Exception("Please specify workspaceId to be deleted");
                }

                await mClient.DeleteWorkspaceIfExistsAsync(inputTextBox.Text);
            }
            catch(Exception ex)
            {
                DisplayException(ex);
            }
        }

        private async void deleteWorkspacesButton_Click(object sender, EventArgs e)
        {
            try
            {
                EnsureApiClientIsInitialized();

                if (inputTextBox.Text.Length == 0)
                {
                    throw new Exception("Please specify part of the workspace name to be deleted, we'll delete all that match");
                }

                foreach (var workspace in await mClient.ListWorkspacesAsync())
                {
                    if (!workspace.Name.Contains(inputTextBox.Text))
                        continue;

                    bool fDeleteSucceeded = false;
                    try
                    {
                        await mClient.DeleteWorkspaceIfExistsAsync(workspace.Id);
                        fDeleteSucceeded = true;
                    }
                    catch(Exception ex)
                    {
                        mLogger.Write(TraceEventType.Error, "Failed to delete workspace with Name={0}, Id={1}, Exception:{2}", workspace.Name, workspace.Id, ex.Message);
                    }
                    finally
                    {
                        if (fDeleteSucceeded)
                        {
                            mLogger.Write(TraceEventType.Information, "Successfully deleted workspace with Name={0}, Id={1}", workspace.Name, workspace.Id);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                DisplayException(ex);
            }
        }
    }
}
