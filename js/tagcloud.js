/**
 * 
 */
(function() {

	var diameter = 960,
		format = d3.format(",d"),
		color = d3.scale.category20c();

	var bubble = d3.layout.pack()
		.sort(null)
		.size([diameter, diameter])
		.padding(1.5);

	var svg = d3.select("body").append("svg")
		.attr("width", diameter)
		.attr("height", diameter)
		.attr("class", "bubble");

	var data;

	d3.csv("data/data.csv", function(error, root) {
		data = root;
		window.showBubble();
	});

	d3.select(self.frameElement).style("height", diameter + "px");


	window.showBubble = function(date) {

		var children = [{
				className: "AgglomerativeCluster",
				packageName: "cluster",
				value: 3938
			}, {
				className: "AgglomerativeCluster2",
				packageName: "cluster2",
				value: 3938
			}];

		var terms = {};

		data.forEach(function(r) {
			var term = r[' Term'],
				count = r[' Count'];

			if (!terms[term]) {
				terms[term] = {
					size: 0,
					className: "AgglomerativeCluster2",
					packageName: "cluster2",
				};
				terms[term] = {
					className: "AgglomerativeCluster2",
					packageName: "cluster2",
					value: 0
				};
			}

			terms[term].value += +count * 100;
		});


		var node = svg.selectAll(".node")
			.data(bubble.nodes({
				children: _.values(terms)
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
	};

}());