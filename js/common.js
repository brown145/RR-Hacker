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

function goHack ( event ) {

	$(this).unbind(event);
    setTimeout(function(){
    	
    	chrome.storage.local.get('disable_recAssist', function( result ) {
   			if ( !result.disable_recAssist ) {
    			recAssistAssist.init();
   			}
		});
    	
    	chrome.storage.local.get('disable_revNotes', function( result ) {
   			if ( !result.disable_revNotes ) {
    			revisionNotes.init();
   			}
		});
    
    	
    }, 100);
}

// Wait until late loading table is built before trying to modify
var jTable = $('.jsonTable');
if(jTable.find('tr').length > 2) {
    goHack(jTable) 
} else {
	jTable.bind('DOMSubtreeModified.rr_hkr', goHack);
}

// fire old charing modifications
if ( document.location.pathname === '/rrportal/sliceDiceReporting.jsp' || document.location.pathname === '/rrportal/detailPage.jsp' ) {

    setTimeout(function(){
        graphZoom.init();
    }, 100);
} else if ( document.location.pathname === '/rrportal/multivariateTests.jsp' ) {

    setTimeout(function(){
        MVTHistoryLinks.init();
    }, 100);
}

//for all pages
setTimeout(function(){
    links.init();

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


        }

        if(pageId){
            publishStamp.init(pageId, pageName);
        }



        chrome.storage.local.get('disable_NoLogout', function( result ) {
            if ( result.disable_NoLogout ) {
                setInterval(function() {
                    $.getJSON("https://portal.richrelevance.com/rrportal/api/urls", function (data) {});
                }, 15 * 60 * 1000);
            }
        });
    }, 100);
