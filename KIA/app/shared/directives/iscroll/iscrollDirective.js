'use strict';

module.exports = /*@ngInject*/ function() {
	return {
		restrict:'A',
		link: function(scope,element,attr) {
			var iscroll = new IScroll(element.get(0), {
		      scrollbars            : 'custom',
		      mouseWheel            : true,
		      interactiveScrollbars : true
		    });
		}
	};
};