function test (){
	chrome.storage.local.set({'use_layoutDiff': true}, function() {
    	alert('Settings saved');
	});
}

$().ready(function(){
	var chk_bigGraph = $('#rr_hrk_enbiggen');
	var chk_RevNotes = $('#rr_hrk_revnotes');
	var chk_RecAssist = $('#rr_hrk_recassist');
	var chk_NoLogout = $('#rr_hrk_nologout');
	
	// Set initial state
	chrome.storage.local.get('default_graphBig', function( result ) {
   		chk_bigGraph.prop('checked', result.default_graphBig);
	});
	chrome.storage.local.get('disable_revNotes', function( result ) {
   		chk_RevNotes.prop('checked', result.default_graphBig);
	});
	chrome.storage.local.get('disable_recAssist', function( result ) {
   		chk_RecAssist.prop('checked', result.default_graphBig);
	});
	chrome.storage.local.get('disable_NoLogout', function( result ) {
   		chk_NoLogout.prop('checked', result.disable_NoLogout);
	});

	
	chk_bigGraph.bind('change', function(e) {
		chrome.storage.local.set( { default_graphBig: this.checked } );
	});
	chk_RevNotes.bind('change', function(e) {
		chrome.storage.local.set( { disable_revNotes: this.checked } );
	});
	chk_RecAssist.bind('change', function(e) {
		chrome.storage.local.set( { disable_recAssist: this.checked } );
	});
	chk_NoLogout.bind('change', function(e) {
		chrome.storage.local.set( { disable_NoLogout: e.currentTarget.checked } );
	});
});
