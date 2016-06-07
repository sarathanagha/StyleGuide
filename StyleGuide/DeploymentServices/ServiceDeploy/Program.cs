//==============================================================================
// Copyright (c) Microsoft Corporation. All Rights Reserved.
//==============================================================================

using Microsoft.DataPipeline.Deployment.Workflow.Services;
using System;
using System.Text;

namespace Microsoft.DataPipeline.Deployment.Workflow
{
    class Program
    {
        enum ExitCode
        {
            Success = 0,
            Error,
            BadArguments
        }
        public static void Main(string[] args)
        {
            var options = ServiceCmdLineOptions.Parse(args);
            if (options == null)
            {
                Exit(ExitCode.BadArguments);
            }

            var deployment = new ServiceDeployment(options, new WadiLogWriter(Console.Out));
            try
            {
                deployment.Run();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("An exception occurred: {0}: {1}", ex.GetType().Name, ex.Message);
                Console.Error.WriteLine(WriteException(ex));
                Exit(ExitCode.Error);
            }

            Exit(ExitCode.Success);
        }

        static string WriteException(Exception exception)
        {
            if (exception != null)
            {
                StringBuilder error = new StringBuilder();
                string stackTrace = exception.StackTrace;
                do
                {
                    error.AppendLine(Error.Format("{0}: {1}", exception.GetType().Name, exception.Message));

                    exception = exception.InnerException;
                }
                while (exception != null);

                error.AppendLine("stack trace: " + stackTrace);
                return error.ToString();
            }
            return string.Empty;
        }

        static void Exit(ExitCode exitCode)
        {
            Environment.Exit((int) exitCode);
        }
    }
}
