using System;
using System.Globalization;

namespace Microsoft.DataStudio.Services.Data.Models.Solutions
{
    public class SolutionDetailsHistory
    {
        private string changeDateString;

        public string ChangedByUser { get; set; }
        public SolutionDetailsChangeType Note { get; set; }

        public DateTime ChangedDateTime
        {
            get
            {
                return DateTime.Parse(changeDateString);
            }
            set
            {
                changeDateString = value.ToString("yyyy-MM-dd HH:mm:ss.ffffff", CultureInfo.InvariantCulture);
            }
        }
    }
}