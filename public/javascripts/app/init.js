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

	var from = 5000, to = 100000, step = 10000;

	var dragDealer = new Dragdealer("dragdealer-slider", { handleClass: 'marker', 
																												 css3: false, steps: 10, snap: true,
																											animationCallback: function(x,y) { 
			$('.line.current').width(Math.round(x * 100) + '%');

			var stepsCount = Math.ceil(x * 10);
			var sum = from;

			for (var i = 0; i < stepsCount; i++) {
				sum += step;
			};

			$('.ineed .sum').text(sum);
		}
  });

});
