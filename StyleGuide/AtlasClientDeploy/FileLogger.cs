//------------------------------------------------------------------------------
// <copyright>
//     Copyright (c) Microsoft Corporation. All Rights Reserved.
// </copyright>
//------------------------------------------------------------------------------

using System;
using System.Globalization;
using System.IO;
using Microsoft.DPG.Deployment.Logging;
using Microsoft.DPG.AzureHelperUtilities.Logging;
using Microsoft.Azure.Common;

namespace Microsoft.Streaming.Service.NrtDeploy
{
    internal sealed class FileLogger : IDisposable
    {
        private readonly string _filepath;
        private TextWriter _writer;

        public FileLogger(string name)
        {
            _filepath = Path.Combine(
                Path.GetTempPath(),
                string.Format(CultureInfo.InvariantCulture, "{0}_{1}.log", name, DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss", CultureInfo.InvariantCulture)));
            _writer = TextWriter.Synchronized(File.CreateText(_filepath));
        }

        public class LogEntry2
        {

        }

        public void Write(LogEntry entry)
        {
            _writer.WriteLine("[{0}] {1} {2}", entry.TraceLevel, entry.Timestamp, entry.Subject);
            _writer.Flush();
        }

        public void Dispose()
        {
            if (_writer != null)
            {
                _writer.Dispose();
                _writer = null;
                Console.WriteLine("Log is saved at : {0}", _filepath);
            }
        }
    }
}
