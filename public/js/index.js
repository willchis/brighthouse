$(() => {
	$('form').submit(function(event){
	    event.preventDefault(); //prevent default action 
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
	    			$("#results").append(`<div class="col">${property}: ${response[property]}</div>`)
				}
	    	}
	    });
	});

});