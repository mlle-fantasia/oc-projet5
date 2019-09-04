const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));

var histoire1 = require("./histoire1.json");
var excuse2 = require("./excuse2.json");
var sdaDico = require("./sda.json");

// fait un filtre dans le dictionnaire en fonction du type et choisi un mot au hasard
// renvoie tout l'objet du mot
function chooseMot(type, dico) {
	const tabphrase = dico.filter(objet => {
		return objet.type === type;
	});
	let mot = tabphrase[Math.floor(tabphrase.length * Math.random())];
	return mot;
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/***************** GENERATEUR HISTOIRE *******************************************************************************/
/*********************************************************************************************************************/
/*********************************************************************************************************************/

app.get("/histoire/:numeroPhrase/:nbPhrase", function(req, res) {
	let phrases = [];
	let numeroPhrase = parseInt(req.params.numeroPhrase);

	for (let i = 1; i <= parseInt(req.params.nbPhrase); i++) {
		if (i === 1 && numeroPhrase === 1) {
			phrases.push(choosePhrase(["sujet", "lieu", "qui"], numeroPhrase));
            numeroPhrase++;
		} else if (numeroPhrase > 1 && numeroPhrase < 4) {
			phrases.push(choosePhrase(["initialisation"], numeroPhrase));
            numeroPhrase++;
		} else if (numeroPhrase === 4) {
			phrases.push(choosePhrase(["declencheur"], numeroPhrase));
            numeroPhrase++;
		} else if (numeroPhrase === 5) {
			phrases.push(choosePhrase(["verbe3"], numeroPhrase));
            numeroPhrase++;
		} else if (numeroPhrase > 5) {
			phrases.push(choosePhrase(["initialisationaction", "verbe", ["qui", "parole", "objet", "lieu"]], numeroPhrase));
            numeroPhrase++;
		}
	}

	res.send(phrases);
});

function choosePhrase(types, index) {
	let phrase = [],
		continuer = true;
	for (let itype = 0; itype < types.length; itype++) {
		if (!continuer) break;
		let type = types[itype];
		if (Array.isArray(type)) {
			type = type[Math.floor(type.length * Math.random())];
		}
		let mot = chooseMot(type, histoire1);
		phrase.push(mot);
		if (mot.suite) {
			let suite2 = "";
			let motActuel = mot;
			if (index > 5 && motActuel.suite !== "personnage" && type === "verbe") {
				continuer = false;
			}
			while (motActuel.suite) {
				let motSuite = chooseMot(motActuel.suite, histoire1);
				phrase.push(motSuite);
				motActuel = motSuite;

				if (motSuite.suite2) {
					suite2 = motSuite.suite2;
				}
			}
			if (suite2.length) {
				let motSuite2 = chooseMot(suite2, histoire1);
				phrase.push(motSuite2);
			}
		}
	}
	return phrase;
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/************** GENERATEUR EXCUSES ***********************************************************************************/
/*********************************************************************************************************************/
/*********************************************************************************************************************/

app.get("/excuse/:index", function(req, res) {
	let excuses = [];
	const tabtypes = ["formule", "temps", "calificatiftemps", "sujet", "verbe", "objet", "capacite", "promesse"];
	let verbe = {};
	for (let i = 0; i < req.params.index; i++) {
		let excuse = [];
		for (let itype = 0; itype < tabtypes.length; itype++) {
			const type = tabtypes[itype];

			if (type === "objet") {
				if (verbe.suite) {
					if (verbe.suite === "objet") {
						const tabobjetExcuse = excuse2.filter(objet => {
							return objet.type === "objet1" || objet.type === "objet2";
						});
						let objet = tabobjetExcuse[Math.floor(tabobjetExcuse.length * Math.random())];
						excuse.push(objet);
					} else {
						let suite = verbe.suite;
						excuse.push(chooseMot(suite, excuse2));
					}
				}
			} else {
				let mot = chooseMot(type, excuse2);
				if (type === "verbe") {
					verbe = mot;
				}
				excuse.push(mot);
			}
		}

		excuses.push(excuse);
	}

	res.send(excuses);
});

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/***************** GENERATEUR SEIGNEUR DES ANNEAUX *******************************************************************/
/*********************************************************************************************************************/
/*********************************************************************************************************************/

app.get("/sda", function(req, res) {
	const structurePhrasesda = [
		["debut", "temps", "sujet", "verbe", "mais"],
		["sujet", "adj", "qui", "verbe", "car"],
		["temps", "sujet", "qui", "verbeparole", "parole", "lieu"],
		["debut", "temps", "lieu", "car", "mais"],
		["temps", "lieu", "sujet", "verbe", "mais", "car"],
		["lieu", "sujet", "verbe", "pour", "mais"],
		["sujet", "verbeparole", "parole", "sujet", "verbeparole", "parole", "car"],
		["lieu", "sujet", "verbeparole", "parole", "car", "mais"]
	];
	let sda = "";
	let structure = structurePhrasesda[Math.floor(structurePhrasesda.length * Math.random())];

	for (let i = 0; i < structure.length; i++) {
		let tabtype = sdaDico.filter(objet => {
			return objet.type === structure[i];
		});
		let extrait = tabtype[Math.floor(tabtype.length * Math.random())];
		sda += extrait.mot;
		sda += " ";
	}

	res.send(sda);
});

const port = process.env.PORT || 5001;
app.listen(port, function() {
	console.log("Example app listening on port 5001!");
});
