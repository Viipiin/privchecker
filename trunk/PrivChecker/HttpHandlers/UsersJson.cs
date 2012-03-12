using System;
using System.Web;
using Microsoft.SharePoint;
using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace PrivChecker
{
    public class UsersJson : IHttpHandler
    {
        public bool IsReusable
        {
            // Return false in case your Managed Handler cannot be reused for another request.
            // Usually this would be false in case you have some state information preserved per request.
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            string searchString = context.Request.QueryString["term"].ToLower();
            string url = context.Request.QueryString["url"].ToLower();

            List<AutoCompleteItem> users = new List<AutoCompleteItem>();
            using (SPSite site = new SPSite(url))
            using (SPWeb web = site.RootWeb)
            {
                int numUsers = web.SiteUsers.Count;
                for(int i = 0; i < numUsers && users.Count < 25; i++)
                {
                    SPUser user = web.SiteUsers[i];
                    if (user.Name.ToLower().Contains(searchString) || user.LoginName.ToLower().Contains(searchString))
                    {
                        users.Add(new AutoCompleteItem() { id = user.LoginName.ToString(), value = user.Name });
                    }
                }
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            string jsonArray = serializer.Serialize(users);

            context.Response.ContentType = "text/plain";
            context.Response.Write(jsonArray);
        }

    }
}
