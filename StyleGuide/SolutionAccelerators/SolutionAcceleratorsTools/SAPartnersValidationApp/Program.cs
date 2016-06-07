using Microsoft.Azure.Management.Resources.Models;
using Microsoft.CortanaAnalytics.SolutionAccelerators.Shared;
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
        private static string testSubscriptionId = ConfigurationManager.AppSettings["subscriptionId"];
        private static string aadInstance = ConfigurationManager.AppSettings["login"];
        private static string tenant = ConfigurationManager.AppSettings["tenantId"];
        private static string apiEndpoint = ConfigurationManager.AppSettings["apiEndpoint"];
        private static string clientId = ConfigurationManager.AppSettings["clientId"];
        private static string templateFileName = "AzureDeploy.json";
        private static string testResourceGroup = "testatlaspreview";
        private static string manifestFileName = "manifest.json";
        private static string schemaFileName = "schema.manifest.json";
        private static string testTemplateSrc = @"\\scratch2\scratch\sbian\testArmTemplates.zip";

        static void Main(string[] args)
        {
            Console.WriteLine("***************************************************************");
            Console.WriteLine("* Welcome to the solution accelerator partner validation app! *");
            Console.WriteLine("***************************************************************");
            string templateSrc = null;
            string subscriptionId = Program.testSubscriptionId;

            // Parse inputs
            if (args.Length < 1)
            {
                Console.WriteLine("You did not provide a templates directory/zip as input, please provide path to a valid directory or zip containing templates");
                Console.WriteLine("Input nothing to use default test template {0}", Program.testTemplateSrc);
                templateSrc = Console.ReadLine();
                if (templateSrc.Length <= 0)
                {
                    Console.WriteLine("You did not provide a templates dir/zip or subscriptionId as input, use test template and subscriptionId\n\r");
                    templateSrc = Program.testTemplateSrc;
                }
            }
            else
            {
                if (args.Length == 1 && HelpRequired(args[0]))
                {
                    DisplayHelp();
                    return;
                }
                else if (args.Length == 1 && TokenRequired(args[0])) 
                {
                    DisplayToken();
                    return;
                }
                else
                {
                    templateSrc = args[0];
                    if (args.Length > 1)
                    {
                        Console.WriteLine("User explicitly provided subscription Id: {0}, use it\n\r", args[1]);
                        subscriptionId = args[1];
                    }
                }
            }

            // 1. Validate input Solution Accelerator templates, accepts zip file containing the template directory, or a valid directory
            string templatesDir = null;
            string[] templatePaths = null;
            string[] templateJSONs = null;
            try
            {
                templatesDir = ValidateTemplatesDir(templateSrc);
                templatePaths = GetTemplatesPaths(templatesDir);
                if (templatePaths != null)
                {
                    templateJSONs = GetTemplatesJSONs(templatePaths, templatesDir);
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

                // 3. Try deploy solution
                if (token != null)
                {
                    Console.WriteLine("Authenticated. The received auth token is: \n\r{0}\n\r", token);

                    // Validate deploy solution one template at a time
                    for (int i = 1; i <= templateJSONs.Length; i++)
                    {
                        string correlationId = null;
                        try
                        {
                            correlationId = DeployTemplate(token, subscriptionId, templateJSONs[i-1]);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("!!! Template Deployment {0} failed with error: {1} !!!\n\r", i, ex);
                        }

                        if (correlationId != null)
                        {
                            // TODO (sbian): 4. Check deployment status periodically until it finishes or errors out
                            Console.WriteLine("*** Deployment {0} completes with no error. =) ***\n\r", i);
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
                ZipFile.ExtractToDirectory(templateSrc, path);
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
        private static string[] GetTemplatesJSONs(string[] templatePaths, string templatesDir)
        {
            List<string> jsons = new List<string>();
            foreach (string s in templatePaths)
            {
                string sp = s.Trim().Replace(@"/", @"\");
                // if relative path is used, append the template dir and get absolute path
                if (sp.StartsWith(".") || sp.StartsWith(@"\"))
                {
                    sp = templatesDir + @"\" + sp;
                }

                // 1. template path points to a template file
                if (File.Exists(sp) && Path.GetExtension(sp) == ".json") 
                {
                    using (StreamReader sr = File.OpenText(sp))
                    {
                        Console.WriteLine("*** Processing template file {0} ***\n\r", sp);
                        jsons.Add(sr.ReadToEnd());
                    }
                }
                // 2. template path points to a directory, look for the template file with pre-defined name in this directory
                else if (Directory.Exists(sp))
                {
                    string f = sp + @"\" + Program.templateFileName;
                    using (StreamReader sr = File.OpenText(f))
                    {
                        Console.WriteLine("*** Processing template file {0} ***\n\r", f);
                        jsons.Add(sr.ReadToEnd());
                    }
                }
                else
                {
                    Console.WriteLine("!!! Template file with bundle name {0} is not found !!!\n\r", s);
                }
            }

            return jsons.ToArray();
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
        
        // Helper: call Solution Accelerator deployment API and deploy one template
        public static string DeployTemplate(string token, string subscriptionId, string template)
        {
            Console.WriteLine("*** Now try deploying the solution, this will take a while... ***\n\r");
            Provision prov = new Provision();
            Json json = new Json()
            {
                Content = template
            };

            string resourceGroup = Program.testResourceGroup;
            Guid correlationId;
            DeploymentResult result = prov.DeployTemplate(subscriptionId, resourceGroup, json, token);
            if (result != null)
            {
                // Correlation Id will be used to access the progress check API
                correlationId = result.CorrelationId;
                DeploymentOperationsCreateResult opResult = result.OperationResult;
                if (opResult != null && opResult.StatusCode.Equals(HttpStatusCode.Created))
                {
                    Console.WriteLine("*** Solution template deployed, ready to check status now... ***\n\r");
                    return result.CorrelationId.ToString();
                }
                else
                {
                    if (opResult == null)
                    {
                        Console.WriteLine("!!! Deployment failed, opResult is invalid !!!\n\r");
                    }
                    else
                    {
                        Console.WriteLine("!!! Deployment failed with wrong status code: {0} \n\r", opResult.StatusCode);
                    }
                    return null;
                }
            }

            Console.WriteLine("!!! Deployment template API call failed with null return value !!!\n\r");
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
            Console.WriteLine("-- PartnersValidationApp.exe [Zip file or directory containing SA manifest.json] [optional:SubscriptionId]");
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
