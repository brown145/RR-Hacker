//TODO - add some damn comments!

/*!
 * revisionNotes.js - TODO
 *
 * Requires - TODO
 *	- http://craigsworks.com/projects/qtip/demos/content/basic
 *  - 
 */
var revisionNotes = {};
(function (exports) {
    var siteInfo, siteId, templates = {};

    siteInfo = $('.rr-sites-info').text();
    siteId = siteInfo.substr(siteInfo.lastIndexOf('|') + 2);

    templates.addNewButton = '<span class="addNote"> [+]</span>';
    templates.noteFormat = '<strong>{{date}}</strong>: {{text}}';

    VersionObject = (function () {
        "use strict"

        // private static
        var nextIndex = 0,
            objects = [];

        // constructor
        var versionObject = function (ui_element, site_id, conical_id) {
            // private
            var self = this,
                site_id = site_id,
                conical_id = conical_id,
                $ui_element = $(ui_element),
                version_id = $ui_element.text(),
                id = site_id + '_' + conical_id + '_' + version_id,
                note = '';
                
            function getLocalNote (text) {
            	return JSON.parse(localStorage.getItem('revNote_' + id));
            };

            // public (this instance only)
            this.get_id = function () {
                return id;
            };
            this.get_element = function () {
                return $ui_element;
            };
            this.has_note = function () {
                return Boolean(self.get_note().length);
            };
            this.get_note = function () {
            	var d, noteObj; 
                if (note.length) {
                    return note;
                } else {
                    noteObj = getLocalNote();
                	if (noteObj) {
            			d = new Date(noteObj.date);
                		note =  Mustache.render(templates.noteFormat, {
                			text: noteObj.text,
                			date: (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes()
                		});
                	}
                }

                return note;
            };
            this.save_note = function (text) {
            	var d = new Date();
            	
            	if(!text)
            		return false;
            	
            	note = '';
            	return localStorage.setItem('revNote_' + id, JSON.stringify({ date: d, text:text }));
            };
            this.buildAddEditButton = function () {
                $ui_element.append(
                $(Mustache.render(templates.addNewButton, {})).bind('click', function () {
                    self.save_note(prompt('Revision Notes for ' + id, note.substring(note.indexOf('>:')+3)));
                }));
                return false;
            };

            objects[nextIndex++] = this;
        };

        // public static
        versionObject.get_byId = function (id) {
            return false;
        };
        versionObject.buildAddEditButtons = function (id) {
            $(objects).each(function (index, obj) {
                obj.buildAddEditButton();
            });
        };

        // public (shared across instances)
        versionObject.prototype = {
            burp: function () {
                return false;
            }
        };

        return versionObject;
    })();

    function addTooltip(element, obj) {
    
        $(element).qtip({
            content: {text: obj.get_note()},
            position: {
                target: obj.get_element(),
                corner: {
                    target: 'center',
                    tooltip: 'bottomLeft'
                },
                adjust: {
                    x: 15,
                    y: -5
                }
            },
            hide: {
                delay: 200
            },
            show: {
                delay: 650,
                solo: true
            },
            style: {
                border: {
                    width: 2,
                    radius: 4
                },
                padding: 5,
                textAlign: 'center',
                tip: true, // Give it a speech bubble tip with automatic corner detection
                name: 'cream' // Style it according to the preset 'cream' style
            }
        })
        
        $(obj.get_element()).css({
        	'font-weight': 'bold'
        });
    }

    exports.init = function () {
        $('tr.EDITING, tr.APPROVED, tr.IN_PRODUCTION').each(function (index, row) {
            var $parentRow = $(row),
                elementObj = {},
                offsetRows = 3;

            if ($parentRow.hasClass('versionGroup')) {
                offsetRows = 2;
            }

            elementObj = new VersionObject($parentRow.find('td:nth-child(' + (offsetRows + 1) + ')'), siteId, $parentRow.find('td:nth-child(' + offsetRows + ')').text());

            if (elementObj.has_note()) {
                addTooltip(row, elementObj);
            }
        });
        VersionObject.buildAddEditButtons();
    };
})(revisionNotes);