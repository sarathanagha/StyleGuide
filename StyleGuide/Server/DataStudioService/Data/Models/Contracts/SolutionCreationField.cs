
namespace Microsoft.DataStudio.Services.Data.Models.Contracts
{
    /// <summary>
    /// This class describes each field needed in the Solution Creation Modal once the module is selected
    /// </summary>
    public class SolutionCreationField
    {
        public SolutionCreationField(string id, string name, string type, string regex, bool required)
        {
            this.Id = id;
            this.Name = name;
            this.Type = type;
            this.Regex = regex;
            this.Required = required;
        }

        /// <summary>
        /// Gets or sets the identifier of the field
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the field, this will be shown in the modal
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the type of the field so the client code can use the proper form
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets the regex to validate the input
        /// </summary>
        public string Regex { get; set; }

        /// <summary>
        /// Gets or sets if the field is required or optional
        /// </summary>
        public bool Required { get; set; }

    }
}