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
                    let excuse = response[i];
					let phraseExcuse = "";
					for (let i = 0; i < excuse.length; i++) {
                        let motExcuse = excuse[i];
						if (motExcuse.type === "verbe") {
							if (excuse[i - 1].mot === "j") {
                                motExcuse.avec === "avoir" ? (phraseExcuse += "'ai ") : (phraseExcuse += "e suis ");
                                if ($("#genre").prop("checked")) {excuse[i - 1].genre = "2"}
							} else {
								if(motExcuse.avec === "avoir"){
									excuse[i - 1].pluriel === "1" ? phraseExcuse += "ont ": phraseExcuse += "a ";
								}else {
                                    excuse[i - 1].pluriel === "1" ? phraseExcuse += "sont " : phraseExcuse += "est ";
                                }
							}
                            phraseExcuse = accorder(motExcuse,phraseExcuse,excuse[i - 1]);
						}
						if (motExcuse.type === "capacite") {
							phraseExcuse += "ainsi, ";
						}
						if(motExcuse.type !== "verbe" && motExcuse.type !== "calificatiftemps"){
							phraseExcuse += motExcuse.mot;
						}

						if (motExcuse.type === "formule") {
							if ($("#genre").prop("checked")) {
								if (motExcuse.feminin === "1") {
									phraseExcuse += "e";
								}
							}
							phraseExcuse += ",";
						}
						if (motExcuse.type === "temps") {
                            motExcuse.pluriel === "1" ? (phraseExcuse += " ont été pour moi") : (phraseExcuse += " a été pour moi");
						}
						if (motExcuse.type === "calificatiftemps") {
                            phraseExcuse = accorder(motExcuse,phraseExcuse,excuse[i - 1]);
							phraseExcuse += " en effet,";
						}
                        motExcuse.mot === "j" ? phraseExcuse += "" : phraseExcuse += " " ;
					}
					$("#excuse-text").append("<p>" + phraseExcuse + "</p>");
					$("#downloadExcuse").html("Générer de nouvelles excuses");
				}
			}
		});
	});

	function accorder(motExcuse,phraseExcuse, motExcusePrec){
        if (motExcusePrec.genre === "1") {
            if (motExcusePrec.pluriel === "1") {
                phraseExcuse += motExcuse.mot[2];
            } else {
                phraseExcuse += motExcuse.mot[0];
            }
        }
        if (motExcusePrec.genre === "2") {
            if (motExcusePrec.pluriel === "1") {
                phraseExcuse += motExcuse.mot[3];
            } else {
                phraseExcuse += motExcuse.mot[1];
            }
        }
        return phraseExcuse;
	}

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
