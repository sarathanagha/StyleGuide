'use strict';

module.exports = /*@ngInject*/ function() {
	var directive = {};
	directive.restrict = 'A';
	directive.link = function(scope,element,attribute) {

		/*
			How the css property, bottom, is calculated

			Total height = 500px
			Viewport height = 300px

			The difference is the scroll area or total scroll height, excluding footer
			Total scroll height = 500 - 300 - 40 = 160px

			Now simply subtract this scroll height from the scrollTop (gets current scrollling position)

			Examples:
				scroll height = 160, scrollTop = 0 (top of page) 0 - 160 = -160 
				bottom = 0 (if delta is less than 0, bottom should be 0)

				scroll height = 160, scrollTop = 161  161 - 160 = 1
				bottom = 1 

				scroll height = 160, scrollTop = 200  200 - 160 = 40
				bottom = 40				

		*/

		function calcutateElementPosition() {
			var docHeight = $(document).height();
			var winHeight = $(window).height();

			var maxScroll = docHeight - winHeight - 40; // take footer into account						
			var currentScroll = $(window).scrollTop();

			var delta = currentScroll - maxScroll;
			var bottom = 0; // css bottom value. If delta is less than zero, don't change this value.

			if (delta > 0) { bottom = delta;} 	

			element.css('bottom', bottom);
		}

		$(window).scroll(function() {
			calcutateElementPosition();
		});

		$(window).resize(function() {
			calcutateElementPosition();
		});	
	};

	return directive;
};