using Microsoft.DataStudio.Solutions.Tables.Entities;
using Microsoft.WindowsAzure.Storage;

namespace Microsoft.DataStudio.Solutions.Tables
{
    public class SolutionTableManager : TableManager<SolutionEntity>
    {
        public SolutionTableManager(string subscriptionId, string connectionString) 
            : base(TableNames.Solutions, subscriptionId, connectionString)
        {
        }

        public SolutionTableManager(string subscriptionId, CloudStorageAccount storageAccount)
            : base(TableNames.Solutions, subscriptionId, storageAccount)
        {
        }
    }
}