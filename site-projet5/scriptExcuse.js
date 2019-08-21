$(document).ready(function() {

	$("#downloadExcuse").click(async function() {
        $('#excuse-text').html('');

		let nbExcuse =  $('#nbExcuse').val();
		$.ajax({
			type: "GET",
			url: "http://localhost:5001/excuse/" + nbExcuse,
			success: function(response) {
				console.log(response);

                for(let i=0; i < response.length; i++){
                    let phraseExcuse = "";
                    console.log(response[i]);
                	let excuse = response[i];
                    for(let i=0; i < excuse.length; i++){
                        if($('#genre').prop('checked', true)){
                            console.log('je suis une fille');
                        }
                        if(excuse[i].type === "verbe"){
                            excuse[i].avec === "avoir" ? phraseExcuse += "a " : phraseExcuse += "est "
                        }
                        if(excuse[i].type === "objet2"){
                            phraseExcuse += "avec ";
                        }
                        phraseExcuse += excuse[i].mot;
                        phraseExcuse += " ";
                    }
                    $('#excuse-text').append('<p>'+phraseExcuse+'</p>');
                    $('#downloadExcuse').html('Générer de nouvelles excuses')
				}

			}
		});
	});
});

