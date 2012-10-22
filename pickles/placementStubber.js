var rr_hkr = {};
var rr_labs = rr_labs || {};
rr_labs.placementStubber = {};

(function (exports) {
    "use strict";
    
    var caches = {};
    var placementQueue = [];
    
    caches.pageAreas = [];
    caches.layouts = [];
    caches.placements = [];

    function frontSideDataParser(response, callback, params, store) {
        var i, current = {}, built = {};
        
        store = store || [];
        store.length = 0;

        for (i = 0; i < response.records.length; i++) {
        	 built = {}
            current = response.records[i];
            
            for(var j=0; j<params.length; j++){
            	built[params[j].value] = current[params[j].key];
            }            
            store.push(built);
        }

        callback(store);
    }

    function dataFetcher(url, callback, params, store) {
        //TODO: error case

        $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            success: function (response) {
                frontSideDataParser(response, callback, params, store)
            }
        });
    }

    function pushPageAreas(pageArea, callback) {
    	$.ajax({type: "PUT", 
    			url: "api/pagearea", 
    			data: {name:pageArea.name}, 
    			dataType: 'json', 
    			success:callback
    	});
    }

    function pushLayouts(layout, callback) {
    	$.ajax({type: "PUT", 
    			url: "api/layout", 
    			data: {name:layout.name}, 
    			dataType: 'json', 
    			success:callback
    	});
    }

    function pushPlacements(placement, callback) {
    	$.ajax({type: "PUT", 
    			url: "api/placement", 
    			data: { pageAreaId: placement.pageArea.id,
						pageTypeId: placement.pageType.id}, 
    			dataType: 'json', 
    			success:function (data) { callback(data, placement) }
    	});
    }

    function pushLayoutsOnPlacements(placement, callback) {
    	$.ajax({type: "PUT", 
    			url: 'api/placement/' + placement.id + '/placementLayout', 
    			data: { itemCount: placement.count, 
    					layoutId: placement.layout.id, 
    					useAltMessage: false}, 
    			dataType: 'json', 
    			success:callback
    	});
    }

	exports.fetchPageAreas = function (callback, forceFetch) {
		if(forceFetch !== true && caches.pageAreas.length > 0) {
			callback(caches.pageAreas);
		} else {	
       		dataFetcher("/rrportal/api/pagearea", callback, [{key:'canonicalId', value:'id'}, {key:'name', value:"name"}], caches.pageAreas);
       	}
    }

	exports.getPageAreaByName = function (name) {
		for (var i = 0; i < caches.pageAreas.length; i++) {
			if (caches.pageAreas[i].name === name) {
				return caches.pageAreas[i];
			}
		}
		
		return false;
	}

	exports.fetchLayouts = function (callback, forceFetch) {
		if(forceFetch !== true && caches.layouts.length > 0) {
			callback(caches.layouts);
		} else {
	        dataFetcher("/rrportal/api/layout", callback, [{key:'canonicalId', value:'id'}, {key:'name', value:"name"}], caches.layouts);
    	}
    }
	
	exports.getLayoutName = function (name) {
		for (var i = 0; i < caches.layouts.length; i++) {
			if (caches.layouts[i].name === name) {
				return caches.layouts[i];
			}
		}
		
		return false;
	}
    
	exports.fetchPlacements = function (callback, forceFetch) {
		if(forceFetch !== true && caches.placements.length > 0) {
			callback(caches.placements);
		} else {		
        	dataFetcher("/rrportal/api/placement", callback, [{key:'canonicalId', value:'id'}, {key:'pageArea', value:'pageArea'}, {key:'pageType', value:'pageType'}, {key:'placementLayouts', value:'layouts'}], caches.placements);
    	}
    }

    exports.fetchPageTypes = function (callback) {
        var data = [];
    	
    	data.push({id:13, name:"add to cart"});
    	data.push({id:3, name:"cart"});
    	data.push({id:4, name:"category"});
    	data.push({id:30, name:"email page"});
    	data.push({id:14, name:"error"});
    	data.push({id:9, name:"home"});
    	data.push({id:1, name:"item"});
    	data.push({id:5, name:"purchase"});
    	data.push({id:2, name:"search"});

        callback(data);
    }
    
    exports.queuePlacementLayoutCount = function (layout, count, pageArea, pageType, placement) {
    	
    	placementQueue.push(
    		{layout: layout, count: count, pageArea: pageArea, pageType: pageType, placement: placement}
    	);
    	
    	return placementQueue.length;
    }

    //TODO - LOADS OF CLEANUP NEEDED IN THE FUNCTION; IT IS FUCKING UGLY
    exports.pushAll = function () {
    	var placement,
    		addedPageArea = [],
    		addedLayout = [],
    		layoutsPending = 0,
    		pageAreasPending = 0,
    		placementLoopComplete = false;
    		
    	var placementLayoutUpdated = function(placements){
    		var pageAreasFetched = false,
    			layoutsFetched = false,
    			tmp;
    		
    		// Need to get updated ids for any placements or layouts that have been aded
    		if (placementLoopComplete && layoutsPending <= 0 && pageAreasPending <= 0) {
    			// Refetch pageAreas
    			rr_hkr.fetchPageAreas(function(pageAreas){
    				pageAreasFetched = true;
    				
    				for (var i =0; i<placements.length; i++) {
    					if (placements[i].pageArea.id <= 0) {
    						placements[i].pageArea = rr_hkr.getPageAreaByName(placements[i].pageArea.name);
    					}
    				}
    				
    				if(layoutsFetched){
    					buildPlacement(placements);
    				}
    			}, true);
    			
    			// Refetch layouts
    			rr_hkr.fetchLayouts(function(layouts){
    				layoutsFetched = true;
    				
    				for (var i =0; i<placements.length; i++) {
    					if (placements[i].layout.id <= 0) {
    						placements[i].layout = rr_hkr.getLayoutName(placements[i].layout.name);
    					}
    				}
    				
    				if(pageAreasFetched){
    					buildPlacement(placements);
    				}
    			}, true);
    		}
    	}
    		
    	var buildPlacement = function(placements){
    		var placement;
    			
    		while(placement = placementQueue.pop()){
    			pushPlacements(placement, function (data, pmt) {
    				pmt.id = data.id;
    				pushLayoutsOnPlacements(pmt, function(d){console.log(d)});
    			});
    		}
    	}
    	
    	// TODO: check for existing versions of placement
    	
    	// Create stubs for pageAreas and layouts
    	for ( var i = 0; i < placementQueue.length; i++ ) {
    		placement = placementQueue[i];
    		
    		if(placement.layout.id < 0 && addedLayout[placement.layout.name] != true){
    			layoutsPending++;
    			addedLayout[placement.layout.name] = true;
    			pushLayouts(placement.layout, function(data){ 
    				layoutsPending--;
    				placementLayoutUpdated(placementQueue); 
    			});
    		}
    		
    		if(placement.pageArea.id < 0 && addedPageArea[placement.pageArea.name] != true){
    			pageAreasPending++;
    			addedPageArea[placement.pageArea.name] = true;
    			pushPageAreas(placement.pageArea, function(data){
    				pageAreasPending--;
    				placementLayoutUpdated(placementQueue); 
    			});
    		}
    		
    		// TODO - each add of a layout or page area will need to check on success or 
    		//		  error if all others have been added. If so, then call the add
    		//		  placement function.
    	}
    	placementLoopComplete = true;
    	
    	// TODO: call callback function for case when no layouts or pageAreas were added
    }

})(rr_hkr);


