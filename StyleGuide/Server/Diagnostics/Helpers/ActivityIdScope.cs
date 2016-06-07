using System;
using System.Diagnostics;

namespace Microsoft.DataStudio.Diagnostics
{
    public class ActivityIdScope : IDisposable
    {
        private readonly Guid mOldActivityId;

        public ActivityIdScope(Guid newActivityId)
        {
            this.mOldActivityId = LogHelpers.GetCurrentActivityId();
            LogHelpers.SetCurrentActivityId(newActivityId);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                LogHelpers.SetCurrentActivityId(mOldActivityId);
            }
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
            Dispose(true);
        }

        ~ActivityIdScope()
        {
            Dispose(false);
        }
    }
}
