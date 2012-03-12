function PermissionsViewModel() {
    var self = this;
    
	//Binded Data
    self.username = ko.observable("");
    self.displayname = ko.observable("");
	
    self.siteCollection = ko.observable("");
    self.webUrl = ko.observable("");
    self.sites = ko.observableArray([]);
	self.site = ko.observable({ ID: -1 });

	self.lists = ko.observableArray([]);
	self.list = ko.observable( { ID: -1 });

	self.listitems = ko.observableArray([]);
	self.listitem = ko.observable( { ID: -1 });

	self.browseFilter = ko.observable("filter...");
	self.tableContext = ko.observable("");
	
	self.hoverRow = ko.observable({ ID: -1});

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
	        return ((iterator.Name.toLowerCase().indexOf(filter) != -1) || (iterator.Url.toLowerCase().indexOf(filter) != -1) || (iterator.Role.toLowerCase().indexOf(filter) != -1))
	    });
	});

	self.listsToShow = ko.computed(function () {
	    var filter = self.browseFilter().toLowerCase();

	    if (filter == "" || filter == "filter...") {
	        return self.lists;
	    }
	    return ko.utils.arrayFilter(self.lists(), function (list) {
	        return ((list.Name.toLowerCase().indexOf(filter) != -1) || (list.Url.toLowerCase().indexOf(filter) != -1) || (list.Role.toLowerCase().indexOf(filter) != -1))
	    });
	});

	self.itemsToShow = ko.computed(function () {
	    var filter = self.browseFilter().toLowerCase();

	    if (filter == "" || filter == "filter...") {
	        return self.listitems;
	    }
	    return ko.utils.arrayFilter(self.listitems(), function (item) {
	        return ((item.Name.toLowerCase().indexOf(filter) != -1) || (item.Url.toLowerCase().indexOf(filter) != -1) || (item.Role.toLowerCase().indexOf(filter) != -1))
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
			return "SHOWING " + self.itemsToShow().length + " OF " + self.listitems().length + " LISTS";		
		}
	});

	self.roleImage = function(arg) {
		return "/css/" + arg.Role + ".jpg";
	}
	//Setters
	self.setBrowseFilter = function(data, event) {
		self.browseFilter($("#browseFilter").val());
		return true;
	}
	
	self.setHover = function(arg) {
		self.hoverRow(arg);
	}
	
	self.removeHover = function() {
		self.hoverRow({ID: -1});
	}

    self.setSite = function (arg) {
		//set values
        self.site(arg);

        //clear values
		self.list({ ID: -1 });
		self.listitem({ ID: -1 });

    }
	
    self.setList = function (arg) {
        //set values
		self.list(arg);
		
		//clear values
		self.listitem({ ID: -1 });
    }

    self.setListItem = function (arg) {
        self.listitem(arg);
    }

    self.manageSitePermissions = function (arg) {
        self.site(arg);
        window.open(arg.PrivUrl);
    }
    self.manageListPermissions = function (arg) {
        self.list(arg);
        window.open(arg.PrivUrl);
    }
    self.manageItemPermissions = function (arg) {
        self.listitem(arg);
        window.open(arg.PrivUrl);
    }

    self.goThere = function (arg) {
        window.open(arg.Url);
    }

    self.goToListItem = function (arg) {
        window.open(self.site().Url + "/" + arg.Url);
    }

	
	//DATA ACCESS
    self.getSites = function () {
        $('#searchBox').blur(); //necessary for IE

        //Hardcoded Array
        //$( "#dialog-message" ).dialog("open");
        //$("#tabs").tabs('select', 1);	
        //self.tableContext("sites");	
        //self.site({ ID: -1 });
        //self.sites(sitesarray);

        self.tableContext("sites");
        self.site({ ID: -1 });
        self.list({ ID: -1 });
        self.listitem({ ID: -1 });
        self.sites([]);
        self.showSites();
        $("#tabs").tabs('select', 1);
        $("#dialog-message").dialog("open");
        $.get('permissionjson.ashx', { user: self.username, type: "sitecoll", url: self.webUrl }, function (data) {
            self.siteCollection(data.siteCollection);
            //var array = eval(data);
            self.sites(data.allWebs);
            $("#dialog-message").dialog("close");
        });
    }

    self.getLists = function (site) {

        //Hardcoded array
        //self.lists(listsarray);
        //self.showLists();

        self.lists([]);
        self.showLists();

        $("#dialog-message").dialog("open");
        $.get('permissionjson.ashx', { user: self.username, webid: site.ID, type: "web", url:self.webUrl }, function (data) {
            var array = eval(data);
            self.lists(array);
            $("#dialog-message").dialog("close");
        });
    }

    self.getListItems = function (list) {

        //Hardcoded array
        //self.listitems(listitemsarray);
        //self.showListItems();

        self.listitems([]);
        self.showListItems();

        $("#dialog-message").dialog("open");
        $.get('permissionjson.ashx', { user: self.username, type: "list", webid: self.site().ID, listid: list.ID, url: self.webUrl }, function (data) {
            var array = eval(data);
            self.listitems(array);
            $("#dialog-message").dialog("close");
        });
    }

	
	//UI Updates
    self.showSites = function () {
		self.browseFilter("filter...");
        self.tableContext("sites");
    }

    self.showLists = function () {
        self.browseFilter("filter...");
        self.tableContext("lists");
    }

    self.showListItems = function () {
        self.browseFilter("filter...");
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
			return a.Role.toLowerCase() < b.Role.toLowerCase() ? -1 : 1;
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


ko.bindingHandlers.stripe = {
    update: function(element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()); //creates the dependency
        var allBindings = allBindingsAccessor();
        var even = allBindings.evenClass;
        var odd = allBindings.oddClass;

        //update odd rows
        $(element).children(":nth-child(odd)").addClass(odd).removeClass(even);
        //update even rows
        $(element).children(":nth-child(even)").addClass(even).removeClass(odd);;
    }
}

mymodel = new PermissionsViewModel();
ko.applyBindings(mymodel);