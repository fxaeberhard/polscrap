/**
 * 
 */
(function() {

	var file = "data/bundeshausdata-demo.csv",
		width = 450,
		height = 300,
		format = d3.format(",d"),
		color = d3.scale.category20c(),
		data;

	var bubble = d3.layout.pack()
		.sort(null)
		.size([width, height])
		.padding(1.5);

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "bubble");

	d3.csv(file, function(error, root) {
		if (error)
			alert("unable to load data");

		data = root;

		var min = new Date(data[0].timestamp),
			max = min;

		data.forEach(function(o) {
			var d = new Date(o.timestamp);
			if (d > max) {
				max = d;
			}
			if (d < min) {
				console.log("min", o.timestamp);
				min = d;
			}
		});

		min.setDate(1);
		max.setDate(1);

		$.showBubble(min);
		$.initSlider(min, max);
	});

	d3.select(self.frameElement).style("height", height + "px");

	$.showBubble = function(date) {
		var terms = {},
			endDate = date.clone().addMonths(1);

		data.forEach(function(r) {
			var term = r.term,
				d = new Date(r.timestamp);

			if (d < date || d > endDate)
				return;

			if (!terms[term]) {
				terms[term] = {
					className: term,
					packageName: term,
					value: 0
				};
			}

			terms[term].value += +r.count * 100;
		});

		svg.selectAll("*").remove();

		if (_.size(terms) > 0) {
			render(_.values(terms));
		}
	};

	function render(data) {
		var node = svg.selectAll(".node")
			.data(bubble.nodes({
				children: data
			})
				.filter(function(d) {
					return !d.children;
				}))
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		node.append("title")
			.text(function(d) {
				return d.className + ": " + format(d.value);
			});

		node.append("circle")
			.attr("r", function(d) {
				return d.r;
			})
			.style("fill", function(d) {
				return color(d.packageName);
			});

		node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.text(function(d) {
				return d.className.substring(0, d.r / 3);
			});
	}
}());