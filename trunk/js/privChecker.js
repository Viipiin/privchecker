function PermissionsViewModel() {
    var self = this;
    
	//Binded Data
    self.username = ko.observable("");
    self.displayname = ko.observable("");
	
    self.siteCollection = ko.observable("http://sxqic3:5050");
	
    self.sites = ko.observableArray(null);
	self.site = ko.observable({ ID: -1 });

	self.lists = ko.observableArray(null);
	self.list = ko.observable( { ID: -1 });

	self.listitems = ko.observableArray(null);
	self.listitem = ko.observable( { ID: -1 });

	self.browseFilter = ko.observable("filter...");
	self.tableContext = ko.observable("");
	

	//Computed	
	self.tableTitle = ko.computed(function () {
		if (self.tableContext() == "sites"){
			return self.siteCollection();
		}
		
		else if (self.tableContext() == "lists"){
			return self.site().Name;
		}
		
		else if (self.tableContext() == "items"){
			return self.list().Name;
		}

	});

	self.sitesToShow = ko.computed(function () {
	    var filter = self.browseFilter().toLowerCase();

	    if (filter == "" || filter == "filter...") {
	        return self.sites;
	    }
	    return ko.utils.arrayFilter(self.sites(), function (iterator) {
	        return ((iterator.Name.toLowerCase().indexOf(filter) != -1) || (iterator.Url.toLowerCase().indexOf(filter) != -1) || (iterator.Permission.toLowerCase().indexOf(filter) != -1))
	    });
	});

	self.listsToShow = ko.computed(function () {
	    var filter = self.browseFilter().toLowerCase();

	    if (filter == "" || filter == "filter...") {
	        return self.lists;
	    }
	    return ko.utils.arrayFilter(self.lists(), function (list) {
	        return ((list.Name.toLowerCase().indexOf(filter) != -1) || (list.Url.toLowerCase().indexOf(filter) != -1) || (list.Permission.toLowerCase().indexOf(filter) != -1))
	    });
	});

	self.itemsToShow = ko.computed(function () {
	    var filter = self.browseFilter().toLowerCase();

	    if (filter == "" || filter == "filter...") {
	        return self.listitems;
	    }
	    return ko.utils.arrayFilter(self.listitems(), function (item) {
	        return ((item.Name.toLowerCase().indexOf(filter) != -1) || (item.Url.toLowerCase().indexOf(filter) != -1) || (item.Permission.toLowerCase().indexOf(filter) != -1))
	    });
	});

	self.showUser = ko.computed(function() {
		if (self.username() == "" || self.username() == "Site Collection User..."){
			return false;
		}
		else {
			return true;
		}
    });
    
	self.countText = ko.computed(function () {
		if (self.tableContext() == "sites") {
			if (self.browseFilter() == "" || self.browseFilter() == "filter..."){
				return self.sites().length + " SITES";
			}
			return "SHOWING " + self.sitesToShow().length + " OF " + self.sites().length + " SITES";		
		}
		else if (self.tableContext() == "lists") {
			if (self.browseFilter() == "" || self.browseFilter() == "filter..."){
				return self.lists().length + " LISTS";
			}
			return "SHOWING " + self.listsToShow().length + " OF " + self.lists().length + " LISTS";		
		}
		else if (self.tableContext() == "items") {
			if (self.browseFilter() == "" || self.browseFilter() == "filter..."){
				return self.listitems().length + " ITEMS";
			}
			return "SHOWING " + self.listItemsToShow().length + " OF " + self.listitems().length + " LISTS";		
		}
	});

	
	//Setters
	self.setBrowseFilter = function(data, event) {
		self.browseFilter($("#browseFilter").val());
		return true;
	}
	
	self.setUser = function () {
		self.username($("#searchBox").val());
		self.displayname($("#hiddenName").val());
    };

    self.setSite = function (arg) {
		//set values
        self.site(arg);
        self.getLists();
		
		//clear values
        self.listitems(null);
		self.list({ ID: -1 });
		self.listitem({ ID: -1 });
		
		//self.showLists();
    }

    self.setList = function (arg) {
        //set values
		self.list(arg);
        self.getListItems();
		
		//clear values
		self.listitem({ ID: -1 });
		
		//self.showListItems();
    }

    self.setListItem = function (arg) {
        self.listitem(arg);
    }

	
	//DATA ACCESS
    self.getSites = function () {
        self.setUser();

        //TODO: Change this to use the ajax call
        var allsites = [{"Name":"root","Url":"http://sxqic3:5050/","ID":"5ed0226e-92b0-4991-965e-66e315ef5c95","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Search","Url":"http://sxqic3:5050/Search","ID":"3264c65d-0c94-408b-88e7-4f3a4f6a8a21","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Test Site","Url":"http://sxqic3:5050/testsite","ID":"6b0566ba-be7e-4c8c-86a2-e1d50465024d","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]}];
	
		self.sites(allsites);
		self.tableContext("sites");
        //$.get('/_layouts/permissionjson.ashx', { user: self.username, type: "sitecoll" }, self.sites);
	
    };

    self.getLists = function () {
        //TODO: Switch source;
        var sitelists = [{"Name":"Cache Profiles","Url":"/Cache Profiles/AllItems.aspx","ID":"f84e8ecd-45cd-4e9e-af5c-628b1ca6579a","Permission":"Full Control","AllPermissions":["Limited Access","Full Control"]},{"Name":"Completed Site Requests","Url":"/Lists/Completed Site Requests/AllItems.aspx","ID":"cf722710-86fe-4e3b-9c99-629fc6385682","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Content and Structure Reports","Url":"/Reports List/AllItems.aspx","ID":"42cb0f76-a417-4f51-ac0e-66572d0ffc45","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Content type publishing error log","Url":"/Lists/ContentTypeSyncLog/AllItems.aspx","ID":"baa25dc4-d010-4ee1-91b0-94035fe73a69","Permission":"Full Control","AllPermissions":["Full Control"]},{"Name":"Content type service application error log","Url":"/Lists/ContentTypeAppLog/AllItems.aspx","ID":"3b8ecd9d-466e-4e9c-ac94-a5da2505c05d","Permission":"Full Control","AllPermissions":["Full Control"]},{"Name":"Documents","Url":"/Documents/Forms/AllItems.aspx","ID":"0ca3deb8-ee3b-419f-85f5-25cef1d47d67","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Images","Url":"/PublishingImages/Forms/Thumbnails.aspx","ID":"a7cc2b4e-b4cd-4276-8e4a-82fcc94c9410","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"List Template Gallery","Url":"/_catalogs/lt/Forms/AllItems.aspx","ID":"801782ec-a611-4ed9-b4f2-4afd219b572d","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Log","Url":"/Lists/Log/AllItems.aspx","ID":"178e9129-d703-4094-809d-1c7e7d830b8e","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Long Running Operation Status","Url":"/Long Running Operation Status/AllItems.aspx","ID":"3e6e15a1-63c6-4309-a4b9-e08f407e70b5","Permission":"Full Control","AllPermissions":["Limited Access","Full Control"]},{"Name":"Master Page Gallery","Url":"/_catalogs/masterpage/Forms/AllItems.aspx","ID":"cf0435c6-1699-4a04-a910-6d4fafdf6caa","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Read","Design","Read","Read","Restricted Read"]},{"Name":"Notification List","Url":"/Notification Pages/AllItems.aspx","ID":"deae1259-2e81-4f7b-8cd3-0620998f15c0","Permission":"Full Control","AllPermissions":["Limited Access","Full Control"]},{"Name":"Pages","Url":"/Pages/Forms/AllItems.aspx","ID":"c1cb56ea-e2ee-4804-8c0e-7258f4469515","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Quick Deploy Items","Url":"/Quick Deploy Items/AllItems.aspx","ID":"0a1cefa9-dea6-4913-97e1-9810a694cbf8","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Restricted Read","Contribute"]},{"Name":"Relationships List","Url":"/Relationships List/AllItems.aspx","ID":"30a3589d-7372-4b0f-9212-98520b8e0db1","Permission":"Full Control","AllPermissions":["Limited Access","Full Control"]},{"Name":"Reusable Content","Url":"/ReusableContent/Content Preview.aspx","ID":"89109201-d026-4099-93c4-8e448b64418c","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Shared Packages","Url":"/Lists/PackageList/AllItems.aspx","ID":"5996d133-ab4f-4ed9-96c2-9cef89aa71a7","Permission":"Full Control","AllPermissions":["Full Control"]},{"Name":"Site Assets","Url":"/SiteAssets/Forms/AllItems.aspx","ID":"300ef762-51f1-4d13-8122-cd87ed236ed9","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Site Collection Documents","Url":"/SiteCollectionDocuments/Forms/AllItems.aspx","ID":"da679963-1ea0-4241-a4bd-b120c6266a72","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Site Collection Images","Url":"/SiteCollectionImages/Forms/Thumbnails.aspx","ID":"b4564699-fa15-44ea-95e2-6f8992c78221","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Read","Design","Read","Read","Restricted Read"]},{"Name":"Site Controllers","Url":"/Lists/Site Controllers/AllItems.aspx","ID":"280d3bf2-60ab-49ae-abb2-b6fb2bcfbbe7","Permission":"Full Control","AllPermissions":["Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Site Index Entries","Url":"/Lists/Site Index Entries/AllItems.aspx","ID":"e6dc9754-52ae-4e6f-b6ad-6a9d0e81aaac","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Site Requests","Url":"/Lists/Site Requests/AllItems.aspx","ID":"607d8b81-7429-41c8-8d3d-8fcb7604d57b","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Site Usage List","Url":"/Lists/SiteUsageList/AllItems.aspx","ID":"35e29ade-3071-4342-a191-1650d4cb4b3e","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Solution Gallery","Url":"/_catalogs/solutions/Forms/AllItems.aspx","ID":"c5e1e0a8-8d99-43b1-a5ea-52197aed1605","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Style Library","Url":"/Style Library/Forms/AllItems.aspx","ID":"f5797743-3dab-4cfd-8bf8-5d3ea7e112b6","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Restricted Read","Design","Restricted Read","Restricted Read","Restricted Read"]},{"Name":"Suggested Content Browser Locations","Url":"/PublishedLinks/AllItems.aspx","ID":"d4e47815-9118-4ee4-8ff3-a937119eba67","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Read","Design","Read","Read","Restricted Read"]},{"Name":"TaxonomyHiddenList","Url":"/Lists/TaxonomyHiddenList/AllItems.aspx","ID":"3572b21e-ccde-4903-822a-e668dd7c0af7","Permission":"Full Control","AllPermissions":["Full Control","Read"]},{"Name":"testdoclib","Url":"/testdoclib/Forms/AllItems.aspx","ID":"b7979929-244c-452f-bbeb-a2a881aa83b5","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Theme Gallery","Url":"/_catalogs/theme/Forms/AllItems.aspx","ID":"6541a921-f204-492b-91ba-40591b4cec08","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"User Information List","Url":"/_catalogs/users/detail.aspx","ID":"9441caaa-7864-49ed-8549-f4d7aab3d081","Permission":"No Access","AllPermissions":["No Access"]},{"Name":"Variation Labels","Url":"/Variation Labels/AllItems.aspx","ID":"827ddfc1-d36f-44ae-a54c-f74e616e86f2","Permission":"Full Control","AllPermissions":["Limited Access","Full Control"]},{"Name":"Web Part Gallery","Url":"/_catalogs/wp/Forms/AllItems.aspx","ID":"2feb80d2-7199-40d8-ad90-4962df21a422","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"wfpub","Url":"/_catalogs/wfpub","ID":"998a444d-c9fa-4132-814f-8bf532df5e1f","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Workflow Tasks","Url":"/WorkflowTasks/AllItems.aspx","ID":"764abfe5-11e0-4ee4-b4db-3610e334dfb5","Permission":"Full Control","AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]}];
        self.lists(sitelists);
        //$.get('/_layouts/permissionjson.ashx', { user: self.username, type: "web", webid: self.site.ID }, self.lists);
    }

    self.getListItems = function () {
            
        //TODO: Switch source
        var items = [{ "Name": "Legit Test", "Url": "/Lists/Completed Site Requests/1_.000", "ID": "1", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Legit Test2", "Url": "/Lists/Completed Site Requests/2_.000", "ID": "2", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Legit Test3", "Url": "/Lists/Completed Site Requests/3_.000", "ID": "3", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Test Title 50", "Url": "/Lists/Completed Site Requests/4_.000", "ID": "4", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Legit Test 4", "Url": "/Lists/Completed Site Requests/5_.000", "ID": "5", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Legit Test 5", "Url": "/Lists/Completed Site Requests/6_.000", "ID": "6", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Legit Test 6", "Url": "/Lists/Completed Site Requests/7_.000", "ID": "7", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Legit %    .1!Test 6", "Url": "/Lists/Completed Site Requests/8_.000", "ID": "8", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Legit    \u00271      (Test 6)", "Url": "/Lists/Completed Site Requests/9_.000", "ID": "9", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Char () Test 0&0 ", "Url": "/Lists/Completed Site Requests/10_.000", "ID": "10", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Char (&&) Tes,t 0&,,0 ", "Url": "/Lists/Completed Site Requests/11_.000", "ID": "11", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Char (&.&) Tes,t 0&,,0 ", "Url": "/Lists/Completed Site Requests/12_.000", "ID": "12", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Char (&.&) Tes,t -- 01", "Url": "/Lists/Completed Site Requests/13_.000", "ID": "13", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "??% Wi**ll This Title $4 W==Ork@@@????00", "Url": "/Lists/Completed Site Requests/14_.000", "ID": "14", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Nichole\u0027s test site", "Url": "/Lists/Completed Site Requests/15_.000", "ID": "15", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Test Title 501", "Url": "/Lists/Completed Site Requests/16_.000", "ID": "16", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "My Test Site", "Url": "/Lists/Completed Site Requests/17_.000", "ID": "17", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Blah blah blah 8", "Url": "/Lists/Completed Site Requests/18_.000", "ID": "18", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Dec 13 1050", "Url": "/Lists/Completed Site Requests/19_.000", "ID": "19", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Dec 13 1136", "Url": "/Lists/Completed Site Requests/20_.000", "ID": "20", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Dec 13 1141", "Url": "/Lists/Completed Site Requests/21_.000", "ID": "21", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "ben\u0027s test site", "Url": "/Lists/Completed Site Requests/22_.000", "ID": "22", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"] }, { "Name": "Test Title", "Url": "/Lists/Completed Site Requests/23_.000", "ID": "23", "Permission": "Full Control", "AllPermissions": ["Limited Access", "Full Control", "Limited Access", "Design", "Limited Access", "Manage Hierarchy", "Approve", "Restricted Read"]}];
        self.listitems(items);
        //$.get('/_layouts/permissionjson.ashx', { user: self.username, type: "web", webid: self.site.ID, listid: self.list.ID }, self.listitems);
    }

	
	//UI Updates
    self.showSites = function () {

        if (self.sites() == null) {
            self.getSites();
        }
		self.browseFilter("");
        self.tableContext("sites");
    }

    self.showLists = function () {
		self.browseFilter("");
        self.tableContext("lists")
    }

    self.showListItems = function () {
		self.browseFilter("");
        self.tableContext("items");
    }

	
	//Sorting
	self.sortTitle = function() {
		
		var mySort = function(a, b) {
			return a.Name.toLowerCase() < b.Name.toLowerCase() ? -1 : 1;
		};
		
		if (self.tableContext() == "sites"){
			self.sites.sort( mySort);
		}		
		else if (self.tableContext() == "lists"){
			self.lists.sort(mySort);
		}		
		else if (self.tableContext() == "items"){
			self.listitems.sort(mySort);
		}
    };
	
	self.sortUrl = function() {		
		var mySort = function(a, b) {
			return a.Url.toLowerCase() < b.Url.toLowerCase() ? -1 : 1;
		};
		
		if (self.tableContext() == "sites"){
			self.sites.sort( mySort);
		}		
		else if (self.tableContext() == "lists"){
			self.lists.sort(mySort);
		}		
		else if (self.tableContext() == "items"){
			self.listitems.sort(mySort);
		}
    };
	
	self.sortRole = function() {		
		var mySort = function(a, b) {
			return a.Permission.toLowerCase() < b.Permission.toLowerCase() ? -1 : 1;
		};
		
		if (self.tableContext() == "sites"){
			self.sites.sort( mySort);
		}		
		else if (self.tableContext() == "lists"){
			self.lists.sort(mySort);
		}		
		else if (self.tableContext() == "items"){
			self.listitems.sort(mySort);
		}
    };

};

ko.applyBindings(new PermissionsViewModel());