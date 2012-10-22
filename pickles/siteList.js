/*!
 * siteList.js
 *
 * Requires
 *	- jQuery
 *  - ...
 */
 
var siteList = {};
(function (exports) {
    var sites = [],
    	templates = {};
        
    // mustache templates
    templates.dialog = '<div id="hkr_siteList" title="Layout Difference"><table><tr><th>site id</th><th>api key</th><th>name</th><th>blue steel</th><th>enabled</th><th>created</th></tr>{{#sites}}<tr><td><a href="https://portal.richrelevance.com/rrportal/index.jsp?current_site_id={{id}}">{{id}}</a></td> <td>{{apiKey}}</td><td>{{name}}</td><td>{{isBlueSteelCustomer}}</td><td>{{enabled}}</td><td>{{created}}</td></tr>{{/sites}}</table></div>';

	// main execution logic - builds UI
    exports.init = function () {
    	sites.length = 0;
        
    	// Get all layouts from server
        $.getJSON("https://portal.richrelevance.com/rrportal/api/core/sites", function (data) {
        
        	// Check for differences and build up array of changes
            $.each(data.sites, function (i, site) {
                sites.push({
                	apikey: site.apiKey,
                	id: site.id,
    				name: site.name,
    				express: site.isBlueSteelCustomer,
    				enabled: site.enabled,
    				created: site.created
                });
            });
            
            sites.sort(function (a, b) {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                return 0;
            });
            
            // Render UI
            $(Mustache.render(templates.dialog, {sites:sites})).dialog({
                height: 700,
                width: 670,
                modal: true,
                close: function(event, ui) {
            			$(this).dialog('destroy').remove();
        			}
            });
        });
    };
})(siteList);