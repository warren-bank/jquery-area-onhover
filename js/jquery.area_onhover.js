(function($){

	$.fn.area_onhover = function(user_options){
		if (! this.length){return}

		/*
		 ****************************************
		 * usage patterns:
		 * ===============
		 *   - selecting an image element:
		 *     * must either:
		 *       - specify an existing container element
		 *       - wrap the image element with a new container element
		 *   - selecting a map element:
		 *     * must either:
		 *       - specify an existing container element
		 *       - specify the image element, AND
		 *         wrap the image element with a new container element
		 *
		 * helpers:
		 * ========
		 *   - since wrapping an image element with a new container element
		 *     is a common usage pattern,
		 *     the (boolean) helper option: "wrap_image_element"
		 *     when set to TRUE, will pre-populate the option: "image_element_wrapper"
		 *     with a DOM string that creates an inline-block element
		 *     having the same width/height dimensions as the image element.
		 *
		 * other options:
		 * ==============
		 *   - "css_class":
		 *     * Value may contain a string.
		 *       For each `<area.onhover>`:
		 *         - 1 absolutely positioned anchor element will be added to the container element.
		 *           The anchor element will be assigned the css class: "css_class"
		 *
		 *       Additional data can be contained in the DOM element: `area.onhover[i]`:
		 *         - within loop:
		 *             * any css classes (excluding `.onhover`)
		 *               will be copied to the absolutely positioned anchor element
		 *
		 *       example:
		 *         - "css_class":
		 *               "hoverable"
		 *         - area tag:
		 *               <area shape="rect" coords="0,0,100,100" href="#example" class="onhover odd not-even" />
		 ****************************************
		 */

		var default_options = {
			"image_element"				: false,
			"image_element_wrapper" 	: false,
			"image_element_container"	: false,
			"css_class"					: false,

			// helpers
			"wrap_image_element" 		: false
		};

		this.each(function(){
			var $this, dom_element_options, options, $map, $img, $img_container;

			$this						= $(this);
			if (! $this.is('img[usemap],map')){return true;}

			dom_element_options			= {};
			if ($this.is('[options]')){
				try {
					dom_element_options	= JSON.parse( $map.attr('options') );
				}
				catch(e){
					dom_element_options	= {};
				}
			}
			options						= $.extend(true, {}, default_options, user_options, dom_element_options);

			// interpolate "helper" options
			if (
					(  options.wrap_image_element)
				&&	(! options.image_element_wrapper)
			){
				options.image_element_wrapper	= '<div style="display:inline-block; position:relative; z-index:0; width:{{img_width}}px; height:{{img_height}}px;"></div>';
			}

			if ( $this.is('img[usemap]') ){
				$img	= $this;
				$map	= $('map[name="' + ($img.attr('usemap').substr(1)) + '"]');

				if ($map.length !== 1){return true;}
			}
			else if ( $this.is('map') ){
				if (! $img){
					if ( options.image_element ){
						$img = $( options.image_element );
						if ($img.length !== 1){$img = false;}
					}
				}
				if (! $img){
					if ( options.image_element_wrapper ){return true;}
				}
			}

			if ($img && options.image_element_wrapper){
				(function(){
					var pattern, img_width, img_height;

					if( typeof options.image_element_wrapper !== 'string' ){return;}

					pattern = /\{\{img_(?:width|height)\}\}/i;

					if (pattern.test( options.image_element_wrapper )){
						img_width = $img.width();
						img_height = $img.height();

						options.image_element_wrapper = options.image_element_wrapper.replace(/\{\{img_width\}\}/i, img_width).replace(/\{\{img_height\}\}/i, img_height);
					}
				})();

				$img_container			= $( options.image_element_wrapper );

				if ($img_container.length === 1){
					$img.wrap( $img_container );
					$img_container		= $img.parent();
				}
			}
			else if ( options.image_element_container ) {
				$img_container			= $( options.image_element_container );
			}

			if (
				(! $img_container) || ($img_container.length !== 1)
			){return true;}

			// begin processing <area class="onhover"> tags
			var $areas = $map.find('area[shape="rect"][coords][href].onhover');
			if (! $areas.length){return true;}

			$areas.removeClass('onhover').each(function(){
				var $area	= $(this);
				var $a		= $('<a></a>');
				var href, css_class, coords, i, width, height, left, top;

				href		= $area.attr('href');
				css_class	= $area.attr('class');
				coords		= $area.attr('coords').split(',');
				if (coords.length !== 4){return true;}

				for (i=0; i<4; i++){
					coords[i]	= parseInt(coords[i], 10);
				}

				width		= Math.abs( coords[0] - coords[2] );
				height		= Math.abs( coords[1] - coords[3] );
				left		= Math.min( coords[0] , coords[2] );
				top			= Math.min( coords[1] , coords[3] );

				if ( options.css_class ){
					$a.addClass( options.css_class );
				}
				if (typeof css_class === 'string'){
					css_class = $.trim(css_class);
					if (css_class !== ''){
						$a.addClass( css_class );
					}
				}

				$a
					.css('cssText','display:block; position:absolute; z-index:1; width:' +width+ 'px; height:' +height+ 'px; left:' +left+ 'px; top:' +top+ 'px;')
					.attr('href', href)
					.appendTo( $img_container )
				;
			});
		});
	};

})(jQuery);