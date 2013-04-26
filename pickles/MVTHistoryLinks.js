/*!
 * MVTHistoryLinks.js - Description
 *
 * Requires
 *	- jQuery
 */
var MVTHistoryLinks = {};
(function (exports) {
  exports.getURLs = function(){
    $.get('https://portal.richrelevance.com/rrportal/api/mvt', function(data) {
      $.each(data, function(index, test){
        console.log('https://portal.richrelevance.com/rrportal/addMultivariateTest.jsp?id=' + test.id + '&type=' + test.type);
      });
    });
  };

  exports.init = function(){
  	console.log('incomplete');
  };
})(MVTHistoryLinks);