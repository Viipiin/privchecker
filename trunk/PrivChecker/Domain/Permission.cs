using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PrivChecker
{
    public class Permission
    {
        public string Member { get; set; }
        public List<string> Levels { get; set; }

        public Permission() 
        {
            Levels = new List<string>();
        }
    }
}
