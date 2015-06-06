$(function() {
	var select = $("#timeslot"),
		minDate;


	$.initSlider = function(min, max) {

		var interval = $.monthDiff(min, max);
		minDate = min;

		var currentSlide = 0;
		var playInterval;
		var slideDuration = 1000; // in milliseconds
		var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


		var slider = $("<div id='slider'></div>").insertAfter(select).slider({
			min: 0,
			max: interval,
			range: "min",
//			value: select[ 0 ].selectedIndex + 1,
			value: 0,
			slide: function(event, ui) {
//				select[ 0 ].selectedIndex = ui.value;
//				myFunction();
				stopSlide();
				updateSlide(ui.value);
			}
		});

		function updateSlide(index) {
			var date = new Date(minDate.getTime());
			date.addMonths(index);
			$("#test").html(MONTHS[date.getMonth()] + " " + date.getFullYear());
			$.showBubble(date);
		}
		updateSlide(0);

		$("#timeslot").change(function() {
			slider.slider("value", this.selectedIndex + 1);
			myFunction();
		});

		$("#play").button({
			icons: {
				primary: "ui-icon-play"
			}
		});
		$("#play").click(function() {
			if (playInterval != undefined) {
				stopSlide();
				return;
			}
			$("#play").button("option", "icons", {primary: "ui-icon-pause"}).button( "option", "label", "pause" )

			playInterval = setInterval(function() {
				var newIndex = $("#slider").slider("value") + 1;
				if (newIndex > interval) {
					stopSlide();
					return;
				}
				$("#slider").slider("value", newIndex);
				updateSlide(newIndex);
//				currentSlide++;
//				setSlide(currentSlide);
			}, slideDuration);
		});
		var stopSlide = function() {
			if (playInterval) {
				clearInterval(playInterval);
				playInterval = undefined;
			}
			$("#play").button("option", "icons", {primary: "ui-icon-play"}).button( "option", "label", "play" )
		}
	};

	$.monthDiff = function(d1, d2) {
		var months;
		months = d2.getMonth() - d1.getMonth() + (d2.getFullYear() - d1.getFullYear()) * 12;
//		months -= d1.getMonth() + 1;
//		months += d2.getMonth();
		return months <= 0 ? 0 : months;
	};
	Date.isLeapYear = function(year) {
		return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
	};

	Date.getDaysInMonth = function(year, month) {
		return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	};

	Date.prototype.isLeapYear = function() {
		return Date.isLeapYear(this.getFullYear());
	};

	Date.prototype.getDaysInMonth = function() {
		return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
	};

	Date.prototype.addMonths = function(value) {
		var n = this.getDate();
		this.setDate(1);
		this.setMonth(this.getMonth() + value);
		this.setDate(Math.min(n, this.getDaysInMonth()));
		return this;
	};
	Date.prototype.clone = function() {
		return new Date(this.getTime());
	};
});


//function setSlide(index) {
//	currentSlide = index;
//	var select = $("#timeslot");
//	select[ 0 ].selectedIndex = index;
//	$("#slider").slider("value", index + 1);
//	myFunction();
//}
//
//function myFunction() {
//	var text_value = $("#timeslot").val();
//	var index_value = $("#timeslot")[0].selectedIndex + 1;
//	$("#test").html(text_value + "  " + index_value);
//	$("#image").attr("src", "./img/sample-" + index_value + ".png");
//
//}
