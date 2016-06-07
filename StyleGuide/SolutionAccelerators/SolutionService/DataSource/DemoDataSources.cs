using System.Collections.Generic;
using Microsoft.CortanaAnalytics.Models;

// TODO: This class needs deleted once the resources are updated and talking to real data tomorrow.
namespace Demo.DataSource
{
    public class DemoDataSources
    {
        private static DemoDataSources instance = null;
        public static DemoDataSources Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new DemoDataSources();
                }
                return instance;
            }
        }
        public List<Resource> Resources { get; set; }
        public List<Solution> Solutions { get; set; }
        private DemoDataSources()
        {
            this.Reset();
            this.Initialize();
        }
        public void Reset()
        {
            this.Resources = new List<Resource>();
            this.Solutions = new List<Solution>();
        }
        public void Initialize()
        {
            //this.Solutions.AddRange(new List<Solution>()
            //{
            //    new Solution()
            //    {
            //        Name = "Angel"
            //    },
            //    new Solution()
            //    {
            //        Name = "Clyde"
            //    },
            //    new Solution()
            //    {
            //        Name = "Elaine"
            //    }
            //});
        }
    }
}