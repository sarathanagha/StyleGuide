using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Diagnostics;
using System.IO;

namespace StorageAccountSyncTool
{
    class Program
    {
        static void Main(string[] args)
        {
            Task.WaitAll(new Program().ExecuteAsync(args));
        }

        private static string s_DestAccNameArg = "/dest:";
        private static string s_DestAccKeyArg = "/destKey:";
        private static string s_TemplatesDirArg = "/templatesdir:";
        private static string s_VerboseArg = "/verbose";

        private string mDestStorageAccountName = null;
        private string mDestStorageAccountKey = null;
        private string mTemplatesDir = null;
        private bool mVerbose = false;

        public Program()
        {
        }

        public async Task ExecuteAsync(string[] args)
        {
            try
            {
                await ExecuteAsyncInternal(args);
            }
            catch(Exception ex)
            {
                Console.Write(ex);
                Exit(-1);
            }
        }

        private async Task ExecuteAsyncInternal(string[] args)
        {
            ParseCommandlineParams(args);

            EnsureValid(mDestStorageAccountName);
            EnsureValid(mDestStorageAccountKey);
            EnsureValid(mTemplatesDir);

            EnsureValidTemplatesDir(mTemplatesDir);

            var logger = new ConsoleLogger(mVerbose ? SourceLevels.Verbose : SourceLevels.Information);

            var mgr = new StorageAccountManager(mDestStorageAccountName, mDestStorageAccountKey, logger);
            await mgr.SyncTemplatesFromDirectoryAsync(mTemplatesDir);
        }

        private void EnsureValid(string arg)
        {
            if (string.IsNullOrEmpty(arg))
            {
                ExitOnError("Incorrect commandline!");
            }
        }

        private void EnsureValidTemplatesDir(string arg)
        {
            // A little warning to users if the templates dir arg is incorrect
            if (!Directory.Exists(arg + "\\connectedcar"))
            {
                ExitOnError("Incorrect commandline - are you sure templateDir arg is correct?");
            }
        }

        private void ParseCommandlineParams(string[] args)
        {
            foreach(var arg in args)
            {
                if (arg.StartsWith(s_DestAccNameArg, StringComparison.OrdinalIgnoreCase))
                {
                    ExtractParamValue(arg, s_DestAccNameArg, ref mDestStorageAccountName);
                }
                else if (arg.StartsWith(s_DestAccKeyArg, StringComparison.OrdinalIgnoreCase))
                {
                    ExtractParamValue(arg, s_DestAccKeyArg, ref mDestStorageAccountKey);
                }
                else if (arg.StartsWith(s_TemplatesDirArg, StringComparison.OrdinalIgnoreCase))
                {
                    ExtractParamValue(arg, s_TemplatesDirArg, ref mTemplatesDir);
                }
                else if (arg.StartsWith(s_VerboseArg, StringComparison.OrdinalIgnoreCase))
                {
                    mVerbose = true;
                }
                else
                {
                    ExitOnError(string.Format("Unknown arg: {0}", arg));
                }
            }
        }

        private void ExtractParamValue(string arg, string param, ref string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                ExitOnError(string.Format("{0} is specified more than once?", param));
            }

            value = arg.Substring(param.Length);
        }

        private void ExitOnError(string message)
        {
            Console.WriteLine(message);
            PrintUsage();
            Exit(-1);
        }

        private void PrintUsage()
        {
            Console.WriteLine();

            string programName = System.AppDomain.CurrentDomain.FriendlyName;

            Console.WriteLine("{0} /templatesDir:<directory that has arm templates to sync from> /dest:<destination storage account name> /destKey:<destination storage account key>", programName);
        }

        private void Exit(int exitCode)
        {
            System.Environment.Exit(exitCode);
        }
    }
}
