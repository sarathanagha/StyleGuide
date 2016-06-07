using Microsoft.Azure.Management.DataLake.Store.Models;
using Microsoft.DataStudio.AzureResources;
using Microsoft.DataStudio.Diagnostics;
using Microsoft.DataStudio.Services.Data.Models.Contracts;
using Microsoft.DataStudio.Services.Data.Models.Enums;
using Microsoft.WindowsAzure.Management.HDInsight;
using Microsoft.WindowsAzure.Management.Sql.Models;
using Microsoft.WindowsAzure.Management.Storage.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace Microsoft.DataStudio.Services.Data.Managers
{
    public sealed class AzureResourcesManager : DataManagerBase
    {

        public AzureResourcesManager(string subscriptionId, string token, ILogger logger)
        {
            azureResourcesHelper = new AzureResourcesHelper(subscriptionId, token, logger);
        }

        private readonly AzureResourcesHelper azureResourcesHelper; 

        public async Task<IEnumerable<Resource>> GetAzureResourcesAsync()
        {
            List<Resource> azureResources = new List<Resource>();

            //TODO: pacodel add Category or family to resources so we can differentiate them in the UI. 
            List<Task<IList<Resource>>> tasks = new List<Task<IList<Resource>>>();
            tasks.Add(this.GetStorageAccountsAsync());
            tasks.Add(this.GetHDInsightClustersAsync());
            tasks.Add(this.GetDataLakeStoreAccountsAsync());
            tasks.Add(this.GetSqlResourcesAsync());
            await Task.WhenAll(tasks.ToArray());

            foreach (var task in tasks)
            {
                azureResources.AddRange(task.Result);
            }

            return azureResources;
        }

        private async Task<IList<Resource>> GetStorageAccountsAsync()
        {
            List<Resource> storageAccountsResources = new List<Resource>();
            IEnumerable<StorageAccount> storageAccounts = await azureResourcesHelper.GetStorageAccountsAsync();
            foreach (StorageAccount storageAccount in storageAccounts)
            {
                Resource storageResource = new Resource();
                storageResource.Name = storageAccount.Name;
                storageResource.Properties = new Collection<ResourceProperty>();
                ResourceProperty nameProperty = new ResourceProperty()
                {
                    PropertyName = "Name",
                    FriendlyName = "Name",
                    PropertyType = PropertyType.String,
                    PropertyValue = storageAccount.Name
                };
                storageResource.Properties.Add(nameProperty);

                ResourceProperty locationProperty = new ResourceProperty()
                {
                    PropertyName = "Location",
                    FriendlyName = "Location",
                    PropertyType = PropertyType.String,
                    PropertyValue = storageAccount.Properties.Location
                };
                storageResource.Properties.Add(locationProperty);

                ResourceProperty accountTypeProperty = new ResourceProperty()
                {
                    PropertyName = "AccountType",
                    FriendlyName = "Account Type",
                    PropertyType = PropertyType.String,
                    PropertyValue = storageAccount.Properties.AccountType
                };
                storageResource.Properties.Add(accountTypeProperty);

                ResourceProperty statusProperty = new ResourceProperty()
                {
                    PropertyName = "Status",
                    FriendlyName = "Status",
                    PropertyType = PropertyType.String,
                    PropertyValue = storageAccount.Properties.Status.ToString()
                };
                storageResource.Properties.Add(statusProperty);

                foreach (KeyValuePair<string, string> extendedProperty in storageAccount.ExtendedProperties)
                {
                    ResourceProperty property = new ResourceProperty()
                    {
                        PropertyName = extendedProperty.Key,
                        PropertyType = PropertyType.String,
                        PropertyValue = extendedProperty.Value
                    };
                    storageResource.Properties.Add(property);
                }
                storageAccountsResources.Add(storageResource);
            }
            return storageAccountsResources; 
        }

        private async Task<IList<Resource>> GetHDInsightClustersAsync()
        {
            List<Resource> hdInsightClusters = new List<Resource>();
            IEnumerable<ClusterDetails> clusters = await azureResourcesHelper.GetHDInsightClustersAsync();
            foreach (var cluster in clusters)
            {
                Resource clusterResource = new Resource();
                clusterResource.Name = cluster.Name;
                clusterResource.Properties = new Collection<ResourceProperty>();
                ResourceProperty nameProperty = new ResourceProperty()
                {
                    PropertyName = "Name",
                    FriendlyName = "Name",
                    PropertyType = PropertyType.String,
                    PropertyValue = cluster.Name
                };
                clusterResource.Properties.Add(nameProperty);

                ResourceProperty sizeProperty = new ResourceProperty()
                {
                    PropertyName = "ClusterSizeInNodes",
                    PropertyType = PropertyType.Int,
                    FriendlyName = "Size in nodes",
                    PropertyValue = cluster.ClusterSizeInNodes.ToString()
                };
                clusterResource.Properties.Add(sizeProperty);

                ResourceProperty typeProperty = new ResourceProperty()
                {
                    PropertyName = "Type",
                    FriendlyName = "Type",
                    PropertyType = PropertyType.String,
                    PropertyValue = cluster.ClusterType.ToString()
                };
                clusterResource.Properties.Add(typeProperty);

                ResourceProperty connectionUrlProperty = new ResourceProperty()
                {
                    PropertyName = "ConnectionUrl",
                    FriendlyName = "Connection Url",
                    PropertyType = PropertyType.String,
                    PropertyValue = cluster.ConnectionUrl
                };
                clusterResource.Properties.Add(connectionUrlProperty);

                ResourceProperty createdDateProperty = new ResourceProperty()
                {
                    PropertyName = "CreatedDate",
                    FriendlyName = "Created Date",
                    PropertyType = PropertyType.String,
                    PropertyValue = cluster.CreatedDate.ToShortDateString()
                };
                clusterResource.Properties.Add(createdDateProperty);

                ResourceProperty defaultStorageAccountProperty = new ResourceProperty()
                {
                    PropertyName = "DefaultStorageAccount",
                    FriendlyName = "Default Storage Account",
                    PropertyType = PropertyType.String,
                    PropertyValue = cluster.DefaultStorageAccount.Name
                };
                clusterResource.Properties.Add(defaultStorageAccountProperty);

                ResourceProperty locationProperty = new ResourceProperty()
                {
                    PropertyName = "Location",
                    FriendlyName = "Location",
                    PropertyType = PropertyType.String,
                    PropertyValue = cluster.Location
                };
                clusterResource.Properties.Add(locationProperty);

                ResourceProperty stateProperty = new ResourceProperty()
                {
                    PropertyName = "State",
                    FriendlyName = "State",
                    PropertyType = PropertyType.String,
                    PropertyValue = cluster.StateString
                };
                clusterResource.Properties.Add(locationProperty);

                ResourceProperty versionProperty = new ResourceProperty()
                {
                    PropertyName = "Version",
                    FriendlyName = "Version",
                    PropertyType = PropertyType.String,
                    PropertyValue = cluster.Version
                };
                clusterResource.Properties.Add(versionProperty);

                hdInsightClusters.Add(clusterResource);
            }

            return hdInsightClusters;
        }

        private async Task<IList<Resource>> GetDataLakeStoreAccountsAsync()
        {
            List<Resource> dataLakeStoreAccounts = new List<Resource>();
            IEnumerable<DataLakeStoreAccount> dataLakeAccounts = await azureResourcesHelper.GetDataLakeStoreAccountsAsync();
            foreach (var dataLake in dataLakeAccounts)
            {
                Resource dataLakeResource = new Resource();
                dataLakeResource.Name = dataLake.Name;
                dataLakeResource.Properties = new Collection<ResourceProperty>();

                ResourceProperty nameProperty = new ResourceProperty()
                {
                    PropertyName = "Name",
                    FriendlyName = "Name",
                    PropertyType = PropertyType.String,
                    PropertyValue = dataLake.Name
                };
                dataLakeResource.Properties.Add(nameProperty);

                ResourceProperty locationProperty = new ResourceProperty()
                {
                    PropertyName = "Location",
                    FriendlyName = "Location",
                    PropertyType = PropertyType.String,
                    PropertyValue = dataLake.Location
                };
                dataLakeResource.Properties.Add(locationProperty);

                ResourceProperty typeProperty = new ResourceProperty()
                {
                    PropertyName = "Type",
                    FriendlyName = "Type",
                    PropertyType = PropertyType.String,
                    PropertyValue = dataLake.Type
                };
                dataLakeResource.Properties.Add(typeProperty);

                ResourceProperty creationTimeProperty = new ResourceProperty()
                {
                    PropertyName = "CreationTime",
                    FriendlyName = "Creation Time",
                    PropertyType = PropertyType.String,
                    PropertyValue = dataLake.Properties.CreationTime.ToShortDateString()
                };
                dataLakeResource.Properties.Add(creationTimeProperty);

                ResourceProperty endpointProperty = new ResourceProperty()
                {
                    PropertyName = "Endpoint",
                    FriendlyName = "Endpoint",
                    PropertyType = PropertyType.String,
                    PropertyValue = dataLake.Properties.Endpoint
                };
                dataLakeResource.Properties.Add(endpointProperty);

                dataLakeStoreAccounts.Add(dataLakeResource);
            }

            return dataLakeStoreAccounts;
        }

        /// <summary>
        /// Gets a list of Sql Servers and Databases and converts them to list of Resource
        /// </summary>
        /// <returns></returns>
        private async Task<IList<Resource>> GetSqlResourcesAsync()
        {
            List<Resource> azureSqlResources = new List<Resource>();
            Dictionary<Server, IEnumerable<Database>> sqlServers = await azureResourcesHelper.GetSqlServersAsync();
            foreach (KeyValuePair<Server, IEnumerable<Database>> sqlServer in sqlServers)
            {
                Server server = sqlServer.Key;

                Resource azureSqlResource = new Resource();
                azureSqlResource.Name = server.Name;
                azureSqlResource.Properties = new Collection<ResourceProperty>();

                ResourceProperty nameProperty = new ResourceProperty()
                {
                    PropertyName = "Name",
                    FriendlyName = "Name",
                    PropertyType = PropertyType.String,
                    PropertyValue = server.Name
                };
                azureSqlResource.Properties.Add(nameProperty);

                ResourceProperty locationProperty = new ResourceProperty()
                {
                    PropertyName = "Location",
                    FriendlyName = "Location",
                    PropertyType = PropertyType.String,
                    PropertyValue = server.Location
                };
                azureSqlResource.Properties.Add(locationProperty);

                ResourceProperty userNameProperty = new ResourceProperty()
                {
                    PropertyName = "AdministratorUserName",
                    FriendlyName = "Administrator User Name",
                    PropertyType = PropertyType.String,
                    PropertyValue = server.AdministratorUserName
                };
                azureSqlResource.Properties.Add(userNameProperty);

                ResourceProperty domainNameProperty = new ResourceProperty()
                {
                    PropertyName = "FullyQualifiedDomainName",
                    FriendlyName = "Fully Qualified Domain Name",
                    PropertyType = PropertyType.String,
                    PropertyValue = server.FullyQualifiedDomainName
                };
                azureSqlResource.Properties.Add(domainNameProperty);

                ResourceProperty stateProperty = new ResourceProperty()
                {
                    PropertyName = "State",
                    FriendlyName = "State",
                    PropertyType = PropertyType.String,
                    PropertyValue = server.State
                };
                azureSqlResource.Properties.Add(stateProperty);

                ResourceProperty versionProperty = new ResourceProperty()
                {
                    PropertyName = "Version",
                    FriendlyName = "Version",
                    PropertyType = PropertyType.String,
                    PropertyValue = server.Version
                };
                azureSqlResource.Properties.Add(versionProperty);

                azureSqlResource.Items = ConvertToDatabaseResource(sqlServer.Value);

                azureSqlResources.Add(azureSqlResource);
            }

            return azureSqlResources;
        }

        private Collection<Resource> ConvertToDatabaseResource(IEnumerable<Database> databases)
        {
            Collection<Resource> databaseResources = new Collection<Resource>();
            foreach (Database database in databases)
            {
                Resource databaseResource = new Resource();
                databaseResource.Name = database.Name;
                databaseResource.Properties = new Collection<ResourceProperty>();

                ResourceProperty nameProperty = new ResourceProperty()
                {
                    PropertyName = "Name",
                    FriendlyName = "Name",
                    PropertyType = PropertyType.String,
                    PropertyValue = database.Name
                };
                databaseResource.Properties.Add(nameProperty);

                ResourceProperty collationNameProperty = new ResourceProperty()
                {
                    PropertyName = "CollationName",
                    FriendlyName = "Collation Name",
                    PropertyType = PropertyType.String,
                    PropertyValue = database.CollationName
                };
                databaseResource.Properties.Add(collationNameProperty);

                ResourceProperty creationDateProperty = new ResourceProperty()
                {
                    PropertyName = "CreationDate",
                    FriendlyName = "Creation Date",
                    PropertyType = PropertyType.String,
                    PropertyValue = database.CreationDate.ToShortDateString()
                };
                databaseResource.Properties.Add(creationDateProperty);

                ResourceProperty editionProperty = new ResourceProperty()
                {
                    PropertyName = "Edition",
                    FriendlyName = "Edition",
                    PropertyType = PropertyType.String,
                    PropertyValue = database.Edition
                };
                databaseResource.Properties.Add(editionProperty);

                ResourceProperty maxSizeProperty = new ResourceProperty()
                {
                    PropertyName = "MaximumDatabaseSizeInGB",
                    FriendlyName = "Maximum Size",
                    PropertyType = PropertyType.Int,
                    PropertyValue = database.MaximumDatabaseSizeInGB.ToString()
                };
                databaseResource.Properties.Add(maxSizeProperty);

                ResourceProperty sizeProperty = new ResourceProperty()
                {
                    PropertyName = "SizeMB",
                    FriendlyName = "Size",
                    PropertyType = PropertyType.Int,
                    PropertyValue = database.SizeMB
                };
                databaseResource.Properties.Add(sizeProperty);

                ResourceProperty typeProperty = new ResourceProperty()
                {
                    PropertyName = "Type",
                    FriendlyName = "Type",
                    PropertyType = PropertyType.String,
                    PropertyValue = database.Type
                };
                databaseResource.Properties.Add(typeProperty);

                ResourceProperty stateProperty = new ResourceProperty()
                {
                    PropertyName = "State",
                    FriendlyName = "State",
                    PropertyType = PropertyType.String,
                    PropertyValue = database.State
                };
                databaseResource.Properties.Add(stateProperty);

                databaseResources.Add(databaseResource);
            }

            return databaseResources;
        }
    }
}