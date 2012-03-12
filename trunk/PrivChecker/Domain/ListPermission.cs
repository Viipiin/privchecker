using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PrivChecker
{
    public class ListPermission : SecurableObject
    {
        public List<SecurableObject> Items;

        public ListPermission()
        {
            Items = new List<SecurableObject>();
        }

        public ListPermission(bool isDocLib, string name, string webUrl, string url, string id): base(name, url, id )
        {
            Items = new List<SecurableObject>();

            PrivUrl = webUrl + "/_layouts/user.aspx?obj=" + id + ",";
            if (isDocLib)
            {
                PrivUrl += "doclib";
            }
            else
            {
                PrivUrl += "list";
            }
        }
    }
}
