const express = require("express");
const cors = require("cors");
const app = express();
const corsOption = {
	origin: true,
	methods: "GET,PUT,POST,DELETE,OPTIONS",
	allowedHeaders:
		"Content-Type, Authorization, Credentials, X-Requested-With, Accept, Content-Length, x-auth-apikey, x-auth-apisecret, x-auth-accesstoken, x-auth-refreshtoken, x-auth-webaccesstoken, x-auth-webrefreshtoken, Access-Control-Allow-Origin",
	credentials: true,
	optionsSuccessStatus: 200,
};
app.options("*", cors(corsOption));
app.use(cors(corsOption));

var fs = require("fs");
var vm = require("vm");

var contentPhrase = fs.readFileSync("./phrase.js");
vm.runInThisContext(contentPhrase);
var contentExcuse = fs.readFileSync("./excuse.js");
vm.runInThisContext(contentExcuse);

var histoire1 = require("./dictionnaires/histoire1.json");
var excuse2 = require("./dictionnaires/excuse2.json");
var sdaDico = require("./dictionnaires/sda.json");
/* var generationphrase = require("./phrase.js"); */

// fait un filtre dans le dictionnaire en fonction du type et choisi un mot au hasard
// renvoie tout l'objet du mot
function chooseMot(type, dico) {
	const tabphrase = dico.filter((objet) => {
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

app.get("/histoire/:numeroPhrase/:nbPhrase", function (req, res) {
	let phrases = [];
	let numeroPhrase = parseInt(req.params.numeroPhrase);

	for (let i = 1; i <= parseInt(req.params.nbPhrase); i++) {
		let objetphrase = {};
		objetphrase.numerodelaPhrase = numeroPhrase;
		if (i === 1 && numeroPhrase === 1) {
			objetphrase.phrase = choosePhrase(["sujet", "lieu", "qui"], numeroPhrase);
		} else if (numeroPhrase > 1 && numeroPhrase < 4) {
			objetphrase.phrase = choosePhrase(["initialisation"], numeroPhrase);
		} else if (numeroPhrase === 4) {
			objetphrase.phrase = choosePhrase(["declencheur"], numeroPhrase);
		} else if (numeroPhrase === 5) {
			objetphrase.phrase = choosePhrase(["verbe3"], numeroPhrase);
		} else if (numeroPhrase > 5) {
			objetphrase.phrase = choosePhrase(["initialisationaction", "verbe", ["qui", "parole", "objet", "lieu"]], numeroPhrase);
		}
		if (objetphrase.phrase) {
			phrases.push(objetphrase);
			numeroPhrase++;
		}
	}
	let lesPhrases = genererLesPhrases(phrases);
	res.send(lesPhrases);
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
		if (!mot.suite) {
			continue;
		}
		let suite2 = "";
		if (mot.suite2) {
			suite2 = mot.suite2;
		}
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
	return phrase;
}

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/************** GENERATEUR EXCUSES ***********************************************************************************/
/*********************************************************************************************************************/
/*********************************************************************************************************************/

app.get("/excuse/:index/:sexe", function (req, res) {
	let excuses = [];
	let sexe = req.params.sexe;
	const tabtypes = ["formule", "temps", "calificatiftemps", "sujet", "verbe", "objet", "capacite", "promesse"];
	let verbe = {};
	for (let i = 0; i < req.params.index; i++) {
		let excuse = [];
		for (let itype = 0; itype < tabtypes.length; itype++) {
			const type = tabtypes[itype];

			if (type === "objet") {
				if (verbe.suite) {
					if (verbe.suite === "objet") {
						const tabobjetExcuse = excuse2.filter((objet) => {
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
	let lesExcuses = genererLesExcuses(excuses, sexe);
	res.send(lesExcuses);
});

/*********************************************************************************************************************/
/*********************************************************************************************************************/
/***************** GENERATEUR SEIGNEUR DES ANNEAUX *******************************************************************/
/*********************************************************************************************************************/
/*********************************************************************************************************************/

app.get("/sda", function (req, res) {
	const structurePhrasesda = [
		["debut", "temps", "sujet", "verbe", "mais"],
		["sujet", "adj", "qui", "verbe", "car"],
		["temps", "sujet", "qui", "verbeparole", "parole", "lieu"],
		["debut", "temps", "lieu", "car", "mais"],
		["temps", "lieu", "sujet", "verbe", "mais", "car"],
		["lieu", "sujet", "verbe", "pour", "mais"],
		["sujet", "verbeparole", "parole", "sujet", "verbeparole", "parole", "car"],
		["lieu", "sujet", "verbeparole", "parole", "car", "mais"],
	];
	let sda = "";
	let structure = structurePhrasesda[Math.floor(structurePhrasesda.length * Math.random())];

	for (let i = 0; i < structure.length; i++) {
		let tabtype = sdaDico.filter((objet) => {
			return objet.type === structure[i];
		});
		let extrait = tabtype[Math.floor(tabtype.length * Math.random())];
		sda += extrait.mot;
		sda += " ";
	}

	res.send(sda);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Example app listening on port 3000!");
});
