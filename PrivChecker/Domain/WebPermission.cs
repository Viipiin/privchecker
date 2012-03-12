using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PrivChecker
{
    public class WebPermission : SecurableObject
    {
        public List<ListPermission> Lists { get; set; }
        public List<WebPermission> SubSites { get; set; }

        public WebPermission()
        {
            Lists = new List<ListPermission>();
            SubSites = new List<WebPermission>();
        }

        public WebPermission(string name, string url, string id): base(name, url, id )
        {
            Lists = new List<ListPermission>();
            SubSites = new List<WebPermission>();
            PrivUrl = url + "/_layouts/user.aspx";
        }
    }
}
