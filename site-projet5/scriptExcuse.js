$(document).ready(function() {
	$("#downloadExcuse").click(async function() {
		$("#excuse-text").html("");

		let nbExcuse = $("#nbExcuse").val();
		$.ajax({
			type: "GET",
			url: "http://localhost:5001/excuse/" + nbExcuse,
			success: function(response) {
				console.log(response);

				for (let i = 0; i < response.length; i++) {
					let phraseExcuse = "";
					console.log(response[i]);
					let excuse = response[i];
					for (let i = 0; i < excuse.length; i++) {
						if (excuse[i].type === "verbe") {
							if (excuse[i - 1].mot === "j") {
								excuse[i].avec === "avoir" ? (phraseExcuse += "'ai ") : (phraseExcuse += "e suis ");
							} else {
								excuse[i].avec === "avoir" ? (phraseExcuse += "a ") : (phraseExcuse += "est ");
							}
						}
						if (excuse[i].type === "capacite") {
							phraseExcuse += "ainsi, ";
						}
						phraseExcuse += excuse[i].mot;

						if (excuse[i].type === "formule") {
							if ($("#genre").prop("checked")) {
								if (excuse[i].feminin === "1") {
									phraseExcuse += "e";
								}
							}
							phraseExcuse += ",";
						}
						if (excuse[i].type === "temps") {
							console.log(excuse[i].pluriel);
							excuse[i].pluriel === "1" ? (phraseExcuse += " ont été pour moi") : (phraseExcuse += " a été pour moi");
						}
						if (excuse[i].type === "calificatiftemps") {
							if (excuse[i - 1].genre === "2") phraseExcuse += "e";
							if (excuse[i - 1].pluriel === "1") phraseExcuse += "s";
							phraseExcuse += " en effet,";
						}
						phraseExcuse += " ";
					}
					$("#excuse-text").append("<p>" + phraseExcuse + "</p>");
					$("#downloadExcuse").html("Générer de nouvelles excuses");
				}
			}
		});
	});

	$("#btn-sda").click(() => {
		$.ajax({
			type: "GET",
			url: "http://localhost:5001/sda",
			success: function(response) {
				console.log(response);
			}
		});
	});
});
