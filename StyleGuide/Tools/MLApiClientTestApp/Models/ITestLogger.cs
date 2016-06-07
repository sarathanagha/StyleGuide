using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.DataStudio.Diagnostics;

namespace MLApiClientTestApp.Models
{
    // I basically use this to write to a TextBox control in my unit test app
    public interface ITestLogger : ILogger
    {
        void WriteEmptyLineAsync();

        void Clear();
    }
}
