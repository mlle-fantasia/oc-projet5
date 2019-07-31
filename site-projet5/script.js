$(document).ready(function() {

    let index = 1;

    let sujet1 = "";
    let sujet2 = "";
    let sujetAUtiliser = "";

    $("#start-story").click(async function(){

        let phrase = "";
        if(index === 1){phrase += "Il était une fois "}
        $.ajax({
            type: "GET",
            url: "http://localhost:5001/histoire/"+index,
            success: function (response) {
                if(index > 4 && (index-1) % 4 === 0 ) {
                    animationTournerLaPage();
                }

                console.log(response);
                if(index > 1 ){
                    sujetAUtiliser.genre === "2" ? phrase += " La ":phrase += " Le ";
                    phrase += sujetAUtiliser.mot+" ";
                    if(sujet2) {
                        sujetAUtiliser === sujet1 ? sujetAUtiliser = sujet2 : sujetAUtiliser = sujet1;
                    }
                }
                for(let i=0; i < response.length; i++){
                    if(response[i].type === "sujet" && index > 1 ){
                        if(response[i].mot === sujet1.mot){
                            sujet2 = response[i];
                            sujetAUtiliser = sujet2;
                            response[i].genre === "2"  ? phrase += "une autre " : phrase += "un autre ";
                        }else{
                            response[i].genre === "2"  ? phrase += "une " : phrase += "un ";
                        }

                    }
                    if(response[i].genre && index === 1) {
                        response[i].genre === "2"  ? phrase += "une " : phrase += "un ";
                        sujet1 = response[i];
                        sujetAUtiliser = sujet1;
                    }
                    phrase += response[i].mot;
                    if(response[i].type === "sujet" && index > 1 ){
                        if(response[i].mot === sujet1.mot){
                            let sujet1tmp = sujet1.mot;
                            sujet1.mot = "premier "+sujet1tmp;
                            let sujet2tmp = sujet2.mot;
                            sujet2.mot = "deuxième "+sujet2tmp
                        }
                    }
                    if(i === response.length-1 ){
                        let tabmot = response[i].mot.split(" ");
                        if(tabmot[tabmot.length-1] !== "?" && tabmot[tabmot.length-1] !== "!" ){
                            phrase += ".";
                        }
                    }
                    else{
                        phrase += " ";
                    }
                }
                let $newPhrase = $( "<p class='text-livre text-livre"+index+"'></p>" );
                $(".page-text").append( $( $newPhrase ) );
                $(".text-livre"+index).html(phrase);
                //animationApparitionText(index);
                index ++;
                $("#start-story").html("continuer l'histoire");
            }
        });

    });


});

function animationApparitionText(index){
    var textWrapper = document.querySelector('.text-livre'+index);
    textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
    console.log(textWrapper);
    anime.timeline({loop: false})
        .add({
            targets: '.text-livre'+index+' .letter',
            opacity: [0,1],
            easing: "easeInOutQuad",
            duration: 1000,
            delay: function(el, i) {
                return 100 * (i+1)
            }
        }).add({
        targets: '.text-livre',
        opacity: 0,
        duration: 9999999999999999999999999999,
        easing: "easeOutExpo",

    });
}

function animationTournerLaPage(){
   console.log("page suivante");
}

