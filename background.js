// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


/*!
 * background.js - controls background processes for RR_Hacker chrome extension.
 *
 */



// -----------------------------------------------------------
// Event Listeners
// ---

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);


// Listen for Requests
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {

    // If this is a "report" Request; prefrom required logging
    if (request.message === "report"){
      trackEvent(request.reportType, request.reportAction);
    }

  });



// -----------------------------------------------------------
// Google Analytics setup
// ---

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


// -----------------------------------------------------------
// Utility functions
// ---


// If url is RR url add the "page action" in the url bar
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf('.richrelevance.com/rrportal/') > -1) {
    chrome.pageAction.show(tabId);
  }
};

// Log an event to google analytics
function trackEvent(element, action){
    if (!element) element = "unknown";
    if (!action) action = "clicked";
    _gaq.push(['_trackEvent', element, action]);
};