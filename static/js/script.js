(function(){
	'use_strict';

	$.vegas('slideshow', {
		delay: 16000,
		backgrounds: [
    		{src: 'static/img/2.jpg', fade: 8000},
    		{src: 'static/img/3.jpg', fade: 8000},
    		{src: 'static/img/1.jpg', fade: 8000}
		]
  	})('overlay', {
    	src:'static/lib/vegas/overlays/15.png'
  	});
});
