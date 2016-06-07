using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.DataStudio.Diagnostics;
using MLApiClientTestApp.Models;

namespace MLApiClientTestApp
{
    class TextBoxLogger : ITestLogger
    {
        private const string newLine = "\r\n";
        private TextBox mTextBox = null;

        public TextBoxLogger(TextBox textBox)
        {
            mTextBox = textBox;
        }

        private delegate void AppendTextCallback(string text);

        public void Write(TraceEventType logLevel, string message)
        {
            this.Write(logLevel, message, null);
        }

        public void Write(TraceEventType eventType, string format, params object[] args)
        {
            this.Write(eventType, null, format, args);
        }

        public void Write(TraceEventType eventType, IDictionary<string, string> additionalProperties, string format, params object[] args)
        {
            this.Write(eventType, DateTime.UtcNow, additionalProperties, format, args);
        }

        public void Write(TraceEventType eventType, DateTime timeStamp, IDictionary<string, string> properties, string format, params object[] args)
        {
            string message = LogHelpers.FormatString(format, args);
            string additionalProperties = LogHelpers.ToString(properties);

            string displayText = eventType.ToString() + ": " + message;

            if (additionalProperties != string.Empty)
            {
                displayText += (", Additional properties: " + additionalProperties);
            }

            displayText += newLine; // I want to always put a new line in the TextBox..

            AppendTextAsync(displayText);
        }

        public void WriteEmptyLineAsync()
        {
            AppendTextAsync(newLine);
        }

        public void Clear()
        {
            // Fow now, I'm assuming this is UI thread call only...
            mTextBox.Clear();
        }

        private void AppendTextAsync(string text)
        {
            if(mTextBox.InvokeRequired)
            {
                var callback = new AppendTextCallback(AppendTextAsync);
                mTextBox.Invoke(callback, new object[] { text });
            }
            else
            {
                mTextBox.AppendText(text);
            }
        }
    }
}
