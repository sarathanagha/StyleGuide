using Microsoft.DataStudio.Solutions.Tables.Entities;

namespace Microsoft.DataStudio.Solutions.Tables
{
    public class ConfigurationsTableManager : TableManager<ConfigurationEntity>
    {
        public ConfigurationsTableManager(string partitionKey, string connectionString)
            : base(TableNames.Configurations, partitionKey, connectionString)
        {
        }
    }
}