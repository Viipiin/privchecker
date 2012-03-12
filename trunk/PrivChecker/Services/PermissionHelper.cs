using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint;

namespace PrivChecker
{
    public static class PermissionHelper
    {
        private static Dictionary<string, int> PermissionValues = new Dictionary<string, int>() {
            { "Full Control" , 10 },
            {"Design", 8},
            { "Contribute" , 6 },
            { "Read" , 5 },
            { "Approve" , 7 },
            { "Manage Hierarchy" , 9 },
            { "Restricted Read" , 4 },
            { "Limited Access" , 1 },
        };

        private static Dictionary<string, int> RoleTypes = new Dictionary<string, int>() {
            {"None", 0},
            {"Guest", 1},
            {"Reader", 2},
            {"Contributor", 3},
            {"WebDesigner", 4},
            {"Administrator", 5}
        };

        public static List<string> ProcessPermissions(List<string> permissions)
        {
            string topPermission = permissions.OrderByDescending(p => GetPermissionValue(p)).First();
            List<string> customPermissionLevels = (from p in permissions
                                                  where GetPermissionValue(p) < 0
                                                  select p).ToList();

            customPermissionLevels.Insert(0, topPermission);
            return customPermissionLevels;                                               
        }

        public static string GetTopRole(List<string>roles)
        {
            if (roles.Count() == 0)
            {
                return "None";
            }
            string role = roles.OrderByDescending(r => GetRoleValue(r)).First();

            if (role == "None")
            {
                role = "Custom";
            }
            return role;
        }

        private static int GetRoleValue(string roleType)
        {
            if (RoleTypes.ContainsKey(roleType))
            {
                return RoleTypes[roleType];
            }
            return -1;
        }

        private static int GetPermissionValue(string permission)
        {
            if (PermissionValues.ContainsKey(permission))
            {
                return PermissionValues[permission];
            }
            return -1;
        }
    }
}
