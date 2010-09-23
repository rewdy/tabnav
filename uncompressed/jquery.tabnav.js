/*
 * TabNav - plug in to notify users of leaving your site
 * Version: 1.0 (09/21/2010)
 * Copyright (c) 2010 Andrew Meyer
 * Licensed under the MIT License: http://en.wikipedia.org/wiki/MIT_License
 * Requires: jQuery v1.2+
*/

(function(jQuery) {
		  
	var methods= {
		init : function(opt) {
			// init = primary method
			// =====================
			
			// define default parameters
			var defaults = {
				handle: "h3", // jQuery selector
				tn_class: "tabnav_list", // string
				tn_id: "tabnav_list", // string. cannot be empty or null. used for other things in plug in.
				tn_position: "before", // can be "before", "after", or a jQuery selector for an element.
				active_class: "current",
				start_open_index: 0, // integer. index of element to start open when no hash exists.
				tabarea_class: 'tabnav_tab_area'
			};
			
			// *options variable set globally. maybe this should be named to avoid potential conflict with other vars?
			options = jQuery.extend(defaults, opt);
			
			var loc=window.location.href;
			
			// build the tabnav html
			var tabnavHtml='<ul id="'+options.tn_id+'" class="'+options.tn_class+'"></ul>';
			
			// append the nav list to either the specified element, or before the tab area
			if (options.tn_position=="before") {
				jQuery(this).first().before(tabnavHtml);
			} else if (options.tn_position=="after") {
				jQuery(this).last().after(tabnavHtml);
			} else {
				jQuery(options.tn_position).append(tabnavHtml);
			}
			
			// shortcut variable
			var tabnav = jQuery("#"+options.tn_id);
						
			// event handler to allow the back button to function. REQUIRES inclusion of
			// Ben Almans's HashChange plugin. http://benalman.com/code/projects/jquery-hashchange
			if (jQuery().hashchange) {
				jQuery(window).hashchange(function(){
					var hash_process = window.location.hash.replace('/',"");
					showtab(jQuery(hash_process));
				});
			}
			
			// iterate through returned items and RAWK them hard.
			return this.each(function(index){
				// shortcut variables
				var el = jQuery(this);
				var handle=el.find(options.handle);
				var handleText=handle.text()!="" ? handle.text() : "Tab "+index;
				
				// give tab area a standard class
				el.addClass(options.tabarea_class);
				
				// add an id
				if (el.attr('id')=="") {
					// build the new id removing spaces and messed up chars.
					var this_id = handleText.replace(/ /g,"_").replace(/(\&|\$|\%|\?)/g,"");
					
					// sets id of element to created id
					el.attr('id',this_id);
				} else {
					// sets this_id var to id of element
					this_id=el.attr('id');	
				}
				
				// build html to add to nav
				element_listitem_id_prefix="tn_link_item_";
				var element_link_html='<li id="'+element_listitem_id_prefix+this_id+'"><a href="#/'+this_id+'">'+handleText+'</a></li>';
				
				// add item to nav
				tabnav.append(element_link_html);
				
				// give new link some action
				jQuery("#tn_link_item_"+this_id).click(function(){
					var target_obj=jQuery('#'+this_id);
					showtab(target_obj);
				});
				
				// if no hash is set, then rely on the start_open_index to determine what shows
				if (!window.location.hash) {
					// hide if not active area
					if (index!=options.start_open_index) {
						el.hide();	
					}
					
					// give proper tab active state
					tabnav.find('li').eq(options.start_open_index).addClass(options.active_class);
				} else if (window.location.hash) {
					// if THERE IS a hash:	
					var hash_process = window.location.hash.replace('/',"");
					if (this_id==hash_process.replace("#","")) {
						showtab(jQuery(hash_process));	
					}
				}
				
				// finished cylcing through the returned elements!
			});
			
			// end of init function
		},
		show : function(){
			// show functionality -- programmatically change the visible tab
			alert('show!');
		}
	}
	
	jQuery.fn.tabnav = function(method){
		// Method calling logic
		if (methods[method] ) {
			return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tabnav' );
		}    
		
	};
	
	function showtab(which) {
		// "which" MUST be jquery object!
		which.show().siblings('div').hide();
		var link_selector="#"+element_listitem_id_prefix+which.attr('id');
		jQuery(link_selector).addClass(options.active_class).siblings('li').removeClass(options.active_class);
	}
	
	// end and return jQuery object
})(jQuery);