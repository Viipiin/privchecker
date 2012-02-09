function PermissionsViewModel() {
    // Data
    var self = this;
	self.username = ko.observable("");
	self.displayname = ko.observable("");
	self.site = ko.observable("");
    self.sites = ko.observableArray();
	self.list = ko.observable("");
	self.siteCollection = "http://sxqic3:5050";
	
	self.showList = ko.computed(function(){
		if (self.list() == ""){
			return false;
		}
		else {
			return true;
		}
	});
	
	self.showSite = ko.computed(function(){
		if (self.site() == ""){
			return false;
		}
		else {
			return true;
		}
	});
	
	self.showUser = ko.computed(function(){
		if (self.username() == "" || self.username() == "Site Collection User..."){
			return false;
		}
		else {
			return true;
		}
	});
	//self.chosenSite = ko.observable();
	//self.chosenSiteLists = ko.observable();
	//self.chosenList = ko.oberservable();
	//self.chosenListItems = ko.observable();
	

	//Behaviors
	self.setUser = function() {
		self.username($("#searchBox").val());
		self.displayname($("#hiddenName").val());
	};
	self.getSites = function() {
		self.setUser();
		var allsites = [{"Name":"root","Url":"http://sxqic3:5050","ID":"5ed0226e-92b0-4991-965e-66e315ef5c95","Permissions":["Full Control"],"AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Search","Url":"http://sxqic3:5050/Search","ID":"3264c65d-0c94-408b-88e7-4f3a4f6a8a21","Permissions":["Full Control"],"AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]},{"Name":"Test Site","Url":"http://sxqic3:5050/testsite","ID":"6b0566ba-be7e-4c8c-86a2-e1d50465024d","Permissions":["Full Control"],"AllPermissions":["Limited Access","Full Control","Limited Access","Design","Limited Access","Manage Hierarchy","Approve","Restricted Read"]}];
		//$.get('/_layouts/permissionjson.ashx', { user: self.username }, self.sites);
		self.sites(allsites);
		

		$('#sitesTable').dataTable()

	};
	//self.goToSite = function(site) { 
		//self.chosenSite(site); 
		//self.chosenList(null);
		//$.get('/Lists', { site: site.id }, self.chosenSiteLists);
	//};	
	//self.goToList = function(list) {
		//self.chosenSite(list.Site);
		//self.chosenList(list);
		//self.chosenSiteLists(null);
		//$.get('/ListItems', { listId: list.id }, self.chosenListItems)
	//};
	
	
};

ko.applyBindings(new PermissionsViewModel());