using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Table;

namespace Microsoft.DataStudio.Solutions.Helpers
{
    public static class StorageHelpers
    {
        public static async Task<IList<T>> ExecuteQueryAsync<T>(
            this CloudTable table, 
            TableQuery<T> query, 
            CancellationToken ct = default(CancellationToken), 
            Action<IList<T>> onProgress = null) where T : ITableEntity, new()
        {
            var items = new List<T>();

            TableContinuationToken token = null;

            do
            {
                TableQuerySegment<T> seg = await table.ExecuteQuerySegmentedAsync(query, token, ct);
                token = seg.ContinuationToken;
                items.AddRange(seg);
                if (onProgress != null)
                {
                    onProgress.Invoke(items);
                }

            } while (token != null && !ct.IsCancellationRequested);

            return items;
        }
    }
}