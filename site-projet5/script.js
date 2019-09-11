const tabImages = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg", "image6.jpg"];
const tabCovers = ["couv1.jpg", "couv2.jpg", "couv3.jpg", "couv4.jpg", "couv5.jpg", "couv6.jpg", "couv7.jpg", "couv8.jpg", "couv9.jpg", "couv10.jpg"];
const API = "https://p5api.herokuapp.com";
//const API = "http://localhost:5001";

let compteurdePhrases =1;
let nombrePhrasesDemandees = 0;

$(document).ready(function() {
	let endStory = false;
	let numberOfPages = 1000;

	let cover = tabCovers[Math.floor(tabCovers.length * Math.random())];
	$("#img-livre").attr("src", "assets/images/" + cover);

	$("#book").turn({
		acceleration: true,
		pages: numberOfPages,
		elevation: 50,
		gradients: !$.isTouch,
		when: {
			turning: function(e, page, view) {
				// Gets the range of pages that the book needs right now
				let range = $(this).turn("range", page);
				// Check if each page is within the book
				for (page = range[0]; page <= range[1]; page++) addPage(page, $(this));
			}
		}
	});

	$("#start-story").click(async function() {
		nombrePhrasesDemandees = $("#nbPhrase").val();
		// Lors du premier click on ouvre le livre.
		if (compteurdePhrases === 1) {
			animationTournerLaPage("next", compteurdePhrases, true);
			$("#background-book").addClass("background-book");
		}

		// demander les phrases à l'api puis les afficher.
		recupereDesPhrases(compteurdePhrases, nombrePhrasesDemandees);
	});

	$("#previous-page").click(() => {
		animationTournerLaPage("previous", compteurdePhrases);
		$("#start-story").prop("disabled", true);
		$("#next-page").prop("disabled", false);
	});
	$("#next-page").click(() => {
		animationTournerLaPage("next", compteurdePhrases);
		$("#previous-page").prop("disabled", false);
	});

	$("#end-story").click(() => {
		if (endStory) {
			//clic sur "nouvelle histoire"
			location.reload();
		} else {
			//clic sur "fin de l'histoire"
			let currentPage = $("#book").turn("page");
			for (let i = 1; i < currentPage; i++) {
				animationTournerLaPage("previous", compteurdePhrases);
			}
			$("#previous-page").prop("disabled", true);
			$("#next-page").prop("disabled", true);
			$("#start-story").prop("disabled", true);
			$("#end-story").html("Nouvelle histoire");
			$("#background-book").removeClass("background-book");
			endStory = true;
		}
	});
});

function recupereDesPhrases(numeroDeLaPhrase, nombrePhrasesDemandees) {
	$.ajax({
		type: "GET",
		url: `${API}/histoire/${numeroDeLaPhrase}/${nombrePhrasesDemandees}`,
		success: function(response) {
			//console.log("response", response);
			afficherLesPhrases(response);
		}
	});
}

function afficherLesPhrases(phrases) {
    $("#start-story").prop("disabled", true);
    const compteurdePhrasesOld = compteurdePhrases;
	for (let i = 0; i < phrases.length; i++) {
		setTimeout(function() {
			const phrase = phrases[i];
			if (compteurdePhrases > 1 && (compteurdePhrases - 1) % 4 === 0) {
				animationTournerLaPage("next", compteurdePhrases, true);
			}
			let newPhrase = $("<p class='text-livre text-livre" + compteurdePhrases + "'></p>");
			let currentPage = $("#book").turn("page");
			$("#page-" + currentPage).append($(newPhrase));
			$(".text-livre" + compteurdePhrases).html(phrase);
			$("#start-story").html("continuer l'histoire");
			compteurdePhrases++;
			if(compteurdePhrasesOld+phrases.length === compteurdePhrases){
                $("#start-story").prop("disabled", false);
			}
		}, i * 3000);
	}
}

function animationTournerLaPage(newpage, compteurdePhrases, story) {
	console.log(compteurdePhrases);
	$("#book").turn(newpage);
	let currentPage = $("#book").turn("page");
	if (newpage === "next" && story) {
		$("#page-" + currentPage).html("");
		$("#previous-page").prop("disabled", currentPage < 3);
	}
	if (newpage === "next" && !story) {
		let lastpage = (Math.ceil(compteurdePhrases / 4)) * 2;
		if (currentPage >= lastpage) {
			$("#next-page").prop("disabled", true);
			$("#start-story").prop("disabled", false);
		}
	}
	if (newpage === "previous") {
		$("#previous-page").prop("disabled", currentPage - 1 < 3);
	}
}

function addPage(page, book) {
	let image = tabImages[Math.floor(tabImages.length * Math.random())];
	// 	First check if the page is already in the book
	if (!book.turn("hasPage", page)) {
		// Create an element for this page
		var element = $("<div />", {
			class: "page " + (page % 2 === 0 ? "odd page-text" : "even page-image"),
			id: "page-" + page
		}).html('<i class="loader"></i>');
		let elText = $("<p />", { class: "text-livre", id: "text-livre" });
		let elImg = $("<img />", { class: "img-livre", id: "img-livre", src: "assets/images/" + image });
		page % 2 === 0 ? element.append(elText) : element.append(elImg);

		// If not then add the page
		book.turn("addPage", element, page);
		// Let's assum that the data is comming from the server and the request takes 1s.
		setTimeout(function() {
			elText.html("");
		}, 1000);
	}
}

function animationApparitionText(index) {
	var textWrapper = document.querySelector(".text-livre" + index);
	textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
	anime
		.timeline({ loop: false })
		.add({
			targets: ".text-livre" + index + " .letter",
			opacity: [0, 1],
			easing: "easeInOutQuad",
			duration: 500,
			delay: function(el, i) {
				return 50 * (i + 1);
			}
		})
		.add({
			targets: ".text-livre",
			opacity: 0,
			duration: Infinity,
			easing: "easeOutExpo"
		});
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/***************** PARTIE EXCUSE *************************************************************************************/
/*********************************************************************************************************************/
/*********************************************************************************************************************/
let sexe = "homme";
$(document).ready(function() {
	$("#downloadExcuse").click(async function() {
		if ($("#genre").prop("checked")) {
			sexe = "femme";
		}
		$("#excuse-text").html("");

		let nbExcuse = $("#nbExcuse").val();
		$.ajax({
			type: "GET",
			url: API + "/excuse/" + nbExcuse + "/" + sexe,
			success: function(response) {
				for (let i = 0; i < response.length; i++) {
					let excuse = response[i];
					$("#excuse-text").append("<p>" + excuse + "</p>");
					$("#downloadExcuse").html("Générer de nouvelles excuses");
				}
			}
		});
	});
});

$("#btn-sda").click(() => {
	$.ajax({
		type: "GET",
		url: API + "/sda",
		success: function(response) {
			console.log(response); //ne pas effacer cette ligne, c'est la réponse ;)
		}
	});
});
