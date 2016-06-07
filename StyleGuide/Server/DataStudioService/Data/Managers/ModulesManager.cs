using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.DataStudio.Services.Data.Models.Contracts;

namespace Microsoft.DataStudio.Services.Data.Managers
{
    public sealed class ModulesManager : DataManagerBase
    {
        public Task<IEnumerable<ModuleInfo>> ListAvailableModulesAsync(Guid subscriptionId)
        {
            // TODO: this should later be fetched from azure storage..
            IEnumerable<ModuleInfo> modules = new List<ModuleInfo>()
                {
                    new ModuleInfo("datafactory", "Data Factory"),
                    new ModuleInfo("machinelearning", "Machine Learning Studio"),
                    new ModuleInfo("streamanalytics", "Stream Analytics"),
                    new ModuleInfo("ipython", "Notebooks"),
                    new ModuleInfo("dataconnect", "Data Connections"),
                    new ModuleInfo("gallery", "Gallery")
                };

            return Task.FromResult(modules);
        }
    }
}