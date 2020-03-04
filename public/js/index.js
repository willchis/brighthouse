$(() => {
	

	

	$('form').submit(function(event){
	    event.preventDefault(); //prevent default action 
	    $("#results").html('');
	    var post_url = $(this).attr("action"); //get form action url
	    var request_method = $(this).attr("method"); //get form GET/POST method
		var form_data = $(this).serialize();
		$('.loader').show();
	    $.ajax({
	        url : post_url,
	        type: request_method,
	        data : form_data,
			ContentType: 'application/json',
			cache: false,
			processData:false
	    }).done(function(response){
	    	$('.loader').hide();
	    	if (response) {
	    		for (const property in response) {
	    			let score = response[property];
	    			if (score) {
	    				score = score.toString().substring(2);
	    			}
	    			let percent = score.indexOf("error") == -1 ? '%' : '';
					$("#results").append(`
					<div class="col text-center">${property}
					<div class="c100 p0 big" id="div_loading_progress_${property}"><span id="span_progress_${property}">0%</span>
					<div class="slice">
						<div class="bar"></div>
						<div class="fill"></div>
					</div>
					</div>
					</div>`);
					let max = score;
					let pct = 0;
					let span_progress = document.getElementById("span_progress_" + property);
					let div_loading_progress = document.getElementById("div_loading_progress_" + property);

					function display_pct(p) {
						span_progress.innerHTML="" + p + "%";
						div_loading_progress.className="c100 p"+p;
					}

					function update_pct(){
						display_pct(pct++);
								
						if (pct <= max) {
							setTimeout(update_pct, 10);
						}
					}
					setTimeout(update_pct, 50);
				}
	    	}
	    });
	});


});