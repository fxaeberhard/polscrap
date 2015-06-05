$(function() {
    var select = $( "#timeslot" );
    

    var currentSlide = 0;
    var playInterval;
    var slideDuration = 1000; // in milliseconds


    var slider = $( "<div id='slider'></div>" ).insertAfter( select ).slider({
      min: 1,
      max: 6,
      range: "min",
      value: select[ 0 ].selectedIndex + 1,
      slide: function( event, ui ) {
        select[ 0 ].selectedIndex = ui.value - 1;
        myFunction();
      }
    });



    $( "#timeslot" ).change(function() {
      slider.slider( "value", this.selectedIndex + 1 );
      myFunction();

    });


    $( "#play" ).click(function () {
        if (playInterval != undefined) {
            clearInterval(playInterval);
            playInterval = undefined;
            $(this).button({
                icons: {
                    primary: "ui-icon-play"
                }
            });
            return;
        }
        $(this).button({
            icons: {
                primary: "ui-icon-pause"
            }
        });
        playInterval = setInterval(function () {
            currentSlide++;              
            setSlide(currentSlide);
        }, slideDuration);
    });


  });


  function setSlide (index) {
    currentSlide = index;
    var select = $( "#timeslot" );
    select[ 0 ].selectedIndex= select[ 0 ].selectedIndex + 1;
    myFunction();
    $( "#slider" ).slider( "value", index );

  }


	function myFunction() {
	    var text_value = $("#timeslot").val();
      var index_value = $("#timeslot")[0].selectedIndex + 1;
	    $("#test").html(text_value+"  "+index_value);
      $("#image").attr("src","./img/sample-"+index_value+".png");
	}
