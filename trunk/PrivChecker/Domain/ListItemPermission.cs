using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PrivChecker
{
    public class ListItemPermission : SecurableObject
    {
        public ListItemPermission() : base()
        {
        }

        public ListItemPermission(int itemIndex, string name, string webUrl, string url, string id): base(name, url, itemIndex.ToString() )
        {
            PrivUrl = String.Format("{0}/_layouts/user.aspx?obj={1},{2},LISTITEM", webUrl, id, itemIndex);
        }
    }
}
