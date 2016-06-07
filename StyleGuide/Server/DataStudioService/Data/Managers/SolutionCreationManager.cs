using Microsoft.DataStudio.Services.Data.Models.Contracts;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.Services.Data.Managers
{
    public sealed class SolutionCreationManager : DataManagerBase
    {
        public Task<SolutionCreationInfo> GetSolutionCreationFieldsAsync(Guid subscriptionId, string moduleId)
        {
            SolutionCreationInfo createSolutionList = null;
            switch (moduleId)
            {
                case "datafactory":
                    createSolutionList = new SolutionCreationInfo("adfSolution", "Create New Data Pipeline",
                        new List<SolutionCreationField>()
                        {
                            new SolutionCreationField("pipelineName", "Pipeline Name", "text", "^[a-zA-Z.]{4,15}$", true),
                            new SolutionCreationField("solutionName", "Solution Name", "text", "^[a-zA-Z.]{4,15}$", true)
                        }
                    );
                    break;
                default:
                    break;
            }

            return Task.FromResult(createSolutionList);
        }
    }
}