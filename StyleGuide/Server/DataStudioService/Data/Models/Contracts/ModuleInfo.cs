namespace Microsoft.DataStudio.Services.Data.Models.Contracts
{
    public class ModuleInfo
    {
        public ModuleInfo(string id, string name)
        {
            ModuleId = id;
            ModuleName = name;
        }

        public string ModuleId { get; set; }

        public string ModuleName { get; set; }
    }
}