jQuery(document).ready(function($){

	$('#demo_01 img').area_onhover({
		"wrap_image_element"		: false,
		"image_element_container"	: "#demo_01",
		"positioned_element_class"	: "hoverable"
	});

	$('#demo_02 img').area_onhover({
		"wrap_image_element"		: true,
		"positioned_element_class"	: "hoverable"
	});

	$('#demo_03 img').area_onhover({
		"wrap_image_element"		: true,
		"positioned_element_class"	: ["overlay","caption"]
	});

});