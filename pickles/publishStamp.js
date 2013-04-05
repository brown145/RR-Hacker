/*!
 * publishStamp.js - Description
 *
 * Requires
 *	- jQuery
 */
var publishStamp = {};
(function (exports) {
	function publishStamp (id, page, callback){
    var stamp = '', d = new Date(), name;
    name = $('.rr-login div').first().text();
    name = name.slice(name.indexOf('Welcome ')+8);
    name = name.slice(0, name.indexOf('\n'));
    $.getJSON('https://portal.richrelevance.com/rrportal/api/publish?objectTypeId=' + id, function(data){
      stamp = d.getMonth() + 1 + '/' + d.getDate() + ' ' +  name + ' - ' + page + ' ' + data.approvedChanges + ' approved changes.\nRoll-back version: ' + data.versions[1].id + ' \nImpact: ';
      callback(stamp);
    });
  };

  exports.init = function (pageId, pageName) {
  	var pubButton = $('#prodPublish button');

  	pubButton.bind('click', function(){
  		var area, updateFunc;

  		area = $('#legenddescription').first();

  		updateFunc = function(string){
  			area.val(string);
  		};

  		publishStamp(pageId, pageName, updateFunc);
  	});
  }
})(publishStamp);