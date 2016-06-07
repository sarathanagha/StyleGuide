using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.DataStudio.Solutions.Helpers;
using Microsoft.DataStudio.Solutions.Validators;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using Microsoft.WindowsAzure.Storage.Table;

namespace Microsoft.DataStudio.Solutions.Tables
{
    public class TableStorage<T> : ITableStorage<T> 
        where T : TableEntity, new()
    {
        // Batch operations are limited to 100 items.
        private const int MaxBatchSize = 100;

        // ReSharper disable once StaticMemberInGenericType
        private static readonly TableRequestOptions DefaultRequestOptions = new TableRequestOptions
        {
            RetryPolicy = new ExponentialRetry(TimeSpan.FromSeconds(1), 3)
        };

        protected readonly CloudTable CloudTable;

        public TableStorage(string tableName, string connectionString)
            : this(tableName, CloudStorageAccount.Parse(connectionString), DefaultRequestOptions)
        {

        }

        public TableStorage(string tableName, CloudStorageAccount storageAccount, TableRequestOptions tableRequestOptions = null)
        {
            Validate.TableName(tableName, "tableName");
            tableRequestOptions = tableRequestOptions ?? DefaultRequestOptions;

            var cloudTableClient = storageAccount.CreateCloudTableClient();
            cloudTableClient.DefaultRequestOptions = tableRequestOptions;

            this.CloudTable = cloudTableClient.GetTableReference(tableName);
            this.CloudTable.CreateIfNotExists();
        }

        public virtual async Task CreateEntityAsync(T entity)
        {
            ThrowIf.Null(entity, "entity");

            var insertOperation = TableOperation.Insert(entity);
            await CloudTable.ExecuteAsync(insertOperation);
        }

        public virtual async Task CreateEntitiesAsync(IEnumerable<T> entities)
        {
            ThrowIf.Null(entities, "entities");

            var batchOperation = new TableBatchOperation();

            foreach (var entity in entities)
            {
                batchOperation.Insert(entity);
            }

            await CloudTable.ExecuteBatchAsync(batchOperation);
        }

        public virtual async Task DeleteEntityAsync(string partitionKey, string rowKey)
        {
            Validate.TablePropertyValue(partitionKey, "partitionKey");
            Validate.TablePropertyValue(rowKey, "rowKey");

            var retrieveOperation = TableOperation.Retrieve<T>(partitionKey, rowKey);
            var retrievedResult = await CloudTable.ExecuteAsync(retrieveOperation);

            var entityToDelete = retrievedResult.Result as T;
            if (entityToDelete != null)
            {
                var deleteOperation = TableOperation.Delete(entityToDelete);
                await CloudTable.ExecuteAsync(deleteOperation);
            }
        }

        public virtual async Task DeleteEntitiesByPartitionKeyAsync(string partitionKey)
        {
            Validate.TablePropertyValue(partitionKey, "partitionKey");

            var query =
                new TableQuery<T>()
                    .Where(TableQuery.GenerateFilterCondition(
                        "PartitionKey",
                        QueryComparisons.Equal,
                        partitionKey));

            var results = await CloudTable.ExecuteQueryAsync(query);
            var batchOperation = new TableBatchOperation();
            var counter = 0;
            foreach (var entity in results)
            {
                batchOperation.Delete(entity);
                counter++;

                // When we reach MaxBatchSize, we commit and clear the operation
                if (counter == MaxBatchSize)
                {
                    await CloudTable.ExecuteBatchAsync(batchOperation);
                    batchOperation = new TableBatchOperation();
                    counter = 0;
                }
            }
        }

        public async Task DeleteEntitiesByRowKeyAsync(string rowKey)
        {
            Validate.TablePropertyValue(rowKey, "rowKey");

            var query =
                new TableQuery<T>()
                    .Where(TableQuery.GenerateFilterCondition(
                        "RowKey",
                        QueryComparisons.Equal,
                        rowKey));

            var results = await CloudTable.ExecuteQueryAsync(query);
            var batchOperation = new TableBatchOperation();
            var counter = 0;
            foreach (var entity in results)
            {
                batchOperation.Delete(entity);
                counter++;

                // When we reach MaxBatchSize, we commit and clear the operation
                if (counter == MaxBatchSize)
                {
                    await CloudTable.ExecuteBatchAsync(batchOperation);
                    batchOperation = new TableBatchOperation();
                    counter = 0;
                }
            }
        }

        public async Task<T> GetEntityAsync(string partitionKey, string rowKey)
        {
            var retrieveOperation = TableOperation.Retrieve<T>(partitionKey, rowKey);

            var retrievedResult = await CloudTable.ExecuteAsync(retrieveOperation);

            return retrievedResult.Result as T;
        }

        public async Task<IEnumerable<T>> GetEntitiesByPartitionKeyAsync(string partitionKey)
        {
            Validate.TablePropertyValue(partitionKey, "partitionKey");

            var query =
               new TableQuery<T>()
                   .Where(TableQuery.GenerateFilterCondition(
                       "PartitionKey",
                       QueryComparisons.Equal,
                       partitionKey));

            return await CloudTable.ExecuteQueryAsync(query);
        }

        public async Task<IEnumerable<T>> GetEntitiesByRowKeyAsync(string rowKey)
        {
            Validate.TablePropertyValue(rowKey, "rowKey");

            var query =
               new TableQuery<T>()
                   .Where(TableQuery.GenerateFilterCondition(
                       "RowKey",
                       QueryComparisons.Equal,
                       rowKey));

            return await CloudTable.ExecuteQueryAsync(query);
        }

        public async Task InsertOrUpdateAsync(T entity)
        {
            ThrowIf.Null(entity, "entity");
            var insertOrUpdateOperation = TableOperation.InsertOrMerge(entity);
            await CloudTable.ExecuteAsync(insertOrUpdateOperation);
        }

        public async Task<IEnumerable<T>> ExecuteQueryAsync(TableQuery<T> query, CancellationToken ct)
        {
            return await this.CloudTable.ExecuteQueryAsync(query, ct);
        }
    }
}