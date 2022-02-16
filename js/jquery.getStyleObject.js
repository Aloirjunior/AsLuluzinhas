/*
	From: http://upshots.org/?p=112
	Copyright: Unknown, see source link
	Plugin version by Dakota Schneider (http://hackthetruth.org)
 
	var style = $("#original").getStyleObject(); // copy all computed CSS properties
	$("#original").clone() // clone the object
		.parent() // select it's parent
		.appendTo() // append the cloned object to the parent, after the original
					// (though this could really be anywhere and ought to be somewhere
					// else to show that the styles aren't just inherited again
		.css(style);
*/

(function($){
    $.fn.getStyleObject = function(){
		var dom = this.get(0);
		var style;
		var returns = {};
		if(window.getComputedStyle){
			var camelize = function(a,b){
				return b.toUpperCase();
			}
			style = window.getComputedStyle(dom, null);
			for(var i = 0, l = style.length; i < l; i++){
				var prop = style[i];
				var camel = prop.replace(/\-([a-z])/, camelize);
				var val = style.getPropertyValue(prop);
				returns[camel] = val;
			}
			return returns;
		}
		if(dom.currentStyle){
			style = dom.currentStyle;
			
			var count = 0;

			for(var prop in style)
			{
				if(count)
				{
					if(count != 23 && count != 84)
					{
						returns[prop] = style[prop];
					}
				}
				
				count++;
			}
			return returns;
		}
		if(style = dom.style){
			for(var prop in style){
				if(typeof style[prop] != 'function'){
					returns[prop] = style[prop];
				}
			}
			return returns;
		}
		return returns;
	}
})(jQuery);
