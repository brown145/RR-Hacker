/*!
 * reLinkSites.js - updates the site selection dropdow so that the site Id is updated in url. This means that if you are logged out when you change sites
 *                  you will be redirected to teh correct site on login.
 *
 */
 
var reLinkSites = {};
(function (exports) {
    function go_and_do_stuff(){
        document.getElementById("current_site_id").onchange = function(e) { 
            document.location = document.location.origin + document.location.pathname + '?current_site_id=' +e.target.value 
        };
    };

	// main execution logic - updates UI
    exports.init = function () {
        go_and_do_stuff();
    };
})(reLinkSites);