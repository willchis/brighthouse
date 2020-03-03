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
	    			$("#results").append(`<div class="col text-center">${property}: <div class="col">${score}${percent}</div>`)
				}
	    	}
	    });
	});

});