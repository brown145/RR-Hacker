/*!
 * recAssistAssist.js - Description
 *
 * Requires
 *	- jQuery
 *  - 
 */
var recAssistAssist = {};
(function (exports) {
	var apikey,
		templates = {};
		
	apikey = $(".rr-sites-info").text();
	apikey = apikey.substring(apikey.indexOf("|")+2, apikey.lastIndexOf("|")-1);
    templates.href = 'http://clients.richrelevance.com/tools/recassist/index.php?r3_placeholder=&r3_target=&r3_target_place=&ApiKey={{apiKey}}&BaseUrl={{env}}&UserId=0&SessionId=0&PlacementType={{pageType}}&PlacementName={{pageArea}}&SearchTerm=&categoryId=0&itemId=0&brand=&forceTreatment=0&forcedStrategies=';
    templates.link = '<a href="{{href}}" class="hrk_recAssistLink reportMe" data-category="recAssistAssist" target="_new">[?]</a>';
    
    RecAssistObject = (function () {
        "use strict"

        // private static
        var nextIndex = 0,
            objects = [];

        // constructor
        var recAssistObject = function (api, type, area, e) {
            // private
            var self = this,
            	apiKey = api,
            	pageType = type,
            	pageArea = area,
            	env = e;
            	
            this.get_link = function(){
            	return Mustache.render(templates.href, {
            		apiKey: apiKey,
            		env: env,
            		pageType: pageType,
            		pageArea: pageArea
            	});
            }

            objects[nextIndex++] = this;
        };


        return recAssistObject;
    })();
    
    function addRecAssistLink(target, element) {
    	$(target).append(Mustache.render(templates.link, {
    		href: element.get_link()
    	}));
    }
    
    exports.init = function () {
    
        $('tr.EDITING, tr.APPROVED, tr.IN_PRODUCTION').each(function (index, row) {
            var $parentRow = $(row),
                elementObj = {},
                offsetRows = 3,
                pageArea, pageType, 
                env = 'integration',
                target, tmp;

            if ($parentRow.hasClass('versionGroup')) {
                offsetRows = 2;
            } else if ( $parentRow.hasClass('IN_PRODUCTION')) {
            	env = 'recs';
            }
            
            if(window.location.pathname.indexOf('/rrportal/placements') >= 0) {
            	pageArea = $parentRow.find('td:nth-child(' + (offsetRows + 4) + ')').text();
            	pageType = $parentRow.find('td:nth-child(' + (offsetRows + 3) + ')').text().toLowerCase().replace(/ /g, '_');
            	target = $parentRow.find('td:nth-child(' + (offsetRows + 1) + ')');
			} else if (window.location.pathname.indexOf('/rrportal/layouts') >= 0) {
				tmp = $parentRow.find('td:nth-child(' + (offsetRows + 4) + ')').html().split('<br>')[0].split('.');
				pageArea = tmp[1];
				pageType = tmp[0];
				target = $parentRow.find('td:nth-child(' + (offsetRows + 1) + ')');
			}
			
			elementObj = new RecAssistObject(apikey, pageType, pageArea, env);
			addRecAssistLink(target, elementObj);
        });
    };
})(recAssistAssist);