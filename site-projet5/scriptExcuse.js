$(document).ready(function() {

    $(function() {
        $('#nbExcuse').next().text('1'); // Valeur par défaut
        $('#nbExcuse').on('input', function() {
            var $set = $(this).val();
            $(this).next().text($set);
        });
    });

	$("#downloadExcuse").click(async function() {

		let index =  $('#nbExcuse').val();
		$.ajax({
			type: "GET",
			url: "http://localhost:5001/excuse/" + index,
			success: function(response) {
				console.log(response);

                for(let i=0; i < response.length; i++){
                    let phraseExcuse = "";
                    console.log(response[i]);
                	let excuse = response[i];
                    for(let i=0; i < excuse.length; i++){
                        phraseExcuse += excuse[i].mot;
                        phraseExcuse += " ";
                    }
                    $('#excuse-text').append('<p>'+phraseExcuse+'</p>');
				}

			}
		});
	});
});

