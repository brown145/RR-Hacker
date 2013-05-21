// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if (tab.url.indexOf('.richrelevance.com/rrportal/') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

function go(){
chrome.tabs.getSelected(null, function(tab) {
//console.log("going");
  chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response) {
    //console.log(response.farewell);
  });
});
};

// Add tracking request
var _gaq = _gaq || [];
function trackPageview(){
  _gaq.push(['_setAccount', 'UA-40687797-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
};
trackPageview();

function trackEvent(element, action){
    if (!element) element = "unknown";
    if (!action) action = "clicked";
    _gaq.push(['_trackEvent', element, action]);
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "report"){
    	trackEvent(request.reportType, request.reportAction);
    }
  });