(function (exports) {
    "use strict";
    
    function buildList(title, id, fetchFunction){
    	var $list = $('<ul>').attr('id', id);
    
    	fetchFunction(function(items){
    		$.each(items, function(i, item){
    			$list.append('<li>' + item.name + '</li>');
    		});
    	
    		$list.append('<li><strong class="addbutton" style="cursor:pointer;">+ add</strong></li>');
    	});
    	
    	return $('<div class="listDiv">').append('<h2>' + title).append($list);
    }
    
    function buildSelectList(id, fetchFunction, forceFetch){    
    	var $list = $('<select>').attr('id', id);
    
    	fetchFunction(function(items){
    		$.each(items, function(i, item){
    			$list.append('<option value="'+item.id+'">' + item.name + '</option>');
    		});
    	}, forceFetch);
    	
    	return $list;
    }
    
    function buildPlacementTable(showCurrent, forceFetch){
    	var $table = $('<table><tr><th>Page Area <button id="btn_addPageArea">+</button></th><th>Page Type</th><th>Layout <button id="btn_addLayout">+</button></th><th>Count</th></tr></table>'),
    		layoutVal = '',
    		itemCount = '';
    	
    	function addAddRow(){
    		$table.append(
    			$('<tr id="row_add">')
    				.append($('<td>').append(buildSelectList('add_pageArea', rr_hkr.fetchPageAreas, forceFetch)))
    				.append($('<td>').append(buildSelectList('add_pageType', rr_hkr.fetchPageTypes, forceFetch)))
    				.append($('<td>').append(buildSelectList('add_layout', rr_hkr.fetchLayouts, forceFetch)))
    				.append($('<td>').append($('<input id="add_count" type="text"></input>')).append($('<button id="btn_add">add</button>').bind('click', event_NewPlacement)))
    		);
    	}
    	
    	if (showCurrent) {
    		rr_hkr.fetchPlacements(function(placements){
    			$.each(placements, function(i, placement){
    				if (placement.layouts.length === 0) {
    					layoutVal = '[none]';
    					itemCount = '[n/a]';
    				} else if (placement.layouts.length === 1) {
    					layoutVal = placement.layouts[0].layoutName;
    					itemCount = placement.layouts[0].itemCount;
    				} else {
    					layoutVal = '[multiple]';
    					itemCount = '[n/a]';
    				}
    				$table.append('<tr><td>'+placement.pageArea+'</td><td>'+placement.pageType+'</td><td>'+layoutVal+'</td><td>'+itemCount+'</td></tr>');
    			});
    			addAddRow();
    		}, forceFetch);
    	} else {
    		addAddRow();
    	}
    	
    	return $table;
    }
    
    function pageHTML(showCurrent, forceFetch){
    	var $container = $('<div id="container">');
    	
    	$container.append(buildPlacementTable(showCurrent, forceFetch))
    			  .append('<button id="btn_masterAdd">DO NOT PRESS ME</button>');
    	
    	return $container;
    }
    
    function event_NewPageArea(){
    	var name = '';
    	name = prompt('Name of new page area', 'rr1');
    	if(name === '' || name === null) return;
    	
    	$('#add_pageArea').prepend('<option value="-1" selected="selected">' + name + ' (new)</option>');
    }
    
    function event_NewLayout(){
    	var name = '';
    	name = prompt('Name of new layout', 'horizontal-standard');
    	if(name === '' || name === null) return;
    	
    	$('#add_layout').prepend('<option value="-1" selected="selected">' + name + ' (new)</option>');
    }
    
    function event_NewPlacement(){
    	var layout, count, pageArea, pageType;
    	
    	layout = {
    		id: $("#add_layout option:selected").val(),
    		name: $("#add_layout option:selected").text().replace(' (new)', '')
    	};    	
    	pageArea = {
    		id: $("#add_pageArea option:selected").val(),
    		name: $("#add_pageArea option:selected").text().replace(' (new)', '')
    	};    	
    	pageType = {
    		id: $("#add_pageType option:selected").val(),
    		name: $("#add_pageType option:selected").text()
    	};
    	count = $("#add_count").val();
    	
    	// sanity check
    	if (count === '' || isNaN(count)) {
    		count = 4;
    	}
    	
    	// add to pending list
    	rr_hkr.queuePlacementLayoutCount(layout, count, pageArea, pageType);
    
    	// Update UI
    	$('#row_add').before('<tr style="font-style: italic;"><td>'+pageArea.name+'</td><td>'+pageType.name+'</td><td>'+layout.name+'</td><td>'+count+'</td></tr>');
    	$("#add_count").val("");
    }
    
    function event_PushChanges(){
    	rr_hkr.pushAll();
    }
    
    exports.init = function(showCurrent, forceFetch){
    	showCurrent = Boolean(showCurrent === true);
    	forceFetch = Boolean(forceFetch === true);
    
    	$("body").fadeOut("slow", function(){
    		$(this).html(pageHTML(showCurrent, forceFetch)).fadeIn();
    		
    		$('#btn_addPageArea').bind('click', event_NewPageArea);
    		$('#btn_addLayout').bind('click', event_NewLayout);
    		$('#btn_masterAdd').bind('click', event_PushChanges);	
    	})
    }
})(rr_labs.placementStubber);