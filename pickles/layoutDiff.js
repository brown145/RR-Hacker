/*!
 * layoutDiff.js - Runs a text diff algorithm against layouts with multiple revisions and
 * 				   displays the results
 *
 * Requires
 *	- jQuery
 *  - mustache.js
 *  - John Resig's diffString
 */
 
var layoutDiff = {};
(function (exports) {
    var options = [], 
    	templates = {};
        
    // mustache templates
    templates.message = '&nbsp;&nbsp;<em class="hkr_instructions">select a layout from the dropdown to view layout differences</em>';
    templates.select = '<select id="hkr_diffSelect"><option value="-1">select</option>{{#options}}<option value={{value}}>{{name}}</option>{{/options}}</select>';
    templates.dialog = '<div id="hkr_layoutDiff" title="Layout Difference">  <div id="hkr_settings" style="display:none;">    <span class="name"><strong>Name: </strong><em></em></span>   </div>    <div id="hkr_layoutDiffTargetWrapper" style="display:none;">        <h3>Wrapper</h3><code></code>    </div>    <div id="hkr_layoutDiffTargetItem" style="display:none;">        <h3>Item</h3><code></code>    </div><div id="hkr_layoutDiffTargetDiv" style="display:none;">        <h3>Divider</h3><code></code>    </div></div>';
    
    // event handler for layout selection
    function event_Selection(e) {
        var x = $(this).find(':selected').val();
        if (x >= 0) {
            $('#hkr_layoutDiffTargetWrapper').show().find('code').html(options[x].diffs.wrapper);
            $('#hkr_layoutDiffTargetItem').show().find('code').html(options[x].diffs.item);
            $('#hkr_layoutDiffTargetDiv').show().find('code').html(options[x].diffs.divider);
            $('#hkr_settings').show().find('.name em').html(options[x].diffs.name);
        }
    };

	// main execution logic - builds UI
    exports.init = function () {
    	options.length = 0;
        
    	// Get all layouts from server
        $.getJSON("https://portal.richrelevance.com/rrportal/api/layout", function (data) {
        
        	// Check for differences and build up array of changes
            $.each(data.records, function (x, record) {
                if (record.hasDelta) {
                    options.push({
                    	"value":   options.length, 
                    	"name":    record.name,
                    	diffs:{
                    		"name":    diffString(escape(record.name), escape(record.delta.name)),
                    		"grid":    Boolean(record.isGrid === record.delta.isGrid),
                    		"productHint":    Boolean(record.usesProductHint === record.delta.usesProductHint),
	                        "wrapper": diffString(escape(record.wrapper), escape(record.delta.wrapper)),
    	                    "item":    diffString(escape(record.item), escape(record.delta.item)),
    	                    "divider":    diffString(escape(record.separator), escape(record.delta.separator))
        				}
                    });
                }
            });
            
            // Render UI
            $(Mustache.render(templates.dialog, {})).dialog({
                height: 500,
                width: 900,
                modal: true,
                close: function(event, ui) {
            			$(this).dialog('destroy').remove();
        			}
            }).prepend(Mustache.render(templates.message, {})).prepend($(Mustache.render(templates.select, {options:options})).change(event_Selection));
        });
    };
})(layoutDiff);