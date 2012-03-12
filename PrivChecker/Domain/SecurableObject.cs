using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PrivChecker
{
    public class SecurableObject
    {
        public SecurableObject()
        {
            Permissions = new List<Permission>();
        }

        public SecurableObject(string name, string url, string id)
        {
            Permissions = new List<Permission>();
            Name = name;
            Url = url;
            ID = id;
        }

        public string Name { get; set; }
        public string Url { get; set; }
        public string PrivUrl { get; set; }
        public string ID { get; set; }
        public string Role { get; set; }
        public List<Permission> Permissions { get; set; }
        public string[] BasePermissions { get; set; }
        public bool UniquePrivs { get; set; }

    }
}
