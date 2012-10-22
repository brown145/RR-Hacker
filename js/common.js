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
}
