using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint;

namespace PrivChecker
{
    public class PermissionChecker : IDisposable
    {
        private SPSite _site;
        private SPWeb _rootWeb;
        private SPUser _user;
        private SPWeb _web;

        public string SiteCollection
        {
            get
            {
                string url = _site.ServerRelativeUrl;
                if (url == "/")
                    url = _site.Url;

                return url;
            }
        }

        public PermissionChecker(string user, string url)
        {
            _site = new SPSite(url);
            _rootWeb = _site.RootWeb;
            string webUrl = url.Replace(_site.Url, "").Replace("/", "");
            _web = _site.OpenWeb(webUrl);
            _user = _rootWeb.EnsureUser(user);
        }

        public void Dispose()
        {
            _site.Dispose();
            _rootWeb.Dispose();
            _web.Dispose();
        }

        #region Public Methods

        public List<SecurableObject> GetListItems(string webID, string listID)
        {
            List<SecurableObject> listItems = new List<SecurableObject>();

            if (_web.UserIsSiteAdmin)
            {
                using (SPWeb web = _site.AllWebs[new Guid(webID)])
                {
                    IterateListItems(listID, listItems, web);
                }
            }
            else
            {
                IterateListItems(listID, listItems, _web);
            }       

            return listItems;
        }

        public List<SecurableObject> GetLists(string webID)
        {
            List<SecurableObject> lists = new List<SecurableObject>();

            if (_web.UserIsSiteAdmin)
            {
                using (SPWeb web = _site.AllWebs[new Guid(webID)])
                {
                    IterateLists(lists, web);
                }
            }
            //If your not a site collection admin you use current web
            else
            {
                IterateLists(lists, _web);
            }
             
            return lists;
        }

        public List<SecurableObject> GetSiteCollectionWebs()
        {
            List<SecurableObject> allWebs = new List<SecurableObject>();

            if (_web.UserIsSiteAdmin)
            {
                IterateWebs(_site.AllWebs, allWebs);
            }
            else
            {
                IterateWebs(_web.Webs, allWebs);                   
            }

            return allWebs;
        }

        #endregion

        #region Private Methods

        private bool GetPermissions(SPSecurableObject spSecObject, SecurableObject securityObject)
        {
            if (spSecObject.DoesUserHavePermissions(SPBasePermissions.EnumeratePermissions))
            {
                List<string> roles = new List<string>();

                SPPermissionInfo permissionInfo = spSecObject.GetUserEffectivePermissionInfo(_user.LoginName);

                foreach (var roleAssignment in permissionInfo.RoleAssignments)
                {
                    Permission permission = new Permission() { Member = roleAssignment.Member.Name };

                    foreach (SPRoleDefinition rdb in roleAssignment.RoleDefinitionBindings)
                    {
                        permission.Levels.Add(rdb.Name);
                        roles.Add(rdb.Type.ToString());
                    }
                    securityObject.Permissions.Add(permission);
                }

                securityObject.UniquePrivs = spSecObject.HasUniqueRoleAssignments;
                securityObject.BasePermissions = (permissionInfo.Permissions).ToString().Split(',');

                if (securityObject.BasePermissions.Count() > 0 && securityObject.BasePermissions[0] == "FullMask")
                {
                    securityObject.Role = "Administrator";
                }
                else
                {
                    securityObject.Role = PermissionHelper.GetTopRole(roles);
                }


                return true;
            }

            return false;
        }    

        private void IterateListItems(string listID, List<SecurableObject> listItems, SPWeb web)
        {
            SPList list = web.Lists[new Guid(listID)];
            bool customListFlag = (list.BaseType == SPBaseType.GenericList);

            foreach (SPListItem item in list.Items)
            {
                try
                {
                    string url = item.Url;
                    if (customListFlag)
                    {
                        url = list.DefaultDisplayFormUrl + "?ID=" + item.ID;
                    }
                    SecurableObject itemPrivs = new ListItemPermission(item.ID, item.Title, web.Url, url, list.ID.ToString());
                    if (GetPermissions(item, itemPrivs))
                    {
                        listItems.Add(itemPrivs);
                    }
                }
                catch
                {

                }
            }
        }

        private void IterateLists(List<SecurableObject> lists, SPWeb web)
        {
            foreach (SPList list in web.Lists)
            {
                if (list.BaseTemplate != SPListTemplateType.ExternalList)
                {
                    SecurableObject listPrivs = new ListPermission(list.BaseType.Equals(SPBaseType.DocumentLibrary), list.Title, web.Url, list.DefaultViewUrl, list.ID.ToString());
                    //You only see things that you can Enumerate Permissions on
                    if (GetPermissions(list, listPrivs))
                    {
                        lists.Add(listPrivs);
                    }
                }
            }
        }

        private void IterateWebs(SPWebCollection webs, List<SecurableObject> allWebs)
        {
            foreach (SPWeb web in webs)
            {
                SecurableObject webPrivs = new WebPermission(web.Title, web.Url, web.ID.ToString());

                if (GetPermissions(web, webPrivs))
                {
                    allWebs.Add(webPrivs);
                }   

                if (web != SPContext.Current.Web)
                {
                    web.Dispose();
                }
            }
        }

        #endregion

        #region unused Recursive Functions

        public WebPermission GetAllSiteCollectionPemissions()
        {
            return ProcessAllWebPermissions(_rootWeb);
        }

        private WebPermission ProcessAllWebPermissions(SPWeb web)
        {
            WebPermission webPrivs = new WebPermission(web.Title, web.Url, web.ID.ToString());
            GetPermissions(web, webPrivs);

            foreach (SPList list in web.Lists)
            {
                if (list.BaseTemplate != SPListTemplateType.ExternalList)
                {
                    ListPermission listPrivs = new ListPermission(list.BaseType.Equals(SPBaseType.DocumentLibrary), list.Title, web.Url, list.DefaultViewUrl, list.ID.ToString());
                    GetPermissions(list, listPrivs);
                    bool customListFlag = (list.BaseType == SPBaseType.GenericList);

                    foreach (SPListItem item in list.Items)
                    {
                        try
                        {
                            string url = item.Url;
                            if (customListFlag)
                            {
                                url = list.DefaultDisplayFormUrl + "?ID=" + item.ID;
                            }
                            SecurableObject itemPrivs = new ListItemPermission(item.ID, item.Title, web.Url, url, list.ID.ToString());
                            GetPermissions(item, itemPrivs);

                            listPrivs.Items.Add(itemPrivs);
                        }
                        catch
                        {

                        }
                    }
                    webPrivs.Lists.Add(listPrivs);
                }
            }

            //TODO:ADD LOOP THROUGH EACH SUB WEB

            return webPrivs;
        }
        #endregion

    }
}
