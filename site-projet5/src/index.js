import scriptHistoire from "../bootstrap-webpack-jquery-boilerplate/src/js/script.js";
import scriptExcuse from "../bootstrap-webpack-jquery-boilerplate/src/js/scriptExcuse.js";
import $ from 'jquery';

const tabImages = ["28787901.jpg", "23317214.jpg", "29462393s.jpg", "35245278.jpg"];
const tabCovers = ["livre-enfant-couv.jpg", "bird.jpg", "poule.jpg", "dino.jpg", "loupartiste.jpg", "ecole.jpg"];


$(document).ready(function() {

    $('#alert').click(() => {
        alert('jQuery works!');
    });

    let index = 1;
    let endStory = false;
    let lastPage = 0 ;
    let sujet1 = "";
    let sujet2 = "";
    let sujetAUtiliser = "";
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

        let nbphrase =  $('#nbPhrase').val();

        if (index === 1) {
            await animationTournerLaPage(index);
        }

        let phrase = "";
        if (index === 1) {
            phrase += "Il était une fois ";
        }
        $.ajax({
            type: "GET",
            url: "http://localhost:5001/histoire/" + index +"/"+nbphrase,
            success:  function(response) {
                console.log(response);
                console.log("index1",index);
                for(let i = 0 ; i< response.length; i++){
                    let tabUnePhrase = response[i] ;

                    if (index > 4 && (index - 1) % 4 === 0) {
                        animationTournerLaPage(index);
                    }

                    if (index > 1) {
                        console.log("sujetAUtiliser",sujetAUtiliser);
                        console.log("sujet1",sujet1);
                        console.log("sujet2",sujet2);

                        sujetAUtiliser.genre === "2" ? (phrase += " La ") : (phrase += " Le ");
                        phrase += sujetAUtiliser.mot + " ";
                        if (sujet2) {
                            sujetAUtiliser === sujet1 ? (sujetAUtiliser = sujet2) : (sujetAUtiliser = sujet1);
                        }
                    }
                    console.log(tabUnePhrase);
                    for(let j = 0 ; j< tabUnePhrase.length; j++){
                        let objUnMot = tabUnePhrase[j];


                        if (objUnMot.type === "sujet" && index >1) {
                            if (objUnMot.mot === sujet1.mot) {
                                sujet2 = objUnMot;
                                sujetAUtiliser = sujet2;
                                objUnMot.genre === "2" ? (phrase += "une autre ") : (phrase += "un autre ");
                            } else {
                                objUnMot.genre === "2" ? (phrase += "une ") : (phrase += "un ");
                            }
                        }

                        if (objUnMot.genre && index === 1) {
                            objUnMot.genre === "2" ? (phrase += "une ") : (phrase += "un ");
                            sujet1 = objUnMot;
                            sujetAUtiliser = sujet1;
                        }
                        phrase += objUnMot.mot;
                        if (objUnMot.type === "sujet" && index > 1) {
                            if (objUnMot.mot === sujet1.mot) {
                                let sujet1tmp = sujet1.mot;
                                sujet1.mot = "premier " + sujet1tmp;
                                let sujet2tmp = sujet2.mot;
                                sujet2.mot = "deuxième " + sujet2tmp;
                            }
                        }
                        if (j === tabUnePhrase.length - 1) {
                            let tabmot = objUnMot.mot.split(" ");
                            if (tabmot[tabmot.length - 1] !== "?" && tabmot[tabmot.length - 1] !== "!") {
                                phrase += ".";
                            }
                        } else {
                            phrase += " ";
                        }

                    }

                    index++;
                    console.log("index2",index);
                    let $newPhrase = $("<p class='text-livre text-livre" + index + "'></p>");
                    $(".page-text").append($($newPhrase));
                    $(".text-livre" + index).html(phrase);
                    //animationApparitionText(index);
                    phrase = "";

                    $("#start-story").html("continuer l'histoire");
                }



            }
        });


    });

    $("#previous-page").click(()=>{
        $("#book").turn("previous");
        $("#start-story").prop('disabled', true);
        $('#next-page').prop('disabled', false);
        let currentPage = $("#book").turn("page");
        console.log("currentpage : ",currentPage );
        if(currentPage < 4){
            console.log("currentpage2 : ",currentPage );
            $('#previous-page').prop('disabled', true);
        }
        lastPage +=1;
    });
    $("#next-page").click(()=>{
        $("#book").turn("next");
        $('#previous-page').prop('disabled', false);
        let currentPage = $("#book").turn("page");
        console.log(currentPage);
        console.log(index);
        lastPage -=1;
        if(lastPage === 0){
            $("#start-story").prop('disabled', false);
            $('#next-page').prop('disabled', true);
        }
    });

    $("#end-story").click(()=>{
        console.log("endstory", endStory);
        if(endStory){ //clic sur "nouvelle histoire"

            let cover = tabCovers[Math.floor(tabCovers.length * Math.random())];
            console.log(cover);
            $("#img-livre").attr("src", "assets/images/" + cover);
            $("#end-story").html("Fin de l'histoire");
            $("#start-story").html("Commencer l'histoire");
            $("#start-story").prop('disabled', false);
            $('#next-page').prop('disabled', true);
            endStory = false;
            index =1;

        }else{ //clic sur "fin de l'histoire"
            let currentPage = $("#book").turn("page");
            for(let i =1; i<currentPage;i++){
                $("#book").turn("previous");
            }
            $("#start-story").prop('disabled', true);
            $("#end-story").html("Nouvelle histoire");
            endStory = true;
        }

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

function animationTournerLaPage(index) {
    $("#book").turn("next");
    let currentPage = $("#book").turn("page");
    $("#page-"+currentPage).html("");
    return new Promise((resolve) => {
        $("#book").bind("turned", function(event, page, view) {
            currentPage < 4 ? $('#previous-page').prop('disabled', true): $('#previous-page').prop('disabled', false) ;
            resolve();
        });
    });
}




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
                        if(excuse[i].type === "verbe"){
                            if(excuse[i-1].mot === 'j'){
                                excuse[i].avec === "avoir" ? phraseExcuse += "'ai " : phraseExcuse += "e suis "
                            }else{
                                excuse[i].avec === "avoir" ? phraseExcuse += "a " : phraseExcuse += "est "
                            }

                        }
                        if(excuse[i].type === "capacite"){
                            phraseExcuse += "ainsi, ";
                        }
                        phraseExcuse += excuse[i].mot;

                        if(excuse[i].type === "formule"){
                            if($('#genre').prop('checked')) {
                                if(excuse[i].feminin === "1"){
                                    phraseExcuse += "e";
                                }
                            }
                            phraseExcuse += ",";
                        }
                        if(excuse[i].type === "temps"){
                            console.log(excuse[i].pluriel);
                            excuse[i].pluriel === "1" ? phraseExcuse += " ont été pour moi" : phraseExcuse += " a été pour moi";
                        }
                        if(excuse[i].type === "calificatiftemps"){
                            if(excuse[i-1].genre === "2") phraseExcuse += "e";
                            if(excuse[i-1].pluriel === "1")  phraseExcuse += "s";
                            phraseExcuse += " en effet,";
                        }
                        phraseExcuse += " ";
                    }
                    $('#excuse-text').append('<p>'+phraseExcuse+'</p>');
                    $('#downloadExcuse').html('Générer de nouvelles excuses')
                }

            }
        });
    });

    $('#btn-sda').click(()=>{

        $.ajax({
            type: "GET",
            url: "http://localhost:5001/sda",
            success: function(response) {
                console.log(response);
            }
        })

    })
});

