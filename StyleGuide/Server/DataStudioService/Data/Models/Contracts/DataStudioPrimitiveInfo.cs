namespace Microsoft.DataStudio.Services.Data.Models.Contracts
{
    public class DataStudioPrimitiveInfo
    {
        public DataStudioPrimitiveInfo(string id, string name, string categoryName)
        {
            PrimitiveId = id;
            PrimitiveName = name;
            CategoryName = categoryName;
        }

        public string PrimitiveId { get; set; }

        public string PrimitiveName { get; set; }

        public string CategoryName { get; set; }
    }
}