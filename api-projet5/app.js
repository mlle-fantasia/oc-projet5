const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({origin: '*'}));

var histoire1 = require("./histoire1.json");

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

app.get('/histoire/:index', function (req, res) {
    console.log(req.params.index);
    let phrase = [];
    if(req.params.index === "1"){

        let sujet =  tabsujet[Math.floor(tabsujet.length * Math.random())];
        phrase.push(sujet);

        let lieu =  tablieu[Math.floor(tablieu.length * Math.random())];
        phrase.push(lieu);

        let qui =  tabqui[Math.floor(tabqui.length * Math.random())];
        phrase.push(qui);

    }
    else{

        let verbe =  tabverbe[Math.floor(tabverbe.length * Math.random())];
        phrase.push(verbe);
        
        let suiteVerbe = verbe.suite;
        console.log(suiteVerbe);
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

            

    }
    res.send(phrase);

});


app.listen(5001, function () {
    console.log('Example app listening on port 5001!')
});