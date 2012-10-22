var button_layoutdiff = document.getElementById('layoutDiff');
var button_placementdiff = document.getElementById('placementDiff');
var button_placementStubber = document.getElementById('placementStubber');
var button_placementStubberPlus = document.getElementById('placementStubberPlus');
var button_siteList = document.getElementById('siteList');

//Figure out what shows
chrome.storage.local.get(null, function (options) {
	if(options['use_layoutDiff'] !== false){
		button_layoutdiff.style.display = 'block';
		button_layoutdiff.addEventListener('click', function () {
    		sendMessage({event:'layoutDiff'});
    		window.close();
		});
	}
	if(options['use_placementDiff'] !== false){
		button_placementdiff.style.display = 'block';
		button_placementdiff.addEventListener('click', function () {
    		sendMessage({event:'placementDiff'});
    		window.close();
		});
	}
	if(options['use_placementStubber'] !== false){
		button_placementStubber.style.display = 'block';
		button_placementStubber.addEventListener('click', function () {
    		sendMessage({event:'placementStubber'});
    		window.close();
		});
		button_placementStubberPlus.style.display = 'block';
		button_placementStubberPlus.addEventListener('click', function () {
    		sendMessage({event:'placementStubberPlus'});
    		window.close();
		});
	}
	if(options['use_siteList'] !== false){
		button_siteList.style.display = 'block';
		button_siteList.addEventListener('click', function () {
    		sendMessage({event:'siteList'});
    		window.close();
		});
	} 
});

function sendMessage (message) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendMessage(tab.id, message, function (response) { });
    });
}