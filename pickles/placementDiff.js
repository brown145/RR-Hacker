/*!
 * placementDiff.js - TODO
 *
 * Requires
 *	- 
 */
 
var placementDiff = {};
(function (exports) {
    var options = [], 
    	templates = {};
        
    // mustache templates
    templates.message = '&nbsp;&nbsp;<em class="hkr_instructions">select a layout from the dropdown to view layout differences</em>';
    templates.select = '<select id="hkr_diffSelect"><option value="-1">select</option>{{#options}}<option value={{value}}>{{name}}</option>{{/options}}</select>';
    templates.dialog = '<div id="hkr_placementDiff" title="Placement Difference"></div>';
    
    // event handler for layout selection
    function event_Selection(e) {
        var x = $(this).find(':selected').val();
        if (x >= 0) {
        }
    };

	// main execution logic - builds UI
    exports.init = function () {
    	options.length = 0;
        
    	// Get all layouts from server
        $.getJSON("https://portal.richrelevance.com/rrportal/api/placement", function (data) {
        
        	// Check for differences and build up array of changes
            $.each(data.records, function (x, record) {
                if (record.hasDelta) {
                	options.push({
                    	"value":    options.length, 
                    	"name":     record.placementName,
                    	record: record 
                    });
                }
            });
            
            //console.log(options);
            
            // Render UI
            $(Mustache.render(templates.dialog, {})).dialog({
                height: 500,
                width: 900,
                modal: true,
                close: function(event, ui) {
            			$(this).dialog('destroy').remove();
        			}
            }).prepend($(Mustache.render(templates.select, {options:options})));
        });
    };
})(placementDiff);