const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({origin: '*'}));

var histoire1 = require("./histoire1.json");
var excuse = require("./excuse.json");
var excuse2 = require("./excuse2.json");
var sdaDico = require("./sda.json");

const tabsujet =  histoire1.filter((objet)=>{
    return objet.type === "sujet";
});
const tablieu =  histoire1.filter((objet)=>{
    return objet.type === "lieu";
});
const tabqui =  histoire1.filter((objet)=>{
    return objet.type === "qui";
});
const tabverbe =  histoire1.filter((objet)=>{
    return objet.type === "verbe";
});
const tabparole =  histoire1.filter((objet)=>{
    return objet.type === "parole";
});
const tabobjet =  histoire1.filter((objet)=>{
    return objet.type === "objet";
});
const tabadjectif =  histoire1.filter((objet)=>{
    return objet.type === "adjectif";
});

app.get('/histoire/:index/:nbPhrase', function (req, res) {
    console.log("index : ",req.params.index);
    console.log("nbphrase : ",req.params.nbPhrase);
    let phrases = [];

    if(req.params.nbPhrase === "1"){
        let phrase =[];
        if(req.params.index === "1"){
            phrases.push(choosePhrase1(phrase));
        }
        else{
            phrases.push(choosePhrase2(phrase));
        }
    }else{
        if(req.params.index === "1"){
            let phrase1 =[];
            phrases.push(choosePhrase1(phrase1));
            for(let i = 0 ; i < parseInt(req.params.nbPhrase)-1 ; i++){
                let phrase = [];
                phrases.push(choosePhrase2(phrase));
            }
        }else{
            for(let i = 0 ; i < parseInt(req.params.nbPhrase) ; i++){
                let phrase = [];
                phrases.push(choosePhrase2(phrase));
            }
        }

    }
    console.log("phrases",phrases);
    res.send(phrases);

});

function choosePhrase1(phrase){
    let sujet =  tabsujet[Math.floor(tabsujet.length * Math.random())];
    phrase.push(sujet);

    let lieu =  tablieu[Math.floor(tablieu.length * Math.random())];
    phrase.push(lieu);

    let qui =  tabqui[Math.floor(tabqui.length * Math.random())];
    phrase.push(qui);

    return phrase;
}

function choosePhrase2(phrase){

    let verbe =  tabverbe[Math.floor(tabverbe.length * Math.random())];
    phrase.push(verbe);

    let suiteVerbe = verbe.suite;
    switch (suiteVerbe) {
        case 'sujet':
            let sujet =  tabsujet[Math.floor(tabsujet.length * Math.random())];
            phrase.push(sujet);
            break;
        case 'objet':
            let objet =  tabobjet[Math.floor(tabobjet.length * Math.random())];
            phrase.push(objet);
            let adj =  tabadjectif[Math.floor(tabadjectif.length * Math.random())];
            phrase.push(adj);
            break;
        case 'parole':
            let parole =  tabparole[Math.floor(tabparole.length * Math.random())];
            phrase.push(parole);
            break;
    }
    return phrase;
}







const tabsujetFormule = excuse2.filter((objet)=>{
    return objet.type === "formule";
});
const tabsujetExcuse =  excuse2.filter((objet)=>{
    return objet.type === "sujet";
});
const tabverbeExcuse =  excuse2.filter((objet)=>{
    return objet.type === "verbe";
});
const tabobjetExcuse =  excuse2.filter((objet)=>{
    return objet.type === "objet1" || objet.type === "objet2";
});
const tabobjet1Excuse =  excuse2.filter((objet)=>{
    return objet.type === "objet1";
});
const tabobjet2Excuse =  excuse2.filter((objet)=>{
    return objet.type === "objet2";
});
const tabcalificatiftempsExcuse =  excuse2.filter((objet)=>{
    return objet.type === "calificatiftemps";
});
const tabpromesseExcuse =  excuse2.filter((objet)=>{
    return objet.type === "promesse";
});
const tabtempsExcuse =  excuse2.filter((objet)=>{
    return objet.type === "temps";
});
const tabcapaciteExcuse =  excuse2.filter((objet)=>{
    return objet.type === "capacite";
});

app.get('/excuse/:index', function (req, res){
    let excuses = [];
    for(let i=0; i<req.params.index; i++){
        let excuse = [];
        let formule =  tabsujetFormule[Math.floor(tabsujetFormule.length * Math.random())];
        excuse.push(formule);
        let temps =  tabtempsExcuse[Math.floor(tabtempsExcuse.length * Math.random())];
        excuse.push(temps);
        let calificatiftemps =  tabcalificatiftempsExcuse[Math.floor(tabcalificatiftempsExcuse.length * Math.random())];
        excuse.push(calificatiftemps);
        let sujet =  tabsujetExcuse[Math.floor(tabsujetExcuse.length * Math.random())];
        excuse.push(sujet);
        let verbe =  tabverbeExcuse[Math.floor(tabverbeExcuse.length * Math.random())];
        excuse.push(verbe);
        if(verbe.suite.length){
            if(verbe.suite === "objet"){
                let objet =  tabobjetExcuse[Math.floor(tabobjetExcuse.length * Math.random())];
                excuse.push(objet);
            }
            if(verbe.suite === "objet1"){
                let objet1 =  tabobjet1Excuse[Math.floor(tabobjet1Excuse.length * Math.random())];
                excuse.push(objet1);
            }
            if(verbe.suite === "objet2"){
                let objet2 =  tabobjet2Excuse[Math.floor(tabobjet2Excuse.length * Math.random())];
                excuse.push(objet2);
            }
        }
        let capacite =  tabcapaciteExcuse[Math.floor(tabcapaciteExcuse.length * Math.random())];
        excuse.push(capacite);
        let promesse =  tabpromesseExcuse[Math.floor(tabpromesseExcuse.length * Math.random())];
        excuse.push(promesse);

        excuses.push(excuse);
    }
    console.log(tabobjetExcuse);
    res.send(excuses);
});




/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************************************************************************************************************/



app.get('/sda', function (req, res){
    const structurePhrasesda =[
        ["debut", "temps", "sujet", "verbe", "mais"],
        ["sujet", "adj", "qui", "verbe", "car"],
        ["temps", "sujet", "qui", "verbeparole","parole", "lieu"],
        ["debut", "temps", "lieu", "car", "mais"],
        ["temps", "lieu","sujet", "verbe", "mais", "car"],
        ["lieu", "sujet", "verbe", "pour", "mais"],
        ["sujet","verbeparole", "parole", "sujet","verbeparole", "parole", "car"],
        ["lieu", "sujet","verbeparole", "parole", "car", "mais"]
    ];
    let sda = "";
    let structure =  structurePhrasesda[Math.floor(structurePhrasesda.length * Math.random())];

    for (let i = 0; i<structure.length; i++) {
        let tabtype =  sdaDico.filter((objet)=>{
            return objet.type === structure[i];
        });
        let extrait = tabtype[Math.floor(tabtype.length * Math.random())];
        sda += extrait.mot;
        sda += " ";
    }

    res.send(sda);
});


app.listen(5001, function () {
    console.log('Example app listening on port 5001!')
});