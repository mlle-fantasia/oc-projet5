const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({origin: '*'}));

var histoire1 = require("./histoire1.json");
var excuse = require("./excuse.json");

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
    console.log(req.params.index);
    let phrases = [];

    if(req.params.nbPhrase === "1"){
        if(req.params.index === "1"){
            choosePhrase1(phrases);
        }
        else{
            choosePhrase2(phrases);
        }
    }else{
        let phrase1 =[];
        phrases.push(choosePhrase1(phrase1));

        for(let i = 0 ; i < parseInt(req.params.nbPhrase)-1 ; i++){
            let phrase = [];
            phrases.push(choosePhrase2(phrase));
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







const tabsujetFormule = excuse.filter((objet)=>{
    return objet.type === "formule";
});
const tabsujetExcuse =  excuse.filter((objet)=>{
    return objet.type === "sujet";
});
const tabverbeExcuse =  excuse.filter((objet)=>{
    return objet.type === "verbe";
});
const tabobjetExcuse =  excuse.filter((objet)=>{
    return objet.type === "objet";
});
const tabobjet2Excuse =  excuse.filter((objet)=>{
    return objet.type === "objet2";
});

app.get('/excuse/:index', function (req, res){
    let excuses = [];
    for(let i=0; i<req.params.index; i++){
        let excuse = [];
        let formule =  tabsujetFormule[Math.floor(tabsujetFormule.length * Math.random())];
        excuse.push(formule);
        let sujet =  tabsujetExcuse[Math.floor(tabsujetExcuse.length * Math.random())];
        excuse.push(sujet);
        let verbe =  tabverbeExcuse[Math.floor(tabverbeExcuse.length * Math.random())];
        excuse.push(verbe);
        console.log(verbe);
        if(verbe.suite.length){
            let objet =  tabobjetExcuse[Math.floor(tabobjetExcuse.length * Math.random())];
            excuse.push(objet);
            let objet2 =  tabobjet2Excuse[Math.floor(tabobjet2Excuse.length * Math.random())];
            excuse.push(objet2);
        }

        excuses.push(excuse);
    }
    console.log(excuses);
    res.send(excuses);
});


app.listen(5001, function () {
    console.log('Example app listening on port 5001!')
});