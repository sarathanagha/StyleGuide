using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.Solutions.Tables
{
    public interface ITableStorage<T>
    {
        Task CreateEntityAsync(T entity);

        Task CreateEntitiesAsync(IEnumerable<T> entities);

        Task InsertOrUpdateAsync(T entity);

        Task DeleteEntitiesByPartitionKeyAsync(string partitionKey);

        Task DeleteEntitiesByRowKeyAsync(string rowKey);

        Task DeleteEntityAsync(string partitionKey, string rowKey);

        Task<IEnumerable<T>> GetEntitiesByPartitionKeyAsync(string partitionKey);

        Task<IEnumerable<T>> GetEntitiesByRowKeyAsync(string rowKey);

        Task<T> GetEntityAsync(string partitionKey, string rowKey);
    }
}