/*!
 * common.js - defines common functions for extension and controls setup of all features (pickles)
 *
 */


// -----------------------------------------------------------
// Event Listeners
// ---

// Listen for messages from the "page action" that appears in the browser url bar
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.event === "layoutDiff") {
    	layoutDiff.init();
    } else if (request.event === "placementDiff") {
    	placementDiff.init();
    } else if (request.event === "placementStubber") {
    	// TODO add logic to pass init setings
    	rr_labs.placementStubber.init(false, true);
    } else if (request.event === "placementStubberPlus") {
    	// TODO add logic to pass init setings
    	rr_labs.placementStubber.init(true, true);
    } else if (request.event === "siteList") {
        siteList.init();
    }
    
	sendResponse({success: true});
});


$(document.body).bind('click', function(e){

    // ---
    // Bind reporting event watching
    var $e = $(e.target);
    if( $e.hasClass('reportMe') ){
        reportThis($e.data('category'), $e.data('action'));
    }

});


// -----------------------------------------------------------
// Utility functions
// ---


function delayed_action ( event ) {
	$(this).unbind(event);
    setTimeout(function(){
        recAssistAssist.init();
        revisionNotes.init();
    }, 100);
};


function reportThis( category, action ){
    //console.log('logging', category, action);
    chrome.extension.sendRequest({message: "report", reportType:category, reportAction:action}, function(response) {});

};

function getPageInfo(){
    var pageId, pageName ='error';

    switch(document.location.pathname){
        case '/rrportal/placements.jsp':
            pageId = 28;
            pageName = 'placements';
            break;
        case '/rrportal/urlPatterns.jsp':
            pageId = 35;
            pageName = 'Site Config Settings';
            break;
        case '/rrportal/pageAreas.jsp':
            pageId = 29;
            pageName = 'page areas';
            break;
        case '/rrportal/layouts.jsp':
            pageId = 27;
            pageName = 'layouts';
            break;
        case '/rrportal/attributePlaceholders.jsp':
            pageId = 30;
            pageName = 'attribute placeholders';
            break;
        case '/rrportal/strategyPage.jsp':
            pageId = 32;
            pageName = 'strategy messages';
            break;
    };

    return {id:pageId, name: pageName};
};


// -----------------------------------------------------------
// Pickle setup
// ---


// ---
// Delay 100
setTimeout(function(){
    var page = getPageInfo();

    // ---
    // Resize Graph
    if ( document.location.pathname === '/rrportal/sliceDiceReporting.jsp' || document.location.pathname === '/rrportal/detailPage.jsp' ) {
        graphZoom.init();
    }


    // ---
    // Add Links to header
    links.init();


    // ---
    // Add stamp to publish comment
    if(page.id){
        publishStamp.init(page.id, page.name);
    }


    // ---
    // check for settings
    // ---
    chrome.storage.local.get('disable_NoLogout', function( result ) {
        if ( result.disable_NoLogout ) {
            // TODO move to pickle
            setInterval(function() {
                $.getJSON("https://portal.richrelevance.com/rrportal/api/urls", function (data) {});
            }, 15 * 60 * 1000);
        }
    });

    chrome.storage.local.get('enable_reLinkSites', function( result ) {
        if ( result.enable_reLinkSites ) {
            reLinkSites.init();
        }
    });

}, 100);


// ---
// Delayed for AJAX-y table
var jTable = $('.jsonTable');
if(jTable.find('tr').length > 2) {
    delayed_action(jTable) 
} else {
    jTable.bind('DOMSubtreeModified.rr_hkr', delayed_action);
}

