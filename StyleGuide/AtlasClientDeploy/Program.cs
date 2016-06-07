//------------------------------------------------------------------------------
// <copyright>
//     Copyright (c) Microsoft Corporation. All Rights Reserved.
// </copyright>
//------------------------------------------------------------------------------

using System;
using System.Activities;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using Microsoft.DPG.Deployment.Logging;
// Added this refrence to resolve build failures 
// when copying NetwtonSoft.json.dll
using Newtonsoft.Json;

namespace Microsoft.Streaming.Service.NrtDeploy
{
    internal class Program
    {
        public static int Main(string[] args)
        {
            try
            {   
                var paras = Parameter.Parse(args).ToArray();
                var actionName = paras.FirstOrDefault();
                if (actionName == null || !actionName.IsOrphan)
                {
                    ShowHelp();
                    return 1;
                }

                var workflow = GetWorkflow(actionName.Value);
                if (workflow == null)
                {
                    ShowHelp();
                    return 1;
                }

                if (paras.Any(p => p.Name == "help" || p.Name == "?"))
                {
                    ShowHelp(workflow);
                    return 1;
                }

                paras = paras.Skip(1).ToArray();
                var arguments = GetWorkflowArguments(workflow, paras);
                if (arguments == null)
                {
                    ShowHelp(workflow);
                    return 1;
                }

                int ret = 0;
                using (var syncEvent = new AutoResetEvent(false))
                {
                    string dir = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
                    if (!Environment.CurrentDirectory.Equals(dir, StringComparison.CurrentCultureIgnoreCase))
                    {
                        Console.WriteLine("Set current directory : {0}", dir);
                        Environment.CurrentDirectory = dir;
                    }

                    using (var filelogger = new FileLogger(workflow.DisplayName))
                    {
                        
                        Log.AddEntryPosted(filelogger.Write);
                        var workflowApp = new WorkflowApplication(workflow, arguments);
                        workflowApp.Extensions.Add(new ConsoleWriter(TrackingStyle.Concise));
                        workflowApp.Completed = e => syncEvent.Set();
                        workflowApp.Aborted = e =>
                        {
                            ret = -1;
                            syncEvent.Set();
                        };
                        workflowApp.OnUnhandledException = e =>
                        {
                            Console.Error.WriteLine(e.UnhandledException);
                            return UnhandledExceptionAction.Abort;
                        };
                        workflowApp.Run();
                        syncEvent.WaitOne();
                    }
                }

                Log.UnsubscribeAllFromEntryPosted();
                return ret;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return -1;
            }
        }

        private static Dictionary<string, object> GetWorkflowArguments(Activity workflow, Parameter[] paras)
        {
            var wfargs = workflow.GetParameters().ToArray();
            foreach (var rp in wfargs.Where(a => a.IsRequired && paras.All(
                p => !a.Name.Equals(p.Name, StringComparison.OrdinalIgnoreCase))))
            {
                Console.WriteLine("Missing required parameter {0}.", rp.Name);
                return null;
            }

            foreach (var np in paras)
            {
                var arg = wfargs.SingleOrDefault(a => a.Name.Equals(np.Name, StringComparison.OrdinalIgnoreCase));
                if (arg == null)
                {
                    Console.WriteLine("Unknown parameter {0}.", np.Name);
                    return null;
                }

                np.Name = arg.Name;
            }

            return paras.ToDictionary(p => p.Name, p => (object)p.Value);
        }

        private static void ShowHelp()
        {
            string name = Assembly.GetEntryAssembly().GetName().Name.ToLower(CultureInfo.CurrentCulture);
            Console.WriteLine("Type {0} <action> -? for action description.", name);
            Console.WriteLine();
            Console.WriteLine("Action:");
            foreach (var activity in Assembly.GetEntryAssembly().GetTypes().Where(t => t.IsSubclassOf(typeof(Activity))))
            {
                Console.WriteLine("    {0}", activity.Name);
            }
        }

        private static void ShowHelp(Activity activity)
        {
            Console.WriteLine("Action : {0}", activity.DisplayName);
            foreach (var p in activity.GetParameters())
            {
                Console.WriteLine("    {0} Parameter : {1}", p.IsRequired ? "Required" : "Optional", p.Name);
            }
        }

        private static Activity GetWorkflow(string actionName)
        {
            Type activityType =
                Assembly.GetEntryAssembly()
                        .GetTypes()
                        .SingleOrDefault(
                            t =>
                            t.IsSubclassOf(typeof(Activity)) &&
                            t.Name.Equals(actionName, StringComparison.CurrentCultureIgnoreCase));
            if (activityType == null)
            {
                return null;
            }

            return (Activity)activityType.GetConstructor(new Type[] { }).Invoke(null);
        }
    }
}
