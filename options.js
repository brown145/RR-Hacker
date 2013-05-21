function reportThis(category, action){
	action = action ? 'enabled' : 'disabled';
    chrome.extension.sendRequest({message: "report", reportType:category, reportAction:action}, function(response) {});
};

$().ready(function(){
	var chk_NoLogout = $('#rr_hrk_nologout');
	var chk_reLinkSites = $('#rr_hrk_reLinkSites');
	
	// Set initial state
	chrome.storage.local.get('disable_NoLogout', function( result ) {
   		chk_NoLogout.prop('checked', result.disable_NoLogout);
	});
	chrome.storage.local.get('enable_reLinkSites', function( result ) {
   		chk_reLinkSites.prop('checked', result.enable_reLinkSites);
	});

	
	//update when checked
	chk_NoLogout.bind('change', function(e) {
		chrome.storage.local.set( { disable_NoLogout: e.currentTarget.checked } );
		reportThis('disable_NoLogout', e.currentTarget.checked);
	});
	chk_reLinkSites.bind('change', function(e) {
		chrome.storage.local.set( { enable_reLinkSites: e.currentTarget.checked } );
		reportThis('enable_reLinkSites', e.currentTarget.checked);
	});
});
