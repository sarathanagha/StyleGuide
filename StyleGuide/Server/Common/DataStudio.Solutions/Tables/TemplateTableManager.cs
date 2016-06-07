using Microsoft.DataStudio.Solutions.Tables.Entities;

namespace Microsoft.DataStudio.Solutions.Tables
{
    public class TemplateTableManager : TableManager<TemplateEntity>
    {
        private const string DefaultPartitionKey = "Templates";
        public TemplateTableManager(string connectionString)
            : base(TableNames.Templates, DefaultPartitionKey, connectionString)
        {
        }
    }
}