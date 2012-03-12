using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Administration;

namespace PrivChecker
{
    public class UlsLogger : ILogger
    {
        public void Log(string message, Exception ex)
        {
            Log(string.Format("{0}: {1} - {2}", message, ex.Message, ex.StackTrace));
        }
        public void Log(string message)
        {
            SPDiagnosticsCategory category = new SPDiagnosticsCategory("PrivChecker Error: ", TraceSeverity.Unexpected, EventSeverity.Error);
            SPDiagnosticsService.Local.WriteTrace(0, category, TraceSeverity.Unexpected, message);
        }

    }

}
