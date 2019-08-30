const tabImages = ["28787901.jpg", "23317214.jpg", "29462393s.jpg", "35245278.jpg"];
const tabCovers = ["livre-enfant-couv.jpg"];

$(document).ready(function() {
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

	let index = 1;

	let sujet1 = "";
	let sujet2 = "";
	let sujetAUtiliser = "";

	/* $("#btn-turn-page").click(function() {
		console.log("click");
		$("#book").turn("next");
	}); */

	$("#start-story").click(async function() {
		if (index === 1) {
			animationTournerLaPage();
		}

		let phrase = "";
		if (index === 1) {
			phrase += "Il était une fois ";
		}
		$.ajax({
			type: "GET",
			url: "http://localhost:5001/histoire/" + index,
			success: function(response) {
				if (index > 4 && (index - 1) % 4 === 0) {
					animationTournerLaPage();
					phrase = "";
				}

				if (index > 1) {
					sujetAUtiliser.genre === "2" ? (phrase += " La ") : (phrase += " Le ");
					phrase += sujetAUtiliser.mot + " ";
					if (sujet2) {
						sujetAUtiliser === sujet1 ? (sujetAUtiliser = sujet2) : (sujetAUtiliser = sujet1);
					}
				}
				for (let i = 0; i < response.length; i++) {
					if (response[i].type === "sujet" && index > 1) {
						if (response[i].mot === sujet1.mot) {
							sujet2 = response[i];
							sujetAUtiliser = sujet2;
							response[i].genre === "2" ? (phrase += "une autre ") : (phrase += "un autre ");
						} else {
							response[i].genre === "2" ? (phrase += "une ") : (phrase += "un ");
						}
					}
					if (response[i].genre && index === 1) {
						response[i].genre === "2" ? (phrase += "une ") : (phrase += "un ");
						sujet1 = response[i];
						sujetAUtiliser = sujet1;
					}
					phrase += response[i].mot;
					if (response[i].type === "sujet" && index > 1) {
						if (response[i].mot === sujet1.mot) {
							let sujet1tmp = sujet1.mot;
							sujet1.mot = "premier " + sujet1tmp;
							let sujet2tmp = sujet2.mot;
							sujet2.mot = "deuxième " + sujet2tmp;
						}
					}
					if (i === response.length - 1) {
						let tabmot = response[i].mot.split(" ");
						if (tabmot[tabmot.length - 1] !== "?" && tabmot[tabmot.length - 1] !== "!") {
							phrase += ".";
						}
					} else {
						phrase += " ";
					}
				}
				let $newPhrase = $("<p class='text-livre text-livre" + index + "'></p>");
				let currentpage = $("#book").turn("page");
				$("#page-" + currentpage).append($($newPhrase));
				$(".text-livre" + index).html(phrase);
				//animationApparitionText(index);
				index++;
				$("#start-story").html("continuer l'histoire");
			}
		});
	});
});

function addPage(page, book) {
	let image = tabImages[Math.floor(tabImages.length * Math.random())];
	// 	First check if the page is already in the book
	if (!book.turn("hasPage", page)) {
		// Create an element for this page
		var element = $("<div />", { class: "page " + (page % 2 === 0 ? "odd page-text" : "even page-image"), id: "page-" + page }).html(
			'<i class="loader"></i>'
		);
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
				return 100 * (i + 1);
			}
		})
		.add({
			targets: ".text-livre",
			opacity: 0,
			duration: Infinity,
			easing: "easeOutExpo"
		});
}

function animationTournerLaPage() {
	$("#book").turn("next");
}
