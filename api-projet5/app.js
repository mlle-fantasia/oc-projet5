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
const tabpersonnage =  histoire1.filter((objet)=>{
    return objet.type === "personnage";
});

app.get('/histoire/:index/:nbPhrase', function (req, res) {
    let phrases = [];
    let index =  parseInt(req.params.index);

    for(let i = 1 ; i <= parseInt(req.params.nbPhrase) ; i++){

        if(i === 1 && index === 1){
            let phrase =[];
            phrases.push(choosePhrase1(phrase));
            index++;
        }
        else if( index > 1 && index < 4 ){
            let phrase =[];
            phrases.push(choosePhraseInitialisation(phrase));
            index++;
        }
        else if(index === 4  ){
            let phrase =[];
            phrases.push(choosePhraseDeclencheur(phrase));
            index++;
        }
        else if(index === 5 ){
            let phrase =[];
            phrases.push(choosePhraseAction1(phrase));
            index++;
        }
        else if(index > 5 ){
            let phrase =[];
            phrases.push(choosePhraseAction(phrase));
            index++;
        }

    }

    //console.log("phrases",phrases);
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

function choosePhraseInitialisation(phrase){
    const tabinitialisation =  histoire1.filter((objet)=>{
        return objet.type === "initialisation";
    });
    let motinitialisation =  tabinitialisation[Math.floor(tabinitialisation.length * Math.random())];
    phrase.push(motinitialisation);
    let suite2 = "";
    let motActuel = motinitialisation ;

    while (motActuel.suite){
        let suite = motActuel.suite ;
        let tabSuite =  histoire1.filter((objet)=>{
            return objet.type === suite;
        });
        let motSuite =  tabSuite[Math.floor(tabSuite.length * Math.random())];
        phrase.push(motSuite);
        motActuel = motSuite;

        if(motSuite.suite2){
            suite2 = motSuite.suite2;
        }

    }
    if(suite2.length)
    {let tabSuite2 =  histoire1.filter((objet)=>{
        return objet.type === suite2;
    });
    let motSuite2 =  tabSuite2[Math.floor(tabSuite2.length * Math.random())];
    phrase.push(motSuite2);}

    return phrase;
}

function choosePhraseDeclencheur(phrase){
    const tabDeclencheur =  histoire1.filter((objet)=>{
        return objet.type === "declencheur";
    });
    let motDeclencheur =  tabDeclencheur[Math.floor(tabDeclencheur.length * Math.random())];
    phrase.push(motDeclencheur);

    const tabVerbe2 =  histoire1.filter((objet)=>{
        return objet.type === "verbe2";
    });
    let motVerbe2 =  tabVerbe2[Math.floor(tabVerbe2.length * Math.random())];
    phrase.push(motVerbe2);

    let suite = motVerbe2.suite ;
    let tabSuite =  histoire1.filter((objet)=>{
        return objet.type === suite;
    });
    let motSuite =  tabSuite[Math.floor(tabSuite.length * Math.random())];
    phrase.push(motSuite);

    if(motVerbe2.suite2){
        let suite2 = motVerbe2.suite2;
        let tabSuite2 =  histoire1.filter((objet)=>{
            return objet.type === suite2;
        });
        let motSuite2 =  tabSuite2[Math.floor(tabSuite2.length * Math.random())];
        phrase.push(motSuite2);
    }

    return phrase;
}

function choosePhraseAction1(phrase){
    const tabVerbe3 =  histoire1.filter((objet)=>{
        return objet.type === "verbe3";
    });

    let verbe3 =  tabVerbe3[Math.floor(tabVerbe3.length * Math.random())];
    phrase.push(verbe3);

    let motActuel = verbe3;

    while (motActuel.suite){
        let suite = motActuel.suite ;
        let tabSuite =  histoire1.filter((objet)=>{
            return objet.type === suite;
        });
        let motSuite =  tabSuite[Math.floor(tabSuite.length * Math.random())];
        phrase.push(motSuite);
        motActuel = motSuite;

    }
    if(verbe3.suite2){
        let suite2 = verbe3.suite2;
        let tabSuite2 =  histoire1.filter((objet)=>{
            return objet.type === suite2;
        });
        let motSuite2 =  tabSuite2[Math.floor(tabSuite2.length * Math.random())];
        phrase.push(motSuite2);
    }

    return phrase;
}

function choosePhraseAction(phrase){
    const tabSuite2 = ["qui","parole","objet", "lieu"];
    const tabDebutAction =  histoire1.filter((objet)=>{
        return objet.type === "initialisationaction";
    });
    let debutAction =  tabDebutAction[Math.floor(tabDebutAction.length * Math.random())];
    phrase.push(debutAction);

    let verbe =  tabverbe[Math.floor(tabverbe.length * Math.random())];
    phrase.push(verbe);

    let typeSuite2 =  tabSuite2[Math.floor(tabSuite2.length * Math.random())];

    if(verbe.suite === "personnage"){
        let personnage =  tabpersonnage[Math.floor(tabpersonnage.length * Math.random())];
        phrase.push(personnage);
        console.log(typeSuite2);
        const tabsuite =  histoire1.filter((objet)=>{
            return objet.type === typeSuite2;
        });
        let suite2 =  tabsuite[Math.floor(tabsuite.length * Math.random())];
        phrase.push(suite2);
        console.log(phrase);
    }else {
        let motActuel = verbe;
        while (motActuel.suite) {
            let suite = motActuel.suite;
            let tabSuite = histoire1.filter((objet) => {
                return objet.type === suite;
            });
            let motSuite = tabSuite[Math.floor(tabSuite.length * Math.random())];
            phrase.push(motSuite);
            motActuel = motSuite;
        }
    }
    // if(verbe.suite2){
    //     let suite2 = verbe.suite2;
    //     let tabSuite2 =  histoire1.filter((objet)=>{
    //         return objet.type === suite2;
    //     });
    //     let motSuite2 =  tabSuite2[Math.floor(tabSuite2.length * Math.random())];
    //     phrase.push(motSuite2);
    // }

    return phrase;
}


/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************************************************************************************************************/
/*********************************************************************************************************************/



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