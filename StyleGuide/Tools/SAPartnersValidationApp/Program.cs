using Microsoft.Azure.Management.Resources.Models;
//using Microsoft.CortanaAnalytics.SolutionAccelerators.Shared;
using Microsoft.DataStudio.SolutionAccelerators.Shared;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Net;

namespace Microsoft.CortanaAnalytics.SolutionAccelerators.Tools.PartnersValidationApp
{
    class Program
    {
        private static string aadInstance = ConfigurationManager.AppSettings["login"];
        private static string tenant = ConfigurationManager.AppSettings["tenantId"];
        private static string apiEndpoint = ConfigurationManager.AppSettings["apiEndpoint"];
        private static string clientId = ConfigurationManager.AppSettings["clientId"];
        private static string templateFileName = "AzureDeploy.json";
        private static string parametersFileName = "azuredeploy-parameters.json";
        private static string manifestFileName = "manifest.json";
        private static string schemaFileName = "schema.manifest.json";

        static void Main(string[] args)
        {
            Console.WriteLine("***************************************************************");
            Console.WriteLine("* Welcome to the solution accelerator partner validation app! *");
            Console.WriteLine("***************************************************************");
            string templateSrc = null;
            string subscriptionId = null;
            string resourceGroup = null;

            if (args.Length < 1)
            {
                Console.WriteLine("Usage: PartnersValidationApp.exe [Zip file or directory containing SA manifest.json] [SubscriptionId] [ResourceGroupName]");
                Console.WriteLine("Please provide path to a zip file or directory containing Solution Accelerator manifest.json file:");
                templateSrc = Console.ReadLine();
                Console.WriteLine("Please provide a valid Azure subscription ID to use for Solution Accelerator:");
                subscriptionId = Console.ReadLine();
                Console.WriteLine("Please provide a resource group name for validate/deploy:");
                resourceGroup = Console.ReadLine();
            }
            else
            {
                if (args.Length == 1 && HelpRequired(args[0]))
                {
                    DisplayHelp();
                    return;
                }
                if (args.Length == 1 && TokenRequired(args[0])) 
                {
                    DisplayToken();
                    return;
                }

                templateSrc = args[0];
                if (args[1] == null)
                {
                    Console.WriteLine("Usage: PartnersValidationApp.exe [Zip file or directory containing SA manifest.json] [SubscriptionId] [ResourceGroupName]");
                    Console.WriteLine("Please provide a valid subscription Id");
                    return;
                }
                subscriptionId = args[1];
                if (args[2] == null)
                {
                    Console.WriteLine("Usage: PartnersValidationApp.exe [Zip file or directory containing SA manifest.json] [SubscriptionId] [ResourceGroupName]");
                    Console.WriteLine("Please provide the resource group name");
                }
                resourceGroup = args[2];
            }

            // 1. Validate input Solution Accelerator templates, accepts zip file containing the template directory, or a valid directory
            string templatesDir = null;
            string[] templatePaths = null;
            string[] templateJSONs = null;
            string[] templateParams = null;
            try
            {
                templatesDir = ValidateTemplatesDir(templateSrc);
                templatePaths = GetTemplatesPaths(templatesDir);
                if (templatePaths != null)
                {
                    GetTemplatesJSONs(templatePaths, templatesDir, out templateJSONs, out templateParams);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("!!! Error: {0} !!!\n\r", ex);
                return;
            }

            if (templateJSONs != null)
            {
                // 2. Get the access token for accessing Solution Accelerator
                string token = null;
                try {
                    token = GetAuthToken();
                }
                catch (AdalException ex)
                {
                    Console.WriteLine("!!! Get auth token failed due to the following exception:\n\r{0} !!!\n\r", ex);
                    return;
                }

                // 3. Validate or deploy validate the template depends on user choice (note API takes one template at a time)
                if (token != null)
                {
                    Console.WriteLine("Authenticated. The received auth token is: \n\r{0}\n\r", token);
                    Console.WriteLine("Now, choose if you'd like to validate or deploy and validate the templates");
                    Console.WriteLine("  1. Deploy and validate");
                    Console.WriteLine("  2. Validate without deploy");
                    string choice = Console.ReadLine();

                    // Unless user specifies "2", any other inputs fall back to 1
                    for (int i = 1; i <= templateJSONs.Length; i++)
                    {
                        string deploymentName = null; 
                        try
                        {
                            if (choice == "2")
                            {
                                Console.WriteLine("You chose to validate without deploy, processing your request...");
                                ValidateTemplate(resourceGroup, token, subscriptionId, templateJSONs[i - 1], templateParams[i - 1], i);
                            }
                            else
                            {
                                Console.WriteLine("You chose to deploy and validate the templates, processing your request...");
                                deploymentName = DeployTemplate(token, subscriptionId, resourceGroup, templateJSONs[i - 1], templateParams[i - 1], i);
                                Console.WriteLine("*** Deployment {0} completes with no error. =) ***\n\r", i);
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("!!! Template Validation/Deployment {0} failed with error: {1} !!!\n\r", i, ex);
                        }
                    }
                }
                else
                {
                    Console.WriteLine("!!! Error: failed to get valid access token, opearation aborted !!!");
                }
            }
            Console.WriteLine("*** Validation App finishes execution, press any key to exit ***");
            Console.ReadLine();
        }

        // Helper: Given the template directory, validate files and solution accelerator schema, return the ARM template Jsons back
        private static string ValidateTemplatesDir(string templateSrc)
        {
            // The provided template path is a zip file, extract it locally
            if (Path.GetExtension(templateSrc) == ".zip")
            {
                Console.WriteLine("*** Unzip solution accelerator manifest and templates from file {0} ***\n\r", templateSrc);
                string path = Directory.GetCurrentDirectory();
                string extractPath = path + @"\" + Path.GetFileNameWithoutExtension(templateSrc);
                if (Directory.Exists(extractPath))
                {
                    Directory.Delete(extractPath, true);
                }
                ZipFile.ExtractToDirectory(templateSrc, extractPath);
                return extractPath;
            }
            // The provided template path is a directory, use it directly
            if (Path.GetExtension(templateSrc) == "")
            {
                Console.WriteLine("*** Process solution accelerator manifest and templates from directory {0} ***\n\r", templateSrc);
                return templateSrc;
            }

            throw new NotSupportedException("Provided template format unsupported, please provide a dir or a zip file containing solution accelerator templates");
        }

        // Helper: Given the directory containing templates, return all the file paths
        private static string[] GetTemplatesPaths(string templateDir)
        {
            string manifestFile = templateDir + @"\" + Program.manifestFileName;
            string schemaFile = templateDir + @"\" + Program.schemaFileName;
            List<string> templatePaths = null;
            using (StreamReader sr = File.OpenText(manifestFile))
            {
                string json = sr.ReadToEnd();
                TemplatesBundle deserializedTemplates = JsonConvert.DeserializeObject<TemplatesBundle>(json);
                templatePaths = new List<string>();
                foreach (Bundle b in deserializedTemplates.bundles) {
                    templatePaths.Add(b.bundle);
                    Console.WriteLine("Template Name: {0}", b.title);
                    Console.WriteLine("Template Path: {0}\n\r", b.bundle);
                }
            }

            return templatePaths.ToArray();
        }

        // Helper: From the metadata provided template paths, get the JSON of reach ARM template
        private static void GetTemplatesJSONs(string[] templatePaths, string templatesDir, out string[] templateJSONs, out string[] templateParams)
        {
            List<string> jsons = new List<string>();
            List<string> tempParams = new List<string>();
            foreach (string s in templatePaths)
            {
                string sp = s.Trim().Replace(@"/", @"\");
                // if relative path is used, append the template dir and get absolute path
                if (sp.StartsWith(".") || sp.StartsWith(@"\"))
                {
                    sp = templatesDir + @"\" + sp;
                }

                // 1. Template path points to a template file
                if (File.Exists(sp) && Path.GetExtension(sp) == ".json") 
                {
                    using (StreamReader sr = File.OpenText(sp))
                    {
                        Console.WriteLine("*** Processing template file {0} ***\n\r", sp);
                        jsons.Add(sr.ReadToEnd());
                        // Add empty string for parameter file
                        tempParams.Add(string.Empty);
                    }
                }
                // 2. Template path points to a directory, look for the template file with pre-defined name in this directory
                //    Also check for parameter file in the directory, save it if there's one
                else if (Directory.Exists(sp))
                {
                    string f = sp + @"\" + Program.templateFileName;
                    using (StreamReader sr = File.OpenText(f))
                    {
                        Console.WriteLine("*** Processing template file {0} ***\n\r", f);
                        jsons.Add(sr.ReadToEnd());
                    }
                    string p = sp + @"\" + Program.parametersFileName;
                    if (File.Exists(p))
                    {
                        using (StreamReader sr = File.OpenText(p))
                        {
                            Console.WriteLine("*** Processing template parameters file {0} ***\n\r", p);
                            tempParams.Add(sr.ReadToEnd());
                        }
                    }
                    else
                    {
                        tempParams.Add(string.Empty);
                    }
                }
                else
                {
                    Console.WriteLine("!!! Template file with bundle name {0} is not found !!!\n\r", s);
                }
            }

            templateJSONs = jsons.ToArray();
            templateParams = tempParams.ToArray();
        }

        // Helper: Obtain the access token to subscription
        private static string GetAuthToken(bool useCachedValue = false)
        {
            AuthenticationResult result = null;
            var _context = new AuthenticationContext(string.Format(aadInstance, tenant));
            if (useCachedValue)
            {
                result = _context.AcquireToken(apiEndpoint, clientId, new Uri(ConfigurationManager.AppSettings["redirectUri"]));
            }
            else
            {
                result = _context.AcquireToken(apiEndpoint, clientId, new Uri(ConfigurationManager.AppSettings["redirectUri"]), PromptBehavior.Always);
            }

            if (result == null)
            {
                Console.WriteLine("Auth token obtained is not valid!\n\r");
                return null;
            }

            return result.AccessToken;
        }

        // Helper: call Solution Accelerator validate API, the template is not deployed
        public static void ValidateTemplate(string resourceGroup, string token, string subscriptionId, string template, string tempParam, int i)
        {
            // TODO (sbian): check if resource group exists using Azure SDK API, create one if doesn't exists

            Console.WriteLine("*** Now validating template {0}, this will take a while... ***\n\r", i);
            Provision prov = new Provision(subscriptionId, token);
            var saDeploymentProperties = new SADeploymentProperties()
            {
                Template = template
            };

            if (string.IsNullOrEmpty(tempParam))
            {
                saDeploymentProperties.Parameters = tempParam;
            }

            var result = prov.ValidateTemplate(resourceGroup, saDeploymentProperties);
            if (result != null && result.IsValid)
            {
                Console.WriteLine("*** Solution template validation {0} completes with no errors... ***\n\r", i);
                return;
            }

            if (result == null)
            {
                Console.WriteLine("!!! Validate template API call {0} failed with null response !!!\n\r", i);
            }
            else
            {
                Console.WriteLine("!!! Validate template API call {0} failed with status: {1} !!!\n\r", i, result.StatusCode.ToString());
            }
        }
        
        // Helper: call Solution Accelerator deployment API and deploy one template
        public static string DeployTemplate(string token, string subscriptionId, string resourceGroup, string template, string tempParam, int i)
        {
            // TODO (sbian): check if resource group exists using Azure SDK API, create one if doesn't exists

            Console.WriteLine("*** Now try deploying the solution {0}, this will take a while... ***\n\r", i);
            Provision prov = new Provision(subscriptionId, token);
            var saDeploymentProperties = new SADeploymentProperties() 
            {
                Template = template
            };

            if (string.IsNullOrEmpty(tempParam))
            {
                saDeploymentProperties.Parameters = tempParam;
            }

            var result = prov.DeployTemplate(resourceGroup, saDeploymentProperties);
            if (result != null & result.StatusCode.Equals(HttpStatusCode.Created))
            {
                var deploymentName = result.Deployment.Name;
                Console.WriteLine("*** Solution template {0} deployed successfully with deployment name {1}... ***\n\r", i, deploymentName);
                return deploymentName.ToString();
            }
            if (result == null)
            {
                Console.WriteLine("!!! Deploy template API call {0} failed with null response !!!\n\r", i);
            }
            else
            {
                Console.WriteLine("!!! Deploy template API call {0} failed with status: {1} !!!\n\r", i, result.StatusCode.ToString());
            }
            return null;
        }

        // Helper: check if user is query for help content
        private static bool HelpRequired(string param)
        {
            return param == "-h" || param == "/?" || (param.ToLower(CultureInfo.InvariantCulture).IndexOf("help", System.StringComparison.Ordinal) >= 0);
        }

        // Helper: check if user is use token test hook
        private static bool TokenRequired(string param)
        {
            return param.ToLower(CultureInfo.InvariantCulture).IndexOf("token", System.StringComparison.Ordinal) >= 0;
        }

        // Helper: display help information for this test app
        private static void DisplayHelp()
        {
            Console.WriteLine("Usage:");
            Console.WriteLine("-- PartnersValidationApp.exe [Zip file or directory containing SA manifest.json] [SubscriptionId] [ResourceGroupName]");
            Console.WriteLine("-- Just need access token? *** PartnersValidationApp.exe token ***");
            Console.WriteLine("-- Open this help? *** PartnersValidationApp.exe -h ***");
            Console.WriteLine("Other things to note:");
            Console.WriteLine("-- Please use your Microsoft account to login, Live accounts will not work");
            Console.WriteLine("-- App assumes template directory or zip contains a single manifest file {0}", manifestFileName);
            Console.WriteLine("-- App assumes a single template file with name {0} for each template", templateFileName);
        }

        // Helper: display access token 
        private static void DisplayToken()
        {
            string token = null;
            try
            {
                token = GetAuthToken(true);
            }
            catch (AdalException ex)
            {
                Console.WriteLine("Obtaining access token failing with the following exception: {0}", ex);
            }
            
            Console.WriteLine("Access token obtained:\n\r{0}", token);
        }

        // Helper: Debug function which would list all resources
        public async static void ListAllResources(string token)
        {
            Console.WriteLine("getting resources from subscription. This may take a few minutes...\n");

            ResourceListResult resourceListResult = await ResourceExplorer.ListAllResources(token);
            foreach (var resources in resourceListResult.Resources)
            {
                Console.WriteLine("{0} \r", resources.Name);
                Console.WriteLine("{0} \r", resources.Location);
                Console.WriteLine("{0} \r", resources.Type);
                Console.WriteLine("{0} \r\n", resources.Id);
            }
            Console.WriteLine("end of resources");
        }
    }
}
