$(document).ready(function() {
	$(".slides").slick({
		responsive: [
			{
				breakpoint: 480,
				settings: { arrows: false }
			},
			{
				breakpoint: 769,
				settings: { arrows: false }
			}
		]
	});
});