using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace Microsoft.DataStudio.Solutions.Tables
{
    public class TableManager<T> where T : TableEntity, new()
    {
        protected string PartitionKey;
        protected TableStorage<T> Table;

        public TableManager(string tableName, string partitionKey, string connectionString)
        {
            this.PartitionKey = partitionKey;
            this.Table = new TableStorage<T>(tableName, connectionString);
        }

        public TableManager(string tableName, string partitionKey, CloudStorageAccount storageAccount)
        {
            this.PartitionKey = partitionKey;
            this.Table = new TableStorage<T>(tableName, storageAccount);
        }

        public Task DeleteAsync(string id)
        {
            ThrowIf.NullOrEmpty(id, "id");

            return this.Table.DeleteEntityAsync(this.PartitionKey, id);
        }

        public Task DeleteAllAsync()
        {
            return this.Table.DeleteEntitiesByPartitionKeyAsync(this.PartitionKey);
        }


        public Task<T> GetAsync(string id)
        {
            ThrowIf.NullOrEmpty(id, "id");

            return this.Table.GetEntityAsync(this.PartitionKey, id);
        }

        public Task<IEnumerable<T>> GetAsync()
        {
            return this.Table.GetEntitiesByPartitionKeyAsync(this.PartitionKey);
        }

        public Task InsertOrUpdateAsync(T entity)
        {
            ThrowIf.Null(entity, "entity");

            return this.Table.InsertOrUpdateAsync(entity);
        }

        public Task<IEnumerable<T>> ExecuteQueryAsync(TableQuery<T> query, CancellationToken ct)
        {
            ThrowIf.Null(query, "query");

            return this.Table.ExecuteQueryAsync(query, ct);
        }
    }
}