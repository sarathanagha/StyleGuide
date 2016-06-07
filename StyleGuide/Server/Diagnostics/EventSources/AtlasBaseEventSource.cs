using System;
using System.Diagnostics;
using System.Diagnostics.Eventing;
using System.Diagnostics.Tracing;
using System.Runtime.InteropServices;

namespace Microsoft.DataStudio.Diagnostics
{
    public class AtlasBaseEventSource : EventSource
    {
        protected void MyWriteEvent(int eventId, params object[] args)
        {
            // The value set by EventProvider.SetActivityId method is used by ETW's WriteEvent method to fill in ActivityId (this later shows up in the MDS table as ActivityId)
            // The above GUID set within EventProvider doesn't seem to be preserved across threads, so it doesn't seem to work well with await/async code
            // Hence we use 'Trace.CorrelationManager.ActivityId' to track the current activity id since that value is preserved across threads. We want this value to go into the corresponding ETW field.
            // So, we do the below to make sure the ETW ActivityId is in sync with 'Trace.CorrelationManager.ActivityId' just before making the ETW WriteEvent call
            // There's another interesting fact that calling EventProvider.SetActivityId() changes the value of 'Trace.CorrelationManager.ActivityId', but the vice versa doesn't happen
            // As to why there are two GUIDs, I don't know, my understanding is the ETW one is used on the native side while the Trace one is on the managed side
            Guid currentActivityId = Trace.CorrelationManager.ActivityId;
            EventProvider.SetActivityId(ref currentActivityId);

            base.WriteEvent(eventId, args);

            // I didn't want to restore the old value of ETW ActivityId here because we actually want both the values to be in sync
            // Though that doesn't happen because the native ETW ActivityId doesn't propagate across threads (which is why the above code block exists as a workaround)
        }
    }
}
