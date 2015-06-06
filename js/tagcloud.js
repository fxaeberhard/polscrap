/**
 * 
 */
(function() {

	var file = "data/bundeshausdata-2014-2015.csv",
		//file = "data/bundeshausdata-demo.csv",nzzdata
		secfile = "data/nzzdata.csv",
		//secfile = "data/nzzdata-demo.csv",
		width = 450,
		height = 300,
		format = d3.format(",d"),
		color = d3.scale.category20c(),
		data, secdata,
		dataLoadCount = 0, min, max;

	var bubble = d3.layout.pack()
		.sort(null)
		.size([width, height])
		.padding(1.5);

	var svg = d3.select(".viz").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "bubble");

	d3.select(self.frameElement).style("height", height + "px");

	d3.csv(file, function(error, root) {										// Load 1st file (=bubble size)
		if (error)
			alert("unable to load data");

		data = root;

		min = new Date(data[0].timestamp);										// Lookup for min and max dates
		max = min;
		data.forEach(function(o) {
			var d = new Date(o.timestamp);
			if (d > max)
				max = d;
			if (d < min)
				min = d;
		});
		min.setDate(1);
		max.setDate(1);

		onDataLoaded();
	});
	d3.csv(secfile, function(error, root) {										// Load 2nd file (font size)
		if (error)
			alert("unable to load data");
		secdata = root;
		onDataLoaded();
	});
	function onDataLoaded() {
		dataLoadCount++;
		if (dataLoadCount === 2) {												// Wait for the 2 files to be loaded
			$.showBubble(min);
			$.initSlider(min, max);
		}
	}

	$.showBubble = function(startDate) {										// Compute the number of occurences of each terms in the 2 datasets
		var terms = {},
			endDate = startDate.clone().addMonths(1);

		data.forEach(function(r) {
			var d = new Date(r.timestamp);
			if (d < startDate || d > endDate)
				return;

			if (!terms[r.term]) {
				terms[r.term] = {name: r.term, value: 0, seccount: 0};
			}
			terms[r.term].value += 100;
		});
		secdata.forEach(function(r) {
			var d = new Date(r.timestamp);
			if (d < startDate || d > endDate)
				return;

			if (terms[r.term]) {
				terms[r.term].seccount++;
			}
		});


		if (_.size(terms) > 0) {
			svg.selectAll("*").remove();										// Empty the svg
			draw(_.values(terms));
		}
	};

	function draw(data) {
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
				return d.name + ": " + format(d.value);
			});

		node.append("circle")
			.attr("r", function(d) {
				return d.r;
			})
			.style("fill", function(d) {
				return color(d.name);											// this results in a random color, not really sure how
			});

		node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.style("font-size", function(d) {
				return Math.max(9, Math.min(d.seccount * 6, 30)) + "px";		// bound the value between 8 and 30 pixels
			})
			.text(function(d) {
				return d.name.substring(0, d.r / 3);
			});
	}
}());