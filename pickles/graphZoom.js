/*!
 * graphZoom.js - Description
 *
 * Requires
 *	- jQuery
 *  - debounce jquery extension
 */
var graphZoom = {};
(function (exports) {

	var chart_select = document.getElementById("selectChart"),
      	chart_div = document.getElementById("chartSlot"),
		org_height = 270, 
		org_width = 700, 
		bigged = false;

	function chartResize ( ) {
      var new_width,
      	  new_height,
      	  old_chart = document.getElementById("cha"),
      	  setting_txt = old_chart.attributes["flashvars"].textContent;
      
      if ( bigged ) {
      		new_width = document.getElementById("content").offsetWidth;
      		new_height = (new_width/2.5);
      } else {
      		new_width = org_width;
      		new_height = org_height;
      }
      	  
      setting_txt.replace("chartWidth=700", "chartWidth=" + new_width);
      setting_txt.replace("chartHeight=270", "chartHeight=" + new_height);
      old_chart.attributes["flashvars"].textContent = setting_txt;
      old_chart.width = new_width;
      old_chart.height = new_height;
      chart_div.removeChild(old_chart);
      chart_div.innerHTML = old_chart.outerHTML;
    };
    
    function resizer ( e ){
    	bigged = !bigged;
    		
		if ( bigged ) {
    		$(window).bind('resize.rr_hkr', $.debounce(200, function() {
    	    	chartResize();
    		})); 
    		$(chart_select).bind('change.rr_hkr', function () {
    			chartResize();
    		});
    	} else {
    		$(chart_select).unbind('change.rr_hkr');
    		$(window).unbind('resize.rr_hkr');
    	}
      	$('#rrhkr_enbiggen').text( bigged ? 'unenbiggen' : 'enbiggen');
		chartResize();
    }
   
	
	exports.init = function () {
		$(chart_select).after($('<span id="rrhkr_enbiggen">enbiggen</span>').css({
			'padding': '0 5px',
			'cursor': 'pointer',
			'color': '#990101'
		}).bind('click', resizer));
		
		setTimeout(function(){
			chrome.storage.local.get('default_graphBig', function( result ) {
   				if ( result.default_graphBig ) {
   					resizer();
   				}
			});
		}, 3000);
	}
})(graphZoom);