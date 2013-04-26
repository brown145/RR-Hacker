/*!
 * links.js - Adds useful links to other tools
 *
 * Requires
 *	- jQuery
 */
 
var links = {};
(function (exports) {
    function get_catalog_browser_link(apiKey){
        return $('<a href="http://recs.richrelevance.com/rrserver/jsp_myrecsDemo/genres.jsp?a=' + apiKey + '" target="_newcatalog">catalog</a>');
    }

    function get_feed_herder_link(siteId){
        return $('<a href="https://portal.richrelevance.com/rrfeedherder/incomingFeeds.jsp?current_site_id=' + siteId + '" target="_newfeed">feed</a>');
    }

	// main execution logic - builds UI
    exports.init = function () {
    	var el = $('.rr-sites-info'),
            values = el.text().replace(/\s{1,}/g,'').split('|');

        console.log(values, get_catalog_browser_link(values[1]));

        el.append('| ', get_catalog_browser_link(values[1]), ' | ', get_feed_herder_link(values[2]));
    };
})(links);