using System;
using System.Web;
using System.Linq;
using Microsoft.SharePoint;
using System.Collections.Generic;
using System.Web.Script.Serialization;


namespace PrivChecker
{
    public class PermissionJson : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            string url = context.Request.QueryString["url"];
            string username = context.Request.QueryString["user"];
            string type = context.Request.QueryString["type"];

            using (PermissionChecker permissionChecker = new PermissionChecker(username, url))
            {
                if (type == "sitecoll")
                {
                    List<SecurableObject> allWebs = permissionChecker.GetSiteCollectionWebs();
                    var returnData = new { allWebs = allWebs, siteCollection = permissionChecker.SiteCollection };
                    string jsonAllWebs = new JavaScriptSerializer().Serialize( returnData );
                    context.Response.Write(jsonAllWebs);
                }
                else if (type == "web")
                {
                    string id = context.Request.QueryString["webid"];

                    List<SecurableObject> lists = permissionChecker.GetLists(id);
                    lists = lists.OrderBy(l => l.Name).ToList();

                    string jsonLists = new JavaScriptSerializer().Serialize(lists);
                    context.Response.Write(jsonLists);
                }
                else if (type == "list")
                {
                    string webID = context.Request.QueryString["webid"];
                    string listID = context.Request.QueryString["listid"];

                    List<SecurableObject> listItems = permissionChecker.GetListItems(webID, listID);
                    listItems = listItems.OrderBy(i => i.Name).ToList();

                    string jsonListItems = new JavaScriptSerializer().Serialize(listItems);
                    context.Response.Write(jsonListItems);
                }
                else if (type == "all")
                {

                }

            }
        }

        public bool IsReusable
        {
            get { return true; }
        }
    }
}
