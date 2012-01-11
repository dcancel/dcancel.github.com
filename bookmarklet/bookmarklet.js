/*
 * jQuery Bookmarklet - version 1.0
 * Originally written by: Brett Barros
 * Heavily modified by: Paul Irish
 *
 * If you use this script, please link back to the source
 *
 * Copyright (c) 2010 Latent Motion (http://latentmotion.com/how-to-create-a-jquery-bookmarklet/)
 * Released under the Creative Commons Attribution 3.0 Unported License,
 * as defined here: http://creativecommons.org/licenses/by/3.0/
 *
 */

// Use this to switch between local and live for testing
// TODO - automate this
// var buffer_env = '';
//var buffer_env = 'local.';

function prepare_tweet(text, url) {
	text = text.toString();
	var space_for_url = url.length+1;
	if(text.length > (140-space_for_url)) {
		
		text = text.substring(0, (140-(space_for_url+3)));
		text += "...";
	}
	text += " "+url;
	return text;
}

function getSelText()
{
	var txt = '';
	if (window.getSelection) {
		txt = window.getSelection();
	} else if (document.getSelection) {
		txt = document.getSelection();
	} else if (document.selection) {
		txt = document.selection.createRange().text;
	} else return;
	return txt;
}

window.bookmarklet = function(opts){fullFunc(opts)};
 
// These are the styles, scripts and callbacks we include in our bookmarklet:
window.bookmarklet({
 
    css : 	["http://dcancel.github.com/bookmarklet/bookmarklet.css?6"],
    js  : 	["http://dcancel.github.com/bookmarklet/postmessage.js"],
    
//	jqpath : 'myCustomjQueryPath.js', <-- option to include your own jquery
    ready : function(){
 		
		var jqbuf = $.noConflict(true);

		var buffer_url = "";
		
		var google_reader_title_element = jqbuf('#current-entry div.entry-container h2.entry-title a');
		if(google_reader_title_element.length > 0) buffer_url = google_reader_title_element.attr('href');
		var prefill = getSelText();
		if(prefill.toString().length == 0 && google_reader_title_element.length > 0) prefill = google_reader_title_element.text();
		else if(prefill.toString().length == 0) prefill = jqbuf("html head title").text();
		prefill.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		
		if(buffer_url == "") buffer_url = encodeURIComponent(window.location);
		var buffer_text = encodeURIComponent(prefill);
		var buffer_source = jqbuf('input[name=bufferapp_source]').val();
		if(google_reader_title_element.length > 0) buffer_source = "google_reader";
		var buffer_query_string = "?url="+buffer_url+"&text="+buffer_text;
		if(buffer_source != undefined) buffer_query_string += "&source="+buffer_source;
		
		var iframe = jqbuf(document.createElement('iframe')).attr('allowtransparency', 'true').attr('src', 'http://dcancel.github.com/bookmarklet/'+buffer_query_string).attr('name', 'buffer_iframe').attr('id', 'buffer_iframe').attr('scrolling', 'no');
		jqbuf("body").append(iframe);
		
		
		bufferpm.bind("buffermessage", function(data) {
			jqbuf('#buffer_iframe').remove();
			return false;
		});
 
   	    }
 
})
 
function fullFunc(opts){
 
    // User doesn't have to set jquery, we have a default.
    opts.jqpath = opts.jqpath || "http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js";
 
    function getJS(jsfiles){
 
	// Check if we've processed all of the JS files (or if there are none)
	if (jsfiles.length === 0) {
		opts.ready();
		return false;
	}
 
        // Load the first js file in the array
        $.getScript(jsfiles[0],  function(){ 
 
            // When it's done loading, remove it from the queue and call the function again    
            getJS(jsfiles.slice(1));
 
        })
 
    }
 
    // Synchronous loop for css files
    function getCSS(csfiles){
        $.each(csfiles, function(i, val){
            $('<link>').attr({
                    href: val,
                    rel: 'stylesheet'
                }).appendTo('head');
        });
    }
 
	function getjQuery(filename) {
 
		// Create jQuery script element
		var fileref = document.createElement('script')
		fileref.type = 'text/javascript';
		fileref.src =  filename;
 
		// Once loaded, trigger other scripts and styles
		fileref.onload = function(){

			getCSS(opts.css); // load CSS files
			getJS(opts.js); // load JS files

		};
		fileref.onreadystatechange = function(){

			getCSS(opts.css); // load CSS files
			getJS(opts.js); // load JS files

		};	

		document.body.appendChild(fileref);
		
	}
 
	getjQuery(opts.jqpath); // kick it off
 
}; // end of bookmarklet();