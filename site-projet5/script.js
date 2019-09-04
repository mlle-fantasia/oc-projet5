const tabImages = ["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg", "image6.jpg"];
const tabCovers = ["couv1.jpg", "couv2.jpg", "couv3.jpg", "couv4.jpg", "couv5.jpg", "couv6.jpg", "couv7.jpg", "couv8.jpg", "couv9.jpg", "couv10.jpg"];
const API = "https://p5api.herokuapp.com";

let compteurdePhrases = 1;
let sujet = null;
let nombrePhrasesDemandees = 0;


$(document).ready(function () {


    let endStory = false;
    let lastPage = 0;
    let numberOfPages = 1000;

    let cover = tabCovers[Math.floor(tabCovers.length * Math.random())];
    $("#img-livre").attr("src", "assets/images/" + cover);

    $("#book").turn({
        acceleration: true,
        pages: numberOfPages,
        elevation: 50,
        gradients: !$.isTouch,
        when: {
            turning: function (e, page, view) {
                // Gets the range of pages that the book needs right now
                let range = $(this).turn("range", page);
                // Check if each page is within the book
                for (page = range[0]; page <= range[1]; page++) addPage(page, $(this));
            }
        }
    });

    $("#start-story").click(async function () {
        nombrePhrasesDemandees = $("#nbPhrase").val();
        console.log(nombrePhrasesDemandees, "nombrePhrasesDemandees");
        // Lors du premier click on ouvre le livre.
        if (compteurdePhrases === 1) {
            await animationTournerLaPage(compteurdePhrases);
            $("#background-book").addClass("background-book");
        }
        // A-t-on une page précédente ?
        $("#previous-page").prop("disabled", $("#book").turn("page") < 4);

        // On afficher les phrases.
        recupereDesPhrases(compteurdePhrases, nombrePhrasesDemandees);
    });

    $("#previous-page").click(() => {
        $("#book").turn("previous");
        $("#start-story").prop("disabled", true);
        $("#next-page").prop("disabled", false);
        //let currentPage = $("#book").turn("page");
        lastPage += 1;
        if (lastPage === 1) {
            $("#previous-page").prop("disabled", true);
        }
    });
    $("#next-page").click(() => {
        $("#book").turn("next");
        $("#previous-page").prop("disabled", false);

        lastPage -= 1;
        if (lastPage === 0) {
            $("#start-story").prop("disabled", false);
            $("#next-page").prop("disabled", true);
        }
    });

    $("#end-story").click(() => {
        if (endStory) {
            //clic sur "nouvelle histoire"
            let cover = tabCovers[Math.floor(tabCovers.length * Math.random())];
            $("#img-livre").attr("src", "./assets/images/" + cover);

            $("#end-story").html("Fin de l'histoire");
            $("#start-story").html("Commencer l'histoire");
            $("#start-story").prop("disabled", false);
            $("#next-page").prop("disabled", true);
            endStory = false;
            index = 1;
        } else {
            //clic sur "fin de l'histoire"
            // on réintialise les variable de début d'histoire
            compteurdePhrases = 0;
            sujet = null;
            nombrePhrasesDemandees = 0;

            let currentPage = $("#book").turn("page");
            for (let i = 1; i < currentPage; i++) {
                $("#book").turn("previous");
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
        url: `${API}/histoire/${numeroDeLaPhrase }/${nombrePhrasesDemandees}`,
        success: function (response) {
            console.log(response);
            afficherLesPhrases(response);
        }
    });
}

function afficherLesPhrases(phrases) {
    phrases.forEach(phrase => {
        let maPhrase = "";

        if (compteurdePhrases === 1) {
            maPhrase+= phraseInitiale(phrase);
        }
        if (compteurdePhrases > 1 && compteurdePhrases < 4) {
            maPhrase+= situationInitiale(phrase);
        }
        if (compteurdePhrases === 4) {
            maPhrase += elementDeclancheur(phrase);
        }
        if (compteurdePhrases > 4) {
            maPhrase += elementAction(phrase);
        }

        if (compteurdePhrases > 1 && (compteurdePhrases - 1) % 4 === 0) {
            animationTournerLaPage();
        }

        let $newPhrase = $("<p class='text-livre text-livre" + compteurdePhrases + "'></p>");
        let currentPage = $("#book").turn("page");
        $("#page-" + currentPage).append($($newPhrase));
        $(".text-livre" + compteurdePhrases).html(maPhrase);
        $("#start-story").html("continuer l'histoire");
        compteurdePhrases++;
    });
}

function phraseInitiale(phrase) {
    sujet = phrase.filter(objetMot => objetMot.type === "sujet")[0];
    let determinant = sujet.genre === "2" ? "une " : "un ";
    phrase.shift();

    let maPhrase = "Il était une fois " + determinant + sujet.mot + " ";

    maPhrase += phrase.map(element => {
        if (typeof element.mot === "string") {
            return element.mot;
        }
        let index = accordercomplement(sujet);
        return element.mot[index];
    }).join(" ");
    return maPhrase + ".";
}


function situationInitiale(tabPhrase) {
    let maPhrase = "";
    let determinant = sujet.genre === "2" ? "La " : "Le ";
    let pour = false;

    maPhrase += determinant + sujet.mot+ " ";

    for (let j = 0; j < tabPhrase.length; j++) {
        let objMot = tabPhrase[j];

        if (objMot.suite2) {
            if (objMot.suite2 === "personnage") {
                pour = true;
            }
        }
        if (objMot.type === "qui") {
            if (tabPhrase[j - 1].mot === "se moquer des gens") {
                maPhrase += objMot.mot[2];
            }
            if (tabPhrase[j - 1].type === "personnage") {
                let index = accordercomplement(tabPhrase[j - 1]);
                maPhrase += objMot.mot[index];
            }
        } else if (objMot.type === "adjectif") {
            let index = accordercomplement(tabPhrase[j - 1]);
            maPhrase += objMot.mot[index];
        } else {
            maPhrase += objMot.mot;
        }
        if (objMot.type === "nourriture" && pour) {
            maPhrase += " pour ";
        }

        maPhrase += (j === tabPhrase.length - 1) ? addpointendprase(objMot, maPhrase) : " ";

    }

    return maPhrase;
}

function elementDeclancheur(tabPhrase) {
    let maPhrase = "";

    for (let j = 0; j < tabPhrase.length; j++) {
        let objMot = tabPhrase[j];

        if (objMot.type === "qui" || objMot.type === "adjectif") {
            let index = accordercomplement(tabPhrase[j - 1]);
            maPhrase += objMot.mot[index];
        } else if (objMot.type === "declencheur") {
            maPhrase += objMot.mot;
            maPhrase = ajouteMajuscule(maPhrase);
        } else {
            maPhrase += objMot.mot;
        }

        maPhrase += (j === tabPhrase.length - 1) ? addpointendprase(objMot, maPhrase) : " ";

        if (j === 0) {
            maPhrase += sujet.genre === "2" ? "La " : "Le " + sujet.mot +" ";
        }
    }
    return maPhrase
}

function elementAction(data) {
    let phrase = "";
    if (data[0].type === "verbe3") {
        phrase = "Alors, ";
        sujet.genre === "2" ? (phrase += "la ") : (phrase += "le ");
        phrase += sujet.mot + " ";
    }

    for (let j = 0; j < data.length; j++) {
        let objMot = data[j];
        if (objMot.type === "parole" && data[j - 1].type === "personnage") {
            if (data[j - 1].pluriel === "1") {
                phrase += " qui lui dirent : ";
            } else {
                phrase += " qui lui dit : ";
            }
        }
        if (objMot.type === "objet" && data[j - 1].type === "personnage") {
            if (data[j - 1].pluriel === "1") {
                phrase += " qui lui donnèrent ";
            } else {
                phrase += " qui lui donna ";
            }
        }
        if (objMot.type === "qui" || objMot.type === "adjectif" || objMot.type === "initialisationaction") {
            let index = 0;
            if (objMot.type === "initialisationaction") {
                index = accordercomplement(sujet);
                phrase += objMot.mot[index];
                phrase = ajouteMajuscule(phrase);
            } else {
                index = accordercomplement(data[j - 1]);
                phrase += objMot.mot[index];
            }

        } else {
            phrase += objMot.mot;
        }

        if (objMot.type === "initialisationaction") {
            sujet.genre === "2" ? (phrase += " la ") : (phrase += " le ");
            phrase += sujet.mot + " ";
        }

        if (j === data.length - 1) {
            if (objMot.type === "parole") {
                let tabmot = objMot.mot.split(" ");
                if (tabmot[tabmot.length - 1] !== "?" && tabmot[tabmot.length - 1] !== "!") {
                    phrase += ".";
                }
            } else {
                phrase += ".";
            }
        } else {
            phrase += " ";
        }
    }

    return phrase;
}

// fonction qui met la première lettre d'une chaine en majuscule
function ajouteMajuscule(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addpointendprase(objMot, phrase) {
    if (objMot.type === "parole") {
        let tabmot = objMot.mot.split(" ");
        if (tabmot[tabmot.length - 1] !== "?" && tabmot[tabmot.length - 1] !== "!") {
            phrase += ".";
        }
    } else {
        phrase += ".";
    }
    return phrase;
}

function accordercomplement(objetsujet) {
    let index = 0;
    if (objetsujet.genre === "1") {
        if (objetsujet.pluriel === "1") {
            index = 2;
        } else {
            index = 0;
        }
    }
    if (objetsujet.genre === "2") {
        if (objetsujet.pluriel === "1") {
            index = 3;
        } else {
            index = 1;
        }
    }
    return index;
}

function addPage(page, book) {
    let image = tabImages[Math.floor(tabImages.length * Math.random())];
    // 	First check if the page is already in the book
    if (!book.turn("hasPage", page)) {
        // Create an element for this page
        var element = $("<div />", {
            class: "page " + (page % 2 === 0 ? "odd page-text" : "even page-image"),
            id: "page-" + page
        }).html(
            '<i class="loader"></i>'
        );
        let elText = $("<p />", {class: "text-livre", id: "text-livre"});
        let elImg = $("<img />", {class: "img-livre", id: "img-livre", src: "assets/images/" + image});
        page % 2 === 0 ? element.append(elText) : element.append(elImg);

        // If not then add the page
        book.turn("addPage", element, page);
        // Let's assum that the data is comming from the server and the request takes 1s.
        setTimeout(function () {
            elText.html("");
        }, 1000);
    }
}


function animationTournerLaPage() {
    $("#book").turn("next");
    let currentPage = $("#book").turn("page");
    $("#page-" + currentPage).html("");
}


function animationApparitionText(index) {
    var textWrapper = document.querySelector(".text-livre" + index);
    textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
    anime
        .timeline({loop: false})
        .add({
            targets: ".text-livre" + index + " .letter",
            opacity: [0, 1],
            easing: "easeInOutQuad",
            duration: 500,
            delay: function (el, i) {
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