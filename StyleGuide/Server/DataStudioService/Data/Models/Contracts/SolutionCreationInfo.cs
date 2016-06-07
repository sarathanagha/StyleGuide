using System.Collections.Generic;
namespace Microsoft.DataStudio.Services.Data.Models.Contracts
{
    /// <summary>
    /// This class is the contract used in the Solution Creation Service when a module is selected
    /// </summary>
    public class SolutionCreationInfo
    {
        public SolutionCreationInfo(string id, string title, IEnumerable<SolutionCreationField> fields)
        {
            Id = id;
            Title = title;
            Fields = fields;
        }

        /// <summary>
        /// Gets or sets the identifier of the solution creation
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the title that will be displayed in the modal
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Lists all the fields required in the solution creation modal
        /// This will display all the fields and its input form to the user and will validate it
        /// </summary>
        public IEnumerable<SolutionCreationField> Fields { get; set; }
    }
}