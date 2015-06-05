/**
 * 
 */
(function() {

	var file = "data/nzzdata.csv",
		diameter = 960,
		format = d3.format(",d"),
		color = d3.scale.category20c(),
		timeInterval = 60 * 60 * 24 * 30;


	var bubble = d3.layout.pack()
		.sort(null)
		.size([diameter, diameter])
		.padding(1.5);

	var svg = d3.select("body").append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.attr("class", "bubble");

	var data;

	d3.csv(file, function(error, root) {
		if (error)
			alert("unable to load data");
		data = root;
		window.showBubble(new Date("2015-05-11T00:00:00.000Z"));
	});

	d3.select(self.frameElement).style("height", diameter + "px");

	window.showBubble = function(date) {
		var terms = {},
			endDate = new Date(date.getTime() + timeInterval);

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